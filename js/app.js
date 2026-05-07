// ============================================================
// APPLICATION INITIALIZATION
// ============================================================

// Tier 1.1: Schema validation — fail loudly on data corruption.
// Must run BEFORE any rendering so a broken page can still surface
// the error banner instead of silently going wrong.
if (typeof validateAll === 'function') {
  const __validationErrors = validateAll(
    typeof SERIES_DATA !== 'undefined' ? SERIES_DATA : [],
    typeof BETS !== 'undefined' ? BETS : [],
    typeof FEATURED_PARLAYS !== 'undefined' ? FEATURED_PARLAYS : []
  );
  if (__validationErrors.length) {
    console.error('[validators] ' + __validationErrors.length + ' schema issue(s) at boot:');
    __validationErrors.forEach(e => console.error('  • ' + e));
    if (typeof renderValidationBanner === 'function') {
      renderValidationBanner(__validationErrors);
    }
  }
}

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
