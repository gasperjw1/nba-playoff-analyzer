# NBA Playoff Analyzer 2026 — Project Context

> This document captures the full history of building this app across multiple Claude sessions so that future sessions can pick up where we left off.

---

## Overview

A single-file interactive HTML/CSS/JS app that analyzes all 8 first-round matchups of the 2026 NBA Playoffs. It features a custom statistical model calibrated against 2025 NBA Playoff results (73.5% accuracy across 49 games), interactive scenario builders, and a comprehensive betting analysis page.

**File:** `index.html` (~4,140 lines)

---

## App Architecture

### Pages (4 tabs via `switchPage()`)

1. **Series Analysis** — The main page. 8 tabbed series with interactive scenario toggles, win probability calculations, coaching data, and game-by-game results.
2. **Model Learnings** — Backtested insights from the 2025 playoffs (what the model got right/wrong).
3. **Definitions** — Explains every custom metric (HCA, SPM, systemBonus, playoffPedigree, starCeiling, etc.).
4. **Bets (All 8)** — Betting picks organized by Game 1 (4 series) and Game 2 (4 series) with High/Medium/Low confidence tiers and featured parlays.

### File Structure (approximate line ranges)

| Section | Lines | Description |
|---------|-------|-------------|
| CSS styles | 1–420 | Semantic tier variables, bets page styles, responsive layout |
| HTML shell | 440–460 | 4 page nav buttons, tab container, main content div |
| `SERIES_DATA` array | 460–1580 | All 8 series with full rosters, stats, predictions, coaching |
| `HISTORICAL_WITHOUT` | 1580–1680 | Historical without-star performance data |
| Scenario state mgmt | 1680–1830 | `togglePlayer()`, `clearSPMCache()`, localStorage |
| SPM Chemistry Engine | 1830–1970 | `calcSPMChemistry()`, `getCachedSPM()` with Map cache |
| Constants & formulas | 1970–2100 | `HCA_BY_ROUND`, `calcTeamRating()`, system bonuses |
| Win probability | 2100–2210 | `calcWinProb()`, `getSeriesScore()`, `getGameResultDisplay()` |
| Render functions | 2210–2800 | `renderSeries()`, tabs, coaching panels, scenario builder |
| Edge helpers | 2760–2810 | Factory pattern: `getStatEdge()`, `getStatNote()` |
| Page navigation | 2810–2930 | `switchPage()`, `renderLearningsPage()` |
| Definitions page | 2930–3112 | `renderDefinitionsPage()` |
| Bets page | 3114–3610 | `renderBetsPage()` — all 8 series, 4 parlays |
| Init | 3612+ | `loadState()`, `initScenarioState()`, initial render |

---

## Core Model Concepts (Research-Enhanced v3)

### Rating System
- **Player ratings**: 0–97 scale (Jokic 97, SGA 96, Wemby 94, etc.)
- **baseRating** vs **rating**: `baseRating` is healthy; `rating` reflects current availability (e.g., Embiid baseRating 92 → rating 55 due to appendectomy)
- **Player advanced stats**: Each player now includes `vorp` (Value Over Replacement Player) and `usg` (Usage Rate %)
- **Team rating**: `calcTeamRating()` aggregates player ratings, VORP/USG, systemBonus, playoffPedigree, non-linear interactions, and health degradation
- **Team advStats**: Now includes `fgPct`, `threePct`, `ftPct`, `orbPct` for stat differential calculations

### Key Modifiers
| Modifier | Range | Formula/Effect |
|----------|-------|----------------|
| **Round-Adjusted HCA** | R1:3.0, R2:2.0, CF:1.5, Finals:1.0 | Added to home team's base in `calcWinProb()` |
| **System Coherence (systemBonus)** | -2 to +3 | Per-team; reflects coaching system quality |
| **Championship DNA (playoffPedigree)** | 0–2 | `pedigree * 0.8` added to team rating |
| **Star Ceiling Variance (starCeiling)** | 0–2 per player | `starCeiling * 0.3` added to win probability |
| **Health Degradation (injuryRisk)** | 0–1.0 per player | `injuryRisk * roundDepth * 0.4` penalty |
| **Game 7 Override** | +5.0 HCA | When series tied 3-3 |
| **VORP Aggregation** | team total | `(totalVorp - 15) / 8` added to team rating (Ylä-Autio 2022) |
| **USG Efficiency** | ±1.5 | High avg USG × good team TS% = efficient volume bonus |
| **Stat Differentials** | ±3 | FG%, 3PT%, ORB%, TOV differentials in `calcWinProb()` (Jones & Magel 2016) |
| **Series-Stage Pressure** | 0–1+ | Pedigree advantage amplified in later-series games (Mateus et al. 2024) |
| **Non-Linear Interactions** | 0–1+ | 3PT%+DRtg synergy and Pace+Depth bonuses (Yeung 2020) |

### SPM Chemistry Engine (v2 — 8 dimensions)
- `calcSPMChemistry()` scores lineup chemistry across **8 skill dimensions** (up from 6)
- Original 6: oScr, oBH, oReb, dScr, dBH, dReb
- New 2: **o3PT** (3-point shooting), **oPass** (ball distribution) per Mateus et al. 2024
- Key new synergies: shooters+passers (+0.350), two ball-dominant players (-0.650)
- Results cached via `getCachedSPM()` with a `Map`-based cache (`_spmCache`)
- Cache cleared on any player toggle (`clearSPMCache()`)

### Edge Helper Factory
```javascript
function getStatEdge(s, statFn, threshold, fmt) { ... }
// Stat extractors: _epm, _syn, _clutch, _spm, _onoff, _ext
```

---

## Series Data (as of last session)

### Game 1 Results (April 18, 2026 — verified box scores)

| Series | Result | Key Stats |
|--------|--------|-----------|
| **HOU-LAL** | LAL 107–98 | LeBron 19/13ast, Kennard 27 (7/11 3PT), Ayton 19/11. HOU: Sengun 19pts, Thompson 17, Sheppard 17. LAL 60.6% FG |
| **DEN-MIN** | DEN 116–105 | Murray 30 (16/16 FT), Jokic 25/13/11. Edwards 22/9/7/3blk, Gobert 17 (8/9), Randle 16 |
| **NYK-ATL** | NYK 113–102 | Brunson 28/5/7, Towns 25/8/4/3blk, OG 19. McCollum 26, J.Johnson 23, Okongwu 19, NAW 17 |
| **CLE-TOR** | CLE 126–113 | Mitchell 32 (11/20), Harden 22/10, Strus 24, Mobley 17/7. Barrett 24, Barnes 21/7ast, Ingram 17 |

### Game 1 Not Yet Played (predictions)

| Series | Spread | Pick | Confidence | Projected |
|--------|--------|------|------------|-----------|
| **OKC-PHX** | OKC -13.5 | OKC | High | 118–104 |
| **SAS-POR** | SAS -10.5 | SAS | High | 115–102 |
| **DET-ORL** | DET -3.5 | DET | Medium | 110–103 |
| **BOS-PHI** | BOS -12.5 | BOS | High | 112–98 |

### Key Roster Notes
- **Trae Young** traded to Wizards (Jan 9, 2026) — NOT on Hawks
- **HOU-LAL** uses `homeCourtOverride: "away"` — LAL (4 seed) has actual home court but is listed as `awayTeam` in data. HCA inverted at calc time.
- **Embiid**: Emergency appendectomy, unlikely G1, possibly entire R1. Rating dropped 92→55.
- **Paul George**: 25-game suspension (Jan 31), just returned. Rating 75→68.
- **POR**: HC Billups removed (gambling investigation), Tiago Splitter interim.
- **Cade Cunningham**: GTD, returned from collapsed lung. Rating 90→87.
- **Wembanyama**: Rib contusion, expected to play. Rating 94.

---

## Bugs Found & Fixed (History)

1. **HOU-LAL G2 pros/cons swapped**: prosHome contained LAL content. Fixed by swapping all 4 arrays.
2. **HOU-LAL G2 pick wrong direction**: Pick said HOU when LAL won G1. Changed to LAL (medium).
3. **Trae Young on Hawks**: 3 references in bets page after his trade to WAS. Replaced with NAW/McCollum/J.Johnson.
4. **Sengun G1 stats (27/10 → 19pts)**: Wrong in 6+ locations. All corrected.
5. **Thompson G1 stats (26/11 → 17pts)**: Wrong in 4+ locations. All corrected.
6. **NYK-ATL stats**: NAW 23→17, Okongwu 23→19, J.Johnson "triple-double"→23pts.
7. **Kennard "Memphis's primary shooter"**: Changed to "LAL's primary floor spacer".
8. **actualResult "Over 207.5"**: LAL 107 + HOU 98 = 205 = Under. Corrected, then removed in dedup refactor.
9. **Duplicate data (actualResult + games[])**: Created `getGameResultDisplay()` helper, removed all `actualResult` fields.
10. **calcSPMChemistry called 5x per render**: Added `getCachedSPM()` cache.

---

## Refactoring History

- **Edge helper factory**: 7 separate `getXxxEdge()` functions → single `getStatEdge()` with lambda extractors
- **Semantic CSS tier variables**: `--tier-elite`, `--tier-high`, `--tier-mid`, `--tier-low` replacing repeated color strings
- **SPM cache**: Map-based cache for chemistry calculations
- **Unified game results**: `getGameResultDisplay()` as single source of truth for game outcomes

---

## Data Sources & Limitations

- **WebFetch blocked** for most sports sites (ESPN, NBA.com, Fox Sports, CBS Sports, NBC Sports)
- Box scores verified via WebSearch snippets cross-referencing AP wire stories (thescore1260.com, clickondetroit.com, etc.)
- **2K simulation contamination**: One search mixed NBA 2K26 sim stats with real data. Identified and excluded.
- Betting lines are approximate projections, not live sportsbook data.

---

## Possible Future Work

- [ ] Update with actual Game 1 results for OKC-PHX, SAS-POR, DET-ORL, BOS-PHI when played
- [ ] Add Game 2 predictions for those 4 series after G1 results
- [ ] Update Game 2 results for HOU-LAL, DEN-MIN, NYK-ATL, CLE-TOR when played
- [ ] Extend to Round 2 when matchups are set
- [ ] Add a "Model Accuracy" tracker comparing predictions to actual outcomes
- [ ] Consider splitting into multi-file architecture if app grows beyond ~5K lines
- [ ] Add data visualization (charts for win probability shifts, series timelines)
- [ ] Mobile responsiveness improvements
- [ ] Dark/light theme toggle

---

## How to Continue This Project

When starting a new Claude session to work on this project:

1. Point Claude at this repo / share `index.html` and `CONTEXT.md`
2. Reference this doc for architecture, data structures, and known issues
3. Key functions to know: `calcTeamRating()`, `calcWinProb()`, `renderSeries()`, `renderBetsPage()`, `getCachedSPM()`, `getGameResultDisplay()`, `switchPage()`
4. The `SERIES_DATA` array is the single source of truth for all series information
5. Game results live in `series.games[]` — never duplicate them elsewhere
6. When adding new game results, update: `games[]`, `modelLessons`, `game2` (or `game3`, etc.), and the bets page

---

## Research-Enhanced v3 Changelog (April 19, 2026)

### Academic Papers Integrated
1. **Ylä-Autio (2022)** — VORP and USG% as most predictive advanced metrics
2. **Jones & Magel (2016)** — Team-level stat differentials (91.45% variance explained)
3. **Mateus et al. (2024)** — Series-stage pressure, player behavior clusters, ball distribution
4. **Yeung (2020)** — Non-linear feature interactions (Random Forest ROC-AUC 0.841)

### Model Changes
- Added `vorp` and `usg` to all 141 player objects
- Added `fgPct`, `threePct`, `ftPct`, `orbPct` to all 16 team advStats
- VORP aggregation bonus in `calcTeamRating()`
- USG-efficiency modifier in `calcTeamRating()`
- Stat differential model (FG%, 3PT%, ORB%, TOV) in `calcWinProb()`
- Series-stage pressure modifier (`getSeriesPressureMod()`)
- Non-linear interaction bonuses (3PT%+DRtg, Pace+Depth)
- SPM Chemistry expanded to 8 dimensions (added o3PT, oPass)
- Updated definitions page with all new metrics

### Backtest Results (v3 vs v2)
- **Winners correct: 3/4 (75%)** — same as v2
- **Key improvement**: CLE-TOR confidence upgraded from LOW to 97% (massive calibration fix)
- **Persistent miss**: HOU-LAL — model still favors HOU (64%) due to structural depth advantage; LAL's G1 win was a LeBron facilitator masterclass that the model can't fully capture

---

## Web Research Update (April 19, 2026 — Session 3)

### Sources Consulted
- ESPN scoreboard (April 19 spreads), ESPN Western & Eastern Conference takeaways
- Yahoo Sports comprehensive Game 1 analysis (Databallr metrics)
- NBA.com live updates and play-by-play

### Key Insights Incorporated
1. **HOU-LAL**: LAL zone defense toggling (.960 PPP in zone, 3rd-most-frequent zone team). LeBron 93rd pctile points created / 95th rim assists per Databallr. Sengun 6/19, Sheppard 6/20 — both exploited. HOU had 3 non-spacers at times vs zone.
2. **DEN-MIN**: Murray 16/16 FT (historic). Jokic slow start (3pts Q1). Edwards 7-of-19 FG — knee affecting efficiency, not availability. MIN cut to 97-95 in Q4.
3. **NYK-ATL**: ATL bench crisis worse than modeled (Kuminga 8pts/27min, Gueye+Vincent 5pts). Daniels 4pts/11ast/9reb/3stl = glue guy the model undervalues.
4. **CLE-TOR**: CLE paint dominance 48-30. TOR 1 fast-break point (league leader in transition). Poeltl no-show 4/6. TOR 18 turnovers → 22 CLE pts. CLE held TOR below 110 first time all season.
5. **Spread updates**: DET-ORL moved from -3.5 to -8.5 (massive, upgraded to HIGH confidence). OKC-PHX moved from -13.5 to -14.5.

### Model Gaps Identified (Future Work)
- **Defensive scheme versatility**: Zone/man toggling not captured (see LAL)
- **Efficiency-based injury impact**: Binary injuryRisk misses "plays but diminished" (see Edwards)
- **Connector bonus**: High-ast/low-usg players undervalued in SPM chemistry (see Daniels)
- **Paint-specific defense**: Team DRtg doesn't capture paint dominance vs perimeter defense tradeoffs
- **Bench depth as force multiplier**: Stars drawing doubles create open looks for bench; needs modeling

---

## Analytics Sites Deep Dive (April 19, 2026 — Session 4)

### Sites Accessed via Claude in Chrome
1. **Basketball Reference** — Regular season advanced stats for ~50 players (PER, BPM, VORP, WS/48, USG%)
2. **BBall Index** — LEBRON metric methodology (data behind paywall, methodology extracted)
3. **FantasyLabs** — On/off court NetRtg for DEN players (AG Grid extraction)
4. **Inpredictable wpBox** — Win Probability Added (WPA) for all 4 Game 1s + Four Factors breakdown
5. **Inpredictable ssnTeamPoss** — Offensive and defensive PPP rankings for all teams

### BBRef Stat Corrections Applied (13 players)
| Player | Stat | Old | New | Impact |
|--------|------|-----|-----|--------|
| **LeBron** | PER/BPM/VORP | 26.8/7.2/4.8 | 20.8/3.5/2.8 | MASSIVE downgrade — age decline in advanced stats |
| **Jokic** | BPM/VORP | 12.8/7.5 | 14.2/9.2 | Upgrade — even more dominant than modeled |
| **SGA** | BPM/WS48/VORP | 10.2/.285/6.5 | 11.7/.323/7.8 | Upgrade — MVP-caliber efficiency |
| **Wemby** | USG/BPM | 28.8/9.2 | 32.4/10.7 | Higher usage + impact than modeled |
| **Brunson** | PER/BPM/VORP | 25.2/6.5/4.7 | 20.1/3.1/3.3 | Significant downgrade |
| **Edwards** | PER/BPM/VORP | 24.5/6.2/4.7 | 21.8/4.5/3.5 | Moderate downgrade |
| **Mitchell** | PER/BPM/VORP | 25.2/6.2/4.7 | 22.9/5.1/4.2 | Moderate downgrade |
| **Harden** | TS/VORP | 59.5/3.6 | 63.9/1.3 | Higher TS but much lower VORP (CLE-only portion) |
| **D. Brooks** | BPM/VORP | 1.2/1.7 | -2.3/-0.1 | Net-negative player by advanced stats |
| **Jalen Green** | TS/BPM/VORP | 55.2/0.1/1.5 | 51.6/-1.1/0.2 | Below-replacement player |
| **Smart** | BPM/VORP | 1.8/1.5 | -2.2/-0.1 | Defensive value not captured by BPM |
| **Gordon** | onOff | 3.4 | 12.8 | FantasyLabs: massively underrated glue guy |
| **Cam Johnson** | onOff | 2.5 | 10.1 | FantasyLabs: thriving in DEN system |

### WPA Data from Inpredictable (All 4 Game 1s)
| Game | MVP | LVP | Dominant Factor |
|------|-----|-----|-----------------|
| HOU-LAL | Kennard +15.2% | Sheppard -14.6% | FG shooting (LAL 60.6% vs HOU 37.6%) |
| DEN-MIN | Gobert +15.0% | Edwards -8.2% | Free Throws +23.1% (Murray 16/16 FT) |
| NYK-ATL | OG Anunoby +20.8% | Daniels -13.0% | FG +30.9% — NYK dominated all factors |
| CLE-TOR | Strus +16.6% | Barnes -7.6% | Rebounds +14.7% (paint dominance 48-30) |

### Key WPA Insights
- WPA MVPs often differ from box-score leaders (OG > Brunson/Towns, Strus > Mitchell/Harden, Gobert > Murray)
- The model overvalues scoring and undervalues two-way impact + efficiency contributions
- Four Factors analysis reveals STRUCTURAL advantages (scheme-driven FG%, paint dominance) vs random variance

### Changes Made to index.html
- 13 player stat corrections (BBRef ground truth)
- 4 WPA-based model lessons added (one per series)
- 4 game notes updated with WPA MVP/LVP and Four Factors data
- 5 matchup notes updated to reflect BBRef corrections (LeBron, Gordon, Cam Johnson, Brooks, Green)

---

## LEBRON Integration & Fatigue Monitor (April 19, 2026 — Session 4, Part 2)

### LEBRON Data Integration
- Loaded LEBRON data from BBall Index CSV (~435 players) via Python batch script
- All 141 playoff players now have: `lebron`, `oLebron`, `dLebron`, `war`, `offRole`, `defRole` fields
- 2 new players added: Jordan Goodwin (PHX), Craig Porter Jr. (CLE)
- 8 player ratings re-assessed based on LEBRON insights

### Model Formula Changes

**calcTeamRating() — 3 new components:**
1. **WAR Aggregation Bonus** — `(totalWar - 35) / 12` for teams with 3+ players having WAR data. Elite WAR teams get ~1.25 bonus.
2. **D-LEBRON Team Aggregate** — Teams with avg D-LEBRON > 0.3 get defensive identity bonus; below -0.5 get penalized.
3. **Role Diversity Bonus** — Teams with 5+ unique offensive/defensive role types get +0.3 (harder to scout in playoffs).

**calcWinProb() — 1 new component:**
4. **D-LEBRON Matchup Differential** — Weighted average of top defenders' D-LEBRON per team, scaled by 1.5, capped at +/-2 points. Captures which team has the superior defensive personnel matchup.

### Fatigue Monitor (LOW CONFIDENCE)
- New functions: `calcPlayerFatigue()` and `calcTeamFatigue()`
- 5 fatigue factors: Age (33+), Minutes Load (36+ MPG), Injury History, Mental Fatigue (cumulative per game), Role-Based Load
- All values multiplied by 0.5 "low confidence discount"
- Integrated into calcTeamRating() as a penalty when team fatigue index > 0.05
- Research basis: Pageaux et al. (mental fatigue → FT/decision impairment), Huyghe et al. (B2B performance drop), Oudejans et al. (physical fatigue → 3PT accuracy)

### Definitions Page Updates
- Added 4 new player-level metric definitions: LEBRON, O-LEBRON, D-LEBRON, WAR
- Added new "Fatigue Monitor" section with 5 definition cards (Fatigue Index, Age Factor, Mental Fatigue, Minutes Load, Low Confidence Discount)

### File Size
- `index.html` now ~3,900+ lines

---

## UI Overhaul — Horizontal Layout & Tabbed Navigation (April 19, 2026 — Session 4, Part 3)

### Navigation Restructure
- **Round tabs**: Western Conference / Eastern Conference as top-level navigation
- **Series sub-tabs**: Within each round, 4 series shown as sub-tabs (#1v#8, #2v#7, etc.)
- **Game sub-tabs**: Within each series: Overview | G1 | G2 | G3-G7 | Player Stats | Fatigue
- Replaces old flat 8-tab system with hierarchical Round → Series → Game navigation

### Horizontal Layout Changes
- Series header now compact with inline win probability and series score
- Scenario Builder and Backtest Panel displayed side-by-side (2-column grid)
- SPM Chemistry and On/Off Impact displayed side-by-side
- Roster tables displayed side-by-side (home vs away)
- Synergy sections displayed side-by-side
- Responsive: collapses to single column under 1100px

### New Visual Stat Representations
- `renderStatBar()` — horizontal colored bars for any metric with min/max/color
- `renderPlayerViz()` — per-player visual cards showing LEBRON, O-LEBRON, D-LEBRON, WAR, VORP, EPM as gradient bars
- Available via the "Player Stats" game sub-tab for each series

### Fatigue & Injury Monitor UI
- `renderFatigueMonitor()` — dedicated visual panel showing per-player fatigue bars
- Per-player fatigue percentage with colored bar (green → yellow → red)
- Fatigue tags: AGE (purple), INJ risk (red), Role load (green), USG% (blue)
- Team fatigue index as percentage badge
- Shown in dedicated "Fatigue" tab and also embedded in each individual game tab
- Amber/gold color theme to visually flag as low confidence

### Age Data Added
- LeBron James (41), Kevin Durant (37), Clint Capela (32), Nikola Jokic (31), Rudy Gobert (33), Andre Drummond (32)
- Enables fatigue monitor's age factor to properly flag veteran players

### File Size
- `index.html` now ~4,140 lines

---

## Ghost Calculation Audit & Fix (April 19, 2026 — Session 4, Part 4)

### 7 Ghost Calculations Found & Fixed:

1. **Health Degradation hit scenario-toggled players** — used `p.rating > 0` instead of `getEffectiveRating()`. Fixed: now respects scenario toggles.
2. **Fatigue + Health Degradation both penalized injuryRisk** — removed injuryRisk factor from fatigue calc (Health Degradation already handles it).
3. **VORP + WAR correlated double-counting** — WAR divisor changed from /12 to /20 to reduce overlap with VORP.
4. **D-LEBRON triple-counted** (team rating + win prob + DRtg via netRtg) — removed D-LEBRON differential from calcWinProb() since it's already in both team ratings.
5. **D-LEBRON in calcWinProb ignored scenario toggles** — moot now (removed per fix #4).
6. **Star ceiling in calcWinProb ignored scenario toggles** — fixed to use `getEffectiveRating()`.
7. **calcTeamFatigue ignored scenario toggles** — threaded `seriesId` parameter through and uses `getEffectiveRating()`.

### UI Fix:
8. **Methodology section restored** — collapsible `<details>` section added back to Overview tab.

### Remaining non-breaking notes:
- ~120 lines of orphaned CSS from old layout (cosmetic dead code, no rendering impact)
- Coaching text mentions a few players not in roster arrays (Wallace, Spencer Jones, Duncan Robinson, Clarkson, Alvarado) — text-only, no runtime impact

### File Size
- `index.html` now ~4,148 lines

---

## Active Injury System (April 19, 2026 — Session 4, Part 5)

### Problem
Players with active injuries (GTD, knee management, returning from injury) had missing or too-low `injuryRisk` values. The fatigue monitor had no concept of "playing through an injury" — e.g. Edwards had injuryRisk:0 despite missing 11 of final 14 games with knee issues.

### Solution: activeInjury Field
New per-player object `activeInjury: {type, severity, note}` added to 7 players:
- **Anthony Edwards** (MIN): knee management, severity 0.6
- **Jamal Murray** (DEN): chronic knee, severity 0.7
- **Jalen Williams** (OKC): wrist + hamstring, severity 0.6
- **Cade Cunningham** (DET): collapsed lung recovery, severity 0.5
- **Jayson Tatum** (BOS): returning from injury, severity 0.4
- **Jarrett Allen** (CLE): knee tendonitis, severity 0.4
- **Victor Wembanyama** (SAS): rib contusion, severity 0.3

### Integration into calcPlayerFatigue()
- New factor 3b: `severity × 0.15 × (1 + gamesPlayed × 0.2) × (1 + depth × 0.25)`
- Compounds with games played and round depth (separate from Health Degradation Curve which uses injuryRisk)
- Subject to same 0.5 low-confidence discount as all fatigue factors

### Fatigue Monitor UI Update
- Players with activeInjury show bandage icon + injury type + severity in fatigue tags
- Hover tooltip shows the detailed note
- activeInjury tag takes precedence over generic INJ tag (no double-display)

### Definitions Page
- Added "Active Injury" definition card in Fatigue Monitor section

### injuryRisk Corrections
- Edwards: 0 → 0.6
- Tatum: 0 → 0.5
- Cunningham: 0.3 → 0.5
- Allen: added 0.4

---

## Lillard OUT / Jrue Holiday Addition (April 19, 2026 — Session 4, Part 6)

### Critical Roster Correction: Damian Lillard OUT for Season
- Lillard tore left Achilles in 2025 playoffs (Game 4 vs IND while on MIL)
- Traded back to POR in offseason but has been rehabbing entire 2025-26 season
- Confirmed OUT for playoffs by interim HC Tiago Splitter
- Targeting return for 2026-27 season
- Won 3-Point Contest at All-Star Weekend despite not playing

### Jrue Holiday Added to POR Roster
- Acquired from BOS for Anfernee Simons (July 2025)
- 16.3 PPG / 4.6 RPG / 6.1 APG, 45.3 FG%, 38.5 3PT%, 58.2 TS%
- 53 games, 51 starts. Rating: 74. Age: 35
- Championship DNA (MIL 2021), Maurice Lucas Award winner
- Elite two-way guard — perimeter defense is his calling card

### Other POR Roster Updates
- **Scoot Henderson**: Stats updated to 14.2/2.7/3.7 (breakout 3rd year), rating 62→64
- **Shaedon Sharpe**: Stats updated to 21.4/4.4/2.6. Added activeInjury (fibula stress reaction, severity 0.4) — returned April 10 after 28-game absence
- Sharpe's starting lineup: Holiday/Sharpe/Avdija/Grant/Clingan (was Lillard/Sharpe/Avdija/Grant/Clingan)

### Cascading Changes
- Updated all synergy lineups, coaching analysis, rotation plans, role changes
- Rewrote SAS-POR game1 prediction and pros/cons
- Replaced Lillard betting picks with Avdija props
- Updated series upset odds (POR win%: ~18% → ~12%, line +350 → +500)
- Updated pedigree "what-if" to Holiday instead of Lillard
- Removed all "Dame Time" narrative references from active predictions

### File Size
- `index.html` now ~4,182 lines

---

## USA Today Injury Report Update (April 19, 2026 — Session 4, Part 7)

### Source
USA Today Sports Data injury report (https://sportsdata.usatoday.com/basketball/nba/injuries), cross-referenced with NBA.com live blog.

### Injury Updates Applied
| Player | Team | Update | Model Change |
|--------|------|--------|-------------|
| Kevin Durant | HOU | Right knee contusion, expected Apr 21 | Updated injury text, added activeInjury (severity 0.5), confirmed OUT G1 |
| Grayson Allen | PHX | Left hamstring strain, GTD Apr 19 | Added injury, injuryRisk 0.4, activeInjury (severity 0.4) |
| Joel Embiid | PHI | Illness post-appendectomy, expected Apr 24 | Rating 55→0, updated injury text with return timeline |
| Jock Landale | ATL | Right ankle sprain, expected May 1 | Rating 55→0 |
| Payton Pritchard | BOS | Left foot plantar fasciitis, returned Apr 19 | Added injuryRisk 0.2, activeInjury (severity 0.2) |
| Paul George | PHI | Post-suspension form: 21.0 PPG in 10 games | Rating 68→72, updated matchupNote |
| Immanuel Quickley | TOR | Hamstring tightness, OUT G1 | Already correct (rating:0) |
| Peyton Watson | DEN | Hamstring tightness, expected Apr 20 | Already correct (rating:0) |

### Ghost Audit Results
- **CLEAN**: No ghost calculations detected
- injuryRisk and activeInjury.severity confirmed as conceptually distinct (team rating vs fatigue)
- All 8 OUT players (rating:0) properly excluded from all penalty systems
- New activeInjury penalties (Allen, Pritchard, KD) are proportionate to player importance

### Stats
- 11 activeInjury objects total across all rosters
- 8 players with rating:0 (OUT)
- JS syntax: CLEAN

---

## Partnow Offensive Style Research Integration (April 19, 2026 — Session 4, Part 8)

### Source
Seth Partnow, "NBA Offensive Styles" Parts 1 & 2 (The Athletic, April 2020). Synergy play type data 2004-2020.

### Key Findings Applied
1. **On-ball/off-ball ratio** is remarkably stable (~48/52) across 16 seasons — the MIX of on-ball actions changed (P&R replacing ISO/PostUp), not the ratio
2. **Initiator importance** — elite on-ball creators bend defenses to open off-ball opportunities. Losing your primary initiator collapses the ENTIRE offense, not just that player's slot
3. **Offensive style diversity** — Euclidean distance analysis shows stylistically distinctive teams (outliers) are harder to scout. Median similarity is roughly constant but outlier teams are increasing
4. **Turnover attribution** — on-ball turnovers partly reflect value being created for teammates, not just inefficiency

### Model Changes

**New per-team fields (all 16 teams):**
- `offStyle` — qualitative descriptor of primary/secondary offensive actions
- `initiators` — count of distinct on-ball creators (Shot Creator / Primary Ball Handler)

**calcTeamRating() — new initiator redundancy section:**
- Teams with 3+ active initiators: +0.5 bonus (CLE, OKC, BOS)
- Teams with ≤1 active initiator when 2+ expected: -0.8 penalty (Partnow initiator-loss cascade)
- NOT a ghost of replacement-level slots — slots capture production loss, this captures systemic coherence loss

**Initiator counts by team:**
| Team | Initiators | Key Creators | Notes |
|------|-----------|-------------|-------|
| CLE | 3 | Mitchell, Garland, Harden | Most resilient — triple-threat creation |
| OKC | 3 | SGA, Williams, Wallace | Elite depth of creation |
| BOS | 3 | Brown, Tatum, White | Five-out motion creates best off-ball environment |
| DEN | 2 | Jokic, Murray | Stylistic outlier — post-up/handoff initiation |
| SAS | 2 | Wembanyama, Fox | Another outlier — unicorn creation profile |
| NYK | 2 | Brunson, KAT | Brunson elite P&R + cutting motion |
| MIN | 2 | Edwards, Randle | Conventional P&R + ISO style |
| HOU | 2 | KD, Sengun | KD OUT G1 → drops to 1 effective initiator |
| POR | 2 | Holiday, Avdija | Post-Lillard balanced motion |
| TOR | 2 | Barnes, Ingram | Dual creation + transition |
| ATL | 2 | McCollum, NAW | Post-Trae dual-initiator system |
| ORL | 2 | Multiple secondary | No elite initiator but decent balance |
| LAL | 1 | LeBron | Doncic/Reaves OUT — zero backup creation |
| PHI | 1 | Maxey | Embiid OUT — post-up anchor gone, P&R only |
| DET | 1 | Cunningham | Heavily Cade-dependent for half-court creation |
| PHX | 1 | Booker | Booker-dependent — offense stalls when doubled |

### Definitions Page
- Added new definition card for "Offensive Style Profile (offStyle / initiators)"

### Model Learnings
- Added Phase 10 entry documenting the Partnow research framework

### File Size
- `index.html` now ~4,220 lines

---

## 2024 NBA Playoff Full Backtest (April 19, 2026 — Session 4, Part 9)

### Overview
- Applied model retroactively to all **82 games** of the 2024 NBA Playoffs
- Built 2023-24 team profiles for all 16 playoff teams with seeds, records, advStats, player ratings, VORP, WAR, LEBRON, systemBonus, playoffPedigree, and initiator counts
- Model engine replicated in Python with all components: replacement-level slots, VORP/WAR aggregation, D-LEBRON aggregate, initiator redundancy, non-linear interactions, advStats, systemBonus, playoffPedigree, health degradation, star ceiling, stat differentials, series pressure, Game 7 override

### Results
| Round | Correct | Total | Accuracy |
|-------|---------|-------|----------|
| R1 | 27 | 43 | 62.8% |
| R2 | 16 | 25 | 64.0% |
| CF | 5 | 9 | 55.6% |
| Finals | 4 | 5 | 80.0% |
| **Overall** | **52** | **82** | **63.4%** |

Series winner predictions: **11/15 correct (73.3%)**

### Key Series Results
| Series | Model Pick | Actual | Game Accuracy | Notes |
|--------|-----------|--------|---------------|-------|
| OKC-NOP | OKC | OKC 4-0 | 4/4 | Perfect |
| DEN-LAL | DEN | DEN 4-1 | 4/5 | Missed only LAL's G4 win |
| MIN-PHX | MIN | MIN 4-0 | 4/4 | Perfect |
| DAL-LAC | DAL | DAL 4-2 | 3/6 | Competitive coin-flip series |
| BOS-MIA | BOS | BOS 4-1 | 4/5 | Missed MIA's "Playoff Jimmy" G2 |
| CLE-ORL | CLE | CLE 4-3 | 4/7 | Missed ORL's home dominance |
| MIL-IND | MIL ✗ | IND 4-2 | 2/6 | System > talent blindspot |
| NYK-PHI | PHI ✗ | NYK 4-2 | 2/6 | Brunson playoff ascension |
| OKC-DAL | OKC ✗ | DAL 4-2 | 3/6 | Luka-Kyrie synergy |
| MIN-DEN | MIN | MIN 4-3 | 5/7 | Best R2 series prediction |
| BOS-CLE | BOS | BOS 4-1 | 4/5 | Strong |
| NYK-IND | IND | IND 4-3 | 4/7 | Model overvalued rating gap |
| MIN-DAL | MIN ✗ | DAL 4-1 | 1/5 | Worst series miss |
| BOS-IND | BOS | BOS 4-0 | 4/4 | Perfect |
| BOS-DAL | BOS | BOS 4-1 | 4/5 | Finals nailed |

### Four New Model Concepts Identified
1. **Playoff Ascension Modifier**: Brunson +4.6 PPG, Butler +5 PPG, Luka +3.2 PPG in playoffs. Per-player "playoff gear" field for sustained elevation.
2. **Star-Pair Synergy Bonus**: Luka+Kyrie multiplicative offensive effect. +1.5-2.0 bonus when 2+ players rated 85+ share creator roles.
3. **Playoff Replacement-Level Adjustment**: 42 may be too low for playoff contexts. Consider 48-52 where coaching optimization elevates 8-10th men.
4. **Matchup-Specific System Bonus**: IND's pace-and-space vs MIL's half-court scheme. systemBonus should vary by opponent.

### Model Learnings Tab Updates
- Added 11 new entries (Phase 11) covering overall results, per-round analysis, key lessons, and future concepts
- Entries: Overview, R1 Analysis, Playoff Brunson Phenomenon, R2 Analysis, Replacement Level Lesson, CF Analysis, Star-Pair Synergy, Finals Analysis, Cross-Playoff Comparison, Four New Concepts

### Cross-Playoff Combined Accuracy
- **2025 Backtest**: 36/49 (73.5%)
- **2024 Backtest**: 52/82 (63.4%)
- **Combined**: 88/131 (67.2%)
- **Series winners combined**: ~75% accuracy

### File Size
- `index.html` now ~4,430 lines

---

## 2024 Backtest Lessons Implemented + Ghost/Bug Audit (April 19, 2026 — Session 4, Part 10)

### Four Model Enhancements Implemented
1. **Playoff Ascension Modifier** (`playoffAscension` per player, 0.6× scaling in calcTeamRating)
   - Applied to 10 players: Brunson (1.5), LeBron (1.0), J. Brown (1.0), Mitchell (1.0), Edwards (0.8), Tatum (0.8), Booker (0.8), SGA (0.5), Jokic (0.5), Harden (-0.5)
2. **Star-Pair Synergy Bonus** (+1.0 when 2+ players rated 85+ share Shot Creator/Primary Ball Handler roles)
   - Currently triggers for BOS (Tatum 85 + Brown 88)
3. **Playoff Replacement Level** (REPLACEMENT_LEVEL raised from 42 to 48)
4. **Pace Matchup Differential** (±1.0 in calcWinProb when pace gap ≥2 and faster team has 8+ active players)

### Ghost Calculations Fixed (2 found)
1. **On/Off team aggregate REMOVED** — On/Off data was baked into player composite ratings (10% weight) AND re-aggregated at team level via `avgOnOff / 4`. Double-counted for every team.
2. **Pace+Depth absolute bonus REMOVED from calcTeamRating** — Fast pace was rewarded in calcTeamRating (+0.3) AND in calcWinProb via paceMatchup (±1.0). Kept only the relative matchup version.

### Bugs Fixed (5 found)
1. **CRITICAL: Synergy name mismatch** — synergy arrays used nicknames ("SGA", "LeBron", "NAW", "PG") but `p.name` had full names. ALL synergy bonuses were silently zeroed, giving every team a -4.0 penalty. Fixed with NICK_MAP lookup + fuzzy matching.
2. **WARNING: Stale "Garland" in bets page** — Garland was traded; reference changed to "Harden"
3. **WARNING: Definitions showed REPLACEMENT_LEVEL=42** — Updated to 48
4. **WARNING: Model Learnings said concepts "not yet implemented"** — Updated to reflect live implementation
5. **WARNING: Phase 1 Learnings showed REPLACEMENT_LEVEL=42** — Updated to 48

### Definitions Page Updates
- Added 4 new definition cards: Playoff Ascension, Star-Pair Synergy, Pace Matchup Differential, Playoff Replacement Level

### INFO Items (not fixed — cosmetic only)
- ~32 dead CSS rules from old layout (g1-*, g2-*, .tab, .game-history, lowercase lesson-labels)
- 5 players with null LEBRON/WAR data contributing 0 to aggregates

### File Size
- `index.html` now ~4,513 lines

---

*Last updated: April 19, 2026 (2024 Backtest Implementation + Ghost/Bug Audit)*
