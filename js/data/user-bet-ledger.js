// ============================================================
// USER BET LEDGER — Phase 73n (May 24, 2026)
// ============================================================
// User-placed parlays + outcomes, distinct from FEATURED_PARLAYS
// (which is daily-routine-authored marketing material) and from
// CHS_LAB_LEDGER (which is the algorithm's own picks).
//
// Purpose:
//   1. Track real money placed: rolling W-L + P&L + ROI.
//   2. A/B comparison against the algorithm (chs-lab-ledger).
//   3. Long-term feedback signal: when user diverges from the
//      algorithm and still wins, that's a calibration signal —
//      after 30+ user bets, the algorithm can use the user's edge
//      patterns to shift its confidence on similar legs.
//
// Schema per entry:
//   {
//     id:          'user-2026-05-24-001'   (caller-provided or generated)
//     date:        'YYYY-MM-DD'            (game date)
//     loggedAt:    ISO8601                  (when entered)
//     series:      'OKC-SAS'                (primary series)
//     game:        4                        (primary game number)
//     type:        'parlay' | 'single'
//     source:      'chs-lab' | 'chs-lab-modified' | 'manual-thesis'
//     inspiredBy:  'OKC-SAS-G4-2026-05-24' | null
//                  (back-ref to a CHS_LAB_LEDGER entry by date+series+game)
//     stake:       50                       (dollars)
//     americanOdds: +350                    (what the book actually offered)
//     legs: [
//       {
//         player:           'Victor Wembanyama',
//         stat:             'pra',
//         line:             26.5,
//         direction:        'over' | 'under',
//         odds:             -110              (per-leg juice)
//         fromCandidate:    true | false      (was this leg in CHS Lab's
//                                              candidate list at log time?)
//         candidateHitRate: 0.81 | null       (MC's marginal estimate if known)
//         note:             'must-win volume bump' (optional thesis note),
//         hit:              null | true | false  (filled on settle)
//         actualValue:      null | <number>      (filled on settle)
//       },
//       ...
//     ],
//     notes:        'starter-only, both teams strategy',
//     result: null | {
//       outcome:   'win' | 'loss' | 'push',
//       pnl:       <number>                  (signed; +profit on win, -stake on loss)
//       settledAt: ISO8601,
//     }
//   }
//
// Lifecycle:
//   1. Log (when bet is placed): test-user-bet-log.js --add bet.json
//      → appends a new entry with result=null
//   2. Settle (after game): test-user-bet-log.js --settle
//      → fills in legs[].hit + legs[].actualValue + result for entries
//        whose game now has a winner in SERIES_DATA
//   3. Report: test-user-bet-log.js --report
//      → rolling P&L + per-source breakdown + comparison vs algorithm
//
// Validators (TEST 30): schema integrity + settled-outcome consistency.
// Boot-time validator surfaces issues in the red banner.
// ============================================================

const USER_BET_LEDGER = [
  // Entries appended via test-user-bet-log.js --add.
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_BET_LEDGER };
}
