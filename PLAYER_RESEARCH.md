# Player-level patterns vs prop lines — research `player-1` (pre-registered 2026-11-16)

Written and committed before any player box line or prop line is fetched in bulk, and before any
feature is compared with a line. Code: `research-player.js`, written after this commit.

## Why

The team-level studies found the closing spread and total price what box scores and schedules can
tell us. The user asked whether patterns live at the player level instead: fatigue, shooting
streaks, mismatches, role changes. Player props are the market where that would show, and published
work suggests it's less efficient than game lines.

**Literature** (searched 2026-11-16, abstracts and summaries only):
- **Hot hand:** a real but small shot-level effect (Bocskocsky, Ezekowitz and Stein, SSRN 2014;
  Miller and Sanjurjo, *Econometrica* 2018). It shows in free throws and not field goals (CEPR
  column).
- **Fatigue at the player level:** no peer-reviewed study found. Tracking data showed players move
  more slowly on back-to-backs, especially high-minute starters (blog). Team studies show
  back-to-back and travel effects on win rates (Charest et al. 2021).
- **Defence against position:** a vendor backtest found it mostly noise, because switching defences
  blur positions.
- **Prop efficiency:**
  - A 2026 Claremont thesis (Wornow) used FanDuel closing prop lines for 2022–25. The points market
    deviated most from its lines after mobile betting legalization, concentrated in centres and
    forwards.
  - No peer-reviewed study of prop-line efficiency found.
- **Market psychology:** bettors chase streaks (Camerer 1989; Paul and Weinbach), so a book might
  shade lines up for hot players.

## Data

- **Player box lines:** ESPN game summaries for 2022-23 to 2025-26 regular seasons, refetched for
  this study (free). Per player and game: team, position, starter, minutes, points, rebounds,
  assists, threes made and attempted, shots and free throws.
- **Prop lines:** ESPN's core odds `propBets` for the same games, from every book except live
  lines.
  - **Feasibility probe before this file:**
    - none in 2021-22;
    - four or five books a game in 2022-23 and 2023-24 (Caesars, DraftKings, BetMGM, BetRivers,
      PointsBet, ESPN BET);
    - ESPN BET only in 2024-25;
    - ESPN BET early in 2025-26, then none.
  - **Each record:** player, stat type, the line (`current.target`), the over price, and an opening
    line.
  - **The line used:** per player, game and stat, the median current line across books.
- **The stat decided:** points (the most liquid prop, and where Wornow found the deviation).
  Rebounds, assists and threes are described.
- **resid** = actual stat − line. A push (resid 0) is left out of over/under counts.
- **Scored player-games:** the player has at least 5 prior games that season, and played tonight.
  A prop on a player who doesn't play is void and not scored.
- **Train:** 2022-23 + 2023-24 (several books). **Holdout:** 2024-25 + the 2025-26 games with lines
  (one book).

### Validity gate, checked before any feature is scored

- If the "current" lines were live, set during the game, they'd predict far better than the opening
  lines.
- **The gate fails** if, on points, the sd of (actual − current line) is below 0.8 × the sd of
  (actual − opening line). The study stops.
- Also reported:
  - the share of misses within 1 point;
  - the sd by season;
  - how often the line moved from its open.

## Features (season to date before tonight; ≥ 5 prior games)

- **H, hot streak:** the player's mean points over his last 3 games minus his season-to-date mean
  before them.
- **F1, back-to-back:** the player's team played yesterday (0/1).
- **F2, minutes load:** his minutes over his last 3 games minus his season-to-date mean minutes, per
  game.
- **M, matchup:** points per game the opponent has allowed to the player's position group (guards,
  forwards, centres from ESPN's position) so far this season, minus the league's figure for that
  group, shrunk with 10 games of prior at zero.
- **R, role trend:** his minutes in his last game minus his season-to-date mean minutes.
- **T, teammate out:** a top-2 teammate (by minutes per game, situ-1's roster rule) is out tonight
  (0/1). That's a usage boost, and who plays is on the injury report before tip.

## Questions (target: points resid against the prop line)

| Q | Feature | Predicted slope |
|---|---|---|
| P-H | hot streak | − (lines overreact to streaks) |
| P-F1 | back-to-back | − (lines under-adjust for fatigue) |
| P-F2 | minutes load | − |
| P-M | matchup | + (lines under-price the matchup) |
| P-R | role trend | + (lines lag role changes) |
| P-T | teammate out | + (lines under-adjust usage) |

**Standard errors** are clustered by game: props in the same game share pace and game script.

**Pass:** all three of
1. train |t| ≥ 2;
2. the holdout has the same sign with |t| ≥ 1;
3. a practical edge: betting the predicted side on the feature's top 20% (for 0/1 features, the
   flagged games) wins more than 52.4% (−110's break-even) in train *and* holdout.

A pass against the predicted sign is reported as such, and has to meet condition 3 on the side it
actually favours.

**False passes:** 6 decisions. The chance that noise passes at least one is about 5%: each needs
the train t, the holdout sign and the 52.4% bar twice.

**Described, not decided:**
- each feature against the player's own baseline (actual − season-to-date mean): does it move
  performance at all, whether or not the line knows?
- rebounds, assists and threes against their lines;
- each season;
- by position group;
- the over and under rates at the line overall;
- the 1% largest |resid| trimmed.

## What a pass leads to

- A live shadow on the props ledger: tonight's feature beside the FanDuel line the odds feed already
  pulls, judged by result and line movement.
- Never a bet before it holds live, and never a stake size.
- **All failing** would mean the prop market prices fatigue, streaks, matchups, role and usage
  about as well as the game lines price team information.

## Amendment (2026-11-16, before any feature was scored)

**Found in the data checks after the fetch:**
- Every book in 2022-24 stores exactly two records per prop (over and under) at one line.
- ESPN BET in 2024-26 lists several points lines for the same player:
  - alternates in 2024-25 (78% of its props have more than one line, e.g. 11.5 at −125 and 12.5
    at −110);
  - milestone ladders in 2025-26 (99.8%, e.g. 4.5 … 29.5, mostly unpriced).
- The first code took the first record per book, so the holdout's "line" was an arbitrary rung.
  It showed as line minus the player's average with an sd of 6.1–6.6, against 2.9–4.0 for the
  several-book seasons, and overs at 37% in 2025-26.

**The rule, set now (no feature scored yet):**
- When a book lists more than one line for a player and stat, its main line is the priced line
  whose over price is closest to −110 (implied 52.4%).
- Only prices at a 40–65% implied chance count. With none, that book's prop is dropped.
- A book with a single line is unchanged, so 2022-24 is unaffected.
- The validity gate and data checks are rerun under this rule before scoring.

## Amendment 2 (2026-11-16, before any feature was scored)

**Found:** the pooled validity gate passed (0.929), but per book and season, some "current" lines
were updated during games.

| Book-season | Moved lines' error ratio to the open | Corr(move, actual − open) | Moves of 3+ points |
|---|---|---|---|
| 2022-23 Caesars / DraftKings / PointsBet | 0.61–0.67 | 0.74–0.79 | 53–57% |
| 2022-23 BetMGM / BetRivers | never moved (current = open) | — | — |
| 2023-24, all six books | 0.98 | 0.18–0.22 | 5–9% |
| 2024-25 ESPN BET | 0.88 | 0.48 | 29% |
| 2025-26 ESPN BET | 0.93 | 0.37 | 10% |

- A pre-game move predicts the result only modestly (2023-24). A line updated during play tracks
  it (2022-23).
- 2024-26 are a mix.

**The rule, set now:**
- **Train:** 2023-24 closing (current) lines, the only clean closing lines.
- **Holdout:** 2024-25 and 2025-26 *opening* lines. They're pre-game by definition, but less sharp
  than closers, so a holdout pass shows the feature beats the opener, not the close.
- **2022-23:** out of the decisions, though its opening lines are described.
- **Unchanged:** the questions, features, clustering and pass rule.
- **Also described:** each feature against 2023-24's opening lines, to show how open and close
  differ.
