#!/usr/bin/env node
// ============================================================
// test-odds.js — specs odds-1, odds-2 and shop-1 (js/season/odds.js, odds-pull.js, js/season/shop.js)
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
  'js/season/props-ledger.js', 'js/season/odds.js', 'js/season/shop.js', 'js/season/parlay.js', 'js/season/pitch3.js', 'js/season/flat.js', 'js/season/fade.js', 'js/season/shop2.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/^(const|let) /gm, 'var '), ctx);
const S = ctx.SEASON_ODDS_SPEC;
const T0 = Date.UTC(2026, 10, 9, 23, 0);   // 6:00 PM ET
const min = 60e3;
const game = (id, home, away, tipMin) => ({ id, date: '2026-11-09', tip: new Date(T0 + tipMin * min).toISOString(), home, away });

console.log('TEST 1: spec');
assert(S.version === 'odds-1' && S.book === 'fanduel' && S.windowMin === 60 && S.tries === 3 && S.minRemaining === 5000 && S.maxPerGame === 10 && S.lines.join() === 'h2h,spreads' && S.props.length === 6, 'spec constants');
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
  // The 10-credit cap per game.
  const capped = (credits, markets) => ctx.oddsDueGames([gs[0]], { games: { 1: { credits, markets: markets || {}, tries: {} } } }, T0)[0];
  const c8 = capped(8);
  assert(c8.lines.length === 2 && c8.props.length === 0, 'cap: 8 spent, lines (2) still fit, no props');
  const c9 = capped(9);
  assert(c9.lines.length === 0 && c9.props.join() === 'player_points', 'cap: 9 spent, the 2-credit line call is left out, one prop fits');
  const c6 = capped(6, { h2h: {}, spreads: {} });
  assert(c6.props.length === 4 && !c6.props.includes('player_points_rebounds_assists_alternate') && !c6.props.includes('player_threes'), 'cap: props trimmed in spec order, alternate PRA first');
  assert(ctx.oddsDueGames([gs[0]], { games: { 1: { credits: 10, markets: {}, tries: {} } } }, T0).length === 0, 'cap reached: the game is no longer due');
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
  assert(logs.some(s => /nothing due right now.*the next window opens at .* \(in \d+ min\)/.test(s)) && logs.some(s => /already priced tonight: MIL @ BOS, UTAH @ MIN/.test(s)), 'nothing due: says when the next window opens and what is already priced');
  led = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  assert(led.games['11'].tries.player_points_rebounds_assists_alternate === 3 && led.games['11'].tries.h2h === 1, 'tries recorded per market');
  assert(Object.values(led.games).every(g => g.credits <= S.maxPerGame) && led.games['11'].credits === 7 && led.games['12'].credits === 2 + 1 + 2, 'credits charged per game, all within the cap (BOS 2 + 5, MIN 2 + 1 + 2)');
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
  remaining = 5005;
  const before = urls.length;
  const low = await run({ games: [game('31', 'NY', 'CLE', 30)], ledgerPath: path.join(dir, 'low.json') });
  assert(low.cost === 0 && urls.length === before + 1 && logs.some(s => /stopped: 5005 credits left/.test(s)), 'below the floor: only the free events call, then stop');

  // A model failure still stores the prices.
  remaining = 20000;
  const nm = await run({ games: [game('41', 'NY', 'CLE', 30)], ledgerPath: path.join(dir, 'nomodel.json'), buildModel: async () => { throw new Error('feed down'); } });
  const nl = JSON.parse(fs.readFileSync(path.join(dir, 'nomodel.json'), 'utf8'));
  assert(nm.stored > 0 && nl.games['41'].markets.h2h.model === null && logs.some(s => /model unavailable \(feed down\)/.test(s)), 'model failure: prices stored, model left null');

  console.log('TEST 6: the once-a-day ladder pull (--record)');
  {
    const L = ctx.SEASON_ODDS_LADDER_SPEC, lp = path.join(dir, 'ladder.json');
    assert(L.ladder && L.lines.length === 0 && L.props.join() === 'player_points_rebounds_assists_alternate' && L.maxPerGame === 10 && L.minRemaining === 5000, 'ladder spec: alt PRA only, same caps and floor');
    const gs = [game('51', 'BOS', 'MIL', 40), game('52', 'MIN', 'UTAH', 200), game('53', 'SAC', 'MIA', 400)];
    const evs = [['eB', 'Boston Celtics', 'Milwaukee Bucks', 0], ['eM', 'Minnesota Timberwolves', 'Utah Jazz', 1], ['eS', 'Sacramento Kings', 'Miami Heat', 2]]
      .map(([id, h, a, i]) => ({ id, home_team: h, away_team: a, commence_time: gs[i].tip }));
    let left = 20000, posted = new Set(['eB', 'eM']);
    const seen = [];
    const fi = async (url) => {
      seen.push(url);
      const u = new URL(url), mk = (u.searchParams.get('markets') || '').split(',').filter(Boolean);
      let body, cost = 0;
      if (/\/events$/.test(u.pathname)) body = evs;
      else if (!/\/events\//.test(u.pathname)) { const ids = u.searchParams.get('eventIds').split(','); body = evs.filter(e => ids.includes(e.id)).map(e => ({ ...e, bookmakers: [{ key: 'fanduel', markets: mk.map(k => ({ key: k, outcomes: [{ name: e.home_team, price: -150, point: k === 'spreads' ? -3.5 : undefined }, { name: e.away_team, price: 130, point: k === 'spreads' ? 3.5 : undefined }] })) }] })); cost = mk.length; }
      else { const id = u.pathname.split('/')[5]; const av = posted.has(id) ? mk : []; body = { ...evs.find(e => e.id === id), bookmakers: av.length ? [{ key: 'fanduel', markets: av.map(k => ({ key: k, outcomes: [{ name: 'Over', description: 'Someone', point: 15.5, price: -300 }] })) }] : [] }; cost = av.length; }
      left -= cost;
      return { ok: true, status: 200, headers: new Headers({ 'x-requests-last': String(cost), 'x-requests-remaining': String(left), 'x-requests-used': String(20000 - left) }), json: async () => body, text: async () => '' };
    };
    const base = { ctx, key: KEY, games: gs, now: T0, ledgerPath: lp, lockPath, fetchImpl: fi, log: () => {}, sleep: async () => {}, buildModel: async (g2) => new Map(g2.map(g => [String(g.id), { pHome: 0.5, props: [] }])) };
    const l1 = await pullOdds({ ...base, spec: L });
    assert(l1.cost === 2 && seen.length === 4 && !seen.some(u => /markets=h2h|spreads/.test(u)) && seen.slice(1).every(u => new URL(u).searchParams.get('markets') === 'player_points_rebounds_assists_alternate'), 'ladder pull: every game still to tip, alt PRA only, 1 credit per posted ladder, no line call');
    let led = JSON.parse(fs.readFileSync(lp, 'utf8'));
    assert(led.games['51'].markets.player_points_rebounds_assists_alternate && !led.games['53'].markets.player_points_rebounds_assists_alternate && !(led.games['53'].tries.player_points_rebounds_assists_alternate), 'a ladder not posted yet is free and counts no try');
    const n1 = seen.length;
    const r = await pullOdds({ ...base });
    const hourBefore = seen.slice(n1).filter(u => /\/events\/eB\/odds/.test(u));
    assert(hourBefore.length === 1 && !new URL(hourBefore[0]).searchParams.get('markets').includes('alternate') && r.cost === 2 + 5, 'the hour-before pull then skips the stored ladder: lines (2) + 5 props');
    led = JSON.parse(fs.readFileSync(lp, 'utf8'));
    assert(led.games['51'].credits === 1 + 2 + 5 && led.games['51'].credits <= 10, 'one game in all: ladder 1 + lines 2 + props 5 = 8, under the cap');
    posted.add('eS');
    const n2 = seen.length;
    const l2 = await pullOdds({ ...base, spec: L });
    assert(l2.cost === 1 && seen.slice(n2).filter(u => /\/events\/e.\/odds/.test(u)).length === 1 && seen.slice(n2).some(u => u.includes('/events/eS/odds')), 'a second record pulls only the ladder still missing');
    const n3 = seen.length;
    const l3 = await pullOdds({ ...base, spec: L });
    assert(l3.calls === 0 && seen.length === n3, 'every ladder stored: a third record makes no call');
  }

  console.log('TEST 7: odds-2 spec');
  {
    const O = ctx.SEASON_ODDS2_SPEC;
    assert(O.version === 'odds-2' && O.book === 'fanduel' && O.lineBooks.length === 10 && O.lineBooks[0] === 'fanduel' && O.lineBooks.includes('draftkings') && O.lineBooks.includes('pinnacle'), 'ten line books, FanDuel first, DraftKings and Pinnacle in');
    assert(new Set(O.lineBooks).size === 10 && ctx.oddsLineCost(2, O.lineBooks) === 2 && ctx.oddsLineCost(2, [...O.lineBooks, 'x']) === 4, 'ten distinct books cost one region (2 credits for two markets); an eleventh would double it');
    assert(O.minRemaining === 5000 && O.maxPerGame === 10 && O.tries === 3 && O.props.join() === S.props.join(), 'every odds-1 guard and the FanDuel props unchanged');
    assert(ctx.oddsLineBooks(O, {}).length === 10 && ctx.oddsLineBooks(O, { multiBookOff: {} }).join() === 'fanduel' && ctx.oddsLineBooks(S, {}).join() === 'fanduel', 'the cost guard falls back to FanDuel alone; odds-1 was FanDuel alone');
  }

  console.log('TEST 8: odds-2, a mocked multi-book night');
  {
    const O = ctx.SEASON_ODDS2_SPEC, lp = path.join(dir, 'multi.json');
    const gs = [game('61', 'BOS', 'MIL', 40), game('62', 'MIN', 'UTAH', 50)];
    const evs = [{ id: 'eB', home_team: 'Boston Celtics', away_team: 'Milwaukee Bucks', commence_time: gs[0].tip }, { id: 'eM', home_team: 'Minnesota Timberwolves', away_team: 'Utah Jazz', commence_time: gs[1].tip }];
    const book = (key, h, a, mk) => ({ key, last_update: 'u', markets: mk.map(k => ({ key: k, outcomes: [{ name: '', price: 0 }].length && [
      { name: k === 'h2h' || k === 'spreads' ? 'HOME' : '', price: k === 'h2h' ? h : -110, point: k === 'spreads' ? -3.5 : undefined },
      { name: 'AWAY', price: k === 'h2h' ? a : -110, point: k === 'spreads' ? 3.5 : undefined }] })) });
    let left = 20000, lineCost = null;
    const seen = [];
    const fi = async (url) => {
      seen.push(url);
      const u = new URL(url), mk = (u.searchParams.get('markets') || '').split(',').filter(Boolean);
      let body, cost = 0;
      if (/\/events$/.test(u.pathname)) body = evs;
      else if (!/\/events\//.test(u.pathname)) {
        const ids = u.searchParams.get('eventIds').split(','), bks = u.searchParams.get('bookmakers').split(',');
        body = evs.filter(e => ids.includes(e.id)).map(e => ({ ...e, bookmakers: [['fanduel', 120, -140], ['draftkings', 105, -125], ['williamhill_us', 100, -120], ['pinnacle', 106, -116]]
          .filter(([k]) => bks.includes(k)).map(([k, h, a]) => { const b = book(k, h, a, mk); b.markets.forEach(m => { m.outcomes[0].name = e.home_team; m.outcomes[1].name = e.away_team; }); return b; }) }));
        cost = lineCost != null ? lineCost : mk.length;
      } else { body = { ...evs.find(e => e.id === u.pathname.split('/')[5]), bookmakers: [] }; cost = 0; }
      left -= cost;
      return { ok: true, status: 200, headers: new Headers({ 'x-requests-last': String(cost), 'x-requests-remaining': String(left), 'x-requests-used': String(20000 - left) }), json: async () => body, text: async () => '' };
    };
    const logs = [];
    const base = { ctx, key: KEY, games: gs, now: T0, ledgerPath: lp, lockPath, fetchImpl: fi, log: (x) => logs.push(x), sleep: async () => {}, buildModel: async (g2) => new Map(g2.map(g => [String(g.id), { pHome: 0.5, props: [] }])), spec: O };
    const r1 = await pullOdds(base);
    const lineUrl = seen.find(u => /markets=h2h/.test(u));
    assert(new URL(lineUrl).searchParams.get('bookmakers').split(',').join() === O.lineBooks.join() && r1.cost === 2, 'one line call names the ten books and costs 2, as FanDuel alone did');
    let led = JSON.parse(fs.readFileSync(lp, 'utf8'));
    const row = led.games['61'];
    assert(ctx.oddsGameLines(row).mlHome === 120 && ctx.oddsGameLines(row).mlAway === -140 && row.markets.h2h.outcomes.length === 2, 'FanDuel stored in markets exactly as before');
    assert(Object.keys(row.books).sort().join() === 'draftkings,pinnacle,williamhill_us' && row.books.draftkings.h2h.home === 105 && row.books.draftkings.h2h.away === -125 && row.books.pinnacle.spreads.home.point === -3.5, 'the other books stored by team in row.books, FanDuel not duplicated');
    assert(row.credits === 2 && !led.multiBookOff, 'the game is charged the shared 2 credits; no cost warning');
    assert(logs.some(x => /price check \(shop-1\): consensus BOS .* over 4 books \(Pinnacle 47\.5%\).*FLAG BOS \+120 at FanDuel \(EV \+4\.5%, fair 47\.5%\)/.test(x)), 'the --odds output carries the price check with the flag (4 books: FanDuel\'s consensus is the median of 3, 0.4748; EV 0.0445 shown +4.5%)');
    const n1 = seen.length; const r2 = await pullOdds(base);
    assert(!seen.slice(n1).some(u => /markets=h2h/.test(u)) && r2.cost === 0, 'a second run makes no line call: the books are never re-pulled');
    const before = JSON.stringify(row.books);
    ctx.oddsRecordBooks(led, gs[0], { bookmakers: [book('draftkings', 999, -999, ['h2h'])].map(b => { b.markets[0].outcomes[0].name = 'Boston Celtics'; b.markets[0].outcomes[1].name = 'Milwaukee Bucks'; return b; }) }, O.lineBooks, 'T9', 'fanduel');
    assert(JSON.stringify(led.games['61'].books) === before, 'a stored book is never overwritten');
    // The cost guard: a line call that charges 4 turns multi-book off; the next run asks FanDuel only.
    const lp2 = path.join(dir, 'guard.json'); lineCost = 4;
    await pullOdds({ ...base, ledgerPath: lp2, games: [gs[0]] });
    led = JSON.parse(fs.readFileSync(lp2, 'utf8'));
    assert(led.multiBookOff && led.multiBookOff.cost === 4 && led.multiBookOff.expected === 2 && logs.some(x => /WARNING: the 10-book line call cost 4 credits, not 2/.test(x)), 'cost above markets × ⌈books / 10⌉: warned and multiBookOff set');
    lineCost = null; const n2 = seen.length;
    await pullOdds({ ...base, ledgerPath: lp2, games: [gs[1]] });
    const u2 = seen.slice(n2).find(u => /markets=h2h/.test(u));
    assert(u2 && new URL(u2).searchParams.get('bookmakers') === 'fanduel', 'after the warning, later runs pull FanDuel only');
  }

  console.log('TEST 9: shop-1 price check, by hand');
  {
    const H = ctx.SEASON_SHOP_SPEC;
    assert(H.version === 'shop-1' && H.yours.join() === 'fanduel,draftkings' && H.minOthers === 3 && H.edge === 0.01 && H.maxEdge === 0.10 && H.readAt === 150, 'spec constants');
    const imp = (a) => (a < 0 ? -a / (-a + 100) : 100 / (a + 100)), nvh = (h, a) => imp(h) / (imp(h) + imp(a));
    const row = { game: '71', date: '2026-11-16', home: 'BOS', away: 'MIL', markets: { h2h: { outcomes: [{ team: 'BOS', price: 120 }, { team: 'MIL', price: -140 }] } },
      books: { draftkings: { h2h: { home: 105, away: -125 } }, williamhill_us: { h2h: { home: 100, away: -120 } }, betmgm: { h2h: { home: 100, away: -120 } },
        pinnacle: { h2h: { home: 106, away: -116 } }, fanatics: { h2h: { home: -120, away: 120 } }, lowvig: { h2h: { home: -105, away: 50 } } } };
    // By hand: FanDuel's consensus = median(DK 0.467532, Caesars 0.478261, BetMGM 0.478261, Pinnacle 0.474767) = 0.476514.
    // Fanatics (zero vig) and LowVig (+50, under ±100) aren't usable.
    const fdFair = (nvh(106, -116) + nvh(100, -120)) / 2;
    assert(Math.abs(fdFair - 0.476514) < 1e-5, 'hand value of the leave-one-out consensus');
    const c = ctx.shopPrices(row);
    assert(c.books === 5 && Math.abs(c.fair - nvh(106, -116)) < 1e-4 && Math.abs(c.pinnacle - 0.4748) < 1e-4, 'five usable books (zero-vig and sub-100 lines dropped); all-book median = Pinnacle 0.4748');
    assert(Math.abs(c.sides.home.fanduel.ev - (fdFair * 2.2 - 1)) < 1e-4 && Math.abs(c.sides.home.fanduel.ev - 0.0483) < 1e-4, 'FanDuel BOS +120: EV +4.83%');
    assert(Math.abs(c.sides.home.draftkings.ev - (fdFair * 2.05 - 1)) < 1e-4 && Math.abs(c.sides.away.fanduel.ev - ((1 - fdFair) * (1 + 100 / 140) - 1)) < 1e-4 && Math.abs(c.sides.away.draftkings.ev - ((1 - fdFair) * 1.8 - 1)) < 1e-4, 'DraftKings BOS, and both MIL prices');
    assert(c.flags.length === 1 && c.flags[0].team === 'BOS' && c.flags[0].book === 'fanduel' && c.sides.away.best.book === 'draftkings', 'one flag (BOS at FanDuel); the better MIL price is DraftKings, unflagged (negative EV)');
    const big = JSON.parse(JSON.stringify(row)); big.markets.h2h.outcomes[0].price = 150; big.markets.h2h.outcomes[1].price = -170;   // a real line (vig 3%), +19% EV
    assert(ctx.shopPrices(big).flags.length === 0 && ctx.shopPrices(big).sides.home.fanduel.ev > 0.10, 'an edge over +10% is not flagged (stale-line guard)');
    const thin = { ...row, books: { draftkings: row.books.draftkings, pinnacle: row.books.pinnacle } };
    assert(ctx.shopPrices(thin) === null, 'fewer than 4 usable books: no check');
    // Grading from the game ledger: BOS won, closed +110/−130 at DraftKings.
    const rows = [{ id: '71', result: { homeScore: 110, awayScore: 100 }, close: { mlHome: 110, mlAway: -130, book: 'DraftKings' } }];
    const legs = ctx.shopLegs({ games: { 71: row } }, rows);
    assert(legs.length === 1 && legs[0].hit === true && Math.abs(legs[0].pClose - nvh(110, -130)) < 1e-4 && Math.abs(legs[0].move - (nvh(110, -130) - legs[0].p)) < 1e-4, 'graded: hit, and the line moved by the close no-vig minus the consensus at pull');
    const sm = ctx.seasonShopSummary({ games: { 71: row } }, rows);
    assert(sm.flags === 1 && sm.graded === 1 && sm.won === 1 && Math.abs(sm.expected - 0.4765) < 0.005 && Math.abs(sm.roi - 1.2) < 1e-9 && sm.read === '1 of 150 graded flags', 'summary: 1 flag won at +120 (return +1.2 units), read waits for 150');
    const fdEv = [fdFair * 2.2 - 1, (1 - fdFair) * (1 + 100 / 140) - 1], bestEv = [fdFair * 2.2 - 1, (1 - fdFair) * 1.8 - 1];
    assert(sm.saved.n === 2 && Math.abs(sm.saved.fanduel - (fdEv[0] + fdEv[1]) / 2) < 1e-4 && Math.abs(sm.saved.best - (bestEv[0] + bestEv[1]) / 2) < 1e-4, 'saving: the better of FanDuel and DraftKings against FanDuel alone, per side');
    assert(ctx.seasonShopSummary({ games: { 71: row } }, []).graded === 0 && ctx.seasonShopSummary({}, rows).flags === 0, 'ungraded and empty ledgers handled');
  }

  console.log('TEST 10: odds-2 and shop-1 edge cases');
  {
    const O = ctx.SEASON_ODDS2_SPEC, H = ctx.SEASON_SHOP_SPEC;
    assert(H.maxAgeMin === 30, 'stale threshold: 30 minutes');
    const base = { game: '81', home: 'LAC', away: 'NO', markets: { h2h: { at: '2026-11-16T23:30:00Z', lastUpdate: '2026-11-16T23:29:30Z', outcomes: [{ team: 'LAC', price: 120 }, { team: 'NO', price: -140 }] } },
      books: { draftkings: { at: '2026-11-16T23:30:00Z', lastUpdate: '2026-11-16T23:29:00Z', h2h: { home: 105, away: -125 } }, williamhill_us: { at: '2026-11-16T23:30:00Z', lastUpdate: '2026-11-16T23:28:00Z', h2h: { home: 100, away: -120 } },
        betmgm: { at: '2026-11-16T23:30:00Z', lastUpdate: '2026-11-16T23:25:00Z', h2h: { home: 100, away: -120 } }, pinnacle: { at: '2026-11-16T23:30:00Z', lastUpdate: '2026-11-16T22:45:00Z', h2h: { home: 160, away: -190 } } } };
    const c = ctx.shopPrices(base);
    assert(c.books === 4 && c.pinnacle === null, 'a line last updated 45 minutes before the pull (Pinnacle here) is not used');
    const fresh = JSON.parse(JSON.stringify(base)); fresh.books.pinnacle.lastUpdate = '2026-11-16T23:10:00Z';
    assert(ctx.shopPrices(fresh).books === 5 && ctx.shopPrices(fresh).pinnacle != null, 'the same line updated 20 minutes before is used');
    const noTimes = JSON.parse(JSON.stringify(base)); delete noTimes.books.pinnacle.lastUpdate;
    assert(ctx.shopPrices(noTimes).books === 5, 'a line without a time is used (the rule needs both times)');
    const noFd = JSON.parse(JSON.stringify(fresh)); delete noFd.markets.h2h;
    const c2 = ctx.shopPrices(noFd);
    assert(c2 && c2.sides.home.fanduel === null && c2.sides.home.draftkings && c2.sides.home.best.book === 'draftkings', 'FanDuel without a moneyline: DraftKings is still checked');
    // Team names as The Odds API spells them (LA Clippers) map to our teams.
    const led = { games: { 81: { game: '81', markets: {}, tries: {} } } };
    const ev = { bookmakers: [{ key: 'draftkings', last_update: 't', markets: [{ key: 'h2h', last_update: 't', outcomes: [{ name: 'LA Clippers', price: -130 }, { name: 'New Orleans Pelicans', price: 110 }] }] },
      { key: 'betmgm', markets: [{ key: 'totals', outcomes: [{ name: 'Over', price: -110, point: 220.5 }] }] }] };
    const st = ctx.oddsRecordBooks(led, { id: '81', home: 'LAC', away: 'NO' }, ev, O.lineBooks, 'T', 'fanduel');
    assert(st.join() === 'draftkings' && led.games['81'].books.draftkings.h2h.home === -130 && led.games['81'].books.draftkings.h2h.away === 110, '"LA Clippers" maps to LAC; a book with no moneyline or spread is not stored');
    assert(ctx.oddsRecordBooks({ games: {} }, { id: '99', home: 'LAC', away: 'NO' }, ev, O.lineBooks, 'T', 'fanduel').length === 0 && ctx.oddsRecordBooks(led, { id: '81', home: 'LAC', away: 'NO' }, null, O.lineBooks, 'T', 'fanduel').length === 0, 'no row or no event: nothing stored');
    // A failed multi-book line call: FanDuel's try counts, no books stored, the run carries on.
    const lp = path.join(dir, 'fail.json'), g1 = game('82', 'BOS', 'MIL', 40);
    const evs = [{ id: 'eX', home_team: 'Boston Celtics', away_team: 'Milwaukee Bucks', commence_time: g1.tip }];
    const fi = async (url) => {
      const u = new URL(url);
      if (/\/events$/.test(u.pathname)) return { ok: true, status: 200, headers: new Headers({ 'x-requests-last': '0', 'x-requests-remaining': '19000' }), json: async () => evs, text: async () => '' };
      if (!/\/events\//.test(u.pathname)) return { ok: false, status: 500, headers: new Headers({ 'x-requests-last': '0', 'x-requests-remaining': '19000' }), json: async () => ({}), text: async () => 'boom' };
      return { ok: true, status: 200, headers: new Headers({ 'x-requests-last': '0', 'x-requests-remaining': '19000' }), json: async () => ({ ...evs[0], bookmakers: [] }), text: async () => '' };
    };
    const lg = [];
    await pullOdds({ ctx, key: KEY, games: [g1], now: T0, ledgerPath: lp, lockPath, fetchImpl: fi, log: (x) => lg.push(x), sleep: async () => {}, buildModel: async () => new Map(), spec: O });
    const fl = JSON.parse(fs.readFileSync(lp, 'utf8')).games['82'];
    assert(fl.tries.h2h === 1 && !fl.markets.h2h && !fl.books && lg.some(x => /lines: lines: HTTP 500/.test(x)) && !fl.credits === false, 'failed line call: a try counted, no books, logged, and charged what it asked for');
    assert(!JSON.stringify(fl).includes(KEY) && !lg.join().includes(KEY), 'the key never appears');
  }

  console.log('TEST 11: shop-2 price tracker for our tickets, by hand');
  {
    const T = ctx.SEASON_SHOP2_SPEC;
    assert(T.version === 'shop-2' && T.firstNight === '2026-11-27' && T.skipStraight === -0.04 && T.skipPerLeg === -0.04 && T.pickLo === 0.01 && T.pickHi === 0.10 && T.minOthers === 3 && T.readAt === 150, 'spec constants');
    const imp = (a) => (a < 0 ? -a / (-a + 100) : 100 / (a + 100)), dec = (a) => (a > 0 ? 1 + a / 100 : 1 + 100 / -a);
    const pow = (a, b) => { const x = imp(a), y = imp(b); let lo = 1, hi = 3; for (let i = 0; i < 80; i++) { const k = (lo + hi) / 2; if (x ** k + y ** k > 1) lo = k; else hi = k; } return x ** ((lo + hi) / 2); };
    const mk = (id, home, away, fd, books) => ({ game: id, date: '2026-11-27', home, away, markets: { h2h: { outcomes: [{ team: home, price: fd[0] }, { team: away, price: fd[1] }] } },
      books: Object.fromEntries(Object.entries(books).map(([k, v]) => [k, { h2h: { home: v[0], away: v[1] } }])) });
    // Game 91: Pinnacle −150/+130 sets the fair price; FanDuel −160/+140, DraftKings −145/+120.
    const g91 = mk('91', 'BOS', 'MIL', [-160, 140], { draftkings: [-145, 120], pinnacle: [-150, 130], betmgm: [-155, 125], williamhill_us: [-150, 120], fanatics: [-152, 124] });
    const pin = pow(-150, 130);
    const f = ctx.shop2Fair(g91);
    assert(f.src === 'pinnacle' && Math.abs(f.p - pin) < 1e-9 && pin > imp(-150) / (imp(-150) + imp(130)), 'fair = Pinnacle power no-vig (above the proportional chance for the favourite)');
    const noPin = mk('92', 'BOS', 'MIL', [-160, 140], { draftkings: [-145, 120], betmgm: [-155, 125], williamhill_us: [-150, 120], fanatics: [-152, 124] });
    const med = [pow(-155, 125), pow(-150, 120), pow(-152, 124)].sort((a, b) => a - b)[1];
    assert(ctx.shop2Fair(noPin).src === 'median of 3' && Math.abs(ctx.shop2Fair(noPin).p - med) < 1e-9, 'no Pinnacle: median power no-vig of the 3 books other than FanDuel and DraftKings');
    const thin = mk('93', 'BOS', 'MIL', [-160, 140], { draftkings: [-145, 120], betmgm: [-155, 125], williamhill_us: [-150, 120] });
    assert(ctx.shop2Fair(thin) === null && ctx.shop2Check({ kind: 'straight', legs: [{ row: thin, side: 'home' }] }).verdict === 'unpriced', 'two other books and no Pinnacle: no fair price, the bet is unpriced');
    const h = ctx.shop2Side(g91, 'home'), a = ctx.shop2Side(g91, 'away');
    assert(h.best === -145 && h.book === 'draftkings' && a.best === 140 && a.book === 'fanduel', 'the better of FanDuel and DraftKings per side (BOS −145 at DK, MIL +140 at FD)');
    assert(Math.abs(h.ev - (pin * dec(-145) - 1)) < 1e-9 && Math.abs(a.ev - ((1 - pin) * 2.4 - 1)) < 1e-9, 'EV = fair × decimal − 1');
    const tie = mk('94', 'BOS', 'MIL', [-150, 130], { draftkings: [-150, 125], pinnacle: [-150, 130] });
    assert(ctx.shop2Side(tie, 'home').book === 'fanduel', 'a tie goes to FanDuel');
    const sh = ctx.shop2Check({ kind: 'straight', legs: [{ row: g91, side: 'home' }] });
    assert(sh.verdict === 'play' && sh.book === 'draftkings' && sh.price === -145 && Math.abs(sh.evRaw - h.ev) < 1e-9, 'straight: played at DraftKings −145');
    // A straight at −4% or worse is skipped: FanDuel and DraftKings both −200 against a fair 63%.
    const bad = mk('95', 'NY', 'TOR', [-200, 165], { draftkings: [-200, 160], pinnacle: [-170, 150] });
    const bc = ctx.shop2Check({ kind: 'straight', legs: [{ row: bad, side: 'home' }] });
    assert(bc.verdict === 'skip' && Math.abs(bc.evRaw - (pow(-170, 150) * 1.5 - 1)) < 1e-9 && bc.evRaw < -0.04, 'straight under −4% EV is skipped');
    // Parlay of 91 home + 95 away: FanDuel 1.625 × 2.65 vs DraftKings 1.690 × 2.60; the larger product wins.
    const pc = ctx.shop2Check({ kind: 'parlay', legs: [{ row: g91, side: 'home' }, { row: bad, side: 'away' }] });
    const dFd = dec(-160) * dec(165), dDk = dec(-145) * dec(160), fairP = pin * (1 - pow(-170, 150));
    assert(pc.book === (dDk > dFd ? 'draftkings' : 'fanduel') && Math.abs(pc.evRaw - (fairP * Math.max(dFd, dDk) - 1)) < 1e-9 && pc.verdict === (pc.evRaw < -0.08 ? 'skip' : 'play'), 'parlay: one book for every leg, EV on the product, skip below −4% a leg');
    // A night: one ledger row (flat-1 favourite BOS −150 recorded), its odds row priced; MIL +140 at FanDuel is a pick if EV is +1% to +10%.
    const rows = [{ id: '91', date: '2026-11-27', home: 'BOS', away: 'MIL', mlHome: -150, mlAway: 130, result: { homeScore: 110, awayScore: 100 } }];
    const night = ctx.shop2Night('2026-11-27', rows, [], [], { games: { 91: g91 } });
    const fb = night.bets.find(b => b.tracker === 'flat-1 favourites');
    assert(fb && fb.price0 === -150 && fb.price === -145 && fb.book === 'draftkings' && fb.hit === true, 'flat-1 favourite checked: recorded −150, tracker −145 at DraftKings, graded a win');
    const evMil = (1 - pin) * 2.4 - 1;
    assert(night.picks.length === (evMil >= 0.01 && evMil <= 0.10 ? 1 : 0), 'the tracker picks a side only at +1% to +10% EV');
    const sum = ctx.seasonShop2Summary(rows, [], [], { games: { 91: g91 } });
    assert(sum.checked === 1 && Math.abs(sum.recorded.units - (dec(-150) - 1)) < 0.01 && Math.abs(sum.tracker.units - (dec(-145) - 1)) < 0.01 && sum.tracker.units > sum.recorded.units, 'summary: the same win pays more at the tracker\'s price');
    const before = ctx.seasonShop2Summary(rows.map(r => ({ ...r, date: '2026-11-26' })), [], [], { games: { 91: g91 } });
    assert(before.bets === 0, 'nights before firstNight are not counted live');
    const lines = ctx.shop2Lines('2026-11-27', rows, [], [], { games: { 91: g91 } });
    assert(lines.some(x => /shop-2 flat-1 favourites: BOS recorded -150 · DraftKings -145 · EV [+-]\d+\.\d% · PLAY/.test(x)), 'the --odds block names the book, price, EV and verdict');
  }

  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
