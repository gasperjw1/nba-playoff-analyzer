#!/usr/bin/env node
// ============================================================
// research-engine-close.js — the engine core vs the close, 2021-26 (engine-close-1)
// ============================================================
// Pre-registered in ENGINE_CLOSE_RESEARCH.md (commit 466fce0, before this file was written).
// The engine's past-season walk (research-season-update.js, ENGINE_OUT) joined to ESPN's games
// and closing lines; asks whether the engine's gap from the close predicts the result.
//
//   node research-engine-close.js            the decision table and descriptive checks
//   node research-engine-close.js --check    input checks only (parts add up, closes, healthy flags)
// ESPN caches and Basketball-Reference only; the Odds API key is cleared, nothing spends credits.
// ============================================================
delete process.env.ODDS_API_KEY;
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CACHE = path.join(__dirname, '.cache');
const WALK = path.join(CACHE, 'engine-walk.json');
const OLD = path.join(CACHE, 'espn-nba/old'), HIST = path.join(CACHE, 'espn-nba/hist'), HIST_ODDS = path.join(CACHE, 'espn-nba/hist-odds');
const HCA = 2.0, SIGMA = 12.5, MIN_PRIOR = 5, P3_EDGE = 0.05, P3_TIER = 0.08;
const SEASONS = [2022, 2023, 2024, 2025, 2026];   // Basketball-Reference years: 2021-22 … 2025-26
const has = (f) => process.argv.includes(f);
const B = { GS: 'GSW', NY: 'NYK', SA: 'SAS', NO: 'NOP', UTAH: 'UTA', WSH: 'WAS', BKN: 'BRK', CHA: 'CHO', PHX: 'PHO' };
const br = (a) => B[a] || a;
const label = (t) => `${t - 1}-${String(t).slice(2)}`;
const normalCdf = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
const implied = (a) => (a < 0 ? -a / (-a + 100) : 100 / (a + 100));
const noVig = (h, a) => implied(h) / (implied(h) + implied(a));

// ── inputs ──────────────────────────────────────────────────────────
function walk() {
  if (!fs.existsSync(WALK)) execFileSync('node', [path.join(__dirname, 'research-season-update.js')], { env: { ...process.env, ENGINE_OUT: WALK }, stdio: 'ignore' });
  return JSON.parse(fs.readFileSync(WALK, 'utf8'));
}

// ESPN games 2021-26 with player minutes and the close, keyed by date|home|away in B-Ref codes.
// 2021-23: DraftKings' close field, else its listed line (situ-1). 2023-26: DraftKings' close,
// else ESPN BET's (matchup-1). Lines whose spread favourite contradicts the moneyline are dropped.
function espnGames() {
  const out = new Map(), skipped = { noOdds: 0, badSpread: 0 };
  for (const [dir, odir, old] of [[OLD, OLD, true], [HIST, HIST_ODDS, false]]) {
    for (const f of fs.readdirSync(dir).filter(f => f.startsWith('box-'))) {
      const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      const of = path.join(odir, `odds-${b.id}.json`), o = fs.existsSync(of) ? JSON.parse(fs.readFileSync(of, 'utf8')) : null;
      let close = null;
      if (o) {
        const pv = old ? o.providers.find(p => /^draftkings$/i.test(p.name || ''))
          : o.providers.find(p => /^draftkings$/i.test(p.name || '')) || o.providers.find(p => /^espn bet$/i.test(p.name || ''));
        const mh = pv && (old ? pv.closeHome ?? pv.home : pv.closeHome), ma = pv && (old ? pv.closeAway ?? pv.away : pv.closeAway);
        if (pv && mh != null && ma != null && pv.spread != null && Math.abs(mh) >= 100 && Math.abs(ma) >= 100) {
          if (pv.spread !== 0 && mh !== ma && (pv.spread < 0) !== (mh < ma)) skipped.badSpread++;
          else close = { spreadHome: pv.spread, mlHome: mh, mlAway: ma, book: pv.name };
        } else skipped.noOdds++;
      } else skipped.noOdds++;
      out.set(`${b.date}|${br(b.home)}|${br(b.away)}`, { id: String(b.id), date: b.date, home: b.home, away: b.away, hs: b.hs, as: b.as,
        players: b.players.filter(p => p.min > 0).map(p => ({ id: String(p.id), team: p.team, min: p.min })), close });
    }
  }
  return { games: out, skipped };
}

// Healthy (Q1b): both teams with ≥ MIN_PRIOR games, and each team's top 5 by minutes per game all
// play. Top 5 among players with ≥ 5 games for the team who are still on it: last seen with it, and
// their next appearance (if any) isn't for another team — situ-1's rule.
function healthyFlags(games) {
  const flags = new Map();
  const bySeason = {};
  for (const g of games.values()) { const s = g.date < '2022-07-01' ? 2022 : g.date < '2023-07-01' ? 2023 : g.date < '2024-07-01' ? 2024 : g.date < '2025-07-01' ? 2025 : 2026; (bySeason[s] = bySeason[s] || []).push(g); }
  for (const list of Object.values(bySeason)) {
    list.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1));
    const seen = new Map();
    for (const g of list) for (const p of g.players) (seen.get(p.id) || seen.set(p.id, []).get(p.id)).push([g.date, p.team]);
    const stats = {}, cur = new Map(), teamG = {};
    const byDate = new Map();
    for (const g of list) (byDate.get(g.date) || byDate.set(g.date, []).get(g.date)).push(g);
    for (const [date, tonight] of byDate) {
      for (const g of tonight) {
        const ok = [g.home, g.away].every(t => {
          if ((teamG[t] || 0) < MIN_PRIOR) return false;
          const top5 = [...cur].filter(([p, tm]) => tm === t && stats[p][t].gp >= 5 && !((seen.get(p).find(([d]) => d >= date) || [null, t])[1] !== t))
            .sort((a, b) => stats[b[0]][t].min / stats[b[0]][t].gp - stats[a[0]][t].min / stats[a[0]][t].gp).slice(0, 5);
          const on = new Set(g.players.filter(p => p.team === t).map(p => p.id));
          return top5.length === 5 && top5.every(([p]) => on.has(p));
        });
        flags.set(g.id, ok);
      }
      for (const g of tonight) {
        for (const t of [g.home, g.away]) teamG[t] = (teamG[t] || 0) + 1;
        for (const p of g.players) { const s = ((stats[p.id] = stats[p.id] || {})[p.team] = stats[p.id][p.team] || { gp: 0, min: 0 }); s.gp++; s.min += p.min; cur.set(p.id, p.team); }
      }
    }
  }
  return flags;
}

// ── maths ───────────────────────────────────────────────────────────
// OLS of y on [1, x1..xk]: coefficients and classical standard errors.
function ols(X, y) {
  const n = y.length, k = X[0].length + 1;
  const A = Array.from({ length: k }, () => Array(k).fill(0)), v = Array(k).fill(0);
  for (let i = 0; i < n; i++) { const r = [1, ...X[i]]; for (let a = 0; a < k; a++) { v[a] += r[a] * y[i]; for (let c = 0; c < k; c++) A[a][c] += r[a] * r[c]; } }
  const inv = invert(A), beta = inv.map(row => row.reduce((s, x, j) => s + x * v[j], 0));
  let sse = 0; for (let i = 0; i < n; i++) { const r = [1, ...X[i]]; const e = y[i] - r.reduce((s, x, j) => s + x * beta[j], 0); sse += e * e; }
  const s2 = sse / (n - k);
  return { beta, se: inv.map((row, j) => Math.sqrt(row[j] * s2)), n };
}
function invert(M) {
  const n = M.length, A = M.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    const d = A[c][c]; for (let j = 0; j < 2 * n; j++) A[c][j] /= d;
    for (let r = 0; r < n; r++) if (r !== c) { const f = A[r][c]; for (let j = 0; j < 2 * n; j++) A[r][j] -= f * A[c][j]; }
  }
  return A.map(r => r.slice(n));
}
const slopeOf = (rows, gapKey = 'gap') => { const f = ols(rows.map(r => [r[gapKey]]), rows.map(r => r.resid)); return { b: f.beta[1], se: f.se[1], t: f.beta[1] / f.se[1], a: f.beta[0], aSe: f.se[0], n: f.n }; };
const brier = (xs) => xs.reduce((s, [p, y]) => s + (p - y) ** 2, 0) / xs.length;

// pitch-3's rule on the core: the side 5+ points above the market's no-vig chance.
function p3Legs(rows) {
  const out = [];
  for (const r of rows) {
    const d = r.pEng - r.pMkt;
    if (Math.abs(d) < P3_EDGE - 1e-9 || r.y === 0) continue;
    const home = d > 0, pM = home ? r.pMkt : 1 - r.pMkt;
    out.push({ edge: Math.abs(d), pM, won: home ? r.y > 0 : r.y < 0, ml: home ? r.mlHome : r.mlAway, t: r.t, healthy: r.healthy });
  }
  return out;
}
function legRecord(legs) {
  const won = legs.filter(l => l.won).length, exp = legs.reduce((s, l) => s + l.pM, 0), v = legs.reduce((s, l) => s + l.pM * (1 - l.pM), 0);
  const profit = legs.reduce((s, l) => s + (l.won ? (l.ml > 0 ? l.ml / 100 : 100 / -l.ml) : -1), 0);
  return { n: legs.length, won, exp, z: v ? (won - exp) / Math.sqrt(v) : null, roi: legs.length ? profit / legs.length : null };
}

// ── build the scored rows ───────────────────────────────────────────
function rowsFor(W, games, flags, variant) {
  const out = [], unjoined = [];
  for (const r of W[variant]) {
    if (!SEASONS.includes(r.t)) continue;
    const g = games.get(`${r.date}|${r.home}|${r.away}`);
    if (!g) { unjoined.push(r); continue; }
    if (!g.close || g.hs - g.as !== r.y) continue;
    const mkt = -g.close.spreadHome;
    const row = { t: r.t, date: r.date, home: r.home, away: r.away, y: r.y, pred: r.pred, mkt, resid: r.y - mkt, gap: r.pred - mkt, gMin: r.gMin,
      pEng: normalCdf(r.pred / SIGMA), pMkt: noVig(g.close.mlHome, g.close.mlAway), mlHome: g.close.mlHome, mlAway: g.close.mlAway, healthy: !!flags.get(g.id), id: g.id };
    if (r.pH) Object.assign(row, { dPrior: r.pH.prior - r.pA.prior, dForm: r.pH.cur - r.pA.cur, dRest: r.restH - r.restA });
    out.push(row);
  }
  return { rows: out, unjoined };
}

function main() {
  const W = walk();
  const { games, skipped } = espnGames();
  const flags = healthyFlags(games);
  const { rows, unjoined } = rowsFor(W, games, flags, 'engine');

  if (has('--check')) {
    // Parts must rebuild the prediction: prior + form + 2.0 + rest.
    const err = W.engine.filter(r => r.pH).map(r => Math.abs(r.pH.prior - r.pA.prior + r.pH.cur - r.pA.cur + HCA + r.restH - r.restA - r.pred));
    console.log(`parts rebuild pred: max |error| ${Math.max(...err).toExponential(2)} over ${err.length} games (parts rounded to 0.001)`);
    console.log(`joined ${rows.length} scored rows; unjoined ${unjoined.length}; ESPN skipped ${JSON.stringify(skipped)}`);
    console.log(`healthy: ${rows.filter(r => r.healthy).length} of ${rows.length}; by season ${SEASONS.map(t => `${label(t)} ${rows.filter(r => r.t === t && r.healthy).length}/${rows.filter(r => r.t === t).length}`).join(', ')}`);
    return { rows, games, flags, W };
  }

  const line = (lbl, s) => console.log(`  ${lbl.padEnd(30)} n ${String(s.n).padStart(5)}  slope ${s.b.toFixed(3).padStart(6)} ± ${s.se.toFixed(3)}  t ${s.t.toFixed(2).padStart(6)}`);
  const decide = (name, rs, key = 'gap') => {
    const all = slopeOf(rs, key), per = SEASONS.map(t => slopeOf(rs.filter(r => r.t === t), key));
    const pos = per.filter(s => s.b > 0).length, pass = all.b > 0 && all.t >= 2 && pos >= 4;
    console.log(`\n${name}`);
    line('all five seasons', all);
    per.forEach((s, i) => line(label(SEASONS[i]), s));
    console.log(`  ${pass ? 'PASS' : 'no'}: slope > 0 with t ≥ 2 ${all.b > 0 && all.t >= 2 ? '✓' : '✗'}, positive in ≥ 4 of 5 seasons ${pos >= 4 ? '✓' : '✗'} (${pos})`);
    return { all, per, pass };
  };
  console.log(`engine-close-1: ${rows.length} games scored (2021-22 … 2025-26); unjoined ${unjoined.length}; ESPN lines skipped ${JSON.stringify(skipped)}`);
  console.log(`resid (actual − close margin): mean ${(rows.reduce((s, r) => s + r.resid, 0) / rows.length).toFixed(2)}; gap (engine − close): sd ${Math.sqrt(rows.reduce((s, r) => s + r.gap ** 2, 0) / rows.length).toFixed(2)} points`);
  let passes = 0;
  const q1 = decide('Q1. Slope of resid on the engine\'s gap, all games', rows); passes += q1.pass;
  const healthy = rows.filter(r => r.healthy);
  const q1b = decide(`Q1b. Healthy games (both teams' top 5 play; ${healthy.length} games)`, healthy); passes += q1b.pass;

  console.log('\nQ2. By window (fewer games played of the two teams), described');
  for (const [w, f] of [['games 0-5', r => r.gMin <= 5], ['games 6-20', r => r.gMin > 5 && r.gMin <= 20], ['games 21+', r => r.gMin > 20]]) {
    const s = slopeOf(rows.filter(f)); line(w, s); console.log(`  ${''.padEnd(30)} intercept ${s.a.toFixed(2)} ± ${s.aSe.toFixed(2)} (resid at zero gap)`);
  }
  const s0 = slopeOf(rows); console.log(`  all games intercept ${s0.a.toFixed(2)} ± ${s0.aSe.toFixed(2)}; mean market home margin ${(rows.reduce((s, r) => s + r.mkt, 0) / rows.length).toFixed(2)} vs engine ${(rows.reduce((s, r) => s + r.pred, 0) / rows.length).toFixed(2)}`);

  console.log('\nQ3. Pieces: resid ~ prior + form + rest (home minus away)');
  const fit = (rs) => ols(rs.map(r => [r.dPrior, r.dForm, r.dRest]), rs.map(r => r.resid));
  const all3 = fit(rows), per3 = SEASONS.map(t => fit(rows.filter(r => r.t === t)));
  ['prior', 'form', 'rest'].forEach((name, j) => {
    const b = all3.beta[j + 1], se = all3.se[j + 1], pos = per3.filter(f => f.beta[j + 1] > 0).length, pass = b > 0 && b / se >= 2 && pos >= 4;
    passes += pass;
    console.log(`  ${name.padEnd(6)} ${b.toFixed(3).padStart(7)} ± ${se.toFixed(3)}  t ${(b / se).toFixed(2).padStart(6)}  by season ${per3.map(f => f.beta[j + 1].toFixed(2)).join(' / ')}  ${pass ? 'PASS' : 'no'} (positive ${pos} of 5)`);
  });
  console.log(`  intercept ${all3.beta[0].toFixed(2)} ± ${all3.se[0].toFixed(2)}`);
  for (const [w, f] of [['games 0-5', r => r.gMin <= 5], ['games 6-20', r => r.gMin > 5 && r.gMin <= 20], ['games 21+', r => r.gMin > 20]]) {
    const rs = rows.filter(f), F = fit(rs);
    console.log(`  ${w.padEnd(11)} n ${String(rs.length).padStart(5)}  prior ${F.beta[1].toFixed(2)} ± ${F.se[1].toFixed(2)}  form ${F.beta[2].toFixed(2)} ± ${F.se[2].toFixed(2)}  rest ${F.beta[3].toFixed(2)} ± ${F.se[3].toFixed(2)}`);
  }

  console.log('\nQ4. The variants (described)');
  line('core (engine)', slopeOf(rows));
  for (const v of ['double', 'oppAdj']) { const rv = rowsFor(W, games, flags, v).rows; line(v === 'double' ? 'this season counted twice' : 'opponent-adjusted', slopeOf(rv)); }

  console.log('\nQ5. pitch-3\'s rule on the core: sides 5+ points above the no-vig close');
  const legs = p3Legs(rows), rec = legRecord(legs), pass5 = rec.z != null && rec.z >= 2; passes += pass5;
  const show = (lbl, r) => console.log(`  ${lbl.padEnd(26)} n ${String(r.n).padStart(5)}  won ${String(r.won).padStart(5)}  market expected ${r.exp.toFixed(1).padStart(7)}  z ${r.z.toFixed(2).padStart(6)}  return at the close ${(100 * r.roi).toFixed(1)}%`);
  show('5+ points', rec);
  show('8+ points', legRecord(legs.filter(l => l.edge >= P3_TIER - 1e-9)));
  show('5–8 points', legRecord(legs.filter(l => l.edge < P3_TIER - 1e-9)));
  show('healthy games, 5+', legRecord(legs.filter(l => l.healthy)));
  SEASONS.forEach(t => show(label(t), legRecord(legs.filter(l => l.t === t))));
  console.log(`  ${pass5 ? 'PASS' : 'no'}: z ≥ 2 ${pass5 ? '✓' : '✗'}`);

  console.log('\nAlso reported');
  const sorted = [...rows].sort((a, b) => Math.abs(a.resid) - Math.abs(b.resid)), trimmed = sorted.slice(0, Math.floor(sorted.length * 0.99));
  line('Q1, 1% largest |resid| trimmed', slopeOf(trimmed));
  console.log(`  Brier: engine ${brier(rows.filter(r => r.y !== 0).map(r => [r.pEng, r.y > 0 ? 1 : 0])).toFixed(4)}  market (no-vig close) ${brier(rows.filter(r => r.y !== 0).map(r => [r.pMkt, r.y > 0 ? 1 : 0])).toFixed(4)}`);
  console.log(`\n${passes} of 6 pass.`);
}

module.exports = { ols, invert, slopeOf, legRecord, p3Legs, espnGames, healthyFlags, rowsFor, walk, noVig, normalCdf };
if (require.main === module) main();
