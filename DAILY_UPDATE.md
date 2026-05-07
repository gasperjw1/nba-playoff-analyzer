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

### 0a · Skip-early on no-games days

```
- Read js/data/constants.js to get CURRENT_DATE
- Grep BET_SLATES in js/data/bets-data.js for any game whose `date`
  matches CURRENT_DATE OR matches today's date if CURRENT_DATE is stale
- If no game scheduled for today AND no game scheduled for yesterday
  (whose results would need recording), exit cleanly:
    "No games scheduled for {today}; nothing to update. Exiting."
```

This avoids burning through the full checklist on off-days (between
rounds, off-days within a series, post-elimination).

### 0b · Dry-run mode (first-run safety)

```
- If `.daily-task-dry-run` exists at the project root:
    Run the full checklist BUT replace the final `git push` step with:
      git status --short
      git diff HEAD~1 --stat
      git log -1 --format="%s%n%n%b"
    Then STOP and report: "DRY RUN — committed locally as <hash>. Review
    above. Delete .daily-task-dry-run to enable auto-push for next run."
- If `.daily-task-dry-run` does NOT exist:
    Run normally (auto-commit + auto-push).
```

The sentinel file `.daily-task-dry-run` lives in the worktree (untracked
on purpose — it's per-machine). Delete it after one successful manual
review cycle to switch to auto-deploy mode.

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

## 3 · Create today's BETS entries (when a series advances)

When a series finishes G2 and rolls forward to G3, the per-series tab
on the deployed page will show `G3 upcoming` but the bet list will be
empty until G3 entries land in `bets-data.js`. Create them.

```
- For each series whose active game number incremented today:
    Add 4-6 entries to BETS in js/data/bets-data.js with:
      slate:'R2-G{N}', series:'XXX-YYY', game:N, postedAt:CURRENT_DATE
      type: 'ml' | 'spread' | 'total' | 'prop'
      pick: human-readable pick string the auto-resolver can parse
            (see js/engine/auto-resolve.js for accepted formats)
      odds: from DK (best effort — see step 4 caveats)
      facts: structured supporting numbers
      reasoning: prose tying the engine projection to the pick
      confidence: 'best-bet' | 'high' | 'medium' | 'lean' | 'coin-flip'
      thesis: ['model', 'matchup', ...] tags
      result: null
- Watch for the validators (TEST 8) — they'll reject a missing or
  mistyped field at the boot banner.
- Adding a BET that mirrors an existing slate's pattern is the fastest
  way to get the schema right (search for a matching `type` and copy).
```

If no series advanced today, skip this step — yesterday's BETS are
still the active set.

## 4 · Look up today's lines on DraftKings

The bets in `bets-data.js` were priced when posted. If a line moved
significantly overnight, the displayed odds will be wrong.

```
- Use WebSearch (not WebFetch — DK is JS-heavy and geo-blocked) to
  find current lines: "draftkings <team> ml playoff" or similar.
- For each MAIN line on today's slate (ML, spread, total) — confirm
  current odds and update `odds` + `facts` if it moved more than ~5%.
- Alt-line prop odds (deep alts like "Cade O4.5 ast", "SGA O22.5 pts"
  used in Floor parlays) are NOT reliably scrapeable. Treat the alt
  juice estimates in FEATURED_PARLAYS as approximations and keep the
  "verify on DK before placing" notes intact — that's a feature, not
  a bug, since the live combined payout will only be exact at place
  time.
- Flip Over → Under (or vice versa) when the line crosses the engine's
  projection. Mark big moves explicitly: "-260 → -450 (re-priced)".
```

**Honest limitation:** The agent can't replace your eyes on DK at
slip-build time. It can keep main-line odds fresh and flag big alt-line
moves the user notices, but the alt juice is best-effort.

---

## 5 · Update predictions for tonight's games

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

## 6 · Featured Parlays for today

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

## 7 · Sweep stale labels

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

## 8 · Run the test suite

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

## 9 · Update CONTEXT.md (if anything notable)

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

## 10 · Commit & deploy

```
- git status to review the change set
- git add only the specific files you touched (NEVER `git add -A`,
  it can pull in stray .tmp / lock files / editor swap files)
- git commit with a descriptive message ending with the standard
  Co-Authored-By trailer
```

**If `.daily-task-dry-run` exists** (first-run safety from step 0b):
```
- DO NOT push. Instead:
    git status --short
    git diff HEAD~1 --stat
    git log -1 --format="%s%n%n%b"
- Report: "DRY RUN — committed locally as <hash>. Review the diff,
  then `rm .daily-task-dry-run` and re-run to enable auto-push."
- Stop here. Skip step 11.
```

**If the sentinel file does NOT exist** (normal mode):
```
- git push to the working branch
- Fast-forward main:
    git -C <main-worktree> pull --ff-only origin <branch>
    git -C <main-worktree> push origin main
- Verify GitHub Pages picked up the deploy:
    Open https://gasperjw1.github.io/nba-playoff-analyzer/?bust=N
    (bump N each run to bust the CDN cache)
```

---

## 11 · Sanity-check the deployed page

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
