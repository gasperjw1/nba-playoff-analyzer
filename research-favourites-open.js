// ============================================================
// RESEARCH — favourite tickets at the OPENING price (pre-registered)
// ============================================================
// research-favourites.js found closing favourites priced about right after the
// vig, and that the engine adds nothing at the close. This season's live edges
// showed up against the open instead (45% of the gap). This asks whether the
// same tickets, and the engine's edges, hold at the opening price.
//
// Data: games in research-favourites.js's dataset whose book (DraftKings 2023-24
// and late 2025-26, ESPN BET otherwise) has both an opening and a closing
// moneyline; open and close always from the same book. Engine as there
// (point-in-time, no injury step).
//
// Pre-registered before the first run (committed before any result was seen):
//   split      train 2023-24 + 2024-25; holdout 2025-26 (as research-favourites.js)
//   fair       power de-vig (the vig falls mostly on the underdog); proportional
//              no-vig for ranking and floors, as in research-favourites.js
//   Q5  nightly 3-leg tickets built at the OPEN (nights with 3+ games): the 3
//       strongest favourites by opening no-vig, every leg ≥ floor (none, 70%,
//       75%, 80%), plus "≥ 75% at the open and engine ≥ 75%". Per variant:
//       nights, hit, break-even at the opening price, units at the opening
//       price, and the same legs' units at the closing price.
//   Q6  engine vs the open: each game's side where engine − open no-vig ≥ 5 pp
//       and ≥ 8 pp (favourite or underdog). n, share where the close moved
//       toward the engine (> 0.5 pp), share of the gap the close took, win rate
//       against the open's fair chance (z), units at the opening price.
//   Q7  sensitivity: Q5 and Q6 without games that moved > 25 pp open to close.
//   decision   an opening-price ticket counts only if it made money at the open
//              on train AND holdout and its legs beat the open break-even with
//              combined z ≥ 2. An engine edge (Q6) is real vs the open only if
//              train z ≥ 2 and holdout has the same sign with z ≥ 1.
//   caveat     ESPN's "open" is the first posted price, often the day before
//              and at low limits; it is an upper bound on what an early bet gets.
//
// Usage: node research-favourites-open.js   (needs research-favourites.js --fetch)
// ============================================================
const fs = require('fs');
const path = require('path');
const { buildDataset } = require('./research-favourites.js');

const dec = (a) => (a < 0 ? 1 + 100 / -a : 1 + a / 100);
const imp = (a) => 1 / dec(a);
function powerFair(a, b) {   // chance of the first side, power de-vig
  const x = imp(a), y = imp(b); let lo = 1, hi = 3;
  for (let i = 0; i < 60; i++) { const k = (lo + hi) / 2; if (x ** k + y ** k > 1) lo = k; else hi = k; }
  return x ** ((lo + hi) / 2);
}
const noVig = (a, b) => imp(a) / (imp(a) + imp(b));
const ok = (a) => a != null && Math.abs(a) >= 100;

function dataset() {
  const out = [];
  for (const r of buildDataset().rows) {
    const o = JSON.parse(fs.readFileSync(path.join(__dirname, `.cache/espn-nba/hist-odds/odds-${r.id}.json`), 'utf8'));
    const pv = o.providers.find(p => p.name === r.book);
    if (!pv || ![pv.openHome, pv.openAway, pv.closeHome, pv.closeAway].every(ok)) continue;
    const eHome = r.favHome ? r.pe : 1 - r.pe, homeWon = r.favHome === r.won;
    const side = (home) => ({
      home, won: home === homeWon, pe: home ? eHome : 1 - eHome,
      openOdds: home ? pv.openHome : pv.openAway, closeOdds: home ? pv.closeHome : pv.closeAway,
      po: home ? noVig(pv.openHome, pv.openAway) : noVig(pv.openAway, pv.openHome),
      pc: home ? noVig(pv.closeHome, pv.closeAway) : noVig(pv.closeAway, pv.closeHome),
      fo: home ? powerFair(pv.openHome, pv.openAway) : powerFair(pv.openAway, pv.openHome),
    });
    const h = side(true), a = side(false);
    out.push({ id: r.id, season: r.season, date: r.date, book: r.book, h, a, move: Math.abs(h.po - h.pc), openFav: h.po >= 0.5 ? h : a });
  }
  return out;
}

function z(w, ps) { const e = ps.reduce((s, p) => s + p, 0), v = ps.reduce((s, p) => s + p * (1 - p), 0); return v ? (w - e) / Math.sqrt(v) : 0; }

function q5(games) {
  const byD = new Map(); for (const g of games) byD.set(g.date, (byD.get(g.date) || []).concat(g));
  const variants = [['top 3, no floor', 0, 0], ['all three ≥ 70%', 0.7, 0], ['all three ≥ 75%', 0.75, 0], ['all three ≥ 80%', 0.8, 0], ['≥ 75% and engine ≥ 75%', 0.75, 0.75]];
  const out = {};
  for (const [lab, floor, eng] of variants) {
    const t = { nights: 0, n: 0, hit: 0, be: 0, uOpen: 0, uClose: 0, legs: 0, legsWon: 0, legBe: [] };
    for (const [, s] of byD) {
      if (s.length < 3) continue;
      t.nights++;
      const legs = s.map(g => g.openFav).filter(l => l.po >= floor && l.pe >= eng).sort((x, y) => y.po - x.po).slice(0, 3);
      if (legs.length < 3) continue;
      const h = legs.every(l => l.won), dO = legs.reduce((x, l) => x * dec(l.openOdds), 1), dC = legs.reduce((x, l) => x * dec(l.closeOdds), 1);
      t.n++; t.hit += h; t.be += 1 / dO; t.uOpen += h ? dO - 1 : -1; t.uClose += h ? dC - 1 : -1;
      for (const l of legs) { t.legs++; t.legsWon += l.won; t.legBe.push(imp(l.openOdds)); }
    }
    t.legZ = z(t.legsWon, t.legBe);
    out[lab] = t;
  }
  return out;
}

function q6(games) {
  const out = {};
  for (const min of [0.05, 0.08]) {
    const legs = games.flatMap(g => [g.h, g.a]).filter(l => l.pe - l.po >= min);
    const toward = legs.filter(l => l.pc - l.po > 0.005).length;
    const share = legs.reduce((s, l) => s + (l.pc - l.po) / (l.pe - l.po), 0) / (legs.length || 1);
    const won = legs.filter(l => l.won).length;
    const units = legs.reduce((s, l) => s + (l.won ? dec(l.openOdds) - 1 : -1), 0);
    out[`engine ≥ open + ${min * 100} pp`] = { n: legs.length, toward, share, won, fair: legs.reduce((s, l) => s + l.fo, 0), z: z(won, legs.map(l => l.fo)), units };
  }
  return out;
}

function report(games, label) {
  const books = {}; for (const g of games) books[g.book] = (books[g.book] || 0) + 1;
  console.log(`\n══ ${label}: ${games.length} games (${Object.entries(books).map(([b, n]) => `${b} ${n}`).join(', ')}) ══`);
  console.log('Q5 nightly 3-leg tickets built at the open');
  const t5 = q5(games);
  for (const [lab, t] of Object.entries(t5)) {
    console.log(`   ${lab.padEnd(24)} ${String(t.n).padStart(3)}/${t.nights} nights · hit ${t.hit}/${t.n} (${t.n ? (100 * t.hit / t.n).toFixed(1) : '—'}%) · break-even at open ${t.n ? (100 * t.be / t.n).toFixed(1) : '—'}% · units at open ${t.uOpen.toFixed(1).padStart(5)} · same legs at close ${t.uClose.toFixed(1).padStart(5)} · legs ${t.legsWon}/${t.legs} (z vs open break-even ${t.legZ.toFixed(2)})`);
  }
  console.log('Q6 engine vs the open (either side)');
  const t6 = q6(games);
  for (const [lab, t] of Object.entries(t6)) {
    console.log(`   ${lab.padEnd(24)} n ${String(t.n).padStart(4)} · close moved toward engine ${t.n ? (100 * t.toward / t.n).toFixed(0) : '—'}% · gap taken ${(100 * t.share).toFixed(0)}% · won ${t.won} vs open fair ${t.fair.toFixed(1)} (z ${t.z.toFixed(2)}) · units at open ${t.units.toFixed(1)}`);
  }
  return { t5, t6 };
}

function main() {
  const all = dataset();
  console.log(`${all.length} games with an opening and a closing moneyline from the same book`);
  for (const [tag, games] of [['', all], [' — without games that moved > 25 pp (Q7)', all.filter(g => g.move <= 0.25)]]) {
    const tr = report(games.filter(g => g.season !== '2025-26'), `TRAIN 2023-24 + 2024-25${tag}`);
    const ho = report(games.filter(g => g.season === '2025-26'), `HOLDOUT 2025-26${tag}`);
    console.log(`\nDecision (pre-registered)${tag}`);
    for (const k of Object.keys(tr.t5)) {
      const a = tr.t5[k], b = ho.t5[k];
      const zc = z(a.legsWon + b.legsWon, a.legBe.concat(b.legBe));
      const pass = a.uOpen > 0 && b.uOpen > 0 && zc >= 2;
      console.log(`   Q5 ${k.padEnd(24)} units at open train ${a.uOpen.toFixed(1)} · holdout ${b.uOpen.toFixed(1)} · legs combined z ${zc.toFixed(2)} → ${pass ? 'COUNTS' : 'no'}`);
    }
    for (const k of Object.keys(tr.t6)) {
      const a = tr.t6[k], b = ho.t6[k], pass = a.z >= 2 && b.z >= 1;
      console.log(`   Q6 ${k.padEnd(24)} train z ${a.z.toFixed(2)} · holdout z ${b.z.toFixed(2)} → ${pass ? 'REAL vs the open' : 'no'}`);
    }
  }
}

if (require.main === module) main();
module.exports = { dataset };
