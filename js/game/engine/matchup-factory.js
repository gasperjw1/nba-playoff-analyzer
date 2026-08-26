// ============================================================
// PLAYOFF RUN — MATCHUP FACTORY (Phase 0)
// ============================================================
// makeGameSeries(db, homeAbbr, awayAbbr, round): builds a matchup context
// for ANY of the 120 possible team pairings — the piece that lets runs
// diverge from history. Everything the hand-authored series objects carried
// by hand (defensive matchups, venue meta) is DERIVED here from team data.
//
// Derivation is validated against the 8 hand-authored R1 defMatchups in
// test-game.js (the Phase 0 calibration gate).
// ============================================================

/**
 * Derive the marquee defensive assignment: the best available perimeter
 * defender takes the opponent's primary initiator.
 * Mirrors how the hand-authored defMatchups were chosen (defender by
 * dLEBRON among perimeter roles, target by usage among the opponent's
 * top scorers).
 */
function gameDeriveAssignment(defTeam, offTeam, offRotation, defRotation) {
  const rotationNames = new Set((offRotation || []).filter(r => r.minutes > 0).map(r => r.player.name));
  const candidates = offTeam.players.filter(p =>
    (rotationNames.size ? rotationNames.has(p.name) : p.initialStatus !== 'dnp') && p.baseRating > 0);
  if (!candidates.length) return null;
  // Target: highest usage-weighted scorer on the floor.
  const target = candidates.reduce((a, b) => (a.usg * a.ppg >= b.usg * b.ppg ? a : b));
  const isPerimeterD = p => (GAME_DEF_ROLE_FAMILY[p.defRole] || '') !== 'interior';
  const defNames = new Set((defRotation || []).filter(r => r.minutes > 0).map(r => r.player.name));
  const defenders = defTeam.players.filter(p =>
    (defNames.size ? defNames.has(p.name) : p.initialStatus !== 'dnp') && p.baseRating > 0 && isPerimeterD(p));
  if (!defenders.length) return null;
  const defender = defenders.reduce((a, b) => (a.dLebron >= b.dLebron ? a : b));
  return { defender: defender.name, target: target.name, dLebron: defender.dLebron, targetUsg: target.usg };
}

/**
 * Build a series context for any pairing.
 * @param {Object} db        GAME_TEAM_DB
 * @param {string} homeAbbr  higher seed (holds 2-2-1-1-1 home court)
 * @param {string} awayAbbr
 * @param {string} round     'R1' | 'R2' | 'CF' | 'Finals'
 */
function makeGameSeries(db, homeAbbr, awayAbbr, round) {
  const home = db[homeAbbr], away = db[awayAbbr];
  if (!home || !away) throw new Error('makeGameSeries: unknown team ' + (home ? awayAbbr : homeAbbr));
  if (homeAbbr === awayAbbr) throw new Error('makeGameSeries: team cannot play itself');
  const hcaTable = (typeof HCA_BY_ROUND !== 'undefined') ? HCA_BY_ROUND : { R1: 3, R2: 1.5, CF: 1.5, Finals: 1 };
  return {
    id: homeAbbr + '-' + awayAbbr,
    round: round || 'R1',
    home, away,
    hcaBase: hcaTable[round || 'R1'] || 2.5,
    hcaGame7: (typeof HCA_GAME7_OVERRIDE !== 'undefined') ? HCA_GAME7_OVERRIDE : 2.5,
    // Marquee assignments both ways (used by capacity's suppression math
    // and shown in the UI). Derived from default rotations; per-game user
    // assignments override these in the plan object.
    defAssignments: {
      homeOnAway: gameDeriveAssignment(home, away, gameDefaultRotation(
        away.players.filter(p => p.initialStatus !== 'dnp' && p.baseRating > 0),
        away.coach && away.coach.rotationDepth)),
      awayOnHome: gameDeriveAssignment(away, home, gameDefaultRotation(
        home.players.filter(p => p.initialStatus !== 'dnp' && p.baseRating > 0),
        home.coach && home.coach.rotationDepth)),
    },
  };
}

/**
 * Venue for game N of a 2-2-1-1-1 series: true = at series home team.
 */
function gameVenueIsHome(gameNum) {
  return !(gameNum === 3 || gameNum === 4 || gameNum === 6);
}

/** HCA (points, from the perspective of the team hosting game N). */
function gameHcaForGame(seriesCtx, gameNum, seriesScore) {
  let base = seriesCtx.hcaBase;
  if (seriesScore && seriesScore.home === 3 && seriesScore.away === 3) base = seriesCtx.hcaGame7;
  const hostTeam = gameVenueIsHome(gameNum) ? seriesCtx.home : seriesCtx.away;
  if (hostTeam.fortress) base += GAME_CONFIG.fortressBonus;
  return base;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { makeGameSeries, gameDeriveAssignment, gameVenueIsHome, gameHcaForGame };
}
