# 2026 NBA Playoff Analyzer — Advanced Metrics Edition

A comprehensive, research-backed NBA playoff prediction and analysis tool built with vanilla HTML, CSS, and JavaScript. Tracks all first-round matchups of the 2026 NBA Playoffs with game-by-game projections, real-time result tracking, Monte Carlo simulation, and an interactive scenario builder.

**Current model accuracy: G1-G5 ML record 22/38 (57.9%) | G1 8/13 (61.5%) | G4 3/4 (75%) | G5 5/7 (71.4%)**

## Features

- **Unified Ensemble Prediction System** (Phase 41) — blends manual analysis (72.7% winner accuracy), a multi-factor engine, and a 10,000-iteration Monte Carlo chaos simulation into a single probability output with calibrated standard deviation (SD ±11.6)
- **18-step Game Projection Engine** incorporating home court, fatigue, chemistry, matchup suppression, star elevation, coaching adjustments, 3PT variance, role flexibility, youth breakouts, turnover tendencies, and more
- **Monte Carlo Chaos Simulation** (Phase 40) — models correlated scoring runs, momentum swings, fatigue cascades, and foul trouble using interdependent random variables. Calibrated against 28,000+ historical playoff games
- **Projection Lineage Waterfall** (Phase 42) — SVG visualization showing each engine factor's delta contribution to the final predicted margin, with a running margin tracker
- **Post-Game Factor Attribution** (Phase 42) — after a game completes, distributes prediction error proportionally across lineage steps to identify which factors over/under-predicted
- **SPM Chemistry Engine** based on Maymin et al. (2013) — models player synergy across 8 skill dimensions
- **Scenario Builder** — toggle players in/out to see how injuries and lineup changes shift win probability in real time
- **Series Graduation** (Phase 42) — handles round transitions with fatigue/injury carryover when a series concludes
- **Round-Level Navigation** — supports R1/R2/Conference Finals/Finals hierarchy with persistent state
- **Betting Analysis** with spread picks, ML recommendations, player prop bets (O/U points, assists, rebounds), and featured parlays for every game with a running P&L tracker
- **Model Learnings** page documenting 42 phases of model evolution with what worked, what failed, and calibration updates
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
├── index.html                  # App shell — modals, script tags in dependency order
├── css/
│   └── styles.css              # All styling with mobile-responsive breakpoints
├── js/
│   ├── app.js                  # Boot sequence — loads state, initializes, renders
│   ├── state.js                # UI state, scenario builder, localStorage V3 persistence
│   ├── utils.js                # Formatters, rating tiers, stat edge/note generators
│   ├── data/
│   │   ├── constants.js        # HCA values, Game 7 overrides, SPM coefficients, round metadata
│   │   ├── series-data.js      # All series — rosters, stats, predictions, box scores, factors
│   │   ├── boxscores.js        # Detailed per-player box score data for completed games
│   │   └── historical.js       # Historical "what if player X was missing" data
│   ├── engine/
│   │   ├── ratings.js          # Team rating calculation (replacement-level slot system)
│   │   ├── projections.js      # 18-step game projection + margin variance + lineage + attribution
│   │   ├── chemistry.js        # SPM Chemistry (Maymin et al.), on/off summaries
│   │   ├── fatigue.js          # Player and team fatigue calculations with injury-return handling
│   │   ├── matchups.js         # Bounce-back probability, defensive suppression, raw win prob
│   │   ├── simulation.js       # Monte Carlo chaos simulation (10K iterations, correlated vars)
│   │   └── graduation.js       # Series graduation for round transitions with carryover
│   └── ui/
│       ├── components.js       # Reusable UI — scenario builder, stat bars, fatigue, waterfall
│       ├── series-renderer.js  # Main series view — rosters, synergy, coaching, SPM
│       ├── modals.js           # Game result and external factor modal handlers
│       ├── navigation.js       # Tab switching — rounds, series, games, pages, bet tabs
│       ├── learnings.js        # Model Learnings page — 42 phases, collapsible timeline
│       ├── definitions.js      # Metric definitions page with category tabs
│       └── bets.js             # Betting analysis — G1-G6, player props, parlays, P&L tracker
├── CLAUDE.md                   # Memory file for Claude (project context and conventions)
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

1. **Series Analysis** — Select a conference round and series from the tabs. View rosters, advanced stats, synergy lineups, coaching analysis, and game-by-game projections with projection lineage waterfall charts.
2. **Scenario Builder** — Toggle players in/out to simulate injuries or lineup changes. Win probability updates instantly.
3. **Game Results** — Click any game card to enter the actual result. The model saves your entries to localStorage V3 and recalculates downstream projections, including post-game attribution.
4. **External Factors** — Add off-court factors (injuries, chemistry issues, motivation) with impact ratings. These feed into the projection engine.
5. **Model Learnings** — Review 42 phases of model evolution, from initial calibration to Monte Carlo integration and ensemble unification.
6. **Definitions** — Browse all metric definitions including Projection Lineage, Post-Game Attribution, Series Graduation, and Monte Carlo Simulation.
7. **Bets** — View G1-G6 ML picks, player prop bets (O/U points, assists), featured parlays with player prop add-ons, and a running $100/$1 P&L tracker.

## Model Evolution (42 Phases)

The model has gone through 42 phases of development, each adding new factors, fixing biases, and recalibrating against actual results. Key milestones include Phase 22 (per-player game outlooks), Phase 28 (blended prediction system), Phase 32 (coaching adjustments and star elevation), Phase 40 (Monte Carlo chaos simulation), Phase 41 (unified ensemble), and Phase 42 (projection lineage, post-game attribution, round navigation, series graduation).

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
