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
// Kept here (not in bets-data) so this page owns its own filtering logic
// and bets-data stays a flat record set.
const SLATE_GAME_DATES = {
  'R2-G1': {
    'NYK-PHI': '2026-05-04',
    'SAS-MIN': '2026-05-04',
    'DET-CLE': '2026-05-05',
    'OKC-LAL': '2026-05-05',
  },
  'R2-G2': {
    'NYK-PHI': '2026-05-06',
    'SAS-MIN': '2026-05-07',
    'DET-CLE': '2026-05-07',
    'OKC-LAL': '2026-05-07',
  },
};

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
function homeFindSeries(seriesKey) {
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
        <span class="home-news-series">${n.series}</span>
      </div>
      <div class="home-news-headline">${n.headline}</div>
      <div class="home-news-body">${n.body}</div>
      <div class="home-news-source">Source: ${n.source}</div>
    </div>`;
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

  // Re-use the Phase 55 declarative renderer.
  return Object.entries(bySeries).map(([seriesKey, list]) => {
    const series = homeFindSeries(seriesKey);
    if (!series) return '';
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
}

function renderHomePage(el) {
  const today = (typeof CURRENT_DATE !== 'undefined') ? CURRENT_DATE : '2026-05-06';
  const tomorrow = homeAddDays(today, 1);

  const todaysGames = homeGamesOn(today);
  const tomorrowsGames = homeGamesOn(tomorrow);
  const recentNews = NEWS.slice(0, 6); // newest 6, NEWS is already chronologically reverse-sorted

  el.innerHTML = `
    <div class="home-page">

      <section class="home-section">
        <h2 class="home-section-title">Tonight &middot; ${homeFormatDate(today)}</h2>
        ${todaysGames.length
          ? `<div class="home-game-grid">${todaysGames.map(homeRenderGameCard).join('')}</div>`
          : '<div class="home-empty">No scheduled games today.</div>'}
      </section>

      <div class="home-row">
        <section class="home-section">
          <h2 class="home-section-title">Latest News</h2>
          ${recentNews.map(homeRenderNewsItem).join('')}
        </section>

        <section class="home-section">
          <h2 class="home-section-title">Tonight's Bets</h2>
          ${homeRenderBetsForDate(today)}
        </section>
      </div>

      ${tomorrowsGames.length ? `
      <section class="home-section">
        <h2 class="home-section-title">Tomorrow &middot; ${homeFormatDate(tomorrow)}</h2>
        <div class="home-game-grid">${tomorrowsGames.map(homeRenderGameCard).join('')}</div>
      </section>` : ''}

    </div>`;
}
