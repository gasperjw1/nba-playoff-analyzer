// ============================================================
// shop-2 BACKFILL — our tickets as recorded vs with the price tracker (SHOP2_SPEC.md)
// ============================================================
// Frozen in SHOP2_SPEC.md (commit 30178a2) before any historical price was pulled.
//
//   node research-shop-backfill.js --plan   the 32 snapshot times; no network
//   node research-shop-backfill.js --pull   fetch missing snapshots (needs ODDS_API_KEY; 10 credits each;
//                                            approved by the user 2026-11-26 for 32 snapshots)
//   node research-shop-backfill.js          score V0–V4 from the cached snapshots
//
// Snapshots are cached in .odds/hist/ (local, never committed: The Odds API's terms on republishing
// are unchecked). The key is read from ODDS_API_KEY and never printed.
// ============================================================
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const HIST = path.join(ROOT, '.odds/hist');
const BOOKS = ['fanduel', 'draftkings', 'williamhill_us', 'betmgm', 'betrivers', 'espnbet', 'fanatics', 'hardrockbet', 'lowvig', 'pinnacle'];
const MIN_REMAINING = 5000, COST_EACH = 10, MAX_SNAPSHOTS = 32;

function load() {
  const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error });
  for (const f of ['js/season/data/season-constants.js', 'js/season/data/player-priors.js', 'js/season/data/team-ratings.js', 'js/season/adapters.js',
    'js/season/engine.js', 'js/season/props.js', 'js/season/ensemble.js', 'js/season/trust.js', 'js/season/ledger.js', 'js/season/replay-core.js',
    'js/season/parlay.js', 'js/season/pitch.js', 'js/season/pitch2.js', 'js/season/flat.js', 'js/season/fade.js', 'js/season/pitch3.js',
    'js/season/data/season-ledger.js', 'js/season/data/pitch-ledger.js', 'js/season/data/pitch2-ledger.js', 'js/season/data/user-legs.js',
    'js/season/data/season-backfill.js'])
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^(const|let) /gm, 'var '), ctx);
  return ctx;
}

// The 16 nights and their two snapshot times.
function plan(C) {
  const nights = [];
  const live = C.SEASON_PITCH_LEDGER.filter((p) => p.date >= '2026-11-08' && p.date <= '2026-11-18');
  for (const p of live) nights.push({ date: p.date, source: 'live', bet: p.recordedAt });
  for (const n of C.SEASON_BACKFILL.nights) nights.push({ date: n.date, source: 'backfill', bet: n.recordedAt });
  const rows = C.SEASON_LEDGER.concat(C.SEASON_BACKFILL.rows);
  for (const n of nights) {
    const tips = rows.filter((r) => r.date === n.date).map((r) => Date.parse(r.tip));
    n.firstTip = new Date(Math.min(...tips)).toISOString();
    n.close = new Date(Math.min(...tips) - 5 * 60e3).toISOString();
  }
  return nights.sort((a, b) => (a.date < b.date ? -1 : 1));
}

const snapFile = (iso) => path.join(HIST, `h2h-${iso.replace(/[:.]/g, '-')}.json`);
const redact = (s) => String(s).replace(/apiKey=[^&\s]+/g, 'apiKey=REDACTED');

async function pull(nights) {
  const key = process.env.ODDS_API_KEY;
  if (!key) throw new Error('ODDS_API_KEY is not set');
  fs.mkdirSync(HIST, { recursive: true });
  const times = nights.flatMap((n) => [n.bet, n.close]);
  if (times.length > MAX_SNAPSHOTS) throw new Error(`${times.length} snapshots planned, approval covers ${MAX_SNAPSHOTS}`);
  let remaining = null, spent = 0;
  for (const t of times) {
    const f = snapFile(t);
    if (fs.existsSync(f)) continue;
    if (remaining != null && remaining - COST_EACH < MIN_REMAINING) { console.log(`stop: ${remaining} credits left, floor ${MIN_REMAINING}`); break; }
    const iso = new Date(Math.floor(Date.parse(t) / 1000) * 1000).toISOString().replace('.000Z', 'Z');
    const url = `https://api.the-odds-api.com/v4/historical/sports/basketball_nba/odds?apiKey=${key}&bookmakers=${BOOKS.join(',')}&markets=h2h&oddsFormat=american&dateFormat=iso&date=${iso}`;
    let res;
    try { res = await fetch(url, { signal: AbortSignal.timeout(30000) }); } catch (e) { console.log('request failed:', redact(e.message)); break; }
    const cost = +res.headers.get('x-requests-last'), rem = +res.headers.get('x-requests-remaining');
    remaining = rem; spent += cost || 0;
    if (!res.ok) { console.log(`HTTP ${res.status} at ${iso}: ${redact((await res.text()).slice(0, 200))}`); break; }
    const j = await res.json();
    fs.writeFileSync(f, JSON.stringify({ asked: t, ...j }));
    console.log(`${iso} → snapshot ${j.timestamp}, ${(j.data || []).length} events, cost ${cost}, remaining ${rem}`);
    if (cost > COST_EACH) { console.log(`stop: a snapshot cost ${cost}, more than the ${COST_EACH} planned`); break; }
  }
  console.log(`spent ${spent} credits this run; remaining ${remaining}`);
}

// ── prices ─────────────────────────────────────────────────────────
const dec = (a) => (a > 0 ? 1 + a / 100 : 1 + 100 / -a);
const imp = (a) => 1 / dec(a);
function powerFair(a, b) {   // chance of the first side, power de-vig
  const x = imp(a), y = imp(b); let lo = 1, hi = 3;
  for (let i = 0; i < 60; i++) { const k = (lo + hi) / 2; if (x ** k + y ** k > 1) lo = k; else hi = k; }
  return x ** ((lo + hi) / 2);
}
const median = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

// A snapshot's events keyed by our "date|AWAY@HOME" (team abbreviations via the replay's name table).
function snapGames(C, iso) {
  const f = snapFile(iso);
  if (!fs.existsSync(f)) return null;
  const j = JSON.parse(fs.readFileSync(f, 'utf8')), at = Date.parse(j.timestamp), out = new Map();
  const abbr = (name) => (C.REPLAY_TEAM_BY_NAME && C.REPLAY_TEAM_BY_NAME[name]) || name;
  for (const e of j.data || []) {
    const home = abbr(e.home_team), away = abbr(e.away_team), books = {};
    for (const b of e.bookmakers || []) {
      const m = (b.markets || []).find((x) => x.key === 'h2h'); if (!m) continue;
      const ph = m.outcomes.find((o) => o.name === e.home_team), pa = m.outcomes.find((o) => o.name === e.away_team);
      if (!ph || !pa) continue;
      const age = (at - Date.parse(m.last_update || b.last_update)) / 60e3;
      const usable = Math.abs(ph.price) >= 100 && Math.abs(pa.price) >= 100 && imp(ph.price) + imp(pa.price) - 1 >= 0.01 && age <= 30;
      books[b.key] = { home: ph.price, away: pa.price, usable, age: +age.toFixed(1) };
    }
    // A snapshot can hold the same pairing twice (OKC at POR on Nov 10 and 11): keep every event and
    // let the caller take the one nearest the ledger's tip.
    const k = `${away}@${home}`, g = { home, away, commence: e.commence_time, books, snapshot: j.timestamp };
    out.set(k, (out.get(k) || []).concat(g));
  }
  return { at: j.timestamp, games: out };
}

// The fair home chance at a snapshot (Pinnacle, else the median of ≥3 other books), and its source.
function fairHome(g) {
  const p = g.books.pinnacle;
  if (p && p.usable) return { p: powerFair(p.home, p.away), src: 'pinnacle' };
  const others = Object.entries(g.books).filter(([k, b]) => b.usable && k !== 'fanduel' && k !== 'draftkings');
  if (others.length < 3) return null;
  return { p: median(others.map(([, b]) => powerFair(b.home, b.away))), src: `median of ${others.length}` };
}

// A side's prices at a snapshot: DraftKings', FanDuel's, the tracker's (better of the two), the fair chance.
function sidePrices(g, side) {
  if (!g) return null;
  const at = (k) => { const b = g.books[k]; return b && b.usable ? (side === 'home' ? b.home : b.away) : null; };
  const fd = at('fanduel'), dk = at('draftkings'), f = fairHome(g);
  let best = null, bestBook = null;
  if (fd != null || dk != null) { if (dk == null || (fd != null && dec(fd) >= dec(dk))) { best = fd; bestBook = 'FanDuel'; } else { best = dk; bestBook = 'DraftKings'; } }
  const fair = f ? (side === 'home' ? f.p : 1 - f.p) : null;
  return { fd, dk, best, bestBook, fair, fairSrc: f && f.src, ev: fair != null && best != null ? fair * dec(best) - 1 : null };
}

module.exports = { plan, load, snapGames, sidePrices, fairHome, powerFair, dec, imp, snapFile };

if (require.main === module) {
  const C = load(), nights = plan(C);
  if (process.argv.includes('--plan')) {
    for (const n of nights) console.log(`${n.date} ${n.source.padEnd(8)} bet ${n.bet}  close ${n.close} (first tip ${n.firstTip})  cached ${fs.existsSync(snapFile(n.bet)) ? 'bet ' : ''}${fs.existsSync(snapFile(n.close)) ? 'close' : ''}`);
    console.log(`${nights.length} nights, ${nights.length * 2} snapshots, ${nights.length * 2 * COST_EACH} credits if none cached`);
  } else if (process.argv.includes('--pull')) {
    pull(nights).catch((e) => { console.log('error:', redact(e.message)); process.exit(1); });
  } else {
    require('./research-shop-score.js').score(C, nights);
  }
}
