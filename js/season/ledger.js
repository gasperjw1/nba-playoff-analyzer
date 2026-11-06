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

// The same slate with every team's prior from last season's final ratings (team-ratings.js,
// Basketball-Reference) instead of the feed's — NB.AI's "prior" already contains this season's
// games, which the engine then blends in again. Recorded beside the main prediction so the two
// can be compared on games neither has seen. Null when team-ratings.js is not loaded.
function seasonCleanSlate(slate) {
  if (typeof SEASON_TEAM_RATINGS === 'undefined' || !SEASON_TEAM_RATINGS || !slate) return null;
  const R = SEASON_TEAM_RATINGS.teams, teams = {};
  for (const [abbr, t] of Object.entries(slate.teams)) teams[abbr] = R[abbr] ? { ...t, prior: R[abbr].prior } : t;
  return { ...slate, teams, league: deriveLeagueAverages(R) };
}

// Last season's ratings with this season's results corrected for opponents
// (seasonOpponentAdjust). Needs slate.results, this season's finals so far,
// and every team in them: an NB.AI slate carries only tonight's teams, and
// walking just the games among those would rate form on a handful of games.
function seasonOppAdjSlate(slate) {
  const clean = seasonCleanSlate(slate);
  if (!clean || !Array.isArray(slate.results)) return null;
  if (slate.results.some(g => !clean.teams[g.home] || !clean.teams[g.away])) return null;
  return { ...clean, teams: seasonOpponentAdjust(clean.teams, clean.league, slate.results) };
}

function buildLedgerEntry(game, projection, blend, slate, clean, adj) {
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
    // Same engine, last season's final team ratings (seasonCleanSlate)
    pOursClean: clean ? clean.pHome : null,
    marginOursClean: clean ? clean.margin : null,
    totalOursClean: clean ? clean.total : null,
    // Same, with this season's results opponent-adjusted (seasonOppAdjSlate)
    pOursAdj: adj ? adj.pHome : null,
    marginOursAdj: adj ? adj.margin : null,
    totalOursAdj: adj ? adj.total : null,
    // Frozen trust rules (trust.js) on the picks engine at the price when recorded
    trust: clean && typeof seasonTrustCheck === 'function' ? seasonTrustCheck(clean, m) : null,
    pFriend: typeof friend === 'number' ? +friend.toFixed(4) : null,
    pMarket: blend.pMarket,
    pBlend: blend.pBlend,
    mlHome: m.mlHome != null ? m.mlHome : null,
    mlAway: m.mlAway != null ? m.mlAway : null,
    spreadHome: m.spreadHome != null ? m.spreadHome : null,
    totalMarket: m.total != null ? m.total : null,
    book: m.book || null,
    feedVersion: slate.modelVersion || null,
    source: slate.source || null,          // 'nb.ai', or 'espn' for the fallback slate

    engine: SEASON_ENGINE_VERSION,
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
  // A committed row is evidence: a browser-local row with the same id can add a result it lacks,
  // never change its prices, predictions or trust check.
  _readLocalLedger().forEach(r => { const c = byId[r.id]; byId[r.id] = c ? { ...c, result: c.result || r.result || null, origin: 'committed+local' } : { ...r, origin: 'local' }; });
  return Object.values(byId).sort((a, b) => (a.tip || a.date || '').localeCompare(b.tip || b.date || ''));
}

// An ESPN-fallback row (NB.AI had not refreshed) is a stand-in: a later
// pre-tip record replaces it. Every other recorded row is final.
function _isReplaceableRow(row) { return !!row && row.source === 'espn' && !row.result; }

// Merge tonight's entries into `rows` in place (fetch-slate.js --record).
// Never after tip-off; an existing row is kept unless it is replaceable.
function mergeLedgerEntries(rows, entries, now) {
  let added = 0, replaced = 0, late = 0;
  entries.forEach(e => {
    const at = rows.findIndex(r => r.id === e.id);
    if (e.tip && new Date(e.tip) <= now) { if (at < 0) late++; return; }
    if (at < 0) { rows.push(e); added++; }
    else if (_isReplaceableRow(rows[at])) { rows[at] = e; replaced++; }
  });
  return { added, replaced, late };
}

// Add entries without overwriting an existing pre-tip record. The browser
// never replaces a committed row (fetch-slate.js --record does that); it
// may replace its own replaceable fallback row.
function recordSeasonEntries(entries) {
  const local = _readLocalLedger();
  const committed = new Set(((typeof SEASON_LEDGER !== 'undefined' && Array.isArray(SEASON_LEDGER)) ? SEASON_LEDGER : []).map(r => r.id));
  let added = 0;
  entries.forEach(e => {
    if (committed.has(e.id)) return;
    const at = local.findIndex(r => r.id === e.id);
    if (at >= 0 && !_isReplaceableRow(local[at])) return;
    if (at >= 0) local[at] = e; else local.push(e);
    added++;
  });
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
