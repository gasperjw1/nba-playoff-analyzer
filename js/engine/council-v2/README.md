# Council v2 — Essay-Based Multi-Round Deliberation

## Architecture

Each agent is a Claude API call with:
- **Persona system prompt** (distinct methodology + perspective)
- **Evidence bundle** (pre-curated from external-research.js + game data + targeted web search)
- **Round-specific input** (own prior essay + other agents' essays for Rounds 2-4)
- **Structured output** (markdown essay + JSON fields for synthesizer)

## Round Structure

```
ROUND 1 — INITIAL ESSAY (parallel, 8 calls)
  Each agent writes a 400-600 word essay independently:
    - Thesis statement
    - 5-8 specific evidence citations
    - Per-player projections (top 4 each side)
    - Team execution narrative (Q1 / Q2-Q3 / Q4 expectations)
    - Confidence + bet recommendations
    - "What would change my mind"

ROUND 2 — REBUTTAL (parallel, 8 calls)
  Each agent reads ALL 7 other essays.
  Writes structured rebuttal:
    - Per-other-agent acceptance weight (0-1) with reasoning
    - Counter-evidence for rejected claims (cite sources)
    - Updated own confidence
  Optionally triggers fresh web search if rebuttal requires new evidence.

ROUND 3 — REVISION (parallel, 8 calls)
  Each agent reads: own R1 essay + own R2 rebuttals + others' R2 rebuttals to them.
  Writes REVISED essay:
    - Refined thesis (with explicit changes from R1)
    - Updated projections (with reasoning for shifts)
    - Acknowledged uncertainties
    - Final positional recommendation

ROUND 4 — REFLECTION (parallel, 8 calls)
  Each agent sees: how others received their R3 essay.
  Writes self-reflection:
    - "Why did agent X agree/disagree with me?"
    - "Was their criticism fair?"
    - "What would I do differently?"
    - Final calibrated confidence

ROUND 5 — SYNTHESIS (1 call, master synthesizer)
  Reads ALL 32 essays + reflections.
  Produces:
    - Game prediction summary
    - Win probability per team (with CI)
    - Spread + total recommendations
    - Per-player projection cards (PTS/REB/AST/3PM with ranges)
    - 2-3 parlay recommendations with leg-correlation reasoning
    - Confidence-graded bet sizing
    - Analytics data (agreement matrix, projection variance, evidence density)
```

## File Layout

```
js/engine/council-v2/
  README.md                     ← this file
  orchestrator.js               ← runs the 5-round pipeline
  synthesizer.js                ← Round 5 aggregation
  evidence-curator.js           ← per-agent pre-fetch from external-research.js + web
  agents/
    fatigue-agent.md            ← system prompt + methodology
    matchup-agent.md
    coaching-agent.md
    momentum-agent.md
    market-agent.md
    historical-agent.md
    spread-value-agent.md
    risk-agent.md
  research-bundles/             ← per-deliberation, per-agent evidence
    SAS-NYK-G2-2026-06-05/
      fatigue.json
      matchup.json
      ...

test-council-v2.js              ← CLI: node test-council-v2.js --game SAS-NYK-G2
```

## Cost / Latency Estimate (per game)

- 8 agents × 4 rounds + 1 synthesis = 33 Claude API calls
- ~2K input + 600 output per call avg = ~$0.014/call
- Total: ~$0.45 per game
- Latency: ~3-5 min total (parallelizable within rounds)

## Anti-Bias Design Choices

1. **Distinct system prompts** — each agent forced into a specific methodology, not just a different label on the same reasoning
2. **Required evidence citations** — each claim must reference external-research.js entry or pre-bundle finding
3. **Structured rebuttal format** — agents can't politely agree; they must declare acceptance weight + counter-evidence
4. **Reflection prompts** — agents asked to honestly assess if criticism was fair (not defend their original position)
5. **Synthesizer is impartial** — reads ALL essays without favoring any agent; flags genuine disagreement vs noise

## What Council v1 Does That v2 Subsumes

- v1's `js/engine/council.js` 8 agents = still useful as MECHANICAL pre-computation
- v2 essays incorporate v1's structured verdicts as one input
- v1's signal-calibration → applied to v2's final synthesis weights
- v1's prediction-ledger → records v2's synthesized output for empirical calibration

The two coexist: v1 is fast + mechanical (every game, cheap),
v2 is rigorous + slow (big games, $0.45 each).
