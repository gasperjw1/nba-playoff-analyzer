// ============================================================
// CF MARGIN UNDERESTIMATE BACKTEST — Phase 73x
// ============================================================
// Hypothesis: the engine systematically underestimates margins in
// Conference Finals games. 3 consecutive CF games (WCF G1 OT,
// WCF G3, ECF G4) had 15+pt margin misses by the engine. If this
// is a systematic bias rather than 3 isolated cases, the engine's
// CF-specific factors (Phase 73 elimination amplifier, multi-
// modifier context architecture) may be over-compressing margins.
//
// Method:
//   1. Walk all settled CF games in SERIES_DATA.
//   2. For each, extract predicted margin (from prediction object)
//      vs actual margin.
//   3. Aggregate: signed margin error, MAE, winner-correct rate,
//      directional bias.
//   4. Compare against R1 + R2 settled games as baseline — is CF
//      really different, or is the engine MAE high across all rounds?
//
// Edge claim (if confirmed): the engine compresses CF margins too
// aggressively. Loosening the compression would improve MAE without
// hurting winner accuracy. Concrete change candidates:
//   - Phase 17 "Playoff Adjustment Factor" (pace 0.95×) may be too
//     aggressive for CF games where talent disparity is wider
//   - Multiplicative context architecture (Phase 51 fatigue/scheme/
//     inconsistency) compounds compression
//   - Phase 73 elimination amplifier widens BANDS but doesn't shift
//     central estimate — may need a CENTRAL bias too
//
// Output: per-game error table + aggregate stats + by-round
// comparison + recommended action.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const sb = { console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error };
vm.createContext(sb);
const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), sb);
[
  'js/data/constants.js', 'js/data/historical.js', 'js/data/news.js',
  'js/data/series-data.js', 'js/data/boxscores.js',
  'js/utils.js',
].forEach(load);
const { SERIES_DATA } = sb;

// ── Collect all settled games with predictions ──────────────────────
const records = [];
SERIES_DATA.forEach(series => {
  if (!series.games || !Array.isArray(series.games)) return;
  series.games.forEach(g => {
    if (!g || !g.winner || !g.prediction) return;
    if (typeof g.homeScore !== 'number' || typeof g.awayScore !== 'number') return;
    const pred = g.prediction;
    if (typeof pred.homeScore !== 'number' || typeof pred.awayScore !== 'number') return;

    const homeAbbr = series.homeTeam && series.homeTeam.abbr;
    const awayAbbr = series.awayTeam && series.awayTeam.abbr;
    const actualMargin = g.homeScore - g.awayScore;  // signed: + home wins
    const predMargin = pred.homeScore - pred.awayScore;
    const predictedWinner = predMargin >= 0 ? homeAbbr : awayAbbr;
    const winnerCorrect = predictedWinner === g.winner;
    // Signed error: positive = engine underpredicted home (or overpredicted away)
    // Better framing: "winner-aware error" — error in the WINNER'S margin
    const winnerActualMargin = g.winner === homeAbbr ? actualMargin : -actualMargin;
    const winnerPredictedMargin = winnerCorrect
      ? Math.abs(predMargin)
      : -Math.abs(predMargin);  // if winner wrong, predicted "by X" for other team
    const winnerError = winnerActualMargin - winnerPredictedMargin;

    records.push({
      round: series.round || 'R?',
      series: series.id,
      game: g.num,
      winner: g.winner,
      actualMargin: Math.abs(actualMargin),
      predMargin: Math.abs(predMargin),
      predictedWinner,
      winnerCorrect,
      winnerError,         // positive = engine underestimated; negative = overestimated
      absError: Math.abs(winnerError),
    });
  });
});

console.log(`\n=== CF MARGIN BACKTEST — 2026 playoffs ===`);
console.log(`Total settled games with predictions: ${records.length}\n`);

// ── Per-round aggregate ─────────────────────────────────────────────
function summarize(subset, label) {
  if (!subset.length) return null;
  const winnerHits = subset.filter(r => r.winnerCorrect).length;
  const meanSignedErr = subset.reduce((s, r) => s + r.winnerError, 0) / subset.length;
  const mae = subset.reduce((s, r) => s + r.absError, 0) / subset.length;
  const median = (() => {
    const sorted = [...subset].map(r => r.winnerError).sort((a, b) => a - b);
    const m = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
  })();
  const underestimates = subset.filter(r => r.winnerError > 0).length;
  return {
    label, n: subset.length, winnerHits, winnerHitPct: winnerHits / subset.length * 100,
    meanSignedErr, medianSignedErr: median, mae,
    underestimateRate: underestimates / subset.length * 100,
  };
}

const r1 = summarize(records.filter(r => r.round === 'R1'), 'R1');
const r2 = summarize(records.filter(r => r.round === 'R2'), 'R2');
const cf = summarize(records.filter(r => r.round === 'CF'), 'CF');
const all = summarize(records, 'ALL');

const fmt = (s) => {
  if (!s) return null;
  return `${s.label.padEnd(4)} n=${String(s.n).padStart(3)} | winner ${s.winnerHits}/${s.n} (${s.winnerHitPct.toFixed(0)}%) | mean signed err ${s.meanSignedErr >= 0 ? '+' : ''}${s.meanSignedErr.toFixed(1)}pt | median ${s.medianSignedErr >= 0 ? '+' : ''}${s.medianSignedErr.toFixed(1)}pt | MAE ${s.mae.toFixed(1)}pt | underestimate-rate ${s.underestimateRate.toFixed(0)}%`;
};

console.log('=== By-round aggregate ===');
[r1, r2, cf, all].forEach(s => { if (s) console.log(fmt(s)); });

// ── CF-specific detail ──────────────────────────────────────────────
console.log('\n=== CF games (detail) ===');
records.filter(r => r.round === 'CF').forEach(r => {
  console.log(`${r.series.padEnd(10)} G${r.game} | ${r.winner} won by ${r.actualMargin} | pred ${r.predictedWinner} by ${r.predMargin} | winner ${r.winnerCorrect ? '✓' : '✗'} | err ${r.winnerError >= 0 ? '+' : ''}${r.winnerError}pt`);
});

// ── Verdict ─────────────────────────────────────────────────────────
console.log('\n=== VERDICT ===');
if (cf && r2) {
  const cfBiased = cf.meanSignedErr > 3 && cf.meanSignedErr > r2.meanSignedErr * 1.5;
  const cfMaeBad = cf.mae > 12;
  if (cfBiased || cfMaeBad) {
    console.log(`✓ CF SHOWS SYSTEMATIC UNDERESTIMATE`);
    console.log(`  CF mean signed err: +${cf.meanSignedErr.toFixed(1)}pt vs R2: +${r2.meanSignedErr.toFixed(1)}pt`);
    console.log(`  CF MAE ${cf.mae.toFixed(1)}pt vs R2 ${r2.mae.toFixed(1)}pt`);
    console.log(`  CF underestimate rate: ${cf.underestimateRate.toFixed(0)}% of games`);
    console.log(`  → Action: investigate engine's CF-specific compression factors.`);
    console.log(`    Candidates: Phase 17 pace adj (0.95×), Phase 51 multiplicative context,`);
    console.log(`    Phase 73 elimination amplifier (widens bands but not central).`);
  } else {
    console.log(`✗ CF MAE comparable to R2; no clear systematic bias`);
    console.log(`  CF MAE ${cf.mae.toFixed(1)}pt vs R2 ${r2.mae.toFixed(1)}pt`);
    console.log(`  Likely small-sample variance, not engine bias.`);
  }
}

// ── Honest caveats ──────────────────────────────────────────────────
console.log('\n=== CAVEATS ===');
console.log(`- CF sample is ${cf ? cf.n : 0} games — small. R3 + Finals will add ~5-8 more.`);
console.log(`- predictions in series-data.js may have been UPDATED after games (some are`);
console.log(`  authored pre-game, some refined post). Treat as the engine's "committed"`);
console.log(`  prediction at the time the daily routine wrote it.`);
console.log(`- 2025 validation file lacks predictions (only outcomes) — can't extend.`);
console.log('');
