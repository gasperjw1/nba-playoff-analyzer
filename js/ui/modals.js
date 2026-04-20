// ============================================================
// MODAL HANDLERS
// ============================================================

/**
 * Helper to get a DOM element by ID.
 * @param {string} id - Element ID
 * @returns {HTMLElement}
 */
function $(id) {
  return document.getElementById(id);
}

/**
 * Build team option HTML for a series' two teams.
 * @param {Object} series - Series data object
 * @returns {string} HTML option tags
 */
function teamOptionsHTML(series) {
  return `<option value="${series.homeTeam.abbr}">${series.homeTeam.city} ${series.homeTeam.name}</option>` +
         `<option value="${series.awayTeam.abbr}">${series.awayTeam.city} ${series.awayTeam.name}</option>`;
}

/**
 * Open the game result modal for a specific game index.
 * @param {number} gi - Game index (0-based)
 */
function openGameModal(gi) {
  const s = SERIES_DATA[currentSeriesIdx];
  currentGameIdx = gi;

  $('modalTitle').textContent = `Update Game ${gi + 1}`;

  const sel = $('modalWinner');
  sel.innerHTML = teamOptionsHTML(s);

  const g = s.games[gi];
  if (g.winner) {
    sel.value = g.winner;
    $('modalScoreW').value = g.winner === s.homeTeam.abbr ? g.homeScore : g.awayScore;
    $('modalScoreL').value = g.winner === s.homeTeam.abbr ? g.awayScore : g.homeScore;
    $('modalNotes').value = g.notes || '';
  } else {
    $('modalScoreW').value = '';
    $('modalScoreL').value = '';
    $('modalNotes').value = '';
  }

  $('gameModal').classList.add('open');
}

/**
 * Close the game result modal.
 */
function closeModal() {
  $('gameModal').classList.remove('open');
}

/**
 * Save the game result from the modal form and re-render.
 */
function saveGameResult() {
  const s = SERIES_DATA[currentSeriesIdx];
  const g = s.games[currentGameIdx];
  const w = $('modalWinner').value;
  const sw = parseInt($('modalScoreW').value) || 0;
  const sl = parseInt($('modalScoreL').value) || 0;

  g.winner = w;
  if (w === s.homeTeam.abbr) {
    g.homeScore = sw;
    g.awayScore = sl;
  } else {
    g.homeScore = sl;
    g.awayScore = sw;
  }
  g.notes = $('modalNotes').value;
  g.result = w;

  saveState();
  closeModal();
  renderSeries();
}

/**
 * Open the external factor modal for the current series.
 */
function openFactorModal() {
  currentFactorSeriesIdx = currentSeriesIdx;
  const s = SERIES_DATA[currentSeriesIdx];

  $('factorTeam').innerHTML = teamOptionsHTML(s);
  $('factorPlayer').value = '';
  $('factorDesc').value = '';
  $('factorImpact').value = '-3';
  $('factorModal').classList.add('open');
}

/**
 * Close the external factor modal.
 */
function closeFactorModal() {
  $('factorModal').classList.remove('open');
}

/**
 * Save a new external factor from the modal form and re-render.
 */
function saveExternalFactor() {
  SERIES_DATA[currentFactorSeriesIdx].externalFactors.push({
    team: $('factorTeam').value,
    player: $('factorPlayer').value || null,
    desc: $('factorDesc').value,
    impact: parseInt($('factorImpact').value),
    category: $('factorCategory').value
  });

  saveState();
  closeFactorModal();
  renderSeries();
}
