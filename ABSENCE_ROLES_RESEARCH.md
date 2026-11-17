# Absences: replacements, roles and matchups — research `absence-1` (pre-registered 2026-11-16)

Committed with its code (`research-absence-roles.js`) before any 2015-16 to 2020-21 game is scored.
The 2021-26 numbers below are an exploration and were looked at; 2015-21 is scored once, by
`node research-absence-roles.js --hold`, after this commit. A change becomes `absence-2`.

Research only: never an engine edit, a pick or a stake size. A question that holds here would still
need its own pre-registered live shadow before it touches anything.

## Why

The user's points (2026-11-16, after HOU @ MIA):
- **Not every injury is a negative.** Losing a weaker rotation player can help if better players take
  his minutes. The user's example: Kyle Kuzma out could help the Bucks.
- **Losing a role hurts more than the player's overall rating says.** The example: Duncan Robinson out
  is a big blow to the Pistons, because he is one of their main shooters.
- **Weigh it against team synergy and the opponent:** a role lost matters more for teams that depend
  on it, and against opponents who exploit it.

**How the engine values absences now** (`calcRosterAdjustment`; injury-close-1's replica):
- A player's value is max(0, BPM + 2) × minutes. He can never be worth less than replacement level,
  and his minutes are refilled at replacement level (−2 BPM).
- So an absence is never a gain, and the minutes go to an imaginary replacement, not to the actual
  teammates.
- Roles (shooting, passing, rebounding, defence) don't enter at all, and neither does the opponent.

**What's already known:** on 2021-26, results move 0.96 ± 0.06 points per point of the engine's
absence value and the close moves 0.87 (injury-close-1). The scale is right on average. This asks
whether the *kind* of absence matters.

## The features

All are built on injury-close-1's replica: the same roster rule, baseline minutes, regressed prior
BPM and walk weight w. Player profiles come from Basketball-Reference seasons Y−1 (weight 1.0) and
Y−2 (weight 0.5) only, so nothing is from the season being scored.

**Two lineups per team per game:**
- **Full strength:** every roster player, minutes in rotation order capped at 240 (the engine), then
  filled up to 240 at each player's own level (at most 42 minutes each).
- **Tonight:** only the players who play, at their baseline minutes, filled up to 240 the same way.
  The players who absorb the minutes are the actual teammates, at their own BPM.

**The absence measures** (points per game, home − away):
- **dA, engine-style:** minus the floored value of tonight's absent players, at their full-strength
  minutes. The freed minutes are worth replacement level.
- **dR, replacement-aware:** the BPM-minutes of tonight's lineup minus full strength's, in points. No
  floor, and the minutes go to the real teammates, so an absence can be a gain.
- **X1 = dR − dA:** the replacement correction.

**Roles lost** (tonight minus full strength, minute-weighted):
- **X2 shooting:** expected made threes per game (3PM per 36, shrunk to the league with 750 minutes).
- **X2 playmaking:** assist percentage. **X2 rebounding:** rebound percentage. **X2 defence:**
  defensive BPM.

**Synergy and matchup:**
- **X3, shooting × reliance on threes:** shooting lost × (the team's full-strength threes per game
  minus the average).
- **X4, rebounding × the opponent:** rebounding lost × (the opponent's lineup rebound percentage
  tonight minus the league's).

**Depth:** absent players with value > 0, 15+ baseline mpg and 10+ minutes in the rating
((1 − w) × mpg + w × this season's share). A game is *depleted* when one side has 3 or more and the
other at most 1.

**Data rules, fixed before the holdout is scored:**
- **All-Star games are dropped** with a 30-team list. injury-close-1's filter missed LEB, DUR, GIA,
  SHQ, CHK, KEN, CAN, STARS and STRIPES (see the erratum in INJURY_PIECE_RESEARCH.md). With the list,
  this build reproduces injury-close-1's A exactly on all 12,306 team-games.
- **Games without minutes are dropped:** ESPN has no player minutes for 487 games in 2015-18 (161,
  163, 163 by season). A game counts only when each team has 5+ players with 200+ minutes. Short
  games are dropped entirely, from scoring and from every minutes history.
- **The close:** 2021-26 as engine-close-1 (DraftKings, else ESPN BET). 2015-21 as engine-close-2:
  the median spread across books, at least 2 books. Winners are judged against the spread-implied
  chance, because the 2015-21 moneylines are a different snapshot from the spreads.
- **The 2015-21 box scores** were fetched from ESPN summaries for this study (7,059 games, no
  failures). Before this commit only coverage and feature spreads were looked at (`--check`):
  6,508 games with a close; minutes matched 99.24–99.98%; feature sds close to 2021-26's (A 2.54 vs
  3.11, X2 1.07 vs 1.29, X4 0.80 vs 0.82); 975 depleted games and 783 positive-absence team-games.

## The exploration, 2021-26 (looked at)

`node research-absence-roles.js`, 6,119 games. The result is the actual home margin minus the
market's (resid); "beyond the core" means the actual margin minus the walk's.

**What failed:**

| Idea | Against the close | 2021-24 | 2024-26 |
|---|---|---|---|
| X1 replacement correction, given A | +0.16 ± 0.13 | +0.25 | +0.04 |
| X2 shooting lost (the Robinson case) | −0.01 ± 0.14 | +0.03 | −0.05 |
| X2 playmaking lost | +0.04 ± 0.08 | +0.02 | +0.06 |
| X2 rebounding lost | +0.04 ± 0.16 | +0.03 | +0.04 |
| X3 shooting × reliance on threes | −0.10 ± 0.09 | +0.05 | **−0.46 (t −2.9)** |
| X4 rebounding × the opponent | +0.10 ± 0.22 | −0.02 | +0.20 |

X3 changes sign between the halves, and in 2024-26 it goes the opposite way to the idea (teams that
lean on threes did *better* than the close after losing shooters). It's treated as noise.

**What went one way in both halves** (these become the holdout questions):

| | All | 2021-24 | 2024-26 |
|---|---|---|---|
| Q1 depth: depleted side vs the close | −1.02 ± 0.38 (t −2.68), n 1,233 | −0.68 ± 0.49 | −1.47 ± 0.60 |
| Q2 absences that should help: that team vs the close | +0.84 ± 0.42 (t 2.03), n 857 | +0.95 ± 0.52 | +0.70 ± 0.67 |
| Q3 dR beside dA, results beyond the core | +0.27 ± 0.14 (t 1.99) | +0.33 | +0.19 |
| Q4 defence lost, given A, vs the close | +1.28 ± 0.59 (t 2.17) | +1.60 | +0.70 |

**Notes:**
- **Q1** was first seen on 11-16 in a scratch check of injury-close-1's replica, one of about 10 cuts
  by absence size and count. The All-Star fix moves it from −1.04 to −1.02.
  - By season: −1.14, −0.40, −0.53, −0.59, −2.30.
  - Winners: the depleted side won 451 of 1,233 against 473.0 implied (z −1.43).
  - Controlling for A changes nothing (intercept −1.04 ± 0.58), so this isn't the engine's absence
    value in disguise.
- **Q2 is the user's Kuzma case:** team-games where the engine takes off 0.5+ points but the actual
  replacements are better than the absent players.
  - The engine averaged −1.22 on these and the replacement-aware view +0.58. Results beat the core
    by +1.61 and the close by +0.84.
  - By season: +3.01, +0.13, −1.25, +0.19, +1.17, so much of it is 2021-22. Winners: 475 of 857
    against 448.0 (z 2.05).
- **Q3:** head to head, the engine-style dA fits results better than dR (sum of squares 1,145,885 vs
  1,148,424). Together, results load on both (dA 0.55 ± 0.13, dR 0.27 ± 0.14). Freed minutes seem to
  be worth somewhere between replacement level and the real teammates.
- **Q4:** positive in all five seasons (+1.24, +1.68, +1.96, +1.25, +0.29). The sd of X2def is 0.33,
  so that's about 0.4 points per sd.
- **20.3% of team-games with an absence** are better tonight in the replacement-aware view (2,422 of
  11,950).

## The holdout questions, 2015-16 to 2020-21 (scored once)

| Q | Measure | Holds if |
|---|---|---|
| Q1 | Depleted side's mean (result − closing spread), points | mean < 0 with t ≤ −2 |
| Q2 | Positive-absence team's mean (result − closing spread) | mean > 0 with t ≥ 2 |
| Q3 | Coefficient on dR in (actual − walk) ~ dA + dR | > 0 with t ≥ 2 |
| Q4 | Coefficient on X2def in (result − close) ~ A + X2def | > 0 with t ≥ 2 |

**Multiple questions:** with four, the chance that at least one holds by luck is about 9%. The output
also names which hold past |t| ≥ 2.24, the one-sided 5% bar split four ways.

**Described, no decision:**
- winners for Q1 and Q2;
- each question by season;
- X1, shooting, playmaking, rebounding, X3 and X4 against the close.

**Power:** the holdout has fewer of the key games than 2021-26 (975 depleted games, 783
positive-absence team-games). Standard errors are scaled by the square root of the counts, and
2021-26's effect is taken as the truth:
- Q1's expected t is about −2.4 (about 65% power);
- Q2's about 1.9 (about 48%);
- Q3 and Q4 about 2.0 (about 50%).

These are optimistic, since effects found by looking usually shrink on new data.

So a miss doesn't rule an idea out. A hold on data no one has looked at would be the first engine
piece to show anything beyond the close on unseen seasons.

## What the answers mean

- **Q1 holds:** the market underprices losing several rotation players at once. Next step: a live
  `depth-1` shadow (flag the depleted side from the official report at record time, and judge it
  against the close).
- **Q2 or Q3 holds:** the engine's floor and replacement-level refill are wrong in the user's
  direction. Next step: a shadow engine variant with replacement-aware absences, recorded beside
  `pOurs` and judged live.
- **Q4 holds:** losing defence is underpriced. Next step: a shadow term, recorded and judged live.
- **None hold:** the kind of absence adds nothing measurable beyond the close. The engine's absence
  values stay as they are.

## Not tested, and why

- **Preseason:** ESPN has preseason scoreboards but no closing lines, and the minutes aren't real
  rotations, so there's nothing to judge against.
- **This season (2026-27):** described separately in the write-up, not decided. About 200 games so
  far, and a depleted game or positive absence happens in a few of them.
- **Opponent shooting defence** (the Robinson matchup): there's no player-level three-point defence
  in the data. The team-level matchup (D1) already failed in coinflip-1.

## Results (run 2026-11-16, once, after the pre-registration commit f99ef69)

`node research-absence-roles.js --hold`: 6,508 games from 2015-16 to 2020-21.

| Q | Question | 2015-21 result | 2021-26 (exploration) | Decision |
|---|---|---|---|---|
| Q1 | Depleted side vs the close | **+0.51 ± 0.38** (t +1.33), n 975 | −1.02 ± 0.38 | no, the opposite sign |
| Q2 | Absences that should help, vs the close | −0.20 ± 0.39 (t −0.52), n 783 | +0.84 ± 0.42 | no |
| Q3 | dR beside dA, results beyond the core | +0.09 ± 0.15 (t 0.59) | +0.27 ± 0.14 | no |
| Q4 | Defence lost, vs the close | +0.10 ± 0.66 (t 0.15) | +1.28 ± 0.59 | no |

**0 of 4 hold.** None of the four effects seen on 2021-26 shows up on seasons no one had looked at.

**By season (2015-16 → 2020-21):**
- **Q1:** +0.03, +2.39, +0.48, +1.05, +1.34, −1.41. Only 2020-21 (the season of health-and-safety
  absences) goes the 2021-26 way. Winners: the depleted side won 401 of 975 against 380.6 implied
  (z +1.46).
- **Q2:** −0.08, −0.29, +0.69, −1.16, −0.59, +0.43. Winners 400 of 783 against 396.3 (z +0.28).
- **Q4:** −0.43, +1.27, −2.17, +1.03, −1.01, +1.01.

**Described (no decision):**

| Against the close, given A | 2015-21 | 2021-26 |
|---|---|---|
| X1 replacement correction | +0.15 ± 0.15 | +0.16 ± 0.13 |
| X2 shooting lost | **+0.33 ± 0.15 (t 2.22)** | −0.01 ± 0.14 |
| X2 playmaking lost | **+0.20 ± 0.08 (t 2.43)** | +0.04 ± 0.08 |
| X2 rebounding lost | **−0.48 ± 0.16 (t −2.92)** | +0.04 ± 0.16 |
| X3 shooting × reliance on threes | +0.07 ± 0.06 | −0.10 ± 0.09 |
| X4 rebounding × the opponent | +0.40 ± 0.20 (t 2.01) | +0.10 ± 0.22 |

- **In 2015-21 the roles did matter beyond the close.** Teams that lost shooting and playmaking (guards)
  did worse than the close. Teams that lost rebounding (bigs) did better.
- **In 2021-26 all three are about zero.** That fits a market that priced bigs too high and guards too
  low in the late 2010s and has since caught up. The roles are correlated (the same absent guard
  lowers shooting and passing together), so this is one pattern, not three.
- **It's described, not decided, and it doesn't carry into this era.** It isn't a usable edge now.

**Checked after the scoring (not pre-registered):**
- **Against the engine's real absence value:** dA in Q2 and Q3 is a simplified engine-style take.
  The replica's own A restores players whose minutes the 240 cap had cut (see the correction below).
  Rerun with A:
  - Q3's dR: 2021-26 +0.19 ± 0.10 (t 1.83), 2015-21 +0.11 ± 0.11 (t 1.00).
  - Q2 (team A ≤ −0.5, dR > 0): 2021-26 −0.05 ± 0.63 (n 393), 2015-21 −0.22 ± 0.59 (n 376).
  - So the 2021-26 Kuzma-case result came from the simplified dA. Against the engine's own value it
    was never there.
- **This season (2026-27, 197 games through Nov 15, DraftKings close; names matched on 2024-26, 92%
  of minutes):**
  - depleted side −0.63 ± 2.55 (n 24);
  - absences that should help +0.73 ± 1.99 (n 13 team-games);
  - 60 of 339 team-games with an absence are better tonight in the replacement-aware view.
  - All of it is noise at these sizes.

**Correction to the "Why" above (written before the results):** it says the engine refills an absent
player's minutes at replacement level, so an absence is never a gain. That's only partly right:
- **Since the 2026-11-07 rotcap engine,** tonight's minutes are capped at 240 in rotation order. When a
  player sits, the players the cap had cut get their minutes back first, valued at their own
  max(0, BPM + 2). Only minutes beyond that pool go at replacement.
- **Nobody plays above his baseline minutes,** and values are floored at replacement. So an absence can
  net out near zero, or even a small gain when the restored players are rated above replacement and
  the absent one isn't.
- **Live examples (snapshot 2026-11-13, everyone else available):**
  - Duncan Robinson out for Detroit costs −0.02 points: Javonte Green and Isaiah Joe take the minutes
    and are rated about the same. The replacement-aware version says −0.01.
  - Kyle Kuzma out for Milwaukee: 0.00, and +0.02 replacement-aware. His BPM is −2.9, and the minutes
    go to Nate Ament (−2.6) and Ousmane Dieng (−3.1).

## Conclusion

- **How the absence is shaped doesn't beat the close on unseen seasons.** That covers who replaces
  him, which role is lost, synergy with the team's style, the rebounding matchup, and several players
  out at once.
- **The depth lead from 2021-26 reversed on 2015-21** (+0.51 against −1.02). It was a pattern found by
  looking.
- **Role effects were real in 2015-21 but are gone in 2021-26.** The market has learned to price
  them.
- **Most of the user's replacement point is already in the live engine,** through the rotcap refill.
  What's left (the floor, and minutes above baseline) adds nothing measurable against results beside
  the engine's value (t 1.0 on 2015-21).
- **No shadow follows from this.** The engine's absence values stay as they are, and the scale already
  matches results (0.96 ± 0.06, injury-close-1).
