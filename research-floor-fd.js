#!/usr/bin/env node
// ============================================================
// research-floor-fd.js — a bettable PRA floor at FanDuel's real prices
// ============================================================
// pitch-1's floor lines (the model's 90% line, at least half the projection)
// are not offered at FanDuel: its alternate PRA ladder starts around 55–75%
// of the projection at −2500 to −4000. This tests the replacement before it
// is frozen as pitch-3: legs at FanDuel lines priced −200 to −400.
//
// Data (every row recorded before tip, current props model 2026-11-07.sdscale):
//   model    js/season/data/props-ledger.js, 2026-11-07 and 2026-11-08 (14 games)
//   prices   FanDuel's player_points_rebounds_assists_alternate ladder:
//            3 games from the live --odds pull (.odds/odds-ledger.json, 17–47 min
//            before tip); 11 from The Odds API's historical snapshot 60 min before
//            tip (--fetch; 10 credits a game + 1 per day for the events list,
//            ~112 in all, cached in .odds/history/ so a re-run is free)
//   results  the props ledger's settled box scores
//
// Pre-registered before the first fetch (committed before any result was seen):
//   eligible  pitch-1's floor pool: top 5 by projected minutes on each team, ≥ 28
//             projected minutes, listed fully available; a player who did not play
//             is void (FanDuel voids the prop)
//   rung      one per player: the ladder rung priced −200 to −400 nearest −300 (a tie
//             takes the lower line); a player with no rung in that band is counted
//             as "no bettable line"
//   Q1  calibration at those rungs: legs, hits, FanDuel's implied chance (vig
//       included), the model's chance (probOver on the recorded projection), Brier
//       of each, and 1-unit flat profit at FanDuel's price
//   Q2  Q1 split by the model at or above FanDuel's implied chance vs below
//   Q3  the draft pitch-3 ticket each night: legs with the model at or above the
//       implied chance, one per game, the 3 with the largest model − implied gap;
//       no ticket with fewer than 3; hit or miss and payout at FanDuel's prices
//   seen      the 3 live games' ladders and results were looked at on 2026-11-09 (the
//             check that prompted this), so only the 11 historical games are unseen;
//             Q1 shows the two apart
//   decision  none: 14 games (~80 legs, 2 nights) can show a gross mismatch, not
//             an edge. It sets pitch-3's band and edge rule; pitch-3 is judged live.
//
//   node research-floor-fd.js            score from what is cached (no API call)
//   node research-floor-fd.js --fetch    fetch the missing historical ladders first
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const FETCH = process.argv.includes('--fetch');
const BAND = [-400, -200], TARGET = -300, LEAD_MIN = 60, MAX_CREDITS = 150, FLOOR = 5000;
const DATES = ['2026-11-07', '2026-11-08'];
const MARKET = 'player_points_rebounds_assists_alternate';
const HIST = path.join(__dirname, '.odds/history');
const API = 'https://api.the-odds-api.com/v4';

const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error });
for (const f of ['js/season/data/season-constants.js', 'js/season/data/player-priors.js', 'js/season/data/chemistry-fit.js', 'js/season/data/aging-fit.js',
  'js/season/data/team-ratings.js', 'js/season/adapters.js', 'js/season/engine.js', 'js/season/props.js', 'js/season/replay-core.js',
  'js/season/props-ledger.js', 'js/season/data/props-ledger.js', 'js/season/data/season-ledger.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/^(const|let) /gm, 'var '), ctx);

const imp = (a) => a < 0 ? -a / (-a + 100) : 100 / (a + 100);
const pay = (a) => a < 0 ? 100 / -a : a / 100;
const games = ctx.SEASON_LEDGER.filter(r => DATES.includes(r.date));
const live = fs.existsSync(path.join(__dirname, '.odds/odds-ledger.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, '.odds/odds-ledger.json'), 'utf8')) : { games: {} };
const cacheFile = (name) => path.join(HIST, name);
const readCache = (name) => fs.existsSync(cacheFile(name)) ? JSON.parse(fs.readFileSync(cacheFile(name), 'utf8')) : null;

async function fetchHistory() {
  const key = process.env.ODDS_API_KEY;
  if (!key) throw new Error('ODDS_API_KEY is not set');
  const need = games.filter(g => !(live.games[g.id] && live.games[g.id].markets[MARKET]) && !readCache(`${g.date}-${g.id}.json`));
  const days = [...new Set(need.map(g => g.date))].filter(d => !readCache(`events-${d}.json`));
  const estimate = need.length * 10 + days.length;
  console.log(`fetch: ${need.length} ladders + ${days.length} events lists, at most ${estimate} credits (cap ${MAX_CREDITS})`);
  if (estimate > MAX_CREDITS) throw new Error(`estimate ${estimate} is over the cap`);
  fs.mkdirSync(HIST, { recursive: true });
  let spent = 0;
  const get = async (rel) => {
    const res = await fetch(`${API}${rel}&apiKey=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(30000) });
    const cost = +res.headers.get('x-requests-last') || 0, left = +res.headers.get('x-requests-remaining');
    spent += cost;
    if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).replace(/apiKey=[^&\s]+/g, 'apiKey=REDACTED').slice(0, 200)}`);
    console.log(`  ${rel.split('?')[0]}: ${cost} credits, ${left} left`);
    if (left < FLOOR) throw new Error(`below the ${FLOOR}-credit floor`);
    if (spent > MAX_CREDITS) throw new Error(`spent ${spent}, over the cap`);
    return res.json();
  };
  for (const d of [...new Set(need.map(g => g.date))]) {
    let ev = readCache(`events-${d}.json`);
    if (!ev) {
      const first = Math.min(...need.filter(g => g.date === d).map(g => new Date(g.tip).getTime())) - LEAD_MIN * 60e3;
      ev = await get(`/historical/sports/basketball_nba/events?date=${new Date(first).toISOString().replace(/\.\d+Z$/, 'Z')}`);
      fs.writeFileSync(cacheFile(`events-${d}.json`), JSON.stringify(ev));
    }
    for (const g of need.filter(x => x.date === d)) {
      const e = (ev.data || []).find(x => ctx.REPLAY_TEAM_BY_NAME[x.home_team] === g.home && ctx.REPLAY_TEAM_BY_NAME[x.away_team] === g.away);
      if (!e) { console.log(`  ${g.away} @ ${g.home}: not in the historical events list`); continue; }
      const at = new Date(new Date(g.tip).getTime() - LEAD_MIN * 60e3).toISOString().replace(/\.\d+Z$/, 'Z');
      const j = await get(`/historical/sports/basketball_nba/events/${e.id}/odds?bookmakers=fanduel&markets=${MARKET}&oddsFormat=american&date=${at}`);
      fs.writeFileSync(cacheFile(`${g.date}-${g.id}.json`), JSON.stringify(j));
    }
  }
  console.log(`fetch: ${spent} credits spent\n`);
}

// One game's ladder → {source, at, rungs: [{name, point, price}]}.
function ladder(g) {
  const l = live.games[g.id] && live.games[g.id].markets[MARKET];
  if (l) return { source: 'live', at: l.at, rungs: l.outcomes.filter(o => o.name === 'Over').map(o => ({ name: o.description, point: o.point, price: o.price })) };
  const h = readCache(`${g.date}-${g.id}.json`);
  if (!h) return null;
  const b = ((h.data && h.data.bookmakers) || []).find(x => x.key === 'fanduel');
  const m = b && b.markets.find(x => x.key === MARKET);
  return { source: 'history', at: h.timestamp, rungs: m ? m.outcomes.filter(o => o.name === 'Over').map(o => ({ name: o.description, point: o.point, price: o.price })) : [] };
}

function rec(legs) {
  const s = legs.filter(l => l.hit != null);
  const n = s.length, w = s.filter(l => l.hit).length;
  const f = s.reduce((a, l) => a + l.fd, 0), m = s.reduce((a, l) => a + l.model, 0);
  const bF = s.reduce((a, l) => a + (l.fd - (l.hit ? 1 : 0)) ** 2, 0), bM = s.reduce((a, l) => a + (l.model - (l.hit ? 1 : 0)) ** 2, 0);
  const u = s.reduce((a, l) => a + (l.hit ? pay(l.price) : -1), 0);
  const v = s.reduce((a, l) => a + l.fd * (1 - l.fd), 0);
  return n ? `${String(w).padStart(2)}/${String(n).padEnd(3)} hit ${(100 * w / n).toFixed(1)}%  FanDuel ${(100 * f / n).toFixed(1)}%  model ${(100 * m / n).toFixed(1)}%  Brier FD ${(bF / n).toFixed(3)} model ${(bM / n).toFixed(3)}  z vs FD ${((w - f) / Math.sqrt(v)).toFixed(2)}  ${u >= 0 ? '+' : ''}${u.toFixed(2)}u (${(100 * u / n).toFixed(1)}%)` : '—';
}

(async () => {
  if (FETCH) await fetchHistory();
  const legs = [], noRung = [], noLadder = [];
  for (const g of games) {
    const L = ladder(g);
    if (!L) { noLadder.push(`${g.away} @ ${g.home}`); continue; }
    const rows = ctx.SEASON_PROPS_LEDGER.filter(r => r.game === g.id && r.rank <= 5 && r.min >= 28 && r.avail === 1);
    for (const r of rows) {
      const k = ctx._propNameKey(r.name);
      const band = L.rungs.filter(o => ctx._propNameKey(o.name) === k && o.price >= BAND[0] && o.price <= BAND[1])
        .sort((a, b) => Math.abs(a.price - TARGET) - Math.abs(b.price - TARGET) || a.point - b.point);
      if (!band.length) { noRung.push(`${r.name} (${L.rungs.some(o => ctx._propNameKey(o.name) === k) ? 'ladder, nothing −200 to −400' : 'no ladder'})`); continue; }
      const o = band[0];
      const hit = !r.result ? null : !r.result.played ? null : r.result.pra > o.point;
      legs.push({ date: g.date, game: g.id, matchup: `${g.away} @ ${g.home}`, source: L.source, name: r.name, proj: r.pra, point: o.point, price: o.price,
        fd: imp(o.price), model: ctx.probOver(r.pra, r.sd.pra, o.point), hit, actual: r.result ? r.result.pra : null, played: r.result ? r.result.played : null });
    }
  }
  console.log(`FanDuel alternate PRA, rungs −200 to −400 nearest −300; ${games.length - noLadder.length} of ${games.length} games priced${noLadder.length ? ` (missing: ${noLadder.join(', ')} — run with --fetch)` : ''}`);
  console.log(`eligible starters with a rung: ${legs.length}; without: ${noRung.length}${noRung.length ? ` — ${noRung.join('; ')}` : ''}; void (did not play): ${legs.filter(l => l.played === false).length}\n`);
  console.log(`Q1 every leg               ${rec(legs)}`);
  console.log(`   from the live pull      ${rec(legs.filter(l => l.source === 'live'))}`);
  console.log(`   from history (T−60)     ${rec(legs.filter(l => l.source === 'history'))}`);
  console.log(`Q2 model ≥ FanDuel         ${rec(legs.filter(l => l.model >= l.fd))}`);
  console.log(`   model < FanDuel         ${rec(legs.filter(l => l.model < l.fd))}`);
  console.log('Q3 draft pitch-3 tickets:');
  for (const d of DATES) {
    const pool = legs.filter(l => l.date === d && l.model >= l.fd && l.hit != null).sort((a, b) => (b.model - b.fd) - (a.model - a.fd));
    const pick = [];
    for (const l of pool) if (!pick.some(x => x.game === l.game) && pick.length < 3) pick.push(l);
    if (pick.length < 3) { console.log(`   ${d}: no ticket (${pick.length} qualifying game${pick.length === 1 ? '' : 's'})`); continue; }
    const dec = pick.reduce((a, l) => a * (1 + pay(l.price)), 1), win = pick.every(l => l.hit);
    console.log(`   ${d}: ${pick.map(l => `${l.name} o${l.point} ${l.price} (model ${(100 * l.model).toFixed(0)}% vs ${(100 * l.fd).toFixed(0)}%) ${l.hit ? '✓' : '✗'} ${l.actual}`).join(' · ')}`);
    console.log(`      price ${dec >= 2 ? '+' + Math.round((dec - 1) * 100) : Math.round(-100 / (dec - 1))}, model ${(100 * pick.reduce((a, l) => a * l.model, 1)).toFixed(1)}%, ${win ? `WIN +${(dec - 1).toFixed(2)}u` : 'loss −1u'}`);
  }
  console.log('\nevery leg:');
  for (const l of legs) console.log(`  ${l.date} ${l.matchup.padEnd(11)} ${l.name.padEnd(22)} proj ${String(l.proj).padStart(4)}  o${l.point} ${l.price}  FD ${(100 * l.fd).toFixed(0)}% model ${(100 * l.model).toFixed(0)}%  ${l.hit == null ? 'void' : l.hit ? '✓' : '✗'} ${l.actual}  [${l.source}]`);
})().catch(e => { console.error(e.message); process.exit(1); });
