// ============================================================
// HOME / LANDING PAGE
// ============================================================
// Three stacked panels:
//   1. Today's games — matchup + blended-model pick + 1-2 line reasoning
//   2. Latest news    — curated injury/availability notes from NEWS
//   3. Today's bets   — unresolved BETS for today's slate
// Plus an optional "Tomorrow" games panel when more games are scheduled.
// ============================================================

// Slate → series → game-date lookup.
// Tier 1.2: now DERIVED from BET_SLATES.games[i].date (the single source
// of truth). This eliminates the May 7 SAS-MIN bug class where the date
// was encoded in two places and they got out of sync.
const SLATE_GAME_DATES = (function deriveSlateGameDates() {
  const map = {};
  if (typeof BET_SLATES === 'undefined') return map;
  Object.entries(BET_SLATES).forEach(([slateKey, slate]) => {
    if (!slate || !Array.isArray(slate.games)) return;
    map[slateKey] = {};
    slate.games.forEach(g => {
      if (g && g.series && g.date) map[slateKey][g.series] = g.date;
    });
  });
  return map;
})();

function homeAddDays(yyyymmdd, n) {
  const [y, m, d] = yyyymmdd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

function homeFormatDate(yyyymmdd) {
  const [y, m, d] = yyyymmdd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC',
  });
}

// Find the series object in SERIES_DATA for a given BET_SLATES series key
// (e.g. 'NYK-PHI'). Falls back to SERIES_DATA.id substring match.
// HOTFIX (May 18): null/undefined input no longer crashes — Phase 72
// news entries can set series:null when the item isn't tied to a series
// (e.g. "East CF on hold" general system note).
function homeFindSeries(seriesKey) {
  if (!seriesKey || typeof seriesKey !== 'string') return null;
  const lc = seriesKey.toLowerCase();
  return SERIES_DATA.find(s => s.id && s.id.toLowerCase().endsWith(lc))
      || SERIES_DATA.find(s => s.id && s.id.toLowerCase().includes(lc));
}

// All scheduled-but-unplayed games on a given date.
// Returns: [{ slate, seriesKey, when, context, recap, series, gameNum }]
function homeGamesOn(date) {
  const games = [];
  Object.entries(SLATE_GAME_DATES).forEach(([slate, seriesMap]) => {
    Object.entries(seriesMap).forEach(([seriesKey, gameDate]) => {
      if (gameDate !== date) return;
      const slateMeta = BET_SLATES[slate];
      if (!slateMeta) return;
      const slateGame = slateMeta.games.find(g => g.series === seriesKey);
      if (!slateGame) return;
      const series = homeFindSeries(seriesKey);
      if (!series) return;
      // CF scaffolds with tbdOpponent or awayTeam.tbd have empty players[]
      // arrays — the engine (calcBlendedProjection in homeRenderGameCard)
      // will crash if we let them through. Series Analysis renderer has
      // the same guard. Skip cleanly so the card just doesn't render.
      if (series.tbdOpponent || (series.awayTeam && series.awayTeam.tbd)) return;
      // gameNum = the game number for this slate. R2-G1 → 1, R2-G2 → 2, etc.
      const gameNum = parseInt((slate.match(/G(\d)/) || [, '1'])[1], 10);
      // Skip if that game has already been played
      const played = (series.games || [])[gameNum - 1] && series.games[gameNum - 1].winner;
      if (played) return;
      games.push({ slate, seriesKey, slateGame, series, gameNum });
    });
  });
  return games;
}

function homeRenderGameCard(g) {
  const series = g.series;
  const blend = calcBlendedProjection(series, series.id, g.gameNum);
  const absMargin = Math.round(Math.abs(blend.blendedMargin));
  const winner = blend.blendedWinner;
  const winProb = Math.min(95, Math.round(50 + absMargin * 3));
  const favColor = winProb >= 70 ? '#3dd68c' : winProb >= 58 ? '#60a5fa' : '#f59e0b';
  const seriesIdx = SERIES_DATA.indexOf(series);
  // Strip leading <strong> and use just the first sentence of the recap
  // for the at-a-glance line. Falls back gracefully if recap is empty.
  const recapHtml = g.slateGame.recap || '';
  const sentence = recapHtml
    .replace(/<[^>]+>/g, '')
    .split(/(?<=[.!])\s+/)[0]
    .slice(0, 220);

  return `
    <div class="home-game-card" onclick="switchPage('series'); switchSeries(${seriesIdx});">
      <div class="home-game-head">
        <span class="home-game-matchup">(${series.homeTeam.seed}) ${series.homeTeam.abbr} vs (${series.awayTeam.seed}) ${series.awayTeam.abbr}</span>
        <span class="home-game-when">${g.slateGame.when}</span>
      </div>
      <div class="home-game-pick" style="color:${favColor};">${winner} ${winProb}% &middot; <span class="home-game-margin">${blend.blendedScore}</span></div>
      <div class="home-game-context">${g.slateGame.context}</div>
      ${sentence ? `<div class="home-game-line">${sentence}</div>` : ''}
      <div class="home-game-link">Open series &rarr;</div>
    </div>`;
}

function homeRenderNewsItem(n) {
  const sevColor = n.severity === 'major' ? '#ef4444'
                 : n.severity === 'minor' ? '#f59e0b'
                 : '#60a5fa';
  const series = homeFindSeries(n.series);
  const seriesIdx = series ? SERIES_DATA.indexOf(series) : -1;
  const linkAttrs = seriesIdx >= 0
    ? `onclick="switchPage('series'); switchSeries(${seriesIdx});" style="cursor:pointer;"`
    : '';
  const dateLabel = homeFormatDate(n.date);
  return `
    <div class="home-news-item" ${linkAttrs}>
      <div class="home-news-meta">
        <span class="home-news-sev" style="background:${sevColor};"></span>
        <span class="home-news-date">${dateLabel}</span>
        <span class="home-news-series">${n.series || 'general'}</span>
      </div>
      <div class="home-news-headline">${n.headline}</div>
      <div class="home-news-body">${n.body}</div>
      <div class="home-news-source">Source: ${n.source}</div>
    </div>`;
}

function homeRenderParlay(p) {
  const isResolved = !!p.result;
  const won = isResolved && p.result.outcome === 'win';
  const lost = isResolved && p.result.outcome === 'loss';
  const accentColor = p.type === 'best-bet' ? '#a78bfa'
                    : p.type === 'chaos'    ? '#ff9800'
                    :                         '#60a5fa';
  const stateColor = won ? '#3dd68c' : lost ? '#ef4444' : accentColor;
  const stateBadge = won  ? '<span class="home-parlay-state win">&check; WON</span>'
                  : lost ? '<span class="home-parlay-state loss">&cross; LOST</span>'
                  :        '';
  const legsHtml = p.legs.map((l, i) => {
    const legState = l.status === 'hit'  ? '<span class="home-parlay-leg-state hit">&check;</span>'
                   : l.status === 'miss' ? '<span class="home-parlay-leg-state miss">&cross;</span>'
                   :                       '';
    return `
      <div class="home-parlay-leg">
        <span class="home-parlay-leg-num">${i + 1}</span>
        <span class="home-parlay-leg-pick">${l.pick}</span>
        <span class="home-parlay-leg-odds">${l.odds}</span>
        ${legState}
        ${l.note ? `<div class="home-parlay-leg-note">${l.note}</div>` : ''}
      </div>`;
  }).join('');
  const payoutBadge = p.payout ? `<span class="home-parlay-payout" style="color:${stateColor};">${p.payout}</span>` : '';
  return `
    <div class="home-parlay-card" style="border-left:3px solid ${stateColor};">
      <div class="home-parlay-head">
        <span class="home-parlay-name" style="color:${stateColor};">${p.name}</span>
        <span class="home-parlay-odds">${p.odds}</span>
        ${payoutBadge}
        ${stateBadge}
      </div>
      <div class="home-parlay-legs">${legsHtml}</div>
      <div class="home-parlay-thesis">${p.thesis}</div>
    </div>`;
}

function homeRenderFeaturedParlays() {
  const live = FEATURED_PARLAYS.filter(p => !p.result);
  const floor       = live.filter(p => p.category === 'floor');
  const traditional = live.filter(p => p.category === 'traditional');

  if (!floor.length && !traditional.length) {
    return '<div class="home-empty">No live featured parlays right now.</div>';
  }

  const floorGrid = floor.length
    ? `<div class="home-parlay-grid">${floor.map(homeRenderParlay).join('')}</div>`
    : '<div class="home-empty">No reliable floor parlays today.</div>';
  const tradGrid = traditional.length
    ? `<div class="home-parlay-grid">${traditional.map(homeRenderParlay).join('')}</div>`
    : '<div class="home-empty">No traditional parlays today.</div>';

  // Both grids render; toggle swaps visibility client-side via homeSetParlayMode.
  return `
    <div class="home-parlay-toggle">
      <button data-mode="floor" class="active" onclick="homeSetParlayMode('floor')">&#x1f6e1; Reliable Floor</button>
      <button data-mode="traditional" onclick="homeSetParlayMode('traditional')">Traditional</button>
    </div>
    <div class="home-parlay-pane" data-mode="floor">${floorGrid}</div>
    <div class="home-parlay-pane" data-mode="traditional" style="display:none;">${tradGrid}</div>`;
}

function homeSetParlayMode(mode) {
  document.querySelectorAll('.home-parlay-pane').forEach(pane => {
    pane.style.display = pane.dataset.mode === mode ? '' : 'none';
  });
  document.querySelectorAll('.home-parlay-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
}

function homeRenderBetsForDate(date) {
  // Find all unresolved bets whose game is today.
  const betsToday = BETS.filter(b => {
    if (b.result) return false;
    const gameDate = (SLATE_GAME_DATES[b.slate] || {})[b.series];
    return gameDate === date;
  });

  if (!betsToday.length) {
    return '<div class="home-empty">No live bets for tonight.</div>';
  }

  // Group by series so the page reads cleanly.
  const bySeries = {};
  betsToday.forEach(b => {
    bySeries[b.series] = bySeries[b.series] || [];
    bySeries[b.series].push(b);
  });

  // Re-use the Phase 55 declarative renderer. One column per series.
  const groupsHtml = Object.entries(bySeries).map(([seriesKey, list]) => {
    const series = homeFindSeries(seriesKey);
    if (!series) return '';
    // CF scaffolds with tbdOpponent have empty players[] — calcBlendedProjection
    // would crash. Skip these bets cleanly; the CF tab UI will surface them
    // once full rosters land.
    if (series.tbdOpponent || (series.awayTeam && series.awayTeam.tbd)) return '';
    const dml = (h, a) => {
      const blend = calcBlendedProjection(series, series.id, list[0].game);
      return blend.blendedWinner;
    };
    const dmargin = (h, a) => {
      const blend = calcBlendedProjection(series, series.id, list[0].game);
      return Math.abs(Math.round(blend.blendedMargin * 10) / 10);
    };
    const dwinner = dml;
    const cardsHtml = list.map(b => renderBetCard(b, { dml, dmargin, dwinner })).join('');
    return `
      <div class="home-bet-group">
        <div class="home-bet-group-head">${seriesKey}</div>
        <div class="home-bet-group-cards">${cardsHtml}</div>
      </div>`;
  }).join('');

  // Auto-fit grid: 1 game → full-width; 2+ games → side-by-side per series.
  return `<div class="home-bet-grid">${groupsHtml}</div>`;
}

function renderHomePage(el) {
  const today = (typeof CURRENT_DATE !== 'undefined') ? CURRENT_DATE : '2026-05-06';
  const tomorrow = homeAddDays(today, 1);

  const todaysGames = homeGamesOn(today);
  const tomorrowsGames = homeGamesOn(tomorrow);
  // Phase 67 (May 16): sort NEWS by date desc before slicing. Was
  // NEWS.slice(0, 6) which returned the first 6 in array order — but
  // we append new items to the end, so the home page was showing
  // the OLDEST 6 entries (5/4-5/7) instead of the most recent.
  const recentNews = [...NEWS].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 6);

  // Phase 67: off-day fallback — when today has no scheduled games,
  // scan forward to find the next game date and surface those bets.
  // Phase 72 (May 18): extended from 1-day lookahead to 5-day scan
  // because R3 has multi-day rest gaps (e.g. R2 finishes 5/15 → R3 G1
  // ~5/20 = 4 days of nothing). The 1-day fallback left an empty Home
  // page during the most-interesting prep window.
  function findNextGameDate(start, maxDaysAhead) {
    if (homeGamesOn(start).length > 0) return start;
    for (let i = 1; i <= maxDaysAhead; i++) {
      const d = homeAddDays(start, i);
      if (homeGamesOn(d).length > 0) return d;
    }
    return start;  // fall back to today (will show empty state honestly)
  }
  const betsDate = findNextGameDate(today, 5);
  const betsLabel = betsDate === today ? "Tonight's Bets"
                                       : betsDate === tomorrow ? `Tomorrow's Bets (${homeFormatDate(tomorrow)})`
                                       : `Upcoming Bets (${homeFormatDate(betsDate)})`;

  // Layout decision: with 2+ games, the per-game bet columns alone fill the
  // row, so News goes full-width above. With 1 game (single-game days in CF /
  // Finals), News + Bets sit side-by-side so neither column looks stranded.
  const useStackedLayout = homeGamesOn(betsDate).length >= 2;

  const newsSection = `
    <section class="home-section">
      <h2 class="home-section-title">Latest News</h2>
      ${recentNews.map(homeRenderNewsItem).join('')}
    </section>`;

  const betsSection = `
    <section class="home-section">
      <h2 class="home-section-title">${betsLabel}</h2>
      ${homeRenderBetsForDate(betsDate)}
    </section>`;

  const newsAndBets = useStackedLayout
    ? `${newsSection}${betsSection}`
    : `<div class="home-row">${newsSection}${betsSection}</div>`;

  el.innerHTML = `
    <div class="home-page">

      <section class="home-section">
        <h2 class="home-section-title">Tonight &middot; ${homeFormatDate(today)}</h2>
        ${todaysGames.length
          ? `<div class="home-game-grid">${todaysGames.map(homeRenderGameCard).join('')}</div>`
          : '<div class="home-empty">No scheduled games today.</div>'}
      </section>

      <section class="home-section">
        <h2 class="home-section-title">Featured Parlays</h2>
        ${homeRenderFeaturedParlays()}
      </section>

      ${newsAndBets}

      ${tomorrowsGames.length ? `
      <section class="home-section">
        <h2 class="home-section-title">Tomorrow &middot; ${homeFormatDate(tomorrow)}</h2>
        <div class="home-game-grid">${tomorrowsGames.map(homeRenderGameCard).join('')}</div>
      </section>` : ''}

    </div>`;
}
