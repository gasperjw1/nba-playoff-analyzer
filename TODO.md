# TODO — 2026-27 season model

Deferred work, newest first. Each item says why it waits and what done looks like.

## Odds feed for player props (pulls built: ODDS_SPEC.md, `odds-1`)

Tabled 2026-11-07; resumed 2026-11-08 on The Odds API's $30 plan (20,000 credits a month), shared with
NB.AI's author. `node fetch-slate.js --odds` now pulls FanDuel lines and props once per game, in the hour
before tip. Still to do: check the first real reply (alternate PRA encoding, real cost per call); then
judge props-ledger projections and pitch-1 legs against those prices; decide whether the terms allow
showing the prices on the public site; the injury-report lookup still steps in half-hour slots (the NBA
now posts every 15 minutes).

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
1. ~~Freeze and build `pitch-1`~~ — built 2026-11-07 (`js/season/pitch.js`, Pitch tab,
   `js/season/data/pitch-ledger.js`, TEST 32); frozen by committing PITCH_SPEC.md unchanged with the
   code; first judged night 2026-11-08. Floor quotes the user sends in chat are added to that night's
   ticket (`quote`) so it can be scored in units.
2. **Same-game correlation:** measure from this season's box scores (team result vs player PRA,
   two players on one team) so same-game legs can be priced, not just flagged.
3. ~~Rest-night and back-to-back risk~~ — checked 2026-11-07, no filter needed: the did-not-play
   risk is the bench's (floor-eligible players 0 of 766), and floor-eligible 90% PRA lines cleared
   93.4% on back-to-backs (91.5% otherwise, 90.2% at 32+; model 90.7%). Written into PITCH_SPEC.md.
4. **Price timing:** for every ledger row and logged ticket, where the price taken sits between
   DraftKings' open and close (both already stored at settle), since moneyline edges hold only at
   early prices. Drop rows whose ESPN "open" is implausible.
5. **Prop prices from checked tickets:** every prop leg the user checks in the Parlay tab carries
   DraftKings' price; logging them (user-bets.js) builds the first season data on whether floors are
   underpriced, before any paid feed.
6. **Unders near the projection** (55–58% won on the replay) — a candidate recipe for `pitch-2`.
7. **Safe 3-leg moneyline ticket** — researched 2026-11-08 on three past seasons (3,678 games at the
   close; `research-favourites.js` pre-registered, `research-favourites-explore.js` after it):
   - No situation (home/road, back-to-backs, rest, early season) passed the pre-registered rule;
     the engine agreeing with the market added nothing at the close.
   - Closing favourites are priced about right after the vig: the market's 3 strongest a night hit
     257 of 459 nights (56%) against ~56% break-even (−0.6 units). A floor on every leg trades
     nights for safety: ≥ 75% → 139/203 (68%, ~+48, 44% of nights, +2.0 u); ≥ 80% → 76/100 (76%,
     ~+35, 22% of nights, +2.2 u). Daily and 70%+ safe cannot both hold. The ≥ 75% tickets'
     prices said 64.7%; the 68.5% ran 1.1 SE above it, so expect ~65% and about −4% at the close
     (the vig). The 75% floor was picked after seeing all three seasons.
   - At the opening price (`research-favourites-open.js`, pre-registered, 3,585 games with open
     and close from one book): worse, not better. Tickets picked at the open hit below their
     break-even (≥ 75%: 110/176 nights, 62.5% vs ~68%; −15.2 u). On the same games, picking at
     the close hit 138/201 (68.7%). Both sets' own prices said ~65%, so most of that gap is noise;
     the real part is that the close is more accurate (Brier 0.197 vs 0.202) and legs kept moving
     the way the line moved. The past-season engine's edges
     vs the open won slightly above fair (z 1.3–1.8, same sign both splits) but lost money at the
     opening price, and the close moved its way only ~50% of the time — none passed.
   - So the safe ticket belongs near tip (after injury reports), at ≥ 75% by the market. Not
     testable on past seasons: the live engine's injury step.
   - **Built as `pitch-2`** (PITCH2_SPEC.md, frozen 2026-11-08, judged from 2026-11-09). Next:
     after ~20 safe nights, check legs vs shown chance and the cause tags on lost vs won legs.

8. **Flat $25 moneylines (`flat-1`, FLAT_SPEC.md)** — built 2026-11-08 on the user's ask: $25
   straight on every moneyline above −300, tracked for every ledger favourite from −299 to −100
   (clean from 2026-11-09), for the user's own FanDuel legs, and for pitch-2's legs. Past seasons
   at the close: −3.8% over 2,259 favourites, so this tests whether the prices taken beat the
   close. No group is called profitable under 100 settled bets or with |z| < 2.

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
