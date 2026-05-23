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

// ---------- validateGameResult ---------------------------------
// Catches the bug class where a game has notes/scores populated but
// winner is still null (saw SAS-MIN G5 silently null until May 16
// retro). Auto-resolve, CHS ledger updates, and win-rate calcs all
// read `winner` — silent null breaks all of them.
//
// Rule: if ANY of {notes (non-empty), homeScore, awayScore, result}
// is populated, then winner MUST be set (and consistent with scores).
function validateGameResult(game, ctx) {
  const errors = [];
  if (!game) return errors;
  const hasNotes = typeof game.notes === 'string' && game.notes.trim().length >= 30;
  const hasScores = (typeof game.homeScore === 'number') && (typeof game.awayScore === 'number');
  const hasResult = !!game.result;
  const winnerSet = typeof game.winner === 'string' && game.winner.length > 0;

  // If anything signals "this game has been played" but winner is null,
  // that's the silent-null bug.
  if ((hasNotes || hasScores || hasResult) && !winnerSet) {
    errors.push(`${ctx}: game has notes/scores/result populated but winner is null — silent-null bug (auto-resolve and ledgers will miss this game). Set winner explicitly.`);
  }

  // If winner is set but scores aren't numbers, that's inconsistent.
  if (winnerSet && !hasScores) {
    errors.push(`${ctx}: winner set to '${game.winner}' but homeScore/awayScore are not numbers`);
  }

  // If winner is set, ensure it matches the scores (winner team scored more)
  if (winnerSet && hasScores) {
    // We don't have homeTeam/awayTeam abbr at this level — that check
    // lives in the orchestrator below where we have series context.
  }

  return errors;
}

// ---------- validateParlayCoverage (Phase 73h) -----------------
// Catches the daily-routine gap: a series has a prediction for the
// next game but FEATURED_PARLAYS forgot to author parlays for it
// (saw this with NYK-CLE G2 on 5/22 — model had projection but Home
// "Featured Parlays" was empty because the slate-builder skipped
// the second series). Without parlay coverage, the daily run silently
// ships incomplete content even though every other panel looks fine.
//
// Rule: any game with `prediction` set AND `winner` null is "upcoming
// with a model call." For each such (series, gameNum) pair, at least
// one FEATURED_PARLAYS entry must be tagged to the same slate key
// (`{round}-G{gameNum}`) AND must reference either team abbreviation
// in its name or in a leg pick string. If none match, error.
function validateParlayCoverage(seriesData, parlays) {
  const errors = [];
  if (!Array.isArray(seriesData) || !Array.isArray(parlays)) return errors;

  seriesData.forEach(s => {
    if (!s || !Array.isArray(s.games) || !s.id || !s.round) return;
    const [abbrA, abbrB] = String(s.id).split('-');
    if (!abbrA || !abbrB) return;

    s.games.forEach(g => {
      if (!g || !g.prediction) return;
      if (g.winner) return; // already settled — coverage moot
      const gameNum = g.num;
      if (typeof gameNum !== 'number') return;

      const expectedSlate = `${s.round}-G${gameNum}`;
      const matching = parlays.filter(p => {
        if (!p || p.slate !== expectedSlate) return false;
        const haystack = [
          String(p.name || ''),
          ...(Array.isArray(p.legs) ? p.legs.map(l => String(l && l.pick || '')) : []),
        ].join(' ');
        // Word-boundary check so 'SAS' doesn't match 'sass' or 'classics'
        const reA = new RegExp(`\\b${abbrA}\\b`);
        const reB = new RegExp(`\\b${abbrB}\\b`);
        return reA.test(haystack) || reB.test(haystack);
      });

      if (matching.length === 0) {
        errors.push(`PARLAY-COVERAGE: ${s.id} G${gameNum} has a model prediction but no FEATURED_PARLAYS entry on slate '${expectedSlate}' references '${abbrA}' or '${abbrB}'. Daily routine likely missed this game.`);
      }
    });
  });

  return errors;
}

// ---------- validateChsLabLedger (Phase 73m) -------------------
// CHS_LAB_LEDGER is the going-forward record of CHS Lab's reliable
// + traditional parlay outputs per upcoming game. Each entry is
// either "captured but not settled" (actual === null) or "settled
// with outcome." This validator checks schema integrity:
//   - Each entry has date / series / game / capturedAt / iterations
//   - candidates is an array (may be empty)
//   - reliable / traditional are null OR have legs[] + combinedMC
//   - actual is null OR { winner, homeScore, awayScore, margin }
//   - settlement is null OR has reliable + traditional + settledAt
//   - settled-entry outcome matches leg results (all hit → win; any
//     miss → loss; any null → outcome null)
//   - settled entries' actual.winner matches the SERIES_DATA game
function validateChsLabLedger(ledger, seriesData) {
  const errors = [];
  if (!Array.isArray(ledger)) return errors;
  const seriesById = {};
  if (Array.isArray(seriesData)) seriesData.forEach(s => { if (s && s.id) seriesById[s.id] = s; });

  ledger.forEach((e, i) => {
    const ctx = `CHS_LAB_LEDGER[${i}]`;
    if (!e || typeof e !== 'object') { errors.push(`${ctx}: not an object`); return; }
    if (!e.date || !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) errors.push(`${ctx}: missing/malformed date`);
    if (!e.series) errors.push(`${ctx}: missing series`);
    if (typeof e.game !== 'number') errors.push(`${ctx}: game must be number`);
    if (!e.capturedAt) errors.push(`${ctx}: missing capturedAt`);
    if (typeof e.iterations !== 'number' || e.iterations <= 0) errors.push(`${ctx}: iterations must be positive number`);
    if (!Array.isArray(e.candidates)) errors.push(`${ctx}: candidates must be array`);

    ['reliable', 'traditional'].forEach(tier => {
      const t = e[tier];
      if (t === null) return;                                         // null is OK
      if (typeof t !== 'object') { errors.push(`${ctx}.${tier}: must be null or object`); return; }
      if (!Array.isArray(t.legs)) errors.push(`${ctx}.${tier}: legs must be array`);
      if (typeof t.combinedMC !== 'number') errors.push(`${ctx}.${tier}: combinedMC must be number`);
      if (typeof t.americanOdds !== 'number') errors.push(`${ctx}.${tier}: americanOdds must be number`);
      if (typeof t.stake !== 'number') errors.push(`${ctx}.${tier}: stake must be number`);
    });

    // Actual + settlement come together — both null OR both set
    if (e.actual === null && e.settlement !== null) errors.push(`${ctx}: settlement set but actual is null`);
    if (e.actual !== null && e.settlement === null) errors.push(`${ctx}: actual set but settlement is null`);

    if (e.settlement) {
      ['reliable', 'traditional'].forEach(tier => {
        const meta = e[tier];
        const s = e.settlement[tier];
        if (meta === null && s !== null) errors.push(`${ctx}: ${tier} settlement set but tier itself was null`);
        if (s === null) return;
        if (!s || typeof s !== 'object') { errors.push(`${ctx}.settlement.${tier}: must be null or object`); return; }
        if (!['win', 'loss', null].includes(s.outcome)) errors.push(`${ctx}.settlement.${tier}: invalid outcome '${s.outcome}'`);
        if (typeof s.pnl !== 'number') errors.push(`${ctx}.settlement.${tier}: pnl must be number`);
        if (!Array.isArray(s.legResults)) errors.push(`${ctx}.settlement.${tier}: legResults must be array`);
        // Outcome consistency: all hits → win; any miss → loss; any null → null outcome
        if (Array.isArray(s.legResults) && s.legResults.length > 0) {
          const allHit = s.legResults.every(lr => lr.hit === true);
          const anyMiss = s.legResults.some(lr => lr.hit === false);
          const anyNull = s.legResults.some(lr => lr.hit == null);
          if (anyNull && s.outcome !== null) errors.push(`${ctx}.settlement.${tier}: leg(s) unresolved but outcome=${s.outcome}`);
          if (!anyNull && allHit && s.outcome !== 'win') errors.push(`${ctx}.settlement.${tier}: all legs hit but outcome=${s.outcome}`);
          if (!anyNull && anyMiss && s.outcome !== 'loss') errors.push(`${ctx}.settlement.${tier}: leg miss but outcome=${s.outcome}`);
        }
      });

      // actual.winner must match the actual SERIES_DATA game
      const series = seriesById[e.series];
      const game = series && series.games && series.games[e.game - 1];
      if (game && game.winner && e.actual && e.actual.winner !== game.winner) {
        errors.push(`${ctx}: actual.winner='${e.actual.winner}' doesn't match SERIES_DATA[${e.series}].games[${e.game - 1}].winner='${game.winner}'`);
      }
    }
  });
  return errors;
}

// ---------- orchestrator ---------------------------------------
function validateAll(seriesData, bets, parlays, betSlates, chsLabLedger) {
  const errors = [];
  if (!Array.isArray(seriesData)) {
    errors.push('SERIES_DATA is not an array');
    return errors;
  }

  const seriesIds = new Set(seriesData.map(s => s && s.id).filter(Boolean));

  // Predictions on every game with a prediction object
  // PHASE 66: also validate the game's result-side fields are consistent
  // (notes populated → winner must be set; winner must match home/away abbr).
  seriesData.forEach(s => {
    if (!s || !Array.isArray(s.games)) return;
    const homeAbbr = s.homeTeam && s.homeTeam.abbr;
    const awayAbbr = s.awayTeam && s.awayTeam.abbr;
    s.games.forEach((g, i) => {
      if (g && g.prediction) {
        errors.push(...validatePrediction(g.prediction, `${s.id}.G${i + 1}`));
      }
      // Game-result consistency check
      const gameErrs = validateGameResult(g, `${s.id}.G${i + 1}`);
      errors.push(...gameErrs);
      // Cross-check: winner abbr should match home or away abbr
      if (g && g.winner && homeAbbr && awayAbbr) {
        if (g.winner !== homeAbbr && g.winner !== awayAbbr) {
          errors.push(`${s.id}.G${i + 1}: winner='${g.winner}' doesn't match homeTeam.abbr (${homeAbbr}) or awayTeam.abbr (${awayAbbr})`);
        }
        // Winner-vs-scores consistency
        if (typeof g.homeScore === 'number' && typeof g.awayScore === 'number') {
          const homeWon = g.homeScore > g.awayScore;
          const winnerIsHome = g.winner === homeAbbr;
          if (homeWon !== winnerIsHome && g.homeScore !== g.awayScore) {
            errors.push(`${s.id}.G${i + 1}: winner='${g.winner}' inconsistent with scores (home ${g.homeScore}, away ${g.awayScore})`);
          }
        }
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

  // PHASE 73h: parlay coverage on upcoming predicted games
  if (Array.isArray(parlays)) {
    errors.push(...validateParlayCoverage(seriesData, parlays));
  }

  // PHASE 73m: CHS Lab ledger schema (optional — only when passed)
  if (chsLabLedger != null) {
    errors.push(...validateChsLabLedger(chsLabLedger, seriesData));
  }

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
