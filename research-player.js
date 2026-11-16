#!/usr/bin/env node
// ============================================================
// research-player.js — player patterns vs prop lines, 2022-26 (player-1)
// ============================================================
// Pre-registered in PLAYER_RESEARCH.md (commit 9cfa746, before this file was written).
// Data: ESPN game summaries (player box lines, positions, starters) and ESPN core odds propBets
// (points, rebounds, assists, threes; every book except live lines) for the 2022-23 … 2025-26
// regular seasons.
//
//   node research-player.js --fetch   player box lines and prop lines from ESPN (free), cached
//   node research-player.js --gate    the validity gate and data checks only, no features scored
//   node research-player.js           the decision table and descriptive checks
// ESPN only; the Odds API key is cleared, nothing spends credits.
// ============================================================
delete process.env.ODDS_API_KEY;
const fs = require('fs');
const path = require('path');
const { gameList, seasonOf } = require('./research-totals.js');

const DIR = path.join(__dirname, '.cache/espn-nba/player');
const SEASONS = ['2022-23', '2023-24', '2024-25', '2025-26'];
const TYPES = { 'Total Points': 'pts', 'Total Rebounds': 'reb', 'Total Assists': 'ast', 'Total 3-Point Field Goals': 'tpm' };
const has = (f) => process.argv.includes(f);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function getJson(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try { const res = await fetch(url, { signal: AbortSignal.timeout(30000) }); if (res.ok) return res.json(); if (res.status === 404) return null; throw new Error(`HTTP ${res.status}`); }
    catch (e) { if (attempt === 3) throw e; }
    await sleep(1500 * (attempt + 1));
  }
}
const games = () => gameList().filter(g => SEASONS.includes(seasonOf(g.date)));

// One game: the player box (box-ID.json) and the props (props-ID.json).
async function fetchGame(g) {
  const bf = path.join(DIR, `box-${g.id}.json`), pf = path.join(DIR, `props-${g.id}.json`);
  if (!fs.existsSync(bf)) {
    const s = await getJson(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${g.id}`);
    const players = [];
    for (const t of (s && s.boxscore && s.boxscore.players) || []) {
      const st = t.statistics[0], L = st.labels, ix = (k) => L.indexOf(k), pair = (v) => (v || '0-0').split('-').map(Number);
      for (const a of st.athletes) {
        const v = a.stats || [], played = !a.didNotPlay && v.length > 0;
        const [fgm, fga] = played ? pair(v[ix('FG')]) : [0, 0], [tpm, tpa] = played ? pair(v[ix('3PT')]) : [0, 0], [ftm, fta] = played ? pair(v[ix('FT')]) : [0, 0];
        players.push({ id: String(a.athlete.id), name: a.athlete.displayName, team: t.team.abbreviation, pos: a.athlete.position ? a.athlete.position.abbreviation : null,
          starter: !!a.starter, played, min: played ? +v[ix('MIN')] || 0 : 0, pts: played ? +v[ix('PTS')] || 0 : 0, reb: played ? +v[ix('REB')] || 0 : 0,
          ast: played ? +v[ix('AST')] || 0 : 0, tov: played ? +v[ix('TO')] || 0 : 0, fgm, fga, tpm, tpa, ftm, fta });
      }
    }
    fs.writeFileSync(bf, JSON.stringify({ id: g.id, date: g.date, home: g.home, away: g.away, hs: g.hs, as: g.as, tip: s && s.header ? s.header.competitions[0].date : null, players }));
  }
  if (!fs.existsSync(pf)) {
    const j = await getJson(`https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/events/${g.id}/competitions/${g.id}/odds`);
    const props = [];
    for (const item of ((j && j.items) || []).filter(i => i.propBets && i.provider && !/live/i.test(i.provider.name))) {
      let page = 1, pages = 1;
      do {
        const pb = await getJson(`${item.propBets.$ref}&limit=1000&page=${page}`);
        pages = (pb && pb.pageCount) || 1;
        for (const it of (pb && pb.items) || []) {
          const stat = TYPES[it.type && it.type.name];
          if (!stat || !it.current || !it.current.target) continue;
          const aid = ((it.athlete && it.athlete.$ref) || '').match(/athletes\/(\d+)/);
          props.push({ book: item.provider.name, athlete: aid ? aid[1] : null, stat, line: +it.current.target.value,
            open: it.open && it.open.target ? +it.open.target.value : null, over: it.current.over ? it.current.over.american : null, updated: it.lastUpdated || null });
        }
        page++;
      } while (page <= pages);
    }
    fs.writeFileSync(pf, JSON.stringify({ id: g.id, props }));
  }
}

async function fetchAll() {
  fs.mkdirSync(DIR, { recursive: true });
  const todo = games().filter(g => !fs.existsSync(path.join(DIR, `box-${g.id}.json`)) || !fs.existsSync(path.join(DIR, `props-${g.id}.json`)));
  let next = 0, failed = 0, done = 0;
  const worker = async () => {
    while (next < todo.length) {
      const g = todo[next++];
      try { await fetchGame(g); } catch (e) { failed++; }
      if (++done % 500 === 0) console.log(`  ${done}/${todo.length}`);
      await sleep(80);
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`${todo.length} games fetched (${failed} failed); files in ${path.relative(__dirname, DIR)}`);
}

// ── scoring ─────────────────────────────────────────────────────────
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const sd = (xs) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1)); };
const median = (xs) => { const q = [...xs].sort((a, b) => a - b), m = q.length >> 1; return q.length % 2 ? q[m] : (q[m - 1] + q[m]) / 2; };
const group = (pos) => !pos ? null : pos[0] === 'C' ? 'C' : /G/.test(pos) && !/^F/.test(pos) ? 'G' : pos[0] === 'F' ? 'F' : pos[0] === 'G' ? 'G' : null;

// Slope of y on x with an intercept; standard error clustered by `cl` (CR1, as in Stata's vce(cluster)).
function clusteredSlope(xs, ys, cl) {
  const n = xs.length, mx = mean(xs), my = mean(ys);
  let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  const b = sxy / sxx, a = my - b * mx, g = new Map();
  for (let i = 0; i < n; i++) { const e = ys[i] - a - b * xs[i]; g.set(cl[i], (g.get(cl[i]) || 0) + (xs[i] - mx) * e); }
  const G = g.size; let meat = 0; for (const v of g.values()) meat += v * v;
  const se = Math.sqrt(meat / (sxx * sxx) * (G / (G - 1)) * ((n - 1) / (n - 2)));
  return { b, se, t: b / se, n, clusters: G };
}

// Per prop: one line per book, then the median across books. A book usually stores an over and an under
// record at one line. Where it lists several lines (ESPN BET's alternates and milestone ladders, 2024-26), the
// main line is the priced line whose over price is closest to −110 (amendment, PLAYER_RESEARCH.md); with no
// priced line at a 40–65% implied chance, that book's prop is dropped.
const _implied = (a) => { const v = a == null ? null : /^even$/i.test(String(a)) ? 100 : +a; return v == null || !isFinite(v) || Math.abs(v) < 100 ? null : v < 0 ? -v / (-v + 100) : 100 / (v + 100); };
function mainLine(recs) {
  const lines = [...new Set(recs.map(r => r.line))];
  if (lines.length === 1) return recs[0];
  const priced = recs.map(r => ({ r, p: _implied(r.over) })).filter(x => x.p != null && x.p >= 0.40 && x.p <= 0.65);
  if (!priced.length) return null;
  return priced.sort((a, b) => Math.abs(a.p - 0.524) - Math.abs(b.p - 0.524))[0].r;
}
function lineOf(props) {
  const groups = new Map();
  for (const p of props) { const k = `${p.book}|${p.athlete}|${p.stat}`; (groups.get(k) || groups.set(k, []).get(k)).push(p); }
  const by = new Map();
  for (const [k, recs] of groups) { const m = mainLine(recs); if (m) by.set(k, m); }
  const out = new Map();
  for (const p of by.values()) { const k = `${p.athlete}|${p.stat}`; (out.get(k) || out.set(k, []).get(k)).push(p); }
  const res = new Map();
  for (const [k, ps] of out) { const opens = ps.map(p => p.open).filter(v => v != null); res.set(k, { line: median(ps.map(p => p.line)), open: opens.length ? median(opens) : null, books: ps.length }); }
  return res;
}

// Every scored player-game: the player played, has ≥ 5 prior games that season, and has a line for `stat`.
function build() {
  const out = [], counts = { games: 0, propsGames: 0 };
  for (const season of SEASONS) {
    const gs = games().filter(g => seasonOf(g.date) === season).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.id < b.id ? -1 : 1));
    const box = new Map(), props = new Map();
    for (const g of gs) {
      const bf = path.join(DIR, `box-${g.id}.json`), pf = path.join(DIR, `props-${g.id}.json`);
      if (!fs.existsSync(bf)) continue;
      box.set(g.id, JSON.parse(fs.readFileSync(bf, 'utf8')));
      if (fs.existsSync(pf)) props.set(g.id, lineOf(JSON.parse(fs.readFileSync(pf, 'utf8')).props));
    }
    const seen = new Map();   // player → [[date, team]] (situ-1's "gone" rule)
    for (const g of gs) for (const p of (box.get(g.id) || { players: [] }).players) if (p.played) (seen.get(p.id) || seen.set(p.id, []).get(p.id)).push([g.date, p.team]);
    const gone = (p, t, date) => { const nx = (seen.get(p) || []).find(([d]) => d >= date); return !!nx && nx[1] !== t; };
    const hist = new Map(), lastDate = {}, allowed = {}, lg = {};   // allowed[team][group] = {pts, n}; lg[group] = {pts, n} per team-game
    const byDate = new Map(); for (const g of gs) if (box.has(g.id)) (byDate.get(g.date) || byDate.set(g.date, []).get(g.date)).push(g);
    for (const [date, tonight] of byDate) {
      for (const g of tonight) {
        counts.games++;
        const b = box.get(g.id), L = props.get(g.id);
        if (L && L.size) counts.propsGames++;
        for (const p of b.players.filter(x => x.played)) {
          const h = hist.get(p.id) || [];
          const own = h.filter(x => x.team === p.team);
          if (h.length < 5) continue;
          const opp = p.team === b.home ? b.away : b.home, grp = group(p.pos);
          const last3 = h.slice(-3), before = h.slice(0, -3);
          const tm = (a) => a.length ? mean(a.map(x => x.min)) : null;
          // top-2 teammates by minutes per game (≥ 5 games for the team, still on it), out tonight
          const mates = new Map();
          for (const [pid, hh] of hist) { if (pid === p.id) continue; const t = hh.filter(x => x.team === p.team); if (t.length >= 5 && hh[hh.length - 1].team === p.team && !gone(pid, p.team, date)) mates.set(pid, mean(t.map(x => x.min))); }
          const top2 = [...mates].sort((x, y) => y[1] - x[1]).slice(0, 2).map(([pid]) => pid);
          const playing = new Set(b.players.filter(x => x.played && x.team === p.team).map(x => x.id));
          const a = allowed[opp] && grp && allowed[opp][grp], lgv = grp && lg[grp];
          const M = a && a.n && lgv && lgv.n ? (a.pts / a.n - lgv.pts / lgv.n) * a.n / (a.n + 10) : null;
          const row = { season, game: g.id, date, player: p.id, name: p.name, team: p.team, grp, starter: p.starter,
            H: before.length ? mean(last3.map(x => x.pts)) - mean(before.map(x => x.pts)) : null,
            F1: lastDate[p.team] && (Date.parse(date) - Date.parse(lastDate[p.team])) / 864e5 === 1 ? 1 : 0,
            F2: tm(last3) - tm(h), M, R: h[h.length - 1].min - tm(h), T: top2.some(pid => !playing.has(pid)) ? 1 : 0,
            base: { pts: mean(h.map(x => x.pts)), reb: mean(h.map(x => x.reb)), ast: mean(h.map(x => x.ast)), tpm: mean(h.map(x => x.tpm)) },
            actual: { pts: p.pts, reb: p.reb, ast: p.ast, tpm: p.tpm }, lines: {} };
          if (L) for (const st of ['pts', 'reb', 'ast', 'tpm']) { const l = L.get(`${p.id}|${st}`); if (l) row.lines[st] = l; }
          out.push(row);
        }
      }
      // tonight joins the history
      for (const g of tonight) {
        const b = box.get(g.id);
        for (const t of [b.home, b.away]) {
          lastDate[t] = date;
          const opp = t === b.home ? b.away : b.home, sums = { G: 0, F: 0, C: 0 };
          for (const p of b.players.filter(x => x.played && x.team === t)) { const gr = group(p.pos); if (gr) sums[gr] += p.pts; }
          const A = (allowed[opp] = allowed[opp] || { G: { pts: 0, n: 0 }, F: { pts: 0, n: 0 }, C: { pts: 0, n: 0 } });
          for (const gr of ['G', 'F', 'C']) { A[gr].pts += sums[gr]; A[gr].n++; const l = (lg[gr] = lg[gr] || { pts: 0, n: 0 }); l.pts += sums[gr]; l.n++; }
        }
        for (const p of b.players.filter(x => x.played)) (hist.get(p.id) || hist.set(p.id, []).get(p.id)).push({ date, team: p.team, min: p.min, pts: p.pts, reb: p.reb, ast: p.ast, tpm: p.tpm });
      }
    }
  }
  return { rows: out, counts };
}

// Amendment 2: train on 2023-24 closing lines; holdout on 2024-26 opening lines (some current lines there were updated in-game).
const TRAIN = ['2023-24'], HOLD = ['2024-25', '2025-26'];
const QS = [['P-H', 'H', -1, 'hot streak'], ['P-F1', 'F1', -1, 'back-to-back'], ['P-F2', 'F2', -1, 'minutes load'], ['P-M', 'M', 1, 'position matchup'], ['P-R', 'R', 1, 'role trend'], ['P-T', 'T', 1, 'top-2 teammate out']];

function main() {
  const { rows, counts } = build();
  const pts = rows.filter(r => r.lines.pts).map(r => ({ ...r, resid: r.actual.pts - r.lines.pts.line }));
  // Decided target (amendment 2): the closing line in train, the opening line in the holdout.
  const dec = rows.filter(r => r.lines.pts && (TRAIN.includes(r.season) || (HOLD.includes(r.season) && r.lines.pts.open != null)))
    .map(r => ({ ...r, resid: r.actual.pts - (TRAIN.includes(r.season) ? r.lines.pts.line : r.lines.pts.open) }));
  // Validity gate: current lines must not predict far better than opening lines.
  const both = pts.filter(r => r.lines.pts.open != null), eCur = both.map(r => r.actual.pts - r.lines.pts.line), eOpen = both.map(r => r.actual.pts - r.lines.pts.open);
  const gate = sd(eCur) >= 0.8 * sd(eOpen);
  console.log(`player-1: ${counts.games} games with box lines (${counts.propsGames} with props); ${rows.length} player-games with ≥ 5 prior games; ${pts.length} with a points line`);
  console.log(`by season (points lines): ${SEASONS.map(s => `${s} ${pts.filter(r => r.season === s).length}`).join(', ')}`);
  console.log(`\nValidity gate (points): sd(actual − current) ${sd(eCur).toFixed(3)} vs sd(actual − open) ${sd(eOpen).toFixed(3)} on ${both.length} props → ratio ${(sd(eCur) / sd(eOpen)).toFixed(3)} (fails below 0.8): ${gate ? 'PASSED' : 'FAILED — stop'}`);
  console.log(`  misses within 1 point ${(100 * eCur.filter(e => Math.abs(e) <= 1).length / eCur.length).toFixed(1)}% · line moved from open ${(100 * both.filter(r => r.lines.pts.open !== r.lines.pts.line).length / both.length).toFixed(1)}% · sd by season ${SEASONS.map(s => { const e = pts.filter(r => r.season === s).map(r => r.resid); return e.length > 1 ? `${s} ${sd(e).toFixed(2)}` : `${s} —`; }).join(', ')}`);
  if (!gate || process.argv.includes('--gate')) return;

  const winRate = (q, side) => { const w = q.filter(r => side > 0 ? r.resid > 0 : r.resid < 0).length, l = q.filter(r => side > 0 ? r.resid < 0 : r.resid > 0).length; return { w, l, rate: w / (w + l) }; };
  const top = (q, f) => { const x = q.filter(r => r[f] != null); if (f === 'F1' || f === 'T') return x.filter(r => r[f] === 1); const cut = [...x].sort((a, b) => a[f] - b[f])[Math.floor(x.length * 0.8)][f]; return x.filter(r => r[f] >= cut); };
  let passes = 0;
  console.log('\nDecisions (points resid vs the prop line; t clustered by game; edge = betting the favoured side on the top 20% / flagged games)');
  for (const [q, f, pred, label] of QS) {
    const tr = dec.filter(r => TRAIN.includes(r.season) && r[f] != null), ho = dec.filter(r => HOLD.includes(r.season) && r[f] != null);
    const T = clusteredSlope(tr.map(r => r[f]), tr.map(r => r.resid), tr.map(r => r.game)), H = ho.length > 30 ? clusteredSlope(ho.map(r => r[f]), ho.map(r => r.resid), ho.map(r => r.game)) : null;
    const side = Math.sign(T.t) || pred, eT = winRate(top(tr, f), side), eH = ho.length > 30 ? winRate(top(ho, f), side) : null;
    const pass = Math.abs(T.t) >= 2 && H && Math.sign(H.t) === Math.sign(T.t) && Math.abs(H.t) >= 1 && eT.rate > 0.524 && eH && eH.rate > 0.524;
    passes += pass ? 1 : 0;
    console.log(`  ${q.padEnd(5)} ${label.padEnd(20)} train t ${T.t.toFixed(2).padStart(6)} (slope ${T.b.toFixed(3)}, n ${T.n}, ${T.clusters} games) · holdout ${H ? `t ${H.t.toFixed(2).padStart(6)} (n ${H.n})` : `too few (${ho.length})`} · ${side > 0 ? 'over' : 'under'} on top: train ${(100 * eT.rate).toFixed(1)}% (${eT.w}-${eT.l})${eH ? `, holdout ${(100 * eH.rate).toFixed(1)}% (${eH.w}-${eH.l})` : ''} · ${pass ? (Math.sign(T.t) === pred ? 'PASS' : 'PASS (against the predicted sign)') : 'no'}`);
  }
  console.log('\nDescribed');
  for (const [lbl, q] of [['train (2023-24 close)', dec.filter(r => TRAIN.includes(r.season))], ['holdout (2024-26 open)', dec.filter(r => HOLD.includes(r.season))]]) { const w = winRate(q, 1); console.log(`  base rates, ${lbl}: n ${q.length}, overs ${(100 * w.rate).toFixed(1)}%, mean resid ${mean(q.map(r => r.resid)).toFixed(2)}`); }
  const op = rows.filter(r => r.lines.pts && r.lines.pts.open != null).map(r => ({ ...r, resid: r.actual.pts - r.lines.pts.open }));
  for (const s of ['2022-23', '2023-24']) { const x = op.filter(r => r.season === s); console.log(`  ${s} against OPENING lines (n ${x.length}): ` + QS.map(([q, f]) => { const y = x.filter(r => r[f] != null), c = clusteredSlope(y.map(r => r[f]), y.map(r => r.resid), y.map(r => r.game)); return `${q} t ${c.t.toFixed(1)}`; }).join(', ')); }
  const ov = winRate(pts, 1); console.log(`  points overs at the line, all: ${(100 * ov.rate).toFixed(1)}% (${ov.w}-${ov.l}); mean resid ${mean(pts.map(r => r.resid)).toFixed(2)}`);
  console.log('  against the player\'s own baseline (actual − season mean), does the feature move points at all? ' + QS.map(([q, f]) => { const x = rows.filter(r => r[f] != null), c = clusteredSlope(x.map(r => r[f]), x.map(r => r.actual.pts - r.base.pts), x.map(r => r.game)); return `${q} t ${c.t.toFixed(1)}`; }).join(', '));
  for (const st of ['reb', 'ast', 'tpm']) { const x = rows.filter(r => r.lines[st]).map(r => ({ ...r, resid: r.actual[st] - r.lines[st].line })); if (x.length < 100) continue;
    console.log(`  ${st} vs its line (n ${x.length}): ` + QS.map(([q, f]) => { const y = x.filter(r => r[f] != null), c = clusteredSlope(y.map(r => r[f]), y.map(r => r.resid), y.map(r => r.game)); return `${q} t ${c.t.toFixed(1)}`; }).join(', ')); }
  for (const s of SEASONS) { const x = pts.filter(r => r.season === s); if (x.length < 100) continue; console.log(`  ${s} (n ${x.length}): ` + QS.map(([q, f]) => { const y = x.filter(r => r[f] != null), c = clusteredSlope(y.map(r => r[f]), y.map(r => r.resid), y.map(r => r.game)); return `${q} t ${c.t.toFixed(1)}`; }).join(', ')); }
  for (const g of ['G', 'F', 'C']) { const x = pts.filter(r => r.grp === g); console.log(`  ${g} (n ${x.length}): ` + QS.map(([q, f]) => { const y = x.filter(r => r[f] != null), c = clusteredSlope(y.map(r => r[f]), y.map(r => r.resid), y.map(r => r.game)); return `${q} t ${c.t.toFixed(1)}`; }).join(', ')); }
  const trim = [...pts].sort((a, b) => Math.abs(a.resid) - Math.abs(b.resid)).slice(0, Math.floor(pts.length * 0.99));
  console.log('  1% largest |resid| trimmed: ' + QS.map(([q, f]) => { const y = trim.filter(r => r[f] != null), c = clusteredSlope(y.map(r => r[f]), y.map(r => r.resid), y.map(r => r.game)); return `${q} t ${c.t.toFixed(1)}`; }).join(', '));
  console.log(`\n${passes} of 6 pass.`);
}

module.exports = { games, fetchGame, build, clusteredSlope, lineOf, mainLine, group, DIR, SEASONS, TYPES };
if (require.main === module && !has('--fetch')) main();
if (require.main === module && has('--fetch')) fetchAll().catch(e => { console.error(e); process.exit(1); });
