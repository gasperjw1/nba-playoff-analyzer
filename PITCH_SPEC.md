# Pitched tickets — spec `pitch-1` (DRAFT, not frozen)

A nightly pair of parlay tickets the site proposes from tonight's slate, recorded before tip-off and
graded like the trust rules, so we learn whether either recipe has value. This file is a draft: it
is frozen by committing it unchanged together with the code, before the first night it runs, and is
never edited afterwards — a change is a new spec (`pitch-2`) with its own start date.

It measures tickets. It never suggests a stake size, and every pitch is labelled unproven until its
own record says otherwise.

## Evidence it is built on (researched 2026-11-07)

| Finding | Number | Source |
|---|---|---|
| Playoff "floor" prop legs beat their prices | 89 unique legs with real DraftKings odds hit 76% vs 68% implied (+8.4 ± 4.9 pp) | `js/data/bets-data.js` FEATURED_PARLAYS, Round 2 on; 28 floor legs with estimated ("~") odds and repeated legs excluded |
| Every other playoff leg lost to its price | 83 legs, 43% vs 53% (−9.2 ± 5.3 pp) | same |
| Playoff tickets by price | under +200: 32 of 61, +5.2 units; +200 to +999: 5 of 28, −6.8; +1000 and up: 0 of 5 | same (ticket prices are as listed; 69 of 94 differ from their legs multiplied — quoted same-game prices or approximate legs) |
| Playoff long shots ("chaos") | 2 of 14 tickets (Apr 20 ~+1003, Apr 23 ~+1850); ≈ +16.5 units at equal stakes, ≈ −$327 as staked | archived Round 1 bets page (git history of `js/ui/bets.js`) and `bets-data.js`; Round 1 prices approximate |
| Season moneyline edges of 8+ pp | eve engine vs DraftKings' **open**: 45% of the gap showed up (54% won vs 47% expected, n 26, +4.4 units); tip engine vs the **close**: none (46% vs 48%) | replay-9, 132 games (`js/season/data/season-replay.js`) |
| Small edges (3–8 pp) | vs open: fully real (63% vs 57%, n 54); vs close: 46% vs 54% (n 48, −13 units) | same |
| Season props calibration (live props model `2026-11-07.sdscale`) | points/PRA 90% lines clear 90–91% vs 91% shown; 75% lines 73–74% vs 77–78%; overs near the projection 42–45% vs ~50%; rebound/assist floors 96% vs 92% | `backtest-prop-dist.js` (props-2 holdout, Nov 1–6) |
| Starters' floors in blowouts | lost by 15+: 84.5% cleared vs 90.9% shown (n 193); every other group 92–94%; **not predictable before tip** — every pre-game win-probability bucket clears 91–93% | props-1 replay rows, top-5 by projected minutes |
| Minutes | 12% of players play under 70% of projected minutes; 5% of players counted available did not play (1% expected); top-two players average ~33 minutes, 38+ in 16% of games | props-1 replay |

What follows from it: the floor ticket is the main recipe; moneyline edges are worth something only
at early prices; long shots are an experiment.

## Recipe A — "floor" ticket (main)

Legs are player-prop overs at deep lines, chosen without looking at a price (no prop prices are
tracked yet):

- **Players:** a team's top 5 by projected minutes, 28+ projected minutes, listed fully available
  (not questionable or doubtful), on tonight's slate before its tip.
- **Stats:** points or PRA only (the two calibrated after props-2). No 3-pointers; rebounds and
  assists only as a recorded alternative, not a pick (they run safe, so the model undersells them).
- **Line:** the model's 90% line — the highest half-point line the live props model gives at least
  90% (`propDistLineAtLeast` on the model's normal; the same line the ledger's "90% floor" checks) —
  and not below DraftKings' realistic floor (points or PRA at half the player's projection, the
  playoff builder's rule; a leg whose 90% line falls below it is dropped). Only the 90% line is used
  because it is the one the props-2 holdout validated (the 75% lines ran 4 pp low; 85% lines were
  never tested).
- **Ticket:** 3 legs, each from a different game (same-game correlation is not modelled yet), the
  three with the most projected minutes among the eligible legs (minutes are the floor's main risk);
  ties broken by the higher line.
- **Shown chance per leg:** the model's own chance at that line, which the props-2 holdout found
  calibrated for points and PRA (90–91% cleared vs 91% shown). Combined chance = product.
- **Price:** not known. The pitch shows the fair price from the combined chance; the user enters
  DraftKings' quote, which is recorded with the ticket and used for units.

## Recipe B — "edge" ticket (experiment)

Moneyline legs where the picks engine is above DraftKings' no-vig price:

- **Legs:** games with a picks-engine edge of 8+ pp over DraftKings' no-vig price at the time of the
  pitch, no AVOID firing in that game (AVOID is the injury-driven gap), one leg per game, at most 3 legs (the three
  largest adjusted edges).
- **Shown chance per leg:** DraftKings' no-vig chance plus 45% of the model's gap — the share that
  showed up against the opening line on the replay. The display also states that against the close
  none of it did, so the edge depends on getting an early price.
- **Combined chance:** product of the adjusted chances; the price is the legs' prices multiplied
  (moneylines on different games) unless a quote is entered.

## What is recorded (pitch ledger, `js/season/data/pitch-ledger.js`)

Written by `fetch-slate.js --record`, before the first tip, for each recipe that has a full ticket:
date, recipe and spec, engine and props-model versions, recorded-at time, and per leg the game,
player or side, stat and line, the model's chance, the shown (calibrated or adjusted) chance, the
price on the slate for moneylines, and DraftKings' no-vig chance. A recipe with no full ticket that
night records "no ticket" (the absence is part of the record).

Graded by `--settle`: each leg's result from the box score or final score; the ticket's result; for
moneyline legs the open and close prices (already stored on every ledger row) so the price at pitch
time can be placed between them; units only for tickets with a recorded price (a quote the user
enters, or Recipe B's moneylines).

## How each recipe is judged

- **Calibration:** legs' hit rate against their shown chance, overall and per recipe. Recipe A is
  working as designed if its legs land within ±5 pp of the shown chance over 60+ legs.
- **Value:** units at recorded prices, and for Recipe B the line movement from the pitch price to the
  close (toward our side or not). A recipe is not called profitable on fewer than 30 priced tickets.
- **Comparison:** Recipe A against the user's own tickets on the same nights.

## Not in this spec (open questions)

- Same-game legs and their correlation (measure first from this season's box scores).
- Rest-night and back-to-back risk for floor legs (5% of available players did not play).
- Unders near the projection (they won 55–58% on the replay) — a candidate for `pitch-2`.
- Prop prices: until there is a feed, Recipe A's value depends on prices the user enters.
- ESPN's "open" price is occasionally wrong (Nov 4: San Antonio "opened" +503 against a −620
  close); line-movement measures should drop rows where the open and close disagree on the favourite
  by an implausible margin.
