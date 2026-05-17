// ============================================================
// RISK CONTROLS — Phase 69 (May 16, 2026)
// ============================================================
// Three pure helpers that prevent the "big loss" failure modes the
// Phase 68 retro didn't catch directly. Edge-detector says SKIP/PLACE
// on individual bets; risk-controls operates on the SLATE level (all
// of today's bets) and on STAKE SIZING.
//
//   1. analyzeSlateConcentration(bets)
//      Groups today's bets by "directional exposure" — e.g. "NYK wins
//      by 8+" — and flags when too many bets ride on a single outcome.
//      Real-world risk: NYK loses outright → 5 NYK bets all bust at
//      once. Cap is opts.maxPerDirection (default 3).
//
//   2. shouldSuppressScoringProp(simResult, player, team, role)
//      MC sims output a `blowoutRisk` (P(|margin| ≥ 18)). When that's
//      high, scoring props become unreliable: in a blowout, the
//      underdog's stars get pulled (their pts cap out), and the
//      favorite's bench eats garbage-time minutes that inflate the
//      LOSING team's role player scoring. Auto-skip these.
//
//   3. recommendStake(bankroll, edgeResult, opts)
//      Kelly-fraction sizing: bigger edge → bigger stake; small edge →
//      tiny stake. Capped at quarter-Kelly (0.25) and an absolute
//      max-per-bet so a "found edge" doesn't blow up bankroll.
//
// All three are pure (no state, no globals beyond input). The UI calls
// them; nothing in the engine relies on them being run.
// ============================================================

// ── Directional-exposure key ────────────────────────────────────────
// Maps a bet to a SHORT key describing the game-script outcome the bet
// needs. Bets with the same key are perfectly correlated (they win or
// lose together). Bets with related keys (e.g. "NYK ML" and "NYK -7.5")
// are correlated but not identical.
//
// Returns one of:
//   `${team}_ML`         — team to win outright
//   `${team}_COVER`      — team to cover a positive number (favorite)
//   `${team}_KEEP`       — team gets points (underdog covers)
//   `${seriesId}_OVER`   — game total over
//   `${seriesId}_UNDER`  — game total under
//   `${player}_OVER`     — player's stat over (correlated to that
//                          player having a good game, not directly to
//                          either team winning)
//   `${player}_UNDER`    — player's stat under
//   null                 — unclassifiable bet (no concentration weight)
function _directionalKey(bet) {
  if (!bet || !bet.type) return null;
  const t = bet.type;
  if (t === 'ml') {
    // Pick text like "NYK ML vs PHI" — extract first token
    const m = (bet.pick || '').match(/^([A-Z]{2,4})\b/);
    return m ? `${m[1]}_ML` : null;
  }
  if (t === 'spread') {
    const m = (bet.pick || '').match(/^([A-Z]{2,4})\s*([+-]?\d+(?:\.\d+)?)/);
    if (!m) return null;
    const sign = parseFloat(m[2]);
    return sign < 0 ? `${m[1]}_COVER` : `${m[1]}_KEEP`;
  }
  if (t === 'total') {
    const dir = /over|o\s*\d/i.test(bet.pick || '') ? 'OVER' : 'UNDER';
    return `${bet.series || 'GAME'}_${dir}`;
  }
  if (t === 'prop') {
    // Extract player name (everything before " Over " or " Under ").
    // Word-boundary approach avoids the [^OU] trap (lowercase 'o'/'u' in
    // names like "Brunson" would be excluded under /i flag).
    const m = (bet.pick || '').match(/^(.+?)\s+(Over|Under)\b/i);
    if (!m) return null;
    return `${m[1].trim()}_${m[2].toUpperCase()}`;
  }
  return null;
}

// ── analyzeSlateConcentration ─────────────────────────────────────────
// Given today's candidate bet list, group by directional key and report
// the top exposures + warnings.
//
// Returns:
//   {
//     byDirection: { 'NYK_ML': [bets], 'NYK_COVER': [bets], ... },
//     topExposures: [{ key, count, stakeAt25 }, ... sorted desc],
//     warnings: [{ key, count, reason }],
//     safe: boolean
//   }
function analyzeSlateConcentration(bets, opts) {
  opts = opts || {};
  const maxPerDirection = opts.maxPerDirection != null ? opts.maxPerDirection : 3;
  const maxPerTeam = opts.maxPerTeam != null ? opts.maxPerTeam : 5;
  const stake = opts.stake || 25;

  const byDirection = {};
  const byTeam = {};
  if (!Array.isArray(bets)) return { byDirection, topExposures: [], warnings: [], safe: true };
  for (const b of bets) {
    const key = _directionalKey(b);
    if (!key) continue;
    byDirection[key] = byDirection[key] || [];
    byDirection[key].push(b);
    const teamMatch = key.match(/^([A-Z]{2,4})_/);
    if (teamMatch) {
      const t = teamMatch[1];
      byTeam[t] = byTeam[t] || [];
      byTeam[t].push(b);
    }
  }

  const topExposures = Object.entries(byDirection)
    .map(([key, b]) => ({ key, count: b.length, stakeAt25: b.length * stake }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const warnings = [];
  Object.entries(byDirection).forEach(([key, b]) => {
    if (b.length > maxPerDirection) {
      warnings.push({
        key, count: b.length, reason: `>${maxPerDirection} bets on same directional outcome`,
        bets: b.map(x => x.id || x.pick),
      });
    }
  });
  Object.entries(byTeam).forEach(([team, b]) => {
    if (b.length > maxPerTeam) {
      warnings.push({
        key: team + '_*', count: b.length, reason: `>${maxPerTeam} bets tied to ${team}`,
        bets: b.map(x => x.id || x.pick),
      });
    }
  });

  return {
    byDirection,
    byTeam,
    topExposures,
    warnings,
    safe: warnings.length === 0,
  };
}

// ── shouldSuppressScoringProp ────────────────────────────────────────
// Given an MC simResult + a player + their team's role in the matchup,
// returns { suppress:true/false, reason } indicating whether the
// scoring over for this player is unreliable due to blowout risk.
//
// Heuristics (data-grounded — Phase 62 retro found scoring overs were
// the worst-performing prop class in blowout games):
//
//   blowoutRisk > 0.35 AND player is on the UNDERDOG (their stars get
//   pulled in Q4 → can't reach their scoring line)
//      → SUPPRESS
//
//   blowoutRisk > 0.35 AND player is on the FAVORITE AND a STARTER
//   (rating >= 75) (favorite's starters sit Q4 → can't reach high
//   scoring line)
//      → SUPPRESS
//
// FAVORITE bench/role players (rating 60-74) can actually OVER on
// scoring in blowouts due to garbage time → DON'T suppress those.
//
// Returns { suppress: false } for non-scoring stats (reb, ast, etc.)
// which are blowout-stable (rebounds happen on every possession; minutes
// drive both).
function shouldSuppressScoringProp(simResult, player, opts) {
  opts = opts || {};
  if (!simResult || !player) return { suppress: false, reason: 'no-sim-or-player' };
  const stat = opts.stat || 'pts';
  if (stat !== 'pts' && stat !== 'pra') return { suppress: false, reason: 'non-scoring-stat' };

  const blowoutRisk = simResult.blowoutRisk || 0;
  const blowoutThreshold = opts.blowoutThreshold != null ? opts.blowoutThreshold : 0.35;
  if (blowoutRisk < blowoutThreshold) {
    return { suppress: false, reason: 'low-blowout-risk', blowoutRisk };
  }

  const team = opts.team;          // 'home' or 'away'
  const homeWin = simResult.homeWinProb;
  const isFavorite = (team === 'home' && homeWin > 0.55) || (team === 'away' && homeWin < 0.45);
  const isUnderdog = (team === 'home' && homeWin < 0.45) || (team === 'away' && homeWin > 0.55);
  const rating = player.rating || 0;
  const isStarter = rating >= 75;

  if (isUnderdog) {
    return {
      suppress: true,
      reason: 'underdog-stars-pulled-in-blowout',
      blowoutRisk,
      explain: `Blowout risk ${(blowoutRisk*100).toFixed(0)}%. ${player.name || 'Player'} on losing side will be pulled in Q4 — scoring over unreliable.`,
    };
  }
  if (isFavorite && isStarter) {
    return {
      suppress: true,
      reason: 'favorite-starter-sits-in-blowout',
      blowoutRisk,
      explain: `Blowout risk ${(blowoutRisk*100).toFixed(0)}%. ${player.name || 'Player'} on winning side will sit Q4 — scoring over unreliable.`,
    };
  }
  return {
    suppress: false,
    reason: 'role-player-may-pad-garbage-time',
    blowoutRisk,
    explain: 'Bench/role player on winning side may actually benefit from garbage-time minutes.',
  };
}

// ── recommendStake — Kelly-fraction sizing ────────────────────────────
// Translates edge-detector's kellyFraction into a recommended $ stake
// given bankroll. Bounded:
//
//   Minimum stake floor (opts.minStake) — Kelly can recommend $0.50;
//   either bet a reasonable min ($5) or don't bet at all.
//
//   Maximum stake cap (opts.maxStake or 5% of bankroll) — even at
//   extreme edge, never risk more than this on a single bet.
//
//   Below-floor handling: if Kelly says <minStake, return SKIP unless
//   opts.forcePlace is true (then return minStake).
//
// Returns:
//   {
//     recommendedStake: number,    // $ to bet
//     kellyStake: number,          // raw Kelly amount (for transparency)
//     fraction: number,            // kellyFraction (0-0.25)
//     verdict: 'BET' | 'SKIP_LOW_EDGE' | 'CAP_HIT',
//     explain: string,
//   }
function recommendStake(bankroll, edgeResult, opts) {
  opts = opts || {};
  const minStake = opts.minStake != null ? opts.minStake : 5;
  const maxStakeAbs = opts.maxStake != null ? opts.maxStake : Math.round(bankroll * 0.05);

  if (!edgeResult || edgeResult.kellyFraction == null || edgeResult.kellyFraction <= 0) {
    return {
      recommendedStake: 0,
      kellyStake: 0,
      fraction: 0,
      verdict: 'SKIP_NO_EDGE',
      explain: 'No positive edge — Kelly says do not bet.',
    };
  }

  const kellyStake = +(bankroll * edgeResult.kellyFraction).toFixed(2);
  if (kellyStake < minStake) {
    if (opts.forcePlace) {
      return {
        recommendedStake: minStake,
        kellyStake,
        fraction: edgeResult.kellyFraction,
        verdict: 'BET_MIN',
        explain: `Kelly recommends $${kellyStake.toFixed(2)} — below minimum, betting floor of $${minStake}.`,
      };
    }
    return {
      recommendedStake: 0,
      kellyStake,
      fraction: edgeResult.kellyFraction,
      verdict: 'SKIP_LOW_EDGE',
      explain: `Kelly recommends $${kellyStake.toFixed(2)} (<$${minStake} floor). Skip — edge too small to bother.`,
    };
  }
  if (kellyStake > maxStakeAbs) {
    return {
      recommendedStake: maxStakeAbs,
      kellyStake,
      fraction: edgeResult.kellyFraction,
      verdict: 'CAP_HIT',
      explain: `Kelly recommends $${kellyStake.toFixed(2)} — capped at $${maxStakeAbs} (5% of $${bankroll} bankroll).`,
    };
  }
  return {
    recommendedStake: kellyStake,
    kellyStake,
    fraction: edgeResult.kellyFraction,
    verdict: 'BET',
    explain: `Kelly: bet $${kellyStake.toFixed(2)} (${(edgeResult.kellyFraction*100).toFixed(1)}% of $${bankroll} bankroll).`,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeSlateConcentration,
    shouldSuppressScoringProp,
    recommendStake,
    _directionalKey,
  };
}
