#!/usr/bin/env node
// ============================================================
// research-absence-roles.js — who replaces an absent player, the roles lost, and the matchup (absence-1)
// ============================================================
// Pre-registered in ABSENCE_ROLES_RESEARCH.md. Built on injury-close-1's rotation replica (the same
// roster, minutes and BPM prior; its A is reproduced exactly once All-Star games are dropped), with
// prior-season Basketball-Reference profiles only.
//
//   node research-absence-roles.js           2021-22 … 2025-26 (the exploration; ESPN boxes old/ + hist/)
//   node research-absence-roles.js --check   2015-16 … 2020-21 features only (coverage, match rates), no results
//   node research-absence-roles.js --hold    2015-16 … 2020-21, the pre-registered holdout (scored once)
// Cached data only (.cache/espn-nba/early-box from ESPN summaries); the Odds API key is cleared.
// ============================================================
delete process.env.ODDS_API_KEY;
const fs = require('fs'), path = require('path');
const { loadSeason } = require('./research-team-fit.js');
const EC = require('./research-engine-close.js');
const IC = require('./research-injury-close.js');

const has = (f) => process.argv.includes(f);
const ERA = has('--hold') || has('--check') ? 'hold' : 'dev';
const YEARS = ERA === 'hold' ? [2016, 2017, 2018, 2019, 2020, 2021] : [2022, 2023, 2024, 2025, 2026];
const DIRS = ERA === 'hold' ? [path.join(__dirname, '.cache/espn-nba/early-box')] : [path.join(__dirname, '.cache/espn-nba/old'), path.join(__dirname, '.cache/espn-nba/hist')];
const REPL = -2.0, REGRESS = 300, W1 = 1.0, W2 = 0.5, MIN_GAMES_K = 4, MIN_MPG = 8, PACE = 99, BPM_PTS = 0.885, TEAM_MIN = 240, CAP = 12, MAXMIN = 42, K3 = 750;
const B = { GS: 'GSW', NY: 'NYK', SA: 'SAS', NO: 'NOP', UTAH: 'UTA', WSH: 'WAS', BKN: 'BRK', CHA: 'CHO', PHX: 'PHO' };
const br = (a) => B[a] || a;
const SHORT = {};   // games dropped for missing minutes, by season
const NBA30 = new Set('ATL BOS BKN CHA CHI CLE DAL DEN DET GS HOU IND LAC LAL MEM MIA MIL MIN NO NY OKC ORL PHI PHX POR SAC SA TOR UTAH WSH'.split(' '));
const norm = IC.norm;
const pts = (bpmMin) => bpmMin / 48 * PACE / 100 * BPM_PTS;   // Σ minutes × BPM → points per game

// Prior-season profile per B-Ref player: regressed BPM (as injury-close-1), mpg, and role rates.
function profiles(Sy1, Sy2) {
  const acc = new Map();
  let lg3m = 0, lg3a = 0, lgMp = 0;
  for (const p of Sy1.players.values()) { const t = p.total; if (t && t.mp > 0) { lg3m += t.fg3; lg3a += t.fg3a; lgMp += t.mp; } }
  const lg3pm36 = lg3m / lgMp * 36;
  for (const [S, w] of [[Sy1, W1], [Sy2, W2]]) for (const p of S.players.values()) {
    const t = p.total; if (!t || !(t.mp > 0) || !(t.g > 0)) continue;
    const e = acc.get(p.id) || { bpmMp: 0, mpW: 0, gW: 0, mpTot: 0, f3: 0, a3: 0, mp3: 0, ast: 0, trb: 0, dbpm: 0, rMp: 0 };
    if (t.bpm != null) { e.bpmMp += t.bpm * t.mp * w; e.mpW += t.mp * w; }
    e.gW += t.g * w; e.mpTot += t.mp * w;
    e.f3 += t.fg3 * w; e.a3 += t.fg3a * w; e.mp3 += t.mp * w;
    if (t.ast != null && t.trb != null && t.dbpm != null) { e.ast += t.ast * t.mp * w; e.trb += t.trb * t.mp * w; e.dbpm += t.dbpm * t.mp * w; e.rMp += t.mp * w; }
    acc.set(p.id, e);
  }
  const out = new Map();
  for (const [id, e] of acc) out.set(id, {
    bpm: (e.bpmMp + REPL * REGRESS) / (e.mpW + REGRESS), mpg: e.mpTot / e.gW,
    tpm36: (e.f3 + lg3pm36 / 36 * K3) / (e.mp3 + K3) * 36,            // 3PM per 36, shrunk to league with 750 minutes
    ast: e.rMp ? e.ast / e.rMp : null, trb: e.rMp ? e.trb / e.rMp : null, dbpm: e.rMp ? e.dbpm / e.rMp : null });
  return { out, lg3pm36 };
}

// Minutes: rotation order capped at 240 (the engine), then — for the replacement-aware version — scaled up to 240.
function capRotation(list) { let left = TEAM_MIN; for (const it of [...list].sort((a, b) => b.mpg - a.mpg)) { it.m = Math.max(0, Math.min(it.mpg, left)); left -= it.m; } }
function fillTo240(list) {
  for (let k = 0; k < 20; k++) {
    const tot = list.reduce((s, it) => s + it.m, 0); if (tot >= TEAM_MIN - 1e-6 || !list.length) return;
    const open = list.filter(it => it.m < MAXMIN - 1e-9); if (!open.length) return;
    const base = open.reduce((s, it) => s + it.m, 0) || open.length;
    for (const it of open) it.m = Math.min(MAXMIN, it.m + (TEAM_MIN - tot) * (it.m || 1) / base);
  }
}
const sum = (list, f) => list.reduce((s, it) => s + f(it), 0);

async function build() {
  const S = {};
  for (let y = YEARS[0] - 2; y <= YEARS[YEARS.length - 1]; y++) S[y] = await loadSeason(y);
  const bySeason = {};
  for (const dir of DIRS) for (const f of fs.readdirSync(dir).filter(f => f.startsWith('box-'))) {
    const b = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (!NBA30.has(b.home) || !NBA30.has(b.away)) continue;   // All-Star games (LEB, DUR, GIA, SHQ, CHK, KEN, CAN, STARS, STRIPES, WORLD, EAST, WEST …)
    // ESPN has no minutes for about 1 in 7 games in 2015-18: a game counts only when each team has 5+ players and 200+ minutes.
    // Short games are dropped entirely — not scored and not in any minutes history.
    if (![b.home, b.away].every(t => { const m = b.players.filter(p => p.team === t && p.min > 0); return m.length >= 5 && m.reduce((s, p) => s + p.min, 0) >= 200; })) { SHORT[seasonOf(b.date)] = (SHORT[seasonOf(b.date)] || 0) + 1; continue; }
    const Y = seasonOf(b.date); if (!YEARS.includes(Y)) continue;
    (bySeason[Y] = bySeason[Y] || []).push(b);
  }
  const feature = new Map(), match = {};
  for (const Y of YEARS) {
    const games = (bySeason[Y] || []).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : String(a.id) < String(b.id) ? -1 : 1));
    const { out: prof, lg3pm36 } = profiles(S[Y - 1], S[Y - 2]);
    // League means of the role rates (prior-season players with 500+ minutes), for rookies and centring.
    const pool = [...prof.values()].filter(p => p.ast != null && p.mpg * 20 > 500);
    const rookie = { bpm: REPL, tpm36: lg3pm36 * 0.85, ast: mean(pool.map(p => p.ast)), trb: mean(pool.map(p => p.trb)), dbpm: -1 };
    const byTeam = new Map(), byName = new Map();
    for (const p of S[Y].players.values()) { const n = norm(p.name); (byName.get(n) || byName.set(n, []).get(n)).push(p.id); for (const t of Object.keys(p.teams)) byTeam.set(`${t}|${n}`, p.id); }
    const idOf = new Map(), mm = (match[Y] = { min: 0, matched: 0 });
    for (const g of games) for (const p of g.players) if (p.min > 0) {
      const k = String(p.id);
      if (!idOf.has(k)) { const n = norm(p.name); idOf.set(k, byTeam.get(`${br(p.team)}|${n}`) || ((byName.get(n) || []).length === 1 ? byName.get(n)[0] : null)); }
      mm.min += p.min; if (idOf.get(k)) mm.matched += p.min;
    }
    const seen = new Map();
    for (const g of games) for (const p of g.players) if (p.min > 0) (seen.get(String(p.id)) || seen.set(String(p.id), []).get(String(p.id))).push([g.date, p.team]);
    const gone = (p, t, date) => { const nx = (seen.get(p) || []).find(([d]) => d >= date); return !!nx && nx[1] !== t; };
    const st = new Map(), teamG = {}, byDate = new Map();
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
            const s = st.get(p) || { cg: 0, cmin: 0, tmin: {} }, bid = idOf.get(p), pr = bid ? prof.get(bid) : null;
            const cur = s.cg ? s.cmin / s.cg : null;
            const mpg = pr && cur != null ? (pr.mpg * MIN_GAMES_K + cur * s.cg) / (MIN_GAMES_K + s.cg) : cur != null ? cur : pr ? pr.mpg : null;
            if (mpg == null || mpg <= 0) continue;
            const q = pr || rookie, bpm = pr ? pr.bpm : REPL;
            const value = mpg >= MIN_MPG ? Math.max(0, bpm - REPL) * mpg / 48 * PACE / 100 * BPM_PTS : 0;
            items.push({ p, plays: on.has(p), mpg, value, share: gT ? (s.tmin[T] || 0) / gT : 0, bpm, tpm36: q.tpm36, ast: q.ast ?? rookie.ast, trb: q.trb ?? rookie.trb, dbpm: q.dbpm ?? rookie.dbpm });
          }
          // The replica's A parts (injury-close-1), for the control and the cross-check.
          // Rotation-capped tonight minutes exactly as the replica: players who sit get 0 and take none of the 240.
          const playing = items.filter(it => it.plays).map(it => ({ ...it }));
          let left = TEAM_MIN; for (const it of [...playing].sort((a, b) => b.mpg - a.mpg)) { it.m = Math.max(0, Math.min(it.mpg, left)); left -= it.m; }
          const capBy = new Map(playing.map(it => [it.p, it.m]));
          let S1 = 0, S2 = 0;
          for (const it of items) { if (!it.value) continue; const vpm = it.value / it.mpg; S1 += vpm * ((capBy.get(it.p) || 0) - it.mpg); S2 += vpm * (it.mpg - it.share); }
          // Full strength and tonight, both filled to 240 at each player's own level (replacement-aware).
          const full = items.map(it => ({ ...it })); capRotation(full); fillTo240(full);
          const tn = playing.map(it => ({ ...it })); fillTo240(tn);
          const tal = (L) => pts(sum(L, it => it.m * it.bpm));
          const absent = items.filter(it => !it.plays);
          const fullBy = new Map(full.map(it => [it.p, it]));
          // Engine-style take for tonight's absences vs full strength: floored value, freed minutes at replacement level.
          const dA = -sum(absent, it => (it.value / it.mpg || 0) * (fullBy.get(it.p).m));
          const dR = tal(tn) - tal(full);
          const role = (L, f) => sum(L, it => it.m * f(it)) / TEAM_MIN;
          parts[T] = {
            S1, S2, gT, dA, dR,
            d3: sum(tn, it => it.m * it.tpm36 / 36) - sum(full, it => it.m * it.tpm36 / 36),     // expected 3PM per game, tonight − full
            dAst: role(tn, it => it.ast) - role(full, it => it.ast), dTrb: role(tn, it => it.trb) - role(full, it => it.trb), dDef: role(tn, it => it.dbpm) - role(full, it => it.dbpm),
            dep3: sum(full, it => it.m * it.tpm36 / 36),                                          // full-strength 3PM per game (reliance on threes)
            trbNow: role(tn, it => it.trb), lgTrb: rookie.trb,
            nOut: absent.filter(it => it.mpg >= 15 && (fullBy.get(it.p).m >= 10)).length,
            nOutPos: absent.filter(it => it.mpg >= 8 && it.bpm < (tn.length ? sum(tn, x => x.m * x.bpm) / sum(tn, x => x.m) : 0)).length,
            items: absent.map(it => ({ p: it.p, mpg: it.mpg, share: it.share, bpm: it.bpm, value: it.value, m: fullBy.get(it.p).m })),
          };
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
function mean(xs) { return xs.reduce((a, b) => a + b, 0) / xs.length; }
function seasonOf(d) { const y = +d.slice(0, 4), m = +d.slice(5, 7);
  if (y === 2020 && m >= 7 && m <= 10) return 2020;      // the 2020 bubble restart belongs to 2019-20
  if (y === 2020 && m >= 12) return 2021;                // 2020-21 started Dec 22, 2020
  return m >= 8 ? y + 1 : y; }

async function rows() {
  const { feature, match } = await build();
  const W = EC.walk();
  const games = ERA === 'hold' ? EC.earlyGames().games : EC.espnGames().games;
  const base = EC.rowsFor(W, games, new Map(), 'engine', YEARS).rows;
  const wOf = new Map(W.engine.filter(r => r.pH).map(r => [`${r.date}|${r.home}|${r.away}`, [r.pH.w, r.pA.w]]));
  const out = []; let missing = 0;
  for (const r of base) {
    const k = `${r.date}|${r.home}|${r.away}`, f = feature.get(k), w = wOf.get(k);
    if (!f || !w) { missing++; continue; }
    const h = f.home, a = f.away, A = IC.teamA(h, w[0]) - IC.teamA(a, w[1]);
    out.push({ ...r, A, f,
      X1: (h.dR - h.dA) - (a.dR - a.dA), dR: h.dR - a.dR, dA: h.dA - a.dA,
      X2: h.d3 - a.d3, X2ast: h.dAst - a.dAst, X2trb: h.dTrb - a.dTrb, X2def: h.dDef - a.dDef,
      dep: [h.dep3, a.dep3], trbNow: [h.trbNow, a.trbNow], lgTrb: h.lgTrb,
      nOut: [h.nOut, a.nOut],
      // last turn's depth definition: absent with 15+ mpg and 10+ minutes in the rating ((1 − w) × mpg + w × this season's share)
      nDepth: [h.items.filter(i => i.value > 0 && i.mpg >= 15 && (1 - w[0]) * i.mpg + w[0] * i.share >= 10).length, a.items.filter(i => i.value > 0 && i.mpg >= 15 && (1 - w[1]) * i.mpg + w[1] * i.share >= 10).length] });
  }
  // Synergy and matchup interactions, centred on this era's means.
  const m3 = mean(out.flatMap(r => r.dep));
  for (const r of out) {
    const h = r.f.home, a = r.f.away;
    r.X3 = h.d3 * (r.dep[0] - m3) - a.d3 * (r.dep[1] - m3);                  // shooting lost × how much the team relies on threes
    r.X4 = h.dTrb * (r.trbNow[1] - r.lgTrb) - a.dTrb * (r.trbNow[0] - r.lgTrb); // rebounding lost × the opponent's rebounding tonight
  }
  return { rows: out, match, missing };
}
// ── scoring ─────────────────────────────────────────────────────────
const meanSe = (xs) => { const m = mean(xs), sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length); return { m, se: sd / Math.sqrt(xs.length), n: xs.length, t: m / (sd / Math.sqrt(xs.length)) }; };
const depleted = (r) => (r.nDepth[0] >= 3 && r.nDepth[1] <= 1) ? 1 : (r.nDepth[1] >= 3 && r.nDepth[0] <= 1) ? -1 : 0;
// Team-games where the engine-style take is a loss of 0.5+ points but the replacement-aware view says the team is better.
function positiveAbsences(R) {
  const out = [];
  for (const r of R) for (const [s, sg] of [['home', 1], ['away', -1]]) {
    const p = r.f[s];
    if (p.items.length && p.dA < -0.5 && p.dR > 0) out.push({ r, sg, res: sg * (r.y - r.mkt), core: sg * (r.y - r.pred), dA: p.dA, dR: p.dR });
  }
  return out;
}
// Winners against the close's spread-implied chance (the 2015-21 moneylines are a different snapshot from the spreads).
function winners(list) {
  let won = 0, exp = 0, v = 0, n = 0;
  for (const { r, sg } of list) { if (r.y === 0) continue; const pH = EC.normalCdf(r.mkt / 12.5), p = sg > 0 ? pH : 1 - pH; won += (sg > 0 ? r.y > 0 : r.y < 0) ? 1 : 0; exp += p; v += p * (1 - p); n++; }
  return { n, won, exp, z: v ? (won - exp) / Math.sqrt(v) : null };
}

async function main() {
  const { rows: R, match, missing } = await rows();
  const label = (t) => `${t - 1}-${String(t).slice(2)}`;
  const sd = (xs) => Math.sqrt(xs.reduce((a, b) => a + (b - mean(xs)) ** 2, 0) / xs.length);
  console.log(`absence-1 ${ERA === 'hold' ? 'HOLDOUT 2015-21' : 'exploration 2021-26'}: ${R.length} games with a close and the features (${missing} without); minutes matched ${YEARS.map(y => `${label(y)} ${(100 * match[y].matched / match[y].min).toFixed(2)}%`).join(', ')}`);
  console.log(`  feature sds: A ${sd(R.map(r => r.A)).toFixed(2)}, dA ${sd(R.map(r => r.dA)).toFixed(2)}, dR ${sd(R.map(r => r.dR)).toFixed(2)}, X2 ${sd(R.map(r => r.X2)).toFixed(2)}, X3 ${sd(R.map(r => r.X3)).toFixed(2)}, X4 ${sd(R.map(r => r.X4)).toFixed(2)}`);
  const P = positiveAbsences(R), D = R.filter(r => depleted(r) !== 0);
  console.log(`  depleted games (3+ rotation out vs ≤ 1): ${D.length}; positive-absence team-games: ${P.length}; games dropped for missing minutes: ${JSON.stringify(SHORT)}`);
  if (has('--check')) return;

  const fit = (q, keys, yk) => { const f = EC.ols(q.map(r => keys.map(k => r[k])), q.map(yk)); return keys.map((k, i) => ({ k, b: f.beta[i + 1], se: f.se[i + 1], t: f.beta[i + 1] / f.se[i + 1] })); };
  const fmt = (x) => `${x.b >= 0 ? ' ' : ''}${x.b.toFixed(3)} ± ${x.se.toFixed(3)}  t ${x.t.toFixed(2).padStart(6)}`;
  const fmtM = (x) => `${x.m >= 0 ? ' ' : ''}${x.m.toFixed(2)} ± ${x.se.toFixed(2)} pts  t ${x.t.toFixed(2).padStart(6)}  n ${x.n}`;

  console.log('\nQ1. Depth: the depleted side (3+ rotation players out, the other ≤ 1), result minus the closing spread');
  const q1 = meanSe(D.map(r => depleted(r) * (r.y - r.mkt)));
  console.log(`  all            ${fmtM(q1)}`);
  YEARS.forEach(y => { const q = D.filter(r => r.t === y); if (q.length > 2) console.log(`  ${label(y)}        ${fmtM(meanSe(q.map(r => depleted(r) * (r.y - r.mkt))))}`); });
  const w1 = winners(D.map(r => ({ r, sg: depleted(r) })));
  console.log(`  winners (described): won ${w1.won} of ${w1.n}, the close's spread implied ${w1.exp.toFixed(1)}, z ${w1.z.toFixed(2)}`);
  const pass1 = q1.m < 0 && q1.t <= -2;
  console.log(`  ${pass1 ? 'HOLDS' : 'does not hold'}: mean < 0 with t ≤ −2`);

  console.log('\nQ2. Absences that should help: engine-style take −0.5 or worse, replacement-aware view better; that team\'s result minus the close');
  const q2 = meanSe(P.map(x => x.res));
  console.log(`  all            ${fmtM(q2)}   (engine-style ${mean(P.map(x => x.dA)).toFixed(2)}, replacement-aware ${mean(P.map(x => x.dR)).toFixed(2)}; result − core ${mean(P.map(x => x.core)).toFixed(2)})`);
  YEARS.forEach(y => { const q = P.filter(x => x.r.t === y); if (q.length > 2) console.log(`  ${label(y)}        ${fmtM(meanSe(q.map(x => x.res)))}`); });
  const w2 = winners(P);
  console.log(`  winners (described): won ${w2.won} of ${w2.n}, the close's spread implied ${w2.exp.toFixed(1)}, z ${w2.z.toFixed(2)}`);
  const pass2 = q2.m > 0 && q2.t >= 2;
  console.log(`  ${pass2 ? 'HOLDS' : 'does not hold'}: mean > 0 with t ≥ 2`);

  console.log('\nQ3. Results beyond the core: (actual − walk) ~ engine-style dA + replacement-aware dR');
  const q3 = fit(R, ['dA', 'dR'], r => r.y - r.pred);
  console.log(`  dA ${fmt(q3[0])}\n  dR ${fmt(q3[1])}`);
  const pass3 = q3[1].b > 0 && q3[1].t >= 2;
  console.log(`  ${pass3 ? 'HOLDS' : 'does not hold'}: coefficient on dR > 0 with t ≥ 2`);

  console.log('\nQ4. Defence lost: result minus the close ~ A + the change in minute-weighted defensive BPM (home − away)');
  const q4 = fit(R, ['A', 'X2def'], r => r.y - r.mkt)[1];
  console.log(`  X2def ${fmt(q4)}`);
  YEARS.forEach(y => { const q = R.filter(r => r.t === y); console.log(`  ${label(y)}     ${fmt(fit(q, ['A', 'X2def'], r => r.y - r.mkt)[1])}`); });
  const pass4 = q4.b > 0 && q4.t >= 2;
  console.log(`  ${pass4 ? 'HOLDS' : 'does not hold'}: coefficient > 0 with t ≥ 2`);

  console.log('\nDescribed (no decision): result minus the close on');
  for (const [l, keys] of [['X1 replacement correction | A', ['A', 'X1']], ['X2 shooting lost | A', ['A', 'X2']], ['X2 playmaking lost | A', ['A', 'X2ast']], ['X2 rebounding lost | A', ['A', 'X2trb']],
    ['X3 shooting × reliance on threes | A, X2', ['A', 'X2', 'X3']], ['X4 rebounding × opponent rebounding | A, X2trb', ['A', 'X2trb', 'X4']]]) {
    console.log(`  ${l.padEnd(48)} ${fmt(fit(R, keys, r => r.y - r.mkt).slice(-1)[0])}`);
  }
  if (ERA === 'dev') for (const [lbl, q] of [['2021-24', R.filter(r => r.t <= 2024)], ['2024-26', R.filter(r => r.t >= 2025)]]) {
    console.log(`\n  ${lbl}: Q1 ${fmtM(meanSe(q.filter(r => depleted(r)).map(r => depleted(r) * (r.y - r.mkt))))} · Q2 ${fmtM(meanSe(positiveAbsences(q).map(x => x.res)))}`);
    const f3 = fit(q, ['dA', 'dR'], r => r.y - r.pred); console.log(`           Q3 dR ${fmt(f3[1])}`);
    for (const [l, keys] of [['X2 shooting', ['A', 'X2']], ['X2 defence', ['A', 'X2def']], ['X3 synergy', ['A', 'X2', 'X3']], ['X4 matchup', ['A', 'X2trb', 'X4']]]) console.log(`           ${l.padEnd(12)} ${fmt(fit(q, keys, r => r.y - r.mkt).slice(-1)[0])}`);
  }
  if (ERA === 'hold') {
    const all = [['Q1', pass1, q1.t], ['Q2', pass2, q2.t], ['Q3', pass3, q3[1].t], ['Q4', pass4, q4.t]];
    console.log(`\n${all.filter(x => x[1]).length} of 4 hold (t ≥ 2 in the registered direction). Past the four-question correction (|t| ≥ 2.24): ${all.filter(x => x[1] && Math.abs(x[2]) >= 2.24).map(x => x[0]).join(', ') || 'none'}.`);
  }
}

module.exports = { rows, build, positiveAbsences, depleted };
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
