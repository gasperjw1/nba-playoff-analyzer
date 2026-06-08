// ============================================================
// USER-ALIGNED BETS CLI — generate parlays matching house style
// ============================================================
// Usage:
//   node test-user-aligned-bets.js --game SAS-NYK-G3
//   node test-user-aligned-bets.js --game SAS-NYK-G3 --spread -2.5 --total 216.5
//
// Pipeline:
//   1. Load USER_HOUSE_STYLE (encoded patterns from your 9-1 record)
//   2. Load latest CHS Lab Ledger snapshot for the game (player projections)
//   3. Run Council v1 to get aggregate edge + side
//   4. Hand both to user-aligned-synthesizer
//   5. Print top 5 parlay candidates with archetype + reasoning + score
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const args = process.argv.slice(2);
function getArg(flag) { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; }
const gameRef = getArg('--game');
const overrideSpread = getArg('--spread');
const overrideTotal = getArg('--total');

if (!gameRef) {
  console.error('Usage: node test-user-aligned-bets.js --game <SERIES-GN> [--spread X --total X]');
  process.exit(1);
}
const m = gameRef.match(/^([A-Z]{2,4}-[A-Z]{2,4})-G(\d+)$/);
if (!m) { console.error('Invalid --game format. Use SAS-NYK-G3'); process.exit(1); }
const seriesId = m[1], gameNum = parseInt(m[2]);

// Load data
const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const ctx = vm.createContext({
  console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat,
  isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error,
  module: { exports: {} }, exports: {},
});
[
  'js/data/constants.js',
  'js/data/series-data.js',
  'js/data/chs-lab-ledger.js',
  'js/data/user-house-style.js',
  'js/data/qualitative-signals.js',
].forEach(f => {
  vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, f), 'utf8')), ctx);
});

const SERIES_DATA = ctx.SERIES_DATA;
const CHS_LAB_LEDGER = ctx.CHS_LAB_LEDGER;
const USER_HOUSE_STYLE = ctx.USER_HOUSE_STYLE;

const series = SERIES_DATA.find(s => s.id === seriesId);
if (!series) { console.error(`Series ${seriesId} not found`); process.exit(1); }
const game = series.games && series.games[gameNum - 1];
if (!game) { console.error(`Game ${gameRef} not found`); process.exit(1); }

// Build market
function parseSpread(str) { const x = str && str.match(/(-?\d+\.?\d*)/); return x ? parseFloat(x[1]) : null; }
function parseTotal(str) { const x = str && str.match(/(\d+\.?\d*)/); return x ? parseFloat(x[1]) : null; }
const market = {
  spread: overrideSpread ? parseFloat(overrideSpread) : (game.prediction ? parseSpread(game.prediction.spread) : -3),
  total:  overrideTotal  ? parseFloat(overrideTotal)  : (game.prediction ? parseTotal(game.prediction.ou) : 215),
};

// Run Council v1 for aggregate edge
const council = require('./js/engine/council.js');
const getCal = (sigType) => {
  const tab = ctx.SIGNAL_CALIBRATION || {};
  return (tab[sigType] || tab.default || { weight: 0.5 }).weight;
};
const councilOutput = council.runCouncil(series, gameNum, market, SERIES_DATA, ctx.QUALITATIVE_SIGNALS || [], [], getCal);

// Get latest CHS Lab snapshot for this game
const chsEntry = CHS_LAB_LEDGER.find(e => e.series === seriesId && e.game === gameNum);
if (!chsEntry || !chsEntry.candidates) {
  console.error(`No CHS Lab snapshot found for ${gameRef}. Run: node test-chs-lab-ledger-update.js --snapshot`);
  process.exit(1);
}
const projections = chsEntry.candidates;

// Run synthesizer
const synth = require('./js/engine/user-aligned-synthesizer.js');
const recommendations = synth.generateUserAlignedBets(
  series, gameNum, market, councilOutput, projections, SERIES_DATA, USER_HOUSE_STYLE
);

// ──────────────────────────────────────────────────────────────────
// Pretty print
// ──────────────────────────────────────────────────────────────────
console.log('');
console.log('═══════════════════════════════════════════════════════════════════');
console.log(`  USER-ALIGNED BET RECOMMENDATIONS — ${seriesId} G${gameNum}`);
console.log(`  ${series.awayTeam.abbr} @ ${series.homeTeam.abbr}`);
console.log(`  Market: ${series.homeTeam.abbr} ${market.spread} / O/U ${market.total}`);
console.log(`  Council aggregate: ${councilOutput.synthesis.recommendedSide} edge ${(Math.abs(councilOutput.synthesis.aggregateEdge) * 100).toFixed(1)}%`);
console.log(`  Your record: 9-1 (90%), +$820 on $500 staked, +164% ROI`);
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');

if (!recommendations.length) {
  console.log('  No recommendations matched your house style for this game.');
  console.log('  (Most likely: no candidates passed the 75% minutes-security gate)');
  process.exit(0);
}

recommendations.forEach((rec, i) => {
  const archetype = USER_HOUSE_STYLE.archetypes.find(a => a.id === rec.archetype);
  console.log(`▸ RECOMMENDATION ${i + 1} — Score: ${rec.score}`);
  console.log(`  Archetype: ${archetype.id}`);
  console.log(`  Description: ${archetype.description}`);
  console.log(`  Legs (${rec.legs.length}):`);
  rec.legs.forEach((l, j) => {
    const minHist = l.minutesSecurity.history ? `[${l.minutesSecurity.history.join(',')}]` : '';
    console.log(`    ${j + 1}. ${l.player.padEnd(28)} ${l.stat.toUpperCase().padEnd(7)} ${l.direction.toUpperCase().padEnd(6)} ${l.line}  | role=${l.role}, minSec=${(l.minutesSecurity.security * 100).toFixed(0)}% ${minHist}`);
  });
  console.log(`  Cross-team: ${rec.crossTeam ? 'YES' : 'no'}`);
  console.log(`  Stake: $${rec.stake}`);
  console.log(`  Reasoning: ${rec.reasoning}`);
  if (rec.bookLineNotes && rec.bookLineNotes.length) {
    console.log(`  ⚠ Book line notes:`);
    rec.bookLineNotes.forEach(n => console.log(`     • ${n}`));
  }
  console.log('');
});

console.log('───────────────────────────────────────────────────────────────────');
console.log('  NOTES');
console.log('───────────────────────────────────────────────────────────────────');
console.log('  • These are CANDIDATE parlays that match your winning archetypes');
console.log('  • All legs pass the minutes-security gate (the kill switch)');
console.log('  • Book line floor warnings flagged where applicable');
console.log('  • Verify exact lines on your book; juice estimates approximate');
console.log('');
