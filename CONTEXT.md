# NBA Playoff Analyzer 2026 — Project Context

> This document captures the full project state so that future sessions can pick up where we left off. Last updated: May 5, 2026 (Phase 51 complete — win probability recalibration, dynamic ratings, multiplicative architecture).

---

## Overview

A multi-file interactive HTML/CSS/JS web app analyzing the 2026 NBA Playoffs. Features a 51-phase prediction model calibrated against 2025 results (73.5% initial accuracy), a Monte Carlo chaos simulation, interactive scenario builders, projection lineage waterfall charts, and a comprehensive betting analysis page with player props calibrated against real DraftKings sportsbook odds. Phase 51 introduces win probability recalibration (WIN_PROB_SCALE=35, PLAYOFF_UPSET_COMPRESSION=0.18), per-player dynamic rating adjustments in calcTeamRating (injury severity, playoff ascension, coaching scheme), and a proportional-multiplicative context architecture replacing fixed additive factors (fatigue ±12%, scheme ±20%, inconsistency 15% compression). Backtest: 87.5% G1 winner accuracy, 75.0% avg favorite WP (was 90-95%), 5.1 expected series length (was 4.2, actual 5.4-5.6).

**R1 model accuracy: G1-G6 ML record 25/42 (59.5%) | G1 7/8 (88%) | G4 3/4 (75%) | G5 6/7 (86%) | G6 1/3 (33.3%)**

---

## Architecture

### Multi-File Structure (split from monolith at Phase 22)

```
nba-playoff-analyzer/
├── index.html              # App shell — modals, script tags in dependency order
├── css/styles.css           # All styling with mobile-responsive breakpoints
├── js/
│   ├── app.js               # Boot sequence
│   ├── state.js             # UI state, scenario builder, localStorage V3
│   ├── utils.js             # Formatters, rating tiers, stat helpers
│   ├── data/
│   │   ├── constants.js     # HCA, G7 overrides, SPM coefficients, ROUND_META
│   │   ├── series-data.js   # All series — rosters, stats, predictions, box scores
│   │   ├── boxscores.js     # Per-player box score data
│   │   └── historical.js    # Historical without-star data
│   ├── engine/
│   │   ├── ratings.js       # Team rating (replacement-level slots)
│   │   ├── projections.js   # 18-step projection + lineage + attribution
│   │   ├── chemistry.js     # SPM Chemistry (8 dimensions)
│   │   ├── fatigue.js       # Per-player fatigue with injury-return handling
│   │   ├── matchups.js      # Defensive suppression, bounce-back
│   │   ├── simulation.js    # Monte Carlo (10K iterations, correlated vars)
│   │   └── graduation.js    # Series graduation for round transitions
│   └── ui/
│       ├── components.js    # Scenario builder, stat bars, waterfall, attribution
│       ├── series-renderer.js
│       ├── modals.js
│       ├── navigation.js    # Tab switching — rounds, series, games, pages, bets
│       ├── learnings.js     # 42 phases of model evolution
│       ├── definitions.js   # Metric definitions with category tabs
│       └── bets.js          # G1-G6 bets, player props, parlays, P&L tracker
├── CONTEXT.md               # This file
└── README.md
```

### Script Load Order (dependency chain)
Data layer → utils/state → engine → UI → boot. All globals, no ES modules.

### Pages (4 tabs via `switchPage()`)
1. **Series Analysis** — Tabbed series with rosters, synergy, coaching, game predictions, waterfall charts
2. **Model Learnings** — 45-phase timeline of model evolution
3. **Definitions** — All metric definitions with category tabs
4. **Bets** — G1-G6 tabs + Featured Parlays with player props and P&L tracker

---

## Core Model (Phase 42)

### Rating System
- **Player ratings**: 0-97 scale (Jokic 97, SGA 96, Wemby 94)
- **baseRating** vs **rating**: `baseRating` is healthy; `rating` reflects availability
- **Team rating**: `calcTeamRating()` aggregates via replacement-level slots + VORP/USG + systemBonus + pedigree + non-linear interactions + health degradation

### Prediction Pipeline (18 steps with lineage tracking)
1. Base margin from team rating differential
2. Home court advantage (round-adjusted: R1:3.0, R2:2.0, CF:1.5, Finals:1.0)
3. System coherence bonus
4. Championship DNA / playoff pedigree
5. Star ceiling variance
6. Health degradation
7. Fatigue adjustment
8. Chemistry (SPM 8-dimension)
9. Matchup suppression (D-LEBRON)
10. Bounce-back probability
11. Coaching adjustment (post-loss patterns)
12. 3PT variance correlation
13. Role flexibility modifier
14. Youth breakout multiplier
15. Turnover tendency differential
16. Star Elevation Effect (elimination/close-out games)
17. Dynamic initiator recalculation
18. Blended ensemble output (manual + engine + Monte Carlo)

Each step records `{step, label, delta, runningMargin}` in a lineage array for waterfall visualization.

### Ensemble System (Phase 41)
Three prediction sources blended:
- **Manual picks** — 72.7% winner accuracy across G1-G5
- **Engine margin** — multi-factor projection
- **Monte Carlo chaos sim** — 10K iterations with correlated scoring runs, momentum, fatigue cascades, foul trouble

When all three agree: high confidence. When they disagree: wider variance (20% SD increase).

### Post-Game Attribution (Phase 42)
After a game completes, `buildGameAttribution()` distributes prediction error proportionally across lineage steps: `weight = |delta| / totalAbsDelta`. Identifies which factors over/under-predicted.

---

## Series Status (as of May 4, 2026)

### Round 1 (Complete)
| Series | Result | Winner |
|--------|--------|--------|
| OKC-PHX | OKC 4-0 | OKC (sweep) |
| SAS-POR | SAS 4-1 | SAS |
| DEN-MIN | MIN 4-2 | MIN |
| HOU-LAL | LAL 4-2 | LAL |
| DET-ORL | DET 4-3 | DET (3-1 comeback) |
| BOS-PHI | PHI 4-3 | PHI (3-1 comeback) |
| NYK-ATL | NYK 4-2 | NYK |
| CLE-TOR | CLE 4-3 | CLE |

### Round 2 (Active — G1 starting May 4)
| Series | Score | Status | Next |
|--------|-------|--------|------|
| (1) OKC vs (4) LAL | 0-0 | Pre-series | G1 Tue May 6 |
| (2) SAS vs (6) MIN | 0-0 | Pre-series | G1 Sun May 4 |
| (1) DET vs (4) CLE | 0-0 | Pre-series | G1 Tue May 6 |
| (3) NYK vs (7) PHI | 0-0 | Pre-series | G1 Sun May 4 |

### Key Injury Notes (current)
- **Doncic (LAL)**: OUT — Grade 2 hamstring (no return timeline)
- **Edwards (MIN)**: QUESTIONABLE — knee, likely OUT for G1 (target May 9 return)
- **DiVincenzo (MIN)**: OUT for season (Achilles)
- **Embiid (PHI)**: PROBABLE — appendectomy + hip contusion, 2 days rest after G7, rating 82
- **Reaves (LAL)**: ACTIVE — oblique improving each game, ~80% for R2
- **Allen (CLE)**: GTD — chronic knee tendonitis
- **Cade (DET)**: ACTIVE — improving, rating 87

---

## Bets Page Structure

### Tabs: Featured Parlays | G1 | G2 | G3 | G4 | G5 | G6

### Bet Types
- **ML (Moneyline)** — straight winner picks with confidence levels
- **SPR (Spread)** — point spread picks
- **PROP** — player stat O/U (points, assists, rebounds)
- **TOT (Total)** — game total O/U

### Featured Parlays
- $100 Best Bet, $50 Ensemble Edge, $1 Chaos Ticket for each game day
- Old parlays wrapped in collapsible `<details>` tags
- Player prop add-ons on high-confidence parlays
- Running P&L tracker: $100 Record 0-6, $1 Record 2-4, Net -$698.47

### G6 Bets (new)
All 6 series with ML + player props:
- NYK-ATL: NYK ML (BEST BET), Brunson O27.5, McCollum U20.5
- BOS-PHI: BOS ML, Embiid O28.5, Tatum O24.5
- DEN-MIN: DEN ML, Jokic O24.5, Jokic O10.5ast
- DET-ORL: Coin flip (skip ML), Cade O30.5, Banchero O28.5
- CLE-TOR: CLE ML (VALUE +110), Mitchell O24.5, Barnes O22.5
- HOU-LAL: HOU ML, LeBron O25.5, Smith Jr O12.5
- G6 Player Props Parlay: Embiid + Brunson + Jokic + Mitchell ~+650

---

## Key Functions Reference

| Function | File | Purpose |
|----------|------|---------|
| `calcTeamRating(players, advStats, ...)` | engine/ratings.js | Aggregate player ratings to team rating |
| `calcWinProb(home, away, ...)` | engine/matchups.js | Raw win probability from team differential |
| `getBlendedPrediction(series, gameNum)` | engine/projections.js | Full 18-step prediction with lineage |
| `buildGameAttribution(series, gameNum)` | engine/projections.js | Post-game error attribution |
| `runChaosSim(series, gameNum, N)` | engine/simulation.js | Monte Carlo simulation (N iterations) |
| `calcTeamFatigue(players, seriesId)` | engine/fatigue.js | Team-level fatigue aggregation |
| `calcSPMChemistry(lineup)` | engine/chemistry.js | 8-dimension chemistry score |
| `graduateSeries(seriesId)` | engine/graduation.js | Handle series completion + round transition |
| `renderProjectionWaterfall(blend)` | ui/components.js | SVG waterfall chart for lineage |
| `renderGameAttribution(series, gameNum)` | ui/components.js | Post-game error attribution panel |
| `renderBetsPage(el)` | ui/bets.js | Full bets page with all tabs |
| `switchBetTab(tab)` | ui/navigation.js | Dynamic bet tab switching |
| `switchPage(page)` | ui/navigation.js | Page navigation |
| `switchRound(round)` | ui/navigation.js | Round-level navigation |

---

## Data Conventions

- `SERIES_DATA` array is the single source of truth for all series info
- Game results live in `series.games[]` — never duplicate elsewhere
- Each series has an `id` like `"r1-bos-phi"` used for localStorage V3 keying
- Player objects: `{name, pos, rating, baseRating, per, ts, epm, bpm, usg, vorp, ws48, onOff, clutch, dLebron, spm:{...}, injury, injuryRisk, matchupNote, ...}`
- External factors: `{factor, impact, evidence, source, category}`
- Box scores in `series.games[].boxScore` or in `boxscores.js`
- `homeCourtOverride: "away"` for HOU-LAL (LAL is 4-seed with HCA but listed as awayTeam)

### localStorage V3 Schema
Keys are series-ID based: `nba2026_r1-bos-phi_games`, `nba2026_r1-bos-phi_factors`, etc.
Backward-compatible migration from V2 (round-based) keys on boot.

---

## Model Phase History (key milestones)

| Phase | Description |
|-------|-------------|
| 1-10 | Initial model build, calibration against 2025 playoffs |
| 11-15 | G1 results, first Bayesian updates |
| 16-21 | G2 research, per-player outlooks, coaching data |
| 22 | Multi-file split, per-player game outlook system |
| 26 | Role flexibility, 3PT variance correlation |
| 28 | Blended prediction system (manual + engine) |
| 32 | Coaching adjustments, star elevation, youth breakouts |
| 35 | G3 analysis, Phase 35 model learnings |
| 36 | G4 results, model recalibration |
| 38 | G5 results (Tue+Wed), fatigue/injury updates |
| 40 | Monte Carlo chaos simulation (10K iterations) |
| 41 | Unified ensemble (manual + engine + sim) |
| 42 | Projection lineage waterfall, post-game attribution, round navigation, series graduation, localStorage V3 |
| 43 | Market odds calibration — all G6 bets updated vs real DraftKings lines. CLE ML +110→-170, Jokic O24.5→O29.5, parlays recalculated |
| 44 | G6 post-game attribution — 1/3 ML (worst day), 2/6 props. Star Elevation Modes concept (stars elevate via facilitating, not just scoring). Murray Inconsistency Factor. P&L -$698.47 |
| 45 | Deep lineage attribution — 19 engine/sim fixes validated at 25/42 (59.5%, +3.4pp). New concepts: Psychological Collapse (+0.4/pt above 12), Fortress Venue (+1.5), Liberation Factor (45% clawback), Elimination Streak (+1.5/win), Player Inconsistency (margin compression), Capitulation (25pt threshold), Cascading Collapse (1.3x compound). Sim upgraded to 10K iterations with wider chaos ranges. |
| 46 | Round 2 scaling — 4 new R2 series added (OKC-LAL, SAS-MIN, DET-CLE, NYK-PHI) with full rosters graduated from R1, updated injury statuses, defensive matchups, synergy lineups, external factors, and research-backed G1 predictions. Round navigation auto-detects R2 tab. |

---

## Known Quirks

- `calcTeamFatigue` filters `getEffectiveRating(p, seriesId) > 0`, so injury-returned players need `rating > 0` (not 0) to appear in fatigue monitor
- HOU-LAL uses `homeCourtOverride: "away"` — HCA is inverted at calc time
- `switchBetTab()` uses dynamic `querySelectorAll('[id^="betContent-"]')` so new tabs auto-register
- Older Featured Parlays (pre-Apr 28) are wrapped in `<details>` for collapsibility
- OKC-PHX (4-0 sweep) and SAS-POR (4-1) are completed series — no more game predictions

---

## How to Continue This Project

1. Read this `CONTEXT.md` and the `README.md` for orientation
2. Key globals: `SERIES_DATA`, `currentPlayoffRound`, `currentConf`, `ROUND_META`
3. When adding game results: update `series.games[]`, `modelLessons`, prediction objects, bets page, and parlay results
4. When adding new engine factors: add to `getBlendedPrediction()` lineage array and update definitions.js
5. Bets page: new game tabs auto-register via dynamic selectors — just add `betContent-gN` div and `betTab-gN` button
6. Run `node -c js/path/to/file.js` for syntax checks (all files should pass individually)
