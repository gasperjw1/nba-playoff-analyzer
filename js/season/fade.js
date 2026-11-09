// ============================================================
// FADE NB.AI — spec fade-1 (FADE_SPEC.md): moderate favourites NB.AI doubts
// ============================================================
// On the ledger's first 33 NB.AI games (research-nbai-record.js), market
// favourites priced 50–70% won 8 of 8 when NB.AI leaned 8+ points toward the
// underdog, and 5 of 11 when it didn't. That split was found after the fact
// on a tiny sample, so this only tracks it from here on:
//   fade     the market favourite, no-vig 50% to under 70% (as the ledger recorded
//            it), when NB.AI's chance for that side is at least 8 points lower
//   control  the other 50–70% favourites on NB.AI nights (NB.AI less than 8 points lower,
//            or higher than the market)
// The question is whether fade beats control, not just its price: favourites
// have beaten their prices all season, with or without NB.AI. Both are priced
// at the DraftKings moneyline the ledger recorded before tip, and at the close.
// A tracker, not a pick; the stake is flat-1's unit (the user's own).
//
// Uses (globals): SEASON_FLAT_SPEC, flatRecord (flat.js).
// ============================================================
const SEASON_FADE_SPEC = { version: 'fade-1', frozen: '2026-11-09', firstNight: '2026-11-10', favMin: 0.5, favMax: 0.7, gap: 0.08 };

const _fadeMl = (a) => typeof a === 'number' && isFinite(a) && Math.abs(a) >= 100;

// One ledger row → {group: 'fade' | 'control', team, side, odds, close, pFav, pNbai, hit}, or null
// (not an NB.AI night, no price, or no 50–70% favourite).
function fadeClassify(r) {
  const S = SEASON_FADE_SPEC;
  if (!r || r.pFriend == null || r.pMarket == null || !_fadeMl(r.mlHome) || !_fadeMl(r.mlAway)) return null;
  const home = r.pMarket > 0.5;
  const pFav = home ? r.pMarket : 1 - r.pMarket;
  if (!(pFav > S.favMin && pFav < S.favMax)) return null;
  const pNbai = home ? r.pFriend : 1 - r.pFriend;
  const c = r.close || {};
  const close = home ? c.mlHome : c.mlAway;
  const hit = !r.result || r.result.homeScore == null ? null : home ? r.result.homeScore > r.result.awayScore : r.result.awayScore > r.result.homeScore;
  return { group: pFav - pNbai >= S.gap - 1e-9 ? 'fade' : 'control', date: r.date, gameId: r.id, team: home ? r.home : r.away, opp: home ? r.away : r.home,
    side: home ? 'home' : 'away', odds: home ? r.mlHome : r.mlAway, close: _fadeMl(close) ? close : null, pFav: +pFav.toFixed(4), pNbai: +pNbai.toFixed(4), hit };
}

// Records for the page and --settle; the clean line counts from firstNight.
function seasonFadeSummary(rows) {
  const S = SEASON_FADE_SPEC;
  const all = (rows || []).map(fadeClassify).filter(Boolean);
  const clean = all.filter(b => b.date >= S.firstNight);
  const rec = (bs) => flatRecord(bs);
  const atClose = (bs) => flatRecord(bs.filter(b => b.close != null).map(b => ({ odds: b.close, hit: b.hit })));
  const block = (bs) => {
    const f = bs.filter(b => b.group === 'fade'), c = bs.filter(b => b.group === 'control');
    return { fade: rec(f), fadeClose: atClose(f), control: rec(c), controlClose: atClose(c) };
  };
  return { clean: block(clean), all: block(all), first: all.length ? all.reduce((a, b) => b.date < a ? b.date : a, all[0].date) : null };
}

// A night's fade bets from the ledger rows recorded for it.
function fadeTonight(rows, date) {
  return (rows || []).filter(r => r.date === date).map(fadeClassify).filter(b => b && b.group === 'fade');
}
