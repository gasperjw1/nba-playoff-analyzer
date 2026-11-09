#!/usr/bin/env node
// ============================================================
// research-nbai-record.js — NB.AI's track record against the market
// ============================================================
// NB.AI's feed keeps no history, so its record is the ledger's: every
// NB.AI-sourced row stores the feed's home win chance (pFriend) beside the
// DraftKings price recorded at the same moment (pMarket, no-vig) and our
// engine's (pOurs), all before tip. ESPN-fallback nights have no NB.AI number.
//
// Pre-registered before the first run (committed before any result was seen):
//   sample    settled ledger rows with pFriend, pMarket and pOurs (2026-11-02 on;
//             ~33 games). The Nov 1 snapshot (4 games) is left out: no ledger row.
//   Q1  accuracy: Brier and log loss for NB.AI, the market and ours; winners picked
//   Q2  confidence: mean |p − 50%| for each, and the slope of a logistic fit of the
//       result on logit(p) (1 = calibrated; above 1 = too timid; below 1 = too bold)
//   Q3  NB.AI ≥ 8 points off the market: how NB.AI's side did against the market's
//       expected wins, and 1-unit flat profit at DraftKings' close on that side; the
//       same for the market's side (fading NB.AI)
//   Q4  a fixed blend, not fitted: market log-odds + 0.25 × (NB.AI − market log-odds);
//       Brier against the market's. The ledger's own blend (pBlend) beside it.
//   Q5  NB.AI and ours both ≥ 5 points off the market on the same side: that side's
//       record against the market's expected wins
//   decision  none: ~33 games can show a gross miscalibration, not an edge. A pattern
//             here becomes a pre-registered rule judged on later nights.
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const c = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, 'js/season/data/season-ledger.js'), 'utf8').replace(/^(const|let) /gm, 'var '), c);
const rows = c.SEASON_LEDGER.filter(r => r.result && r.pFriend != null && r.pMarket != null && r.pOurs != null);
const won = (r) => r.result.homeScore > r.result.awayScore ? 1 : 0;
const clip = (p) => Math.min(1 - 1e-6, Math.max(1e-6, p));
const logit = (p) => Math.log(clip(p) / (1 - clip(p)));
const sig = (x) => 1 / (1 + Math.exp(-x));
const imp = (a) => a < 0 ? -a / (-a + 100) : 100 / (a + 100);
const pay = (a) => a < 0 ? 100 / -a : a / 100;

function score(get) {
  let b = 0, ll = 0, pick = 0, conf = 0;
  for (const r of rows) { const p = get(r), y = won(r); b += (p - y) ** 2; ll -= y ? Math.log(clip(p)) : Math.log(1 - clip(p)); pick += (p >= 0.5) === (y === 1) ? 1 : 0; conf += Math.abs(p - 0.5); }
  return { brier: b / rows.length, logloss: ll / rows.length, pick, conf: conf / rows.length };
}
// Logistic slope of the result on logit(p) (intercept free), by Newton's method.
function slope(get) {
  let a = 0, s = 1;
  for (let it = 0; it < 50; it++) {
    let g0 = 0, g1 = 0, h00 = 0, h01 = 0, h11 = 0;
    for (const r of rows) { const x = logit(get(r)), q = sig(a + s * x), y = won(r), w = q * (1 - q); g0 += y - q; g1 += (y - q) * x; h00 += w; h01 += w * x; h11 += w * x * x; }
    const det = h00 * h11 - h01 * h01; if (!det) break;
    a += (h11 * g0 - h01 * g1) / det; s += (h00 * g1 - h01 * g0) / det;
  }
  let info = 0; for (const r of rows) { const x = logit(get(r)), q = sig(a + s * x); info += q * (1 - q) * x * x; }
  return { s, se: 1 / Math.sqrt(info) };
}
// A side's record: wins against the market's expected wins, and flat profit at DraftKings' close.
function sideRec(list) {
  let n = 0, w = 0, exp = 0, u = 0, priced = 0;
  for (const { r, home } of list) {
    n++; const y = home ? won(r) : 1 - won(r); w += y; exp += home ? r.pMarket : 1 - r.pMarket;
    const ml = r.close ? (home ? r.close.mlHome : r.close.mlAway) : null;
    if (ml != null) { priced++; u += y ? pay(ml) : -1; }
  }
  return n ? `${w}/${n} won, market expected ${exp.toFixed(1)}, ${priced ? `${u >= 0 ? '+' : ''}${u.toFixed(2)}u at the close (${priced} priced)` : 'no closes'}` : 'none';
}

const dates = [...new Set(rows.map(r => r.date))];
console.log(`NB.AI record: ${rows.length} settled games on ${dates.length} nights (${dates.join(', ')})\n`);
console.log('Q1/Q2           Brier   log loss  winners  mean |p−50%|  logistic slope (± se)');
for (const [name, get] of [['NB.AI', r => r.pFriend], ['market', r => r.pMarket], ['ours', r => r.pOurs], ['ledger blend', r => r.pBlend]]) {
  if (rows.some(r => get(r) == null)) { console.log(`  ${name}: missing on some rows`); continue; }
  const s = score(get), sl = slope(get);
  console.log(`  ${name.padEnd(13)} ${s.brier.toFixed(4)}  ${s.logloss.toFixed(4)}   ${String(s.pick).padStart(2)}/${rows.length}    ${(100 * s.conf).toFixed(1)}%        ${sl.s.toFixed(2)} ± ${sl.se.toFixed(2)}`);
}
const big = rows.filter(r => Math.abs(r.pFriend - r.pMarket) >= 0.08);
console.log(`\nQ3 NB.AI ≥ 8 points off the market: ${big.length} games`);
console.log(`   NB.AI's side     ${sideRec(big.map(r => ({ r, home: r.pFriend > r.pMarket })))}`);
console.log(`   market's side    ${sideRec(big.map(r => ({ r, home: r.pFriend < r.pMarket })))}`);
const blend = (r) => sig(logit(r.pMarket) + 0.25 * (logit(r.pFriend) - logit(r.pMarket)));
console.log(`\nQ4 fixed blend (market + 0.25 × NB.AI gap): Brier ${score(blend).brier.toFixed(4)} vs market ${score(r => r.pMarket).brier.toFixed(4)}`);
const both = rows.filter(r => Math.abs(r.pFriend - r.pMarket) >= 0.05 && Math.abs(r.pOurs - r.pMarket) >= 0.05 && Math.sign(r.pFriend - r.pMarket) === Math.sign(r.pOurs - r.pMarket));
console.log(`\nQ5 NB.AI and ours both ≥ 5 points off the market, same side: ${both.length} games`);
console.log(`   their side       ${sideRec(both.map(r => ({ r, home: r.pFriend > r.pMarket })))}`);
console.log('\nevery game (home team chances):');
for (const r of rows) console.log(`  ${r.date} ${(r.away + ' @ ' + r.home).padEnd(12)} NB.AI ${(100 * r.pFriend).toFixed(0).padStart(2)}%  market ${(100 * r.pMarket).toFixed(0).padStart(2)}%  ours ${(100 * r.pOurs).toFixed(0).padStart(2)}%  ${won(r) ? 'home' : 'away'} won ${r.result.awayScore}-${r.result.homeScore}`);
