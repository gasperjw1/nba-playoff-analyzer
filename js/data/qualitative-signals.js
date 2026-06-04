// ============================================================
// QUALITATIVE SIGNALS — user-observed reads boxScores can't capture
// ============================================================
// Why this exists: boxScores give us totals (Wemby 26pts/12reb) but
// not crucial context (3 back-to-back missed clutch attempts at 94-89).
// The Fatigue/Coaching/Momentum agents need this context to assess the
// NEXT game properly. User adds signals after each game via observation.
//
// Schema per signal:
//   series         : 'SAS-NYK'                — series id
//   game           : 1                        — which game observed
//   subject        : 'Victor Wembanyama'      — player or 'TEAM:SAS' or 'COACH:Brown'
//   signal         : 'q4-fatigue'             — typed code from SIGNAL_CODES below
//   evidence       : 'three back-to-back misses at 94-89...'  — human description
//   severity       : 0..1                     — how strong the signal is (0=trivial, 1=blatant)
//   nextGameImplication: 'wemby-pra-cap'      — typed code agents key on
//   loggedBy       : 'user' | 'auto'          — who recorded it
//   timestamp      : ISO date
//
// Signal codes (extend as needed):
//   q4-fatigue            — late-game shot quality collapse from minute load
//   foul-trouble-risk     — player accumulating fouls, minute restriction looming
//   confidence-up         — player in clear rhythm, expect usage bump next game
//   confidence-down       — player visibly shaken, expect role contraction
//   coach-adjustment-stuck— in-game adjustment broke and coach didn't counter
//   bench-rotation-cap    — backup/bench player exposed, rotation tightened
//   matchup-broken        — defensive scheme failed in real time (e.g. Castle outmuscled)
// ============================================================

const QUALITATIVE_SIGNALS = [
  {
    series: 'SAS-NYK',
    game: 1,
    subject: 'Victor Wembanyama',
    signal: 'q4-fatigue',
    evidence: 'Three back-to-back-to-back missed shots when score was 94-89 (NYK +5). Only Q4 make after that stretch was a pair of free throws. Costly turnover at 99-95. Final line 6-21 FG / 6 TOs — but the data hid that the WORST stretch came in clutch minutes when fatigue compounds with pressure.',
    severity: 0.85,
    nextGameImplication: 'wemby-clutch-cap',
    loggedBy: 'user',
    timestamp: '2026-06-04',
  },
  // Future entries appended here. Daily routine should prompt for observed signals
  // after each game's box score is settled.
];

// Index signals by series → game → subject for fast agent lookup
function getQualitativeSignals(seriesId, gameNum) {
  return QUALITATIVE_SIGNALS.filter(s => s.series === seriesId && s.game === gameNum);
}

function getSignalsForSubject(seriesId, subject, throughGame) {
  return QUALITATIVE_SIGNALS.filter(s =>
    s.series === seriesId &&
    s.subject === subject &&
    (throughGame === undefined || s.game <= throughGame)
  );
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUALITATIVE_SIGNALS, getQualitativeSignals, getSignalsForSubject };
}
