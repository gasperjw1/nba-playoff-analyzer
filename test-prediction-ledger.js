// ============================================================
// PREDICTION LEDGER CLI — the learning loop
// ============================================================
// Usage:
//   node test-prediction-ledger.js --record --game SAS-NYK-G2 --spread -5.5 --total 214.5
//   node test-prediction-ledger.js --settle --game SAS-NYK-G2 --home-score 95 --away-score 105
//   node test-prediction-ledger.js --report
//   node test-prediction-ledger.js --calibration   # show empirical hit rates per agent
//
// The ledger persists in js/data/prediction-ledger.js (appended via this CLI).
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const args = process.argv.slice(2);
function getArg(flag) { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; }
const mode = args.includes('--record') ? 'record'
           : args.includes('--settle') ? 'settle'
           : args.includes('--report') ? 'report'
           : args.includes('--calibration') ? 'calibration'
           : null;

if (!mode) {
  console.error('Usage: node test-prediction-ledger.js [--record|--settle|--report|--calibration] --game <SERIES-GN> [--spread X.X] [--total X.X] [--home-score N --away-score N]');
  process.exit(1);
}

// Load data + modules
const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const ctx = vm.createContext({
  console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat,
  isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error,
  module: { exports: {} }, exports: {},
});
['js/data/constants.js', 'js/data/series-data.js', 'js/data/qualitative-signals.js',
 'js/data/external-research.js', 'js/data/signal-calibration.js',
 'js/data/prediction-ledger.js'].forEach(f => {
  vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, f), 'utf8')), ctx);
});
const council = require('./js/engine/council.js');
const ledgerMod = require('./js/data/prediction-ledger.js');

const SERIES_DATA = ctx.SERIES_DATA;
const QUALITATIVE_SIGNALS = ctx.QUALITATIVE_SIGNALS;
const EXTERNAL_RESEARCH = ctx.EXTERNAL_RESEARCH || [];
const getCalibrationWeight = ctx.getCalibrationWeight || (() => 1.0);

// Read existing ledger from file (parse the const declaration)
function loadLedgerFromFile() {
  const src = fs.readFileSync(path.join(__dirname, 'js/data/prediction-ledger.js'), 'utf8');
  const match = src.match(/const PREDICTION_LEDGER = (\[[\s\S]*?\]);/);
  if (!match) return [];
  try { return eval(match[1]); } catch (e) { console.error('Failed to parse ledger:', e); return []; }
}
function writeLedgerToFile(ledger) {
  const src = fs.readFileSync(path.join(__dirname, 'js/data/prediction-ledger.js'), 'utf8');
  const newSrc = src.replace(
    /const PREDICTION_LEDGER = \[[\s\S]*?\];/,
    `const PREDICTION_LEDGER = ${JSON.stringify(ledger, null, 2)};`
  );
  fs.writeFileSync(path.join(__dirname, 'js/data/prediction-ledger.js'), newSrc);
}

const currentLedger = loadLedgerFromFile();

// ─── RECORD ──────────────────────────────────────────────────────
if (mode === 'record') {
  const gameRef = getArg('--game');
  const overrideSpread = getArg('--spread');
  const overrideTotal = getArg('--total');
  if (!gameRef) { console.error('--game required'); process.exit(1); }
  const m = gameRef.match(/^([A-Z]{2,4}-[A-Z]{2,4})-G(\d+)$/);
  if (!m) { console.error('Bad --game format'); process.exit(1); }
  const seriesId = m[1], gameNum = parseInt(m[2]);
  const series = SERIES_DATA.find(s => s.id === seriesId);
  if (!series) { console.error(`Series ${seriesId} not found`); process.exit(1); }
  const game = series.games && series.games[gameNum - 1];
  if (!game) { console.error(`Game ${gameRef} not found`); process.exit(1); }

  function parseSpread(str) { const x = str && str.match(/(-?\d+\.?\d*)/); return x ? parseFloat(x[1]) : null; }
  function parseTotal(str) { const x = str && str.match(/(\d+\.?\d*)/); return x ? parseFloat(x[1]) : null; }
  const market = {
    spread: overrideSpread ? parseFloat(overrideSpread) : (game.prediction ? parseSpread(game.prediction.spread) : -3),
    total: overrideTotal ? parseFloat(overrideTotal) : (game.prediction ? parseTotal(game.prediction.ou) : 215),
  };

  const result = council.runCouncil(series, gameNum, market, SERIES_DATA, QUALITATIVE_SIGNALS, EXTERNAL_RESEARCH, getCalibrationWeight);
  const entry = ledgerMod.recordPrediction(result, series, gameNum, market);

  // Append to ledger
  const existing = currentLedger.find(e => e.id === entry.id);
  if (existing) {
    console.log(`⚠ Replacing existing prediction for ${entry.id}`);
    const idx = currentLedger.indexOf(existing);
    currentLedger[idx] = entry;
  } else {
    currentLedger.push(entry);
  }
  writeLedgerToFile(currentLedger);
  console.log(`✓ Recorded prediction: ${entry.id}`);
  console.log(`  Council: ${entry.councilVerdict.recommendedSide} edge ${(Math.abs(entry.councilVerdict.aggregateEdge) * 100).toFixed(1)}%, convergence ${entry.councilVerdict.convergence.agreeing}/${entry.councilVerdict.convergence.total}`);
}

// ─── SETTLE ──────────────────────────────────────────────────────
if (mode === 'settle') {
  const gameRef = getArg('--game');
  const homeScore = parseInt(getArg('--home-score'));
  const awayScore = parseInt(getArg('--away-score'));
  if (!gameRef || isNaN(homeScore) || isNaN(awayScore)) {
    console.error('--game --home-score --away-score required'); process.exit(1);
  }
  const entry = currentLedger.find(e => e.id.startsWith(gameRef));
  if (!entry) { console.error(`No prediction found for ${gameRef}`); process.exit(1); }

  const winner = homeScore > awayScore ? entry.homeTeam : entry.awayTeam;
  const settled = ledgerMod.settlePrediction(entry, { homeScore, awayScore, winner });
  writeLedgerToFile(currentLedger);
  console.log(`✓ Settled: ${settled.id}`);
  console.log(`  Final: ${entry.homeTeam} ${homeScore} - ${awayScore} ${entry.awayTeam}`);
  console.log(`  Spread cover: ${settled.evaluation.spreadCover}`);
  console.log(`  Council was: ${settled.evaluation.councilSpreadCorrect ? '✓ CORRECT' : '✗ WRONG'}`);
  console.log(`  Per-agent accuracy:`);
  settled.evaluation.agentEvaluations.forEach(ae => {
    if (ae.correct === null) return;
    console.log(`    ${ae.agent.padEnd(15)} → ${ae.side.padEnd(8)} ${ae.correct ? '✓' : '✗'}`);
  });
}

// ─── REPORT ──────────────────────────────────────────────────────
if (mode === 'report') {
  console.log('\n═══════════ PREDICTION LEDGER ═══════════');
  console.log(`Total entries: ${currentLedger.length} (settled: ${currentLedger.filter(e => e.outcome).length}, pending: ${currentLedger.filter(e => !e.outcome).length})\n`);
  currentLedger.forEach(e => {
    const status = e.outcome ? `${e.outcome.homeScore}-${e.outcome.awayScore} (${e.evaluation.spreadCover} cover)` : 'PENDING';
    const correct = e.evaluation ? (e.evaluation.councilSpreadCorrect ? '✓' : '✗') : '?';
    console.log(`  ${e.id}: Council=${e.councilVerdict.recommendedSide} edge ${(Math.abs(e.councilVerdict.aggregateEdge) * 100).toFixed(0)}% | Result=${status} ${correct}`);
  });
}

// ─── CALIBRATION ─────────────────────────────────────────────────
if (mode === 'calibration') {
  const cal = ledgerMod.computeCalibrationFromLedger(currentLedger);
  console.log('\n═══════════ EMPIRICAL CALIBRATION ═══════════');
  console.log(`Settled games: ${cal.totalGames}`);
  if (cal.overallCouncilHitRate !== null) {
    console.log(`Council overall hit rate: ${(cal.overallCouncilHitRate * 100).toFixed(1)}%`);
  }
  console.log('\nPer-agent hit rate (with Bayesian shrinkage toward 50%):');
  Object.entries(cal.perAgent).forEach(([agent, stats]) => {
    console.log(`  ${agent.padEnd(15)} ${stats.correct}/${stats.total} = ${(stats.hitRate * 100).toFixed(1)}% (shrunk: ${(stats.shrunkHitRate * 100).toFixed(1)}%)`);
  });
  console.log('\nRecommendation: when sampleSize per agent reaches 30+, update SIGNAL_CALIBRATION weights to match shrunk hit rates × 2 (so 70% hit rate → weight 0.70, etc.)');
}
