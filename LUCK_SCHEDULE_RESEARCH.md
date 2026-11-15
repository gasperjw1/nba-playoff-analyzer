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
