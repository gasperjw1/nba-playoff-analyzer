# Edge straights and pair — spec `pitch-3` (frozen 2026-11-15, judged from 2026-11-16)

A tracked rule, not a pick. Code: `js/season/pitch3.js` (`SEASON_PITCH3_SPEC`). Frozen by committing
this file unchanged with its code; a change becomes `pitch-4`. It never suggests a stake size.

## Why

pitch-1's edge ticket (`PITCH_SPEC.md`) needs 2–3 moneylines each 8+ points over DraftKings' no-vig
price, so it rarely pitches: on Nov 15, LAL (7.7) and LAC (7.8) fell just short. The user wants
simpler bets that FanDuel always offers, a straight bet or a 2-leg parlay, and asked whether a lower
gap would do.

What was known when this was written:
- **The 8-point line was never tuned.** It was the edge of a research bucket in replay-9 (132 games).
  Against DraftKings' **opening** price, 45% of an 8+ gap showed up (54% won vs 47% expected, n 26),
  and 3–8 point gaps did as well (63% vs 57%, n 54). Against the **close**, neither did. The replay
  is the data the engine was built on.
- **Live ledger, seen before this spec** (every ledger game Nov 2–15, the rule below applied; 5
  open on Nov 15, 3 AVOID games left out):

  | Group | Won | Market expected (no vig) | At the recorded DraftKings price |
  |---|---|---|---|
  | Straights, 5+ points | 25 of 45 | 24.4 | −8.6% |
  | 8+ points | 12 of 23 | 12.1 | −12.0% |
  | 5–8 points | 13 of 22 | 12.3 | −5.2% |
  | Pairs | 1 of 7 | 2.1 | −70% |

  On the current engine (2026-11-07.rotcap) alone, 5+ point gaps won 10 of 15 against 8.2
  expected. Across all engines there is no sign of an edge yet. Line movement from the recorded
  price to the close averaged 0.0 points (± 0.4).

So this is a clean test of whether the model's gaps hold up at all, starting from no evidence that
they do.

## Rule

- **Source:** the game ledger's rows as recorded before tip (`js/season/data/season-ledger.js`),
  like fade-1. Nothing new is recorded. A row an NB.AI record replaces before tip is replaced here
  too; what the ledger holds at tip-off counts.
- **Model chance:** `pOursReport` (the model with the official injury report at record time) when
  the row has it, else `pOurs`. Feed-only is shown beside it.
- **Market chance:** `pMarket`, DraftKings' no-vig moneyline chance as recorded.
- **Leg:** the side where the model is at least **5 points** above the market. One side per game at
  most. Left out: rows missing either chance or either moneyline, and games where the trust check's
  AVOID rule fires (the injury-driven gap pitch-1 also leaves out).
- **Tiers:** **8+** (gap ≥ 8 points) and **5–8** (5 to under 8).
- **Straights:** every leg, one bet each.
- **Pair:** each night's two largest gaps (ties go to the earlier tip), as a 2-leg parlay. No pair
  on a night with fewer than two legs. Legs are always different games, since a game has at most one.
- **Prices:**
  - the DraftKings moneyline the ledger recorded, and that side's close;
  - a pair is its legs' prices multiplied;
  - the user's FanDuel prices go in `js/season/data/user-legs.js` as usual (flat-1), not here;
  - the stake is flat-1's $25 unit, the user's own.

## Judged

From 2026-11-16, on settled legs. For the straights, together and per tier:

1. **Against the market:** wins vs the sum of the market's no-vig chances, with z. This asks whether
   the gaps are real at all, before the vig.
2. **Against the price:** flat-1's measures: wins vs the vig's break-even, profit, margin and z, at
   the recorded price and at the close.
3. **Line movement:** the close's no-vig chance minus the recorded one, as a mean with its standard
   error.

Pairs: wins vs break-even and vs the market's expected wins, and profit at the recorded price and
the close. Pairs are described, never judged alone: there's about one a night, and each rests on
two straights already counted.

## Decision

About 2 legs a night have qualified this season, so 100 settled straights is roughly 50 nights,
early January. The read, at 100 settled straights (both tiers together):

- **Retire:** wins at or below what the market expected (z against the market ≤ 0).
- **Edge:** z against the vig's break-even ≥ 2, at the recorded price.
- **Anything between:** keep logging, and read again at the end of the regular season.

What 100 bets can show, simulated from the 50 legs above: if none of the gap is real, it retires
50% of the time and falsely calls an edge 0.7%. If 45% of the gap is real (the replay's share against
the open), it retires 18% of the time and calls an edge 6%. If all of it is real, it retires 2% and
calls an edge 32%. So 100 bets can retire it; they will rarely prove it.

The tier comparison is descriptive. A different threshold becomes a new spec, never a change here.

## Where it shows

The Pitch tab, the `--record` line `Pitch edge straights (pitch-3)`, and the `--settle` line
`pitch-3`.
