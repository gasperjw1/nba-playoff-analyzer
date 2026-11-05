#!/usr/bin/env node
// ============================================================
// research-season-update.js — in-season updating, spread and home court, game by game
// ============================================================
// The engine predicts a game as
//   margin = rating(home) − rating(away) + HCA + rest
//   rating = (1 − w) × opening-night prior + w × this season's margin per game,  w = g / (g + K)
//   P(home) = Φ(margin / σ)
// with K = 20, HCA = 2.5, back-to-back −1.0, three-in-four −0.5, 3+ days off
// +0.5, σ = 12.5 — all priors from the
// literature, never fitted. This script walks every regular-season game of
// ten past seasons forward in date order (each prediction sees only earlier
// games) and asks which values the results support.
//
//   prior     research-season-prior.js's opening-night projection per team
//             (0.75 × last season + 240-capped roster + aging, per 100
//             possessions, centred per season), × the season's MOV per net
//             point — point-in-time
//   current   margin per game in the team's earlier games this season; the
//             "opponent-adjusted" variant adds each opponent's rating at the
//             time and removes home court
//   not here  injuries and roster changes game to game (no point-in-time
//             history of those), so every variant is missing the same thing
//
// Every value is chosen leave-one-season-out: each season is scored with
// the values that did best on the other nine.
//
//   node research-season-update.js
// ============================================================
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadSeason } = require('./research-team-fit.js');

const CACHE = path.join(__dirname, '.cache/bref');
const T0 = 2016, LAST = 2026;

const normalCdf = (z) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
};

// Regular-season games from Basketball-Reference schedule pages (the
// season page is the first month; the rest are linked month pages).
function loadGames(year, teamGames) {
  const files = fs.readdirSync(CACHE).filter(f => f === `NBA_${year}_games.html` || f.startsWith(`NBA_${year}_games-`));
  const seen = new Map();
  for (const f of files) {
    const html = fs.readFileSync(path.join(CACHE, f), 'utf8');
    const i0 = html.indexOf('id="schedule"');
    if (i0 < 0) continue;
    for (const tr of html.slice(i0, html.indexOf('</table>', i0)).split('<tr').slice(1)) {
      const id = /data-stat="date_game"[^>]*csk="(\d{8})\d([A-Z]{3})"/.exec(tr);
      const v = /data-stat="visitor_team_name"[^>]*><a href="\/teams\/([A-Z]{3})\//.exec(tr), h = /data-stat="home_team_name"[^>]*><a href="\/teams\/([A-Z]{3})\//.exec(tr);
      const vp = /data-stat="visitor_pts"\s*>(\d+)</.exec(tr), hp = /data-stat="home_pts"\s*>(\d+)</.exec(tr);
      if (!id || !v || !h || !vp || !hp) continue;
      const time = (/data-stat="game_start_time"\s*>([^<]*)</.exec(tr) || [])[1] || '';
      const cup = /data-stat="game_remarks"\s*>(In-Season Tournament|NBA Cup)</.test(tr);
      seen.set(`${id[1]}${h[1]}`, { date: `${id[1].slice(0, 4)}-${id[1].slice(4, 6)}-${id[1].slice(6)}`, time, home: h[1], away: v[1], hs: +hp[1], as: +vp[1], cup });
    }
  }
  let games = [...seen.values()].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  // The in-season tournament final does not count in the standings (every other Cup game does).
  const cupDates = games.filter(g => g.cup).map(g => g.date);
  if (cupDates.length) {
    const last = cupDates.sort().pop();
    if (games.filter(g => g.date === last).length === 1) games = games.filter(g => g.date !== last);
  }
  // Regular season = each team's first N games (play-in and playoffs come after).
  const n = {};
  return games.filter(g => {
    const ok = (n[g.home] || 0) < teamGames[g.home] && (n[g.away] || 0) < teamGames[g.away];
    if (ok) { n[g.home] = (n[g.home] || 0) + 1; n[g.away] = (n[g.away] || 0) + 1; }
    return ok;
  });
}

const daysBetween = (a, b) => (Date.parse(b) - Date.parse(a)) / 864e5;

async function main() {
  // Opening-night priors (point-in-time) from research-season-prior.js.
  const priorFile = path.join(__dirname, '.cache/research-opening-priors.json');
  execFileSync('node', [path.join(__dirname, 'research-season-prior.js')], { env: { ...process.env, ERR_OUT: priorFile }, stdio: 'ignore' });
  const priors = JSON.parse(fs.readFileSync(priorFile, 'utf8'));

  const seasons = [];
  for (let t = T0; t <= LAST; t++) {
    const S = await loadSeason(t);
    const teamGames = Object.fromEntries(Object.entries(S.rating).map(([T, r]) => [T, r.games]));
    // Points of margin per game per net-rating point (≈ pace / 100), from the season before (known at tip-off).
    const Sp = await loadSeason(t - 1);
    let sxy = 0, sxx = 0;
    for (const r of Object.values(Sp.rating)) { sxy += r.mov * r.nrtg; sxx += r.nrtg * r.nrtg; }
    const scale = sxy / sxx;
    const pr = priors.filter(p => p.t === t);
    const mean = pr.reduce((s, p) => s + p.p, 0) / pr.length;
    const prior = Object.fromEntries(pr.map(p => [p.T, (p.p - mean) * scale]));
    // Last season × retention only (no roster terms) — what the live engine can use for opponents.
    const mean1 = pr.reduce((s, p) => s + p.p1, 0) / pr.length;
    const priorLast = Object.fromEntries(pr.map(p => [p.T, 0.75 * (p.p1 - mean1) * scale]));
    const games = loadGames(t, teamGames);
    const expected = Object.values(teamGames).reduce((s, g) => s + g, 0) / 2;
    if (games.length !== expected) throw new Error(`${t}: ${games.length} games parsed, ${expected} expected`);
    seasons.push({ t, games, prior, priorLast, scale });
  }
  console.log(`${seasons.reduce((s, x) => s + x.games.length, 0)} regular-season games, ${T0 - 1}-${String(T0).slice(2)} … ${LAST - 1}-${String(LAST).slice(2)}`);

  // Walk a season forward; returns per-game { t, y (home margin), pred, gMin (fewer games played of the two) }.
  const walk = (S, o) => {
    const st = {};
    for (const T of Object.keys(S.prior)) st[T] = { g: 0, sum: 0, adj: 0, last: null, prev: null };
    const rating = (T) => {
      const s = st[T], w = s.g / (s.g + o.K);
      const cur = s.g ? (o.oppAdj ? s.adj : s.sum) / s.g : 0;
      // double: the engine run on NB.AI-style ratings, which already hold last season × (1 − w) +
      // this season × w (fitted on NB.AI's Nov 2, 2026 snapshot: 0.76 / 0.21 at ~6 games); the
      // engine then shrinks that by its retention and blends this season in again.
      if (o.double) return (1 - w) * ((1 - w) * S.prior[T] + 0.75 * w * cur) + w * cur;
      return (1 - w) * S.prior[T] * (o.priorScale == null ? 1 : o.priorScale) + w * cur;
    };
    const out = [];
    for (const g of S.games) {
      const H = st[g.home], A = st[g.away];
      // Engine order: back-to-back, else three games in four nights; plus 3+ days off.
      const rest = (s) => {
        if (s.last && daysBetween(s.last, g.date) === 1) return o.b2b;
        let r = 0;
        if (o.t34 && s.prev && daysBetween(s.prev, g.date) <= 3) r += o.t34;
        if (o.long && s.last && daysBetween(s.last, g.date) - 1 >= 3) r += o.long;
        return r;
      };
      const rh = rating(g.home), ra = rating(g.away);
      const pred = rh - ra + o.hca + rest(H) - rest(A);
      const y = g.hs - g.as;
      out.push({ t: S.t, y, pred, gMin: Math.min(H.g, A.g), date: g.date, home: g.home, away: g.away, hB2b: rest(H) !== 0 || (o.b2b === 0 && !!H.last && daysBetween(H.last, g.date) === 1), aB2b: rest(A) !== 0 || (o.b2b === 0 && !!A.last && daysBetween(A.last, g.date) === 1) });
      // Update after the game: raw margin, and margin adjusted for opponent strength and venue.
      H.sum += y; A.sum -= y;
      // Opponent strength for the adjustment: the full rating, or (oppLast) last season × retention
      // blended with this season's adjusted margins — the live form.
      const opp = (T) => { const s = st[T], w = s.g / (s.g + o.K); return (1 - w) * S.priorLast[T] + w * (s.g ? s.adj / s.g : 0); };
      const ra2 = o.oppLast ? opp(g.away) : ra, rh2 = o.oppLast ? opp(g.home) : rh;
      H.adj += y - o.hca + ra2; A.adj += -y + o.hca + rh2;
      H.g++; A.g++; H.prev = H.last; A.prev = A.last; H.last = g.date; A.last = g.date;
    }
    return out;
  };

  // research-season-rest.js input: every game's prediction with no rest term (engine values otherwise).
  if (process.env.REST_OUT) fs.writeFileSync(process.env.REST_OUT, JSON.stringify(seasons.flatMap(S => walk(S, { K: 20, hca: 2.0, b2b: 0, oppAdj: false }))));
  const ENGINE = { K: 20, hca: 2.5, b2b: -1.0, oppAdj: false };
  const mse = (rows) => rows.reduce((s, r) => s + (r.y - r.pred) ** 2, 0) / rows.length;
  const run = (o) => seasons.flatMap(S => walk(S, o));
  const grid = [];
  for (const K of [5, 10, 15, 20, 30, 40, 60]) for (const hca of [1.5, 2, 2.5, 3, 3.5]) for (const oppAdj of [false, true]) for (const b2b of [0, -1, -2, -3]) grid.push({ K, hca, b2b, oppAdj });
  const results = grid.map(o => ({ o, rows: run(o) }));
  const msBy = (rows, t) => { const r = rows.filter(x => x.t !== t); return mse(r); };

  // Leave-one-season-out choice.
  const loso = (allowed) => {
    const rows = [], picks = [];
    for (const S of seasons) {
      let best = null;
      for (const r of results) if (allowed(r.o) && (!best || msBy(r.rows, S.t) < msBy(best.rows, S.t))) best = r;
      picks.push(best.o);
      rows.push(...best.rows.filter(x => x.t === S.t));
    }
    return { rows, picks };
  };
  const eng = run(ENGINE);
  const paired = (a, b) => {
    const d = a.map((r, i) => (r.y - r.pred) ** 2 - (b[i].y - b[i].pred) ** 2);
    const m = d.reduce((s, x) => s + x, 0) / d.length, sd = Math.sqrt(d.reduce((s, x) => s + (x - m) ** 2, 0) / (d.length - 1));
    return `${m >= 0 ? '+' : ''}${m.toFixed(2)} ± ${(sd / Math.sqrt(d.length)).toFixed(2)}`;
  };
  const windows = [['games 0-5', r => r.gMin <= 5], ['games 6-20', r => r.gMin > 5 && r.gMin <= 20], ['games 21+', r => r.gMin > 20]];
  const line = (label, rows) => console.log(`  ${label.padEnd(46)} margin RMSE ${Math.sqrt(mse(rows)).toFixed(3)}  ` +
    windows.map(([w, f]) => `${w} ${Math.sqrt(mse(rows.filter(f))).toFixed(2)}`).join('  ') + (rows === eng ? '' : `   ΔMSE ${paired(rows, eng)}`));
  console.log('\n1. Margin error (points per game), each value chosen on the other nine seasons');
  line('engine as built (K 20, HCA 2.5, b2b −1, raw)', eng);
  const pk = (l, f) => [...new Set(l.picks.map(f))].join('/');
  const lK = loso(o => o.hca === 2.5 && o.b2b === -1 && !o.oppAdj);
  line(`K chosen (picks ${pk(lK, o => o.K)})`, lK.rows);
  const lH = loso(o => o.K === 20 && o.b2b === -1 && !o.oppAdj);
  line(`HCA chosen (picks ${pk(lH, o => o.hca)})`, lH.rows);
  const lB = loso(o => o.K === 20 && o.hca === 2.5 && !o.oppAdj);
  line(`back-to-back chosen (picks ${pk(lB, o => o.b2b)})`, lB.rows);
  const lA = loso(o => o.hca === 2.5 && o.b2b === -1 && o.oppAdj);
  line(`opponent-adjusted current, K chosen (picks ${pk(lA, o => o.K)})`, lA.rows);
  const lAll = loso(() => true);
  line(`all chosen together`, lAll.rows);
  console.log(`    picks: ${lAll.picks.map((o, i) => `${seasons[i].t - 1}-${String(seasons[i].t).slice(2)} K${o.K} HCA${o.hca} b2b${o.b2b}${o.oppAdj ? ' adj' : ''}`).join(' · ')}`);

  // Full-sample grid for K (others at engine values), to see the shape.
  console.log('\n  K, full sample (HCA 2.5, b2b −1):  ' + [5, 10, 15, 20, 30, 40, 60].map(K => {
    const raw = results.find(r => r.o.K === K && r.o.hca === 2.5 && r.o.b2b === -1 && !r.o.oppAdj).rows;
    const adj = results.find(r => r.o.K === K && r.o.hca === 2.5 && r.o.b2b === -1 && r.o.oppAdj).rows;
    return `${K}: ${Math.sqrt(mse(raw)).toFixed(3)} / adj ${Math.sqrt(mse(adj)).toFixed(3)}`;
  }).join('  '));
  console.log('  home court by season (mean margin − prediction without HCA):  ' + seasons.map(S => {
    const rows = eng.filter(r => r.t === S.t);
    return `${S.t - 1}-${String(S.t).slice(2)} ${(rows.reduce((s, r) => s + r.y - (r.pred - 2.5), 0) / rows.length).toFixed(1)}`;
  }).join('  '));

  // 1b. The engine's other rest terms (never tested before): three-in-four −0.5, 3+ days off +0.5.
  {
    const fixed = { K: 20, hca: 2.0, b2b: -2, oppAdj: false };
    const cand = [];
    for (const t34 of [0, -0.5, -1, -1.5]) for (const long of [0, 0.5, 1]) cand.push({ ...fixed, t34, long, rows: run({ ...fixed, t34, long }) });
    const base = cand.find(x => x.t34 === 0 && x.long === 0).rows, engR = cand.find(x => x.t34 === -0.5 && x.long === 0.5).rows;
    const picks = [], rows = [];
    for (const S of seasons) {
      let best = null;
      for (const x of cand) if (!best || msBy(x.rows, S.t) < msBy(best.rows, S.t)) best = x;
      picks.push(`${best.t34}/${best.long}`);
      rows.push(...best.rows.filter(r => r.t === S.t));
    }
    console.log('\n1b. Three-in-four and long rest (home court 2.0, back-to-back −2 fixed)');
    console.log(`  engine values (−0.5 / +0.5) vs neither: ΔMSE ${paired(engR, base)}`);
    console.log(`  chosen on the other seasons (three-in-four/long rest picks ${[...new Set(picks)].join(', ')}): ΔMSE vs engine values ${paired(rows, engR)}`);
    console.log('  full sample: ' + cand.map(x => `${x.t34}/${x.long} ${Math.sqrt(mse(x.rows)).toFixed(4)}`).join('  '));
  }

  // 1c. This season counted twice (the engine on NB.AI-style ratings) vs alternatives, current rest terms.
  {
    const R = { hca: 2.0, b2b: -2, t34: -0.5, long: 0.5, oppAdj: false };
    const variants = [
      ['engine (K 20, raw margins)', { ...R, K: 20 }],
      ['recreated NB.AI ratings: this season counted twice', { ...R, K: 20, double: true }],
      ['faster updating, K 10', { ...R, K: 10 }],
      ['K 15', { ...R, K: 15 }],
      ['K 15, opponent-adjusted', { ...R, K: 15, oppAdj: true }],
      ['K 20, opponent-adjusted', { ...R, K: 20, oppAdj: true }],
      ['K 20, opponent-adjusted, opponents by last season (live form)', { ...R, K: 20, oppAdj: true, oppLast: true }],
    ].map(([label, o]) => ({ label, o, rows: run(o) }));
    const eng = variants[0].rows;
    console.log('\n1c. Counting this season twice vs alternatives (HCA 2.0, rest −2/−0.5/+0.5)');
    for (const v of variants) console.log(`  ${v.label.padEnd(54)} RMSE ${Math.sqrt(mse(v.rows)).toFixed(4)}  ` +
      windows.map(([w, f]) => `${w} ${Math.sqrt(mse(v.rows.filter(f))).toFixed(3)}`).join('  ') + (v.rows === eng ? '' : `  ΔMSE vs engine ${paired(v.rows, eng)}`));
    const picks = [], rows = [];
    for (const S of seasons) {
      let best = null;
      for (const v of variants) if (!best || msBy(v.rows, S.t) < msBy(best.rows, S.t)) best = v;
      picks.push(best.label.split(':')[0]);
      rows.push(...best.rows.filter(r => r.t === S.t));
    }
    console.log(`  chosen on the other seasons (picks: ${[...new Set(picks)].join(' / ')}): ΔMSE vs engine ${paired(rows, eng)}`);
    const brierOf = (rows) => rows.reduce((t, r) => t + (normalCdf(r.pred / 12.5) - (r.y > 0 ? 1 : 0)) ** 2, 0) / rows.length;
    console.log('  Brier at σ 12.5: ' + variants.map(v => `${v.label.split(':')[0].split(',')[0]} ${brierOf(v.rows).toFixed(4)}`).join(' · '));
  }

  // 2. σ and calibration: P(home) = Φ(margin / σ), on the engine's margins and the best margins.
  const logloss = (rows, sig) => -rows.reduce((s, r) => { const p = Math.min(1 - 1e-9, Math.max(1e-9, normalCdf(r.pred / sig))); return s + (r.y > 0 ? Math.log(p) : Math.log(1 - p)); }, 0) / rows.length;
  const brier = (rows, sig) => rows.reduce((s, r) => s + (normalCdf(r.pred / sig) - (r.y > 0 ? 1 : 0)) ** 2, 0) / rows.length;
  const bestSig = (rows) => { let b = null; for (let s = 9; s <= 16.01; s += 0.25) { const l = logloss(rows, s); if (!b || l < b.l) b = { s, l }; } return b.s; };
  console.log('\n2. Spread σ (win probability = Φ(margin / σ)); σ chosen on the other nine seasons');
  for (const [label, rows] of [['engine as built', eng], ['all chosen together', lAll.rows]]) {
    const picked = seasons.map(S => bestSig(rows.filter(r => r.t !== S.t)));
    const scored = seasons.flatMap((S, i) => rows.filter(r => r.t === S.t).map(r => ({ ...r, sig: picked[i] })));
    const b12 = brier(rows, 12.5);
    const bL = scored.reduce((s, r) => s + (normalCdf(r.pred / r.sig) - (r.y > 0 ? 1 : 0)) ** 2, 0) / scored.length;
    console.log(`  ${label.padEnd(24)} σ picks ${[...new Set(picked)].join('/')}  Brier at 12.5 ${b12.toFixed(4)}  at chosen ${bL.toFixed(4)}  ` +
      windows.map(([w, f]) => `${w}: σ ${bestSig(rows.filter(f)).toFixed(2)} Brier@12.5 ${brier(rows.filter(f), 12.5).toFixed(4)}`).join('  '));
  }
  // Early-season calibration slope: logistic regression of the result on margin/12.5.
  const slope = (rows) => {
    let a = 0, b = 1;
    for (let it = 0; it < 50; it++) {
      let g0 = 0, g1 = 0, h00 = 0, h01 = 0, h11 = 0;
      for (const r of rows) {
        const x = r.pred / 12.5 * 1.7, p = 1 / (1 + Math.exp(-(a + b * x))), y = r.y > 0 ? 1 : 0, wt = p * (1 - p);
        g0 += y - p; g1 += (y - p) * x; h00 += wt; h01 += wt * x; h11 += wt * x * x;
      }
      const det = h00 * h11 - h01 * h01;
      a += (h11 * g0 - h01 * g1) / det; b += (h00 * g1 - h01 * g0) / det;
    }
    return b;
  };
  console.log('  calibration slope at σ 12.5 (1.0 = right; >1 = underconfident), engine as built: ' +
    windows.map(([w, f]) => `${w} ${slope(eng.filter(f)).toFixed(2)}`).join('  ') +
    '  · October–first two weeks: ' + slope(eng.filter(r => r.gMin <= 8)).toFixed(2) + ` (n ${eng.filter(r => r.gMin <= 8).length})`);
}

main().catch(e => { console.error('research-season-update failed:', e.stack); process.exit(1); });
