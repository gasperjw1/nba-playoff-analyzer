// ============================================================
// DEFINITIONS PAGE
// ============================================================

function renderDefinitionsPage(el) {
  el.innerHTML = `
  <div class="page-content">
    <div class="page-header">Definitions & Glossary</div>
    <div class="page-subheader">Every metric, abbreviation, and model concept — grouped by category. Click a tab to navigate.</div>

    <!-- DEFINITION TABS -->
    <div style="display:flex;gap:0;margin-bottom:24px;flex-wrap:wrap;justify-content:center;">
      <div class="def-tab-btn" id="defTab-player" onclick="switchDefTab('player')" style="padding:8px 16px;border-radius:8px 0 0 8px;cursor:pointer;font-size:12px;font-weight:700;background:var(--accent);color:#fff;border:1px solid var(--accent);transition:all 0.2s;">Player Metrics</div>
      <div class="def-tab-btn" id="defTab-team" onclick="switchDefTab('team')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Team Metrics</div>
      <div class="def-tab-btn" id="defTab-model" onclick="switchDefTab('model')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Model Concepts</div>
      <div class="def-tab-btn" id="defTab-backtest" onclick="switchDefTab('backtest')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Backtest Factors</div>
      <div class="def-tab-btn" id="defTab-g1lessons" onclick="switchDefTab('g1lessons')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">G1 Lessons</div>
      <div class="def-tab-btn" id="defTab-margins" onclick="switchDefTab('margins')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Margin Variance</div>
      <div class="def-tab-btn" id="defTab-fatigue" onclick="switchDefTab('fatigue')" style="padding:8px 16px;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Fatigue</div>
      <div class="def-tab-btn" id="defTab-research" onclick="switchDefTab('research')" style="padding:8px 16px;border-radius:0 8px 8px 0;cursor:pointer;font-size:12px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Phase 17 Research</div>
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
      <div class="def-card" style="border-left:3px solid var(--green);"><div class="def-term">Per-Player Offensive Outlook <span class="def-abbr">gNPlayerOutlook</span></div><div class="def-desc"><strong>Phase 22.</strong> Research-backed per-player, per-game offensive outlook. Data key: <code>g3PlayerOutlook</code> (dynamic: <code>'g' + gameNum + 'PlayerOutlook'</code>). Each player entry: <code>outlook</code> (good/bad/neutral/neutral-good), <code>projFgPct</code>, <code>ptsRange</code> [min,max], <code>reason</code>, <code>confidence</code> (high/medium/low). "good" → +8-12% scoring boost; "bad" → -8-12% suppress; "neutral-good" → +4%.</div></div>
      <div class="def-card" style="border-left:3px solid var(--green);"><div class="def-term">Research FG% Override <span class="def-abbr">researchFgPct</span></div><div class="def-desc"><strong>Phase 22.</strong> When a player has a <code>projFgPct</code> in their outlook entry, this value overrides the default FG% used to back-calculate shooting stats (FGM/FGA/TPM/TPA). Does NOT directly modify the point total — points are adjusted by the outlook boost/suppress. The FG% override ensures the shooting line reflects realistic efficiency for that player's projected game type.</div></div>
      <div class="def-card" style="border-left:3px solid var(--green);"><div class="def-term">Returning Player Logic <span class="def-abbr">RPL</span></div><div class="def-desc"><strong>Phase 22.</strong> In <code>calcProjectedBoxScore</code>, players who weren't in the prior box score but have a research outlook entry are added to the active player list. This handles injury returns (e.g., Quickley in CLE-TOR G3). Threshold is outlook-entry-based rather than rating-based to avoid normalization dilution from irrelevant bench players.</div></div>
      <div class="def-card" style="border-left:3px solid var(--green);"><div class="def-term">Bayesian Tiered Blend <span class="def-abbr">BayesBlend</span></div><div class="def-desc"><strong>Phase 22.</strong> Prior game box scores are blended with model projections at tiered weights: <strong>55/45</strong> (model/prior) for 15+ min players, <strong>70/30</strong> for 5-14 min players, <strong>100/0</strong> for new/returning players. This anchors projections to actual observed performance while allowing the model to pull toward true skill level.</div></div>
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
        <div class="def-desc">Each projected game gets a character label based on expected margin: <strong>BLOWOUT RISK</strong> (18+), <strong>SEPARATION</strong> (12-17), <strong>COMPETITIVE</strong> (7-11), <strong>GRIND</strong> (4-6), <strong>COIN FLIP</strong> (0-3). Close Game % and Blowout % probabilities show the distribution of likely outcomes, not just the point estimate.</div>
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

  </div>`;
}

