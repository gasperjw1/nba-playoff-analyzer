// ============================================================
// SCHEMA VALIDATORS (Tier 1.1)
// ============================================================
// Fails loudly at boot when data is corrupted. Catches the bug
// classes we've actually hit:
//   - Duplicate top-level keys (also covered by TEST 7)
//   - prediction.homeWin contradicts homeScore vs awayScore
//   - prediction.margin doesn't match |homeScore - awayScore|
//   - Missing required fields on bets/parlays/predictions
//   - Type mismatches (margin: "5" instead of 5)
//   - Invalid enum values (outcome, category, parlay type)
//   - Bet references series id that doesn't exist
//
// Boot wiring lives in js/app.js — runs once after data load,
// renders a red banner at the top of the page if anything fails.
// TEST 8 in test-projections.js asserts errors.length === 0.
// ============================================================

const VALID_BET_TYPES        = ['ml', 'spread', 'total', 'prop', 'parlay'];
const VALID_OUTCOMES         = ['win', 'loss', 'push', 'void'];
const VALID_PARLAY_CATEGORY  = ['floor', 'traditional'];
const VALID_PARLAY_TYPE      = ['best-bet', 'chaos', 'value'];
const VALID_LEG_STATUS       = ['hit', 'miss', null];

// ---------- prediction object ----------------------------------
function validatePrediction(pred, ctx) {
  const errors = [];
  if (!pred || typeof pred !== 'object') {
    errors.push(`${ctx}: prediction is not an object`);
    return errors;
  }

  // Required fields with type checks
  if (typeof pred.homeWin   !== 'boolean') errors.push(`${ctx}: homeWin must be boolean (got ${typeof pred.homeWin})`);
  if (typeof pred.homeScore !== 'number')  errors.push(`${ctx}: homeScore must be number (got ${typeof pred.homeScore})`);
  if (typeof pred.awayScore !== 'number')  errors.push(`${ctx}: awayScore must be number (got ${typeof pred.awayScore})`);
  if (typeof pred.margin    !== 'number')  errors.push(`${ctx}: margin must be number (got ${typeof pred.margin})`);

  // Internal consistency — the high-value checks
  if (typeof pred.homeWin === 'boolean' && typeof pred.homeScore === 'number' && typeof pred.awayScore === 'number') {
    const expected = pred.homeScore > pred.awayScore;
    if (pred.homeWin !== expected) {
      errors.push(`${ctx}: homeWin=${pred.homeWin} contradicts scores (home=${pred.homeScore}, away=${pred.awayScore})`);
    }
  }
  if (typeof pred.margin === 'number' && typeof pred.homeScore === 'number' && typeof pred.awayScore === 'number') {
    const expected = Math.abs(pred.homeScore - pred.awayScore);
    if (Math.abs(pred.margin) !== expected) {
      errors.push(`${ctx}: |margin|=${Math.abs(pred.margin)} doesn't match |home-away|=${expected}`);
    }
  }

  // Score sanity (NBA scores ~85-150)
  if (typeof pred.homeScore === 'number' && (pred.homeScore < 50 || pred.homeScore > 200)) {
    errors.push(`${ctx}: homeScore ${pred.homeScore} outside sane range [50, 200]`);
  }
  if (typeof pred.awayScore === 'number' && (pred.awayScore < 50 || pred.awayScore > 200)) {
    errors.push(`${ctx}: awayScore ${pred.awayScore} outside sane range [50, 200]`);
  }

  // Optional but if present, must be array
  if (pred.keyTakeaways !== undefined && !Array.isArray(pred.keyTakeaways)) {
    errors.push(`${ctx}: keyTakeaways must be array (got ${typeof pred.keyTakeaways})`);
  }
  if (pred.playerProjections !== undefined && typeof pred.playerProjections !== 'object') {
    errors.push(`${ctx}: playerProjections must be object`);
  }

  return errors;
}

// ---------- BETS record ----------------------------------------
function validateBet(bet, seriesIds) {
  const errors = [];
  const ctx = `BET[${bet && bet.id || '<no-id>'}]`;
  if (!bet || typeof bet !== 'object') {
    errors.push(`${ctx}: not an object`);
    return errors;
  }

  if (!bet.id)     errors.push(`${ctx}: missing id`);
  if (!bet.slate)  errors.push(`${ctx}: missing slate`);
  if (!bet.series) errors.push(`${ctx}: missing series`);
  if (!bet.type)   errors.push(`${ctx}: missing type`);
  if (!bet.pick)   errors.push(`${ctx}: missing pick`);

  if (typeof bet.game !== 'number') errors.push(`${ctx}: game must be number (got ${typeof bet.game})`);
  if (bet.type && !VALID_BET_TYPES.includes(bet.type)) {
    errors.push(`${ctx}: type '${bet.type}' not in [${VALID_BET_TYPES.join('|')}]`);
  }

  // series must reference a valid series id (case-insensitive endsWith match)
  if (bet.series) {
    const lc = bet.series.toLowerCase();
    let found = false;
    for (const id of seriesIds) {
      if (id.toLowerCase().endsWith(lc)) { found = true; break; }
    }
    if (!found) errors.push(`${ctx}: series '${bet.series}' doesn't match any SERIES_DATA.id`);
  }

  // result is null OR { outcome, actual }
  if (bet.result !== null && bet.result !== undefined) {
    if (typeof bet.result !== 'object') {
      errors.push(`${ctx}: result must be null or object (got ${typeof bet.result})`);
    } else if (!VALID_OUTCOMES.includes(bet.result.outcome)) {
      errors.push(`${ctx}: result.outcome '${bet.result.outcome}' not in [${VALID_OUTCOMES.join('|')}]`);
    }
  }

  return errors;
}

// ---------- FEATURED_PARLAYS record ----------------------------
function validateParlay(p, seriesIds) {
  const errors = [];
  const ctx = `PARLAY[${p && p.id || '<no-id>'}]`;
  if (!p || typeof p !== 'object') {
    errors.push(`${ctx}: not an object`);
    return errors;
  }

  if (!p.id)       errors.push(`${ctx}: missing id`);
  if (!p.slate)    errors.push(`${ctx}: missing slate`);
  if (!p.date)     errors.push(`${ctx}: missing date`);
  if (!p.category) errors.push(`${ctx}: missing category`);
  if (!p.name)     errors.push(`${ctx}: missing name`);
  if (!p.odds)     errors.push(`${ctx}: missing odds`);
  if (!p.thesis)   errors.push(`${ctx}: missing thesis`);

  if (p.category && !VALID_PARLAY_CATEGORY.includes(p.category)) {
    errors.push(`${ctx}: category '${p.category}' not in [${VALID_PARLAY_CATEGORY.join('|')}]`);
  }
  if (p.type && !VALID_PARLAY_TYPE.includes(p.type)) {
    errors.push(`${ctx}: type '${p.type}' not in [${VALID_PARLAY_TYPE.join('|')}]`);
  }

  if (typeof p.stake !== 'number') errors.push(`${ctx}: stake must be number (got ${typeof p.stake})`);
  if (!Array.isArray(p.legs)) {
    errors.push(`${ctx}: legs must be array (got ${typeof p.legs})`);
  } else {
    if (p.legs.length === 0) errors.push(`${ctx}: legs array is empty`);
    p.legs.forEach((leg, i) => {
      if (!leg.pick)     errors.push(`${ctx}.legs[${i}]: missing pick`);
      if (!leg.odds)     errors.push(`${ctx}.legs[${i}]: missing odds`);
      if (leg.status !== undefined && !VALID_LEG_STATUS.includes(leg.status)) {
        errors.push(`${ctx}.legs[${i}]: status '${leg.status}' not in [hit|miss|null]`);
      }
    });
  }

  // result is null OR { outcome, delta?, actual? }
  if (p.result !== null && p.result !== undefined) {
    if (typeof p.result !== 'object') {
      errors.push(`${ctx}: result must be null or object`);
    } else if (!VALID_OUTCOMES.includes(p.result.outcome)) {
      errors.push(`${ctx}: result.outcome '${p.result.outcome}' not in [${VALID_OUTCOMES.join('|')}]`);
    }
  }

  // date format YYYY-MM-DD
  if (p.date && !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) {
    errors.push(`${ctx}: date '${p.date}' not in YYYY-MM-DD format`);
  }

  return errors;
}

// ---------- BET_SLATES metadata --------------------------------
// Tier 1.2: validates that every slate game has a date in YYYY-MM-DD,
// a non-empty time/venue, and a series that resolves in SERIES_DATA.
function validateBetSlates(slates, seriesIds) {
  const errors = [];
  if (!slates || typeof slates !== 'object') {
    errors.push('BET_SLATES is missing or not an object');
    return errors;
  }
  Object.entries(slates).forEach(([slateKey, slate]) => {
    const ctx = `BET_SLATES[${slateKey}]`;
    if (!slate || typeof slate !== 'object') { errors.push(`${ctx}: not an object`); return; }
    if (!slate.label) errors.push(`${ctx}: missing label`);
    if (!Array.isArray(slate.games)) { errors.push(`${ctx}: games must be array`); return; }
    if (slate.games.length === 0) errors.push(`${ctx}: games array is empty`);
    slate.games.forEach((g, i) => {
      const gctx = `${ctx}.games[${i}](${g && g.series || '?'})`;
      if (!g.series) errors.push(`${gctx}: missing series`);
      if (!g.date)   errors.push(`${gctx}: missing date (Tier 1.2 requires structured date)`);
      if (g.date && !/^\d{4}-\d{2}-\d{2}$/.test(g.date)) errors.push(`${gctx}: date '${g.date}' not in YYYY-MM-DD`);
      if (!g.time)   errors.push(`${gctx}: missing time`);
      if (!g.venue)  errors.push(`${gctx}: missing venue`);
      if (g.series) {
        const lc = g.series.toLowerCase();
        let found = false;
        for (const id of seriesIds) { if (id.toLowerCase().endsWith(lc)) { found = true; break; } }
        if (!found) errors.push(`${gctx}: series '${g.series}' not in SERIES_DATA`);
      }
    });
  });
  return errors;
}

// ---------- orchestrator ---------------------------------------
function validateAll(seriesData, bets, parlays, betSlates) {
  const errors = [];
  if (!Array.isArray(seriesData)) {
    errors.push('SERIES_DATA is not an array');
    return errors;
  }

  const seriesIds = new Set(seriesData.map(s => s && s.id).filter(Boolean));

  // Predictions on every game with a prediction object
  seriesData.forEach(s => {
    if (!s || !Array.isArray(s.games)) return;
    s.games.forEach((g, i) => {
      if (g && g.prediction) {
        errors.push(...validatePrediction(g.prediction, `${s.id}.G${i + 1}`));
      }
    });
  });

  // Duplicate id sweep on bets + parlays
  if (Array.isArray(bets)) {
    const idCounts = {};
    bets.forEach(b => { if (b && b.id) idCounts[b.id] = (idCounts[b.id] || 0) + 1; });
    Object.entries(idCounts).forEach(([id, c]) => {
      if (c > 1) errors.push(`BETS: duplicate id '${id}' appears ${c} times`);
    });
    bets.forEach(b => errors.push(...validateBet(b, seriesIds)));
  }
  if (Array.isArray(parlays)) {
    const idCounts = {};
    parlays.forEach(p => { if (p && p.id) idCounts[p.id] = (idCounts[p.id] || 0) + 1; });
    Object.entries(idCounts).forEach(([id, c]) => {
      if (c > 1) errors.push(`FEATURED_PARLAYS: duplicate id '${id}' appears ${c} times`);
    });
    parlays.forEach(p => errors.push(...validateParlay(p, seriesIds)));
  }

  if (betSlates) errors.push(...validateBetSlates(betSlates, seriesIds));

  return errors;
}

// ---------- UI banner ------------------------------------------
function renderValidationBanner(errors) {
  if (!errors || errors.length === 0) return;
  if (typeof document === 'undefined') return;
  // Idempotent: don't double-render on re-validation
  if (document.getElementById('validation-banner')) return;

  const escape = (s) => String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  const html = `
    <div id="validation-banner" style="background:rgba(239,68,68,0.18);border-bottom:1px solid #ef4444;
      color:#ff7676;padding:8px 16px;font-size:12px;text-align:center;
      position:sticky;top:0;z-index:1000;font-weight:600">
      ⚠ ${errors.length} schema validation issue${errors.length === 1 ? '' : 's'} —
      <span style="text-decoration:underline;cursor:pointer"
        onclick="(function(){var d=document.getElementById('validation-details');d.style.display=d.style.display==='block'?'none':'block';})()">show details</span>
    </div>
    <div id="validation-details" style="display:none;background:rgba(0,0,0,0.92);color:#ffd5d5;
      padding:12px 16px;font-size:11px;font-family:'SF Mono',Menlo,monospace;
      max-height:340px;overflow-y:auto;border-bottom:1px solid #ef4444">
      ${errors.map(e => `<div style="padding:2px 0">• ${escape(e)}</div>`).join('')}
    </div>`;
  document.body.insertAdjacentHTML('afterbegin', html);
}
