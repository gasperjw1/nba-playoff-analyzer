// ============================================================
// PROP DISTRIBUTIONS — the shape of a player's stat line around its projection
// ============================================================
// A stat line is a whole number; each family here describes a continuous
// latent X and the outcome n has probability P(n − 0.5 < X ≤ n + 0.5), with
// everything at or below 0.5 on n = 0 (so the normal's negative tail lands
// on zero). Families:
//   normal    mean, sd                       — the first props models
//   gamma     mean, sd matched                — right-skewed, same two moments
//   compound  minutes × gamma: tonight's minutes are projected × r, r from a
//             set of equally weighted ratio nodes (mean 1); given minutes, a
//             gamma with mean rate·minutes and variance φ·μ + μ²/k
// d = { family, mean, sd } | { family: 'compound', mean, min, nodes, phi, k }.
//
// Uses (globals): normalCdf (engine.js).
// ============================================================

// ln Γ(x), x > 0 (Lanczos, g = 7, n = 9; ~15 significant digits).
const _LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
  12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
function lnGamma(x) {
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x);
  x -= 1;
  let a = _LANCZOS[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += _LANCZOS[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

// Regularized lower incomplete gamma P(a, x) (series below a + 1, continued fraction above).
function gammaP(a, x) {
  if (!(x > 0)) return 0;
  if (!(a > 0)) return 1;
  const lead = -x + a * Math.log(x) - lnGamma(a);
  if (x < a + 1) {
    let ap = a, sum = 1 / a, del = sum;
    for (let n = 0; n < 1000; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; }
    return Math.min(1, sum * Math.exp(lead));
  }
  // Lentz's continued fraction for Q(a, x)
  const tiny = 1e-300;
  let b = x + 1 - a, c = 1 / tiny, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b; if (Math.abs(d) < tiny) d = tiny;
    c = b + an / c; if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-15) break;
  }
  return Math.max(0, 1 - Math.exp(lead) * h);
}

// Gamma with mean m and variance v (m ≤ 0 or v ≤ 0: all mass at m, floored at 0).
function _gammaCdf(x, m, v) {
  if (!(m > 0) || !(v > 0)) return x >= Math.max(0, m) ? 1 : 0;
  return gammaP(m * m / v, x * m / v);
}

// P(X ≤ x) for the latent X.
function propDistCdf(d, x) {
  if (d.family === 'normal') return d.sd > 0 ? normalCdf((x - d.mean) / d.sd) : (x >= d.mean ? 1 : 0);
  if (d.family === 'gamma') return _gammaCdf(x, d.mean, d.sd * d.sd);
  if (d.family === 'compound') {
    const rate = d.min > 0 ? d.mean / d.min : 0;
    let s = 0;
    for (const r of d.nodes) {
      const mu = rate * d.min * r;
      s += _gammaCdf(x, mu, d.phi * mu + mu * mu / d.k);
    }
    return s / d.nodes.length;
  }
  throw new Error(`unknown prop distribution ${d.family}`);
}

// P(outcome = n), n a whole number ≥ 0.
function propDistPmf(d, n) {
  return n <= 0 ? propDistCdf(d, 0.5) : propDistCdf(d, n + 0.5) - propDistCdf(d, n - 0.5);
}

// P(over line): a half-point line has no push; a whole-number line counts the push as half
// (as props.js probOver always has).
function propDistOver(d, line) {
  const isHalf = Math.abs(line - Math.round(line)) > 1e-9;
  if (isHalf) return 1 - propDistCdf(d, line);
  const hi = propDistCdf(d, line + 0.5), lo = line > 0 ? propDistCdf(d, line - 0.5) : 0;
  return (1 - hi) + 0.5 * (hi - lo);
}

// Highest half-point line ≥ 0.5 the distribution gives at least `target` chance of going over
// (null when even 0.5 falls short). P(over) only falls as the line rises, so binary search.
function propDistLineAtLeast(d, target) {
  if (propDistOver(d, 0.5) < target) return null;
  let lo = 0, hi = Math.max(1, Math.ceil((d.mean || 0) * 4 + 40));   // line = j + 0.5; P(over hi) < target
  while (propDistOver(d, hi + 0.5) >= target) hi *= 2;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (propDistOver(d, mid + 0.5) >= target) lo = mid; else hi = mid; }
  return lo + 0.5;
}
