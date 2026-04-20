// ============================================================
// MODEL LEARNINGS PAGE
// ============================================================

function renderLearningsPage(el) {
  el.innerHTML = `
  <div class="page-content">
    <div class="page-header">Model Learnings Journal</div>
    <div class="page-subheader">A chronological record of every insight, correction, and evolution in our prediction model — from initial design through 2025 backtest calibration. This is a living document that grows with each prediction cycle.</div>

    <div class="learning-timeline">

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 1 — Foundation</div>
        <div class="learning-title">Player Composite Rating System Designed</div>
        <div class="learning-body">Built the core rating formula: <strong>PER (15%) + TS% (12%) + EPM (18%) + BPM (15%) + Usage Context (8%) + WS/48 (12%) + On/Off (10%) + Clutch (10%)</strong>. EPM was given the highest weight because it's the most predictive single metric for playoff performance, incorporating both offensive and defensive contributions with lineup-adjusted data. Clutch rating was added specifically because playoff games are disproportionately decided in the final 5 minutes.</div>
        <span class="learning-tag model">Rating System</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 1 — Foundation</div>
        <div class="learning-title">Replacement-Level Slot System for Injuries</div>
        <div class="learning-body">Instead of removing injured players and re-averaging (which artificially inflates team ratings), we keep every roster slot fixed and substitute <strong>REPLACEMENT_LEVEL = 48</strong> (originally 42, raised after 2024 backtest) for missing players. This means losing a star (87 rating) costs ~39 weighted points in their slot, rather than just promoting bench players to higher weights. This was a critical design decision that makes injury impact realistic — losing KD isn't just "the average drops a bit," it's a gaping hole filled by a replacement-level player.</div>
        <span class="learning-tag model">Engine Design</span><span class="learning-tag data">Injury Model</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 1 — Foundation</div>
        <div class="learning-title">SPM Chemistry Engine (Maymin et al.)</div>
        <div class="learning-body">Integrated a 6-dimensional skill profile system based on the academic paper by Maymin, Maymin, and Shen. Each player is profiled across <strong>Offensive Scoring, Ball-Handling, Rebounding</strong> and <strong>Defensive Scoring, Ball-Handling, Rebounding</strong>. Pairwise synergies are calculated using empirically-derived coefficients (e.g., two elite scorers penalize each other at -0.826, but a scorer + ball-handler synergize at +0.412). This captures why some lineups "just work" beyond what individual ratings predict.</div>
        <span class="learning-tag model">Chemistry</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 2 — Game 1 Predictions</div>
        <div class="learning-title">Home Court Was Initially Set to a Flat +3</div>
        <div class="learning-body">The original model used a flat <strong>+3 HCA</strong> across all situations. This was based on regular-season data showing home teams win ~58% of games, which translates to roughly 3 points of expected advantage. This assumption would later prove too aggressive for later playoff rounds but was adequate for Round 1 predictions.</div>
        <span class="learning-tag model">HCA</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 2 — Game 1 Results</div>
        <div class="learning-title">HOU-LAL Home Court Assignment Error</div>
        <div class="learning-body">LAL (4 seed, 53-29) should have had home court over HOU (5 seed, 52-30), but HOU was listed as homeTeam in the data. Rather than restructuring hundreds of lines, we added <strong>homeCourtOverride: "away"</strong> which inverts HCA at calculation time. This alone swung LAL's win probability from ~16% to ~32% — a massive correction that validated how sensitive the model is to HCA direction.</div>
        <span class="learning-tag bug">Bug Fix</span><span class="learning-tag model">HCA</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 2 — Game 1 Results</div>
        <div class="learning-title">Ghost Calculation: Baseline Injuries Double-Counted</div>
        <div class="learning-body">Three separate ghost calculations were discovered and fixed: (1) <strong>HISTORICAL_WITHOUT</strong> was applying netRtgSwing corrections to players already injured at baseline, double-penalizing the team. (2) <strong>advScale</strong> was counting baseline-injured players in its "out count," over-reducing advanced stats bonuses. (3) <strong>Compounding star penalty</strong> (-2.5 per star) was firing for already-injured stars + scenario-toggled stars combined. All three were fixed with the <strong>isBaselineInjured / isScenarioToggled</strong> helper pattern that cleanly separates "what the model starts with" from "what the user toggles."</div>
        <span class="learning-tag bug">Ghost Calc Fix</span><span class="learning-tag model">Engine</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 3 — Game 2 Predictions</div>
        <div class="learning-title">All 4 G2 Picks Matched G1 Winners — Lazy Momentum Riding</div>
        <div class="learning-body">After generating Game 2 predictions, all 4 picks matched the Game 1 winners. Upon challenge, we researched coaching adjustment histories, regular-season data, and playoff history. This led to <strong>flipping HOU-LAL to HOU</strong> (Udoka's 17.3pt avg bounce-back margin) and <strong>DEN-MIN to MIN</strong> (Edwards' playoff DNA + Finch's proven adjustments). NYK-ATL and CLE-TOR kept their picks but were downgraded in confidence. The lesson: momentum is the laziest predictor in sports analytics. Coaching adjustments, shooting regression, and historical patterns matter more.</div>
        <span class="learning-tag model">Prediction Logic</span><span class="learning-tag data">Coaching</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 4 — 2025 Backtest (Round 1)</div>
        <div class="learning-title">R1 Backtest: 7/8 Correct (87.5%)</div>
        <div class="learning-body">Applied our model retroactively to all 8 first-round series in the 2025 NBA Playoffs. Scored <strong>7/8 (87.5%)</strong> on Game 2 predictions. The one miss was NYK-DET, where Detroit's "franchise desperation narrative" (first playoff win since 2008) overrode the talent gap. Key R1 lessons: bounce-back selectivity matters, star explosions are predictable in pattern but not timing, and blowout margins don't carry extra predictive weight beyond 15 points.</div>
        <span class="learning-tag backtest">Backtest</span><span class="learning-tag data">Validation</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 4 — 2025 Backtest (Round 2)</div>
        <div class="learning-title">R2 Accuracy Dropped to 69.6% — Road G1 Steals Everywhere</div>
        <div class="learning-body">All 4 R2 series saw the road team win Game 1 (IND at CLE, NYK at BOS, DEN at OKC, GSW at MIN). Our flat +3 HCA was clearly too generous for later rounds where matchup familiarity and scouting depth reduce home court edge. The bounce-back model also failed — teams with <strong>systemic advantages</strong> (Indiana's pace-and-space) don't bounce back the same way structurally inferior teams do. This was the single biggest model flaw exposed by backtesting.</div>
        <span class="learning-tag backtest">Backtest</span><span class="learning-tag model">HCA Flaw</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 4 — 2025 Backtest (R2)</div>
        <div class="learning-title">CLE-IND Exposed "System > Talent" Blindspot</div>
        <div class="learning-body">The #1 seed Cavaliers fell in 5 games to the #4 Pacers — our worst series prediction (3/5 = 60%). Cleveland had superior individual ratings, but Indiana's <strong>pace-and-space system</strong> was a structural counter. This led to the creation of the <strong>systemBonus</strong> field: teams with elite offensive/defensive systems get a rating modifier (range -2 to +3) that captures advantages our player-by-player model misses.</div>
        <span class="learning-tag backtest">Backtest</span><span class="learning-tag model">System Coherence</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 4 — 2025 Backtest (R2)</div>
        <div class="learning-title">Catastrophic Injuries Reshape Everything</div>
        <div class="learning-body">Three Achilles tears defined the 2025 playoffs: <strong>Damian Lillard</strong> (MIL-IND R1 G4), <strong>Jayson Tatum</strong> (BOS-NYK R2 G4), and <strong>Tyrese Haliburton</strong> (IND-NYK ECF G2). Tatum's tear turned a competitive series into a foregone conclusion. This led to the <strong>injuryRisk</strong> field (0-1.0) per player and the <strong>health degradation curve</strong> that progressively reduces ratings for at-risk players in later rounds.</div>
        <span class="learning-tag backtest">Backtest</span><span class="learning-tag data">Injuries</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 4 — 2025 Backtest (Conference Finals)</div>
        <div class="learning-title">Fatigue Narratives Are Overrated for Deep Teams</div>
        <div class="learning-body">OKC played a grueling 7-game series against Denver, then came out and won G1 of the WCF by 26 points. The "fatigue after long series" narrative failed because OKC's <strong>9-10 man rotation</strong> distributed the load. Meanwhile, Minnesota (7-man rotation) after a 5-game cruise showed more fatigue in the WCF. Lesson: fatigue impact should be weighted by roster depth, not just games played.</div>
        <span class="learning-tag backtest">Backtest</span><span class="learning-tag model">Fatigue</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 4 — 2025 Backtest (Conference Finals)</div>
        <div class="learning-title">The "One Explosion Game" Pattern</div>
        <div class="learning-body">Underdogs reliably get 1-2 transcendent performances per series. Minnesota's <strong>143-101 WCF G3 blowout</strong> (largest in CF history) was followed by two losses. NYK got two games against IND (G3 and G5). The pattern: wider talent gaps = exactly 1 explosion game; narrow gaps = 2. This is now factored as <strong>starCeiling</strong> per player — elite stars (Edwards, Jokic, SGA) with starCeiling:2 produce these games ~once per series.</div>
        <span class="learning-tag backtest">Backtest</span><span class="learning-tag model">Star Variance</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 4 — 2025 Backtest (Finals)</div>
        <div class="learning-title">Emotional Surge Games Have a One-Game Shelf Life</div>
        <div class="learning-body">Boston won Game 5 after Tatum's Achilles tear ("win it for Tatum" energy), then got blown out by 38 in Game 6. Indiana forced Game 7 with a gutsy G6 win, then had nothing left for G7 (lost by 12). Denver forced G7 with an emotional road win, then lost by 32. The structural reality always reasserts itself after one emotional game. This led to the <strong>"emotional exhaust"</strong> principle in our model's qualitative reasoning.</div>
        <span class="learning-tag backtest">Backtest</span><span class="learning-tag model">Psychology</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 4 — 2025 Backtest (Complete)</div>
        <div class="learning-title">Full Backtest: 36/49 Games = 73.5% Accuracy</div>
        <div class="learning-body">Accuracy by round: <strong>R1: 87.5% → R2: 69.6% → CF: 72.7% → Finals: 71.4%</strong>. The declining accuracy in later rounds was the most important finding, driven by HCA decay, system matchups, and star ceiling variance. Seven lessons were extracted and codified into the model: round-adjusted HCA, bounce-back qualifier, system coherence bonus, championship DNA, health degradation curve, Game 7 override, and star ceiling variance.</div>
        <span class="learning-tag backtest">Backtest</span><span class="learning-tag milestone">Milestone</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 5 — Model v2 (Current)</div>
        <div class="learning-title">7 Backtest Lessons Implemented Into Live Model</div>
        <div class="learning-body">All seven lessons from the 2025 backtest are now <strong>live in the prediction engine</strong>:
        (1) <strong>Round-Adjusted HCA</strong>: R1=3.0, R2=2.0, CF=1.5, Finals=1.0.
        (2) <strong>Bounce-Back Qualifier</strong>: 77% base scaled by round and matchup quality.
        (3) <strong>System Coherence</strong>: per-team systemBonus (-2 to +3).
        (4) <strong>Championship DNA</strong>: playoffPedigree (0-2) adds up to +1.6 to team rating.
        (5) <strong>Health Degradation</strong>: injuryRisk * round depth * 0.4 penalty.
        (6) <strong>Game 7 Override</strong>: +5.0 HCA when series is tied 3-3.
        (7) <strong>Star Ceiling Variance</strong>: starCeiling (0-2) adds upside variance to close matchups.
        CLE-TOR Game 2 confidence was upgraded from medium to high based on these calibrations.</div>
        <span class="learning-tag model">Model v2</span><span class="learning-tag backtest">Calibrated</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 6 — LEBRON Integration</div>
        <div class="learning-title">LEBRON / WAR / O-LEBRON / D-LEBRON Added to All 141 Players</div>
        <div class="learning-body">Integrated BBall Index's <strong>LEBRON ecosystem</strong> (Luck-adjusted player Estimate using a Box prior Regularized ON-off) from a comprehensive CSV dataset into every playoff player object. Four new fields per player: <strong>lebron</strong> (composite), <strong>oLebron</strong> (offensive), <strong>dLebron</strong> (defensive), and <strong>war</strong> (Wins Above Replacement). LEBRON is more predictive than raw plus-minus because it stabilizes noisy lineup data with box-score anchoring. WAR provides cumulative value context. These feed into calcTeamRating() via WAR aggregation bonus and D-LEBRON team aggregate, and into calcWinProb() via D-LEBRON matchup differential.</div>
        <span class="learning-tag data">LEBRON</span><span class="learning-tag model">Data Integration</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 6 — Ghost Audit</div>
        <div class="learning-title">7 Ghost Calculations Found and Fixed</div>
        <div class="learning-body">A comprehensive audit revealed <strong>7 double-counting penalties</strong> (ghost calculations) across the model:
        (1) <strong>Health Degradation in calcTeamRating()</strong> was applying to R1 games despite being designed for R2+ depth-based decay — fixed with round > 1 guard.
        (2) <strong>Fatigue × injuryRisk overlap</strong>: fatigue system was reading injuryRisk directly, double-penalizing injury-prone players already hit by Health Degradation — removed injuryRisk from fatigue inputs.
        (3) <strong>VORP + WAR double-count</strong>: WAR is derived from LEBRON which correlates with VORP's BPM basis — reduced WAR weight to 0.3 and capped combined bonus.
        (4) <strong>D-LEBRON triple-count</strong>: D-LEBRON appeared in calcTeamRating() aggregate, calcWinProb() matchup diff, AND player composite rating — removed from calcWinProb() to keep it in one subsystem.
        (5-7) Three scenario toggle issues where <strong>getEffectiveRating()</strong> wasn't being called consistently, causing toggled-off players to still contribute to penalties.
        Core principle established: every data point should feed exactly ONE subsystem.</div>
        <span class="learning-tag bug">Ghost Calc Fix</span><span class="learning-tag model">Engine Integrity</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 7 — Fatigue Monitor</div>
        <div class="learning-title">5-Factor Fatigue System — Upgraded to Medium Confidence</div>
        <div class="learning-body">Built <strong>calcPlayerFatigue()</strong> with five evidence-based factors:
        (1) <strong>Age Factor</strong>: Players 33+ accumulate fatigue faster (research shows recovery time increases ~12% per year after 32).
        (2) <strong>Minutes Load</strong>: Players averaging 36+ MPG carry compounding fatigue into later rounds.
        (3) <strong>Active Injury</strong>: Players playing through documented injuries fatigue faster (NEW — see activeInjury system).
        (4) <strong>Mental Fatigue</strong>: High-usage primary ball handlers (USG 28%+) face cognitive load degradation.
        (5) <strong>Role-Based Load</strong>: Defensive anchors who also carry offensive burden fatigue disproportionately.
        All factors are multiplied by a <strong>0.5 low-confidence discount</strong> because fatigue modeling in basketball is inherently speculative — academic research shows fatigue explains only ~8-12% of performance variance in playoff settings. The discount prevents the model from overweighting an uncertain signal.</div>
        <span class="learning-tag model">Fatigue</span><span class="learning-tag milestone">New System</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 7 — Active Injury System</div>
        <div class="learning-title">activeInjury: Tracking Players Playing Through Injuries</div>
        <div class="learning-body">Created a new per-player <strong>activeInjury</strong> object with fields: <strong>{type, severity, note}</strong>. This is conceptually distinct from injuryRisk (which models future breakdown probability for Health Degradation). activeInjury tracks players who ARE currently playing through documented injuries — their fatigue accumulates faster because compromised biomechanics increase energy expenditure.
        Formula: <strong>injFatigue = severity × 0.15 × (1 + gamesPlayed × 0.2) × (1 + depth × 0.25)</strong>.
        Currently tracking <strong>11 players</strong>: Anthony Edwards (knee management, 0.6), Jamal Murray (chronic knee, 0.7), Jalen Williams (wrist + hamstring, 0.6), Cade Cunningham (collapsed lung recovery, 0.5), Jayson Tatum (returning from injury, 0.4), Jarrett Allen (knee tendonitis, 0.4), Victor Wembanyama (rib contusion, 0.3), Shaedon Sharpe (fibula stress reaction, 0.4), Kevin Durant (knee contusion, 0.5), Grayson Allen (hamstring strain, 0.4), and Payton Pritchard (plantar fasciitis, 0.2).
        The Fatigue Monitor UI shows a bandage icon with injury type and severity for each affected player.</div>
        <span class="learning-tag model">Injury Model</span><span class="learning-tag data">Active Injuries</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 8 — Roster Correction</div>
        <div class="learning-title">Lillard OUT for Season — Jrue Holiday Added to POR</div>
        <div class="learning-body">A critical roster error was caught: <strong>Damian Lillard was listed as active (rating 81)</strong> despite being out for the entire season with a torn left Achilles suffered in the 2025 playoffs. Lillard was traded back to Portland in the offseason but never played a game in 2025-26. His rating was set to 0 and <strong>Jrue Holiday</strong> (acquired from BOS for Anfernee Simons, Jul 2025) was added as POR's starting PG (rating 74).
        This required a cascade of updates: synergy lineups, coaching analysis, external factors, game predictions, betting picks, pedigree section, and all narrative references throughout the SAS-POR series. The lesson: always cross-reference offseason transactions with current-season availability, especially for players returning from major injuries. A model is only as good as its roster data.</div>
        <span class="learning-tag bug">Data Fix</span><span class="learning-tag data">Roster</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 8 — UI Overhaul</div>
        <div class="learning-title">Horizontal Layout with Round → Series → Game Navigation</div>
        <div class="learning-body">Rebuilt the entire UI from vertical scrolling to a <strong>horizontal tabbed layout</strong>. Navigation now flows: <strong>Round tabs → Series sub-tabs → Game sub-sub-tabs</strong>, with each game's analysis fitting a single viewport. Added visual stat bars for team comparisons, team toggle tabs for Player Ratings (replacing a single combined table), and responsive grid layouts. The goal was to make the tool feel like an interactive dashboard rather than a long document — critical for making quick pre-game checks during the actual playoffs.</div>
        <span class="learning-tag milestone">UI</span><span class="learning-tag model">UX Design</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 9 — USA Today Injury Report</div>
        <div class="learning-title">Live Injury Data Integration via Chrome Research</div>
        <div class="learning-body">Used Claude in Chrome to read the <strong>USA Today NBA injury report</strong> for all 16 playoff teams, cross-referencing against existing model data. Key corrections:
        (1) <strong>Joel Embiid</strong> changed from rating 55 (limited) to <strong>0 (OUT)</strong> — illness post-appendectomy, expected return Apr 24 (~G3).
        (2) <strong>Kevin Durant</strong> confirmed OUT for G1 with right knee contusion, expected return Apr 21 (G2).
        (3) <strong>Grayson Allen</strong> added activeInjury for left hamstring strain (GTD, severity 0.4).
        (4) <strong>Payton Pritchard</strong> added activeInjury for plantar fasciitis (severity 0.2).
        (5) <strong>Immanuel Quickley</strong> set to OUT G1 (right hamstring strain).
        (6) <strong>Jock Landale</strong> confirmed OUT (right ankle sprain, expected May 1).
        (7) <strong>Paul George</strong> rating upgraded 68→72 based on strong post-suspension form (21.0 PPG, 41.5% from 3 in 10 games).
        Lesson: injury reports are the highest-leverage data source for game-day accuracy. A single OUT designation can swing win probability by 10-20%.</div>
        <span class="learning-tag data">Injury Report</span><span class="learning-tag model">Live Updates</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 9 — Coaching Adjustments</div>
        <div class="learning-title">Injury-Driven Role Changes and Coaching Adaptations</div>
        <div class="learning-body">With major injuries confirmed, several coaching adjustments were factored in:
        <strong>HOU without KD (G1)</strong>: Ime Udoka likely runs smaller, faster lineups with Jalen Green and Amen Thompson getting elevated roles. HOU's offense drops significantly but their defensive identity (2nd in DRTG) remains intact.
        <strong>PHI without Embiid (G1-G2+)</strong>: Nick Nurse forced to go small-ball with Paul George as primary option. Tyrese Maxey's usage skyrockets. PHI's paint presence evaporates against NYK's physicality.
        <strong>POR without Lillard</strong>: Chauncey Billups builds around Jrue Holiday's two-way steadiness rather than Lillard's explosive creation. More balanced, less star-dependent system.
        <strong>BOS with Tatum returning</strong>: Joe Mazzulla managing minutes carefully — Tatum's activeInjury (0.4 severity) reflects controlled reintegration after Achilles recovery.
        These adjustments affect systemBonus values, rotation depth assumptions, and qualitative confidence levels in predictions.</div>
        <span class="learning-tag data">Coaching</span><span class="learning-tag model">Role Changes</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 9 — Methodology</div>
        <div class="learning-title">activeInjury vs injuryRisk: Two Distinct Systems, Zero Overlap</div>
        <div class="learning-body">A key architectural decision was confirmed through the ghost audit: <strong>activeInjury</strong> and <strong>injuryRisk</strong> are conceptually and computationally separate.
        <strong>injuryRisk</strong> (0-1.0) feeds the <strong>Health Degradation Curve</strong> in calcTeamRating(): it models the probability of a player breaking down as a series goes deeper (R2+ only). Formula: injuryRisk × depth × 0.4 reduction to team rating.
        <strong>activeInjury.severity</strong> feeds <strong>calcPlayerFatigue()</strong>: it models the increased energy cost of playing through a current, documented injury. Formula: severity × 0.15 × game/depth compounding.
        These are NOT the same thing: a player can have high injuryRisk but no activeInjury (e.g., an aging player with no current injury), or high activeInjury.severity but low injuryRisk (e.g., a young player playing through a one-time contusion). Keeping them separate avoids the ghost calculation trap of penalizing the same concept twice through different pathways.</div>
        <span class="learning-tag model">Architecture</span><span class="learning-tag bug">Ghost Prevention</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 10 — Offensive Style Research</div>
        <div class="learning-title">Partnow Offensive Style Framework Integrated (The Athletic, 2020)</div>
        <div class="learning-body">Integrated findings from Seth Partnow's two-part offensive style analysis using Synergy play type data (2004-2020). Three key model enhancements:
        (1) <strong>Initiator Redundancy</strong>: Teams with multiple active on-ball creators (Shot Creator / Primary Ball Handler roles) are more resilient and harder to scout. Teams with 3+ active initiators get a +0.5 bonus (CLE, OKC, BOS). Teams that lose their primary creator below expected levels get a -0.8 penalty — capturing the Partnow "initiator-loss cascade" where the entire offense loses its ability to generate efficient off-ball opportunities.
        (2) <strong>Offensive Style Diversity</strong>: Each team now has an <strong>offStyle</strong> descriptor and <strong>initiators</strong> count. Partnow's Euclidean distance analysis showed that stylistically distinctive teams (outliers) are harder to scout — DEN's Jokic-centric post-up/handoff system and SAS's Wembanyama unicorn creation are genuine outliers in the modern P&R-dominated league.
        (3) <strong>Turnover Attribution Insight</strong>: High on-ball turnover rates partly reflect the VALUE being created for teammates, not just inefficiency. Playmakers like Brunson, SGA, and Mitchell absorb the risk of the creation process. This validates our On/Off weighting and explains why high-turnover games from primary initiators don't necessarily signal poor play.
        The initiator redundancy bonus is NOT a ghost of the replacement-level slot system: slots capture individual production loss, while this captures systemic coherence loss — the offense can't create quality shots for ANYONE when the primary creator is gone.</div>
        <span class="learning-tag model">Offensive Style</span><span class="learning-tag data">Partnow Research</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 9 — Game 1 Results</div>
        <div class="learning-title">Saturday R1 Game 1s: Home Teams Sweep 4-0</div>
        <div class="learning-body">All four Saturday Game 1s were won by the home team:
        <strong>CLE def TOR</strong>, <strong>DEN def MIN</strong>, <strong>NYK def ATL</strong>, and <strong>LAL def HOU</strong>.
        This validates the R1 HCA of +3.0 — home court matters most in Round 1 when travel, crowd energy, and routine disruption are at their peak. WPA data was added for key players in each game. The 4-0 home sweep also supports the model's bounce-back qualifier design: Game 2 adjustments by losing teams will be the first real test of whether our coaching adjustment factors are calibrated correctly.</div>
        <span class="learning-tag data">Results</span><span class="learning-tag model">HCA Validated</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 11 — 2024 Backtest (Overview)</div>
        <div class="learning-title">Full 2024 Playoff Backtest: 52/82 Games = 63.4% Accuracy</div>
        <div class="learning-body">Applied the model retroactively to all 82 games of the 2024 NBA Playoffs using 2023-24 regular season team profiles. Accuracy by round: <strong>R1: 62.8% (27/43) → R2: 64.0% (16/25) → CF: 55.6% (5/9) → Finals: 80.0% (4/5)</strong>.
        Series winner predictions: <strong>11/15 correct (73.3%)</strong> — correctly called OKC, DEN, MIN, DAL, BOS, CLE, BOS(R2), IND(R2), BOS(CF), BOS(Finals), MIN(R2). Missed MIL-IND (predicted MIL), NYK-PHI (predicted PHI), OKC-DAL (predicted OKC), and MIN-DAL CF (predicted MIN).
        Compared to the 2025 backtest (73.5% game accuracy), the 2024 results were 10 points lower, primarily driven by two catastrophic series misses: NYK-PHI (2/6 = 33%) and MIL-IND (2/6 = 33%). Both exposed the same blindspot: the model overvalues individual talent ratings and undervalues system matchup dynamics and playoff culture.</div>
        <span class="learning-tag backtest">2024 Backtest</span><span class="learning-tag milestone">Milestone</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 11 — 2024 Backtest (Round 1)</div>
        <div class="learning-title">R1: 62.8% — Sweeps Nailed, Upsets Missed</div>
        <div class="learning-body">The model excelled on lopsided matchups: <strong>OKC-NOP (4/4), MIN-PHX (4/4), DEN-LAL (4/5), BOS-MIA (4/5)</strong> — dominant favorites were easy to call. But it collapsed on competitive series:
        <strong>NYK-PHI (2/6)</strong>: The model favored PHI because Embiid (rated 78 with meniscus) + Maxey gave PHI higher individual ratings. But NYK was missing Randle AND Robinson, yet won 4-2. Brunson averaged 32.4 PPG and the Knicks' depth — Hart, DiVincenzo, and Hartenstein — outperformed their regular-season ratings by 15-20%. The model can't capture "playoff culture" or a player like Brunson ascending beyond his regular-season profile.
        <strong>MIL-IND (2/6)</strong>: The model backed Giannis + Lillard's individual talent (84 vs 80 team rating). But Indiana's <strong>pace-and-space system</strong> (103.2 pace, 121.5 ORTG) was a structural counter to Milwaukee's half-court-dependent offense. Haliburton's playmaking unlocked open looks that neutralized Milwaukee's defensive scheme. Lesson: systemBonus should scale with matchup specificity, not just generic coaching quality.</div>
        <span class="learning-tag backtest">2024 Backtest</span><span class="learning-tag model">R1 Analysis</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 11 — 2024 Backtest (Round 1)</div>
        <div class="learning-title">Key R1 Lesson: "Playoff Brunson" Phenomenon — Stars Can Exceed Regular-Season Ceilings</div>
        <div class="learning-body">Jalen Brunson averaged 27.8 PPG in the regular season, but exploded to 32.4 PPG in the playoffs — a <strong>+4.6 PPG jump</strong> that our model had no mechanism to capture. Similarly, Tyrese Haliburton's playoff passing and IND's team-wide shooting upgrades represented a systemic playoff leap.
        The current model treats regular-season ratings as fixed ceilings. But some players — particularly primary ball handlers with playoff experience and high basketball IQ — have a "playoff gear" that elevates them beyond their regular-season production. This is distinct from starCeiling (which models variance/upside in individual games); this is a <strong>sustained elevation across an entire playoff run</strong>.
        Potential fix: a "playoff ascension" modifier for players with documented history of playoff performance exceeding regular-season baselines. Examples: Jimmy Butler (+5 PPG in 2023 playoffs), Jalen Brunson (+4.6 in 2024), Luka Doncic (+3.2 in 2024).</div>
        <span class="learning-tag model">Playoff Ascension</span><span class="learning-tag backtest">New Concept</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 11 — 2024 Backtest (Round 2)</div>
        <div class="learning-title">R2: 64.0% — NYK's Injury Resilience Broke the Model</div>
        <div class="learning-body">The biggest R2 story was <strong>NYK-IND</strong>: the model gave IND an 88% win probability per game because NYK was missing Randle, Robinson, AND OG Anunoby (NYK's rating dropped to 65 vs IND's 80). Yet NYK won Games 1, 2, and 5 at home before eventually losing in 7.
        The model rated NYK at 65 — essentially a lottery team — because the replacement-level slot system correctly penalizes losing three starters. But the Knicks' "next man up" culture meant role players like Daquan Jeffries and Miles McBride produced above replacement level, and Brunson's 32+ PPG creation kept the offense functional.
        <strong>MIN-DEN (5/7)</strong> was the model's best R2 series — both teams rated 86, so HCA decided most games correctly. The G6 blowout (MIN 115-70) was unpredictable but the model's coin-flip assessment was essentially correct.
        <strong>BOS-CLE (4/5)</strong> and <strong>OKC-DAL (3/6)</strong> showed the familiar pattern: dominant favorites lose exactly one game to a motivated underdog, and the model can't pick WHICH game that happens.</div>
        <span class="learning-tag backtest">2024 Backtest</span><span class="learning-tag model">R2 Analysis</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 11 — 2024 Backtest (Round 2)</div>
        <div class="learning-title">Key R2 Lesson: Replacement-Level Floor is Too Low for Deep Playoff Teams</div>
        <div class="learning-body">The REPLACEMENT_LEVEL of 42 is calibrated for regular-season production. But in the playoffs, teams that lose starters don't actually plug in G-League-caliber replacements — they elevate their 7th-10th men into larger roles, and these players often have <strong>playoff experience</strong> and <strong>coaching preparation</strong> that generic replacement-level doesn't capture.
        NYK's 2024 run (deep into R2 without 3 starters) suggests the replacement-level floor should be higher in playoff contexts — perhaps 48-52 instead of 42 — because playoff rotations are shorter and coaches optimize lineups for the specific matchup.
        However, this needs to be balanced carefully: the replacement-level system correctly predicted that NYK would eventually lose the series (IND won in 7), just not the per-game margins.</div>
        <span class="learning-tag model">Replacement Level</span><span class="learning-tag backtest">Calibration</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 11 — 2024 Backtest (Conference Finals)</div>
        <div class="learning-title">CF: 55.6% — Dallas Over Minnesota Was the Model's Biggest Miss</div>
        <div class="learning-body">The model's worst series: <strong>MIN-DAL CF (1/5 correct)</strong>. Minnesota was rated 86 vs Dallas's 81, and with Round 1 HCA of 1.5, the model gave MIN a 70% win probability. Dallas won 4-1.
        Why the model failed: (1) <strong>Luka-Kyrie synergy</strong> was greater than the sum of parts — two elite shot creators who could alternate carrying the offense created an unscoutable attack that our initiator model doesn't fully capture. (2) <strong>Dallas's defensive transformation</strong> under Jason Kidd — DAL held MIN to 105, 108, 107, 100, and 103 PPG, well below MIN's 115.8 ORTG. The model's advStats are based on regular-season offense, not playoff defensive adjustment capability. (3) <strong>Anthony Edwards' inconsistency</strong> — Edwards averaged 22.6 PPG on 41% FG in the WCF, well below his 25.9 regular-season average. The model's starCeiling captures upside but not downside volatility.
        <strong>BOS-IND (4/4)</strong> was the bright spot — the model nailed the sweep, correctly identifying BOS as overwhelmingly superior (94 vs 80 rating).</div>
        <span class="learning-tag backtest">2024 Backtest</span><span class="learning-tag model">CF Analysis</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 11 — 2024 Backtest (Conference Finals)</div>
        <div class="learning-title">Key CF Lesson: Two-Star Offensive Synergy Multiplier</div>
        <div class="learning-body">Dallas's Luka + Kyrie pairing exposed a gap in the model: when two elite shot creators share the floor, they create a <strong>multiplicative effect</strong> on offensive efficiency. If one is doubled, the other operates 1-on-1 in space. If the defense plays straight up, either can create from isolation.
        Our initiator redundancy system awards a flat +0.5 for 3+ initiators, but doesn't account for the QUALITY of those initiators. Having Luka (95) + Kyrie (85) as dual creators is qualitatively different from having three 70-rated ball handlers. The "sum of parts" model undervalues elite two-man games.
        Potential fix: a <strong>star-pair synergy bonus</strong> that triggers when a team has 2+ players rated 85+ with Shot Creator or Primary Ball Handler roles. This would have boosted DAL by ~1.5-2.0 points and potentially flipped the MIN-DAL prediction.
        This also retroactively explains why BOS (Tatum 92 + Brown 86 + Porzingis 83 + White 76) dominated — they had the deepest star-caliber rotation in the league.</div>
        <span class="learning-tag model">Star Synergy</span><span class="learning-tag backtest">New Concept</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 11 — 2024 Backtest (Finals)</div>
        <div class="learning-title">Finals: 80.0% — Model's Best Round, BOS Dominance Correctly Predicted</div>
        <div class="learning-body">The model went <strong>4/5 in the Finals</strong>, correctly identifying Boston as heavy favorites (91% per game). BOS won 4-1, with the only miss being DAL's G4 blowout (122-84) — Dallas's "one explosion game" before elimination.
        This validates the model's core architecture for matchups with clear talent/system disparities. BOS's 94 team rating vs DAL's 81 was a 13-point gap — the largest in any Finals matchup — and the model correctly converted this to a 91% per-game probability.
        The G4 miss is the familiar "one mandatory upset game" pattern seen throughout the backtest: underdogs with elite stars (Luka) reliably produce 1-2 transcendent performances per series that are essentially unpredictable. The model shouldn't try to predict which specific game this happens — it should accept ~80% accuracy as the ceiling for dominant-vs-inferior matchups.</div>
        <span class="learning-tag backtest">2024 Backtest</span><span class="learning-tag model">Finals Analysis</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 11 — 2024 Backtest (Synthesis)</div>
        <div class="learning-title">Cross-Playoff Analysis: 2024 vs 2025 Backtest Comparison</div>
        <div class="learning-body">Comparing the two backtests reveals structural patterns:
        <strong>2025 Backtest: 36/49 (73.5%)</strong> — R1: 87.5%, R2: 69.6%, CF: 72.7%, Finals: 71.4%
        <strong>2024 Backtest: 52/82 (63.4%)</strong> — R1: 62.8%, R2: 64.0%, CF: 55.6%, Finals: 80.0%
        The 2024 backtest was harder because: (1) More competitive R1 series (2024 had MIL-IND, NYK-PHI, DAL-LAC as 50/50 matchups vs 2025's more lopsided R1). (2) More injuries disrupting regular-season profiles (NYK lost 3 starters). (3) The 2024 playoffs featured more "system > talent" upsets (IND over MIL, DAL over OKC/MIN) than the 2025 playoffs.
        <strong>Series winner accuracy was identical</strong>: 73.3% in 2024 (11/15) vs ~75% in 2025. This suggests the model's macro-level team assessment is solid, but per-game prediction is inherently noisy — home court, hot/cold shooting nights, and momentum shifts create game-level variance that statistical models can't fully capture.
        Combined across both playoffs: <strong>88/131 games = 67.2% accuracy, 11/15 + series = ~75% series accuracy</strong>.</div>
        <span class="learning-tag backtest">Cross-Year Analysis</span><span class="learning-tag milestone">Synthesis</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 11 — 2024 Backtest (New Concepts)</div>
        <div class="learning-title">Four New Model Concepts Implemented from 2024 Backtest</div>
        <div class="learning-body">The 2024 backtest identified four model enhancements, now fully integrated into the live engine:
        (1) <strong>Playoff Ascension Modifier</strong>: Some players consistently elevate beyond regular-season ceilings in playoffs (Brunson +4.6 PPG, Butler +5 PPG, Luka +3.2 PPG). A per-player "playoff gear" field could capture this sustained elevation.
        (2) <strong>Star-Pair Synergy Bonus</strong>: Two 85+ rated shot creators sharing the floor create a multiplicative offensive advantage the model doesn't capture. Luka+Kyrie, Tatum+Brown+Porzingis. Should trigger a +1.5-2.0 team rating bonus.
        (3) <strong>Playoff Replacement-Level Adjustment</strong>: The REPLACEMENT_LEVEL of 42 may be too low for playoff contexts where coaching optimization and shorter rotations elevate 8th-10th men above generic replacement value. Consider 48-52 for playoff simulations.
        (4) <strong>Matchup-Specific System Bonus</strong>: systemBonus is currently a fixed per-team value, but some systems are specifically effective against particular opponents (IND's pace-and-space vs MIL's half-court scheme). A matchup matrix could improve series-level predictions.
        All four are now live in calcTeamRating() and calcWinProb(). Additionally, two ghost calculations were fixed during integration: On/Off team aggregate (already in player ratings) and Pace+Depth absolute bonus (replaced by relative paceMatchup in calcWinProb).</div>
        <span class="learning-tag model">Implemented</span><span class="learning-tag backtest">2024 Lessons</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 14 — 2025 Live Results (BOS-PHI G1)</div>
        <div class="learning-title">BOS 123, PHI 91 — Model Directionally Correct, Underestimated Blowout Magnitude</div>
        <div class="learning-body">Our first live 2025 playoff result validates the model's core predictions while revealing calibration gaps in margin estimation.
        <br><br><strong>What the model nailed:</strong> BOS ML at HIGH confidence (88% model vs 86% implied) — correct. BOS -12.5 spread covered by 19.5 points. Brown Over 25.5 pts hit (26 pts, 7-of-9 in Q3). Star-Pair Synergy validated: Tatum (25/11/7) + Brown (26) both fired as elite co-creators. Tatum's playoffAscension (0.8) was spot-on — his first game back from a ruptured Achilles yielded 25/11/7 with no visible rust. Six Celtics scored 10+ confirming depth advantage. White's defense on Maxey (8-of-20, stifled) was predicted.
        <br><br><strong>What the model missed:</strong> Projected BOS 112–PHI 98 (14-pt margin); actual was 32 points. The Under 211.5 bet lost (actual total 214) because BOS's offense exploded to 123 pts (50% FG, 11 3PM), 11 points above projection, even with garbage time. Maxey Over 26.5 lost — scored only 20 on 40% shooting with 3 turnovers. PHI's 3PT shooting cratered to 4-of-23 (17.4%), their 2nd-worst in franchise playoff history.
        <br><br><strong>Key insight:</strong> The model's projected margin formula may systematically underestimate blowouts in structural mismatches. When a team is missing its best player (Embiid, -13.2 on/off) AND the opponent has two elite creators in a championship system, cascading effects (demoralization, bench minutes, turnover snowball) can double the projected margin. Future consideration: apply a "cascade multiplier" when projected margin exceeds 10 points in games where one team is missing a top-5 on/off player.</div>
        <span class="learning-tag live">2025 Live</span><span class="learning-tag model">Margin Calibration</span><span class="learning-tag data">Betting Results</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 14 — 2025 Live Results (BOS-PHI G1)</div>
        <div class="learning-title">Betting Scorecard: 3/5 Wins (60%), +EV Overall</div>
        <div class="learning-body"><strong>BOS-PHI Game 1 Betting Results:</strong>
        <br>✅ BOS ML (-625): WIN — model 88% vs implied 86%
        <br>✅ BOS -12.5 (-110): WIN — actual margin 32 pts, covered by 19.5
        <br>❌ Under 211.5 (-110): LOSS — actual total 214. BOS scored 123, 11 over projection
        <br>✅ Brown Over 25.5 (-135): WIN — scored 26 pts
        <br>❌ Maxey Over 26.5 (+105): LOSS — scored 20 pts on 8-of-20 FG
        <br><br><strong>Lesson on the Maxey prop:</strong> The model acknowledged White's defensive impact (held Maxey below average in 2/4 meetings) but still bet the over based on volume. In hindsight, when an elite perimeter defender is specifically tasked with shutting down the opposing #1 option AND that #1 has no secondary creator to draw attention, the defensive impact should override volume-based props. This applies to future matchups like White-on-anyone scenarios.
        <br><br><strong>Lesson on the Under:</strong> In extreme mismatches, the dominant team's offense doesn't slow down proportionally to the opponent's collapse. BOS shot 50% and hit 11 threes against demoralized defense. "Blowout + Under" is a trap bet — the favorite's offense feasts.</div>
        <span class="learning-tag live">2025 Live</span><span class="learning-tag data">Betting Results</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 14 — Defensive Matchup Suppression (Implemented)</div>
        <div class="learning-title">New Model Feature: Defensive Matchup Suppression System</div>
        <div class="learning-body">BOS-PHI G1 revealed that our model had no mechanism for <strong>specific defender-on-attacker matchup impact</strong>, especially when the attacker is the team's sole initiator. White's D-LEBRON (2.324) on Maxey — PHI's only creator — produced a +1.08 point suppression edge for BOS, the largest in the bracket. The new system works as follows:
        <br><br><strong>Formula:</strong> Suppression = max(0, D-LEBRON) × (targetUSG / 30) × initiatorPenalty × 0.3, where initiatorPenalty = 1.5 for sole initiator, 1.0 for 2, 0.7 for 3+. Net is capped at ±1.5.
        <br><br><strong>Bracket-wide impact rankings:</strong>
        <br>1. BOS-PHI: +1.08 BOS — White on Maxey (sole initiator). Bracket's most impactful defensive assignment.
        <br>2. NYK-ATL: -0.33 ATL — Daniels (D-LEBRON 1.907) on Brunson outweighs Bridges on NAW. Gives ATL a rare advantage.
        <br>3. SAS-POR: +0.26 SAS — Castle (D-LEBRON 0.908) on Avdija with no counter-suppression from POR.
        <br>4. OKC-PHX: +0.16 OKC — Dort on Booker (sole initiator). Brooks' negative D-LEBRON on SGA contributes nothing.
        <br>5. DET-ORL: +0.13 DET — Ausar (2.93 D-LEBRON) on Banchero vs Suggs (1.552) on sole-initiator Cade. Nearly neutral because Suggs' 1.5x bonus on Cade closes the gap.
        <br>6. CLE-TOR: -0.12 TOR — Barnes (1.914) on Mitchell slightly outweighs Porter on Barnes, but CLE's 3 initiators dilute effect.
        <br>7. DEN-MIN: -0.08 MIN — Gordon's negative D-LEBRON means no suppression on Edwards. McDaniels barely suppresses Jokic.
        <br>8. HOU-LAL: +0.06 HOU — Thompson on LeBron (sole initiator) vs Smart on Sengun nearly cancel out.</div>
        <span class="learning-tag model">Implemented</span><span class="learning-tag live">2025 Live</span><span class="learning-tag data">Matchup Analysis</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 14 — 2025 Live Results (OKC-PHX G1)</div>
        <div class="learning-title">OKC 119, PHX 84 — Blowout Cascade Confirmed, Star Prop Trap Exposed</div>
        <div class="learning-body">Second consecutive Game 1 where the model was directionally correct but underestimated blowout magnitude. Projected OKC 118-104 (14-pt margin); actual was 35 points.
        <br><br><strong>What the model nailed:</strong> OKC ML at HIGH confidence — correct. OKC -14.5 covered by 20.5 points. Jalen Williams' return to All-NBA form (22pts, 9-15 FG, 7reb, 6ast) was a massive swing factor — his wrist/hamstring recovery was more complete than expected. Holmgren (16/7/2/2) confirmed PHX has no interior answer. PHX's turnovers (17 TOs, OKC pts off TOs 15-2) and poor shooting (35% first half) validated the defensive mismatch.
        <br><br><strong>What the model missed:</strong> SGA Over 27.5 LOST — he scored 25 despite being brilliant because he sat most of Q4 in a 35-point blowout. This is the <strong>"Star Prop Trap"</strong> — in projected blowouts, the favorite's star rests in Q4, capping their scoring. The model projected 118 total for OKC but they hit 119 with SGA playing only 29 minutes. Brooks shot the team out of the game early (8 attempts while down 23), confirming the "undisciplined secondary scorer" vulnerability.
        <br><br><strong>Key insight — Blowout Cascade Pattern:</strong> Both BOS-PHI (projected 14, actual 32) and OKC-PHX (projected 14, actual 35) show the same pattern: when a dominant team faces a structurally inferior opponent, cascading effects (demoralization, turnover snowball, bench minutes) can DOUBLE the projected margin. This is now confirmed across 2 games — not a fluke.</div>
        <span class="learning-tag live">2025 Live</span><span class="learning-tag model">Margin Calibration</span><span class="learning-tag data">Betting Results</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 14 — 2025 Live Results (OKC-PHX G1)</div>
        <div class="learning-title">OKC-PHX Betting Scorecard: 2/3 Wins (67%)</div>
        <div class="learning-body"><strong>OKC-PHX Game 1 Betting Results:</strong>
        <br>✅ OKC ML (-900): WIN — model high confidence validated
        <br>✅ OKC -14.5 (-110): WIN — actual margin 35 pts, covered by 20.5
        <br>❌ SGA Over 27.5 (-120): LOSS — scored 25 pts in only 29 minutes (sat Q4 blowout)
        <br><br><strong>Star Prop Trap Rule:</strong> When the model projects a blowout (margin >10 pts), NEVER bet the OVER on the favorite's primary star's scoring prop. The star will rest in Q4, capping their output. SGA was efficient enough to hit 27.5 on pace, but Daigneault pulled him with the game decided. This rule would have saved us this bet AND applies forward to any projected blowout.</div>
        <span class="learning-tag live">2025 Live</span><span class="learning-tag data">Betting Results</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 14 — 2025 Live Results (DET-ORL G1)</div>
        <div class="learning-title">ORL 112, DET 101 — Model's Biggest Miss: Upgraded to HIGH Confidence on Wrong Side</div>
        <div class="learning-body">This is the model's worst Game 1 prediction. We picked DET at HIGH confidence after the line moved from -3.5 to -8.5 — the line movement INCREASED our confidence instead of making us skeptical. ORL won by 11 as the #8 seed.
        <br><br><strong>What went wrong:</strong>
        <br>(1) <strong>Single-Initiator Vulnerability exposed:</strong> Cade scored a career-high 39 points on 13-27 FG — an incredible individual performance — but only Tobias Harris (17) joined him in double figures. DET's bench shot 4-16 (20 pts). When a team has 1 initiator, even a brilliant performance can't overcome collective failure. ORL had 5 players in double figures (Banchero 23, Wagner 19, Bane 17, WCJ 17, Suggs 16) — multi-initiator depth crushed single-star dependence.
        <br>(2) <strong>Line movement skepticism missing:</strong> The line moved 5 points (from -3.5 to -8.5) and we treated this as "sharp money confirming Cade health." But large line movements can also reflect public money overreaction. The ORIGINAL market (DET -3.5) was much closer to reality than the moved line.
        <br>(3) <strong>Home playoff losing streaks unmodeled:</strong> DET has now lost 11 straight home playoff games (0-8 at LCA since 2008). This isn't just bad luck — it suggests a franchise-level playoff culture deficit that regular-season success doesn't cure overnight.
        <br>(4) <strong>Closing lineup disaster:</strong> DET's closing lineup (Cunningham/Jenkins/Huerter/Stewart/Duren) had ZERO minutes together all season. Bickerstaff panicked away from his proven rotation.
        <br>(5) <strong>Duren completely neutralized:</strong> WCJ held Duren to 8pts, 7reb (vs 19.5/10.5 season averages). The model's "interior dominance" thesis was wrong.
        <br><br><strong>Key insight — Multi-Initiator Advantage:</strong> ORL's 2 initiators (Banchero + Wagner) + Bane as a proven third creator produced 5 players in double figures. DET's 1 initiator (Cade) produced a brilliant individual game that still lost. The initiator count matters MORE than star quality in playoff basketball.</div>
        <span class="learning-tag live">2025 Live</span><span class="learning-tag model">Model Failure</span><span class="learning-tag data">Critical Lesson</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 14 — 2025 Live Results (DET-ORL G1)</div>
        <div class="learning-title">DET-ORL Betting Scorecard: 0/2 Wins (0%) — Worst Single-Game Performance</div>
        <div class="learning-body"><strong>DET-ORL Game 1 Betting Results:</strong>
        <br>❌ DET ML (-400): LOSS — picked at HIGH confidence, ORL won outright
        <br>❌ DET -8.5 (-110): LOSS — ORL won by 11 (DET would have needed to win by 9+)
        <br><br><strong>Cumulative Game 1 Betting Record:</strong> 5/10 wins across 3 games (BOS-PHI 3/5, OKC-PHX 2/3, DET-ORL 0/2). The DET-ORL miss wiped out all profit from the other two games. The lesson: never upgrade confidence based on line movement alone, and heavily discount #1 seeds with zero playoff pedigree and single-initiator offenses.</div>
        <span class="learning-tag live">2025 Live</span><span class="learning-tag data">Betting Results</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 14 — Model Improvements (Post-G1 Analysis)</div>
        <div class="learning-title">Four New Model Concepts Implemented from Game 1 Results</div>
        <div class="learning-body">Three Game 1 results revealed systematic model weaknesses. Four improvements implemented:
        <br><br><strong>(1) Blowout Cascade Multiplier:</strong> When projected margin exceeds 10 AND opponent is missing a top-5 on/off player OR has a negative NetRtg, apply 1.5x multiplier to projected margin. Validated by BOS-PHI (14→32, ratio 2.3x) and OKC-PHX (14→35, ratio 2.5x).
        <br><br><strong>(2) Single-Initiator Penalty Enhancement:</strong> Teams with initiators=1 now receive an additional -1.5 penalty in calcWinProb when facing teams with initiators≥2. DET-ORL proved that even a 39-point performance from a sole initiator can't overcome collective depth. The existing defMatchupSuppression already penalizes sole initiators, but this adds a baseline penalty independent of defensive matchup quality.
        <br><br><strong>(3) Line Movement Skepticism:</strong> Model no longer upgrades confidence based on line movement >3 points. Large moves are treated as noise/public money rather than sharp information. DET moved from -3.5 to -8.5 and the original line was more accurate.
        <br><br><strong>(4) Playoff Pedigree Floor:</strong> Teams with playoffPedigree=0 AND no players with playoff series wins now receive a -0.5 modifier in high-leverage situations. DET's 11-game home playoff losing streak and franchise drought suggest playoff culture matters beyond individual talent.</div>
        <span class="learning-tag model">Implemented</span><span class="learning-tag live">2025 Live</span>
      </div>

      <div class="learning-card">
        <div class="learning-title">SAS-POR G1: Model's Most Accurate Prediction — 13-pt Margin Nailed Exactly</div>
        <div class="learning-body">Projected SAS 115-102 (13-pt margin, HIGH confidence). Actual: SAS 111-98 (13-pt margin). Winner ✅, confidence ✅, margin EXACT. Total points slightly under (projected 217, actual 209). Wembanyama's playoff debut (35pts, 5-6 3PT, 2blk) exceeded even optimistic projections — his rib contusion (injuryRisk: 0.2) was a non-factor. Avdija's 30/10 showed the defMatchup suppression model was correct to predict only +0.13 advantage for Castle — Avdija scored freely but POR still lost by 13. Key insight: <strong>individual star performances don't overcome systemic talent gaps</strong>. Avdija's 30pts couldn't overcome SAS's depth (Castle 17, Fox 17, Vassell key 3s) and Wemby's two-way dominance. Henderson's 18pts off the bench exceeded model expectations for POR's depth. Clingan was neutralized by SAS's length (blocked by Kornet AND Vassell on same possession) — the LEBRON data (Clingan D-LEBRON 2.35 vs Wemby D-LEBRON 3.992) correctly predicted this interior mismatch.</div>
        <span class="learning-tag correct">Validated</span><span class="learning-tag live">2025 Live</span>
      </div>

      <div class="learning-card">
        <div class="learning-title">SAS-POR Betting Scorecard: 3/3 Wins (100%) — Best Single-Game Performance</div>
        <div class="learning-body"><strong>SAS ML (HIGH confidence): ✅</strong> — SAS 111, POR 98. Comfortable wire-to-wire win despite POR's Q3 run. <strong>SAS -10.5 spread: ✅</strong> — Won by 13, covered by 2.5 points. <strong>Under 218.5: ✅</strong> — Total was 209. SAS's elite defense (DRtg 108.2) held POR to 98 while POR's defense limited SAS to 111 despite Wemby's explosion. This was the model's best single-game betting result across all 8 R1 Game 1s. Cumulative G1 record: BOS-PHI 3/5, OKC-PHX 2/3, DET-ORL 0/2, SAS-POR 3/3 = <strong>8/13 overall (61.5%)</strong>.</div>
        <span class="learning-tag bet">Betting</span><span class="learning-tag live">2025 Live</span>
      </div>

      <div class="learning-card">
        <div class="learning-title">New Insight: Interim Coaching Penalty May Be Overweighted</div>
        <div class="learning-body">The model applied a -7 impact factor for POR's coaching scandal (Billups gambling investigation, Splitter interim). While SAS won comfortably, POR showed more fight than expected — Avdija's 30/10, Henderson's 18pts breakout, and the 8-0 Q3 run cutting a 16-pt deficit to 2 all suggest the interim coaching disruption wasn't as devastating as modeled. Splitter's halftime adjustments were effective (POR outscored SAS in early Q3), and the team played with energy despite the turmoil. <strong>Model adjustment consideration:</strong> Interim coaching penalties should be reduced from -7 to -4/-5 when the interim coach has been in place for multiple weeks and the team has stabilized. The initial shock value of coaching changes fades with time.</div>
        <span class="learning-tag missed">Overweighted</span><span class="learning-tag live">2025 Live</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 15 — Margin Variance Engine</div>
      </div>

      <div class="learning-card">
        <div class="learning-title">Static Score Problem Identified: All 16 Projections Had 5-14pt Margins</div>
        <div class="learning-body">The model's projScore values were hardcoded strings (e.g., "HOU 109 — LAL 102"), not dynamically calculated. This produced uniform 5-14 point margins across all series — completely failing to capture that real 2025 playoffs had margins from 1 to 55 points. Root cause: projScore was set manually during initial data entry and never connected to the probability engine. <strong>Fix:</strong> Built the 11-step calcGameProjection() function that derives margins from win probability via logistic inverse formula: margin = 15 × log₁₀(P/(1-P)).</div>
        <span class="learning-tag missed">Structural Bug</span><span class="learning-tag model">Implemented</span>
      </div>

      <div class="learning-card">
        <div class="learning-title">11-Step Margin Variance Engine: Logistic Inverse + 8 Contextual Factors</div>
        <div class="learning-body">The new calcGameProjection() engine converts win probability to expected margin through 11 steps: (1) Base margin via logistic inverse, (2) Talent Gap Amplifier (max 1.25×), (3) Depth Disparity Factor (±0.6 per player), (4) Star Absence Blowout Boost (+2.0 per star OUT), (5) Active Injury Margin Drag, (5b) Fatigue Differential, (6) Pre-compression cap at ±18pts, (7) Coaching Adjustment Compression (10-18% per game), (8) Elimination Game Intensity (35% compression), (9) Clutch Team Compression, (10) Pace-Based Score Projection, (11) Variance Profile. Key design: cap applied BEFORE coaching compression so G2+ margins can differentiate below the cap.</div>
        <span class="learning-tag model">Implemented</span><span class="learning-tag live">2025 Live</span>
      </div>

      <div class="learning-card">
        <div class="learning-title">HOU-LAL G2 Bet Flip: Margin Engine Disagreed with Manual Pick</div>
        <div class="learning-body">Original G2 pick was LAL ML at medium confidence. The margin engine projected HOU by 3 (COIN FLIP character), disagreeing with the manual pick. Three compounding factors drove the correction: (1) Udoka's Coaching Adjustment Compression (adjustmentRating: 8, highest tier), (2) KD's probable return triggering Star Absence Margin Boost, (3) LAL's unsustainable 61%/53% shooting regression. <strong>Lesson:</strong> When the engine disagrees with qualitative analysis, the engine should win — quantitative factors compound in ways intuition misses.</div>
        <span class="learning-tag bet">Betting</span><span class="learning-tag model">Correction</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 16 — Fatigue Monitor Upgrade</div>
      </div>

      <div class="learning-card">
        <div class="learning-title">Fatigue Monitor Upgraded from LOW to MEDIUM Confidence</div>
        <div class="learning-body">G1 results validated four fatigue predictions: (1) LeBron (age 41, fatigue 19.1%) shifted to facilitator mode instead of scoring — fatigue-driven role adaptation, (2) Edwards admitted altitude fatigue in DEN G1 — compounded with knee injury, (3) Sharpe's fibula return showed conditioning limits via early foul trouble, (4) Tatum's Achilles return (17 games post-surgery) produced 25/11/7 but requires monitoring. <strong>Changes:</strong> Weight increased from 0.5× to 0.75×, team rating penalty increased from max 1.5pts to 2.5pts, fatigue threshold lowered from 0.05 to 0.03, and fatigue differential now feeds directly into margin engine as Step 5b.</div>
        <span class="learning-tag model">Upgraded</span><span class="learning-tag correct">Validated</span>
      </div>

      <div class="learning-card">
        <div class="learning-title">Ghost Audit: 4 Dead Functions + 87 Orphan CSS Lines Removed</div>
        <div class="learning-body">Comprehensive audit found: 4 ghost functions (estimateUnderdogGames, makeEdge, getExternalEdge, getExternalNote) defined but never called — removed. 87 orphan CSS lines from earlier design iterations (g1-*, g2-*, evidence-*, game-log-*, backtest-lesson-*) — removed. 0 broken function connections, 0 duplicate series IDs, 0 undefined onclick handlers. File reduced by ~120 lines of dead code. All getElementById references verified, div tag balance confirmed (1 extra </div> traced to JS template string — benign).</div>
        <span class="learning-tag correct">Maintenance</span>
      </div>

    </div>
  </div>`;

  // POST-PROCESSING: Group entries into collapsible phase boxes
  const timeline = el.querySelector('.learning-timeline');
  if (!timeline) return;

  // Phase summaries for the collapsed view
  const phaseSummaries = {
    'Phase 1': 'Core rating formula, replacement-level slots, team stat differentials',
    'Phase 2': 'Initial G1 predictions and result analysis',
    'Phase 3': 'G2 prediction methodology using G1 data',
    'Phase 4': '2025 playoffs backtest — 49 games, 73.5% accuracy',
    'Phase 5': 'Model v2 with 6 new parameters from backtest',
    'Phase 6': 'LEBRON/WAR integration + ghost code audit',
    'Phase 7': '5-factor fatigue system + active injury modeling',
    'Phase 8': 'Roster corrections + horizontal UI redesign',
    'Phase 9': 'Live injury updates, coaching analysis, G1 results',
    'Phase 10': 'Partnow offensive style research integration',
    'Phase 11': '2024 playoffs backtest — 86 games across 4 rounds',
    'Phase 14': 'Live G1 results analysis + model corrections',
    'Phase 15': '11-step margin variance engine + bet audit',
    'Phase 16': 'Fatigue monitor upgraded to medium confidence'
  };

  // Collect all entries/cards
  const children = Array.from(timeline.children);
  const groups = [];
  let currentPhase = null;
  let currentEntries = [];

  children.forEach(child => {
    const phaseEl = child.querySelector('.learning-phase');
    if (phaseEl) {
      // Extract phase number (e.g., "Phase 1" from "Phase 1 — Foundation")
      const phaseNum = phaseEl.textContent.match(/Phase\s+\d+/);
      const phaseKey = phaseNum ? phaseNum[0] : phaseEl.textContent;
      if (phaseKey !== currentPhase) {
        if (currentPhase && currentEntries.length > 0) {
          groups.push({ phase: currentPhase, label: currentEntries[0].phaseLabel, entries: currentEntries });
        }
        currentPhase = phaseKey;
        currentEntries = [];
      }
      currentEntries.push({ el: child, phaseLabel: phaseEl.textContent });
    } else {
      currentEntries.push({ el: child, phaseLabel: '' });
    }
  });
  if (currentPhase && currentEntries.length > 0) {
    groups.push({ phase: currentPhase, label: currentEntries[0].phaseLabel, entries: currentEntries });
  }

  // Clear timeline and rebuild with phase boxes
  timeline.innerHTML = '';
  groups.forEach((group, gi) => {
    const details = document.createElement('details');
    details.className = 'phase-box';
    // Open the last 2 phases by default (newest)
    if (gi >= groups.length - 2) details.setAttribute('open', '');

    const summary = document.createElement('summary');
    const desc = phaseSummaries[group.phase] || '';
    summary.innerHTML = `<span class="phase-summary-title">${group.label || group.phase}</span>` +
      `<span class="phase-summary-count">${group.entries.length} item${group.entries.length>1?'s':''}</span>` +
      (desc ? `<span class="phase-summary-desc">${desc}</span>` : '');
    details.appendChild(summary);

    const content = document.createElement('div');
    content.className = 'phase-box-content';
    group.entries.forEach(e => {
      // Hide the phase label inside entries since it's in the box header
      const phaseInner = e.el.querySelector('.learning-phase');
      if (phaseInner) phaseInner.style.display = 'none';
      content.appendChild(e.el);
    });
    details.appendChild(content);
    timeline.appendChild(details);
  });
}

