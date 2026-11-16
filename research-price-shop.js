#!/usr/bin/env node
// ============================================================
// research-price-shop.js — price shopping and the multi-book consensus, 2021-23 (shop-1)
// ============================================================
// Pre-registered in PRICE_SHOP_RESEARCH.md (commit a37200e, before this file was written).
// ESPN's listed moneylines (≈ each book's close) for 2021-22 and 2022-23, distinct books only.
// P1 (the decision): is the median no-vig chance across books a calibrated yardstick?
// P2–P4 (described): what sides that beat it return, and what the better of two books is worth.
//
//   node research-price-shop.js
// Cached data only; the Odds API key is cleared, nothing spends credits.
// ============================================================
delete process.env.ODDS_API_KEY;
const fs = require('fs');
const path = require('path');

const OLD = path.join(__dirname, '.cache/espn-nba/old');
const GROUP = { 'Caesars Sportsbook': 'Caesars', 'Caesars Sportsbook (New Jersey)': 'Caesars', 'Caesars Sportsbook (Colorado)': 'Caesars',
  'Caesars Sportsbook (Pennsylvania)': 'Caesars', 'Caesars Sportsbook (Tennessee)': 'Caesars', Titanbets: 'Titanbets', 'Holland Casino': 'Titanbets' };
const KEEP = new Set(['DraftKings', 'Caesars', 'Titanbets', 'Unibet', 'SugarHouse', 'PointsBet', 'BetfairSportsbook', 'Westgate']);
const YOURS = 'DraftKings', MIN_OTHERS = 3, MIN_HOLD = 0.01, EDGE = 0.01;
const implied = (a) => (a < 0 ? -a / (-a + 100) : 100 / (a + 100));
const decimal = (a) => (a > 0 ? 1 + a / 100 : 1 + 100 / -a);
const median = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const logit = (p) => Math.log(p / (1 - p));

// Games with DraftKings plus ≥ 3 other distinct books, each book's line usable (±100, vig ≥ 1%).
function load() {
  const out = [], skipped = { noBox: 0, fewBooks: 0, noDk: 0 };
  for (const f of fs.readdirSync(OLD).filter(f => f.startsWith('odds-'))) {
    const o = JSON.parse(fs.readFileSync(path.join(OLD, f), 'utf8'));
    const bf = path.join(OLD, `box-${o.id}.json`);
    if (!fs.existsSync(bf)) { skipped.noBox++; continue; }
    const b = JSON.parse(fs.readFileSync(bf, 'utf8'));
    const books = {};
    for (const p of o.providers) {
      const g = GROUP[p.name] || p.name;
      if (!KEEP.has(g) || books[g] || p.home == null || p.away == null || Math.abs(p.home) < 100 || Math.abs(p.away) < 100) continue;
      if (implied(p.home) + implied(p.away) - 1 < MIN_HOLD) continue;
      books[g] = { home: p.home, away: p.away, nv: implied(p.home) / (implied(p.home) + implied(p.away)) };
    }
    if (!books[YOURS]) { skipped.noDk++; continue; }
    if (Object.keys(books).length - 1 < MIN_OTHERS) { skipped.fewBooks++; continue; }
    if (b.hs === b.as) continue;
    out.push({ id: String(o.id), date: b.date, season: b.date < '2022-07-01' ? '2021-22' : '2022-23', y: b.hs > b.as ? 1 : 0, books });
  }
  return { games: out, skipped };
}

// Logistic regression of y on [1, x] by Newton's method: { a, b, seB }.
function logistic(xs, ys) {
  let a = 0, b = 1;
  for (let it = 0; it < 100; it++) {
    let g0 = 0, g1 = 0, h00 = 0, h01 = 0, h11 = 0;
    for (let i = 0; i < xs.length; i++) { const p = 1 / (1 + Math.exp(-(a + b * xs[i]))), w = p * (1 - p); g0 += ys[i] - p; g1 += (ys[i] - p) * xs[i]; h00 += w; h01 += w * xs[i]; h11 += w * xs[i] * xs[i]; }
    const det = h00 * h11 - h01 * h01, da = (h11 * g0 - h01 * g1) / det, db = (h00 * g1 - h01 * g0) / det;
    a += da; b += db;
    if (Math.abs(da) + Math.abs(db) < 1e-10) return { a, b, seB: Math.sqrt(h00 / det) };
  }
  return { a, b, seB: NaN };
}
// Wins against summed fair chances.
function vsFair(items) {
  const won = items.reduce((s, x) => s + x.y, 0), exp = items.reduce((s, x) => s + x.p, 0), v = items.reduce((s, x) => s + x.p * (1 - x.p), 0);
  return { n: items.length, won, exp, z: (won - exp) / Math.sqrt(v) };
}
// Flat 1-unit bets: return per bet, with its standard error.
function roi(bets) {
  const r = bets.map(x => (x.y ? decimal(x.ml) - 1 : -1)), m = r.reduce((s, x) => s + x, 0) / r.length;
  return { n: r.length, roi: m, se: Math.sqrt(r.reduce((s, x) => s + (x - m) ** 2, 0) / (r.length - 1) / r.length) };
}

function main() {
  const { games, skipped } = load();
  const pct = (x, d = 1) => `${(100 * x).toFixed(d)}%`;
  console.log(`shop-1: ${games.length} games (2021-22 ${games.filter(g => g.season === '2021-22').length}, 2022-23 ${games.filter(g => g.season === '2022-23').length}); left out ${JSON.stringify(skipped)}; distinct books per game median ${median(games.map(g => Object.keys(g.books).length))}`);

  // P1: the all-books consensus on every home side.
  const home = games.map(g => ({ p: median(Object.values(g.books).map(b => b.nv)), y: g.y, season: g.season, pDk: g.books[YOURS].nv }));
  const decideP1 = (rows, lbl) => { const z = vsFair(rows), L = logistic(rows.map(r => logit(r.p)), rows.map(r => r.y));
    console.log(`  ${lbl.padEnd(24)} n ${String(z.n).padStart(5)}  won ${String(z.won).padStart(5)} vs ${z.exp.toFixed(1).padStart(7)} expected  z ${z.z.toFixed(2).padStart(6)}  slope ${L.b.toFixed(3)} ± ${L.seB.toFixed(3)}  intercept ${L.a.toFixed(3)}`);
    return { z, L }; };
  console.log('\nP1. Consensus (median no-vig across books) on every home side');
  const p1 = decideP1(home, 'all');
  const valid = Math.abs(p1.z.z) < 2 && Math.abs(p1.L.b - 1) <= 2 * p1.L.seB;
  for (const s of ['2021-22', '2022-23']) decideP1(home.filter(r => r.season === s), s);
  for (const [lbl, f] of [['home over 70%', r => r.p > 0.7], ['home 50–70%', r => r.p >= 0.5 && r.p <= 0.7], ['home under 50%', r => r.p < 0.5]]) {
    const z = vsFair(home.filter(f)); console.log(`  ${lbl.padEnd(24)} n ${String(z.n).padStart(5)}  won ${String(z.won).padStart(5)} vs ${z.exp.toFixed(1).padStart(7)} expected  z ${z.z.toFixed(2).padStart(6)}`);
  }
  const brier = (k) => home.reduce((s, r) => s + (r[k] - r.y) ** 2, 0) / home.length;
  console.log(`  Brier: consensus ${brier('p').toFixed(4)}, DraftKings' own no-vig ${brier('pDk').toFixed(4)}`);
  console.log(`  ${valid ? 'VALID' : 'NOT VALID'}: |z| < 2 ${Math.abs(p1.z.z) < 2 ? '✓' : '✗'}, slope within 2 se of 1 ${Math.abs(p1.L.b - 1) <= 2 * p1.L.seB ? '✓' : '✗'}`);

  // Each side's EV at each book against the leave-one-out consensus.
  const sides = [];
  for (const g of games) {
    const names = Object.keys(g.books);
    for (const side of ['home', 'away']) {
      const y = side === 'home' ? g.y : 1 - g.y;
      const at = {};
      for (const n of names) {
        const pf = median(names.filter(x => x !== n).map(x => g.books[x].nv)), p = side === 'home' ? pf : 1 - pf, ml = g.books[n][side];
        at[n] = { p, ml, ev: p * decimal(ml) - 1 };
      }
      const pAll = median(names.map(x => g.books[x].nv));
      sides.push({ y, at, fav: (side === 'home' ? pAll : 1 - pAll) > 0.5, season: g.season, side });
    }
  }
  const showSel = (lbl, bets) => { const z = vsFair(bets), r = roi(bets);
    console.log(`  ${lbl.padEnd(34)} n ${String(z.n).padStart(5)}  won ${String(z.won).padStart(5)} vs consensus ${z.exp.toFixed(1).padStart(7)}  z ${z.z.toFixed(2).padStart(6)}  mean EV ${pct(bets.reduce((s, b) => s + b.ev, 0) / bets.length, 2)}  return ${pct(r.roi)} ± ${pct(r.se)}`); };
  console.log('\nP2. DraftKings sides at EV ≥ +1% vs the leave-one-out consensus (described)');
  showSel('DraftKings ≥ +1%', sides.filter(s => s.at[YOURS].ev >= EDGE).map(s => ({ ...s.at[YOURS], y: s.y })));
  showSel('DraftKings > 0%', sides.filter(s => s.at[YOURS].ev > 0).map(s => ({ ...s.at[YOURS], y: s.y })));
  console.log('\nP3. The best price across books at EV ≥ +1% (described)');
  const best = sides.map(s => { const [n, b] = Object.entries(s.at).sort((a, c) => c[1].ev - a[1].ev)[0]; return { ...b, book: n, y: s.y }; });
  showSel('best book ≥ +1%', best.filter(b => b.ev >= EDGE));
  const byBook = {}; for (const b of best.filter(b => b.ev >= EDGE)) byBook[b.book] = (byBook[b.book] || 0) + 1;
  console.log(`  which book: ${Object.entries(byBook).sort((a, c) => c[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ')}`);

  console.log('\nP4. What shopping is worth: mean EV per side vs the leave-one-out consensus (arithmetic)');
  const others = [...KEEP].filter(n => n !== YOURS);
  const meanEv = (f, sel) => { const xs = sides.filter(sel).map(f).filter(x => x != null); return xs.reduce((s, x) => s + x, 0) / xs.length; };
  for (const [lbl, sel] of [['all sides', () => true], ['favourites', s => s.fav], ['underdogs', s => !s.fav]]) {
    const two = others.map(o => meanEv(s => (s.at[o] ? Math.max(s.at[YOURS].ev, s.at[o].ev) : null), sel)).filter(x => !Number.isNaN(x));
    console.log(`  ${lbl.padEnd(11)} DraftKings alone ${pct(meanEv(s => s.at[YOURS].ev, sel), 2)}   better of DraftKings and one other ${pct(two.reduce((a, b) => a + b, 0) / two.length, 2)}   best of all ${pct(meanEv(s => Math.max(...Object.values(s.at).map(b => b.ev)), sel), 2)}`);
  }
  console.log('  better of DraftKings and each book: ' + others.map(o => { const v = meanEv(s => (s.at[o] ? Math.max(s.at[YOURS].ev, s.at[o].ev) : null), () => true); return `${o} ${pct(v, 2)}`; }).join(', '));
  // Illustration: always the home side, at DraftKings vs at the better of DraftKings and Caesars.
  const homeSides = sides.filter(s => s.side === 'home');
  const r1 = roi(homeSides.map(s => ({ ml: s.at[YOURS].ml, y: s.y })));
  const r2 = roi(homeSides.filter(s => s.at.Caesars).map(s => ({ ml: s.at.Caesars.ev > s.at[YOURS].ev ? s.at.Caesars.ml : s.at[YOURS].ml, y: s.y })));
  console.log(`  illustration, every home side: at DraftKings ${pct(r1.roi)} ± ${pct(r1.se)} (n ${r1.n}); at the better of DraftKings and Caesars ${pct(r2.roi)} ± ${pct(r2.se)} (n ${r2.n})`);
}

module.exports = { load, logistic, vsFair, roi, median, decimal, implied };
if (require.main === module) main();
