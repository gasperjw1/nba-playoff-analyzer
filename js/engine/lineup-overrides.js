// ============================================================
// LINEUP OVERRIDES — Phase 73g (May 19, 2026)
// ============================================================
// Late-breaking inactive list confirmation. The MC sim and engine
// projections read player.rating from SERIES_DATA, which is updated
// during the morning daily task. If a player is scratched 30 minutes
// before tipoff (e.g. De'Aaron Fox on 5/18 WCF G1), the engine has
// no way to see the change until SERIES_DATA is manually edited.
//
// LINEUP_OVERRIDES is the declarative bridge: append an entry, reload
// the page, the engine sees the player as OUT and re-projects.
//
// Schema:
//   {
//     date:        'YYYY-MM-DD'   when the override applies (defaults to today)
//     seriesId:    SERIES_DATA.id slug
//     playerName:  exact roster name
//     status:      'OUT' | 'GTD' | 'LIMITED'   (currently only OUT honored)
//     reason:      short string (illness, personal, late-scratch, etc.)
//     source:      reporter or "Shams 7:42 PM" style attribution
//     appliedAt:   ISO timestamp (set by helper)
//   }
//
// Effects when status='OUT':
//   1. player.rating set to 0  (engine treats as inactive)
//   2. player.injury set to "OUT — <reason> (Phase 73g override)"
//   3. player._overrideApplied = true (so UI can show the badge)
//   4. The override is logged in window.__LINEUP_OVERRIDE_LOG for audit
//
// The override re-applies on every page load, so a permanent fix
// should also propagate into series-data.js the next morning. The
// override is for the same-day, pre-tip lineup confirmation window.
// ============================================================

// User-editable list. Appended by the daily routine or manually
// before tip. Empty by default — entries here are temporary same-day
// scratches, not the canonical injury data in series-data.js.
const LINEUP_OVERRIDES = [
  // Example from yesterday — left as historical reference (commented out
  // because OKC-SAS G1 is now settled in series-data, no longer "live"):
  // {
  //   date: '2026-05-18',
  //   seriesId: 'OKC-SAS',
  //   playerName: "De'Aaron Fox",
  //   status: 'OUT',
  //   reason: 'Late scratch — illness (reported ~7pm ET)',
  //   source: 'Shams 2026-05-18 19:00 ET',
  // },
];

// Apply all currently-active overrides to SERIES_DATA. Idempotent —
// safe to call multiple times. Returns a summary of what was applied.
function applyLineupOverrides() {
  if (typeof SERIES_DATA === 'undefined' || !Array.isArray(LINEUP_OVERRIDES)) {
    return { applied: 0, errors: [] };
  }
  const today = (typeof CURRENT_DATE !== 'undefined') ? CURRENT_DATE : null;
  const applied = [];
  const errors = [];
  const appliedAt = new Date().toISOString();

  LINEUP_OVERRIDES.forEach((override, idx) => {
    if (!override || !override.seriesId || !override.playerName) {
      errors.push(`Override #${idx}: missing seriesId or playerName`);
      return;
    }
    // Date filter: only apply overrides for TODAY (or undated)
    if (override.date && today && override.date !== today) return;

    const series = SERIES_DATA.find(s => s.id === override.seriesId);
    if (!series) {
      errors.push(`Override #${idx}: series '${override.seriesId}' not found`);
      return;
    }
    const allPlayers = [
      ...(series.homeTeam && series.homeTeam.players || []),
      ...(series.awayTeam && series.awayTeam.players || []),
    ];
    const player = allPlayers.find(p => p && p.name === override.playerName);
    if (!player) {
      errors.push(`Override #${idx}: player '${override.playerName}' not found in ${override.seriesId}`);
      return;
    }

    if (override.status === 'OUT') {
      // Preserve original rating for reversibility (UI can show "was rated 80")
      if (player._overrideOriginalRating === undefined) {
        player._overrideOriginalRating = player.rating;
      }
      player.rating = 0;
      player.injury = `OUT — ${override.reason || 'late scratch'} (Phase 73g override)`;
      player._overrideApplied = true;
      applied.push({
        seriesId: override.seriesId,
        playerName: override.playerName,
        originalRating: player._overrideOriginalRating,
        reason: override.reason,
        source: override.source || 'unsourced',
        appliedAt,
      });
    }
  });

  // Log to a global for audit/UI
  if (typeof globalThis !== 'undefined') {
    globalThis.__LINEUP_OVERRIDE_LOG = applied;
  }

  return { applied: applied.length, errors, list: applied };
}

// Render a banner string showing active overrides (UI helper). Empty
// string when no overrides are active.
function renderLineupOverrideBanner() {
  if (typeof globalThis === 'undefined' || !globalThis.__LINEUP_OVERRIDE_LOG) return '';
  const log = globalThis.__LINEUP_OVERRIDE_LOG;
  if (!log.length) return '';
  const items = log.map(o => `<strong>${o.playerName}</strong> (${o.seriesId}, rating ${o.originalRating} → 0)`).join(', ');
  return `<div style="background:rgba(245,158,11,0.08);border:1px solid #f59e0b;border-radius:8px;padding:10px 14px;margin-bottom:12px;font-size:12px;color:#fff;">
    <strong style="color:#f59e0b;">⚠ Late lineup overrides active:</strong> ${items}. Projections + MC sim updated to reflect these scratches. Source notes in <code>js/engine/lineup-overrides.js</code> LINEUP_OVERRIDES array.
  </div>`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LINEUP_OVERRIDES,
    applyLineupOverrides,
    renderLineupOverrideBanner,
  };
}
