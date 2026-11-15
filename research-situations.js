#!/usr/bin/env node
// ============================================================
// research-situations.js — situational pockets vs the close (situ-1)
// ============================================================
// luck-sched-1 fitted one straight line per feature across every game. The user asked whether
// the edge is situational instead: a pocket (tired big favourites, a star's first game back,
// early tips for Western teams) the close misprices even if the average game is priced right.
//
// Stage 1, exploration (this file): 2023-24 → 2025-26, already seen by matchup-1 and luck-sched-1.
// Every situation alone, split by side and price, plus pairs of team situations. A pocket is
// "consistent" when it leans the same way in all three seasons and beats −110's break-even
// (52.4%) against the spread in each. The count is compared with shuffled residuals, which says
// how many consistent pockets noise alone produces.
// Stage 2, confirmation: the few pockets frozen in SITUATIONS_RESEARCH.md, scored once on
// 2021-22 + 2022-23 (never scored). Not in this file yet.
//
//   node research-situations.js --fetch-sched     tip times and national TV (ESPN scoreboards)
//   node research-situations.js                   the exploration scan
//   node research-situations.js --game <id>       one game's situations, for hand checks
// ESPN's free endpoints only. The Odds API key is cleared here, so nothing can spend credits.
// ============================================================
delete process.env.ODDS_API_KEY;
const fs = require('fs');
const path = require('path');
const { load, ARENA, usDst } = require('./research-luck-schedule.js');

const CACHE = path.join(__dirname, '.cache/espn-nba');
const HIST = path.join(CACHE, 'hist'), SCHED = path.join(CACHE, 'hist-sched.json');
const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/';
const SEASONS = ['2023-24', '2024-25', '2025-26'];
const MIN_PRIOR = 5, MIN_N = 150, MIN_SEASON_N = 30, BE = 0.524, SHUFFLES = 200;
const has = (f) => process.argv.includes(f);
const arg = (f) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : null; };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const day = (d) => Date.parse(d + 'T12:00:00Z') / 864e5;
const mean = (xs) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;

const DIVISION = {};
for (const [d, ts] of Object.entries({ ATL: 'BOS BKN NY PHI TOR', CEN: 'CHI CLE DET IND MIL', SE: 'ATL CHA MIA ORL WSH',
  NW: 'DEN MIN OKC POR UTAH', PAC: 'GS LAC LAL PHX SAC', SW: 'DAL HOU MEM NO SA' })) for (const t of ts.split(' ')) DIVISION[t] = d;
// Mid-season head-coach changes, 2023-26: the date the new or interim coach took over (news reports,
// checked 2026-11-15). SA is Popovich's stroke (a leave) and POR is Billups's leave, not firings.
const COACH_CHANGE = { '2023-24': { MIL: '2024-01-23', WSH: '2024-01-25', BKN: '2024-02-19' },
  '2024-25': { SA: '2024-11-02', SAC: '2024-12-27', MEM: '2025-03-28', DEN: '2025-04-08' },
  '2025-26': { POR: '2025-10-23', NO: '2025-11-15' } };
// The league's national partners and their simulcasts (truTV and Max carried TNT games; NBCSN, NBC's).
// NBA TV, ESPN+ and Canada's TSN aren't counted.
const NATIONAL = /^(ESPN|ESPN2|ABC|TNT|TBS|truTV|HBO Max|Max|NBC|NBCSN|Peacock|Prime Video|Amazon Prime Video)$/i;

// Situations. 'side' ones belong to one team (a pocket uses games where only that team has it);
// 'game' ones are the same for both teams, so a pocket picks a side by venue or price.
const SIDE = {
  b2b: 'back-to-back', b2bRoad: 'back-to-back on the road', b2bOT: 'back-to-back after overtime', three4: '3 games in 4 nights',
  restAdv2: '2+ more rest days than the opponent', east2: 'moved 2+ zones east', west2: 'moved 2+ zones west',
  trip5: 'game 5+ of a road trip', homeAfterTrip: 'first home game after 3+ on the road',
  win4: 'won 4+ straight', lose4: 'lost 4+ straight', hot5: 'hot 3P% last 5 (+4 pts vs season)', cold5: 'cold 3P% last 5 (−4 pts)',
  starBack: "a top-2 player's first game back (5+ missed)", starOut1: "a top-2 player's first game out",
  starters2Out: '2+ of the top 5 out (played in the last 10)', newPlayer: 'a traded-in 20-minute player, first 5 games',
  letdown: 'after beating a top-8 team or winning as an 8+ underdog', bounce: 'after losing by 20+',
  revenge: 'lost the last meeting by 15+', lookahead: 'bottom-8 opponent, top-8 opponent next (within 2 days)',
  earlyWest: 'Western team, early tip (before 5 PM ET) in the East', earlyEast: 'Eastern team, early tip in the Pacific zone',
  homeDog1: 'home underdog by 1–3.5', homeDog4: 'home underdog by 4–7.5', homeDog8: 'home underdog by 8+', coach: 'first 10 games under a new coach',
};
const GAME = { tv: 'national TV', division: 'division game', rematch: 'same two teams twice in a row', early: 'early tip (before 5 PM ET)',
  first4w: 'first 4 weeks of the season', last3w: 'last 3 weeks of the season', postAsb: 'first game after the All-Star break' };
// Pairs within a family are near-duplicates (one implies the other), so they're skipped.
const FAMILY = { b2b: 'b2b', b2bRoad: 'b2b', b2bOT: 'b2b', three4: 'b2b', homeDog1: 'dog', homeDog4: 'dog', homeDog8: 'dog', homeAfterTrip: 'trip', trip5: 'trip',
  win4: 'streak', lose4: 'streak', hot5: 'shoot', cold5: 'shoot', east2: 'tz', west2: 'tz' };
const CUTS = {
  any: () => true, home: (s) => s.home, away: (s) => !s.home,
  bigFav: (s) => s.spread <= -7, smallFav: (s) => s.spread < 0 && s.spread > -7, smallDog: (s) => s.spread > 0 && s.spread < 7, bigDog: (s) => s.spread >= 7,
};
const GAME_CUTS = ['home', 'bigFav', 'smallFav'];   // the away and underdog cuts mirror these

// ── tip times and national TV, from ESPN's scoreboards ──────────────
async function fetchSched() {
  const out = fs.existsSync(SCHED) ? JSON.parse(fs.readFileSync(SCHED, 'utf8')) : {};
  const { seasons } = load();
  const have = new Set(Object.values(out).map(x => x.date));
  const todo = [...new Set(Object.values(seasons).flatMap(s => s.games.map(g => g.date)))].filter(d => !have.has(d)).sort();
  let next = 0, failed = 0;
  const worker = async () => {
    while (next < todo.length) {
      const d = todo[next++];
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const res = await fetch(`${ESPN}scoreboard?dates=${d.replace(/-/g, '')}`, { signal: AbortSignal.timeout(30000) });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          for (const e of (await res.json()).events || []) {
            const c = e.competitions[0];
            out[e.id] = { date: d, tip: e.date, tv: (c.broadcasts || []).filter(b => b.market === 'national').flatMap(b => b.names || []) };
          }
          break;
        } catch (e) { if (attempt === 3) failed++; else await sleep(1500 * (attempt + 1)); }
      }
      await sleep(120);
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  fs.writeFileSync(SCHED, JSON.stringify(out));
  console.log(`${todo.length} dates fetched (${failed} failed); ${Object.keys(out).length} games in ${path.relative(__dirname, SCHED)}`);
}

// Minutes per player from the cached box scores (absent or 0 minutes = didn't play).
const played = (id) => {
  const f = path.join(HIST, `box-${id}.json`);
  const m = new Map();
  if (fs.existsSync(f)) for (const p of JSON.parse(fs.readFileSync(f, 'utf8')).players) if (p.min > 0) m.set(String(p.id), { team: p.team, min: p.min });
  return m;
};
// Tip time in US Eastern minutes after midnight.
const etMinutes = (tip, date) => { const t = new Date(tip); return ((t.getUTCHours() - (usDst(date) ? 4 : 5) + 24) % 24) * 60 + t.getUTCMinutes(); };

// ── one season → scored games with each side's situations ──────────
function build(seasonName, season, sched) {
  const games = season.games;
  const opener = games[0].date, finale = games[games.length - 1].date;
  const dates = [...new Set(games.map(g => g.date))];
  let asb = null, widest = 0;   // All-Star break: the longest gap between game dates in February
  for (let i = 1; i < dates.length; i++) if (dates[i].slice(5, 7) === '02' && day(dates[i]) - day(dates[i - 1]) > widest) { widest = day(dates[i]) - day(dates[i - 1]); asb = dates[i]; }
  const coachDate = COACH_CHANGE[seasonName] || {};
  const teamSched = {};   // team → its games in order (the schedule is public, so next game is fair)
  for (const g of games) for (const t of [g.home, g.away]) (teamSched[t] = teamSched[t] || []).push(g);
  const hist = {};        // team → [{ date, home, loc, opp, margin, ot, spread, oppRank, tpm, tpa }]
  const stats = {};       // player → team → { gp, min, last (team game index last played) }
  const curTeam = new Map();
  // A player is gone from a team once his next appearance is for another team (a trade, or waived and
  // signed elsewhere). Trades are public before tip, so this isn't using the result.
  const seen = new Map();   // player → [[date, team]] in date order
  for (const g of games) for (const [p, x] of played(g.id)) (seen.get(p) || seen.set(p, []).get(p)).push([g.date, x.team]);
  const gone = (p, t, date) => { const nx = (seen.get(p) || []).find(([d]) => d >= date); return !!nx && nx[1] !== t; };
  const out = [];
  const byDate = new Map();
  for (const g of games) (byDate.get(g.date) || byDate.set(g.date, []).get(g.date)).push(g);

  for (const [date, tonight] of byDate) {
    // Ranks by mean margin over prior games (teams with ≥ MIN_PRIOR), 1 = best.
    const avg = Object.entries(hist).filter(([, G]) => G.length >= MIN_PRIOR).map(([t, G]) => [t, mean(G.map(x => x.margin))]).sort((a, b) => b[1] - a[1]);
    const rank = new Map(avg.map(([t], i) => [t, i + 1])), nRanked = avg.length;
    const top8 = (t) => rank.has(t) && rank.get(t) <= 8, bottom8 = (t) => rank.has(t) && rank.get(t) > nRanked - 8;
    const box = new Map(tonight.map(g => [g.id, played(g.id)]));

    const side = (g, t, opp, home) => {
      const G = hist[t] || [];
      if (G.length < MIN_PRIOR) return null;
      const last = G[G.length - 1], gap = day(date) - day(last.date), s = new Set();
      const idx = G.length, on = box.get(g.id);
      const plays = (p) => on.has(p) && on.get(p).team === t;
      const rest = Math.min(3, Math.max(0, gap - 1));
      if (gap === 1) { s.add('b2b'); if (!home) s.add('b2bRoad'); if (last.ot) s.add('b2bOT'); }
      if (G.filter(x => day(date) - day(x.date) <= 3).length >= 2) s.add('three4');
      const east = ARENA[g.home][2] - ARENA[last.loc][2];
      if (east >= 2) s.add('east2'); if (east <= -2) s.add('west2');
      let road = 0; for (let i = G.length - 1; i >= 0 && !G[i].home; i--) road++;
      if (!home && road >= 4) s.add('trip5');
      if (home && road >= 3) s.add('homeAfterTrip');
      let streak = 0; for (let i = G.length - 1; i >= 0 && (G[i].margin > 0) === (last.margin > 0); i--) streak++;
      if (streak >= 4) s.add(last.margin > 0 ? 'win4' : 'lose4');
      const r5 = G.slice(-5), tp5 = r5.reduce((a, x) => a + x.tpm, 0) / r5.reduce((a, x) => a + x.tpa, 0), tpS = G.reduce((a, x) => a + x.tpm, 0) / G.reduce((a, x) => a + x.tpa, 0);
      if (tp5 - tpS >= 0.04) s.add('hot5'); if (tp5 - tpS <= -0.04) s.add('cold5');
      // Players still on this team (last seen here), by minutes per game with ≥ 5 games for it.
      const roster = [...curTeam].filter(([p, tm]) => tm === t && !gone(p, t, date)).map(([p]) => [p, stats[p][t]]).filter(([, x]) => x.gp >= 5)
        .sort((a, b) => b[1].min / b[1].gp - a[1].min / a[1].gp);
      const stars = roster.slice(0, 2), top5 = roster.slice(0, 5);
      if (stars.some(([p, x]) => plays(p) && idx - x.last - 1 >= 5)) s.add('starBack');
      if (stars.some(([p, x]) => !plays(p) && x.last === idx - 1)) s.add('starOut1');
      if (top5.filter(([p, x]) => !plays(p) && idx - x.last - 1 <= 10).length >= 2) s.add('starters2Out');
      for (const [p, o] of on) {
        if (o.team !== t || (stats[p] && stats[p][t] && stats[p][t].gp >= 5)) continue;
        if (Object.entries(stats[p] || {}).some(([tm, x]) => tm !== t && x.gp >= 10 && x.min / x.gp >= 20)) { s.add('newPlayer'); break; }
      }
      if (last.margin > 0 && (last.oppRank != null && last.oppRank <= 8 || last.spread != null && last.spread >= 8)) s.add('letdown');
      if (last.margin <= -20) s.add('bounce');
      const met = G.filter(x => x.opp === opp);
      if (met.length && met[met.length - 1].margin <= -15) s.add('revenge');
      const ts = teamSched[t], next = ts[ts.indexOf(g) + 1];
      if (bottom8(opp) && next && day(next.date) - day(date) <= 2 && top8(next.home === t ? next.away : next.home)) s.add('lookahead');
      const sc = sched[g.id];
      if (sc && etMinutes(sc.tip, date) < 17 * 60) {
        if (ARENA[t][2] <= -7 && ARENA[g.home][2] === -5) s.add('earlyWest');
        if (ARENA[t][2] === -5 && ARENA[g.home][2] === -8) s.add('earlyEast');
      }
      if (coachDate[t] && date >= coachDate[t] && G.filter(x => x.date >= coachDate[t]).length < 10) s.add('coach');
      return { s, rest, lastOpp: last.opp, lastDate: last.date };
    };

    for (const g of tonight) {
      const c = season.close.get(g.id);
      const H = side(g, g.home, g.away, true), A = side(g, g.away, g.home, false);
      if (c && H && A) {
        if (H.rest - A.rest >= 2) H.s.add('restAdv2'); if (A.rest - H.rest >= 2) A.s.add('restAdv2');
        const sp = c.spreadHome;
        if (sp >= 1 && sp <= 3.5) H.s.add('homeDog1'); else if (sp >= 4 && sp <= 7.5) H.s.add('homeDog4'); else if (sp >= 8) H.s.add('homeDog8');
        const gs = new Set(), sc = sched[g.id];
        if (sc && sc.tv.some(n => NATIONAL.test(n))) gs.add('tv');
        if (DIVISION[g.home] === DIVISION[g.away]) gs.add('division');
        if (H.lastOpp === g.away && A.lastOpp === g.home) gs.add('rematch');
        if (sc && etMinutes(sc.tip, date) < 17 * 60) gs.add('early');
        if (day(date) - day(opener) <= 28) gs.add('first4w');
        if (day(finale) - day(date) <= 21) gs.add('last3w');
        if (asb && date >= asb && H.lastDate < asb && A.lastDate < asb) gs.add('postAsb');
        out.push({ id: g.id, date, season: seasonName, home: g.home, away: g.away, spreadHome: sp, resid: (g.hs - g.as) + sp, H: H.s, A: A.s, G: gs, tv: sc ? sc.tv : null, tip: sc ? sc.tip : null });
      }
    }
    // Tonight's games join the history.
    for (const g of tonight) {
      const c = season.close.get(g.id), on = box.get(g.id);
      for (const [t, o, own, home] of [[g.home, g.away, g.H, true], [g.away, g.home, g.A, false]]) {
        const G = (hist[t] = hist[t] || []);
        for (const [p, x] of on) if (x.team === t) {
          const st = ((stats[p] = stats[p] || {})[t] = stats[p][t] || { gp: 0, min: 0, last: -1 });
          st.gp++; st.min += x.min; st.last = G.length; curTeam.set(p, t);
        }
        G.push({ date, home, loc: g.home, opp: o, margin: home ? g.hs - g.as : g.as - g.hs, ot: own.q.length > 4,
          spread: c ? (home ? c.spreadHome : -c.spreadHome) : null, oppRank: rank.get(o) ?? null, tpm: own.tpm, tpa: own.tpa });
      }
    }
  }
  return { rows: out, asb, opener, finale };
}

// ── pockets ─────────────────────────────────────────────────────────
// A pocket is a list of [row index, sign]: +1 scores the home side's residual, −1 the away side's.
function pockets(rows, minN = MIN_N) {
  const list = [], sigs = new Set();
  const sideOf = (r, home) => ({ home, spread: home ? r.spreadHome : -r.spreadHome, s: home ? r.H : r.A, o: home ? r.A : r.H });
  const add = (key, label, test) => {
    const m = [];
    rows.forEach((r, i) => { for (const home of [true, false]) if (test(sideOf(r, home), r)) m.push([i, home ? 1 : -1]); });
    const sig = m.map(x => x.join(':')).join(',');   // a cut with the same games as an earlier one adds nothing
    if (m.length >= minN && !sigs.has(sig)) { sigs.add(sig); list.push({ key, label, m }); }
  };
  for (const [c, label] of Object.entries(SIDE)) for (const [cut, f] of Object.entries(CUTS))
    add(`${c}|${cut}`, `${label}${cut === 'any' ? '' : ` · ${cut}`}`, (s) => s.s.has(c) && !s.o.has(c) && f(s));
  for (const [c, label] of Object.entries(GAME)) for (const cut of GAME_CUTS)
    add(`${c}|${cut}`, `${label} · ${cut}`, (s, r) => r.G.has(c) && CUTS[cut](s));
  const keys = Object.keys(SIDE);
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    const a = keys[i], b = keys[j];
    if (FAMILY[a] && FAMILY[a] === FAMILY[b]) continue;
    add(`${a}+${b}`, `${SIDE[a]} + ${SIDE[b]}`, (s) => s.s.has(a) && s.s.has(b) && !(s.o.has(a) && s.o.has(b)));
  }
  return list;
}

// One pocket's record from a residual vector (home residual per row).
function score(p, rows, resid) {
  const by = {}, all = [];
  for (const [i, sg] of p.m) {
    const x = sg * resid[i], s = (by[rows[i].season] = by[rows[i].season] || { n: 0, sum: 0, cov: 0, lost: 0 });
    s.n++; s.sum += x; if (x > 0) s.cov++; else if (x < 0) s.lost++;
    all.push(x);
  }
  const m = mean(all), sd = Math.sqrt(all.reduce((a, x) => a + (x - m) ** 2, 0) / (all.length - 1));
  const dir = m >= 0 ? 1 : -1;
  const seasons = SEASONS.map(n => { const s = by[n] || { n: 0, sum: 0, cov: 0, lost: 0 };
    return { n: s.n, mean: s.n ? s.sum / s.n : null, rate: s.cov + s.lost ? (dir > 0 ? s.cov : s.lost) / (s.cov + s.lost) : null }; });
  const consistent = seasons.every(s => s.n >= MIN_SEASON_N && Math.sign(s.mean) === dir && s.rate >= BE);
  const sorted = [...all].sort((a, b) => a - b);
  return { n: all.length, mean: m, t: m / (sd / Math.sqrt(all.length)), median: sorted[Math.floor(sorted.length / 2)], dir, seasons, consistent,
    minRate: Math.min(...seasons.map(s => s.rate ?? 0)) };
}

// Shuffle the residuals within each season (keeps every pocket's membership, breaks any link to the result).
function shuffled(rows, resid, rnd) {
  const out = resid.slice();
  for (const n of SEASONS) {
    const ix = rows.map((r, i) => (r.season === n ? i : -1)).filter(i => i >= 0), vals = ix.map(i => resid[i]);
    for (let k = vals.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [vals[k], vals[j]] = [vals[j], vals[k]]; }
    ix.forEach((i, k) => { out[i] = vals[k]; });
  }
  return out;
}
const mulberry = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

function main() {
  const sched = fs.existsSync(SCHED) ? JSON.parse(fs.readFileSync(SCHED, 'utf8')) : null;
  if (!sched) { console.log('No tip times yet: run  node research-situations.js --fetch-sched  first.'); process.exit(1); }
  const { seasons } = load();
  const built = SEASONS.map(n => build(n, seasons[n], sched));
  const rows = built.flatMap(b => b.rows);
  const one = arg('--game');
  if (one) {
    const r = rows.find(x => x.id === String(one));
    if (!r) return console.log(`game ${one} isn't scored (no close, or a team with < ${MIN_PRIOR} prior games)`);
    return console.log(`${r.date} ${r.away} @ ${r.home}  spreadHome ${r.spreadHome}  home resid ${r.resid}  tip ${r.tip}  tv ${JSON.stringify(r.tv)}\n` +
      `  ${r.home}: ${[...r.H].join(', ') || '—'}\n  ${r.away}: ${[...r.A].join(', ') || '—'}\n  game: ${[...r.G].join(', ') || '—'}`);
  }
  built.forEach((b, i) => console.log(`${SEASONS[i]}: ${b.rows.length} games scored, ${b.opener} → ${b.finale}, All-Star return ${b.asb}`));
  console.log(`no tip time for ${rows.filter(r => !r.tip).length} games`);
  // How often each situation fires (sides), to sanity-check the definitions.
  const freq = {};
  for (const r of rows) { for (const c of [...r.H, ...r.A]) freq[c] = (freq[c] || 0) + 1; for (const c of r.G) freq[c] = (freq[c] || 0) + 1; }
  console.log('\nHow often each situation fires (team sides; game situations count games):');
  for (const c of [...Object.keys(SIDE), ...Object.keys(GAME)]) console.log(`  ${c.padEnd(14)} ${String(freq[c] || 0).padStart(5)}  ${SIDE[c] || GAME[c]}`);

  const ps = pockets(rows), resid = rows.map(r => r.resid);
  const res = ps.map(p => ({ p, s: score(p, rows, resid) }));
  const hits = res.filter(x => x.s.consistent).sort((a, b) => Math.abs(b.s.t) - Math.abs(a.s.t));
  const rnd = mulberry(20261115), nullCounts = [], nullT = [];
  for (let k = 0; k < SHUFFLES; k++) {
    const rs = shuffled(rows, resid, rnd);
    const ok = ps.map(p => score(p, rows, rs)).filter(s => s.consistent);
    nullCounts.push(ok.length); nullT.push(ok.length ? Math.max(...ok.map(s => Math.abs(s.t))) : 0);
  }
  nullCounts.sort((a, b) => a - b); nullT.sort((a, b) => a - b);
  const q = (xs, p) => xs[Math.min(xs.length - 1, Math.floor(p * xs.length))];
  console.log(`\n${rows.length} games, ${ps.length} pockets with ≥ ${MIN_N} sides (situations alone and by cut, and pairs).`);
  console.log(`Consistent (same lean all 3 seasons, ≥ ${(BE * 100).toFixed(1)}% vs the spread in each, ≥ ${MIN_SEASON_N} a season): ${hits.length}`);
  console.log(`Noise alone (${SHUFFLES} shuffles): median ${q(nullCounts, 0.5)}, 95th percentile ${q(nullCounts, 0.95)}; largest |t| among them: median ${q(nullT, 0.5).toFixed(2)}, 95th ${q(nullT, 0.95).toFixed(2)}`);
  const pct = (x) => x == null ? '  —  ' : (x * 100).toFixed(1).padStart(5);
  console.log('\nConsistent pockets, by |t| (lean: + = bet the team in the situation, − = fade it):');
  console.log('  pocket'.padEnd(78) + '    n   mean  median     t   ' + SEASONS.map(s => s.slice(2)).join('   '));
  for (const { p, s } of hits) console.log(`  ${p.label.slice(0, 74).padEnd(76)}${String(s.n).padStart(5)} ${(s.mean >= 0 ? '+' : '') + s.mean.toFixed(2).padStart(5)} ${s.median.toFixed(1).padStart(6)} ${s.t.toFixed(2).padStart(6)}  ` +
    s.seasons.map(x => `${pct(x.rate)}/${String(x.n).padStart(3)}`).join(' '));
  // Situations too rare for the scan (under MIN_N sides), alone: described, not ranked.
  console.log(`\nRare situations (under ${MIN_N} sides; described only):`);
  for (const [c, label] of [...Object.entries(SIDE), ...Object.entries(GAME)]) {
    const isSide = !!SIDE[c], m = [];
    rows.forEach((r, i) => { if (isSide) { if (r.H.has(c) && !r.A.has(c)) m.push([i, 1]); if (r.A.has(c) && !r.H.has(c)) m.push([i, -1]); } else if (r.G.has(c)) m.push([i, r.spreadHome <= 0 ? 1 : -1]); });
    if (m.length >= MIN_N || m.length < 2) continue;
    const s = score({ m }, rows, resid);
    console.log(`  ${(label + (isSide ? '' : ' · favourite')).padEnd(76)}${String(s.n).padStart(5)} ${(s.mean >= 0 ? '+' : '') + s.mean.toFixed(2).padStart(5)} ${s.t.toFixed(2).padStart(6)}  ` + s.seasons.map(x => `${pct(x.rate)}/${String(x.n).padStart(3)}`).join(' '));
  }
  if (has('--all')) {
    console.log('\nEvery pocket by |t|:');
    for (const { p, s } of res.sort((a, b) => Math.abs(b.s.t) - Math.abs(a.s.t)).slice(0, 60)) console.log(`  ${p.label.slice(0, 74).padEnd(76)}${String(s.n).padStart(5)} ${s.mean.toFixed(2).padStart(6)} ${s.t.toFixed(2).padStart(6)}  ` + s.seasons.map(x => `${pct(x.rate)}/${String(x.n).padStart(3)}`).join(' ') + (s.consistent ? '  ✓' : ''));
  }
}

module.exports = { build, pockets, score, SIDE, GAME, COACH_CHANGE };
if (require.main === module) (has('--fetch-sched') ? fetchSched() : Promise.resolve(main())).catch(e => { console.error(e); process.exit(1); });
