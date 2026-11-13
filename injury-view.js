#!/usr/bin/env node
// ============================================================
// injury-view.js — what the model would have said with the injury report
// ============================================================
// For one night (default: yesterday, ET), every game on that night's slate
// snapshot, projected by the live engine twice: on the feed's player statuses
// as snapshotted, and with the latest official NBA injury report labelled at
// least LEAD_MIN minutes before that game's tip laid over them (the same
// overlay as fetch-slate.js --injuries, js/season/injury-report.js). Beside
// them: the ledger's recorded numbers where the game was recorded (pOurs,
// pOursReport, the replay pipeline's late.pNow), the market, NB.AI and the
// final score from ESPN.
//
// A reconstruction, not evidence: none of it was recorded before tip, and
// nothing is written. The snapshot is the working tree's when it holds that
// night, else the last one committed for it. Games that tipped before the
// snapshot was fetched are shown but left out of the scores. The floor
// (pitch-1) and favourites (pitch-2) tickets are rebuilt as of the first tip
// on the report-adjusted slate, priced at the snapshot's odds, and graded.
//
//   node injury-view.js [YYYY-MM-DD] [--brief]   (--brief: the scores only)
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const { reportBefore } = require('./late-flip.js');

const LEAD_MIN = 30;   // a report labelled 30+ minutes before tip has been posted by tip
const SNAP = 'js/season/data/slate-snapshot.js';
const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/';
const args = process.argv.slice(2);
const BRIEF = args.includes('--brief');
const etDay = (t) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(t));
const etTime = (t) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' }).format(new Date(t));
const DATE = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a)) || etDay(Date.now() - 864e5);
const pct = (p) => p == null ? '  —  ' : (100 * p).toFixed(1).padStart(4) + '%';

function loadContext() {
  const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error });
  for (const f of ['data/season-constants', 'data/player-priors', 'data/chemistry-fit', 'data/aging-fit', 'data/team-ratings', 'adapters', 'engine', 'props',
    'ensemble', 'trust', 'ledger', 'replay-core', 'injury-report', 'props-ledger', 'parlay', 'pitch', 'pitch2', 'data/season-ledger']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, `js/season/${f}.js`), 'utf8').replace(/^(const|let) /gm, 'var '), ctx);
  }
  return ctx;
}

function parseSnapshot(code) {
  const c = vm.createContext({});
  vm.runInContext(code.replace(/^(const|let) /gm, 'var '), c);
  return c.SEASON_SLATE_SNAPSHOT;
}

// The night's snapshot: the working tree's, else the newest commit holding that date.
function snapshotFor(date) {
  const local = parseSnapshot(fs.readFileSync(path.join(__dirname, SNAP), 'utf8'));
  if (local && local.date === date) return { slate: local, from: 'working tree' };
  const hashes = execFileSync('git', ['log', '--format=%H', '-n', '80', '--', SNAP], { cwd: __dirname, encoding: 'utf8' }).split('\n').filter(Boolean);
  for (const h of hashes) {
    const code = execFileSync('git', ['show', `${h}:${SNAP}`], { cwd: __dirname, encoding: 'utf8', maxBuffer: 512e6 });
    const m = code.match(/"date": "(\d{4}-\d{2}-\d{2})"/);
    if (!m) continue;
    if (m[1] === date) return { slate: parseSnapshot(code), from: `commit ${h.slice(0, 7)}` };
    if (m[1] < date) break;   // newest first: past the night
  }
  return null;
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

// Finals only: a game still in progress has no result.
async function finals(date) {
  const sb = await getJson(`${ESPN}scoreboard?dates=${date.replace(/-/g, '')}`);
  const out = new Map();
  for (const e of sb.events || []) {
    const c = e.competitions[0];
    if (!c.status.type.completed) continue;
    const h = c.competitors.find(x => x.homeAway === 'home'), a = c.competitors.find(x => x.homeAway === 'away');
    out.set(String(e.id), { homeScore: +h.score, awayScore: +a.score });
  }
  return out;
}

function score(list) {
  const n = list.length;
  if (!n) return '—';
  let won = 0, b = 0;
  for (const { p, y } of list) { if ((p >= 0.5) === (y === 1)) won++; b += (p - y) ** 2; }
  return `${won}/${n} winners, Brier ${(b / n).toFixed(3)}`;
}

async function main() {
  const ctx = loadContext();
  const snap = snapshotFor(DATE);
  const results = await finals(DATE);
  const rows = new Map((ctx.SEASON_LEDGER || []).filter(r => r.date === DATE).map(r => [String(r.id), r]));
  if (!snap) {
    // No snapshot to rebuild from (never committed, or overwritten): the ledger's recorded rows still score.
    console.log(`Injury view ${DATE}: no slate snapshot for that night, so no rebuild`);
    const rec = [...rows.values()].map(row => {
      const res = results.get(String(row.id)) || row.result;
      return { row, y: res && res.homeScore != null ? (res.homeScore > res.awayScore ? 1 : 0) : null };
    }).filter(x => x.y != null);
    if (!rec.length) return;
    const col = (get) => score(rec.map(x => ({ p: get(x.row), y: x.y })).filter(x => x.p != null));
    console.log(`  recorded before tip (${rec.length} games, from the ledger):`);
    console.log(`    pOurs (feed only)    ${col(r => r.pOurs)}`);
    console.log(`    pOursReport          ${col(r => r.pOursReport)}`);
    console.log(`    market               ${col(r => r.pMarket)}`);
    console.log(`    replay late          ${col(r => r.late && r.late.pNow)}`);
    return;
  }
  const S = snap.slate;
  const fetched = new Date(S.fetchedAt).getTime();
  const lead = LEAD_MIN * 60e3;

  // One overlaid slate per report.
  const overlays = new Map();
  async function overlay(cutoff) {
    const rep = await reportBefore(cutoff, Date.now());
    if (!overlays.has(rep.name)) overlays.set(rep.name, { name: rep.name, ...ctx.seasonApplyInjuryReport(S, rep) });
    return overlays.get(rep.name);
  }

  const games = [];
  for (const g of [...S.games].sort((a, b) => a.tip < b.tip ? -1 : a.tip > b.tip ? 1 : 0)) {
    const tip = new Date(g.tip).getTime();
    const feed = ctx.projectSeasonGame(g, S);
    let ov = null, withRep = null, err = null;
    try { ov = await overlay(tip - lead); withRep = ctx.projectSeasonGame(g, ov.slate); } catch (e) { err = e.message; }
    const m = g.market || {}, row = rows.get(String(g.id));
    const pMarket = row && row.pMarket != null ? row.pMarket : m.mlHome != null && m.mlAway != null ? ctx._noVigHome(m.mlHome, m.mlAway) : null;
    const res = results.get(String(g.id)) || (row && row.result) || null;
    games.push({ g, tip, feed: feed.pHome, rep: withRep ? withRep.pHome : null, report: ov ? ov.name : null, err,
      changes: ov ? ov.changes.filter(c => c.team === g.home || c.team === g.away) : [],
      pMarket, nbai: g.external && g.external.nbai ? g.external.nbai.pHome : null, row,
      y: res ? (res.homeScore > res.awayScore ? 1 : 0) : null, res, before: fetched < tip });
  }

  const scored = games.filter(x => x.y != null && x.before);
  // Ledger rows were recorded before tip whatever the snapshot's time, so they score even when
  // the snapshot on disk was re-fetched after the games tipped.
  const recorded = games.filter(x => x.y != null && x.row);
  const col = (list, get) => score(list.map(x => ({ p: get(x), y: x.y })).filter(x => x.p != null));
  console.log(`Injury view ${DATE}: ${games.length} games · snapshot ${snap.from}, fetched ${etTime(fetched)} ET${S.injuryReport ? ` (already over ${S.injuryReport.name})` : ''} · report ${LEAD_MIN}+ min before each tip`);
  console.log(`  model, feed only      ${col(scored, x => x.feed)}`);
  console.log(`  model, injury report  ${col(scored, x => x.rep)}`);
  console.log(`  market                ${col(scored, x => x.pMarket)}`);
  console.log(`  NB.AI                 ${col(scored, x => x.nbai)}`);
  if (recorded.length) {
    console.log(`  recorded before tip (${recorded.length} games, from the ledger):`);
    console.log(`    pOurs (feed only)    ${col(recorded, x => x.row.pOurs)}`);
    console.log(`    pOursReport          ${col(recorded, x => x.row.pOursReport)}`);
    console.log(`    market               ${col(recorded, x => x.row.pMarket)}`);
    console.log(`    replay late          ${col(recorded, x => x.row.late && x.row.late.pNow)}`);
  }
  const open = games.filter(x => x.y == null).length, late = games.filter(x => !x.before).length;
  if (open || late) console.log(`  not scored above: ${open ? `${open} without a final` : ''}${open && late ? ', ' : ''}${late ? `${late} tipped before the snapshot was fetched` : ''}`);
  if (BRIEF) return;

  const side = (g, p) => p == null ? '   —    ' : `${(p >= 0.5 ? g.home : g.away).padEnd(4)}${pct(Math.max(p, 1 - p))}`;
  console.log('\n  tip       game          feed only   report      market      NB.AI       final');
  for (const x of games) {
    const fin = x.res ? `${x.g.away} ${x.res.awayScore}-${x.res.homeScore} ${x.g.home} (${x.y ? x.g.home : x.g.away})` : 'no final';
    console.log(`  ${etTime(x.tip).padEnd(9)} ${(x.g.away + ' @ ' + x.g.home).padEnd(12)}  ${side(x.g, x.feed)}  ${side(x.g, x.rep)}  ${side(x.g, x.pMarket)}  ${side(x.g, x.nbai)}  ${fin}${x.before ? '' : ' [after snapshot]'}`);
    if (x.err) console.log(`            report unavailable: ${x.err}`);
    else if (x.changes.length) console.log(`            ${x.report}: ${x.changes.map(c => `${c.team} ${c.name} ${c.from} → ${c.to}`).join(', ')}`);
  }

  // Tickets as of the first tip, on the report-adjusted slate.
  const first = Math.min(...games.map(x => x.tip));
  const now = first - 60e3;
  let ov;
  try { ov = await overlay(first - lead); } catch (e) { console.log(`\n  tickets: report unavailable (${e.message})`); return; }
  const boxes = new Map();
  async function box(id) {
    if (!boxes.has(id)) boxes.set(id, ctx.adaptEspnBox(await getJson(`${ESPN}summary?event=${id}`)));
    return boxes.get(id);
  }
  async function grade(l) {
    const res = results.get(String(l.game));
    if (!res) return 'open';
    if (l.type === 'ml') return (l.side === 'home') === (res.homeScore > res.awayScore) ? 'hit' : 'miss';
    const p = Object.values(await box(l.game)).flat().find(a => a.id === String(l.player));
    if (!p || !p.played) return 'void';
    const v = l.stat === 'pra' ? p.line.pts + p.line.reb + p.line.ast : p.line[l.stat];
    return `${v > l.line ? 'hit' : 'miss'} ${v}`;
  }
  console.log(`\n  tickets as of the first tip (${etTime(first)} ET), over ${ov.name}, snapshot odds:`);
  if (fetched >= first) console.log(`  (snapshot fetched after the first tip: statuses and prices are post-tip; the recorded tickets are in the pitch ledgers)`);
  const p1 = ctx.buildPitches(ov.slate, { now }), p2 = ctx.buildPitch2(ov.slate, { now });
  for (const t of [...p1.tickets, p2.ticket]) {
    if (t.status !== 'pitched') { console.log(`  ${t.recipe.padEnd(10)} no ticket — ${t.reason}`); continue; }
    const legs = [];
    for (const l of t.legs) {
      const what = l.type === 'ml' ? `${l.team} ${l.odds > 0 ? '+' : ''}${l.odds}` : `${l.name} ${l.stat} o${l.line}`;
      legs.push(`${what} (${pct(l.p).trim()}) ${await grade(l)}`);
    }
    console.log(`  ${t.recipe.padEnd(10)} ${pct(t.p).trim()}${t.price != null ? `, price ${t.price > 0 ? '+' : ''}${t.price}` : ''} — ${legs.join(' · ')}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
