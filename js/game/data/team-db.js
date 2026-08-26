// ============================================================
// PLAYOFF RUN — TEAM DB (Phase 0)
// ============================================================
// Canonical, TEAM-centric view of the 16 playoff teams, DERIVED from
// SERIES_DATA at load time. Zero data duplication: SERIES_DATA stays the
// single source of truth; this module reshapes each team's R1 (season-
// baseline) appearance into what the game sim needs and layers on derived
// fields (tier, default rotation, calibration offsets).
//
// Sourcing rule: team identity/advStats from the R1 appearance; player
// SKILL PROFILES from each player's LATEST appearance (the analyzer
// corrected records as the playoffs revealed the truth — McCain's R1
// placeholder vs his fixed CF record); initial injury STATUS parsed from
// the R1 record (playoff-start availability). See _latestProfiles.
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

/**
 * Player DESIGNATION — what kind of player he is, derived from stats and
 * roles rather than listed position (user design: guard / guard-wing /
 * wing / big / flex). Flex = profile genuinely spans groups (point-
 * forwards, rebounding guards, playmaking bigs) — the lineup-composition
 * math credits them fractionally, which is exactly their value.
 */
function gameDesignation(p) {
  const pos = p.pos || 'SF', reb = p.rpg || 0, ast = p.apg || 0;
  const interiorD = (GAME_DEF_ROLE_FAMILY[p.defRole] || '') === 'interior';
  const bigOff = (GAME_OFF_ROLE_FAMILY[p.offRole] || '') === 'big';
  if (pos === 'C') return 'big';
  if (pos === 'PF') {
    if (bigOff || interiorD || reb >= 6.5) return 'big';
    return ast >= 4 ? 'flex' : 'wing';                    // playmaking/stretch forwards
  }
  if (pos === 'PG') return (reb >= 6 || interiorD) ? 'flex' : 'guard';
  if (pos === 'SG') {
    if (reb >= 5.5) return 'flex';                        // rebounding guards (Hart-types)
    return reb >= 3.5 ? 'guard-wing' : 'guard';
  }
  // SF
  if (ast >= 5.5) return 'flex';                          // point-forwards (LeBron)
  if (bigOff || interiorD || reb >= 7.5) return 'flex';   // big-wings
  return ast >= 3.5 ? 'guard-wing' : 'wing';
}

/** Fractional guard/wing/big credit per designation (composition math). */
const GAME_DESIGNATION_CREDIT = {
  guard: [1, 0, 0], 'guard-wing': [0.5, 0.5, 0], wing: [0, 1, 0],
  big: [0, 0, 1], flex: [0.34, 0.33, 0.33],
};

/**
 * NATURAL offensive roles beyond the labeled one — derived from what the
 * player actually does (user playtest: Josh Hart assigned Cutter was
 * flagged a miscast, but he finishes inside and crashes — that IS his
 * game). Assigning a natural secondary role costs ~nothing.
 */
function gameNaturalOffRoles(p) {
  const set = [p.offRole].filter(Boolean);
  const add = r => { if (!set.includes(r)) set.push(r); };
  const fgp = p.fgp || 45, ts = p.ts || 55, reb = p.rpg || 0, ast = p.apg || 0;
  const isBigOff = (GAME_OFF_ROLE_FAMILY[p.offRole] || '') === 'big';
  // Cutter: plays inside the arc and crashes — signal is REBOUNDING for
  // a non-big (Hart: 7.4 rpg as a guard, low fgp BECAUSE he skips threes)
  // or genuine finishing efficiency.
  if (!isBigOff && (reb >= 5.5 || (fgp >= 48 && reb >= 4))) add('Cutter');
  if (fgp >= 49 && p.pos !== 'C' && !isBigOff) add('Athletic Finisher');
  if (ast >= 3) add('Secondary Ball Handler');
  if (ast >= 5.5) add('Primary Ball Handler');
  if (ts >= 57 && !isBigOff) add('Stationary Shooter');
  if (isBigOff && ts >= 58) add('Stretch Big');
  return set;
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

/**
 * Parse a rating-0 player's real status at playoffs start (user playtest:
 * Anthony Edwards — "OUT, est. return May 9" — was permanently excluded).
 *   'dnp'       : coach's rotation decision, stays out (Finney-Smith)
 *   'returning' : injured with a timeline — seeded into the run's injury
 *                 book (createGameRun) and RETURNS after gamesOut games.
 * Return estimate: parsed date vs the Apr 19 playoff start at ~2.2
 * days/game; season-ending markers → 99 (never returns within a run).
 */
function gameParseInitialInjury(src) {
  if (src.rating !== 0) return null;
  const inj = src.injury || '';
  if (!/OUT|Questionable/i.test(inj)) return null;
  if (/out of rotation|DNP/i.test(inj)) return { status: 'dnp' };
  if (/season|Achilles|ACL/i.test(inj)) return { status: 'returning', gamesOut: 99 };
  let gamesOut = 5;
  const m = inj.match(/(Apr(?:il)?|May|Jun(?:e)?)\.?\s*(\d+)/i);
  if (m) {
    const month = /^apr/i.test(m[1]) ? 3 : /^may/i.test(m[1]) ? 4 : 5;
    const days = (new Date(2026, month, parseInt(m[2])) - new Date(2026, 3, 19)) / 86400000;
    gamesOut = Math.max(1, Math.min(30, Math.round(days / 2.2)));
  }
  if (/questionable/i.test(inj)) gamesOut = Math.min(gamesOut, 2);
  return { status: 'returning', gamesOut };
}

/**
 * Latest-appearance skill profiles: the analyzer hand-CORRECTED player
 * records as the playoffs revealed the truth (Jared McCain entered R1
 * data as a 55-rated 6.6-ppg placeholder and was fixed to 68 / 14.2 ppg
 * in the CF record — the roster-fidelity correction). R1 records were
 * themselves live-tuned during R1, so "latest" is not less pure — it is
 * the most-informed version of the same data. Injury/status parsing
 * stays on the R1 record (playoff-START availability).
 */
function _latestProfiles(seriesData, abbr) {
  const ROUND_ORD = { R1: 0, R2: 1, CF: 2, Finals: 3 };
  const latest = {};
  (seriesData || []).forEach(s => {
    const ord = ROUND_ORD[s.round || 'R1'];
    [s.homeTeam, s.awayTeam].forEach(t => {
      if (!t || t.abbr !== abbr) return;
      (t.players || []).forEach(p => {
        if (!p || !p.name) return;
        if (!latest[p.name] || ord >= latest[p.name]._ord) latest[p.name] = { ...p, _ord: ord };
      });
    });
  });
  return latest;
}

/** Build one game-team from its R1 appearance + latest skill profiles. */
function _buildGameTeam(t, series, latestByName) {
  const players = (t.players || []).map(r1src => {
    const src = (latestByName && latestByName[r1src.name]) || r1src;
    return ({
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
    designation: null,        // filled below (needs the full object)
    naturalOffRoles: null,
    // Real status at the 2026 playoffs' start — parsed from the R1
    // record (see gameParseInitialInjury), NOT the latest one.
    ...(function () {
      const st = gameParseInitialInjury(r1src);
      return st
        ? { initialStatus: st.status, initialGamesOut: st.gamesOut || 0 }
        : { initialStatus: 'available', initialGamesOut: 0 };
    })(),
  });
  });

  players.forEach(p => {
    p.designation = gameDesignation(p);
    p.naturalOffRoles = gameNaturalOffRoles(p);
  });

  const availableNow = players.filter(p => p.initialStatus !== 'dnp' && p.baseRating > 0);
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
  let usgBaseline = 0, creationBaseline = 0;
  rotPlayers.forEach((p, i) => {
    usgBaseline += p.usg * rotMinutes[i] / 240;
    creationBaseline += (p.apg || 0) * rotMinutes[i] / 240;
  });

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
    creationBaseline,
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
      if (t && t.abbr && !db[t.abbr]) {
        db[t.abbr] = _buildGameTeam(t, s, _latestProfiles(seriesData, t.abbr));
      }
    });
  });
  return db;
}

// Browser load: SERIES_DATA is already global. Node/test load: the harness
// builds the DB itself after loading series-data into its context.
const GAME_TEAM_DB = (typeof SERIES_DATA !== 'undefined') ? buildGameTeamDb(SERIES_DATA) : {};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { buildGameTeamDb, gameDefaultRotation, gamePlayerTier, gameOLebron, gameDLebron, gameParseInitialInjury, gameDesignation, gameNaturalOffRoles, GAME_DESIGNATION_CREDIT };
}
