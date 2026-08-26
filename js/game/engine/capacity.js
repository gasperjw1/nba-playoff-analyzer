// ============================================================
// PLAYOFF RUN — CAPACITY LAYER (Phase 1, Layer 1 of 3)
// ============================================================
// Deterministic, bottom-up team capacity: active roster + minutes →
// team ORtg/DRtg/pace + per-player stat shares. This is where "LAL
// without three stars can't crack 100" comes from — possession accounting
// plus the usage-efficiency tradeoff (Goldman & Rao 2011; Skinner 2015),
// not a special case.
//
// Design law #1 (GAME_PLAN.md): rating is an OUTPUT. Effective team
// strength here = minutes-weighted player impacts × role fit × fatigue,
// self-calibrated so each team's full-strength default rotation
// reproduces its real advStats exactly (offsets solved in team-db.js).
// ============================================================

/**
 * Compute a team's capacity for one game.
 *
 * @param {Object} team  GAME_TEAM_DB entry
 * @param {Object} opts
 *   unavailable     : string[] player names out for this game
 *   rotation        : [{player, minutes}] explicit minutes plan (else default)
 *   roleAssignments : { name: {offRole, defRole} } overrides (else native)
 *   fatigue         : { name: 0..1 } accumulated fatigue (Phase 2 feeds this)
 *   suppression     : ORtg penalty from the opponent's marquee defensive
 *                     assignment (computed by game-sim from defAssignments)
 *   synergyMod      : lineup-chemistry ORtg adjustment (Phase 3 wires SPM)
 * @returns {ortg, drtg, pace, playerShares:[{player, minutes, ptsShare, rebShare, astShare}]}
 */
function computeTeamCapacity(team, opts) {
  opts = opts || {};
  const out = new Set(opts.unavailable || []);
  const fatigue = opts.fatigue || {};
  const roles = opts.roleAssignments || {};

  const pool = team.players.filter(p =>
    p.baseRating > 0 && p.initialStatus === 'available' && !out.has(p.name));

  // Minutes plan: explicit or default; always renormalized to 240 so an
  // injury mid-plan doesn't silently leave a team playing 4-on-5.
  let rotation = opts.rotation
    ? opts.rotation.filter(r => !out.has(r.player.name))
    : gameDefaultRotation(pool, team.coach && team.coach.rotationDepth);
  const minSum = rotation.reduce((a, r) => a + r.minutes, 0) || 1;
  rotation = rotation.map(r => ({ player: r.player, minutes: r.minutes * 240 / minSum }));
  // Hard minutes cap (solver-audit physics): clip at maxPlayerMinutes and
  // redistribute the excess to uncapped teammates. Two passes suffice.
  for (let pass = 0; pass < 2; pass++) {
    const cap = GAME_CONFIG.maxPlayerMinutes;
    let excess = 0;
    rotation.forEach(r => { if (r.minutes > cap) { excess += r.minutes - cap; r.minutes = cap; } });
    if (excess <= 0.01) break;
    const room = rotation.filter(r => r.minutes > 0 && r.minutes < cap);
    if (!room.length) break;
    room.forEach(r => { r.minutes += excess / room.length; });
  }

  // ── Usage redistribution (Goldman-Rao) ──────────────────────
  // Deficit vs the team's full-strength usage baseline is absorbed by the
  // players on the floor, pro-rata by natural usage, at an efficiency cost.
  let usgNow = 0, usgWeight = 0;
  rotation.forEach(r => { usgNow += r.player.usg * r.minutes / 240; usgWeight += r.player.usg * r.minutes; });
  const deficit = Math.max(0, (team.usgBaseline || usgNow) - usgNow);
  const extraUsg = {};   // pp of usage each player absorbs above natural
  if (deficit > 0 && usgWeight > 0) {
    rotation.forEach(r => {
      const share = (r.player.usg * r.minutes) / usgWeight;
      // deficit is in minutes-weighted mean-usage points; ×240/minutes
      // converts this player's absorbed share back to personal usage pp.
      extraUsg[r.player.name] = Math.min(GAME_CONFIG.usageAbsorbCap,
        deficit * share * 240 / Math.max(1, r.minutes));
    });
  }
  let usagePenalty = 0;
  rotation.forEach(r => {
    usagePenalty += GAME_CONFIG.usageSlope * (extraUsg[r.player.name] || 0) * (r.minutes / 240);
  });

  // ── Impact sums + fit + fatigue ─────────────────────────────
  let impO = 0, impD = 0, fitO = 0, fitD = 0;
  rotation.forEach(r => {
    const p = r.player, w = (r.minutes / 240) * 5;
    const fat = (1 - 0.5 * (fatigue[p.name] || 0))  // fatigue halves impact at 1.0
      * gameOverloadMult(r.minutes);                 // within-game minutes overload
    impO += gameOLebron(p) * w * fat;
    impD += gameDLebron(p) * w * fat;
    const a = roles[p.name] || {};
    fitO += gameRoleFitCost(p.offRole, a.offRole, GAME_OFF_ROLE_FAMILY) * w;
    fitD += gameRoleFitCost(p.defRole, a.defRole, GAME_DEF_ROLE_FAMILY) * w;
  });

  const ortg = GAME_LEAGUE.ortg + team.offsetO + impO
    - usagePenalty
    - fitO * GAME_CONFIG.fitScaleOff / 5
    - (opts.suppression || 0)
    + (opts.synergyMod || 0);
  const drtg = GAME_LEAGUE.drtg + team.offsetD - impD
    + fitD * GAME_CONFIG.fitScaleDef / 5;

  // ── Player stat shares (relative; trajectory scales to team totals) ──
  // Anchored to season per-game rates, scaled by tonight's minutes vs the
  // player's season-role minutes, boosted by absorbed usage (with the
  // recapture haircut — the rest of a missing star's production is the
  // team-level decline already priced above).
  const shares = rotation.filter(r => r.minutes > 0).map(r => {
    const p = r.player;
    const fullMin = team.fullMinutes[p.name] || 10;
    const minRatio = Math.min(1.6, r.minutes / fullMin);
    const minScale = minRatio <= 1 ? minRatio : 1 + (minRatio - 1) * 0.8;  // diminishing
    const usgBoost = 1 + ((extraUsg[p.name] || 0) / Math.max(8, p.usg)) * GAME_CONFIG.usageRecapture;
    return {
      player: p, minutes: r.minutes,
      pts: Math.max(0.3, p.ppg * minScale * usgBoost),
      reb: Math.max(0.2, p.rpg * minScale),
      ast: Math.max(0.1, p.apg * minScale),
    };
  });
  const tot = { pts: 0, reb: 0, ast: 0 };
  shares.forEach(s => { tot.pts += s.pts; tot.reb += s.reb; tot.ast += s.ast; });
  const playerShares = shares.map(s => ({
    player: s.player, minutes: s.minutes,
    ptsShare: s.pts / tot.pts, rebShare: s.reb / tot.reb, astShare: s.ast / tot.ast,
  }));

  return { ortg, drtg, pace: (team.advStats.pace || GAME_LEAGUE.pace), playerShares };
}

/**
 * Expected (pre-noise) scores for game N of a series — the distribution's
 * CENTER. Design law #2: the game never displays this; it samples around it.
 */
function expectedGameScores(seriesCtx, capHome, capAway, gameNum, seriesScore) {
  const poss = ((capHome.pace + capAway.pace) / 2) * GAME_CONFIG.playoffPaceFactor;
  const effH = capHome.ortg + (capAway.drtg - GAME_LEAGUE.drtg);
  const effA = capAway.ortg + (capHome.drtg - GAME_LEAGUE.drtg);
  let home = poss * effH / 100 * GAME_CONFIG.playoffOffFactor;
  let away = poss * effA / 100 * GAME_CONFIG.playoffOffFactor;
  // Playoff matchup compression (see GAME_CONFIG.matchupCompression):
  // shrink the talent gap, keep the total. HCA is NOT compressed — it is
  // calibrated at game level.
  const mid = (home + away) / 2;
  const gap = (home - away) * GAME_CONFIG.matchupCompression;
  home = mid + gap / 2;
  away = mid - gap / 2;
  const hca = gameHcaForGame(seriesCtx, gameNum, seriesScore);
  const sign = gameVenueIsHome(gameNum) ? 1 : -1;
  home += sign * hca / 2;
  away -= sign * hca / 2;
  return { home, away, margin: home - away };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { computeTeamCapacity, expectedGameScores };
}
