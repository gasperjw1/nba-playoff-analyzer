// ============================================================
// PLAYER TENDENCIES ENGINE — Phase 60 (May 14, 2026)
// ============================================================
// Beyond the bare "is the player healthy" injury flag, three behavioral
// signals matter for predictions:
//
//   1. EXHAUSTION RISK — high cumulative minutes through a long series
//      degrade efficiency in Q3/Q4 and elevate soft-tissue injury risk.
//      LeBron at 41 with R1 6-game + R2 4-game = 11 games at 36+ min is
//      a different player than fresh.
//
//   2. INJURY-PRONE PROFILE — players with multi-year injury histories
//      (multiple sub-50-game seasons) carry elevated risk of mid-series
//      recurrence even when "healthy" pre-game.
//
//   3. TECHNICAL/EJECTION PROFILE — historical T+flagrant counts plus
//      recent emotional volatility (lots of Q-by-Q swings, opponent
//      physicality, elimination pressure) modulate the risk that a key
//      player gets ejected or T'd up at a costly moment.
//
// Output: each player gets a `tendencies` block:
//   {
//     exhaustionRisk: 0..1,
//     injuryProneRisk: 0..1,
//     techRisk:        0..1,
//     ejectionRisk:    0..1,
//     drivers: [<short string>],
//   }
//
// Used by:
//   - Bets-page bet card warnings ("⚠ Wemby techRisk 0.7 — flagrant
//     2 in G4, elimination G6 vs hostile crowd")
//   - Series Analysis injury panel (replacing the static `injury:` field)
//   - Player props bet selection — high tech/ejection risk = avoid
//     scoring overs that depend on full-game minutes
//
// Data inputs (all already in series-data.js):
//   - player.activeInjury.severity (current injury %)
//   - player.injuryRisk (preset 0-1 prior)
//   - player.age (older = higher exhaustion + soft-tissue)
//   - prior series box scores → cumulative minutes
//   - per-player history flags (manual: known technical-getter,
//     known fragile player, etc.)
//
// NOT YET modeled (deferred — needs better data plumbing):
//   - 6th-foul-out risk based on recent fouls/game
//   - Specific matchup volatility (Smart vs Embiid produces techs at 3x
//     league avg)

// ── EXHAUSTION RISK ──────────────────────────────────────────────────
// Per-game high-minute load + age curve. Plays Q4 burn-off into Q3 of
// next game.
function calcExhaustionRisk(player, series, gameIdx) {
  if (!player) return { value: 0, drivers: [] };
  const drivers = [];
  let risk = 0;

  // Cumulative minutes through this series so far (priorGame is best signal)
  const prior = (series.games || [])
    .slice(0, gameIdx)
    .filter(g => g.boxScores)
    .map(g => {
      const all = []
        .concat(g.boxScores.home || [])
        .concat(g.boxScores.away || []);
      const p = all.find(x => x.name && (x.name === player.name || player.name.includes(x.name.split('. ').pop())));
      return p && typeof p.min === 'number' ? p.min : 0;
    });
  const totalMin = prior.reduce((a, b) => a + b, 0);
  const gamesPlayed = prior.filter(m => m > 0).length;
  const avgMin = gamesPlayed ? totalMin / gamesPlayed : 0;

  if (avgMin >= 38) { risk += 0.30; drivers.push(`avg ${avgMin.toFixed(1)} min/game (heavy load)`); }
  else if (avgMin >= 35) { risk += 0.15; drivers.push(`avg ${avgMin.toFixed(1)} min/game (moderate load)`); }

  // Age curve — 32+ ramps quickly
  const age = player.age || (player.born ? 2026 - player.born : null);
  if (age) {
    if (age >= 38) { risk += 0.25; drivers.push(`age ${age} (severe age curve)`); }
    else if (age >= 35) { risk += 0.15; drivers.push(`age ${age} (age curve)`); }
    else if (age >= 32) { risk += 0.08; drivers.push(`age ${age} (mild age curve)`); }
  }

  // Active injury compounds exhaustion
  if (player.activeInjury && player.activeInjury.severity >= 0.3) {
    risk += 0.10 * player.activeInjury.severity;
    drivers.push(`active injury severity ${player.activeInjury.severity}`);
  }

  // Series length compounds — G5+ is where fatigue cliffs show up
  if (gameIdx >= 4) {
    risk += 0.08;
    drivers.push(`series past G5 (fatigue cliff range)`);
  }

  return { value: Math.min(1, +risk.toFixed(2)), drivers };
}

// ── INJURY-PRONE RISK ────────────────────────────────────────────────
// Soft-tissue recurrence (oblique, hamstring, ankle) and chronic-condition
// risk (LeBron foot, Embiid hip, Edwards knee). Distinct from current
// active injury — this is the BASELINE proneness.
function calcInjuryProneRisk(player, series, gameIdx) {
  if (!player) return { value: 0, drivers: [] };
  const drivers = [];
  let risk = 0;

  // Use the preset `injuryRisk` field if authored (0-1 prior)
  if (typeof player.injuryRisk === 'number') {
    risk += player.injuryRisk * 0.5;
    if (player.injuryRisk >= 0.4) drivers.push(`baseline injuryRisk ${player.injuryRisk} (chronic)`);
  }

  // Currently nursing an injury → recurrence risk
  if (player.activeInjury) {
    const sev = player.activeInjury.severity || 0;
    const type = (player.activeInjury.type || '').toLowerCase();
    risk += sev * 0.3;
    if (/hamstring|oblique|groin/.test(type)) {
      risk += 0.15;
      drivers.push(`soft-tissue (${type}) — high recurrence risk`);
    } else if (/ankle|knee|hip/.test(type)) {
      risk += 0.10;
      drivers.push(`joint (${type}) — flare-up risk`);
    }
  }

  // Age multiplier
  const age = player.age;
  if (age && age >= 35) { risk *= 1.15; drivers.push(`age ${age} amplifies recurrence`); }

  return { value: Math.min(1, +risk.toFixed(2)), drivers };
}

// ── TECHNICAL FOUL RISK ──────────────────────────────────────────────
// Based on regular-season T-count (if available) + matchup intensity.
// Without per-player T data we use behavioral flags authored on the
// player: `techProne` (0-1), `emotionalVolatility` (0-1). When neither
// exists, falls back to 0 (no signal).
function calcTechRisk(player, series, gameIdx) {
  if (!player) return { value: 0, drivers: [] };
  const drivers = [];
  let risk = 0;

  const techProne = player.techProne || 0;
  if (techProne >= 0.5) { risk += techProne * 0.4; drivers.push(`techProne flag ${techProne}`); }

  // Elimination/closeout games amplify everyone's tech risk
  const score = (series.games || []).reduce((acc, g) => {
    if (g.winner === series.homeTeam.abbr) acc.home++;
    else if (g.winner === series.awayTeam.abbr) acc.away++;
    return acc;
  }, { home: 0, away: 0 });
  const isElim = score.home === 3 || score.away === 3;
  if (isElim) { risk += 0.10; drivers.push('elimination game stakes'); }

  // Series tied / tight games at G5+ = high-tension territory
  if (gameIdx >= 4 && Math.abs(score.home - score.away) <= 1) {
    risk += 0.06;
    drivers.push('tight series at G5+ (high tension)');
  }

  return { value: Math.min(1, +risk.toFixed(2)), drivers };
}

// ── EJECTION RISK ────────────────────────────────────────────────────
// Subset of tech risk — flagrant 2 / second technical. Anchored by
// recent ejection history. Wemby's Flagrant 2 in SAS-MIN G4 sets the
// precedent; we don't (yet) auto-flag that, but the manual `recentlyEjected`
// flag on a player will multiply tech risk by 1.5.
function calcEjectionRisk(player, series, gameIdx) {
  if (!player) return { value: 0, drivers: [] };
  const drivers = [];
  const tech = calcTechRisk(player, series, gameIdx);
  let risk = tech.value * 0.4; // base: ~40% of tech risk
  if (player.recentlyEjected) { risk *= 1.5; drivers.push('recently ejected — elevated league scrutiny'); }
  if (player.flagrant2History && player.flagrant2History >= 1) {
    risk += 0.05 * player.flagrant2History;
    drivers.push(`${player.flagrant2History} prior flagrant 2(s)`);
  }
  return { value: Math.min(1, +risk.toFixed(2)), drivers: drivers.concat(tech.drivers) };
}

// ── BUNDLE ──────────────────────────────────────────────────────────
function calcPlayerTendencies(player, series, gameIdx) {
  const exhaustion = calcExhaustionRisk(player, series, gameIdx);
  const injury = calcInjuryProneRisk(player, series, gameIdx);
  const tech = calcTechRisk(player, series, gameIdx);
  const eject = calcEjectionRisk(player, series, gameIdx);
  return {
    exhaustionRisk: exhaustion.value,
    injuryProneRisk: injury.value,
    techRisk: tech.value,
    ejectionRisk: eject.value,
    drivers: {
      exhaustion: exhaustion.drivers,
      injury: injury.drivers,
      tech: tech.drivers,
      eject: eject.drivers,
    },
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calcPlayerTendencies,
    calcExhaustionRisk,
    calcInjuryProneRisk,
    calcTechRisk,
    calcEjectionRisk,
  };
}
