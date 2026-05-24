// ============================================================
// USER BET LEDGER CLI — Phase 73n (May 24, 2026)
// ============================================================
// Matches the test-chs-lab-ledger-update.js pattern for consistency.
//
// Usage:
//   node test-user-bet-log.js --add <path-to-bet.json>
//     Append a new bet entry. JSON shape per USER_BET_TEMPLATE.json.
//     `id` auto-generated if omitted (user-YYYY-MM-DD-NNN).
//     `loggedAt` defaults to now(). `legs[].hit` and `result` are left
//     null — the --settle pass fills them in once the game finishes.
//
//   node test-user-bet-log.js --settle
//     For every entry with result=null whose game has a winner in
//     SERIES_DATA, score legs against the actual box score and write
//     result = { outcome, pnl, settledAt }. Skips entries missing
//     boxScore data (re-run after the box score is filled in).
//
//   node test-user-bet-log.js --report
//     Print rolling P&L: total stake / wins / losses / ROI, plus
//     per-source breakdown (chs-lab vs chs-lab-modified vs manual-thesis)
//     and side-by-side comparison against the algorithm's reliable +
//     traditional tiers in CHS_LAB_LEDGER.
//
//   --dry-run   Don't write changes.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LEDGER_PATH = path.join(__dirname, 'js/data/user-bet-ledger.js');

const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);
const opt = (flag, def) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : def;
};
const MODE_ADD     = has('--add');
const MODE_SETTLE  = has('--settle');
const MODE_REPORT  = has('--report');
const DRY_RUN      = has('--dry-run');

if (!MODE_ADD && !MODE_SETTLE && !MODE_REPORT) {
  console.error('Usage: node test-user-bet-log.js [--add <path.json>|--settle|--report] [--dry-run]');
  process.exit(2);
}

// ── Load codebase into a VM sandbox ─────────────────────────────────
const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const sb = { console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error };
vm.createContext(sb);
const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), sb);
[
  'js/data/constants.js', 'js/data/historical.js', 'js/data/news.js',
  'js/data/series-data.js', 'js/data/boxscores.js', 'js/data/bets-data.js',
  'js/data/chs-ledger.js', 'js/data/chs-lab-ledger.js',
  'js/data/user-bet-ledger.js',
  'js/utils.js', 'js/state.js',
].forEach(load);
const { SERIES_DATA, CHS_LAB_LEDGER, USER_BET_LEDGER, CURRENT_DATE } = sb;

// ── Helpers ─────────────────────────────────────────────────────────
function americanToMult(odds) {
  const n = Number(odds);
  if (!isFinite(n) || n === 0) return null;
  return n > 0 ? 1 + n / 100 : 1 + 100 / -n;
}

function generateId(date, ledger) {
  const prefix = `user-${date}-`;
  const existing = (ledger || []).filter(e => e && e.id && e.id.startsWith(prefix));
  const next = String(existing.length + 1).padStart(3, '0');
  return `${prefix}${next}`;
}

// Score a single leg against actual game outcome (same pattern as
// test-chs-lab-ledger-update.js).
function scoreLeg(leg, actualGame) {
  if (!actualGame || !actualGame.boxScores) return { hit: null, reason: 'no-boxscore' };
  const all = [...(actualGame.boxScores.home || []), ...(actualGame.boxScores.away || [])];
  const player = all.find(p => {
    if (!p || !p.name) return false;
    const a = String(p.name).toLowerCase();
    const b = String(leg.player).toLowerCase();
    if (a === b) return true;
    const aLast = a.split(/\s+/).pop();
    const bLast = b.split(/\s+/).pop();
    return aLast === bLast || a.includes(b) || b.includes(a);
  });
  if (!player) return { hit: null, reason: 'player-not-found' };

  let value;
  const statKey = String(leg.stat).toLowerCase();
  switch (statKey) {
    case 'pts': case 'points': value = player.pts; break;
    case 'reb': case 'rebs': case 'rebounds': value = player.reb; break;
    case 'ast': case 'asts': case 'assists': value = player.ast; break;
    case 'stl': case 'steals': value = player.stl; break;
    case 'blk': case 'blocks': value = player.blk; break;
    case 'to': case 'turnovers': value = player.to; break;
    case 'threes': case '3pm': {
      if (typeof player.threes === 'string') {
        const m = player.threes.match(/^(\d+)/);
        value = m ? parseInt(m[1], 10) : null;
      } else value = player.threes;
      break;
    }
    case 'pra': value = (player.pts || 0) + (player.reb || 0) + (player.ast || 0); break;
    case 'stocks': value = (player.stl || 0) + (player.blk || 0); break;
    default: return { hit: null, reason: 'unknown-stat:' + leg.stat };
  }
  if (typeof value !== 'number') return { hit: null, reason: 'stat-not-numeric' };
  const dir = String(leg.direction || 'over').toLowerCase();
  const hit = (dir === 'over') ? (value > leg.line) : (value < leg.line);
  return { hit, value, line: leg.line, dir };
}

// ── Add mode ─────────────────────────────────────────────────────────
function runAdd(jsonPath) {
  if (!jsonPath) {
    console.error('--add requires a path to a JSON file. See USER_BET_TEMPLATE.json.');
    process.exit(2);
  }
  if (!fs.existsSync(jsonPath)) {
    console.error('JSON file not found: ' + jsonPath);
    process.exit(2);
  }
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (e) {
    console.error('Failed to parse JSON: ' + e.message);
    process.exit(2);
  }
  // Strip _comment / _* keys (template helper docs)
  Object.keys(raw).forEach(k => { if (k.startsWith('_')) delete raw[k]; });

  // Required fields
  ['date', 'series', 'game', 'type', 'source', 'stake', 'americanOdds', 'legs'].forEach(f => {
    if (raw[f] == null) {
      console.error(`Missing required field: ${f}`);
      process.exit(2);
    }
  });
  if (!Array.isArray(raw.legs) || raw.legs.length === 0) {
    console.error('legs must be a non-empty array');
    process.exit(2);
  }
  if (!['parlay', 'single'].includes(raw.type)) {
    console.error(`type must be 'parlay' or 'single' (got '${raw.type}')`);
    process.exit(2);
  }
  if (!['chs-lab', 'chs-lab-modified', 'manual-thesis'].includes(raw.source)) {
    console.error(`source must be 'chs-lab' | 'chs-lab-modified' | 'manual-thesis' (got '${raw.source}')`);
    process.exit(2);
  }

  // Verify series + game exist in SERIES_DATA
  const series = SERIES_DATA.find(s => s.id === raw.series);
  if (!series) {
    console.error(`series '${raw.series}' not found in SERIES_DATA`);
    process.exit(2);
  }
  const game = series.games[raw.game - 1];
  if (!game) {
    console.error(`game ${raw.game} not found in series '${raw.series}'`);
    process.exit(2);
  }

  const entry = {
    id: raw.id || generateId(raw.date, USER_BET_LEDGER),
    date: raw.date,
    loggedAt: raw.loggedAt || new Date().toISOString(),
    series: raw.series,
    game: raw.game,
    type: raw.type,
    source: raw.source,
    inspiredBy: raw.inspiredBy || null,
    stake: raw.stake,
    americanOdds: raw.americanOdds,
    legs: raw.legs.map(l => ({
      player: l.player,
      stat: String(l.stat).toLowerCase(),
      line: l.line,
      direction: l.direction || 'over',
      odds: l.odds != null ? l.odds : null,
      fromCandidate: !!l.fromCandidate,
      candidateHitRate: l.candidateHitRate != null ? l.candidateHitRate : null,
      note: l.note || null,
      hit: null,
      actualValue: null,
    })),
    notes: raw.notes || '',
    result: null,
  };

  // Reject duplicate id
  if (USER_BET_LEDGER.some(e => e && e.id === entry.id)) {
    console.error(`Duplicate id '${entry.id}' — pick a different one or omit id to auto-generate.`);
    process.exit(2);
  }

  USER_BET_LEDGER.push(entry);
  console.log(`Added: ${entry.id} (${entry.series} G${entry.game}, ${entry.type}, ${entry.legs.length} legs, ${entry.americanOdds > 0 ? '+' : ''}${entry.americanOdds})`);
}

// ── Settle mode ──────────────────────────────────────────────────────
function runSettle() {
  let settled = 0;
  USER_BET_LEDGER.forEach(entry => {
    if (!entry || entry.result) return;
    const series = SERIES_DATA.find(s => s.id === entry.series);
    if (!series) return;
    const game = series.games[entry.game - 1];
    if (!game || !game.winner) return;

    // Score each leg
    const legResults = entry.legs.map(leg => {
      const s = scoreLeg(leg, game);
      if (s.hit != null) {
        leg.hit = s.hit;
        leg.actualValue = s.value;
      } else {
        leg.hit = null;
        leg.actualValue = null;
      }
      return s;
    });

    const hasUnknown = legResults.some(s => s.hit == null);
    if (hasUnknown) {
      console.log(`PENDING: ${entry.id} (${entry.series} G${entry.game}) — some legs not resolvable (${legResults.filter(s => s.hit == null).map(s => s.reason).join(', ')})`);
      return;
    }
    const allHit = legResults.every(s => s.hit === true);
    const outcome = allHit ? 'win' : 'loss';
    const mult = americanToMult(entry.americanOdds);
    const pnl = outcome === 'win' && mult ? +(entry.stake * (mult - 1)).toFixed(2) : -entry.stake;
    entry.result = { outcome, pnl, settledAt: new Date().toISOString() };
    settled++;
    console.log(`Settled: ${entry.id} (${entry.series} G${entry.game}) → ${outcome} ${pnl >= 0 ? '+' : ''}$${pnl}`);
  });
  console.log(`\n${settled} entries settled.`);
}

// ── Report mode ──────────────────────────────────────────────────────
function summarizeBets(entries) {
  let stake = 0, wins = 0, losses = 0, pushes = 0, pnl = 0;
  entries.forEach(e => {
    if (!e || !e.result) return;
    stake += e.stake;
    pnl += e.result.pnl;
    if (e.result.outcome === 'win') wins++;
    else if (e.result.outcome === 'loss') losses++;
    else pushes++;
  });
  const settled = wins + losses + pushes;
  return {
    stake, wins, losses, pushes, settled, pnl,
    winRate: settled ? wins / settled : 0,
    roi: stake ? pnl / stake : 0,
  };
}

function summarizeChsLab(tier) {
  if (!Array.isArray(CHS_LAB_LEDGER)) return { wins:0, losses:0, settled:0, stake:0, pnl:0, winRate:0, roi:0 };
  let stake = 0, wins = 0, losses = 0, pnl = 0;
  CHS_LAB_LEDGER.forEach(e => {
    if (!e || !e.settlement) return;
    const t = e.settlement[tier];
    if (!t || t.outcome == null) return;
    const meta = e[tier];
    if (meta) stake += meta.stake;
    pnl += t.pnl;
    if (t.outcome === 'win') wins++; else losses++;
  });
  const settled = wins + losses;
  return { wins, losses, settled, stake, pnl, winRate: settled ? wins / settled : 0, roi: stake ? pnl / stake : 0 };
}

function runReport() {
  const total = summarizeBets(USER_BET_LEDGER);
  console.log('\n=== YOUR BETS — Rolling P&L ===');
  console.log(`Entries: ${USER_BET_LEDGER.length} (settled: ${total.settled}, pending: ${USER_BET_LEDGER.length - total.settled})`);
  console.log(`Total:       ${total.wins}-${total.losses}${total.pushes > 0 ? '-' + total.pushes : ''} (${(total.winRate*100).toFixed(1)}%) — net ${total.pnl >= 0 ? '+' : ''}$${total.pnl.toFixed(0)} on $${total.stake} staked (ROI ${(total.roi*100).toFixed(1)}%)`);

  // Per-source breakdown
  ['chs-lab', 'chs-lab-modified', 'manual-thesis'].forEach(src => {
    const subset = USER_BET_LEDGER.filter(e => e.source === src);
    if (subset.length === 0) return;
    const s = summarizeBets(subset);
    console.log(`  ${src.padEnd(20)}: ${s.wins}-${s.losses}${s.pushes > 0 ? '-' + s.pushes : ''} (${(s.winRate*100).toFixed(1)}%) — ${s.pnl >= 0 ? '+' : ''}$${s.pnl.toFixed(0)} / $${s.stake} (ROI ${(s.roi*100).toFixed(1)}%)`);
  });

  // Side-by-side vs algorithm
  const algReliable = summarizeChsLab('reliable');
  const algTrad     = summarizeChsLab('traditional');
  console.log('\n=== ALGORITHM (CHS Lab Ledger) — same window ===');
  console.log(`Reliable:    ${algReliable.wins}-${algReliable.losses} (${(algReliable.winRate*100).toFixed(1)}%) — ${algReliable.pnl >= 0 ? '+' : ''}$${algReliable.pnl.toFixed(0)} / $${algReliable.stake} (ROI ${(algReliable.roi*100).toFixed(1)}%)`);
  console.log(`Traditional: ${algTrad.wins}-${algTrad.losses} (${(algTrad.winRate*100).toFixed(1)}%) — ${algTrad.pnl >= 0 ? '+' : ''}$${algTrad.pnl.toFixed(0)} / $${algTrad.stake} (ROI ${(algTrad.roi*100).toFixed(1)}%)`);

  // Divergence signal: user picks where source !== 'chs-lab' (i.e., manually
  // modified or pure-thesis) AND user won → algorithm's pure picks missed it.
  const divergenceWins = USER_BET_LEDGER.filter(e =>
    e && e.result && e.result.outcome === 'win' && e.source !== 'chs-lab').length;
  const divergenceTotal = USER_BET_LEDGER.filter(e =>
    e && e.result && e.source !== 'chs-lab').length;
  if (divergenceTotal > 0) {
    console.log('\n=== DIVERGENCE SIGNAL (you bet outside the algorithm\'s direct picks) ===');
    console.log(`${divergenceWins}/${divergenceTotal} (${(divergenceWins/divergenceTotal*100).toFixed(1)}%) wins where you modified or overrode the algorithm.`);
    if (divergenceTotal < 10) console.log('(sample too small; need 10+ for a meaningful signal)');
    else if (divergenceWins/divergenceTotal >= 0.6) console.log('→ Strong signal you have edge the algorithm misses. Worth investigating which leg patterns you keep picking that the model under-rates.');
  }

  // Per-stat breakdown (which stat types you hit best)
  if (total.settled > 0) {
    console.log('\n=== Per-stat hit rate (your picked legs across all settled bets) ===');
    const byStat = {};
    USER_BET_LEDGER.forEach(e => {
      if (!e || !e.result) return;
      e.legs.forEach(l => {
        if (l.hit == null) return;
        const key = l.stat;
        if (!byStat[key]) byStat[key] = { hit: 0, total: 0 };
        byStat[key].total++;
        if (l.hit) byStat[key].hit++;
      });
    });
    Object.entries(byStat).sort((a,b) => b[1].total - a[1].total).forEach(([stat, s]) => {
      console.log(`  ${stat.padEnd(10)}: ${s.hit}/${s.total} (${(s.hit/s.total*100).toFixed(0)}%)`);
    });
  }
}

// ── Write ledger back ────────────────────────────────────────────────
function writeLedger() {
  if (DRY_RUN) { console.log('\n[DRY RUN] not writing changes.'); return; }
  const header = '// User Bet Ledger — auto-maintained by test-user-bet-log.js\n' +
                 '// Schema docs at top of js/data/user-bet-ledger.js. Add entries via\n' +
                 '// the CLI (--add <bet.json>) so id-collision + schema checks run.\n\n';
  const body = `const USER_BET_LEDGER = ${JSON.stringify(USER_BET_LEDGER, null, 2)};\n\n` +
               `if (typeof module !== 'undefined' && module.exports) {\n` +
               `  module.exports = { USER_BET_LEDGER };\n` +
               `}\n`;
  fs.writeFileSync(LEDGER_PATH, header + body, 'utf8');
  console.log(`\nLedger written → ${LEDGER_PATH}`);
}

// ── Main ────────────────────────────────────────────────────────────
if (MODE_ADD) {
  // --add can be followed by a path OR be the last positional arg
  const jsonPath = opt('--add', argv[argv.indexOf('--add') + 1]);
  runAdd(jsonPath);
  writeLedger();
}

if (MODE_SETTLE) {
  console.log('\n=== Settling pending user bets ===\n');
  runSettle();
  writeLedger();
}

if (MODE_REPORT) {
  runReport();
}
