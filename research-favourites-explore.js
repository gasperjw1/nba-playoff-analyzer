// ============================================================
// RESEARCH — favourite tickets at the real closing price (exploratory)
// ============================================================
// Follow-up to research-favourites.js, written AFTER its pre-registered run
// (2026-11-08), so nothing here is a confirmed finding:
//   - favourites' win rate against two ways of removing the vig (proportional,
//     power) and flat return at the closing price, by bucket and by book
//   - nightly 3-leg tickets of the market's strongest favourites with a floor
//     on every leg: nights available, hit rate, fair and break-even rates, units
//   node research-favourites-explore.js
// ============================================================
const R = require('./research-favourites.js');
const fs = require('fs'), path = require('path');
const { rows } = R.buildDataset();
const dec = (a) => (a < 0 ? 1 + 100 / -a : 1 + a / 100);
const imp = (a) => 1 / dec(a);
// attach the dog's price
const odds = new Map();
for (const r of rows) {
  const o = JSON.parse(fs.readFileSync(`${__dirname}/.cache/espn-nba/hist-odds/odds-${r.id}.json`));
  const pv = o.providers.find(p => p.name === r.book);
  r.dogOdds = r.favHome ? pv.closeAway : pv.closeHome;
  r.be = imp(r.favOdds);                       // break-even incl. vig
  // power de-vig: find k with imp_f^k + imp_d^k = 1
  const a = imp(r.favOdds), b = imp(r.dogOdds); let lo = 1, hi = 3;
  for (let i = 0; i < 60; i++) { const k = (lo + hi) / 2; (a ** k + b ** k > 1) ? (lo = k) : (hi = k); }
  r.pPow = a ** ((lo + hi) / 2);
}
const z = (w, p) => { const n = p.length, e = p.reduce((s, x) => s + x, 0), v = p.reduce((s, x) => s + x * (1 - x), 0); return `${(100 * w / n).toFixed(1)}% vs ${(100 * e / n).toFixed(1)}% (z ${((w - e) / Math.sqrt(v)).toFixed(2)})`; };
for (const [lab, f] of [['train', r => r.season !== '2025-26'], ['holdout', r => r.season === '2025-26'], ['DraftKings', r => r.book === 'DraftKings'], ['ESPN BET', r => r.book === 'ESPN BET']]) {
  const s = rows.filter(f);
  console.log(`\n== ${lab} (${s.length} games)`);
  for (const [lo, hi] of [[0.5, 0.7], [0.7, 0.8], [0.8, 0.9], [0.9, 1.01]]) {
    const b = s.filter(r => r.pk >= lo && r.pk < hi), w = b.filter(r => r.won).length;
    const roi = b.reduce((x, r) => x + (r.won ? dec(r.favOdds) - 1 : -1), 0) / b.length;
    console.log(`  fav ${lo * 100}-${Math.min(100, hi * 100)}%  n ${b.length}  won vs proportional ${z(w, b.map(r => r.pk))} · vs power ${z(w, b.map(r => r.pPow))} · flat ROI at close ${(roi * 100).toFixed(1)}%`);
  }
  // nightly top-3 market favourites at the real closing price
  const byD = new Map(); for (const r of s) byD.set(r.date, (byD.get(r.date) || []).concat(r));
  let n = 0, hit = 0, units = 0, eP = 0, eW = 0, eB = 0; const per = {};
  for (const [, g] of byD) {
    if (g.length < 3) continue;
    const t = g.sort((a, b) => b.pk - a.pk).slice(0, 3), h = t.every(r => r.won), d = t.reduce((x, r) => x * dec(r.favOdds), 1);
    n++; hit += h; units += h ? d - 1 : -1; eP += t.reduce((x, r) => x * r.pk, 1); eW += t.reduce((x, r) => x * r.pPow, 1); eB += 1 / d;
  }
  console.log(`  top-3 ticket: ${hit}/${n} (${(100 * hit / n).toFixed(1)}%) · expected proportional ${(100 * eP / n).toFixed(1)}% · power ${(100 * eW / n).toFixed(1)}% · break-even ${(100 * eB / n).toFixed(1)}% · units ${units.toFixed(1)} (ROI ${(100 * units / n).toFixed(1)}%)`);
}
console.log('\n== ticket variants, all three seasons (each night: top-3 market favourites that meet the floor)');
const byD = new Map(); for (const r of rows) byD.set(r.date, (byD.get(r.date) || []).concat(r));
for (const [lab, floor, both] of [['top-3, no floor', 0, false], ['all three ≥ 70% (market)', 0.7, false], ['all three ≥ 70% (market and engine)', 0.7, true], ['all three ≥ 75%', 0.75, false], ['all three ≥ 80%', 0.8, false]]) {
  for (const seas of ['train', 'holdout']) {
    let nights = 0, n = 0, hit = 0, units = 0, eB = 0, eW = 0;
    for (const [, g] of byD) {
      if (g.length < 3 || (seas === 'holdout') !== (g[0].season === '2025-26')) continue;
      nights++;
      const t = g.filter(r => r.pk >= floor && (!both || r.pe >= floor)).sort((a, b) => b.pk - a.pk).slice(0, 3);
      if (t.length < 3) continue;
      const h = t.every(r => r.won), d = t.reduce((x, r) => x * dec(r.favOdds), 1);
      n++; hit += h; units += h ? d - 1 : -1; eB += 1 / d; eW += t.reduce((x, r) => x * r.pPow, 1);
    }
    console.log(`  ${lab.padEnd(38)} ${seas.padEnd(7)} on ${n}/${nights} nights · hit ${hit}/${n} (${(100 * hit / n).toFixed(1)}%) · fair (power) ${(100 * eW / n).toFixed(1)}% · break-even ${(100 * eB / n).toFixed(1)}% · units ${units.toFixed(1)} · typical price +${Math.round((1 / (eB / n) - 1) * 100)}`);
  }
}
