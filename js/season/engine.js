// ============================================================
// REGULAR-SEASON GAME ENGINE
// ============================================================
// Deliberately small. The playoff engine's series-context steps
// (scheme persistence, G1 momentum, elimination, coaching
// compression) do not exist in a regular-season game, and its
// hand-tuned narrative bonuses were the source of its 13-pt margin
// error. What survives is the part that is defensible on 1,000+
// game samples:
//
//   margin = (netHome − netAway) × pace/100 + HCA + rest − absences
//   P(home) = Φ(margin / σ)
//
// Every step is logged to `lineage` so the UI can show the
// waterfall, same convention as calcGameProjection.
// ============================================================

function normalCdf(z) {
  // Φ(z) = ½(1 + erf(z/√2)); erf via Abramowitz-Stegun 7.1.26, |err| < 1.5e-7
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-x * x);
  return 0.5 * (1 + (z < 0 ? -erf : erf));
}

function marginToWinProb(margin, sigma) {
  return normalCdf(margin / (sigma || SEASON_MARGIN_SIGMA));
}

function winProbToMargin(p, sigma) {
  // inverse normal via bisection — plenty for UI use
  const s = sigma || SEASON_MARGIN_SIGMA;
  const target = Math.max(0.001, Math.min(0.999, p));
  let lo = -60, hi = 60;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (normalCdf(mid / s) < target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// Hollinger Game Score from a per-game average line (no ORB/DRB
// split or fouls in the feed; rebounds weighted at the midpoint).
function gameScore(avg) {
  return avg.pts + 0.4 * avg.fgm - 0.7 * avg.fga - 0.4 * (avg.fta - avg.ftm)
    + 0.5 * avg.reb + avg.stl + 0.7 * avg.ast + 0.7 * avg.blk - avg.to;
}

// Points of margin a player is worth above a replacement-level
// substitute, conditional on his normal minutes.
function playerImpactPts(player) {
  const avg = player.avg;
  if (!avg || avg.min < SEASON_IMPACT.minMinutesForImpact) return 0;
  const gmsc36 = gameScore(avg) * 36 / avg.min;
  const above = Math.max(0, gmsc36 - SEASON_IMPACT.replacementGmSc36);
  return above * (avg.min / 48) * SEASON_IMPACT.scale;
}

// Expected margin lost to players who are out / questionable.
function calcAvailabilityImpact(team) {
  const missing = [];
  const unmodeled = [];   // out, but no current-season sample to value them with
  let total = 0;
  (team.players || []).forEach(p => {
    if (p.availability >= 1) return;
    const impact = playerImpactPts(p);
    if (impact <= 0) { if (!p.avg || p.avg.min < SEASON_IMPACT.minMinutesForImpact) unmodeled.push(p.name); return; }
    const loss = (1 - p.availability) * impact;
    total += loss;
    missing.push({ name: p.name, availability: p.availability, status: p.status, impact: +impact.toFixed(2), loss: +loss.toFixed(2) });
  });
  missing.sort((a, b) => b.loss - a.loss);
  const capped = Math.min(SEASON_IMPACT.teamCap, total);
  return { loss: +capped.toFixed(2), uncapped: +total.toFixed(2), missing, unmodeled };
}

function calcRestAdjustment(rest) {
  if (!rest) return 0;
  let pts = 0;
  if (rest.backToBack) pts += SEASON_REST.backToBack;
  else if (rest.threeInFour) pts += SEASON_REST.threeInFour;
  if (rest.restDays >= SEASON_REST.longRestDays) pts += SEASON_REST.longRestBonus;
  // rest.schedulePoints is NB.AI's own schedule heuristic for the same
  // flags; adding it would double-count and correlate the two models.
  return pts;
}

// Blend last season's rating with this season's, both per 100 possessions.
function calcSeasonTeamStrength(team, league) {
  const L = league.ortg;
  const prior = team.prior;
  const priorNet = prior.ortg - prior.drtg;
  const priorOff = L + (prior.ortg - L) * SEASON_PRIOR_RETENTION;
  const priorDef = L + (prior.drtg - L) * SEASON_PRIOR_RETENTION;

  const cur = team.current || {};
  const g = cur.games || 0;
  const w = g > 0 && cur.ppg != null && cur.papg != null ? g / (g + SEASON_SHRINK_K) : 0;
  const pace = prior.pace || league.pace;
  const curOff = w ? (cur.ppg / pace) * 100 : priorOff;
  const curDef = w ? (cur.papg / pace) * 100 : priorDef;

  const ortg = w * curOff + (1 - w) * priorOff;
  const drtg = w * curDef + (1 - w) * priorDef;
  return {
    ortg: +ortg.toFixed(2), drtg: +drtg.toFixed(2), net: +(ortg - drtg).toFixed(2),
    pace,
    currentWeight: +w.toFixed(3), currentGames: g,
    priorNet: +priorNet.toFixed(2), priorNetShrunk: +(priorOff - priorDef).toFixed(2),
    currentNet: w ? +(curOff - curDef).toFixed(2) : null,
  };
}

// game: SeasonGame; slate: SeasonSlate; opts: { restOverride:{home,away},
// availabilityOverride:{ playerId: 0..1 } } for the matchup lab.
function projectSeasonGame(game, slate, opts) {
  opts = opts || {};
  const league = slate.league;
  const home = _applyOverrides(slate.teams[game.home], opts, 'home');
  const away = _applyOverrides(slate.teams[game.away], opts, 'away');
  if (!home || !away) throw new Error('projectSeasonGame: unknown team ' + game.home + '/' + game.away);

  const hs = calcSeasonTeamStrength(home, league);
  const as = calcSeasonTeamStrength(away, league);
  const pace = (hs.pace + as.pace) / 2;

  const lineage = [];
  let margin = 0;
  const step = (id, label, delta, detail) => {
    margin += delta;
    lineage.push({ step: id, label, delta: +delta.toFixed(2), running: +margin.toFixed(2), detail: detail || null });
  };

  step('strength', 'Net rating gap × pace', (hs.net - as.net) * pace / 100,
    `${home.abbr} ${hs.net > 0 ? '+' : ''}${hs.net} vs ${away.abbr} ${as.net > 0 ? '+' : ''}${as.net} per 100 · pace ${pace.toFixed(1)}`);
  step('hca', 'Home court', SEASON_HCA, `${home.abbr} at home`);

  const homeRest = calcRestAdjustment(home.rest), awayRest = calcRestAdjustment(away.rest);
  if (homeRest || awayRest) step('rest', 'Rest / schedule', homeRest - awayRest,
    `${home.abbr} ${_restLabel(home.rest)} · ${away.abbr} ${_restLabel(away.rest)}`);

  const homeAvail = calcAvailabilityImpact(home), awayAvail = calcAvailabilityImpact(away);
  if (homeAvail.loss) step('homeAbsences', `${home.abbr} absences`, -homeAvail.loss, homeAvail.missing.map(m => `${m.name} (${Math.round(m.availability * 100)}%) −${m.loss}`).join(', '));
  if (awayAvail.loss) step('awayAbsences', `${away.abbr} absences`, +awayAvail.loss, awayAvail.missing.map(m => `${m.name} (${Math.round(m.availability * 100)}%) −${m.loss}`).join(', '));

  const pHome = marginToWinProb(margin);

  // Totals: each offense against the other defense, additive around league average.
  const L = league.ortg;
  const homeOff = L + (hs.ortg - L) + (as.drtg - L);
  const awayOff = L + (as.ortg - L) + (hs.drtg - L);
  let homePts = homeOff * pace / 100 - SEASON_IMPACT.offShare * homeAvail.loss + (1 - SEASON_IMPACT.offShare) * awayAvail.loss;
  let awayPts = awayOff * pace / 100 - SEASON_IMPACT.offShare * awayAvail.loss + (1 - SEASON_IMPACT.offShare) * homeAvail.loss;
  const total = homePts + awayPts;
  // Rebalance so the score reproduces the margin the lineage built.
  homePts = (total + margin) / 2;
  awayPts = (total - margin) / 2;

  return {
    gameId: game.id,
    home: home.abbr, away: away.abbr,
    margin: +margin.toFixed(2),
    pHome: +pHome.toFixed(4),
    total: +total.toFixed(1),
    homeScore: Math.round(homePts), awayScore: Math.round(awayPts),
    pace: +pace.toFixed(1),
    homeStrength: hs, awayStrength: as,
    availability: { home: homeAvail, away: awayAvail },
    rest: { home: homeRest, away: awayRest },
    lineage,
  };
}

function _restLabel(rest) {
  if (!rest) return 'rest n/a';
  if (rest.backToBack) return 'back-to-back';
  if (rest.threeInFour) return '3-in-4';
  return `${rest.restDays}d rest`;
}

function _applyOverrides(team, opts, side) {
  if (!team) return team;
  const restOv = opts.restOverride && opts.restOverride[side];
  const availOv = opts.availabilityOverride || null;
  if (!restOv && !availOv) return team;
  return {
    ...team,
    rest: restOv ? { ...team.rest, ...restOv } : team.rest,
    players: availOv ? team.players.map(p => (p.id in availOv) ? { ...p, availability: availOv[p.id] } : p) : team.players,
  };
}

// Build a SeasonGame on the fly for the matchup lab.
function makeCustomGame(homeAbbr, awayAbbr) {
  return { id: `custom-${awayAbbr}-at-${homeAbbr}`, tip: null, venue: null, home: homeAbbr, away: awayAbbr, market: null, external: null };
}
