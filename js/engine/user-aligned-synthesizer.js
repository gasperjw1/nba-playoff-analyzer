// ============================================================
// USER-ALIGNED SYNTHESIZER — generate parlays matching house style
// ============================================================
// Phase 77: closes the loop between Council deliberation output and
// the user's documented winning archetypes.
//
// Pipeline:
//   1. Gather player projections + last-3-game minutes from CHS Lab
//      ledger + boxScores
//   2. Classify players by role (star/starter/role-player/bench)
//   3. Apply minutes-security gate (the kill switch)
//   4. Construct candidate parlays per archetype
//   5. Score by archetype fit × Council confidence × minute security
//   6. Return top 3 recommendations with reasoning
//
// Output schema per recommendation:
//   {
//     archetype: 'A-role-player-pra-stack' | ...,
//     legs: [{ player, stat, line, direction, projection, minutesSecurity, role }],
//     score: 0..1,
//     reasoning: 'short narrative',
//     stake: dollars,
//     estimatedOdds: american,
//     bookLineCheck: notes if any leg may not be available at observed book floor
//   }
// ============================================================

// ──────────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────────

function classifyPlayerRole(player, houseStyle) {
  const rules = houseStyle.roleClassification;
  const rating = player.rating || 0;
  const avgMin = player.avgMin || 0;

  if (rating >= rules.star.minRating) return 'star';
  if (rating >= rules.starter.minRating && rating <= rules.starter.maxRating && avgMin >= rules.starter.minAvgMin) return 'starter';
  if (rating >= rules['role-player'].minRating && rating <= rules['role-player'].maxRating && avgMin >= rules['role-player'].minAvgMin) return 'role-player';
  return 'bench';
}

function computeMinutesSecurity(playerName, abbr, SERIES_DATA, lookbackGames) {
  // Returns ratio of min_floor / min_avg over last N games
  const minutes = [];
  SERIES_DATA.forEach(s => {
    if (!s.games) return;
    s.games.forEach(g => {
      if (!g.boxScores) return;
      const isHome = s.id.startsWith(abbr + '-');
      const isAway = s.id.endsWith('-' + abbr);
      if (!isHome && !isAway) return;
      const box = isHome ? g.boxScores.home : g.boxScores.away;
      const p = box.find(x => x.name && (
        x.name === playerName ||
        x.name.toLowerCase().includes(playerName.toLowerCase().split(' ').slice(-1)[0])
      ));
      if (p && typeof p.min === 'number') {
        minutes.push(p.min);
      }
    });
  });
  if (!minutes.length) return { security: 0, sampleSize: 0, avgMin: 0, floorMin: 0 };
  const recent = minutes.slice(-lookbackGames);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const floor = Math.min(...recent);
  return {
    security: avg > 0 ? floor / avg : 0,
    sampleSize: recent.length,
    avgMin: avg,
    floorMin: floor,
    history: recent,
  };
}

function getPlayerProjection(playerName, chsLedger, gameId) {
  // Find latest projection for the player from CHS Lab ledger
  const entry = chsLedger.find(e => e.series + '_G' + e.game === gameId || e.series === gameId.split('-G')[0]);
  if (!entry || !entry.candidates) return null;
  return entry.candidates.filter(c => c.player === playerName);
}

function isCrossTeam(legs, homeAbbr, awayAbbr) {
  const hasHome = legs.some(l => l.team === homeAbbr);
  const hasAway = legs.some(l => l.team === awayAbbr);
  return hasHome && hasAway;
}

function checkBookLineFloor(player, stat, line, houseStyle) {
  const floors = houseStyle.bookLineFloors[player];
  if (!floors || !floors[stat]) return { ok: true, note: null };
  if (line < floors[stat]) {
    return {
      ok: false,
      note: `Book floor for ${player} ${stat} is ${floors[stat]}; this line (${line}) may not be available — use ${floors[stat]} or higher`
    };
  }
  return { ok: true, note: null };
}

// ──────────────────────────────────────────────────────────────────
// ARCHETYPE A — Role-player PRA stack
// ──────────────────────────────────────────────────────────────────

function constructArchetypeA(candidates, archetype, series, houseStyle) {
  // Filter candidates: PRA OVER on role-players/starters with min security
  const eligible = candidates.filter(c =>
    c.stat === 'pra' &&
    c.direction === 'over' &&
    (c.role === 'role-player' || c.role === 'starter') &&
    c.minutesSecurity.security >= archetype.minMinutesSecurity
  );

  if (eligible.length < archetype.legCount.min) return [];

  // Generate 2-leg, 3-leg, 4-leg combinations
  const parlays = [];
  const sorted = eligible.sort((a, b) => b.minutesSecurity.security - a.minutesSecurity.security);

  // Take top combinations (greedy)
  const topN = sorted.slice(0, Math.min(6, sorted.length));

  // Prefer cross-team
  for (let k = archetype.legCount.min; k <= archetype.legCount.max; k++) {
    if (topN.length < k) continue;
    // Try a cross-team combination
    const crossTeamCombo = [];
    const homeAbbr = series.homeTeam.abbr;
    const awayAbbr = series.awayTeam.abbr;
    const homePicks = topN.filter(c => c.team === homeAbbr).slice(0, Math.ceil(k / 2));
    const awayPicks = topN.filter(c => c.team === awayAbbr).slice(0, Math.floor(k / 2) + (k % 2 ? 1 : 0));
    const combined = [...homePicks, ...awayPicks].slice(0, k);
    if (combined.length === k) {
      parlays.push({
        archetype: archetype.id,
        legs: combined.map(c => ({
          player: c.player, stat: c.stat, line: c.line, direction: c.direction,
          projection: c.projection, minutesSecurity: c.minutesSecurity, role: c.role, team: c.team,
          juiceEstimate: c.juiceEstimate,
        })),
        crossTeam: isCrossTeam(combined, homeAbbr, awayAbbr),
      });
    }
  }
  return parlays;
}

// ──────────────────────────────────────────────────────────────────
// ARCHETYPE B — Cross-team star direction-hedge
// ──────────────────────────────────────────────────────────────────

function constructArchetypeB(candidates, archetype, series, councilOutput) {
  // Need stars on both teams; one OVER, one UNDER
  const homeAbbr = series.homeTeam.abbr;
  const awayAbbr = series.awayTeam.abbr;
  const homeStars = candidates.filter(c => c.role === 'star' && c.team === homeAbbr && archetype.stats.includes(c.stat));
  const awayStars = candidates.filter(c => c.role === 'star' && c.team === awayAbbr && archetype.stats.includes(c.stat));

  if (!homeStars.length || !awayStars.length) return [];

  const parlays = [];
  // Use Council recommendation to inform direction
  // If Council recommends 'away' (visiting team), expect HOME star UNDER + AWAY star OVER
  const councilSide = councilOutput && councilOutput.synthesis ? councilOutput.synthesis.recommendedSide : 'no-edge';

  homeStars.forEach(homeStar => {
    awayStars.forEach(awayStar => {
      const homeDir = councilSide === 'away' ? 'under' : 'over';
      const awayDir = councilSide === 'home' ? 'under' : 'over';
      parlays.push({
        archetype: archetype.id,
        legs: [
          {
            player: homeStar.player, stat: homeStar.stat, line: homeStar.line,
            direction: homeDir,
            projection: homeStar.projection, minutesSecurity: homeStar.minutesSecurity,
            role: 'star', team: homeAbbr,
            juiceEstimate: homeStar.juiceEstimate,
          },
          {
            player: awayStar.player, stat: awayStar.stat, line: awayStar.line,
            direction: awayDir,
            projection: awayStar.projection, minutesSecurity: awayStar.minutesSecurity,
            role: 'star', team: awayAbbr,
            juiceEstimate: awayStar.juiceEstimate,
          },
        ],
        crossTeam: true,
      });
    });
  });
  return parlays;
}

// ──────────────────────────────────────────────────────────────────
// ARCHETYPE C — Cross-team role-player hedge
// ──────────────────────────────────────────────────────────────────

function constructArchetypeC(candidates, archetype, series, houseStyle) {
  const homeAbbr = series.homeTeam.abbr;
  const awayAbbr = series.awayTeam.abbr;
  const eligible = candidates.filter(c =>
    (c.role === 'role-player' || c.role === 'starter') &&
    archetype.stats.includes(c.stat) &&
    c.minutesSecurity.security >= archetype.minMinutesSecurity
  );
  const home = eligible.filter(c => c.team === homeAbbr).slice(0, 3);
  const away = eligible.filter(c => c.team === awayAbbr).slice(0, 3);

  const parlays = [];
  home.forEach(h => {
    away.forEach(a => {
      parlays.push({
        archetype: archetype.id,
        legs: [
          { player: h.player, stat: h.stat, line: h.line, direction: h.direction, projection: h.projection, minutesSecurity: h.minutesSecurity, role: h.role, team: h.team, juiceEstimate: h.juiceEstimate },
          { player: a.player, stat: a.stat, line: a.line, direction: a.direction, projection: a.projection, minutesSecurity: a.minutesSecurity, role: a.role, team: a.team, juiceEstimate: a.juiceEstimate },
        ],
        crossTeam: true,
      });
    });
  });
  return parlays;
}

// ──────────────────────────────────────────────────────────────────
// SCORING
// ──────────────────────────────────────────────────────────────────

function scoreParlay(parlay, houseStyle, councilOutput) {
  let score = 0;

  // 1. Archetype fit (0.3 weight)
  const archetype = houseStyle.archetypes.find(a => a.id === parlay.archetype);
  const archetypeFit = archetype ? Math.min(1, archetype.observedWins / 3) : 0;
  score += archetypeFit * 0.30;

  // 2. Council confidence (0.3 weight)
  const councilConfidence = councilOutput && councilOutput.synthesis
    ? Math.abs(councilOutput.synthesis.aggregateEdge || 0) * 2 // edge to confidence ish
    : 0.5;
  score += Math.min(1, councilConfidence) * 0.30;

  // 3. Min minute security across legs (0.2 weight)
  const minSec = parlay.legs.reduce((m, l) => Math.min(m, l.minutesSecurity.security), 1);
  score += minSec * 0.20;

  // 4. Cross-team bonus (0.1 weight)
  score += (parlay.crossTeam ? 1 : 0) * 0.10;

  // 5. Stat dimension weight (0.1 weight) — avg weight across legs
  const dimSum = parlay.legs.reduce((s, l) => s + (houseStyle.dimensionWeights[l.stat] || 0.5), 0);
  const dimAvg = dimSum / parlay.legs.length;
  score += dimAvg * 0.10;

  return Math.round(score * 100) / 100;
}

// ──────────────────────────────────────────────────────────────────
// REASONING GENERATOR
// ──────────────────────────────────────────────────────────────────

function generateReasoning(parlay, archetype, councilOutput, series) {
  const reasons = [];

  // Council side
  if (councilOutput && councilOutput.synthesis) {
    const side = councilOutput.synthesis.recommendedSide;
    const edge = Math.abs(councilOutput.synthesis.aggregateEdge || 0);
    if (side !== 'no-edge') {
      const team = side === 'home' ? series.homeTeam.abbr : series.awayTeam.abbr;
      reasons.push(`Council lean: ${team} side at ${(edge * 100).toFixed(0)}% aggregate edge`);
    }
  }

  // Archetype fit
  reasons.push(`Matches Archetype ${archetype.id} (observed ${archetype.observedWins} wins in your record)`);

  // Minute security check
  const minSec = parlay.legs.reduce((m, l) => Math.min(m, l.minutesSecurity.security), 1);
  reasons.push(`Minimum minutes-security across legs: ${(minSec * 100).toFixed(0)}% (kill switch threshold 75%)`);

  // Cross-team
  if (parlay.crossTeam) reasons.push('Cross-team construction — reduces correlation risk');

  // Player roles
  const roles = parlay.legs.map(l => l.role);
  reasons.push(`Player roles: ${roles.join(' + ')}`);

  return reasons.join(' | ');
}

// ──────────────────────────────────────────────────────────────────
// MAIN — generateUserAlignedBets
// ──────────────────────────────────────────────────────────────────

function generateUserAlignedBets(series, gameNum, market, councilOutput, projections, SERIES_DATA, USER_HOUSE_STYLE) {
  // 1. Build candidate pool from projections
  const homeAbbr = series.homeTeam.abbr;
  const awayAbbr = series.awayTeam.abbr;
  const allPlayers = [
    ...series.homeTeam.players.map(p => ({ ...p, team: homeAbbr })),
    ...series.awayTeam.players.map(p => ({ ...p, team: awayAbbr })),
  ];

  // Enrich with minutes-security + role
  const enrichedCandidates = [];
  projections.forEach(proj => {
    const player = allPlayers.find(p => p.name === proj.player);
    if (!player) return;
    const minSec = computeMinutesSecurity(proj.player, player.team, SERIES_DATA, 3);
    const role = classifyPlayerRole({ ...player, avgMin: minSec.avgMin }, USER_HOUSE_STYLE);
    enrichedCandidates.push({
      player: proj.player,
      stat: proj.stat,
      line: proj.line,
      direction: proj.direction,
      projection: proj.hitRate,
      juiceEstimate: proj.estJuice,
      team: player.team,
      role,
      minutesSecurity: minSec,
    });
  });

  // 2. Apply hard minutes-security filter
  const survivors = enrichedCandidates.filter(c =>
    c.minutesSecurity.security >= USER_HOUSE_STYLE.metaRules.minutesSecurity.threshold
    || c.role === 'star'  // stars get a pass (their minutes are always secure)
  );

  // 3. Construct candidate parlays per archetype
  const candidateParlays = [];
  USER_HOUSE_STYLE.archetypes.forEach(archetype => {
    let parlays = [];
    if (archetype.id === 'A-role-player-pra-stack') {
      parlays = constructArchetypeA(survivors, archetype, series, USER_HOUSE_STYLE);
    } else if (archetype.id === 'B-cross-team-star-direction-hedge') {
      parlays = constructArchetypeB(survivors, archetype, series, councilOutput);
    } else if (archetype.id === 'C-cross-team-role-player-hedge') {
      parlays = constructArchetypeC(survivors, archetype, series, USER_HOUSE_STYLE);
    }
    candidateParlays.push(...parlays);
  });

  // 4. Score + rank
  const scored = candidateParlays.map(p => {
    const archetype = USER_HOUSE_STYLE.archetypes.find(a => a.id === p.archetype);
    const score = scoreParlay(p, USER_HOUSE_STYLE, councilOutput);
    const reasoning = generateReasoning(p, archetype, councilOutput, series);
    const bookLineNotes = p.legs
      .map(l => checkBookLineFloor(l.player, l.stat, l.line, USER_HOUSE_STYLE))
      .filter(c => !c.ok)
      .map(c => c.note);
    return {
      archetype: p.archetype,
      legs: p.legs,
      crossTeam: p.crossTeam,
      score,
      reasoning,
      stake: USER_HOUSE_STYLE.metaRules.stakeSize,
      bookLineNotes,
    };
  });

  // 5. Dedup by leg set (some archetypes may overlap)
  const uniq = [];
  const seen = new Set();
  scored.sort((a, b) => b.score - a.score);
  scored.forEach(p => {
    const key = p.legs.map(l => `${l.player}:${l.stat}:${l.direction}:${l.line}`).sort().join('|');
    if (!seen.has(key)) { uniq.push(p); seen.add(key); }
  });

  return uniq.slice(0, 5); // return top 5 candidates
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateUserAlignedBets,
    classifyPlayerRole, computeMinutesSecurity, scoreParlay, generateReasoning,
  };
}
