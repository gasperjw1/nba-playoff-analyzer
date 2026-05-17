// ============================================================
// Risk Analytics Run — Phase 70 (May 17, 2026)
// ============================================================
// Computes the risk-analyst view of our historical R2 betting record
// and reports the metrics that the prior "did we win?" framing missed.
//
// Run: node test-risk-analytics.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function makeCtx() {
  const ctx = vm.createContext({
    console, Math, Array, Object, Set, Map, JSON,
    parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error,
    module: { exports: {} }, require,
  });
  function load(rel) {
    const code = fs.readFileSync(path.join(__dirname, rel), 'utf8');
    vm.runInContext(code.replace(/^(const|let) /gm, 'var '), ctx);
  }
  load('js/data/constants.js');
  load('js/data/series-data.js');
  load('js/data/bets-data.js');
  load('js/engine/edge-detector.js');
  load('js/engine/risk-analytics.js');
  return ctx;
}

function payoutPerDollar(americanOdds) {
  const n = Number(americanOdds);
  if (!isFinite(n) || n === 0) return 0;
  if (n > 0) return n / 100;
  return 100 / -n;
}

function main() {
  const ctx = makeCtx();
  const BETS = ctx.BETS;
  const STAKE = 25;

  // Convert R2 settled straight bets into { date, pl }
  const r2Settled = BETS.filter(b =>
    typeof b.slate === 'string' && b.slate.startsWith('R2-') &&
    b.type !== 'parlay' &&
    b.result && (b.result.outcome === 'win' || b.result.outcome === 'loss' || b.result.outcome === 'push' || b.result.outcome === 'void')
  ).map(b => {
    let pl = 0;
    if (b.result.outcome === 'win')  pl = +(STAKE * payoutPerDollar(b.odds)).toFixed(2);
    if (b.result.outcome === 'loss') pl = -STAKE;
    return { date: b.postedAt, pl, type: b.type, confidence: b.confidence };
  });

  console.log('═══════════════════════════════════════════════════════════');
  console.log('RISK ANALYST VIEW OF THE R2 BETTING RECORD');
  console.log(`(99 straight bets, $${STAKE} flat stake, $500 reference bankroll)`);
  console.log('═══════════════════════════════════════════════════════════\n');

  const hist = ctx.computeHistoricalRiskMetrics(r2Settled);
  console.log('── SESSION-LEVEL METRICS ──');
  console.log(`Sessions:           ${hist.totalSessions} days (${hist.dateRange.from} → ${hist.dateRange.to})`);
  console.log(`Total P&L:          ${hist.totalPL >= 0 ? '+' : ''}$${hist.totalPL}`);
  console.log(`Daily mean:         ${hist.dailyMean >= 0 ? '+' : ''}$${hist.dailyMean}/session`);
  console.log(`Daily σ (std dev):  $${hist.dailyStd}/session`);
  console.log(`Daily Sharpe:       ${hist.dailySharpe}  ${hist.dailySharpe >= 0.5 ? '(strong)' : hist.dailySharpe >= 0 ? '(weak)' : '(NEGATIVE — losing more on bad days than winning on good)'}`);
  console.log(`Sortino:            ${hist.sortino}`);
  console.log(`Winning sessions:   ${hist.winningSessions} / ${hist.totalSessions} (${(hist.winRate*100).toFixed(1)}%)`);
  console.log(`Losing sessions:    ${hist.losingSessions}`);
  console.log(`Flat sessions:      ${hist.flatSessions}`);
  console.log('');
  console.log('── DRAWDOWN ──');
  console.log(`Max drawdown:       $${hist.maxDrawdown}`);
  console.log(`  Peak date:        ${hist.drawdownPeakDate} (equity ${hist.equityCurve.find(e => e.date === hist.drawdownPeakDate)?.equity})`);
  console.log(`  Trough date:      ${hist.drawdownTroughDate} (equity ${hist.equityCurve.find(e => e.date === hist.drawdownTroughDate)?.equity})`);
  console.log(`  Duration:         ${hist.drawdownDuration} sessions`);
  console.log(`Longest loss streak: ${hist.longestLossStreak} consecutive losing sessions`);
  console.log('');

  console.log('── EQUITY CURVE ──');
  hist.equityCurve.forEach(e => {
    const bar = '█'.repeat(Math.max(0, Math.floor((e.equity + 250) / 30)));
    const sign = e.dailyPL >= 0 ? '+' : '';
    console.log(`${e.date}  PL ${sign}$${e.dailyPL.toString().padStart(7)}  equity $${e.equity.toString().padStart(7)}  ${bar}`);
  });
  console.log('');

  // ── Risk of Ruin ─────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════════');
  console.log('RISK OF RUIN — IF WE KEEP BETTING AT CURRENT PACE');
  console.log('═══════════════════════════════════════════════════════════');
  const bankrolls = [200, 500, 1000];
  bankrolls.forEach(br => {
    const ror = ctx.computeRiskOfRuin(br, hist.dailyMean, hist.dailyStd, { horizonDays: 30 });
    console.log(`\nBankroll $${br}, 30-day horizon:`);
    console.log(`  P(ruin = bankroll hits $0):        ${(ror.P_ruin*100).toFixed(1)}%`);
    console.log(`  P(lose 50% at any point):          ${Math.min(100, ror.P_lose_half*100).toFixed(1)}%`);
    console.log(`  P(double bankroll):                ${Math.min(100, ror.P_double*100).toFixed(1)}%`);
    console.log(`  Final bankroll p10:                $${ror.p10}`);
    console.log(`  Final bankroll median:             $${ror.p50}`);
    console.log(`  Final bankroll p90:                $${ror.p90}`);
    console.log(`  Median time to ruin (if reached):  ${ror.medianTimeToRuin !== null ? ror.medianTimeToRuin + ' days' : 'n/a'}`);
  });

  // ── Slate-level forward analysis (illustrative) ────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('FORWARD SLATE EXAMPLE — DET-CLE G7 (TODAY)');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Hypothetical 4-bet slate at $25/bet to illustrate VaR/CVaR:');
  const sampleSlate = [
    { stake: 25, hitProb: 0.62, americanOdds: -120, correlationGroup: 'DET_ML' },     // ML lean
    { stake: 25, hitProb: 0.58, americanOdds: -110, correlationGroup: 'DET_COVER' },   // Spread
    { stake: 25, hitProb: 0.55, americanOdds: -110, correlationGroup: 'GAME_OVER' },   // Total
    { stake: 25, hitProb: 0.65, americanOdds: -125, correlationGroup: 'Cade_OVER' },   // Cade prop
  ];
  const slateRisk = ctx.computeSlateRisk(sampleSlate);
  console.log(`Bets:                  ${slateRisk.legCount} (${slateRisk.groupCount} independent groups)`);
  console.log(`Total staked:          $${slateRisk.totalStaked}`);
  console.log(`Max possible loss:     $${slateRisk.maxLoss}`);
  console.log(`Max possible win:      $${slateRisk.maxPossibleWin}`);
  console.log(`Expected return:       ${slateRisk.expectedReturn >= 0 ? '+' : ''}$${slateRisk.expectedReturn}`);
  console.log(`Std dev of P&L:        $${slateRisk.stdDev}`);
  console.log(`95% VaR (worst 5%):    $${slateRisk.var95}`);
  console.log(`99% VaR (worst 1%):    $${slateRisk.var99}`);
  console.log(`CVaR (avg of worst 5%): $${slateRisk.cvar95}`);
  console.log(`Sharpe ratio:          ${slateRisk.sharpe}`);
  console.log(`Sortino ratio:         ${slateRisk.sortino}`);
  console.log(`P(positive day):       ${(slateRisk.winProb*100).toFixed(1)}%`);
  console.log(`P(losing day):         ${(slateRisk.lossProb*100).toFixed(1)}%`);

  const interp = ctx.interpretRisk(slateRisk, 500);
  console.log(`\nRisk verdict at $500 bankroll: ${interp.verdict}`);
  console.log(`  ${interp.explain}`);

  // Same slate but with calibration applied
  console.log('\n── Same slate WITH Phase 62 calibration applied ──');
  const slateRiskCal = ctx.computeSlateRisk(sampleSlate, { useCalibration: true });
  console.log(`Expected return:       ${slateRiskCal.expectedReturn >= 0 ? '+' : ''}$${slateRiskCal.expectedReturn}`);
  console.log(`CVaR:                  $${slateRiskCal.cvar95}`);
  console.log(`Sharpe:                ${slateRiskCal.sharpe}`);
  console.log(`P(losing day):         ${(slateRiskCal.lossProb*100).toFixed(1)}%`);
  console.log(`Calibration reveals:  ${slateRiskCal.expectedReturn < slateRisk.expectedReturn ? 'OPTIMISM gap — raw model expects more than honest model.' : 'Raw and calibrated agree.'}`);

  // ── Counterfactual: what if we'd applied the Phase 68 filter all along? ──
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('COUNTERFACTUAL — IF PHASE 68 FILTER HAD BEEN ON FROM DAY 1');
  console.log('(drop all props, keep ml/spread/total — empirical SKIP rule)');
  console.log('═══════════════════════════════════════════════════════════');
  const filtered = r2Settled.filter(b => b.type !== 'prop');
  const histF = ctx.computeHistoricalRiskMetrics(filtered);
  console.log(`Sessions:              ${histF.totalSessions}`);
  console.log(`Total P&L:             ${histF.totalPL >= 0 ? '+' : ''}$${histF.totalPL}`);
  console.log(`Daily mean:            ${histF.dailyMean >= 0 ? '+' : ''}$${histF.dailyMean}/session`);
  console.log(`Daily σ:               $${histF.dailyStd}/session`);
  console.log(`Daily Sharpe:          ${histF.dailySharpe}  ${histF.dailySharpe >= 0.5 ? '(STRONG)' : histF.dailySharpe >= 0 ? '(positive)' : '(negative)'}`);
  console.log(`Sortino:               ${histF.sortino}`);
  console.log(`Win rate (sessions):   ${(histF.winRate*100).toFixed(1)}%`);
  console.log(`Max drawdown:          $${histF.maxDrawdown} (${((histF.maxDrawdown/500)*100).toFixed(1)}% of $500 bankroll)`);
  console.log(`Longest loss streak:   ${histF.longestLossStreak} sessions`);

  // Risk of ruin under filtered strategy
  console.log('\n── Risk of Ruin at $500 bankroll, 30-day horizon (FILTERED) ──');
  const rorF = ctx.computeRiskOfRuin(500, histF.dailyMean, histF.dailyStd, { horizonDays: 30 });
  console.log(`  P(ruin):              ${(rorF.P_ruin*100).toFixed(1)}%  (was 69.3% baseline)`);
  console.log(`  P(lose 50%):          ${Math.min(100, rorF.P_lose_half*100).toFixed(1)}%  (was 100% baseline)`);
  console.log(`  P(double):            ${Math.min(100, rorF.P_double*100).toFixed(1)}%  (was 3.3% baseline)`);
  console.log(`  Final p10:            $${rorF.p10}`);
  console.log(`  Final median:         $${rorF.p50}`);
  console.log(`  Final p90:            $${rorF.p90}`);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('WHAT A RISK ANALYST WOULD SAY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`At Sharpe ${hist.dailySharpe}, this betting strategy is ${hist.dailySharpe < 0 ? 'destroying capital — every additional bet has negative expected risk-adjusted return.' : 'producing positive risk-adjusted returns.'}`);
  console.log(`Max drawdown $${hist.maxDrawdown} on a $500 bankroll = ${((hist.maxDrawdown/500)*100).toFixed(1)}% drawdown.`);
  console.log(`Anything > 30% drawdown is the textbook "stop trading, audit the strategy" signal.`);
  console.log(`Longest loss streak ${hist.longestLossStreak} sessions is ${hist.longestLossStreak >= 4 ? 'a warning sign — psychological + capital pressure mount fast.' : 'within normal variance.'}`);
}

main();
