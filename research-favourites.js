#!/usr/bin/env node
// ============================================================
// research-favourites.js — what makes a moneyline favourite safe or unsafe?
// ============================================================
// Data for a daily safe moneyline ticket (TODO.md): every regular-season
// game of 2023-24, 2024-25 and 2025-26 with
//   market     the closing moneyline from ESPN's core odds feed — DraftKings
//              where it is listed (2023-24), else ESPN BET (2024-25, 2025-26);
//              the book is kept on every game and never mixed within a measure
//   engine     the point-in-time prediction research-season-update.js walks
//              (opening-night prior + this season's margins, K = 20, home
//              court 2.0, back-to-back −2.0, σ 12.5) — the live engine without
//              its game-by-game roster and injury steps, which have no history
//   situation  rest days and back-to-backs for both teams, home or road,
//              each team's games played (early season)
//
//   node research-favourites.js --fetch   fetch and cache the odds (.cache/espn-nba/hist-odds)
//   node research-favourites.js           build the dataset and run the pre-registered analysis
//
// Pre-registered before the first run (committed before any result was seen):
//   split       train 2023-24 + 2024-25; holdout 2025-26 (looked at once, after the train results)
//   favourite   the market's side at the close (no-vig); "agreed" when the engine also has it ≥ 50%;
//               agreed score = the lower of the two chances
//   Q1  calibration of market favourites by probability bucket (sanity: the close should be calibrated)
//   Q2  favourites' win rate minus the market's chance ("excess"), engine agreeing vs not, and by the
//       engine − market gap
//   Q3  excess by situation: favourite at home / on the road, favourite on a back-to-back, underdog
//       on a back-to-back, rest advantage (favourite's days off minus the underdog's ≥ 1 / ≤ −1),
//       early season (either team with fewer than 10 games)
//   Q4  nightly 3-leg tickets on nights with 3+ games: the market's 3 strongest favourites vs the 3
//       highest agreed scores (one leg per game); hit rate against the market's expected rate; the
//       share of nights where all 3 legs are ≥ 70% by both
//   decision    a situation becomes a filter for the safe moneyline recipe only if its excess is
//               |z| ≥ 2 on train AND has the same sign with |z| ≥ 1 on the holdout. Everything else
//               is reported, not used.
// ============================================================
const fs = require('fs');
const path = require('path');

const HIST = path.join(__dirname, '.cache/espn-nba/hist');
const ODDS = path.join(__dirname, '.cache/espn-nba/hist-odds');
const has = (f) => process.argv.includes(f);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function histGames() {
  return fs.readdirSync(HIST).filter(f => f.startsWith('box-')).map(f => JSON.parse(fs.readFileSync(path.join(HIST, f), 'utf8')))
    .map(b => ({ id: b.id, date: b.date, home: b.home, away: b.away, hs: b.hs, as: b.as, season: b.date < '2024-07-01' ? '2023-24' : b.date < '2025-07-01' ? '2024-25' : '2025-26' }));
}

// One game's odds, trimmed to what the research needs: per provider the moneylines (current,
// open, close) and the spread.
async function fetchOdds(id) {
  const f = path.join(ODDS, `odds-${id}.json`);
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  const url = `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/events/${id}/competitions/${id}/odds`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (res.status === 404) { const out = { id, providers: [] }; fs.writeFileSync(f, JSON.stringify(out)); return out; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      const ml = (o) => { const v = o && o.moneyLine; if (v == null) return null; const a = typeof v === 'object' ? Number(v.american) : Number(v); return isFinite(a) ? a : null; };
      const providers = (j.items || []).map(i => ({ name: i.provider && i.provider.name, home: ml(i.homeTeamOdds), away: ml(i.awayTeamOdds),
        openHome: ml(i.homeTeamOdds && i.homeTeamOdds.open), openAway: ml(i.awayTeamOdds && i.awayTeamOdds.open),
        closeHome: ml(i.homeTeamOdds && i.homeTeamOdds.close), closeAway: ml(i.awayTeamOdds && i.awayTeamOdds.close), spread: i.spread ?? null }));
      const out = { id, providers };
      fs.writeFileSync(f, JSON.stringify(out));
      return out;
    } catch (e) { if (attempt === 3) throw e; await sleep(1500 * (attempt + 1)); }
  }
}

async function fetchAll() {
  fs.mkdirSync(ODDS, { recursive: true });
  const games = histGames();
  let next = 0, done = 0, failed = 0;
  const worker = async () => {
    while (next < games.length) {
      const g = games[next++];
      try { await fetchOdds(g.id); } catch (e) { failed++; }
      if (++done % 250 === 0) console.log(`  ${done}/${games.length}`);
      await sleep(120);
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`fetched ${done} games (${failed} failed) into ${path.relative(__dirname, ODDS)}`);
}

// ── dataset ─────────────────────────────────────────────────────────
const ESPN_TO_BREF = { GS: 'GSW', NY: 'NYK', SA: 'SAS', NO: 'NOP', UTAH: 'UTA', WSH: 'WAS', BKN: 'BRK', CHA: 'CHO', PHX: 'PHO' };
const br = (a) => ESPN_TO_BREF[a] || a;
const normalCdf = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989423 * Math.exp(-z * z / 2), p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
const implied = (a) => (a < 0 ? -a / (-a + 100) : 100 / (a + 100));
const SIGMA = 12.5, B2B = -2.0;

function engineGames() {
  const f = path.join(__dirname, '.cache/research-engine-games.json');
  if (!fs.existsSync(f)) require('child_process').execFileSync('node', [path.join(__dirname, 'research-season-update.js')], { env: { ...process.env, REST_OUT: f }, stdio: 'ignore' });
  // REST_OUT: K 20, home court 2.0, no rest term — the back-to-back is added here at the live engine's −2.0.
  return new Map(JSON.parse(fs.readFileSync(f, 'utf8')).map(g => [`${g.date}|${g.home}|${g.away}`, g]));
}

function buildDataset() {
  const eng = engineGames();
  const games = histGames().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const last = {}, played = {};
  const rows = [];
  let noOdds = 0, noEngine = 0;
  for (const g of games) {
    const restOf = (t) => (last[t] ? Math.round((Date.parse(g.date) - Date.parse(last[t])) / 864e5) - 1 : null);   // days off
    const hRest = restOf(g.home), aRest = restOf(g.away), hG = played[g.home] || 0, aG = played[g.away] || 0;
    last[g.home] = last[g.away] = g.date; played[g.home] = hG + 1; played[g.away] = aG + 1;
    const f = path.join(ODDS, `odds-${g.id}.json`);
    const o = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
    const pv = o && (o.providers.find(p => /^draftkings$/i.test(p.name || '')) || o.providers.find(p => /^espn bet$/i.test(p.name || '')));
    const mh = pv && pv.closeHome, ma = pv && pv.closeAway;   // closing price only
    if (mh == null || ma == null || Math.abs(mh) < 100 || Math.abs(ma) < 100) { noOdds++; continue; }
    const e = eng.get(`${g.date}|${br(g.home)}|${br(g.away)}`);
    if (!e) { noEngine++; continue; }
    const kHome = implied(mh) / (implied(mh) + implied(ma));
    const pred = e.pred + (e.hB2b ? B2B : 0) - (e.aB2b ? B2B : 0);
    const eHome = normalCdf(pred / SIGMA);
    const favHome = kHome >= 0.5, homeWon = g.hs > g.as;
    rows.push({ id: g.id, season: g.season, date: g.date, home: g.home, away: g.away, book: pv.name,
      fav: favHome ? g.home : g.away, favHome, pk: favHome ? kHome : 1 - kHome, pe: favHome ? eHome : 1 - eHome, favOdds: favHome ? mh : ma,
      won: favHome === homeWon, favB2B: favHome ? !!e.hB2b : !!e.aB2b, dogB2B: favHome ? !!e.aB2b : !!e.hB2b,
      restAdv: hRest == null || aRest == null ? null : (favHome ? hRest - aRest : aRest - hRest), early: Math.min(hG, aG) < 10 });
  }
  return { rows, noOdds, noEngine, total: games.length };
}

// ── analysis ────────────────────────────────────────────────────────
function excess(s) {
  const n = s.length, w = s.filter(r => r.won).length, e = s.reduce((a, r) => a + r.pk, 0), v = s.reduce((a, r) => a + r.pk * (1 - r.pk), 0);
  return { n, won: n ? w / n : null, pk: n ? e / n : null, ex: n ? (w - e) / n : null, z: v ? (w - e) / Math.sqrt(v) : null };
}
const fmt = (x) => x.n ? `n ${String(x.n).padStart(4)}  won ${(x.won * 100).toFixed(1).padStart(5)}%  market ${(x.pk * 100).toFixed(1).padStart(5)}%  excess ${(x.ex >= 0 ? '+' : '') + (x.ex * 100).toFixed(1)} pp (z ${x.z.toFixed(2)})` : 'n 0';

function tickets(rows, scoreOf, eligible) {
  const byDate = new Map();
  for (const r of rows) byDate.set(r.date, (byDate.get(r.date) || []).concat(r));
  let nights = 0, n = 0, hit = 0, exp = 0, safe = 0, safeHit = 0, legs = 0, legsWon = 0;
  for (const [, s] of byDate) {
    if (s.length < 3) continue;
    nights++;
    const pool = s.filter(eligible).sort((a, b) => scoreOf(b) - scoreOf(a));
    if (pool.length < 3) continue;
    const t = pool.slice(0, 3), h = t.every(r => r.won);
    n++; hit += h; exp += t.reduce((a, r) => a * r.pk, 1); legs += 3; legsWon += t.filter(r => r.won).length;
    if (t.every(r => Math.min(r.pk, r.pe) >= 0.7)) { safe++; safeHit += h; }
  }
  return { nights, n, hit, rate: n ? hit / n : null, exp: n ? exp / n : null, legs: legsWon / legs, safe, safeHit };
}

function analyse(rows, label) {
  console.log(`\n══ ${label}: ${rows.length} games (${[...new Set(rows.map(r => r.book))].join(', ')}) ══`);
  console.log('Q1 market favourites by close probability');
  for (const [lo, hi] of [[0.5, 0.6], [0.6, 0.7], [0.7, 0.8], [0.8, 0.9], [0.9, 1.01]]) console.log(`   ${String(lo * 100).padStart(2)}–${Math.min(100, hi * 100)}%  ${fmt(excess(rows.filter(r => r.pk >= lo && r.pk < hi)))}`);
  console.log('Q2 engine agreement');
  console.log(`   engine agrees (≥ 50%)        ${fmt(excess(rows.filter(r => r.pe >= 0.5)))}`);
  console.log(`   engine disagrees             ${fmt(excess(rows.filter(r => r.pe < 0.5)))}`);
  for (const [lab, f] of [['engine ≥ market + 5 pp', r => r.pe - r.pk >= 0.05], ['engine within 5 pp', r => Math.abs(r.pe - r.pk) < 0.05], ['engine ≤ market − 5 pp', r => r.pk - r.pe >= 0.05]]) console.log(`   ${lab.padEnd(29)}${fmt(excess(rows.filter(f)))}`);
  console.log('Q3 situations (favourites)');
  const Q3 = { 'favourite at home': r => r.favHome, 'favourite on the road': r => !r.favHome, 'favourite on a back-to-back': r => r.favB2B, 'underdog on a back-to-back': r => r.dogB2B,
    'favourite rested more (≥ +1 day)': r => r.restAdv != null && r.restAdv >= 1, 'favourite rested less (≤ −1 day)': r => r.restAdv != null && r.restAdv <= -1, 'early season (< 10 games)': r => r.early };
  const out = {};
  for (const [lab, f] of Object.entries(Q3)) { out[lab] = excess(rows.filter(f)); console.log(`   ${lab.padEnd(33)}${fmt(out[lab])}`); }
  console.log('Q4 nightly 3-leg tickets (nights with 3+ games)');
  const a = tickets(rows, r => r.pk, () => true), b = tickets(rows, r => Math.min(r.pk, r.pe), r => r.pe >= 0.5);
  const show = (lab, t) => console.log(`   ${lab.padEnd(36)} ${t.hit}/${t.n} hit (${(t.rate * 100).toFixed(1)}%) vs market ${(t.exp * 100).toFixed(1)}% · legs ${(t.legs * 100).toFixed(1)}% · all three ≥ 70% by both on ${t.safe} of ${t.nights} nights (${t.safeHit} hit)`);
  show("market's 3 strongest favourites", a); show('3 highest agreed scores', b);
  return out;
}

function main() {
  const { rows, noOdds, noEngine, total } = buildDataset();
  console.log(`${total} games; ${rows.length} with a closing moneyline and an engine prediction (${noOdds} without odds, ${noEngine} not matched to the engine)`);
  const train = analyse(rows.filter(r => r.season !== '2025-26'), 'TRAIN 2023-24 + 2024-25');
  const hold = analyse(rows.filter(r => r.season === '2025-26'), 'HOLDOUT 2025-26');
  console.log('\nDecision (pre-registered): a situation is a filter if train |z| ≥ 2 and holdout has the same sign with |z| ≥ 1');
  for (const k of Object.keys(train)) {
    const t = train[k], h = hold[k], pass = t.n && h.n && Math.abs(t.z) >= 2 && Math.sign(h.z) === Math.sign(t.z) && Math.abs(h.z) >= 1;
    console.log(`   ${k.padEnd(33)} train z ${t.z.toFixed(2).padStart(6)} · holdout z ${h.z.toFixed(2).padStart(6)} → ${pass ? 'FILTER' : 'no'}`);
  }
}

module.exports = { histGames, fetchOdds, buildDataset };

if (require.main === module) {
  if (has('--fetch')) fetchAll().catch(e => { console.error(e); process.exit(1); });
  else main();
}
