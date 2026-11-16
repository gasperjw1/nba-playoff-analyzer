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
