// ============================================================
// PLAYOFF RUN — COACH AI (Phase 2)
// ============================================================
// Profile-driven coaching decisions through the SAME decision surface the
// user gets (symmetric coaching — design law). Two parts:
//
// 1. EVIDENCE MODEL — the core. A coach adjusts to what they OBSERVED
//    (box scores), never to the opponent's settings. Each observation
//    updates a per-player estimate of the hidden series shift, with the
//    measured Bayesian asymmetry: duds carry ~2x the weight of spikes
//    (post-spike games run 113% of baseline, post-dud 73% — spikes are
//    mostly noise, duds are mostly structural). A coach's `adjust` trait
//    sets how disciplined their estimator is:
//      high adjust  → asymmetric-weighted running average (hard to bait)
//      low adjust   → overweights the LAST game + noise (baitable)
//    This is what makes decoy lineups a real, costed strategy instead of
//    an exploit (Bocskocsky: defenses re-allocate attention to hot
//    players; whether that's wise depends on the coach).
//
// 2. PLAN GENERATION — rotation (bench-leash minute shifts toward players
//    the coach believes are hot/cold) + coverage (double the opponent
//    scorer the coach believes is elevated). Doubling is a tradeoff, not
//    a buff: it suppresses the target but frees the opponent's other
//    scorers — punished against multi-initiator teams (DET-ORL G1 lesson
//    in the analyzer: 1-initiator teams are the valid double targets).
// ============================================================

const GAME_COACH_CONFIG = {
  spikeWeight: 0.33,          // credibility of an above-baseline observation
  dudWeight: 0.67,            // credibility of a below-baseline observation
  midWeight: 0.50,
  spikeBand: 1.15, dudBand: 0.85,
  doubleThreshold: 1.12,      // believed shift needed to commit a double
  doubleStarPpg: 24,          // ...or a star this big with a doubling-prone coach
  // Doubling mechanics (applied to the DOUBLED offense's capacity):
  doubleTargetShareMult: 0.75,
  doubleOrtgSingleInit: -1.2, // vs 1-initiator offense: the double works
  doubleOrtgMultiInit: +0.7,  // vs multi-initiator offense: it gets punished
  leashShiftPerPoint: 0.035,  // minutes fraction moved per benchLeash point
};

/** Fresh evidence log for one series, from one coach's point of view. */
function initCoachEvidence() {
  return { players: {} };   // name -> { est, weight, lastRatio, games }
}

/**
 * Ingest one game's opponent box score.
 * @param {Object} evidence   from initCoachEvidence (mutated)
 * @param {Array}  box        opponent player lines [{name, pts, min}]
 * @param {Object} oppTeam    GAME_TEAM_DB entry (for season baselines)
 */
function updateCoachEvidence(evidence, box, oppTeam) {
  const cfg = GAME_COACH_CONFIG;
  const byName = {};
  oppTeam.players.forEach(p => { byName[p.name] = p; });
  box.forEach(row => {
    const p = byName[row.name];
    if (!p || p.ppg < 5 || row.min < 12) return;
    const ratio = row.pts / p.ppg;
    const w = ratio >= cfg.spikeBand ? cfg.spikeWeight
      : ratio <= cfg.dudBand ? cfg.dudWeight
      : cfg.midWeight;
    const e = evidence.players[row.name] || { est: 1, weight: 1, lastRatio: 1, games: 0 };
    // Asymmetric-weighted running average anchored on the prior (est=1).
    e.est = (e.est * e.weight + ratio * w) / (e.weight + w);
    e.weight += w;
    e.lastRatio = ratio;
    e.games++;
    evidence.players[row.name] = e;
  });
}

/**
 * What THIS coach believes a player's current level is.
 * High-adjust coaches read the asymmetric estimator; low-adjust coaches
 * are pulled toward the last game they watched, plus noise.
 */
function coachShiftBelief(evidence, playerName, adjust, rng) {
  const e = evidence.players[playerName];
  if (!e) return 1;
  const discipline = Math.max(0, Math.min(1, (adjust || 5) / 10));
  const belief = e.est * discipline + e.lastRatio * (1 - discipline);
  const noise = rng ? gameNormal(rng, 0, (1 - discipline) * 0.08) : 0;
  return belief + noise;
}

/**
 * Generate a game plan for one side.
 * @returns { rotation, unavailable, fatigue, doubleTarget }
 */
function makeCoachPlan(team, oppTeam, ownEvidence, oppEvidence, gameState, rng) {
  const cfg = GAME_COACH_CONFIG;
  const prof = team.coach || { adjust: 5, doublesStars: 5, benchLeash: 5, rotationDepth: 9 };
  const out = new Set(gameState && gameState.unavailable || []);
  const pool = team.players.filter(p =>
    p.baseRating > 0 && p.initialStatus !== 'dnp' && !out.has(p.name));

  // Rotation: default, then bench-leash shifts by believed own-player form.
  // Discipline rules (solver-audit fix — the v1 leash cut minutes off ONE
  // dud, which made adaptive coaching value-destroying vs static plans):
  //   - never react to a single game (n>=2 evidence required — our own
  //     measured lesson about small samples)
  //   - top-2 talent is protected from downward shifts (coaches don't
  //     bench stars on cold stretches; duds persist, but a cold star
  //     still outranks a warm bench player)
  //   - conviction scales with both the belief gap and the sample size
  let rotation = gameDefaultRotation(pool, prof.rotationDepth);
  const leash = (prof.benchLeash || 5) * cfg.leashShiftPerPoint;
  const protectedNames = new Set(pool.slice().sort((a, b) => b.baseRating - a.baseRating)
    .slice(0, 2).map(p => p.name));
  let freed = 0;
  rotation.forEach(r => {
    if (r.minutes <= 0 || protectedNames.has(r.player.name)) return;
    const e = ownEvidence.players[r.player.name];
    if (!e || e.games < 2) return;
    const belief = coachShiftBelief(ownEvidence, r.player.name, prof.adjust, rng);
    if (belief < 0.85) {
      const conviction = Math.min(1, (0.85 - belief) / 0.15) * Math.min(1, e.games / 3);
      const cut = r.minutes * leash * conviction;
      r.minutes -= cut; freed += cut;
    }
  });
  if (freed > 0) {
    const hot = rotation.filter(r => {
      if (r.minutes <= 0) return false;
      const e = ownEvidence.players[r.player.name];
      return e && e.games >= 2 &&
        coachShiftBelief(ownEvidence, r.player.name, prof.adjust, rng) >= 1.05;
    });
    const pool2 = hot.length ? hot : rotation.filter(r => r.minutes > 0);
    pool2.forEach(r => { r.minutes += freed / pool2.length; });
  }

  // Coverage: double the opponent scorer this coach believes is elevated.
  let doubleTarget = null;
  let best = null, bestScore = 0;
  oppTeam.players.forEach(p => {
    if (p.ppg < 14 || p.initialStatus !== 'available') return;
    const belief = coachShiftBelief(oppEvidence, p.name, prof.adjust, rng);
    const score = belief * p.ppg;
    if (score > bestScore) { bestScore = score; best = { p, belief }; }
  });
  if (best) {
    const prone = (prof.doublesStars || 5);
    // Never volunteer to double a deep (3-initiator) offense — the
    // tradeoff is priced against it — unless the coach is an extreme
    // doubler by profile.
    const deepOffense = (oppTeam.initiators || 2) >= 3;
    if (!deepOffense || prone >= 8) {
      if ((best.belief >= cfg.doubleThreshold && prone >= 5) ||
          (best.p.ppg >= cfg.doubleStarPpg && prone >= 7)) {
        doubleTarget = best.p.name;
      }
    }
  }

  return {
    rotation,
    unavailable: [...out],
    fatigue: (gameState && gameState.fatigue) || {},
    doubleTarget,
  };
}

/**
 * Apply an opponent's double coverage to this offense's capacity:
 * target's share suppressed, everyone else renormalized up, team ORtg
 * moved by the initiator-count tradeoff.
 */
function applyDoubleCoverage(cap, targetName, offTeamInitiators) {
  if (!targetName) return cap;
  const cfg = GAME_COACH_CONFIG;
  const shares = cap.playerShares.map(s => ({
    ...s,
    ptsShare: s.player.name === targetName ? s.ptsShare * cfg.doubleTargetShareMult : s.ptsShare,
  }));
  const sum = shares.reduce((a, s) => a + s.ptsShare, 0);
  shares.forEach(s => { s.ptsShare /= sum; });
  const delta = (offTeamInitiators <= 1) ? cfg.doubleOrtgSingleInit : cfg.doubleOrtgMultiInit;
  return { ...cap, ortg: cap.ortg + delta, playerShares: shares };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GAME_COACH_CONFIG, initCoachEvidence, updateCoachEvidence,
    coachShiftBelief, makeCoachPlan, applyDoubleCoverage,
  };
}
