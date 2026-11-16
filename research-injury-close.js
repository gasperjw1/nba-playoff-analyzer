#!/usr/bin/env node
// ============================================================
// research-injury-close.js — the engine's availability piece vs the close, 2021-26 (injury-close-1)
// ============================================================
// Pre-registered in INJURY_PIECE_RESEARCH.md (commit 1d8fb55, before this file was written).
// A past-season replica of calcRosterAdjustment: prior BPM from Basketball-Reference, who played
// from ESPN box scores, tonight's minutes capped at 240 in rotation order, minutes in the rating
// (1 − w) × baseline + w × this season's share. Added to the engine-close-1 walk and scored
// against the same closing lines.
//
//   node research-injury-close.js           the decision table and descriptive checks
//   node research-injury-close.js --check   the feature only (match rate, spread of A, largest A), no results
// Cached data only; the Odds API key is cleared, nothing spends credits.
// ============================================================
delete process.env.ODDS_API_KEY;
const fs = require('fs');
const path = require('path');
const { loadSeason } = require('./research-team-fit.js');
const EC = require('./research-engine-close.js');

const BOX_DIRS = [path.join(__dirname, '.cache/espn-nba/old'), path.join(__dirname, '.cache/espn-nba/hist')];
const YEARS = [2022, 2023, 2024, 2025, 2026];
const REPL = -2.0, REGRESS = 300, W1 = 1.0, W2 = 0.5, MIN_GAMES_K = 4, MIN_MPG = 8, PACE = 99, BPM_PTS = 0.885, TEAM_MIN = 240, CAP = 12, K = 20;
const ALIAS = { 'ronald holland': 'ron holland', 'adama bal': 'adamaalpha bal' };
const has = (f) => process.argv.includes(f);
const B = { GS: 'GSW', NY: 'NYK', SA: 'SAS', NO: 'NOP', UTAH: 'UTA', WSH: 'WAS', BKN: 'BRK', CHA: 'CHO', PHX: 'PHO' };
const br = (a) => B[a] || a;
const yearOf = (d) => (d < '2022-07-01' ? 2022 : d < '2023-07-01' ? 2023 : d < '2024-07-01' ? 2024 : d < '2025-07-01' ? 2025 : 2026);
const norm = (s) => { const n = s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\b(jr|sr|ii|iii|iv|v)\b\.?/g, '').replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim(); return ALIAS[n] || n; };

// Prior BPM and minutes per game for every Basketball-Reference player, as of season Y.
function priorsFor(Sy1, Sy2) {
  const out = new Map();
  for (const [S, w] of [[Sy1, W1], [Sy2, W2]]) for (const p of S.players.values()) {
    const t = p.total; if (!t || !(t.mp > 0) || !(t.g > 0)) continue;
    const e = out.get(p.id) || { bpmMp: 0, mpW: 0, gW: 0 };
    if (t.bpm != null) { e.bpmMp += t.bpm * t.mp * w; e.mpW += t.mp * w; }
    e.gW += t.g * w; e.mpTot = (e.mpTot || 0) + t.mp * w;
    out.set(p.id, e);
  }
  const res = new Map();
  for (const [id, e] of out) res.set(id, { bpm: (e.bpmMp + REPL * REGRESS) / (e.mpW + REGRESS), mpg: e.mpTot / e.gW });
  return res;
}

async function build() {
  // Basketball-Reference seasons Y−2 … Y.
  const S = {};
  for (let y = YEARS[0] - 2; y <= YEARS[YEARS.length - 1]; y++) S[y] = await loadSeason(y);
  // ESPN games by season, in date order, with each player's minutes.
  const bySeason = {};
  for (const dir of BOX_DIRS) for (const f of fs.readdirSync(dir).filter(f => f.startsWith('box-'))) {
    const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (!EC.normalCdf || !b.home) continue;
    (bySeason[yearOf(b.date)] = bySeason[yearOf(b.date)] || []).push(b);
  }
  const feature = new Map(), match = {};
  for (const Y of YEARS) {
    const games = (bySeason[Y] || []).filter(g => g.home !== 'EAST' && g.away !== 'EAST' && g.home !== 'WEST' && g.away !== 'WEST' && !/^(TEAM|USA|WORLD)/.test(g.home))
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : String(a.id) < String(b.id) ? -1 : 1));
    const prior = priorsFor(S[Y - 1], S[Y - 2]);
    // ESPN id → Basketball-Reference id: team and name in season Y, else a unique name in season Y.
    const byTeam = new Map(), byName = new Map();
    for (const p of S[Y].players.values()) { const n = norm(p.name); (byName.get(n) || byName.set(n, []).get(n)).push(p.id); for (const t of Object.keys(p.teams)) byTeam.set(`${t}|${n}`, p.id); }
    const idOf = new Map(), mm = (match[Y] = { min: 0, matched: 0 });
    for (const g of games) for (const p of g.players) if (p.min > 0) {
      const k = String(p.id);
      if (!idOf.has(k)) { const n = norm(p.name); idOf.set(k, byTeam.get(`${br(p.team)}|${n}`) || ((byName.get(n) || []).length === 1 ? byName.get(n)[0] : null)); }
      mm.min += p.min; if (idOf.get(k)) mm.matched += p.min;
    }
    // Every appearance, for the "gone" rule.
    const seen = new Map();
    for (const g of games) for (const p of g.players) if (p.min > 0) (seen.get(String(p.id)) || seen.set(String(p.id), []).get(String(p.id))).push([g.date, p.team]);
    const gone = (p, t, date) => { const nx = (seen.get(p) || []).find(([d]) => d >= date); return !!nx && nx[1] !== t; };
    const st = new Map();          // player → { cg, cmin, tmin: { team: minutes } }
    const teamG = {};
    const byDate = new Map();
    for (const g of games) (byDate.get(g.date) || byDate.set(g.date, []).get(g.date)).push(g);
    for (const [date, tonight] of byDate) {
      for (const g of tonight) {
        const parts = {};
        for (const T of [g.home, g.away]) {
          const on = new Map(g.players.filter(p => p.team === T && p.min > 0).map(p => [String(p.id), p]));
          const roster = new Set([...on.keys()]);
          for (const [p, s] of st) if (s.tmin[T] > 0 && !gone(p, T, date)) roster.add(p);
          const gT = teamG[T] || 0, items = [];
          for (const p of roster) {
            const s = st.get(p) || { cg: 0, cmin: 0, tmin: {} }, bid = idOf.get(p), pr = bid ? prior.get(bid) : null;
            const cur = s.cg ? s.cmin / s.cg : null;
            const mpg = pr && cur != null ? (pr.mpg * MIN_GAMES_K + cur * s.cg) / (MIN_GAMES_K + s.cg) : cur != null ? cur : pr ? pr.mpg : null;
            if (mpg == null || mpg <= 0) continue;
            const bpm = pr ? pr.bpm : REPL;
            const value = mpg >= MIN_MPG ? Math.max(0, bpm - REPL) * mpg / 48 * PACE / 100 * BPM_PTS : 0;
            items.push({ p, name: (on.get(p) || {}).name, plays: on.has(p), mpg, value, share: gT ? (s.tmin[T] || 0) / gT : 0, bpm });
          }
          // Tonight's minutes: baseline minutes in rotation order, capped at 240 for the team.
          let left = TEAM_MIN;
          for (const it of [...items].sort((a, b) => b.mpg - a.mpg)) { it.tonight = it.plays ? Math.max(0, Math.min(it.mpg, left)) : 0; left -= it.tonight; }
          // A = Σ v/m × (tonight − ((1 − w) m + w c)) = S1 + w × S2.
          let S1 = 0, S2 = 0;
          for (const it of items) { if (!it.value) continue; const vpm = it.value / it.mpg; S1 += vpm * (it.tonight - it.mpg); S2 += vpm * (it.mpg - it.share); }
          parts[T] = { S1, S2, gT, items };
        }
        feature.set(`${g.date}|${br(g.home)}|${br(g.away)}`, { id: String(g.id), home: parts[g.home], away: parts[g.away] });
      }
      for (const g of tonight) {
        for (const T of [g.home, g.away]) teamG[T] = (teamG[T] || 0) + 1;
        for (const p of g.players) if (p.min > 0) { const k = String(p.id), s = st.get(k) || { cg: 0, cmin: 0, tmin: {} }; s.cg++; s.cmin += p.min; s.tmin[p.team] = (s.tmin[p.team] || 0) + p.min; st.set(k, s); }
      }
    }
  }
  return { feature, match };
}

const teamA = (part, w) => Math.max(-CAP, Math.min(CAP, part.S1 + w * part.S2));

async function main() {
  const { feature, match } = await build();
  const W = EC.walk(), { games } = EC.espnGames();
  const base = EC.rowsFor(W, games, new Map(), 'engine').rows;
  const wOf = new Map(W.engine.filter(r => r.pH).map(r => [`${r.date}|${r.home}|${r.away}`, [r.pH.w, r.pA.w]]));
  const rows = [];
  let missing = 0;
  for (const r of base) {
    const k = `${r.date}|${r.home}|${r.away}`, f = feature.get(k), w = wOf.get(k);
    if (!f || !w) { missing++; continue; }
    const aH = teamA(f.home, w[0]), aA = teamA(f.away, w[1]), A = aH - aA, full = r.pred + A;
    rows.push({ ...r, A, aH, aA, full, gapFull: full - r.mkt, pFull: EC.normalCdf(full / 12.5), f });
  }
  console.log(`injury-close-1: ${rows.length} games with the feature (${missing} without); minutes matched to Basketball-Reference ${YEARS.map(y => `${y - 1}-${String(y).slice(2)} ${(100 * match[y].matched / match[y].min).toFixed(2)}%`).join(', ')}`);
  const sd = (xs) => { const m = xs.reduce((a, b) => a + b, 0) / xs.length; return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length); };
  console.log(`A (home − away): mean ${(rows.reduce((s, r) => s + r.A, 0) / rows.length).toFixed(2)}, sd ${sd(rows.map(r => r.A)).toFixed(2)}, |A| ≥ 1 in ${rows.filter(r => Math.abs(r.A) >= 1).length} games, team A at the ±${CAP} cap ${rows.filter(r => Math.abs(r.aH) >= CAP || Math.abs(r.aA) >= CAP).length}`);
  if (has('--check')) {
    const top = [...rows].sort((a, b) => Math.abs(b.A) - Math.abs(a.A)).slice(0, 4);
    for (const r of top) {
      console.log(`  ${r.date} ${r.away} @ ${r.home}: A ${r.A.toFixed(2)} (home ${r.aH.toFixed(2)}, away ${r.aA.toFixed(2)})`);
      for (const [lbl, part, w] of [[r.home, r.f.home, wOf.get(`${r.date}|${r.home}|${r.away}`)[0]], [r.away, r.f.away, wOf.get(`${r.date}|${r.home}|${r.away}`)[1]]]) {
        const out = part.items.filter(i => !i.plays && i.value > 0.5).sort((a, b) => b.value - a.value).slice(0, 4);
        console.log(`    ${lbl} w ${w.toFixed(2)}: out ${out.map(i => `${i.p} (bpm ${i.bpm.toFixed(1)}, ${i.mpg.toFixed(1)} mpg, value ${i.value.toFixed(1)}, share ${i.share.toFixed(1)})`).join(', ') || '—'}`);
      }
    }
    return;
  }

  const line = (lbl, s) => console.log(`  ${lbl.padEnd(32)} n ${String(s.n).padStart(5)}  slope ${s.b.toFixed(3).padStart(6)} ± ${s.se.toFixed(3)}  t ${s.t.toFixed(2).padStart(6)}`);
  const decide = (name, rs, key) => {
    const all = EC.slopeOf(rs, key), per = YEARS.map(y => EC.slopeOf(rs.filter(r => r.t === y), key)), pos = per.filter(s => s.b > 0).length;
    const pass = all.b > 0 && all.t >= 2 && pos >= 4;
    console.log(`\n${name}`); line('all five seasons', all); per.forEach((s, i) => line(`${YEARS[i] - 1}-${String(YEARS[i]).slice(2)}`, s));
    console.log(`  ${pass ? 'PASS' : 'no'}: slope > 0 with t ≥ 2 ${all.b > 0 && all.t >= 2 ? '✓' : '✗'}, positive in ≥ 4 of 5 ${pos >= 4 ? '✓' : '✗'} (${pos})${all.t <= -2 ? ' — significant negative slope (reported)' : ''}`);
    return pass;
  };
  let passes = 0;
  passes += decide('I1. Slope of resid on A (availability, home − away)', rows, 'A');
  passes += decide('I2. Slope of resid on the engine-with-availability gap', rows, 'gapFull');

  console.log('\nI4. pitch-3\'s rule on the engine with availability (5+ points over the no-vig close)');
  const legs = EC.p3Legs(rows.map(r => ({ ...r, pEng: r.pFull }))), rec = EC.legRecord(legs), pass4 = rec.z != null && rec.z >= 2; passes += pass4;
  const show = (lbl, x) => console.log(`  ${lbl.padEnd(14)} n ${String(x.n).padStart(5)}  won ${String(x.won).padStart(5)}  market expected ${x.exp.toFixed(1).padStart(7)}  z ${x.z.toFixed(2).padStart(6)}  return at the close ${(100 * x.roi).toFixed(1)}%`);
  show('5+ points', rec); show('8+ points', EC.legRecord(legs.filter(l => l.edge >= 0.08 - 1e-9))); show('5–8 points', EC.legRecord(legs.filter(l => l.edge < 0.08 - 1e-9)));
  console.log(`  ${pass4 ? 'PASS' : 'no'}: z ≥ 2 ${pass4 ? '✓' : '✗'}`);

  console.log('\nI3. Calibration (described): coefficient of A');
  const fitY = EC.ols(rows.map(r => [r.A]), rows.map(r => r.y - r.pred)), fitM = EC.ols(rows.map(r => [r.A]), rows.map(r => r.mkt - r.pred));
  console.log(`  results:  (actual − walk) ~ A   ${fitY.beta[1].toFixed(3)} ± ${fitY.se[1].toFixed(3)}   (the engine assumes 1.0)`);
  console.log(`  market:   (close − walk) ~ A    ${fitM.beta[1].toFixed(3)} ± ${fitM.se[1].toFixed(3)}`);
  YEARS.forEach(y => { const q = rows.filter(r => r.t === y), a = EC.ols(q.map(r => [r.A]), q.map(r => r.y - r.pred)), m = EC.ols(q.map(r => [r.A]), q.map(r => r.mkt - r.pred));
    console.log(`  ${y - 1}-${String(y).slice(2)}  results ${a.beta[1].toFixed(2)} ± ${a.se[1].toFixed(2)}   market ${m.beta[1].toFixed(2)} ± ${m.se[1].toFixed(2)}`); });

  console.log('\nAlso described');
  line('I1 on games with |A| ≥ 1', EC.slopeOf(rows.filter(r => Math.abs(r.A) >= 1), 'A'));
  for (const [w, f] of [['I1 games 0-5', r => r.gMin <= 5], ['I1 games 6-20', r => r.gMin > 5 && r.gMin <= 20], ['I1 games 21+', r => r.gMin > 20]]) line(w, EC.slopeOf(rows.filter(f), 'A'));
  const sorted = [...rows].sort((a, b) => Math.abs(a.resid) - Math.abs(b.resid)).slice(0, Math.floor(rows.length * 0.99));
  line('I1, 1% largest |resid| trimmed', EC.slopeOf(sorted, 'A'));
  line('I2, 1% largest |resid| trimmed', EC.slopeOf(sorted, 'gapFull'));
  const brier = (k) => { const q = rows.filter(r => r.y !== 0); return q.reduce((s, r) => s + (r[k] - (r.y > 0 ? 1 : 0)) ** 2, 0) / q.length; };
  console.log(`  Brier: engine with availability ${brier('pFull').toFixed(4)}, core alone ${brier('pEng').toFixed(4)}, market ${brier('pMkt').toFixed(4)}`);
  console.log(`\n${passes} of 3 pass.`);
}

module.exports = { build, priorsFor, norm, teamA };
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
