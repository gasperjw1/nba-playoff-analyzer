// ============================================================
// PLAYER PROP PROJECTIONS (regular season)
// ============================================================
// Projection = per-minute rate × projected minutes
//            × usage redistribution (absent teammates' production)
//            × opponent defense × pace
// blended lightly with career head-to-head when the sample is there.
// Distributions are normal with sd linear in the mean (SEASON_PROP.sd).
// ============================================================

const PROP_STATS = ['pts', 'reb', 'ast', 'tpm', 'stl', 'blk'];

function _perMinute(avg, stat) {
  if (!avg || avg.min < 1) return 0;
  return avg[stat] / avg.min;
}

// Share of each stat the absent players normally produce, relative to
// what the active rotation produces — the redistribution factor.
function calcRedistribution(team, availabilityOverride) {
  const active = {}, missing = {};
  PROP_STATS.forEach(s => { active[s] = 0; missing[s] = 0; });
  (team.players || []).forEach(p => {
    const avail = availabilityOverride && (p.id in availabilityOverride) ? availabilityOverride[p.id] : p.availability;
    if (!p.avg || p.avg.min < 5) return;
    PROP_STATS.forEach(s => {
      active[s] += avail * p.avg[s];
      missing[s] += (1 - avail) * p.avg[s];
    });
  });
  const factor = {};
  PROP_STATS.forEach(s => {
    factor[s] = active[s] > 0 ? 1 + SEASON_PROP.redistribution * missing[s] / active[s] : 1;
  });
  return factor;
}

function propSd(stat, mean) {
  const c = SEASON_PROP.sd[stat] || [1, 0.3];
  return Math.max(0.3, c[0] + c[1] * mean);
}

// P(stat > line). Half-point lines have no push; integer lines treat
// the push as half a win for display simplicity.
function probOver(mean, sd, line) {
  if (!(sd > 0)) return mean > line ? 1 : 0;
  const isHalf = Math.abs(line - Math.round(line)) > 1e-9;
  const cut = isHalf ? Math.ceil(line) - 0.5 : line + 0.5;
  const pOver = 1 - normalCdf((cut - mean) / sd);
  if (isHalf) return pOver;
  const pPush = normalCdf((line + 0.5 - mean) / sd) - normalCdf((line - 0.5 - mean) / sd);
  return pOver + 0.5 * pPush;
}

// player: SeasonPlayer; team/opp: SeasonTeam; slate: SeasonSlate.
// Returns null for players projected not to play.
function projectPlayerProps(player, team, opp, slate, opts) {
  opts = opts || {};
  const availOv = opts.availabilityOverride || null;
  const avail = availOv && (player.id in availOv) ? availOv[player.id] : player.availability;
  const avg = player.avg;
  if (!avg || avg.min < 5 || avail <= 0) return null;

  // Minutes conditional on playing. Fall back to season average when the
  // feed gave an "out" allowance (sub-minute) but the lab toggled him in.
  let minutes = player.projMin >= 5 ? player.projMin : avg.min;
  if (opts.minutesOverride && player.id in opts.minutesOverride) minutes = opts.minutesOverride[player.id];

  const league = slate.league;
  const oppStrength = calcSeasonTeamStrength(opp, league);
  const teamPace = team.prior.pace || league.pace;
  const paceF = ((teamPace + (opp.prior.pace || league.pace)) / 2) / teamPace;
  const defF = 1 + SEASON_PROP.oppDefenseWeight * (oppStrength.drtg - league.ortg) / league.ortg;
  const redist = calcRedistribution(team, availOv);

  const out = { id: player.id, name: player.name, pos: player.pos, team: team.abbr, opp: opp.abbr,
    availability: avail, min: +minutes.toFixed(1), starter: player.starter, factors: {}, sd: {} };
  PROP_STATS.forEach(s => {
    const rate = _perMinute(avg, s);
    let v = rate * minutes * redist[s] * paceF;
    if (s === 'pts' || s === 'tpm') v *= defF;        // defense suppresses scoring, not boards/assists
    if (player.h2h && player.h2h.n >= SEASON_PROP.h2hMinGames && ['pts', 'reb', 'ast'].includes(s) && typeof player.h2h[s] === 'number' && avg.min > 0) {
      const h2hScaled = player.h2h[s] * (minutes / avg.min);
      v = (1 - SEASON_PROP.h2hWeight) * v + SEASON_PROP.h2hWeight * h2hScaled;
    }
    out[s] = +v.toFixed(1);
    out.sd[s] = +propSd(s, v).toFixed(2);
  });
  out.pra = +(out.pts + out.reb + out.ast).toFixed(1);
  // Minutes drive all three the same direction, so treat them as fully
  // correlated rather than independent (sum of sds, not root-sum-square).
  out.sd.pra = +(0.85 * (out.sd.pts + out.sd.reb + out.sd.ast)).toFixed(2);
  out.factors = {
    paceF: +paceF.toFixed(3), defF: +defF.toFixed(3),
    redistPts: +redist.pts.toFixed(3), redistReb: +redist.reb.toFixed(3), redistAst: +redist.ast.toFixed(3),
    h2h: player.h2h && player.h2h.n >= SEASON_PROP.h2hMinGames ? player.h2h : null,
  };
  return out;
}

// All playable players for one team in a game, sorted by projected minutes.
function projectTeamProps(teamAbbr, oppAbbr, slate, opts) {
  const team = slate.teams[teamAbbr], opp = slate.teams[oppAbbr];
  if (!team || !opp) return [];
  return team.players
    .map(p => projectPlayerProps(p, team, opp, slate, opts))
    .filter(Boolean)
    .sort((a, b) => b.min - a.min);
}
