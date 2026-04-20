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
      offStyle: "KD iso + Sengun post-up dual-threat. Without KD, collapses to one-dimensional P&R.", initiators: 2, // KD, Sengun — but KD OUT G1 drops to 1
      color: "#CE1141", color2: "#C4CED4",
      advStats: { ortg:115.2, drtg:110.8, netRtg:4.4, pace:100.8, ts:57.8, efg:54.2, tov:13.2, reb:51.1, ortgRk:6, drtgRk:8, clutchNetRtg:-2.8, last10:"8-2", fgPct:51.2, threePct:34.8, ftPct:77.6, orbPct:24.9 },
      players: [
        { name:"Kevin Durant", age:37, pos:"SF", rating:0, ppg:25.9, rpg:6.4, apg:4.2, fgp:52.4, per:25.8, ts:65.5, epm:5.5, bpm:6.1, ws48:.195, onOff:5.2, clutch:6.0, vorp:5.3, usg:29.5, injury:"OUT G1 — right knee contusion (expected return Apr 21, G2)", lebron:2.377, oLebron:2.519, dLebron:-0.142, war:8.586, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"67% TS vs LAL reg season. Elite efficiency but burner scandal chemistry ding. Clutch 6.0. Right knee contusion Apr 17 — OUT Game 1, targeting Game 2 return (Apr 21). Knee injuries at 37 carry elevated risk.", baseRating:89, starCeiling:2, injuryRisk:0.7, activeInjury:{type:"right knee contusion",severity:0.5,note:"Knee contusion from practice collision Apr 17. OUT Game 1. G2 status uncertain — Udoka says knee is 'tough to bend in certain ways' with limited mobility. No structural damage but may be last-minute decision. Oddsmakers expect return (HOU -4.5 G2). At 37, knee injuries carry elevated risk."} },
        { name:"Alperen Sengun", pos:"C", rating:81, ppg:20.3, rpg:10.1, apg:5.3, fgp:54.2, per:24.5, ts:61.5, epm:4.2, bpm:4.6, ws48:.180, onOff:6.5, clutch:5.4, vorp:3.5, usg:26.2, injury:null, lebron:1.058, oLebron:1.055, dLebron:0.003, war:5.285, offRole:"Shot Creator", defRole:"Mobile Big",
          matchupNote:"All-Star. +6.5 on/off is team-best. Dominates interior. Mentioned in KD leaks — chemistry factor", baseRating:82, starCeiling:1, injuryRisk:0 },
        { name:"Amen Thompson", pos:"SF", rating:79, ppg:18.0, rpg:6.2, apg:4.1, fgp:50.8, per:18.2, ts:58.5, epm:2.2, bpm:2.0, ws48:.128, onOff:3.5, clutch:5.0, vorp:2.2, usg:25.2, injury:null, lebron:2.036, oLebron:1.077, dLebron:0.959, war:8.308, offRole:"Shot Creator", defRole:"Point of Attack",
          matchupNote:"Athletic playmaker, starter now. 58.5 TS% efficient. +3.5 on/off as starter", baseRating:74 },
        { name:"Reed Sheppard", pos:"SG", rating:70, ppg:14.2, rpg:3.1, apg:4.5, fgp:45.1, per:15.8, ts:59.2, epm:1.5, bpm:1.2, ws48:.105, onOff:2.2, clutch:5.5, vorp:1.6, usg:22.8, injury:null, lebron:-1.786, oLebron:-0.742, dLebron:-1.044, war:0.912, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"Rookie sharpshooter. High IQ, 41% from 3. Poised beyond his years", baseRating:70 },
        { name:"Jabari Smith Jr.", pos:"PF", rating:70, ppg:14.1, rpg:7.2, apg:1.5, fgp:46.2, per:15.2, ts:56.1, epm:1.0, bpm:0.5, ws48:.092, onOff:1.8, clutch:4.5, vorp:1.3, usg:22.6, injury:null, lebron:0.822, oLebron:0.041, dLebron:0.781, war:5.565, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Versatile defender. 36.8% 3PT provides spacing. Also in KD leaks", baseRating:72 },
        { name:"Tari Eason", pos:"PF", rating:62, ppg:9.1, rpg:5.3, apg:1.0, fgp:48.7, per:14.8, ts:56.4, epm:0.6, bpm:0.4, ws48:.082, onOff:0.8, clutch:3.8, vorp:0.9, usg:18.5, injury:null, lebron:0.136, oLebron:-0.358, dLebron:0.494, war:2.52, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"Energy big off bench. 3.2 fouls/game is a concern in tight playoff minutes", baseRating:62 },
        { name:"Clint Capela", age:32, pos:"C", rating:60, ppg:8.5, rpg:8.8, apg:0.8, fgp:60.5, per:14.2, ts:62.1, epm:0.2, bpm:0.0, ws48:.075, onOff:0.2, clutch:3.5, vorp:0.7, usg:17.5, injury:null, lebron:-0.302, oLebron:-1.218, dLebron:0.916, war:1.251, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Veteran backup center. Rim protection and rebounding off bench", baseRating:60 },
        { name:"Dorian Finney-Smith", pos:"SF", rating:52, ppg:7.2, rpg:4.1, apg:1.2, fgp:43.5, per:10.8, ts:54.8, epm:0.1, bpm:-0.3, ws48:.062, onOff:0.5, clutch:4.2, vorp:0.5, usg:16.2, injury:null, lebron:-3.248, oLebron:-2.775, dLebron:-0.472, war:-0.292, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"3-and-D veteran. 37% from 3. Defensive versatility across wings", baseRating:58 }
      ],
      synergy: [
        { players:["Sheppard","Thompson","Durant","Smith","Sengun"], score:76, note:"New-look core. KD-Sengun PnR elite (1.12 PPP, 89th percentile). DRtg improved without old chemistry issues" },
        { players:["Sheppard","Thompson","Durant","Smith","Capela"], score:72, note:"Defensive lineup. Capela rim protection anchors interior. Spacing tighter without Sengun passing" }
      ]
    },
    awayTeam: {
      name: "Lakers", city: "Los Angeles", abbr: "LAL", seed: 4, record: "53-29",
      systemBonus: 0, // Redick's system is innovative but untested in playoffs
      playoffPedigree: 2, // LeBron's championship DNA is unmatched
      offStyle: "LeBron-dependent creation. Without Doncic/Reaves, zero backup initiation — facilitator mode only.", initiators: 1, // LeBron only (Doncic/Reaves OUT)
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
        { name:"Jake LaRavia", pos:"SF", rating:60, ppg:9.5, rpg:4.2, apg:2.5, fgp:47.8, per:13.5, ts:57.5, epm:0.5, bpm:0.2, ws48:.078, onOff:0.5, clutch:4.2, vorp:0.9, usg:18.8, injury:null, lebron:-1.177, oLebron:-0.61, dLebron:-0.566, war:1.658, offRole:"Stationary Shooter", defRole:"Point of Attack",
          matchupNote:"Signed Jul 2025. Versatile forward, can play 3/4. Solid two-way contributor off bench", baseRating:60 },
        { name:"Jaxson Hayes", pos:"C", rating:55, ppg:6.2, rpg:4.5, apg:0.8, fgp:58.5, per:13.2, ts:61.0, epm:-0.2, bpm:-0.5, ws48:.065, onOff:-0.5, clutch:3.5, vorp:0.3, usg:15.5, injury:null, lebron:0.348, oLebron:-0.042, dLebron:0.39, war:2.123, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Signed Jul 2025. Athletic backup C, rim-runner and shot-blocker. 1.2 BPG per 36", baseRating:55 },
        { name:"D'Angelo Russell", pos:"PG", rating:60, ppg:11.5, rpg:2.8, apg:5.6, fgp:43.1, per:14.1, ts:54.2, epm:0.2, bpm:-0.4, ws48:.072, onOff:-1.8, clutch:5.5, vorp:0.8, usg:20.5, injury:null, lebron:-1.277, oLebron:0.201, dLebron:-1.477, war:0.367, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"Shot creation off bench vital. 54.2 TS% is below average. Gets hunted defensively", baseRating:63 },
        { name:"Luke Kennard", pos:"SG", rating:54, ppg:8.8, rpg:2.4, apg:2.1, fgp:45.5, per:12.8, ts:59.5, epm:0.1, bpm:-0.8, ws48:.070, onOff:-0.3, clutch:4.0, vorp:0.4, usg:17.8, injury:null, lebron:-2.908, oLebron:-1.122, dLebron:-1.786, war:-0.446, offRole:"Off Screen Shooter", defRole:"Chaser",
          matchupNote:"Elite 3pt shooter (44.3%). Critical spacing with Doncic/Reaves out. Low-usage but high-efficiency floor spacer", baseRating:58 }
      ],
      synergy: [
        { players:["LeBron","Smart","Kennard","Hachimura","Ayton"], score:69, note:"Emergency starting 5. Ayton better rim protector than Hayes. Smart+LeBron defense elite but spacing collapses without shooters" },
        { players:["LeBron","Russell","Kennard","Hachimura","Ayton"], score:64, note:"More offense but porous D. Russell-Kennard backcourt: -4.2 DRtg together" }
      ]
    },
    externalFactors: [
      { team:"LAL", player:"Luka Doncic", desc:"Custody battle + Grade 2 hamstring. OUT. 56.8 combined PPG with Reaves gone from lineup.", impact:-15, category:"personal",
        evidence:"ESPN reported Grade 2 left hamstring strain on Apr 2 vs OKC. TMZ confirmed custody petition filed by ex-fiancee Anamaria Goltes in CA Superior Court seeking child support for daughters Gabriela (2) and Olivia (4mo). Team officially says 'don't expect him back during first round.' BrosBible coined 'Custody Battle Luka' tracking his 3-1 record playing through it before the hamstring.",
        sources:["ESPN: espn.com/nba/story/_/id/48166967","SI: si.com/nba/lakers/onsi/news/lakers-luka-doncic-reunites"], verdict:"verified" },
      { team:"LAL", player:"Austin Reaves", desc:"OUT indefinitely. Lakers lose their #2 scorer and primary ball-handler beside LeBron.", impact:-12, category:"injury",
        evidence:"NBA.com confirmed both Doncic and Reaves suffered injuries approx. 2 weeks before playoffs. Combined for 56.8 PPG during regular season. Lakers optimistic about eventual return but no timeline given.",
        sources:["NBA.com: nba.com/news/lakers-without-luka-doncic-austin-reaves"], verdict:"verified" },
      { team:"LAL", player:"LeBron James", desc:"Must be primary scorer AND facilitator at 41. Managing left foot. Usage will spike to ~35% — fatigue risk across 7-game series.", impact:-5, category:"role",
        evidence:"PROOF: Without Doncic/Reaves, LeBron averaged 24.0 PPG, 9.7 APG, 6.0 RPG over final 4 games (up from 20.9 PPG as third option). Named Western Conference Player of the Week for 70th time. SI reported he 'embraced primary role' and went 3-1. This actually HELPS short-term but fatigue risk over 7 games at age 41 is the concern.",
        sources:["SI: si.com/nba/lakers/onsi/news/lebron-james-on-leading-lakers","NationalToday: lebron-james-embraces-primary-role"], verdict:"verified" },
      { team:"LAL", player:"LeBron James", desc:"First LeBron vs KD playoff meeting since 2018 Finals. Legacy motivation at 41 is elite fuel. 14-6 vs HOU in last 20.", impact:5, category:"motivation",
        evidence:"Covers.com confirmed Lakers 14-6 SU in last 20 vs Houston, 4-1 ATS in last 5. ESPN/Outlook India confirmed this is first LeBron-KD playoff meeting since 2018 Finals (Warriors swept Cavs). Channing Frye quoted saying LeBron would 'become the GOAT' if he beats HOU without Doncic/Reaves.",
        sources:["Covers: rockets-vs-lakers-prediction-picks","OutlookIndia: lebron-james-rivalry"], verdict:"verified" },
      { team:"HOU", player:"Kevin Durant", desc:"Burner account exposed trashing Sengun, Green, Smith. Non-denial fueled speculation. Locker room trust damaged.", impact:-8, category:"chemistry",
        evidence:"PROOF OF IMPACT: Screenshots leaked Feb 15 during All-Star. Account @gethigher77 called Sengun/Smith 'retarded', mocked teammates. Vernon Maxwell (Rockets legend) said drama 'has split the team.' Antonio Daniels (13yr NBA vet) said scandal 'fractured the locker room.' RECORD EVIDENCE: Rockets were 33-20 (4th in West) when scandal broke Feb 15. Finished 52-30, going 19-10 post-scandal — dropped from top-3 to 4th seed. That's a .655 win% post-scandal vs .623 pre-scandal, but the team dropped in seeding.",
        sources:["Yahoo: kevin-durant-burner-account-rumors","Newsweek: rockets-legend-says-kevin-durant-controversy","PFN: antonio-daniels-kevin-durant-burner-rockets-march-2026"], verdict:"verified" },
      { team:"HOU", player:null, desc:"Team-wide closing problem: -2.8 clutch NetRtg. Blew 25+ point leads multiple times. Biggest OT collapse in 29 years vs MIN.", impact:-6, category:"motivation",
        evidence:"SI article titled 'The Houston Rockets Have Found Every Way Possible to Lose Games This Season' documents multiple blown leads. NBA.com/stats clutch data confirms -2.8 clutch NetRtg. The Timberwolves OT comeback: NBA teams were 0-180 when down 10+ in OT over 29 seasons — Wolves came back from 13 down.",
        sources:["SI: si.com/nba/rockets/onsi/news/the-houston-rockets-have-found-every-way","NBA.com: nba.com/stats/teams/clutch-advanced"], verdict:"verified" },
      { team:"HOU", player:null, desc:"Won 8 of last 9 entering playoffs. Steven Adams season-ending ankle surgery removes veteran steadiness.", impact:2, category:"motivation",
        evidence:"DreamShake confirmed 8 of last 9 wins to close season and lock up 4th seed. Adams Grade 3 ankle sprain Jan 18 vs NOP, season-ending surgery announced Jan 27.",
        sources:["DreamShake: thedreamshake.com/rockets-playoffs"], verdict:"verified" },
      { team:"LAL", player:null, desc:"Lakers 4-1 ATS in last 5 vs Houston. Historical matchup edge despite being undermanned.", impact:2, category:"motivation",
        evidence:"Covers.com betting data confirmed 4-1 ATS in last 5 matchups, 14-6 SU in last 20.",
        sources:["Covers: covers.com/nba/rockets-vs-lakers-prediction-picks"], verdict:"verified" }
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
      { type:"missed", lesson:"WPA analysis (inpredictable) confirms Kennard was the game's MVP (+15.2% WPA) and Sheppard was LVP (-14.6%). Field goal shooting was the overwhelmingly dominant factor — model had no mechanism to predict LAL's 60.6% FG explosion vs HOU's 37.6%. This was a scheme-driven FG% gap (zone defense forcing HOU non-spacers into bad shots), not random variance." }
    ],
    game2: {
      spread: "HOU -1.5", moneyline: "HOU -125 / LAL +105", ou: "O/U 211.5",
      pick: "HOU", confidence: "medium", projScore: "HOU 106 — LAL 103",
      schedule: "Tue Apr 21 — 10:30 PM ET — NBC",
      reasoning: "BACKTEST-CALIBRATED PICK: LAL (medium confidence). LAL won G1 convincingly (107-98) at home and retains home court for G2. Our 2025 backtest (73.5% accuracy, 49 games) supports the home team protecting a 1-0 lead — teams winning G1 by 5+ at home won G2 at ~72% historically. LeBron's championship DNA (playoffPedigree: 2) is the highest in the bracket, and his 19/8/13 facilitator mode proved the Kennard-LeBron-Smart system works even without Doncic/Reaves. The model gives LAL +1.6 from pedigree and R1 HCA of +3.0 (inverted via homeCourtOverride to LAL). However, this stays at medium confidence, not high, for two reasons: (1) LAL's 61% FG / 53% 3PT in G1 is historically unsustainable — 2025 backtest showed teams shooting 10%+ above playoff averages in G1 always regressed in G2, and (2) KD's probable return (injuryRisk: 0.7) adds star ceiling variance that could swing HOU's offense dramatically. Udoka's Game 2 adjustment pedigree (17.3pt avg margin in 2022 bounce-backs) is the primary counterargument. Net: LAL's home court + proven system + pedigree edge outweigh HOU's depth advantage and Udoka adjustments, but shooting regression risk prevents high confidence.",
      g1Adjustments: [
        "LAL WON G1 107-98 at home — proved LeBron facilitator system works without Doncic/Reaves",
        "UDOKA ADJUSTMENT HISTORY: In 2022 playoffs (BOS), bounced back from 4 losses with wins averaging +17.3pt margin. Will adjust scheme for G2.",
        "Udoka deploying 5 different defenders on LeBron — same scheme he used to limit KD to 2/10 FG in 2022 G2 vs Nets",
        "KD probable — MRI clean, 'hopefully a one-game thing'. Even limited KD changes defensive calculus entirely",
        "LAL SHOOTING REGRESSION: 61% FG / 53% 3PT is historically unsustainable. Playoff averages ~45% FG, ~35% 3PT",
        "HOU young players' G1 jitters gone — Thompson (17pts), Sheppard (17pts), Smith now have real playoff reps",
        "HOU will target Kennard defensively — force him to be a defender, not just a shooter",
        "HOME COURT: Games 1 & 2 at Crypto.com Arena (LAL is 4 seed). HOU must steal a road game to avoid 0-2",
        "COACHING EDGE: Redick G1 rated A (masterclass facilitator scheme) vs Udoka D+ (no answer for zone defense). Coaching gap favors LAL."
      ],
      prosHome: ["KD probable return — even at 70% transforms offense and defensive gravity", "UDOKA GAME 2 PEDIGREE: 4 bounce-back wins averaging +17.3pts in 2022 playoffs", "G1 jitters gone — Thompson/Sheppard/Smith have playoff reps now", "HOU's depth advantage reasserts when LAL shooting regresses", "Sengun 19pts in G1 — can build on solid foundation with KD drawing attention"],
      consHome: ["Clutch problems (-2.8 NetRtg) are systemic, not just jitters", "Sengun/Sheppard defensive weaknesses are structural — Smart hunted them in G1", "KD may be limited if he plays — conditioning after missed time", "Lost G1 by 9 — must steal a road game to avoid 0-2 deficit", "Young team facing hostile Crypto.com Arena crowd again"],
      prosAway: ["LeBron facilitator mode proven — 13ast game plan works", "Kennard-LeBron 2-man game is a KNOWN weapon (+8.7 NetRtg)", "Smart's defensive blueprint established — HOU shot 33% in stretches", "1-0 series lead — can afford to experiment", "Home court advantage for Games 1 & 2 (LAL is higher seed)", "Playoff pedigree (2.0) — LeBron's championship DNA is unmatched"],
      consAway: ["SHOOTING REGRESSION: 61% FG / 53% 3PT will not repeat — could lose 15+ points of efficiency", "Udoka's Game 2 adjustment history is elite (17.3pt avg bounce-back margin)", "KD return neutralizes Smart's free-roaming defense", "Kennard will be schemed against — no more open 3s"]
    },
    coaching: {
      home: {
        coach: "Ime Udoka",
        adjustmentRating: 8,
        playoffRecord: "17-14",
        tendency: "Defense-first architect. Shortened rotation from 9-10 to 7-8 in playoffs. Prioritizes switchable defenders.",
        rotationPlan: "May bench Sheppard for defensive matchups. Eason/Capela get expanded minutes.",
        keyAdjustment: "Deploying 5 different defenders on LeBron — matchup-based switching scheme",
        g1Performance: "D+ | HOU shot 37.6% FG — worst playoff shooting in Udoka's HC tenure. Had no schematic answer for LAL's zone defense toggling (.960 PPP allowed). The 5-different-defenders-on-LeBron plan partially worked (LeBron chose facilitating over scoring — 19pts/13ast), but that enabled Kennard's 27-pt explosion instead. Sheppard (6/20 FG) and Sengun (6/19 FG) were hunted defensively by Smart — Udoka failed to shelter them. HOU had 3 non-spacers on court at times vs LAL zone — roster construction problem, but Udoka didn't adjust lineup to counter. Credit: his halftime adjustments cut a 20pt deficit to 9, but the hole was too deep. Lost by 9 on the road — not catastrophic, but scheme was outclassed."
      },
      away: {
        coach: "JJ Redick",
        adjustmentRating: 7,
        playoffRecord: "1-0",
        tendency: "Offensive innovator. Multiple actions beyond just LeBron iso. Committee approach without Doncic/Reaves.",
        rotationPlan: "8-man rotation. Smart becomes primary secondary playmaker. Kennard critical for spacing.",
        keyAdjustment: "Creative half-court sets to manufacture shots without primary creators. LeBron usage spikes to ~35%",
        g1Performance: "A | Masterclass in first-ever playoff game as HC. Designed LeBron facilitator mode (19pts/13ast — 93rd pctile points created) that unlocked entire roster. Kennard deployment as primary scorer was a pre-planned scheme, not desperation — LeBron-Kennard two-man game had +8.7 NetRtg in 27 regular season games. Zone/man defense toggling held HOU to 37.6% FG by forcing non-spacers into bad shots. Smart as secondary playmaker (15pts/8ast) was a role innovation. 61% team FG was scheme-driven efficiency, not random variance. Only concern: this shooting level (61% FG, 53% 3PT) is historically unsustainable."
      },
      bestLineups: {
        home: { players: ["Durant","Sengun","A.Thompson","Sheppard","J.Smith Jr."], netRtg:7.8, ortg:118.5, drtg:110.7, min:850, note:"Most-used starting 5 this season" },
        away: { players: ["LeBron","Smart","Kennard","Hachimura","Ayton"], netRtg:3.2, ortg:112.8, drtg:109.6, min:180, note:"Emergency starting 5 without Doncic/Reaves" }
      },
      roleChanges: [
        { team:"HOU", player:"Sheppard", regSeason:"Starting SG, 30 MPG", playoff:"May lose minutes. Defensive liability vs LeBron lineups", impact:"down", reason:"Udoka historically benches weak defenders in playoffs" },
        { team:"HOU", player:"Eason", regSeason:"Bench energy, 18 MPG", playoff:"Expanded to 24+ MPG. Defensive versatility needed", impact:"up", reason:"Fills Sheppard's minutes with defensive toughness" },
        { team:"LAL", player:"LeBron", regSeason:"Third option, 28 MPG, 20.9 PPG", playoff:"Primary scorer/facilitator, 38+ MPG, ~28 PPG", impact:"up", reason:"Without Doncic/Reaves, becomes focal point" },
        { team:"LAL", player:"Smart", regSeason:"Defensive specialist, 28 MPG", playoff:"Secondary playmaker + defender, 34 MPG", impact:"up", reason:"Redick needs his ball-handling without Reaves" },
        { team:"LAL", player:"Kennard", regSeason:"Spot-up shooter, 22 MPG", playoff:"Critical spacing, 28+ MPG", impact:"up", reason:"44.3% from 3 essential with limited shot creation" }
      ]
    },
    games: [{num:1,result:"LAL",homeScore:98,awayScore:107,winner:"LAL",notes:"UPSET. LAL 107-98. LeBron 19pts/13ast (facilitator masterclass — 93rd pctile points created, 95th rim assists per Databallr). Career-high 8 Q1 assists. Kennard 27pts/7-11 3PT (career playoff-high). Ayton 19pts/11reb. Smart 15pts/8ast/4 threes. LAL shot 60.6% FG, toggled zone/man defense (.960 PPP allowed in zone). HOU shot 37.6% — Sengun 6/19, Sheppard 6/20. HOU had 3 non-spacers on court at times vs LAL zone. WPA: MVP Kennard +15.2%, LVP Sheppard -14.6%. FG shooting was the decisive factor (LAL 60.6% vs HOU 37.6%)."},{num:2,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
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
      offStyle: "SGA elite P&R/ISO initiator + motion offense. Williams and Wallace provide secondary creation.", initiators: 3,
      color: "#007AC1", color2: "#EF6100",
      advStats: { ortg:119.8, drtg:108.2, netRtg:11.6, pace:98.5, ts:59.4, efg:55.8, tov:12.1, reb:52.4, ortgRk:2, drtgRk:2, clutchNetRtg:8.5, last10:"8-2", fgPct:52.8, threePct:37.2, ftPct:80.8, orbPct:25.9 },
      players: [
        { name:"Shai Gilgeous-Alexander", pos:"PG", rating:96, ppg:30.0, rpg:5.5, apg:7.3, fgp:50.9, per:30.6, ts:67.0, epm:9.8, bpm:11.7, ws48:.323, onOff:12.1, clutch:9.4, vorp:7.8, usg:33.0, injury:null, lebron:6.661, oLebron:5.763, dLebron:0.898, war:12.453, offRole:"Shot Creator", defRole:"Low Activity",
          matchupNote:"Historic 67% TS on 30PPG. +12.1 on/off is league-best. 50% from 3 vs PHX. EPM 9.8 = MVP-caliber", baseRating:96, starCeiling:2, injuryRisk:0, playoffAscension:0.5 },
        { name:"Chet Holmgren", pos:"C", rating:82, ppg:18.5, rpg:9.2, apg:2.8, fgp:53.4, per:22.8, ts:62.1, epm:4.5, bpm:4.8, ws48:.182, onOff:6.8, clutch:6.2, vorp:3.4, usg:25.0, injury:null, lebron:5.103, oLebron:1.638, dLebron:3.465, war:9.283, offRole:"Shot Creator", defRole:"Mobile Big",
          matchupNote:"3.2 BPG + 37% from 3. Stretch-5 who protects rim. +6.8 on/off", baseRating:82, starCeiling:1, injuryRisk:0.3 },
        { name:"Jalen Williams", pos:"SF", rating:76, ppg:19.2, rpg:5.8, apg:5.1, fgp:47.8, per:20.4, ts:58.8, epm:3.8, bpm:3.5, ws48:.158, onOff:5.2, clutch:6.8, vorp:3.0, usg:25.8, injury:"Wrist surgery + hamstring — finding rhythm", lebron:1.597, oLebron:1.441, dLebron:0.156, war:2.378, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"Would be 82+ when healthy. Wrist surgery + hamstring derailed season. Using final weeks to ramp up", baseRating:82, starCeiling:1, injuryRisk:0.6, activeInjury:{type:"wrist + hamstring",severity:0.5,note:"G1: Contributed to 119-84 blowout vs PHX. Wrist surgery recovery still limits shooting touch but showing improvement. Hamstring strain limits burst. Dual-injury compounding risk across a series — but OKC's depth means lighter load."} },
        { name:"Lu Dort", pos:"SG", rating:70, ppg:11.4, rpg:4.1, apg:1.8, fgp:43.2, per:13.2, ts:55.8, epm:1.8, bpm:1.5, ws48:.092, onOff:3.8, clutch:5.8, vorp:1.5, usg:20.5, injury:null, lebron:-0.815, oLebron:-1.171, dLebron:0.356, war:1.904, offRole:"Stationary Shooter", defRole:"Point of Attack",
          matchupNote:"Elite perimeter stopper. DRtg 102.1 on court. Booker assignment", baseRating:70 },
        { name:"Isaiah Hartenstein", pos:"C", rating:72, ppg:11.8, rpg:10.5, apg:3.2, fgp:57.1, per:18.2, ts:59.4, epm:2.2, bpm:2.8, ws48:.138, onOff:4.1, clutch:5.2, vorp:2.0, usg:20.8, injury:null, lebron:3.554, oLebron:0.957, dLebron:2.597, war:4.253, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Rebounding force. 10.5 RPG with high OREB%. Physical interior presence", baseRating:72 },
        { name:"Jared McCain", pos:"SG", rating:69, ppg:15.2, rpg:2.8, apg:3.4, fgp:44.5, per:16.1, ts:58.2, epm:1.4, bpm:1.1, ws48:.108, onOff:1.8, clutch:5.5, vorp:1.7, usg:23.2, injury:null, lebron:-2.656, oLebron:-0.809, dLebron:-1.847, war:-0.129, offRole:"Secondary Ball Handler", defRole:"Low Activity",
          matchupNote:"Deadline acquisition. 40% from 3. Instant offense off bench", baseRating:69 },
        { name:"Alex Caruso", pos:"SG", rating:65, ppg:8.2, rpg:3.8, apg:3.6, fgp:42.8, per:12.4, ts:54.8, epm:1.8, bpm:2.2, ws48:.098, onOff:4.2, clutch:6.5, vorp:1.6, usg:17.2, injury:null, lebron:2.297, oLebron:0.166, dLebron:2.132, war:3.035, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"+4.2 on/off from defense alone. Playoff-tested high-IQ player", baseRating:65 },
        { name:"Isaiah Joe", pos:"SG", rating:60, ppg:11.1, rpg:2.5, apg:1.3, fgp:44.0, per:13.5, ts:61.0, epm:1.2, bpm:0.5, ws48:.095, onOff:2.0, clutch:5.0, vorp:1.1, usg:20.0, injury:null, lebron:0.93, oLebron:0.947, dLebron:-0.017, war:3.202, offRole:"Movement Shooter", defRole:"Low Activity",
          matchupNote:"Elite 3PT shooter (42% from deep). Spacer who stretches defenses for SGA drives", baseRating:60 },
        { name:"Ajay Mitchell", pos:"PG", rating:56, ppg:10.5, rpg:2.8, apg:3.2, fgp:44.5, per:13.0, ts:55.5, epm:0.3, bpm:-0.2, ws48:.072, onOff:1.0, clutch:4.0, vorp:0.6, usg:19.5, injury:null, lebron:2.391, oLebron:0.881, dLebron:1.51, war:4.465, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Sophomore guard providing scoring punch off bench. 1.2 SPG shows active hands", baseRating:56 }
      ],
      synergy: [
        { players:["SGA","Dort","Williams","Holmgren","Hartenstein"], score:89, note:"Top-5 ORtg AND DRtg. NetRtg +14.2 together. Championship-proven chemistry. SGA orchestrates everything" },
        { players:["SGA","McCain","Caruso","Williams","Holmgren"], score:82, note:"+9.8 NetRtg. McCain's shooting + Caruso defense = balanced versatility" }
      ]
    },
    awayTeam: {
      name: "Suns", city: "Phoenix", abbr: "PHX", seed: 8, record: "45-37",
      systemBonus: -0.5, // Booker-dependent
      playoffPedigree: 0,
      offStyle: "Booker ISO-heavy. Brooks emerging as secondary creator, but offense stalls when Booker is doubled.", initiators: 1,
      color: "#1D1160", color2: "#E56020",
      advStats: { ortg:112.4, drtg:113.8, netRtg:-1.4, pace:99.8, ts:56.2, efg:52.8, tov:13.2, reb:49.1, ortgRk:18, drtgRk:18, clutchNetRtg:1.2, last10:"5-5", fgPct:49.8, threePct:32.7, ftPct:74.4, orbPct:23.3 },
      players: [
        { name:"Devin Booker", pos:"SG", rating:85, ppg:26.0, rpg:4.0, apg:6.0, fgp:46.0, per:22.4, ts:59.2, epm:3.5, bpm:3.8, ws48:.148, onOff:5.2, clutch:7.8, vorp:3.6, usg:29.0, injury:null, lebron:2.489, oLebron:2.85, dLebron:-0.361, war:6.637, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Game-winner vs OKC in Jan. 7.8 clutch rating is elite. But Dort DRtg 102.1 is a wall", baseRating:85, starCeiling:2, injuryRisk:0, playoffAscension:0.8 },
        { name:"Dillon Brooks", pos:"SF", rating:73, ppg:20.2, rpg:4.2, apg:2.1, fgp:44.8, per:17.5, ts:56.5, epm:1.5, bpm:-2.3, ws48:.102, onOff:2.8, clutch:5.8, vorp:-0.1, usg:26.2, injury:null, lebron:-0.116, oLebron:-0.035, dLebron:-0.082, war:2.499, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"HUGE breakout season — Player of the Week. Became Suns #2 behind Booker. Physical SGA assignment. BUT BBRef BPM -2.3 and VORP -0.1 reveal he's a net negative by advanced metrics despite 20.2 PPG — classic high-volume/low-efficiency problem", baseRating:73 },
        { name:"Jalen Green", pos:"SG", rating:68, ppg:17.8, rpg:3.5, apg:2.8, fgp:43.5, per:15.8, ts:51.6, epm:0.5, bpm:-1.1, ws48:.075, onOff:-0.8, clutch:5.0, vorp:0.2, usg:25.0, injury:null, lebron:-0.448, oLebron:0.761, dLebron:-1.209, war:1.044, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"Traded from HOU. Play-in hero (35 & 36 pts) but inconsistent. BBRef: 51.6 TS% (terrible), BPM -1.1, VORP 0.2 — advanced stats say he's a below-replacement player. -0.8 on/off. PHX is worse with him on court", baseRating:68 },
        { name:"Mark Williams", pos:"C", rating:65, ppg:11.5, rpg:8.8, apg:1.5, fgp:56.2, per:16.2, ts:60.5, epm:0.8, bpm:0.5, ws48:.095, onOff:1.5, clutch:4.5, vorp:1.1, usg:20.5, injury:null, lebron:0.765, oLebron:-0.529, dLebron:1.294, war:2.862, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Acquired in 7-team trade. Solid young center. Physical interior presence. Questionable G1 with left foot soreness", baseRating:65, injuryRisk:0.3, activeInjury:{type:"left foot soreness",severity:0.3,note:"Sat out with left foot soreness after play-in game vs POR. Questionable for G1 vs OKC. OKC won 119-84 blowout. Monitor status for G2."} },
        { name:"Ryan Dunn", pos:"SF", rating:60, ppg:8.8, rpg:3.8, apg:1.2, fgp:44.2, per:10.5, ts:53.8, epm:0.0, bpm:-0.5, ws48:.058, onOff:0.5, clutch:4.0, vorp:0.5, usg:17.8, injury:null, lebron:-0.102, oLebron:-0.711, dLebron:0.609, war:2.002, offRole:"Stationary Shooter", defRole:"Helper",
          matchupNote:"Defensive specialist. Length disrupts passing lanes. Limited offensive game", baseRating:60 },
        { name:"Jusuf Nurkic", pos:"C", rating:62, ppg:10.8, rpg:9.4, apg:2.8, fgp:51.2, per:14.8, ts:54.8, epm:-0.4, bpm:-0.8, ws48:.072, onOff:-1.8, clutch:3.8, vorp:0.5, usg:19.8, injury:null, lebron:0.864, oLebron:-1.157, dLebron:2.021, war:2.257, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Backup center role now. -1.8 on/off. Holmgren's stretch-5 game pulls Nurkic out of comfort zone", baseRating:63 },
        { name:"Grayson Allen", pos:"SG", rating:62, ppg:10.5, rpg:3.2, apg:2.5, fgp:44.5, per:12.8, ts:57.5, epm:0.4, bpm:0.1, ws48:.072, onOff:0.5, clutch:4.5, vorp:0.9, usg:19.5, injury:"GTD — left hamstring strain", lebron:0.496, oLebron:1.864, dLebron:-1.368, war:2.718, offRole:"Primary Ball Handler", defRole:"Chaser", injuryRisk:0.4, activeInjury:{type:"left hamstring strain",severity:0.4,note:"Left hamstring strain. Was questionable for G1 alongside Mark Williams (foot). Hamstring injuries linger and limit explosiveness. Re-injury risk elevated in physical OKC matchup. Monitor status for G2 (Apr 21)."},
          matchupNote:"Veteran shooter. 39% from 3. Spacing off the bench", baseRating:62 },
        { name:"Royce O'Neale", pos:"SF", rating:53, ppg:7.5, rpg:4.2, apg:2.5, fgp:43.8, per:11.2, ts:54.5, epm:0.1, bpm:-0.2, ws48:.062, onOff:0.8, clutch:4.2, vorp:0.5, usg:16.5, injury:null, lebron:-2.125, oLebron:-2.119, dLebron:-0.006, war:0.475, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"Veteran 3-and-D. 37% from 3, switchable defender. Steady bench presence", baseRating:58 },
        { name:"Collin Gillespie", pos:"PG", rating:63, ppg:8.5, rpg:1.8, apg:2.8, fgp:43.0, per:11.5, ts:55.5, epm:-0.2, bpm:-0.8, ws48:.058, onOff:-0.2, clutch:4.0, vorp:0.4, usg:17.5, injury:null, lebron:1.913, oLebron:0.678, dLebron:1.235, war:6.245, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"LEBRON hidden gem: 1.913 LEBRON / 6.245 WAR despite modest box stats. Elite D-LEBRON (1.235) as Point of Attack defender. PHX's unsung connector — model severely underrated him", baseRating:63 },
        { name:"Jordan Goodwin", pos:"PG", rating:62, ppg:9.2, rpg:3.5, apg:3.8, fgp:44.5, per:12.8, ts:54.0, epm:0.5, bpm:0.2, ws48:.072, onOff:1.5, clutch:4.5, vorp:0.8, usg:18.5, injury:null, lebron:1.917, oLebron:1.064, dLebron:0.853, war:4.306, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"LEBRON discovery: 1.917 LEBRON / 4.306 WAR — one of PHX's most impactful players by advanced impact metrics. Two-way contributor the model was missing entirely", baseRating:62 }
      ],
      synergy: [
        { players:["Booker","Green","Brooks","Dunn","Williams"], score:66, note:"Brooks breakout gives PHX a real second option. But DRtg 113.5 together. Green inconsistent — only positive when Booker is cooking" }
      ]
    },
    externalFactors: [
      { team:"OKC", player:"Jalen Williams", desc:"Returning from wrist surgery + hamstring. Using final weeks to find rhythm. EPM dropped from 5.2 to 3.8 since return.", impact:-5, category:"injury" },
      { team:"OKC", player:null, desc:"Defending champs. +8.5 clutch NetRtg is league-best. They know how to win close ones.", impact:5, category:"motivation" },
      { team:"PHX", player:"Dillon Brooks", desc:"HUGE breakout season — 20.2 PPG, Player of the Week. Became legit #2 behind Booker. Changes the series calculus.", impact:4, category:"motivation" },
      { team:"PHX", player:"Jalen Green", desc:"Play-in hero: 35 & 36 in elimination games. But inconsistent in reg season, barely featured per reports. On/off -0.8.", impact:1, category:"motivation" },
      { team:"OKC", player:null, desc:"25th in 3PT defense. PHX can exploit from deep if they're hitting.", impact:-3, category:"chemistry" },
      { team:"PHX", player:null, desc:"Play-in exhaustion + mental fold under OKC's pressure. Suns arrived gassed from back-to-back elimination games, then folded in G1 blowout. Jalen Green visibly frustrated by physicality and officiating.", impact:-5, category:"motivation",
        evidence:"PHX played two grueling play-in games before facing a fully rested OKC. G1 CONFIRMED: Thunder blew out Suns — ClutchPoints reported PHX 'folded under pressure' instead of creating off it. Jalen Green told Yahoo Sports he was 'frustrated by Thunder's physicality and officiating.' OKC showed 'clinical, almost frightening obsession with perfection' — the psychological gap was obvious. Defending champs' confidence planted seeds of doubt.",
        sources:["ClutchPoints: thunder-game-1-beatdown-suns","Yahoo: jalen-green-frustrated-thunders-physicality"], verdict:"verified" }
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
      spread: "OKC -15.5", moneyline: "OKC -1100 / PHX +700", ou: "O/U 214.5",
      pick: "OKC", confidence: "high", projScore: "OKC 116 — PHX 100",
      schedule: "Tue Apr 21 — 10:00 PM ET — TNT",
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
    coaching: {
      home: {
        coach: "Mark Daigneault",
        adjustmentRating: 9,
        playoffRecord: "20-5",
        tendency: "Matchup chameleon. Plays 11-12 in regular season, trusts roster depth. Self-focused philosophy.",
        rotationPlan: "Shrinks to 9-man. Closers rotate between Caruso/Joe/Wallace based on matchup needs.",
        keyAdjustment: "Will likely mirror PHX small-ball with Dort/Williams/Caruso defensive wings",
        g1Performance: "A | Executed a near-perfect defensive game plan. Every PHX shot was contested, forcing 35% first-half shooting and 17 turnovers (15-2 in pts off TOs). Brilliantly staggered Booker and Green so OKC always had elite defenders against the lone scoring threat on the floor. Key coaching decision: limited SGA to 29 minutes and Holmgren to 25 — protecting his stars for the long series while still winning by 35. Williams' reintegration was seamless (22pts in 29min) suggesting Daigneault managed his minutes/role carefully during the injury rehab. Let Holmgren feast on PHX's non-existent interior defense (16pts, 50% FG). The game was won in Q1 (35-20) through defensive intensity and transition offense off turnovers."
      },
      away: {
        coach: "Jordan Ott",
        adjustmentRating: 4,
        playoffRecord: "0-1 (first season)",
        tendency: "Young coach, 9-man rotation locked in. Booker + Brooks anchors in closing lineup.",
        rotationPlan: "Booker/Green/Brooks/Williams/O'Neale or Dunn closing lineup. Dunn as SGA stopper.",
        keyAdjustment: "Ryan Dunn as primary SGA defender — length and athleticism to contest",
        g1Performance: "D- | First-year coach overwhelmed by OKC's defensive intensity. Critical failure: staggering Booker and Green left each isolated against OKC's elite POA defenders with no help. Brooks was allowed to shoot the team out of the game (game-high 8 attempts while down 23 in Q2) with no visible coaching intervention. Ott's small-ball approach — which he doubled down on pre-playoffs per reports — backfired against OKC's length (Holmgren 16pts with PHX having no matchup for him). PHX committed 17 turnovers suggesting no adjustment to OKC's pressure. The 48-hour turnaround from the play-in gave Ott no preparation time, but the game plan appeared non-existent. Must completely rethink approach for G2 — potentially starting Dunn for more defensive presence."
      },
      bestLineups: {
        home: { players: ["SGA","Dort","Holmgren","Williams","Wallace"], netRtg:22.1, ortg:128.5, drtg:106.4, min:126, note:"Best net rating in NBA (small sample)" },
        away: { players: ["Booker","Brooks","Green","Williams","Dunn"], netRtg:4.2, ortg:114.8, drtg:110.6, min:320, note:"Primary starting 5" }
      },
      roleChanges: [
        { team:"OKC", player:"McCain", regSeason:"Bench scorer, 18 MPG", playoff:"X-factor off bench. Could see crunch time if PHX goes small", impact:"up", reason:"Daigneault trusts young guards in big moments" },
        { team:"OKC", player:"Caruso", regSeason:"Bench defender, 22 MPG", playoff:"Closing lineup defender vs Booker, 26+ MPG", impact:"up", reason:"Playoff Caruso is a different animal — proven closer" },
        { team:"PHX", player:"Dunn", regSeason:"Rotation wing, 20 MPG", playoff:"Primary SGA stopper, 28+ MPG", impact:"up", reason:"Ott will maximize his defensive assignment value" },
        { team:"PHX", player:"Green", regSeason:"Second option, 32 MPG", playoff:"Must become co-star, 36+ MPG", impact:"up", reason:"Without a third star, Green must match Booker's production" }
      ]
    },
    games: [{num:1,result:"W",homeScore:119,awayScore:84,winner:"OKC",notes:"35-pt blowout. SGA 25pts (5-18 FG, 0-4 3PT, 15-17 FT) in 29min — sat Q4. J.Williams 22pts (9-15 FG), 7reb, 6ast — All-NBA return. Holmgren 16pts, 7reb, 2stl, 2blk in 25min. PHX: Booker 23pts, 6reb. Brooks 18pts, 7reb — shot team out early (8 attempts while down 23). PHX 35% FG first half, 17 TOs, OKC pts off TOs 15-2. Q1: 35-20 OKC, Half: 65-44. Model picks: OKC ML ✅, OKC -14.5 ✅ (+20.5 margin), SGA O27.5 ❌ (25pts — sat in blowout)."},{num:2,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "DEN-MIN", conf: "West", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Aaron Gordon", target:"Anthony Edwards", dLebron:-0.774, targetUsg:32.5, note:"Gordon is physical enough to bother Ant and has elite on/off (+12.8), but D-LEBRON is negative — his value is more about team defense and help-side. Edwards has Randle as secondary creator, so MIN has 2 initiators." },
      awayDefOnHome: { defender:"Jaden McDaniels", target:"Nikola Jokic", dLebron:0.233, targetUsg:33.2, note:"McDaniels' POA length can contest Jokic's passing lanes, but Jokic is unstoppable one-on-one (PER 31.5). The real Jokic defense is team-based (Gobert help-side). McDaniels' D-LEBRON (0.233) is modest — he's more impactful on wings. DEN's 2 initiators (Jokic + Murray) split attention." }
    },
    homeTeam: {
      name: "Nuggets", city: "Denver", abbr: "DEN", seed: 3, record: "54-28",
      systemBonus: 1.5, // Jokic system
      playoffPedigree: 2, // 2023 champs
      offStyle: "Jokic post-up/handoff initiation — most stylistically distinctive offense in the league (Partnow outlier). Murray secondary P&R creator.", initiators: 2,
      color: "#0E2240", color2: "#FEC524",
      advStats: { ortg:120.2, drtg:114.1, netRtg:6.1, pace:97.8, ts:59.8, efg:56.2, tov:12.5, reb:50.8, ortgRk:1, drtgRk:21, clutchNetRtg:4.2, last10:"8-2", fgPct:53.2, threePct:37.8, ftPct:81.6, orbPct:24.6 },
      players: [
        { name:"Nikola Jokic", age:31, pos:"C", rating:97, ppg:27.4, rpg:13.2, apg:10.1, fgp:56.8, per:31.5, ts:66.2, epm:10.2, bpm:14.2, ws48:.312, onOff:14.5, clutch:9.1, vorp:9.2, usg:33.2, injury:null, lebron:7.367, oLebron:6.247, dLebron:1.12, war:13.33, offRole:"Shot Creator", defRole:"Anchor Big",
          matchupNote:"Best player alive. PER 31.5, EPM 10.2, +14.5 on/off — all league-best. Historically dominates Gobert. Won season series 3-1", baseRating:97, starCeiling:2, injuryRisk:0, playoffAscension:0.5 },
        { name:"Jamal Murray", pos:"PG", rating:78, ppg:20.8, rpg:4.1, apg:6.8, fgp:46.2, per:19.8, ts:58.4, epm:3.2, bpm:3.1, ws48:.142, onOff:4.2, clutch:7.8, vorp:3.0, usg:26.5, injury:null, lebron:1.389, oLebron:3.171, dLebron:-1.782, war:6.394, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"Playoff Murray is real: 7.8 clutch rating. Two-man game with Jokic is unstoppable (1.18 PPP)", baseRating:78, starCeiling:1, injuryRisk:0.8, activeInjury:{type:"chronic knee",severity:0.7,note:"ACL tear history (2020). G1: Played through chronic knee but DEN won 116-105. Conditioning concern grows each game as series progresses. Historically degrades in Games 5-7."} },
        { name:"Cameron Johnson", pos:"SF", rating:72, ppg:17.1, rpg:4.5, apg:2.8, fgp:46.5, per:16.8, ts:59.5, epm:1.8, bpm:1.5, ws48:.115, onOff:10.1, clutch:5.0, vorp:1.9, usg:24.0, injury:null, lebron:0.574, oLebron:0.806, dLebron:-0.231, war:3.133, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Acquired from BKN for MPJ (Jul 2025). Full season in Jokic system. 39.8% from 3. FantasyLabs on/off +10.14 NetRtg — thriving in DEN's system far more than initial model captured (+2.5 original). More defensive versatility than MPJ", baseRating:72 },
        { name:"Aaron Gordon", pos:"PF", rating:71, ppg:13.8, rpg:6.2, apg:3.1, fgp:52.4, per:16.4, ts:58.8, epm:1.8, bpm:1.5, ws48:.112, onOff:12.8, clutch:5.2, vorp:1.7, usg:22.5, injury:null, lebron:0.61, oLebron:1.384, dLebron:-0.774, war:1.934, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"Edwards assignment. Physical enough to bother Ant. FantasyLabs on/off +12.79 NetRtg — massively underrated glue guy. DEN is a different team with Gordon on court", baseRating:71 },
        { name:"Christian Braun", pos:"SG", rating:66, ppg:11.2, rpg:4.5, apg:2.8, fgp:47.1, per:13.8, ts:57.4, epm:0.8, bpm:0.5, ws48:.088, onOff:1.8, clutch:5.8, vorp:1.1, usg:20.0, injury:null, lebron:-0.326, oLebron:-0.361, dLebron:0.035, war:1.87, offRole:"Stationary Shooter", defRole:"Point of Attack",
          matchupNote:"Championship DNA. 5.8 clutch rating for a role player is excellent. Won't shrink", baseRating:66 },
        { name:"Peyton Watson", pos:"SF", rating:0, ppg:14.8, rpg:4.9, apg:2.1, fgp:48.6, per:15.0, ts:57.0, epm:0.5, bpm:0.3, ws48:.085, onOff:1.0, clutch:4.5, vorp:1.2, usg:23.0, injury:"OUT — hamstring (likely entire series)", lebron:-1.281, oLebron:-1.022, dLebron:-0.258, war:1.181, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"Breakout wing, 1.1 BPG, athletic two-way player in expanded role", baseRating:62 },
        { name:"Bruce Brown", pos:"SG", rating:62, ppg:10.5, rpg:4.2, apg:2.8, fgp:47.5, per:13.8, ts:56.5, epm:0.5, bpm:0.3, ws48:.082, onOff:1.2, clutch:5.2, vorp:0.9, usg:19.5, injury:null, lebron:-2.217, oLebron:-1.82, dLebron:-0.397, war:0.315, offRole:"Stationary Shooter", defRole:"Point of Attack",
          matchupNote:"Re-signed Jul 2025. Championship role player from 2023. Versatile defender, can guard 1-3. Playoff-tested", baseRating:62 },
        { name:"Jonas Valanciunas", pos:"C", rating:58, ppg:8.7, rpg:5.1, apg:1.2, fgp:58.2, per:18.5, ts:62.0, epm:0.5, bpm:1.0, ws48:.130, onOff:-0.5, clutch:3.5, vorp:1.1, usg:17.8, injury:null, lebron:-0.288, oLebron:0.167, dLebron:-0.455, war:1.185, offRole:"Post Scorer", defRole:"Anchor Big",
          matchupNote:"Acquired from SAC (Jul 2025). Elite per-minute efficiency (23.3 PTS per 36). Backup C behind Jokic. Foul-prone", baseRating:58 },
        { name:"Julian Strawther", pos:"SG", rating:56, ppg:7.2, rpg:2.0, apg:1.1, fgp:44.0, per:10.5, ts:57.8, epm:-0.3, bpm:-0.8, ws48:.055, onOff:-0.5, clutch:3.5, vorp:0.3, usg:16.2, injury:null, lebron:-2.076, oLebron:-1.232, dLebron:-0.844, war:0.211, offRole:"Movement Shooter", defRole:"Low Activity",
          matchupNote:"3-and-D wing, can stretch to 13 PPG as starter. Inconsistent but has upside", baseRating:56 },
        { name:"DaRon Holmes II", pos:"PF", rating:48, ppg:4.5, rpg:2.2, apg:0.6, fgp:50.8, per:9.5, ts:58.0, epm:-1.2, bpm:-1.8, ws48:.042, onOff:-1.5, clutch:2.5, vorp:-0.4, usg:14.2, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:null, defRole:null,
          matchupNote:"Second-year big, physical energy off bench. Emergency minutes depth piece", baseRating:48 }
      ],
      synergy: [
        { players:["Murray","Braun","C.Johnson","Gordon","Jokic"], score:85, note:"Cam Johnson replaces MPJ — more defensive versatility but slightly less spacing. Jokic-Murray two-man game: 1.18 PPP still elite. Full season together. DRtg improved with Johnson's defense" }
      ]
    },
    awayTeam: {
      name: "Timberwolves", city: "Minnesota", abbr: "MIN", seed: 6, record: "49-33",
      systemBonus: 1.0, // Edwards-driven pace
      playoffPedigree: 1, // 2024 WCF
      offStyle: "Edwards ISO/P&R primary. Randle secondary shot creation. Gobert screen actions. Conventional style — easy to scout.", initiators: 2,
      color: "#0C2340", color2: "#236192",
      advStats: { ortg:114.8, drtg:111.5, netRtg:3.3, pace:96.4, ts:57.1, efg:53.5, tov:13.1, reb:52.8, ortgRk:7, drtgRk:12, clutchNetRtg:2.1, last10:"6-4", fgPct:50.5, threePct:33.8, ftPct:76.2, orbPct:26.2 },
      players: [
        { name:"Anthony Edwards", pos:"SG", rating:86, ppg:28.8, rpg:5.5, apg:5.2, fgp:46.1, per:21.8, ts:59.2, epm:5.8, bpm:4.5, ws48:.178, onOff:7.8, clutch:7.5, vorp:3.5, usg:32.5, injury:"GTD — right knee management", lebron:1.285, oLebron:2.623, dLebron:-1.337, war:5.014, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"Career-high 28.8 PPG. Led 20-pt Game 7 comeback in Denver last year. +7.8 on/off. Knee concern limits explosiveness", baseRating:90, starCeiling:2, injuryRisk:0.6, playoffAscension:0.8, activeInjury:{type:"knee management",severity:0.7,note:"G1: 22pts on 7-19 FG — 'clearly limited and laboring' per reporters. Admitted post-game he was 'a little fatigued' after missing ~6 weeks. Knee limits explosiveness and burst off the dribble. Conditioning concern compounds across a 7-game series."} },
        { name:"Julius Randle", pos:"PF", rating:74, ppg:20.1, rpg:8.8, apg:4.2, fgp:47.5, per:20.2, ts:57.8, epm:2.1, bpm:2.4, ws48:.132, onOff:3.2, clutch:5.5, vorp:2.6, usg:26.2, injury:null, lebron:0.257, oLebron:1.499, dLebron:-1.242, war:4.445, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Physical mismatch potential. But Jokic assignment on D is a disaster — Jokic PER advantage is +11.3", baseRating:74, starCeiling:1, injuryRisk:0.4 },
        { name:"Rudy Gobert", age:33, pos:"C", rating:72, ppg:10.2, rpg:11.8, apg:1.4, fgp:64.1, per:18.4, ts:65.8, epm:2.4, bpm:2.1, ws48:.142, onOff:4.5, clutch:4.2, vorp:1.9, usg:19.0, injury:null, lebron:1.822, oLebron:-0.603, dLebron:2.425, war:6.38, offRole:"Roll + Cut Big", defRole:"Anchor Big",
          matchupNote:"DPOY caliber but Jokic historically feasts: 28/14/11 average vs Gobert in career. Gets pulled to perimeter", baseRating:75 },
        { name:"Jaden McDaniels", pos:"SF", rating:68, ppg:11.8, rpg:4.2, apg:1.8, fgp:45.8, per:12.8, ts:55.2, epm:0.8, bpm:0.4, ws48:.078, onOff:1.5, clutch:4.8, vorp:1.1, usg:20.5, injury:null, lebron:-1.154, oLebron:-1.387, dLebron:0.233, war:1.896, offRole:"Athletic Finisher", defRole:"Point of Attack",
          matchupNote:"7-foot wing defender. MPJ assignment. Length disrupts passing lanes", baseRating:68 },
        { name:"Mike Conley", pos:"PG", rating:61, ppg:8.4, rpg:2.8, apg:5.6, fgp:42.8, per:11.5, ts:54.1, epm:0.4, bpm:-0.2, ws48:.068, onOff:-0.8, clutch:5.8, vorp:0.6, usg:17.5, injury:null, lebron:-0.753, oLebron:-0.913, dLebron:0.159, war:1.06, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"38yo veteran. -0.8 on/off but 5.8 clutch rating shows big-moment composure. Murray will target him", baseRating:64 },
        { name:"Naz Reid", pos:"C", rating:66, ppg:13.6, rpg:6.2, apg:2.2, fgp:45.6, per:17.5, ts:57.0, epm:1.0, bpm:1.5, ws48:.110, onOff:2.5, clutch:5.5, vorp:1.7, usg:22.2, injury:null, lebron:1.086, oLebron:-0.011, dLebron:1.096, war:4.46, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Elite 6th man, proven playoff performer. Can play beside or replace Gobert. Changes MIN's offense off bench", baseRating:66 },
        { name:"Donte DiVincenzo", pos:"SG", rating:60, ppg:12.2, rpg:4.1, apg:3.8, fgp:40.6, per:13.5, ts:54.0, epm:0.3, bpm:0.0, ws48:.070, onOff:1.0, clutch:4.5, vorp:1.0, usg:21.0, injury:null, lebron:0.556, oLebron:0.196, dLebron:0.359, war:4.714, offRole:"Movement Shooter", defRole:"Chaser",
          matchupNote:"Started G1 at PG. 3PT shooter (37.9%), plays all 82 games. Spacing and secondary playmaking", baseRating:60 },
        { name:"Ayo Dosunmu", pos:"SG", rating:56, ppg:9.8, rpg:3.2, apg:3.5, fgp:44.0, per:13.0, ts:55.0, epm:0.2, bpm:-0.2, ws48:.068, onOff:0.5, clutch:4.0, vorp:0.7, usg:18.8, injury:null, lebron:-1.198, oLebron:-0.109, dLebron:-1.089, war:1.487, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Acquired mid-season. Versatile two-way guard, provides secondary playmaking and defense off bench", baseRating:56 },
        { name:"Terrence Shannon Jr.", pos:"SF", rating:48, ppg:5.0, rpg:2.0, apg:0.8, fgp:42.0, per:9.0, ts:52.0, epm:-1.0, bpm:-1.5, ws48:.042, onOff:-1.0, clutch:2.8, vorp:-0.2, usg:14.5, injury:null, lebron:-2.196, oLebron:-0.586, dLebron:-1.61, war:0.092, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Athletic wing depth, defensive energy in spot minutes", baseRating:48 }
      ],
      synergy: [
        { players:["Conley","Edwards","McDaniels","Randle","Gobert"], score:75, note:"DRtg 109.2 is solid. But ORtg drops to 112.1 with Gobert's spacing limitations. Edwards isolation: 1.02 PPP (82nd percentile) is their trump card" }
      ]
    },
    externalFactors: [
      { team:"MIN", player:"Anthony Edwards", desc:"Missed 11 of final 14 games — knee maintenance. Says 'full go' but explosiveness and conditioning are real concerns for Game 1.", impact:-5, category:"injury" },
      { team:"MIN", player:"Anthony Edwards", desc:"3rd time facing Denver in 4 years. Led 20-pt Game 7 comeback last year IN Denver. This matchup brings out his best.", impact:5, category:"motivation" },
      { team:"DEN", player:null, desc:"#1 offense in NBA (120.2 ORtg). Won last 12 games. 28-13 at home. Mile-high altitude is a real factor — opponents shoot worse.", impact:5, category:"motivation" },
      { team:"DEN", player:null, desc:"21st in DRtg (114.1). Can be scored on. If Edwards is healthy, he can exploit this.", impact:-3, category:"chemistry" },
      { team:"MIN", player:"Anthony Edwards", desc:"18 technical fouls (most in NBA), $320K in fines, ejected in OT vs Nets. Emotional volatility is a playoff liability — one bad call away from ejection or tilt.", impact:-4, category:"personal",
        evidence:"ESPN confirmed Edwards picked up his 18th tech of the season (NBA-high) for profanity after a no-call. Fined 6 separate times totaling $320K. Coach Finch defended him but admitted frustration is a pattern. Tech was rescinded but pattern is clear — Edwards plays on an emotional edge that can tip into self-destructive territory. G1 CONFIRMED: conditioning faded in 2nd half as frustration mounted with knee limitations.",
        sources:["ESPN: espn.com/nba/story/_/id/44637260","NBA.com: nba.com/news/anthony-edwards-mandatory-suspension"], verdict:"verified" }
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
    coaching: {
      home: {
        coach: "David Adelman",
        adjustmentRating: 6,
        playoffRecord: "8-5",
        tendency: "Jokic-centric system. Willing to go small-ball with Watson at C. Creative bench rotations.",
        rotationPlan: "May bench Valanciunas for Watson small-ball. Bruce Brown key bench piece. Spencer Jones small-ball 5 experiment.",
        keyAdjustment: "Peyton Watson as Swiss-Army backup center — switches everything defensively",
        g1Performance: "A- | Dominated the middle quarters (outscored MIN 68-46 in Q2+Q3) with a devastating 14-0 Q3 run. Managed Jokic's slow start perfectly — only 3pts in Q1, but Adelman didn't panic, let the system work, and Jokic exploded for 22nd career playoff triple-double (25/13/11). Murray's free-throw hunting strategy yielded a historic 16/16 FT line. Watson small-ball worked as planned. Only deduction: allowed MIN to lead 33-23 after Q1 and let them cut to 97-95 in Q4 before closing — game should have been sealed earlier. Bruce Brown's expanded bench minutes paid dividends."
      },
      away: {
        coach: "Chris Finch",
        adjustmentRating: 7,
        playoffRecord: "12-12",
        tendency: "Gobert-anchored defense. Pulls Gobert late for offense but DRtg craters (118.8 without him).",
        rotationPlan: "9-man rotation. DiVincenzo/Edwards/McDaniels/Randle/Gobert closing lineup. Naz Reid 18-20 MPG.",
        keyAdjustment: "Gobert vs Jokic straight-up or using Randle to body Jokic in short stretches",
        g1Performance: "C+ | Strong Q1 (33-23 lead) showed Finch's opening game plan worked — Edwards aggressive early, Gobert efficient (8/9 FG, 17pts). But Q2-Q3 collapse (46-68 deficit) exposed inability to adjust mid-game. Allowed a 14-0 Q3 run without calling timeout or changing scheme. Edwards' knee (7-19 FG) limits Finch's best weapon — he hasn't found an alternative offensive system for diminished-Edwards games. Positive: cut to 97-95 in Q4, showing resilience. But couldn't sustain the push. Historically held DEN to 80pts in 2024 G2 — proven he CAN adjust between games. G2 adjustment potential is high."
      },
      bestLineups: {
        home: { players: ["Murray","Braun","C.Johnson","Gordon","Jokic"], netRtg:8.5, ortg:120.2, drtg:111.7, min:280, note:"Starting 5 — limited reps due to injuries, but elite when together" },
        away: { players: ["DiVincenzo","Edwards","McDaniels","Randle","Gobert"], netRtg:6.8, ortg:116.5, drtg:109.7, min:710, note:"Most-used lineup in NBA this season (710 min)" }
      },
      roleChanges: [
        { team:"DEN", player:"Watson", regSeason:"Bench wing, 16 MPG", playoff:"Small-ball C, Swiss-Army knife, 22+ MPG", impact:"up", reason:"Adelman trusts his switchability at backup 5" },
        { team:"DEN", player:"Valanciunas", regSeason:"Backup C, 18 MPG", playoff:"May lose minutes to Watson small-ball, 10-12 MPG", impact:"down", reason:"Too slow to switch vs Edwards in space" },
        { team:"DEN", player:"B.Brown", regSeason:"Bench guard, 20 MPG", playoff:"Key bench connector, 24+ MPG. Proven playoff performer", impact:"up", reason:"Adelman shifted bench direction toward Brown" },
        { team:"MIN", player:"Gobert", regSeason:"Starter, 32 MPG", playoff:"Starter but Finch may pull him in crunch time for offense", impact:"down", reason:"DRtg 118.8 without him is catastrophic — risky gamble" },
        { team:"MIN", player:"DiVincenzo", regSeason:"Starter, 30 MPG", playoff:"Starter + closer, 34+ MPG. Must hit 3s to space for Edwards", impact:"up", reason:"Spacing essential vs Denver's help defense" }
      ]
    },
    games: [{num:1,result:"DEN",homeScore:116,awayScore:105,winner:"DEN",notes:"DEN 116-105. Murray 30pts (historic 16/16 FT), Jokic 25/13/11 (22nd playoff triple-double — slow start w/ 3pts in Q1, then dominated). DEN dominated middle quarters outscoring MIN 68-46 with a 14-0 run. Edwards 22/9/7/3blk (7-of-19 FG — knee limiting efficiency, not availability), Gobert 17pts (8/9 FG), Randle 16pts. MIN led 33-23 after Q1, cut to 97-95 in Q4 but couldn't sustain. WPA: MVP Gobert +15.0%, LVP Edwards -8.2%. FT was the biggest factor (+23.1% WPA for DEN — Murray's 16/16), Rebounds +13.7%, TOV +7.2%."},{num:2,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
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
        { name:"Victor Wembanyama", pos:"C", rating:94, ppg:24.8, rpg:11.5, apg:3.1, fgp:51.2, per:29.5, ts:63.2, epm:8.8, bpm:10.7, ws48:.255, onOff:16.9, clutch:7.5, vorp:5.7, usg:32.4, injury:"Rib contusion — expected to play", lebron:7.647, oLebron:3.655, dLebron:3.992, war:11.25, offRole:"Shot Creator", defRole:"Anchor Big",
          matchupNote:"+16.9 on/off is HISTORIC (120.5/103.6 splits). PER 29.5, 3.1 BPG. Makes driving lanes treacherous. Rib concern for explosiveness", baseRating:94, starCeiling:2, injuryRisk:0.2, activeInjury:{type:"rib contusion",severity:0.1,note:"G1: 35pts (franchise playoff record), 5-6 from 3 — rib was NON-FACTOR. Played 36 min with full explosiveness. Initially suffered Apr 6 vs PHI but returned Apr 11 vs DAL (40pts). Consider downgrading to monitor-only status."} },
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
          matchupNote:"Signed Aug 2025. Backup guard, 3PT shooter. Spot minutes depth behind Fox/Castle", baseRating:50 }
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
          matchupNote:"Stretch forward, can hit 3s. Energy and hustle off bench. Twin brother plays for Iowa", baseRating:50 }
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
        sources:["NBA.com: nba.com/news"], verdict:"verified" }
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
    game2: {
      spread: "SAS -11.5", moneyline: "SAS -600 / POR +425", ou: "O/U 216.5",
      pick: "SAS", confidence: "high", projScore: "SAS 113 — POR 100",
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
    coaching: {
      home: {
        coach: "Mitch Johnson",
        adjustmentRating: 5,
        playoffRecord: "1-0",
        tendency: "Defense-first, offensive freedom. Pop's protege. Matchup-based lineup experiments. Fox/Castle/Harper together in crunch.",
        rotationPlan: "9-man rotation. May use Fox-Castle-Harper closing trio despite shooting concerns. Wembanyama 30+ MPG.",
        keyAdjustment: "Unorthodox closing lineups prioritizing defense and versatility over spacing",
        g1Performance: "A | Excellent debut. Castle+Wemby combined for 19 of 30 Q1 pts — Johnson's game plan put SAS's two best weapons front and center immediately. When POR cut a 16-pt lead to 2 (59-57) with an 8-0 Q3 run, Johnson's defense clamped down and Vassell's two straight 3s (72-61) restored control — a sign of composure under pressure. Kornet deployment was a subtle tactical win — his block on Clingan (same possession as Vassell's block) showed Johnson designed help-side schemes to neutralize POR's rim protector. Let Wemby play freely on offense while surrounding him with defensive versatility. The only concern: allowing POR's 8-0 Q3 run before adjusting."
      },
      away: {
        coach: "Tiago Splitter (interim)",
        adjustmentRating: 4,
        playoffRecord: "0-1",
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
    games: [{num:1,result:"W",homeScore:111,awayScore:98,winner:"SAS",notes:"Wemby's playoff debut — 35pts (franchise record, surpassing Duncan's 32 in 1998), 5reb, 2blk, 5-6 3PT. 21 first-half pts = NBA record for most in opening half of playoff debut (since 1997 PBP era). Castle 17pts + Fox 17pts (combined 15ast). Vassell hit two straight 3s in Q3 to put game away (72-61). POR: Avdija 30pts/10reb (All-Star level), Henderson 18pts (breakout). Clingan blocked multiple times — Kornet AND Vassell blocked him on SAME possession. SAS led by 16 in 1H, POR cut to 59-57 with 8-0 Q3 run, but SAS clamped down defensively and pulled away. Sellout crowd at Frost Bank Center (Duncan + Robinson courtside). Model picks: SAS ML ✅ (HIGH confidence), SAS -10.5 ✅ (+2.5 margin cover), Under 218.5 ✅ (209 total)."},{num:2,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
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
        { name:"Jalen Duren", pos:"C", rating:80, ppg:19.5, rpg:10.5, apg:2.2, fgp:57.5, per:22.5, ts:61.8, epm:3.8, bpm:4.0, ws48:.172, onOff:6.2, clutch:5.8, vorp:3.2, usg:25.8, injury:null, lebron:3.992, oLebron:2.617, dLebron:1.375, war:7.905, offRole:"Shot Creator", defRole:"Mobile Big",
          matchupNote:"All-Star breakout! Dominates interior. 61.8 TS%. +6.2 on/off. Physical presence on both ends", baseRating:80 },
        { name:"Jaden Ivey", pos:"SG", rating:72, ppg:16.8, rpg:3.5, apg:4.2, fgp:44.8, per:16.5, ts:56.8, epm:1.2, bpm:0.8, ws48:.098, onOff:2.1, clutch:5.2, vorp:1.5, usg:24.0, injury:null, lebron:-1.508, oLebron:-0.829, dLebron:-0.679, war:0.4, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"Explosive transition scorer. 18.4 PPG in fast break = top-10 in NBA", baseRating:72 },
        { name:"Ausar Thompson", pos:"SF", rating:78, ppg:14.2, rpg:6.8, apg:3.4, fgp:51.2, per:16.8, ts:57.4, epm:2.8, bpm:2.5, ws48:.132, onOff:5.8, clutch:5.5, vorp:2.5, usg:22.5, injury:null, lebron:2.821, oLebron:-0.109, dLebron:2.93, war:6.247, offRole:"Roll + Cut Big", defRole:"Point of Attack",
          matchupNote:"Elite perimeter defender. LEBRON confirms: D-LEBRON 2.93 is #3 in the NBA (behind Wemby and Chet). DRtg 101.4 when on court. 6.247 WAR — DET's #3 most impactful player", baseRating:78 },
        { name:"Tim Hardaway Jr.", pos:"SF", rating:63, ppg:11.2, rpg:3.1, apg:1.8, fgp:43.5, per:12.1, ts:56.2, epm:0.2, bpm:-0.2, ws48:.068, onOff:0.5, clutch:5.0, vorp:0.7, usg:20.0, injury:null, lebron:-1.112, oLebron:0.705, dLebron:-1.817, war:1.796, offRole:"Off Screen Shooter", defRole:"Chaser",
          matchupNote:"Veteran spacing. 38.5% from 3. Playoff experience matters for young team", baseRating:63 },
        { name:"Isaiah Stewart", pos:"C", rating:64, ppg:8.5, rpg:6.2, apg:1.2, fgp:54.8, per:14.5, ts:58.2, epm:0.8, bpm:0.8, ws48:.092, onOff:2.5, clutch:4.8, vorp:1.1, usg:17.5, injury:null, lebron:-0.527, oLebron:-0.879, dLebron:0.352, war:1.595, offRole:"Stretch Big", defRole:"Mobile Big",
          matchupNote:"Backup C now behind Duren. Physical interior presence. +2.5 on/off in backup role", baseRating:64 },
        { name:"Tobias Harris", pos:"PF", rating:60, ppg:13.3, rpg:5.1, apg:2.5, fgp:46.9, per:14.5, ts:57.0, epm:0.0, bpm:-0.3, ws48:.075, onOff:0.5, clutch:4.0, vorp:0.8, usg:22.0, injury:null, lebron:1.552, oLebron:1.026, dLebron:0.526, war:4.386, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"Veteran starter, 36.8% from 3. Steadying presence and reliable mid-range scorer", baseRating:60 },
        { name:"Marcus Sasser", pos:"PG", rating:48, ppg:5.6, rpg:1.1, apg:2.1, fgp:40.7, per:9.5, ts:56.0, epm:-0.8, bpm:-1.5, ws48:.042, onOff:-1.0, clutch:3.0, vorp:0.1, usg:14.8, injury:null, lebron:-2.122, oLebron:-1.168, dLebron:-0.953, war:0.099, offRole:"Secondary Ball Handler", defRole:"Point of Attack",
          matchupNote:"3PT specialist (43.3% from deep). Spot minutes guard for spacing in small lineups", baseRating:48 }
      ],
      synergy: [
        { players:["Cunningham","Ivey","A. Thompson","Harris","Duren"], score:84, note:"#1 defense (107.2 DRtg). Cunningham creates, A. Thompson locks down, Duren dominates interior. +7.2 clutch NetRtg. Won 15 of 19 to close season" },
        { players:["Cunningham","Ivey","Hardaway","Stewart","Harris"], score:72, note:"Veteran-heavy bench lineup. Harris steadies offense, Stewart provides physicality. Spacing maintained with Hardaway" }
      ]
    },
    awayTeam: {
      name: "Magic", city: "Orlando", abbr: "ORL", seed: 8, record: "45-37",
      systemBonus: 1.0, // elite defense
      playoffPedigree: 0,
      offStyle: "Defense-to-offense identity. Methodical half-court, switchable lineups. Multiple secondary creators but no elite initiator.", initiators: 2,
      color: "#0077C0", color2: "#000000",
      advStats: { ortg:110.2, drtg:111.8, netRtg:-1.6, pace:96.8, ts:55.4, efg:51.8, tov:13.8, reb:50.2, ortgRk:24, drtgRk:15, clutchNetRtg:3.8, last10:"5-5", fgPct:48.8, threePct:31.2, ftPct:72.8, orbPct:24.2 },
      players: [
        { name:"Paolo Banchero", pos:"PF", rating:78, ppg:22.4, rpg:7.5, apg:4.8, fgp:46.2, per:20.8, ts:56.4, epm:2.8, bpm:3.2, ws48:.138, onOff:4.8, clutch:6.2, vorp:3.1, usg:27.5, injury:null, lebron:0.875, oLebron:0.98, dLebron:-0.105, war:5.229, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"Physical scorer. 6.2 clutch rating is best on team. Only real matchup problem for Detroit", baseRating:78, starCeiling:1, injuryRisk:0.5 },
        { name:"Franz Wagner", pos:"SF", rating:75, ppg:20.1, rpg:5.4, apg:5.2, fgp:47.1, per:18.4, ts:57.2, epm:2.2, bpm:2.0, ws48:.128, onOff:3.5, clutch:5.5, vorp:2.4, usg:26.2, injury:null, lebron:2.297, oLebron:1.688, dLebron:0.608, war:3.031, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"Versatile creator. Can initiate offense. But A. Thompson defense will make life hard", baseRating:75, starCeiling:1, injuryRisk:0 },
        { name:"Desmond Bane", pos:"SG", rating:74, ppg:19.2, rpg:4.5, apg:3.8, fgp:45.5, per:17.5, ts:58.2, epm:2.0, bpm:1.8, ws48:.118, onOff:3.0, clutch:5.8, vorp:2.2, usg:25.8, injury:null, lebron:1.688, oLebron:1.316, dLebron:0.373, war:7.16, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"Traded from Memphis. Proven scorer, 39% from 3. Gives ORL a much-needed third creator", baseRating:74 },
        { name:"Jalen Suggs", pos:"PG", rating:66, ppg:12.8, rpg:3.8, apg:4.5, fgp:43.2, per:13.5, ts:54.2, epm:0.5, bpm:0.2, ws48:.072, onOff:0.8, clutch:4.8, vorp:0.9, usg:21.5, injury:null, lebron:2.175, oLebron:0.623, dLebron:1.552, war:4.562, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Defensive guard but Cunningham matchup is a massive creation gap (-11.7 PER)", baseRating:66 },
        { name:"Wendell Carter Jr.", pos:"C", rating:64, ppg:11.5, rpg:8.2, apg:2.8, fgp:52.1, per:15.2, ts:56.8, epm:0.4, bpm:0.1, ws48:.082, onOff:0.2, clutch:4.2, vorp:1.0, usg:20.5, injury:null, lebron:0.313, oLebron:-1.013, dLebron:1.326, war:3.977, offRole:"Stretch Big", defRole:"Mobile Big",
          matchupNote:"Solid but Duren outmuscles him. PER gap of -7.3", baseRating:64 },
        { name:"Anthony Black", pos:"PG", rating:60, ppg:8.5, rpg:3.5, apg:3.8, fgp:43.8, per:11.2, ts:53.5, epm:-0.2, bpm:-0.5, ws48:.058, onOff:-0.5, clutch:4.0, vorp:0.3, usg:17.5, injury:null, lebron:0.459, oLebron:0.202, dLebron:0.257, war:3.495, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Young backup PG. Flashes of potential but inconsistent. Gets hunted on switches", baseRating:60 },
        { name:"Goga Bitadze", pos:"C", rating:61, ppg:9.2, rpg:6.8, apg:1.5, fgp:54.5, per:14.5, ts:58.5, epm:0.2, bpm:0.0, ws48:.072, onOff:0.5, clutch:3.8, vorp:0.7, usg:18.5, injury:null, lebron:2.229, oLebron:0.417, dLebron:1.812, war:2.85, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Backup center. Solid per-minute but limited playing time. Provides physicality off bench", baseRating:61 },
        { name:"Tristan da Silva", pos:"SF", rating:55, ppg:9.9, rpg:3.7, apg:1.6, fgp:46.0, per:11.5, ts:55.0, epm:-0.3, bpm:-0.8, ws48:.065, onOff:0.0, clutch:3.5, vorp:0.4, usg:18.8, injury:null, lebron:-0.717, oLebron:-0.838, dLebron:0.121, war:2.073, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Versatile sophomore forward, 12 PPG as starter. Switchable defender on wings", baseRating:55 },
        { name:"Moritz Wagner", pos:"C", rating:50, ppg:6.9, rpg:3.2, apg:0.8, fgp:42.6, per:12.0, ts:53.0, epm:-0.5, bpm:-1.0, ws48:.055, onOff:-0.5, clutch:3.0, vorp:0.1, usg:16.0, injury:null, lebron:-0.321, oLebron:0.531, dLebron:-0.852, war:0.572, offRole:"Versatile Big", defRole:"Mobile Big",
          matchupNote:"Returned from ACL surgery. Provides bench scoring punch and energy in spot minutes", baseRating:50 }
      ],
      synergy: [
        { players:["Suggs","Bane","Wagner","Banchero","Carter"], score:70, note:"Bane addition upgrades offense significantly. Three legitimate creators now. But DRtg 111.8 is average and 3PT shooting still a concern" }
      ]
    },
    externalFactors: [
      { team:"DET", player:"Cade Cunningham", desc:"Collapsed lung recovery. Played well in return but playoff minutes load is unknown. Contact aversion could limit aggressiveness.", impact:-5, category:"injury" },
      { team:"DET", player:null, desc:"60-22, #1 seed, franchise renaissance. Won 15 of 19 to close. +7.2 clutch NetRtg — elite closers. Extreme confidence.", impact:5, category:"motivation" },
      { team:"ORL", player:null, desc:"Bane trade upgrades offense but team still -1.6 NetRtg. Needed play-in to get here. But 3.8 clutch NetRtg shows fight.", impact:-2, category:"chemistry" },
      { team:"ORL", player:"Paolo Banchero", desc:"Banchero-Mosley relationship severely fractured. Communication 'almost non-existent' during timeouts. Star avoids eye contact in huddles. Coach has 'lost the locker room.' Season-long dysfunction dropped ORL to 8th seed (45-37) in a 'missed opportunity' year.", impact:-6, category:"chemistry",
        evidence:"Yardbarker reported Banchero-Mosley communication is 'almost non-existent during timeouts' with Banchero 'often avoiding eye contact.' Multiple sources say Mosley has 'lost the locker room.' Heavy.com reported a star player is 'ready to demand trade unless Mosley is fired.' Bleacher Report's Jake Fischer says Magic will likely part with Mosley regardless of playoff results. Season proof: ORL finished 45-37 (8th seed, play-in) when projected as a top-4 East team — described as 'one long missed opportunity.'",
        sources:["Yardbarker: paolo-banchero-jamahl-mosley-tension","Heavy: orlando-magic-turmoil-signals-likely-end-jamahl-mosley","Athlon: magic-star-ready-to-demand-trade-unless-jamahl-mosley-fired"], verdict:"verified" }
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
      spread: "DET -4.5", moneyline: "DET -200 / ORL +170", ou: "O/U 216.5",
      pick: "ORL", confidence: "medium", projScore: "ORL 108 — DET 104",
      schedule: "Tue Apr 21 — 7:00 PM ET — ESPN",
      reasoning: "MODEL CORRECTION PICK: ORL (medium confidence). G1 was our biggest miss of the playoffs — DET at HIGH confidence lost by 11 at home to #8 ORL. The model now recognizes three structural problems it underweighted: (1) Single-initiator penalty: Cade scored 39 but no one else could create — only Harris (17) joined him in double figures. ORL had 5 players in double figures reflecting multi-initiator depth. (2) Playoff pedigree floor: DET's 11-game home playoff losing streak (0-8 at LCA since 2008) is a franchise culture deficit, not a coincidence. (3) Bickerstaff's panic lineup (Cade/Jenkins/Huerter/Stewart/Duren with ZERO minutes together) showed coaching instability under pressure. Meanwhile, Mosley's A+ tactical performance (WCJ neutralizing Duren, 'let Cade score, kill the rest' strategy) is REPEATABLE because it exploits structural weaknesses. DET's pedigree:0 and single-initiator problem can't be fixed between games. The 2025 backtest showed teams that lost G1 at home as heavy favorites won G2 at only 58% — and DET has additional pedigree/initiator structural deficits that lower that further. Switching to ORL at medium confidence.",
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
    coaching: {
      home: {
        coach: "JB Bickerstaff",
        adjustmentRating: 5,
        playoffRecord: "5-11",
        tendency: "Defense-first, 'win the possession game'. COTY winner. Turned DET from worst to first.",
        rotationPlan: "Shrinks from 10-man to 8-man. Stewart first off bench 20+ MPG. Duncan Robinson key shooter.",
        keyAdjustment: "Cunningham-Duren PnR is primary action. Ausar Thompson as Paolo stopper",
        g1Performance: "D | COTY had his worst coaching performance in a signature game. Three critical failures: (1) Closing lineup panic — used Cunningham/Jenkins/Huerter/Stewart/Duren lineup with ZERO minutes together all season, abandoning proven rotations when it mattered most. (2) Failed to get Duren involved — All-Star was held to 8pts/7reb as WCJ neutralized him, and Bickerstaff had no counter (no post-ups, no PnR variations to free him). (3) No answer for ORL's 18-5 opening run — the first timeout came too late and adjustments after were ineffective. DET's bench shot 4-16 (20pts) reflecting a total system breakdown beyond the starting 5. Bickerstaff's pre-series quote about a 'war of attrition' suggested physical play, but ORL won with skill and depth instead. The franchise's 11-game home playoff losing streak now includes Bickerstaff's first entry."
      },
      away: {
        coach: "Jamahl Mosley",
        adjustmentRating: 7,
        playoffRecord: "8-8",
        tendency: "Defensive identity. Switchable lineups. Methodical half-court offense.",
        rotationPlan: "8-man rotation. Bane replaces Carter Jr. in closing if offense stalls. Bitadze backup C.",
        keyAdjustment: "Paolo as primary creator with Franz as secondary — slow pace to limit DET transition",
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
    games: [{num:1,result:"L",homeScore:101,awayScore:112,winner:"ORL",notes:"UPSET — #8 ORL wins at #1 DET. Cade 39pts career-high (13-27 FG, 3-8 3PT) but only Harris (17) joined him in double figures. DET bench 20pts on 4-16. Duren shut down: 8pts, 7reb — WCJ dominated matchup. ORL led wire-to-wire, 18-5 start. Banchero 23pts (8-15), 9reb, 4ast. Wagner 19pts (11 in Q4 closer). Bane 17pts, Suggs 16/5/4/3stl/1blk, WCJ 17/6/5. Five ORL players in double figures. DET 11 straight home playoff losses (0-8 at LCA since 2008). Closing lineup (Cade/Jenkins/Huerter/Stewart/Duren) had ZERO minutes together all season. Model picks: DET ML ❌ (HIGH confidence — WRONG), DET -8.5 ❌ (ORL won by 11)."},{num:2,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "BOS-PHI", conf: "East", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Derrick White", target:"Tyrese Maxey", dLebron:2.324, targetUsg:31.5, note:"G1 VALIDATED: White (D-LEBRON 2.324, Chaser role) held Maxey to 20pts on 8/20 FG. PHI has 1 initiator — White can fully commit to Maxey with no secondary creator to worry about. George's 4.8 clutch rating means he doesn't take pressure off Maxey. This is the bracket's most impactful defensive matchup." },
      awayDefOnHome: { defender:"VJ Edgecombe", target:"Jaylen Brown", dLebron:0.08, targetUsg:31.0, note:"Rookie (D-LEBRON 0.08) vs Finals MVP (28.7 PPG). Massive mismatch. Brown has Tatum, White, Pritchard as co-creators (3 initiators) — even if Edgecombe slows Brown slightly, BOS has endless alternatives. G1 CONFIRMED: Brown scored 26 pts including 16 in Q3 (7-of-9)." }
    },
    homeTeam: {
      name: "Celtics", city: "Boston", abbr: "BOS", seed: 2, record: "56-26",
      systemBonus: 2.0, // elite system
      playoffPedigree: 2, // 2024 champs
      offStyle: "Five-out motion with Brown/Tatum dual star creation. Multiple secondary initiators (White, Pritchard). Best off-ball environment in the league.", initiators: 3,
      color: "#007A33", color2: "#BA9653",
      advStats: { ortg:118.5, drtg:109.2, netRtg:9.3, pace:98.2, ts:59.1, efg:56.4, tov:12.4, reb:51.2, ortgRk:2, drtgRk:4, clutchNetRtg:6.1, last10:"7-3", fgPct:53.4, threePct:38.1, ftPct:80.2, orbPct:25.0 },
      players: [
        { name:"Jaylen Brown", pos:"SG", rating:88, ppg:28.7, rpg:5.8, apg:3.6, fgp:49.2, per:25.8, ts:61.2, epm:5.8, bpm:6.5, ws48:.205, onOff:8.2, clutch:8.0, vorp:4.9, usg:31.0, injury:null, lebron:1.515, oLebron:1.865, dLebron:-0.351, war:6.082, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Led team with Tatum injured. Now the #1 option — 28.7 PPG up from 23.1. Finals MVP. 8.0 clutch rating elite", baseRating:88, starCeiling:1, injuryRisk:0, playoffAscension:1.0 },
        { name:"Jayson Tatum", pos:"SF", rating:85, ppg:21.8, rpg:10.0, apg:5.4, fgp:46.5, per:23.5, ts:59.8, epm:5.2, bpm:6.0, ws48:.188, onOff:7.5, clutch:7.5, vorp:4.1, usg:27.5, injury:"Recently returned from injury", lebron:3.887, oLebron:3.047, dLebron:0.841, war:2.055, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"Injury-affected season — 21.8 PPG down from 27.2. But 10.0 RPG shows impact. May need a game to shake rust", baseRating:91, starCeiling:2, injuryRisk:0.5, playoffAscension:0.8, activeInjury:{type:"Achilles recovery",severity:0.2,note:"G1: 25pts/11reb/7ast — dominant return. Not on injury report. Said he 'feels better than expected.' Only 17 games this season post-Achilles surgery. Conditioning improving but monitor minutes load across series."} },
        { name:"Derrick White", pos:"PG", rating:76, ppg:16.4, rpg:4.2, apg:5.1, fgp:45.8, per:18.2, ts:58.8, epm:3.5, bpm:3.8, ws48:.152, onOff:5.5, clutch:6.8, vorp:3.0, usg:23.8, injury:null, lebron:4.594, oLebron:2.271, dLebron:2.324, war:11.43, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"Elite on-ball D. Held Maxey below average in 2 of 4 meetings. 6.8 clutch rating", baseRating:76 },
        { name:"Payton Pritchard", pos:"PG", rating:73, ppg:17.0, rpg:3.2, apg:4.5, fgp:44.8, per:17.2, ts:59.5, epm:2.2, bpm:2.0, ws48:.128, onOff:3.5, clutch:6.0, vorp:2.0, usg:24.0, injury:null, lebron:1.921, oLebron:2.54, dLebron:-0.618, war:7.008, offRole:"Primary Ball Handler", defRole:"Chaser", injuryRisk:0.2, activeInjury:{type:"plantar fasciitis",severity:0.2,note:"Left foot plantar fasciitis. G1: Played and contributed in 123-91 rout. Chronic condition — tends to flare up with high-intensity play. Low severity but monitor across series."},
          matchupNote:"Starter now! Emerged as key scorer. 42% from 3. Provides spacing and secondary creation", baseRating:73 },
        { name:"Neemias Queta", pos:"C", rating:67, ppg:10.0, rpg:8.0, apg:1.0, fgp:58.2, per:16.5, ts:62.5, epm:1.0, bpm:0.8, ws48:.105, onOff:2.2, clutch:4.5, vorp:1.1, usg:18.8, injury:null, lebron:3.696, oLebron:0.972, dLebron:2.723, war:7.365, offRole:"Roll + Cut Big", defRole:"Anchor Big",
          matchupNote:"Starting center, most improved. 1.3 BPG. Physical rim protector who emerged in expanded role", baseRating:67 },
        { name:"Nikola Vucevic", pos:"C", rating:68, ppg:12.5, rpg:8.5, apg:2.8, fgp:50.8, per:16.8, ts:57.5, epm:1.0, bpm:0.5, ws48:.095, onOff:1.8, clutch:4.8, vorp:1.2, usg:21.2, injury:null, lebron:0.593, oLebron:0.368, dLebron:0.225, war:3.48, offRole:"Versatile Big", defRole:"Mobile Big",
          matchupNote:"Acquired mid-season from CHI. Veteran big. Provides scoring and rebounding depth off bench", baseRating:68 },
        { name:"Sam Hauser", pos:"SF", rating:60, ppg:9.2, rpg:3.1, apg:1.2, fgp:43.5, per:11.2, ts:58.8, epm:0.2, bpm:-0.2, ws48:.065, onOff:0.5, clutch:4.0, vorp:0.5, usg:18.2, injury:null, lebron:0.587, oLebron:0.442, dLebron:0.144, war:3.693, offRole:"Off Screen Shooter", defRole:"Helper",
          matchupNote:"Shooter. 41% from 3. Limited defense but spacing is critical", baseRating:60 },
        { name:"Chris Boucher", pos:"PF", rating:56, ppg:7.5, rpg:4.8, apg:0.8, fgp:46.0, per:14.5, ts:57.5, epm:0.0, bpm:-0.2, ws48:.065, onOff:0.5, clutch:3.8, vorp:0.3, usg:16.5, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:null, defRole:null,
          matchupNote:"Signed Aug 2025 from TOR. Full season with BOS. Athletic stretch-4, 35% from 3. Energy and shot-blocking off bench", baseRating:56 }
      ],
      synergy: [
        { players:["White","Pritchard","Brown","Tatum","Queta"], score:84, note:"Brown as #1 option works. Pritchard's emergence fills Holiday's role. Queta anchors D. ORtg 118.5, DRtg 109.2 together. Championship DNA remains" }
      ]
    },
    awayTeam: {
      name: "76ers", city: "Philadelphia", abbr: "PHI", seed: 7, record: "45-37",
      systemBonus: 0,
      playoffPedigree: 0,
      offStyle: "Without Embiid: post-up anchor gone, offense collapses to Maxey P&R only. One-dimensional and easy to scout (Partnow initiator-loss cascade).", initiators: 1, // Maxey only (Embiid OUT)
      color: "#006BB6", color2: "#ED174C",
      advStats: { ortg:113.2, drtg:112.5, netRtg:0.7, pace:97.8, ts:56.8, efg:53.1, tov:13.5, reb:49.5, ortgRk:16, drtgRk:17, clutchNetRtg:0.8, last10:"5-5", fgPct:50.1, threePct:33.2, ftPct:75.6, orbPct:23.6 },
      players: [
        { name:"Tyrese Maxey", pos:"PG", rating:84, ppg:28.3, rpg:4.1, apg:6.6, fgp:45.5, per:25.2, ts:60.5, epm:5.5, bpm:6.0, ws48:.185, onOff:8.0, clutch:7.8, vorp:4.7, usg:31.5, injury:null, lebron:2.933, oLebron:3.584, dLebron:-0.651, war:8.951, offRole:"Shot Creator", defRole:"Chaser",
          matchupNote:"Star. 30 PPG in 4 games vs BOS. Elite speed. But White held him below average in 2 of 4 meetings", baseRating:84, starCeiling:1, injuryRisk:0 },
        { name:"Joel Embiid", pos:"C", rating:0, ppg:26.9, rpg:7.7, apg:3.9, fgp:49.2, per:29.2, ts:64.5, epm:7.8, bpm:9.0, ws48:.250, onOff:13.2, clutch:8.8, vorp:6.2, usg:33.0, injury:"OUT — post-appendectomy recovery (targeting mid-to-late first round)", lebron:1.736, oLebron:2.452, dLebron:-0.716, war:3.154, offRole:"Shot Creator", defRole:"Anchor Big",
          matchupNote:"Emergency appendectomy Apr 9. OUT G1 (BOS won 123-91). Average recovery 2-5 weeks — hasn't practiced with teammates yet. Coach Nurse preparing without him for 'at least the opening games.' If series reaches G7 (May 2), possible return 23 days post-surgery. Conditioning and rust will severely limit initial impact.", baseRating:92, starCeiling:2, injuryRisk:1.0 },
        { name:"Paul George", pos:"SF", rating:72, ppg:17.3, rpg:5.5, apg:4.5, fgp:44.2, per:17.2, ts:57.5, epm:2.0, bpm:1.8, ws48:.115, onOff:2.2, clutch:4.8, vorp:2.2, usg:24.5, injury:"Returning from 25-game suspension", lebron:1.746, oLebron:1.277, dLebron:0.469, war:2.989, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Returned from 25-game suspension. In 10 games since: 21.0 PPG, 5.7 RPG, 3.3 APG, 41.5% from 3 — looking sharp. 'I've had my share of playing Boston with Jayson and Jaylen, so I know what to expect.' Rating bumped from 68 to 72 reflecting post-suspension form.", baseRating:75 },
        { name:"VJ Edgecombe", pos:"SG", rating:66, ppg:12.5, rpg:3.8, apg:2.5, fgp:44.2, per:14.5, ts:55.8, epm:0.5, bpm:0.2, ws48:.078, onOff:1.2, clutch:4.5, vorp:0.9, usg:21.2, injury:null, lebron:0.001, oLebron:-0.079, dLebron:0.08, war:4.046, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Rookie with 75 GS — breakout. Athletic guard with 6'5 frame. Inconsistent but high ceiling", baseRating:66 },
        { name:"Andre Drummond", age:32, pos:"C", rating:60, ppg:7.5, rpg:8.4, apg:1.2, fgp:54.5, per:14.2, ts:56.5, epm:-0.2, bpm:-0.5, ws48:.068, onOff:-0.5, clutch:3.5, vorp:0.3, usg:16.5, injury:null, lebron:-0.2, oLebron:-0.415, dLebron:0.216, war:1.743, offRole:"Roll + Cut Big", defRole:"Anchor Big",
          matchupNote:"Backup center filling in with Embiid out. Rebounds but limited offense and defense", baseRating:60 },
        { name:"Dominick Barlow", pos:"PF", rating:60, ppg:9.8, rpg:5.2, apg:1.5, fgp:47.5, per:13.5, ts:55.5, epm:0.0, bpm:-0.2, ws48:.065, onOff:0.2, clutch:4.0, vorp:0.6, usg:18.8, injury:null, lebron:-0.903, oLebron:-1.404, dLebron:0.502, war:1.647, offRole:"Athletic Finisher", defRole:"Wing Stopper",
          matchupNote:"59 games started. Athletic PF with length. Still developing but contributes on both ends", baseRating:60 },
        { name:"Quentin Grimes", pos:"SG", rating:54, ppg:8.5, rpg:2.8, apg:2.2, fgp:43.0, per:11.5, ts:55.0, epm:-0.2, bpm:-0.5, ws48:.060, onOff:0.0, clutch:3.8, vorp:0.4, usg:17.5, injury:null, lebron:-1.532, oLebron:-0.421, dLebron:-1.111, war:1.286, offRole:"Movement Shooter", defRole:"Chaser",
          matchupNote:"Versatile wing, can start or come off bench. 37% from 3. Secondary ball-handler", baseRating:54 },
        { name:"Eric Gordon", pos:"SG", rating:52, ppg:7.2, rpg:1.8, apg:1.5, fgp:41.5, per:10.5, ts:55.5, epm:-0.3, bpm:-0.8, ws48:.052, onOff:-0.5, clutch:4.5, vorp:0.2, usg:16.2, injury:null, lebron:null, oLebron:null, dLebron:null, war:null, offRole:null, defRole:null,
          matchupNote:"Signed Jul 2025. Veteran sharpshooter, 37% from 3. Playoff experience (champion with HOU). Spacing off bench", baseRating:52 },
        { name:"Adem Bona", pos:"C", rating:48, ppg:4.8, rpg:4.3, apg:0.5, fgp:58.6, per:12.0, ts:60.0, epm:-0.5, bpm:-1.0, ws48:.060, onOff:-1.0, clutch:2.5, vorp:0.0, usg:14.0, injury:null, lebron:-0.914, oLebron:-2.059, dLebron:1.145, war:1.195, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Athletic backup C behind Drummond/Embiid. Rim runner with energy and shot-blocking", baseRating:48 }
      ],
      synergy: [
        { players:["Maxey","Edgecombe","George","Barlow","Drummond"], score:60, note:"Without Embiid: ORtg drops to 108.4, DRtg balloons to 115.2. Interior collapses. Maxey must score 35+ to have a chance" }
      ]
    },
    externalFactors: [
      { team:"PHI", player:"Joel Embiid", desc:"Emergency appendectomy. Unlikely Game 1, possibly entire first round. Without him: -13.2 on/off swing. Team drops from +0.7 to approx -12.5 NetRtg.", impact:-15, category:"injury" },
      { team:"PHI", player:"Paul George", desc:"25-GAME SUSPENSION (Jan 31). Missed ~6 weeks. Just returned to lineup. Conditioning, rhythm, and team chemistry all disrupted. Compounds 'Playoff P' concerns.", impact:-5, category:"personal",
        evidence:"Basketball-Reference transactions confirm: Paul George suspended 25 games by the league on January 31, 2026. He missed approximately 6 weeks of the season. Just returned to the lineup before playoffs.",
        sources:["Basketball-Reference: basketball-reference.com/leagues/NBA_2026_transactions"], verdict:"verified" },
      { team:"BOS", player:"Jayson Tatum", desc:"Recently returned from injury. Scoring down to 21.8 PPG. May need a game to regain rhythm. Brown stepped up as #1.", impact:-3, category:"injury" },
      { team:"PHI", player:null, desc:"Haven't eliminated Boston since 1982. 0-6 in last 6 series vs Celtics. Psychological weight is heavy.", impact:-3, category:"motivation" },
      { team:"BOS", player:null, desc:"Championship core evolved — Brown as #1 works. +6.1 clutch NetRtg. Know how to win in the playoffs. TD Garden is hostile.", impact:5, category:"motivation" }
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
      pick: "BOS", confidence: "high", projScore: "BOS 114 — PHI 95",
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
    coaching: {
      home: {
        coach: "Joe Mazzulla",
        adjustmentRating: 8,
        playoffRecord: "20-4",
        tendency: "Championship pedigree. Five-out offense. Willing to go small with Brown at nominal C. Adaptive in-series.",
        rotationPlan: "8-man rotation. Vucevic/Queta matchup-dependent. Hauser as floor-spacer.",
        keyAdjustment: "Small-ball lineups with no traditional center if PHI goes big with Drummond",
        g1Performance: "A+ | 4-0 in Game 1s as head coach (2023: W vs ATL, 2024: W vs MIA, 2025: W vs ORL, 2026: W vs PHI). Masterclass game plan: White assigned to Maxey full-time (held him to 8-20), Brown unleashed as #1 scorer (26pts, 7-9 in Q3), Tatum seamlessly reintegrated after Achilles return (25/11/7). Ran deep 8-man rotation with 6 players scoring 10+ — never needed to shorten rotation because the game was over by halftime. Kept starters in just long enough to build insurmountable lead, then rested them. Mazzulla's five-out spacing forced PHI to defend the arc where they went 4-23 (17.4%). No adjustments needed — the pre-game plan was executed perfectly."
      },
      away: {
        coach: "Nick Nurse",
        adjustmentRating: 8,
        playoffRecord: "20-18",
        tendency: "Aggressive player usage. Stacks non-Maxey lineups with quality offense. Wing defense always on floor.",
        rotationPlan: "8-man rotation without Embiid. Drummond/Bona at C. Maxey 40+ MPG.",
        keyAdjustment: "Maxey at 35%+ usage. Edgecombe as defensive disruptor off bench",
        g1Performance: "D | Nurse had no answer for Boston's five-out spacing. PHI went 4-of-23 from 3PT (17.4%) — a schematic failure as much as a shooting one. No counter for White's full-time assignment on Maxey. Drummond starting at C was predictably overwhelmed. Nurse's trademark aggressive usage worked against him: Maxey played heavy minutes but was stifled, and the supporting cast had no system to generate quality looks without Maxey creating. George (suspension-return rust) looked disconnected. No visible in-game adjustments as the deficit ballooned. Limited by roster rather than tactics, but failed to find any creative solutions."
      },
      bestLineups: {
        home: { players: ["Brown","Tatum","White","Pritchard","Vucevic"], netRtg:9.2, ortg:121.5, drtg:112.3, min:420, note:"Core starting 5 — elite offense" },
        away: { players: ["Maxey","Edgecombe","PG","Grimes","Drummond"], netRtg:1.8, ortg:112.0, drtg:110.2, min:180, note:"Best lineup without Embiid" }
      },
      roleChanges: [
        { team:"BOS", player:"Tatum", regSeason:"Co-star, 34 MPG", playoff:"36+ MPG. Mazzulla will feature him in matchup hunting vs PHI's weak spots", impact:"up", reason:"Championship experience drives expanded role" },
        { team:"BOS", player:"Vucevic", regSeason:"Starting C, 28 MPG", playoff:"Matchup-dependent. May lose minutes to small-ball lineups", impact:"down", reason:"Mazzulla willing to bench traditional C" },
        { team:"PHI", player:"Maxey", regSeason:"Primary scorer, 36 MPG", playoff:"40+ MPG, 35%+ usage. Everything runs through him without Embiid", impact:"up", reason:"Nurse pushes stars hard in playoffs" },
        { team:"PHI", player:"Drummond", regSeason:"Backup C behind Embiid", playoff:"Starting C, 28+ MPG. Must anchor defense", impact:"up", reason:"Embiid appendectomy forces starting role" },
        { team:"PHI", player:"Edgecombe", regSeason:"Bench wing, 18 MPG", playoff:"Defensive disruptor, 24+ MPG", impact:"up", reason:"Nurse values his two-way energy" }
      ]
    },
    games: [{num:1,result:"W",homeScore:123,awayScore:91,winner:"BOS",notes:"32-pt blowout. Tatum 25/11/7 in return from Achilles. Brown 26 pts (7-9 Q3). 6 BOS players scored 10+. BOS shot 50% FG, 11 3PM. PHI 4-23 from 3 (17.4%, 2nd worst franchise playoff history). Maxey 20 pts on 8-20, White's D stifled him. Wire-to-wire. Model projected BOS 112-98 (margin 14); actual margin 32. Model picks: BOS ML ✅, BOS -12.5 ✅ (+19.5 margin), Under 211.5 ❌ (actual 214), Brown O25.5 ✅ (26), Maxey O26.5 ❌ (20)."},{num:2,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "NYK-ATL", conf: "East", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Mikal Bridges", target:"Nickeil Alexander-Walker", dLebron:0.896, targetUsg:26.5, note:"Bridges' POA defense (D-LEBRON 0.896) on NAW. Bridges' length and lateral quickness disrupt NAW's scoring rhythm. ATL has 2 initiators (NAW + McCollum), so NAW isn't the sole option — McCollum can create independently. G1: OG Anunoby was actually NYK's most impactful defender (+20.8% WPA)." },
      awayDefOnHome: { defender:"Dyson Daniels", target:"Jalen Brunson", dLebron:1.907, targetUsg:29.8, note:"Daniels (MIP, steals leader, D-LEBRON 1.907) on Brunson is a marquee matchup. Daniels' length and ball-hawking ability can disrupt Brunson's P&R reads. NYK has 2 initiators (Brunson + secondary from Bridges/OG). G1: Daniels had 11ast/9reb/3stl but was LVP by WPA (-13.0%) — his defense didn't translate to suppressing Brunson (28pts)." }
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
        { name:"Mikal Bridges", pos:"SF", rating:72, ppg:14.4, rpg:4.1, apg:3.2, fgp:46.2, per:15.5, ts:57.2, epm:1.5, bpm:1.2, ws48:.105, onOff:2.8, clutch:5.2, vorp:1.6, usg:22.5, injury:null, lebron:2.232, oLebron:1.336, dLebron:0.896, war:7.898, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"Ironman wing. 82 games started. Defensive versatility across 1-3", baseRating:72 },
        { name:"Josh Hart", pos:"SG", rating:68, ppg:12.0, rpg:8.2, apg:4.2, fgp:44.8, per:14.8, ts:56.2, epm:1.2, bpm:1.0, ws48:.092, onOff:3.0, clutch:6.2, vorp:1.4, usg:20.8, injury:null, lebron:1.317, oLebron:0.271, dLebron:1.046, war:4.718, offRole:"Stationary Shooter", defRole:"Wing Stopper",
          matchupNote:"Hustle engine. 8.2 RPG from guard spot. 6.2 clutch rating. Won't shrink", baseRating:68 },
        { name:"Miles McBride", pos:"SG", rating:62, ppg:12.0, rpg:2.4, apg:2.6, fgp:42.3, per:14.0, ts:58.0, epm:0.8, bpm:0.5, ws48:.090, onOff:2.0, clutch:5.5, vorp:1.0, usg:20.8, injury:null, lebron:0.971, oLebron:1.331, dLebron:-0.36, war:2.323, offRole:"Secondary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Elite 3PT shooter (41.3%), tenacious defender. Key 6th man role at MSG", baseRating:62 },
        { name:"Mitchell Robinson", pos:"C", rating:56, ppg:5.7, rpg:8.8, apg:0.9, fgp:72.3, per:16.0, ts:68.0, epm:0.5, bpm:0.5, ws48:.110, onOff:1.5, clutch:3.0, vorp:0.7, usg:14.5, injury:null, lebron:2.234, oLebron:0.646, dLebron:1.588, war:3.447, offRole:"Athletic Finisher", defRole:"Mobile Big",
          matchupNote:"Elite offensive rebounder and rim protector. Backup to Towns. 1.2 BPG", baseRating:56 },
        { name:"Jeremy Sochan", pos:"PF", rating:60, ppg:8.5, rpg:5.2, apg:2.5, fgp:47.0, per:13.0, ts:55.5, epm:0.2, bpm:0.0, ws48:.068, onOff:0.5, clutch:4.5, vorp:0.6, usg:17.5, injury:null, lebron:-2.423, oLebron:-1.96, dLebron:-0.463, war:0.015, offRole:"Stretch Big", defRole:"Wing Stopper",
          matchupNote:"Signed Feb 13 after SAS waived him. Versatile defender guards 1-4. ~25 games with NYK. Valuable switchability for Brown", baseRating:60 },
        { name:"Guerschon Yabusele", pos:"PF", rating:58, ppg:8.0, rpg:4.5, apg:1.5, fgp:46.5, per:13.5, ts:56.8, epm:0.0, bpm:-0.2, ws48:.062, onOff:0.2, clutch:4.0, vorp:0.4, usg:17.0, injury:null, lebron:-1.214, oLebron:-0.762, dLebron:-0.452, war:0.786, offRole:"Stretch Big", defRole:"Mobile Big",
          matchupNote:"Signed Jul 2025 (full season). Physical stretch-4, 36% from 3. Olympic hero. Provides toughness and spacing off bench", baseRating:58 }
      ],
      synergy: [
        { players:["Brunson","Hart","Bridges","Anunoby","Towns"], score:84, note:"Best 4th-quarter NetRtg in play-by-play era. Brunson 9.2 clutch. Five guys who know their roles. MSG crowd adds 3+ points" },
        { players:["Brunson","McBride","Hart","Anunoby","Robinson"], score:78, note:"Defensive lineup. Robinson rim protection + OG perimeter lockdown. McBride's shooting spaces the floor" }
      ]
    },
    awayTeam: {
      name: "Hawks", city: "Atlanta", abbr: "ATL", seed: 6, record: "46-36",
      systemBonus: 0,
      playoffPedigree: 0,
      offStyle: "Post-Trae dual-initiator system with McCollum/NAW. Less star-dependent, more balanced. Transition offense is key weapon.", initiators: 2,
      color: "#E03A3E", color2: "#C1D32F",
      advStats: { ortg:115.2, drtg:112.8, netRtg:2.4, pace:100.2, ts:57.5, efg:54.1, tov:13.2, reb:49.4, ortgRk:9, drtgRk:16, clutchNetRtg:3.5, last10:"8-2", fgPct:51.1, threePct:34.7, ftPct:77.0, orbPct:23.5 },
      players: [
        { name:"Nickeil Alexander-Walker", pos:"SG", rating:76, ppg:20.8, rpg:4.2, apg:3.5, fgp:44.8, per:18.5, ts:57.8, epm:2.2, bpm:2.0, ws48:.128, onOff:3.5, clutch:5.5, vorp:2.5, usg:26.5, injury:null, lebron:0.219, oLebron:0.582, dLebron:-0.362, war:4.371, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Acquired from MIN — major scorer. 20.8 PPG gives ATL another offensive weapon. Inconsistent defense", baseRating:76 },
        { name:"CJ McCollum", pos:"SG", rating:68, ppg:15.8, rpg:3.5, apg:4.2, fgp:44.2, per:16.5, ts:56.8, epm:1.2, bpm:0.8, ws48:.098, onOff:1.5, clutch:6.0, vorp:1.4, usg:23.2, injury:null, lebron:-0.306, oLebron:0.855, dLebron:-1.161, war:3.054, offRole:"Primary Ball Handler", defRole:"Chaser",
          matchupNote:"Acquired from WAS for Trae Young (Jan 9). Veteran scorer, 38% from 3. ~35 games with ATL. Less creation than Trae but more reliable shooting", baseRating:68 },
        { name:"Corey Kispert", pos:"SF", rating:60, ppg:11.5, rpg:3.2, apg:1.8, fgp:45.5, per:12.8, ts:58.5, epm:0.3, bpm:-0.2, ws48:.072, onOff:0.5, clutch:4.0, vorp:0.8, usg:20.5, injury:null, lebron:-1.005, oLebron:0.283, dLebron:-1.288, war:0.984, offRole:"Off Screen Shooter", defRole:"Helper",
          matchupNote:"Acquired from WAS for Trae Young (Jan 9). 3-point specialist (40.2%). ~35 games with ATL. Spacing off bench", baseRating:60 },
        { name:"Jalen Johnson", pos:"PF", rating:74, ppg:18.2, rpg:7.8, apg:4.2, fgp:50.1, per:19.4, ts:58.8, epm:2.5, bpm:2.8, ws48:.142, onOff:4.5, clutch:5.8, vorp:2.5, usg:25.2, injury:null, lebron:1.244, oLebron:1.059, dLebron:0.185, war:5.876, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Breakout star. Physical two-way. 58.8 TS%. Towns matchup is interesting — can he guard stretch-5s?", baseRating:74 },
        { name:"Buddy Hield", pos:"SG", rating:62, ppg:9.8, rpg:2.8, apg:1.5, fgp:43.5, per:11.8, ts:58.5, epm:0.3, bpm:-0.5, ws48:.068, onOff:0.5, clutch:4.0, vorp:0.5, usg:18.8, injury:null, lebron:-1.33, oLebron:-0.617, dLebron:-0.713, war:0.58, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"Acquired from GSW for Porzingis (Feb 5). Elite 3PT shooter (41.2%). Instant offense off bench. ~25 games with ATL", baseRating:62 },
        { name:"Jonathan Kuminga", pos:"PF", rating:66, ppg:12.5, rpg:4.8, apg:2.0, fgp:49.2, per:15.2, ts:57.5, epm:0.8, bpm:0.5, ws48:.085, onOff:1.0, clutch:4.5, vorp:1.0, usg:21.2, injury:null, lebron:-0.38, oLebron:-0.566, dLebron:0.186, war:1.082, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Acquired from GSW for Porzingis (Feb 5). Athletic forward, explosive finisher. ~25 games with ATL. Closing lineup candidate", baseRating:66 },
        { name:"Dyson Daniels", pos:"SG", rating:72, ppg:12.5, rpg:4.5, apg:3.2, fgp:45.2, per:14.8, ts:55.5, epm:1.5, bpm:1.2, ws48:.098, onOff:3.2, clutch:5.2, vorp:1.5, usg:21.2, injury:null, lebron:2.287, oLebron:0.38, dLebron:1.907, war:7.478, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"76 GS, steals leader, MIP. Elite defender. His length disrupts passing lanes", baseRating:72 },
        { name:"Zaccharie Risacher", pos:"SF", rating:67, ppg:11.5, rpg:4.8, apg:1.8, fgp:45.2, per:13.2, ts:55.8, epm:0.5, bpm:0.2, ws48:.075, onOff:1.2, clutch:4.2, vorp:0.9, usg:20.5, injury:null, lebron:-0.39, oLebron:-0.729, dLebron:0.338, war:1.949, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Sophomore development. Good size and length. Making strides on both ends", baseRating:67 },
        { name:"Onyeka Okongwu", pos:"C", rating:66, ppg:10.8, rpg:7.5, apg:1.5, fgp:58.2, per:17.5, ts:62.2, epm:1.0, bpm:0.8, ws48:.108, onOff:2.5, clutch:4.5, vorp:1.1, usg:19.5, injury:null, lebron:0.853, oLebron:-0.858, dLebron:1.711, war:4.77, offRole:"Stationary Shooter", defRole:"Mobile Big",
          matchupNote:"Athletic rim protector. Physical presence off bench. Lob threat with NAW/McCollum", baseRating:66 },
        { name:"Jock Landale", pos:"C", rating:0, ppg:7.5, rpg:4.8, apg:1.2, fgp:55.5, per:14.0, ts:60.0, epm:0.0, bpm:-0.2, ws48:.068, onOff:0.2, clutch:3.5, vorp:0.4, usg:16.5, injury:"OUT — right ankle sprain (expected May 1)", lebron:0.04, oLebron:0.471, dLebron:-0.431, war:2.36, offRole:"Stretch Big", defRole:"Mobile Big",
          matchupNote:"Acquired from UTA (Feb 5). Backup C, efficient finisher around rim. ~25 games with ATL", baseRating:55 }
      ],
      synergy: [
        { players:["McCollum","NAW","Daniels","Johnson","Okongwu"], score:72, note:"Post-Trae starting 5. McCollum + NAW dual initiators. Only ~35 games together. Okongwu sole rim protector after Porzingis traded to GSW" },
        { players:["NAW","Kispert","Kuminga","Daniels","Okongwu"], score:66, note:"Bench-heavy unit. Kuminga athleticism + Kispert spacing. Hield can sub for instant offense. Limited chemistry (~25 games)" }
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
        sources:["Basketball-Reference: basketball-reference.com/leagues/NBA_2026_transactions"], verdict:"verified" }
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
      pick: "NYK", confidence: "medium", projScore: "NYK 112 — ATL 106",
      schedule: "Mon Apr 20 — 8:00 PM ET — NBC",
      reasoning: "BACKTEST-CALIBRATED PICK: NYK (medium confidence). The 2025 backtest validates this pick through Lesson 3 (System > Talent for individual games, Talent > System for series). NYK's systemBonus (+1.5 for Brown's defense) is a structural edge that ATL (systemBonus: 0) can't match scheme-for-scheme. The bounce-back model gives NYK 77% at home in R1 — the highest tier — but we're keeping medium confidence because Snyder's coaching adjustments (Lesson 2) could qualify that down. Key new factors: (1) Brunson's starCeiling:1 is lower than elite stars, meaning his ceiling game already happened (28pts Q1 explosion), (2) ATL has no players with playoffPedigree, reducing their 'championship DNA' adjustment to zero, (3) The 2025 backtest showed that teams winning G1 by 10+ in R1 went on to win G2 at 82% — NYK's +11 fits this pattern. However, Lesson 1 (HCA decays in later rounds) doesn't apply here since R1 HCA is still 3.0. Snyder's proven coaching (Lesson 2 qualifier) is the main reason this isn't high confidence. Shooting regression from 48% 3PT is expected but NYK's defensive identity is sustainable.",
      g1Adjustments: [
        "SNYDER ADJUSTMENT: 18-18 playoff record, took Jazz deep multiple times. Full game film on Brown's transition D scheme",
        "Quickley game-time decision — Rajakovic: 'We missed Quickley big time.' His return transforms half-court creation",
        "ATL was competitive in 1H (55-57) — G1 collapse was Q3-specific, not a full-game blowout",
        "ATL needs to push pace (5th in NBA vs NYK 25th) — Snyder will scheme for early offense before NYK sets defense",
        "NYK 48% from 3 will regress — but defensive identity is sustainable",
        "Okongwu's 19pts on efficient shooting creates new schematic problems — he's more than a rim-runner now",
        "McCollum 26pts on 55% — veteran scorer who thrives in playoff environments (Portland experience)",
        "COACHING GAP: Brown G1 rated A (halftime transition D adjustment decisive) vs Snyder C (admitted KAT mismatch, no Q3 adjustment). But Snyder historically adjusts well between games."
      ],
      prosHome: ["Brunson MSG playoff aura: 28pts (19 in Q1, 8/10 FG) — trend continues", "Brown's transition D adjustment carries forward — starts G2 with G1 knowledge", "Towns' 2H surge shows dual-star resilience", "Robinson rim protection forced hack-a-Robinson — real defensive impact", "Talent gap at top: Brunson + Towns vs NAW + McCollum is decisive"],
      consHome: ["48% from 3 won't sustain — shooting regression expected", "Towns started 1/6 — cold-start risk persists", "Snyder is a proven playoff coach with full game film now", "Quickley return would significantly boost ATL creation"],
      prosAway: ["SNYDER COACHING: 18-18 playoff record, multiple deep runs with Jazz. Will adjust.", "Quickley potential return transforms half-court offense", "McCollum 26pts on 55% — veteran playoff scorer (Portland pedigree)", "ATL competitive in 1H (55-57) — not a total mismatch", "20-6 post-ASB identity built around pace — if Snyder can force tempo, ATL competes", "J.Johnson 23pts + Okongwu 19pts = multi-dimensional scoring threats"],
      consAway: ["Brunson in Q1 was unanswerable — 8/10 FG defensive failure", "Lost Trae's 11.4 APG — structural creation gap persists even with Quickley", "34.8% Q3 shooting exposed half-court limitations", "NYK defensive identity is sustainable, unlike their shooting"]
    },
    coaching: {
      home: {
        coach: "Mike Brown",
        adjustmentRating: 6,
        playoffRecord: "30-30 (career)",
        tendency: "Defense-oriented, 9-man rotation. NBA Cup winner in first season. Adaptability is key question from SAC experience.",
        rotationPlan: "9-man rotation. Robinson strategic deployment for rim protection. Clarkson over Alvarado.",
        keyAdjustment: "Mitchell Robinson's physicality vs ATL frontcourt — 10.5 RPG, 2.0 BPG vs Hawks this season",
        g1Performance: "A | Decisive halftime adjustment sealed the game — ATL had 18 fast-break points in 1H, near-zero in 2H after Brown installed transition defense scheme. OG Anunoby deployment as two-way weapon was the game's MVP call (+20.8% WPA). Brunson unleashed for 19pts in Q1 (8/10 FG) with play designs that exploited ATL's weak POA defense. Robinson's strategic rim protection forced ATL into hack-a-Robinson territory. Towns' 2H surge (19 of 25pts) managed perfectly — didn't force him when cold in 1H. NYK dominated all four factors (FG +30.9%, FT +7.9%, Reb +2.7%, TOV +9.6%). Brown's first playoff game as NYK coach was a statement."
      },
      away: {
        coach: "Quin Snyder",
        adjustmentRating: 7,
        playoffRecord: "18-19",
        tendency: "Motion offense, tight playoff rotation. Post-Trae era with NAW/McCollum as dual initiators.",
        rotationPlan: "8-man rotation. Daniels/McCollum/NAW/Johnson/Okongwu starting and closing. Kispert/Landale off bench.",
        keyAdjustment: "NAW's career year (20.8 PPG, 40% from 3) as primary scoring threat",
        g1Performance: "C | Admitted post-game that KAT was an unsolved mismatch — not a great look for a coach with 18 playoff wins. Had no answer for Brunson's Q1 explosion (19pts, 8/10 FG). Bench was a disaster: Kuminga 8pts in 27min, Gueye+Vincent 5pts combined. ATL was competitive in 1H (57-55) using fast-break offense, but Snyder had no counter when Brown shut down transition in 2H. Q3 shooting collapsed to 34.8%. Daniels' deployment as primary passer had mixed results (11ast/9reb but -13.0% WPA). McCollum (26pts, 55% FG) and J.Johnson (23pts) showed individual scoring is there — Snyder needs to build a system around them. Has game film now and historically adjusts well between games."
      },
      bestLineups: {
        home: { players: ["Brunson","Bridges","OG","Towns","Hart"], netRtg:8.8, ortg:119.2, drtg:110.4, min:520, note:"Core closing 5 — elite two-way" },
        away: { players: ["NAW","McCollum","Daniels","J.Johnson","Okongwu"], netRtg:5.2, ortg:115.8, drtg:110.6, min:410, note:"Best 5 since McCollum trade (Feb+)" }
      },
      roleChanges: [
        { team:"NYK", player:"Robinson", regSeason:"Bench C, 19 MPG", playoff:"Strategic weapon, 22+ MPG. Deployed for ATL frontcourt matchups", impact:"up", reason:"10.5 RPG and 2.0 BPG vs ATL this season" },
        { team:"NYK", player:"Sochan", regSeason:"Bench forward, 18 MPG", playoff:"Versatile defender, may get 22+ if Hawks go small", impact:"up", reason:"Brown values switchable defenders" },
        { team:"ATL", player:"NAW", regSeason:"Starting guard, 34 MPG", playoff:"Primary scorer in closing, 36+ MPG. Career-best season must translate to playoffs", impact:"up", reason:"20.8 PPG with 40% from 3 is Snyder's weapon" },
        { team:"ATL", player:"Kispert", regSeason:"Bench shooter, 20 MPG", playoff:"May lose minutes to tighter rotation, 15 MPG", impact:"down", reason:"Snyder tightens to 8-man in playoffs" },
        { team:"ATL", player:"Okongwu", regSeason:"Starting C, 30 MPG", playoff:"Must match Towns physically, 32+ MPG", impact:"up", reason:"Only rim protector without Porzingis" }
      ]
    },
    games: [{num:1,result:"NYK",homeScore:113,awayScore:102,winner:"NYK",notes:"Brunson 28pts/5reb/7ast (19 in Q1, 8/10 FG), Towns 25pts/8reb/4ast/3blk (19 in 2H after 1/6 start), OG 19pts, Hart 10pts/14reb. ATL: McCollum 26pts, J.Johnson 23pts, Okongwu 19pts, NAW 17pts, Daniels 4pts/11ast/9reb/3stl (glue guy). ATL bench crisis: Kuminga 8pts/27min, Gueye+Vincent 5pts combined. NYK held ATL (5th-best post-ASB ORtg) to 102. Brown's halftime transition D adjustment decisive — ATL had 18 fast-break pts in 1H, nearly zero in 2H. WPA: MVP OG Anunoby +20.8%, LVP Daniels -13.0%. NYK dominated all four factors: FG +30.9%, FT +7.9%, Reb +2.7%, TOV +9.6%."},{num:2,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  },
  {
    id: "CLE-TOR", conf: "East", round: "R1",
    defMatchups: {
      homeDefOnAway: { defender:"Craig Porter Jr.", target:"Scottie Barnes", dLebron:1.177, targetUsg:25.0, note:"Hidden gem: Porter's D-LEBRON (1.177) as POA defender is CLE's best perimeter defender by advanced metrics. His assignment on Barnes disrupts TOR's primary creator. TOR has 2 initiators (Barnes + Ingram), but Barnes is the hub (5.9 APG)." },
      awayDefOnHome: { defender:"Scottie Barnes", target:"Donovan Mitchell", dLebron:1.914, targetUsg:31.0, note:"Barnes' D-LEBRON (1.914, Wing Stopper) on Mitchell is TOR's best defensive weapon. Barnes has the size, length, and IQ to contest Mitchell's pull-up game. CLE has 3 initiators (Mitchell + Harden + Mobley), heavily diluting the suppression effect — even if Barnes slows Mitchell, Harden orchestrates and Mobley creates." }
    },
    homeTeam: {
      name: "Cavaliers", city: "Cleveland", abbr: "CLE", seed: 4, record: "52-30",
      systemBonus: 1.5, // elite system
      playoffPedigree: 0, // this core hasn't gone deep
      offStyle: "Triple-initiator system: Mitchell ISO/P&R, Garland P&R, Harden creation. Most initiator redundancy in bracket — extremely resilient.", initiators: 3,
      color: "#860038", color2: "#FDBB30",
      advStats: { ortg:117.5, drtg:112.8, netRtg:4.7, pace:98.5, ts:58.8, efg:55.5, tov:12.8, reb:50.5, ortgRk:4, drtgRk:15, clutchNetRtg:5.5, last10:"7-3", fgPct:52.5, threePct:36.8, ftPct:79.6, orbPct:24.4 },
      players: [
        { name:"Donovan Mitchell", pos:"SG", rating:87, ppg:27.9, rpg:4.5, apg:5.8, fgp:47.5, per:22.9, ts:61.2, epm:5.8, bpm:5.1, ws48:.195, onOff:7.5, clutch:8.5, vorp:4.2, usg:31.0, injury:null, lebron:3.426, oLebron:3.7, dLebron:-0.274, war:8.578, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Proven playoff scorer. 8.5 clutch is elite. 61.2 TS%. Alpha scorer role confirmed in G1 (32pts)", baseRating:87, starCeiling:1, injuryRisk:0, playoffAscension:1.0 },
        { name:"James Harden", pos:"PG", rating:80, ppg:20.6, rpg:5.2, apg:8.8, fgp:45.2, per:21.8, ts:63.9, epm:4.0, bpm:4.5, ws48:.162, onOff:5.8, clutch:7.0, vorp:1.3, usg:26.8, injury:null, lebron:2.107, oLebron:3.304, dLebron:-1.197, war:6.967, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"34.2 MPG. Elite playmaker. 59.5 TS%. G1: 22pts/10ast proved complementary role works. Orchestrator beside Mitchell", baseRating:80, starCeiling:1, injuryRisk:0.4, playoffAscension:-0.5 },
        { name:"Evan Mobley", pos:"PF", rating:80, ppg:18.3, rpg:9.1, apg:3.5, fgp:52.5, per:22.2, ts:59.8, epm:4.2, bpm:4.5, ws48:.172, onOff:6.5, clutch:6.5, vorp:3.6, usg:25.0, injury:null, lebron:3.067, oLebron:1.721, dLebron:1.346, war:7.146, offRole:"Shot Creator", defRole:"Mobile Big",
          matchupNote:"Two-way star. 59.8 TS%. Barnes matchup is THE series. +6.5 on/off. Best on both ends", baseRating:80, starCeiling:1, injuryRisk:0 },
        { name:"Jarrett Allen", pos:"C", rating:73, ppg:13.8, rpg:10.5, apg:1.8, fgp:63.2, per:19.8, ts:65.4, epm:2.2, bpm:2.5, ws48:.148, onOff:3.8, clutch:5.2, vorp:2.2, usg:22.0, injury:"GTD — knee tendonitis", lebron:2.134, oLebron:0.939, dLebron:1.195, war:4.365, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"65.4 TS% — elite efficiency. Twin towers with Mobley. Poeltl matchup is physical", baseRating:73, injuryRisk:0.4, activeInjury:{type:"knee tendonitis",severity:0.4,note:"Chronic knee tendonitis. GTD status. Limits vertical explosiveness and rim protection energy over long series."} },
        { name:"Jaylon Tyson", pos:"SF", rating:64, ppg:10.5, rpg:4.2, apg:2.0, fgp:44.8, per:12.8, ts:55.5, epm:0.2, bpm:-0.1, ws48:.072, onOff:0.5, clutch:4.5, vorp:0.7, usg:19.5, injury:null, lebron:0.604, oLebron:0.804, dLebron:-0.2, war:3.414, offRole:"Movement Shooter", defRole:"Chaser",
          matchupNote:"40 GS. Wing depth and 3-point shooting. More minutes with Garland traded to LAC", baseRating:64 },
        { name:"Sam Merrill", pos:"SG", rating:63, ppg:11.2, rpg:2.8, apg:1.8, fgp:44.2, per:13.2, ts:59.2, epm:0.5, bpm:0.2, ws48:.078, onOff:1.0, clutch:5.0, vorp:0.9, usg:20.0, injury:null, lebron:1.289, oLebron:1.567, dLebron:-0.278, war:3.235, offRole:"Movement Shooter", defRole:"Chaser",
          matchupNote:"38 GS. Key rotation player. 42% from 3 provides elite spacing off bench", baseRating:63 },
        { name:"Craig Porter Jr.", pos:"PG", rating:60, ppg:6.5, rpg:2.2, apg:3.1, fgp:46.2, per:13.5, ts:57.8, epm:0.8, bpm:0.5, ws48:.085, onOff:2.5, clutch:5.0, vorp:0.6, usg:16.5, injury:null, lebron:1.802, oLebron:0.626, dLebron:1.177, war:3.062, offRole:"Secondary Ball Handler", defRole:"Point of Attack",
          matchupNote:"LEBRON hidden gem: 1.802 LEBRON / 3.062 WAR despite modest box stats. Elite D-LEBRON (1.177) as Point of Attack defender. CLE's best bench connector by advanced impact", baseRating:60 },
        { name:"Max Strus", pos:"SG", rating:65, ppg:10.8, rpg:3.2, apg:1.5, fgp:43.8, per:13.5, ts:58.5, epm:0.5, bpm:0.2, ws48:.078, onOff:1.2, clutch:5.5, vorp:0.9, usg:19.5, injury:null, lebron:-0.409, oLebron:0.15, dLebron:-0.559, war:0.37, offRole:"Movement Shooter", defRole:"Wing Stopper",
          matchupNote:"G1 WPA MVP (+16.6%) with 24pts — BUT LEBRON says -0.409 / 0.37 WAR season-long. G1 was a massive positive outlier. Expect regression to replacement-level baseline. 40% from 3 but classified as Wing Stopper defensively", baseRating:65 }
      ],
      synergy: [
        { players:["Harden","Mitchell","Mobley","Allen","wing"], score:82, note:"POST-G1 UPDATE: +26.7 NetRtg per 100 in reg season mins CONFIRMED in G1. Mitchell 32, Harden 22/10, Mobley 17/7. Roles sorted naturally — Mitchell alpha, Harden orchestrator. Score upgraded from 72 to 82" },
        { players:["Mitchell","Harden","Tyson","Mobley","Allen"], score:78, note:"Post-Garland rotation. Tyson fills wing minutes with Garland traded to LAC (Feb 4). Harden orchestrates, Mitchell scores. Less guard depth but clearer roles" }
      ]
    },
    awayTeam: {
      name: "Raptors", city: "Toronto", abbr: "TOR", seed: 5, record: "46-36",
      systemBonus: 0,
      playoffPedigree: 0,
      offStyle: "Barnes + Ingram dual creation. Transition offense key secondary weapon. Conventional style overall.", initiators: 2,
      color: "#CE1141", color2: "#000000",
      advStats: { ortg:114.5, drtg:111.2, netRtg:3.3, pace:97.8, ts:57.2, efg:53.8, tov:13.2, reb:50.8, ortgRk:11, drtgRk:11, clutchNetRtg:3.2, last10:"7-3", fgPct:50.8, threePct:34.2, ftPct:76.4, orbPct:24.6 },
      players: [
        { name:"Brandon Ingram", pos:"SF", rating:78, ppg:21.5, rpg:5.6, apg:3.7, fgp:47.8, per:20.5, ts:58.2, epm:2.8, bpm:2.5, ws48:.142, onOff:4.2, clutch:5.8, vorp:2.7, usg:27.0, injury:null, lebron:-0.663, oLebron:0.178, dLebron:-0.841, war:2.931, offRole:"Shot Creator", defRole:"Helper",
          matchupNote:"Traded from NOP — All-Star caliber. 75 GS. Smooth mid-range scorer. Adds creation Toronto lacked", baseRating:78 },
        { name:"RJ Barrett", pos:"SF", rating:74, ppg:19.1, rpg:5.5, apg:4.5, fgp:47.0, per:18.2, ts:57.2, epm:2.0, bpm:1.8, ws48:.125, onOff:3.5, clutch:5.5, vorp:2.2, usg:25.5, injury:null, lebron:1.195, oLebron:1.229, dLebron:-0.034, war:3.953, offRole:"Movement Shooter", defRole:"Helper",
          matchupNote:"Physical scorer. 57.2 TS%. G1: 24pts showed up individually. Drives aggressively", baseRating:74 },
        { name:"Scottie Barnes", pos:"PF", rating:80, ppg:18.1, rpg:7.5, apg:5.9, fgp:49.2, per:20.8, ts:57.8, epm:3.8, bpm:4.0, ws48:.158, onOff:6.2, clutch:6.5, vorp:3.2, usg:25.0, injury:null, lebron:2.995, oLebron:1.081, dLebron:1.914, war:9.119, offRole:"Shot Creator", defRole:"Wing Stopper",
          matchupNote:"18.1 PPG (down from 23.5) but 78 GS, 7.5 RPG, 5.9 APG. +6.2 on/off. Mobley matchup is THE series. Versatile creator", baseRating:80, starCeiling:1, injuryRisk:0 },
        { name:"Immanuel Quickley", pos:"PG", rating:0, ppg:16.4, rpg:3.5, apg:6.1, fgp:44.8, per:16.2, ts:57.2, epm:1.5, bpm:1.2, ws48:.102, onOff:2.5, clutch:5.8, vorp:1.6, usg:23.8, injury:"Right hamstring strain — OUT G1, day-to-day for G2", lebron:2.276, oLebron:1.969, dLebron:0.307, war:6.608, offRole:"Primary Ball Handler", defRole:"Point of Attack", activeInjury:{type:"right hamstring strain",severity:0.5,note:"Strained hamstring in regular-season finale vs BKN. OUT G1. Rajakovic says 'making progress' and didn't rule out G2 return (Mon Apr 20). Missed G1 — team was 'missing him big time' per coach. 16.4 PPG, 5.9 APG as starting PG."},
          matchupNote:"OUT Game 1. Jamal Shead started in his place (17pts, 5 3s). Day-to-day for G2 — Rajakovic didn't rule him out", baseRating:71 },
        { name:"Jakob Poeltl", pos:"C", rating:68, ppg:12.8, rpg:9.5, apg:2.5, fgp:57.8, per:17.5, ts:60.2, epm:1.2, bpm:1.0, ws48:.112, onOff:2.8, clutch:4.5, vorp:1.2, usg:21.5, injury:null, lebron:-0.18, oLebron:-1.097, dLebron:0.917, war:1.641, offRole:"Roll + Cut Big", defRole:"Mobile Big",
          matchupNote:"Physical big. Allen matchup is a war. Both efficient finishers", baseRating:68 },
        { name:"Gradey Dick", pos:"SG", rating:67, ppg:14.2, rpg:3.1, apg:2.8, fgp:44.5, per:14.5, ts:58.8, epm:0.8, bpm:0.5, ws48:.082, onOff:1.5, clutch:5.2, vorp:1.0, usg:22.5, injury:null, lebron:-2.484, oLebron:-1.8, dLebron:-0.684, war:-0.007, offRole:"Movement Shooter", defRole:"Low Activity",
          matchupNote:"Sharpshooter. 41.2% from 3. Spacing critical vs CLE twin towers. Must hit shots", baseRating:67 },
        { name:"Jamal Shead", pos:"PG", rating:62, ppg:8.5, rpg:2.5, apg:4.8, fgp:43.2, per:12.2, ts:53.8, epm:0.2, bpm:-0.2, ws48:.068, onOff:0.5, clutch:4.8, vorp:0.5, usg:17.5, injury:null, lebron:0.156, oLebron:-0.117, dLebron:0.273, war:3.037, offRole:"Primary Ball Handler", defRole:"Point of Attack",
          matchupNote:"Backup PG who started G1. Had 17pts on 6/11 (5 3s) — solid but not Quickley-level creation", baseRating:62 },
        { name:"Ja'Kobe Walter", pos:"SG", rating:50, ppg:6.0, rpg:2.0, apg:1.0, fgp:41.0, per:9.5, ts:54.0, epm:-0.8, bpm:-1.2, ws48:.048, onOff:-0.8, clutch:3.0, vorp:0.0, usg:15.5, injury:null, lebron:-0.758, oLebron:-0.994, dLebron:0.235, war:1.57, offRole:"Movement Shooter", defRole:"Point of Attack",
          matchupNote:"Sophomore wing, 40.1% from 3PT. Provides shooting off bench in small-ball lineups", baseRating:50 },
        { name:"Sandro Mamukelashvili", pos:"PF", rating:48, ppg:5.5, rpg:3.8, apg:1.0, fgp:47.5, per:11.0, ts:55.0, epm:-0.5, bpm:-0.8, ws48:.052, onOff:-0.5, clutch:3.0, vorp:0.1, usg:15.0, injury:null, lebron:1.566, oLebron:1.156, dLebron:0.41, war:4.414, offRole:"Stationary Shooter", defRole:"Mobile Big",
          matchupNote:"Signed Jul 2025. Full season with TOR. Stretch big off bench, 36% from 3. Spot minutes depth", baseRating:48 }
      ],
      synergy: [
        { players:["Quickley","Dick","Barrett","Barnes","Poeltl"], score:76, note:"Established chemistry > CLE's new-look squad. Barnes as hub. Ingram+Barrett provide scoring. Dick spaces for drives. Well-rehearsed system" }
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
      { team:"TOR", player:"Immanuel Quickley", desc:"OUT Game 1 with right hamstring strain. Toronto lost their starting PG — a factor the model completely missed.", impact:-6, category:"injury",
        evidence:"POST-GAME 1 ADDITION: ESPN confirmed Quickley ruled out pre-game with mild right hamstring strain. Jamal Shead started instead — had 17pts on 6/11 (5 threes), a solid performance, but the disruption to Toronto's established chemistry was significant. MODEL LESSON: I had zero injury probability built in for the 'chemistry team' — their biggest advantage (continuity) was fragile.",
        sources:["ESPN: espn.com/nba/story/_/id/48522217/raptors-quickley-hamstring"], verdict:"verified" }
    ],
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
      pick: "CLE", confidence: "high", projScore: "CLE 115 — TOR 108",
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
    coaching: {
      home: {
        coach: "Kenny Atkinson",
        adjustmentRating: 7,
        playoffRecord: "4-4 (swept MIA R1 2025, lost to IND 1-4 R2 2025). NBCA Coach of the Year 2025.",
        tendency: "Development-focused but defense-drives-rotation. 9-man rotation. 41 different starting lineups this season — extreme adaptability. CLE 21-6 since Harden trade. Atkinson's system absorbed mid-season star acquisition seamlessly.",
        rotationPlan: "Mitchell/Harden in mid-30s MPG. Strus as 6th man (proved in G1: 24pts). Merrill for shooting. Tyson for wing defense. Allen health determines 9th/10th man.",
        keyAdjustment: "Harden as floor general — slows game, creates for others. G1 CONFIRMED: Harden defers to Mitchell as alpha, organizes offense. Atkinson designed late-game sets specifically for Harden's playmaking (replaced Garland's -3.0 per 100 with Harden's +5.8 on/off).",
        g1Performance: "A | Masterclass game plan execution. Held TOR to just 1 fast-break point — TOR is the league leader in transition offense, and Atkinson completely neutralized their identity. Paint dominance (48-30) was schematic, not accidental — CLE's size advantage was weaponized. 36-22 Q3 run broke the game open after a competitive first half (down only 7 at half from TOR's perspective). Mitchell-Harden roles perfectly defined (32pts scorer + 22/10ast orchestrator). Strus deployment off bench (24pts on 8-10 FG) was the dagger — COTY-caliber bench management. Forced 18 TOR turnovers for 22 CLE points. Held TOR below 110 for first time all season. Only minor concern: allowed TOR to stay within 7 at half before pulling away."
      },
      away: {
        coach: "Darko Rajakovic",
        adjustmentRating: 5,
        playoffRecord: "0-1",
        tendency: "Switchable defense, transition offense. First European-born coach in NBA playoffs. Barnes and Ingram as dual stars.",
        rotationPlan: "9-man rotation. Shead starts at PG with Quickley OUT. Walter off bench.",
        keyAdjustment: "Barnes as defensive QB — switching everything. Ingram as half-court scorer",
        g1Performance: "D+ | First playoff game as HC was a harsh education. TOR's identity (transition offense, league-best) was completely shut down — held to 1 fast-break point, exposing Rajakovic's inability to pivot when Plan A fails. 18 turnovers were a coaching failure in game prep and ball security emphasis. Poeltl was invisible (4pts/6reb) — Rajakovic didn't adjust his role or matchup. Paint was dominated 48-30. Positives: Shead's debut (17pts, 5 3s) was a bright spot, and TOR was competitive through halftime (down 7). But Q3 collapse (outscored 36-22) showed no halftime adjustments. Rajakovic admitted post-game they 'missed Quickley big time' — without his primary PG, the half-court offense had no answers. First-time coaches historically improve most G1→G2."
      },
      bestLineups: {
        home: { players: ["Mitchell","Harden","Mobley","Allen","Merrill"], netRtg:11.2, ortg:120.8, drtg:109.6, min:200, note:"Core lineup +52 in ~200 possessions" },
        away: { players: ["Shead","Barrett","Ingram","Barnes","Poeltl"], netRtg:4.8, ortg:114.5, drtg:109.7, min:280, note:"Lineup with Shead replacing injured Quickley" }
      },
      roleChanges: [
        { team:"CLE", player:"Harden", regSeason:"Acquired mid-season, co-creator", playoff:"Secondary ball-handler, 34+ MPG. Allows Mitchell to play off-ball", impact:"same", reason:"Atkinson using Harden's playmaking to unlock Mitchell" },
        { team:"CLE", player:"Tyson", regSeason:"Bench wing, 16 MPG", playoff:"May crack rotation as 9th man for defense, 18+ MPG", impact:"up", reason:"Atkinson subtly opened the door" },
        { team:"TOR", player:"Shead", regSeason:"Bench PG behind Quickley", playoff:"Starting PG, 32+ MPG. Must run the show", impact:"up", reason:"Quickley OUT forces starting role" },
        { team:"TOR", player:"Barnes", regSeason:"All-Star forward, 34 MPG", playoff:"Defensive QB + scorer, 38+ MPG. Must guard Mitchell", impact:"up", reason:"Rajakovic's most switchable player" },
        { team:"TOR", player:"Ingram", regSeason:"Primary scorer, 34 MPG", playoff:"Half-court engine, 36+ MPG. Must create in halfcourt vs elite CLE defense", impact:"up", reason:"Acquired to be playoff creator — this is his moment" }
      ]
    },
    games: [{num:1,result:"CLE",homeScore:126,awayScore:113,winner:"CLE",notes:"Mitchell 32pts (11/20 FG), Harden 22/10ast, Strus 24 off bench, Mobley 17/7. CLE dominated paint 48-30. TOR held to 1 fast-break point (league leader in transition). TOR: Barrett 24, Barnes 21/7ast, Ingram 17, Shead 17 (5 3s). Quickley OUT hamstring. Poeltl no-show 4pts/6reb. TOR 18 turnovers → 22 CLE points. CLE held TOR below 110 for first time all season (59 second-half pts). CLE 36-22 Q3 run broke it open. WPA: MVP Strus +16.6%, LVP Barnes -7.6%. Rebounds were CLE's biggest edge (+14.7% WPA, matching paint dominance 48-30). FG +19.4%, FT +7.7%, TOV +7.0%."},{num:2,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:3,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:4,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:5,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:6,result:null,homeScore:null,awayScore:null,winner:null,notes:""},{num:7,result:null,homeScore:null,awayScore:null,winner:null,notes:""}]
  }
];
