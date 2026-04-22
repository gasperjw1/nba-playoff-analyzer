// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// --- Formatters ---

/** Format a number to 1 decimal place. */
const fmtDec = v => v.toFixed(1);


// --- Rating Tier Helpers ---

/**
 * Get CSS class for a player rating value.
 * @param {number} r - Player rating (0-100)
 * @returns {string} CSS class name
 */
function getRatingClass(r) {
  if (r >= 85) return 'rating-elite';
  if (r >= 70) return 'rating-high';
  if (r >= 55) return 'rating-mid';
  return 'rating-low';
}

/**
 * Get tier class for an advanced stat value.
 * @param {number} val - Stat value
 * @param {number} goodThresh - Threshold for "good" tier
 * @param {number} greatThresh - Threshold for "elite" tier
 * @param {boolean} [invert=false] - If true, lower values are better (e.g., DRtg)
 * @returns {string} Tier class: 'elite' | 'good' | 'avg' | 'poor'
 */
function advStatClass(val, goodThresh, greatThresh, invert) {
  if (invert) {
    if (val <= greatThresh) return 'elite';
    if (val <= goodThresh) return 'good';
    if (val <= goodThresh + 3) return 'avg';
    return 'poor';
  }
  if (val >= greatThresh) return 'elite';
  if (val >= goodThresh) return 'good';
  if (val >= goodThresh - 3) return 'avg';
  return 'poor';
}

// --- Stat Accessor Lambdas ---
// Used by edge/note functions to extract specific stats from team objects.

const _epm    = t => Math.max(...t.players.map(p => p.epm));
const _syn    = t => Math.max(...t.synergy.map(l => l.score));
const _clutch = t => t.advStats.clutchNetRtg;
const _spm    = (t, s) => getCachedSPM(t, s.id).score;
const _onoff  = t => calcOnOffSummary(t).avg;
const _ext    = (t, s) => s.externalFactors.filter(f => f.team === t.abbr).reduce((a, f) => a + f.impact, 0);

// --- Edge / Note Generators ---
// These compare home vs. away stats to produce edge labels and descriptive notes.

/**
 * Generic stat edge comparison between home and away teams.
 * @param {Object} s - Series object
 * @param {Function} statFn - Function to extract stat from a team
 * @param {number} threshold - Difference below which edge is "Even"
 * @param {Function} [fmt] - Optional formatter
 * @returns {string} Edge label, e.g. "BOS +4.2" or "Even"
 */
function getStatEdge(s, statFn, threshold, fmt) {
  const h = statFn(s.homeTeam, s);
  const a = statFn(s.awayTeam, s);
  const d = h - a;
  if (Math.abs(d) <= threshold) return 'Even';
  return `${d > 0 ? s.homeTeam.abbr : s.awayTeam.abbr} +${fmt ? fmt(Math.abs(d)) : Math.abs(d)}`;
}

/**
 * Generic stat note showing both teams' values.
 * @param {Object} s - Series object
 * @param {Function} statFn - Function to extract stat from a team
 * @param {string} label - Stat label (unused in output, kept for API consistency)
 * @param {Function} [fmt] - Optional formatter
 * @returns {string} Note string
 */
function getStatNote(s, statFn, label, fmt) {
  const h = statFn(s.homeTeam, s);
  const a = statFn(s.awayTeam, s);
  const fH = fmt ? fmt(h) : h;
  const fA = fmt ? fmt(a) : a;
  return `${s.homeTeam.abbr}: ${h > 0 ? '+' : ''}${fH} vs ${s.awayTeam.abbr}: ${a > 0 ? '+' : ''}${fA}`;
}

// --- Specific Edge/Note Functions ---

function getBestPlayerEdge(s) {
  const h = Math.max(...s.homeTeam.players.map(p => p.rating));
  const a = Math.max(...s.awayTeam.players.map(p => p.rating));
  const d = h - a;
  return Math.abs(d) <= 2 ? 'Even' : `${d > 0 ? s.homeTeam.abbr : s.awayTeam.abbr} +${Math.abs(d)}`;
}

function getBestPlayerNote(s) {
  const h = s.homeTeam.players.reduce((a, b) => a.rating > b.rating ? a : b);
  const a = s.awayTeam.players.reduce((x, b) => x.rating > b.rating ? x : b);
  return `${h.name} (${h.rating}) vs ${a.name} (${a.rating})`;
}

function getEPMEdge(s) { return getStatEdge(s, _epm, 0.5, fmtDec); }
function getEPMNote(s) {
  const h = s.homeTeam.players.reduce((a, b) => a.epm > b.epm ? a : b);
  const a = s.awayTeam.players.reduce((x, b) => x.epm > b.epm ? x : b);
  return `${h.name} (${h.epm > 0 ? '+' : ''}${h.epm}) vs ${a.name} (${a.epm > 0 ? '+' : ''}${a.epm})`;
}

function getSynergyEdge(s) { return getStatEdge(s, _syn, 3); }
function getSynergyNote(s) {
  return `${s.homeTeam.abbr}: ${_syn(s.homeTeam)} vs ${s.awayTeam.abbr}: ${_syn(s.awayTeam)}`;
}

function getClutchEdge(s) { return getStatEdge(s, _clutch, 1, fmtDec); }
function getClutchNote(s) { return getStatNote(s, _clutch, 'clutch', fmtDec); }

function getSPMEdge(s) { return getStatEdge(s, _spm, 3); }
function getSPMNote(s) {
  return `${s.homeTeam.abbr}: ${_spm(s.homeTeam, s)} vs ${s.awayTeam.abbr}: ${_spm(s.awayTeam, s)}`;
}

function getOnOffEdge(s) { return getStatEdge(s, _onoff, 0.5, fmtDec); }
function getOnOffNote(s) {
  return `${s.homeTeam.abbr}: ${_onoff(s.homeTeam) > 0 ? '+' : ''}${_onoff(s.homeTeam)} avg | ${s.awayTeam.abbr}: ${_onoff(s.awayTeam) > 0 ? '+' : ''}${_onoff(s.awayTeam)} avg`;
}
