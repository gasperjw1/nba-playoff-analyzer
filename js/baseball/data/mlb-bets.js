// ============================================================
// MLB BETS — sample baseball bets (scaffold)
// ============================================================
// These deliberately conform to the GENERIC bet contract that the existing
// sport-agnostic engine (js/engine/edge-detector.js, risk-controls.js)
// already understands — proving the betting/edge/risk layer crosses sports
// with no duplication:
//   { id, gameId, type:'ml'|'total'|'prop', confidence, pick, game, americanOdds, result }
//
// `confidence` uses the same vocabulary as NBA bets:
//   'best-bet' | 'high' | 'medium' | 'lean' | 'coin-flip'
// `game` is kept at 1 (NOT 6/7) so the NBA elimination-game CAUTION cap in
// edge-detector never misfires on baseball bets.
//
// SCAFFOLD: illustrative picks tied to the MLB_SCHEDULE stub games. The real
// model will generate these from projectGame() once it exists.
// ============================================================

const MLB_BETS = [
  {
    id: 'mlb-001', gameId: 'NYY-BOS-2026-06-16',
    type: 'ml', confidence: 'lean',
    pick: 'NYY ML vs BOS', game: 1, americanOdds: -135, result: null,
  },
  {
    id: 'mlb-002', gameId: 'NYY-BOS-2026-06-16',
    type: 'prop', confidence: 'medium',
    pick: 'Gerrit Cole Over 6.5 K', game: 1, americanOdds: -115, result: null,
  },
  {
    id: 'mlb-003', gameId: 'LAD-SF-2026-06-16',
    type: 'total', confidence: 'lean',
    pick: 'Under 7.0 (LAD@SF)', game: 1, americanOdds: -115, result: null,
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MLB_BETS };
}
