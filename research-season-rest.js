#!/usr/bin/env node
// ============================================================
// research-season-rest.js — back-to-back cost once absences are accounted for
// ============================================================
// research-season-update.js found a back-to-back costs ~2.0 points against
// the engine's 1.0. Part of that is rested and injured regulars sitting out,
// which the live engine already prices through the injury report. This
// script separates the two with ESPN box scores (who actually played):
//
//   regulars   each team's players averaging 20+ minutes over 20+ games
//              for it that season; a regular is "missing" from a game
//              between his first and last game for the team in which he
//              did not play (box-score hindsight — used only to remove the
//              absence effect, never as a predictor)
//   margin     research-season-update.js's point-in-time prediction with
//              no rest term; the residual is regressed on back-to-back
//              flags with and without the missing regulars' minutes
//
//   node research-season-rest.js [--fetch-only]
// ESPN pages are cached under .cache/espn-nba/hist/.
// ============================================================
const fs = require('fs');
const path = require('path');

const HIST = path.join(__dirname, '.cache/espn-nba/hist');
const SEASONS = [
  { t: 2024, from: '2023-10-24', to: '2024-04-14' },
  { t: 2025, from: '2024-10-22', to: '2025-04-13' },
  { t: 2026, from: '2025-10-21', to: '2026-04-12' },
];
const has = (f) => process.argv.includes(f);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const addDays = (d, n) => new Date(Date.parse(d + 'T12:00:00Z') + n * 864e5).toISOString().slice(0, 10);

async function getJson(url, file) {
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (res.ok) return res.json();
      if (res.status < 500) throw new Error(`${url} → ${res.status}`);
    } catch (e) { if (attempt === 3) throw e; }
    await sleep(2000 * (attempt + 1));
  }
}

// One trimmed record per regular-season game: teams, score, who played and for how long.
async function fetchSeason(S) {
  fs.mkdirSync(HIST, { recursive: true });
  const ids = [];
  for (let d = S.from; d <= S.to; d = addDays(d, 1)) {
    const f = path.join(HIST, `sb-${d}.json`);
    let sb = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
    if (!sb) {
      const raw = await getJson(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${d.replace(/-/g, '')}`);
      sb = (raw.events || []).map(e => ({ id: e.id, type: e.season && e.season.type, done: e.status && e.status.type && e.status.type.completed }));
      fs.writeFileSync(f, JSON.stringify(sb));
      await sleep(150);
    }
    for (const e of sb) if (e.type === 2 && e.done) ids.push({ id: e.id, date: d });
  }
  let next = 0;
  const worker = async () => {
    while (next < ids.length) {
      const { id, date } = ids[next++];
      const f = path.join(HIST, `box-${id}.json`);
      if (fs.existsSync(f)) continue;
      const s = await getJson(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${id}`);
      const comp = s.header.competitions[0];
      const side = (h) => comp.competitors.find(c => c.homeAway === h);
      const out = {
        id, date, home: side('home').team.abbreviation, away: side('away').team.abbreviation,
        hs: +side('home').score, as: +side('away').score,
        players: (s.boxscore.players || []).flatMap(t => {
          const st = t.statistics[0], mi = st.labels.indexOf('MIN');
          return st.athletes.map(a => ({ team: t.team.abbreviation, id: a.athlete.id, name: a.athlete.displayName, min: a.didNotPlay || !a.stats || !a.stats.length ? 0 : +a.stats[mi] || 0 }));
        }),
      };
      fs.writeFileSync(f, JSON.stringify(out));
      await sleep(100);
    }
  };
  await Promise.all(Array.from({ length: 5 }, worker));
  return ids.map(({ id }) => JSON.parse(fs.readFileSync(path.join(HIST, `box-${id}.json`), 'utf8')));
}

module.exports = { SEASONS, fetchSeason };

const ESPN_TO_BREF = { GS: 'GSW', NY: 'NYK', SA: 'SAS', NO: 'NOP', UTAH: 'UTA', WSH: 'WAS', BKN: 'BRK', CHA: 'CHO', PHX: 'PHO' };
const br = (a) => ESPN_TO_BREF[a] || a;

function ols(X, y) {
  const k = X[0].length, A = Array.from({ length: k }, () => Array(k).fill(0)), b = Array(k).fill(0);
  X.forEach((r, i) => { for (let a = 0; a < k; a++) { b[a] += r[a] * y[i]; for (let c = 0; c < k; c++) A[a][c] += r[a] * r[c]; } });
  const solve = (rhs) => {
    const M = A.map((r, i) => [...r, rhs[i]]);
    for (let i = 0; i < k; i++) {
      let p = i; for (let q = i + 1; q < k; q++) if (Math.abs(M[q][i]) > Math.abs(M[p][i])) p = q;
      [M[i], M[p]] = [M[p], M[i]];
      for (let q = i + 1; q < k; q++) { const f = M[q][i] / M[i][i]; for (let j = i; j <= k; j++) M[q][j] -= f * M[i][j]; }
    }
    const x = Array(k).fill(0);
    for (let i = k - 1; i >= 0; i--) { let t = M[i][k]; for (let j = i + 1; j < k; j++) t -= M[i][j] * x[j]; x[i] = t / M[i][i]; }
    return x;
  };
  const coef = solve(b);
  const res = y.map((v, i) => v - X[i].reduce((t, x, j) => t + x * coef[j], 0));
  const s2 = res.reduce((t, e) => t + e * e, 0) / (y.length - k);
  return { coef, se: coef.map((_, j) => Math.sqrt(s2 * solve(Array.from({ length: k }, (_, i) => +(i === j)))[j])) };
}

async function main() {
  const predFile = path.join(__dirname, '.cache/research-rest-preds.json');
  if (!has('--fetch-only')) {   // regenerated every run so it never goes stale
    require('child_process').execFileSync('node', [path.join(__dirname, 'research-season-update.js')], { env: { ...process.env, REST_OUT: predFile }, stdio: 'ignore' });
  }
  const rows = [];
  for (const S of SEASONS) {
    const games = await fetchSeason(S);
    console.log(`${S.t - 1}-${String(S.t).slice(2)}: ${games.length} regular-season box scores`);
    if (has('--fetch-only')) continue;
    // Regulars: 20+ games and 20+ minutes a game for the team; window = first..last game for it.
    const seen = {};
    for (const g of games) for (const p of g.players) if (p.min > 0) {
      const k = `${br(p.team)}|${p.id}`, r = seen[k] = seen[k] || { team: br(p.team), id: p.id, name: p.name, g: 0, min: 0, first: g.date, last: g.date };
      r.g++; r.min += p.min; if (g.date < r.first) r.first = g.date; if (g.date > r.last) r.last = g.date;
    }
    const regulars = {};
    for (const r of Object.values(seen)) if (r.g >= 20 && r.min / r.g >= 20) (regulars[r.team] = regulars[r.team] || []).push({ ...r, mpg: r.min / r.g });
    const byKey = new Map(games.map(g => [`${g.date}|${br(g.home)}|${br(g.away)}`, g]));
    for (const pr of JSON.parse(fs.readFileSync(predFile, 'utf8')).filter(x => x.t === S.t)) {
      const g = byKey.get(`${pr.date}|${pr.home}|${pr.away}`);
      if (!g) continue;
      const missing = (team) => {
        const played = new Set(g.players.filter(p => br(p.team) === team && p.min > 0).map(p => p.id));
        const out = (regulars[team] || []).filter(r => r.first <= g.date && r.last >= g.date && !played.has(r.id));
        return { min: out.reduce((t, r) => t + r.mpg, 0) / 10, stars: out.filter(r => r.mpg >= 30).length };
      };
      rows.push({ ...pr, mh: missing(pr.home), ma: missing(pr.away) });
    }
  }
  if (has('--fetch-only')) return;
  console.log(`${rows.length} games matched to point-in-time predictions (home court 2.0, no rest term)`);
  const mean = (a) => a.reduce((t, x) => t + x, 0) / a.length;
  const sides = rows.flatMap(r => [{ b2b: r.hB2b, miss: r.mh }, { b2b: r.aB2b, miss: r.ma }]);
  const b2b = sides.filter(x => x.b2b), rest = sides.filter(x => !x.b2b);
  console.log(`regular minutes missing per team-game: back-to-back ${(10 * mean(b2b.map(x => x.miss.min))).toFixed(1)} (n ${b2b.length}), otherwise ${(10 * mean(rest.map(x => x.miss.min))).toFixed(1)}; ` +
    `30-mpg regulars missing: ${mean(b2b.map(x => x.miss.stars)).toFixed(3)} vs ${mean(rest.map(x => x.miss.stars)).toFixed(3)}`);
  const y = rows.map(r => r.y - r.pred);
  const fmt = (f, j) => `${f.coef[j] >= 0 ? '+' : ''}${f.coef[j].toFixed(2)} ± ${f.se[j].toFixed(2)}`;
  const f1 = ols(rows.map(r => [1, +r.hB2b, +r.aB2b]), y);
  console.log(`\nResidual home margin (actual − prediction without rest):`);
  console.log(`  back-to-back only:                 home b2b ${fmt(f1, 1)}   away b2b ${fmt(f1, 2)}  (away b2b helps the home margin)`);
  const f2 = ols(rows.map(r => [1, +r.hB2b, +r.aB2b, r.mh.min, r.ma.min]), y);
  console.log(`  + missing regular minutes (per 10): home b2b ${fmt(f2, 1)}   away b2b ${fmt(f2, 2)}   home missing ${fmt(f2, 3)}   away missing ${fmt(f2, 4)}`);
  const f3 = ols(rows.map(r => [1, +r.hB2b, +r.aB2b, r.mh.min, r.ma.min, r.mh.stars, r.ma.stars]), y);
  console.log(`  + 30-mpg regulars missing:          home b2b ${fmt(f3, 1)}   away b2b ${fmt(f3, 2)}   stars out home ${fmt(f3, 5)} away ${fmt(f3, 6)}`);
  const full = rows.filter(r => r.mh.min === 0 && r.ma.min === 0);
  const f4 = ols(full.map(r => [1, +r.hB2b, +r.aB2b]), full.map(r => r.y - r.pred));
  console.log(`  games with every regular playing (n ${full.length}): home b2b ${fmt(f4, 1)}   away b2b ${fmt(f4, 2)}`);
  const sym = (f, a, b) => { const v = (f.coef[b] - f.coef[a]) / 2, se = Math.sqrt(f.se[a] ** 2 + f.se[b] ** 2) / 2; return `${v >= 0 ? '−' : '+'}${Math.abs(v).toFixed(2)} ± ${se.toFixed(2)}`; };
  console.log(`\nCost of a back-to-back to the tired team (home and away averaged): raw ${sym(f1, 1, 2)}; with absences removed ${sym(f2, 1, 2)}; stars too ${sym(f3, 1, 2)}; full-strength games ${sym(f4, 1, 2)}`);
}
if (require.main === module) main().catch(e => { console.error('research-season-rest failed:', e.stack); process.exit(1); });
