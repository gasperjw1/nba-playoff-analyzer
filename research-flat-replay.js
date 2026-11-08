#!/usr/bin/env node
// ============================================================
// research-flat-replay.js — the flat-1 rule on this season's replay
// ============================================================
// Data: js/season/data/season-replay.js (spec replay-9, engine
// 2026-11-07.rotcap): 132 games from 2026-10-20 to 2026-11-06, each with
// DraftKings' closing and opening moneylines and the engine's walk-forward
// chance (pOurs: injury report ~60 min before tip).
//
// Pre-registered before the first run (committed before any result was seen):
//   rule      $25 straight on each game's DraftKings-close favourite priced −299 to −100
//             (+100 on an even pick'em; a pick'em counts the home side), as in flat-1
//   windows   primary: 2026-10-25 to 2026-10-31 (the last week of October, the user's ask);
//             secondary: every replay game (2026-10-20 to 2026-11-06)
//   F1  the rule at the close
//   F2  F1 split by the engine: agrees (its chance on the favourite ≥ 50%) vs disagrees
//   F3  F1 split by the engine vs the market: more confident than DraftKings' no-vig chance
//       (proportional) on the favourite vs less
//   F4  sensitivity: the same rule at DraftKings' open (favourite and price from the open)
//   measures  bets, won, break-even wins (implied chances, vig included), profit, margin, z
//   decision  none: flat-1 is frozen. The replay is a development set — the engine was tuned on
//             these games through replay-9 — so F2/F3 are exploratory. An engine filter could only
//             become a new spec (flat-2), judged on the live ledger.
// ============================================================
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, 'js/season/data/season-replay.js'), 'utf8');
const REPLAY = eval('(' + src.slice(src.indexOf('{', src.indexOf('SEASON_REPLAY')), src.lastIndexOf('}') + 1) + ')');

const STAKE = 25;
const ml = (a) => typeof a === 'number' && isFinite(a) && Math.abs(a) >= 100;
const imp = (a) => a < 0 ? -a / (-a + 100) : 100 / (a + 100);
const inRule = (o) => ml(o) && o > -300 && (o < 0 || o === 100);
const profit = (o, hit) => hit ? STAKE * (o > 0 ? o / 100 : 100 / -o) : -STAKE;

// One bet per game: the favourite at the given prices, with the engine's and market's chances on it.
function bet(r, mh, ma) {
  if (!ml(mh) || !ml(ma) || !r.result) return null;
  const home = imp(mh) >= imp(ma);
  const odds = home ? mh : ma;
  if (!inRule(odds)) return null;
  const won = home ? r.result.homeScore > r.result.awayScore : r.result.awayScore > r.result.homeScore;
  const pMkt = home ? imp(mh) / (imp(mh) + imp(ma)) : imp(ma) / (imp(mh) + imp(ma));
  const pEng = r.pOurs == null ? null : home ? r.pOurs : 1 - r.pOurs;
  return { date: r.date, team: home ? r.home : r.away, odds, won, pMkt, pEng };
}

function rec(bets) {
  let n = 0, w = 0, be = 0, v = 0, p = 0;
  for (const b of bets) { const q = imp(b.odds); n++; w += b.won ? 1 : 0; be += q; v += q * (1 - q); p += profit(b.odds, b.won); }
  return { n, w, be, z: v ? (w - be) / Math.sqrt(v) : null, staked: n * STAKE, p, m: n ? p / (n * STAKE) : null };
}
const line = (label, r) => console.log(`  ${label.padEnd(44)} ${r.n ? `${String(r.w).padStart(3)}/${String(r.n).padEnd(3)} (${(100 * r.w / r.n).toFixed(1)}%)  break-even ${r.be.toFixed(1).padStart(5)}  z ${r.z.toFixed(2).padStart(5)}  $${String(r.staked).padStart(4)}  ${r.p >= 0 ? '+' : '−'}$${Math.abs(r.p).toFixed(2).padStart(6)}  ${(100 * r.m).toFixed(1)}%` : '—'}`);

const windows = [['Primary: 2026-10-25 to 2026-10-31', '2026-10-25', '2026-10-31'], ['Secondary: every replay game', '0000', '9999']];
console.log(`Replay ${REPLAY.spec.version} (engine ${REPLAY.spec.engine}), ${REPLAY.rows.length} games; $${STAKE} straight on each DraftKings favourite −299 to −100.\n`);
for (const [title, from, to] of windows) {
  const rows = REPLAY.rows.filter(r => r.date >= from && r.date <= to);
  const close = rows.map(r => bet(r, r.mlHome, r.mlAway)).filter(Boolean);
  const open = rows.map(r => bet(r, r.open && r.open.mlHome, r.open && r.open.mlAway)).filter(Boolean);
  const days = [...new Set(rows.map(r => r.date))];
  console.log(`${title}: ${rows.length} games on ${days.length} days (${days[0]} to ${days[days.length - 1]})`);
  line('F1 rule at the close', rec(close));
  line('F2 engine agrees (≥ 50% on the favourite)', rec(close.filter(b => b.pEng != null && b.pEng >= 0.5)));
  line('   engine disagrees', rec(close.filter(b => b.pEng != null && b.pEng < 0.5)));
  line('F3 engine above the no-vig chance', rec(close.filter(b => b.pEng != null && b.pEng > b.pMkt)));
  line('   engine at or below it', rec(close.filter(b => b.pEng != null && b.pEng <= b.pMkt)));
  line(`F4 rule at the open (${rows.filter(r => r.open && ml(r.open.mlHome)).length} games with an open)`, rec(open));
  if (from !== '0000') {
    console.log('  by day (F1):');
    for (const d of days) { const b = close.filter(x => x.date === d); if (b.length) console.log(`    ${d}  ${b.map(x => `${x.team} ${x.odds}${x.won ? '✓' : '✗'}`).join(' · ')}  ${(b.reduce((s, x) => s + profit(x.odds, x.won), 0) >= 0 ? '+' : '−')}$${Math.abs(b.reduce((s, x) => s + profit(x.odds, x.won), 0)).toFixed(2)}`); }
  }
  console.log('');
}
