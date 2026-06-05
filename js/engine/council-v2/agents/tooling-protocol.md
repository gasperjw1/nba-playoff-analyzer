# Tooling Protocol — Shared Across All Council Agents

All Council agents have access to a tiered set of research tools.
Use the LEAST EXPENSIVE tier that gets the job done, escalate only when needed.

## Tool Tiers (cheapest → most expensive)

### Tier 1 — Local file reads (free, instant)
- `Read js/data/external-research.js` (verified findings DB)
- `Read js/data/series-data.js` (boxScores, game data, predictions)
- `Read js/data/qualitative-signals.js` (user observations)
- `Read js/data/chs-lab-ledger.js` (projection numbers)
- `Read js/data/prediction-ledger.js` (prior predictions vs outcomes)
- `Bash` for computations on local data (e.g., margin distributions)

USE FIRST. If your claim can be backed by local data, never escalate.

### Tier 2 — WebSearch (cheap, near-instant)
- `WebSearch <query>` for finding articles, recent news, broad context
- Returns: list of links + brief summaries

USE when you need fresh news (post-G1 analyst reactions, injury updates,
DK line movements) that isn't in the local research DB.

### Tier 3 — WebFetch (cheap, ~5-15 sec per page)
- `WebFetch <url> <prompt>` to extract specific info from an article
- Returns: AI-summarized content from the page

USE when:
- You found a relevant link via WebSearch and need specific quotes/stats
- You need to verify a citation (does the URL exist? does it say what's quoted?)
- The page is mostly static HTML

DON'T USE FOR:
- JavaScript-heavy pages (DraftKings, ESPN dynamic dashboards) — they don't render
- Authenticated sites (login walls)
- Pages that timeout repeatedly

### Tier 4 — Claude in Chrome (expensive, ~15-30 sec per action)
- `mcp__Claude_in_Chrome__navigate <url>` — opens page in real browser
- `mcp__Claude_in_Chrome__read_page` — extracts text from rendered DOM
- `mcp__Claude_in_Chrome__javascript_tool` — runs JS for advanced extraction
- `mcp__Claude_in_Chrome__find` — locates elements on the page
- `mcp__Claude_in_Chrome__get_page_text` — full text dump

USE when WebFetch fails for one of these reasons:
- Page is JS-heavy and WebFetch returned no content
- DraftKings live odds (need to interact with the UI)
- ESPN stat dashboards (require rendering)
- The data is in a table that needs scrolling/clicking to expose

ESCALATION: If you tried WebFetch and got "no content" or empty result,
escalate to Claude in Chrome. Don't abandon the verification.

### Tier 5 — Request user approval (rare)
- For paywalled content, authenticated dashboards, or links you don't
  feel confident accessing on your own.
- Output in your essay: `NEEDS_USER_APPROVAL: <url> for <reason>`
- The user will manually fetch and provide the content.

USE ONLY when:
- Tiers 1-4 all failed
- The claim CANNOT be verified by any other source
- The claim is CRITICAL to your thesis (don't waste user time on minor claims)

## Examples

GOOD — escalation discipline:
```
1. Read external-research.js looking for Wemby Q4 fatigue evidence ✓ found
2. (No need to escalate further)
```

GOOD — appropriate escalation:
```
1. Read external-research.js — Brown halftime adjustment data not present
2. WebSearch "Mike Brown halftime adjustments Knicks 2026" → found ESPN article URL
3. WebFetch that URL with prompt "what specific Q1→Q2 adjustments did Brown make"
   → got the SAS fastbreak 24→9 H2 numbers
4. Cite in essay: [ESPN, URL, specific quote]
```

GOOD — Chrome escalation when needed:
```
1. WebFetch DraftKings.com for current SAS-NYK G2 line → empty content (JS-heavy)
2. Escalate to Claude in Chrome:
   - mcp__Claude_in_Chrome__navigate https://draftkings.com/...
   - mcp__Claude_in_Chrome__read_page
3. Got the current line.
```

GOOD — user approval as last resort:
```
1-4. Tried local, WebSearch, WebFetch, Chrome — all failed
5. Output in essay: "NEEDS_USER_APPROVAL: https://nba.com/stats/lineups
   for SAS Wemby+Kornet shared-court net rating. This stat is critical
   to my fatigue thesis and I could not extract it via any tier."
```

BAD — skipping tiers:
```
1. Want Brown adjustment data → immediately call Claude in Chrome
   ✗ Should have tried WebFetch first
```

BAD — giving up too early:
```
1. WebFetch failed → just claim "no evidence available"
   ✗ Should have escalated to Chrome
```

## Reporting Tool Usage in Essays

Every cited source should include WHICH TIER was used to verify it:

```
[Citation, source URL, Tier 3 (WebFetch) verified]
[Local data: js/data/external-research.js entry 2, Tier 1 verified]
[ESPN URL, Tier 4 (Chrome) — required JS rendering]
[NEEDS_USER_APPROVAL: <url>]
```

This lets the fact-checker know what was attempted and the synthesizer
weight evidence by verification depth.
