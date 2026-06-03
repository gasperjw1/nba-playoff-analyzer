// ============================================================
// CHS LAB RETROACTIVE BACKTEST — Phase 73l (May 23, 2026)
// ============================================================
// Walks every settled CF game, masks the outcome, runs the same
// runMonteCarlo + buildReliableParlay + buildTraditionalParlay
// pipeline the live CHS Lab tab uses, then scores the suggested
// legs against the actual box score we just hid.
//
// Method: Multi-trial averaging.
//   - 5 MC trials per game, N=2000 iterations each
//   - Average per-leg hit rate across trials
//   - Score "canonical" legs from each trial against actuals
//   - Aggregate W/L + P&L assuming $100 stake per parlay
//
// Caveats (documented in the output report):
//   1. MC is stochastic — different runs yield different candidate
//      legs. We average across 5 trials to reduce variance but the
//      results aren't perfectly reproducible.
//   2. Engine calibration is "current" (Phase 71+) applied to past
//      games. This is "how does the current algorithm score against
//      past actuals," not "how did the algorithm-of-the-time score."
//   3. Pre-game state is approximated by masking the target game's
//      winner + boxScores. Engine modifiers using G1..G(N-1) still
//      see those games' actual outcomes (correct pre-game behavior).
//   4. Small sample — only 5 CF games settled so far. Treat as a
//      directional signal, not a calibrated EV estimate.
//
// Usage: node backtest-chs-lab.js [--round CF] [--trials 5] [--iter 2000]
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Parse CLI args
const argv = process.argv.slice(2);
const opt = (flag, def) => {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : def;
};
const ROUND_FILTER = opt('--round', 'CF');
const TRIALS = parseInt(opt('--trials', '5'), 10);
const ITER = parseInt(opt('--iter', '2000'), 10);
const STAKE = 100;

// Load codebase into a VM sandbox so `const` declarations don't leak
const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const sandbox = { console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error };
vm.createContext(sandbox);
const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), sandbox);
[
  'js/data/constants.js', 'js/data/historical.js', 'js/data/news.js',
  'js/data/series-data.js', 'js/data/boxscores.js', 'js/data/bets-data.js',
  'js/data/chs-ledger.js', 'js/utils.js', 'js/state.js',
  'js/engine/lineup-overrides.js', 'js/engine/chemistry.js', 'js/engine/fatigue.js',
  'js/engine/matchups.js', 'js/engine/ratings.js', 'js/engine/projections.js',
  'js/engine/monte-carlo.js', 'js/engine/parlay-builder.js',
].forEach(load);

const { SERIES_DATA, runMonteCarlo, buildReliableParlay, buildTraditionalParlay } = sandbox;

// ── American-odds helpers ───────────────────────────────────────────
function americanToMult(odds) {
  const n = Number(odds);
  if (!isFinite(n) || n === 0) return null;
  return n > 0 ? 1 + n / 100 : 1 + 100 / -n;
}

// ── Score a single leg against the actual game result ────────────────
// All parlay-builder legs are { type:'prop', player, stat, line, direction:'over', team }
function scoreLegAgainstActual(leg, game) {
  if (!game || !game.boxScores) return { hit: null, reason: 'no-boxscore' };
  const allPlayers = [...(game.boxScores.home || []), ...(game.boxScores.away || [])];
  const player = allPlayers.find(p => {
    if (!p || !p.name) return false;
    const a = String(p.name).toLowerCase();
    const b = String(leg.player).toLowerCase();
    if (a === b) return true;
    // Fuzzy: last-name match (handles "M. Robinson" vs "Mitchell Robinson")
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
      // boxScores store "X-Y" string for threes (made-attempted)
      if (typeof player.threes === 'string') {
        const m = player.threes.match(/^(\d+)/);
        value = m ? parseInt(m[1], 10) : null;
      } else value = player.threes;
      break;
    }
    case 'pra': value = (player.pts || 0) + (player.reb || 0) + (player.ast || 0); break;
    case 'stocks': value = (player.stl || 0) + (player.blk || 0); break;
    default: return { hit: null, reason: 'unknown-stat: ' + leg.stat };
  }
  if (typeof value !== 'number') return { hit: null, reason: 'stat-not-numeric' };

  const dir = String(leg.direction || 'over').toLowerCase();
  const hit = (dir === 'over') ? (value > leg.line) : (value < leg.line);
  return { hit, value, line: leg.line, dir };
}

// ── Mask a game's outcome (deep clone the series, null the target game) ──
function makeMaskedSeries(series, gameNum) {
  // Shallow clone is enough — only games[N-1]'s primitive fields are mutated.
  const clone = { ...series };
  clone.games = series.games.map((g, i) => {
    if (i !== gameNum - 1) return g;
    return {
      ...g,
      result: null,
      winner: null,
      homeScore: null,
      awayScore: null,
      boxScores: undefined,  // remove the hidden truth
      notes: '',             // strip narrative that mentions outcome
    };
  });
  return clone;
}

// ── Run N trials, return the median (parlay, hit, payout) per game ──
function backtestGame(series, gameNum) {
  const actualGame = series.games[gameNum - 1];
  if (!actualGame || !actualGame.winner || !actualGame.boxScores) {
    return { skipped: true, reason: 'no-actual-result-or-boxscores' };
  }

  const masked = makeMaskedSeries(series, gameNum);
  const trials = [];
  for (let t = 0; t < TRIALS; t++) {
    const mc = runMonteCarlo(masked, gameNum, { iterations: ITER });
    if (!mc) { trials.push({ skipped: true }); continue; }
    const reliable = buildReliableParlay(mc, masked);
    const traditional = buildTraditionalParlay(mc, masked);
    const trial = { trial: t + 1, reliable: null, traditional: null };
    [['reliable', reliable], ['traditional', traditional]].forEach(([tier, parlay]) => {
      if (!parlay) return;
      const legScores = (parlay.legs || []).map(l => ({ leg: l, ...scoreLegAgainstActual(l, actualGame) }));
      const allHit = legScores.length > 0 && legScores.every(ls => ls.hit === true);
      const mult = americanToMult(parlay.parlayJuice);
      const profit = allHit && mult ? STAKE * (mult - 1) : -STAKE;
      trial[tier] = {
        legCount: parlay.legCount,
        americanOdds: parlay.parlayJuice,
        combinedMC: parlay.score && parlay.score.combined,
        legScores,
        outcome: allHit ? 'win' : 'loss',
        profit,
      };
    });
    trials.push(trial);
  }
  return { skipped: false, trials };
}

// ── Aggregate trials → per-game canonical result ────────────────────
function summarizeGame(name, series, gameNum, result) {
  if (result.skipped) return { name, skipped: true, reason: result.reason };
  const reliableTrials = result.trials.filter(t => t && t.reliable).map(t => t.reliable);
  const tradTrials = result.trials.filter(t => t && t.traditional).map(t => t.traditional);
  const summary = (arr) => {
    if (!arr.length) return null;
    const wins = arr.filter(t => t.outcome === 'win').length;
    const profitSum = arr.reduce((s, t) => s + t.profit, 0);
    return {
      trials: arr.length,
      wins,
      losses: arr.length - wins,
      winRate: wins / arr.length,
      avgProfit: profitSum / arr.length,
      avgCombinedMC: arr.reduce((s, t) => s + (t.combinedMC || 0), 0) / arr.length,
      avgAmerican: Math.round(arr.reduce((s, t) => s + (t.americanOdds || 0), 0) / arr.length),
      avgLegCount: arr.reduce((s, t) => s + (t.legCount || 0), 0) / arr.length,
      // Carry one sample for the per-game detail view
      sample: arr[0],
    };
  };
  return {
    name,
    seriesId: series.id,
    gameNum,
    actual: {
      winner: series.games[gameNum - 1].winner,
      score: `${series.games[gameNum - 1].homeScore}-${series.games[gameNum - 1].awayScore}`,
    },
    reliable: summary(reliableTrials),
    traditional: summary(tradTrials),
  };
}

// ── Main run ────────────────────────────────────────────────────────
console.log(`\n=== CHS LAB BACKTEST — ${ROUND_FILTER} round, ${TRIALS} trials × ${ITER} iter ===\n`);

const targetSeries = SERIES_DATA.filter(s => s.round === ROUND_FILTER && s.homeTeam && s.homeTeam.players && s.homeTeam.players.length > 0);
const perGame = [];

targetSeries.forEach(series => {
  series.games.forEach(g => {
    if (!g.winner || !g.boxScores) return;
    const label = `${series.id} G${g.num} (${g.winner} ${g.homeScore}-${g.awayScore})`;
    process.stdout.write(`Backtesting ${label}... `);
    const t0 = Date.now();
    const r = backtestGame(series, g.num);
    const ms = Date.now() - t0;
    const s = summarizeGame(label, series, g.num, r);
    if (s.skipped) {
      console.log(`SKIPPED (${s.reason}) [${ms}ms]`);
    } else {
      const rel = s.reliable ? `${(s.reliable.winRate*100).toFixed(0)}% W (${s.reliable.wins}/${s.reliable.trials}), avg $${s.reliable.avgProfit.toFixed(0)}` : 'no parlay';
      const trad = s.traditional ? `${(s.traditional.winRate*100).toFixed(0)}% W (${s.traditional.wins}/${s.traditional.trials}), avg $${s.traditional.avgProfit.toFixed(0)}` : 'no parlay';
      console.log(`reliable=${rel} | traditional=${trad} [${ms}ms]`);
    }
    perGame.push(s);
  });
});

// ── Aggregate totals ────────────────────────────────────────────────
function totalize(perGame, tier) {
  let trials = 0, wins = 0, profitSum = 0, stakeSum = 0;
  perGame.forEach(g => {
    if (g.skipped) return;
    const t = g[tier];
    if (!t) return;
    trials += t.trials;
    wins += t.wins;
    profitSum += t.avgProfit * t.trials;  // total profit summed over trials × games
    stakeSum += STAKE * t.trials;
  });
  return {
    trials,
    wins,
    winRate: trials ? wins / trials : 0,
    profitSum,
    stakeSum,
    roi: stakeSum ? profitSum / stakeSum : 0,
  };
}
const totReliable = totalize(perGame, 'reliable');
const totTraditional = totalize(perGame, 'traditional');

// ── Markdown report ─────────────────────────────────────────────────
const lines = [];
lines.push(`# CHS Lab Backtest — ${ROUND_FILTER} games (as of ${new Date().toISOString().slice(0, 10)})\n`);
lines.push(`**Method:** for each settled game, mask the outcome (winner/scores/boxScores), run \`runMonteCarlo\` + \`buildReliableParlay\` + \`buildTraditionalParlay\` ${TRIALS} times at ${ITER} iter, score the resulting legs against the actual box score. P&L assumes \$${STAKE} stake per parlay; payout uses the MC-estimated American odds (since DK actual juice isn't logged).\n`);
lines.push(`**Caveats:**`);
lines.push(`- MC is stochastic; ${TRIALS} trials per game smooth this but don't eliminate variance.`);
lines.push(`- Engine calibration is current (Phase 71-73k). Past games are scored with today's algorithm, not the one shipped at the time.`);
lines.push(`- Sample size is small (${perGame.filter(g => !g.skipped).length} games). Treat as directional, not as a calibrated EV figure.`);
lines.push(`- Payout uses estimated American odds from MC-implied probability; real DK lines may pay a few % less due to vig.\n`);

lines.push(`## Aggregate totals\n`);
lines.push(`| Tier | Trials | Wins | W% | Total stake | Net P&L | ROI |`);
lines.push(`|---|---:|---:|---:|---:|---:|---:|`);
lines.push(`| Reliable (2-3 leg, ≥80% combined) | ${totReliable.trials} | ${totReliable.wins} | ${(totReliable.winRate*100).toFixed(1)}% | $${totReliable.stakeSum} | ${totReliable.profitSum >= 0 ? '+' : ''}$${totReliable.profitSum.toFixed(0)} | ${(totReliable.roi*100).toFixed(1)}% |`);
lines.push(`| Traditional (3-5 leg, no floor) | ${totTraditional.trials} | ${totTraditional.wins} | ${(totTraditional.winRate*100).toFixed(1)}% | $${totTraditional.stakeSum} | ${totTraditional.profitSum >= 0 ? '+' : ''}$${totTraditional.profitSum.toFixed(0)} | ${(totTraditional.roi*100).toFixed(1)}% |`);
lines.push('');

lines.push(`## Per-game results\n`);
lines.push(`| Game | Actual | Reliable W/L (avg \$) | Traditional W/L (avg \$) |`);
lines.push(`|---|---|---|---|`);
perGame.forEach(g => {
  if (g.skipped) {
    lines.push(`| ${g.name} | — | SKIPPED (${g.reason}) | — |`);
    return;
  }
  const r = g.reliable;
  const t = g.traditional;
  const rStr = r ? `${r.wins}/${r.trials} → ${r.avgProfit >= 0 ? '+' : ''}$${r.avgProfit.toFixed(0)} (legs avg ${r.avgLegCount.toFixed(1)}, ${(r.avgCombinedMC*100).toFixed(0)}% combined, ${r.avgAmerican > 0 ? '+' : ''}${r.avgAmerican})` : 'no parlay';
  const tStr = t ? `${t.wins}/${t.trials} → ${t.avgProfit >= 0 ? '+' : ''}$${t.avgProfit.toFixed(0)} (legs avg ${t.avgLegCount.toFixed(1)}, ${(t.avgCombinedMC*100).toFixed(0)}% combined, ${t.avgAmerican > 0 ? '+' : ''}${t.avgAmerican})` : 'no parlay';
  lines.push(`| ${g.name} | ${g.actual.winner} ${g.actual.score} | ${rStr} | ${tStr} |`);
});
lines.push('');

lines.push(`## Sample leg detail (first trial per game)\n`);
perGame.forEach(g => {
  if (g.skipped) return;
  lines.push(`### ${g.name}\n`);
  ['reliable', 'traditional'].forEach(tier => {
    const t = g[tier];
    if (!t || !t.sample) { lines.push(`- **${tier}**: no parlay assembled`); return; }
    const s = t.sample;
    lines.push(`- **${tier}** (legs=${s.legCount}, odds ${s.americanOdds > 0 ? '+' : ''}${s.americanOdds}, MC combined ${(s.combinedMC*100).toFixed(0)}%) → **${s.outcome.toUpperCase()}** ${s.profit >= 0 ? '+' : ''}$${s.profit}`);
    s.legScores.forEach(ls => {
      const verdict = ls.hit === true ? '✓ HIT' : ls.hit === false ? '✗ MISS' : `? ${ls.reason || ''}`;
      const valStr = ls.value != null ? `actual ${ls.value}` : '';
      lines.push(`  - ${ls.leg.player} ${ls.leg.stat} over ${ls.leg.line} (MC ${(ls.leg.hitRate*100).toFixed(0)}%) — ${verdict} ${valStr}`);
    });
  });
  lines.push('');
});

const reportText = lines.join('\n');
const reportPath = path.join(__dirname, 'CHS_LAB_BACKTEST_REPORT.md');
fs.writeFileSync(reportPath, reportText, 'utf8');

const jsonPath = path.join(__dirname, 'CHS_LAB_BACKTEST_DETAIL.json');
fs.writeFileSync(jsonPath, JSON.stringify({ round: ROUND_FILTER, trials: TRIALS, iter: ITER, stake: STAKE, totals: { reliable: totReliable, traditional: totTraditional }, games: perGame }, null, 2), 'utf8');

console.log(`\n=== AGGREGATE ===`);
console.log(`Reliable:    ${totReliable.wins}/${totReliable.trials} (${(totReliable.winRate*100).toFixed(1)}%) — net ${totReliable.profitSum >= 0 ? '+' : ''}$${totReliable.profitSum.toFixed(0)} on $${totReliable.stakeSum} staked (ROI ${(totReliable.roi*100).toFixed(1)}%)`);
console.log(`Traditional: ${totTraditional.wins}/${totTraditional.trials} (${(totTraditional.winRate*100).toFixed(1)}%) — net ${totTraditional.profitSum >= 0 ? '+' : ''}$${totTraditional.profitSum.toFixed(0)} on $${totTraditional.stakeSum} staked (ROI ${(totTraditional.roi*100).toFixed(1)}%)`);
console.log(`\nReport written to: ${reportPath}`);
console.log(`Detail JSON: ${jsonPath}`);
