// ============================================================
// test-baseball.js — baseball scaffold tests
// ============================================================
// Mirrors the test-projections.js vm.runInContext loader. Proves:
//   (1) the MLB data model loads and the documented schema is intact,
//   (2) the baseball-only validator passes on the stub schedule,
//   (3) the EXISTING sport-agnostic engine (edge-detector + risk-controls,
//       built for NBA) runs unchanged on baseball bet objects.
// Crucially, NO NBA data is loaded — the engine is exercised purely on MLB
// inputs, demonstrating the betting/risk layer is sport-independent.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const ctx = vm.createContext({
  console, Math, Array, Object, Set, Map, JSON,
  parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error,
});
const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), ctx, { filename: rel });

// Baseball data + its validator
load('js/baseball/data/mlb-constants.js');
load('js/baseball/data/mlb-schedule.js');
load('js/baseball/data/mlb-bets.js');
load('js/baseball/engine/mlb-validators.js');
load('js/baseball/engine/mlb-projection.js');
// Reused sport-agnostic engine (NBA-era, loaded with NO NBA data)
load('js/engine/edge-detector.js');
load('js/engine/risk-controls.js');

let passed = 0, failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.log('  FAIL: ' + msg); }
}

console.log('TEST 1: MLB data model loads');
assert(Array.isArray(ctx.MLB_SCHEDULE) && ctx.MLB_SCHEDULE.length >= 1, 'MLB_SCHEDULE loads with >=1 game');
const g0 = ctx.MLB_SCHEDULE[0];
assert(g0 && g0.markets && g0.markets.ml, 'game has markets.ml');
assert(g0.markets.runLine && g0.markets.total && Array.isArray(g0.markets.kProps), 'game has run-line, total, and kProps markets (baseball shape, not spread/PRA)');
assert(g0.homePitcher && g0.awayPitcher, 'game has starting-pitcher matchup (the atomic baseball variable)');
assert(typeof ctx.MLB_CURRENT_DATE === 'string', 'MLB_CURRENT_DATE is defined');

console.log('TEST 2: baseball validator passes on the stub schedule');
const errs = ctx.validateMlbSchedule(ctx.MLB_SCHEDULE);
assert(Array.isArray(errs) && errs.length === 0, 'validateMlbSchedule reports no errors: ' + JSON.stringify(errs));

console.log('TEST 3: reused edge-detector classifies a baseball bet');
const cls = ctx.classifyBet(ctx.MLB_BETS[0]);
assert(cls && ['PLACE', 'CAUTION', 'SKIP'].includes(cls.recommendation), 'classifyBet returns a PLACE/CAUTION/SKIP verdict for an MLB bet (got ' + (cls && cls.recommendation) + ')');

console.log('TEST 4: reused risk layer sizes a baseball bet stake');
const dis = ctx.detectMarketDisagreement(0.66, ctx.MLB_BETS[0].americanOdds);
assert(dis && typeof dis.kellyFraction === 'number', 'detectMarketDisagreement returns a numeric kellyFraction for an MLB bet');
const stake = ctx.recommendStake(1000, dis);
assert(stake && typeof stake.recommendedStake === 'number' && stake.recommendedStake > 0, 'recommendStake returns a positive stake for an MLB bet with edge (got ' + (stake && stake.recommendedStake) + ')');

console.log('TEST 5: projection stub is wired (coming-soon, no crash)');
const proj = ctx.projectGame(g0);
assert(proj && proj.status === 'coming-soon', 'projectGame returns coming-soon marker');

console.log('\n============================================================');
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log('============================================================');
process.exit(failed > 0 ? 1 : 0);
