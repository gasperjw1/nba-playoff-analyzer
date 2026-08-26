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

// ── Segment walk (steppable — Phase 3.1) ────────────────────────
/**
 * Open a game-flow session. The game is stepped one SEGMENT at a time
 * (8 six-minute segments + 5-minute OT segments) so timeouts and the
 * halftime adjustment have real intervention points. simulateGameFlow
 * wraps this for every headless path.
 *
 * @param {Object} exp     {home, away} expected scores (capacity layer)
 * @param {Object} regime  from sampleGameRegime
 * @param {Function} rng
 */
function openGameFlow(exp, regime, rng) {
  const cfg = GAME_CONFIG.trajectory;
  return {
    exp, regime,
    expH2: null,                       // set by a halftime adjustment
    totalNoise: gameNormal(rng, 0, cfg.totalNoiseSD),
    segIdx: 0, margin: 0,
    segments: [],                      // {home, away, ot?, timeout?}
    capitulated: 0, capRolled: false,
    timeoutPending: { home: false, away: false },
    budgets: { home: GAME_CONFIG.timeout.budget, away: GAME_CONFIG.timeout.budget },
    ot: 0, done: false,
  };
}

/**
 * Call a timeout for one side: consumes budget, damps the drift running
 * against the caller for the NEXT segment (see GAME_CONFIG.timeout).
 * Returns false if no budget / game over / already pending.
 */
function callGameTimeout(flow, side) {
  if (flow.done || flow.budgets[side] <= 0 || flow.timeoutPending[side]) return false;
  flow.budgets[side]--;
  flow.timeoutPending[side] = true;
  return true;
}

/** Play the next segment (regulation or OT). Returns the segment row. */
function stepGameFlow(flow, rng) {
  if (flow.done) return null;
  const cfg = GAME_CONFIG.trajectory;
  const S = cfg.segments;

  if (flow.segIdx < S) {
    // Second half may run on a revised expectation (halftime adjustment).
    const exp = (flow.segIdx >= S / 2 && flow.expH2) ? flow.expH2 : flow.exp;
    let drift = (exp.home - exp.away) / S + flow.regime.drift / S;
    let restoreK = cfg.restoringK;

    // Timeouts: damp drift running against the caller + extra restoring.
    const toCfg = GAME_CONFIG.timeout;
    let timeoutBy = null;
    ['home', 'away'].forEach(side => {
      if (!flow.timeoutPending[side]) return;
      timeoutBy = timeoutBy ? 'both' : side;
      const sign = side === 'home' ? 1 : -1;
      if (drift * sign < 0) drift *= (1 - toCfg.driftDamp);
      restoreK += toCfg.restoreBoost;
      flow.timeoutPending[side] = false;
    });

    const sc = exp.sigmaScale || 1;   // pace posture: noise ~ sqrt(possessions)
    let mDelta = drift - restoreK * flow.margin + gameNormal(rng, 0, cfg.segSD * sc);

    // Capitulation window: entering the final two segments.
    if (flow.segIdx === S - 2 && !flow.capRolled) {
      flow.capRolled = true;
      if (Math.abs(flow.margin) >= cfg.capitulationLead) {
        flow.capitulated = (rng() < cfg.capitulationProb) ? Math.sign(flow.margin) : 0;
        if (!flow.capitulated) flow.comeback = true;
      }
    }
    if (flow.segIdx >= S - 2) {
      if (flow.capitulated) {
        mDelta += flow.capitulated * Math.max(0, gameNormal(rng, cfg.capitulationDrift / 2, 2));
      } else if (flow.comeback) {
        mDelta -= flow.margin * (cfg.comebackCompress / 2);
      }
    }

    const segTotal = (exp.home + exp.away) / S + flow.totalNoise / S +
      gameNormal(rng, 0, cfg.segTotalNoise * sc);
    const seg = {
      home: Math.max(4, Math.round((segTotal + mDelta) / 2)),
      away: Math.max(4, Math.round((segTotal - mDelta) / 2)),
    };
    if (timeoutBy) seg.timeout = timeoutBy;
    flow.segments.push(seg);
    flow.margin += mDelta;
    flow.segIdx++;
  } else {
    // Overtime segment (5 min) — only reached when tied.
    flow.ot++;
    const h = Math.max(2, Math.round(gameNormal(rng, cfg.otMean, cfg.otSD)));
    let a = Math.max(2, Math.round(gameNormal(rng, cfg.otMean, cfg.otSD)));
    if (h === a) a += rng() < 0.55 ? -1 : 1;   // slight home OT edge
    flow.segments.push({ home: h, away: a, ot: flow.ot });
    flow.segIdx++;
  }

  const homeScore = flow.segments.reduce((x, s) => x + s.home, 0);
  const awayScore = flow.segments.reduce((x, s) => x + s.away, 0);
  if (flow.segIdx >= S && homeScore !== awayScore) flow.done = true;
  return flow.segments[flow.segments.length - 1];
}

/** True when the flow sits at the halftime boundary. */
function atHalftime(flow) {
  return flow.segIdx === GAME_CONFIG.trajectory.segments / 2 && !flow.expH2 && !flow.halftimePassed;
}

/** Totals + display quarters (segment pairs; OT segments stay whole). */
function closeGameFlow(flow) {
  const S = GAME_CONFIG.trajectory.segments;
  const quarters = [];
  for (let i = 0; i < S; i += 2) {
    quarters.push({
      home: flow.segments[i].home + flow.segments[i + 1].home,
      away: flow.segments[i].away + flow.segments[i + 1].away,
    });
  }
  flow.segments.slice(S).forEach(s => quarters.push({ home: s.home, away: s.away }));
  const homeScore = flow.segments.reduce((x, s) => x + s.home, 0);
  const awayScore = flow.segments.reduce((x, s) => x + s.away, 0);
  return { homeScore, awayScore, quarters, segments: flow.segments,
    ot: flow.ot, capitulated: flow.capitulated,
    h1: { home: flow.segments.slice(0, S / 2).reduce((x, s) => x + s.home, 0),
          away: flow.segments.slice(0, S / 2).reduce((x, s) => x + s.away, 0) } };
}

/**
 * Headless game flow: steps every segment, auto-calling CPU timeouts for
 * both sides (a side that just lost a segment by the run threshold, with
 * the drift against it, spends one). The interactive path drives the same
 * stepper with the user's side under manual control.
 */
function simulateGameFlow(exp, regime, rng) {
  const flow = openGameFlow(exp, regime, rng);
  while (!flow.done) {
    if (atHalftime(flow)) flow.halftimePassed = true;   // no adjustment, play on
    gameCpuTimeouts(flow, null);
    stepGameFlow(flow, rng);
  }
  return closeGameFlow(flow);
}

/** CPU timeout heuristic for every side except `userSide` (null = both). */
function gameCpuTimeouts(flow, userSide) {
  if (!flow.segments.length || flow.segIdx >= GAME_CONFIG.trajectory.segments) return;
  const last = flow.segments[flow.segments.length - 1];
  const segMargin = last.home - last.away;
  const th = GAME_CONFIG.timeout.cpuRunThreshold;
  ['home', 'away'].forEach(side => {
    if (side === userSide) return;
    const sign = side === 'home' ? 1 : -1;
    const driftAgainst = flow.regime.drift * sign < 0;
    if (segMargin * sign <= -th && driftAgainst) callGameTimeout(flow, side);
  });
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
 * PER-GAME FORM: each player's multiplicative noise (times his hidden
 * series shift) is drawn ONCE per game and shared by both halves — the
 * "how he shoots tonight" factor. Splitting allocation into halves with
 * independent noise would shrink the calibrated per-game CVs by √2; a
 * shared form draw preserves them. Draws lazily (halftime lineup changes
 * can introduce new names) in row order for determinism.
 */
function drawGameForm(capRows, rng, shifts, form) {
  const cfg = GAME_CONFIG;
  capRows.forEach(r => {
    const p = r.player;
    if (form[p.name]) return;
    const tier = cfg.tiers[p.tier];
    // Usage-damped upside: low-usage players lack the shot diet to erupt.
    const usgNoise = cfg.usgNoiseFloor + (1 - cfg.usgNoiseFloor) * Math.min(1, (p.usg || 15) / cfg.usgNoisePivot);
    // Star ceiling games: the data's starCeiling widens the upside tail.
    const ceiling = 1 + (p.starCeiling || 0) * cfg.ceilingCvPerPoint / Math.max(0.05, tier.noiseCV);
    form[p.name] = {
      pts: (shifts[p.name] || 1) * gameSkewNoise(rng, tier.noiseCV * cfg.cvInflate * usgNoise * ceiling),
      reb: gameSkewNoise(rng, cfg.rebCV),
      ast: gameSkewNoise(rng, cfg.astCV),
      to: gameSkewNoise(rng, cfg.toCV),
      stl: gameSkewNoise(rng, cfg.stlCV),
      blk: gameSkewNoise(rng, cfg.blkCV),
    };
  });
  return form;
}

/**
 * Allocate ONE HALF of a team's totals down to player lines, from that
 * half's capacity (halftime revisions swap the capacity) and the shared
 * per-game form. Garbage-time and OT effects belong to the second half.
 * Minutes stay fractional here; mergeHalfBoxes rounds the game line.
 */
function allocateHalfBox(cap, form, halfScore, rebHalf, astHalf, opts) {
  opts = opts || {};
  const cfg = GAME_CONFIG;
  const rows = cap.playerShares;
  const starterCut = (opts.starters && opts.starters.length === 5)
    ? opts.starters
    : rows.slice().sort((a, b) => b.minutes - a.minutes).slice(0, 5).map(r => r.player.name);
  const isStarter = new Set(starterCut);
  const otMin = opts.otMinutes || 0;

  const halfMin = rows.map(r => r.minutes / 2);
  if (opts.garbage) {
    // Garbage time lives late: the full-game 7% starter trim = 14% of H2.
    let trimmed = 0;
    const benchIdx = [];
    rows.forEach((r, i) => {
      if (isStarter.has(r.player.name)) { trimmed += halfMin[i] * 0.14; halfMin[i] *= 0.86; }
      else if (halfMin[i] > 0) benchIdx.push(i);
    });
    benchIdx.forEach(i => {
      halfMin[i] = Math.min(cfg.maxPlayerMinutes / 2, halfMin[i] + trimmed / (benchIdx.length || 1));
    });
  }
  rows.forEach((r, i) => { if (isStarter.has(r.player.name)) halfMin[i] += otMin; });

  const fm = n => form[n] || { pts: 1, reb: 1, ast: 1 };
  const ptsW = rows.map(r => {
    let w = r.ptsShare * fm(r.player.name).pts;
    if (opts.garbage) w *= isStarter.has(r.player.name) ? 0.90 : 1.22;
    return w;
  });
  // Ceiling = half minutes x per-minute cap x usage (shot-diet) factor.
  const ptsCaps = rows.map((r, i) => {
    const usgF = Math.max(cfg.usgCapClamp[0], Math.min(cfg.usgCapClamp[1], (r.player.usg || 15) / cfg.usgCapPivot));
    return Math.floor(halfMin[i] * cfg.ptsPerMinCap * usgF);
  });
  const pts = gameCappedAllocate(ptsW, ptsCaps, halfScore);
  const rebW = rows.map(r => r.rebShare * fm(r.player.name).reb);
  const astW = rows.map(r => r.astShare * fm(r.player.name).ast);
  const reb = gameCappedAllocate(rebW, halfMin.map(m => Math.floor(m * cfg.rebPerMinCap)), rebHalf);
  const ast = gameCappedAllocate(astW, halfMin.map(m => Math.floor(m * cfg.astPerMinCap)), astHalf);

  // Defensive/handle lines: profile-informed shares (see game-constants).
  const perim = p => (GAME_DEF_ROLE_FAMILY[p.defRole] || '') === 'perimeter';
  const interior = p => (GAME_DEF_ROLE_FAMILY[p.defRole] || '') === 'interior';
  const toW = rows.map(r => {
    const p = r.player;
    return (p.usg * 0.7 + (p.apg || 0) * 2) * (r.minutes / 240) * fm(p.name).to;
  });
  const stlW = rows.map(r => {
    const p = r.player;
    return Math.max(0.1, (perim(p) ? 1 : 0.35) * (1 + Math.max(0, p.dLebron))) * (r.minutes / 240) * fm(p.name).stl;
  });
  const blkW = rows.map(r => {
    const p = r.player;
    return Math.max(0.05, (interior(p) ? 1.4 : 0.15) * (1 + Math.max(0, p.dLebron))) * (r.minutes / 240) * fm(p.name).blk;
  });
  const to = gameCappedAllocate(toW, halfMin.map(m => Math.floor(m * cfg.toPerMinCap) + 1), opts.toHalf || 0);
  const stl = gameCappedAllocate(stlW, halfMin.map(m => Math.floor(m * cfg.stlPerMinCap) + 1), opts.stlHalf || 0);
  const blk = gameCappedAllocate(blkW, halfMin.map(m => Math.floor(m * cfg.blkPerMinCap) + 1), opts.blkHalf || 0);

  return rows.map((r, i) => ({
    name: r.player.name, tier: r.player.tier,
    min: halfMin[i], pts: pts[i], reb: reb[i], ast: ast[i],
    to: to[i], stl: stl[i], blk: blk[i],
  }));
}

/** Merge two half box arrays into game lines (union by name, minutes rounded). */
function mergeHalfBoxes(h1, h2) {
  const by = new Map();
  h1.concat(h2).forEach(r => {
    const e = by.get(r.name);
    if (e) { e.min += r.min; e.pts += r.pts; e.reb += r.reb; e.ast += r.ast;
      e.to += r.to; e.stl += r.stl; e.blk += r.blk; }
    else by.set(r.name, { ...r });
  });
  return [...by.values()].map(r => ({ ...r, min: Math.round(r.min) }));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { gameCreateRNG, gameNormal, gameSkewNoise, gameLargestRemainder, openGameFlow, stepGameFlow, callGameTimeout, atHalftime, closeGameFlow, simulateGameFlow, gameCpuTimeouts, drawGameForm, allocateHalfBox, mergeHalfBoxes };
}
