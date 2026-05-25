// ============================================================
// CLOSEOUT-EDGE BACKTEST — Phase 73o pre-implementation validation
// ============================================================
// Question we're answering: in playoff games where the WINNING team
// also clinches the series (closeout games), do the WINNER's top-5
// starters systematically play FEWER minutes and put up LOWER stat
// totals than their prior-games average? If yes by a meaningful
// margin, the "closeout minutes cap" factor is a real edge the
// market may not be pricing on prop lines that get set near series
// averages.
//
// Method:
//   1. Walk SERIES_DATA. For each settled series, identify the
//      closeout game (the game whose winner had 4 series wins
//      including this game).
//   2. For the closeout-game WINNER, identify top-5 starters by
//      their average minutes across the SERIES' prior games (G1
//      through G(N-1)).
//   3. For each starter, compare closeout minutes + PTS + PRA
//      against their series-average (excluding this closeout).
//   4. Aggregate across all closeout games + report:
//        - Median minutes ratio (closeout/prior_avg)
//        - % of starters with min_ratio < 0.90 (cap fired)
//        - Median PTS ratio, median PRA ratio
//        - Margin-conditional: did stat compression correlate
//          with closeout margin? (bigger blowouts → more cap)
//
// Edge claim:
//   If closeout starters play ~85% of normal minutes (12-15% cap)
//   AND their PTS/PRA drops proportionally, then any prop line
//   set near series-average underestimates the closeout-state line
//   by the same margin. Booking that systematically = +EV.
//
// Caveats:
//   - Sample is small (2026 R1+R2 + 0 R3 closeouts so far)
//   - 2025 validation data has no boxScores, so can't extend
//   - Some closeouts are close games (no cap fired); some are
//     blowouts (cap fired hard). The conditional split matters.
// ============================================================

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const toVar = (c) => c.replace(/^(const|let) /gm, 'var ');
const sb = { console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite, Boolean, Number, String, RegExp, Date, Error };
vm.createContext(sb);
const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), sb);
[
  'js/data/constants.js', 'js/data/historical.js', 'js/data/news.js',
  'js/data/series-data.js', 'js/data/boxscores.js',
  'js/utils.js',
].forEach(load);
const { SERIES_DATA } = sb;

// ── Helpers ─────────────────────────────────────────────────────────
function isCloseoutGame(series, gameIdx) {
  // A closeout game is one where the WINNER clinched the series:
  // their win count through game[gameIdx] reaches 4 AND the series
  // didn't continue past this game.
  const g = series.games[gameIdx];
  if (!g || !g.winner) return false;
  let homeWins = 0, awayWins = 0;
  for (let i = 0; i <= gameIdx; i++) {
    const gi = series.games[i];
    if (!gi || !gi.winner) return false;
    if (gi.winner === series.homeTeam.abbr) homeWins++;
    else if (gi.winner === series.awayTeam.abbr) awayWins++;
  }
  const winnerWins = g.winner === series.homeTeam.abbr ? homeWins : awayWins;
  // Must be the clinching game (4 wins) AND no future game has a winner
  if (winnerWins !== 4) return false;
  for (let i = gameIdx + 1; i < series.games.length; i++) {
    if (series.games[i] && series.games[i].winner) return false;
  }
  return true;
}

// Get a player's array of minutes across games[0..gameIdx-1] (prior games only)
// Returns array of numbers for games where player appeared with min > 0
function priorMinutesForPlayer(series, playerName, beforeGameIdx, side) {
  const arr = [];
  for (let i = 0; i < beforeGameIdx; i++) {
    const g = series.games[i];
    if (!g || !g.boxScores) continue;
    const bs = g.boxScores[side];
    if (!Array.isArray(bs)) continue;
    const p = bs.find(x => x && x.name === playerName);
    if (p && typeof p.min === 'number' && p.min > 0) arr.push(p.min);
  }
  return arr;
}

function priorStatsForPlayer(series, playerName, beforeGameIdx, side, statKey) {
  const arr = [];
  for (let i = 0; i < beforeGameIdx; i++) {
    const g = series.games[i];
    if (!g || !g.boxScores) continue;
    const bs = g.boxScores[side];
    if (!Array.isArray(bs)) continue;
    const p = bs.find(x => x && x.name === playerName);
    if (!p || typeof p.min !== 'number' || p.min <= 0) continue;
    if (statKey === 'pra') {
      arr.push((p.pts || 0) + (p.reb || 0) + (p.ast || 0));
    } else {
      arr.push(p[statKey] || 0);
    }
  }
  return arr;
}

function median(arr) {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function mean(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
}

// ── Main scan ───────────────────────────────────────────────────────
const closeoutRecords = [];

SERIES_DATA.forEach(series => {
  if (!series.games || !Array.isArray(series.games)) return;
  for (let i = 0; i < series.games.length; i++) {
    if (!isCloseoutGame(series, i)) continue;
    const closeoutGame = series.games[i];
    if (!closeoutGame.boxScores) continue;

    const winnerAbbr = closeoutGame.winner;
    const winnerSide = winnerAbbr === series.homeTeam.abbr ? 'home' : 'away';
    const winnerTeam = winnerSide === 'home' ? series.homeTeam : series.awayTeam;
    const margin = Math.abs((closeoutGame.homeScore || 0) - (closeoutGame.awayScore || 0));
    const wasBlowout = margin >= 15;

    // Identify TOP-5 starters: players with highest avg minutes in prior G1..G(N-1)
    // (skip players who played 0 prior games — they're new additions / DNP-CD chain)
    const starterCandidates = winnerTeam.players
      .map(p => {
        if (!p || !p.name) return null;
        const priorMin = priorMinutesForPlayer(series, p.name, i, winnerSide);
        if (priorMin.length === 0) return null;
        return { name: p.name, priorAvgMin: mean(priorMin), priorGames: priorMin.length };
      })
      .filter(Boolean)
      .sort((a, b) => b.priorAvgMin - a.priorAvgMin)
      .slice(0, 5);

    // For each starter, get closeout min + closeout pts/pra + prior avg pts/pra
    const closeoutBoxAll = [...(closeoutGame.boxScores[winnerSide] || [])];
    starterCandidates.forEach(s => {
      const p = closeoutBoxAll.find(x => x && x.name === s.name);
      if (!p) return;
      const closeoutMin = p.min || 0;
      const closeoutPts = p.pts || 0;
      const closeoutPra = (p.pts || 0) + (p.reb || 0) + (p.ast || 0);
      const priorPts = mean(priorStatsForPlayer(series, s.name, i, winnerSide, 'pts'));
      const priorPra = mean(priorStatsForPlayer(series, s.name, i, winnerSide, 'pra'));
      closeoutRecords.push({
        series: series.id,
        gameNum: closeoutGame.num,
        winner: winnerAbbr,
        margin,
        wasBlowout,
        player: s.name,
        priorAvgMin: +s.priorAvgMin.toFixed(1),
        closeoutMin,
        minRatio: closeoutMin / s.priorAvgMin,
        priorAvgPts: priorPts != null ? +priorPts.toFixed(1) : null,
        closeoutPts,
        ptsRatio: priorPts ? closeoutPts / priorPts : null,
        priorAvgPra: priorPra != null ? +priorPra.toFixed(1) : null,
        closeoutPra,
        praRatio: priorPra ? closeoutPra / priorPra : null,
      });
    });
  }
});

// ── Aggregate + report ──────────────────────────────────────────────
console.log(`\n=== CLOSEOUT-EDGE BACKTEST — 2026 playoffs ===`);
console.log(`Total starter-closeout records: ${closeoutRecords.length} across ${new Set(closeoutRecords.map(r => r.series + ':' + r.gameNum)).size} closeout games\n`);

if (closeoutRecords.length === 0) {
  console.log('No closeout records found. Exiting.');
  process.exit(0);
}

// Per-game summary
const games = {};
closeoutRecords.forEach(r => {
  const k = `${r.series} G${r.gameNum}`;
  if (!games[k]) games[k] = { winner: r.winner, margin: r.margin, wasBlowout: r.wasBlowout, records: [] };
  games[k].records.push(r);
});
console.log('=== Per-game detail ===');
Object.entries(games).forEach(([k, g]) => {
  console.log(`${k}: ${g.winner} won by ${g.margin}${g.wasBlowout ? ' (BLOWOUT)' : ' (close)'}`);
  g.records.forEach(r => {
    const minPctStr = `${(r.minRatio * 100).toFixed(0)}%`;
    const ptsPctStr = r.ptsRatio != null ? `${(r.ptsRatio * 100).toFixed(0)}%` : '—';
    const praPctStr = r.praRatio != null ? `${(r.praRatio * 100).toFixed(0)}%` : '—';
    console.log(`  ${r.player.padEnd(28)} min ${r.closeoutMin}/${r.priorAvgMin} (${minPctStr}) | pts ${r.closeoutPts}/${r.priorAvgPts} (${ptsPctStr}) | pra ${r.closeoutPra}/${r.priorAvgPra} (${praPctStr})`);
  });
  console.log('');
});

// Aggregate ratios
const minRatios = closeoutRecords.map(r => r.minRatio).filter(x => isFinite(x));
const ptsRatios = closeoutRecords.map(r => r.ptsRatio).filter(x => isFinite(x) && x != null);
const praRatios = closeoutRecords.map(r => r.praRatio).filter(x => isFinite(x) && x != null);

console.log(`=== AGGREGATE (all ${closeoutRecords.length} starter-closeout records) ===`);
console.log(`Median minutes ratio: ${(median(minRatios) * 100).toFixed(1)}% of prior-games avg`);
console.log(`Mean minutes ratio:   ${(mean(minRatios) * 100).toFixed(1)}%`);
console.log(`% with min_ratio < 0.90 (cap fired): ${(minRatios.filter(r => r < 0.90).length / minRatios.length * 100).toFixed(0)}%`);
console.log(`Median PTS ratio:     ${(median(ptsRatios) * 100).toFixed(1)}% of prior avg`);
console.log(`Mean PTS ratio:       ${(mean(ptsRatios) * 100).toFixed(1)}%`);
console.log(`Median PRA ratio:     ${(median(praRatios) * 100).toFixed(1)}% of prior avg`);
console.log(`Mean PRA ratio:       ${(mean(praRatios) * 100).toFixed(1)}%`);

// Blowout vs close split
const blowoutRecs = closeoutRecords.filter(r => r.wasBlowout);
const closeRecs = closeoutRecords.filter(r => !r.wasBlowout);

console.log(`\n=== CONDITIONAL: BLOWOUT closeouts (margin >= 15, n=${blowoutRecs.length}) ===`);
if (blowoutRecs.length) {
  console.log(`Median min ratio: ${(median(blowoutRecs.map(r => r.minRatio)) * 100).toFixed(1)}%`);
  console.log(`Median PTS ratio: ${(median(blowoutRecs.map(r => r.ptsRatio).filter(x => x != null)) * 100).toFixed(1)}%`);
  console.log(`Median PRA ratio: ${(median(blowoutRecs.map(r => r.praRatio).filter(x => x != null)) * 100).toFixed(1)}%`);
}

console.log(`\n=== CONDITIONAL: CLOSE closeouts (margin < 15, n=${closeRecs.length}) ===`);
if (closeRecs.length) {
  console.log(`Median min ratio: ${(median(closeRecs.map(r => r.minRatio)) * 100).toFixed(1)}%`);
  console.log(`Median PTS ratio: ${(median(closeRecs.map(r => r.ptsRatio).filter(x => x != null)) * 100).toFixed(1)}%`);
  console.log(`Median PRA ratio: ${(median(closeRecs.map(r => r.praRatio).filter(x => x != null)) * 100).toFixed(1)}%`);
}

// Edge verdict
console.log(`\n=== EDGE VERDICT ===`);
const medMin = median(minRatios);
const medPts = median(ptsRatios);
const medPra = median(praRatios);
if (medMin < 0.90 && (medPts < 0.90 || medPra < 0.90)) {
  console.log(`✓ Closeout cap is REAL EDGE: starters play ${(medMin*100).toFixed(0)}% of normal minutes,`);
  console.log(`  PTS drops to ${(medPts*100).toFixed(0)}%, PRA to ${(medPra*100).toFixed(0)}% of series average.`);
  console.log(`  → Worth coding as factor in calcExpectedPlayerStats for closeout games.`);
} else {
  console.log(`✗ Closeout cap NOT a clear edge in this sample.`);
  console.log(`  Min ratio ${(medMin*100).toFixed(0)}% (threshold <90%); PTS ${(medPts*100).toFixed(0)}%, PRA ${(medPra*100).toFixed(0)}%.`);
  console.log(`  → Don't ship the factor; sample size + variance keep it noise.`);
}

// Per-side check: did blowout cap fire harder than close?
if (blowoutRecs.length && closeRecs.length) {
  const blowoutMedMin = median(blowoutRecs.map(r => r.minRatio));
  const closeMedMin = median(closeRecs.map(r => r.minRatio));
  console.log(`\nBlowout vs close min ratio: ${(blowoutMedMin*100).toFixed(0)}% (blowout) vs ${(closeMedMin*100).toFixed(0)}% (close).`);
  if (blowoutMedMin < closeMedMin - 0.05) {
    console.log(`  → Conditional split is real: cap mostly fires in blowouts. Factor should be margin-aware.`);
  } else {
    console.log(`  → Cap doesn't show meaningful blowout-vs-close split. Margin-agnostic factor would be fine.`);
  }
}

console.log('');
