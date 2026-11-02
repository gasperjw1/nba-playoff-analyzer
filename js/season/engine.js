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
//   margin = (netHome − netAway) × pace/100 + HCA + rest ± roster ± fit
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

// ── Player baselines ────────────────────────────────────────
// Prior seasons come from SEASON_PLAYER_PRIORS (fetch-priors.js);
// this season's sample from the feed (player.avg over seasonGames).

function _priors() {
  return typeof SEASON_PLAYER_PRIORS !== 'undefined' ? SEASON_PLAYER_PRIORS : null;
}

// Current-season BPM estimate from a per-game box line, using the
// regression fetch-priors.js fitted on last season (BPM ~ per-36 box).
function boxToBpm(avg) {
  const P = _priors();
  if (!P || !avg || !(avg.min > 0)) return null;
  const fit = P.meta.boxToBpm;
  let y = fit.intercept;
  fit.features.forEach((f, i) => { y += (avg[f.replace('/36', '')] || 0) * 36 / avg.min * fit.coef[i]; });
  return y;
}

// { avg: per-game baseline line, mpg, bpm, priorBpm, currentBpm,
//   priorMinutes, currentGames, source }
function playerProfile(player) {
  const C = SEASON_PLAYER_PRIOR, R = SEASON_IMPACT.replacementBpm;
  const P = _priors();
  const entry = P && P.players[player.id];
  const keys = NBAI_STAT_KEYS;              // ['min', 'pts', …] — same order as the prior rows

  // Prior: minutes-weighted across seasons, season weights applied.
  let pGames = 0, pMin = 0, bpmNum = 0, bpmMin = 0;
  const pTot = {};
  keys.forEach(k => { pTot[k] = 0; });
  if (entry) {
    Object.keys(C.seasonWeights).forEach(season => {
      const row = entry['s' + season];
      if (!row || !row[0] || !row[1]) return;
      const w = C.seasonWeights[season], g = row[0], mins = g * row[1] * w;
      pGames += g * w;
      pMin += mins;
      keys.forEach((k, i) => { pTot[k] += row[1 + i] * g * w; });
      const adv = entry['a' + season];
      const bpm = adv && adv[0] != null ? adv[0] : boxToBpm(_nbaiStatRow(row.slice(1)));
      if (bpm != null) { bpmNum += bpm * mins; bpmMin += mins; }
    });
  }
  const priorBpm = bpmMin ? (bpmNum + R * C.bpmRegressMinutes) / (bpmMin + C.bpmRegressMinutes) : null;
  const priorMpg = pGames ? pTot.min / pGames : null;

  // This season.
  const cur = player.avg;
  const cg = cur && cur.min > 0 ? (player.seasonGames || 0) : 0;
  const curMin = cg * (cur ? cur.min : 0);
  const currentBpm = cg ? boxToBpm(cur) : null;

  let mpg;
  if (priorMpg != null && cg) mpg = (priorMpg * C.minutesCurrentGames + cur.min * cg) / (C.minutesCurrentGames + cg);
  else if (cg) mpg = cur.min;
  else mpg = priorMpg || 0;

  const avg = { min: mpg };
  const K = Math.min(pMin, C.rateCurrentK);
  keys.forEach(k => {
    if (k === 'min') return;
    const priorRate = pMin ? pTot[k] / pMin : null;
    const curRate = cg ? cur[k] / cur.min : null;
    const rate = priorRate != null && curRate != null ? (priorRate * K + cur[k] * cg) / (K + curMin)
      : priorRate != null ? priorRate : curRate != null ? curRate : 0;
    avg[k] = rate * mpg;
  });

  let bpm = null;
  if (priorBpm != null && currentBpm != null) {
    const Kb = Math.min(bpmMin, C.bpmCurrentK);
    bpm = (priorBpm * Kb + currentBpm * curMin) / (Kb + curMin);
  } else if (currentBpm != null) {
    bpm = (R * C.rookieRegressMinutes + currentBpm * curMin) / (C.rookieRegressMinutes + curMin);
  } else bpm = priorBpm;

  return {
    avg, mpg, bpm, priorBpm, currentBpm,
    priorMinutes: Math.round(pMin), currentGames: cg,
    source: priorBpm != null && currentBpm != null ? 'prior+current' : priorBpm != null ? 'prior' : currentBpm != null ? 'current' : 'none',
  };
}

// Points of margin per game a player is worth above a replacement-level
// substitute, at his baseline minutes.
function playerImpactPts(player, pace, profile) {
  const prof = profile || playerProfile(player);
  if (prof.bpm == null || prof.mpg < SEASON_IMPACT.minMinutesForImpact) return 0;
  const p = pace || SEASON_LEAGUE_FALLBACK.pace;
  return Math.max(0, prof.bpm - SEASON_IMPACT.replacementBpm) * (prof.mpg / 48) * (p / 100) * SEASON_IMPACT.bpmToPoints;
}

// Share of the team's current rating a player is "in": last season's
// games for this team (prior part) and this season's games played
// (current part), weighted the way calcSeasonTeamStrength weights them.
function playerRatingShare(player, team, currentWeight, currentTeamGames) {
  const P = _priors();
  const entry = P && P.players[player.id];
  const tg = (entry && entry.tm && entry.tm[team.abbr]) || 0;
  const priorShare = Math.min(1, tg / SEASON_PLAYER_PRIOR.teamGames);
  const curShare = currentTeamGames ? Math.min(1, (player.seasonGames || 0) / currentTeamGames) : 0;
  return (1 - currentWeight) * priorShare + currentWeight * curShare;
}

let _priorsByTeamCache = null;
function _priorsByTeam(abbr) {
  const P = _priors();
  if (!P) return [];
  if (!_priorsByTeamCache) {
    _priorsByTeamCache = {};
    Object.entries(P.players).forEach(([id, e]) => {
      Object.keys(e.tm || {}).forEach(t => { (_priorsByTeamCache[t] = _priorsByTeamCache[t] || []).push(id); });
    });
  }
  return _priorsByTeamCache[abbr] || [];
}

// Tonight's roster versus the roster the rating was earned with.
// Positive adj = team stronger tonight than its rating says.
function calcRosterAdjustment(team, strength) {
  const w = strength ? strength.currentWeight : 0;
  const tg = strength ? strength.currentGames : 0;
  const pace = (team.prior && team.prior.pace) || SEASON_LEAGUE_FALLBACK.pace;
  const items = [], unmodeled = [];
  const onRoster = new Set();
  let adj = 0;
  (team.players || []).forEach(p => {
    onRoster.add(p.id);
    const prof = playerProfile(p);
    const value = playerImpactPts(p, pace, prof);
    const share = playerRatingShare(p, team, w, tg);
    if (!value) {
      if (p.availability < 1 && prof.source === 'none') unmodeled.push(p.name);
      return;
    }
    const delta = value * (p.availability - share);
    adj += delta;
    items.push({ id: p.id, name: p.name, status: p.status, availability: p.availability, value: +value.toFixed(2),
      share: +share.toFixed(2), delta: +delta.toFixed(2), kind: p.availability < 1 ? 'absent' : share < 0.5 ? 'new' : 'in-rating' });
  });
  const P = _priors();
  _priorsByTeam(team.abbr).forEach(id => {
    if (onRoster.has(id)) return;
    const e = P.players[id];
    const share = (1 - w) * Math.min(1, e.tm[team.abbr] / SEASON_PLAYER_PRIOR.teamGames);
    const value = playerImpactPts({ id, avg: null, seasonGames: 0 }, pace);
    if (!value || share < 0.01) return;
    const delta = -value * share;
    adj += delta;
    items.push({ id, name: e.n, status: 'departed', availability: 0, value: +value.toFixed(2), share: +share.toFixed(2), delta: +delta.toFixed(2), kind: 'departed' });
  });
  items.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  const capped = Math.max(-SEASON_IMPACT.teamCap, Math.min(SEASON_IMPACT.teamCap, adj));
  return {
    adj: +capped.toFixed(2), uncapped: +adj.toFixed(2),
    items,
    missing: items.filter(i => i.kind === 'absent' && i.delta < -0.05),   // out tonight, and the rating counted on them
    unmodeled,
  };
}

// ── Roster fit ──────────────────────────────────────────────
// Prior-season rebound rate, weighted like the BPM prior and regressed
// toward the league rookie rate — the same inputs research-chemistry.js
// fitted on.
function _priorReboundRate(id) {
  const F = SEASON_CHEMISTRY_FIT.rebounding;
  const P = _priors();
  const e = P && P.players[id];
  let m = 0, s = 0;
  if (e) Object.keys(SEASON_PLAYER_PRIOR.seasonWeights).forEach(season => {
    const a = e['a' + season];
    if (!a || !a[3] || a[6] == null) return;
    const w = SEASON_PLAYER_PRIOR.seasonWeights[season] * a[3];
    m += w; s += a[6] * w;
  });
  if (!m) return F.rookieTrb;
  const k = m / (m + F.regressMinutes);
  return (s / m) * k + F.rookieTrb * (1 - k);
}

// Positive adj = the roster fits better than its summed player values say.
// Minutes weights are tonight's baseline minutes × availability.
function calcRosterFit(team, strength) {
  const F = typeof SEASON_CHEMISTRY_FIT !== 'undefined' ? SEASON_CHEMISTRY_FIT : null;
  const none = { adj: 0, uncapped: 0, continuity: null, rebounding: null, parts: { continuity: 0, rebounding: 0 }, fade: 0, returning: [] };
  if (!F || !SEASON_IMPACT.fitCap) return none;
  const P = _priors();
  const rot = (team.players || []).map(p => ({ p, min: playerProfile(p).mpg * (p.availability == null ? 1 : p.availability) })).filter(x => x.min > 0);
  const total = rot.reduce((s, x) => s + x.min, 0);
  if (!total) return none;
  let continuity = 0, rebounding = 0;
  const returning = [];
  rot.forEach(x => {
    const share = x.min / total;
    const e = P && P.players[x.p.id];
    if (e && e.tm && e.tm[team.abbr] > 0) { continuity += share; returning.push(x.p.name); }
    rebounding += 5 * share * _priorReboundRate(x.p.id);   // on-floor sum: five players' TRB%
  });
  const w = strength ? strength.currentWeight : 0;
  const pace = (team.prior && team.prior.pace) || SEASON_LEAGUE_FALLBACK.pace;
  const scale = (1 - w) * pace / 100;
  const cPts = F.continuity.perUnit * (continuity - F.continuity.mean) * scale;
  const rPts = F.rebounding.perPoint * (rebounding - F.rebounding.mean) * scale;
  const raw = cPts + rPts;
  const adj = Math.max(-SEASON_IMPACT.fitCap, Math.min(SEASON_IMPACT.fitCap, raw));
  return {
    adj: +adj.toFixed(2), uncapped: +raw.toFixed(2),
    continuity: +continuity.toFixed(3), rebounding: +rebounding.toFixed(1),
    parts: { continuity: +cPts.toFixed(2), rebounding: +rPts.toFixed(2) },
    fade: +(1 - w).toFixed(3), returning,
  };
}

function _fitDetail(abbr, f) {
  if (f.continuity == null) return `${abbr} n/a`;
  const sgn = (x) => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(1);
  return `${abbr} ${Math.round(f.continuity * 100)}% returning ${sgn(f.parts.continuity)}, reb overlap ${f.rebounding} ${sgn(f.parts.rebounding)}`;
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

  const homeRoster = calcRosterAdjustment(home, hs), awayRoster = calcRosterAdjustment(away, as);
  if (homeRoster.adj) step('homeRoster', `${home.abbr} roster vs rating`, homeRoster.adj, _rosterDetail(homeRoster));
  if (awayRoster.adj) step('awayRoster', `${away.abbr} roster vs rating`, -awayRoster.adj, _rosterDetail(awayRoster));

  const homeFit = calcRosterFit(home, hs), awayFit = calcRosterFit(away, as);
  if (homeFit.adj || awayFit.adj) step('fit', 'Roster fit (continuity, rebounding overlap)', homeFit.adj - awayFit.adj,
    `${_fitDetail(home.abbr, homeFit)} · ${_fitDetail(away.abbr, awayFit)}${homeFit.fade < 1 ? ` · ×${homeFit.fade.toFixed(2)}/${awayFit.fade.toFixed(2)} as this season's results take over` : ''}`);

  const pHome = marginToWinProb(margin);

  // Totals: each offense against the other defense, additive around league
  // average; a roster swing moves mostly the team's own scoring.
  const L = league.ortg;
  const homeOff = L + (hs.ortg - L) + (as.drtg - L);
  const awayOff = L + (as.ortg - L) + (hs.drtg - L);
  const off = SEASON_IMPACT.offShare;
  const homeAdj = homeRoster.adj + homeFit.adj, awayAdj = awayRoster.adj + awayFit.adj;
  let homePts = homeOff * pace / 100 + off * homeAdj - (1 - off) * awayAdj;
  let awayPts = awayOff * pace / 100 + off * awayAdj - (1 - off) * homeAdj;
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
    roster: { home: homeRoster, away: awayRoster },
    fit: { home: homeFit, away: awayFit },
    availability: { home: homeRoster, away: awayRoster },   // UI/legacy alias
    rest: { home: homeRest, away: awayRest },
    lineage,
  };
}

function _rosterDetail(r) {
  const label = { absent: 'out/Q', new: 'new or returning', departed: 'departed', 'in-rating': 'healthy' };
  const shown = r.items.filter(i => Math.abs(i.delta) >= 0.3).slice(0, 6)
    .map(i => `${i.name} ${label[i.kind]}${i.kind === 'absent' ? ` ${Math.round(i.availability * 100)}%` : ''} ${i.delta > 0 ? '+' : '−'}${Math.abs(i.delta).toFixed(1)}`);
  const capNote = r.adj !== r.uncapped ? ` (capped from ${r.uncapped > 0 ? '+' : ''}${r.uncapped})` : '';
  return (shown.join(', ') || 'small changes only') + capNote;
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
