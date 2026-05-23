// ============================================================
// CHS LAB LEDGER UPDATE — Phase 73m (May 23, 2026)
// ============================================================
// CLI for the going-forward CHS Lab P&L ledger.
//
// Usage:
//   node test-chs-lab-ledger-update.js --snapshot
//     For every upcoming game (winner=null, prediction set), run the
//     MC + reliable + traditional builder ONCE at high N (3000 iter)
//     and append a ledger entry. Skips games that already have an
//     entry on the same date.
//
//   node test-chs-lab-ledger-update.js --settle
//     For every ledger entry with actual=null whose game now has a
//     winner in SERIES_DATA, fill in actual + settlement (leg-by-leg
//     scoring + outcome + pnl).
//
//   node test-chs-lab-ledger-update.js --report
//     Print rolling P&L / W-L summary to stdout. No mutation.
//
//   --dry-run    Don't write changes (print what WOULD happen)
//   --iter N     Override iteration count (default 3000)
//
// The ledger file is js/data/chs-lab-ledger.js. This CLI parses it
// via VM context, mutates the in-memory array, and writes back as
// pretty-printed JS literal syntax.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LEDGER_PATH = path.join(__dirname, 'js/data/chs-lab-ledger.js');

const argv = process.argv.slice(2);
const has = (flag) => argv.includes(flag);
const opt = (flag, def) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : def;
};
const MODE_SNAPSHOT = has('--snapshot');
const MODE_SETTLE   = has('--settle');
const MODE_REPORT   = has('--report');
const DRY_RUN       = has('--dry-run');
const ITER          = parseInt(opt('--iter', '3000'), 10);
const STAKE         = 100;

if (!MODE_SNAPSHOT && !MODE_SETTLE && !MODE_REPORT) {
  console.error('Usage: node test-chs-lab-ledger-update.js [--snapshot|--settle|--report] [--dry-run] [--iter N]');
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
  'js/utils.js', 'js/state.js',
  'js/engine/lineup-overrides.js', 'js/engine/chemistry.js', 'js/engine/fatigue.js',
  'js/engine/matchups.js', 'js/engine/ratings.js', 'js/engine/projections.js',
  'js/engine/monte-carlo.js', 'js/engine/parlay-builder.js',
].forEach(load);

const { SERIES_DATA, CHS_LAB_LEDGER, CURRENT_DATE, runMonteCarlo, buildReliableParlay, buildTraditionalParlay, safeLinesForAllPlayers, estimateProjectedMinutes } = sb;

// ── Helpers ─────────────────────────────────────────────────────────
function americanToMult(odds) {
  const n = Number(odds);
  if (!isFinite(n) || n === 0) return null;
  return n > 0 ? 1 + n / 100 : 1 + 100 / -n;
}

function findGameDate(series, gameNum) {
  // BET_SLATES has the date per (series, game). Walk it.
  if (!sb.BET_SLATES) return CURRENT_DATE;
  for (const key of Object.keys(sb.BET_SLATES)) {
    const m = key.match(/G(\d+)/);
    if (!m || parseInt(m[1], 10) !== gameNum) continue;
    const slate = sb.BET_SLATES[key];
    if (!slate || !Array.isArray(slate.games)) continue;
    const sg = slate.games.find(g => g.series === series.id);
    if (sg && sg.date) return sg.date;
  }
  return CURRENT_DATE;
}

// Score a leg against an actual box score
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

// ── Snapshot mode ────────────────────────────────────────────────────
function runSnapshot() {
  const newEntries = [];
  const today = CURRENT_DATE;
  const upcoming = [];
  SERIES_DATA.forEach(s => {
    if (!s.homeTeam || !Array.isArray(s.homeTeam.players) || s.homeTeam.players.length === 0) return;
    if (s.tbdOpponent || (s.awayTeam && s.awayTeam.tbd)) return;
    s.games.forEach(g => {
      if (!g || g.winner || !g.prediction) return;
      upcoming.push({ series: s, gameNum: g.num });
    });
  });

  if (upcoming.length === 0) {
    console.log('No upcoming games with predictions — nothing to snapshot.');
    return [];
  }

  upcoming.forEach(({ series, gameNum }) => {
    const gameDate = findGameDate(series, gameNum);
    const existing = CHS_LAB_LEDGER.find(e =>
      e && e.series === series.id && e.game === gameNum && e.date === gameDate);
    if (existing) {
      console.log(`SKIP: ${series.id} G${gameNum} (${gameDate}) — already in ledger`);
      return;
    }

    process.stdout.write(`Snapshotting ${series.id} G${gameNum} (${gameDate})... `);
    const t0 = Date.now();
    const mc = runMonteCarlo(series, gameNum, { iterations: ITER });
    if (!mc) { console.log('skipped (MC returned null)'); return; }
    const candidates = safeLinesForAllPlayers(mc, {
      threshold: 0.80, maxJuice: -500,
      series, minProjectedMinutes: 18,
    }).slice(0, 12);  // store top 12 for transparency

    const reliable = buildReliableParlay(mc, series);
    const trad = buildTraditionalParlay(mc, series);

    // Build player → { obj, side, team } lookup so we can backfill the team
    // tag on raw safeLinesForAllPlayers rows (those don't carry it; only
    // _candidatePool / buildReliable/Traditional output does).
    const playerObj = {};
    series.homeTeam.players.forEach(p => { if (p && p.name) playerObj[p.name] = { obj: p, side: 'home', team: series.homeTeam }; });
    if (series.awayTeam && Array.isArray(series.awayTeam.players)) {
      series.awayTeam.players.forEach(p => { if (p && p.name) playerObj[p.name] = { obj: p, side: 'away', team: series.awayTeam }; });
    }

    const enrichLeg = (leg) => {
      const lookup = playerObj[leg.player];
      const p = lookup && lookup.obj;
      const teamAbbr = leg.team || (lookup && lookup.team && lookup.team.abbr) || null;
      return {
        player: leg.player,
        stat: leg.stat,
        line: leg.line,
        direction: leg.direction || 'over',
        hitRate: +leg.hitRate.toFixed(3),
        estJuice: leg.estJuice,
        team: teamAbbr,
        position: (p && p.pos) || null,
        projMinutes: lookup ? +estimateProjectedMinutes(p, lookup.team, series).toFixed(1) : null,
      };
    };

    const entry = {
      date: gameDate,
      series: series.id,
      game: gameNum,
      capturedAt: new Date().toISOString(),
      iterations: ITER,
      mc: {
        homeWinProb: mc.homeWinProb,
        blowoutRisk: mc.blowoutRisk,
        marginP50: mc.margin && mc.margin.p50,
      },
      candidates: candidates.map(enrichLeg),
      reliable: reliable ? {
        legCount: reliable.legCount,
        combinedMC: +reliable.score.combined.toFixed(3),
        americanOdds: reliable.parlayJuice,
        stake: STAKE,
        legs: reliable.legs.map(enrichLeg),
      } : null,
      traditional: trad ? {
        legCount: trad.legCount,
        combinedMC: +trad.score.combined.toFixed(3),
        calibratedCombined: trad.calibratedCombined != null ? +trad.calibratedCombined.toFixed(3) : null,
        americanOdds: trad.parlayJuice,
        stake: STAKE,
        legs: trad.legs.map(enrichLeg),
      } : null,
      actual: null,
      settlement: null,
    };

    newEntries.push(entry);
    const ms = Date.now() - t0;
    console.log(`reliable=${reliable ? reliable.legCount + 'L @ ' + (reliable.score.combined*100).toFixed(0) + '%' : 'none'} | trad=${trad ? trad.legCount + 'L @ ' + (trad.score.combined*100).toFixed(0) + '%' : 'none'} | candidates=${candidates.length} [${ms}ms]`);
  });

  return newEntries;
}

// ── Settle mode ──────────────────────────────────────────────────────
function runSettle() {
  const settled = [];
  CHS_LAB_LEDGER.forEach((entry, idx) => {
    if (!entry || entry.settlement) return;
    const series = SERIES_DATA.find(s => s.id === entry.series);
    if (!series) return;
    const game = series.games[entry.game - 1];
    if (!game || !game.winner || !game.boxScores) return;

    const settleTier = (tier) => {
      if (!tier) return null;
      const legResults = (tier.legs || []).map(l => ({ leg: l, ...scoreLeg(l, game) }));
      const allHit = legResults.length > 0 && legResults.every(lr => lr.hit === true);
      const hasUnknown = legResults.some(lr => lr.hit == null);
      const outcome = hasUnknown ? null : (allHit ? 'win' : 'loss');
      const mult = americanToMult(tier.americanOdds);
      const pnl = outcome === 'win' && mult ? +(tier.stake * (mult - 1)).toFixed(2)
                : outcome === 'loss' ? -tier.stake
                : 0;
      return { outcome, legResults: legResults.map(lr => ({ player: lr.leg.player, stat: lr.leg.stat, line: lr.leg.line, hit: lr.hit, actualValue: lr.value, reason: lr.reason })), pnl };
    };

    const actual = {
      winner: game.winner,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
      margin: Math.abs((game.homeScore || 0) - (game.awayScore || 0)),
    };
    const settlement = {
      reliable: settleTier(entry.reliable),
      traditional: settleTier(entry.traditional),
      settledAt: new Date().toISOString(),
    };
    entry.actual = actual;
    entry.settlement = settlement;
    settled.push({ idx, entry });
    console.log(`Settled ${entry.series} G${entry.game} (${entry.date}): reliable=${settlement.reliable ? settlement.reliable.outcome + ' ' + (settlement.reliable.pnl >= 0 ? '+' : '') + '$' + settlement.reliable.pnl : '—'} | trad=${settlement.traditional ? settlement.traditional.outcome + ' ' + (settlement.traditional.pnl >= 0 ? '+' : '') + '$' + settlement.traditional.pnl : '—'}`);
  });

  return settled;
}

// ── Report mode ──────────────────────────────────────────────────────
function runReport() {
  if (CHS_LAB_LEDGER.length === 0) {
    console.log('Ledger is empty.');
    return;
  }
  const settledEntries = CHS_LAB_LEDGER.filter(e => e && e.settlement);
  const summarizeTier = (tier) => {
    let wins = 0, total = 0, pnl = 0, stake = 0;
    settledEntries.forEach(e => {
      const t = e.settlement && e.settlement[tier];
      if (!t || t.outcome === null) return;
      total++;
      if (t.outcome === 'win') wins++;
      pnl += t.pnl;
      const tierMeta = e[tier];
      if (tierMeta) stake += tierMeta.stake;
    });
    return { wins, total, winRate: total ? wins / total : 0, pnl, stake, roi: stake ? pnl / stake : 0 };
  };
  const rel = summarizeTier('reliable');
  const trad = summarizeTier('traditional');
  console.log('\n=== CHS Lab Ledger — Rolling P&L ===');
  console.log(`Total entries: ${CHS_LAB_LEDGER.length} (settled: ${settledEntries.length}, pending: ${CHS_LAB_LEDGER.length - settledEntries.length})`);
  console.log('');
  console.log(`Reliable:    ${rel.wins}/${rel.total} (${(rel.winRate*100).toFixed(1)}%) — net ${rel.pnl >= 0 ? '+' : ''}$${rel.pnl.toFixed(0)} on $${rel.stake} staked (ROI ${(rel.roi*100).toFixed(1)}%)`);
  console.log(`Traditional: ${trad.wins}/${trad.total} (${(trad.winRate*100).toFixed(1)}%) — net ${trad.pnl >= 0 ? '+' : ''}$${trad.pnl.toFixed(0)} on $${trad.stake} staked (ROI ${(trad.roi*100).toFixed(1)}%)`);
  if (settledEntries.length > 0) {
    console.log('\nPer-entry detail:');
    settledEntries.forEach(e => {
      const r = e.settlement.reliable;
      const t = e.settlement.traditional;
      console.log(`  ${e.date} ${e.series} G${e.game}: rel=${r ? r.outcome+' '+(r.pnl >= 0 ? '+' : '')+'$'+r.pnl : '—'} | trad=${t ? t.outcome+' '+(t.pnl >= 0 ? '+' : '')+'$'+t.pnl : '—'}`);
    });
  }
}

// ── Write ledger back ────────────────────────────────────────────────
function writeLedger() {
  if (DRY_RUN) {
    console.log('\n[DRY RUN] not writing changes to ledger file.');
    return;
  }
  const header = '// CHS Lab Ledger — auto-maintained by test-chs-lab-ledger-update.js\n' +
                 '// To regenerate manually, edit this file directly. Comments at the top of\n' +
                 '// js/data/chs-lab-ledger.js explain the schema.\n\n';
  const body = `const CHS_LAB_LEDGER = ${JSON.stringify(CHS_LAB_LEDGER, null, 2)};\n\n` +
               `if (typeof module !== 'undefined' && module.exports) {\n` +
               `  module.exports = { CHS_LAB_LEDGER };\n` +
               `}\n`;
  fs.writeFileSync(LEDGER_PATH, header + body, 'utf8');
  console.log(`\nLedger written → ${LEDGER_PATH}`);
}

// ── Main ────────────────────────────────────────────────────────────
if (MODE_SETTLE) {
  console.log('\n=== Settling pending ledger entries ===\n');
  const settled = runSettle();
  console.log(`\n${settled.length} entries settled.`);
}

if (MODE_SNAPSHOT) {
  console.log('\n=== Snapshotting upcoming games to ledger ===\n');
  const fresh = runSnapshot();
  if (fresh.length > 0) {
    CHS_LAB_LEDGER.push(...fresh);
    console.log(`\n${fresh.length} new entries appended.`);
  }
}

if (MODE_SETTLE || MODE_SNAPSHOT) {
  writeLedger();
}

if (MODE_REPORT) {
  runReport();
}
