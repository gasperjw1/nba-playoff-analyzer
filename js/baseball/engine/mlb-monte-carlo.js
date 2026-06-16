// ============================================================
// MLB MONTE CARLO — STUB (scaffold)
// ============================================================
// The seam for the baseball simulation. NOT implemented yet.
//
// FUTURE (out of scope): simulate a game plate-appearance by plate-appearance
// (or inning-by-inning via run-expectancy) N times to produce:
//   - win-probability + run-line cover probability
//   - a runs distribution (for totals / first-5 totals)
//   - per-pitcher strikeout distributions (for K props)
// This mirrors the NBA runMonteCarlo() role (margin/win-prob/per-player
// distributions) but with a baseball event model. The output shape should be
// compatible with the existing parlay-builder/edge layer so those reuse too.
// ============================================================

function simulateGame(game, iterations) {
  return {
    status: 'coming-soon',
    gameId: game && game.id,
    iterations: iterations || 0,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { simulateGame };
}
