// ============================================================
// PLAYOFF RUN — SOLVER AUDIT (Phase 2 gate)
// ============================================================
// Run: node backtest-solver-audit.js  [--n 200]
//
// Design law #6: anti-solvability is a TESTED property. This audit
// searches for a STATIC coaching policy (fixed minutes weighting, fixed
// depth, fixed coverage stance — deliberately blind to evidence) that
// beats the adaptive coach-AI baseline for a mid-seed team. If one
// exists, the game has a degenerate meta and the mechanics are mispriced.
//
// Method: DEN (mid seed) as the audited team; N seeded brackets per
// policy with PAIRED seeds (same schedule of randomness for every policy)
// so differences are policy-driven, not luck. A static policy FAILS the
// audit if it exceeds the adaptive baseline's title rate by more than the
// paired-noise threshold.
//
// Scope note: this audits static PLAN policies. Interactive bait-loop
// audits (decoy lineups exploiting low-adjust coaches beyond their
// intended cost) land with Phase 3, when user-shaped multi-game plans
// exist to script.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const N = (() => { const i = process.argv.indexOf('--n'); return i >= 0 ? parseInt(process.argv[i + 1]) : 200; })();
const TEAM = 'DEN';
const THRESHOLD = 0.025;   // max allowed CONFIRMED title-rate excess over adaptive

const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const ctx = vm.createContext({
  console, Math, Array, Object, Set, Map, JSON,
  parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error,
});
const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), ctx, { filename: rel });
['js/data/constants.js', 'js/data/series-data.js',
 'js/engine/chemistry.js', 'js/game/data/game-constants.js', 'js/game/data/coach-profiles.js', 'js/game/data/team-db.js',
 'js/game/engine/matchup-factory.js', 'js/game/engine/capacity.js', 'js/game/engine/regime.js',
 'js/game/engine/trajectory.js', 'js/game/engine/coach-ai.js', 'js/game/engine/game-sim.js',
 'js/game/engine/injury-gen.js', 'js/game/run-state.js'].forEach(load);

const DB = ctx.GAME_TEAM_DB;

// ── Static policy → planFn ─────────────────────────────────────
// A static policy ignores evidence entirely: same minutes weighting and
// coverage stance every game (only availability is respected — that's
// physics, not adaptation).
function staticPlanFn(policy) {
  return function (abbr, sctx, gameState) {
    const team = DB[abbr];
    const opp = sctx.home.abbr === abbr ? sctx.away : sctx.home;
    const out = new Set(gameState.unavailable || []);
    const pool = team.players.filter(p =>
      p.baseRating > 0 && p.initialStatus !== 'dnp' && !out.has(p.name));
    const ranked = pool.slice().sort((a, b) => b.baseRating - a.baseRating).slice(0, policy.depth);
    const weights = ranked.map(p => Math.pow(Math.max(1, p.baseRating), policy.skew));
    const wSum = weights.reduce((a, b) => a + b, 0);
    const rotation = ranked.map((p, i) => ({ player: p, minutes: 240 * weights[i] / wSum }));
    const star = opp.players.filter(p => p.initialStatus !== 'dnp')
      .reduce((a, b) => (b.ppg > a.ppg ? b : a));
    return {
      rotation,
      unavailable: [...out],
      fatigue: gameState.fatigue || {},
      doubleTarget: policy.alwaysDouble ? star.name : null,
    };
  };
}

function titleRate(planFn, label, seedBase, n) {
  let titles = 0;
  for (let i = 0; i < n; i++) {
    const res = ctx.runFullBracket(DB, {
      seed: seedBase + i,
      userTeam: planFn ? TEAM : null,
      planFn: planFn || undefined,
    });
    if (res.champion === TEAM) titles++;
  }
  const rate = titles / n;
  console.log('  ' + label.padEnd(42) + (100 * rate).toFixed(1) + '%');
  return rate;
}

console.log(`Solver audit: ${TEAM}, ${N} paired brackets per policy\n`);
console.log('Adaptive baseline (coach-AI):');
const adaptive = titleRate(null, 'adaptive', 50000, N);

// Policy grid: archetypal extremes + a spread of random configs.
const seedRng = ctx.gameCreateRNG(99);
const policies = [
  { name: 'heavy-starters (skew 3, depth 7)', skew: 3.0, depth: 7, alwaysDouble: false },
  { name: 'deep-bench (skew 0.5, depth 10)', skew: 0.5, depth: 10, alwaysDouble: false },
  { name: 'always-double',                    skew: 1.5, depth: 9, alwaysDouble: true },
  { name: 'heavy + always-double',            skew: 3.0, depth: 7, alwaysDouble: true },
];
for (let i = 0; i < 12; i++) {
  policies.push({
    name: `random-${i}`,
    skew: 0.5 + seedRng() * 3.0,
    depth: 7 + Math.floor(seedRng() * 4),
    alwaysDouble: seedRng() < 0.5,
  });
}

console.log('\nSearch phase (static policies):');
let best = null, bestRate = -1;
policies.forEach(p => {
  const rate = titleRate(staticPlanFn(p), p.name, 50000, N);
  if (rate > bestRate) { bestRate = rate; best = p; }
});
console.log(`\nSearch winner: ${best.name} (+${(100 * (bestRate - adaptive)).toFixed(1)}pp on search seeds)`);

// ── Confirmation phase ─────────────────────────────────────────
// The max over ~16 noisy estimates is selection-biased upward (the
// Miller-Sanjurjo lesson applied to ourselves). Verdict comes ONLY from
// re-testing the search winner against adaptive on FRESH seeds at 2x N.
console.log('\nConfirmation (fresh seeds, 2x sample):');
const adaptive2 = titleRate(null, 'adaptive (confirm)', 90000, 2 * N);
const best2 = titleRate(staticPlanFn(best), best.name + ' (confirm)', 90000, 2 * N);
const confirmedExcess = best2 - adaptive2;

console.log(`\nConfirmed excess: ${confirmedExcess >= 0 ? '+' : ''}${(100 * confirmedExcess).toFixed(1)}pp (threshold +${(100 * THRESHOLD).toFixed(1)}pp)`);
console.log('\n' + '='.repeat(60));
console.log(confirmedExcess <= THRESHOLD
  ? 'SOLVER AUDIT: PASS — no static policy dominates adaptive coaching'
  : `SOLVER AUDIT: FAIL — ${best.name} confirmed at +${(100 * confirmedExcess).toFixed(1)}pp over adaptive`);
console.log('='.repeat(60));
process.exit(confirmedExcess > THRESHOLD ? 1 : 0);
