#!/usr/bin/env node
// ============================================================
// research-luck-schedule.js — shooting luck and schedule vs the close (luck-sched-1)
// ============================================================
// Pre-registered in LUCK_SCHEDULE_RESEARCH.md (committed e7e70ea before this was written).
// The 2023-24 → 2025-26 regular seasons (matchup-1 Part B's cached box lines and closes);
// every feature from games before the scored game's date. Train 2023-24 + 2024-25,
// holdout 2025-26; a question passes on train |t| ≥ 2 and a same-sign holdout |t| ≥ 1.
//
//   node research-luck-schedule.js              the decision table and descriptive checks
//   node research-luck-schedule.js --robust     also the robustness runs (for a pass)
// Env (robustness only, not pre-registered): LS_K3 (3P% shrink, 300), LS_KFT (150), LS_WIN (5).
// ============================================================
const fs = require('fs');
const path = require('path');
const { adaptGame, noVig, slope, partB } = require('./research-matchup.js');

const CACHE = path.join(__dirname, '.cache/espn-nba');
const HIST = path.join(CACHE, 'hist'), HIST_TEAM = path.join(CACHE, 'hist-team'), HIST_ODDS = path.join(CACHE, 'hist-odds');
const MIN_PRIOR = 5;
const seasonOf = (d) => (d < '2024-07-01' ? '2023-24' : d < '2025-07-01' ? '2024-25' : '2025-26');
const day = (d) => Date.parse(d + 'T12:00:00Z') / 864e5;
const mean = (xs) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;

// Arena coordinates and standard UTC offsets (Phoenix as Mountain).
const ARENA = {
  ATL: [33.757, -84.396, -5], BOS: [42.366, -71.062, -5], BKN: [40.683, -73.976, -5], CHA: [35.225, -80.839, -5], CHI: [41.881, -87.674, -6],
  CLE: [41.496, -81.688, -5], DAL: [32.790, -96.810, -6], DEN: [39.749, -105.008, -7], DET: [42.341, -83.055, -5], GS: [37.768, -122.388, -8],
  HOU: [29.751, -95.362, -6], IND: [39.764, -86.156, -5], LAC: [33.945, -118.341, -8], LAL: [34.043, -118.267, -8], MEM: [35.138, -90.051, -6],
  MIA: [25.781, -80.188, -5], MIL: [43.045, -87.917, -6], MIN: [44.979, -93.276, -6], NO: [29.949, -90.082, -6], NY: [40.751, -73.993, -5],
  OKC: [35.463, -97.515, -6], ORL: [28.539, -81.384, -5], PHI: [39.901, -75.172, -5], PHX: [33.446, -112.071, -7], POR: [45.532, -122.667, -8],
  SAC: [38.580, -121.500, -8], SA: [29.427, -98.438, -6], TOR: [43.643, -79.379, -5], UTAH: [40.768, -111.901, -7], WSH: [38.898, -77.021, -5],
  // Neutral-site venues (robustness only: the pre-registered rule places a game at the home team's city).
  'Mexico City': [19.404, -99.150, -6], Paris: [48.839, 2.379, 1], 'Las Vegas': [36.103, -115.178, -8], Berlin: [52.507, 13.444, 1], London: [51.503, 0.003, 0],
};
// Robustness only: neutral-site cities from ESPN's scoreboards (.cache/espn-nba/hist-venue.json, fetched 2026-11-15).
const VENUE_FILE = path.join(CACHE, 'hist-venue.json');
const neutralCity = () => { const v = fs.existsSync(VENUE_FILE) ? JSON.parse(fs.readFileSync(VENUE_FILE, 'utf8')) : {};
  return new Map(Object.entries(v).filter(([, x]) => x.neutral && ARENA[x.city]).map(([id, x]) => [id, x.city])); };
// US daylight time: second Sunday of March to the first Sunday of November; Phoenix stays on standard time.
function usDst(date) {
  const y = +date.slice(0, 4), sun = (m, nth) => { const d = new Date(Date.UTC(y, m, 1)); const first = (7 - d.getUTCDay()) % 7 + 1; return `${y}-${String(m + 1).padStart(2, '0')}-${String(first + 7 * (nth - 1)).padStart(2, '0')}`; };
  return date >= sun(2, 2) && date < sun(10, 1);
}
function km(a, b) {
  const [la1, lo1] = ARENA[a], [la2, lo2] = ARENA[b], r = Math.PI / 180;
  const h = Math.sin((la2 - la1) * r / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin((lo2 - lo1) * r / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

// ── data: the same games and closes as matchup-1 Part B ─────────────
function load() {
  const seasons = {}, skipped = { notRegular: 0, notNba: 0, noBox: 0, noOdds: 0, badSpread: 0 };
  const index = fs.readdirSync(HIST).filter(f => f.startsWith('box-')).map(f => { const b = JSON.parse(fs.readFileSync(path.join(HIST, f), 'utf8')); return { id: String(b.id), date: b.date }; });
  for (const { id, date } of index) {
    const f = path.join(HIST_TEAM, `team-${id}.json`);
    if (!fs.existsSync(f)) { skipped.noBox++; continue; }
    const t = JSON.parse(fs.readFileSync(f, 'utf8'));
    if (t.seasonType !== 2) { skipped.notRegular++; continue; }
    const g = t.boxscore.teams.length === 2 ? adaptGame(t, date) : null;
    if (g && (!ARENA[g.home] || !ARENA[g.away])) { skipped.notNba++; continue; }
    if (!g || !(g.H.fga > 0) || !(g.A.fga > 0) || g.H.q.length < 4 || g.A.q.length < 4) { skipped.noBox++; continue; }
    const s = (seasons[seasonOf(date)] = seasons[seasonOf(date)] || { games: [], close: new Map() });
    s.games.push(g);
    const of = path.join(HIST_ODDS, `odds-${id}.json`);
    const o = fs.existsSync(of) ? JSON.parse(fs.readFileSync(of, 'utf8')) : null;
    const pv = o && (o.providers.find(p => /^draftkings$/i.test(p.name || '')) || o.providers.find(p => /^espn bet$/i.test(p.name || '')));
    if (!pv || pv.closeHome == null || pv.closeAway == null || pv.spread == null || Math.abs(pv.closeHome) < 100 || Math.abs(pv.closeAway) < 100) { skipped.noOdds++; continue; }
    if (pv.spread !== 0 && pv.closeHome !== pv.closeAway && (pv.spread < 0) !== (pv.closeHome < pv.closeAway)) { skipped.badSpread++; continue; }
    s.close.set(g.id, { spreadHome: pv.spread, mlHome: pv.closeHome, mlAway: pv.closeAway, book: pv.name });
  }
  for (const s of Object.values(seasons)) s.games.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1));
  return { seasons, skipped };
}

// ── features ────────────────────────────────────────────────────────
// One season → rows { id, date, home, away, resid, mkt, pClose, L1..L4, S1..S7 }, each team with ≥ MIN_PRIOR prior games.
function features(season, opts = {}) {
  const K3 = opts.k3 ?? +(process.env.LS_K3 || 300), KFT = opts.kft ?? +(process.env.LS_KFT || 150), WIN = opts.win ?? +(process.env.LS_WIN || 5);
  // opts.fix (robustness): neutral-site games at their venue, and US daylight time (Phoenix excepted).
  const neutral = opts.fix ? neutralCity() : new Map();
  const locOf = (g) => neutral.get(g.id) || g.home;
  const tz = (loc, date) => ARENA[loc][2] + (opts.fix && usDst(date) && ARENA[loc][1] < -60 && loc !== 'PHX' ? 1 : 0);
  const hist = {};   // team → [{ date, home, loc, opp, own: line, opl: line, margin }]
  const cum = {};    // team → { tpm, tpa, ftm, fta }
  const lg = { tpm: 0, tpa: 0, ftm: 0, fta: 0 };
  const out = [];
  const byDate = new Map();
  for (const g of season.games) (byDate.get(g.date) || byDate.set(g.date, []).get(g.date)).push(g);
  for (const [date, games] of byDate) {
    // Baselines as of tonight (prior games only).
    const lg3 = lg.tpm / lg.tpa, lgFt = lg.ftm / lg.fta;
    const p3 = (t) => { const c = cum[t] || { tpm: 0, tpa: 0 }; return (c.tpm + K3 * lg3) / (c.tpa + K3); };
    const pFt = (t) => { const c = cum[t] || { ftm: 0, fta: 0 }; return (c.ftm + KFT * lgFt) / (c.fta + KFT); };
    const luck = (t, x) => 3 * (x.own.tpm - x.own.tpa * p3(t)) + (x.own.ftm - x.own.fta * pFt(t)) - 3 * (x.opl.tpm - x.opl.tpa * p3(x.opp)) - (x.opl.ftm - x.opl.fta * pFt(x.opp));
    const team = (t, tonightHome, loc) => {
      const G = hist[t] || [];
      if (G.length < MIN_PRIOR) return null;
      const lk = G.map(x => luck(t, x)), mg = G.map(x => x.margin);
      const last = G[G.length - 1], recent = lk.slice(-WIN), recentM = mg.slice(-WIN);
      const L1 = mean(recent), L2 = mean(lk), L3 = lk[lk.length - 1];
      const L4 = (mean(recentM) - L1) - (mean(mg) - L2);
      const gap = day(date) - day(last.date);
      const rest = Math.min(3, Math.max(0, gap - 1));
      const three = G.filter(x => day(date) - day(x.date) <= 3).length >= 2 ? 1 : 0;
      const dist = km(last.loc, loc) / 1000;
      const east = tz(loc, date) - tz(last.loc, last.date);
      let road = 0; for (let i = G.length - 1; i >= 0 && !G[i].home; i--) road++;
      return { L1, L2, L3, L4, rest, three, dist, east, road, b2b: gap === 1, n: G.length };
    };
    for (const g of games) {
      const c = season.close.get(g.id);
      const H = team(g.home, true, locOf(g)), A = team(g.away, false, locOf(g));
      if (c && H && A) {
        const mkt = -c.spreadHome, actual = g.hs - g.as;
        out.push({ id: g.id, date, home: g.home, away: g.away, actual, mkt, resid: actual - mkt, pClose: noVig(c.mlHome, c.mlAway),
          L1: H.L1 - A.L1, L2: H.L2 - A.L2, L3: H.L3 - A.L3, L4: H.L4 - A.L4,
          S1: H.three - A.three, S2: H.rest - A.rest, S3: H.dist - A.dist, S4: H.east - A.east,
          S5: Math.min(6, A.road + 1), S6: H.road >= 3 ? 1 : 0, S7: g.home === 'DEN' || g.home === 'UTAH' ? 1 : 0, neutral: neutral.has(g.id) });
      }
    }
    // Then tonight's games join the history.
    for (const g of games) {
      for (const [t, o, own, opl, home] of [[g.home, g.away, g.H, g.A, true], [g.away, g.home, g.A, g.H, false]]) {
        (hist[t] = hist[t] || []).push({ date, home, loc: locOf(g), opp: o, own, opl, margin: home ? g.hs - g.as : g.as - g.hs });
        const c = (cum[t] = cum[t] || { tpm: 0, tpa: 0, ftm: 0, fta: 0 });
        c.tpm += own.tpm; c.tpa += own.tpa; c.ftm += own.ftm; c.fta += own.fta;
        lg.tpm += own.tpm; lg.tpa += own.tpa; lg.ftm += own.ftm; lg.fta += own.fta;
      }
    }
  }
  return out;
}

const QS = [
  ['L1', 'recent luck (last 5)', -1], ['L2', 'season luck', -1], ['L3', 'last game luck', -1], ['L4', 'luck-adjusted form', 1],
  ['S1', '3 games in 4 nights', -1], ['S2', 'rest days (0–3)', 1], ['S3', 'travel distance (1,000 km)', -1], ['S4', 'time zones moved east', -1],
  ['S5', 'away road-trip game number', 1], ['S6', 'home first game after 3+ road', -1], ['S7', 'altitude home (DEN, UTAH)', 1],
];
function corr(x, y) { const mx = mean(x), my = mean(y); let a = 0, b = 0, c = 0; for (let i = 0; i < x.length; i++) { a += (x[i] - mx) * (y[i] - my); b += (x[i] - mx) ** 2; c += (y[i] - my) ** 2; } return a / Math.sqrt(b * c); }

function decide(train, hold) {
  return QS.map(([id, label, sign]) => {
    const a = slope(train.map(o => o[id]), train.map(o => o.resid)), b = slope(hold.map(o => o[id]), hold.map(o => o.resid));
    const pass = Math.abs(a.t) >= 2 && Math.sign(b.t) === Math.sign(a.t) && Math.abs(b.t) >= 1;
    return { id, label, sign, a, b, pass, expected: Math.sign(a.t) === sign };
  });
}

function main() {
  const { seasons, skipped } = load();
  const by = {};
  for (const s of Object.keys(seasons).sort()) {
    by[s] = features(seasons[s]);
    console.log(`  ${s}: ${seasons[s].games.length} games, ${seasons[s].close.size} with a usable close, ${by[s].length} scored (both teams ${MIN_PRIOR}+ prior games)`);
  }
  console.log(`  skipped: ${skipped.notRegular} not regular season, ${skipped.notNba} exhibition teams, ${skipped.noBox} without a usable box, ${skipped.noOdds} without a close, ${skipped.badSpread} spread contradicting the moneyline`);
  const train = [...by['2023-24'], ...by['2024-25']], hold = by['2025-26'], all = [...train, ...hold];
  const sd = (xs) => Math.sqrt(mean(xs.map(x => (x - mean(xs)) ** 2)));
  for (const [lab, s] of [['train', train], ['holdout', hold]]) console.log(`  ${lab}: ${s.length} games, residual mean ${mean(s.map(o => o.resid)).toFixed(2)}, sd ${sd(s.map(o => o.resid)).toFixed(2)}`);

  // b2b-1's feature for the same games, from matchup-1's scorer (its k and min-prior defaults), joined by id.
  const mb = partB(), b2b = new Map(Object.values(mb).flat().map(o => [o.r.id, o.rest]));

  console.log('\n  Decision (pre-registered): train |t| ≥ 2 and the holdout same sign with |t| ≥ 1');
  console.log('  Q    feature                          predicted   train slope ± se      t     holdout slope ± se    t    → ');
  const f = (s) => `${s.b.toFixed(3).padStart(8)} ± ${s.se.toFixed(3).padEnd(6)} ${s.t.toFixed(2).padStart(6)}`;
  const res = decide(train, hold);
  for (const r of res) console.log(`  ${r.id.padEnd(4)} ${r.label.padEnd(32)} ${(r.sign > 0 ? '+' : '−').padStart(5)}      ${f(r.a)}    ${f(r.b)}   ${r.pass ? (r.expected ? 'PASS' : 'PASS (unexpected sign)') : 'no'}`);

  console.log('\n  Descriptive: pooled t · per season t · corr with market margin · corr with b2b-1 · feature mean ± sd');
  for (const [id, label] of QS) {
    const p = slope(all.map(o => o[id]), all.map(o => o.resid));
    const per = Object.keys(by).sort().map(s => slope(by[s].map(o => o[id]), by[s].map(o => o.resid)).t.toFixed(2).padStart(6)).join(' ');
    const jb = all.filter(o => b2b.has(o.id));
    const xs = all.map(o => o[id]);
    console.log(`  ${id.padEnd(4)} ${label.padEnd(32)} pooled ${p.t.toFixed(2).padStart(6)} (${p.b.toFixed(3)}) · seasons ${per} · r mkt ${corr(xs, all.map(o => o.mkt)).toFixed(3).padStart(6)} · r b2b ${corr(jb.map(o => o[id]), jb.map(o => b2b.get(o.id))).toFixed(3).padStart(6)} (n ${jb.length}) · ${mean(xs).toFixed(2)} ± ${sd(xs).toFixed(2)}`);
  }
  const S7 = (s) => { const x = s.filter(o => o.S7), y = s.filter(o => !o.S7); return `${x.length} games, mean resid ${mean(x.map(o => o.resid)).toFixed(2)} vs ${mean(y.map(o => o.resid)).toFixed(2)}`; };
  console.log(`\n  S7 altitude: train ${S7(train)} · holdout ${S7(hold)}`);
  const S1n = (s) => `home only ${s.filter(o => o.S1 === 1).length}, away only ${s.filter(o => o.S1 === -1).length}`;
  console.log(`  S1 3-in-4 games: train ${S1n(train)} · holdout ${S1n(hold)}`);

  if (process.argv.includes('--robust')) {
    console.log('\n  Robustness (not pre-registered; pass rule shown per run)');
    const runs = [['3P% k 150', { k3: 150 }], ['3P% k 600', { k3: 600 }], ['window 3', { win: 3 }], ['window 10', { win: 10 }], ['venues+DST', { fix: true }]];
    for (const [lab, o] of runs) {
      const b2 = Object.fromEntries(Object.keys(seasons).map(s => [s, features(seasons[s], o)]));
      const r2 = decide([...b2['2023-24'], ...b2['2024-25']], b2['2025-26']);
      console.log(`  ${lab.padEnd(10)} ${r2.map(r => `${r.id} ${r.a.t.toFixed(2)}/${r.b.t.toFixed(2)}${r.pass ? '*' : ''}`).join(' · ')}`);
    }
    const cut = (s) => { const q = [...s.map(o => Math.abs(o.resid))].sort((a, b) => a - b)[Math.floor(0.99 * s.length)]; return s.filter(o => Math.abs(o.resid) < q); };
    const r3 = decide(cut(train), cut(hold));
    console.log(`  trim 1%    ${r3.map(r => `${r.id} ${r.a.t.toFixed(2)}/${r.b.t.toFixed(2)}${r.pass ? '*' : ''}`).join(' · ')}`);
  }
  return { by, res };
}

module.exports = { load, features, decide, km, ARENA, usDst, QS };
if (require.main === module) main();
