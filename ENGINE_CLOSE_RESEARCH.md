# The engine core vs the close, 2021-26 — research `engine-close-1` (pre-registered 2026-11-15)

Written and committed before any engine prediction is compared with a closing line. Code:
`research-engine-close.js`, written after this file is committed. Input: `research-season-update.js`
with `ENGINE_OUT` (added in the same commit), which writes the walk's per-game predictions and parts,
with no grid and no scoring.

## Why

MODEL_AUDIT.md found that every engine piece was tested against results on past seasons, and none
against the closing line. Predicting results well isn't the same as knowing something the market
doesn't. This asks, for the first time, whether the engine's disagreements with the close carried
real information on five past seasons, and which pieces they came from.

## The engine tested (the "core")

`research-season-update.js`'s walk, every game in date order, each prediction from earlier games
only:

    margin = rating(home) − rating(away) + 2.0 + rest(home) − rest(away)
    rating = (1 − w) × opening-night prior + w × this season's margin per game,  w = g / (g + 20)
    rest   = −2 on a back-to-back, else −0.5 for 3 games in 4 nights; +0.5 after 3+ days off
    P(home) = Φ(margin / 12.5)

- **The opening-night prior** comes from `research-season-prior.js`: 0.75 × last season, plus
  240-capped roster changes and aging, centred each season.
- **Constants** are the live engine's (`season-constants.js`).
- **Two variants the ledger also records:**
  - `double`: this season counted twice, like `pOurs` on NB.AI's feed;
  - `oppAdj`: opponent-adjusted form with opponents rated by last season, like `pOursAdj`.
- **What the core lacks:** game-to-game injuries and roster moves. The market has them. That's why
  Q1b exists.

**Known biases, both in the engine's favour:**
1. **Constants:** retention, the shrink K, home court, rest, aging and roster fit were chosen on
   these seasons' results (leave-one-season-out where noted). They were never chosen on the market.
2. **Rosters:** the opening-night prior approximates rosters from each player's first team that
   season, which includes mid-season signings.

So a fail is a clear answer. A pass needs a live check before anything acts on it.

## Data

- **Games:** 2021-22 to 2025-26 regular seasons from Basketball-Reference, 6,150 games, joined to
  ESPN by date and teams. In the join check, all 6,150 matched with identical final scores; no
  engine-vs-close numbers were computed.
- **The close:**
  - 2021-23: DraftKings' listed line (`.cache/espn-nba/old`), as in situ-1.
  - 2023-26: DraftKings' close, else ESPN BET's (`.cache/espn-nba/hist-odds`), as in matchup-1.
  - Lines whose spread favourite contradicts the moneyline are dropped.
- **Targets:**
  - **resid** = actual home margin − market margin (−spread).
  - **gap** = engine margin − market margin.
- **Win probabilities:** engine Φ(margin / 12.5); market the no-vig moneyline.
- **Windows** (as in research-season-update.js, by the fewer games either team has played): 0–5,
  6–20, 21+.

## Questions

**Q1. Does the engine's gap carry information?**
- The slope of resid on gap, over all games.
- A slope of 1 means the whole gap was real, 0 means none of it, and below 0 means the engine moved
  the wrong way.
- **Pass:** slope > 0 with t ≥ 2 pooled over the five seasons, and positive in at least 4 of 5
  seasons.

**Q1b. The same, on healthy games only.**
- Both teams have played at least 5 games, and each team's top 5 players by minutes per game all
  play.
  - Top 5 is among players with 5+ games for the team, still on it, as in situ-1.
  - Whether they play comes from the box scores' minutes. Who plays is on the injury report before
    tip.
- This takes out most of the injury information the core lacks.
- Same pass rule as Q1.

**Q2. When.** Q1's slope in each window, and the intercept (home court as priced against the
engine's 2.0). Described, not decided.

**Q3. Which pieces.** Regress resid on three pieces, each home minus away:
- **prior:** (1 − w) × prior;
- **form:** w × this season's margin per game;
- **rest:** the rest terms.

A piece **passes** if its coefficient is > 0 with t ≥ 2 pooled and positive in at least 4 of 5
seasons: the market under-weighted it. A negative coefficient (the market already weights it more
than the engine) is reported, not passed. Trust rule R1 predicts a positive prior coefficient (the
market overweights early results), most of all in the 0–5 and 6–20 windows. The windows are
described.

**Q4. The variants.** Q1's slope for `double` and `oppAdj`, beside the core. Described: which
version's disagreements carried more information. With Q1 this bears on which version should drive
the picks.

**Q5. pitch-3's premise on the core.**
- Every side where the engine's chance is 5+ points above the market's no-vig chance, one side per
  game.
- Wins against the market's expected wins.
- **Pass:** z ≥ 2.
- Also reported:
  - the 8+ point tier;
  - profit at the close;
  - the same on healthy games.
- This uses the close, which is a harder test than pitch-3's recorded price.

**Also reported, not decided:**
- each season;
- Q1 with the 1% largest |resid| trimmed;
- Brier score, engine against the market, on the same games.

**False passes:** 6 decisions (Q1, Q1b, three Q3 pieces, Q5). The chance that noise passes at least
one is about 10%.

## What the answers mean for the live model

- **Q1 and Q1b fail:**
  - The engine's team ratings and rest add nothing to the close.
  - Live edges would have to come from what the core lacks, the night-by-night roster and injury
    pieces.
  - That's where to look, and where the live record (absences over-penalized) has been weakest.
  - pitch-3 and trust R1/R2/R4 lose their basis unless the live record says otherwise.
- **Q1b passes but Q1 fails:** the information is real but swamped by injuries the core can't see.
  The injury piece is the weak link to fix.
- **Q3:**
  - A prior pass supports R1 and pitch-3 early in the season.
  - A form pass says the market under-reacts to this season.
  - A rest pass says it under-prices the generic schedule terms. b2b-1 already says the
    team-specific split does.
- **Any pass becomes a live shadow,** judged against the close as b2b-1 is. Never an engine
  change, and never a bet before it holds live.

## Results (run 2026-11-15, after the pre-registration commit 466fce0)

`node research-engine-close.js`: 6,119 games scored. 31 of the 6,150 were dropped for having no
usable line: none listed, or a spread that contradicts the moneyline. Every game joined, and no
final score differed between the two sources.

**Checked before reading the results:**
- **The parts** add back up to the walk's prediction (largest difference 0.002, from rounding).
- **The slope code** matches the closed form exactly.
- **The regression solver** recovers known coefficients within about 1 standard error, and an
  independent method (Frisch–Waugh) agrees to four decimals. Its standard errors match a
  simulation (0.097 vs 0.101).
- **The planted-signal test:** a planted half-real gap comes back at exactly 2.000 with no noise,
  and at 0.834 with noise, against 0.83 in theory. The sign and plumbing are right.
- **The record and price conversions** match hand calculations.
- **Healthy games** are 13% of the total. That isn't a bug: a team has its whole top 5 available
  in 39% of games, so both teams do about 15% of the time.
- **The main slope** was recomputed with the earlier research loaders (luck-sched-1's for 2023-26,
  situ-1's for 2021-23) and matches exactly, overall and by season.

| Q | Question | Result | Decision |
|---|---|---|---|
| Q1 | slope of resid on the gap, all games | **−0.031 ± 0.047** (t −0.67); by season −0.19, +0.18, −0.10, +0.01, −0.08 | no |
| Q1b | the same, healthy games (793) | +0.20 ± 0.22 (t 0.92); positive in 4 of 5 seasons | no (t < 2) |
| Q3 | prior | −0.13 ± 0.09 (t −1.56); positive in 1 of 5 | no |
| Q3 | form | +0.07 ± 0.04 (t 1.67); positive in 3 of 5 | no |
| Q3 | rest | +0.28 ± 0.17 (t 1.63); positive in 4 of 5 | no (t < 2) |
| Q5 | sides 5+ points over the no-vig close | won 1,292 of 3,447 against 1,296.7 expected (z −0.17); −6.1% at the close | no |

**0 of 6 pass.**

**Described:**
- **The variants carry no information either:**
  - this season counted twice: −0.004 ± 0.046;
  - opponent-adjusted: −0.023 ± 0.047.
- **Bigger gaps did worse:** against the spread, toward the engine, by gap size:

  | Gap | Games | Against the spread |
  |---|---|---|
  | 0–2 points | 2,808 | 50.5% |
  | 2–4 | 1,856 | 50.6% |
  | 4–6 | 861 | 48.9% |
  | 6+ | 594 | 48.3% |

- **pitch-3's rule by tier:**
  - 8+ points: z +0.20, −5.5%;
  - 5–8 points: z −0.57, −7.4%;
  - healthy games: z −1.08;
  - only 2022-23 was positive (z 1.56).
- **Accuracy:** Brier score, engine 0.2135 against the market's 0.2034.
- **Robustness** (all near zero):
  - trimmed: −0.005 ± 0.045;
  - on the probability scale: −0.016 ± 0.058;
  - market margin from the moneyline instead of the spread: −0.050 ± 0.048.
- **By window:**

  | Window | Games | Slope |
  |---|---|---|
  | games 0–5 | 470 | **+0.54 ± 0.22 (t 2.53)** |
  | games 6–20 | 1,126 | +0.11 ± 0.13 |
  | games 21+ | 4,523 | −0.08 ± 0.05 |

  - **The early effect isn't just opening night:** 0.59, 0.29 and 0.75 across games 0–1, 2–3 and
    4–5, then 0.03 at games 6–10.
  - **It's positive in 4 of 5 seasons** (0.23, 1.27, −0.34, 0.69, 0.93), and holds on the
    probability scale (0.56 ± 0.27).
  - **With the market's margin held fixed,** the engine's coefficient is 0.45 ± 0.24 and the
    market's own −0.55 ± 0.22. In the first few games the close partly overreacts, and the
    engine's prior partly corrects it.
  - **Status:** the window was fixed in advance, but it was a described question, not a decided
    one. It's a hypothesis, not a finding.
- **Q3 by window:** the prior coefficient is −0.42 ± 0.17 in games 21+. Late in the season the
  market leans on preseason ratings a little more than results justify, but less than the engine
  does.

## Conclusion

On five past seasons, the engine's core (team ratings from last season and this season, home
court, rest) has **no information beyond the closing line**:
- its disagreements are noise or worse;
- the bigger the disagreement, the worse it did;
- the two variants the ledger records are no better.

**For the live model:**
- **Edges can't come from the core.** If the live engine has any, it must come from the
  night-by-night roster and injury pieces, which the live record suggests over-penalize absences.
- **pitch-3's rule had no edge on the core over five seasons.** Its live record is still the test.
- **Trust rules R1, R2 and R4** lose the premise they were drafted on: "the market overweights
  early results" is backwards except in the first ~5 games.

**The one lead is the first five games of each season,** where the engine's prior partly corrects
an overreacting close. ESPN has lines back to 2016-17 (DraftKings from 2019-20; Westgate and
Caesars before), five seasons never scored against the close. That's the place to confirm or kill
it, as a new pre-registration (`engine-close-2`). Even if confirmed, it applies to about 95 games
(each team's first five) in late October each season.

---

# Confirmation of the first-five-games lead — research `engine-close-2` (pre-registered 2026-11-15)

Written and committed before any 2015-16 → 2020-21 line is fetched or scored. Code: added to
`research-engine-close.js` after this commit.

## Why

engine-close-1 found no information in the engine core against the close, except possibly in each
team's first 5 games. There the slope was +0.54 ± 0.22 (t 2.53), positive in 4 of 5 seasons. That
was a described question, so it's a lead, not a finding. Six earlier seasons have never been scored
against the close.

## Data

- **Games:** the same engine walk (`research-season-update.js`, `ENGINE_OUT`, live engine values)
  for the 2015-16 to 2020-21 regular seasons, joined to ESPN's scoreboards by date and teams. Final
  scores must match.
- **The close: the median across listed sportsbooks.** ESPN's core odds endpoint lists different
  books in different years:
  - offshore books in 2015-17;
  - Westgate, Caesars and Unibet in 2017-19;
  - DraftKings from 2019-20.

  No single book covers all six seasons.
  - **Market margin:** −(the median of the listed spreads).
  - **Market chance:** the median of the books' no-vig moneyline chances.
  - **Excluded:** "Opening", live lines, "consensus" and tipster or model sites (accuscore,
    teamrankings, numberfire). At least 2 books are needed.
  - **Which line:** the listed line (there's no close field), as in situ-1.
  - **Dropped:** games whose median spread favourite contradicts the median moneyline.
- **Known context, decided now:**
  - 2019-20 includes the bubble restart and 2020-21 the shortened season with few fans. Both are
    kept.
  - 2020-21's first five games fall in late December 2020.
- **Coverage probe before this file:** about 20 sampled games per season, listing which books had a
  spread and moneyline. No outcomes or engine numbers were looked at.

## Question (one decision)

**E1. In each team's first 5 games** (games 0–5 by the fewer games either team has played, as in
engine-close-1), the slope of resid on the engine's gap, pooled over the six seasons.

**Pass:** slope > 0 with t ≥ 2.

**Power:**
- About 95 such games a season, so about 570 games.
- If the true slope is 0.54 (engine-close-1's estimate), the expected t is about 2.7, and it passes
  about 75% of the time.
- If it's half that (typical shrinkage after selection), the expected t is about 1.3, and it passes
  about 25% of the time.

## Described, not decided

- E1 by season.
- E1 with the market margin added as a regressor: the engine's and the market's coefficients.
- E1 with a single book (DraftKings where listed, else Westgate), as a check on the median rule.
- The full-season slope and games 6–20 and 21+, a further check on engine-close-1's null.
- The ten seasons 2015-16 to 2025-26 pooled for games 0–5.

## What a pass leads to

A live shadow for each team's first 5 games from October 2027 (this season's have been played),
judged against the close. Never an engine change, and never a bet before it holds live.

**A fail** means the lead was noise. The core then has no information against the close anywhere.

## engine-close-2 results (run 2026-11-15, after the pre-registration commit b37b6d8)

`node research-engine-close.js --fetch-early`, then `--early`. 7,059 games in the walk.

**Checked before scoring:**
- **The join:** all games joined except 4 in 2019-20, and no final score differed between sources.
- **Lines:**
  - 6,988 games scored. 48 were dropped with fewer than 2 books, and 19 with a median spread
    contradicting the median moneyline.
  - The median game had 6 books.
- **Closing, not opening:** the median spread differed from ESPN's "Opening" line in 87% of 2015-17
  games, as closing lines should. The single-book line (DraftKings, else Westgate) was within 1 point
  of the median in 97–99% of games each season.
- **Caveat:** in 2015-21, each book's own moneyline and spread disagree by 2.5+ points in about 5–13%
  of games, against almost never in 2021-26. The older moneylines look like a different snapshot.
  E1 uses only spreads.

| | Games | Slope ± se | t |
|---|---|---|---|
| **E1: games 0–5, 2015-16 to 2020-21, median close** | **566** | **+0.05 ± 0.19** | **0.26** |
| by season | ~95 each | +0.30, −0.36, +0.52, −0.25, +0.24, −0.22 | |

**E1 doesn't pass.** An independent recompute from the raw files, with its own median, join and
closed-form slope, gave the same numbers (0.051 ± 0.193, n 566).

**Described:**
- **Games 0–5, with the market's margin held fixed:** engine −0.11 ± 0.25, market −0.01 ± 0.20.
  The early overreaction seen in 2021-26 isn't there.
- **Games 0–5 with a single book:** −0.09 ± 0.22.
- **Games 0–5 over all ten seasons, 2015-26:** +0.28 ± 0.14 (t 1.93). Half of that comes from the
  2021-26 seasons that suggested the question.
- **All games, 2015-21:** +0.10 ± 0.05 (t 2.00). Games 6–20: +0.31 ± 0.13.
- **By season**, all games:

  | Season | Slope |
  |---|---|
  | 2015-16 | +0.30 |
  | 2016-17 | +0.07 |
  | 2017-18 | −0.01 |
  | 2018-19 | +0.10 |
  | 2019-20 (the bubble year) | +0.42 |
  | 2020-21 | −0.15 |
  | 2021-22 | −0.19 |
  | 2022-23 | +0.18 |
  | 2023-24 | −0.10 |
  | 2024-25 | +0.01 |
  | 2025-26 | −0.08 |

  The older positive slope is carried by two seasons. Every season since 2020-21 is near zero. The
  engine's constants were also chosen on these seasons' results, which favours it.

## Conclusion (both studies)

- **The first-five-games lead was noise.** Scored once on six unseen seasons, it's +0.05 ± 0.19.
- **On the market as it has been since 2020-21,** the engine core has no information beyond the
  close, at any point in the season.
- **There's a hint the older market (2015-20) was beatable at times,** in two seasons. It isn't
  stable and doesn't carry into the current era.
- **What's left untested historically is the night-by-night roster and injury piece.** It's the
  only part of the live engine that could hold an edge.

## Second round of checks (2026-11-15, after both results)

Run because the user asked whether every link had been verified. None changed a result.

- **One prediction rebuilt by hand from raw inputs** (HOU at PHI, 2024-01-15):
  - **form:** PHI's 37 and HOU's 38 earlier games give weights 0.6491 and 0.6552 and form
    5.263 and 0.793, exactly as the walk has them;
  - **prior:** the centred opening ratings, 0.307 and −3.293, match the walk's 0.308 and −3.292
    (that season's scale was 1.00);
  - **rest:** HOU was on a 3-in-4 (−0.5);
  - **total:** the parts sum to the walk's 8.213.
  - The walk's `aB2b` field is set for any rest term, a 3-in-4 included. It's misnamed, but the
    analysis doesn't use it.
- **Healthy flags against box scores, with an independent top-5 build:**
  - OKC at NY, 2025-01-10, flagged healthy: both top fives played.
  - GS at IND, the same night, flagged not healthy: Curry, Wiggins, Green and Kuminga were out.
  - A mid-season trade (Schröder) counts for his new team.
- **The spread's sign on known games:** Golden State at home in November 2016 is −11.5 to −17,
  with heavy moneylines.
- **A pitch-3 leg rebuilt by hand:** NYK at BOS, 2024-10-22. Engine 75.2% against no-vig 63.0%, so
  the leg is BOS at −190, which won 132–109. Counting legs by hand gives the same 3,447.
- **pitch-3's rule at other conversion widths** (σ = 11.5 / 13.5 / 14.5 points): z −0.13 / −0.09 /
  −0.55, return −5.6% to −7.2%. The engine's Brier score is 0.2135–0.2142 throughout.
- **Older moneylines:** −8000 on a 17-point favourite (2016) confirms the 2015-21 moneylines are a
  different snapshot from the spreads. Only spreads decided engine-close-2.
