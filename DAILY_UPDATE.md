# DAILY UPDATE — Morning Routine

This is the canonical morning checklist for keeping the NBA Playoff
Analyzer in sync with reality. Run it each morning before tip-off so
the deployed site reflects yesterday's results, today's slate, and
current odds.

A scheduled task can fire this prompt at a chosen time (typically 9 AM
ET, after morning injury reports drop). If running manually, paste this
prompt into a fresh Claude Code session.

---

## 0 · Preflight

```
- Confirm working directory is the project root
- Confirm git status is clean (no uncommitted local changes)
- Confirm `node test-projections.js` passes baseline before any edits
- Note today's date in YYYY-MM-DD form for use throughout
```

If any preflight fails, **stop and report** rather than power through.
Stale local edits + an automated commit pipeline is how you accidentally
deploy half-finished work.

---

## 1 · Bump `CURRENT_DATE`

`js/data/constants.js` has the `CURRENT_DATE` constant that drives the
home-page "Tonight" filter, the bets-page "today's parlays" filter, the
TEST 10 stale-label linter, and the page subtitle.

```
- Read js/data/constants.js
- Update CURRENT_DATE to today's YYYY-MM-DD
- Save
```

---

## 2 · Resolve overnight game results

For each series whose game finished overnight:

```
- Read coverage from a primary source (NBA.com box score, ESPN game page)
- In js/data/series-data.js, locate series.games[N] for that game
- Set winner, homeScore, awayScore, notes (1-2 sentences key facts)
- Add boxScores: { home: [...], away: [...] } using the standard shape
  (look at any prior game with boxScores for the schema)
- Watch for the duplicate-key trap: if you find an existing `result:` or
  `winner:` field, REPLACE it — do not add a new one. JS silently uses
  the last duplicate and TEST 7 will only catch it after the fact.
```

For each unresolved BET whose game now has results:

```
- Run reconcileAllBets in your head or via:
    node -e "const v=require('./test-projections.js'); …"
  Realistically: reload the deployed page and check the browser console.
  The boot hook surfaces "auto-fillable" bets with the computed outcome.
- For each auto-fillable bet, find the entry in js/data/bets-data.js
  and set `result: { outcome:'win'|'loss'|'push'|'void', actual:'...' }`
- DO NOT add a duplicate result key. Replace the existing `result: null`
  or whatever's there.
- Props that the auto-resolver couldn't parse (conditional language,
  unusual wording) need manual outcome calls.
```

The reconciliation TEST 9 will fail if any declared outcome disagrees
with the box score, so you'll catch typos before pushing.

---

## 3 · Look up today's lines on DraftKings

The bets in `bets-data.js` were priced when posted. If the line moved
significantly overnight, the displayed odds will be wrong.

```
- Open DraftKings (or use a public odds aggregator) for each game
  on tonight's slate. Capture: ML, spread, total, and the relevant
  player props used in BETS / FEATURED_PARLAYS.
- For each entry, update `odds` and `facts` if the line moved by more
  than ~5%. Mark big moves explicitly (e.g. "-260 → -450 (re-priced)")
  so the reasoning stays honest.
- Alt-line odds in FEATURED_PARLAYS are estimates — verify combined
  payout calculation if one leg's juice changed materially.
- Flip Over → Under (or vice versa) when the line crosses the engine's
  projection.
```

---

## 4 · Update predictions for tonight's games

Engine output already auto-derives, but `prediction.reasoning` and
`tacticalAdjustments` are hand-authored.

```
- For each tonight's series, read the engine's blended projection:
    Open the deployed page, hover over the projection lineage card
    on the series page, OR run calcBlendedProjection in console
- If the predicted winner / margin / character changed materially
  (>3pt margin shift, or character flips between SEPARATION /
  COMPETITIVE / GRIND), update prediction.reasoning to explain WHY
- Inject any G2 takeaways the model didn't see (e.g. "PHI started
  double-teaming Brunson on PnRs in G1; we expect the same in G3
  with even more aggression"). These belong in keyTakeaways[].
- Don't hand-author homeScore/awayScore/margin if the engine already
  produced them — let the engine drive the numbers, and use prose to
  add context.
```

---

## 5 · Featured Parlays for today

```
- In js/data/bets-data.js, find FEATURED_PARLAYS.
- Confirm at least 3 entries with date === CURRENT_DATE.
- At least 2 should be category:'floor', sized to clear the
  80%+ combined hit-rate bar (per leg, then product).
- At least 1 category:'traditional' (value play; OK at 60-70%).
- Note alt-line juice estimates honestly — never claim a deep alt
  line that doesn't exist on DK.
```

---

## 6 · Sweep stale labels

```
- Run the linter manually:
    grep -rE "(May|Jun|Jul|Aug)\s+[0-9]+" js/data/bets-data.js js/ui/bets.js js/ui/home.js
  Look for any "TONIGHT (May N)" / "TODAY: ..." / "Wed May N" strings
  that don't match CURRENT_DATE.
- TEST 10 catches most of these automatically, but the linter has a
  ±10 line context window — manually verify section headers and
  banner copy that may not be near archive markers.
```

---

## 7 · Run the test suite

```
- node test-projections.js
- Expected: "RESULTS: 3481 passed, 0 failed" (or higher if new
  regression guards have been added).
- TEST 9 will fail if any declared bet result disagrees with box
  score reality. TEST 10 will fail on stale TODAY/TONIGHT labels.
- Do not push if anything is failing. Investigate root cause —
  never bypass with --no-verify.
```

---

## 8 · Update CONTEXT.md (if anything notable)

```
- New phase entry if the engine, ratings, or scenarios changed
- Bug-fix retrospective entry if a duplicate-key or schema error
  was caught by validators / tests
- Refresh "Last updated" line at the top
- Series Status table refresh (current standings, who's eliminated)
```

Skip if today was purely "record results, update odds, push" — that's
not phase-worthy.

---

## 9 · Commit & deploy

```
- git status to review the change set
- git add only the specific files you touched (NEVER `git add -A`,
  it can pull in stray .tmp / lock files / editor swap files)
- git commit with a descriptive message ending with the standard
  Co-Authored-By trailer
- git push to the working branch
- Fast-forward main:
    git -C <main-worktree> pull --ff-only origin <branch>
    git -C <main-worktree> push origin main
- Verify GitHub Pages picked up the deploy:
    Open https://gasperjw1.github.io/nba-playoff-analyzer/?bust=N
    (bump N each run to bust the CDN cache)
```

---

## 10 · Sanity-check the deployed page

```
- Home page Tonight section shows correct games for today's date
- Featured Parlays section shows ≥3 floor parlays for today
- Bets page subtitle reads "TODAY (YYYY-MM-DD): ..." with right slate
- Per-series tabs show correct active game (G1/G2/G3 …) per series
- Open browser console — no [validators] or [auto-resolve] errors
```

If the validation banner shows up at the top of the page, **fix the
underlying schema issue and redeploy** rather than dismissing it. The
banner is the last line of defense before users see broken data.

---

## Failure modes to watch for

- **Empty per-series tab**: means BETS has no entries for that
  series's active game. Either you forgot to add today's bets, or the
  active-game derivation is off. Check `series.games[N-1].winner` —
  if it's prematurely set, the active game advances too far.
- **`auto-fillable` bets in the console after push**: you forgot to
  fill in a result. Reopen `bets-data.js`, find the bet by id, and
  add the result entry.
- **Validation banner**: a schema error landed despite tests passing.
  Most likely cause: you edited a file the test runner doesn't load
  (e.g. a bets.js literal that violated something). Read the banner
  text and fix the specific field it names.
- **Stale FEATURED_PARLAYS**: today shows yesterday's parlays because
  you forgot to update `date` fields. The home page filters strictly
  by `CURRENT_DATE` — if dates don't match you get an empty grid.

---

## When to **NOT** run this checklist

- During a series midway through G1 (no overnight results yet —
  nothing changes day-to-day except line moves)
- When the user has explicitly told you to pause automated updates
- When you suspect data corruption (banner errors, duplicate keys,
  contradictory predictions). In that case: surface the issue to the
  user, do not auto-fix.
