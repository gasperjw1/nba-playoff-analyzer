# Back-to-back split shadow — spec `b2b-1` (frozen 2026-11-15, judged from 2026-11-16)

A shadow measure recorded on every ledger row. It never changes the engine, the picks or the
tickets. Code: `js/season/b2b.js` (`SEASON_B2B_SPEC`) and `b2b-shadow.js` (the feature, computed
at record time). Frozen by committing this file unchanged with its code; a change becomes `b2b-2`.

## Why

matchup-1 Part B (`MATCHUP_RESEARCH.md`, 3,476 games) found one stat that beats the closing
spread: how a team does on the second night of a back-to-back compared with its rested games,
beyond the generic penalty the market applies.
- Train t 2.51 (2023-24 + 2024-25), holdout t 2.57 (2025-26).
- Positive in each season on its own, and uncorrelated with the market margin.
- Worth about 1.3–2 points against the close per sd.
- Against the spread alone, at the frozen threshold below, it was near break-even: 185-166-4
  (52.7%) train and 97-84 (53.6%) holdout, where −110 needs 52.4%.

The question now is whether it holds live.

## Definition (as in matchup-1 Q3b)

- **Team profile:** for each team, from this season's regular-season games before tonight (ESPN
  box scores, `research-matchup.js`), every game's net rating, 100·(points − opponent
  points)/possessions.
- **A back-to-back game:** one played the day after the team's previous game.
- **Split:** the team's mean net rating in back-to-back games minus rested games. Each is shrunk
  to the team's overall net rating with k = 5 pseudo-games, and the overall is shrunk to 0 with
  k = 5.
- **On a back-to-back tonight:** the team played yesterday.
- **Feature F (net points per 100 possessions)** = (home split if home is on a back-to-back, else
  0) − (away split if away is, else 0). It is 0 when neither team is on a back-to-back. It is not
  computed (null) when either team has fewer than 4 prior games.
- **Shift (home points)** = 0.28 · F. The slope is the training seasons' estimate (0.2817 ± 0.112),
  frozen.
- **pOurs with the shift** = Φ(Φ⁻¹(pOurs) + shift/12.5), beside `pOurs`. That is the engine's
  unrounded margin plus the shift, so F = 0 leaves it equal to `pOurs`.

Each row stores, as `b2b`:

    { spec, home: { b2b, split, nB2b, nRest, n }, away: { … }, feature, shift, pOurs }

## Judged

From 2026-11-16, on settled rows with F ≠ 0 and a closing spread. The residual is the actual home
margin minus the closing market margin (−`close.spreadHome`).

1. **Live slope** of the residual on F (OLS with intercept), with its standard error.
2. **Against the spread** with |F| ≥ 2.9 (the training median of |F| in back-to-back games, 2.92):
   take the side F favours against the closing spread. Record wins, losses and pushes against
   the 52.4% break-even at −110.
3. **Brier score** of `b2b.pOurs` against `pOurs` and `pMarket` on the same rows.

## Decision

About 30% of games have a team on a back-to-back (30.5% train, 30.0% holdout). A live slope is
noisy: its standard error is about 0.24 at 150 games and 0.15 at about 370, the expected number
from 2026-11-16 to the end of the regular season (scaled from training's 0.111 at 707). Even if
the effect is real at 0.28, a live t ≥ 2 alone has only about a 20% chance at 150 games and 43% at
370. So the live result is read together with the 2025-26 holdout, which set no frozen number.

- **Retire check at 150 settled games with F ≠ 0:** retire if the live slope is ≤ 0. If the effect
  is real at 0.28, that happens about 12% of the time; if it's zero, about 50%. Otherwise keep
  logging.
- **End of the regular season:** pool the live slope with 2025-26's (0.432 ± 0.172 on games with
  F ≠ 0) by inverse variance.
  - **Holds:** pooled t ≥ 3. About 52% likely if the effect is real at 0.28, about 4% if it's
    zero. Then it can be proposed as an engine term, which would be a new engine version.
  - **Retire:** a live slope at or below 0.
  - **Anything between:** keep logging into 2027-28.
- Never bet on it before it holds. The against-the-spread line is a tracker, not a pick.
