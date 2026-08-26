// ============================================================
// PLAYOFF RUN — INJURY HAZARD SAMPLER (Phase 2)
// ============================================================
// Per-game injury generation: hazard = base × player proneness ×
// fatigue × minutes. The EFFECT side already exists (capacity treats
// unavailable/dragged players correctly); this is the generator.
//
// Deliberately simple, per the literature warnings recorded in
// GAME_PLAN.md:
//   - The acute:chronic workload ratio (ACWR) is NOT used: it suffers
//     mathematical coupling and inconsistent predictive results across
//     meta-analyses.
//   - Do not "learn" rates from who plays heavy minutes: naive fits show
//     heavy-minutes players getting hurt LESS — the healthy-worker
//     survivor effect (collider bias), not protection.
//   - Load management is a genuine gamble, not guaranteed prophylaxis
//     (rest games showed no measured same-season injury reduction), so
//     resting stars trades certain lineup cost for uncertain protection.
//
// Base rate tuned so a full 4-round run produces ~1-3 meaningful
// injuries per team (validated in test-game.js against real playoff
// attrition levels).
// ============================================================

const GAME_INJURY_CONFIG = {
  basePerGame: 0.009,        // per player-game at 34 min, no risk factors
  fatigueMult: 2.0,          // hazard multiplier at fatigue 1.0
  severities: [
    // cumulative-probability table
    { p: 0.70, type: 'minor',    gamesOut: 0, drag: 0.35, dragGames: 2 },
    { p: 0.95, type: 'moderate', gamesOut: 3, drag: 0.25, dragGames: 2 },
    { p: 1.00, type: 'major',    gamesOut: 99, drag: 0, dragGames: 0 },
  ],
};

/**
 * Sample injuries for one team-game.
 * @param {Array} rotationRows  [{player, minutes}] who actually played
 * @param {Object} fatigue      { name: 0..1 }
 * @param {Function} rng
 * @param {Object} drags        { name: drag } — players who played HURT:
 *                              they roll AGGRAVATION instead of the base
 *                              hazard (playing through it is a gamble;
 *                              resting still runs the recovery clock)
 * @returns {Array} [{name, type, gamesOut, drag, dragGames}]
 */
function sampleGameInjuries(rotationRows, fatigue, rng, drags) {
  const cfg = GAME_INJURY_CONFIG;
  const events = [];
  rotationRows.forEach(r => {
    if (r.minutes <= 0) return;
    const p = r.player;
    if (drags && drags[p.name] != null) {
      const aggr = (typeof GAME_CONFIG !== 'undefined' ? GAME_CONFIG.aggravationBase : 0.05)
        * (r.minutes / 30);
      if (rng() < aggr) {
        events.push({ name: p.name, type: 'aggravated', gamesOut: 2 + Math.floor(rng() * 3), drag: 0.3, dragGames: 2 });
      }
      return;
    }
    const hazard = cfg.basePerGame
      * (1 + (p.injuryRisk || 0))
      * (1 + (cfg.fatigueMult - 1) * (fatigue[p.name] || 0))
      * Math.pow(r.minutes / 34, 2);   // superlinear in minutes load
    if (rng() >= hazard) return;
    const roll = rng();
    const sev = cfg.severities.find(s => roll <= s.p);
    events.push({ name: p.name, type: sev.type, gamesOut: sev.gamesOut, drag: sev.drag, dragGames: sev.dragGames });
  });
  return events;
}

/**
 * PEEK the upcoming game's availability from a team's injury book —
 * PURE (no mutation), so the UI can render the gameplan screen (scratches,
 * compromised players) before the game is actually played.
 * book: { name: {gamesOut, drag, dragGames} }
 */
function peekInjuryBook(book) {
  const unavailable = [], drags = {};
  Object.entries(book).forEach(([name, st]) => {
    if (st.gamesOut > 0) unavailable.push(name);
    else if (st.dragGames > 0) drags[name] = st.drag;  // plays, but compromised
  });
  return { unavailable, drags };
}

/** Commit one game's passage of time to the book (call AFTER the game). */
function advanceInjuryBook(book) {
  Object.entries(book).forEach(([name, st]) => {
    if (st.gamesOut > 0) st.gamesOut--;
    else if (st.dragGames > 0) st.dragGames--;
    else delete book[name];
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_INJURY_CONFIG, sampleGameInjuries, peekInjuryBook, advanceInjuryBook };
}
