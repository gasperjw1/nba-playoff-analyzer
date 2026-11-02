// ============================================================
// ENSEMBLE — combining two models (and the market) per game
// ============================================================
// Method, in order of what the evidence supports:
//   1. Equal-weight log-odds average of the two models. Brier and
//      log loss are convex, so this cannot score worse than the
//      average member and beats both whenever their errors differ.
//   2. Extremizing (multiply the averaged log-odds by a > 1) only
//      once the ledger shows the models carry non-overlapping
//      information (Satopää et al. 2014: a ≈ 1.1-1.3).
//   3. Stacking: logistic regression of the result on
//      [logit ours, logit friend, logit market], walk-forward.
//      If the market coefficient absorbs everything, neither model
//      adds information beyond the closing line.
// ============================================================

function logit(p) {
  const q = Math.max(1e-6, Math.min(1 - 1e-6, p));
  return Math.log(q / (1 - q));
}
function invLogit(x) { return 1 / (1 + Math.exp(-x)); }

function americanToProb(odds) {
  if (odds == null || !isFinite(odds) || odds === 0) return null;
  return odds > 0 ? 100 / (odds + 100) : -odds / (-odds + 100);
}
function probToAmerican(p) {
  if (!(p > 0 && p < 1)) return null;
  return Math.round(p >= 0.5 ? -100 * p / (1 - p) : 100 * (1 - p) / p);
}

// Remove the vig by normalizing the two implied probabilities.
function noVigHomeProb(mlHome, mlAway) {
  const h = americanToProb(mlHome), a = americanToProb(mlAway);
  if (h == null || a == null) return null;
  return h / (h + a);
}

// Market expected home margin is minus the home spread.
function spreadToHomeProb(spreadHome, sigma) {
  if (spreadHome == null) return null;
  return marginToWinProb(-spreadHome, sigma);
}

// probs: [{p, w}] — weighted log-odds pool, then extremize.
function combineLogOdds(entries, extremize) {
  const valid = entries.filter(e => e && typeof e.p === 'number' && e.p > 0 && e.p < 1 && (e.w == null || e.w > 0));
  if (!valid.length) return null;
  let num = 0, den = 0;
  valid.forEach(e => { const w = e.w == null ? 1 : e.w; num += w * logit(e.p); den += w; });
  return invLogit((num / den) * (extremize || 1));
}

// One game's forecasts → blended probability + the comparison the UI shows.
// inputs: { pOurs, pFriend, mlHome, mlAway, spreadHome }
function blendGameForecast(inputs, config) {
  const cfg = { ...SEASON_ENSEMBLE, ...(config || {}) };
  const pMarketMl = noVigHomeProb(inputs.mlHome, inputs.mlAway);
  const pMarketSpread = spreadToHomeProb(inputs.spreadHome);
  const pMarket = pMarketMl != null ? pMarketMl : pMarketSpread;

  const members = [];
  if (typeof inputs.pOurs === 'number') members.push({ p: inputs.pOurs, w: cfg.weights.ours, name: 'ours' });
  if (typeof inputs.pFriend === 'number') members.push({ p: inputs.pFriend, w: cfg.weights.friend, name: 'friend' });
  if (pMarket != null && cfg.marketWeight > 0) members.push({ p: pMarket, w: cfg.marketWeight, name: 'market' });

  const pBlend = combineLogOdds(members, cfg.extremize);
  const edge = pBlend != null && pMarket != null ? pBlend - pMarket : null;
  const modelsAgree = typeof inputs.pOurs === 'number' && typeof inputs.pFriend === 'number'
    ? ((inputs.pOurs >= 0.5) === (inputs.pFriend >= 0.5)) : null;

  return {
    pBlend: pBlend != null ? +pBlend.toFixed(4) : null,
    pMarket: pMarket != null ? +pMarket.toFixed(4) : null,
    pMarketSource: pMarketMl != null ? 'moneyline' : (pMarketSpread != null ? 'spread' : null),
    edge: edge != null ? +edge.toFixed(4) : null,
    flagged: edge != null && Math.abs(edge) >= cfg.edgeFlagPts,
    modelsAgree,
    members: members.map(m => ({ name: m.name, p: +m.p.toFixed(4), w: m.w })),
    method: `log-odds mean${cfg.extremize !== 1 ? ` × ${cfg.extremize}` : ''}${cfg.marketWeight > 0 ? ' incl. market' : ''}`,
  };
}

// ---------- scoring ----------

function brier(p, y) { return (p - y) * (p - y); }
function logLoss(p, y) { const q = Math.max(1e-6, Math.min(1 - 1e-6, p)); return -(y * Math.log(q) + (1 - y) * Math.log(1 - q)); }

// entries: settled ledger rows with { result:{homeScore,awayScore}, pOurs, pFriend, pMarket, pBlend, marginOurs, spreadHome }
// Returns per-source { n, accuracy, brier, logLoss, marginMae } plus a
// 'baseline' row (always pick home at P=0.58 — roughly the league rate).
function scoreForecasts(entries) {
  const settled = entries.filter(e => e.result && typeof e.result.homeScore === 'number' && typeof e.result.awayScore === 'number');
  const sources = { ours: 'pOurs', friend: 'pFriend', market: 'pMarket', blend: 'pBlend' };
  const out = {};
  Object.keys(sources).forEach(name => {
    const key = sources[name];
    const rows = settled.filter(e => typeof e[key] === 'number');
    if (!rows.length) { out[name] = { n: 0 }; return; }
    let acc = 0, b = 0, ll = 0, maeN = 0, mae = 0;
    rows.forEach(e => {
      const y = e.result.homeScore > e.result.awayScore ? 1 : 0;
      const p = e[key];
      if ((p >= 0.5) === (y === 1)) acc++;
      b += brier(p, y); ll += logLoss(p, y);
      const m = name === 'ours' ? e.marginOurs : (name === 'market' && e.spreadHome != null ? -e.spreadHome : null);
      if (typeof m === 'number') { mae += Math.abs(m - (e.result.homeScore - e.result.awayScore)); maeN++; }
    });
    out[name] = {
      n: rows.length,
      accuracy: +(acc / rows.length).toFixed(4),
      brier: +(b / rows.length).toFixed(4),
      logLoss: +(ll / rows.length).toFixed(4),
      marginMae: maeN ? +(mae / maeN).toFixed(2) : null,
    };
  });
  if (settled.length) {
    let acc = 0, b = 0;
    settled.forEach(e => { const y = e.result.homeScore > e.result.awayScore ? 1 : 0; if (y) acc++; b += brier(0.58, y); });
    out.baseline = { n: settled.length, accuracy: +(acc / settled.length).toFixed(4), brier: +(b / settled.length).toFixed(4), note: 'always home @ 58%' };
  }
  return out;
}

// ---------- stacking ----------

// Plain L2-regularized logistic regression by gradient descent.
// rows: [{ x:[...], y:0|1 }]. Returns { weights, bias, iterations }.
function fitLogisticStack(rows, opts) {
  const o = { lr: 0.05, iters: 4000, l2: 0.01, ...(opts || {}) };
  if (!rows.length) return null;
  const k = rows[0].x.length;
  let w = new Array(k).fill(0), b = 0;
  for (let it = 0; it < o.iters; it++) {
    const gw = new Array(k).fill(0); let gb = 0;
    rows.forEach(r => {
      const z = r.x.reduce((s, xi, i) => s + w[i] * xi, b);
      const err = invLogit(z) - r.y;
      r.x.forEach((xi, i) => { gw[i] += err * xi; });
      gb += err;
    });
    for (let i = 0; i < k; i++) w[i] -= o.lr * (gw[i] / rows.length + o.l2 * w[i]);
    b -= o.lr * gb / rows.length;
  }
  return { weights: w.map(v => +v.toFixed(4)), bias: +b.toFixed(4), iterations: o.iters, n: rows.length };
}

// Stack on [logit ours, logit friend, logit market] using settled rows
// that have all three. Below stackMinN returns {status:'insufficient'}.
function stackWeightsFromLedger(entries, config) {
  const cfg = { ...SEASON_ENSEMBLE, ...(config || {}) };
  const rows = entries
    .filter(e => e.result && typeof e.pOurs === 'number' && typeof e.pFriend === 'number' && typeof e.pMarket === 'number')
    .map(e => ({ x: [logit(e.pOurs), logit(e.pFriend), logit(e.pMarket)], y: e.result.homeScore > e.result.awayScore ? 1 : 0 }));
  if (rows.length < cfg.stackMinN) return { status: 'insufficient', n: rows.length, needed: cfg.stackMinN };
  const fit = fitLogisticStack(rows);
  return {
    status: rows.length >= cfg.stackTrustN ? 'usable' : 'provisional',
    n: rows.length,
    labels: ['ours', 'friend', 'market'],
    weights: fit.weights, bias: fit.bias,
    note: rows.length >= cfg.stackTrustN
      ? 'Weights fitted on enough games to use.'
      : `Provisional — ${cfg.stackTrustN - rows.length} more settled games before trusting these.`,
  };
}
