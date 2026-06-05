// ============================================================
// COUNCIL CLI — run multi-agent deliberation for any game
// ============================================================
// Usage:
//   node test-council.js --game SAS-NYK-G2
//   node test-council.js --game SAS-NYK-G2 --spread -5.5 --total 214.5
//   node test-council.js --game SAS-NYK-G2 --json     (machine-readable output)
//
// Loads SERIES_DATA + qualitative signals, then runs all 8 agents and
// the synthesizer. Prints a structured deliberation report.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const args = process.argv.slice(2);
function getArg(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : null;
}
const gameRef = getArg('--game'); // e.g. "SAS-NYK-G2"
const overrideSpread = getArg('--spread');
const overrideTotal = getArg('--total');
const jsonOut = args.includes('--json');

if (!gameRef) {
  console.error('Usage: node test-council.js --game <SERIES-GN> [--spread X.X] [--total X.X] [--json]');
  process.exit(1);
}

const m = gameRef.match(/^([A-Z]{2,4}-[A-Z]{2,4})-G(\d+)$/);
if (!m) {
  console.error('Invalid --game format. Use e.g. SAS-NYK-G2');
  process.exit(1);
}
const seriesId = m[1];
const gameNum = parseInt(m[2]);

// Load data files via VM (same pattern as test-projections.js)
const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const ctx = vm.createContext({
  console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat,
  isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error,
  module: { exports: {} }, exports: {},
});
vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, 'js/data/constants.js'), 'utf8')), ctx);
vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, 'js/data/series-data.js'), 'utf8')), ctx);

// Load qualitative signals
const qualSrc = fs.readFileSync(path.join(__dirname, 'js/data/qualitative-signals.js'), 'utf8');
vm.runInContext(toVar(qualSrc), ctx);

// Load external research (web-sourced findings)
const externalSrc = fs.readFileSync(path.join(__dirname, 'js/data/external-research.js'), 'utf8');
vm.runInContext(toVar(externalSrc), ctx);

// Load the council module
const council = require('./js/engine/council.js');

const SERIES_DATA = ctx.SERIES_DATA;
const QUALITATIVE_SIGNALS = ctx.QUALITATIVE_SIGNALS;
const EXTERNAL_RESEARCH = ctx.EXTERNAL_RESEARCH || [];
const series = SERIES_DATA.find(s => s.id === seriesId);
if (!series) {
  console.error(`Series not found: ${seriesId}`);
  process.exit(1);
}
const game = series.games && series.games[gameNum - 1];
if (!game) {
  console.error(`Game not found: ${seriesId} G${gameNum}`);
  process.exit(1);
}

// Build market object from game.prediction + overrides
function parseSpread(str) {
  const m = str && str.match(/(-?\d+\.?\d*)/);
  return m ? parseFloat(m[1]) : null;
}
function parseTotal(str) {
  const m = str && str.match(/(\d+\.?\d*)/);
  return m ? parseFloat(m[1]) : null;
}
function parseML(str) {
  const m = str && str.match(/([+-]\d+)\s*\/\s*([+-]?\d+)/);
  return m ? { home: parseInt(m[1]), away: parseInt(m[2]) } : null;
}
const market = {
  spread: overrideSpread ? parseFloat(overrideSpread) : (game.prediction ? parseSpread(game.prediction.spread) : -3),
  total: overrideTotal ? parseFloat(overrideTotal) : (game.prediction ? parseTotal(game.prediction.ou) : 215),
  ml: game.prediction ? parseML(game.prediction.moneyline) : { home: -150, away: +130 },
};

const result = council.runCouncil(series, gameNum, market, SERIES_DATA, QUALITATIVE_SIGNALS, EXTERNAL_RESEARCH);

if (jsonOut) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// ──────────────────────────────────────────────────────────────────
// Pretty print
// ──────────────────────────────────────────────────────────────────

function bar(side, edge) {
  const len = Math.round(Math.abs(edge) * 20);
  const fill = '█'.repeat(len);
  return side === 'home' ? `← ${fill}` : side === 'away' ? `${fill} →` : '·';
}

console.log('');
console.log('═══════════════════════════════════════════════════════════════════');
console.log(`  THE COUNCIL — ${seriesId} G${gameNum}`);
console.log(`  ${series.awayTeam.abbr} @ ${series.homeTeam.abbr}`);
console.log(`  Market: ${series.homeTeam.abbr} ${market.spread} / O/U ${market.total}`);
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');

result.verdicts.forEach(v => {
  const sideText = v.side === 'home' ? series.homeTeam.abbr : v.side === 'away' ? series.awayTeam.abbr : 'no-edge';
  const edgeText = (Math.abs(v.edge) * 100).toFixed(0) + '%';
  console.log(`▸ ${v.agent.toUpperCase().padEnd(15)} → ${sideText.padEnd(8)} edge ${edgeText.padStart(4)} | conf ${(v.confidence * 100).toFixed(0)}% | n=${v.evidenceCount}`);
  console.log(`  method: ${v.method}`);
  v.evidence.slice(0, 4).forEach(e => {
    console.log(`    • ${e.finding}`);
  });
  if (v.sizingRecommendation) console.log(`    ★ sizing: ${v.sizingRecommendation}`);
  console.log('');
});

console.log('───────────────────────────────────────────────────────────────────');
console.log('  SYNTHESIS');
console.log('───────────────────────────────────────────────────────────────────');
const s = result.synthesis;
const sideText = s.recommendedSide === 'home' ? series.homeTeam.abbr :
  s.recommendedSide === 'away' ? series.awayTeam.abbr : 'NO EDGE';
console.log(`  Aggregate edge:    ${(Math.abs(s.aggregateEdge) * 100).toFixed(1)}% toward ${sideText}`);
console.log(`  Convergence:       ${s.convergence.agreeing} agents agree / ${s.convergence.disagreeing} disagree (of ${s.convergence.total} directional)`);
console.log(`  Synthesis confidence: ${(s.confidence * 100).toFixed(0)}%`);
console.log(`  Risk variance:     ${s.variance.toFixed(2)}`);
console.log(`  Sizing rec:        ${s.sizing}`);
console.log('');

console.log('───────────────────────────────────────────────────────────────────');
console.log('  ADVERSARIAL CHECK');
console.log('───────────────────────────────────────────────────────────────────');
if (result.adversarial.strongestDissent) {
  const d = result.adversarial.strongestDissent;
  console.log(`  Strongest dissent: ${d.argument}`);
  console.log(`  Consensus fragility: ${(result.adversarial.consensusFragility * 100).toFixed(0)}% (% of agents that disagree)`);
  console.log(`  Key dissenting evidence:`);
  d.keyEvidence.forEach(e => console.log(`    • ${e.finding}`));
} else {
  console.log('  All agents converge — no dissenting voice');
}
console.log('');

console.log('───────────────────────────────────────────────────────────────────');
console.log('  BET RECOMMENDATION');
console.log('───────────────────────────────────────────────────────────────────');
if (s.recommendedSide === 'no-edge') {
  console.log('  PASS — no clear edge from the council deliberation');
} else {
  const betSide = s.recommendedSide === 'home'
    ? `${series.homeTeam.abbr} ${market.spread}`
    : `${series.awayTeam.abbr} +${Math.abs(market.spread)}`;
  console.log(`  LEAN ${betSide} — at ${s.sizing}`);
  console.log(`  Edge: ${(Math.abs(s.aggregateEdge) * 100).toFixed(1)}% | Variance: ${s.variance.toFixed(2)}`);
  if (result.adversarial.consensusFragility > 0.4) {
    console.log(`  ⚠ Consensus is fragile (${(result.adversarial.consensusFragility * 100).toFixed(0)}% of agents dissent) — consider stop-loss discipline`);
  }
}
console.log('');
