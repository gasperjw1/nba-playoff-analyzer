# NBA Playoff Analyzer 2026 — Project Context

> Snapshot of project state for future sessions. Last updated **June 8, 2026** (Daily 6/8 — Finals G2 recorded: NYK 105-104 over SAS, Knicks steal Game 2 too and lead **2-0**; engine wrong-winner AGAIN [SAS by 4 → NYK by 1] but margin/total/spread reads now **2-0** [NYK +5.5 + UNDER cashed both games]; minutes-vetted PRA floor BOUNCED BACK [+$135], cross-team REB floor lost on Wemby's 9-reb dip; Finals G3 authored for tonight Mon 6/8 at MSG, NYK -2.5 / 216.5).

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

## Current state (June 8, 2026)

**Live round:** NBA Finals (R4) — SAS vs NYK, 1999 rematch. **NYK leads 2-0.**
- **Finals G1 (Wed 6/3):** NYK 105-95 at Frost Bank Center — Knicks erased a 14-pt Q3 deficit and outscored SAS 57-40 in the 2nd half (11-0 close). Brunson 30 (12-31), KAT 18/12, OG 17, Hart 3/15reb/6ast/4stl. **Engine wrong-winner** (SAS by 2 → NYK by 10). Total 200 cashed the UNDER. Parlays 0-3 (-$250) — PRA floor broke on Keldon's 8-min playoff low.
- **Finals G2 (Fri 6/5):** NYK 105-104 at Frost Bank Center — Knicks steal Game 2 too, third team ever to start a Finals 2-0 on the road (1993 Bulls, 1995 Rockets). NYK led 97-83 in Q4, survived a SAS 14-0 run, then Brunson's go-ahead FT off a Wemby turnover + Wemby's missed buzzer look sealed it. KAT 21/13 (38 PRA), Bridges 20/6/6, OG 17, Brunson 20 on 7-25 (Castle finally suppressed the POINTS) + 6ast/5stl. SAS: Wemby 29/9/4blk (bounce-back scoring but only 9 reb + the late mistakes), Fox 20/5, Vassell 14/9/5, Harper 15/6 + Champagnie 8/4. **Engine wrong-winner AGAIN** (SAS by 4 → NYK by 1) — but the margin read was sharp and **NYK +5.5 + UNDER 214.5 both cashed** (total 209). The pattern across two games: **engine home/winner lean 0-2, margin/total/spread reads 2-0** — trust the derived spread/total, distrust the raw winner pick.
- **Tonight 6/8 — Finals G3 at MSG** (first Finals at the Garden since 1999), 8:30 PM ET ABC — SAS @ NYK, **SAS faces the 0-3 cliff.** DK NYK -2.5 / 216.5 / ML NYK -125, SAS +105. Engine NYK by 1 (COMPETITIVE) — inside the -2.5 → SAS +2.5 is the model value side, engine ~210 UNDER 216.5 (Finals UNDER lean extends).
- **Betting retro (G2):** singles 5-1 (spread/total/Wemby PRA/Champagnie PRA/Harper PRA won; SAS ML lost). Featured parlays 1-2 (-$15): **minutes-vetted PRA floor WON (+$135)** (Champagnie 13/Harper 23/Wemby 41 PRA — the G1 minutes-security fix worked), but the cross-team REB floor LOST on **Wemby's 9-reb dip** (Mitchell Robinson's increased deterrent minutes — validated the "degrade REB vs a committed box-out" rule) and the NYK-cover trad LOST on Brunson's 20-pt night (Castle suppressed the points). **User's own logged bets went 3-0 in G2** — now **9-1 all-time** (+$820, ROI 164%), PRA legs 13/13, pts 13/13. The user is hitting everything; their bets are a strong signal.

**Series complete (R1-R3):**
- WCF: **SAS won 4-3 over OKC** (G7 5/30, SAS 111-103 — Champagnie 20 off bench, Castle hounded SGA; engine wrong-winner). SAS reaches first Finals since 2014.
- ECF: NYK swept CLE 4-0 (Brunson ECF MVP), first Finals since 1999.

**Series complete:**
- R1: 8/8 done
- R2: NYK 4-0 PHI, SAS 4-2 MIN, OKC 4-0 LAL, CLE 4-3 DET (G7 125-94 road win)
- ECF: NYK 4-0 CLE

**R3 results so far (WCF through G6, ECF complete):**
- WCF G1: SAS 122-115 (2OT) — Wemby 41/24 historic; engine wrong-winner (had OKC by 6)
- WCF G2: OKC 122-113 — SGA 30/9 bounce-back; engine calibrated (had OKC by 7, actual 9)
- WCF G3: OKC 123-108 — McCain 24 (career playoff-high) + Caruso 29 bench; engine wrong-winner (had SAS by 4)
- WCF G4: SAS 103-82 — Wemby 33/8/5/3blk, SAS held OKC to 82 (6-33 from 3); engine right-winner, +17 margin miss
- WCF G5: OKC 127-114 — SGA 32/9, Wemby held to series-low 20/6 (OKC box-out); engine right-winner (OKC by 4, actual 13)
- WCF G6: SAS 118-91 — Wemby 28/10 answered the box-out, SGA held to series-low 15; engine right-winner (SAS by 3, actual 27 — +24 margin miss); SAS forces G7
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
├── backtest-calibration-audit.js        # Game + player-level calibration audit
├── backtest-pl-with-filters.js          # P&L retro with edge-detector filters
├── backtest-risk-analytics.js           # VaR/Sharpe/RoR historical analysis
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

**Re-running the audit** — `node backtest-calibration-audit.js`. If R3 tier biases drift > 1pp from the baseline in `CALIBRATION_AUDIT.md`, re-tune `STAR_BIAS_CONFIG` deltas.

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
