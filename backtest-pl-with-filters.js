// ============================================================
// R2 P&L Re-Runner with Edge Detector Filters — Phase 68
// ============================================================
// Answers the user's strategic question: "If we can't nail the 50/50
// bets, what's the point of having this application." This script
// settles every R2 straight bet at $25 stake under three regimes:
//
//   BASELINE       — every bet we placed (the actual ledger)
//   SKIP-ONLY      — drop bets in coin-flip zone (medium/lean/coin-flip)
//   SKIP + EDGE    — drop coin-flips AND require market disagreement
//
// Output is a per-series breakdown plus aggregate that shows whether
// the proposed rules would have flipped the slate from -$197 to +EV.
//
// Run: node backtest-pl-with-filters.js
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

function load(ctx, rel) {
  const code = fs.readFileSync(path.join(__dirname, rel), 'utf8');
  const asVar = code.replace(/^(const|let) /gm, 'var ');
  vm.runInContext(asVar, ctx);
}

function makeCtx() {
  const ctx = vm.createContext({
    console, Math, Array, Object, Set, Map, JSON,
    parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error,
    module: { exports: {} }, require,
  });
  load(ctx, 'js/data/constants.js');
  load(ctx, 'js/data/series-data.js');
  load(ctx, 'js/data/bets-data.js');
  load(ctx, 'js/engine/edge-detector.js');
  return ctx;
}

// ── American odds to decimal payout per $1 ───────────────────────────
function payoutPerDollar(americanOdds) {
  const n = Number(americanOdds);
  if (!isFinite(n) || n === 0) return 0;
  if (n > 0) return n / 100;
  return 100 / -n;
}

// ── Settle a single bet at $stake. Returns +profit or -stake. ────────
function settle(bet, stake) {
  if (!bet.result) return null;
  const o = bet.result.outcome;
  if (o === 'push' || o === 'void') return 0;
  if (o === 'win')  return +(stake * payoutPerDollar(bet.odds)).toFixed(2);
  if (o === 'loss') return -stake;
  return null;
}

// ── Main ─────────────────────────────────────────────────────────────
function main() {
  const ctx = makeCtx();
  const BETS = ctx.BETS;
  const ED = {
    shouldSkipCoinFlip: ctx.shouldSkipCoinFlip,
    detectMarketDisagreement: ctx.detectMarketDisagreement,
    confidenceToModelProb: ctx.confidenceToModelProb,
    scoreBet: ctx.scoreBet,
  };

  // R2 straight bets only (matches the original -$197.85 calc)
  const r2Straight = BETS.filter(b =>
    typeof b.slate === 'string' && b.slate.startsWith('R2-') &&
    b.type !== 'parlay' &&
    b.result && (b.result.outcome === 'win' || b.result.outcome === 'loss' || b.result.outcome === 'push' || b.result.outcome === 'void')
  );

  console.log(`Loaded ${BETS.length} total bets, ${r2Straight.length} R2 straight bets settled.\n`);

  const STAKE = 25;
  const regimes = {
    baseline:  { name: 'BASELINE (place everything)',                          bets: [] },
    skipOnly:  { name: 'SKIP COIN-FLIPS (drop medium/lean/coin-flip labels)',  bets: [] },
    skipEdge:  { name: 'SKIP + EDGE (drop coin-flips + require market edge)',  bets: [] },
  };

  // Bucket each bet under each regime
  for (const b of r2Straight) {
    regimes.baseline.bets.push(b);

    const modelProb = ED.confidenceToModelProb(b.confidence);
    const skip = ED.shouldSkipCoinFlip(modelProb);
    if (!skip.skip) regimes.skipOnly.bets.push(b);

    if (!skip.skip) {
      const dis = ED.detectMarketDisagreement(modelProb, b.odds);
      if (dis.hasEdge) regimes.skipEdge.bets.push(b);
    }
  }

  // ── Compute P&L per regime ──────────────────────────────────────
  function tally(bets, stake) {
    let w = 0, l = 0, p = 0, net = 0;
    const perSeries = {};
    for (const b of bets) {
      const series = b.series;
      perSeries[series] = perSeries[series] || { w: 0, l: 0, p: 0, net: 0, count: 0 };
      const pl = settle(b, stake);
      if (pl === null) continue;
      perSeries[series].count++;
      net += pl;
      perSeries[series].net += pl;
      if (b.result.outcome === 'win')  { w++; perSeries[series].w++; }
      if (b.result.outcome === 'loss') { l++; perSeries[series].l++; }
      if (b.result.outcome === 'push' || b.result.outcome === 'void') { p++; perSeries[series].p++; }
    }
    const total = w + l + p;
    const hitRate = total > 0 ? w / (w + l) : 0;  // ignore pushes
    return { w, l, p, total, net: +net.toFixed(2), hitRate: +hitRate.toFixed(3), perSeries };
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`R2 STRAIGHT BETS @ $${STAKE} STAKE — THREE FILTER REGIMES`);
  console.log('═══════════════════════════════════════════════════════════\n');

  const results = {};
  for (const key of Object.keys(regimes)) {
    const r = tally(regimes[key].bets, STAKE);
    results[key] = r;
    console.log(`${regimes[key].name}`);
    console.log(`  ${r.total} bets   ${r.w}W-${r.l}L-${r.p}V   ${(r.hitRate*100).toFixed(1)}% hit rate`);
    const netSign = r.net >= 0 ? '+' : '';
    console.log(`  Net: ${netSign}$${r.net.toFixed(2)}   (avg/bet: ${netSign}$${(r.net/Math.max(1,r.total)).toFixed(2)})`);
    console.log(`  ROI: ${((r.net / (r.total * STAKE)) * 100).toFixed(1)}%\n`);
  }

  // ── Per-series breakdown — show where filters added/lost value ──
  console.log('═══════════════════════════════════════════════════════════');
  console.log('PER-SERIES BREAKDOWN');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('Series     | Baseline    | Skip-Only   | Skip+Edge   | Delta vs Baseline');
  console.log('-----------|-------------|-------------|-------------|--------------------');
  const seriesIds = ['NYK-PHI', 'SAS-MIN', 'DET-CLE', 'OKC-LAL'];
  for (const sid of seriesIds) {
    const b = results.baseline.perSeries[sid] || { net: 0, count: 0, w: 0, l: 0 };
    const s = results.skipOnly.perSeries[sid] || { net: 0, count: 0, w: 0, l: 0 };
    const e = results.skipEdge.perSeries[sid] || { net: 0, count: 0, w: 0, l: 0 };
    const delta = +(e.net - b.net).toFixed(2);
    const deltaSign = delta >= 0 ? '+' : '';
    console.log(
      `${sid.padEnd(10)} | ` +
      `${(b.net >= 0 ? '+' : '') + '$' + b.net.toFixed(2)} (${b.count})`.padEnd(11) + ' | ' +
      `${(s.net >= 0 ? '+' : '') + '$' + s.net.toFixed(2)} (${s.count})`.padEnd(11) + ' | ' +
      `${(e.net >= 0 ? '+' : '') + '$' + e.net.toFixed(2)} (${e.count})`.padEnd(11) + ' | ' +
      `${deltaSign}$${delta.toFixed(2)}`
    );
  }
  console.log('');

  // ── Bet-type breakdown — see which types bleed under baseline ─
  console.log('═══════════════════════════════════════════════════════════');
  console.log('BASELINE P&L BY BET TYPE (where the bleed is)');
  console.log('═══════════════════════════════════════════════════════════');
  const byType = {};
  for (const b of regimes.baseline.bets) {
    const t = b.type;
    byType[t] = byType[t] || { w: 0, l: 0, p: 0, net: 0, count: 0 };
    const pl = settle(b, STAKE);
    if (pl === null) continue;
    byType[t].count++;
    byType[t].net += pl;
    if (b.result.outcome === 'win')  byType[t].w++;
    if (b.result.outcome === 'loss') byType[t].l++;
    if (b.result.outcome === 'push' || b.result.outcome === 'void') byType[t].p++;
  }
  console.log('Type       | Count | W-L-V       | Hit %  | Net     | ROI');
  console.log('-----------|-------|-------------|--------|---------|--------');
  Object.keys(byType).sort().forEach(t => {
    const x = byType[t];
    const hr = x.w + x.l > 0 ? x.w / (x.w + x.l) : 0;
    const roi = x.net / (x.count * STAKE);
    const sign = x.net >= 0 ? '+' : '';
    console.log(
      `${t.padEnd(10)} | ${String(x.count).padEnd(5)} | ${(x.w+'-'+x.l+'-'+x.p).padEnd(11)} | ${(hr*100).toFixed(1).padStart(5)}% | ${(sign+'$'+x.net.toFixed(2)).padStart(7)} | ${(roi*100).toFixed(1).padStart(5)}%`
    );
  });

  // ── Confidence-label breakdown — proves the coin-flip thesis ──
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('BASELINE P&L BY CONFIDENCE LABEL (proves the coin-flip thesis)');
  console.log('═══════════════════════════════════════════════════════════');
  const byConf = {};
  for (const b of regimes.baseline.bets) {
    const c = b.confidence || 'unlabeled';
    byConf[c] = byConf[c] || { w: 0, l: 0, p: 0, net: 0, count: 0 };
    const pl = settle(b, STAKE);
    if (pl === null) continue;
    byConf[c].count++;
    byConf[c].net += pl;
    if (b.result.outcome === 'win')  byConf[c].w++;
    if (b.result.outcome === 'loss') byConf[c].l++;
    if (b.result.outcome === 'push' || b.result.outcome === 'void') byConf[c].p++;
  }
  console.log('Confidence | Count | W-L-V       | Hit %  | Net     | ROI');
  console.log('-----------|-------|-------------|--------|---------|--------');
  const order = ['best-bet', 'high', 'medium', 'lean', 'coin-flip'];
  for (const c of order) {
    if (!byConf[c]) continue;
    const x = byConf[c];
    const hr = x.w + x.l > 0 ? x.w / (x.w + x.l) : 0;
    const roi = x.net / (x.count * STAKE);
    const sign = x.net >= 0 ? '+' : '';
    console.log(
      `${c.padEnd(10)} | ${String(x.count).padEnd(5)} | ${(x.w+'-'+x.l+'-'+x.p).padEnd(11)} | ${(hr*100).toFixed(1).padStart(5)}% | ${(sign+'$'+x.net.toFixed(2)).padStart(7)} | ${(roi*100).toFixed(1).padStart(5)}%`
    );
  }

  // ── CROSS-TAB: confidence × type — find the exact bleeding cell ──
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('CROSS-TAB: CONFIDENCE × TYPE  (where does money go to die?)');
  console.log('═══════════════════════════════════════════════════════════');
  const xtab = {};
  for (const b of regimes.baseline.bets) {
    const key = `${b.confidence}|${b.type}`;
    xtab[key] = xtab[key] || { w: 0, l: 0, p: 0, net: 0, count: 0 };
    const pl = settle(b, STAKE);
    if (pl === null) continue;
    xtab[key].count++;
    xtab[key].net += pl;
    if (b.result.outcome === 'win')  xtab[key].w++;
    if (b.result.outcome === 'loss') xtab[key].l++;
    if (b.result.outcome === 'push' || b.result.outcome === 'void') xtab[key].p++;
  }
  console.log('Confidence | Type     | Count | W-L      | Hit % | Net');
  console.log('-----------|----------|-------|----------|-------|---------');
  const cOrder = ['best-bet', 'high', 'medium', 'lean', 'coin-flip'];
  const tOrder = ['ml', 'spread', 'total', 'prop'];
  for (const c of cOrder) for (const t of tOrder) {
    const x = xtab[`${c}|${t}`];
    if (!x || x.count === 0) continue;
    const hr = x.w + x.l > 0 ? x.w / (x.w + x.l) : 0;
    const sign = x.net >= 0 ? '+' : '';
    console.log(
      `${c.padEnd(10)} | ${t.padEnd(8)} | ${String(x.count).padEnd(5)} | ${(x.w+'-'+x.l).padEnd(8)} | ${(hr*100).toFixed(0).padStart(4)}% | ${(sign+'$'+x.net.toFixed(2)).padStart(7)}`
    );
  }

  // ── REGIME D: data-driven filter (skip the bleeding intersections) ──
  // Surprise from above: props are -33% ROI; ml/spread/total are +EV.
  // Build a regime that skips ALL props and keeps ml/spread/total.
  const dataDriven = r2Straight.filter(b => b.type !== 'prop');
  const dResult = tally(dataDriven, STAKE);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('REGIME D: NO PROPS — only ml/spread/total');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  ${dResult.total} bets   ${dResult.w}W-${dResult.l}L-${dResult.p}V   ${(dResult.hitRate*100).toFixed(1)}% hit rate`);
  const dSign = dResult.net >= 0 ? '+' : '';
  console.log(`  Net: ${dSign}$${dResult.net.toFixed(2)}   ROI: ${((dResult.net/(dResult.total*STAKE))*100).toFixed(1)}%`);
  console.log(`  Delta vs baseline: ${dSign}$${(dResult.net - results.baseline.net).toFixed(2)}`);

  // ── REGIME E: props only, skip "high" confidence (most-bleeding label) ──
  // Among props, "high" hits ~30% and bleeds the most. Keep best-bet + lean
  // + medium props (lower confidence ≠ worse, per the data).
  const propsExHigh = r2Straight.filter(b =>
    b.type === 'prop' && b.confidence !== 'high'
  );
  const peResult = tally(propsExHigh, STAKE);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('REGIME E: PROPS, EXCLUDING "high" CONFIDENCE');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  ${peResult.total} bets   ${peResult.w}W-${peResult.l}L-${peResult.p}V   ${(peResult.hitRate*100).toFixed(1)}% hit rate`);
  const peSign = peResult.net >= 0 ? '+' : '';
  console.log(`  Net: ${peSign}$${peResult.net.toFixed(2)}   ROI: ${peResult.total > 0 ? ((peResult.net/(peResult.total*STAKE))*100).toFixed(1) : 'N/A'}%`);

  // ── REGIME F: COMBINED — no high props, keep ml/spread/total ──
  const combined = r2Straight.filter(b =>
    b.type !== 'prop' || b.confidence !== 'high'
  );
  const cResult = tally(combined, STAKE);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('REGIME F: COMBINED — drop "high" props, keep everything else');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  ${cResult.total} bets   ${cResult.w}W-${cResult.l}L-${cResult.p}V   ${(cResult.hitRate*100).toFixed(1)}% hit rate`);
  const cSign = cResult.net >= 0 ? '+' : '';
  console.log(`  Net: ${cSign}$${cResult.net.toFixed(2)}   ROI: ${((cResult.net/(cResult.total*STAKE))*100).toFixed(1)}%`);
  console.log(`  Delta vs baseline: ${cSign}$${(cResult.net - results.baseline.net).toFixed(2)}`);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('VERDICT');
  console.log('═══════════════════════════════════════════════════════════');
  const b = results.baseline, s = results.skipOnly, e = results.skipEdge;
  console.log(`Baseline:    ${b.total} bets, $${b.net} net   (${((b.net/(b.total*STAKE))*100).toFixed(1)}% ROI)`);
  console.log(`Skip-Only:   ${s.total} bets, $${s.net} net   (${s.total > 0 ? ((s.net/(s.total*STAKE))*100).toFixed(1) : 'N/A'}% ROI)   — saved ${b.total - s.total} bets`);
  console.log(`Skip+Edge:   ${e.total} bets, $${e.net} net   (${e.total > 0 ? ((e.net/(e.total*STAKE))*100).toFixed(1) : 'N/A'}% ROI)   — saved ${b.total - e.total} bets`);
  console.log('');
  const skipDelta = s.net - b.net;
  const edgeDelta = e.net - b.net;
  console.log(`Skip-Only delta vs baseline: ${skipDelta >= 0 ? '+' : ''}$${skipDelta.toFixed(2)}`);
  console.log(`Skip+Edge delta vs baseline: ${edgeDelta >= 0 ? '+' : ''}$${edgeDelta.toFixed(2)}`);
  console.log(`No-props delta vs baseline:  ${dResult.net - b.net >= 0 ? '+' : ''}$${(dResult.net - b.net).toFixed(2)}`);
  console.log(`Combined delta vs baseline:  ${cResult.net - b.net >= 0 ? '+' : ''}$${(cResult.net - b.net).toFixed(2)}`);
}

main();
