// ============================================================
// CHS LAB — Shadow accuracy panel for the Compound Historical
// Scenarios engine (May 9, 2026)
// ============================================================
// Production pages run with USE_CHS_IN_PROJECTIONS = false in
// constants.js. The CHS Lab tab is the parallel view that surfaces
// what CHS would predict and tracks its accuracy against the bare
// engine. Promote when CHS clears: winner hit ≥ main + 10pp AND
// margin MAE ≤ main − 1.5pts over a 10-game window.
//
// Sections:
//   1. Aggregate scoreboard — current main vs CHS hit rate + MAE
//   2. Live preview — upcoming games with main + CHS side-by-side
//   3. Ledger — resolved games with hit/miss + per-row error
// ============================================================

function chsLabComputeAggregate(ledger) {
  const total = ledger.length;
  if (!total) return { total: 0, mainHits: 0, chsHits: 0, mainMAE: 0, chsMAE: 0 };
  let mainHits = 0, chsHits = 0, mainErr = 0, chsErr = 0, chsCount = 0;
  ledger.forEach(e => {
    if (e.mainPred && e.mainPred.winner === e.actual.winner) mainHits++;
    if (e.chsPred && e.chsPred.winner === e.actual.winner) chsHits++;
    if (e.mainPred && typeof e.mainPred.margin === 'number') mainErr += Math.abs(e.mainPred.margin - e.actual.margin);
    if (e.chsPred && typeof e.chsPred.margin === 'number') {
      chsErr += Math.abs(e.chsPred.margin - e.actual.margin);
      chsCount++;
    }
  });
  return {
    total,
    mainHits, chsHits,
    mainHitPct: (mainHits / total * 100).toFixed(0),
    chsHitPct: (chsHits / total * 100).toFixed(0),
    mainMAE: (mainErr / total).toFixed(2),
    chsMAE: chsCount ? (chsErr / chsCount).toFixed(2) : '—',
  };
}

function chsLabRenderScoreboard(agg) {
  const winnerLead = agg.chsHits - agg.mainHits;
  const maeLead = (agg.mainMAE !== '—' && agg.chsMAE !== '—')
    ? +agg.mainMAE - +agg.chsMAE
    : null;
  const winnerColor = winnerLead >= 1 ? 'var(--green)' : winnerLead < 0 ? 'var(--red)' : 'var(--yellow)';
  const maeColor = maeLead === null ? 'var(--text-dim)' : maeLead >= 1.5 ? 'var(--green)' : maeLead <= 0 ? 'var(--red)' : 'var(--yellow)';
  const promoteWinner = winnerLead >= Math.ceil(agg.total * 0.10);
  const promoteMAE = maeLead !== null && maeLead >= 1.5;
  const verdict = (agg.total < 10)
    ? `<span style="color:var(--text-dim);">awaiting 10-game minimum (${agg.total}/10)</span>`
    : (promoteWinner && promoteMAE)
      ? `<span style="color:var(--green);font-weight:700;">✅ CHS clears promotion bar — eligible to flip USE_CHS_IN_PROJECTIONS</span>`
      : `<span style="color:var(--text-dim);">CHS short of promotion: winner ${promoteWinner ? '✓' : '✗'} | MAE ${promoteMAE ? '✓' : '✗'}</span>`;

  return `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:12px;padding:18px;margin-bottom:24px;">
      <div style="font-size:11px;letter-spacing:1px;color:var(--text-dim);margin-bottom:14px;">CHS SHADOW ACCURACY · ${agg.total} GAME${agg.total === 1 ? '' : 'S'}</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:16px;margin-bottom:14px;">
        <div>
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;">Main winner</div>
          <div style="font-size:24px;font-weight:700;">${agg.mainHits}/${agg.total} <span style="font-size:14px;color:var(--text-dim);">(${agg.mainHitPct}%)</span></div>
        </div>
        <div>
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;">CHS winner</div>
          <div style="font-size:24px;font-weight:700;color:${winnerColor};">${agg.chsHits}/${agg.total} <span style="font-size:14px;">(${agg.chsHitPct}%)</span></div>
        </div>
        <div>
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;">Main MAE</div>
          <div style="font-size:24px;font-weight:700;">${agg.mainMAE} <span style="font-size:12px;color:var(--text-dim);">pts</span></div>
        </div>
        <div>
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;">CHS MAE</div>
          <div style="font-size:24px;font-weight:700;color:${maeColor};">${agg.chsMAE} <span style="font-size:12px;">pts</span></div>
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:10px;font-size:12px;">
        Winner Δ: <strong style="color:${winnerColor};">${winnerLead >= 0 ? '+' : ''}${winnerLead}</strong>
        &nbsp;·&nbsp; MAE Δ: <strong style="color:${maeColor};">${maeLead === null ? '—' : (maeLead >= 0 ? '−' : '+') + Math.abs(maeLead).toFixed(2) + ' pts'}</strong>
        &nbsp;·&nbsp; ${verdict}
      </div>
      <div style="margin-top:8px;font-size:11px;color:var(--text-dim);">
        Promote when winner Δ ≥ +${Math.ceil(agg.total * 0.10) || 1}pp AND MAE Δ ≥ −1.5 pts. Both must clear.
      </div>
    </div>`;
}

function chsLabRenderLivePreview() {
  if (typeof SERIES_DATA === 'undefined' || typeof calcBlendedProjectionWithCHS !== 'function') return '';
  // Phase 73b: include both R2 (in case any remain unresolved) AND
  // CF series. Filter out TBD scaffolds (no rosters). Sort by round so
  // CF games render first while live.
  const activeSeries = SERIES_DATA.filter(s =>
    (s.round === 'R2' || s.round === 'CF' || s.round === 'Finals') &&
    !s.tbdOpponent &&
    s.homeTeam && Array.isArray(s.homeTeam.players) && s.homeTeam.players.length > 0
  ).sort((a, b) => {
    const order = { 'CF': 0, 'Finals': 1, 'R2': 2 };
    return (order[a.round] || 99) - (order[b.round] || 99);
  });
  const upcoming = [];
  activeSeries.forEach(s => {
    s.games.forEach((g, i) => {
      if (!g || g.winner) return; // skip resolved
      if (!g.prediction) return;
      try {
        const chs = calcBlendedProjectionWithCHS(s, s.id, g.num);
        if (!chs) return;
        // Phase 61: also run Monte Carlo for margin distribution + win prob
        let mc = null;
        if (typeof runMonteCarlo === 'function') {
          try { mc = runMonteCarlo(s, g.num, { iterations: 800 }); } catch (e) {}
        }
        upcoming.push({ series: s, game: g, gameNum: g.num, chs, mc });
      } catch (e) { /* graceful */ }
    });
  });

  if (!upcoming.length) {
    return '<div style="text-align:center;padding:30px;color:var(--text-dim);">No upcoming games with predictions scheduled.</div>';
  }

  const cards = upcoming.map(({ series, game, gameNum, chs, mc }) => {
    const main = game.prediction;
    const homeAbbr = series.homeTeam.abbr, awayAbbr = series.awayTeam.abbr;
    const mainWinner = main.homeWin ? homeAbbr : awayAbbr;
    const mainScoreLine = `${homeAbbr} ${main.homeScore} - ${main.awayScore} ${awayAbbr}`;
    const chsScoreLine = chs.chsBlendedScore;
    const flipsBadge = chs.chsFlipsWinner
      ? '<span style="background:rgba(245, 158, 11, 0.15);color:#f59e0b;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;letter-spacing:0.5px;">CHS FLIPS</span>'
      : '';
    const sign = (n) => (n >= 0 ? '+' : '') + n.toFixed(1);

    // Phase 61 MC panel: margin distribution + win probability
    // Phase 62: blowout-risk flag + per-player top prop hit rates
    let mcPanel = '';
    if (mc) {
      const homePct = (mc.homeWinProb * 100).toFixed(0);
      const awayPct = (100 - +homePct).toFixed(0);
      const winnerSide = mc.homeWinProb >= 0.5 ? homeAbbr : awayAbbr;
      const winnerPct = mc.homeWinProb >= 0.5 ? homePct : awayPct;
      const range = mc.margin.p90 - mc.margin.p10;
      const mcFlipsBadge = (mc.homeWinProb > 0.5) !== main.homeWin
        ? '<span style="display:inline-block;background:rgba(99, 102, 241, 0.15);color:#818cf8;padding:1px 6px;border-radius:8px;font-size:9px;font-weight:700;margin-left:4px;">MC FLIPS</span>'
        : '';
      // Phase 62 blowout warning: when P(|margin| >= 18) > 30%, scoring
      // props on the favorite are unreliable (Q4 sit / garbage time).
      const blowoutWarn = mc.blowoutRisk > 0.30
        ? `<div style="margin-top:6px;padding:6px 8px;background:rgba(245, 158, 11, 0.1);border-left:3px solid #f59e0b;font-size:10px;color:#f59e0b;line-height:1.4;">
             ⚠ <strong>Blowout risk ${(mc.blowoutRisk*100).toFixed(0)}%</strong> — favorite's scoring props vulnerable to Q4 sits. Prefer first-half scoring (avoids the sit window), spread props, or non-scoring props (assists/rebounds).
           </div>`
        : '';
      mcPanel = `
        <div style="margin-top:8px;padding:8px;background:rgba(99, 102, 241, 0.08);border:1px solid rgba(99,102,241,0.3);border-radius:6px;font-size:11px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <span style="color:#818cf8;font-size:10px;text-transform:uppercase;">Monte Carlo (${mc.iterations} sims)${mcFlipsBadge}</span>
            <span style="color:#818cf8;font-weight:700;">${winnerSide} ${winnerPct}% to win</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;color:var(--text-dim);">
            <div><span style="font-size:9px;color:#666;">p10</span><br><strong style="color:var(--text);">${mc.margin.p10}</strong></div>
            <div><span style="font-size:9px;color:#666;">p50</span><br><strong style="color:var(--text);">${mc.margin.p50}</strong></div>
            <div><span style="font-size:9px;color:#666;">p90</span><br><strong style="color:var(--text);">${mc.margin.p90}</strong></div>
          </div>
          <div style="margin-top:4px;font-size:10px;color:var(--text-dim);">
            margin 80% CI: ${mc.margin.p10} to ${mc.margin.p90} (spread ${range.toFixed(1)}pts)
          </div>
          ${blowoutWarn}
        </div>`;
    }

    return `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:13px;font-weight:700;color:#fff;">${series.id} · G${gameNum}</span>
          ${flipsBadge}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px;">
          <div style="padding:8px;background:rgba(0,0,0,0.2);border-radius:6px;">
            <div style="color:var(--text-dim);font-size:10px;text-transform:uppercase;">Main engine</div>
            <div style="font-weight:700;font-size:14px;color:var(--accent);">${mainWinner} by ${main.margin}</div>
            <div style="color:var(--text-dim);">${mainScoreLine}</div>
          </div>
          <div style="padding:8px;background:rgba(245, 158, 11, 0.08);border:1px solid rgba(245,158,11,0.3);border-radius:6px;">
            <div style="color:#f59e0b;font-size:10px;text-transform:uppercase;">CHS shadow</div>
            <div style="font-weight:700;font-size:14px;color:#f59e0b;">${chs.chsWinner} by ${chs.chsMargin}</div>
            <div style="color:var(--text-dim);">${chsScoreLine}</div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:10px;color:var(--text-dim);line-height:1.5;">
          CHS team Δ: ${homeAbbr} ${sign(chs.chsHomeDelta)} · ${awayAbbr} ${sign(chs.chsAwayDelta)} · margin ${sign(chs.chsMarginDelta)}
        </div>
        ${mcPanel}
      </div>`;
  }).join('');

  return `
    <h3 style="font-size:14px;letter-spacing:1px;color:var(--text-dim);margin:0 0 12px;">LIVE PREVIEW · UPCOMING GAMES</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(360px, 1fr));gap:16px;margin-bottom:24px;">
      ${cards}
    </div>`;
}

// Phase 63: Parlay candidates panel — leverages parlay-builder.js to
// surface deepest safe lines per player per game, plus suggested 2-3
// leg parlay structures with MC-backed combined hit rates.
function chsLabRenderParlayCandidates() {
  if (typeof SERIES_DATA === 'undefined' || typeof runMonteCarlo !== 'function'
    || typeof safeLinesForAllPlayers !== 'function' || typeof scoreParlay !== 'function') return '';
  // Phase 73b: include R2 + CF + Finals (live + recent rounds). Filter
  // out TBD scaffolds + empty rosters. CF games render first.
  const activeSeries = SERIES_DATA.filter(s =>
    (s.round === 'R2' || s.round === 'CF' || s.round === 'Finals') &&
    !s.tbdOpponent &&
    s.homeTeam && Array.isArray(s.homeTeam.players) && s.homeTeam.players.length > 0
  ).sort((a, b) => {
    const order = { 'CF': 0, 'Finals': 1, 'R2': 2 };
    return (order[a.round] || 99) - (order[b.round] || 99);
  });
  const upcoming = [];
  activeSeries.forEach(s => {
    s.games.forEach(g => {
      if (!g || g.winner || !g.prediction) return;
      try {
        const mc = runMonteCarlo(s, g.num, { iterations: 1500 });
        if (!mc) return;
        upcoming.push({ series: s, gameNum: g.num, mc });
      } catch (e) {}
    });
  });
  if (!upcoming.length) return '';

  const blocks = upcoming.map(({ series, gameNum, mc }) => {
    // Phase 64: 80% floor + realistic-line filter + max -500 juice.
    // safeLinesForAllPlayers now does all of this in one call, returning
    // rows already sorted by expected $ return (hitRate × payout).
    const reliable = safeLinesForAllPlayers(mc, { threshold: 0.80, maxJuice: -500 });
    const top10 = reliable.slice(0, 10);

    // Phase 65: build BOTH reliable + traditional parlay variants
    const reliableParlay = typeof buildReliableParlay === 'function'
      ? buildReliableParlay(mc, series) : null;
    const traditionalParlay = typeof buildTraditionalParlay === 'function'
      ? buildTraditionalParlay(mc, series) : null;

    const fmtJuice = (j) => j == null ? '?' : (j > 0 ? '+' + j : String(j));

    const reliableTable = !top10.length
      ? '<div style="text-align:center;padding:14px;color:var(--text-dim);font-size:11px;">No props clear the 80% reliability floor for this game.</div>'
      : `<table style="width:100%;font-size:11px;border-collapse:collapse;">
          <thead><tr style="border-bottom:1px solid var(--border);">
            <th style="padding:3px 6px;text-align:left;font-size:9px;color:var(--text-dim);">Player</th>
            <th style="padding:3px 6px;text-align:left;font-size:9px;color:var(--text-dim);">Stat</th>
            <th style="padding:3px 6px;text-align:right;font-size:9px;color:var(--text-dim);">Line</th>
            <th style="padding:3px 6px;text-align:right;font-size:9px;color:var(--text-dim);">Hit%</th>
            <th style="padding:3px 6px;text-align:right;font-size:9px;color:var(--text-dim);">Est. juice</th>
            <th style="padding:3px 6px;text-align:right;font-size:9px;color:var(--text-dim);">$/100</th>
          </tr></thead>
          ${top10.map(r => `
            <tr style="border-bottom:1px solid var(--border);">
              <td style="padding:3px 6px;color:var(--text);">${r.player}</td>
              <td style="padding:3px 6px;color:var(--text-dim);">${r.stat}</td>
              <td style="padding:3px 6px;text-align:right;color:var(--text);">o${r.line}</td>
              <td style="padding:3px 6px;text-align:right;color:#22c55e;font-weight:700;">${(r.hitRate*100).toFixed(0)}%</td>
              <td style="padding:3px 6px;text-align:right;color:var(--text-dim);">${fmtJuice(r.estJuice)}</td>
              <td style="padding:3px 6px;text-align:right;color:var(--text-dim);">$${r.estPayoutPer100}</td>
            </tr>`).join('')}
        </table>`;

    function renderParlayBlock(parlay, tierLabel, tierColor) {
      if (!parlay) {
        return `
          <div style="margin-top:10px;padding:8px;background:rgba(245, 158, 11, 0.06);border:1px solid rgba(245,158,11,0.25);border-radius:6px;font-size:10px;color:#f59e0b;">
            No ${tierLabel.toLowerCase()} parlay assembled from available legs.
          </div>`;
      }
      const { legs, score, parlayJuice, calibrated } = parlay;
      const verdictColor = score.verdict === 'STRONG +EV' ? '#22c55e'
                        : score.verdict === 'POSITIVE' ? '#22d3ee'
                        : score.verdict === 'FLAT' ? '#eab308'
                        : '#ef4444';
      const legSummary = legs.map(l => {
        const last = l.player.split(' ').pop();
        return `${last} ${l.stat}o${l.line} (${(l.hitRate*100).toFixed(0)}% ${fmtJuice(l.estJuice)})`;
      }).join(' + ');
      const calibratedSpan = calibrated
        ? `<div style="margin-top:4px;font-size:9px;color:var(--text-dim);">
             MC raw ${(calibrated.raw*100).toFixed(0)}% · historical calibration (${calibrated.bucket} bucket): <strong style="color:${tierColor};">${(calibrated.calibrated*100).toFixed(0)}%</strong>
             — the 80-95% bucket has only delivered ~67% historically, so this is the honest probability.
           </div>` : '';
      // Phase 69: Kelly-sized stake recommendation. Translates the
      // parlay's joint hit rate + odds into a recommended $ stake using
      // detectMarketDisagreement + recommendStake. Defaults to $500
      // bankroll — UI can plug in user-provided bankroll later.
      let kellyHTML = '';
      if (typeof detectMarketDisagreement === 'function' && typeof recommendStake === 'function') {
        const edge = detectMarketDisagreement(score.combined, parlayJuice);
        const rec  = recommendStake(500, edge, { minStake: 5, maxStake: 25 });
        const verdictColor = rec.verdict === 'BET' ? '#22c55e'
                          : rec.verdict === 'BET_MIN' ? '#eab308'
                          : rec.verdict === 'CAP_HIT' ? '#22d3ee'
                          : '#ef4444';
        kellyHTML = `
          <div style="margin-top:6px;padding:6px 8px;background:rgba(34,211,238,0.06);border:1px solid rgba(34,211,238,0.25);border-radius:4px;font-size:10px;">
            <strong style="color:${verdictColor};">Kelly stake: $${rec.recommendedStake}</strong>
            <span style="color:var(--text-dim);"> · ${rec.verdict.replace(/_/g, ' ')} · ${(rec.fraction*100).toFixed(1)}% of $500 bankroll</span>
          </div>`;
      }
      return `
        <div style="margin-top:10px;padding:10px;background:rgba(${tierColor === '#22c55e' ? '34, 197, 94' : '167, 139, 250'}, 0.06);border:1px solid ${tierColor};border-radius:6px;">
          <div style="font-size:10px;letter-spacing:0.5px;color:${tierColor};text-transform:uppercase;margin-bottom:6px;font-weight:700;">${tierLabel}</div>
          <div style="font-size:11px;color:var(--text);margin-bottom:6px;line-height:1.5;">${legSummary}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:10px;">
            <div>Combined: <strong style="color:${tierColor};">${(score.combined*100).toFixed(0)}%</strong></div>
            <div>Est. parlay juice: <strong style="color:var(--text);">${fmtJuice(parlayJuice)}</strong></div>
            <div>Payout/$100: <strong style="color:var(--text);">$${score.payoutIfHit.toFixed(0)}</strong></div>
          </div>
          <div style="margin-top:4px;font-size:10px;color:var(--text-dim);line-height:1.5;">
            EV $${score.evPer100}/$100 · ${score.verdict} · ${legs.length} legs · vs naive product ${(score.naiveProduct*100).toFixed(0)}%
          </div>
          ${calibratedSpan}
          ${kellyHTML}
        </div>`;
    }

    return `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:13px;font-weight:700;color:#fff;">${series.id} · G${gameNum}</span>
          <span style="font-size:10px;color:var(--text-dim);">${mc.iterations} sims · ${reliable.length} reliable legs${typeof formatMCFreshness === 'function' ? ' · ' + formatMCFreshness(mc.generatedAt) : ''}</span>
        </div>
        ${reliableTable}
        ${renderParlayBlock(reliableParlay, 'RELIABLE PARLAY · ≥80% COMBINED', '#22c55e')}
        ${renderParlayBlock(traditionalParlay, 'TRADITIONAL · MODEL-CONFIDENT BIG-PAYOUT', '#a78bfa')}
      </div>`;
  }).join('');

  return `
    <h3 style="font-size:14px;letter-spacing:1px;color:var(--text-dim);margin:0 0 12px;">RELIABLE PARLAY CANDIDATES · ≥80% MC CONFIDENCE</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(380px, 1fr));gap:16px;margin-bottom:24px;">
      ${blocks}
    </div>
    <div style="font-size:11px;color:var(--text-dim);margin-top:-8px;margin-bottom:24px;line-height:1.5;">
      <strong style="color:var(--text);">Filters applied:</strong> only props with MC hit rate ≥80%, line within DK's realistic alt-line range (e.g. won't suggest Gobert reb under 4.5 — book doesn't list it), and estimated juice ≥-500 (above that the payout is too flat). Sorted by expected $ return (hit rate × payout). Suggested parlay is the SHORTEST set where each leg ≥85% AND combined ≥80% — drops the combo entirely if neither 2-leg nor 3-leg clears the bar.
    </div>`;
}

function chsLabRenderLedger(ledger) {
  if (!ledger.length) return '';
  const rows = ledger.slice().sort((a, b) => (a.date || '').localeCompare(b.date || '')).map(e => {
    const mainHit = e.mainPred && e.mainPred.winner === e.actual.winner;
    const chsHit = e.chsPred && e.chsPred.winner === e.actual.winner;
    const mainErr = e.mainPred ? Math.abs(e.mainPred.margin - e.actual.margin) : '?';
    const chsErr = e.chsPred ? Math.abs(e.chsPred.margin - e.actual.margin) : '?';
    const retroBadge = e.retroactive ? ' <span style="font-size:9px;color:var(--text-dim);background:rgba(255,255,255,0.05);padding:1px 6px;border-radius:8px;">retro</span>' : '';
    return `
      <tr>
        <td style="padding:8px 10px;font-size:12px;color:var(--text-dim);">${e.date || '?'}</td>
        <td style="padding:8px 10px;font-size:12px;color:#fff;">${e.series} G${e.game}${retroBadge}</td>
        <td style="padding:8px 10px;font-size:12px;color:var(--text-dim);">${e.actual.winner} by ${e.actual.margin}</td>
        <td style="padding:8px 10px;font-size:12px;text-align:center;">
          <span style="color:${mainHit ? 'var(--green)' : 'var(--red)'};">${mainHit ? '✓' : '✗'}</span>
          <span style="color:var(--text-dim);">&nbsp;${e.mainPred.winner} by ${e.mainPred.margin}</span>
          <span style="color:var(--text-dim);font-size:10px;">&nbsp;(err ${mainErr})</span>
        </td>
        <td style="padding:8px 10px;font-size:12px;text-align:center;">
          ${e.chsPred ? `
            <span style="color:${chsHit ? 'var(--green)' : 'var(--red)'};">${chsHit ? '✓' : '✗'}</span>
            <span style="color:var(--text-dim);">&nbsp;${e.chsPred.winner} by ${e.chsPred.margin}</span>
            <span style="color:var(--text-dim);font-size:10px;">&nbsp;(err ${chsErr})</span>
          ` : '<span style="color:var(--text-dim);">—</span>'}
        </td>
      </tr>`;
  }).join('');

  return `
    <h3 style="font-size:14px;letter-spacing:1px;color:var(--text-dim);margin:0 0 12px;">ACCURACY LEDGER · RESOLVED GAMES</h3>
    <table style="width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
      <thead style="background:rgba(0,0,0,0.3);">
        <tr>
          <th style="padding:10px;text-align:left;font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Date</th>
          <th style="padding:10px;text-align:left;font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Series</th>
          <th style="padding:10px;text-align:left;font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Actual</th>
          <th style="padding:10px;text-align:center;font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Main</th>
          <th style="padding:10px;text-align:center;font-size:10px;color:#f59e0b;text-transform:uppercase;letter-spacing:0.5px;">CHS</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

// Phase 69: Slate concentration scanner — surfaces directional-exposure
// concentration across today's bets so the user can see at a glance
// whether 5 bets all ride on "NYK wins by 8+". Renders nothing if the
// risk-controls module isn't loaded.
function chsLabRenderConcentration() {
  if (typeof analyzeSlateConcentration !== 'function' || typeof BETS === 'undefined') return '';
  // Today's slate: anything with date === CURRENT_DATE and no result yet.
  const today = (typeof CURRENT_DATE !== 'undefined') ? CURRENT_DATE : null;
  if (!today) return '';
  const todays = BETS.filter(b => b.postedAt === today && !b.result);
  if (!todays.length) return '';
  const analysis = analyzeSlateConcentration(todays, { maxPerDirection: 3, maxPerTeam: 5, stake: 25 });
  if (!analysis.topExposures.length) return '';

  const warnHTML = analysis.warnings.length
    ? analysis.warnings.map(w => `
        <div style="padding:8px;background:rgba(239,68,68,0.08);border-left:3px solid #ef4444;border-radius:4px;margin-bottom:6px;font-size:11px;color:var(--text);">
          <strong style="color:#ef4444;">⚠ ${w.key}:</strong> ${w.count} bets — ${w.reason}
          <div style="font-size:10px;color:var(--text-dim);margin-top:3px;">Bets: ${(w.bets || []).slice(0, 4).join(', ')}${w.bets.length > 4 ? '...' : ''}</div>
        </div>
      `).join('')
    : `<div style="padding:8px;background:rgba(34,197,94,0.08);border-left:3px solid #22c55e;border-radius:4px;font-size:11px;color:var(--text);">✓ Slate well-diversified — no directional outcome carries more than 3 bets.</div>`;

  const topRows = analysis.topExposures.slice(0, 6).map(e => {
    const overCap = e.count > 3;
    return `
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:4px 8px;font-size:11px;color:var(--text);">${e.key}</td>
        <td style="padding:4px 8px;font-size:11px;text-align:right;color:${overCap ? '#ef4444' : 'var(--text)'};font-weight:${overCap ? 700 : 400};">${e.count}</td>
        <td style="padding:4px 8px;font-size:11px;text-align:right;color:var(--text-dim);">$${e.stakeAt25}</td>
      </tr>`;
  }).join('');

  return `
    <div style="margin-bottom:24px;">
      <h3 style="font-size:14px;letter-spacing:1px;color:var(--text-dim);margin:0 0 6px;">SLATE CONCENTRATION · TODAY'S BETS</h3>
      <p style="margin:0 0 12px;font-size:11px;color:var(--text-dim);line-height:1.5;">
        Groups today's unsettled bets by directional outcome (e.g. <code>NYK_ML</code> = NYK wins outright).
        Bets in the same group are perfectly correlated — they win or lose together.
        <strong style="color:#fff;">Rule:</strong> max 3 bets per directional outcome, max 5 per team total.
      </p>
      ${warnHTML}
      <table style="width:100%;border-collapse:collapse;margin-top:10px;background:var(--card);border:1px solid var(--border);border-radius:8px;overflow:hidden;">
        <thead style="background:rgba(0,0,0,0.3);">
          <tr>
            <th style="padding:8px;text-align:left;font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Directional outcome</th>
            <th style="padding:8px;text-align:right;font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Bets</th>
            <th style="padding:8px;text-align:right;font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">$ at $25</th>
          </tr>
        </thead>
        <tbody>${topRows}</tbody>
      </table>
    </div>`;
}

// Phase 70: Risk Dashboard — reframes the betting record as a risk
// analyst would: Sharpe ratio, max drawdown, risk of ruin, equity curve.
// The "did we win?" framing hides the variance story; this section
// surfaces it. Renders nothing if risk-analytics not loaded.
function chsLabRenderRiskDashboard() {
  if (typeof computeHistoricalRiskMetrics !== 'function' || typeof BETS === 'undefined') return '';

  // Compute realized $ for each settled R2 straight bet at flat $25 stake
  const STAKE = 25;
  const payoutPer = (odds) => {
    const n = Number(odds);
    if (!isFinite(n) || n === 0) return 0;
    return n > 0 ? n / 100 : 100 / -n;
  };
  // Phase 73b: include R2 + CF + Finals settled bets. The R2-only
  // filter would hide CF results going forward, breaking the rolling
  // Sharpe/drawdown view once CF bets settle.
  const settled = BETS.filter(b =>
    typeof b.slate === 'string' &&
    (b.slate.startsWith('R2-') || b.slate.startsWith('CF-') || b.slate.startsWith('F-')) &&
    b.type !== 'parlay' && b.result &&
    ['win', 'loss', 'push', 'void'].includes(b.result.outcome)
  ).map(b => {
    let pl = 0;
    if (b.result.outcome === 'win')  pl = +(STAKE * payoutPer(b.odds)).toFixed(2);
    if (b.result.outcome === 'loss') pl = -STAKE;
    return { date: b.postedAt, pl, type: b.type, confidence: b.confidence };
  });
  if (!settled.length) return '';

  const hist = computeHistoricalRiskMetrics(settled);
  if (hist.error) return '';

  // Counterfactual: drop props (Phase 68 SKIP cell)
  const filtered = settled.filter(b => b.type !== 'prop');
  const histF = computeHistoricalRiskMetrics(filtered);

  // Risk of ruin at $500 bankroll
  const ror = computeRiskOfRuin(500, hist.dailyMean, hist.dailyStd, { horizonDays: 30 });
  const rorF = histF.error ? null : computeRiskOfRuin(500, histF.dailyMean, histF.dailyStd, { horizonDays: 30 });

  const sharpeColor = (s) => s >= 0.5 ? '#22c55e' : s >= 0 ? '#eab308' : '#ef4444';
  const ddPctOf500 = (hist.maxDrawdown / 500) * 100;
  const ddColor = ddPctOf500 > 30 ? '#ef4444' : ddPctOf500 > 15 ? '#eab308' : '#22c55e';

  // Equity curve sparkline — render as horizontal bars
  const equity = hist.equityCurve;
  const eqMax = Math.max(...equity.map(e => e.equity), 0);
  const eqMin = Math.min(...equity.map(e => e.equity), 0);
  const eqRange = (eqMax - eqMin) || 1;
  const sparkRows = equity.map(e => {
    const pct = ((e.equity - eqMin) / eqRange) * 100;
    const color = e.dailyPL >= 0 ? '#22c55e' : '#ef4444';
    return `
      <tr>
        <td style="padding:2px 6px;font-size:10px;color:var(--text-dim);">${e.date}</td>
        <td style="padding:2px 6px;font-size:10px;color:${color};text-align:right;font-family:monospace;">${e.dailyPL >= 0 ? '+' : ''}$${e.dailyPL.toFixed(2)}</td>
        <td style="padding:2px 6px;font-size:10px;color:var(--text);text-align:right;font-family:monospace;">$${e.equity}</td>
        <td style="padding:2px 6px;width:200px;">
          <div style="height:6px;background:rgba(255,255,255,0.04);border-radius:2px;position:relative;">
            <div style="position:absolute;left:${((0 - eqMin) / eqRange) * 100}%;top:-1px;width:1px;height:8px;background:var(--text-dim);"></div>
            <div style="height:6px;width:${Math.abs(pct - ((0 - eqMin) / eqRange) * 100)}%;margin-left:${Math.min(pct, ((0 - eqMin) / eqRange) * 100)}%;background:${color};border-radius:2px;"></div>
          </div>
        </td>
      </tr>`;
  }).join('');

  const filteredBox = histF.error ? '' : `
    <div style="margin-top:16px;padding:12px;background:rgba(34,197,94,0.06);border:1px solid #22c55e;border-radius:8px;">
      <div style="font-size:10px;letter-spacing:0.5px;color:#22c55e;text-transform:uppercase;margin-bottom:6px;font-weight:700;">
        COUNTERFACTUAL · WITH PHASE 68 FILTER (no props)
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:8px;font-size:11px;">
        <div><span style="color:var(--text-dim);">Total P&L</span><br><strong style="color:#22c55e;font-size:14px;">+$${histF.totalPL}</strong></div>
        <div><span style="color:var(--text-dim);">Sharpe</span><br><strong style="color:${sharpeColor(histF.dailySharpe)};font-size:14px;">${histF.dailySharpe}</strong></div>
        <div><span style="color:var(--text-dim);">Max DD</span><br><strong style="color:${(histF.maxDrawdown/500)*100 > 30 ? '#ef4444' : (histF.maxDrawdown/500)*100 > 15 ? '#eab308' : '#22c55e'};font-size:14px;">$${histF.maxDrawdown}</strong></div>
        <div><span style="color:var(--text-dim);">Win rate</span><br><strong style="color:#22c55e;font-size:14px;">${(histF.winRate*100).toFixed(0)}%</strong></div>
        <div><span style="color:var(--text-dim);">P(ruin 30d)</span><br><strong style="color:${rorF.P_ruin > 0.20 ? '#ef4444' : '#22c55e'};font-size:14px;">${(rorF.P_ruin*100).toFixed(1)}%</strong></div>
        <div><span style="color:var(--text-dim);">P(double)</span><br><strong style="color:#22c55e;font-size:14px;">${(rorF.P_double*100).toFixed(0)}%</strong></div>
      </div>
      <div style="margin-top:8px;font-size:10px;color:var(--text-dim);line-height:1.5;">
        Filter flips Sharpe from <strong style="color:#ef4444;">${hist.dailySharpe}</strong> to <strong style="color:#22c55e;">${histF.dailySharpe}</strong>,
        drawdown from <strong style="color:#ef4444;">${((hist.maxDrawdown/500)*100).toFixed(0)}%</strong> of bankroll to <strong style="color:#22c55e;">${((histF.maxDrawdown/500)*100).toFixed(0)}%</strong>,
        and risk-of-ruin from <strong style="color:#ef4444;">${(ror.P_ruin*100).toFixed(0)}%</strong> to <strong style="color:#22c55e;">${(rorF.P_ruin*100).toFixed(1)}%</strong>.
        Same model, smarter selection.
      </div>
    </div>`;

  return `
    <div style="margin-bottom:24px;">
      <h3 style="font-size:14px;letter-spacing:1px;color:var(--text-dim);margin:0 0 6px;">RISK DASHBOARD · BETTING RECORD AS A PORTFOLIO</h3>
      <p style="margin:0 0 12px;font-size:11px;color:var(--text-dim);line-height:1.5;">
        Reframes the record from "did we win?" to a risk-analyst view: Sharpe ratio, max drawdown,
        risk of ruin. Assumes $500 reference bankroll, $25 flat stake. The single metric to watch
        is <strong style="color:#fff;">Sharpe</strong> — &gt;0.5 is strong, 0-0.5 is weak, &lt;0 is destroying capital.
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:10px;margin-bottom:14px;">
        <div style="padding:10px;background:rgba(${hist.totalPL >= 0 ? '34,197,94' : '239,68,68'},0.08);border:1px solid ${hist.totalPL >= 0 ? '#22c55e' : '#ef4444'}66;border-radius:8px;">
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Total P&L</div>
          <div style="font-size:18px;font-weight:800;color:${hist.totalPL >= 0 ? '#22c55e' : '#ef4444'};">${hist.totalPL >= 0 ? '+' : ''}$${hist.totalPL}</div>
          <div style="font-size:10px;color:var(--text-dim);">${hist.totalSessions} sessions</div>
        </div>
        <div style="padding:10px;background:rgba(${hist.dailySharpe >= 0 ? '34,197,94' : '239,68,68'},0.08);border:1px solid ${sharpeColor(hist.dailySharpe)}66;border-radius:8px;">
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Sharpe Ratio</div>
          <div style="font-size:18px;font-weight:800;color:${sharpeColor(hist.dailySharpe)};">${hist.dailySharpe}</div>
          <div style="font-size:10px;color:var(--text-dim);">${hist.dailySharpe < 0 ? 'destroying capital' : hist.dailySharpe < 0.5 ? 'weak' : 'strong'}</div>
        </div>
        <div style="padding:10px;background:rgba(${ddColor === '#22c55e' ? '34,197,94' : ddColor === '#eab308' ? '234,179,8' : '239,68,68'},0.08);border:1px solid ${ddColor}66;border-radius:8px;">
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Max Drawdown</div>
          <div style="font-size:18px;font-weight:800;color:${ddColor};">$${hist.maxDrawdown}</div>
          <div style="font-size:10px;color:var(--text-dim);">${ddPctOf500.toFixed(0)}% of $500 br · ${hist.drawdownDuration}d</div>
        </div>
        <div style="padding:10px;background:rgba(${hist.winRate >= 0.5 ? '34,197,94' : '239,68,68'},0.08);border:1px solid ${hist.winRate >= 0.5 ? '#22c55e' : '#ef4444'}66;border-radius:8px;">
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Session Win Rate</div>
          <div style="font-size:18px;font-weight:800;color:${hist.winRate >= 0.5 ? '#22c55e' : '#ef4444'};">${(hist.winRate*100).toFixed(0)}%</div>
          <div style="font-size:10px;color:var(--text-dim);">${hist.winningSessions}W ${hist.losingSessions}L</div>
        </div>
        <div style="padding:10px;background:rgba(${ror.P_ruin <= 0.20 ? '34,197,94' : '239,68,68'},0.08);border:1px solid ${ror.P_ruin <= 0.20 ? '#22c55e' : '#ef4444'}66;border-radius:8px;">
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">P(Ruin) · 30d / $500</div>
          <div style="font-size:18px;font-weight:800;color:${ror.P_ruin <= 0.20 ? '#22c55e' : '#ef4444'};">${(ror.P_ruin*100).toFixed(1)}%</div>
          <div style="font-size:10px;color:var(--text-dim);">P(double): ${(ror.P_double*100).toFixed(0)}%</div>
        </div>
        <div style="padding:10px;background:rgba(167,139,250,0.08);border:1px solid #a78bfa66;border-radius:8px;">
          <div style="font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.5px;">Longest Loss Streak</div>
          <div style="font-size:18px;font-weight:800;color:${hist.longestLossStreak >= 4 ? '#ef4444' : '#eab308'};">${hist.longestLossStreak}</div>
          <div style="font-size:10px;color:var(--text-dim);${hist.longestLossStreak >= 4 ? 'color:#ef4444;' : ''}">${hist.longestLossStreak >= 4 ? 'warning' : 'within variance'}</div>
        </div>
      </div>

      <details style="margin-bottom:10px;">
        <summary style="font-size:11px;color:var(--text-dim);cursor:pointer;padding:6px 0;">▸ Equity curve (session-by-session)</summary>
        <table style="width:100%;margin-top:6px;border-collapse:collapse;background:var(--card);border:1px solid var(--border);border-radius:6px;overflow:hidden;">
          <thead style="background:rgba(0,0,0,0.3);">
            <tr><th style="padding:6px;text-align:left;font-size:9px;color:var(--text-dim);text-transform:uppercase;">Date</th>
                <th style="padding:6px;text-align:right;font-size:9px;color:var(--text-dim);text-transform:uppercase;">Session P&L</th>
                <th style="padding:6px;text-align:right;font-size:9px;color:var(--text-dim);text-transform:uppercase;">Equity</th>
                <th style="padding:6px;text-align:left;font-size:9px;color:var(--text-dim);text-transform:uppercase;">Curve</th></tr>
          </thead>
          <tbody>${sparkRows}</tbody>
        </table>
      </details>

      ${filteredBox}

      <div style="margin-top:10px;font-size:10px;color:var(--text-dim);line-height:1.5;">
        <strong style="color:var(--text);">Risk analyst's read:</strong> Sharpe ratio under 0 means we lose more on bad
        days than we win on good — the strategy has negative risk-adjusted return, not just absolute. Drawdown
        above 30% of bankroll triggers the "stop trading, audit" rule in any institutional context. Risk of ruin
        compounds: 4 consecutive losing sessions has happened once already; at this pace it happens again with
        probability ${(Math.pow(hist.losingSessions/hist.totalSessions, 4)*100).toFixed(1)}% per 4-session window.
      </div>
    </div>`;
}

// Phase 68: Bet-Filter Verdict — surfaces the data-driven conclusion from
// the 99-bet R2 retro. Renders inline below the scoreboard so it's the
// FIRST thing the user sees when opening CHS Lab.
function chsLabRenderEdgeFilter() {
  if (typeof HISTORICAL_R2 === 'undefined') return '';
  const t = HISTORICAL_R2.byType;
  const c = HISTORICAL_R2.byConfidence;
  const cellHTML = (key, label, x) => {
    const rec = x.recommendation;
    const palette = {
      PLACE:   { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.08)',  border: '#22c55e' },
      CAUTION: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.08)',  border: '#eab308' },
      SKIP:    { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)',  border: '#ef4444' },
    }[rec] || { color: '#888', bg: 'transparent', border: '#444' };
    const roiSign = x.roi >= 0 ? '+' : '';
    return `
      <div style="padding:10px;background:${palette.bg};border:1px solid ${palette.border}66;border-radius:8px;">
        <div style="font-size:10px;letter-spacing:0.5px;color:var(--text-dim);text-transform:uppercase;margin-bottom:4px;">${label}</div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <span style="font-size:18px;font-weight:800;color:${palette.color};">${rec}</span>
          <span style="font-size:10px;color:var(--text-dim);">n=${x.n}</span>
        </div>
        <div style="margin-top:6px;font-size:11px;color:var(--text);">
          Hit ${(x.hitRate*100).toFixed(0)}% · ROI ${roiSign}${(x.roi*100).toFixed(0)}%
        </div>
      </div>`;
  };
  const typeOrder  = ['spread', 'ml', 'total', 'prop'];
  const confOrder  = ['best-bet', 'lean', 'medium', 'high', 'coin-flip'];
  return `
    <div style="margin-bottom:24px;">
      <h3 style="font-size:14px;letter-spacing:1px;color:var(--text-dim);margin:0 0 6px;">BET-FILTER VERDICT · R2 RETRO (99 bets, $25 stake)</h3>
      <p style="margin:0 0 12px;font-size:11px;color:var(--text-dim);line-height:1.5;">
        Data-driven recommendations from <code>test-pl-with-filters.js</code>. Every bet rendered in the app gets a
        <span style="color:#22c55e;font-weight:700;">PLACE</span> / <span style="color:#eab308;font-weight:700;">CAUTION</span> /
        <span style="color:#ef4444;font-weight:700;">SKIP</span> pill from <code>edge-detector.js</code> based on the
        confidence × type cross-tab. <strong style="color:#fff;">Headline finding:</strong> dropping all props would
        have moved the R2 slate from <span style="color:#ef4444;font-weight:700;">−$203 net</span> to
        <span style="color:#22c55e;font-weight:700;">+$213 net (+17% ROI)</span>.
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:8px;margin-bottom:10px;">
        ${typeOrder.map(k => cellHTML(k, 'TYPE ' + k.toUpperCase(), t[k])).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:8px;">
        ${confOrder.filter(k => c[k] && c[k].n >= 3).map(k => cellHTML(k, 'CONF ' + k.toUpperCase(), c[k])).join('')}
      </div>
      <div style="margin-top:10px;font-size:10px;color:var(--text-dim);line-height:1.5;">
        <strong style="color:var(--text);">How to read this:</strong> SKIP cells lost money historically (drop them).
        PLACE cells made money. The intersection that bled most was <code>high × prop</code>: 33% hit, −43% ROI on 21 bets.
        Cells with n&lt;3 are hidden until sample grows. Numbers refresh by re-running the P&amp;L script.
      </div>
    </div>`;
}

function renderCHSLabPage(el) {
  const ledger = (typeof CHS_LEDGER !== 'undefined' && Array.isArray(CHS_LEDGER)) ? CHS_LEDGER : [];
  const agg = chsLabComputeAggregate(ledger);

  // Phase 73b: CHS promotion evaluation
  // ledger: 21 games, 14/21 main hits (67%), 15/21 CHS hits (71%)
  // CHS edge: +4pp winner accuracy, but margin MAE +0.81pt worse
  // Promotion bar: ≥+10pp winner AND ≥-1.5pt MAE. CHS misses BOTH.
  // → Stay OFF. Will re-evaluate after CF games add data.
  const chsEvalLabel = (agg.total >= 10)
    ? (parseFloat(agg.chsHitPct) - parseFloat(agg.mainHitPct) >= 10 && parseFloat(agg.chsMAE) - parseFloat(agg.mainMAE) <= -1.5
        ? '<strong style="color:#22c55e;">→ Promotion criteria met — wire in CHS</strong>'
        : '<strong style="color:#f59e0b;">→ Does NOT meet promotion bar yet</strong>')
    : '<span style="color:var(--text-dim);">(need ≥10 games for evaluation)</span>';

  el.innerHTML = `
    <div style="max-width:1280px;margin:0 auto;padding:24px 16px;" class="bets-container">
      <div style="margin-bottom:18px;">
        <h2 style="margin:0 0 4px;color:#fff;">CHS Lab — Risk + Edge + Shadow Engine</h2>
        <p style="margin:0 0 8px;font-size:12px;color:var(--text-dim);line-height:1.6;">
          One-stop dashboard for betting analysis. Panels below (scroll for each):
          <strong style="color:var(--text);">Shadow Engine Scoreboard</strong> →
          <strong style="color:#22c55e;">📊 Risk Dashboard</strong> (Sharpe, drawdown, P(ruin)) →
          <strong style="color:var(--accent);">Bet-Filter Verdict</strong> (PLACE/CAUTION/SKIP cross-tab) →
          <strong style="color:#a78bfa;">Slate Concentration</strong> → Live Preview → Parlay Candidates → Ledger.
        </p>
        <p style="margin:0;font-size:11px;color:var(--text-dim);line-height:1.5;">
          <strong>CHS status:</strong> currently <strong style="color:#f59e0b;">OFF in production</strong>
          (<code>USE_CHS_IN_PROJECTIONS = false</code>). Promotion bar:
          <strong>winner Δ ≥ +10pp AND margin MAE Δ ≥ −1.5pt over 10 games</strong>.
          Current state: ${agg.total} games, CHS +${(parseFloat(agg.chsHitPct) - parseFloat(agg.mainHitPct)).toFixed(0)}pp winner / ${(parseFloat(agg.chsMAE) - parseFloat(agg.mainMAE)).toFixed(2)}pt MAE.
          ${chsEvalLabel}
        </p>
      </div>

      ${chsLabRenderScoreboard(agg)}
      ${chsLabRenderRiskDashboard()}
      ${chsLabRenderEdgeFilter()}
      ${chsLabRenderConcentration()}
      ${chsLabRenderLivePreview()}
      ${chsLabRenderParlayCandidates()}
      ${chsLabRenderLedger(ledger)}

      <div style="margin-top:24px;font-size:11px;color:var(--text-dim);line-height:1.6;">
        <strong>Retroactive entries</strong> (marked <em>retro</em>) were computed by running CHS against the current
        <code>historical.js</code> scenarios after the game already finished — they're a baseline, not a pre-game commitment,
        and may shift if scenarios are refined. Going forward the daily morning task captures CHS predictions <em>before</em>
        each game and appends non-retro entries.
      </div>
    </div>`;
}
