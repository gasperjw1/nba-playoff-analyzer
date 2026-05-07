# NBA Playoff Analyzer 2026 — Project Context

> This document captures the full project state so that future sessions can pick up where we left off. Last updated: May 7, 2026 (through Phase 58 — engine HCA flip fix for G3/G4/G6, NYK-PHI G2 + SAS-MIN G2 results recorded, two duplicate-key bugs fixed with TEST 7 added as regression guard, Tier 1 tech-debt refactor specced).

---

## Overview

A multi-file interactive HTML/CSS/JS web app analyzing the 2026 NBA Playoffs. 58-phase prediction model calibrated against 2025 results, with a Monte Carlo chaos simulation, interactive scenario builders, projection lineage waterfall charts, the Compound Historical Scenarios engine (Phase 52), and a declarative bet card schema (Phase 55) that flows all 36 R2 cards through one renderer. Bets are dynamically interpolated from `calcBlendedProjection()` at render time (Phase 48). Independent 2025 validation dataset committed for repeatable backtests; integration suite covers CHS (TEST 6) and duplicate-key regressions (TEST 7) for a total of 3468 assertions, 0 failures.

Phase milestones: Phase 49 recalibrated win probabilities (WIN_PROB_SCALE=35), Phase 50 added per-player dynamic rating adjustments inside `calcTeamRating`, Phase 51 introduced multiplicative context architecture (fatigue ±12%, scheme ±20%), Phase 52 added the CHS engine, Phase 53–54 fixed CHS surfacing bugs and added the CHS panel to series pages, Phase 55 migrated bets to declarative records, Phase 56 applied the May 6 injury report, Phase 57 added the Home landing page, **Phase 58 fixed the engine HCA flip for G3/G4/G6 venue changes** (the team-rating side wasn't game-aware while the player-level HCA was — a 3-4pt drift on every G3+ projection).

**R1 model accuracy (final):** 28/48 ML (58.3%, 9.6pt avg margin error). Series-stage curve: G1–G3 50% → G4–G7 67% — accuracy improves as in-series data accumulates. **R2 status (May 7):** NYK-PHI 2-0 (NYK 137-98, NYK 108-102), SAS-MIN 1-1 (MIN 104-102 then SAS 133-95 — largest playoff loss in MIN franchise history). Tonight: DET-CLE G2 + OKC-LAL G2 (both at series home). Friday: NYK-PHI G3 + SAS-MIN G3 (Phase 58 venue flip applies — engine now correctly reduces HCA for the away-team venue).

---

## Architecture

### Multi-File Structure (split from monolith at Phase 22)

```
nba-playoff-analyzer/
├── index.html                       # App shell — script tags in dependency order; loads bets-data.js + news.js + bet-card.js + home.js
├── css/styles.css                   # All styling; .home-* classes for Phase 57 landing layout
├── js/
│   ├── app.js                       # Boot sequence; renders Home page on load (Phase 57)
│   ├── state.js                     # UI state, scenario builder, localStorage V3
│   ├── utils.js                     # Formatters, rating tiers, stat helpers
│   ├── data/
│   │   ├── constants.js             # HCA, G7 overrides, SPM, ROUND_META, PLAYOFF_ADJUSTMENT, SIM_CONFIG, CURRENT_DATE (Phase 57)
│   │   ├── series-data.js           # All series — rosters, stats, predictions, box scores, priorRound graduation, CHS scenarios
│   │   ├── bets-data.js             # Phase 55 — declarative BETS array (36+ R2 cards) + BET_SLATES + FEATURED_PARLAYS (Phase 57)
│   │   ├── news.js                  # Phase 57 — curated NEWS feed (date/severity/series/headline/body/source)
│   │   ├── boxscores.js             # Per-player box score data
│   │   └── historical.js            # Historical without-star data
│   ├── engine/
│   │   ├── ratings.js               # Team rating with per-player dynamic adjustments (Phase 50)
│   │   ├── projections.js           # 18-step projection + lineage + attribution + last-name fallback matcher (Phase 54)
│   │   ├── chemistry.js             # SPM Chemistry (8 dimensions)
│   │   ├── fatigue.js               # Per-player fatigue with injury-return handling
│   │   ├── matchups.js              # Defensive suppression, bounce-back
│   │   ├── scenarios.js             # Compound Historical Scenarios (Phase 52); buildGameContext infers injury from player.injury+injuryRisk (Phase 53)
│   │   ├── simulation.js            # Monte Carlo (10K iterations, capitulation, cascading collapse)
│   │   └── graduation.js            # Series graduation for round transitions
│   └── ui/
│       ├── components.js            # Scenario builder, stat bars, waterfall, attribution, renderCHSScenarios (Phase 54)
│       ├── series-renderer.js       # Now embeds CHS panel per game (Phase 54)
│       ├── bet-card.js              # Phase 55 — renderBetCard() + renderBetSlateSeries(); supports win/loss/push/void (Phase 56)
│       ├── home.js                  # Phase 57 — renderHomePage() + SLATE_GAME_DATES + Floor/Traditional toggle + adaptive layout
│       ├── modals.js
│       ├── navigation.js            # Tab switching — Home is the default page (Phase 57)
│       ├── learnings.js             # Collapsible phase timeline (currently through Phase 57)
│       ├── definitions.js           # Metric definitions with category tabs
│       └── bets.js                  # Bets orchestrator; dml/dmargin/dwinner helpers (Phase 48); slate sections call renderBetSlateSeries
├── playoffs_2025_validation.js      # 2025 playoffs game-by-game results — independent validation dataset
├── test-projections.js              # Integration suite — 3466 assertions including TEST 6 CHS coverage
├── BACKTEST_R1.md                   # R1 backtest report (28/48 ML, 58%; G1-3 50% → G4-7 67%)
├── CONTEXT.md                       # This file
└── README.md
```

### Script Load Order (dependency chain)
Data layer → utils/state → engine → UI → boot. All globals, no ES modules.

### Pages (5 tabs via `switchPage()` — Home is now the default)
1. **Home** (Phase 57) — landing page; sections: Tonight (auto-fit game cards), Featured Parlays (Reliable Floor / Traditional toggle), Latest News (curated feed), Tonight's Bets (per-series columns when ≥2 games, side-by-side with News when 1 game), Tomorrow.
2. **Series Analysis** — Tabbed series with rosters, synergy, coaching, game predictions, waterfall charts, and a per-game CHS panel showing matched scenarios + cascade effects (Phase 54)
3. **Model Learnings** — Collapsible phase timeline (currently through Phase 57)
4. **Definitions** — All metric definitions with category tabs
5. **Bets** — Per-series slate sections rendered through one declarative pipeline (Phase 55) with dynamic ML/margin/winner from `calcBlendedProjection()`

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

## Series Status (as of May 7, 2026 morning)

### Round 1 (Complete — 28/48 ML, 58%)
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

### Round 2 (mid-slate — G2 partly played)
| Series | Score | Recent Game | Next |
|--------|-------|-------------|------|
| (3) NYK vs (7) PHI | NYK 2-0 | G2: NYK 108-102 (Embiid OUT, Brunson 26, KAT 20/10/7, OG 24 left late). 25 lead changes — most in any playoff game in 11 yrs. PHI 38% 3PT vs NYK 27% but lost on TOV (+5 NYK) and Q4 collapse (3-16 / 18.8%). | G3 Fri May 8 in PHI (Phase 58 venue flip applies — engine: NYK by 6) |
| (2) SAS vs (6) MIN | 1-1 | G2: **SAS 133-95** — largest playoff loss in MIN franchise history. Wemby 19/15 bounce-back (attacked rim instead of settling). SAS 50% FG / 41% 3PT (vs G1 41/28). MIN's 4-way 12pt tie (Edwards/Randle/McDaniels/Shannon) signaled no-one-stepped-up. Finch: "we got punked." | G3 Fri May 8 in MIN (engine: SAS by 9) |
| (1) DET vs (4) CLE | 1-0 DET | G1: DET 111-101 (Cade 23/7ast, Duren clutch block) | **G2 TONIGHT** Thu May 7 in DET (engine: DET by 2 — coin flip) |
| (1) OKC vs (4) LAL | 1-0 OKC | G1: OKC 108-90 *without* J.Williams (hamstring). Holmgren 24/12/3blk. SGA 18pts on 7 TOs but won by 18. Reaves catastrophic 3-16 FG (oblique). | **G2 TONIGHT** Thu May 7 in OKC (engine: OKC by 22 — blowout risk) |

### Key Injury Notes (May 7)
- **Embiid (PHI)**: GTD G3 — day-to-day per ESPN/Heavy/Inquirer. Two days rest after G2 sit-out (right ankle sprain + hip soreness). No guarantee for Friday.
- **OG Anunoby (NYK)**: GTD G3 — left G2 late with unspecified issue, didn't return. Status uncertain.
- **J.Williams (OKC)**: still GTD/week-to-week (Grade 1 hamstring). Targeting May 8 return per CBS but no confirmation. OKC won G1 without him by 18.
- **Doncic (LAL)**: still OUT — Grade 2 hamstring, no return timeline.
- **Edwards (MIN)**: knee + rust limited — G2 came off bench again (24min, 4-13 FG). Likely starts G3 with longer leash if knee permits.
- **Reaves (LAL)**: still LIMITED — oblique. Catastrophic G1 (3-16 FG, 0-5 3PT). Model has him at severity 0.7 / ~50-55% capacity.
- **Allen (CLE)**: ACTIVE for G2 — knee tendonitis cleared. Returns to full minutes.
- **DiVincenzo (MIN)**: OUT for season (Achilles, Phase 39 confirmation).
- **Dosunmu (MIN)**: returned G2 from calf.
- **Huerter (DET)**, **Merrill (CLE)**: GTD — thigh / hamstring respectively.

---

## Bets Page Structure (Phase 55 declarative pipeline)

### Data layer — `js/data/bets-data.js`
- `BETS` — flat array of typed bet records
- `BET_SLATES` — per-series slate metadata (header, G1 recap text)

### Bet Record Schema
```js
{
  betId: 'r2g2-nyk-phi-nyk-ml',
  type: 'ML' | 'SPR' | 'PROP' | 'TOT',
  pick: 'NYK ML',
  odds: '-450',
  facts: '...',                    // research backing
  chs: { ... } | null,             // structured CHS lineage
  confidence: 'lean' | 'coin-flip' | 'medium' | 'high' | 'best-bet',
  thesis: ['model', 'matchup', 'regression', 'historical', 'situational', 'market'],
  narrative: '...',                // bounce-back / desperation / rest-edge framing
  result: null | { outcome: 'win' | 'loss' | 'push' | 'void', actual: '...' }
}
```

### Renderer — `js/ui/bet-card.js`
- `renderBetCard(bet, dynamics)` — outputs CHS pill, type+confidence badge, multi-thesis pills, narrative tag, dynamic model-value injection via `{{winner}}`/`{{margin}}` template interpolation
- `renderBetSlateSeries(slate, series, dynamics)` — wraps a series' card array with the slate header + recap

### Dynamic helpers (Phase 48)
- `dml(home, away)` — live ML pick from `calcBlendedProjection()`
- `dmargin(home, away)` — live projected margin
- `dwinner(home, away)` — named winning team

Bet cards always reflect current model state; edits to series-data at 6:55pm show in 7pm display.

### Coverage as of Phase 56
- 16 archived R2-G1 bets (with `result.outcome` populated)
- 20 live R2-G2 bets (`result: null`, resolve when games complete)
- bets.js: 3578 → 3252 lines after migration

### Result Outcomes
- `win` ✓ green
- `loss` ✗ red
- `push` ≡ gray
- `void` ⊘ yellow (Phase 56 — Embiid Over 22.5 voided when ruled out morning-of)

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
| `renderCHSScenarios(series, gameIdx)` | ui/components.js | CHS lineage panel (per-player matched scenarios + cascade effects) — Phase 54 |
| `renderBetCard(bet, dynamics)` | ui/bet-card.js | Phase 55 — single declarative bet card renderer |
| `renderBetSlateSeries(slate, series, dynamics)` | ui/bet-card.js | Phase 55 — full slate (header + recap + cards) for a series |
| `renderBetsPage(el)` | ui/bets.js | Bets orchestrator; exposes dml/dmargin/dwinner closures (Phase 48) |
| `buildGameContext(player, series, gameIdx)` | engine/scenarios.js | Phase 52/53 — assembles runtime context for CHS condition evaluation |
| `getTeamScenarioSummary(series, gameIdx, teamSide)` | engine/scenarios.js | Returns `{matchedScenarios, cascadeEffects}` for CHS panel |
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
| 48 | Dynamic blended bets + R1 backtest. All R2 ML/spread/margin picks interpolate from `calcBlendedProjection()` at render time via `dml`/`dmargin`/`dwinner` helpers. Wired previously-unused `PLAYOFF_ADJUSTMENT.drbWeightBoost` and `SIM_CONFIG.shootingSwingMax`. Removed dead `simulateSeriesOutcome()` (70 lines). R1 final: 28/48 ML (58%), 9.6pt margin error. **Insight: G1-G3 50% → G4-G7 67%** — model accuracy curves up as series-specific data accumulates. |
| 49 | Win probability recalibration — `WIN_PROB_SCALE` 15→35, `PLAYOFF_UPSET_COMPRESSION=0.18`. Cross-year validation: underdogs win 41.7% in 2025+2026 R1. Resilience modifier (0-1) compresses opponent WP toward 50% by up to 10%. |
| 50 | Dynamic per-player rating adjustments inside `calcTeamRating` — injury severity (`r × (1 - severity × 0.25)`), playoff ascension (`r + ascension × 2.5`), coaching scheme top-5 (`r + (adjRating-5) × 0.3`). Old team-level flat bonuses removed to prevent double-counting. |
| 51 | Multiplicative context architecture — fatigue ±12% of \|baseMargin\|, scheme persistence ±20%, inconsistency 15% compression (replacing fixed-point additions). Margin cap removed. |
| 52 | Compound Historical Scenario Engine — 12-condition narrowing system (role/team/coach/defender/venue/playoff/health/rest/deficit/post-blowout/minutes/coverage). Multiple matches compound at 70% decay. Cascade model propagates teammate adjustments when star delta >2pts. 15+ R2 scenarios (Reaves vs OKC, Brunson vs PHI drop, Wemby vs MIN road, SGA post-rust, Embiid post-appendectomy, Cade vs CLE blitz, Mitchell road, Edwards restricted). Wired as modifier #14 in `calcExpectedPlayerStats`. Safety cap ±35% of base. |
| 53 | CHS lineage fixes — `buildGameContext` infers injury from `player.injury` + `injuryRisk` when `activeInjury` object missing (so HEALTH conditions fire). Added `restDays` to all R2 `priorRound` objects. Moved `dchsExplainer()` inside `betContent-parlays`. `app.js` defaults `currentSeriesIdx` to first series in active round. |
| 54 | Empty box score bug + CHS on series page. Last-name + substring fallback in `calcProjectedBoxScore` so prior-game last-name entries match full-name rosters (R2 G2 box scores now populate: 8+7, 6+9, 9+8). Extracted `renderCHSScenarios()` and wired into series-analysis page (was bets-only). |
| 55 | Declarative bet card schema. New `js/data/bets-data.js` (typed `BETS` array + `BET_SLATES` metadata) + `js/ui/bet-card.js` (`renderBetCard` + `renderBetSlateSeries`). Schema fields: `type/pick/odds/facts/chs/confidence/thesis[]/narrative/result`. Multi-thesis after tally of 173 existing edge labels showed 6+ combined theses. CHS in own field, lean/coin-flip extracted to `confidence` enum. bets.js: 3578 → 3252 lines. Adding a new G3 slate is now ~10 lines of data + a 1-line render call. |
| 56 | May 6 injury report. Embiid OUT (right ankle + hip soreness) for tonight's NYK-PHI G2; PHI starts Maxey/Edgecombe/Oubre/George/Drummond. Series cascade: `g2PlayerOutlook` `ptsRange [0,0]` for Embiid, NYK 9 vs PHI 7 active. NYK ML re-priced -260 → -450, spread -6.5 → -10.5, Embiid prop voided, new Drummond rebs prop added. New `void` `result.outcome` with yellow ⊘ icon. DET-CLE: Allen back, DET BEST BET → MEDIUM. OKC-LAL: J.Williams was OUT G1 (factual fix). 3447/3447 tests pass. |
| 57 | **Home landing page.** New default tab. Sections: Tonight (auto-fit game cards from `SLATE_GAME_DATES` + `BET_SLATES` + live `calcBlendedProjection()`), Featured Parlays with Reliable Floor / Traditional toggle, Latest News (curated `NEWS` feed in `js/data/news.js`), Tonight's Bets (per-series columns when ≥2 games, side-by-side with News when 1 game), Tomorrow. New `CURRENT_DATE` constant in `constants.js` (hardcoded so the page stays pinned to the data slate, not wall clock). New `FEATURED_PARLAYS` array in `bets-data.js` with `category: 'floor' \| 'traditional'`. Toggle is client-side via `homeSetParlayMode()` — both panes pre-rendered, swap visibility. **Also restored Phase 55 files** (`js/data/bets-data.js`, `js/ui/bet-card.js`) that the gasperjw1 merge silently dropped. **SAS-MIN G2 date corrected** to May 6 (was stale May 7 in BET_SLATES). |
| 58 | **Engine HCA flip for G3/G4/G6 + analysis components for G3+ + prediction alignment.** Three things in one phase: (1) **Engine bug:** `calcWinProb` in `js/engine/ratings.js` only respected series-level `homeCourtOverride` and ignored per-game venue. Player-level HCA in `projections.js` already flipped correctly via `gameIsHome` — the team-rating side didn't. Result: engine over-projected the series.homeTeam by ~2× baseHCA on every G3/G4/G6 (NYK by 9 in PHI when correct is NYK by ~6). Fixed by adding `gameNum` parameter and venue-flip math: `hca = baseHCA × seriesHCASign × venueHCASign`. (2) **Renderer gap:** the dynamic-only panel branch in `series-renderer.js` (used for series without top-level `s.gameN`) was skipping `renderPlayerProjections`, `renderSimulationPanel`, `renderProjectionWaterfall`, and `renderGameAttribution`. The engine had data for all of them — they just weren't being called. Wired in. (3) **Prediction alignment:** with the engine fix in place, G3 hardcoded predictions now match engine output (NYK by 6, SAS by 9) instead of arguing for a different number. Headline display also driven from prediction values when present (with a muted "Engine: X by Y" pill when the two diverge). |
| Bug fixes (May 7) | **Two duplicate-key bugs found via TEST 7 (new) + manual sweep:** (a) Embiid had two `activeInjury` keys on his player record — Phase 56's `severity:1.0 (OUT)` was silently overwritten by an older `severity:0.4 (hip)` entry. Engine never saw him as truly OUT. (b) `r2-g2-nyk-phi-ml` and `r2-g2-nyk-phi-spread` had two `result:` keys each — the resolved `{outcome:'win', ...}` was silently overwritten by trailing `result: null`, leaving them showing as "live" on the Home page after G2 played. Both fixed by removing the duplicates. JS spec: when an object literal has duplicate keys, the LAST one wins — no warning, no error, silent corruption. **TEST 7** now scans both `series-data.js` (player records) and `bets-data.js` (top-level `result:` count per bet) and fails loudly on regression. |
| Misc | `playoffs_2025_validation.js` committed (was untracked — independent validation dataset from Basketball Reference). `test-projections.js` TEST 6 ports CHS dev script into formal suite (+19 assertions). TEST 7 added (+2 assertions for duplicate-key sweep). Suite total: 3447 → 3466 (CHS) → 3468 (duplicate-key). |

---

## Known Quirks

- `calcTeamFatigue` filters `getEffectiveRating(p, seriesId) > 0`, so injury-returned players need `rating > 0` (not 0) to appear in fatigue monitor
- HOU-LAL uses `homeCourtOverride: "away"` — HCA is inverted at calc time. Phase 58's game-level venue flip composes correctly with this: for HOU-LAL G3-G4 the seriesHCASign and venueHCASign cancel, putting HCA back at HOU. (Tier 3 candidate: replace this hack with derived seed comparison.)
- `switchBetTab()` uses dynamic `querySelectorAll('[id^="betContent-"]')` so new tabs auto-register
- Older Featured Parlays (pre-Apr 28) are wrapped in `<details>` for collapsibility
- R1 complete; R2 G2 is mid-slate (NYK-PHI 2-0, SAS-MIN 1-1, DET-CLE + OKC-LAL playing tonight)
- **Prior-box-score name format drift**: prior games stored last-name-only ("Wembanyama") while rosters use full names ("Victor Wembanyama"). `calcProjectedBoxScore` now does a last-name + substring fallback (Phase 54). If new series-data lands with a third format, the matcher may need widening again — would benefit from a schema-validation test.
- **CHS HEALTH conditions** require either `activeInjury` object OR `player.injury` string + `injuryRisk` to fire. `buildGameContext` infers from the latter when the former is missing.
- **Bet `result` field**: `null` for unresolved live bets; `{outcome, actual}` once a bet resolves. `outcome` is `win | loss | push | void`.
- **JS object-literal duplicate keys are silent.** When a bet/parlay/player record has two of the same key, the LAST one wins — no warning. We've now hit this twice (Embiid `activeInjury`, NYK-PHI bet `result`). TEST 7 in `test-projections.js` is the regression guard.
- **Hardcoded predictions can drift from engine.** If you author `prediction.homeWin/homeScore/awayScore/margin` by hand, validation should confirm they match engine output (or document why they diverge) — see Tier 1.1 schema validation. With Phase 58 in place, G3/G4/G6 engine output now respects venue, so divergences should be small and intentional.

---

## Active Tech Debt / Refactor Roadmap (specced May 7)

Tracked under "Tech debt items to clean up" todos. Three tiers prioritized by impact:

### Tier 1 — Silent failure prevention (~8 hours, single PR; the gate before scheduled daily updates can run safely)

1. **Schema validation at boot** (`js/validators.js` new). Validates every prediction object, BETS record, FEATURED_PARLAYS record on app load. Catches duplicate keys (covered by TEST 7), `homeWin`-vs-scores contradictions, missing required fields, type mismatches, invalid enums (`outcome`, `category`, `confidence`), bad series refs. Renders a red banner at top of page when failures occur.
2. **Auto-derive `SLATE_GAME_DATES`** from `BET_SLATES`. Replace `BET_SLATES.games[i].when` (string) with structured `{date, time, venue}`. Single source of truth for game scheduling — eliminates the May 7 SAS-MIN bug class.
3. **Auto-resolve bets** when `series.games[N].winner` is set. New `js/engine/auto-resolve.js` — for each unresolved BETS matching the game, computes outcome from bet type (ml/spread/total/prop) + actuals and writes `result.outcome + result.actual` in a single assignment. Eliminates the manual `result:` editing that caused both NYK-PHI G2 duplicate-key bugs.
4. **Stale-label linter** (TEST 9). Sweeps `bets.js` for "TODAY" / "TOMORROW" / weekday-month-day labels that don't match `CURRENT_DATE` ± 1. Fails tests instead of shipping yesterday's labels.

### Tier 2 — Reduce hard-coding (defer until after Tier 1; ~half-day each)

5. **Single prediction source of truth.** Predictions DERIVED from engine output + small `tacticalAdjustments[]` overrides. Never hand-author `homeScore/awayScore/margin`. Removes the entire "engine says 9, prediction says 4" class of bug.
6. **Compute Daily P&L from data.** Function scans BETS + FEATURED_PARLAYS for each date and renders the grid (also auto-splits Floor vs Traditional). Hand-maintained P&L strings go away.
7. **Unify renderers.** Merge the structured `renderGamePrediction` path and the dynamic-only panel into one renderer. They differ only in whether `s.gameN` exists vs `s.games[idx].prediction` — pick the latter shape uniformly and the duplication disappears.

### Tier 3 — Architectural (defer until needed)

8. **Boot-time health-check banner.** All Tier 1.1 + Tier 2 validators run on every page load, and a fixed banner at the top lists what's broken. Closest thing to "CI in the browser" without a build step.
9. **Split `series-data.js` into per-series files** (`js/data/series/r2-nyk-phi.js`, etc.). Boot loads them all into `SERIES_DATA`. Reduces merge-conflict risk and blast radius of typos.
10. **Replace `homeCourtOverride: 'away'`** with derived seed comparison. The flag is a band-aid; the seeds tell you which team should have HCA.

### Daily checklist + scheduling (after Tier 1 lands)

After Tier 1 ships, build `DAILY_UPDATE.md` (canonical morning checklist) and wire to the `/schedule` skill to fire each morning at a chosen time (e.g. 9 AM ET, after morning injury reports drop). Steps include the user's 8 items + additions: bump `CURRENT_DATE`, update `SLATE_GAME_DATES`, sweep stale labels, run TEST 7/8/9, verify prediction↔engine alignment, verify ≥3 Floor parlays exist, update CONTEXT.md, commit + push, verify Pages build status, rollback if any validation fails.

---

## How to Continue This Project

1. Read this `CONTEXT.md` and the `README.md` for orientation
2. Key globals: `SERIES_DATA`, `BETS`, `BET_SLATES`, `FEATURED_PARLAYS`, `NEWS`, `CURRENT_DATE`, `currentPlayoffRound`, `currentConf`, `ROUND_META`, `PLAYOFF_ADJUSTMENT`, `SIM_CONFIG`
3. **Daily update workflow** (today: manual; planned: automated via `DAILY_UPDATE.md` + `/schedule` after Tier 1 lands):
    a. Bump `CURRENT_DATE` in `constants.js` to today's slate date
    b. Update `SLATE_GAME_DATES` in `js/ui/home.js` if the new slate's series→date mapping differs from the previous round
    c. Add new entries to `NEWS` (newest first) for today's injury reports / corrections
    d. Mark resolved bets in `BETS` (`result.outcome` + `result.actual`); resolved bets auto-drop from the Home page's "Tonight's Bets". **Watch for duplicate-key trap** — replace existing `result:` rather than adding a new one (TEST 7 catches but be careful when editing). Tier 1.3 will automate this.
    e. Mark resolved parlays in `FEATURED_PARLAYS` similarly
    f. Sweep `bets.js` for stale "TODAY"/"TOMORROW" labels; relabel old slates as "RESULTS" with W-L summary. Tier 1.4 (TEST 9) will catch this.
    g. **Run `node test-projections.js`** — must report 3468/3468 (or higher with Tier 1.1's TEST 8) before pushing
    h. Commit, fast-forward `main`, push to `origin/main` — GitHub Pages rebuilds within ~1 min. Verify with `gh api repos/.../pages/builds`.
4. **Adding game results**: update `series.games[i].winner/homeScore/awayScore/notes/boxScores`, `modelLessons`. After Tier 1.3, bets auto-resolve.
5. **Adding new engine factors**: add to `calcGameProjection()` lineage array and update `definitions.js`. The lineage `runningMargin` should agree with `calcBlendedProjection().blendedMargin`.
6. **Adding a new bet slate** (e.g. R2 G3):
    a. Append entries to `BETS` with the right `betId` prefix
    b. Add a `BET_SLATES` entry with `when`/`context`/`recap` (Tier 1.2: also add structured `date`/`time`/`venue`)
    c. Call `renderBetSlateSeries('R2-G3','SERIES-KEY',{dml,dmargin,dwinner})` in `bets.js`
    d. Add the slate's series→date mapping to `SLATE_GAME_DATES` (Tier 1.2: derived automatically)
7. **Adding a new featured parlay**: append to `FEATURED_PARLAYS` with `category: 'floor'` or `'traditional'` — Home's toggle filters automatically. **Always 3 Floor parlays per day** is the rule.
8. **Adding a new CHS scenario**: append to `series.compoundScenarios[playerName]` with the condition list and `ptsDelta`/`reboundDelta`/etc. Verify with `getTeamScenarioSummary` or TEST 6 in `test-projections.js`.
9. **G3/G4/G6 venue note (Phase 58):** `calcWinProb` and `calcGameProjection` now correctly flip HCA for G3/G4/G6 when called with `gameNum`. Series-level callers without `gameNum` (`components.js`, `series-renderer.js` series header) keep working unchanged because gameNum defaults to undefined → no flip.
10. **Independent backtest**: pattern checks against `playoffs_2025_validation.js`
11. Run `node -c js/path/to/file.js` for syntax checks (all files should pass individually)
12. **When updating predictions**: keep `prediction.homeWin / homeScore / awayScore / margin / spread / moneyline / ou / character` aligned with engine output (or within 4pt tolerance + documented `keyTakeaways[]` explaining the divergence). The headline display in `series-renderer.js` reads from prediction values when present and falls back to live engine. A muted "Engine: X by Y" pill auto-appears when the two diverge.
