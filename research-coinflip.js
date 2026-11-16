#!/usr/bin/env node
// ============================================================
// research-coinflip.js — coin flips: volatility and the three-point matchup (coinflip-1)
// ============================================================
// Pre-registered in COINFLIP_RESEARCH.md (commit c69be1b, before this file was written).
// 2021-22 … 2025-26 team box lines and closes (train 2021-24, holdout 2024-26), every feature
// from the team's earlier games that season:
//   V1–V3, V5  does a pre-game feature predict the miss size |actual − close|?
//   V4         are coin flips more volatile, on the unscored 2015-21 seasons (median sportsbook line)?
//   D1, D2     does the three-point accuracy matchup predict the close's error / the in-game shooting?
//
//   node research-coinflip.js            the decision table and descriptive checks
//   node research-coinflip.js --game ID  one game's features, for hand checks
// Cached data only; the Odds API key is cleared, nothing spends credits.
// ============================================================
delete process.env.ODDS_API_KEY;
const fs = require('fs');
const path = require('path');
const { load } = require('./research-luck-schedule.js');
const { loadOld } = require('./research-situations.js');
const EC = require('./research-engine-close.js');

const MIN_PRIOR = 5, K3 = 300;
const TRAIN = ['2021-22', '2022-23', '2023-24'], HOLD = ['2024-25', '2025-26'];
const BOX_DIRS = [path.join(__dirname, '.cache/espn-nba/old'), path.join(__dirname, '.cache/espn-nba/hist')];
const arg = (f) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : null; };
const implied = (a) => (a < 0 ? -a / (-a + 100) : 100 / (a + 100));
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const sd = (xs) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1)); };

// Minutes per player per game (ESPN box files), for the starters-out flag.
function boxes() {
  const m = new Map();
  for (const dir of BOX_DIRS) for (const f of fs.readdirSync(dir).filter(f => f.startsWith('box-'))) {
    const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    m.set(String(b.id), b.players.filter(p => p.min > 0).map(p => ({ id: String(p.id), team: p.team, min: p.min })));
  }
  return m;
}

// Per season, in date order: each scored game's features and targets.
function build() {
  const box = boxes(), rows = [];
  for (const L of [loadOld(), load()]) for (const [season, s] of Object.entries(L.seasons)) {
    const games = s.games;
    // Who-played history for the starters-out flag (situ-1's roster rule).
    const seen = new Map();
    for (const g of games) for (const p of box.get(String(g.id)) || []) (seen.get(p.id) || seen.set(p.id, []).get(p.id)).push([g.date, p.team]);
    const gone = (p, t, date) => { const nx = (seen.get(p) || []).find(([d]) => d >= date); return !!nx && nx[1] !== t; };
    const pst = {}, cur = new Map();
    const st = {}, lg = { tpm: 0, tpa: 0 };
    const byDate = new Map();
    for (const g of games) (byDate.get(g.date) || byDate.set(g.date, []).get(g.date)).push(g);
    for (const [date, tonight] of byDate) {
      const lg3 = lg.tpa ? lg.tpm / lg.tpa : 0.36;
      for (const g of tonight) {
        const c = s.close.get(g.id), H = st[g.home], A = st[g.away];
        if (!c || !H || !A || H.n < MIN_PRIOR || A.n < MIN_PRIOR) continue;
        const f = (T) => ({ rate3: T.tpa / T.fga, poss: (T.fga - T.oreb + T.tov + 0.44 * T.fta) / T.n, vol: T.res.length >= MIN_PRIOR ? sd(T.res) : null,
          p3: (T.tpm + K3 * lg3) / (T.tpa + K3), p3a: (T.otpm + K3 * lg3) / (T.otpa + K3), tpaPg: T.tpa / T.n });
        const h = f(H), a = f(A);
        const on = new Set((box.get(String(g.id)) || []).map(p => `${p.team}|${p.id}`));
        const out2 = (t) => {
          const top5 = [...cur].filter(([p, tm]) => tm === t && pst[p][t].gp >= 5 && !gone(p, t, date)).sort((x, y) => pst[y[0]][t].min / pst[y[0]][t].gp - pst[x[0]][t].min / pst[x[0]][t].gp).slice(0, 5);
          return top5.filter(([p]) => !on.has(`${t}|${p}`)).length >= 2;
        };
        const mkt = -c.spreadHome, resid = g.hs - g.as - mkt;
        const pMkt = implied(c.mlHome) / (implied(c.mlHome) + implied(c.mlAway));
        const d1 = 3 * (h.tpaPg * (h.p3 - lg3 + a.p3a - lg3) - a.tpaPg * (a.p3 - lg3 + h.p3a - lg3));
        const l3 = 3 * (g.H.tpm - g.H.tpa * h.p3) - 3 * (g.A.tpm - g.A.tpa * a.p3);
        rows.push({ season, id: g.id, date, home: g.home, away: g.away, resid, abs: Math.abs(resid), pMkt,
          V1: (h.rate3 + a.rate3) / 2, V2: (h.poss + a.poss) / 2, V3: h.vol != null && a.vol != null ? (h.vol + a.vol) / 2 : null,
          V5: out2(g.home) || out2(g.away) ? 1 : 0, D1: d1, l3, h, a, lg3 });
      }
      // Tonight's games join the history.
      for (const g of tonight) {
        const c = s.close.get(g.id);
        for (const [T, own, opp, home] of [[g.home, g.H, g.A, true], [g.away, g.A, g.H, false]]) {
          const x = (st[T] = st[T] || { n: 0, fga: 0, tpa: 0, tpm: 0, fta: 0, oreb: 0, tov: 0, otpm: 0, otpa: 0, res: [] });
          x.n++; x.fga += own.fga; x.tpa += own.tpa; x.tpm += own.tpm; x.fta += own.fta; x.oreb += own.oreb; x.tov += own.tov; x.otpm += opp.tpm; x.otpa += opp.tpa;
          if (c) { const r = g.hs - g.as + c.spreadHome; x.res.push(home ? r : -r); }
          lg.tpm += own.tpm; lg.tpa += own.tpa;
        }
        for (const p of box.get(String(g.id)) || []) { const q = ((pst[p.id] = pst[p.id] || {})[p.team] = pst[p.id][p.team] || { gp: 0, min: 0 }); q.gp++; q.min += p.min; cur.set(p.id, p.team); }
      }
    }
  }
  return rows;
}

// Slope of y on x with t (EC.ols), and the slope per sd of x.
function fit(rows, x, y) {
  const q = rows.filter(r => r[x] != null), F = EC.ols(q.map(r => [r[x]]), q.map(r => r[y]));
  return { n: q.length, b: F.beta[1], t: F.beta[1] / F.se[1], perSd: F.beta[1] * sd(q.map(r => r[x])) };
}

function main() {
  const rows = build();
  const one = arg('--game');
  if (one) { const r = rows.find(x => String(x.id) === one); return console.log(r ? JSON.stringify(r, (k, v) => (typeof v === 'number' ? +v.toFixed(4) : v), 1) : `game ${one} not scored`); }
  const train = rows.filter(r => TRAIN.includes(r.season)), hold = rows.filter(r => HOLD.includes(r.season));
  console.log(`coinflip-1: ${rows.length} games (train ${train.length}, holdout ${hold.length}); |resid| mean ${mean(rows.map(r => r.abs)).toFixed(2)}, resid sd ${sd(rows.map(r => r.resid)).toFixed(2)}`);
  const decide = (q, x, y, pred, label) => {
    const tr = fit(train, x, y), ho = fit(hold, x, y);
    const pass = Math.abs(tr.t) >= 2 && Math.sign(ho.t) === Math.sign(tr.t) && Math.abs(ho.t) >= 1;
    const dir = pass ? (Math.sign(tr.t) === pred ? 'PASS' : 'PASS (against the predicted sign)') : 'no';
    console.log(`  ${q.padEnd(3)} ${label.padEnd(44)} train t ${tr.t.toFixed(2).padStart(6)} (${tr.perSd >= 0 ? '+' : ''}${tr.perSd.toFixed(2)} per sd, n ${tr.n})  holdout t ${ho.t.toFixed(2).padStart(6)} (${ho.perSd >= 0 ? '+' : ''}${ho.perSd.toFixed(2)}, n ${ho.n})  ${dir}`);
    return pass;
  };
  let passes = 0;
  console.log('\nVolatility (target |resid|, points of miss per sd of the feature; V5 per flag)');
  passes += decide('V1', 'V1', 'abs', 1, 'mean three-point attempt rate');
  passes += decide('V2', 'V2', 'abs', 1, 'mean possessions per game');
  passes += decide('V3', 'V3', 'abs', 1, 'mean own volatility (sd of past resid)');
  passes += decide('V5', 'V5', 'abs', 1, 'either team with 2+ of its top 5 out');
  console.log(`      V5 flag rate: ${(100 * mean(rows.map(r => r.V5))).toFixed(1)}%`);

  // V4 on 2015-21 (median sportsbook line, engine-close-2's data).
  const { games } = EC.earlyGames();
  const early = [...games.values()].filter(g => g.close && g.hs !== g.as).map(g => ({ abs: Math.abs(g.hs - g.as + g.close.spreadHome), fav: Math.max(g.close.pMkt, 1 - g.close.pMkt), spread: Math.abs(g.close.spreadHome) }));
  const cf = early.filter(g => g.fav < 0.55).map(g => g.abs), rest = early.filter(g => g.fav >= 0.55).map(g => g.abs);
  const welch = (a, b) => (mean(a) - mean(b)) / Math.sqrt(sd(a) ** 2 / a.length + sd(b) ** 2 / b.length);
  const t4 = welch(cf, rest), pass4 = t4 >= 2; passes += pass4;
  console.log(`  V4  coin flips vs the rest, 2015-21: mean |resid| ${mean(cf).toFixed(2)} (n ${cf.length}) vs ${mean(rest).toFixed(2)} (n ${rest.length}), t ${t4.toFixed(2)}  ${pass4 ? 'PASS' : 'no'}`);
  const cfS = early.filter(g => g.spread <= 1.5).map(g => g.abs), restS = early.filter(g => g.spread > 1.5).map(g => g.abs);
  console.log(`      described: coin flips by the spread (|spread| ≤ 1.5) ${mean(cfS).toFixed(2)} (n ${cfS.length}) vs ${mean(restS).toFixed(2)}, t ${welch(cfS, restS).toFixed(2)}`);

  console.log('\nDirection');
  passes += decide('D1', 'D1', 'resid', 1, 'three-point matchup edge → resid');
  passes += decide('D2', 'D1', 'l3', 1, 'three-point matchup edge → in-game 3P shooting');

  console.log('\nAlso described');
  const coin = rows.filter(r => Math.max(r.pMkt, 1 - r.pMkt) < 0.55);
  const c1 = fit(coin, 'D1', 'resid'); console.log(`  D1 on coin flips only: slope t ${c1.t.toFixed(2)} (n ${c1.n})`);
  const cfAbs = coin.map(r => r.abs), otherAbs = rows.filter(r => Math.max(r.pMkt, 1 - r.pMkt) >= 0.55).map(r => r.abs);
  console.log(`  2021-26 (already seen): coin flips' mean |resid| ${mean(cfAbs).toFixed(2)} vs ${mean(otherAbs).toFixed(2)}`);
  for (const x of ['V1', 'V2', 'V3']) {
    const q = rows.filter(r => r[x] != null).sort((a, b) => a[x] - b[x]), n = q.length;
    const qs = [0, 1, 2, 3, 4].map(i => q.slice(Math.floor(i * n / 5), Math.floor((i + 1) * n / 5)));
    console.log(`  ${x} by quintile, resid sd: ${qs.map(s => sd(s.map(r => r.resid)).toFixed(2)).join(' / ')}`);
  }
  for (const s of [...TRAIN, ...HOLD]) { const q = rows.filter(r => r.season === s); console.log(`  ${s}: V1 t ${fit(q, 'V1', 'abs').t.toFixed(2)}, V2 ${fit(q, 'V2', 'abs').t.toFixed(2)}, V3 ${fit(q, 'V3', 'abs').t.toFixed(2)}, V5 ${fit(q, 'V5', 'abs').t.toFixed(2)}, D1 ${fit(q, 'D1', 'resid').t.toFixed(2)}, D2 ${fit(q, 'D1', 'l3').t.toFixed(2)}`); }
  const trim = [...rows].sort((a, b) => a.abs - b.abs).slice(0, Math.floor(rows.length * 0.99));
  console.log(`  1% largest |resid| trimmed: ${['V1', 'V2', 'V3', 'V5'].map(x => `${x} t ${fit(trim, x, 'abs').t.toFixed(2)}`).join(', ')}, D1 t ${fit(trim, 'D1', 'resid').t.toFixed(2)}`);
  console.log(`\n${passes} of 7 pass.`);
}

module.exports = { build, fit };
if (require.main === module) main();
