#!/usr/bin/env node
// ============================================================
// fetch-slate.js — pull the NB.AI feed, snapshot it, record, settle
// ============================================================
// The NB.AI site sends no CORS headers, so the browser cannot read
// it from GitHub Pages. This script runs locally (Node 18+, uses
// global fetch) and commits what the page needs:
//
//   node fetch-slate.js            download feed → js/season/data/slate-snapshot.js
//   node fetch-slate.js --record   also append tonight's predictions to the ledger
//                                  (refused when the feed is not today's slate; --force overrides)
//   node fetch-slate.js --settle   fill results for unsettled ledger rows via ESPN
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
const TEAM_PRIORS_PATH = path.join(__dirname, 'js/season/data/team-priors.js');

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
  if (fs.existsSync(LEDGER_PATH)) load('js/season/data/season-ledger.js');
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
  if (!open.length && !rows.some(needsClose)) { console.log('Nothing to settle.'); return; }
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
  if (DRY) { console.log(`(dry) would settle ${settled}`); return; }
  writeJsGlobal(LEDGER_PATH, 'SEASON_LEDGER', rows,
    '// ============================================================\n// SEASON LEDGER — committed prediction rows (2026-27)\n// ============================================================\n// Written by `node fetch-slate.js --record` / `--settle`. Do not hand-edit\n// probabilities: a row is only evidence if recorded before tip-off.\n// ============================================================');
  console.log(`Settled ${settled}; ${rows.filter(r => !r.result).length} still open.`);
  const score = ctx.scoreForecasts(rows);
  Object.keys(score).forEach(k => { const s = score[k]; if (s.n) console.log(`  ${k.padEnd(8)} n=${s.n} acc=${pct(s.accuracy)} brier=${s.brier}${s.marginMae != null ? ' mae=' + s.marginMae : ''}`); });
}

function pct(p) { return p == null ? '—' : (p * 100).toFixed(1) + '%'; }
function fmtMargin(home, m) { return m >= 0 ? `${home} by ${m.toFixed(1)}` : `${home} −${Math.abs(m).toFixed(1)}`; }

main().catch(e => { console.error(e); process.exit(1); });
