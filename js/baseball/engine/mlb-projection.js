// ============================================================
// MLB PROJECTION ENGINE — STUB (scaffold)
// ============================================================
// This is the seam where the real baseball model will live. It is NOT
// implemented yet — projectGame() returns a 'coming-soon' marker so the UI
// can render a placeholder without crashing.
//
// FUTURE (out of scope for the scaffold): a game projection built on
// established public sabermetrics rather than NBA SPM chemistry —
//   - log5 / run-expectancy (Markov) for run distribution
//   - starter quality via FIP / SIERA / xwOBA, platoon splits
//   - park factor (MLB_PARKS) + weather adjustment to the run environment
//   - times-through-the-order penalty + bullpen leverage (the within-game
//     "trajectory" signal the NBA model lacked) — feeds first-5 vs full-game
//   - output: { homeWinProb, runLineProbs, totalDist, pitcherKDist, ... }
// ============================================================

function projectGame(game) {
  return {
    status: 'coming-soon',
    note: 'MLB projection engine not yet built — see plan + this file header.',
    gameId: game && game.id,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projectGame };
}
