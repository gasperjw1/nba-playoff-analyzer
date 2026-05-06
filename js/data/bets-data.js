// ============================================================
// BETS DATA — declarative schema (Phase 55)
// ============================================================
// Every bet is a plain object; rendering is unified in bet-card.js.
//
// Schema:
//   id          : string              stable, unique
//   slate       : 'R2-G1' | 'R2-G2' | …  for grouping/filtering
//   series      : 'NYK-PHI' | …        matches SERIES_DATA.id
//   game        : 1..7
//   postedAt    : 'YYYY-MM-DD'
//   type        : 'ml' | 'spread' | 'total' | 'prop' | 'parlay'
//   pick        : string              human-readable
//   odds        : string              keep as written ('-260', '+150')
//   facts       : [{label, value}]    structured replacement for pipe-separated bet-line
//   chs         : { delta, tone, detail? }  null | tone: 'boost'|'caution'|'mixed'
//   modelHook   : { fn, args }        optional dynamic field
//   reasoning   : string              free-form, allows <strong>; supports {{winner}} / {{margin}}
//   confidence  : 'best-bet' | 'high' | 'medium' | 'lean' | 'coin-flip'
//   thesis      : string[]            ['model','matchup','regression','historical','situational','market']
//   narrative   : 'bounce-back' | 'desperation' | 'rest-edge' | null
//   result      : null | { outcome: 'win'|'loss'|'push', actual: '...' }

const BETS = [

  // ═══════════════════════════════════════════════════════════════
  // R2 G1 — ARCHIVED (Sun May 4 / Mon May 5)
  // ═══════════════════════════════════════════════════════════════

  // ─── NYK-PHI G1 — NYK 137-98 (+39 blowout) ───────────────────
  {
    id: 'r2-g1-nyk-phi-ml',
    slate: 'R2-G1', series: 'NYK-PHI', game: 1, postedAt: '2026-05-04',
    type: 'ml', pick: 'NYK ML vs PHI', odds: '-290',
    facts: [{label:'Spread',value:'NYK -7.5'},{label:'Total',value:'O/U 213.5'}],
    modelHook: { fn:'dml', args:['NYK-PHI',1] },
    reasoning: "<strong>NYK has 6 days rest vs PHI's 2 after a grueling G7 in Boston.</strong> Embiid played 39min in G7 (hip contusion + post-appendectomy) with a 48-hour turnaround to MSG. PHI's 3-1 comeback proves mental toughness but the physical toll is severe. NYK depth (OG/Bridges/Hart/McBride/Shamet) grinds PHI's 7-man rotation by Q3. Brunson (9.2 clutch NetRtg) feasts in PnR vs compromised Embiid. R1 G1 home favorites covered 7/8 (88%).",
    confidence: 'best-bet', thesis: ['model','market'], narrative: 'rest-edge',
    result: { outcome:'win', actual:'NYK 137-98' },
  },
  {
    id: 'r2-g1-nyk-phi-spread',
    slate: 'R2-G1', series: 'NYK-PHI', game: 1, postedAt: '2026-05-04',
    type: 'spread', pick: 'NYK -7.5', odds: '-112',
    facts: [{label:'Risk',value:'PHI Q3 collapse'}],
    modelHook: { fn:'dmargin', args:['NYK-PHI',1] },
    reasoning: "Model says {{winner}} by {{margin}} — covers -7.5. PHI will compete early but fatigue hits in Q3. Embiid CAN dominate on the road (34/12 vs BOS G7) but at what physical cost? NYK bench depth (McBride, Shamet, Clarkson vs PHI's Grimes/Barlow) is a massive quality gap.",
    confidence: 'medium', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'NYK by 39' },
  },
  {
    id: 'r2-g1-nyk-phi-brunson-pts',
    slate: 'R2-G1', series: 'NYK-PHI', game: 1, postedAt: '2026-05-04',
    type: 'prop', pick: 'Jalen Brunson Over 27.5 points', odds: '-115',
    facts: [{label:'Playoff avg',value:'28.6pts'},{label:'Venue',value:'MSG home'},{label:'Matchup',value:'PnR vs tired Embiid'}],
    reasoning: "Brunson averaged 28.6pts in R1 with 9.2 clutch net rating at MSG. PHI perimeter defense will be compromised by fatigue. Brunson's PnR with KAT creates open lanes. The 27.5 line is below his playoff average — one of the safest props on the board.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: { outcome:'win', actual:'35pts' },
  },
  {
    id: 'r2-g1-nyk-phi-embiid-under',
    slate: 'R2-G1', series: 'NYK-PHI', game: 1, postedAt: '2026-05-04',
    type: 'prop', pick: 'Embiid Under 28.5 points', odds: '-110',
    facts: [{label:'Rest',value:'48hr after 39min G7'},{label:'Health',value:'Hip contusion'}],
    reasoning: "Embiid dropped 34/12/6 in G7 but that was an elimination game with adrenaline. G1 on 2 days rest with a hip contusion is different. OG Anunoby is an elite post defender. Expect 22-26pts on lower efficiency as Embiid conserves energy for a long series.",
    confidence: 'medium', thesis: ['matchup','situational'], narrative: null,
    result: { outcome:'win', actual:'14pts (3-11)' },
  },

  // ─── SAS-MIN G1 — MIN 104-102 (upset) ────────────────────────
  {
    id: 'r2-g1-sas-min-ml',
    slate: 'R2-G1', series: 'SAS-MIN', game: 1, postedAt: '2026-05-04',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '-345',
    facts: [{label:'Spread',value:'SAS -9.5'},{label:'Total',value:'O/U 220.5'}],
    modelHook: { fn:'dml', args:['SAS-MIN',1] },
    reasoning: "<strong>Edwards is expected to play (Shams, May 4).</strong> Line moved from -11.5 to -9.5. Edwards at 80% (knee) still transforms MIN, but SAS at Frost Bank Center (62-20) with Wemby healthy (34ppg vs MIN) is extremely tough. DiVincenzo OUT for the season — MIN 3PT depth is gutted. Fox/Castle/Champagnie give SAS bench advantage.",
    confidence: 'best-bet', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'MIN 104-102' },
  },
  {
    id: 'r2-g1-sas-min-under',
    slate: 'R2-G1', series: 'SAS-MIN', game: 1, postedAt: '2026-05-04',
    type: 'total', pick: 'Under 220.5', odds: '-105',
    facts: [{label:'Pace',value:'Edwards limited reduces transition'}],
    modelHook: { fn:'dml', args:['SAS-MIN',1] },
    reasoning: "Edwards at 80% means fewer transition opportunities. SAS plays half-court controlling pace. Both teams have elite rim protectors (Wemby, Gobert). Model projects 217 total — 3.5pts under the line.",
    confidence: 'medium', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'206 total' },
  },
  {
    id: 'r2-g1-sas-min-wemby-pts',
    slate: 'R2-G1', series: 'SAS-MIN', game: 1, postedAt: '2026-05-04',
    type: 'prop', pick: 'Wembanyama Over 24.5 points', odds: '-110',
    facts: [{label:'vs MIN',value:'34ppg reg season'},{label:'Matchup',value:'Gobert mid-range feast'}],
    reasoning: "Wemby averaged 34ppg vs MIN — Gobert protects the rim but Wemby's mid-range is unguardable at 7-4. Had 17/14/6blk in closeout G5 while coasting. In a competitive R2 G1, expect him to assert early. One of the strongest props on the slate.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: { outcome:'loss', actual:'11pts (5-17, 0-8 3PT)' },
  },
  {
    id: 'r2-g1-sas-min-edwards-under',
    slate: 'R2-G1', series: 'SAS-MIN', game: 1, postedAt: '2026-05-04',
    type: 'prop', pick: 'Edwards Under 26.5 points (if playing)', odds: '-115',
    facts: [{label:'Capacity',value:'~80% (knee)'},{label:'Minutes',value:'Likely 28-32'}],
    reasoning: "Edwards coming off knee hyperextension + bone bruise will play limited minutes (28-32) without usual explosion. SAS wing D (Castle, Barnes, Champagnie) is elite. Expect jump shots over rim attacks. At 80%, efficiency drops to 20-24pt range.",
    confidence: 'medium', thesis: ['matchup','situational'], narrative: null,
    result: { outcome:'win', actual:'18pts in 25min' },
  },

  // ─── DET-CLE G1 — DET 111-101 ────────────────────────────────
  {
    id: 'r2-g1-det-cle-ml',
    slate: 'R2-G1', series: 'DET-CLE', game: 1, postedAt: '2026-05-05',
    type: 'ml', pick: 'DET ML vs CLE', odds: '-155',
    facts: [{label:'Spread',value:'DET -3.5'},{label:'Total',value:'O/U 214.5'}],
    modelHook: { fn:'dml', args:['DET-CLE',1] },
    reasoning: "<strong>The closest R2 matchup.</strong> Both finished grueling G7s with equal rest (3 days). DET has #1 defense (107.2 DRtg) and best home record (31-9). CLE has triple-initiator offense (Mitchell/Harden/Mobley). Cade showed dual-mode (45pts G5, 32/12ast G7). Harris G7 breakout (30pts, 5/7 3PT) gives DET a legit #2. But CLE bench (Strus, Tyson, Merrill) is elite. NOT a best bet — small play or skip.",
    confidence: 'lean', thesis: ['model','situational'], narrative: null,
    result: { outcome:'win', actual:'DET 111-101' },
  },
  {
    id: 'r2-g1-det-cle-under',
    slate: 'R2-G1', series: 'DET-CLE', game: 1, postedAt: '2026-05-05',
    type: 'total', pick: 'Under 214.5', odds: '-110',
    facts: [{label:'Defense',value:'DET #1 (107.2 DRtg)'},{label:'Rest',value:'Both off G7s'}],
    modelHook: { fn:'dml', args:['DET-CLE',1] },
    reasoning: "<strong>Best value bet on the R2 G1 slate.</strong> DET has #1 defense (107.2 DRtg). Both teams just played 7-game series with 3 days rest. G1s in R2 after 7-game R1s historically run ~5pts under total. CLE relies on Mitchell/Harden creation but DET perimeter D (A.Thompson, D-LEBRON 2.93) will suppress first-option scoring. Model at 209 vs line at 214.5 = 5.5pts of edge.",
    confidence: 'best-bet', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'212 total' },
  },
  {
    id: 'r2-g1-det-cle-cade-pts',
    slate: 'R2-G1', series: 'DET-CLE', game: 1, postedAt: '2026-05-05',
    type: 'prop', pick: 'Cade Cunningham Over 24.5 points', odds: '-115',
    facts: [{label:'G7',value:'32pts'},{label:'R1',value:'25+ in 5/7 games'},{label:'Venue',value:'LCA home'}],
    reasoning: "Cade showed dual-mode dominance (45 G5, 32/12ast G7). Against CLE, expect scorer mode — Mitchell/Harden won't guard him. At home in LCA, he attacks early to set the tone. The 24.5 line is very beatable.",
    confidence: 'medium', thesis: ['model'], narrative: null,
    result: { outcome:'loss', actual:'23pts' },
  },
  {
    id: 'r2-g1-det-cle-mitchell-pts',
    slate: 'R2-G1', series: 'DET-CLE', game: 1, postedAt: '2026-05-05',
    type: 'prop', pick: 'Donovan Mitchell Over 24.5 points', odds: '-115',
    facts: [{label:'Clutch',value:'8.5 rating'},{label:'R1',value:'26.8ppg'},{label:'Style',value:'Physical = FTAs'}],
    reasoning: "Mitchell has 8.5 clutch rating and averaged 26.8pts in R1. Against DET defense, he'll need to be aggressive — expect 7+ FTA. His mid-range game is harder to suppress than 3PT. Even in losses, Mitchell consistently scores 25+.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: { outcome:'loss', actual:'24pts (8-19)' },
  },

  // ─── OKC-LAL G1 — OKC 108-90 (+18) ───────────────────────────
  {
    id: 'r2-g1-okc-lal-ml',
    slate: 'R2-G1', series: 'OKC-LAL', game: 1, postedAt: '2026-05-05',
    type: 'ml', pick: 'OKC ML vs LAL', odds: '-1050',
    facts: [{label:'Spread',value:'OKC -15.5'},{label:'Total',value:'O/U 213.5'}],
    modelHook: { fn:'dml', args:['OKC-LAL',1] },
    reasoning: "<strong>OKC is the most complete team in the NBA (64-18, +11.6 NetRtg) vs Doncic-less LAL.</strong> OKC went 4-0 vs LAL with 31.8pt avg margin. Swept PHX in R1 with 11 days rest. SGA (31.1ppg, 67% TS) feasts on LAL's limited perimeter D. LeBron at 41 is a fatigue risk. Holmgren neutralizes Ayton. OKC depth means no drop-off. ML is safe but expensive — best in a parlay.",
    confidence: 'best-bet', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'OKC 108-90' },
  },
  {
    id: 'r2-g1-okc-lal-spread',
    slate: 'R2-G1', series: 'OKC-LAL', game: 1, postedAt: '2026-05-05',
    type: 'spread', pick: 'OKC -15.5', odds: '-110',
    facts: [{label:'Risk',value:'LeBron floor'}],
    modelHook: { fn:'dml', args:['OKC-LAL',1] },
    reasoning: "Model says {{winner}} by {{margin}}. OKC's 31.8pt avg margin vs LAL suggests upside, but LeBron provides a floor. The smart play is ML in a parlay, not the spread alone.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'OKC by 18' },
  },
  {
    id: 'r2-g1-okc-lal-sga-pts',
    slate: 'R2-G1', series: 'OKC-LAL', game: 1, postedAt: '2026-05-05',
    type: 'prop', pick: 'SGA Over 28.5 points', odds: '-115',
    facts: [{label:'R1',value:'31.1ppg on 67% TS'},{label:'Rest',value:'11 days'},{label:'Defense',value:'LAL has none w/o Doncic'}],
    reasoning: "SGA averaged 31.1ppg on 67% TS in R1 vs PHX's better defense. With 11 days rest, he'll be fully loaded. Smart is solid but can't contain SGA for 36min. The 28.5 line is well below his playoff average.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: { outcome:'loss', actual:'18pts (7 TOs)' },
  },
  {
    id: 'r2-g1-okc-lal-lebron-pts',
    slate: 'R2-G1', series: 'OKC-LAL', game: 1, postedAt: '2026-05-05',
    type: 'prop', pick: 'LeBron Over 25.5 points', odds: '-110',
    facts: [{label:'Mode',value:'Legacy'},{label:'Usage',value:'Higher w/o Doncic'},{label:'Hedge',value:'Hits in any game script'}],
    reasoning: "LeBron carries massive usage without Doncic (28.2ppg R1 at 41). In a blowout, OKC pulls starters and LeBron scores against the bench. In a competitive game, he scores on volume. The over hits regardless of game script.",
    confidence: 'medium', thesis: ['situational'], narrative: 'desperation',
    result: { outcome:'win', actual:'27pts (12-17)' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G2 — LIVE PICKS (Tue May 6 / Wed May 7 / Thu May 7)
  // ═══════════════════════════════════════════════════════════════

  // ─── NYK-PHI G2 (Tue May 6, 7:30 PM ET @ MSG, NYK leads 1-0) ──
  {
    id: 'r2-g2-nyk-phi-ml',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'ml', pick: 'NYK ML vs PHI', odds: '-260',
    facts: [{label:'Spread',value:'NYK -6.5'},{label:'Total',value:'O/U 214.5'}],
    modelHook: { fn:'dml', args:['NYK-PHI',2] },
    reasoning: "<strong>NYK won G1 by 39 — most lopsided R2 game in a decade.</strong> PHI gets 2 extra days rest which helps, and Embiid historically bounces back after bad games. But NYK's systemic advantages remain: MSG home court (9.2 clutch NetRtg), Brunson locked in (35pts on 67% FG), depth that suffocated PHI's 7-man rotation. NYK shooting will regress from 63%/51% — but even at normal efficiency they win by 6+. Embiid's conditioning post-appendectomy remains a Q3/Q4 concern.",
    confidence: 'best-bet', thesis: ['model','situational'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-nyk-phi-spread',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'spread', pick: 'NYK -6.5', odds: '-110',
    facts: [{label:'Edge',value:'vs spread'}],
    modelHook: { fn:'dmargin', args:['NYK-PHI',2] },
    reasoning: "Model says {{winner}} by {{margin}}. PHI's rest helps but bench depth remains a fatal flaw. If Embiid has bounce-back (28+ pts), PHI covers. If not, NYK wins by 8-12. Lean NYK but this is the riskier play vs ML.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-nyk-phi-brunson-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Jalen Brunson Over 26.5 points', odds: '-120',
    facts: [
      {label:'G1',value:'35pts (12-18 FG)'},
      {label:'Playoff avg',value:'28.6pts'},
      {label:'Venue',value:'MSG home'},
      {label:'Matchup',value:'PnR vs Embiid/Drummond'},
    ],
    chs: { delta: +2.5, tone: 'boost' },
    reasoning: "<strong>Brunson dropped 35 in G1 on 67% FG — and the line is only 26.5.</strong> PHI has no answer for the Brunson-KAT PnR. Embiid can't switch at speed post-appendectomy. Drummond is BBQ chicken. Brunson has hit O27.5 in 6 of his last 8 playoff games. At MSG, he's virtually guaranteed 25+ floor with 35+ ceiling. <strong style=\"color:var(--purple)\">CHS boost:</strong> Historical home-vs-PHI + PnR-mismatch scenarios add +2.5pts to projection (27→29.5).",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-nyk-phi-embiid-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Joel Embiid Over 22.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'only 14pts (3-11)'},
      {label:'Spot',value:'Bounce-back'},
      {label:'Rest',value:'2 extra days'},
    ],
    chs: { delta: 'mixed', tone: 'mixed', detail: '-8 / +4' },
    reasoning: "Embiid's 14pts in G1 was his worst playoff game in 3 years. With 2 extra days rest, his hip settles and conditioning improves. Historically bounces back hard after bad games (avg 32pts in bounce-back games). <strong style=\"color:var(--purple)\">CHS tension:</strong> Two competing scenarios — post-appendectomy + blowout loss historically correlates with -8pts (conditioning collapse), BUT pride bounce-back after bad games correlates with +4pts. Higher variance than Brunson prop.",
    confidence: 'coin-flip', thesis: ['regression','historical'], narrative: 'bounce-back',
    result: null,
  },
  {
    id: 'r2-g2-nyk-phi-anunoby-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'OG Anunoby Over 14.5 points', odds: '-110',
    facts: [{label:'G1',value:'18pts (7-8 FG)'},{label:'Trend',value:'Elite efficiency continues'}],
    reasoning: "OG went 7-8 from the field in G1 — PHI has no one who can match his combination of size and skill. With Brunson drawing doubles, OG gets clean looks. He's averaged 15.2pts in the last 6 playoff games. The 14.5 line undervalues his current hot streak.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: null,
  },

  // ─── SAS-MIN G2 (Wed May 7, 9:00 PM ET @ Frost Bank, MIN leads 1-0) ──
  {
    id: 'r2-g2-sas-min-ml',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '-220',
    facts: [{label:'Spread',value:'SAS -5.5'},{label:'Total',value:'O/U 216.5'}],
    modelHook: { fn:'dml', args:['SAS-MIN',2] },
    reasoning: "<strong>SAS shot 28% 3PT in G1 (10-36) vs their 37.5% season average.</strong> That's ~3.5 extra makes expected in G2 = +10.5pts of shooting regression alone. Wemby's 0-8 3PT was a career aberration — he's a 37.5% shooter who will bounce back. Fox (0-4 3PT, -13) is also due. MIN proved competitive but needed SAS to have their worst shooting game all season to win by 2. Dosunmu returns for MIN which helps, but the math strongly favors SAS regression.",
    confidence: 'best-bet', thesis: ['regression','model'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-sas-min-spread',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'spread', pick: 'SAS -5.5', odds: '-110',
    facts: [{label:'Logic',value:'Regression supports it'}],
    modelHook: { fn:'dmargin', args:['SAS-MIN',2] },
    reasoning: "Model says {{winner}} by {{margin}}. If Wemby makes just 2 threes (his season avg is 2.8/game), that adds 6pts to G1's margin and SAS wins by ~8. Edwards' minutes will expand but knee limits explosiveness. Lean cover but it's razor-thin.",
    confidence: 'lean', thesis: ['regression','model'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-sas-min-wemby-pts',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Victor Wembanyama Over 22.5 points', odds: '-125',
    facts: [
      {label:'G1',value:'only 11pts (5-17, 0-8 3PT)'},
      {label:'Season avg',value:'24.8'},
      {label:'vs MIN',value:'34ppg reg season'},
    ],
    chs: { delta: +3.8, tone: 'boost' },
    reasoning: "<strong>Wemby scored only 11pts in G1 on his worst shooting night ever (0-8 3PT, 5-17 FG).</strong> This is a 24.8ppg scorer who averaged 34ppg vs MIN in the regular season. The 0-8 3PT is a statistical anomaly for a 37.5% shooter — regression alone adds 8-10pts to his scoring output. <strong style=\"color:var(--purple)\">CHS boost:</strong> Compound scenarios (post-bad-shooting + home court + vs-Gobert-mismatch) add +3.8pts to projection, pushing expected output to 28-30pts. CHS and statistical regression align — strongest convergence signal on the board.",
    confidence: 'high', thesis: ['regression','matchup','historical'], narrative: 'bounce-back',
    result: null,
  },
  {
    id: 'r2-g2-sas-min-edwards-pts',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Anthony Edwards Over 19.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'18pts in 25min'},
      {label:'Minutes',value:'Expect 30+ G2'},
      {label:'Health',value:'Knee holding'},
    ],
    chs: { delta: -5.0, tone: 'caution' },
    reasoning: "Edwards scored 18pts in just 25min in G1 (8-13 FG = 62%). If knee holds, expect 30+ minutes and likely a starting role in G2. <strong style=\"color:var(--purple)\">CHS caution:</strong> Historical scenarios for knee-restricted players in away R2 games show -5pts suppression (limited explosion, fewer drives, more jump shots against elite rim protection). The 19.5 line is actually well-calibrated when CHS is applied — this becomes a coin flip prop rather than a clear over. Proceed with caution.",
    confidence: 'coin-flip', thesis: ['historical','situational'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-sas-min-fox-pts',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: "De'Aaron Fox Over 17.5 points", odds: '-110',
    facts: [
      {label:'G1',value:'only 10pts (5-14, 0-4 3PT, -13)'},
      {label:'Season avg',value:'18.5'},
    ],
    reasoning: "Fox had his worst game of the playoffs in G1 — passive, 0-4 3PT, -13. Coaching staff will demand more PnR aggression with Wemby. His season avg is 18.5ppg and he averaged 20+ in R1. The 17.5 line is deflated by G1 — bounce-back to 20+ is likely.",
    confidence: 'medium', thesis: ['regression','matchup'], narrative: 'bounce-back',
    result: null,
  },

  // ─── DET-CLE G2 (Thu May 7, 7:00 PM ET @ LCA, DET leads 1-0) ──
  {
    id: 'r2-g2-det-cle-ml',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-06',
    type: 'ml', pick: 'DET ML vs CLE', odds: '-190',
    facts: [{label:'Spread',value:'DET -4.5'},{label:'Total',value:'O/U 214.5'}],
    modelHook: { fn:'dml', args:['DET-CLE',2] },
    reasoning: "<strong>DET's #1 defense forced 19 CLE turnovers in G1 — that's structural, not variance.</strong> Ivey/Cunningham/Thompson trapping scheme overwhelms CLE's ball-handlers. Allen limited to 18min (knee) — if he's still compromised, CLE loses their rim protection + lob threat. Cade controls tempo masterfully (23pts, 7ast, only 2 TOs). DET's closing burst (18-8 run after 93-93 tie) shows killer instinct. CLE's triple-initiator attack works but DET strips the ball before plays develop.",
    confidence: 'best-bet', thesis: ['model','matchup'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-det-cle-spread',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-06',
    type: 'spread', pick: 'DET -4.5', odds: '-110',
    facts: [{label:'Risk',value:'CLE coaching adjust + Allen return'}],
    modelHook: { fn:'dmargin', args:['DET-CLE',2] },
    reasoning: "Model says {{winner}} by {{margin}}. CLE coaching adjustments expected (faster ball movement to beat traps, less Mitchell ISO). But DET's turnover generation is scheme-based — hard to adjust away from in one practice. If Allen plays 30+min, CLE's ceiling rises and this becomes a GRIND. Lean cover.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-det-cle-cade-pts',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Cade Cunningham Over 21.5 points', odds: '-120',
    facts: [
      {label:'G1',value:'23pts (8-16 FG)'},
      {label:'Series proj',value:'22-26pts'},
    ],
    chs: { delta: -0.9, tone: 'caution' },
    reasoning: "<strong>Cade had 23pts + 7ast in G1 — completely controlled the game.</strong> CLE has no elite POA defender to match him. Mitchell/Garland are undersized and can't bother his size (6'6). His PnR with Duren generated 8 easy buckets. <strong style=\"color:var(--purple)\">CHS note:</strong> Compound scenarios show -0.9pts suppression from CLE's blitzing scheme (trapping ball-handlers, forcing turnovers). Minor enough that the Over still has edge at 21.5 — Cade's G1 floor of 23 is well above the line. CHS drag is minimal.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-det-cle-mitchell-pts',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Donovan Mitchell Over 24.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'24pts (8-19 FG)'},
      {label:'Spot',value:'Bounce-back from 6 TOs'},
    ],
    chs: { delta: +4.0, tone: 'boost' },
    reasoning: "Mitchell scored 24 but had 6 turnovers in G1. With CLE adjusting to hold the ball tighter, his scoring attempts should increase. <strong style=\"color:var(--purple)\">CHS boost:</strong> Compound scenarios for Mitchell post-loss + DET's aggressive trapping scheme historically correlate with +4pts bounce-back (volume increase + free throw aggression). CHS projects 28-30pts. The line at 24.5 is well below CHS-adjusted projection — strong over.",
    confidence: 'medium', thesis: ['historical','regression'], narrative: 'bounce-back',
    result: null,
  },

  // ─── OKC-LAL G2 (Thu May 7, 9:30 PM ET @ Paycom, OKC leads 1-0) ──
  {
    id: 'r2-g2-okc-lal-ml',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-06',
    type: 'ml', pick: 'OKC ML vs LAL', odds: '-800',
    facts: [{label:'Spread',value:'OKC -14.5'},{label:'Total',value:'O/U 204.5'}],
    modelHook: { fn:'dml', args:['OKC-LAL',2] },
    reasoning: "<strong>OKC won G1 by 18 with SGA having his WORST game of the year (7 TOs).</strong> That's the floor — and it was an 18-point win. J.Williams returns with increased minutes (20min G1 → 25-28min G2) adding secondary creation. Reaves is at 50% capacity (3-16 FG, oblique severe). LeBron can score 30 and it doesn't matter — LAL has NO depth to compete with OKC's bench (outscored LAL 34-15). Holmgren owns the Ayton matchup (24/12/3blk). The -800 is justified — this is the most lopsided matchup in R2.",
    confidence: 'best-bet', thesis: ['model','matchup'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-okc-lal-spread',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-06',
    type: 'spread', pick: 'OKC -14.5', odds: '-110',
    facts: [{label:'G1',value:'OKC by 18'},{label:'Risk',value:'Garbage time backdoor'}],
    modelHook: { fn:'dmargin', args:['OKC-LAL',2] },
    reasoning: "Model says OKC by {{margin}}. G1 was +18 with SGA at his worst. With SGA cleaning up TOs (7→3 expected) and J.Williams ramping, OKC gets STRONGER. LAL has no adjustment available — their problem is personnel (Reaves hurt, no Doncic, no bench). Only risk: OKC garbage time gives LAL backdoor cover. Lean spread but ML is safer.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-okc-lal-holmgren-pts',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Chet Holmgren Over 18.5 points', odds: '-125',
    facts: [
      {label:'G1',value:'24pts (9-17 FG, 3-7 3PT)'},
      {label:'Matchup',value:'Owns Ayton'},
      {label:'Defense',value:'3blk rim dominance'},
    ],
    reasoning: "<strong>Holmgren dropped 24/12/3blk in G1 — completely dominated Ayton.</strong> His combination of 7'1 length, 3PT shooting (3-7), and rim protection gives Ayton nightmares. The matchup is solved — Ayton can't guard Holmgren's perimeter game and can't finish over his length. Even if OKC wins big and Holmgren sits Q4, he's a 20+ scorer in 3 quarters. Line too low.",
    confidence: 'high', thesis: ['matchup'], narrative: null,
    result: null,
  },
  {
    id: 'r2-g2-okc-lal-sga-pts',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'SGA Over 24.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'only 18pts (7 TOs)'},
      {label:'Career avg',value:'31.1ppg'},
    ],
    chs: { delta: +2.3, tone: 'boost' },
    reasoning: "SGA's 18pts in G1 was his worst scoring game since December — driven by 7 TOs (career avg 2.8). The 24.5 line accounts for the G1 dip but vastly underestimates his bounce-back. <strong style=\"color:var(--purple)\">CHS boost:</strong> Compound scenarios (post-turnover correction + home court + weak perimeter defense) add +2.3pts. CHS projects 28-30pts, well above the 24.5 line. Both regression and CHS agree — this is the highest-conviction bounce-back prop on the board.",
    confidence: 'medium', thesis: ['regression','historical'], narrative: 'bounce-back',
    result: null,
  },
  {
    id: 'r2-g2-okc-lal-lebron-pts',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'LeBron James Over 26.5 points', odds: '-110',
    facts: [
      {label:'G1',value:'27pts (12-17 FG, 71%)'},
      {label:'Volume',value:'Increases as LAL gets desperate'},
    ],
    reasoning: "LeBron shot 71% in G1 and scored 27 — down 0-1 he'll be even more aggressive. With Reaves compromised and Kennard benched, LeBron's usage will increase. He's the only LAL player capable of scoring 25+ against OKC's defense. Expect 28-32pts on high volume even in a loss.",
    confidence: 'medium', thesis: ['situational','matchup'], narrative: 'desperation',
    result: null,
  },
  {
    id: 'r2-g2-okc-lal-under',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-06',
    type: 'total', pick: 'Under 204.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'198'},
      {label:'Defense',value:'OKC elite'},
      {label:'LAL',value:'Half-court struggles'},
    ],
    reasoning: "<strong>G1 total was only 198 — well under the 213.5 line.</strong> OKC's defense held LAL to 42% FG and 33% 3PT. LAL can't score in the half-court against OKC's length (Holmgren, Dort, Wallace). Pace will be slow again — LAL grinds possessions trying to create vs OKC's switching. The 204.5 adjusted line still feels too high. Lean under.",
    confidence: 'medium', thesis: ['model','historical'], narrative: null,
    result: null,
  },
];

// ============================================================
// Slate metadata — header info for each slate's series
// ============================================================
const BET_SLATES = {
  'R2-G1': {
    label: 'Round 2 — Game 1 (Archive)',
    games: [
      { series:'NYK-PHI', when:'Sun May 4, 8:00 PM ET @ MSG', context:'Series 0-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 137-98 — most lopsided R2 G1 in a decade. Brunson 35pts (12-18 FG). Embiid 14pts (3-11). PHI 48hr turnaround was catastrophic.' },
      { series:'SAS-MIN', when:'Sun May 4, 9:30 PM ET @ Frost Bank Center', context:'Series 0-0',
        recap:'<strong style="color:var(--red)">Result:</strong> MIN 104-102 (UPSET). Wemby 0-8 3PT (career worst) but 15reb/12blk. Edwards off bench: 18pts in 25min. SAS shot 28% 3PT (10-36).' },
      { series:'DET-CLE', when:'Mon May 5, 7:00 PM ET @ LCA', context:'Series 0-0',
        recap:'<strong style="color:var(--green)">Result:</strong> DET 111-101. Cade 23/7ast, D.Robinson 19pts (5-8 3PT). DET forced 19 CLE TOs. Allen limited to 18min (knee).' },
      { series:'OKC-LAL', when:'Mon May 5, 8:30 PM ET @ Paycom Center', context:'Series 0-0',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 108-90 (+18). Holmgren 24/12/3blk. SGA only 18pts (7 TOs!) but OKC still dominated. Reaves catastrophic 3-16 FG.' },
    ],
  },
  'R2-G2': {
    label: 'Round 2 — Game 2 (Live)',
    games: [
      { series:'NYK-PHI', when:'Tue May 6, 7:30 PM ET @ MSG', context:'NYK leads 1-0',
        recap:'<strong style="color:var(--green)">G1 Recap:</strong> NYK 137-98 blowout. Brunson 35pts (12-18 FG). NYK shot 63% FG, 51% 3PT. Embiid was a shell (3-11, -24). Maxey 3-9, 4TO. PHI fatigue from 48hr turnaround was catastrophic. <strong>Key G2 Factor:</strong> PHI has 2 extra days rest now. Shooting regression expected for NYK. Embiid\'s pride bounce-back is the variable.' },
      { series:'SAS-MIN', when:'Wed May 7, 9:00 PM ET @ Frost Bank Center', context:'MIN leads 1-0',
        recap:'<strong style="color:var(--yellow)">G1 Recap:</strong> MIN 104-102 upset. Wemby 0-8 3PT (career worst) but 15reb/12blk. Edwards off bench: 18pts in 25min. Fox -13 (0-4 3PT). SAS shot 28% 3PT (10-36). MIN won Q4 35-30. <strong>Key G2 Factor:</strong> Wemby\'s 3PT regresses to 37.5% mean. Fox must be aggressive. Dosunmu returns for MIN.' },
      { series:'DET-CLE', when:'Thu May 7, 7:00 PM ET @ LCA', context:'DET leads 1-0',
        recap:'<strong style="color:var(--green)">G1 Recap:</strong> DET 111-101. Cade 23/7ast, D.Robinson 19pts (5-8 3PT), Duren 14/14reb/clutch block. DET forced 19 CLE TOs (12 steals). Allen limited to 18min/2pts (knee tendonitis). CLE rallied from -18 to 93-93 but DET closed on a 18-8 run. <strong>Key G2 Factor:</strong> Allen\'s knee status (QUESTIONABLE). DET turnover generation structural or CLE adjusts? Garland bounce-back (7-21 G1).' },
      { series:'OKC-LAL', when:'Thu May 7, 9:30 PM ET @ Paycom Center', context:'OKC leads 1-0',
        recap:'<strong style="color:var(--green)">G1 Recap:</strong> OKC 108-90 (+18). Holmgren 24/12/3blk (9-17 FG). SGA only 18pts (7 TOs!) but OKC still dominated. Reaves catastrophic 3-16 FG (0-5 3PT) — oblique severe. J.Williams returned (20min, +11). OKC bench: every player +11 or better. LeBron 27pts (12-17) but zero help. <strong>Key G2 Factor:</strong> SGA turnover correction (career avg 2.8 TOs). J.Williams ramp to 25-28min. Reaves still severely limited.' },
    ],
  },
};
