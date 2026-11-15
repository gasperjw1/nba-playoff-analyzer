# Matchup research (matchup-1) — pre-registration

Written and committed on 2026-11-15, before any of it was scored. The analysis is
`research-matchup.js`. Nothing here changes the engine: a feature that passes is
logged forward as a shadow measure and judged live against the closing line.

## The question

When a favourite loses, was it variance, or a weakness the other team could
exploit (the 2026 Finals: New York won 4-1; the engine picked the wrong winner in
4 of 5 games, San Antonio in three New York wins; the Spurs won every first
quarter and New York came back in all four of its wins)? Can
advanced and situational team stats, known before tip, predict where results
land against the market?

## Data

- **Games scored (Part A):** the 82 settled season-ledger games (2026-11-02 →
  2026-11-13), each with the DraftKings close (`close.spreadHome`, all 82) and
  the engine's recorded `marginOurs`.
- **Team stats:** ESPN box scores (`.cache/espn-nba/summary-<id>.json`) for every
  2026-27 regular-season game from 2026-10-20. A team's profile for a game uses
  only its games on earlier dates (leak-free).
- **Target:** `resid = actual home margin − market margin`, market margin =
  `−close.spreadHome`. Also reported against the engine: `actual − marginOurs`.

## Definitions

Per team-game, from the box score: possessions = FGA − OREB + TOV + 0.44·FTA
(the two teams' estimates averaged); offensive rating = 100·points/possessions;
eFG% = (FGM + 0.5·3PM)/FGA; TOV% = TOV/(FGA + 0.44·FTA + TOV); ORB% =
OREB/(OREB + opponent DREB); FT rate = FTM/FGA; 3PA rate = 3PA/FGA; paint share
= points in the paint/points; transition = fast-break points/possession; half
margins from the quarter scores.

Profiles: each stat for the team (offence) and for its opponents in its games
(defence), shrunk to the league mean of all prior games with **k = 5**
pseudo-games: `(sum + k·league)/(n + k)`. Situational splits are shrunk to the
team's own overall value with the same k.

## Questions

**Q1 — upset audit (descriptive and tested).**
- Shooting luck per team = (3P% − its shrunk prior 3P%)·3PA·3 + (FT% − prior
  FT%)·FTA, in points; net = home − away.
- Q1a: slope and R² of `resid` on net luck.
- Q1b: for upsets — the market's favourite at ≥ 65% loses, and separately the
  engine's — the mean net luck toward the underdog, and the mean margins in
  turnovers, offensive rebounds, free-throw attempts and paint points, against
  all games. Each upset is listed with its tags.

**Q2 — advanced stats against the market.**
- Q2a: the four-factor expected margin (each side's shrunk offence against the
  other's shrunk defence, the four factors weighted by a fixed linear fit to
  points per possession on the prior games only, plus 2.0 home court) minus the
  market margin, against `resid`.
- Q2b–Q2f, style interactions ("strength meets weakness", home minus away,
  each a product of deviations from the league mean): rebounding (ORB% ×
  opponent ORB% allowed), threes (3PA rate × opponent 3PA rate allowed), rim
  (paint share × opponent paint share allowed), turnovers (TOV% × opponent TOV%
  forced), transition (fast-break rate × opponent fast-break rate allowed).

**Q3 — situational advanced stats.** Each as home minus away, against `resid`:
- Q3a home/road: the team's net rating at tonight's venue type minus its
  overall.
- Q3b rest: net rating on back-to-backs minus rested, for a team on a
  back-to-back tonight (zero otherwise).
- Q3c opponent strength: net rating against above-average opponents (by prior
  net rating) minus below-average, applied by tonight's opponent's side.
- Q3d adjustments: second-half net margin per game minus first-half.
- Q3e form: net rating over the last 5 games minus the season.
- Q3f close games: fourth-quarter margin in games within 6 after three
  quarters.

**Q4 — variance.** Underdogs' wins minus the market's chance (no-vig), games
split at the median of the two teams' combined prior 3PA rate; z of the
difference between the halves.

## Decision

- 82 games cannot settle any of this: a 1-point-a-game effect needs about 600
  games to clear 2 standard errors against a 12-point residual. Part A is
  exploratory.
- A feature is **worth logging forward** if |t| ≥ 2 on Part A. With 13 tests,
  about 0.65 false passes are expected by chance, so any pass is a hypothesis,
  not a finding. |t| ≥ 2.9 (Bonferroni, 13 tests) is reported as notable.
- **Part B (pre-registered, run separately):** the same features on 2023-24,
  2024-25 and 2025-26 (box scores fetched from ESPN, closing lines from
  `.cache/espn-nba/hist-odds`): train on the first two seasons, holdout
  2025-26. A feature counts only if train |t| ≥ 2 and the holdout has the same
  sign with |t| ≥ 1, the rule used in `research-favourites.js`.

## Results, Part A (scored 2026-11-15)

`node research-matchup.js`: 82 games, none dropped; profiles from 183 season
games; teams had a median of 8 prior games (minimum 4) at scoring.

Checks before reading the results:
- Every team line satisfies 2·FGM + 3PM + FTM = score (376 of 376), and the
  quarter scores sum to the finals.
- League values look normal: pace 102.5, eFG .535, 3P% .351.
- The four-factor fit has the expected signs: eFG +149, TOV% −145, ORB% +48,
  FT rate +30.
- Correlation with the market margin: the four-factor margin 0.81, the engine
  0.92.
- ATL@CHI net luck recomputed by hand: 30.32 (script 30.3). Back-to-back games
  counted independently: 23 (script 23).

| Q | Feature | t (k = 5) | k = 2 | k = 10 | Reading |
|---|---|---|---|---|---|
| Q1a | net shooting luck (in-game) | 8.81, R² 0.49 | | | describes results; not knowable before tip |
| Q2a | four-factor margin − market | −1.17 | −0.59 | −1.61 | no |
| Q2b | rebounding interaction | 0.63 | 0.62 | 0.64 | no |
| Q2c | three-point-rate interaction | −0.99 | −1.02 | −0.95 | no |
| Q2d | rim interaction | −0.81 | −0.73 | −0.88 | no |
| Q2e | turnover interaction | −0.53 | −0.49 | −0.55 | no |
| Q2f | transition interaction | −2.17 | −2.14 | −2.19 | passes \|t\| ≥ 2: log forward |
| Q3a | venue split | 1.53 | 1.16 | 1.70 | no |
| Q3b | rest split (23 games) | 0.82 | 0.90 | 0.69 | no |
| Q3c | opponent-strength split | 0.60 | 0.46 | 0.71 | no |
| Q3d | second half − first half | −0.99 | −0.99 | −0.98 | no |
| Q3e | last-5 form | −0.52 | −0.98 | −0.19 | no |
| Q3f | fourth quarter, close games | 1.93 | 1.67 | 2.09 | just short at k = 5 |

Only k = 5 counts; the k = 2 and k = 10 runs are robustness checks and were not
pre-registered.

**Q1b upsets** (9 market upsets at ≥ 65%, 9 engine upsets):
- The winning underdogs got +13.0 points of shooting luck on average, against
  +6.1 for all winners.
- They were level or behind on the repeatable margins: turnovers −0.1,
  offensive rebounds −0.3, free-throw attempts −2.2, paint points −2.7.
- 7 of the 9 market upsets had 5+ luck points toward the underdog, 4 of them
  20+.

**Q4 variance:** the high-3PA half had no more upsets than the low half
(z −0.29). Over all 82 games, underdogs won 18 against 25.6 expected at the
close (z −1.87): so far, fewer upsets than the market priced, not more.

**Reading:**
- On this sample, upsets look mostly like shooting variance.
- No advanced or situational stat beat the close beyond what chance allows.
  One pass in 13 tests (Q2f, \|t\| 2.17, stable across k) is about the 0.65
  expected by chance.
- Q2f is logged forward as a hypothesis, and Q3f is worth watching.
- Part B (three seasons, train/holdout) is the test with power, and it has not
  been run.

## Results, Part B (scored 2026-11-15)

`node research-matchup.js --fetch-hist` fetched 3,701 games (0 failed) as
trimmed team box lines into `.cache/espn-nba/hist-team`. Then
`node research-matchup.js --part-b` scored train 2,321 games (2023-24 +
2024-25) and holdout 1,155 games (2025-26).

Choices made after pre-registration, stated here because they weren't in it:
- Each team needs 4 prior games before it is scored (Part A's minimum).
- No fit is made before 20 prior team-games in a season.
- 16 games are dropped because their spread's favourite contradicts the
  moneyline's.
- Book: DraftKings where listed, else ESPN BET, as in `research-favourites.js`.

Checks:
- Residual vs the close: mean −0.06 (train) and −0.18 (holdout), sd 13.6 and
  13.9.
- The four-factor margin correlates 0.86 with the market margin in both.
- Part A's output is unchanged by the refactor (diffed).

| Q | Feature | train t | holdout t | Decision |
|---|---|---|---|---|
| Q2a | four-factor margin − market | −0.43 | −0.81 | no |
| Q2b | rebounding interaction | 0.42 | 0.21 | no |
| Q2c | three-point-rate interaction | 0.25 | −0.02 | no |
| Q2d | rim interaction | 0.01 | 0.01 | no |
| Q2e | turnover interaction | 1.53 | −0.17 | no |
| Q2f | transition interaction | 0.35 | 0.96 | no (Part A's −2.17 did not replicate) |
| Q3a | venue split | 1.60 | −0.88 | no |
| **Q3b** | **rest split (team-specific back-to-back)** | **2.51** | **2.57** | **PASS** |
| Q3c | opponent-strength split | 0.84 | 0.52 | no |
| Q3d | second half − first half | −1.46 | −1.87 | no (same sign, too weak) |
| Q3e | last-5 form | 1.79 | 0.81 | no |
| Q3f | fourth quarter, close games | −0.23 | 0.46 | no |

A chance pass under this rule has probability about 0.007 per test, or about
0.08 across all 12.

**Q3b checks** (robustness checks, none of them
pre-registered):
- **Every season:** positive in each season on its own (t 1.61, 1.94, 2.57).
- **Settings:** passes at k = 2 (t 2.71 / 2.48) and k = 10 (2.29 / 2.55), and
  with a minimum of 1 or 10 prior games.
- **Outliers:** survives dropping the 2% most extreme values (t 2.07 / 2.39).
- **The market doesn't price it:** correlation with the market margin is 0.04
  (train) and −0.04 (holdout).
- **Size:** in back-to-back games, 1 sd of the feature (4.6 net points per 100
  possessions) moves the result about 1.3 (train) to 2.0 (holdout) points
  against the close.
- **Against the spread** (top half of the feature): 52.6% on 350 train games
  and 54.3% on 173 holdout games. Break-even is 52.4%, and the standard errors
  are 2.7 and 3.8 points, so it isn't yet proven to beat the vig on its own.

**Q1 upsets** (≥ 65% favourites that lost: 296 train, 139 holdout):
- Winning underdogs had +9.8 and +8.7 points of shooting luck, against +6.1 and
  +5.8 for all winners.
- 65% and 61% of upsets had 5+ luck points toward the winner, against 52% of all
  games.
- On turnovers, offensive rebounds, free throws and paint points, upset winners
  were about level, where winners in general lead.
- In-game shooting luck explains 43% (train) and 37% (holdout) of the residual's
  variance.

**Q4 variance:** no effect (difference z 0.18 train, 1.06 holdout). Underdogs
won about what the close priced: 707 against 725.9 (z −0.87) and 351 against
355.1 (z −0.27).

**Reading:**
- **Advanced stats:** the four factors and the style interactions add nothing
  beyond the closing line.
- **Upsets:** they lean heavily on shooting variance.
- **One real signal:** how a particular team performs on back-to-backs compared
  with its rested games, beyond the generic penalty the market applies. Teams
  that historically drop off on the second night do worse than the close says,
  and teams that hold up do better.
- **Next:** log Q3b forward as a shadow measure, judged live against the close.
  The engine is unchanged.
