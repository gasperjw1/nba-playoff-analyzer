// ============================================================
// APPLICATION INITIALIZATION
// ============================================================

// Boot the app
loadState();
initScenarioState();

// Default to the first series in the active playoff round
const firstRoundIdx = SERIES_DATA.findIndex(s => s.round === currentPlayoffRound);
if (firstRoundIdx >= 0) currentSeriesIdx = firstRoundIdx;

renderTabs();
renderSeries();
updateBetsNavLabel();
