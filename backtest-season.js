#!/usr/bin/env node
// ============================================================
// backtest-season.js — replay 2026-27 games through the season engine
// ============================================================
// For every completed game since opening night, rebuild what the model
// would have known that morning and score its forecast against the
// final score and DraftKings' line and total (ESPN pickcenter):
//
//   team ratings   last season's prior (committed slate snapshot) blended
//                  with this season's results BEFORE the game date
//   players        roster = everyone in the team's box scores so far;
//                  season line from box scores BEFORE the game date
//   availability   who actually played (default; a mild advantage over the
//                  closing line) or who played the team's previous game
//                  (--lineups last-game; no information from tonight)
//   rest           from the schedule
//
// Variants:
//   ratings        current engine, roster, aging and fit adjustments off
//   no fit         current engine, roster-fit (chemistry) adjustment off
//   no aging       current engine, aging step off
//   engine         current engine (working tree)
//   <git ref>      the engine as of a commit, via --compare <ref>
//
//   node backtest-season.js [--from 2026-10-20] [--to 2026-11-01] [--compare <ref>]
//                           [--lineups hindsight|last-game] [--games]
//
// --lineups last-game removes the hindsight advantage: a player counts as
// available only if he played in his team's previous game.
//
// ESPN responses for completed games are cached under .cache/espn-nba/.
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const CACHE = path.join(__dirname, '.cache/espn-nba');
const SCOREBOARD = (d) => `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${d}`;
const SUMMARY = (id) => `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${id}`;
const SEASON_FILES = ['js/season/data/season-constants.js', 'js/season/data/player-priors.js', 'js/season/data/chemistry-fit.js', 'js/season/data/aging-fit.js', 'js/season/adapters.js',
  'js/season/engine.js', 'js/season/props.js', 'js/season/ensemble.js'];

const argv = process.argv.slice(2);
const arg = (name, dflt) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : dflt; };
const FROM = arg('--from', '2026-10-20');
const TO = arg('--to', null);
const COMPARE = arg('--compare', null);
const SHOW_GAMES = argv.includes('--games');
const LINEUPS = arg('--lineups', 'hindsight');     // hindsight | last-game

const toVar = (code) => code.replace(/^(const|let) /gm, 'var ');
function makeContext(readFile) {
  const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error });
  for (const rel of SEASON_FILES) {
    const code = readFile(rel);
    if (code != null) vm.runInContext(toVar(code), ctx);
  }
  return ctx;
}
const fromWorkingTree = (rel) => fs.existsSync(path.join(__dirname, rel)) ? fs.readFileSync(path.join(__dirname, rel), 'utf8') : null;
const fromGit = (ref) => (rel) => { try { return execSync(`git show ${ref}:${rel}`, { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] }).toString(); } catch (e) { return null; } };

function ymd(d) { return d.toISOString().slice(0, 10); }
function todayEt() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
function addDays(s, n) { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return ymd(d); }

async function cachedJson(file, url) {
  const f = path.join(CACHE, file);
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  const res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const j = await res.json();
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(f, JSON.stringify(j));
  return j;
}

// ── parse ESPN ──────────────────────────────────────────────
const made = (s) => { const [m, a] = String(s || '0-0').split('-').map(Number); return [m || 0, a || 0]; };
function parseBox(summary) {
  const out = {};
  for (const team of summary.boxscore.players || []) {
    const abbr = team.team.abbreviation;
    const st = team.statistics[0];
    const idx = Object.fromEntries(st.names.map((n, i) => [n, i]));
    out[abbr] = st.athletes.map(a => {
      const s = a.stats || [];
      const min = parseFloat(s[idx.MIN]) || 0;
      const [fgm, fga] = made(s[idx.FG]), [tpm, tpa] = made(s[idx['3PT']]), [ftm, fta] = made(s[idx.FT]);
      return {
        id: String(a.athlete.id), name: a.athlete.displayName, starter: !!a.starter,
        played: !a.didNotPlay && min > 0, reason: a.reason || null,
        line: { min, pts: +s[idx.PTS] || 0, reb: +s[idx.REB] || 0, ast: +s[idx.AST] || 0, tpm, stl: +s[idx.STL] || 0,
          blk: +s[idx.BLK] || 0, to: +s[idx.TO] || 0, fgm, fga, ftm, fta, tpa },
      };
    });
  }
  return out;
}
function parseMarket(summary, home, away) {
  const pc = (summary.pickcenter || []).find(p => p.provider) || null;
  if (!pc) return null;
  // Top-level fields are the closing line (they equal moneyline.*.close).
  const mlHome = pc.homeTeamOdds && pc.homeTeamOdds.moneyLine, mlAway = pc.awayTeamOdds && pc.awayTeamOdds.moneyLine;
  // Read the spread from "ABBR -x.5" so the sign cannot be misread.
  let spreadHome = null;
  const m = /^([A-Z]+)\s+([-+]?\d+(?:\.\d+)?)$/.exec((pc.details || '').trim());
  if (m) spreadHome = m[1] === home ? +m[2] : m[1] === away ? -m[2] : null;
  else if (/^EVEN|PK/i.test(pc.details || '')) spreadHome = 0;
  const num = (s) => { if (s == null) return null; const v = parseFloat(String(s).replace(/^[ou]/, '')); return isNaN(v) ? null : v; };
  const open = {
    mlHome: num(pc.moneyline && pc.moneyline.home && pc.moneyline.home.open && pc.moneyline.home.open.odds),
    mlAway: num(pc.moneyline && pc.moneyline.away && pc.moneyline.away.open && pc.moneyline.away.open.odds),
    spreadHome: num(pc.pointSpread && pc.pointSpread.home && pc.pointSpread.home.open && pc.pointSpread.home.open.line),
    total: num(pc.total && pc.total.over && pc.total.over.open && pc.total.over.open.line),
  };
  return { mlHome: mlHome ?? null, mlAway: mlAway ?? null, spreadHome, total: pc.overUnder ?? null, book: pc.provider.name, open };
}

// ── rebuild a slate for one date ────────────────────────────
function restFor(abbr, date, games) {
  const prev = games.filter(g => g.date < date && (g.home === abbr || g.away === abbr)).map(g => g.date).sort();
  const last = prev[prev.length - 1];
  const restDays = last ? Math.round((new Date(date) - new Date(last)) / 864e5) - 1 : 3;
  const in4 = prev.filter(d => (new Date(date) - new Date(d)) / 864e5 <= 3).length;   // games in the 3 days before → with today, N in 4
  return { restDays, backToBack: restDays === 0, threeInFour: in4 >= 2, schedulePoints: 0 };
}

function buildSlate(ctx, snapshot, date, games) {
  const before = games.filter(g => g.date < date);
  const teams = {};
  for (const [abbr, snapTeam] of Object.entries(snapshot.teams)) {
    const tg = before.filter(g => g.home === abbr || g.away === abbr);
    const pf = tg.reduce((s, g) => s + (g.home === abbr ? g.homeScore : g.awayScore), 0);
    const pa = tg.reduce((s, g) => s + (g.home === abbr ? g.awayScore : g.homeScore), 0);
    // Roster: everyone in this team's box scores up to and including today.
    const seen = new Map();
    for (const g of games.filter(x => x.date <= date && (x.home === abbr || x.away === abbr))) {
      for (const p of g.box[abbr] || []) if (!seen.has(p.id)) seen.set(p.id, p.name);
    }
    const players = [...seen.entries()].map(([id, name]) => {
      const rows = tg.map(g => (g.box[abbr] || []).find(p => p.id === id)).filter(p => p && p.played);
      const n = rows.length;
      const avg = {};
      ctx.NBAI_STAT_KEYS.forEach(k => { avg[k] = n ? rows.reduce((s, r) => s + r.line[k], 0) / n : 0; });
      return { id, name, pos: '', status: 'Available', injury: null, availability: 1, projMin: avg.min, starter: false,
        depthRank: 99, avg, seasonGames: n, games: n, h2h: null, recent: null };
    });
    teams[abbr] = {
      ...snapTeam,
      current: { ppg: tg.length ? pf / tg.length : null, papg: tg.length ? pa / tg.length : null, games: tg.length },
      rest: restFor(abbr, date, games),
      players,
    };
  }
  return { source: 'backtest', date, league: snapshot.league, teams, games: [] };
}

// hindsight: available = actually played tonight.
// last-game:  available = played in the team's previous game (everyone in
//             the team's opener) — no information from tonight's box score.
function withLineup(slate, game, games, mode) {
  const set = (abbr) => {
    let avail;
    if (mode === 'last-game') {
      const prev = games.filter(g => g.date < game.date && (g.home === abbr || g.away === abbr)).sort((a, b) => a.date < b.date ? -1 : 1).pop();
      avail = prev ? new Set((prev.box[abbr] || []).filter(p => p.played).map(p => p.id)) : null;
    } else {
      avail = new Set((game.box[abbr] || []).filter(p => p.played).map(p => p.id));
    }
    return { ...slate.teams[abbr], players: slate.teams[abbr].players.map(p => {
      const a = avail ? (avail.has(p.id) ? 1 : 0) : 1;
      return { ...p, availability: a, status: a ? 'Available' : 'Out' };
    }) };
  };
  return { ...slate, teams: { ...slate.teams, [game.home]: set(game.home), [game.away]: set(game.away) } };
}

// ── scoring ─────────────────────────────────────────────────
function score(rows, key) {
  const r = rows.filter(x => x[key] && x[key].p != null);
  const n = r.length;
  if (!n) return null;
  let correct = 0, brier = 0, ll = 0, mae = 0, bias = 0, maeN = 0, vsMkt = 0, vsMktN = 0;
  for (const x of r) {
    const p = Math.min(0.999, Math.max(0.001, x[key].p)), y = x.homeWon ? 1 : 0;
    if ((p > 0.5) === !!y) correct++;
    brier += (p - y) ** 2;
    ll += -(y * Math.log(p) + (1 - y) * Math.log(1 - p));
    if (x[key].margin != null) { mae += Math.abs(x[key].margin - x.margin); bias += x[key].margin - x.margin; maeN++; }
    if (x[key].margin != null && x.market && x.market.spreadHome != null) { vsMkt += Math.abs(x[key].margin + x.market.spreadHome); vsMktN++; }
  }
  return { n, acc: correct / n, brier: brier / n, logLoss: ll / n, mae: maeN ? mae / maeN : null, bias: maeN ? bias / maeN : null,
    vsMarket: vsMktN ? vsMkt / vsMktN : null };
}

async function main() {
  const to = TO || addDays(todayEt(), -1);
  const snapCode = fromWorkingTree('js/season/data/slate-snapshot.js');
  const snapCtx = vm.createContext({});
  vm.runInContext(toVar(snapCode), snapCtx);
  const snapshot = snapCtx.SEASON_SLATE_SNAPSHOT;
  if (Object.keys(snapshot.teams).length !== 30) throw new Error(`snapshot has ${Object.keys(snapshot.teams).length} teams; the backtest needs all 30 priors`);

  // Load games.
  const games = [];
  for (let d = FROM; d <= to; d = addDays(d, 1)) {
    const sb = await cachedJson(`scoreboard-${d}.json`, SCOREBOARD(d.replace(/-/g, '')));
    for (const e of sb.events || []) {
      if (!e.status || !e.status.type || !e.status.type.completed) continue;
      if (e.season && e.season.type !== 2) continue;
      const comp = e.competitions[0];
      const home = comp.competitors.find(c => c.homeAway === 'home'), away = comp.competitors.find(c => c.homeAway === 'away');
      games.push({ id: e.id, date: d, tip: e.date, home: home.team.abbreviation, away: away.team.abbreviation,
        homeScore: +home.score, awayScore: +away.score });
    }
  }
  process.stdout.write(`Games ${FROM} → ${to}: ${games.length}; fetching box scores`);
  for (const g of games) {
    const s = await cachedJson(`summary-${g.id}.json`, SUMMARY(g.id));
    g.box = parseBox(s);
    g.market = parseMarket(s, g.home, g.away);
    process.stdout.write('.');
  }
  console.log();
  const unknown = [...new Set(games.flatMap(g => [g.home, g.away]))].filter(t => !snapshot.teams[t]);
  if (unknown.length) throw new Error(`teams missing from snapshot: ${unknown.join(',')}`);

  // Variants.
  const engineCtx = makeContext(fromWorkingTree);
  const ratingsCtx = makeContext(fromWorkingTree);
  vm.runInContext('SEASON_IMPACT.teamCap = 0; SEASON_IMPACT.fitCap = 0; SEASON_IMPACT.agingCap = 0;', ratingsCtx);
  const noFitCtx = makeContext(fromWorkingTree);
  vm.runInContext('SEASON_IMPACT.fitCap = 0;', noFitCtx);
  const noAgingCtx = makeContext(fromWorkingTree);
  vm.runInContext('SEASON_IMPACT.agingCap = 0;', noAgingCtx);
  const variants = [['ratings', ratingsCtx], ['no fit', noFitCtx], ['no aging', noAgingCtx], ['engine', engineCtx]];
  if (COMPARE) variants.push([COMPARE, makeContext(fromGit(COMPARE))]);

  const rows = [];
  const dates = [...new Set(games.map(g => g.date))].sort();
  for (const date of dates) {
    const slates = new Map(variants.map(([name, ctx]) => [name, buildSlate(ctx, snapshot, date, games)]));
    for (const g of games.filter(x => x.date === date)) {
      const row = { id: g.id, date, home: g.home, away: g.away, margin: g.homeScore - g.awayScore, homeWon: g.homeScore > g.awayScore, market: g.market };
      for (const [name, ctx] of variants) {
        const slate = withLineup(slates.get(name), g, games, LINEUPS);
        const proj = ctx.projectSeasonGame({ id: g.id, home: g.home, away: g.away, market: g.market, external: null }, slate);
        row[name] = { p: proj.pHome, margin: proj.margin, total: proj.total };
      }
      row.total = g.homeScore + g.awayScore;
      const m = g.market;
      const marketRow = (ml1, ml2, spread, total) => {
        const pMl = ml1 != null && ml2 != null ? engineCtx.noVigHomeProb(ml1, ml2) : null;
        return { p: pMl != null ? pMl : (spread != null ? engineCtx.spreadToHomeProb(spread) : null), margin: spread != null ? -spread : null,
          total: total != null ? total : null };
      };
      if (m) {
        row.market_ = marketRow(m.mlHome, m.mlAway, m.spreadHome, m.total);
        if (m.open) row.open_ = marketRow(m.open.mlHome, m.open.mlAway, m.open.spreadHome, m.open.total);
      }
      row.home58 = { p: 0.58, margin: null, total: null };
      rows.push(row);
    }
  }

  const keys = [...variants.map(v => v[0]), 'open_', 'market_', 'home58'];
  const label = { open_: 'DK opening line', market_: 'DK closing line', home58: 'always home 58%' };
  console.log(`Lineups: ${LINEUPS}`);
  const fmt = (x, d = 3) => x == null ? '   —  ' : x.toFixed(d);
  const table = (subset, title) => {
    console.log(`\n${title} (n=${subset.length})`);
    console.log('  variant              acc     brier   logloss  margin MAE  bias    |vs market spread|');
    for (const k of keys) {
      const s = score(subset, k);
      if (!s) continue;
      console.log(`  ${(label[k] || k).padEnd(20)} ${(s.acc * 100).toFixed(1).padStart(5)}%  ${fmt(s.brier)}   ${fmt(s.logLoss)}   ${fmt(s.mae, 2).padStart(6)}     ${fmt(s.bias, 2).padStart(5)}   ${s.vsMarket == null ? '—' : s.vsMarket.toFixed(2)}`);
    }
  };
  const withMarket = rows.filter(r => r.market_ && r.market_.p != null);
  console.log(`Market lines found for ${withMarket.length}/${rows.length} games`);
  table(rows, 'All games');
  const mid = dates[Math.floor(dates.length / 2)];
  table(rows.filter(r => r.date < mid), `Early (${dates[0]} – ${addDays(mid, -1)})`);
  table(rows.filter(r => r.date >= mid), `Later (${mid} – ${dates[dates.length - 1]})`);

  // Props: per-minute rates only. Each player who played 10+ minutes is
  // projected at his ACTUAL minutes, so the error isolates the rate model
  // (prior blend, redistribution, pace, opponent) from minutes forecasting.
  const propVariants = variants.filter(([name]) => name !== 'ratings');
  const propErr = Object.fromEntries(propVariants.map(([n]) => [n, { pts: [], reb: [], ast: [] }]));
  let propPairs = 0;
  for (const date of dates) {
    const slates = new Map(propVariants.map(([name, ctx]) => [name, buildSlate(ctx, snapshot, date, games)]));
    for (const g of games.filter(x => x.date === date)) {
      for (const [teamAbbr, oppAbbr] of [[g.home, g.away], [g.away, g.home]]) {
        for (const actual of (g.box[teamAbbr] || []).filter(p => p.played && p.line.min >= 10)) {
          const proj = {};
          for (const [name, ctx] of propVariants) {
            const slate = withLineup(slates.get(name), g, games, 'hindsight');
            const team = slate.teams[teamAbbr], opp = slate.teams[oppAbbr];
            const player = team.players.find(p => p.id === actual.id);
            proj[name] = player ? ctx.projectPlayerProps(player, team, opp, slate, { minutesOverride: { [actual.id]: actual.line.min }, availabilityOverride: { [actual.id]: 1 } }) : null;
          }
          if (propVariants.some(([n]) => !proj[n])) continue;   // compare on players every variant can project
          propPairs++;
          for (const [n] of propVariants) for (const s of ['pts', 'reb', 'ast']) propErr[n][s].push(Math.abs(proj[n][s] - actual.line[s]));
        }
      }
    }
  }
  const avgOf = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  console.log(`\nProps at actual minutes, players with 10+ min (n=${propPairs} player-games projectable by every variant)`);
  for (const [n] of propVariants) console.log(`  ${n.padEnd(12)} MAE  pts ${avgOf(propErr[n].pts).toFixed(2)}  reb ${avgOf(propErr[n].reb).toFixed(2)}  ast ${avgOf(propErr[n].ast).toFixed(2)}`);

  // Paired comparison: per-game Brier difference, engine minus each benchmark.
  // |mean| > 2 SE is the bar for "a real difference" on this sample.
  console.log('\nPaired Brier difference, engine − benchmark (negative = engine better)');
  for (const k of keys.filter(k => k !== 'engine')) {
    const pairs = rows.filter(r => r.engine && r[k] && r[k].p != null).map(r => {
      const y = r.homeWon ? 1 : 0;
      return (r.engine.p - y) ** 2 - (r[k].p - y) ** 2;
    });
    if (pairs.length < 10) continue;
    const mean = pairs.reduce((a, b) => a + b) / pairs.length;
    const sd = Math.sqrt(pairs.reduce((s, d) => s + (d - mean) ** 2, 0) / (pairs.length - 1));
    const se = sd / Math.sqrt(pairs.length);
    console.log(`  vs ${(label[k] || k).padEnd(18)} ${mean >= 0 ? '+' : ''}${mean.toFixed(4)} ± ${se.toFixed(4)} (n=${pairs.length}, ${Math.abs(mean) > 2 * se ? 'beyond 2 SE' : 'within noise'})`);
  }

  // Totals: projected game total against the final and DraftKings' total.
  // Scored on games with a closing total; a model missing a total on some of
  // them shows its own n. O/U is each model's side of the closing total;
  // pushes are skipped.
  const totalRows = rows.filter(r => r.market_ && r.market_.total != null);
  const totalKeys = keys.filter(k => totalRows.some(r => r[k] && r[k].total != null));
  console.log(`\nTotals (n=${totalRows.length} games with a closing total)`);
  if (totalRows.length) console.log('  variant              MAE     bias    |vs closing total|  O/U vs closing');
  for (const k of totalRows.length ? totalKeys : []) {
    const kRows = totalRows.filter(r => r[k] && r[k].total != null);
    const err = kRows.map(r => r[k].total - r.total);
    const vsClose = kRows.map(r => Math.abs(r[k].total - r.market_.total));
    let w = 0, l = 0;
    if (k !== 'market_' && k !== 'open_') {
      for (const r of kRows) {
        const side = Math.sign(r[k].total - r.market_.total), result = Math.sign(r.total - r.market_.total);
        if (side && result) side === result ? w++ : l++;
      }
    }
    console.log(`  ${(label[k] || k).padEnd(20)} ${avgOf(err.map(Math.abs)).toFixed(2).padStart(5)}  ${(avgOf(err) >= 0 ? '+' : '') + avgOf(err).toFixed(2)}   ${avgOf(vsClose).toFixed(2).padStart(6)}             ${w + l ? `${w}-${l} (${(w / (w + l) * 100).toFixed(1)}%)` : '—'}${kRows.length < totalRows.length ? `  (n=${kRows.length})` : ''}`);
  }
  console.log('\nPaired total abs error, engine − benchmark (negative = engine better)');
  for (const k of totalKeys.filter(k => k !== 'engine')) {
    const pairs = totalRows.filter(r => r[k] && r[k].total != null)
      .map(r => Math.abs(r.engine.total - r.total) - Math.abs(r[k].total - r.total));
    if (pairs.length < 10) continue;
    const mean = avgOf(pairs);
    const se = Math.sqrt(pairs.reduce((s, d) => s + (d - mean) ** 2, 0) / (pairs.length - 1)) / Math.sqrt(pairs.length);
    console.log(`  vs ${(label[k] || k).padEnd(18)} ${mean >= 0 ? '+' : ''}${mean.toFixed(2)} ± ${se.toFixed(2)} pts (n=${pairs.length}, ${Math.abs(mean) > 2 * se ? 'beyond 2 SE' : 'within noise'})`);
  }

  if (SHOW_GAMES) {
    console.log('\ngame                     final   ' + keys.map(k => (label[k] || k).slice(0, 10).padStart(11)).join('') + '   total  engine  DK close');
    for (const r of rows) console.log(`${r.date} ${r.away.padStart(4)} @ ${r.home.padEnd(4)} ${String(r.margin).padStart(5)}   ` +
      keys.map(k => r[k] && r[k].margin != null ? r[k].margin.toFixed(1).padStart(11) : (r[k] && r[k].p != null ? (r[k].p * 100).toFixed(0).padStart(10) + '%' : '          —')).join('') +
      `   ${String(r.total).padStart(5)}  ${r.engine.total.toFixed(1).padStart(6)}  ${r.market_ && r.market_.total != null ? String(r.market_.total).padStart(8) : '       —'}`);
  }
}

main().catch(e => { console.error('backtest failed:', e.message); process.exit(1); });
