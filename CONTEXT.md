# NBA Playoff Analyzer 2026 — Project Context

> This document captures the full history of building this app across multiple Claude sessions so that future sessions can pick up where we left off.

---

## Overview

A single-file interactive HTML/CSS/JS app that analyzes all 8 first-round matchups of the 2026 NBA Playoffs. It features a custom statistical model calibrated against 2025 NBA Playoff results (73.5% accuracy across 49 games), interactive scenario builders, and a comprehensive betting analysis page.

**File:** `index.html` (~3,619 lines)

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

## Core Model Concepts

### Rating System
- **Player ratings**: 0–97 scale (Jokic 97, SGA 96, Wemby 94, etc.)
- **baseRating** vs **rating**: `baseRating` is healthy; `rating` reflects current availability (e.g., Embiid baseRating 92 → rating 55 due to appendectomy)
- **Team rating**: `calcTeamRating()` aggregates player ratings, systemBonus, playoffPedigree, and health degradation

### Key Modifiers
| Modifier | Range | Formula/Effect |
|----------|-------|----------------|
| **Round-Adjusted HCA** | R1:3.0, R2:2.0, CF:1.5, Finals:1.0 | Added to home team's base in `calcWinProb()` |
| **System Coherence (systemBonus)** | -2 to +3 | Per-team; reflects coaching system quality |
| **Championship DNA (playoffPedigree)** | 0–2 | `pedigree * 0.8` added to team rating |
| **Star Ceiling Variance (starCeiling)** | 0–2 per player | `starCeiling * 0.3` added to win probability |
| **Health Degradation (injuryRisk)** | 0–1.0 per player | `injuryRisk * roundDepth * 0.4` penalty |
| **Game 7 Override** | +5.0 HCA | When series tied 3-3 |

### SPM Chemistry Engine
- `calcSPMChemistry()` scores lineup chemistry based on role balance, defensive anchors, shooting balance, transition potential
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

*Last updated: April 19, 2026*
