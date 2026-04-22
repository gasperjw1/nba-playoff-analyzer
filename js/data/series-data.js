// Series data for all 8 first-round matchups
// ============================================================
// ADVANCED RATING SYSTEM (Research-Enhanced v3)
// ============================================================
// Player Composite Rating =
//   PER_norm(15%) + TS_norm(12%) + EPM_norm(18%) + BPM_norm(15%) +
//   Usage_context(8%) + WS48_norm(12%) + On/Off_norm(10%) + Clutch(10%)
//
// Prediction Model (Backtest-Calibrated v2 + Research Enhancements v3):
//   Base = Team Rating Differential + Round-Adjusted HCA (R1:3, R2:2, CF:1.5, Finals:1)
//   + System Coherence Bonus (team system > individual talent for single games)
//   + Championship DNA / Playoff Pedigree (recent deep runs = elimination game boost)
//   + Star Ceiling Variance (elite stars produce ceiling games ~1x/series)
//   - Health Degradation Curve (injured players degrade across rounds)
//   + Bounce-Back Qualifier (77% base, scaled by round and matchup quality)
//   + Game 7 Override (+5 HCA — home teams win ~78%)
//   + VORP/USG Integration (Yla-Autio 2022 — cumulative value + usage efficiency)
//   + Non-Linear Interactions (Yeung 2020 — 3PT%+DRtg synergy, Pace+Depth)
//   + Stat Differential Model (Jones & Magel 2016 — FG%, 3PT%, ORB%, TOV differentials)
//   + Series-Stage Pressure (Mateus et al. 2024 — pedigree amplified in later games)
//   + Enhanced SPM Chemistry v2 (8 dimensions: added o3PT, oPass per Mateus et al.)
//   + Turnover Modeling (Phase 24 — TOV differential × 1.07 pts/TOV × 0.15 attenuation, capped ±2.5pts, engine Step 5e)
//   + Foul Trouble Probability (Phase 24 — star foul-out risk × DRtg degradation, data in TURNOVER_FOUL_DATA)
//   + 3PT Variance Regression (Phase 25 — Bayesian blend: playoff 3P% × sample + season 3P% × regWeight)
//   + Individual Shooter Regression (Phase 25 — flag unsustainable hot/cold streaks, role player inflation)
//   + Role Flexibility Model (Phase 26 — HHI-based switching defense, offensive role flex, lineup optionality, positional versatility)
//   + Flexibility Differential Adjustment (Phase 26 — (homeFlex - awayFlex) × 0.4, capped ±3.0pts)
//   + Blended Prediction System (Phase 27 — pick winner accuracy 72.7% + engine margin sizing 8.8 avg err → blended 72.7% + 7.9 avg err)
//   + Youth Breakout Multiplier (Phase 28 — Bayesian blend: 40% model / 30% G1 actual / 30% ceiling for ≤23yr breakouts)
//   + Team 3PT Correlation (Phase 28 — team shooting is correlated; ±3pt variance for extreme deviations from baseline)
//   + Efficiency Tax Defense (Phase 28 — D-LEBRON suppresses FG% not volume; preserves shot attempts, reduces conversion)
//   + Dynamic Initiator Recalc (Phase 28 — recalculate initiator counts from prior game box scores; usage ≥18%+ share + creation)
//   + Recovery Volatility (Phase 28 — post-major-injury players get 2-4% asymmetric downside penalty for Achilles/ACL/surgery)
//   Calibrated against 49 games in the 2025 NBA Playoffs (73.5% accuracy)
// ============================================================

const SERIES_DATA = [
  {
    id: "HOU-LAL", conf: "West", round: "R1",
    homeCourtOverride: "away", // LAL (4 seed, 53-29) has actual home court, but is listed as awayTeam in data
    defMatchups: {
      homeDefOnAway: { defender:"Amen Thompson", target:"LeBron James", dLebron:0.959, targetUsg:29.2, note:"Thompson's elite POA athleticism vs LeBron. Physical enough to contest but LeBron's passing nullifies on-ball pressure. G1: LeBron chose facilitator mode (13ast) rather than scoring through Thompson." },
      awayDefOnHome: { defender:"Marcus Smart", target:"Alperen Sengun", dLebron:1.373, targetUsg:26.2, note:"DPOY-caliber Smart hunts Sengun in P&R. G1 CONFIRMED: Sengun shot 6/19 as Smart disrupted his post-up rhythm and help-side rotations. Smart also switches onto Sheppard/Thompson — his versatility is LAL's defensive weapon." }
    },
    homeTeam: {
      name: "Rockets", city: "Houston", abbr: "HOU", seed: 5, record: "52-30",
      systemBonus: 0.5, // Udoka's defensive system is solid but young team limits execution
      playoffPedigree: 0, // No recent playoff experience for this core
      offStyle: "KD iso + Sengun post-up dual-threat RESTORED for G2. G1 without KD collapsed to Sengun P&R only (37.6% FG). KD's return adds elite midrange gravity + secondary creation, opening Sheppard/Smith 3PT looks.", initiators: 2, // KD CONFIRMED SUITING UP G2. Was OUT G1 (knee contusion). Transforms offense from single to dual initiator.
      color: "#CE1141", color2: "#C4CED4",
      advStats: { ortg:115.2, drtg:110.8, netRtg:4.4, pace:100.8, ts:57.8, efg:54.2, tov:13.2, reb:51.1, ortgRk:6, drtgRk:8, clutchNetRtg:-2.8, last10:"8-2", fgPct:51.2, threePct:34.8, ftPct:77.6, orbPct:24.9 },
      players: [
        { name:"Kevin Durant", age:37, pos:"SF", rating:82, ppg:26.0, rpg:5.5, apg:4.8, fgp:52.4, per:25.8, ts:65.5, epm:5.5, bpm:6.1, ws48:.195, onOff:5.2, clutch:6.0, vorp:5.3, usg:29.5, injury:"ACTIVE G2 — right knee contusion (limited mobility, minutes restriction likely)", lebron:2.377, oLebron:2.519, dLebron:-0.142, war:8.586, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"67% TS vs LAL reg season. Elite efficiency but burner scandal chemistry ding. Clutch 6.0. Right knee contusion Apr 17 — OUT Game 1, CONFIRMED SUITING UP Game 2 (Apr 21). Went through half of practice Mon. Udoka: knee 'tough to bend in certain ways'. At 37 with knee stiffness, expect limited explosiveness but midrange game is matchup-proof.", baseRating:89, starCeiling:2, injuryRisk:0.7, activeInjury:{type:"right knee contusion",severity:0.35,note:"CONFIRMED PLAYING G2 (Apr 21). DID NOT DRESS G1. Went through half of Monday practice. Udoka says knee is 'tough to bend in certain ways' — limited mobility but cleared to play. MRI clean. Sam Amick reports 'good chance he is a go.' Likely on minutes restriction (~28-30min). At 37, midrange game doesn't require explosiveness — but drives/post-ups will be limited. Rating 82 (down from 89 base) reflects knee limitation. Recovery volatility flag applies (Phase 28)."} },
        { name:"Alperen Sengun", pos:"C", rating:81, ppg:20.4, rpg:8.9, apg:6.2, fgp:54.2, per:24.5, ts:61.5, epm:4.2, bpm:4.6, ws48:.180, onOff:6.5, clutch:5.4, vorp:3.5, usg:26.2, injury:null, lebron:1.058, oLebron:1.055, dLebron:0.003, war:5.285, offRole:"Shot Creator", defRole:"Mobile Big",
          matchupNote:"All-Star. +6.5 on/off is team-best. Dominates interior. Mentioned in KD leaks — chemistry factor", baseRating:82, starCeiling:1, injuryRisk:0 },
        { name:"Amen Thompson", pos:"SF", rating:79, ppg:18.3, rpg:7.8, apg:5.3, fgp:50.8, per:18.2, ts:58.5, epm:2.2, bpm:2.0, ws48:.128, onOff:3.5, clutch:5.0, vorp:2.2, usg:25.2, injury:null, lebron:2.036, oLebron:1.077, dLebron:0.959, war:8.308, offRole:"Shot Creator", defRole:"Point of Attack",
          matchupNote:"Athletic playmaker, starter now. 58.5 TS% efficient. +3.5 on/off as starter", baseRating:74 },
        { name:"Reed Sheppard", pos:"SG", rating:70, ppg:13.5, rpg:3.1, apg:3.4, fgp:45.1, per:15.8, ts:59.2, epm:1.5, bpm:1.2, ws48:.105, onOff:2.2, clutch:5.5, vorp:1.6, usg:22.8, injury:null, lebron:-1.786, oLebron:-0.742, dLebron:-1.044, war:0.912, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"Rookie sharpshooter. High IQ, 41% from 3. Poised beyond his years", baseRating:70 },
        { name:"Jabari Smith Jr.", pos:"PF", rating:70, ppg:15.8, rpg:6.9, apg:1.5, fgp:46.2, per:15.2, ts:56.1, epm:1.0, bpm:0.5, ws48:.092, onOff:1.8, clutch:4.5, vorp:1.3, usg:22.6, injury:null, lebron:0.822, oLebron:0.041, dLebron:0.781, war:5.565, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Versatile defender. 36.8% 3PT provides spacing. Also in KD leaks", baseRating:72 },
        { name:"Tari Eason", pos:"PF", rating:62, ppg:10.5, rpg:6.3, apg:1.0, fgp:48.7, per:14.8, ts:56.4, epm:0.6, bpm:0.4, ws48:.082, onOff:0.8, clutch:3.8, vorp:0.9, usg:18.5, injury:null, lebron:0.136, oLebron:-0.358, dLebron:0.494, war:2.52, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"Energy big off bench. 3.2 fouls/game is a concern in tight playoff minutes", baseRating:62 },
        { name:"Clint Capela", age:32, pos:"C", rating:60, ppg:8.5, rpg:8.8, apg:0.8, fgp:60.5, per:14.2, ts:62.1, epm:0.2, bpm:0.0, ws48:.075, onOff:0.2, clutch:3.5, vorp:0.7, usg:17.5, injury:null, lebron:-0.302, oLebron:-1.218, dLebron:0.916, war:1.251, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Veteran backup center. Rim protection and rebounding off bench", baseRating:60 },
        { name:"Dorian Finney-Smith", pos:"SF", rating:0, ppg:3.3, rpg:2.5, apg:1.2, fgp:43.5, per:10.8, ts:54.8, epm:0.1, bpm:-0.3, ws48:.062, onOff:0.5, clutch:4.2, vorp:0.5, usg:16.2, injury:"OUT — DNP, out of rotation", lebron:-3.248, oLebron:-2.775, dLebron:-0.472, war:-0.292, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"DNP Game 1. Out of Udoka's playoff rotation. Previously overrated at 7.2 ppg — actual season avg 3.3 ppg. Not a factor in this series.", baseRating:45 },
        { name:"Josh Okogie", pos:"SG", rating:58, ppg:4.5, rpg:2.6, apg:0.8, fgp:46.0, per:9.5, ts:55.0, epm:-0.3, bpm:-1.2, ws48:.055, onOff:0.5, clutch:3.5, vorp:0.3, usg:10.5, injury:null, lebron:-1.5, oLebron:-1.8, dLebron:0.3, war:0.8, offRole:"Cutter", defRole:"Wing Stopper",
          matchupNote:"STARTED G1 (26min, 7pts, 2stl). Elite perimeter defender — Udoka chose him as 5th starter over Sheppard's offense for defensive matchup purposes. Shot 2-4 FG, 1-2 3PT. Energy and defense player.", baseRating:55 },
        { name:"Aaron Holiday", pos:"PG", rating:42, ppg:5.5, rpg:1.1, apg:1.5, fgp:42.0, per:8.5, ts:52.0, epm:-0.5, bpm:-1.8, ws48:.040, onOff:-0.5, clutch:3.0, vorp:0.2, usg:14.0, injury:null, lebron:-2.0, oLebron:-1.5, dLebron:-0.5, war:0.3, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"Bench guard, 11min G1 (0pts, 0-4 FG, 0-2 3PT). Struggled badly — no points, no assists, no rebounds. May lose minutes G2 if KD returns.", baseRating:45 },
        { name:"Jae'Sean Tate", pos:"PF", rating:45, ppg:2.8, rpg:1.6, apg:0.5, fgp:42.0, per:8.0, ts:50.0, epm:-0.5, bpm:-1.5, ws48:.035, onOff:-0.3, clutch:3.0, vorp:0.2, usg:12.0, injury:null, lebron:-2.5, oLebron:-2.0, dLebron:-0.5, war:0.2, offRole:"Cutter", defRole:"Helper",
          matchupNote:"Hustle forward, 10min G1 (4pts/4reb/1stl on 1-5 FG). Energy player who crashes boards. May see reduced minutes if KD returns G2.", baseRating:48 }
      ],
      synergy: [
        { players:["Sheppard","Thompson","Durant","Smith","Sengun"], score:76, note:"Full-strength starting 5. KD-Sengun PnR elite (1.12 PPP, 89th percentile). DRtg improved without old chemistry issues. NOT USED G1 — KD did not dress." },
        { players:["Sheppard","Thompson","Okogie","Smith","Sengun"], score:68, note:"G1 ACTUAL starting 5 (no KD). Okogie adds perimeter defense but team shot 37.6% FG. Lost 98-107." },
        { players:["Thompson","Eason","Smith","Sengun","Okogie"], score:65, note:"Defensive unit without KD. Eason's energy (16pts/10reb G1 in 24min) fills scoring gap. Closing lineup potential." },
        { players:["Sheppard","Thompson","Durant","Smith","Capela"], score:72, note:"Defensive lineup. Capela rim protection anchors interior. Spacing tighter without Sengun passing" }
      ]
    },
    awayTeam: {
      name: "Lakers", city: "Los Angeles", abbr: "LAL", seed: 4, record: "53-29",
      systemBonus: 0, // Redick's system is innovative but untested in playoffs
      playoffPedigree: 2, // LeBron's championship DNA is unmatched
      offStyle: "G1 PROVED: LeBron facilitator mode (19pts/13ast) + Kennard as primary scorer (27pts). Smart secondary playmaker (15pts/8ast). Not one-dimensional after all.", initiators: 2, // LeBron + Smart (G1 proved Smart as secondary creator)
      color: "#552583", color2: "#FDB927",
      advStats: { ortg:113.8, drtg:112.1, netRtg:1.7, pace:99.2, ts:57.8, efg:54.1, tov:12.8, reb:50.2, ortgRk:12, drtgRk:14, clutchNetRtg:3.2, last10:"7-3", fgPct:51.1, threePct:34.7, ftPct:77.6, orbPct:24.2 },
      players: [
        { name:"LeBron James", age:41, pos:"SF", rating:88, ppg:24.1, rpg:7.2, apg:8.4, fgp:52.1, per:20.8, ts:62.4, epm:5.8, bpm:3.5, ws48:.198, onOff:6.4, clutch:8.2, vorp:2.8, usg:29.2, injury:null, lebron:2.491, oLebron:2.095, dLebron:0.396, war:6.154, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"At 41, must carry without Doncic/Reaves. 67.0 TS% in clutch minutes. BBRef-corrected BPM 3.5 and VORP 2.8 are lower than initial estimates — advanced stats reflect age decline but eye test and clutch (8.2) tell a different story. WPA MVP potential in facilitator mode (93rd pctile points created per Databallr).", baseRating:92, starCeiling:2, injuryRisk:0.5, playoffAscension:1.0 },
        { name:"Luka Doncic", pos:"PG", rating:0, ppg:31.4, rpg:8.8, apg:7.9, fgp:48.7, per:29.8, ts:60.1, epm:7.9, bpm:9.1, ws48:.224, onOff:10.2, clutch:7.5, vorp:7.1, usg:34.2, injury:"Grade 2 hamstring — OUT (targeting ~May 1 return)", lebron:5.176, oLebron:5.622, dLebron:-0.446, war:10.733, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Scoring champion unavailable. Grade 2 hamstring from Apr 2 vs OKC. Received stem cell treatment in Spain, returned to LA Apr 18. Target return ~May 1 (mid-to-late first round). 56.8 combined PPG with Reaves gone", baseRating:95, starCeiling:2, injuryRisk:1.0 },
        { name:"Austin Reaves", pos:"SG", rating:0, ppg:25.4, rpg:5.1, apg:6.2, fgp:46.8, per:21.2, ts:58.4, epm:3.8, bpm:4.1, ws48:.152, onOff:5.1, clutch:6.8, vorp:3.5, usg:28.8, injury:"OUT — oblique strain (earliest return first week of May)", lebron:2.39, oLebron:2.295, dLebron:0.095, war:5.341, offRole:"Shot Creator", defRole:"Point of Attack",
          matchupNote:"Grade 2 oblique strain from Apr 2 vs OKC. Expected to miss entire first round — earliest return first week of May per Charania. Offensive creation vanishes without him", baseRating:80 },
        { name:"Deandre Ayton", pos:"C", rating:65, ppg:12.5, rpg:8.0, apg:1.2, fgp:55.8, per:16.5, ts:59.8, epm:0.8, bpm:0.5, ws48:.095, onOff:1.2, clutch:4.2, vorp:1.2, usg:21.5, injury:null, lebron:-0.325, oLebron:-0.986, dLebron:0.66, war:2.619, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"72 games started. Leads team in rebounds and blocks. Better rim protector than Hayes", baseRating:65 },
        { name:"Marcus Smart", pos:"PG", rating:66, ppg:9.4, rpg:3.5, apg:4.8, fgp:41.2, per:12.8, ts:52.1, epm:1.4, bpm:-2.2, ws48:.082, onOff:2.8, clutch:6.1, vorp:-0.1, usg:18.8, injury:null, lebron:0.549, oLebron:-0.823, dLebron:1.373, war:3.337, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"DPOY-caliber defender. +2.8 on/off shows defensive impact. Will guard KD", baseRating:66 },
        { name:"Rui Hachimura", pos:"PF", rating:59, ppg:13.2, rpg:5.4, apg:1.3, fgp:49.1, per:15.8, ts:57.2, epm:0.5, bpm:0.1, ws48:.088, onOff:-0.5, clutch:4.8, vorp:1.1, usg:22.0, injury:null, lebron:-2.237, oLebron:-0.814, dLebron:-1.423, war:0.281, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Solid on both ends. 57.2 TS% efficient but limited playmaking", baseRating:64 },
        { name:"Jake LaRavia", pos:"SF", rating:55, ppg:9.5, rpg:4.2, apg:2.5, fgp:47.8, per:13.5, ts:57.5, epm:0.5, bpm:0.2, ws48:.078, onOff:0.5, clutch:4.2, vorp:0.9, usg:18.8, injury:"DAY-TO-DAY — right leg injury (exited G2 Q4)", lebron:-1.177, oLebron:-0.61, dLebron:-0.566, war:1.658, offRole:"Stationary Shooter", defRole:"Point of Attack",
          matchupNote:"Signed Jul 2025. Versatile forward, can play 3/4. G2: exited Q4 with apparent right leg issue — 0pts (0-2 FG) in 16min. Day-to-day, est. return Apr 24 (G3). If OUT for G3, LAL loses bench depth — Vanderbilt absorbs minutes.", baseRating:60, injuryRisk:0.4, activeInjury:{type:"right leg injury",severity:0.4,note:"Exited G2 Q4 and did not return. Per ESPN: 0pts (0-2 FG, 0-1 3PT), 2reb, 1blk in 16min. Day-to-day. Est. return Apr 24 (G3 date). If unavailable, Vanderbilt/Hayes absorb his bench wing minutes. LAL's already thin 7-man rotation becomes 6-man."} },
        { name:"Jaxson Hayes", pos:"C", rating:55, ppg:6.2, rpg:4.5, apg:0.8, fgp:58.5, per:13.2, ts:61.0, epm:-0.2, bpm:-0.5, ws48:.065, onOff:-0.5, clutch:3.5, vorp:0.3, usg:15.5, injury:null, lebron:0.348, oLebron:-0.042, dLebron:0.39, war:2.123, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Signed Jul 2025. Athletic backup C, rim-runner and shot-blocker. 1.2 BPG per 36", baseRating:55 },
        { name:"Luke Kennard", pos:"SG", rating:72, ppg:8.8, rpg:2.4, apg:2.1, fgp:45.5, per:12.8, ts:59.5, epm:0.1, bpm:-0.8, ws48:.070, onOff:-0.3, clutch:4.0, vorp:0.4, usg:17.8, injury:null, lebron:-2.908, oLebron:-1.122, dLebron:-1.786, war:-0.446, offRole:"Off Screen Shooter", defRole:"Chaser",
          matchupNote:"G1 BREAKOUT: 27pts on 9-13 FG (5-5 3PT!) as STARTER. LeBron-Kennard 2-man game is a proven weapon (+8.7 NetRtg in 27 reg season games). Playoff rating upgraded from 54→72 — he IS LAL's #2 scorer now with Doncic/Reaves out. HOU will scheme against him G2.", baseRating:58, playoffAscension:0.8 },
        { name:"Jarred Vanderbilt", pos:"PF", rating:52, ppg:5.2, rpg:5.8, apg:1.0, fgp:48.5, per:10.5, ts:54.0, epm:-0.2, bpm:-0.8, ws48:.060, onOff:0.3, clutch:3.5, vorp:0.3, usg:10.2, injury:null, lebron:-1.5, oLebron:-2.0, dLebron:0.5, war:1.0, offRole:"Cutter", defRole:"Wing Stopper",
          matchupNote:"Versatile defender, 18min G1 (5pts/5reb on 1-2 FG, 1-2 3PT). Defensive energy off bench — switches across positions. ESPN depth chart lists him as backup PF behind LeBron.", baseRating:52 },
        { name:"Bronny James", pos:"SG", rating:35, ppg:1.5, rpg:0.8, apg:0.3, fgp:35.0, per:5.0, ts:45.0, epm:-2.0, bpm:-3.0, ws48:.010, onOff:-2.0, clutch:2.0, vorp:-0.2, usg:8.0, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Cutter", defRole:"Point of Attack",
          matchupNote:"Garbage-time only. 4min in G1 with 0pts/0reb and 1 TO. Not a rotation player — only appears in blowout scenarios", baseRating:35 }
      ],
      synergy: [
        { players:["LeBron","Smart","Kennard","Hachimura","Ayton"], score:76, note:"G1 ACTUAL starting 5. WON 107-98. LeBron facilitator mode (19/8/13) unlocked Kennard (27pts). Shot 60.6% FG as a unit. Smart's defense hunted Sengun/Sheppard. Zone/man toggling held HOU to 37.6%." },
        { players:["LeBron","Kennard","Vanderbilt","LaRavia","Hayes"], score:58, note:"Bench unit. Vanderbilt/LaRavia add defense, Hayes provides rim-running. Limited offense without Smart." },
        { players:["LeBron","Smart","Kennard","Vanderbilt","Ayton"], score:68, note:"Defensive-plus lineup. Vanderbilt replaces Hachimura for switchability. Used in 4Q stretches." }
      ]
    },
    externalFactors: [
      { team:"LAL", player:"Luka Doncic", desc:"Custody battle + Grade 2 hamstring. OUT through at least May 1. 56.8 combined PPG with Reaves gone — but LAL is 2-0 without them.", impact:-8, category:"personal",
        evidence:"ESPN reported Grade 2 left hamstring strain on Apr 2 vs OKC. TMZ confirmed custody petition. Team says 'don't expect him back during first round.' However, LAL has PROVEN they can win without Doncic/Reaves — 2-0 in playoffs. Impact downgraded from -15 to -8 because the team has adapted.",
        sources:["ESPN: espn.com/nba/story/_/id/48166967"], verdict:"verified" },
      { team:"LAL", player:"Austin Reaves", desc:"Began on-court work Apr 20. Could return G5-G7 if series extends. Oblique improving faster than Doncic's hamstring. LAL has adjusted — Smart/Kennard filling void.", impact:-3, category:"injury",
        evidence:"NBA.com confirmed. Impact downgraded from -12 to -5 because Smart (avg 20pts/7.5ast) and Kennard (avg 25pts) have filled the scoring void through 2 games. The absence is real but the team has clearly adapted.",
        sources:["NBA.com: nba.com/news/lakers-without-luka-doncic-austin-reaves"], verdict:"verified" },
      { team:"LAL", player:"LeBron James", desc:"At 41, averaging 23.5pts/8reb/10ast through 2 games. Seamlessly shifted from facilitator (G1: 19pts/13ast) to scorer (G2: 28pts/7ast). No fatigue signs.", impact:5, category:"role",
        evidence:"ESPN recap: LeBron had 28/8/7 in G2 on 2-day turnaround. Quote: 'We've all got to pick up our play.' Model's fatigue flag was completely wrong — LeBron INCREASED production. Legacy motivation vs KD (first playoff meeting since 2018 Finals) is elite fuel.",
        sources:["ESPN: espn.com/nba/recap/_/gameId/401869397"], verdict:"verified" },
      { team:"LAL", player:"Marcus Smart", desc:"BREAKOUT: Averaging 20pts/7.5ast/4.5 3PM through 2 games. Has become LAL's clear #2 star behind LeBron.", impact:6, category:"role",
        evidence:"ESPN recap: Smart had 25pts/5 3PM/7ast in G2 (8-13 FG). Redick quote: 'He just had a killer game tonight... unbelievable player.' G1: 15pts/8ast/4 3PM. Smart's playoff pedigree (2022 DPOY, NBA Finals) is manifesting. This is a 2-game pattern, not an outlier.",
        sources:["ESPN: espn.com/nba/recap/_/gameId/401869397"], verdict:"verified" },
      { team:"LAL", player:"Luke Kennard", desc:"Averaging 25pts/game on 65.4% FG through 2 games. LeBron-Kennard two-man game (+8.7 NetRtg) is a proven system.", impact:4, category:"role",
        evidence:"ESPN recap: Kennard 23pts (8-13 FG) in G2 after 27pts (9-13 FG) in G1. Both Smart and Kennard went 8-13 FG in G2. KD said: 'Smart was the guy that knocked down shots... Kennard, too.' The LeBron-Kennard connection is sustainable.",
        sources:["ESPN: espn.com/nba/recap/_/gameId/401869397"], verdict:"verified" },
      { team:"LAL", player:null, desc:"Redick's defensive scheme mastery — zone/doubling/switching is structurally suppressing HOU offense. 2-0 as playoff HC.", impact:5, category:"coaching",
        evidence:"G1: Zone defense held HOU to 37.6% FG. G2: Doubled KD from possession one → 9 turnovers, 3 2H pts. LAL has outcoached HOU in every dimension. Redick adjustment rating upgraded from 7→8.",
        sources:["ESPN: espn.com/nba/recap/_/gameId/401869397"], verdict:"verified" },
      { team:"HOU", player:"Kevin Durant", desc:"G2 playoff debut disaster: 23pts but 9 TOs, only 3 2H pts. LAL's doubling scheme completely neutralized him. Knee still limiting mobility.", impact:-8, category:"performance",
        evidence:"ESPN: KD took only 12 shots, had 9 turnovers. KD quote: 'They started doubling me from possession one.' Got early foul trouble. KD's 'dual initiator' thesis was neutralized — the turnovers actually hurt HOU's offense more than his scoring helped. Knee contusion still limiting explosiveness at 37.",
        sources:["ESPN: espn.com/nba/recap/_/gameId/401869397"], verdict:"verified" },
      { team:"HOU", player:"Kevin Durant", desc:"Burner account scandal still lingers. Chemistry with teammates untested under playoff pressure.", impact:-4, category:"chemistry",
        evidence:"Screenshots leaked Feb 15 mocking Sengun/Smith. First playoff game together was G2 — KD had 9 TOs suggesting limited chemistry/timing with teammates. Reduced from -8 to -4 as the scandal is older now but the on-court chemistry issues are confirmed.",
        sources:["Yahoo: kevin-durant-burner-account-rumors"], verdict:"verified" },
      { team:"HOU", player:null, desc:"HOU offensive suppression is a 2-game structural pattern: 39.0% FG avg, 28.5% 3PT avg across G1-G2. This is scheme-driven, not variance.", impact:-6, category:"performance",
        evidence:"G1: 37.6% FG. G2: 40.4% FG, 24% 3PT (7-29). LAL's zone/switching defense is designed to deny HOU's shooters open looks. KD said: 'We're just not making shots... missing a lot of layups.' This is structural, not bad luck.",
        sources:["ESPN: espn.com/nba/recap/_/gameId/401869397"], verdict:"verified" },
      { team:"HOU", player:null, desc:"Going home 0-2 — desperation factor. Teams down 0-2 historically win series only ~7% of the time. Home crowd could fuel a bounce-back.", impact:3, category:"motivation",
        evidence:"G3 is Friday Apr 24 in Houston. HOU was 28-13 at home during regular season (68.3% win rate). Home crowd + backs against the wall + Udoka adjustments could produce a bounce-back. But HOU's closing problems (-2.8 clutch NetRtg) are a counter-concern.",
        sources:["AZCentral: azcentral.com/nba/rockets-lakers-odds-game-3"], verdict:"verified" },
      { team:"HOU", player:null, desc:"Market still heavily favors HOU at home: -9.5 spread, -425 ML, O/U 205.5. Market believes home court correction will be massive.", impact:2, category:"market",
        evidence:"BetMGM Sportsbook via AZ Republic (Apr 21 2026). Despite being 0-2, HOU is a 9.5-point favorite at home. This implies market expects ~16-point home court swing (from -7 loss to +9.5 favorite). O/U 205.5 is low, suggesting continued defensive battle.",
        sources:["AZCentral: azcentral.com/nba/rockets-lakers-odds-game-3"], verdict:"verified" },
      { team:"LAL", player:"Jake LaRavia", desc:"NEW: Right leg injury — exited G2 Q4, did not return. Day-to-day, est. return Apr 24 (G3). LAL's 7-man rotation could shrink to 6.", impact:-2, category:"injury",
        evidence:"Per ESPN (Apr 22): LaRavia exited G2 in Q4 with apparent right leg issue. 0pts (0-2 FG) in 16min. Day-to-day. If OUT for G3, Vanderbilt/Hayes absorb minutes. Already thin rotation becomes thinner for road game at Houston.",
        sources:["ESPN Injuries: espn.com/nba/injuries"], verdict:"verified" }
    ],
    game1: {
      spread: "HOU -5.5", moneyline: "HOU -220 / LAL +180", ou: "O/U 207.5",
      pick: "HOU", confidence: "medium", projScore: "HOU 109 — LAL 102",
      reasoning: "Houston's depth advantage is overwhelming without Doncic/Reaves. KD's 67% TS against LA and Sengun's dominance in the interior are decisive. However, the spread feels large: LeBron's 14-6 record vs HOU, the Lakers' half-court efficiency, and Houston's -2.8 clutch NetRtg suggest this could be closer than the line implies. The Rockets' closing problems are the Lakers' lifeline.",
      prosHome: ["KD 67% TS vs LAL this season — MOOT (KD was OUT)", "Sengun dominates interior matchup — PARTLY TRUE (19pts but team lost)", "8-2 last 10 games — peak momentum — DIDN'T TRANSLATE", "Depth: 8-man rotation all healthy — NEUTRALIZED by LAL shooting"],
      consHome: ["Burner scandal chemistry damage — UNQUANTIFIABLE", "-2.8 clutch NetRtg — CONFIRMED, couldn't close 4Q", "Young team's first real playoff pressure — CONFIRMED, shot 33% stretches", "Thompson only recent starter promotion — partly, had 17pts but team D collapsed"],
      prosAway: ["LeBron legacy game — CONFIRMED (19/8/13, facilitator masterclass)", "14-6 vs HOU in last 20 games — CONFIRMED trend held", "Smart's defense disrupts rhythm — CONFIRMED, HOU held to stretches of 33% FG", "HOU -2.8 clutch NetRtg = blowable lead — CONFIRMED"],
      consAway: ["Missing 56.8 PPG — OVERWEIGHTED, Kennard 27pts filled the void", "Ayton vs Sengun mismatch — NEUTRALIZED by LAL's spacing", "Depth collapses after top 5 — WRONG, Kennard/Hachimura/Smart all contributed", "LeBron foot management — NOT A FACTOR, played full minutes"]
    },
    modelLessons: [
      { type:"overweighted", lesson:"HOU depth advantage narrative — LAL's shooting efficiency (61% FG, 53% 3PT) neutralized HOU's deeper rotation. Quality of shots > quantity of rotation players." },
      { type:"overweighted", lesson:"KD absence impact on HOU — model still had KD's ghost inflating team ceiling. Sengun (19pts) and Thompson (17pts) played decently individually but team defense collapsed without KD's gravity. HOU shot just 37.6% as a team." },
      { type:"underweighted", lesson:"LeBron facilitator mode — 19pts/13ast. He chose to orchestrate rather than score, maximizing Kennard and role players. Model assumed he'd need to carry; instead he elevated everyone." },
      { type:"missed", lesson:"Kennard's playoff explosion — 27pts on elite 3PT shooting. LeBron-Kennard two-man game had +8.7 NetRtg in 27 regular season games together. This was a KNOWN data point that wasn't weighted into the prediction." },
      { type:"missed", lesson:"LAL defensive targeting of Sengun/Sheppard — Smart's DPOY-caliber defense hunted HOU's weakest defenders. Lakers attacked Sheppard in March regular season games and repeated the blueprint. Scouting > depth. Sengun shot 6-for-19, Sheppard 6-for-20 — both exploited repeatedly." },
      { type:"missed", lesson:"LAL zone defense toggling — LAL is the 3rd-most-frequent zone defense team in the NBA, allowing just .960 PPP in zone. They toggled between zone and man all game, and HOU had 3 non-spacers on court at times — the worst possible look against zone. Model has no mechanism to capture defensive scheme versatility." },
      { type:"missed", lesson:"LeBron's facilitator ceiling is quantifiable — per Databallr, LeBron is 93rd percentile in points created, 95th in rim assists, 96th in total assists. His 13-assist game wasn't an anomaly; it's a repeatable mode the model treated as a one-off. His facilitator mode is a genuine second gear." },
      { type:"missed", lesson:"HOME COURT ERROR — LAL (4 seed, 53-29) should have home court over HOU (5 seed, 52-30). Game was at Crypto.com Arena. Model had HOU as homeTeam, giving +3 HCA to the WRONG team. This alone swings probability ~10%. [FIXED: homeCourtOverride now corrects HCA to LAL]" },
      { type:"underweighted", lesson:"HOU young team playoff pressure — Rockets shot 33% FG in stretches (37.6% overall). First meaningful playoff games for Thompson, Sheppard, Smith Jr. Playoff intensity is a real factor for teams under 25." },
      { type:"correct", lesson:"Predicted HOU's closing problems would be their vulnerability — -2.8 clutch NetRtg manifested as 4Q collapse." },
      { type:"missed", lesson:"WPA analysis (inpredictable) confirms Kennard was the game's MVP (+15.2% WPA) and Sheppard was LVP (-14.6%). Field goal shooting was the overwhelmingly dominant factor — model had no mechanism to predict LAL's 60.6% FG explosion vs HOU's 37.6%. This was a scheme-driven FG% gap (zone defense forcing HOU non-spacers into bad shots), not random variance." },
      { type:"overweighted", lesson:"G2: KD return as game-changer — Model treated KD's return as transforming HOU (1→2 initiators), but LAL doubled KD from possession one and he had 9 TOs with only 3 2H pts (12 total shots). The 'dual initiator' thesis was neutralized by a simple defensive scheme. KD's impact was net-negative with turnovers." },
      { type:"overweighted", lesson:"G2: Udoka adjustment pedigree (rated 8) — Despite historical bounce-back data (+17.3pt margins in 2022), Udoka still had no answer for LAL's doubling scheme on KD or zone defense. Coaching adjustment ratings should be discounted when opponent's scheme is structurally sound, not just a one-game fluke." },
      { type:"underweighted", lesson:"G2: Smart's sustained elite play — Model predicted 'neutral' outlook (10-16pts). Actual: 25pts/5 3PM/7ast (8-13 FG). Through 2 games: averaging 20pts/7.5ast. This is not an outlier — Smart's playoff pedigree (2022 DPOY, Finals experience) is manifesting. He IS the Lakers' 2nd star." },
      { type:"underweighted", lesson:"G2: Kennard sustained production — Model predicted 'bad' outlook with heavy regression (12-18pts). Actual: 23pts (8-13 FG). Through 2 games: averaging 25pts on 65.4% FG. The LeBron-Kennard two-man game (+8.7 NetRtg) is a repeatable system, not a one-off." },
      { type:"missed", lesson:"G2: LAL's defensive scheme adaptability — Redick's game plan doubled KD from possession one (per KD's own quote), forcing 9 turnovers. This was a pre-planned counter to KD's return, not a reactive adjustment. Model has no mechanism for coaching scheme counters to roster changes." },
      { type:"missed", lesson:"G2: HOU 3PT shooting is structurally suppressed — 24% 3PT (7-29) in G2, after 33% in G1. This is a 2-game defensive pattern, not shooting variance. LAL's zone/switching defense is designed to deny open 3PT looks to HOU's shooters. Model's 3PT regression formula wrongly assumes mean-reversion when the suppression is scheme-driven." },
      { type:"missed", lesson:"G2: LeBron fatigue factor was completely wrong — Model flagged 41-year-old fatigue on 2-day turnaround. Actual: LeBron INCREASED to 28pts (from 19 G1) with 8reb/7ast. He shifted from facilitator to scorer seamlessly. Age-based fatigue penalties are too aggressive for playoff LeBron." },
      { type:"correct", lesson:"G2: Correctly predicted Sengun bounce-back (projected 'good', 18-26pts → actual 20pts/11reb). KD's gravity did pull attention from Sengun, but it wasn't enough to overcome LAL's overall scheme." },
      { type:"missed", lesson:"G2: MODEL MISSED WINNER AGAIN — Predicted HOU 108-101 (HIGH confidence). Actual: LAL 101-94. Model is now 0-2 on this series with a cumulative 23-point swing. The fundamental error: overrating HOU's talent depth while underrating LAL's defensive scheme mastery and role-player elevation under Redick." }
    ],
    game2: {
      spread: "HOU -5.5", moneyline: "HOU -210 / LAL +170", ou: "O/U 207.5",
      pick: "HOU", confidence: "high", projScore: "HOU 108 — LAL 101",
      schedule: "Tue Apr 21 — 10:30 PM ET — NBC",
      reasoning: "MODEL PICK: HOU (HIGH confidence, COMPETITIVE). KD CONFIRMED SUITING UP — transforms this from a coin-flip to a clear HOU edge. Three converging factors: (1) KD'S RETURN = DUAL INITIATOR — HOU goes from 1 to 2 initiators (Phase 28 dynamic recalc). In G1, Sengun was the sole creator and Smart hunted him mercilessly (6-19 FG). KD's midrange gravity forces Smart to choose: guard KD or roam to disrupt Sengun. He can't do both. Even at 80% health (~28-30min restriction), KD's 67% TS vs LAL this season and matchup-proof midrange game add ~18-22 points of efficient offense. (2) LAL SHOOTING REGRESSION — LAL shot 61% FG and 53% 3PT in G1, both historically unsustainable. 2025 backtest: teams shooting 10%+ above playoff averages in G1 ALWAYS regressed in G2. Kennard's 5-5 from 3PT (100%) will face heavy scheming — HOU will face-guard and switch. Project LAL regression from 61% to ~46% FG, costing ~12-15 points of efficiency. (3) UDOKA ADJUSTMENT PEDIGREE — In 2022 playoffs with Boston, bounced back from 4 losses averaging +17.3pt margins. His between-game adjustments are elite. Will counter LAL's zone by inserting more shooting (KD + Sheppard spread floor). LAL retains home court (Crypto.com Arena) and LeBron's championship DNA (pedigree 2), but at 41 on a 2-day turnaround with increased usage, fatigue is a real factor. Smart's defensive blueprint from G1 is partially neutralized by KD's presence — can't free-roam when KD is on the court. Line moved from HOU -3.5 to -5.5 with KD confirmation, and O/U dropped from 213.5 to 207.5 (market expects tighter, more half-court game with KD controlling pace).",
      g1Adjustments: [
        "KD CONFIRMED PLAYING G2 — transforms HOU from 1 to 2 initiators. Biggest single-game roster upgrade in R1.",
        "LAL WON G1 107-98 at home — but shot 61% FG / 53% 3PT (historically unsustainable, WILL regress)",
        "UDOKA ADJUSTMENT HISTORY: 2022 playoffs (BOS) bounce-back wins averaged +17.3pt margin. Will counter LAL zone with KD spacing.",
        "HOU initiators: 1→2. KD + Sengun dual-threat forces Smart to pick his poison — can't hunt both.",
        "Kennard G1 breakout (27pts, 5-5 3PT) will be schemed against — expect face-guarding, aggressive switches.",
        "LAL SHOOTING REGRESSION: 61% FG → project ~46% FG. Kennard 100% 3PT → project ~38%. Cost: ~12-15pts efficiency.",
        "HOU young players' G1 jitters gone — Thompson (17pts), Sheppard (17pts), Smith now have real playoff reps.",
        "KD on minutes restriction (~28-30min) — limited explosiveness but midrange game is matchup-proof.",
        "LeBron FATIGUE FACTOR: 41 years old, 2-day turnaround, high-usage G1 (13ast = constant decision-making load).",
        "HOME COURT: Still at Crypto.com Arena (LAL is 4 seed). HOU must steal a road game to avoid 0-2.",
        "O/U dropped 213.5→207.5 — market expects slower pace, more half-court sets with KD controlling tempo.",
        "Recovery volatility (Phase 28): KD's knee contusion carries 2-4% asymmetric downside risk at age 37."
      ],
      prosHome: ["KD CONFIRMED — dual initiator offense restored. 67% TS vs LAL, midrange matchup-proof", "UDOKA GAME 2 PEDIGREE: 4 bounce-back wins averaging +17.3pts in 2022 playoffs", "G1 jitters gone — Thompson/Sheppard/Smith have playoff reps now", "LAL shooting WILL regress (61% FG unsustainable) — HOU depth reasserts", "Sengun + KD dual-threat forces Smart to pick poison — no more free-roaming defense", "KD's gravity opens clean looks for Sheppard (41% 3PT) and Smith (36.8% 3PT)"],
      consHome: ["KD on minutes restriction (~28-30min) — knee 'tough to bend' per Udoka", "Clutch problems (-2.8 NetRtg) are systemic, not just jitters", "Sengun defensive vulnerability to Smart is structural — doesn't disappear with KD", "Lost G1 by 9 — must steal a road game to avoid 0-2 deficit", "Young team + KD chemistry concerns (burner scandal) — first game together in playoffs", "Recovery volatility: knee contusion at 37 carries asymmetric downside risk"],
      prosAway: ["HOME COURT — Crypto.com Arena crowd, LAL is higher seed", "LeBron facilitator mode proven — 13ast game plan is repeatable", "Smart's defensive blueprint established — held HOU to 33% in stretches", "1-0 series lead — can afford a loss and still lead", "Playoff pedigree (2.0) — LeBron's championship DNA, 14-6 vs HOU in last 20"],
      consAway: ["SHOOTING REGRESSION: 61% FG / 53% 3PT will NOT repeat — biggest G2 risk", "KD return neutralizes Smart's free-roaming defense — must guard KD on-ball now", "Kennard will be face-guarded — 5-5 3PT (100%) is the most obvious schematic target", "LeBron fatigue: 41 years old, 2-day turnaround, high-usage G1 (13ast)", "Still missing Doncic (hamstring, May 1) and Reaves (oblique, May 1) — no reinforcements coming"]
    },
    game3: {
      spread: "HOU -9.5", moneyline: "HOU -425 / LAL +325", ou: "O/U 205.5",
      pick: "HOU", confidence: "medium", projScore: "HOU 105 — LAL 100",
      schedule: "Fri Apr 24 — 8:00 PM ET — Prime Video",
      reasoning: "MODEL PICK: HOU (MEDIUM confidence, GRIND). This is a humility pick after going 0-2 on this series. The model has been consistently wrong about HOU-LAL because it overrates depth/talent and underrates coaching scheme mastery. However, three factors converge for G3 that justify picking HOU despite the model's track record:\n\n(1) HOME COURT CORRECTION — HOU was 28-13 at home (68.3%) during the regular season. G1 and G2 were both at Crypto.com Arena. The market agrees: BetMGM has HOU -9.5, implying a ~16-point home court swing. Toyota Center crowd + desperation (0-2, only ~7% of teams come back from 0-2) creates maximum urgency.\n\n(2) 3PT VARIANCE REGRESSION (BOTH DIRECTIONS) — LAL shot 46% 3PT in G2 (13-28), which is still well above playoff averages. HOU shot a historically awful 24% 3PT (7-29) — their 2-game average of 28.5% 3PT is ~9% below their season baseline of 37.2%. Even accounting for LAL's defensive scheme suppression (~3-4% structural discount), HOU's 3PT should regress UP to ~33-34%, while LAL's should regress DOWN to ~36%. Net swing: ~5-7 points from 3PT alone.\n\n(3) KD ADJUSTMENT — KD had 9 turnovers in G2 because LAL doubled from possession one and he tried to play through it. With 3 days between games (vs 2-day turnaround for G2), Udoka can scheme KD as a decoy/passer who attacks the double team rather than dribbling into it. KD's basketball IQ is elite (he identified the problem in his postgame quote) — expect significant reduction in turnovers. Project: KD 5-6 TOs → 3-4 TOs in G3.\n\nCOUNTER-ARGUMENTS: (a) LAL's defensive scheme is structural, not variance — Redick's doubling/zone has held HOU to 39% FG across 2 games. Home court doesn't change the scheme. (b) Smart and Kennard have been CONSISTENTLY elite (not just G1 outliers) — Smart averaging 20/7.5ast, Kennard 25ppg. This is their new level. (c) LeBron showed zero fatigue at 41 — model's fatigue penalties are wrong.\n\nWHY MEDIUM NOT HIGH: Model is 0-2 on this series. We're picking HOU primarily because of home court + 3PT regression math, but LAL has outperformed in every qualitative dimension (coaching, role-player elevation, defensive adaptability). If Redick's scheme translates on the road as well as it has at home, LAL could steal G3. The 9.5-point spread feels too high — we project a 5-point HOU win.\n\nTURNOVER ANALYSIS: HOU had 15 TOs in G2 (KD alone had 9). LAL forced those turnovers schematically. At home, HOU will have better ball security from crowd energy + rhythm. Project HOU TOs down to 12-13. LAL had a clean game with few turnovers — expect similar. Net: HOU gains ~3-4 possessions from reduced turnovers.\n\nROLE FLEXIBILITY: LAL 6.8 vs HOU 5.9. LAL's scheme versatility (LeBron shifting scorer↔facilitator, Smart as defensive menace + scorer, zone↔man↔doubling) remains superior, but it's slightly diminished on the road without home crowd energy. HOU's role flex improves with KD having a full week of practice with the team.\n\nREALISTIC SHOOTING: HOU projects ~44% FG (regression up from 40.4%), ~33% 3PT (up from 24%). LAL projects ~43% FG (down from 46%), ~35% 3PT (down from 46%). Road shooting typically drops ~2% for visiting teams. The FG% gap should narrow significantly from G2's 46% vs 40.4%.",
      g2Adjustments: [
        "LAL WON G2 101-94 — now leads 2-0. LAL has won both games through superior coaching and role-player elevation, NOT just shooting variance.",
        "KD G2 DISASTER: 23pts but 9 TOs, only 3 2H pts. LAL doubled from possession one. 3 days before G3 gives Udoka time to scheme a counter (KD as passer/decoy vs doubles).",
        "SMART BREAKOUT CONFIRMED: 25pts/5 3PM/7ast in G2 after 15pts/8ast in G1. Not an outlier — he IS LAL's #2. Model must stop predicting regression for Smart.",
        "KENNARD SUSTAINED: 23pts (8-13 FG) in G2. Model predicted 'bad' outlook with regression — wrong. LeBron-Kennard system is real. But road game + HOU home scheming could finally suppress him.",
        "HOU 3PT: 24% in G2 (7-29) — 2-game average 28.5%. This is ~9% below season baseline. Even with scheme suppression, expect regression UP to 33-34% at home.",
        "LAL 3PT: 46% in G2 (13-28) — still above sustainable levels. Road game + HOU home defense → project 35% 3PT for G3.",
        "LEBRON FATIGUE MODEL WAS WRONG: 28pts/8reb/7ast in G2 at 41. Increased scoring from G1 (19pts). Age-based fatigue penalties are too aggressive for playoff LeBron. However, 3-day rest helps both teams equally.",
        "HOME COURT SHIFT: G1-G2 at Crypto.com (LAL home). G3 at Toyota Center (HOU home, 28-13 regular season). Market swing: HOU -9.5 spread.",
        "HOU 0-2 DESPERATION: Only ~7% of teams come back from 0-2. Maximum urgency creates either a desperate bounce-back or a team that cracks under pressure. HOU's -2.8 clutch NetRtg is the concern.",
        "UDOKA HAS 3 DAYS: Longer prep window (vs 2-day turnaround for G2). Can install new wrinkles to counter LAL's doubling scheme. But Udoka was also 0-2 in G2 adjustments — his pedigree hasn't translated vs Redick.",
        "KD KNEE UPDATE: 3 extra days of rest since G2. Expect improved mobility and potentially higher shot volume. But recovery volatility at 37 remains a flag.",
        "O/U 205.5 (down from 207.5) — market expects continued defensive slugfest. Low-scoring game favors the home team."
      ],
      prosHome: ["HOME COURT — Toyota Center, HOU 28-13 at home (68.3%). Maximum crowd energy + desperation creates bounce-back urgency.", "3PT REGRESSION UP: HOU shot 28.5% avg across G1-G2, well below 37.2% season baseline. Even with scheme suppression, expect ~33-34% at home.", "KD ADJUSTMENT: 3 days to install new wrinkles. KD identified the doubling problem in postgame — expect him as passer/decoy to punish doubles rather than dribbling into them.", "Sengun CONSISTENT: 20/11 in G2 after 6-19 G1 — found his rhythm. At home + KD gravity = more efficient looks.", "Market agrees: -9.5 spread, -425 ML implies market expects comfortable HOU win at home.", "3 days rest helps KD's knee — more mobility, potentially no minutes restriction.", "HOU depth advantage reasserts on home court — Thompson/Sheppard/Smith play better with home crowd energy."],
      consHome: ["UDOKA IS 0-2 IN ADJUSTMENTS — has shown no schematic answer for LAL's zone/doubling defense across 2 games. Adjustment rating of 8 is unearned against Redick.", "KD CHEMISTRY: Only 1 playoff game with this team. 9 TOs suggest poor timing/reads with teammates. 3 days helps but chemistry takes longer.", "Closing problems (-2.8 clutch NetRtg) are SYSTEMIC — home court doesn't fix mental toughness in crunch time.", "HOU offense is structurally suppressed (39% FG, 28.5% 3PT across 2 games) — LAL's scheme travels, it's not venue-dependent.", "Turnovers: HOU had 15 TOs in G2 (KD 9). Even at home, LAL's doubling scheme will force turnovers.", "0-2 pressure could crack a young team rather than fuel them — mental fragility is HOU's Achilles heel.", "Smith Jr had 18pts in G2 but has been inconsistent — can't rely on him for sustained production."],
      prosAway: ["REDICK'S SCHEME MASTERY: 2-0 with a blueprint that works — doubling KD, zone defense, committee scoring. No reason to change what's working.", "SMART + KENNARD: Averaging 20pts/7.5ast and 25pts respectively through 2 games. This is their new level, not an outlier to regress from.", "LeBRON PLAYOFF MODE: 23.5/8/10 averages, seamlessly shifting scorer↔facilitator. Zero fatigue signs at 41. Legacy motivation vs KD is elite fuel.", "2-0 LEAD: Can afford a loss and still lead 2-1. Zero pressure — play loose. Only need to steal 1 road game to essentially end the series.", "DEFENSIVE ADAPTABILITY: LAL's zone/doubling/switching scheme is STRUCTURAL, not venue-dependent. It should travel to Houston.", "Playoff pedigree: LeBron's 4 championships, Smart's Finals experience vs HOU's young core having zero series wins."],
      consAway: ["ROAD GAME: LAL was 25-16 on the road (60.9%) — good but not elite. Expect ~2% shooting dip on the road.", "3PT REGRESSION DOWN: LAL shot 46% 3PT in G2, well above sustainable levels. Road game + regression → project ~35%.", "STILL MISSING DONCIC + REAVES: No reinforcements. If Smart or Kennard have an off night on the road, LAL has no backup plan.", "HOU DESPERATION: 0-2 teams play with nothing to lose — dangerous opponent. Maximum effort from HOU role players.", "CUMULATIVE FATIGUE: 3rd game in 6 days for LeBron at 41. Even if he's shown no signs, the mileage is real.", "Depth concerns: LAL's 7-man rotation is thin. If foul trouble hits Smart or Ayton, there's no quality replacement.", "Historically, teams rarely sweep on the road — market expects HOU to win at least one home game."]
    },
    coaching: {
      home: {
        coach: "Ime Udoka",
        adjustmentRating: 8,
        schemeCreativity: 5,
        urgency: 7,
        playoffRecord: "17-14",
        tendency: "Defense-first architect. Shortened rotation from 9-10 to 7-8 in playoffs. Prioritizes switchable defenders.",
        rotationPlan: "May bench Sheppard for defensive matchups. Eason/Capela get expanded minutes.",
        keyAdjustment: "Must solve LAL's doubling scheme on KD. Need to use KD as decoy/passer rather than primary scorer to exploit the double teams.",
        g1Performance: "D+ | HOU shot 37.6% FG — worst playoff shooting in Udoka's HC tenure. Had no schematic answer for LAL's zone defense toggling (.960 PPP allowed). The 5-different-defenders-on-LeBron plan partially worked (LeBron chose facilitating over scoring — 19pts/13ast), but that enabled Kennard's 27-pt explosion instead. Sheppard (6/20 FG) and Sengun (6/19 FG) were hunted defensively by Smart — Udoka failed to shelter them. HOU had 3 non-spacers on court at times vs LAL zone — roster construction problem, but Udoka didn't adjust lineup to counter. Credit: his halftime adjustments cut a 20pt deficit to 9, but the hole was too deep. Lost by 9 on the road — not catastrophic, but scheme was outclassed.",
        g2Performance: "D | KD's return backfired — LAL doubled him from possession one (per KD's own quote), producing 9 turnovers and only 3 2H pts. Udoka had no counter for LAL's doubling scheme. HOU shot 40.4% FG and 24% 3PT (7-29) — marginally better than G1's 37.6% but still awful. Credit: kept it closer than G1 (7pt loss vs 9pt loss) and Sengun bounced back (20/11). But the fundamental problem remains: LAL's zone/switching defense is structurally suppressing HOU's offense and Udoka has shown no schematic answer across 2 games. Lost by 7 on the road — going home 0-2 with defensive identity in crisis."
      },
      away: {
        coach: "JJ Redick",
        adjustmentRating: 8,
        schemeCreativity: 9,
        urgency: 6,
        playoffRecord: "2-0",
        tendency: "Offensive innovator. Multiple actions beyond just LeBron iso. Committee approach without Doncic/Reaves.",
        rotationPlan: "8-man rotation. Smart becomes primary secondary playmaker. Kennard critical for spacing.",
        keyAdjustment: "Pre-planned KD doubling scheme executed perfectly. Committee scoring with LeBron shifting between facilitator and scorer modes game-to-game.",
        g1Performance: "A | Masterclass in first-ever playoff game as HC. Designed LeBron facilitator mode (19pts/13ast — 93rd pctile points created) that unlocked entire roster. Kennard deployment as primary scorer was a pre-planned scheme, not desperation — LeBron-Kennard two-man game had +8.7 NetRtg in 27 regular season games. Zone/man defense toggling held HOU to 37.6% FG by forcing non-spacers into bad shots. Smart as secondary playmaker (15pts/8ast) was a role innovation. 61% team FG was scheme-driven efficiency, not random variance. Only concern: this shooting level (61% FG, 53% 3PT) is historically unsustainable.",
        g2Performance: "A+ | MASTERCLASS COUNTER to KD's return. Doubled KD from possession one — a pre-planned scheme that produced 9 KD turnovers and only 3 2H pts. Shifted LeBron from G1 facilitator (19pts/13ast) to G2 scorer (28pts/7ast) seamlessly — opponent can't gameplan for both modes. Smart elevated to 25pts/5 3PM/7ast as the clear #2 scorer. Kennard sustained at 23pts despite HOU scheming (8-13 FG). Team FG% regressed from 61% to 46% as expected, but WON ANYWAY — proving G1 wasn't just a shooting fluke but a genuine scheme advantage. LAL's defensive adaptability (zone → doubling → switching) is elite. Redick is 2-0 and has outcoached Udoka in every dimension. Adjusted adjustment rating up to 8."
      },
      bestLineups: {
        home: { players: ["KD","Sheppard","A.Thompson","J.Smith Jr.","Sengun"], netRtg:-3.5, ortg:108.5, drtg:112.0, min:48, note:"G2 starting 5 with KD. KD had 23pts but 9 TOs (doubled from possession one). Sengun bounced back (20/11). HOU shot 40.4% FG. Lost 94-101." },
        away: { players: ["Smart","Kennard","Hachimura","LeBron","Ayton"], netRtg:3.5, ortg:112.0, drtg:108.5, min:48, note:"G2 starting 5. LeBron 28/8/7. Smart 25pts/5 3PM/7ast. Kennard 23pts. Shot 46% FG. Won 101-94." }
      },
      roleChanges: [
        { team:"HOU", player:"Sheppard", regSeason:"Starting SG, 30 MPG", playoff:"May lose minutes. Defensive liability vs LeBron lineups", impact:"down", reason:"Udoka historically benches weak defenders in playoffs" },
        { team:"HOU", player:"Eason", regSeason:"Bench energy, 18 MPG", playoff:"Expanded to 24+ MPG. Defensive versatility needed", impact:"up", reason:"Fills Sheppard's minutes with defensive toughness" },
        { team:"LAL", player:"LeBron", regSeason:"Third option, 28 MPG, 20.9 PPG", playoff:"Primary scorer/facilitator, 38+ MPG, ~28 PPG", impact:"up", reason:"Without Doncic/Reaves, becomes focal point" },
        { team:"LAL", player:"Smart", regSeason:"Defensive specialist, 28 MPG", playoff:"Secondary playmaker + defender, 34 MPG", impact:"up", reason:"Redick needs his ball-handling without Reaves" },
        { team:"LAL", player:"Kennard", regSeason:"Spot-up shooter, 22 MPG", playoff:"Critical spacing, 28+ MPG", impact:"up", reason:"44.3% from 3 essential with limited shot creation" }
      ]
    },
    schemePersistence: {
      away: { isSchemeDriven: true, fgSuppression: 0.06, description: "LAL zone/switching held HOU to 37.6% G1 and 40.4% G2 — structural, not variance. Redick's team defense with length contests 6-8ft shots." },
      home: null
    },
    starReturnPenalty: [
      { player: "Kevin Durant", gamesOut: 1, severity: 0.15 }
    ],
    // G2 Player Outlook — Bayesian blend: 55% model / 45% prior (season avg)
    // G1 shooting: HOU 37.6% FG vs LAL 60.6% FG — extreme outliers both ways, heavy regression expected
    // KD CONFIRMED PLAYING G2 (right knee contusion, limited mobility, ~28-30min restriction)
    // HOU transforms: 1→2 initiators. Smart can't hunt Sengun AND guard KD.
    // LAL: Kennard 9-13 (69.2%) is unsustainable; HOU will scheme against him. LeBron fatigue factor at 41.
    g2PlayerOutlook: {
      home: [ // HOU
        // Sengun: G1 6-19 (31.6%) — Smart disrupted post rhythm. Season 54.2% FG.
        // Bayesian: 0.55*0.316 + 0.45*0.542 = 0.418. But KD return + adjustment = bump to ~0.48
        // KD's presence forces Smart to guard KD → Sengun faces weaker defenders
        { player:"Alperen Sengun", outlook:"good", projFgPct:0.48, ptsRange:[18,26], reason:"G1 was worst FG% game of season (31.6%) — Smart's relentless disruption was real but CRITICALLY: KD's confirmed return for G2 forces Smart to guard KD on-ball, removing the primary source of Sengun's G1 struggles. With Smart pulled away, Sengun faces Ayton/Hayes — much more favorable matchups. Udoka will adjust with more high-post face-ups and KD-Sengun P&R (1.12 PPP, 89th percentile in reg season). Bayesian regression from 31.6% toward season 54.2% baseline, plus KD-gravity uplift. Upgraded from 'neutral-good' to 'good'.", confidence:"high" },

        // Thompson: G1 7-18 (38.9%), 17pts. Season 50.8% FG. Physical but inefficient.
        // Bayesian: 0.55*0.389 + 0.45*0.508 = 0.443
        { player:"Amen Thompson", outlook:"neutral", projFgPct:0.44, ptsRange:[14,20], reason:"G1 struggled from field (38.9%) but contributed everywhere (7reb/7ast/3stl). Season 50.8% shooter — expect partial regression up. Home game helps but LAL's defensive scheme (zone + Smart switching) remains effective.", confidence:"medium" },

        // Sheppard: G1 6-20 (30.0%), 5-14 3PT. Season 45.1% FG. Rookie nerves.
        // Bayesian: 0.55*0.300 + 0.45*0.451 = 0.368. Slight bump for home comfort.
        { player:"Reed Sheppard", outlook:"neutral", projFgPct:0.38, ptsRange:[12,18], reason:"G1 rookie playoff jitters (30% FG, 4 TOs). Season 45.1% FG, 41% 3PT — too good to stay cold. Home crowd settles nerves. But LAL will continue chasing him off screens. Expect bounce-back but not full regression.", confidence:"medium" },

        // Smith Jr: G1 5-14 (35.7%), 3-9 3PT. Season 46.2% FG.
        // Bayesian: 0.55*0.357 + 0.45*0.462 = 0.404
        { player:"Jabari Smith Jr.", outlook:"neutral", projFgPct:0.40, ptsRange:[12,18], reason:"G1 cold shooting (35.7%) but grabbed 12 boards (5 offensive). Season 46.2% FG — expect bounce-back. 3PT regression likely (3-9 in G1, 36.8% season). Home game helps rhythm.", confidence:"medium" },

        // KD: OUT G1, CONFIRMED PLAYING G2. Line HOU -5.5 (market priced in return).
        // Season 52.4% FG, 26.0 PPG. Knee limits explosiveness — project conservative FG%.
        // Recovery volatility (Phase 28): knee contusion at 37 = 2-4% asymmetric downside risk.
        { player:"Kevin Durant", outlook:"neutral-good", projFgPct:0.47, ptsRange:[18,26], reason:"CONFIRMED SUITING UP for G2. Went through half of Monday practice — Udoka says knee is 'tough to bend in certain ways'. Limited mobility means reduced explosiveness: drives and post-ups will be limited, but midrange game (67% TS vs LAL this season) doesn't require full mobility. Minutes restriction likely (~28-30min). At 37, Recovery Volatility flag (Phase 28) applies — 2-4% asymmetric downside risk for knee issues. Transforms HOU from 1→2 initiators: Smart must guard KD on-ball, freeing Sengun from relentless disruption. Even at 80% capacity, adds ~18-22pts and gravity that opens Sheppard/Smith 3PT looks. FG% projection conservative at 47% (down from 52.4% season) reflecting limited practice + knee stiffness + first game back.", confidence:"medium" },

        // Eason: G1 7-7 (100%!!) 16pts/10reb in 24min. Massive overperformance.
        // Season 48.7% FG. Bayesian: severe regression to ~0.50
        { player:"Tari Eason", outlook:"neutral", projFgPct:0.50, ptsRange:[8,14], reason:"G1 was outlier perfection (7-7 FG, 100%). Season 48.7% — massive regression expected. Energy and rebounding (10reb) are repeatable; shooting efficiency is not. Still valuable bench energy.", confidence:"medium" },

        // Okogie: G1 2-4 (50%), 7pts in 26min as starter. Defensive role.
        { player:"Josh Okogie", outlook:"neutral", projFgPct:0.42, ptsRange:[4,8], reason:"Defensive starter — scoring is secondary. G1 was fine (2-4 FG). May lose starter role if KD returns. Value is perimeter defense vs LeBron/Kennard.", confidence:"low" }
      ],
      away: [ // LAL
        // LeBron: G1 9-15 (60.0%), 19pts/13ast. Season 52.1% FG. Facilitator mode.
        // Bayesian: 0.55*0.600 + 0.45*0.521 = 0.564. But road game = slight dip.
        { player:"LeBron James", outlook:"good", projFgPct:0.52, ptsRange:[22,30], reason:"G1 facilitator mode (19pts/13ast on 60% FG) was deliberate choice. With HOU adjusting to Kennard, LeBron likely shifts to more scoring. Season 52.1% + playoff pedigree. FATIGUE FACTOR: LeBron is 41 years old on 2-day turnaround; G1 was high-usage (13ast requires constant decision-making load). If KD returns for HOU, game pace increases → more energy expenditure. FG% dipped from 0.54 to 0.52 to account for age-related fatigue. Still 'good' outlook — playoff LeBron doesn't rest. LAL still missing Luka (hamstring, out May 1) and Reaves (oblique, out May 1).", confidence:"high" },

        // Kennard: G1 9-13 (69.2%), 5-5 3PT!! 27pts career playoff high.
        // Season 45.5% FG. Bayesian: 0.55*0.692 + 0.45*0.455 = 0.585. HOU will scheme hard.
        // Heavy regression — HOU will prioritize taking him away.
        { player:"Luke Kennard", outlook:"bad", projFgPct:0.44, ptsRange:[12,18], reason:"G1 was career-best outlier (69.2% FG, 5-5 3PT). HOU WILL scheme against him G2 — expect face-guarding, aggressive closeouts, and switching. Season 45.5% FG is the anchor. Road game + defensive attention = heavy regression. Still valuable as spacer even if shots don't fall.", confidence:"high" },

        // Ayton: G1 8-10 (80.0%), 19pts/11reb. Season 55.8% FG.
        // Bayesian: 0.55*0.800 + 0.45*0.558 = 0.691. But that's still inflated — cap at ~0.58
        { player:"Deandre Ayton", outlook:"neutral", projFgPct:0.58, ptsRange:[14,20], reason:"G1 dominant at rim (80% FG, 11reb) — Sengun/Capela couldn't contain him. Season 55.8% FG provides floor. Some regression from 80% but HOU interior D is weak. Expect continued efficiency on lower volume.", confidence:"medium" },

        // Smart: G1 5-12 (41.7%), 15pts/8ast. Season 41.2% FG. Roughly at baseline.
        // Bayesian: 0.55*0.417 + 0.45*0.412 = 0.415
        { player:"Marcus Smart", outlook:"neutral", projFgPct:0.42, ptsRange:[10,16], reason:"G1 was right at season baseline (41.7% vs 41.2% season). Secondary playmaker role (8ast) is sustainable. Smart's value is defense (held Sengun to 6-19) — offense is bonus. Expect similar efficiency.", confidence:"high" },

        // Hachimura: G1 6-10 (60.0%), 14pts. Season 49.1% FG.
        // Bayesian: 0.55*0.600 + 0.45*0.491 = 0.551. Some regression.
        { player:"Rui Hachimura", outlook:"neutral", projFgPct:0.50, ptsRange:[10,16], reason:"G1 efficient (60% FG) with 3 steals and 2 blocks — defensive breakout. Season 49.1% provides floor. Expect slight regression but HOU's wing defense doesn't specifically target him. Solid two-way game continues.", confidence:"medium" },

        // LaRavia: G1 1-3 (33.3%), 6pts in 18min. Bench role.
        { player:"Jake LaRavia", outlook:"neutral", projFgPct:0.45, ptsRange:[4,10], reason:"Bench wing with limited shot attempts. G1 was fine for his role. Provides defensive versatility. Scoring not his primary value.", confidence:"low" }
      ]
    },
    // G3 Player Outlook — Bayesian blend: 40% model (2-game avg) / 30% G2 recency / 30% season baseline
    // G1: HOU 37.6% FG vs LAL 60.6% FG | G2: HOU 40.4% FG vs LAL 46% FG
    // HOME COURT SHIFT: G3 at Toyota Center (HOU home). HOU was 28-13 at home.
    // KD had 9 TOs in G2 — expect Udoka to scheme KD as passer/decoy vs doubles.
    // Smart + Kennard are now proven — stop predicting regression. Road game may dampen slightly.
    g3PlayerOutlook: {
      home: [ // HOU — at HOME for first time
        // Sengun: G1 6-19 (31.6%), G2 improved to ~50% (20pts/11reb). Season 54.2% FG.
        // 2-game blend: 0.40*(~0.41 avg) + 0.30*(~0.50 G2) + 0.30*(0.542 season) = ~0.48. Home bump → 0.50
        { player:"Alperen Sengun", outlook:"good", projFgPct:0.50, ptsRange:[18,26], reason:"G2 bounce-back (20pts/11reb) confirmed he's effective when KD draws attention. Season 54.2% FG is the anchor. Home court + KD gravity pulling Smart away = Sengun faces favorable matchups (Ayton/Hayes). Bayesian: blend of G1 disaster (31.6%), G2 recovery (~50%), and season baseline → 50% FG at home. Udoka will feature more high-post face-ups. THE most reliable HOU scorer right now.", confidence:"high" },

        // Thompson: G1 7-18 (38.9%), G2 16pts. Season 50.8% FG.
        // 2-game blend: 0.40*(~0.40) + 0.30*(~0.42 G2) + 0.30*(0.508) = ~0.44. Home bump → 0.46
        { player:"Amen Thompson", outlook:"neutral-good", projFgPct:0.46, ptsRange:[14,20], reason:"Consistent effort across G1-G2 (17pts, 16pts) with all-around contributions. Season 50.8% FG. Home court helps rhythm. LAL's zone/switching still a problem but Thompson's athleticism is a counter — expect slight efficiency improvement at home. Upgraded from 'neutral' due to consistent production.", confidence:"medium" },

        // KD: G2: 23pts on 12 shots but 9 TOs, 3 2H pts. Season 52.4% FG.
        // Critical: Model must account for LAL's doubling scheme. KD's adjustment = fewer TOs, more assists.
        // Blend: 0.40*(G2 ~0.45) + 0.30*(0.45 projected) + 0.30*(0.524 season) = ~0.47. Home + 3 days rest → 0.48
        { player:"Kevin Durant", outlook:"neutral", projFgPct:0.48, ptsRange:[20,28], reason:"G2 was 23pts but with 9 turnovers — net impact was negative. LAL doubled him from possession one and he dribbled into traps. KEY G3 VARIABLE: Can KD adjust to play as passer/decoy vs doubles? His basketball IQ says yes, but chemistry with teammates is only 1 game old. 3 extra days of rest helps knee mobility and team chemistry. Home court adds rhythm. But LAL WILL continue doubling — Redick won't change what's working. Project reduced TOs (4-5 instead of 9) and higher shot quality from better reads. FG% conservative at 48% — still limited by knee and defensive attention. Recovery volatility flag remains at 37.", confidence:"medium" },

        // Sheppard: Didn't have clear G2 stats from recap, but was part of 7-29 3PT team performance.
        // G1: 6-20 (30.0%). Season 45.1% FG. Home court should help.
        // Blend: 0.40*(~0.33 avg) + 0.30*(~0.35) + 0.30*(0.451) = ~0.37. Home bump → 0.40
        { player:"Reed Sheppard", outlook:"neutral", projFgPct:0.40, ptsRange:[12,20], reason:"Has been cold across G1-G2 (~33% FG). Season 45.1% FG, 41% 3PT — too talented to stay this cold. Home crowd settles young player nerves. LAL will still chase him off screens but at Toyota Center he'll get more comfortable rhythm. 3PT regression should help: project ~36% 3PT (up from ~28% in G1-G2). Upside potential if he gets hot.", confidence:"medium" },

        // Smith Jr: G2: 18pts. G1: 5-14 (35.7%). Season 46.2% FG.
        // Blend: 0.40*(~0.40) + 0.30*(~0.43 G2) + 0.30*(0.462) = ~0.43. Home → 0.44
        { player:"Jabari Smith Jr.", outlook:"neutral-good", projFgPct:0.44, ptsRange:[14,20], reason:"G2 bounce-back (18pts) after cold G1. Season 46.2% FG. Home court helps his catch-and-shoot game — Toyota Center crowd creates energy for open 3PT attempts. 3PT regression up from G1-G2 levels. If KD draws doubles and passes to Smith, he could have his best game. Upgraded from 'neutral'.", confidence:"medium" },

        // Eason: G1 7-7 (100%), G2 stats not highlighted. Season 48.7% FG.
        { player:"Tari Eason", outlook:"neutral", projFgPct:0.48, ptsRange:[8,14], reason:"G1 perfection (7-7) was a massive outlier. Season 48.7% FG provides anchor. Energy and rebounding are his value — scoring is secondary. Home crowd amplifies his bench energy. Solid role player at home.", confidence:"medium" }
      ],
      away: [ // LAL — ROAD game at Toyota Center
        // LeBron: G1 9-15 (60%) 19pts/13ast (facilitator), G2 28pts/7ast (scorer). Season 52.1% FG.
        // 2-game avg 23.5pts. G3 road game = likely balanced scorer/facilitator split.
        // Blend: 0.40*(0.53) + 0.30*(~0.50 G2) + 0.30*(0.521) = ~0.52. Road dip → 0.48
        // CRITICAL: Team projects 100pts. LeBron can't average 28 AND have Smart/Kennard at 20 each.
        { player:"LeBron James", outlook:"good", projFgPct:0.48, ptsRange:[20,28], reason:"Averaging 23.5/8/10 through 2 games with seamless scorer↔facilitator shifting. G1 was facilitator mode (19pts/13ast), G2 was scorer mode (28pts/7ast). G3 ROAD GAME projects a balanced split: ~22-24pts with 8-9 assists. At 41, LeBron is playing elite playoff basketball — but road games historically tilt him toward facilitating (he trusts teammates to score in hostile environments). ROAD dip: expect ~48% FG (down from 53% home average). Team total of 100 means LeBron, Smart, and Kennard can't ALL score 25+ — someone facilitates, and LeBron's 13-assist G1 shows he'll take that role when needed.", confidence:"high" },

        // Smart: G1 5-12 (41.7%) 15pts/8ast, G2 8-13 (61.5%) 25pts/7ast. Season 41.2% FG.
        // 2-game avg: ~52% FG, 20pts/7.5ast. Blend: 0.40*(0.52) + 0.30*(0.615 G2) + 0.30*(0.412) = ~0.49. Road → 0.44
        // Breakout confirmed but road game + team total of 100 caps ceiling.
        { player:"Marcus Smart", outlook:"good", projFgPct:0.44, ptsRange:[14,22], reason:"BREAKOUT CONFIRMED: 20pts/7.5ast average through 2 games. G2 was 25pts/5 3PM/7ast (8-13 FG). Smart's playoff pedigree (2022 DPOY, Finals) is real — this is his level. ROAD GAME adds meaningful efficiency dip (~3-4% FG on road historically). G2's 61.5% FG was an outlier even for elevated Smart — project 44% FG on the road. His defensive impact (forcing KD into 9 TOs) is as valuable as scoring. Expect 16-20pts with continued elite defense — slightly below his 2-game average due to road regression.", confidence:"high" },

        // Kennard: G1 9-13 (69.2%) 27pts, G2 8-13 (61.5%) 23pts. Season 45.5% FG.
        // 2-game avg: 65.4% FG, 25ppg. Blend: 0.40*(0.654) + 0.30*(0.615) + 0.30*(0.455) = ~0.58. Road → 0.46
        // Road regression is the BIGGEST factor. HOU has 2 games of film to scheme against him.
        // CRITICAL: Team total 100. Can't have LeBron 24 + Smart 18 + Kennard 20 = 62 (leaves 38 for 3 others).
        { player:"Luke Kennard", outlook:"neutral", projFgPct:0.46, ptsRange:[14,22], reason:"Averaging 25pts on 65.4% FG through 2 games — the LeBron-Kennard system (+8.7 NetRtg) is proven. However, ROAD GAME is the single biggest regression factor: unfamiliar rims, HOU home crowd noise disrupting catch-and-shoot rhythm, louder defensive communication. HOU has 2 games of film to scheme against Kennard specifically — expect more aggressive closeouts and switching. FG% regresses to 46% (still above season 45.5% because the LeBron system creates open looks, but road context tempers the upside). G2's 61.5% FG was unsustainable even at home. Project 16-20pts — still productive but down from the 25ppg he had at Crypto.com.", confidence:"medium" },

        // Ayton: G1 8-10 (80%) 19pts/11reb. Season 55.8% FG. G2 stats not highlighted in recap.
        // Blend conservatively: road game + Sengun improving = tougher matchup
        { player:"Deandre Ayton", outlook:"neutral", projFgPct:0.54, ptsRange:[12,18], reason:"G1 was dominant (80% FG, 19/11) but G2 not highlighted in recap suggesting lower-key game. Season 55.8% FG. Sengun has found his rhythm (20/11 G2) making the interior matchup tougher. Road game + improved HOU interior defense → project closer to season baseline. Still efficient but on lower volume.", confidence:"medium" },

        // Hachimura: G1 6-10 (60%), 14pts. Season 49.1% FG. Solid 2-way.
        { player:"Rui Hachimura", outlook:"neutral", projFgPct:0.48, ptsRange:[10,16], reason:"Consistent two-way contributor. Season 49.1% FG provides the anchor. Road game slight dip. HOU doesn't specifically target him — he benefits from the attention on LeBron/Smart/Kennard. Expect similar production.", confidence:"medium" },

        // LaRavia: Bench role. Road game.
        { player:"Jake LaRavia", outlook:"neutral", projFgPct:0.43, ptsRange:[4,8], reason:"Bench wing. Road game reduces his limited scoring opportunities. Defensive versatility is his primary value. Small sample sizes make projections unreliable.", confidence:"low" }
      ]
    },
    games: [{num:1,result:"LAL",homeScore:98,awayScore:107,winner:"LAL",notes:"UPSET. LAL 107-98. LeBron 19pts/13ast (facilitator masterclass — 93rd pctile points created, 95th rim assists per Databallr). Career-high 8 Q1 assists. Kennard 27pts/7-11 3PT (career playoff-high). Ayton 19pts/11reb. Smart 15pts/8ast/4 threes. LAL shot 60.6% FG, toggled zone/man defense (.960 PPP allowed in zone). HOU shot 37.6% — Sengun 6/19, Sheppard 6/20. HOU had 3 non-spacers on court at times vs LAL zone. WPA: MVP Kennard +15.2%, LVP Sheppard -14.6%. FG shooting was the decisive factor (LAL 60.6% vs HOU 37.6%)."},{num:2,result:"LAL",homeScore:94,awayScore:101,winner:"LAL",notes:"LAL 101-94 at Crypto.com Arena. LAL leads 2-0. LeBron 28/8/7 (shifted to scorer mode from G1 facilitator). Smart 25pts/5 3PM/7ast (8-13 FG — 2-game breakout pattern). Kennard 23pts (8-13 FG, sustained production). KD HOU playoff debut: 23pts but 9 TOs, only 3pts in 2H — LAL doubled him from possession one, early foul trouble. Sengun 20/11. Smith Jr 18. Thompson 16. HOU: 36-89 FG (40.4%), 7-29 3PT (24%), 15-19 FT, 42 REB, 23 AST, 15 TO. LAL: 33-72 FG (46%), 13-28 3PT (46%), 22-28 FT. LAL nursed small lead through 4Q. Smart→LeBron dunk with 55sec left sealed it. KD quote: 'They started doubling me from possession one.'"},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "OKC-PHX", conf: "West", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Lu Dort", target:"Devin Booker", dLebron:0.356, targetUsg:29.0, note:"G1 RESULT: Booker scored 23pts but PHX shot 35% first half and committed 17 TOs. Dort's clamp + OKC's team defense overwhelmed PHX. Booker was limited in creation — PHX's sole-initiator problem confirmed as OKC built 35-20 Q1 lead." },
      awayDefOnHome: { defender:"Dillon Brooks", target:"Shai Gilgeous-Alexander", dLebron:-0.082, targetUsg:30.8, note:"G1 RESULT: SGA scored 25pts (5-18 FG, 15-17 FT) in only 29 min — sat Q4 blowout. Brooks was irrelevant defensively — SGA created at will (7ast) and OKC's multi-initiator attack (Williams 22, Holmgren 16) made Brooks' assignment meaningless. Negative D-LEBRON confirmed." }
    },
    homeTeam: {
      name: "Thunder", city: "Oklahoma City", abbr: "OKC", seed: 1, record: "64-18",
      systemBonus: 2.5, // elite system
      playoffPedigree: 2, // defending champs
      offStyle: "SGA elite P&R/ISO initiator (31.1ppg, 55.3% FG) + five-out motion offense. Williams (17.1ppg) secondary creator. Mitchell (13.6ppg) third-level creation off bench. G1: 3 players 16+ pts with SGA on rest. Deepest roster in NBA.", initiators: 3,
      color: "#007AC1", color2: "#EF6100",
      advStats: { ortg:119.8, drtg:108.2, netRtg:11.6, pace:98.5, ts:59.4, efg:55.8, tov:12.1, reb:52.4, ortgRk:2, drtgRk:2, clutchNetRtg:8.5, last10:"8-2", fgPct:52.8, threePct:37.2, ftPct:80.8, orbPct:25.9 },
      players: [
        { name:"Shai Gilgeous-Alexander", pos:"PG", rating:96, ppg:31.1, rpg:4.3, apg:6.6, fgp:55.3, per:30.6, ts:67.0, epm:9.8, bpm:11.7, ws48:.323, onOff:12.1, clutch:9.4, vorp:7.8, usg:33.0, injury:null, lebron:6.661, oLebron:5.763, dLebron:0.898, war:12.453, offRole:"Shot Creator", defRole:"Low Activity",
          matchupNote:"Historic season: 31.1ppg on 55.3% FG, 38.6% 3PT, 67% TS. Scoring streak surpassed Wilt Chamberlain. +12.1 on/off league-best. 2024: led OKC to WCF (lost to DAL in 6), 2025 champion. G1: 25pts (5-18 FG, 0-4 3PT, 15-17 FT) in only 29min — sat Q4 blowout. Created at will (7ast). RESTED for G2.", baseRating:96, starCeiling:2, injuryRisk:0, playoffAscension:0.5 },
        { name:"Chet Holmgren", pos:"C", rating:82, ppg:17.1, rpg:8.9, apg:1.7, fgp:55.7, per:22.8, ts:62.1, epm:4.5, bpm:4.8, ws48:.182, onOff:6.8, clutch:6.2, vorp:3.4, usg:25.0, injury:null, lebron:5.103, oLebron:1.638, dLebron:3.465, war:9.283, offRole:"Shot Creator", defRole:"Mobile Big",
          matchupNote:"17.1ppg, 8.9rpg, 55.7% FG, 36.2% 3PT. Stretch-5 who protects rim + spaces floor. D-LEBRON 3.465 elite. 2024 R2 + 2025 champion. G1: 16pts (5-10 FG, 2-6 3PT, 4-4 FT), 7reb, 2stl, 2blk in 25min — dominated PHX interior with no matchup. PHX has zero answer for him. RESTED for G2.", baseRating:82, starCeiling:1, injuryRisk:0.3 },
        { name:"Jalen Williams", pos:"SF", rating:80, ppg:17.1, rpg:4.6, apg:5.5, fgp:48.4, per:20.4, ts:58.8, epm:3.8, bpm:3.5, ws48:.158, onOff:5.2, clutch:6.8, vorp:3.0, usg:25.8, injury:"Returning from wrist surgery + hamstring — rhythm returning", lebron:1.597, oLebron:1.441, dLebron:0.156, war:2.378, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"17.1ppg, 4.6rpg, 5.5apg, 48.4% FG, 39.9% 3PT in injury-limited 33 games. All-NBA honoree last season. G1: BACK TO FORM — 22pts (9-15 FG, 2-5 3PT), 7reb, 6ast, 1stl, 1blk in 29min. SI: 'attacked hard downhill with finesse and explosiveness.' Seamless reintegration. Led charge with SGA off floor. Rating upgraded 76→80 reflecting G1 return to form.", baseRating:82, starCeiling:1, injuryRisk:0.4, activeInjury:{type:"wrist + hamstring",severity:0.3,note:"G1 RESOLVED CONCERNS: 22pts (9-15 FG) in 29min — best performance since return. SI reported he 'appeared as his old self.' Comfortable shooting 3s again (2-5). Severity downgraded 0.5→0.3 post-G1. OKC depth means manageable load."} },
        { name:"Lu Dort", pos:"SG", rating:68, ppg:8.3, rpg:3.5, apg:1.2, fgp:38.5, per:13.2, ts:55.8, epm:1.8, bpm:1.5, ws48:.092, onOff:3.8, clutch:5.8, vorp:1.5, usg:20.5, injury:null, lebron:-0.815, oLebron:-1.171, dLebron:0.356, war:1.904, offRole:"Stationary Shooter", defRole:"Point of Attack",
          matchupNote:"8.3ppg, 3.5rpg, 38.5% FG, 34.4% 3PT. Value is entirely defensive — elite perimeter stopper. Takes toughest assignment every night. G1: 8pts (3-8 FG, 2-6 3PT) in 24min, clamped Booker. Rating 70→68 reflecting reduced offensive role. 2024 playoff + 2025 champion experience.", baseRating:68 },
        { name:"Isaiah Hartenstein", pos:"C", rating:70, ppg:9.2, rpg:9.4, apg:3.2, fgp:62.2, per:18.2, ts:59.4, epm:2.2, bpm:2.8, ws48:.138, onOff:4.1, clutch:5.2, vorp:2.0, usg:20.8, injury:null, lebron:3.554, oLebron:0.957, dLebron:2.597, war:4.253, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"9.2ppg, 9.4rpg, 62.2% FG. Physical rebounder and interior presence alongside Holmgren. G1: 8pts (4-4 FG), 4reb, 8ast in 20min — facilitator role emerged. D-LEBRON 2.597 elite. Rating 72→70 reflecting reduced scoring role.", baseRating:70 },
        { name:"Jared McCain", pos:"SG", rating:55, ppg:6.6, rpg:2.0, apg:1.7, fgp:38.5, per:10.0, ts:53.0, epm:-0.5, bpm:-1.0, ws48:.060, onOff:0.0, clutch:4.0, vorp:0.3, usg:16.0, injury:null, lebron:-2.656, oLebron:-0.809, dLebron:-1.847, war:-0.129, offRole:"Secondary Ball Handler", defRole:"Low Activity",
          matchupNote:"MASSIVE MODEL CORRECTION: 15.2→6.6ppg. Model had his PHI stats, not OKC stats since deadline trade. 37.8% 3PT provides spacing off bench. G1: 5pts (2-5 FG, 1-3 3PT) in 8min garbage time. Rating 69→55 reflecting actual reduced OKC role.", baseRating:55 },
        { name:"Alex Caruso", pos:"SG", rating:62, ppg:6.2, rpg:2.8, apg:2.0, fgp:42.3, per:12.4, ts:54.8, epm:1.8, bpm:2.2, ws48:.098, onOff:4.2, clutch:6.5, vorp:1.6, usg:17.2, injury:null, lebron:2.297, oLebron:0.166, dLebron:2.132, war:3.035, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"6.2ppg, 2.8rpg, 2.0apg, 42.3% FG, 29.3% 3PT. Value is defensive — D-LEBRON 2.132, +4.2 on/off. Multiple playoff runs (CHI, LAL, OKC 2025 champ). G1: 2pts (1-3 FG) in 13min but +14 in limited action. Closes games when OKC needs perimeter D.", baseRating:62 },
        { name:"Isaiah Joe", pos:"SG", rating:60, ppg:11.1, rpg:2.5, apg:1.3, fgp:44.0, per:13.5, ts:61.0, epm:1.2, bpm:0.5, ws48:.095, onOff:2.0, clutch:5.0, vorp:1.1, usg:20.0, injury:null, lebron:0.93, oLebron:0.947, dLebron:-0.017, war:3.202, offRole:"Movement Shooter", defRole:"Low Activity",
          matchupNote:"Elite 3PT shooter (42% from deep). Spacer who stretches defenses for SGA drives", baseRating:60 },
        { name:"Ajay Mitchell", pos:"PG", rating:62, ppg:13.6, rpg:3.3, apg:3.6, fgp:48.5, per:15.0, ts:58.0, epm:1.0, bpm:0.5, ws48:.090, onOff:2.0, clutch:5.0, vorp:1.2, usg:20.5, injury:null, lebron:2.391, oLebron:0.881, dLebron:1.51, war:4.465, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"MAJOR LEAP: 13.6ppg, 3.6apg, 48.5% FG, 34.7% 3PT — scoring and stability when starters sit. Model had 10.5ppg (underestimated by 30%). G1: 9pts (3-7 FG, 3-4 3PT) in 22min, +22. Rating 56→62.", baseRating:56 },
        { name:"Cason Wallace", pos:"SG", rating:60, ppg:8.6, rpg:3.1, apg:2.6, fgp:38.5, per:11.0, ts:52.0, epm:0.5, bpm:0.2, ws48:.072, onOff:1.5, clutch:4.5, vorp:0.8, usg:16.0, injury:null, lebron:1.5, oLebron:0.0, dLebron:1.5, war:3.0, offRole:"Secondary Ball Handler", defRole:"Point of Attack",
          matchupNote:"MODEL WAS MISSING. 8.6ppg, 3.1rpg, 2.6apg, 34.4% 3PT. Defensive composure in playoff rotations. G1: 6pts (3-5 FG) in 21min, +23 (highest +/- on team!). 4ast, 2stl, 2blk — elite defensive impact. 2024 playoff + 2025 champion.", baseRating:60 },
        { name:"Aaron Wiggins", pos:"SF", rating:58, ppg:9.4, rpg:3.1, apg:1.7, fgp:43.1, per:11.5, ts:54.0, epm:0.2, bpm:-0.3, ws48:.065, onOff:0.5, clutch:4.0, vorp:0.5, usg:17.5, injury:null, lebron:0.5, oLebron:0.2, dLebron:0.3, war:1.5, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"MODEL WAS MISSING. 9.4ppg, 3.1rpg, 43.1% FG, 35.6% 3PT. Provides wing scoring and versatility. G1: 2pts in 8min garbage time.", baseRating:58 },
        { name:"Jaylin Williams", pos:"PF", rating:56, ppg:7.2, rpg:5.5, apg:2.4, fgp:42.3, per:11.0, ts:54.0, epm:0.0, bpm:-0.5, ws48:.058, onOff:0.0, clutch:3.5, vorp:0.3, usg:16.0, injury:null, lebron:0.5, oLebron:-0.3, dLebron:0.8, war:1.0, offRole:"Stretch Big", defRole:"Mobile Big",
          matchupNote:"MODEL WAS MISSING. 7.2ppg, 5.5rpg, 2.4apg, 38.3% 3PT. Stretch-4 off bench. G1: 5pts (2-5 FG, 1-4 3PT) in 10min, +24. 4reb, 4ast, 2stl. Unsung connector.", baseRating:56 }
      ],
      synergy: [
        { players:["SGA","Dort","J.Williams","Holmgren","Hartenstein"], score:89, note:"Starting AND closing 5. Top-5 ORtg AND DRtg. NetRtg +14.2 together. Championship-proven chemistry. G1: dominated PHX from tip." },
        { players:["Mitchell","Wallace","Joe","J.Williams","Holmgren"], score:78, note:"SGA-rest lineup. Mitchell (13.6ppg) leads bench scoring, Wallace provides D, Joe spaces (42.3% 3PT). G1: this group extended lead when SGA sat." },
        { players:["SGA","Caruso","Wallace","J.Williams","Holmgren"], score:84, note:"Defensive closing option. Caruso + Wallace + Dort switchable perimeter D. Deploy when opponent has multiple scoring guards." },
        { players:["Mitchell","McCain","Wiggins","Jaylin Williams","Joe"], score:68, note:"Deep bench/garbage time. Mitchell runs point. All can shoot 3s. G1 Q4 lineup that finished blowout." }
      ]
    },
    awayTeam: {
      name: "Suns", city: "Phoenix", abbr: "PHX", seed: 8, record: "45-37",
      systemBonus: -0.5, // Booker-dependent
      playoffPedigree: 1, // Booker: 2021 Finals, 2023 WCSF, 2024 R1 (swept by MIN). Allen: 2024 R1. Rest of roster is new.
      offStyle: "Booker ISO-heavy. Brooks emerged as volume #2 but BPM -2.3 reveals net negative. G1 confirmed single-initiator problem — only Booker creates reliably. Staggering Booker/Green left each isolated.", initiators: 1,
      color: "#1D1160", color2: "#E56020",
      advStats: { ortg:112.4, drtg:113.8, netRtg:-1.4, pace:99.8, ts:56.2, efg:52.8, tov:13.2, reb:49.1, ortgRk:18, drtgRk:18, clutchNetRtg:1.2, last10:"5-5", fgPct:49.8, threePct:32.7, ftPct:74.4, orbPct:23.3 },
      players: [
        { name:"Devin Booker", pos:"SG", rating:85, ppg:26.0, rpg:4.0, apg:6.0, fgp:46.0, per:22.4, ts:59.2, epm:3.5, bpm:3.8, ws48:.148, onOff:5.2, clutch:7.8, vorp:3.6, usg:29.0, injury:null, lebron:2.489, oLebron:2.85, dLebron:-0.361, war:6.637, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Game-winner vs OKC in Jan. 7.8 clutch rating is elite. But Dort DRtg 102.1 is a wall", baseRating:85, starCeiling:2, injuryRisk:0, playoffAscension:0.8 },
        { name:"Dillon Brooks", pos:"SF", rating:73, ppg:20.2, rpg:3.6, apg:2.1, fgp:44.8, per:17.5, ts:56.5, epm:1.5, bpm:-2.3, ws48:.102, onOff:2.8, clutch:5.8, vorp:-0.1, usg:26.2, injury:null, lebron:-0.116, oLebron:-0.035, dLebron:-0.082, war:2.499, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"20.2ppg, 3.6rpg — best season of career. Player of the Week. But fractured hand in Jan cost PHX a top-6 seed. G1: 18pts (6-22 FG, 3-10 3PT) — SHOT TEAM OUT early (game-high 8 attempts while down 23 in Q2). SI: 'willingness to take over emotionally only makes the road more challenging.' BPM -2.3 confirms net negative despite volume.", baseRating:73 },
        { name:"Jalen Green", pos:"SG", rating:68, ppg:17.8, rpg:3.5, apg:2.8, fgp:43.5, per:15.8, ts:51.6, epm:0.5, bpm:-1.1, ws48:.075, onOff:-0.8, clutch:5.0, vorp:0.2, usg:25.0, injury:null, lebron:-0.448, oLebron:0.761, dLebron:-1.209, war:1.044, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"Traded from HOU. Play-in hero (35 & 36 pts) but inconsistent. BBRef: 51.6 TS% (terrible), BPM -1.1, VORP 0.2 — advanced stats say he's a below-replacement player. -0.8 on/off. PHX is worse with him on court", baseRating:68 },
        { name:"Mark Williams", pos:"C", rating:65, ppg:11.7, rpg:8.0, apg:1.5, fgp:56.2, per:16.2, ts:60.5, epm:0.8, bpm:0.5, ws48:.095, onOff:1.5, clutch:4.5, vorp:1.1, usg:20.5, injury:"QUESTIONABLE G2 — left foot soreness", lebron:0.765, oLebron:-0.529, dLebron:1.294, war:2.862, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"11.7ppg, 8.0rpg, 56.2% FG. G1: INACTIVE (foot soreness). Per ESPN (Apr 21): HC Ott expects M.Williams listed as QUESTIONABLE for G2 Wed. If available, PHX's interior defense improves significantly vs Holmgren.", baseRating:65, injuryRisk:0.5, activeInjury:{type:"left foot soreness",severity:0.4,note:"INACTIVE G1. Per ESPN (Apr 21): Ott expects Williams to be listed as QUESTIONABLE for G2 (Wed Apr 22). Severity downgraded 0.5→0.4 reflecting possible return. If he plays, PHX replaces Ighodaro in starting lineup — massive interior upgrade."} },
        { name:"Oso Ighodaro", pos:"C", rating:58, ppg:6.5, rpg:5.1, apg:1.0, fgp:50.0, per:11.0, ts:54.0, epm:-0.3, bpm:-0.5, ws48:.058, onOff:-0.5, clutch:3.5, vorp:0.3, usg:15.0, injury:null, lebron:0.3, oLebron:-0.5, dLebron:0.8, war:1.0, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"MODEL WAS MISSING — STARTED G1. 6.5ppg, 5.1rpg in sophomore season. FW: mobility makes him a great defensive option against small-ball. G1: 0pts (0-3 FG) in 26min but 9reb, 3ast. Defensive presence in paint — SI noted OKC kept him in paint to deter drivers. Had no answer for Holmgren offensively.", baseRating:58 },
        { name:"Ryan Dunn", pos:"SF", rating:60, ppg:8.8, rpg:3.8, apg:1.2, fgp:44.2, per:10.5, ts:53.8, epm:0.0, bpm:-0.5, ws48:.058, onOff:0.5, clutch:4.0, vorp:0.5, usg:17.8, injury:null, lebron:-0.102, oLebron:-0.711, dLebron:0.609, war:2.002, offRole:"Stationary Shooter", defRole:"Helper",
          matchupNote:"Defensive specialist. Length disrupts passing lanes. Limited offensive game", baseRating:60 },
        { name:"Grayson Allen", pos:"SG", rating:70, ppg:16.5, rpg:3.0, apg:3.8, fgp:44.5, per:15.5, ts:59.0, epm:1.0, bpm:0.5, ws48:.092, onOff:1.5, clutch:5.5, vorp:1.5, usg:22.0, injury:"QUESTIONABLE G2 — hamstring (est. return Apr 22)", lebron:0.496, oLebron:1.864, dLebron:-1.368, war:2.718, offRole:"Primary Ball Handler", defRole:"Chaser", injuryRisk:0.5, activeInjury:{type:"left hamstring strain",severity:0.4,note:"DNP G1. Per CBS Sports (Apr 21): out until at least Apr 22 (G2 date). Possible return for G2 Wed. If available, PHX's offense transforms — 16.5ppg 3rd-highest scorer with elite 3PT shooting. Hamstring re-injury risk in physical OKC matchup. Severity downgraded 0.5→0.4 reflecting possible return timeline."},
          matchupNote:"MASSIVE MODEL CORRECTION: 10.5→16.5ppg. FW: 'borderline starter, one of the best 3PT shooters in the NBA.' 3.8apg adds playmaking. DNP G1 with hamstring. If healthy for G2+, PHX has a legitimate 3rd scoring option. 2024 playoff experience (PHX vs MIN). Rating 62→70.", baseRating:62 },
        { name:"Royce O'Neale", pos:"SF", rating:58, ppg:9.8, rpg:4.8, apg:2.7, fgp:43.8, per:12.5, ts:55.5, epm:0.1, bpm:-0.2, ws48:.062, onOff:0.8, clutch:4.2, vorp:0.5, usg:16.5, injury:null, lebron:-2.125, oLebron:-2.119, dLebron:-0.006, war:0.475, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"9.8ppg, 4.8rpg, 2.7apg. Veteran 3-and-D forward, multi-year Suns contributor. FW: 'dependable contributor.' G1: 2pts (1-2 FG, 1-2 3PT) in 23min, provided size and steadiness. Has playoff experience from UTA/BKN years. Rating 53→58.", baseRating:58 },
        { name:"Collin Gillespie", pos:"PG", rating:66, ppg:12.7, rpg:4.1, apg:4.6, fgp:43.0, per:14.0, ts:57.0, epm:0.5, bpm:0.2, ws48:.078, onOff:1.0, clutch:5.0, vorp:1.2, usg:19.0, injury:null, lebron:1.913, oLebron:0.678, dLebron:1.235, war:6.245, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"BREAKOUT: 12.7ppg, 4.1rpg, 4.6apg — gives PHX a non-Booker playmaker. FW: 'could find himself in starting five.' LEBRON 1.913 / WAR 6.245 confirms elite impact. D-LEBRON 1.235. G1: 8pts (3-6 FG, 2-4 3PT) in 23min. PHX's most reliable bench piece. Could start G2 if Ott adjusts. Rating 63→66.", baseRating:63 },
        { name:"Jordan Goodwin", pos:"PG", rating:64, ppg:9.2, rpg:3.5, apg:3.8, fgp:44.5, per:12.8, ts:54.0, epm:0.5, bpm:0.2, ws48:.072, onOff:1.5, clutch:4.5, vorp:0.8, usg:18.5, injury:"QUESTIONABLE G2 — calf", lebron:1.917, oLebron:1.064, dLebron:0.853, war:4.306, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"STARTER per FW. Play-in hero (19pts, 9reb, 6stl vs Warriors). G1: only 5min (2pts, 1-4 FG) — may have been limited by calf. Per ESPN (Apr 21): QUESTIONABLE for G2 Wed with calf injury. If OUT, PHX loses a starter.", baseRating:62, activeInjury:{type:"calf",severity:0.4,note:"Per ESPN (Apr 21): Listed as QUESTIONABLE for G2 Wed Apr 22 with calf injury. Only played 5min in G1 — may have aggravated calf. If OUT, Gillespie or Dunn absorbs starting role."} }
      ],
      synergy: [
        { players:["Booker","Green","Goodwin","Brooks","Ighodaro"], score:62, note:"G1 ACTUAL starting 5 (M.Williams inactive). Ighodaro started at C. Goodwin pulled after 5min. Struggled — 84pts total, 35% FG 1H, 19 TOs." },
        { players:["Booker","Green","Brooks","Dunn","M.Williams"], score:68, note:"INTENDED starting 5 per FW if M.Williams healthy. Williams adds interior presence Ighodaro can't match. Better matchup vs Holmgren." },
        { players:["Gillespie","Allen","O'Neale","Brooks","Ighodaro"], score:60, note:"Booker-rest bench unit. Gillespie (12.7ppg) runs point. Allen (16.5ppg) provides scoring IF healthy. O'Neale's 3-and-D." },
        { players:["Booker","Gillespie","Allen","Brooks","M.Williams"], score:72, note:"PHX's BEST potential lineup — only available if both Allen and M.Williams healthy. Three reliable shooters + Williams interior. May not be available G2." }
      ]
    },
    externalFactors: [
      { team:"OKC", player:"Jalen Williams", desc:"G1 RESOLVED: 22pts (9-15 FG) in 29min — SI says 'appeared as his old self.' Wrist surgery concern diminished. Severity downgraded.", impact:-2, category:"injury" },
      { team:"OKC", player:null, desc:"DEFENDING CHAMPIONS + CHAMPIONSHIP PEDIGREE: 2024 WCF (lost to DAL in 6), 2025 champions. 20-5 playoff record under Daigneault. SGA, Williams, Holmgren, Dort, Caruso all battle-tested. +8.5 clutch NetRtg. They know how to close.", impact:7, category:"motivation" },
      { team:"OKC", player:null, desc:"HISTORIC DEPTH: FW lists 9 bench players. Mitchell (13.6ppg), Wallace, Joe (42.3% 3PT), Caruso, Wiggins, Jaylin Williams — OKC can go 12 deep without quality drop. G1 proved: SGA sat Q4, OKC still won by 35.", impact:5, category:"chemistry" },
      { team:"PHX", player:"Dillon Brooks", desc:"20.2 PPG breakout but G1 exposed: shot team out of game (8 attempts while down 23). SI: 'willingness to take over emotionally makes road more challenging.' BPM -2.3 = net negative.", impact:1, category:"motivation" },
      { team:"PHX", player:null, desc:"Play-in exhaustion + G1 mental fold. Less than 48 hours between play-in win (Fri) and G1 (Sun). 19 TOs, 35% 1H shooting. Green frustrated by physicality. Morale shattered.", impact:-6, category:"motivation",
        evidence:"PHX played two grueling play-in games before facing fully rested OKC. G1: 35-pt loss. Green told Yahoo he was 'frustrated.' SI: 'Every shot was contested.' The psychological gap between defending champs and 8-seed play-in team was on full display.",
        sources:["ClutchPoints: thunder-game-1-beatdown-suns","Yahoo: jalen-green-frustrated-thunders-physicality","SI: jalen-williams-returns-to-form"], verdict:"verified" },
      { team:"PHX", player:null, desc:"INJURY CRISIS: Both Mark Williams (foot, INACTIVE G1) and Grayson Allen (hamstring, DNP G1) missed G1. Allen is 16.5ppg — PHX's 3rd scorer. If both miss G2, PHX is playing without 28ppg worth of production.", impact:-5, category:"injury" },
      { team:"PHX", player:"Devin Booker", desc:"2024 playoff context: PHX swept by MIN in R1 (0-4). Booker has extensive playoff pedigree (2021 Finals, 2023 WCSF) but has lost 8 of last 10 playoff games. Pattern of deep talent but falling short.", impact:-2, category:"motivation" }
    ],
    game1: {
      spread: "OKC -14.5", moneyline: "OKC -900 / PHX +600", ou: "O/U 215.5",
      pick: "OKC", confidence: "high", projScore: "OKC 118 — PHX 104",
      reasoning: "The largest spread on the board for good reason. SGA's 67% TS is historically elite, OKC's +11.6 NetRtg is dominant, and their +8.5 clutch NetRtg means they finish games. Phoenix's negative NetRtg (-1.4) and reliance on Booker to get hot makes them one-dimensional despite Brooks' breakout. Dort's defense on Booker (DRtg 102.1) is the key clamp. Brooks' emergence as a 20 PPG scorer gives PHX more to work with than expected, and Green's play-in momentum adds variance, but OKC's depth and defense are too much.",
      prosHome: ["SGA: 30PPG on 67% TS, 50% from 3 vs PHX", "+11.6 NetRtg (best in NBA)", "+8.5 clutch NetRtg — close games out", "Dort locks down Booker"],
      consHome: ["J. Williams finding rhythm post-injury", "25th in 3PT defense", "Brooks breakout gives PHX a real #2", "Booker made game-winner vs OKC in Jan"],
      prosAway: ["Booker's 7.8 clutch rating is elite", "Brooks 20.2 PPG breakout — legit second star", "Green riding play-in momentum", "Nothing to lose as 8 seed"],
      consAway: ["-1.4 NetRtg — negative team overall", "Green inconsistent, -0.8 on/off", "Only Booker truly scares OKC in clutch", "5-5 in last 10 — inconsistent"]
    },
    game2: {
      spread: "OKC -17.5", moneyline: "OKC -2100 / PHX +900", ou: "O/U 216.5",
      pick: "OKC", confidence: "high", projScore: "OKC 112 — PHX 103",
      schedule: "Wed Apr 22 — 9:30 PM ET — ESPN",
      reasoning: "BACKTEST-CALIBRATED PICK: OKC (high confidence). G1's 35-pt blowout (119-84) confirmed the Blowout Cascade pattern — structural mismatches produce margins far beyond model projections. OKC's multi-initiator attack (SGA 25, Williams 22, Holmgren 16) overwhelmed PHX's single-initiator defense (only Booker at 23). PHX committed 17 TOs and shot 35% in the first half — systemic problems that coaching alone can't fix. Daigneault rested SGA (29min) and Holmgren (25min) — OKC's stars are FRESHER for G2 while PHX played extended garbage time. The 2025 backtest showed defending champions winning G2 at home after a G1 blowout at 91%. Ott is 0-1 as a playoff coach with no adjustment track record. PHX's only path: Booker 40+ AND Brooks stops shooting them out of the game (8 attempts while down 23 in G1). The single-initiator penalty (-1.5 in calcWinProb) is a structural deficit PHX can't solve between games.",
      g1Adjustments: [
        "OKC WON G1 119-84 — 35-pt blowout, largest margin in 2026 R1 playoffs",
        "SGA RESTED: Only 29min in G1, sat entire Q4. He's FRESHER than normal for G2",
        "Williams ALL-NBA RETURN: 22pts (9-15 FG), 7reb, 6ast in 29min — seamless reintegration",
        "PHX SINGLE-INITIATOR PROBLEM: Only Booker creates. Brooks shot them out of G1 (8 attempts down 23)",
        "PHX TURNOVER CRISIS: 17 TOs, OKC pts off TOs 15-2. Systematic ball pressure won't stop",
        "Ott 0-1 as playoff HC — no adjustment track record. First-year coach vs defending champion coach",
        "STAR PROP TRAP: SGA's scoring line will be lower (~25.5) due to potential blowout again — avoid OVER",
        "Holmgren only played 25min — fresh legs vs PHX's non-existent interior defense"
      ],
      prosHome: ["Defending champions at home after 35-pt G1 win — 91% G2 win rate historically", "SGA and Holmgren RESTED — fresher than PHX counterparts", "Williams' return adds a 3rd star-level option PHX can't match", "Multi-initiator attack (3) vs single-initiator PHX (1) is structural", "Daigneault's A-rated G1 performance needs no adjustment — PHX must solve OKC"],
      consHome: ["35-pt blowout can breed complacency — Daigneault must manage mentality", "PHX 3PT shooting (35% 1H) may regress upward", "Booker's 7.8 clutch rating means he CAN take over if game stays close", "SGA's 5-18 FG suggests he wasn't sharp — could have a better or worse G2 shooting night"],
      prosAway: ["Booker ceiling game: 40+ is possible, he's 7.8 clutch", "Brooks lesson learned — may play smarter after G1 mistakes", "Ott has full game film — even first-time coaches can adjust schematically", "PHX's desperation could fuel energy — nothing to lose as 8 seed"],
      consAway: ["Single-initiator penalty is structural — can't add creators between games", "-1.4 NetRtg team facing +11.6 NetRtg team — massive talent gap", "17 TOs reflect systematic pressure, not nerves — OKC's defense is schematic", "Interior defense non-existent — Holmgren will feast again"]
    },
    game3: {
      spread: "OKC -8.5", moneyline: "OKC -380 / PHX +300", ou: "O/U 217.5",
      pick: "OKC", confidence: "medium", projScore: "OKC 116 — PHX 108",
      schedule: "Fri Apr 24 — 9:30 PM ET — ESPN",
      reasoning: "PHASE 30 PICK: OKC (MEDIUM confidence). G3 shifts to Phoenix but the structural mismatch is unchanged. OKC's multi-initiator attack (SGA/Williams/Holmgren = 3 stars) vs PHX's single-initiator dependence (only Booker) is a talent gap that coaching can't close.\n\n3PT VARIANCE: OKC shot well in G1 (team ~38%), expect slight regression. PHX shot 35% first half in G1 — could regress UP slightly at home. Net: minimal 3PT swing, maybe 2-3pts toward PHX.\n\nHOME COURT EFFECT: PHX at home (~2.5pt R1 boost) compresses the margin from G1's 35pts to a more realistic 8-10pts. The crowd at Footprint Center will give PHX energy, and Booker historically shoots better at home (51% FG home vs 47% road). But OKC was 25-16 on the road — elite road team.\n\nYOUTH BREAKOUT WATCH: Jalen Green (age 22) is the prime candidate. Phase 29 youth breakout persistence: he shot 37.5% in G1 but at home with crowd energy, his athletic scoring could spike to 25+. Brooks (age 27) is too old for the youth multiplier.\n\nSGA BOUNCE-BACK: If SGA shot 27.8% in G1 (season 47.4%), expect massive regression UP. Road SGA is historically elite — averaged 31+ PPG in 2025 playoffs. Full game (no sitting Q4) means 28-35pts range.\n\nCOACHING: Daigneault (adj 9) vs Ott (adj 3). Massive coaching gap. Even with 2 game films, Ott lacks the roster tools to counter OKC's depth. PHX's 17 TOs in G1 are scheme-driven by OKC's defense — home court helps but doesn't fix systemic ball pressure.\n\nWHY NOT HIGHER MARGIN: PHX will compete better at home. Booker's clutch rating (7.8) + home crowd + desperation = they'll fight. But the talent gap is too wide for an upset. Margin compresses from 35 (G1) to projected 8. Spread at -8.5 is near our projection — pick ML for safer play.",
      g2Adjustments: [
        "G2 result pending (Wed Apr 22) — this prediction assumes OKC won G2 at home as heavily favored",
        "SERIES SHIFTS TO PHOENIX: First road games for OKC. PHX home record was 21-20 — not dominant, but crowd energy helps",
        "SGA FG% REGRESSION: 27.8% G1 on 5-18 FG was historic cold. Expect massive regression UP to ~46% at PHX. Even Dort-level defense can't hold SGA below 40% twice.",
        "PHX DESPERATION: Likely 0-2, only ~7% of teams come back from 0-2. Maximum urgency creates energy but also pressing/turnovers",
        "BOOKER HOME BOOST: Career 51% FG at home vs 47% road. Expect his best game of the series (26-34pts range).",
        "GREEN YOUTH BREAKOUT CANDIDATE (age 22): Home crowd could unlock his athletic scoring. Phase 29 multiplier active.",
        "BROOKS REGRESSION: Whether he shot poorly or well in G2, Brooks is a career 39.8% playoff shooter. Don't expect improvement.",
        "OKC DEPTH STILL DOMINANT: Even on the road, SGA/Williams/Holmgren are the 3 best players in the series by far."
      ],
      prosHome: ["SGA bounce-back from G1 cold shooting — regression UP to ~46% expected at PHX", "Williams All-NBA level sustained — 22pts/7reb/6ast in G1 on 60% FG", "Holmgren's rim protection + shooting = unguardable unicorn for PHX", "OKC was 25-16 on road — elite road team, won't wilt under pressure", "Daigneault (adj 9) is the best coach in this series by far", "Multi-initiator advantage (3 vs 1) is structural and venue-independent"],
      consHome: ["ROAD GAME at Footprint Center — first hostile environment for OKC this series", "Booker's home FG% boost (51% vs 47%) + clutch rating (7.8) = dangerous in close game", "Green YOUTH BREAKOUT potential (age 22) at home — if he finds rhythm, PHX offense improves significantly", "PHX desperation + crowd energy could fuel aggressive play and create turnovers for OKC", "OKC may come out flat if G1+G2 were both blowouts — complacency risk"],
      prosAway: ["HOME COURT — Footprint Center crowd, first home game of the series (~2.5pt R1 boost)", "Booker historical home shooting boost (51% FG) — expect best scoring game of the series", "Green YOUTH BREAKOUT at home — age 22, athletic scorer, crowd energy could unlock 25+ game", "Ott has 2 game films now — even a modest improvement helps", "Desperation creates energy — nothing to lose, play freely"],
      consAway: ["Single-initiator penalty UNCHANGED — can't add creators. Only Booker generates half-court offense.", "-1.4 NetRtg team — structurally weaker regardless of venue", "Brooks is a career 39.8% playoff shooter — venue doesn't fix his shot selection", "Ighodaro's zero offense means PHX plays 4-on-5 offensively in the half-court", "OKC's defensive scheme is schematic — travels to any building", "Turnovers (17 in G1) are pressure-driven, and OKC's pressure travels"]
    },
    coaching: {
      home: {
        coach: "Mark Daigneault",
        adjustmentRating: 9,
        schemeCreativity: 8,
        urgency: 5,
        playoffRecord: "20-5",
        tendency: "Matchup chameleon. Plays 11-12 in regular season, trusts roster depth. Self-focused philosophy.",
        rotationPlan: "Shrinks to 9-man. Closers rotate between Caruso/Joe/Wallace based on matchup needs.",
        keyAdjustment: "Will likely mirror PHX small-ball with Dort/Williams/Caruso defensive wings",
        g1Performance: "A | Executed a near-perfect defensive game plan. Every PHX shot was contested, forcing 35% first-half shooting and 17 turnovers (15-2 in pts off TOs). Brilliantly staggered Booker and Green so OKC always had elite defenders against the lone scoring threat on the floor. Key coaching decision: limited SGA to 29 minutes and Holmgren to 25 — protecting his stars for the long series while still winning by 35. Williams' reintegration was seamless (22pts in 29min) suggesting Daigneault managed his minutes/role carefully during the injury rehab. Let Holmgren feast on PHX's non-existent interior defense (16pts, 50% FG). The game was won in Q1 (35-20) through defensive intensity and transition offense off turnovers."
      },
      away: {
        coach: "Jordan Ott",
        adjustmentRating: 4,
        schemeCreativity: 4,
        urgency: 8,
        playoffRecord: "0-1 (first season)",
        tendency: "Young coach, 9-man rotation locked in. Booker + Brooks anchors in closing lineup.",
        rotationPlan: "Booker/Green/Brooks/Williams/O'Neale or Dunn closing lineup. Dunn as SGA stopper.",
        keyAdjustment: "Ryan Dunn as primary SGA defender — length and athleticism to contest",
        g1Performance: "D- | First-year coach overwhelmed by OKC's defensive intensity. Critical failure: staggering Booker and Green left each isolated against OKC's elite POA defenders with no help. Brooks was allowed to shoot the team out of the game (game-high 8 attempts while down 23 in Q2) with no visible coaching intervention. Ott's small-ball approach — which he doubled down on pre-playoffs per reports — backfired against OKC's length (Holmgren 16pts with PHX having no matchup for him). PHX committed 17 turnovers suggesting no adjustment to OKC's pressure. The 48-hour turnaround from the play-in gave Ott no preparation time, but the game plan appeared non-existent. Must completely rethink approach for G2 — potentially starting Dunn for more defensive presence."
      },
      bestLineups: {
        home: { players: ["SGA","Dort","J.Williams","Holmgren","Hartenstein"], netRtg:14.2, ortg:121.5, drtg:107.3, min:850, note:"Starting/closing 5. Championship-proven. G1: dominated from tip to final buzzer." },
        away: { players: ["Booker","Green","Goodwin","Brooks","M.Williams"], netRtg:4.2, ortg:114.8, drtg:110.6, min:320, note:"INTENDED starting 5 per FW. G1: M.Williams inactive, Ighodaro started instead." }
      },
      roleChanges: [
        { team:"OKC", player:"McCain", regSeason:"Bench scorer, 18 MPG", playoff:"X-factor off bench. Could see crunch time if PHX goes small", impact:"up", reason:"Daigneault trusts young guards in big moments" },
        { team:"OKC", player:"Caruso", regSeason:"Bench defender, 22 MPG", playoff:"Closing lineup defender vs Booker, 26+ MPG", impact:"up", reason:"Playoff Caruso is a different animal — proven closer" },
        { team:"PHX", player:"Dunn", regSeason:"Rotation wing, 20 MPG", playoff:"Primary SGA stopper, 28+ MPG", impact:"up", reason:"Ott will maximize his defensive assignment value" },
        { team:"PHX", player:"Green", regSeason:"Second option, 32 MPG", playoff:"Must become co-star, 36+ MPG", impact:"up", reason:"Without a third star, Green must match Booker's production" }
      ]
    },
    schemePersistence: {
      home: { isSchemeDriven: true, fgSuppression: 0.05, description: "OKC's defensive system forced 10 first-half TOs in G1. Structural pressure defense, not variance." },
      away: null
    },
    // G2 Player Outlook — Bayesian blend: 55% model / 45% prior
    // G1: 35-pt OKC blowout. SGA sat Q4 (29min only). PHX 35% FG first half, 17 TOs.
    // PHX must reduce turnovers and find secondary creation. OKC depth is overwhelming.
    g2PlayerOutlook: {
      home: [ // OKC
        // SGA: G1 5-18 (27.8%), 0-4 3PT, but 15-17 FT = 25pts in 29min. Season 47.4% FG.
        // Bayesian: 0.55*0.278 + 0.45*0.474 = 0.366. But G1 was blowout context — sat Q4.
        // SGA historically bounces back from poor shooting (career 47.4%). Full game G2 = more attempts.
        { player:"Shai Gilgeous-Alexander", outlook:"good", projFgPct:0.46, ptsRange:[28,36], reason:"G1's 27.8% FG was worst of season but still scored 25 in 29min via elite FT drawing (15-17). Career 47.4% FG — major regression up expected. Will play full game G2 (sat Q4 blowout). Free throw artistry (88.2% season) provides scoring floor even on cold nights.", confidence:"high" },

        // J.Williams: G1 9-15 (60.0%), 22pts/7reb/6ast. Season 50.2% FG. All-NBA level.
        // Bayesian: 0.55*0.600 + 0.45*0.502 = 0.556. Slight regression but elite player.
        { player:"Jalen Williams", outlook:"good", projFgPct:0.52, ptsRange:[18,26], reason:"G1 was All-NBA showcase (60% FG, 22/7/6) in only 29min. Season 50.2% — some regression but elite efficiency sustains. Multi-faceted game (scoring, passing, defense) means production isn't shooting-dependent. OKC's second star is locked in.", confidence:"high" },

        // Holmgren: G1 5-10 (50.0%), 16pts/7reb/2stl/2blk in 25min. Season ~47% FG.
        // Bayesian: 0.55*0.500 + 0.45*0.470 = 0.487
        { player:"Chet Holmgren", outlook:"neutral-good", projFgPct:0.49, ptsRange:[14,20], reason:"G1 efficient (50% FG) with elite rim protection (2blk). PHX has no answer for his length + shooting combo. Season ~47% FG provides floor. More minutes G2 if closer game. Unicorn matchup problem for PHX.", confidence:"medium" },

        // Dort: G1 3-8 (37.5%), 8pts. Season ~42% FG. Defensive stopper.
        // Bayesian: 0.55*0.375 + 0.45*0.420 = 0.395
        { player:"Lu Dort", outlook:"neutral", projFgPct:0.40, ptsRange:[6,12], reason:"Defensive assignment on Booker is his primary value. G1 shooting (37.5%) was near season baseline. Offense is a bonus — expect 8-10pts on limited attempts. Clamping Booker's creation is the goal.", confidence:"medium" },

        // Hartenstein: G1 4-4 (100%), 8pts/8reb in 20min. Season ~55% FG.
        // Bayesian: Perfect shooting is outlier. Regress to ~0.55
        { player:"Isaiah Hartenstein", outlook:"neutral", projFgPct:0.55, ptsRange:[6,12], reason:"G1 perfect shooting (4-4) is unsustainable but he only takes high-quality shots. Season ~55% FG is the anchor. Rebounding (8 in 20min, 4 offensive) is repeatable. Rim-running and screening are his value.", confidence:"medium" },

        // A.Mitchell: G1 3-7 (42.9%), 9pts/5reb. Bench sparkplug.
        { player:"Ajay Mitchell", outlook:"neutral", projFgPct:0.42, ptsRange:[6,12], reason:"Bench guard contributing efficiently. 3-4 3PT shooting in G1 is encouraging. Young player benefiting from OKC's system depth.", confidence:"low" },

        // I.Joe: G1 3-8 (37.5%), 3-8 3PT, 9pts. Sharpshooter role.
        { player:"Isaiah Joe", outlook:"neutral", projFgPct:0.38, ptsRange:[6,12], reason:"3PT specialist — went 3-8 from deep in G1. Season ~39% 3PT provides baseline. OKC's depth means reliable minutes. Shooting will fluctuate game-to-game.", confidence:"low" }
      ],
      away: [ // PHX
        // Booker: G1 8-17 (47.1%), 23pts. Season ~49% FG. Solid but PHX still lost by 35.
        // Bayesian: 0.55*0.471 + 0.45*0.490 = 0.480. Booker was actually fine individually.
        { player:"Devin Booker", outlook:"neutral-good", projFgPct:0.48, ptsRange:[24,32], reason:"G1 was individually respectable (47.1% FG, 23pts) despite 35-pt loss. Season ~49% FG — expect similar efficiency. Problem is PHX supporting cast, not Booker. May press harder in G2 desperation. Elite scorer who can get hot.", confidence:"medium" },

        // Brooks: G1 6-22 (27.3%), 3-10 3PT, 18pts. Season ~43% FG. Shot team out of it.
        // Bayesian: 0.55*0.273 + 0.45*0.430 = 0.344. Some bounce-back but he's a chucker.
        { player:"Dillon Brooks", outlook:"bad", projFgPct:0.36, ptsRange:[10,18], reason:"G1 disaster (6-22 FG, 27.3%) — took 8 shots while down 23. Season ~43% but playoff Brooks historically chucks (career 39.8% FG in playoffs). Will keep shooting regardless of makes. Defensive effort on SGA has some value but offensive decision-making is toxic.", confidence:"high" },

        // Green: G1 6-16 (37.5%), 17pts. Season ~44% FG. Second option pressure.
        // Bayesian: 0.55*0.375 + 0.45*0.440 = 0.404
        { player:"Jalen Green", outlook:"neutral", projFgPct:0.40, ptsRange:[14,22], reason:"G1 struggled (37.5% FG) in first real playoff pressure. Season ~44% FG. Athletic scorer who can get to rim but OKC's perimeter D is suffocating. Needs to be more aggressive driving rather than settling for contested jumpers.", confidence:"medium" },

        // Ighodaro: G1 0-3 (0%), 0pts/9reb in 26min. Rebounding machine, no offense.
        { player:"Oso Ighodaro", outlook:"bad", projFgPct:0.35, ptsRange:[0,6], reason:"G1 zero points on 3 attempts. Not an offensive player — value is rebounding (9reb, 7 offensive in G1). Don't expect scoring improvement. PHX needs him for boards and defense only.", confidence:"high" },

        // Gillespie: G1 3-6 (50.0%), 8pts. Season role player. 2-4 3PT.
        { player:"Collin Gillespie", outlook:"neutral", projFgPct:0.42, ptsRange:[4,10], reason:"Bench guard who played 23min — sign of PHX's depth issues. G1 was fine (50% FG, 2-4 3PT). Limited ceiling but provides steady minutes.", confidence:"low" },

        // O'Neale: G1 1-2, 4pts. Veteran role player.
        { player:"Royce O'Neale", outlook:"neutral", projFgPct:0.40, ptsRange:[2,8], reason:"Veteran wing providing defense and spacing. Low-volume but efficient. Corner 3PT is his offensive identity.", confidence:"low" },

        // Dunn: G1 0-3, 0pts in 25min. Defensive assignment player.
        { player:"Ryan Dunn", outlook:"bad", projFgPct:0.30, ptsRange:[0,4], reason:"Defensive specialist with zero offensive game. G1 confirmed: 0pts, 0-3 FG, 0-3 3PT, 3 TOs. Playing for his D on SGA only. Scoring is nonexistent.", confidence:"high" }
      ]
    },
    // ── G3 Per-Player Offensive Outlook (Phase 30) ──
    // OKC likely leads 2-0. G3 shifts to Footprint Center (PHX home). PHX desperate.
    // SGA sat Q4 in G1 blowout (29min). Expect full game at PHX → 28-35pts range.
    // PHX single-initiator problem unchanged. Green (age 22) youth breakout candidate at home.
    // Coaching gap: Daigneault (adj 9) vs Ott (adj 4). OKC's scheme travels.
    g3PlayerOutlook: {
      home: [ // OKC (AWAY at Footprint Center for G3)
        // SGA: G1 5-18 (27.8%), 25pts in 29min. Season 55.3% FG, 38.6% 3PT.
        // Massive regression UP expected. Full game (no Q4 sit) = 34-38min.
        // Bayesian: 0.40*(G1-G2 avg ~40%) + 0.30*(G2 recency ~46%) + 0.30*(55.3% season) = ~0.46. Road dip → 0.45
        { player:"Shai Gilgeous-Alexander", outlook:"good", projFgPct:0.45, ptsRange:[28,36], reason:"G1's 27.8% FG was a historic cold snap — career 55.3% FG guarantees massive regression UP. Sat Q4 in blowout (29min only); expect full 36min at PHX. Free throw artistry (88.2%, 15-17 G1) provides scoring floor even on cold nights. Road game at Footprint Center adds slight efficiency dip (~2%), but SGA averaged 31+ PPG in 2025 playoff road games. At 45% FG with full minutes, 30+ is near-certain. The best player in this series by a wide margin.", confidence:"high" },

        // Williams: G1 9-15 (60%), 22pts/7reb/6ast in 29min. Season 48.4% FG.
        // All-NBA return confirmed. Wrist/hamstring concerns downgraded after G1.
        // Bayesian: 0.40*(0.60 G1) + 0.30*(~0.50 projected) + 0.30*(0.484 season) = ~0.54. Road → 0.50
        { player:"Jalen Williams", outlook:"good", projFgPct:0.50, ptsRange:[18,26], reason:"G1 return was seamless: 22pts (9-15 FG, 60%), 7reb, 6ast in 29min. Wrist/hamstring concerns downgraded (severity 0.5→0.3). All-NBA talent operating as OKC's second star. Road game slight dip but Williams' finesse game (downhill attacks, floaters) travels well. PHX has no matchup for his 6'6 wing versatility. Expect continued elite production as OKC's secondary creator.", confidence:"high" },

        // Holmgren: G1 5-10 (50%), 16pts/7reb/2stl/2blk in 25min. Season 55.7% FG.
        // PHX has ZERO interior matchup for him. Stretch-5 unicorn.
        // Bayesian: 0.40*(0.50) + 0.30*(~0.52) + 0.30*(0.557) = ~0.52. Road → 0.50
        { player:"Chet Holmgren", outlook:"good", projFgPct:0.50, ptsRange:[14,22], reason:"PHX has no answer for Holmgren's unicorn skill set — 7'1 stretch-5 who shoots 36.2% from 3 AND protects the rim (D-LEBRON 3.465). G1: 16pts/7reb/2stl/2blk in only 25min. With fuller minutes at PHX (~30min), expect 16-20pts. Road game doesn't affect his interior dominance — PHX's lack of rim protection is structural. The matchup advantage is the widest in any G3.", confidence:"high" },

        // Dort: G1 3-8 (37.5%), 8pts. Season 38.5% FG. Value is defense.
        { player:"Lu Dort", outlook:"neutral", projFgPct:0.38, ptsRange:[6,12], reason:"Defensive stopper — clamped Booker in G1. Scoring is secondary (8.3ppg season). Road game doesn't affect his defensive assignment. 2-6 3PT in G1 is near his 34.4% season baseline. Expect similar modest scoring with elite perimeter defense.", confidence:"medium" },

        // Hartenstein: G1 4-4 (100%), 8pts/4reb/8ast in 20min. Season 62.2% FG.
        // Facilitator role emerged — 8 assists was surprising.
        { player:"Isaiah Hartenstein", outlook:"neutral-good", projFgPct:0.58, ptsRange:[8,14], reason:"G1 revealed a facilitator role: 8 assists in 20min alongside Holmgren. Season 62.2% FG — elite efficiency. Physical rebounder who gives OKC size advantage. Road game has minimal effect on his roll/cut/pass game. Could see expanded minutes if PHX goes small.", confidence:"medium" },

        // McCain: Bench scorer. Road game.
        { player:"Jared McCain", outlook:"neutral", projFgPct:0.40, ptsRange:[4,12], reason:"Bench guard energy scorer. If PHX goes small, Daigneault may give McCain crunch-time minutes. Road game reduces his already modest impact. Upside if he gets hot from 3.", confidence:"low" }
      ],
      away: [ // PHX (HOME at Footprint Center for G3)
        // Booker: G1 23pts at OKC. Season ~47% FG. Home FG% historically 51%.
        // PHX's sole offensive engine. Clutch rating 7.8. Home crowd boosts rhythm.
        // Bayesian: 0.40*(G1-G2 avg ~45%) + 0.30*(G2 recency) + 0.30*(0.47 season) = ~0.46. Home bump → 0.49
        { player:"Devin Booker", outlook:"neutral-good", projFgPct:0.49, ptsRange:[26,34], reason:"PHX's only reliable creator. G1: 23pts despite OKC's elite defense (Dort primary, help from Caruso/Williams). Home shooting boost is real — career 51% FG at home vs 47% road. Clutch rating 7.8 means he'll compete in close games. Expect his best game of the series: 28-32pts with improved efficiency on familiar rims. Still limited by OKC's defensive scheme — Dort + help won't change. Desperation + crowd energy = aggressive attacking.", confidence:"medium" },

        // Green: G1 stats not highlighted but part of 35% FG team shooting.
        // Age 22 — YOUTH BREAKOUT CANDIDATE (Phase 29 active).
        // Home crowd could unlock athletic scoring. 37.5% G1 → regression UP at home.
        { player:"Jalen Green", outlook:"neutral", projFgPct:0.43, ptsRange:[16,26], reason:"YOUTH BREAKOUT WATCH (age 22, Phase 29 active). G1 was quiet as part of PHX's 35% FG disaster, but at home, Green's athletic scoring could spike. Footprint Center crowd energy helps young players find rhythm. His ceiling is 25+ if he attacks the rim instead of settling for jumpers. OKC will still send elite defenders at him, but at home he'll be more comfortable with shot creation. The best PHX player to monitor for a breakout game — his youth multiplier is the highest on the roster.", confidence:"medium" },

        // Brooks: G1 18pts/7reb but shot team out of the game (8 attempts while down 23).
        // Career 39.8% playoff shooter. Season ~40% FG. Home won't fix shot selection.
        { player:"Dillon Brooks", outlook:"bad", projFgPct:0.38, ptsRange:[10,18], reason:"G1: 18pts/7reb but terrible shot selection — 8 attempts while down 23 in Q2 with no coaching intervention. Career 39.8% playoff FG. Home court won't fix his shot selection or defensive liability (negative D-LEBRON). Brooks will score 12-16pts on mediocre efficiency regardless of venue. His defensive assignment on SGA is meaningless — SGA creates at will.", confidence:"high" },

        // Ighodaro: Started G1 but zero offensive threat.
        { player:"Oso Ighodaro", outlook:"bad", projFgPct:0.45, ptsRange:[2,6], reason:"Started G1 when M. Williams was inactive. Zero offensive threat — PHX plays 4-on-5 in the half-court with him on the floor. Home court doesn't help a player who can't score. Defensive effort is his only value. May lose minutes to a scoring-oriented adjustment by Ott.", confidence:"high" },

        // Goodwin: Part of the starting lineup. Bench-level talent.
        { player:"Archie Goodwin", outlook:"neutral", projFgPct:0.42, ptsRange:[6,12], reason:"Starting-caliber guard who provides energy but limited creation. Home court helps his confidence. PHX needs him to hit open 3s created by Booker's gravity. Ceiling of 14pts if he gets hot, floor of 4pts if OKC pressures him.", confidence:"low" },

        // Gillespie: Bench guard, played 23min G1.
        { player:"Collin Gillespie", outlook:"neutral", projFgPct:0.42, ptsRange:[4,10], reason:"Bench guard who played extended minutes (23min G1) due to PHX's depth issues. 50% FG in G1 was fine. Home court steadies his limited game. Not a difference-maker.", confidence:"low" },

        // Dunn: Defensive specialist, 0pts G1.
        { player:"Ryan Dunn", outlook:"bad", projFgPct:0.30, ptsRange:[0,6], reason:"Zero offensive game confirmed (0-3 FG, 0-3 3PT, 3 TOs in G1). His ONLY value is defending SGA, and even that was ineffective (SGA scored 25 in 29min). Home court doesn't help a non-scorer. Expect similar zero offensive impact.", confidence:"high" }
      ]
    },
    games: [{num:1,result:"W",homeScore:119,awayScore:84,winner:"OKC",notes:"35-pt blowout. SGA 25pts (5-18 FG, 0-4 3PT, 15-17 FT) in 29min — sat Q4. J.Williams 22pts (9-15 FG), 7reb, 6ast — All-NBA return. Holmgren 16pts, 7reb, 2stl, 2blk in 25min. PHX: Booker 23pts, 6reb. Brooks 18pts, 7reb — shot team out early (8 attempts while down 23). PHX 35% FG first half, 17 TOs, OKC pts off TOs 15-2. Q1: 35-20 OKC, Half: 65-44. Model picks: OKC ML ✅, OKC -14.5 ✅ (+20.5 margin), SGA O27.5 ❌ (25pts — sat in blowout)."},{num:2,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "DEN-MIN", conf: "West", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Aaron Gordon", target:"Anthony Edwards", dLebron:-0.774, targetUsg:32.5, note:"G1 CONFIRMED: Gordon physical enough to bother Ant (7-19 FG) but knee was the bigger factor. Gordon's on/off (+12.8) means DEN defense craters without him — foul trouble (3 fouls Q1 in G1) is the x-factor. Edwards' 63.9% 2PT vs DEN means he WILL score at the rim — Gordon must force midrange. G2 KEY: If Edwards' knee loosens, Gordon needs help-side from Braun/Brown on drives." },
      awayDefOnHome: { defender:"Jaden McDaniels", target:"Nikola Jokic", dLebron:0.233, targetUsg:33.2, note:"G1 CONFIRMED: Jokic dominated (25/13/11) despite slow Q1 (3pts). McDaniels' tech for pushing Jokic revealed 'low flustered threshold'. G2 ADJUSTMENT: Finch may deploy Randle as PRIMARY Jokic defender (lower-body strength for post-up contests) with Gobert floating to 'guard' Braun (.301 3P%). Anderson is another option — Swiss army knife versatility. Team defense > individual assignment vs Jokic." },
      secondaryMatchups: [
        { defender:"Julius Randle", target:"Nikola Jokic", note:"POTENTIAL G2 SCHEME: Randle's physical lower-body strength can contest Jokic post-ups better than McDaniels' length approach. Frees Gobert to roam as help-side anchor rather than getting exploited 1v1 by Jokic" },
        { defender:"Kyle Anderson", target:"Nikola Jokic", note:"Smallball option: Anderson + Randle alternating on Jokic with different body types and defensive styles. Anderson's IQ and length disrupt passing lanes without fouling" },
        { defender:"Jamal Murray", target:"Donte DiVincenzo", note:"Murray will hunt DiVincenzo (or Conley when he enters) on switches. DiVincenzo's defense is adequate but Murray's pull-up game creates mismatches" },
        { defender:"Christian Braun", target:"Ayo Dosunmu", note:"Braun's POA defense is solid but Dosunmu's transition speed is where MIN's identity improvement lives. Braun must get back in transition — his .301 3P% means MIN won't guard him tightly on offense, freeing help defenders" }
      ]
    },
    homeTeam: {
      name: "Nuggets", city: "Denver", abbr: "DEN", seed: 3, record: "54-28",
      systemBonus: 1.5, // Jokic system
      playoffPedigree: 2, // 2023 champs
      offStyle: "Jokic post-up/handoff initiation — most stylistically distinctive offense in the league (Partnow outlier). Murray secondary P&R creator.", initiators: 2,
      color: "#0E2240", color2: "#FEC524",
      advStats: { ortg:122.6, drtg:114.1, netRtg:8.5, pace:97.8, ts:59.8, efg:56.2, tov:12.5, reb:50.8, ortgRk:1, drtgRk:21, clutchNetRtg:4.2, last10:"8-2", fgPct:53.2, threePct:39.6, ftPct:81.6, orbPct:24.6 },
      players: [
        { name:"Nikola Jokic", age:31, pos:"C", rating:97, ppg:27.7, rpg:12.9, apg:10.7, fgp:56.9, per:31.5, ts:66.2, epm:10.2, bpm:14.2, ws48:.312, onOff:14.5, clutch:9.1, vorp:9.2, usg:33.2, injury:null, lebron:7.367, oLebron:6.247, dLebron:1.12, war:13.33, offRole:"Shot Creator", defRole:"Anchor Big",
          matchupNote:"Best player alive. PER 31.5, EPM 10.2, +14.5 on/off — all league-best. 2nd consecutive triple-double season (27.7/12.9/10.7). Averaged 35.8/15/11.3 vs MIN in reg season (3-1). Historically dominates Gobert. G1: 25/13/11 (22nd career playoff TD), dominated Q2-Q3 with 15pts", baseRating:97, starCeiling:2, injuryRisk:0, playoffAscension:0.5 },
        { name:"Jamal Murray", pos:"PG", rating:82, ppg:25.4, rpg:4.4, apg:7.1, fgp:48.3, per:21.5, ts:60.8, epm:4.2, bpm:3.8, ws48:.165, onOff:5.5, clutch:7.8, vorp:3.8, usg:28.0, injury:null, lebron:1.389, oLebron:3.171, dLebron:-1.782, war:6.394, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"Career-year All-Star: 25.4 PPG, .435 3P%, .887 FT%. Two-man game with Jokic is unstoppable (1.18 PPP). G1: 30pts, 16/16 FT (historic), 0/8 from 3 — won via free throw aggression. Combined Jokic/Murray: 55pts/18reb/18ast in G1", baseRating:82, starCeiling:1, injuryRisk:0.8, activeInjury:{type:"chronic knee",severity:0.7,note:"ACL tear history (2020). G1: 30pts on 16/16 FT despite 0/8 from 3 — found alternative scoring path. Conditioning concern grows each game."} },
        { name:"Cameron Johnson", pos:"SF", rating:72, ppg:12.2, rpg:3.8, apg:2.4, fgp:48.0, per:15.2, ts:59.5, epm:1.8, bpm:1.5, ws48:.115, onOff:10.1, clutch:5.0, vorp:1.9, usg:22.0, injury:null, lebron:0.574, oLebron:0.806, dLebron:-0.231, war:3.133, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Acquired from BKN for MPJ (Jul 2025). Starting SF over Watson. Underwhelming first season (12.2 PPG) but form picked up late. 43% from 3, elite wing defense. FantasyLabs on/off +10.14 NetRtg. Closes games — more defensive versatility than MPJ", baseRating:72 },
        { name:"Aaron Gordon", pos:"PF", rating:73, ppg:16.2, rpg:5.8, apg:2.7, fgp:49.7, per:17.4, ts:59.2, epm:2.0, bpm:1.8, ws48:.128, onOff:12.8, clutch:5.2, vorp:1.7, usg:22.5, injury:null, lebron:0.61, oLebron:1.384, dLebron:-0.774, war:1.934, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"Edwards assignment. 16.2 PPG in 36 games (injury-riddled season). G1: 17pts despite 3 fouls in Q1 — foul trouble risk. FantasyLabs on/off +12.79 NetRtg — DEN's defense falls apart without him. On minutes restriction pre-playoffs", baseRating:73 },
        { name:"Christian Braun", pos:"SG", rating:66, ppg:12.0, rpg:4.8, apg:2.7, fgp:51.9, per:13.8, ts:57.4, epm:0.8, bpm:0.5, ws48:.088, onOff:1.8, clutch:5.8, vorp:1.1, usg:20.0, injury:null, lebron:-0.326, oLebron:-0.361, dLebron:0.035, war:1.87, offRole:"Stationary Shooter", defRole:"Point of Attack",
          matchupNote:"Championship DNA. 5.8 clutch rating. CRITICAL: only .301 3P% — weakest shooter in starting 5. MIN can help off Braun. May lose closing minutes to Brown if form dips. Injury-riddled season (44 games)", baseRating:66 },
        { name:"Peyton Watson", pos:"SF", rating:0, ppg:14.6, rpg:4.9, apg:2.1, fgp:49.1, per:15.0, ts:57.0, epm:0.5, bpm:0.3, ws48:.085, onOff:1.0, clutch:4.5, vorp:1.2, usg:23.0, injury:"Questionable — hadn't played 2 weeks pre-playoffs", lebron:-1.281, oLebron:-1.022, dLebron:-0.258, war:1.181, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"Breakout year: 14.6 PPG, 1.1 BPG, .411 3P%. Key x-factor per Fadeaway World — biggest bench weapon. Can plug into Johnson OR Gordon's role. Closes games in defensive situations over Johnson. Health status unclear for series", baseRating:62 },
        { name:"Bruce Brown", pos:"SG", rating:62, ppg:7.9, rpg:3.9, apg:2.1, fgp:47.5, per:12.2, ts:56.5, epm:0.5, bpm:0.3, ws48:.082, onOff:1.2, clutch:5.2, vorp:0.9, usg:18.0, injury:null, lebron:-2.217, oLebron:-1.82, dLebron:-0.397, war:0.315, offRole:"Stationary Shooter", defRole:"Point of Attack",
          matchupNote:"2023 championship role player. Key closing lineup piece: Murray/Brown/Watson-or-Johnson/Gordon/Jokic. Defensive pest, reliable floor spacer (.385 3P%). Getting increased clutch minutes over Braun per Fadeaway World", baseRating:62 },
        { name:"Tim Hardaway Jr.", pos:"SG", rating:60, ppg:13.5, rpg:2.6, apg:1.4, fgp:44.7, per:13.2, ts:56.8, epm:-0.2, bpm:-0.5, ws48:.072, onOff:0.5, clutch:4.0, vorp:0.6, usg:21.5, injury:null, lebron:-1.5, oLebron:-0.8, dLebron:-0.7, war:0.8, offRole:"Movement Shooter", defRole:"Low Activity",
          matchupNote:"Bench microwave scorer: 13.5 PPG off bench, .407 3P%. Can light up any defense. Specialist role — may see 15-20 min in blowouts or when Braun struggles", baseRating:60 },
        { name:"Jonas Valanciunas", pos:"C", rating:58, ppg:8.7, rpg:5.1, apg:1.2, fgp:58.2, per:18.5, ts:62.0, epm:0.5, bpm:1.0, ws48:.130, onOff:-0.5, clutch:3.5, vorp:1.1, usg:17.8, injury:null, lebron:-0.288, oLebron:0.167, dLebron:-0.455, war:1.185, offRole:"Post Scorer", defRole:"Anchor Big",
          matchupNote:"Acquired from SAC (Jul 2025). Jokic's backup — elite per-minute efficiency (.582 FG%). Only 13.4 MPG but critical for Jokic rest periods", baseRating:58 },
        { name:"Julian Strawther", pos:"SG", rating:56, ppg:7.2, rpg:2.0, apg:1.1, fgp:46.7, per:10.5, ts:57.8, epm:-0.3, bpm:-0.8, ws48:.055, onOff:-0.5, clutch:3.5, vorp:0.3, usg:16.2, injury:null, lebron:-2.076, oLebron:-1.232, dLebron:-0.844, war:0.211, offRole:"Movement Shooter", defRole:"Low Activity",
          matchupNote:"Swingman, can play backcourt or wing. .387 3P% on 15 MPG. Swing player in playoff rotation", baseRating:56 },
        { name:"DaRon Holmes II", pos:"PF", rating:48, ppg:4.5, rpg:2.2, apg:0.6, fgp:50.8, per:9.5, ts:58.0, epm:-1.2, bpm:-1.8, ws48:.042, onOff:-1.5, clutch:2.5, vorp:-0.4, usg:14.2, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:null, defRole:null,
          matchupNote:"Second-year big, physical energy off bench. Emergency minutes depth piece", baseRating:48 },
        { name:"Spencer Jones", pos:"SF", rating:50, ppg:3.0, rpg:1.5, apg:0.5, fgp:42.0, per:8.0, ts:54.0, epm:-0.5, bpm:-1.0, ws48:.030, onOff:0.0, clutch:3.0, vorp:0.1, usg:12.0, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Depth wing providing 3PT shooting off bench. G1: 9min with 5pts (1/1 3PT, 2/3 FT). Spot minutes contributor", baseRating:50 }
      ],
      synergy: [
        { players:["Murray","Braun","C.Johnson","Gordon","Jokic"], score:85, note:"Starting 5. Cam Johnson replaces MPJ — more defensive versatility but slightly less spacing. Jokic-Murray two-man game: 1.18 PPP still elite. Team-best 39.6% 3P% (NBA #1). DRtg improved with Johnson's wing defense" },
        { players:["Murray","Brown","Watson","Gordon","Jokic"], score:82, note:"CLOSING LINEUP per Fadeaway World. Brown replaces Braun (.301 3P%) for defensive intensity. Watson's switchability at backup 5 gives versatility. G1: this group closed out MIN in Q4" },
        { players:["Murray","Hardaway","C.Johnson","Brown","Valanciunas"], score:68, note:"Bench-heavy unit when Jokic rests. Hardaway microwave scorer (13.5 PPG, .407 3P%). Valanciunas holds center. Limited minutes but critical — Jokic rest periods are DEN's biggest vulnerability" },
        { players:["Murray","Braun","Strawther","Watson","Jokic"], score:72, note:"Athletic smallball option. Watson at 4, Strawther spacing (.387 3P%). Used when DEN wants to run in transition. Watson can slide to 5 if Jokic needs a breather" }
      ]
    },
    awayTeam: {
      name: "Timberwolves", city: "Minnesota", abbr: "MIN", seed: 6, record: "49-33",
      systemBonus: 1.0, // Edwards-driven pace
      playoffPedigree: 1, // 2024 WCF
      offStyle: "Edwards ISO/P&R primary. Randle secondary shot creation. Gobert screen actions. Conventional style — easy to scout.", initiators: 2,
      color: "#0C2340", color2: "#236192",
      advStats: { ortg:114.8, drtg:111.5, netRtg:3.3, pace:96.4, ts:57.1, efg:53.5, tov:13.1, reb:48.2, ortgRk:7, drtgRk:12, clutchNetRtg:2.1, last10:"6-4", fgPct:50.5, threePct:33.8, ftPct:76.2, orbPct:26.2, drbPctRk:28, postASBNetRtg:-0.1 },
      players: [
        { name:"Anthony Edwards", pos:"SG", rating:86, ppg:28.8, rpg:5.0, apg:3.7, fgp:48.9, per:21.8, ts:59.2, epm:5.8, bpm:4.5, ws48:.178, onOff:7.8, clutch:7.5, vorp:3.5, usg:32.5, injury:"GTD — right knee management", lebron:1.285, oLebron:2.623, dLebron:-1.337, war:5.014, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"Career-high 28.8 PPG. Averaged 30+ PPG vs DEN this season on 63.9% from 2PT but just 25.8% from 3PT (8-31). G1: 22pts/7ast on 7-19 FG — became franchise postseason assists leader. Knee limits burst but elite rim attacking remains. 18 techs (NBA-high) — emotional volatility is real playoff risk", baseRating:90, starCeiling:2, injuryRisk:0.6, playoffAscension:0.8, activeInjury:{type:"knee management",severity:0.7,note:"G1: 22pts on 7-19 FG. Admitted 'a little fatigued' post-game. Missed 11 of final 14 regular season games. Runner's knee may improve with activity in G2, but conditioning compounds across series."} },
        { name:"Julius Randle", pos:"PF", rating:74, ppg:21.1, rpg:6.7, apg:5.0, fgp:48.1, per:20.2, ts:57.8, epm:2.1, bpm:2.4, ws48:.132, onOff:3.2, clutch:5.5, vorp:2.6, usg:26.2, injury:null, lebron:0.257, oLebron:1.499, dLebron:-1.242, war:4.445, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"21.1 PPG secondary creator. Physical mismatch potential. May be deployed as PRIMARY Jokic defender per MinnPost analysis — lower-body strength can contest post-ups. Allows Gobert to float and 'guard' Braun (.301 3P%). G1: tech foul for frustration. Jokic PER advantage is +11.3 but scheme can mitigate", baseRating:74, starCeiling:1, injuryRisk:0.4 },
        { name:"Rudy Gobert", age:33, pos:"C", rating:72, ppg:10.9, rpg:11.5, apg:1.7, fgp:68.2, per:18.4, ts:65.8, epm:2.4, bpm:2.1, ws48:.142, onOff:4.5, clutch:4.2, vorp:1.9, usg:19.0, injury:null, lebron:1.822, oLebron:-0.603, dLebron:2.425, war:6.38, offRole:"Roll + Cut Big", defRole:"Anchor Big",
          matchupNote:"DPOY caliber (1.6 BPG, .682 FG%). G1: 17/10 WPA MVP (+15.0%) — most impactful player on court. BUT non-Gobert minutes are MIN's Achilles heel: DRtg 7.9 pts/100 worse when he sits (up from 4.4 last year). Frustration from Jokic matchup carries into subsequent possessions. Jokic historically averages 28/14/11 vs Gobert", baseRating:75 },
        { name:"Jaden McDaniels", pos:"SF", rating:68, ppg:14.8, rpg:4.2, apg:2.7, fgp:51.5, per:14.5, ts:57.2, epm:0.8, bpm:0.4, ws48:.078, onOff:1.5, clutch:4.8, vorp:1.1, usg:20.5, injury:null, lebron:-1.154, oLebron:-1.387, dLebron:0.233, war:1.896, offRole:"Athletic Finisher", defRole:"Point of Attack",
          matchupNote:"14.8 PPG breakout (.412 3P%, .835 FT%). G1: unsportsmanlike technical for pushing Jokic — 'low flustered threshold' per MinnPost. Emotional volatility like Edwards. Recently returned from injury. 7-foot wing length disrupts passing lanes", baseRating:68 },
        { name:"Donte DiVincenzo", pos:"PG", rating:62, ppg:12.2, rpg:4.1, apg:3.8, fgp:40.6, per:13.5, ts:54.0, epm:0.3, bpm:0.0, ws48:.070, onOff:1.0, clutch:4.5, vorp:1.0, usg:21.0, injury:null, lebron:0.556, oLebron:0.196, dLebron:0.359, war:4.714, offRole:"Movement Shooter", defRole:"Chaser",
          matchupNote:"STARTING PG (not Conley). G1: 4 three-pointers, spacing the floor. 37.9% from 3, played all 82 games — ironman durability. Finch chose shooting/athleticism over Conley's playmaking for this series", baseRating:62 },
        { name:"Naz Reid", pos:"C", rating:66, ppg:13.6, rpg:6.2, apg:2.2, fgp:45.6, per:17.5, ts:57.0, epm:1.0, bpm:1.5, ws48:.110, onOff:2.5, clutch:5.5, vorp:1.7, usg:22.2, injury:null, lebron:1.086, oLebron:-0.011, dLebron:1.096, war:4.46, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Most dependable bench player all season. 13.6 PPG 6th man. Reid-Gobert pairing worked in 2024 DEN series. Can play beside or replace Gobert. Changes MIN's offense — adds spacing Gobert lacks", baseRating:66 },
        { name:"Ayo Dosunmu", pos:"SG", rating:64, ppg:14.4, rpg:4.2, apg:3.5, fgp:52.1, per:15.8, ts:58.5, epm:1.0, bpm:0.8, ws48:.098, onOff:2.0, clutch:4.5, vorp:1.2, usg:20.5, injury:null, lebron:-0.5, oLebron:0.3, dLebron:-0.8, war:2.5, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Midseason acquisition from CHI (for Dillingham). Transformed MIN's transition offense — their biggest identity improvement this season. 14.4 PPG, .414 3P%, .925 FT%. Strong defensive rotations/closeouts. Key rotation piece — 28.9 MPG", baseRating:64 },
        { name:"Kyle Anderson", pos:"SF", rating:55, ppg:4.6, rpg:3.7, apg:3.3, fgp:44.0, per:10.5, ts:53.0, epm:0.0, bpm:-0.3, ws48:.060, onOff:0.5, clutch:4.0, vorp:0.5, usg:13.0, injury:null, lebron:-0.8, oLebron:-0.5, dLebron:-0.3, war:1.2, offRole:"Primary Ball Handler", defRole:"Wing Stopper",
          matchupNote:"Swiss army knife — may alternate guarding Jokic with Randle in smallball lineups. 19.1 MPG, defensive versatility. Smallball non-Gobert frontcourt (Anderson + Randle) is a viable Finch adjustment for G2+", baseRating:55 },
        { name:"Mike Conley", pos:"PG", rating:52, ppg:4.5, rpg:1.7, apg:2.9, fgp:33.5, per:8.5, ts:48.0, epm:-0.5, bpm:-1.0, ws48:.042, onOff:-1.5, clutch:5.8, vorp:0.2, usg:14.0, injury:null, lebron:-0.753, oLebron:-0.913, dLebron:0.159, war:0.5, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Reduced veteran reserve role (18.4 MPG, .335 FG%). DiVincenzo took his starting spot. 'Not dead yet' per MinnPost but clearly diminished. 5.8 clutch rating is his remaining value. Murray will target him defensively", baseRating:52 },
        { name:"Bones Hyland", pos:"PG", rating:54, ppg:8.5, rpg:1.8, apg:2.6, fgp:42.0, per:11.0, ts:55.0, epm:-0.3, bpm:-0.5, ws48:.058, onOff:0.0, clutch:3.5, vorp:0.4, usg:19.5, injury:null, lebron:-1.5, oLebron:-0.8, dLebron:-0.7, war:0.8, offRole:"Shot Creator", defRole:"Low Activity",
          matchupNote:"Backup PG energy scorer. 16.6 MPG, .388 3P%. Benefits from Dosunmu's transition boost. Former Nugget — knows DEN's system", baseRating:54 },
        { name:"Terrence Shannon Jr.", pos:"SF", rating:48, ppg:5.0, rpg:2.0, apg:0.8, fgp:42.0, per:9.0, ts:52.0, epm:-1.0, bpm:-1.5, ws48:.042, onOff:-1.0, clutch:2.8, vorp:-0.2, usg:14.5, injury:null, lebron:-2.196, oLebron:-0.586, dLebron:-1.61, war:0.092, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Finally making good on potential as meaningful asset per MinnPost. Athletic wing depth, defensive energy in spot minutes", baseRating:48 }
      ],
      synergy: [
        { players:["DiVincenzo","Edwards","McDaniels","Randle","Gobert"], score:77, note:"ACTUAL starting 5 (DiVincenzo replaced Conley). G1: Spacing improved with DiVincenzo's 37.9% 3P. DRtg 109.2 solid. Gobert spacing limits ORtg to ~112. Edwards ISO: 1.02 PPP (82nd pctl). 710 min together (most-used lineup in NBA)" },
        { players:["Dosunmu","Edwards","McDaniels","Randle","Gobert"], score:74, note:"Dosunmu swap for DiVincenzo — adds transition creation and ball-handling. Dosunmu transformed MIN's transition offense (biggest identity improvement this season). More aggressive attacking lineup" },
        { players:["DiVincenzo","Dosunmu","Edwards","Randle","Reid"], score:73, note:"Non-Gobert offense lineup. Reid adds spacing Gobert lacks (.356 3P%). Reid-Gobert pairing worked in 2024 DEN series but this all-offense unit can punish DEN's 21st-ranked DRtg. RISK: DRtg 7.9 pts/100 worse without Gobert" },
        { players:["Conley","Hyland","Anderson","Randle","Reid"], score:60, note:"Deep bench unit when Edwards + Gobert rest. Anderson's Swiss army knife defense, Conley's 5.8 clutch rating, Hyland's energy scoring. Very vulnerable — DEN bench units should dominate this group" },
        { players:["DiVincenzo","Edwards","Anderson","Randle","Gobert"], score:72, note:"POTENTIAL G2 ADJUSTMENT: Anderson replaces McDaniels for Jokic matchup variety. Anderson + Randle can alternate on Jokic with different body types. Smallball-adjacent without sacrificing Gobert's rim protection" }
      ]
    },
    externalFactors: [
      { team:"MIN", player:"Anthony Edwards", desc:"Missed 11 of final 14 games — knee management. G1: 22pts on 7-19 FG, admitted 'a little fatigued'. Runner's knee may improve with activity in G2 (joint loosens), but conditioning compounds across series.", impact:-4, category:"injury" },
      { team:"MIN", player:"Anthony Edwards", desc:"3rd time facing Denver in 4 years. Led 20-pt Game 7 comeback last year IN Denver. 26.5/7.4/6.0 across 31 career playoff games. This matchup brings out his best.", impact:5, category:"motivation" },
      { team:"DEN", player:null, desc:"#1 offense in NBA (122.6 ORtg). Best 3P% in NBA (39.6%). Won last 12 games. 28-13 at home. Mile-high altitude compounds conditioning — opponents shoot worse.", impact:5, category:"motivation" },
      { team:"DEN", player:null, desc:"21st in DRtg (114.1). Can be scored on — especially in transition. Dosunmu's acquisition transformed MIN's transition game, which is DEN's defensive weak spot.", impact:-3, category:"chemistry" },
      { team:"MIN", player:"Anthony Edwards", desc:"18 technical fouls (most in NBA), $320K in fines, ejected in OT vs Nets. McDaniels also got unsportsmanlike tech in G1. Emotional volatility across the roster is a playoff liability.", impact:-4, category:"personal",
        evidence:"ESPN confirmed Edwards picked up his 18th tech of the season (NBA-high) for profanity after a no-call. Fined 6 separate times totaling $320K. Coach Finch defended him but admitted frustration is a pattern. G1 CONFIRMED: conditioning faded in 2nd half as frustration mounted with knee limitations. McDaniels' tech for pushing Jokic reveals 'low flustered threshold' (MinnPost) — emotional contagion risk across the roster.",
        sources:["ESPN: espn.com/nba/story/_/id/44637260","NBA.com: nba.com/news/anthony-edwards-mandatory-suspension"], verdict:"verified" },
      { team:"MIN", player:null, desc:"28th in defensive rebounding. Post-ASB net rating -0.1. Team was trending DOWN entering playoffs despite 49-33 record. DEN's +24.6% ORB% can generate second chances.", impact:-3, category:"chemistry" },
      { team:"MIN", player:"Ayo Dosunmu", desc:"Midseason acquisition from CHI transformed MIN's transition offense — their biggest identity improvement. Former DEN roster familiarity (played against them extensively in Central Division) adds schematic awareness.", impact:3, category:"chemistry" },
      { team:"DEN", player:"Peyton Watson", desc:"Questionable status — hadn't played 2 weeks pre-playoffs. If Watson is available, DEN's closing lineup and defensive versatility improve significantly. If not, Johnson/Strawther absorb minutes.", impact:-3, category:"injury" },
      { team:"DEN", player:"Aaron Gordon", desc:"16.2 PPG in only 36 games (injury-riddled season). G1: 17pts but 3 fouls in Q1 — foul trouble risk. On minutes restriction pre-playoffs. FantasyLabs on/off +12.79 NetRtg — DEN's defense falls apart without him.", impact:-2, category:"injury" }
    ],
    game1: {
      spread: "DEN -6.5", moneyline: "DEN -260 / MIN +185", ou: "O/U 231.5",
      pick: "DEN", confidence: "high", projScore: "DEN 119 — MIN 110",
      reasoning: "RESULT: DEN 116-105 — Model prediction CONFIRMED with high accuracy. Projected DEN 119-110, actual was DEN 116-105. Winner, confidence, and margin all correct. Jokic dominated as predicted — the altitude + home court + Gobert mismatch all played out. Minnesota started strong but Denver's depth and experience showed in the second half. Edwards' knee limitation visible in conditioning — Denver pulled away when MIN couldn't sustain intensity. Murray's clutch scoring sealed it. The model's key insight about Game 1 conditioning after extended absence was validated.",
      prosHome: ["Jokic dominated Gobert as predicted (CONFIRMED)", "Home court + altitude factor decisive (CONFIRMED)", "Murray clutch scoring in 2nd half (CONFIRMED)", "Denver's depth advantage — Watson/Strawther contributed"],
      consHome: ["Still allowed 105 — DRtg concern remains valid", "MIN competed early — altitude fatigue kicked in late", "Edwards showed flashes despite knee — not totally neutralized"],
      prosAway: ["Edwards competed despite knee — showed fight", "MIN led early — not intimidated in Denver", "DiVincenzo starting lineup provided spacing"],
      consAway: ["Edwards conditioning faded in 2nd half (CONFIRMED)", "Jokic PER dominance over Gobert (CONFIRMED)", "Depth gap showed late — bench outscored", "Denver experience in clutch decisive"]
    },
    modelLessons: [
      { type:"overweighted", lesson:"Model was well-calibrated here. Projected 119-110, actual 116-105. Total points nearly identical (229 projected vs 221 actual). The under hit but the spread and winner were correct with high confidence." },
      { type:"underweighted", lesson:"Denver's defensive intensity in playoffs — DRtg improved from 114.1 regular season, holding MIN to 105. Playoff defense > regular season defense for experienced teams." },
      { type:"missed", lesson:"DiVincenzo starting at PG instead of Conley was a lineup change not accounted for. MIN went with more shooting/athleticism — worth tracking lineup adjustments for Game 2." },
      { type:"overweighted", lesson:"Edwards' comeback history in Denver was a real concern, but the knee limitation proved decisive. He went 7-of-19 FG — the injury affected shooting efficiency without limiting availability (22/9/7/3blk). Model's injuryRisk binary is too crude: need to distinguish 'plays but diminished' from 'limited minutes'. Efficiency-based injury impact would better capture this." },
      { type:"missed", lesson:"WPA analysis (inpredictable) reveals Gobert was G1's true MVP (+15.0% WPA) while Edwards was LVP (-8.2%). Free throws were the dominant factor (+23.1% WPA for DEN — Murray's 16/16 FT was historic). Rebounds added +13.7% WPA. Model correctly predicted DEN win but undervalued Gobert's impact and overvalued Edwards' ceiling in a diminished state." }
    ],
    game2: {
      spread: "DEN -4.5", moneyline: "DEN -190 / MIN +160", ou: "O/U 222.5",
      pick: "MIN", confidence: "low", projScore: "MIN 112 — DEN 109",
      schedule: "Mon Apr 20 — 10:30 PM ET — NBC",
      reasoning: "BACKTEST-CALIBRATED PICK: MIN (low confidence). The 2025 backtest revealed the 'one explosion game' pattern — underdogs get 1-2 games per series, and Edwards (starCeiling: 2) is the highest-ceiling underdog star in R1. In the 2025 WCF, Edwards dropped 143 points as a team in his explosion game (G3 vs OKC), proving his ceiling is genuinely historic. Our model now factors: (1) Edwards' starCeiling:2 adds +0.6 to MIN's win prob, (2) Finch's system coherence (+1.0) rivals Denver's (+1.5) more closely than individual ratings suggest, (3) Denver's playoffPedigree:2 (2023 champs) is offset by MIN's playoffPedigree:1 (2024 WCF). The bounce-back model actually favors DEN at 77% in R1, which is why this stays low confidence. But the backtest's Lesson 7 (star ceiling variance) says Edwards produces at least one game far above baseline per series — and G2 at home after a road loss is the most likely spot. Murray's injuryRisk:0.8 (chronic knee) adds a health degradation factor that could manifest as reduced burst. This is the highest-variance series in R1.",
      g1Adjustments: [
        "FINCH G2 HISTORY vs DEN: In 2024 Game 2, held Nuggets to 80pts (season-low). Defensive adjustments against Jokic-Murray PnR are proven.",
        "EDWARDS PLAYOFF DNA: 26.5/7.4/6.0 across 31 playoff games. Led 20-pt G7 comeback IN Denver in 2024. This matchup brings out his best.",
        "Runner's knee often improves in 2nd game — joint loosens with activity. Edwards could be closer to 90%",
        "Finch may deploy more Naz Reid alongside Gobert — the Reid-Gobert pairing worked in 2024 series",
        "MIN composure: G1 jitters (17-2 run allowed) won't repeat — this is their 3rd trip to Denver in 4 years",
        "DEN 21st in DRtg (114.1) — exploitable when Edwards attacks the rim and draws fouls",
        "DiVincenzo starting at PG gave spacing — Finch can refine this rotation with G1 data",
        "COACHING GAP: Adelman A- (dominated middle quarters) vs Finch C+ (Q2-Q3 collapse, no timeout during 14-0 run). But Finch's 2024 G2 history (held DEN to 80pts) proves he CAN adjust between games."
      ],
      prosHome: ["Jokic structural dominance over Gobert persists", "Championship experience — 17-2 runs are repeatable", "Altitude compounds over consecutive games", "Murray's 7.8 clutch rating in playoffs", "Model validated in G1 — system is calibrated here"],
      consHome: ["Finch held DEN to 80pts in 2024 G2 — proven adjustment ability", "Watson still out — depth limited at forward", "MIN's 3rd time facing DEN — most familiar opponent in the league", "DRtg 114.1 is exploitable by an aggressive Edwards"],
      prosAway: ["EDWARDS HISTORY: 20-pt G7 comeback IN Denver, 26.5 PPG in 31 playoff games", "FINCH ADJUSTMENT: held DEN to season-low 80pts in 2024 Game 2", "Runner's knee often improves in 2nd game of a series", "3rd time facing DEN in 4 years — no mystery, total familiarity", "Naz Reid off bench (13.6 PPG) — Reid-Gobert pairing worked in 2024", "G1 jitters gone — MIN now knows the altitude and environment"],
      consAway: ["Jokic-Gobert mismatch is still +11.3 PER differential", "Edwards knee is genuinely limiting — not just narrative", "0-1 deficit means MIN must win a road game to avoid 0-2", "Denver's home record (28-13) is formidable"]
    },
    // ── G3 Per-Player Offensive Outlook (Research-backed) ──
    // Series tied 1-1. G3 at Target Center (MIN home). No altitude penalty.
    // KEY G2 FINDING: Gobert held Jokic to 1-8 when matched up (worst playoff shooting vs single defender).
    // Edwards health trajectory: 22pts G1 → 30pts G2 (knee warming up). HCA flips to MIN.
    // Peyton Watson OUT for series (hamstring). Hardaway emerged as DEN's key bench weapon (16pts G2).
    // Hyland explosion (13pts/10min G2) may earn more run. Conley minutes shrinking.
    g3PlayerOutlook: {
      home: [ // DEN (away team, playing at Target Center)
        // Jokic: G1 25/13/11 (11-19, 57.9%), G2 24/15/8 (8-20, 40%). Gobert held him 1-8 when on floor G2.
        // Career vs Gobert in playoffs: 26.3/9.9/6.9. Historically bounces back after losses.
        // BUT road game + Gobert's G2 defensive blueprint + no altitude = tempered ceiling.
        { player:"Nikola Jokic", outlook:"neutral", projFgPct:0.50, ptsRange:[22,30], reason:"Gobert G2 blueprint (1-8 when matched) will carry to G3, but Jokic historically responds — expect adjustment via midrange/passing over forcing shots. Road game tempers ceiling. Still the best player alive.", confidence:"high" },

        // Murray: G1 30pts (7-22, 0-8 3PT, 16-16 FT), G2 30pts (11-25, 6-14 3PT).
        // Q4 collapse in G2 (2-12 combined w/ Jokic). ACL history, chronic knee concern.
        // All-Star year (25.4/7.1). Road game, hostile crowd. Inconsistent efficiency.
        { player:"Jamal Murray", outlook:"neutral", projFgPct:0.43, ptsRange:[22,30], reason:"Consistent 30pt scorer through 2 games but efficiency volatile (31.8% G1, 44% G2). Q4 collapse in G2 raises fatigue concern. ACL history + road game = expect similar volume, middling efficiency.", confidence:"medium" },

        // Gordon: G1 17pts (5-10, 50%) but 3 fouls Q1, G2 8pts (3-9, 33%).
        // Injury-riddled season (36 games), minutes restriction pre-playoffs.
        // Road game = less favorable whistle. Foul trouble risk is real.
        { player:"Aaron Gordon", outlook:"bad", projFgPct:0.42, ptsRange:[8,14], reason:"G2 regression (8pts/33%) + foul trouble pattern (3 fouls Q1 in G1) + road officiating disadvantage. Only 36 games this season — conditioning and rhythm concerns. DEN defense craters without him (+12.8 on/off) so foul trouble is series-altering.", confidence:"high" },

        // Braun: G1 12pts (4-10, 2-3 3PT), G2 16pts (5-9, 1-3 3PT, 5-7 FT).
        // Season .301 3PT% — MIN helps off him. But stepped up with drives/FTs in G2.
        // Championship DNA from 2023. 36 MPG starter.
        { player:"Christian Braun", outlook:"neutral", projFgPct:0.45, ptsRange:[10,16], reason:"Season .301 3PT% means MIN will sag off — but G2 showed he can score via drives and FT (5-7). Championship DNA provides floor. MIN crowd won't rattle him.", confidence:"medium" },

        // Cam Johnson: G1 12pts (5-12, 2-7 3PT), G2 13pts (5-10, 1-6 3PT).
        // 43% 3PT season shooter but 3-13 (23%) from 3 in series. Due for regression to mean.
        // Acquired from BKN for MPJ. More defensive versatility. First full playoff series.
        { player:"Cameron Johnson", outlook:"neutral-good", projFgPct:0.46, ptsRange:[10,16], reason:"Positive 3PT regression candidate: 43% season shooter at just 23% in series (3-13). First full playoff run — may settle in at Target Center's less hostile environment for shooters vs altitude. Wing defense is reliable.", confidence:"medium" },

        // Hardaway: G1 7pts (2-6, 1-3 3PT), G2 16pts (4-9, 3-3 3PT!).
        // Career vs MIN: 19+ PPG, 3.8 3PT/game historically. Microwave scorer (.407 3PT season).
        // Bench weapon who's locked in for this matchup.
        { player:"Tim Hardaway Jr.", outlook:"good", projFgPct:0.48, ptsRange:[12,18], reason:"Historically TORMENTS Minnesota (19+ PPG, 3.8 3PT/game vs MIN). G2 breakout (16pts, 3-3 3PT) confirms he's dialed in. Microwave scorer who doesn't care about road environment. DEN's most dangerous bench weapon.", confidence:"high" },

        // Brown: G1 8pts (3-7, 1-2 3PT, 5 STL!), G2 7pts (2-4, 2-4 3PT).
        // Closing lineup piece. Championship DNA. Defensive pest.
        { player:"Bruce Brown", outlook:"neutral", projFgPct:0.44, ptsRange:[5,10], reason:"Reliable closing-lineup connector. 5 steals in G1 was massive defensive impact. Low offensive usage but efficient (.385 3PT season). Minutes may increase if Braun struggles from 3.", confidence:"low" },

        // Valanciunas: G1 0pts (0-0, 8min), G2 0pts (0-0, 3min). Minutes collapsed.
        { player:"Jonas Valanciunas", outlook:"bad", projFgPct:0.50, ptsRange:[0,4], reason:"Minutes collapsing (8→3min). Too slow to switch vs Edwards in space. Playoff rotation has squeezed him out. May not play meaningful minutes in G3.", confidence:"high" },

        // Spencer Jones: G1 5pts (1-1, 9min), G2 0pts (0-0, 10min). Spot minutes depth.
        { player:"Spencer Jones", outlook:"neutral", projFgPct:0.40, ptsRange:[0,4], reason:"Spot minutes depth piece. 9-10min per game. Minimal offensive impact expected.", confidence:"low" }
      ],
      away: [ // MIN (home team, playing at Target Center)
        // Edwards: G1 22pts (7-19, 36.8%), G2 30pts (10-25, 40%).
        // Knee warming up — health trajectory improving. Home crowd energy.
        // Career playoff avg 26.5 PPG. 3rd time facing DEN. Led 20-pt G7 comeback IN Denver in 2024.
        // 18 techs this season — emotional volatility, but home crowd channels it positively.
        { player:"Anthony Edwards", outlook:"good", projFgPct:0.46, ptsRange:[28,36], reason:"Health trajectory ascending (22→30pts). Home crowd at Target Center historically amplifies his game. 3rd playoff series vs DEN — total familiarity. Runner's knee continues to loosen. G2's 30/10 double-double shows ceiling returning. Expect his best game of the series.", confidence:"high" },

        // Randle: G1 16pts (7-16, 43.8%), G2 24pts (7-14, 50%).
        // Bounce-back confirmed. Physical mismatch in post. Secondary creator.
        // May be deployed as Jokic defender — lower-body strength for post-ups.
        { player:"Julius Randle", outlook:"good", projFgPct:0.49, ptsRange:[20,28], reason:"Trending up significantly (16→24pts, 43.8%→50% FG). Physical post game benefits from home officiating. May also defend Jokic in stretches — physicality disrupts Jokic's rhythm. 21.1 PPG season scorer playing with confidence.", confidence:"medium" },

        // Gobert: G1 17pts (8-9, 88.9%!!), G2 2pts (1-4, 25%). Wildly inconsistent scoring.
        // DPOY-level defense — held Jokic 1-8 when matched in G2 (worst playoff shooting vs single defender).
        // 5 fouls in G2. DRtg 7.9 worse without him on floor.
        { player:"Rudy Gobert", outlook:"neutral", projFgPct:0.60, ptsRange:[8,14], reason:"Scoring is wildly unpredictable (17pts G1 → 2pts G2). His value is ALL defense — held Jokic to 1-8 when matched G2. Expect ~10pts on limited attempts with elite efficiency when fed. Foul trouble (5 in G2) is the risk — MIN's DRtg craters 7.9pts/100 without him.", confidence:"medium" },

        // McDaniels: G1 16pts (6-14, 42.9%), G2 14pts (7-15, 46.7%).
        // Consistent across both games. 14.8 PPG breakout season (.412 3PT).
        // Emotional volatility — tech for pushing Jokic G1. 7-foot wing length.
        { player:"Jaden McDaniels", outlook:"neutral", projFgPct:0.45, ptsRange:[12,18], reason:"Rock-steady 15pts/game through 2 games. Home crowd helps manage emotional volatility (G1 tech for pushing Jokic). Athletic finishing + .412 3PT season = reliable two-way production. May need to stay disciplined with officials.", confidence:"medium" },

        // DiVincenzo: G1 12pts (4-9, 4-7 3PT), G2 16pts (6-9, 4-7 3PT).
        // ON FIRE from 3: 8-14 (57.1%) in series. Starting PG proving the decision was right.
        // Game-sealing 3 and slam in G2. Ironman durability (82 games).
        { player:"Donte DiVincenzo", outlook:"good", projFgPct:0.50, ptsRange:[14,20], reason:"SCORCHING from 3 in this series: 8-14 (57.1%). Starting PG decision validated — 16/7/6 G2 with game-sealing 3 and slam. Home crowd energy + shooting confidence = expect continued hot hand. Ironman durability (82 games) means no fatigue concern.", confidence:"medium" },

        // Naz Reid: G1 5pts (2-6, 33%, 5 TOs), G2 11pts (4-9, 44%, 9reb).
        // 13.6 PPG 6th man. Below average in G1, bounced back G2. Key bench scorer.
        // Reid-Gobert pairing worked in 2024 DEN series. Accounts for 42% of bench pts.
        { player:"Naz Reid", outlook:"neutral-good", projFgPct:0.46, ptsRange:[10,16], reason:"G2 bounce-back (11pts/9reb) after rough G1 (5pts/5TOs). Accounts for 42% of bench scoring. Home game should help — Reid historically better at Target Center. Spacing Gobert lacks (.356 3PT) is crucial in crunch time.", confidence:"medium" },

        // Dosunmu: G1 14pts (5-10, 3-7 3PT), G2 9pts (4-8, 1-2 3PT).
        // Transition catalyst — 1.21 PPP in transition (73rd pctl). DEN 21st in DRtg, vulnerable to pace.
        // Midseason acquisition that transformed MIN's identity.
        { player:"Ayo Dosunmu", outlook:"neutral", projFgPct:0.48, ptsRange:[8,14], reason:"Transition offense identity piece — 1.21 PPP (73rd pctl) attacking DEN's 21st-ranked DRtg. Consistent 10+ pts contributor. 44.3% 3PT season gives him floor spacing role too. Home pace should be faster — benefits his transition game.", confidence:"medium" },

        // Hyland: G1 0pts (0-2, 5min), G2 13pts (4-5, 3-4 3PT, 10min!!).
        // Former Nugget who knows DEN's system. Wildly inconsistent minutes (Finch prefers Conley G1).
        // G2 explosion may earn more run at home.
        { player:"Bones Hyland", outlook:"neutral", projFgPct:0.45, ptsRange:[4,12], reason:"G2 explosion (13pts/10min, 3-4 3PT) may earn expanded G3 role — but Finch historically prefers Conley. Former Nugget who knows DEN's defensive tendencies. High variance: could be 0pts or 15pts depending on Finch's trust. Home crowd factor could tip Finch toward using his energy.", confidence:"low" },

        // Anderson: G1 0pts (0-1, 7min), G2 0pts (0-1, 5min). Defensive specialist.
        { player:"Kyle Anderson", outlook:"bad", projFgPct:0.38, ptsRange:[0,4], reason:"Minimal offensive role — 0pts in both games. Swiss army knife defender but minutes too low for scoring impact. May get expanded role if Finch deploys Anderson-on-Jokic scheme, but offense stays near zero.", confidence:"medium" },

        // Conley: G1 3pts (1-1, 11min), G2 0pts (0-0, 4min). Minutes collapsing.
        { player:"Mike Conley", outlook:"bad", projFgPct:0.35, ptsRange:[0,4], reason:"Minutes collapsing dramatically (11→4min). DiVincenzo took his starting job. Murray will target him defensively. 5.8 clutch rating is his only remaining value — may only see court in specific late-game situations.", confidence:"high" }
      ]
    },
    game3: {
      spread: "MIN -2.5", moneyline: "MIN -145 / DEN +125", ou: "O/U 228.5",
      pick: "DEN", confidence: "low", projScore: "DEN 108 — MIN 106",
      schedule: "Thu Apr 23 — 9:30 PM ET — Prime Video",
      reasoning: "PHASE 30 PICK: DEN (LOW confidence, COIN FLIP). The model projects Denver to win by 2 on the road in Minnesota — a razor-thin margin that reflects this series' volatility. Despite the HCA flip to Target Center for G3-G4, Denver's structural advantages narrowly outweigh Minnesota's home court.\n\n(1) TALENT EDGE — Jokic's 97 rating and 31.5 PER remain the highest of any player in this series by a wide margin. He averaged 24.5/14/9.5 through two games, and his playoff track record after a loss is historically dominant.\n\n(2) SYSTEM COHERENCE — Denver's Jokic-centric system carries a 1.5 bonus vs Minnesota's 1.0. DEN's #1-ranked offense (122.6 ORtg) with NBA's best 3PT% (39.6%) creates reliable shot creation even in hostile environments.\n\n(3) 3PT VARIANCE: DEN shot ~35% from 3 across 2 games (below 39.6% baseline) — expect slight regression UP to ~37%. MIN shot ~34% — near baseline, minimal movement. Net 3PT swing: ~1-2pts toward DEN.\n\n(4) TURNOVER ANALYSIS: Murray had 4 TOs in G2 despite scoring 30pts. DEN averaged 13 TOs vs MIN's 11. On the road at Target Center, hostile crowd could push DEN to 14-15 TOs. MIN's ball pressure (Dosunmu/DiVincenzo) is schematic. Turnover differential slightly favors MIN at home.\n\n(5) YOUTH BREAKOUT WATCH: Anthony Edwards (age 22, Phase 29 active!) is THE breakout candidate. Trending 22pts→30pts with improving knee health. At home in Target Center, his athletic scoring should spike. Model projects 25-32pts. Also watch Bones Hyland (age 23, exactly at threshold) — 13pts in 10min G2 breakout, Finch may expand his role at home.\n\n(6) CHAMPIONSHIP DNA — DEN's playoffPedigree of 2 (2023 champions) gives composure edge in road playoff games. (7) DEPTH EDGE (+0.6) — Hardaway's 16pts off bench in G2 confirms DEN's bench can produce.\n\nThe margin is only 2 points because MIN's HCA (~3pt R1 boost), Edwards' breakout trajectory, and Randle's bounce-back (24/9/6 G2) keep this extremely competitive. 49% close-game probability — a true coin flip where the model leans DEN barely.",
      g2Adjustments: [
        "19-POINT COMEBACK ON THE ROAD: MIN trailed 39-25 after Q1 but stormed back with a 39-25 Q2 of their own to tie 64-64 at halftime. This kind of road resilience in Denver's altitude is historically rare and signals genuine mental toughness.",
        "EDWARDS HEALTH TRAJECTORY: 30pts/10reb double-double on +20 net rating — massive improvement from G1's 22pts on 7-19 FG. His movement looked more explosive, suggesting the runner's knee is warming up with activity exactly as the model projected. 10-25 FG (40%) is still inefficient but the volume and aggression are back.",
        "JOKIC-MURRAY Q4 COLLAPSE: Combined 2-of-12 from the field in the 4th quarter. Murray shot 11-25 overall with 4 turnovers and finished -4 despite 30pts. Jokic went 8-20 (1-7 from 3). Both stars showed late-game fatigue that could compound as the series extends — Murray's chronic knee and Jokic's heavy minutes (40min) are factors.",
        "RANDLE BOUNCE-BACK CONFIRMED: 24pts/9reb/6ast on 7-14 FG (50%) after a frustrating G1 (16pts, tech foul). The model flagged Randle as a bounce-back candidate and he delivered. His physicality in the post is a matchup DEN has no answer for when Jokic is defending.",
        "HCA FLIPS TO MINNESOTA: G3 and G4 are at Target Center. No more altitude penalty, partisan crowd flips to MIN's advantage. The model's round-adjusted HCA gives MIN +3.2pts at home. Edwards' home splits this season are significantly better than road.",
        "BENCH DEPTH REVELATION: Bones Hyland exploded for 13pts in just 10 minutes (3-4 from 3PT) — a former Nugget who knows DEN's defensive tendencies. Ayo Dosunmu added 9pts/5ast in 22min. MIN's bench outscored DEN's bench unit, flipping the G1 script where DEN's depth was dominant.",
        "DIVINCENZO'S MULTI-DIMENSIONAL IMPACT: 16pts/7reb/6ast with 4-7 from 3PT. He's proving the DiVincenzo-over-Conley starting decision was correct — his spacing and secondary playmaking unlocked MIN's offense in the half-court.",
        "GOBERT FOUL TROUBLE CONCERN: 5 fouls in G2, plus an altercation with Valanciunas that escalated the physicality. Gobert's 2pts/7reb in 28min was his worst playoff performance. If Gobert gets in early foul trouble in G3, MIN's DRtg craters (7.9pts/100 worse without him).",
        "MURRAY'S MIDCOURT BUZZER-BEATER MASKED ISSUES: Murray's half-court heave to tie 64-64 at halftime was spectacular but his overall 11-25 shooting (44%) and -4 net rating tell a different story. His 6-14 from 3PT suggests shot selection is deteriorating under MIN's defensive pressure.",
        "PHYSICAL ESCALATION: The Gobert-Valanciunas altercation signals this series is getting chippy. MIN's physicality was a deliberate strategy — they won the rebounding battle 49-43 (after losing it in G1). Expect Finch to double down on this physicality at home where refs historically let home teams play more physical."
      ],
      prosHome: ["Jokic's playoff resilience — responds to adversity historically", "Murray's 30pts in G2 shows scoring ceiling is still elite", "Hardaway 16pts off bench (3-3 3PT) — microwave scorer is activated", "Adelman's adjustment rating rises with more film — championship DNA kicks in", "Cameron Johnson's defense provides wing versatility DEN lacked", "Denver 8-2 in last 10 — this team knows how to win"],
      consHome: ["Q4 collapse: Jokic + Murray combined 2-of-12 in 4th quarter", "Lost rebounding battle 43-49 — MIN's physicality overwhelmed them", "No Peyton Watson — missing key defensive versatility piece", "Road environment at Target Center eliminates altitude + HCA edge", "Murray's -4 net rating despite 30pts signals empty calories", "Bench got outscored — Hyland/Dosunmu combo exposed DEN's reserves"],
      prosAway: ["Target Center crowd — Edwards historically ascends with home energy", "No altitude penalty — removes DEN's biggest environmental advantage", "Won rebounding 49-43 in G2 — physical identity established", "Hyland/Dosunmu bench depth proven as legitimate weapon", "DiVincenzo's 16/7/6 proves starting lineup is clicking", "Finch's between-game adjustments rated 7/10 — has 2 games of film now"],
      consAway: ["Gobert foul trouble (5 fouls G2) — early foul trouble would crater defense", "Edwards still shooting 40% — volume is back but efficiency isn't", "Jokic historically dominates after a playoff loss — expect a bounce-back game", "MIN's 28th-ranked defensive rebounding is a structural weakness"]
    },
    coaching: {
      home: {
        coach: "David Adelman",
        adjustmentRating: 6,
        schemeCreativity: 6,
        urgency: 5,
        playoffRecord: "8-5",
        tendency: "Jokic-centric system. Willing to go small-ball with Watson at C. Creative bench rotations. 39.6% team 3P% (NBA best) means offense flows through spacing.",
        rotationPlan: "9-man core: Starting 5 + Brown/Watson/Hardaway/Valanciunas. Watson may eat into Valanciunas mins in small-ball. Brown closes over Braun when defense matters. Strawther spot minutes if blowout.",
        keyAdjustment: "Closing lineup: Murray/Brown/Watson-or-Johnson/Gordon/Jokic. Watson as Swiss-Army backup C switches everything. Hardaway Jr. microwave scorer (13.5 PPG, .407 3P%) deployed when bench needs offense.",
        g1Performance: "A- | Dominated the middle quarters (outscored MIN 68-46 in Q2+Q3) with a devastating 14-0 Q3 run. Managed Jokic's slow start perfectly — only 3pts in Q1, but Adelman didn't panic, let the system work, and Jokic exploded for 22nd career playoff triple-double (25/13/11). Murray's free-throw hunting strategy yielded a historic 16/16 FT line. Watson small-ball worked as planned. Only deduction: allowed MIN to lead 33-23 after Q1 and let them cut to 97-95 in Q4 before closing — game should have been sealed earlier. Bruce Brown's expanded bench minutes paid dividends.",
        g2Outlook: "Adelman has G1 data showing: (1) Braun's .301 3P% is a liability MIN can exploit, (2) Brown's closing minutes were effective, (3) Watson's switchability is proven. May increase Watson minutes if healthy. Murray's 0/8 from 3 but 16/16 FT suggests he should continue attacking the rim and drawing fouls rather than settling for jumpers."
      },
      away: {
        coach: "Chris Finch",
        adjustmentRating: 7,
        schemeCreativity: 7,
        urgency: 7,
        playoffRecord: "12-12",
        tendency: "9-10 man rotation signal. Gobert-anchored defense. Pulls Gobert late for offense but DRtg craters (7.9 pts/100 worse without him — up from 4.4 last year). Transition offense is MIN's biggest identity improvement this season (Dosunmu acquisition).",
        rotationPlan: "9-man rotation: DiVincenzo/Edwards/McDaniels/Randle/Gobert starting. Dosunmu (28.9 MPG), Reid (18-20 MPG), Anderson (spot), Conley (spot). Hyland emergency minutes. Finch may expand to 10-man if he deploys Anderson-on-Jokic scheme.",
        keyAdjustment: "G2 ADJUSTMENT MENU: (1) Randle as primary Jokic defender — physical lower-body strength for post-up contests, freeing Gobert to float, (2) More Dosunmu minutes to push transition (DEN 21st DRtg vulnerable to pace), (3) Anderson smallball spell to vary Jokic looks, (4) More Reid-Gobert together (worked in 2024 DEN series)",
        g1Performance: "C+ | Strong Q1 (33-23 lead) showed Finch's opening game plan worked — Edwards aggressive early, Gobert efficient (8/9 FG, 17pts). But Q2-Q3 collapse (46-68 deficit) exposed inability to adjust mid-game. Allowed a 14-0 Q3 run without calling timeout or changing scheme. Edwards' knee (7-19 FG) limits Finch's best weapon — he hasn't found an alternative offensive system for diminished-Edwards games. Positive: cut to 97-95 in Q4, showing resilience. But couldn't sustain the push. Historically held DEN to 80pts in 2024 G2 — proven he CAN adjust between games. G2 adjustment potential is high.",
        g2Outlook: "HISTORICAL PRECEDENT: Held DEN to season-low 80pts in 2024 Game 2. Finch's between-game adjustments are his strength (adjustmentRating: 7). Key G2 levers: (1) Randle-on-Jokic in stretches to change the defensive look, (2) Push transition harder — Dosunmu's speed and DEN's 21st-ranked DRtg is exploitable, (3) Better timeout management — cannot allow another 14-0 run without intervention, (4) Manage Edwards' minutes more carefully — Q4 fatigue was visible in G1. Edwards' runner's knee often improves in 2nd game (joint loosens with activity)."
      },
      bestLineups: {
        home: { players: ["Murray","Braun","C.Johnson","Gordon","Jokic"], netRtg:8.5, ortg:122.6, drtg:114.1, min:280, note:"Starting 5 — limited reps due to injuries. 39.6% team 3P% (NBA best) drives elite spacing" },
        homeClosing: { players: ["Murray","Brown","Watson","Gordon","Jokic"], netRtg:9.2, ortg:118.5, drtg:109.3, min:120, note:"CLOSING LINEUP per Fadeaway World. Brown's defense + Watson switchability over Braun's limited shooting. G1: closed out MIN in Q4" },
        away: { players: ["DiVincenzo","Edwards","McDaniels","Randle","Gobert"], netRtg:6.8, ortg:116.5, drtg:109.7, min:710, note:"Most-used lineup in NBA this season (710 min). DiVincenzo starting PG over Conley" },
        awayBench: { players: ["Dosunmu","Hyland","Anderson","Randle","Reid"], netRtg:1.2, ortg:112.0, drtg:110.8, min:85, note:"Non-Gobert bench. Reid's spacing helps but DRtg 7.9 worse without Gobert is the series vulnerability" }
      },
      roleChanges: [
        { team:"DEN", player:"Watson", regSeason:"Bench wing, 16 MPG", playoff:"Small-ball C, Swiss-Army knife, 22+ MPG. Closes games in defensive situations over Johnson", impact:"up", reason:"Breakout year (14.6 PPG, .411 3P%, 1.1 BPG). Adelman trusts his switchability at backup 5. Health status is the question mark" },
        { team:"DEN", player:"Valanciunas", regSeason:"Backup C, 18 MPG", playoff:"May lose minutes to Watson small-ball, 10-12 MPG", impact:"down", reason:"Too slow to switch vs Edwards in space. Elite per-minute (.582 FG%) but matchup-dependent" },
        { team:"DEN", player:"B.Brown", regSeason:"Bench guard, 20 MPG", playoff:"Key bench connector + CLOSER, 24+ MPG. Replaces Braun in crunch time", impact:"up", reason:"2023 championship role player. Braun's .301 3P% makes Brown the better closing option. Defensive pest, reliable .385 3P%" },
        { team:"DEN", player:"Hardaway", regSeason:"Bench scorer, 15-20 MPG", playoff:"Microwave bench scorer, 15-20 MPG. Specialist role", impact:"neutral", reason:"13.5 PPG, .407 3P% off bench. Deployed when DEN needs instant offense or Braun struggles" },
        { team:"MIN", player:"DiVincenzo", regSeason:"Started all 82 games", playoff:"Starting PG over Conley, 34+ MPG. Must hit 3s to space for Edwards", impact:"up", reason:"Finch chose shooting/athleticism (.379 3P%) over Conley's diminished playmaking (.335 FG%, 4.5 PPG)" },
        { team:"MIN", player:"Dosunmu", regSeason:"Acquired midseason from CHI, 28.9 MPG", playoff:"Key rotation piece, 25-30 MPG. Transition catalyst", impact:"up", reason:"Transformed MIN's transition offense — biggest identity improvement. 14.4 PPG, .414 3P%, .925 FT%. Strong defensive rotations" },
        { team:"MIN", player:"Conley", regSeason:"Reduced veteran, 18.4 MPG", playoff:"Spot minutes behind DiVincenzo, 10-15 MPG. Clutch situations only", impact:"down", reason:"Dramatic decline (.335 FG%, 4.5 PPG). Murray will target him defensively. 5.8 clutch rating is remaining value" },
        { team:"MIN", player:"Anderson", regSeason:"Swiss army knife, 19.1 MPG", playoff:"Potential G2+ adjustment piece for Jokic defense variety", impact:"up", reason:"Can alternate guarding Jokic with Randle. Smallball non-Gobert frontcourt option without sacrificing defensive IQ" },
        { team:"MIN", player:"Gobert", regSeason:"Starter, 32 MPG", playoff:"Starter, must stay on court — DRtg 7.9 pts/100 worse without him (up from 4.4 last year)", impact:"neutral", reason:"G1 MVP by WPA (+15.0%). Pulling him for offense is even riskier than last year. Finch's dilemma: Gobert must play 32+ but Jokic historically dominates him" }
      ]
    },
    schemePersistence: {
      away: { isSchemeDriven: true, fgSuppression: 0.04, description: "Gobert held Jokic 1-of-8 in individual matchups G2 — structural assignment, aggressive fronting scheme." },
      home: null
    },
    xFactors: {
      home: {
        offense: { player:"Christian Braun", edge:"Emerging as DEN's 3rd option — 12pts/8reb G1, 16pts/5ast G2 on 36mpg starter minutes. Championship DNA (2023). However, .301 3PT season is a concern — MIN may sag off him. Coach Adelman leaning into his all-around game.", avgOverPerformance:2.0 },
        defense: { player:"Bruce Brown", edge:"5 steals in G1 was massive — his POA defense disrupts MIN's rhythm. 2023 championship role player. Getting increased closing minutes over Braun per Fadeaway World. Defensive pest who changes games without box score impact.", avgOverPerformance:0 }
      },
      away: {
        offense: { player:"Donte DiVincenzo", edge:"16pts/7reb/6ast in G2 including the late 3PT that created separation and game-sealing slam. 4/7 3PT in G2. Starting PG over Conley — Finch chose his shooting/athleticism for this series. Ironman durability (82 games).", avgOverPerformance:4.0 },
        defense: { player:"Rudy Gobert", edge:"ESPN: Gobert 'contains Nuggets Nikola Jokic' as key to Wolves G2 win. G1 WPA MVP (+15.0%) with 17pts (8/9 FG). His rim protection is MIN's defensive foundation — DRtg 7.9pts/100 worse without him. Anchors everything.", avgOverPerformance:0 }
      }
    },
    games: [{num:1,result:"DEN",homeScore:116,awayScore:105,winner:"DEN",notes:"DEN 116-105. Murray 30pts (historic 16/16 FT), Jokic 25/13/11 (22nd playoff triple-double — slow start w/ 3pts in Q1, then dominated). DEN dominated middle quarters outscoring MIN 68-46 with a 14-0 run. Edwards 22/9/7/3blk (7-of-19 FG — knee limiting efficiency, not availability), Gobert 17pts (8/9 FG), Randle 16pts. MIN led 33-23 after Q1, cut to 97-95 in Q4 but couldn't sustain. WPA: MVP Gobert +15.0%, LVP Edwards -8.2%. FT was the biggest factor (+23.1% WPA for DEN — Murray's 16/16), Rebounds +13.7%, TOV +7.2%."},{num:2,result:"MIN",homeScore:114,awayScore:119,winner:"MIN",notes:"MIN 119-114. Series tied 1-1. MIN completed 19-point comeback on road in Denver. Edwards 30pts/10reb double-double (10-25 FG, 3-11 3PT, 7-9 FT), +20. Randle bounce-back 24pts/9reb/6ast (7-14 FG). DiVincenzo 16/7reb/6ast (4-7 3PT). Murray 30pts (11-25, 6-14 3PT) 7reb/7ast but 4TO and -4. Jokic 24/15reb/8ast (8-20, 1-7 3PT) — quiet Q1 (2pts), exploded Q3 (12pts in 3min), collapsed Q4 (2-12 combined with Murray). DEN led 39-25 after Q1, MIN stormed back 39-25 in Q2 to tie 64-64 at half (Murray midcourt buzzer-beater). MIN won Q4 29-21 to close it out. Hardaway 16pts off bench (3-3 3PT). Hyland 13pts in 10min (3-4 3PT) sparked MIN bench. MIN: 48% FG, 41% 3PT. DEN: 44% FG, 37% 3PT. MIN won rebounding 49-43. Physical game — Gobert/Valanciunas altercation, Gobert 5 fouls."},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "SAS-POR", conf: "West", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Stephon Castle", target:"Deni Avdija", dLebron:0.908, targetUsg:28.5, note:"G1 RESULT: Castle's defense did NOT suppress Avdija — he scored 30pts/10reb (best performance by any opponent's star in R1 G1s). However, SAS still won by 13 because Avdija's scoring didn't translate to team success. The 'let the star score, contain the rest' approach worked — Henderson (18) was the only other POR player above 15. Castle contributed 17pts offensively, making the matchup a net positive for SAS despite Avdija's individual brilliance." },
      awayDefOnHome: { defender:"Jrue Holiday", target:"Victor Wembanyama", dLebron:0, targetUsg:28.8, note:"G1 RESULT: Wemby was UNGUARDABLE as predicted — 35pts (franchise playoff debut record), 5-6 3PT, 2blk. Holiday and POR had no answer for his combination of size, shooting, and rim protection. 21 first-half pts = NBA record for playoff debut opening half. The team defense assignment approach failed completely — Wemby's versatility (scoring from 3, driving, posting up, rim protection) overwhelmed every scheme POR tried. Clingan was blocked by Kornet AND Vassell on the same possession — SAS's length neutralized POR's rim protector." }
    },
    homeTeam: {
      name: "Spurs", city: "San Antonio", abbr: "SAS", seed: 2, record: "62-20",
      systemBonus: 1.0, // Johnson system (Pop's protege)
      playoffPedigree: 0, // young team
      offStyle: "Wembanyama unicorn creation — stylistic outlier (Partnow framework). Fox P&R secondary. Unpredictable offensive profile is hard to scout.", initiators: 2,
      color: "#C4CED4", color2: "#000000",
      advStats: { ortg:118.5, drtg:108.2, netRtg:10.3, pace:98.1, ts:59.2, efg:56.0, tov:12.0, reb:51.5, ortgRk:2, drtgRk:2, clutchNetRtg:6.5, last10:"9-1", fgPct:53.0, threePct:37.5, ftPct:80.4, orbPct:25.2 },
      players: [
        { name:"Victor Wembanyama", pos:"C", rating:94, ppg:24.8, rpg:11.5, apg:3.1, fgp:51.2, per:29.5, ts:63.2, epm:8.8, bpm:10.7, ws48:.255, onOff:16.9, clutch:7.5, vorp:5.7, usg:32.4, injury:"CONCUSSION PROTOCOL — status uncertain for G3", lebron:7.647, oLebron:3.655, dLebron:3.992, war:11.25, offRole:"Shot Creator", defRole:"Anchor Big",
          matchupNote:"+16.9 on/off is HISTORIC (120.5/103.6 splits). PER 29.5, 3.1 BPG. Makes driving lanes treacherous. G2: fell face-first at 8:57 Q2 after Holiday foul — entered concussion protocol, OUT for remainder. Only 5pts/4reb/1blk in 12min before injury. SAS collapsed without him (led when he was on court, lost by 3 after exit). Per NBA policy: minimum 48hrs before return to full participation. G3 is Fri Apr 24 — QUESTIONABLE at best.", baseRating:94, starCeiling:2, injuryRisk:0.8, activeInjury:{type:"concussion protocol",severity:0.7,note:"G2: Fell face-first to court at 8:57 Q2 after Jrue Holiday foul. Head made direct contact with floor. Ruled OUT for remainder of G2 with head injury. Entered NBA concussion protocol — minimum 48hrs before return to full participation + must be cleared of all symptoms. G3 is Fri Apr 24 (3 days away) — QUESTIONABLE. If formally diagnosed with concussion, could miss G3 and potentially G4. Recovery volatility (Phase 28) applies heavily — concussion at 22 is typically recoverable but timeline unpredictable."} },
        { name:"De'Aaron Fox", pos:"PG", rating:80, ppg:18.5, rpg:3.2, apg:6.8, fgp:47.5, per:20.2, ts:58.8, epm:3.5, bpm:3.2, ws48:.155, onOff:5.5, clutch:7.2, vorp:3.1, usg:25.2, injury:null, lebron:1.7, oLebron:1.478, dLebron:0.222, war:5.812, offRole:"Shot Creator", defRole:"Point of Attack",
          matchupNote:"Traded from SAC — major acquisition! Elite speed, playoff-caliber PG. Fox-Wemby PnR is devastating", baseRating:80 },
        { name:"Stephon Castle", pos:"SG", rating:74, ppg:16.8, rpg:4.5, apg:4.2, fgp:46.5, per:17.8, ts:57.5, epm:2.0, bpm:1.8, ws48:.118, onOff:3.2, clutch:5.5, vorp:2.1, usg:24.0, injury:null, lebron:1.464, oLebron:0.556, dLebron:0.908, war:5.009, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Sophomore breakout. Two-way guard with size. 57.5 TS% is efficient for his age", baseRating:74 },
        { name:"Devin Vassell", pos:"SG", rating:72, ppg:14.8, rpg:4.2, apg:3.5, fgp:45.5, per:16.2, ts:58.0, epm:1.8, bpm:1.5, ws48:.112, onOff:2.8, clutch:5.8, vorp:1.8, usg:23.0, injury:null, lebron:-0.084, oLebron:0.769, dLebron:-0.853, war:3.044, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Reliable two-way wing. 39.2% from 3. Key secondary scorer alongside Fox", baseRating:72 },
        { name:"Julian Champagnie", pos:"SF", rating:66, ppg:11.2, rpg:4.8, apg:1.5, fgp:44.8, per:13.5, ts:56.5, epm:0.5, bpm:0.2, ws48:.078, onOff:1.2, clutch:4.5, vorp:1.1, usg:20.0, injury:null, lebron:1.54, oLebron:0.16, dLebron:1.38, war:5.678, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"66 games started. Stretch forward with 38% from 3. Spacing for Wemby/Fox drives", baseRating:66 },
        { name:"Kelly Olynyk", pos:"PF", rating:62, ppg:9.5, rpg:5.5, apg:3.0, fgp:47.2, per:14.2, ts:57.8, epm:0.5, bpm:0.2, ws48:.082, onOff:1.5, clutch:4.5, vorp:0.9, usg:18.8, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:null, defRole:null,
          matchupNote:"Acquired from WAS (Jul 2025). Full season in Johnson's system. Stretch big, 37% from 3. Smart veteran who spaces for Wemby", baseRating:62 },
        { name:"Keldon Johnson", pos:"SF", rating:62, ppg:9.8, rpg:4.2, apg:1.8, fgp:46.2, per:12.5, ts:55.5, epm:0.2, bpm:-0.1, ws48:.068, onOff:0.4, clutch:4.5, vorp:0.7, usg:18.8, injury:null, lebron:0.471, oLebron:1.14, dLebron:-0.67, war:3.511, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Energy wing off bench. Physical playoff energy guy", baseRating:62 },
        { name:"Dylan Harper", pos:"PG", rating:58, ppg:11.8, rpg:3.4, apg:3.9, fgp:50.5, per:14.5, ts:57.0, epm:0.3, bpm:0.0, ws48:.080, onOff:1.0, clutch:4.5, vorp:0.9, usg:20.5, injury:null, lebron:0.947, oLebron:0.479, dLebron:0.467, war:3.326, offRole:"Shot Creator", defRole:"Point of Attack",
          matchupNote:"2nd overall pick, 50.5% FG. Surging late (14.8 PPG in final 12 games). Bench scoring spark", baseRating:58 },
        { name:"Adam Flagler", pos:"PG", rating:50, ppg:5.5, rpg:1.8, apg:2.2, fgp:42.0, per:9.5, ts:54.5, epm:-0.5, bpm:-1.0, ws48:.048, onOff:-0.5, clutch:3.5, vorp:0.2, usg:15.0, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:null, defRole:null,
          matchupNote:"Signed Aug 2025. Backup guard, 3PT shooter. Spot minutes depth behind Fox/Castle", baseRating:50 },
        { name:"Harrison Barnes", pos:"SF", rating:0, ppg:7.5, rpg:3.2, apg:1.5, fgp:44.0, per:11.0, ts:55.0, epm:-0.1, bpm:-0.3, ws48:.060, onOff:0.0, clutch:3.5, vorp:0.4, usg:15.0, injury:"DAY-TO-DAY — left wrist injury (exited G2 Q4)", lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Versatile Wing", defRole:"Wing Stopper",
          matchupNote:"Veteran wing. G2: exited Q4 with left wrist injury — 4pts (1-3 FG) in 15min, did not return. Day-to-day, est. return Apr 24 (G3). Depth loss for SAS bench rotation. Championship experience (GSW 2015).", baseRating:60, injuryRisk:0.5, activeInjury:{type:"left wrist injury",severity:0.5,note:"Exited G2 Q4 and did not return. Per ESPN: 4pts (1-3 FG, 0-1 3PT, 2-2 FT), 1reb in 15min. Day-to-day. Est. return Apr 24 (G3 date). SAS depth takes a hit — Keldon Johnson absorbs his minutes."} },
        { name:"Luke Kornet", pos:"C", rating:56, ppg:6.5, rpg:4.2, apg:1.0, fgp:52.0, per:12.0, ts:58.0, epm:0.0, bpm:-0.2, ws48:.055, onOff:0.5, clutch:3.5, vorp:0.3, usg:14.0, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Versatile Big", defRole:"Anchor Big",
          matchupNote:"Backup center providing rim protection and floor spacing. G1: 14min with 10pts/6reb — efficient 5/6 FG. Reliable depth behind Wembanyama", baseRating:56 }
      ],
      synergy: [
        { players:["Fox","Castle","Vassell","Olynyk","Wembanyama"], score:86, note:"Fox-Wemby PnR devastating. Olynyk replaces Sochan — more spacing, less defense. +10.3 NetRtg as a team. Johnson's system maximizes every player" },
        { players:["Harper","Johnson","Olynyk","Champagnie","Wembanyama"], score:74, note:"Bench unit with Wemby anchor. Harper provides creation, Olynyk stretches floor. Full season chemistry" }
      ]
    },
    awayTeam: {
      name: "Trail Blazers", city: "Portland", abbr: "POR", seed: 7, record: "42-40",
      systemBonus: 0,
      playoffPedigree: 0,
      offStyle: "Post-Lillard balanced motion. Holiday + Avdija dual initiators. Less explosive but more diverse than star-driven ISO.", initiators: 2,
      color: "#E03A3E", color2: "#000000",
      advStats: { ortg:113.5, drtg:112.8, netRtg:0.7, pace:99.5, ts:56.8, efg:53.2, tov:13.5, reb:49.8, ortgRk:14, drtgRk:15, clutchNetRtg:1.5, last10:"6-4", fgPct:50.2, threePct:33.3, ftPct:75.6, orbPct:23.8 },
      players: [
        { name:"Deni Avdija", pos:"SF", rating:79, ppg:24.2, rpg:7.8, apg:6.7, fgp:47.5, per:22.8, ts:58.8, epm:4.2, bpm:4.5, ws48:.168, onOff:6.5, clutch:6.5, vorp:3.6, usg:28.5, injury:null, lebron:1.704, oLebron:2.207, dLebron:-0.504, war:5.734, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"All-NBA caliber breakout. 24/8/7 line is absurd. +6.5 on/off. Portland's entire engine", baseRating:79 },
        { name:"Damian Lillard", pos:"PG", rating:0, ppg:0, rpg:0, apg:0, fgp:0, per:0, ts:0, epm:0, bpm:0, ws48:0, onOff:0, clutch:0, vorp:0, usg:0, injury:"OUT — torn left Achilles (season)", lebron:null, oLebron:null, dLebron:null, war:null, offRole:null, defRole:null,
          matchupNote:"Tore left Achilles in 2025 playoffs (Game 4 vs IND while on MIL). Traded back to POR in offseason. Entire 2025-26 season rehabbing. Targeting 2026-27 return. Won 3-Point Contest at ASW despite not playing.", baseRating:81 },
        { name:"Jrue Holiday", pos:"PG", rating:74, ppg:16.3, rpg:4.6, apg:6.1, fgp:45.3, per:17.5, ts:58.2, epm:2.5, bpm:2.8, ws48:.125, onOff:4.2, clutch:6.5, vorp:2.2, usg:23.5, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Shot Creator", defRole:"Point of Attack",
          matchupNote:"Acquired from BOS for Anfernee Simons (Jul 2025). 51 starts. Elite two-way guard — 38.5% from 3, elite perimeter defense. Championship DNA (MIL 2021). Maurice Lucas Award winner. Stabilizing veteran presence for young roster.", baseRating:74, age:35 },
        { name:"Shaedon Sharpe", pos:"SG", rating:74, ppg:21.4, rpg:4.4, apg:2.6, fgp:45.2, per:18.5, ts:57.8, epm:1.8, bpm:1.5, ws48:.112, onOff:2.5, clutch:5.2, vorp:2.0, usg:26.5, injury:null, lebron:-1.205, oLebron:0.264, dLebron:-1.469, war:1.157, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"21.4 PPG in 48 games (42 starts). Returned April 10 from 28-game absence (left fibula stress reaction). Athletic finisher. Conditioning/rust concern after long layoff", baseRating:74, injuryRisk:0.4, activeInjury:{type:"fibula stress reaction",severity:0.4,note:"Missed 28 games, returned Apr 10. G1: Played but SAS dominated overall (111-98). Only 9 days of game action before playoffs — conditioning and re-injury risk remain real concerns. Physical series vs SAS will test fibula recovery."} },
        { name:"Jerami Grant", pos:"PF", rating:71, ppg:18.6, rpg:5.1, apg:2.5, fgp:46.5, per:17.2, ts:57.2, epm:1.5, bpm:1.2, ws48:.105, onOff:2.2, clutch:5.5, vorp:1.7, usg:25.2, injury:null, lebron:-0.346, oLebron:0.431, dLebron:-0.776, war:2.245, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"Veteran scorer. Physical two-way forward. Playoff experience from multiple teams", baseRating:71 },
        { name:"Donovan Clingan", pos:"C", rating:73, ppg:11.5, rpg:9.8, apg:1.2, fgp:58.4, per:16.8, ts:61.2, epm:1.0, bpm:0.8, ws48:.108, onOff:2.1, clutch:4.2, vorp:1.2, usg:20.5, injury:null, lebron:3.407, oLebron:1.057, dLebron:2.35, war:7.643, offRole:"Stretch Big", defRole:"Anchor Big",
          matchupNote:"LEBRON revelation: 3.407 LEBRON / 7.643 WAR / D-LEBRON 2.35 — POR's most impactful player and a top-10 defender in the NBA. Box stats understate his massive two-way impact. Still can't match Wemby offensively, but the gap is smaller than PER suggests", baseRating:73 },
        { name:"Scoot Henderson", pos:"PG", rating:64, ppg:14.2, rpg:2.7, apg:3.7, fgp:44.5, per:14.8, ts:54.5, epm:0.2, bpm:0.0, ws48:.075, onOff:0.5, clutch:4.8, vorp:0.8, usg:21.5, injury:null, lebron:-0.971, oLebron:-0.198, dLebron:-0.773, war:0.698, offRole:"Shot Creator", defRole:"Point of Attack",
          matchupNote:"Breakout 3rd year — 14.2 PPG, started 30 games during Sharpe's absence. Still raw but improving. Explosive athleticism. Backup PG behind Holiday.", baseRating:64, starCeiling:1, injuryRisk:0 },
        { name:"Toumani Camara", pos:"SF", rating:56, ppg:7.5, rpg:4.8, apg:1.5, fgp:44.2, per:11.5, ts:54.0, epm:0.0, bpm:-0.3, ws48:.058, onOff:0.5, clutch:3.8, vorp:0.3, usg:16.5, injury:null, lebron:-0.023, oLebron:-0.956, dLebron:0.934, war:4.171, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"Versatile wing defender, 6'8 with length. Switchable across 2-4 positions", baseRating:56 },
        { name:"Kris Murray", pos:"PF", rating:50, ppg:6.2, rpg:3.9, apg:1.2, fgp:46.3, per:10.5, ts:54.0, epm:-0.5, bpm:-1.0, ws48:.052, onOff:-0.5, clutch:3.2, vorp:0.1, usg:15.5, injury:null, lebron:-1.745, oLebron:-1.73, dLebron:-0.014, war:0.6, offRole:"Stationary Shooter", defRole:"Helper",
          matchupNote:"Stretch forward, can hit 3s. Energy and hustle off bench. Twin brother plays for Iowa", baseRating:50 },
        { name:"Matisse Thybulle", pos:"SF", rating:55, ppg:3.5, rpg:2.2, apg:0.8, fgp:48.0, per:10.0, ts:56.0, epm:0.0, bpm:-0.3, ws48:.050, onOff:0.5, clutch:3.5, vorp:0.2, usg:10.0, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"Elite perimeter defender with limited offense. G1: 21min with 1pt/4reb/1stl — defensive specialist role. Former All-Defensive team member", baseRating:55 },
        { name:"Robert Williams", pos:"C", rating:58, ppg:6.5, rpg:5.0, apg:2.0, fgp:55.0, per:15.0, ts:62.0, epm:0.3, bpm:0.5, ws48:.085, onOff:1.0, clutch:3.5, vorp:0.5, usg:13.0, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Roll + Cut Big", defRole:"Anchor Big",
          matchupNote:"Athletic rim-running center. G1: 17min with 11pts/6reb/4ast — impactful off bench. Shot-blocking and lob threat. Injury history but when healthy provides elite rim protection", baseRating:58 }
      ],
      synergy: [
        { players:["Holiday","Sharpe","Avdija","Grant","Clingan"], score:74, note:"Holiday stabilizes the backcourt with elite defense and 38.5% from 3. Avdija is the offensive engine. DRtg 112.8 is the weakness. Clingan anchors rim protection" },
        { players:["Henderson","Sharpe","Camara","Grant","Clingan"], score:68, note:"Athletic bench unit with Clingan rim protection. Scoot-Sharpe backcourt is explosive but turnover-prone. Henderson's leap to 14.2 PPG adds scoring punch" }
      ]
    },
    externalFactors: [
      { team:"SAS", player:"Victor Wembanyama", desc:"Playoff debut at 20. Rib contusion but says 'really close' to 100%. Generational talent but zero playoff experience. Johnson's guidance (Pop's protege) is the safety net.", impact:-2, category:"motivation" },
      { team:"SAS", player:null, desc:"Mitch Johnson's first season as HC (Pop's protege). Fox trade transformed the team to 62-20. System maximizes young talent. Culture advantage is massive.", impact:5, category:"motivation" },
      { team:"POR", player:"Jrue Holiday", desc:"Holiday's championship experience (MIL 2021) provides veteran leadership for a young squad in turmoil. Without Lillard (out for season), Holiday is the emotional anchor.", impact:2, category:"motivation" },
      { team:"POR", player:"Deni Avdija", desc:"All-NBA caliber breakout at 24/8/7. Playing with house money — low pressure can be freeing.", impact:3, category:"motivation" },
      { team:"POR", player:null, desc:"HC Chauncey Billups removed amid gambling investigation. Tiago Splitter named interim HC. Major locker room disruption entering playoffs — team chemistry and preparation compromised.", impact:-7, category:"chemistry",
        evidence:"Chauncey Billups placed under investigation for gambling-related violations. Tiago Splitter (former Spur, assistant coach) elevated to interim HC for the playoffs. Facing his former franchise in round 1 adds an ironic subplot.",
        sources:["NBA.com: nba.com/news"], verdict:"verified" },
      { team:"SAS", player:"Harrison Barnes", desc:"NEW: Left wrist injury — exited G2 Q4, did not return. Day-to-day, est. return Apr 24 (G3). Bench depth loss.", impact:-1, category:"injury",
        evidence:"Per ESPN (Apr 21): Barnes exited G2 in Q4 with apparent left wrist injury. 4pts (1-3 FG) in 15min, did not return. Day-to-day. If OUT for G3, Keldon Johnson absorbs minutes.",
        sources:["ESPN Injuries: espn.com/nba/injuries"], verdict:"verified" },
      { team:"SAS", player:"Victor Wembanyama", desc:"CONCUSSION — diagnosed after G2 face-first fall at 8:57 Q2. Further testing Wed Apr 22. G3 Fri Apr 24 is barely within 48hr window. QUESTIONABLE at best. SAS's entire identity depends on this decision.", impact:-12, category:"injury",
        evidence:"Per ESPN (Apr 21): Wembanyama diagnosed with concussion, undergoing further testing Wednesday. NBA requires minimum 48hrs + independent neurologist clearance. G3 Fri Apr 24 is a game-time decision at best.",
        sources:["ESPN Injuries: espn.com/nba/injuries","Shams Charania: ESPN report"], verdict:"verified" }
    ],
    game1: {
      spread: "SAS -10.5", moneyline: "SAS -550 / POR +400", ou: "O/U 218.5",
      pick: "SAS", confidence: "high", projScore: "SAS 115 — POR 102",
      reasoning: "Wembanyama's +16.9 on/off is the series. When he's on court, San Antonio plays like a 65-win team. Fox's addition transforms the backcourt from a weakness to a strength. Without Lillard (torn Achilles, out for season), Portland relies on Avdija's breakout and Holiday's veteran steadiness — but the talent gap is enormous. Clingan's PER is 12.7 points lower than Wemby. Sharpe just returned from 28-game absence (fibula). Pop's system vs an interim coach in Splitter makes this a heavy mismatch.",
      prosHome: ["Wemby +16.9 on/off — transforms the game", "Fox-Wemby PnR is devastating", "Johnson's coaching system (Pop's protege) is an edge", "+6.5 clutch NetRtg — finishers"],
      consHome: ["Wemby rib contusion — explosiveness?", "Most of team making playoff debut", "Holiday's perimeter D on Fox is legit", "Young team under spotlight pressure"],
      prosAway: ["Avdija 24/8/7 — legitimate All-Star", "Holiday championship DNA (MIL 2021)", "Clingan LEBRON 3.4 — underrated anchor", "Low expectations = free-flowing play"],
      consAway: ["No Lillard (torn Achilles) — massive offensive void", "Sharpe just back from 28-game absence — rust/conditioning", "+0.7 NetRtg vs +10.3 — massive gap", "Interim coach, coaching scandal disruption"]
    },
    modelLessons: [
      { type:"missed", lesson:"IN-GAME INJURY BLIND SPOT — Model has NO mechanism for mid-game injuries. Wemby's concussion at 8:57 Q2 (fell face-first after Holiday foul, entered concussion protocol) turned a SAS-controlled game into a POR win. SAS was competitive with Wemby on court; collapsed without him. The model's +12 projection was reasonable WITH a healthy Wemby — the error was entirely from an unpredictable in-game event. LESSON: For future model iterations, consider 'star injury variance' as an asymmetric risk factor for teams with extreme on/off differentials (+16.9 for Wemby). When one player accounts for this much of a team's value, the downside risk of losing them mid-game is catastrophic." },
      { type:"correct", lesson:"3PT REGRESSION CONFIRMED — Model predicted SAS 3PT regression from G1's hot shooting. G1: SAS shot well from 3. G2: SAS went 7-24 (29%) from 3PT. Vassell 0-5 from 3PT, Castle 2-6. Phase 25's Bayesian 3PT regression model was directionally correct — team shooting is mean-reverting." },
      { type:"correct", lesson:"HOLIDAY BOUNCE-BACK CONFIRMED — Model projected Holiday 'neutral-good' outlook with bounce-back from G1's 26.7% FG. Actual G2: 19pts/9ast/5stl on 6-17 FG (35.3%). While FG% was still below season average, the production was dramatically better. Veteran bounce-back pattern validated." },
      { type:"missed", lesson:"SCOOT HENDERSON YOUTH BREAKOUT — 31pts (11-17 FG, 5-9 3PT, 64.7%) at age 21. Model projected 'neutral' outlook (44% FG, 12-18pts range). Actual output was nearly DOUBLE the high end of projected range. Phase 28 youth breakout multiplier (≤23yr) would have partially captured this IF Henderson had overperformed in G1 (he did: 18pts on 63.6%). The multiplier should have carried forward to G2 — but the system only applies it within the same game's Bayesian update, not across games. LESSON: Youth breakout momentum should persist across games, not reset each game." },
      { type:"underweighted", lesson:"DEPTH RESILIENCE — POR got contributions from unexpected sources: Sharpe 11pts/9reb/5ast (5-6 FG, bounce-back), Thybulle 9pts (3-5 FG), Camara 10pts/8reb (+17). Model treated POR's bench as a weakness, but playoff intensity activates role players differently. Splitter's adjustments were better than credited." },
      { type:"overweighted", lesson:"HOME COURT ADVANTAGE WITH WEMBY — Model assumed SAS's home court (+3 HCA) would compound with Wemby's dominance. But HCA is irrelevant when your best player exits in Q2. The +16.9 on/off differential means SAS is essentially two different teams: elite WITH Wemby, mediocre WITHOUT. Model needs to weight on/off more heavily when calculating team ceiling vs floor." }
    ],
    game2: {
      spread: "SAS -11.5", moneyline: "SAS -600 / POR +425", ou: "O/U 216.5",
      pick: "SAS", confidence: "high", projScore: "SAS 112 — POR 102",
      schedule: "Tue Apr 21 — 9:30 PM ET — TNT",
      reasoning: "BACKTEST-CALIBRATED PICK: SAS (high confidence). G1's 111-98 result validated the model almost perfectly (projected 115-102, 13-pt margin; actual 13-pt margin). Wemby's 35-pt playoff debut (franchise record) proved his rib contusion is a non-factor and he's genuinely unguardable — 5-6 from 3PT means POR can't sag off him. The 2025 backtest showed home teams winning G1 by 10+ in R1 won G2 at 82%. SAS's defensive scheme (Kornet + Vassell blocking Clingan on the same possession) neutralized POR's rim protector. Avdija's 30/10 was excellent individually but couldn't overcome the systemic talent gap — the 'let the star score, contain the rest' approach is repeatable. Henderson's 18pts was POR's bright spot but Fox+Castle (17 each, 15 combined ast) answered every run. POR's Q3 comeback (cut 16 to 2) shows fight, but Splitter had no second-level adjustment when SAS reasserted. Staying HIGH confidence — the talent gap, Wemby's dominance, and coaching advantage are all structural.",
      g1Adjustments: [
        "SAS WON G1 111-98 — model predicted 115-102 (13-pt margin EXACT match). Best-calibrated prediction of R1.",
        "WEMBY UNLEASHED: 35pts (franchise playoff debut record), 5-6 3PT, 2blk. Rib contusion = non-factor.",
        "Castle+Fox combined 34pts, 15ast — SAS multi-initiator attack is working as designed",
        "Avdija 30/10 shows he CAN score on Castle — but POR still lost by 13. Individual brilliance ≠ team success",
        "POR Q3 FIGHT: 8-0 run cut 16 to 2 — Splitter's halftime adjustments worked temporarily",
        "Clingan NEUTRALIZED: Blocked by Kornet AND Vassell on same possession. SAS's length is a structural problem for POR",
        "Henderson 18pts off bench — POR's depth is slightly better than modeled",
        "COACHING: Johnson A (composed under Q3 pressure) vs Splitter B- (good fight but no second adjustment)"
      ],
      prosHome: ["Wemby 35pts proved rib is a non-factor — will be even more comfortable in G2", "Model margin EXACT (13pts) — system is perfectly calibrated for this series", "Clingan neutralization scheme is repeatable — SAS's length advantage is structural", "Home court + sellout crowd (Duncan + Robinson courtside) = energy", "Castle+Fox 15 combined ast shows system offense, not Wemby ISO dependency"],
      consHome: ["POR cut 16 to 2 in Q3 — momentum shifts are possible", "Avdija 30/10 shows he can hurt SAS regardless of Castle's defense", "Henderson's 18pts suggests POR bench is better than modeled", "Young SAS team could have a letdown game after dominant debut"],
      prosAway: ["Avdija 30/10 proves he's a legit star — can build on individual excellence", "Henderson breakout (18pts) adds a scoring weapon SAS must account for", "Q3 comeback (16 to 2) shows POR's fight and Splitter's adjustment ability", "Splitter now has full game film — can refine defensive schemes vs Wemby", "Low pressure as 7 seed — can play freely"],
      consAway: ["Wemby is genuinely unguardable — 35pts, 5-6 3PT, and rim protection simultaneously", "Clingan neutralized by SAS length — no evidence of a counter", "Coaching turmoil (Billups gambling investigation) still a distraction", "0-1 deficit and talent gap make G2 steal very unlikely", "Holiday was quiet in G1 — POR needs his veteran scoring to compete"]
    },
    game3: {
      spread: "POR -1.5", moneyline: "POR -122 / SAS +102", ou: "O/U 220.5",
      pick: "POR", confidence: "medium", projScore: "POR 111 — SAS 104",
      schedule: "Fri Apr 24 — 10:30 PM ET — Prime Video",
      reasoning: "PHASE 33 UPDATED PICK: POR (MEDIUM confidence). Wemby CONFIRMED OUT for G3 (concussion protocol, minimum 48hr + neurologist clearance not met). Harrison Barnes also OUT (wrist). McLaughlin OUT (ankle). SAS missing their franchise player, starting PF, and backup PG.\n\nWEMBY ABSENCE IMPACT: His +16.9 on/off differential is the largest in the playoffs. SAS collapsed without him in G2 — outscored by 10 after his 8:57 Q2 exit, lost 103-106. Without Wemby, SAS loses: (a) rim protection that neutralized Clingan, (b) offensive gravity that created open looks for Fox/Castle, (c) 3PT spacing (5-6 G1), (d) role flexibility advantage (SAS 8.0→~5.0 without him). SAS becomes a conventional team relying on Fox/Castle/Vassell.\n\nPOR HOME ADVANTAGE: First home game of the series. Moda Center crowd will be electric after G2 upset. Henderson (age 21) youth breakout at home = dangerous. POR's G2 win was earned — Henderson 31pts, Holiday 19/9/5, team effort.\n\nYOUTH BREAKOUT: Scoot Henderson is THE breakout story. 18pts G1 → 31pts G2 (11-17 FG, 5-9 3PT, 64.7%). Phase 29 persistence: consecutive breakouts for ≤23-year-olds are MORE likely. At HOME, project 25-28pts. FG% regression from 64.7% to ~48% but volume stays high.\n\nSAS WITHOUT WEMBY + BARNES: Fox (17pts/6ast both games) and Castle (17.5pts/6.5ast avg) are consistent but not dominant enough to win on the road. Vassell (0-5 3PT G2) needs to bounce back for SAS to stay close. Harper (20yr rookie) gets expanded role but road game is tough for rookies. SAS's 3PT regression UP from 29% helps (+3-4pts) but doesn't overcome losing Wemby's 25+ pts production.\n\n3PT VARIANCE: SAS 7-24 (29%) G2 → regression UP to ~35%. POR 41% G2 → regression DOWN to ~34%. Net: minimal. Vassell's 0-5 3PT is the biggest regression candidate UP.\n\nCOACHING: Johnson (adj 5) must design an entirely different gameplan without Wemby — a massive challenge. Splitter (adj 4) can run the same system that worked in G2. POR edge here.\n\nREALISTIC SHOOTING: SAS ~43% FG / 35% 3PT (without Wemby's efficient scoring). POR ~45% FG / 34% 3PT (home boost). Individual: Fox ~42%, Castle ~39%, Henderson ~48% (home), Avdija ~46% (home), Holiday ~43%.",
      g2Adjustments: [
        "WEMBY CONCUSSION — fell face-first at 8:57 Q2 in G2. Entered concussion protocol. Status for G3 UNCERTAIN. Minimum 48hr recovery + independent neurologist clearance required.",
        "POR WON G2 106-103 — series tied 1-1. SAS collapsed without Wemby (outscored by 10 after his exit).",
        "SCOOT HENDERSON BREAKOUT: 31pts (11-17 FG, 5-9 3PT) at age 21. Phase 29 youth breakout persistence — consecutive breakout games for ≤23-year-olds are more likely. Expect 25+ at home.",
        "HOLIDAY BOUNCE-BACK CONFIRMED: 19pts/9ast/5stl in G2 after 9pts in G1. Veteran found his rhythm.",
        "SAS 3PT COLD: 7-24 (29%) in G2. Vassell 0-5 from 3. Regression UP expected to ~35%.",
        "SERIES SHIFTS TO PORTLAND: First road games for SAS. Moda Center crowd will be electric after G2 win.",
        "SAS WITHOUT WEMBY: Castle (18pts/8ast), Fox (17pts/6ast), Vassell (16pts/12reb) stepped up. Can they sustain?",
        "DYLAN HARPER (age 20, rookie): 10pts/4ast in 23min after Wemby exit. Youth breakout candidate with expanded role."
      ],
      prosHome: ["Fox/Castle consistency — both averaging 17pts/6ast through 2 games. System offense works without Wemby.", "SAS 3PT regression UP from 29% G2 → ~35% expected. Vassell (0-5 3PT G2) is a prime bounce-back candidate.", "Harper (age 20) youth breakout candidate with expanded role — 10pts/4ast in 23min G2", "SAS still has 62-20 regular season record — deep, well-coached roster even without their star", "Champagnie (3-4 FG G2) provides reliable energy and spacing off the bench"],
      consHome: ["WEMBY OUT (concussion) + BARNES OUT (wrist) + MCLAUGHLIN OUT (ankle) — SAS missing 3 rotation players", "ROAD GAME at Moda Center — POR crowd electric after G2 upset, first home game of series", "Henderson's youth breakout momentum (18→31pts) at home = dangerous, Phase 29 persistence active", "Holiday found rhythm in G2 (19/9/5) — veteran presence + home comfort = sustained production", "Without Wemby: no rim protection, no offensive gravity, no 3PT spacing. +16.9 on/off gap is enormous.", "Avdija becomes the clear best player on the floor — no one on SAS can match his 6'9 creation"],
      prosAway: ["HOME COURT — Moda Center, first home game. POR crowd electric after stealing G2 on the road.", "Henderson YOUTH BREAKOUT at home (age 21): 18→31pts trending. Phase 29 persistence = expect 25+.", "WEMBY OUT: POR is clear favorite. No rim protection shadow for Clingan, no offensive gravity pulling defenders.", "Holiday veteran rhythm (19/9/5 G2) + home comfort + championship pedigree = expect 18+ game", "Avdija is the clear best player on the floor without Wemby — expect 24-28pts at home", "Sharpe found rhythm: 5-6 FG G2 after 4-13 G1. Trending right direction at home."],
      consAway: ["POR still has -1.0 NetRtg — structurally weaker team on paper even with Wemby out", "Clingan (4-12 G2) struggled even WITHOUT Wemby for most of the game — matchup issues remain vs SAS length", "Henderson's 64.7% FG in G2 WILL regress — expect ~44-48% in G3, which could mean 22-26pts range", "Coaching gap remains: Johnson (adj 5) > Splitter (adj 4), even on the road", "POR's turnover issues (12 in G2) could worsen under home pressure (pressing)", "SAS's 3PT regression UP (~29%→35%) could add 3-4pts to their total"]
    },
    coaching: {
      home: {
        coach: "Mitch Johnson",
        adjustmentRating: 5,
        schemeCreativity: 6,
        urgency: 5,
        playoffRecord: "1-1",
        tendency: "Defense-first, offensive freedom. Pop's protege. Matchup-based lineup experiments. Fox/Castle/Harper together in crunch.",
        rotationPlan: "9-man rotation. May use Fox-Castle-Harper closing trio despite shooting concerns. Wembanyama 30+ MPG.",
        keyAdjustment: "Unorthodox closing lineups prioritizing defense and versatility over spacing",
        g1Performance: "A | Excellent debut. Castle+Wemby combined for 19 of 30 Q1 pts — Johnson's game plan put SAS's two best weapons front and center immediately. When POR cut a 16-pt lead to 2 (59-57) with an 8-0 Q3 run, Johnson's defense clamped down and Vassell's two straight 3s (72-61) restored control — a sign of composure under pressure. Kornet deployment was a subtle tactical win — his block on Clingan (same possession as Vassell's block) showed Johnson designed help-side schemes to neutralize POR's rim protector. Let Wemby play freely on offense while surrounding him with defensive versatility. The only concern: allowing POR's 8-0 Q3 run before adjusting."
      },
      away: {
        coach: "Tiago Splitter (interim)",
        adjustmentRating: 4,
        schemeCreativity: 6,
        urgency: 9,
        playoffRecord: "1-1",
        tendency: "Former Spur — ironic vs SAS. Continuity-focused, maintaining Billups' system. Young squad plays fast. Avdija is the offensive engine, Holiday stabilizes. Clingan anchors defense.",
        rotationPlan: "8-9 man rotation. Avdija and Sharpe carry offensive load. Holiday's veteran presence critical. Clingan's foul trouble limits minutes. Splitter unlikely to make drastic changes mid-crisis.",
        keyAdjustment: "Holiday's perimeter defense on Fox. Avdija in pick-and-roll as primary creator. Sharpe's conditioning after 28-game absence is the wildcard. Team chemistry disrupted by coaching scandal.",
        g1Performance: "B- | Better than expected given the coaching turmoil. Avdija's 30/10 performance was well-schemed — Splitter got him quality looks against Castle's defense. Henderson's 18pts off the bench was a positive development. The 8-0 Q3 run (cut 16-pt deficit to 2) showed POR's fight and suggests Splitter made effective halftime adjustments. However, Clingan was neutralized by SAS's length (blocked on same possession by Kornet AND Vassell), Holiday was quiet offensively, and Sharpe didn't make a major impact. Splitter had no answer for Wemby's 35-pt explosion. Biggest concern: POR couldn't sustain the Q3 momentum — after cutting to 59-57, SAS pulled away again, and Splitter had no second adjustment. Credit for keeping it competitive given the circumstances (interim coach, gambling scandal, facing franchise legend's old team)."
      },
      bestLineups: {
        home: { players: ["Fox","Castle","Champagnie","Wembanyama","Olynyk"], netRtg:12.5, ortg:118.8, drtg:106.3, min:220, note:"Elite defensive unit — Wemby anchors everything" },
        away: { players: ["Holiday","Sharpe","Avdija","Grant","Clingan"], netRtg:2.8, ortg:113.5, drtg:110.7, min:380, note:"Primary starting 5 — Holiday replaces Lillard (OUT)" }
      },
      roleChanges: [
        { team:"SAS", player:"Wembanyama", regSeason:"Franchise player, 25 MPG", playoff:"35+ MPG in playoffs. Anchors both ends, rim protection and shot creation", impact:"up", reason:"Johnson will unleash full Wemby in postseason" },
        { team:"SAS", player:"Fox", regSeason:"Co-star, 32 MPG", playoff:"Primary scorer, 36+ MPG. Must carry offensive load", impact:"up", reason:"Playoff pressure on acquisition to prove worth" },
        { team:"SAS", player:"Castle", regSeason:"Starting guard, 28 MPG", playoff:"Defensive stopper + playmaker, 32+ MPG", impact:"up", reason:"Johnson uses Fox/Castle/Harper closing trio" },
        { team:"POR", player:"Holiday", regSeason:"Starting PG, 32 MPG, 16.3 PPG", playoff:"Veteran stabilizer, 34+ MPG. Defensive anchor and secondary creator behind Avdija", impact:"up", reason:"Championship experience (MIL 2021) makes Holiday the emotional leader through coaching turmoil. Elite perimeter D on Fox." },
        { team:"POR", player:"Clingan", regSeason:"Starting C, 26 MPG", playoff:"Foul trouble risk limits to 22-24 MPG", impact:"down", reason:"Rim protection vital but 4+ fouls/game is unsustainable" }
      ]
    },
    youthCeilings: { "Scoot Henderson": 1.45 },
    // G2 Player Outlook — Bayesian blend: 55% model / 45% prior
    // G1: SAS won 111-98. Wemby 35pts (13-21, 61.9%, 5-6 3PT) — franchise playoff debut record.
    // Avdija 30pts for POR but team couldn't keep up. SAS length neutralized Clingan.
    // Home game again for SAS. POR must adjust to Wemby's 3PT shooting or get buried.
    g2PlayerOutlook: {
      home: [ // SAS
        // Wemby: G1 13-21 (61.9%), 5-6 3PT (83.3%!!), 35pts. Season ~47% FG.
        // Bayesian: 0.55*0.619 + 0.45*0.470 = 0.552. But 5-6 3PT is extreme outlier.
        // Regression expected from 3PT but midrange/rim efficiency is sustainable.
        { player:"Victor Wembanyama", outlook:"good", projFgPct:0.52, ptsRange:[26,34], reason:"G1 was historically great (35pts, 5-6 3PT) — debut adrenaline boosted shooting. 3PT regression expected (season ~37% vs G1's 83.3%), but midrange and rim finishing (8-15 on 2PT) is more sustainable. POR still has no answer for his length. Home crowd again. Even regressed, he's a 26-30pt scorer.", confidence:"high" },

        // Fox: G1 7-15 (46.7%), 17pts/8ast. Season ~47% FG. Right at baseline.
        // Bayesian: 0.55*0.467 + 0.45*0.470 = 0.468
        { player:"De'Aaron Fox", outlook:"neutral-good", projFgPct:0.47, ptsRange:[18,26], reason:"G1 was efficient (46.7% FG) and facilitated well (8ast). Season baseline ~47% — expect continuation. POR's Holiday defended well but Fox's speed creates mismatches. Home game helps. May attack more aggressively as POR collapses on Wemby.", confidence:"high" },

        // Vassell: G1 5-13 (38.5%), 4-9 3PT, 15pts. Season ~44% FG, ~38% 3PT.
        // Bayesian: 0.55*0.385 + 0.45*0.440 = 0.410
        { player:"Devin Vassell", outlook:"neutral", projFgPct:0.42, ptsRange:[12,18], reason:"G1 was slightly cold (38.5% FG) but 4-9 from 3 was near baseline. Hit back-to-back 3s in Q3 to put game away. Season ~44% FG, ~38% 3PT. Reliable 3-and-D wing who spaces for Wemby/Fox. Expect average efficiency.", confidence:"medium" },

        // Castle: G1 4-13 (30.8%), 17pts on 8-8 FT. Season ~43% FG. Struggled shooting.
        // Bayesian: 0.55*0.308 + 0.45*0.430 = 0.363. Bounce-back from field expected.
        { player:"Stephon Castle", outlook:"neutral", projFgPct:0.38, ptsRange:[12,18], reason:"G1 poor shooting (30.8% FG) masked by elite FT drawing (8-8). Season ~43% — bounce-back likely. Playmaking (7ast) and defense on Avdija are his primary contributions. May attack rim more vs POR's interior D.", confidence:"medium" },

        // Champagnie: G1 2-3 (66.7%), 6pts/5reb. Season role player.
        { player:"Julian Champagnie", outlook:"neutral", projFgPct:0.42, ptsRange:[4,10], reason:"3-and-D wing who hit 2-3 including 2 threes. Low volume but efficient. Provides spacing and effort. Expect similar limited but useful contribution.", confidence:"low" },

        // Kornet: G1 5-6 (83.3%), 10pts/6reb in 14min. Massive overperformance.
        // Season ~52% FG. Regression heavy.
        { player:"Luke Kornet", outlook:"neutral", projFgPct:0.52, ptsRange:[4,10], reason:"G1 was outlier performance (5-6 FG, 83.3%). Season ~52% FG as backup C. Blocked Clingan on highlight play. Regression expected but rim-finishing efficiency is real. 14min bench role continues.", confidence:"medium" },

        // Harper: G1 3-7 (42.9%), 6pts. Rookie bench guard.
        { player:"Dylan Harper", outlook:"neutral", projFgPct:0.42, ptsRange:[4,10], reason:"Rookie getting 23min of bench time. G1 was near baseline efficiency. Playmaking developing. Minutes may fluctuate based on game flow.", confidence:"low" }
      ],
      away: [ // POR
        // Avdija: G1 12-21 (57.1%), 30pts/10reb. Season ~47% FG. Overperformance.
        // Bayesian: 0.55*0.571 + 0.45*0.470 = 0.526. Heavy regression from 57%.
        { player:"Deni Avdija", outlook:"neutral", projFgPct:0.47, ptsRange:[20,28], reason:"G1's 30pts/10reb was All-Star level but 57.1% FG is well above season ~47% baseline. SAS will adjust — Castle + team defense will scheme harder. Still POR's best player and will get his shots. Expect closer to 22-25pts on average efficiency.", confidence:"high" },

        // Henderson: G1 7-11 (63.6%), 18pts. Season ~44% FG. Breakout game.
        // Bayesian: 0.55*0.636 + 0.45*0.440 = 0.548. Heavy regression.
        { player:"Scoot Henderson", outlook:"neutral", projFgPct:0.44, ptsRange:[12,18], reason:"G1 breakout (63.6% FG, 18pts) well above season ~44% baseline. Athletic guard who can attack rim but SAS's length is a problem. Expect regression but increased confidence helps. Second-year guard growing in real time.", confidence:"medium" },

        // Holiday: G1 4-15 (26.7%), 9pts. Season ~45% FG. Terrible shooting night.
        // Bayesian: 0.55*0.267 + 0.45*0.450 = 0.349. Bounce-back expected.
        { player:"Jrue Holiday", outlook:"neutral-good", projFgPct:0.40, ptsRange:[12,18], reason:"G1 was awful (26.7% FG, 1-7 3PT) — veteran who's much better than that. Season ~45% FG, championship pedigree (MIL 2021). Major bounce-back candidate. Still the best defender on POR. Expect 14-16pts on improved efficiency.", confidence:"high" },

        // Sharpe: G1 4-13 (30.8%), 10pts. Season ~43% FG. Cold shooter.
        // Bayesian: 0.55*0.308 + 0.45*0.430 = 0.363
        { player:"Shaedon Sharpe", outlook:"neutral", projFgPct:0.38, ptsRange:[8,14], reason:"G1 cold (30.8% FG, 0-4 3PT). Athletic scorer but inconsistent. Season ~43% FG. SAS wing defense (Vassell, Champagnie) limits his space. Some bounce-back but not reliable.", confidence:"medium" },

        // Clingan: G1 2-7 (28.6%), 4pts/7reb. Blocked by Kornet AND Vassell.
        // Season ~52% FG. SAS length destroyed him.
        { player:"Donovan Clingan", outlook:"bad", projFgPct:0.42, ptsRange:[4,10], reason:"G1 was rough (28.6% FG, 0-3 3PT). SAS's length — especially Wemby and Kornet — completely neutralized his rim game. Kornet AND Vassell blocked him on same possession. Structural matchup problem that doesn't improve game-to-game.", confidence:"high" },

        // Camara: G1 2-7 (28.6%), 8pts. Season ~42% FG. Defensive wing.
        { player:"Toumani Camara", outlook:"neutral", projFgPct:0.38, ptsRange:[4,10], reason:"G1 cold shooting (28.6%) but defensive effort (2stl/1blk) was valuable. Season ~42% FG. Expect small bounce-back. Not a primary scorer — defense and energy are his role.", confidence:"low" },

        // R.Williams: G1 5-7 (71.4%), 11pts/6reb/4ast in 17min off bench. Big overperformance.
        { player:"Robert Williams", outlook:"neutral", projFgPct:0.50, ptsRange:[6,12], reason:"G1 efficient (71.4% FG) off bench. Overperformance from field but his finishing and passing are real skills. Season baseline provides floor. May see more minutes if Clingan struggles again.", confidence:"low" }
      ]
    },
    // ── G3 Per-Player Offensive Outlook (Phase 33 — Wemby OUT confirmed) ──
    // Series tied 1-1. G3 at Moda Center (POR home). Wemby OUT (concussion), Barnes OUT (wrist), McLaughlin OUT (ankle).
    // POR favored by ~7. Henderson youth breakout at home. Avdija best player on the floor.
    // Henderson YOUTH BREAKOUT (age 21): 18→31pts trending. At home, expect 25+.
    // Harper YOUTH BREAKOUT (age 20): 10pts/4ast G2, expanded role if Wemby out.
    // SAS shot 7-24 3PT (29%) G2 — regression UP expected. Holiday found rhythm (19/9/5).
    g3PlayerOutlook: {
      home: [ // SAS (AWAY at Moda Center for G3)
        // Wemby: OUT — concussion protocol. Did not clear neurologist evaluation.
        // G1: 35pts (13-21, 5-6 3PT). G2: 5pts in 12min before exit. NOT AVAILABLE for G3.
        { player:"Victor Wembanyama", outlook:"bad", projFgPct:0.00, ptsRange:[0,0], reason:"OUT — concussion protocol. Failed to clear independent neurologist evaluation within the required 48-hour window. Will not play G3. His +16.9 on/off differential is the largest in the playoffs — SAS is a fundamentally different team without him. Losing his rim protection, offensive gravity, 3PT spacing, and defensive versatility simultaneously. SAS must rely on Fox/Castle/Vassell core.", confidence:"high" },

        // Fox: G1 17pts/6ast, G2 17pts/6ast (6-16 FG, 37.5%). Season ~47% FG.
        // With Wemby OUT, Fox MUST be THE scorer. Higher volume, road game.
        // Bayesian: 0.40*(~0.40 avg) + 0.30*(0.375 G2) + 0.30*(0.47 season) = ~0.42. Road → 0.41
        { player:"De'Aaron Fox", outlook:"neutral-good", projFgPct:0.43, ptsRange:[20,28], reason:"Rock-solid 17pts/6ast in BOTH games — consistent if not efficient (37.5% G2). With Wemby OUT, Fox becomes SAS's alpha scorer — expect 22-26pts on higher volume. His speed in transition is venue-independent and POR's transition defense was exposed in G2. Half-court creation suffers without Wemby's gravity but Fox's ability to get to the rim is self-generated. Road game at Moda Center adds difficulty. This is Fox's chance to prove he can carry a team — SAS's playoff hopes rest on him.", confidence:"medium" },

        // Castle: G1 17pts, G2 18pts/5reb/8ast/3stl (7-20 FG, 35%). Season ~44% FG.
        // With Wemby OUT, Castle's playmaking becomes critical. Road game.
        // Bayesian: 0.40*(~0.40 avg) + 0.30*(0.35 G2) + 0.30*(0.44 season) = ~0.40. Road → 0.39
        { player:"Stephon Castle", outlook:"neutral", projFgPct:0.40, ptsRange:[14,22], reason:"Averaging 17.5pts/6.5ast through 2 games — productive despite 35% G2 FG. With Wemby OUT, Castle's ball-handling and playmaking become critical (8ast G2 shows he can create). Road game adds difficulty for a young player, but his defensive versatility (3stl G2) travels to any venue. Volume stays high with heavy usage — efficiency may stay around 40% FG but scoring output remains in 16-20pt range.", confidence:"medium" },

        // Vassell: G1 unspecified, G2 16pts/12reb (6-16 FG, 0-5 3PT). Season ~43% FG.
        // Hit two crucial 3s in G1 Q3 to put game away. G2 was cold from 3 but rebounded well.
        // Bayesian: projects regression UP from 0% 3PT G2.
        { player:"Devin Vassell", outlook:"neutral", projFgPct:0.42, ptsRange:[12,20], reason:"G2 was 0-5 from 3PT — massive regression UP expected (season ~36% 3PT). His two straight Q3 3s in G1 showed his ceiling. 12 rebounds in G2 showed effort. Road game slight dip. With Wemby uncertain, Vassell's 3PT shooting is critical for SAS spacing. Project 2-5 from 3PT at Moda Center.", confidence:"medium" },

        // Harper: G2 10pts/4ast (4-7 FG) in 23min. Age 20, rookie.
        // YOUTH BREAKOUT CANDIDATE (Phase 29 active). Expanded role if Wemby out.
        { player:"Dylan Harper", outlook:"neutral-good", projFgPct:0.48, ptsRange:[8,16], reason:"YOUTH BREAKOUT WATCH (age 20, Phase 29 active). G2: 10pts/4ast in 23min after Wemby exit — expanded role in crisis. Rookie showing poise beyond his years. If Wemby OUT, Harper could see 28+ minutes as secondary ball-handler behind Fox/Castle. His 4-7 FG (57.1%) G2 was efficient. Road game is harder for rookies, but the youth breakout multiplier compensates. Could be SAS's X-factor at POR.", confidence:"medium" },

        // Champagnie: G2 9pts (3-4 FG). Energy forward.
        { player:"Julian Champagnie", outlook:"neutral", projFgPct:0.45, ptsRange:[6,12], reason:"Efficient G2 (3-4 FG, 2-3 3PT). Energy forward who provides spacing and hustle. Road game reduces his already modest impact. If Wemby OUT, Champagnie gets more minutes as a stretch-4. Expect 8-10pts.", confidence:"low" }
      ],
      away: [ // POR (HOME at Moda Center for G3)
        // Henderson: G1 18pts, G2 31pts (11-17 FG, 5-9 3PT). Age 21.
        // YOUTH BREAKOUT CONFIRMED. Phase 29 persistence = consecutive breakouts MORE likely.
        // AT HOME — expect another 25+ game.
        { player:"Scoot Henderson", outlook:"good", projFgPct:0.48, ptsRange:[24,32], reason:"YOUTH BREAKOUT CONFIRMED (age 21): 18pts G1 → 31pts G2 (11-17 FG, 64.7%). Phase 29 youth breakout persistence: consecutive breakout games for ≤23-year-olds are MORE likely after one. NOW AT HOME at Moda Center — expect peak performance. Henderson is currently POR's best player by production. FG% will regress from 64.7% to ~48% (still above his season average) but volume stays high. His 5-9 3PT G2 was an outlier — project 2-4 from 3PT. Even with regression, 25+ is the baseline at home with crowd energy.", confidence:"high" },

        // Avdija: G1 30pts/10reb (All-Star level), G2 14pts (5-13 FG). Season ~46% FG.
        // POR's star player. Home game should restore G1-level production.
        // Bayesian: 0.40*(~0.45 avg G1-G2) + 0.30*(0.385 G2) + 0.30*(0.46 season) = ~0.43. Home bump → 0.46
        { player:"Deni Avdija", outlook:"good", projFgPct:0.46, ptsRange:[22,30], reason:"POR's best overall player — 22pts average through 2 games (30pts G1, 14pts G2). G2 dip (5-13 FG) was partly Wemby's defensive gravity before his exit. At HOME, expect G1-level production restored: 24-28pts. His pick-and-roll creation and size (6'9) are matchup problems for SAS without Wemby. If Wemby OUT, Avdija becomes the clear best player on the floor. Home crowd + All-Star motivation = expect his best game.", confidence:"high" },

        // Holiday: G1 9pts, G2 19pts/9ast/5stl. Season ~44% FG. Veteran.
        // Bounce-back CONFIRMED in G2. Home game + veteran comfort.
        // Bayesian: 0.40*(~0.42 avg) + 0.30*(~0.35 G2) + 0.30*(0.44 season) = ~0.41. Home → 0.43
        { player:"Jrue Holiday", outlook:"neutral-good", projFgPct:0.43, ptsRange:[14,22], reason:"G2 bounce-back confirmed: 19pts/9ast/5stl after 9pts G1. Championship pedigree (MIL 2021) shows in elimination-pressure games. At HOME, Holiday's veteran comfort + crowd energy = expect sustained 16-20pts. His perimeter defense on Fox is elite. The 5 steals in G2 suggest he's locked in defensively. At 43% FG with playmaking, he's POR's stabilizing force.", confidence:"medium" },

        // Sharpe: G1 4-13 FG, G2 5-6 FG (11pts/9reb/5ast). Season ~44% FG.
        // Found rhythm in G2. Home game should help.
        { player:"Shaedon Sharpe", outlook:"neutral-good", projFgPct:0.46, ptsRange:[12,18], reason:"G2 was a revelation: 5-6 FG, 11pts/9reb/5ast after cold G1 (4-13). At HOME, Sharpe's athleticism and scoring instincts should shine. Still working back from 28-game absence — conditioning improving game-by-game. Project 14-16pts at home with continued rebounding effort. His ceiling is a 20pt game if he gets hot from the mid-range.", confidence:"medium" },

        // Clingan: G1 blocked multiple times, G2 4-12 FG. Struggling vs SAS length.
        { player:"Donovan Clingan", outlook:"bad", projFgPct:0.40, ptsRange:[6,12], reason:"Struggling badly: 4-12 FG in G2, blocked multiple times in G1. SAS's length (even without Wemby — Champagnie/Castle/Vassell) neutralizes his interior game. Home court doesn't fix matchup problems. If Wemby OUT, Clingan should improve without the rim-protection shadow — but his 4-12 G2 was WITHOUT Wemby for most of the game. Foul trouble risk (4+ fouls/game) limits minutes.", confidence:"medium" },

        // Camara: G1 2-7 (28.6%). Defensive wing.
        { player:"Toumani Camara", outlook:"neutral", projFgPct:0.40, ptsRange:[6,12], reason:"G2: 10pts/8reb/2stl (3-7 FG, 2-5 3PT). Defensive effort is his primary value. Home crowd amplifies his energy. Not a primary scorer but provides important two-way minutes. Expect 8-10pts.", confidence:"low" },

        // R. Williams: G1 5-7 (71.4%), 11pts off bench.
        { player:"Robert Williams", outlook:"neutral", projFgPct:0.50, ptsRange:[6,12], reason:"Efficient off bench (71.4% G1). If Clingan struggles again, Williams may see 18-20min. His finishing and passing are real skills. Home court helps bench players find rhythm.", confidence:"low" }
      ]
    },
    games: [{num:1,result:"W",homeScore:111,awayScore:98,winner:"SAS",notes:"Wemby's playoff debut — 35pts (franchise record, surpassing Duncan's 32 in 1998), 5reb, 2blk, 5-6 3PT. 21 first-half pts = NBA record for most in opening half of playoff debut (since 1997 PBP era). Castle 17pts + Fox 17pts (combined 15ast). Vassell hit two straight 3s in Q3 to put game away (72-61). POR: Avdija 30pts/10reb (All-Star level), Henderson 18pts (breakout). Clingan blocked multiple times — Kornet AND Vassell blocked him on SAME possession. SAS led by 16 in 1H, POR cut to 59-57 with 8-0 Q3 run, but SAS clamped down defensively and pulled away. Sellout crowd at Frost Bank Center (Duncan + Robinson courtside). Model picks: SAS ML ✅ (HIGH confidence), SAS -10.5 ✅ (+2.5 margin cover), Under 218.5 ✅ (209 total)."},{num:2,result:"L",homeScore:103,awayScore:106,winner:"POR",notes:"UPSET. POR 106-103. Wembanyama CONCUSSION — fell face-first at 8:57 Q2 after Holiday foul, head hit floor, entered concussion protocol, OUT for remainder. Only 5pts/4reb/1blk in 12min. SAS collapsed without him. Scoot Henderson BREAKOUT: 31pts (11-17 FG, 5-9 3PT, 64.7%) + 10reb — youth breakout (age 21). Holiday bounce-back: 19pts/9ast/5stl. SAS shot 7-24 3PT (29%). Vassell 0-5 3PT. Series tied 1-1. Model picks: SAS ML ✗, SAS -11.5 ✗, Wemby Over 25.5 ✗ (injury).",boxScores:{home:[{name:"J. Champagnie",min:26,pts:9,reb:3,ast:0,stl:1,blk:1,fg:"3-4",threes:"2-3",ft:"1-2",to:0},{name:"V. Wembanyama",min:12,pts:5,reb:4,ast:1,stl:0,blk:1,fg:"1-3",threes:"0-1",ft:"3-4",to:2},{name:"D. Fox",min:34,pts:17,reb:5,ast:6,stl:1,blk:1,fg:"6-16",threes:"1-3",ft:"4-5",to:3},{name:"D. Vassell",min:34,pts:16,reb:12,ast:2,stl:1,blk:3,fg:"6-16",threes:"0-5",ft:"4-5",to:1},{name:"S. Castle",min:38,pts:18,reb:5,ast:8,stl:3,blk:1,fg:"7-20",threes:"2-6",ft:"2-5",to:1},{name:"H. Barnes",min:15,pts:4,reb:1,ast:0,stl:0,blk:0,fg:"1-3",threes:"0-1",ft:"2-2",to:0},{name:"K. Johnson",min:18,pts:7,reb:4,ast:3,stl:1,blk:1,fg:"3-7",threes:"1-3",ft:"0-0",to:2},{name:"C. Bryant",min:12,pts:7,reb:2,ast:3,stl:2,blk:1,fg:"3-5",threes:"1-2",ft:"0-0",to:0},{name:"D. Harper",min:23,pts:10,reb:2,ast:4,stl:0,blk:2,fg:"4-7",threes:"0-0",ft:"2-2",to:0}],away:[{name:"T. Camara",min:35,pts:10,reb:8,ast:1,stl:2,blk:1,fg:"3-7",threes:"2-5",ft:"2-2",to:0},{name:"D. Avdija",min:30,pts:14,reb:5,ast:3,stl:0,blk:1,fg:"5-13",threes:"1-2",ft:"3-5",to:4},{name:"D. Clingan",min:24,pts:9,reb:1,ast:1,stl:1,blk:1,fg:"4-12",threes:"1-6",ft:"0-0",to:1},{name:"J. Holiday",min:34,pts:19,reb:5,ast:9,stl:5,blk:1,fg:"6-17",threes:"2-6",ft:"2-2",to:2},{name:"S. Henderson",min:38,pts:31,reb:10,ast:2,stl:1,blk:1,fg:"11-17",threes:"5-9",ft:"4-6",to:1},{name:"J. Grant",min:20,pts:5,reb:1,ast:0,stl:0,blk:1,fg:"1-9",threes:"0-2",ft:"3-3",to:0},{name:"S. Sharpe",min:23,pts:11,reb:9,ast:5,stl:0,blk:1,fg:"5-6",threes:"1-2",ft:"0-0",to:3},{name:"M. Thybulle",min:13,pts:9,reb:3,ast:0,stl:1,blk:1,fg:"3-5",threes:"1-3",ft:"2-2",to:1}]}},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "DET-ORL", conf: "East", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Ausar Thompson", target:"Paolo Banchero", dLebron:2.93, targetUsg:27.5, note:"G1 RESULT: Ausar's elite D-LEBRON (2.93) couldn't contain Banchero (23pts, 8-15, 9reb, 4ast). ORL's multi-initiator attack (Wagner 19, Bane 17, WCJ 17, Suggs 16) spread the load so Banchero never needed to force. Suppression model correctly predicted only +0.13 advantage because ORL's 2 initiators dilute individual defender impact." },
      awayDefOnHome: { defender:"Jalen Suggs", target:"Cade Cunningham", dLebron:1.552, targetUsg:29.0, note:"G1 RESULT: Suggs (16pts, 5reb, 4ast, 3stl, 1blk) didn't suppress Cade's scoring (39pts career-high) but DID suppress his CREATION — DET's supporting cast scored only 62 combined. Single-initiator vulnerability confirmed: Cade brilliance wasn't enough when nobody else could score. The suppression wasn't on Cade's output but on DET's entire half-court generation." }
    },
    homeTeam: {
      name: "Pistons", city: "Detroit", abbr: "DET", seed: 1, record: "60-22",
      systemBonus: 0.5,
      playoffPedigree: 0, // franchise drought
      offStyle: "Cade P&R primary. Elite defense creates transition opportunities. Heavily Cunningham-dependent for half-court creation.", initiators: 1,
      color: "#C8102E", color2: "#1D42BA",
      advStats: { ortg:115.8, drtg:107.2, netRtg:8.6, pace:97.5, ts:58.2, efg:55.4, tov:12.2, reb:52.1, ortgRk:5, drtgRk:1, clutchNetRtg:7.2, last10:"8-2", fgPct:52.4, threePct:36.6, ftPct:78.4, orbPct:25.7 },
      players: [
        { name:"Cade Cunningham", pos:"PG", rating:87, ppg:23.9, rpg:5.5, apg:9.9, fgp:46.8, per:25.2, ts:59.2, epm:6.0, bpm:6.8, ws48:.195, onOff:9.0, clutch:8.0, vorp:4.9, usg:29.0, injury:"GTD — returned from collapsed lung", lebron:5.383, oLebron:4.104, dLebron:1.279, war:10.44, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"MVP candidate. +9.0 on/off. 8.0 clutch. 9.9 APG elite creation. But collapsed lung recovery — conditioning in question", baseRating:90, starCeiling:1, injuryRisk:0.5, activeInjury:{type:"collapsed lung recovery",severity:0.5,note:"G1: 39pts (playoff career-high) but conditioning visibly limited in stretches. Acknowledged still getting back to 100% after missing 3 weeks with pneumothorax. Scored in bunches then faded — cardiopulmonary fatigue remains primary concern for G2+."} },
        { name:"Jalen Duren", pos:"C", rating:80, ppg:19.5, rpg:10.5, apg:2.0, fgp:65.0, per:22.5, ts:61.8, epm:3.8, bpm:4.0, ws48:.172, onOff:6.2, clutch:5.8, vorp:3.2, usg:25.8, injury:null, lebron:3.992, oLebron:2.617, dLebron:1.375, war:7.905, offRole:"Shot Creator", defRole:"Mobile Big",
          matchupNote:"All-Star breakout. 65.0% FG elite efficiency. G1 NEUTRALIZED: only 8pts/7reb (3-4 FG) — WCJ scheme fronted him and denied entry passes. DET needs to find Duren in G2 or their interior advantage is moot.", baseRating:80 },
        { name:"Ausar Thompson", pos:"SF", rating:78, ppg:9.9, rpg:5.7, apg:3.1, fgp:52.5, per:16.8, ts:57.4, epm:2.8, bpm:2.5, ws48:.132, onOff:5.8, clutch:5.5, vorp:2.5, usg:18.0, injury:null, lebron:2.821, oLebron:-0.109, dLebron:2.93, war:6.247, offRole:"Cutter", defRole:"Point of Attack",
          matchupNote:"Elite perimeter defender. D-LEBRON 2.93 = #3 in NBA. Scoring role limited (9.9ppg) — value is entirely defensive. G1: 8pts/7reb/3stl in 25min. 2.0 stl/game. DET's defensive identity player.", baseRating:78 },
        { name:"Duncan Robinson", pos:"SG", rating:65, ppg:12.2, rpg:2.7, apg:2.1, fgp:45.6, per:12.0, ts:59.0, epm:0.3, bpm:-0.2, ws48:.075, onOff:1.5, clutch:4.5, vorp:0.8, usg:18.5, injury:null, lebron:-1.0, oLebron:0.5, dLebron:-1.5, war:1.5, offRole:"Off Screen Shooter", defRole:"Chaser",
          matchupNote:"STARTER. 41.0% from 3 — DET's primary floor spacer. Forces defenses to stay attached, opening lanes for Cunningham/Duren. G1: 9pts/4ast (3-6 3PT) in 26min.", baseRating:62 },
        { name:"Isaiah Stewart", pos:"C", rating:64, ppg:10.0, rpg:5.0, apg:1.2, fgp:55.0, per:14.5, ts:58.2, epm:0.8, bpm:0.8, ws48:.092, onOff:2.5, clutch:4.8, vorp:1.1, usg:17.5, injury:null, lebron:-0.527, oLebron:-0.879, dLebron:0.352, war:1.595, offRole:"Stretch Big", defRole:"Mobile Big",
          matchupNote:"Backup C behind Duren. Physical interior presence. G1: 3pts/4reb/1stl/1blk in 19min. 33.3% from 3 adds stretch dimension.", baseRating:64 },
        { name:"Tobias Harris", pos:"PF", rating:60, ppg:13.3, rpg:5.1, apg:2.5, fgp:46.9, per:14.5, ts:57.0, epm:0.0, bpm:-0.3, ws48:.075, onOff:0.5, clutch:4.0, vorp:0.8, usg:22.0, injury:null, lebron:1.552, oLebron:1.026, dLebron:0.526, war:4.386, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"Veteran starter, 36.8% from 3. Steadying presence and reliable mid-range scorer", baseRating:60 },
        { name:"Daniss Jenkins", pos:"PG", rating:55, ppg:9.3, rpg:2.3, apg:3.9, fgp:40.8, per:11.5, ts:54.0, epm:-0.3, bpm:-0.8, ws48:.055, onOff:0.0, clutch:3.5, vorp:0.4, usg:17.0, injury:null, lebron:-1.5, oLebron:-0.5, dLebron:-1.0, war:0.5, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"Key bench guard. 37.4% from 3. Secondary playmaker when Cade sits. G1: 6pts/2reb/2ast (1-7 FG, 1-6 3PT) — struggled badly. Used in Bickerstaff's panic closing lineup.", baseRating:52 },
        { name:"Kevin Huerter", pos:"SG", rating:52, ppg:8.2, rpg:1.6, apg:1.6, fgp:44.3, per:10.0, ts:53.0, epm:-0.2, bpm:-0.8, ws48:.050, onOff:-0.5, clutch:3.5, vorp:0.3, usg:15.0, injury:null, lebron:-1.5, oLebron:0.0, dLebron:-1.5, war:0.5, offRole:"Off Screen Shooter", defRole:"Chaser",
          matchupNote:"Veteran shooter, 29.4% 3PT this year (down sharply). G1: 3pts (1-3 FG) in 18min. Used in closing lineup despite limited season production. Has 2022 playoff pedigree (ATL ECF hero).", baseRating:55 },
        { name:"Ron Holland", pos:"SF", rating:50, ppg:8.2, rpg:4.0, apg:1.0, fgp:45.0, per:10.0, ts:53.0, epm:-0.5, bpm:-1.0, ws48:.045, onOff:-0.5, clutch:3.0, vorp:0.2, usg:14.0, injury:null, lebron:-1.0, oLebron:-0.8, dLebron:-0.2, war:0.3, offRole:"Cutter", defRole:"Wing Stopper",
          matchupNote:"Rookie forward, energy and athleticism off bench. G1: 2pts/2reb/1stl in 11min. Played over LeVert — raw but provides defensive upside.", baseRating:48 },
        { name:"Caris LeVert", pos:"SG", rating:52, ppg:7.4, rpg:2.7, apg:2.0, fgp:42.0, per:11.0, ts:53.0, epm:-0.3, bpm:-1.0, ws48:.050, onOff:-0.5, clutch:3.5, vorp:0.3, usg:16.0, injury:null, lebron:-1.0, oLebron:0.0, dLebron:-1.0, war:0.5, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"Bench shot creator for isolation situations. DNP in G1 but Fadeaway World lists him in rotation. May get minutes if Bickerstaff adjusts bench rotation for G2.", baseRating:55 },
        { name:"Marcus Sasser", pos:"PG", rating:48, ppg:5.2, rpg:1.1, apg:2.0, fgp:40.7, per:9.5, ts:56.0, epm:-0.8, bpm:-1.5, ws48:.042, onOff:-1.0, clutch:3.0, vorp:0.1, usg:14.8, injury:null, lebron:-2.122, oLebron:-1.168, dLebron:-0.953, war:0.099, offRole:"Secondary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Quick scoring bursts. DNP in G1. May see spot minutes if DET needs more perimeter shooting.", baseRating:48 }
      ],
      synergy: [
        { players:["Cunningham","D.Robinson","A.Thompson","Harris","Duren"], score:82, note:"ACTUAL starting 5 per Fadeaway World. Robinson's 41% 3PT provides spacing. #1 defense (107.2 DRtg). Most-used lineup (1124 possessions, +12.2 NetRtg). G1: LOST 101-112 — Duren neutralized, bench collapsed." },
        { players:["Cunningham","Jenkins","Huerter","Stewart","Duren"], score:62, note:"G1 PANIC closing lineup (0 min together all season). Bickerstaff abandoned proven rotations. 4-16 bench shooting. This lineup should NOT be used again." },
        { players:["Cunningham","D.Robinson","A.Thompson","Harris","Stewart"], score:72, note:"Two-big lineup. Stewart adds physicality alongside Harris. Robinson provides spacing. Used when Duren rests or in foul trouble." },
        { players:["Jenkins","Huerter","Holland","LeVert","Stewart"], score:58, note:"Full bench unit. Jenkins runs point. LeVert creates in ISO. Low-ceiling but can hold leads. G1: DET bench scored only 20pts on 4-16 shooting." }
      ]
    },
    awayTeam: {
      name: "Magic", city: "Orlando", abbr: "ORL", seed: 8, record: "45-37",
      systemBonus: 1.0, // elite defense
      playoffPedigree: 1, // 2024 R1 vs CLE (lost 4-3) — Banchero, Wagner, Suggs, WCJ, Black all have experience
      offStyle: "G1-PROVEN multi-initiator attack. Banchero primary creator, Wagner secondary closer, Bane provides shooting gravity, Suggs sets defensive tone. 5 players in double figures G1. Defense-to-offense identity with switchable lineups.", initiators: 2,
      color: "#0077C0", color2: "#000000",
      advStats: { ortg:110.2, drtg:111.8, netRtg:-1.6, pace:96.8, ts:55.4, efg:51.8, tov:13.8, reb:50.2, ortgRk:24, drtgRk:15, clutchNetRtg:3.8, last10:"5-5", fgPct:48.8, threePct:31.2, ftPct:72.8, orbPct:24.2 },
      players: [
        { name:"Paolo Banchero", pos:"PF", rating:80, ppg:22.2, rpg:8.4, apg:5.2, fgp:45.9, per:20.8, ts:56.4, epm:2.8, bpm:3.2, ws48:.138, onOff:4.8, clutch:6.2, vorp:3.1, usg:27.5, injury:null, lebron:0.875, oLebron:0.98, dLebron:-0.105, war:5.229, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"28.0 PPG career playoff avg (12 games). G1: 23pts/9reb/4ast on 8-15 FG — calm, in rhythm. 2024 playoff experience (7-game series vs CLE) gives him poise. Didn't score in Q4 but didn't need to. 30.5% 3PT is a concern but attacks interior relentlessly.", baseRating:78, starCeiling:1, injuryRisk:0.3, playoffAscension:0.8 },
        { name:"Franz Wagner", pos:"SF", rating:76, ppg:20.6, rpg:5.2, apg:3.3, fgp:48.1, per:18.4, ts:57.2, epm:2.2, bpm:2.0, ws48:.128, onOff:3.5, clutch:5.5, vorp:2.4, usg:26.2, injury:null, lebron:2.297, oLebron:1.688, dLebron:0.608, war:3.031, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"2024 playoff star — carried ORL vs CLE after Banchero injury. G1: 19pts (7-13 FG) including 10 Q4 pts to ice the game. Opened Q4 with Banchero on bench and went 6-for-6 as a unit. Clutch closer. Dealt with injuries this season but rhythm returning.", baseRating:75, starCeiling:1, injuryRisk:0.2 },
        { name:"Desmond Bane", pos:"SG", rating:74, ppg:20.1, rpg:4.1, apg:4.1, fgp:48.4, per:17.5, ts:58.2, epm:2.0, bpm:1.8, ws48:.118, onOff:3.0, clutch:5.8, vorp:2.2, usg:25.8, injury:null, lebron:1.688, oLebron:1.316, dLebron:0.373, war:7.16, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"ORL's most reliable offensive piece — played all 82 games. 39.1% 3PT stretches floor. MEM playoff experience (2022-23). G1: 17pts/6reb/5ast (7-20 FG, 1-8 3PT) — didn't shoot well but still contributed across the board.", baseRating:74 },
        { name:"Jalen Suggs", pos:"PG", rating:68, ppg:13.8, rpg:3.9, apg:5.5, fgp:43.5, per:13.5, ts:54.2, epm:0.5, bpm:0.2, ws48:.072, onOff:0.8, clutch:4.8, vorp:0.9, usg:21.5, injury:null, lebron:2.175, oLebron:0.623, dLebron:1.552, war:4.562, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"ORL's heartbeat — 1.8 stl/game, defensive energy sets the tone. 2024 playoff experience vs CLE. G1: IGNITED 18-5 opening run with early 3s, loose balls, deflections. 16pts/5reb/4ast/3stl/1blk. Cade still scored 39 but Suggs' strategy was 'let him score, kill everyone else' — it worked.", baseRating:66 },
        { name:"Wendell Carter Jr.", pos:"C", rating:66, ppg:11.8, rpg:7.4, apg:2.0, fgp:52.1, per:15.2, ts:56.8, epm:0.4, bpm:0.1, ws48:.082, onOff:0.2, clutch:4.2, vorp:1.0, usg:20.5, injury:null, lebron:0.313, oLebron:-1.013, dLebron:1.326, war:3.977, offRole:"Stretch Big", defRole:"Mobile Big",
          matchupNote:"G1 HERO: 17pts/6reb/5ast — NEUTRALIZED Duren (8pts/7reb). Mosley's scheme had WCJ fronting Duren and denying entry passes, a masterclass in matchup exploitation. 2024 playoff veteran (7 games vs CLE). Rating upgraded 64→66 reflecting G1 defensive impact and proven playoff performance. His ability to contain Duren is THE key matchup advantage for ORL.", baseRating:64 },
        { name:"Anthony Black", pos:"SG", rating:68, ppg:15.0, rpg:4.2, apg:3.5, fgp:46.2, per:14.8, ts:56.0, epm:0.8, bpm:0.5, ws48:.082, onOff:1.5, clutch:4.5, vorp:1.2, usg:20.5, injury:null, lebron:0.459, oLebron:0.202, dLebron:0.257, war:3.495, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"MASSIVE model correction: 8.5→15.0 PPG. Sophomore breakout — nearly doubled scoring as full-time starter. 6'7 combo guard with defensive versatility. 2024 playoff experience (7 games vs CLE as rookie). G1: key contributor in ORL's balanced attack (5 players in double figures). Rating 60→68 reflecting actual production. His size and two-way play make him a matchup nightmare for DET's smaller guards.", baseRating:60 },
        { name:"Goga Bitadze", pos:"C", rating:56, ppg:5.9, rpg:5.0, apg:1.5, fgp:54.5, per:12.0, ts:56.5, epm:-0.2, bpm:-0.5, ws48:.058, onOff:-0.5, clutch:3.5, vorp:0.4, usg:15.5, injury:null, lebron:2.229, oLebron:0.417, dLebron:1.812, war:2.85, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Backup C behind WCJ. Stats corrected: 9.2→5.9ppg, 6.8→5.0rpg — model overestimated his production. G1: 10pts/5reb/2blk in 17min off bench — solid energy minutes. D-LEBRON 1.812 gives him defensive value. 2024 playoff experience (started several games when WCJ injured vs CLE). Rating 61→56 reflecting actual role.", baseRating:56 },
        { name:"Tristan da Silva", pos:"SF", rating:55, ppg:9.9, rpg:3.7, apg:1.6, fgp:46.0, per:11.5, ts:55.0, epm:-0.3, bpm:-0.8, ws48:.065, onOff:0.0, clutch:3.5, vorp:0.4, usg:18.8, injury:null, lebron:-0.717, oLebron:-0.838, dLebron:0.121, war:2.073, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Versatile sophomore forward, 12 PPG as starter. Switchable defender on wings", baseRating:55 },
        { name:"Moritz Wagner", pos:"C", rating:50, ppg:6.9, rpg:3.2, apg:0.8, fgp:42.6, per:12.0, ts:53.0, epm:-0.5, bpm:-1.0, ws48:.055, onOff:-0.5, clutch:3.0, vorp:0.1, usg:16.0, injury:null, lebron:-0.321, oLebron:0.531, dLebron:-0.852, war:0.572, offRole:"Versatile Big", defRole:"Mobile Big",
          matchupNote:"Returned from ACL surgery. Provides bench scoring punch and energy in spot minutes", baseRating:50 }
      ],
      synergy: [
        { players:["Suggs","Bane","Wagner","Banchero","WCJ"], score:76, note:"G1 STARTING 5. Won 112-101 at DET. 5 players in double figures. WCJ neutralized Duren. Bane-Wagner-Banchero tri-creator attack. Suggs defensive tone-setter. +11 margin." },
        { players:["Black","Bane","Wagner","Banchero","WCJ"], score:72, note:"Black replaces Suggs — bigger backcourt with more scoring. Black's 15.0 PPG breakout adds another initiator. Used in stretches when ORL needs more half-court offense." },
        { players:["Suggs","Black","Wagner","Banchero","Bitadze"], score:66, note:"WCJ rest lineup. Bitadze provides rim protection (D-LEBRON 1.812). Smaller-guard pairing with Suggs/Black provides defensive versatility. 2024 playoff-tested (Bitadze started vs CLE)." },
        { players:["Suggs","Bane","Wagner","da Silva","WCJ"], score:68, note:"Banchero rest lineup. Wagner becomes primary creator. da Silva's versatility (9.9ppg, switchable D) fills in. Used to open Q4 in G1 — unit went 6-for-6 and extended lead." }
      ]
    },
    externalFactors: [
      { team:"DET", player:"Cade Cunningham", desc:"Collapsed lung recovery. G1: 39pts but conditioning visibly limited in stretches. Contact aversion could limit aggressiveness in G2+.", impact:-5, category:"injury" },
      { team:"DET", player:null, desc:"60-22, #1 seed, franchise renaissance. Won 15 of 19 to close. +7.2 clutch NetRtg. BUT: ZERO playoff experience with this core. 11 straight home playoff losses (0-8 at LCA since 2008). G1 loss exposed franchise pedigree crisis.", impact:2, category:"motivation" },
      { team:"DET", player:null, desc:"PEDIGREE DEFICIT: No DET player has meaningful playoff experience. Bickerstaff's 5-11 record is from CLE. G1 closing lineup panic (0 min together all season) suggests coaching trust erodes under pressure. Structural disadvantage.", impact:-4, category:"chemistry" },
      { team:"ORL", player:null, desc:"2024 PLAYOFF PEDIGREE: R1 vs CLE (lost 4-3). Banchero (28.0 PPG career playoff avg, 12 games), Wagner (carried after Banchero injury), Suggs, WCJ, Black ALL have experience. G1 poise (wire-to-wire lead at DET) reflects that experience.", impact:5, category:"motivation" },
      { team:"ORL", player:null, desc:"G1 proved multi-initiator depth works: 5 in double figures. Bane trade has gelled. +3.8 clutch NetRtg. Chemistry concerns may be overblown.", impact:0, category:"chemistry" },
      { team:"ORL", player:"Paolo Banchero", desc:"Banchero-Mosley tension reported all season. BUT G1 CONTRADICTS worst-case: Mosley's A+ game plan + Banchero's 23/9/4 suggest they compartmentalize in playoffs. 2024 precedent: similar tension existed but ORL took CLE to 7.", impact:-3, category:"chemistry",
        evidence:"Yardbarker reported tension. Heavy.com reported trade demand threat. BUT G1 road win (112-101) with A+ coaching and star performance contradicts dysfunction narrative.",
        sources:["Yardbarker: paolo-banchero-jamahl-mosley-tension","Heavy: orlando-magic-turmoil-signals-likely-end-jamahl-mosley","Athlon: magic-star-ready-to-demand-trade-unless-jamahl-mosley-fired"], verdict:"verified — but G1 mitigates impact" }
    ],
    game1: {
      spread: "DET -8.5", moneyline: "DET -400 / ORL +300", ou: "O/U 218.5",
      pick: "DET", confidence: "high", projScore: "DET 112 — ORL 101",
      reasoning: "SPREAD UPDATE (Apr 19): Line moved from -3.5 to -8.5 — a massive 5-point market shift suggesting sharp money knows Cade is closer to full health. Detroit's #1 defense (107.2 DRtg) meets Orlando's #24 offense — and the market now prices this as a mismatch, not a toss-up. Banchero, Wagner, and Bane give Orlando three quality creators, but all three struggle from 3PT range, which means they can't punish Detroit for packing the paint. Duren's All-Star emergence gives DET an interior edge Carter can't match. Upgrading from medium to high confidence based on market movement and Cade health signals.",
      prosHome: ["#1 defense (107.2 DRtg) in the league", "Cunningham +9.0 on/off, MVP candidate", "Duren All-Star breakout — interior dominance", "Won 15 of last 19, home court"],
      consHome: ["Cade collapsed lung — conditioning?", "May limit Cade's minutes", "Bane trade upgraded ORL offense", "Young team's first playoff home game"],
      prosAway: ["Banchero 6.2 clutch rating — competitor", "Wagner + Bane add creation", "+3.8 clutch NetRtg despite record", "Three legitimate scoring options"],
      consAway: ["#24 offense (110.2 ORtg)", "Still struggle from 3PT range", "-1.6 NetRtg — negative team", "Duren interior mismatch vs Carter"]
    },
    game2: {
      spread: "DET -8.5", moneyline: "DET -375 / ORL +290", ou: "O/U 218.5",
      pick: "DET", confidence: "low", projScore: "DET 105 — ORL 102",
      schedule: "Wed Apr 22 — 7:00 PM ET — ESPN",
      reasoning: "MODEL PICK: DET 105-101 (LOW confidence, GRIND). Despite Orlando's stunning G1 upset (112-101), the engine still projects Detroit to win G2 by 4 points at home — a narrow margin that reflects significant uncertainty. The model leans DET for structural reasons: (1) #1 DEFENSE (107.2 DRtg) — Detroit's elite defense is schematic, not effort-based. One bad game doesn't erase a season of defensive dominance. Bickerstaff will have 48 hours of film to adjust the WCJ-on-Duren scheme that neutralized his All-Star center. (2) CADE'S STAR CEILING — Cunningham's 39pts in G1 proved he's a legitimate playoff alpha. The model's star ceiling variance means Cade at his best can single-handedly overcome ORL's depth advantage. He needs better supporting cast deployment, which Bickerstaff (COTY) should address. (3) HOME COURT — DET retains R1 HCA (+3.0 adjustment). Despite the 11-game home playoff losing streak, the #1 seed's talent floor at home is significant. (4) GRIND CHARACTER — The engine projects a physical, low-scoring affair where DET's defensive identity should reassert. The confidence is LOW because G1 exposed real structural problems: single-initiator penalty (only Cade and Harris scored), Bickerstaff's panic closing lineup (0 minutes together all season), and ORL's repeatable 'let Cade score, suffocate the rest' strategy. Mosley's A+ game plan exploits DET's creation gap, and ORL's 5-player balanced scoring is sustainable. This is a genuine toss-up that the model barely tilts toward Detroit.",
      g1Adjustments: [
        "ORL WON G1 112-101 — UPSET. #8 seed beat #1 seed at their building. Wire-to-wire lead.",
        "MODEL CORRECTION: Was HIGH confidence DET — biggest miss. Implementing structural fixes.",
        "SINGLE-INITIATOR EXPOSED: Cade 39pts but ONLY Harris (17) joined him in double figures. DET bench 4-16.",
        "MOSLEY'S STRATEGY IS REPEATABLE: 'Let Cade score, suffocate everyone else' exploits DET's creation gap",
        "DET PEDIGREE CRISIS: 11 straight home playoff losses, 0-8 at LCA since 2008. Franchise culture deficit.",
        "BICKERSTAFF PANIC: Closing lineup had ZERO minutes together all season — trust in system collapsed",
        "Duren NEUTRALIZED: WCJ scheme (fronting + help-side denial) held All-Star to 8pts/7reb. Repeatable.",
        "ORL DEPTH ADVANTAGE: 5 in double figures (Banchero 23, Wagner 19, Bane 17, Suggs 16, WCJ 17) vs DET's 2"
      ],
      prosHome: ["Still the #1 seed with #1 defense (107.2 DRtg) — talent hasn't changed", "Bickerstaff will have 48 hours of film study — COTY should adjust", "Home crowd desperation — franchise needs to end the home playoff drought", "Cade's 39pts proves he's a playoff performer — needs better supporting cast deployment", "DET went 15-4 to close season — resilience is real even if G1 was bad"],
      consHome: ["11 straight home playoff losses — culture deficit is REAL, not narrative", "Single-initiator problem is structural — can't add a 2nd creator overnight", "Bickerstaff's closing lineup panic (0 min together) eroded team trust", "Duren neutralized by WCJ scheme — no evidence Bickerstaff has a counter", "DET bench shot 4-16 — supporting cast may not improve under pressure"],
      prosAway: ["Mosley's A+ game plan is REPEATABLE — structural exploit, not variance", "5 players in double figures = sustainable depth advantage", "WCJ-Duren scheme proven — can double down with adjustments", "ORL has momentum and confidence — 'house money' mentality as 8 seed", "Bane's playoff experience (MEM) stabilizes closing minutes", "Wagner's 11 Q4 points showed closer potential"],
      consAway: ["-1.6 NetRtg team — still structurally weaker on paper", "Cade may go for 45+ in G2 — hard to win when opposing star is nuclear", "DET #1 defense will adjust — Bickerstaff is still COTY", "Road team in R1 — HCA still matters (+3.0 R1 adjustment)", "Shooting regression possible — ORL's 5-player balance may not repeat exactly"]
    },
    game3: {
      spread: "DET -2.5", moneyline: "DET -140 / ORL +120", ou: "O/U 211.5",
      pick: "DET", confidence: "low", projScore: "DET 106 — ORL 103",
      schedule: "Sat Apr 25 — 6:00 PM ET — TNT",
      reasoning: "PHASE 30 PICK: DET (LOW confidence, COIN FLIP). G2 result pending (Wed Apr 22), but regardless of outcome, G3 at Orlando's Kia Center projects as the tightest game in the entire G3 slate.\n\nSTRUCTURAL TENSION: DET has the #1 defense (107.2 DRtg) but a single-initiator offense (only Cade). ORL has a multi-initiator offense (Banchero/Wagner/Bane = 3 creators) but mediocre defense. This is a classic unstoppable force vs immovable object matchup.\n\nSINGLE-INITIATOR PROBLEM: DET's Achilles heel is half-court creation. Cade scored 39pts in G1 but only Harris (17) joined in double figures — DET bench went 4-16. ORL's 'let Cade score, suffocate everyone else' strategy is REPEATABLE. On the road, this problem worsens — crowd noise disrupts secondary players' confidence.\n\nYOUTH BREAKOUT WATCH: Two candidates:\n(1) Cade Cunningham (age 24) — technically above the ≤23 threshold for Phase 29 youth multiplier, but his star ceiling variance means 40+ is always possible. He IS the offense.\n(2) Paolo Banchero (age 23, EXACTLY at threshold) — Phase 29 applies! After 23pts in G1, a home game could unlock 28+ pts. Banchero at home with crowd energy + multi-initiator support is dangerous.\n(3) Jalen Suggs (age 24) — slightly above threshold but his defensive impact (suppressing Cade's creation, not scoring) is the X-factor.\n\n3PT VARIANCE: DET shot average from 3 in G1 (~34%). ORL shot well (42%). Expect slight regression for ORL (~37%). Net: 1-2pt swing toward DET.\n\nTURNOVERS: Critical factor. Cade's ball dominance means DET turnovers are concentrated — if ORL's trapping forces 4+ Cade TOs, DET's offense dies. Project DET 13-14 TOs, ORL 11-12 TOs.\n\nROLE FLEXIBILITY: DET 5.5 vs ORL 6.0. Unusually, ORL has HIGHER flexibility — their 3-initiator offense creates more lineup versatility. Mosley's ability to play Banchero/Wagner together or stagger them gives ORL scheme advantages.\n\nCOACHING: Bickerstaff (adj 5, COTY) vs Mosley (adj 7). Mosley has the edge — his G1 game plan was A+ rated. His multi-initiator exploitation of DET's single-creator weakness is a proven structural advantage.\n\nWHY DET DESPITE ALL THIS: DET's #1 defense is real and adjustable. Bickerstaff's COTY season proves he can evolve. DET's talent edge (Cade 90 rating > Banchero 82) + defensive identity gives them the slight edge in a true toss-up. LOW confidence because this genuinely could go either way.",
      g2Adjustments: [
        "G2 result pending (Wed Apr 22) — prediction assumes series at 1-1 or DET leading 1-0 at home",
        "SERIES SHIFTS TO ORLANDO: First road games for DET. Kia Center crowd will be energized.",
        "ORL MULTI-INITIATOR SUSTAINED: G1's 5 in double figures wasn't variance — Banchero/Wagner/Bane is structural",
        "CADE ISOLATION RISK: On the road, his 39pt G1 may be harder to replicate. Crowd noise disrupts secondary reads.",
        "BANCHERO YOUTH BREAKOUT (age 23): Phase 29 active! Home game could unlock 28+ pts. His 23pts in G1 on 53% FG was efficient and controlled.",
        "DET DEFENSE TRAVELS: #1 DRtg (107.2) is schematic, not just home-court dependent. But road defense typically drops ~2pts.",
        "DUREN ADJUSTMENT: Must solve WCJ's fronting scheme — if Bickerstaff can get Duren post-ups from different angles, DET's interior edge returns",
        "BENCH DEPTH: DET bench 4-16 in G1 vs ORL's balanced scoring is the key variable. If Harris/Robinson/Beasley step up, DET wins."
      ],
      prosHome: ["DET #1 defense (107.2 DRtg) is schematic — travels to any building. Will adjust from G1 film.", "Cade's 39pts proves he can carry in hostile environments. His 9.0 on/off creates winning basketball.", "Bickerstaff is COTY — given 2 game films, his adjustments should improve DET's half-court sets", "Duren's All-Star talent remains elite — WCJ scheme can be countered with proper angle adjustments", "DET went 25-16 on road (60.9%) — elite road team. Won't fold under crowd pressure."],
      consHome: ["ROAD GAME at Kia Center — hostile crowd for DET's young players", "Single-initiator problem WORSENS on the road — secondary players lose confidence away from home", "Bickerstaff's G1 panic (closing lineup with 0 minutes together) raises trust concerns", "DET bench (4-16 G1) may struggle even more in hostile environment", "11 straight home playoff losses suggests franchise mental block that extends to road games"],
      prosAway: ["HOME COURT — Kia Center, first home game of the series. Electric crowd energy.", "Banchero YOUTH BREAKOUT (age 23, Phase 29 active): Home game + confidence from G1 could produce 28+ pts", "Mosley's game plan is PROVEN and REPEATABLE — 'let Cade score, suffocate the rest' is structural", "Multi-initiator advantage (3 vs 1) creates scheme versatility on offense", "Wagner + Bane provide sustained secondary scoring that DET can't match from their supporting cast", "5 players in double figures in G1 = sustainable depth advantage"],
      consAway: ["-1.6 NetRtg — still structurally weaker on paper than DET", "DET's #1 defense WILL adjust with film study — Bickerstaff is COTY for a reason", "Cade's star ceiling (39pts G1) means he can single-handedly overcome depth disadvantage", "ORL's 3PT shooting (42% G1) will regress toward ~37% — cost ~2pts", "Bane's playoff experience is a plus but he was only 2-5 3PT in G1 — inconsistent long-range threat", "Carter/Clingan interior combo is limited vs Duren's All-Star post game if Bickerstaff adjusts angles"]
    },
    coaching: {
      home: {
        coach: "JB Bickerstaff",
        adjustmentRating: 5,
        schemeCreativity: 7,
        urgency: 8,
        playoffRecord: "5-11",
        tendency: "Defense-first, 'win the possession game'. COTY winner. Turned DET from worst to first.",
        rotationPlan: "Shrinks from 10-man to 8-man. Stewart first off bench 20+ MPG. Duncan Robinson key shooter.",
        keyAdjustment: "Cunningham-Duren PnR is primary action. Ausar Thompson as Paolo stopper",
        g1Performance: "D | COTY had his worst coaching performance in a signature game. Three critical failures: (1) Closing lineup panic — used Cunningham/Jenkins/Huerter/Stewart/Duren lineup with ZERO minutes together all season, abandoning proven rotations when it mattered most. (2) Failed to get Duren involved — All-Star was held to 8pts/7reb as WCJ neutralized him, and Bickerstaff had no counter (no post-ups, no PnR variations to free him). (3) No answer for ORL's 18-5 opening run — the first timeout came too late and adjustments after were ineffective. DET's bench shot 4-16 (20pts) reflecting a total system breakdown beyond the starting 5. Bickerstaff's pre-series quote about a 'war of attrition' suggested physical play, but ORL won with skill and depth instead. The franchise's 11-game home playoff losing streak now includes Bickerstaff's first entry."
      },
      away: {
        coach: "Jamahl Mosley",
        adjustmentRating: 7,
        schemeCreativity: 7,
        urgency: 9,
        playoffRecord: "8-8",
        tendency: "Defensive identity. Switchable lineups. Methodical half-court offense. 2024 R1 vs CLE (lost 4-3 in 7): proved he can coach competitive series against superior talent. Adjusted after losing Banchero to injury mid-series.",
        rotationPlan: "8-man rotation. Black (15.0ppg breakout) gets key minutes. Bane replaces WCJ in closing if offense stalls. Bitadze backup C (2024 playoff starter experience).",
        keyAdjustment: "Paolo as primary creator with Franz as secondary closer (11 Q4 pts G1). WCJ-on-Duren scheme is REPEATABLE. Slow pace to limit DET transition.",
        g1Performance: "A+ | Mosley's first road playoff win — and it was a masterclass. Pre-game, he publicly identified Cade as 'the No. 1 priority' and then executed brilliantly: Suggs on Cade full-time (16pts, 3stl, 1blk while Cade scored 39 but team collapsed). Key tactical wins: (1) WCJ neutralized Duren (8pts) — Mosley schemed help defense to front Duren and deny entry passes. (2) 18-5 opening run set the tone with aggressive ball pressure creating turnovers. (3) Opened 4th quarter (Banchero on bench) with Wagner-led unit that went 6-for-6, winning the crucial non-Banchero minutes. (4) Five players in double figures = load distribution that DET couldn't match. Mosley trusted Bane's playoff experience (17pts) and let Suggs' defensive energy define the pace. The strategy of letting Cade score but suffocating everyone else was perfectly calibrated — classic 'let the star get his, kill the supporting cast' playoff defense."
      },
      bestLineups: {
        home: { players: ["Cunningham","D.Robinson","A.Thompson","Harris","Duren"], netRtg:12.2, ortg:118.0, drtg:105.8, min:1124, note:"Most-used lineup, elite in 1124 possessions" },
        away: { players: ["Bane","Suggs","Franz","Paolo","WCJ"], netRtg:5.5, ortg:114.2, drtg:108.7, min:350, note:"Best lineup with Bane integrated" }
      },
      roleChanges: [
        { team:"DET", player:"Cunningham", regSeason:"All-Star primary ball-handler", playoff:"Even higher usage. Must deliver in first real playoff run", impact:"up", reason:"Bickerstaff builds everything around Cade" },
        { team:"DET", player:"A.Thompson", regSeason:"Starting wing, 30 MPG", playoff:"Primary wing defender on Paolo, 34+ MPG", impact:"up", reason:"Defensive assignment drives his playoff minutes" },
        { team:"DET", player:"Stewart", regSeason:"Bench big, 18 MPG", playoff:"First off bench, 22+ MPG in two-big lineups with Duren", impact:"up", reason:"Physicality needed in playoff basketball" },
        { team:"ORL", player:"Paolo", regSeason:"Star forward, 34 MPG", playoff:"36+ MPG, must be primary creator and scorer", impact:"up", reason:"Mosley needs him to carry the offensive load" },
        { team:"ORL", player:"Bane", regSeason:"Starting guard, 32 MPG", playoff:"34+ MPG, clutch shooter role expands", impact:"up", reason:"Grizzlies playoff experience is invaluable" }
      ]
    },
    schemePersistence: {
      away: { isSchemeDriven: true, fgSuppression: 0.05, description: "ORL held DET to 6 offensive boards (avg 12) and dominated paint by 20pts. Neutralized DET's #1 paint-scoring strength." },
      home: null
    },
    youthCeilings: { "Cade Cunningham": 1.50, "Paolo Banchero": 1.30, "Franz Wagner": 1.25 },
    // G2 Player Outlook — Bayesian blend: 55% model / 45% prior
    // G1: ORL 112, DET 101. UPSET — #8 seed wins at #1 seed. DET's 11 straight home playoff losses.
    // Cade had 39pts but was alone — only Harris (17) joined him. ORL had 5 in double figures.
    // DET must find secondary scoring. Bickerstaff never used closing lineup in regular season (0 min together).
    // DET still at home for G2 — bounce-back opportunity but systemic issues (single-initiator, no closing lineup reps) remain.
    g2PlayerOutlook: {
      home: [ // DET
        // Cade: G1 13-27 (48.1%), 3-8 3PT, 39pts career high. Season ~45% FG.
        // Bayesian: 0.55*0.481 + 0.45*0.450 = 0.467. Slight regression from career-high.
        // But Cade is genuinely this good — All-Star who can sustain high-efficiency scoring.
        { player:"Cade Cunningham", outlook:"good", projFgPct:0.46, ptsRange:[28,36], reason:"G1's 39pts was career-high but 48.1% FG is sustainable for an All-Star (season ~45%). Suggs' D suppressed CREATION not scoring — DET's supporting cast was the problem. Home again. Bickerstaff will scheme more actions to involve others, slightly reducing Cade's volume but improving team flow. Still 28-32pt scorer.", confidence:"high" },

        // Harris: G1 5-15 (33.3%), 1-7 3PT, 17pts. Season ~47% FG. Cold shooting.
        // Bayesian: 0.55*0.333 + 0.45*0.470 = 0.395. Bounce-back candidate.
        { player:"Tobias Harris", outlook:"neutral-good", projFgPct:0.42, ptsRange:[14,20], reason:"G1 was cold (33.3% FG, 1-7 3PT) — well below season ~47%. Veteran who typically bounces back. DET needs him as reliable second scorer. Expect closer to 16-18pts on improved efficiency. Bickerstaff must get him easier looks vs ORL's help defense.", confidence:"medium" },

        // Duren: G1 3-4 (75.0%), 8pts/7reb in 33min. WCJ dominated matchup.
        // Season ~58% FG. Low volume but efficient — WCJ's defense is the issue.
        { player:"Jalen Duren", outlook:"neutral", projFgPct:0.55, ptsRange:[8,14], reason:"G1 only 4 FGA despite playing 33min — WCJ and ORL's interior D smothered him. Season ~58% FG on rolls/putbacks. Efficiency will stay high but volume is matchup-limited. Rebounding (7reb) and rim protection are his primary G2 value.", confidence:"medium" },

        // A.Thompson: G1 3-7 (42.9%), 8pts/7reb/3stl in 25min. Defensive energy.
        // Season ~45% FG. Right at baseline.
        { player:"Ausar Thompson", outlook:"neutral", projFgPct:0.43, ptsRange:[6,12], reason:"G1 was on-brand: defense (3stl) and energy (7reb) with modest scoring. D-LEBRON 2.93 but couldn't contain Banchero (23pts). Role is defense — scoring around 8pts is fine. Expect similar effort-based contribution.", confidence:"medium" },

        // Robinson: G1 3-8 (37.5%), 3-6 3PT, 9pts. Season ~42% FG. Shooter.
        { player:"Duncan Robinson", outlook:"neutral", projFgPct:0.40, ptsRange:[6,12], reason:"3PT specialist who went 3-6 from deep in G1 — near baseline. Season ~42% FG. DET needs his spacing alongside Cade. Expect similar volume of open looks. Hit-or-miss game-to-game.", confidence:"low" },

        // Jenkins: G1 1-7 (14.3%), 1-6 3PT, 6pts. Season ~38% FG. Terrible shooting.
        // Bayesian: 0.55*0.143 + 0.45*0.380 = 0.250. Major bounce-back needed.
        { player:"Daniss Jenkins", outlook:"neutral", projFgPct:0.34, ptsRange:[4,10], reason:"G1 disastrous shooting (14.3% FG, 1-6 3PT). Season ~38% FG. Young player feeling playoff pressure. Some bounce-back expected but ORL's perimeter D is legitimately elite. Floor-spacing role but unreliable.", confidence:"low" },

        // Stewart: G1 0-2 (0%), 3pts in 19min. Energy big.
        { player:"Isaiah Stewart", outlook:"neutral", projFgPct:0.45, ptsRange:[2,8], reason:"Energy big who barely shot in G1 (0-2 FG). Physicality and defense are his value. Foul trouble risk but provides toughness DET needs. Expect 4-6pts on limited attempts.", confidence:"low" }
      ],
      away: [ // ORL
        // Banchero: G1 8-15 (53.3%), 23pts/9reb/4ast. Season ~47% FG. Strong game.
        // Bayesian: 0.55*0.533 + 0.45*0.470 = 0.505. Slight regression.
        { player:"Paolo Banchero", outlook:"good", projFgPct:0.49, ptsRange:[22,30], reason:"G1 was efficient star performance (53.3% FG, 23/9/4). Season ~47% — slight regression expected but Banchero is genuinely elite. Ausar's D-LEBRON (2.93) didn't suppress him. Multi-initiator ORL attack means he's never forced. Road game but ORL proved they handle DET's environment.", confidence:"high" },

        // Wagner: G1 7-13 (53.8%), 19pts (11 in Q4 closer). Season ~47% FG.
        // Bayesian: 0.55*0.538 + 0.45*0.470 = 0.508. Road closer.
        { player:"Franz Wagner", outlook:"good", projFgPct:0.48, ptsRange:[16,24], reason:"G1 clutch closer (11pts in Q4) on 53.8% FG. Season ~47% — slight regression but Wagner's shot creation in crunch time is real and sustainable. Two-initiator system with Banchero means DET can't key on him. Road game competence proven.", confidence:"high" },

        // WCJ: G1 8-9 (88.9%!!), 17pts/7reb/5ast. Season ~53% FG. Massive outlier.
        // Bayesian: 0.55*0.889 + 0.45*0.530 = 0.727. But cap at ~0.55 — 88.9% is absurd.
        { player:"Wendell Carter Jr.", outlook:"neutral", projFgPct:0.55, ptsRange:[10,16], reason:"G1 was extreme outlier (88.9% FG, 8-9). Season ~53% provides anchor. Heavy regression expected but WCJ dominated Duren in matchup. Efficient center who won't shoot 89% again but mid-50s is his range. Passing (5ast) is repeatable.", confidence:"high" },

        // Bane: G1 7-20 (35.0%), 1-8 3PT, 17pts. Season ~45% FG. Cold from 3.
        // Bayesian: 0.55*0.350 + 0.45*0.450 = 0.395. Bounce-back from 3 likely.
        { player:"Desmond Bane", outlook:"neutral-good", projFgPct:0.42, ptsRange:[14,22], reason:"G1 cold from 3 (1-8) but still scored 17pts. Season ~45% FG, ~38% 3PT. Playoff experience from Memphis tenure. Major 3PT bounce-back candidate. DET's perimeter D isn't elite enough to sustain 12.5% 3PT defense on him.", confidence:"medium" },

        // Suggs: G1 6-16 (37.5%), 3-10 3PT, 16pts/4ast/3stl. Season ~43% FG.
        // Bayesian: 0.55*0.375 + 0.45*0.430 = 0.400
        { player:"Jalen Suggs", outlook:"neutral", projFgPct:0.40, ptsRange:[12,18], reason:"G1 was busy (16pts/4ast/3stl/1blk) on slightly below-average shooting (37.5%). Season ~43% FG. Two-way guard whose defensive effort (3stl) is as valuable as scoring. Expect similar production — consistent but not spectacular.", confidence:"medium" },

        // Black: G1 3-7 (42.9%), 7pts/3reb/3ast/2blk. Bench contributor.
        { player:"Anthony Black", outlook:"neutral", projFgPct:0.42, ptsRange:[4,10], reason:"Versatile bench wing who provided solid G1 (42.9% FG, 2blk). Young player growing into playoff role. Defensive versatility is his calling card. Expect similar 6-8pts with defensive contributions.", confidence:"low" },

        // da Silva: G1 3-6 (50.0%), 7pts/4reb. Bench wing.
        { player:"Tristan da Silva", outlook:"neutral", projFgPct:0.45, ptsRange:[4,10], reason:"Efficient bench minutes (50% FG). Provides spacing and size off the bench. Expect similar modest contribution.", confidence:"low" }
      ]
    },
    // ── G3 Per-Player Offensive Outlook (Phase 30) ──
    // G1: ORL 112-101 at DET (UPSET). Cade 39pts but alone. ORL had 5 in double figures.
    // G3 at Kia Center (ORL home). DET's 11 straight home playoff losses extends to road.
    // Banchero (age 23) YOUTH BREAKOUT CANDIDATE at home. Single-initiator (Cade) vs multi-initiator (Banchero/Wagner/Bane).
    // DET #1 defense (107.2 DRtg) travels but road defense typically drops ~2pts.
    g3PlayerOutlook: {
      home: [ // DET (AWAY at Kia Center for G3)
        // Cade: G1 13-27 (48.1%), 3-8 3PT, 39pts career high. Season ~45% FG.
        // He IS the offense — single-initiator. On the road, secondary reads harder.
        // Bayesian: 0.40*(G1-G2 avg ~46%) + 0.30*(G2 recency) + 0.30*(0.45 season) = ~0.44. Road → 0.42
        { player:"Cade Cunningham", outlook:"neutral-good", projFgPct:0.42, ptsRange:[28,38], reason:"G1's 39pts career-high proves his star ceiling is real — but he did it alone (only Harris joined in double figures). On the ROAD at Kia Center, his shot creation gets harder: crowd noise disrupts secondary reads, and ORL's 'let Cade score, suffocate everyone else' scheme is REPEATABLE. Expect 30-34pts on slightly lower efficiency (~42% FG vs 48.1% G1). His 9.0 on/off is elite but meaningless if supporting cast can't score. Single-initiator burden is the model's biggest concern — road games magnify this problem. Still, Cade at 42% FG on 25+ shots = 30+pts.", confidence:"medium" },

        // Harris: G1 17pts. Second scorer. Road game.
        { player:"Tobias Harris", outlook:"neutral", projFgPct:0.44, ptsRange:[12,20], reason:"G1: 17pts as DET's only secondary scorer. If Bickerstaff can get Harris more involved in G3, DET's offense improves dramatically. Road game slight dip. His veteran experience (previous playoff runs with PHI/LAC) helps in hostile environments. Expect 14-18pts — needs to step up for DET to compete.", confidence:"medium" },

        // Duren: G1 8pts/7reb — WCJ dominated the matchup. All-Star talent underperforming.
        // Bickerstaff MUST adjust angles for Duren post-ups.
        { player:"Jalen Duren", outlook:"neutral", projFgPct:0.50, ptsRange:[10,18], reason:"G1 was disappointing: 8pts/7reb as WCJ's fronting scheme neutralized him. All-Star talent operating at half capacity. If Bickerstaff adjusts post-up angles and PnR variations (COTY should have film study ready), Duren could explode for 16-20pts. But if ORL repeats the fronting scheme with no DET counter, expect another 8-10pt game. Road game makes adjustments harder. The swing factor — DET needs Duren engaged to compete.", confidence:"medium" },

        // A. Thompson: Starting wing. Defensive assignment on Banchero.
        { player:"Ausar Thompson", outlook:"neutral", projFgPct:0.42, ptsRange:[8,14], reason:"Primary wing defender assigned to Banchero. Offensive contribution is secondary — his value is limiting Banchero's efficiency. Road game reduces his already modest scoring. Expect 10-12pts with defensive impact as the priority.", confidence:"medium" },

        // Robinson: Bench shooter. DET bench was 4-16 in G1.
        { player:"Duncan Robinson", outlook:"neutral", projFgPct:0.40, ptsRange:[6,14], reason:"DET bench collapsed in G1 (4-16 combined). Robinson's 3PT shooting is the key bench weapon — if he hits 3-4 threes, DET's offense opens up. Road game makes catch-and-shoot harder (crowd noise, unfamiliar sightlines). DET NEEDS Robinson to be the bench spark that was missing in G1.", confidence:"low" },

        // Stewart: First off bench. Physical big.
        { player:"Isaiah Stewart", outlook:"neutral", projFgPct:0.48, ptsRange:[6,12], reason:"Bench big who provides physicality and energy. Bickerstaff's closing lineup panic (using Stewart in untested lineups G1) raises trust concerns. If Bickerstaff trusts his rotation more, Stewart's 8-10pts and rebounding help. Road game physicality is his calling card.", confidence:"low" }
      ],
      away: [ // ORL (HOME at Kia Center for G3)
        // Banchero: G1 23pts (8-15 FG, 53.3%), 9reb, 4ast. Age 23.
        // YOUTH BREAKOUT CANDIDATE (Phase 29 active — exactly at age threshold).
        // AT HOME — expect his best game. Multi-initiator primary.
        { player:"Paolo Banchero", outlook:"good", projFgPct:0.50, ptsRange:[24,32], reason:"YOUTH BREAKOUT WATCH (age 23, EXACTLY at Phase 29 threshold). G1: 23pts on 53.3% FG — efficient and controlled. NOW AT HOME at Kia Center with crowd energy. Phase 29 youth breakout persistence: home + momentum from G1 win could unlock 28+ pts. His multi-initiator role (creates for himself AND others) makes him harder to stop than Cade's single-initiator game. ORL's offense flows through Banchero — at home, expect 26-30pts with playmaking.", confidence:"high" },

        // Wagner: G1 19pts (11 in Q4 closer). Clutch secondary star.
        { player:"Franz Wagner", outlook:"good", projFgPct:0.48, ptsRange:[18,24], reason:"G1 Q4 closer: 11pts in the 4th quarter to seal the win. His ability to create independently from Banchero gives ORL scheme versatility. At HOME, Wagner's mid-range game and driving ability thrive — familiar rims, crowd energy. Mosley may stagger Banchero/Wagner to always have a creator on floor. Expect 20-22pts with clutch potential.", confidence:"high" },

        // Bane: G1 17pts. Playoff experience (MEM). Starting guard.
        { player:"Desmond Bane", outlook:"neutral-good", projFgPct:0.44, ptsRange:[14,20], reason:"G1: 17pts as ORL's third scorer. Playoff experience from MEM is invaluable — he won't shrink in pressure moments. Home court helps his catch-and-shoot game. 2-5 3PT in G1 was below his standard — regression UP expected to ~38%. Expect 16-18pts with consistent contribution.", confidence:"medium" },

        // Suggs: G1 16pts/5reb/4ast/3stl/1blk. Defensive engine.
        { player:"Jalen Suggs", outlook:"neutral-good", projFgPct:0.44, ptsRange:[12,18], reason:"G1 was a two-way masterclass: 16pts/3stl/1blk while defending Cade full-time. Cade scored 39 BUT Suggs forced him into difficult shots and created turnovers. At HOME, Suggs' energy and defensive intensity amplify with crowd noise. His scoring (16pts) was a bonus — defensive impact is the primary value. Expect 14-16pts with continued elite perimeter D on Cade.", confidence:"medium" },

        // WCJ: G1 17pts/6reb/5ast — dominated Duren matchup.
        { player:"Wendell Carter Jr.", outlook:"neutral-good", projFgPct:0.52, ptsRange:[14,20], reason:"G1: dominated the Duren matchup with fronting scheme (held Duren to 8pts). 17pts/6reb/5ast — all-around excellence. At HOME, WCJ's interior dominance continues. If Bickerstaff adjusts Duren's angles, WCJ must adapt — but Mosley's scheme is repeatable. Expect 16-18pts with continued defensive impact on Duren.", confidence:"medium" },

        // Black: G1 7pts/3reb/3ast/2blk. Bench contributor.
        { player:"Anthony Black", outlook:"neutral", projFgPct:0.44, ptsRange:[6,12], reason:"Versatile bench wing. G1: solid two-way contribution (42.9% FG, 2blk). Home crowd amplifies young player energy. Expect 8-10pts with defensive versatility.", confidence:"low" },

        // da Silva: G1 7pts (3-6 FG, 50%). Bench wing.
        { player:"Tristan da Silva", outlook:"neutral", projFgPct:0.46, ptsRange:[4,10], reason:"Efficient bench minutes (50% FG G1). Provides spacing and size. Home court helps bench players. Expect similar 6-8pt contribution.", confidence:"low" }
      ]
    },
    games: [{num:1,result:"L",homeScore:101,awayScore:112,winner:"ORL",notes:"UPSET — #8 ORL wins at #1 DET. Cade 39pts career-high (13-27 FG, 3-8 3PT) but only Harris (17) joined him in double figures. DET bench 20pts on 4-16. Duren shut down: 8pts, 7reb — WCJ dominated matchup. ORL led wire-to-wire, 18-5 start. Banchero 23pts (8-15), 9reb, 4ast. Wagner 19pts (11 in Q4 closer). Bane 17pts, Suggs 16/5/4/3stl/1blk, WCJ 17/6/5. Five ORL players in double figures. DET 11 straight home playoff losses (0-8 at LCA since 2008). Closing lineup (Cade/Jenkins/Huerter/Stewart/Duren) had ZERO minutes together all season. Model picks: DET ML ❌ (HIGH confidence — WRONG), DET -8.5 ❌ (ORL won by 11)."},{num:2,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "BOS-PHI", conf: "East", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Derrick White", target:"Tyrese Maxey", dLebron:2.324, targetUsg:31.5, note:"G1 VALIDATED: White (D-LEBRON 2.324, Chaser role) held Maxey to 20pts on 8/20 FG. PHI has 1 initiator — White can fully commit to Maxey with no secondary creator to worry about. George's 4.8 clutch rating means he doesn't take pressure off Maxey. This is the bracket's most impactful defensive matchup." },
      awayDefOnHome: { defender:"VJ Edgecombe", target:"Jaylen Brown", dLebron:0.08, targetUsg:31.0, note:"Rookie (D-LEBRON 0.08) vs Finals MVP (28.7 PPG). Massive mismatch. Brown has Tatum, White, Pritchard as co-creators (3 initiators) — even if Edgecombe slows Brown slightly, BOS has endless alternatives. G1 CONFIRMED: Brown scored 26 pts including 16 in Q3 (7-of-9)." },
      secondaryMatchups: [
        { defender:"Brown + Tatum", target:"Paul George", note:"G1: George looked disconnected — suspension-rust visible. BOS can afford to let Brown/Tatum take turns on PG since he's a 4.8 clutch scorer who disappears in big moments. George hasn't been the decisive star PHI needs since joining. If he heats up from 3 (41.5% post-suspension), BOS adjusts by going under screens" },
        { defender:"Queta", target:"Andre Drummond", note:"Queta's D-LEBRON 2.723 vs Drummond's limited offense = total interior mismatch. Queta blocks shots, Drummond can't space floor. BOS's five-out offense pulls Drummond away from the rim where he's useless. G1 confirmed: Drummond overwhelmed" },
        { defender:"Mazzulla five-out scheme", target:"PHI interior defense", note:"BOS shot 50% FG and 11 3PM in G1 because PHI has no rim protector without Embiid. BOS's five-out spacing creates open looks systematically — this is a SCHEMATIC advantage that coaching alone can't fix. PHI's DRtg balloons to ~115 without Embiid" },
        { defender:"Oubre + Edgecombe", target:"Pritchard", note:"PHI's best defensive option on Pritchard is Oubre or Edgecombe's athleticism. But Pritchard is in BOS's closing lineup — his 37.7% 3PT + 5.2 APG creation makes him nearly impossible to take away without leaving Brown/Tatum open" }
      ]
    },
    homeTeam: {
      name: "Celtics", city: "Boston", abbr: "BOS", seed: 2, record: "56-26",
      systemBonus: 2.0, // elite system
      playoffPedigree: 2, // 2024 champs
      offStyle: "Five-out motion with Brown/Tatum dual star creation. Multiple secondary initiators (White, Pritchard). Best off-ball environment in the league.", initiators: 3,
      color: "#007A33", color2: "#BA9653",
      advStats: { ortg:118.5, drtg:109.2, netRtg:9.3, pace:98.2, ts:59.1, efg:56.4, tov:12.4, reb:51.2, ortgRk:2, drtgRk:4, clutchNetRtg:6.1, last10:"7-3", fgPct:53.4, threePct:38.1, ftPct:80.2, orbPct:25.0 },
      players: [
        { name:"Jaylen Brown", pos:"SG", rating:88, ppg:28.7, rpg:6.9, apg:5.1, fgp:47.7, per:25.8, ts:61.2, epm:5.8, bpm:6.5, ws48:.205, onOff:8.2, clutch:8.0, vorp:4.9, usg:31.0, injury:null, lebron:1.515, oLebron:1.865, dLebron:-0.351, war:6.082, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"MVP-LEVEL season carrying BOS with Tatum out. 28.7/6.9/5.1 — improved as playmaker (5.1 APG up from 3.6). Finals MVP. 8.0 clutch rating elite. G1: 26pts including 7-9 Q3 explosion (16pts in quarter). .347 3P% is a concern but attacks mismatches relentlessly", baseRating:88, starCeiling:1, injuryRisk:0, playoffAscension:1.0 },
        { name:"Jayson Tatum", pos:"SF", rating:85, ppg:21.8, rpg:10.0, apg:5.3, fgp:41.1, per:23.5, ts:59.8, epm:5.2, bpm:6.0, ws48:.188, onOff:7.5, clutch:7.5, vorp:4.1, usg:27.5, injury:"Recently returned from injury", lebron:3.887, oLebron:3.047, dLebron:0.841, war:2.055, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"Only 17 games post-Achilles surgery but G1 ERASED all rust concerns: 25/11/7 dominant return. Per Fadeaway World: 41.1% FG, 32.9% 3PT in limited action — efficiency still building but his all-around impact (10.0 RPG, 5.3 APG) changes BOS ceiling. Adding him back to Brown makes BOS a true dual-star team again. Not on injury report for G2", baseRating:91, starCeiling:2, injuryRisk:0.3, playoffAscension:0.8, activeInjury:{type:"Achilles recovery",severity:0.15,note:"G1: 25pts/11reb/7ast — dominant return. Not on injury report. Said he 'feels better than expected.' Only 17 games this season post-Achilles surgery. Conditioning improving but G1 showed he's ready. Severity downgraded from 0.2 to 0.15 post-G1."} },
        { name:"Derrick White", pos:"PG", rating:76, ppg:16.5, rpg:4.4, apg:5.3, fgp:39.4, per:18.2, ts:58.8, epm:3.5, bpm:3.8, ws48:.152, onOff:5.5, clutch:6.8, vorp:3.0, usg:23.8, injury:null, lebron:4.594, oLebron:2.271, dLebron:2.324, war:11.43, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"Per Fadeaway World: 16.5/4.4/5.3 with 1.1 SPG + 1.3 BPG — rare guard production. 32.7% 3PT is down but defensive numbers are elite. D-LEBRON 2.324 / WAR 11.43 = best defensive guard in NBA. G1: held Maxey to 8-20 FG full-time assignment. Maxey won't go 8-20 twice but White's scheme is PROVEN and repeatable. 6.8 clutch rating", baseRating:76 },
        { name:"Payton Pritchard", pos:"PG", rating:73, ppg:17.0, rpg:3.9, apg:5.2, fgp:46.4, per:17.2, ts:59.5, epm:2.2, bpm:2.0, ws48:.128, onOff:3.5, clutch:6.0, vorp:2.0, usg:24.0, injury:null, lebron:1.921, oLebron:2.54, dLebron:-0.618, war:7.008, offRole:"Primary Ball Handler", defRole:"Chaser", injuryRisk:0.2, activeInjury:{type:"plantar fasciitis",severity:0.2,note:"Left foot plantar fasciitis. G1: Played and contributed in 123-91 rout. Chronic condition — tends to flare up with high-intensity play. Low severity but monitor across series."},
          matchupNote:"Per Fadeaway World: leads bench with STARTER-LEVEL production — 17.0/3.9/5.2, 46.4% FG, 37.7% 3PT. Creates offense, runs second unit, and closes games. In CLOSING lineup (Pritchard/White/Brown/Tatum/Queta). Secondary creation fills Holiday's role perfectly", baseRating:73 },
        { name:"Neemias Queta", pos:"C", rating:67, ppg:10.2, rpg:8.4, apg:1.0, fgp:65.3, per:16.5, ts:62.5, epm:1.0, bpm:0.8, ws48:.105, onOff:2.2, clutch:4.5, vorp:1.1, usg:18.8, injury:null, lebron:3.696, oLebron:0.972, dLebron:2.723, war:7.365, offRole:"Roll + Cut Big", defRole:"Anchor Big",
          matchupNote:"Per Fadeaway World: 10.2/8.4 on 65.3% FG + 1.3 BPG — major development as starting C. Physical rim protector, rebounder, and energy. In both starting AND closing lineups. D-LEBRON 2.723 / WAR 7.365 = elite defensive anchor. Gives BOS physical presence inside that Porzingis departure threatened", baseRating:67 },
        { name:"Nikola Vucevic", pos:"C", rating:64, ppg:9.7, rpg:6.6, apg:2.0, fgp:43.9, per:14.5, ts:55.0, epm:0.5, bpm:0.0, ws48:.075, onOff:1.0, clutch:4.0, vorp:0.8, usg:19.0, injury:null, lebron:0.593, oLebron:0.368, dLebron:0.225, war:3.48, offRole:"Versatile Big", defRole:"Mobile Big",
          matchupNote:"Per Fadeaway World: 9.7/6.6/2.0, 43.9% FG, 34.0% 3PT — reduced role from CHI star to BOS bench big. Provides different look with floor-spacing ability. Matchup-dependent minutes behind Queta. Rating corrected from 68 to 64 reflecting diminished role", baseRating:64 },
        { name:"Sam Hauser", pos:"SF", rating:62, ppg:9.2, rpg:3.9, apg:1.5, fgp:41.9, per:11.2, ts:58.8, epm:0.2, bpm:-0.2, ws48:.065, onOff:0.5, clutch:4.0, vorp:0.5, usg:18.2, injury:null, lebron:0.587, oLebron:0.442, dLebron:0.144, war:3.693, offRole:"Off Screen Shooter", defRole:"Helper",
          matchupNote:"Per Fadeaway World: STARTER — 9.2/3.9/1.5, 41.9% FG, 39.3% 3PT. His spacing forces defenses to stay attached, opening floor for Brown/Tatum. Clear role executed with consistency. NOT in closing lineup (Pritchard replaces him). Rating bumped to 62 as a starter providing critical spacing", baseRating:62 },
        { name:"Luka Garza", pos:"C", rating:55, ppg:8.1, rpg:4.1, apg:0.5, fgp:57.7, per:13.0, ts:60.0, epm:0.0, bpm:-0.5, ws48:.062, onOff:0.0, clutch:3.5, vorp:0.2, usg:15.0, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Versatile Big", defRole:"Helper",
          matchupNote:"Per Fadeaway World: 8.1/4.1, 57.7% FG, 43.3% 3PT — shooting from C position creates spacing advantages. Efficient in limited minutes. Provides different look off bench behind Queta/Vucevic", baseRating:55 },
        { name:"Baylor Scheierman", pos:"SF", rating:54, ppg:5.2, rpg:2.8, apg:1.0, fgp:42.0, per:9.0, ts:55.0, epm:-0.3, bpm:-0.8, ws48:.045, onOff:0.0, clutch:3.0, vorp:0.2, usg:14.0, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Rookie wing providing depth shooting. 15 min in G1 with 5pts/2reb/1blk. Capable 3PT shooter who can space the floor in bench units", baseRating:54 },
        { name:"Jordan Walsh", pos:"SF", rating:53, ppg:4.0, rpg:2.5, apg:1.2, fgp:40.0, per:8.5, ts:52.0, epm:-0.5, bpm:-1.0, ws48:.035, onOff:-0.5, clutch:3.0, vorp:0.1, usg:13.0, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Versatile Wing", defRole:"Wing Stopper",
          matchupNote:"Athletic wing who provides defensive versatility off bench. 15 min in G1 with 5pts/2reb/2ast. Energy and length off the bench", baseRating:53 }
      ],
      synergy: [
        { players:["White","Hauser","Brown","Tatum","Queta"], score:82, note:"Per Fadeaway World STARTING 5: Hauser's 39.3% 3PT spaces floor, White anchors perimeter D, Queta rim protects. Balance across every position. G1: dominated from tip-off, 50% FG team-wide" },
        { players:["Pritchard","White","Brown","Tatum","Queta"], score:86, note:"CLOSING 5 per Fadeaway World. Pritchard replaces Hauser for secondary creation + scoring. Multiple ways to win — fast or slow, ISO or motion. Championship DNA + depth. Best crunch-time unit in East" },
        { players:["Pritchard","Hauser","Vucevic","Garza","Brown"], score:68, note:"BENCH/REST lineup when resting Tatum/White. Shooting-heavy: Pritchard 37.7%, Hauser 39.3%, Garza 43.3% 3PT. Floor spacing off the charts but defensively vulnerable" },
        { players:["White","Brown","Tatum","Queta","Vucevic"], score:75, note:"BIG lineup: Queta + Vucevic dual-big for rebounding advantage. Deploy if PHI goes big with Drummond + Barlow/Bona. Vucevic stretches floor from 5" }
      ]
    },
    awayTeam: {
      name: "76ers", city: "Philadelphia", abbr: "PHI", seed: 7, record: "45-37",
      systemBonus: 0,
      playoffPedigree: 0,
      offStyle: "G2 proved dual-initiator capability: Edgecombe breakout (30pts, 12-20 FG, 6-10 3PT) as co-creator with Maxey. PHI's offense transforms with two creators — harder to scheme against.", initiators: 2, // Maxey + Edgecombe (G2 PROVED — Edgecombe 30pts breakout)
      color: "#006BB6", color2: "#ED174C",
      advStats: { ortg:113.2, drtg:112.5, netRtg:0.7, pace:97.8, ts:56.8, efg:53.1, tov:13.5, reb:49.5, ortgRk:16, drtgRk:17, clutchNetRtg:0.8, last10:"5-5", fgPct:50.1, threePct:33.2, ftPct:75.6, orbPct:23.6 },
      players: [
        { name:"Tyrese Maxey", pos:"PG", rating:84, ppg:28.3, rpg:4.1, apg:6.6, fgp:45.5, per:25.2, ts:60.5, epm:5.5, bpm:6.0, ws48:.185, onOff:8.0, clutch:7.8, vorp:4.7, usg:31.5, injury:null, lebron:2.933, oLebron:3.584, dLebron:-0.651, war:8.951, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"Star. 30 PPG in 4 games vs BOS. Elite speed. But White held him below average in 2 of 4 meetings", baseRating:84, starCeiling:1, injuryRisk:0 },
        { name:"Joel Embiid", pos:"C", rating:0, ppg:26.9, rpg:7.7, apg:3.9, fgp:49.2, per:29.2, ts:64.5, epm:7.8, bpm:9.0, ws48:.250, onOff:13.2, clutch:8.8, vorp:6.2, usg:33.0, injury:"OUT — post-appendectomy recovery (targeting mid-to-late first round)", lebron:1.736, oLebron:2.452, dLebron:-0.716, war:3.154, offRole:"Shot Creator", defRole:"Anchor Big",
          matchupNote:"Emergency appendectomy Apr 9. OUT G1 (BOS won 123-91). Average recovery 2-5 weeks — hasn't practiced with teammates yet. Coach Nurse preparing without him for 'at least the opening games.' If series reaches G7 (May 2), possible return 23 days post-surgery. Conditioning and rust will severely limit initial impact.", baseRating:92, starCeiling:2, injuryRisk:1.0 },
        { name:"Paul George", pos:"SF", rating:72, ppg:17.3, rpg:5.3, apg:3.6, fgp:44.2, per:17.2, ts:57.5, epm:2.0, bpm:1.8, ws48:.115, onOff:2.2, clutch:4.8, vorp:2.2, usg:24.5, injury:"Returning from 25-game suspension", lebron:1.746, oLebron:1.277, dLebron:0.469, war:2.989, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Per Fadeaway World: 17.3/5.3/3.6. More productive after 25-game suspension allowed him to become fully healthy. PHI can't win if George isn't producing consistently — all eyes on the 37-year-old. In 10 post-suspension games: 21.0 PPG, 41.5% 3PT — looking sharp. G1: suspension-rust still visible, looked disconnected from offensive system. 'I've had my share of playing Boston.' 4.8 clutch rating remains a concern in big moments", baseRating:75 },
        { name:"VJ Edgecombe", pos:"SG", rating:70, ppg:16.0, rpg:5.6, apg:4.2, fgp:44.2, per:16.5, ts:55.8, epm:0.5, bpm:0.2, ws48:.078, onOff:1.2, clutch:4.5, vorp:0.9, usg:21.2, injury:null, lebron:0.001, oLebron:-0.079, dLebron:0.08, war:4.046, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Per Fadeaway World: BREAKOUT rookie — 16.0/5.6/4.2. Cemented spot as Maxey's long-term backcourt partner. Makes up for Maxey's defensive shortcomings with relentless pace and motor. Plays interchangeably with Oubre. In CLOSING lineup. Rating bumped 66→70 reflecting much bigger season than model had. G1: struggled but rookie playoff jitters expected", baseRating:70 },
        { name:"Kelly Oubre Jr.", pos:"SF", rating:64, ppg:14.1, rpg:5.0, apg:1.8, fgp:44.5, per:13.5, ts:55.5, epm:0.2, bpm:-0.3, ws48:.068, onOff:0.5, clutch:4.0, vorp:0.6, usg:20.0, injury:null, lebron:-0.5, oLebron:-0.2, dLebron:-0.3, war:1.0, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"Per Fadeaway World: STARTER — 14.1/5.0, plays interchangeably with Edgecombe. In CLOSING lineup. Provides wing scoring and physicality. Model was MISSING this player entirely — he's PHI's 4th scoring option behind Maxey/George/Edgecombe", baseRating:64 },
        { name:"Andre Drummond", age:32, pos:"C", rating:58, ppg:6.4, rpg:8.4, apg:1.2, fgp:54.5, per:14.2, ts:56.5, epm:-0.2, bpm:-0.5, ws48:.068, onOff:-0.5, clutch:3.5, vorp:0.3, usg:16.5, injury:null, lebron:-0.2, oLebron:-0.415, dLebron:0.216, war:1.743, offRole:"Roll + Cut Big", defRole:"Anchor Big",
          matchupNote:"Per Fadeaway World: 6.4/8.4 — starting C with Embiid out. Rebounds but limited offense and defense vs BOS's five-out spacing. G1: overwhelmed by BOS motion offense. Rating corrected 60→58", baseRating:58 },
        { name:"Dominick Barlow", pos:"PF", rating:58, ppg:7.7, rpg:4.8, apg:1.5, fgp:47.5, per:12.5, ts:55.5, epm:0.0, bpm:-0.2, ws48:.065, onOff:0.2, clutch:4.0, vorp:0.6, usg:18.8, injury:null, lebron:-0.903, oLebron:-1.404, dLebron:0.502, war:1.647, offRole:"Athletic Finisher", defRole:"Wing Stopper",
          matchupNote:"Per Fadeaway World: 7.7/4.8 — bench big behind George at PF. Part of big man rotation (Barlow/Bona/Drummond). Athletic PF with length, still developing", baseRating:58 },
        { name:"Quentin Grimes", pos:"SG", rating:60, ppg:13.4, rpg:3.6, apg:3.3, fgp:43.0, per:13.5, ts:55.0, epm:-0.2, bpm:-0.5, ws48:.060, onOff:0.0, clutch:3.8, vorp:0.4, usg:19.5, injury:null, lebron:-1.532, oLebron:-0.421, dLebron:-1.111, war:1.286, offRole:"Movement Shooter", defRole:"Chaser",
          matchupNote:"Per Fadeaway World: FIRST name off bench — 13.4/3.6/3.3. Like-for-like fit behind Edgecombe/Oubre. Rating bumped 54→60. On expiring contract — extra motivation. Versatile swingman who can match up across wings", baseRating:60 },
        { name:"Justin Edwards", pos:"SF", rating:52, ppg:6.0, rpg:1.5, apg:1.3, fgp:42.0, per:9.5, ts:53.0, epm:-0.5, bpm:-1.0, ws48:.045, onOff:-0.5, clutch:3.5, vorp:0.1, usg:14.5, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"Per Fadeaway World: 6.0/1.5/1.3. Shone in extended minutes during George's 25-game suspension. Role-playing forward Nurse may rely on. Option to replace Edgecombe or Oubre on rough nights", baseRating:52 },
        { name:"Adem Bona", pos:"C", rating:48, ppg:4.8, rpg:4.3, apg:0.5, fgp:58.6, per:12.0, ts:60.0, epm:-0.5, bpm:-1.0, ws48:.060, onOff:-1.0, clutch:2.5, vorp:0.0, usg:14.0, injury:null, lebron:-0.914, oLebron:-2.059, dLebron:1.145, war:1.195, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Athletic backup C behind Drummond/Embiid. Rim runner with energy and shot-blocking", baseRating:48 }
      ],
      synergy: [
        { players:["Maxey","Edgecombe","Oubre","George","Drummond"], score:60, note:"G1 ACTUAL starting 5 (Embiid OUT). Per Fadeaway World this is the playoff starting lineup. ORtg drops to ~108 without Embiid, DRtg balloons to ~115. Drummond overwhelmed by BOS five-out. Maxey must score 35+ to compete" },
        { players:["Maxey","Edgecombe","Oubre","George","Embiid"], score:78, note:"FULL-STRENGTH closing 5 per Fadeaway World (if Embiid returns). Embiid's 26.9/7.7 + Maxey 28.3 = elite dual-star. Would completely transform series — BOS would need to play traditional lineups. Not available G2" },
        { players:["Grimes","Barlow","Bona","Edwards","Drummond"], score:48, note:"BENCH UNIT: Grimes 13.4 PPG leads but depth is thin. No backup PG (40-year-old Lowry is emergency only). BOS bench crushed this group in G1 — 6 BOS players scored 10+" },
        { players:["Maxey","Grimes","George","Barlow","Drummond"], score:58, note:"STAGGER lineup: Maxey + George without Edgecombe/Oubre. George as secondary creator alongside Maxey. Nurse may use this to keep a star on court at all times" }
      ]
    },
    externalFactors: [
      { team:"PHI", player:"Joel Embiid", desc:"Emergency appendectomy Apr 9. OUT through at least G4 (targeting Apr 27 return at earliest, 18 days post-surgery). Without him: -13.2 on/off swing. PHI's interior defense remains catastrophic — Drummond starting C is a structural liability vs BOS five-out.", impact:-15, category:"injury",
        evidence:"Google AI Overview confirms Embiid status 'still uncertain following an emergency appendectomy.' Average appendectomy recovery 2-5 weeks. Apr 27 earliest return would be G4. Series could be over by then.",
        sources:["Google AI Overview: BOS-PHI G3 search results"], verdict:"verified" },
      { team:"PHI", player:"Paul George", desc:"25-GAME SUSPENSION (Jan 31) rust CLEARING. G1: 17pts (4-8 FG, 50%). G2: 19pts (7-13 FG, 53.8%). Trending upward — 2-game 52.4% FG above 44.2% season baseline. Rhythm returning.", impact:-2, category:"personal",
        evidence:"G2 box score shows 7-13 FG (53.8%), 3-5 3PT. Per Yahoo Sports/AOL article: George's efficiency trending right. Still not aggressive alpha PHI needs but no longer disconnected.",
        sources:["ESPN Box Score: espn.com/nba/boxscore/_/gameId/401869396"], verdict:"verified" },
      { team:"BOS", player:"Jayson Tatum", desc:"ACHILLES RECOVERY VOLATILITY confirmed: G1 dominant (25/11/7, 52.9% FG), G2 mediocre (19pts, 42.1% FG, 5 fouls in 32min). Game-to-game ceiling/floor gap is wider than pre-injury. Phase 28 recovery volatility applies.", impact:0, category:"injury",
        evidence:"G2 box score: 8-19 FG (42.1%), 5 personal fouls limiting him to 32 minutes. G1 was 9-17 (52.9%). The variance band has widened post-Achilles — some games he's dominant, others limited.",
        sources:["ESPN Box Score: espn.com/nba/boxscore/_/gameId/401869396"], verdict:"verified" },
      { team:"PHI", player:"VJ Edgecombe", desc:"BACK INJURY — took hard fall on back early in G2, played through pain to score 30pts/10reb. Status for G3 unclear. If limited, PHI loses their newly-discovered 2nd initiator.", impact:-3, category:"injury",
        evidence:"Google search results explicitly state Edgecombe was 'playing through pain after taking a hard fall on his back early in the game' during G2. He still produced 30/10 but injury severity unknown for G3.",
        sources:["Google Search Results: BOS-PHI G2 takeaways"], verdict:"verified" },
      { team:"PHI", player:null, desc:"BROKE 40-YEAR PLAYOFF DROUGHT vs BOS. Won G2 111-97 on the road — first playoff win vs BOS since 1982. Psychological barrier SHATTERED. Series tied 1-1. Confidence transformed.", impact:4, category:"motivation",
        evidence:"PHI 111, BOS 97 in G2 at TD Garden. Per Yahoo Sports/AOL: 'Philadelphia evened the series in Game 2 Tuesday night at TD Garden with a convincing 111-97 victory.'",
        sources:["Yahoo Sports/AOL: 76ers-Celtics takeaways article"], verdict:"verified" },
      { team:"BOS", player:null, desc:"Championship pedigree remains. Brown averaging 31.0 PPG through 2 games — MVP-level. Mazzulla adj rating 8 means he WILL scheme for Edgecombe in G3 film session. BOS 3PT% will regress UP from 26% team-wide collapse.", impact:4, category:"motivation" },
      { team:"PHI", player:null, desc:"PHI's wing defense weakness exposed by Yahoo Sports analysis: 'only 35-year-old George and Oubre' to stop Brown/Tatum. Bench options (Edwards, Barlow) provide no defensive resistance on the wing.", impact:-3, category:"chemistry",
        evidence:"Yahoo Sports/AOL article notes: 'Their advantage was on the wing, where Philly only has 35-year-old George and Oubre to stop them.'",
        sources:["Yahoo Sports/AOL: 76ers-Celtics takeaways article"], verdict:"verified" },
      { team:"PHI", player:null, desc:"Backup PG void persists — 40-year-old Kyle Lowry (1.2 PPG) only option. But Edgecombe sustained PHI offense when Maxey/George rested in G2 Q3, partially mitigating this weakness.", impact:-2, category:"chemistry" },
      { team:"BOS", player:null, desc:"BOS depth advantage is real but FRAGILE. G1: 6 players scored 10+ (depth structural). G2: team shot 26% from 3PT, depth collapsed. When BOS's team shooting correlates negatively, their depth advantage evaporates.", impact:2, category:"chemistry" },
      { team:"PHI", player:null, desc:"NURSE G2 MASTERCLASS validated — redesigned offense from G1's 91pts to G2's 111pts. Per Google AI Overview: emphasized faster ball movement, targeted Queta with speed mismatches, altered rotation for more shooting (4-23 G1 → 19-39 G2). His adj rating 8 is PROVEN.", impact:4, category:"coaching",
        evidence:"Google AI Overview details: 'Nurse emphasized faster ball movement and emergency actions to counter Boston's paint-packing defense. Actively targeted Celtics center Neemias Queta with Tyrese Maxey and VJ Edgecombe to exploit speed mismatches.'",
        sources:["Google AI Overview: BOS-PHI G3 search results"], verdict:"verified" },
      { team:"BOS", player:null, desc:"MAZZULLA COUNTER-ADJUSTMENT EXPECTED for G3. Per Google AI Overview: will scheme specifically for Edgecombe (hard traps, switching, forcing rookie into ISO decisions). Per MSN: center rotation debate — Nurse must decide between Drummond/Bona. Mazzulla's adj 8 means real tactical response.", impact:3, category:"coaching",
        evidence:"Google AI Overview G3 priorities: Mazzulla will focus on Edgecombe specifically. MSN article headlined 'Nick Nurse must start Andre Drummond over Adem Bona.' SI article: 'Three Philadelphia 76ers Adjustments the Boston Celtics Should Anticipate.'",
        sources:["Google AI Overview","MSN: nick-nurse-baffling-decision","SI: three-philadelphia-76ers-adjustments"], verdict:"verified" },
      { team:"PHI", player:null, desc:"HOME COURT RETURNS — G3 and G4 at Philadelphia (Xfinity Mobile Arena). PHI was 24-17 at home this season. First home game of the series — crowd energy after road upset is a measurable boost (~2.5pts in R1).", impact:3, category:"motivation" },
      { team:"PHI", player:null, desc:"3PT REGRESSION WARNING: PHI shot 48.7% from 3PT in G2 (19-39) — massively above 33.2% season baseline. Maxey+Edgecombe combined 11 3s. Will regress DOWN toward ~35% in G3. Per Nurse: team 'passed up open shots' in G1 hesitating after poor start — confidence issue resolved, but 49% is unsustainable.", impact:-2, category:"performance",
        evidence:"Yahoo Sports/AOL: 'Sixers head coach Nick Nurse even suggested his team had passed up some open shots in their blowout loss, hesitating after a poor shooting start. That wasn't a problem in Game 2.' PHI season 3PT: 33.2%.",
        sources:["Yahoo Sports/AOL: 76ers-Celtics takeaways article"], verdict:"verified" }
    ],
    game1: {
      spread: "BOS -12.5", moneyline: "BOS -625 / PHI +450", ou: "O/U 211.5",
      pick: "BOS", confidence: "high", projScore: "BOS 112 — PHI 98",
      reasoning: "The biggest spread of any Game 1, and justified. Without Embiid, Philly's interior presence vanishes — Boston will attack the paint relentlessly with Brown and Tatum. Maxey is brilliant (30 PPG vs BOS) but White's on-ball defense held him below average in half their meetings. Paul George's 4.8 clutch rating is a red flag when you're the underdog needing big moments. Brown's ascension to 28.7 PPG as #1 gives Boston a clearer hierarchy. The 0-6 since 1982 psychological weight is real. Only way PHI competes: Maxey goes nuclear (35+) AND George shows up. Low probability parlay.",
      prosHome: ["Brown 28.7 PPG as #1, +9.3 NetRtg", "White's defense on Maxey — held him 2/4 times", "+6.1 clutch NetRtg, championship DNA", "Pritchard emergence fills scoring void"],
      consHome: ["Tatum returning from injury — rust", "Maxey scored 30 PPG vs them", "Embiid could return mid-series", "No Porzingis anymore — interior depth different"],
      prosAway: ["Maxey 28.3 PPG, 60.5 TS% — elite", "30 PPG in head-to-head meetings", "George's ceiling is an All-Star", "Edgecombe rookie energy"],
      consAway: ["No Embiid — -13.2 on/off swing", "0-6 vs BOS in playoffs since 1982", "George 4.8 clutch rating — disappears", "Drummond starting C is a massive downgrade"]
    },
    game2: {
      spread: "BOS -13.5", moneyline: "BOS -750 / PHI +500", ou: "O/U 210.5",
      pick: "BOS", confidence: "high", projScore: "BOS 109 — PHI 103",
      schedule: "Tue Apr 21 — 7:30 PM ET — TNT",
      reasoning: "BACKTEST-CALIBRATED PICK: BOS (high confidence). G1's 32-pt blowout (123-91) was even more dominant than our projected 14-pt margin. The 2025 backtest showed teams winning G1 by 20+ in R1 went on to win G2 at 88%. Mazzulla is 4-0 in Game 1s — his system doesn't need adjustment, it's PHI that must solve BOS's five-out spacing. White's full-time Maxey assignment (8-20 FG) is a proven schematic lock. PHI went 4-23 from 3PT (17.4%) — while some shooting regression to the mean is expected (they'll shoot better), BOS's defensive scheme CAUSED many of those misses. Nurse historically improves between games (G2 adjustments were his strength in TOR), but he's limited by roster: no Embiid, Drummond is overmatched, and George's suspension-rust won't clear in 2 days. Brown's ascension as #1 (26pts, 7-9 Q3) is sustainable, and Tatum showed zero rust (25/11/7). The 0-7 since 1982 psychological weight now compounds. Only scenario for PHI: Maxey goes nuclear (35+) AND BOS shoots below 40% — a ~8% probability parlay.",
      g1Adjustments: [
        "BOS WON G1 123-91 — 32-pt blowout, most dominant G1 performance in 2026 playoffs",
        "MAZZULLA 4-0 IN G1s: No coaching adjustment needed — PHI must solve BOS, not the reverse",
        "White-on-Maxey assignment PROVEN: 8-20 FG. Nurse must create mismatches to free Maxey",
        "PHI 3PT REGRESSION: 4-23 (17.4%) will improve, but BOS defensive scheme caused many misses",
        "Tatum showed ZERO rust: 25/11/7 in return — removes the last uncertainty from BOS",
        "George suspension-rust needs time — may not fully clear by G2",
        "NURSE G2 HISTORY: In Toronto, Nurse's G2 adjustments were elite — he found counters. But roster limits creativity here",
        "Embiid still OUT — no timeline for return. PHI's interior defense remains catastrophic"
      ],
      prosHome: ["32-pt G1 win — momentum and confidence at peak", "Mazzulla's system doesn't need adjustment — execution was perfect", "White-Maxey defensive lock is proven and repeatable", "Tatum rust-free: 25/11/7 proves full reintegration", "6 players scored 10+ — depth is structural, not variance", "+6.1 clutch NetRtg for insurance if game tightens"],
      consHome: ["PHI 3PT% will regress upward — they won't shoot 17.4% again", "Nurse historically adjusts well between games", "Complacency risk after 32-pt blowout", "Maxey is too talented to go 8-20 twice"],
      prosAway: ["Nurse's G2 adjustment history is strong (Toronto tenure)", "Maxey shooting regression — 8-20 won't repeat, elite talent finds a way", "George will be further from suspension rust — rhythm should improve", "PHI competitive pride — 32-pt loss will fuel urgency"],
      consAway: ["No Embiid — structural problem unchanged", "0-7 vs BOS in playoffs since 1982 — psychological weight compounds", "Drummond starting C is unsolvable without Embiid", "BOS system is schematic, not effort-based — harder to adjust against"]
    },
    game3: {
      spread: "BOS -7.5", moneyline: "BOS -340 / PHI +270", ou: "O/U 215.5",
      pick: "BOS", confidence: "medium", projScore: "BOS 112 — PHI 106",
      schedule: "Fri Apr 24 — 7:00 PM ET — Prime Video",
      reasoning: "RESEARCH-BACKED PICK: BOS (medium confidence). After deep-dive research via Chrome (Yahoo Sports G2 recap, Google AI Overview of Nurse adjustments, sportsbook lines), the evidence points to BOS reasserting control in G3 despite PHI's home court. Here's why:\n\n(1) 3PT VARIANCE REGRESSION IS THE DOMINANT FACTOR — PHI shot 48.7% from 3 in G2 (19-39) vs 33.2% season baseline. BOS shot 26% (13-50) vs 38% season baseline. BOTH teams will regress toward their means in G3. The NET regression massively favors BOS: BOS gains ~+12% toward baseline while PHI loses ~-15%. Per Yahoo Sports, Nurse acknowledged PHI 'passed up open shots' in G1 due to hesitation — G2's confidence fix was real, but 49% from 3 is not a repeatable baseline. Realistic G3 projections: PHI ~35% 3PT, BOS ~36% 3PT. That erases 80% of PHI's G2 scoring advantage.\n\n(2) MAZZULLA COUNTER-ADJUSTMENT (adj 8) — Per Google AI Overview: Mazzulla will scheme SPECIFICALLY for Edgecombe in G3 after film study. Expect hard traps on Edgecombe P&R, switching assignments to put bigger defenders on him, and forcing the 20-year-old rookie into uncomfortable ISO decisions. Per SI: 'Three Philadelphia 76ers Adjustments the Boston Celtics Should Anticipate' — BOS's coaching staff is elite at in-series adaptation. G2 was the FIRST game Mazzulla lost in 2026 playoffs (was 4-0 in G1s). He'll respond.\n\n(3) EDGECOMBE BACK INJURY + REGRESSION — Per Google search results, Edgecombe was 'playing through pain after a hard fall on his back early in the game' during G2. His 30pts/10reb was heroic but: (a) injury status for G3 is unknown, (b) his 60% FG and 60% 3PT will regress dramatically, (c) Mazzulla's film session will target him. Realistic G3 projection: 16-22pts at ~42% FG, not 30pts at 60%.\n\n(4) BROWN/TATUM ARE STILL THE BEST PLAYERS IN THE SERIES — Per Yahoo Sports: Brown totaled 36pts in a LOSS, and 'they were the two best players on the floor.' BOS's stars produced elite numbers (Brown 50% FG, 36pts; Tatum near triple-double 19/14/9) even in a loss. PHI's wing defense weakness (per Yahoo: 'only 35-year-old George and Oubre') can't contain them.\n\n(5) PHI HOME COURT HELPS BUT ISN'T ENOUGH — PHI was 24-17 at home (~2.5pt boost in R1). But BOS was 31-10 on the road. Sportsbook line: BOS -7.5 per BetMGM. Polymarket: BOS 77% implied probability. The market still heavily favors BOS even in PHI.\n\nCOUNTER-ARGUMENT FOR PHI: Nurse's adjustment rating (8) is PROVEN after G2 masterclass — he redesigned PHI's offense (+20pts from G1 to G2). Edgecombe as 2nd initiator is a structural change, not just variance. Home crowd after road upset fuels momentum. George is trending up (53.8% FG). But the 3PT regression math overwhelms these factors. BOS's talent advantage is structural; PHI's G2 was variance-enhanced.\n\nTURNOVERS: PHI improved ball movement in G2 (20+ assists vs 13 in G1). Expect both teams ~12-14 TOs. PHI's improvement here is REAL (Nurse's tactical change), but BOS is typically a low-TO team.\n\nROLE FLEXIBILITY: BOS 7.3 vs PHI 5.1. BOS can play small-ball or conventional lineups and switch everything. PHI is limited by Drummond's inability to guard five-out. This structural advantage persists.\n\nREALISTIC SHOOTING: BOS team ~47% FG / 36% 3PT. PHI team ~44% FG / 35% 3PT. Individual: Brown ~48%, Tatum ~44%, Maxey ~44%, Edgecombe ~42% (injury + Mazzulla scheming).",
      g2Adjustments: [
        "PHI WON G2 111-97 ON THE ROAD — broke 0-7 since 1982 playoff drought vs BOS. Series tied 1-1.",
        "EDGECOMBE BREAKOUT: 30pts/10reb (12-20 FG, 6-10 3PT). Rookie scored more than Tatum. PHI's initiator count rises from 1→2 — this fundamentally changes the defensive math for BOS.",
        "PHI SHOT 49% FROM 3PT AS A TEAM (19-39): Team 3PT correlation phenomenon — when one shooter gets hot, the whole team follows. Will regress but structural improvement from 2-initiator offense is real.",
        "BOS SHOT 26% FROM 3PT (13-50): Ice-cold team-wide shooting. Will regress UP toward 38% season baseline. Brown went 3-8, Tatum 2-7, White 1-6, Pritchard 2-7 — everybody was off.",
        "TATUM FOUL TROUBLE: 5 PFs in 32 minutes, only 19pts (8-19 FG). Achilles recovery volatility showing — great G1, mediocre G2. His ceiling/floor variance is wider than model captured pre-Phase 28.",
        "BROWN HEROIC BUT INSUFFICIENT: 36pts (14-28 FG) in a LOSS. BOS's depth advantage evaporated when team 3PT% collapsed. Brown can't carry alone if the rest of BOS shoots 26%.",
        "WHITE-ON-MAXEY LESS EFFECTIVE: Maxey had 29pts (11-28 FG, 39.3%) with 7 assists. Still below his 47% baseline but got to the line (4-5 FT) and created for others. With Edgecombe as a second threat, White's assignment becomes harder.",
        "PAUL GEORGE FINDING RHYTHM: 19pts on 7-13 FG (53.8%). Suspension rust clearing. Still not the aggressive alpha PHI needs but efficiency is trending right.",
        "MAZZULLA MUST ADJUST: First time in 2026 playoffs he's lost (was 4-0 in G1s). Must scheme for Edgecombe specifically — hard traps, switching assignments, forcing rookie into ISO decisions. Mazzulla's adjustment rating (8) suggests he WILL adapt.",
        "NURSE'S MASTERCLASS: Adjusted from G1's disaster (91pts) to G2's road upset (111pts). Unleashed Edgecombe as co-creator, got George involved, improved ball movement. His Toronto-era G2 adjustment reputation is now proven in PHI.",
        "SERIES SHIFTS TO PHILADELPHIA: G3 and G4 at Wells Fargo Center. PHI was 24-17 at home this season. First time PHI has home court this series — crowd energy is a real factor after road upset."
      ],
      prosHome: ["BOS 3PT regression UP is the STRONGEST signal — 26% G2 (13-50) vs 38% season baseline. Every shooter was cold simultaneously","Mazzulla counter-adjustment (adj 8) — per Google AI Overview, will scheme for Edgecombe with hard traps, switching, forcing rookie ISO","Brown averaging 31.0pts on 51% FG — MVP-level. Per Yahoo: he and Tatum 'were the two best players on the floor' even in G2 loss","Tatum's 5PF game was fluky outlier — expect more disciplined play, still averaged 22.0 PPG through 2 games","White's defensive impact repeatable — held Maxey to 39.6% FG through 2 games despite 2-initiator offense","BOS depth returns if shooting normalizes — 6 scored 10+ in G1 when team shot 50%. Role flex 7.3 gives Mazzulla options","Championship DNA — sportsbooks still have BOS -7.5 at PHI. Polymarket: 77% BOS implied probability"],
      consHome: ["PHI home court advantage — 24-17 at home, crowd energy after road upset is real and measurable","Tatum's Achilles recovery volatility — wide variance band, could have another mediocre game (42.1% G2)","Edgecombe's breakout means White can't fully commit to Maxey — defensive scheme diluted by 2nd initiator","Series psychology shifted — PHI now believes after shattering 40-year drought. Road teams face energized crowd","BOS team 3PT correlation risk — if shooters go cold TOGETHER again (G2: Brown 3-8, White 1-6, Pritchard 2-7), depth collapses","Nurse's proven adjustment ability means BOS can't run same scheme — must evolve while PHI continues innovating"],
      prosAway: ["PHI home court for first time — crowd energy after stunning road upset (~2.5pt R1 boost)","Edgecombe breakout STRUCTURAL — 2nd initiator changes defensive math (White can't fully commit to Maxey)","Nurse's G2 masterclass PROVEN (adj 8): redesigned offense +20pts, faster ball movement, targeted Queta mismatches","Maxey averaging 24.5pts on 39.6% FG — well below 47% season baseline, regression UP expected at home","George trending up: 17pts G1 → 19pts G2 on 53.8% FG — suspension rust clearing, home game should continue arc","Broke 40-year BOS playoff drought — psychological barrier shattered, PHI now believes","Ball movement dramatically improved: 20+ assists G2 vs 13 in G1 — Nurse's tactical change is sustainable"],
      consAway: ["No Embiid (appendectomy recovery — targeting Apr 27 G4 return at earliest) — structural -13.2 on/off","PHI's 49% 3PT G2 is UNSUSTAINABLE — season baseline 33.2%, realistic G3 ~35%. Loses ~5pts of scoring","Edgecombe BACK INJURY from G2 hard fall — played through pain but G3 status/effectiveness unknown","Mazzulla (adj 8) will scheme specifically for Edgecombe after film study — hard traps, switches, ISO forcing","Drummond starting C remains structural liability vs BOS five-out spacing","PHI bench still thin — Grimes/Barlow/Bona limited. Per Yahoo Sports: wing defense is 'only 35-year-old George and Oubre'","Role flexibility gap: PHI 5.1 vs BOS 7.3 — BOS can play any style, PHI is locked into Drummond-dependent sets"]
    },
    modelLessons: [
      { type:"missed", lesson:"EDGECOMBE YOUTH BREAKOUT — 30pts (12-20 FG, 6-10 3PT) at age 20. Model projected 13.5pts (G2 outlook had 'neutral' for Edgecombe). Second youth breakout in these playoffs after Scoot Henderson (31pts G2). Phase 28 Youth Breakout Multiplier concept validated AGAIN — but model projected his CEILING at 18pts. The magnitude gap (30 actual vs 18 ceiling) suggests the multiplier's cap is too conservative for playoff rookies who've found their rhythm. Edgecombe had a mediocre G1, so the Bayesian blend anchored too heavily to the poor prior. LESSON: For players ≤23 who underperform G1 but show flashes, the G2 Bayesian blend should widen the ceiling rather than compress it." },
      { type:"missed", lesson:"NURSE G2 COACHING ADJUSTMENT — Model acknowledged Nurse's 'elite G2 adjustment history' but gave him adjustment rating 8 and then dismissed it with 'roster limits creativity.' In reality, Nurse redesigned PHI's offense: elevated Edgecombe from role player to co-creator, improved ball movement (PHI had 20+ assists vs 13 in G1), and ran Maxey off more screens. PHI went from 91pts in G1 to 111pts in G2 (+20pts). LESSON: Coaching adjustment ratings should have DIRECT impact on G2 predictions. Nurse's rating of 8 should have compressed BOS's projected margin by ~3-4pts more than it did." },
      { type:"correct", lesson:"PHI 3PT REGRESSION DIRECTION CORRECT — PHI went from 4-23 (17.4%) in G1 to 19-39 (49%) in G2. Model predicted regression upward and it happened. But magnitude was extreme — 49% is well above PHI's 33.2% season average. Team 3PT correlation factor (Phase 28) partially explains this: when one shooter gets hot, the whole team follows. Edgecombe's 6-10 3PT ignited the team." },
      { type:"missed", lesson:"BOS 3PT TEAM-WIDE COLLAPSE — 13-50 (26%) from 3PT. The model predicted BOS would sustain ~38% 3PT baseline. Instead, EVERY shooter was cold simultaneously: Brown 3-8, Tatum 2-7, White 1-6, Pritchard 2-7, Hauser 2-5. Team 3PT correlation works both ways — when shooters go cold together, the floor collapses. Model needs to account for downside team 3PT correlation risk, not just upside regression." },
      { type:"overweighted", lesson:"32-PT G1 MOMENTUM — Model weighted G1's 32-pt blowout heavily (88% G2 win rate after 20+ G1 wins). But PHI's improved offense + BOS's shooting variance meant momentum was meaningless. G1 blowout margins may predict G2 less reliably when the losing team has a strong coach (Nurse adj 8) and untapped talent (Edgecombe's breakout potential). LESSON: Blowout momentum should be discounted when opponent has high coaching adjustment rating." },
      { type:"correct", lesson:"TATUM ACHILLES RECOVERY VOLATILITY — G1: 25/11/7 (52.9% FG). G2: 19/8/5 with 5 fouls (42.1% FG). Phase 28's recovery volatility concept validated — post-injury players show wider game-to-game variance than the model's Bayesian blend captures. His baseRating 91 → rating 85 gap reflects this uncertainty." },
      { type:"underweighted", lesson:"MAXEY STAR BOUNCE-BACK — Held to 8-20 FG (40%) by White in G1. Bounced back to 11-28 (39.3%) with 29pts and 7 assists in G2. While FG% was similar, his scoring volume (29 vs 20) and playmaking (7ast vs 2ast) dramatically improved. Star players at Maxey's tier (84 rating, 8.0 clutch) don't get held down twice in a row. The model should have a stronger 'star bounce-back' factor." }
    ],
    coaching: {
      home: {
        coach: "Joe Mazzulla",
        adjustmentRating: 8,
        schemeCreativity: 5,
        urgency: 5,
        playoffRecord: "20-4",
        tendency: "Championship pedigree. Five-out offense. Willing to go small with Brown at nominal C. Adaptive in-series.",
        rotationPlan: "Per Fadeaway World: Start White/Hauser/Brown/Tatum/Queta, close with Pritchard/White/Brown/Tatum/Queta. 8-man rotation: Vucevic/Garza matchup-dependent off bench. Hauser as floor-spacer in starting 5.",
        keyAdjustment: "Small-ball lineups with no traditional center if PHI goes big with Drummond",
        g2Outlook: "A+ position — no adjustments needed. G1 was a 32-pt masterclass: White-on-Maxey scheme proven (8-20 FG), Brown's Q3 explosion (16pts, 7-9) sustainable, Tatum's return erased all rust concerns (25/11/7). Mazzulla is 4-0 in G1s — his pre-game plans are executed near-perfectly. G2 gameplan: same scheme, manage minutes (Tatum conditioning), exploit Drummond's inability to guard five-out. Only complacency is a risk. Per Fadeaway World: BOS has multiple ways to win — fast with small lineups or slow with size, ISO through Brown/Tatum or ball movement through White/Pritchard. Few teams have this versatility.",
        g1Performance: "A+ | 4-0 in Game 1s as head coach (2023: W vs ATL, 2024: W vs MIA, 2025: W vs ORL, 2026: W vs PHI). Masterclass game plan: White assigned to Maxey full-time (held him to 8-20), Brown unleashed as #1 scorer (26pts, 7-9 in Q3), Tatum seamlessly reintegrated after Achilles return (25/11/7). Ran deep 8-man rotation with 6 players scoring 10+ — never needed to shorten rotation because the game was over by halftime. Kept starters in just long enough to build insurmountable lead, then rested them. Mazzulla's five-out spacing forced PHI to defend the arc where they went 4-23 (17.4%). No adjustments needed — the pre-game plan was executed perfectly."
      },
      away: {
        coach: "Nick Nurse",
        adjustmentRating: 8,
        schemeCreativity: 9,
        urgency: 8,
        playoffRecord: "20-18",
        tendency: "Aggressive player usage. Stacks non-Maxey lineups with quality offense. Wing defense always on floor.",
        rotationPlan: "Per Fadeaway World: Start Maxey/Edgecombe/Oubre/George/Drummond. Close same 5 (or sub Grimes/Edwards for Edgecombe/Oubre). 8-man rotation: Grimes first off bench, then Barlow/Bona big rotation. No real backup PG (40-year-old Lowry emergency only). Maxey 40+ MPG.",
        keyAdjustment: "Maxey at 35%+ usage. Edgecombe as defensive disruptor off bench",
        g2Outlook: "Must-adjust game but limited by roster. G1 film shows: (1) White-on-Maxey is a lock Nurse must scheme around — need off-ball screens, handoffs, and misdirection to free Maxey, (2) PHI went 4-23 from 3PT (17.4%) — will regress upward but BOS defense CAUSED many misses, (3) George looked disconnected — needs more touches and rhythm, (4) Drummond at C is a structural liability vs BOS five-out — consider Barlow or Bona for athleticism, (5) Edgecombe's 16.0/5.6/4.2 season was invisible in G1 — need him aggressive. Nurse's G2 adjustment history (Toronto tenure) was elite but he's severely limited by no Embiid, no backup PG, and a 32-pt confidence deficit. Per Fadeaway World: 'This might be the most important postseason in Embiid's career' — but he's not available.",
        g1Performance: "D | Nurse had no answer for Boston's five-out spacing. PHI went 4-of-23 from 3PT (17.4%) — a schematic failure as much as a shooting one. No counter for White's full-time assignment on Maxey. Drummond starting at C was predictably overwhelmed. Nurse's trademark aggressive usage worked against him: Maxey played heavy minutes but was stifled, and the supporting cast had no system to generate quality looks without Maxey creating. George (suspension-return rust) looked disconnected. No visible in-game adjustments as the deficit ballooned. Limited by roster rather than tactics, but failed to find any creative solutions."
      },
      bestLineups: {
        home: { players: ["White","Hauser","Brown","Tatum","Queta"], netRtg:9.3, ortg:118.5, drtg:109.2, min:420, note:"Per Fadeaway World STARTING 5 — balance across every position. G1: dominated from tip-off" },
        homeClosing: { players: ["Pritchard","White","Brown","Tatum","Queta"], netRtg:11.5, ortg:121.5, drtg:110.0, min:280, note:"Per Fadeaway World CLOSING 5. Pritchard replaces Hauser for secondary creation. Multiple ways to win. Championship DNA" },
        away: { players: ["Maxey","Edgecombe","Oubre","George","Drummond"], netRtg:0.5, ortg:110.0, drtg:109.5, min:300, note:"Per Fadeaway World starting/closing 5 (without Embiid). G1: overwhelmed by BOS depth and five-out spacing" },
        awayFullStrength: { players: ["Maxey","Edgecombe","Oubre","George","Embiid"], netRtg:7.5, ortg:117.0, drtg:109.5, min:0, note:"Per Fadeaway World FULL-STRENGTH closing if Embiid returns. Would transform series. NOT available G2" }
      },
      roleChanges: [
        { team:"BOS", player:"Tatum", regSeason:"17 games post-Achilles, 30 MPG", playoff:"G1: 25/11/7 in 32min. 34+ MPG going forward. Mazzulla managing minutes load but Tatum showed he's ready for full playoff workload", impact:"up", reason:"G1 erased all rust concerns. Dual-star with Brown changes BOS ceiling" },
        { team:"BOS", player:"Hauser", regSeason:"Starter, 28 MPG", playoff:"Per Fadeaway World: STARTER providing spacing (39.3% 3PT) but NOT in closing lineup. 24+ MPG in starting/rotation role", impact:"neutral", reason:"Clear role executed consistently — floor spacer who opens driving lanes for Brown/Tatum" },
        { team:"BOS", player:"Pritchard", regSeason:"Bench leader, 26 MPG", playoff:"Per Fadeaway World: leads bench with starter-level production AND in CLOSING lineup. 28+ MPG. Key secondary creator", impact:"up", reason:"17.0/5.2 APG production fills Holiday's role. Closes games — bigger than bench role suggests" },
        { team:"BOS", player:"Vucevic", regSeason:"Bench C, 22 MPG", playoff:"Per Fadeaway World: 9.7/6.6 — reduced role. Matchup-dependent minutes, 15-18 MPG", impact:"down", reason:"Queta's emergence + Garza's shooting mean Vucevic is 3rd-choice big. Rating corrected 68→64" },
        { team:"PHI", player:"Maxey", regSeason:"Primary scorer, league-leading 38.0 MPG", playoff:"40+ MPG, 35%+ usage. Everything runs through him without Embiid. G1: held to 8-20 FG by White", impact:"up", reason:"Nurse pushes stars hard. No backup PG means Maxey plays through exhaustion" },
        { team:"PHI", player:"Oubre", regSeason:"Starter, 30 MPG", playoff:"Per Fadeaway World: STARTER and CLOSING lineup member — 14.1/5.0. Model was MISSING him entirely", impact:"up", reason:"PHI's 4th scoring option. Wing scoring and physicality critical without Embiid" },
        { team:"PHI", player:"Edgecombe", regSeason:"Starter, 30 MPG (per Fadeaway: 16.0/5.6/4.2)", playoff:"STARTER and CLOSING lineup member. Rating bumped 66→70 reflecting breakout season", impact:"up", reason:"Cemented as Maxey's long-term backcourt partner. Defensive motor makes up for Maxey's weaknesses" },
        { team:"PHI", player:"Grimes", regSeason:"Bench wing, 22 MPG", playoff:"Per Fadeaway World: FIRST off bench — 13.4/3.6/3.3. Expanded role without Embiid", impact:"up", reason:"On expiring contract — extra motivation. Like-for-like backup for Edgecombe/Oubre" },
        { team:"PHI", player:"Drummond", regSeason:"Backup C behind Embiid", playoff:"Starting C, 28+ MPG. G1: overwhelmed by BOS five-out spacing", impact:"up", reason:"Embiid OUT forces starting role. Massive downgrade — can't space floor, can't defend perimeter" },
        { team:"PHI", player:"George", regSeason:"17.3 PPG in disrupted season (25-game suspension)", playoff:"Must be PHI's 2nd scorer. G1: looked disconnected. Needs more touches and rhythm by G2", impact:"neutral", reason:"Suspension-rust fading but 4.8 clutch rating and 'Playoff P' history remain concerns" }
      ]
    },
    schemePersistence: {
      away: { isSchemeDriven: true, fgSuppression: 0.04, description: "PHI schemed BOS to 26% 3PT in G2 — catch-and-shoot denial. Nurse's defensive creativity (box-and-one history)." },
      home: null
    },
    youthCeilings: { "VJ Edgecombe": 1.55 },
    // G2 Player Outlook — Bayesian blend: 55% model / 45% prior
    // G1: 32-pt BOS blowout (123-91). BOS shot 50% FG, 11 3PM. PHI 4-23 from 3 (17.4%).
    // Tatum 25/11/7 in Achilles return. Brown 26pts (16 in Q3). 6 BOS players scored 10+.
    // PHI's structural problem: 1 initiator (Maxey), no Embiid, Drummond can't space floor.
    // Still at BOS for G2. PHI needs historic 3PT bounce-back or this is a sweep.
    g2PlayerOutlook: {
      home: [ // BOS
        // Tatum: G1 9-17 (52.9%), 1-7 3PT, 25pts/11reb/7ast in 32min. Season ~46% FG.
        // Bayesian: 0.55*0.529 + 0.45*0.460 = 0.498. Achilles return was strong.
        { player:"Jayson Tatum", outlook:"good", projFgPct:0.47, ptsRange:[22,30], reason:"G1 Achilles return was emphatic (52.9% FG, near triple-double in 32min). Only 1-7 from 3 — regression UP expected there (season 37.7% 3PT). RECOVERY NOTE: NBA.com headline flags 'Tatum recovery crucial in Game 2' — Achilles workload management may cap minutes at ~30-32min again rather than full 36+. Not on injury report (will play), but BOS may manage load given 32pt G1 cushion. FG% dipped 0.48→0.47 to reflect potential conservative usage early. PHI has no defender for him. Home again.", confidence:"high" },

        // Brown: G1 11-21 (52.4%), 26pts (16 in Q3). Season ~49% FG.
        // Bayesian: 0.55*0.524 + 0.45*0.490 = 0.509. Right at star level.
        { player:"Jaylen Brown", outlook:"good", projFgPct:0.49, ptsRange:[22,30], reason:"G1 dominant (52.4% FG, 16pts in Q3 alone — went 7-9). Season ~49% — minimal regression needed. Finals MVP who turns it on in playoffs. Edgecombe's D-LEBRON (0.08) is a massive mismatch. Expect continued 24-28pt production with elite efficiency.", confidence:"high" },

        // White: G1 4-10 (40.0%), 2-7 3PT, 10pts/6ast. Season ~44% FG. Defensive star.
        // Bayesian: 0.55*0.400 + 0.45*0.440 = 0.418
        { player:"Derrick White", outlook:"neutral", projFgPct:0.42, ptsRange:[8,16], reason:"G1 slightly below average shooting (40%) but defensive assignment on Maxey (held to 8-20) is his primary value. Season ~44% FG. Expect 10-14pts as secondary contributor. 3PT regression up likely (season 38.5% vs G1's 28.6%).", confidence:"medium" },

        // Hauser: G1 4-6 (66.7%), 4-6 3PT!!, 12pts/7reb. Season ~48% FG, ~42% 3PT.
        // Bayesian: 0.55*0.667 + 0.45*0.480 = 0.583. 4-6 3PT is hot but he's a sharpshooter.
        { player:"Sam Hauser", outlook:"neutral-good", projFgPct:0.48, ptsRange:[8,14], reason:"G1 was scorching (4-6 3PT, 66.7% FG). Season ~42% 3PT — some regression but he IS a sharpshooter. PHI's perimeter D was atrocious (4-23 team 3PT) suggesting scheme issues not hot shooting. BOS's spacing is structural.", confidence:"medium" },

        // Pritchard: G1 4-12 (33.3%), 2-9 3PT, 12pts/6ast in 34min. Season ~43% FG.
        // Bayesian: 0.55*0.333 + 0.45*0.430 = 0.377. Below average but high-usage bench.
        { player:"Payton Pritchard", outlook:"neutral", projFgPct:0.40, ptsRange:[10,16], reason:"G1 cold shooting (33.3% FG, 2-9 3PT) despite 34 heavy minutes. Season ~43% FG. Bounce-back from 3 expected — career 38% playoff 3PT. High-usage bench creator. Volume will stay high.", confidence:"medium" },

        // Queta: G1 5-5 (100%), 13pts in 15min. Season ~58% FG. Outlier.
        { player:"Neemias Queta", outlook:"neutral", projFgPct:0.58, ptsRange:[4,10], reason:"G1 perfect from field (5-5) — extreme outlier. Season ~58% FG as backup C. Rim-finishing and lob-catching are efficient but 13pts in 15min is not repeatable. Expect 4-8pts on limited attempts.", confidence:"medium" },

        // Vucevic: G1 1-3, 3pts/6reb in 18min. Bench center.
        { player:"Nikola Vucevic", outlook:"neutral", projFgPct:0.45, ptsRange:[4,10], reason:"Bench center providing rebounding (6reb in 18min). Low offensive usage. Expect similar 4-6pts with passing and board contributions.", confidence:"low" }
      ],
      away: [ // PHI
        // Maxey: G1 8-20 (40.0%), 1-4 3PT, 21pts. Season ~47% FG. White's D contained him.
        // Bayesian: 0.55*0.400 + 0.45*0.470 = 0.432. Bounce-back from 40% expected.
        { player:"Tyrese Maxey", outlook:"neutral-good", projFgPct:0.44, ptsRange:[22,30], reason:"G1's 40% FG was below season ~47% baseline — White's elite D is real but 40% is Maxey's floor not ceiling. Bounce-back shooting expected. PHI's ONLY initiator means maximum usage continues. At BOS again but desperation may unlock more aggressive attacking.", confidence:"high" },

        // PG: G1 4-8 (50.0%), 17pts on 8-9 FT in 28min. Season ~45% FG.
        // Bayesian: 0.55*0.500 + 0.45*0.450 = 0.478. But small sample (4-8).
        // 'Playoff P' history — tends to disappear in big moments.
        { player:"Paul George", outlook:"neutral", projFgPct:0.44, ptsRange:[14,22], reason:"G1 was deceptive — 50% FG but only 8 attempts in 28min (17pts via FT). Season ~45% FG. Needs more aggression and volume to be PHI's #2. 'Playoff P' reputation and 4.8 clutch rating are concerns. 25-game suspension rust may still linger. More touches critical.", confidence:"medium" },

        // Edgecombe: G1 6-16 (37.5%), 0-5 3PT, 13pts. Season ~43% FG. Rookie.
        // Bayesian: 0.55*0.375 + 0.45*0.430 = 0.400
        { player:"VJ Edgecombe", outlook:"neutral", projFgPct:0.40, ptsRange:[10,16], reason:"G1 was cold (37.5% FG, 0-5 3PT) for the breakout rookie. Season ~43% FG. Defensive motor is real but offensive game is raw under playoff pressure. Some bounce-back expected. Needs to attack rim more vs BOS's switching.", confidence:"medium" },

        // Oubre: G1 5-14 (35.7%), 0-5 3PT, 10pts/7reb. Season ~44% FG.
        // Bayesian: 0.55*0.357 + 0.45*0.440 = 0.394
        { player:"Kelly Oubre Jr.", outlook:"neutral", projFgPct:0.40, ptsRange:[8,14], reason:"G1 cold (35.7% FG, 0-5 3PT) — part of PHI's historic 4-23 3PT night. Season ~44% FG. Bounce-back from 3 likely (season ~35% 3PT). Energy and rebounding (7reb) provide floor. Wing scoring needed for any PHI chance.", confidence:"medium" },

        // Drummond: G1 1-2, 2pts/5reb in 21min. Season ~52% FG. Can't space floor.
        { player:"Andre Drummond", outlook:"bad", projFgPct:0.50, ptsRange:[2,8], reason:"BOS's 5-out spacing exposes Drummond every possession. Can't guard perimeter or space floor. G1 was invisible offensively (1-2 FG, 2pts). Structural limitation that doesn't improve. Only value is rebounding and size.", confidence:"high" },

        // Grimes: G1 3-6 (50.0%), 7pts/4reb. Season ~42% FG. Bench wing.
        { player:"Quentin Grimes", outlook:"neutral", projFgPct:0.42, ptsRange:[6,12], reason:"Bench wing who played 25min — solid (50% FG). On expiring contract, motivated. Season ~42% FG. Provides competent bench minutes. Could see more time if PHI needs shooting.", confidence:"low" },

        // Bona: G1 1-3, 3pts in 14min. Backup C.
        { player:"Adem Bona", outlook:"neutral", projFgPct:0.45, ptsRange:[2,6], reason:"Young backup center with limited offensive role. G1 was fine for spot minutes. Provides energy and rim protection. Not a scoring factor.", confidence:"low" }
      ]
    },
    // G3 Player Outlook — Bayesian blend with 2-game sample
    // G1: BOS 123-91 blowout. G2: PHI 111-97 upset (Edgecombe 30/10, PHI 49% 3PT).
    // Series tied 1-1. G3 at PHI (Wells Fargo Center). Embiid still OUT.
    // PHI now has 2 initiators (Maxey + Edgecombe). BOS must adjust defensive scheme.
    // Both teams' 3PT% should regress toward season baseline.
    g3PlayerOutlook: {
      home: [ // BOS (playing AWAY at PHI for G3)
        // Brown: G1 11-21 (52.4%) 26pts. G2 14-28 (50.0%) 36pts. Averaging 31.0 PPG.
        // 2-game Bayesian: strong performer, consistent star. PHI has no answer for him.
        { player:"Jaylen Brown", outlook:"good", projFgPct:0.48, ptsRange:[24,32], reason:"Averaging 31.0 PPG on 51.0% FG through 2 games — MVP-level production. Per Yahoo Sports, he and Tatum 'were the two best players on the floor' in G2 despite BOS losing. G2's 36pts (14-28 FG) proved he can carry BOS even when team collapses. PHI's wing defense weakness (per Yahoo: 'only 35-year-old George and Oubre to stop them') means Brown gets favorable matchups. Road game at PHI with hostile crowd may slightly suppress efficiency. Realistic 3PT: ~35% (season ~35%, series 29.4%). Expect 26-30pts on ~48% FG.", confidence:"high" },

        // Tatum: G1 9-17 (52.9%) 25pts/11reb/7ast. G2 8-19 (42.1%) 19pts/8reb/5ast, 5PF.
        // Achilles recovery volatility. Wide variance band.
        { player:"Jayson Tatum", outlook:"neutral", projFgPct:0.44, ptsRange:[18,28], reason:"High-variance projector due to Achilles recovery (Phase 28 recovery volatility). G1 was dominant (25/11/7, 52.9% FG), G2 was mediocre (19pts, 42.1% FG, 5 fouls). Two-game average: 22.0 PPG, 47.4% FG. The foul trouble in G2 is unlikely to repeat but his game-to-game ceiling/floor gap remains wide. Road game with less favorable whistles may limit FTA. Expect 20-26pts with high uncertainty.", confidence:"medium" },

        // White: G1 4-10 (40%) 10pts. G2 5-14 (35.7%) 12pts. Defensive value primary.
        // His 3PT was 1-6 in G2, season 38.5% — regression UP expected.
        { player:"Derrick White", outlook:"neutral", projFgPct:0.40, ptsRange:[10,18], reason:"Primary defensive assignment on Maxey remains his value — held Maxey to 39.3% FG in G2 and 40% in G1. Scoring: averaging 11.0 PPG on 37.5% FG through 2 games, below 44% season baseline. 3PT regression UP expected (2-12 for series, 16.7% vs 38.5% season). With Edgecombe now a 2nd initiator, White's defensive assignment may need to adjust — could unlock more offensive opportunity. Expect 12-16pts.", confidence:"medium" },

        // Pritchard: G1 4-12 (33.3%) 12pts. G2 4-11 (36.4%) 11pts. Cold shooter.
        // Season 43% FG, 37.7% 3PT. 2-game: 36.4% FG, 4-16 from 3 (25%).
        { player:"Payton Pritchard", outlook:"neutral-good", projFgPct:0.42, ptsRange:[10,18], reason:"Massive 3PT regression expected: 4-16 from 3 for the series (25%) vs 37.7% season baseline. He's too good a shooter to stay this cold. Plantar fasciitis is a monitor item but hasn't limited minutes (30-34 MPG). High-usage bench role continues (11.5 PPG). Road game energy could help or hurt. Expect bounce-back to 14-18pts with improved 3PT%.", confidence:"medium" },

        // Hauser: G1 4-6 (66.7%) 12pts. G2 2-6 (33.3%) 6pts. Starter/spacer.
        { player:"Sam Hauser", outlook:"neutral", projFgPct:0.44, ptsRange:[4,12], reason:"G1 scorching (4-6, 12pts), G2 average (2-6, 6pts). 2-game: 6-12 (50%) which is above his 42% season. Will hover around 6-10pts. Spacing role is critical regardless of personal scoring. Road game at PHI shouldn't significantly affect his corner 3 looks.", confidence:"low" },

        // Queta: G1 5-5 (100%) 13pts. G2 2-3 (66.7%) 5pts.
        { player:"Neemias Queta", outlook:"neutral", projFgPct:0.58, ptsRange:[4,10], reason:"2-game average: 9.0 PPG on 7-8 FG (87.5%) — extreme outlier efficiency that will regress. Rim-finishing role means 4-8pts on limited attempts. Rebounding and defense are his value (7.0 RPG in G2).", confidence:"low" },

        // Vucevic: G1 1-3 3pts. G2 2-5 4pts. Bench C.
        { player:"Nikola Vucevic", outlook:"neutral", projFgPct:0.44, ptsRange:[4,10], reason:"Bench center averaging 3.5 PPG. Provides rebounding and passing. May see slightly more minutes on the road. Low offensive impact.", confidence:"low" }
      ],
      away: [ // PHI (playing HOME at Wells Fargo for G3)
        // Maxey: G1 8-20 (40%) 20pts. G2 11-28 (39.3%) 29pts/7ast.
        // Averaging 24.5 PPG on 39.6% FG — below 47% season baseline.
        // With Edgecombe as 2nd initiator, White's defensive assignment may loosen.
        { player:"Tyrese Maxey", outlook:"good", projFgPct:0.44, ptsRange:[24,32], reason:"HOME GAME BOOST + FG% regression UP. Averaging 24.5 PPG but on only 39.6% FG — well below 47% season baseline. Per Yahoo Sports, Maxey had 29pts and 9 assists in G2 with increased creation for teammates (7ast G2 vs 2ast G1). White's D is real (holding Maxey to 39.6% across 2 games) but with Edgecombe as confirmed 2nd initiator, BOS can't fully commit White to Maxey — defensive scheme diluted. Home court means more favorable whistles and crowd energy. TURNOVER NOTE: Maxey had 3 TOs in G2 — needs to protect the ball better against BOS's switching D. Realistic 3PT: ~35% (season 38%, series 18.2% — due for correction). Expect 26-30pts on ~44% FG.", confidence:"high" },

        // Edgecombe: G1 6-16 (37.5%) 13pts. G2 12-20 (60.0%) 30pts/10reb.
        // YOUTH BREAKOUT candidate (age 20, usage rising).
        // Mazzulla will scheme for him in G3. BACK INJURY from G2.
        { player:"VJ Edgecombe", outlook:"neutral-good", projFgPct:0.42, ptsRange:[14,24], reason:"YOUTH BREAKOUT ACTIVE (Phase 29 momentum persistence) but THREE headwinds for G3: (1) BACK INJURY — per Google search results, took hard fall early in G2 and was 'playing through pain.' G3 status/effectiveness unknown. (2) MAZZULLA COUNTER-SCHEME — per Google AI Overview and SI article, BOS coaching staff (adj 8) will scheme specifically for Edgecombe after film study: hard traps on P&R, switching bigger defenders onto him, forcing ISO decisions. (3) 3PT REGRESSION — 60% FG and 60% 3PT in G2 are extreme outliers. Season ~43% FG, ~35% 3PT. HOME GAME BOOST helps — crowd energy for the breakout star. Realistic G3: 16-22pts at ~42% FG, a meaningful step down from G2's 30pts but still an upgrade from G1's 13pts. Youth breakout momentum persistence (consecutive game factor) provides a floor above G1 performance.", confidence:"medium" },

        // George: G1 4-8 (50%) 17pts. G2 7-13 (53.8%) 19pts.
        // Trending up. Suspension rust clearing.
        { player:"Paul George", outlook:"neutral-good", projFgPct:0.46, ptsRange:[16,24], reason:"Steady improvement: 17pts G1 → 19pts G2 on 53.8% FG. Suspension rust is fading. 2-game: 18.0 PPG on 52.4% FG — above his 44.2% season baseline (small sample). Home game should boost confidence further. With Edgecombe drawing defensive attention, George gets cleaner looks. 3PT trending well (3-5 G2, 60%). Expect continued improvement to 18-22pts.", confidence:"medium" },

        // Oubre: G1 5-14 (35.7%) 10pts. G2 6-12 (50%) 14pts.
        // Trending up, home game boost.
        { player:"Kelly Oubre Jr.", outlook:"neutral-good", projFgPct:0.44, ptsRange:[10,18], reason:"Improvement arc: 10pts G1 → 14pts G2 on 50% FG. 2-game: 12.0 PPG, 43.1% FG — right at season baseline. 3PT was 2-5 G2 (40%) after 0-5 G1 — normalizing. Home game should boost a player who thrives on energy. PHI's 4th scorer needs to stay in the 12-16pts range for PHI to compete.", confidence:"medium" },

        // Drummond: G1 1-2 2pts. G2 3-5 6pts/9reb.
        // Structural liability vs five-out but rebounding value.
        { player:"Andre Drummond", outlook:"neutral", projFgPct:0.52, ptsRange:[4,10], reason:"Slight improvement: 2pts G1 → 6pts G2 with 9 rebounds. Five-out spacing issue persists but his rebounding (9 boards G2) has value. Home crowd energy helps effort-based players. Still a structural mismatch vs BOS spacing but less exploitable at home with familiar defensive rotations.", confidence:"medium" },

        // Grimes: G1 3-6 (50%) 7pts. G2 3-6 (50%) 8pts. Steady bench.
        { player:"Quentin Grimes", outlook:"neutral", projFgPct:0.44, ptsRange:[6,12], reason:"Steady 7.5 PPG on 50% FG through 2 games. Reliable bench wing on expiring contract. Home game favors bench players. Could see 20+ minutes if PHI rides the hot hand. 3PT: 2-3 in G2 — capable shooter.", confidence:"low" },

        // Barlow: G1 DNP/limited. G2 1-3 3pts in 10min.
        { player:"Dominick Barlow", outlook:"neutral", projFgPct:0.45, ptsRange:[2,6], reason:"Limited bench big. 10 minutes in G2 with 3pts. Athletic but raw. Provides energy in spot minutes.", confidence:"low" },

        // Bona: G1 1-3 3pts in 14min. G2 1-2 2pts in 8min.
        { player:"Adem Bona", outlook:"neutral", projFgPct:0.48, ptsRange:[2,6], reason:"Backup center averaging 2.5 PPG. Provides rim protection and energy. Home game could mean slightly more confidence.", confidence:"low" }
      ]
    },
    games: [{num:1,result:"W",homeScore:123,awayScore:91,winner:"BOS",notes:"32-pt blowout. Tatum 25/11/7 in return from Achilles. Brown 26 pts (7-9 Q3). 6 BOS players scored 10+. BOS shot 50% FG, 11 3PM. PHI 4-23 from 3 (17.4%, 2nd worst franchise playoff history). Maxey 20 pts on 8-20, White's D stifled him. Wire-to-wire. Model projected BOS 112-98 (margin 14); actual margin 32. Model picks: BOS ML ✅, BOS -12.5 ✅ (+19.5 margin), Under 211.5 ❌ (actual 214), Brown O25.5 ✅ (26), Maxey O26.5 ❌ (20)."},{num:2,result:"L",homeScore:97,awayScore:111,winner:"PHI",notes:"PHI upset at BOS. Edgecombe BREAKOUT: 30pts (12-20 FG, 6-10 3PT) — model projected 13.5. PHI shot 48% FG, 49% 3PT (team correlation). Maxey 29pts (11-28). PG 19pts (7-13). Brown 36pts heroic but BOS shot 39% FG, 26% 3PT. Tatum 19pts (8-19, 5PF foul trouble). Series tied 1-1. Model projected BOS 109-103; actual PHI 111-97. Model pick BOS ❌.",boxScores:{home:[{name:"Jaylen Brown",min:38,pts:36,reb:7,ast:4,fgm:11,fga:24,tpm:5,tpa:12,ftm:9,fta:12,stl:2,blk:0,to:3},{name:"Jayson Tatum",min:39,pts:19,reb:14,ast:9,fgm:8,fga:19,tpm:2,tpa:8,ftm:1,fta:2,stl:1,blk:0,to:3},{name:"Derrick White",min:39,pts:8,reb:2,ast:3,fgm:3,fga:12,tpm:2,tpa:10,ftm:0,fta:0,stl:0,blk:2,to:3},{name:"Payton Pritchard",min:30,pts:11,reb:2,ast:4,fgm:4,fga:11,tpm:2,tpa:7,ftm:1,fta:1,stl:0,blk:0,to:1},{name:"Sam Hauser",min:24,pts:6,reb:3,ast:1,fgm:2,fga:6,tpm:2,tpa:5,ftm:0,fta:0,stl:0,blk:0,to:0},{name:"Neemias Queta",min:18,pts:5,reb:7,ast:0,fgm:2,fga:3,tpm:0,tpa:0,ftm:1,fta:2,stl:0,blk:2,to:1},{name:"Nikola Vucevic",min:14,pts:4,reb:4,ast:2,fgm:2,fga:5,tpm:0,tpa:1,ftm:0,fta:0,stl:0,blk:0,to:0},{name:"Baylor Scheierman",min:12,pts:2,reb:1,ast:0,fgm:1,fga:3,tpm:0,tpa:2,ftm:0,fta:0,stl:0,blk:0,to:0},{name:"Jordan Walsh",min:8,pts:2,reb:2,ast:1,fgm:1,fga:2,tpm:0,tpa:0,ftm:0,fta:0,stl:0,blk:0,to:0}],away:[{name:"VJ Edgecombe",min:35,pts:30,reb:10,ast:2,fgm:12,fga:20,tpm:6,tpa:10,ftm:0,fta:0,stl:2,blk:0,to:2},{name:"Tyrese Maxey",min:40,pts:29,reb:4,ast:9,fgm:11,fga:28,tpm:5,tpa:12,ftm:2,fta:2,stl:2,blk:0,to:1},{name:"Paul George",min:34,pts:19,reb:6,ast:4,fgm:7,fga:13,tpm:3,tpa:5,ftm:2,fta:2,stl:1,blk:0,to:1},{name:"Kelly Oubre Jr.",min:30,pts:14,reb:5,ast:1,fgm:6,fga:12,tpm:2,tpa:5,ftm:0,fta:0,stl:0,blk:1,to:1},{name:"Andre Drummond",min:20,pts:6,reb:9,ast:1,fgm:3,fga:5,tpm:0,tpa:0,ftm:0,fta:0,stl:0,blk:1,to:1},{name:"Quentin Grimes",min:18,pts:8,reb:2,ast:2,fgm:3,fga:6,tpm:2,tpa:3,ftm:0,fta:0,stl:0,blk:0,to:0},{name:"Dominick Barlow",min:10,pts:3,reb:3,ast:0,fgm:1,fga:3,tpm:0,tpa:1,ftm:1,fta:2,stl:0,blk:0,to:0},{name:"Adem Bona",min:8,pts:2,reb:3,ast:0,fgm:1,fga:2,tpm:0,tpa:0,ftm:0,fta:0,stl:0,blk:1,to:0}]}},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "NYK-ATL", conf: "East", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Mikal Bridges", target:"Nickeil Alexander-Walker", dLebron:0.896, targetUsg:26.5, note:"Bridges' POA defense (D-LEBRON 0.896) on NAW. Bridges' length and lateral quickness disrupt NAW's scoring rhythm. ATL has 2 initiators (NAW + McCollum), so NAW isn't the sole option — McCollum can create independently. G1: OG Anunoby was actually NYK's most impactful defender (+20.8% WPA)." },
      awayDefOnHome: { defender:"Dyson Daniels", target:"Jalen Brunson", dLebron:1.907, targetUsg:29.8, note:"Daniels (MIP, steals leader, D-LEBRON 1.907) on Brunson is a marquee matchup. Daniels' length and ball-hawking ability can disrupt Brunson's P&R reads. NYK has 2 initiators (Brunson + secondary from Bridges/OG). G1: Daniels had 11ast/9reb/3stl but was LVP by WPA (-13.0%) — his defense didn't translate to suppressing Brunson (28pts)." },
      secondaryMatchups: [
        { defender:"OG Anunoby", target:"Jalen Johnson", note:"THE G2 matchup to watch. OG was G1 WPA MVP (+20.8%) — Brown may shift him onto Johnson (22.5/10.3/7.9 All-Star) to neutralize ATL's best player. OG's D-LEBRON 1.724 + physicality can contest Johnson's driving game. Johnson had 23pts in G1 but OG wasn't his primary matchup — this could change everything" },
        { defender:"Towns", target:"Okongwu", note:"G1: Towns 25pts (19 in 2H) while Okongwu had 19pts efficient. Physical matchup but Towns' stretch-5 game (37.5% 3PT) pulls Okongwu away from rim — nullifying ATL's sole rim protector. Okongwu must contest Towns at the arc AND protect paint — unsustainable" },
        { defender:"Hart + Bridges", target:"McCollum", note:"G1: McCollum had 26pts on 55% FG — the one ATL scorer who thrived. Snyder will run more actions for McCollum in G2. Brown may switch Bridges onto McCollum to use his length vs McCollum's size. Hart provides physicality in PnR coverage" },
        { defender:"Brown transition D scheme", target:"ATL fast break", note:"G1: ATL had 18 fast-break pts in 1H, near-zero in 2H after Brown's halftime adjustment. This is REPEATABLE and structural — NYK gets back in transition and walls off the paint. ATL is 5th in pace (100.2) but NYK's transition D negates their biggest weapon" }
      ]
    },
    homeTeam: {
      name: "Knicks", city: "New York", abbr: "NYK", seed: 3, record: "53-29",
      systemBonus: 1.5, // Brown's defense
      playoffPedigree: 1, // 2024 ECF
      offStyle: "Brunson P&R primary + elite cutting/motion. OG and Bridges generate efficient off-ball scoring. High offensive variety.", initiators: 2,
      color: "#006BB6", color2: "#F58426",
      advStats: { ortg:116.8, drtg:110.5, netRtg:6.3, pace:97.2, ts:58.4, efg:55.2, tov:12.8, reb:51.8, ortgRk:4, drtgRk:6, clutchNetRtg:9.2, last10:"7-3", fgPct:52.2, threePct:36.3, ftPct:78.8, orbPct:25.4 },
      players: [
        { name:"Jalen Brunson", pos:"PG", rating:87, ppg:26.0, rpg:3.3, apg:6.8, fgp:47.8, per:20.1, ts:61.0, epm:6.0, bpm:3.1, ws48:.200, onOff:8.5, clutch:9.2, vorp:3.3, usg:29.8, injury:null, lebron:2.077, oLebron:3.528, dLebron:-1.45, war:7.351, offRole:"Shot Creator", defRole:"Low Activity",
          matchupNote:"8 career 40-pt playoff games with NYK (most in NBA). 9.2 clutch rating is absurd. +8.5 on/off. Playoff assassin", baseRating:87, starCeiling:1, injuryRisk:0.3, playoffAscension:1.5 },
        { name:"Karl-Anthony Towns", pos:"C", rating:79, ppg:20.1, rpg:11.9, apg:3.0, fgp:49.8, per:22.5, ts:60.8, epm:3.5, bpm:3.8, ws48:.168, onOff:5.0, clutch:6.0, vorp:3.1, usg:26.0, injury:null, lebron:3.044, oLebron:2.152, dLebron:0.893, war:7.966, offRole:"Versatile Big", defRole:"Mobile Big",
          matchupNote:"Stretch-5. 60.8 TS% + 11.9 RPG. 37.5% from 3 opens floor for Brunson drives", baseRating:79, starCeiling:1, injuryRisk:0 },
        { name:"OG Anunoby", pos:"SF", rating:74, ppg:16.7, rpg:4.8, apg:2.2, fgp:48.5, per:17.2, ts:58.5, epm:2.5, bpm:2.2, ws48:.132, onOff:4.2, clutch:5.8, vorp:2.2, usg:23.8, injury:null, lebron:1.821, oLebron:0.096, dLebron:1.724, war:5.96, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"Elite wing D. Young assignment. DRtg 104.2 when on court. 39.1% from 3", baseRating:74 },
        { name:"Mikal Bridges", pos:"SF", rating:72, ppg:14.4, rpg:3.8, apg:3.7, fgp:46.2, per:15.5, ts:57.2, epm:1.5, bpm:1.2, ws48:.105, onOff:2.8, clutch:5.2, vorp:1.6, usg:22.5, injury:null, lebron:2.232, oLebron:1.336, dLebron:0.896, war:7.898, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"Ironman: 82 GS. Offense looks regressed per Fadeaway World but D-LEBRON 0.896 / WAR 7.898 prove elite two-way impact. Defensive versatility across 1-3. NAW assignment — length + lateral quickness disrupts scoring rhythm. Part of best defensive wing duo in NBA with OG", baseRating:72 },
        { name:"Josh Hart", pos:"SG", rating:68, ppg:12.0, rpg:7.4, apg:4.8, fgp:44.8, per:14.8, ts:56.2, epm:1.2, bpm:1.0, ws48:.092, onOff:3.0, clutch:6.2, vorp:1.4, usg:20.8, injury:null, lebron:1.317, oLebron:0.271, dLebron:1.046, war:4.718, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"Longest-tenured starter. Hustle engine: 7.4 RPG from guard spot, 4.8 APG, stretches floor, defends multiple positions, outmaneuvers centers for rebounds. G1: 10pts/14reb. Best performer of 2nd half per Fadeaway World. 6.2 clutch rating. Won't shrink at MSG", baseRating:68 },
        { name:"Miles McBride", pos:"SG", rating:62, ppg:12.0, rpg:2.4, apg:2.6, fgp:42.3, per:14.0, ts:58.0, epm:0.8, bpm:0.5, ws48:.090, onOff:2.0, clutch:5.5, vorp:1.0, usg:20.8, injury:null, lebron:0.971, oLebron:1.331, dLebron:-0.36, war:2.323, offRole:"Secondary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Elite 3PT shooter (41.3%), tenacious defender. Key 6th man role at MSG", baseRating:62 },
        { name:"Mitchell Robinson", pos:"C", rating:56, ppg:5.7, rpg:8.8, apg:0.9, fgp:72.3, per:16.0, ts:68.0, epm:0.5, bpm:0.5, ws48:.110, onOff:1.5, clutch:3.0, vorp:0.7, usg:14.5, injury:null, lebron:2.234, oLebron:0.646, dLebron:1.588, war:3.447, offRole:"Athletic Finisher", defRole:"Mobile Big",
          matchupNote:"Elite offensive rebounder and rim protector. Backup to Towns. 1.2 BPG", baseRating:56 },
        { name:"Jeremy Sochan", pos:"PF", rating:52, ppg:2.8, rpg:2.1, apg:1.0, fgp:42.0, per:8.0, ts:50.0, epm:-0.8, bpm:-1.2, ws48:.030, onOff:-0.5, clutch:3.0, vorp:0.1, usg:12.0, injury:null, lebron:-2.423, oLebron:-1.96, dLebron:-0.463, war:0.015, offRole:"Stretch Big", defRole:"Wing Stopper",
          matchupNote:"Signed Feb 13 after SAS waived him. Per Fadeaway World: only 2.8 PPG/2.1 RPG in limited minutes — NOT a rotation piece offensively. Value is purely defensive switchability (guards 1-4). Brown may deploy him in specific matchup situations vs ATL's athletic wings but not a regular rotation player", baseRating:52 },
        { name:"Guerschon Yabusele", pos:"PF", rating:58, ppg:7.2, rpg:4.5, apg:1.2, fgp:46.5, per:13.0, ts:56.0, epm:0.2, bpm:0.0, ws48:.065, onOff:0.5, clutch:4.0, vorp:0.5, usg:16.5, injury:null, lebron:-0.5, oLebron:-0.2, dLebron:-0.3, war:1.0, offRole:"Stretch Big", defRole:"Helper",
          matchupNote:"Stretch-4 off bench: 7.2 PPG, 37% from 3. Physical presence against ATL's athletic frontcourt. Provides spacing when Towns rests. Brown's trust in his toughness and IQ", baseRating:58 },
        { name:"Jordan Clarkson", pos:"SG", rating:60, ppg:8.6, rpg:2.2, apg:2.5, fgp:43.5, per:12.5, ts:55.0, epm:-0.2, bpm:-0.5, ws48:.058, onOff:0.5, clutch:4.0, vorp:0.4, usg:20.0, injury:null, lebron:-1.0, oLebron:-0.3, dLebron:-0.7, war:0.8, offRole:"Shot Creator", defRole:"Low Activity",
          matchupNote:"Bench guard scorer: 8.6 PPG. Fighting for guard rotation minutes behind Brunson and McBride per Fadeaway World. Microwave scoring off bench — can create his own shot", baseRating:60 },
        { name:"Landry Shamet", pos:"SG", rating:58, ppg:9.3, rpg:2.0, apg:1.5, fgp:44.0, per:11.5, ts:57.0, epm:0.0, bpm:-0.5, ws48:.058, onOff:0.3, clutch:3.8, vorp:0.3, usg:18.0, injury:null, lebron:-1.0, oLebron:-0.2, dLebron:-0.8, war:0.5, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Best wing option off bench per Fadeaway World: 9.3 PPG, reliable 3-and-D player. Gets wing rotation minutes when Hart/Bridges/OG rest", baseRating:58 },
        { name:"Jose Alvarado", pos:"PG", rating:55, ppg:6.6, rpg:2.0, apg:3.8, fgp:42.0, per:11.0, ts:53.0, epm:-0.3, bpm:-0.5, ws48:.055, onOff:0.3, clutch:4.0, vorp:0.3, usg:16.0, injury:null, lebron:-0.8, oLebron:-0.5, dLebron:-0.3, war:0.8, offRole:"Secondary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Pest defender + backup ball-handler. 6.6 PPG, 3.8 APG since joining NYK. Disruptive on-ball defense — can harass McCollum/NAW. Fighting Clarkson for guard rotation minutes", baseRating:55 }
      ],
      synergy: [
        { players:["Brunson","Hart","Bridges","Anunoby","Towns"], score:84, note:"CLOSING 5 — best 4th-Q NetRtg in PBP era. Brunson 9.2 clutch. G1 confirmed: this group outscored ATL by 15 in 2H. OG was WPA MVP (+20.8%). MSG crowd adds 3+ points. Elite two-way versatility across all 5 positions" },
        { players:["Brunson","McBride","Hart","Anunoby","Robinson"], score:78, note:"DEFENSIVE lineup. Robinson rim protection (forced hack-a-Robinson in G1) + OG perimeter lockdown. McBride's 41.3% 3PT spaces floor. Deploy when ATL goes to bench units or when Towns needs rest" },
        { players:["McBride","Clarkson","Shamet","Yabusele","Robinson"], score:62, note:"BENCH UNIT: Clarkson microwave scoring + Shamet 3-and-D + McBride shooting. Robinson anchors defense. This group must outscore ATL's bench (which collapsed in G1). Brown's 9-man rotation means 2-3 of these guys are always on court" },
        { players:["Brunson","Bridges","Hart","Towns","Robinson"], score:76, note:"BIG lineup: Towns + Robinson dual-big for maximum rebounding and rim protection. Exploits ATL's frontcourt depth crisis (Okongwu sole rim protector, Landale OUT). Limits ATL transition by controlling boards" }
      ]
    },
    awayTeam: {
      name: "Hawks", city: "Atlanta", abbr: "ATL", seed: 6, record: "46-36",
      systemBonus: 0,
      playoffPedigree: 0,
      offStyle: "Post-Trae dual-initiator system with McCollum/NAW. Less star-dependent, more balanced. Transition offense is key weapon.", initiators: 2,
      color: "#E03A3E", color2: "#C1D32F",
      advStats: { ortg:118.5, drtg:112.8, netRtg:5.7, pace:100.2, ts:57.5, efg:54.1, tov:13.2, reb:43.5, ortgRk:6, drtgRk:18, clutchNetRtg:3.5, last10:"8-2", fgPct:51.1, threePct:34.7, ftPct:77.0, orbPct:23.5, ppg:118.5, rebRk:18 },
      players: [
        { name:"Nickeil Alexander-Walker", pos:"SG", rating:76, ppg:20.8, rpg:4.2, apg:3.5, fgp:44.8, per:18.5, ts:57.8, epm:2.2, bpm:2.0, ws48:.128, onOff:3.5, clutch:5.5, vorp:2.5, usg:26.5, injury:null, lebron:0.219, oLebron:0.582, dLebron:-0.362, war:4.371, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Acquired from MIN — major scorer. 20.8 PPG gives ATL another offensive weapon. Inconsistent defense", baseRating:76 },
        { name:"CJ McCollum", pos:"SG", rating:70, ppg:18.7, rpg:3.5, apg:4.1, fgp:44.2, per:17.8, ts:57.5, epm:1.5, bpm:1.2, ws48:.105, onOff:2.0, clutch:6.0, vorp:1.8, usg:24.5, injury:null, lebron:-0.306, oLebron:0.855, dLebron:-1.161, war:3.054, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"Acquired from WAS for Trae Young (Jan 9). PRIMARY INITIATOR in PnR sets — 18.7 PPG, .357 3P%. G1: 26pts on 55% FG — veteran playoff scorer thriving (Portland playoff pedigree). ~35 games with ATL but chemistry is working. Less creation than Trae (4.1 vs 11.4 APG) but more reliable scoring and shooting", baseRating:70 },
        { name:"Corey Kispert", pos:"SF", rating:58, ppg:9.2, rpg:3.0, apg:1.5, fgp:44.0, per:11.5, ts:56.5, epm:0.0, bpm:-0.5, ws48:.062, onOff:0.3, clutch:3.8, vorp:0.5, usg:18.5, injury:null, lebron:-1.005, oLebron:0.283, dLebron:-1.288, war:0.984, offRole:"Off Screen Shooter", defRole:"Helper",
          matchupNote:"Acquired from WAS for Trae Young (Jan 9). 9.2 PPG, .354 3P% — spacing off bench but not the elite shooter initially projected (.402 was wrong). ~35 games with ATL. Snyder may tighten rotation and reduce his minutes in G2", baseRating:58 },
        { name:"Jalen Johnson", pos:"PF", rating:82, ppg:22.5, rpg:10.3, apg:7.9, fgp:50.1, per:24.5, ts:59.5, epm:4.5, bpm:5.2, ws48:.185, onOff:6.0, clutch:6.5, vorp:4.0, usg:27.5, injury:null, lebron:1.244, oLebron:1.059, dLebron:0.185, war:5.876, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"ALL-STAR BREAKOUT: 22.5/10.3/7.9 — ATL's best player and centerpiece per Fadeaway World. Two-way engine thriving in transition + secondary playmaker. G1: 23pts showed he belongs on this stage. Near triple-double threat nightly. Towns matchup is THE test — can Johnson guard stretch-5s while Towns tries to contain Johnson's athleticism? 7.9 APG makes him ATL's real playmaking hub (not McCollum)", baseRating:82, starCeiling:1, injuryRisk:0 },
        { name:"Buddy Hield", pos:"SG", rating:58, ppg:5.1, rpg:2.0, apg:1.0, fgp:43.5, per:9.5, ts:58.5, epm:-0.2, bpm:-0.8, ws48:.052, onOff:0.2, clutch:3.5, vorp:0.3, usg:15.0, injury:null, lebron:-1.33, oLebron:-0.617, dLebron:-0.713, war:0.58, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"Acquired from GSW for Porzingis (Feb 5). SPECIALIST bench shooter: only 5.1 PPG but .412 3P% on 2.4 attempts. Instant offense in spot minutes. May be inserted into closing lineup for more shooting per Fadeaway World. ~25 games with ATL — limited chemistry", baseRating:58 },
        { name:"Jonathan Kuminga", pos:"PF", rating:66, ppg:12.5, rpg:4.8, apg:2.0, fgp:49.2, per:15.2, ts:57.5, epm:0.8, bpm:0.5, ws48:.085, onOff:1.0, clutch:4.5, vorp:1.0, usg:21.2, injury:null, lebron:-0.38, oLebron:-0.566, dLebron:0.186, war:1.082, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Acquired from GSW for Porzingis (Feb 5). Athletic forward, explosive finisher. ~25 games with ATL. Closing lineup candidate", baseRating:66 },
        { name:"Dyson Daniels", pos:"SG", rating:72, ppg:11.9, rpg:6.8, apg:3.2, fgp:45.2, per:15.5, ts:55.5, epm:1.5, bpm:1.2, ws48:.098, onOff:3.2, clutch:5.2, vorp:1.5, usg:21.2, injury:null, lebron:2.287, oLebron:0.38, dLebron:1.907, war:7.478, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"MIP + steals leader (2.0 SPG). 76 GS. 6.8 RPG is elite for a guard. G1: only 4pts but 11ast/9reb/3stl — 'glue guy' whose impact is invisible to box scores (WPA LVP -13.0% but his defense + facilitation keeps ATL functioning). D-LEBRON 1.907 / WAR 7.478 are ELITE. Brunson assignment — length and ball-hawking disrupt PnR reads but G1 showed Brunson (28pts) can still score through it", baseRating:72 },
        { name:"Zaccharie Risacher", pos:"SF", rating:62, ppg:9.6, rpg:4.5, apg:1.5, fgp:44.0, per:12.0, ts:55.0, epm:0.2, bpm:-0.1, ws48:.065, onOff:0.8, clutch:4.0, vorp:0.7, usg:19.0, injury:null, lebron:-0.39, oLebron:-0.729, dLebron:0.338, war:1.949, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Sophomore wing with upside: 9.6 PPG, .368 3P%. Length and shooting off bench. Getting better defensively. Provides wing depth behind Johnson/Daniels", baseRating:62 },
        { name:"Onyeka Okongwu", pos:"C", rating:72, ppg:15.2, rpg:7.6, apg:1.5, fgp:58.2, per:20.5, ts:62.2, epm:1.8, bpm:1.5, ws48:.135, onOff:3.2, clutch:5.0, vorp:1.8, usg:21.5, injury:null, lebron:0.853, oLebron:-0.858, dLebron:1.711, war:4.77, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"EVOLVED offensive game: 15.2 PPG (up from model's 10.8). No longer just a rim-runner — scores from multiple spots. G1: 19pts on efficient shooting confirmed this. Holds opponents to 48.0% FG — critical playoff rim protection. Lob threat with NAW/McCollum. SOLE big man after Porzingis trade — must anchor defense without help. Towns matchup is physical but Okongwu's athleticism can contest at the rim", baseRating:72 },
        { name:"Jock Landale", pos:"C", rating:0, ppg:9.1, rpg:4.1, apg:1.2, fgp:55.5, per:14.5, ts:60.0, epm:0.0, bpm:-0.2, ws48:.068, onOff:0.2, clutch:3.5, vorp:0.4, usg:16.5, injury:"OUT — right ankle sprain (expected May 1)", lebron:0.04, oLebron:0.471, dLebron:-0.431, war:2.36, offRole:"Stretch Big", defRole:"Mobile Big",
          matchupNote:"Acquired from UTA (Feb 5). OUT with ankle sprain. 9.1 PPG, strong screen-setter, frontcourt depth. His absence means Okongwu is ATL's SOLE rim protector — frontcourt depth crisis vs NYK's Towns+Robinson", baseRating:55 },
        { name:"Gabe Vincent", pos:"PG", rating:50, ppg:3.9, rpg:1.2, apg:1.6, fgp:40.0, per:8.0, ts:52.0, epm:-0.8, bpm:-1.5, ws48:.035, onOff:-0.5, clutch:3.0, vorp:0.0, usg:13.0, injury:null, lebron:-1.5, oLebron:-1.0, dLebron:-0.5, war:0.3, offRole:"Secondary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Playoff experience (MIA 2023 Finals). Defensive pressure off bench. 3.9 PPG — minimal offensive role but veteran presence. G1: combined with Gueye for only 5pts total — ATL bench depth crisis", baseRating:50 },
        { name:"Caleb Houstan", pos:"SF", rating:48, ppg:4.5, rpg:1.8, apg:0.8, fgp:52.4, per:8.5, ts:56.0, epm:-0.5, bpm:-1.0, ws48:.042, onOff:-0.5, clutch:3.0, vorp:0.0, usg:12.0, injury:null, lebron:-1.8, oLebron:-1.0, dLebron:-0.8, war:0.2, offRole:"Stationary Shooter", defRole:"Low Activity",
          matchupNote:"Bench shooter: .524 FG% in limited minutes. Can chip in spot shooting but not a meaningful playoff rotation piece", baseRating:48 },
        { name:"Mouhamed Gueye", pos:"PF", rating:50, ppg:3.5, rpg:2.8, apg:0.8, fgp:45.0, per:9.0, ts:52.0, epm:-0.5, bpm:-1.0, ws48:.035, onOff:-0.5, clutch:3.0, vorp:0.1, usg:12.0, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:"Versatile Big", defRole:"Mobile Big",
          matchupNote:"Young athletic big providing energy minutes off bench. G1: 11min with 3pts/3reb/1ast/1stl — limited but active", baseRating:50 }
      ],
      synergy: [
        { players:["McCollum","NAW","Daniels","Johnson","Okongwu"], score:74, note:"Starting 5 + CLOSING lineup. Shot creation (McCollum 18.7, NAW 20.8), defense (Daniels MIP), playmaking (Johnson 7.9 APG), rim protection (Okongwu). G1: competitive in 1H (57-55) with fast-break offense. ~35 games together but chemistry is gelling. ATL's best 5 per Fadeaway World" },
        { players:["Vincent","Hield","Kispert","Kuminga","Okongwu"], score:58, note:"BENCH CRISIS: G1 exposed depth — Kuminga 8pts/27min, Gueye+Vincent 5pts combined. Bench averaged 37.1 PPG (16th) in reg season but collapsed under playoff pressure. Hield (.412 3P%) and Kuminga (athletic finisher) are the only real bench threats" },
        { players:["McCollum","NAW","Hield","Johnson","Okongwu"], score:70, note:"MORE SHOOTING option: Hield replaces Daniels for spacing. May be used in closing lineup when ATL needs 3PT shooting per Fadeaway World. Sacrifices Daniels' elite defense for Hield's .412 3P%" },
        { players:["McCollum","NAW","Daniels","Kuminga","Okongwu"], score:68, note:"ATHLETICISM option: Kuminga replaces Johnson when foul trouble or need fresh legs. Kuminga's downhill scoring (12.2 PPG, 46.3% FG) adds physical presence. May be closing lineup candidate per Fadeaway World" }
      ]
    },
    externalFactors: [
      { team:"ATL", player:null, desc:"20-6 post-All-Star break. Best stretch in a decade. Traded Porzingis to GSW for Hield+Kuminga on Feb 5 — lost rim protection but gained athletic versatility. Still riding momentum.", impact:3, category:"motivation" },
      { team:"NYK", player:"Jalen Brunson", desc:"8 career 40-point playoff games. 9.2 clutch rating. Best 4th-quarter team NetRtg in play-by-play era. He IS the playoffs.", impact:5, category:"motivation" },
      { team:"NYK", player:null, desc:"MSG crowd is arguably best home court in East. +3 point estimated boost in playoff games.", impact:3, category:"motivation" },
      { team:"ATL", player:null, desc:"Traded Trae Young to WAS on Jan 9 — lost their franchise PG and primary creator. McCollum+Kispert are solid but a massive downgrade in creation. Only ~35 games together.", impact:-8, category:"chemistry",
        evidence:"Basketball-Reference transactions confirm: ATL traded Trae Young to Washington Wizards for Corey Kispert and CJ McCollum on January 9, 2026. ATL went from Trae's 11.4 APG creation to McCollum's 4.2 APG — a huge playmaking drop.",
        sources:["Basketball-Reference: basketball-reference.com/leagues/NBA_2026_transactions"], verdict:"verified" },
      { team:"ATL", player:null, desc:"Traded Porzingis to GSW (Feb 5) for Hield+Kuminga. Lost 7'3 rim protector and floor spacer. Okongwu now sole big — frontcourt depth is a liability vs Towns.", impact:-5, category:"chemistry",
        evidence:"Basketball-Reference transactions: Feb 5, 2026 — ATL traded Kristaps Porzingis to Golden State Warriors for Buddy Hield and Jonathan Kuminga. Lost elite rim protection but gained bench scoring and athleticism.",
        sources:["Basketball-Reference: basketball-reference.com/leagues/NBA_2026_transactions"], verdict:"verified" },
      { team:"ATL", player:null, desc:"ATL bench depth crisis confirmed in G1: Kuminga 8pts/27min, Gueye+Vincent 5pts combined. Bench averaged 37.1 PPG (16th) in reg season but collapsed under playoff intensity. Structural liability.", impact:-4, category:"chemistry" },
      { team:"NYK", player:null, desc:"Brown's halftime transition D adjustment was REPEATABLE: ATL had 18 fast-break pts in 1H, near-zero in 2H. This institutional knowledge carries into G2 from tip-off.", impact:4, category:"coaching" },
      { team:"ATL", player:"Jalen Johnson", desc:"Johnson's All-Star breakout (22.5/10.3/7.9) is ATL's lifeline — but G1 showed even 23pts isn't enough when bench collapses. His 7.9 APG makes him ATL's real playmaking hub, not McCollum.", impact:3, category:"performance" },
      { team:"NYK", player:null, desc:"NYK shot 48% from 3 in G1 — massive regression expected. But defensive identity (DRtg 110.5, 6th) is sustainable. Even with shooting regression, NYK's floor is higher than ATL's ceiling.", impact:-2, category:"performance" },
      { team:"ATL", player:null, desc:"ATL rebounding crisis: 28th in DRB% (43.5 RPG, 18th). NYK dominated boards in G1 (+2.7 Reb factor). Towns (11.9 RPG) + Robinson (8.8 RPG) = structural advantage ATL can't solve with Okongwu alone.", impact:-3, category:"performance" }
    ],
    game1: {
      spread: "NYK -5.5", moneyline: "NYK -220 / ATL +180", ou: "O/U 222.5",
      pick: "NYK", confidence: "high", projScore: "NYK 116 — ATL 104",
      reasoning: "ATL traded Trae Young to WAS on Jan 9 — a seismic roster change that transforms this series. Without Trae's 11.4 APG creation, Atlanta relies on NAW (20.8 PPG) and McCollum (15.8 PPG) as their offensive engine. But Brunson at MSG is a force of nature — 9.2 clutch, best 4th-Q NetRtg ever. NYK added Sochan (switchable D) and Yabusele (spacing). Without Trae, ATL lost their best player. NYK should control this series comfortably.",
      prosHome: ["Brunson 9.2 clutch — best in league", "Best 4th-Q NetRtg in PBP era", "Sochan+Yabusele add depth and versatility", "ATL lost Trae — massive creation downgrade"],
      consHome: ["ATL 20-6 post-ASB — found identity post-Trae", "Okongwu sole rim protector — Towns mismatch", "Johnson breakout complicates matchups", "Towns defense vs athletic 4s is sus"],
      prosAway: ["20-6 post-ASB — thriving without Trae", "NAW 20.8 PPG + McCollum veteran scoring", "Daniels MIP defensive disruption", "No Trae = no MSG crowd narrative to overcome"],
      consAway: ["Lost Trae's 11.4 APG creation — massive downgrade", "McCollum+Kispert only ~35 games with team", "DRtg 112.8 — can't stop NYK offense", "Traded Porzingis — frontcourt depth depleted"]
    },
    modelLessons: [
      { type:"UNDERWEIGHTED", lesson:"Brunson's playoff gear: 19pts in Q1 on 8/10 shooting set the tone before ATL could settle in. His 9.2 clutch rating actually UNDERSTATES his Game 1 impact — he's a different player at MSG in the playoffs." },
      { type:"UNDERWEIGHTED", lesson:"Towns' second-half explosion: Started 1/6 in the first half but finished with 25pts (19 in 2H). Our model doesn't capture this streaky-but-explosive playoff pattern — a slow start doesn't predict a slow finish." },
      { type:"OVERWEIGHTED", lesson:"ATL's 20-6 post-ASB momentum: Regular season momentum didn't translate to playoff intensity. Hawks were competitive in the first half (55-57) but couldn't sustain when NYK tightened up in Q3 (34.8% shooting, 5 turnovers forced)." },
      { type:"MISSED", lesson:"Mike Brown's halftime coaching adjustment was decisive: ATL had 18 fast break points in the first half. Brown said 'We talked about it at halftime and did a better job.' The second-half transition defense lockdown changed the game. Brown's adaptability (the SAC concern) was actually a strength here." },
      { type:"MISSED", lesson:"ATL bench depth crisis — far worse than modeled. Kuminga had just 8pts in 27 minutes, while Gueye and Vincent combined for 5pts total. The mid-season acquisitions (Kuminga, Hield, Kispert) haven't gelled into a cohesive bench unit. ATL's depth beyond the starting 5 is a structural liability." },
      { type:"MISSED", lesson:"Daniels' 'glue guy' impact invisible to the model — only 4pts but 11ast/9reb/3stl. SPM chemistry engine values scoring-centric profiles, but players who facilitate without scoring are critical to team ceiling. Need a 'connector' bonus for high-ast/low-usg players." },
      { type:"MISSED", lesson:"Okongwu's 19pts on efficient shooting showed an evolved offensive game. He's no longer just a rim-runner — he can score from multiple spots. But it wasn't enough without Porzingis' 7'3 presence to truly challenge Towns." },
      { type:"UNDERWEIGHTED", lesson:"Robinson's rim protection impact was real: Hawks resorted to hack-a-Robinson (1/4 FT), indicating he was impactful enough defensively that fouling was preferable to letting him protect the rim." },
      { type:"CORRECT", lesson:"Our NYK win prediction was correct. Projected NYK 116-104 (+12), actual NYK 113-102 (+11). Spread was -5.5, we called high confidence. The margin and direction were nearly exact." },
      { type:"MISSED", lesson:"WPA analysis (inpredictable): OG Anunoby was G1's true MVP (+20.8% WPA) — not Brunson (28pts) or Towns (25pts). The model overvalues box score production; OG's two-way impact (19pts + elite defense) was the game's decisive force. LVP was Daniels (-13.0%), confirming his scoring struggles hurt ATL despite elite passing. NYK dominated all four factors: FG +30.9%, FT +7.9%, Reb +2.7%, TOV +9.6% — a total systemic win." }
    ],
    game2: {
      spread: "NYK -5.5", moneyline: "NYK -220 / ATL +180", ou: "O/U 219.5",
      pick: "NYK", confidence: "medium", projScore: "NYK 113 — ATL 103",
      schedule: "Mon Apr 20 — 8:00 PM ET — NBC",
      reasoning: "BACKTEST-CALIBRATED PICK: NYK (medium confidence). The 2025 backtest validates this pick through Lesson 3 (System > Talent for individual games, Talent > System for series). NYK's systemBonus (+1.5 for Brown's defense) is a structural edge that ATL (systemBonus: 0) can't match scheme-for-scheme. The bounce-back model gives NYK 77% at home in R1 — the highest tier — but we're keeping medium confidence because Snyder's coaching adjustments (Lesson 2) could qualify that down. Key new factors: (1) Brunson's starCeiling:1 is lower than elite stars, meaning his ceiling game already happened (28pts Q1 explosion), (2) ATL has no players with playoffPedigree, reducing their 'championship DNA' adjustment to zero, (3) The 2025 backtest showed that teams winning G1 by 10+ in R1 went on to win G2 at 82% — NYK's +11 fits this pattern. However, Lesson 1 (HCA decays in later rounds) doesn't apply here since R1 HCA is still 3.0. Snyder's proven coaching (Lesson 2 qualifier) is the main reason this isn't high confidence. Shooting regression from 48% 3PT is expected but NYK's defensive identity is sustainable.",
      g1Adjustments: [
        "SNYDER ADJUSTMENT: 18-18 playoff record, took Jazz deep multiple times. Full game film on Brown's transition D scheme",
        "ATL bench depth crisis: Kuminga 8pts/27min, Gueye+Vincent 5pts combined — Snyder must find bench scoring or shorten rotation further",
        "ATL was competitive in 1H (55-57) — G1 collapse was Q3-specific, not a full-game blowout",
        "ATL needs to push pace (5th in NBA vs NYK 25th) — Snyder will scheme for early offense before NYK sets defense",
        "NYK 48% from 3 will regress — but defensive identity is sustainable",
        "Okongwu's 19pts on efficient shooting creates new schematic problems — he's more than a rim-runner now",
        "McCollum 26pts on 55% — veteran scorer who thrives in playoff environments (Portland experience)",
        "COACHING GAP: Brown G1 rated A (halftime transition D adjustment decisive) vs Snyder C (admitted KAT mismatch, no Q3 adjustment). But Snyder historically adjusts well between games."
      ],
      prosHome: ["Brunson MSG playoff aura: 28pts (19 in Q1, 8/10 FG) — trend continues", "Brown's transition D adjustment carries forward — starts G2 with G1 knowledge", "Towns' 2H surge shows dual-star resilience", "Robinson rim protection forced hack-a-Robinson — real defensive impact", "Talent gap at top: Brunson + Towns vs NAW + McCollum is decisive"],
      consHome: ["48% from 3 won't sustain — shooting regression expected", "Towns started 1/6 — cold-start risk persists", "Snyder is a proven playoff coach with full game film now", "Johnson's All-Star breakout (22.5/10.3/7.9) means ATL has a legit star matchup problem"],
      prosAway: ["SNYDER COACHING: 18-18 playoff record, multiple deep runs with Jazz. Will adjust.", "McCollum 26pts on 55% — veteran playoff scorer (Portland pedigree)", "ATL competitive in 1H (55-57) — not a total mismatch", "20-6 post-ASB identity built around pace — if Snyder can force tempo, ATL competes", "J.Johnson 23pts + Okongwu 19pts = multi-dimensional scoring threats", "Hield (.412 3P%) insertion into closing lineup could unlock needed spacing"],
      consAway: ["Brunson in Q1 was unanswerable — 8/10 FG defensive failure", "Lost Trae's 11.4 APG — structural creation gap persists", "34.8% Q3 shooting exposed half-court limitations", "NYK defensive identity is sustainable, unlike their shooting", "Bench depth crisis: Kuminga 8pts/27min, Vincent+Gueye 5pts combined"]
    },
    coaching: {
      home: {
        coach: "Mike Brown",
        adjustmentRating: 6,
        schemeCreativity: 6,
        urgency: 5,
        playoffRecord: "30-30 (career)",
        tendency: "Defense-oriented, 9-man rotation. NBA Cup winner in first season. Adaptability is key question from SAC experience.",
        rotationPlan: "9-man rotation: Brunson/Hart/Bridges/OG/Towns start + McBride/Robinson/Clarkson/Shamet or Yabusele. Sochan for specific defensive matchups only. Robinson strategic deployment for rim protection.",
        keyAdjustment: "Mitchell Robinson's physicality vs ATL frontcourt — 10.5 RPG, 2.0 BPG vs Hawks this season",
        g2Outlook: "A+ position. G1 halftime transition D adjustment was decisive and carries forward as institutional knowledge. Brown has game film confirming: (1) OG on Johnson is the nuclear option if needed, (2) Towns' 2H surge pattern works — don't force in 1H, (3) bench rotation of McBride/Clarkson/Shamet/Robinson outperforms ATL bench. Main G2 decision: does he shift OG onto Johnson full-time or keep current assignments? Shooting regression from 48% 3PT expected but defensive identity is sustainable. Brown's system advantage (+1.5 systemBonus vs Snyder's 0) is structural.",
        g1Performance: "A | Decisive halftime adjustment sealed the game — ATL had 18 fast-break points in 1H, near-zero in 2H after Brown installed transition defense scheme. OG Anunoby deployment as two-way weapon was the game's MVP call (+20.8% WPA). Brunson unleashed for 19pts in Q1 (8/10 FG) with play designs that exploited ATL's weak POA defense. Robinson's strategic rim protection forced ATL into hack-a-Robinson territory. Towns' 2H surge (19 of 25pts) managed perfectly — didn't force him when cold in 1H. NYK dominated all four factors (FG +30.9%, FT +7.9%, Reb +2.7%, TOV +9.6%). Brown's first playoff game as NYK coach was a statement."
      },
      away: {
        coach: "Quin Snyder",
        adjustmentRating: 7,
        schemeCreativity: 9,
        urgency: 7,
        playoffRecord: "18-19",
        tendency: "Motion offense, tight playoff rotation. Post-Trae era with NAW/McCollum as dual initiators.",
        rotationPlan: "8-man rotation tightened: McCollum/NAW/Daniels/Johnson/Okongwu start and close. Kuminga/Kispert/Hield off bench. Vincent/Houstan emergency only (G1 combined 5pts). Landale OUT (ankle).",
        keyAdjustment: "NAW's career year (20.8 PPG, 40% from 3) as primary scoring threat",
        g2Outlook: "Must-adjust game. G1 film shows: (1) transition offense was ATL's best weapon in 1H but Brown shut it down — Snyder needs counters (early push before NYK sets, secondary break actions), (2) McCollum 26pts on 55% was the bright spot — run more actions through him in half-court, (3) bench was catastrophic — Snyder may insert Hield into closing lineup for shooting, reduce Kuminga to 15min, (4) Towns stretch-5 game pulled Okongwu to perimeter — need Johnson to help protect rim or switch to small-ball with Kuminga at 5, (5) Daniels' 4pts/-13.0% WPA means his offense is hurting ATL — needs to be more aggressive attacking, not just facilitating. Snyder historically adjusts well between games but the talent gap may be too wide.",
        g1Performance: "C | Admitted post-game that KAT was an unsolved mismatch — not a great look for a coach with 18 playoff wins. Had no answer for Brunson's Q1 explosion (19pts, 8/10 FG). Bench was a disaster: Kuminga 8pts in 27min, Gueye+Vincent 5pts combined. ATL was competitive in 1H (57-55) using fast-break offense, but Snyder had no counter when Brown shut down transition in 2H. Q3 shooting collapsed to 34.8%. Daniels' deployment as primary passer had mixed results (11ast/9reb but -13.0% WPA). McCollum (26pts, 55% FG) and J.Johnson (23pts) showed individual scoring is there — Snyder needs to build a system around them. Has game film now and historically adjusts well between games."
      },
      bestLineups: {
        home: { players: ["Brunson","Bridges","OG","Towns","Hart"], netRtg:8.8, ortg:119.2, drtg:110.4, min:520, note:"Core closing 5 — best 4th-Q NetRtg in PBP era. G1 confirmed: dominated 2H" },
        homeBench: { players: ["McBride","Clarkson","Shamet","Yabusele","Robinson"], netRtg:2.5, ortg:112.0, drtg:109.5, min:180, note:"Bench unit — must outscore ATL's collapsed bench. Robinson anchors defense" },
        away: { players: ["NAW","McCollum","Daniels","J.Johnson","Okongwu"], netRtg:5.2, ortg:115.8, drtg:110.6, min:410, note:"Starting/closing 5. G1: competitive in 1H (57-55). McCollum 26pts was bright spot" },
        awayClosing: { players: ["NAW","McCollum","Hield","J.Johnson","Okongwu"], netRtg:3.8, ortg:117.2, drtg:113.4, min:120, note:"SHOOTING closing option: Hield (.412 3P%) replaces Daniels when ATL needs to outscore NYK. Sacrifices defense for spacing" }
      },
      roleChanges: [
        { team:"NYK", player:"Robinson", regSeason:"Bench C, 19 MPG", playoff:"Strategic weapon, 22+ MPG. G1: forced hack-a-Robinson — his rim protection was so impactful ATL resorted to fouling", impact:"up", reason:"10.5 RPG and 2.0 BPG vs ATL this season. Rim protection fills Towns gap defensively" },
        { team:"NYK", player:"Sochan", regSeason:"Bench forward, 18 MPG", playoff:"Situational defender only. 2.8 PPG means zero offensive role. Deploy for specific wing matchups", impact:"neutral", reason:"Brown values switchability but Sochan's limited offense (per Fadeaway World) caps his G2 role to 8-12 MPG max" },
        { team:"NYK", player:"McBride", regSeason:"6th man, 22 MPG", playoff:"Key rotation piece, 24+ MPG. 41.3% 3PT + tenacious defense", impact:"up", reason:"Best non-starter on NYK. Brown trusts him in closing situations" },
        { team:"NYK", player:"Clarkson", regSeason:"Bench guard, 18 MPG", playoff:"Bench scoring spark, 15-18 MPG. Fighting Alvarado for guard minutes", impact:"neutral", reason:"Microwave scorer off bench but defensive liability. Brown prefers McBride" },
        { team:"NYK", player:"Shamet", regSeason:"Bench wing, 16 MPG", playoff:"Wing rotation, 14-18 MPG. Best wing option off bench per Fadeaway World", impact:"neutral", reason:"3-and-D player fills minutes when Hart/Bridges/OG rest" },
        { team:"ATL", player:"NAW", regSeason:"Starting guard, 34 MPG", playoff:"Primary scorer in closing, 36+ MPG. G1: 17pts — solid but needs more to offset bench collapse", impact:"up", reason:"20.8 PPG with 40% from 3 is Snyder's weapon" },
        { team:"ATL", player:"Kispert", regSeason:"Bench shooter, 20 MPG", playoff:"May lose minutes to Hield, 12-15 MPG. .354 3PT not elite enough for tight rotation", impact:"down", reason:"Snyder tightens to 8-man and Hield's .412 3P% is more reliable" },
        { team:"ATL", player:"Okongwu", regSeason:"Starting C, 30 MPG", playoff:"Ironman C, 34+ MPG. G1: 19pts efficient — evolved offensive game. But sole rim protector burden is immense", impact:"up", reason:"Landale OUT means Okongwu plays through fatigue or ATL has NO rim protection" },
        { team:"ATL", player:"Hield", regSeason:"Bench shooter, 15 MPG", playoff:"Closing lineup candidate, 18+ MPG. Snyder may insert him for shooting in G2", impact:"up", reason:".412 3P% provides spacing ATL desperately needs. McCollum can't space alone" },
        { team:"ATL", player:"Kuminga", regSeason:"Bench forward, 22 MPG", playoff:"G1 disappointment: 8pts/27min. May see reduced role (15-18 MPG) unless he produces", impact:"down", reason:"Athletic finisher but couldn't finish in G1. Snyder may give his minutes to Hield/Risacher" }
      ]
    },
    xFactors: {
      home: {
        offense: { player:"Josh Hart", edge:"11pts/14reb/5ast G1, 15pts/13reb/6ast G2. Averaging 13pts/13.5reb/5.5ast — does everything: offensive boards, transition, playmaking. Longest-tenured starter whose hustle creates extra possessions. Brown will lean into his minutes even more.", avgOverPerformance:1.5 },
        defense: { player:"Mitchell Robinson", edge:"2blk G1, 1stl/1blk G2 in limited minutes (17mpg). Shot-blocking rim protector whose presence forced ATL into hack-a-Robinson — proving his defensive impact. Minutes may increase as Brown deploys him more against ATL's frontcourt.", avgOverPerformance:0 }
      },
      away: {
        offense: { player:"CJ McCollum", edge:"26pts G1 → 32pts G2 = 29.0 PPG avg (+10.3 over 18.7 season avg). Hunted Brunson 1-on-1 in G2 crunch time. Portland playoff pedigree activated — ATL's undisputed alpha closer. Snyder running more actions through him each game. Sustained overperformance, not a one-game spike.", avgOverPerformance:10.3 },
        defense: { player:"Dyson Daniels", edge:"Steals leader: 3stl G1, 2stl/1blk G2. MIP with D-LEBRON 1.907 — elite defensive engine. 9.9 defScore despite being WPA LVP in G1 (-13%). His ball-hawking disrupts NYK's half-court rhythm even when his own offense struggles.", avgOverPerformance:0 },
        offenseBench: { player:"Jonathan Kuminga", edge:"8pts G1 → 19pts G2 breakout (7-12 FG, +10). Scored 7 of 19pts in Q4 comeback. Snyder's Q4 switch (Kuminga on Towns) was the game-changer — NYK ORtg dropped from 134 to 66. Earned 34min trust in G2.", avgOverPerformance:3.5 }
      }
    },
    g3PlayerOutlook: {
      home: [
        { player:"Jalen Brunson", outlook:"neutral", projFgPct:0.42, ptsRange:[24,28], reason:"Road slump real (39.6% FG G1-G2, 3-11 in Q4s) but regression toward 47.5% season mean expected. Daniels matchup disrupts but volume stays elite.", confidence:"medium" },
        { player:"Karl-Anthony Towns", outlook:"good", projFgPct:0.58, ptsRange:[22,27], reason:"28.5 PPG on 63% FG vs ATL in regular season. Brown will counter Kuminga-on-Towns scheme with more post-ups vs Okongwu (knee inflammation, foul trouble). Stretch-5 game pulls ATL's sole rim protector to perimeter.", confidence:"high" },
        { player:"OG Anunoby", outlook:"good", projFgPct:0.52, ptsRange:[16,21], reason:"G1 WPA MVP (+20.8%), 66% FG in G1. Road splits historically solid. G2 missed FTs (not FGs) show confidence intact. Two-way impact translates anywhere.", confidence:"high" },
        { player:"Mikal Bridges", outlook:"bad", projFgPct:0.35, ptsRange:[8,14], reason:"Extended slump — never surpassed 15pts in 16 of 18 pre-playoff games. 3-10 G2, missed buzzer-beater. Pattern is season-long, not matchup-specific. Psychological pressure mounting.", confidence:"high" },
        { player:"Josh Hart", outlook:"good", projFgPct:0.48, ptsRange:[14,18], reason:"26 combined rebounds in G1-G2 proves hustle translates road/home equally. Opportunistic scoring from offensive boards and transition. Brown leaning into his minutes.", confidence:"medium" },
        { player:"Miles McBride", outlook:"neutral", projFgPct:0.38, ptsRange:[4,10], reason:"0-7 G2 likely one-off given 41.3% career 3PT. Returning from 28-game injury absence, residual pain. Road environment may ease MSG pressure.", confidence:"medium" },
        { player:"Mitchell Robinson", outlook:"neutral", projFgPct:0.65, ptsRange:[10,15], reason:"6-6 FG G2 efficiency elite. Lob/putback finisher role sustains regardless of venue. -10 net rating was Q4 garbage-time artifact during Hawks comeback.", confidence:"medium" },
        { player:"Jordan Clarkson", outlook:"good", projFgPct:0.45, ptsRange:[10,14], reason:"11.7 career playoff PPG in 43 games — elevates in postseason. 44% FG in G1 (4-6). Fresh legs from limited recent minutes. Bench scoring critical after G2 drought.", confidence:"medium" }
      ],
      away: [
        { player:"CJ McCollum", outlook:"good", projFgPct:0.52, ptsRange:[26,34], reason:"29.0 PPG through 2 games including 32pts at MSG. HOME now — amplifies crunch-time hunting of Brunson. Portland playoff pedigree (4 series wins) proves this is sustainable, not a hot streak.", confidence:"high" },
        { player:"Jalen Johnson", outlook:"neutral", projFgPct:0.46, ptsRange:[18,24], reason:"All-Star steady at 20.0 PPG but not explosive yet (23→17). Slow starts both games suggest adjustment period. Home crowd may unlock higher gear but no evidence of dramatic uplift.", confidence:"medium" },
        { player:"Nickeil Alexander-Walker", outlook:"bad", projFgPct:0.38, ptsRange:[10,16], reason:"G2 collapse (9pts, 3-12 FG) is concerning. Playoff defense tightening — Bridges/OG length disrupts his rhythm. 28 PPG regular season pace unsustainable vs NYK's elite wing D.", confidence:"high" },
        { player:"Onyeka Okongwu", outlook:"neutral", projFgPct:0.58, ptsRange:[12,18], reason:"Declining trend 19→15pts with knee inflammation. Sole rim protector burden is immense — fatigue compounds each game. Efficient when he gets touches but touch/stamina eroding.", confidence:"medium" },
        { player:"Jonathan Kuminga", outlook:"neutral", projFgPct:0.54, ptsRange:[12,20], reason:"G2 breakout (19pts, 7-12 FG) as Snyder's Q4 weapon. Contained Towns defensively. Sustainable if given same crunch-time role but Brown will counter-scheme.", confidence:"medium" },
        { player:"Dyson Daniels", outlook:"bad", projFgPct:0.25, ptsRange:[2,8], reason:"Offensive liability confirmed: 4pts G1, 6pts G2. Elite defender but .556 3PT burst won't translate vs playoff intensity. Home court doesn't fix offensive limitations.", confidence:"high" },
        { player:"Corey Kispert", outlook:"neutral", projFgPct:0.42, ptsRange:[2,6], reason:"Limited minutes both games. May earn slightly more run at home for spacing but bench role caps ceiling.", confidence:"medium" },
        { player:"Buddy Hield", outlook:"bad", projFgPct:null, ptsRange:[0,3], reason:"Frozen out of rotation despite .412 3PT. Snyder favors Kispert. No indication of G3 minutes. DNP likely.", confidence:"high" }
      ]
    },
    game3: {
      spread: "NYK -3.5", moneyline: "NYK -140 / ATL +120", ou: "O/U 215.5",
      pick: "NYK", confidence: "medium", projScore: "NYK 111 — ATL 105",
      schedule: "Thu Apr 24 — 7:00 PM ET — TNT",
      reasoning: "MODEL PICK: NYK 111-105 (MEDIUM confidence, NYK by 6). Despite Atlanta stealing homecourt with a dramatic G2 comeback, the model projects New York to reassert dominance as the series shifts to State Farm Arena. The 6-point margin reflects NYK's structural advantages overcoming ATL's home court. Here's why: (1) TALENT EDGE (1.25x multiplier) — New York's top-end talent is significantly deeper. Brunson (86 rating), Towns (82), Anunoby (80), and Bridges (76) give NYK four high-level players. ATL's top tier is McCollum (78) and Jalen Johnson (76) — a clear drop-off after the top two. The model weights star power heavily in playoff series. (2) DEPTH ADVANTAGE (1.2x edge) — NYK's bench has Robinson (73), Clarkson (68), and proven playoff contributors. While NYK's bench had a nightmare G2 (McBride/Shamet/Alvarado 0pts on 0-7 FG), regression to the mean is the model's strongest principle — that level of futility is unsustainable. ATL's bench outside Kuminga is thin, with Kispert, Vincent, and Bradley providing minimal offensive punch. (3) BRUNSON BOUNCE-BACK EXPECTED — Brunson shot 39.6% through 2 games and went 3-11 in Q4s. Historical data shows elite guards rebound from cold stretches — his 86 rating and 28.7 PPG season average suggest significant positive regression. (4) FREE THROW CORRECTION — NYK shot a disastrous 63% from the FT line in G2 (17-27), costing them the game. Anunoby's 2 missed FTs with 1:54 left were decisive. NYK shot 79.6% FT in the regular season — this corrects naturally. (5) GRIND CHARACTER — The engine projects a physical, halfcourt-oriented game. NYK's defensive identity (Anunoby, Bridges, Hart) thrives in this style, and their size advantage over ATL's perimeter-heavy attack should translate to paint dominance.\n\n(6) 3PT VARIANCE: McCollum is 5-16 from 3 for the series (31.3%) — well below his season ~37% baseline. Expect regression UP to ~35% at home. Brunson is 6-14 from 3 (42.9%) — slight regression DOWN expected. ATL as a team shot 39% from 3 in G2 — near baseline, minimal movement. Net 3PT swing: ~neutral, with both teams regressing toward means.\n\n(7) TURNOVER ANALYSIS: NYK's bench had 5 TOs in G2 (McBride/Shamet/Alvarado combined 0pts, 5 TOs). NYK averaged ~12 TOs across 2 games. ATL averaged ~14 TOs. On the road, NYK's ball handling could be slightly disrupted by crowd noise. Project NYK 12-13 TOs, ATL 13-14 TOs. Not a decisive factor but NYK's TO advantage provides ~2 extra possessions.\n\n(8) YOUTH BREAKOUT WATCH: Kuminga (age 22, Phase 29 active!) is the prime candidate — 8pts G1 → 19pts/+10 G2. At home in State Farm Arena, his athletic finishing and transition game get a boost. Snyder expanded his role (27→34 min). Also watch Murray-Boyles (rookie, if on ATL) — any young ATL role player getting expanded minutes at home could surprise.",
      g2Adjustments: [
        "HAWKS ERASED 12-POINT Q4 DEFICIT ON THE ROAD: ATL trailed by 12 entering the 4th quarter at MSG but outscored NYK 28-15 in Q4. The Hawks shot 72.2% (13-18 FG) in the final frame while NYK collapsed to 22.7% (5-22 FG). This was the largest Q4 comeback in these playoffs.",
        "MCCOLLUM ASCENDING TO ALPHA STATUS: CJ McCollum scored 32pts on 12-22 FG with 6 assists and a +9 net rating. He hunted Brunson 1-on-1 in crunch time and hit go-ahead jumpers. After 26pts in G1, McCollum is averaging 29.0 PPG on efficient shooting — he's ATL's undisputed closer.",
        "KUMINGA MASSIVE BOUNCE-BACK: After a disappointing 8pts in G1, Kuminga exploded for 19pts on 7-12 FG with a team-best +10 in 34 minutes. Snyder's Q4 adjustment of putting Kuminga on Towns was the game-changer — NYK's ORtg with a wing guarding KAT was just 66 vs 134 with a big.",
        "KNICKS Q4 COLLAPSE PATTERN: NYK went 5-22 FG (22.7%) in the 4th quarter across G2 — and Brunson is now 3-11 in Q4s for the series. This is a concerning trend that suggests late-game execution issues, not just variance. Mike Brown's heavy minutes distribution (4 starters 35+ min) may be causing fatigue.",
        "NYK FREE THROW CRISIS: The Knicks shot 63% from the FT line (17-27 in G2) despite being a 79.6% FT team in the regular season. Anunoby missed 2 critical FTs with 1:54 left that would have extended the lead to 4. This is the kind of variance that corrects — expect NYK closer to 78-80% in G3.",
        "SNYDER'S DEFENSIVE CHESS MOVE: Quin Snyder's Q4 switch — Kuminga on KAT, Okongwu on Hart — completely shut down NYK's offense. The data is stark: NYK ORtg dropped from 134 to 66 when a wing defender guarded Towns instead of a big. Expect this adjustment to carry into G3 as a base scheme.",
        "NYK BENCH CRISIS: McBride, Shamet, and Alvarado combined for 0 points on 0-7 shooting with 5 turnovers. This is historically bad bench production and almost certainly regresses, but it signals NYK may need to shorten rotation to 8 players.",
        "OKONGWU PLAYING THROUGH KNEE INFLAMMATION: Despite knee issues, Okongwu posted 15pts/8reb on 6-9 FG including 2-3 from 3PT. His durability is impressive but concerning — he's ATL's sole rim protector with Landale OUT. Fatigue could compound in a G3 back-to-back scenario.",
        "HCA SHIFTS TO ATLANTA: Games 3 and 4 at State Farm Arena. ATL was 26-15 at home this season. The model's round-adjusted HCA gives ATL approximately +2.5 points at home, which partially offsets NYK's talent edge. However, NYK was 25-16 on the road — elite road team.",
        "BRIDGES GAME-WINNER RIMMED OUT: Mikal Bridges' midrange jumper at the buzzer barely missed. Despite his 10pts on 3-10 shooting, Bridges showed he can be the closer NYK needs. His shot quality in the final possession was excellent — expect Brown to draw up similar looks."
      ],
      prosHome: ["Talent edge (1.25x) — NYK has 4 players rated 76+ vs ATL's 2","Brunson historical bounce-back pattern after cold shooting stretches","Free throw regression — 63% G2 vs 79.6% season average means easy points returning","NYK elite road team (25-16) — State Farm Arena doesn't intimidate","Bench regression — 0pts from McBride/Shamet/Alvarado is unsustainable","Depth advantage (1.2x) — Robinson, Clarkson provide reliable bench scoring","Defensive identity — OG/Bridges/Hart can lock down ATL's perimeter creators","KAT dominated when guarded by bigs (134 ORtg) — Brown will counter Snyder's switch"],
      consHome: ["Brunson 3-11 in Q4s — late-game execution is a pattern, not just variance","Snyder's Kuminga-on-KAT scheme crushed NYK offense (66 ORtg with wing on KAT)","Heavy minutes (4 starters 35+ min) suggests fatigue risk in back-to-back games","Brown may be slow to counter Snyder's Q4 switch — SAC tenure showed occasional rigidity"],
      prosAway: ["McCollum averaging 29.0 PPG on efficient shooting — alpha closer emergence","Kuminga bounce-back arc: 8pts G1 → 19pts/+10 G2 — trending sharply upward","Snyder's Q4 defensive adjustment is REPEATABLE and devastating (NYK 66 ORtg)","Home court advantage — ATL 26-15 at home, crowd energy after stealing G2 at MSG","Series momentum — winning on the road at MSG is a massive confidence boost","Johnson steady (20.0 PPG, 8.0 RPG through 2 games) — underrated two-way force"],
      consAway: ["Okongwu knee inflammation — sole rim protector with no Landale backup","Bench depth outside Kuminga is thin — Kispert/Vincent/Bradley are limited","ATL shot 72.2% in Q4 of G2 — that level of shooting is not sustainable","McCollum's 3PT shooting (5-16 for series, 31.3%) suggests scoring may come less efficiently","NAW inconsistency: 17pts G1 → 9pts G2 on 3-12 FG — ATL needs a reliable 3rd scorer","Daniels +/- cratering: -15 in G2 despite solid box stats — defensive anchor struggling"]
    },
    games: [{num:1,result:"NYK",homeScore:113,awayScore:102,winner:"NYK",notes:"Brunson 28pts/5reb/7ast (19 in Q1, 8/10 FG), Towns 25pts/8reb/4ast/3blk (19 in 2H after 1/6 start), OG 19pts, Hart 10pts/14reb. ATL: McCollum 26pts, J.Johnson 23pts, Okongwu 19pts, NAW 17pts, Daniels 4pts/11ast/9reb/3stl (glue guy). ATL bench crisis: Kuminga 8pts/27min, Gueye+Vincent 5pts combined. NYK held ATL (5th-best post-ASB ORtg) to 102. Brown's halftime transition D adjustment decisive — ATL had 18 fast-break pts in 1H, nearly zero in 2H. WPA: MVP OG Anunoby +20.8%, LVP Daniels -13.0%. NYK dominated all four factors: FG +30.9%, FT +7.9%, Reb +2.7%, TOV +9.6%."},{num:2,result:"ATL",homeScore:106,awayScore:107,winner:"ATL",notes:"ATL 107-106. Series tied 1-1. Hawks erased 12-point Q4 deficit to stun Knicks at MSG. McCollum 32pts (12-22 FG, 3-10 3PT, 5-7 FT) 3reb/6ast, +9 — hunted Brunson in crunch time, hit go-ahead jumpers. Kuminga 19pts off bench (7-12 FG) in 34min, +10 — massive G2 bounce-back. J.Johnson 17pts/8reb/3ast. Okongwu 15pts/8reb (6-9 FG, 2-3 3PT) played through knee inflammation. NYK: Brunson 29pts (10-26 FG, 4-10 3PT) 7ast but 3-11 in Q4s for series. KAT 18pts/8reb (8-12 FG, 14 in Q3). Hart 15/13reb/6ast. OG 14pts but missed 2 crucial FTs with 1:54 left. Bridges 10pts, missed game-winner at buzzer. M.Robinson 13pts/7reb (6-6 FG) but -10. Q4 collapse: NYK 5-22 FG (22.7%), ATL 13-18 (72.2%). ATL won Q4 28-15. NYK shot 63% FT (17-27). Snyder Q4 adjustments: Kuminga on KAT, Okongwu on Hart. NYK bench (McBride/Shamet/Alvarado) combined 0pts on 0-7 FG. Series shifts to Atlanta for G3 Thu."},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "CLE-TOR", conf: "East", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Craig Porter Jr.", target:"Scottie Barnes", dLebron:1.177, targetUsg:25.0, note:"G1-G2: Barnes bounced back from WPA LVP in G1 (21pts) to 26pts/5ast in G2 on 11/19 FG. CLE's paint denial still effective (TOR 22 TOs in G2) but Barnes found individual offense. The BIGGER defensive story is Ingram suppression — CLE's scheme LOCKED him down (17pts G1, 7pts/3-15 FG in G2). Mobley's help defense and CLE's switching are the series-defining scheme." },
      awayDefOnHome: { defender:"Scottie Barnes", target:"Donovan Mitchell", dLebron:1.914, targetUsg:31.0, note:"G1-G2: Mitchell 32pts→30pts. Barnes cannot contain Mitchell — CLE's 3-initiator system (Mitchell 30, Harden 28, Mobley 25 in G2) overwhelms any individual defender. All three CLE stars scored 25+ in G2, which is historically rare. Suppression diluted to ~20% as Harden shifted from facilitator to scorer role." },
      secondaryMatchups: [
        { defender:"Evan Mobley", target:"Scottie Barnes", note:"THE series matchup. G2: Barnes 26pts vs Mobley's 25pts on 11/13 FG. Barnes won the scoring duel but Mobley's efficiency (84.6% FG) is unsustainable AND dominant. Mobley's two-way ceiling keeps rising each game." },
        { defender:"CLE scheme", target:"Brandon Ingram", note:"G1→G2 SCHEME LOCK: Ingram went 17pts (5/9)→7pts (3/15). CLE's defensive scheme has completely figured him out. 5 turnovers in G2. This is a REPEATABLE outcome — expect continued suppression in G3+." },
        { defender:"Jarrett Allen", target:"Jakob Poeltl", note:"G1→G2: Poeltl's role COLLAPSED from 21min to 9min. Allen's rim protection + Mobley's help made Poeltl unplayable. Mamukelashvili (20min, 12/10) and Murray-Boyles (25min, 17pts) took his minutes. Poeltl may be out of rotation G3." },
        { defender:"Harden + Mitchell", target:"TOR transition", note:"G1→G2 CONFIRMED REPEATABLE: TOR 18 TOs in G1, 22 TOs in G2. CLE's backcourt pressure + transition defense is the series' most reliable scheme. TOR cannot solve it." }
      ]
    },
    homeTeam: {
      name: "Cavaliers", city: "Cleveland", abbr: "CLE", seed: 4, record: "52-30",
      systemBonus: 1.5, // elite system
      playoffPedigree: 0, // this core hasn't gone deep
      offStyle: "Triple-initiator system: Mitchell ISO/P&R, Harden creation/PnR, Mobley as tertiary creator. Most initiator redundancy in bracket — extremely resilient. Garland traded to LAC for Harden (Feb 4). CLE 21-6 since trade.", initiators: 3,
      color: "#860038", color2: "#FDBB30",
      advStats: { ortg:117.5, drtg:112.8, netRtg:4.7, pace:98.5, ts:58.8, efg:55.5, tov:12.8, reb:50.5, ortgRk:4, drtgRk:15, clutchNetRtg:5.5, last10:"7-3", fgPct:52.5, threePct:36.8, ftPct:79.6, orbPct:24.4 },
      players: [
        { name:"Donovan Mitchell", pos:"SG", rating:87, ppg:27.9, rpg:4.5, apg:5.8, fgp:47.5, per:22.9, ts:61.2, epm:5.8, bpm:5.1, ws48:.195, onOff:7.5, clutch:8.5, vorp:4.2, usg:31.0, injury:null, lebron:3.426, oLebron:3.7, dLebron:-0.274, war:8.578, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"G1 CONFIRMED alpha scorer: 32pts (11/20 FG). Harden's playmaking freed Mitchell to play off-ball more — their coexistence works perfectly. 8.5 clutch rating, 61.2 TS%. Barnes D-LEBRON (1.914) is TOR's best weapon vs him but CLE has 3 initiators diluting the suppression effect. Playoff history: 50pt game vs DAL (2022), proven postseason performer", baseRating:87, starCeiling:1, injuryRisk:0, playoffAscension:1.0 },
        { name:"James Harden", pos:"PG", rating:80, ppg:20.5, rpg:4.8, apg:7.7, fgp:45.2, per:21.8, ts:63.9, epm:4.0, bpm:4.5, ws48:.162, onOff:5.8, clutch:7.0, vorp:1.3, usg:26.8, injury:null, lebron:2.107, oLebron:3.304, dLebron:-1.197, war:6.967, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Per Fadeaway World: 20.5/4.8/7.7 in 26 games since arriving. G1 CONFIRMED orchestrator role: 22pts/10ast. Accepted secondary role — Mitchell was alpha (32pts), Harden organized offense. CLE 21-6 since trade (78% win rate). +26.7 NetRtg in Mitchell-Harden minutes. Harden's arrival led to noticeable bump in Mobley AND Allen production. Historical playoff concern mitigated by being 2nd option", baseRating:80, starCeiling:1, injuryRisk:0.4, playoffAscension:-0.5 },
        { name:"Evan Mobley", pos:"PF", rating:80, ppg:18.2, rpg:9.0, apg:3.5, fgp:52.5, per:22.2, ts:59.8, epm:4.2, bpm:4.5, ws48:.172, onOff:6.5, clutch:6.5, vorp:3.6, usg:25.0, injury:null, lebron:3.067, oLebron:1.721, dLebron:1.346, war:7.146, offRole:"Shot Creator", defRole:"Mobile Big",
          matchupNote:"Per Fadeaway World: former DPOY, 18.2/9.0/1.7blk. Harden's arrival led to noticeable offensive bump. Two-way star. Barnes matchup is THE series. +6.5 on/off. G1: 17/7 while Barnes was WPA LVP", baseRating:80, starCeiling:1, injuryRisk:0 },
        { name:"Jarrett Allen", pos:"C", rating:73, ppg:15.4, rpg:8.5, apg:1.8, fgp:63.2, per:19.8, ts:65.4, epm:2.2, bpm:2.5, ws48:.148, onOff:3.8, clutch:5.2, vorp:2.2, usg:22.0, injury:"GTD — knee tendonitis", lebron:2.134, oLebron:0.939, dLebron:1.195, war:4.365, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Per Fadeaway World: 15.4/8.5 — thriving with pass-first Harden feeding him. Twin towers with Mobley is one of most intimidating frontcourts in East. Poeltl matchup is physical. G1: dominated paint (48-30 CLE advantage)", baseRating:73, injuryRisk:0.4, activeInjury:{type:"knee tendonitis",severity:0.4,note:"Chronic knee tendonitis. GTD status. Limits vertical explosiveness and rim protection energy over long series."} },
        { name:"Dean Wade", pos:"SF", rating:58, ppg:5.8, rpg:4.2, apg:1.2, fgp:42.5, per:10.5, ts:55.0, epm:0.0, bpm:-0.5, ws48:.058, onOff:0.5, clutch:3.5, vorp:0.3, usg:14.0, injury:null, lebron:0.5, oLebron:-0.2, dLebron:0.7, war:2.0, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"Per Fadeaway World: STARTING SF — 5.8/4.2. Makeshift SF role but provides high-effort defense and ability to stretch the floor. With Strus missing most of season with injury, Wade is the safest option due to superior defensive ability. QUESTION MARK position — CLE's glaring weakness per Fadeaway. May rotate with Strus/Ellis game-to-game", baseRating:58 },
        { name:"Dennis Schroder", pos:"PG", rating:62, ppg:8.2, rpg:2.5, apg:4.3, fgp:43.5, per:13.0, ts:55.0, epm:0.2, bpm:0.0, ws48:.068, onOff:0.5, clutch:4.5, vorp:0.5, usg:18.0, injury:null, lebron:0.5, oLebron:0.3, dLebron:0.2, war:1.5, offRole:"Secondary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Per Fadeaway World: veteran guard acquired Feb — 8.2/4.3ast. Minutes must be regulated carefully since Harden/Mitchell are featured ball-handlers. Provides backup creation when stars rest. Playoff-experienced veteran (multiple teams/playoffs)", baseRating:62 },
        { name:"Sam Merrill", pos:"SG", rating:65, ppg:12.8, rpg:2.8, apg:1.8, fgp:44.2, per:14.2, ts:60.5, epm:0.5, bpm:0.2, ws48:.078, onOff:1.0, clutch:5.0, vorp:0.9, usg:20.0, injury:null, lebron:1.289, oLebron:1.567, dLebron:-0.278, war:3.235, offRole:"Movement Shooter", defRole:"Chaser",
          matchupNote:"Per Fadeaway World: 12.8 PPG on 42.4% 3PT — best shooting option on roster outside guard position. Proven reliable shooter. Hard to see his minutes disappearing. Rating bumped 63→65", baseRating:65 },
        { name:"Max Strus", pos:"SG", rating:65, ppg:11.2, rpg:5.4, apg:1.5, fgp:43.8, per:13.5, ts:58.5, epm:0.5, bpm:0.2, ws48:.078, onOff:1.2, clutch:5.5, vorp:0.9, usg:19.5, injury:null, lebron:-0.409, oLebron:0.15, dLebron:-0.559, war:0.37, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"Per Fadeaway World: 11.2/5.4, 40.2% 3PT — first forward off bench. Missed most of season with injury. G1 WPA MVP (+16.6%) with 24pts (8/10 FG) — high-end outlier but 40% career playoff 3PT range. Star talent creates open looks for Strus. May replace Wade in closing lineup based on production", baseRating:65 },
        { name:"Jaylon Tyson", pos:"SF", rating:64, ppg:13.2, rpg:5.1, apg:2.0, fgp:44.8, per:13.8, ts:55.5, epm:0.2, bpm:-0.1, ws48:.072, onOff:0.5, clutch:4.5, vorp:0.7, usg:19.5, injury:null, lebron:0.604, oLebron:0.804, dLebron:-0.2, war:3.414, offRole:"Movement Shooter", defRole:"Chaser",
          matchupNote:"Per Fadeaway World: 13.2/5.1 — bench wing. 23-year-old who may get opportunities. Per Fadeaway World, one of three contenders for SF starting role but Wade won out. Provides scoring punch off bench", baseRating:64 },
        { name:"Keon Ellis", pos:"SG", rating:58, ppg:8.3, rpg:2.5, apg:1.5, fgp:43.0, per:11.0, ts:54.0, epm:0.0, bpm:-0.3, ws48:.060, onOff:0.5, clutch:4.0, vorp:0.3, usg:15.0, injury:null, lebron:0.3, oLebron:-0.3, dLebron:0.6, war:1.5, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"Per Fadeaway World: 8.3/1.3stl in 29 games — primarily a defensive presence. Used as 5th man alongside core four as elite defender. His 6'4 presence makes CLE too undersized alongside Harden/Mitchell though. Could plug POA defense holes in specific matchups", baseRating:58 },
        { name:"Craig Porter Jr.", pos:"PG", rating:60, ppg:6.5, rpg:2.2, apg:3.1, fgp:46.2, per:13.5, ts:57.8, epm:0.8, bpm:0.5, ws48:.085, onOff:2.5, clutch:5.0, vorp:0.6, usg:16.5, injury:null, lebron:1.802, oLebron:0.626, dLebron:1.177, war:3.062, offRole:"Secondary Ball Handler", defRole:"Point of Attack",
          matchupNote:"LEBRON hidden gem: 1.802 LEBRON / 3.062 WAR despite modest box stats. Elite D-LEBRON (1.177) as Point of Attack defender. CLE's best bench connector by advanced impact", baseRating:60 }
      ],
      synergy: [
        { players:["Harden","Mitchell","Wade","Mobley","Allen"], score:82, note:"Per Fadeaway World STARTING/CLOSING 5. Wade is the SF pick for defense + floor-stretching. +26.7 NetRtg per 100 in Mitchell-Harden mins. G1 CONFIRMED: Mitchell 32pts, Harden 22/10ast, paint dominance 48-30. High PnR destroyed Poeltl's drop coverage" },
        { players:["Harden","Mitchell","Strus","Mobley","Allen"], score:80, note:"Per Fadeaway World: Strus may replace Wade in closing if production dictates. G1: Strus 24pts (8/10 FG) as 6th man. Maximizes Harden's playmaking — Strus/Mitchell as dual shooting threats. 5th man rotates game-to-game per Fadeaway" },
        { players:["Schroder","Merrill","Strus","Tyson","Mobley"], score:68, note:"BENCH unit: Schroder handles ball (8.2/4.3ast), Merrill (42.4% 3PT) + Strus (40.2% 3PT) space floor. Tyson provides wing scoring (13.2 PPG). Mobley anchors defense if Allen rests. CLE bench depth outscored TOR bench in G1" },
        { players:["Harden","Mitchell","Ellis","Mobley","Allen"], score:78, note:"DEFENSIVE option: Ellis (1.3 SPG) replaces Wade for elite POA defense. Per Fadeaway World: used as 5th man for defensive boost. Undersized (6'4) but defenses tighten with him + twin towers" },
        { players:["Harden","Mitchell","Merrill","Mobley","Tyson"], score:72, note:"SMALL-BALL if Allen sits (GTD knee). Mobley at 5, more perimeter shooting. Merrill 42.4% 3PT + Tyson 13.2 PPG. Used in matchup-specific spots vs TOR small lineups" }
      ]
    },
    awayTeam: {
      name: "Raptors", city: "Toronto", abbr: "TOR", seed: 5, record: "46-36",
      systemBonus: 0,
      playoffPedigree: 0,
      offStyle: "Barnes + Ingram dual creation. Transition offense key secondary weapon. Conventional style overall.", initiators: 2,
      color: "#CE1141", color2: "#000000",
      advStats: { ortg:115.6, drtg:113.2, netRtg:2.4, pace:97.8, ts:57.2, efg:53.8, tov:13.2, reb:50.8, ortgRk:16, drtgRk:7, clutchNetRtg:3.2, last10:"7-3", fgPct:50.8, threePct:34.2, ftPct:76.4, orbPct:24.6, last10DRtg:105.7, regSeasonVsCLE:"3-0" },
      players: [
        { name:"Brandon Ingram", pos:"SF", rating:78, ppg:21.5, rpg:5.6, apg:3.7, fgp:47.8, per:20.5, ts:58.2, epm:2.8, bpm:2.5, ws48:.142, onOff:4.2, clutch:5.8, vorp:2.7, usg:27.0, injury:null, lebron:-0.663, oLebron:0.178, dLebron:-0.841, war:2.931, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Acquired from NOP (Feb 6 2025 deadline). All-Star replacement (for injured Curry). 77 games, team-high 33.8 MPG — outstanding durability. Smooth mid-range but SPACING CONCERN: only .329 3P% — clogs floor vs CLE's twin towers. G1: 17pts (below avg) — CLE length (Mobley/Allen) affected driving lanes. Half-court shot creator whose efficiency drops when paint is packed. 3yr/$120M extension", baseRating:78 },
        { name:"RJ Barrett", pos:"SF", rating:74, ppg:19.3, rpg:5.3, apg:3.3, fgp:47.0, per:18.2, ts:58.5, epm:2.0, bpm:1.8, ws48:.125, onOff:3.5, clutch:5.5, vorp:2.2, usg:25.5, injury:null, lebron:1.195, oLebron:1.229, dLebron:-0.034, war:3.953, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"TOR's BEST player in G1: 24pts (7-13 FG, 3-6 3PT, 7-9 FT). Entered playoffs hot — 21.5 PPG in final 8 games. Third scoring option but production nearly matches Ingram (19.3 vs 21.5). 58.5% TS shows continued efficiency growth from NYK days. Drives aggressively, physical scorer who gets to the line", baseRating:74 },
        { name:"Scottie Barnes", pos:"PF", rating:80, ppg:18.1, rpg:7.5, apg:5.9, fgp:49.2, per:20.8, ts:57.3, epm:3.8, bpm:4.0, ws48:.158, onOff:6.2, clutch:6.5, vorp:3.2, usg:25.0, injury:null, lebron:2.995, oLebron:1.081, dLebron:1.914, war:9.119, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"ALL-STAR (first selection). PPG drop from 23.5→18.1 is BY DESIGN — Ingram took primary creation, Barnes shifted to 'do-everything' facilitator. EC Defensive Player of Month (Oct/Nov). Set franchise record for consecutive games with 1+ STL and 1+ BLK (surpassed Carter). G1: 21pts/7ast but WPA LVP (-7.6%) — Mobley got under his skin. Rajakovic wants 'a different Scottie' in G2. Mobley matchup is THE series", baseRating:80, starCeiling:1, injuryRisk:0 },
        { name:"Immanuel Quickley", pos:"PG", rating:65, ppg:16.4, rpg:4.0, apg:6.1, fgp:44.3, per:16.2, ts:57.2, epm:1.5, bpm:1.2, ws48:.102, onOff:2.5, clutch:5.8, vorp:1.6, usg:23.8, injury:"Right hamstring strain — PROBABLE G3 (11 days rest)", lebron:2.276, oLebron:1.969, dLebron:0.307, war:6.608, offRole:"Primary Ball Handler", defRole:"Point of Attack", activeInjury:{type:"right hamstring strain",severity:0.3,note:"EXPECTED BACK G3. Strained hamstring reg-season finale (Apr 12). OUT G1+G2. 11 days rest by G3. Rajakovic: 'We missed Quickley big time.' Yahoo confirmed G3 return expected. Severity downgraded 0.5→0.3 reflecting recovery timeline. Rust factor — missed 2 playoff games."},
          matchupNote:"QUESTIONABLE G2. If healthy: 16.4 PPG, 6.1 APG, .374-.391 3P% as starting PG. His return transforms TOR offense — organizes halfcourt, spaces floor, adds a 3rd initiator. Without him: TOR had 18 TOs, 1 fast-break pt, Shead's .336 3P% lets CLE pack the paint. Rajakovic: 'making progress' but hamstring timelines are unpredictable", baseRating:71 },
        { name:"Jakob Poeltl", pos:"C", rating:64, ppg:10.7, rpg:7.0, apg:2.0, fgp:57.8, per:16.2, ts:70.1, epm:1.0, bpm:0.8, ws48:.105, onOff:2.5, clutch:4.0, vorp:1.0, usg:19.5, injury:null, lebron:-0.18, oLebron:-1.097, dLebron:0.917, war:1.641, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"G1 NO-SHOW: 4pts/6reb. CLE's twin towers (Mobley+Allen: 27pts/14reb, 9-13 FG) dominated him. DROP COVERAGE EXPLOITED: CLE ran PnR extremely high, pulling Poeltl far from rim, creating driving lanes for Mitchell/Harden. CLE paint dominance 48-30. Mamukelashvili (15.3 PPG in 7 starts) may steal minutes in G2. Back problems limited availability during season", baseRating:64 },
        { name:"Gradey Dick", pos:"SG", rating:52, ppg:6.3, rpg:1.9, apg:1.5, fgp:39.7, per:9.2, ts:52.0, epm:-0.5, bpm:-0.8, ws48:.042, onOff:0.5, clutch:3.5, vorp:0.2, usg:16.0, injury:null, lebron:-2.484, oLebron:-1.8, dLebron:-0.684, war:-0.007, offRole:"Movement Shooter", defRole:"Low Activity",
          matchupNote:"SOPHOMORE SLUMP: 6.3 PPG, .309 3P% (down from .350 rookie year). Only 15.7 MPG. Pushed down the rotation by Ingram's arrival. Not a meaningful playoff rotation piece. CLE can ignore him defensively", baseRating:52 },
        { name:"Jamal Shead", pos:"PG", rating:58, ppg:6.7, rpg:1.9, apg:5.4, fgp:36.8, per:11.0, ts:50.5, epm:0.0, bpm:-0.5, ws48:.058, onOff:0.3, clutch:4.5, vorp:0.4, usg:15.5, injury:null, lebron:0.156, oLebron:-0.117, dLebron:0.273, war:3.037, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"STARTER in G1 (28:20 min) with Quickley OUT. Rookie PG (20.6 MPG, 75 games reg season). G1: 17pts on 5-of-6 from 3 — CAREER-LEVEL outlier (regular 33.6% 3PT, 36.8% FG). Strong defender and distributor (5.4 APG in 20 min is elite per-36) but lacks scoring punch. If Quickley remains out, Shead starts G2. CLE can sag off Shead (.336 3P%) and clog driving lanes. G1 shooting is unsustainable — regression expected", baseRating:58 },
        { name:"Ja'Kobe Walter", pos:"SG", rating:55, ppg:7.5, rpg:2.6, apg:1.2, fgp:43.0, per:10.8, ts:56.5, epm:-0.3, bpm:-0.5, ws48:.058, onOff:0.0, clutch:3.5, vorp:0.3, usg:16.5, injury:null, lebron:-0.758, oLebron:-0.994, dLebron:0.235, war:1.57, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"TOR's most dangerous bench shooter: .409 3P% is elite. Sophomore wing getting meaningful minutes. G1: 7pts (2-5 FG, 1-4 3P) in 28 min — significant bench role. Provides spacing that Dick (.309 3P%) cannot. Key part of 9-man rotation", baseRating:55 },
        { name:"Sandro Mamukelashvili", pos:"PF", rating:60, ppg:11.2, rpg:4.9, apg:1.8, fgp:47.5, per:15.0, ts:57.0, epm:0.2, bpm:0.0, ws48:.075, onOff:0.8, clutch:4.0, vorp:0.7, usg:18.5, injury:null, lebron:1.566, oLebron:1.156, dLebron:0.41, war:4.414, offRole:"Stationary Shooter", defRole:"Mobile Big",
          matchupNote:"Per Fadeaway World: 11.2/4.9 as Poeltl's backup — MUCH bigger role than model had (was 7.8 PPG). Has outplayed Poeltl on occasions per Fadeaway World — 15.3 PPG in 7 starts. Stretch big who provides floor spacing Poeltl cannot. Given Poeltl's G1 no-show and CLE exploiting drop coverage, Mamukelashvili could be Rajakovic's biggest G2 adjustment. Rating bumped 55→60", baseRating:60 },
        { name:"Collin Murray-Boyles", pos:"PF", rating:55, ppg:8.5, rpg:5.0, apg:1.0, fgp:48.0, per:12.5, ts:56.0, epm:0.0, bpm:-0.3, ws48:.062, onOff:0.3, clutch:3.5, vorp:0.3, usg:15.5, injury:null, lebron:0.3, oLebron:-0.2, dLebron:0.5, war:1.0, offRole:"Athletic Finisher", defRole:"Wing Stopper",
          matchupNote:"Per Fadeaway World: 8.5/5.0 — key bench contributor. Physical forward who provides energy and rebounding. G1: BREAKOUT — 14pts (7-8 FG, 87.5%) in 20 min off bench. Showed ability to score efficiently in the paint. Could see expanded role in G2", baseRating:55 },
        { name:"A.J. Lawson", pos:"SG", rating:52, ppg:4.5, rpg:1.5, apg:1.2, fgp:42.0, per:8.5, ts:52.0, epm:-0.5, bpm:-1.0, ws48:.035, onOff:-0.5, clutch:3.0, vorp:0.1, usg:13.0, injury:null, lebron:-0.5, oLebron:-0.8, dLebron:0.3, war:0.5, offRole:"Cutter", defRole:"Wing Stopper",
          matchupNote:"NOT listed in Fadeaway World pre-series depth chart but Rajakovic gave him 14 min in G1. Provides defensive energy and wing depth. G1: 2pts, 3ast, 1blk in 14 min — contributed more as a connector/defender than scorer. Surprise rotation inclusion suggests Rajakovic trusts his defense vs CLE's wings", baseRating:52 }
      ],
      synergy: [
        { players:["Shead","Ingram","Barrett","Barnes","Poeltl"], score:68, note:"G1 ACTUAL starting 5 (Quickley OUT). Shead's .336 3P% hurts spacing — CLE packed paint (48-30 advantage). 18 TOs without Quickley organizing. Barnes facilitates but lacks Quickley's PG-level court management. Poeltl drop coverage exploited by CLE high PnR" },
        { players:["Quickley","Ingram","Barrett","Barnes","Poeltl"], score:77, note:"FULL-STRENGTH starting 5 (if Quickley returns G2). Quickley's .374-.391 3P% and 6+ APG transform the halfcourt — adds 3rd initiator, floor spacing, and organization. TOR swept CLE 3-0 in reg season with this group. Massive upgrade over Shead" },
        { players:["Shead","Walter","Barrett","Barnes","Mamukelashvili"], score:65, note:"POTENTIAL G2 ADJUSTMENT: Mamukelashvili replaces Poeltl for floor spacing vs CLE drop coverage. Walter (.409 3P%) replaces Dick (.309 3P%) for shooting. Sacrifices rim protection but gains spacing and avoids CLE exploiting Poeltl" },
        { players:["Quickley","Dick","Walter","Ingram","Mamukelashvili"], score:60, note:"Deep bench/garbage time. Spacing-focused but defensively vulnerable. Mamukelashvili stretch-5 option" },
        { players:["Shead","Barrett","Ingram","Barnes","Mamukelashvili"], score:66, note:"Smallball option if Poeltl continues to struggle. Barnes at nominal 4, Mamukelashvili at 5. More shooting, worse rim protection. Transition-focused — TOR must restore fast-break identity (17+ PPG reg season, 1 in G1)" }
      ]
    },
    externalFactors: [
      { team:"CLE", player:null, desc:"Garland traded to LAC for Harden (Feb 4). CLE went 21-6 (78% win rate) since trade. Garland was -3.0 per 100 possessions — worst on team in 500+ min. Harden is a massive upgrade as facilitator.", impact:5, category:"chemistry",
        evidence:"POST-TRADE DATA: CLE 21-6 since Harden arrived. ESPN trade grades gave CLE an A-. Garland was outscored by opponents by -3.0 per 100 possessions (worst among CLE rotation players with 500+ minutes). Harden is 'a far superior passer' per NBA.com, enabling Mitchell to play off-ball. +26.7 NetRtg per 100 in Mitchell-Harden minutes. G1 CONFIRMED: Harden 22/10, Mitchell 32 — facilitator/scorer dynamic works perfectly. The trade wasn't a chemistry risk — it was a chemistry UPGRADE.",
        sources:["ESPN: harden-garland-trade-grade","NBA.com: james-harden-darius-garland-trade","BasketballNews: harden-raises-cavaliers-championship-ceiling","PFN: harden-chemistry-cavaliers-donovan-mitchell"], verdict:"verified" },
      { team:"CLE", player:"James Harden", desc:"Harden as floor organizer — slows game, creates for others. G1: 22pts/10ast proved complementary role works.", impact:3, category:"role",
        evidence:"POST-GAME 1 UPDATE: Harden had 22 points and 10 assists. RaptorsRepublic preview noted 'Harden gives CLE another player who can slow the game down, get two defenders on the ball, and make the next read.' He accepted secondary role — Mitchell was the alpha (32pts), Harden was the orchestrator. The 'who takes the last shot' concern was irrelevant — CLE led by 20+ entering Q4.",
        sources:["SI: si.com/nba/raptors/onsi/toronto-raptors-cavaliers-game-1-recap","Yahoo: cavaliers-injury-report-live-updates"], verdict:"verified" },
      { team:"TOR", player:null, desc:"Rose to 5th seed on final day. Chemistry advantage BUT no playoff experience since 2022 — playoff jitters proved real in G1.", impact:1, category:"motivation",
        evidence:"POST-GAME 1 UPDATE: Toronto's 'chemistry' advantage evaporated when it mattered. TSN reported 'Raptors struggled with playoff jitters in first postseason game in four years.' They trailed by only 7 at half but got outscored 36-22 in Q3 — one bad quarter buried them. MODEL LESSON: Playoff experience asymmetry was UNDERWEIGHTED. Chemistry means less when the pressure is new.",
        sources:["TSN: tsn.ca/nba/article/raptors-fall-to-cavaliers","TheScore: thescore.com/nba/news/3525807"], verdict:"verified" },
      { team:"CLE", player:null, desc:"Sheer talent + depth: Mitchell 32pts, Harden 22/10, Strus 24 off bench. Talent overwhelmed chemistry in G1.", impact:5, category:"motivation",
        evidence:"G1 RESULT: Mitchell 32pts, Harden 22pts/10ast, Strus 24pts off bench (MODEL MISS — bench depth was not factored). Mobley 17pts/7reb. CLE scored 126 points — 14 more than projected. MODEL LESSON: I undervalued bench depth. Strus and role players are force multipliers for star-level talent.",
        sources:["ESPN: espn.com/nba/game/_/gameId/401869187","Yahoo: cavaliers-injury-report-live-updates"], verdict:"verified" },
      { team:"CLE", player:null, desc:"14 wins when trailing entering Q4 — most in NBA. Comeback ability is real even when struggling.", impact:3, category:"motivation",
        evidence:"NBA.com stats confirm 14 come-from-behind Q4 wins, most in the league. Not needed in G1 (led throughout Q3/Q4) but shows resilience baseline.",
        sources:["NBA.com: nba.com/playoffs/2026"], verdict:"verified" },
      { team:"TOR", player:"Immanuel Quickley", desc:"QUESTIONABLE G2 with right hamstring strain. OUT G1 — Toronto's halfcourt offense collapsed without him (18 TOs, 1 fast-break pt). His return is THE swing factor.", impact:-6, category:"injury",
        evidence:"ESPN confirmed Quickley ruled out G1 with hamstring strain from reg-season finale. Rajakovic: 'We missed Quickley big time with the way he gets us organized and his shooting.' Quickley's 16.4 PPG, 6.1 APG, .374-.391 3P% make him the 3rd initiator TOR needs. Without him, Shead's .336 3P% lets CLE pack the paint. QUESTIONABLE for G2 — 'making progress' per coach.",
        sources:["ESPN: espn.com/nba/story/_/id/48522217/raptors-quickley-hamstring","CBS Sports: quickley-wont-play-game-1","Yahoo: quickley-game-2-injury"], verdict:"verified" },
      { team:"TOR", player:null, desc:"TOR swept CLE 3-0 in regular season. Familiarity can cut both ways — TOR knows how to beat CLE but CLE also had Garland not Harden for some of those games.", impact:2, category:"motivation" },
      { team:"TOR", player:null, desc:"TOR posted best DRtg in NBA in final 10 games (105.7). Defensive ceiling is elite — G1's defensive collapse was jitter-specific, not talent-specific.", impact:2, category:"chemistry" },
      { team:"TOR", player:"Jakob Poeltl", desc:"Poeltl G1 no-show (4pts/6reb). Drop coverage scheme exploited by CLE high PnR. Back problems limited availability during season. Mamukelashvili (15.3 PPG in starts) may steal minutes.", impact:-3, category:"chemistry" },
      { team:"CLE", player:null, desc:"CLE paint dominance 48-30 and transition shutdown (1 TOR fast-break pt) are STRUCTURAL advantages, not one-off performances. Twin towers + Harden PnR orchestration is schematic.", impact:4, category:"chemistry" }
    ],
    xFactors: {
      home: {
        offense: { player:"Max Strus", edge:"Bench scoring explosion — 24pts G1 (playoff career high off bench after missing 67 games with broken foot), 6pts G2. Scored 11pts during CLE's 27-9 run in G1. Coach Atkinson will continue running plays for him as 6th man weapon.", avgOverPerformance:7.0 },
        defense: { player:"Dean Wade", edge:"Consistent steal production (2stl each game) and versatile wing switching. Meeting Ingram at point of attack was key to CLE's scheme lock on Ingram (17pts→7pts). His defensive versatility at SF is CLE's glue.", avgOverPerformance:0 }
      },
      away: {
        offense: { player:"Collin Murray-Boyles", edge:"BREAKOUT rookie — 14pts G1 (7-8 FG, 87.5%), 17pts G2 (expanded to 25min). Rajakovic turned to him when Poeltl struggled (9min G2). Averaging +7.0pts over his 8.5 ppg — the clearest offensive x-factor in any series.", avgOverPerformance:7.0 },
        defense: { player:"Ja'Kobe Walter", edge:"TOR's best POA defender on Mitchell assignment. Raptors Republic noted success guarding Mitchell during regular season. Better shooter than Shead (.409 3PT) so his minutes don't hurt spacing.", avgOverPerformance:0 }
      }
    },
    game1: {
      spread: "CLE -7.5", moneyline: "CLE -340 / TOR +270", ou: "O/U 221.5",
      pick: "CLE", confidence: "low", projScore: "CLE 112 — TOR 107",
      reasoning: "RESULT: CLE 126-113 — I was RIGHT on the winner but WRONG on confidence and margin. My 'low confidence' was a mistake. Post-game lessons: (1) I overweighted '76 minutes together' as negative when the +26.7 NetRtg in those minutes was screaming the fit WORKS. (2) I gave too much credit to Toronto's 'chemistry' which collapsed under playoff pressure — hadn't been in playoffs since 2022, and Quickley's hamstring injury (which I didn't factor) destroyed their continuity advantage. (3) I completely missed CLE's bench depth — Max Strus dropped 24 off the bench. (4) Harden-Mitchell coexistence worked immediately: Harden 22/10 as floor general, Mitchell 32 as alpha scorer. The talent gap was decisive, not the chemistry gap.",
      prosHome: ["Mitchell 32pts — alpha scorer (CONFIRMED)", "Harden 22/10 — complementary, not conflicting (CONFIRMED)", "Strus 24pts off bench — depth advantage (MISSED by model)", "36-22 Q3 run broke game open"],
      consHome: ["76 MINUTES concern was OVERWEIGHTED — +26.7 NetRtg in those mins", "Harden-Mitchell conflict did NOT materialize", "Role clarity sorted itself in-game", "DRtg still a concern — allowed 113"],
      prosAway: ["Chemistry advantage NULLIFIED by Quickley injury", "Barnes 21pts, Barrett 24pts — showed up individually", "Shead 17pts as replacement — solid debut", "Kept it to 7 at half — competitive early"],
      consAway: ["Quickley OUT — model MISSED this risk entirely", "No playoff experience since 2022 — jitters real", "36-22 Q3 collapse — couldn't sustain", "Depth gap: CLE bench outscored TOR bench significantly"]
    },
    modelLessons: [
      { type:"overweighted", lesson:"Small sample chemistry concern (76 minutes) — I treated the small sample as a red flag when the +26.7 NetRtg in those minutes was actually a strong positive signal. Small sample SIZE does not mean small sample QUALITY." },
      { type:"underweighted", lesson:"Playoff experience asymmetry — Toronto hadn't played a playoff game since 2022. Playoff jitters caused a 36-22 Q3 collapse. Experience should be weighted more heavily in Game 1 predictions specifically." },
      { type:"missed", lesson:"Injury probability for the 'chemistry team' — Quickley's hamstring injury destroyed Toronto's continuity advantage. Need to build in injury fragility as a risk factor for teams whose edge IS their continuity." },
      { type:"missed", lesson:"Bench depth as a force multiplier — Max Strus scored 24 off the bench. The model only rated starters/top-8 rotation. Star talent attracts defensive attention, creating open looks for role players. Depth needs to be in the model." },
      { type:"missed", lesson:"CLE paint dominance (48 pts vs TOR 30) and transition shutdown — TOR had just 1 fast-break point despite leading the league in transition offense. CLE held TOR below 110 for the first time all season (59 second-half points). These structural defensive edges aren't captured by team-level DRtg — scheme-specific paint protection matters." },
      { type:"missed", lesson:"Poeltl no-show: 4pts/6reb in a game where CLE dominated the paint. TOR's inability to match CLE's twin towers (Mobley+Allen) physically was a structural mismatch the model undervalued. Poeltl's regular season efficiency disappeared against playoff-level physicality." },
      { type:"missed", lesson:"TOR's 18 turnovers led to 22 CLE points — transition offense from forced turnovers is a repeatable edge for CLE's ball-hawking defense. The Mitchell-Harden backcourt pressures ballhandlers into mistakes." },
      { type:"overweighted", lesson:"Ball-dominance conflict narrative — Harden accepted secondary role immediately (22pts, 10ast as floor general vs Mitchell's 32pts as alpha). Veteran IQ > narrative concerns. Smart players figure it out." },
      { type:"missed", lesson:"WPA analysis (inpredictable): Max Strus was G1's MVP (+16.6% WPA) — a bench player outperforming Mitchell and Harden by WPA. This validates the 'bench depth as force multiplier' lesson above. LVP was Barnes (-7.6%), surprising given his 21/7ast box score. Rebounds were CLE's dominant factor (+14.7% WPA), confirming the paint dominance (48-30) was the game's structural story, not just scoring." }
    ],
    game2: {
      spread: "CLE -7.5", moneyline: "CLE -320 / TOR +250", ou: "O/U 222.5",
      pick: "CLE", confidence: "high", projScore: "CLE 114 — TOR 101",
      schedule: "Mon Apr 20 — 7:00 PM ET — Peacock",
      reasoning: "BACKTEST-CALIBRATED PICK: CLE (upgrading to HIGH confidence). The 2025 backtest's most painful lesson was CLE-IND R2: the #1 seed Cavaliers lost 1-4 to Indiana's pace-and-space system. But that loss was driven by a specific stylistic mismatch (Lesson 3) that doesn't apply here — Toronto has no equivalent system advantage (systemBonus: 0 vs CLE's 1.5). In fact, CLE's systemBonus (+1.5) is the 3rd highest in the East, reflecting their elite half-court offense. The bounce-back model gives CLE 77% in R1, and CLE's home court advantage (+3.0 in R1) is fully intact. The backtest also showed that teams winning G1 by 10+ with multiple 20-point scorers (Mitchell 32, Harden 22, Strus 24) sustained that advantage in G2 at 85%. Toronto's playoffPedigree:0 and no starCeiling:2 players means they lack the 'explosion game' capability that could steal one. CLE's only risk is complacency (they lost 1-4 to IND in 2025 R2), but that was a later-round phenomenon where HCA had decayed. In R1 at home, CLE's structural advantages are overwhelming.",
      g1Adjustments: [
        "Harden-Mitchell roles CONFIRMED: no more chemistry uncertainty. Harden orchestrates, Mitchell scores",
        "Quickley game-time decision — making progress. Rajakovic: 'We missed Quickley big time.' Return transforms TOR offense",
        "TOR competitive through half (down 7) — Q3 collapse was jitter-specific, not talent-specific",
        "Rajakovic has full game film now — first-time playoff coaches historically improve most between G1 and G2",
        "CLE COMPLACENCY RISK: Atkinson's team lost 1-4 to IND in R2 last year — let-down games are a pattern",
        "Barnes may take Mitchell assignment full-time — he's TOR's best perimeter defender",
        "Strus (24pts G1) will be scouted — TOR won't leave him open again",
        "COACHING GAP: Atkinson G1 rated A (transition shutdown, paint dominance, Strus deployment) vs Rajakovic D+ (18 TOs, no halftime adjustments, Poeltl invisible). First-time coaches improve most G1→G2 but the gap is large."
      ],
      prosHome: ["Mitchell-Harden fit PROVEN: 32pts + 22/10", "Bench depth: Strus 24pts, Merrill spacing — structural edge", "Atkinson's halftime adjustments outclassed Rajakovic in G1", "21-6 since Harden trade — this team knows how to win"],
      consHome: ["COMPLACENCY: Atkinson's CLE lost 1-4 to IND in R2 2025 — let-down games are real", "DRtg concerning — allowed 113 even in a comfortable win", "Strus will be scouted — 24pts won't come as easily", "TOR's first-game jitters won't repeat — experience compounds"],
      prosAway: ["Quickley game-time decision — return transforms offense", "Barnes 21pts, Barrett 24pts — individual scoring is real", "Shead 17pts debut may improve with comfort and Rajakovic's adjustments", "Only down 7 at half — Q3 collapse was jitter-specific", "Rajakovic has full game film — first-time coaches improve most G1→G2"],
      consAway: ["Quickley may still be OUT — hamstring timelines are unpredictable", "No playoff experience since 2022 — jitters may linger beyond G1", "CLE bench depth is structural — can't be coached away", "Harden-Mitchell proven = CLE's ceiling is now higher"]
    },
    g3PlayerOutlook: {
      home: [ // CLE (AWAY at Toronto for G3)
        { player:"Donovan Mitchell", outlook:"neutral", projFgPct:0.47, ptsRange:[25,32], reason:"31 PPG on 55.8% FG through 2 games — elite playoff mode. BUT this is his first road game of the series, and career playoff road scoring dips ~2-3pts vs home. 2024 R1: averaged 28.5 PPG (swept ORL). 2025 R2: dropped to 22.6 PPG on the road vs IND when CLE collapsed 1-4. Scotiabank Arena crowd + Quickley return changes TOR's defensive intensity. Still the alpha — neutral because road dip offsets his momentum.", confidence:"medium" },
        { player:"James Harden", outlook:"neutral", projFgPct:0.46, ptsRange:[18,26], reason:"G1 facilitator (22pts/10ast) → G2 scorer (28pts/5stl on 64% FG). Dual-mode versatility makes him unpredictable. BUT Harden's career playoff road history is concerning — 2024 w/LAC: efficiency dropped in road losses. NBA.com noted Mitchell-Harden '22-for-35 combined' in G2 is unsustainable. With Quickley back, TOR's halfcourt D improves. Expect regression toward 20-22pts with more assists as facilitator mode re-emerges on the road.", confidence:"medium" },
        { player:"Evan Mobley", outlook:"bad", projFgPct:0.52, ptsRange:[15,20], reason:"G2's 11-for-13 (84.6% FG) was historic — 4th trio in Cavs playoff history to all score 25+. That efficiency WILL regress hard. Atkinson called him 'in a phenomenal place physically and mentally' but 84.6% is a 3-sigma outlier. In 2025 playoffs: averaged 16.8 PPG on 51% FG (his normal). Road environment adds defensive intensity from TOR. Project regression to ~52% FG, still 17-18pts.", confidence:"high" },
        { player:"Jarrett Allen", outlook:"neutral", projFgPct:0.62, ptsRange:[8,13], reason:"10pts both games on 69% combined FG (9/13). Efficient rim-runner role stable. GTD knee tendonitis is the only concern — played 25min G2 (down from 28 G1). With Poeltl barely playing (9min G2), Allen's matchup is favorable vs Mamukelashvili/Murray-Boyles.", confidence:"medium" },
        { player:"Max Strus", outlook:"bad", projFgPct:0.38, ptsRange:[6,14], reason:"G1 WPA MVP (24pts, 8/10 FG) → G2 scouted down to 6pts (2/5 FG). TOR adjusted — Yahoo noted Raptors won't leave him open again. X-factor boost remains but G3 projection should reflect G2's correction, not G1's outlier. Career playoff 3PT: ~38%. 40% 3PT shooter but TOR now has film. Home crowd won't rattle a vet like Strus though.", confidence:"high" },
        { player:"Dean Wade", outlook:"neutral", projFgPct:0.42, ptsRange:[3,7], reason:"Reddit confirmed Wade guarded Ingram on 28 possessions in G1 — CLE's scheme lock on Ingram is Wade's doing. Offensively limited (5pts G1, 3pts G2) but 2stl each game. Value is entirely defensive. No change expected.", confidence:"medium" },
        { player:"Sam Merrill", outlook:"neutral", projFgPct:0.40, ptsRange:[4,8], reason:"7pts G1, 5pts G2 — steady floor spacer. 42.4% career 3PT gives him a live shot any night but role is secondary. 20-21min both games suggests stable rotation spot.", confidence:"medium" },
        { player:"Dennis Schroder", outlook:"neutral", projFgPct:0.38, ptsRange:[3,7], reason:"2pts G1, 5pts G2 in 13min each. Veteran backup PG providing ballhandling when stars rest. Limited ceiling but stable floor. Playoff-experienced (multiple teams).", confidence:"medium" },
        { player:"Jaylon Tyson", outlook:"neutral", projFgPct:0.40, ptsRange:[2,6], reason:"2pts G1, 3pts G2 in 11-14min. Bench wing with modest role. No major change expected.", confidence:"low" },
        { player:"Keon Ellis", outlook:"neutral", projFgPct:0.35, ptsRange:[0,4], reason:"3pts G1, 0pts G2 (0/4 FG). Defensive specialist only — 2stl in G2 despite 0pts. Minutes may fluctuate based on matchup needs.", confidence:"low" }
      ],
      away: [ // TOR (HOME at Scotiabank Arena for G3)
        { player:"Scottie Barnes", outlook:"good", projFgPct:0.50, ptsRange:[24,32], reason:"TRENDING UP: G1 21pts (43% FG) → G2 26pts (58% FG, 11/19). First home playoff game at Scotiabank Arena — crowd energy is massive. Rajakovic pre-series wanted 'a different Scottie' and he's delivering. 2024 comparison: Pascal Siakam went from 21→29pts when TOR got home in 2019 playoffs (Barnes has similar 'point-forward' profile). Barnes' 5.9 APG regular season facilitating means Quickley's return HELPS him — less ball-handling burden, more catch-and-shoot/cut opportunities.", confidence:"high" },
        { player:"RJ Barrett", outlook:"good", projFgPct:0.50, ptsRange:[20,26], reason:"MOST CONSISTENT Raptor: 24pts (54% FG) G1, 22pts (77% FG) G2 = 23 PPG on 65% combined FG. CLE has NO dedicated answer for him — Dean Wade is locked on Ingram, Mobley/Allen patrol paint. Barrett is a physical scorer who gets to the line (combined 12 FTA through 2 games). Home court amplifies his aggressive driving. Entered playoffs hot (21.5 PPG final 8 games). 2024 parallel: Barrett was steady for TOR in reg season before Ingram arrived.", confidence:"high" },
        { player:"Brandon Ingram", outlook:"bad", projFgPct:0.38, ptsRange:[10,18], reason:"SCHEME-LOCKED: 17pts G1 (5/9) → 7pts G2 (3/15, 5 TOs). Yahoo: 'remains M.I.A.' NBA.com: '3-for-16 in last 6 quarters, 11 pts.' Ingram admitted CLE 'knew most of the stuff we've been running.' Dean Wade meeting him at point of attack. Home court and new sets may help marginally — .329 3PT means CLE packs paint against his drives. 2024 NOP playoff parallel: Ingram shot 44% FG vs OKC R1 but NOP was swept. When defensive schemes target him specifically, his mid-range rhythm game breaks down. Some bounceback expected at home but the scheme lock is STRUCTURAL, not situational.", confidence:"high" },
        { player:"Immanuel Quickley", outlook:"neutral", projFgPct:0.40, ptsRange:[10,16], reason:"EXPECTED RETURN from hamstring strain (11 days rest by G3). Rajakovic: 'We missed Quickley big time.' His .374-.391 3PT and 6.1 APG transform TOR's spacing and organization — Yahoo noted TOR committed 22 TOs without him. BUT: returning from injury mid-series carries rust risk. Regular season: 16.4 PPG. Project ~12-14pts on slightly below-normal efficiency as he works back into rhythm. His PRESENCE matters more than his scoring — reduces TO rate and opens driving lanes for Barnes/Barrett.", confidence:"medium" },
        { player:"Jamal Shead", outlook:"bad", projFgPct:0.32, ptsRange:[2,8], reason:"G1 outlier: 17pts (5/6 3PT — career 33.6% shooter). G2 crash: 3pts (1/5 FG). Yahoo: 'far too inconsistent to carry the role.' With Quickley's return, Shead's minutes drop from 37-38min to ~18-22min backup role. His .336 3PT% means CLE can still sag off him. G1's 5/6 3PT was a 3-sigma event that won't repeat.", confidence:"high" },
        { player:"Collin Murray-Boyles", outlook:"good", projFgPct:0.55, ptsRange:[14,20], reason:"X-FACTOR BREAKOUT CONFIRMED: 14pts G1 (7/8 FG, 87.5%) → 17pts G2 (6/10, 60%). Expanded from 20→25min as Poeltl's replacement. Rajakovic trusts the rookie in big moments. His athleticism and finishing at the rim exploit CLE's perimeter-focused defense. 2025 parallel: Similar to OKC's Chet Holmgren rookie playoff impact — young bigs who can finish and defend create mismatches. Home crowd energy fuels young players.", confidence:"medium" },
        { player:"Ja'Kobe Walter", outlook:"good", projFgPct:0.46, ptsRange:[10,16], reason:"RISING: 7pts G1 (2/5) → 14pts G2 (5/9, 3/7 3PT). .409 career 3PT is elite for a sophomore. X-factor defensive assignment on Mitchell. With Quickley back, Walter may shift to pure catch-and-shoot role where his .409 3PT% is lethal. TOR's most dangerous bench shooter. 27-28min both games = stable rotation.", confidence:"medium" },
        { player:"Sandro Mamukelashvili", outlook:"good", projFgPct:0.55, ptsRange:[10,15], reason:"BREAKOUT: G1 3pts/8reb → G2 12pts/10reb double-double (5/8 FG). Stretch-5 spacing counters CLE's drop coverage. LEBRON 1.566 / WAR 4.414 confirms hidden impact. 20min both games. His floor-spacing (2/3 3PT in G2) is exactly what TOR needs against CLE's packed paint. Home environment helps confidence.", confidence:"medium" },
        { player:"Jakob Poeltl", outlook:"bad", projFgPct:0.55, ptsRange:[2,6], reason:"MINUTES COLLAPSED: 21min G1 → 9min G2. NBA.com confirmed Raptors 'made the telling decision to reduce his playing time.' CLE's twin towers + high PnR scheme makes his drop coverage unplayable. May see 5-10min garbage time only. Back problems compound the matchup issue.", confidence:"high" },
        { player:"A.J. Lawson", outlook:"neutral", projFgPct:0.38, ptsRange:[0,4], reason:"2pts both games. Defensive energy piece. 14min G1 → 5min G2 suggests declining role. With Quickley back, minutes may shrink further.", confidence:"low" }
      ]
    },
    game3: {
      spread: "CLE -4.5", moneyline: "CLE -240 / TOR +195", ou: "O/U 219.5",
      pick: "CLE", confidence: "medium", projScore: "CLE 111 — TOR 104",
      schedule: "Thu Apr 23 — 8:00 PM ET — Prime Video",
      reasoning: "RESEARCH-INFORMED PICK: CLE (MEDIUM confidence, sustained from G2). Model projects CLE 111-104 (+7, COMPETITIVE) — the margin compression from G1 (+13) to G2 (+10) to G3 (+7) reflects real coaching adaptation and the HCA flip to Toronto. The key variable is Quickley's expected return: his mild hamstring strain (Apr 12 regular-season finale) puts him at 10-11 days rest by Game 3, and he was already questionable for G2. Rajakovic admitted 'we missed Quickley big time' — his return transforms Toronto from an 18-22 TO mess into a functional 3-initiator offense (.374+ 3P%, 6 APG). CLE's defensive scheme on Ingram has been devastating (G1: 17pts on 9 FGA, G2: 7pts on 3/15 FG) — per Fear The Sword, Dean Wade has been 'phenomenal defensively' meeting Ingram at the point of attack. But Ingram acknowledged CLE 'knew most of the stuff we've been running' — Toronto will counter-adjust at home with new sets. The Raptors' small-ball experiment (Murray-Boyles at C in G2 Q3) backfired because it removed rim protection while Mitchell and Harden exploited iso opportunities. Rajakovic needs to find a middle ground. CLE's stars are rolling: Mitchell 31 PPG (62% series avg), Harden 25/7ast (shift from facilitator to co-scorer in G2), Mobley 21 PPG on 67% shooting — Toronto has no matchup for all three. However, TOR's home crowd (first playoff game at Scotiabank Arena), Quickley's probable return, and Barnes' rising form (26pts on 58% in G2) create real upset conditions. Historical data: teams up 2-0 win Game 3 on the road ~60% of the time, but that drops when the home team gets a key player back.",
      g2Adjustments: [
        "MARGIN COMPRESSION CONFIRMED: G1 +13 \u2192 G2 +10 \u2192 G3 projected +7. Coaching film study narrows gaps each game.",
        "INGRAM SCHEME LOCK DEVASTATING: G1 17pts (9 FGA) \u2192 G2 7pts (3/15 FG). Dean Wade meeting him at point of attack. Ingram admitted CLE 'knew most of the stuff we've been running.' TOR must install new actions.",
        "HARDEN ROLE SHIFT: G1 orchestrator (22pts/10ast) \u2192 G2 co-scorer (28pts/4ast/5stl on 9/14 FG). CLE proved they have TWO scoring modes — makes them harder to game-plan.",
        "MOBLEY BREAKOUT: 25pts on 11/13 FG in G2 — when CLE goes small, Mobley dominates paint. TOR's small-ball (Murray-Boyles at C) removed their rim protection and HELPED CLE.",
        "QUICKLEY EXPECTED BACK: Mild hamstring strain from Apr 12 finale. Missed G1+G2. At 11 days rest by G3, return is probable. His .374+ 3P% and 6 APG transforms TOR spacing and ball movement.",
        "TOR TURNOVER CRISIS WORSENING: G1 18 TOs \u2192 G2 22 TOs. CLE's ball pressure is systematic, not random. Quickley's return helps but CLE's length remains a problem.",
        "BARNES TRENDING UP: G1 21pts (6 FG) \u2192 G2 26pts (11/19 FG, 58%). He's finding his playoff rhythm. Could be a 30+ threat at home.",
        "HOME COURT ADVANTAGE FLIPS: First game at Scotiabank Arena. TOR was 24-17 at home this season. Crowd energy + comfort could be worth 3-4 points.",
        "CLE 3PT SHOOTING DIP: G1 50% (16/32) \u2192 G2 32% (13/40). Regression toward playoff averages (~35%) will continue. But CLE compensated with paint dominance (Mobley 11/13).",
        "RAJAKOVIC ADJUSTMENT FAILED: Small-ball lineup (Murray-Boyles at C) in G2 Q3 backfired — CLE outscored TOR 36-22 in that frame. Need different counter for G3."
      ],
      prosHome: ["Mitchell 31 PPG on 55% FG through 2 games — elite playoff mode, historic 9th straight series opener with 30+", "Harden proved dual-threat: can orchestrate (G1: 10ast) OR score (G2: 28pts). Impossible to game-plan for both modes", "Mobley 21 PPG on 67% FG — paint dominance is structural, not matchup-dependent", "Bench depth: Strus averaging 23pts, CLE bench outscoring TOR 36-20 pre-garbage time", "Defensive scheme on Ingram is a masterclass — 12pts/game on 29% FG through 2 games", "21-6 since Harden trade — this team closes out series on the road"],
      consHome: ["HCA GONE: First road game of series. CLE was 25-16 away — solid but not dominant", "3PT regression: 50% G1 \u2192 32% G2. If it drops further on the road, scoring floor drops", "COMPLACENCY: Up 2-0 teams historically let off gas in G3 ~40% of the time", "Quickley return transforms TOR offense — no more 18-22 TO games", "Mobley's 11/13 FG is unsustainable — regression to 50-55% still good but less dominant"],
      prosAway: ["QUICKLEY PROBABLE RETURN: 11 days rest. Transforms TOR into 3-initiator offense with real spacing", "HOME COURT: First game at Scotiabank Arena — TOR 24-17 at home, crowd energy is real", "Barnes trending UP: G1 21pts \u2192 G2 26pts. At home he could explode for 30+", "Barrett steady: 23 PPG on 62% FG through 2 games — CLE hasn't found an answer", "Murray-Boyles 17pts/7reb off bench in G2 — young players gaining playoff confidence", "Rajakovic has 2 full games of film now — more adjustment runway than any prior game", "CLE 3PT regression: 50% \u2192 32% and falling. TOR's perimeter defense should hold this down"],
      consAway: ["TURNOVER CRISIS: 18 \u2192 22 TOs through 2 games. CLE's ball pressure is schematic, not fixable overnight", "Ingram scheme-locked: 12 PPG on 29% FG. Even new sets may not free him against CLE's length", "Poeltl reduced to 9 minutes in G2 — center position is a liability against CLE's twin towers", "TOR 27% from 3 in G2 (7/26) — shooting may not improve enough to overcome paint deficit", "No playoff experience since 2022 — home crowd could add pressure, not just energy", "CLE has won 5 straight playoff games vs TOR (all-time 12-2) — historical dominance is real"]
    },
    coaching: {
      home: {
        coach: "Kenny Atkinson",
        adjustmentRating: 7,
        schemeCreativity: 7,
        urgency: 5,
        playoffRecord: "4-4 (swept MIA R1 2025, lost to IND 1-4 R2 2025). NBCA Coach of the Year 2025.",
        tendency: "Development-focused but defense-drives-rotation. 9-man rotation. 41 different starting lineups this season — extreme adaptability. CLE 21-6 since Harden trade. System absorbed mid-season star acquisition seamlessly.",
        rotationPlan: "Per Fadeaway World: 9-man core. Start Harden/Mitchell/Wade/Mobley/Allen. Wade is SF pick for defense. Bench: Schroder (backup PG), Strus (first forward off bench, 40.2% 3PT), Merrill (42.4% 3PT spacing), Tyson (wing scoring). Ellis for defensive boost. 5th starter may rotate game-to-game based on production (Wade/Strus/Ellis). Allen GTD — if out, Mobley slides to 5.",
        keyAdjustment: "HIGH PnR SCHEME: Harden initiates PnR extremely high (just inside halfcourt), pulling Poeltl far from rim. Mitchell/Harden as dual drivers create driving lanes. Twin towers (Mobley+Allen) finish at rim — 48 paint pts in G1. Transition defense shutdown (held TOR to 1 fast-break pt) is repeatable scheme, not luck.",
        g1Performance: "A | Masterclass. Held TOR to 1 fast-break point (league leader in transition). Paint dominance 48-30 was schematic. 36-22 Q3 run broke it open. Mitchell-Harden roles perfect (32pts scorer + 22/10 orchestrator). Strus 24pts off bench = COTY-level deployment. 18 forced TOs → 22 CLE pts. Held TOR below 110 first time all season.",
        g2Outlook: "Atkinson has structural advantages that don't erode: (1) 3-initiator redundancy (Mitchell/Harden/Mobley) vs TOR's 2, (2) twin towers paint dominance, (3) bench depth (Strus/Merrill/Porter). TOR will scout Strus — Atkinson can counter by running more through Merrill (42% 3PT). Allen's health is the only wildcard. COMPLACENCY RISK: lost 1-4 to IND in 2025 R2 — but that was a later-round stylistic mismatch, not applicable here."
      },
      away: {
        coach: "Darko Rajakovic",
        adjustmentRating: 5,
        schemeCreativity: 5,
        urgency: 9,
        playoffRecord: "0-1",
        tendency: "Defense-first philosophy — 'everything starts on the defensive end.' Switchable defense, transition offense identity. First European-born coach in NBA playoffs. 10-11 man reg season rotation, tightening to 8-9 for playoffs.",
        rotationPlan: "If Quickley OUT: Shead/Ingram/Barrett/Barnes/Poeltl starting. Walter (.409 3P%) should get minutes over Dick (.309 3P%). Mamukelashvili (15.3 PPG in starts) could steal Poeltl minutes. If Quickley returns: transforms to 9-man with Quickley starting, Shead backing up.",
        keyAdjustment: "G2 ADJUSTMENT MENU: (1) Switch Poeltl to more aggressive PnR coverage (not drop) — CLE exploited drop scheme running PnR extremely high, (2) Give Mamukelashvili minutes for spacing vs CLE's packed paint, (3) Reduce TOs (18 in G1 → 22 CLE pts), (4) Restore transition game (17+ PPG reg season → 1 in G1 is unsustainable), (5) Walter over Dick for bench shooting",
        g1Performance: "D+ | TOR identity (transition, defense) completely shut down. 1 fast-break pt. 18 TOs. Poeltl invisible (4pts/6reb). Paint dominated 48-30. Competitive through half (down 7) but Q3 collapse (36-22) showed no halftime adjustments. Positives: Shead 17pts debut, Barnes 21/7ast. Rajakovic admitted missing Quickley 'big time'. First-time coaches historically improve most G1→G2.",
        g2Outlook: "QUICKLEY RETURN IS EVERYTHING. With him: TOR becomes a different team — 3rd initiator, floor spacing (.374-.391 3P%), organization. Without him: same structural problems (Shead .336 3P%, no halfcourt engine, CLE packs paint). Rajakovic must also fix Poeltl scheme — Mamukelashvili's spacing or more aggressive PnR coverage are the options. TOR's final-10-games DRtg (105.7, best in NBA) proves the defensive ceiling exists — they just couldn't access it in G1 under playoff pressure. Quote pre-playoffs: expects 'a different Scottie' in postseason."
      },
      bestLineups: {
        home: { players: ["Harden","Mitchell","Wade","Mobley","Allen"], netRtg:11.2, ortg:120.8, drtg:109.6, min:200, note:"Per Fadeaway World STARTING/CLOSING 5. Wade SF for defense. +26.7 NetRtg per 100. Paint dominance (48-30 G1). 5th man may rotate to Strus/Ellis" },
        homeBench: { players: ["Schroder","Merrill","Strus","Tyson","Mobley"], netRtg:6.5, ortg:115.0, drtg:108.5, min:120, note:"Bench unit: Schroder handles ball, Merrill+Strus shoot, Tyson scores. Strus G1 WPA MVP (+16.6%). CLE bench outscored TOR in G1" },
        away: { players: ["Shead","Ingram","Barrett","Barnes","Poeltl"], netRtg:2.5, ortg:113.0, drtg:110.5, min:120, note:"G1 starting 5 (Quickley OUT). Drop coverage exploited. 18 TOs. Net rating drops significantly without Quickley" },
        awayFullStrength: { players: ["Quickley","Ingram","Barrett","Barnes","Poeltl"], netRtg:5.2, ortg:115.6, drtg:110.4, min:280, note:"FULL-STRENGTH lineup (if Quickley returns). TOR swept CLE 3-0 in reg season with this core. Quickley's .374+ 3P% and 6 APG transform spacing and organization" }
      },
      roleChanges: [
        { team:"CLE", player:"Harden", regSeason:"Acquired Feb 4, co-creator, 34.2 MPG", playoff:"Floor general + orchestrator, 34+ MPG. G1: 22pts/10ast — accepted secondary role perfectly. Runs high PnR that destroyed Poeltl. Per Fadeaway World: has bumped Mobley AND Allen production", impact:"same", reason:"Replaced Garland's -3.0 per 100. CLE 21-6 since trade. System upgrade" },
        { team:"CLE", player:"Wade", regSeason:"Makeshift SF, ~24 MPG, 5.8/4.2", playoff:"Per Fadeaway World: STARTING SF over Strus/Tyson/Ellis. Defense + floor-stretching. May rotate with Strus/Ellis game-to-game. CLE's weakest link per Fadeaway — 'glaring weakness' at SF", impact:"same", reason:"Superior defensive ability compared to Strus. Safest option despite limited offense" },
        { team:"CLE", player:"Schroder", regSeason:"Acquired Feb, 8.2/4.3ast", playoff:"Per Fadeaway World: bench PG providing backup creation. Minutes regulated around Harden/Mitchell. Playoff-experienced veteran", impact:"neutral", reason:"Model was MISSING him. Provides ballhandling when stars rest — critical depth piece" },
        { team:"CLE", player:"Strus", regSeason:"6th man, missed most of season injured, 40.2% 3PT", playoff:"First forward off bench, 22-25 MPG. G1 WPA MVP: 24pts (8/10 FG). May replace Wade in closing lineup. Per Fadeaway World: best shooting option outside guards", impact:"up", reason:"Bench depth as force multiplier — star talent creates open looks for Strus" },
        { team:"CLE", player:"Tyson", regSeason:"Wing, 13.2/5.1", playoff:"Bench wing, 18-22 MPG. Per Fadeaway World: one of three SF contenders but Wade won out. Scoring punch off bench", impact:"down", reason:"Was incorrectly modeled as starter — actually bench piece behind Wade" },
        { team:"CLE", player:"Allen", regSeason:"Starter, twin towers anchor, 15.4/8.5", playoff:"GTD knee tendonitis — availability drives CLE's ceiling. If healthy: twin towers domination (48-30 paint G1). Per Fadeaway World: thriving with Harden feeding him", impact:"down", reason:"Chronic knee tendonitis. Only reliable backup C is Thomas Bryant (6.2/3.4)" },
        { team:"TOR", player:"Shead", regSeason:"Rookie backup PG, 20.6 MPG, 6.7 PPG", playoff:"Starting PG if Quickley OUT, 32+ MPG. G1: 17pts (career-level) but .336 3P% is unsustainable", impact:"up", reason:"Quickley hamstring forces starting role. Defensively solid, distributes well (5.4 APG/20min), but shooting limits spacing" },
        { team:"TOR", player:"Quickley", regSeason:"Starting PG, 32 MPG, 16.4 PPG", playoff:"QUESTIONABLE G2. His return is THE swing factor — transforms TOR from G1's 18-TO mess into a functioning 3-initiator offense", impact:"down", reason:"Hamstring strain from reg-season finale. Even if he returns, may not be 100%" },
        { team:"TOR", player:"Mamukelashvili", regSeason:"Bench big, spot minutes", playoff:"POTENTIAL G2 UPGRADE over Poeltl. 15.3 PPG in 7 starts, stretch-5 spacing. Given Poeltl's G1 no-show, Rajakovic may give him more run", impact:"up", reason:"Floor spacing counters CLE's drop coverage exploitation. LEBRON 1.566 / WAR 4.414 suggests hidden impact" },
        { team:"TOR", player:"Walter", regSeason:"Bench wing, .409 3P%", playoff:"Should replace Dick (.309 3P%) in rotation. TOR's most dangerous bench shooter", impact:"up", reason:"Dick's sophomore slump (6.3 PPG, .309 3P%) pushes Walter into the rotation for spacing" },
        { team:"TOR", player:"Barnes", regSeason:"All-Star, 33.5 MPG facilitator role", playoff:"38+ MPG. Defensive QB + primary creator with Quickley out. Rajakovic wants 'different Scottie' in G2", impact:"up", reason:"Must elevate — G1 WPA LVP (-7.6%) despite 21/7ast. Mobley matchup is THE series" },
        { team:"TOR", player:"Ingram", regSeason:"Primary scorer, 33.8 MPG (team-high)", playoff:"Half-court engine, 36+ MPG. G1: 17pts (below avg) — CLE length affected drives. .329 3P% spacing concern", impact:"same", reason:"Acquired to be playoff creator. Must find efficiency against CLE's twin towers" }
      ]
    },
    games: [{num:1,result:"CLE",homeScore:126,awayScore:113,winner:"CLE",notes:"Mitchell 32pts (11/20 FG), Harden 22/10ast, Strus 24 off bench, Mobley 17/7. CLE dominated paint 48-30. TOR held to 1 fast-break point (league leader in transition). TOR: Barrett 24, Barnes 21/7ast, Ingram 17, Shead 17 (5 3s). Quickley OUT hamstring. Poeltl no-show 4pts/6reb. TOR 18 turnovers → 22 CLE points. CLE held TOR below 110 for first time all season (59 second-half pts). CLE 36-22 Q3 run broke it open. WPA: MVP Strus +16.6%, LVP Barnes -7.6%. Rebounds were CLE's biggest edge (+14.7% WPA, matching paint dominance 48-30). FG +19.4%, FT +7.7%, TOV +7.0%."},{num:2,result:"CLE",homeScore:115,awayScore:105,winner:"CLE",notes:"CLE wins 115-105, leads series 2-0. Mitchell 30pts (13/23 FG, 4/10 3PT), Harden 28pts/4ast/5stl (9/14 FG, role shifted to scorer from facilitator), Mobley 25pts on 11/13 FG (dominant efficiency). Allen 10/3/1 with 3blk in 25min. TOR: Barnes 26pts/5ast bounce-back (11/19 FG), Barrett 22/9reb (10/13 FG), but Ingram collapsed 7pts on 3/15 FG (CLE defensive scheme blanketed him). Murray-Boyles 17pts/7reb off bench, Mamukelashvili 12/10 double-double. Quickley still OUT. KEY STAT: TOR 22 turnovers vs CLE 12. CLE led 99% of game, largest lead 16. TOR shot 26.9% from 3 (7-26). Poeltl reduced to 9min. Model projected CLE +11, actual +10."},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  }
];

// ============================================================
// PHASE 24 — TURNOVER MODELING & FOUL TROUBLE PROBABILITY
// ============================================================
// Data sourced from: Basketball Reference 2026 Playoffs per-game stats,
// career playoff game logs (LeBron 293g, Jokic 96g, Edwards 44g, Mitchell 69g),
// CBS Sports injury reports, and team four-factors analysis.
//
// Model Integration:
//   TOV Impact = (Team TOV differential × 1.07 pts/TOV) — each turnover swing ≈ 1.07 points
//   Foul Trouble Risk = P(star 4+ fouls by Q3) × DRtg degradation when star sits
//   Pressure Multiplier = historical playoff TOV rate / regular season TOV rate (>1.0 = chokes under pressure)
// ============================================================

const TURNOVER_FOUL_DATA = {
  "HOU-LAL": {
    turnover: {
      home: { teamTOV: 13.2, tovPct: 12.8, keyRisks: [
        { player: "Sengun", tovPG: 3.0, careerPlayoffTOV: null, pressureNote: "First playoff action — post-up TOs spike vs elite perimeter D. Smart hunts him in P&R" },
        { player: "Sheppard", tovPG: 2.0, careerPlayoffTOV: null, pressureNote: "Rookie in first playoffs — turnover rate typically spikes 15-20% for first-time playoff guards" }
      ]},
      away: { teamTOV: 20.0, tovPct: 20.5, keyRisks: [
        { player: "LeBron", tovPG: 2.0, careerPlayoffTOV: 3.58, pressureNote: "293 playoff games. G1: only 2 TOV (facilitator mode). Career: 3.58/game but trending DOWN at 41 — more careful, fewer drives. Foul distribution: 6 PF only 2x in 293 games." },
        { player: "Smart", tovPG: 5.0, careerPlayoffTOV: 2.1, pressureNote: "G1 outlier: 5 TOV on aggressive gambling. Career playoff: 2.1 TOV. Expect regression to ~2.5" }
      ]},
      differential: 6.8, // LAL turns it over 6.8 more per game — MASSIVE
      modelImpact: "LAL's 20.5% TOV rate is worst in playoffs. Without Luka/Reaves, ball-handling load falls on LeBron and Smart — both prone to high-assist/high-TOV games. Each TOV swing ≈ 1.07 points, so LAL's +6.8 TOV differential costs them ~7.3 points per game. This partially offsets their G1 win (which came despite 20 turnovers). HOU's young core should force more TOs with their athleticism."
    },
    foulTrouble: {
      home: [
        { player: "Sengun", pfPG: 5.0, foulOutRisk: "HIGH", impactIfOut: "HOU loses its only elite creator. No backup C of similar caliber. Offense collapses to perimeter-only." }
      ],
      away: [
        { player: "LeBron", pfPG: 3.0, foulOutRisk: "LOW", impactIfOut: "Only 2 games with 6 PF in 293 career playoff games. Elite foul avoidance." },
        { player: "AD", pfPG: 3.0, foulOutRisk: "MEDIUM", impactIfOut: "AD in foul trouble = LAL rim protection vanishes. Critical for containing Sengun drives." }
      ],
      modelImpact: "Sengun's 5.0 PF in G1 is alarming — Smart's physical defense draws fouls. If Sengun picks up 2 early fouls, Udoka must bench him, and HOU's offense flatlines."
    }
  },
  "OKC-PHX": {
    turnover: {
      home: { teamTOV: 8.0, tovPct: 7.2, keyRisks: [
        { player: "SGA", tovPG: 1.0, careerPlayoffTOV: 2.8, pressureNote: "Elite ball security. Only 1 TOV in G1 blowout. Career playoff: 2.8 but trending down as he's matured." },
        { player: "Jalen Williams", tovPG: 2.0, careerPlayoffTOV: 2.2, pressureNote: "Steady. 2 TOV in G1 is right at career average." }
      ]},
      away: { teamTOV: 19.0, tovPct: 17.3, keyRisks: [
        { player: "Booker", tovPG: 3.0, careerPlayoffTOV: 3.2, pressureNote: "3 TOV in G1. Career playoff 3.2 — consistently turns it over under pressure. OKC's switching D creates confusion." },
        { player: "Beal", tovPG: 4.0, careerPlayoffTOV: 2.9, pressureNote: "4 TOV in G1 — highest on team. OKC's length disrupts his driving lanes." }
      ]},
      differential: -11.0, // OKC turns it over 11 FEWER per game
      modelImpact: "OKC's 7.2% TOV rate is the BEST in the 2026 playoffs. PHX's 17.3% is 3rd-worst. This 11-turnover differential is worth ~11.8 points — almost the entire G1 margin (OKC won by 18). OKC's ball security is a REPEATABLE structural edge."
    },
    foulTrouble: {
      home: [
        { player: "Chet", pfPG: 3.0, foulOutRisk: "MEDIUM", impactIfOut: "Chet's rim protection is OKC's defensive anchor. If he sits, PHX can attack the paint." }
      ],
      away: [
        { player: "Nurkic", pfPG: 4.0, foulOutRisk: "HIGH", impactIfOut: "Already foul-prone. Without Nurkic, PHX has no rim protection and OKC attacks the paint at will." }
      ],
      modelImpact: "Nurkic's foul trouble is PHX's Achilles heel — he's the only true rim protector and his 4.0 PF/game rate puts him at constant risk."
    }
  },
  "DEN-MIN": {
    turnover: {
      home: { teamTOV: 14.0, tovPct: 13.5, keyRisks: [
        { player: "Jokic", tovPG: 4.0, careerPlayoffTOV: 3.32, pressureNote: "96 career playoff games. G1: 5 TOV, G2: 3 TOV. Career: 3.32 but SPIKES in high-pressure games (8 TOV vs OKC G3 2025, 7 TOV vs OKC G1 2025). His playmaking volume (8+ APG) inherently creates TOV risk. When Jokic has 5+ TOV, DEN is 5-12." },
        { player: "Murray", tovPG: 3.0, careerPlayoffTOV: 2.8, pressureNote: "Chronic knee affects ball-handling in extended minutes. G2 Q4 collapse: 2-of-12 FG with 4 TOV in crunch time." }
      ]},
      away: { teamTOV: 15.5, tovPct: 14.8, keyRisks: [
        { player: "Edwards", tovPG: 2.5, careerPlayoffTOV: 2.70, pressureNote: "44 career playoff games. G1: 3 TOV/4 PF, G2: 2 TOV/2 PF. PATTERN: When Ant has 4+ TOV, team is 3-6. Elimination games: TOV spikes (7 in GSW G5 2025, 5 in OKC G4). Young star who forces when frustrated." },
        { player: "KAT", tovPG: 4.0, careerPlayoffTOV: 2.5, pressureNote: "4 TOV in G1 — well above career 2.5 average. Jokic's physicality disrupts KAT's post moves. Also 4.5 PF/game — foul trouble risk." }
      ]},
      differential: -1.5, // roughly even
      modelImpact: "Nearly even on turnovers, but the COMPOSITION matters. Jokic's TOVs are high-leverage (often in Q4 crunch time when he's gassed at 40+ MPG). Edwards' TOVs spike in must-win games. For G3 at DEN, pressure shifts to MIN — expect Edwards' TOV rate to climb to 3-4 range on the road."
    },
    foulTrouble: {
      home: [
        { player: "Jokic", pfPG: 3.0, foulOutRisk: "MEDIUM", impactIfOut: "5+ fouls in 18.75% of career playoff games. DEN's DRtg drops ~5pts/100 without him. KAT/Edwards attack him in P&R to draw fouls." },
        { player: "Gordon", pfPG: 3.5, foulOutRisk: "MEDIUM", impactIfOut: "Physical defender who picks up fouls contesting drives. DEN's wing defense suffers without him." }
      ],
      away: [
        { player: "Gobert", pfPG: 3.0, foulOutRisk: "HIGH", impactIfOut: "5 fouls in G2 (nearly fouled out). MIN's DRtg is 7.9 pts/100 WORSE without Gobert. Jokic specifically targets him in P&R to draw fouls." },
        { player: "McDaniels", pfPG: 4.5, foulOutRisk: "HIGH", impactIfOut: "4.5 PF/game is unsustainable. If he fouls out, MIN loses its best wing defender — Murray/Porter get open looks." },
        { player: "KAT", pfPG: 4.5, foulOutRisk: "HIGH", impactIfOut: "4.5 PF through 2 games. Jokic draws fouls on KAT in the post. If KAT sits, MIN's offense loses its secondary scorer." }
      ],
      modelImpact: "MIN's foul trouble is CRITICAL. 27.5 team PF/game (highest in playoffs). Gobert (5 fouls G2), McDaniels (4.5/g), and KAT (4.5/g) are all at risk. DEN's strategy: attack Gobert in P&R to draw his 3rd foul early, then feast on MIN's weakened interior D. This is a repeatable, schematic edge for DEN."
    }
  },
  "SAS-POR": {
    turnover: {
      home: { teamTOV: 12.0, tovPct: 11.5, keyRisks: [
        { player: "Wemby", tovPG: 4.0, careerPlayoffTOV: null, pressureNote: "First career playoff game: 4 TOV in 35pts debut. High usage (30%+) with complex playmaking = TOV risk. Will improve as he adjusts to playoff physicality." },
        { player: "Castle", tovPG: 3.0, careerPlayoffTOV: null, pressureNote: "Rookie PG in playoffs. 3 TOV in G1 — expect some growing pains." }
      ]},
      away: { teamTOV: 15.0, tovPct: 14.2, keyRisks: [
        { player: "Scoot Henderson", tovPG: 3.0, careerPlayoffTOV: null, pressureNote: "Young PG, first playoffs. Athletic but decision-making under pressure is unproven." },
        { player: "Sharpe", tovPG: 2.0, careerPlayoffTOV: null, pressureNote: "Explosive but raw. Turnover-prone in transition." }
      ]},
      differential: -3.0,
      modelImpact: "SAS's disciplined ball movement limits TOs. POR's young backcourt (Scoot/Sharpe) is athletic but turnover-prone. Wemby's 4 TOV in G1 is the main concern for SAS — Pop will coach that down."
    },
    foulTrouble: {
      home: [
        { player: "Wemby", pfPG: 2.0, foulOutRisk: "LOW", impactIfOut: "Only 2 PF in G1. Elite shot-blocking without fouling. DPOY-level discipline." }
      ],
      away: [
        { player: "Ayton", pfPG: 4.0, foulOutRisk: "HIGH", impactIfOut: "Physical big who draws fouls contesting Wemby. If Ayton sits, POR has no one to match Wemby's size." }
      ],
      modelImpact: "Wemby's foul discipline is elite — he blocks shots without fouling. POR's bigs will accumulate fouls trying to contest him. Ayton's foul trouble is POR's biggest risk."
    }
  },
  "DET-ORL": {
    turnover: {
      home: { teamTOV: 12.0, tovPct: 11.8, keyRisks: [
        { player: "Cade", tovPG: 2.0, careerPlayoffTOV: null, pressureNote: "First real playoff action as a star. 2 TOV in G1 — poised. Should maintain low TOV rate." },
        { player: "Duren", tovPG: 1.0, careerPlayoffTOV: null, pressureNote: "Limited ball-handling — low TOV risk." }
      ]},
      away: { teamTOV: 13.0, tovPct: 12.5, keyRisks: [
        { player: "Banchero", tovPG: 3.0, careerPlayoffTOV: null, pressureNote: "High-usage scorer who forces in the post. 3 TOV in G1 — manageable but DET's swarming D can force more." },
        { player: "Suggs", tovPG: 2.0, careerPlayoffTOV: null, pressureNote: "Aggressive defender but also aggressive with the ball. 6 PF in G1 (fouled out) — the real concern is fouls, not TOs." }
      ]},
      differential: -1.0,
      modelImpact: "Relatively even. Both young teams with some playoff inexperience. The TOV battle isn't the swing factor here — it's foul trouble."
    },
    foulTrouble: {
      home: [
        { player: "Duren", pfPG: 3.0, foulOutRisk: "MEDIUM", impactIfOut: "DET's rim protection hinges on Duren. If he sits, Banchero attacks the paint freely." }
      ],
      away: [
        { player: "Suggs", pfPG: 6.0, foulOutRisk: "EXTREME", impactIfOut: "FOULED OUT in G1 (6 PF). ORL's best perimeter defender. When Suggs sits, Cade gets clean looks." },
        { player: "WCJ", pfPG: 4.0, foulOutRisk: "HIGH", impactIfOut: "Physical center who contests everything. Foul trouble limits ORL's interior D." }
      ],
      modelImpact: "Suggs fouling out in G1 is a MAJOR red flag. ORL's perimeter D collapses without him. If Suggs picks up 2 early fouls in G2, DET's guards feast. This is an exploitable edge for DET."
    }
  },
  "BOS-PHI": {
    turnover: {
      home: { teamTOV: 10.0, tovPct: 9.1, keyRisks: [
        { player: "Tatum", tovPG: 2.0, careerPlayoffTOV: 3.2, pressureNote: "Elite ball security for a high-usage wing. G1: only 2 TOV. Career playoff: 3.2 but improved significantly in 2024-2026." },
        { player: "Brown", tovPG: 2.0, careerPlayoffTOV: 2.5, pressureNote: "Steady. 2 TOV in G1 — right at his improved career rate." }
      ]},
      away: { teamTOV: 16.0, tovPct: 15.8, keyRisks: [
        { player: "Maxey", tovPG: 3.0, careerPlayoffTOV: 2.8, pressureNote: "3 TOV in G1 — White's defense disrupts his handle. Maxey is PHI's only reliable initiator without Embiid — every possession runs through him." },
        { player: "Harden (PHI context)", tovPG: 4.5, careerPlayoffTOV: 3.8, pressureNote: "NOT ON PHI anymore but note: Harden-type high-usage PG TOV patterns apply to Maxey's current role — carrying entire offensive load with no Embiid." }
      ]},
      differential: -6.0,
      modelImpact: "BOS's 9.1% TOV rate is 2nd-best in playoffs. PHI without Embiid has to funnel everything through Maxey, creating predictable possessions that BOS's elite switching D exploits. The 6-turnover differential ≈ 6.4 points — a huge structural edge for BOS."
    },
    foulTrouble: {
      home: [
        { player: "Porzingis", pfPG: 3.0, foulOutRisk: "MEDIUM", impactIfOut: "BOS's rim protection. If he sits, PHI can attack the paint. But BOS has enough depth to survive." }
      ],
      away: [
        { player: "Drummond", pfPG: 3.0, foulOutRisk: "MEDIUM", impactIfOut: "PHI's only real center without Embiid. If Drummond fouls out, PHI has zero interior presence." }
      ],
      modelImpact: "PHI's thin frontcourt without Embiid makes Drummond's foul management critical. If he picks up 3 fouls by halftime, PHI's interior D evaporates."
    }
  },
  "NYK-ATL": {
    turnover: {
      home: { teamTOV: 14.0, tovPct: 13.2, keyRisks: [
        { player: "Brunson", tovPG: 2.5, careerPlayoffTOV: 2.8, pressureNote: "Steady under pressure. 2.5 TOV/game — below career average. His mid-range game doesn't create many live-ball TOs." },
        { player: "OG Anunoby", tovPG: 1.0, careerPlayoffTOV: 1.5, pressureNote: "Low usage, minimal TOV risk." }
      ]},
      away: { teamTOV: 12.0, tovPct: 11.5, keyRisks: [
        { player: "Trae Young", tovPG: 3.0, careerPlayoffTOV: 3.5, pressureNote: "Turnover-prone under physical D. NYK will body him up — expect 3.5+ TOV in this series." },
        { player: "McCollum", tovPG: 3.5, careerPlayoffTOV: 2.2, pressureNote: "3.5 TOV/game in 2026 playoffs is well above career 2.2. Aging guard forcing shots in a new system." }
      ]},
      differential: 2.0, // NYK turns it over slightly more (unexpected)
      modelImpact: "ATL actually has FEWER turnovers than NYK through 2 games, which is surprising. McCollum's veteran poise and Trae's familiarity with playoff pressure explain it. But NYK's bench crisis (0-7 FG, 5 TOV from McBride/Shamet/Alvarado in G2) inflates their number. If NYK tightens rotation to 8 players, their TOV rate should improve."
    },
    foulTrouble: {
      home: [
        { player: "Robinson", pfPG: 4.0, foulOutRisk: "HIGH", impactIfOut: "NYK's only true center. If he fouls out, Hartenstein lineups or small-ball — neither ideal vs Capela." }
      ],
      away: [
        { player: "Okongwu", pfPG: 4.0, foulOutRisk: "HIGH", impactIfOut: "4.0 PF/game. ATL's rim protection depends on him. If he sits, NYK attacks the paint." },
        { player: "Capela", pfPG: 3.0, foulOutRisk: "MEDIUM", impactIfOut: "Veteran big who manages fouls well but still at risk in physical series." }
      ],
      modelImpact: "Both teams' centers are foul-prone. The team that keeps their big out of foul trouble wins the paint battle. Okongwu's 4.0 PF/game is the bigger concern — ATL relies on his lob threat and rim protection."
    }
  },
  "CLE-TOR": {
    turnover: {
      home: { teamTOV: 12.0, tovPct: 11.2, keyRisks: [
        { player: "Mitchell", tovPG: 2.0, careerPlayoffTOV: 2.8, pressureNote: "69 career playoff games. G1: 2 TOV, G2: 2 TOV. Excellent ball security for a high-usage scorer. Historically: TOV spikes slightly in elimination games (3.5 avg) but CLE hasn't faced one yet." },
        { player: "Harden", tovPG: 4.5, careerPlayoffTOV: 3.8, pressureNote: "4.5 TOV/game in 2026 playoffs — above career 3.8. High-usage facilitator creates TOV risk. But 22 CLE points off TOR turnovers means Harden's value as a FORCER of turnovers outweighs his own." }
      ]},
      away: { teamTOV: 20.0, tovPct: 18.4, keyRisks: [
        { player: "Barnes", tovPG: 4.5, careerPlayoffTOV: null, pressureNote: "4.5 TOV/game — WORST individual rate in 2026 playoffs. Carrying too much creation load without Quickley. CLE's ball-hawking D (Mitchell-Harden backcourt) attacks his handles." },
        { player: "Ingram", tovPG: 2.5, careerPlayoffTOV: 2.0, pressureNote: "5 TOV in G2 as CLE's scheme completely shut him down (3/15 FG). When his driving lanes close, he forces passes into traffic." }
      ]},
      differential: -8.0,
      modelImpact: "CLE's turnover differential is their BIGGEST weapon. TOR had 18 TOV in G1 → 22 CLE points. Then 22 TOV in G2 → CLE won by 10. That's 8 more turnovers per game, worth ~8.6 points. With Quickley OUT, TOR has no reliable secondary ballhandler — Barnes is forced into a role that produces turnovers. This is a REPEATABLE, SCHEMATIC edge that won't go away until Quickley returns."
    },
    foulTrouble: {
      home: [
        { player: "Allen", pfPG: 2.5, foulOutRisk: "LOW", impactIfOut: "Manages fouls well despite physical play. Knee tendonitis is bigger concern than fouls." },
        { player: "Mobley", pfPG: 2.0, foulOutRisk: "LOW", impactIfOut: "Elite defensive discipline — blocks shots without fouling." }
      ],
      away: [
        { player: "Shead", pfPG: 4.5, foulOutRisk: "HIGH", impactIfOut: "Rookie PG with 4.5 PF/game. If he fouls out, TOR has NO point guard (Quickley OUT). Complete offensive breakdown." },
        { player: "Poeltl", pfPG: 3.0, foulOutRisk: "MEDIUM", impactIfOut: "Already marginalized (9min G2). Foul trouble would end any chance of a Poeltl return to the rotation." }
      ],
      modelImpact: "TOR's foul situation compounds their turnover problem. Shead at 4.5 PF/game as the ONLY healthy PG is terrifying — one early foul trouble game and TOR literally has no ballhandler. CLE should attack Shead aggressively in P&R to draw fouls."
    }
  }
};

// ============================================================
// PHASE 25 — 3-POINT VARIANCE & REGRESSION MODEL
// ============================================================
// Data sourced from: Basketball Reference 2026 Playoffs Summary (team & individual stats),
// 2025-26 Regular Season team per-game stats, Core Sports Betting regression methodology,
// and individual playoff per-game shooting logs for all 182 players.
//
// Model Integration:
//   Expected 3P% = Bayesian blend of playoff sample + season baseline
//   Regression Weight = 0.70 for 1-game samples, 0.55 for 2-game samples (heavy regression in small samples)
//   Impact = (expected 3P% - actual playoff 3P%) × 3PA × 3 pts × game-relevance weight
//   Unsustainability Flag: role players shooting >15% above career avg, or stars >12% below
//   Shot Quality Filter: contested vs open 3s, corner 3PT%, transition vs halfcourt
// ============================================================

const THREE_POINT_VARIANCE_DATA = {
  "HOU-LAL": {
    home: {
      team: { regSeason3Pct: .364, playoff3Pct: .333, threePA: 33, delta: -.031, verdict: "SLIGHTLY COLD" },
      keyShooters: [
        { player: "Sheppard", playoff3: "5/14 (.357)", season3Pct: .387, verdict: "SLIGHTLY COLD — high volume, should regress UP to ~.375" },
        { player: "Jabari Smith", playoff3: "3/9 (.333)", season3Pct: .361, verdict: "COLD — open catch-and-shoot looks weren't falling. Expect regression UP" },
        { player: "Eason", playoff3: "2/2 (1.000)", season3Pct: .340, verdict: "UNSUSTAINABLE — tiny sample but can't maintain this" }
      ],
      modelNote: "HOU's 3PT shooting was slightly below baseline in G1. With KD returning for G2, he commands defensive attention that opens corner 3s for Sheppard/Smith. Expect HOU's 3P% to climb toward .360-.370."
    },
    away: {
      team: { regSeason3Pct: .359, playoff3Pct: .526, threePA: 19, delta: +.167, verdict: "EXTREME REGRESSION DOWN" },
      keyShooters: [
        { player: "Kennard", playoff3: "5/5 (1.000)", season3Pct: .440, verdict: "MASSIVE regression incoming — 100% from 3 is the textbook unsustainable role-player hot streak" },
        { player: "Hachimura", playoff3: "2/4 (.500)", season3Pct: .350, verdict: "HOT — 15% above season avg, likely cools" },
        { player: "LeBron", playoff3: "1/2 (.500)", season3Pct: .330, verdict: "Tiny sample, not meaningful" },
        { player: "Smart", playoff3: "1/5 (.200)", season3Pct: .340, verdict: "COLD — Smart is a streaky shooter but .200 on volume is below floor" }
      ],
      modelNote: "LAL shot 52.6% from 3 in G1 on just 19 attempts — the MOST unsustainable team 3P% in the playoffs. Kennard going 5/5 is a once-in-a-season event. Bayesian expected G2 3P%: ~.375 (still above season avg due to shot quality/open looks, but dramatic drop from .526). This alone could swing 6-8 points toward HOU. LAL's low 3PA (19 vs 33 league avg) means they're not volume-dependent, but the efficiency cliff is real."
    },
    seriesImpact: "LAL's G1 win was built on historically unsustainable 3PT shooting (.526). Regression model projects ~.375 for G2 — still good but worth ~4.5 fewer points than G1. Combined with KD's return for HOU, the 3PT regression alone nearly flips the spread. HIGH CONFIDENCE regression down for LAL."
  },
  "OKC-PHX": {
    home: {
      team: { regSeason3Pct: .365, playoff3Pct: .304, threePA: 46, delta: -.061, verdict: "COLD — regression UP expected" },
      keyShooters: [
        { player: "SGA", playoff3: "0/4 (.000)", season3Pct: .387, verdict: "EXTREME COLD — best 3PT season of career, 0/4 is pure variance. Expect strong regression UP" },
        { player: "Dort", playoff3: "2/6 (.333)", season3Pct: .350, verdict: "AT BASELINE — sustainable" },
        { player: "Isaiah Joe", playoff3: "3/8 (.375)", season3Pct: .380, verdict: "AT BASELINE — sustainable" },
        { player: "Jalen Williams", playoff3: "2/5 (.400)", season3Pct: .370, verdict: "SLIGHTLY HOT — close to sustainable" }
      ],
      modelNote: "OKC won G1 by 35 DESPITE shooting .304 from 3. SGA going 0/4 from deep is a massive outlier given his .387 season. OKC's defense forced PHX into terrible shots. If OKC shoots closer to their .365 baseline, they could win by 40+. This is terrifying for PHX."
    },
    away: {
      team: { regSeason3Pct: .361, playoff3Pct: .333, threePA: 39, delta: -.028, verdict: "SLIGHTLY COLD" },
      keyShooters: [
        { player: "Booker", playoff3: "2/5 (.400)", season3Pct: .370, verdict: "SLIGHTLY HOT — close to season avg" },
        { player: "Brooks", playoff3: "3/10 (.300)", season3Pct: .360, verdict: "COLD — volume shooter below baseline, slight regression UP" },
        { player: "Green", playoff3: "2/7 (.286)", season3Pct: .350, verdict: "COLD — expect regression UP to ~.330" },
        { player: "Fleming", playoff3: "3/3 (1.000)", season3Pct: .350, verdict: "UNSUSTAINABLE — bench player, tiny sample" }
      ],
      modelNote: "PHX shot slightly below baseline but the real problem was their 34.9% FG%. Even if PHX's 3PT shooting regresses UP to .361, OKC's suffocating defense (33.3% opponent 3P%) may cap PHX's ceiling at ~.340."
    },
    seriesImpact: "The 3PT variance story FAVORS OKC: they won G1 while cold, PHX lost while close to baseline. OKC's defensive 3PT suppression (.333 opponent 3P% in playoffs, driven by 15.4% opponent 3PAr — lowest in playoffs) is a STRUCTURAL edge, not variance. SGA regression UP alone could add 3-5 points to OKC's margin."
  },
  "DEN-MIN": {
    home: {
      team: { regSeason3Pct: .396, playoff3Pct: .325, threePA: 38.5, delta: -.071, verdict: "COLD — DEN led the league in RS 3P%, shooting way below" },
      keyShooters: [
        { player: "Murray", playoff3: "3/11 (.273)", season3Pct: .380, verdict: "COLD — 10.7% below season avg on high volume. Knee may be a factor but expect regression UP" },
        { player: "Jokic", playoff3: "1.5/7 (.214)", season3Pct: .340, verdict: "COLD — Jokic isn't a volume 3PT shooter but .214 is below his floor" },
        { player: "Gordon", playoff3: "1/4.5 (.222)", season3Pct: .330, verdict: "COLD — AG's 3PT shot is streaky but .222 is an outlier low" },
        { player: "Braun", playoff3: "1.5/3 (.500)", season3Pct: .370, verdict: "HOT — slight regression down expected" }
      ],
      modelNote: "DEN led the NBA in regular season 3P% (.396) but is shooting .325 in the playoffs — a 7.1% drop. Murray's .273 on 11 attempts per game is the biggest factor. Bayesian expected G3 3P%: ~.365 (regression toward .396 baseline but playoff defense adjustment). If DEN gets just 2 more 3s to fall per game, that's 6 extra points."
    },
    away: {
      team: { regSeason3Pct: .370, playoff3Pct: .368, threePA: 34, delta: -.002, verdict: "AT BASELINE — sustainable" },
      keyShooters: [
        { player: "DiVincenzo", playoff3: "4/7 (.571)", season3Pct: .370, verdict: "HOT — 20% above season avg. Role-player hot streak = high regression risk" },
        { player: "Edwards", playoff3: "2.5/10 (.250)", season3Pct: .370, verdict: "COLD — Ant's 12% below season avg on 10 3PA/game is a major swing factor. Expect regression UP" },
        { player: "Randle", playoff3: "1/3.5 (.286)", season3Pct: .340, verdict: "SLIGHTLY COLD — close to normal for Randle" },
        { player: "McDaniels", playoff3: "0/3.5 (.000)", season3Pct: .350, verdict: "ICE COLD — 0-for-7 from 3 is extreme. Expect correction to ~.300" }
      ],
      modelNote: "MIN's team 3P% is right at baseline (.368 vs .370), but the COMPOSITION is unstable: DiVincenzo is running hot (+20%) while Edwards (-12%) and McDaniels (-35%) are ice cold. Bayesian model expects Edwards to regress UP toward .330 and DiVincenzo to cool to ~.400. Net effect: MIN's 3PT output stays similar but becomes more star-dependent (Edwards) rather than role-player-dependent."
    },
    seriesImpact: "DEN has massive 3PT regression UP potential — they're the best 3PT team in the league shooting 7% below their norm. Murray finding his shot in G3 at home could be worth 4-6 points. Edwards' cold shooting masks MIN's true offensive ceiling — if Ant hits at .350+, MIN's offense jumps 5+ points. This is the most volatile 3PT series in R1."
  },
  "SAS-POR": {
    home: {
      team: { regSeason3Pct: .359, playoff3Pct: .455, threePA: 33, delta: +.096, verdict: "VERY HOT — regression DOWN expected" },
      keyShooters: [
        { player: "Wembanyama", playoff3: "5/6 (.833)", season3Pct: .359, verdict: "EXTREME REGRESSION — .833 from 3 is utterly unsustainable for anyone, let alone a 7'4 center. Expect ~.350 going forward" },
        { player: "Champagnie", playoff3: "2/3 (.667)", season3Pct: .370, verdict: "HOT — small sample, role player inflation" },
        { player: "Vassell", playoff3: "4/9 (.444)", season3Pct: .380, verdict: "SLIGHTLY HOT — close to sustainable for an elite shooter" },
        { player: "Castle", playoff3: "1/5 (.200)", season3Pct: .320, verdict: "COLD — young guard, but .200 is near his floor" }
      ],
      modelNote: "SAS shot .455 from 3 in G1, but Wemby going 5/6 accounts for most of the inflation. Remove Wemby's 3s: SAS is 10/27 (.370) — right at baseline. Wemby's 3PT regression alone is worth ~7 points (from 15pts on 3s to ~6pts). SAS's other shooters were close to sustainable."
    },
    away: {
      team: { regSeason3Pct: .343, playoff3Pct: .263, threePA: 38, delta: -.080, verdict: "VERY COLD — regression UP expected" },
      keyShooters: [
        { player: "Holiday", playoff3: "1/7 (.143)", season3Pct: .350, verdict: "ICE COLD — veteran shooter 20% below baseline. Strong regression UP expected" },
        { player: "Camara", playoff3: "2/5 (.400)", season3Pct: .340, verdict: "SLIGHTLY HOT — close to baseline" },
        { player: "Clingan", playoff3: "0/3 (.000)", season3Pct: .280, verdict: "COLD — Clingan isn't a reliable 3PT threat regardless" },
        { player: "Henderson", playoff3: "2/4 (.500)", season3Pct: .350, verdict: "HOT — young guard, small sample inflation" }
      ],
      modelNote: "POR shot .263 from 3 — 8% below their already-low season baseline (.343). Holiday going 1/7 is the biggest outlier. If POR regresses to even .320, that's ~2 extra 3s = 6 points. POR's volume (38 3PA) means regression has outsized impact. G2 should be significantly closer than G1."
    },
    seriesImpact: "DOUBLE REGRESSION: SAS hot (.455→~.370) and POR cold (.263→~.320). Net swing: SAS loses ~3 pts from 3PT regression, POR gains ~5 pts. Combined with Wemby's .833→~.350 regression, G2 projected margin should compress by 6-8 points vs G1's 13-point margin. HIGH CONFIDENCE."
  },
  "DET-ORL": {
    home: {
      team: { regSeason3Pct: .356, playoff3Pct: .313, threePA: 32, delta: -.043, verdict: "COLD — regression UP" },
      keyShooters: [
        { player: "Cunningham", playoff3: "3/8 (.375)", season3Pct: .370, verdict: "AT BASELINE — sustainable" },
        { player: "Robinson", playoff3: "3/6 (.500)", season3Pct: .410, verdict: "SLIGHTLY HOT — Duncan Robinson can sustain high 3P% in bursts" },
        { player: "Harris", playoff3: "1/7 (.143)", season3Pct: .350, verdict: "ICE COLD — veteran shooter with 20% gap. Strong regression UP" },
        { player: "Jenkins", playoff3: "1/6 (.167)", season3Pct: .340, verdict: "COLD — rookie variability" }
      ],
      modelNote: "DET shot .313 from 3 in G1, driven by Harris (1/7) and Jenkins (1/6) going ice cold. Harris alone regressing to .350 would add ~4 pts. DET's problem wasn't shot creation — they generated open looks but missed. G2 correction likely."
    },
    away: {
      team: { regSeason3Pct: .343, playoff3Pct: .294, threePA: 34, delta: -.049, verdict: "COLD — regression UP" },
      keyShooters: [
        { player: "Banchero", playoff3: "2/4 (.500)", season3Pct: .305, verdict: "HOT — Paolo is a career low-volume 3PT shooter; .500 won't last" },
        { player: "Suggs", playoff3: "3/10 (.300)", season3Pct: .350, verdict: "SLIGHTLY COLD — Suggs is a streaky shooter, near floor" },
        { player: "Bane", playoff3: "1/8 (.125)", season3Pct: .380, verdict: "EXTREME COLD — elite shooter 25% below baseline. Massive regression UP incoming" }
      ],
      modelNote: "Bane going 1/8 (.125) is the biggest single-player regression candidate in the East. His career 3P% is ~.400 — regression to even .350 adds ~6 points to ORL's offense. ORL won G1 despite cold shooting, which is bullish for their series chances."
    },
    seriesImpact: "Both teams shot cold from 3 in G1, which explains the low-scoring affair (112-101). Bane's .125 regression UP could flip G2 if DET's defense doesn't adjust. Harris (.143) regression UP gives DET a counter-boost. Net: ORL has more regression upside because Bane is the better shooter with more volume."
  },
  "BOS-PHI": {
    home: {
      team: { regSeason3Pct: .367, playoff3Pct: .364, threePA: 44, delta: -.003, verdict: "AT BASELINE — sustainable" },
      keyShooters: [
        { player: "Hauser", playoff3: "4/6 (.667)", season3Pct: .420, verdict: "HOT — Hauser can sustain hot streaks (elite shooter) but .667 is above his ceiling" },
        { player: "Tatum", playoff3: "1/7 (.143)", season3Pct: .370, verdict: "COLD — Tatum's 3PT shot was off in G1 despite the blowout. Expect regression UP" },
        { player: "White", playoff3: "2/7 (.286)", season3Pct: .380, verdict: "SLIGHTLY COLD — below baseline, expect correction" },
        { player: "Pritchard", playoff3: "2/9 (.222)", season3Pct: .400, verdict: "COLD — Pritchard normally shoots .400+. Regression UP likely" }
      ],
      modelNote: "BOS's team 3P% (.364) was right at season baseline despite Tatum (1/7), White (2/7), and Pritchard (2/9) all shooting cold. Hauser (4/6) and Brown (2/2) masked the individual cold streaks. BOS won by 32 with BELOW-AVERAGE 3PT shooting from their stars — terrifying for PHI. If Tatum/White/Pritchard regress UP, BOS's offensive ceiling is even higher."
    },
    away: {
      team: { regSeason3Pct: .349, playoff3Pct: .174, threePA: 23, delta: -.175, verdict: "HISTORIC COLD — most extreme regression UP candidate in all 8 series" },
      keyShooters: [
        { player: "Maxey", playoff3: "1/4 (.250)", season3Pct: .370, verdict: "COLD — Maxey is a career .370 3PT shooter, .250 is well below" },
        { player: "Oubre", playoff3: "0/5 (.000)", season3Pct: .340, verdict: "ICE COLD — 0/5 is extreme. Even Oubre hits some 3s normally" },
        { player: "George", playoff3: "1/2 (.500)", season3Pct: .370, verdict: "SLIGHTLY HOT — small sample, close to baseline" },
        { player: "Edgecombe", playoff3: "0/5 (.000)", season3Pct: .310, verdict: "COLD — young player, pressure factor" }
      ],
      modelNote: "PHI shot .174 from 3 — the WORST team 3P% in the entire 2026 playoffs and 17.5% below their season baseline. This is historically anomalous. Even a bad team hits ~.280 on open looks. Bayesian expected G2 3P%: ~.300 (still below season avg due to BOS's elite perimeter defense, but a massive improvement). PHI hitting just 2 more 3s = 6 extra points, making G2 potentially competitive (91→~100). Without Embiid though, PHI's ceiling is capped."
    },
    seriesImpact: "PHI's .174 3P% is the most extreme regression candidate. However, BOS's elite perimeter defense (they held opponents to .256 3P% in G1 — best in playoffs) suggests PHI's true playoff ceiling vs BOS is ~.300, not their .349 season avg. Even with regression UP, PHI is still down 20+ pts of offensive firepower vs BOS. The 3PT gap is structural, not just variance. LOW IMPACT on series outcome."
  },
  "NYK-ATL": {
    home: {
      team: { regSeason3Pct: .373, playoff3Pct: .390, threePA: 29.5, delta: +.017, verdict: "SLIGHTLY HOT — close to sustainable" },
      keyShooters: [
        { player: "Brunson", playoff3: "3.5/7 (.500)", season3Pct: .370, verdict: "HOT — Brunson was unconscious from 3 in G1 (5/9) but cooled in G2 (2/5). Averaging out to ~baseline" },
        { player: "KAT", playoff3: "2.5/4.5 (.556)", season3Pct: .380, verdict: "HOT — KAT's 3PT shot is running above season avg, mild regression expected" },
        { player: "Bridges", playoff3: "1.5/5 (.300)", season3Pct: .370, verdict: "COLD — Bridges normally shoots .370. If he heats up, NYK's offense jumps a tier" },
        { player: "Hart", playoff3: "0.5/3 (.167)", season3Pct: .340, verdict: "COLD — Hart's 3PT shot has been off. Minor regression UP" }
      ],
      modelNote: "NYK's team 3P% is close to baseline but the distribution shifted between games: G1 hot (Brunson 5/9), G2 cold. Bridges at .300 is the biggest upside — if he finds his .370 stroke for G3-G4, NYK's spacing improves dramatically."
    },
    away: {
      team: { regSeason3Pct: .371, playoff3Pct: .343, threePA: 33.5, delta: -.028, verdict: "SLIGHTLY COLD" },
      keyShooters: [
        { player: "McCollum", playoff3: "3.5/9.5 (.368)", season3Pct: .380, verdict: "AT BASELINE — CJ's shooting is sustainable and reliable" },
        { player: "Okongwu", playoff3: "3/4.5 (.667)", season3Pct: .200, verdict: "EXTREME UNSUSTAINABLE — Okongwu is a career sub-.200 3PT shooter hitting .667. This is the most extreme individual regression candidate. Expect near-complete collapse to ~.200" },
        { player: "Jalen Johnson", playoff3: "1.5/5 (.300)", season3Pct: .350, verdict: "SLIGHTLY COLD — slight regression UP expected" },
        { player: "NAW", playoff3: "2.5/6.5 (.385)", season3Pct: .360, verdict: "AT BASELINE — sustainable" }
      ],
      modelNote: "ATL's 3PT story is dominated by Okongwu's .667 from 3 — a career sub-.200 shooter. He hit 3/4 in G1 and 3/5 in G2. This WILL regress hard. Without Okongwu's inflated 3PT production, ATL's team 3P% drops to ~.290 (20/69). ATL's G2 upset was partially built on this unsustainable shooting."
    },
    seriesImpact: "ATL's G2 upset at MSG was fueled by Okongwu's impossible .667 3P%. When (not if) this regresses, ATL loses ~5 points per game from 3PT alone. For G3-G4 at ATL, home court + McCollum's reliability could compensate, but the Okongwu 3PT mirage will fade. NYK's Bridges regression UP partially offsets. MODERATE IMPACT — favors NYK in games 3+."
  },
  "CLE-TOR": {
    home: {
      team: { regSeason3Pct: .360, playoff3Pct: .403, threePA: 36, delta: +.043, verdict: "HOT — regression DOWN expected" },
      keyShooters: [
        { player: "Mitchell", playoff3: "4/8.5 (.471)", season3Pct: .360, verdict: "HOT — Spida is 11% above season avg. Expect regression toward .380 (career playoff avg is ~.360)" },
        { player: "Harden", playoff3: "3.5/7.5 (.467)", season3Pct: .360, verdict: "HOT — Harden's 3PT shot is running 10% hot. History shows Harden cools in mid-series" },
        { player: "Strus", playoff3: "3/5 (.600)", season3Pct: .370, verdict: "VERY HOT — Strus was the G1 hero (8/10 FG) but .600 from 3 is role-player inflation" },
        { player: "Shead (TOR)", playoff3: "3/5.5 (.545)", season3Pct: .360, verdict: "HOT — TOR's PG is shooting well above baseline from 3" }
      ],
      modelNote: "CLE's Big 3 (Mitchell/Harden/Strus) are ALL shooting 10%+ above season averages from 3. Bayesian blend for G3: CLE expected 3P% ~.375 (still good due to shot quality/TOR's weak perimeter D, but 3% below current rate). Mitchell and Harden both historically cool from 3 in the middle of series before heating up again in close-out games."
    },
    away: {
      team: { regSeason3Pct: .354, playoff3Pct: .377, threePA: 26.5, delta: +.023, verdict: "SLIGHTLY HOT" },
      keyShooters: [
        { player: "Barnes", playoff3: "2/4 (.500)", season3Pct: .320, verdict: "HOT — Barnes is a career .320 3PT shooter; .500 won't sustain" },
        { player: "Barrett", playoff3: "1.5/3.5 (.429)", season3Pct: .360, verdict: "SLIGHTLY HOT — close to sustainable" },
        { player: "Walter", playoff3: "2/5.5 (.364)", season3Pct: .409, verdict: "SLIGHTLY COLD — Walter normally shoots .409; expect regression UP" },
        { player: "Ingram", playoff3: "0.5/2 (.250)", season3Pct: .329, verdict: "COLD — below his already-low baseline" }
      ],
      modelNote: "TOR's 3PT story is mixed: Barnes hot (.500 vs .320 career), Walter cold (.364 vs .409), Ingram cold (.250). TOR's low volume (26.5 3PA vs 36 for CLE) means 3PT variance has less total impact on their scoring. TOR's path to competitiveness runs through the paint, not the arc."
    },
    seriesImpact: "CLE has more regression DOWN risk (Mitchell/Harden/Strus all hot) than TOR has regression UP potential (low 3PA volume). Net: CLE's G3 scoring may dip 3-4 points from 3PT regression alone. However, CLE's overall offensive machine is paint-dominant (48-30 paint advantage in G1), so 3PT regression is a secondary factor. LOW-MODERATE IMPACT."
  }
};

// ============================================================
// ROLE FLEXIBILITY DATA (Phase 26)
// ============================================================
// Framework: Adapted from Nylon Calculus HHI defensive versatility model (Miller 2018),
// Guo et al. 2025 lineup-based versatility quantification, and SI playoff trends analysis.
// Historical finding: In 2018 playoffs, NONE of the bottom-8 teams in defensive versatility
// advanced past R1. Conference Finals teams ranked top-4 in versatility.
//
// Dimensions (each 0-10):
//   switchDefense: How many rotation players can credibly switch 1-4 or 1-5 defensively
//   offRoleFlex: Can stars toggle scorer/facilitator; multi-initiator offense capability
//   lineupOptions: Viable alternative lineups (small-ball, big, switching, etc.)
//   positionalVersatility: Number of players credibly playing 2+ positions
//   overallFlex: Weighted average (switchDef 30%, offRole 25%, lineup 25%, posVers 20%)
//
// Point adjustment formula: (homeFlex - awayFlex) × 0.4, capped at ±3.0
// ============================================================

const ROLE_FLEXIBILITY_DATA = {
  "HOU-LAL": {
    home: {
      team: "HOU",
      switchDefense: 7.5,
      offRoleFlex: 7.0,
      lineupOptions: 7.0,
      positionalVersatility: 7.5,
      overallFlex: 7.2,
      keyFlexPlayers: [
        { player: "Amen Thompson", flexNote: "6-7 PG — guards 1-3, initiates offense or slashes. Most positionally disruptive player on either roster. Played PG, SG, SF in reg season.", positionsPlayed: "PG/SG/SF" },
        { player: "Kevin Durant", flexNote: "6-11 SF/PF — scores from anywhere, can facilitate in short-roll, defends 2-4. When healthy, transforms HOU from single-initiator to multi-creator.", positionsPlayed: "SF/PF" },
        { player: "Dorian Finney-Smith", flexNote: "3&D wing who switches 2-4 seamlessly. 6-7 frame + 7-1 wingspan. Championship DNA (DAL 2022 Finals).", positionsPlayed: "SF/PF" },
        { player: "Jabari Smith Jr.", flexNote: "6-11 PF/C — can play stretch-5 in small lineups or space the floor at 4. .348 career 3PT from the 4/5 is rare.", positionsPlayed: "PF/C" }
      ],
      smallBallLineup: "VanVleet / Sheppard / Thompson / KD / Jabari — 5-out switching everything",
      bigLineup: "VanVleet / Sheppard / KD / Jabari / Sengun — traditional with post-up creation",
      historicalNote: "KD's career playoff role flexibility is elite — primary scorer in OKC/GSW/BKN/PHX/HOU across 5 different systems. Thompson is first-time playoff player but 6-7 PG frame is inherently matchup-proof."
    },
    away: {
      team: "LAL",
      switchDefense: 5.0,
      offRoleFlex: 5.0,
      lineupOptions: 4.5,
      positionalVersatility: 5.5,
      overallFlex: 5.0,
      keyFlexPlayers: [
        { player: "LeBron James", flexNote: "ALL-TIME positional flexibility: 21 playoff runs playing PG/SF/PF. G1 showed facilitator mode (13ast) when scoring wasn't falling. At 41, still guards 1-4 in short bursts.", positionsPlayed: "PG/SF/PF" },
        { player: "Marcus Smart", flexNote: "DPOY-caliber switch defender. Guards 1-4 on defense, initiates offense when needed. G1: disrupted Sengun AND switched onto guards.", positionsPlayed: "PG/SG" },
        { player: "Rui Hachimura", flexNote: "6-8 PF who can play small-ball 5. Decent face-up scorer but limited playmaking.", positionsPlayed: "PF/SF" }
      ],
      smallBallLineup: "Smart / Knecht / LeBron / Hachimura / Vanderbilt — no spacing, grinding defense",
      bigLineup: "Smart / Knecht / LeBron / Hachimura / Ayton — traditional, post-heavy",
      injuryImpact: "WITHOUT Luka (PG/SG, 6-8) and Reaves (SG, 6-5), LAL loses TWO multi-position creators. Flexibility drops from ~7.5 to 5.0. LeBron carries entire creation burden.",
      historicalNote: "LeBron's playoff role flexibility is historically unmatched — won titles as primary scorer (2012-13 MIA), facilitator (2020 LAL), and hybrid (2016 CLE comeback). Smart was key switch defender in BOS's 2024 championship run."
    },
    flexDifferential: 2.2,
    modelAdjustment: 0.9,
    seriesNote: "HOU's positional versatility (Amen's 6-7 PG, KD's SF/PF, Jabari's PF/C) vs LAL's injury-depleted roster creates a structural mismatch. LAL's defensive switching relies almost entirely on Smart and LeBron. When Smart rests, LAL has NO credible switch defender at guard. HOU can exploit this by running Amen in pick-and-rolls — any switch produces a mismatch."
  },

  "OKC-PHX": {
    home: {
      team: "OKC",
      switchDefense: 9.5,
      offRoleFlex: 9.0,
      lineupOptions: 9.0,
      positionalVersatility: 9.5,
      overallFlex: 9.2,
      keyFlexPlayers: [
        { player: "Jalen Williams", flexNote: "6-5 SG who plays SF and PF — the ultimate 3-position weapon. 2025 Finals proved he can be #2 scorer OR primary facilitator. Guards 1-4 on defense.", positionsPlayed: "SG/SF/PF" },
        { player: "Shai Gilgeous-Alexander", flexNote: "6-6 PG/SG — size allows switching onto wings. Scores at all 3 levels. Can play off-ball when Williams initiates.", positionsPlayed: "PG/SG" },
        { player: "Lu Dort", flexNote: "6-4 but 220lbs — switches 1-3 and physically matches up with PFs. Historically locked down stars across all positions in playoffs.", positionsPlayed: "SG/SF" },
        { player: "Alex Caruso", flexNote: "Elite switch defender (PG/SG). Secondary ballhandler. Won championship with LAL 2020 in switching schemes.", positionsPlayed: "PG/SG" },
        { player: "Chet Holmgren", flexNote: "7-1 PF/C who can switch onto guards in short bursts. Blocks shots from the weak side while recovering. Unique rim protector.", positionsPlayed: "PF/C" }
      ],
      smallBallLineup: "SGA / Dort / Williams / Caruso / Holmgren — switching everything, 5-out spacing",
      bigLineup: "SGA / Williams / Wiggins / Holmgren / Hartenstein — size + rebounding advantage",
      historicalNote: "OKC WON 2025 CHAMPIONSHIP with switch-everything defense as their identity. Daigneault's system is built on positional versatility — every player defends multiple positions. Proven model."
    },
    away: {
      team: "PHX",
      switchDefense: 4.0,
      offRoleFlex: 5.5,
      lineupOptions: 4.0,
      positionalVersatility: 4.5,
      overallFlex: 4.5,
      keyFlexPlayers: [
        { player: "Royce O'Neale", flexNote: "SF/PF — best switching defender on PHX roster. 6-6, guards 2-4. Playoff experience (UTA, BKN, PHI).", positionsPlayed: "SF/PF" },
        { player: "Ryan Dunn", flexNote: "6-7 SF — athletic wing defender with some switching upside. Limited offensive role.", positionsPlayed: "SF" },
        { player: "Dillon Brooks", flexNote: "6-7 SF — physical defender but limited to wing assignments. Can't switch onto guards effectively.", positionsPlayed: "SF" }
      ],
      smallBallLineup: "Booker / Green / Brooks / O'Neale / Ighodaro — spacing issues, limited creation",
      bigLineup: "Booker / Green / Brooks / Ighodaro / M.Williams — traditional, one creator",
      historicalNote: "Booker has playoff pedigree (2021 Finals) but PHX has always been built around his scoring, not versatility. Green's addition helps creation but doesn't fix switching gaps."
    },
    flexDifferential: 4.7,
    modelAdjustment: 1.9,
    seriesNote: "LARGEST flexibility gap in R1. OKC's switch-everything championship defense vs PHX's rigid single-creator offense. G1's 35-pt blowout confirmed that PHX has NO answer for OKC's multi-initiator attack — when SGA, Williams, AND role players all contribute, PHX's defense is overwhelmed. OKC can switch every screen; PHX cannot."
  },

  "DEN-MIN": {
    home: {
      team: "DEN",
      switchDefense: 5.5,
      offRoleFlex: 8.5,
      lineupOptions: 6.5,
      positionalVersatility: 6.0,
      overallFlex: 6.5,
      keyFlexPlayers: [
        { player: "Aaron Gordon", flexNote: "6-8 PF/SF — DEN's best switch defender. Guards 2-4, plays 3 or 4. Connector on offense (cutting, short-roll passing).", positionsPlayed: "PF/SF" },
        { player: "Nikola Jokic", flexNote: "ALL-TIME offensive versatility at C: scores, facilitates (8+ APG), rebounds, plays in post or at arc. But DROP defender only — limits DEN's defensive schemes.", positionsPlayed: "C (offense: C/PG hybrid)" },
        { player: "Christian Braun", flexNote: "6-6 SG/SF — improved switching defender. Championship experience (2023). Can guard 1-3 and play either wing.", positionsPlayed: "SG/SF" },
        { player: "Cameron Johnson", flexNote: "6-8 SF/PF — elite floor spacer who defends 3/4. Adds lineup optionality.", positionsPlayed: "SF/PF" }
      ],
      smallBallLineup: "Murray / Braun / Cam Johnson / Gordon / Jokic — 5-out, elite spacing",
      bigLineup: "Murray / Braun / Gordon / Jokic / Valanciunas — twin towers, paint dominance",
      historicalNote: "DEN won 2023 title with Jokic's offensive versatility compensating for defensive limitations. 2025: took OKC to 7 games despite defensive rating issues. Jokic's playoff career: 26/12/8 — most versatile offensive center ever."
    },
    away: {
      team: "MIN",
      switchDefense: 6.5,
      offRoleFlex: 5.5,
      lineupOptions: 6.0,
      positionalVersatility: 6.0,
      overallFlex: 6.0,
      keyFlexPlayers: [
        { player: "Jaden McDaniels", flexNote: "6-9 PF/SF — MIN's most versatile defender. Switches 2-4 and contests 3s with 7-0 wingspan. Key to containing Murray/Jokic actions.", positionsPlayed: "PF/SF" },
        { player: "Kyle Anderson", flexNote: "6-8 SF/PF — 'Slo-Mo' is a secondary playmaker with positional flexibility. Guards 2-4, facilitates in half-court.", positionsPlayed: "SF/PF" },
        { player: "Naz Reid", flexNote: "6-9 C/PF — gives MIN a small-ball 5 option when Gobert sits. Can space the floor (.368 3PT career).", positionsPlayed: "C/PF" },
        { player: "Anthony Edwards", flexNote: "6-4 SG who can play SF in small lineups. Improving as facilitator (5.5 APG). Physical enough to guard 1-3.", positionsPlayed: "SG/SF" }
      ],
      smallBallLineup: "Edwards / DiVincenzo / McDaniels / Randle / Reid — more spacing, switchable",
      bigLineup: "Edwards / DiVincenzo / McDaniels / Randle / Gobert — rim protection + rebounding",
      historicalNote: "MIN's G2 lineup adjustment (DiVincenzo over Conley) was a role flexibility move — prioritizing switching and spacing. Edwards' 2024 playoff run (vs DEN) showed his scorer-to-alpha evolution is real."
    },
    flexDifferential: 0.5,
    modelAdjustment: 0.2,
    seriesNote: "Closest flexibility matchup in R1. DEN has ELITE offensive role flexibility (Jokic's all-time versatility) but POOR defensive switching (Jokic drop scheme). MIN has BETTER defensive switching (McDaniels, Edwards) but MORE RIGID offense (Edwards-centric). This is offense-flex vs defense-flex — nearly a wash. The G2 DiVincenzo-over-Conley switch shows MIN is ADAPTING its flexibility in real-time."
  },

  "SAS-POR": {
    home: {
      team: "SAS",
      switchDefense: 8.0,
      offRoleFlex: 7.5,
      lineupOptions: 8.5,
      positionalVersatility: 8.0,
      overallFlex: 8.0,
      keyFlexPlayers: [
        { player: "Victor Wembanyama", flexNote: "7-5 C/PF — MOST VERSATILE DEFENDER IN NBA HISTORY. Guards 1-5 credibly. Blocks shots from perimeter AND paint. On offense: shoots 3s (.357), handles, passes, posts up. Truly positionless.", positionsPlayed: "C/PF (defends 1-5)" },
        { player: "Devin Vassell", flexNote: "6-5 SF/SG — switchable wing defender, reliable 3PT shooter. Can play 2 or 3.", positionsPlayed: "SF/SG" },
        { player: "Stephon Castle", flexNote: "6-6 SG/SF — elite athletic defender, switches 1-3. Developing offensive game. Playoff rookie energy.", positionsPlayed: "SG/SF" },
        { player: "Keldon Johnson (Harrison)", flexNote: "Physical PF/SF who plays both forward spots. Provides lineup flexibility at 4.", positionsPlayed: "PF/SF" }
      ],
      smallBallLineup: "Fox / Castle / Vassell / Harrison / Wemby — switching everything, 5-out with Wemby at 5",
      bigLineup: "Fox / Castle / Vassell / Wemby / Kornet — traditional rim protection + length",
      historicalNote: "Wemby's G1 playoff debut (35pts, 5-6 3PT) confirmed he's matchup-proof. His versatility is unprecedented — 7-5 with guard skills. Johnson (Pop's protege) has run versatile schemes his entire career."
    },
    away: {
      team: "POR",
      switchDefense: 3.5,
      offRoleFlex: 4.5,
      lineupOptions: 3.5,
      positionalVersatility: 4.5,
      overallFlex: 4.0,
      keyFlexPlayers: [
        { player: "Deni Avdija", flexNote: "6-9 SF/PF — POR's most versatile player. Can create, facilitate (7 APG), and defend 2-4. Carried POR's offense in G1 (30/10).", positionsPlayed: "SF/PF" },
        { player: "Jrue Holiday", flexNote: "6-4 SG — championship-proven defender (MIL 2021). Switches 1-3 on defense. Veteran playoff flexibility.", positionsPlayed: "SG/PG" }
      ],
      smallBallLineup: "Limited — no credible small-ball 5 option. Clingan MUST play.",
      bigLineup: "Holiday / Henderson / Avdija / Sharpe / Clingan — POR's only real lineup",
      historicalNote: "Holiday won 2021 championship with MIL as a defensive flex piece. Avdija's breakout is real but he's in his first playoff series. Clingan is a rookie drop-big with zero playoff switching experience."
    },
    flexDifferential: 4.0,
    modelAdjustment: 1.6,
    seriesNote: "MASSIVE flexibility gap — 2nd largest in R1. Wemby's 7-5 frame + guard skills gives SAS unlimited defensive scheme options. POR is locked into Clingan drop coverage with no alternative. G1 confirmed: SAS's length (Kornet + Vassell blocking Clingan on same possession) is a STRUCTURAL problem POR cannot solve by switching lineups. Avdija is POR's lone versatile player but he can't fix their defensive rigidity."
  },

  "DET-ORL": {
    home: {
      team: "DET",
      switchDefense: 6.5,
      offRoleFlex: 5.5,
      lineupOptions: 5.5,
      positionalVersatility: 6.5,
      overallFlex: 6.0,
      keyFlexPlayers: [
        { player: "Cade Cunningham", flexNote: "6-6 PG — oversized PG who can play SG in big lineups. Scores AND facilitates (9 APG). G1: 39pts showed alpha scorer ceiling.", positionsPlayed: "PG/SG" },
        { player: "Tobias Harris", flexNote: "6-7 SF/PF — can play 3 or 4. Reliable scorer in multiple roles. Playoff experience.", positionsPlayed: "SF/PF" },
        { player: "Kevin Huerter", flexNote: "6-7 SG/SF — floor spacer who defends wings. Adds some positional flex.", positionsPlayed: "SG/SF" }
      ],
      smallBallLineup: "Cunningham / Ivey / Huerter / Harris / Duren — spacing around Duren",
      bigLineup: "Cunningham / Jenkins / Harris / Stewart / Duren — grinding defense",
      injuryContext: "SI article: DET's ORtg WITHOUT Cade went from Pelicans-level to Clippers-level during his collapsed-lung absence (113.3 → 116.7). They proved they can function without him, but barely.",
      historicalNote: "Cunningham's first playoff series. Bickerstaff (COTY) is a system coach who can adjust, but DET's G1 panic lineup (0 min together all season) showed inflexibility under pressure."
    },
    away: {
      team: "ORL",
      switchDefense: 7.0,
      offRoleFlex: 7.5,
      lineupOptions: 7.0,
      positionalVersatility: 7.0,
      overallFlex: 7.0,
      keyFlexPlayers: [
        { player: "Franz Wagner", flexNote: "6-10 SF/PG — POINT-FORWARD. Plays PG in a 6-10 frame. Creates, facilitates, defends multiple positions. One of the most position-fluid players in the NBA.", positionsPlayed: "SF/PG/SG" },
        { player: "Paolo Banchero", flexNote: "6-10 PF/SF — can face up like a wing or post up like a big. Creates his own shot. G1: 23pts as the secondary creator showed his flexibility.", positionsPlayed: "PF/SF" },
        { player: "Jalen Suggs", flexNote: "6-4 PG/SG — defends 1-2, can switch onto wings. Aggressive on-ball defender.", positionsPlayed: "PG/SG" },
        { player: "Desmond Bane", flexNote: "6-5 SG/SF — acquired via trade. 3-level scorer who can play 2 or 3. Adds another creation option.", positionsPlayed: "SG/SF" }
      ],
      smallBallLineup: "Suggs / Bane / Wagner / Banchero / WCJ — 5 players who can all create + defend",
      bigLineup: "Suggs / Bane / Wagner / Banchero / WCJ — ORL's standard is already versatile",
      historicalNote: "Wagner's point-forward role is the key to ORL's upset in G1. Mosley's scheme ('let Cade score, suffocate the rest') required defensive versatility to execute. ORL's 5-player balanced scoring (all 5 starters in double figures) reflects offensive role flexibility."
    },
    flexDifferential: -1.0,
    modelAdjustment: -0.4,
    seriesNote: "RARE CASE: Lower seed has BETTER flexibility. ORL's Wagner (point-forward in 6-10 frame) gives them unique lineup versatility that DET can't match. DET's offense is Cade-centric with limited secondary creation; ORL runs through Wagner OR Banchero OR Bane. G1 proved ORL's 5-player balanced attack beats DET's star-driven model. ORL's flexibility edge is why they're the biggest upset threat in R1."
  },

  "BOS-PHI": {
    home: {
      team: "BOS",
      switchDefense: 9.0,
      offRoleFlex: 8.0,
      lineupOptions: 8.5,
      positionalVersatility: 8.5,
      overallFlex: 8.5,
      keyFlexPlayers: [
        { player: "Jaylen Brown", flexNote: "6-6 SG/SF — elevated to #1 scorer (28.7 PPG) after Tatum's injury. Can play 2 or 3. Elite switch defender.", positionsPlayed: "SG/SF" },
        { player: "Jayson Tatum", flexNote: "6-9 SF/PF — scores from everywhere, facilitates (7.2 APG). Guards 2-4. Returning from Achilles — still showed zero rust in G1 (25/11/7).", positionsPlayed: "SF/PF" },
        { player: "Derrick White", flexNote: "6-4 PG/SG — ELITE switch defender. G1: locked down Maxey (8-20 FG) as full-time assignment. Can initiate offense or play off-ball.", positionsPlayed: "PG/SG" },
        { player: "Payton Pritchard", flexNote: "PG — limited defensive switching but elite 3PT creates offensive flexibility (pull-up 3s, transition, catch-and-shoot).", positionsPlayed: "PG" }
      ],
      smallBallLineup: "White / Brown / Tatum / Hauser / Al Horford — switch-everything, 5-out (proven 2024 championship scheme)",
      bigLineup: "White / Brown / Tatum / Kornet / (big) — added rim protection",
      historicalNote: "BOS WON 2024 CHAMPIONSHIP with switch-everything defense as identity. Mazzulla's system is the gold standard for positional versatility in modern NBA. Brown's elevation from #2 to #1 when Tatum was injured showed extreme offensive role flexibility."
    },
    away: {
      team: "PHI",
      switchDefense: 3.0,
      offRoleFlex: 4.0,
      lineupOptions: 3.0,
      positionalVersatility: 4.0,
      overallFlex: 3.5,
      keyFlexPlayers: [
        { player: "Paul George", flexNote: "6-9 SF/PF — can switch 2-4 on defense. But aging (35) and returning from suspension, limiting his switching upside this series.", positionsPlayed: "SF/PF" },
        { player: "Tyrese Maxey", flexNote: "6-2 PG — elite scorer but UNDERSIZED for switching. Gets hunted on mismatches when BOS forces switches.", positionsPlayed: "PG" }
      ],
      smallBallLineup: "Maxey / Edgecombe / George / (wing) / Drummond — zero switching capacity at C",
      bigLineup: "Maxey / (guard) / George / (PF) / Drummond — one viable lineup",
      injuryImpact: "WITHOUT Embiid (C, 7-0), PHI loses their ONLY versatile interior defender and primary post scorer. Flexibility drops from ~6.0 to 3.5. Drummond is a strict drop-coverage center with no switching ability.",
      historicalNote: "PHI is 0-7 vs BOS in playoffs since 1982. This is partly a flexibility problem — BOS's switching defense has historically disrupted PHI's star-dependent offense. George has deep playoff experience but has shrunk in big moments (4.8 clutch rating)."
    },
    flexDifferential: 5.0,
    modelAdjustment: 2.0,
    seriesNote: "LARGEST flexibility gap in ALL of R1. BOS's championship switch-everything defense vs PHI's rigid, Embiid-less roster. G1's 32-pt blowout was a FLEXIBILITY blowout — BOS switched every screen, PHI had NO counter. White-on-Maxey is a schematic lock that PHI can't break without a versatile big to create mismatches. Nurse is an elite adjustment coach (proven in TOR) but his roster simply lacks the positional versatility to compete with BOS's scheme. PHI would need Embiid back to change the flexibility calculus."
  },

  "NYK-ATL": {
    home: {
      team: "NYK",
      switchDefense: 8.0,
      offRoleFlex: 7.0,
      lineupOptions: 7.5,
      positionalVersatility: 7.5,
      overallFlex: 7.5,
      keyFlexPlayers: [
        { player: "OG Anunoby", flexNote: "6-7 SF/PF — ELITE lockdown defender who guards 1-4. One of the NBA's best switch defenders. Can guard CJ McCollum OR Jalen Johnson.", positionsPlayed: "SF/PF" },
        { player: "Mikal Bridges", flexNote: "6-7 SF — long wing defender who switches 2-4. 3&D role but can create in spurts.", positionsPlayed: "SF/SG" },
        { player: "Josh Hart", flexNote: "6-5 SG/SF — bulldog defender, rebounds like a big (8+ RPG). Switches 1-3 and plays with maximum effort.", positionsPlayed: "SG/SF" },
        { player: "Karl-Anthony Towns", flexNote: "7-0 C/PF — stretches the floor from C (.418 3PT career). Can play 5 or 4 in big lineups. Creates matchup problems.", positionsPlayed: "C/PF" }
      ],
      smallBallLineup: "Brunson / Hart / Bridges / Anunoby / Towns — elite switching + floor spacing",
      bigLineup: "Brunson / Hart / Bridges / Towns / Robinson — twin towers + rebounding dominance",
      historicalNote: "NYK's wing defense (OG, Bridges, Hart) is proven in playoff switching. Anunoby was elite in 2024 playoffs. Towns' 3PT shooting from the 5 forces opposing bigs to the perimeter, creating driving lanes."
    },
    away: {
      team: "ATL",
      switchDefense: 5.5,
      offRoleFlex: 6.5,
      lineupOptions: 6.0,
      positionalVersatility: 6.0,
      overallFlex: 6.0,
      keyFlexPlayers: [
        { player: "Jalen Johnson", flexNote: "6-9 PF/SF — ATL's most versatile player. Can play 3 or 4, create off the dribble, and defend multiple positions.", positionsPlayed: "PF/SF" },
        { player: "Jonathan Kuminga", flexNote: "6-7 SF/PF — athletic forward who can switch 2-4 on defense. G2 bounce-back (19pts) showed offensive ceiling. Snyder's G2 adjustment putting Kuminga on Towns was a role-flex chess move.", positionsPlayed: "SF/PF" },
        { player: "Dyson Daniels", flexNote: "6-7 SG/SF — elite length at guard. Defensive specialist who switches 1-3.", positionsPlayed: "SG/SF" }
      ],
      smallBallLineup: "McCollum / Daniels / Hunter / Kuminga / Johnson — switchable wings, no rim protection",
      bigLineup: "McCollum / Daniels / Johnson / Kuminga / Okongwu — standard with Okongwu rim-protecting",
      historicalNote: "Snyder's coaching AMPLIFIES flexibility beyond the roster's raw talent. His G2 adjustment (Kuminga on Towns, Okongwu on Hart) created a defensive scheme that held NYK to 66 ORtg in Q4. Scheme-driven versatility can close the talent gap."
    },
    flexDifferential: 1.5,
    modelAdjustment: 0.6,
    seriesNote: "NYK has the better raw flexibility (OG/Bridges/Hart switching trident), but ATL's COACHING flexibility under Snyder partially closes the gap. Snyder's G2 Q4 adjustment was a masterclass in role-flex — putting a wing (Kuminga) on a center (Towns) is only possible because Kuminga has the positional versatility to do it. NYK's edge is in PERSONNEL versatility; ATL's edge is in SCHEMATIC adaptability."
  },

  "CLE-TOR": {
    home: {
      team: "CLE",
      switchDefense: 8.0,
      offRoleFlex: 8.5,
      lineupOptions: 8.0,
      positionalVersatility: 7.5,
      overallFlex: 8.0,
      keyFlexPlayers: [
        { player: "Evan Mobley", flexNote: "6-11 PF/C — ELITE switch defender who guards 1-5. Can handle, shoot 3s, and create. The most positionally versatile big in the East. G2: 25pts on 11/13 FG showed offensive ceiling.", positionsPlayed: "PF/C (defends 1-5)" },
        { player: "Donovan Mitchell", flexNote: "SG who toggles between scorer mode and playmaker mode series-to-series. 31 PPG this series = scorer. Can facilitate when needed (7+ APG in 2024 playoffs).", positionsPlayed: "SG" },
        { player: "James Harden", flexNote: "ALL-TIME offensive flexibility: PG/SG who toggled from facilitator (G1: 10ast) to co-scorer (G2: 28pts/4ast). Playoff career: adapts role to matchup.", positionsPlayed: "PG/SG" },
        { player: "Jarrett Allen", flexNote: "C — primarily a rim-runner/defender, but CLE can go small with Mobley-at-5 and remove Allen for more switching.", positionsPlayed: "C" }
      ],
      smallBallLineup: "Mitchell / Harden / Strus / Mobley / (no Allen) — extreme switching, 5-out",
      bigLineup: "Mitchell / Harden / Strus / Mobley / Allen — twin towers, paint dominance",
      historicalNote: "CLE's Mobley-at-5 small lineups have been devastating this series. G2: when CLE went small, Mobley dominated the paint (11/13 FG) because TOR's small-ball experiment removed their rim protection. Harden's G1→G2 role shift (facilitator→scorer) shows CLE can adapt in real-time."
    },
    away: {
      team: "TOR",
      switchDefense: 5.5,
      offRoleFlex: 6.0,
      lineupOptions: 5.0,
      positionalVersatility: 5.5,
      overallFlex: 5.5,
      keyFlexPlayers: [
        { player: "Scottie Barnes", flexNote: "6-9 SF/PF — TOR's most versatile player. Can create, facilitate, defend multiple positions. Trending up (21→26pts through 2 games).", positionsPlayed: "SF/PF" },
        { player: "Sandro Mamukelashvili", flexNote: "Stretch-5 experiment that's working — G2: 12pts/10reb double-double. His 3PT spacing (2/3) counters CLE's drop coverage.", positionsPlayed: "PF/C" },
        { player: "Immanuel Quickley", flexNote: "PG/SG — EXPECTED BACK for G3. His return adds a second creator and improves TOR's offensive flexibility significantly.", positionsPlayed: "PG/SG" }
      ],
      smallBallLineup: "Murray / Quickley / Barnes / Ingram / Mamukelashvili — spacing + creation",
      bigLineup: "Murray / Barnes / Ingram / Mamukelashvili / Poeltl — but Poeltl minutes collapsed (21→9)",
      historicalNote: "TOR's small-ball experiment (Murray-Boyles at C in G2 Q3) BACKFIRED — removed rim protection and CLE's Mobley exploited iso. Rajakovic is still searching for the right flexibility answer. Quickley's return could be transformative."
    },
    flexDifferential: 2.5,
    modelAdjustment: 1.0,
    seriesNote: "CLE's ability to toggle between Harden-as-facilitator and Harden-as-scorer gives them unique offensive flexibility. Mobley's 1-5 defensive switching is a structural advantage TOR has no answer for. TOR's lineup experimentation (benching Poeltl, trying small-ball, starting Mamukelashvili) shows they're SEARCHING for flexibility but haven't found it. Quickley's return for G3 could narrow this gap by adding a second ball-handler."
  }
};
