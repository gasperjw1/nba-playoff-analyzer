#!/usr/bin/env node
// ============================================================
// fetch-slate.js — pull the NB.AI feed, snapshot it, record, settle
// ============================================================
// The NB.AI site sends no CORS headers, so the browser cannot read
// it from GitHub Pages. This script runs locally (Node 18+, uses
// global fetch) and commits what the page needs:
//
//   node fetch-slate.js            download feed → js/season/data/slate-snapshot.js
//   node fetch-slate.js --record   also append tonight's predictions to the ledger, every
//                                  rotation player's prop projection to the props ledger, and
//                                  tonight's pitched tickets (js/season/pitch.js, PITCH_SPEC.md;
//                                  js/season/pitch2.js, PITCH2_SPEC.md), and prints tonight's
//                                  flat-$25 rule bets (js/season/flat.js, FLAT_SPEC.md)
//                                  (refused when the feed is not today's slate; --force overrides)
//   node fetch-slate.js --settle   fill results for unsettled ledger rows via ESPN (and box
//                                  scores for the props ledger)
//   node fetch-slate.js --dry      print the normalized slate, write nothing
//   node fetch-slate.js --espn     build tonight's slate from ESPN instead (fallback
//                                  when NB.AI has not refreshed; combines with
//                                  --record / --dry). No NB.AI probabilities; rows
//                                  are marked source "espn" and a later pre-tip
//                                  --record replaces them.
//   node fetch-slate.js --injuries also lay the latest official NBA injury report over
//                                  the feed's player statuses (js/season/injury-report.js)
//                                  — for refreshing the snapshot when NB.AI lags late news.
//                                  Combines with the others; recorded rows never change.
//   node fetch-slate.js --odds     FanDuel lines and props from The Odds API for the games
//                                  tipping within the hour, once per game and market (spec
//                                  odds-1, js/season/odds.js, odds-pull.js), with the model's
//                                  chance at the same moment (latest official injury report).
//                                  Needs ODDS_API_KEY; writes .odds/odds-ledger.json (local,
//                                  never committed). --odds --dry lists what is due, no calls;
//                                  --odds --espn models on the ESPN slate. --record also pulls
//                                  FanDuel's alternate PRA ladder for every game still to tip
//                                  (1 credit a game, once; --no-odds skips it).
//
// Daily routine: `./season-daily.sh` picks the phase by time of day and
// runs each at most once per day (the SessionStart hook calls it too).
// Commit both data files afterwards.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const NBAI_BASE = process.env.NBAI_BASE || 'https://nb-ai.josh2899.chatgpt.site';
const ESPN_SCOREBOARD = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=';
const ESPN_SUMMARY = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=';
const ESPN_INJURIES = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/injuries';
const ESPN_TEAMS = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';
const ESPN_CACHE = path.join(__dirname, '.cache/espn-nba');   // shared with backtest-season.js
const SEASON_START = '2026-10-20';
const SNAPSHOT_PATH = path.join(__dirname, 'js/season/data/slate-snapshot.js');
const LEDGER_PATH = path.join(__dirname, 'js/season/data/season-ledger.js');
const PROPS_LEDGER_PATH = path.join(__dirname, 'js/season/data/props-ledger.js');
const PITCH_LEDGER_PATH = path.join(__dirname, 'js/season/data/pitch-ledger.js');
const PITCH2_LEDGER_PATH = path.join(__dirname, 'js/season/data/pitch2-ledger.js');
const USER_LEGS_PATH = path.join(__dirname, 'js/season/data/user-legs.js');
const TEAM_PRIORS_PATH = path.join(__dirname, 'js/season/data/team-priors.js');
const ODDS_LEDGER_PATH = process.env.ODDS_LEDGER || path.join(__dirname, '.odds/odds-ledger.json');
const ODDS_LOCK_PATH = path.join(path.dirname(ODDS_LEDGER_PATH), 'odds.lock');

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry');

function loadSeasonContext() {
  const toVar = (code) => code.replace(/^(const|let) /gm, 'var ');
  const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error });
  const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), ctx);
  load('js/season/data/season-constants.js');
  load('js/season/data/player-priors.js');
  load('js/season/data/chemistry-fit.js');
  load('js/season/data/aging-fit.js');
  load('js/season/data/team-ratings.js');
  load('js/season/adapters.js');
  load('js/season/engine.js');
  load('js/season/props.js');
  load('js/season/ensemble.js');
  load('js/season/trust.js');
  load('js/season/ledger.js');
  load('js/season/replay-core.js');
  load('js/season/injury-report.js');
  load('js/season/props-ledger.js');
  load('js/season/parlay.js');
  load('js/season/pitch.js');
  load('js/season/pitch2.js');
  load('js/season/flat.js');
  load('js/season/fade.js');
  load('js/season/odds.js');
  if (fs.existsSync(LEDGER_PATH)) load('js/season/data/season-ledger.js');
  if (fs.existsSync(PROPS_LEDGER_PATH)) load('js/season/data/props-ledger.js');
  if (fs.existsSync(PITCH_LEDGER_PATH)) load('js/season/data/pitch-ledger.js');
  if (fs.existsSync(PITCH2_LEDGER_PATH)) load('js/season/data/pitch2-ledger.js');
  if (fs.existsSync(USER_LEGS_PATH)) load('js/season/data/user-legs.js');
  return ctx;
}

function todayEt() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

async function getJson(url) {
  const res = await fetch(url, { headers: { 'accept': 'application/json' }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

// One row per line: the props ledger grows by ~100 rows a night.
// One night per line.
function writePitchLedger(rows) {
  fs.writeFileSync(PITCH_LEDGER_PATH, '// ============================================================\n// PITCH LEDGER — pitched tickets (2026-27), js/season/pitch.js, spec in PITCH_SPEC.md\n// ============================================================\n// Written by `node fetch-slate.js --record` / `--settle`. Do not hand-edit:\n// a pitch is only evidence if recorded before its legs tip off.\n// ============================================================\n' +
    `const SEASON_PITCH_LEDGER = [\n${rows.map(r => JSON.stringify(r)).join(',\n')}\n];\n`);
}

function writePitch2Ledger(rows) {
  fs.writeFileSync(PITCH2_LEDGER_PATH, '// ============================================================\n// PITCH-2 LEDGER — the favourites ticket (2026-27), js/season/pitch2.js, spec in PITCH2_SPEC.md\n// ============================================================\n// Written by `node fetch-slate.js --record` / `--settle`. Do not hand-edit:\n// a pitch is only evidence if recorded before its legs tip off.\n// ============================================================\n' +
    `const SEASON_PITCH2_LEDGER = [\n${rows.map(r => JSON.stringify(r)).join(',\n')}\n];\n`);
}

function writePropsLedger(rows) {
  fs.writeFileSync(PROPS_LEDGER_PATH, '// ============================================================\n// PROPS LEDGER — pre-tip player projections (2026-27), js/season/props-ledger.js\n// ============================================================\n// Written by `node fetch-slate.js --record` / `--settle`. Do not hand-edit:\n// a projection is only evidence if recorded before tip-off.\n// ============================================================\n' +
    `const SEASON_PROPS_LEDGER = [\n${rows.map(r => JSON.stringify(r)).join(',\n')}\n];\n`);
}

function writeJsGlobal(file, name, value, header) {
  const body = `${header}\nconst ${name} = ${JSON.stringify(value, null, 1)};\n`;
  fs.writeFileSync(file, body);
}

async function main() {
  const ctx = loadSeasonContext();

  if (args.has('--settle')) {
    await settle(ctx);
    return;
  }
  if (args.has('--odds')) {
    await oddsRun(ctx);
    return;
  }

  let slate = args.has('--espn') ? await espnSlate(ctx) : await nbaiSlate(ctx);
  if (args.has('--injuries')) {
    const report = await require('./late-flip.js').reportBefore(Date.now(), Date.now());
    const applied = ctx.seasonApplyInjuryReport(slate, report);
    slate = applied.slate;
    console.log(`Official injury report ${report.name}: ${applied.changes.length} status changes over the feed`);
    for (const c of applied.changes) console.log(`  injury ${c.team} ${c.name}: ${c.from} → ${c.to}`);
    for (const e of applied.unmatched.filter(e => !/G League/.test(e.reason || ''))) console.log(`  injury unmatched: ${e.team} ${e.player} (${e.status})`);
  }
  slate.results = await seasonResults(slate.date);   // for the opponent-adjusted line
  const teamCount = Object.keys(slate.teams).length;
  console.log(`Slate ${slate.date}: ${slate.games.length} games, ${teamCount} teams, ${slate.source === 'espn' ? 'ESPN fallback (no NB.AI)' : 'feed v' + slate.modelVersion}, fetched ${slate.fetchedAt}`);
  console.log(`League avg: ORtg ${slate.league.ortg.toFixed(1)} pace ${slate.league.pace.toFixed(1)} (${slate.league.derived ? 'derived from feed' : 'fallback — feed covers ' + teamCount + ' teams'})`);

  const rows = slate.games.map(g => {
    const proj = ctx.projectSeasonGame(g, slate);
    const m = g.market || {};
    const blend = ctx.blendGameForecast({ pOurs: proj.pHome, pFriend: g.external && g.external.nbai ? g.external.nbai.pHome : null, mlHome: m.mlHome, mlAway: m.mlAway, spreadHome: m.spreadHome });
    return { g, proj, blend };
  });
  const cleanView = ctx.seasonCleanSlate(slate), adjView = ctx.seasonOppAdjSlate(slate);
  rows.forEach(({ g, proj, blend }) => {
    const fr = blend.members.find(x => x.name === 'friend');
    if (cleanView) console.log(`  ${g.away} @ ${g.home}  picks (2025-26 ratings) ${pct(ctx.projectSeasonGame(g, cleanView).pHome)}` +
      (adjView ? `  opponent-adjusted ${pct(ctx.projectSeasonGame(g, adjView).pHome)}` : ''));
    console.log(`  ${g.away} @ ${g.home}  ours ${pct(proj.pHome)} (${fmtMargin(g.home, proj.margin)}, total ${proj.total})` +
      `  nb.ai ${fr ? pct(fr.p) : '—'}  market ${blend.pMarket != null ? pct(blend.pMarket) : '—'}  blend ${blend.pBlend != null ? pct(blend.pBlend) : '—'}` +
      (blend.flagged ? `  ⚑ edge ${(blend.edge * 100).toFixed(1)}pp` : ''));
  });

  if (DRY) { console.log(JSON.stringify(slate, null, 1).slice(0, 4000)); return; }

  // A stale feed must not replace a newer snapshot (e.g. today's ESPN fallback).
  const current = loadGlobal(SNAPSHOT_PATH, 'SEASON_SLATE_SNAPSHOT');
  if (current && current.date && slate.date && current.date > slate.date) {
    console.log(`Kept ${path.relative(__dirname, SNAPSHOT_PATH)}: it holds ${current.date} (${current.source || 'nb.ai'}), newer than this ${slate.date} feed`);
  } else {
    writeJsGlobal(SNAPSHOT_PATH, 'SEASON_SLATE_SNAPSHOT', slate, slate.source === 'espn'
      ? `// Generated by fetch-slate.js --espn — ESPN scoreboard, box scores, pickcenter and injuries\n// normalized through js/season/adapters.js; team priors from js/season/data/team-priors.js. Do not hand-edit.`
      : `// Generated by fetch-slate.js — NB.AI feed normalized through js/season/adapters.js.\n// Source: ${NBAI_BASE}/saved.json (+ /api/rankings). Do not hand-edit; re-run the script.`);
    console.log(`Wrote ${path.relative(__dirname, SNAPSHOT_PATH)} (${(fs.statSync(SNAPSHOT_PATH).size / 1024).toFixed(0)} KB)`);
  }

  if (args.has('--record') && slate.date !== todayEt() && !args.has('--force')) {
    // A stale feed would record yesterday's games (all tipped) or, worse,
    // today's games against yesterday's lineups. Wait for the refresh.
    console.log(`record skipped: feed slate is ${slate.date}, today (ET) is ${todayEt()} — NB.AI has not refreshed yet (use --force to override)`);
  } else if (args.has('--record')) {
    const existing = Array.isArray(ctx.SEASON_LEDGER) ? ctx.SEASON_LEDGER : [];
    const cleanSlate = ctx.seasonCleanSlate(slate), adjSlate = ctx.seasonOppAdjSlate(slate);
    // Late-injury-flip rule (trust.js SEASON_LATE_FLIP): the replay pipeline's evening-before and
    // latest-report picks. Never blocks recording — a row without them just isn't judged.
    const flips = new Map();
    try {
      for (const x of await require('./late-flip.js').lateFlipChecks(slate.date)) flips.set(`${x.home}|${x.away}`, x);
      for (const x of flips.values()) console.log(`  late-flip ${x.away} @ ${x.home}: evening before ${pct(x.pEve)}, latest ${pct(x.pNow)}${x.flip ? ` — FLIP, rule takes ${x.side === 'home' ? x.home : x.away}` : ''}`);
    } catch (e) { console.warn(`late-flip check unavailable (${e.message}); rows recorded without it`); }
    const { added, replaced, late } = ctx.mergeLedgerEntries(existing, rows.map(({ g, proj, blend }) => ctx.buildLedgerEntry(g, proj, blend, slate,
      cleanSlate && ctx.projectSeasonGame(g, cleanSlate), adjSlate && ctx.projectSeasonGame(g, adjSlate), flips.get(`${g.home}|${g.away}`))), new Date());
    writeJsGlobal(LEDGER_PATH, 'SEASON_LEDGER', existing,
      '// ============================================================\n// SEASON LEDGER — committed prediction rows (2026-27)\n// ============================================================\n// Written by `node fetch-slate.js --record` / `--settle`. Do not hand-edit\n// probabilities: a row is only evidence if recorded before tip-off.\n// ============================================================');
    console.log(`Ledger: +${added} recorded, ${replaced} replaced (ESPN fallback rows), ${late} skipped (already tipped), ${existing.length} total rows`);
    // Props on the picks engine's slate (last season's ratings), like the picks.
    const propRows = Array.isArray(ctx.SEASON_PROPS_LEDGER) ? ctx.SEASON_PROPS_LEDGER : [];
    const recordedAt = new Date().toISOString(), propSlate = cleanSlate || slate;
    const pm = ctx.mergePropRows(propRows, slate.games.flatMap(g => ctx.buildPropRows(g, propSlate, { engine: ctx.SEASON_ENGINE_VERSION, recordedAt })), new Date());
    writePropsLedger(propRows);
    console.log(`Props ledger: +${pm.added} recorded, ${pm.replaced} replaced (ESPN fallback games), ${pm.late} skipped (already tipped), ${propRows.length} total rows`);
    // Pitched tickets (pitch-1): on the live slate's projections, before any of their legs tip.
    const pitchRows = Array.isArray(ctx.SEASON_PITCH_LEDGER) ? ctx.SEASON_PITCH_LEDGER : [];
    const pitch = ctx.buildPitches(slate, { engine: ctx.SEASON_ENGINE_VERSION, props: ctx.SEASON_PROP.version, recordedAt, now: Date.now() });
    const pres = ctx.mergePitch(pitchRows, pitch, Date.now());
    writePitchLedger(pitchRows);
    for (const t of pitch.tickets) console.log(`Pitch ${t.recipe}: ${t.status === 'pitched' ? `${t.legs.map(l => l.type === 'ml' ? `${l.team} ML ${l.odds > 0 ? '+' : ''}${l.odds}` : `${l.name} ${l.stat} o${l.line}`).join(' · ')} — ${pct(t.p)} (fair ${t.fairAmerican > 0 ? '+' : ''}${t.fairAmerican})` : t.status + ' — ' + t.reason}`);
    console.log(`Pitch ledger: ${pres} (${pitch.date}), ${pitchRows.length} nights`);
    // pitch-2, the favourites ticket: replaceable until its first leg tips, so a later run re-prices it nearer tip.
    // Priced at record time from ESPN's pickcenter (DraftKings): an NB.AI slate's odds are as old as its refresh.
    const p2Rows = Array.isArray(ctx.SEASON_PITCH2_LEDGER) ? ctx.SEASON_PITCH2_LEDGER : [];
    const live = new Map();
    for (const g of slate.games.filter(x => !x.tip || new Date(x.tip).getTime() > Date.now())) {
      try { const pc = ctx.adaptEspnPickcenter(await getJson(ESPN_SUMMARY + g.id), g.home, g.away); if (pc && pc.mlHome != null && pc.mlAway != null) live.set(String(g.id), pc); }
      catch (e) { console.warn(`pitch-2 price ${g.away} @ ${g.home}: ${e.message} (slate price used)`); }
    }
    const p2Slate = { ...slate, games: slate.games.map(g => live.has(String(g.id)) ? { ...g, market: live.get(String(g.id)), priceSource: 'espn' } : { ...g, priceSource: 'slate' }) };
    const p2 = ctx.buildPitch2(p2Slate, { engine: ctx.SEASON_ENGINE_VERSION, recordedAt, now: Date.now() });
    const p2res = ctx.mergePitch2(p2Rows, p2, Date.now());
    writePitch2Ledger(p2Rows);
    const ft = p2.ticket;
    console.log(`Pitch favourites: ${ft.status === 'pitched' ? `${ft.label.toUpperCase()} ${ft.legs.map(l => `${l.team} ${l.odds > 0 ? '+' : ''}${l.odds} (${pct(l.p)})${l.flagBook ? ' [' + (l.book || 'no book') + ']' : ''}`).join(' · ')} — ${pct(ft.p)}, price ${ft.price > 0 ? '+' : ''}${ft.price}` : 'no ticket — ' + ft.reason}${ft.gamesTipped ? ` · ${ft.gamesTipped} game${ft.gamesTipped === 1 ? '' : 's'} already tipped` : ''}`);
    console.log(`Pitch ledger pitch-2: ${p2res} (${p2.date}), ${p2Rows.length} nights`);
    // flat-1 tracks every favourite from −299 to −100 at the price the ledger just recorded (the slate's).
    const flat = ctx.flatTonight(slate);
    console.log(`Pitch flat $${ctx.SEASON_FLAT_SPEC.stake} (favourites −299 to −100, slate price): ${flat.length ? flat.map(b => `${b.team} ${b.odds > 0 ? '+' : ''}${b.odds}`).join(' · ') : 'none'}`);
    // fade-1: 50–70% favourites NB.AI doubts by 8+ points, from the rows just recorded (NB.AI nights only).
    const fade = ctx.fadeTonight(existing, slate.date);
    console.log(`Pitch fade NB.AI (50–70% favourites NB.AI doubts by 8+): ${slate.source === 'espn' ? 'none — no NB.AI on an ESPN slate' : fade.length ? fade.map(b => `${b.team} ${b.odds > 0 ? '+' : ''}${b.odds} (market ${pct(b.pFav)}, NB.AI ${pct(b.pNbai)})`).join(' · ') : 'none'}`);
    // FanDuel's alternate PRA ladder for every game still to tip (odds-1 ladder pull, ODDS_SPEC.md): once per
    // game, 1 credit each, with the model as just recorded. Never blocks the record.
    if (!process.env.ODDS_API_KEY) console.log('Odds ladders: skipped (ODDS_API_KEY not set)');
    else if (args.has('--no-odds')) console.log('Odds ladders: skipped (--no-odds)');
    else {
      const pre = slate.games.filter(g => g.tip && new Date(g.tip).getTime() > Date.now());
      const models = new Map(pre.map(g => [String(g.id), { pHome: +ctx.projectSeasonGame(g, slate).pHome.toFixed(4), report: slate.injuryReport ? slate.injuryReport.name : null,
        source: slate.source || 'nb.ai', engine: ctx.SEASON_ENGINE_VERSION, props: ctx.buildPropRows(g, propSlate, {}) }]));
      try {
        await require('./odds-pull.js').pullOdds({ ctx, spec: ctx.SEASON_ODDS_LADDER_SPEC, key: process.env.ODDS_API_KEY, ledgerPath: ODDS_LEDGER_PATH, lockPath: ODDS_LOCK_PATH,
          games: pre.map(g => ({ id: g.id, date: slate.date, tip: g.tip, home: g.home, away: g.away })), buildModel: async () => models });
      } catch (e) { console.warn(`Odds ladders: ${e.message}`); }
    }
  }
}

async function nbaiSlate(ctx) {
  console.log(`Fetching ${NBAI_BASE}/saved.json …`);
  const saved = await getJson(`${NBAI_BASE}/saved.json`);
  let rankings = null;
  try {
    rankings = await getJson(`${NBAI_BASE}/api/rankings`);
  } catch (e) {
    console.warn('rankings unavailable (friend probabilities will be missing):', e.message);
  }
  return ctx.adaptNbaiSlate(saved, rankings);
}

// Completed days and their box scores are cached (they never change);
// today's scoreboard, lines and injuries are always fetched fresh. A day is
// cached only once every game on it is final, so a run after midnight ET
// cannot freeze last night's late games as unfinished; an empty reply is
// never cached (a real off day costs one request per run).
const allCompleted = (sb) => (sb.events || []).length > 0 && sb.events.every(e => e.status && e.status.type && e.status.type.completed);
async function cachedJson(file, url, keep = () => true) {
  const f = path.join(ESPN_CACHE, file);
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  const j = await getJson(url);
  if (keep(j)) {
    fs.mkdirSync(ESPN_CACHE, { recursive: true });
    fs.writeFileSync(f, JSON.stringify(j));
  }
  return j;
}

function addDays(s, n) { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }

// This season's regular-season finals before `date` (ET), from the cached
// scoreboards espnSlate also reads.
async function seasonResults(date) {
  const out = [];
  for (let d = SEASON_START; d < date; d = addDays(d, 1)) {
    const sb = await cachedJson(`scoreboard-${d}.json`, ESPN_SCOREBOARD + d.replace(/-/g, ''), allCompleted);
    for (const e of sb.events || []) {
      if (!e.status || !e.status.type || !e.status.type.completed || (e.season && e.season.type !== 2)) continue;
      const c = e.competitions[0];
      const home = c.competitors.find(x => x.homeAway === 'home'), away = c.competitors.find(x => x.homeAway === 'away');
      out.push({ id: e.id, date: d, tip: e.date, home: home.team.abbreviation, away: away.team.abbreviation, homeScore: +home.score, awayScore: +away.score });
    }
  }
  return out;
}

async function espnSlate(ctx) {
  const today = todayEt();
  const priorTeams = loadGlobal(TEAM_PRIORS_PATH, 'SEASON_TEAM_PRIORS');
  if (!priorTeams || Object.keys(priorTeams).length !== 30) throw new Error(`--espn needs all 30 teams in ${path.relative(__dirname, TEAM_PRIORS_PATH)}`);
  console.log(`ESPN fallback: priors from ${path.relative(__dirname, TEAM_PRIORS_PATH)}; games ${SEASON_START} → ${addDays(today, -1)}`);
  const games = [];
  for (let d = SEASON_START; d < today; d = addDays(d, 1)) {
    const sb = await cachedJson(`scoreboard-${d}.json`, ESPN_SCOREBOARD + d.replace(/-/g, ''), allCompleted);
    for (const e of sb.events || []) {
      if (!e.status || !e.status.type || !e.status.type.completed) continue;
      if (e.season && e.season.type !== 2) continue;
      const c = e.competitions[0];
      const home = c.competitors.find(x => x.homeAway === 'home'), away = c.competitors.find(x => x.homeAway === 'away');
      const summary = await cachedJson(`summary-${e.id}.json`, ESPN_SUMMARY + e.id);
      games.push({ id: e.id, date: d, home: home.team.abbreviation, away: away.team.abbreviation,
        homeScore: +home.score, awayScore: +away.score, box: ctx.adaptEspnBox(summary) });
    }
  }
  const sb = await getJson(ESPN_SCOREBOARD + today.replace(/-/g, ''));
  const tonight = [];
  for (const e of sb.events || []) {
    if (e.season && e.season.type !== 2) continue;
    const c = e.competitions[0];
    const home = c.competitors.find(x => x.homeAway === 'home').team.abbreviation, away = c.competitors.find(x => x.homeAway === 'away').team.abbreviation;
    const summary = await getJson(ESPN_SUMMARY + e.id);
    tonight.push({ id: e.id, tip: e.date, venue: c.venue ? c.venue.fullName : null, home, away, market: ctx.adaptEspnPickcenter(summary, home, away) });
  }
  const injuries = ctx.adaptEspnInjuries(await getJson(ESPN_INJURIES), today);
  const rosters = {};
  const teamList = (await getJson(ESPN_TEAMS)).sports[0].leagues[0].teams.map(x => x.team);
  for (const t of teamList.filter(t => tonight.some(g => g.home === t.abbreviation || g.away === t.abbreviation))) {
    try { rosters[t.abbreviation] = ((await getJson(`${ESPN_TEAMS}/${t.id}/roster`)).athletes || []).map(a => ({ id: String(a.id), name: a.displayName })); }
    catch (e) { console.warn(`roster ${t.abbreviation} unavailable (falling back to box scores): ${e.message}`); }
  }
  console.log(`  ${games.length} completed games, ${tonight.length} tonight, ${Object.keys(injuries).length} injury-report entries, ${Object.keys(rosters).length} rosters`);
  const slate = ctx.adaptEspnSlate({ priorTeams, games, tonight, injuries, rosters, date: today, fetchedAt: new Date().toISOString() });
  // Counted in because the report does not list them, though they sat out
  // the team's last two games: worth a look before recording.
  for (const g of slate.games) for (const abbr of [g.away, g.home]) {
    const last2 = games.filter(x => x.home === abbr || x.away === abbr).sort((a, b) => (a.date < b.date ? -1 : 1)).slice(-2);
    if (last2.length < 2) continue;
    for (const p of slate.teams[abbr].players) {
      if (p.injury || p.avg.min < 15) continue;
      if (last2.every(x => !((x.box[abbr] || []).find(b => b.id === p.id && b.played)))) {
        console.log(`  check: ${p.name} (${abbr}, ${p.avg.min.toFixed(0)} min) missed ${abbr}'s last 2 games and is not on the injury report — counted in`);
      }
    }
    // The opposite case: on the roster with a real prior role, no game for
    // this team yet, not on the report — left out.
    const onSlate = new Set(slate.teams[abbr].players.map(p => p.id));
    for (const r of rosters[abbr] || []) {
      if (onSlate.has(r.id)) continue;
      const mpg = ctx.playerProfile({ id: r.id, avg: null, seasonGames: 0 }).mpg;
      if (mpg >= 15) console.log(`  check: ${r.name} (${abbr}, ${mpg.toFixed(0)} min last season) has no game for ${abbr} yet and is not on the injury report — left out`);
    }
  }
  return slate;
}

function loadGlobal(file, name) {
  if (!fs.existsSync(file)) return null;
  const c = vm.createContext({});
  vm.runInContext(fs.readFileSync(file, 'utf8').replace(/^(const|let) /gm, 'var '), c);
  return c[name];
}

async function settle(ctx) {
  const rows = Array.isArray(ctx.SEASON_LEDGER) ? ctx.SEASON_LEDGER : [];
  const open = rows.filter(r => !r.result);
  const needsClose = (r) => r.result && !r.close && (r.closeTries || 0) < 3;
  const propRows = Array.isArray(ctx.SEASON_PROPS_LEDGER) ? ctx.SEASON_PROPS_LEDGER : [];
  const pitchRows = Array.isArray(ctx.SEASON_PITCH_LEDGER) ? ctx.SEASON_PITCH_LEDGER : [];
  const openPitch = pitchRows.some(r => r.tickets.some(t => t.status === 'pitched' && !t.result));
  const p2Rows = Array.isArray(ctx.SEASON_PITCH2_LEDGER) ? ctx.SEASON_PITCH2_LEDGER : [];
  const openPitch2 = p2Rows.some(r => r.ticket && r.ticket.status === 'pitched' && !r.ticket.result);
  if (!open.length && !rows.some(needsClose) && !propRows.some(r => !r.result) && !openPitch && !openPitch2) { console.log('Nothing to settle.'); return; }
  const postponed = new Set();
  const dates = [...new Set(open.map(r => (r.tip || r.date).slice(0, 10)))];
  let settled = 0;
  for (const d of dates) {
    // ESPN dates are US-local; a 00:30Z tip belongs to the previous US day, so query both.
    const ymd = d.replace(/-/g, '');
    const prev = new Date(d + 'T12:00:00Z'); prev.setUTCDate(prev.getUTCDate() - 1);
    const ymdPrev = prev.toISOString().slice(0, 10).replace(/-/g, '');
    const results = [];
    for (const q of [ymdPrev, ymd]) {
      try { results.push(...ctx.adaptEspnScoreboard(await getJson(ESPN_SCOREBOARD + q))); }
      catch (e) { console.warn(`ESPN ${q}: ${e.message}`); }
    }
    for (const x of results) if (x.postponed) postponed.add(x.id);
    open.filter(r => (r.tip || r.date).slice(0, 10) === d).forEach(r => {
      const hit = results.find(x => x.id === r.id && x.final);
      if (!hit) return;
      r.result = { homeScore: hit.homeScore, awayScore: hit.awayScore, settledAt: new Date().toISOString() };
      settled++;
      console.log(`  ${r.away} @ ${r.home}: ${hit.awayScore}-${hit.homeScore}  ours ${pct(r.pOurs)} nb.ai ${r.pFriend != null ? pct(r.pFriend) : '—'} market ${r.pMarket != null ? pct(r.pMarket) : '—'}`);
    });
  }
  // Closing lines for closing-line value: DraftKings' price at tip, read from the
  // game's summary once it is final (the same pickcenter the replay uses).
  let closes = 0;
  // Three tries per game; after that the row is left without a close (CLV skips it).
  for (const r of rows.filter(needsClose)) {
    r.closeTries = (r.closeTries || 0) + 1;
    try {
      const pc = ctx.adaptEspnPickcenter(await getJson(ESPN_SUMMARY + r.id), r.home, r.away);
      if (pc && pc.mlHome != null && pc.mlAway != null) {
        r.close = { mlHome: pc.mlHome, mlAway: pc.mlAway, spreadHome: pc.spreadHome, total: pc.total, book: pc.book, open: pc.open || null };
        delete r.closeTries;
        closes++;
      }
    } catch (e) { console.warn(`closing line ${r.away} @ ${r.home}: ${e.message}`); }
  }
  console.log(`Closing lines captured: ${closes}`);
  // Props: box scores of games the ledger has settled (final).
  let propsSettled = 0;
  const finals = new Set(rows.filter(r => r.result).map(r => r.id));
  for (const g of [...new Set(propRows.filter(r => !r.result).map(r => r.game))].filter(id => finals.has(id))) {
    try { propsSettled += ctx.settlePropRows(propRows, g, ctx.adaptEspnBox(await cachedJson(`summary-${g}.json`, ESPN_SUMMARY + g)), new Date().toISOString()); }
    catch (e) { console.warn(`box score ${g}: ${e.message}`); }
  }
  // Pitched tickets: final scores from the ledger, box scores for prop legs.
  let pitchSettled = 0;
  if (openPitch) {
    const results = new Map(rows.filter(r => r.result).map(r => [String(r.id), r.result]));
    const boxes = new Map();
    for (const g of new Set(pitchRows.flatMap(r => r.tickets.filter(t => t.status === 'pitched' && !t.result).flatMap(t => t.legs.filter(l => l.type === 'prop').map(l => l.game))))) {
      if (!results.has(g)) continue;
      try { boxes.set(g, ctx.adaptEspnBox(await cachedJson(`summary-${g}.json`, ESPN_SUMMARY + g))); } catch (e) { console.warn(`box score ${g}: ${e.message}`); }
    }
    pitchSettled = ctx.settlePitches(pitchRows, results, boxes, new Date().toISOString());
  }
  // pitch-2: final scores and closes from the ledger, box scores for the starter-out tag.
  let pitch2Settled = 0;
  if (openPitch2) {
    const results = new Map(rows.filter(r => r.result).map(r => [String(r.id), r.result]));
    const closes = new Map(rows.filter(r => r.close).map(r => [String(r.id), r.close]));
    const boxes = new Map();
    for (const g of new Set(p2Rows.filter(r => r.ticket && r.ticket.status === 'pitched' && !r.ticket.result).flatMap(r => r.ticket.legs.map(l => l.game)))) {
      if (!results.has(g)) continue;
      try { boxes.set(g, ctx.adaptEspnBox(await cachedJson(`summary-${g}.json`, ESPN_SUMMARY + g))); } catch (e) { console.warn(`box score ${g}: ${e.message} (starter-out left unknown)`); }
    }
    pitch2Settled = ctx.settlePitch2(p2Rows, results, postponed, closes, boxes, new Date().toISOString());
  }
  if (DRY) { console.log(`(dry) would settle ${settled}, props ${propsSettled}, pitches ${pitchSettled}, pitch-2 ${pitch2Settled}`); return; }
  if (propsSettled) writePropsLedger(propRows);
  if (pitchSettled) writePitchLedger(pitchRows);
  if (pitch2Settled) writePitch2Ledger(p2Rows);
  writeJsGlobal(LEDGER_PATH, 'SEASON_LEDGER', rows,
    '// ============================================================\n// SEASON LEDGER — committed prediction rows (2026-27)\n// ============================================================\n// Written by `node fetch-slate.js --record` / `--settle`. Do not hand-edit\n// probabilities: a row is only evidence if recorded before tip-off.\n// ============================================================');
  console.log(`Settled ${settled}; ${rows.filter(r => !r.result).length} still open.`);
  if (propsSettled) {
    const pr = ctx.seasonPropsRecord(propRows);
    const f = pr.stats.pra.floor || {};
    console.log(`  props    settled ${propsSettled}; ${pr.played} played of ${pr.n} recorded · PRA MAE ${pr.stats.pra.mae} · over the 90% floor ${f.n ? pct(f.over) + ' (model ' + pct(f.expected) + ')' : '—'} · minutes MAE ${pr.minutes.mae}`);
  }
  if (pitchSettled) {
    const pr = ctx.seasonPitchRecord(pitchRows, rows);
    console.log(`  pitch    ${pitchSettled} ticket${pitchSettled === 1 ? '' : 's'} graded this run`);
    for (const k of ['floor', 'edge']) { const g = pr[k]; console.log(`  pitch ${k.padEnd(5)} ${g.won}/${g.settled} tickets won · legs ${g.legsHit}/${g.legs} (shown ${g.legs ? pct(g.legsShown / g.legs) : '—'})${g.priced ? ` · ${g.units >= 0 ? '+' : ''}${g.units}u on ${g.priced} priced` : ''} · ${g.noTicket} no-ticket night${g.noTicket === 1 ? '' : 's'}`); }
  }
  if (pitch2Settled) {
    const pr = ctx.seasonPitch2Record(p2Rows);
    console.log(`  pitch fav ${pitch2Settled} ticket${pitch2Settled === 1 ? '' : 's'} graded this run`);
    for (const k of ['safe', 'lean']) { const g = pr[k]; console.log(`  pitch fav-${k} ${g.won}/${g.settled} tickets won (shown ${g.settled ? pct(g.shown / g.settled) : '—'}) · legs ${g.legsHit}/${g.legs} (shown ${g.legs ? pct(g.legsShown / g.legs) : '—'})${g.priced ? ` · ${g.units >= 0 ? '+' : ''}${g.units}u on ${g.priced} priced` : ''}`); }
  }
  // flat-1: $25 straight bets — every ledger favourite −299 to −100, and the user's own FanDuel legs.
  const fs1 = ctx.seasonFlatSummary(rows, Array.isArray(ctx.SEASON_USER_LEGS) ? ctx.SEASON_USER_LEGS : [], p2Rows);
  const flatLine = (g) => g.n ? `${g.won}/${g.n} won (break-even ${g.beWins.toFixed(1)}) · ${g.profit >= 0 ? '+' : '−'}$${Math.abs(g.profit).toFixed(2)} on $${g.staked} (${(g.margin * 100).toFixed(1)}%)${g.open ? ` · ${g.open} open` : ''}` : `no bets yet${g.open ? ` · ${g.open} open` : ''}`;
  console.log(`  flat favs from ${ctx.SEASON_FLAT_SPEC.firstNight}: ${flatLine(fs1.ledger.clean)}`);
  console.log(`  flat yours above −300: ${flatLine(fs1.yours.rule)}`);
  // fade-1: the fade bets against their control (other 50–70% favourites on NB.AI nights).
  const fd = ctx.seasonFadeSummary(rows);
  console.log(`  fade NB.AI from ${ctx.SEASON_FADE_SPEC.firstNight}: ${flatLine(fd.clean.fade)} · control ${flatLine(fd.clean.control)}`);
  const score = ctx.scoreForecasts(rows);
  Object.keys(score).forEach(k => { const s = score[k]; if (s.n) console.log(`  ${k.padEnd(8)} n=${s.n} acc=${pct(s.accuracy)} brier=${s.brier}${s.marginMae != null ? ' mae=' + s.marginMae : ''}`); });
}

// --odds: tonight's pre-tip games from ESPN's scoreboard (free); the model is built only when a
// game is due, on the same slate --record uses, with the latest official injury report over it.
async function oddsRun(ctx) {
  const today = todayEt();
  const sb = await getJson(ESPN_SCOREBOARD + today.replace(/-/g, ''));
  const games = (sb.events || []).filter(e => (!e.season || e.season.type === 2) && e.status && e.status.type && e.status.type.state === 'pre').map(e => {
    const c = e.competitions[0];
    return { id: e.id, date: today, tip: e.date, home: c.competitors.find(x => x.homeAway === 'home').team.abbreviation, away: c.competitors.find(x => x.homeAway === 'away').team.abbreviation };
  });
  const buildModel = async (due) => {
    let slate = args.has('--espn') ? await espnSlate(ctx) : await nbaiSlate(ctx);
    if (slate.date !== today) { console.log(`  model: the feed's slate is ${slate.date}, not ${today} — prices stored without the model (add --espn)`); return new Map(); }
    let report = null;
    try {
      const r = await require('./late-flip.js').reportBefore(Date.now(), Date.now());
      const applied = ctx.seasonApplyInjuryReport(slate, r);
      slate = applied.slate; report = r.name;
      console.log(`  model: official injury report ${r.name}, ${applied.changes.length} status change${applied.changes.length === 1 ? '' : 's'} over the feed`);
      for (const c of applied.changes) console.log(`    injury ${c.team} ${c.name}: ${c.from} → ${c.to}`);
    } catch (e) { console.warn(`  model: injury report unavailable (${e.message}); feed statuses used`); }
    slate.results = await seasonResults(slate.date);
    const propSlate = ctx.seasonCleanSlate(slate) || slate;
    const out = new Map();
    for (const d of due) {
      const g = slate.games.find(x => String(x.id) === String(d.id));
      if (!g) { console.log(`  model: ${d.away} @ ${d.home} is not on the feed's slate`); continue; }
      out.set(String(g.id), { pHome: +ctx.projectSeasonGame(g, slate).pHome.toFixed(4), report, source: slate.source || 'nb.ai',
        engine: ctx.SEASON_ENGINE_VERSION, props: ctx.buildPropRows(g, propSlate, {}) });
    }
    return out;
  };
  await require('./odds-pull.js').pullOdds({ ctx, key: process.env.ODDS_API_KEY, games, ledgerPath: ODDS_LEDGER_PATH, lockPath: ODDS_LOCK_PATH, buildModel, dry: DRY });
}

function pct(p) { return p == null ? '—' : (p * 100).toFixed(1) + '%'; }
function fmtMargin(home, m) { return m >= 0 ? `${home} by ${m.toFixed(1)}` : `${home} −${Math.abs(m).toFixed(1)}`; }

main().catch(e => { console.error(e); process.exit(1); });
