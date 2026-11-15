# Shooting luck and schedule vs the close — research `luck-sched-1` (pre-registered 2026-11-15)

Questions written and committed before any of these features is computed or scored. Code:
`research-luck-schedule.js` (written after this file is committed). Data: matchup-1 Part B's games
(`.cache/espn-nba/hist-team`, team box lines; `.cache/espn-nba/hist-odds`, closing lines).

## Why

The user asked where profit could come from, and whether the model leans on the market. The engine
takes no market input; the market is the bar it's measured against. Against that bar:
- **matchup-1** (`MATCHUP_RESEARCH.md`): only one feature beat the closing spread on three seasons,
  a team's own back-to-back split (Q3b, now the shadow `b2b-1`).
- **Upsets** leaned on shooting luck: winning underdogs shot about +9 points above their norm, against
  +6 for all winners. In-game luck can't be known before tip, but the market might **overreact to past
  luck**, pricing a hot-shooting team as if it will keep shooting that way.
- **matchup-1 Q3e** (last-5 net rating minus the season) had train t 1.79 and holdout t 0.81. That is
  a positive lean (recent form beat the close slightly) that didn't pass. It mixes skill and luck, so
  this splits them.
- **The schedule:** the back-to-back split is the only thing that beat the close. The rest of the
  schedule (density, travel, time zones, road trips, altitude) wasn't tested.

## Data and target

- **Games:** 2023-24, 2024-25 and 2025-26 regular seasons, between the 30 NBA teams (All-Star and
  other exhibition teams dropped). The closing line is DraftKings where listed, else ESPN BET. Lines
  whose spread favourite contradicts the moneyline are dropped, as in matchup-1.
- **Target:** resid = actual home margin − closing market margin (−`spreadHome`).
- **Leak-free:** every feature uses only games before the scored game's date.
- **Scored games:** both teams have at least 5 prior games that season (the same set for every
  question).
- **Train:** 2023-24 + 2024-25. **Holdout:** 2025-26.

## Questions (slope of resid on each feature; feature = home minus away unless noted)

### Shooting luck (L)

A team-game's **luck**, in points:

    3 × (3PM − 3PA × own 3P%) + (FTM − FTA × own FT%)
    − [3 × (opp 3PM − opp 3PA × opp's 3P%) + (opp FTM − opp FTA × opp's FT%)]

Each shooter's 3P% and FT% are its own season-to-date figures as of the scored date, shrunk to the
league's (3P%: k = 300 attempts; FT%: k = 150 attempts). Defensive 3-point luck is measured against the
shooting team's own skill, not the league's.

| Q | Feature | Predicted slope |
|---|---|---|
| L1 | recent luck: mean luck over each team's last 5 games | negative (the market overreacts) |
| L2 | season luck: mean luck over all its prior games | negative |
| L3 | last game's luck | negative |
| L4 | luck-adjusted form: (last-5 mean margin − last-5 mean luck) − (season mean margin − season mean luck) | positive (Q3e's lean was the skill part) |

### Schedule (S)

The location of a game is the home team's city (a neutral-site game is placed at the home team's
city, a known small error). Time zones are standard offsets (Phoenix as Mountain).

| Q | Feature | Predicted slope |
|---|---|---|
| S1 | 3 games in 4 nights (tonight is the team's 3rd game in the 4 days ending tonight): home flag − away flag | negative |
| S2 | days of rest since the last game, capped 0–3 (0 = back-to-back; the season opener counts as 3) | positive |
| S3 | distance travelled from the last game's city, in 1,000 km | negative |
| S4 | time zones moved east since the last game (west is negative) | negative |
| S5 | away team's game number on its current road trip, capped at 6 (not home minus away) | positive |
| S6 | home team's first home game after 3+ straight road games (flag, not home minus away) | negative |
| S7 | home team is DEN or UTAH, altitude (flag, not home minus away) | positive |

S7 asks whether the market under-prices altitude. Its feature is the same in every game at those two
arenas, so it is a mean residual, not a slope across games.

## Decision (same as matchup-1)

- **Pass:** train |t| ≥ 2 and the holdout has the same sign with |t| ≥ 1. A pass against the predicted
  sign is reported as a pass with an unexpected sign.
- With 11 questions, the chance of at least one false pass is about 8% (about 0.8% each:
  5% two-sided in train, then about 16% for the holdout's same sign at |t| ≥ 1).
- **What a pass leads to:** a shadow measure logged on ledger rows and judged live against the close,
  like `b2b-1`. Never an engine change, and never a bet before it holds live.

## Reported beside the decision (descriptive, not part of it)

- each feature's correlation with the market margin and with the `b2b-1` feature;
- the pooled three-season t;
- each season on its own;
- for a pass: robustness to the shrinkage constants (3P% k = 150 and 600), to the window (last 3 and
  last 10 for L1), and to dropping the 1% largest residuals.

The 2026-27 season so far (83 ledger games) is too small to score, so it isn't used.

## Results (run 2026-11-15, after the pre-registration commit e7e70ea)

`node research-luck-schedule.js --robust`. Data:
- **Seasons:** 2023-24 (1,147 games scored), 2024-25 (1,141) and 2025-26 (1,139). That's 2,288 train
  and 1,139 holdout games.
- **Left out:** 8 exhibition-team games, 13 without a close, 16 whose spread contradicted the
  moneyline, and games before both teams had 5 prior games.
- **The residual against the close:** mean −0.05 in train and −0.22 in the holdout; sd 13.6 and 13.9.

| Q | Feature | Predicted | Train t | Holdout t | Result |
|---|---|---|---|---|---|
| L1 | recent luck (last 5) | − | −1.52 | 0.53 | no |
| L2 | season luck | − | 1.02 | −1.68 | no |
| L3 | last game luck | − | −0.70 | −0.89 | no |
| L4 | luck-adjusted form | + | **3.96** | −0.27 | no |
| S1 | 3 games in 4 nights | − | −1.02 | −0.17 | no |
| S2 | rest days (0–3) | + | 1.78 | −0.82 | no |
| S3 | travel distance | − | −0.83 | −1.12 | no |
| **S4** | **time zones moved east** | − | **−2.25** | **−1.31** | **PASS** (−0.60 ± 0.27 points per zone in train) |
| S5 | away road-trip game number | + | 1.82 | 0.18 | no |
| S6 | home first game after 3+ road | − | −1.05 | −0.43 | no |
| S7 | altitude home | + | 1.05 | −0.03 | no |

Per-season t for S4: −0.73 (2023-24), −2.46 (2024-25), −1.31 (2025-26). It's uncorrelated with the
market margin (r 0.009) and with `b2b-1` (r 0.010).

**Shooting luck:** the market doesn't overreact to past shooting luck in any window (last game, last
3/5/10, season). The luck questions don't depend on the 3P% shrinkage (k 150 or 600). L4,
luck-adjusted form, was strong in both training seasons (t 2.14 and 3.46), but the sign reversed in
2025-26 (t −0.27). It passes nothing.

**S4 checks** (none pre-registered):

| Check | Train t | Holdout t | Still passes |
|---|---|---|---|
| neutral-site games and each team's next game dropped (37 games) | −2.31 | −1.27 | yes |
| the same, with US daylight time (Phoenix excepted) | −2.25 | −1.13 | yes |
| neutral-site games placed at their venue (Mexico City, Paris, Berlin, London, Las Vegas) | −2.26 | −0.71 | no: the transatlantic trips (±7 zones) dominate the slope |
| the 1% largest residuals dropped | −2.02 | −0.59 | no |

Where the effect sits, over all three seasons (S4 = home zones moved east − away's):

| S4 | −3 | −2 | −1 | 0 | +1 | +2 | +3 |
|---|---|---|---|---|---|---|---|
| games | 64 | 204 | 607 | 1,707 | 584 | 193 | 68 |
| mean residual | +2.22 | +0.34 | +0.22 | +0.02 | −0.15 | −2.78 | −1.88 |

One zone shows nothing; the effect is in 2–3 zone moves. As a bet against the team that moved east
2+ zones:

| Season | Against the spread |
|---|---|
| 2023-24 | 99-82-3 (54.7%) |
| 2024-25 | 90-76 (54.2%) |
| 2025-26 | **82-97 (45.8%)** |

The holdout's mean residual was in the predicted direction (+1.66 points), but most of its games went
the other way. The mean was carried by a few lopsided games, which is also why the 1% trim breaks it.

Exploratory, chosen after seeing the table: home teams just back from a 2+ zone eastward trip lost to
the spread by 3.4, 2.2 and 2.1 points on average. Fading them went 64%, 52% and 47%, and the 2025-26
median residual was +1.5. That's not consistent either.

## Conclusion

- **Shooting luck:** no overreaction to past luck. Upsets lean on luck in the game itself, which
  can't be known before tip, and the close already ignores past luck about right.
- **Schedule:** only eastward time-zone travel passed. It passes by the letter of the rule but not
  robustly:
  - the 1% trim breaks it;
  - the holdout's record against the spread lost (45.8%);
  - the effect lives in a few lopsided games after 2–3 zone moves.
- **Recommendation:** treat S4 as unconfirmed, not as a second `b2b-1`. The pre-registered next step
  for a pass is a shadow measure. If one is added, it should be judged on its median, or on its
  record against the spread, as well as its mean.
- **What this rules out:** with matchup-1, 23 team, style, situational, luck and schedule features
  have now been tested against the close on three seasons. One is robust (the team-specific
  back-to-back split), and one is fragile (eastward travel). The closing spread already prices
  almost everything we can build from box scores and the schedule.
