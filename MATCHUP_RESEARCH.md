# Matchup research (matchup-1) — pre-registration

Written and committed on 2026-11-15, before any of it was scored. The analysis is
`research-matchup.js`. Nothing here changes the engine: a feature that passes is
logged forward as a shadow measure and judged live against the closing line.

## The question

When a favourite loses, was it variance, or a weakness the other team could
exploit (the 2026 Finals: the engine picked San Antonio four times, New York won
4-1, the Spurs won every first quarter and the Knicks every second half)? Can
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
