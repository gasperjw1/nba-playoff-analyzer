// PHASE 17 UPDATE (Morgulev et al. 2022): Analysis of one-sided elimination games shows
// teams "with their back to the wall" produce measurably different performance.
// Bühren & Krabel (2021, 10 citations): Performance after success/failure shows
// context-dependent momentum effects in NBA play-by-play data.
function calcBounceBackProb(series) {
  const round = series.round || 'R1';
  const roundMod = { 'R1': 1.0, 'R2': 0.7, 'CF': 0.5, 'Finals': 0.4 };
  const base = 0.77; // 77% baseline from 2021-22 data
  let prob = base * (roundMod[round] || 1.0);
  const awaySystem = series.awayTeam.systemBonus || 0;
  const homeSystem = series.homeTeam.systemBonus || 0;
  prob -= Math.max(0, awaySystem - homeSystem) * 0.05;
  // Morgulev et al.: elimination pressure can OVERRIDE bounce-back tendency
  // When a team is down 2-0 or 3-1, the trailing team's desperation partially
  // cancels the leading team's "expected" bounce-back advantage
  const score = getSeriesScore(series);
  const seriesDiff = Math.abs(score.home - score.away);
  if (seriesDiff >= 2) prob -= 0.05; // large series lead reduces bounce-back
  return Math.min(0.85, Math.max(0.35, prob));
}

// Underdog explosion game estimate (how many games the underdog "gets" in a series)
// PHASE 14 — Defensive Matchup Suppression
// When an elite defender is tasked on the opponent's primary initiator AND that
// initiator has limited secondary creation support, the defensive impact is amplified.
// Validated by BOS-PHI G1: White (D-LEBRON 2.324) on Maxey (sole initiator) → 20pts on 8/20.
// defMatchups.homeDefOnAway = home team's best defender assigned to away team's #1 creator
// defMatchups.awayDefOnHome = away team's best defender assigned to home team's #1 creator
function calcDefMatchupSuppression(matchup, targetInitiators) {
  if (!matchup || matchup.dLebron == null) return 0;
  const defQuality = Math.max(0, matchup.dLebron); // only positive D-LEBRON counts as suppression
  const targetDependency = (matchup.targetUsg || 25) / 30; // normalize USG% — higher usage = bigger impact
  // Initiator penalty: solo initiator means defense can fully commit (1.5x),
  // 2 initiators = standard (1.0x), 3+ = diluted effect (0.7x)
  const initiatorPenalty = targetInitiators <= 1 ? 1.5 : (targetInitiators === 2 ? 1.0 : 0.7);
  return defQuality * targetDependency * initiatorPenalty * 0.3;
}
