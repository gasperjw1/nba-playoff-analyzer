# 2026 NBA Playoff Analyzer — Advanced Metrics Edition

A comprehensive, research-backed NBA playoff prediction and analysis tool built with vanilla HTML, CSS, and JavaScript. Covers all 8 first-round matchups of the 2026 NBA Playoffs with game-by-game projections, real-time result tracking, and a scenario builder for what-if analysis.

## Features

- **Win probability engine** calibrated against 49 games from the 2025 NBA Playoffs (73.5% accuracy) and backtested against all 86 games of the 2024 Playoffs
- **11-step game projection model** incorporating margin variance, fatigue, chemistry, and defensive matchup suppression
- **SPM Chemistry Engine** based on Maymin et al. (2013) — models player synergy across 8 skill dimensions
- **Scenario builder** — toggle players in/out to see how injuries and lineup changes shift win probability in real time
- **External factor tracking** with sourced evidence for injuries, off-court issues, coaching pressure, and motivation narratives
- **Betting analysis** with spread picks, moneyline recommendations, and margin-backed parlays for every game
- **Model Learnings** page documenting what the model got right and wrong after each game, with calibration updates

## How It Works

The prediction model combines multiple research-backed components:

- **Player Composite Rating** — Weighted blend of PER, TS%, EPM, BPM, Usage context, WS/48, On/Off, and Clutch metrics (scale 0–100)
- **Team Rating** — Aggregated from player ratings using a replacement-level slot system, integrated with VORP/USG (Ylä-Autio 2022) and LEBRON/WAR (BBall Index)
- **Win Probability** — Logistic model derived from team rating differential, round-adjusted home court advantage, system coherence, championship DNA, star ceiling variance, bounce-back probability, and series-stage pressure (Mateus et al. 2024)
- **Margin Projection** — Converts win probability to expected margin using talent gap amplifiers, depth disparity, and star absence adjustments calibrated to 2025 playoff margin patterns
- **Fatigue Monitor** — Tracks rest days, minutes load, and injury risk per player per game (medium confidence, 0.75× weight)
- **Defensive Matchup Suppression** — Models how elite defenders reduce opponent star output using D-LEBRON ratings

## Project Structure

```
nba-playoff-analyzer/
├── index.html                  # App shell — thin HTML with modals and script tags
├── css/
│   └── styles.css              # All styling (503 lines)
├── js/
│   ├── app.js                  # Boot sequence — loads state, initializes, renders
│   ├── state.js                # UI state, scenario builder, localStorage persistence
│   ├── utils.js                # Formatters, rating tiers, stat edge/note generators
│   ├── data/
│   │   ├── constants.js        # HCA values, Game 7 overrides, SPM coefficients
│   │   ├── series-data.js      # All 8 series — rosters, stats, predictions, factors
│   │   └── historical.js       # Historical "what if player X was missing" data
│   ├── engine/
│   │   ├── ratings.js          # Team rating calculation (replacement-level slot system)
│   │   ├── projections.js      # 11-step game projection + margin variance engine
│   │   ├── chemistry.js        # SPM Chemistry (Maymin et al.), on/off summaries
│   │   ├── fatigue.js          # Player and team fatigue calculations
│   │   └── matchups.js         # Bounce-back probability, defensive suppression, raw win prob
│   └── ui/
│       ├── components.js       # Reusable UI — scenario builder, stat bars, fatigue monitor
│       ├── series-renderer.js  # Main series view — rosters, synergy, coaching, SPM
│       ├── modals.js           # Game result and external factor modal handlers
│       ├── navigation.js       # Tab switching — rounds, series, games, pages
│       ├── learnings.js        # Model Learnings page with collapsible phase boxes
│       ├── definitions.js      # Metric definitions page with category tabs
│       └── bets.js             # Betting analysis page — all 8 series, Game 1 & 2
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

1. **Series Analysis** — Select a conference round and series from the tabs. View rosters, advanced stats, synergy lineups, coaching analysis, and game-by-game projections.
2. **Scenario Builder** — Toggle players in/out to simulate injuries or lineup changes. Win probability updates instantly.
3. **Game Results** — Click any game card to enter the actual result. The model saves your entries to localStorage and recalculates downstream projections.
4. **External Factors** — Add off-court factors (injuries, chemistry issues, motivation) with impact ratings. These feed into the projection engine.
5. **Model Learnings** — Review what the model predicted vs. what happened, organized by research phase.
6. **Bets** — View spread picks, moneyline calls, and featured parlays for every game across all 8 series.

## Data Sources and Research

Player statistics sourced from Basketball Reference, NBA.com, and BBall Index. The model integrates findings from:

- Ylä-Autio (2022) — VORP/USG integration for cumulative value and usage efficiency
- Yeung (2020) — Non-linear interaction bonuses (3PT% × DRtg synergy, Pace × Depth)
- Jones & Magel (2016) — Stat differential model (FG%, 3PT%, ORB%, TOV differentials)
- Mateus et al. (2024) — Series-stage pressure amplification and pedigree effects
- Maymin et al. (2013) — Skills Plus Minus chemistry coefficients across 8 dimensions

## Tech Stack

- **HTML/CSS/JS** — No frameworks, no build step, no dependencies
- **localStorage** — Persists game results and player rating overrides between sessions
- **Global scope** — All functions available globally via ordered `<script>` tags (no ES modules)

## License

This project is for personal analysis and educational purposes.
