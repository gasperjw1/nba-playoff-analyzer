# FanDuel odds — spec `odds-1` (frozen 2026-11-08)

Real FanDuel prices for every game, pulled once, after the injury report, from The Odds API. The plan
is the $30/month one, shared with NB.AI's author: 20,000 credits, reset on the 1st of each month.
Code: `js/season/odds.js` (`SEASON_ODDS_SPEC`), with the IO in `odds-pull.js`. Run it with
`node fetch-slate.js --odds`; the tests are in `test-odds.js`. A change becomes `odds-2`.

## What is pulled

- **Book:** FanDuel only (`bookmakers=fanduel`, which counts as one region).
- **Lines:** moneyline (`h2h`) and spread (`spreads`). One slate-wide call covers every due game and
  costs 1 credit per market.
- **Props:** points, rebounds, assists, PRA, threes, and alternate PRA (needed for the pitch-1 floor
  lines). One call per game is charged only for the markets FanDuel has posted. An empty reply is free.
- **When:** a game is due once its tip is at most 60 minutes away. By then the last injury report the
  replay's model reads (at least 60 minutes before tip) is out. The NBA posts a report every 15
  minutes, and teams must file by 1 PM local on game day.
- **Model beside the price:** the run lays the latest official injury report over the same slate
  `--record` uses. It then stores the model's moneyline chance and each prop's Over/Under chance with
  the price. Recorded tickets and ledgers are never touched.

- **Once-a-day ladder pull** (added 2026-11-09 at the user's ask, after the FanDuel floor test,
  `research-floor-fd.js`): `--record` also pulls only the alternate PRA ladder for every game still to
  tip, at 1 credit a game, with the model as just recorded. Every game's ladder is then collected even
  when its hour-before run is missed. The hour-before pull skips the stored ladder, so a game still
  costs at most 8. A ladder that isn't posted yet costs nothing and uses no try, so it's retried on the
  next record or by the hour-before pull. Without `ODDS_API_KEY`, or with `--no-odds`, it's skipped.

## Guards (one pull per game)

1. A market is requested only while it's missing for that game. A stored market is never overwritten,
   so re-running costs nothing for what's already stored.
2. The ledger (`.odds/odds-ledger.json`) is written after every charged reply, before the next call.
3. Each market gets at most 3 requests. A market FanDuel never posts stops costing.
4. A lock file (`.odds/odds.lock`) refuses a second run at the same time.
5. No call is made that could take the remaining credits below 5,000. That keeps a quarter of the
   plan in reserve and leaves 15,000 a month to spend, against about 1,900 in the busiest month.
   The floor was raised from 500 on 2026-11-08, at the user's ask, before any real pull.
6. **At most 10 credits per game, ever** (added 2026-11-08 at the user's ask, before any real
   pull). A shared line call counts in full against each game in it. A request that could go past
   the cap is trimmed: alternate PRA is dropped first, and the 2-credit line call goes in whole or not
   at all. A full first pull is 8, so the cap only bites on retries.
7. `--odds --dry` lists what's due and the most it could cost, with no API call and no key needed.
8. Every call is logged with its cost and the credits left (from `x-requests-last`,
   `x-requests-remaining` and `x-requests-used`).
9. The key lives only in `ODDS_API_KEY`. It's never logged (it's redacted from errors), stored or
   committed.

## Cost

A full game is 8 credits: 2 for the lines (shared by every game in the run) and 6 for the props.

- The busiest month (January, 236 games) is about 1,900 credits, under 10% of the plan.
- A night needs a run for each group of tips that are less than an hour apart: about 3 on an average
  night, up to 6.
- `--odds` prints when to run next: "run between X and Y".

## Not settled yet

- **Alternate PRA:** the docs don't say how FanDuel's milestone lines ("15+") are encoded. Check the
  first real reply before relying on it.
- **Ledger stays local:** prices are kept in a gitignored file until it's clear that The Odds API's
  terms allow republishing their data on the public site.
- **Spreads aren't priced by the model:** the engine's margin has no calibrated spread here.
