// ============================================================
// SEASON LEDGER — the out-of-sample record both models are scored on
// ============================================================
// Two layers merged by game id:
//   SEASON_LEDGER      committed rows (js/season/data/season-ledger.js),
//                      written by `node fetch-slate.js --record/--settle`
//   localStorage       rows added or settled in the browser
// A prediction is only meaningful if recorded BEFORE tip-off; the
// `recordedAt` stamp is kept so the scoring can prove it.
// ============================================================

function buildLedgerEntry(game, projection, blend, slate) {
  const m = game.market || {};
  const friend = game.external && game.external.nbai ? game.external.nbai.pHome : null;
  return {
    id: game.id,
    date: slate.date,
    tip: game.tip,
    home: game.home, away: game.away,
    pOurs: projection.pHome,
    marginOurs: projection.margin,
    totalOurs: projection.total,
    pFriend: typeof friend === 'number' ? +friend.toFixed(4) : null,
    pMarket: blend.pMarket,
    pBlend: blend.pBlend,
    mlHome: m.mlHome != null ? m.mlHome : null,
    mlAway: m.mlAway != null ? m.mlAway : null,
    spreadHome: m.spreadHome != null ? m.spreadHome : null,
    totalMarket: m.total != null ? m.total : null,
    feedVersion: slate.modelVersion || null,
    recordedAt: new Date().toISOString(),
    result: null,
  };
}

function _readLocalLedger() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(SEASON_LEDGER_STORAGE_KEY) : null;
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}
function _writeLocalLedger(rows) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(SEASON_LEDGER_STORAGE_KEY, JSON.stringify(rows)); } catch (e) { /* storage unavailable */ }
}

// Committed rows first, then local rows override by id.
function loadSeasonLedger() {
  const committed = (typeof SEASON_LEDGER !== 'undefined' && Array.isArray(SEASON_LEDGER)) ? SEASON_LEDGER : [];
  const byId = {};
  committed.forEach(r => { byId[r.id] = { ...r, origin: 'committed' }; });
  _readLocalLedger().forEach(r => { byId[r.id] = { ...(byId[r.id] || {}), ...r, origin: byId[r.id] ? 'committed+local' : 'local' }; });
  return Object.values(byId).sort((a, b) => (a.tip || a.date || '').localeCompare(b.tip || b.date || ''));
}

// Add entries without overwriting an existing pre-tip record.
function recordSeasonEntries(entries) {
  const local = _readLocalLedger();
  const existing = new Set(loadSeasonLedger().map(r => r.id));
  let added = 0;
  entries.forEach(e => { if (!existing.has(e.id)) { local.push(e); existing.add(e.id); added++; } });
  _writeLocalLedger(local);
  return { added, skipped: entries.length - added };
}

function settleSeasonEntry(id, homeScore, awayScore) {
  const local = _readLocalLedger();
  const all = loadSeasonLedger();
  const row = all.find(r => r.id === id);
  if (!row) return false;
  const result = { homeScore: Number(homeScore), awayScore: Number(awayScore), settledAt: new Date().toISOString() };
  const idx = local.findIndex(r => r.id === id);
  if (idx >= 0) local[idx] = { ...local[idx], result };
  else local.push({ ...row, origin: undefined, result });
  _writeLocalLedger(local);
  return true;
}

function clearLocalSeasonLedger() { _writeLocalLedger([]); }

function exportSeasonLedgerJson() {
  return JSON.stringify(loadSeasonLedger().map(r => { const { origin, ...rest } = r; return rest; }), null, 2);
}
