// ============================================================
// odds-pull.js — the IO behind `node fetch-slate.js --odds` (spec odds-1)
// ============================================================
// One run prices the games tipping within the hour that still miss a market
// (js/season/odds.js decides which, and never re-requests a stored market):
//   1. the events list (free) maps our games to The Odds API's
//   2. one slate-wide call for the missing line markets (h2h, spreads)
//   3. one call per game for its missing prop markets
// The ledger (.odds/odds-ledger.json, local only, never committed) is written
// after every charged reply, before the next call, so a crash cannot lead to
// paying for the same market twice. A lock file stops two runs at once, and
// no call is made that could take the credits below the spec's floor.
// ============================================================
const fs = require('fs');
const path = require('path');

const API = process.env.ODDS_API_BASE || 'https://api.the-odds-api.com/v4';   // override: tests' mock server only

function loadOddsLedger(file, spec) {
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  return { spec: spec.version, book: spec.book, games: {}, calls: [] };
}

function saveOddsLedger(file, ledger) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(ledger, null, 1));
  fs.renameSync(tmp, file);
}

// → release(). Refuses while another live process holds the lock; a stale lock is taken over.
function acquireLock(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  try { fs.writeFileSync(file, String(process.pid), { flag: 'wx' }); }
  catch (e) {
    if (e.code !== 'EEXIST') throw e;
    const pid = +fs.readFileSync(file, 'utf8');
    let alive = false;
    try { process.kill(pid, 0); alive = pid !== process.pid; } catch (_) { alive = false; }
    if (alive) throw new Error(`another --odds run (pid ${pid}) holds ${file}`);
    fs.writeFileSync(file, String(process.pid));
  }
  return () => { try { if (fs.readFileSync(file, 'utf8') === String(process.pid)) fs.unlinkSync(file); } catch (_) { /* gone */ } };
}

const etTime = (t) => new Date(t).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }) + ' ET';

// o: { ctx, key, games: [{id, date, tip, home, away}] (tonight, pre-tip), now, ledgerPath, lockPath,
//      buildModel: async (games) → Map(id → {pHome, report, source, engine, props}), fetchImpl, log, dry, sleep }
// → { due, calls, cost, stored } (calls: charged-or-not API calls made, events list included).
async function pullOdds(o) {
  const { ctx } = o, S = ctx.SEASON_ODDS_SPEC, log = o.log || console.log;
  const now = o.now != null ? o.now : Date.now();
  const fetchImpl = o.fetchImpl || fetch, sleep = o.sleep || ((ms) => new Promise(r => setTimeout(r, ms)));
  const ledger = loadOddsLedger(o.ledgerPath, S);
  const due = ctx.oddsDueGames(o.games, ledger, now, S);
  const plan = ctx.oddsRunPlan(o.games, ledger, now, S);
  const out = { due: due.length, calls: 0, cost: 0, stored: 0 };
  const lastRemaining = () => { for (let i = ledger.calls.length - 1; i >= 0; i--) if (ledger.calls[i].remaining != null) return ledger.calls[i].remaining; return null; };
  if (!due.length) {
    log(`Odds (${S.version}, ${S.book}): nothing due — a game is priced once its tip is within ${S.windowMin} minutes.`);
    for (const r of plan) log(`  run between ${etTime(r.from)} and ${etTime(r.to)}: ${r.games.map(g => `${g.away} @ ${g.home} (${etTime(g.tip)})`).join(', ')}`);
    if (lastRemaining() != null) log(`  credits left at the last call: ${lastRemaining()}`);
    return out;
  }
  log(`Odds (${S.version}, ${S.book}): ${due.length} game${due.length === 1 ? '' : 's'} due, at most ${ctx.oddsEstimate(due)} credits`);
  for (const d of due) log(`  ${d.game.away} @ ${d.game.home} (${etTime(d.game.tip)}): ${[...d.lines, ...d.props].join(', ')}`);
  const later = plan.filter(r => r.games.some(g => !due.some(d => String(d.game.id) === String(g.id))));
  for (const r of later) log(`  later, run between ${etTime(r.from)} and ${etTime(r.to)}: ${r.games.filter(g => !due.some(d => String(d.game.id) === String(g.id))).map(g => `${g.away} @ ${g.home}`).join(', ')}`);
  if (o.dry) { log('  (dry) no API calls made'); return out; }
  if (!o.key) throw new Error('ODDS_API_KEY is not set (export it in your shell; never commit it)');

  const release = acquireLock(o.lockPath);
  try {
    const call = async (kind, rel, extra) => {
      const url = `${API}${rel}${rel.includes('?') ? '&' : '?'}apiKey=${encodeURIComponent(o.key)}`;
      for (let attempt = 0; ; attempt++) {
        const res = await fetchImpl(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
        out.calls++;
        if (res.status === 429 && attempt === 0) { await sleep(2000); continue; }
        const usage = ctx.oddsUsage(res.headers);
        const entry = { at: new Date().toISOString(), kind, ...extra, status: res.status, ...usage };
        ledger.calls.push(entry);
        if (usage.cost) out.cost += usage.cost;
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          saveOddsLedger(o.ledgerPath, ledger);
          throw new Error(`${kind}: HTTP ${res.status} ${ctx.oddsRedact(body).slice(0, 200)}`);
        }
        return { json: await res.json(), usage, entry };
      }
    };
    const room = (need) => { const left = lastRemaining(); return left == null || left - need >= S.minRemaining; };

    const ev = await call('events', `/sports/${S.sport}/events`, {});
    saveOddsLedger(o.ledgerPath, ledger);
    const events = ctx.oddsMatchEvents(due.map(d => d.game), ev.json);
    for (const d of due) if (!events.has(String(d.game.id))) log(`  ${d.game.away} @ ${d.game.home}: not in The Odds API's events — skipped`);
    const ready = due.filter(d => events.has(String(d.game.id)));
    if (!ready.length) return out;
    if (!room(ctx.oddsEstimate(ready))) { log(`  stopped: ${lastRemaining()} credits left, this run could take up to ${ctx.oddsEstimate(ready)} (floor ${S.minRemaining})`); return out; }

    let models = new Map();
    try { models = (await o.buildModel(ready.map(d => d.game))) || new Map(); }
    catch (e) { log(`  model unavailable (${ctx.oddsRedact(e.message)}): prices stored without it`); }
    const at = new Date().toISOString();

    // Lines: one slate-wide call for the union of missing line markets.
    const lineKeys = [...new Set(ready.flatMap(d => d.lines))];
    if (lineKeys.length) {
      const ids = ready.filter(d => d.lines.length).map(d => events.get(String(d.game.id)).id);
      let r = null;
      try { r = await call('lines', `/sports/${S.sport}/odds?bookmakers=${S.book}&markets=${lineKeys.join(',')}&oddsFormat=american&eventIds=${ids.join(',')}`, { markets: lineKeys, events: ids }); }
      catch (err) { log(`  lines: ${err.message}`); }
      const byEvent = new Map(((r && r.json) || []).map(e => [e.id, e]));
      for (const d of ready.filter(x => x.lines.length)) {
        const e = events.get(String(d.game.id));
        // A failed call still counts a try, so a bad market cannot loop.
        const stored = ctx.oddsRecord(ledger, d.game, e, d.lines, r ? ctx.oddsBookMarkets(byEvent.get(e.id), S.book) : {}, at, models.get(String(d.game.id)));
        out.stored += stored.length;
        if (r) r.entry.stored = (r.entry.stored || []).concat(stored.map(k => `${d.game.id}:${k}`));
      }
      saveOddsLedger(o.ledgerPath, ledger);
    }

    // Props: one call per game, only its missing markets.
    for (const d of ready.filter(x => x.props.length)) {
      const e = events.get(String(d.game.id));
      if (!room(d.props.length)) { log(`  stopped before ${d.game.away} @ ${d.game.home} props: ${lastRemaining()} credits left (floor ${S.minRemaining})`); break; }
      let r;
      try { r = await call('props', `/sports/${S.sport}/events/${e.id}/odds?bookmakers=${S.book}&markets=${d.props.join(',')}&oddsFormat=american`, { game: String(d.game.id), markets: d.props }); }
      catch (err) {
        ctx.oddsRecord(ledger, d.game, e, d.props, {}, at, null);   // counts a try, so a bad market cannot loop
        saveOddsLedger(o.ledgerPath, ledger);
        log(`  ${d.game.away} @ ${d.game.home} props: ${err.message}`);
        continue;
      }
      const stored = ctx.oddsRecord(ledger, d.game, e, d.props, ctx.oddsBookMarkets(r.json, S.book), at, models.get(String(d.game.id)));
      r.entry.stored = stored;
      out.stored += stored.length;
      saveOddsLedger(o.ledgerPath, ledger);
    }

    for (const d of ready) {
      const row = ledger.games[String(d.game.id)];
      if (!row) continue;
      const l = ctx.oddsGameLines(row), m = models.get(String(d.game.id));
      const props = S.props.filter(k => row.markets[k]).map(k => `${ctx.SEASON_ODDS_STAT[k]}${k.endsWith('_alternate') ? '-alt' : ''} ${row.markets[k].outcomes.length}`);
      const missing = [...S.lines, ...S.props].filter(k => !row.markets[k]);
      const sgn = (x) => x == null ? '—' : (x > 0 ? '+' : '') + x;
      log(`  ${row.away} @ ${row.home}: ML ${row.away} ${sgn(l.mlAway)} / ${row.home} ${sgn(l.mlHome)} · spread ${row.home} ${sgn(l.spreadHome)} (${sgn(l.spreadPriceHome)})` +
        ` · props ${props.join(', ') || 'none'}${missing.length ? ` · missing ${missing.join(', ')}` : ''}` +
        ` · model ${m ? `${row.home} ${(m.pHome * 100).toFixed(1)}%${m.report ? ` (${m.report.slice(14, -4)})` : ''}` : '—'}`);
    }
    log(`  ${out.cost} credits this run · ${lastRemaining() == null ? '?' : lastRemaining()} left`);
    return out;
  } finally { release(); }
}

module.exports = { pullOdds, loadOddsLedger, saveOddsLedger, acquireLock };
