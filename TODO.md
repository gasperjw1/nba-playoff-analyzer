# TODO — 2026-27 season model

Deferred work, newest first. Each item says why it waits and what done looks like.

## Odds feed for player props (waiting on a cost decision)

Tabled 2026-11-07 while the cost of a paid plan is discussed with NB.AI's author. Until then, judge the
models on the actual data (results, box scores, calibration); whether the edges are profitable comes later.

- **Why:** neither DraftKings nor FanDuel has a public odds API (their site endpoints are undocumented and
  scraping them is against their terms). ESPN's pickcenter gives DraftKings' moneyline, spread and total
  only — no props. A licensed aggregator (The Odds API is the usual start; SportsDataIO, OddsJam,
  OpticOdds, Sportradar cost more) carries both books, NBA props included (points, rebounds, assists,
  PRA, threes, alternates). Props are billed per game per request, so a full slate uses quota fast —
  check current pricing and limits.
- **What it unlocks:**
  1. Prop prices recorded with each props-ledger row at record time, and the closing price at
     `--settle` — prop edges judged like moneylines (results and line movement). Today every prop edge
     is "unproven" partly because no prop price is tracked.
  2. The parlay checker (`js/season/parlay.js`) prefilling prop odds and showing a no-vig market for
     every leg.
  3. FanDuel beside DraftKings.
- **Constraints:** the account and API key are the user's; the key lives only in an environment
  variable read by `fetch-slate.js`, never committed and never sent to the static site, which sees only
  the prices written into the snapshot.
- **First step when resumed:** a plan sized to the plan's quota — which markets, requests per night,
  and how prices/closes sit beside each props-ledger row.

## Pitched tickets (draft spec: PITCH_SPEC.md, `pitch-1`)

Researched 2026-11-07 from the playoff bets data and this season's replay; the evidence table is in
the spec. Short version: the playoffs' real edge was deep "floor" prop legs (+8.4 ± 4.9 pp over real
DraftKings prices, 89 legs) and short-priced tickets (+5.2 units); long shots went 2 of 14; this
season's moneyline edges show up against the opening price (45% of the gap at 8+ pp) but not against
the close. The spec makes the floor ticket the main recipe and the moneyline-edge ticket an
experiment, both recorded before tip and graded.

To do, in order:
1. **Freeze and build `pitch-1`:** the pitch module, the site tab, `js/season/data/pitch-ledger.js`
   written by `--record` and graded by `--settle`, tests. Commit the spec unchanged with the code
   before the first night it runs.
2. **Same-game correlation:** measure from this season's box scores (team result vs player PRA,
   two players on one team) so same-game legs can be priced, not just flagged.
3. **Rest-night and back-to-back risk:** 5% of players counted available did not play (1% expected);
   split by rest, back-to-back and age to see whether floor legs need a rest filter.
4. **Price timing:** for every ledger row and logged ticket, where the price taken sits between
   DraftKings' open and close (both already stored at settle), since moneyline edges hold only at
   early prices. Drop rows whose ESPN "open" is implausible.
5. **Prop prices from checked tickets:** every prop leg the user checks in the Parlay tab carries
   DraftKings' price; logging them (user-bets.js) builds the first season data on whether floors are
   underpriced, before any paid feed.
6. **Unders near the projection** (55–58% won on the replay) — a candidate recipe for `pitch-2`.

## Model

- **Props distribution (props-3).** The live props model (`2026-11-07.sdscale`) still overstates overs
  near the projection (42–45% went over where it says ~50%): stat lines are right-skewed with a fat left
  tail from short-minute nights. The gamma and minutes × gamma candidates fixed the center but
  over-promised floors (props-2). Needs a candidate with both, frozen before scoring and tested on games
  after Nov 6 (not the props-2 replay again).
- **ESPN-fallback minutes.** On fallback days a player's projected minutes are his season average; they
  do not move when a teammate is out. NB.AI's projection does. Worth a rotation-aware projection for
  fallback days.
- **Props ledger size.** `js/season/data/props-ledger.js` grows ~60 KB a night (several MB by spring);
  split by month or summarise for the page before it slows loading.

## Judged on the live ledger (no action; check as games settle)

- Trust rules R1–R4 / AVOID on engine `2026-11-07.rotcap` from 2026-11-08 (b2b2 rows judged from
  2026-11-06).
- LATE2 from 2026-11-08 — the replay no longer supports it (earlier pick 3 of 6 on replay-9).
- Props model `2026-11-07.sdscale` calibration in the Ledger tab's props section.
