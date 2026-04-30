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

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 14 — 2025 Live Results (SAS-POR G1)</div>
        <div class="learning-title">SAS-POR G1: Model's Most Accurate Prediction — 13-pt Margin Nailed Exactly</div>
        <div class="learning-body">Projected SAS 115-102 (13-pt margin, HIGH confidence). Actual: SAS 111-98 (13-pt margin). Winner ✅, confidence ✅, margin EXACT. Total points slightly under (projected 217, actual 209). Wembanyama's playoff debut (35pts, 5-6 3PT, 2blk) exceeded even optimistic projections — his rib contusion (injuryRisk: 0.2) was a non-factor. Avdija's 30/10 showed the defMatchup suppression model was correct to predict only +0.13 advantage for Castle — Avdija scored freely but POR still lost by 13. Key insight: <strong>individual star performances don't overcome systemic talent gaps</strong>. Avdija's 30pts couldn't overcome SAS's depth (Castle 17, Fox 17, Vassell key 3s) and Wemby's two-way dominance. Henderson's 18pts off the bench exceeded model expectations for POR's depth. Clingan was neutralized by SAS's length (blocked by Kornet AND Vassell on same possession) — the LEBRON data (Clingan D-LEBRON 2.35 vs Wemby D-LEBRON 3.992) correctly predicted this interior mismatch.</div>
        <span class="learning-tag correct">Validated</span><span class="learning-tag live">2025 Live</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 14 — 2025 Live Results (SAS-POR G1)</div>
        <div class="learning-title">SAS-POR Betting Scorecard: 3/3 Wins (100%) — Best Single-Game Performance</div>
        <div class="learning-body"><strong>SAS ML (HIGH confidence): ✅</strong> — SAS 111, POR 98. Comfortable wire-to-wire win despite POR's Q3 run. <strong>SAS -10.5 spread: ✅</strong> — Won by 13, covered by 2.5 points. <strong>Under 218.5: ✅</strong> — Total was 209. SAS's elite defense (DRtg 108.2) held POR to 98 while POR's defense limited SAS to 111 despite Wemby's explosion. This was the model's best single-game betting result across all 8 R1 Game 1s. Cumulative G1 record: BOS-PHI 3/5, OKC-PHX 2/3, DET-ORL 0/2, SAS-POR 3/3 = <strong>8/13 overall (61.5%)</strong>.</div>
        <span class="learning-tag bet">Betting</span><span class="learning-tag live">2025 Live</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 14 — 2025 Live Results (SAS-POR G1)</div>
        <div class="learning-title">New Insight: Interim Coaching Penalty May Be Overweighted</div>
        <div class="learning-body">The model applied a -7 impact factor for POR's coaching scandal (Billups gambling investigation, Splitter interim). While SAS won comfortably, POR showed more fight than expected — Avdija's 30/10, Henderson's 18pts breakout, and the 8-0 Q3 run cutting a 16-pt deficit to 2 all suggest the interim coaching disruption wasn't as devastating as modeled. Splitter's halftime adjustments were effective (POR outscored SAS in early Q3), and the team played with energy despite the turmoil. <strong>Model adjustment consideration:</strong> Interim coaching penalties should be reduced from -7 to -4/-5 when the interim coach has been in place for multiple weeks and the team has stabilized. The initial shock value of coaching changes fades with time.</div>
        <span class="learning-tag missed">Overweighted</span><span class="learning-tag live">2025 Live</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 15 — Margin Variance Engine</div>
        <div class="learning-title">Static Score Problem Identified: All 16 Projections Had 5-14pt Margins</div>
        <div class="learning-body">The model's projScore values were hardcoded strings (e.g., "HOU 109 — LAL 102"), not dynamically calculated. This produced uniform 5-14 point margins across all series — completely failing to capture that real 2025 playoffs had margins from 1 to 55 points. Root cause: projScore was set manually during initial data entry and never connected to the probability engine. <strong>Fix:</strong> Built the 11-step calcGameProjection() function that derives margins from win probability via logistic inverse formula: margin = 15 × log₁₀(P/(1-P)).</div>
        <span class="learning-tag missed">Structural Bug</span><span class="learning-tag model">Implemented</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 15 — Margin Variance Engine</div>
        <div class="learning-title">11-Step Margin Variance Engine: Logistic Inverse + 8 Contextual Factors</div>
        <div class="learning-body">The new calcGameProjection() engine converts win probability to expected margin through 11 steps: (1) Base margin via logistic inverse, (2) Talent Gap Amplifier (max 1.25×), (3) Depth Disparity Factor (±0.6 per player), (4) Star Absence Blowout Boost (+2.0 per star OUT), (5) Active Injury Margin Drag, (5b) Fatigue Differential, (6) Pre-compression cap at ±18pts, (7) Coaching Adjustment Compression (10-18% per game), (8) Elimination Game Intensity (35% compression), (9) Clutch Team Compression, (10) Pace-Based Score Projection, (11) Variance Profile. Key design: cap applied BEFORE coaching compression so G2+ margins can differentiate below the cap.</div>
        <span class="learning-tag model">Implemented</span><span class="learning-tag live">2025 Live</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 15 — Margin Variance Engine</div>
        <div class="learning-title">HOU-LAL G2 Bet Flip: Margin Engine Disagreed with Manual Pick</div>
        <div class="learning-body">Original G2 pick was LAL ML at medium confidence. The margin engine projected HOU by 3 (COIN FLIP character), disagreeing with the manual pick. Three compounding factors drove the correction: (1) Udoka's Coaching Adjustment Compression (adjustmentRating: 8, highest tier), (2) KD's probable return triggering Star Absence Margin Boost, (3) LAL's unsustainable 61%/53% shooting regression. <strong>Lesson:</strong> When the engine disagrees with qualitative analysis, the engine should win — quantitative factors compound in ways intuition misses.</div>
        <span class="learning-tag bet">Betting</span><span class="learning-tag model">Correction</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 16 — Fatigue Monitor Upgrade</div>
        <div class="learning-title">Fatigue Monitor Upgraded from LOW to MEDIUM Confidence</div>
        <div class="learning-body">G1 results validated four fatigue predictions: (1) LeBron (age 41, fatigue 19.1%) shifted to facilitator mode instead of scoring — fatigue-driven role adaptation, (2) Edwards admitted altitude fatigue in DEN G1 — compounded with knee injury, (3) Sharpe's fibula return showed conditioning limits via early foul trouble, (4) Tatum's Achilles return (17 games post-surgery) produced 25/11/7 but requires monitoring. <strong>Changes:</strong> Weight increased from 0.5× to 0.75×, team rating penalty increased from max 1.5pts to 2.5pts, fatigue threshold lowered from 0.05 to 0.03, and fatigue differential now feeds directly into margin engine as Step 5b.</div>
        <span class="learning-tag model">Upgraded</span><span class="learning-tag correct">Validated</span>
      </div>

      <div class="learning-entry correction">
        <div class="learning-phase">Phase 16 — Fatigue Monitor Upgrade</div>
        <div class="learning-title">Ghost Audit: 4 Dead Functions + 87 Orphan CSS Lines Removed</div>
        <div class="learning-body">Comprehensive audit found: 4 ghost functions (estimateUnderdogGames, makeEdge, getExternalEdge, getExternalNote) defined but never called — removed. 87 orphan CSS lines from earlier design iterations (g1-*, g2-*, evidence-*, game-log-*, backtest-lesson-*) — removed. 0 broken function connections, 0 duplicate series IDs, 0 undefined onclick handlers. File reduced by ~120 lines of dead code. All getElementById references verified, div tag balance confirmed (1 extra &lt;/div&gt; traced to JS template string — benign).</div>
        <span class="learning-tag correct">Maintenance</span>
      </div>

      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 17 — Google Scholar Research Integration</div>
        <div class="learning-title">16 Academic Papers Reviewed — 7 Model Changes Implemented</div>
        <div class="learning-body">Conducted systematic Google Scholar research across 9 topic areas: playoff performance indicators, regular season vs playoff differences, home court advantage, fatigue/rest, momentum/elimination pressure, technical fouls, clutch performance, defensive matchup suppression, and player absence/injury impact. Reviewed 16 papers from 2020-2025, prioritizing peer-reviewed journals with high citation counts.
        <br><br><strong>Tier 1 (High Impact — Implemented):</strong>
        <br>1. <strong>Li et al. (2025)</strong> — Game 7 analysis: location non-significant → G7 override reduced from +5 to +2.5
        <br>2. <strong>Cabarkapa et al. (2022, 81 citations)</strong> — Playoff basketball more conservative → added Playoff Adjustment Factor (pace -5%, FG% weight +15%)
        <br>3. <strong>Barreira &amp; Morgado (2023, 15 citations)</strong> — HCA declining since 1946 → all HCA values reduced ~15%
        <br>4. <strong>Esteves et al. (2021, 95 citations)</strong> — Non-linear recovery curve → rest penalty in later rounds
        <br>5. <strong>Tenenbaum et al. (2025)</strong> — TF momentum differs regular vs playoffs → validates Edwards volatility factor
        <br><br><strong>Tier 2 (Moderate Impact — Implemented):</strong>
        <br>6. <strong>Sarlis et al. (2024, 31 citations) + Iatropoulos et al. (2025, 14 citations)</strong> — Clutch more predictive in playoffs → clutch weight increased from 10% to 13%
        <br>7. <strong>Jewell et al. (2025)</strong> — Cumulative minutes load → season-long fatigue floor for heavy-minute players
        <br>8. <strong>Morgulev et al. (2022)</strong> — Elimination pressure → bounce-back probability adjusted for series deficit
        <br><br><strong>Tier 3 (Validation — No Code Changes Needed):</strong>
        <br>Terner &amp; Franks (2021, 130 citations) validates RAPM framework; Stiles (2024) validates D-LEBRON suppression; Cristo (2025) validates injury+clutch prediction approach; López-García (2024, 10 citations) + Ganz &amp; Allsop (2024, 8 citations) confirm declining HCA.
        <br><br><strong>Net model impact:</strong> HCA slightly reduced (more conservative), playoff pace slowed, clutch metrics upweighted, fatigue model deepened with cumulative load. These changes make the model more research-grounded and should improve accuracy in later-round predictions where our 2025 backtest accuracy dropped from 87.5% (R1) to 69.6% (R2).</div>
        <span class="learning-tag model">Research</span><span class="learning-tag milestone">Phase 17</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 17 — Google Scholar Research Integration</div>
        <div class="learning-title">Key Insight: HCA Is Not What We Thought</div>
        <div class="learning-body">Three independent research streams converge on the same conclusion: home court advantage in the NBA playoffs is significantly weaker than historical intuition suggests.
        <br><br>(1) <strong>Barreira &amp; Morgado (2023)</strong> showed HCA has been declining since at least the 1990s in a 76-year longitudinal study of NBA playoffs.
        <br>(2) <strong>López-García et al. (2024)</strong> found team ability has a significant effect on HCA (p &lt; 0.01) — meaning strong teams create HCA through quality of play, not venue effects.
        <br>(3) <strong>Li et al. (2025)</strong> found game location is NOT a significant factor in Game 7 outcomes — the decisive factors are EFG% and TOV%, especially in the second half.
        <br><br>Our old G7 override of +5.0 was among the most aggressive parameters in the model, and it was built on conventional wisdom rather than rigorous data. The new +2.5 still respects crowd energy but no longer dominates the calculation. Combined with the ~15% reduction across all rounds, this should significantly improve our R2+ accuracy where road teams kept stealing games.</div>
        <span class="learning-tag model">HCA Research</span><span class="learning-tag correct">Validated</span>
      </div>

      <div class="learning-entry insight">
        <div class="learning-phase">Phase 17 — Google Scholar Research Integration</div>
        <div class="learning-title">Key Insight: Playoffs Are a Different Sport</div>
        <div class="learning-body">Cabarkapa et al. (2022) provided the most actionable single finding: playoff basketball is <strong>statistically more conservative</strong> than regular season. Their discriminant model achieves 87.2% classification accuracy in playoffs (vs 82.8% regular season), meaning playoff games are EASIER to predict when you use the right variables.
        <br><br>The key variables that discriminate winners from losers in playoffs: (1) FG% — top discriminator, (2) Defensive Rebounds — teams that secure possession win, (3) Turnovers — TO% is significantly negative. Notably, personal fouls do NOT discriminate in playoffs (unlike regular season), and offensive rebounds actually favor LOSING teams (trailing teams crash boards).
        <br><br>This validates our stat differential system (Jones &amp; Magel 2016) but suggests we should weight FG% and DRB% even higher for playoff contexts. The counterintuitive ORB finding also explains why teams like CLE (high ORB%) don't get extra credit in our playoff model — those boards come when trailing.</div>
        <span class="learning-tag model">Playoff Adjustment</span><span class="learning-tag data">Research</span>
      </div>

      <!-- Phase 20 -->
      <div class="learning-entry">
        <div class="learning-phase">Phase 20 — G2 Differentiation Engine</div>
        <div class="learning-title">Step 7b: Momentum/Regression System for Game 2+ Projections</div>
        <div class="learning-body">Implemented a 3-factor momentum system that runs after coaching compression: (A) Upset bounce-back — home teams that lost G1 get 2-4pt margin boost, road losers 1-2.5pt. (B) Blowout regression — 25+ pt blowouts regress 25-35%, 15+ pt wins regress 12-25%, close games (<6pts) minimal 3%. (C) Surprise shift — when G1 result contradicts model prediction, margin shifts 30% toward reality.
        <br><br>Upgraded Bayesian weighting from 30% to 45% for 15+ minute players, with tiered system (65/35 for 10-14min, 40/60 for minutes). Enhanced coaching compression from 10-18% to 15-30% per game with opponent coach quality factor. Lowered overperformance regression threshold from +10 to +6pts, underperformance bounce-back from -8 to -5pts. Result: All 8 series show meaningful G2 margin shifts (2-10pts compressed from G1 projections).</div>
        <span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 20</span>
      </div>

      <!-- Phase 21 -->
      <div class="learning-entry">
        <div class="learning-phase">Phase 21 — CLE-TOR G2 Results Analysis</div>
        <div class="learning-title">Game Margin Prediction: Model +11 vs Actual +10 — Excellent</div>
        <div class="learning-body"><strong>CLE 115, TOR 105 (CLE leads 2-0).</strong> The G2 differentiation engine's first live test was a success at the game level — projected margin of +11 vs actual +10 (within 1 point). The game character prediction of COMPETITIVE was also validated: TOR kept it within 7 through Q2 before CLE pulled away in Q3/Q4.
        <br><br>CLE's top-3 all exceeded 25pts (Mitchell 30, Harden 28, Mobley 25) — the model didn't anticipate this offensive explosion from all three simultaneously. TOR's 22 turnovers vs CLE's 12 was the game's decisive factor; the model doesn't explicitly project turnover differential. Strus regressed from 24pts (G1) to 6pts — directionally correct but model still overestimated at 12.1.</div>
        <span class="learning-tag data">G2 Live Result</span><span class="learning-tag milestone">Phase 21</span>
      </div>
      <div class="learning-entry">
        <div class="learning-phase">Phase 21 — CLE-TOR G2 Results Analysis</div>
        <div class="learning-title">Player-Level Misses: Role Flexibility + Defensive Scheme Impact</div>
        <div class="learning-body"><strong>Biggest model misses by player:</strong>
        <br>• <strong>Harden:</strong> 28pts/4ast actual vs 19.1pts/8.7ast projected. Role shifted from facilitator (10ast G1) to scorer. Bayesian update correctly boosted assists but couldn't predict tactical role change. LEARNING: Player role flexibility (facilitator↔scorer) is not captured.
        <br>• <strong>Mobley:</strong> 25pts on 11/13 FG vs 15.4pts projected. Massive scoring efficiency not predicted. His offensive ceiling in a playoff setting is higher than regular season data suggests.
        <br>• <strong>Ingram:</strong> 7pts on 3/15 FG vs 18.7pts projected. CLE's defensive scheme completely shut him down for a second straight game (9 shots G1, 3/15 G2). LEARNING: Defensive matchup suppression needs a "scheme lock" multiplier when the same scheme works in consecutive games.
        <br>• <strong>Barnes:</strong> 26pts vs 19.7pts projected. Bounce-back model was directionally correct but underestimated the magnitude.
        <br>• <strong>Murray-Boyles:</strong> 17pts vs 9.8pts projected. Bench player emergence is consistently underestimated — young players gaining confidence is nonlinear.
        <br>• <strong>Poeltl:</strong> Only 9min (model assumed full rotation). Role collapse not captured — a repeatable scheme makes it a G3 factor.</div>
        <span class="learning-tag model">Model Learning</span><span class="learning-tag data">Player Analysis</span>
      </div>
      <div class="learning-entry">
        <div class="learning-phase">Phase 21 — CLE-TOR G2 Results Analysis</div>
        <div class="learning-title">5 Actionable Model Improvements Identified</div>
        <div class="learning-body"><strong>1. Turnover Differential Projection:</strong> Model doesn't project TO differential explicitly. CLE forced 22 TOs in G2 (18 in G1) — this is a repeatable defensive scheme outcome, not random variance. Should add a scheme-based turnover factor.
        <br><strong>2. Player Role Flexibility:</strong> Harden switching from facilitator (10ast) to scorer (28pts/4ast) broke the Bayesian assist model. Need a "role mode" variable that considers when a team's scoring load redistributes.
        <br><strong>3. Defensive Scheme Lock:</strong> When a defensive scheme works in G1 AND G2 against a specific player (Ingram: 17pts→7pts), the suppression should compound, not reset. Current model treats each game independently.
        <br><strong>4. Bench Emergence Nonlinearity:</strong> Murray-Boyles went 14→17pts across G1→G2. Young bench players gaining playoff confidence produce accelerating returns, not mean reversion.
        <br><strong>5. Minutes Reallocation:</strong> Poeltl's collapse from 21min (G1) to 9min (G2) shifted 12min to Mamukelashvili (20min, 12/10 double-double). Model should track minutes trends and redistribute when patterns emerge.</div>
        <span class="learning-tag model">Future Work</span><span class="learning-tag milestone">Phase 21</span>
      </div>

      <!-- Phase 22 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 22 — Per-Player Offensive Outlook System</div>
        <div class="learning-title">Research-Backed Individual FG% & Scoring Differentiation</div>
        <div class="learning-body">Implemented <strong>g3PlayerOutlook</strong> — a per-player, per-game offensive outlook system that replaces the old flat 40-50% FG% range with research-backed differentiated projections. Each player gets an <strong>outlook</strong> (good/bad/neutral/neutral-good), <strong>projFgPct</strong>, <strong>ptsRange</strong>, <strong>reason</strong>, and <strong>confidence</strong> (high/medium/low). The outlook feeds into two mechanisms: (1) scoring boost/suppress of ±8-12% based on outlook and confidence, (2) FG% override for shooting stat lines (FGM/FGA/TPM/TPA). This was applied to NYK-ATL G3, CLE-TOR G3, and DEN-MIN G3 using online research covering regular season stats, G1/G2 box scores, historical playoff matchups, coaching tactics, and 2024/2025 playoff similarities.</div>
        <span class="learning-tag model">Engine Upgrade</span><span class="learning-tag data">Research</span><span class="learning-tag milestone">Phase 22</span>
      </div>

      <div class="learning-entry">
        <div class="learning-phase">Phase 22 — Per-Player Offensive Outlook System</div>
        <div class="learning-title">Bayesian Blend + Returning Player Logic</div>
        <div class="learning-body">The projection engine uses a <strong>tiered Bayesian blend</strong>: 55% model / 45% prior actual for 15+ minute players, 70/30 for 5-14 min players, and 100% model for players with no prior data. A key bug was discovered where <strong>researchFgPct</strong> was scoped inside the <code>if (prior)</code> block, making it inaccessible for players without prior box scores. Fixed by moving the entire outlook block outside the prior check. Additionally, <strong>returning player logic</strong> was added to include roster players who weren't in prior box scores but have a research outlook entry (e.g., Quickley returning from injury in CLE-TOR G3). The threshold for inclusion was refined from <code>rating > 50</code> to <strong>outlook-entry-based</strong> to avoid normalization dilution from irrelevant bench players.</div>
        <span class="learning-tag model">Bug Fix</span><span class="learning-tag model">Engine Design</span><span class="learning-tag milestone">Phase 22</span>
      </div>

      <div class="learning-entry">
        <div class="learning-phase">Phase 22 — Per-Player Offensive Outlook System</div>
        <div class="learning-title">Key Research Findings Across Three Series</div>
        <div class="learning-body"><strong>NYK-ATL:</strong> McCollum trending as primary scorer (26→32pts), ATL's offense runs through him not Jalen Johnson. Okongwu's 3PT evolution (4-6 from 3 in G1) is a scheme-breaker.
        <br><strong>CLE-TOR:</strong> Mobley's 84.6% FG in G2 was unsustainable (regressed to 52% projection). Strus scouted after 24pt G1 explosion (down to 38.5%). Barnes trending up (21→26pts). Quickley's return from injury at reduced capacity (40.4% FG, 10.3pts projected).
        <br><strong>DEN-MIN:</strong> Gobert held Jokic to 1-8 when matched in G2 — worst playoff shooting vs single defender in Jokic's career. Edwards' knee warming up (22→30pts health trajectory). Hardaway historically torments Minnesota (19+ PPG). Gordon flagged "bad" due to foul trouble pattern + injury-riddled 36-game season.</div>
        <span class="learning-tag data">Research</span><span class="learning-tag milestone">Phase 22</span>
      </div>

      <div class="learning-entry">
        <div class="learning-phase">Phase 22 — Per-Player Offensive Outlook System</div>
        <div class="learning-title">Codebase Audit & Hardening</div>
        <div class="learning-body">Comprehensive audit found and fixed: (1) <strong>Unused variable</strong> <code>isMustWin</code> — logically identical to <code>isElimination</code> in best-of-7, removed. (2) <strong>Null safety</strong> — added <code>|| []</code> guards on <code>series.externalFactors</code> in both projections.js and ratings.js to prevent crashes on series without external factors. (3) <strong>Null guards</strong> on <code>player.ts</code> (true shooting %) — was accessed without checking existence, now defaults to 55 when undefined. (4) <strong>Misleading comment</strong> on <code>researchFgPct</code> corrected — it overrides shooting stat lines, not point totals directly. No broken references, ghost calculations, or duplicate logic found across UI/data files.</div>
        <span class="learning-tag model">Code Quality</span><span class="learning-tag milestone">Phase 22</span>
      </div>

      <div class="learning-entry">
        <div class="learning-phase">Phase 22 — G2 Per-Player Outlook Extension</div>
        <div class="learning-title">g2PlayerOutlook Extended to All 5 Remaining G2 Series</div>
        <div class="learning-body">The per-player outlook system (originally built for G3 across 3 series) was extended to cover all 5 remaining G2 matchups: <strong>HOU-LAL, OKC-PHX, SAS-POR, DET-ORL, BOS-PHI</strong>. Each series now has a <code>g2PlayerOutlook</code> block with home and away arrays (6-7 players per side), using the same structure as g3PlayerOutlook.
        <br><br><strong>Methodology — Bayesian FG% Regression:</strong> Each player's G2 projected FG% uses a <strong>55% model / 45% prior</strong> Bayesian blend, where "model" = G1 actual FG% and "prior" = season average FG%. This naturally regresses overperformers down and bounces underperformers up.
        <br><br><strong>Key regression examples:</strong>
        <br>• Kennard (LAL): 69.2% G1 → 44% proj ("bad" — HOU will scheme against him)
        <br>• SGA (OKC): 27.8% G1 → 46% proj ("good" — major bounce-back expected)
        <br>• Wemby (SAS): 61.9% G1 → 52% proj ("good" — 3PT regression but midrange holds)
        <br>• WCJ (ORL): 88.9% G1 → 55% proj ("neutral" — extreme outlier regression)
        <br>• Cade (DET): 48.1% G1 → 46% proj ("good" — All-Star sustains efficiency)
        <br><br><strong>Impact on bets:</strong> G2 bets recalibrated — BOS-PHI margin +8→+12, OKC-PHX +9→+13, Cade parlay line bumped O20.5→O27.5.</div>
        <span class="learning-tag model">Engine Extension</span><span class="learning-tag data">G2 Outlook</span><span class="learning-tag milestone">Phase 22</span>
      </div>

      <div class="learning-entry">
        <div class="learning-phase">Phase 23 — Injury/Fatigue G2 Update</div>
        <div class="learning-title">Live Injury Reports + ESPN Odds Integrated for Today's G2 Games</div>
        <div class="learning-body">CBS Sports injury report (Apr 21) and ESPN live odds cross-referenced to adjust G2 projections for today's 3 games: <strong>BOS-PHI, SAS-POR, HOU-LAL</strong>.
        <br><br><strong>Key findings:</strong>
        <br>• <strong>KD (HOU) likely returns:</strong> CBS target date = Apr 21 (today). ESPN line moved HOU -4.5→-5.5 confirming market expectation. Model upgraded HOU from +2 (COIN FLIP) to +6 (COMPETITIVE). KD outlook upgraded "neutral"→"neutral-good" (medium confidence).
        <br>• <strong>Tatum Achilles recovery:</strong> NBA.com headline flags workload management. Not on injury report but minutes cap ~30-32min expected. FG% dipped 0.48→0.47, model margin 12→11. Brown UPGRADED to 26.8pts (absorbs Tatum-rest touches).
        <br>• <strong>LeBron fatigue:</strong> Age 41, 2-day turnaround from high-usage G1 (13ast). FG% dipped 0.54→0.52. Assist proj dipped 10.3→9.8.
        <br>• <strong>LAL still decimated:</strong> Luka (hamstring, May 1) + Reaves (oblique, May 1) both OUT. Confirmed already missing in G1.
        <br>• <strong>Wemby DPOY:</strong> Announced today — momentum/confidence boost for SAS.
        <br>• <strong>BOS-PHI spread FLIPPED:</strong> Model +11 vs market -14.5 = 3.5pt gap → changed from BOS -14.5 to PHI +14.5 (value shifted to dog).
        <br><br><strong>Methodology:</strong> First integration of real-time injury data + live market odds into the model. Validated approach: when model and market disagree significantly (HOU-LAL), the injury report explains the gap (KD return).</div>
        <span class="learning-tag data">Injury Data</span><span class="learning-tag model">Live Odds</span><span class="learning-tag milestone">Phase 23</span>
      </div>

      <!-- Phase 24 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 24 — Turnover Modeling & Foul Trouble Probability</div>
        <div class="learning-title">Deep Research: Career Playoff Game Logs + 2026 TOV/PF Analysis</div>
        <div class="learning-body">Comprehensive turnover and foul trouble modeling based on Basketball Reference career playoff game logs (LeBron 293g, Jokic 96g, Edwards 44g, Mitchell 69g) plus 2026 playoff per-game stats for all 182 players.
        <br><br><strong>Turnover Model:</strong>
        <br>• Each turnover differential ≈ <strong>1.07 points</strong> (based on transition + possession value)
        <br>• <strong>OKC has the best ball security</strong> in the 2026 playoffs: 7.2% TOV rate (8 TOV/game). PHX worst matchup opponent at 17.3%.
        <br>• <strong>LAL's 20.5% TOV rate</strong> is the worst in the playoffs — costs them ~7.3 pts/game vs HOU. Won G1 DESPITE 20 turnovers.
        <br>• <strong>CLE's turnover forcing</strong> is their biggest weapon: TOR averaging 20 TOV/game (18 G1, 22 G2) → 22+ CLE transition points per game. Barnes at 4.5 TOV/game (worst individual rate).
        <br>• <strong>Pressure Multiplier</strong>: Stars' playoff TOV rates compared to regular season. Jokic +18% in playoffs, Edwards +25% in elimination games.
        <br><br><strong>Foul Trouble Model:</strong>
        <br>• <strong>MIN has the highest team PF rate</strong>: 27.5/game. Gobert (5 fouls G2), McDaniels (4.5/g), KAT (4.5/g) all at risk.
        <br>• <strong>Gobert foul trouble = catastrophic</strong>: MIN's DRtg is 7.9 pts/100 worse without him. DEN specifically targets him in P&R.
        <br>• <strong>Suggs fouled out G1</strong> (6 PF) — ORL's perimeter D collapses without him. DET should attack this.
        <br>• <strong>Sengun 5 PF in G1</strong> — Smart's physical D draws fouls. If Sengun gets 2 early, HOU's offense flatlines.
        <br>• <strong>LeBron's foul discipline is elite</strong>: Only 2 games with 6 PF in 293 career playoff games (0.7%).
        <br><br><strong>Historical Patterns:</strong>
        <br>• Jokic: 5+ TOV in games → DEN is 5-12. His TOV rate spikes in high-pressure moments (8 TOV vs OKC G3 2025).
        <br>• Edwards: 4+ TOV → MIN is 3-6. Elimination game TOV average: 4.2 (vs 2.7 career).
        <br>• LeBron at 41: shifted to facilitator role = LOWER TOV rate (2.0 in G1 vs 3.58 career). Age is actually helping ball security.
        <br><br><strong>Model Integration:</strong> Added TURNOVER_FOUL_DATA object to series-data.js with per-series TOV differentials, individual risk profiles, foul-out probabilities, and DRtg degradation estimates.</div>
        <span class="learning-tag data">Research</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 24</span>
      </div>

      <!-- Phase 25 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 25 — 3-Point Variance & Regression Model</div>
        <div class="learning-body">
        <strong>Research:</strong> Built a comprehensive 3PT variance model using Basketball Reference 2026 Playoffs data (all 16 teams, 182 players) compared against 2025-26 regular season shooting baselines. Incorporated regression methodology from sports analytics research on Bayesian shooting expectation and shot-quality filtering.
        <br><br><strong>Key Findings:</strong>
        <br>• 3PT shooting is the single most volatile stat in the NBA — teams can swing ±10% over 1-5 game stretches
        <br>• Role-player inflation is the strongest regression signal: bench players shooting >15% above career avg revert fastest (Kennard 1.000, Okongwu .667, Wemby .833)
        <br>• Star cold streaks >12% below season avg on 5+ attempts are HIGH CONFIDENCE regression UP candidates (SGA 0/4, Murray .273, Edwards .250, Bane .125)
        <br>• Team extremes: LAL .526 (17% above baseline) and PHI .174 (17.5% below) are the two most extreme cases
        <br><br><strong>Biggest Model Impacts:</strong>
        <br>• HOU-LAL: LAL's .526→~.375 regression = ~4.5 points toward HOU in G2. Combined with KD's return, this flips the spread.
        <br>• SAS-POR: Wemby's .833→~.350 alone is worth ~7 points. POR's .263→~.320 adds ~6 pts. G2 should be 6-8 pts closer.
        <br>• DEN-MIN: DEN (.325 vs .396 RS) has the most 3PT regression upside. Murray's shot falling in G3 = 4-6 extra points.
        <br>• NYK-ATL: Okongwu's .667 from 3 (career sub-.200) is a mirage. When it regresses, ATL loses ~5 pts/game.
        <br><br><strong>Structural vs Variance:</strong> Some suppression is NOT variance — OKC's defensive 3PT suppression (.333 opponent) and BOS's perimeter defense (.174 PHI) are REPEATABLE schematic edges, not random cold shooting.
        <br><br><strong>Model Integration:</strong> Added THREE_POINT_VARIANCE_DATA to series-data.js with per-series Bayesian regression analysis, individual shooter flags, and impact estimates. Added "3PT Variance" tab to Definitions with methodology, team comparisons, individual regression candidates, and structural edges.</div>
        <span class="learning-tag data">Research</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 25</span>
      </div>

      <!-- Phase 26 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 26 — Role Flexibility & Defensive Versatility Model</div>
        <div class="learning-body">
        <strong>Research:</strong> Deep-dive into role flexibility using Chrome-based web research across Basketball Reference (roster/position data for all 16 teams), Google Scholar (Guo et al. 2025 lineup-based versatility quantification, Miller 2018 HHI defensive switching index), Sports Illustrated (playoff versatility trends), and Nylon Calculus (HHI framework). Built a 4-dimension flexibility model grounded in academic research and historical playoff patterns.
        <br><br><strong>Key Findings:</strong>
        <br>• Nylon Calculus HHI framework (2018): Bottom-8 teams in defensive versatility ALL lost in Round 1; Conference Finals teams ranked top-4
        <br>• 4 flexibility dimensions: Switch Defense (30%), Offensive Role Flex (25%), Lineup Options (25%), Positional Versatility (20%)
        <br>• OKC (9.2) dominates — SGA/Dort/Chet/Jalen Williams all guard 3+ positions; PHX (4.5) and POR (4.0) are rigid
        <br>• PHI (3.5) is the least flexible team — Embiid-dependent with no switchable wings; BOS (8.5) exploits this with 5-out versatility
        <br>• Historical: Teams with ≥2.0 flexibility differential win series 78% of the time in playoffs since 2018
        <br><br><strong>Biggest Model Impacts:</strong>
        <br>• OKC-PHX: 4.7pt differential (9.2 vs 4.5) → +1.9pt adjustment for OKC. PHX can't switch and OKC hunts mismatches.
        <br>• BOS-PHI: 5.0pt differential (8.5 vs 3.5) → +2.0pt adjustment for BOS. PHI's rigid defense gets carved by BOS's 5-out attack.
        <br>• CLE-TOR: 2.5pt differential (8.0 vs 5.5) → +1.0pt adjustment for CLE. Mobley/Allen switch everything; TOR is guard-heavy.
        <br>• HOU-LAL: 2.2pt differential (7.2 vs 5.0) → +0.9pt for HOU. Ime's switching scheme exploits LAL's aging roster.
        <br><br><strong>Model Integration:</strong> Added ROLE_FLEXIBILITY_DATA to series-data.js with per-series 4-dimension scores, key flex players, small/big lineup options, and historical notes. Added Step 5d to projection engine: (homeFlex - awayFlex) × 0.4, capped ±3.0pts, applied G2+. Added "Role Flexibility" tab to Definitions with methodology, rankings, player profiles, and series differentials.</div>
        <span class="learning-tag data">Research</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 26</span>
      </div>

      <!-- Phase 30 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 30 — G2 Results Integration & Engine Hardening</div>
        <div class="learning-body">
        <strong>Trigger:</strong> BOS-PHI G2 upset (PHI 111-97) and SAS-POR G2 upset (POR 106-103) revealed two systematic model gaps in how blowout momentum and youth breakout persistence are handled.
        <br><br><strong>Key Findings:</strong>
        <br>• <strong>Blowout Momentum Overweighted:</strong> BOS won G1 by 32 points. Model carried too much momentum into G2, projecting BOS 109-103. PHI won by 14. The missing factor: Nurse (adjustmentRating 8) is an elite adjustment coach — the model treated all coaches equally when applying blowout regression.
        <br>• <strong>Youth Breakout Not Persisting:</strong> Edgecombe scored 18pts in G1 (breakout), then 30pts in G2. Henderson had similar trajectory (18→31). Single-game breakout multipliers reset each game rather than accumulating evidence across consecutive breakout games.
        <br>• <strong>SAS-POR Coaching Adjustments:</strong> Splitter's adjustments after G1 blowout were neutralized by Chauncey Billups (adj 6). POR won despite being 13-pt underdogs. Model overweighted G1 margin of 13.
        <br><br><strong>Two Engine Upgrades:</strong>
        <br>1. <strong>Youth Breakout Momentum Persistence (Phase 29):</strong> For players ≤23 with usage ≥18%, the engine now scans ALL prior games for consecutive breakout performances. Multi-game breakouts get a more aggressive Bayesian blend (30% model / 25% actual / 45% ceiling) with reduced regression (25% of normal vs 40%). Evidence: Henderson G1→G2, Edgecombe G2.
        <br>2. <strong>Coaching Adjustment Discount on Blowout Momentum (Phase 30):</strong> Blowout regression (Step 7b Factor B) now scales with the losing coach's adjustmentRating. Coaches rated ≥7 amplify regression by 10-30% (adj7=+10%, adj8=+20%, adj9=+30%). Caps prevent over-correction (50% max for massive blowouts, 40% for solid wins). Evidence: Nurse (adj 8) transformed PHI offense between games.</div>
        <span class="learning-tag data">G2 Results</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 30</span>
      </div>

      <!-- Phase 31 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 31 — Research Anchor Blend & Data Integrity Audit</div>
        <div class="learning-body">
        <strong>Trigger:</strong> LeBron projected at 35pts in HOU-LAL G3 box score despite g3PlayerOutlook ptsRange of [20,28]. Root cause: the projection engine completely ignored ptsRange — it only read the "outlook" string for a flat percentage boost (+12% for "good", -8% for "bad"). The ptsRange field was decorative. Additionally, a full data integrity audit caught SGA's G1 scoring listed as 33pts and 36pts in bets.js while the actual box score shows 25pts.
        <br><br><strong>Three Engine Upgrades:</strong>
        <br>1. <strong>Research Anchor Blend (Phase 31a):</strong> When g[N]PlayerOutlook has ptsRange, the engine now blends 60-70% research midpoint with 30-40% engine projection (high-confidence research gets 70%). This replaces the old flat percentage system. Formula: <code>projPts = rMid * researchWeight + projPts * engineWeight</code>, then hard-clamp to [ptsRange[0] - slack, ptsRange[1] + slack] where slack = 10% of range width.
        <br>2. <strong>Normalization Cap with Research Range (Phase 31b):</strong> Post-normalization now uses ptsRange[1] + 10% slack as the per-player cap instead of max(ppg*1.35, prior actual, 38). This prevents normalization from pushing players above their research-backed ceiling. For LeBron with ptsRange [20,28]: new cap = 30.8 vs old cap = 38.
        <br>3. <strong>Outlook Key Deduplication (Phase 31c):</strong> The lookup key <code>'g' + (gameIdx+1) + 'PlayerOutlook'</code> was computed in 3 separate places within projectTeam() with 3 different variable names. Consolidated to single team-scoped variable <code>teamPlayerOutlooks</code>.
        <br><br><strong>Data Integrity Fixes:</strong>
        <br>• SGA G1 scoring reconciled to 25pts (box score: 5-18 FG, 0-4 3PT, 15-17 FT = 25pts). Fixed 3 inconsistent references (33pts, 36pts) in bets.js.
        <br>• G1 bet record corrected: SGA Over 28.5 marked ✗ (was ✓). Overall G1 record: 8/13 (61.5%), down from 9/13 (69.2%).
        <br>• Stale "Today's G2 Games — Tue Apr 21" label fixed to "Completed."
        <br>• g3PlayerOutlook added for OKC-PHX, SAS-POR, and DET-ORL (previously only 5/8 series had them).
        <br>• HOU-LAL g3PlayerOutlook corrected: LeBron ptsRange [24,32]→[20,28], Smart [16,24]→[14,22], Kennard [16,24]→[14,22] with road regression adjustments.
        <br><br><strong>Featured Parlays Overhaul:</strong>
        <br>• Rebuilt Featured Parlays tab for Apr 22 games only (OKC-PHX G2 + DET-ORL G2).
        <br>• New $100 Best Bet: SGA O28.5 + Cade O28.5 (~+247).
        <br>• New $1 Chaos Ticket: ORL ML + PHX +17.5 + Banchero O22.5 (~+1450).
        <br>• Added scrollable Parlay History timeline with running P&L tracker (0-1 / 1-0, -$88.97 net).</div>
        <span class="learning-tag bug">Data Fix</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 31</span>
      </div>

      <!-- Phase 32 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 32 — G2 Upset Analysis: Five New Prediction Factors</div>
        <div class="learning-body">
        <strong>Trigger:</strong> G1 winner picks were 75% correct (6/8), but G2 picks dropped to 33% (2/6). Multiple series now tied 1-1 that were predicted as sweeps. Systematic audit revealed 5 missing factors.
        <br><br><strong>Coaching Staffs Verified (Critical Fix):</strong> NYK coach is <strong>Mike Brown</strong> (not Thibodeau — fired 2025). All 16 staffs confirmed: Daigneault (OKC), Johnson (SAS), Adelman (DEN), Redick (LAL), Udoka (HOU), Finch (MIN), Splitter interim (POR — Billups arrested), Ott (PHX), Bickerstaff (DET), Mazzulla (BOS), Brown (NYK), Snyder (ATL), Atkinson (CLE), Rajakovic (TOR), Nurse (PHI), Mosley (ORL).
        <br><br><strong>Five New Engine Factors:</strong>
        <br>1. <strong>Coaching Adjustment Quality (CAQ) — Step 7 upgrade:</strong> Replaced single adjustmentRating with blended CAQ score: 50% adjustmentRating + 30% schemeCreativity + 20% urgency. Evidence: Nurse (PHI) schemeCreativity=9 redesigned offense between G1-G2, moved Maxey off-ball, elevated Edgecombe → PHI won by 14 after losing G1 by 32. Snyder (ATL) schemeCreativity=9 unlocked Kuminga, CJ McCollum scored 32 with go-ahead bucket at 34 seconds. Mazzulla (BOS) schemeCreativity=5 "didn't make enough adjustments" per Boston Globe. Formula: <code>adjustmentRate = 0.15 + (caqScore/10) * 0.18</code> (15-33% per game vs old 15-30%).
        <br>2. <strong>Initiator Count Differential (IC) — Step 5g:</strong> Teams with 3+ independent shot creators have higher offensive floors. Evidence: ORL beat DET G1 with 5 players 16+ pts vs Cade-only (39pts, nobody else). HOU iso-heavy offense (Udoka: "stagnant") lost both to LAL's committee (4 in double figures). Formula: <code>(homeIC - awayIC) * 1.0</code>, ±3.0pt cap, applies G2+.
        <br>3. <strong>Scheme Persistence Factor (SPF) — Step 5h:</strong> When G1 FG% suppression is scheme-driven (not variance), it persists at ~70% effectiveness. Evidence: LAL zone held HOU to 37.6% G1 → 40.4% G2 (persistent). Gobert held Jokic 1-of-8 individually (structural assignment). Spoelstra's "Giannis Wall" 2023 persisted entire series (21ppg). BOS shot 26% 3PT in G2 after PHI schemed denial. New data field: <code>series.schemePersistence</code> with isSchemeDriven flag and fgSuppression value.
        <br>4. <strong>Star Absence Recalibration — Steps 5i/5j:</strong> Two components: (a) Role player redistribution — when stars are out, remaining players get more shots and designed plays (Kennard 27pts G1, 23pts G2 with Luka/Reaves out). Deep benches (4+ players rated 65+) claw back 35% of star absence penalty. (b) Star return penalty — players returning mid-series from injury underperform (KD returned G2: 23pts but 9 TOs, 3pts after halftime). New data: <code>series.starReturnPenalty</code>.
        <br>5. <strong>Youth Playoff Ceiling Multiplier (YCM) — Enhanced:</strong> Raised default ceiling multipliers (1.30/1.40 from 1.25/1.35). Multi-game streak blend now 25/25/50 (model/actual/ceiling, was 30/25/45). Per-player research-backed overrides via <code>series.youthCeilings</code>. Evidence: Edgecombe 30/10 = first rookie 30/10 since Tim Duncan 1998. Henderson 31pts on 65% FG. Banchero career playoff avg 28.0 vs 22.2 reg season. Cade 39pts (60%+ above 24ppg avg).
        <br><br><strong>Data Added:</strong> schemeCreativity + urgency for all 16 coaching blocks. schemePersistence for 5 series (HOU-LAL, OKC-PHX, DEN-MIN, DET-ORL, BOS-PHI). youthCeilings for 3 series (SAS-POR, DET-ORL, BOS-PHI). starReturnPenalty for HOU-LAL (KD).</div>
        <span class="learning-tag research">G2 Audit</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 32</span>
      </div>

      <!-- Phase 34 -->
      <div class="learning-entry">
        <div class="learning-phase">Phase 34 — G2 Results Integration: Overtime Detection, Dual-Mode Stars, Turnover Catastrophe</div>
        <div class="learning-date">Apr 22, 2026</div>
        <div class="learning-body">
          <strong>Three major model upgrades from DET-ORL G2 and OKC-PHX G2 analysis:</strong><br><br>
          <strong>1. Overtime Detection Engine:</strong> When the engine's projected scores round to identical values (margin = 0), the model now interprets this as an OVERTIME projection rather than an arbitrary tie-break. The game character changes to "OVERTIME" and the margin range reads "Team in OT (regulation dead even)". First application: DET-ORL G3 projected as overtime (DET 104-103). This gives bettors a unique edge — when the model projects OT, the game is genuinely a coin flip and alternate-line/OT-specific bets become valuable.<br><br>
          <strong>2. Dual-Mode Star Detection:</strong> Cade Cunningham's G1→G2 evolution (39pts scorer → 27pts/11ast distributor) revealed a new model concept: stars who can switch between scoring and playmaking modes create unsolvable defensive problems. The model now tracks this through the player outlook system — "dual-mode" stars get higher confidence in their projections because defensive schemes can't prepare for both modes simultaneously. Similar: SGA's G1→G2 bounce-back (25pts/27.8% → 37pts/52%/9ast) confirms elite stars adapt across games.<br><br>
          <strong>3. Turnover Catastrophe Factor:</strong> PHX's 21 turnovers in G2 (OKC had 14 steals) was the game's defining stat. When a team commits 20+ turnovers against an elite defensive team, the model now flags this as a STRUCTURAL problem (not variance) that compounds across the series. Individual player TO counts (Green 7, Booker 5) are tracked in player outlooks — players with 5+ TOs get downgraded outlook ratings.<br><br>
          <strong>4. ptsRange [0,0] Exclusion (Phase 33):</strong> When a player's outlook has ptsRange [0,0], they are confirmed OUT and excluded from the projected box score. First application: Wemby (concussion protocol) excluded from SAS-POR G3 projections. Minutes and scoring redistribute naturally to remaining teammates.<br><br>
          <strong>Model performance:</strong> G2 betting record improved to 6/11 (54.5%). Best calls: OKC ML (exact +13 margin match), SGA O28.5 (37pts, cleared by 8.5), DET ML (98-83 blowout), Cade O7.5ast (11ast). Key miss: Brooks projected "bad" but scored 30pts — upgraded to "neutral" for G3.
        </div>
        <span class="learning-tag research">G2 Analysis</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 34</span>
      </div>

      <!-- Phase 35 -->
      <div class="learning-entry">
        <div class="learning-phase">Phase 35 — G3 Analysis: First-Home-Game Boost, Talent-Gap Scaling, Youth Fatigue</div>
        <div class="learning-date">Apr 27, 2026</div>
        <div class="learning-body">
          <strong>Deep game-by-game analysis of all 8 G3 games revealed the model's biggest systematic error and produced 5 new concepts:</strong><br><br>
          <strong>G3 ML Record: 1/6 (16.7%) — worst round of the playoffs.</strong> The model picked the road favorite in 5/6 games and lost all 5. Only correct pick was BOS over PHI (2pt margin miss). After implementing Phase 35 changes, the G4 engine improved to 5/8 (62.5%).<br><br>
          <strong>1. First-Home-Game Boost (Talent-Gap Scaled):</strong> All 3 Thu Apr 23 home teams won their first home game (ATL +1, TOR +22, MIN +17). However, BOS beat PHI, LAL beat HOU in OT, and SAS beat POR despite those teams' first home games. Pattern: the boost reliably creates strong Q1-Q2 energy but doesn't override massive talent gaps. Implementation: +1.2% scoring boost for first home game, halved to +0.5% when facing a team with a transcendent star (rating &ge; 88). Low seeds (7-8) get an additional -0.4% penalty for second-half fatigue.<br><br>
          <strong>2. Star Absence &ne; Pure Subtraction:</strong> SAS won G3 120-108 WITHOUT Wembanyama (concussion). Castle scored 33pts career-high, Harper had 27/10. In deep teams, removing the alpha star can LIBERATE secondary players who get more touches and confidence. The model's ptsRange [0,0] exclusion correctly redistributes minutes but underestimates the quality of absorption.<br><br>
          <strong>3. Second-Half Youth Fatigue:</strong> POR scored 65 in H1 but only 43 in H2 against SAS. Young/low-seed teams build adrenaline-fueled leads early but can't sustain playoff intensity for 48 minutes. The model now penalizes low-seed teams (-0.4%) in first-home-game scenarios to account for this fade.<br><br>
          <strong>4. Road Turnover Volatility:</strong> CLE had 22 turnovers at Toronto (Harden 8 TOs). Teams visiting a hostile building for the first time see TO rates spike 30-50%. High-usage ball handlers are especially vulnerable to crowd noise disrupting their decision-making.<br><br>
          <strong>5. Veteran Clutch Override:</strong> LeBron (41yo, 45min) hit a steal+tying 3 with 13sec left to force OT. Smart drew a 3-FT foul down 6 with 25sec left. The model's age/fatigue penalties don't apply to transcendent veterans with 15+ years of playoff experience in crunch-time scenarios. McCollum's series-long clutch closing (game-winners in G2 and G3) confirms veteran closers need a premium.<br><br>
          <strong>3PT Regression Validated:</strong> BOS-PHI G3 was the model's best prediction (BOS +6, actual +8). PHI's 48.7% 3PT from G2 dropped to 34.3%, BOS's 26% bounced to 42.6%. The 3PT regression framework remains the model's strongest predictive tool.
        </div>
        <span class="learning-tag research">G3 Deep Dive</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 35</span>
      </div>

      <!-- Phase 36 -->
      <div class="learning-entry">
        <div class="learning-phase">Phase 36 — G3/G4 Deep Dive: Scheme Suppression Override, Nuclear Games, Coaching Counters</div>
        <div class="learning-date">Apr 27, 2026</div>
        <div class="learning-body">
          <strong>Games 7-10 analysis (Sat Apr 25 slate) revealed 5 additional model concepts:</strong><br><br>
          <strong>1. Scheme-Driven 3PT Suppression COMPOUNDS (Engine Fix):</strong> DEN shot 39.6% 3PT regular season but 22-30% across 4 games vs MIN. The model kept predicting regression UP toward the mean, but it never came because MIN's defense specifically removes DEN's 3PT looks. Implementation: when schemePersistence is active, the regression weight toward regular-season mean is halved. This prevents the model from incorrectly projecting bounce-back for teams under sustained defensive scheme pressure.<br><br>
          <strong>2. Nuclear Game Probability:</strong> SGA scored 42pts on 15-18 FG (83.3%) in G3 — an efficiency level no statistical model can predict. MVP-caliber players have a ~10-15% probability of "nuclear games" where everything goes in. The model should acknowledge this tail risk rather than capping projections. When it happens, margin projections become irrelevant.<br><br>
          <strong>3. Coaching Counter Decay on Clutch Closers:</strong> McCollum hit game-winners in G2 and G3, but Brown's G4 defensive adjustment held him to 17pts and 0 made 3s. Veteran closers' clutch premium decays as the opposing coach accumulates film. By G4, the counter-scheme is typically in place. The model should reduce the "clutch closer premium" by ~30% per game after the initial breakout.<br><br>
          <strong>4. Engine > Manual Overrides for G4+ Games:</strong> The engine predicted NYK +4 for NYK-ATL G4 (actual: NYK +16). The manual pick was ATL based on McCollum's G3 momentum. The engine's structural talent assessment was correct while the narrative-based manual override was wrong. Lesson: for G4+ games where the engine has 3+ data points, trust the structural analysis over momentum/narrative.<br><br>
          <strong>5. Multi-Star Absence Liberation (Extreme):</strong> MIN won G4 by 16 WITHOUT both Edwards AND DiVincenzo. Dosunmu scored 43pts — highest playoff reserve performance in 50 years. When multiple stars are absent from a deep team, the redistribution can produce performances that exceed ANY individual's career ceiling. The model should project elevated ceilings for replacement players, not just redistributed minutes.<br><br>
          <strong>Running G3/G4 record after Phase 35-36 updates:</strong> G3 picks: 1/8 (12.5%). G4 picks: 5/8 (62.5%) with engine. The model improved dramatically between G3 and G4 — the first-home-game boost and talent-gap scaling were the key corrections.
        </div>
        <span class="learning-tag research">G3/G4 Deep Dive</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 36</span>
      </div>

      <!-- Phase 37 -->
      <div class="learning-entry">
        <div class="learning-phase">Phase 37 — Series Scoring Context, Score Range Bands, Macro Playoff Analysis</div>
        <div class="learning-date">Apr 28, 2026</div>
        <div class="learning-body">
          <strong>Engine score diversity fix + macro-level playoff insights from ESPN/The Athletic/Ringer analysis:</strong><br><br>
          <strong>1. Series Scoring Context Adjustment (Engine Fix):</strong> The engine projected all scores in a narrow 98-116 range while actual games spanned 83-131. Root cause: regular-season ORtg/DRtg produces average-seeking projections. Fix: blend projected scores with the series' actual scoring average. Low-scoring series (DET-ORL avg ~95ppg) now project lower, high-scoring series (OKC-PHX avg ~115ppg) project higher. Uses progressive weighting: G2 40% series data, G4+ 60% series data.<br><br>
          <strong>2. Scoring Range Bands:</strong> Every projection now includes &plusmn;12% variance bands showing realistic score ranges (e.g., DET 89-113 instead of just "DET 101"). This captures the reality that shooting variance can produce 32.6% FG nights (ORL G4) or 50% 3PT nights (OKC G4). The point estimate is the expected value; the range shows what's plausible.<br><br>
          <strong>3. Macro Playoff Insight — Historic Parity:</strong> ESPN noted "15 of 16 teams have won at least one game" — the most competitive first round in recent memory. Five underdogs have multiple wins. This validates our Phase 35 finding that the model's regular-season-record bias was too strong. The parity means wider uncertainty bands are appropriate for all remaining predictions.<br><br>
          <strong>4. Injuries Are THE Dominant Narrative:</strong> Nearly every series was shaped by injuries: Edwards (knee), DiVincenzo (ruptured Achilles), KD (ankle, missed 3 of 4 games), Wemby (concussion), Embiid (appendectomy), Wagner (calf), Booker (ankle), Gordon (calf), J.Williams (hamstring). The model's mid-series injury recalculation concept is the single highest-ROI improvement still needed.<br><br>
          <strong>5. OKC Is the Clear R2 Favorite:</strong> 12-0 in R1 over 3 years, swept PHX despite missing J.Williams. Anonymous player poll: OKC 50%, SAS 25.3% championship probability. The model should project OKC as heavy favorites regardless of R2 opponent.
        </div>
        <span class="learning-tag research">Macro Analysis</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 37</span>
      </div>

      <!-- Phase 43 -->
      <div class="learning-entry">
        <div class="learning-phase">Phase 43 — Market Odds Calibration: Model vs. Vegas Reality Check</div>
        <div class="learning-date">Apr 30, 2026</div>
        <div class="learning-body">
          <strong>Calibrated all G6 bets against real DraftKings sportsbook odds (via ESPN). Major finding: our model's ensemble probabilities closely match the market on most games, eliminating the false "value edges" we believed existed. The market is efficient — model edges are smaller than expected.</strong><br><br>
          <strong>1. BIGGEST CORRECTION — CLE ML:</strong> We had CLE ML at +110 (implying CLE was an underdog, 47.6% implied). Real line: CLE -170 (63% implied). Our ensemble gave CLE 64%. So the "16% value edge" was actually a ~1% edge — the market agrees CLE should win. Lesson: never estimate odds. Always check real lines before declaring value.<br><br>
          <strong>2. FAVORITE OVERPRICING:</strong> BOS ML moved from our -170 to real -230 (70% implied vs our 61% model). DEN ML from -160 to -258 (72% implied vs 61%). The market prices these road close-out favorites HIGHER than our ensemble. Our $100 Best Bet parlay dropped from +200 to +136 and is now -EV vs our model. Market sees less uncertainty in these matchups than our model.<br><br>
          <strong>3. PLAYER PROP LINES:</strong> Jokic O/U shifted from our estimated 24.5 to real 29.5 — a massive 5-point gap. Embiid 28.5 → 27.5, McCollum U20.5 → U18.5, Jokic assists 10.5 → 9.5. The market has access to sharper usage data and sets tighter lines. Our Star Elevation Parlay jumped from +650 to +1200 with the harder Jokic line.<br><br>
          <strong>4. TRUE VALUE PLAYS IDENTIFIED:</strong> After odds calibration, the real +EV spots are: LAL ML +150 (12% edge — model 52%, market 40%), ORL ML +136 (7.6% edge on a coin flip), MIN ML +210 (6.7% edge), PHI ML +190 (4.5% edge). Ironically, the value is now in the underdogs — the teams our model likes less than our featured parlays favor. This is a classic market lesson: value often lives on the other side of consensus.<br><br>
          <strong>5. PARLAY RECALCULATIONS:</strong> $100 Best Bet: +200 → +136. $50 Ensemble Edge: +250 → +203. $1 Chaos: +2200 → +1970. Player Props Parlay: +650 → +1200. All parlays use correct DraftKings odds now. Friday game props (DET-ORL, CLE-TOR, HOU-LAL) marked as estimates since lines not yet posted.
        </div>
        <span class="learning-tag data">Market Calibration</span><span class="learning-tag model">Odds Reality</span><span class="learning-tag milestone">Phase 43</span>
      </div>

      <!-- Phase 42 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 42 — Multi-Round Scalability + Projection Lineage</div>
        <div class="learning-date">Apr 30, 2026</div>
        <div class="learning-body">
          <strong>Infrastructure for multi-round playoff progression. The model can now advance winning teams from R1 → R2 → Conference Finals → Finals with full state carryover, and every projection includes a lineage waterfall showing exactly how each factor contributed to the final margin.</strong><br><br>
          <strong>1. ROUND-LEVEL NAVIGATION:</strong> New navigation hierarchy: Playoff Round → Conference → Series → Game Tab. State variable currentPlayoffRound (R1/R2/CF/Finals) controls which round is visible. Tabs only appear when multiple rounds have data. Conference split auto-disabled for Finals (single series).<br><br>
          <strong>2. SERIES GRADUATION:</strong> graduateSeries() builds new series entries from completed round winners. Carries forward cumulative fatigue (age/injury-weighted, compounding by round depth), injury timeline progression (rest days between rounds), and player metadata. Fatigue formula: gamesPlayed × 0.5% × (1 + roundDepth × 0.15) × ageMultiplier × injuryMultiplier. Sweep bonus (+3) and extended-series penalty (-2/-3) auto-generated as external factors.<br><br>
          <strong>3. PROJECTION LINEAGE WATERFALL:</strong> Every calcGameProjection() call now returns a lineage array tracking ~18 steps from base margin through blend. Each step records: {step, label, delta, runningMargin, detail}. The UI renders this as an SVG waterfall chart showing how each factor pushed the margin positive or negative. Users can see exactly why the model projects OKC -8.5 vs OKC -12.0 — was it fatigue? coaching? momentum?<br><br>
          <strong>4. POST-GAME FACTOR ATTRIBUTION:</strong> buildGameAttribution() runs the lineage backward after a game completes. Distributes the total prediction error proportionally across factors (weight = |delta| / totalAbsDelta). Identifies top error sources and auto-generates model lessons. Example: "Fatigue over-corrected by ~1.7 pts" tells us the fatigue factor was too aggressive for that matchup.<br><br>
          <strong>5. LOCALSTORAGE V3:</strong> Persistence migrated from array-index keyed (V2) to series-ID keyed (V3). This survives R2 series being added to SERIES_DATA without corrupting saved game results. Backward-compatible auto-migration from V2.
        </div>
        <span class="learning-tag model">Scalability</span><span class="learning-tag data">Lineage</span><span class="learning-tag milestone">Phase 42</span>
      </div>

      <!-- Phase 41 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 41 — Unified Ensemble: Blended Model + Chaos Sim Aligned</div>
        <div class="learning-date">Apr 30, 2026</div>
        <div class="learning-body">
          <strong>All three prediction systems (manual picks, deterministic engine, Monte Carlo chaos sim) unified into a single ensemble. Previously, the sim used the raw engine projection as its baseline, causing 3/6 G6 picks to disagree with the blended model's winner. Now the sim uses the BLENDED projection (which incorporates manual pick winners at 72.7% accuracy + engine margin sizing at 8.8 error). Result: 5/6 series aligned, 1 genuine coin flip.</strong><br><br>
          <strong>1. THE ALIGNMENT PROBLEM:</strong> Phase 40 built a powerful chaos simulation but ran it on a different baseline than the displayed predictions. The blended system (Phase 27) used manual picks for winner calls; the sim used raw engine projections. When they disagreed (DEN-MIN, HOU-LAL, DET-ORL), the sim and bets page showed conflicting information — confusing and undermining confidence in both systems.<br><br>
          <strong>2. THE FIX — UNIFIED BASELINE:</strong> Changed simulation.js to call calcBlendedProjection() instead of calcGameProjection(). The sim now generates its probability distribution around the same baseline the UI displays. The blended system's winner call (72.7% accurate) becomes the sim's center point, and the chaos engine measures how uncertain we should be about that call.<br><br>
          <strong>3. DISAGREEMENT VARIANCE SCALING:</strong> When the engine and manual pick disagree on the winner (consensus: "disagree"), the chaos variance widens 20% (quarterScoreSD × 1.20, shootingSwingMax × 1.15). This is honest — disagreement signals genuine uncertainty, so the sim should produce a flatter probability distribution. When both agree (consensus: "strong-agree"), variance tightens 5%.<br><br>
          <strong>4. RESULTS:</strong> BOS 61% ✓, NYK 61% ✓, DEN 61% ✓, HOU 55% ✓, CLE 64% ✓ — all aligned with blended picks. DET-ORL is a genuine 50.6/49.4 coin flip (blended margin just 1 point with "disagree" consensus). Avg margin SD = 11.6 (target 11.5) — calibration maintained.<br><br>
          <strong>5. BET IMPLICATIONS:</strong> Three picks flipped: DEN-MIN (now DEN ML, Edwards OUT), HOU-LAL (now HOU ML, momentum + value at +180), DET-ORL (now SKIP ML — coin flip overpriced at -180). CLE ML was initially estimated at +110 (later corrected to -170 in Phase 43 odds calibration — market agreed with our 64% probability). The ensemble eliminates internal contradictions — every bet now reflects all three systems\' consensus.
        </div>
        <span class="learning-tag model">Ensemble</span><span class="learning-tag data">Unified Baseline</span><span class="learning-tag milestone">Phase 41</span>
      </div>

      <!-- Phase 40 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 40 — Monte Carlo Chaos Simulation: Interdependent Quarter-by-Quarter Model</div>
        <div class="learning-date">Apr 30, 2026</div>
        <div class="learning-body">
          <strong>1,000-iteration Monte Carlo simulation engine built. Quarter-by-quarter model with interdependent chaos factors. Calibrated to ATS margin SD = 11.3 (target: 11.5). Backtest: 56.4% winner accuracy, 11.6 avg margin error across 39 completed games.</strong><br><br>
          <strong>1. ARCHITECTURE — PERTURBATION MODEL:</strong> Engine's deterministic projection serves as the baseline. Each simulation iteration draws correlated chaos factors that shift the outcome through interconnected channels. Quarter state carries forward: Q1 foul trouble → Q2 passive defense → Q3 opponent momentum run → Q4 clutch pressure. Nothing is independent.<br><br>
          <strong>2. TEAM SHOOTING TEMPERATURE:</strong> One draw per team per game determines if the whole team is hot or cold. Each SD of shooting temperature = ~3 points (8% 3PT swing × 35 attempts × 3pts). This single variable explains the bulk of game-to-game variance. Within-quarter correlation creates realistic "whole team is cold" quarters like BOS's 3-22 Q4 in G5.<br><br>
          <strong>3. MOMENTUM & SCORING RUNS:</strong> 15% chance per quarter of a significant run. Runs are triggered by shooting state + opponent weakness (bench mode from foul trouble). Timeouts halt 66% of runs (Weimer et al. 2023). Counter-runs occur 35% of the time after timeouts. Momentum decays 40% per quarter if unrefueled.<br><br>
          <strong>4. FOUL TROUBLE CASCADE:</strong> 8% chance per team of key player getting 2 early fouls. 67% coaches bench them. Bench mode reduces team scoring and weakens defense, which feeds the opponent's momentum. Player returns Q2 but plays passively — lingering effect.<br><br>
          <strong>5. FATIGUE DECAY:</strong> Scoring drops Q3 (-0.7 pts) and Q4 (-1.8 pts). Veteran teams (playoff ascension stars) resist 30% of clutch penalty. Fatigue compounds across series (0.5 pts per game past G4). Fatigued teams turn ball over more, feeding opponent scoring.<br><br>
          <strong>6. CLUTCH PRESSURE:</strong> In close games entering Q4 (within ~24 pts total), both teams' scoring drops. 25% chance of a "clutch hero" performance (+2-5 pts for one team). Veteran bonus partially offsets the pressure.<br><br>
          <strong>7. CALIBRATION:</strong> Margin SD = 11.3 (target 11.5). Blowout rate = 14-15% (real: ~15%). Close game rate = 30-32%. OT rate = 2-4%. Garbage time compression reduces margins 20% at 20+ pt leads. The simulation produces realistic score distributions.
        </div>
        <span class="learning-tag model">Monte Carlo</span><span class="learning-tag data">Chaos Simulation</span><span class="learning-tag milestone">Phase 40</span>
      </div>

      <!-- Phase 39 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 39 — G5 Wed Results: Superstar Dueling, FT-Rate Efficiency, Turnover Regression</div>
        <div class="learning-date">Apr 29, 2026</div>
        <div class="learning-body">
          <strong>Wed Apr 29 G5 results analyzed. Model went 3/4 on Wed engine picks (missed HOU-LAL). G5 overall record: 5/7 (71.4%). Elimination game dynamics remain strongest domain.</strong><br><br>
          <strong>1. DET-ORL G5 — HISTORIC 45-45 DUEL:</strong> First 45-45 dual scoring game in playoff history. Cade Cunningham 45pts and Paolo Banchero 45/9/7. Wagner DNP (calf) elevated Banchero into full carry mode — Star Absence Liberation working in reverse (opponent's star absence forces remaining star to shoulder entire load). DET won 116-109. ORL leads 3-2. Model picked DET medium — CORRECT.<br><br>
          <strong>2. CLE-TOR G5 — SHOOTING REGRESSION NORMALIZATION:</strong> After G4's historic shooting nightmare (CLE 37% FG / TOR 32% FG), both teams shot normally in G5. CLE 125, TOR 120. Harden 23/9reb orchestrated CLE's offense. Barrett 25/12reb carried TOR. The decisive factor: CLE won Q4 25-17 via defensive tightening — closing ability separates playoff teams. CLE leads 3-2. Model picked CLE medium — CORRECT.<br><br>
          <strong>3. DEN-MIN G5 — JOKIC ELIMINATION TRIPLE-DOUBLE:</strong> Jokic 27pts/16ast/12reb — elimination game unlocked peak playmaking mode. Spencer Jones scored 20pts, proving Star Absence Liberation (Gordon/Watson OUT). MIN committed 25 turnovers without Edwards/DiVincenzo — Turnover Catastrophe Factor validated again when missing primary ball-handlers. DEN 125, MIN 113. MIN leads 3-2. Model engine picked DEN — CORRECT.<br><br>
          <strong>4. HOU-LAL G5 — REAVES RETURN INEFFICIENCY:</strong> HOU 99, LAL 93. Model picked LAL — WRONG. Reaves returned from oblique injury (22pts but 4-16 FG, 12-13 FT — volume via fouls not shooting). LeBron 25pts but 0-6 3PT — 3PT regression at age 41. Smart had 6 TOs — Turnover Catastrophe without Luka as primary initiator. HOU's depth prevailed: Smith Jr 22, Eason 18, Sengun 14/9/8. LAL leads 3-2.<br><br>
          <strong>5. MODEL PERFORMANCE:</strong> G5 engine record: 5/7 (71.4%) across Tue+Wed. Elimination game dynamics (EGSE, CPI) remain the model's strongest domain. The engine correctly identified DET, CLE, and DEN as G5 winners. Misses: BOS-PHI G5 (Tue) and HOU-LAL G5 (Wed). Key lesson: returning-from-injury players need a rust discount on efficiency, and teams missing their primary initiator (LAL without Luka) suffer compounding turnover issues.
        </div>
        <span class="learning-tag data">G5 Results</span><span class="learning-tag model">Elimination Dynamics</span><span class="learning-tag milestone">Phase 39</span>
      </div>

      <!-- Phase 38 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 38 — G5 Deep Analysis: Elimination Heroics, Closeout Pressure, Star Elevation</div>
        <div class="learning-date">Apr 29, 2026</div>
        <div class="learning-body">
          <strong>G5 results analyzed game-by-game with full box score comparison. Model went 1/2 on G5 picks (SAS correct, BOS wrong). Three new behavioral concepts identified.</strong><br><br>
          <strong>1. BOS-PHI G5 — MASSIVE MODEL MISS:</strong> Model predicted BOS 118-101 closeout; actual PHI 113-97 (33pt swing). Embiid erupted for 33pts after just 2pts in Q1 (1-6 FG → 13/10/8 in Q2-Q4). Maxey 25/10reb/5ast. BOS collapsed: 10pts in Q4 on 3-22 FG (13.6%). PHI shot 50% FG, BOS just 40%. The model severely underweighted Embiid's elimination-game ceiling and overweighted closeout momentum.<br><br>
          <strong>2. NYK-ATL G5 — BRUNSON MASTERCLASS:</strong> NYK 126-97. Brunson went 39pts (15-23 FG, 65.2%) + 8ast + 1TO in 35min. KAT near triple-double: 16/14reb/6ast. ATL's McCollum collapsed: 6pts on 3-10 with 4 TOs (-14). NYK shot 57% FG/42% 3PT vs ATL's 45%/31%/59% FT. Coaching Counter Decay validated — McCollum's G2-G3 game-winner magic fully countered.<br><br>
          <strong>3. SAS-POR G5 — MODEL NEARLY PERFECT:</strong> Predicted SAS 116-99, actual SAS 114-95. SAS closes series 4-1. Wemby 17/14reb/6blk. Fox 21pts/9ast (13pts Q4 closer). Champagnie 19pts (5-7 3PT). POR's Holiday worst game: 8pts (3-14 FG). Henderson confirmed as one-game spike, not breakout: 31pts G2 → 5pts G5 (17min).<br><br>
          <strong>THREE NEW CONCEPTS IDENTIFIED:</strong><br>
          • <strong>Elimination Game Star Elevation (EGSE):</strong> Facing elimination multiplies star output by 1.2-1.5x above series average. Embiid's G5 explosion (33pts after 2/20/26/19 in G1-G4) is the archetype. The pressure of elimination acts as a performance amplifier for franchise-caliber stars, not a suppressor.<br>
          • <strong>Closeout Pressure Inversion (CPI):</strong> The team trying to close a series often faces EQUAL or GREATER pressure than the elimination team. BOS went from 118pts in G4 to 97pts in G5 — a 21pt drop. The Q4 collapse (3-22 FG) suggests psychological weight of clinching creates tightness, not relaxation.<br>
          • <strong>Home Star Ceiling Games (HSCG):</strong> Elite stars produce ceiling games disproportionately at home. Brunson's 39pts came at MSG. Embiid's 33 came at Wells Fargo. 3PT regression timing correlates with venue — road shooters regress faster. Youth breakout persistence is NOT guaranteed across scheme adjustments (Henderson: 31pts G2 → 5pts G5).
        </div>
        <span class="learning-tag model">Elimination Dynamics</span><span class="learning-tag data">G5 Results</span><span class="learning-tag milestone">Phase 38</span>
      </div>

      <!-- Phase 28 -->
      <div class="learning-entry milestone">
        <div class="learning-phase">Phase 28 — Live Game Analysis & Model Corrections</div>
        <div class="learning-body">
        <strong>Trigger:</strong> BOS-PHI G2 concluded with PHI 111 — BOS 97 upset. Model had projected BOS 109-103. Five specific model failures identified from live mid-game analysis and post-game breakdown.
        <br><br><strong>Key Findings:</strong>
        <br>• <strong>Edgecombe Breakout Miss:</strong> Model projected ~13.5 pts for the 20-year-old rookie; he scored 30 on 12-20 FG (6-10 3PT). Bayesian blend (55% model / 45% G1) couldn't capture a genuine youth breakout.
        <br>• <strong>Team 3PT Correlation Blind Spot:</strong> PHI went from 17.4% 3PT in G1 to 49% in G2. The model treated each shooter independently but team shooting is correlated — when one is hot, the team tends to be hot.
        <br>• <strong>Tatum Ceiling Overstatement:</strong> Model projected ~24pts; Tatum had 19pts on 8-19 with 5 PFs. Recovery volatility from Achilles creates wider variance bands than the model assumed.
        <br>• <strong>Defensive Suppression Misframe:</strong> White on Maxey was modeled as reducing total points (volume + efficiency), but Maxey still took 28 shots — suppression should reduce FG%, not shot attempts.
        <br>• <strong>PHI Initiator Miscount:</strong> Model had PHI at 1 initiator (Maxey only). Edgecombe's 30pts on 20 FGA with 21.2% usage proved he's a second initiator — changes all suppression calculations.
        <br><br><strong>Five Engine Upgrades:</strong>
        <br>1. <strong>Youth Breakout Multiplier:</strong> Players ≤23 with rising usage who outperformed G1 get modified Bayesian blend (40% model / 30% actual / 30% ceiling). Weaker overperformance regression (40% of normal). Prevents model from regressing genuine breakouts.
        <br>2. <strong>Team 3PT Correlation:</strong> Step 5f in calcGameProjection — when a team shot >8pp above/below their season 3PT% baseline, apply 50% regression toward mean. ±3pt cap. Accounts for correlated shooting nights.
        <br>3. <strong>Efficiency Tax Defense:</strong> Defensive suppression (modifier #7) now reduces FG% not volume. D-LEBRON suppresses conversion rate while preserving shot attempts. More accurate for sole initiators who must shoot regardless of matchup.
        <br>4. <strong>Dynamic Initiator Recalculation:</strong> Initiator counts now update from prior game box scores (≥18% pts share + ≥3 assists or ≥25% share). PHI auto-updates from 1→2 after Edgecombe's breakout. Affects all suppression and scheme calculations.
        <br>5. <strong>Recovery Volatility:</strong> Post-major-injury players (Achilles/ACL/surgery) get 2-4% asymmetric downside penalty (modifier #6b). Captures the non-linear recovery curve — a player can be "cleared" but still have wider variance.
        <br><br><strong>Data Update:</strong> BOS-PHI G2 results recorded (PHI 111-97, series tied 1-1). Full box scores with per-player stats. PHI initiators updated 1→2.</div>
        <span class="learning-tag data">Live Analysis</span><span class="learning-tag model">Engine Upgrade</span><span class="learning-tag milestone">Phase 28</span>
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
    'Phase 16': 'Fatigue monitor upgraded to medium confidence',
    'Phase 17': 'Google Scholar research — 16 papers, 7 model changes',
    'Phase 20': 'G2 differentiation engine — momentum, regression, coaching compression',
    'Phase 21': 'CLE-TOR G2 results — margin prediction validated (+11 proj vs +10 actual)',
    'Phase 22': 'Per-player offensive outlook system — research-backed FG% differentiation for G2 (5 series) + G3 (3 series)',
    'Phase 23': 'Injury/fatigue-adjusted G2 projections — CBS injury reports + ESPN live odds integrated (KD return, Tatum recovery, LeBron fatigue)',
    'Phase 24': 'Turnover modeling & foul trouble probability — career playoff game logs (LeBron 293g, Jokic 96g, Edwards 44g), 2026 per-game TOV/PF analysis, pressure multipliers, DRtg degradation',
    'Phase 25': '3PT variance & regression model — Bayesian blend of playoff sample vs season baseline, individual shooter flags, structural vs variance edge identification across all 8 series',
    'Phase 26': 'Role flexibility & defensive versatility model — HHI-based 4-dimension scoring (switch defense, offensive role flex, lineup options, positional versatility), academic research integration, flexibility differential adjustment ±3.0pts',
    'Phase 28': 'Live game analysis & model corrections — youth breakout multiplier, team 3PT correlation, efficiency tax defense, dynamic initiator recalculation, recovery volatility flag. BOS-PHI G2 upset analysis.',
    'Phase 30': 'G2 results integration & engine hardening — youth breakout momentum persistence across consecutive games, coaching adjustment discount on blowout regression. Evidence: BOS-PHI G2 upset, SAS-POR G2 upset.',
    'Phase 31': 'Research anchor blend & data integrity — engine now consumes ptsRange from gNPlayerOutlook (60-70% research blend), normalization caps respect research range, outlook key deduplicated. SGA scoring data reconciled, G1 record corrected to 8/13. Featured Parlays rebuilt for Apr 22 with history timeline.',
    'Phase 32': 'G2 upset analysis — 5 new factors: Coaching Adjustment Quality (CAQ blended score), Initiator Count differential (±3.0pts), Scheme Persistence Factor (70% carryforward), Star Absence Recalibration (redistribution + return penalty), Youth Ceiling Multiplier (per-player overrides). All 16 coaching staffs verified. G1→G2 prediction accuracy: 75%→33% identified root causes.',
    'Phase 34': 'G2 results integration — 3 engine upgrades: (1) Overtime Detection (margin=0 → OVERTIME character label + OT-specific margin range), (2) Dual-Mode Star concept (Cade scorer→distributor, SGA bounce-back), (3) Turnover Catastrophe Factor (20+ TO = structural, not variance). ptsRange [0,0] exclusion for OUT players (Phase 33). G2 record: 6/11 (54.5%). OKC margin exact match (+13). DET-ORL G3 projected as OVERTIME.',
    'Phase 35': 'G3 deep analysis — 5 engine upgrades: (1) First-Home-Game Boost with talent-gap scaling (+1.2% base, halved vs elite stars, -0.4% for low seeds), (2) Star Absence Liberation (secondary players elevated by more touches), (3) Second-Half Youth Fatigue (low seeds fade in Q3-Q4), (4) Road Turnover Volatility (first road visit spikes TOs 30-50%), (5) Veteran Clutch Override (transcendent vets defy age curves). G3 record: 1/6 (16.7%) → G4 improved to 5/8 (62.5%). 3PT regression validated as strongest tool.',
    'Phase 36': 'G3/G4 deep dive — 5 concepts: (1) Scheme-Driven 3PT Suppression Override (regression weight halved when schemePersistence active — DEN 39.6% season → 22% under MIN scheme), (2) Nuclear Game Probability (SGA 42pts on 83.3% FG — tail risk for MVP-caliber players), (3) Coaching Counter Decay (McCollum 0 3s in G4 after game-winners in G2-G3), (4) Engine > Manual Overrides for G4+ (trust structural talent over narrative), (5) Multi-Star Absence Liberation Extreme (Dosunmu 43pts with Edwards + DDV both OUT). G3: 1/8, G4: 5/8 with engine.',
    'Phase 37': 'Series Scoring Context + Score Range Bands: Engine now blends projected scores with actual series averages (low-scoring series project lower, high-scoring project higher). Score ranges show ±12% variance bands. Macro analysis: ESPN reports "15 of 16 teams won a game" — historic parity. Injuries dominate every series. OKC 12-0 in R1 over 3 years, clear R2 favorite.',
    'Phase 38': 'G5 deep analysis — 3 new concepts: (1) Elimination Game Star Elevation (Embiid 33pts facing elimination after 2pts Q1), (2) Closeout Pressure Inversion (BOS 3-22 FG in Q4 trying to clinch), (3) Home Star Ceiling Games (Brunson 39pts at MSG, Embiid 33 at WFC). Model went 1/2 on G5 picks. SAS-POR nearly perfect prediction (116-99 vs 114-95). Henderson youth breakout NOT persistent (31pts G2 → 5pts G5). SAS wins series 4-1.',
    'Phase 43': 'Market Odds Calibration — Calibrated all G6 bets against real DraftKings lines. Key findings: CLE ML was +110 estimated, real was -170 (no value edge). BOS -230 and DEN -258 priced higher than our 61% model. Jokic O/U 29.5 (not 24.5). True value lives in underdogs: LAL +150 (12% edge), ORL +136 (7.6%), MIN +210 (6.7%). All parlays recalculated with real odds.',
    'Phase 42': 'Multi-Round Scalability + Projection Lineage — Round-level navigation (R1/R2/CF/Finals), series graduation with fatigue/injury carryover, projection lineage waterfall (SVG chart showing each factor\'s margin contribution), post-game factor attribution engine (proportional error distribution), localStorage V3 (series-ID keyed, backward-compatible). Infrastructure for playoff progression without code changes.',
    'Phase 41': 'Unified Ensemble — Aligned blended model (manual picks + engine margins) with Monte Carlo chaos sim. Sim now uses blended projection as baseline instead of raw engine. Disagreement variance scaling: +20% chaos when systems disagree, -5% when strongly agree. Result: 5/6 series aligned, 1 genuine coin flip. Calibration maintained at SD = 11.6.',
    'Phase 40': 'Monte Carlo Chaos Simulation — 1000-iteration quarter-by-quarter model with interdependent chaos factors (shooting temperature, momentum runs, foul trouble cascades, fatigue decay, clutch pressure). Calibrated to ATS margin SD = 11.3. Backtest: 56.4% accuracy, 11.6 avg margin error across 39 games. Outputs win probability distributions instead of single-point predictions.',
    'Phase 39': 'G5 Wed results — 3/4 engine picks correct (missed HOU-LAL). (1) DET-ORL first 45-45 dual scoring game (Cade 45, Banchero 45/9/7). (2) CLE-TOR shooting regression normalized, CLE won Q4 25-17. (3) DEN-MIN Jokic triple-double + Spencer Jones 20pts Star Absence Liberation, MIN 25 TOs. (4) HOU-LAL: Reaves return rust (4-16 FG), LeBron 0-6 3PT, Smart 6 TOs. G5 overall: 5/7 (71.4%). Injury-return rust discount and initiator-absent TO compounding identified as new factors.'
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

