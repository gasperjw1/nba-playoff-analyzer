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
  const r2 = SERIES_DATA.filter(s => s.round === 'R2');
  const upcoming = [];
  r2.forEach(s => {
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
    return '<div style="text-align:center;padding:30px;color:var(--text-dim);">No upcoming R2 games scheduled.</div>';
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
  const r2 = SERIES_DATA.filter(s => s.round === 'R2');
  const upcoming = [];
  r2.forEach(s => {
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

    // Suggested parlay: build the SHORTEST parlay where each leg ≥85%
    // AND combined ≥80%. Prefer 2 legs (easier to clear); fall back to
    // 3 legs from different players if 2-leg combined < 80%.
    const seenPlayers = new Set();
    const tryLegs = [];
    for (const row of reliable) {
      if (seenPlayers.has(row.player)) continue;
      if (row.hitRate < 0.85) continue;          // strong per-leg floor
      seenPlayers.add(row.player);
      tryLegs.push({ type: 'prop', player: row.player, stat: row.stat,
                     line: row.line, direction: 'over',
                     hitRate: row.hitRate, estJuice: row.estJuice });
      if (tryLegs.length >= 3) break;
    }
    // Score 2-leg first; if it clears 80% combined, use it.
    let floorLegs = null, floorScore = null, parlayJuice = null;
    if (tryLegs.length >= 2) {
      const candidate2 = tryLegs.slice(0, 2);
      // Compute combined parlay juice by multiplying decimal odds:
      //   mult = product(1 + 100/legJuice_abs) per American odds math
      const dec2 = candidate2.map(l => l.estJuice > 0 ? 1 + l.estJuice/100 : 1 + 100/-l.estJuice);
      const combinedDec2 = dec2.reduce((a,b) => a*b, 1);
      const american2 = combinedDec2 > 2 ? Math.round((combinedDec2-1)*100) : Math.round(-100/(combinedDec2-1));
      const s2 = scoreParlay(mc, series, candidate2, american2);
      if (s2 && s2.combined >= 0.80) {
        floorLegs = candidate2; floorScore = s2; parlayJuice = american2;
      } else if (tryLegs.length >= 3) {
        const candidate3 = tryLegs.slice(0, 3);
        const dec3 = candidate3.map(l => l.estJuice > 0 ? 1 + l.estJuice/100 : 1 + 100/-l.estJuice);
        const combinedDec3 = dec3.reduce((a,b) => a*b, 1);
        const american3 = combinedDec3 > 2 ? Math.round((combinedDec3-1)*100) : Math.round(-100/(combinedDec3-1));
        const s3 = scoreParlay(mc, series, candidate3, american3);
        if (s3 && s3.combined >= 0.80) {
          floorLegs = candidate3; floorScore = s3; parlayJuice = american3;
        }
      }
    }

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

    let floorBlock = '';
    if (floorScore && floorLegs) {
      const verdictColor = floorScore.verdict === 'STRONG +EV' ? '#22c55e'
                        : floorScore.verdict === 'POSITIVE' ? '#22d3ee'
                        : floorScore.verdict === 'FLAT' ? '#eab308'
                        : '#ef4444';
      const legSummary = floorLegs.map(l => {
        const last = l.player.split(' ').pop();
        return `${last} ${l.stat}o${l.line} (${(l.hitRate*100).toFixed(0)}% ${fmtJuice(l.estJuice)})`;
      }).join(' + ');
      floorBlock = `
        <div style="margin-top:10px;padding:10px;background:rgba(34, 197, 94, 0.06);border:1px solid rgba(34,197,94,0.25);border-radius:6px;">
          <div style="font-size:10px;letter-spacing:0.5px;color:#22c55e;text-transform:uppercase;margin-bottom:6px;font-weight:700;">RELIABLE PARLAY · ≥80% COMBINED</div>
          <div style="font-size:11px;color:var(--text);margin-bottom:6px;line-height:1.5;">${legSummary}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:10px;">
            <div>Combined: <strong style="color:#22c55e;">${(floorScore.combined*100).toFixed(0)}%</strong></div>
            <div>Est. parlay juice: <strong style="color:var(--text);">${fmtJuice(parlayJuice)}</strong></div>
            <div>Payout/$100: <strong style="color:var(--text);">$${floorScore.payoutIfHit.toFixed(0)}</strong></div>
          </div>
          <div style="margin-top:4px;font-size:10px;color:var(--text-dim);line-height:1.5;">
            EV $${floorScore.evPer100}/$100 · ${floorScore.verdict} · vs naive product ${(floorScore.naiveProduct*100).toFixed(0)}% (${floorScore.correlationBoost >= 0 ? '+' : ''}${(floorScore.correlationBoost*100).toFixed(1)}pp correlation).
          </div>
        </div>`;
    } else {
      floorBlock = `
        <div style="margin-top:10px;padding:8px;background:rgba(245, 158, 11, 0.06);border:1px solid rgba(245,158,11,0.25);border-radius:6px;font-size:10px;color:#f59e0b;">
          No 80%+ combined parlay found from available legs. Stick to single-leg picks above.
        </div>`;
    }

    return `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-size:13px;font-weight:700;color:#fff;">${series.id} · G${gameNum}</span>
          <span style="font-size:10px;color:var(--text-dim);">${mc.iterations} sims · ${reliable.length} reliable legs</span>
        </div>
        ${reliableTable}
        ${floorBlock}
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

function renderCHSLabPage(el) {
  const ledger = (typeof CHS_LEDGER !== 'undefined' && Array.isArray(CHS_LEDGER)) ? CHS_LEDGER : [];
  const agg = chsLabComputeAggregate(ledger);

  el.innerHTML = `
    <div style="max-width:1280px;margin:0 auto;padding:24px 16px;" class="bets-container">
      <div style="margin-bottom:18px;">
        <h2 style="margin:0 0 4px;color:#fff;">CHS Lab — Shadow Engine Accuracy</h2>
        <p style="margin:0;font-size:12px;color:var(--text-dim);line-height:1.6;">
          Compound Historical Scenarios (Phase 52) is currently <strong style="color:#f59e0b;">OFF in production</strong>
          (<code>USE_CHS_IN_PROJECTIONS = false</code>). Predictions on Home, Bets, and Series Analysis use the bare
          13-modifier engine. This tab shows what CHS would predict in parallel and tracks its hit rate so we can promote
          it once it proves out: <strong>winner Δ ≥ +10pp AND margin MAE Δ ≥ −1.5 pts over 10 games</strong>.
        </p>
      </div>

      ${chsLabRenderScoreboard(agg)}
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
