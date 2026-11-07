#!/usr/bin/env node
// ============================================================
// research-minutes-cap.js — how should a night's 240 minutes be shared out?
// ============================================================
// The engine (calcRosterAdjustment) projects each player's minutes tonight as
// his baseline minutes per game × availability, and when the team's total
// passes 240 it scales EVERY player down in proportion. On Nov 6, 2026 two
// deep-bench Sixers counted as available at prior-season minutes pushed
// Philadelphia to 303 and the cap shaved ~10% off LeBron, Brown and Maxey.
// A rotation cap instead lets the players with the most minutes keep them
// and takes the cut from the bottom of the rotation.
//
// Test, on every regular-season game of 2024-25 and 2025-26 (ESPN box
// scores cached by research-season-rest.js):
//   available   the players in that game's box for the team (dressed,
//               played or not) — hindsight availability, the same for every
//               method; the test is of the sharing rule, not of injuries
//   baseline    point in time, as the engine blends it: last season's minutes
//               per game (2024-25 from player-priors.js for 2025-26 games;
//               2023-24 box scores for 2024-25 games) and this season's
//               average in the games he played for the team before tonight,
//               weighted 4 games : games played (SEASON_PLAYER_PRIOR)
//   methods     P  proportional cap (the engine): m = mpg × min(1, 240 / Σ mpg)
//               R  rotation cap: by mpg, highest first, each keeps min(mpg, what is left of 240)
//               B  last season's BPM first (tested and rejected season-level in
//                  research-season-prior.js; reference, 2025-26 only)
//   value       val(bpm, m) = max(0, bpm + 2) × m / 48 × 0.885 (research-season-prior.js),
//               bpm = the player's BPM for the season being played — hindsight,
//               used only as fixed scoring weights, never by a method; no BPM → −2 (value 0)
//
// Pre-registered before the first run:
//   evaluated   each team's games from its 11th on (a season-to-date average exists)
//   primary     RMSE of the team's value error, Σ val(bpm, m_method) − Σ val(bpm, m_actual),
//               over team-games where the cap binds (Σ mpg > 240); paired R − P with a
//               team-season-clustered SE
//   secondary   the same over all team-games; minutes misallocated (Σ |m − actual| / 2);
//               top-5 minutes MAE; margin model, leave-one-season-out: game margin on
//               (this season's margin per game, home − away) + (value, home − away), MSE
//   decision    R replaces P in the engine only if it beats P on the primary by more than
//               two SEs AND the margin model is no worse (within one SE). Otherwise keep P.
//
//   node research-minutes-cap.js
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HIST = path.join(__dirname, '.cache/espn-nba/hist');
const SEASONS = [
  { t: 2024, from: '2023-10-24', to: '2024-04-14' },
  { t: 2025, from: '2024-10-22', to: '2025-04-13' },
  { t: 2026, from: '2025-10-21', to: '2026-04-12' },
];
const MIN_GAMES = 10, CUR_K = 4, CAP = 240;
const val = (bpm, m) => Math.max(0, bpm + 2) * m / 48 * 0.885;

function loadPriors() {
  const c = {};
  vm.createContext(c);
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'js/season/data/player-priors.js'), 'utf8') + ';this.P=SEASON_PLAYER_PRIORS', c);
  return c.P.players;
}
function boxes(S) {
  const out = [];
  for (const f of fs.readdirSync(HIST).filter(f => f.startsWith('box-'))) {
    const b = JSON.parse(fs.readFileSync(path.join(HIST, f), 'utf8'));
    if (b.date >= S.from && b.date <= S.to) out.push(b);
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1));
}
// Last season's minutes per game from box scores (games played, any team).
function mpgFromBoxes(games) {
  const t = new Map();
  for (const g of games) for (const p of g.players) if (p.min > 0) { const s = t.get(p.id) || { m: 0, g: 0 }; s.m += p.min; s.g++; t.set(p.id, s); }
  return new Map([...t].map(([id, s]) => [id, s.m / s.g]));
}

// Minutes tonight for an available set under each method.
function share(players, method) {
  const tot = players.reduce((s, p) => s + p.mpg, 0);
  if (method === 'P') { const k = tot > CAP ? CAP / tot : 1; return players.map(p => p.mpg * k); }
  const key = method === 'R' ? (p) => p.mpg : (p) => (p.priorBpm == null ? -99 : p.priorBpm);
  const order = players.map((p, i) => i).sort((a, b) => key(players[b]) - key(players[a]) || players[b].mpg - players[a].mpg);
  const m = Array(players.length).fill(0);
  let left = CAP;
  for (const i of order) { m[i] = Math.max(0, Math.min(players[i].mpg, left)); left -= m[i]; }
  return m;
}

function main() {
  const P = loadPriors();
  const prior = {
    2025: mpgFromBoxes(boxes(SEASONS[0])),
    2026: new Map(Object.entries(P).filter(([, e]) => e.s25 && e.s25[0]).map(([id, e]) => [id, e.s25[1]])),
  };
  const evalBpm = { 2025: (id) => P[id] && P[id].a25 ? P[id].a25[0] : null, 2026: (id) => P[id] && P[id].a26 ? P[id].a26[0] : null };
  const priorBpm = { 2025: () => null, 2026: (id) => P[id] && P[id].a25 ? P[id].a25[0] : null };
  const methods = ['P', 'R', 'B'];
  const rows = [];   // one per team-game
  const gamesOut = [];
  for (const S of SEASONS.slice(1)) {
    const cur = new Map();   // `${team}|${id}` → { m, g }
    const teamGames = new Map(), net = new Map();
    for (const g of boxes(S)) {
      const sides = {};
      for (const team of [g.home, g.away]) {
        const n = teamGames.get(team) || 0;
        const dressed = g.players.filter(p => p.team === team);
        const players = dressed.map(p => {
          const c = cur.get(`${team}|${p.id}`), cg = c ? c.g : 0, pm = prior[S.t].get(p.id);
          const mpg = pm != null && cg ? (pm * CUR_K + c.m) / (CUR_K + cg) : cg ? c.m / cg : pm || 0;
          // No BPM for the season (a few rookies and two-ways): replacement level, value 0 — still takes minutes.
          const b = evalBpm[S.t](p.id);
          return { id: p.id, mpg, actual: p.min, bpm: b == null ? -2 : b, priorBpm: priorBpm[S.t](p.id) };
        });
        if (n >= MIN_GAMES && players.length) {
          const tot = players.reduce((s, p) => s + p.mpg, 0);
          const r = { season: S.t, team, game: g.id, binds: tot > CAP, total: tot };
          const act = players.reduce((s, p) => s + val(p.bpm, p.actual), 0);
          const top5 = players.map((p, i) => i).sort((a, b) => players[b].mpg - players[a].mpg).slice(0, 5);
          for (const k of methods) {
            if (k === 'B' && S.t !== 2026) continue;
            const m = share(players, k);
            r[k] = { err: players.reduce((s, p, i) => s + val(p.bpm, m[i]), 0) - act,
              mis: players.reduce((s, p, i) => s + Math.abs(m[i] - p.actual), 0) / 2,
              top5: top5.reduce((s, i) => s + Math.abs(m[i] - players[i].actual), 0) / top5.length,
              v: players.reduce((s, p, i) => s + val(p.bpm, m[i]), 0) };
          }
          rows.push(r);
          sides[team] = r;
        }
      }
      if (sides[g.home] && sides[g.away]) {
        const pm = (t) => { const x = net.get(t); return x ? x.d / x.g : 0; };
        gamesOut.push({ season: S.t, y: g.hs - g.as, form: pm(g.home) - pm(g.away), P: sides[g.home].P.v - sides[g.away].P.v, R: sides[g.home].R.v - sides[g.away].R.v });
      }
      // after the game: this season's minutes and margins
      for (const p of g.players) if (p.min > 0) { const k = `${p.team}|${p.id}`, c = cur.get(k) || { m: 0, g: 0 }; c.m += p.min; c.g++; cur.set(k, c); }
      for (const [t, d] of [[g.home, g.hs - g.as], [g.away, g.as - g.hs]]) { teamGames.set(t, (teamGames.get(t) || 0) + 1); const x = net.get(t) || { d: 0, g: 0 }; x.d += d; x.g++; net.set(t, x); }
    }
  }

  const paired = (set, a, b, f) => {
    // clustered by team-season: mean difference of f(a) − f(b) and its SE
    const cl = new Map();
    for (const r of set) { const k = `${r.season}|${r.team}`, d = f(r[a]) - f(r[b]); const c = cl.get(k) || { s: 0, n: 0 }; c.s += d; c.n++; cl.set(k, c); }
    const N = set.length, mean = [...cl.values()].reduce((s, c) => s + c.s, 0) / N;
    const v = [...cl.values()].reduce((s, c) => s + (c.s - c.n * mean) ** 2, 0) * cl.size / (cl.size - 1);
    return { mean, se: Math.sqrt(v) / N };
  };
  const rmse = (set, k) => Math.sqrt(set.reduce((s, r) => s + r[k].err ** 2, 0) / set.length);
  const mean = (set, f) => set.reduce((s, r) => s + f(r), 0) / set.length;
  for (const [label, set] of [['cap binds (Σ mpg > 240) — PRIMARY', rows.filter(r => r.binds)], ['all team-games', rows]]) {
    console.log(`\n${label}: ${set.length} team-games (${new Set(set.map(r => r.season + r.team)).size} team-seasons), median Σ mpg ${[...set].map(r => r.total).sort((a, b) => a - b)[set.length >> 1].toFixed(0)}`);
    for (const k of methods) {
      const s = set.filter(r => r[k]);
      console.log(`  ${k}  value error RMSE ${rmse(s, k).toFixed(3)}  bias ${mean(s, r => r[k].err) >= 0 ? '+' : ''}${mean(s, r => r[k].err).toFixed(3)}  minutes misallocated ${mean(s, r => r[k].mis).toFixed(1)}  top-5 minutes MAE ${mean(s, r => r[k].top5).toFixed(2)}  (n ${s.length})`);
    }
    const d = paired(set, 'R', 'P', (x) => x.err ** 2);
    console.log(`  R − P squared value error: ${d.mean >= 0 ? '+' : ''}${d.mean.toFixed(4)} ± ${d.se.toFixed(4)} (team-season clustered)`);
    const dm = paired(set, 'R', 'P', (x) => x.mis);
    console.log(`  R − P minutes misallocated: ${dm.mean >= 0 ? '+' : ''}${dm.mean.toFixed(2)} ± ${dm.se.toFixed(2)}`);
    const b = set.filter(r => r.B);
    if (b.length) { const db = paired(b, 'B', 'P', (x) => x.err ** 2); console.log(`  B − P squared value error (2025-26): ${db.mean >= 0 ? '+' : ''}${db.mean.toFixed(4)} ± ${db.se.toFixed(4)}`); }
  }

  // Margin model, leave-one-season-out: y = a + b·form + c·value (home − away).
  const fit = (train, k) => {
    const X = train.map(g => [1, g.form, g[k]]), y = train.map(g => g.y);
    const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], v = [0, 0, 0];
    X.forEach((r, i) => { for (let a = 0; a < 3; a++) { v[a] += r[a] * y[i]; for (let c = 0; c < 3; c++) A[a][c] += r[a] * r[c]; } });
    const M = A.map((r, i) => [...r, v[i]]);
    for (let i = 0; i < 3; i++) { let p = i; for (let q = i + 1; q < 3; q++) if (Math.abs(M[q][i]) > Math.abs(M[p][i])) p = q; [M[i], M[p]] = [M[p], M[i]]; for (let q = i + 1; q < 3; q++) { const f = M[q][i] / M[i][i]; for (let j = i; j <= 3; j++) M[q][j] -= f * M[i][j]; } }
    const x = [0, 0, 0]; for (let i = 2; i >= 0; i--) { let t = M[i][3]; for (let j = i + 1; j < 3; j++) t -= M[i][j] * x[j]; x[i] = t / M[i][i]; }
    return x;
  };
  const se = { P: [], R: [] };
  for (const t of [2025, 2026]) for (const k of ['P', 'R']) {
    const c = fit(gamesOut.filter(g => g.season !== t), k);
    for (const g of gamesOut.filter(g => g.season === t)) se[k].push((g.y - (c[0] + c[1] * g.form + c[2] * g[k])) ** 2);
  }
  const d = se.R.map((x, i) => x - se.P[i]), md = d.reduce((a, b) => a + b, 0) / d.length;
  const sd = Math.sqrt(d.reduce((a, b) => a + (b - md) ** 2, 0) / (d.length - 1)) / Math.sqrt(d.length);
  const mse = (k) => se[k].reduce((a, b) => a + b, 0) / se[k].length;
  console.log(`\nMargin model, leave-one-season-out, ${gamesOut.length} games: MSE P ${mse('P').toFixed(2)}, R ${mse('R').toFixed(2)}; R − P ${md >= 0 ? '+' : ''}${md.toFixed(3)} ± ${sd.toFixed(3)}`);
  const all = (k) => fit(gamesOut, k);
  console.log(`  full-sample coefficients (intercept, form, value): P ${all('P').map(x => x.toFixed(3)).join(', ')} · R ${all('R').map(x => x.toFixed(3)).join(', ')}`);
}

main();
