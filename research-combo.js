#!/usr/bin/env node
// ============================================================
// research-combo.js — the combined-factor shadow (combo-1), COMBO_SPEC.md
// ============================================================
// Twelve team factors that failed one at a time but, combined, predicted later seasons in the
// exploratory check (MODEL_AUDIT.md, "Cross-level and combined checks"):
//   L1–L4  shooting luck (luck-sched-1)      S1–S7  schedule (luck-sched-1)
//   D1     three-point accuracy matchup (coinflip-1)
// A ridge regression (λ 500, standardized features, no intercept in the prediction) fit once on
// 2021-22 … 2025-26 and frozen in combo-1.json. The prediction is points of the home side's result
// against the closing spread.
//
//   node research-combo.js --fit     fit on 2021-26 and write combo-1.json (done once, at the freeze)
//   node research-combo.js --live    score 2026-27 with the frozen weights (games before tonight only)
// ESPN only; the Odds API key is cleared, nothing spends credits.
// ============================================================
delete process.env.ODDS_API_KEY;
const fs = require('fs');
const path = require('path');
const LS = require('./research-luck-schedule.js');
const { loadOld } = require('./research-situations.js');

const WEIGHTS = path.join(__dirname, 'combo-1.json');
const FEATURES = ['L1', 'L2', 'L3', 'L4', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'D1'];
const LAMBDA = 500, K3 = 300, MIN_PRIOR = 5;
const has = (f) => process.argv.includes(f);
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

// D1 for one season (coinflip-1's definition, written again here): 3 × [home 3PA/g × (home 3P% for − lg + away 3P% allowed − lg)
// − away 3PA/g × (away 3P% for − lg + home 3P% allowed − lg)], shrunk with 300 attempts at the league rate, prior games only.
function d1For(season) {
  const out = new Map(), st = {}, lg = { tpm: 0, tpa: 0 };
  const byDate = new Map();
  for (const g of season.games) (byDate.get(g.date) || byDate.set(g.date, []).get(g.date)).push(g);
  for (const [, tonight] of [...byDate].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const lg3 = lg.tpa ? lg.tpm / lg.tpa : 0.36;
    for (const g of tonight) {
      const H = st[g.home], A = st[g.away];
      if (!H || !A || H.n < MIN_PRIOR || A.n < MIN_PRIOR) continue;
      const p3 = (T) => (T.tpm + K3 * lg3) / (T.tpa + K3), p3a = (T) => (T.otpm + K3 * lg3) / (T.otpa + K3);
      out.set(g.id, 3 * (H.tpa / H.n * (p3(H) - lg3 + p3a(A) - lg3) - A.tpa / A.n * (p3(A) - lg3 + p3a(H) - lg3)));
    }
    for (const g of tonight) for (const [T, own, opp] of [[g.home, g.H, g.A], [g.away, g.A, g.H]]) {
      const x = (st[T] = st[T] || { n: 0, tpm: 0, tpa: 0, otpm: 0, otpa: 0 });
      x.n++; x.tpm += own.tpm; x.tpa += own.tpa; x.otpm += opp.tpm; x.otpa += opp.tpa; lg.tpm += own.tpm; lg.tpa += own.tpa;
    }
  }
  return out;
}

// One season object ({games, close}) → scored rows with the twelve features and resid.
function rowsFor(season, label) {
  const d1 = d1For(season);
  return LS.features(season).filter(r => d1.has(r.id)).map(r => ({ season: label, id: r.id, date: r.date, home: r.home, away: r.away, resid: r.resid,
    L1: r.L1, L2: r.L2, L3: r.L3, L4: r.L4, S1: r.S1, S2: r.S2, S3: r.S3, S4: r.S4, S5: r.S5, S6: r.S6, S7: r.S7, D1: d1.get(r.id) }));
}

function solve(A, b) {
  const n = A.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let j = c; j <= n; j++) M[r][j] -= f * M[c][j]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}

// Ridge on standardized features with an unpenalized intercept → { mean, sd, beta (per feature), intercept }.
function fit(rows) {
  const mu = {}, sd = {};
  for (const f of FEATURES) { mu[f] = mean(rows.map(r => r[f])); sd[f] = Math.sqrt(mean(rows.map(r => (r[f] - mu[f]) ** 2))) || 1; }
  const X = rows.map(r => [1, ...FEATURES.map(f => (r[f] - mu[f]) / sd[f])]), y = rows.map(r => r.resid), k = FEATURES.length + 1;
  const A = Array.from({ length: k }, (_, i) => Array.from({ length: k }, (_, j) => X.reduce((s, x) => s + x[i] * x[j], 0) + (i === j && i > 0 ? LAMBDA : 0)));
  const beta = solve(A, Array.from({ length: k }, (_, i) => X.reduce((s, x, n) => s + x[i] * y[n], 0)));
  return { mean: mu, sd, intercept: beta[0], beta: Object.fromEntries(FEATURES.map((f, i) => [f, beta[i + 1]])) };
}
// The prediction: Σ β × standardized feature (no intercept, so no home lean is carried in).
const predict = (m, r) => FEATURES.reduce((s, f) => s + m.beta[f] * (r[f] - m.mean[f]) / m.sd[f], 0);

function trainingRows() {
  const out = [];
  for (const L of [loadOld(), LS.load()]) for (const [label, s] of Object.entries(L.seasons)) out.push(...rowsFor(s, label));
  return out;
}

// ── live: 2026-27 ───────────────────────────────────────────────────
const LIVE_ODDS = path.join(__dirname, '.cache/espn-nba/live-odds');
const SPEC = { firstDay: '2026-10-20', retireCheckAt: 400, finalRead: 'end of the 2026-27 regular season' };
const implied = (a) => (a < 0 ? -a / (-a + 100) : 100 / (a + 100));
// The close for one game: DraftKings' close, else ESPN BET's (as engine-close-1 and the training data), from ESPN core odds.
async function closeFor(id) {
  const f = path.join(LIVE_ODDS, `odds-${id}.json`);
  let j = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
  if (!j) {
    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/events/${id}/competitions/${id}/odds`, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) return null;
    const raw = await res.json(), ml = (o) => { const v = o && o.moneyLine; if (v == null) return null; const a = typeof v === 'object' ? Number(v.american) : Number(v); return isFinite(a) ? a : null; };
    j = { id, providers: (raw.items || []).map(i => ({ name: i.provider && i.provider.name, closeHome: ml(i.homeTeamOdds && i.homeTeamOdds.close), closeAway: ml(i.awayTeamOdds && i.awayTeamOdds.close), spread: i.spread ?? null })) };
    fs.mkdirSync(LIVE_ODDS, { recursive: true }); fs.writeFileSync(f, JSON.stringify(j));
  }
  const pv = j.providers.find(p => /^draft ?kings$/i.test(p.name || '')) || j.providers.find(p => /^espn bet$/i.test(p.name || ''));
  if (!pv || pv.closeHome == null || pv.closeAway == null || pv.spread == null || Math.abs(pv.closeHome) < 100 || Math.abs(pv.closeAway) < 100) return null;
  if (pv.spread !== 0 && pv.closeHome !== pv.closeAway && (pv.spread < 0) !== (pv.closeHome < pv.closeAway)) return null;
  return { spreadHome: pv.spread, mlHome: pv.closeHome, mlAway: pv.closeAway, book: pv.name };
}

// The live record: every 2026-27 game where both teams have 5+ prior games, with a close, scored by the frozen weights.
async function live() {
  const m = JSON.parse(fs.readFileSync(WEIGHTS, 'utf8'));
  const today = new Date(Date.now() - 5 * 3600e3).toISOString().slice(0, 10);   // ET-ish: completed games are before today
  const yesterday = new Date(Date.parse(today + 'T12:00:00Z') - 864e5).toISOString().slice(0, 10);
  const origLog = console.log; console.log = () => {};
  const games = await require('./research-matchup.js').seasonGames(yesterday);
  console.log = origLog;
  const close = new Map();
  for (const g of games) { const c = await closeFor(g.id); if (c) close.set(g.id, c); }
  const rows = rowsFor({ games, close }, '2026-27').map(r => ({ ...r, pred: predict(m, r) }));
  const n = rows.length;
  console.log(`combo-1 live (frozen ${m.fitted} on ${m.games} games): ${games.length} completed 2026-27 games through ${yesterday}, ${close.size} with a close, ${n} scored`);
  if (n < 30) return console.log('  too few scored games yet');
  const p = rows.map(r => r.pred), y = rows.map(r => r.resid), mp = mean(p), my = mean(y);
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (p[i] - mp) * (y[i] - my); sxx += (p[i] - mp) ** 2; }
  const b = sxy / sxx; let sse = 0; for (let i = 0; i < n; i++) sse += (y[i] - my - b * (p[i] - mp)) ** 2;
  const t = b / Math.sqrt(sse / (n - 2) / sxx);
  const cut = [...p].map(Math.abs).sort((a, c) => a - c)[Math.floor(n * 0.8)]; let w = 0, l = 0;
  for (let i = 0; i < n; i++) if (Math.abs(p[i]) >= cut && y[i] !== 0) (p[i] > 0) === (y[i] > 0) ? w++ : l++;
  const read = n >= SPEC.retireCheckAt && b <= 0 ? 'RETIRE: slope ≤ 0 at the retire check' : `keep logging (retire check at ${SPEC.retireCheckAt} games; final read at the ${SPEC.finalRead})`;
  console.log(`  slope of result on prediction ${b >= 0 ? '+' : ''}${b.toFixed(2)} (t ${t.toFixed(2)}) · top-20% picks against the spread ${w}-${l} (${(100 * w / (w + l)).toFixed(1)}%, break-even 52.4%) · ${read}`);
  return { n, b, t, w, l };
}

module.exports = { FEATURES, d1For, rowsFor, fit, predict, trainingRows, closeFor, live, WEIGHTS, SPEC };
if (require.main === module && has('--live')) live().catch(e => { console.error(e); process.exit(1); });

if (require.main === module && has('--fit')) {
  const rows = trainingRows(), m = fit(rows);
  const out = { spec: 'combo-1', fitted: new Date().toISOString().slice(0, 10), seasons: [...new Set(rows.map(r => r.season))].sort(), games: rows.length, lambda: LAMBDA, features: FEATURES, ...m };
  fs.writeFileSync(WEIGHTS, JSON.stringify(out, null, 1) + '\n');
  console.log(`combo-1 fitted on ${rows.length} games (${out.seasons.join(', ')}); weights (points per sd): ${FEATURES.map(f => `${f} ${m.beta[f] >= 0 ? '+' : ''}${m.beta[f].toFixed(3)}`).join(', ')}; wrote ${path.relative(__dirname, WEIGHTS)}`);
}
