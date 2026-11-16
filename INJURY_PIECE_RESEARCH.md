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
