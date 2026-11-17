# Combined-factor shadow — spec `combo-1` (frozen 2026-11-16)

A tracked shadow, not a pick. Code: `research-combo.js`. Frozen weights: `combo-1.json`. Both are
committed before any 2026-27 game is scored with this model. A change becomes `combo-2`. Never a
stake size, never an engine change, never a bet before it holds live.

## Why

Twelve team factors failed one at a time against the closing spread: shooting luck (L1–L4,
luck-sched-1), schedule (S1–S7, luck-sched-1) and the three-point matchup (D1, coinflip-1).

Combined, they predicted later seasons in an exploratory check (MODEL_AUDIT.md, "Cross-level and
combined checks"):
- **Fit 2021-24, tested on 2024-26:** slope +0.91 (t 2.38), top-20% picks 54.6–54.8%.
- **Leave one season out:** positive in 3 of 5 seasons.

It was found by looking. 2015-21 lacks the box lines its shooting features need, so live 2026-27
is the only unseen test.

The engine pieces were left out: their past-season replica used rosters including mid-season
signings, and can't be computed honestly in real time. The combined model with them did slightly
better in the exploration (t 3.15), which this spec gives up for a clean live test.

## The model

- **Features:** exactly as in luck-sched-1 and coinflip-1, each team's games before the scored date
  only, both teams with 5+ prior games.
  - **L1–L4:** recent, season and last-game shooting luck, and luck-adjusted form.
  - **S1–S7:** 3 games in 4 nights, rest days, distance travelled, time zones moved east, the away
    team's road-trip game, the home team's first game after 3+ on the road, altitude.
  - **D1:** the three-point accuracy matchup, shrunk with 300 attempts. Rewritten in
    `research-combo.js`; it matches coinflip-1's on all 5,728 games (difference 0).
- **Fit:** ridge regression, λ 500, on standardized features, over all 2021-22 to 2025-26 games
  (5,728). Means, sds and weights are frozen in `combo-1.json`. A refit from scratch reproduces them
  exactly.
- **Weights,** points per sd:

  | Feature | Weight | | Feature | Weight |
  |---|---|---|---|---|
  | L1 | −0.141 | | S3 | −0.188 |
  | L2 | +0.263 | | S4 | −0.366 |
  | L3 | −0.214 | | S5 | +0.190 |
  | L4 | +0.375 | | S6 | −0.156 |
  | S1 | −0.110 | | S7 | +0.096 |
  | S2 | +0.153 | | D1 | −0.387 |

- **Prediction:** Σ weight × standardized feature, in points of the home side's result against the
  closing spread. No intercept, so no home lean is carried in.
- **Check of the frozen code against the exploration:** fit on 2021-24 and tested on 2024-26, it
  gives slope +0.91 (t 2.38) and picks 54.6%. The exploration's 54.8% included the intercept.

## Judged

- **Sample:** every 2026-27 regular-season game where both teams have 5+ prior games and ESPN has a
  close (DraftKings, else ESPN BET, as in the training data).
  - That includes the games already played this season: none of them has been scored with this
    model or these features before this commit.
  - Scored by `node research-combo.js --live`, from games before each date only.
- **Measures:**
  1. **Slope of result on prediction:** the result is actual home margin − market margin (−spread).
  2. **Top-20% picks:** the side the prediction favours on its largest 20% of |prediction|, against
     the spread (break-even 52.4%).
- **Retire check at 400 scored games:** retire if the slope is ≤ 0.
- **Final read at the end of the 2026-27 regular season:**
  - **Holds:** slope > 0 with t ≥ 2, *and* top-20% picks win more than 52.4%.
  - **Otherwise it doesn't hold.** A positive but weaker slope is reported as such, and the tracker
    continues only as `combo-2` with its own spec.
- **Power:** about 900–1,000 scored games are expected by season's end. If the 2024-26
  out-of-sample slope (0.91) is the truth, the expected t is about 1.5, so the season has roughly
  30% power. A miss wouldn't prove the signal false; a hold would be strong evidence.

## Where it shows

- `node research-combo.js --live`: the running slope, t and picks.
- b2b-1 is judged separately. The two use different data and can be compared at season's end.

## Known before the freeze (pipeline check, no results looked at)

- **Coverage through Nov 15:** 197 completed 2026-27 games, all with a DraftKings close. 119 have
  every feature; the first is Oct 30.
- **The schedule features match their training distributions** (means and sds within about 0.1).
- **The shooting-luck features are more spread out early in the season,** because a few games'
  luck averages out less:

  | Feature | sd now | sd in training |
  |---|---|---|
  | L2 | 6.1 | 2.7 |
  | L3 | 15.6 | 17.9 |
  | L4 | 4.7 | 7.2 |
  | D1 | 4.0 | 3.0 |

- **Effect:** under the frozen training standardization, early predictions lean harder on season
  luck (L2) and the matchup (D1).
- **Not adjusted:** adjusting would be fitting to live data. The training seasons include their own
  early weeks, so the model saw this pattern there too.
