// ============================================================
// HISTORICAL WITHOUT-STAR DATA (2025-26 Regular Season + 2025 Playoffs)
// Sources cited per entry. Used to calibrate scenario builder predictions.
// ============================================================
const HISTORICAL_WITHOUT = {
  "HOU": {
    "Kevin Durant": {
      record: "~8-2 (last 10, most without KD)", winPct: .800, netRtgSwing: -3.5,
      stepUp: "Sengun becomes focal point (19pts in G1). Thompson and Sheppard each scored 17pts. Sheppard runs more PnR.",
      coachAdj: "Udoka deploys 5-out offense around Sengun. Thompson slides to primary wing scorer. Eason gets 24+ MPG for defensive versatility.",
      playoffNote: "2025: KD missed playoff games with PHX — Suns went 1-3 without him in R2 vs OKC.",
      sources: ["SI: si.com/nba/rockets/onsi/news", "DreamShake: thedreamshake.com"]
    }
  },
  "LAL": {
    "Luka Doncic": {
      record: "3-2 (without Doncic+Reaves)", winPct: .600, netRtgSwing: -10.2,
      stepUp: "LeBron 24.0/9.7/6.0 as primary. Smart becomes secondary playmaker. Kennard critical spacing (44.3% from 3).",
      coachAdj: "Redick: 'Elevate — role players must step up.' Committee offense, LeBron usage spikes to 35%. Multiple actions beyond iso. Focus on turnovers and boxing out.",
      playoffNote: "Redick's first playoff run. 'Survive and extend until backcourt returns.' Lakers went 3-1 with LeBron as focal point.",
      sources: ["Yardbarker: lakers-mindset-without-doncic-reaves", "SI: jj-redick-lakers-plan", "ESPN: redick-playoff-prep"]
    },
    "Austin Reaves": {
      record: "3-2 (same stretch as Doncic)", winPct: .600, netRtgSwing: -5.1,
      stepUp: "Smart takes over ball-handling duties. D'Angelo Russell gets more creation minutes. Kennard spacing essential.",
      coachAdj: "Redick shifts to half-court sets. Less transition offense without Reaves' pushing ability.",
      playoffNote: "Combined Doncic+Reaves absence = 56.8 PPG missing. Lakers optimistic about eventual return but no timeline.",
      sources: ["NBA.com: lakers-without-doncic-reaves", "Fox Sports: lakers-hope-playoffs"]
    },
    "LeBron James": {
      record: "0-3 (est. without all 3 stars)", winPct: .000, netRtgSwing: -18.0,
      stepUp: "Nobody. Smart/Hachimura/Ayton lack creation ability for primary roles. Effective G-League roster.",
      coachAdj: "Redick would have no real offensive engine. Pure survival mode.",
      playoffNote: "LeBron at 41 played through foot pain all season. If he goes down, series is effectively over.",
      sources: ["SI: lebron-james-primary-role-lakers"]
    }
  },
  "OKC": {
    "Shai Gilgeous-Alexander": {
      record: "~8-4 (est.)", winPct: .667, netRtgSwing: -6.5,
      stepUp: "Jalen Williams becomes primary scorer (24+ PPG). Caruso/Dort defensive identity holds. McCain shooting keeps spacing.",
      coachAdj: "Daigneault's 11-12 man rotation absorbs absences better than any team. System over stars. Won 64 games despite SGA/Williams/Chet all missing time.",
      playoffNote: "2025: SGA averaged 30 PPG in championship run, Finals MVP. OKC swept Memphis, beat DEN 4-3 (Game 7: 125-93), beat MIN 4-1, beat IND 4-3.",
      sources: ["SI Thunder: fringe-rotational-players", "CBS Sports: 2025-nba-playoff-bracket"]
    },
    "Chet Holmgren": {
      record: "~6-3 (est.)", winPct: .667, netRtgSwing: -4.0,
      stepUp: "Hartenstein fills starting C minutes. Jaylin Williams provides frontcourt depth.",
      coachAdj: "Daigneault shrinks to 10-man rotation. More small-ball looks with Williams at 4.",
      playoffNote: "2025: Chet missed significant time with injury — OKC still won the championship. System depth proved championship-caliber.",
      sources: ["Roundtable.io: thunder-playoff-rotation"]
    }
  },
  "PHX": {
    "Devin Booker": {
      record: "~4-8 (est.)", winPct: .333, netRtgSwing: -9.0,
      stepUp: "Brooks becomes primary scorer but efficiency drops. Green/Williams lack shot creation.",
      coachAdj: "Jordan Ott (first-year HC) has limited playoff experience. Offense becomes stagnant without Booker's gravity.",
      playoffNote: "2025: Booker/KD Suns lost to OKC 4-2 in R2. PHX completely rebuilt around young core after.",
      sources: ["ESPN: suns-2025-26-season"]
    }
  },
  "DEN": {
    "Nikola Jokic": {
      record: "6-3", winPct: .667, netRtgSwing: -15.0,
      stepUp: "Murray becomes primary. C. Johnson provides wing scoring. Valanciunas fills center minutes but massive creation gap.",
      coachAdj: "David Adelman (promoted from interim) ran zone defense effectively in 2025 playoffs without full roster. 6-man rotation survived vs LAC.",
      playoffNote: "2025: Adelman (interim) beat LAC, nearly beat OKC in R2 (lost Game 7 125-93). Jokic historically +20.0 per 100 possessions on/off.",
      sources: ["PoundingTheRock: young-coaches-trend", "CBS Sports: nba-coach-rankings"]
    },
    "Jamal Murray": {
      record: "~10-6 (est.)", winPct: .625, netRtgSwing: -4.5,
      stepUp: "C. Johnson slides to backcourt creation. Braun handles more. Watson (when healthy) provides bench scoring.",
      coachAdj: "Adelman runs more Jokic-centric sets. Post-up frequency increases 40% without Murray's PnR.",
      playoffNote: "2025: Murray was inconsistent in playoffs. DEN's system doesn't crater without him as long as Jokic plays.",
      sources: ["ESPN: nuggets-playoff-preview"]
    }
  },
  "MIN": {
    "Anthony Edwards": {
      record: "~5-7 (est.)", winPct: .417, netRtgSwing: -9.5,
      stepUp: "Randle becomes primary scorer. DiVincenzo/Dosunmu provide guard scoring. Gobert defensive anchor.",
      coachAdj: "Finch shifts to defensive identity. Pace slows. Post-up frequency for Randle/Gobert increases.",
      playoffNote: "2025: Edwards scored 43pts (G1 vs DEN) and 44pts (G4). Lost to OKC 4-1 in WCF. Finch inserted Shannon Jr. into lineup when down 0-2 — bold but unsuccessful.",
      sources: ["ZoneCoverage: finch-outside-the-box", "DunkingWithWolves: edwards-playoff-shift", "ESPN: edwards-wolves-flip-switch"]
    },
    "Rudy Gobert": {
      record: "~4-6 (est.)", winPct: .400, netRtgSwing: -8.0,
      stepUp: "Naz Reid fills starting C but rim protection craters. Randle plays more small-ball 5.",
      coachAdj: "Finch goes to more switching schemes without Gobert's drop coverage anchor. Perimeter D emphasis.",
      playoffNote: "2025: Gobert was key to MIN's defense in WCF run. Without him, opponent paint scoring spikes 12+ PPG.",
      sources: ["ESPN: timberwolves-playoff-2025"]
    }
  },
  "SAS": {
    "Victor Wembanyama": {
      record: "~3-9 (est.)", winPct: .250, netRtgSwing: -14.0,
      stepUp: "Fox becomes sole star. Castle/Vassell provide wing scoring. Olynyk fills C minutes but massive size gap.",
      coachAdj: "Mitch Johnson must reinvent offense entirely. Without Wemby's rim protection, defense collapses.",
      playoffNote: "SAS was a lottery team in 2024-25. Wemby IS the team — without him they're a sub-.500 squad.",
      sources: ["ESPN: spurs-wembanyama-impact"]
    }
  },
  "POR": {
    "Jrue Holiday": {
      record: "~3-8 (est.)", winPct: .273, netRtgSwing: -6.5,
      stepUp: "Henderson becomes starting PG. Avdija's creation burden increases further. Sharpe and Grant absorb more usage.",
      coachAdj: "Tiago Splitter (interim) would lose his best defender and veteran stabilizer. Already coaching through scandal disruption — losing Holiday would be devastating for locker room leadership.",
      playoffNote: "Holiday has championship experience (MIL 2021). Without him, POR's backcourt becomes Henderson/Sharpe — explosive but extremely young and turnover-prone.",
      sources: ["NBA.com: blazers-roster", "Heavy.com: lillard-injury-timeline"]
    }
  },
  "NYK": {
    "Jalen Brunson": {
      record: "3-5", winPct: .375, netRtgSwing: -8.5,
      stepUp: "KAT averaged 26+ PPG, OG Anunoby 21.6/5.0/2.6. But Bridges inconsistent as lead creator ('soft 19 pts' in DET blowout).",
      coachAdj: "Brown shifts to Towns-centric post offense. McBride/Bridges handle ball more but creation gap is massive. Half-court offense stagnates without Brunson's PnR.",
      playoffNote: "2025: Brunson played through injuries vs Celtics in ECSF. Knicks beat BOS in 6 (Tatum Achilles). Brunson IS the playoff engine — 8 career 40-pt playoff games.",
      sources: ["StatMuse: knicks-record-without-brunson", "DailyKnicks: offensive-woes-without-brunson", "KnicksXFactor: groove-without-brunson"]
    },
    "Karl-Anthony Towns": {
      record: "0-1 (tiny sample)", winPct: .000, netRtgSwing: -7.0,
      stepUp: "Robinson slides to starting C. Yabusele at PF. Interior scoring and rebounding crater. Lost to DET 118-80 without KAT+OG.",
      coachAdj: "Brown goes small-ball heavy. Sochan at 4, Bridges at 3. Defensive rebounding becomes massive liability.",
      playoffNote: "Towns played 74+ games this season. Without him, NYK loses stretch-5 spacing that opens Brunson's drives.",
      sources: ["Knicks.City: blown-out-without-kat-og-detroit"]
    }
  },
  "ATL": {
    "Nickeil Alexander-Walker": {
      record: "~5-5 (est.)", winPct: .500, netRtgSwing: -5.0,
      stepUp: "McCollum becomes primary scorer. Daniels takes over playmaking (6.7 APG without primary guard). Hield provides 3PT volume.",
      coachAdj: "Snyder shifts to McCollum-Daniels backcourt. More motion offense, less iso. Kispert gets 20+ MPG for spacing.",
      playoffNote: "ATL went 19-5 after All-Star break. Post-Trae trade identity: defense jumped from 16th to 7th DRtg. Johnson earned first All-Star.",
      sources: ["Sportscasting: hawks-new-identity", "NationalToday: hawks-surge-after-trade"]
    }
  },
  "CLE": {
    "Donovan Mitchell": {
      record: "2-2", winPct: .500, netRtgSwing: -5.5,
      stepUp: "Harden becomes primary scorer AND facilitator. Mobley 18.2 PPG (career best). Strus provides bench scoring. CLE's 41 different starting lineups this season show extreme adaptability.",
      coachAdj: "Atkinson staggers Harden/Mobley minutes. Harden runs point full-time — his 8.8 APG and superior passing (vs Garland's -3.0 per 100) actually makes the offense MORE efficient without Mitchell than it was without Garland.",
      playoffNote: "2025: Cavs swept Miami R1 (avg margin 30.5 pts — most lopsided sweep ever). Lost to IND 4-1 in R2 after Garland/Mobley/Hunter injuries. Harden trade specifically addressed that playoff vulnerability — adds veteran playoff experience (298 career playoff games).",
      sources: ["StatMuse: cavs-without-mitchell", "ClutchPoints: 52-wins-41-lineups", "FearTheSword: cavs-bench-game-1", "BasketballNews: harden-raises-cavaliers-championship-ceiling"]
    },
    "Jarrett Allen": {
      record: "6-6", winPct: .500, netRtgSwing: -6.0,
      stepUp: "Mobley shifts to full-time C (career-best 18.2 PPG, 3.6 APG). Harden-Mobley PnR becomes primary action. Nance provides frontcourt depth.",
      coachAdj: "Atkinson staggers Mobley at C. More perimeter-oriented defense without Allen's rim protection. Harden's ability to slow the game down helps compensate for less interior presence.",
      playoffNote: "Allen dominant pre-injury: 22.3/11.5/1.3 on 74% FG in Feb (8-3). GTD for Game 1 but played and contributed. His health is CLE's biggest swing factor — CLE with healthy Allen+Harden+Mitchell is a Finals team.",
      sources: ["Heavy: jarrett-allen-injury-update", "SI: evan-mobley-key-to-cavs-postseason", "MedinaGazette: rotation-key-cavs-playoffs"]
    },
    "James Harden": {
      record: "N/A (21-6 since arrival)", winPct: .778, netRtgSwing: -7.0,
      stepUp: "Without Harden, CLE reverts to pre-trade offense. Mitchell must self-generate every possession. No secondary creator or late-game orchestrator.",
      coachAdj: "Atkinson would need to revert to Mitchell-centric iso. Loss of Harden's floor generalship removes CLE's biggest playoff upgrade. Strus/Merrill become primary secondary options.",
      playoffNote: "Harden surpassed Larry Bird in career playoff scoring. 298 career playoff games — most experienced player on CLE. The trade was specifically to address CLE's R2 ceiling. G1: 22/10 proved the fit. Mitchell says their dynamic 'makes Cavs tough to beat.'",
      sources: ["Heavy: harden-larry-bird-playoff-scoring", "PFN: harden-chemistry-cavaliers-donovan-mitchell", "WashingtonTimes: harden-chases-ring-cavaliers", "FearTheSword: harden-mobley-chemistry"]
    }
  },
  "TOR": {
    "Brandon Ingram": {
      record: "~2-1 (minimal absence)", winPct: .667, netRtgSwing: -4.0,
      stepUp: "Barrett becomes primary scorer. Barnes (when healthy) carries creation load. Quickley handles backup playmaking.",
      coachAdj: "Rajakovic runs more Barnes-centric offense. Shead gets extended minutes at guard.",
      playoffNote: "Ingram played 77 games — very healthy. TOR's issue is Quickley being OUT and Barnes' hip fragility (7-32 without Barnes over 2 years).",
      sources: ["RaptorsRapture: ingram-report-card", "ESPN: brandon-ingram-stats"]
    },
    "Scottie Barnes": {
      record: "~7-32 (2-year combined)", winPct: .179, netRtgSwing: -18.0,
      stepUp: "Nobody adequately replaces him. Barrett tries but efficiency craters. Team becomes one of worst in NBA.",
      coachAdj: "Rajakovic has no answer. Offense and defense both collapse without Barnes' two-way versatility.",
      playoffNote: "Barnes missed 49 games over 2 years (hip, knee). 7-32 without him = 18% win rate. Catastrophic dependency.",
      sources: ["StatMuse: raptors-without-barnes"]
    }
  },
  "DET": {
    "Cade Cunningham": {
      record: "13-5", winPct: .722, netRtgSwing: 1.0,
      stepUp: "Jalen Duren EXPLODED: 26.5/10.5/2.7 on 67.5% FG (5-1 in 6 key games). Historic game vs NOP: 30/10/7 on 83.3% shooting. Daniss Jenkins emerged as reliable backup PG.",
      coachAdj: "Bickerstaff shifts to Duren-centric offense. More post-ups, PnR with Jenkins. Team actually clinched #1 seed while Cade was out. Won at HIGHER win% (75%) without Cunningham.",
      playoffNote: "Cade had collapsed lung Mar 17 vs WAS, missed 11 games. Returned vs MIL (13pts/10ast). DET went 14-68 just 2 seasons ago — 60-22 this year is historic. Bickerstaff: first coach to go 60 losses to 60 wins in 2 seasons.",
      sources: ["DetroitNews: pistons-winning-without-cunningham", "DetroitJockCity: duren-excellence", "PistonPowered: record-without-cade", "NBA.com: cunningham-collapsed-lung"]
    }
  },
  "ORL": {
    "Paolo Banchero": {
      record: "~7-3", winPct: .700, netRtgSwing: -2.5,
      stepUp: "Franz Wagner carried: 23.4/6.2 PPG before his own injury. Bane provides third scoring option. Defense stays elite.",
      coachAdj: "Mosley shifts to Wagner-centric offense. More motion, less Banchero iso. Suggs/Bane handle more creation.",
      playoffNote: "2025: Both Banchero and Wagner were derailed by injuries — recurring theme. ORL's playoff ceiling depends on both being healthy.",
      sources: ["Yahoo Sports: banchero-return", "Sportscasting: magic-thriving-without-banchero"]
    },
    "Franz Wagner": {
      record: "14-15", winPct: .483, netRtgSwing: -9.0,
      stepUp: "Banchero carries but can't do it alone. Team lost 7 of 8 in March stretch. Even lost to 17-58 Pacers.",
      coachAdj: "Mosley starts Suggs-Bane-Black-Banchero-Carter (+5 NetRtg, 110.5 DRtg). Staggers creators to keep one on floor at all times.",
      playoffNote: "Wagner missed 48 GAMES with high ankle sprain. Before injury: 23.4/6.2 on 48.7% FG, All-Star caliber. Season-defining absence.",
      sources: ["SI: how-magic-rotation-changes-without-wagner", "OrlandoMagicDaily: wagner-injury-disrupts-consistency"]
    }
  },
  "BOS": {
    "Jayson Tatum": {
      record: "41-22", winPct: .651, netRtgSwing: -2.0,
      stepUp: "Jaylen Brown became MVP candidate: 28.7/6.9/5.1 (career highs). Derrick White named All-Star (98 blocks + 88 steals). Pritchard expanded role.",
      coachAdj: "Mazzulla's system absorbed Tatum's absence remarkably. +9.9 NetRtg without Tatum this season. Team won 56 games, defied 'gap year' predictions.",
      playoffNote: "2025: Tatum ruptured Achilles Game 4 vs NYK (ECSF). Celtics lost series in 6. Mazzulla criticized for not adjusting defense — tried having C guard Hart for ONE possession then reverted.",
      sources: ["StatMuse: celtics-without-tatum", "NBCSportsBoston: celtics-superlatives", "FOXSports: brown-leading-tatum-back", "SI: celtics-record-without-tatum"]
    },
    "Jaylen Brown": {
      record: "9-2", winPct: .818, netRtgSwing: -1.5,
      stepUp: "Tatum (post-return) carries offense. White/Pritchard/Queta fill defensive roles. Elite depth throughout roster.",
      coachAdj: "Mazzulla barely adjusts — system is that resilient. Boston was also 4-1 without White and 2-1 without Pritchard.",
      playoffNote: "Brown was 2024 Finals MVP. System makes individuals somewhat interchangeable at the margins.",
      sources: ["NBCSportsBoston: celtics-depth-2025-26"]
    }
  },
  "PHI": {
    "Joel Embiid": {
      record: "21-23", winPct: .477, netRtgSwing: -8.0,
      stepUp: "Maxey becomes sole star. Drummond fills C minutes. VJ Edgecombe emerged as future piece. But team craters without interior dominance.",
      coachAdj: "Nick Nurse goes small-ball. More Maxey PnR. Drummond/Bona at C can't replicate Embiid's scoring or gravity.",
      playoffNote: "Embiid played only 38 games (knee, oblique, appendectomy Apr 9). OUT for playoffs. The 76ers' Big Three of Embiid/Maxey/George barely played together.",
      sources: ["Inquirer: embiid-appendectomy-playoffs", "NBCSports: embiid-out-indefinitely", "LibertyBallers: sixers-future-without-embiid"]
    },
    "Tyrese Maxey": {
      record: "~4-8 (est. this season)", winPct: .333, netRtgSwing: -14.0,
      stepUp: "Nobody. 76ers were 8-34 without Maxey since 2023-24. VJ Edgecombe is raw. Eric Gordon provides scoring but not creation.",
      coachAdj: "Nurse has no answer without Maxey's speed and creation. Offense becomes static. George (when available) can't run point.",
      playoffNote: "2024-25: Sixers were 4-26 without Maxey. He missed ~3 weeks with pinkie tendon injury this year. He IS the franchise.",
      sources: ["PFN: maxey-injury-return-timeline", "LibertyBallers: sixers-without-maxey"]
    }
  }
};
