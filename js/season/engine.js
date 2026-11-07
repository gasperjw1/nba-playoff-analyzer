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
//   margin = (netHome − netAway) × pace/100 + HCA + rest ± roster ± aging ± fit
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

  // Age: expected change from the prior BPM (last season's level) to this
  // season's age (aging-fit.js). Used only to age last season's part of
  // the team rating, which holds the player at his prior level however many
  // games he has played since; calcRosterAdjustment fades it by (1 − w) as
  // this season's results take over. `bpm` itself stays unaged: valuing
  // arrivals at aged BPM made the historical replay worse.
  const age = entry && entry.age != null ? entry.age : null;
  const ageShift = age != null && priorBpm != null ? seasonAgeCurve(age) : 0;

  return {
    avg, mpg, bpm, priorBpm, currentBpm, age, ageShift,
    priorMinutes: Math.round(pMin), currentGames: cg,
    source: priorBpm != null && currentBpm != null ? 'prior+current' : priorBpm != null ? 'prior' : currentBpm != null ? 'current' : 'none',
  };
}

// Expected BPM change from a player's prior to this season, by his age
// this season (Basketball-Reference convention: age on Feb 1).
function seasonAgeCurve(age) {
  if (typeof SEASON_AGING_FIT === 'undefined' || age == null) return 0;
  const a = Math.max(20, Math.min(36, Math.round(age)));
  return SEASON_AGING_FIT.byAge[a] || 0;
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
function playerPriorShare(player, team) {
  const P = _priors();
  const entry = P && P.players[player.id];
  const tg = (entry && entry.tm && entry.tm[team.abbr]) || 0;
  return Math.min(1, tg / SEASON_PLAYER_PRIOR.teamGames);
}
function playerRatingShare(player, team, currentWeight, currentTeamGames) {
  const priorShare = playerPriorShare(player, team);
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

// Minutes a player gave this team's rating: last season's games here ×
// last season's minutes per game, per team game (prior part), and his
// minutes per team game this season (current part).
function playerRatingMinutes(player, team, currentWeight, currentTeamGames) {
  const P = _priors();
  const entry = P && P.players[player.id];
  const last = 's' + Math.max(...Object.keys(SEASON_PLAYER_PRIOR.seasonWeights).map(Number));
  const row = entry && entry[last];
  const prior = row && row[1] ? playerPriorShare(player, team) * row[1] : 0;
  const cur = currentTeamGames && player.avg && player.avg.min > 0
    ? Math.min(48, player.avg.min * Math.min(player.seasonGames || 0, currentTeamGames) / currentTeamGames) : 0;
  return (1 - currentWeight) * prior + currentWeight * cur;
}

// Tonight's roster versus the roster the rating was earned with.
// Positive adj = team stronger tonight than its rating says.
function calcRosterAdjustment(team, strength) {
  const w = strength ? strength.currentWeight : 0;
  const tg = strength ? strength.currentGames : 0;
  const pace = (team.prior && team.prior.pace) || SEASON_LEAGUE_FALLBACK.pace;
  const items = [], unmodeled = [], agingItems = [];
  const onRoster = new Set();
  let adj = 0, aging = 0;
  const rows = (team.players || []).map(p => ({ p, prof: playerProfile(p) }));
  const raw = rows.reduce((s, x) => s + x.prof.mpg * (x.p.availability == null ? 1 : x.p.availability), 0);
  // Tonight's minutes: baseline minutes × availability, capped at teamMinutes in rotation order —
  // the players with the most baseline minutes keep theirs and the cut comes off the bottom
  // (research-minutes-cap.js; engine 2026-11-07.rotcap). The proportional cap it replaces shaved
  // every player, so phantom deep-bench minutes took minutes from the stars.
  const tonightMin = new Map();
  let left = SEASON_IMPACT.teamMinutes;
  [...rows].sort((a, b) => b.prof.mpg - a.prof.mpg).forEach(({ p, prof }) => {
    const m = Math.max(0, Math.min(prof.mpg * (p.availability == null ? 1 : p.availability), left));
    tonightMin.set(p.id, m); left -= m;
  });
  rows.forEach(({ p, prof }) => {
    onRoster.add(p.id);
    const value = playerImpactPts(p, pace, prof);
    // Aging: last season's part of the rating has him at last season's
    // level; tonight he plays a year older. Weighted by his share of that
    // rating and by whether he plays tonight.
    const priorShare = playerPriorShare(p, team);
    if (prof.ageShift && priorShare && p.availability > 0) {
      const atPrior = { ...prof, bpm: prof.priorBpm };
      const pts = (1 - w) * priorShare * p.availability *
        (playerImpactPts(p, pace, { ...atPrior, bpm: prof.priorBpm + prof.ageShift }) - playerImpactPts(p, pace, atPrior));
      if (pts) { aging += pts; agingItems.push({ id: p.id, name: p.name, age: prof.age, bpmShift: +prof.ageShift.toFixed(2), pts: +pts.toFixed(2) }); }
    }
    if (!value) {
      if (p.availability < 1 && prof.source === 'none') unmodeled.push(p.name);
      return;
    }
    const tonight = tonightMin.get(p.id);
    const inRating = playerRatingMinutes(p, team, w, tg);
    const delta = value / prof.mpg * (tonight - inRating);
    const share = inRating / prof.mpg;
    adj += delta;
    items.push({ id: p.id, name: p.name, status: p.status, availability: p.availability, value: +value.toFixed(2),
      share: +share.toFixed(2), minTonight: +tonight.toFixed(1), minRating: +inRating.toFixed(1), delta: +delta.toFixed(2),
      kind: p.availability < 1 ? 'absent' : share < 0.5 ? 'new' : 'in-rating' });
  });
  const P = _priors();
  _priorsByTeam(team.abbr).forEach(id => {
    if (onRoster.has(id)) return;
    const e = P.players[id];
    const player = { id, avg: null, seasonGames: 0 };
    const prof = playerProfile(player);
    const value = playerImpactPts(player, pace, prof);
    const inRating = playerRatingMinutes(player, team, w, 0);
    if (!value || inRating < 0.5) return;
    const delta = -value / prof.mpg * inRating;
    adj += delta;
    items.push({ id, name: e.n, status: 'departed', availability: 0, value: +value.toFixed(2), share: +(inRating / prof.mpg).toFixed(2),
      minTonight: 0, minRating: +inRating.toFixed(1), delta: +delta.toFixed(2), kind: 'departed' });
  });
  items.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  agingItems.sort((a, b) => Math.abs(b.pts) - Math.abs(a.pts));
  const capped = Math.max(-SEASON_IMPACT.teamCap, Math.min(SEASON_IMPACT.teamCap, adj));
  const agingCapped = Math.max(-SEASON_IMPACT.agingCap, Math.min(SEASON_IMPACT.agingCap, aging));
  return {
    adj: +capped.toFixed(2), uncapped: +adj.toFixed(2),
    aging: +agingCapped.toFixed(2), agingUncapped: +aging.toFixed(2), agingItems,
    minutes: { raw: +raw.toFixed(1), tonight: +Math.min(raw, SEASON_IMPACT.teamMinutes).toFixed(1), cut: +Math.max(0, raw - SEASON_IMPACT.teamMinutes).toFixed(1) },
    items,
    missing: items.filter(i => i.kind === 'absent' && i.delta < -0.05),   // out tonight, and the rating counted on them
    unmodeled,
  };
}

// ── Roster fit ──────────────────────────────────────────────
// Prior-season rebound rate, weighted like the BPM prior and regressed
// toward the league rookie rate — the same inputs research-team-fit.js
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

// ── Opponent-adjusted form ──────────────────────────────────
// This season's margins corrected for who each team played and where:
// each game counts as margin − home court + the opponent's rating at the
// time. An opponent's rating is its opening-night rating (last season ×
// retention + roster changes + aging, everyone available) blended with
// its own adjusted margins so far, walked in date order so a game only
// uses earlier games. research-season-update.js 1c: −0.21 ± 0.12 MSE on
// 13,209 past games (−0.10 ± 0.12 when opponents are rated by last season
// alone). Tracked beside the engine; it does not drive picks.
// results: [{ date, tip?, home, away, homeScore, awayScore }] before tonight.
// Returns new teams with current.ppg/papg moved to the adjusted margin
// (their sum, which drives totals, is kept).
function seasonOpponentAdjust(teams, league, results) {
  const open = {};
  for (const [abbr, t] of Object.entries(teams)) {
    if (!t || !t.prior) continue;
    const base = { ...t, current: { games: 0 } };
    const s0 = calcSeasonTeamStrength(base, league);
    const r = calcRosterAdjustment({ ...base, players: (t.players || []).map(p => ({ ...p, availability: 1 })) }, s0);
    open[abbr] = s0.net * s0.pace / 100 + r.adj + r.aging;
  }
  const abbrs = Object.keys(open);
  if (!abbrs.length) return teams;
  const mean = abbrs.reduce((x, a) => x + open[a], 0) / abbrs.length;
  const st = Object.fromEntries(abbrs.map(a => [a, { g: 0, adj: 0 }]));
  const rating = (a) => { const s = st[a], w = s.g / (s.g + SEASON_SHRINK_K); return (1 - w) * (open[a] - mean) + w * (s.g ? s.adj / s.g : 0); };
  const ordered = (results || []).filter(g => st[g.home] && st[g.away] && g.homeScore != null && g.awayScore != null)
    .slice().sort((a, b) => ((a.tip || a.date) < (b.tip || b.date) ? -1 : (a.tip || a.date) > (b.tip || b.date) ? 1 : 0));
  for (const g of ordered) {
    const y = g.homeScore - g.awayScore, rh = rating(g.home), ra = rating(g.away);
    st[g.home].adj += y - SEASON_HCA + ra; st[g.away].adj += -y + SEASON_HCA + rh;
    st[g.home].g++; st[g.away].g++;
  }
  const out = {};
  for (const [abbr, t] of Object.entries(teams)) {
    const s = st[abbr], cur = t && t.current;
    if (!s || !s.g || !cur || !cur.games || cur.ppg == null || cur.papg == null) { out[abbr] = t; continue; }
    const m = s.adj / s.g, sum = cur.ppg + cur.papg;
    out[abbr] = { ...t, current: { ...cur, ppg: sum / 2 + m / 2, papg: sum / 2 - m / 2,
      oppAdjusted: { raw: +(cur.ppg - cur.papg).toFixed(2), adjusted: +m.toFixed(2), games: s.g } } };
  }
  return out;
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

  if (homeRoster.aging || awayRoster.aging) step('aging', 'Aging since last season', homeRoster.aging - awayRoster.aging,
    `${_agingDetail(home.abbr, homeRoster)} · ${_agingDetail(away.abbr, awayRoster)}`);

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
  const homeAdj = homeRoster.adj + homeRoster.aging + homeFit.adj, awayAdj = awayRoster.adj + awayRoster.aging + awayFit.adj;
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

function _agingDetail(abbr, r) {
  const sgn = (x) => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(1);
  const last = (n) => n.split(' ').filter(w => !/^(Jr\.?|Sr\.?|II|III|IV|V)$/.test(w)).slice(-1)[0] || n;
  const top = r.agingItems.filter(i => Math.abs(i.pts) >= 0.1).slice(0, 3).map(i => `${last(i.name)} (${i.age}) ${sgn(i.pts)}`);
  return `${abbr} ${sgn(r.aging)}${top.length ? ': ' + top.join(', ') : ''}${r.aging !== r.agingUncapped ? ` (capped from ${r.agingUncapped})` : ''}`;
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
