#!/usr/bin/env node
// ============================================================
// research-team-fit.js — what summed player value misses: aging and roster fit
// ============================================================
// Questions: when a team's players are summed by their prior-season Box
// Plus/Minus (the season engine's player value), how much of the miss on
// the team's actual net rating is (1) players a year older or younger
// than the season their BPM came from, and (2) how the pieces fit?
// Part 3 replays the live engine's season-start projection (last season's
// rating × retention + roster changes + aging + fit) on every team-season
// to check each step the way the engine actually uses it.
//
// Design (one row per team-season, 2015-16 … 2025-26):
//   minutes   each player's ACTUAL minutes for that team that season
//             (hindsight minutes, so the test isolates fit, not rotation guesses)
//   value     prior BPM from the two seasons before, engine-style
//             (weights 1.0 / 0.5, regressed toward −2 over 300 minutes),
//             plus an age adjustment measured from the same data;
//             split into offense (OBPM) and defense (DBPM)
//   roles     usage, assist, rebound, 3-point rates from the prior seasons —
//             nothing from the season being predicted
//   target    Basketball-Reference schedule-adjusted net rating (per 100)
//
// Pre-registered features (fixed before looking at results):
//   usg      on-floor usage sum minus 100 (more shot demand than shots)
//   ast      on-floor assist-rate sum (playmaking overlap)
//   trb      on-floor rebound-rate sum (rebounding overlap)
//   spacing  on-floor 3-point attempt rate
//   shooters on-floor count of volume 3-point shooters (3.5+ 3PA/36, 35%+)
//   bigs     on-floor non-shooting bigs beyond one
//   continuity  share of minutes from players on the team last season
//   Δ versions: the same fit minus the fit each player's BPM was earned in
//   (his previous team's realized fit) — BPM already absorbs old-team fit.
//
// Scored by leave-one-season-out cross-validation: a feature counts only
// if it lowers out-of-sample error on seasons it was not fitted on.
//
//   node research-team-fit.js [--first 2014] [--last 2026] [--json out.json] [--write]
//   --write regenerates js/season/data/chemistry-fit.js and aging-fit.js
//
// Basketball-Reference pages are cached under .cache/bref/ (4 s between
// fetches; the site allows ~20 requests per minute).
// ============================================================
const fs = require('fs');
const path = require('path');

const CACHE = path.join(__dirname, '.cache/bref');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const FIRST = +arg('--first', 2014), LAST = +arg('--last', 2026);
const JSON_OUT = arg('--json', null);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const REPL = -2.0, REGRESS_MIN = 300, SEASON_W = [1.0, 0.5];
const ROLE_REGRESS_MIN = 200;
const SEASON_PRIOR_RETENTION_ENGINE = 0.80;   // js/season/data/season-constants.js SEASON_PRIOR_RETENTION

// ── fetch + parse ───────────────────────────────────────────
async function page(kind, year) {
  const f = path.join(CACHE, `NBA_${year}_${kind}.html`);
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  const url = `https://www.basketball-reference.com/leagues/NBA_${year}_${kind}.html`;
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const html = await res.text();
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(f, html);
  process.stdout.write(`  fetched ${kind} ${year}\n`);
  await sleep(4000);
  return html;
}

function tableRows(html, id, label) {
  const start = html.indexOf(`id="${id}"`);
  if (start < 0) throw new Error(`${label}: no #${id} table`);
  const table = html.slice(start, html.indexOf('</table>', start));
  const out = [];
  for (const tr of table.split('<tr').slice(1)) {
    const cells = {};
    const re = /<t[dh]([^>]*)>(.*?)<\/t[dh]>/g;
    let m;
    while ((m = re.exec(tr))) {
      const stat = /data-stat="([a-z_0-9]+)"/.exec(m[1]);
      if (!stat) continue;
      cells[stat[1]] = m[2].replace(/<[^>]+>/g, '').trim();
      const id2 = /data-append-csv="([^"]+)"/.exec(m[1]);
      if (id2) cells.bref_id = id2[1];
      const href = /href="\/teams\/([A-Z]{3})\//.exec(m[2]);
      if (href) cells.team_href = href[1];
    }
    if (Object.keys(cells).length) out.push(cells);
  }
  return out;
}

const num = (v) => { const x = parseFloat(v); return isNaN(x) ? null : x; };
const MULTI = /^(\dTM|TOT)$/;

// season → { players: Map(id → {name, age, pos, total, teams:{T:row}}), teamMp:{T}, rating:{T} }
async function loadSeason(year) {
  const adv = tableRows(await page('advanced', year), 'advanced', `advanced ${year}`);
  const tot = tableRows(await page('totals', year), 'totals_stats', `totals ${year}`);
  const players = new Map();
  const key = (c) => `${c.bref_id}|${c.team_name_abbr}`;
  const totBy = new Map(tot.filter(c => c.bref_id).map(c => [key(c), c]));
  let unmatched = 0;
  for (const c of adv) {
    if (!c.bref_id || !c.name_display || !c.team_name_abbr) continue;
    const t = totBy.get(key(c));
    if (!t) { unmatched++; continue; }
    const row = {
      g: num(c.games), mp: num(c.mp) || 0, bpm: num(c.bpm), obpm: num(c.obpm), dbpm: num(c.dbpm),
      usg: num(c.usg_pct), ast: num(c.ast_pct), trb: num(c.trb_pct), par3: num(c.fg3a_per_fga_pct),
      fg3: num(t.fg3) || 0, fg3a: num(t.fg3a) || 0,
    };
    const p = players.get(c.bref_id) || { id: c.bref_id, name: c.name_display, age: num(c.age), pos: c.pos || '', total: null, teams: {} };
    if (MULTI.test(c.team_name_abbr)) p.total = row;
    else { p.teams[c.team_name_abbr] = row; if (!p.total) p.total = row; }
    players.set(c.bref_id, p);
  }
  // A traded player's first team row is a provisional total until the multi-team row arrives —
  // BRef lists the multi-team row first, so check the order held.
  for (const p of players.values()) {
    const n = Object.keys(p.teams).length;
    if (n > 1) {
      const sum = Object.values(p.teams).reduce((s, r) => s + r.mp, 0);
      if (Math.abs(sum - p.total.mp) > 2) throw new Error(`${year} ${p.name}: team minutes ${sum} ≠ total ${p.total.mp}`);
    }
  }
  const teamMp = {};
  for (const p of players.values()) for (const [t, r] of Object.entries(p.teams)) teamMp[t] = (teamMp[t] || 0) + r.mp;
  let rating = null;
  if (year >= FIRST + 1) {
    rating = {};
    for (const c of tableRows(await page('ratings', year), 'ratings', `ratings ${year}`)) {
      if (!c.team_href) continue;
      rating[c.team_href] = { nrtgAdj: num(c.net_rtg_adj), nrtg: num(c.net_rtg), mov: num(c.mov), games: num(c.wins) + num(c.losses) };
    }
  }
  return { year, players, teamMp, rating, unmatched };
}

// ── player projections ──────────────────────────────────────
const bucket = (pos) => { const p = (pos || '').split('-')[0]; return p === 'C' ? 'C' : (p === 'PF' || p === 'SF') ? 'F' : 'G'; };

function priorProfile(seasons, id, t) {
  let mins = 0, o = 0, d = 0;
  const role = { usg: 0, ast: 0, trb: 0, par3: 0 };
  let fg3 = 0, fg3a = 0;
  SEASON_W.forEach((w, k) => {
    const s = seasons[t - 1 - k];
    const p = s && s.players.get(id);
    if (!p || !p.total || !p.total.mp || p.total.obpm == null) return;
    const r = p.total, m = r.mp * w;
    mins += m; o += r.obpm * m; d += r.dbpm * m;
    for (const k2 of Object.keys(role)) role[k2] += (r[k2] || 0) * m;
    fg3 += r.fg3 * w; fg3a += r.fg3a * w;
  });
  if (!mins) return null;
  for (const k2 of Object.keys(role)) role[k2] /= mins;
  return { mins, o: o / mins, d: d / mins, role, fg3, fg3a };
}

// ── small linear algebra ────────────────────────────────────
function inverse(A) {
  const n = A.length, M = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    const v = M[c][c];
    if (Math.abs(v) < 1e-12) throw new Error('singular matrix');
    for (let j = 0; j < 2 * n; j++) M[c][j] /= v;
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[c][j]; }
  }
  return M.map(r => r.slice(n));
}
// OLS (optional ridge on all but the intercept). Returns coef, se, rmse.
function ols(X, y, ridge = 0) {
  const k = X[0].length, n = X.length;
  const XtX = Array.from({ length: k }, () => Array(k).fill(0)), Xty = Array(k).fill(0);
  for (let i = 0; i < n; i++) for (let a = 0; a < k; a++) { Xty[a] += X[i][a] * y[i]; for (let b = 0; b < k; b++) XtX[a][b] += X[i][a] * X[i][b]; }
  for (let a = 1; a < k; a++) XtX[a][a] += ridge;
  const inv = inverse(XtX);
  const coef = inv.map(r => r.reduce((s, v, j) => s + v * Xty[j], 0));
  const resid = y.map((yi, i) => yi - X[i].reduce((s, v, j) => s + v * coef[j], 0));
  const s2 = resid.reduce((s, r) => s + r * r, 0) / (n - k);
  return { coef, se: inv.map((r, i) => Math.sqrt(s2 * r[i])), rmse: Math.sqrt(resid.reduce((s, r) => s + r * r, 0) / n), resid };
}
const predict = (x, coef) => x.reduce((s, v, j) => s + v * coef[j], 0);

// Leave-one-season-out RMSE for a column set.
function cvRmse(rows, cols, ridge = 0) {
  let se = 0, n = 0;
  const seasons = [...new Set(rows.map(r => r.t))];
  for (const s of seasons) {
    const train = rows.filter(r => r.t !== s), test = rows.filter(r => r.t === s);
    const fit = ols(train.map(r => [1, ...cols.map(c => r[c])]), train.map(r => r.y), ridge);
    for (const r of test) { se += (r.y - predict([1, ...cols.map(c => r[c])], fit.coef)) ** 2; n++; }
  }
  return Math.sqrt(se / n);
}

// ── main ────────────────────────────────────────────────────
async function main() {
  console.log(`Loading Basketball-Reference ${FIRST}–${LAST} (cached under .cache/bref/)`);
  const seasons = {};
  for (let y = FIRST; y <= LAST; y++) {
    seasons[y] = await loadSeason(y);
    const s = seasons[y];
    const teams = Object.keys(s.teamMp);
    if (teams.length !== 30) throw new Error(`${y}: ${teams.length} teams in player tables`);
    if (s.rating && Object.keys(s.rating).length !== 30) throw new Error(`${y}: ${Object.keys(s.rating).length} teams in ratings`);
    if (s.rating) { const miss = teams.filter(t => !s.rating[t]); if (miss.length) throw new Error(`${y}: no rating for ${miss}`); }
    const mpRange = Object.values(s.teamMp).map(m => m / 5 / 48);
    console.log(`  ${y}: ${s.players.size} players, ${s.unmatched} advanced rows without totals; team games-equivalent ${Math.min(...mpRange).toFixed(1)}–${Math.max(...mpRange).toFixed(1)}`);
  }
  const T0 = FIRST + 2;

  // Replacement split and rookie level, pooled.
  let oR = 0, dR = 0, mR = 0;
  for (let t = T0; t <= LAST; t++) {
    const ranked = [...seasons[t].players.values()].filter(p => p.total && p.total.obpm != null).sort((a, b) => b.total.mp - a.total.mp).slice(300, 450);
    for (const p of ranked) { oR += p.total.obpm * p.total.mp; dR += p.total.dbpm * p.total.mp; mR += p.total.mp; }
  }
  const oRepl = REPL * (oR / mR) / ((oR + dR) / mR), dRepl = REPL - oRepl;
  console.log(`\nReplacement tier (minutes rank 301–450): OBPM ${(oR / mR).toFixed(2)}, DBPM ${(dR / mR).toFixed(2)} → regression target split ${oRepl.toFixed(2)} / ${dRepl.toFixed(2)} (sum −2.0)`);

  // Rookies: no NBA minutes in the two prior seasons.
  const rook = { o: 0, d: 0, m: 0, role: {} };
  for (let t = T0; t <= LAST; t++) for (const p of seasons[t].players.values()) {
    if (!p.total || p.total.obpm == null || priorProfile(seasons, p.id, t)) continue;
    const r = p.total, b = bucket(p.pos);
    rook.o += r.obpm * r.mp; rook.d += r.dbpm * r.mp; rook.m += r.mp;
    const rb = rook.role[b] = rook.role[b] || { usg: 0, ast: 0, trb: 0, par3: 0, fg3: 0, fg3a: 0, m: 0 };
    for (const k of ['usg', 'ast', 'trb', 'par3']) rb[k] += (r[k] || 0) * r.mp;
    rb.fg3 += r.fg3; rb.fg3a += r.fg3a; rb.m += r.mp;
  }
  const rookO = rook.o / rook.m, rookD = rook.d / rook.m;
  // League-wide rookie rebound rate: the live engine has no positions in the
  // priors file, so rebounding regresses toward this one value in both places.
  const rookTrb = Object.values(rook.role).reduce((s, rb) => s + rb.trb, 0) / Object.values(rook.role).reduce((s, rb) => s + rb.m, 0);
  for (const rb of Object.values(rook.role)) for (const k of ['usg', 'ast', 'trb', 'par3']) rb[k] /= rb.m;
  console.log(`Players new to the league, minutes-weighted: OBPM ${rookO.toFixed(2)}, DBPM ${rookD.toFixed(2)} (BPM ${(rookO + rookD).toFixed(2)})`);

  // Raw projections, then the age table from their errors.
  const proj = (p, t) => {
    const pr = priorProfile(seasons, p.id, t);
    if (!pr) return { o: rookO, d: rookD, rookie: true, pr: null };
    return {
      o: (pr.o * pr.mins + oRepl * REGRESS_MIN) / (pr.mins + REGRESS_MIN),
      d: (pr.d * pr.mins + dRepl * REGRESS_MIN) / (pr.mins + REGRESS_MIN), rookie: false, pr,
    };
  };
  const ageAcc = {};
  for (let t = T0; t <= LAST; t++) for (const p of seasons[t].players.values()) {
    if (!p.total || p.total.mp < 500 || p.total.obpm == null || p.age == null) continue;
    const j = proj(p, t);
    if (j.rookie || j.pr.mins < 500) continue;
    const a = Math.max(20, Math.min(36, p.age)), w = Math.min(p.total.mp, j.pr.mins);
    const acc = ageAcc[a] = ageAcc[a] || { o: 0, d: 0, w: 0, n: 0 };
    acc.o += (p.total.obpm - j.o) * w; acc.d += (p.total.dbpm - j.d) * w; acc.w += w; acc.n++;
  }
  const ageAdj = {};
  console.log('\nProjection error by age (actual − projected, minutes-weighted; 500+ min both sides)');
  console.log('  age   n     OBPM    DBPM');
  for (let a = 20; a <= 36; a++) {
    const acc = ageAcc[a];
    // Light pooling with neighbours keeps sparse ends stable.
    const nb = [a - 1, a, a + 1].map(x => ageAcc[x]).filter(Boolean);
    const W = nb.reduce((s, x) => s + x.w, 0);
    ageAdj[a] = { o: nb.reduce((s, x) => s + x.o, 0) / W, d: nb.reduce((s, x) => s + x.d, 0) / W };
    if (acc) console.log(`  ${String(a).padStart(3)} ${String(acc.n).padStart(4)}   ${(acc.o / acc.w).toFixed(2).padStart(6)}  ${(acc.d / acc.w).toFixed(2).padStart(6)}   smoothed ${ageAdj[a].o.toFixed(2)} / ${ageAdj[a].d.toFixed(2)}`);
  }
  const ageOf = (p) => ageAdj[Math.max(20, Math.min(36, p.age == null ? 27 : p.age))];

  // Engine age curve: change in total BPM vs the regressed prior, by age in
  // the season being projected. Centred so the minutes-weighted change over
  // all players with a prior is zero — a league-wide shift moves every team
  // equally (no effect on margins) and would only inflate totals. Kept per
  // season so the engine replay below can leave the season it scores out.
  const ageAccBy = {}, ageMinBy = {};
  for (let t = T0; t <= LAST; t++) {
    ageAccBy[t] = {}; ageMinBy[t] = {};
    for (const p of seasons[t].players.values()) {
      if (!p.total || p.total.obpm == null || p.age == null) continue;
      const j = proj(p, t);
      if (j.rookie) continue;
      const a = Math.max(20, Math.min(36, p.age));
      ageMinBy[t][a] = (ageMinBy[t][a] || 0) + p.total.mp;
      if (p.total.mp < 500 || j.pr.mins < 500) continue;
      const w = Math.min(p.total.mp, j.pr.mins);
      const acc = ageAccBy[t][a] = ageAccBy[t][a] || { r: 0, w: 0, n: 0 };
      acc.r += (p.total.obpm + p.total.dbpm - j.o - j.d) * w; acc.w += w; acc.n++;
    }
  }
  const curveCache = {};
  const engineAgeCurve = (exclude) => {
    if (curveCache[exclude]) return curveCache[exclude];
    const acc = {}, mins = {};
    for (let t = T0; t <= LAST; t++) {
      if (t === exclude) continue;
      for (const [a, x] of Object.entries(ageAccBy[t])) { const c = acc[a] = acc[a] || { r: 0, w: 0, n: 0 }; c.r += x.r; c.w += x.w; c.n += x.n; }
      for (const [a, m] of Object.entries(ageMinBy[t])) mins[a] = (mins[a] || 0) + m;
    }
    const curve = {};
    for (let a = 20; a <= 36; a++) {
      const nb = [a - 1, a, a + 1].map(x => acc[x]).filter(Boolean);
      curve[a] = nb.reduce((s, x) => s + x.r, 0) / nb.reduce((s, x) => s + x.w, 0);
    }
    const M = Object.values(mins).reduce((s, m) => s + m, 0);
    const shift = Object.entries(mins).reduce((s, [a, m]) => s + curve[a] * m, 0) / M;
    for (let a = 20; a <= 36; a++) curve[a] = +(curve[a] - shift).toFixed(3);
    curve.shift = shift;
    curve.n = Object.values(acc).reduce((s, x) => s + x.n, 0);
    return (curveCache[exclude] = curve);
  };

  // Roles.
  const roleOf = (p, j) => {
    const b = bucket(p.pos);
    const rr = rook.role[b];
    if (!j.pr) return { usg: rr.usg, ast: rr.ast, trb: rookTrb, par3: rr.par3, tpa36: rr.fg3a / rr.m * 36, tpct: rr.fg3 / rr.fg3a, big: b === 'C' };
    const k = j.pr.mins / (j.pr.mins + ROLE_REGRESS_MIN);
    const mix = (x, y) => x * k + y * (1 - k);
    return {
      usg: mix(j.pr.role.usg, rr.usg), ast: mix(j.pr.role.ast, rr.ast), trb: mix(j.pr.role.trb, rookTrb), par3: mix(j.pr.role.par3, rr.par3),
      tpa36: j.pr.fg3a / j.pr.mins * 36, tpct: j.pr.fg3a >= 50 ? j.pr.fg3 / j.pr.fg3a : 0,
      big: b === 'C',
    };
  };
  // fit features from a list of {w (sum 5), role}
  const fitOf = (list) => {
    const S = (f) => list.reduce((s, x) => s + x.w * f(x.role), 0);
    const nsBig = S(r => (r.par3 < 0.10 && (r.big || r.trb >= 14)) ? 1 : 0);
    return {
      usg: S(r => r.usg) - 100,
      ast: S(r => r.ast),
      trb: S(r => r.trb),
      spacing: S(r => r.par3) / 5,
      shooters: S(r => (r.tpa36 >= 3.5 && r.tpct >= 0.35) ? 1 : 0),
      bigs: Math.max(0, nsBig - 1),
    };
  };
  const FEATS = ['usg', 'ast', 'trb', 'spacing', 'shooters', 'bigs'];

  // Realized fit of each team-season, from that season's own per-team role rates
  // (the fit each player's BPM was earned in).
  const realized = {};
  for (let s = FIRST; s <= LAST; s++) {
    realized[s] = {};
    const byTeam = {};
    for (const p of seasons[s].players.values()) for (const [t, r] of Object.entries(p.teams)) {
      if (!r.mp) continue;
      (byTeam[t] = byTeam[t] || []).push({ w: 5 * r.mp / seasons[s].teamMp[t], role: {
        usg: r.usg || 0, ast: r.ast || 0, trb: r.trb || 0, par3: r.par3 || 0,
        tpa36: r.fg3a / r.mp * 36, tpct: r.fg3a >= 25 ? r.fg3 / r.fg3a : 0, big: bucket(p.pos) === 'C' } });
    }
    for (const [t, list] of Object.entries(byTeam)) realized[s][t] = fitOf(list);
  }

  // Team-season rows.
  const rows = [];
  for (let t = T0; t <= LAST; t++) {
    const S = seasons[t];
    const byTeam = {};
    for (const p of S.players.values()) {
      const j = proj(p, t);
      const ag = ageOf(p);
      const o = j.o + (j.rookie ? 0 : ag.o), d = j.d + (j.rookie ? 0 : ag.d);
      const role = roleOf(p, j);
      const prev = seasons[t - 1].players.get(p.id);
      const prevTeam = prev ? Object.entries(prev.teams).sort((a, b) => b[1].mp - a[1].mp)[0] : null;
      // Team rows are chronological: first row = where he opened the season,
      // last row of last season = where he ended it.
      const firstTeam = Object.keys(p.teams)[0];
      const prevLast = prev ? Object.keys(prev.teams).slice(-1)[0] : null;
      for (const [team, r] of Object.entries(p.teams)) {
        if (!r.mp) continue;
        const w = 5 * r.mp / S.teamMp[team];
        (byTeam[team] = byTeam[team] || []).push({ w, o, d, oRaw: j.o, dRaw: j.d, role, age: p.age || 27,
          returning: !!(prev && prev.teams[team] && prev.teams[team].mp > 0), prevTeam: prevTeam ? prevTeam[0] : null,
          opening: firstTeam === team, openingReturn: firstTeam === team && prevLast === team });
      }
    }
    for (const [team, list] of Object.entries(byTeam)) {
      const W = list.reduce((s, x) => s + x.w, 0);   // = 5
      const f = fitOf(list);
      const leagueReal = {};
      FEATS.forEach(k => { leagueReal[k] = Object.values(realized[t - 1]).reduce((s, x) => s + x[k], 0) / 30; });
      const inherited = {};
      FEATS.forEach(k => { inherited[k] = list.reduce((s, x) => s + (x.w / W) * (x.prevTeam ? realized[t - 1][x.prevTeam][k] : leagueReal[k]), 0); });
      const row = {
        t, team, y: S.rating[team].nrtgAdj,
        opred: list.reduce((s, x) => s + x.w * x.o, 0), dpred: list.reduce((s, x) => s + x.w * x.d, 0),
        predRaw: list.reduce((s, x) => s + x.w * (x.oRaw + x.dRaw), 0),
        age: list.reduce((s, x) => s + x.w * x.age, 0) / W,
        continuity: list.reduce((s, x) => s + (x.returning ? x.w : 0), 0) / W,
        // Offseason continuity: among players who OPENED the season here, the
        // share of minutes from players who ended last season here. Mid-season
        // arrivals are left out, so deadline sell-offs cannot drive it.
        contOff: list.filter(x => x.opening).reduce((s, x) => s + (x.openingReturn ? x.w : 0), 0) / list.filter(x => x.opening).reduce((s, x) => s + x.w, 0),
        midArrivals: list.reduce((s, x) => s + (x.opening ? 0 : x.w), 0) / W,
      };
      row.contRaw = row.continuity; row.contOffRaw = row.contOff;
      FEATS.forEach(k => { row[k] = f[k]; row['d_' + k] = f[k] - inherited[k]; });
      row.trbRaw = f.trb;
      rows.push(row);
    }
  }
  // Centre every feature within its season (eras differ in 3-point volume etc.).
  const centred = ['age', 'continuity', 'contOff', 'midArrivals', ...FEATS, ...FEATS.map(k => 'd_' + k)];
  for (let t = T0; t <= LAST; t++) {
    const rs = rows.filter(r => r.t === t);
    for (const c of centred) { const m = rs.reduce((s, r) => s + r[c], 0) / rs.length; rs.forEach(r => { r[c] -= m; }); }
  }
  rows.forEach(r => { r.pred = r.opred + r.dpred; });
  const sd = (c) => { const m = rows.reduce((s, r) => s + r[c], 0) / rows.length; return Math.sqrt(rows.reduce((s, r) => s + (r[c] - m) ** 2, 0) / rows.length); };

  console.log(`\nTeam-seasons: ${rows.length} (${T0}–${LAST}); target = BRef adjusted net rating, SD ${sd('y').toFixed(2)}`);
  const base0 = ols(rows.map(r => [1, r.predRaw]), rows.map(r => r.y));
  const base1 = ols(rows.map(r => [1, r.pred]), rows.map(r => r.y));
  const base2 = ols(rows.map(r => [1, r.opred, r.dpred]), rows.map(r => r.y));
  console.log(`  prior BPM, no age adjustment      slope ${base0.coef[1].toFixed(3)}  in-sample RMSE ${base0.rmse.toFixed(2)}  CV ${cvRmse(rows.map(r => ({ ...r, x: r.predRaw })), ['x']).toFixed(3)}`);
  console.log(`  + age adjustment                  slope ${base1.coef[1].toFixed(3)}  in-sample RMSE ${base1.rmse.toFixed(2)}  CV ${cvRmse(rows, ['pred']).toFixed(3)}`);
  console.log(`  offense/defense separate          O ${base2.coef[1].toFixed(3)} ± ${base2.se[1].toFixed(3)}, D ${base2.coef[2].toFixed(3)} ± ${base2.se[2].toFixed(3)}  CV ${cvRmse(rows, ['opred', 'dpred']).toFixed(3)}`);

  const BASE = ['opred', 'dpred'];
  const baseCv = cvRmse(rows, BASE);
  console.log('\nFeature SD across team-seasons (after centring):');
  console.log('  ' + ['age', 'continuity', ...FEATS].map(c => `${c} ${sd(c).toFixed(2)}`).join(' · '));
  console.log('  ' + FEATS.map(k => `Δ${k} ${sd('d_' + k).toFixed(2)}`).join(' · '));

  const report = (title, sets) => {
    console.log(`\n${title}`);
    console.log('  added to O/D value           coef ± SE   (t)     effect of +1 SD   CV RMSE   vs base');
    for (const c of sets) {
      const cols = [...BASE, c];
      const fit = ols(rows.map(r => [1, ...cols.map(k => r[k])]), rows.map(r => r.y));
      const b = fit.coef[3], se = fit.se[3];
      const cv = cvRmse(rows, cols);
      console.log(`  ${c.padEnd(26)} ${b.toFixed(3).padStart(7)} ± ${se.toFixed(3)} (${(b / se).toFixed(1).padStart(4)})   ${(b * sd(c)).toFixed(2).padStart(6)} /100   ${cv.toFixed(3)}   ${(cv - baseCv >= 0 ? '+' : '') + (cv - baseCv).toFixed(3)}`);
    }
  };
  console.log(`\nBase (O/D value) CV RMSE ${baseCv.toFixed(3)} per 100`);
  report('One feature at a time — levels', ['age', 'continuity', ...FEATS]);
  report('One feature at a time — change vs the fit each player\'s BPM came from', FEATS.map(k => 'd_' + k));

  const joint = (title, cols, ridge = 0) => {
    const all = [...BASE, ...cols];
    const fit = ols(rows.map(r => [1, ...all.map(k => r[k])]), rows.map(r => r.y), ridge);
    const cv = cvRmse(rows, all, ridge);
    console.log(`\n${title}${ridge ? ` (ridge ${ridge})` : ''}: CV RMSE ${cv.toFixed(3)} (${(cv - baseCv >= 0 ? '+' : '') + (cv - baseCv).toFixed(3)} vs base)`);
    all.forEach((c, i) => console.log(`  ${c.padEnd(12)} ${fit.coef[i + 1].toFixed(3).padStart(7)} ± ${fit.se[i + 1].toFixed(3)}  (${(fit.coef[i + 1] / fit.se[i + 1]).toFixed(1)})`));
    const chem = rows.map(r => cols.reduce((s, c) => s + r[c] * fit.coef[all.indexOf(c) + 1], 0));
    const m = chem.reduce((a, b) => a + b, 0) / chem.length;
    const chemSd = Math.sqrt(chem.reduce((s, x) => s + (x - m) ** 2, 0) / chem.length);
    console.log(`  fitted fit-effect: SD ${chemSd.toFixed(2)} per 100, range ${Math.min(...chem).toFixed(1)} … ${Math.max(...chem).toFixed(1)}`);
    return { cols: all, coef: fit.coef, se: fit.se, cv, chem };
  };
  const jl = joint('All level features jointly', ['age', 'continuity', ...FEATS]);
  const jd = joint('All Δ features jointly', ['age', 'continuity', ...FEATS.map(k => 'd_' + k)]);
  const jr = joint('All Δ features jointly', ['age', 'continuity', ...FEATS.map(k => 'd_' + k)], 30);

  // Stability: refit on each half of the seasons.
  const halves = [[T0, Math.floor((T0 + LAST) / 2)], [Math.floor((T0 + LAST) / 2) + 1, LAST]];
  console.log('\nStability — Δ features fitted on each half of the seasons separately');
  for (const [a, b] of halves) {
    const sub = rows.filter(r => r.t >= a && r.t <= b);
    const cols = [...BASE, 'age', 'continuity', ...FEATS.map(k => 'd_' + k)];
    const fit = ols(sub.map(r => [1, ...cols.map(k => r[k])]), sub.map(r => r.y));
    console.log(`  ${a}–${b} (n=${sub.length}): ` + cols.slice(2).map((c, i) => `${c} ${fit.coef[i + 3].toFixed(2)}`).join(' · '));
  }

  // Continuity robustness.
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  console.log(`\nContinuity robustness (raw means: all-minutes ${mean(rows.map(r => r.contRaw)).toFixed(2)}, offseason ${mean(rows.map(r => r.contOffRaw)).toFixed(2)})`);
  report('  variants', ['contOff', 'midArrivals']);
  const both = ols(rows.map(r => [1, r.opred, r.dpred, r.contOff, r.midArrivals]), rows.map(r => r.y));
  console.log(`  offseason continuity ${both.coef[3].toFixed(2)} ± ${both.se[3].toFixed(2)} with mid-season arrivals ${both.coef[4].toFixed(2)} ± ${both.se[4].toFixed(2)} in the same fit`);
  const medPred = [...rows.map(r => r.pred)].sort((a, b) => a - b)[Math.floor(rows.length / 2)];
  for (const [lab, sub] of [['projected above median', rows.filter(r => r.pred >= medPred)], ['projected below median', rows.filter(r => r.pred < medPred)]]) {
    const f = ols(sub.map(r => [1, r.opred, r.dpred, r.contOff]), sub.map(r => r.y));
    console.log(`  ${lab.padEnd(24)} offseason continuity ${f.coef[3].toFixed(2)} ± ${f.se[3].toFixed(2)} (n=${sub.length})`);
  }
  const tr = ols(rows.map(r => [1, r.opred, r.dpred, r.contOff, r.trb]), rows.map(r => r.y));
  console.log(`  joint: offseason continuity ${tr.coef[3].toFixed(2)} ± ${tr.se[3].toFixed(2)}, rebounding overlap ${tr.coef[4].toFixed(3)} ± ${tr.se[4].toFixed(3)}; CV ${cvRmse(rows, ['opred', 'dpred', 'contOff', 'trb']).toFixed(3)} vs base ${baseCv.toFixed(3)}`);
  for (const [a, b] of halves) {
    const sub = rows.filter(r => r.t >= a && r.t <= b);
    const f = ols(sub.map(r => [1, r.opred, r.dpred, r.contOff, r.trb]), sub.map(r => r.y));
    console.log(`    ${a}–${b}: continuity ${f.coef[3].toFixed(2)} ± ${f.se[3].toFixed(2)}, rebounding ${f.coef[4].toFixed(3)} ± ${f.se[4].toFixed(3)}`);
  }
  for (const s of [...new Set(rows.map(r => r.t))]) {
    const sub = rows.filter(r => r.t === s);
    const f = ols(sub.map(r => [1, r.opred, r.dpred, r.contOff]), sub.map(r => r.y));
    process.stdout.write(`${s === T0 ? '  by season, continuity: ' : ''}${s} ${f.coef[3].toFixed(1)}${s === LAST ? '\n' : ' · '}`);
  }

  // Biggest residuals, for sanity.
  const fitB = ols(rows.map(r => [1, r.opred, r.dpred]), rows.map(r => r.y));
  const withRes = rows.map((r, i) => ({ ...r, res: fitB.resid[i] })).sort((a, b) => a.res - b.res);
  console.log('\nLargest misses of the O/D value model (actual − predicted, per 100):');
  console.log('  under-performed: ' + withRes.slice(0, 6).map(r => `${r.team} ${r.t} ${r.res.toFixed(1)}`).join(', '));
  console.log('  over-performed:  ' + withRes.slice(-6).reverse().map(r => `${r.team} ${r.t} +${r.res.toFixed(1)}`).join(', '));

  // ── What the engine uses ──────────────────────────────────
  // The two features that held up: offseason continuity and rebounding
  // overlap, fitted jointly, each shrunk by (1 − 1/t²) toward zero to
  // allow for having tested seven candidates.
  const finalCols = ['opred', 'dpred', 'contOff', 'trb'];
  const fin = ols(rows.map(r => [1, ...finalCols.map(c => r[c])]), rows.map(r => r.y));
  const shrink = (i) => { const t = fin.coef[i] / fin.se[i]; return Math.max(0, 1 - 1 / (t * t)); };
  const latest = rows.filter(r => r.t === LAST);
  const out = {
    continuity: { perUnit: +(fin.coef[3] * shrink(3)).toFixed(3), mean: +mean(latest.map(r => r.contOffRaw)).toFixed(3) },
    rebounding: { perPoint: +(fin.coef[4] * shrink(4)).toFixed(4), mean: +mean(latest.map(r => r.trbRaw)).toFixed(2),
      rookieTrb: +rookTrb.toFixed(2), regressMinutes: ROLE_REGRESS_MIN },
    meta: {
      generated: new Date().toISOString().slice(0, 10),
      seasons: `${T0 - 1}-${String(T0).slice(2)} … ${LAST - 1}-${String(LAST).slice(2)}`, teamSeasons: rows.length,
      target: 'Basketball-Reference adjusted net rating per 100 possessions',
      fitted: { continuity: { coef: +fin.coef[3].toFixed(3), se: +fin.se[3].toFixed(3), shrink: +shrink(3).toFixed(3) },
        rebounding: { coef: +fin.coef[4].toFixed(4), se: +fin.se[4].toFixed(4), shrink: +shrink(4).toFixed(3) } },
      cvRmse: { playerValueOnly: +baseCv.toFixed(3), withFit: +cvRmse(rows, finalCols).toFixed(3) },
      notDetected: Object.fromEntries(['usg', 'ast', 'spacing', 'shooters', 'bigs'].map(c => {
        const f = ols(rows.map(r => [1, r.opred, r.dpred, r[c]]), rows.map(r => r.y));
        return [c, { coef: +f.coef[3].toFixed(3), se: +f.se[3].toFixed(3) }];
      })),
    },
  };
  console.log(`\nEngine coefficients (per 100 possessions): continuity ${out.continuity.perUnit} per unit share (league mean ${out.continuity.mean}), rebounding ${out.rebounding.perPoint} per on-floor TRB% point (league mean ${out.rebounding.mean})`);

  // ── Part 3: replay the live engine's season-start projection ─────────
  // For each team-season, the engine at opening night (no games yet):
  //   retention × last season's net rating
  //   + roster:  Σ value × (availability − share in last season's rating)
  //              − departed players' value × share          (cap ±12)
  //   + aging:   Σ share × (value at aged BPM − value at last season's BPM)
  //   + fit:     continuity and rebounding overlap           (cap ±2)
  // value = max(0, BPM + 2) × mpg/48 × 0.885, per 100 possessions.
  // Hindsight inputs (each player's actual games and minutes) isolate the
  // value logic from availability guessing. The age curve and the fit
  // coefficients are re-estimated without the season being scored.
  const G = (t, T) => seasons[t].rating[T].games;
  const val = (bpm, mpg) => Math.max(0, bpm - REPL) * mpg / 48 * 0.885;
  const replay = [];
  const rowBy = new Map(rows.map(r => [`${r.t}|${r.team}`, r]));
  for (let t = T0; t <= LAST; t++) {
    const S = seasons[t], Sp = seasons[t - 1];
    for (const T of Object.keys(S.teamMp)) {
      const items = [], departed = [];
      for (const p of S.players.values()) {
        const r = p.teams[T];
        if (!r || !r.mp || !r.g) continue;
        const prev = Sp.players.get(p.id), pr = prev && prev.teams[T];
        const j = proj(p, t);
        items.push({ bpm: j.o + j.d, rookie: j.rookie, age: p.age, mpg: r.mp / r.g, avail: Math.min(1, r.g / G(t, T)),
          share: pr && pr.g ? Math.min(1, pr.g / G(t - 1, T)) : 0 });
      }
      for (const p of Sp.players.values()) {
        const pr = p.teams[T];
        if (!pr || !pr.g || !pr.mp) continue;
        const now = S.players.get(p.id);
        if (now && now.teams[T] && now.teams[T].mp) continue;
        const j = proj(p, t);
        departed.push({ bpm: j.o + j.d, mpg: pr.mp / pr.g, share: Math.min(1, pr.g / G(t - 1, T)) });
      }
      replay.push({ t, T, y: S.rating[T].nrtgAdj, prior: Sp.rating[T].nrtgAdj, items, departed, fitRow: rowBy.get(`${t}|${T}`) });
    }
  }
  // Leave-one-season-out fit coefficients (same shrinkage as the engine's).
  const fitBy = {};
  for (let t = T0; t <= LAST; t++) {
    const tr2 = rows.filter(r => r.t !== t);
    const f = ols(tr2.map(r => [1, ...finalCols.map(c => r[c])]), tr2.map(r => r.y));
    const sh = (i) => { const z = f.coef[i] / f.se[i]; return Math.max(0, 1 - 1 / (z * z)); };
    fitBy[t] = { c: f.coef[3] * sh(3), r: f.coef[4] * sh(4) };
  }
  const project = (x, o) => {
    const curve = engineAgeCurve(x.t);
    let roster = 0, aging = 0;
    for (const it of x.items) {
      const shift = it.rookie || it.age == null ? 0 : o.k * curve[Math.max(20, Math.min(36, it.age))];
      const vA = val(it.bpm + shift, it.mpg), vU = val(it.bpm, it.mpg);
      roster += (o.ageRoster === false ? vU : vA) * (it.avail - it.share);
      // Aging of the rating's players: share of last season's rating he carried,
      // times the share of this season's games he is available for.
      if (o.ageRating !== false) aging += it.share * (o.ageAvail ? it.avail : 1) * (vA - vU);
    }
    for (const d of x.departed) roster -= val(d.bpm, d.mpg) * d.share;
    roster = Math.max(-12, Math.min(12, roster));
    const fb = fitBy[x.t];
    const fit = Math.max(-2, Math.min(2, fb.c * x.fitRow.contOff + fb.r * x.fitRow.trb));
    return o.ret * x.prior + (o.roster ? roster : 0) + aging + (o.fit ? fit : 0);
  };
  const evalReplay = (o) => {
    const err = replay.map(x => x.y - project(x, o));
    const rmse = Math.sqrt(err.reduce((s, e) => s + e * e, 0) / err.length);
    const p = replay.map(x => project(x, o));
    const f = ols(p.map(v => [1, v]), replay.map(x => x.y));
    return { rmse, bias: -err.reduce((s, e) => s + e, 0) / err.length, slope: f.coef[1], err };
  };
  const ENGINE = { ret: SEASON_PRIOR_RETENTION_ENGINE, roster: true, fit: true, k: 0 };
  const pairedVs = (a, b) => {
    const d = a.err.map((e, i) => e * e - b.err[i] * b.err[i]);
    const m = d.reduce((s, x) => s + x, 0) / d.length;
    const sdv = Math.sqrt(d.reduce((s, x) => s + (x - m) ** 2, 0) / (d.length - 1));
    return `${m >= 0 ? '+' : ''}${m.toFixed(3)} ± ${(sdv / Math.sqrt(d.length)).toFixed(3)}`;
  };
  console.log(`\nEngine replay at opening night, ${replay.length} team-seasons (RMSE vs adjusted net rating per 100; slope = fitted y on projection, 1.0 is ideal)`);
  const show = (label, o, ref) => {
    const e = evalReplay(o);
    console.log(`  ${label.padEnd(52)} RMSE ${e.rmse.toFixed(3)}  bias ${e.bias >= 0 ? '+' : ''}${e.bias.toFixed(2)}  slope ${e.slope.toFixed(2)}${ref ? `   ΔMSE vs engine ${pairedVs(e, ref)}` : ''}`);
    return e;
  };
  show('last season × 0.80 only', { ...ENGINE, roster: false, fit: false });
  show('+ roster vs rating', { ...ENGINE, fit: false });
  const eng = show('+ roster fit  (= current engine)', ENGINE);
  show('+ aging, full curve  (proposed)', { ...ENGINE, k: 1 }, eng);
  for (const k of [0.5, 1.5, 2]) show(`  aging × ${k}`, { ...ENGINE, k }, eng);
  show('  proposed without roster fit', { ...ENGINE, k: 1, fit: false }, eng);
  console.log('  retention (last season\'s rating kept), with and without aging:');
  for (const ret of [0.6, 0.7, 0.8, 0.9, 1.0]) {
    const a = evalReplay({ ...ENGINE, ret }), b = evalReplay({ ...ENGINE, ret, k: 1 });
    console.log(`    ${ret.toFixed(1)}   no aging RMSE ${a.rmse.toFixed(3)} slope ${a.slope.toFixed(2)}   aging RMSE ${b.rmse.toFixed(3)} slope ${b.slope.toFixed(2)}`);
  }
  show('  aging on the rating\'s returning players only', { ...ENGINE, k: 1, ageRoster: false }, eng);
  show('  aging on arrivals/absences only', { ...ENGINE, k: 1, ageRating: false }, eng);

  // Honest tuning: choose (aging strength, retention) on the other seasons,
  // score the held-out season; compare with tuning retention alone.
  const grid = [];
  for (const k of [0, 0.25, 0.5, 0.75, 1]) for (const ret of [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9]) {
    grid.push({ ...ENGINE, k, ret });
    if (k) grid.push({ ...ENGINE, k, ret, ageRoster: false });
    if (k) grid.push({ ...ENGINE, k, ret, ageRoster: false, ageAvail: true });
  }
  const sqErr = grid.map(o => replay.map(x => (x.y - project(x, o)) ** 2));
  const loso = (allowed) => {
    const errs = [], picks = [];
    for (let t = T0; t <= LAST; t++) {
      let best = null, bestSe = Infinity;
      grid.forEach((o, gi) => {
        if (!allowed(o)) return;
        const se = replay.reduce((s, x, i) => s + (x.t === t ? 0 : sqErr[gi][i]), 0);
        if (se < bestSe) { bestSe = se; best = gi; }
      });
      picks.push(`${grid[best].k}/${grid[best].ret}`);
      replay.forEach((x, i) => { if (x.t === t) errs.push(sqErr[best][i]); });
    }
    return { rmse: Math.sqrt(errs.reduce((s, e) => s + e, 0) / errs.length), errs, picks };
  };
  const paired = (a, b) => {
    const dd = a.errs.map((e, i) => e - b.errs[i]);
    const dm = dd.reduce((s, x) => s + x, 0) / dd.length, dsd = Math.sqrt(dd.reduce((s, x) => s + (x - dm) ** 2, 0) / (dd.length - 1));
    return `${dm >= 0 ? '+' : ''}${dm.toFixed(3)} ± ${(dsd / Math.sqrt(dd.length)).toFixed(3)}`;
  };
  const engE = evalReplay(ENGINE);
  const engL = { errs: engE.err.map(e => e * e) };
  const lRet = loso(o => o.k === 0), lBoth = loso(o => o.ageRoster !== false && !o.ageAvail),
    lRating = loso(o => o.k === 0 || (o.ageRoster === false && !o.ageAvail)), lAvail = loso(o => o.k === 0 || o.ageAvail);
  const pk = (l) => [...new Set(l.picks)].join(', ');
  console.log('  out-of-sample tuning (each season scored with settings chosen on the other ten; ΔMSE vs current engine):');
  console.log(`    current engine (aging 0, retention 0.80)          RMSE ${engE.rmse.toFixed(3)}`);
  console.log(`    retention tuned, no aging                         RMSE ${lRet.rmse.toFixed(3)}  ${paired(lRet, engL)}   picks ${pk(lRet)}`);
  console.log(`    retention + aging everywhere tuned                RMSE ${lBoth.rmse.toFixed(3)}  ${paired(lBoth, engL)}   picks aging/ret ${pk(lBoth)}`);
  console.log(`    retention + aging on returning players tuned      RMSE ${lRating.rmse.toFixed(3)}  ${paired(lRating, engL)}   picks aging/ret ${pk(lRating)}`);
  console.log(`    … weighted by availability (engine form)          RMSE ${lAvail.rmse.toFixed(3)}  ${paired(lAvail, engL)}   picks aging/ret ${pk(lAvail)}`);
  console.log(`    returning-player aging vs retention alone: ΔMSE ${paired(lRating, lRet)}; availability-weighted ${paired(lAvail, lRet)}`);
  for (const o of [{ ...ENGINE, ret: 0.75 }, { ...ENGINE, ret: 0.75, k: 1, ageRoster: false, ageAvail: true }]) {
    const e = evalReplay(o);
    console.log(`    full sample ${o.k ? 'aging 1.0 avail-weighted' : 'no aging'}, retention 0.75: RMSE ${e.rmse.toFixed(3)} bias ${e.bias.toFixed(2)} slope ${e.slope.toFixed(2)}`);
  }
  const gridLine = (pred) => grid.map((o, gi) => [o, gi]).filter(([o]) => pred(o)).map(([, gi]) => Math.sqrt(sqErr[gi].reduce((s, e) => s + e, 0) / replay.length).toFixed(3)).join('  ');
  console.log('  full-sample grid (RMSE):          retention → ' + [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9].join('    '));
  for (const k of [0, 0.25, 0.5, 0.75, 1]) console.log(`    aging ${k.toFixed(2)} everywhere           ` + gridLine(o => o.k === k && o.ageRoster !== false));
  for (const k of [0.25, 0.5, 0.75, 1]) console.log(`    aging ${k.toFixed(2)} returning only      ` + gridLine(o => o.k === k && o.ageRoster === false && !o.ageAvail));
  for (const k of [0.25, 0.5, 0.75, 1]) console.log(`    aging ${k.toFixed(2)} ret. × available    ` + gridLine(o => o.k === k && o.ageAvail));

  // The design the engine uses (chosen out of sample above).
  const CHOSEN = { ...ENGINE, ret: 0.75, k: 1, ageRoster: false, ageAvail: true };
  const full = engineAgeCurve(null);
  console.log(`  age curve (all seasons, total BPM, centred; raw mean shift ${full.shift.toFixed(2)} removed; n=${full.n}): ` +
    Array.from({ length: 17 }, (_, i) => 20 + i).map(a => `${a} ${full[a] >= 0 ? '+' : ''}${full[a].toFixed(2)}`).join(' · '));

  if (argv.includes('--write')) {
    const agingFile = path.join(__dirname, 'js/season/data/aging-fit.js');
    const agingOut = {
      byAge: Object.fromEntries(Array.from({ length: 17 }, (_, i) => 20 + i).map(a => [a, full[a]])),
      meta: {
        generated: out.meta.generated, seasons: out.meta.seasons, playerSeasons: full.n,
        definition: 'actual BPM − prior BPM (seasons 1.0/0.5, regressed to −2 over 300 min), by BRef age in the projected season; '
          + 'minutes-weighted, 3-age smoothing, centred on the minutes-weighted mean',
        engineUse: 'aging of last season\'s rating only: Σ (1 − w) × share in last season\'s rating × availability × value change; '
          + 'arrivals keep their prior value (aging them made the replay worse); retention 0.80 → 0.75',
        replay: {
          teamSeasons: replay.length,
          before: { retention: 0.8, rmse: +eng.rmse.toFixed(3) },
          after: { retention: CHOSEN.ret, rmse: +evalReplay(CHOSEN).rmse.toFixed(3) },
          outOfSample: { retentionOnly: +lRet.rmse.toFixed(3), withAging: +lAvail.rmse.toFixed(3) },
        },
      },
    };
    fs.writeFileSync(agingFile, `// Generated by research-team-fit.js --write on ${out.meta.generated}. Do not edit by hand.\n` +
      `// Expected change in a player's BPM from his prior, by age this season (BRef age on Feb 1).\n` +
      `const SEASON_AGING_FIT = ${JSON.stringify(agingOut, null, 2)};\n`);
    console.log(`Wrote ${path.relative(__dirname, agingFile)}`);
    const file = path.join(__dirname, 'js/season/data/chemistry-fit.js');
    fs.writeFileSync(file, `// Generated by research-team-fit.js --write on ${out.meta.generated}. Do not edit by hand.\n` +
      `// Roster-fit coefficients fitted on ${out.meta.teamSeasons} team-seasons (${out.meta.seasons}); see the script header.\n` +
      `const SEASON_CHEMISTRY_FIT = ${JSON.stringify(out, null, 2)};\n`);
    console.log(`Wrote ${path.relative(__dirname, file)}`);
  }

  if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify({ rows, oRepl, dRepl, rookO, rookD, ageAdj, levels: jl, deltas: jd, ridge: jr }, null, 1));
}

main().catch(e => { console.error('research-team-fit failed:', e.message); process.exit(1); });
