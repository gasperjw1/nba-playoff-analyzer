// ============================================================
// MORNING INFORMATION TEST — spec morning-1 (MORNING_SPEC.md)
// ============================================================
// Does our engine, run with the official injury report in the late morning,
// know anything about who wins that DraftKings' price at that same moment
// doesn't? fetch-slate.js --record writes one row per game on the first run
// between 11:00 AM and 1:00 PM ET (never replaced); --settle copies each
// row's result and close from the season ledger. Judged by a logistic
// regression of home wins on logit(morning price) and our disagreement with
// it. Never used by the engine, the picks or the tickets.
// Needs noVigHomeProb (ensemble.js).
// ============================================================

// window: minutes after midnight ET, [from, to). clip: probabilities before the logit.
const SEASON_MORNING_SPEC = { version: 'morning-1', frozen: '2026-11-16', firstNight: '2026-11-17', window: { from: 11 * 60, to: 13 * 60 },
  clip: [0.01, 0.99], minN: 30, retireCheckAt: 300, holdT: 2 };

// A moment's date and minute of the day in New York (EST or EDT, whichever applies).
function morningEtParts(when) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date(when)).reduce((o, p) => (o[p.type] = p.value, o), {});
  return { ymd: `${parts.year}-${parts.month}-${parts.day}`, min: Number(parts.hour) * 60 + Number(parts.minute) };
}

// True when `when` is inside the late-morning window on the slate's own date (ET).
function seasonMorningInWindow(when, slateDate) {
  const S = SEASON_MORNING_SPEC, et = morningEtParts(when);
  return et.ymd === slateDate && et.min >= S.window.from && et.min < S.window.to;
}

// One game's morning row. proj: the feed-only projection (pOurs); rep: { name, proj, changes } with
// the official injury report, or null; pc: adaptEspnPickcenter's reply fetched in this run, or null;
// fetchedAt: when pc was fetched.
function buildMorningEntry(g, proj, rep, pc, slate, now, fetchedAt) {
  const r4 = (x) => (typeof x === 'number' && isFinite(x) ? +x.toFixed(4) : null);
  const pHome = pc ? noVigHomeProb(pc.mlHome, pc.mlAway) : null;
  const open = pc && pc.open ? noVigHomeProb(pc.open.mlHome, pc.open.mlAway) : null;
  return {
    id: String(g.id), date: slate.date, tip: g.tip || null, home: g.home, away: g.away,
    spec: SEASON_MORNING_SPEC.version, recordedAt: new Date(now).toISOString(), source: slate.source || 'nb.ai',
    engine: typeof SEASON_ENGINE_VERSION !== 'undefined' ? SEASON_ENGINE_VERSION : null,
    ours: { pFeed: r4(proj && proj.pHome), pReport: r4(rep && rep.proj && rep.proj.pHome), report: rep ? rep.name || null : null,
      changes: rep && Array.isArray(rep.changes) ? rep.changes.length : null },
    market: pHome == null ? null : { book: pc.book || null, mlHome: pc.mlHome, mlAway: pc.mlAway, pHome: r4(pHome), spreadHome: pc.spreadHome != null ? pc.spreadHome : null,
      open: open == null ? null : { mlHome: pc.open.mlHome, mlAway: pc.open.mlAway, pHome: r4(open) }, at: new Date(fetchedAt || now).toISOString() },
    result: null, close: null,
  };
}

// Add tonight's morning rows in place: only inside the window, only before tip, never replacing a row.
function mergeMorningEntries(rows, entries, now) {
  let added = 0, kept = 0, late = 0, outside = 0;
  for (const e of entries) {
    if (!seasonMorningInWindow(now, e.date)) { outside++; continue; }
    if (rows.some(r => r.id === e.id)) { kept++; continue; }
    if (e.tip && new Date(e.tip) <= new Date(now)) { late++; continue; }
    rows.push(e); added++;
  }
  return { added, kept, late, outside };
}

// Copy results and DraftKings' close from the season ledger rows with the same id. → rows changed.
function settleMorningRows(rows, ledgerRows) {
  const byId = new Map((ledgerRows || []).map(r => [String(r.id), r]));
  let changed = 0;
  for (const r of rows) {
    const L = byId.get(r.id);
    if (!L) continue;
    let did = false;
    if (!r.result && L.result && L.result.homeScore != null) { r.result = { homeScore: L.result.homeScore, awayScore: L.result.awayScore }; did = true; }
    if (!r.close && L.close && L.close.mlHome != null && L.close.mlAway != null) {
      r.close = { mlHome: L.close.mlHome, mlAway: L.close.mlAway, book: L.close.book || null, pHome: +noVigHomeProb(L.close.mlHome, L.close.mlAway).toFixed(4) };
      did = true;
    }
    if (did) changed++;
  }
  return changed;
}

// Logistic regression by Newton steps. X: rows of predictors (first column 1), y: 0/1.
// → { beta, se } (standard errors from the inverse information matrix), or null if it can't be fit.
function _morningLogit(X, y) {
  const k = X[0].length;
  let beta = new Array(k).fill(0), H = null;
  for (let it = 0; it < 50; it++) {
    const g = new Array(k).fill(0);
    H = Array.from({ length: k }, () => new Array(k).fill(0));
    for (let i = 0; i < X.length; i++) {
      const eta = X[i].reduce((s, x, j) => s + x * beta[j], 0), p = 1 / (1 + Math.exp(-eta)), w = p * (1 - p);
      for (let a = 0; a < k; a++) { g[a] += X[i][a] * (y[i] - p); for (let b = 0; b < k; b++) H[a][b] += w * X[i][a] * X[i][b]; }
    }
    const step = _morningSolve(H, g);
    if (!step) return null;
    beta = beta.map((b, j) => b + step[j]);
    if (Math.max(...step.map(Math.abs)) < 1e-10) break;
  }
  const inv = _morningInverse(H);
  if (!inv) return null;
  return { beta, se: inv.map((r, j) => Math.sqrt(r[j])) };
}
function _morningSolve(A, b) {
  const n = A.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) return null;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let j = c; j <= n; j++) M[r][j] -= f * M[c][j]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}
function _morningInverse(A) {
  const n = A.length, cols = [];
  for (let j = 0; j < n; j++) { const e = new Array(n).fill(0); e[j] = 1; const c = _morningSolve(A, e); if (!c) return null; cols.push(c); }
  return Array.from({ length: n }, (_, i) => cols.map(c => c[i]));
}

// The record (MORNING_SPEC.md "Judged"). → { n, used, excluded, coef, se, t, beta, weight, feed, scores, moved, read }
function seasonMorningRecord(rows) {
  const S = SEASON_MORNING_SPEC;
  const clip = (p) => Math.min(S.clip[1], Math.max(S.clip[0], p)), lg = (p) => { const q = clip(p); return Math.log(q / (1 - q)); };
  const live = (rows || []).filter(r => r.spec === S.version && r.date >= S.firstNight);
  const excluded = { outsideWindow: 0, afterTip: 0, noMarket: 0, noEngine: 0, open: 0 };
  const done = [];
  for (const r of live) {
    if (!seasonMorningInWindow(r.recordedAt, r.date)) { excluded.outsideWindow++; continue; }
    if (r.tip && new Date(r.recordedAt) >= new Date(r.tip)) { excluded.afterTip++; continue; }
    if (!r.market || r.market.pHome == null) { excluded.noMarket++; continue; }
    const p = r.ours && (r.ours.pReport != null ? r.ours.pReport : r.ours.pFeed);
    if (p == null) { excluded.noEngine++; continue; }
    if (!r.result || r.result.homeScore == null || r.result.homeScore === r.result.awayScore) { excluded.open++; continue; }
    done.push({ r, p, y: r.result.homeScore > r.result.awayScore ? 1 : 0, usedReport: r.ours.pReport != null });
  }
  const n = done.length;
  const out = { n, used: { report: done.filter(x => x.usedReport).length, feed: done.filter(x => !x.usedReport).length }, excluded,
    coef: null, se: null, t: null, beta: null, weight: null, feed: null, scores: null, moved: null, read: null };
  const test = (get) => {
    const X = done.map(x => { const lm = lg(x.r.market.pHome); return [1, lm, lg(get(x)) - lm]; }), f = _morningLogit(X, done.map(x => x.y));
    return f && { coef: +f.beta[2].toFixed(4), se: +f.se[2].toFixed(4), t: +(f.beta[2] / f.se[2]).toFixed(2), beta: f.beta.map(b => +b.toFixed(4)) };
  };
  if (n >= S.minN) {
    const main = test(x => x.p);
    if (main) { Object.assign(out, { coef: main.coef, se: main.se, t: main.t, beta: main.beta }); out.weight = +(main.beta[2] / main.beta[1]).toFixed(4); }
    const fd = done.filter(x => x.r.ours.pFeed != null);
    if (fd.length === n) out.feed = test(x => x.r.ours.pFeed);
  }
  // Brier and log loss on the same rows; the close where the row has one.
  if (n) {
    const sc = (s, get) => { const v = s.filter(x => get(x) != null); return v.length ? { n: v.length,
      brier: +(v.reduce((a, x) => a + (get(x) - x.y) ** 2, 0) / v.length).toFixed(4),
      logLoss: +(v.reduce((a, x) => a - Math.log(x.y ? clip(get(x)) : 1 - clip(get(x))), 0) / v.length).toFixed(4) } : null; };
    out.scores = { market: sc(done, x => x.r.market.pHome), ours: sc(done, x => x.p), feed: sc(done, x => x.r.ours.pFeed),
      close: sc(done, x => (x.r.close ? x.r.close.pHome : null)) };
    // Share of DraftKings' open-to-close move done by the morning row: slope of (morning − open) on (close − open), in logits.
    const mv = done.filter(x => x.r.market.open && x.r.close);
    let sxy = 0, sxx = 0;
    for (const x of mv) { const d = lg(x.r.close.pHome) - lg(x.r.market.open.pHome), e = lg(x.r.market.pHome) - lg(x.r.market.open.pHome); sxy += d * e; sxx += d * d; }
    out.moved = { n: mv.length, share: sxx > 0 ? +(sxy / sxx).toFixed(2) : null };
  }
  out.read = n < S.minN ? `too few games yet (${n} of ${S.minN} to fit)`
    : out.coef == null ? 'could not fit'
    : n >= S.retireCheckAt && out.coef <= 0 ? `RETIRE: coefficient ≤ 0 at the ${S.retireCheckAt}-game check`
    : `keep logging (retire check at ${S.retireCheckAt} games; holds at the end of the regular season only with coefficient > 0 and t ≥ ${S.holdT})`;
  return out;
}
