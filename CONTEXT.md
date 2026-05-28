# NBA Playoff Analyzer 2026 — Project Context

> Snapshot of project state for future sessions. Last updated **May 28, 2026** (Daily 5/28 — WCF G5 recorded, G6 authored; ECF complete, NYK in Finals).

For day-to-day workflow see [DAILY_UPDATE.md](DAILY_UPDATE.md).
For the calibration audit findings see [CALIBRATION_AUDIT.md](CALIBRATION_AUDIT.md).

---

## What this is

Interactive HTML/CSS/JS web app for the 2026 NBA Playoffs. No build step,
no framework, all globals. Live at https://gasperjw1.github.io/nba-playoff-analyzer/.

Three-layer architecture:
- **Data layer** (`js/data/*.js`) — series rosters, bets, news, ledgers
- **Engine layer** (`js/engine/*.js`) — projections + risk + analytics
- **UI layer** (`js/ui/*.js`) — page renderers

3860+ integration tests in `test-projections.js`. Re-run any time with `node test-projections.js`.

---

## Current state (May 28, 2026)

**Live round:** Conference Finals (R3) — WCF deciding stretch
- **WCF:** OKC leads SAS 3-2 — G6 tonight Thu 5/28 at Frost Bank Center, 8:30 PM ET (SAS elimination; OKC can clinch first Finals since 2012). G7 if needed Sat 5/30 at Paycom.
- **ECF:** COMPLETE — NYK swept CLE 4-0, advances to first NBA Finals since 1999 (Brunson ECF MVP). Awaiting WCF winner; Finals G1 tips this weekend (or early next week if WCF goes 7).

**Series complete:**
- R1: 8/8 done
- R2: NYK 4-0 PHI, SAS 4-2 MIN, OKC 4-0 LAL, CLE 4-3 DET (G7 125-94 road win)
- ECF: NYK 4-0 CLE

**R3 results so far (WCF through G5, ECF complete):**
- WCF G1: SAS 122-115 (2OT) — Wemby 41/24 historic; engine wrong-winner (had OKC by 6)
- WCF G2: OKC 122-113 — SGA 30/9 bounce-back; engine calibrated (had OKC by 7, actual 9)
- WCF G3: OKC 123-108 — McCain 24 (career playoff-high) + Caruso 29 bench; engine wrong-winner (had SAS by 4)
- WCF G4: SAS 103-82 — Wemby 33/8/5/3blk, SAS held OKC to 82 (6-33 from 3); engine right-winner, +17 margin miss
- WCF G5: OKC 127-114 — SGA 32/9, Wemby held to series-low 20/6 (OKC box-out); engine right-winner (OKC by 4, actual 13)
- ECF G1: NYK 115-104 (OT) — 22pt 4Q comeback, Brunson 38; engine wrong-winner (had CLE by 4)
- ECF G2: NYK 109-93 — Hart playoff career-high 26; engine right-winner, +6pt margin miss
- ECF G3: NYK 121-108 — Brunson 30, Anunoby 21; engine wrong-winner (had CLE by 6)
- ECF G4: NYK 130-93 — sweep clincher, Brunson ECF MVP; engine right-winner, +30 margin miss

**Active framework** (post Phase 71 calibration audit + Phase 73 elimination/streak guards):
- Engine projects with per-tier + per-player bias corrections applied
- Every bet card auto-renders a `PLACE / CAUTION / SKIP` pill via `edge-detector.js`
- Phase 71 G7 elimination cap auto-downgrades elimination-game PLACE → CAUTION
- Spread cells downgraded to CAUTION (audit margin MAE 13pt)
- Phase 73 ELIMINATION_VARIANCE_MULT (1.4×) widens scoring bands for G6/G7
- Phase 73g LINEUP_OVERRIDES catches late-breaking scratches
- All R3 predictions are explicit out-of-sample; reduced stakes ($100 floor / $50 traditional, 50% of normal)

---

## File map

```
nba-playoff-analyzer/
├── index.html                       # App shell; script tags in dep order
├── css/styles.css
├── js/
│   ├── app.js                       # Boot — Home is default tab
│   ├── state.js                     # UI state; currentPlayoffRound default 'CF'
│   ├── utils.js
│   ├── validators.js                # Schema validation (TEST 8 + 17)
│   ├── data/
│   │   ├── constants.js             # CURRENT_DATE, HCA, STAR_BIAS_CONFIG, PLAYER_BIAS_OVERRIDE
│   │   ├── series-data.js           # 14 series; CF scaffolds for OKC-SAS + NYK-CLE
│   │   ├── bets-data.js             # BETS + FEATURED_PARLAYS + BET_SLATES
│   │   ├── news.js                  # Curated NEWS feed (top of Home page)
│   │   ├── boxscores.js             # Per-player box scores (R1 G1-G7, R2 G1-G6)
│   │   ├── historical.js            # Historical without-star data
│   │   └── chs-ledger.js            # CHS shadow-engine predictions
│   ├── engine/
│   │   ├── ratings.js               # calcTeamRating, calcWinProb (HCA-aware)
│   │   ├── projections.js           # 16-modifier calcExpectedPlayerStats + calcGameProjection
│   │   ├── chemistry.js             # SPM 8-dimension synergy
│   │   ├── fatigue.js
│   │   ├── matchups.js              # D-LEBRON suppression, bounce-back
│   │   ├── scenarios.js             # Compound Historical Scenarios (off by default)
│   │   ├── projections-chs.js       # CHS shadow wrapper
│   │   ├── player-tendencies.js     # Ejection/exhaustion/injury risk
│   │   ├── simulation.js            # 10K-iter Monte Carlo
│   │   ├── monte-carlo.js           # Game + player-level MC sim
│   │   ├── parlay-builder.js        # Reliable + Traditional parlay generators
│   │   ├── edge-detector.js         # PLACE/CAUTION/SKIP classifier + Phase 71 guardrails
│   │   ├── risk-controls.js         # Slate concentration + Kelly + blowout suppression
│   │   ├── risk-analytics.js        # VaR/CVaR/Sharpe/RoR
│   │   ├── graduation.js            # R1→R2→CF series graduation
│   │   └── auto-resolve.js          # Bet outcome auto-derivation from box scores
│   └── ui/
│       ├── components.js
│       ├── series-renderer.js
│       ├── bet-card.js              # Edge-pill rendering + Phase 71 guardrails
│       ├── home.js                  # Landing page + off-day 5-day scan
│       ├── chs-lab.js               # Risk Dashboard + Bet-Filter Verdict + Concentration
│       ├── bets.js                  # R1 archive / R2 archive / CF live renderers
│       ├── modals.js
│       ├── navigation.js
│       ├── learnings.js
│       └── definitions.js
├── test-projections.js              # 3860+ assertions
├── test-calibration-audit.js        # Game + player-level calibration audit
├── test-pl-with-filters.js          # P&L retro with edge-detector filters
├── test-risk-analytics.js           # VaR/Sharpe/RoR historical analysis
├── DAILY_UPDATE.md                  # Morning checklist
├── CALIBRATION_AUDIT.md             # Phase 71 audit findings + recommendations
├── BACKTEST_R1.md                   # R1 retrospective
└── README.md
```

Script load order: data → utils/state → engine → UI → boot.

---

## Key globals

| Global | Where | What |
|---|---|---|
| `SERIES_DATA` | series-data.js | Array of 14 series objects |
| `BETS` | bets-data.js | Flat array of typed bet records |
| `BET_SLATES` | bets-data.js | Per-slate metadata + recap |
| `FEATURED_PARLAYS` | bets-data.js | Featured parlay records |
| `NEWS` | news.js | Curated news feed (newest first) |
| `CURRENT_DATE` | constants.js | Drives Home page Tonight/Tomorrow detection |
| `STAR_BIAS_CONFIG` | constants.js | Tier-based PTS/REB/AST corrections |
| `PLAYER_BIAS_OVERRIDE` | constants.js | Per-player Phase 71c adjustments |
| `HISTORICAL_R2` | edge-detector.js | Cross-tab + verdicts |
| `currentPlayoffRound` | state.js | 'R1' \| 'R2' \| 'CF' \| 'Finals' |

---

## Schemas

### Bet record (`BETS[]`)
```js
{
  id: 'cf-g1-okc-sas-ml',
  slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: 'YYYY-MM-DD',
  type: 'ml' | 'spread' | 'total' | 'prop',
  pick: 'OKC ML vs SAS',
  odds: '-180',
  facts: [{label, value}, ...],
  modelHook: {fn: 'dml', args: [seriesId, gameNum]},  // optional
  reasoning: '<html>',
  confidence: 'best-bet' | 'high' | 'medium' | 'lean' | 'coin-flip',
  thesis: ['model', 'matchup', 'regression', 'historical', 'situational', 'market'],
  narrative: 'bounce-back' | 'desperation' | 'rest-edge' | null,
  result: null | {outcome: 'win'|'loss'|'push'|'void', actual: '...'}
}
```

### Featured parlay (`FEATURED_PARLAYS[]`)
```js
{
  id: '...', slate: 'CF-G1', date: 'YYYY-MM-DD',
  category: 'floor' | 'traditional',
  type: 'best-bet' | 'chaos' | 'value',
  name: 'Display Name',
  stake: 100, odds: '+125', payout: '...',
  legs: [{pick, odds, confidence, status, note}, ...],
  thesis: '...',
  result: null | {outcome, delta, actual},
}
```

---

## Calibrated framework (Phase 68 → 71c)

**Edge detector** (`js/engine/edge-detector.js`) classifies every bet via empirical cross-tab from 99 settled R2 bets. Each unsettled bet renders a colored pill on the card:

- **PLACE** (green) — historical cell shows +EV (e.g., `lean × spread` pre-Phase-71, `best-bet × ml`)
- **CAUTION** (yellow) — low confidence, small sample, or known-risky type (all spreads post-Phase-71; un-projected stats; G6/G7)
- **SKIP** (red) — historical cell shows −EV (e.g., `high × prop`, `medium × prop`, `medium × total`)

**Star bias correction** (`STAR_BIAS_CONFIG` in constants.js): subtracts tier-based deltas from elite/starter PTS/REB/AST projections to match the audit-observed bias.

**Per-player override** (`PLAYER_BIAS_OVERRIDE`): 8 audit-identified outliers (Cade, Tobias, RJ Barrett, OG, Duren, Ingram, Stewart, SGA) get individual additive corrections.

**Risk dashboard** (CHS Lab page): Sharpe, max drawdown, P(ruin), equity curve, concentration scan.

See `CALIBRATION_AUDIT.md` for the full audit + ranked recommendations.

---

## Recent phase highlights

| Phase | What |
|---|---|
| **73j** | CF P&L tracking on both R2 and CF bets pages |
| 73i | Structured boxScores for all 4 CF games + auto-resolver KAT/Wemby aliases |
| 73h | Winner-aware error calc + OT total adjustment + parlay coverage validator |
| 73g | Half-integer lines + MC freshness + LINEUP_OVERRIDES late-scratch path |
| 73f | Daily-task gap fixes + DAILY_UPDATE hardening (pre-push rebase guard) |
| 73e | Series Analysis audit — 4 pattern violations fixed |
| 73d | State sync — currentSeriesIdx tracks (round, conf) |
| 73c | Series Analysis page hotfix — CF scaffold field guards |
| 73b | CHS Lab extended to R3 + promotion evaluation surfaced |
| 73 | Post-G7 model fixes (ELIMINATION_VARIANCE_MULT 1.4×, wrong-direction streak detector) |
| 72b | CF Bets page (renderCFBets); NYK-CLE full scaffold |
| 72 | Conference Finals setup — OKC-SAS scaffold, CF-G1 slate, off-day 5-day scan |
| 71c | Per-player bias override (8 outliers) |
| 71b | Tier-based star bias correction + 3 audit guardrails |
| 71 | 68-game calibration audit |
| 70 | Risk-analyst dashboard (Sharpe/VaR/RoR) |
| 69 | Anti-big-loss guardrails (concentration cap, Kelly, blowout suppression) |
| 68 | Edge detector + empirical cross-tab |
| 67 | Home page fixes — NEWS sort + off-day fallback |
| 65 | Reliable vs Traditional parlay split |
| 61-62 | Monte Carlo simulator + calibration buckets |
| 57 | Home landing page |
| 52 | Compound Historical Scenarios engine (off by default) |
| 42 | Projection lineage waterfall + round navigation |

Full history in `js/ui/learnings.js` (collapsible UI timeline).

---

## Common workflows

**Adding a new game result** — update `series.games[i]` with winner/scores/notes/boxScores. Auto-resolve will derive bet outcomes from box scores; mismatches show in the validation banner.

**Adding a new bet slate** — append `BETS[]` entries with the right slate key (e.g. `CF-G2`), add a `BET_SLATES['CF-G2']` entry, parlays go in `FEATURED_PARLAYS[]` with same slate. Bet cards auto-render with edge pills.

**Re-running the audit** — `node test-calibration-audit.js`. If R3 tier biases drift > 1pp from the baseline in `CALIBRATION_AUDIT.md`, re-tune `STAR_BIAS_CONFIG` deltas.

**Pre-deploy check** — `node test-projections.js` must report 0 failures. Then commit, push, GitHub Pages rebuilds in ~1-5 min.

---

## Known quirks

- **HOU-LAL** uses `homeCourtOverride: 'away'` because LAL had actual HCA in data-formatted-HOU-as-home. Phase 58's venue flip composes correctly.
- **JS object-literal duplicate keys are silent** — last one wins. TEST 7 sweeps both player records + bet records.
- **News entries can have `series: null`** for system-status notes. `homeFindSeries` and `homeRenderNewsItem` handle this (Phase 72 hotfix).
- **CF scaffolds with `tbdOpponent: true`** are skipped by the Home renderer + CF Bets page. Fill in rosters + flip the flag when matchups confirm.

---

## How to continue this project

1. Read this file + `DAILY_UPDATE.md` for orientation.
2. Run `node test-projections.js` — should be green.
3. Most work flows through `DAILY_UPDATE.md` (per-game) or audit re-runs (per-round).
4. New engine modules should follow Phase 68-71 pattern: pure functions, configurable via constants, covered by tests, surfaced in the UI via a dashboard panel.
5. **Resist adding more risk overlays** without first re-running the audit. The model layer is where edge actually lives.
