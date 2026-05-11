// ============================================================
// CHS SHADOW PROJECTIONS (May 9, 2026)
// ============================================================
// Parallel projection path that always applies the Compound
// Historical Scenarios engine (Phase 52). Production pages run on
// `calcGameProjection` + `calcBlendedProjection` with CHS gated OFF
// via the USE_CHS_IN_PROJECTIONS flag in constants.js. The CHS Lab
// tab uses the wrappers below to surface what CHS would predict so
// we can score it against actuals over a 10-game window before
// promoting it back into production.
//
// Architecture: CHS only modifies player-level projections (modifier
// #14 in calcExpectedPlayerStats). Team totals = sum of player
// projections, so the team-level CHS delta is the sum of per-player
// deltas. Margin divergence = home CHS team delta − away CHS team
// delta, applied on top of the main engine's margin.
// ============================================================

// Returns the team-level CHS delta (sum of per-player point deltas
// from matched scenarios). Cascade effects already baked in by
// scenarios.js.
function _calcTeamCHSDelta(team, series, gameIdx, side) {
  if (!team || !Array.isArray(team.players)) return 0;
  if (typeof calcCompoundScenarioDelta !== 'function') return 0;
  let total = 0;
  team.players.forEach(p => {
    if (!p || (p.rating || 0) <= 0) return;
    try {
      const result = calcCompoundScenarioDelta(p, series, gameIdx, side);
      // calcCompoundScenarioDelta returns { ptsDelta, rebDelta, astDelta, ... }.
      // Earlier draft mistakenly read result.pts which is undefined — bug found
      // May 11 promotion-pass audit when Wemby paint suppression scenarios
      // appeared to compute but team aggregate stayed at 0.
      if (result && typeof result.ptsDelta === 'number') total += result.ptsDelta;
    } catch (e) { /* ignore — graceful degradation */ }
  });
  return total;
}

// Wraps calcBlendedProjection and applies the CHS delta to score and
// margin. Returns the same shape as the main projection plus
// `chsHomeDelta`, `chsAwayDelta`, `chsMarginDelta` for diff display.
function calcBlendedProjectionWithCHS(series, seriesId, gameNum) {
  if (typeof calcBlendedProjection !== 'function') return null;
  const main = calcBlendedProjection(series, seriesId, gameNum);
  if (!main) return null;
  const gameIdx = gameNum - 1;

  const homeDelta = _calcTeamCHSDelta(series.homeTeam, series, gameIdx, 'home');
  const awayDelta = _calcTeamCHSDelta(series.awayTeam, series, gameIdx, 'away');
  const marginDelta = homeDelta - awayDelta;

  // Parse "ABC 112-105 / DEF" style score string from main if available.
  // Fall back to recomputing from the engine's home/away scores.
  const homeAbbr = series.homeTeam && series.homeTeam.abbr;
  const awayAbbr = series.awayTeam && series.awayTeam.abbr;
  const mainHome = main.homeScore || (main.blendedScoreHome || 0);
  const mainAway = main.awayScore || (main.blendedScoreAway || 0);
  const chsHome = Math.round(mainHome + homeDelta);
  const chsAway = Math.round(mainAway + awayDelta);
  const chsMargin = chsHome - chsAway;
  const chsWinner = chsMargin >= 0 ? homeAbbr : awayAbbr;
  const chsAbsMargin = Math.abs(chsMargin);

  return {
    // Pass-through main fields (UI may want both side-by-side)
    main,
    // CHS view
    chsWinner,
    chsHomeScore: chsHome,
    chsAwayScore: chsAway,
    chsMargin: chsAbsMargin,
    chsMarginSigned: chsMargin,
    chsBlendedScore: `${homeAbbr} ${chsHome} - ${chsAway} ${awayAbbr}`,
    // Deltas — for showing "CHS sees +3.2 for OKC, -1.5 for LAL"
    chsHomeDelta: +homeDelta.toFixed(1),
    chsAwayDelta: +awayDelta.toFixed(1),
    chsMarginDelta: +marginDelta.toFixed(1),
    // Convenience: did CHS flip the winner vs main?
    chsFlipsWinner: main.blendedWinner !== chsWinner,
  };
}

// Browser global only — node tests load via vm context which doesn't
// run module.exports. The function is auto-attached to the eval scope.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calcBlendedProjectionWithCHS, _calcTeamCHSDelta };
}
