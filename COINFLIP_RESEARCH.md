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

## Results (run 2026-11-16, after the pre-registration commit c69be1b)

`node research-coinflip.js`: 5,728 games (train 3,448, holdout 2,280). Mean |resid| 10.49, resid
sd 13.45.

**Checked before scoring:**
- **One game rebuilt by independent code from the raw box files** (HOU at PHI, 2024-01-15): league
  three-point rate 0.3665, PHI 32.49 threes a game and shrunk accuracy 0.3675, HOU's accuracy
  allowed 0.3447, mean attempt rate 0.3736. All match the script.
- **The starters-out flag** fires in 46.4% of games, consistent with a team having all of its top 5
  only 39% of the time (injury-close-1).

| Q | Feature | Train t (per sd) | Holdout t (per sd) | Decision |
|---|---|---|---|---|
| V1 | mean three-point attempt rate → miss size | 1.70 (+0.24) | 0.36 (+0.06) | no |
| V2 | mean possessions → miss size | 0.61 (+0.09) | −0.55 (−0.10) | no |
| V3 | mean own volatility → miss size | 1.30 (+0.18) | 1.10 (+0.20) | no (same sign, too weak) |
| V5 | 2+ of a top 5 out → miss size | 0.02 | −1.32 | no |
| V4 | coin flips more volatile, 2015-21 | 10.20 vs 9.71 points, t **1.86** | | no (just short) |
| D1 | three-point matchup → resid | −1.51 (−0.34) | −0.71 (−0.20) | no |
| D2 | three-point matchup → in-game three-point shooting | −0.33 (−0.07) | −1.99 (−0.51) | no |

**0 of 7 pass.** V4 was recomputed from the raw files with separate code: 10.20 (n 962) vs 9.71
(n 6,030), t 1.86.

**Described:**
- **Coin flips' extra volatility** has the same sign in both eras: 2015-21, t 1.86; 2021-26 (seen
  before this file), 11.61 vs 10.32. By the spread instead (|spread| ≤ 1.5, 2015-21): t 1.20.
- **By quintile** (resid sd), there's a mild rise for attempt rate and own volatility, within about
  1 point:
  - V1: 12.87 / 13.36 / 13.16 / 13.94 / 13.88;
  - V3: 12.88 / 13.30 / 13.37 / 13.94 / 13.76.
- **Trimmed** (1% largest |resid|): V1 t 1.32, V3 t 1.53, D1 t −2.00.
- **D1 on coin flips only:** t 0.27.

**D2's design was flawed** (found in checking; the split below wasn't pre-registered):
- The matchup edge includes each team's own three-point accuracy, and "shooting above normal" is
  measured against that same rate, so the two pull against each other.
- The exact split, own part + defence part = D1 (to 1e-15):

  | Part | → in-game three-point shooting | → resid |
  |---|---|---|
  | own accuracy above league | t **−5.03** (−0.81 per sd) | t −1.44 |
  | opponent's accuracy allowed | t **+3.67** (+0.59 per sd) | t −0.96 |

- **Own part:** teams that have shot well regress more than the 300-attempt shrinkage assumes.
- **Defence part:** the defence faced visibly moves the shooting, as expected.
- **Neither predicts the close's error.** The market prices both.

## Conclusion

- **Lopsided coin flips are mostly shooting variance inside the game**, which nothing before tip
  predicts beyond what the close already prices.
- **Coin flips are a little more volatile than other games** (t 1.86 on six unseen seasons, the same
  direction as 2021-26), but short of the bar.
- **No pre-game feature reliably predicts which games will be lopsided:** attempt rate, pace, team
  volatility and starters out all failed.
- **The three-point matchup shows up in the shooting but not against the close.**
- **For the user's bets:**
  - A coin-flip leg carries a little more variance than its price suggests, and nothing here says
    which way it goes.
  - That supports keeping coin flips out of parlays, rather than finding an edge in them.
- **Not settled:** player-level patterns. That's the separate player study.

## Second round of checks (2026-11-16, at the user's ask)

No result changed. One earlier statement was made precise.
- **All six regression t-values** (V1–V3, V5, D1, D2, train and holdout) were recomputed in a
  separate Python implementation with the closed-form slope, and match exactly.
- **One game's remaining features rebuilt by hand** (HOU at PHI, 2024-01-15):
  - own volatility 14.30: PHI's sd 15.78 over 36 closes, HOU's 12.82 over 38;
  - matchup edge 0.944;
  - starters out 0: PHI's top 5 had one out (Melton), HOU's none.
  - All match the script.
- **The variance shares are exact:** 7.65% + 57.69% + 32.08% + 2.57% = 100.00% for coin flips, and
  100.00% for all games. The split is an identity.
- **Coin flips' extra volatility on 2021-26** (seen before this study, described only):
  - In sd terms, it's 2.5 standard errors above 55–65% favourites and 3.7 above 65%+, not "about
    three" as first said.
  - On mean miss size, which doesn't assume normal errors: 11.52 vs 10.32 points, Welch t 3.62.
  - With 2015-21's pre-registered t 1.86, both eras point the same way.
