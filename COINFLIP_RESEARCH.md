# Coin flips: volatility and the shooting matchup — research `coinflip-1` (pre-registered 2026-11-16)

Written and committed before any of these features is computed or scored. Code:
`research-coinflip.js`, written after this commit.

## Why

The user asked why games the market prices as 50/50 often aren't close, and whether a pattern
(fatigue, shooting, game plans, matchups) could explain it.

A look before this file, descriptive and not tested (2021-26, closing lines):
- **Coin flips are more volatile:** where the favourite was priced 50–55%, the result missed the
  closing spread by an sd of 14.6 points, against 13.5 for 55–65% favourites and 13.1 for 65%+.
  29.9% were decided by 15+, against about 27% expected from normal variation.
- **Shooting decides them:**
  - Each final margin splits exactly into points expected from shot volume at each team's own
    season-to-date make rates, plus threes, twos and free throws made above those rates.
  - In coin flips, threes made above normal account for 58% of the margin's variation, twos 32%,
    shot volume 8%.
  - In coin flips won by 15+, the winner's 22.7 points came 13.2 from threes above normal, 6.7 from
    twos and 2.2 from volume.
- **Already tested, not repeated here:**
  - Past shooting luck doesn't predict the close's errors (luck-sched-1).
  - matchup-1's three-point interaction measured attempt volume (3PA rate × opponent 3PA rate
    allowed); its four-factor composite (Q2a) folded shooting accuracy in with everything else.
  - Neither beat the close.

Two questions remain:
- **Volatility:** can anything known before tip say which games will be lopsided, in either
  direction?
- **Direction:** is part of the "shooting above normal" really the matchup (a team's three-point
  accuracy against this defence's accuracy allowed), and does the close miss it?

## Data

- **Main seasons:** 2021-22 to 2025-26 regular seasons. ESPN team box lines (`.cache/espn-nba/old`,
  `hist-team`) and the closing lines used by engine-close-1:
  - DraftKings' listed line in 2021-23;
  - DraftKings' close, else ESPN BET's, in 2023-26.
  - Lines whose spread contradicts the moneyline are dropped.
- **Point-in-time:** every feature uses only the team's games before the scored date that season.
  Both teams need at least 5 prior games.
- **Train:** 2021-22 to 2023-24. **Holdout:** 2024-25 and 2025-26.
- **For V4 only:** 2015-16 to 2020-21 (`.cache/espn-nba/early`, the median sportsbook line from
  engine-close-2). These seasons have never been scored for volatility, and have scores but no box
  lines.
- **Targets:**
  - **resid** = actual home margin − market margin (−spread).
  - **|resid|** is the miss size, used for volatility.

## Features (season to date, before tonight)

- **Three-point attempt rate:** 3PA / FGA.
- **Possessions per game:** FGA − OREB + TOV + 0.44 × FTA.
- **Own volatility:** the sd of the team's resid in its prior games with a close (at least 5).
- **Shrunk three-point accuracy:**
  - **for:** (3PM + 300 × league rate) / (3PA + 300);
  - **allowed:** the same with opponents' makes and attempts against the team.
  - The league rate is season to date.
- **Starters out:** the team's top 5 by minutes per game (5+ games for it, still on it, as in
  situ-1), with 2+ of them not playing tonight. Who plays is on the injury report before tip.

## Questions

### Volatility (target |resid|; slope per standard deviation of the feature)

| Q | Feature (game level) | Predicted |
|---|---|---|
| V1 | mean of the two teams' three-point attempt rates | + (more threes, more variance) |
| V2 | mean of the two teams' possessions per game | + |
| V3 | mean of the two teams' own volatility | + |
| V5 | either team with 2+ of its top 5 out (a 0/1 flag) | + (late news, more uncertainty) |
| V4 | coin flip (favourite 50–55% by the no-vig line) against all other games, on 2015-21 | + |

### Direction (target resid, or the in-game shooting)

**D1.** The three-point matchup edge, in points:

    3 × [home 3PA per game × (home 3P% for − league + away 3P% allowed − league)
         − away 3PA per game × (away 3P% for − league + home 3P% allowed − league)]

- The slope of resid on it.
- Predicted + (the close under-prices the matchup).
- Disclosed: it overlaps matchup-1's four-factor composite (Q2a), which included shooting accuracy.

**D2.** The same feature against the in-game three-point shooting difference: home threes above
normal minus away's, in points, using pre-game rates as in the descriptive look.
- Predicted +: part of "shooting above normal" is the matchup.
- This explains rather than bets: a pass says the matchup is visible in the shooting; only D1
  says whether the close misses it.

**Also reported, not decided:**
- D1 on coin flips only;
- each season;
- |resid| sd by feature quintile;
- the 1% largest |resid| trimmed.

## Decision

- **V1–V3, V5, D1, D2:** pass if train |t| ≥ 2 and the holdout has the same sign with |t| ≥ 1, as in
  matchup-1. A pass against the predicted sign is reported as such.
- **V4:** pass if coin flips' mean |resid| exceeds the other games' with t ≥ 2 (Welch) on 2015-21.
- **False passes:** 7 decisions. The chance that noise passes at least one is about 7%.

## What a pass leads to

- **A volatility pass (V1–V5):** a volatility flag logged on ledger rows as a shadow. Used
  descriptively for parlay legs and alternate lines, which suffer most from variance. It picks no
  side.
- **D1 passing:** a direction shadow judged live against the close, like b2b-1.
- **D2 alone:** "shooting luck" is partly predictable from the matchup, but the close already
  prices it.
- **Never** an engine change, and never a bet before it holds live.
