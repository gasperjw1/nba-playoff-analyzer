#!/usr/bin/env node
// ============================================================
// test-odds.js — spec odds-1 (js/season/odds.js, odds-pull.js)
// ============================================================
// The guards that keep The Odds API credits from being spent twice, on a
// mocked API: no real request is made and no key is needed.
//   node test-odds.js
// ============================================================
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { pullOdds, acquireLock } = require('./odds-pull.js');

let passed = 0, failed = 0;
function assert(ok, msg) { if (ok) passed++; else { failed++; console.log('  FAIL:', msg); } }

const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error });
for (const f of ['js/season/data/season-constants.js', 'js/season/data/player-priors.js', 'js/season/data/chemistry-fit.js', 'js/season/data/aging-fit.js',
  'js/season/data/team-ratings.js', 'js/season/adapters.js', 'js/season/engine.js', 'js/season/props.js', 'js/season/replay-core.js',
  'js/season/props-ledger.js', 'js/season/odds.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/^(const|let) /gm, 'var '), ctx);
const S = ctx.SEASON_ODDS_SPEC;
const T0 = Date.UTC(2026, 10, 9, 23, 0);   // 6:00 PM ET
const min = 60e3;
const game = (id, home, away, tipMin) => ({ id, date: '2026-11-09', tip: new Date(T0 + tipMin * min).toISOString(), home, away });

console.log('TEST 1: spec');
assert(S.version === 'odds-1' && S.book === 'fanduel' && S.windowMin === 60 && S.tries === 3 && S.lines.join() === 'h2h,spreads' && S.props.length === 6, 'spec constants');
assert(S.props.every(k => ctx.SEASON_ODDS_STAT[k]), 'every prop market maps to a projected stat');

console.log('TEST 2: which games are due');
{
  const gs = [game('1', 'BOS', 'MIL', 30), game('2', 'LAC', 'NO', 61), game('3', 'DET', 'LAL', -5), game('4', 'MIN', 'UTAH', 60)];
  const due = ctx.oddsDueGames(gs, { games: {} }, T0);
  assert(due.map(d => d.game.id).join() === '1,4', 'due: tip within 60 minutes (inclusive), not tipped, not later');
  assert(due[0].lines.length === 2 && due[0].props.length === 6, 'a fresh game needs every market');
  const led = { games: { 1: { markets: { h2h: {}, player_points: {} }, tries: { spreads: 3 } } } };
  const d1 = ctx.oddsDueGames(gs, led, T0)[0];
  assert(d1.lines.length === 0 && d1.props.length === 5 && !d1.props.includes('player_points'), 'stored markets are never requested; a market out of tries is not either');
  const all = { games: { 1: { markets: Object.fromEntries([...S.lines, ...S.props].map(k => [k, {}])), tries: {} } } };
  assert(ctx.oddsDueGames(gs, all, T0).map(d => d.game.id).join() === '4', 'a game with every market stored is not due');
  assert(ctx.oddsEstimate(due) === 2 + 12, 'estimate: the line call once (2) plus each game\'s props (6 + 6)');
}

console.log('TEST 3: run plan');
{
  const gs = [game('a', 'CHI', 'PHI', 90), game('b', 'DET', 'LAL', 120), game('c', 'MIN', 'UTAH', 150), game('d', 'SAC', 'MIA', 240)];
  const plan = ctx.oddsRunPlan(gs, { games: {} }, T0);
  assert(plan.length === 3, 'three runs: 7:30 + 8:00, 8:30, 10:00');
  assert(plan[0].games.map(g => g.id).join() === 'a,b' && plan[0].from === T0 + 60 * min && plan[0].to === T0 + 90 * min, 'first run between 7:00 and 7:30 covers both tips');
  assert(plan[1].games.map(g => g.id).join() === 'c' && plan[2].games.map(g => g.id).join() === 'd', 'later runs');
}

console.log('TEST 4: matching and recording');
{
  const g = game('7', 'LAC', 'NO', 30);
  const evs = [{ id: 'e7', home_team: 'Los Angeles Clippers', away_team: 'New Orleans Pelicans', commence_time: g.tip },
    { id: 'old', home_team: 'Los Angeles Clippers', away_team: 'New Orleans Pelicans', commence_time: new Date(T0 - 3 * 86400e3).toISOString() }];
  const m = ctx.oddsMatchEvents([g], evs);
  assert(m.get('7') && m.get('7').id === 'e7', 'matched by full names and tip, not a game days away');
  assert(ctx.oddsMatchEvents([g], [{ ...evs[0], home_team: 'LA Clippers' }]).get('7'), 'LA Clippers spelling matches too');
  const ev = { id: 'e7', bookmakers: [{ key: 'draftkings', markets: [{ key: 'h2h', outcomes: [{ name: 'Los Angeles Clippers', price: -999 }] }] },
    { key: 'fanduel', last_update: '2026-11-09T22:40:00Z', markets: [
      { key: 'h2h', outcomes: [{ name: 'Los Angeles Clippers', price: -120 }, { name: 'New Orleans Pelicans', price: 102 }] },
      { key: 'spreads', outcomes: [{ name: 'Los Angeles Clippers', price: -110, point: -1.5 }, { name: 'New Orleans Pelicans', price: -110, point: 1.5 }] },
      { key: 'player_points', outcomes: [{ name: 'Over', description: 'Nikola Jokić', price: -115, point: 20.5 }, { name: 'Under', description: 'Nikola Jokić', price: -105, point: 20.5 }, { name: 'Over', description: 'Nobody Known', price: 100, point: 9.5 }] }] }] };
  const bm = ctx.oddsBookMarkets(ev, 'fanduel');
  assert(bm.h2h.outcomes[0].price === -120 && !bm.player_rebounds, 'FanDuel\'s markets only');
  const model = { pHome: 0.55, report: 'Injury-Report_2026-11-09_05_00PM.pdf', props: [{ player: '3112335', name: 'Nikola Jokic', pts: 24, sd: { pts: 6 } }] };
  const led = { games: {} };
  const k1 = ctx.oddsRecord(led, g, ev, ['h2h', 'spreads', 'player_points', 'player_rebounds'], bm, 'T1', model);
  const row = led.games['7'];
  assert(k1.join() === 'h2h,spreads,player_points' && !row.markets.player_rebounds && row.tries.player_rebounds === 1, 'stores what the reply holds; a missing market counts a try');
  assert(row.markets.h2h.outcomes[0].team === 'LAC' && row.markets.h2h.outcomes[0].p === 0.55 && row.markets.h2h.outcomes[1].p === 0.45, 'h2h priced by the model at pull time');
  const over = row.markets.player_points.outcomes[0], under = row.markets.player_points.outcomes[1];
  const pOver = ctx.probOver(24, 6, 20.5);
  assert(over.player === '3112335' && Math.abs(over.p - pOver) < 1e-4 && Math.abs(under.p - (1 - pOver)) < 1e-4, 'props: player matched across accents, Over/Under chances from the projection');
  assert(row.markets.player_points.outcomes[2].p === null && row.markets.player_points.outcomes[2].player === null, 'unknown player kept, unpriced');
  const l = ctx.oddsGameLines(row);
  assert(l.mlHome === -120 && l.mlAway === 102 && l.spreadHome === -1.5, 'lines in our terms');
  const before = JSON.stringify(row.markets.h2h);
  const bm2 = ctx.oddsBookMarkets({ bookmakers: [{ key: 'fanduel', markets: [{ key: 'h2h', outcomes: [{ name: 'Los Angeles Clippers', price: -200 }] }] }] }, 'fanduel');
  assert(ctx.oddsRecord(led, g, ev, ['h2h'], bm2, 'T2', model).length === 0 && JSON.stringify(row.markets.h2h) === before, 'a stored market is never overwritten');
  const u = ctx.oddsUsage(new Headers({ 'x-requests-last': '6', 'x-requests-used': '106', 'x-requests-remaining': '19894' }));
  assert(u.cost === 6 && u.used === 106 && u.remaining === 19894 && ctx.oddsUsage({}).cost === null, 'usage headers');
  assert(ctx.oddsRedact('GET /v4/x?apiKey=abc123&markets=h2h') === 'GET /v4/x?apiKey=REDACTED&markets=h2h', 'key redacted');
}

console.log('TEST 5: a mocked night — nothing is paid for twice');
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'odds-test-'));
  const ledgerPath = path.join(dir, 'odds-ledger.json'), lockPath = path.join(dir, 'odds.lock');
  const KEY = 'secret-key-xyz';
  const games = [game('11', 'BOS', 'MIL', 40), game('12', 'MIN', 'UTAH', 50), game('13', 'SAC', 'MIA', 200)];
  const events = [{ id: 'eB', home_team: 'Boston Celtics', away_team: 'Milwaukee Bucks', commence_time: games[0].tip },
    { id: 'eM', home_team: 'Minnesota Timberwolves', away_team: 'Utah Jazz', commence_time: games[1].tip },
    { id: 'eS', home_team: 'Sacramento Kings', away_team: 'Miami Heat', commence_time: games[2].tip }];
  const fd = (markets) => ({ key: 'fanduel', last_update: 'x', markets });
  const propMk = (k) => ({ key: k, outcomes: [{ name: 'Over', description: 'Someone', point: 10.5, price: -110 }, { name: 'Under', description: 'Someone', point: 10.5, price: -110 }] });
  let remaining = 20000, postedM = ['player_points'];
  const urls = [];
  const fetchImpl = async (url) => {
    urls.push(url);
    const u = new URL(url), mk = (u.searchParams.get('markets') || '').split(',').filter(Boolean);
    let body, cost = 0;
    if (/\/events$/.test(u.pathname)) body = events;
    else if (/\/odds$/.test(u.pathname) && !/\/events\//.test(u.pathname)) {
      const ids = u.searchParams.get('eventIds').split(',');
      body = events.filter(e => ids.includes(e.id)).map(e => ({ ...e, bookmakers: [fd(mk.map(k => ({ key: k, outcomes: [{ name: e.home_team, price: -150, point: k === 'spreads' ? -3.5 : undefined }, { name: e.away_team, price: 130, point: k === 'spreads' ? 3.5 : undefined }] })))] }));
      cost = body.length ? mk.length : 0;
    } else {
      const id = u.pathname.split('/')[5];
      const avail = id === 'eB' ? mk.filter(k => k !== 'player_points_rebounds_assists_alternate') : mk.filter(k => postedM.includes(k));
      body = { ...events.find(e => e.id === id), bookmakers: avail.length ? [fd(avail.map(propMk))] : [] };
      cost = avail.length;
    }
    remaining -= cost;
    return { ok: true, status: 200, headers: new Headers({ 'x-requests-last': String(cost), 'x-requests-remaining': String(remaining), 'x-requests-used': String(20000 - remaining) }), json: async () => body, text: async () => '' };
  };
  const logs = [];
  const run = (o) => pullOdds({ ctx, key: KEY, games, now: T0, ledgerPath, lockPath, fetchImpl, log: (s) => logs.push(s), buildModel: async (gs) => new Map(gs.map(g => [String(g.id), { pHome: 0.6, props: [] }])), sleep: async () => {}, ...o });

  // Dry: lists, never calls.
  const dry = await run({ dry: true, key: null });
  assert(dry.due === 2 && urls.length === 0, 'dry: two games due, no API call, no key needed');

  const r1 = await run();
  assert(r1.cost === 2 + 5 + 1 && remaining === 20000 - 8, 'run 1: lines once for both games (2) + BOS props (5) + MIN props posted (1)');
  assert(urls.length === 4 && urls[0].includes('/events?') && urls[1].includes('markets=h2h,spreads') && urls[1].includes('eventIds=eB,eM'), 'run 1: events (free), one slate-wide line call');
  assert(!urls.some(u => u.includes('eS')), 'the 9:20 game is not due and never requested');
  let led = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  assert(Object.keys(led.games).join() === '11,12' && led.games['11'].markets.h2h.outcomes[0].p === 0.6, 'ledger holds both games with the model at pull time');
  assert(led.calls.some(c => c.kind === 'events' && c.cost === 0) && led.calls.filter(c => c.kind === 'props').every(c => c.cost != null && c.remaining != null), 'every call is logged with its usage (the events list costs 0)');

  const n1 = urls.length;
  postedM = ['player_points', 'player_rebounds', 'player_assists'];
  const r2 = await run();
  const new2 = urls.slice(n1);
  assert(!new2.some(u => u.includes('markets=h2h') || u.includes('spreads')), 'run 2: no line call (both games have their lines)');
  const bosProps = new2.find(u => u.includes('/events/eB/odds')), minProps = new2.find(u => u.includes('/events/eM/odds'));
  assert(new URL(bosProps).searchParams.get('markets') === 'player_points_rebounds_assists_alternate', 'run 2: BOS asks only for the market it lacks');
  assert(!new URL(minProps).searchParams.get('markets').includes('player_points,') && new URL(minProps).searchParams.get('markets').split(',').length === 5, 'run 2: MIN asks only its five missing prop markets');
  assert(r2.cost === 2, 'run 2: pays only for the two newly posted MIN markets');

  await run(); const n3 = urls.length; const r4 = await run();
  assert(r4.calls === 0 && urls.length === n3, 'after three tries a market FanDuel never posts stops being requested: run 4 makes no call');
  led = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  assert(led.games['11'].tries.player_points_rebounds_assists_alternate === 3 && led.games['11'].tries.h2h === 1, 'tries recorded per market');
  assert(!logs.join('\n').includes(KEY) && !JSON.stringify(led).includes(KEY), 'the key is never logged or stored');

  // Lock held by another live process.
  fs.writeFileSync(lockPath, String(process.ppid));
  let locked = false;
  try { await run({ games: [game('21', 'DET', 'LAL', 30)] }); } catch (e) { locked = /another --odds run/.test(e.message); }
  assert(locked, 'a second concurrent run is refused');
  fs.unlinkSync(lockPath);
  // A stale lock (dead pid) is taken over and released.
  fs.writeFileSync(lockPath, '999999');
  const rel = acquireLock(lockPath); rel();
  assert(!fs.existsSync(lockPath), 'a stale lock is taken over, then released');

  // Credit floor: with few credits left, no charged call is made.
  events.push({ id: 'eN', home_team: 'New York Knicks', away_team: 'Cleveland Cavaliers', commence_time: game('31', 'NY', 'CLE', 30).tip });
  remaining = 505;
  const before = urls.length;
  const low = await run({ games: [game('31', 'NY', 'CLE', 30)], ledgerPath: path.join(dir, 'low.json') });
  assert(low.cost === 0 && urls.length === before + 1 && logs.some(s => /stopped: 505 credits left/.test(s)), 'below the floor: only the free events call, then stop');

  // A model failure still stores the prices.
  remaining = 20000;
  const nm = await run({ games: [game('41', 'NY', 'CLE', 30)], ledgerPath: path.join(dir, 'nomodel.json'), buildModel: async () => { throw new Error('feed down'); } });
  const nl = JSON.parse(fs.readFileSync(path.join(dir, 'nomodel.json'), 'utf8'));
  assert(nm.stored > 0 && nl.games['41'].markets.h2h.model === null && logs.some(s => /model unavailable \(feed down\)/.test(s)), 'model failure: prices stored, model left null');

  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
