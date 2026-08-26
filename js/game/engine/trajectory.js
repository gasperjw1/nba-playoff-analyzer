// ============================================================
// PLAYOFF RUN — TRAJECTORY LAYER (Phase 1, Layer 3 of 3)
// ============================================================
// Quarter-by-quarter game flow + player box-line allocation.
//
// Margin walk: anti-persistent random walk with a restoring force toward
// tie (Gabel & Redner 2012; Clauset, Kogan & Redner 2015 — basketball
// scoring is a continuous-time ANTI-persistent walk). Within-game momentum
// exists here; cross-game momentum does not exist anywhere (measured r≈0).
//
// Capitulation: a Q4 lead beyond the safety threshold triggers bench-mode
// drift for the leader — garbage time EXTENDS blowouts. This is what
// produces the measured fat tail (12% of playoff games decided by 30+).
//
// Player allocation: team totals are allocated to players (never summed
// from independent player draws — possession accounting lives in the
// capacity layer). Noise is right-skewed lognormal with per-tier CVs
// (star .22 / mid .30 / role .49 — measured), times the player's hidden
// series-context shift (the persistent term behind the measured +0.33
// serial correlation vs season baseline).
// ============================================================

// ── Self-contained seeded RNG + samplers (mulberry32) ───────────
function gameCreateRNG(seed) {
  let s = (seed >>> 0) || 1;
  return function () {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gameNormal(rng, mean, sd) {
  let u1 = 0;
  while (u1 === 0) u1 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * rng());
  return (mean || 0) + z * (sd == null ? 1 : sd);
}

/** Mean-1, right-skewed multiplicative noise for a given CV (lognormal). */
function gameSkewNoise(rng, cv) {
  if (!cv) return 1;
  const s2 = Math.log(1 + cv * cv);
  return Math.exp(gameNormal(rng, -s2 / 2, Math.sqrt(s2)));
}

/** Round fractional allocations to integers that sum exactly to total. */
function gameLargestRemainder(values, total) {
  const floors = values.map(v => Math.max(0, Math.floor(v)));
  let used = floors.reduce((a, b) => a + b, 0);
  const order = values.map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  let k = 0;
  while (used < total && order.length) {
    floors[order[k % order.length].i] += 1;
    used++; k++;
  }
  while (used > total) {   // guard: strip from smallest-fraction positive cells
    const j = order[order.length - 1 - (k % order.length)].i;
    if (floors[j] > 0) { floors[j] -= 1; used--; }
    k++;
  }
  return floors;
}

// ── Quarter walk ────────────────────────────────────────────────
/**
 * @param {Object} exp     {home, away} expected scores (capacity layer)
 * @param {Object} regime  from sampleGameRegime
 * @param {Function} rng
 * @returns {homeScore, awayScore, quarters:[{home,away}], ot, capitulated}
 */
function simulateGameFlow(exp, regime, rng) {
  const cfg = GAME_CONFIG.trajectory;
  const expMargin = exp.home - exp.away;
  const totalNoise = gameNormal(rng, 0, cfg.totalNoiseSD);  // pace/shooting environment
  const quarters = [];
  let margin = 0, capitulated = 0;

  for (let q = 1; q <= 4; q++) {
    let mDelta = expMargin / 4 + regime.drift / 4
      - cfg.restoringK * margin
      + gameNormal(rng, 0, cfg.quarterSD);
    if (q === 4 && Math.abs(margin) >= cfg.capitulationLead) {
      if (rng() < cfg.capitulationProb) {
        mDelta += Math.sign(margin) * Math.max(0, gameNormal(rng, cfg.capitulationDrift, 3));
        capitulated = Math.sign(margin);
      } else {
        mDelta -= margin * cfg.comebackCompress;   // the trailing side makes a run
      }
    }
    const qTotal = (exp.home + exp.away) / 4 + totalNoise / 4 + gameNormal(rng, 0, 2.5);
    quarters.push({
      home: Math.max(8, Math.round((qTotal + mDelta) / 2)),
      away: Math.max(8, Math.round((qTotal - mDelta) / 2)),
    });
    margin += mDelta;
  }

  let homeScore = quarters.reduce((a, x) => a + x.home, 0);
  let awayScore = quarters.reduce((a, x) => a + x.away, 0);

  // Overtime until untied (playoff OTs beyond 2 are rare; the sampler's
  // spread makes repeated exact ties vanishingly unlikely).
  let ot = 0;
  while (homeScore === awayScore) {
    ot++;
    const h = Math.max(2, Math.round(gameNormal(rng, cfg.otMean, cfg.otSD)));
    let a = Math.max(2, Math.round(gameNormal(rng, cfg.otMean, cfg.otSD)));
    if (h === a) a += rng() < 0.55 ? -1 : 1;   // slight home OT edge
    quarters.push({ home: h, away: a });
    homeScore += h; awayScore += a;
  }

  return { homeScore, awayScore, quarters, ot, capitulated };
}

// ── Player box allocation ───────────────────────────────────────
/**
 * Weighted integer allocation with PER-PLAYER CAPS: clip anyone whose
 * share exceeds his cap, renormalize the rest, repeat; distribute the
 * uncapped remainder by largest remainder. The physical-plausibility
 * layer (user playtest caught 29 pts in 12 minutes).
 */
function gameCappedAllocate(weights, caps, total) {
  const n = weights.length;
  const out = new Array(n).fill(0);
  const capped = new Array(n).fill(false);
  let remaining = total;
  for (let pass = 0; pass < 8; pass++) {
    const wSum = weights.reduce((a, w, i) => a + (capped[i] ? 0 : w), 0);
    if (wSum <= 0) break;
    let newCap = false;
    weights.forEach((w, i) => {
      if (capped[i]) return;
      if (w / wSum * remaining > caps[i]) {
        out[i] = caps[i]; capped[i] = true; remaining -= caps[i]; newCap = true;
      }
    });
    if (!newCap) break;
  }
  const idx = weights.map((w, i) => i).filter(i => !capped[i]);
  if (idx.length) {
    const wSum = idx.reduce((a, i) => a + weights[i], 0) || 1;
    const ints = gameLargestRemainder(idx.map(i => weights[i] / wSum * remaining), Math.max(0, Math.round(remaining)));
    idx.forEach((i, k) => { out[i] = ints[k]; });
  } else if (remaining > 0) {
    out[caps.indexOf(Math.max(...caps))] += Math.round(remaining);  // degenerate fallback
  }
  return out;
}

/**
 * Allocate a team's final totals down to player lines.
 * @param {Object} cap        capacity output for this team
 * @param {number} teamScore  final points to distribute
 * @param {Object} opts       { shifts, garbage, otMinutes, starters }
 */
function allocateBox(cap, teamScore, rng, opts) {
  opts = opts || {};
  const shifts = opts.shifts || {};
  const cfg = GAME_CONFIG;
  const rows = cap.playerShares;
  const starterCut = (opts.starters && opts.starters.length === 5)
    ? opts.starters
    : rows.slice().sort((a, b) => b.minutes - a.minutes).slice(0, 5).map(r => r.player.name);
  const isStarter = new Set(starterCut);

  // Final minutes first (stat caps derive from them): garbage time trims
  // starters and hands those minutes to the bench so the box still sums
  // to ~240 (+25/OT); OT minutes go to the starters.
  const otMin = opts.otMinutes || 0;
  const finalMin = rows.map(r => r.minutes);
  if (opts.garbage) {
    let trimmed = 0;
    const benchIdx = [];
    rows.forEach((r, i) => {
      if (isStarter.has(r.player.name)) { trimmed += finalMin[i] * 0.07; finalMin[i] *= 0.93; }
      else if (finalMin[i] > 0) benchIdx.push(i);
    });
    benchIdx.forEach(i => {
      finalMin[i] = Math.min(GAME_CONFIG.maxPlayerMinutes, finalMin[i] + trimmed / (benchIdx.length || 1));
    });
  }
  rows.forEach((r, i) => { if (isStarter.has(r.player.name)) finalMin[i] += otMin; });

  const noisy = rows.map(r => {
    const tier = cfg.tiers[r.player.tier];
    let w = r.ptsShare
      * (shifts[r.player.name] || 1)
      * gameSkewNoise(rng, tier.noiseCV * cfg.cvInflate);
    // Garbage time: starters sit, bench eats (extends the box-score gap
    // between blowout and competitive games — Phase 73o's observed pattern).
    if (opts.garbage) w *= isStarter.has(r.player.name) ? 0.90 : 1.22;
    return w;
  });
  const pts = gameCappedAllocate(noisy, finalMin.map(m => Math.floor(m * cfg.ptsPerMinCap)), teamScore);

  // Team rebounds/assists: plausible totals, allocated by shares.
  const rebTotal = Math.max(28, Math.round(gameNormal(rng, 43, 4)));
  const astTotal = Math.max(12, Math.round(teamScore * 0.25 + gameNormal(rng, 0, 2.5)));
  const rebW = rows.map(r => r.rebShare * gameSkewNoise(rng, cfg.rebCV));
  const astW = rows.map(r => r.astShare * gameSkewNoise(rng, cfg.astCV));
  const reb = gameCappedAllocate(rebW, finalMin.map(m => Math.floor(m * cfg.rebPerMinCap)), rebTotal);
  const ast = gameCappedAllocate(astW, finalMin.map(m => Math.floor(m * cfg.astPerMinCap)), astTotal);

  return rows.map((r, i) => ({
    name: r.player.name,
    tier: r.player.tier,
    min: Math.round(finalMin[i]),
    pts: pts[i], reb: reb[i], ast: ast[i],
  }));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { gameCreateRNG, gameNormal, gameSkewNoise, gameLargestRemainder, simulateGameFlow, allocateBox };
}
