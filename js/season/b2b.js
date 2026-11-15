// ============================================================
// B2B SPLIT SHADOW — spec b2b-1 (B2B_SPEC.md), from matchup-1 Q3b
// ============================================================
// A team's back-to-back net rating minus its rested net rating, for a team on
// a back-to-back tonight, as a shadow shift on the engine's margin. Recorded
// on ledger rows (`b2b`), judged against the closing spread; never used by
// the engine, the picks or the tickets. The team splits are computed at
// record time by b2b-shadow.js; this file holds the spec, the row entry and
// the record.
// ============================================================

// slope and threshold: the training seasons' (2023-24 + 2024-25) estimate and median |F|. holdout:
// 2025-26's slope on games with F ≠ 0, pooled with the live slope at the season-end read.
const SEASON_B2B_SPEC = { version: 'b2b-1', frozen: '2026-11-15', firstNight: '2026-11-16', k: 5, minPrior: 4, slope: 0.28, threshold: 2.9,
  retireCheckAt: 150, holdout: { slope: 0.4319, se: 0.172 }, pooledT: 3 };

// home, away: { b2b, split, nB2b, nRest, n } from b2b-shadow.js; pOurs: the row's pOurs. Null when
// either side is missing or has fewer than minPrior games. The shift moves pOurs's own margin
// (the engine stores margin rounded, pOurs from the unrounded one), so F = 0 leaves pOurs as is.
function seasonB2bEntry(home, away, pOurs) {
  const S = SEASON_B2B_SPEC;
  if (!home || !away || home.n < S.minPrior || away.n < S.minPrior) return null;
  const feature = +((home.b2b ? home.split : 0) - (away.b2b ? away.split : 0)).toFixed(3);
  const shift = +(S.slope * feature).toFixed(3);
  const p = typeof pOurs !== 'number' ? null : shift === 0 ? pOurs : +marginToWinProb(winProbToMargin(pOurs) + shift).toFixed(4);
  return { spec: S.version, home, away, feature, shift, pOurs: p };
}

// The record from firstNight: rows with a b2b entry, F ≠ 0, a result and a closing spread.
// → { n, slope, se, t, pooled: { slope, se, t }, ats: { w, l, p }, brier: { n, ours, b2b, market }, open }
// pooled: the inverse-variance pool of the live slope and the 2025-26 holdout's.
function seasonB2bRecord(rows) {
  const S = SEASON_B2B_SPEC;
  const live = (rows || []).filter(r => r.date >= S.firstNight && r.b2b && r.b2b.feature);
  const open = live.filter(r => !r.result).length;
  const done = live.filter(r => r.result && r.result.homeScore != null && r.close && r.close.spreadHome != null)
    .map(r => ({ r, f: r.b2b.feature, resid: (r.result.homeScore - r.result.awayScore) + r.close.spreadHome }));
  const out = { n: done.length, slope: null, se: null, t: null, pooled: null, ats: { w: 0, l: 0, p: 0 }, brier: { n: 0, ours: null, b2b: null, market: null }, open };
  if (done.length >= 3) {
    const n = done.length, mf = done.reduce((a, x) => a + x.f, 0) / n, mr = done.reduce((a, x) => a + x.resid, 0) / n;
    let sxx = 0, sxy = 0; done.forEach(x => { sxx += (x.f - mf) ** 2; sxy += (x.f - mf) * (x.resid - mr); });
    if (sxx > 0) {
      const b = sxy / sxx, a = mr - b * mf;
      const ssr = done.reduce((s, x) => s + (x.resid - a - b * x.f) ** 2, 0);
      const se = Math.sqrt(ssr / (n - 2) / sxx);
      out.slope = +b.toFixed(3); out.se = +se.toFixed(3); out.t = +(b / se).toFixed(2);
      const wh = 1 / S.holdout.se ** 2, wl = 1 / se ** 2, ps = 1 / Math.sqrt(wh + wl), pb = (wh * S.holdout.slope + wl * b) / (wh + wl);
      out.pooled = { slope: +pb.toFixed(3), se: +ps.toFixed(3), t: +(pb / ps).toFixed(2) };
    }
  }
  done.filter(x => Math.abs(x.f) >= S.threshold).forEach(x => {
    if (x.resid === 0) out.ats.p++; else if (Math.sign(x.resid) === Math.sign(x.f)) out.ats.w++; else out.ats.l++;
  });
  const scored = done.filter(x => x.r.pOurs != null && x.r.b2b.pOurs != null && x.r.pMarket != null);
  if (scored.length) {
    const y = (x) => (x.r.result.homeScore > x.r.result.awayScore ? 1 : 0);
    const br = (get) => +(scored.reduce((s, x) => s + (get(x) - y(x)) ** 2, 0) / scored.length).toFixed(4);
    out.brier = { n: scored.length, ours: br(x => x.r.pOurs), b2b: br(x => x.r.b2b.pOurs), market: br(x => x.r.pMarket) };
  }
  return out;
}
