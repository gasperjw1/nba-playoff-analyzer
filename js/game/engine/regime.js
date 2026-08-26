// ============================================================
// PLAYOFF RUN — REGIME LAYER (Phase 1, Layer 2 of 3)
// ============================================================
// Samples the game's CHARACTER before the trajectory runs: competitive,
// or a runaway toward one side. This is the mechanism behind two good
// teams going 130-90 one night and 90-130 the next (2026 WCF pattern) —
// measured reality: 37% of playoff games decided by 15+, 23% by 20+,
// 12% by 30+, with blowouts disproportionately HOME events (avg home win
// margin 16.9 vs 9.4 road; hence homeShare > 0.5).
//
// Serial independence (measured r≈0.01 across 139 consecutive-game pairs):
// the regime is drawn fresh every game with NO memory of the last one.
// Alternating blowouts emerge from independence + wide variance, not from
// a momentum mechanic. Do not add one.
// ============================================================

/**
 * @param {Function} rng        uniform [0,1) generator
 * @param {number}  expMargin   expected margin, home-positive (incl. HCA)
 * @param {Object}  opts        { elimination: bool }
 * @returns {type: 'competitive'|'runaway_home'|'runaway_away', drift}
 *          drift = margin points added to expectation (home-positive)
 */
function sampleGameRegime(rng, expMargin, opts) {
  const cfg = GAME_CONFIG.regime;
  let pRun = cfg.pRunaway;
  // Elimination games compress toward competitive (fight-or-fold);
  // the measured ~22% save rate emerges rather than being scripted.
  if (opts && opts.elimination) pRun *= cfg.eliminationDamp;
  if (rng() >= pRun) return { type: 'competitive', drift: 0 };

  // Runaway direction: home side + favorite both tilt the coin.
  const pHome = Math.max(0.15, Math.min(0.90, cfg.homeShare + cfg.favBias * expMargin));
  const homeSide = rng() < pHome;
  const mag = Math.max(4, cfg.driftMean + gameNormal(rng, 0, cfg.driftSD));
  return {
    type: homeSide ? 'runaway_home' : 'runaway_away',
    drift: homeSide ? mag : -mag,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sampleGameRegime };
}
