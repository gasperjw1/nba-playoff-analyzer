// ============================================================
// APPLICATION INITIALIZATION
// ============================================================

// Boot the app
loadState();
initScenarioState();

// Default the series cursor to the first series in the active round so that
// when the user navigates Series Analysis later, they land somewhere sensible.
const firstRoundIdx = SERIES_DATA.findIndex(s => s.round === currentPlayoffRound);
if (firstRoundIdx >= 0) currentSeriesIdx = firstRoundIdx;

// Render the landing page first; tabs are drawn lazily on series-tab click.
updateBetsNavLabel();
renderHomePage(document.getElementById('main'));
document.getElementById('tabs').style.display = 'none';
