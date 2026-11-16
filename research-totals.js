#!/usr/bin/env node
// ============================================================
// research-totals.js — early-season NBA totals, 2015-26 (totals-1)
// ============================================================
// Pre-registered in TOTALS_RESEARCH.md (commit 650ec84, before this file was written).
// The closing total is the median listed overUnder across sportsbooks (ESPN core odds, engine-close-2's
// book rule); resid = actual total − closing total. T1 week 1, T2 weeks 1–4, T3 early minus late.
//
//   node research-totals.js --fetch    every regular-season game's totals from ESPN (free), cached
//   node research-totals.js --check    data checks only (coverage, books, listed vs close), no results
//   node research-totals.js            the decision table and descriptive checks
// ESPN only; the Odds API key is cleared, nothing spends credits.
// ============================================================
delete process.env.ODDS_API_KEY;
const fs = require('fs');
const path = require('path');

const C = path.join(__dirname, '.cache/espn-nba');
const OUT = path.join(C, 'totals');
const EXCLUDED = /opening|live|consensus|accuscore|teamrankings|numberfire/i;
const has = (f) => process.argv.includes(f);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const median = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const sd = (xs) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1)); };
// Season by date: a season runs from October 1 (2019-20's bubble ended in August 2020; 2020-21 opened in December).
const seasonOf = (d) => { const y = +d.slice(0, 4), start = d.slice(5) >= '10-01' ? y : y - 1; return `${start}-${String(start + 1).slice(2)}`; };

// Every regular-season game 2015-26 with its final score, from the caches the earlier studies built.
function gameList() {
  const out = new Map();
  for (const f of fs.readdirSync(path.join(C, 'early')).filter(f => f.startsWith('sb-')))
    for (const e of JSON.parse(fs.readFileSync(path.join(C, 'early', f), 'utf8'))) if (e.type === 2 && e.done) out.set(String(e.id), { id: String(e.id), date: e.date, home: e.home, away: e.away, hs: e.hs, as: e.as });
  const fromBox = (dir, regular) => { for (const f of fs.readdirSync(path.join(C, dir)).filter(f => f.startsWith('box-'))) {
    const b = JSON.parse(fs.readFileSync(path.join(C, dir, f), 'utf8'));
    if (!regular(String(b.id)) || /EAST|WEST/.test(b.home)) continue;
    out.set(String(b.id), { id: String(b.id), date: b.date, home: b.home, away: b.away, hs: b.hs, as: b.as }); } };
  fromBox('old', () => true);   // fetched as season type 2 only (situ-1)
  const reg = new Set(fs.readdirSync(path.join(C, 'hist-team')).filter(f => JSON.parse(fs.readFileSync(path.join(C, 'hist-team', f), 'utf8')).seasonType === 2).map(f => f.slice(5, -5)));
  fromBox('hist', (id) => reg.has(id));
  // The 30 NBA teams only (All-Star games use captains' or other team names).
  const NBA = new Set('ATL BOS BKN CHA CHI CLE DAL DEN DET GS HOU IND LAC LAL MEM MIA MIL MIN NO NY OKC ORL PHI PHX POR SAC SA TOR UTAH WSH'.split(' '));
  return [...out.values()].filter(g => g.hs > 0 && g.as > 0 && NBA.has(g.home) && NBA.has(g.away));
}

async function fetchTotals() {
  fs.mkdirSync(OUT, { recursive: true });
  const todo = gameList().filter(g => !fs.existsSync(path.join(OUT, `t-${g.id}.json`)));
  let next = 0, failed = 0;
  const worker = async () => {
    while (next < todo.length) {
      const g = todo[next++];
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const res = await fetch(`https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/events/${g.id}/competitions/${g.id}/odds`, { signal: AbortSignal.timeout(30000) });
          if (!res.ok && res.status !== 404) throw new Error(`HTTP ${res.status}`);
          const j = res.ok ? await res.json() : { items: [] };
          const num = (v) => (v == null || v === '' || !isFinite(+v) ? null : +v);
          fs.writeFileSync(path.join(OUT, `t-${g.id}.json`), JSON.stringify({ id: g.id, providers: (j.items || []).map(i => ({ name: i.provider && i.provider.name, total: num(i.overUnder),
            close: num(i.close && i.close.total && (i.close.total.value ?? i.close.total.american)), open: num(i.open && i.open.total && (i.open.total.value ?? i.open.total.american)) })) }));
          break;
        } catch (e) { if (attempt === 3) failed++; else await sleep(1500 * (attempt + 1)); }
      }
      await sleep(100);
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`${todo.length} games fetched (${failed} failed); ${fs.readdirSync(OUT).length} cached in ${path.relative(__dirname, OUT)}`);
}

// Scored rows: { season, date, day (since the season's opener), actual, line, books, resid }.
function rows() {
  const games = gameList(), skipped = { noFile: 0, fewBooks: 0 }, out = [];
  const opener = {};
  for (const g of games) { const s = seasonOf(g.date); if (!opener[s] || g.date < opener[s]) opener[s] = g.date; }
  for (const g of games) {
    const f = path.join(OUT, `t-${g.id}.json`);
    if (!fs.existsSync(f)) { skipped.noFile++; continue; }
    const books = JSON.parse(fs.readFileSync(f, 'utf8')).providers.filter(p => p.name && !EXCLUDED.test(p.name) && p.total != null && p.total > 150 && p.total < 300);
    if (books.length < 2) { skipped.fewBooks++; continue; }
    const s = seasonOf(g.date), line = median(books.map(p => p.total)), actual = g.hs + g.as;
    out.push({ id: g.id, season: s, date: g.date, day: Math.round((Date.parse(g.date) - Date.parse(opener[s])) / 864e5), actual, line, books: books.length, resid: actual - line,
      dk: books.find(p => /^draftkings$/i.test(p.name)) || null });
  }
  return { rows: out, skipped, opener };
}

function main() {
  const { rows: R, skipped, opener } = rows();
  const seasons = [...new Set(R.map(r => r.season))].sort();
  if (has('--check')) {
    console.log(`totals-1 data: ${R.length} games with a median closing total; skipped ${JSON.stringify(skipped)}; median books per game ${median(R.map(r => r.books))}`);
    for (const s of seasons) { const q = R.filter(r => r.season === s); console.log(`  ${s}: ${q.length} games, opener ${opener[s]}, week-1 games ${q.filter(r => r.day <= 6).length}, line mean ${mean(q.map(r => r.line)).toFixed(1)}`); }
    const dk = R.filter(r => r.dk && r.dk.close != null), same = dk.filter(r => r.dk.total === r.dk.close).length;
    console.log(`  DraftKings listed total = its close: ${same} of ${dk.length} games with a close field`);
    const one = R.filter(r => r.dk), near = one.filter(r => Math.abs(r.dk.total - r.line) <= 1).length;
    console.log(`  DraftKings within 1 point of the median: ${near} of ${one.length}`);
    return;
  }
  const t = (xs) => mean(xs) / (sd(xs) / Math.sqrt(xs.length));
  const record = (q) => { const u = q.filter(r => r.resid < 0).length, o = q.filter(r => r.resid > 0).length; return { u, o, rate: u / (u + o), profit: (u * (100 / 110) - o) / (u + o) }; };
  const decide = (name, q) => {
    const x = q.map(r => r.resid), per = seasons.map(s => mean(q.filter(r => r.season === s).map(r => r.resid))), neg = per.filter(m => m < 0).length, rec = record(q);
    const pass = mean(x) < 0 && t(x) <= -2 && rec.rate > 0.524 && neg >= 7;
    console.log(`\n${name}: ${q.length} games, mean resid ${mean(x).toFixed(2)} (t ${t(x).toFixed(2)}), unders ${rec.u}-${rec.o} (${(100 * rec.rate).toFixed(1)}%), return at −110 ${(100 * rec.profit).toFixed(1)}%`);
    console.log(`  by season: ${seasons.map((s, i) => `${s.slice(2)} ${per[i] >= 0 ? '+' : ''}${per[i].toFixed(1)}`).join(' · ')}  (negative in ${neg} of ${seasons.length})`);
    console.log(`  ${pass ? 'PASS' : 'no'}: mean < 0 with t ≤ −2 ${mean(x) < 0 && t(x) <= -2 ? '✓' : '✗'}, unders > 52.4% ${rec.rate > 0.524 ? '✓' : '✗'}, negative in ≥ 7 seasons ${neg >= 7 ? '✓' : '✗'}`);
    return pass;
  };
  console.log(`totals-1: ${R.length} games, 2015-16 … 2025-26; resid mean ${mean(R.map(r => r.resid)).toFixed(2)}, sd ${sd(R.map(r => r.resid)).toFixed(2)}`);
  let passes = 0;
  passes += decide('T1. Week 1 (days 0–6)', R.filter(r => r.day <= 6));
  passes += decide('T2. Weeks 1–4 (days 0–27)', R.filter(r => r.day <= 27));
  const early = R.filter(r => r.day <= 27).map(r => r.resid), late = R.filter(r => r.day > 27).map(r => r.resid);
  const t3 = (mean(early) - mean(late)) / Math.sqrt(sd(early) ** 2 / early.length + sd(late) ** 2 / late.length);
  const perDiff = seasons.map(s => mean(R.filter(r => r.season === s && r.day <= 27).map(r => r.resid)) - mean(R.filter(r => r.season === s && r.day > 27).map(r => r.resid)));
  const neg3 = perDiff.filter(d => d < 0).length, pass3 = mean(early) - mean(late) < 0 && t3 <= -2 && neg3 >= 7; passes += pass3;
  console.log(`\nT3. Early (days 0–27) minus later: ${(mean(early) - mean(late)).toFixed(2)} points (t ${t3.toFixed(2)}); by season ${perDiff.map(d => (d >= 0 ? '+' : '') + d.toFixed(1)).join(' · ')} (negative in ${neg3})`);
  console.log(`  ${pass3 ? 'PASS' : 'no'}`);

  console.log('\nDescribed');
  for (let w = 0; w < 10; w++) { const q = R.filter(r => r.day >= 7 * w && r.day <= 7 * w + 6), rec = record(q); console.log(`  week ${w + 1}: ${String(q.length).padStart(4)} games, mean resid ${mean(q.map(r => r.resid)) >= 0 ? '+' : ''}${mean(q.map(r => r.resid)).toFixed(2)}, unders ${(100 * rec.rate).toFixed(1)}%, line mean ${mean(q.map(r => r.line)).toFixed(1)}, actual mean ${mean(q.map(r => r.actual)).toFixed(1)}`); }
  const recent = R.filter(r => r.season >= '2021-22');
  for (const [lbl, q] of [['recent seasons, week 1', recent.filter(r => r.day <= 6)], ['recent seasons, weeks 1–4', recent.filter(r => r.day <= 27)]]) { const rec = record(q); console.log(`  ${lbl}: ${q.length} games, mean resid ${mean(q.map(r => r.resid)).toFixed(2)} (t ${t(q.map(r => r.resid)).toFixed(2)}), unders ${(100 * rec.rate).toFixed(1)}%, return ${(100 * rec.profit).toFixed(1)}%`); }
  const trim = [...R].sort((a, b) => Math.abs(a.resid) - Math.abs(b.resid)).slice(0, Math.floor(R.length * 0.99));
  for (const [lbl, q] of [['trimmed, week 1', trim.filter(r => r.day <= 6)], ['trimmed, weeks 1–4', trim.filter(r => r.day <= 27)]]) console.log(`  ${lbl}: mean resid ${mean(q.map(r => r.resid)).toFixed(2)} (t ${t(q.map(r => r.resid)).toFixed(2)})`);
  console.log(`\n${passes} of 3 pass.`);
}

module.exports = { gameList, rows, seasonOf, median };
if (require.main === module) (has('--fetch') ? fetchTotals() : Promise.resolve(main())).catch(e => { console.error(e); process.exit(1); });
