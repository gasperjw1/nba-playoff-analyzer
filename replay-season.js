#!/usr/bin/env node
// ============================================================
// replay-season.js — walk-forward replay of the 2026-27 season
// ============================================================
// Predicts every past game from what was knowable before it tipped:
//
//   team ratings   Basketball-Reference's final 2025-26 offense/defense
//                  per 100 and pace (js/season/data/team-ratings.js) — not
//                  NB.AI's "prior", which absorbs this season's games
//   this season    regular-season games dated before the day (ESPN)
//   players        2024-25 / 2025-26 lines and BPM (player-priors.js) plus
//                  this season's box scores before the day
//   roster         box-score appearances (preseason and regular season)
//                  before the day, Basketball-Reference waivers/signings
//                  dated before the day, and the day's injury report
//   availability   the official NBA injury report: the latest one published
//                  at least SPEC.reportLeadMinutes before the game's tip
//   preseason      (variant) NBA-vs-NBA preseason margin per game × 0.099
//
// Nothing here reads the NB.AI feed, the slate snapshot, the season
// ledger, NB.AI-derived team priors or any ESPN endpoint that only shows
// today (injuries, rosters): the context loader and the fetch allow-list
// both refuse them. Lines and final scores are attached after prediction,
// for scoring only.
//
// Usage:
//   node replay-season.js --ratings     regenerate team-ratings.js from the cached BR page
//   node replay-season.js --check       leak checks (future-blind, scramble) on sample days
//   node replay-season.js --inspect YYYY-MM-DD ABBR   one team's as-of roster vs who dressed (input QA)
//   node replay-season.js --qa          the same check over every game, summarized
//   node replay-season.js               run every day, write js/season/data/season-replay.js
//                                       (prints coverage, never accuracy)
//   node replay-season.js --score       accuracy vs the market — refuses to run unless the spec
//                                       files are committed and unchanged
//   [--to YYYY-MM-DD]                   last day to replay (default: yesterday, ET)
//
// Needs the PDF reader once: python3 -m venv .cache/pyenv && .cache/pyenv/bin/pip install pypdf
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

// ── Pre-registered spec (frozen before the first scored run) ─────────
const SPEC = {
  version: 'replay-3',
  // replay-3: engine 2026-11-05.minutes-v1 — tonight's minutes capped at 240 and the roster step
  //   valued in minutes (tonight − minutes in the rating). Chosen on 330 past team-seasons
  //   (research-season-prior.js) before any replay game was scored with it; nothing else changes.
  //   The engine and its constants are now spec files, so an engine edit cannot be scored unfrozen.
  // replay-2 (after an independent review of replay-1; changes are bug and leak fixes, not tuning):
  //   events ordered by ET time of day (a roster captured in the morning precedes that day's dated
  //   moves, and one captured before tip on game day counts for that day); a report moves a player
  //   only for games whose cutoff is after it; player names come from data before the day; seeds are
  //   dated at the end of 2025-26; the leak check also scrambles later reports and rebuilds names.
  engine: '2026-11-05.minutes-v1',      // must equal SEASON_ENGINE_VERSION
  firstDay: '2026-10-20',
  // Opening rosters: each team's latest archived ESPN roster page captured before this instant
  // (8 AM ET on opening day, before any game), from the Internet Archive.
  rosterSnapshotBefore: '2026-10-20T12:00:00Z',
  reportLeadMinutes: 60,
  preseasonCoef: 0.099,                 // 2016-2026 study; 0.0993 on a projected-minutes base
  preseasonWindow: ['2026-09-25', '2026-10-19'],
  variants: { ours: 'engine', oursPre: 'engine + preseason' },
};

const ROOT = __dirname;
const DATA = (f) => path.join(ROOT, 'js/season/data', f);
const CACHE = path.join(ROOT, '.cache');
const ESPN_CACHE = path.join(CACHE, 'espn-nba');
const PRE_CACHE = path.join(ESPN_CACHE, 'preseason');
const REPORT_CACHE = path.join(CACHE, 'injury-reports');
const BREF_CACHE = path.join(CACHE, 'bref');
const PY = path.join(CACHE, 'pyenv/bin/python');
const ARCHIVE_CACHE = path.join(CACHE, 'archive');
const OUT = DATA('season-replay.js');
const SPEC_FILES = ['replay-season.js', 'js/season/replay-core.js', 'js/season/data/team-ratings.js', 'parse-injury-report.py',
  'js/season/engine.js', 'js/season/data/season-constants.js'];

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const opt = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };

// ── Guard 1: only these files load; forbidden globals must stay undefined ──
const ALLOWED_FILES = [
  'js/season/data/season-constants.js', 'js/season/data/player-priors.js', 'js/season/data/chemistry-fit.js',
  'js/season/data/aging-fit.js', 'js/season/data/team-ratings.js',
  'js/season/adapters.js', 'js/season/engine.js', 'js/season/ensemble.js', 'js/season/replay-core.js',
];
const FORBIDDEN_GLOBALS = ['SEASON_SLATE_SNAPSHOT', 'SEASON_LEDGER', 'SEASON_TEAM_PRIORS', 'SEASON_USER_BETS'];
function loadContext() {
  const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error, Intl });
  for (const f of ALLOWED_FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^(const|let) /gm, 'var '), ctx, { filename: f });
  for (const g of FORBIDDEN_GLOBALS) if (typeof ctx[g] !== 'undefined') throw new Error(`leak guard: ${g} is defined in the replay context`);
  if (ctx.SEASON_ENGINE_VERSION !== SPEC.engine) throw new Error(`engine is ${ctx.SEASON_ENGINE_VERSION}, spec ${SPEC.engine}: the replay is frozen to one engine version`);
  return ctx;
}

// ── Guard 2: network allow-list (history only) ───────────────────────
const ALLOWED_URLS = [
  /^https:\/\/site\.api\.espn\.com\/apis\/site\/v2\/sports\/basketball\/nba\/scoreboard\?dates=\d{8}$/,
  /^https:\/\/site\.api\.espn\.com\/apis\/site\/v2\/sports\/basketball\/nba\/summary\?event=\d+$/,
  /^https:\/\/ak-static\.cms\.nba\.com\/referee\/injury\/Injury-Report_\d{4}-\d{2}-\d{2}_\d{2}_\d{2}[AP]M\.pdf$/,
  /^https:\/\/web\.archive\.org\/cdx\/search\/cdx\?url=www\.espn\.com\/nba\/team\/roster\/_\/name\/[a-z]+\/&matchType=prefix&from=\d{14}&to=\d{14}&output=json&filter=statuscode:200$/,
  /^https:\/\/web\.archive\.org\/web\/\d{14}id_\/https:\/\/www\.espn\.com\/nba\/team\/roster\/_\/name\/[a-z]+\/(?:sort\/[a-z]+\/)?[a-z0-9-]+$/,
  /^https:\/\/web\.archive\.org\/cdx\/search\/cdx\?url=www\.nba\.com\/[a-z0-9]+\/roster&matchType=prefix&from=\d{14}&to=\d{14}&output=json&filter=statuscode:200$/,
  /^https:\/\/web\.archive\.org\/web\/\d{14}id_\/https:\/\/www\.nba\.com\/[a-z0-9]+\/roster$/,
];
// NBA.com team slugs, for the archived roster fallback when ESPN's page was never captured.
const NBA_SLUG = { ATL: 'hawks', BOS: 'celtics', BKN: 'nets', CHA: 'hornets', CHI: 'bulls', CLE: 'cavaliers', DAL: 'mavericks', DEN: 'nuggets',
  DET: 'pistons', GS: 'warriors', HOU: 'rockets', IND: 'pacers', LAC: 'clippers', LAL: 'lakers', MEM: 'grizzlies', MIA: 'heat', MIL: 'bucks',
  MIN: 'timberwolves', NO: 'pelicans', NY: 'knicks', OKC: 'thunder', ORL: 'magic', PHI: 'sixers', PHX: 'suns', POR: 'blazers', SAC: 'kings',
  SA: 'spurs', TOR: 'raptors', UTAH: 'jazz', WSH: 'wizards' };
async function get(url, kind = 'json') {
  if (!ALLOWED_URLS.some(r => r.test(url))) throw new Error(`leak guard: ${url} is not on the replay allow-list`);
  let res;
  for (let attempt = 0; attempt < 5; attempt++) {     // the Internet Archive often answers 5xx under load
    res = await fetch(url, { headers: { 'User-Agent': 'nba-playoff-analyzer replay' } }).catch(() => null);
    if (res && res.status < 500) break;
    await new Promise(r => setTimeout(r, 3000 * (attempt + 1)));
  }
  if (!res) throw new Error(`${url}: no response`);
  if (kind === 'pdf') return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
  if (kind === 'archive') return res.ok ? { text: await res.text(), memento: res.headers.get('memento-datetime') } : null;
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}
async function cached(file, url, keep = () => true) {
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const j = await get(url);
  if (keep(j)) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(j)); }
  return j;
}

// ── dates and times (ET) ─────────────────────────────────────────────
const addDays = (s, n) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const days = (a, b) => { const out = []; for (let d = a; d <= b; d = addDays(d, 1)) out.push(d); return out; };
const etFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
function et(instant) {
  const p = Object.fromEntries(etFmt.formatToParts(new Date(instant)).map(x => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, h: +p.hour, m: +p.minute };
}
const todayEt = () => et(Date.now()).date;
// The report published at ET wall time (date, h, m) → its file name and an absolute instant.
function reportName(date, h, m) {
  const ap = h >= 12 ? 'PM' : 'AM', h12 = h % 12 === 0 ? 12 : h % 12;
  return `Injury-Report_${date}_${String(h12).padStart(2, '0')}_${String(m).padStart(2, '0')}${ap}.pdf`;
}
function etInstant(date, h, m) {
  // ET is UTC−4 (EDT) or UTC−5 (EST); pick the offset that round-trips.
  for (const off of [4, 5]) {
    const t = Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10), h + off, m);
    const back = et(t);
    if (back.date === date && back.h === h && back.m === m) return t;
  }
  throw new Error(`no ET instant for ${date} ${h}:${m}`);
}

// ── data store (everything the replay may ever read, with timestamps) ──
const NBA = new Set(Object.values({ a: 'ATL', b: 'BOS', c: 'BKN', d: 'CHA', e: 'CHI', f: 'CLE', g: 'DAL', h: 'DEN', i: 'DET', j: 'GS', k: 'HOU', l: 'IND', m: 'LAC', n: 'LAL', o: 'MEM', p: 'MIA', q: 'MIL', r: 'MIN', s: 'NO', t: 'NY', u: 'OKC', v: 'ORL', w: 'PHI', x: 'PHX', y: 'POR', z: 'SAC', A: 'SA', B: 'TOR', C: 'UTAH', D: 'WSH' }));
const allCompleted = (sb) => (sb.events || []).length > 0 && sb.events.every(e => e.status && e.status.type && e.status.type.completed);

async function buildStore(ctx, lastDay) {
  const store = { schedule: {}, regGames: [], preGames: [], appearances: [], transactions: [], reports: {}, names: new Map() };
  const note = (id, name) => { if (name) store.names.set(String(id), name); };
  // Regular season: schedule for every day; finals with box scores.
  for (const d of days(SPEC.firstDay, lastDay)) {
    const sb = await cached(path.join(ESPN_CACHE, `scoreboard-${d}.json`), `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${d.replace(/-/g, '')}`, allCompleted);
    store.schedule[d] = [];
    for (const e of sb.events || []) {
      if (!e.season || e.season.type !== 2) continue;
      const c = e.competitions[0], h = c.competitors.find(x => x.homeAway === 'home'), a = c.competitors.find(x => x.homeAway === 'away');
      store.schedule[d].push({ id: String(e.id), tip: e.date, home: h.team.abbreviation, away: a.team.abbreviation });
      if (!e.status.type.completed) continue;
      const summary = await cached(path.join(ESPN_CACHE, `summary-${e.id}.json`), `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${e.id}`);
      const box = ctx.adaptEspnBox(summary);
      store.regGames.push({ id: String(e.id), date: d, tip: e.date, home: h.team.abbreviation, away: a.team.abbreviation,
        homeScore: +h.score, awayScore: +a.score, box, market: ctx.adaptEspnPickcenter(summary, h.team.abbreviation, a.team.abbreviation) });
      for (const ab of [h.team.abbreviation, a.team.abbreviation]) for (const p of box[ab] || []) { store.appearances.push({ at: d, kind: 'appear', team: ab, id: p.id, name: p.name, dnp: !p.played }); note(p.id, p.name); }
    }
  }
  // Preseason: margins (NBA vs NBA) and roster appearances.
  for (const d of days(...SPEC.preseasonWindow)) {
    const sb = await cached(path.join(PRE_CACHE, `sb-${d}.json`), `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${d.replace(/-/g, '')}`);
    for (const e of sb.events || []) {
      if (!e.season || e.season.type !== 1 || !e.status.type.completed) continue;
      const c = e.competitions[0], h = c.competitors.find(x => x.homeAway === 'home'), a = c.competitors.find(x => x.homeAway === 'away');
      const H = h.team.abbreviation, A = a.team.abbreviation;
      const summary = await cached(path.join(PRE_CACHE, `summary-${e.id}.json`), `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${e.id}`);
      const box = ctx.adaptEspnBox(summary);
      store.preGames.push({ id: String(e.id), date: d, home: H, away: A, homeScore: +h.score, awayScore: +a.score, nbaOnly: NBA.has(H) && NBA.has(A) });
      for (const ab of [H, A]) if (NBA.has(ab)) for (const p of box[ab] || []) { store.appearances.push({ at: d, kind: 'appear-pre', team: ab, id: p.id, name: p.name }); note(p.id, p.name); }
    }
  }
  // Seed: each player's last 2025-26 team (Basketball-Reference totals list a traded player's
  // stints in order after his combined "2TM" row), as of the start of the offseason.
  const byBr = new Map(Object.entries(ctx.SEASON_PLAYER_PRIORS.players).filter(([, p]) => p.br).map(([id, p]) => [p.br, id]));
  const totals = fs.readFileSync(path.join(BREF_CACHE, 'NBA_2026_totals.html'), 'utf8');
  const tbl = totals.slice(totals.indexOf('id="totals_stats"'), totals.indexOf('</table>', totals.indexOf('id="totals_stats"')));
  const lastTeam = new Map();
  for (const tr of tbl.split('<tr').slice(1)) {
    const br = (tr.match(/data-append-csv="([\w.]+)"/) || [])[1], tm = (tr.match(/data-stat="team_name_abbr"[^>]*>(?:<a[^>]*>)?([A-Z0-9]+)/) || [])[1];
    if (br && tm && !/^\dTM$/.test(tm)) lastTeam.set(br, BREF_TO_ESPN[tm] || tm);
  }
  for (const [br, team] of lastTeam) if (byBr.has(br)) store.appearances.push({ at: '2026-04-15', kind: 'seed', team, id: byBr.get(br), name: ctx.SEASON_PLAYER_PRIORS.players[byBr.get(br)].n });
  // Basketball-Reference transactions from July 1 (waived/released → leave, signed/claimed → join,
  // retired → off every roster), dated. Trades are not readable there (names are filled in by script);
  // a traded player moves on his first box score or injury-report listing for the new team.
  // Identity only: names from the whole season's box scores turn a Basketball-Reference name (here)
  // or an NBA.com roster name (below) into an ESPN id. No result, minute or date reaches a prediction
  // this way; predictDay itself looks names up only from data before the day.
  const byName = new Map();
  for (const [id, name] of store.names) { const k = ctx.replayNormName(name); byName.set(k, (byName.get(k) || []).concat(id)); }
  const html = fs.readFileSync(path.join(BREF_CACHE, 'NBA_2027_transactions.html'), 'utf8');
  for (const [, dateText, body] of html.matchAll(/<li><span>(.*?)<\/span>(.*?)<\/li>/gs)) {
    const at = new Date(dateText + ' 12:00 UTC').toISOString().slice(0, 10);
    for (const [, p] of body.matchAll(/<p>(.*?)<\/p>/gs)) {
      const kind = /\bretire/.test(p) ? 'retire' : /\bwaived\b|\breleased\b/.test(p) ? 'leave' : /\bsigned\b|\bclaimed\b/.test(p) ? 'join' : null;
      if (!kind || /\btraded\b/.test(p)) continue;
      const team = kind === 'retire' ? '*' : (p.match(kind === 'leave' ? /data-attr-from="([A-Z]{3})"/ : /data-attr-to="([A-Z]{3})"/) || [])[1];
      const pl = p.match(/href="\/players\/\w\/([\w.]+)\.html">([^<]+)</);
      if (!team || !pl) continue;
      const ids = byBr.has(pl[1]) ? [byBr.get(pl[1])] : byName.get(ctx.replayNormName(pl[2])) || [];
      if (ids.length !== 1) continue;            // never appeared in a box score and no history: cannot affect a roster
      store.transactions.push({ at, kind, team: BREF_TO_ESPN[team] || team, id: ids[0], name: pl[2] });
    }
  }
  // Opening rosters from archived roster pages (point-in-time: each capture time is checked):
  // ESPN's team roster page (players by ESPN id), else NBA.com's (names, matched to ESPN ids).
  store.snapshots = []; store.snapshotSource = {}; store.snapshotUnmatched = [];
  const ts = (iso) => iso.replace(/[-:TZ]/g, '').slice(0, 14);
  const window = `from=20261001000000&to=${ts(SPEC.rosterSnapshotBefore)}&output=json&filter=statuscode:200`;
  const leagueByName = new Map();
  for (const [id, name] of store.names) { const k = ctx.replayNormName(name); leagueByName.set(k, [...new Set((leagueByName.get(k) || []).concat(id))]); }
  for (const [id, p] of Object.entries(ctx.SEASON_PLAYER_PRIORS.players)) { const k = ctx.replayNormName(p.n); leagueByName.set(k, [...new Set((leagueByName.get(k) || []).concat(id))]); }
  const latestCapture = async (cacheName, cdxUrl, shape) => {
    const cdx = await cached(path.join(ARCHIVE_CACHE, cacheName), cdxUrl);
    return (cdx || []).slice(1).filter(c => c[1] < ts(SPEC.rosterSnapshotBefore) && shape.test(c[2])).sort((a, b) => (a[1] < b[1] ? -1 : 1)).pop() || null;
  };
  const capturePage = async (file, cap) => {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
    const page = await get(`https://web.archive.org/web/${cap[1]}id_/${cap[2].replace(/^http:/, 'https:')}`, 'archive');
    if (page) { fs.mkdirSync(ARCHIVE_CACHE, { recursive: true }); fs.writeFileSync(file, JSON.stringify(page)); }
    return page;
  };
  for (const ab of Object.keys(ctx.SEASON_TEAM_RATINGS.teams)) {
    const lower = ab.toLowerCase();
    let ids = null, at = null, source = null;
    const cap = await latestCapture(`cdx-${lower}.json`, `https://web.archive.org/cdx/search/cdx?url=www.espn.com/nba/team/roster/_/name/${lower}/&matchType=prefix&${window}`,
      /\/name\/[a-z]+\/(?:sort\/[a-z]+\/)?[a-z0-9-]+$/);
    const page = cap && await capturePage(path.join(ARCHIVE_CACHE, `roster-${lower}-${cap[1]}.json`), cap);
    if (page) {
      ids = {};
      for (const [, id, slug] of page.text.matchAll(/\/nba\/player\/_\/id\/(\d+)\/([a-z0-9-]+)/g))
        ids[id] = store.names.get(id) || (ctx.SEASON_PLAYER_PRIORS.players[id] || {}).n || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
      at = page.memento; source = 'espn';
    } else {
      const ncap = await latestCapture(`cdx-nba-${NBA_SLUG[ab]}.json`, `https://web.archive.org/cdx/search/cdx?url=www.nba.com/${NBA_SLUG[ab]}/roster&matchType=prefix&${window}`, /\/roster$/);
      const npage = ncap && await capturePage(path.join(ARCHIVE_CACHE, `nba-${NBA_SLUG[ab]}-${ncap[1]}.json`), ncap);
      if (npage) {
        ids = {};
        for (const [, name] of npage.text.matchAll(/"@type":"Person","name":"([^"]+)"/g)) {
          const k = ctx.replayNormName(name), hit = leagueByName.get(k) || leagueByName.get(k.split(' ').reverse().join(' ')) || [];
          if (hit.length === 1) ids[hit[0]] = name; else store.snapshotUnmatched.push(`${ab} ${name}`);
        }
        at = npage.memento; source = 'nba.com';
      }
    }
    if (!ids) { store.snapshotSource[ab] = 'none'; continue; }
    at = new Date(at).toISOString();
    if (!(at < SPEC.rosterSnapshotBefore)) throw new Error(`leak guard: ${ab} roster snapshot is from ${at}`);
    if (Object.keys(ids).length < 12) throw new Error(`${ab} roster snapshot (${source}) has only ${Object.keys(ids).length} players`);
    store.snapshots.push({ at, kind: 'snapshot', team: ab, ids });
    store.snapshotSource[ab] = `${source} ${at.slice(0, 16)}Z`;
  }
  return store;
}
const BREF_TO_ESPN = { BRK: 'BKN', CHO: 'CHA', GSW: 'GS', NOP: 'NO', NYK: 'NY', PHO: 'PHX', SAS: 'SA', UTA: 'UTAH', WAS: 'WSH' };

// ── injury reports: latest published ≥ lead minutes before tip ─────────
const reportIndexFile = path.join(REPORT_CACHE, 'index.json');
let reportIndex = null;
async function reportFor(tip) {
  reportIndex = reportIndex || (fs.existsSync(reportIndexFile) ? JSON.parse(fs.readFileSync(reportIndexFile, 'utf8')) : {});
  const cutoff = new Date(tip).getTime() - SPEC.reportLeadMinutes * 60e3;
  let { date, h, m } = et(cutoff);
  m = m >= 30 ? 30 : 0;
  for (let step = 0; step < 36; step++) {           // up to 18 hours back
    const name = reportName(date, h, m);
    const pdf = path.join(REPORT_CACHE, name), json = pdf.replace(/\.pdf$/, '.json');
    if (reportIndex[name] === undefined) {
      const buf = await get(`https://ak-static.cms.nba.com/referee/injury/${name}`, 'pdf');
      reportIndex[name] = !!buf;
      if (buf) { fs.mkdirSync(REPORT_CACHE, { recursive: true }); fs.writeFileSync(pdf, buf); }
      fs.mkdirSync(REPORT_CACHE, { recursive: true }); fs.writeFileSync(reportIndexFile, JSON.stringify(reportIndex));
    }
    if (reportIndex[name]) {
      if (!fs.existsSync(json)) fs.writeFileSync(json, execFileSync(PY, ['-I', path.join(ROOT, 'parse-injury-report.py'), pdf], { maxBuffer: 64e6 }));
      const parsed = JSON.parse(fs.readFileSync(json, 'utf8'));
      const at = etInstant(date, h, m);
      if (at > cutoff) throw new Error(`leak guard: report ${name} is after the cutoff`);
      return { name, at, ...parsed };
    }
    m -= 30; if (m < 0) { m = 30; h -= 1; } if (h < 0) { h = 23; date = addDays(date, -1); }
  }
  throw new Error(`no injury report within 18 hours before ${tip}`);
}
async function loadReports(store) {
  for (const games of Object.values(store.schedule)) for (const g of games) {
    const r = await reportFor(g.tip);
    store.reports[r.name] = store.reports[r.name] || r;
    g.report = r.name;
  }
}

// ── one day, from the store, cut to that morning ─────────────────────
// Every read of the store is filtered here; nothing below sees a game, appearance,
// transaction or report from the day itself or later (reports: only the one chosen
// per game, published before its cutoff).
// Event ordering key (ET): dated moves sit at "<date>|1"; a timestamped capture sits before them
// ("|0") in the morning and after them ("|2") from noon. A day's cutoff is "<day>|1": its own
// dated moves are excluded (their time is unknown), a capture that morning is included.
const eventKey = (e) => {
  if (!/T/.test(e.at)) return e.at + '|1';
  const t = et(e.at);
  return `${t.date}|${t.h < 12 ? 0 : 2}`;
};
function predictDay(ctx, store, date, debug) {
  const regGames = store.regGames.filter(g => g.date < date).map(g => ({ id: g.id, date: g.date, home: g.home, away: g.away, homeScore: g.homeScore, awayScore: g.awayScore, box: g.box }));
  const allEvents = store.appearances.concat(store.transactions, store.snapshots || []).map(e => ({ ...e, at: eventKey(e) }));
  const asOf = (day) => allEvents.filter(e => e.at < day + '|1');
  const events = asOf(date);
  const morning = ctx.replayRosterAsOf(events, date + '|1');
  // Names only from what had been seen before the day (identity, not outcomes, but kept clean).
  const names = new Map();
  for (const e of events) if (e.name) names.set(String(e.id), e.name);
  for (const e of events) if (e.kind === 'snapshot') for (const [id, n] of Object.entries(e.ids)) if (!names.has(id)) names.set(id, n);
  const league = new Map();
  for (const [id, name] of names) { const k = ctx.replayNormName(name); league.set(k, (league.get(k) || []).concat(id)); }
  for (const [id, p] of Object.entries(ctx.SEASON_PLAYER_PRIORS.players)) { const k = ctx.replayNormName(p.n); if (!(league.get(k) || []).includes(id)) league.set(k, (league.get(k) || []).concat(id)); }
  const schedule = (store.schedule[date] || []).map(g => ({ id: g.id, tip: g.tip, home: g.home, away: g.away, report: g.report }));
  const availability = {}, notes = {}, prov = {}, moves = [];
  const onTeamName = (id) => names.get(id) || (ctx.SEASON_PLAYER_PRIORS.players[id] || {}).n || id;
  const rosters = Object.fromEntries(Object.entries(morning).map(([t, m]) => [t, new Map(m)]));
  for (const g of schedule) {
    const r = store.reports[g.report];
    if (!r || r.at > new Date(g.tip).getTime() - SPEC.reportLeadMinutes * 60e3) throw new Error(`leak guard: ${g.id} has no report before its cutoff`);
    const mmddyyyy = `${date.slice(5, 7)}/${date.slice(8, 10)}/${date.slice(0, 4)}`;
    const p = prov[g.id] = { report: g.report, reportAt: new Date(r.at).toISOString(), matched: 0, unmatched: [], notSubmitted: [] };
    for (const ab of [g.home, g.away]) {
      const entries = r.entries.filter(e => e.gameDate === mmddyyyy && ctx.REPLAY_TEAM_BY_NAME[e.team] === ab);
      if (r.notSubmitted.some(x => x.gameDate === mmddyyyy && ctx.REPLAY_TEAM_BY_NAME[x.team] === ab)) p.notSubmitted.push(ab);
      // A listed player belongs to this team tonight, wherever he was last seen.
      const roster = rosters[ab] = rosters[ab] || new Map();
      const m = ctx.replayMatchReport(entries, roster, league);
      for (const id of Object.keys(m.availability)) {
        if (!roster.has(id)) { roster.set(id, onTeamName(id)); moves.push({ id, to: ab, at: r.at }); }
      }
      Object.assign(availability, m.availability); Object.assign(notes, m.notes);
      p.matched += Object.keys(m.availability).length;
      p.unmatched.push(...m.unmatched.map(e => `${ab} ${e.player} (${e.status})`));
      // Harmless only if it cannot change anyone's availability: listed Available, or
      // listed Out with nobody of that family name on the team's roster.
      const family = new Set([...roster.values()].map(n => ctx.replayNormName(n).split(' ').pop()));
      p.unmatchedRisk = (p.unmatchedRisk || []).concat(m.unmatched
        .filter(e => e.status !== 'Available' && (e.status !== 'Out' || family.has(ctx.replayNormName(e.player).split(' ').pop())))
        .map(e => `${ab} ${e.player} (${e.status})`));
      // Not with the team: on the roster at the team's previous game, did not dress for it,
      // and on neither that game's report nor today's (an Out listing that drops off the
      // report means he is back). Before a team's first game there is no previous game.
      const prev = regGames.filter(x => x.home === ab || x.away === ab).sort((a, b) => (a.date < b.date ? -1 : 1)).pop();
      p.inactive = p.inactive || [];
      if (prev) {
        const dressed = new Set((prev.box[ab] || []).map(x => x.id));
        const prevRoster = ctx.replayRosterAsOf(asOf(prev.date), prev.date + '|1')[ab] || new Map();
        const prevSched = (store.schedule[prev.date] || []).find(x => x.id === prev.id);
        const prevRep = prevSched && store.reports[prevSched.report];
        const prevMmdd = `${prev.date.slice(5, 7)}/${prev.date.slice(8, 10)}/${prev.date.slice(0, 4)}`;
        const prevListed = prevRep ? new Set(Object.keys(ctx.replayMatchReport(prevRep.entries.filter(e => e.gameDate === prevMmdd && ctx.REPLAY_TEAM_BY_NAME[e.team] === ab), prevRoster, league).availability)) : new Set();
        for (const id of roster.keys()) {
          if (id in m.availability || !prevRoster.has(id) || dressed.has(id) || prevListed.has(id)) continue;
          availability[id] = 0; notes[id] = 'Not with team — inactive last game, on neither report';
          p.inactive.push(`${ab} ${roster.get(id)}`);
        }
      }
    }
  }
  // A player a report moved to another team leaves this team only if that report came out
  // before this team's own cutoff (a later game's report cannot reach back into an earlier game).
  for (const g of schedule) {
    const cutoff = new Date(g.tip).getTime() - SPEC.reportLeadMinutes * 60e3;
    for (const ab of [g.home, g.away]) for (const mv of moves) if (mv.to !== ab && mv.at <= cutoff) rosters[ab] && rosters[ab].delete(mv.id);
  }
  const priorTeams = ctx.SEASON_TEAM_RATINGS.teams;
  const teams = ctx.replayBuildTeams(priorTeams, date, regGames, rosters, availability, notes);
  const leagueAvg = ctx.deriveLeagueAverages(priorTeams);
  const preseason = {};
  for (const g of store.preGames) if (g.nbaOnly) for (const [x, y, sx, sy] of [[g.home, g.away, g.homeScore, g.awayScore], [g.away, g.home, g.awayScore, g.homeScore]]) {
    const r = preseason[x] = preseason[x] || { n: 0, diff: 0 }; r.n++; r.diff += sx - sy;
  }
  const games = schedule.filter(g => teams[g.home] && teams[g.away]);
  if (debug) return { teams, rosters, availability };
  const base = ctx.replayPredictDay({ date, games, teams, league: leagueAvg });
  const pre = ctx.replayPredictDay({ date, games, teams: ctx.replayPreseasonShift(teams, preseason, SPEC.preseasonCoef), league: leagueAvg });
  return base.map((b, i) => {
    const hashInput = JSON.stringify([b.home, b.away, [b.home, b.away].map(ab => [teams[ab].prior, teams[ab].current, teams[ab].rest,
      teams[ab].players.map(p => [p.id, p.availability, p.seasonGames, Math.round(p.avg.min * 100)])])]);
    return { ...b, pre: pre[i], rosterSizes: { [b.home]: teams[b.home].players.length, [b.away]: teams[b.away].players.length },
      provenance: { ...prov[b.id], boxCutoff: date, inputsHash: crypto.createHash('sha256').update(hashInput).digest('hex').slice(0, 16) } };
  });
}

// ── leak checks ──────────────────────────────────────────────────────
// Future-blind: the day's predictions from a store with everything on/after the day
// removed (schedule for the day kept, results stripped) must equal the full store's.
// Scramble: rewriting every later result and box score must change nothing.
function truncatedStore(store, date, upTo) {
  const s = { ...store };
  s.regGames = store.regGames.filter(g => g.date < date);
  s.preGames = store.preGames.slice();
  s.appearances = store.appearances.filter(e => e.at < date);
  s.transactions = store.transactions.filter(e => e.at < date);
  s.snapshots = (store.snapshots || []).filter(e => eventKey(e) < date + '|1');   // same ordering as predictDay
  s.schedule = Object.fromEntries(Object.entries(store.schedule).filter(([d]) => d <= date));
  // Cut at one game's cutoff: the day's later games (and their reports) do not exist yet.
  if (upTo != null) s.schedule[date] = s.schedule[date].filter(g => new Date(g.tip).getTime() - SPEC.reportLeadMinutes * 60e3 <= upTo);
  // Reports: everything published before the day's last cutoff (earlier games' reports included).
  const lastCutoff = upTo != null ? upTo : Math.max(...(store.schedule[date] || []).map(g => new Date(g.tip).getTime() - SPEC.reportLeadMinutes * 60e3));
  s.reports = Object.fromEntries(Object.entries(store.reports).filter(([, r]) => r.at <= lastCutoff));
  return s;
}
function scrambledStore(store, date) {
  const s = { ...store };
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  s.regGames = store.regGames.map(g => g.date < date ? g : { ...g, homeScore: 60 + Math.floor(rnd() * 80), awayScore: 60 + Math.floor(rnd() * 80),
    box: Object.fromEntries(Object.entries(g.box).map(([ab, ps]) => [ab, ps.map(p => ({ ...p, played: rnd() > 0.5, line: Object.fromEntries(Object.entries(p.line || {}).map(([k]) => [k, Math.floor(rnd() * 40)])) }))])) });
  s.appearances = store.appearances.map(e => e.at < date ? e : { ...e, team: ['ATL', 'BOS', 'MIA'][Math.floor(rnd() * 3)] });
  s.transactions = store.transactions.map(e => e.at < date ? e : { ...e, kind: e.kind === 'join' ? 'leave' : 'join' });
  // Reports published after the day's last cutoff: flip every status.
  const lastCutoff = Math.max(...(store.schedule[date] || []).map(g => new Date(g.tip).getTime() - SPEC.reportLeadMinutes * 60e3));
  const flip = { Out: 'Available', Available: 'Out', Questionable: 'Out', Doubtful: 'Available', Probable: 'Out' };
  s.reports = Object.fromEntries(Object.entries(store.reports).map(([n, r]) => [n, r.at <= lastCutoff ? r : { ...r, entries: r.entries.map(e => ({ ...e, status: flip[e.status] || e.status })) }]));
  return s;
}

// ── output rows (results and lines attached after prediction) ─────────
function rowsFor(ctx, store, preds) {
  const byId = new Map(store.regGames.map(g => [g.id, g]));
  return preds.map(p => {
    const g = byId.get(p.id), m = (g && g.market) || {};
    const pMarket = m.mlHome != null && m.mlAway != null ? +ctx.noVigHomeProb(m.mlHome, m.mlAway).toFixed(4) : null;
    return { id: p.id, date: p.date, tip: p.tip, home: p.home, away: p.away,
      pOurs: +p.pHome.toFixed(4), marginOurs: p.margin, totalOurs: p.total,
      pOursPre: +p.pre.pHome.toFixed(4), marginOursPre: p.pre.margin, totalOursPre: p.pre.total,
      pFriend: null, pMarket, mlHome: m.mlHome ?? null, mlAway: m.mlAway ?? null, spreadHome: m.spreadHome ?? null, totalMarket: m.total ?? null,
      open: m.open || null, source: 'replay', engine: SPEC.engine, spec: SPEC.version,
      result: g ? { homeScore: g.homeScore, awayScore: g.awayScore } : null,
      provenance: { ...p.provenance, rosterSizes: p.rosterSizes } };
  });
}

function specCommitted() {
  try {
    execFileSync('git', ['diff', '--quiet', 'HEAD', '--', ...SPEC_FILES], { cwd: ROOT });
    const tracked = execFileSync('git', ['ls-files', '--', ...SPEC_FILES], { cwd: ROOT }).toString().trim().split('\n').filter(Boolean);
    return tracked.length === SPEC_FILES.length;
  } catch (e) { return false; }
}

function writeRatings() {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(DATA('team-priors.js'), 'utf8').replace(/^const /m, 'var '), ctx);   // names and logos only
  const html = fs.readFileSync(path.join(BREF_CACHE, 'NBA_2026.html'), 'utf8');
  const table = html.slice(html.indexOf('id="advanced-team"'), html.indexOf('</table>', html.indexOf('id="advanced-team"')));
  const teams = {};
  for (const tr of table.split('<tr').slice(1)) {
    const br = (tr.match(/teams\/([A-Z]{3})\/2026\.html/) || [])[1];
    if (!br) continue;
    const ab = BREF_TO_ESPN[br] || br, g = k => +(tr.match(new RegExp(`data-stat="${k}"[^>]*>([-0-9.]+)`)) || [])[1];
    const t = ctx.SEASON_TEAM_PRIORS[ab];
    if (!t) throw new Error(`unknown team ${br}`);
    teams[ab] = { abbr: ab, name: t.name, city: t.city, logo: t.logo, prior: { ortg: g('off_rtg'), drtg: g('def_rtg'), pace: g('pace'), games: g('wins') + g('losses') } };
  }
  if (Object.keys(teams).length !== 30 || Object.values(teams).some(t => !(t.prior.ortg > 0 && t.prior.drtg > 0 && t.prior.pace > 0 && t.prior.games === 82))) throw new Error('team ratings incomplete');
  const sorted = Object.fromEntries(Object.keys(teams).sort().map(k => [k, teams[k]]));
  fs.writeFileSync(DATA('team-ratings.js'), `// ============================================================
// TEAM RATINGS — 2025-26 final, per team (Basketball-Reference)
// ============================================================
// Offensive and defensive rating per 100 possessions and pace from the
// 2025-26 regular season's Advanced Stats table (NBA_2026.html), fixed
// for 2026-27. Unlike NB.AI's "prior" (team-priors.js), nothing here
// has seen a 2026-27 game, so the walk-forward replay uses these.
// Generated by \`node replay-season.js --ratings\`. Do not hand-edit.
// ============================================================
const SEASON_TEAM_RATINGS = ${JSON.stringify({ season: '2025-26', source: 'https://www.basketball-reference.com/leagues/NBA_2026.html', teams: sorted }, null, 1)};
`);
  console.log(`Wrote js/season/data/team-ratings.js (30 teams)`);
}

async function main() {
  if (has('--ratings')) return writeRatings();
  const ctx = loadContext();
  const lastDay = opt('--to', addDays(todayEt(), -1));
  console.log(`Replay ${SPEC.version}: ${SPEC.firstDay} → ${lastDay}, engine ${SPEC.engine}`);
  const store = await buildStore(ctx, lastDay);
  await loadReports(store);
  const dayList = days(SPEC.firstDay, lastDay).filter(d => (store.schedule[d] || []).length);
  console.log(`  ${store.regGames.length} finals, ${store.preGames.length} preseason games, ${store.appearances.length} roster events, ${store.transactions.length} dated transactions, ${store.snapshots.length} archived opening rosters (${Object.entries(store.snapshotSource).filter(([, v]) => !v.startsWith('espn')).map(([k, v]) => k + ': ' + v.split(' ')[0]).join(', ') || 'all ESPN'}), ${Object.keys(store.reports).length} injury reports`);

  if (has('--inspect')) {
    // Input QA for one team on one day: the as-of roster with availability and projected
    // minutes, then (marked after the line) who actually dressed — data checking only.
    const [d, ab] = [opt('--inspect'), args[args.indexOf('--inspect') + 2]];
    const { teams } = predictDay(ctx, store, d, true);
    const t = teams[ab];
    const night = store.regGames.find(g => g.date === d && (g.home === ab || g.away === ab));
    const dressed = new Map(((night && night.box[ab]) || []).map(p => [p.id, p]));
    let total = 0;
    const rows = t.players.map(p => { const pr = ctx.playerProfile(p); total += pr.mpg * p.availability; return { p, pr }; }).sort((a, b) => b.pr.mpg - a.pr.mpg);
    console.log(`${ab} as of ${d}: ${t.players.length} on roster, projected minutes Σ mpg×availability = ${total.toFixed(0)}; current ${JSON.stringify(t.current)}; rest ${JSON.stringify(t.rest)}`);
    for (const { p, pr } of rows) {
      const n = dressed.get(p.id);
      console.log(`  ${p.name.padEnd(26)} mpg ${pr.mpg.toFixed(1).padStart(4)} bpm ${pr.bpm == null ? '  — ' : pr.bpm.toFixed(1).padStart(5)} avail ${String(p.availability).padEnd(4)} ${(p.injury || '').slice(0, 50).padEnd(50)} | that night: ${n ? (n.played ? n.line.min + ' min' : 'DNP ' + (n.reason || '')) : 'not in box'}`);
    }
    for (const [id, n] of dressed) if (!t.players.some(p => p.id === id) && n.played) console.log(`  MISSING from roster: ${n.name} played ${n.line.min} min`);
    return;
  }

  if (has('--qa')) {
    // Input QA over every game (data checking, no accuracy): players who played 10+ minutes
    // but were not on the as-of roster, and regulars counted available who did not dress.
    let missing = [], phantom = [], games = 0;
    for (const d of dayList) {
      const { teams } = predictDay(ctx, store, d, true);
      for (const night of store.regGames.filter(g => g.date === d)) for (const ab of [night.home, night.away]) {
        games += 0.5;
        const t = teams[ab], box = night.box[ab] || [];
        const onRoster = new Set(t.players.map(p => p.id));
        for (const n of box) if (n.played && n.line.min >= 10 && !onRoster.has(n.id)) missing.push(`${d} ${ab} ${n.name} (${n.line.min} min)`);
        const inBox = new Set(box.map(n => n.id));
        for (const p of t.players) { const pr = ctx.playerProfile(p); if (pr.mpg >= 15 && p.availability >= 0.5 && !inBox.has(p.id)) phantom.push(`${d} ${ab} ${p.name} (${pr.mpg.toFixed(0)} mpg, avail ${p.availability})`); }
      }
    }
    console.log(`QA over ${games} games: ${missing.length} players missing from rosters, ${phantom.length} regulars counted available who did not dress`);
    console.log('  missing:\n    ' + (missing.join('\n    ') || '—'));
    console.log('  not dressed:\n    ' + (phantom.join('\n    ') || '—'));
    return;
  }

  if (has('--check')) {
    const sample = [dayList[0], dayList[1], dayList[Math.floor(dayList.length / 2)], dayList[dayList.length - 1]];
    let ok = true;
    for (const d of sample) {
      const full = JSON.stringify(predictDay(ctx, store, d));
      const blind = JSON.stringify(predictDay(ctx, truncatedStore(store, d), d));
      const scr = JSON.stringify(predictDay(ctx, scrambledStore(store, d), d));
      // Per game: cut every report published after that game's own cutoff (a later game's
      // report must not reach back into an earlier game the same day).
      const fullRows = JSON.parse(full);
      let perGame = 0;
      for (const g of store.schedule[d]) {
        const cut = new Date(g.tip).getTime() - SPEC.reportLeadMinutes * 60e3;
        const row = predictDay(ctx, truncatedStore(store, d, cut), d).find(x => x.id === g.id);
        if (JSON.stringify(row) === JSON.stringify(fullRows.find(x => x.id === g.id))) perGame++;
      }
      const pass = full === blind && full === scr && perGame === store.schedule[d].length;
      ok = ok && pass;
      console.log(`  ${d}: future-blind ${full === blind ? 'identical' : 'DIFFERENT'}, scrambled future ${full === scr ? 'identical' : 'DIFFERENT'}, own-cutoff ${perGame}/${store.schedule[d].length} games identical`);
    }
    // Negative control: the scramble must be able to change something when it is not hidden.
    const control = JSON.stringify(predictDay(ctx, scrambledStore(store, dayList[0]), dayList[dayList.length - 1])) !== JSON.stringify(predictDay(ctx, store, dayList[dayList.length - 1]));
    console.log(`  control: scrambling games before the day ${control ? 'changes' : 'DOES NOT change'} its predictions`);
    if (!ok || !control) { console.error('LEAK CHECK FAILED'); process.exit(1); }
    console.log('Leak checks passed.');
    return;
  }

  const preds = [];
  for (const d of dayList) preds.push(...predictDay(ctx, store, d));
  const rows = rowsFor(ctx, store, preds);
  const unmatched = rows.flatMap(r => r.provenance.unmatched);
  const nys = rows.filter(r => r.provenance.notSubmitted.length);
  if (store.snapshotUnmatched.length) console.log(`  archived roster names not matched to an ESPN id (left to later box scores): ${store.snapshotUnmatched.join(', ')}`);
  console.log(`  ${rows.length} games predicted over ${dayList.length} days; ${rows.filter(r => r.result).length} final; report entries matched ${rows.reduce((s, r) => s + r.provenance.matched, 0)}, unmatched ${unmatched.length}; games with a team's report not yet submitted: ${nys.length}`);
  if (unmatched.length) console.log('  unmatched report names:\n    ' + [...new Set(unmatched)].join('\n    '));
  const risky = rows.flatMap(r => r.provenance.unmatchedRisk || []);
  if (risky.length) { console.error('  unmatched names that could change availability:\n    ' + [...new Set(risky)].join('\n    ')); process.exit(1); }

  if (has('--score')) {
    if (!specCommitted()) { console.error(`--score refuses to run: commit ${SPEC_FILES.join(', ')} first (the spec must be frozen before results are seen)`); process.exit(1); }
    const settled = rows.filter(r => r.result && r.pMarket != null);
    const sc = (name, pk, mk) => {
      let acc = 0, b = 0, mae = 0;
      for (const r of settled) { const y = r.result.homeScore > r.result.awayScore ? 1 : 0, p = pk(r); acc += (p >= 0.5) === (y === 1); b += (p - y) ** 2; mae += Math.abs(mk(r) - (r.result.homeScore - r.result.awayScore)); }
      console.log(`  ${name.padEnd(20)} winners ${(acc / settled.length * 100).toFixed(1)}%  Brier ${(b / settled.length).toFixed(4)}  margin miss ${(mae / settled.length).toFixed(2)}`);
    };
    console.log(`Scored on ${settled.length} games with a DraftKings close:`);
    sc('engine', r => r.pOurs, r => r.marginOurs);
    sc('engine + preseason', r => r.pOursPre, r => r.marginOursPre);
    sc('DraftKings close', r => r.pMarket, r => r.spreadHome != null ? -r.spreadHome : ctx.winProbToMargin(r.pMarket));
    return;
  }

  fs.writeFileSync(OUT, `// ============================================================
// SEASON REPLAY — walk-forward predictions (${SPEC.version})
// ============================================================
// Written by \`node replay-season.js\`. Each row was predicted from data
// published before its game (see the header of replay-season.js and each
// row's provenance), with engine ${SPEC.engine} frozen. These are NOT
// ledger rows: they were generated after the fact and are scored apart
// from the live ledger. Do not hand-edit.
// ============================================================
const SEASON_REPLAY = ${JSON.stringify({ spec: SPEC, generatedAt: new Date().toISOString(), rows }, null, 1)};
`);
  console.log(`Wrote ${path.relative(ROOT, OUT)} (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB). Accuracy is not printed here — run --score after committing the spec.`);
}

if (require.main === module) main().catch(e => { console.error(e.stack || e.message); process.exit(1); });
// For diagnostics only (e.g. comparing against live rows in a separate context).
module.exports = { SPEC, loadContext, buildStore, loadReports, predictDay, addDays, days };
