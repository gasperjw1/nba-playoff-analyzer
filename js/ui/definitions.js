// ============================================================
// DEFINITIONS PAGE
// ============================================================

function renderDefinitionsPage(el) {
  el.innerHTML = `
  <div class="page-content">
    <div class="page-header">Definitions & Glossary</div>
    <div class="page-subheader">Every metric, abbreviation, and model concept — grouped by category. Click a tab to navigate.</div>

    <!-- DEFINITION TABS -->
    <div class="scroll-x" style="display:flex;gap:0;margin-bottom:24px;flex-wrap:wrap;justify-content:center;">
      <div class="def-tab-btn" id="defTab-player" onclick="switchDefTab('player')" style="padding:8px 16px;border-radius:8px 0 0 8px;cursor:pointer;font-size:12px;font-weight:700;background:var(--accent);color:#fff;border:1px solid var(--accent);transition:all 0.2s;flex-shrink:0;white-space:nowrap;">Player Metrics</div>
      <div class="def-tab-btn" id="defTab-team" onclick="switchDefTab('team')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">Team Metrics</div>
      <div class="def-tab-btn" id="defTab-model" onclick="switchDefTab('model')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">Model Concepts</div>
      <div class="def-tab-btn" id="defTab-backtest" onclick="switchDefTab('backtest')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">Backtest Factors</div>
      <div class="def-tab-btn" id="defTab-g1lessons" onclick="switchDefTab('g1lessons')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">G1 Lessons</div>
      <div class="def-tab-btn" id="defTab-margins" onclick="switchDefTab('margins')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">Margin Variance</div>
      <div class="def-tab-btn" id="defTab-fatigue" onclick="switchDefTab('fatigue')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">Fatigue</div>
      <div class="def-tab-btn" id="defTab-research" onclick="switchDefTab('research')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">Phase 17 Research</div>
      <div class="def-tab-btn" id="defTab-xfactors" onclick="switchDefTab('xfactors')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">X-Factors</div>
      <div class="def-tab-btn" id="defTab-turnovers" onclick="switchDefTab('turnovers')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">TOV & Fouls</div>
      <div class="def-tab-btn" id="defTab-threepoint" onclick="switchDefTab('threepoint')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">3PT Variance</div>
      <div class="def-tab-btn" id="defTab-roleflex" onclick="switchDefTab('roleflex')" style="padding:8px 16px;border-radius:0 8px 8px 0;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;flex-shrink:0;white-space:nowrap;">Role Flexibility</div>
    </div>

    <!-- PLAYER TAB -->
    <div id="defContent-player" class="def-tab-content">
    <div class="def-category player">Player-Level Metrics</div>
    <div class="def-grid">
      <div class="def-card"><div class="def-term">Player Efficiency Rating <span class="def-abbr">PER</span></div><div class="def-desc">A per-minute rating developed by John Hollinger. <strong>League average is 15.0.</strong> Used at 15% weight. Stars 22-32; role players 10-16.</div></div>
      <div class="def-card"><div class="def-term">True Shooting Percentage <span class="def-abbr">TS%</span></div><div class="def-formula">TS% = PTS / (2 x (FGA + 0.44 x FTA))</div><div class="def-desc">The most accurate shooting efficiency measure. <strong>League avg ~57%.</strong> Used at 12% weight. Elite 62%+; league-best 67%.</div></div>
      <div class="def-card"><div class="def-term">Estimated Plus-Minus <span class="def-abbr">EPM</span></div><div class="def-desc"><strong>Most predictive single metric</strong> for playoffs. Estimates pts/100 possessions added, adjusted for teammates/opponents. <strong>Avg 0.0.</strong> Given 18% weight (highest). MVP 7-10; starters 1-3.</div></div>
      <div class="def-card"><div class="def-term">Box Plus-Minus <span class="def-abbr">BPM</span></div><div class="def-desc">Box-score estimate of pts/100 above average. <strong>Avg 0.0.</strong> Less predictive than EPM but universally available. 15% weight. All-Stars 4-8; MVPs 8-12.</div></div>
      <div class="def-card"><div class="def-term">Win Shares per 48 Min <span class="def-abbr">WS/48</span></div><div class="def-formula">WS/48 = Win Shares / (MP / 48)</div><div class="def-desc">Wins contributed per 48 minutes. <strong>Avg ~0.100.</strong> 12% weight. Elite 0.200+; replacement ~0.000.</div></div>
      <div class="def-card"><div class="def-term">On/Off Rating <span class="def-abbr">On/Off</span></div><div class="def-desc">Team net rating difference when player is on vs off court. Captures gravity and defensive presence. 10% weight. +8 = franchise-altering.</div></div>
      <div class="def-card"><div class="def-term">Clutch Rating <span class="def-abbr">Clutch</span></div><div class="def-desc">Performance in final 5 min within 5 pts. Scale 1-10. 10% weight. Elite closers (LeBron, SGA) rate 8+.</div></div>
      <div class="def-card"><div class="def-term">Usage Rate <span class="def-abbr">USG%</span></div><div class="def-formula">USG% = 100 x (FGA + 0.44 x FTA + TOV) x (Tm MP / 5) / (MP x Tm Poss)</div><div class="def-desc">% of team plays used while on floor. <strong>Avg 20%.</strong> 8% weight. Primary scorers 28-35%.</div></div>
      <div class="def-card"><div class="def-term">Value Over Replacement <span class="def-abbr">VORP</span></div><div class="def-desc">Cumulative pts/100 above replacement, scaled to 82 games. <strong>Avg ~1.0.</strong> Identified by Yla-Autio (2022) as single most important predictor. MVP 6-10; starters 2-4.</div></div>
      <div class="def-card"><div class="def-term">LEBRON <span class="def-abbr">LEBRON</span></div><div class="def-desc"><strong>Luck-adjusted player Estimate using Box prior Regularized ON-off</strong> (BBall Index). <strong>0.0 = avg; -2.7 = replacement.</strong> MVP 4.0+; elite starters 2.0-3.5. Split into O-LEBRON and D-LEBRON.</div></div>
      <div class="def-card"><div class="def-term">Offensive LEBRON <span class="def-abbr">O-LEBRON</span></div><div class="def-desc">Offensive component isolating scoring, playmaking, spacing impact. <strong>0.0 = avg.</strong> 2.5+ = elite offensive engine. Paired with OffRole classification.</div></div>
      <div class="def-card"><div class="def-term">Defensive LEBRON <span class="def-abbr">D-LEBRON</span></div><div class="def-desc">Defensive component isolating rim protection, perimeter D, help D. <strong>0.0 = avg.</strong> Used in team aggregate bonus and matchup differential. Paired with DefRole.</div></div>
      <div class="def-card"><div class="def-term">Wins Above Replacement <span class="def-abbr">WAR</span></div><div class="def-desc">LEBRON's cumulative metric — total wins above replacement level. <strong>Avg starter ~4.0; MVP 10+.</strong> Teams with WAR &gt; 35 get rating boost.</div></div>
    </div>
    </div>

    <!-- TEAM TAB -->
    <div id="defContent-team" class="def-tab-content" style="display:none;">
    <div class="def-category team">Team-Level Metrics</div>
    <div class="def-grid">
      <div class="def-card"><div class="def-term">Offensive Rating <span class="def-abbr">ORtg</span></div><div class="def-desc">Points scored per 100 possessions. <strong>Avg ~113.</strong> Elite 118+.</div></div>
      <div class="def-card"><div class="def-term">Defensive Rating <span class="def-abbr">DRtg</span></div><div class="def-desc">Points allowed per 100 possessions. <strong>Avg ~113.</strong> Elite 108 or fewer. Lower is better.</div></div>
      <div class="def-card"><div class="def-term">Net Rating <span class="def-abbr">NetRtg</span></div><div class="def-formula">NetRtg = ORtg - DRtg</div><div class="def-desc"><strong>Single best predictor of team quality.</strong> Avg 0.0. +10 = historically dominant. Champions typically +5 to +12.</div></div>
      <div class="def-card"><div class="def-term">Clutch Net Rating <span class="def-abbr">ClutchNetRtg</span></div><div class="def-desc">Team NetRtg in clutch situations (final 5 min, within 5 pts). OKC's +8.5 = elite closer; HOU's -2.8 = closing problems.</div></div>
      <div class="def-card"><div class="def-term">Pace <span class="def-abbr">Pace</span></div><div class="def-desc">Possessions per 48 min. <strong>Avg ~99.</strong> Fast (102+) benefits underdogs. Slow (96-) benefits favorites.</div></div>
      <div class="def-card"><div class="def-term">Effective FG% <span class="def-abbr">eFG%</span></div><div class="def-formula">eFG% = (FGM + 0.5 x 3PM) / FGA</div><div class="def-desc">Adjusts FG% for 3-pt value. <strong>Avg ~53%.</strong> Elite 56-57%.</div></div>
      <div class="def-card"><div class="def-term">Turnover Rate <span class="def-abbr">TOV%</span></div><div class="def-desc">Turnovers per 100 possessions. <strong>Avg ~13.</strong> Lower is better. Teams below 12 have significant edge in playoffs.</div></div>
    </div>
    </div>

    <!-- MODEL TAB -->
    <div id="defContent-model" class="def-tab-content" style="display:none;">
    <div class="def-category model">Model-Specific Concepts</div>
    <div class="def-grid">
      <div class="def-card"><div class="def-term">Home Court Advantage <span class="def-abbr">HCA</span></div><div class="def-desc">Round-adjusted: R1=+2.5, R2=+1.7, CF=+1.3, Finals=+0.85 (reduced ~15% in Phase 17 per Barreira &amp; Morgado 2023 — HCA declining in modern NBA). Game 7 override: +2.5 (reduced from +5.0 per Li et al. 2025 — game location non-significant in G7).</div></div>
      <div class="def-card"><div class="def-term">Replacement Level <span class="def-abbr">REPL</span></div><div class="def-formula">REPLACEMENT_LEVEL = 48</div><div class="def-desc">Rating for inactive roster slots. Raised from 42 after 2024 backtest — playoff replacements are coached up (NYK competed in R2 missing 3 starters).</div></div>
      <div class="def-card"><div class="def-term">Win Probability Formula</div><div class="def-formula">P(home) = 1 / (1 + 10^(-(homeRating + HCA - awayRating) / 15))</div><div class="def-desc">Logistic function converting rating differential to 0-100% win probability. 15-point advantage = ~75% probability.</div></div>
      <div class="def-card"><div class="def-term">SPM Chemistry <span class="def-abbr">SPM v2</span></div><div class="def-desc">8-dimension player profiling model (Maymin et al. 2012, expanded with 3PT + Ball Distribution). Pairwise synergy via empirical coefficients. Score 50 = avg; 75+ = elite.</div></div>
      <div class="def-card"><div class="def-term">Scenario Builder</div><div class="def-desc">Interactive tool to toggle players IN/OUT and see real-time win prob changes. Ghost calcs prevented by isBaselineInjured/isScenarioToggled separation.</div></div>
      <div class="def-card"><div class="def-term">Ghost Calculation</div><div class="def-desc">Bug where injured players get double-penalized — once through replacement slot (correct) and again through secondary system (incorrect). Fixed by checking isBaselineInjured first.</div></div>
      <div class="def-card"><div class="def-term">Stat Differential <span class="def-abbr">StatDiff</span></div><div class="def-formula">0.4xFG%D + 0.25x3PT%D + 0.15xORB%D + 0.2xTOVD</div><div class="def-desc">Based on Jones &amp; Magel (2016) — explains 91.45% of point spread variance. Capped at +/-3 points.</div></div>
      <div class="def-card"><div class="def-term">Series-Stage Pressure <span class="def-abbr">PressureMod</span></div><div class="def-desc">Mateus et al. (2024): player behavior shifts in later games. Elimination games (+0.5) and tied series (+0.3) favor experienced teams.</div></div>
      <div class="def-card"><div class="def-term">Non-Linear Interactions <span class="def-abbr">NLI</span></div><div class="def-desc">Yeung (2020): Random Forest (AUC 0.841) &gt; linear regression (0.738). Captures Shooting+Defense synergy and Pace+Depth interaction bonuses.</div></div>
      <div class="def-card" style="border-left:3px solid var(--green);"><div class="def-term">Per-Player Offensive Outlook <span class="def-abbr">gNPlayerOutlook</span></div><div class="def-desc"><strong>Phase 22.</strong> Research-backed per-player, per-game offensive outlook. Data key: <code>g3PlayerOutlook</code> (dynamic: <code>'g' + gameNum + 'PlayerOutlook'</code>). Each player entry: <code>outlook</code> (good/bad/neutral/neutral-good), <code>projFgPct</code>, <code>ptsRange</code> [min,max], <code>reason</code>, <code>confidence</code> (high/medium/low). "good"/"bad"/"neutral" outlook string was used for flat % boosts in Phase 22; <strong>superseded by Research Anchor Blend (Phase 31)</strong> which uses ptsRange directly for 60-70% weighted blending.</div></div>
      <div class="def-card" style="border-left:3px solid var(--green);"><div class="def-term">Research FG% Override <span class="def-abbr">researchFgPct</span></div><div class="def-desc"><strong>Phase 22.</strong> When a player has a <code>projFgPct</code> in their outlook entry, this value overrides the default FG% used to back-calculate shooting stats (FGM/FGA/TPM/TPA). Does NOT directly modify the point total — points are adjusted by the outlook boost/suppress. The FG% override ensures the shooting line reflects realistic efficiency for that player's projected game type.</div></div>
      <div class="def-card" style="border-left:3px solid var(--green);"><div class="def-term">Returning Player Logic <span class="def-abbr">RPL</span></div><div class="def-desc"><strong>Phase 22.</strong> In <code>calcProjectedBoxScore</code>, players who weren't in the prior box score but have a research outlook entry are added to the active player list. This handles injury returns (e.g., Quickley in CLE-TOR G3). Threshold is outlook-entry-based rather than rating-based to avoid normalization dilution from irrelevant bench players.</div></div>
      <div class="def-card" style="border-left:3px solid var(--green);"><div class="def-term">Bayesian Tiered Blend <span class="def-abbr">BayesBlend</span></div><div class="def-desc"><strong>Phase 22.</strong> Prior game box scores are blended with model projections at tiered weights: <strong>55/45</strong> (model/prior) for 15+ min players, <strong>70/30</strong> for 5-14 min players, <strong>100/0</strong> for new/returning players. This anchors projections to actual observed performance while allowing the model to pull toward true skill level.</div></div>
      <div class="def-card" style="border-left:3px solid #f0c040;"><div class="def-term">Research Anchor Blend <span class="def-abbr">RAB</span></div><div class="def-desc"><strong>Phase 31.</strong> When <code>gNPlayerOutlook</code> includes <code>ptsRange</code>, engine blends 60-70% research midpoint + 30-40% engine projection (high-confidence = 70/30, medium/low = 60/40). Replaces the old flat percentage boost system (+8-12% for "good"). Formula: <code>projPts = rMid × researchWeight + projPts × engineWeight</code>. Hard-clamped to [low - slack, high + slack] where slack = 10% of range width. This ensures projected box scores actually reflect written research analysis rather than letting multiplicative modifiers push stars 30-50% above their season PPG.</div></div>
      <div class="def-card" style="border-left:3px solid #f0c040;"><div class="def-term">Normalization Research Cap <span class="def-abbr">NormCap</span></div><div class="def-desc"><strong>Phase 31.</strong> Post-normalization per-player cap now uses <code>ptsRange[1] + 10% slack</code> instead of the old formula <code>max(ppg × 1.35, prior actual, 38)</code>. Built via <code>researchCaps</code> lookup at team scope. For LeBron with ptsRange [20,28]: new cap = 30.8 vs old cap = 38. Excess points from capped players are redistributed proportionally among uncapped players. Players without a ptsRange fall back to the old formula.</div></div>
      <div class="def-card" style="border-left:3px solid #f0c040;"><div class="def-term">Parlay History Timeline <span class="def-abbr">PHT</span></div><div class="def-desc"><strong>Phase 31.</strong> Scrollable visual timeline in the Featured Parlays tab showing a running record of all $100 Best Bet and $1 Chaos Ticket parlays. Tracks win/loss record and net P&amp;L. Each entry shows date, game slate, parlay legs, result status (LIVE TODAY, UPCOMING, WON, LOST). Auto-expands to show historical context for all previous picks.</div></div>
      <div class="def-card" style="border-left:3px solid #e74c3c;"><div class="def-term">Coaching Adjustment Quality <span class="def-abbr">CAQ</span></div><div class="def-desc"><strong>Phase 32.</strong> Blended coaching score replacing single <code>adjustmentRating</code>: 50% adjustmentRating + 30% schemeCreativity + 20% urgency. Feeds into Step 7 margin compression. Formula: <code>adjustmentRate = 0.15 + (caqScore/10) × 0.18</code> (15-33% per game). Evidence: Nurse (PHI, CAQ ~8.7) redesigned offense between G1-G2 → won by 14 after 32pt G1 loss. Mazzulla (BOS, CAQ ~5.0) "didn't make enough adjustments" → lost G2. Snyder (ATL, CAQ ~8.4) unlocked Kuminga + CJ McCollum 32pts.</div></div>
      <div class="def-card" style="border-left:3px solid #e74c3c;"><div class="def-term">Initiator Count <span class="def-abbr">IC</span></div><div class="def-desc"><strong>Phase 32.</strong> Discrete variable counting independent shot creators per team. Step 5g: <code>(homeIC - awayIC) × 1.0</code>, ±3.0pt cap, applies G2+. IC ≥ 3 = higher offensive floor (harder to scheme out). IC ≤ 1 = ceiling penalty (one bad star game = team collapse). Evidence: ORL 5 players 16+ pts beat Cade-only DET (IC=1). LAL committee (IC=2) beat HOU iso-heavy (Udoka: "stagnant"). Dynamic version via <code>calcDynamicInitiators()</code> updates from box scores.</div></div>
      <div class="def-card" style="border-left:3px solid #e74c3c;"><div class="def-term">Scheme Persistence Factor <span class="def-abbr">SPF</span></div><div class="def-desc"><strong>Phase 32.</strong> When FG% suppression in G1 is scheme-driven (not variance), it carries forward at 70% effectiveness. Step 5h: <code>fgSuppression × 80 FGA × 0.7 persistence</code>, ±4.0pt cap. Data: <code>series.schemePersistence.{home|away}.isSchemeDriven</code>. Evidence: LAL zone held HOU to 37.6% → 40.4% (persistent). Gobert on Jokic 1-of-8 (structural). Spoelstra "Giannis Wall" 2023: Giannis dropped to 21ppg for entire series. BOS 3PT suppressed to 26% by PHI G2 scheme.</div></div>
      <div class="def-card" style="border-left:3px solid #e74c3c;"><div class="def-term">Star Absence Recalibration <span class="def-abbr">SAR</span></div><div class="def-desc"><strong>Phase 32.</strong> Two components: (a) <strong>Role Player Redistribution</strong> (Step 5i) — when stars are out, teams with 4+ depth players (rated 65+) claw back 35% of the Step 4 star absence penalty. Evidence: Kennard 27/23pts with Luka + Reaves out. (b) <strong>Star Return Penalty</strong> (Step 5j) — players returning mid-series from injury lose 0.8pts per game missed, capped at 2.5pts. Data: <code>series.starReturnPenalty</code>. Evidence: KD returned G2 with 23pts but 9 TOs, 3pts after halftime.</div></div>
      <div class="def-card" style="border-left:3px solid #e74c3c;"><div class="def-term">Youth Playoff Ceiling <span class="def-abbr">YCM</span></div><div class="def-desc"><strong>Phase 32.</strong> Enhanced youth breakout multiplier with per-player research-backed overrides via <code>series.youthCeilings</code>. Default ceiling: 1.30 (single breakout), 1.40 (multi-game streak), raised from 1.25/1.35. Multi-game streak Bayesian blend: 25% model / 25% actual / 50% ceiling (was 30/25/45). Primary initiators sustain breakouts better than role players. Evidence: Edgecombe 30/10 (first rookie since Duncan 1998), Henderson 31pts on 65% FG, Banchero career playoff avg 28.0 vs 22.2 regular season.</div></div>
    </div>
    </div>

    <!-- BACKTEST TAB -->
    <div id="defContent-backtest" class="def-tab-content" style="display:none;">
    <div class="def-category backtest">Backtest-Calibrated Factors</div>
    <div class="def-grid">
      <div class="def-card"><div class="def-term">System Coherence <span class="def-abbr">systemBonus</span></div><div class="def-desc">Per-team modifier (-2 to +3). OKC (+2.5) and BOS (+2.0) highest. Captures how system transcends individual talent.</div></div>
      <div class="def-card"><div class="def-term">Playoff Pedigree <span class="def-abbr">playoffPedigree</span></div><div class="def-desc">Score 0-2 reflecting recent championship/deep-run experience. Adds up to +1.6 to team rating. Championship DNA is real.</div></div>
      <div class="def-card"><div class="def-term">Star Ceiling Variance <span class="def-abbr">starCeiling</span></div><div class="def-desc">Per-player 0-2 for stars who produce ceiling games. StarCeiling:2 adds +0.6 to win probability through upside variance.</div></div>
      <div class="def-card"><div class="def-term">Offensive Style <span class="def-abbr">offStyle / initiators</span></div><div class="def-desc">Partnow's research. initiators counts on-ball creators. 3+ get +0.5 bonus. Teams losing primary creator get -0.8 cascade penalty.</div></div>
      <div class="def-card"><div class="def-term">Playoff Ascension <span class="def-abbr">playoffAscension</span></div><div class="def-formula">Team bonus = Sum(playoffAscension x 0.6)</div><div class="def-desc">Per-player -0.5 to 1.5 for consistent playoff elevation. Brunson (1.5), Brown (1.0), Mitchell (1.0), LeBron (1.0). Harden (-0.5, playoff dropper).</div></div>
      <div class="def-card"><div class="def-term">Star-Pair Synergy <span class="def-abbr">eliteCreators</span></div><div class="def-formula">+1.0 bonus when 2+ players rated 85+ have Creator roles</div><div class="def-desc">Multiplicative advantage when elite creators share the floor. One doubled = other operates 1-on-1. BOS (Tatum+Brown) qualifies.</div></div>
      <div class="def-card"><div class="def-term">Pace Matchup <span class="def-abbr">paceMatchup</span></div><div class="def-formula">min(1.0, paceDiff x 0.15)</div><div class="def-desc">Faster team with 8+ active players gets bonus. Capped at 1.0 pts. Indiana's pace countered Milwaukee in 2024.</div></div>
      <div class="def-card"><div class="def-term">Def. Matchup Suppression <span class="def-abbr">defMatchupAdj</span></div><div class="def-formula">max(0, D-LEBRON) x (USG/30) x initiatorPenalty x 0.3</div><div class="def-desc">Elite defender on primary creator amplified by limited secondary creation. 1.5x for 1 initiator, 1.0x for 2, 0.7x for 3+. Validated: White on Maxey = +1.08 (bracket's largest).</div></div>
      <div class="def-card"><div class="def-term">Health Degradation <span class="def-abbr">injuryRisk</span></div><div class="def-formula">Penalty = injuryRisk x roundDepth x 0.4</div><div class="def-desc">Per-player 0-1.0. Increases in later rounds. KD (0.7), Doncic (1.0), Murray (0.8) carry significant risk.</div></div>
      <div class="def-card"><div class="def-term">Bounce-Back Probability <span class="def-abbr">BB%</span></div><div class="def-formula">BB% = 0.77 x roundModifier - systemAdv x 0.05</div><div class="def-desc">Home team winning G2 after losing G1. Baseline 77% in R1. Drops to ~35% in Finals.</div></div>
      <div class="def-card"><div class="def-term">Game 7 Override <span class="def-abbr">G7</span></div><div class="def-desc">HCA set to +2.5 when tied 3-3 (reduced from +5.0 in Phase 17). Li et al. (2025) found game location does NOT significantly affect G7 outcomes — EFG% and TOV% are the decisive factors. Second-half 3PT and DRB become critical.</div></div>
    </div>
    </div>

    <!-- G1 LESSONS TAB (NEW) -->
    <div id="defContent-g1lessons" class="def-tab-content" style="display:none;">
    <div class="def-category" style="background:linear-gradient(90deg,#2a1a3a,transparent);border-left:4px solid var(--purple);">Game 1 Lessons &amp; New Concepts</div>
    <div class="def-grid">
      <div class="def-card" style="border-left:3px solid var(--purple);">
        <div class="def-term">Single-Initiator Penalty <span class="def-abbr">SIP</span></div>
        <div class="def-formula">-1.5 pts in calcWinProb when initiators=1 vs initiators>=2</div>
        <div class="def-desc">Teams with only 1 on-ball creator (initiator) receive an additional penalty when facing teams with 2+ initiators. <strong>Validated by DET-ORL G1:</strong> Cade scored 39 pts as DET's sole initiator but the team still lost 112-101 — the offense couldn't sustain when he rested or was doubled. ORL's multi-creator approach (Banchero/Wagner/Bane) proved more resilient. This is independent of defMatchupSuppression; it captures the baseline vulnerability of one-creator offenses.</div>
      </div>
      <div class="def-card" style="border-left:3px solid var(--purple);">
        <div class="def-term">Playoff Pedigree Floor <span class="def-abbr">pedigreeFloor</span></div>
        <div class="def-formula">-0.5 modifier when playoffPedigree=0 AND no players with playoff series wins</div>
        <div class="def-desc">Teams with zero playoff pedigree AND no experienced playoff winners on the roster receive a <strong>penalty in high-leverage situations</strong>. DET's 11-game home playoff losing streak and franchise drought validated this — even with the #1 defense and Cade's brilliance, the team lacked the intangible "been there before" factor that compounds under playoff pressure. <strong>2026 teams affected:</strong> DET (0), POR (0), ATL (0).</div>
      </div>
      <div class="def-card" style="border-left:3px solid var(--purple);">
        <div class="def-term">Blowout Cascade Pattern <span class="def-abbr">BlowoutCascade</span></div>
        <div class="def-formula">When projected margin > 10 AND opponent missing top-5 on/off player OR has negative NetRtg: apply 1.5x multiplier</div>
        <div class="def-desc">When structural advantages compound (rating gap + injury + system mismatch), projected margins don't just add — they <strong>multiply</strong>. BOS-PHI (14 projected → 32 actual, 2.3x) and OKC-PHX (14 projected → 35 actual, 2.5x) both exceeded model expectations. Missing stars create cascading defensive breakdowns as replacements can't execute at playoff speed. Model now applies a 1.5x multiplier when specific compounding conditions are met.</div>
      </div>
      <div class="def-card" style="border-left:3px solid var(--purple);">
        <div class="def-term">Star Prop Trap <span class="def-abbr">StarPropTrap</span></div>
        <div class="def-desc"><strong>Never bet OVER on the favorite's star scoring prop in projected blowouts.</strong> When the model projects a 15+ point margin, the favorite's best player typically sits the 4th quarter. SGA, Tatum, Brown, Wemby — all left early in G1 blowouts. The OVER on their scoring props lost despite them being dominant. This trap only applies to the FAVORITE's stars; the UNDERDOG's stars still play full minutes in losses.</div>
      </div>
      <div class="def-card" style="border-left:3px solid var(--purple);">
        <div class="def-term">Coaching G1 Performance <span class="def-abbr">g1Performance</span></div>
        <div class="def-desc">A <strong>letter-grade rating (A through D+)</strong> assigned to each head coach after Game 1, evaluating tactical decisions, halftime adjustments, rotation management, and scheme execution. Added to the coaching object for all 16 playoff coaches. Used qualitatively in Game 2 prediction g1Adjustments to identify coaching edges. Examples: Mazzulla (BOS) A, Redick (LAL) A, Atkinson (CLE) A vs Rajakovic (TOR) D+, Udoka (HOU) D+.</div>
      </div>
      <div class="def-card" style="border-left:3px solid var(--purple);">
        <div class="def-term">Interim Coaching Penalty <span class="def-abbr">interimPenalty</span></div>
        <div class="def-desc">Originally modeled as a <strong>-7 impact</strong> for POR's interim coach Splitter (replacing Billups after gambling investigation). Audit found -7 may be overweighted — should be -4 to -5. Interim coaches lack scheme ownership, player trust continuity, and playoff preparation time. However, Splitter received B- for G1 (competitive first half), suggesting the penalty may moderate over the series as he adjusts. A unique edge: Splitter knows SAS's system as a former Spur.</div>
      </div>
      <div class="def-card" style="border-left:3px solid var(--purple);">
        <div class="def-term">Line Movement Skepticism</div>
        <div class="def-desc">Model no longer upgrades confidence based on <strong>line movements greater than 3 points</strong>. DET moved from -3.5 to -8.5 (a 5-point swing driven by public money on Cade's health narrative) — and lost. Large moves are now treated as noise/public money rather than sharp information. The original line was more accurate.</div>
      </div>
      <div class="def-card" style="border-left:3px solid var(--purple);">
        <div class="def-term">Bounce-Back G2 Compression</div>
        <div class="def-desc">When G1 margin exceeds 25 points, research indicates G2 margins average approximately <strong>60% of the G1 margin</strong>. Losing teams make film adjustments, play with desperation, and receive coaching corrections. This doesn't mean the losing team wins — it means blowout margins compress. Used in G2 spread predictions: PHX (+12.5 vs OKC), PHI (+16.5 vs BOS).</div>
      </div>
    </div>
    </div>

    <!-- MARGIN VARIANCE TAB -->
    <div id="defContent-margins" class="def-tab-content" style="display:none;">
    <div class="def-category" style="background:linear-gradient(90deg,#1a2a3a,transparent);border-left:4px solid #3b82f6;">Margin Variance Engine (2025 Playoff Research)</div>
    <div class="def-grid">
      <div class="def-card" style="border-left:3px solid #ef4444;">
        <div class="def-term">Talent Gap Amplifier <span class="def-abbr">TGA</span></div>
        <div class="def-desc">When the rating differential exceeds 6 points, the predicted margin scales non-linearly. Based on 2025 data: OKC-MEM (51pt G1), CLE-MIA (55pt G4). Dominant teams don't just win — they win <strong>big</strong> because depth disparity compounds via bench garbage time. Formula: <strong>margin multiplier = 1.0 + (diff - 6) × 0.06</strong>, steeper above 12pt diff. Max 2.5x.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #f59e0b;">
        <div class="def-term">Depth Disparity Factor <span class="def-abbr">DDF</span></div>
        <div class="def-desc">Counts active players rated 55+ on each team. The gap adds directly to expected margin (0.8 pts per player difference). 2025 evidence: CLE's 138-83 blowout used 10+ effective players; MIA had 5. Deep teams extend leads via fresh legs in Q3/Q4 and better bench play during garbage time.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #8b5cf6;">
        <div class="def-term">Coaching Adjustment Compression <span class="def-abbr">CAC</span></div>
        <div class="def-desc">As a series progresses, margins shrink because losing coaches study film and counter. OKC-MEM went <strong>51 → 19 → 6 → 2</strong> as Taylor adjusted. Each coach has an <strong>adjustmentRating</strong> (1-10) that determines compression speed. Formula: <strong>compression = 1 - (0.08 + coachRating/10 × 0.07) × (gameNum - 1)</strong>. Max 45% compression.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Elimination Game Intensity <span class="def-abbr">EGI</span></div>
        <div class="def-desc">Teams facing elimination play with maximum intensity, compressing expected margins by <strong>35%</strong>. 2025 evidence: NYK-DET had 4 consecutive games decided by 3 or fewer points during the elimination stretch. IND-MIL G5 (clincher) was decided by 1pt in OT. Close series (diff ≤ 1) get additional 20% compression.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #3b82f6;">
        <div class="def-term">Blowout Cascade Probability <span class="def-abbr">BCP</span></div>
        <div class="def-desc">The probability that a game becomes a 15+ point blowout. Based on talent gap: dominant matchups (12+ diff) have 20-55% BCP, even matchups have 5-11%. 2025 set a record with 4 games decided by 40+ points. Blowouts occur when early runs (like OKC's 20-0 run vs MEM) cascade via bench entry and psychological collapse.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #3b82f6;">
        <div class="def-term">Star Absence Margin Boost <span class="def-abbr">SAMB</span></div>
        <div class="def-desc">When a team is missing a star (baseRating ≥ 75, effective rating = 0), the predicted margin widens by <strong>~2.5 pts per star</strong> beyond the win probability shift. 2025 evidence: LAL without Doncic+Reaves lost G1 by 22; MIL without Lillard lost G4 by 26. Star absences affect margin more than probability because bench depth collapses.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #f59e0b;">
        <div class="def-term">Active Injury Margin Drag <span class="def-abbr">AIMD</span></div>
        <div class="def-desc">Players with <strong>activeInjury severity > 0.3</strong> widen margins against their team because partially hurt stars reduce efficiency in Q3/Q4 as fatigue compounds the injury. 2025 evidence: Edwards at 0.7 severity shot 7-19 FG. Formula: <strong>drag = severity × (baseRating / 100) × 1.5</strong> per injured player.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Game Character Labels</div>
        <div class="def-desc">Each projected game gets a character label based on expected margin. The label describes the <strong>likely texture and flow</strong> of the game — not just the score, but how it will feel. Labels drive betting strategy: BLOWOUT RISK games favor spreads and unders on the losing side, while COIN FLIP games favor moneylines and player props.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #ef4444;">
        <div class="def-term">BLOWOUT RISK <span class="def-abbr">18+ pts</span></div>
        <div class="def-desc">The favorite is projected to win by 18 or more points. Expect early separation, bench players logging heavy Q4 minutes, and star rest. Betting implications: spreads are risky (favorites sometimes pull starters early, narrowing the margin), but star unders become valuable since they may only play 28-32 minutes. Game pace often slows in garbage time. 2025 examples: OKC-MEM G1 (+51), CLE-MIA G4 (+55).</div>
      </div>
      <div class="def-card" style="border-left:3px solid #f59e0b;">
        <div class="def-term">SEPARATION <span class="def-abbr">12-17 pts</span></div>
        <div class="def-desc">The favorite has a clear structural edge and is expected to pull away, but the game stays competitive through the first half. Stars typically play full minutes. The losing team will make runs but can't sustain them — expect a decisive Q3 or early Q4 push that creates breathing room. Betting implications: star overs on the favorite are strong (full minutes + high usage in competitive stretches), and spreads are playable if the model margin aligns with the market line. Current examples: BOS-PHI (+11), SAS-POR (+12), OKC-PHX (+13).</div>
      </div>
      <div class="def-card" style="border-left:3px solid #3b82f6;">
        <div class="def-term">COMPETITIVE <span class="def-abbr">7-11 pts</span></div>
        <div class="def-desc">Both teams have paths to winning but the favorite holds a meaningful edge — usually through superior star talent, depth, or home court. The game is likely decided in the final 6 minutes. Lead changes are common through Q3. Betting implications: moneylines on the favorite offer the best risk/reward, and player props are reliable since both stars will play maximum minutes in a contested game. Spread bets carry more risk due to the volatility window. Current example: HOU-LAL (+6).</div>
      </div>
      <div class="def-card" style="border-left:3px solid #8b5cf6;">
        <div class="def-term">GRIND <span class="def-abbr">4-6 pts</span></div>
        <div class="def-desc">A game decided by execution, not talent. Both teams are closely matched and the margin comes down to which side makes fewer mistakes in crunch time. Expect a low-variance, physical contest — 4th-quarter slugfest with every possession mattering. Lead is unlikely to exceed 8 points at any time. Betting implications: moneylines are risky (too close to justify heavy chalk), totals/unders have value (grinding pace suppresses scoring), and assist/rebound props can be volatile due to defensive intensity. Example: DEN-MIN G2 (model +3, actual MIN won by 5).</div>
      </div>
      <div class="def-card" style="border-left:3px solid #6b7280;">
        <div class="def-term">COIN FLIP <span class="def-abbr">0-3 pts</span></div>
        <div class="def-desc">The model has essentially no edge — the game is a true toss-up. Neither team's structural advantages are large enough to project a meaningful winner. The outcome depends on which stars have a great night and which team hits big shots in the final 2 minutes. Betting implications: avoid moneylines entirely (no model edge to exploit), look for player props where individual matchups provide an edge independent of the game outcome, and consider live betting as the game develops. These games are where the $1 upset parlays live.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #8b5cf6;">
        <div class="def-term">Pace-Based Score Projection</div>
        <div class="def-desc">Projected scores use team pace and efficiency ratings rather than static estimates. Playoff games average <strong>~97% of regular season pace</strong>. Each team's expected efficiency is a 60/40 blend of their own ORtg and the opponent's DRtg. Scores are then adjusted to match the dynamically calculated margin.</div>
      </div>
    </div>
    </div>

    <!-- FATIGUE TAB -->
    <div id="defContent-fatigue" class="def-tab-content" style="display:none;">
    <div class="def-category" style="background:linear-gradient(90deg,#4a3520,transparent);border-left:4px solid #d4a04a;">Fatigue Monitor (Medium Confidence)</div>
    <div class="def-grid">
      <div class="def-card" style="border-left:3px solid #d4a04a;"><div class="def-term">Fatigue Index <span class="def-abbr">FI</span></div><div class="def-desc">Per-team 0.0-1.0 scale estimating cumulative fatigue. Stars weighted more heavily. FI &gt; 0.03 = rating penalty up to ~2.5 pts + margin engine differential (Step 5b). <strong>MEDIUM CONFIDENCE</strong> — weighted at 0.75× (upgraded from 0.5× after G1 validation).</div></div>
      <div class="def-card" style="border-left:3px solid #d4a04a;"><div class="def-term">Age Factor</div><div class="def-desc">Players <strong>33+</strong> fatigue faster: 0.08/year over 32, compounding +30%/round. LeBron (40), CP3 (40) carry meaningful risk in deep runs.</div></div>
      <div class="def-card" style="border-left:3px solid #d4a04a;"><div class="def-term">Mental Fatigue</div><div class="def-desc">Pageaux et al.: reduces FT accuracy ~5%, decision-making ~6%. 0.03/game, +15%/round. Ball handlers and creators carry extra mental load (+0.05).</div></div>
      <div class="def-card" style="border-left:3px solid #d4a04a;"><div class="def-term">Minutes Load</div><div class="def-desc">Players averaging 36+ min show degraded 3PT accuracy and turnover rate (p=0.038). 15% compounding/game. Heavy-minutes stars can lose 0.5 fatigue pts in 7 games.</div></div>
      <div class="def-card" style="border-left:3px solid #d4a04a;"><div class="def-term">Active Injury <span class="def-abbr">activeInjury</span></div><div class="def-desc">Per-player object: {type, severity (0-1), note}. Distinct from injuryRisk. Severity x 0.15 base contribution, +20%/game, +25%/round. Edwards' knee (0.7), Cade's lung (0.5), Wemby's rib (0.1 post-G1).</div></div>
      <div class="def-card" style="border-left:3px solid #d4a04a;"><div class="def-term">Medium Confidence Weight</div><div class="def-desc">All fatigue calculations weighted at <strong>0.75×</strong> (upgraded from 0.5× LOW). G1 validated fatigue signals: LeBron's age-driven role shift, Edwards' altitude fatigue, Sharpe's conditioning limits, Tatum's Achilles monitoring. Now feeds directly into margin engine (Step 5b: Fatigue Differential).</div></div>
    </div>
    </div>

    <!-- PHASE 17 RESEARCH TAB -->
    <div id="defContent-research" class="def-tab-content" style="display:none;">
    <div class="def-category" style="background:linear-gradient(90deg,#1a3a2a,transparent);border-left:4px solid #10b981;">Phase 17 — Google Scholar Research Integration</div>
    <div style="color:var(--text-dim);font-size:12px;margin-bottom:16px;padding:0 4px;">16 papers reviewed from Google Scholar across 9 topic areas. Papers ranked by trustworthiness (journal quality, citation count, recency) and impact on our model. All changes are research-backed.</div>
    <div class="def-grid">
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Playoff Adjustment Factor <span class="def-abbr">PAF</span></div>
        <div class="def-formula">paceReduction: 0.95 | fgWeightBoost: 1.15 | drbWeightBoost: 1.20</div>
        <div class="def-desc"><strong>Cabarkapa et al. (2022), PLOS ONE, 81 citations.</strong> Playoff basketball is MORE CONSERVATIVE: fewer FGA, assists, steals, turnovers, and total points. FG% and DRB are the top two discriminators (23-26% of explained variance). Discriminant model achieves 87.2% accuracy in playoffs. Applied: pace reduction increased from 3% to 5%, FG% differential weight boosted 15% in stat bonus.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Research-Calibrated HCA <span class="def-abbr">HCA v2</span></div>
        <div class="def-formula">R1: 3.0→2.5 | R2: 2.0→1.7 | CF: 1.5→1.3 | Finals: 1.0→0.85</div>
        <div class="def-desc"><strong>Barreira &amp; Morgado (2023), 15 citations.</strong> Longitudinal analysis of NBA playoff HCA (1946-2022) shows statistically significant decrease over time. <strong>López-García et al. (2024), 10 citations:</strong> Team ability matters more than crowd support. <strong>Ganz &amp; Allsop (2024), 8 citations:</strong> COVID bubble data isolating fan effect. All three converge: modern HCA is ~15% weaker than historical estimates.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Game 7 Location Non-Significant <span class="def-abbr">G7 Research</span></div>
        <div class="def-formula">G7 override: 5.0 → 2.5</div>
        <div class="def-desc"><strong>Li et al. (2025), Taylor &amp; Francis.</strong> 10-year analysis (2013-2023) of decisive NBA playoff Game 7s. Critical finding: game location does NOT significantly affect G7 outcomes. EFG% positively associated with point differential (p &lt; 0.001), TOV% negatively (p &lt; 0.01). In the second half, 3PT shooting and defensive rebounds become the decisive factors. Override reduced from +5 to +2.5.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Non-Linear Fatigue Recovery <span class="def-abbr">NLFR</span></div>
        <div class="def-formula">1-day rest = 0.6× | 2-day = 0.85× | 3+ day = 1.0× recovery</div>
        <div class="def-desc"><strong>Esteves et al. (2021), European Journal of Sport Science, 95 citations.</strong> Schedule congestion impacts NBA performance via non-linear recovery curve. Playoff teams showed different fatigue profiles than non-playoff teams. Three days of rest represents the full recovery threshold. Model now applies rest penalty in later rounds where games are more frequent.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Cumulative Season Minutes <span class="def-abbr">CSM</span></div>
        <div class="def-formula">fatigue += (estSeasonMin - 2400) × 0.0003 × (1 + depth × 0.2)</div>
        <div class="def-desc"><strong>Jewell et al. (2025), Journal of Quantitative Analysis in Sports.</strong> End-of-season performance declines as function of cumulative minutes played. Players averaging 36+ MPG over 82 games carry ~2800+ minutes — this baseline load compounds with playoff games. Model now adds fatigue floor for heavy-minute players. Complements per-game fatigue (tracks LONG-TERM wear, not just recent rest).</div>
      </div>
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Playoff Clutch Boost <span class="def-abbr">PCB</span></div>
        <div class="def-formula">Clutch weight: 10% → 13% (team ClutchNetRtg divisor: 4 → 3.5)</div>
        <div class="def-desc"><strong>Sarlis et al. (2024), MDPI, 31 citations.</strong> Clutch dynamics analysis reveals clutch performance patterns differ in playoff contexts. <strong>Iatropoulos et al. (2025), 14 citations:</strong> Defensive metrics become MORE critical in late-game playoff situations; offensive efficiency paramount. Clutch weight increased because closing ability is more predictive in postseason than regular season.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Technical Foul Momentum <span class="def-abbr">TFM</span></div>
        <div class="def-desc"><strong>Tenenbaum et al. (2025), three papers across MDPI/SAGE/T&amp;F, 1-5 citations.</strong> Coach technical fouls serve as strategic momentum shifts — they can trigger rallies. But player TFs (like Edwards' 18 league-leading techs) represent uncontrolled emotional volatility, not strategy. This validates our Edwards external factor and suggests modeling a distinction between strategic coach TFs and harmful player TFs.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Elimination Pressure Override <span class="def-abbr">EPO</span></div>
        <div class="def-desc"><strong>Morgulev et al. (2022), Taylor &amp; Francis, 4 citations.</strong> Teams "with their back to the wall" (one-sided elimination games) produce measurably different performance. Integrated into calcBounceBackProb(): large series leads (2-0 or 3-1) reduce bounce-back probability by 5% because trailing team desperation partially cancels leading team's expected advantage.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #10b981;">
        <div class="def-term">Supporting Research</div>
        <div class="def-desc">Additional papers reviewed for validation: <strong>Terner &amp; Franks (2021)</strong> — 130 citations, validates RAPM-style framework. <strong>Huyghe et al. (2022)</strong> — 54 citations, systematic review confirms multi-factor approach. <strong>Stiles (2024)</strong> — validates D-LEBRON suppression methodology. <strong>Cristo (2025)</strong> — combines injury risk + clutch for game prediction (mirrors our approach). <strong>Singh et al. (2021)</strong> — 51 citations, sleep/recovery science for NBA.</div>
      </div>
    </div>
    </div>

    <!-- X-FACTORS TAB -->
    <div id="defContent-xfactors" class="def-tab-content" style="display:none;">
    <div class="def-category" style="background:linear-gradient(90deg,#3a1a3a,transparent);border-left:4px solid #e040c0;">Series X-Factors — Players Who Swing Outcomes</div>
    <div style="color:var(--text-dim);font-size:12px;margin-bottom:16px;padding:0 4px;">X-factors are non-obvious players whose performance disproportionately swings the series outcome. They're typically role players exceeding expectations, defensive stoppers who change matchup dynamics, or bench scorers who tilt depth battles. Identified via g2PlayerOutlook data, G1/G2 results, and matchup analysis.</div>

    <div style="color:#e040c0;font-weight:700;font-size:14px;margin:16px 0 8px;border-bottom:1px solid #333;padding-bottom:4px;">WEST</div>

    <div class="def-grid">
      <div class="def-card" style="border-left:3px solid #e040c0;">
        <div class="def-term">HOU-LAL</div>
        <div class="def-desc"><strong>HOU — Luke Kennard (OFF):</strong> Broke out for 27pts (5-5 3PT) in G1 with LeBron facilitating. His two-man game with LeBron (+8.7 NetRtg) makes him the #2 scoring option. Model flags him as "bad" for G2 — HOU will scheme against him, making his efficiency the key swing.<br><strong>HOU — Marcus Smart (DEF):</strong> DPOY-caliber switching across 2-4 positions. Hunted Sengun/Sheppard defensively in G1 while enabling LAL's man/zone hybrid.<br><strong>LAL — Alperen Sengun (OFF):</strong> All-Star anchor shot 31.6% G1 (worst of season). His regression to 46% FG determines whether HOU has a reliable second scorer alongside KD's return.<br><strong>LAL — Kevin Durant (RETURN):</strong> His rust level on return (minutes restriction, shooting efficiency) is the single biggest variable in the series.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #e040c0;">
        <div class="def-term">OKC-PHX</div>
        <div class="def-desc"><strong>OKC — Ajay Mitchell (OFF):</strong> 9pts on 3-4 3PT with +22 net in 22min G1. Bench scorer who bridges SGA's rest minutes. His third-level creation maintains OKC's offensive rhythm when starters sit.<br><strong>OKC — Cason Wallace (DEF):</strong> Team-high +23, with 4ast/2stl/2blk in 21min. Switchable POA defender on Booker's actions. His composure in the backcourt reduces PHX's ball-pressure options.<br><strong>PHX — Jalen Green (OFF):</strong> Play-in hero (35 and 36pts). Athleticism was suppressed in G1 blowout but ceiling remains a legitimate scoring punch if PHX can keep games closer.<br><strong>PHX — Ryan Dunn (DEF):</strong> 6'8 defensive specialist designated as primary SGA stopper. PHX's only credible perimeter countermeasure to OKC's multi-threat attack.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #e040c0;">
        <div class="def-term">DEN-MIN</div>
        <div class="def-desc"><strong>DEN — Christian Braun (OFF):</strong> Emerging 3rd option — 12pts/8reb G1, 16pts/5ast G2 on 36mpg starter minutes. Championship DNA (2023). His all-around game expands DEN's attack beyond Jokic-Murray.<br><strong>DEN — Bruce Brown (DEF):</strong> 5 steals G1. POA defensive pest who disrupts MIN's rhythm. Getting increased closing minutes. Changes games without box score impact.<br><strong>MIN — Donte DiVincenzo (OFF):</strong> 16pts/7reb/6ast G2 including late 3PT and game-sealing slam (4-7 3PT). Starting PG over Conley — his shooting/athleticism transformed MIN's spacing. +4.0 avgOverPerformance.<br><strong>MIN — Rudy Gobert (DEF):</strong> ESPN: "contains Jokic" as key to G2 win. G1 WPA MVP (+15.0%) with 17pts (8-9 FG). Held Jokic to 1-8 when matched up in G2. MIN's DRtg is 7.9pts/100 worse without him.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #e040c0;">
        <div class="def-term">SAS-POR</div>
        <div class="def-desc"><strong>SAS — Stephon Castle (OFF/DEF):</strong> Sophomore two-way guard (D-LEBRON 0.908, 57.5% TS) who scored 17pts G1 while drawing the Avdija assignment. His defensive versatility helps the switchable scheme even when Avdija scores through him.<br><strong>SAS — Devin Vassell (OFF):</strong> Stretch wing whose spacing alongside Wemby and Fox creates open driving lanes. If his 3PT efficiency holds, SAS's offensive ceiling is elite.<br><strong>POR — Scoot Henderson (OFF):</strong> Breakout 3rd-year scorer (14.2 PPG in 30 starts). 18pts G1 off bench — his explosive athleticism and 3.7 APG adds offensive punch beyond Avdija/Holiday.<br><strong>POR — Donovan Clingan (DEF):</strong> Rim protector (D-LEBRON 3.407, 7.6 WAR) whose interior presence is POR's only answer to Wemby's drives. Was neutralized by SAS length G1, but his ability to avoid foul trouble is critical.</div>
      </div>
    </div>

    <div style="color:#e040c0;font-weight:700;font-size:14px;margin:16px 0 8px;border-bottom:1px solid #333;padding-bottom:4px;">EAST</div>

    <div class="def-grid">
      <div class="def-card" style="border-left:3px solid #e040c0;">
        <div class="def-term">BOS-PHI</div>
        <div class="def-desc"><strong>BOS — Payton Pritchard (OFF):</strong> Starter-level production from the bench (17.0 PPG, 37.7% 3PT, 5.2 APG). In the closing lineup. Provides secondary creation and floor-spacing, especially critical during Tatum rest stretches (Achilles management).<br><strong>BOS — Derrick White (DEF):</strong> Elite perimeter stopper (D-LEBRON 2.324, 11.43 WAR). Full-time Maxey assignment held him to 8-20 FG G1. His 5.5 on/off defensive impact is the primary reason BOS can roam freely on help defense.<br><strong>PHI — Paul George (OFF):</strong> All-Star ceiling (41.5% 3PT post-suspension, 21.0 PPG in 10 games). Rhythm-finding after suspension rust is critical — PHI's only secondary creator who can generate off-ball alongside Maxey.<br><strong>PHI — VJ Edgecombe (DEF):</strong> Breakout rookie whose D-LEBRON of 0.08 makes him a mismatch liability against Brown. His defensive struggles are actually a BOS exploitation target — the anti-x-factor PHI must manage.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #e040c0;">
        <div class="def-term">DET-ORL</div>
        <div class="def-desc"><strong>DET — Ausar Thompson (DEF):</strong> Elite perimeter stopper (D-LEBRON 2.93, #3 in NBA). His assignment on Banchero and 2.0 STL/game anchor DET's #1-rated defense (107.2 DRtg). DET's defensive identity runs through him.<br><strong>DET — Duncan Robinson (OFF):</strong> 41% 3PT spacing (9pts, 3-6 3PT G1). Forces ORL to stay attached on the perimeter, opening driving lanes for Cunningham and Duren in the paint.<br><strong>ORL — Jalen Suggs (DEF/OFF):</strong> Heartbeat of ORL — 16pts/3stl/1blk G1, ignited 18-5 opening run. 2024 playoff pedigree (7-game CLE series). Executes the "let Cade score, suffocate everyone else" strategy. His intensity sets the defensive tone.<br><strong>ORL — Anthony Black (OFF):</strong> Sophomore breakout (model corrected to 15.0 PPG). 6'7 combo guard whose secondary creation relieves Banchero's load and enables ORL's 5-player balanced attack.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #e040c0;">
        <div class="def-term">NYK-ATL</div>
        <div class="def-desc"><strong>NYK — Josh Hart (OFF):</strong> 13pts/13.5reb/5.5ast average through G1-G2. Does everything — offensive boards, transition, playmaking. His hustle creates extra possessions that don't show up in traditional projections.<br><strong>NYK — Mitchell Robinson (DEF):</strong> Rim protector whose shot-blocking forced ATL into hack-a-Robinson (proving his impact). Minutes may increase as Brown deploys him more against ATL's frontcourt.<br><strong>ATL — CJ McCollum (OFF):</strong> 29.0 PPG average (26pts G1, 32pts G2 — hunted Brunson 1-on-1 in crunch time). Portland playoff pedigree activated. +10.3 avgOverPerformance — the single most impactful x-factor in R1. Snyder running more actions through him each game.<br><strong>ATL — Dyson Daniels (DEF):</strong> Steals leader (3stl G1, 2stl G2). MIP with D-LEBRON 1.907. His ball-hawking disrupts NYK's half-court rhythm even when his own offense struggles.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #e040c0;">
        <div class="def-term">CLE-TOR</div>
        <div class="def-desc"><strong>CLE — Max Strus (OFF):</strong> Bench scoring explosion — 24pts G1 (playoff career high after missing 67 games). Scored 11pts during CLE's 27-9 run. His microwave shooting off the bench is the depth weapon TOR can't match.<br><strong>CLE — Dean Wade (DEF):</strong> 2stl each game. Meeting Ingram at point of attack was key to CLE's scheme lock (Ingram 17pts→7pts). His versatile wing defense is CLE's glue.<br><strong>TOR — Collin Murray-Boyles (OFF):</strong> BREAKOUT rookie — 14pts G1 (7-8 FG), 17pts G2 (expanded to 25min). Averaging +7.0pts over 8.5 PPG baseline. The clearest offensive x-factor in any series — forced Rajakovic to bench Poeltl for him.<br><strong>TOR — Ja'Kobe Walter (DEF):</strong> Best POA defender on Mitchell assignment. Better shooter than Shead (.409 3PT) so his minutes don't hurt TOR's spacing while providing defensive resistance.</div>
      </div>
    </div>
    </div>

    <!-- TOV & Fouls Tab -->
    <div id="defContent-turnovers" class="def-tab-content" style="display:none;">
      <div class="def-card" style="border-left:3px solid #ff6b35;">
        <div class="def-term">Turnover Modeling — How It Works</div>
        <div class="def-desc">Each turnover swing between teams is worth approximately <strong>1.07 points</strong> (combining lost possession value + transition opportunity for the opponent). Our model calculates a <strong>TOV Differential</strong> per series, then applies a <strong>Pressure Multiplier</strong> based on historical playoff data — how much each star's turnover rate increases in high-pressure moments compared to their regular season baseline.
        <br><br><strong>Formula:</strong> TOV Impact = (Away TOV/game − Home TOV/game) × 1.07 pts/TOV × Pressure Multiplier
        <br><br><strong>Key insight:</strong> Turnovers are the most REPEATABLE stat in playoffs. Teams that turn it over a lot in G1 tend to keep turning it over — unlike shooting variance (which regresses), turnover tendencies are structural (ball-handling quality, defensive pressure, pace).</div>
      </div>
      <div class="def-card" style="border-left:3px solid #ff6b35;">
        <div class="def-term">2026 Playoff TOV Leaderboard</div>
        <div class="def-desc"><strong>Best Ball Security (Team TOV%):</strong>
        <br>1. OKC — 7.2% (8.0 TOV/game) — elite discipline
        <br>2. BOS — 9.1% (10.0 TOV/game) — veteran composure
        <br>3. SAS — 11.5% (12.0 TOV/game) — Pop's system
        <br><br><strong>Worst Ball Security (Team TOV%):</strong>
        <br>1. LAL — 20.5% (20.0 TOV/game) — decimated roster
        <br>2. TOR — 18.4% (20.0 TOV/game) — no PG (Quickley OUT)
        <br>3. PHX — 17.3% (19.0 TOV/game) — OKC's D forces mistakes
        <br><br><strong>Individual TOV Leaders (2026 Playoffs):</strong>
        <br>Marcus Smart: 5.0/game (G1 outlier) | Scottie Barnes: 4.5 | James Harden: 4.5 | Jokic: 4.0 | KAT: 4.0 | Wemby: 4.0 | CJ McCollum: 3.5</div>
      </div>
      <div class="def-card" style="border-left:3px solid #ff6b35;">
        <div class="def-term">Historical Pressure Patterns — Star TOV Under Pressure</div>
        <div class="def-desc"><strong>LeBron James (293 playoff games):</strong> Career 3.58 TOV/game. At age 41, shifted to facilitator role = FEWER turnovers (G1: only 2 TOV with 13 assists). His playoff TOV rate has actually DECREASED as he ages. Finals average: 4.2 TOV but compensated by 8.5 AST.
        <br><br><strong>Nikola Jokic (96 playoff games):</strong> Career 3.32 TOV/game but SPIKES in crunch time. When Jokic has 5+ TOV, DEN is 5-12. Peak pressure games: 8 TOV (OKC G3 2025), 7 TOV (OKC G1 2025, LAL G5 2024). His high-volume passing (8+ APG) creates inherent TOV risk — it's the trade-off for his playmaking brilliance.
        <br><br><strong>Anthony Edwards (44 playoff games):</strong> Career 2.70 TOV/game. ELIMINATION GAME PATTERN: TOV spikes to 4.2 avg (vs 2.7 career). When Ant has 4+ TOV, MIN is 3-6. Notable: 7 TOV in GSW G5 2025, 5 TOV in OKC G4 2025. Young star who forces shots when frustrated.
        <br><br><strong>Donovan Mitchell (69 playoff games):</strong> Career 2.8 TOV/game. Steady — doesn't spike under pressure. His mid-range/iso game produces low live-ball TOV rates. One of the most reliable ball-security stars in the playoffs.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #e53935;">
        <div class="def-term">Foul Trouble Probability — How It Works</div>
        <div class="def-desc">Foul trouble modeling estimates the <strong>probability that a key player picks up 4+ fouls by Q3</strong> (forcing the coach to manage minutes), then multiplies that by the team's <strong>DRtg degradation</strong> when that player sits.
        <br><br><strong>Formula:</strong> Foul Impact = P(4+ fouls by Q3) × (Team DRtg without player − Team DRtg with player) × remaining minutes
        <br><br><strong>Why it matters:</strong> A star picking up 2 fouls in Q1 creates a cascade: coach benches them → team plays 6-8 minutes without their anchor → opponent builds a lead → star returns in foul trouble and plays passively → reduced effectiveness even when on the floor.
        <br><br><strong>Risk Tiers:</strong> LOW (&lt;10% chance of 5+ PF), MEDIUM (10-20%), HIGH (20-35%), EXTREME (&gt;35%)</div>
      </div>
      <div class="def-card" style="border-left:3px solid #e53935;">
        <div class="def-term">2026 Playoff Foul Trouble Watch List</div>
        <div class="def-desc"><strong>EXTREME RISK:</strong>
        <br>• Jalen Suggs (ORL) — 6.0 PF/game, FOULED OUT in G1. ORL's perimeter D collapses without him.
        <br><br><strong>HIGH RISK:</strong>
        <br>• Gobert (MIN) — 3.0 avg but 5 fouls in G2. MIN DRtg 7.9pts/100 worse without him. DEN targets him in P&R.
        <br>• McDaniels (MIN) — 4.5 PF/game. MIN's best wing defender. Unsustainable rate.
        <br>• KAT (MIN) — 4.5 PF/game. Jokic draws fouls in post. Losing KAT = losing secondary scorer.
        <br>• Sengun (HOU) — 5.0 PF in G1. Smart's physical D draws fouls. HOU's only elite creator.
        <br>• Shead (TOR) — 4.5 PF/game as the ONLY healthy PG. Foul trouble = no ballhandler.
        <br><br><strong>MEDIUM RISK:</strong>
        <br>• Nurkic (PHX) — 4.0 PF. PHX's only rim protector.
        <br>• Okongwu (ATL) — 4.0 PF. ATL's rim protection + lob threat.
        <br>• Drummond (PHI) — 3.0 PF. PHI's only center without Embiid.
        <br><br><strong>ELITE FOUL DISCIPLINE:</strong>
        <br>• LeBron — 2.27 PF/game career playoff (only 2 foul-outs in 293 games)
        <br>• Wemby — 2.0 PF in G1. Blocks shots without fouling. DPOY-level discipline.
        <br>• Mobley — 2.0 PF. Elite defensive technique = low foul rate.</div>
      </div>
      <div class="def-card" style="border-left:3px solid #e53935;">
        <div class="def-term">Series-by-Series TOV & Foul Impact</div>
        <div class="def-desc"><strong>Biggest TOV Edges:</strong>
        <br>1. <strong>OKC-PHX:</strong> 11.0 TOV differential → ~11.8pts/game for OKC (nearly the G1 margin)
        <br>2. <strong>CLE-TOR:</strong> 8.0 TOV differential → ~8.6pts/game. TOR's 18→22 TOV trend is WORSENING.
        <br>3. <strong>HOU-LAL:</strong> 6.8 differential → ~7.3pts/game. LAL won G1 despite this — unsustainable.
        <br>4. <strong>BOS-PHI:</strong> 6.0 differential → ~6.4pts/game. Maxey carrying entire load = turnovers.
        <br><br><strong>Biggest Foul Trouble Risks:</strong>
        <br>1. <strong>MIN (DEN-MIN):</strong> 27.5 team PF/game. Gobert, McDaniels, KAT ALL at risk. DEN's strategy is to draw Gobert fouls early.
        <br>2. <strong>ORL (DET-ORL):</strong> Suggs fouled out G1. If he gets early fouls in G2, DET's guards feast.
        <br>3. <strong>HOU (HOU-LAL):</strong> Sengun's 5 PF in G1. Smart's physical D is kryptonite.
        <br>4. <strong>TOR (CLE-TOR):</strong> Shead at 4.5 PF as only PG. One foul trouble game = total breakdown.</div>
      </div>
    </div>

    <!-- 3PT VARIANCE TAB (Phase 25) -->
    <div id="defContent-threepoint" class="def-tab-content" style="display:none;">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;">

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">3PT Regression Model (Phase 25)</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Core Principle:</strong> 3PT shooting is the most volatile aspect of NBA basketball. Teams hover around mid-30% over a full season but can swing ±10% over 1-5 game stretches.
            <br><br><strong>Bayesian Blend Formula:</strong>
            <br>Expected 3P% = (playoff_3PA × playoff_3P% + season_3PA × regWeight × season_3P%) / (playoff_3PA + season_3PA × regWeight)
            <br><br><strong>Regression Weights:</strong>
            <br>• 1-game sample: regWeight = 0.70 (heavy regression toward season baseline)
            <br>• 2-game sample: regWeight = 0.55 (moderate regression)
            <br>• 3+ game sample: regWeight = 0.40 (less regression, more trust in playoff data)
            <br><br><strong>Impact Calculation:</strong>
            <br>Point Swing = (expected_3P% - actual_3P%) × 3PA × 3
            <br>Each 5% 3P% change on 35 3PA = ~5.25 points per game</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Unsustainability Flags</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Role-Player Inflation:</strong> Bench/role players shooting >15% above career avg from 3 — this is the #1 predictor of regression. (e.g., Kennard 1.000, Okongwu .667, Wemby .833)
            <br><br><strong>Star Cold Streaks:</strong> Stars shooting >12% below season avg on 5+ 3PA — expect bounce-back. (e.g., SGA 0/4, Murray .273, Edwards .250, Bane .125)
            <br><br><strong>Team Extremes:</strong> Any team 3P% deviation >8% from season baseline on 20+ 3PA is HIGH CONFIDENCE regression.
            <br><br><strong>Shot Quality Filter:</strong> Not all regression is equal. Contested 3s regressing is less impactful than open-look misses. Teams generating open looks (BOS, OKC) will sustain higher 3P% than teams forcing contested 3s (PHX, POR).</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">2026 Playoff Team 3PT: Regular Season vs Playoffs</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong style="color:#ff6b6b;">REGRESSION DOWN (shooting hot):</strong>
            <br>• LAL: .526 playoff vs .359 season (+16.7%) — EXTREME
            <br>• SAS: .455 playoff vs .359 season (+9.6%) — HIGH
            <br>• CLE: .403 playoff vs .360 season (+4.3%) — MODERATE
            <br><br><strong style="color:#51cf66;">REGRESSION UP (shooting cold):</strong>
            <br>• PHI: .174 playoff vs .349 season (-17.5%) — EXTREME
            <br>• POR: .263 playoff vs .343 season (-8.0%) — HIGH
            <br>• DEN: .325 playoff vs .396 season (-7.1%) — HIGH
            <br>• OKC: .304 playoff vs .365 season (-6.1%) — MODERATE
            <br>• ORL: .294 playoff vs .343 season (-4.9%) — MODERATE
            <br>• DET: .313 playoff vs .356 season (-4.3%) — MODERATE
            <br><br><strong style="color:#aaa;">AT BASELINE (sustainable):</strong>
            <br>• BOS: .364 vs .367 (-0.3%), MIN: .368 vs .370 (-0.2%), NYK: .390 vs .373 (+1.7%)</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Top Individual Regression Candidates</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong style="color:#ff6b6b;">Most Likely to Cool Down:</strong>
            <br>1. <strong>Kennard (LAL):</strong> 5/5 (1.000) vs .440 career — will crash hardest
            <br>2. <strong>Wembanyama (SAS):</strong> 5/6 (.833) vs .359 season — ~7 pts of 3PT regression alone
            <br>3. <strong>Okongwu (ATL):</strong> 3/4.5 (.667) vs sub-.200 career — ATL's G2 upset was built on this mirage
            <br>4. <strong>Strus (CLE):</strong> 3/5 (.600) vs .370 season — G1 hero, won't sustain
            <br>5. <strong>DiVincenzo (MIN):</strong> 4/7 (.571) vs .370 season — role player hot streak
            <br><br><strong style="color:#51cf66;">Most Likely to Heat Up:</strong>
            <br>1. <strong>Bane (ORL):</strong> 1/8 (.125) vs .380 season — biggest single-player regression UP candidate
            <br>2. <strong>PHI team (4/23):</strong> .174 vs .349 — whole team due for correction
            <br>3. <strong>SGA (OKC):</strong> 0/4 (.000) vs .387 season — best 3PT season, complete whiff G1
            <br>4. <strong>Murray (DEN):</strong> 3/11 (.273) vs .380 season — DEN's offense hinges on Murray's shot
            <br>5. <strong>Edwards (MIN):</strong> 2.5/10 (.250) vs .370 season — cold Ant masks MIN's ceiling
            <br>6. <strong>Holiday (POR):</strong> 1/7 (.143) vs .350 season — veteran shooter's worst game</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Structural 3PT Edges (Not Variance)</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            Some 3PT performance isn't variance — it's <strong>structural</strong> (defense-driven and repeatable):
            <br><br><strong>OKC's 3PT Defense:</strong> Opponents shot .333 from 3 in G1 (PHX). OKC's switching creates the most contested 3PT looks in the playoffs. This suppression is REPEATABLE — don't expect PHX to suddenly find open 3s.
            <br><br><strong>BOS's 3PT Volume:</strong> Highest 3PAr in playoffs (48.9% of shots are 3s). BOS generates more open 3s through ball movement than any team. Their .364 3P% is sustainable because shot quality is elite.
            <br><br><strong>BOS's 3PT Defense:</strong> Held PHI to .174 from 3 — the worst in playoffs. While some regression UP is expected, BOS's perimeter rotations are structural. PHI's ceiling vs BOS is ~.300, not .349.
            <br><br><strong>LAL's Low Volume:</strong> Only 19 3PA (lowest in playoffs). LAL doesn't need 3s to win — they dominate the paint (48-30 in G1). Their .526 will regress but it matters LESS because they take so few.
            <br><br><strong>POR's High Volume/Low Skill:</strong> 38 3PA at .263 — POR relies on volume to compensate for below-average shooting talent (.343 season). Even with regression UP, they'll stay below league average.</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Series-by-Series 3PT Impact Summary</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>HIGH IMPACT:</strong>
            <br>1. <strong>HOU-LAL:</strong> LAL's .526→~.375 regression = ~4.5 pts toward HOU. KD's return + 3PT regression could flip G2.
            <br>2. <strong>SAS-POR:</strong> Double regression — SAS hot (.455→.370) and POR cold (.263→.320). G2 margin compresses 6-8 pts.
            <br>3. <strong>DEN-MIN:</strong> Most volatile series. DEN cold (.325 vs .396 RS), Edwards cold (.250 vs .370). Whoever's shooters regress first wins.
            <br><br><strong>MODERATE IMPACT:</strong>
            <br>4. <strong>NYK-ATL:</strong> Okongwu's .667→.200 regression costs ATL ~5 pts. Bridges' cold .300→.370 partially offsets for NYK.
            <br>5. <strong>DET-ORL:</strong> Both cold. Bane's .125→.350 is biggest single swing in East.
            <br><br><strong>LOW IMPACT:</strong>
            <br>6. <strong>CLE-TOR:</strong> CLE hot but paint-dominant. 3PT regression won't change series trajectory.
            <br>7. <strong>BOS-PHI:</strong> PHI's .174 will regress but BOS defense caps it at ~.300. Gap too large.
            <br>8. <strong>OKC-PHX:</strong> OKC won by 35 WHILE shooting cold. SGA regression UP makes it worse for PHX.</div>
        </div>

      </div>
    </div>

    <!-- ROLE FLEXIBILITY TAB -->
    <div id="defContent-roleflex" class="def-tab-content" style="display:none;">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;">

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Role Flexibility Model (Phase 26)</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Research Foundation:</strong> Nylon Calculus (Miller 2018) used HHI-based defensive versatility to measure switching capacity. Key finding: <strong>NONE of the bottom-8 teams in defensive versatility advanced past R1</strong> in 2018. Conference Finals teams all ranked top-4 in versatility.
            <br><br>Guo et al. (2025) quantified player versatility through lineup-based playing styles across 10 NBA seasons, finding that versatile players provide coaches with significantly more flexible substitution options.
            <br><br><strong>Four Dimensions (each 0-10):</strong>
            <br>• <strong>Switch Defense (30%):</strong> How many rotation players can credibly switch 1-4 or 1-5 on defense
            <br>• <strong>Offensive Role Flex (25%):</strong> Can stars toggle scorer/facilitator; multi-initiator capability
            <br>• <strong>Lineup Options (25%):</strong> Viable alternative lineups (small-ball, big, switching, etc.)
            <br>• <strong>Positional Versatility (20%):</strong> Number of players credibly playing 2+ positions
            <br><br><strong>Point Adjustment:</strong> (homeFlex - awayFlex) × 0.4, capped at ±3.0 pts</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Why Flexibility Matters in Playoffs</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Regular season vs Playoffs:</strong> In the regular season, teams rarely face the same opponent more than 4 times. In the playoffs, teams play 4-7 games against each other. This means:
            <br><br>1. <strong>Film study compounds:</strong> Coaches identify and exploit weaknesses. Rigid teams can't counter-adjust.
            <br>2. <strong>Switching prevents P&R exploitation:</strong> Teams that can switch every screen eliminate the #1 playoff offense action.
            <br>3. <strong>Multi-initiator offense survives defensive adjustments:</strong> When teams shut down one creator, flexible teams have alternatives.
            <br>4. <strong>Lineup optionality creates matchup nightmares:</strong> Can you go small? Big? 5-out? Teams locked into one lineup are predictable.
            <br><br><strong>Historical Champions (switch-era, 2017-2025):</strong>
            <br>• 2025 OKC: Elite switching (9.2 flex)
            <br>• 2024 BOS: Switch-everything scheme (8.5 flex)
            <br>• 2023 DEN: Elite offensive flex via Jokic (8.5 off role)
            <br>Every recent champion ranked top-3 in at least ONE flexibility dimension.</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">2026 Playoff Team Flexibility Rankings</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong style="color:#51cf66;">ELITE (8.0+):</strong>
            <br>1. <strong>OKC 9.2</strong> — Switch-everything champion defense. Williams plays 3 positions.
            <br>2. <strong>BOS 8.5</strong> — 2024 champion switching model. Brown/Tatum/White all switch.
            <br>3. <strong>SAS 8.0</strong> — Wemby guards 1-5 at 7-5. Most versatile defender ever.
            <br>4. <strong>CLE 8.0</strong> — Mobley switches 1-5. Mitchell/Harden toggle scorer/facilitator.
            <br><br><strong style="color:#ffd43b;">GOOD (7.0-7.9):</strong>
            <br>5. <strong>NYK 7.5</strong> — OG/Bridges/Hart switching trident. Towns stretches from C.
            <br>6. <strong>HOU 7.2</strong> — Amen Thompson's 6-7 PG frame. KD adds SF/PF versatility.
            <br>7. <strong>ORL 7.0</strong> — Wagner as 6-10 point-forward is unique lineup versatility.
            <br><br><strong style="color:#ff922b;">MODERATE (5.0-6.9):</strong>
            <br>8. <strong>DEN 6.5</strong> — Elite offensive flex (Jokic) but poor defensive switching.
            <br>9. <strong>MIN 6.0</strong> — McDaniels switches. Gobert limits defensive schemes.
            <br>10. <strong>ATL 6.0</strong> — Snyder's coaching amplifies roster flex. Kuminga switches.
            <br>11. <strong>DET 6.0</strong> — Cade-centric. Proved can survive without him, barely.
            <br>12. <strong>TOR 5.5</strong> — Barnes is versatile. Rest is rigid. Quickley's return helps.
            <br>13. <strong>LAL 5.0</strong> — LeBron's flex is all-time but injuries gutted the roster.
            <br><br><strong style="color:#ff6b6b;">LOW (&lt;5.0):</strong>
            <br>14. <strong>PHX 4.5</strong> — Booker can't switch. One viable lineup.
            <br>15. <strong>POR 4.0</strong> — Clingan drop-only. No small-ball option.
            <br>16. <strong>PHI 3.5</strong> — No Embiid = no interior versatility. Maxey undersized.</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Most Versatile Players in 2026 Playoffs</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Tier 1: Positionless Stars</strong>
            <br>• <strong>Wembanyama (SAS):</strong> 7-5, guards 1-5, shoots 3s, handles, passes. Unprecedented.
            <br>• <strong>Jalen Williams (OKC):</strong> 6-5, plays SG/SF/PF. 2025 Finals proved 3-position excellence.
            <br>• <strong>LeBron James (LAL):</strong> 6-9, plays PG/SF/PF. 21 playoff runs across all roles. Age 41 limits switching.
            <br>• <strong>Evan Mobley (CLE):</strong> 6-11 PF/C who switches 1-5 on defense. 25pts on 11/13 FG in G2.
            <br><br><strong>Tier 2: Elite Switch Defenders</strong>
            <br>• <strong>Derrick White (BOS):</strong> PG/SG — locked down Maxey G1 (8-20 FG). Switches everything.
            <br>• <strong>OG Anunoby (NYK):</strong> SF/PF — guards 1-4, one of NBA's best perimeter defenders.
            <br>• <strong>Lu Dort (OKC):</strong> SG/SF at 6-4/220lbs — physically matches up across 3 positions.
            <br>• <strong>Marcus Smart (LAL):</strong> PG/SG — DPOY-caliber, disrupted Sengun AND guards in G1.
            <br><br><strong>Tier 3: Unique Role Flex</strong>
            <br>• <strong>Franz Wagner (ORL):</strong> 6-10 SF who plays point-forward. ORL's lineup versatility depends on him.
            <br>• <strong>Amen Thompson (HOU):</strong> 6-7 PG — tallest starting PG in playoffs. Matchup-proof frame.
            <br>• <strong>James Harden (CLE):</strong> G1 facilitator (10ast) → G2 co-scorer (28pts). All-time role toggle.
            <br>• <strong>Aaron Gordon (DEN):</strong> PF/SF — DEN's best switch defender and offensive connector.</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Series Flexibility Differentials</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong style="color:#ff6b6b;">MASSIVE GAPS (>3.0):</strong>
            <br>1. <strong>BOS-PHI: +5.0</strong> (BOS 8.5 vs PHI 3.5) — +2.0 pts BOS. Largest gap in R1. No Embiid = no flexibility.
            <br>2. <strong>OKC-PHX: +4.7</strong> (OKC 9.2 vs PHX 4.5) — +1.9 pts OKC. Switch-everything vs rigid single-creator.
            <br>3. <strong>SAS-POR: +4.0</strong> (SAS 8.0 vs POR 4.0) — +1.6 pts SAS. Wemby vs Clingan drop coverage.
            <br><br><strong style="color:#ffd43b;">MODERATE GAPS (1.5-3.0):</strong>
            <br>4. <strong>CLE-TOR: +2.5</strong> (CLE 8.0 vs TOR 5.5) — +1.0 pts CLE. Mobley's versatility vs TOR's rigidity.
            <br>5. <strong>HOU-LAL: +2.2</strong> (HOU 7.2 vs LAL 5.0) — +0.9 pts HOU. Injuries gutted LAL's versatility.
            <br>6. <strong>NYK-ATL: +1.5</strong> (NYK 7.5 vs ATL 6.0) — +0.6 pts NYK. OG trident vs Snyder schemes.
            <br><br><strong style="color:#aaa;">CLOSE MATCHUPS (&lt;1.5):</strong>
            <br>7. <strong>DET-ORL: -1.0</strong> (DET 6.0 vs ORL 7.0) — -0.4 pts (ORL edge). Wagner point-forward gives ORL the rare lower-seed flex advantage.
            <br>8. <strong>DEN-MIN: +0.5</strong> (DEN 6.5 vs MIN 6.0) — +0.2 pts DEN. Offensive flex vs defensive switching — nearly a wash.</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Coaching Flexibility vs Roster Flexibility</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Key insight:</strong> Raw roster flexibility can be amplified or wasted by coaching. This model captures ROSTER flexibility; coaching amplification is a separate factor.
            <br><br><strong>Coaches who AMPLIFY flexibility:</strong>
            <br>• <strong>Daigneault (OKC):</strong> Built switch-everything identity. Makes 9.2 flex roster play at 10.
            <br>• <strong>Snyder (ATL):</strong> G2 adjustment (Kuminga on Towns) was elite role-flex coaching. Makes 6.0 roster play at 7.0+.
            <br>• <strong>Mazzulla (BOS):</strong> 2024 championship scheme built on positional versatility.
            <br>• <strong>Johnson (SAS):</strong> Pop protege, designed system around Wemby's uniqueness.
            <br><br><strong>Coaches who WASTE flexibility:</strong>
            <br>• <strong>Bickerstaff (DET):</strong> G1 panic lineup (0 min together all season) showed inflexibility under pressure. DET has 6.0 roster flex but G1 execution was 4.0.
            <br><br><strong>Note on game-level adaptation:</strong> Flexibility advantages compound across a series because coaches exploit rigidity more in games 3-7 after film study. The R1 adjustment is conservative (×0.4); later rounds would use higher multipliers (×0.5 for R2, ×0.6 for CF/Finals).</div>
        </div>

      </div>
    </div>

    <!-- Phase 28: Live Analysis Model Corrections -->
    <div style="margin-top:24px;">
      <h3 style="color:var(--accent);margin-bottom:12px;font-size:16px;">Phase 28: Live Analysis Model Corrections</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;">

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Youth Breakout Multiplier</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Problem:</strong> Standard Bayesian update (55% model / 45% G1) regresses ALL overperformance equally. But young players (≤23) with rising usage who outperform G1 may be genuinely breaking out, not randomly hot.
            <br><br><strong>Evidence:</strong> Edgecombe (age 20) scored 30pts in G2 (12-20 FG, 6-10 3PT). Model had projected 13.5pts using standard regression from his 13pt G1. The breakout was real — he's PHI's second initiator now.
            <br><br><strong>Solution:</strong> Youth breakout blend: 40% model / 30% G1 actual / 30% ceiling projection (PPG × 1.25). Overperformance regression reduced to 40% of normal. Triggers when: age ≤23, min ≥20 in G1, outperformed PPG by 15%+, usage ≥18%.</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Team 3PT Correlation</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Problem:</strong> Model treated each player's 3PT% independently. In reality, team shooting is correlated on any given night — ball movement quality, defensive rotations, arena conditions, and momentum affect everyone.
            <br><br><strong>Evidence:</strong> PHI went from 17.4% 3PT (G1) to 49% 3PT (G2). BOS went from 38%+ (G1) to 26% (G2). These swings are too large to be independent player variance — they're team-level phenomena.
            <br><br><strong>Solution:</strong> Step 5f in calcGameProjection: when a team's playoff 3PT% deviates >8pp from season baseline, apply 50% regression × 30 (approximate 3PA) to the margin. Capped at ±3pts. Partially structural (scheme-driven), partially regression.</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Efficiency Tax Defense Model</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Problem:</strong> Old model reduced a player's total points when guarded by an elite defender. But sole initiators MUST shoot regardless — their volume is dictated by team structure, not matchup quality.
            <br><br><strong>Evidence:</strong> White on Maxey: Maxey still took 28 FGA in G2 (PHI's only option) but hit 39.3%. The suppression is on efficiency (FG%), not on shot volume.
            <br><br><strong>Solution:</strong> Modifier #7 now applies an "efficiency tax" — suppression × 0.8% FG% reduction per unit. Points change through efficiency drop, not volume reduction. This naturally produces the right output: high-usage players on low-initiator teams keep shooting but convert less.</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Dynamic Initiator Recalculation</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Problem:</strong> Initiator counts were static (set pre-series). But players can BECOME initiators mid-series through breakout performances, changing the entire offensive structure.
            <br><br><strong>Evidence:</strong> PHI was coded as 1 initiator (Maxey). After Edgecombe's 30pt G2 (27% of team scoring), PHI functionally has 2 initiators — meaning White can't fully commit to Maxey anymore.
            <br><br><strong>Solution:</strong> calcDynamicInitiators() scans prior game box scores: a player counts as an initiator if they scored ≥18% of team points AND had ≥3 assists (or ≥25% scoring share). The dynamic count overrides the static field in all scheme/suppression calculations.</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Recovery Volatility Flag</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Problem:</strong> Post-major-injury players (Achilles, ACL, surgery) were projected at their expected value with normal confidence. But recovery curves are non-linear — a player can look great one game and terrible the next.
            <br><br><strong>Evidence:</strong> Tatum's G1 was 25/11/7 (excellent), but G2 was 19pts on 8-19 with 5PF. The Achilles recovery creates wider variance than the model captured. His "good" outlook was right on average but wrong on any individual game.
            <br><br><strong>Solution:</strong> Modifier #6b applies a 2-4% asymmetric downside penalty for cleared players with major injury history (Achilles/ACL/surgery/fracture). This doesn't change the expected value much but accurately represents the risk profile.</div>
        </div>

      </div>
    </div>

    <div style="margin-top:28px;">
      <h3 style="color:var(--accent);margin-bottom:12px;font-size:16px;">Phase 30: G2 Results Integration & Engine Hardening</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;">

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Youth Breakout Momentum Persistence</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Problem:</strong> Phase 28's youth breakout multiplier only looked at the most recent game. It couldn't distinguish a one-game fluke from a genuine multi-game breakout pattern, resetting evidence each game.
            <br><br><strong>Evidence:</strong> Henderson scored 18pts in G1 then 31pts in G2 (consecutive breakouts). Edgecombe scored 30pts in G2. The single-game multiplier would still regress Henderson heavily in a G3 projection despite two straight games of evidence.
            <br><br><strong>Solution:</strong> The engine now scans ALL prior games backwards counting consecutive breakout performances (pts > PPG × 1.10, min ≥ 15). Multi-game streaks (≥2) get a more aggressive blend: 30% model / 25% actual / 45% ceiling (vs 40/30/30 for single breakout). Ceiling multiplier rises from 1.25× to 1.35×. Regression dampened to 25% of normal (vs 40%). This lets the model "believe" in genuine youth development faster.</div>
        </div>

        <div class="def-card" style="background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;">
          <div style="font-weight:700;color:var(--accent);margin-bottom:8px;">Coaching Adjustment Discount on Blowout Momentum</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.5;">
            <strong>Problem:</strong> Blowout regression (Step 7b Factor B) applied the same regression rate regardless of how good the losing coach is at making adjustments. A 32-pt blowout against a coach rated 4 should carry more momentum than one against an elite adjuster rated 8.
            <br><br><strong>Evidence:</strong> BOS won G1 by 32 points. Model projected BOS to win G2 109-103. But Nurse (adjustmentRating 8) made masterful halftime and film study adjustments — PHI won G2 by 14. The model overweighted blowout momentum by not factoring in coaching quality.
            <br><br><strong>Solution:</strong> Blowout regression now scales with losing coach's adjustmentRating. Coaches rated ≥7 amplify regression: adj7 = +10%, adj8 = +20%, adj9 = +30%. Applied multiplicatively to both massive blowout (25+ margin) and solid win (15+ margin) regression paths. Regression capped at 50% for massive blowouts, 40% for solid wins to prevent over-correction.</div>
        </div>

      </div>
    </div>

  </div>`;
}

