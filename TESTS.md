# Test & Backtest Inventory

The repo has three categories of `*.js` scripts that look like tests
but serve different purposes. This guide names each so you know which
to run when.

| Naming | Purpose | When to run |
|---|---|---|
| `test-projections.js` | **Regression suite.** All schema / engine / UI / parlay-coverage validators. | Every commit, every daily routine. ~3s runtime. |
| `backtest-*.js` | **One-shot analyses.** Past hypothesis-testing scripts; their findings are encoded in the engine or have been documented. Kept as evidence + for periodic re-run. | On demand (audit drift, new factor proposal). NOT in CI. |
| `test-{chs-lab-ledger-update,user-bet-log}.js` | **CLIs.** Daily-routine commands (snapshot / settle / add bets / report). The `test-` prefix is historical — these are everyday tools. | Daily / per-bet. NOT regression checks. |

---

## 1 · `test-projections.js` — the regression suite

3,957 assertions across 35 TEST blocks, ~3 seconds wall clock. Run with `node test-projections.js`.

**What it catches:**
- Series / boxscore / bets / news / ledger schema drift (TESTs 1, 7, 8, 12, 29, 30)
- Auto-resolve reconciliation (TEST 9) — the canonical "daily run actually completed" check
- Prediction `homeWin`/`score`/`margin` consistency (TEST 11)
- Game-result silent-null winners (TEST 17)
- Stale TODAY/TONIGHT labels (TEST 10)
- Series Analysis page render sweep — every series × every tab (TEST 25d). Caught the Finals UI bug on 6/3.
- Parlay coverage gap detector (TEST 28) — flags Series with predictions but no bets. Caught the Finals-G1 coverage gap on 6/3.
- Monte Carlo invariants + parlay builder math (TESTs 14, 16)
- Edge detector + risk controls (TESTs 20-23, 26)
- Phase 73 elimination amplifier + closeout cap + CHS Lab ledger (TESTs 25c, 27, 29, 31)
- Legacy archive validation — BOS-PHI G2 box score, R1 G3 reasoning text (TESTs 2-5). Niche; defensible legacy guard.

**Don't remove a test block without first checking whether it still covers live data** — TESTs 2-5 look archaic but still validate 8 series with `game3` fields.

---

## 2 · `backtest-*.js` — past analyses (NOT regression tests)

These ran once each to test a hypothesis. Results landed either in the engine, a memory note, or a `*.md` report. They're standalone — `test-projections.js` does not import them — and they're kept as evidence (for future "did we already test this?" questions) and for periodic re-run when the situation calls for it.

| File | Phase | Hypothesis | Outcome |
|---|---|---|---|
| `backtest-calibration-audit.js` | 71 | Engine-wide game + player accuracy by tier. | Confirmed; informed Phase 71b/c star-bias correction. **Re-run periodically** per `CALIBRATION_AUDIT.md` + `DAILY_UPDATE.md` step. |
| `backtest-cf-margin.js` | 73x | Engine underestimates CF margins specifically. | **REJECTED** — the 14pt MAE is global, not CF-specific. Documented in memory. |
| `backtest-closeout-edge.js` | 73o | Winners' top starters get capped minutes in closeout games. | **CONFIRMED** — n=10 closeout games, ~7% suppression. Shipped as `js/engine/projections.js` Phase 73o cap. |
| `backtest-chs-lab.js` | 73l | CHS Lab parlay builder cashes in walk-forward on settled CF games. | Confirmed; informed `chs-lab.js` UI presentation. |
| `backtest-chs-lab-starters.js` | 73l (variant) | Same as above but restricted to starters-only. | Confirmed variant. |
| `backtest-garbage-pra.js` | 73z | Losing-side role players get garbage-time PRA boost in blowouts. | **REJECTED** — n=58 loss-role records at 97% (flat). Documented; also found a loss-starter SUPPRESSION (-20%) which we elected to hold (market likely prices it). |
| `backtest-pl-with-filters.js` | 68 | Edge-detector PLACE / CAUTION / SKIP regime improves R2 P&L. | Confirmed — `js/engine/edge-detector.js` quotes the numbers as its calibration source. |
| `backtest-risk-analytics.js` | 70 | Compute VaR / CVaR / Sharpe / drawdown / RoR on historical R2 betting record. | One-time analysis; informed Phase 71 stake discipline. |

**When to re-run:** if the engine's calibration drifts (TEST 26 + Phase 71 guardrails) or a new factor proposal needs walk-forward evidence.

---

## 3 · CLI tools (the `test-*` prefix is misleading)

| File | What it does |
|---|---|
| `test-chs-lab-ledger-update.js` | `--snapshot` captures the live CHS Lab candidates + traditional parlay for an upcoming game into `js/data/chs-lab-ledger.js`. `--settle` resolves any pending entries against the actual box score. `--report` prints rolling P&L. Used every daily routine. |
| `test-user-bet-log.js` | `--add <bet.json>` / `--add-batch <array.json>` to log a placed bet. `--settle` resolves pending bets. `--report` prints user-bet P&L vs algorithm. Used when the user logs bets in chat. |

These could be renamed to `cli-*.js` for clarity but the daily routine references them by current name — leave as-is.

---

## Quick-reference commands

```
# Daily regression (every commit)
node test-projections.js

# Daily routine — settle yesterday + snapshot today's parlay candidates
node test-chs-lab-ledger-update.js --settle
node test-chs-lab-ledger-update.js --snapshot

# Log a placed bet
node test-user-bet-log.js --add /tmp/bet.json

# Periodic — re-validate engine calibration after every 3 settled R3+ games
node backtest-calibration-audit.js
```
