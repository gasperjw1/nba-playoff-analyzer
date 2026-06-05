# Council v2 — Essay-Based Multi-Round Deliberation

## Architecture (Updated for Claude Code Subagents + Fact-Check Loop)

Each Council agent is a **Claude Code subagent** (spawned via the Agent tool or via Workflow orchestration), not an external Anthropic API call. This means:
- Zero incremental API cost (uses Claude Code's existing infrastructure)
- Native tool access: WebSearch, WebFetch, Read, Bash
- Parallel spawn via Workflow tool
- Per-round persona enforced via system-prompt loading from `agents/*.md`

After each essay generation round, a **Fact-Check Agent** verifies every claim against:
- Local evidence DB (`js/data/external-research.js`, `series-data.js`, etc.)
- Live web verification (WebFetch on cited URLs)

### Fact-Check Loop Termination (Bounded)

The loop is provably finite via multiple safeguards (not just N=3 retry cap):

| Exit condition | Trigger | Synthesis treatment |
|---|---|---|
| **PASS** | ≥80% verified, no fabrications | Full weight |
| **HARD_FAIL: stubborn_fabrication** | Same fabricated claim re-asserted across ≥2 attempts | Drop essay entirely |
| **HARD_FAIL: whack_a_mole** | New fabrications introduced while old ones unfixed (after attempt 2) | Redact unverified, reduce weight |
| **HARD_FAIL: diminishing_returns** | Verification rate decreases across attempts | Keep last attempt's verified content, low confidence |
| **HARD_FAIL: attempt_limit_exceeded** | 3 attempts, still < 80% verified | Redact + low confidence |
| **RETRY_FACTCHECK** | > 30% unverifieds due to tool-failures (WebFetch timeouts) | Re-run fact-check, no essay rewrite needed |

Additional global safeguards:
- **Per-essay max cost cap**: 8 subagent calls (1 original + 1 check + 3 rewrites + 3 rewrite-checks)
- **Per-round max cost cap**: 64 subagent calls (8 essays × 8)
- **Per-deliberation max cost cap**: 5 rounds × 64 + 1 synthesizer = 321 calls
- **Workflow tool global cap**: 1000 agents per workflow run (hard ceiling, prevents runaway)
- **Meta-check on the fact-checker**: every Nth deliberation, a second fact-checker spot-audits the first to catch fact-checker hallucinations

## Round Structure (with Fact-Check Loop)

```
ROUND 1: INITIAL ESSAYS
  ▸ 8 agents in parallel write 400-600 word essays (Claude Code subagents)
  ▸ 8 fact-checkers in parallel verify each essay
  ▸ For each FAIL_REWRITE: re-spawn original agent with feedback
  ▸ Loop until all PASS or max 3 attempts each

ROUND 2: REBUTTAL (each agent reads all 7 others' essays)
  ▸ 8 agents in parallel write structured rebuttals
  ▸ 8 fact-checkers verify rebuttal claims (especially counter-evidence)
  ▸ Same rewrite loop as Round 1

ROUND 3: REVISION
  ▸ 8 agents in parallel write revised essays incorporating rebuttals
  ▸ 8 fact-checkers verify
  ▸ Rewrite loop

ROUND 4: REFLECTION
  ▸ 8 agents in parallel write self-reflection on how others received them
  ▸ Light fact-check (reflection is mostly metacognitive, fewer empirical claims)

ROUND 5: SYNTHESIZER
  ▸ 1 synthesizer agent reads ALL 32 essays + 24 fact-check reports
  ▸ Produces: win probabilities, player projections, spread + total picks,
    parlay recommendations with correlation reasoning, analytics data
```

## Orchestration

Two implementation paths:

### Path A — Conversational (recommended for iterative development)
- I (Claude Code main loop) orchestrate via Agent tool
- One round at a time, user can review essays as they emerge
- Easy to debug, iterate on prompts
- Slow (one round per conversation turn)

### Path B — Workflow tool (recommended for production)
- Single Workflow script orchestrates all 5 rounds
- Agents run in parallel within rounds
- Fact-check loop runs automatically (up to 3 rewrites per essay)
- Returns full deliberation document
- Fast (~5-10 min for full 5-round deliberation)

For first run on SAS-NYK G2, use Path A to validate quality. Convert to Path B once stable.

## File Layout

```
js/engine/council-v2/
  README.md                     ← this file
  agents/
    fatigue-agent.md            ← Council agent personas
    matchup-agent.md
    coaching-agent.md
    momentum-agent.md
    market-agent.md
    historical-agent.md
    spread-value-agent.md
    risk-agent.md
    fact-checker.md             ← NEW: verifies every essay
  workflows/
    council-v2-full.js          ← (next session) Workflow script for full 5-round
  research-bundles/             ← per-deliberation, per-agent pre-fetched evidence
    SAS-NYK-G2-2026-06-05/
      fatigue.md
      matchup.md
      ...
  deliberations/                ← output: full deliberation docs
    SAS-NYK-G2-2026-06-05/
      round1/
        fatigue-essay.md
        fatigue-factcheck.md
        ...
      round2/...
      ...
      synthesis.md              ← final analytics + bet recs
```

## Cost / Latency (Updated)

- **Subagent calls per game**: 8 essays × 4 rounds × ~1.5 rewrites avg = ~48 calls + 32 fact-checks + 1 synthesizer = **~81 subagent invocations**
- **Token cost**: Approximate, depends on Claude Code billing model — but uses existing Claude Code allowance, not separate API billing
- **Wall-clock latency**:
  - Path A (conversational): ~30-60 min total across multiple conversation turns
  - Path B (Workflow): ~5-10 min in one orchestrated run

## Anti-Bias Design (Strengthened)

1. **Fact-check gauntlet**: every claim must be verifiable. Fabricated citations get rejected.
2. **Distinct system prompts**: agents have different methodologies, not just different labels
3. **Required evidence citations**: prompts enforce "no claim without source"
4. **Structured rebuttal format**: agents can't politely agree; must declare acceptance weight + counter-evidence
5. **Reflection prompts catch defensiveness**: explicit "was the criticism fair?" question
6. **Synthesizer is impartial**: weighs by structured fields (confidence × evidence count × signal calibration), not narrative charisma
7. **Rewrite forces grounding**: agents whose claims fail verification CANNOT proceed without re-grounding them

## Integration with Phase 75 Council v1

- **v1 stays useful** for fast / mechanical pre-computation on every game
- **v2 reserved for high-leverage spots**: Finals games, playoff elimination games, large-edge plays
- **v1's prediction-ledger records v2's synthesis output**: empirical calibration accumulates from BOTH councils
- **v2's research-bundles feed back into external-research.js**: every new verified citation expands the shared evidence DB

## Tooling Notes

- **Available subagent types**: `general-purpose` is the default for Council agents (they need full tool access). `Explore` for fact-checkers if research is read-only.
- **Workflow tool**: orchestrates the 5-round pipeline deterministically with parallelism per round.
- **Custom agent definitions**: could later live in `.claude/agents/*.md` if we want user-invokable shortcuts (e.g., `/council-deliberate SAS-NYK-G2`).
