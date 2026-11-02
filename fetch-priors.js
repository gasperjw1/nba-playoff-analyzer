#!/usr/bin/env node
// ============================================================
// fetch-priors.js — build js/season/data/player-priors.js
// ============================================================
// Player priors for the 2026-27 season model, from the two previous
// regular seasons:
//
//   box lines   ESPN byathlete — official per-game averages, keyed by
//               ESPN id (the id the NB.AI feed uses). Feeds props.
//   impact      Basketball-Reference advanced table — BPM/OBPM/DBPM
//               plus usage/assist/rebound rates (the chemistry work
//               needs the rates). Feeds player value.
//   team splits 2025-26 games per team; ESPN game logs for players
//               traded mid-season (All-Star, Cup Championship and
//               play-in rows excluded), cross-checked against
//               Basketball-Reference's per-team rows.
//
// It also re-derives, every run, the numbers the engine's constants
// rest on — replacement-level BPM, the BPM → points calibration, and
// a box-score → BPM fit used for current-season samples — and prints
// them so a change in the underlying data is visible.
//
//   node fetch-priors.js          fetch, validate, write
//   node fetch-priors.js --dry    fetch + validate, write nothing
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const OUT_PATH = path.join(__dirname, 'js/season/data/player-priors.js');
const ESPN_BULK = (season) => 'https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/statistics/byathlete' +
  `?region=us&lang=en&contentorigin=espn&isqualified=false&page=1&limit=1000&season=${season}&seasontype=2&sort=general.avgMinutes:desc`;
const ESPN_GAMELOG = (id, season) => `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${id}/gamelog?season=${season}`;
const ESPN_STANDINGS = (season) => `https://site.web.api.espn.com/apis/v2/sports/basketball/nba/standings?season=${season}&seasontype=2&type=0&level=1`;
const BREF_ADVANCED = (season) => `https://www.basketball-reference.com/leagues/NBA_${season}_advanced.html`;
const BREF_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const BREF_DELAY_MS = 4000;                // Basketball-Reference allows ~20 requests/minute

// ESPN and Basketball-Reference both label a season by the year it ends in.
const SEASONS = [
  { key: '26', year: 2026, label: '2025-26' },
  { key: '25', year: 2025, label: '2024-25' },
];
const SPLIT_SEASON = SEASONS[0];
const TARGET_YEAR = SEASONS[0].year + 1;   // the season being projected (2026-27 → 2027)
const TEAM_GAMES = 82;
const EXHIBITION_NOTE = /All-Star|Cup Championship/i;
const BREF_TEAM = { BRK: 'BKN', CHO: 'CHA', GSW: 'GS', NOP: 'NO', NYK: 'NY', PHO: 'PHX', SAS: 'SA', UTA: 'UTAH', WAS: 'WSH' };

const DRY = process.argv.includes('--dry');

// Same order as the NB.AI feed's seasonAverage / NBAI_STAT_KEYS.
const BOX_FIELDS = [
  ['min', 'general', 'avgMinutes'],
  ['pts', 'offensive', 'avgPoints'],
  ['reb', 'general', 'avgRebounds'],
  ['ast', 'offensive', 'avgAssists'],
  ['tpm', 'offensive', 'avgThreePointFieldGoalsMade'],
  ['stl', 'defensive', 'avgSteals'],
  ['blk', 'defensive', 'avgBlocks'],
  ['to', 'offensive', 'avgTurnovers'],
  ['fgm', 'offensive', 'avgFieldGoalsMade'],
  ['fga', 'offensive', 'avgFieldGoalsAttempted'],
  ['ftm', 'offensive', 'avgFreeThrowsMade'],
  ['fta', 'offensive', 'avgFreeThrowsAttempted'],
  ['tpa', 'offensive', 'avgThreePointFieldGoalsAttempted'],
];
const BOX_KEYS = BOX_FIELDS.map(f => f[0]);
// Totals used to prove each average was read from the right column.
const TOTAL_CHECKS = [['pts', 'offensive', 'points'], ['ast', 'offensive', 'assists'], ['fga', 'offensive', 'fieldGoalsAttempted'],
  ['stl', 'defensive', 'steals'], ['blk', 'defensive', 'blocks'], ['tpa', 'offensive', 'threePointFieldGoalsAttempted']];
// Advanced row stored per season (percentages as BRef prints them).
const ADV_FIELDS = ['bpm', 'obpm', 'dbpm', 'mp', 'usg_pct', 'ast_pct', 'trb_pct', 'tov_pct', 'ts_pct', 'fg3a_per_fga_pct'];
// Box-score → BPM regression features (per 36 minutes).
const FIT_FEATURES = ['pts', 'reb', 'ast', 'stl', 'blk', 'to', 'fga', 'fta', 'tpm'];

const notes = [];
const note = (msg) => { notes.push(msg); };
const round2 = (x) => Math.round(x * 100) / 100;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function loadEngineContext() {
  const toVar = (code) => code.replace(/^(const|let) /gm, 'var ');
  const ctx = vm.createContext({ console, Math, Object, Array, JSON, Number, String, Set, Map });
  for (const rel of ['js/season/data/season-constants.js', 'js/season/adapters.js', 'js/season/engine.js', 'js/season/data/slate-snapshot.js']) {
    const file = path.join(__dirname, rel);
    if (fs.existsSync(file)) vm.runInContext(toVar(fs.readFileSync(file, 'utf8')), ctx);
  }
  return ctx;
}

async function fetchWithRetry(url, opts, tries = 2) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      if (i === tries - 1) throw new Error(`${url} → ${e.message}`);
      await sleep(2000);
    }
  }
}
const getJson = async (url) => (await fetchWithRetry(url, { headers: { accept: 'application/json' } })).json();
const getText = async (url) => (await fetchWithRetry(url, { headers: { 'user-agent': BREF_UA, accept: 'text/html' } })).text();

// ── ESPN box lines ─────────────────────────────────────────
async function fetchEspnSeason(season) {
  const doc = await getJson(ESPN_BULK(season.year));
  if (!doc.requestedSeason || doc.requestedSeason.displayName !== season.label) {
    throw new Error(`ESPN season=${season.year} returned "${doc.requestedSeason && doc.requestedSeason.displayName}", expected ${season.label}`);
  }
  if (doc.pagination && doc.pagination.pages > 1) throw new Error(`ESPN ${season.label}: ${doc.pagination.pages} pages — raise limit`);
  const col = {};
  doc.categories.forEach((c, ci) => c.names.forEach((n, ni) => { col[`${c.name}.${n}`] = [ci, ni]; }));
  const read = (a, cat, name) => {
    const at = col[`${cat}.${name}`];
    if (!at) throw new Error(`ESPN bulk: no column ${cat}.${name}`);
    const v = a.categories[at[0]].values[at[1]];
    return typeof v === 'number' ? v : Number(v) || 0;
  };
  const rows = new Map();
  let mismatches = 0;
  for (const a of doc.athletes) {
    const id = String(a.athlete.id);
    if (rows.has(id)) { note(`ESPN ${season.label}: duplicate athlete ${id}`); continue; }
    const g = read(a, 'general', 'gamesPlayed');
    if (!g) continue;
    const line = BOX_FIELDS.map(([, cat, name]) => read(a, cat, name));
    for (const [key, cat, name] of TOTAL_CHECKS) {
      const avg = line[BOX_KEYS.indexOf(key)], tot = read(a, cat, name);
      if (Math.abs(tot / g - avg) > 0.06) { mismatches++; note(`ESPN ${season.label} ${a.athlete.displayName}: ${key} avg ${avg} vs total/g ${(tot / g).toFixed(2)}`); }
    }
    rows.set(id, { id, name: a.athlete.displayName, g, line, team: a.athlete.teamShortName || null,
      teams: (a.athlete.teams || []).map(t => t.abbreviation).filter(Boolean) });
  }
  console.log(`  ESPN ${season.label}: ${rows.size} players, average/total mismatches ${mismatches}`);
  return rows;
}

async function gamelogSplit(id) {
  const log = await getJson(ESPN_GAMELOG(id, SPLIT_SEASON.year));
  // Exact match: play-in teams get a "2025-26 Play In Regular Season" block,
  // listed first, which official totals exclude.
  const rs = (log.seasonTypes || []).find(s => /^\d{4}-\d{2} Regular Season$/.test((s.displayName || '').trim()));
  if (!rs) throw new Error('no regular-season block');
  const counts = {};
  let excluded = 0;
  for (const cat of rs.categories || []) for (const e of cat.events || []) {
    const ev = log.events[e.eventId];
    if (!ev) continue;
    if (EXHIBITION_NOTE.test(ev.eventNote || '')) { excluded++; continue; }
    const t = ev.team && ev.team.abbreviation;
    if (t) counts[t] = (counts[t] || 0) + 1;
  }
  return { counts, sum: Object.values(counts).reduce((s, x) => s + x, 0), excluded };
}

async function pool(items, n, fn) {
  let next = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (next < items.length) { const i = next++; await fn(items[i]); } }));
}

// ── Basketball-Reference advanced table ────────────────────
function parseBrefAdvanced(html, label) {
  const start = html.indexOf('id="advanced"');
  if (start < 0) throw new Error(`BRef ${label}: no #advanced table`);
  const table = html.slice(start, html.indexOf('</table>', start));   // regular season only; #advanced_post follows
  const players = new Map();
  for (const tr of table.split('<tr').slice(1)) {
    const cells = {};
    const re = /<t[dh]([^>]*)>(.*?)<\/t[dh]>/g;
    let m;
    while ((m = re.exec(tr))) {
      const stat = /data-stat="([a-z_0-9]+)"/.exec(m[1]);
      if (!stat) continue;
      cells[stat[1]] = m[2].replace(/<[^>]+>/g, '').trim();
      const id = /data-append-csv="([^"]+)"/.exec(m[1]);
      if (id) cells.bref_id = id[1];
    }
    if (!cells.bref_id || !cells.name_display) continue;
    const team = cells.team_name_abbr;
    const p = players.get(cells.bref_id) || { brefId: cells.bref_id, name: cells.name_display, age: parseFloat(cells.age), total: null, teams: {} };
    const num = (k) => { const v = parseFloat(cells[k]); return isNaN(v) ? null : v; };
    const row = { g: num('games'), adv: ADV_FIELDS.map(num) };
    if (/^\dTM$/.test(team)) p.total = row;
    else {
      p.teams[BREF_TEAM[team] || team] = row;
      if (!p.total) p.total = row;               // single-team players have only this row
    }
    players.set(cells.bref_id, p);
  }
  // A traded player's first per-team row was provisionally his total; the TM row replaced it.
  return players;
}

const normName = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[.'’]/g, '').replace(/-/g, ' ').replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '').replace(/\s+/g, ' ').trim();

// Match BRef players to ESPN ids. A match must agree on games and total
// minutes, so a same-name or nickname mismatch cannot pass silently.
function matchBref(espnRows, bref, label) {
  const consistent = (e, b) => {
    const espnMp = e.g * e.line[0], brefMp = b.total.adv[3];
    return b.total.g != null && Math.abs(b.total.g - e.g) <= 1 && brefMp != null && Math.abs(brefMp - espnMp) <= Math.max(15, 0.03 * espnMp);
  };
  const byName = new Map();
  for (const b of bref.values()) { const k = normName(b.name); byName.set(k, [...(byName.get(k) || []), b]); }
  const matched = new Map(), used = new Set();
  let byNameCount = 0, byStatsCount = 0;
  const unmatched = [];
  for (const e of espnRows.values()) {
    const cands = (byName.get(normName(e.name)) || []).filter(b => !used.has(b.brefId) && consistent(e, b));
    if (cands.length === 1) { matched.set(e.id, cands[0]); used.add(cands[0].brefId); byNameCount++; } else unmatched.push(e);
  }
  // Second pass (nicknames: "Nicolas"/"Nic", "Herbert"/"Herb"): same last
  // name and identical games + minutes.
  const stillUnmatched = [];
  for (const e of unmatched) {
    const last = normName(e.name).split(' ').pop();
    const cands = [...bref.values()].filter(b => !used.has(b.brefId) && normName(b.name).split(' ').pop() === last && consistent(e, b));
    if (cands.length === 1) { matched.set(e.id, cands[0]); used.add(cands[0].brefId); byStatsCount++; note(`BRef ${label}: matched "${e.name}" → "${cands[0].name}" by games/minutes`); }
    else stillUnmatched.push(e);
  }
  const bigMisses = stillUnmatched.filter(e => e.g * e.line[0] >= 300);
  stillUnmatched.forEach(e => note(`BRef ${label}: no match for ${e.name} (${e.g} g, ${Math.round(e.g * e.line[0])} min) — BPM estimated from box score`));
  console.log(`  BRef ${label}: ${bref.size} players; matched ${matched.size}/${espnRows.size} ESPN ids (${byNameCount} by name, ${byStatsCount} by games+minutes), ${stillUnmatched.length} unmatched (${bigMisses.length} with 300+ min)`);
  return matched;
}

// ── small linear algebra for the box → BPM fit ─────────────
function solve(A, b) {
  const n = A.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((r, i) => r[n] / r[i]);
}
const per36 = (line) => { const m = line[0]; return FIT_FEATURES.map(k => line[BOX_KEYS.indexOf(k)] * 36 / m); };
function fitBoxToBpm(samples) {
  // weighted least squares, weight = minutes; ridge-free (n ≫ p)
  const p = FIT_FEATURES.length + 1;
  const XtX = Array.from({ length: p }, () => new Array(p).fill(0)), Xty = new Array(p).fill(0);
  for (const s of samples) {
    const x = [1, ...s.x];
    for (let i = 0; i < p; i++) { Xty[i] += s.w * x[i] * s.y; for (let j = 0; j < p; j++) XtX[i][j] += s.w * x[i] * x[j]; }
  }
  const beta = solve(XtX, Xty);
  return { intercept: beta[0], coef: beta.slice(1) };
}
function scoreFit(fit, samples) {
  const pred = (x) => fit.intercept + x.reduce((s, v, i) => s + v * fit.coef[i], 0);
  const W = samples.reduce((s, x) => s + x.w, 0);
  const my = samples.reduce((s, x) => s + x.w * x.y, 0) / W;
  let sse = 0, sst = 0;
  for (const s of samples) { sse += s.w * (s.y - pred(s.x)) ** 2; sst += s.w * (s.y - my) ** 2; }
  return { r2: 1 - sse / sst, rmse: Math.sqrt(sse / W) };
}

async function fetchStandings(season) {
  const j = await getJson(ESPN_STANDINGS(season.year));
  const entries = j.standings ? j.standings.entries : j.children.flatMap(c => c.standings.entries);
  return Object.fromEntries(entries.map(e => [e.team.abbreviation, e.stats.find(s => s.name === 'differential').value]));
}

async function main() {
  const ctx = loadEngineContext();

  console.log('ESPN box lines …');
  const espn = {};
  for (const s of SEASONS) espn[s.key] = await fetchEspnSeason(s);

  console.log('Basketball-Reference advanced tables …');
  const bref = {}, match = {};
  for (const [i, s] of SEASONS.entries()) {
    if (i) await sleep(BREF_DELAY_MS);
    bref[s.key] = parseBrefAdvanced(await getText(BREF_ADVANCED(s.year)), s.label);
    match[s.key] = matchBref(espn[s.key], bref[s.key], s.label);
  }

  // 2025-26 team splits.
  console.log('2025-26 team splits …');
  const last = espn[SPLIT_SEASON.key];
  const splits = {}, traded = [];
  for (const [id, r] of last) {
    if (r.teams.length > 1) traded.push(id);
    else if (r.team) splits[id] = { [r.team]: r.g };
    else note(`${r.name}: no 2025-26 team`);
  }
  let reconciled = 0, failed = 0, exhibitionRows = 0;
  await pool(traded, 6, async (id) => {
    const r = last.get(id);
    try {
      const s = await gamelogSplit(id);
      exhibitionRows += s.excluded;
      if (s.sum !== r.g) {
        // Prefer Basketball-Reference's per-team rows when they add up to
        // the official total; otherwise give the unexplained games to
        // listed teams with no rows, else pro rata.
        reconciled++;
        const b = match[SPLIT_SEASON.key].get(id);
        const brefSplit = b && Object.keys(b.teams).length ? Object.fromEntries(Object.entries(b.teams).map(([t, row]) => [t, row.g])) : null;
        if (brefSplit && Object.values(brefSplit).reduce((x, y) => x + y, 0) === r.g) {
          s.counts = brefSplit;
        } else {
          const gap = r.g - s.sum, empty = r.teams.filter(t => !s.counts[t]);
          if (gap > 0 && empty.length) empty.forEach(t => { s.counts[t] = round2(gap / empty.length); });
          else Object.keys(s.counts).forEach(t => { s.counts[t] = round2(s.counts[t] * r.g / s.sum); });
        }
        note(`${r.name}: game log summed to ${s.sum} vs official ${r.g}; using ${brefSplit && s.counts === brefSplit ? 'BRef team rows' : 'reconciled split'} ${JSON.stringify(s.counts)}`);
      }
      splits[id] = s.counts;
    } catch (e) {
      failed++;
      const b = match[SPLIT_SEASON.key].get(id);
      splits[id] = b && Object.keys(b.teams).length ? Object.fromEntries(Object.entries(b.teams).map(([t, row]) => [t, row.g])) :
        Object.fromEntries(r.teams.map(t => [t, round2(r.g / r.teams.length)]));
      note(`${r.name}: game log failed (${e.message}); split from ${b ? 'Basketball-Reference team rows' : 'even division'}`);
    }
  });
  // Cross-check the game-log splits against Basketball-Reference's per-team rows.
  let agree = 0, compared = 0;
  for (const id of traded) {
    const b = match[SPLIT_SEASON.key].get(id);
    if (!b || !Object.keys(b.teams).length) continue;
    compared++;
    const ok = Object.entries(b.teams).every(([t, row]) => Math.abs((splits[id][t] || 0) - row.g) <= 1);
    if (ok) agree++; else note(`split disagreement ${last.get(id).name}: ESPN ${JSON.stringify(splits[id])} vs BRef ${JSON.stringify(Object.fromEntries(Object.entries(b.teams).map(([t, r]) => [t, r.g])))}`);
  }
  const teamPlayerGames = {};
  for (const counts of Object.values(splits)) for (const [t, g] of Object.entries(counts)) teamPlayerGames[t] = (teamPlayerGames[t] || 0) + g;
  console.log(`  ${traded.length} traded players: ${traded.length - failed} from game logs (${exhibitionRows} exhibition rows dropped, ${reconciled} reconciled, ${failed} failed); agree with BRef team rows ${agree}/${compared}; ${Object.keys(teamPlayerGames).length} teams`);
  if (Object.keys(teamPlayerGames).length !== 30) note(`expected 30 teams in splits, got ${Object.keys(teamPlayerGames).length}`);

  // Box → BPM fit (2025-26, 500+ minutes) with a 2024-25 out-of-sample check.
  const samples = (key) => [...match[key].entries()].map(([id, b]) => {
    const e = espn[key].get(id);
    return { x: per36(e.line), y: b.total.adv[0], w: e.g * e.line[0] };
  }).filter(s => s.w >= 500 && s.y != null);
  const fit = fitBoxToBpm(samples(SEASONS[0].key));
  const inS = scoreFit(fit, samples(SEASONS[0].key)), outS = scoreFit(fit, samples(SEASONS[1].key));
  console.log(`  box → BPM fit (${SEASONS[0].label}, 500+ min, n=${samples(SEASONS[0].key).length}): R² ${inS.r2.toFixed(3)}, RMSE ${inS.rmse.toFixed(2)}; on ${SEASONS[1].label}: R² ${outS.r2.toFixed(3)}, RMSE ${outS.rmse.toFixed(2)}`);

  // Replacement level: minutes-weighted BPM of the fringe (ranks 301-450 by minutes).
  const ranked = [...match[SPLIT_SEASON.key].values()].map(b => b.total).filter(t => t.adv[0] != null && t.adv[3])
    .sort((a, b) => b.adv[3] - a.adv[3]);
  const tierBpm = (a, b) => { const sl = ranked.slice(a, b); const m = sl.reduce((s, t) => s + t.adv[3], 0); return sl.reduce((s, t) => s + t.adv[0] * t.adv[3], 0) / m; };
  const replBpm = tierBpm(300, 450);
  console.log(`  BPM by minutes rank: 1-30 ${tierBpm(0, 30).toFixed(1)} · 31-150 ${tierBpm(30, 150).toFixed(1)} · 151-300 ${tierBpm(150, 300).toFixed(1)} · 301-450 ${replBpm.toFixed(1)} · 451+ ${tierBpm(450, ranked.length).toFixed(1)}  (engine replacement ${ctx.SEASON_IMPACT && ctx.SEASON_IMPACT.replacementBpm})`);

  // Calibration: Σ BPM × minutes share → point differential, per team.
  const pace = {};
  const snapTeams = ctx.SEASON_SLATE_SNAPSHOT && ctx.SEASON_SLATE_SNAPSHOT.teams;
  if (snapTeams) for (const [abbr, t] of Object.entries(snapTeams)) pace[abbr] = t.prior && t.prior.pace;
  const calibration = {};
  for (const s of SEASONS) {
    const diff = await fetchStandings(s);
    const S = {}, M = {};
    for (const b of bref[s.key].values()) {
      const rows = Object.keys(b.teams).length ? Object.entries(b.teams) : [];
      for (const [t, row] of rows) { const [bpm, , , mp] = row.adv; if (bpm == null || !mp) continue; S[t] = (S[t] || 0) + bpm * mp; M[t] = (M[t] || 0) + mp; }
    }
    const teams = Object.keys(diff).filter(t => M[t]);
    const xs = teams.map(t => S[t] / (M[t] / 5) * ((pace[t] || 100) / 100)), ys = teams.map(t => diff[t]);
    const mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length;
    let sxy = 0, sxx = 0, syy = 0;
    xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; syy += (ys[i] - my) ** 2; });
    calibration['s' + s.key] = { teams: teams.length, slope: round2(sxy / sxx * 1000) / 1000, r2: round2(sxy * sxy / (sxx * syy) * 1000) / 1000 };
  }
  console.log(`  team Σ BPM → point differential: ${Object.entries(calibration).map(([k, c]) => `${k} slope ${c.slope} R² ${c.r2} (n=${c.teams})`).join(' · ')}  (engine bpmToPoints ${ctx.SEASON_IMPACT && ctx.SEASON_IMPACT.bpmToPoints})${Object.keys(pace).length ? '' : ' — no snapshot pace; slopes include pace'}`);

  // Assemble.
  const ids = new Set(SEASONS.flatMap(s => [...espn[s.key].keys()]));
  const players = {};
  let withAdv = 0;
  for (const id of [...ids].sort((a, b) => Number(a) - Number(b))) {
    const p = {};
    for (const s of SEASONS) {
      const e = espn[s.key].get(id);
      if (!e) continue;
      if (!p.n) p.n = e.name;
      p['s' + s.key] = [e.g, ...e.line.map(round2)];
      const b = match[s.key].get(id);
      if (b) { p['a' + s.key] = b.total.adv.map(v => v == null ? null : round2(v)); if (!p.br) p.br = b.brefId; }
      // Age this season (Basketball-Reference ages are as of Feb 1 of the season).
      if (b && p.age == null && Number.isFinite(b.age)) p.age = b.age + (TARGET_YEAR - s.year);
    }
    if (p.a26 || p.a25) withAdv++;
    if (splits[id]) p.tm = splits[id];
    players[id] = p;
  }

  const out = {
    meta: {
      generatedAt: new Date().toISOString(),
      sources: {
        box: 'ESPN byathlete — official regular-season per-game lines',
        impact: 'Basketball-Reference NBA_<year>_advanced.html (regular-season table)',
        splits: 'ESPN game logs for traded players (All-Star, Cup Championship, play-in excluded); checked against Basketball-Reference team rows',
      },
      seasons: SEASONS.map(s => ({ key: s.key, label: s.label, espnPlayers: espn[s.key].size, brefMatched: match[s.key].size })),
      boxFormat: ['g', ...BOX_KEYS],
      advFormat: ADV_FIELDS,
      age: `age on Feb 1 of the ${TARGET_YEAR - 1}-${String(TARGET_YEAR).slice(2)} season (Basketball-Reference age + seasons elapsed)`,
      teamGames: TEAM_GAMES,
      measuredReplacementBpm: round2(replBpm),
      calibration,
      boxToBpm: { features: FIT_FEATURES.map(f => f + '/36'), intercept: round2(fit.intercept * 1000) / 1000,
        coef: fit.coef.map(c => Math.round(c * 10000) / 10000), r2: round2(inS.r2 * 1000) / 1000, rmse: round2(inS.rmse),
        outOfSample: { season: SEASONS[1].label, r2: round2(outS.r2 * 1000) / 1000, rmse: round2(outS.rmse) } },
      notes: notes.length,
    },
    players,
  };

  console.log(`Players: ${Object.keys(players).length} (${withAdv} with BPM)`);
  if (notes.length) {
    console.log(`Notes (${notes.length}):`);
    notes.slice(0, 30).forEach(n => console.log('  - ' + n));
    if (notes.length > 30) console.log(`  … ${notes.length - 30} more`);
  }
  if (DRY) { console.log('--dry: nothing written'); return; }
  const header = '// ============================================================\n' +
    '// PLAYER PRIORS — generated by `node fetch-priors.js`; do not hand-edit\n' +
    '// ============================================================\n' +
    '// players[espnId] = { n: name, br: Basketball-Reference id,\n' +
    '//   s26 / s25: [g, min, pts, reb, ast, tpm, stl, blk, to, fgm, fga, ftm, fta, tpa]\n' +
    '//              per-game box line for 2025-26 / 2024-25 (ESPN, official),\n' +
    '//   a26 / a25: [bpm, obpm, dbpm, mp, usg%, ast%, trb%, tov%, ts%, 3PA rate]\n' +
    '//              (Basketball-Reference, season total row),\n' +
    '//   tm: { TEAM: games } 2025-26 games by team }\n' +
    '// ============================================================';
  fs.writeFileSync(OUT_PATH, `${header}\nconst SEASON_PLAYER_PRIORS = ${JSON.stringify(out)};\n`);
  console.log(`Wrote ${path.relative(__dirname, OUT_PATH)} (${(fs.statSync(OUT_PATH).size / 1024).toFixed(0)} KB)`);
}

main().catch(e => { console.error('fetch-priors failed:', e.message); process.exit(1); });
