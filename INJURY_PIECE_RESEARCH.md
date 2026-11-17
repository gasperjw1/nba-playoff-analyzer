# The engine's availability piece vs the close, 2021-26 — research `injury-close-1` (pre-registered 2026-11-15)

Written and committed before the availability feature is computed for any game or compared with
any line. Code: `research-injury-close.js`, written after this commit.

## Why

engine-close-1 and engine-close-2 showed the engine's team-level core has no information beyond the
close. The live engine adds one more piece, night-by-night availability: who's out tonight against
the minutes the team rating was earned with (`calcRosterAdjustment`). It's the only piece left that
could carry an edge. Live, it looks too harsh: absences were over-penalized by about 27% against the
market (the team-lean dig). It has never been tested on past seasons.

## The feature: availability adjustment A (a past-season replica of `calcRosterAdjustment`)

For team T before tonight's game, season Y (Basketball-Reference year), from data available before
tip.

### Player value

- **Prior box plus-minus (BPM):** from Basketball-Reference seasons Y−1 (weight 1.0) and Y−2
  (weight 0.5), minutes-weighted, regressed toward replacement with 300 phantom minutes:

      (Σ bpm × mp × w + (−2) × 300) / (Σ mp × w + 300)

  A player with no prior season counts as replacement (−2), so value 0. These are the live engine's
  constants (`SEASON_PLAYER_PRIOR`, `SEASON_IMPACT`).
- **Baseline minutes per game:**

      (prior mpg × 4 + this season's mpg × games played) / (4 + games played)

  Prior mpg is weighted like the BPM. This season's comes from ESPN box minutes before tonight, all
  teams. With no prior, it's this season's alone.
- **Value per game:**

      max(0, BPM + 2) × mpg / 48 × 0.99 × 0.885

  It's 0 when mpg < 8. Pace is fixed at 99 (the live engine uses each team's).

### Who counts

- **The roster:** players who've played for T this season before tonight and aren't gone (their next
  appearance isn't for another team, as in situ-1), plus anyone playing for T tonight.
- **Tonight's minutes:** the players who play tonight (box minutes > 0), in order of baseline
  minutes. Each gets his baseline minutes until the team reaches 240 (the live engine's rotation
  cap); absent players get 0.

### Minutes in the rating, and A

- **Minutes in the rating:**

      (1 − w) × baseline mpg + w × (his minutes for T this season / T's games this season)

  w = g / (g + 20), the walk's weight. The prior assumes everyone available at normal minutes; the
  form part holds who actually played.
- **A for team T:** Σ value / mpg × (tonight's minutes − minutes in the rating), capped at ±12 points.
- **A for the game:** A(home) − A(away).
- **The engine with availability:** the engine-close-1 walk's margin + A.

### Name matching and known departures from the live engine

**Name matching:**
- ESPN box names are matched to Basketball-Reference names within the season. The name is
  normalized (accents, punctuation, and the suffixes Jr, Sr and II–V removed); team and name first,
  then name alone when unique.
- **Two aliases, fixed now:** Ronald Holland II → Ron Holland, and Adama Bal → Adama-Alpha Bal.
- Unmatched players count as replacement. In the feasibility check, 0–0.3% of minutes each season
  were unmatched.

**Known departures from the live engine:**
1. **No current-season BPM:** the live engine blends in this season's box-score BPM, but there's no
   point-in-time history of it. Rookies and breakout players are worth 0 here.
2. **Played or not, instead of injury-report odds:** availability is 1 or 0 from the box score. Who
   plays is on the injury report before tip. A coach's in-game DNP of a rotation player would be
   misread as an absence; that's rare for players at 8+ mpg.
3. **The walk's prior isn't the live prior:** it's already roster-adjusted at opening night, so
   arrivals and departures between seasons aren't in A. A covers only in-season availability.

### Feasibility, before this file

- **Player matching:** 99.7–100% of minutes each season. One apparent 9% gap was the probe script
  tagging All-Stars with the All-Star game's EAST and WEST teams.
- **Data:** Basketball-Reference BPM, minutes and team rows are cached for 2013-14 to 2025-26.
- **Nothing scored:** no availability values or results were looked at.

## Data and targets

- **Games:** the 6,119 engine-close-1 games, 2021-22 to 2025-26.
- **Close and targets:** the same closing lines, resid and windows as engine-close-1.
- **Box scores:** `.cache/espn-nba/old` for 2021-23, `.cache/espn-nba/hist` for 2023-26.

## Questions

**I1. Does the market under-react to availability as the engine values it?**
- The slope of resid on A.
- **Pass:** slope > 0 with t ≥ 2 pooled over the five seasons, and positive in at least 4 of 5.
- A significant negative slope (t ≤ −2) is reported, not passed. It would mean the market
  over-reacts to absences, so a bigger engine penalty would be worse still.

**I2. Does the engine with availability carry information?**
- The slope of resid on (walk margin + A − market margin).
- Same pass rule as I1.

**I4. pitch-3's rule on the engine with availability.**
- Sides 5+ points above the no-vig close, using Φ((walk margin + A) / 12.5).
- **Pass:** wins beat the market's expected wins with z ≥ 2.
- Tiers and profit at the close are described.

**I3. Described, not decided (calibration):**
- **Results:** the coefficient of A in (actual margin − walk margin) ~ A, which is how much of the
  engine's availability value shows up in results. The engine assumes 1.0.
- **Market:** the coefficient of A in (market margin − walk margin) ~ A, which is how much the
  market moves for the same value.
- Their ratio bears on the live finding that absences are over-penalized.

**Also described:**
- each season;
- games with |A| ≥ 1 point;
- the three windows;
- with the 1% largest |resid| trimmed;
- Brier score of the engine with availability against the market.

**False passes:** 3 decisions (I1, I2, I4). The chance that noise passes at least one is about 5%.

## What the answers mean

- **I1 passes:** the market under-prices availability as the engine measures it. A shadow on live
  rows (A from the injury report) would test it.
- **I1 fails with a negative slope:** the market already over-reacts to absences, and the engine's
  penalty adds nothing. Fixing the live over-penalty means shrinking it toward the market, not
  betting on it.
- **I3:**
  - if results' coefficient is below 1, the engine's absence values are too big against results
    (not just against the market);
  - that gives a measured scale for the live injury piece, as a shadow, never a direct engine
    edit.
- **Everything fails:** no part of the engine, core or availability, beats the close historically.
  Edges then have to come from prices (shopping across books) rather than information.

## Results (run 2026-11-15, after the pre-registration commit 1d8fb55)

`node research-injury-close.js`: all 6,119 engine-close-1 games got the feature.

**Checked before reading the decisions:**
- **Matching:** 99.93–100% of minutes matched to Basketball-Reference.
- **A's spread:** sd 3.10 points; |A| ≥ 1 in 3,970 games; 22 team values hit the ±12 cap.
- **The largest values are real rest nights:**
  - Denver at Phoenix, 2023-04-06 and 03-31: Jokić, Murray, Porter Jr., Gordon and Caldwell-Pope
    rested after clinching;
  - Philadelphia at Atlanta, 2023-04-07: Embiid and Harden rested.
- **Prior BPM:** Jokić's is 11.9 (his 13.7 and 11.7, weighted 1.0 and 0.5, then regressed).
- **Two team values rebuilt by independent brute-force code:**
  - Denver −11.43 and Phoenix 5.61 on 2023-04-06. Phoenix's +5.6 with nobody out is Durant's
    arrival credit: 35.5 baseline minutes, but only 2.9 per team game in the form so far.
  - Brooklyn −2.66 on 2022-01-17, Durant's first game out. Irving played (a road game), with a small
    share, which offsets most of it.
  - Both match the research script exactly at the walk's weight.
- **The feature is real:** the closing line moves 0.87 ± 0.01 points per point of A, relative to the
  walk.

| Q | Question | Result | Decision |
|---|---|---|---|
| I1 | slope of resid on A | +0.087 ± 0.055 (t 1.57); by season +0.27, −0.16, +0.06, +0.07, +0.22 | no (t < 2) |
| I2 | slope of resid on the engine-with-availability gap | +0.067 ± 0.069 (t 0.98); positive in 4 of 5 | no |
| I4 | pitch-3's rule on the engine with availability | won 1,069 of 2,564 against 1,055.1 expected (z 0.60); −4.5% at the close | no |

**0 of 3 pass.**

**I3, calibration (described):**
- **Results:** (actual − walk) ~ A gives **0.959 ± 0.056**, so the engine's availability values show
  up in results at about their full size.
- **Market:** (close − walk) ~ A gives **0.872 ± 0.010**.
- I1's slope is their difference (0.959 − 0.872 = 0.087), an algebra check that holds.
- **By season:**

  | Season | Results | Market |
  |---|---|---|
  | 2021-22 | 1.11 | 0.84 |
  | 2022-23 | 0.70 | 0.85 |
  | 2023-24 | 0.93 | 0.87 |
  | 2024-25 | 0.92 | 0.84 |
  | 2025-26 | 1.18 | 0.96 |

**Also described:**
- I1 on games with |A| ≥ 1: +0.084 ± 0.056.
- I1 by window: games 0–5 +0.02 ± 0.36; 6–20 −0.07 ± 0.14; 21+ +0.12 ± 0.06.
- Trimmed: I1 +0.066 ± 0.053, I2 +0.092 ± 0.066.
- **Brier score:** the engine with availability 0.2074, the core alone 0.2135, the market 0.2034.
  Availability makes the engine clearly better, but it still trails the market.

**Exploratory (not pre-registered), absences against returns and arrivals:**

| Part | Results | Market | resid |
|---|---|---|---|
| absences (players out tonight) | 0.951 ± 0.060 | 0.849 ± 0.011 | +0.102 ± 0.059 |
| returns and arrivals | 0.99 ± 0.16 | 0.99 ± 0.03 | 0.00 ± 0.16 |

## Conclusion

- **The availability piece doesn't beat the close.**
  - The market lean is in the engine's direction: the market moved about 0.85–0.87 points per point
    of the engine's value, results about 0.95.
  - It falls short of the bar (t 1.57), with one of five seasons going the other way.
  - pitch-3's rule on the full engine had no edge (z 0.60, −4.5% at the close).
- **The engine's absence values were about right against results** (0.95 ± 0.06).
  - The live finding that absences are penalized about 27% more than the market is real as a
    difference from the market.
  - But on past seasons the results sided with the engine's size, not the market's (not
    significantly).
  - So there's no historical case for shrinking the engine's absence values to match the market.
  - The live gap's extra size probably comes from what this replica doesn't model: the injury
    report's Questionable and Doubtful odds, and current-season BPM.
- **Taken with engine-close-1 and engine-close-2:** no part of the engine beats the close on past
  seasons. The closest is the absence piece, a lean worth about a tenth of the engine's value
  (+0.10 ± 0.06). Confirming a lean that size would take about four times as many games, roughly
  20 seasons. It's real-world small, not a practical betting edge on its own.

## Erratum (2026-11-16)

**The bug:** the replica's All-Star filter caught only EAST, WEST, TEAM…, USA and WORLD. It missed the
codes ESPN used in 2022-26 (LEB, DUR, GIA, SHQ, CHK, KEN, CAN, STARS, STRIPES). Two effects:
- an All-Star's game counted toward his minutes history;
- an All-Star who sat just before the break was read as "gone" and left off his team's roster.

About 4% of team-games moved, mostly by small amounts. Found while building absence-1 on the same
replica (ABSENCE_ROLES_RESEARCH.md). `research-injury-close.js` now uses a 30-team list.

**Rerun:**

| | As published | Fixed |
|---|---|---|
| I1 slope of resid on A | +0.087 ± 0.055 (t 1.57) | +0.083 ± 0.055 (t 1.51) |
| I2 engine-with-availability gap | +0.067 ± 0.069 (t 0.98) | +0.063 ± 0.069 (t 0.90) |
| I4 pitch-3's rule, 5+ points | 1,069 of 2,564 vs 1,055.1 (z 0.60), −4.5% | 1,067 of 2,561 vs 1,055.4 (z 0.50), −5.0% |
| I3 results per point of A | 0.959 ± 0.056 | 0.955 ± 0.056 |
| Brier, engine with availability | 0.2074 | 0.2075 |

Still 0 of 3 pass. No conclusion changes.
