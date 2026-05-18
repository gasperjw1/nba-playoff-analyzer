# 2026 NBA Playoff Analyzer — Advanced Metrics Edition

A comprehensive, research-backed NBA playoff prediction and analysis tool built with vanilla HTML, CSS, and JavaScript. Tracks 2026 NBA Playoff series game-by-game with projections, real-time result tracking, Monte Carlo simulation, an interactive scenario builder, and a Compound Historical Scenarios engine that fires evidence-backed adjustments when stacked conditions match.

**Current model accuracy:** R1 final 28/48 ML (58.3%, 9.6pt avg margin error). Series-stage curve: G1–G3 50% → G4–G7 67% — accuracy improves as in-series data accumulates. Round 2 in progress (4 series, G2 slate).

## Features

- **Home Landing Page** (Phase 57) — adaptive layout. Tonight's games render as auto-fit cards with the live blended ML pick, projected score, slate context, and an "Open series →" link. Featured Parlays section has a toggle between **Reliable Floor** (80%+ floor-style hit rate) and **Traditional** (regression / bounce-back / chaos). Latest News feed (curated injury/availability notes). Tonight's Bets render as per-series columns when ≥2 games are scheduled; News + Bets sit side-by-side when only one game is on (Conference Finals / Finals).
- **Unified Ensemble Prediction System** (Phase 41) — blends manual analysis, a multi-factor engine, and a 10,000-iteration Monte Carlo chaos simulation into a single probability output with calibrated standard deviation (SD ±11.6)
- **Compound Historical Scenario Engine** (Phase 52) — conditional-narrowing system. Each player carries stacked historical conditions (role + opponent team + venue + coach + primary defender + playoff context + health). When all conditions match, the scenario fires and adjusts projections; multiple matches compound at 70% decay. Cascade model propagates teammate adjustments when a star delta exceeds 2pts. Rendered inline on every game tab and bet card.
- **18-step Game Projection Engine** incorporating home court, fatigue, chemistry, matchup suppression, star elevation, coaching adjustments, 3PT variance, role flexibility, youth breakouts, turnover tendencies, compound historical scenarios, and more
- **Multiplicative Context Architecture** (Phase 51) — Fatigue, Scheme Persistence, and Inconsistency are proportional to the base talent edge (±12% / ±20% / 15% compression) instead of fixed-point additions. WIN_PROB_SCALE recalibrated 15→35 for realistic 55-82% favorite range, supported by 2025+2026 cross-year validation showing underdogs win 41.7% of playoff games.
- **Dynamic Per-Player Rating Adjustments** (Phase 50) — injury severity, playoff ascension, and coaching scheme adjustments wired into `calcTeamRating` per player rather than as team-level flat bonuses.
- **Monte Carlo Chaos Simulation** (Phase 40, 10K iterations Phase 45) — models correlated scoring runs, momentum swings, fatigue cascades, foul trouble, capitulation threshold, and cascading collapse using interdependent random variables.
- **Projection Lineage Waterfall** (Phase 42) — SVG visualization showing each engine factor's delta contribution to the final predicted margin, with a running margin tracker
- **Post-Game Factor Attribution** (Phase 42) — after a game completes, distributes prediction error proportionally across lineage steps to identify which factors over/under-predicted
- **SPM Chemistry Engine** based on Maymin et al. (2013) — models player synergy across 8 skill dimensions
- **Scenario Builder** — toggle players in/out to see how injuries and lineup changes shift win probability in real time
- **Series Graduation** (Phase 42) — handles round transitions with fatigue/injury carryover when a series concludes. Used to graduate all 4 R2 series from R1 winners.
- **Round-Level Navigation** — R1/R2/Conference Finals/Finals hierarchy with persistent state
- **Declarative Bet Card Schema** (Phase 55) — bet cards migrated from hand-styled HTML to a typed `BETS` array + `BET_SLATES` metadata + single `renderBetCard()` renderer. Type/pick/odds/facts/chs/confidence/thesis[]/narrative/result fields. 36 R2 cards through one pipeline; bets.js dropped 3578→3252 lines. Adding a new G3 slate is ~10 lines of data.
- **Dynamic Blended Bets** (Phase 48) — every R2 ML/spread/margin pick interpolated from `calcBlendedProjection()` at render time via `dml`/`dmargin`/`dwinner` helpers. Bet cards always reflect current model state.
- **2025 Playoffs Validation Dataset** — `playoffs_2025_validation.js` tracks game-by-game 2025 results as an independent validation set; `test-projections.js` TEST 6 covers the CHS engine with 19 new assertions (3447→3466 total, 0 failures)
- **Model Learnings** page documenting 56 phases of model evolution with what worked, what failed, and calibration updates
- **localStorage V3** — series-ID keyed persistence with backward-compatible V2 migration

## How It Works

The prediction model combines multiple research-backed components:

- **Player Composite Rating** — Weighted blend of PER, TS%, EPM, BPM, Usage context, WS/48, On/Off, and Clutch metrics (scale 0-100)
- **Team Rating** — Aggregated from player ratings using a replacement-level slot system, integrated with VORP/USG (Yla-Autio 2022) and LEBRON/WAR (BBall Index)
- **Blended Win Probability** — Combines manual picks, engine projections, and Monte Carlo simulation into a unified ensemble probability per game
- **Margin Projection** — Converts win probability to expected margin using talent gap amplifiers, depth disparity, star absence adjustments, and chaos simulation variance
- **Fatigue Monitor** — Tracks rest days, minutes load, injury risk, and active injury status per player per game
- **Defensive Matchup Suppression** — Models how elite defenders reduce opponent star output using D-LEBRON ratings, with scheme-driven vs. variance-driven categorization
- **Star Elevation Effect** — Models how elite players elevate scoring in high-stakes games (elimination, close-out)
- **Coaching Adjustment Model** — Post-loss adaptation patterns calibrated per head coach with historical adjustment data

## Project Structure

```
nba-playoff-analyzer/
├── index.html                       # App shell — modals, script tags in dependency order
├── css/
│   └── styles.css                   # All styling with mobile-responsive breakpoints
├── js/
│   ├── app.js                       # Boot sequence — loads state, initializes, renders, default-round selection
│   ├── state.js                     # UI state, scenario builder, localStorage V3 persistence
│   ├── utils.js                     # Formatters, rating tiers, stat edge/note generators
│   ├── data/
│   │   ├── constants.js             # HCA values, Game 7 overrides, SPM coefficients, round metadata, PLAYOFF_ADJUSTMENT, SIM_CONFIG, CURRENT_DATE
│   │   ├── series-data.js           # All series — rosters, stats, predictions, box scores, factors, priorRound graduation data, CHS scenarios
│   │   ├── bets-data.js             # Phase 55/57 — declarative BETS, BET_SLATES, FEATURED_PARLAYS (Floor + Traditional)
│   │   ├── news.js                  # Phase 57 — curated NEWS feed (date/severity/series/headline/body/source)
│   │   ├── boxscores.js             # Detailed per-player box score data for completed games
│   │   └── historical.js            # Historical "what if player X was missing" data
│   ├── engine/
│   │   ├── ratings.js               # Team rating with per-player dynamic adjustments (Phase 50)
│   │   ├── projections.js           # 18-step game projection + last-name fallback matcher + margin variance + lineage + attribution
│   │   ├── chemistry.js             # SPM Chemistry (Maymin et al.), on/off summaries
│   │   ├── fatigue.js               # Player and team fatigue calculations with injury-return handling
│   │   ├── matchups.js              # Bounce-back probability, defensive suppression, raw win prob
│   │   ├── simulation.js            # Monte Carlo chaos simulation (10K iterations, capitulation, cascading collapse)
│   │   ├── scenarios.js             # Phase 52 — Compound Historical Scenarios engine, buildGameContext, cascade
│   │   └── graduation.js            # Series graduation for round transitions with carryover
│   └── ui/
│       ├── components.js            # Reusable UI — scenario builder, stat bars, fatigue, waterfall, renderCHSScenarios
│       ├── series-renderer.js       # Main series view — rosters, synergy, coaching, SPM, CHS panel per game
│       ├── bet-card.js              # Phase 55 — renderBetCard() + renderBetSlateSeries() — single declarative renderer
│       ├── home.js                  # Phase 57 — renderHomePage() + adaptive layout + Floor/Traditional parlay toggle
│       ├── modals.js                # Game result and external factor modal handlers
│       ├── navigation.js            # Tab switching — Home is the default
│       ├── learnings.js             # Model Learnings page — collapsible phase timeline (currently through Phase 57)
│       ├── definitions.js           # Metric definitions page with category tabs
│       └── bets.js                  # Betting orchestrator — slate sections + dynamic dml/dmargin/dwinner helpers
├── playoffs_2025_validation.js      # 2025 playoffs game-by-game results (independent validation dataset)
├── test-projections.js              # Integration test suite — 3466 assertions incl. TEST 6 CHS coverage
├── BACKTEST_R1.md                   # R1 backtest report (28/48, 58%, G1-3 50% → G4-7 67%)
├── CONTEXT.md                       # Project context notes
├── CLAUDE.md                        # Memory file for Claude (project context and conventions)
└── README.md
```

## Getting Started

No build tools or dependencies required. Open `index.html` in any modern browser:

```bash
# Clone the repo
git clone https://github.com/gasperjw1/nba-playoff-analyzer.git
cd nba-playoff-analyzer

# Open in browser
open index.html
# or
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Usage

1. **Series Analysis** — Select a conference round and series from the tabs. View rosters, advanced stats, synergy lineups, coaching analysis, projection lineage waterfall, and the per-game CHS panel showing which compound scenarios fired and how they cascaded across teammates.
2. **Scenario Builder** — Toggle players in/out to simulate injuries or lineup changes. Win probability updates instantly.
3. **Game Results** — Click any game card to enter the actual result. The model saves your entries to localStorage V3 and recalculates downstream projections, including post-game attribution.
4. **External Factors** — Add off-court factors (injuries, chemistry issues, motivation) with impact ratings. These feed into the projection engine.
5. **Model Learnings** — Review 56 phases of model evolution, from initial calibration through Monte Carlo integration, ensemble unification, multiplicative context architecture, and the Compound Historical Scenarios engine.
6. **Definitions** — Browse all metric definitions including Projection Lineage, Post-Game Attribution, Series Graduation, Compound Historical Scenarios, Multiplicative Context Factors, Dynamic Rating Adjustments, and the Declarative Bet Card Schema.
7. **Bets** — Per-game ML picks, spreads, player props, and featured parlays. All bets render through one declarative pipeline; ML/margin/winner values interpolate live from the blended model.

## Model Evolution

The model has gone through 70+ phases. Selected milestones:

- **Phases 22-42** — Multi-file split, per-player outlooks, ensemble (manual + engine + Monte Carlo), projection lineage, round navigation
- **Phases 48-52** — Dynamic blended bets, win probability recalibration, Compound Historical Scenarios engine
- **Phase 57** — Home landing page (Tonight / Bets / News / Featured Parlays)
- **Phases 61-65** — Monte Carlo simulator + Reliable/Traditional parlay builder
- **Phase 68** — Edge detector + empirical PLACE/CAUTION/SKIP cross-tab
- **Phases 69-70** — Anti-big-loss guardrails (concentration, Kelly, blowout) + risk-analyst dashboard (Sharpe/VaR/RoR)
- **Phase 71** — 68-game calibration audit; **71b/c** — star bias correction + per-player override

Full timeline in the in-app Model Learnings tab. Current state in [`CONTEXT.md`](CONTEXT.md). Daily workflow in [`DAILY_UPDATE.md`](DAILY_UPDATE.md). Audit findings in [`CALIBRATION_AUDIT.md`](CALIBRATION_AUDIT.md).

## Data Sources and Research

Player statistics sourced from Basketball Reference, NBA.com, BBall Index, Fadeaway World, and Sports Illustrated. The model integrates findings from:

- Yla-Autio (2022) — VORP/USG integration for cumulative value and usage efficiency
- Yeung (2020) — Non-linear interaction bonuses (3PT% x DRtg synergy, Pace x Depth)
- Jones & Magel (2016) — Stat differential model (FG%, 3PT%, ORB%, TOV differentials)
- Mateus et al. (2024) — Series-stage pressure amplification and pedigree effects
- Maymin et al. (2013) — Skills Plus Minus chemistry coefficients across 8 dimensions

## Tech Stack

- **HTML/CSS/JS** — No frameworks, no build step, no dependencies
- **localStorage V3** — Series-ID keyed persistence with backward-compatible migration
- **Global scope** — All functions available globally via ordered `<script>` tags (no ES modules)
- **Mobile-responsive** — CSS breakpoints for phone and tablet layouts

## License

This project is for personal analysis and educational purposes.
