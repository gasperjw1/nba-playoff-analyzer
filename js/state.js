// ============================================================
// STATE MANAGEMENT (Phase 42 — Multi-Round + Lineage)
// ============================================================

// --- Active UI State ---
let currentSeriesIdx = 0;
let currentGameIdx = null;
let currentFactorSeriesIdx = null;
let currentConf = 'West';             // Active conference tab: 'West' | 'East'
let currentPlayoffRound = 'CF';       // Active playoff round: 'R1' | 'R2' | 'CF' | 'Finals' — Phase 72: CF is live
let currentGameTab = 'overview';
let currentRosterTeam = 'home';

// Phase 73d (May 19, 2026): syncSeriesCursorToRound — atomic helper
// that keeps (currentPlayoffRound, currentConf, currentSeriesIdx) in
// sync whenever a caller changes the round. Prior bug: Bets-page
// "R2 Archive" button set currentPlayoffRound='R2' inline but left
// currentSeriesIdx pointing at a CF series → Series Analysis tab
// then showed OKC-SAS (idx 13) under R2 round-tab styling.
//
// Behavior:
//   - Tries to match round + current conf
//   - Falls back to any conf for that round (syncs conf to match)
//   - Skips TBD scaffolds
function syncSeriesCursorToRound(round) {
  if (typeof SERIES_DATA === 'undefined') return;
  if (round) currentPlayoffRound = round;
  let idx = SERIES_DATA.findIndex(s =>
    (s.round || 'R1') === currentPlayoffRound &&
    s.conf === currentConf &&
    !s.tbdOpponent
  );
  if (idx >= 0) { currentSeriesIdx = idx; return; }
  idx = SERIES_DATA.findIndex(s =>
    (s.round || 'R1') === currentPlayoffRound &&
    !s.tbdOpponent
  );
  if (idx >= 0) {
    currentSeriesIdx = idx;
    currentConf = SERIES_DATA[idx].conf;
  }
}

// --- Scenario Builder State ---
const scenarioState = {};

/**
 * Initialize scenario state from SERIES_DATA.
 * Sets each player to 'in' or 'out' based on injury status.
 */
function initScenarioState() {
  SERIES_DATA.forEach(s => {
    scenarioState[s.id] = {};
    // Phase 60 (May 14): CF scaffolds may have empty/missing player arrays
    // (NYK-TBD / OKC-TBD). Guard against undefined.players so boot doesn't
    // crash on Home page render.
    const home = (s.homeTeam && Array.isArray(s.homeTeam.players)) ? s.homeTeam.players : [];
    const away = (s.awayTeam && Array.isArray(s.awayTeam.players)) ? s.awayTeam.players : [];
    [...home, ...away].forEach(p => {
      if (!p || !p.name) return;
      scenarioState[s.id][p.name] = (p.injury && p.injury.includes('OUT')) ? 'out' : 'in';
    });
  });
}

/**
 * Toggle a player in/out for scenario analysis.
 * @param {string} seriesId - Series identifier
 * @param {string} playerName - Player name
 */
function togglePlayer(seriesId, playerName) {
  const current = scenarioState[seriesId][playerName];
  scenarioState[seriesId][playerName] = current === 'out' ? 'in' : 'out';
  clearSPMCache();
  renderSeries();
}

/**
 * Get a player's effective rating (0 if toggled out in scenario).
 * @param {Object} player - Player object
 * @param {string} seriesId - Series identifier
 * @returns {number} Effective rating
 */
function getEffectiveRating(player, seriesId) {
  if (scenarioState[seriesId] && scenarioState[seriesId][player.name] === 'out') return 0;
  return player.rating;
}

// --- Persistence (localStorage) ---
// V3: Keyed by series ID (round-safe). V2: Keyed by array index (legacy).

const STORAGE_KEY = 'nba2026playoffV3';
const LEGACY_STORAGE_KEY = 'nba2026playoffV2';

/**
 * Load saved game results and player ratings from localStorage.
 * Supports both V3 (keyed by series ID) and legacy V2 (keyed by array index).
 */
function loadState() {
  try {
    // Try V3 format first (keyed by series ID)
    const savedV3 = localStorage.getItem(STORAGE_KEY);
    if (savedV3) {
      const parsed = JSON.parse(savedV3);
      SERIES_DATA.forEach(s => {
        const sv = parsed[s.id];
        if (!sv) return;
        if (sv.games) s.games = sv.games;
        if (sv.externalFactors) s.externalFactors = sv.externalFactors;
        if (sv.playerRatings) {
          Object.entries(sv.playerRatings).forEach(([teamKey, ratings]) => {
            const team = s[teamKey];
            if (!team) return;
            Object.entries(ratings).forEach(([name, rating]) => {
              const player = team.players.find(x => x.name === name);
              if (player) player.rating = rating;
            });
          });
        }
      });
      return;
    }

    // Fall back to V2 legacy format (keyed by array index)
    const savedV2 = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (savedV2) {
      const parsed = JSON.parse(savedV2);
      parsed.forEach((sv, i) => {
        if (!SERIES_DATA[i]) return;
        SERIES_DATA[i].games = sv.games || SERIES_DATA[i].games;
        if (sv.externalFactors) SERIES_DATA[i].externalFactors = sv.externalFactors;
        if (sv.playerRatings) {
          Object.entries(sv.playerRatings).forEach(([teamKey, ratings]) => {
            const team = SERIES_DATA[i][teamKey];
            if (!team) return;
            Object.entries(ratings).forEach(([name, rating]) => {
              const player = team.players.find(x => x.name === name);
              if (player) player.rating = rating;
            });
          });
        }
      });
      // Migrate: save in V3 format, remove V2
      saveState();
      try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch (_) {}
    }
  } catch (e) {
    // Silently fail — localStorage may be unavailable
  }
}

/**
 * Save current game results and player ratings to localStorage.
 * V3 format: object keyed by series ID (survives array reordering / R2 additions).
 */
function saveState() {
  try {
    const data = {};
    SERIES_DATA.forEach(s => {
      data[s.id] = {
        round: s.round || 'R1',
        games: s.games,
        externalFactors: s.externalFactors,
        playerRatings: {
          homeTeam: Object.fromEntries(s.homeTeam.players.map(p => [p.name, p.rating])),
          awayTeam: Object.fromEntries(s.awayTeam.players.map(p => [p.name, p.rating]))
        }
      };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Silently fail
  }
}
