// ============================================================
// MLB VALIDATORS — baseball-only schema checks (scaffold)
// ============================================================
// Additive and isolated: this does NOT modify js/validators.js or the NBA
// boot/validation path. The baseball UI may call validateMlbSchedule() and
// console.warn on errors, mirroring the NBA validator pattern without
// touching the NBA red banner.
// ============================================================

function validateMlbSchedule(schedule) {
  const errors = [];
  if (!Array.isArray(schedule)) {
    errors.push('MLB_SCHEDULE is not an array');
    return errors;
  }
  schedule.forEach((g, i) => {
    const ctx = `MLB_SCHEDULE[${i}](${(g && g.id) || '?'})`;
    if (!g || typeof g !== 'object') { errors.push(`${ctx}: not an object`); return; }
    if (!g.id) errors.push(`${ctx}: missing id`);
    if (!g.date || !/^\d{4}-\d{2}-\d{2}$/.test(g.date)) errors.push(`${ctx}: missing/malformed date`);
    if (!g.homeTeam || !g.awayTeam) errors.push(`${ctx}: missing homeTeam/awayTeam`);
    if (!g.markets || !g.markets.ml) errors.push(`${ctx}: missing markets.ml`);
    if (g.markets && g.markets.total && typeof g.markets.total.line !== 'number') {
      errors.push(`${ctx}: markets.total.line must be a number`);
    }
  });
  return errors;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateMlbSchedule };
}
