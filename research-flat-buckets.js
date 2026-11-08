#!/usr/bin/env node
// ============================================================
// research-flat-buckets.js — EXPLORATORY (not pre-registered)
// ============================================================
// Written 2026-11-08 after research-flat-replay.js, on buckets taken from the
// user's own FanDuel results, so it describes rather than tests. $25 on every
// side of every game that falls in each bucket (an "above −300" bucket bets
// both sides of most games, unlike the user's one side per game), on:
//   three past seasons at the close (research-favourites.js dataset: DraftKings
//   2023-24, ESPN BET otherwise) and this season's replay (DraftKings close).
//   node research-flat-buckets.js
// ============================================================
const fs = require('fs'), path = require('path');
const ROOT = __dirname;
const { buildDataset } = require(path.join(ROOT, 'research-favourites.js'));
const imp = a => a < 0 ? -a / (-a + 100) : 100 / (a + 100);
const S = 25, prof = (o, w) => w ? S * (o > 0 ? o / 100 : 100 / -o) : -S;
// sides: {odds, won, fav}
function sidesFrom(mh, ma, homeWon) {
  const favHome = imp(mh) >= imp(ma);
  return [{ odds: mh, won: homeWon, fav: favHome }, { odds: ma, won: !homeWon, fav: !favHome }];
}
const B = [
  ['Above −300 (favs −299..−100 + all dogs)', s => s.odds > -300],
  ['Favourites −299 to −100', s => s.fav && s.odds > -300],
  ['Underdogs', s => !s.fav],
  ['Favourites −300 or heavier', s => s.fav && s.odds <= -300],
  ['All favourites', s => s.fav],
  ['  favs −100 to −149', s => s.fav && s.odds > -150],
  ['  favs −150 to −199', s => s.fav && s.odds <= -150 && s.odds > -200],
  ['  favs −200 to −299', s => s.fav && s.odds <= -200 && s.odds > -300],
  ['  favs −300 to −499', s => s.fav && s.odds <= -300 && s.odds > -500],
  ['  favs −500 or heavier', s => s.fav && s.odds <= -500],
  ['  dogs up to +149', s => !s.fav && s.odds < 150],
  ['  dogs +150 to +249', s => !s.fav && s.odds >= 150 && s.odds < 250],
  ['  dogs +250 or longer', s => !s.fav && s.odds >= 250],
];
function report(title, sides) {
  console.log(`\n${title}`);
  for (const [name, f] of B) {
    const x = sides.filter(f); let w = 0, be = 0, v = 0, p = 0;
    for (const s of x) { const q = imp(s.odds); w += s.won; be += q; v += q * (1 - q); p += prof(s.odds, s.won); }
    if (!x.length) { console.log(`  ${name.padEnd(42)} —`); continue; }
    console.log(`  ${name.padEnd(42)} ${String(w).padStart(5)}/${String(x.length).padEnd(5)} need ${be.toFixed(1).padStart(6)}  z ${((w - be) / Math.sqrt(v)).toFixed(2).padStart(5)}  ${p >= 0 ? '+' : '−'}$${Math.abs(p).toFixed(0).padStart(5)} on $${x.length * S}  ${(100 * p / (x.length * S)).toFixed(1)}%`);
  }
}
// Past seasons at the close
const rows = buildDataset(); const R = Array.isArray(rows) ? rows : rows.rows;
const past = {};
for (const r of R) {
  const o = JSON.parse(fs.readFileSync(path.join(ROOT, '.cache/espn-nba/hist-odds', `odds-${r.id}.json`), 'utf8'));
  const pv = o.providers.find(p => /^draftkings$/i.test(p.name || '')) || o.providers.find(p => /^espn bet$/i.test(p.name || ''));
  const homeWon = r.favHome ? r.won : !r.won;
  (past[r.season] = past[r.season] || []).push(...sidesFrom(pv.closeHome, pv.closeAway, homeWon));
}
for (const s of Object.keys(past).sort()) report(`Past season ${s} (close)`, past[s]);
report('Past three seasons (close)', Object.values(past).flat());
// Replay
const src = fs.readFileSync(path.join(ROOT, 'js/season/data/season-replay.js'), 'utf8');
const RP = eval('(' + src.slice(src.indexOf('{', src.indexOf('SEASON_REPLAY')), src.lastIndexOf('}') + 1) + ')').rows;
const rs = (rr) => rr.flatMap(r => sidesFrom(r.mlHome, r.mlAway, r.result.homeScore > r.result.awayScore));
report('This season replay Oct 25–31 (DK close)', rs(RP.filter(r => r.date >= '2026-10-25' && r.date <= '2026-10-31')));
report('This season replay Oct 20–Nov 6 (DK close)', rs(RP));
