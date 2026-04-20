// ============================================================
// STATE MANAGEMENT
// ============================================================

// --- Active UI State ---
let currentSeriesIdx = 0;
let currentGameIdx = null;
let currentFactorSeriesIdx = null;
let currentRound = 'West';
let currentGameTab = 'overview';
let currentRosterTeam = 'home';

// --- Scenario Builder State ---
const scenarioState = {};

/**
 * Initialize scenario state from SERIES_DATA.
 * Sets each player to 'in' or 'out' based on injury status.
 */
function initScenarioState() {
  SERIES_DATA.forEach(s => {
    scenarioState[s.id] = {};
    [...s.homeTeam.players, ...s.awayTeam.players].forEach(p => {
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

const STORAGE_KEY = 'nba2026playoffV2';

/**
 * Load saved game results and player ratings from localStorage.
 */
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const parsed = JSON.parse(saved);
    parsed.forEach((sv, i) => {
      if (!SERIES_DATA[i]) return;

      SERIES_DATA[i].games = sv.games || SERIES_DATA[i].games;
      if (sv.externalFactors) {
        SERIES_DATA[i].externalFactors = sv.externalFactors;
      }
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
  } catch (e) {
    // Silently fail — localStorage may be unavailable
  }
}

/**
 * Save current game results and player ratings to localStorage.
 */
function saveState() {
  try {
    const data = SERIES_DATA.map(s => ({
      games: s.games,
      externalFactors: s.externalFactors,
      playerRatings: {
        homeTeam: Object.fromEntries(s.homeTeam.players.map(p => [p.name, p.rating])),
        awayTeam: Object.fromEntries(s.awayTeam.players.map(p => [p.name, p.rating]))
      }
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Silently fail
  }
}
