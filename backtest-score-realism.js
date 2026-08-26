// ============================================================
// PLAYOFF RUN — SCORE-REALISM HARNESS (Phase 1 gate)
// ============================================================
// Run: node backtest-score-realism.js  [--n 200]
//
// The acceptance test for the three-layer game sim: simulate the 15 real
// 2026 bracket matchups many times and hold the OUTPUT DISTRIBUTIONS to
// the measured reality of 169 real playoff games (2025 + 2026):
//
//   team level  : margin mean/tails, serial independence, swing rate,
//                 home/road blowout asymmetry, totals, elimination saves
//   player level: per-tier scoring CVs, serial correlation vs season
//                 baseline (hidden-shift ICC), spike/dud persistence
//
// GAME_PLAN.md carries the target table; this file is the enforcement.
// When a GAME_CONFIG constant is re-tuned, it is re-tuned HERE.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const N_SERIES = (() => {
  const i = process.argv.indexOf('--n');
  return i >= 0 ? parseInt(process.argv[i + 1]) : 200;
})();

const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const ctx = vm.createContext({
  console, Math, Array, Object, Set, Map, JSON,
  parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error,
});
const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), ctx, { filename: rel });

load('js/data/constants.js');
load('js/data/series-data.js');
load('playoffs_2025_validation.js');
load('js/engine/chemistry.js');   // SPM chemistry (synergy reuse)
load('js/game/data/game-constants.js');
load('js/game/data/coach-profiles.js');
load('js/game/data/team-db.js');
load('js/game/engine/matchup-factory.js');
load('js/game/engine/capacity.js');
load('js/game/engine/regime.js');
load('js/game/engine/trajectory.js');
load('js/game/engine/coach-ai.js');
load('js/game/engine/game-sim.js');

const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const corr = (x, y) => {
  const mx = mean(x), my = mean(y);
  const num = x.reduce((a, _, i) => a + (x[i] - mx) * (y[i] - my), 0);
  const dx = Math.sqrt(x.reduce((a, v) => a + (v - mx) ** 2, 0));
  const dy = Math.sqrt(y.reduce((a, v) => a + (v - my) ** 2, 0));
  return num / (dx * dy);
};

// ── Shared team-level statistics over a list of series ─────────
// Each series: { games: [{marginForA (series-home-positive), venueHomeWon,
//                venueHomeMargin, total, winnerIsA}] } in game order.
function teamStats(seriesList) {
  const absM = [], totals = [];
  let venueHomeWins = 0, games = 0;
  const homeWinMargins = [], roadWinMargins = [];
  const pairsX = [], pairsY = [];
  let swings20 = 0, pairs = 0;
  let elimGames = 0, elimSaves = 0;

  seriesList.forEach(s => {
    let aWins = 0, bWins = 0;
    s.games.forEach((g, i) => {
      games++;
      absM.push(Math.abs(g.marginForA));
      totals.push(g.total);
      if (g.venueHomeWon) { venueHomeWins++; homeWinMargins.push(Math.abs(g.venueHomeMargin)); }
      else roadWinMargins.push(Math.abs(g.venueHomeMargin));
      if (i > 0) {
        pairs++;
        pairsX.push(s.games[i - 1].marginForA); pairsY.push(g.marginForA);
        if (Math.abs(g.marginForA - s.games[i - 1].marginForA) >= 20) swings20++;
      }
      // Elimination (one side facing): 3-x entering, x<3
      if ((aWins === 3) !== (bWins === 3)) {
        elimGames++;
        const facingIsA = bWins === 3;
        if (facingIsA === (g.marginForA > 0)) elimSaves++;
      }
      if (g.marginForA > 0) aWins++; else bWins++;
    });
  });

  // Favorite (team A) game win rate — the upset-compression check.
  let aWinsTotal = 0, gamesTotal = 0;
  seriesList.forEach(s => s.games.forEach(g => { gamesTotal++; if (g.marginForA > 0) aWinsTotal++; }));

  return {
    games,
    favWinRate: aWinsTotal / gamesTotal,
    meanAbsMargin: mean(absM),
    p15: absM.filter(m => m >= 15).length / absM.length,
    p20: absM.filter(m => m >= 20).length / absM.length,
    p30: absM.filter(m => m >= 30).length / absM.length,
    serialR: corr(pairsX, pairsY),
    swing20: swings20 / pairs,
    homeWinRate: venueHomeWins / games,
    homeWinMargin: mean(homeWinMargins),
    roadWinMargin: mean(roadWinMargins),
    saveRate: elimGames ? elimSaves / elimGames : 0,
    meanTotal: mean(totals),
  };
}

// ── Real data → series list ────────────────────────────────────
function realSeriesList() {
  const list = [];
  for (const s of Object.values(ctx.PLAYOFFS_2025)) {
    const games = s.games.filter(g => g.winner).map(g => {
      const winnerMargin = Math.abs(g.margin);
      const winnerIsFav = g.winner === s.favorite;
      const venueHomeWon = g.winner === g.home;
      return {
        marginForA: winnerIsFav ? winnerMargin : -winnerMargin,   // A = favorite
        venueHomeWon,
        venueHomeMargin: venueHomeWon ? winnerMargin : -winnerMargin,
        total: g.homeScore + g.awayScore,
      };
    });
    if (games.length >= 2) list.push({ games });
  }
  ctx.SERIES_DATA.forEach(s => {
    if (!s.games) return;
    const games = s.games.filter(g => g && g.winner && g.homeScore != null).map(g => {
      const m = g.homeScore - g.awayScore;                        // A = series home
      const venueIsA = !(g.num === 3 || g.num === 4 || g.num === 6);
      return {
        marginForA: m,
        venueHomeWon: venueIsA ? m > 0 : m < 0,
        venueHomeMargin: venueIsA ? m : -m,
        total: g.homeScore + g.awayScore,
      };
    });
    if (games.length >= 2) list.push({ games });
  });
  return list;
}

// ── Simulated data ─────────────────────────────────────────────
// The 15 real 2026 bracket matchups (home = actual bracket home court).
const MATCHUPS = [
  ['OKC', 'PHX', 'R1'], ['SAS', 'POR', 'R1'], ['DEN', 'MIN', 'R1'], ['LAL', 'HOU', 'R1'],
  ['DET', 'ORL', 'R1'], ['BOS', 'PHI', 'R1'], ['NYK', 'ATL', 'R1'], ['CLE', 'TOR', 'R1'],
  ['OKC', 'LAL', 'R2'], ['SAS', 'MIN', 'R2'], ['NYK', 'PHI', 'R2'], ['DET', 'CLE', 'R2'],
  ['OKC', 'SAS', 'CF'], ['NYK', 'CLE', 'CF'], ['SAS', 'NYK', 'Finals'],
];

function simulate() {
  const seriesList = [];
  const playerTraj = [];  // {tier, ppg, pts: [game pts]} per player-series
  let seed = 1;
  MATCHUPS.forEach(([h, a, round]) => {
    const sctx = ctx.makeGameSeries(ctx.GAME_TEAM_DB, h, a, round);
    for (let k = 0; k < N_SERIES; k++) {
      const ser = ctx.simulateSeriesOnce(sctx, { seed: seed++ });
      seriesList.push({
        games: ser.games.map(g => {
          const m = g.homeScore - g.awayScore;
          const venueIsA = !(g.gameNum === 3 || g.gameNum === 4 || g.gameNum === 6);
          return {
            marginForA: m,
            venueHomeWon: venueIsA ? m > 0 : m < 0,
            venueHomeMargin: venueIsA ? m : -m,
            total: g.homeScore + g.awayScore,
          };
        }),
      });
      // player trajectories (subsample for speed: every 8th series)
      if (k % 8 === 0) {
        const byName = {};
        ser.games.forEach(g => ['home', 'away'].forEach(side => g.box[side].forEach(row => {
          (byName[row.name] = byName[row.name] || []).push(row);
        })));
        [sctx.home, sctx.away].forEach(team => team.players.forEach(p => {
          const rows = byName[p.name];
          if (!rows || rows.length < 4 || p.ppg < 5) return;
          if (mean(rows.map(r => r.min)) < 15) return;
          playerTraj.push({ tier: p.tier, ppg: p.ppg, pts: rows.map(r => r.pts) });
        }));
      }
    }
  });
  return { seriesList, playerTraj };
}

function playerStats(traj) {
  const cvByTier = { star: [], mid: [], role: [] };
  const sx = [], sy = [];
  const spikeNext = [], dudNext = [];
  traj.forEach(t => {
    const m = mean(t.pts);
    if (m <= 0) return;
    const sd = Math.sqrt(t.pts.reduce((a, v) => a + (v - m) ** 2, 0) / (t.pts.length - 1));
    cvByTier[t.tier].push(sd / m);
    for (let i = 0; i < t.pts.length - 1; i++) {
      sx.push((t.pts[i] - t.ppg) / t.ppg); sy.push((t.pts[i + 1] - t.ppg) / t.ppg);
      if (t.ppg >= 12 && t.pts[i] >= 1.4 * t.ppg) spikeNext.push(t.pts[i + 1] / t.ppg);
      if (t.ppg >= 12 && t.pts[i] <= 0.6 * t.ppg) dudNext.push(t.pts[i + 1] / t.ppg);
    }
  });
  return {
    starCV: mean(cvByTier.star), midCV: mean(cvByTier.mid), roleCV: mean(cvByTier.role),
    serialVsBaseline: corr(sx, sy),
    spikeNext: mean(spikeNext) * 100, dudNext: mean(dudNext) * 100,
    n: traj.length,
  };
}

// ── Run + compare ──────────────────────────────────────────────
const real = teamStats(realSeriesList());
const { seriesList, playerTraj } = simulate();
const sim = teamStats(seriesList);
const pstats = playerStats(playerTraj);

// Measured player targets (Aug 2026 analysis, 138 real player-series).
const PLAYER_TARGETS = {
  starCV: [0.27, 0.06], midCV: [0.35, 0.08], roleCV: [0.55, 0.12],
  serialVsBaseline: [0.33, 0.12], spikeNext: [113, 12], dudNext: [73, 12],
};

let failed = 0;
const rows = [];
function check(label, simVal, target, tol, fmt) {
  const ok = Math.abs(simVal - target) <= tol;
  if (!ok) failed++;
  rows.push([label, fmt(target), fmt(simVal), '±' + fmt(tol), ok ? 'PASS' : 'FAIL']);
}
const f1 = v => (+v).toFixed(1), f2 = v => (+v).toFixed(2), pc = v => (100 * v).toFixed(1) + '%';

console.log(`Simulated ${sim.games} games across ${MATCHUPS.length} matchups x ${N_SERIES} series`);
console.log(`Real reference: ${real.games} games (2025 + 2026)\n`);

check('favorite game win rate', sim.favWinRate, real.favWinRate, 0.05, pc);
check('mean |margin|', sim.meanAbsMargin, real.meanAbsMargin, 1.5, f1);
check('P(margin>=15)', sim.p15, real.p15, 0.05, pc);
check('P(margin>=20)', sim.p20, real.p20, 0.05, pc);
check('P(margin>=30)', sim.p30, real.p30, 0.04, pc);
check('serial corr (margins)', sim.serialR, 0, 0.08, f2);
check('20+ pt consecutive swings', sim.swing20, real.swing20, 0.07, pc);
check('home win rate', sim.homeWinRate, real.homeWinRate, 0.06, pc);
check('avg home-win margin', sim.homeWinMargin, real.homeWinMargin, 3.5, f1);
check('avg road-win margin', sim.roadWinMargin, real.roadWinMargin, 3.5, f1);
check('elimination save rate', sim.saveRate, real.saveRate, 0.12, pc);
check('mean total', sim.meanTotal, real.meanTotal, 6, f1);
check('star pts CV', pstats.starCV, ...PLAYER_TARGETS.starCV, f2);
check('mid pts CV', pstats.midCV, ...PLAYER_TARGETS.midCV, f2);
check('role pts CV', pstats.roleCV, ...PLAYER_TARGETS.roleCV, f2);
check('player serial vs baseline', pstats.serialVsBaseline, ...PLAYER_TARGETS.serialVsBaseline, f2);
check('post-spike next game %', pstats.spikeNext, ...PLAYER_TARGETS.spikeNext, v => f1(v) + '%');
check('post-dud next game %', pstats.dudNext, ...PLAYER_TARGETS.dudNext, v => f1(v) + '%');

const w = [28, 10, 10, 9, 6];
console.log(['metric', 'target', 'sim', 'tol', ''].map((h, i) => h.padEnd(w[i])).join(''));
console.log('-'.repeat(w.reduce((a, b) => a + b)));
rows.forEach(r => console.log(r.map((c, i) => String(c).padEnd(w[i])).join('')));
console.log(`\n(player sample: ${pstats.n} sim player-series)`);
console.log('\n' + '='.repeat(60));
console.log(failed === 0 ? 'SCORE REALISM: ALL METRICS PASS' : `SCORE REALISM: ${failed} METRIC(S) FAILING`);
console.log('='.repeat(60));
process.exit(failed ? 1 : 0);
