#!/usr/bin/env node
// ============================================================
// research-season-prior.js — what the opening-night prior misses, by roster stability
// ============================================================
// The walk-forward replay of 2026-27 (replay-season.js) matched the closing
// line on heavily changed rosters and lost to it on stable ones. This script
// asks the same question on ten past seasons, with the preseason win-total
// market (Basketball-Reference preseason odds) as the benchmark:
//
//   1. Is the engine's opening-night projection worse than the market on
//      stable teams historically, or was 2026-27 noise?
//   2. Which point-in-time inputs explain the gap? (two seasons of team
//      rating, last season's luck, injuries in last season's rating, age,
//      coaching change)
//   3. Rotation minutes: does projecting each player's minutes and capping
//      the team at 240 beat the engine's raw prior minutes?
//
// Point-in-time rules: the opening roster is each player's FIRST team of the
// season (Basketball-Reference lists team rows in order); BPM, minutes and
// games come from the two seasons before. Hindsight minutes appear only as a
// labelled upper bound. Every coefficient is chosen leave-one-season-out.
//
//   node research-season-prior.js
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { page, tableRows, num, loadSeason } = require('./research-team-fit.js');

const FIRST = 2014, LAST = 2026, T0 = 2016;
const REPL = -2.0, TO_PTS = 0.885;
// Overridable for variant runs: SEASON_W="1,0.5,0.167" REGRESS_MIN=1000 ERR_OUT=file.json
const SEASON_W = (process.env.SEASON_W || '1,0.5').split(',').map(Number);
const REGRESS_MIN = +(process.env.REGRESS_MIN || 300);
const val = (bpm, mpg) => Math.max(0, bpm - REPL) * mpg / 48 * TO_PTS;
const SCHED = (t) => (t === 2021 ? 72 : t === 2020 ? 82 : 82);   // games the win total was set for

function loadAging() {
  const c = {};
  vm.createContext(c);
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'js/season/data/aging-fit.js'), 'utf8') + ';this.A=SEASON_AGING_FIT', c);
  return c.A.byAge;
}

// ── small linear algebra ────────────────────────────────────
function solve(A, b) {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[p][i])) p = k;
    [M[i], M[p]] = [M[p], M[i]];
    for (let k = i + 1; k < n; k++) { const f = M[k][i] / M[i][i]; for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j]; }
  }
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
  return x;
}
function ols(X, y) {
  const k = X[0].length, XtX = Array.from({ length: k }, () => Array(k).fill(0)), Xty = Array(k).fill(0);
  X.forEach((r, i) => { for (let a = 0; a < k; a++) { Xty[a] += r[a] * y[i]; for (let b = 0; b < k; b++) XtX[a][b] += r[a] * r[b]; } });
  const coef = solve(XtX, Xty);
  const res = y.map((v, i) => v - X[i].reduce((s, x, j) => s + x * coef[j], 0));
  const s2 = res.reduce((s, e) => s + e * e, 0) / (y.length - k);
  const inv = Array.from({ length: k }, (_, j) => solve(XtX, Array.from({ length: k }, (_, i) => (i === j ? 1 : 0))));
  return { coef, se: coef.map((_, j) => Math.sqrt(s2 * inv[j][j])) };
}
// Leave-one-season-out predictions of y from feature columns (intercept added).
function loso(rows, feats, yOf) {
  const out = new Map();
  for (let t = T0; t <= LAST; t++) {
    const tr = rows.filter(r => r.t !== t);
    const f = ols(tr.map(r => [1, ...feats(r)]), tr.map(yOf));
    rows.filter(r => r.t === t).forEach(r => out.set(r, [1, ...feats(r)].reduce((s, x, j) => s + x * f.coef[j], 0)));
  }
  return rows.map(r => out.get(r));
}
const rmse = (e) => Math.sqrt(e.reduce((s, x) => s + x * x, 0) / e.length);
function paired(ea, eb) {
  const d = ea.map((e, i) => e * e - eb[i] * eb[i]);
  const m = d.reduce((s, x) => s + x, 0) / d.length;
  const sd = Math.sqrt(d.reduce((s, x) => s + (x - m) ** 2, 0) / (d.length - 1));
  return `${m >= 0 ? '+' : ''}${m.toFixed(2)} ± ${(sd / Math.sqrt(d.length)).toFixed(2)}`;
}

async function main() {
  const seasons = {};
  for (let y = FIRST; y <= LAST; y++) seasons[y] = await loadSeason(y);
  // loadSeason reads ratings only from FIRST+1 on; two-season team priors need 2014 as well.
  seasons[FIRST].rating = {};
  for (const c of tableRows(await page('ratings', FIRST), 'ratings', `ratings ${FIRST}`)) {
    if (c.team_href) seasons[FIRST].rating[c.team_href] = { nrtgAdj: num(c.net_rtg_adj), nrtg: num(c.net_rtg), mov: num(c.mov), wins: num(c.wins), games: num(c.wins) + num(c.losses) };
  }
  for (let y = FIRST + 1; y <= LAST; y++) {
    for (const c of tableRows(await page('ratings', y), 'ratings', `ratings ${y}`)) if (c.team_href) seasons[y].rating[c.team_href].wins = num(c.wins);
  }
  const odds = {};
  for (let y = T0; y <= LAST; y++) {
    odds[y] = {};
    // This table quotes its links with ' — parse it directly.
    const html = await page('preseason_odds', y), i0 = html.indexOf('id="NBA_preseason_odds"');
    for (const tr of html.slice(i0, html.indexOf('</table>', i0)).split('<tr').slice(1)) {
      const team = /href=['"]\/teams\/([A-Z]{3})\//.exec(tr), ou = /data-stat="wins_ou"\s*>([\d.]+)/.exec(tr);
      if (team && ou) odds[y][team[1]] = +ou[1];
    }
    if (Object.keys(odds[y]).length !== 30) throw new Error(`${y}: ${Object.keys(odds[y]).length} win totals`);
  }
  const coaches = {};
  for (let y = T0 - 1; y <= LAST; y++) {
    coaches[y] = {};
    let html;
    try { html = await page('coaches', y); } catch (e) { continue; }
    const i0 = html.indexOf('id="NBA_coaches"');
    for (const tr of html.slice(i0, html.indexOf('</table>', i0)).split('<tr').slice(1)) {
      const coach = /data-stat="coach"\s*><a href=['"]\/coaches\/([a-z0-9]+)c?\.html/.exec(tr), team = /href=['"]\/teams\/([A-Z]{3})\//.exec(tr);
      if (coach && team && !coaches[y][team[1]]) coaches[y][team[1]] = coach[1];   // first listed = opening-night coach
    }
  }
  const byAge = loadAging();

  // Player projection from the two seasons before t.
  const leagueGames = (t) => Math.max(...Object.values(seasons[t].rating).map(r => r.games));
  const projOf = (id, t) => {
    let mins = 0, b = 0, wg = 0, wG = 0, wmp = 0;
    SEASON_W.forEach((w, k) => {
      const s = seasons[t - 1 - k], p = s && s.players.get(id);
      if (!p || !p.total || !p.total.mp || p.total.bpm == null) return;
      mins += p.total.mp * w; b += p.total.bpm * p.total.mp * w;
      wg += p.total.g * w; wG += leagueGames(t - 1 - k) * w; wmp += p.total.mp * w;
    });
    if (!mins) return null;
    return {
      bpm: (b + REPL * REGRESS_MIN) / (mins + REGRESS_MIN),
      mpg: wmp / wg,
      gShare: (wg + 0.80 * 20) / (wG + 20),           // games-played rate, lightly regressed
    };
  };
  // Rookie level: players with no prior, minutes-weighted.
  let rb = 0, rm = 0, rmpg = 0, rn = 0;
  for (let t = T0; t <= LAST; t++) for (const p of seasons[t].players.values()) {
    if (!p.total || p.total.bpm == null || projOf(p.id, t)) continue;
    rb += p.total.bpm * p.total.mp; rm += p.total.mp; rmpg += p.total.mp / p.total.g; rn++;
  }
  const ROOKIE_BPM = rb / rm;

  const rows = [];
  for (let t = T0; t <= LAST; t++) {
    const S = seasons[t], S1 = seasons[t - 1], S2 = seasons[t - 2];
    for (const T of Object.keys(S.rating)) {
      const G1 = S1.rating[T].games;
      const roster = [];
      for (const p of S.players.values()) {
        const keys = Object.keys(p.teams);
        if (!keys.length || keys[0] !== T) continue;
        const j = projOf(p.id, t);
        const prev = S1.players.get(p.id), pr = prev && prev.teams[T];
        const r = p.teams[T];
        roster.push({
          id: p.id, age: p.age, rookie: !j,
          bpm: j ? j.bpm : ROOKIE_BPM, mpg: j ? j.mpg : 0, gShare: j ? j.gShare : 0.7,
          shareG: pr && pr.g ? Math.min(1, pr.g / G1) : 0,
          mLast: pr ? pr.mp / G1 : 0,                     // minutes per team game last season
          hMpg: r.g ? r.mp / r.g : 0, hAvail: r.g / S.rating[T].games,   // hindsight
        });
      }
      const onRoster = new Set(roster.map(x => x.id));
      const departed = [];
      for (const p of S1.players.values()) {
        const pr = p.teams[T];
        if (!pr || !pr.g || onRoster.has(p.id)) continue;
        const j = projOf(p.id, t);
        departed.push({ bpm: j ? j.bpm : ROOKIE_BPM, mpg: j ? j.mpg : pr.mp / pr.g, shareG: Math.min(1, pr.g / G1), mLast: pr.mp / G1 });
      }
      const r1 = S1.rating[T], r2 = S2.rating[T];
      const pyth = (r1.wins - (r1.games / 2 + 2.7 * r1.mov * r1.games / 82));
      const minW = roster.reduce((s, x) => s + x.mpg * x.gShare, 0) || 1;
      const contin = roster.filter(x => x.shareG > 0).reduce((s, x) => s + x.mpg * x.gShare, 0) / minW;
      const age = roster.reduce((s, x) => s + (x.age || 27) * x.mpg * x.gShare, 0) / minW;
      rows.push({
        t, T, y: S.rating[T].nrtgAdj, p1: r1.nrtgAdj, p2: r2 ? r2.nrtgAdj : r1.nrtgAdj,
        roster, departed, contin, age, pyth,
        coachChange: coaches[t][T] && coaches[t - 1][T] ? (coaches[t][T] !== coaches[t - 1][T] ? 1 : 0) : 0,
        wpct: odds[t][T] / SCHED(t),
      });
    }
  }

  // ── roster terms ──────────────────────────────────────────
  const agingOf = (x, a) => (x.rookie || x.age == null ? 0 : (byAge[Math.max(20, Math.min(36, Math.round(x.age)))] || 0));
  const terms = {
    // Live engine: value at raw prior minutes × (availability − share of last season's games).
    engine: (r, avail) => {
      let s = 0;
      for (const x of r.roster) s += val(x.bpm, x.mpg) * ((avail === 'exp' ? x.gShare : 1) - x.shareG);
      for (const d of r.departed) s -= val(d.bpm, d.mpg) * d.shareG;
      return Math.max(-12, Math.min(12, s));
    },
    // Hindsight minutes and availability (Part 3 of research-team-fit.js) — not point-in-time.
    hindsight: (r) => {
      let s = 0;
      for (const x of r.roster) s += val(x.bpm, x.hMpg) * (x.hAvail - x.shareG);
      for (const d of r.departed) s -= val(d.bpm, d.mpg) * d.shareG;
      return Math.max(-12, Math.min(12, s));
    },
    // Minutes-delta: projected minutes this season (capped at 240 a game) minus
    // the minutes each player actually gave this team last season.
    delta240: (r, mode) => {
      const exp = r.roster.map(x => ({ x, m: x.mpg * x.gShare }));
      const total = exp.reduce((s, e) => s + e.m, 0);
      if (mode === 'priority') {
        // Best projected players keep their minutes; the cut comes off the bottom.
        let left = 240;
        [...exp].sort((a, b) => b.x.bpm - a.x.bpm).forEach(e => { e.m = Math.min(e.m, Math.max(0, left)); left -= e.m; });
      } else if (mode !== 'raw' && total > 240) exp.forEach(e => { e.m *= 240 / total; });
      let s = 0;
      for (const e of exp) s += val(e.x.bpm, e.m) - val(e.x.bpm, e.x.mLast);
      for (const d of r.departed) s -= val(d.bpm, d.mLast);
      return Math.max(-12, Math.min(12, s));
    },
  };
  const aging = (r) => r.roster.reduce((s, x) => s + x.shareG * (val(x.bpm + agingOf(x), x.mpg) - val(x.bpm, x.mpg)), 0);
  rows.forEach(r => {
    r.eng = terms.engine(r, 1); r.engExp = terms.engine(r, 'exp'); r.hind = terms.hindsight(r);
    r.dRaw = terms.delta240(r, 'raw'); r.dProp = terms.delta240(r, 'prop'); r.dPri = terms.delta240(r, 'priority');
    r.age1 = aging(r);
    r.minTotal = r.roster.reduce((s, x) => s + x.mpg * x.gShare, 0);
    r.minTotalHealthy = r.roster.reduce((s, x) => s + x.mpg, 0);
  });

  const n = rows.length;
  console.log(`${n} team-seasons, ${T0 - 1}-${String(T0).slice(2)} … ${LAST - 1}-${String(LAST).slice(2)}; rookie BPM ${ROOKIE_BPM.toFixed(2)}`);
  const mt = rows.map(r => r.minTotalHealthy).sort((a, b) => a - b);
  console.log(`Opening rosters at raw prior minutes, everyone healthy: median ${mt[n >> 1].toFixed(0)} min/game, ` +
    `${rows.filter(r => r.minTotalHealthy > 240).length}/${n} teams over 240; at expected games played: median ${rows.map(r => r.minTotal).sort((a, b) => a - b)[n >> 1].toFixed(0)}`);

  // ── 1. engine variants (retention etc. fitted LOSO as linear weights) ──
  const y = (r) => r.y;
  const variants = [
    ['last season only', r => [r.p1]],
    ['engine: last season + roster (raw minutes, healthy)', r => [r.p1, r.eng + r.age1]],
    ['  roster at expected games played', r => [r.p1, r.engExp + r.age1]],
    ['  minutes-delta, raw minutes', r => [r.p1, r.dRaw + r.age1]],
    ['  minutes-delta, capped at 240 (proportional)', r => [r.p1, r.dProp + r.age1]],
    ['  minutes-delta, capped at 240 (best players first)', r => [r.p1, r.dPri + r.age1]],
    ['  hindsight minutes (upper bound, not point-in-time)', r => [r.p1, r.hind + r.age1]],
  ];
  const fixedEngine = rows.map(r => 0.75 * r.p1 + r.eng + r.age1);
  const base = rows.map((r, i) => r.y - fixedEngine[i]);
  console.log(`\n1. Opening-night projection vs final adjusted net rating (RMSE per 100; weights fitted leave-one-season-out)`);
  console.log(`  ${'engine as built (0.75 × last + roster + aging)'.padEnd(56)} RMSE ${rmse(base).toFixed(3)}`);
  const preds = {};
  for (const [label, f] of variants) {
    const p = loso(rows, f, y);
    preds[label] = p;
    const e = rows.map((r, i) => r.y - p[i]);
    console.log(`  ${label.padEnd(56)} RMSE ${rmse(e).toFixed(3)}  ΔMSE vs built ${paired(e, base)}`);
  }
  console.log('  full-sample weights (intercept, last season, roster+aging):');
  for (const [label, f] of variants.slice(1)) {
    const o = ols(rows.map(r => [1, ...f(r)]), rows.map(y));
    console.log(`    ${label.trim().padEnd(54)} ${o.coef.map((c, j) => `${c.toFixed(2)}±${o.se[j].toFixed(2)}`).join('  ')}`);
  }
  for (const [label, sel] of [['changed', r => r.contin < 0.67], ['middle', r => r.contin >= 0.67 && r.contin < 0.80], ['stable', r => r.contin >= 0.80]]) {
    const idx = rows.map((r, i) => (sel(r) ? i : -1)).filter(i => i >= 0);
    console.log(`    as built, ${label.padEnd(8)} RMSE ${rmse(idx.map(i => base[i])).toFixed(2)}  mean roster term ${(idx.reduce((s, i) => s + rows[i].eng, 0) / idx.length).toFixed(2)}  bias ${(idx.reduce((s, i) => s + base[i], 0) / idx.length).toFixed(2)}`);
  }
  // Game margins depend only on differences between teams, so score the
  // built constants (0.75 × last season + 1.0 × roster) after removing each
  // season's mean error.
  const demean = (e) => {
    const out = e.slice();
    for (let t = T0; t <= LAST; t++) {
      const idx = rows.map((r, i) => (r.t === t ? i : -1)).filter(i => i >= 0);
      const m = idx.reduce((s, i) => s + e[i], 0) / idx.length;
      idx.forEach(i => { out[i] = e[i] - m; });
    }
    return out;
  };
  const builtE = demean(base);
  console.log('  built constants (0.75, 1.0), season mean removed — the form game margins see:');
  for (const [label, k] of [['raw minutes, healthy (live engine today)', 'eng'], ['minutes-delta, raw minutes', 'dRaw'], ['minutes-delta, capped at 240', 'dProp']]) {
    const e = demean(rows.map(r => r.y - (0.75 * r.p1 + r[k] + r.age1)));
    const sd = Math.sqrt(rows.reduce((s, r) => s + r[k] * r[k], 0) / n);
    console.log(`    ${label.padEnd(54)} RMSE ${rmse(e).toFixed(3)}  ΔMSE vs live ${paired(e, builtE)}  roster term sd ${sd.toFixed(2)}`);
  }
  if (process.env.ERR_OUT) fs.writeFileSync(process.env.ERR_OUT, JSON.stringify(rows.map(r => ({ t: r.t, T: r.T, y: r.y, p: 0.75 * r.p1 + r.dProp + r.age1 }))));
  const mkt = loso(rows, r => [r.wpct], y);
  const mktE = rows.map((r, i) => r.y - mkt[i]);
  console.log(`  ${'market: preseason win total'.padEnd(56)} RMSE ${rmse(mktE).toFixed(3)}  ΔMSE vs built ${paired(mktE, base)}`);

  // ── 2. by roster stability ────────────────────────────────
  const engP = preds['engine: last season + roster (raw minutes, healthy)'];
  const cs = rows.map(r => r.contin).sort((a, b) => a - b);
  const cut = [cs[Math.floor(n / 3)], cs[Math.floor(2 * n / 3)]];
  console.log(`\n2. By roster stability (share of projected minutes from returning players; tercile cuts ${cut.map(c => (c * 100).toFixed(0) + '%').join(' / ')})`);
  const buckets = [['changed', r => r.contin < cut[0]], ['middle', r => r.contin >= cut[0] && r.contin < cut[1]], ['stable', r => r.contin >= cut[1]]];
  for (const [label, sel] of buckets) {
    const idx = rows.map((r, i) => (sel(r) ? i : -1)).filter(i => i >= 0);
    const ee = idx.map(i => rows[i].y - engP[i]), me = idx.map(i => mktE[i]);
    console.log(`  ${label.padEnd(8)} n=${idx.length}  engine RMSE ${rmse(ee).toFixed(2)}  market ${rmse(me).toFixed(2)}  engine − market ΔMSE ${paired(ee, me)}`);
  }

  // ── 3. what the market knows: features that explain (market − engine) and (actual − engine) ──
  const feats = {
    'two seasons ago (p2 − p1)': r => r.p2 - r.p1,
    'last season luck (wins over point margin)': r => r.pyth,
    'continuity': r => r.contin,
    'minutes-weighted age − 27': r => r.age - 27,
    'coaching change': r => r.coachChange,
    'roster minutes over 240': r => Math.max(0, r.minTotalHealthy - 240) / 10,
  };
  const mktNet = mkt;
  console.log(`\n3. What explains the gap (one feature at a time; coefficient ± se, then leave-one-season-out ΔMSE when added to the engine)`);
  console.log(`  ${'feature'.padEnd(44)}  market − engine        actual − engine        ΔMSE added`);
  const engErr = rows.map((r, i) => r.y - engP[i]);
  for (const [label, f] of Object.entries(feats)) {
    const a = ols(rows.map(r => [1, f(r)]), rows.map((r, i) => mktNet[i] - engP[i]));
    const b = ols(rows.map(r => [1, f(r)]), rows.map((r, i) => r.y - engP[i]));
    const p = loso(rows, r => [r.p1, r.eng + r.age1, f(r)], y);
    const e = rows.map((r, i) => r.y - p[i]);
    const fmt = (o) => `${o.coef[1] >= 0 ? '+' : ''}${o.coef[1].toFixed(2)} ± ${o.se[1].toFixed(2)}`.padEnd(20);
    console.log(`  ${label.padEnd(44)}  ${fmt(a)}   ${fmt(b)}   ${paired(e, engErr)}`);
  }
  // Carryover that depends on continuity (Berman, Down & Hill 2002: shared
  // experience compounds), on top of the 240-capped roster term.
  const capE = rows.map((r, i) => r.y - preds['  minutes-delta, capped at 240 (proportional)'][i]);
  const pInt = loso(rows, r => [r.p1, r.dProp + r.age1, r.p1 * (r.contin - 0.73)], y);
  const eInt = rows.map((r, i) => r.y - pInt[i]);
  const oInt = ols(rows.map(r => [1, r.p1, r.dProp + r.age1, r.p1 * (r.contin - 0.73)]), rows.map(y));
  console.log(`  carryover × continuity on the capped engine: coef ${oInt.coef[3].toFixed(2)} ± ${oInt.se[3].toFixed(2)} (retention ${oInt.coef[1].toFixed(2)} at 73% returning); ΔMSE ${paired(eInt, capE)}`);
  const pCF = loso(rows, r => [r.p1, r.dProp + r.age1, r.contin], y);
  console.log(`  continuity as a level on the capped engine: ΔMSE ${paired(rows.map((r, i) => r.y - pCF[i]), capE)}`);
  const all = (r) => [r.p1, r.eng + r.age1, ...Object.values(feats).map(f => f(r))];
  const pAll = loso(rows, all, y);
  const eAll = rows.map((r, i) => r.y - pAll[i]);
  console.log(`  all features together: RMSE ${rmse(eAll).toFixed(3)}  ΔMSE vs engine ${paired(eAll, engErr)}`);
  const pStack = loso(rows, r => [r.p1, r.eng + r.age1, r.wpct], y);
  const eStack = rows.map((r, i) => r.y - pStack[i]);
  console.log(`  engine + market win total stacked: RMSE ${rmse(eStack).toFixed(3)}  vs market alone ${paired(eStack, mktE)}`);
  for (const [label, sel] of buckets) {
    const idx = rows.map((r, i) => (sel(r) ? i : -1)).filter(i => i >= 0);
    console.log(`    ${label.padEnd(8)} with all features: engine RMSE ${rmse(idx.map(i => eAll[i])).toFixed(2)}  market ${rmse(idx.map(i => mktE[i])).toFixed(2)}`);
  }
}

main().catch(e => { console.error('research-season-prior failed:', e.stack); process.exit(1); });
