# NBA Playoff Analyzer 2026 — Project Context

> This document captures the full project state so that future sessions can pick up where we left off. Last updated: May 1, 2026 (Phase 44 complete, G6 results analyzed with post-game attribution).

---

## Overview

A multi-file interactive HTML/CSS/JS web app analyzing the 2026 NBA Playoffs. Features a 44-phase prediction model calibrated against 2025 results (73.5% initial accuracy), a Monte Carlo chaos simulation, interactive scenario builders, projection lineage waterfall charts, and a comprehensive betting analysis page with player props calibrated against real DraftKings sportsbook odds. Phase 44 introduced "Star Elevation Modes" concept and post-game attribution analysis for all G6 results.

**Current model accuracy: G1-G6 ML record 23/41 (56.1%) | G1 8/13 (61.5%) | G4 3/4 (75%) | G5 5/7 (71.4%) | G6 1/3 (33.3%)**

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
2. **Model Learnings** — 42-phase timeline of model evolution
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

## Series Status (as of April 30, 2026)

| Series | Score | Status | Next |
|--------|-------|--------|------|
| BOS-PHI | Tied 3-3 | Active | G7 Sat May 2 @ BOS |
| NYK-ATL | NYK 4-2 | Complete | NYK wins |
| DEN-MIN | MIN 4-2 | Complete | MIN wins |
| HOU-LAL | LAL 3-2 | Active | G6 Fri May 1 @ LAL |
| DET-ORL | ORL 3-2 | Active | G6 Fri May 1 @ ORL |
| CLE-TOR | CLE 3-2 | Active | G6 Fri May 1 @ TOR |
| OKC-PHX | OKC 4-0 | Complete | Sweep |
| SAS-POR | SAS 4-1 | Complete | SAS won G5 |

### Key Injury Notes (current)
- **Edwards (MIN)**: OUT until May 9 (knee)
- **DiVincenzo (MIN)**: OUT for season (Achilles)
- **Wagner (ORL)**: Questionable (calf)
- **Reaves (LAL)**: ACTIVE — returned G5 from oblique strain (22pts, 4-16 FG, rusty)
- **Embiid (PHI)**: Active since G2 (appendectomy recovery, baseRating 92, rating 80)

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
