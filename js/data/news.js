// ============================================================
// NEWS FEED — curated injury/availability/correction notes
// ============================================================
// Each entry is a manual write-up sourced from beat reporters
// (ESPN/NBC/CBS/etc.). Newest first.
//
// Schema:
//   date     : 'YYYY-MM-DD'         when the news broke
//   severity : 'major' | 'minor' | 'info'
//   series   : SERIES_DATA.id slug   (links to series tab)
//   headline : short bold line
//   body     : 1-3 sentences of context
//   source   : reporter / outlet
// ============================================================

const NEWS = [
  {
    date: '2026-05-18',
    severity: 'info',
    series: 'DET-CLE',
    headline: 'Model post-mortem: DET-CLE G7 was a 35pt margin miss — Phase 73 widens elimination-game variance',
    body: 'The G7 prediction (DET +4 LOW) missed by 35pts (actual CLE +31). Third straight wrong-winner call on this series after G5 OT + G6 road blowout. Root causes: (1) Cade went 39→21→13 across the last 3 games as CLE escalated their defensive scheme — the engine treats matchups as static. (2) Bench variance is uncapped; Merrill went 23pts on 5-8 3PT (~17 above his median). (3) Phase 71c per-player override added +11 to Cade in expectation but he was at the opposite extreme of his distribution. Phase 71 G7 cap downgraded all PLACE bets → CAUTION and reduced stakes 50%, saving ~$76 vs full-stake exposure. Phase 73 ships TWO fixes: (a) ELIMINATION_VARIANCE_MULT 1.4x widens scoring bands for G6/G7 — doesn\'t shift central estimate, just produces honestly wider tails for MC sim. (b) Wrong-direction streak detector: when engine has been wrong-winner 2+ consecutive games of a series, variance widens 15% per game. Doesn\'t prevent future misses but acknowledges the model\'s own track record as a signal.',
    source: 'Internal post-game analysis / Phase 73 commit',
  },
  {
    date: '2026-05-18',
    severity: 'major',
    series: 'OKC-SAS',
    headline: 'WCF set: OKC (1) vs SAS (2), G1 ~Tue May 20',
    body: 'OKC swept LAL 4-0 in R2 (~7 days rest going into CF); SAS beat MIN 4-2, closeout 5/15 (3 days rest). Phase 71c engine: OKC by 6 in G1 at Paycom Center. SGA vs Wemby is the headline matchup — but Holmgren vs Wemby is the structural duel (both 8+ blk per series, both 12+ reb projection). HCA premium R3=1.5pts. Rest edge MASSIVE: OKC fresh vs SAS coming off 6-game closeout. Series schedule TBD.',
    source: 'NBA / Phase 71c engine output',
  },
  {
    date: '2026-05-18',
    severity: 'info',
    series: null,
    headline: 'East CF on hold: DET-CLE G7 result pending',
    body: 'DET-CLE G7 was played 5/17 at LCA but result is not yet entered in series-data.js. NYK awaits East opponent. Phase 71 G7 framework was applied to all G7 bets (50% winner accuracy in audit, 19.8pt margin MAE — every PLACE recommendation auto-downgraded to CAUTION). Floor parlays at half stake. Once G7 result is entered, we can scaffold the East CF (NYK vs DET or CLE) and add R3-G1 East slate.',
    source: 'manual entry / system note',
  },
  {
    date: '2026-05-18',
    severity: 'info',
    series: 'OKC-SAS',
    headline: 'CF framework discipline: small-sample caveat',
    body: 'Phase 71 audit was based entirely on R1+R2 (68 games). The model has ZERO calibrated R3+ data. Every CF prediction is out-of-sample. Daily process update: stakes reduced 50% for first 5 R3 games, no "high" confidence on stars (audit found tier-residual bias is worse against playoff-defense-intensified opponents), audit re-run scheduled after every 3 resolved CF games to check for bias drift.',
    source: 'CALIBRATION_AUDIT.md / Phase 71 discipline',
  },
  {
    date: '2026-05-15',
    severity: 'major',
    series: 'SAS-MIN',
    headline: 'SAS WINS SERIES 4-2 — advances to WCF vs OKC',
    body: 'SAS 139-109 closeout in G6 at MIN. Castle MASTERPIECE 32/11/6ast (11-16 FG, 5-7 3PT). Wemby 19/6/6ast/3blk in 27min (capped by blowout). Fox 21/9ast. All five SAS starters in double figures. SAS led wire-to-wire by as many as 34 (20-0 SAS run early Q2). MIN: Edwards 24 on 9-26 FG (volume came, efficiency didn\'t — Castle perimeter D). Randle + Gobert COMBINED 3pts on 1-12 FG (catastrophic). Home-team-wins-every-game pattern broke in elimination spot. Model: predicted MIN by 2 (LOW), actual SAS by 30 — WRONG WINNER, +32 margin miss.',
    source: 'ESPN / Basketball Reference',
  },
  {
    date: '2026-05-07',
    severity: 'major',
    series: 'NYK-PHI',
    headline: 'NYK 108-102: Knicks lead series 2-0 (G2 result)',
    body: 'Tight game with 25 lead changes (most in any playoff game in 11 years), 14 ties — neither team led by more than 7 all night. Brunson 26 (go-ahead bucket 5:06 left), OG Anunoby 24 (left late, status uncertain), KAT 20/10/7. Maxey 26 but cold Q4 (PHI 3-16 / 18.8% in 4th). PHI shot 38% from 3 vs NYK 27% but lost on TOV (+5 NYK) and Q4 collapse. Hart\'s 3 with 6:52 left after PHI led 99-96 sparked the close. Pre-Phase-56 model nailed the margin (NYK by 6 exactly).',
    source: 'ESPN / NBA.com',
  },
  {
    date: '2026-05-07',
    severity: 'major',
    series: 'SAS-MIN',
    headline: 'SAS 133-95: Largest playoff loss in MIN franchise history',
    body: 'Spurs evened series 1-1 with the worst playoff defeat in Wolves franchise history (surpassed the 2003 30-pt loss to LAL). Castle 21, Wemby 19/15reb (bounce-back), Fox 16. SAS shot 50% FG, 41% 3PT (vs G1 41%/28%) — regression thesis MASSIVELY validated. MIN trailed 25 at halftime; Edwards/Randle/McDaniels/Shannon all stuck at 12pts. Finch quote: "I just told them we got punked."',
    source: 'NBA.com / KSAT',
  },
  {
    date: '2026-05-07',
    severity: 'minor',
    series: 'NYK-PHI',
    headline: 'Embiid GTD for G3 (Fri May 8 in PHI)',
    body: 'Day-to-day per ESPN heading into Friday\'s Game 3 in Philadelphia. Two days rest after sitting G2 with right ankle sprain + hip soreness. Heavy: "could be back" but "no official guarantee." Decision will hinge on the Friday morning injury report.',
    source: 'ESPN / Heavy / Inquirer',
  },
  {
    date: '2026-05-07',
    severity: 'minor',
    series: 'NYK-PHI',
    headline: 'OG Anunoby GTD G3 (left G2 late, unspecified)',
    body: 'OG had 24pts (10-15 FG) before exiting late in G2 with an unspecified issue and not returning. Status for Friday\'s G3 unclear. If he\'s out, NYK\'s wing depth (Bridges, Hart, McBride) absorbs minutes but PHI\'s scheme can hunt the gap.',
    source: 'ESPN recap',
  },
  {
    date: '2026-05-07',
    severity: 'info',
    series: 'NYK-PHI',
    headline: 'Bug found + fixed: Embiid had duplicate activeInjury keys',
    body: 'Phase 56 set Embiid to severity:1.0 (OUT) but an older severity:0.4 entry on the same player object silently overrode it (last duplicate key wins in JS). The engine never saw him as truly OUT. Fix: consolidated into single activeInjury reflecting current G3 GTD status. Pre-Phase-56 prediction (NYK by 6) was actually the correct one — narrative-driven re-pricing to NYK -10.5 was an overreaction that would have lost the spread bet by 4.5 points.',
    source: 'Internal model audit',
  },
  {
    date: '2026-05-06',
    severity: 'major',
    series: 'NYK-PHI',
    headline: '🚨 Embiid OUT for tonight\'s G2',
    body: 'Right ankle sprain + right hip soreness. Ruled out morning of May 6 after he could not participate in shootaround. PHI starts: Maxey / Edgecombe / Oubre / George / Drummond. NYK ML re-priced -260 → -450; spread -6.5 → -10.5; Embiid Over 22.5 prop voided.',
    source: 'ESPN / NBC Sports Philadelphia',
  },
  {
    date: '2026-05-06',
    severity: 'minor',
    series: 'DET-CLE',
    headline: 'Allen back to full minutes',
    body: 'Reportedly off the injury report — knee tendonitis cleared. His return raises CLE\'s ceiling vs G1 conditions, and downgrades DET ML from BEST BET to a MEDIUM lean. Huerter (DET) GTD thigh; Merrill (CLE) GTD hamstring.',
    source: 'Yardbarker',
  },
  {
    date: '2026-05-06',
    severity: 'minor',
    series: 'SAS-MIN',
    headline: 'Edwards questionable for G2',
    body: 'Knee bothered him at the end of G1 — listed as QUESTIONABLE per latest reports. He played G1 on restricted minutes. Bet reasoning was already factoring his limited capacity.',
    source: 'ClutchPoints',
  },
  {
    date: '2026-05-06',
    severity: 'info',
    series: 'OKC-LAL',
    headline: 'Correction: J.Williams was OUT for G1',
    body: 'Prior G1 recap incorrectly stated J.Williams played 20 minutes. Per NBA.com he was OUT (Grade 1 hamstring), week-to-week. Recap and ML reasoning corrected: OKC won G1 by 18 *without* Williams — a more impressive signal for OKC, not less.',
    source: 'NBA.com',
  },
  {
    date: '2026-05-05',
    severity: 'minor',
    series: 'OKC-LAL',
    headline: 'Reaves still severely limited (oblique)',
    body: 'R2 G1: 3-16 FG (19%), 0-5 3PT, 4 TOs, -10 in 36min. Cannot drive, explode, or finish. Model downgraded from 80% to 50-55% capacity — major LAL liability heading into G2.',
    source: 'ESPN box score',
  },
  {
    date: '2026-05-04',
    severity: 'major',
    series: 'OKC-LAL',
    headline: 'Doncic OUT — Grade 2 hamstring',
    body: 'No return timeline. Expected out at least through May 9 per CBS Sports. LAL proved they can win without him in R1 (4-2 vs HOU), but OKC is a different tier.',
    source: 'CBS Sports',
  },

  // ── May 8: G3 wave 1 ────────────────────────────────────────────
  {
    date: '2026-05-08',
    severity: 'major',
    series: 'NYK-PHI',
    headline: 'NYK 108-94: Knicks one win from sweep (lead 3-0)',
    body: 'NYK won at Wells Fargo Center despite Embiid returning (18pts/35min, rusty from 5/6 OUT). Brunson 33/5/9 — 24th 30-pt playoff game (most in Knicks history). Bridges 23. Hart 12/11reb. KAT 8/12reb/7ast (4 OREB). Shamet bench spark 15pts. PHI: Oubre 22, Maxey 17, George 15 (all in Q1 then 0-of-9 the rest). OG Anunoby OUT (left hamstring strain). NYK wing pressure produced PHI 18 TOs. Sweep cliff with G4 Sunday in PHI.',
    source: 'NBA.com / ESPN',
  },
  {
    date: '2026-05-08',
    severity: 'major',
    series: 'SAS-MIN',
    headline: 'SAS 115-108: Spurs take series lead 2-1 (Wemby 39/15)',
    body: 'Wemby Kareem-tier line at Target Center: 39pts/15reb/5blk on 13-18 FG. Edwards back to starting lineup (15/7/1) but rust + SAS rotations limited his usual rim aggression. Castle 8pts/7ast as facilitator. Vassell + Champagnie + K.Johnson + Bryant each made 2 threes. SAS led 18-3 to start, MIN clawed back to 23-22 Q1, halftime 51-51, SAS up 86-79 entering Q4. Wemby\'s 15-reb floor (back-to-back games) was the structural anchor. Model: SAS by 9 pred, actual SAS by 7 (within 2pts — strongest pred of series). G4 in MIN Sunday.',
    source: 'NBA.com / KSAT',
  },

  // ── May 9: G3 wave 2 ────────────────────────────────────────────
  {
    date: '2026-05-09',
    severity: 'major',
    series: 'OKC-LAL',
    headline: 'OKC 131-108: Thunder one win from sweep (lead 3-0)',
    body: 'Blowout at Crypto.com Arena. SGA 35-40pt range, Holmgren dominant, J.Williams full minutes. OKC bench every player +10 or better. LAL: LeBron 27, Reaves bounceback efficiency, but team-wide cold from 3 (~29%). Doncic still OUT. Series effectively over — historically 0-3 teams come back 0 of 154 attempts. G4 Sunday at LAL for sweep cliff.',
    source: 'NBA.com',
  },
  {
    date: '2026-05-09',
    severity: 'major',
    series: 'DET-CLE',
    headline: 'CLE 116-109: Cavaliers break through, DET lead trimmed to 2-1',
    body: 'CLE got the series win they needed at home. Mitchell sustained shotmaking, Mobley + Allen interior, Garland creation. DET: Cade led but turnover-heavy, Mitchell shot well, Duren solid. Series back in play. G4 at CLE Sunday.',
    source: 'NBA.com',
  },

  // ── May 10: G4 wave 1 (NYK sweep + Wemby ejection) ─────────────
  {
    date: '2026-05-10',
    severity: 'major',
    series: 'NYK-PHI',
    headline: 'NYK 144-114: KNICKS SWEEP 4-0, ADVANCE TO ECF',
    body: 'NYK shot 25-of-44 from 3 (56.8%) — set postseason record for 3PT makes (or near it). McBride 25 off bench (7 threes), Brunson 22, Bridges + KAT + Hart all 15+. Embiid + Maxey combined 41 but PHI supporting cast no-showed. PHI shot 68% on 2s and still lost by 30 — variance event, not model failure. NYK awaits East CF opponent (DET or CLE). First Knicks ECF since 2024.',
    source: 'NBA.com / ESPN',
  },
  {
    date: '2026-05-10',
    severity: 'major',
    series: 'SAS-MIN',
    headline: 'MIN 114-109: Wemby EJECTED Q2 (Flagrant 2), MIN evens series 2-2',
    body: 'WEMBANYAMA EJECTED early Q2 on a Flagrant 2 — elbow to Naz Reid\'s neck/jaw on a double-team. First career ejection. Wemby line: 4/4/1 in 13min (2-5 FG). Edwards 36pts (16 in Q4), closed the door with a 4-pt swing in the final 4 minutes. Naz Reid 15/9 (the player who took the elbow, finished the game). SAS guards held the line (Harper/Fox/Castle 68 combined) but couldn\'t overcome the star loss. League ruling on Wemby\'s G5 status TBD — Flagrant 2 carries supplemental discipline risk.',
    source: 'NBA.com / The Athletic',
  },

  // ── May 11: G4 wave 2 (OKC sweep + CLE evens) ──────────────────
  {
    date: '2026-05-11',
    severity: 'major',
    series: 'OKC-LAL',
    headline: 'OKC 115-110: THUNDER SWEEP 4-0, ADVANCE TO WCF',
    body: 'OKC closed at Crypto.com Arena. Tighter game than expected — LAL fought back from down 18 with LeBron + Reaves carrying. SGA delivered when needed in Q4. OKC moves on to West CF (vs SAS or MIN winner). +18, +18, +23, +5 series margins — structural dominance confirmed. OKC awaits West CF opponent.',
    source: 'NBA.com',
  },
  {
    date: '2026-05-11',
    severity: 'major',
    series: 'DET-CLE',
    headline: 'CLE 112-103: Cavs even series 2-2 at home',
    body: 'Mitchell shotmaking + Allen interior carried CLE in G4. DET kept it close behind Cade and Duren but couldn\'t overcome CLE\'s home crowd + Mitchell\'s Q4 closing. Series back to DET tied 2-2 with G5 at LCA Tuesday.',
    source: 'NBA.com',
  },

  // ── May 12-13: G5 wave ─────────────────────────────────────────
  {
    date: '2026-05-12',
    severity: 'major',
    series: 'SAS-MIN',
    headline: 'Wemby CLEARED (no suspension). SAS 126-97: leads 3-2',
    body: 'NBA review completed Tuesday morning — no suspension or fine for Wemby\'s G4 Flagrant 2. He plays in G5. Then he delivered: 27pts/17reb/5ast/3blk + 2 made 3s. First player in NBA postseason history with that stat line since the 3PT line was introduced (1979-80). 18pts in Q1 set the tone. SAS led by as many as 30; 68-36 paint advantage. K.Johnson 21pts bench spark. Edwards regression after G3-G4 32/36 (knee fatigue + Castle perimeter D). SAS one win from WCF.',
    source: 'NBA.com / KSAT',
  },
  {
    date: '2026-05-13',
    severity: 'major',
    series: 'DET-CLE',
    headline: 'CLE 117-113 OT: Cavs take 3-2 lead, DET on elimination',
    body: 'Overtime thriller at LCA. Mitchell delivered down the stretch. DET pushed CLE to OT but couldn\'t close. Series shifts to CLE for G6 — DET must win to force G7 at LCA. Cade and Duren did everything they could; Mitchell + Mobley + Allen + Garland too much in the extra frame.',
    source: 'NBA.com',
  },

  // ── May 15: G6 wave (SAS clinches, DET forces G7) ──────────────
  {
    date: '2026-05-15',
    severity: 'major',
    series: 'SAS-MIN',
    headline: 'SAS 139-109: SPURS WIN SERIES 4-2, ADVANCE TO WCF VS OKC',
    body: 'Wemby + Fox + Castle dismantled MIN on the road for the closeout. SAS will face OKC in the West CF — the team that swept LAL 4-0. Both 1/2 seeds advance as expected; the 38-pt G2 + 30-pt G5 + 30-pt G6 blowout pattern shows the talent gap was real after the MIN G1 upset. Wemby earns first career CF appearance.',
    source: 'NBA.com',
  },
  {
    date: '2026-05-15',
    severity: 'major',
    series: 'DET-CLE',
    headline: 'DET 115-94 on the road: Series tied 3-3, G7 tonight',
    body: 'DET\'s 21-pt road win in a G6-trailing-3-2 situation tied a 66-year-old NBA playoff record for largest road win by a team facing elimination. Cade led the way, Duren + Robinson + Holland contributed. CLE shot poorly from 3 and couldn\'t hit Mitchell-led shotmaking in front of their home crowd. G7 tonight at Rocket Mortgage FieldHouse — winner faces NYK in the East CF.',
    source: 'NBA.com',
  },

  // ── May 16 (TODAY) — CF brackets nearly set ────────────────────
  {
    date: '2026-05-16',
    severity: 'major',
    series: 'DET-CLE',
    headline: 'G7 set for Sunday 5/17 at CLE — winner faces NYK',
    body: 'Detroit vs Cleveland Game 7, Sunday 5/17 8:00 PM ET at Rocket Mortgage FieldHouse (one day of rest after G6). CLE -3.5 / total ~210.5 on DK. The winner takes on NYK in the East CF starting around 5/19. Mitchell vs Cade is the marquee matchup. CLE has home court and Mitchell\'s Q4 closing edge; DET has the +21 G6 road-win momentum.',
    source: 'NBA.com / ESPN',
  },
  {
    date: '2026-05-16',
    severity: 'major',
    series: 'OKC-LAL',
    headline: 'WEST CF SET: OKC vs SAS, starts ~5/19 at OKC',
    body: 'Both 1 seeds advanced via R2 sweeps. OKC (4-0 vs LAL, +18/+18/+23/+5 margins) hosts SAS (4-2 vs MIN, Wemby-led). The first conference finals matchup of two #1 seeds in their respective conferences since [historical context]. Wemby vs SGA is a generational matchup. Holmgren-Wemby paint battle. OKC depth vs SAS dynamic guard play. G1 spread will be tight despite OKC home court.',
    source: 'NBA.com',
  },
  {
    date: '2026-05-16',
    severity: 'major',
    series: 'NYK-PHI',
    headline: 'NYK awaiting East CF opponent (DET or CLE)',
    body: 'Knicks have been off since May 10 sweep — 6 days of rest by the time East CF G1 starts (~5/19). Both potential opponents have advantages: CLE is the higher seed with home court; DET has the road-win momentum and Cade. NYK opens CF as the team with the most playoff rest among the remaining four. Brunson + KAT + Bridges + Hart + OG (returning from hamstring) at full health.',
    source: 'NBA.com',
  },

  // ── May 16 (off-day before G7) — rest-day storylines ─────────
  {
    date: '2026-05-16',
    severity: 'minor',
    series: 'DET-CLE',
    headline: 'G7 tomorrow night — rest day at CLE, Mitchell vs Cade',
    body: 'Off-day after DET\'s historic +21 road win in G6. Both teams in town for media availability and walk-throughs. Mitchell led CLE with his Q4 closing on G5 OT and is the marquee storyline tomorrow. DET\'s edge: 21-pt road win momentum + Cade-Duren pick-and-roll has shredded CLE\'s drop coverage. CLE\'s edge: home crowd + Mitchell\'s playoff closing average (+8.2 in road games at LCA is +4.5 in HOME closeouts). Tomorrow 8 PM ET. CLE -3.5 / total 210.5 on DK.',
    source: 'NBA.com',
  },
  {
    date: '2026-05-16',
    severity: 'minor',
    series: 'NYK-PHI',
    headline: 'OG Anunoby tracker — back to full practice ahead of CF',
    body: 'Left hamstring strain that kept him out of NYK-PHI G4 has progressed. Full practice today. NYK CF G1 (vs DET/CLE winner) projected ~5/19. With OG, NYK\'s wing defense returns to full strength — Bridges no longer the lone perimeter stopper. KAT/Brunson/OG/Bridges/Hart starting five is intact. Mitchell Robinson activity managed; should be ready for G1.',
    source: 'ESPN / Heavy',
  },
  {
    date: '2026-05-16',
    severity: 'minor',
    series: 'OKC-LAL',
    headline: 'Wemby vs SGA — CF opens ~5/19 at OKC',
    body: 'Both #1 seeds advanced via R2 sweeps. First MVP-tier matchup of the playoffs. SGA (31.1ppg, 67% TS) vs Wemby (24.8ppg, 11.5rpg) is the marquee individual battle, but the depth-vs-stars structural matchup is the real story. OKC depth (10-man rotation) vs SAS stars-plus-Castle-plus-Harper bench. Holmgren-Wemby paint battle is the key chess piece. SAS rested since 5/15 close; OKC since 5/11. WCF Game 1 at Paycom Center.',
    source: 'NBA.com / ESPN',
  },

  // ── May 17 — DET-CLE G7 result ─────────────────────────────
  {
    date: '2026-05-17',
    severity: 'major',
    series: 'DET-CLE',
    headline: 'CLE 125-94 G7: Cavs blow out Pistons, advance to ECF vs NYK',
    body: 'Cleveland\'s 6th straight Game 7 win — and the most dominant in the streak. Mitchell 26pts (15 in Q3, only 31min, 0 TOs) and Mobley 21/12 led the rout; Allen 23/7reb and Merrill 23 off bench (5-8 3PT) gave CLE four 20+ scorers. Harden was box-score quiet (9pts, 2-10 FG) but his gravity freed everyone. DET imploded: Cade career-low 13pts on 5-16 FG / 0-7 3PT (worst playoff game of his career), Harris 0-6 FG, Duren 7/9 with 3 TOs vs Allen/Mobley. CLE shot 50.6% FG, won boards 50-41, forced 14 TOs. ECF G1 is Tue 5/19 at MSG vs NYK (CLE on 1 day rest, NYK on 9 days rest).',
    source: 'NBA.com / ESPN',
  },
  {
    date: '2026-05-17',
    severity: 'minor',
    series: 'DET-CLE',
    headline: 'Mitchell 5-0 lifetime in Game 7s with G7 masterclass',
    body: 'Donovan Mitchell improved his career Game 7 record to 5-0 with the Q3 dagger run — 15 of his 26 points in a 31-point quarter that flipped a 7-pt halftime game into a 26-pt blowout. The Cavs are 6-0 in G7s in franchise history when leading at halftime or down ≤7. Mitchell played only 31 minutes and turned the ball over zero times. The performance reinforces the model lesson the engine had been resisting: in elimination spots, the volume-shifting tier-one star matters more than home court (Phase 71 audit MAE 19.8pts on G7 margin).',
    source: 'ESPN',
  },

  // ── May 18 — WCF G1 day, ECF G1 preview ─────────────────────
  {
    date: '2026-05-18',
    severity: 'major',
    series: 'OKC-LAL',
    headline: 'WCF G1 tonight: SAS @ OKC, 8:30 PM ET — OKC -6.5 / 219.5',
    body: 'Western Conference Finals tip off tonight at Paycom Center. OKC the defending champ #1 seed (64-18, +11.6 NetRtg) hosts SAS (#2 seed, 4-2 over MIN powered by Wemby/Castle/Fox). Regular season note: SAS went 4-1 vs OKC — one of the few teams to dominate the Thunder. SGA (31.1ppg) vs Wemby (24.8ppg, 11.5rpg, 3.7blk) is the marquee individual matchup; Holmgren-Wemby paint battle is the structural chess piece. OKC rested 7 days; SAS rested 3 days. DraftKings: OKC -6.5 / total 219.5. Engine baseline OKC by 3-5 (talent + HCA + rest), but the season series argues for a tighter line. NBC/Peacock broadcast.',
    source: 'NBA.com / ESPN',
  },
  {
    date: '2026-05-18',
    severity: 'major',
    series: 'NYK-PHI',
    headline: 'ECF set: NYK vs CLE, G1 Tue 5/19 at MSG (9-day rest vs 1-day rest)',
    body: 'Eastern Conference Finals matchup locked: NYK (#3 seed, swept PHI 4-0, rested since 5/10) hosts CLE (#4 seed, won DET 4-3 last night on the road by 31). The rest gap (9 days vs 1 day) is the dominant ECF G1 variable. NYK has the layoff-rust risk (longer breaks historically depress Q1 efficiency by 4-6 pts); CLE has the legs-tired risk after Mitchell\'s 31min G7, Allen on a chronic knee, and a one-day turnaround flight. KAT-vs-Mobley + Brunson-vs-Mitchell are the marquee matchups. OG Anunoby back from hamstring at full practice. Lines TBD morning of game. G1 at MSG 8 PM ET on ESPN.',
    source: 'NBA.com / SI',
  },
  {
    date: '2026-05-18',
    severity: 'minor',
    series: 'DET-CLE',
    headline: 'DET offseason: Cade extension, Bickerstaff seat, Duren trade chatter',
    body: 'After the 31-point G7 loss at home, the Pistons enter the offseason facing three big questions. (1) Cade Cunningham contract — eligible for a designated rookie supermax this summer. (2) Coach J.B. Bickerstaff — first full season; the G7 collapse will draw scrutiny but he took DET from lottery to #1 seed in one year. (3) Duren long-term — overpowered by Allen/Mobley in the G7 interior; could DET shop him for wing scoring? The biggest takeaway: the Cade-Duren PnR worked in G5-G6 but Harris\' 0-6 FG in G7 showed DET\'s secondary scoring is one bad night from collapse.',
    source: 'Yahoo Sports',
  },
  {
    date: '2026-05-18',
    severity: 'major',
    series: 'OKC-SAS',
    headline: 'SAS 122-115 (2OT): Wemby 41/24 stuns OKC, SAS leads WCF 1-0',
    body: 'Instant classic in OKC. Victor Wembanyama 41pts/24reb/3blk/2ast in 49+min — youngest player ever with 40+pts and 20+reb in a playoff game (22yr 134d, beating Kareem 1970). Joined Wilt Chamberlain as the only players with 40/20 in their Conference Finals debut. Hit a Curry-range logo three to force 2OT, then sealed it with two dunks in the final minute. Dylan Harper 24/11/6ast/7stl — first rookie with 15+pts/5+reb/5+stl in a playoff game since Magic Johnson in 1980 (also a team playoff record for steals). Castle 17, Vassell 13, Johnson 13, Champagnie 11. Alex Caruso 31pts off OKC bench on 8 made threes (career playoff #2). SGA 24/12ast on 7-23 FG (30%) — Harper/Castle hounded him at the POA. Holmgren 8/8/2blk on 2-7 FG (limited by Wemby gravity). Jalen Williams back from hamstring with 26pts. Sixth Game 1 in NBA playoff history to go 2OT — first since SAS-GSW 2013. SAS stole HCA, holds the 4-1 reg-season record over OKC. G2: Wed 5/20 at Paycom.',
    source: 'ESPN / NBA.com',
  },
  {
    date: '2026-05-19',
    severity: 'major',
    series: 'NYK-CLE',
    headline: 'ECF G1 tonight: CLE @ NYK 8 PM at MSG — NYK -7.5 / 215.5',
    body: 'Tip-off at 8 PM ET on ESPN. NYK (#3 seed, swept PHI 4-0, rested 9 days) hosts CLE (#4 seed, beat DET 4-3 via Sunday\'s G7 road blowout 125-94, traveled in on 1 day rest). Rest gap of 9 days vs 1 day is the largest in any ECF G1 on record. DraftKings opener: NYK -7.5 / ML -265 / total 215.5. Marquee matchups: Brunson-vs-Mitchell at PG (Brunson 29 ppg vs PHI; Mitchell 28.8 vs DET — both clear MVP-of-the-series). KAT-vs-Mobley/Allen at the 5 (KAT stretch-5 pulls Mobley out of paint; Allen tests KAT on the glass). Bridges/OG perimeter D is the toughest CLE will see this playoff. <strong>Variables to watch:</strong> NYK rust risk (longer breaks historically dip Q1 efficiency 4-6pts) vs CLE legs-tired risk (Mitchell 31min Sun, Allen on chronic knee). Series schedule: G1 5/19, G2 5/21 (MSG), G3 5/23, G4 5/25 (CLE), G5 5/27, G6 5/29, G7 5/31.',
    source: 'NBA.com / ESPN',
  },
];
