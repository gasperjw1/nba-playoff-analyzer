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
    typeof FEATURED_PARLAYS !== 'undefined' ? FEATURED_PARLAYS : [],
    typeof BET_SLATES !== 'undefined' ? BET_SLATES : null,
    typeof CHS_LAB_LEDGER !== 'undefined' ? CHS_LAB_LEDGER : null,
    typeof USER_BET_LEDGER !== 'undefined' ? USER_BET_LEDGER : null
  );
  if (__validationErrors.length) {
    console.error('[validators] ' + __validationErrors.length + ' schema issue(s) at boot:');
    __validationErrors.forEach(e => console.error('  • ' + e));
    if (typeof renderValidationBanner === 'function') {
      renderValidationBanner(__validationErrors);
    }
  }
}

// Tier 1.3: Auto-resolve reconciliation — flag bets whose declared
// result disagrees with the box score, plus surface "auto-fillable"
// bets where a game finished but result is still null. Disagreements
// are surfaced via the same validation banner; auto-fillables only
// log to console (they're a daily-checklist signal, not a bug).
if (typeof reconcileAllBets === 'function' && typeof BETS !== 'undefined' && typeof SERIES_DATA !== 'undefined') {
  const __recon = reconcileAllBets(BETS, SERIES_DATA);
  const __disagree = __recon.filter(r => r.status === 'disagree');
  const __fillable = __recon.filter(r => r.status === 'auto-fillable');
  if (__disagree.length) {
    console.error(`[auto-resolve] ${__disagree.length} declared bet result(s) disagree with the box score:`);
    __disagree.forEach(r => console.error(`  • ${r.betId}: declared=${r.declared.outcome} computed=${r.computed.outcome} (${r.computed.actual})`));
    if (typeof renderValidationBanner === 'function') {
      renderValidationBanner(__disagree.map(r => `[auto-resolve] ${r.betId}: declared ${r.declared.outcome} but box score says ${r.computed.outcome} (${r.computed.actual})`));
    }
  }
  if (__fillable.length) {
    console.info(`[auto-resolve] ${__fillable.length} bet(s) ready for auto-fill (game finished, result still null):`);
    __fillable.forEach(r => console.info(`  • ${r.betId}: ${r.computed.outcome} (${r.computed.actual})`));
  }
}

// Boot the app
loadState();

// Phase 73g: apply LINEUP_OVERRIDES BEFORE initScenarioState so the
// scenario builder sees the overridden ratings (scratched players
// initialize as OUT instead of IN). Skipping this order means the
// scenario state holds a stale "IN" for a player whose actual rating
// just got zeroed by the override.
if (typeof applyLineupOverrides === 'function') {
  const __ovr = applyLineupOverrides();
  if (__ovr.errors && __ovr.errors.length) {
    console.warn('[lineup-overrides]', __ovr.errors.length, 'error(s):', __ovr.errors);
  }
  if (__ovr.applied > 0) {
    console.info(`[lineup-overrides] applied ${__ovr.applied} scratch(es) for ${(typeof CURRENT_DATE !== 'undefined' ? CURRENT_DATE : 'today')}`);
  }
}

initScenarioState();

// Phase 73d: sync the series cursor with currentPlayoffRound + currentConf
// so that when the user navigates Series Analysis later, they land on a
// series matching BOTH. The helper lives in state.js so Bets-page round
// toggles can reuse it.
syncSeriesCursorToRound(currentPlayoffRound);

// Render the landing page first; tabs are drawn lazily on series-tab click.
updateBetsNavLabel();
renderHomePage(document.getElementById('main'));
document.getElementById('tabs').style.display = 'none';
