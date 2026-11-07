#!/usr/bin/env node
// ============================================================
// backtest-prop-dist.js — the shape of the props distribution (spec props-2)
// ============================================================
// Same projections as the live props model (backtest-props.js variant
// redist0 = 2026-11-07.noredist, on the leak-free replay); only the
// distribution around each projection changes (js/season/prop-dist.js).
// Parameters are fitted on the early days and judged on the later days.
//
//   node backtest-prop-dist.js          fit on the training days, print the fitted parameters
//                                       and coverage (no holdout results)
//   node backtest-prop-dist.js --score  holdout results — refuses unless the spec files are committed
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const R = require('./replay-season.js');
const B = require('./backtest-props.js');

// ── Pre-registered spec (frozen before the first scored run) ─────────
// Disclosed: the candidates were designed after diagnostics on all 2,239 props-1 rows (holdout
// included): standardized errors had mean ≈ 0 but sd 1.21 for PTS (1.04–1.09 others) and skew
// 0.6–1.2; 12% of players played under 70% of projected minutes; given actual minutes REB/AST/3PM
// were near Poisson (var/mean ≈ 1.1) and PTS/PRA over-dispersed (2.2 / 1.9). The split protects
// the fitted parameters, not the choice of families.
const SPEC = {
  version: 'props-2',
  rows: 'backtest-props.js props-1 variant redist0 (the live model 2026-11-07.noredist), played player-games only',
  train: ['2026-10-20', '2026-10-31'], holdout: ['2026-11-01', '2026-11-06'],
  stats: ['pts', 'reb', 'ast', 'pra', 'tpm'],
  candidates: {
    N: 'normal, sd = props.js propSd (as recorded)',
    'N+': 'normal, sd × c (c = sd of standardized train errors, per stat)',
    'G+': 'gamma, same mean, sd × c',
    C: 'compound: minutes = projected × r (20 train quantile nodes of actual/projected minutes per projected-minutes bucket <20, 20–30, 30+, scaled to mean 1) × gamma with mean rate·minutes and variance φμ + μ²/k (φ, k per stat: least squares of (x − e)² on e, e² at actual minutes on train, no intercept; 1/k < 0 → 0)',
  },
  minutesBuckets: [20, 30], nodes: 20, pmfFloor: 1e-9,
  // Primary: holdout mean log score of the whole-number outcome, PTS and PRA. Adopt the candidate
  // with the best PTS + PRA sum if it beats N on each, and its holdout PRA 90% floor over-rate is
  // within 3 points of its own expected rate. Otherwise keep N. Reported: every stat, calibration at
  // the three ledger lines (nearest the projection, the model's 75% and 90% lines), PIT deciles,
  // game-clustered SEs of log-score differences.
};
const SPEC_FILES = ['backtest-prop-dist.js', 'backtest-props.js', 'replay-season.js', 'js/season/replay-core.js', 'js/season/props.js',
  'js/season/props-ledger.js', 'js/season/prop-dist.js', 'js/season/engine.js', 'js/season/data/season-constants.js', 'js/season/adapters.js',
  'js/season/data/player-priors.js', 'js/season/data/team-ratings.js'];

const has = (f) => process.argv.includes(f);
const inRange = (d, [a, b]) => d >= a && d <= b;

function quantileNodes(xs, n) {
  const s = [...xs].sort((a, b) => a - b);
  const q = Array.from({ length: n }, (_, i) => { const p = (i + 0.5) / n * (s.length - 1), lo = Math.floor(p), f = p - lo; return s[lo] + f * ((s[lo + 1] ?? s[lo]) - s[lo]); });
  const m = q.reduce((a, b) => a + b, 0) / n;
  return q.map(x => x / m);
}
const bucketOf = (min) => min < SPEC.minutesBuckets[0] ? 0 : min < SPEC.minutesBuckets[1] ? 1 : 2;

// Everything fitted from training rows only.
function fit(train) {
  const scale = {}, disp = {};
  for (const s of SPEC.stats) {
    const z = train.map(r => (r.result[s] - r[s]) / r.sd[s]), m = z.reduce((a, b) => a + b, 0) / z.length;
    scale[s] = Math.sqrt(z.reduce((a, b) => a + (b - m) ** 2, 0) / z.length);
    // (x − e)² = φ·e + (1/k)·e², no intercept
    let a11 = 0, a12 = 0, a22 = 0, b1 = 0, b2 = 0;
    for (const r of train) {
      const e = r[s] / r.min * r.result.min;
      if (!(e > 0)) continue;
      const y = (r.result[s] - e) ** 2;
      a11 += e * e; a12 += e ** 3; a22 += e ** 4; b1 += y * e; b2 += y * e * e;
    }
    const det = a11 * a22 - a12 * a12;
    let phi = (b1 * a22 - b2 * a12) / det, invk = (a11 * b2 - a12 * b1) / det;
    if (!(invk > 0)) { invk = 0; phi = b1 / a11; }
    disp[s] = { phi: +phi.toFixed(4), k: invk > 0 ? +(1 / invk).toFixed(2) : Infinity };
  }
  const nodes = [0, 1, 2].map(b => quantileNodes(train.filter(r => bucketOf(r.min) === b).map(r => r.result.min / r.min), SPEC.nodes).map(x => +x.toFixed(4)));
  return { scale, disp, nodes, n: train.length };
}

function distFor(cand, r, s, P) {
  if (cand === 'N') return { family: 'normal', mean: r[s], sd: r.sd[s] };
  if (cand === 'N+') return { family: 'normal', mean: r[s], sd: r.sd[s] * P.scale[s] };
  if (cand === 'G+') return { family: 'gamma', mean: r[s], sd: r.sd[s] * P.scale[s] };
  return { family: 'compound', mean: r[s], min: r.min, nodes: P.nodes[bucketOf(r.min)], phi: P.disp[s].phi, k: P.disp[s].k };
}

function evaluate(ctx, rows, cand, s, P) {
  let ll = 0, n = 0;
  const lines = { proj: { n: 0, over: 0, exp: 0 }, p75: { n: 0, over: 0, exp: 0 }, floor: { n: 0, over: 0, exp: 0 } };
  const pit = Array(10).fill(0), perGame = new Map();
  for (const r of rows) {
    const d = distFor(cand, r, s, P), x = r.result[s];
    const lp = Math.log(Math.max(SPEC.pmfFloor, ctx.propDistPmf(d, x)));
    ll += lp; n++;
    perGame.set(r.game, (perGame.get(r.game) || []).concat(lp));
    // randomized-free mid PIT: (F(x−) + F(x)) / 2
    const Fx = ctx.propDistCdf(d, x + 0.5), Fm = x > 0 ? ctx.propDistCdf(d, x - 0.5) : 0;
    pit[Math.min(9, Math.floor((Fx + Fm) / 2 * 10))]++;
    const L = { proj: Math.round(r[s] - 0.5) + 0.5, p75: ctx.propDistLineAtLeast(d, 0.75), floor: ctx.propDistLineAtLeast(d, 0.9) };
    for (const k of Object.keys(lines)) {
      if (L[k] == null || L[k] < 0.5) continue;
      lines[k].n++; lines[k].exp += ctx.propDistOver(d, L[k]); if (x > L[k]) lines[k].over++;
    }
  }
  for (const v of Object.values(lines)) { v.over = v.n ? v.over / v.n : null; v.exp = v.n ? v.exp / v.n : null; }
  return { ll: ll / n, n, lines, pit: pit.map(c => c / n), perGame };
}

// Game-clustered SE of the mean per-row difference a − b.
function clusteredDiff(a, b) {
  let N = 0, tot = 0;
  const g = [];
  for (const [id, xs] of a.perGame) { const ys = b.perGame.get(id); const d = xs.map((x, i) => x - ys[i]); g.push(d); N += d.length; tot += d.reduce((p, q) => p + q, 0); }
  const mean = tot / N;
  const v = g.reduce((acc, d) => acc + (d.reduce((p, q) => p + q, 0) - d.length * mean) ** 2, 0) * g.length / (g.length - 1);
  return { mean, se: Math.sqrt(v) / N };
}

function specCommitted() {
  try {
    execFileSync('git', ['diff', '--quiet', 'HEAD', '--', ...SPEC_FILES], { cwd: __dirname });
    return execFileSync('git', ['ls-files', '--', ...SPEC_FILES], { cwd: __dirname }).toString().trim().split('\n').filter(Boolean).length === SPEC_FILES.length;
  } catch (e) { return false; }
}

async function main() {
  const ctx = B.loadContext();
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'js/season/prop-dist.js'), 'utf8').replace(/^(const|let) /gm, 'var '), ctx, { filename: 'prop-dist.js' });
  const store = await R.buildStore(ctx, SPEC.holdout[1]);
  await R.loadReports(store);
  const days = R.days(SPEC.train[0], SPEC.holdout[1]).filter(d => (store.schedule[d] || []).length);
  const rows = days.flatMap(d => B.dayRows(ctx, store, d, 'redist0'));
  const byId = new Map(store.regGames.map(g => [g.id, g]));
  for (const id of new Set(rows.map(r => r.game))) ctx.settlePropRows(rows, id, byId.get(id).box, 'replay');
  const played = rows.filter(r => r.result && r.result.played);
  const train = played.filter(r => inRange(r.date, SPEC.train)), hold = played.filter(r => inRange(r.date, SPEC.holdout));
  const P = fit(train);
  console.log(`Props distribution ${SPEC.version}: ${train.length} training player-games (${new Set(train.map(r => r.game)).size} games), ${hold.length} holdout (${new Set(hold.map(r => r.game)).size} games)`);
  console.log(`  fitted on training only — sd scale c: ${JSON.stringify(P.scale, (k, v) => typeof v === 'number' ? +v.toFixed(3) : v)}`);
  console.log(`  dispersion given minutes: ${JSON.stringify(P.disp)}`);
  P.nodes.forEach((ns, b) => console.log(`  minutes ratio nodes, bucket ${['<20', '20–30', '30+'][b]} (n=${train.filter(r => bucketOf(r.min) === b).length}): ${ns.map(x => x.toFixed(2)).join(' ')}`));
  if (!has('--score')) { console.log('No holdout results without --score. Commit the spec, then run --score.'); return; }
  if (!specCommitted()) { console.error(`--score refused: commit ${SPEC_FILES.join(', ')} first`); process.exitCode = 1; return; }

  const cands = Object.keys(SPEC.candidates), res = {};
  for (const [label, set] of [['training (in-sample)', train], ['HOLDOUT', hold]]) {
    console.log(`\n${label}`);
    for (const s of SPEC.stats) for (const cand of cands) {
      const e = evaluate(ctx, set, cand, s, P);
      if (label === 'HOLDOUT') res[`${cand}|${s}`] = e;
      const f = (c) => c.n ? `${(c.over * 100).toFixed(0)}% vs ${(c.exp * 100).toFixed(0)}%` : '—';
      console.log(`  ${s.toUpperCase().padEnd(4)} ${cand.padEnd(3)} log score ${e.ll.toFixed(4)}  proj-line ${f(e.lines.proj)}  75% ${f(e.lines.p75)}  floor ${f(e.lines.floor)} (n${e.lines.floor.n})  PIT ${e.pit.map(p => (p * 100).toFixed(0).padStart(3)).join('')}`);
    }
  }
  console.log('\nHoldout log-score differences (game-clustered SE):');
  for (const s of SPEC.stats) for (const cand of cands.filter(c => c !== 'N')) {
    const d = clusteredDiff(res[`${cand}|${s}`], res[`N|${s}`]);
    console.log(`  ${s.toUpperCase().padEnd(4)} ${cand.padEnd(3)} − N  ${d.mean >= 0 ? '+' : ''}${d.mean.toFixed(4)} ± ${d.se.toFixed(4)}`);
  }
  const sum = (c) => res[`${c}|pts`].ll + res[`${c}|pra`].ll;
  const best = cands.slice().sort((a, b) => sum(b) - sum(a))[0];
  const beatsN = best !== 'N' && res[`${best}|pts`].ll > res['N|pts'].ll && res[`${best}|pra`].ll > res['N|pra'].ll;
  const fl = res[`${best}|pra`].lines.floor, calibrated = fl.n && Math.abs(fl.over - fl.exp) <= 0.03;
  const runner = cands.filter(c => c !== best).sort((a, b) => sum(b) - sum(a))[0];
  for (const s of ['pts', 'pra']) { const d = clusteredDiff(res[`${best}|${s}`], res[`${runner}|${s}`]); console.log(`  ${s.toUpperCase()} ${best} − runner-up ${runner}: ${d.mean >= 0 ? '+' : ''}${d.mean.toFixed(4)} ± ${d.se.toFixed(4)}`); }
  console.log(`\nDecision rule: best PTS+PRA = ${best}; beats N on both: ${beatsN}; PRA floor ${fl.n ? (fl.over * 100).toFixed(1) + '% vs ' + (fl.exp * 100).toFixed(1) + '%' : '—'} (within 3 pts: ${!!calibrated}) → ${beatsN && calibrated ? 'ADOPT ' + best : 'keep N'}`);
  fs.writeFileSync(path.join(__dirname, '.cache', 'prop-dist-fit.json'), JSON.stringify({ spec: SPEC.version, params: P }, null, 1));
}

module.exports = { SPEC, fit, distFor, evaluate, bucketOf };
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
