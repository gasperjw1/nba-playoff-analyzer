// ============================================================
// RISK ANALYTICS — Phase 70 (May 17, 2026)
// ============================================================
// Reframes the app from "did we pick winners?" to "what's the
// distribution of outcomes and how exposed are we to tail risk?"
// A risk analyst's view of the betting record and prospective slate.
//
// Three layers, all pure functions:
//
//   1. SLATE RISK (prospective — given today's bet list)
//      computeSlateRisk(bets, opts) returns:
//        - totalStaked          $ at risk across all bets
//        - expectedReturn       sum of (p × payout) - sum of ((1-p) × stake)
//        - stdDev               σ of slate P&L
//        - var95, var99         VaR at 95% / 99% confidence
//        - cvar95               Expected Shortfall (avg loss in worst 5%)
//        - sharpe               (E[R] − Rf) / σ. Rf=0 for bet slates.
//        - sortino              like Sharpe but penalizes downside only
//        - maxLoss              worst-case (all bets lose)
//        - distributionSamples  ranked P&L outcomes (for histogram)
//
//   2. HISTORICAL RISK (retrospective — given settled-bet ledger)
//      computeHistoricalRiskMetrics(settledBets, opts) returns:
//        - maxDrawdown          biggest peak-to-trough decline
//        - drawdownDuration     days from peak to recovery (or current)
//        - longestLossStreak    consecutive losing days
//        - dailySharpe          Sharpe over day-grouped returns
//        - winningSessions      % of days that ended green
//        - equityCurve          cumulative P&L over time
//
//   3. RISK OF RUIN (forward-looking — what's P(broke) over N days?)
//      computeRiskOfRuin(bankroll, dailyMean, dailyStd, horizon)
//      Monte Carlo simulation of bankroll trajectory; returns P(hit 0)
//      and the bankroll distribution at horizon.
//
// All three are agnostic to the bet schema — they take simple arrays
// of {stake, hitProb, payoutOnWin} or {date, pl} so they can be reused
// across slate, historical, and projection contexts.
// ============================================================

// ── Stat helpers ────────────────────────────────────────────────────
function _mean(arr)     { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function _stdev(arr) {
  if (arr.length < 2) return 0;
  const m = _mean(arr);
  const v = arr.reduce((s, x) => s + (x - m) * (x - m), 0) / (arr.length - 1);
  return Math.sqrt(v);
}
function _percentile(sortedArr, p) {
  if (!sortedArr.length) return 0;
  const idx = Math.max(0, Math.min(sortedArr.length - 1, Math.floor(p * sortedArr.length)));
  return sortedArr[idx];
}

// ── American-odds payout per $1 stake (won, not total) ──────────────
function _payoutPerDollar(americanOdds) {
  const n = Number(americanOdds);
  if (!isFinite(n) || n === 0) return 0;
  if (n > 0) return n / 100;
  return 100 / -n;
}

// ── computeSlateRisk ─────────────────────────────────────────────────
// Monte-Carlo over the slate to get the full P&L distribution.
//
// Each bet must provide:
//   { stake, hitProb, americanOdds }   OR
//   { stake, hitProb, payoutOnWin }    (direct payout in $)
//
// Optionally: { correlationGroup }     bets with same group string are
//   treated as PERFECTLY correlated (always win or lose together).
//   This is the slate-level analog of Phase 69's directional-key.
//
// opts.iterations defaults to 5000. Higher = smoother distribution.
// opts.useCalibration: if true and edge-detector loaded, apply Phase 62
//   calibration to each leg's hitProb before sampling.
function computeSlateRisk(bets, opts) {
  opts = opts || {};
  const iterations = opts.iterations || 5000;
  if (!Array.isArray(bets) || !bets.length) {
    return { error: 'no bets supplied' };
  }

  // Normalize each bet to { stake, hitProb, profit, group }
  const normalized = bets.map((b, i) => {
    const stake = Number(b.stake) || 0;
    let hitProb = Number(b.hitProb);
    if (!isFinite(hitProb)) hitProb = 0.5;
    if (opts.useCalibration && typeof _calibrate === 'function') {
      const c = _calibrate(hitProb);
      if (c != null) hitProb = c;
    }
    let profit;
    if (b.payoutOnWin != null) profit = Number(b.payoutOnWin);
    else if (b.americanOdds != null) profit = +(stake * _payoutPerDollar(b.americanOdds)).toFixed(2);
    else profit = stake;  // default to even money
    return {
      idx: i, stake, hitProb, profit,
      group: b.correlationGroup || `__indep_${i}`,
    };
  });

  // Group bets by correlationGroup — perfectly correlated bets share
  // a single Bernoulli draw per iteration.
  const groupMap = {};
  normalized.forEach(b => {
    groupMap[b.group] = groupMap[b.group] || [];
    groupMap[b.group].push(b);
  });
  const groups = Object.values(groupMap);

  // For independence within a group, all members share hitProb (we use
  // the first member's). For mixed-prob groups this is an approximation;
  // good enough since we treat the GROUP as the unit.
  const groupProbs = groups.map(g => g[0].hitProb);

  const totalStaked = +normalized.reduce((s, b) => s + b.stake, 0).toFixed(2);
  const maxLoss = -totalStaked;

  // Monte Carlo slate
  const samples = new Array(iterations);
  for (let i = 0; i < iterations; i++) {
    let pl = 0;
    for (let g = 0; g < groups.length; g++) {
      const hit = Math.random() < groupProbs[g];
      for (const b of groups[g]) {
        pl += hit ? b.profit : -b.stake;
      }
    }
    samples[i] = pl;
  }
  const sorted = [...samples].sort((a, b) => a - b);

  const expectedReturn = +_mean(samples).toFixed(2);
  const stdDev = +_stdev(samples).toFixed(2);
  const var95 = +_percentile(sorted, 0.05).toFixed(2);  // 5th percentile = 95% VaR
  const var99 = +_percentile(sorted, 0.01).toFixed(2);

  // CVaR: average of the worst 5% of outcomes
  const tailCount = Math.max(1, Math.floor(iterations * 0.05));
  const cvar95 = +_mean(sorted.slice(0, tailCount)).toFixed(2);

  // Sharpe: E[R] / σ. Risk-free = 0 for short-term betting horizons.
  const sharpe = stdDev > 0 ? +(expectedReturn / stdDev).toFixed(3) : 0;

  // Sortino: penalize downside only. σ_down = stdev of negative outcomes.
  const downside = samples.filter(x => x < 0);
  const downsideStd = _stdev(downside);
  const sortino = downsideStd > 0 ? +(expectedReturn / downsideStd).toFixed(3) : 0;

  // P(positive day)
  const winProb = +(samples.filter(x => x > 0).length / iterations).toFixed(3);
  const breakevenProb = +(samples.filter(x => x === 0).length / iterations).toFixed(3);
  const lossProb = +(samples.filter(x => x < 0).length / iterations).toFixed(3);

  // Histogram (for UI rendering — 10 buckets)
  const hi = sorted[sorted.length - 1];
  const lo = sorted[0];
  const bucketCount = 10;
  const histogram = new Array(bucketCount).fill(0);
  const bucketSize = (hi - lo) / bucketCount || 1;
  samples.forEach(v => {
    const b = Math.min(bucketCount - 1, Math.floor((v - lo) / bucketSize));
    histogram[b]++;
  });

  return {
    iterations,
    totalStaked,
    maxLoss,
    maxPossibleWin: +sorted[sorted.length - 1].toFixed(2),
    expectedReturn,
    stdDev,
    var95, var99, cvar95,
    sharpe, sortino,
    winProb, lossProb, breakevenProb,
    histogram: {
      buckets: bucketCount,
      bucketSize: +bucketSize.toFixed(2),
      low: +lo.toFixed(2),
      high: +hi.toFixed(2),
      counts: histogram,
    },
    legCount: normalized.length,
    groupCount: groups.length,
  };
}

// ── computeHistoricalRiskMetrics ─────────────────────────────────────
// Takes the settled-bet ledger and computes the standard portfolio
// metrics: drawdown, Sharpe, win-loss streaks, equity curve.
//
// Each bet must have: { date, pl }  where pl is realized profit/loss in $.
function computeHistoricalRiskMetrics(settledBets, opts) {
  opts = opts || {};
  if (!Array.isArray(settledBets) || !settledBets.length) {
    return { error: 'no settled bets' };
  }

  // Group by date, then sort chronologically
  const byDate = {};
  settledBets.forEach(b => {
    if (!b.date) return;
    byDate[b.date] = byDate[b.date] || 0;
    byDate[b.date] += Number(b.pl) || 0;
  });
  const dates = Object.keys(byDate).sort();
  const dailyPL = dates.map(d => byDate[d]);

  // Equity curve = cumulative P&L
  const equity = [];
  let running = 0;
  dailyPL.forEach(pl => { running += pl; equity.push(+running.toFixed(2)); });

  // Maximum drawdown = largest peak-to-trough decline along equity
  let peak = -Infinity, maxDD = 0, ddStart = 0, ddEnd = 0, peakIdx = 0;
  equity.forEach((e, i) => {
    if (e > peak) { peak = e; peakIdx = i; }
    const dd = peak - e;
    if (dd > maxDD) { maxDD = dd; ddStart = peakIdx; ddEnd = i; }
  });
  const drawdownDuration = ddEnd - ddStart;

  // Longest losing streak (consecutive negative days)
  let curStreak = 0, maxStreak = 0;
  dailyPL.forEach(pl => {
    if (pl < 0) { curStreak++; if (curStreak > maxStreak) maxStreak = curStreak; }
    else curStreak = 0;
  });

  const dailyMean = _mean(dailyPL);
  const dailyStd  = _stdev(dailyPL);
  const dailySharpe = dailyStd > 0 ? +(dailyMean / dailyStd).toFixed(3) : 0;
  const downsideDays = dailyPL.filter(x => x < 0);
  const downsideStd = _stdev(downsideDays);
  const sortino = downsideStd > 0 ? +(dailyMean / downsideStd).toFixed(3) : 0;

  const winningSessions = dailyPL.filter(x => x > 0).length;
  const losingSessions  = dailyPL.filter(x => x < 0).length;
  const flatSessions    = dailyPL.filter(x => x === 0).length;

  return {
    totalSessions: dailyPL.length,
    dateRange: { from: dates[0], to: dates[dates.length - 1] },
    totalPL: +running.toFixed(2),
    dailyMean: +dailyMean.toFixed(2),
    dailyStd: +dailyStd.toFixed(2),
    dailySharpe,
    sortino,
    winningSessions, losingSessions, flatSessions,
    winRate: +(winningSessions / dailyPL.length).toFixed(3),
    maxDrawdown: +maxDD.toFixed(2),
    maxDrawdownPct: peak > 0 ? +((maxDD / peak) * 100).toFixed(1) : null,
    drawdownDuration,
    drawdownPeakDate: dates[ddStart],
    drawdownTroughDate: dates[ddEnd],
    longestLossStreak: maxStreak,
    equityCurve: dates.map((d, i) => ({ date: d, equity: equity[i], dailyPL: +dailyPL[i].toFixed(2) })),
  };
}

// ── computeRiskOfRuin ────────────────────────────────────────────────
// Monte Carlo bankroll trajectory: given current bankroll + historical
// daily mean/std (or assumed numbers for a forward projection), simulate
// the next N days and report P(bankroll ≤ ruinThreshold).
//
//   bankroll       current $ bankroll
//   dailyMean      expected $ per day (negative = bleed)
//   dailyStd       σ of daily $ P&L
//   horizonDays    look-ahead in days (default 30)
//   ruinThreshold  bankroll level considered "ruin" (default 0)
//   iterations     MC iterations (default 5000)
//
// Returns:
//   {
//     P_ruin,            probability bankroll hits ruinThreshold
//     P_lose_half,       probability bankroll drops below 50% of start
//     P_double,          probability bankroll doubles
//     p10/p50/p90,       bankroll percentiles at horizon
//     medianTime_to_ruin (if reached in any simulation)
//   }
function computeRiskOfRuin(bankroll, dailyMean, dailyStd, opts) {
  opts = opts || {};
  const horizon = opts.horizonDays || 30;
  const ruinThreshold = opts.ruinThreshold != null ? opts.ruinThreshold : 0;
  const iterations = opts.iterations || 5000;
  if (!isFinite(bankroll) || bankroll <= 0) return { error: 'invalid bankroll' };

  // Box-Muller normal sampler
  function sampleNormal() {
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  let ruinCount = 0, halfCount = 0, doubleCount = 0;
  const finals = new Array(iterations);
  const ruinDays = [];
  for (let i = 0; i < iterations; i++) {
    let br = bankroll;
    let ruinedDay = null;
    for (let d = 0; d < horizon; d++) {
      const dailyPL = dailyMean + sampleNormal() * dailyStd;
      br += dailyPL;
      if (br <= ruinThreshold && ruinedDay === null) {
        ruinedDay = d;
        // Once ruined, bankroll stays at threshold (can't bet what you don't have)
        br = ruinThreshold;
      }
      if (br <= bankroll * 0.5) halfCount++;
      if (br >= bankroll * 2)   doubleCount++;
    }
    finals[i] = br;
    if (ruinedDay !== null) {
      ruinCount++;
      ruinDays.push(ruinedDay);
    }
  }
  const sortedFinals = [...finals].sort((a, b) => a - b);
  const sortedRuinDays = [...ruinDays].sort((a, b) => a - b);

  return {
    bankroll, dailyMean, dailyStd, horizonDays: horizon, iterations,
    P_ruin: +(ruinCount / iterations).toFixed(3),
    P_lose_half: +(Math.min(iterations, halfCount) / iterations).toFixed(3),
    P_double: +(Math.min(iterations, doubleCount) / iterations).toFixed(3),
    p10: +_percentile(sortedFinals, 0.10).toFixed(2),
    p50: +_percentile(sortedFinals, 0.50).toFixed(2),
    p90: +_percentile(sortedFinals, 0.90).toFixed(2),
    mean: +_mean(finals).toFixed(2),
    medianTimeToRuin: sortedRuinDays.length ? sortedRuinDays[Math.floor(sortedRuinDays.length / 2)] : null,
  };
}

// ── interpretRisk — translate numbers into a user-readable verdict ───
// Given a slate-risk object, produce a one-sentence summary at the
// risk-analyst level: "ACCEPTABLE", "ELEVATED", "EXCESSIVE", or "BLOCKED"
// based on Sharpe, CVaR/bankroll ratio, and downside probability.
function interpretRisk(slateRisk, bankroll, opts) {
  opts = opts || {};
  if (!slateRisk || slateRisk.error) return { verdict: 'UNKNOWN', explain: 'No risk data' };
  const cvarRatio = bankroll > 0 ? Math.abs(slateRisk.cvar95 / bankroll) : 1;
  const sharpe = slateRisk.sharpe;
  const lossProb = slateRisk.lossProb;

  // Thresholds chosen conservatively for a "preserve bankroll first" mindset:
  //   BLOCKED:    CVaR > 20% of bankroll OR Sharpe < -0.5 (avg loss > avg gain)
  //   EXCESSIVE:  CVaR > 10% of bankroll OR Sharpe < 0
  //   ELEVATED:   loss probability > 50% (favorite to lose money)
  //   ACCEPTABLE: everything else
  if (cvarRatio > 0.20 || sharpe < -0.5) {
    return { verdict: 'BLOCKED', explain: `CVaR ${(cvarRatio*100).toFixed(0)}% of bankroll OR negative Sharpe. Don't place this slate.` };
  }
  if (cvarRatio > 0.10 || sharpe < 0) {
    return { verdict: 'EXCESSIVE', explain: `CVaR ${(cvarRatio*100).toFixed(0)}% of bankroll OR Sharpe ${sharpe}. Reduce stakes or drop legs.` };
  }
  if (lossProb > 0.50) {
    return { verdict: 'ELEVATED', explain: `Favorite to lose money on this slate (P(loss) ${(lossProb*100).toFixed(0)}%). Proceed with care.` };
  }
  return { verdict: 'ACCEPTABLE', explain: `Sharpe ${sharpe}, CVaR ${(cvarRatio*100).toFixed(0)}% of bankroll, P(loss) ${(lossProb*100).toFixed(0)}%.` };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    computeSlateRisk,
    computeHistoricalRiskMetrics,
    computeRiskOfRuin,
    interpretRisk,
    _payoutPerDollar,
    _mean, _stdev, _percentile,
  };
}
