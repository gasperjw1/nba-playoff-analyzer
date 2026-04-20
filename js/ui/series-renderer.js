// ============================================================
// SERIES PAGE RENDERER
// ============================================================

function renderSeries() {
  const s = SERIES_DATA[currentSeriesIdx];
  const prob = calcWinProb(s, s.id);
  const hr = calcTeamRating(s.homeTeam, s, s.id), ar = calcTeamRating(s.awayTeam, s, s.id);
  const score = getSeriesScore(s);
  const g1 = s.game1;

  // Build game sub-tabs
  const gameTabsHtml = `<div class="game-tabs">
    <div class="game-tab ${currentGameTab==='overview'?'active':''}" onclick="switchGameTab('overview')">Overview</div>
    ${s.games.map((g,gi) => {
      const played = g.winner ? 'played' : '';
      const resultTxt = g.winner ? g.winner : '';
      return `<div class="game-tab game-tab-game ${currentGameTab==='g'+(gi+1)?'active':''} ${played}" onclick="switchGameTab('g${gi+1}')">G${gi+1}<span class="game-tab-result">${resultTxt}</span></div>`;
    }).join('')}
    <div class="game-tab ${currentGameTab==='stats'?'active':''}" onclick="switchGameTab('stats')">Player Stats</div>
    <div class="game-tab ${currentGameTab==='fatigue'?'active':''}" onclick="switchGameTab('fatigue')" style="border-color:rgba(212,160,74,0.3);color:#d4a04a">Fatigue</div>
  </div>`;

  // Compact header with win prob inline
  const headerHtml = `<div class="series-header-compact">
    <div class="team-vs">
      <div class="team-block"><div class="seed">#${s.homeTeam.seed}</div><div class="name" style="color:${s.homeTeam.color2}">${s.homeTeam.name}</div><div class="record">${s.homeTeam.record}</div></div>
      <div class="prob-compact">
        <div class="prob-num" style="color:${prob.home>=50?'var(--green)':'var(--red)'}">${prob.home}%</div>
        <div class="prob-label">Win Prob</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:2px">${hr} vs ${ar}</div>
        <div style="font-size:11px;margin-top:2px;font-weight:700">${score.home} — ${score.away}</div>
      </div>
      <div class="team-block"><div class="seed">#${s.awayTeam.seed}</div><div class="name" style="color:${s.awayTeam.color2}">${s.awayTeam.name}</div><div class="record">${s.awayTeam.record}</div></div>
    </div>
  </div>`;

  // Content based on active game tab
  let tabContent = '';
  
  if (currentGameTab === 'overview') {
    tabContent = `
      <!-- TWO-COLUMN: Scenario + Backtest side by side -->
      <div class="series-body">
        ${renderScenarioBuilder(s)}
        ${renderBacktestPanel(s, prob)}
      </div>

      <!-- Win Probability Bar -->
      <div class="win-prob-container">
        <div class="win-prob-bar">
          <div class="win-prob-side" style="width:${prob.home}%;background:${s.homeTeam.color};${prob.home<15?'font-size:11px':''}">${s.homeTeam.name} ${prob.home}%</div>
          <div class="win-prob-side" style="width:${prob.away}%;background:${s.awayTeam.color};${prob.away<15?'font-size:11px':''}">${prob.away}% ${s.awayTeam.name}</div>
        </div>
      </div>

      <!-- TWO-COLUMN: Team Advanced Stats side by side -->
      <div class="team-adv">
        ${[s.homeTeam, s.awayTeam].map(t => `
          <div class="team-adv-card">
            <div class="team-name"><span class="team-color-bar" style="background:${t.color}"></span>${t.name}</div>
            <div class="adv-stats-grid">
              <div class="adv-stat ${advStatClass(t.advStats.ortg,114,117,false)}"><div class="s-label">ORtg</div><div class="s-val">${t.advStats.ortg}</div><div class="s-rank">#${t.advStats.ortgRk}</div></div>
              <div class="adv-stat ${advStatClass(t.advStats.drtg,112,109,true)}"><div class="s-label">DRtg</div><div class="s-val">${t.advStats.drtg}</div><div class="s-rank">#${t.advStats.drtgRk}</div></div>
              <div class="adv-stat ${advStatClass(t.advStats.netRtg,3,6,false)}"><div class="s-label">Net</div><div class="s-val">${t.advStats.netRtg>0?'+':''}${t.advStats.netRtg}</div></div>
              <div class="adv-stat ${advStatClass(t.advStats.ts,57,59,false)}"><div class="s-label">TS%</div><div class="s-val">${t.advStats.ts}</div></div>
              <div class="adv-stat ${advStatClass(t.advStats.clutchNetRtg,3,6,false)}"><div class="s-label">Clutch</div><div class="s-val">${t.advStats.clutchNetRtg>0?'+':''}${t.advStats.clutchNetRtg}</div></div>
              <div class="adv-stat"><div class="s-label">Pace</div><div class="s-val">${t.advStats.pace}</div></div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Rating Breakdown - horizontal compact -->
      <div class="rating-breakdown">
        <div class="rating-card"><div class="label">Best Player</div><div class="value">${getBestPlayerEdge(s)}</div><div class="sub">${getBestPlayerNote(s)}</div></div>
        <div class="rating-card"><div class="label">EPM Edge</div><div class="value">${getEPMEdge(s)}</div><div class="sub">${getEPMNote(s)}</div></div>
        <div class="rating-card"><div class="label">Synergy</div><div class="value">${getSynergyEdge(s)}</div><div class="sub">${getSynergyNote(s)}</div></div>
        <div class="rating-card"><div class="label">Clutch</div><div class="value">${getClutchEdge(s)}</div><div class="sub">${getClutchNote(s)}</div></div>
        <div class="rating-card"><div class="label">SPM Chem</div><div class="value">${getSPMEdge(s)}</div><div class="sub">${getSPMNote(s)}</div></div>
        <div class="rating-card"><div class="label">On/Off</div><div class="value">${getOnOffEdge(s)}</div><div class="sub">${getOnOffNote(s)}</div></div>
      </div>

      <!-- External Factors -->
      <div class="ext-factors">
        <div class="ext-factors-title">External & Off-Court Factors</div>
        ${s.externalFactors.map(f => `<div class="ext-factor-item"><div class="ext-impact ${f.impact>0?'positive':f.impact<0?'negative':'neutral'}">${f.impact>0?'+':''}${f.impact} ${f.team}</div><div class="ext-desc"><strong>${f.player||f.team+' Team'}:</strong> ${f.desc}${f.evidence?`<details style="margin-top:6px"><summary style="font-size:11px;color:var(--purple);cursor:pointer;font-weight:600">View Evidence</summary><div style="margin-top:6px;padding:8px;background:rgba(0,0,0,0.2);border-radius:6px;font-size:11px;line-height:1.6;color:var(--text-dim)">${f.evidence}${f.verdict?` <span class="ev-verdict ${f.verdict==='verified'?'ev-verified':f.verdict==='partial'?'ev-partial':'ev-uncertain'}">${f.verdict.toUpperCase()}</span>`:''}</div></details>`:''}</div></div>`).join('')}
        <div class="add-factor-btn" onclick="openFactorModal()">+ Add External Factor</div>
      </div>

      <!-- TWO-COLUMN: SPM Chemistry + On/Off -->
      <div class="series-body">
        <div>${renderSPMChemistry(s)}</div>
        <div>${renderOnOffImpact(s)}</div>
      </div>

      ${s.coaching ? renderCoaching(s) : ''}

      <!-- SERIES MARGIN PROFILE -->
      ${renderMarginProfile(s)}

      <!-- METHODOLOGY (collapsible) -->
      <details class="methodology">
        <summary>Advanced Rating Methodology</summary>
        <div class="content">
          <strong>Player Composite Rating (0-100):</strong> Multi-metric blend sourced from Basketball Reference, NBA.com, DunksAndThrees EPM, and BBall Index LEBRON.
          <div class="formula">Rating = PER(15%) + TS%(12%) + EPM(18%) + BPM(15%) + WS/48(12%) + On/Off(10%) + USG_ctx(8%) + Clutch(10%)</div>
          <strong>Team Rating (calcTeamRating):</strong> Weighted player average + VORP aggregation + WAR aggregation + D-LEBRON team aggregate + role diversity + non-linear interactions + synergy + SPM chemistry + on/off + advStats + system bonus + pedigree - health degradation - fatigue.
          <div class="formula">P(home) = 1 / (1 + 10^(-(homeRating + HCA + ceilingDiff + statDiff + pedigreeEdge - awayRating) / 15))</div>
          <strong>LEBRON Integration:</strong> WAR aggregation bonus (lineup-adjusted value complementing VORP), D-LEBRON defensive aggregate (rewards teams with multiple strong defenders), and role diversity bonus (diverse offensive/defensive roles harder to scout).
          <div class="formula">WAR Bonus = (totalWar - 35) / 20 | D-LEBRON Bonus = (avgDLeb - 0.3) × 0.8</div>
          <strong>Fatigue Monitor (Medium Confidence):</strong> Per-player fatigue from age (33+), minutes load, mental fatigue, active injury compounding, and role-based load. Team fatigue index applied as rating penalty (up to ~2.5pts) when &gt; 0.03. Values weighted at 0.75× (medium confidence). Also feeds into margin engine as fatigue differential (Step 5b). G1-validated: LeBron age fatigue, Edwards altitude fatigue, Sharpe conditioning limits.
          <strong>Margin Variance Engine:</strong> Dynamic score projections using talent gap amplifier (non-linear margin scaling), depth disparity, coaching adjustment compression (margins shrink as series progress), elimination game intensity, and pace-based scoring. Produces game character labels (BLOWOUT RISK / SEPARATION / COMPETITIVE / GRIND / COIN FLIP) with blowout and close-game probability estimates. Based on 2025 playoff research showing margins from 1 to 55 points.
          <div class="formula">Margin = baseDiff × 1.2 × talentMultiplier + depthEdge + starAbsenceBoost + injuryDrag × coachingCompression × eliminationFactor</div>
          <strong>Ghost Prevention:</strong> All secondary penalties (health degradation, fatigue, star ceiling, etc.) use getEffectiveRating() to respect scenario toggles. injuryRisk only penalized in one system (Health Degradation Curve). D-LEBRON only contributes at team rating level, not duplicated in win probability.
        </div>
      </details>
    `;
  } else if (currentGameTab === 'stats') {
    // Player Stats Visualization tab
    const selTeam = currentRosterTeam === 'home' ? s.homeTeam : s.awayTeam;
    tabContent = `
      <!-- Team toggle tabs -->
      <div class="roster-team-tabs">
        <div class="roster-team-tab ${currentRosterTeam==='home'?'active':''}" style="${currentRosterTeam==='home'?'background:'+s.homeTeam.color:''}" onclick="switchRosterTeam('home')">${s.homeTeam.name}<span class="rtt-record">${s.homeTeam.record}</span></div>
        <div class="roster-team-tab ${currentRosterTeam==='away'?'active':''}" style="${currentRosterTeam==='away'?'background:'+s.awayTeam.color:''}" onclick="switchRosterTeam('away')">${s.awayTeam.name}<span class="rtt-record">${s.awayTeam.record}</span></div>
      </div>
      <!-- Visual stat bars for selected team -->
      <div class="player-viz">
        <div class="player-viz-title"><span style="width:4px;height:14px;border-radius:2px;background:${selTeam.color};display:inline-block"></span>${selTeam.name} — Advanced Player Metrics</div>
        <div class="player-viz-grid">${renderPlayerViz(selTeam, s)}</div>
      </div>
      <!-- Roster table for selected team -->
      ${renderRosterTable(selTeam, s)}
      <!-- Synergy for selected team -->
      ${renderSynergy(selTeam)}
    `;
  } else if (currentGameTab === 'fatigue') {
    // Fatigue & Injury Monitor tab
    const selTeam = currentRosterTeam === 'home' ? s.homeTeam : s.awayTeam;
    tabContent = `
      ${renderFatigueMonitor(s)}
      <!-- Team toggle tabs for roster -->
      <div class="roster-team-tabs">
        <div class="roster-team-tab ${currentRosterTeam==='home'?'active':''}" style="${currentRosterTeam==='home'?'background:'+s.homeTeam.color:''}" onclick="switchRosterTeam('home')">${s.homeTeam.name}<span class="rtt-record">${s.homeTeam.record}</span></div>
        <div class="roster-team-tab ${currentRosterTeam==='away'?'active':''}" style="${currentRosterTeam==='away'?'background:'+s.awayTeam.color:''}" onclick="switchRosterTeam('away')">${s.awayTeam.name}<span class="rtt-record">${s.awayTeam.record}</span></div>
      </div>
      ${renderRosterTable(selTeam, s)}
    `;
  } else {
    // Individual game tabs (g1, g2, etc.)
    const gIdx = parseInt(currentGameTab.replace('g','')) - 1;
    const gameData = s.games[gIdx];
    const isHome = gIdx<2||gIdx===4||gIdx===6;
    
    if (gIdx === 0) {
      // Game 1
      tabContent = `
        ${renderGamePrediction(s, 'game1', 1, 'var(--purple)', 'Game 1')}
        ${s.games[0].winner ? `<div style="background:rgba(61,214,140,0.08);border:1px solid rgba(61,214,140,0.3);border-radius:10px;padding:14px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
          <span style="font-size:12px;font-weight:700;color:var(--green);background:rgba(61,214,140,0.15);padding:4px 10px;border-radius:6px">ACTUAL</span>
          <span style="font-size:14px;font-weight:700">${getGameResultDisplay(s, 1)}</span>
        </div>` : ''}
        ${s.modelLessons ? `<div class="lessons-banner">
          <div class="lessons-title">Model Lessons from Game 1</div>
          ${s.modelLessons.map(l => `<div class="lesson-item"><span class="lesson-label ${l.type}">${l.type.toUpperCase()}</span>${l.lesson}</div>`).join('')}
        </div>` : ''}
        ${renderFatigueMonitor(s)}
      `;
    } else if (gIdx === 1 && s.game2) {
      // Game 2
      tabContent = `
        ${renderGamePrediction(s, 'game2', 2, 'var(--green)', 'Game 2')}
        ${s.game2.g1Adjustments ? `<div style="background:rgba(0,0,0,0.15);border-radius:8px;padding:12px;margin-bottom:16px">
          <div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:6px;text-transform:uppercase">Key Adjustments from Game 1</div>
          ${s.game2.g1Adjustments.map(a => '<div style="font-size:12px;color:var(--text-dim);line-height:1.6;padding:2px 0">&bull; '+a+'</div>').join('')}
        </div>` : ''}
        ${s.games[1] && s.games[1].winner ? `<div style="background:rgba(61,214,140,0.08);border:1px solid rgba(61,214,140,0.3);border-radius:10px;padding:14px;margin-bottom:16px;display:flex;align-items:center;gap:12px">
          <span style="font-size:12px;font-weight:700;color:var(--green);background:rgba(61,214,140,0.15);padding:4px 10px;border-radius:6px">ACTUAL</span>
          <span style="font-size:14px;font-weight:700">${getGameResultDisplay(s, 2)}</span>
        </div>` : ''}
        ${renderFatigueMonitor(s)}
      `;
    } else {
      // Games 3-7 (future games or with results)
      const gNum = gIdx + 1;
      tabContent = `
        <div class="game-panel">
          <div class="game-panel-header">
            <div class="game-panel-title">Game ${gNum}</div>
            <div style="font-size:12px;color:var(--text-dim)">@ ${isHome?s.homeTeam.abbr:s.awayTeam.abbr}</div>
          </div>
          ${gameData.winner ? `<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <span style="font-size:12px;font-weight:700;color:var(--green);background:rgba(61,214,140,0.15);padding:4px 10px;border-radius:6px">RESULT</span>
            <span style="font-size:14px;font-weight:700">${getGameResultDisplay(s, gNum)}</span>
          </div>` : `<div style="color:var(--text-dim);font-size:13px;margin-bottom:12px">Game not yet played. <span style="cursor:pointer;color:var(--accent);text-decoration:underline" onclick="openGameModal(${gIdx})">Enter result</span></div>`}
          ${gameData.notes ? `<div style="font-size:12px;color:var(--text-dim);line-height:1.6;padding:8px;background:rgba(0,0,0,0.15);border-radius:8px">${gameData.notes}</div>` : ''}
        </div>
        ${renderFatigueMonitor(s)}
      `;
    }
  }

  document.getElementById('main').innerHTML = `
    ${headerHtml}
    ${gameTabsHtml}
    ${tabContent}

    <div class="data-sources">
      <strong>Sources:</strong>
      <a href="https://www.basketball-reference.com/leagues/NBA_2026_advanced.html">BBRef</a> |
      <a href="https://dunksandthrees.com/epm">EPM</a> |
      <a href="https://www.nba.com/stats/teams/advanced">NBA.com</a> |
      <a href="https://www.bball-index.com">BBall Index LEBRON</a> |
      <a href="https://philipmaymin.com/papers/Maymin%20Maymin%20and%20Shen%20-%20NBA%20Chemistry%20-%20IJCSS.pdf">SPM Chemistry</a>
    </div>
  `;
}

function renderRosterTable(team, series) {
  const sid = series.id;
  return `<div class="roster-section"><div class="roster-title"><span class="team-color" style="background:${team.color}"></span>${team.city} ${team.name} — Player Ratings (Advanced) <span style="font-size:10px;color:var(--text-dim);font-weight:400;margin-left:8px">Click toggles to build scenarios</span></div>
  <div style="overflow-x:auto"><table><tr><th></th><th>Player</th><th>Rating</th><th>PPG</th><th>PER</th><th>TS%</th><th>EPM</th><th>BPM</th><th>WS/48</th><th>On/Off</th><th>Clutch</th><th>Context</th></tr>
  ${team.players.map(p => {
    const isOut = scenarioState[sid] && scenarioState[sid][p.name] === 'out';
    const effRating = getEffectiveRating(p, sid);
    const escapedName = p.name.replace(/'/g, "\\'");
    return `<tr class="${isOut ? 'player-row-out' : ''}"><td><span class="player-toggle ${isOut ? 'toggled-out' : ''}" onclick="togglePlayer('${sid}','${escapedName}')">${isOut ? '\u2717' : '\u2713'}</span></td><td><span class="player-name">${p.name}</span><span class="pos-badge">${p.pos}</span>${p.injury?'<span class="injury-tag">'+p.injury.split('\u2014')[0].trim()+'</span>':''}</td>
  <td><span class="rating-pill ${getRatingClass(effRating)}">${effRating>0?effRating:'OUT'}</span></td>
  <td>${p.ppg}</td><td class="adv-cell">${p.per}</td><td class="adv-cell">${p.ts}%</td><td class="adv-cell" style="color:${p.epm>=5?'var(--green)':p.epm>=2?'var(--accent)':p.epm>=0?'var(--yellow)':'var(--red)'}">${p.epm>0?'+':''}${p.epm}</td>
  <td class="adv-cell">${p.bpm>0?'+':''}${p.bpm}</td><td class="adv-cell">${p.ws48}</td><td class="adv-cell" style="color:${p.onOff>=5?'var(--green)':p.onOff>=2?'var(--accent)':p.onOff>=0?'var(--yellow)':'var(--red)'}">${p.onOff>0?'+':''}${p.onOff}</td>
  <td class="adv-cell">${p.clutch}</td><td class="factor-cell"><span class="factor-note">${p.matchupNote}</span></td></tr>`;
  }).join('')}</table></div>${renderHistoricalImpact(team, sid)}</div>`;
}

function renderHistoricalImpact(team, seriesId) {
  const histTeam = HISTORICAL_WITHOUT[team.abbr];
  if (!histTeam) return '';
  const toggledOut = team.players.filter(p => {
    const br = p.baseRating || p.rating || 0;
    return br > 0 && scenarioState[seriesId] && scenarioState[seriesId][p.name] === 'out' && histTeam[p.name];
  });
  if (!toggledOut.length) return '';
  return `<div class="hist-impact-section">
    <div class="hist-impact-title">Historical Without-Star Data (2025-26 Season)</div>
    ${toggledOut.map(p => {
      const h = histTeam[p.name];
      const winColor = h.winPct >= .600 ? 'var(--green)' : h.winPct >= .450 ? 'var(--yellow)' : 'var(--red)';
      const nrColor = h.netRtgSwing >= 0 ? 'var(--green)' : h.netRtgSwing >= -5 ? 'var(--yellow)' : 'var(--red)';
      return `<div class="hist-impact-card">
        <div class="hist-player-header"><span class="player-name">${p.name}</span><span class="hist-record" style="color:${winColor}">Record without: ${h.record} (${(h.winPct*100).toFixed(0)}%)</span><span class="hist-netrtg" style="color:${nrColor}">NetRtg swing: ${h.netRtgSwing > 0 ? '+' : ''}${h.netRtgSwing}</span></div>
        <div class="hist-detail"><strong>Who steps up:</strong> ${h.stepUp}</div>
        <div class="hist-detail"><strong>Coach adjustment:</strong> ${h.coachAdj}</div>
        <div class="hist-detail"><strong>Playoff parallel:</strong> ${h.playoffNote}</div>
        <div class="hist-sources">Sources: ${h.sources.join(', ')}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderSynergy(team) {
  return `<div class="synergy-section"><div class="synergy-title">${team.name} — Lineup Synergy</div>
  ${team.synergy.map(s=>`<div class="lineup-row"><div class="lineup-players">${s.players.map(p=>`<span class="lineup-player-chip">${p}</span>`).join('')}</div><div class="synergy-score"><span class="rating-pill ${getRatingClass(s.score)}">${s.score}</span></div><div class="synergy-note">${s.note}</div></div>`).join('')}</div>`;
}

// SPM Chemistry Rendering
function renderSPMChemistry(series) {
  const hChem = getCachedSPM(series.homeTeam, series.id);
  const aChem = getCachedSPM(series.awayTeam, series.id);

  function renderTeamSPM(team, chem) {
    const active = team.players.filter(p=>p.rating>0).slice(0,8);
    // Aggregate skill profile for the lineup
    const agg = { oScr:0, oBH:0, oReb:0, dScr:0, dBH:0, dReb:0 };
    active.forEach(p => {
      const sk = inferSPMSkills(p);
      agg.oScr += sk.oScr; agg.oBH += sk.oBH; agg.oReb += sk.oReb;
      agg.dScr += sk.dScr; agg.dBH += sk.dBH; agg.dReb += sk.dReb;
    });
    // Normalize to 0-10 per player average
    const n = active.length || 1;
    Object.keys(agg).forEach(k => agg[k] = +(agg[k]/n).toFixed(1));

    const chemColor = chem.score >= 70 ? 'var(--green)' : chem.score >= 55 ? 'var(--accent)' : chem.score >= 45 ? 'var(--yellow)' : 'var(--red)';

    return `<div class="spm-team-card">
      <div class="spm-team-name"><span class="team-color-bar" style="background:${team.color};width:4px;height:14px;border-radius:2px;display:inline-block"></span>${team.name} Rotation (Top 8)</div>
      <div class="spm-skill-row"><span class="spm-skill-label">Off. Scoring</span><div class="spm-meter"><div class="spm-meter-fill" style="width:${agg.oScr*10}%;background:var(--accent)"></div></div><span class="spm-skill-val">${agg.oScr}</span></div>
      <div class="spm-skill-row"><span class="spm-skill-label">Off. Ball-Hndl</span><div class="spm-meter"><div class="spm-meter-fill" style="width:${agg.oBH*10}%;background:var(--purple)"></div></div><span class="spm-skill-val">${agg.oBH}</span></div>
      <div class="spm-skill-row"><span class="spm-skill-label">Off. Rebound</span><div class="spm-meter"><div class="spm-meter-fill" style="width:${agg.oReb*10}%;background:var(--yellow)"></div></div><span class="spm-skill-val">${agg.oReb}</span></div>
      <div class="spm-skill-row"><span class="spm-skill-label">Def. Scoring</span><div class="spm-meter"><div class="spm-meter-fill" style="width:${agg.dScr*10}%;background:var(--green)"></div></div><span class="spm-skill-val">${agg.dScr}</span></div>
      <div class="spm-skill-row"><span class="spm-skill-label">Def. Ball-Hndl</span><div class="spm-meter"><div class="spm-meter-fill" style="width:${agg.dBH*10}%;background:var(--accent2)"></div></div><span class="spm-skill-val">${agg.dBH}</span></div>
      <div class="spm-skill-row"><span class="spm-skill-label">Def. Rebound</span><div class="spm-meter"><div class="spm-meter-fill" style="width:${agg.dReb*10}%;background:var(--text-dim)"></div></div><span class="spm-skill-val">${agg.dReb}</span></div>
      <div class="spm-chem-score">
        <div class="label">SPM Chemistry</div>
        <div class="val" style="color:${chemColor}">${chem.score}</div>
        <div class="spm-verdict" style="color:${chemColor}">${chem.verdict}</div>
      </div>
      ${chem.synergies.length ? `<div class="spm-synergy-bar" style="flex-wrap:wrap;margin-top:8px">${chem.synergies.map(syn => `<span class="spm-synergy-chip ${syn.type}" title="${syn.pair}: ${syn.value>0?'+':''}${syn.value} pts/game">${syn.pair} ${syn.value>0?'+':''}${syn.value}</span>`).join('')}</div>` : ''}
    </div>`;
  }

  return `<div class="spm-section">
    <div class="spm-title">SPM Chemistry Analysis</div>
    <div class="spm-subtitle">Based on Maymin, Maymin & Shen (IJCSS 2013) — Skills Plus Minus framework measuring skill complementarity vs. redundancy</div>
    <div class="spm-grid">
      ${renderTeamSPM(series.homeTeam, hChem)}
      ${renderTeamSPM(series.awayTeam, aChem)}
    </div>
  </div>`;
}

// On/Off Impact Rendering
function renderOnOffImpact(series) {
  function renderTeamOnOff(team) {
    const summary = calcOnOffSummary(team);
    return `<div class="onoff-team">
      <div class="onoff-team-name" style="display:flex;align-items:center;gap:6px"><span style="width:4px;height:14px;border-radius:2px;background:${team.color};display:inline-block"></span>${team.name} <span style="font-size:10px;color:var(--text-dim);font-weight:400">Avg On/Off: <span style="color:${summary.avg>=3?'var(--green)':summary.avg>=1?'var(--accent)':summary.avg>=0?'var(--yellow)':'var(--red)'};font-weight:700">${summary.avg>0?'+':''}${summary.avg}</span></span></div>
      ${summary.players.map(p => {
        const barWidth = Math.min(100, Math.abs(p.onOff) * 8);
        const barColor = p.onOff >= 5 ? 'var(--green)' : p.onOff >= 2 ? 'var(--accent)' : p.onOff >= 0 ? 'var(--yellow)' : 'var(--red)';
        return `<div class="onoff-player">
          <span class="onoff-name">${p.name}</span>
          <div style="display:flex;align-items:center;gap:4px">
            <span class="onoff-val" style="color:${barColor}">${p.onOff>0?'+':''}${p.onOff}</span>
            <div class="onoff-bar"><div class="onoff-bar-fill" style="width:${barWidth}%;background:${barColor}"></div></div>
          </div>
        </div>`;
      }).join('')}
      <div style="margin-top:8px;font-size:10px;color:var(--text-dim)">Swing: <strong style="color:var(--text)">${summary.swing}</strong> (${summary.top.name} ${summary.top.onOff>0?'+':''}${summary.top.onOff} to ${summary.worst.name} ${summary.worst.onOff>0?'+':''}${summary.worst.onOff})</div>
    </div>`;
  }

  return `<div class="onoff-section">
    <div class="onoff-title">On/Off Court Impact <span style="font-size:10px;color:var(--text-dim);font-weight:400;margin-left:8px">Net Rating swing when player is on vs. off court (source: Basketball-Reference, FantasyLabs)</span></div>
    <div class="onoff-grid">
      ${renderTeamOnOff(series.homeTeam)}
      ${renderTeamOnOff(series.awayTeam)}
    </div>
  </div>`;
}

function renderCoaching(series) {
  const c = series.coaching;
  if (!c) return '';

  function renderCoachCard(coachData, team) {
    return `<div class="coach-card">
      <div class="coach-name">
        <span style="width:4px;height:18px;border-radius:2px;background:${team.color};display:inline-block"></span>
        ${coachData.coach}
        <span class="coach-label">${team.name} HC</span>
      </div>
      <div class="coach-record">Playoff Record: <strong>${coachData.playoffRecord}</strong></div>
      <div class="coach-tendency"><strong>Tendency:</strong> ${coachData.tendency}</div>
      <div class="coach-detail">
        <div class="coach-detail-label">Rotation Plan</div>
        ${coachData.rotationPlan}
      </div>
      <div class="coach-detail">
        <div class="coach-detail-label">Key Adjustment</div>
        ${coachData.keyAdjustment}
      </div>
    </div>`;
  }

  function renderLineupRow(lineupData, teamAbbr) {
    const nrColor = lineupData.netRtg >= 10 ? 'var(--green)' : lineupData.netRtg >= 5 ? 'var(--accent)' : lineupData.netRtg >= 0 ? 'var(--yellow)' : 'var(--red)';
    return `<div class="lineup-stat-row">
      <div class="team-label" style="color:${nrColor}">${teamAbbr}</div>
      <div class="lineup-players-list">${lineupData.players.map(p => '<span class="lineup-player-chip">' + p + '</span>').join('')}</div>
      <div class="lineup-stats">
        <div class="ls"><div class="ls-label">Net</div><div class="ls-val" style="color:${nrColor}">${lineupData.netRtg > 0 ? '+' : ''}${lineupData.netRtg}</div></div>
        <div class="ls"><div class="ls-label">ORtg</div><div class="ls-val">${lineupData.ortg}</div></div>
        <div class="ls"><div class="ls-label">DRtg</div><div class="ls-val">${lineupData.drtg}</div></div>
        <div class="ls"><div class="ls-label">Min</div><div class="ls-val">${lineupData.min}</div></div>
      </div>
      <div class="lineup-note">${lineupData.note}</div>
    </div>`;
  }

  function renderRoleChange(rc) {
    const arrowSymbol = rc.impact === 'up' ? '\u2191' : rc.impact === 'down' ? '\u2193' : '\u2192';
    const arrowClass = rc.impact === 'up' ? 'up' : rc.impact === 'down' ? 'down' : 'same';
    return `<div class="role-change-item">
      <div class="rc-player">${rc.player}<span class="rc-team">${rc.team}</span></div>
      <div class="rc-arrow ${arrowClass}">${arrowSymbol}</div>
      <div class="rc-roles">
        <div class="rc-from">${rc.regSeason}</div>
        <div class="rc-to">${arrowSymbol} ${rc.playoff}</div>
        <div class="rc-reason">${rc.reason}</div>
      </div>
    </div>`;
  }

  return `<div class="coaching-section">
    <div class="coaching-title">Coaching & Lineup Intelligence</div>
    <div class="coaching-subtitle">Coach tendencies, top lineups, and predicted role changes for this series</div>

    <div class="coaching-grid">
      ${renderCoachCard(c.home, series.homeTeam)}
      ${renderCoachCard(c.away, series.awayTeam)}
    </div>

    <div class="lineup-data-section">
      <div class="lineup-data-title">Top 5-Man Lineups</div>
      ${renderLineupRow(c.bestLineups.home, series.homeTeam.abbr)}
      ${renderLineupRow(c.bestLineups.away, series.awayTeam.abbr)}
    </div>

    <div class="role-change-section">
      <div class="role-change-title">Playoff Role Change Predictions</div>
      ${c.roleChanges.map(rc => renderRoleChange(rc)).join('')}
    </div>
  </div>`;
}
