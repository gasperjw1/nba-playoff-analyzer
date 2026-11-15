#!/usr/bin/env node
// ============================================================
// research-matchup.js — advanced and situational team stats vs the close (matchup-1)
// ============================================================
// Pre-registered in MATCHUP_RESEARCH.md (committed before this was first run).
// Part A: the settled season-ledger games, scored against the DraftKings close.
// Team profiles come from ESPN box scores of 2026-27 regular-season games on
// dates before each game (leak-free), shrunk to the league mean with k = 5.
//
//   node research-matchup.js            Part A on the settled ledger
//   node research-matchup.js --games    also list every game's features
//   node research-matchup.js --fetch-hist   fetch 2023-24 → 2025-26 team box lines (.cache/espn-nba/hist-team)
//   node research-matchup.js --part-b   Part B: train 2023-24 + 2024-25, holdout 2025-26, against the close
//                                       (MATCHUP_MIN_PRIOR, default 4: prior games each team needs; not pre-registered)
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const CACHE = path.join(__dirname, '.cache/espn-nba');
const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/';
const FIRST = '2026-10-20';
const K = +(process.env.MATCHUP_K || 5), HCA = 2.0, SIGMA = 12.5;   // MATCHUP_K: robustness only (k = 5 is pre-registered)
const has = (f) => process.argv.includes(f);
const addDays = (d, n) => new Date(Date.parse(d + 'T12:00:00Z') + n * 864e5).toISOString().slice(0, 10);

// Cached only when keep(json) holds, as in fetch-slate.js: a scoreboard caught mid-evening is
// fetched again next time rather than missing its late games for good.
async function cachedJson(file, url, keep = () => true) {
  const f = path.join(CACHE, file);
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const j = await res.json();
  if (keep(j)) fs.writeFileSync(f, JSON.stringify(j));
  return j;
}
const allCompleted = (sb) => (sb.events || []).length > 0 && sb.events.every(e => e.status && e.status.type && e.status.type.completed);

function loadLedger() {
  const c = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'js/season/data/season-ledger.js'), 'utf8').replace(/^(const|let) /gm, 'var '), c);
  return c.SEASON_LEDGER;
}

// ── box scores → team-games ─────────────────────────────────────────
const split = (v) => String(v).split('-').map(Number);
function teamLine(t) {
  const s = Object.fromEntries(t.statistics.map(x => [x.name, x.displayValue]));
  const [fgm, fga] = split(s['fieldGoalsMade-fieldGoalsAttempted']);
  const [tpm, tpa] = split(s['threePointFieldGoalsMade-threePointFieldGoalsAttempted']);
  const [ftm, fta] = split(s['freeThrowsMade-freeThrowsAttempted']);
  return { fgm, fga, tpm, tpa, ftm, fta, oreb: +s.offensiveRebounds, dreb: +s.defensiveRebounds,
    tov: +(s.totalTurnovers ?? s.turnovers), pip: +s.pointsInPaint, fb: +s.fastBreakPoints };
}

// One completed game → { id, date, home, away, hs, as, H, A } with each side's line and quarters.
function adaptGame(sum, date) {
  const comp = sum.header.competitions[0];
  const side = (ha) => comp.competitors.find(c => c.homeAway === ha);
  const h = side('home'), a = side('away');
  const box = (abbr) => sum.boxscore.teams.find(t => t.team.abbreviation === abbr);
  const bh = box(h.team.abbreviation), ba = box(a.team.abbreviation);
  if (!bh || !ba) return null;
  const q = (c) => (c.linescores || []).map(x => +(x.displayValue ?? x.value));
  return { id: String(sum.header.id), date, home: h.team.abbreviation, away: a.team.abbreviation, hs: +h.score, as: +a.score,
    H: { ...teamLine(bh), pts: +h.score, q: q(h) }, A: { ...teamLine(ba), pts: +a.score, q: q(a) } };
}

async function seasonGames(through) {
  const games = [];
  for (let d = FIRST; d <= through; d = addDays(d, 1)) {
    const sb = await cachedJson(`scoreboard-${d}.json`, `${ESPN}scoreboard?dates=${d.replace(/-/g, '')}`, allCompleted);
    for (const e of sb.events || []) {
      if (!e.status.type.completed || (e.season && e.season.type !== 2)) continue;
      const g = adaptGame(await cachedJson(`summary-${e.id}.json`, `${ESPN}summary?event=${e.id}`), d);
      if (g) games.push(g);
    }
  }
  return games;
}

// Per team-game stats: the team's own (offence) with its opponent's line for ORB% and possessions.
function teamGame(o, d, home, g) {
  const possO = o.fga - o.oreb + o.tov + 0.44 * o.fta, possD = d.fga - d.oreb + d.tov + 0.44 * d.fta;
  const poss = (possO + possD) / 2;
  const half = (q) => [q[0] + q[1], q[2] + q[3]];
  const [o1, o2] = half(o.q), [d1, d2] = half(d.q);
  const after3 = (o.q[0] + o.q[1] + o.q[2]) - (d.q[0] + d.q[1] + d.q[2]);
  return {
    poss, ortg: 100 * o.pts / poss, drtg: 100 * d.pts / poss, net: 100 * (o.pts - d.pts) / poss,
    efg: (o.fgm + 0.5 * o.tpm) / o.fga, tovp: o.tov / (o.fga + 0.44 * o.fta + o.tov), orbp: o.oreb / (o.oreb + d.dreb), ftr: o.ftm / o.fga,
    tpar: o.tpa / o.fga, tpp: o.tpa ? o.tpm / o.tpa : null, ftp: o.fta ? o.ftm / o.fta : null, paint: o.pip / o.pts, fbr: o.fb / poss,
    h1: o1 - d1, h2: o2 - d2, q4close: Math.abs(after3) <= 6 ? o.q[3] - d.q[3] : null, home, date: g.date,
  };
}

const OFF = ['efg', 'tovp', 'orbp', 'ftr', 'tpar', 'tpp', 'ftp', 'paint', 'fbr'];
const mean = (xs) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
const shrink = (xs, prior, k = K) => (xs.reduce((a, b) => a + b, 0) + k * prior) / (xs.length + k);

// ── linear algebra ──────────────────────────────────────────────────
function ols(X, y) {
  const p = X[0].length, A = Array.from({ length: p }, () => Array(p + 1).fill(0));
  for (let i = 0; i < X.length; i++) for (let a = 0; a < p; a++) { for (let b = 0; b < p; b++) A[a][b] += X[i][a] * X[i][b]; A[a][p] += X[i][a] * y[i]; }
  for (let c = 0; c < p; c++) {
    let piv = c; for (let r = c + 1; r < p; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    [A[c], A[piv]] = [A[piv], A[c]];
    for (let r = 0; r < p; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k <= p; k++) A[r][k] -= f * A[c][k]; }
  }
  return A.map((row, i) => row[p] / row[i]);
}
function slope(x, y) {
  const n = x.length, mx = mean(x), my = mean(y);
  let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; sxy += (x[i] - mx) * (y[i] - my); }
  const b = sxy / sxx, a = my - b * mx;
  let ssr = 0, sst = 0; for (let i = 0; i < n; i++) { ssr += (y[i] - a - b * x[i]) ** 2; sst += (y[i] - my) ** 2; }
  const se = Math.sqrt(ssr / (n - 2) / sxx);
  return { n, b, se, t: b / se, r2: 1 - ssr / sst };
}

// ── profiles before a date ──────────────────────────────────────────
function profiles(games, date) {
  const prior = games.filter(g => g.date < date);
  const rows = {};   // team → [{ off, def }]
  for (const g of prior) {
    const h = teamGame(g.H, g.A, true, g), a = teamGame(g.A, g.H, false, g);
    (rows[g.home] = rows[g.home] || []).push({ off: h, def: a, opp: g.away });
    (rows[g.away] = rows[g.away] || []).push({ off: a, def: h, opp: g.home });
  }
  const all = Object.values(rows).flat().map(r => r.off);
  // Too early in a season to fit (opening nights): no profiles, so the games are not scored.
  if (all.length < 20) return { P: {}, league: null, beta: null, prior };
  const league = Object.fromEntries([...OFF, 'poss', 'ortg', 'net', 'h1', 'h2'].map(k => [k, mean(all.map(x => x[k]).filter(v => v != null))]));
  // Four-factor fit on the prior team-games only: offensive rating on eFG, TOV%, ORB%, FT rate.
  const beta = ols(all.map(x => [1, x.efg, x.tovp, x.orbp, x.ftr]), all.map(x => x.ortg));
  const P = {};
  for (const [t, rs] of Object.entries(rows)) {
    const take = (side, k) => rs.map(r => r[side][k]).filter(v => v != null);
    const off = Object.fromEntries(OFF.map(k => [k, shrink(take('off', k), league[k])]));
    const def = Object.fromEntries(OFF.map(k => [k, shrink(take('def', k), league[k])]));
    const nets = rs.map(r => r.off.net), overall = shrink(nets, 0);
    P[t] = { off, def, pace: shrink(take('off', 'poss'), league.poss), overall, games: rs, n: rs.length };
  }
  // Opponent strength at the time is approximated by the opponent's prior net through this date.
  return { P, league, beta, prior };
}

function situational(prof, team, ctx) {
  const T = prof.P[team]; if (!T) return null;
  const rs = T.games, all = T.overall;
  const sub = (f) => shrink(rs.filter(f).map(r => r.off.net), all);
  const venue = (ctx.home ? sub(r => r.off.home) : sub(r => !r.off.home)) - all;
  // Back-to-back games: a game on the day after the team's previous game.
  const dates = rs.map(r => r.off.date);
  const b2bOf = (r, i) => i > 0 && addDays(dates[i - 1], 1) === r.off.date;
  const b2bNets = rs.filter(b2bOf).map(r => r.off.net), restNets = rs.filter((r, i) => !b2bOf(r, i)).map(r => r.off.net);
  const rest = ctx.b2b ? shrink(b2bNets, all) - shrink(restNets, all) : 0;
  const strong = (opp) => prof.P[opp] && prof.P[opp].overall > 0;
  const vsOpp = (strong(ctx.opp) ? sub(r => strong(r.opp)) : sub(r => !strong(r.opp))) - all;
  const halves = shrink(rs.map(r => r.off.h2 - r.off.h1), 0);
  const last5 = rs.slice(-5).map(r => r.off.net), form = shrink(last5, all) - all;
  const close = shrink(rs.map(r => r.off.q4close).filter(v => v != null), 0);
  return { venue, rest, vsOpp, halves, form, close, b2bGames: b2bNets.length };
}

// ── main ────────────────────────────────────────────────────────────
// Features for each row { id, date, home, away, close: { spreadHome, mlHome, mlAway }, pMarket, pOurs, marginOurs }
// against one season's games. minPrior: games each team needs before the date to be scored.
function score(games, rows, minPrior = 1) {
  const byId = new Map(games.map(g => [g.id, g]));
  const played = {};   // team → sorted dates
  for (const g of games) for (const t of [g.home, g.away]) (played[t] = played[t] || []).push(g.date);
  const lastPlayed = (team, date) => (played[team] || []).filter(d => d < date).pop();
  const out = [], missing = [];
  const cache = new Map();
  for (const r of rows) {
    const g = byId.get(String(r.id));
    if (!g || g.home !== r.home || g.away !== r.away) { missing.push(`${r.date} ${r.away}@${r.home}`); continue; }
    if (!cache.has(r.date)) cache.set(r.date, profiles(games, r.date));
    const prof = cache.get(r.date), { P, league, beta } = prof;
    const H = P[r.home], A = P[r.away];
    if (!H || !A || H.n < minPrior || A.n < minPrior) { missing.push(`${r.date} ${r.away}@${r.home} (too few prior games)`); continue; }
    const actual = g.hs - g.as, mkt = -r.close.spreadHome;
    // Q1 shooting luck against each team's own shrunk prior.
    const tg = { H: teamGame(g.H, g.A, true, g), A: teamGame(g.A, g.H, false, g) };
    const luck = (t, x, l) => (x.tpa ? (x.tpm / x.tpa - t.off.tpp) * x.tpa * 3 : 0) + (x.fta ? (x.ftm / x.fta - t.off.ftp) * x.fta : 0);
    const netLuck = luck(H, g.H, league) - luck(A, g.A, league);
    // Q2a four-factor expected margin.
    const ff = (o, d) => ['efg', 'tovp', 'orbp', 'ftr'].map(k => o.off[k] + d.def[k] - league[k]);
    const rating = (f) => beta[0] + beta[1] * f[0] + beta[2] * f[1] + beta[3] * f[2] + beta[4] * f[3];
    const poss = (H.pace + A.pace) / 2;
    const ffMargin = (rating(ff(H, A)) - rating(ff(A, H))) * poss / 100 + HCA;
    // Q2b–f interactions: the multiplicative (log5) correction over additive, home offence minus away offence.
    const inter = (k) => (H.off[k] - league[k]) * (A.def[k] - league[k]) - (A.off[k] - league[k]) * (H.def[k] - league[k]);
    // Q3 situational.
    const hB2b = addDays(lastPlayed(r.home, r.date) || '1900-01-01', 1) === r.date, aB2b = addDays(lastPlayed(r.away, r.date) || '1900-01-01', 1) === r.date;
    const sh = situational(prof, r.home, { home: true, b2b: hB2b, opp: r.away }), sa = situational(prof, r.away, { home: false, b2b: aB2b, opp: r.home });
    const pClose = r.close.mlHome != null && r.close.mlAway != null ? noVig(r.close.mlHome, r.close.mlAway) : r.pMarket;
    out.push({ r, g, actual, mkt, resid: actual - mkt, residEng: r.marginOurs != null ? actual - r.marginOurs : null, pClose, netLuck, ffGap: ffMargin - mkt, ffMargin,
      reb: inter('orbp'), three: inter('tpar'), rim: inter('paint'), tov: inter('tovp'), trans: inter('fbr'),
      venue: sh.venue - sa.venue, rest: sh.rest - sa.rest, vsOpp: sh.vsOpp - sa.vsOpp, halves: sh.halves - sa.halves, form: sh.form - sa.form, close: sh.close - sa.close,
      threeRate: H.off.tpar + A.off.tpar, hB2b, aB2b, nH: H.n, nA: A.n,
      margins: { tov: g.A.tov - g.H.tov, oreb: g.H.oreb - g.A.oreb, fta: g.H.fta - g.A.fta, pip: g.H.pip - g.A.pip, tp: (g.H.tpm / g.H.tpa) - (g.A.tpm / g.A.tpa) } });
  }
  return { out, missing, cache };
}

async function main() {
  const ledger = loadLedger().filter(r => r.result && r.result.homeScore != null && r.pMarket != null && r.close && r.close.spreadHome != null);
  const through = ledger.reduce((m, r) => (r.date > m ? r.date : m), FIRST);
  const games = await seasonGames(through);
  const { out, missing, cache } = score(games, ledger);

  console.log(`matchup-1 Part A: ${out.length} settled games (${ledger[0].date} → ${through}); ${games.length} season games for profiles; k = ${K}`);
  if (missing.length) console.log(`  not scored: ${missing.join(', ')}`);
  const sd = (xs) => Math.sqrt(mean(xs.map(x => (x - mean(xs)) ** 2)));
  console.log(`  residual vs close: mean ${mean(out.map(o => o.resid)).toFixed(2)}, sd ${sd(out.map(o => o.resid)).toFixed(2)} · vs engine: mean ${mean(out.map(o => o.residEng)).toFixed(2)}, sd ${sd(out.map(o => o.residEng)).toFixed(2)}`);
  console.log(`  prior games per team at scoring: median ${median(out.flatMap(o => [o.nH, o.nA]))}, min ${Math.min(...out.flatMap(o => [o.nH, o.nA]))}`);
  // Sanity: the last scoring date's league values and four-factor fit, and how the margins track the close.
  const last = cache.get(through) || [...cache.values()].pop();
  const L = last.league;
  console.log(`  league (before ${through}): pace ${L.poss.toFixed(1)}, ORtg ${L.ortg.toFixed(1)}, eFG ${L.efg.toFixed(3)}, TOV% ${L.tovp.toFixed(3)}, ORB% ${L.orbp.toFixed(3)}, FTr ${L.ftr.toFixed(3)}, 3P% ${L.tpp.toFixed(3)}`);
  console.log(`  four-factor fit: ORtg = ${last.beta.map(b => b.toFixed(1)).join(' / ')} (const, eFG, TOV%, ORB%, FTr)`);
  const corr = (x, y) => { const s = slope(x, y); return Math.sign(s.b) * Math.sqrt(s.r2); };
  console.log(`  correlation with the market margin: four-factor ${corr(out.map(o => o.ffMargin), out.map(o => o.mkt)).toFixed(2)}, engine ${corr(out.map(o => o.r.marginOurs), out.map(o => o.mkt)).toFixed(2)}`);

  const show = (id, label, key, target = 'resid') => {
    const s = slope(out.map(o => o[key]), out.map(o => o[target]));
    const flag = Math.abs(s.t) >= 2.9 ? ' NOTABLE' : Math.abs(s.t) >= 2 ? ' log forward' : '';
    console.log(`  ${id.padEnd(4)} ${label.padEnd(38)} slope ${s.b.toFixed(3).padStart(8)} ± ${s.se.toFixed(3).padEnd(6)} t ${s.t.toFixed(2).padStart(6)}  R² ${s.r2.toFixed(3)}${flag}`);
    return s;
  };
  console.log('\nQ1 upset audit — shooting luck (3P% and FT% vs own prior, points; home − away)');
  show('Q1a', 'resid vs close on net luck', 'netLuck');
  show('', 'resid vs engine on net luck', 'netLuck', 'residEng');
  console.log('       (in-game shooting: it describes results and cannot be known before tip, so its t is not a pass)');
  for (const [lab, test] of [['market favourite ≥ 65% lost', o => (o.pClose >= 0.65 && o.actual < 0) || (o.pClose <= 0.35 && o.actual > 0)],
    ['engine favourite ≥ 65% lost', o => (o.r.pOurs >= 0.65 && o.actual < 0) || (o.r.pOurs <= 0.35 && o.actual > 0)]]) {
    const ups = out.filter(test);
    const dogSign = (o) => (o.actual > 0 ? 1 : -1);   // + toward the winner (the underdog)
    const avg = (list, f) => mean(list.map(f));
    const base = out.map(o => ({ ...o, s: o.actual > 0 ? 1 : -1 }));
    console.log(`  Q1b ${lab}: ${ups.length} games`);
    const line = (list, s) => `luck ${avg(list, o => o.netLuck * s(o)).toFixed(1).padStart(5)} · TOV ${avg(list, o => o.margins.tov * s(o)).toFixed(1).padStart(4)} · OREB ${avg(list, o => o.margins.oreb * s(o)).toFixed(1).padStart(4)} · FTA ${avg(list, o => o.margins.fta * s(o)).toFixed(1).padStart(4)} · paint ${avg(list, o => o.margins.pip * s(o)).toFixed(1).padStart(5)} · margin ${avg(list, o => Math.abs(o.actual)).toFixed(1)}`;
    console.log(`      upsets, toward the winner:    ${line(ups, dogSign)}`);
    console.log(`      all games, toward the winner: ${line(base, o => o.s)}`);
    for (const o of ups) {
      const s = dogSign(o), winner = o.actual > 0 ? o.r.home : o.r.away;
      console.log(`        ${o.r.date.slice(5)} ${(o.r.away + '@' + o.r.home).padEnd(9)} ${winner.padEnd(4)} by ${String(Math.abs(o.actual)).padStart(2)} (close ${pct(o.actual > 0 ? o.pClose : 1 - o.pClose)}, engine ${pct(o.actual > 0 ? o.r.pOurs : 1 - o.r.pOurs)}) luck ${(o.netLuck * s).toFixed(1).padStart(5)} · 3P% gap ${(100 * o.margins.tp * s).toFixed(1).padStart(5)} · TOV ${String(o.margins.tov * s).padStart(3)} · OREB ${String(o.margins.oreb * s).padStart(3)} · FTA ${String(o.margins.fta * s).padStart(3)}`);
    }
  }

  console.log('\nQ2 advanced stats against the close');
  show('Q2a', 'four-factor margin − market margin', 'ffGap');
  show('Q2b', 'rebounding interaction', 'reb');
  show('Q2c', 'three-point-rate interaction', 'three');
  show('Q2d', 'rim (paint share) interaction', 'rim');
  show('Q2e', 'turnover interaction', 'tov');
  show('Q2f', 'transition interaction', 'trans');

  console.log('\nQ3 situational advanced stats (home − away)');
  show('Q3a', 'venue split (net at tonight\'s venue)', 'venue');
  const b2bGames = out.filter(o => o.hB2b || o.aB2b).length;
  show('Q3b', `rest split (${b2bGames} games with a back-to-back)`, 'rest');
  show('Q3c', 'opponent-strength split', 'vsOpp');
  show('Q3d', 'second-half minus first-half margin', 'halves');
  show('Q3e', 'last-5 form minus season', 'form');
  show('Q3f', 'fourth quarter in close games', 'close');

  console.log('\nQ4 variance — underdog wins minus the close\'s chance, by combined prior 3PA rate');
  const med = median(out.map(o => o.threeRate));
  const half = (f) => { const s = out.filter(f).map(o => { const pd = Math.min(o.pClose, 1 - o.pClose), dogWon = o.pClose >= 0.5 ? o.actual < 0 : o.actual > 0; return { pd, w: dogWon ? 1 : 0 }; });
    return { n: s.length, ex: s.reduce((a, x) => a + x.w - x.pd, 0), v: s.reduce((a, x) => a + x.pd * (1 - x.pd), 0), w: s.reduce((a, x) => a + x.w, 0), e: s.reduce((a, x) => a + x.pd, 0) }; };
  const hi = half(o => o.threeRate > med), lo = half(o => o.threeRate <= med);
  const z = (hi.ex / hi.n - lo.ex / lo.n) / Math.sqrt(hi.v / hi.n ** 2 + lo.v / lo.n ** 2);
  console.log(`  high 3PA: underdogs won ${hi.w}/${hi.n} vs ${hi.e.toFixed(1)} expected · low 3PA: ${lo.w}/${lo.n} vs ${lo.e.toFixed(1)} · difference z ${z.toFixed(2)}`);
  const all = half(() => true);
  console.log(`  all games: underdogs won ${all.w}/${all.n} vs ${all.e.toFixed(1)} expected at the close (z ${(all.ex / Math.sqrt(all.v)).toFixed(2)})`);

  if (has('--games')) {
    console.log('\ngames:');
    for (const o of out) console.log(`  ${o.r.date} ${(o.r.away + '@' + o.r.home).padEnd(9)} actual ${String(o.actual).padStart(4)} mkt ${o.mkt.toFixed(1).padStart(6)} resid ${o.resid.toFixed(1).padStart(6)} luck ${o.netLuck.toFixed(1).padStart(6)} ff ${o.ffMargin.toFixed(1).padStart(6)} b2b ${o.hB2b ? 'H' : ''}${o.aB2b ? 'A' : ''}`);
  }
}

// ── Part B: 2023-24 → 2025-26 ──────────────────────────────────────
// The games are research-favourites.js's (.cache/espn-nba/hist box files); each summary is
// trimmed to its header and team box lines so the cache stays small.
const HIST = path.join(CACHE, 'hist'), HIST_TEAM = path.join(CACHE, 'hist-team'), HIST_ODDS = path.join(CACHE, 'hist-odds');
const seasonOf = (d) => (d < '2024-07-01' ? '2023-24' : d < '2025-07-01' ? '2024-25' : '2025-26');
const histIndex = () => fs.readdirSync(HIST).filter(f => f.startsWith('box-')).map(f => { const b = JSON.parse(fs.readFileSync(path.join(HIST, f), 'utf8')); return { id: String(b.id), date: b.date }; });

async function fetchHist() {
  fs.mkdirSync(HIST_TEAM, { recursive: true });
  const todo = histIndex().filter(g => !fs.existsSync(path.join(HIST_TEAM, `team-${g.id}.json`)));
  let next = 0, done = 0, failed = 0;
  const worker = async () => {
    while (next < todo.length) {
      const g = todo[next++];
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const res = await fetch(`${ESPN}summary?event=${g.id}`, { signal: AbortSignal.timeout(30000) });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const s = await res.json(), c = s.header.competitions[0];
          const trim = { date: g.date, seasonType: s.header.season && s.header.season.type,
            header: { id: s.header.id, competitions: [{ competitors: c.competitors.map(x => ({ homeAway: x.homeAway, score: x.score, team: { abbreviation: x.team.abbreviation }, linescores: x.linescores })) }] },
            boxscore: { teams: (s.boxscore.teams || []).map(t => ({ team: { abbreviation: t.team.abbreviation }, statistics: t.statistics.map(x => ({ name: x.name, displayValue: x.displayValue })) })) } };
          fs.writeFileSync(path.join(HIST_TEAM, `team-${g.id}.json`), JSON.stringify(trim));
          break;
        } catch (e) { if (attempt === 3) failed++; else await new Promise(r => setTimeout(r, 1500 * (attempt + 1))); }
      }
      if (++done % 250 === 0) console.log(`  ${done}/${todo.length}`);
      await new Promise(r => setTimeout(r, 120));
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`fetched ${done - failed} of ${todo.length} (${failed} failed) into ${path.relative(__dirname, HIST_TEAM)}`);
}

function partB() {
  const seasons = {};
  let skipped = { notRegular: 0, noBox: 0, noOdds: 0, badSpread: 0 };
  for (const { id, date } of histIndex()) {
    const f = path.join(HIST_TEAM, `team-${id}.json`);
    if (!fs.existsSync(f)) { skipped.noBox++; continue; }
    const t = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (t.seasonType !== 2) { skipped.notRegular++; continue; }
    const g = t.boxscore.teams.length === 2 ? adaptGame(t, date) : null;
    if (!g || !(g.H.fga > 0) || !(g.A.fga > 0) || g.H.q.length < 4 || g.A.q.length < 4) { skipped.noBox++; continue; }
    (seasons[seasonOf(date)] = seasons[seasonOf(date)] || { games: [], rows: [] }).games.push(g);
    // The closing line: DraftKings where listed, else ESPN BET (research-favourites.js); the spread is the home line.
    const of = path.join(HIST_ODDS, `odds-${id}.json`);
    const o = fs.existsSync(of) ? JSON.parse(fs.readFileSync(of, 'utf8')) : null;
    const pv = o && (o.providers.find(p => /^draftkings$/i.test(p.name || '')) || o.providers.find(p => /^espn bet$/i.test(p.name || '')));
    if (!pv || pv.closeHome == null || pv.closeAway == null || pv.spread == null || Math.abs(pv.closeHome) < 100 || Math.abs(pv.closeAway) < 100) { skipped.noOdds++; continue; }
    // A spread whose favourite contradicts the moneyline's is a stale or bad line: dropped.
    if (pv.spread !== 0 && pv.closeHome !== pv.closeAway && (pv.spread < 0) !== (pv.closeHome < pv.closeAway)) { skipped.badSpread++; continue; }
    seasons[seasonOf(date)].rows.push({ id: g.id, date, home: g.home, away: g.away, book: pv.name, close: { spreadHome: pv.spread, mlHome: pv.closeHome, mlAway: pv.closeAway } });
  }
  const MIN_PRIOR = +(process.env.MATCHUP_MIN_PRIOR || 4);
  const by = {};
  for (const [s, x] of Object.entries(seasons).sort()) {
    x.games.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    x.rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    const { out, missing } = score(x.games, x.rows, MIN_PRIOR);
    by[s] = out;
    const books = [...new Set(x.rows.map(r => r.book))].join(', ');
    console.log(`  ${s}: ${x.games.length} regular-season games, ${x.rows.length} with a usable close (${books}), ${out.length} scored (${missing.length} with < ${MIN_PRIOR} prior games)`);
  }
  console.log(`  skipped: ${skipped.notRegular} not regular season, ${skipped.noBox} without a usable box, ${skipped.noOdds} without a close, ${skipped.badSpread} with a spread contradicting the moneyline`);
  return by;
}

async function mainB() {
  console.log(`matchup-1 Part B: k = ${K}`);
  const by = partB();
  const train = [...(by['2023-24'] || []), ...(by['2024-25'] || [])], hold = by['2025-26'] || [];
  const sd = (xs) => Math.sqrt(mean(xs.map(x => (x - mean(xs)) ** 2)));
  for (const [lab, s] of [['train', train], ['holdout', hold]]) console.log(`  ${lab}: ${s.length} games, residual vs close mean ${mean(s.map(o => o.resid)).toFixed(2)}, sd ${sd(s.map(o => o.resid)).toFixed(2)}; four-factor margin vs market r ${Math.sqrt(slope(s.map(o => o.ffMargin), s.map(o => o.mkt)).r2).toFixed(2)}`);
  const tests = [['Q2a', 'four-factor margin − market margin', 'ffGap'], ['Q2b', 'rebounding interaction', 'reb'], ['Q2c', 'three-point-rate interaction', 'three'],
    ['Q2d', 'rim (paint share) interaction', 'rim'], ['Q2e', 'turnover interaction', 'tov'], ['Q2f', 'transition interaction', 'trans'],
    ['Q3a', 'venue split', 'venue'], ['Q3b', 'rest split', 'rest'], ['Q3c', 'opponent-strength split', 'vsOpp'],
    ['Q3d', 'second-half minus first-half margin', 'halves'], ['Q3e', 'last-5 form minus season', 'form'], ['Q3f', 'fourth quarter in close games', 'close']];
  console.log('\n  Decision (pre-registered): counts only if train |t| ≥ 2 and the holdout has the same sign with |t| ≥ 1');
  console.log('  Q    feature                                train slope ± se          t      holdout slope ± se        t     → ');
  for (const [id, label, key] of tests) {
    const a = slope(train.map(o => o[key]), train.map(o => o.resid)), b = slope(hold.map(o => o[key]), hold.map(o => o.resid));
    const pass = Math.abs(a.t) >= 2 && Math.sign(b.t) === Math.sign(a.t) && Math.abs(b.t) >= 1;
    const f = (s) => `${s.b.toExponential(2).padStart(10)} ± ${s.se.toExponential(1).padEnd(8)} ${s.t.toFixed(2).padStart(6)}`;
    console.log(`  ${id.padEnd(4)} ${label.padEnd(38)} ${f(a)}    ${f(b)}   ${pass ? 'PASS' : 'no'}`);
  }
  // Q1 and Q4 on all three seasons (descriptive), and per split.
  for (const [lab, s] of [['train', train], ['holdout', hold]]) {
    const q1 = slope(s.map(o => o.netLuck), s.map(o => o.resid));
    const ups = s.filter(o => (o.pClose >= 0.65 && o.actual < 0) || (o.pClose <= 0.35 && o.actual > 0));
    const toward = (f) => mean(ups.map(o => f(o) * (o.actual > 0 ? 1 : -1)));
    const base = (f) => mean(s.map(o => f(o) * (o.actual > 0 ? 1 : -1)));
    console.log(`\n  Q1 ${lab}: net luck slope ${q1.b.toFixed(3)} (R² ${q1.r2.toFixed(3)}, in-game). ${ups.length} upsets at ≥ 65%, toward the winner:`);
    console.log(`     upsets    luck ${toward(o => o.netLuck).toFixed(1).padStart(5)} · TOV ${toward(o => o.margins.tov).toFixed(1).padStart(4)} · OREB ${toward(o => o.margins.oreb).toFixed(1).padStart(4)} · FTA ${toward(o => o.margins.fta).toFixed(1).padStart(4)} · paint ${toward(o => o.margins.pip).toFixed(1).padStart(5)} · share with luck ≥ 5 toward the winner ${(100 * ups.filter(o => o.netLuck * (o.actual > 0 ? 1 : -1) >= 5).length / ups.length).toFixed(0)}%`);
    console.log(`     all games luck ${base(o => o.netLuck).toFixed(1).padStart(5)} · TOV ${base(o => o.margins.tov).toFixed(1).padStart(4)} · OREB ${base(o => o.margins.oreb).toFixed(1).padStart(4)} · FTA ${base(o => o.margins.fta).toFixed(1).padStart(4)} · paint ${base(o => o.margins.pip).toFixed(1).padStart(5)} · share with luck ≥ 5 toward the winner ${(100 * s.filter(o => o.netLuck * (o.actual > 0 ? 1 : -1) >= 5).length / s.length).toFixed(0)}%`);
    const med = median(s.map(o => o.threeRate));
    const half = (f) => { const x = s.filter(f).map(o => { const pd = Math.min(o.pClose, 1 - o.pClose), w = (o.pClose >= 0.5 ? o.actual < 0 : o.actual > 0) ? 1 : 0; return { pd, w }; });
      return { n: x.length, ex: x.reduce((a, y) => a + y.w - y.pd, 0), v: x.reduce((a, y) => a + y.pd * (1 - y.pd), 0), w: x.reduce((a, y) => a + y.w, 0), e: x.reduce((a, y) => a + y.pd, 0) }; };
    const hi = half(o => o.threeRate > med), lo = half(o => o.threeRate <= med), all = half(() => true);
    const z = (hi.ex / hi.n - lo.ex / lo.n) / Math.sqrt(hi.v / hi.n ** 2 + lo.v / lo.n ** 2);
    console.log(`  Q4 ${lab}: high 3PA underdogs ${hi.w}/${hi.n} vs ${hi.e.toFixed(1)} · low ${lo.w}/${lo.n} vs ${lo.e.toFixed(1)} · difference z ${z.toFixed(2)} · all ${all.w}/${all.n} vs ${all.e.toFixed(1)} (z ${(all.ex / Math.sqrt(all.v)).toFixed(2)})`);
  }
}

function noVig(mh, ma) { const i = (a) => (a < 0 ? -a / (-a + 100) : 100 / (a + 100)); return i(mh) / (i(mh) + i(ma)); }
function median(xs) { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
const pct = (p) => (100 * p).toFixed(0) + '%';

module.exports = { partB, score, slope, situational, profiles, seasonGames, adaptGame, noVig };

if (require.main === module) (has('--fetch-hist') ? fetchHist() : has('--part-b') ? mainB() : main()).catch(e => { console.error(e); process.exit(1); });
