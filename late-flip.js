#!/usr/bin/env node
// ============================================================
// late-flip.js — the two picks the late-injury-flip rule compares
// ============================================================
// For one day's games, the replay pipeline's (replay-season.js) pick from
// the injury report before 9 PM ET the evening before (its eve variant)
// and its pick from the latest report at record time (at most 60 minutes
// before tip). fetch-slate.js --record stores both on each ledger row;
// js/season/trust.js (SEASON_LATE_FLIP) judges the games where they differ.
//
// Same store, context, leak guards and report cache as the replay. One
// difference: a report name not found is remembered only by the replay,
// never here — tonight's newest PDF may simply not be posted yet.
//
//   node late-flip.js [YYYY-MM-DD] [--all]   print the day's checks
//   (--all: every game with its tip-time report, as the replay saw it)
// ============================================================
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const R = require('./replay-season.js');

const CACHE = path.join(__dirname, '.cache/injury-reports');
const PY = path.join(__dirname, '.cache/pyenv/bin/python');
const etFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
function et(t) { const p = Object.fromEntries(etFmt.formatToParts(new Date(t)).map(x => [x.type, x.value])); return { date: `${p.year}-${p.month}-${p.day}`, h: +p.hour, m: +p.minute }; }
function etInstant(date, h, m) {
  for (const off of [4, 5]) {
    const t = Date.UTC(+date.slice(0, 4), +date.slice(5, 7) - 1, +date.slice(8, 10), h + off, m), b = et(t);
    if (b.date === date && b.h === h && b.m === m) return t;
  }
  throw new Error(`no ET instant for ${date} ${h}:${m}`);
}
function reportName(date, h, m) {
  const ap = h >= 12 ? 'PM' : 'AM', h12 = h % 12 === 0 ? 12 : h % 12;
  return `Injury-Report_${date}_${String(h12).padStart(2, '0')}_${String(m).padStart(2, '0')}${ap}.pdf`;
}
// The replay's cutoffs (replay-season.js cutoffOf), strict for the evening before.
const tipCut = (g) => new Date(g.tip).getTime() - R.SPEC.reportLeadMinutes * 60e3;
const eveCut = (g) => Math.min(tipCut(g), etInstant(R.addDays(et(g.tip).date, -1), ...R.SPEC.eveCutoffEt) - 1);

// Latest report labelled at or before `cutoff`, up to 18 hours back.
let index = null;
async function reportBefore(cutoff, now) {
  const indexFile = path.join(CACHE, 'index.json');
  index = index || (fs.existsSync(indexFile) ? JSON.parse(fs.readFileSync(indexFile, 'utf8')) : {});
  let { date, h, m } = et(cutoff);
  m = m >= 30 ? 30 : 0;
  for (let step = 0; step < 36; step++) {
    const name = reportName(date, h, m), at = etInstant(date, h, m);
    const pdf = path.join(CACHE, name), json = pdf.replace(/\.pdf$/, '.json');
    let ok = fs.existsSync(pdf);
    // Known missing (the replay looked) and labelled 3+ hours ago: posted late reports are rare after that.
    if (!ok && !(index[name] === false && now - at > 3 * 3600e3)) {
      const res = await fetch(`https://ak-static.cms.nba.com/referee/injury/${name}`, { headers: { 'User-Agent': 'nba-playoff-analyzer late-flip' } }).catch(() => null);
      if (res && res.ok) { fs.mkdirSync(CACHE, { recursive: true }); fs.writeFileSync(pdf, Buffer.from(await res.arrayBuffer())); ok = true; }
    }
    if (ok) {
      if (at > cutoff) throw new Error(`leak guard: report ${name} is after the cutoff`);
      if (!fs.existsSync(json)) fs.writeFileSync(json, execFileSync(PY, ['-I', path.join(__dirname, 'parse-injury-report.py'), pdf], { maxBuffer: 64e6 }));
      return { name, at, ...JSON.parse(fs.readFileSync(json, 'utf8')) };
    }
    m -= 30; if (m < 0) { m = 30; h -= 1; } if (h < 0) { h = 23; date = R.addDays(date, -1); }
  }
  throw new Error(`no injury report within 18 hours before ${new Date(cutoff).toISOString()}`);
}

// → [{ home, away, tip, pEve, pNow, marginEve, marginNow, flip, side, compsEve, compsNow, reportEve, reportNow, engine, spec }]
// for games not yet tipped (opts.all: every game, with its tip-time report).
async function lateFlipChecks(date, opts) {
  opts = opts || {};
  const now = opts.now != null ? opts.now : Date.now();
  const ctx = R.loadContext();
  const store = await R.buildStore(ctx, date);
  const games = store.schedule[date] || [];
  // Earlier days' games carry their tip-time report too: predictDay reads a team's previous
  // game's report to tell who is no longer with the team, as in the replay.
  for (const [d, gs] of Object.entries(store.schedule)) if (d < date) for (const g of gs) {
    const r = await reportBefore(tipCut(g), now);
    store.reports[r.name] = store.reports[r.name] || r; g.report = r.name;
  }
  for (const g of games) {
    const eve = await reportBefore(eveCut(g), now), cur = await reportBefore(opts.all ? tipCut(g) : Math.min(tipCut(g), now), now);
    store.reports[eve.name] = store.reports[eve.name] || eve; g.report_eve = eve.name;
    store.reports[cur.name] = store.reports[cur.name] || cur; g.report = cur.name;
  }
  const eve = new Map(R.predictDay(ctx, store, date, false, 'eve').map(x => [x.id, x]));
  const cur = new Map(R.predictDay(ctx, store, date, false).map(x => [x.id, x]));
  return games.filter(g => opts.all || new Date(g.tip).getTime() > now).map(g => {
    const e = eve.get(g.id), c = cur.get(g.id);
    if (!e || !c) return null;
    const flip = (e.pHome >= 0.5) !== (c.pHome >= 0.5);
    return { home: g.home, away: g.away, tip: g.tip, pEve: +e.pHome.toFixed(4), pNow: +c.pHome.toFixed(4), marginEve: e.margin, marginNow: c.margin,
      flip, side: e.pHome >= 0.5 ? 'home' : 'away', compsEve: e.comps, compsNow: c.comps, reportEve: g.report_eve, reportNow: g.report, engine: R.SPEC.engine, spec: R.SPEC.version };
  }).filter(Boolean);
}

module.exports = { lateFlipChecks };

if (require.main === module) {
  const date = process.argv.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a)) || et(Date.now()).date;
  lateFlipChecks(date, { all: process.argv.includes('--all') }).then(rows => {
    for (const x of rows) console.log(`${x.away} @ ${x.home}  evening before ${x.home} ${(x.pEve * 100).toFixed(1)}%  latest ${(x.pNow * 100).toFixed(1)}%  ${x.flip ? `FLIP → rule takes ${x.side === 'home' ? x.home : x.away}` : 'same pick'}  (${x.reportEve.slice(14, -4)} vs ${x.reportNow.slice(14, -4)})`);
  }).catch(e => { console.error('late-flip failed:', e.message); process.exit(1); });
}
