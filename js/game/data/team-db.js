// ============================================================
// PLAYOFF RUN — TEAM DB (Phase 0)
// ============================================================
// Canonical, TEAM-centric view of the 16 playoff teams, DERIVED from
// SERIES_DATA at load time. Zero data duplication: SERIES_DATA stays the
// single source of truth; this module reshapes each team's R1 (season-
// baseline) appearance into what the game sim needs and layers on derived
// fields (tier, default rotation, calibration offsets).
//
// Why R1 appearances: later-round rosters carry in-playoffs rating drift
// (the analyzer hand-tuned ratings on results); R1 is the closest thing
// to a season-baseline snapshot.
//
// CALIBRATION OFFSETS (the fidelity guarantee): team offense is modeled as
//   ORtg = LEAGUE.ortg + offsetO + Σ oLEBRON_i × floorShare_i
// where offsetO is solved so the FULL-STRENGTH default rotation reproduces
// the team's real advStats.ortg exactly. Roster changes then move the
// number by player impact. Same for DRtg with dLEBRON (sign flipped:
// positive dLEBRON lowers DRtg).
// ============================================================

/** Sum of on-court impact for a rotation: Σ metric_i × (min_i/240 × 5). */
function _rotationImpact(players, minutes, metricFn) {
  let sum = 0;
  players.forEach((p, i) => {
    sum += metricFn(p) * (minutes[i] / 240) * 5 * gameOverloadMult(minutes[i]);
  });
  return sum;
}

/** oLEBRON with fallback for players missing LEBRON data (e.g. Bronny). */
function gameOLebron(p) {
  if (typeof p.oLebron === 'number') return p.oLebron;
  return (typeof p.epm === 'number' ? p.epm : -2) * 0.6;
}
function gameDLebron(p) {
  if (typeof p.dLebron === 'number') return p.dLebron;
  return (typeof p.epm === 'number' ? p.epm : -2) * 0.4;
}

/** Tier by season scoring (thresholds in GAME_CONFIG.tiers). */
function gamePlayerTier(ppg) {
  const t = GAME_CONFIG.tiers;
  if (ppg >= t.star.minPpg) return 'star';
  if (ppg >= t.mid.minPpg) return 'mid';
  return 'role';
}

/**
 * Default minutes for a set of available players: healthy bodies sorted by
 * baseline rating take the template slots down to rotationDepth, then
 * everything is normalized to exactly 240.
 * Returns [{player, minutes}] for ALL passed players (0 for out of rotation).
 */
function gameDefaultRotation(players, rotationDepth) {
  const depth = Math.min(rotationDepth || GAME_CONFIG.defaultRotationDepth, players.length);
  const template = GAME_CONFIG.minutesTemplate;
  const ranked = players.slice().sort((a, b) => (b.baseRating || 0) - (a.baseRating || 0));
  const raw = new Map();
  ranked.forEach((p, i) => raw.set(p.name, i < depth ? (template[i] || 4) : 0));
  const total = [...raw.values()].reduce((a, b) => a + b, 0);
  const scale = 240 / total;
  return players.map(p => ({ player: p, minutes: raw.get(p.name) * scale }));
}

/** Build one game-team from its series-data appearance. */
function _buildGameTeam(t, series) {
  const players = (t.players || []).map(src => ({
    name: src.name,
    pos: src.pos,
    // Healthy baseline talent. rating can be 0 (injured/out of rotation at
    // the real playoffs' start) — baseRating is the player's true level.
    baseRating: src.baseRating || src.rating || 0,
    tier: gamePlayerTier(src.ppg || 0),
    ppg: src.ppg || 0, rpg: src.rpg || 0, apg: src.apg || 0,
    usg: src.usg || 15, ts: src.ts || 55,
    // SPM chemistry source stats (Maymin dimensions — see gameSynergy)
    epm: (typeof src.epm === 'number') ? src.epm : 0,
    bpm: (typeof src.bpm === 'number') ? src.bpm : 0,
    onOff: (typeof src.onOff === 'number') ? src.onOff : 0,
    clutch: (typeof src.clutch === 'number') ? src.clutch : 4,
    fgp: src.fgp || 45,
    oLebron: gameOLebron(src), dLebron: gameDLebron(src),
    offRole: src.offRole || null, defRole: src.defRole || null,
    starCeiling: src.starCeiling || 0,
    injuryRisk: src.injuryRisk || 0,
    playoffAscension: src.playoffAscension || 0,
    // Real status at the 2026 playoffs' start (historical-mode run seeds;
    // rating 0 + OUT string = unavailable until the injury engine clears it).
    initialStatus: (src.rating === 0 && /OUT/.test(src.injury || '')) ? 'out' : 'available',
  }));

  const availableNow = players.filter(p => p.initialStatus === 'available' && p.baseRating > 0);
  const coach = GAME_COACH_PROFILES[t.abbr] || null;
  const rotation = gameDefaultRotation(availableNow, coach && coach.rotationDepth);
  const rotPlayers = rotation.map(r => r.player);
  const rotMinutes = rotation.map(r => r.minutes);

  // Fidelity calibration: solve offsets so full-strength default rotation
  // reproduces the team's real season ratings (see module header).
  const impO = _rotationImpact(rotPlayers, rotMinutes, gameOLebron);
  const impD = _rotationImpact(rotPlayers, rotMinutes, gameDLebron);
  const adv = t.advStats || {};

  // Usage baseline of the default rotation (minutes-weighted mean usage).
  // Capacity's redistribution penalty measures deficits AGAINST this, so
  // the full-strength rotation is penalty-free by construction.
  let usgBaseline = 0;
  rotPlayers.forEach((p, i) => { usgBaseline += p.usg * rotMinutes[i] / 240; });

  // Season-role minutes proxy (players carry no season MPG): the default
  // rotation over the FULL healthy roster (season stats include players
  // who are out at playoffs start, e.g. Doncic). Used by capacity to scale
  // ppg/rpg/apg shares when tonight's minutes differ from the season role.
  const fullMinutes = {};
  gameDefaultRotation(players.filter(p => p.baseRating > 0), coach && coach.rotationDepth)
    .forEach(r => { fullMinutes[r.player.name] = r.minutes; });

  // Synergy baseline: SPM chemistry score of the default starting five.
  // gameSynergyMod measures the USER'S chosen five against this, so the
  // default lineup is always mod 0 (fidelity preserved). Null when the
  // analyzer chemistry engine isn't loaded (loaders must include it).
  let synergyBase = null;
  if (typeof calcSPMChemistry === 'function') {
    const five = rotation.slice().sort((a, b) => b.minutes - a.minutes).slice(0, 5)
      .map(r => ({ ...r.player, rating: r.player.baseRating }));
    synergyBase = calcSPMChemistry(five).score;
  }

  return {
    abbr: t.abbr, name: t.name, city: t.city,
    seed: t.seed, conf: series.conf, record: t.record,
    color: t.color, color2: t.color2,
    advStats: adv,
    initiators: t.initiators || 2,
    systemBonus: t.systemBonus || 0,
    playoffPedigree: t.playoffPedigree || 0,
    fortress: GAME_CONFIG.fortressTeams.includes(t.abbr),
    coach,
    players,
    usgBaseline,
    fullMinutes,
    synergyBase,
    offsetO: (adv.ortg || GAME_LEAGUE.ortg) - GAME_LEAGUE.ortg - impO,
    offsetD: (adv.drtg || GAME_LEAGUE.drtg) - GAME_LEAGUE.drtg + impD,
  };
}

/** Derive the 16-team DB from SERIES_DATA (R1 appearances only). */
function buildGameTeamDb(seriesData) {
  const db = {};
  (seriesData || []).forEach(s => {
    if (!s || (s.round || 'R1') !== 'R1') return;
    [s.homeTeam, s.awayTeam].forEach(t => {
      if (t && t.abbr && !db[t.abbr]) db[t.abbr] = _buildGameTeam(t, s);
    });
  });
  return db;
}

// Browser load: SERIES_DATA is already global. Node/test load: the harness
// builds the DB itself after loading series-data into its context.
const GAME_TEAM_DB = (typeof SERIES_DATA !== 'undefined') ? buildGameTeamDb(SERIES_DATA) : {};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buildGameTeamDb, gameDefaultRotation, gamePlayerTier, gameOLebron, gameDLebron };
}
