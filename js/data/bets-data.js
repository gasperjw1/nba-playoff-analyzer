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
    type: 'ml', pick: 'NYK ML vs PHI', odds: '-450 (re-priced)',
    facts: [{label:'Original line',value:'-260'},{label:'After Embiid OUT',value:'-450 to -550'},{label:'Spread',value:'NYK -10.5'}],
    modelHook: { fn:'dml', args:['NYK-PHI',2] },
    reasoning: "🚨 <strong>Embiid OUT — ankle sprain + hip soreness (ruled out morning of game).</strong> The single biggest line-mover possible. PHI loses their 26.9ppg #1 scorer, interior gravity, post-up offense, and foul-drawing. Drummond starts at C — provides rebounding only, no offensive creation, gets pulled out of the paint by KAT stretch-5. NYK was already favored heavily with healthy Embiid; now this is structurally over. Maxey will absorb usage but is shaken from -28 G1. The ML is now expensive but virtually risk-free — best leveraged in a parlay with another correlated leg (Brunson over, NYK -10).",
    confidence: 'best-bet', thesis: ['situational','model','market'], narrative: null,
    result: { outcome: 'win', actual: 'NYK 108-102 (won by 6)' },
  },
  {
    id: 'r2-g2-nyk-phi-spread',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'spread', pick: 'NYK -10.5 (revised from -6.5)', odds: '-110',
    facts: [{label:'Original',value:'NYK -6.5 (pre-Embiid news)'},{label:'Revised',value:'NYK -10.5 to -12.5'}],
    modelHook: { fn:'dmargin', args:['NYK-PHI',2] },
    reasoning: "<strong>Embiid OUT changes everything for the spread.</strong> Without their primary scorer, PHI's ceiling collapses to ~95pts. Model now projects NYK by 12-15. Even at the revised -10.5, this is a clean cover unless NYK plays deep bench in a Q4 garbage-time scenario (possible — they did pull starters in G1 blowout). Best play: NYK -10.5 if available, or pivot to NYK team total over.",
    confidence: 'high', thesis: ['situational','model'], narrative: null,
    result: { outcome: 'loss', actual: 'NYK +6 (108-102) — did not cover -10.5. Phase 56 narrative-driven re-pricing was an overreaction; pre-Embiid-OUT model line of NYK -6.5 was correct.' },
  },
  {
    id: 'r2-g2-nyk-phi-brunson-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Jalen Brunson Over 26.5 points', odds: '-120',
    facts: [
      {label:'G1',value:'35pts (12-18 FG)'},
      {label:'Playoff avg',value:'28.6pts'},
      {label:'Venue',value:'MSG home'},
      {label:'Matchup',value:'PnR vs Drummond (no Embiid)'},
    ],
    chs: { delta: +2.5, tone: 'boost' },
    reasoning: "<strong>Brunson dropped 35 in G1 on 67% FG — and now Embiid is OUT.</strong> Drummond cannot switch in PnR and provides zero perimeter resistance. Without Embiid's interior gravity, NYK can run Brunson-KAT PnR all night with no consequence. Risk: NYK leads big and Brunson sits Q4 (he played only 31min G1 in the blowout). If the game stays close enough for him to play 35+min, this clears 30 easily. Even with garbage-time risk, the floor is 25+. <strong style=\"color:var(--purple)\">CHS boost:</strong> Historical home-vs-PHI + PnR-mismatch +2.5pts.",
    confidence: 'high', thesis: ['matchup','historical','situational'], narrative: null,
    result: { outcome: 'loss', actual: 'Brunson 26pts (9-21 FG) — under 26.5 by half a point. Game stayed close (25 lead changes), Edgecombe defense early held him below his usual ceiling.' },
  },
  {
    id: 'r2-g2-nyk-phi-embiid-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Joel Embiid Over 22.5 points', odds: 'VOID',
    facts: [{label:'Status',value:'BET VOIDED — Embiid OUT'}],
    reasoning: "🚨 <strong>VOIDED — Embiid ruled OUT for G2 (May 6 morning).</strong> Right ankle sprain + right hip soreness. Did not participate in shootaround. All Embiid props void/refunded. Pre-game thesis (CHS-conflicted bounce-back vs conditioning collapse) is moot.",
    confidence: 'medium', thesis: [], narrative: null,
    result: { outcome:'void', actual:'Embiid OUT — bet voided' },
  },
  {
    id: 'r2-g2-nyk-phi-anunoby-pts',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'OG Anunoby Over 14.5 points', odds: '-110',
    facts: [{label:'G1',value:'18pts (7-8 FG)'},{label:'Trend',value:'Elite efficiency continues'},{label:'Embiid OUT',value:'fewer help defenders'}],
    reasoning: "OG went 7-8 from the field in G1 — and now PHI is even more compromised with Embiid OUT. Drummond can't help-defend the perimeter. With Brunson drawing primary attention, OG gets clean looks. He's averaged 15.2pts in the last 6 playoff games. Garbage-time risk applies (NYK could blow this open by Q3) but the floor is solid.",
    confidence: 'medium', thesis: ['matchup'], narrative: null,
    result: { outcome: 'win', actual: 'OG Anunoby 24pts (10-15 FG, 2-4 3PT) — easy cover. Left late with unspecified issue but had clinched the over by then.' },
  },
  {
    id: 'r2-g2-nyk-phi-drummond-reb',
    slate: 'R2-G2', series: 'NYK-PHI', game: 2, postedAt: '2026-05-06',
    type: 'prop', pick: 'Andre Drummond Over 11.5 rebounds', odds: '-115 (typical)',
    facts: [{label:'Starts',value:'at C w/ Embiid OUT'},{label:'Minutes',value:'30+ expected'},{label:'Career',value:'Elite rebounder'}],
    reasoning: "<strong>NEW BET (post-Embiid news):</strong> Drummond gets the start at C with Embiid OUT. He played only 9-20min behind Embiid in prior games but is one of the best per-minute rebounders in NBA history. Expect 30+ min vs KAT/Mitchell Robinson. KAT is a stretch-5 who pulls Drummond outside, opening the offensive glass for putbacks. Even in a blowout loss, Drummond rebounds — his counting stats are blowout-proof. Confirm line is ≤11.5 before betting.",
    confidence: 'medium', thesis: ['situational'], narrative: null,
    result: { outcome: 'loss', actual: 'Drummond 8reb in 24min — got into foul trouble (Bona/Barlow had to cover Cs in emergency). Minutes capped at 24 instead of expected 30+; rebounding chance compressed.' },
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
    result: { outcome: 'win', actual: 'SAS 133-95 — largest playoff loss in MIN franchise history. Regression thesis VALIDATED MASSIVELY (SAS 41% from 3 vs G1 28%). Best bet hit.' },
  },
  {
    id: 'r2-g2-sas-min-spread',
    slate: 'R2-G2', series: 'SAS-MIN', game: 2, postedAt: '2026-05-06',
    type: 'spread', pick: 'SAS -5.5', odds: '-110',
    facts: [{label:'Logic',value:'Regression supports it'}],
    modelHook: { fn:'dmargin', args:['SAS-MIN',2] },
    reasoning: "Model says {{winner}} by {{margin}}. If Wemby makes just 2 threes (his season avg is 2.8/game), that adds 6pts to G1's margin and SAS wins by ~8. Edwards' minutes will expand but knee limits explosiveness. Lean cover but it's razor-thin.",
    confidence: 'lean', thesis: ['regression','model'], narrative: null,
    result: { outcome: 'win', actual: 'SAS 133-95 — covered -5.5 by 32.5 points. Massive blowout.' },
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
    result: { outcome: 'loss', actual: 'Wemby 19/15 — under 22.5 by 3.5. Bounce-back happened (7-12 FG, 1-3 3PT, attacked rim more) but blowout meant he sat early in Q4. CHS boost was right in direction but Wemby gave way to bench in 38pt rout.' },
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
    result: { outcome: 'loss', actual: 'Edwards 12pts (4-13 FG, 1-5 3PT) in 24min off bench. CHS caution was correct: knee + rust + blowout context all suppressed him. 4-way 12pt tie (Edwards/Randle/McDaniels/Shannon) showed nobody could create when down big.' },
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
    result: { outcome: 'loss', actual: 'Fox 16pts (6-12 FG, 2-4 3PT, 7ast) — under 17.5 by 1.5. Bounce-back hit (more efficient than G1) but he sat in Q4 with SAS up 25+. Same blowout-cap issue as Wemby.' },
  },

  // ─── DET-CLE G2 (Thu May 7, 7:00 PM ET @ LCA, DET leads 1-0) ──
  {
    id: 'r2-g2-det-cle-ml',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-07',
    type: 'ml', pick: 'DET ML vs CLE', odds: '-162',
    facts: [{label:'Spread',value:'DET -4.5'},{label:'Total',value:'O/U 214.5'},{label:'Injury',value:'Huerter (DET) GTD thigh; Merrill (CLE) GTD hamstring'}],
    modelHook: { fn:'dml', args:['DET-CLE',2] },
    reasoning: "<strong>DET's #1 defense forced 19 CLE turnovers in G1 — that's structural, not variance.</strong> Ivey/Cunningham/Thompson trapping scheme overwhelms CLE's ball-handlers. <strong>UPDATE (May 6):</strong> Per Yardbarker, Jarrett Allen is OFF the injury report and expected back to full minutes — that raises CLE's ceiling significantly (rim protection + lob threat returns). Mitchell, Cunningham, Mobley all healthy. Huerter (DET) is GTD with a thigh issue, Merrill (CLE) GTD hamstring. With Allen healthy this becomes more of a coin flip than the original best-bet read — DET's turnover scheme is still scheme-based and hard to adjust away from in one practice, but CLE has more ammo. Downgraded from BEST BET to MEDIUM lean.",
    confidence: 'medium', thesis: ['model','matchup'], narrative: null,
    result: { outcome: 'win', actual: 'DET 107-97 — Cade 25/10ast (12 of his 25 in Q4 closing run), Tobias Harris 21, D.Robinson 17 (5-9 3PT). Allen healthy this time (22pts/7reb) but Mitchell\'s 31pts in a loss couldn\'t overcome DET\'s defensive structure.' },
  },
  {
    id: 'r2-g2-det-cle-spread',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-07',
    type: 'spread', pick: 'DET -3.5', odds: '-110',
    facts: [{label:'Risk',value:'CLE coaching adjust + Allen return'}],
    modelHook: { fn:'dmargin', args:['DET-CLE',2] },
    reasoning: "Model says {{winner}} by {{margin}}. CLE coaching adjustments expected (faster ball movement to beat traps, less Mitchell ISO). But DET's turnover generation is scheme-based — hard to adjust away from in one practice. If Allen plays 30+min, CLE's ceiling rises and this becomes a GRIND. Lean cover.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome: 'win', actual: 'DET +10 (107-97) — covered -3.5 by 6.5. Allen (22/7) raised CLE ceiling but Cade\'s Q4 closing run pulled away.' },
  },
  {
    id: 'r2-g2-det-cle-cade-pts',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-07',
    type: 'prop', pick: 'Cade Cunningham Over 27.5 points', odds: '-118',
    facts: [
      {label:'G1',value:'23pts (8-16 FG)'},
      {label:'Series proj',value:'22-26pts'},
    ],
    chs: { delta: -0.9, tone: 'caution' },
    reasoning: "<strong>Cade had 23pts + 7ast in G1 — completely controlled the game.</strong> CLE has no elite POA defender to match him. Mitchell/Garland are undersized and can't bother his size (6'6). His PnR with Duren generated 8 easy buckets. <strong style=\"color:var(--purple)\">CHS note:</strong> Compound scenarios show -0.9pts suppression from CLE's blitzing scheme (trapping ball-handlers, forcing turnovers). Minor enough that the Over still has edge at 21.5 — Cade's G1 floor of 23 is well above the line. CHS drag is minimal.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: 'loss', actual: 'Cade 25pts/10ast — under 27.5 by 2.5 (12 of his 25 in Q4 means he was at ~13 through 3Q). Facilitator-mode game; Q4 closing run got him to 25 but CLE\'s blitzing held volume below the line.' },
  },
  {
    id: 'r2-g2-det-cle-mitchell-pts',
    slate: 'R2-G2', series: 'DET-CLE', game: 2, postedAt: '2026-05-07',
    type: 'prop', pick: 'Donovan Mitchell Under 27.5 points', odds: '-135',
    facts: [
      {label:'G1',value:'24pts (8-19 FG)'},
      {label:'Trend',value:'<24.5 in 6 straight vs top-10 D'},
      {label:'Engine projection',value:'24pts'},
    ],
    chs: { delta: -3.0, tone: 'caution' },
    reasoning: "<strong>FLIP from Over to Under after market re-pricing.</strong> Original line was 24.5; current DK line is 27.5 — books moved up after Mitchell's 24-pt G1 + the expectation he'd bounce back from 6 TOs. But our engine projects 24pts and Mitchell has gone Under 24.5 in 6 straight vs top-10 defenses (avg 20.5). DET has the #1 defense in the league. <strong style=\"color:var(--purple)\">CHS caution:</strong> Compound scenarios for Mitchell vs aggressive trapping defense + cold-shooting LCA crowd suggest 3pt suppression — Mitchell ceiling caps around 25pts. Under 27.5 at -135 is the play.",
    confidence: 'medium', thesis: ['historical','model'], narrative: null,
    result: { outcome: 'loss', actual: 'Mitchell 31pts/3ast/6reb/2stl/2to — game-high. Bounced back hard from G1 — engine projection (24) and CHS suppression read (-3pts) both wrong. The 6-game Under streak vs top-10 D snapped at LCA.' },
  },

  // ─── OKC-LAL G2 (Thu May 7, 9:30 PM ET @ Paycom, OKC leads 1-0) ──
  {
    id: 'r2-g2-okc-lal-ml',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'ml', pick: 'OKC ML vs LAL', odds: '-900',
    facts: [{label:'Spread',value:'OKC -14.5'},{label:'Total',value:'O/U 204.5'}],
    modelHook: { fn:'dml', args:['OKC-LAL',2] },
    reasoning: "<strong>OKC won G1 by 18 with SGA having his WORST game of the year (7 TOs) and Jalen Williams OUT (Grade 1 hamstring).</strong> That's the floor — and it was an 18-point win without their #2 scorer. <strong>G2 update:</strong> J.Williams remains week-to-week per Daigneault — likely still OUT. Reaves is at 50% capacity (3-16 FG, oblique severe). LeBron can score 30 and it doesn't matter — LAL has NO depth to compete with OKC's bench (outscored LAL 34-15). Holmgren owns the Ayton matchup (24/12/3blk). The -800 is justified — this is the most lopsided matchup in R2 even without Williams.",
    confidence: 'best-bet', thesis: ['model','matchup'], narrative: null,
    result: { outcome: 'win', actual: 'OKC 125-107 — won by 18, exactly matching G1 margin. Holmgren 22/9 again, Reaves bounced back to 31 (10-16) but LAL had 21 TOs that OKC turned into 26 pts.' },
  },
  {
    id: 'r2-g2-okc-lal-spread',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'spread', pick: 'OKC -15.5', odds: '-110',
    facts: [{label:'G1',value:'OKC by 18'},{label:'Risk',value:'Garbage time backdoor'}],
    modelHook: { fn:'dmargin', args:['OKC-LAL',2] },
    reasoning: "Model says OKC by {{margin}}. G1 was +18 with SGA at his worst. With SGA cleaning up TOs (7→3 expected) and J.Williams ramping, OKC gets STRONGER. LAL has no adjustment available — their problem is personnel (Reaves hurt, no Doncic, no bench). Only risk: OKC garbage time gives LAL backdoor cover. Lean spread but ML is safer.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome: 'win', actual: 'OKC -15.5 covered by 2.5 (won by 18). 21 LAL TOs gave OKC the cushion — exactly the SGA-recovery + LAL-thin-depth thesis the lean was built on.' },
  },
  {
    id: 'r2-g2-okc-lal-holmgren-pts',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'prop', pick: 'Chet Holmgren Under 22.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'24pts (9-17 FG, 3-7 3PT) vs Hayes'},
      {label:'Playoff avg',value:'18.6 ppg'},
      {label:'Engine projection',value:'17pts'},
      {label:'Note',value:'Line ≈22.5 — verify on DK before placing; daily checklist will refresh'},
    ],
    reasoning: "<strong>FLIP from Over to Under after market re-pricing.</strong> Original line was 18.5 (Holmgren is a 18.6 ppg playoff scorer with a G1 ceiling game); current DK line is around 22.5 after the books raised on his G1 explosion. Engine projects 17pts in G2 — well under the new line. Reasons: (a) blowout context likely caps his Q4 minutes (engine: OKC by 22), (b) G1's 3-7 3PT is regression-vulnerable (career playoff 3PT ~32%), (c) Hartenstein/J.Williams ramping up = fewer FG attempts for Holmgren. Under 22.5 has solid edge per engine + variance.",
    confidence: 'medium', thesis: ['model','regression'], narrative: null,
    result: { outcome: 'win', actual: 'Holmgren 22pts/9reb — squeaked under by 0.5. Engine read (17) too low but the regression-from-G1-ceiling thesis was right; the line being at 22.5 (not 18.5) made this only a half-point cushion.' },
  },
  {
    id: 'r2-g2-okc-lal-sga-pts',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'prop', pick: 'SGA Over 29 points', odds: '-120',
    facts: [
      {label:'G1',value:'18pts (7 TOs — career-anomaly)'},
      {label:'Season avg',value:'31.1 ppg'},
      {label:'Engine projection',value:'36pts'},
      {label:'Line moved',value:'24.5 → 29 (book overcorrected on G1 anomaly)'},
    ],
    chs: { delta: +2.3, tone: 'boost' },
    reasoning: "Line update: was 24.5 (-115), now 29 (-120) on DK. SGA's 18-pt / 7-TO G1 was career-anomaly (regular-season high TO was 5). At 29 the line is back near his playoff avg, but the engine still projects 36pts — bounce-back + home + weak LAL perimeter D (Smart only). <strong style=\"color:var(--purple)\">CHS boost:</strong> Post-turnover correction + home + matchup adds +2.3. The book moved the line up to ~true mean; the engine says he overshoots that mean tonight. Strongest prop on the slate.",
    confidence: 'high', thesis: ['regression','historical','model'], narrative: 'bounce-back',
    result: { outcome: 'loss', actual: 'SGA 22pts — under 29 by 7. Foul trouble limited him; OKC still won by 18 because Holmgren and the bench did the damage. Engine\'s 36-pt projection and CHS +2.3 boost both wildly off — TWO straight games SGA failed to dominate scoring-wise yet OKC up 2-0.' },
  },
  {
    id: 'r2-g2-okc-lal-lebron-pts',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'prop', pick: 'LeBron James Over 23.5 points', odds: '+185',
    facts: [
      {label:'G1',value:'27pts (12-17 FG, 71%)'},
      {label:'Engine projection',value:'25pts'},
      {label:'Line moved',value:'26.5 → 23.5 (book aggressive on Under at -250)'},
      {label:'Risk',value:'Garbage time / blowout caps minutes'},
    ],
    reasoning: "<strong>Marginal play — book strongly favors Under (-250) at 23.5.</strong> Original line was 26.5 (-110); current DK line is 23.5 with Over priced at +185 / Under at -250. The book is signaling that LeBron's Q4 minutes will be capped by an OKC blowout. Engine projects 25pts (slim 1.5pt over edge). LeBron-as-only-LAL-scorer thesis still holds, but blowout-cap risk is real. The +185 plus odds reflect reality — only worth a small stake. SKIP if you're risk-averse, lean Over only for the price.",
    confidence: 'lean', thesis: ['situational','matchup'], narrative: 'desperation',
    result: { outcome: 'loss', actual: 'LeBron 23pts (9-18, 6 ast) — under 23.5 by 0.5. Book read it perfectly — Reaves took the scoring load (31), LeBron facilitator-mode in a blowout context. Same 0.5-pt heartbreak pattern as Brunson 5/6.' },
  },
  {
    id: 'r2-g2-okc-lal-under',
    slate: 'R2-G2', series: 'OKC-LAL', game: 2, postedAt: '2026-05-07',
    type: 'total', pick: 'Under 209.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'198'},
      {label:'Defense',value:'OKC elite'},
      {label:'LAL',value:'Half-court struggles'},
    ],
    reasoning: "<strong>G1 total was only 198 — well under the 213.5 line.</strong> OKC's defense held LAL to 42% FG and 33% 3PT. LAL can't score in the half-court against OKC's length (Holmgren, Dort, Wallace). Pace will be slow again — LAL grinds possessions trying to create vs OKC's switching. The 204.5 adjusted line still feels too high. Lean under.",
    confidence: 'medium', thesis: ['model','historical'], narrative: null,
    result: { outcome: 'loss', actual: 'Total 232 — over 209.5 by 22.5. LAL\'s offense actually clicked (Reaves 31, LeBron 23, but the 21 TOs flipped into easy OKC transition pts pushed pace+conversion well above G1\'s grind. The "OKC slow grind" thesis broke when LAL turned the ball over instead of playing methodical half-court.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G3 — LIVE PICKS (Fri May 8: NYK-PHI + SAS-MIN)
  // ═══════════════════════════════════════════════════════════════

  // ─── NYK-PHI G3 (Fri May 8, 7:00 PM ET @ Wells Fargo, NYK leads 2-0) ──
  {
    id: 'r2-g3-nyk-phi-ml',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'ml', pick: 'NYK ML vs PHI', odds: '+100',
    facts: [
      {label:'Spread',value:'PHI -1.5'},
      {label:'Total',value:'O/U 214.5'},
      {label:'Series',value:'NYK leads 2-0'},
      {label:'Embiid',value:'GTD per pre-game (back from 5/6 OUT)'},
      {label:'OG Anunoby',value:'Questionable (left G2 late, did not return)'},
    ],
    modelHook: { fn:'dml', args:['NYK-PHI',3] },
    reasoning: "<strong>NYK ML at +100 is the cleanest value on the slate.</strong> The model has NYK by 6 even with HCA flipping to PHI; DK has it pickem-ish (PHI -1.5 / NYK +100). That's a 7-pt model edge on a coin-flip price. The case for NYK: (a) 2-0 lead → no desperation, can play loose, (b) Brunson + KAT + Bridges trio still healthier than PHI's stars, (c) +9.2 clutchNetRtg for closing tight games — NYK won G2 19-12 in Q4 despite worse shooting. The case for PHI: (a) Embiid back tightens the math significantly — interior gravity returns, (b) Brunson's road FT volume drops sharply (3.3 makes road vs 6.6 at MSG), (c) PHI desperation, (d) home crowd. <strong>Net read:</strong> If Embiid plays at 75%+ AND OG is OUT, PHI by 2-3 is fair. If OG plays OR Embiid is genuinely limited, NYK by 4-6. Given the 50/50 on those swing factors, NYK +100 is the better side of the model edge.",
    confidence: 'medium', thesis: ['model','market','situational'], narrative: null,
    result: { outcome:'win', actual:'NYK 108-94 (NYK won outright at +100)' },
  },
  {
    id: 'r2-g3-nyk-phi-spread',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'spread', pick: 'NYK +1.5', odds: '-105',
    facts: [
      {label:'Model',value:'NYK by 6'},
      {label:'Market',value:'PHI -1.5'},
      {label:'Cushion',value:'7.5pts model vs market'},
    ],
    modelHook: { fn:'dmargin', args:['NYK-PHI',3] },
    reasoning: "Stacking the same edge as the ML — model says NYK by 6, market gives them +1.5. Even if Embiid plays well and PHI wins, the 1.5-pt cushion is meaningful (G2 was a 6-pt game with 25 lead changes — the kind of finish where the spread is the better bet than the ML). Risk: if Embiid is BACK and dominant + crowd lifts PHI, a 5-7 pt PHI win is plausible.",
    confidence: 'medium', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'NYK won by 14 (108-94, line +1.5 covered easily)' },
  },
  {
    id: 'r2-g3-nyk-phi-brunson-pts',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Jalen Brunson Under 26.5 points', odds: '-118',
    facts: [
      {label:'Series avg',value:'30.5 ppg (35 G1, 26 G2)'},
      {label:'Road FT',value:'3.3 makes road vs 6.6 at MSG'},
      {label:'PHI defense',value:'Will continue G2 doubling/blitzing scheme'},
    ],
    chs: { delta: -2.0, tone: 'caution' },
    reasoning: "<strong>FLIP from Over to Under for road game.</strong> Brunson's 35-26 in G1-G2 is misleading — G1 was a 39-pt blowout where he played 31min with full ceiling-mode; G2 PHI shifted to blitzing/double-teaming and held him to 9-21 FG (43%). The blitzing scheme persists G3 + the road FT volume drop (per game logs, Brunson averages 3.3 made FT on road vs 6.6 at MSG — that's 3 fewer points right there). At 26.5 with the trend toward 23-25 expected, Under has clear edge. <strong style=\"color:var(--purple)\">CHS caution:</strong> Road game + opponent-adjustment scheme + FT compression compounds to -2.0pts.",
    confidence: 'medium', thesis: ['matchup','historical'], narrative: null,
    result: { outcome:'loss', actual:'Brunson 33pts (11-22 FG, 38min) — 24th career 30+ playoff game; under 26.5 missed' },
  },
  {
    id: 'r2-g3-nyk-phi-kat-reb',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'KAT Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'G1',value:'17/6/1ast'},
      {label:'G2',value:'20/10reb/7ast (full triple-double-line)'},
      {label:'Matchup',value:'vs Drummond/Bona/Barlow (Embiid-out fallback Cs)'},
      {label:'Note',value:'If Embiid plays, KAT pulls him out of paint = even more rebounding lanes'},
    ],
    reasoning: "KAT had a near-triple-double in G2 (20/10/7) and his rebounding has been consistently strong in this series. PHI's interior is thin; even if Embiid returns, KAT's stretch-5 game pulls him out of the paint, opening up offensive boards. KAT averaged 9.6rpg in the regular season and has cleared 9.5 in 7 of last 10 playoff games. The line is well-calibrated — small edge on the over.",
    confidence: 'medium', thesis: ['matchup','historical'], narrative: null,
    result: { outcome:'win', actual:'KAT 12 reb (8pts/12reb/7ast in 26min, 4 OREB) — over 9.5 hit' },
  },
  {
    id: 'r2-g3-nyk-phi-brunson-ast',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Jalen Brunson Over 4.5 assists', odds: '-145',
    facts: [
      {label:'Career playoff avg',value:'7.0 ast/game'},
      {label:'Series',value:'3 G1 (blowout, 31min), 5 G2 (38min)'},
      {label:'PHI doubling',value:'Forces Brunson to facilitate more — boosts assist rate'},
    ],
    reasoning: "<strong>Floor-grade prop.</strong> Brunson's career playoff average is 7+ ast and his assist rate INCREASES under pressure (PHI's G2 blitzing scheme led to 5 ast in 38min as he kicked out of doubles). Going to 4.5 gives a 2.5-cushion below his expected output. Even in G1's blowout where he played only 31min, he had 3 ast in limited rotation. As long as he plays 30+min, this clears comfortably. ~85-90% historical hit rate at this line.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome:'win', actual:'Brunson 9 ast — over 4.5 hit comfortably (career playoff floor confirmed)' },
  },
  {
    id: 'r2-g3-nyk-phi-total',
    slate: 'R2-G3', series: 'NYK-PHI', game: 3, postedAt: '2026-05-08',
    type: 'total', pick: 'Under 214.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'235 (NYK 137-98 = blowout pace)'},
      {label:'G2 total',value:'210 (108-102 = grind game)'},
      {label:'G3 expected',value:'Grind — neither team blowing out'},
    ],
    reasoning: "G2 was a 210-total grind. Without Embiid, PHI scored 102 — they need that pace to compete. With Embiid back, the offense improves but pace slows further (post-up touches, foul-drawing). NYK is happy to play half-court grind to lock down a road win. Both teams have incentives that favor lower pace/total. Lean under.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'Total 202 (108+94) — under 214.5 hit (PHI offense never sustained pace)' },
  },

  // ─── SAS-MIN G3 (Fri May 8, 9:30 PM ET @ Target Center, Tied 1-1) ──
  {
    id: 'r2-g3-sas-min-ml',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '-198',
    facts: [
      {label:'Spread',value:'SAS -3.5'},
      {label:'Total',value:'O/U 215.5'},
      {label:'Series',value:'Tied 1-1'},
      {label:'Wemby G2',value:'19/15 in 26min (rim-attack approach worked)'},
    ],
    modelHook: { fn:'dml', args:['SAS-MIN',3] },
    reasoning: "<strong>SAS's tactical overhaul in G2 was structural.</strong> The 38-pt blowout wasn't just regression — Pop shifted to faster pace, more pressure on Conley/Randle, and Wemby attacking the rim instead of settling for 3s. That scheme persists on the road. MIN coming off the worst playoff loss in franchise history (Finch: 'we got punked') will be desperate, but they've shown a structural ceiling problem: with Edwards on a knee restriction (12pts/24min off bench in G2), MIN's IC drops to ~1.5 and the 4-way 12-pt scoring tie among Edwards/Randle/McDaniels/Shannon shows nobody can reliably create. SAS at -198 reflects that asymmetry. Edwards moving to 30+min could compress to SAS by 2-3, but the road favorite price is still the right side.",
    confidence: 'high', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'win', actual:'SAS 115-108 (SAS won outright at -198) — Wemby 39/15/5blk' },
  },
  {
    id: 'r2-g3-sas-min-spread',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'spread', pick: 'SAS -3.5', odds: '-110',
    facts: [
      {label:'Model',value:'SAS by 9 baseline (compresses to 2-3 if Edwards is 32+min)'},
      {label:'G2',value:'SAS won by 38 — extreme but tactical-driven'},
      {label:'Risk',value:'MIN home crowd + post-blowout desperation'},
    ],
    modelHook: { fn:'dmargin', args:['SAS-MIN',3] },
    reasoning: "Model says SAS by 9 baseline → compresses to SAS by 2-3 if Edwards plays 32+min near G1 efficiency. The market's 3.5 sits right on that floor. Lean cover but the variance is wider — if MIN's home crowd lifts them and Edwards is closer to G1 (18pts/25min) than G2 (12pts/24min), this could be a 1-3 pt SAS win.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'SAS won by 7 (115-108) — covered -3.5 by 3.5pts' },
  },
  {
    id: 'r2-g3-sas-min-wemby-reb',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Victor Wembanyama Over 12.5 rebounds', odds: '-140',
    facts: [
      {label:'G1',value:'15reb (40min)'},
      {label:'G2',value:'15reb (32min)'},
      {label:'Pattern',value:'Back-to-back 15-reb games'},
      {label:'Counting stat',value:'Blowout-proof'},
    ],
    reasoning: "<strong>Sharpest prop on the slate.</strong> Wemby has 15reb in BOTH games this series. Going to 12.5 gives a 2.5-reb cushion below his series floor. As a counting stat, rebounds accumulate even if the game gets out of hand (G2 he had 15 in just 32min during a 38-pt blowout). Gobert is the only matchup that contests him and Gobert struggled in G2 (9reb). Real hit rate ~85-90%.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Wemby 15 reb — third straight 15-rebound game; over 12.5 hit (sharpest prop on slate confirmed)' },
  },
  {
    id: 'r2-g3-sas-min-wemby-pts',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Victor Wembanyama Under 25.5 points', odds: '-104',
    facts: [
      {label:'G1',value:'11pts (5-17 FG, 0-8 3PT)'},
      {label:'G2',value:'19pts (7-12 FG, 1-3 3PT)'},
      {label:'Series avg',value:'15ppg through 2'},
      {label:'Road regression',value:'SAS shooting expected to drop ~5pp on road'},
    ],
    reasoning: "Books opened around 27.5 with some pricing 25.5 (-104). Wemby's series scoring is averaging just 15ppg — both games have been below 25.5. On the road in a hostile environment with expected SAS shooting regression (50%/41% home G2 → ~46%/36% road), and with Wemby's rim-attack approach producing efficient-but-not-volume scoring (19pts in 32min G2), the under has clear edge at 25.5. If you can find 27.5, even better.",
    confidence: 'medium', thesis: ['regression','historical'], narrative: null,
    result: { outcome:'loss', actual:'Wemby 39pts (career playoff explosion) — under 25.5 missed badly. Rim-attack approach unlocked his ceiling, not just his floor.' },
  },
  {
    id: 'r2-g3-sas-min-wemby-blocks',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Victor Wembanyama Over 1.5 blocks', odds: '-300',
    facts: [
      {label:'G1',value:'12 blocks (career playoff record)'},
      {label:'G2',value:'5 blocks'},
      {label:'Career playoff avg',value:'4.2 blocks/game'},
      {label:'Independence',value:'Defensive engine, not tied to offensive flow'},
    ],
    reasoning: "<strong>Best floor prop on the entire slate.</strong> Wemby has 12 blocks (!) in G1 and 5 in G2 — he\'s the most prolific shot-blocker in the playoffs by a wide margin. Going to 1.5 gives a stunning 3+ block cushion below his series floor. The line is juiced steep (-300) precisely because the books know this is near-automatic. Counting-stat blocks accumulate even in blowouts — he had 5 in G2 during a 38-pt SAS rout. ~95% historical hit rate. Use as the anchor leg in any floor parlay.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Wemby 5 blocks — Kareem/Hakeem/Shaq company stat line. Over 1.5 hit (~95% historical confirmed).' },
  },
  {
    id: 'r2-g3-sas-min-edwards-reb',
    slate: 'R2-G3', series: 'SAS-MIN', game: 3, postedAt: '2026-05-08',
    type: 'prop', pick: 'Anthony Edwards Under 4.5 rebounds', odds: '-118',
    facts: [
      {label:'G1',value:'3reb (25min)'},
      {label:'G2',value:'3reb (24min)'},
      {label:'Reg season vs SAS',value:'Under 4 reb in 2 of 3 games'},
      {label:'Knee',value:'Limits drives + rebounding aggression'},
    ],
    reasoning: "Edwards has been under 4 rebounds in BOTH games this series, in 2 of 3 reg-season games vs SAS, and his knee restriction limits the drives and put-back attacks that produce rebounding. Even if Edwards is bumped to 32+min in G3 starting role, the knee means he stays on the perimeter. Under 4.5 has clear historical and structural edge.",
    confidence: 'high', thesis: ['historical','situational'], narrative: null,
    result: { outcome:'loss', actual:'Edwards 7 reb (15pts/7reb/1ast in starter return) — under 4.5 missed. Starter minutes + emotional return + early aggression broke the bench-knee-restricted pattern.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G3 — ARCHIVE (Sat May 9: OKC-LAL + DET-CLE)
  // ═══════════════════════════════════════════════════════════════

  // ─── OKC-LAL G3 (Sat May 9, 8:30 PM ET @ Crypto.com, OKC leads 2-0) ──
  {
    id: 'r2-g3-okc-lal-ml',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'ml', pick: 'OKC ML vs LAL', odds: '-375',
    facts: [
      {label:'Spread',value:'OKC -8.5'},
      {label:'Total',value:'O/U 211.5'},
      {label:'Series',value:'OKC leads 2-0'},
      {label:'G1',value:'OKC 108-90 (+18)'},
      {label:'G2',value:'OKC 125-107 (+18)'},
    ],
    modelHook: { fn:'dml', args:['OKC-LAL',3] },
    reasoning: "<strong>OKC won G1 AND G2 by identical 18-point margins</strong> despite very different game scripts (G1: SGA off night/7 TOs; G2: Reaves 31pt bounce-back for LAL). The structural gap is proven — depth, defense, length. HCA flips to LAL at Crypto.com (~3pts compression), but LAL has no Doncic, no answer to OKC bench depth. Even Reaves at his G2 best (31pts) + LeBron (23) = 54 from primaries and still lost by 18. OKC ML at -375 is expensive but the engine gives ~80% win probability even on the road.",
    confidence: 'high', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'OKC 131-108 LAL ✅. Won by 23 — same +18-style structural blowout, but bigger.' },
  },
  {
    id: 'r2-g3-okc-lal-spread',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'spread', pick: 'OKC -8.5', odds: '-110',
    facts: [
      {label:'Model',value:'OKC by 10'},
      {label:'Market',value:'OKC -8.5'},
      {label:'G1+G2 avg margin',value:'+18'},
    ],
    modelHook: { fn:'dmargin', args:['OKC-LAL',3] },
    reasoning: "Model projects OKC by 10 even at Crypto.com. Both G1 (+18) and G2 (+18) cleared 8.5 by a mile. HCA compression brings it closer but the structural gap (OKC bench outscored LAL bench both games, OKC defense held LAL to 42% and then forced 21 TOs) is real. -8.5 covers if OKC wins by 9+, which the model says is the median outcome.",
    confidence: 'medium', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'OKC won by 23 — covered -8.5 by 14.5pts.' },
  },
  {
    id: 'r2-g3-okc-lal-sga-pts',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'prop', pick: 'SGA Over 24.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'18pts (7 TOs, worst game)'},
      {label:'G2',value:'22pts (foul trouble, blowout bench)'},
      {label:'Career playoff avg',value:'~29 ppg'},
      {label:'Context',value:'Hasn\'t gone full-volume yet — G3 at LAL is when stars demand the ball'},
    ],
    reasoning: "<strong>SGA has been on cruise control (18, 22).</strong> OKC has won both games with SGA at his floor — Holmgren and bench carrying. G3 on the road is when superstars typically ramp up volume. His career playoff average is ~29ppg and he hasn't cracked 25 yet this series. With J.Williams fully ramped (absorbing some creation) and LAL desperation, SGA will need to score to close out road games. 24.5 is still 5pts below his career playoff mean.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'SGA 23pts (7-20 FG, 3-7 3PT, 6-7 FT) — narrowly missed by 1.5pts. Cruise control again with bench (A.Mitchell 24, Wallace 16, Joe 12) doing the work. Right thesis (SGA capable of 28+) but wrong forecast — he stayed in cruise.' },
  },
  {
    id: 'r2-g3-okc-lal-holmgren-reb',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'prop', pick: 'Holmgren Over 8.5 rebounds', odds: '-140',
    facts: [
      {label:'G1',value:'12 rebounds'},
      {label:'G2',value:'9 rebounds'},
      {label:'Matchup',value:'Ayton is the only LAL big — Holmgren dominates boards'},
    ],
    reasoning: "Holmgren has cleared 8.5 in BOTH games (12, 9). The Ayton matchup is solved — Holmgren's length and mobility dominate the glass. Even at Crypto.com, the rebounding matchup doesn't change. Counting stat that's blowout-proof (he pulled 12 in G1's 18-pt blowout). ~87% hit rate at this line based on series and recent form.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome:'win', actual:'Holmgren 9 rebounds (9-14 FG, 18pts) ✅. Cleared 8.5 by 0.5 — close but the floor held.' },
  },
  {
    id: 'r2-g3-okc-lal-lebron-pts',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'prop', pick: 'LeBron Over 22.5 points', odds: '-160',
    facts: [
      {label:'G1',value:'27pts (12-17 FG, 71%)'},
      {label:'G2',value:'23pts (9-18 FG, facilitator mode)'},
      {label:'Independence',value:'Scores 23+ even in 18-pt losses — blowout-proof'},
    ],
    reasoning: "<strong>LeBron's scoring is independent of OKC blowing them out.</strong> G1: 27pts in 18-pt loss. G2: 23pts in 18-pt loss. At home in a do-or-die game, he'll play 36+min and be even more aggressive. 22.5 gives 0.5-pt cushion below his G2 output (worst game of series). Floor-grade prop for the greatest scorer in playoff history.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'LeBron 19pts (7-19 FG, 2-6 3PT, 3-4 FT, 8 ast/6 reb) — facilitator mode at age 41 in 37min. Missed by 3.5. WRONG thesis: "scoring is independent of OKC blowing them out." Reality: in a 23-pt loss with Reaves regressed, LeBron pivoted to playmaker. The 27 G1 / 23 G2 floor broke when LAL had no second creator.' },
  },
  {
    id: 'r2-g3-okc-lal-total',
    slate: 'R2-G3', series: 'OKC-LAL', game: 3, postedAt: '2026-05-09',
    type: 'total', pick: 'Over 211.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'198 (grind, SGA off)'},
      {label:'G2 total',value:'232 (turnover-driven track meet)'},
      {label:'Avg',value:'215'},
    ],
    reasoning: "G1 was a 198 grind; G2 was a 232 track meet driven by 21 LAL TOs converting to OKC transition points. At Crypto.com, LAL plays more aggressively (home crowd + desperation) which means more possessions but also more TOs. G2's 232 suggests the pace can get high when LAL pushes. 211.5 is below the 2-game average of 215. Lean over — LAL's desperation drives pace up.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'OKC 131 + LAL 108 = 239 — Over 211.5 by 27.5pts. LAL desperation drove pace exactly as predicted.' },
  },

  // ─── DET-CLE G3 (Sat May 9, 3:00 PM ET @ Rocket Mortgage, DET leads 2-0) ──
  {
    id: 'r2-g3-det-cle-ml',
    slate: 'R2-G3', series: 'DET-CLE', game: 3, postedAt: '2026-05-09',
    type: 'ml', pick: 'CLE ML vs DET', odds: '-175',
    facts: [
      {label:'Spread',value:'CLE -4.5'},
      {label:'Total',value:'O/U 211.5'},
      {label:'Series',value:'DET leads 2-0'},
      {label:'Context',value:'CLE home — desperation + Mitchell 31pt rhythm'},
    ],
    modelHook: { fn:'dml', args:['DET-CLE',3] },
    reasoning: "<strong>HCA flips to CLE — engine baseline compresses from DET by 2 to CLE by 2-3.</strong> DK is even more bullish on CLE (CLE -4.5). Mitchell's 31-pt G2 showed rhythm; Allen is healthy (22/7 G2); CLE home crowd + 0-2 desperation should produce max effort. The model still gives CLE the edge at home (~62%) but DET's road-travel defense is travel-proof (scheme-driven). This is the closest game on the slate. CLE ML at -175 is the side the model leans.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'CLE 116-109 DET ✅. Mitchell 35/10reb, Harden bounce-back 19, Allen 18, Strus go-ahead steal. CLE bench finally outscored DET bench. Won by 7 — model said by 4, market said by 4.5. Both close.' },
  },
  {
    id: 'r2-g3-det-cle-spread',
    slate: 'R2-G3', series: 'DET-CLE', game: 3, postedAt: '2026-05-09',
    type: 'spread', pick: 'DET +4.5', odds: '-110',
    facts: [
      {label:'Model',value:'CLE by 4'},
      {label:'Market',value:'CLE -4.5'},
      {label:'DET road defense',value:'Scheme-driven, travel-proof'},
    ],
    modelHook: { fn:'dmargin', args:['DET-CLE',3] },
    reasoning: "Model says CLE by 4, market has CLE -4.5. DET +4.5 gives 0.5-pt cushion on the model's projection. DET's defense traveled well in R1 road games and their scheme (wing pressure, trapping Harden) is system-based, not crowd-dependent. Cade's Q4 closing ability (12 of 25 in Q4 G2) means DET can win any tight game. Getting 4.5 on a team that won both home games by 10 feels generous.",
    confidence: 'medium', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'DET lost by 7 — failed to cover +4.5 by 2.5pts. Cade triple-double (27/10/10) was the high-volume mode the spread needed but his 8 TOs + 10-27 FG (37%) erased the +EV. Q4 closing failed when Strus stole and scored go-ahead.' },
  },
  {
    id: 'r2-g3-det-cle-mitchell-pts',
    slate: 'R2-G3', series: 'DET-CLE', game: 3, postedAt: '2026-05-09',
    type: 'prop', pick: 'Donovan Mitchell Over 27.5 points', odds: '-120',
    facts: [
      {label:'G1',value:'23pts (A.Thompson limited him)'},
      {label:'G2',value:'31pts (game-high)'},
      {label:'At home',value:'Mitchell averages 29.4 ppg at home in playoffs'},
      {label:'Desperation',value:'Down 0-2, CLE needs him at his best'},
    ],
    reasoning: "Mitchell's 31-pt G2 showed he's found rhythm against DET's defense. At home in a must-win context, his aggression should increase. Career home playoff average is ~29ppg. 27.5 is well below his G2 output and right at his home baseline. A.Thompson will still defend him but CLE's home crowd amplifies his drives. Clear over territory.",
    confidence: 'medium', thesis: ['matchup','historical'], narrative: null,
    result: { outcome:'win', actual:'Mitchell 35pts (13-24 FG, 2-8 3PT, 7-8 FT, 10reb, 4ast) — sustained 31-pt G2 form. Cleared 27.5 by 7.5pts. Home aggression thesis validated.' },
  },
  {
    id: 'r2-g3-det-cle-cade-ast',
    slate: 'R2-G3', series: 'DET-CLE', game: 3, postedAt: '2026-05-09',
    type: 'prop', pick: 'Cade Cunningham Over 6.5 assists', odds: '-130',
    facts: [
      {label:'G1',value:'7 assists (scorer-distributor mode)'},
      {label:'G2',value:'10 assists (facilitator mode)'},
      {label:'Dual-mode',value:'Both games above 6.5 — floor-grade prop'},
    ],
    reasoning: "<strong>Cade has cleared 6.5 assists in BOTH games (7, 10).</strong> His dual-mode flexibility means he's distributing at an elite level regardless of scoring mode. On the road, CLE's defense may tighten on his scoring — which INCREASES assists as he kicks out. 6.5 gives 0.5-pt cushion below his G1 floor. ~85% hit rate based on series form.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Cade 10 assists (also 27pts/10reb triple-double on 10-27 FG). Cleared 6.5 by 3.5. Dual-mode floor held even on a high-volume scoring night.' },
  },
  {
    id: 'r2-g3-det-cle-total',
    slate: 'R2-G3', series: 'DET-CLE', game: 3, postedAt: '2026-05-09',
    type: 'total', pick: 'Under 211.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'212 (DET 111-101)'},
      {label:'G2 total',value:'204 (DET 107-97)'},
      {label:'CLE 3PT',value:'26% in series (11-42) — catastrophic'},
    ],
    reasoning: "G2 total was 204, trending down from G1's 212. CLE's 3PT shooting is in crisis (26% for series). DET's defense (#1 in NBA) is scheme-driven and travels. Even at home, CLE's perimeter issues won't magically fix themselves (Merrill DNP, Strus 1-6 3PT G2). Both teams grind — expect another low-scoring affair. Under 211.5 has series trend support.",
    confidence: 'medium', thesis: ['model','historical'], narrative: null,
    result: { outcome:'loss', actual:'Total 225 (CLE 116 + DET 109) — Over by 13.5pts. CLE 58% FG / 38% 3PT (12-32) was the bounce-back the model didn\'t fully price. Merrill returning + Schroder 3-3 from 3 / 11pts off bench killed the "CLE shooting crisis" thesis.' },
  },

  // ─── NYK-PHI G4 (Sun May 10, 3:30 PM ET @ Wells Fargo, NYK leads 3-0) ──
  {
    id: 'r2-g4-nyk-phi-ml',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'ml', pick: 'NYK ML vs PHI', odds: '-122',
    facts: [
      {label:'Spread',value:'NYK -1.5'},
      {label:'Total',value:'O/U 213.5'},
      {label:'Series',value:'NYK leads 3-0 (sweep cliff)'},
      {label:'G3',value:'NYK 108-94 at Wells Fargo (Brunson 33/9ast, George 0-9 after Q1)'},
      {label:'Injuries',value:'Embiid PROBABLE (hip), OG Anunoby QUESTIONABLE (hamstring)'},
    ],
    modelHook: { fn:'dml', args:['NYK-PHI',4] },
    reasoning: "<strong>NYK swept G1+G2+G3 with structural dominance.</strong> Engine baseline NYK by 8-9; HCA flip + PHI desperation compress to NYK by 4. Closeout dynamics: G4 sweep favorites win ~70% but cover only ~50% ATS — backdoor losses common. PHI's IC=2 ceiling (Maxey + George + half-Embiid) was capped at 94 in G3 even with home court. Even if Maxey shoots back to mean and George recovers from his Q1-only collapse, PHI's ceiling is still ~105. NYK structural edges (+9.2 clutchNetRtg, KAT stretch-5 vs Drummond, Brunson PnR vs hobbled Embiid) keep them on top. Market at -122 = ~55% implied, model says ~63%. Slight edge.",
    confidence: 'medium', thesis: ['model','market'], narrative: null,
    result: { outcome: "win", actual: "NYK 144-114 — closeout sweep, NYK advances to ECF" },
  },
  {
    id: 'r2-g4-nyk-phi-spread',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'spread', pick: 'PHI +1.5', odds: '+102',
    facts: [
      {label:'Model',value:'NYK by 4'},
      {label:'Market',value:'NYK -1.5'},
      {label:'Closeout ATS',value:'G4 sweep favorites cover only ~50%'},
    ],
    modelHook: { fn:'dmargin', args:['NYK-PHI',4] },
    reasoning: "<strong>Closeout-game ATS hedge.</strong> Model says NYK by 4 but closeout dynamics are notoriously hard to cover — PHI's home pride + Embiid back at 80% + OG potentially OUT for NYK = the kind of game that ends NYK by 1-2 with NYK closing out in possession-by-possession Q4 grind. PHI +1.5 wins on any backdoor cover OR a PHI desperation upset. Bigger win condition than NYK -1.5 (which loses if NYK wins by exactly 1 or in a tie OT collapse). Slightly +EV at +102.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome: "loss", actual: "NYK won by 30 — closeout walkover, no backdoor cover scenario" },
  },
  {
    id: 'r2-g4-nyk-phi-brunson-pts',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'Brunson Over 27.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'35pts (12-18 FG, 3-6 3PT, 8-8 FT)'},
      {label:'G2',value:'26pts (9-21 FG, go-ahead bucket Q4)'},
      {label:'G3',value:'33pts/9ast (11-22 FG, 38min)'},
      {label:'Avg',value:'31.3 ppg in series'},
    ],
    reasoning: "<strong>Brunson averaging 31.3 ppg this series with Embiid hobbled.</strong> G3 showed he can run dual-mode scorer-distributor (33/9ast) at PHI. Closeout games typically push star usage UP — Brunson will close at 38+ minutes regardless of margin. 27.5 is below his series floor (26 G2 was the lowest). PHI defensive scheme has no answer to his PnR with KAT. ~75% hit rate at this line.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: "loss", actual: "Brunson 22 pts (8-17 FG) — McBride exploded for 25 in his stead, usage redistributed" },
  },
  {
    id: 'r2-g4-nyk-phi-kat-reb',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'KAT Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'G1',value:'6 reb in 20min (blowout, low minutes)'},
      {label:'G2',value:'10 reb (foul-trouble PHI bigs)'},
      {label:'G3',value:'12 reb (4 OREB) in 26min — passive on offense, dominant on glass'},
      {label:'Matchup',value:'Drummond/Bona thin C rotation; Embiid limited if plays'},
    ],
    reasoning: "<strong>KAT cleared 9.5 in BOTH G2 and G3 (10, 12).</strong> The matchup is structural — PHI's C rotation is Drummond (29) + Bona (foul trouble) + Embiid at 70% = no one to box him out. Even at 26min in G3 he had 12reb with 4 OREB. Counting stat that's blowout-proof. ~80% hit rate at this line.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: "loss", actual: "KAT 4 reb (17 pts / 10 ast — passive on glass, dimes in flow). PHI bigs finally boxed him out" },
  },
  {
    id: 'r2-g4-nyk-phi-maxey-pts',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'Maxey Over 22.5 points', odds: '-125',
    facts: [
      {label:'G1',value:'13pts (3-9 FG, fatigue)'},
      {label:'G2',value:'26pts (9-23 FG, cold Q4)'},
      {label:'G3',value:'17pts (inefficient volume)'},
      {label:'Closeout context',value:'Last home game; team\'s best healthy creator'},
    ],
    reasoning: "Maxey is PHI's only consistent healthy primary creator (Embiid hobbled, George variance). In a closeout home game where PHI has nothing to lose, Mike Brown will run him 40+ min as the hub. G2 showed he can hit 26 in a competitive game. Even his inefficient G3 produced 17. 22.5 is the median outcome in a desperation-pace game where PHI runs everything through him. ~60% hit rate.",
    confidence: 'medium', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: "loss", actual: "Maxey 17 pts (6-15 FG). Game out of hand by Q3 — no desperation explosion" },
  },
  {
    id: 'r2-g4-nyk-phi-total',
    slate: 'R2-G4', series: 'NYK-PHI', game: 4, postedAt: '2026-05-10',
    type: 'total', pick: 'Under 213.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'235 (NYK 137-98 blowout)'},
      {label:'G2 total',value:'210 (NYK 108-102)'},
      {label:'G3 total',value:'202 (NYK 108-94)'},
      {label:'Trend',value:'Totals dropping each game as PHI defense slows pace'},
    ],
    reasoning: "Total has trended down each game (235 → 210 → 202). PHI plays slower without Embiid in motion sets; NYK plays slower in closeout mode (less drive-and-kick, more PnR). Both teams trending under. 213.5 is well above the 2-game post-G1 average (206). Lean under — closeout games usually feature defensive intensity.",
    confidence: 'medium', thesis: ['model','historical'], narrative: null,
    result: { outcome: "loss", actual: "Total 258 (NYK 144, PHI 114). NYK 25-of-44 from 3 (postseason record) blew the under" },
  },

  // ─── SAS-MIN G4 (Sun May 10, 7:30 PM ET @ Target Center, SAS leads 2-1) ──
  {
    id: 'r2-g4-sas-min-ml',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '-195',
    facts: [
      {label:'Spread',value:'SAS -4.5'},
      {label:'Total',value:'O/U 218.5'},
      {label:'Series',value:'SAS leads 2-1'},
      {label:'G3',value:'SAS 115-108 at Target Center (Wemby 39/15/5blk)'},
      {label:'Edwards',value:'No minutes restriction confirmed for G4'},
    ],
    modelHook: { fn:'dml', args:['SAS-MIN',4] },
    reasoning: "<strong>SAS won G3 ON THE ROAD behind Wemby's Kareem-tier line.</strong> Engine: SAS by 3. Market: SAS by 4.5 — the model thinks the spread is too rich but the ML at -195 implies ~66% which matches the model's ~65%. Wemby is in 'transcendent' mode (back-to-back 39+pt games or Kareem-tier production). Edwards now fully back (32/14/6 G3) but Randle (3-12) and McDaniels (5-22) combined 8-34 — MIN's secondary scoring crisis persists. SAS ML is the cleanest expression of the model's edge.",
    confidence: 'medium', thesis: ['model','market'], narrative: null,
    result: { outcome: "loss", actual: "MIN won 114-109 — Wemby ejected Q2 (Flagrant 2 elbow to Reid)" },
  },
  {
    id: 'r2-g4-sas-min-spread',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'spread', pick: 'MIN +4.5', odds: '-110',
    facts: [
      {label:'Model',value:'SAS by 3'},
      {label:'Market',value:'SAS -4.5'},
      {label:'Edwards',value:'Full minutes G4'},
      {label:'MIN home desperation',value:'Down 1-2, must hold to avoid 1-3'},
    ],
    modelHook: { fn:'dmargin', args:['SAS-MIN',4] },
    reasoning: "<strong>Model says SAS by 3, market says SAS by 4.5</strong> — MIN +4.5 has the engine edge. Edwards no minutes restriction means MIN's IC bumps up. Target Center crowd in a must-win-to-avoid-1-3 game adds variance. SAS won G3 by 7 with Wemby in transcendent mode AND Edwards effective — if Wemby reverts to 25-30 instead of 39, MIN can win or keep it within 4. The Wemby 39+pt ceiling is not a nightly baseline.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome: "win", actual: "MIN won outright by 5 — Wemby ejection variance event delivered cash on the +4.5 hedge" },
  },
  {
    id: 'r2-g4-sas-min-wemby-reb',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'Wembanyama Over 12.5 rebounds', odds: '-140',
    facts: [
      {label:'G1',value:'15 reb'},
      {label:'G2',value:'15 reb'},
      {label:'G3',value:'15 reb'},
      {label:'Streak',value:'15+ in EVERY series game'},
    ],
    reasoning: "<strong>Wemby has hit EXACTLY 15 reb in all three series games.</strong> The matchup is structural — Gobert (13pts, only 1 box-out body MIN can use), Randle/McDaniels can't physically box him out. Counting stat that's blowout-proof. 12.5 gives 2.5-rebound cushion. Among the highest-confidence props on the slate. ~92% hit rate.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: "loss", actual: "Wemby 4 reb in 13 min before ejection. Variance event broke the floor" },
  },
  {
    id: 'r2-g4-sas-min-wemby-blk',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'Wembanyama Over 2.5 blocks', odds: '-140',
    facts: [
      {label:'G1',value:'12 blocks (career playoff high)'},
      {label:'G2',value:'5 blocks'},
      {label:'G3',value:'5 blocks'},
      {label:'Avg',value:'7.3 bpg in series'},
    ],
    reasoning: "<strong>Wemby has cleared 2.5 blocks in EVERY series game.</strong> 12, 5, 5 = 7.3 bpg. MIN drives through the lane out of necessity (Edwards rim attacks, Randle mid-range fadeaways turning into close-outs). Counting stat with structural matchup advantage. 2.5 is well below his series floor of 5. ~95% hit rate — among the highest-confidence floor props this round.",
    confidence: 'high', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: "loss", actual: "Wemby 0 blk in 13 min. Ejection torpedoed reb + blk floors together" },
  },
  {
    id: 'r2-g4-sas-min-edwards-pts',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'prop', pick: 'Edwards Over 26.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'18pts (off bench, 25min)'},
      {label:'G2',value:'12pts (24min, rusty)'},
      {label:'G3',value:'32pts/14reb/6ast (41min, no restriction)'},
      {label:'G4',value:'No minutes restriction confirmed'},
    ],
    reasoning: "<strong>Edwards roared back in G3 with 32pts/14reb/6ast in 41min</strong> — knee fully cleared. With no minutes restriction confirmed for G4 and MIN in must-win mode at home, expect another 38-42min outing. He scored 32 in G3 against the same SAS scheme. 26.5 is well below his G3 output. Even if SAS adjusts, his volume + aggression in a desperation game pushes 28-32. ~70% hit rate.",
    confidence: 'medium', thesis: ['matchup','historical'], narrative: null,
    result: { outcome: "win", actual: "Edwards 36 pts (16 in Q4) — closed the door after Wemby ejection" },
  },
  // ─── DET-CLE G4 (Mon May 11, 8:00 PM ET @ Rocket Mortgage, DET leads 2-1) ──
  {
    id: 'r2-g4-det-cle-ml',
    slate: 'R2-G4', series: 'DET-CLE', game: 4, postedAt: '2026-05-11',
    type: 'ml', pick: 'DET ML vs CLE', odds: '+140',
    facts: [
      {label:'Spread',value:'CLE -3.5'},
      {label:'Total',value:'O/U 213.5'},
      {label:'Series',value:'DET leads 2-1'},
      {label:'G3',value:'CLE 116-109 at CLE (Mitchell 35, Allen 18, Strus closing steal-and-basket)'},
      {label:'Engine',value:'CLE 107, DET 104 (CLE by 3, LOW conf)'},
    ],
    modelHook: { fn:'dml', args:['DET-CLE',4] },
    reasoning: "<strong>Contrarian DET upset spot.</strong> Engine has CLE by 3 (matches market direction), but the engine's HCA flip premium (+2.5pt) has been over-priced in recent retros — NYK-PHI and SAS-MIN G3s both went to the road favorite when the model said home would cover. With HCA flip trimmed to +1.5 (per the G3 retro), the line moves to near pick-em. DET has won 2 of 3 in this series with structural Cade-driven offense that CLE has no perimeter answer for. DET ML at +140 = 42% implied vs ~46% adjusted-engine. Small +EV edge that rides on the calibration call — if HCA-flip retro continues, DET upsets the closeout.",
    confidence: 'medium', thesis: ['model','market'], narrative: null,
    result: { outcome: 'loss', actual: 'CLE 112-103. DET lost by 9 — Mitchell\'s 43pts (39 in 2H, tied Sleepy Floyd 1987 playoff record) was the swing. HCA-flip retro did NOT apply: CLE was home, Mitchell tail-event game drove the result. RIGHT framework, WRONG situation.' },
  },
  {
    id: 'r2-g4-det-cle-spread',
    slate: 'R2-G4', series: 'DET-CLE', game: 4, postedAt: '2026-05-11',
    type: 'spread', pick: 'DET +3.5', odds: '-110',
    facts: [
      {label:'Engine',value:'CLE by 3 (CLE 107, DET 104)'},
      {label:'Adjusted',value:'~pick-em with HCA flip retro applied (+1.5 not +2.5)'},
      {label:'Market',value:'CLE -3.5'},
      {label:'G3 retro',value:'HCA flip was over-priced in NYK-PHI/SAS-MIN G3s — road favorites won both'},
    ],
    modelHook: { fn:'dmargin', args:['DET-CLE',4] },
    reasoning: "Alt expression of the DET ML edge — at -110 implied is ~52%, and DET +3.5 covers any DET win + any CLE win by 1-3. With HCA-flip retro applied (calibrate +1.5pt, not +2.5pt), the engine line moves to near pick-em, putting the live cover band roughly at ~55-58% of plausible game outcomes. Lower variance than the +140 ML at the cost of upside on an outright DET win.",
    confidence: 'high', thesis: ['model','market'], narrative: null,
    result: { outcome: 'loss', actual: 'CLE won by 9 — DET +3.5 lost by 5.5. Mitchell\'s 43pt (39 in 2H) tail event blew through both the spread and the engine\'s 3pt projection.' },
  },
  {
    id: 'r2-g4-det-cle-total',
    slate: 'R2-G4', series: 'DET-CLE', game: 4, postedAt: '2026-05-11',
    type: 'total', pick: 'Under 213.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'212 (DET 111-101)'},
      {label:'G2 total',value:'204 (DET 107-97)'},
      {label:'G3 total',value:'225 (CLE 116-109)'},
      {label:'Avg',value:'213.7'},
    ],
    reasoning: "Series total trend is volatile — G3 jumped because CLE found shooting at home (Strus/Hunter/Wade combined). Model: CLE 107, DET 104 = 211 total. Engine sees character as GRIND not COMPETITIVE/SEPARATION — clutch executions tend to slow pace. Slight under lean at -110.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome: 'loss', actual: 'Total 215 (CLE 112 + DET 103) — went OVER by 1.5pts. The Mitchell tail-event Q3 (21pts in the quarter alone) pushed the pace + makes well above the engine\'s GRIND projection.' },
  },
  {
    id: 'r2-g4-det-cle-cade-pts',
    slate: 'R2-G4', series: 'DET-CLE', game: 4, postedAt: '2026-05-11',
    type: 'prop', pick: 'Cunningham Over 24.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'25 pts/8ast'},
      {label:'G2',value:'26 pts/9ast'},
      {label:'G3',value:'triple-double on 10-27 FG / 8 TOs (volume mode)'},
      {label:'Avg',value:'~25 ppg, 39+ min nightly'},
    ],
    reasoning: "Cade has been DET's primary creation hub in every game this series — 39+ min nightly, ~28 FGA average. CLE has no perimeter answer (Wade/Hunter limited). 24.5 is right at his series floor (low was 25 G1). In a road must-not-fall-to-2-2 game, his usage spikes further. Even on inefficient nights (G3's 10-27) he clears 24.5 via volume. ~70% hit rate.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'loss', actual: 'Cade 19pts (7-19 FG, 5 TOs) — UNDER 24.5 by 5.5. FIRST under-20 in 11 straight playoff games. CLE\'s scheme adjustment (Mobley primary screen-defender + doubles) capped him. The series-floor framework broke here when CLE actively schemed against the usage path.' },
  },
  {
    id: 'r2-g4-det-cle-mitchell-pts',
    slate: 'R2-G4', series: 'DET-CLE', game: 4, postedAt: '2026-05-11',
    type: 'prop', pick: 'Mitchell Over 28.5 points', odds: '-110',
    facts: [
      {label:'G1',value:'24 pts (3-12 3PT, road)'},
      {label:'G2',value:'31 pts (12-22 FG)'},
      {label:'G3',value:'35 pts (career-high playoff signature)'},
      {label:'Series trend',value:'Climbing — 24 → 31 → 35'},
    ],
    reasoning: "Mitchell is on a series scoring crescendo at home. G3 35-pt signature happened with Allen anchoring D + Strus knockdown shooting around him — same template tonight. Q4 closing pattern (top-7 playoff Q4 +5 pts) means CLE plays through him in late game. 28.5 is below his last two outputs (31 in G2, 35 in G3). ~65% hit rate.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'win', actual: 'Mitchell 43pts (13-26 FG, 13-14 FT) — 39 PTS IN 2H, tied Sleepy Floyd 1987 NBA playoff record. Career playoff high. Started 0-7/4pts at half, then 21pts in Q3 alone (matched DET\'s entire Q3 output). Over 28.5 cleared by 14.5pts. Crescendo thesis validated to the extreme.' },
  },

  // ─── OKC-LAL G4 (Mon May 11, 10:30 PM ET @ Crypto.com Arena, OKC leads 3-0) ──
  {
    id: 'r2-g4-okc-lal-spread',
    slate: 'R2-G4', series: 'OKC-LAL', game: 4, postedAt: '2026-05-11',
    type: 'spread', pick: 'LAL +11.5', odds: '-110',
    facts: [
      {label:'Model',value:'OKC by 5 (engine 108-103)'},
      {label:'Market',value:'OKC -11.5'},
      {label:'Engine edge',value:'+6.5 pts vs market'},
      {label:'Closeout history',value:'Sweep-cliff games cover only ~40% ATS for favorites'},
    ],
    modelHook: { fn:'dmargin', args:['OKC-LAL',4] },
    reasoning: "<strong>Single biggest engine edge tonight.</strong> Model: OKC by 5 (HCA-flip + LAL desperation home). Market: OKC by 11.5 — the upper end of the closeout-blowout distribution. Engine edge: 6.5pts. Sweep-cliff favorites typically ease off + reserve energy for the next round (OKC has BIG margin in series, no incentive to play 38+ min for stars); meanwhile LAL home crowd + last home game of season for LeBron at 41yo = effort + emotion + slow pace. ~62% engine implied at -110 (52.4%). Cleanest read on the slate.",
    confidence: 'high', thesis: ['model','market'], narrative: null,
    result: { outcome: 'win', actual: 'OKC 115-110 (OKC by 5). LAL +11.5 covered comfortably. Engine BULLSEYE: predicted OKC by 5, actual OKC by 5. Single biggest edge of the slate hit exactly as priced.' },
  },
  {
    id: 'r2-g4-okc-lal-lal-ml',
    slate: 'R2-G4', series: 'OKC-LAL', game: 4, postedAt: '2026-05-11',
    type: 'ml', pick: 'LAL ML vs OKC', odds: '+390',
    facts: [
      {label:'Spread',value:'LAL +11.5 (model lean)'},
      {label:'OKC ML',value:'-520 (~84% implied)'},
      {label:'Closeout sample',value:'Home dogs in 3-0 vs G4 closeout: ~25% win rate'},
      {label:'LAL home variance',value:'LeBron 30+ ceiling, Reaves 31-pt G2 already shown'},
    ],
    modelHook: { fn:'dml', args:['OKC-LAL',4] },
    reasoning: "<strong>Chaos play — engine 20-25% LAL win, market 16%.</strong> +390 implies ~20%; engine model has it ~25% (OKC sweep-cliff ease-off + LAL home desperation can flip a tight Q4). LAL needs: SGA off-night (under 28), LeBron Q4 takeover, Reaves or Hachimura bench spike. All three are independent variance events. Engine edge is small (~5pp) but at +390 every hit pays huge.",
    confidence: 'chaos', thesis: ['model','market'], narrative: null,
    result: { outcome: 'loss', actual: 'OKC 115-110. LAL fought hard (Reaves 27 + Hachimura 25 + LeBron 24 = 76 from primaries) but SGA went closeout-mode 35 and Holmgren\'s 32.8s tiebreaker dunk sealed it. Chaos thesis directionally right (close game) but LAL still lost.' },
  },
  {
    id: 'r2-g4-okc-lal-total',
    slate: 'R2-G4', series: 'OKC-LAL', game: 4, postedAt: '2026-05-11',
    type: 'total', pick: 'Under 214.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'198 (OKC 108-90 blowout)'},
      {label:'G2 total',value:'232 (OKC 125-107, Reaves heroic)'},
      {label:'G3 total',value:'239 (OKC 131-108 blowout)'},
      {label:'Engine projection',value:'211 (OKC 108, LAL 103)'},
    ],
    reasoning: "Engine total: 211 (OKC 108, LAL 103). Market: 214.5. Closeout-cliff games typically run slower in late minutes — OKC eases off, LAL grinds out shots. Wider variance band tonight (LAL ceiling 110-115 with shooting; LAL floor 95-100 if Reaves/Hachimura cold). 214.5 is the upper plausible band. Slight under lean at -110.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome: 'loss', actual: 'Total 225 (OKC 115 + LAL 110) — over by 10.5. LAL\'s desperation pace + OKC closeout aggression (no easing off) pushed the pace and makes. Both teams shot well in Q4. Engine total projection too low.' },
  },
  {
    id: 'r2-g4-okc-lal-sga-pts',
    slate: 'R2-G4', series: 'OKC-LAL', game: 4, postedAt: '2026-05-11',
    type: 'prop', pick: 'SGA Over 30.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'18 pts/7 TOs (career-anomaly low)'},
      {label:'G2',value:'34 pts (bounce-back to mean)'},
      {label:'G3',value:'23 pts/9 ast (cruise control 7-20 FG, OKC bench took over)'},
      {label:'Closeout history',value:'33+ in 4 of his 5 prior closeout games'},
    ],
    reasoning: "SGA closeout history is the key signal: 33+ ppg in 4 of his 5 prior playoff closeouts. Even G3 cruise mode (23 on 7-20) was OKC up so big the bench ate minutes. Tonight at LAL in a closeout, SGA gets the green light to push for 35+. 30.5 is well below his closeout-game floor. ~70% hit rate.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'win', actual: 'SGA 35pts/8ast (12-25 FG, 8-9 FT) — first 30+ game of the series after the 18/22/23 cruise. Closeout-history signal validated cleanly: SGA leaned in, OKC won and swept.' },
  },
  {
    id: 'r2-g4-okc-lal-lebron-pts',
    slate: 'R2-G4', series: 'OKC-LAL', game: 4, postedAt: '2026-05-11',
    type: 'prop', pick: 'LeBron Over 24.5 points', odds: '-110',
    facts: [
      {label:'G1',value:'30 pts/8 ast/13 reb'},
      {label:'G2',value:'28 pts'},
      {label:'G3',value:'19 pts/6/8 (pivot to playmaker)'},
      {label:'Closeout context',value:'Last home game of season + 41yo + elimination = max effort'},
    ],
    reasoning: "LeBron in a closeout home game at 41yo = leave it all on the floor. G1+G2 showed he can still hit 28-30 in this series. G3's 19 was a playmaker night out of necessity (rest of LAL trash). Closeout home dynamic typically pushes LeBron usage UP. 24.5 is below his series floor of 19 only if he goes playmaker again — but you don't make playmaker tradeoffs in an elimination game. ~70% hit rate.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'loss', actual: 'LeBron 24pts/12reb/6ast — UNDER 24.5 by 0.5. Heartbreak half-point pattern: facilitator-mode (6 ast) with the ball getting spread to Reaves (27) and Hachimura (25). Even in elimination at 41yo, the playmaker tradeoffs persisted.' },
  },

  {
    id: 'r2-g4-sas-min-total',
    slate: 'R2-G4', series: 'SAS-MIN', game: 4, postedAt: '2026-05-10',
    type: 'total', pick: 'Over 218.5', odds: '-110',
    facts: [
      {label:'G3 total',value:'223 (SAS 115-108)'},
      {label:'Edwards full',value:'No minutes restriction = MIN pace UP'},
      {label:'Wemby ceiling',value:'39pt G3 sets the high-side prior'},
    ],
    reasoning: "G3 total was 223 with Wemby at 39 + Edwards at 32 — both stars in transcendent form. Edwards full minutes for G4 means MIN runs more transition. SAS won't tone Wemby down. Both teams' star scoring momentum + MIN home desperation pace = game in the 218-225 range. 218.5 is below the G3 total. Lean over.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome: "win", actual: "Total 223 (MIN 114, SAS 109). Pace + makes carried the over even with Wemby ejected" },
  },

  // ─── SAS-MIN G5 (Tue May 12, 8:00 PM ET @ Frost Bank Center, series tied 2-2) ──
  // Single game tonight. DET-CLE G5 is tomorrow (Wed 5/13).
  {
    id: 'r2-g5-sas-min-ml',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '-410',
    facts: [
      {label:'Spread',value:'SAS -10.5'},
      {label:'Total',value:'O/U 218.5'},
      {label:'Series',value:'Tied 2-2'},
      {label:'G4',value:'MIN 114-109 (Wemby ejected Q2 — chaotic swing game)'},
      {label:'Wemby status',value:'CLEARED — NBA review, no suspension, plays full minutes'},
      {label:'Engine',value:'SAS 113, MIN 105 (SAS by 8, MEDIUM)'},
    ],
    modelHook: { fn:'dml', args:['SAS-MIN',5] },
    reasoning: "<strong>SAS ML at home with Wemby healthy is the structural pick.</strong> Engine: SAS by 8. Market: SAS -410 (~80% implied). SAS won G1 by 2 + G2 by 38 + G3 by 7 — only the G2 was variance-driven (MIN 28% 3PT collapse). MIN's win in G4 came partly via the Wemby ejection swing (~12-15pt shock). With Wemby back at home + Reid post-elbow soreness + Edwards facing SAS guard depth + Castle facilitating + Frost Bank Center HCA, SAS holds serve cleanly. The risk: Wemby in 'first-game-back-after-ejection' mindset could either be (a) measured = great, or (b) over-aggressive = early foul trouble. Implied 80% feels fair.",
    confidence: 'high', thesis: ['model','matchup'], narrative: null,
    result: { outcome: 'win', actual: 'SAS 126-97. Wemby 27/17/5/3blk (18 in Q1). SAS led by 30. Cleanest ML hit of the series.' },
  },
  {
    id: 'r2-g5-sas-min-spread',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'spread', pick: 'MIN +10.5', odds: '-110',
    facts: [
      {label:'Engine',value:'SAS by 8 (113-105)'},
      {label:'Market',value:'SAS -10.5'},
      {label:'Engine edge',value:'+2.5 pts to MIN cover'},
      {label:'Series spreads',value:'SAS won G1 by 2, G2 by 38 (outlier), G3 by 7'},
    ],
    modelHook: { fn:'dmargin', args:['SAS-MIN',5] },
    reasoning: "Engine: SAS by 8. Market: SAS -10.5. 2.5pt edge to MIN cover. Three of four games in this series have been ≤7pt margins (the G2 +38 was a one-game shooting anomaly). SAS having to win by 11+ with Edwards healthy + MIN's 4-deep secondary scoring history is a stretch. Even with Wemby + home + Reid neck-spotty, the typical SAS-MIN game flows in the 5-10pt margin band. ~58% cover for MIN.",
    confidence: 'high', thesis: ['model','market'], narrative: null,
    result: { outcome: 'loss', actual: 'SAS by 29 (126-97). MIN +10.5 missed by 18.5. The "G2 was the only blowout" thesis was wrong twice in this series — Wemby post-ejection re-aggression mirrored the G2 bounce-back pattern.' },
  },
  {
    id: 'r2-g5-sas-min-total',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'total', pick: 'Over 218.5', odds: '-110',
    facts: [
      {label:'G3 total',value:'223 (SAS 115-108)'},
      {label:'G4 total',value:'223 (MIN 114-109, Wemby ejected)'},
      {label:'Edwards last 2',value:'32 + 36 pts'},
      {label:'Wemby G3',value:'39pts/15reb at MIN'},
    ],
    reasoning: "Series total in last 2 games: 223 + 223. Edwards in transcendent scoring form (32+36 last 2). Wemby back + home + re-aggression spot likely produces a 28-35pt game on volume + makes. Both teams' pace + makes have stabilized in the 220 range. 218.5 is at the lower end of the last-2-game band. Lean over.",
    confidence: 'lean', thesis: ['historical','model'], narrative: null,
    result: { outcome: 'win', actual: 'Total 223 (SAS 126, MIN 97). Cleared by 4.5. SAS pace + Wemby Q1 dominance carried it.' },
  },
  {
    id: 'r2-g5-sas-min-wemby-reb',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'prop', pick: 'Wemby Over 13.5 rebounds', odds: '-130',
    facts: [
      {label:'G1',value:'15reb'},
      {label:'G2',value:'15reb'},
      {label:'G3',value:'15reb (3 straight 15-rebound games in games he played >25min)'},
      {label:'G4',value:'4reb in 13min before ejection'},
      {label:'Reb floor signal',value:'Cleanest in dataset — 15+ in every full game'},
    ],
    reasoning: "Wemby's rebound floor is the most reliable signal in this dataset: 15 boards in EVERY game he played >25min in this series. At home + healthy + first game back + Reid potentially limited from neck soreness (one less elite boards-competing big) = 15+ baseline. 13.5 is 1.5 below his series median. ~90% hit rate.",
    confidence: 'best-bet', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'win', actual: '17 rebounds. Best-bet hit comfortably.' },
  },
  {
    id: 'r2-g5-sas-min-edwards-pts',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'prop', pick: 'Edwards Over 26.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'18pts (off bench, knee)'},
      {label:'G2',value:'12pts (off bench, blowout)'},
      {label:'G3',value:'32pts (starting, knee back)'},
      {label:'G4',value:'36pts (16 in Q4 closing)'},
      {label:'Engine projection',value:'28 pts'},
    ],
    reasoning: "Edwards' knee is fully healed (32 + 36 last 2). At the swing game on the road + must-win-or-fall-3-2 + SAS perimeter D being Castle/Vassell (not elite) + Edwards' Q4 closing pattern. 26.5 is below his last-2-game floor of 32. Only a Wemby-rim-protection + Castle-on-ball lockdown gets him below 27.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'loss', actual: '20 points. The "Castle/Vassell not elite perimeter D" thesis was wrong — Castle was the primary defender and held Edwards to 7-19 FG. Knee-fatigue + foul-trouble combo + SAS Wemby-anchored paint defense suppressed him below the line. Regression after consecutive 32/36 games was sharper than expected.' },
  },
  {
    id: 'r2-g5-sas-min-wemby-pts',
    slate: 'R2-G5', series: 'SAS-MIN', game: 5, postedAt: '2026-05-12',
    type: 'prop', pick: 'Wemby Over 27.5 points', odds: '-115',
    facts: [
      {label:'G1',value:'11pts (0-8 3PT anomaly)'},
      {label:'G2',value:'19pts (bounce-back start)'},
      {label:'G3',value:'39pts/15reb (Kareem-tier)'},
      {label:'G4',value:'ejected (4pts in 13min)'},
      {label:'Engine projection',value:'29pts'},
    ],
    reasoning: "Wemby ceiling games are the new baseline. G3 39pt road game at MIN + healthy at home + re-aggression spot after the ejection. The G4 ejection was 13min — he has rest. At Frost Bank Center + MIN's interior D (Gobert solo) + Reid hampered = paint attacks Wemby is comfortable with. Engine: 29pts. 27.5 is at the edge — small edge over. Slight lean over.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome: 'loss', actual: '27 points — UNDER by 0.5. The closest possible miss. 18 of his 27 came in Q1; SAS led by 30 by halftime so he didn\'t need to push for more. The very blowout that helped the ML lose this prop.' },
  },

  // ─── R2-G6 — TONIGHT (Thu 5/14: SAS-MIN G6) + TOMORROW (Fri 5/15: DET-CLE G6) ───
  // SAS-MIN: SAS leads 3-2, closeout at Target Center (MIN's elimination).
  // DET-CLE: CLE leads 3-2, closeout at Rocket Arena (DET's elimination).
  {
    id: 'r2-g6-sas-min-ml',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'ml', pick: 'SAS ML vs MIN', odds: '+150',
    facts: [
      {label:'Spread',value:'MIN -2.5 (est)'},
      {label:'Total',value:'O/U 217.5 (est)'},
      {label:'Series',value:'SAS leads 3-2'},
      {label:'G5',value:'SAS 126-97 (Wemby 27/17 — re-aggression bounce)'},
      {label:'Pattern',value:'Home team has won every game in the series'},
      {label:'Engine',value:'SAS 108, MIN 110 (MIN by 2, LOW)'},
    ],
    modelHook: { fn:'dml', args:['SAS-MIN',6] },
    reasoning: "<strong>SAS ML at +150 on the road is a value play, not the model's top pick.</strong> Engine: MIN by 2 (slight HCA + elimination-desperation tilt). Market: MIN -135 / SAS +150 (60/40). The pattern in this series — home team wins every game — is the load-bearing data point against SAS. But SAS has the talent edge, Wemby is in transcendent mode, and MIN's secondary scoring (Randle/McDaniels) has been suppressed all series. At +150 the implied 40% feels light vs engine's ~46-48%. Lean SAS but only with stake control; not a high-confidence pick.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'SAS 139-109. SAS won by 30 — road blowout in elimination. The home-pattern broke; +150 dog hit outright. Series ends 4-2 SAS, advance to WCF vs OKC.' },
  },
  {
    id: 'r2-g6-sas-min-spread',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'spread', pick: 'SAS +2.5', odds: '-110',
    facts: [
      {label:'Engine',value:'MIN by 2 (108-110)'},
      {label:'Market',value:'MIN -2.5'},
      {label:'Engine edge',value:'+0.5 pt to SAS cover'},
      {label:'G5 blowout',value:'SAS by 29 regresses — 4-game margin avg outside G5 was ~10'},
    ],
    modelHook: { fn:'dmargin', args:['SAS-MIN',6] },
    reasoning: "Engine MIN by 2; market MIN by 2.5. Half-point edge to SAS cover. Pure number play — engine and market are nearly identical so the +2.5 hook is the differentiator. SAS won't get blown out (talent + Wemby). MIN must-win desperation tightens the game; ANY single-digit SAS or MIN win lands +2.5 SAS in the green. Push at exactly 2 is realistic — the half-hook matters.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'SAS won 139-109 (by 30). SAS +2.5 cashed by a margin of 32.5 over the line.' },
  },
  {
    id: 'r2-g6-sas-min-total',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'total', pick: 'Under 217.5', odds: '-110',
    facts: [
      {label:'Series totals',value:'206, 228, 223, 223, 223 → median ~223'},
      {label:'G6 setup',value:'Elimination + tightened defense + Wemby foul-trouble risk'},
      {label:'Engine projection',value:'108 + 110 = 218 (right at the line)'},
    ],
    reasoning: "Engine projects 218 exact-on the 217.5 line. Lean: elimination games tend to slow down (tighter D, more fouls, fewer leak-out transitions). Wemby foul trouble in his Target Center memory game is a real risk that reduces pace. Both bigs (Gobert + Wemby) suggest a more half-court Q4. Slight lean Under but very close to a push.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome:'loss', actual:'Total = 248 (139+109) — way OVER 217.5. SAS blowout pace ran the score; MIN couldn\'t slow them down even in elimination.' },
  },
  {
    id: 'r2-g6-sas-min-wemby-reb',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'prop', pick: 'Wemby Over 12.5 rebounds', odds: '-145',
    facts: [
      {label:'Series rebounds',value:'15, 15, 15, 4 (ejected), 17 → 15+ in every full game'},
      {label:'Hostility lift',value:'Target Center crowd doesn\'t suppress rebounding'},
      {label:'Floor signal',value:'Cleanest in the dataset'},
    ],
    reasoning: "Wemby's rebound floor is the most reliable signal in this entire playoffs. 15+ in every game he\'s played at least 25 minutes this series (G1, G2, G3, G5). At 12.5 the line is 2.5 below his series median. Hostile crowd, must-win game opposite, fouls don\'t reduce rebounds (he\'ll play 33-36min anyway). ~92% hit rate.",
    confidence: 'best-bet', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Wemby 6 rebounds in 27 minutes — limited to under-half his series median because SAS blowout left him on the bench in Q4. Floor signal broke on the blowout side-effect, not on a defensive scheme.' },
  },
  {
    id: 'r2-g6-sas-min-edwards-pts',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'prop', pick: 'Edwards Over 27.5 points', odds: '-115',
    facts: [
      {label:'Series scoring',value:'18, 12, 32, 36, 20'},
      {label:'G6 setup',value:'Home, elimination, 2-day rest'},
      {label:'Last 3 home',value:'G3 32, G4 36 — Q4 closing pattern'},
      {label:'Engine projection',value:'30 pts'},
    ],
    reasoning: "Must-win elimination at home with 2-day rest. Series scoring trajectory: 18 (bench/knee), 12 (blowout), 32 (back to start), 36 (Q4 takeover), 20 (foul trouble + SAS targeting). Variance high. In a season-saving game his usage will spike to 32%+ and he\'ll demand 38-40min. Floor 27.5 means he needs to score 28+ — at home in his most important game of the year, that\'s the floor. ~70% hit.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Edwards 24 pts on 9-of-26 FG (3-of-12 3PT). Volume came (26 attempts) but Castle perimeter D crushed the efficiency. 3.5 short of the line.' },
  },
  {
    id: 'r2-g6-sas-min-castle-ast',
    slate: 'R2-G6', series: 'SAS-MIN', game: 6, postedAt: '2026-05-14',
    type: 'prop', pick: 'Castle Over 5.5 assists', odds: '-130',
    facts: [
      {label:'Series assists',value:'5, 6, 12, 8, 7 → all ≥5'},
      {label:'Facilitator role',value:'Wemby + Fox + K.Johnson all finishing'},
      {label:'Floor signal',value:'5+ in every game'},
    ],
    reasoning: "Castle has dished 5+ assists in every game of this series. Facilitator role with Wemby + Fox + K.Johnson + Harper as scoring options on the floor. 5.5 line is one below his series median. ~85% hit.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Castle 6 ast (plus 32 pts/11 reb closeout masterpiece). Facilitator floor held — barely cleared the line, but cleared.' },
  },

  // ─── DET-CLE G6 (Fri May 15, 7:00 PM ET @ Rocket Arena, CLE leads 3-2) ─
  // DET's elimination game. CLE chasing close-out + ECF berth (vs NYK).
  {
    id: 'r2-g6-det-cle-ml',
    slate: 'R2-G6', series: 'DET-CLE', game: 6, postedAt: '2026-05-14',
    type: 'ml', pick: 'CLE ML vs DET', odds: '-220',
    facts: [
      {label:'Spread',value:'CLE -5.5 (est)'},
      {label:'Total',value:'O/U 213.5 (est)'},
      {label:'Series',value:'CLE leads 3-2'},
      {label:'G5',value:'CLE 117-113 OT (Harden 30, Strus 6 made 3s)'},
      {label:'CLE home',value:'6-0 in playoffs'},
      {label:'Engine',value:'CLE 110, DET 104 (CLE by 6, MEDIUM)'},
    ],
    modelHook: { fn:'dml', args:['DET-CLE',6] },
    reasoning: "<strong>CLE ML at home with momentum from G5 OT.</strong> Engine: CLE by 6. Market: CLE -220 (~69% implied). CLE 6-0 at Rocket Arena in playoffs is the structural data point. DET's single-creator model needs another Cade tail-event (39 in G5 wasn\'t enough). Mitchell + Harden + Strus 3-headed offense at home covers the variance. The risk: DET undefeated at home this series and Cade is in MVP-tier form (39 G5). Implied 69% feels right.",
    confidence: 'high', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'DET 115-94 — CLE\'s first home loss of the entire 2026 playoffs (was 6-0 at Rocket). DET\'s defensive identity reasserted (41% CLE FG, 16 TOs forced). The CLE-home-fortress thesis broke. Series tied 3-3, G7 at LCA Sun 5/17.' },
  },
  {
    id: 'r2-g6-det-cle-spread',
    slate: 'R2-G6', series: 'DET-CLE', game: 6, postedAt: '2026-05-14',
    type: 'spread', pick: 'DET +5.5', odds: '-110',
    facts: [
      {label:'Engine',value:'CLE by 6 (110-104)'},
      {label:'Market',value:'CLE -5.5'},
      {label:'Engine edge',value:'+0.5 pt to DET cover'},
      {label:'Series spreads',value:'10, 10, 7, 9, 4 (OT) — all single digits except G3'},
    ],
    modelHook: { fn:'dmargin', args:['DET-CLE',6] },
    reasoning: "Engine CLE by 6; market CLE by 5.5. Half-point edge to DET cover. This series has had every game decided by 10 or fewer points in regulation (G1 and G2 were 10pt finishes). DET +5.5 is roughly even-money — Cade carry mode keeps DET within 5.5 in any non-blowout. ~52% cover.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'DET won outright 115-94 (by 21). DET +5.5 cashed by a 26.5 margin over the line.' },
  },
  {
    id: 'r2-g6-det-cle-total',
    slate: 'R2-G6', series: 'DET-CLE', game: 6, postedAt: '2026-05-14',
    type: 'total', pick: 'Under 213.5', odds: '-110',
    facts: [
      {label:'Series totals',value:'212, 204, 225, 215, 230 (OT) → ~215 reg-time median'},
      {label:'G5 OT inflation',value:'Adds ~8-10pts to total'},
      {label:'Elimination D',value:'Both teams ratchet up D'},
    ],
    reasoning: "Series totals: 212, 204, 225, 215, 230 (OT). G5 OT inflates that 230; in 48 minutes it would have been ~213-215. DET elimination game means tighter defense; CLE close-out means structured offense. 213.5 is at the regulation-time median; slight lean Under because elimination games suppress pace.",
    confidence: 'lean', thesis: ['historical','model'], narrative: null,
    result: { outcome:'win', actual:'Total = 209 (115+94) — UNDER 213.5. DET\'s defensive identity reasserted suppressed pace; CLE\'s 41% FG night kept the score down despite DET\'s 115pts.' },
  },
  {
    id: 'r2-g6-det-cle-mitchell-pts',
    slate: 'R2-G6', series: 'DET-CLE', game: 6, postedAt: '2026-05-14',
    type: 'prop', pick: 'Mitchell Over 26.5 points', odds: '-125',
    facts: [
      {label:'Series scoring',value:'23, 31, 35, 43, 21 → 30.6 avg'},
      {label:'CLE home',value:'31 (G2 — wait, G2 was DET), 35 (G3) — home avg'},
      {label:'G5 deferral',value:'Deferred to Harden in OT comeback; bounce-back spot'},
      {label:'Engine projection',value:'29 pts'},
    ],
    reasoning: "Mitchell at home in a close-out game = 28-32 baseline. G5 he deferred to Harden (21pts in 40+min) — bounce-back spot at home. CLE 6-0 at Rocket Arena, Mitchell averaged 33 in his G3 home win (35). The 26.5 line is below his home median. ~72% hit.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Mitchell 18 pts on 7-of-19 FG — sub-Mitchell night vs DET\'s defensive scheme that held the entire team to 41% FG. 8.5 short of the line.' },
  },
  {
    id: 'r2-g6-det-cle-cade-pts',
    slate: 'R2-G6', series: 'DET-CLE', game: 6, postedAt: '2026-05-14',
    type: 'prop', pick: 'Cade Over 24.5 points', odds: '-115',
    facts: [
      {label:'Series scoring',value:'23, 25, 27, 19, 39 → 26.6 avg'},
      {label:'Road games',value:'27 (G3), 39 (G5) — sustained on the road'},
      {label:'Single-creator burden',value:'DET needs Cade tail-event to extend'},
      {label:'Engine projection',value:'26 pts'},
    ],
    reasoning: "Cade is the entire DET offense on the road. Elimination at CLE forces 35+ minutes and 30%+ usage. G3 27, G5 39 on the road. 24.5 is below his road average. ~75% hit. The variance is on the upside (40+ possible) not the downside.",
    confidence: 'high', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Cade 21pts/9ast/7reb on 8-of-19 FG — distributed the load instead of going into hero-mode (Harris 14, Jenkins 15, Duren 15 picked up the slack). 3.5 short of the line.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G7 — TOMORROW (Sun May 17, 2026): DET-CLE G7 at LCA
  // ═══════════════════════════════════════════════════════════════
  // Series tied 3-3 after DET's 115-94 road blowout in G6.
  // WINNER ADVANCES TO ECF vs NYK. DET 3-0 at LCA this series; CLE was 6-0
  // at Rocket Arena until G6 broke that. Phase 17 (Li et al. 2025): G7
  // location not significant — EFG% + TOV% decide it.
  {
    id: 'r2-g7-det-cle-ml',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'ml', pick: 'DET ML vs CLE', odds: '-160',
    facts: [
      {label:'Series',value:'Tied 3-3'},
      {label:'G6',value:'DET 115-94 road blowout'},
      {label:'DET home',value:'3-0 at LCA this series'},
      {label:'Engine (Phase 71c)',value:'DET 108, CLE 107 (DET by 1)'},
      {label:'Framework verdict',value:'G7 cap → CAUTION'},
    ],
    modelHook: { fn:'dml', args:['DET-CLE',7] },
    reasoning: "<strong>DET ML at home in G7 — but the model says coin flip.</strong> Phase 71c engine: DET 108, CLE 107 (essentially even). Phase 71 framework G7 cap auto-downgrades every PLACE recommendation to CAUTION in elimination games — the 68-game audit found 50% winner accuracy at G6/G7. <strong style=\"color:var(--yellow)\">If betting, half-stake max.</strong> Phase 17 / Li et al.: G7 location NOT significant; EFG% + TOV% decide it. DET defensive identity from G6 (16 TOs forced) is the directional case. CLE's home fortress thesis broke in G6 — but G7 home crowd is the lurking factor the model can't see. Lean DET if you must bet, but the math says variance dominates skill here.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'CLE 125, DET 94 — DET ML lost outright (CLE by 31). G7 cap CAUTION call validated; betting it half-stake limited damage.' },
  },
  {
    id: 'r2-g7-det-cle-spread',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'spread', pick: 'CLE +3.5', odds: '-110',
    facts: [
      {label:'Engine (Phase 71c)',value:'DET by 1 (108-107)'},
      {label:'Market',value:'DET -3.5'},
      {label:'Engine edge',value:'CLE +3.5 covers by 2.5'},
      {label:'Framework verdict',value:'spread CAUTION (audit margin MAE 13pt) + G7 cap'},
    ],
    modelHook: { fn:'dmargin', args:['DET-CLE',7] },
    reasoning: "<strong>Engine NOW (post Phase 71c) projects DET by only 1pt</strong> — CLE +3.5 should cover by 2.5 per the model. BUT: <strong style=\"color:var(--yellow)\">Phase 71 audit found 12.94pt margin MAE</strong> — our spread predictions are essentially noise inside that error band. The G7 cap doubles the warning. Best read: take CLE +3.5 if you must play spread, but it's a coin flip, not edge. Don't size like it is.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'CLE 125, DET 94 — CLE won outright by 31, covered +3.5 by 34.5. Spread audit MAE 12.94pt nearly held with this single bet despite being right side.' },
  },
  {
    id: 'r2-g7-det-cle-total',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'total', pick: 'Under 211.5', odds: '-110',
    facts: [
      {label:'Series totals',value:'212, 204, 225, 215, 230 (OT), 209 → reg-time median ~213'},
      {label:'G7 historical',value:'G7s ~6-8pts below series median'},
      {label:'Engine (Phase 71c)',value:'108 + 107 = 215 (slightly OVER line)'},
      {label:'Framework verdict',value:'medium×total = SKIP cell (25% hit, -51% ROI)'},
    ],
    reasoning: "<strong>Phase 71c engine projects 215 total</strong> — slightly OVER the 211.5 line. The original Under thesis (engine 212 at the line, G7 defensive intensity) is partially dismantled by the per-player override raising Cade + Harris projections. Combined with the audit's medium×total SKIP cell (25% hit, -51% ROI), this is a SKIP regardless of intuitive G7 logic. <strong style=\"color:var(--yellow)\">Pre-Phase 71 we'd have placed this; framework says no.</strong>",
    confidence: 'lean', thesis: ['historical','model'], narrative: null,
    result: { outcome:'loss', actual:'CLE 125, DET 94 — total 219, OVER 211.5 by 7.5. Phase 71c-corrected engine projection of 215 was closer to actual than the 212 pre-fix estimate. SKIP verdict was right.' },
  },
  {
    id: 'r2-g7-det-cle-cade-pts',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'prop', pick: 'Cade Over 27.5 points', odds: '-115',
    facts: [
      {label:'Series scoring',value:'23, 25, 27, 19, 39, 21 → 25.7 avg'},
      {label:'Engine (Phase 71c)',value:'27.9 pts — LINE AT PROJECTION'},
      {label:'Framework verdict',value:'high×prop = SKIP cell + G7 cap'},
    ],
    reasoning: "<strong style=\"color:var(--yellow)\">Phase 71 framework verdict: SKIP.</strong> New per-player-corrected engine projection is 27.9pts — line 27.5 is right at the central estimate, making this a literal coin flip on Cade's distribution. The audit cross-tab also shows high×prop bets had 33% hit rate / -43% ROI in R2. Even if you trust Cade's home-G7 narrative, the line is priced inside the model's error band. The deeper alt line (O21.5) is the right way to bet this player tonight — see the DET Floor Parlay.",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Cade 13pts on 5-16 FG / 0-7 3PT — UNDER 27.5 by 14.5. Worst playoff game of his career; CLE schemed him off the floor. SKIP verdict was right; deep alt O21.5 also missed (see floor parlay).' },
  },
  {
    id: 'r2-g7-det-cle-mitchell-pts',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'prop', pick: 'Mitchell Over 24.5 points', odds: '-120',
    facts: [
      {label:'Series scoring',value:'23, 31, 35, 43, 21, 18 → 28.5 avg'},
      {label:'Engine (Phase 71c)',value:'25.3 pts — slightly over line'},
      {label:'Framework verdict',value:'medium×prop = SKIP cell + G7 cap'},
    ],
    reasoning: "Engine projects 25.3pts; line 24.5 is barely under. Audit cross-tab: medium×prop hit at 42% / -21% ROI. The line is too close to projection to call edge. Mitchell IS more likely to hit than not, but 'more likely' at -120 juice doesn't clear the framework's threshold. <strong style=\"color:var(--yellow)\">Treat as lean only at reduced stake; the deeper alt (O21.5) is the floor-parlay vehicle.</strong>",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Mitchell 26pts (10-19 FG, 3-8 3PT) in only 31min — OVER 24.5 by 1.5. Engine 25.3 projection right on. The lean was sound; line was just inside framework noise band.' },
  },
  {
    id: 'r2-g7-det-cle-duren-reb',
    slate: 'R2-G7', series: 'DET-CLE', game: 7, postedAt: '2026-05-16',
    type: 'prop', pick: 'Duren Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'Series rebounds',value:'8, 7, 9, 8, 8, 11 → 8.5 avg'},
      {label:'Engine (Phase 71c)',value:'8.8 reb — LINE ABOVE PROJECTION'},
      {label:'Framework verdict',value:'SKIP — Phase 71c suggests UNDER'},
    ],
    reasoning: "<strong style=\"color:var(--red)\">Phase 71c reversed the read on this bet.</strong> Pre-fix engine projected Duren ~9.8 reb (cleared 9.5). Post per-player correction (Phase 71c audit found Duren was over-predicted by +6.2pp PTS / +1.0 REB residually) the corrected projection is 8.8 — UNDER the line. Series rebs 8, 7, 9, 8, 8, 11 avg 8.5 confirms. Combined with high×prop SKIP cross-tab cell and G7 cap, this is a clear SKIP. The deeper alt (O7.5) in the floor parlay is the right way to capture his rebounding floor.",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Duren 9 reb in DET blowout loss — UNDER 9.5 by 0.5. Phase 71c-corrected projection (8.8) was directionally right vs original 9.8. Reversal-call validated.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF G1 — MON MAY 18: WCF SAS @ OKC at Paycom (defending champ + #1
  // seed vs Wemby-led upstart). Regular season: SAS went 4-1 vs OKC.
  // DraftKings: OKC -6.5 / total 219.5. CF tab UI is pending — these
  // bets are stored for the CF page when it lands; home page may not
  // surface them until SERIES_DATA scaffolds get full rosters.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g1-okc-sas-ml',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'ml', pick: 'OKC ML vs SAS', odds: '-260',
    facts: [
      {label:'Records',value:'OKC 64-18 (#1 W) | SAS #2 W'},
      {label:'Rest',value:'OKC 7 days | SAS 3 days'},
      {label:'Reg season',value:'SAS 4-1 vs OKC'},
      {label:'Market',value:'OKC -6.5 / 219.5'},
    ],
    reasoning: "<strong>Defending champ at home with full rest.</strong> OKC's 11.6 NetRtg vs SAS's depth at the wing positions makes OKC the talent favorite. The 4-1 regular-season record SAS holds is the lurking variable — but those games were spread across the season vs full-strength OKC playing 9-day-rest could be different. <strong style=\"color:var(--yellow)\">Reduced confidence:</strong> CF G1 historical accuracy is in the same elimination-game bucket the Phase 71 audit flagged. -260 juice is steep for a single bet; the floor parlay is the better expression.",
    confidence: 'medium', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'SAS 122-115 (2OT). Wemby 41/24/3blk + game-sealing dunks in final minute. The 4-1 regular-season pattern held — SAS stole HCA. Phase 71 G6/G7 elimination caution would have downgraded this, but G1 sits outside the explicit cap.' },
  },
  {
    id: 'cf-g1-okc-sas-spread',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'spread', pick: 'OKC -6.5', odds: '-110',
    facts: [
      {label:'Market',value:'OKC -6.5'},
      {label:'WCF G1 base',value:'~67% home team covers G1 with full rest'},
    ],
    reasoning: "OKC at home with 7 days rest vs SAS's 3 — the rest gap is a 2-3pt edge in OKC's favor. Spread cell historical performance per Phase 71 audit is the cautionary note (margin MAE 13pt). Treat as lean. The SGA-vs-Castle perimeter battle + Holmgren-vs-Wemby paint chess will be the structural decider.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'SAS won outright 122-115 in 2OT — spread didn\'t come close. The Phase 71 spread CAUTION pill was the right verdict; this should not have been placed at posted stake.' },
  },
  {
    id: 'cf-g1-okc-sas-total',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'total', pick: 'Under 219.5', odds: '-110',
    facts: [
      {label:'OKC R2 totals',value:'215, 227, 230, 237 → 227 avg'},
      {label:'SAS R2 totals',value:'209, 211, 228, 207, 223, 248 → 221 avg'},
      {label:'WCF G1 base',value:'CF openers historically ~5pts below series median'},
    ],
    reasoning: "Both teams' R2 totals averaged ~221-227 — line of 219.5 is slightly below that pool but Phase 17 finds CF G1 totals tend to settle ~5pts below the R2 median (teams play tighter Q1 D when they're newly scouted). Wemby's rim protection (3.7 blocks/g this playoffs) is the key under-driver — OKC's drive-and-kick offense crashes against length the way it doesn't vs LAL.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'237 total (SAS 122 + OKC 115, 2OT) — way over 219.5. Reg-time score was 99-99 (198) which WOULD have hit under, but Caruso\'s 8 made threes plus the 2OT pushed it 17.5 over the line.' },
  },
  {
    id: 'cf-g1-okc-sas-sga-pts',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'prop', pick: 'SGA Over 28.5 points', odds: '-115',
    facts: [
      {label:'R2 scoring vs LAL',value:'25, 22, 23, 35 → 26.3 avg'},
      {label:'2026 playoff avg',value:'27.4 ppg overall'},
      {label:'OKC home games',value:'+3 ppg vs road'},
    ],
    reasoning: "SGA at home, full rest, after closeout 35pt G4 vs LAL. Wemby is NOT his primary defender (Castle/Vassell will take the assignment), so this becomes a guard-on-guard battle SGA wins on volume. Line of 28.5 is slightly above his 26.3 R2 avg but home + rest + Castle/Vassell as POA defenders (not Wemby blocking the rim) supports the over.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'SGA 24pts on 7-23 FG (30%) + 12 ast in 49+min. Even with 2OT volume he couldn\'t clear 28.5 — Castle/Harper hounded him at the POA and the looks were contested. Phase 71 SGA per-player bias correction (-6.9 PTS) absolutely predicted this; the bet contradicted the override.' },
  },
  {
    id: 'cf-g1-okc-sas-wemby-reb',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'prop', pick: 'Wembanyama Over 11.5 rebounds', odds: '-130',
    facts: [
      {label:'R2 rebounds',value:'5, 15, 15, 12, 17, 6 → 11.7 avg'},
      {label:'OKC opposing C rebs',value:'Holmgren 9.5/g, Hartenstein 9.2/g'},
      {label:'Wemby playoff avg',value:'11.5 rpg overall'},
    ],
    reasoning: "Wemby's series rebound floor was 5 (G1 limited mins) and 6 (G6 closeout blowout) — outside those two outliers, 12+ every game. OKC's smaller wings will force Wemby into more defensive rebounds. Line 11.5 is right at his series average; lean over given the matchup.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Wemby 24 rebounds — playoff career high. The OKC drive-and-kick produced exactly the miss volume thesis predicted, and Wemby cleaned both ends of the glass. Sole winning bet on the OKC-SAS G1 slate.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // ECF G1 — TUE MAY 19: CLE @ NYK at MSG (8 PM ET, ESPN)
  // NYK swept PHI 4-0 (9-day rest); CLE beat DET 4-3 (1-day rest).
  // DraftKings: NYK -7.5 / ML -265 / total 215.5.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ecf-g1-nyk-cle-ml',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'ml', pick: 'NYK ML vs CLE', odds: '-265',
    facts: [
      {label:'Records',value:'NYK 55-27 (#3 E) | CLE 57-25 (#4 E)'},
      {label:'Rest',value:'NYK 9 days | CLE 1 day'},
      {label:'R2 path',value:'NYK swept PHI 4-0 | CLE beat DET 4-3 (G7 road blowout)'},
      {label:'Market',value:'NYK -7.5 / 215.5'},
    ],
    reasoning: "NYK at home with the largest rest gap in any ECF G1 on record (9 days vs 1 day). CLE flew in from a G7 road blowout — Mitchell played 31min, Allen on chronic knee, Mobley 12reb workload. The rest disparity is worth 3-4pts in the model + the 1-day turnaround caps CLE's intensity ceiling. Rust risk for NYK is real but 9-day breaks historically produce 4-6pt Q1 dips, not full-game collapses. The PHI sweep showed NYK can score from anyone (McBride 25 G4, Shamet 12 bench, KAT 17/12/7ast distributing) — depth dilutes the rust effect.",
    confidence: 'medium', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'win', actual:'NYK 115-104 OT via 22pt comeback (44-11 closing run from down 93-71 with 7:52 left). Brunson 38, KAT 13/13/5/1blk; CLE shot 22% over the closing stretch. ML hit at -265.' },
  },
  {
    id: 'ecf-g1-nyk-cle-spread',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'spread', pick: 'NYK -7.5', odds: '-110',
    facts: [
      {label:'Market',value:'NYK -7.5 / DK opener'},
      {label:'ECF G1 home covers',value:'~64% historically with rest edge'},
      {label:'CLE one-day-rest record',value:'~38% cover on one-day turnaround playoff games'},
    ],
    reasoning: "Phase 71 spread CAUTION flag is the cautionary note (margin MAE 13pt). But the structural setup — CLE on 1-day rest after a road G7, NYK on 9-day rest at home — is the largest disparity all playoffs. Sweep team vs G7 team at home is the highest-cover edge in the historical sample. Treat as lean per audit guidance.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'NYK by 11 (115-104 OT) — covered -7.5 by 3.5pts. The Phase 71 spread CAUTION was overcome by an OT margin (regulation tied 99-99 — would have pushed −7.5 with NYK +5 push only); but with the OT push to 11 the spread covered cleanly.' },
  },
  {
    id: 'ecf-g1-nyk-cle-total',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'total', pick: 'Under 215.5', odds: '-110',
    facts: [
      {label:'NYK pace',value:'97.5 (mid-pack)'},
      {label:'CLE pace',value:'96.8 (slow)'},
      {label:'ECF G1 base',value:'Historical ECF G1 totals ~5pts under regular line'},
      {label:'NYK R2 totals',value:'235, 210, 202, 258 → 226 avg (skewed by NYK G4 144 explosion)'},
    ],
    reasoning: "Both teams are bottom-third in pace; defense is the structural backbone of both rotations (NYK DRtg 111.8 / CLE DRtg 110.5). ECF G1 historically settles 4-6pts below regular-season line as defensive scouts intensify. NYK's G4 144pts vs PHI was a 3PT outlier (25 made threes); regression to mean is the realistic G1 path. The Brunson-Mitchell pull-up scoring is offset by Bridges/OG/Strus perimeter D — long contested possessions = lower totals.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'219 total (NYK 115 + CLE 104, OT) — over 215.5 by 3.5pts. Regulation tied 99-99 = 198 total (would have hit under) but the 5min OT pushed it over. Phase 71 total CAUTION/SKIP framework would have downgraded this; OT is the kind of variance the framework warns against.' },
  },
  {
    id: 'ecf-g1-nyk-cle-brunson-pts',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'prop', pick: 'Brunson Over 26.5 points', odds: '-115',
    facts: [
      {label:'R2 scoring vs PHI',value:'35, 22, 33, 26 → 29 avg'},
      {label:'NYK home games',value:'+2.4 ppg vs road'},
      {label:'Phase 71 STARTER correction',value:'-2.0 PTS applied'},
    ],
    reasoning: "Brunson averaged 29 vs PHI — line of 26.5 is 2.5 below that. Phase 71 STARTER tier correction (-2.0pp) applied: corrected projection 27 → still over 26.5 by 0.5. Tight margin but home + ECF stage + Mitchell guarding him at one end (which forces Brunson into Mitchell-mode counters) supports the over. The Phase 71 audit deemed Brunson calibrated within STARTER tier; no per-player override.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Brunson 38pts/5reb/6ast — cleared 26.5 by 11.5pts. He single-handedly drove the 22pt comeback. The STARTER tier correction was the right floor; ceiling games like this are the upside that puts the bet over.' },
  },
  {
    id: 'ecf-g1-nyk-cle-mitchell-pts',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'prop', pick: 'Mitchell Over 25.5 points', odds: '-110',
    facts: [
      {label:'R2 scoring vs DET',value:'35, 30, 21, 43, 18, 26 → 28.8 avg'},
      {label:'G7 last night',value:'26pts in 31min (blowout cap)'},
      {label:'NYK perimeter D',value:'Bridges/OG elite POA defenders'},
    ],
    reasoning: "Mitchell averaged 28.8 vs DET — line 25.5 below that. G7 26pts in 31min on 0 TOs shows the legs are there. NYK perimeter D (Bridges/OG/Hart) is the toughest he's seen this postseason — that's a -3 to -4pp ceiling drag. Net projection ≈ 26 → lean over with caution. Phase 71 STARTER bias correction applied (-2pp); audit-corrected projection 26.8 still clears 25.5.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'win', actual:'Mitchell 29pts/5reb/3ast/6stl — cleared 25.5 by 3.5. Had 26pts through 3Q, then went 1-for-6 over the final 17min as the NYK comeback unfolded. Hit the line even with the late-game freeze.' },
  },
  {
    id: 'ecf-g1-nyk-cle-kat-reb',
    slate: 'CF-G1', series: 'NYK-CLE', game: 1, postedAt: '2026-05-19',
    type: 'prop', pick: 'KAT Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'R2 vs PHI',value:'12, 10, 12, 4 → 9.5 avg (G4 blowout-capped)'},
      {label:'Mobley/Allen presence',value:'Twin-big front court drives miss volume'},
      {label:'KAT season avg',value:'10.7 rpg'},
    ],
    reasoning: "KAT averaged 9.5 vs PHI even with G4 blowout cap. CLE runs twin-big with Mobley/Allen — that creates more contested rebounds at both rims than PHI's Drummond-solo setup. Line 9.5 is exactly at his R2 average; the structural matchup nudges over. Counting stat = blowout-stable (won't be capped by garbage time).",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'KAT 13reb/13pts/5ast/1blk in 40min — cleared 9.5 by 3.5. The CLE twin-big setup produced exactly the rebound volume the matchup thesis predicted; KAT controlled both ends of the glass.' },
  },

  // Phase 72 addition: Holmgren rebound prop (complements the
  // existing cf-g1-okc-sas-wemby-reb entry above). The two REB props
  // are the floor parlay's source legs — see FEATURED_PARLAYS.
  {
    id: 'cf-g1-okc-sas-holmgren-reb',
    slate: 'CF-G1', series: 'OKC-SAS', game: 1, postedAt: '2026-05-18',
    type: 'prop', pick: 'Holmgren Over 8.5 rebounds', odds: '-125',
    facts: [
      {label:'R2 vs LAL',value:'12, 8, 8, 12 → 10.0 avg'},
      {label:'Engine (Phase 71c)',value:'9.2 reb'},
      {label:'Matchup',value:'vs Wemby — both fight for boards'},
    ],
    reasoning: "Holmgren projection 9.2 reb. R2 vs Ayton: 10.0 avg. Wemby matchup is brutal but Holmgren's mobility wins offensive boards. Phase 71 starter REB bias now calibrated (+0.19). Companion leg to Wemby O9.5 alt in the WCF G1 Bigs Floor parlay.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Holmgren 8reb in 2OT game — just under 8.5 by 0.5 (per series-data narrative: 8/8/2blk on 2-7 FG). Despite the 49+min game time, OKC\'s 7-23 SGA night plus Wemby/Harper claiming 35 combined boards squeezed Holmgren\'s defensive rebound share. Phase 71c REB calibration was directionally right; rough night for OKC\'s big.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF G3 — FRI MAY 22: WCF G3 OKC @ SAS at Frost Bank Center
  // Series tied 1-1. DK opener: SAS -1.5 / total 217.5 / OKC ML +105,
  // SAS ML -125. SAS at home after losing G2. Wemby's G1 49+min load
  // is the rest-management variable.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g3-okc-sas-ml',
    slate: 'CF-G3', series: 'OKC-SAS', game: 3, postedAt: '2026-05-22',
    type: 'ml', pick: 'SAS ML vs OKC', odds: '-125',
    facts: [
      {label:'Series',value:'Tied 1-1, shifts to Frost Bank Center'},
      {label:'Home record',value:'SAS 6-0 at Frost this playoffs'},
      {label:'Reg season',value:'SAS 4-1 vs OKC'},
      {label:'Market',value:'SAS -1.5 / 217.5'},
    ],
    reasoning: "Phase 71c engine: SAS 116, OKC 112 (SAS by 4). Series shifts to Frost Bank where SAS was 6-0 this playoffs (+5.4 net at home). Castle-vs-SGA round 2: Castle held SGA to 7-23 in G1; G2 SGA bounced to 30/9 on Wemby min-restriction night — Frost crowd flips the leverage back. Caruso's 8-of-13 3PT across G1+G2 is the regression variable (model says he reverts to ~38% from 62%). The 4-1 regular-season pattern + home setting align with the engine read.",
    confidence: 'medium', thesis: ['model','matchup','historical'], narrative: null,
    result: { outcome:'loss', actual:'OKC won 123-108 — SAS ML missed. Engine wrong-winner: had SAS by 4 at home with the regression-to-mean Caruso 3PT narrative; instead Caruso/McCain/J.Williams combined for 49 off the bench (OKC bench 76 vs SAS bench 23) and Castle/Harper played through Wed injuries.' },
  },
  {
    id: 'cf-g3-okc-sas-spread',
    slate: 'CF-G3', series: 'OKC-SAS', game: 3, postedAt: '2026-05-22',
    type: 'spread', pick: 'SAS -1.5', odds: '-110',
    facts: [
      {label:'Market',value:'SAS -1.5'},
      {label:'WCF G3 home',value:'~62% cover with 1-1 split'},
      {label:'Phase 71 audit',value:'Spread CAUTION (MAE 13pt)'},
    ],
    reasoning: "Phase 71 spread CAUTION pill auto-applies — treat as lean. Engine margin says SAS by 4 which would cover -1.5 by 2.5. Wemby's home court energy + Castle/Harper paint-handle the OKC switching scheme + Caruso 3PT regression all stack toward SAS. Risk: J. Williams returning could give OKC a wing dimension SAS hasn't seen this series.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'SAS lost by 15 (OKC 123-108). Phase 71 spread CAUTION proved correct — the audit MAE 13pt warning bracketed the 19pt margin miss exactly.' },
  },
  {
    id: 'cf-g3-okc-sas-total',
    slate: 'CF-G3', series: 'OKC-SAS', game: 3, postedAt: '2026-05-22',
    type: 'total', pick: 'Under 217.5', odds: '-110',
    facts: [
      {label:'G1 reg total',value:'198 (then 2OT to 237)'},
      {label:'G2 total',value:'235 (turnover-driven)'},
      {label:'WCF home G3',value:'~5pts below reg total in scout-tight games'},
    ],
    reasoning: "G1 regulation 198 (under-territory before OT), G2 235 (transition outlier from 21 TOs). Frost Bank settings historically tighten — slower pace, more set offense. Phase 71 total SKIP at medium confidence; treat as lean only. The Wemby-Holmgren rim chess + Castle-SGA POA battle should produce more contested possessions = fewer points.",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Total 231 (OKC 123, SAS 108) — clear over the 217.5 line. Frost Bank tightening thesis flunked when OKC bench output (76pts) propped the OKC half above pace expectations.' },
  },
  {
    id: 'cf-g3-okc-sas-wemby-pts',
    slate: 'CF-G3', series: 'OKC-SAS', game: 3, postedAt: '2026-05-22',
    type: 'prop', pick: 'Wembanyama Over 25.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'41, 21 → 31 avg'},
      {label:'Home games this playoff',value:'+4.1 ppg vs road'},
      {label:'Engine (Phase 71c)',value:'27 PTS — calibrated'},
    ],
    reasoning: "Wemby home + post-restriction G2 = full-tank G3 in front of Frost Bank. 21 in G2 was minutes-capped (28min instead of 49+ G1). Line 25.5 is a half-point below engine projection. Phase 71 ELITE tier correction (-2.6 PTS) applied: 31 series avg → corrected 28.4 → still clears 25.5 cleanly.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Wemby 26pts on 8-15 FG — cleared 25.5 by 0.5. Engine projection nailed within 2.5pts; the line-tracking PTS leg was the only standalone bet to hit this slate.' },
  },
  {
    id: 'cf-g3-okc-sas-sga-pts',
    slate: 'CF-G3', series: 'OKC-SAS', game: 3, postedAt: '2026-05-22',
    type: 'prop', pick: 'SGA Over 27.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'24, 30 → 27 avg'},
      {label:'Phase 71c bias',value:'-6.9 PTS per-player override applied'},
      {label:'Castle matchup',value:'POA defender, 0.91 dLEBRON'},
    ],
    reasoning: "SGA series avg 27 against Castle. Phase 71c per-player override (-6.9) is heavy — corrected projection ~24 (UNDER 27.5). The bias-correction framework says lean UNDER but the bet pick is OVER — leaving this as a calibration check: if Castle/Harper hounding continues at G1 levels, override is right; if SGA acclimates after G2 30pts, the override has run its course. <strong>SKIP this entry</strong> per framework — included for transparency but the pill auto-classifies SKIP via the override.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'SGA 30pts on 12-22 FG — clears 27.5 by 2.5. Phase 71c override (-6.9) was directionally WRONG for this game: actual line was SGA acclimating to Castle (hot Castle 13 FG was injury-driven, not Castle defense). Recalibration note: when defender is playing through injury, per-player override should NOT fire at full strength.' },
  },
  {
    id: 'cf-g3-okc-sas-castle-pts',
    slate: 'CF-G3', series: 'OKC-SAS', game: 3, postedAt: '2026-05-22',
    type: 'prop', pick: 'Castle Over 19.5 points', odds: '-110',
    facts: [
      {label:'Series PTS',value:'?, 25 → emerging primary creator'},
      {label:'Engine',value:'21 PTS — calibrated, home boost'},
      {label:'Usage',value:'Castle USG climbing as Wemby gets doubled'},
    ],
    reasoning: "Castle has emerged as SAS's secondary creator while playing elite POA defense on SGA. G2: 25/8ast in San Antonio's transition-heavy game. With Fox/Harper banged up (day-to-day), Castle's usage projects to climb further in G3. Phase 71 STARTER tier calibrated (no override). Home crowd lift + matchup edge nudges over.",
    confidence: 'medium', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Castle 13pts on 4-12 FG — well under 19.5. Wednesday hard-contact bruise carried through tip; engine had no input for the late-week health flag and over-projected usage climb. Same pattern (injury underwriting OUT-day projections) the G3 modelLessons[] retro flagged.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // ECF G3 — SAT MAY 23: NYK @ CLE at Rocket Arena
  // NYK leads 2-0. CLE desperation home game. NYK on back-to-back.
  // Lines TBD morning of game; opening estimates priced here.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g3-nyk-cle-ml',
    slate: 'CF-G3', series: 'NYK-CLE', game: 3, postedAt: '2026-05-22',
    type: 'ml', pick: 'CLE ML vs NYK', odds: '-140',
    facts: [
      {label:'Series',value:'NYK leads 2-0, must-win for CLE'},
      {label:'CLE home record',value:'6-1 at Rocket this playoffs'},
      {label:'NYK rest',value:'B2B after G2 5/21 → travel → G3 5/23'},
    ],
    reasoning: "<strong>5/23 MC re-validation:</strong> raw engine actually projects NYK by 1 (NYK 107 — CLE 106) and Monte Carlo gives CLE ~51% — essentially a coin flip on the model side. The lead bet thesis is <strong>structural, not engine-driven</strong>: (a) down-0-2 home historical win rate 68%, which the engine doesn't price in as a situational prior; (b) NYK on back-to-back + travel after a G1 OT marathon vs CLE with a full rest day; (c) CLE 6-0 at Rocket Arena pre-DET G6; (d) CLE adjustments incoming (Harden off-ball, Mitchell volume to 30+ in close-out-of-elimination). At -140 (58.3% implied) vs structural ~55-60% true probability, this is a SMALL +EV lean rather than a clean PLACE — CF unknown-territory cap on stakes already trims exposure. Risk: NYK depth (Hart, KAT, McBride, Shamet) doesn't tire the way top-heavy CLE will.",
    confidence: 'medium', thesis: ['matchup','historical','situational'], narrative: 'desperation',
    result: { outcome:'loss', actual:'NYK won 121-108. CLE ML missed. The down-0-2 home prior + B2B fatigue thesis didn\'t hold against NYK\'s composure (NYK shot 55.8% / 11 made 3s / 24-27 FT). NYK now leads 3-0 with closeout on Mon 5/25.' },
  },
  {
    id: 'cf-g3-nyk-cle-spread',
    slate: 'CF-G3', series: 'NYK-CLE', game: 3, postedAt: '2026-05-22',
    type: 'spread', pick: 'CLE -3', odds: '-110',
    facts: [
      {label:'Market opener',value:'CLE -3 (estimated)'},
      {label:'ECF G3 home',value:'~64% cover when home team trails 0-2'},
    ],
    reasoning: "Phase 71 spread CAUTION pill auto-applies. <strong>5/23 MC re-validation:</strong> raw engine NYK by 1, MC margin median ~0pt — CLE -3 needs CLE to win by 4+, which the model gives ~40% probability vs -110 (52.4% implied) → -EV by ~12% per pure model. Same structural counter-argument as the ML lean (down-0-2 home covers historically ~55% per Dean Oliver retro). Treat as a half-stake lean only; the CAUTION pill is doing real work here.",
    confidence: 'lean', thesis: ['market','historical','situational'], narrative: null,
    result: { outcome:'loss', actual:'CLE -3 missed by 16 (NYK won by 13). CAUTION pill was doing real work; the MC re-validation note (-EV by ~12% per pure model) was directionally right.' },
  },
  {
    id: 'cf-g3-nyk-cle-mitchell-pts',
    slate: 'CF-G3', series: 'NYK-CLE', game: 3, postedAt: '2026-05-22',
    type: 'prop', pick: 'Mitchell Over 27.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'29, 26 → 27.5 avg'},
      {label:'Phase 71 STARTER',value:'-2.0 PTS correction → 25.5'},
      {label:'Down-0-2 ceiling',value:'Mitchell historically +4 PTS in must-win'},
    ],
    reasoning: "Mitchell series avg 27.5; STARTER correction → 25.5 raw projection. Down-0-2 home he's historically +4 PTS over season avg (must-win volume up). Net projection 29.5 → lean over. Risk: NYK perimeter D (Bridges/OG/Hart) is the toughest he's seen; can drag ceiling 2-3pts.",
    confidence: 'medium', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Mitchell 23pts on 9-21 FG (3-10 3PT) — well under 27.5. The down-0-2-must-win volume bump produced the SHOTS (21 attempts) but not the efficiency. NYK switching scheme (Bridges/OG/Hart rotating) capped him as projected.' },
  },
  {
    id: 'cf-g3-nyk-cle-brunson-pts',
    slate: 'CF-G3', series: 'NYK-CLE', game: 3, postedAt: '2026-05-22',
    type: 'prop', pick: 'Brunson Over 24.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'38, 19 → 28.5 avg'},
      {label:'G2 line',value:'19/14ast (facilitator night)'},
      {label:'B2B + road',value:'-1 to -2 PTS adjustment'},
    ],
    reasoning: "Brunson 38 G1 / 19 G2 — facilitator night with 14 assists shows variability. Phase 71 STARTER correction (-2.0). Net projection ~25 → just over the line. B2B + road = small additional drag. Lean over.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'Brunson 30pts on 10-19 FG / 10-12 FT — cleared the line by 5.5. Controlled the game from the foul line (24 NYK FTAs).' },
  },
  {
    id: 'cf-g3-nyk-cle-mobley-reb',
    slate: 'CF-G3', series: 'NYK-CLE', game: 3, postedAt: '2026-05-22',
    type: 'prop', pick: 'Mobley Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'Series REB',value:'14, ? → 12+ avg'},
      {label:'KAT matchup',value:'twin-big rebound dynamic continues'},
      {label:'Phase 71 STARTER REB',value:'calibrated'},
    ],
    reasoning: "Mobley 14reb G1, 9reb G2 (with Allen back to full minutes the KAT-vs-Mobley REB split shifted). <strong>5/23 MC re-validation:</strong> calcExpectedPlayerStats for ECF G3 returns 9.0 reb (not 12 as authored yesterday — Allen's reb share comes back when he plays 30min). MC mean 8.2, hit rate ~31% on the 9.5 line. This is essentially a coin-flip-to-lean-under bet, NOT a confident over. <strong>SKIP per framework</strong>: Phase 71 STARTER REB is calibrated but at-the-line, and -130 needs 56.5% implied vs ~35% MC — heavily -EV at this line. Use the 7.5 alt instead (engine 9.0, ~70% over) which the floor parlay uses.",
    confidence: 'coin-flip', thesis: ['matchup'], narrative: null,
    result: { outcome:'loss', actual:'Mobley 6 reb — well under 9.5. Allen 7reb in 36min crushed the share, exactly as the MC re-validation flagged. Even the 7.5 alt floor leg missed by 1.5 — Allen back at full minutes broke the rebound-split assumption.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // WCF G4 — SUN MAY 24: OKC @ SAS at Frost Bank Center
  // SAS down 1-2 must-win. DK current: SAS -1.5 / total 218.5
  // (opener was SAS -2.5; market tightened after G3 OKC blowout +15).
  // Castle/Harper one more rest day; Wemby revenge after 4reb G3.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g4-okc-sas-ml',
    slate: 'CF-G4', series: 'OKC-SAS', game: 4, postedAt: '2026-05-24',
    type: 'ml', pick: 'SAS ML vs OKC', odds: '-138',
    facts: [
      {label:'Series',value:'OKC leads 2-1, SAS must-win to avoid 1-3'},
      {label:'Home record',value:'SAS 7-1 at Frost this playoffs'},
      {label:'Down-1-2 home',value:'historically wins 64%'},
      {label:'Market',value:'SAS -1.5 / 218.5 (opener was SAS -2.5)'},
    ],
    reasoning: "Phase 71c engine: SAS 113, OKC 109 (SAS by 4). G4 at Frost with Wemby healthy and Castle/Harper one extra day of healing. Down-1-2 with HCA next game historically wins 64%; the must-win urgency converts the close engine margin into a real edge. OKC counter: J.Williams day-to-day status uncertain — without him, OKC bench depth drops from 76 (G3) to ~50 projected. Risk: same G3 setup said SAS by 4 and OKC won by 15 — the wrong-winner streak in CF is real (G1 right, G3 wrong on OKC-SAS specifically). Phase 71 R3 out-of-sample stake cap at 50% remains.",
    confidence: 'medium', thesis: ['model','historical','situational'], narrative: 'must-win',
    result: { outcome:'win', actual:'SAS 103-82 — SAS won outright by 21' },
  },
  {
    id: 'cf-g4-okc-sas-spread',
    slate: 'CF-G4', series: 'OKC-SAS', game: 4, postedAt: '2026-05-24',
    type: 'spread', pick: 'SAS -1.5', odds: '-115',
    facts: [
      {label:'Market',value:'SAS -1.5 (tightened from -2.5 opener)'},
      {label:'Engine margin',value:'SAS by 4'},
      {label:'Phase 71 audit',value:'Spread CAUTION (MAE 13pt)'},
    ],
    reasoning: "Phase 71 spread CAUTION pill auto-applies. Engine margin SAS by 4 covers -1.5 by 2.5. The line move from -2.5 to -1.5 reflects sharp $ on OKC (G3 momentum + bench depth thesis); the structural must-win edge for SAS is still the lever. Treat as half-stake lean only — CAUTION pill doing real work.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'SAS won by 21 — covered -1.5 by 19.5' },
  },
  {
    id: 'cf-g4-okc-sas-total',
    slate: 'CF-G4', series: 'OKC-SAS', game: 4, postedAt: '2026-05-24',
    type: 'total', pick: 'Under 218.5', odds: '-110',
    facts: [
      {label:'G1 reg',value:'198 (then 2OT to 237)'},
      {label:'G2 total',value:'235 (turnover-driven)'},
      {label:'G3 total',value:'231 (bench-outburst)'},
      {label:'Frost Bank',value:'paint-heavy → tighter than 218.5'},
    ],
    reasoning: "G3 went over despite Frost tightening — but that was driven by an outlier 76-pt OKC bench. The 5/24 setup is different: SAS must-win → more half-court possessions, longer clock burn, fewer transition opportunities. Engine projects 222 total (SAS 113 + OKC 109) — slightly over the line. Phase 71 total SKIP at medium confidence — treat as a lean.",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Total 185 (SAS 103 + OKC 82) — UNDER by 33.5pts. SAS defense throttled OKC to its 2nd-lowest postseason total.' },
  },
  {
    id: 'cf-g4-okc-sas-wemby-pts',
    slate: 'CF-G4', series: 'OKC-SAS', game: 4, postedAt: '2026-05-24',
    type: 'prop', pick: 'Wembanyama Over 26.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'41, 21, 26 → 29.3 avg'},
      {label:'Home + revenge',value:'+3.5 PTS vs road in playoffs'},
      {label:'Engine (Phase 71c)',value:'26.2 PTS — right at the line'},
    ],
    reasoning: "Wemby home + revenge after G3 4reb gameplan box. Engine 26.2 right at the line. Phase 71 ELITE tier correction (-2.6) applied; the model says coin-flip-over. MC mean 20.7 with team-shock drag — closer to ~45% over per pure model. CBS computer model projects 26.9 (DK opener), FanDuel 27.1. Lean over but use 22.5 alt for stronger angle (~80% over).",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'win', actual:'Wemby 33pts — OVER 26.5 by 6.5. Revenge-game-script delivered with a 40-ft buzzer-beater + 27-footer 24sec in.' },
  },
  {
    id: 'cf-g4-okc-sas-castle-pts',
    slate: 'CF-G4', series: 'OKC-SAS', game: 4, postedAt: '2026-05-24',
    type: 'prop', pick: 'Castle Over 17.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'8, 25, 13 → 15.3 avg'},
      {label:'G3 Wed contact',value:'one extra day of healing'},
      {label:'Engine',value:'18.5 PTS — calibrated, home + recovery'},
    ],
    reasoning: "Castle 25 G2 / 13 G3 (Wed-contact bruise). Extra rest day should restore POA aggression. Engine projects 18.5 with healed-Castle assumption, MC mean 15.0 — coin-flip on 17.5 line but +EV on the 14.5 alt for a floor leg. The 17.5 line at -115 is ~46% true vs 53.5% implied → marginal -EV per pure model.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Castle 13pts — UNDER 17.5 by 4.5. Healed, but locked in as primary POA + distributor (5ast) — blowout context also capped his Q4 minutes. The 14.5 alt would have stayed safer.' },
  },
  {
    id: 'cf-g4-okc-sas-sga-pts',
    slate: 'CF-G4', series: 'OKC-SAS', game: 4, postedAt: '2026-05-24',
    type: 'prop', pick: 'SGA Over 26.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'24, 30, 26 → 26.7 avg'},
      {label:'Phase 71c bias',value:'-6.9 PTS per-player override applied'},
      {label:'Castle health',value:'restored POA defense pulls SGA down'},
    ],
    reasoning: "SGA series avg 26.7; Phase 71c per-player override (-6.9) corrects raw projection from 30 to 23. The override has been directionally right G1 (24 actual) and G3 (26 actual) — both within 2pts of the corrected projection. Line 26.5 sits right at series avg; with Castle/Harper restored, override should drive SGA back under. SKIP per framework — override + matchup health both point under.",
    confidence: 'coin-flip', thesis: ['model'], narrative: null,
    result: { outcome:'loss', actual:'SGA 19pts on 6-15 FG — UNDER 26.5 by 7.5. The "under" read on this line was correct (matchup health + override -6.9pt) but the cell was tagged coin-flip-over per the original pick; flagged as a loss since the OVER pick did not hit. Phase 71c override + Castle health restoration both materialized exactly as the SKIP analysis warned.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // ECF G4 — MON MAY 25: NYK @ CLE at Rocket Arena
  // NYK leads 3-0 with closeout chance. CLE elimination (0-156
  // historical for down-0-3). DK: NYK -1.5 / total 217.5.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g4-nyk-cle-ml',
    slate: 'CF-G4', series: 'NYK-CLE', game: 4, postedAt: '2026-05-24',
    type: 'ml', pick: 'NYK ML vs CLE', odds: '-130',
    facts: [
      {label:'Series',value:'NYK leads 3-0, closeout chance'},
      {label:'Down-0-3',value:'0-156 historical comebacks'},
      {label:'NYK road in series',value:'1-0, +13 margin'},
      {label:'Market',value:'NYK -1.5 / 217.5'},
    ],
    reasoning: "Phase 71c engine: NYK 112, CLE 105 (NYK by 7) — model now prices NYK as outright favorite even on the road. NYK has won G3 in CLE by 13 (Brunson+Bridges combined 22-of-34) and is on a 10-game playoff win streak. CLE has the elimination volume narrative but the 0-156 historical comeback base rate is the dominant prior. Risk: Phase 73 elimination variance amplifier (1.4×) widens CLE's tail; the central estimate still favors NYK but a Mitchell 40+ tail-event is exactly what the historical 0-156 streak has lacked.",
    confidence: 'medium', thesis: ['model','historical','situational'], narrative: 'closeout',
    result: { outcome:'win', actual:'NYK 130-93 — NYK won outright by 37, SWEEP 4-0. ECF closeout most lopsided in franchise playoff history.' },
  },
  {
    id: 'cf-g4-nyk-cle-spread',
    slate: 'CF-G4', series: 'NYK-CLE', game: 4, postedAt: '2026-05-24',
    type: 'spread', pick: 'NYK -1.5', odds: '-115',
    facts: [
      {label:'Market',value:'NYK -1.5 (-110 to -120)'},
      {label:'Engine margin',value:'NYK by 7'},
      {label:'Phase 71 audit',value:'Spread CAUTION (MAE 13pt)'},
    ],
    reasoning: "Engine margin NYK by 7 covers -1.5 by 5.5pts. CAUTION pill auto-applies — treat as lean. The closeout dynamic + NYK's road efficiency in G3 (55.8% FG) point toward a comfortable margin if NYK clinches; the risk is a CLE-Mitchell-volume scenario that turns into a one-possession game.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'NYK won by 37 — covered -1.5 by 35.5. The closeout-blowout scenario the engine flagged hit cleanly.' },
  },
  {
    id: 'cf-g4-nyk-cle-total',
    slate: 'CF-G4', series: 'NYK-CLE', game: 4, postedAt: '2026-05-24',
    type: 'total', pick: 'Under 217.5', odds: '-110',
    facts: [
      {label:'G1 reg',value:'~200 (OT to 219)'},
      {label:'G2 total',value:'202'},
      {label:'G3 total',value:'229 (NYK 121, CLE 108)'},
      {label:'ECF tempo',value:'tight — Rocket Arena slows in elimination'},
    ],
    reasoning: "G1 reg total 200 / G2 202 / G3 229 — G3 was the outlier driven by NYK's 24-27 FT line and 11 made 3s. Engine projects 217 total (NYK 112 + CLE 105). Elimination contexts historically run UNDER the line ~58% of the time (Phase 73 audit: G6/G7 totals -3.2pts vs reg avg). Phase 71 total SKIP at medium confidence — lean only.",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Total 223 (NYK 130 + CLE 93) — OVER 217.5 by 5.5. NYK closeout blowout pushed total past the line via volume scoring + bench Q4 minutes; the elimination-runs-under historical prior failed in this 0-3 sweep variant.' },
  },
  {
    id: 'cf-g4-nyk-cle-brunson-pts',
    slate: 'CF-G4', series: 'NYK-CLE', game: 4, postedAt: '2026-05-24',
    type: 'prop', pick: 'Brunson Over 24.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'38, 19, 30 → 29.0 avg'},
      {label:'Phase 71 STARTER',value:'-2.0 PTS correction → 27 raw'},
      {label:'Closeout',value:'historically +1-2pts in series-clinch attempts'},
    ],
    reasoning: "Brunson series avg 29.0 with the wide variance (38/19/30). G3 he was 10-of-19 FG / 10-of-12 FT for 30. Engine projection ~27pts after STARTER correction; line 24.5 sits below that comfortably. Closeout-game volume add (+1-2pts) plus CLE elimination defensive scheme breakdown nudges over.",
    confidence: 'medium', thesis: ['model','historical'], narrative: null,
    result: { outcome:'loss', actual:'Brunson 15pts in 28min — UNDER 24.5 by 9.5. Did not play a second in Q4 (37pt blowout). The Phase 73o closeout-cap correctly suppressed the engine projection; the line at 24.5 still hit the under because Brunson sat out the entire 4th. Audit lesson: closeout-blowout cap needs to extend to PTS over-bet authoring decisions, not just the engine projection.' },
  },
  {
    id: 'cf-g4-nyk-cle-mitchell-pts',
    slate: 'CF-G4', series: 'NYK-CLE', game: 4, postedAt: '2026-05-24',
    type: 'prop', pick: 'Mitchell Over 27.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'29, 26, 23 → 26.0 avg'},
      {label:'Elimination history',value:'Mitchell G6 vs DET R2 was 41/8'},
      {label:'NYK switch coverage',value:'capped efficiency G3 (9-21 FG)'},
    ],
    reasoning: "Mitchell elimination-game history is the bullish input: G6 vs DET R2 he posted 41/8 with the same down-but-not-out dynamic. STARTER correction (-2.0) plus elimination volume bump (+4 historical avg) puts engine ~29-30pts. Line 27.5 sits within range. Risk: NYK's switching scheme (Bridges/OG/Hart rotating) capped his efficiency to 23pts on 21 shots G3 — volume up doesn't guarantee scoring up.",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: 'elimination',
    result: { outcome:'win', actual:'Mitchell 31pts on 11-25 FG / 3-11 3PT — OVER 27.5 by 3.5. Elimination-volume materialized as predicted (closed his sweep series with a 30+ on volume); efficiency stayed low but the line cleared.' },
  },
  {
    id: 'cf-g4-nyk-cle-bridges-pts',
    slate: 'CF-G4', series: 'NYK-CLE', game: 4, postedAt: '2026-05-24',
    type: 'prop', pick: 'Bridges Over 14.5 points', odds: '-130',
    facts: [
      {label:'Series PTS',value:'14, 13, 22 → 16.3 avg'},
      {label:'G3 efficiency',value:'11-15 FG masterclass'},
      {label:'Closeout role',value:'wing scoring + perimeter D both stay on'},
    ],
    reasoning: "Bridges G3 was an efficiency outlier (11-15 FG / 22 pts) but the series trend is steady wing scoring at ~15pts. Engine projection 16.5 after STARTER calibration. Line 14.5 is just below — the deep-alt floor zone for a closeout-game wing. Counting stat = blowout-stable.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'win', actual:'Bridges 15pts on 6-12 FG / 3-7 3PT — OVER 14.5 by 0.5 (skin-of-teeth). Counting-stat-blowout-stable read held but barely; the closeout-cap also reduced his minutes vs a non-blowout closeout.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // WCF G5 — TUE MAY 26: SAS @ OKC at Paycom Center (series tied 2-2)
  // Pivotal G5 after SAS evened it with a 21-pt G4 blowout.
  // DK: OKC -5.5 / total 215.5 / ML OKC -218, SAS +180.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g5-okc-sas-ml',
    slate: 'CF-G5', series: 'OKC-SAS', game: 5, postedAt: '2026-05-26',
    type: 'ml', pick: 'SAS ML vs OKC', odds: '+180',
    facts: [
      {label:'Series',value:'tied 2-2, SAS won G4 by 21'},
      {label:'OKC home',value:'+6.1 net rating these playoffs at Paycom'},
      {label:'Regular season',value:'SAS 4-1 vs OKC pattern'},
      {label:'Market',value:'OKC -5.5 / 215.5'},
    ],
    reasoning: "Phase 71c engine: OKC 114, SAS 110 (OKC by 4). DK has OKC -5.5, ML OKC -218 / SAS +180. Engine winner agrees with market but margin disagrees (4 vs 5.5). SAS +180 ≈ 35.7% implied; engine puts SAS at ~46% true → +EV ~+0.46×(1+1.80)−1 = +29% expected return per unit on the model price. Risk concentrators: OKC has home + bench-depth structural edges; SAS G4 +21 may have flattened them to true coin-flip for one home game but the regression-to-mean is real (OKC 6-33 from 3PT is the worst game they\'ll have all CF). Confidence: lean rather than best-bet — model and market both rate it close.",
    confidence: 'lean', thesis: ['model','market'], narrative: 'value-dog',
    result: { outcome:'loss', actual:'OKC 127-114 — SAS ML lost; OKC took the 3-2 series lead at home' },
  },
  {
    id: 'cf-g5-okc-sas-spread',
    slate: 'CF-G5', series: 'OKC-SAS', game: 5, postedAt: '2026-05-26',
    type: 'spread', pick: 'SAS +5.5', odds: '-110',
    facts: [
      {label:'Market',value:'OKC -5.5 (-110 to -115)'},
      {label:'Engine margin',value:'OKC by 4'},
      {label:'Phase 71 audit',value:'Spread CAUTION (MAE 13pt)'},
    ],
    reasoning: "Engine margin OKC by 4 — SAS +5.5 hits if OKC wins by 5 or less or SAS wins. The 1.5pt gap between model and market is exactly the spread-edge zone where Phase 71 audit shows real signal (MAE 13pt average but spread-vs-engine-disagreement at ≤2pt has historically gone with the engine ~58% of the time). Phase 71 spread CAUTION auto-applies — half-stake lean. The blowout-streak narrative against this spread (G3 OKC by 15, G4 SAS by 21) suggests +5.5 absorbs variance more cleanly than the ML ticket.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'SAS lost by 13 (127-114) — did not cover +5.5' },
  },
  {
    id: 'cf-g5-okc-sas-total',
    slate: 'CF-G5', series: 'OKC-SAS', game: 5, postedAt: '2026-05-26',
    type: 'total', pick: 'Over 215.5', odds: '-110',
    facts: [
      {label:'G1',value:'237 (2OT)'},
      {label:'G2',value:'235'},
      {label:'G3',value:'231'},
      {label:'G4',value:'185 (defensive anomaly)'},
    ],
    reasoning: "G4 was a defensive anomaly — SAS held OKC to its 2nd-lowest postseason total ever, 6-33 from 3PT. The other three CF games went 237/235/231 — all over 215.5 by 15+ pts. Engine projects 224 total (OKC 114 + SAS 110); mean reversion from G4 toward the series norm is structurally expected at OKC home. Phase 71 total SKIP at medium confidence — treat as lean. The total is the cleanest reversion-trade on the slate.",
    confidence: 'lean', thesis: ['historical','model'], narrative: null,
    result: { outcome:'win', actual:'241 total (127+114) — Over 215.5 cashed by 25.5; G4 defensive anomaly reverted hard' },
  },
  {
    id: 'cf-g5-okc-sas-wemby-pts',
    slate: 'CF-G5', series: 'OKC-SAS', game: 5, postedAt: '2026-05-26',
    type: 'prop', pick: 'Wembanyama Over 25.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'41, 21, 26, 33 → 30.3 avg'},
      {label:'Road in series',value:'21, 26 (both at Paycom)'},
      {label:'Engine (Phase 71c)',value:'~26 PTS — at the line'},
    ],
    reasoning: "Wemby series 30.3 avg with the wide variance (41/21/26/33). Road games at Paycom specifically: 21 G2 (minutes restriction after G1 49+min) and 26 G3. Engine projects 26 with ELITE tier correction (-2.6); G5 line at 25.5 sits at the engine output. Risk: OKC has been the only team to consistently slow him (G3 box-out plan held him to 4 reb / 26 pts despite his 39 G3 vs Min average). Use 21.5 alt at -260 for deeper floor coverage if going parlay-leg.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Wembanyama 20 pts (4-15 FG) — series-low; OKC box-out + length suppressed the scoring, Over 25.5 missed' },
  },
  {
    id: 'cf-g5-okc-sas-wemby-reb',
    slate: 'CF-G5', series: 'OKC-SAS', game: 5, postedAt: '2026-05-26',
    type: 'prop', pick: 'Wembanyama Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'Series REB',value:'24, 17, 4, 8 → 13.3 avg (with G3 box-out outlier)'},
      {label:'Engine (Phase 71)',value:'12.8 REB calibrated'},
      {label:'OKC plan',value:'box-out worked G3 (4 reb), failed G4 (8 reb)'},
    ],
    reasoning: "Phase 71 REB signal is the most calibrated dimension (±0.2pt across tiers). Wemby series 13.3 avg even with the G3 4-reb anomaly. OKC's box-out plan worked once (G3) but failed in G4 (8 reb in 36min). Engine projects 12.8 REB. Line 9.5 sits 3.3 below projection — solid floor signal. Deeper 7.5 alt available at ~-300 for parlay leg.",
    confidence: 'medium', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'Wembanyama 6 reb — OKC box-out (Hartenstein 15 reb) held him to a series-low; Over 9.5 missed' },
  },
  {
    id: 'cf-g5-okc-sas-sga-pts',
    slate: 'CF-G5', series: 'OKC-SAS', game: 5, postedAt: '2026-05-26',
    type: 'prop', pick: 'SGA Over 27.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'24, 30, 26, 19 → 24.8 avg'},
      {label:'Home (G1+G2)',value:'24, 30 (avg 27)'},
      {label:'Phase 71c bias',value:'-6.9 PTS per-player override'},
    ],
    reasoning: "SGA series avg 24.8; Phase 71c per-player override (-6.9 from raw) puts engine projection at ~24 pts. Home games specifically: 24 G1 (2OT), 30 G2 — avg 27 at Paycom. Line 27.5 sits AT the home avg, ABOVE engine projection. Phase 71 PTS skip suggests under-lean for the prop call; the over feels overpriced because of the G4 19pt anomaly + Castle POA matchup that suppressed efficiency. Override-driven SKIP — preferring SAS Wemby props.",
    confidence: 'coin-flip', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'SGA 32 pts (7-19 FG, 16-17 FT) — Over 27.5 cashed; bounce-back from the G4 19pt anomaly' },
  },
  {
    id: 'cf-g5-okc-sas-caruso-pts',
    slate: 'CF-G5', series: 'OKC-SAS', game: 5, postedAt: '2026-05-26',
    type: 'prop', pick: 'Caruso Over 11.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'31, 17, 29, 8 → 21.3 avg'},
      {label:'High variance',value:'7-of-11 3PT G3 → 1-of-5 3PT G4'},
      {label:'Home pattern',value:'31 G1, 29 G3 (both at Paycom)'},
    ],
    reasoning: "Caruso has been OKC's bench scoring lifeline in home games (31/29 at Paycom) but cooled to 1-of-5 3PT in G4 on the road. Home + reset chance after the G4 cooldown is exactly the setup where his 3PT-volume game returns. Engine projects ~14pts on a 22min bench role; line 11.5 sits below projection. Heavy 3PT variance is the risk — but the deep alt 8.5 line at ~-180 covers if a cold night arrives.",
    confidence: 'lean', thesis: ['historical','matchup'], narrative: null,
    result: { outcome:'win', actual:'Caruso 22 pts (5 threes) off the bench — home-game heater returned; Over 11.5 cashed' },
  },
  {
    id: 'cf-g5-okc-sas-fox-ast',
    slate: 'CF-G5', series: 'OKC-SAS', game: 5, postedAt: '2026-05-26',
    type: 'prop', pick: 'Fox Over 5.5 assists', odds: '-130',
    facts: [
      {label:'Series AST',value:'6, 7, 6, 5 → 6.0 avg'},
      {label:'Phase 71',value:'AST calibrated for primary ball-handlers in facilitator mode'},
      {label:'Engine',value:'6.2 AST'},
    ],
    reasoning: "Fox series avg 6.0 ast with steady volume (6/7/6/5). Phase 71 AST signal is well-calibrated for primary ball-handlers. Engine projects 6.2 ast. Line 5.5 sits right at the projection — modest floor signal. Use as a stable leg in a multi-leg floor parlay rather than standalone — the value sits in the proj−1 deep alt zone (4.5 at -240 ≈ 75% true) for parlay legs.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'Fox 8 ast — played through the leg in facilitator mode; Over 5.5 cashed' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF-G6 — WCF Game 6, Thu 5/28 @ Frost Bank Center. OKC leads 3-2.
  // SAS faces elimination. Engine: SAS by 3 (MEDIUM, MUST-WIN HOME).
  // DK: SAS -3.5 / total 219.5 / ML SAS -155, OKC +130.
  // Phase 73 elimination amplifier ACTIVE — PLACE pills auto→CAUTION.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g6-okc-sas-ml',
    slate: 'CF-G6', series: 'OKC-SAS', game: 6, postedAt: '2026-05-28',
    type: 'ml', pick: 'SAS ML vs OKC', odds: '-155',
    facts: [
      {label:'Series',value:'OKC leads 3-2 — SAS elimination'},
      {label:'SAS home',value:'4-1 vs OKC reg season; won G4 here by 21'},
      {label:'Engine',value:'SAS by 3 (MEDIUM)'},
      {label:'Market',value:'SAS -3.5 / 219.5'},
    ],
    reasoning: "Phase 71c engine: SAS 115, OKC 112 (SAS by 3). DK has SAS -3.5, ML SAS -155 / OKC +130. Engine winner and margin both agree with the market. The case for SAS: home + must-win desperation (down-3-2 with HCA extends ~55-60%), Castle/Harper healthy, the 4-1 regular-season pattern, and a Wemby bounce-back after the G5 box-out held him to 20/6. The case against: OKC is the better team, can close, and SGA/Caruso/McCain just dropped 127 — a road closeout is well within range. Phase 73 elimination amplifier ACTIVE → this is honestly a coin-flip the model nudges toward the desperate home side; the pill auto-downgrades to CAUTION. Lean SAS at a reduced CF stake.",
    confidence: 'lean', thesis: ['model','market'], narrative: 'home-desperation',
    result: { outcome:'win', actual:'SAS 118-91 — SAS ML cashed. Wemby answered the G5 box-out (28/10/2blk), SGA held to a series-low 15, and SAS forced Game 7. The desperate-home-team lean landed.' },
  },
  {
    id: 'cf-g6-okc-sas-spread',
    slate: 'CF-G6', series: 'OKC-SAS', game: 6, postedAt: '2026-05-28',
    type: 'spread', pick: 'OKC +3.5', odds: '-110',
    facts: [
      {label:'Market',value:'SAS -3.5 (-110)'},
      {label:'Engine margin',value:'SAS by 3'},
      {label:'Phase 71 audit',value:'Spread CAUTION (MAE 13pt)'},
    ],
    reasoning: "Engine margin SAS by 3 sits just inside the SAS -3.5 line, so OKC +3.5 carries marginal value (the model says SAS wins by 3, half a point short of the cover). OKC +3.5 hits if SAS wins by ≤3 or OKC wins outright — and OKC has the talent to win this game straight up. In an elimination spot the trailing-but-better road team taking points is the cleaner ticket than backing the host's exact margin. Phase 71 spread CAUTION auto-applies + Phase 73 elimination amplifier widens the band; half-stake lean.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'SAS won by 27 (118-91) — OKC +3.5 lost easily. The spread-CAUTION pill flagged it; the SAS-even-game blowout (G4 +21, now G6 +27) is the recurring tail the margin model under-prices.' },
  },
  {
    id: 'cf-g6-okc-sas-total',
    slate: 'CF-G6', series: 'OKC-SAS', game: 6, postedAt: '2026-05-28',
    type: 'total', pick: 'Over 219.5', odds: '-110',
    facts: [
      {label:'Series totals',value:'237 / 235 / 231 / 185 / 241'},
      {label:'G4 outlier',value:'185 (SAS defensive masterpiece)'},
      {label:'Engine',value:'~227 total'},
    ],
    reasoning: "Four of the five WCF games cleared 219.5 comfortably (237/235/231/241); only the G4 SAS defensive masterpiece (185) went under. Engine projects ~227 (SAS 115 + OKC 112). The risk is elimination-game defensive intensity compressing pace — but both offenses are humming (G5 went 241) and a desperate SAS plays uptempo to maximize possessions. Phase 71 total SKIP at medium confidence keeps this a lean; the series scoring profile is the anchor.",
    confidence: 'lean', thesis: ['historical','model'], narrative: null,
    result: { outcome:'loss', actual:'Total 209 (118+91) — Under 219.5 by 10.5. Elimination-game defensive intensity DID compress the total (SGA 15, OKC 91), exactly the risk the reasoning flagged; the over missed.' },
  },
  {
    id: 'cf-g6-okc-sas-wemby-pts',
    slate: 'CF-G6', series: 'OKC-SAS', game: 6, postedAt: '2026-05-28',
    type: 'prop', pick: 'Wembanyama Over 25.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'41, 21, 26, 33, 20 → 28.2 avg'},
      {label:'G5',value:'series-low 20 (4-15 FG) vs OKC box-out'},
      {label:'Engine (Phase 71c)',value:'~27 — bounce-back spot'},
    ],
    reasoning: "Wemby was held to a series-low 20 on 4-15 FG in G5 as OKC threw the Hartenstein/Holmgren box-out and length at him. The bounce-back narrative at home in an elimination game is strong (his even-game pattern this CF: 21→33; 26→20 reversed), and SAS will scheme deep touches. Engine ~27 with ELITE tier correction. Line 25.5 sits just below projection. Deep alt 21.5 (~-260) for floor coverage given the OKC suppression risk is real.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'win', actual:'Wembanyama 28 pts — Over 25.5 cashed. The bounce-back read landed: SAS fed him deep touches before the double and he answered the G5 box-out (20) with 28/10.' },
  },
  {
    id: 'cf-g6-okc-sas-wemby-reb',
    slate: 'CF-G6', series: 'OKC-SAS', game: 6, postedAt: '2026-05-28',
    type: 'prop', pick: 'Wembanyama Over 9.5 rebounds', odds: '-130',
    facts: [
      {label:'Series REB',value:'24, 17, 4, 8, 6 → 11.8 avg (OKC box-out the swing)'},
      {label:'OKC box-out',value:'held him to 4 (G3) and 6 (G5)'},
      {label:'Engine (Phase 71, OKC-degraded)',value:'~9 vs this scheme'},
    ],
    reasoning: "⚠ The G5 lesson stands: OKC's Hartenstein/Holmgren tag-team box-out is a repeatable Wemby-REB suppressor — he posted 24/17 in G1/G2 but 4/6 in the two OKC-gameplanned games (G3/G5). Against OKC specifically, degrade the calibrated REB projection ~30% to ~9, which puts the 9.5 line at a TRUE coin-flip, NOT the floor it would be vs any other opponent. The deep-alt-REB floor (Phase 71's most-trusted signal) has already LOST twice this CF on exactly this matchup. Do NOT use as a floor leg vs OKC. Standalone lean at best; prefer the deeper 6.5 alt if anything.",
    confidence: 'coin-flip', thesis: ['matchup'], narrative: null,
    result: { outcome:'win', actual:'Wembanyama 10 reb — Over 9.5 cashed (barely). The coin-flip call was right to not treat this as a floor: it cleared by half a board. With deep touches and a healthy supporting cast, the OKC box-out did NOT suppress him this time (G3/G5 it held him to 4/6).' },
  },
  {
    id: 'cf-g6-okc-sas-sga-pts',
    slate: 'CF-G6', series: 'OKC-SAS', game: 6, postedAt: '2026-05-28',
    type: 'prop', pick: 'SGA Over 27.5 points', odds: '-120',
    facts: [
      {label:'Series PTS',value:'24, 30, 26, 19, 32 → 26.2 avg'},
      {label:'Road (G3+G4)',value:'26, 19 (Castle POA suppressed G4)'},
      {label:'Phase 71c bias',value:'-6.9 PTS per-player override'},
    ],
    reasoning: "SGA dropped 32 (16-17 FT) in the G5 home bounce-back. On the road for a closeout, the Castle POA matchup is the variable — it suppressed him to 19 in G4 (fresh Castle) but he got 26 in G3. The Phase 71c override (-6.9) is the reason the engine lands ~24-25, but the G5 lesson flagged that the override over-corrects in favorable spots and shouldn't drive a SKIP on a star. Closeout-game usage tends to rise. Line 27.5 sits at the road-game ceiling; lean over with the override caveat noted. Deep alt 21.5 for floor.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'loss', actual:'SGA 15 pts (5-15 FG) — series-LOW; Over 27.5 missed badly. Castle POA + Frost Bank crowd suppressed him just like G4 (19). Even the deep alt 21.5 would have lost. The road-vs-fresh-Castle suppression is now a 2-game pattern (G4 19, G6 15).' },
  },
  {
    id: 'cf-g6-okc-sas-castle-ast',
    slate: 'CF-G6', series: 'OKC-SAS', game: 6, postedAt: '2026-05-28',
    type: 'prop', pick: 'Castle Over 4.5 assists', odds: '-160',
    facts: [
      {label:'Series AST',value:'8, 8, 6, 5, 6 → 6.6 avg'},
      {label:'Role',value:'primary creator + POA defender'},
      {label:'Engine',value:'6.0 AST'},
    ],
    reasoning: "Castle has been SAS's steadiest secondary creator (8/8/6/5/6 ast across the CF) alongside his POA defense workload. Engine projects 6.0 ast. Line 4.5 sits proj−1.5 in the calibrated deep-alt zone — a clean facilitator floor leg that's independent of the Wemby-scoring variance. Phase 71 AST is well-calibrated for primary ball-handlers; this is the cleanest SAS counting-stat floor on the board.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'Castle 9 ast — Over 4.5 cashed comfortably (17/5/9). The facilitator AST floor held exactly as the calibrated-AST signal predicted, independent of the game script.' },
  },
  {
    id: 'cf-g6-okc-sas-fox-ast',
    slate: 'CF-G6', series: 'OKC-SAS', game: 6, postedAt: '2026-05-28',
    type: 'prop', pick: 'Fox Over 5.5 assists', odds: '-135',
    facts: [
      {label:'Series AST',value:'6, 7, 6, 5, 8 → 6.4 avg'},
      {label:'G5',value:'8 ast through the leg (facilitator mode)'},
      {label:'Engine',value:'6.3 AST'},
    ],
    reasoning: "Fox went to facilitator mode in G5 (9pts/8ast) playing through the leg, and that's the likely template again — let Wemby/Castle score while he runs the offense. Series ast 6/7/6/5/8 = steady 6.4. Engine 6.3. Line 5.5 sits right at projection; the deep alt 4.5 (~-240) is the floor-parlay value. Primary-ball-handler AST is the most reliable counting-stat dimension.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'Fox 7 ast — Over 5.5 cashed. Facilitator mode again (5pts/7ast); the AST floor held as projected, the steadiest SAS counting-stat signal of the series.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF-G7 — WCF Game 7, Sat 5/30 @ Paycom Center. Series tied 3-3.
  // Winner-take-all; winner faces the Knicks in the NBA Finals.
  // Engine: OKC by 5 (MEDIUM, COIN FLIP). DK: OKC -4.5 / total 213.5 /
  // ML OKC -162, SAS +136. Phase 73 elimination amplifier ACTIVE —
  // PLACE pills auto→CAUTION; treat as a true coin-flip (50% acc / 19.8 MAE).
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g7-okc-sas-ml',
    slate: 'CF-G7', series: 'OKC-SAS', game: 7, postedAt: '2026-05-29',
    type: 'ml', pick: 'OKC ML vs SAS', odds: '-162',
    facts: [
      {label:'Series',value:'tied 3-3 — winner to the Finals'},
      {label:'OKC home',value:'won G2 & G5 at Paycom (+6.1 net rating)'},
      {label:'Engine',value:'OKC by 5 (MEDIUM)'},
      {label:'Market',value:'OKC -4.5 / 213.5'},
    ],
    reasoning: "Phase 71c engine: OKC 110, SAS 105 (OKC by 5) at Paycom. DK has OKC -4.5, ML OKC -162 / SAS +136 — winner and margin both agree with the market. The case for OKC: home court (won G2 & G5 here), the bench depth (Caruso/McCain/Wallace) that only erupts at Paycom, and an SGA home bounce-back from his series-low 15 (his Paycom reversions this CF: 30/30/32). The case against: SAS owns the matchup (4-1 reg season + every even-numbered-game win) and Wemby is rolling (28/10 in G6). This is a TRUE coin-flip — Phase 73 elimination amplifier ACTIVE, pill auto-downgrades to CAUTION, and G7s historically run ~50% winner accuracy. Lean OKC at a reduced CF stake; SAS +136 carries thin standalone +EV per model for those wanting the dog.",
    confidence: 'lean', thesis: ['model','market'], narrative: 'home-coinflip',
    result: { outcome:'loss', actual:'SAS 111-103 — SAS won outright. Engine OKC by 5 was directionally wrong (the same 3-4 WCF winner accuracy the audit predicted).' },
  },
  {
    id: 'cf-g7-okc-sas-spread',
    slate: 'CF-G7', series: 'OKC-SAS', game: 7, postedAt: '2026-05-29',
    type: 'spread', pick: 'SAS +4.5', odds: '-110',
    facts: [
      {label:'Market',value:'OKC -4.5 (-110)'},
      {label:'Engine margin',value:'OKC by 5'},
      {label:'Phase 71 audit',value:'Spread CAUTION (MAE 13pt); G7 19.8pt MAE'},
    ],
    reasoning: "Engine margin OKC by 5 sits a hair past the -4.5 line, so OKC -4.5 is the nominal engine-value side. But in a true coin-flip G7 (elimination MAE 19.8pt — the widest band in the audit), the live-underdog points are the variance-absorbing play: SAS +4.5 hits if SAS wins outright OR loses by ≤4, and SAS has the talent to win this game straight up (it just won G6 by 27). Backing the host's exact margin in a G7 is the lower-EV ticket. Phase 71 spread CAUTION + Phase 73 amplifier widen the band → half-stake lean on SAS +4.5.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'SAS won outright 111-103 — covered +4.5 by 12. The variance-absorbing dog ticket cashed in the coin-flip G7 as the model logic anticipated.' },
  },
  {
    id: 'cf-g7-okc-sas-total',
    slate: 'CF-G7', series: 'OKC-SAS', game: 7, postedAt: '2026-05-29',
    type: 'total', pick: 'Under 213.5', odds: '-110',
    facts: [
      {label:'Series totals',value:'237 / 235 / 231 / 185 / 241 / 209'},
      {label:'G7 pattern',value:'defensive intensity → unders'},
      {label:'Engine',value:'~215 (marginally over)'},
    ],
    reasoning: "The engine projects ~215 (OKC 110 + SAS 105), a hair OVER the 213.5 line — but two structural reads push Under: (1) G7s run defensive and the line itself dropped from a 216.5 opener to 213.5, the market pricing a grind; (2) the two SAS-controlled games went 185 (G4) and 209 (G6) — when the defense ramps in this series the total craters, and a stakes-max G7 is the spot for it. The risk is an SGA/Caruso home shootout (G5 went 241 at Paycom). Engine disagreement noted — this is the rare lean AGAINST the engine total, anchored on the G7-defense pattern. Phase 71 total SKIP/CAUTION applies; coin-flip lean Under.",
    confidence: 'coin-flip', thesis: ['historical'], narrative: null,
    result: { outcome:'loss', actual:'Total 214 — missed the Under by 0.5pt (a backdoor cover for the Over). The G7 defense thesis was DIRECTIONALLY right (well below the 220.5 trend) but landed 0.5 over the line. Coin-flip read confirmed but lost the razor edge.' },
  },
  {
    id: 'cf-g7-okc-sas-sga-pts',
    slate: 'CF-G7', series: 'OKC-SAS', game: 7, postedAt: '2026-05-29',
    type: 'prop', pick: 'SGA Over 27.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'24, 30, 26, 19, 32, 15 → 24.3 avg'},
      {label:'Home (G1/G2/G5)',value:'24, 30, 32 → 28.7 avg'},
      {label:'Phase 71c bias',value:'-6.9 PTS per-player override'},
    ],
    reasoning: "SGA was held to a series-LOW 15 in G6 on the road (Castle POA + Frost Bank crowd) — but the G7 is at Paycom, where his three home games went 24/30/32 (avg 28.7) and his post-anomaly reversions this CF have been clinical. The G5 lesson stands: the Phase 71c override (-6.9) over-corrects in home bounce-back spots and shouldn't drive a SKIP on a star in a favorable home/regression G7. Closeout-game usage rises. Line 27.5 sits just below his home average; lean Over. Deep alt 21.5 (~-280) for floor coverage given the Castle-matchup variance.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: null,
    result: { outcome:'win', actual:'SGA 35pts (12-26 FG, 9-10 FT) — cleared 27.5 by 7.5. The home bounce-back arc landed clean; the override-skip would have been wrong as predicted. But the 5 TOs and 12-26 FG show pressure-induced inefficiency the prop side ignores.' },
  },
  {
    id: 'cf-g7-okc-sas-wemby-pts',
    slate: 'CF-G7', series: 'OKC-SAS', game: 7, postedAt: '2026-05-29',
    type: 'prop', pick: 'Wembanyama Over 24.5 points', odds: '-115',
    facts: [
      {label:'Series PTS',value:'41, 21, 26, 33, 20, 28 → 28.2 avg'},
      {label:'At Paycom (reg.)',value:'21 (G2), 20 (G5) — OKC box-out the swing'},
      {label:'Engine (Phase 71c, OKC-degraded)',value:'~24'},
    ],
    reasoning: "⚠ The matchup caveat: OKC's Hartenstein/Holmgren box-out held Wemby to 20 at Paycom in G5 (and 4/6 reb in the two gameplanned games). His Paycom scoring in regulation (G2 21, G5 20) is well below his 28.2 series avg — the road environment + the box-out is a real suppressor. He answered it in G6 with deep early touches (28), but that was at home. Engine degrades to ~24 vs this scheme on the road. Line 24.5 is a TRUE coin-flip, NOT a floor — prefer the deep alt 19.5 (~-260) for any parlay leg. Standalone lean over given his G6 momentum, with the OKC-suppression risk flagged.",
    confidence: 'coin-flip', thesis: ['matchup'], narrative: null,
    result: { outcome:'loss', actual:'Wemby 22pts (8-19 FG, 4-9 3PT) — missed 24.5 by 2.5. The OKC-Paycom suppression returned (third straight regulation Paycom game under 25); the matchup caveat was right, the coin-flip lean was wrong. Deep alt 19.5 would have cleared.' },
  },
  {
    id: 'cf-g7-okc-sas-castle-ast',
    slate: 'CF-G7', series: 'OKC-SAS', game: 7, postedAt: '2026-05-29',
    type: 'prop', pick: 'Castle Over 4.5 assists', odds: '-160',
    facts: [
      {label:'Series AST',value:'8, 8, 6, 5, 6, 9 → 7.0 avg'},
      {label:'Role',value:'primary creator + POA defender'},
      {label:'Engine',value:'6.2 AST'},
    ],
    reasoning: "Castle has been SAS's steadiest creator all series (8/8/6/5/6/9 ast = 7.0 avg) alongside his POA defense workload, and he just posted 9 ast in G6. Engine projects 6.2. Line 4.5 sits proj−1.7 in the calibrated deep-alt zone — a clean facilitator floor independent of the Wemby-scoring and OKC-box-out variance. Phase 71 AST is well-calibrated for primary ball-handlers; this is the cleanest SAS counting-stat floor on the board for G7.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'Castle 18pts/5reb/6ast — cleared 4.5 ast by 1.5. POA-creator floor held even on a series-clinching night. Castle has the deepest single-stat reliability of any G7 SAS prop.' },
  },
  {
    id: 'cf-g7-okc-sas-champagnie-pra',
    slate: 'CF-G7', series: 'OKC-SAS', game: 7, postedAt: '2026-05-29',
    type: 'prop', pick: 'Champagnie Over 9.5 PRA', odds: '-330',
    facts: [
      {label:'PRA last 2',value:'G5 28 / G6 18 (10/6/2)'},
      {label:'Role',value:'24-28 min bench wing at home or road'},
      {label:'Dimension',value:'PRA 11/11 in user-bet ledger'},
    ],
    reasoning: "PRA is the premier reliable-tier dimension (11/11 in the user-bet ledger; cleared again in G6 across Champagnie/Keldon/Harper even in a blowout). Champagnie has cleared 9.5 PRA comfortably the last two games (28, 18). The composite (pts+reb+ast) smooths single-stat variance and is blowout-resilient — it clears whether SAS wins or loses a G7. Line 9.5 = a deep, blowout-stable floor; the safest role-player leg on the slate. Phase 73x-validated; the anchor of the reliable parlay.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'Champagnie 20pts/4reb/2ast = 26 PRA — smashed the 9.5 line by 16.5. The diversified role-player PRA floor is now 13/13 — the cleanest reliable-tier dimension in the framework. Validates the WCF G7 retrospective: PRA cleared in every CF game.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // FINALS-G1 BETS — Wed 6/3 @ Frost Bank Center. NYK-SAS Finals G1.
  // NYK swept all 3 prior rounds (12-1, 8 days rest); SAS won WCF 4-3
  // (3 days rest after G7 5/30). 1999 Finals rematch. Engine SAS by 2.
  // Phase 71 R3 out-of-sample stake cap stays at 50% (Finals is first-
  // ever Finals calibration data). PRA reliable-tier discipline carries
  // forward. NYK perimeter D > OKC's, so PRA lines may have less air.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'finals-g1-sas-nyk-ml',
    slate: 'Finals-G1', series: 'SAS-NYK', game: 1, postedAt: '2026-06-03',
    type: 'ml', pick: 'SAS ML vs NYK', odds: '-135',
    facts: [
      {label:'Series',value:'0-0 — first Finals game'},
      {label:'Engine',value:'SAS by 2 (MEDIUM)'},
      {label:'Market',value:'SAS -2.5 / 215.5'},
      {label:'Rest gap',value:'NYK 8 days vs SAS 3 days'},
    ],
    reasoning: "Phase 71c engine: SAS 113, NYK 111 (SAS by 2) at Frost Bank Center. DK ML SAS -135 / NYK +115 — engine SAS by 2 agrees on winner; -135 implied 57.4% vs model ~54% (mild market overbid on SAS). Two structural levers tilt slight SAS: (1) HCA + 6-1 record at Frost Bank this playoffs, (2) Castle-on-Brunson is the best POA defender Brunson has faced (0.91 dLEBRON vs CLE Garland's 0.21). NYK counters: 12-1 sweep momentum + 8-day rest + Brunson 9.2 clutch + KAT-Wemby is a fairer rim duel than SAS faced from Holmgren. This is a TRUE coin-flip the model leans a hair toward the home team. NYK +115 carries thin standalone +EV (~46% true vs 46.5% implied — fair). Phase 71 R3 out-of-sample stake cap stays 50% — Finals is first-ever Finals calibration data, CAUTION pill auto-stamps. Lean SAS ML at reduced 50% Finals stake.",
    confidence: 'lean', thesis: ['model','market'], narrative: 'home-coinflip',
    result: { outcome:'loss', actual:'NYK 105-95 — SAS lost at home; wrong-winner G1' },
  },
  {
    id: 'finals-g1-sas-nyk-spread',
    slate: 'Finals-G1', series: 'SAS-NYK', game: 1, postedAt: '2026-06-03',
    type: 'spread', pick: 'NYK +2.5', odds: '-110',
    facts: [
      {label:'Market',value:'SAS -2.5 (-110)'},
      {label:'Engine margin',value:'SAS by 2'},
      {label:'Rust factor',value:'NYK 8-day layoff (Mavericks-style risk)'},
    ],
    reasoning: "Engine SAS by 2 sits a HAIR INSIDE the -2.5 line, so NYK +2.5 carries the model push/cover edge (+0.5pt). The G1 layoff dynamic: NYK on 8 days rest after a sweep, SAS on 3 days after a G7 grind — the rust-vs-fatigue cancellation usually leans the rested team's way once they shake off Q1 sluggishness. NYK +2.5 hits if NYK wins outright OR loses by ≤2 (covers OT, covers any tight finish). Phase 71 spread CAUTION + Finals out-of-sample widen the band → lean NYK +2.5 at half-stake. The cleanest spread value on the slate.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'NYK won by 10 (line +2.5) — covered outright' },
  },
  {
    id: 'finals-g1-sas-nyk-total',
    slate: 'Finals-G1', series: 'SAS-NYK', game: 1, postedAt: '2026-06-03',
    type: 'total', pick: 'Under 215.5', odds: '-110',
    facts: [
      {label:'NYK rest',value:'8-day layoff — Q1 rust pattern'},
      {label:'Finals G1 history',value:'G1s run 3-5% UNDER season totals'},
      {label:'Engine',value:'~224 (well over)'},
    ],
    reasoning: "Engine projects ~224 (a +8.5pt OVER lean) — but Finals G1 historically runs UNDER market totals by 3-5% via two reliable patterns: (1) rust on the rested side suppresses Q1-Q2 efficiency (NYK 8 days off → Mavericks-Boston 2024 G1 went 14 UNDER); (2) first-look unfamiliarity tightens both defenses early. The Castle-Brunson matchup specifically should compress NYK ORtg in the first half. SAS's two G7-deciding games (G4 185, G6 209) also show this defense ramping when the stakes peak. This is a lean AGAINST the engine total, anchored on the G1-defense pattern. The model OVER lean is the genuine counter-case — if both teams shake out rust quickly the OVER cashes easily.",
    confidence: 'coin-flip', thesis: ['historical'], narrative: null,
    result: { outcome:'win', actual:'200 total (line under 215.5) — Finals-G1-UNDER pattern held' },
  },
  {
    id: 'finals-g1-sas-nyk-wemby-pra',
    slate: 'Finals-G1', series: 'SAS-NYK', game: 1, postedAt: '2026-06-03',
    type: 'prop', pick: 'Wembanyama Over 32.5 PRA', odds: '-115',
    facts: [
      {label:'Series PRA',value:'WCF avg 35.4 PRA (28pts/11reb/3ast)'},
      {label:'KAT/Robinson vs Holmgren',value:'KAT 1.2bpg / Robinson 1.0 vs Holmgren 2.2 — softer rim contest'},
      {label:'Engine',value:'~36 PRA'},
    ],
    reasoning: "Wemby's WCF series PRA averaged ~35 (avg 28pts/11reb/3ast across 7 games) against Holmgren/Hartenstein — the two best paint defenders in the West. NYK's defensive bigs are MEANINGFULLY softer: KAT (1.2 bpg, 79 rating) is a stretch-5 prone to perimeter pulls, and Mitchell Robinson (1.0 bpg, rim-protection-only) provides limited deterrence. No 'Wemby gravity' suppression scheme is in NYK's repertoire. Engine ~36 PRA. Line 32.5 sits proj-3.5 in the deep-alt zone; the safest Wemby leg of the playoffs given the rim-duel upgrade. Slight Finals-G1 layoff rust caveat → cautious over (deep alt 27.5 ~-260 available for parlays).",
    confidence: 'lean', thesis: ['model','matchup'], narrative: 'pra-floor',
    result: { outcome:'win', actual:'Wembanyama 40 PRA (26pts/12reb/2ast) — cleared 32.5' },
  },
  {
    id: 'finals-g1-sas-nyk-brunson-pts',
    slate: 'Finals-G1', series: 'SAS-NYK', game: 1, postedAt: '2026-06-03',
    type: 'prop', pick: 'Brunson Under 26.5 points', odds: '-115',
    facts: [
      {label:'Series PPG',value:'25.5 ECF avg, but on sweep-mode usage'},
      {label:'Castle dLEBRON',value:'0.908 (best POA defender Brunson has faced)'},
      {label:'WCF SGA pattern',value:'Castle held SGA to 19/15 in BOTH road games'},
    ],
    reasoning: "Brunson averaged 25.5 PPG across the ECF sweep, but those games were against CLE (Garland 0.21 dLEBRON) + PHI (Maxey nominal) — NOT against an elite POA defender. The Finals matchup vs Castle is structurally different: Castle's 0.91 dLEBRON is the BEST on-ball defender Brunson has faced this run, and Castle's WCF pattern is documented (held SGA to 19 in G4 + 15 in G6 — BOTH road games where the matchup imposed). Brunson on the road, vs the same matchup type, after an 8-day layoff (rust caveat) → the structural read is suppression. Engine projects Brunson ~22 pts vs Castle. Line 26.5 sits proj+4.5 — a clean fade. The risk: Brunson's 9.2 clutch + ECF MVP-mode could absorb. Phase 71b star-bias correction was -2.6pt for SGA in similar spot; this is the NYK equivalent.",
    confidence: 'lean', thesis: ['matchup','model'], narrative: 'star-vs-elite-D',
    result: { outcome:'loss', actual:'Brunson 30 pts (12-31 FG) — Castle held the FG% but not the volume' },
  },
  {
    id: 'finals-g1-sas-nyk-champagnie-pra',
    slate: 'Finals-G1', series: 'SAS-NYK', game: 1, postedAt: '2026-06-03',
    type: 'prop', pick: 'Champagnie Over 9.5 PRA', odds: '-300',
    facts: [
      {label:'WCF PRA streak',value:'G5 28 / G6 18 / G7 26 — 24 avg'},
      {label:'Role',value:'24-28 min bench scoring wing'},
      {label:'Dimension',value:'PRA 13/13 in user-bet ledger'},
    ],
    reasoning: "Champagnie is now the bench scorer of the SAS playoff run — cleared 9.5 PRA in 3 straight CF games (28/18/26 avg ~24). Role secure at 24-28 min. PRA is the premier reliable-tier dimension at 13/13 across the playoffs. NYK's perimeter D (OG/Bridges/Hart at 0.9-1.7 dLEBRON) is meaningfully tighter than OKC's Dort, so the PRA line has LESS AIR than vs OKC — but the floor itself (composite pts+reb+ast at deep alt) holds even with mild efficiency degradation. Engine projects ~14 PRA. Line 9.5 = a deep blowout-stable floor. The anchor of the Finals reliable parlay.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'win', actual:'Champagnie 27 PRA (16pts/10reb/1ast) — cleared 9.5 easily' },
  },
  {
    id: 'finals-g1-sas-nyk-castle-ast',
    slate: 'Finals-G1', series: 'SAS-NYK', game: 1, postedAt: '2026-06-03',
    type: 'prop', pick: 'Castle Over 4.5 assists', odds: '-160',
    facts: [
      {label:'WCF AST',value:'8/8/6/5/6/9/6 → 6.9 avg'},
      {label:'Role',value:'WCF MVP-tier creator + Brunson POA defender'},
      {label:'Engine',value:'6.5 AST'},
    ],
    reasoning: "Castle had the WCF of his life (WCF MVP candidate). AST series totals 8/8/6/5/6/9/6 = 6.9 avg. He's the primary SAS creator AND draws the Brunson POA assignment — his usage stays high. Engine projects 6.5 AST. Line 4.5 = proj-2.0 deep-alt zone. AST is well-calibrated for primary ball-handlers; this is the cleanest SAS counting-stat floor on the Finals G1 board.",
    confidence: 'lean', thesis: ['model'], narrative: null,
    result: { outcome:'loss', actual:'Castle 3 ast — usage tilted to scoring (17pts) not creating; missed 4.5' },
  },

  // ═══════════════════════════════════════════════════════════════
  // FINALS G2 — Fri 6/5 @ Frost Bank Center. NYK leads 1-0.
  // SAS near-must-win; DK SAS -5.5 / 214.5 / ML SAS -230, NYK +180.
  // Engine SAS by 4 (COMPETITIVE) UNDER the -5.5 → NYK +5.5 is value.
  // G1 LESSONS BAKED IN: (1) floor legs must be MINUTES-SECURE
  // (Keldon's 8-min playoff low broke the role-PRA floor) — Champagnie
  // (31 min) + Harper (28 min) held, so they anchor the G2 floor;
  // (2) Wemby PRA floor cleared even on a 6-21 night (40 PRA) — the
  // REB/FT composite is blowout/cold-shooting resilient. Phase 71 R3
  // out-of-sample stake cap stays 50% after the G1 wrong-winner.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'finals-g2-sas-nyk-ml',
    slate: 'Finals-G2', series: 'SAS-NYK', game: 2, postedAt: '2026-06-04',
    type: 'ml', pick: 'SAS ML vs NYK', odds: '-230',
    facts: [
      {label:'Series',value:'NYK leads 1-0'},
      {label:'Engine',value:'SAS by 4 (COMPETITIVE)'},
      {label:'Market',value:'SAS -5.5 / 214.5'},
      {label:'Spot',value:'SAS near-must-win at home, down 0-1'},
    ],
    reasoning: "Phase 71c engine: SAS 112, NYK 108 (SAS by 4) at Frost Bank Center — a home bounce-back the model leans toward but UNDER the -5.5. SAS lost G1 on shooting variance (36% FG, Wemby 6-21, Fox 3-13), not on being outplayed — they led by 14 before NYK's rested second half. The G2 case: home desperation down 0-1 + Wemby regression toward his ~25/11 WCF norms + a cleaner Fox. BUT the juice is the problem: SAS -230 implies 69.7% vs the model's ~62% home win — the market is OVERPRICING the bounce-back. The straight ML is a thin lean at best; the value is on the spread (NYK +5.5), not the moneyline. Phase 71 R3 out-of-sample cap stays 50% after the G1 wrong-winner — CAUTION pill auto-stamps.",
    confidence: 'lean', thesis: ['model','market'], narrative: 'home-bounceback',
    result: { outcome:'loss', actual:'NYK 105-104 — SAS LOST as a -230 home favorite. The bounce-back narrative the juice priced never closed: SAS led late but Wemby turned it over and missed the final look. Finals home/SAS lean now 0-2.' },
  },
  {
    id: 'finals-g2-sas-nyk-spread',
    slate: 'Finals-G2', series: 'SAS-NYK', game: 2, postedAt: '2026-06-04',
    type: 'spread', pick: 'NYK +5.5', odds: '-110',
    facts: [
      {label:'Market',value:'SAS -5.5 (-110)'},
      {label:'Engine margin',value:'SAS by 4'},
      {label:'G1 precedent',value:'NYK +2.5 covered (won outright)'},
    ],
    reasoning: "Engine SAS by 4 sits 1.5pts INSIDE the -5.5 line, so NYK +5.5 carries the model's cover edge. The structural case mirrors G1: NYK's rested legs were a second-half ASSET (outscored SAS 57-40 after the break), role-player 3PT depth travels (Shamet/OG/McBride combined for makes that matched SAS on 7 fewer attempts), and Brunson's 9.2 clutch is the best on the floor in a tight finish. Even in a SAS bounce-back WIN, the model sees a single-digit margin — NYK +5.5 hits if NYK wins OR loses by ≤5. This is the cleanest value on the G2 board: the market priced SAS as a -5.5 home favorite the day AFTER it lost at home as a -2.5 favorite, leaning hard on the bounce-back narrative. Phase 71 spread CAUTION + Finals out-of-sample → half-stake lean.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'NYK won outright 105-104 — +5.5 cashed comfortably. The spread/margin read landed for the second straight game (engine SAS by 4, actual NYK by 1, single-digit COMPETITIVE was correct). The cleanest value on the board, exactly as authored.' },
  },
  {
    id: 'finals-g2-sas-nyk-total',
    slate: 'Finals-G2', series: 'SAS-NYK', game: 2, postedAt: '2026-06-04',
    type: 'total', pick: 'Under 214.5', odds: '-110',
    facts: [
      {label:'G1 total',value:'200 (cashed Under 215.5)'},
      {label:'Engine',value:'~214 (market-aligned)'},
      {label:'Pattern',value:'Both defenses set in; SAS desperation = grind'},
    ],
    reasoning: "Engine projects ~214, essentially ON the 214.5 market — there is NO clean edge here, which is why this is a coin-flip-tier bet (the CAUTION pill auto-stamps totals regardless). The mild lean is UNDER: G1 was a 200-point defensive rock-fight (SAS 36% FG, NYK 41%), both teams now have a film look at each other, and a desperate home team typically plays a tighter, lower-possession grind to control variance rather than a track meet. The counter-case is real — a Wemby/Fox bounce-back plus NYK's road shooting repeating could push it OVER quickly. Lowest-conviction play on the slate; included for completeness, not as a recommended stake.",
    confidence: 'coin-flip', thesis: ['historical'], narrative: null,
    result: { outcome:'win', actual:'Total 209 (NYK 105, SAS 104) — Under 214.5 cashed. Both Finals totals now UNDER (G1 200, G2 209), extending the documented Finals-defense pattern over the raw engine number.' },
  },
  {
    id: 'finals-g2-sas-nyk-wemby-pra',
    slate: 'Finals-G2', series: 'SAS-NYK', game: 2, postedAt: '2026-06-04',
    type: 'prop', pick: 'Wembanyama Over 33.5 PRA', odds: '-120',
    facts: [
      {label:'G1 PRA',value:'40 (26pts/12reb/2ast) even on 6-21 FG'},
      {label:'Bounce-back',value:'6-21 below floor → scoring regression up'},
      {label:'Engine',value:'~37 PRA'},
    ],
    reasoning: "Wemby's PRA cleared 32.5 in G1 (40 PRA) even on a 6-21 shooting dud, because the REB/FT composite is cold-shooting resilient — 12 reb + 12-13 FT carried it. For G2, the scoring side has nowhere to go but up: 6-21 against a wall-the-paint scheme is below his established floor, and a bounce-back toward his ~25/11 WCF norms lifts the central PRA estimate to ~37. The line nudges up to 33.5 (from G1's 32.5) but still sits proj-3.5 in the deep-alt zone. The G1 result PROVED this is the most reliable Wemby leg — it cleared on his worst shooting night of the playoffs. The minutes are guaranteed (38 in G1). The cleanest single-player floor on the G2 board.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: 'pra-floor',
    result: { outcome:'win', actual:'Wemby 29pts/9reb/3ast = 41 PRA — cleared 33.5 easily even with the REB dip to 9. The PRA composite stayed reliable for the third straight game (40, 40, 41) regardless of shooting; the deep-alt Wemby PRA floor is the most dependable single-player line in the series.' },
  },
  {
    id: 'finals-g2-sas-nyk-champagnie-pra',
    slate: 'Finals-G2', series: 'SAS-NYK', game: 2, postedAt: '2026-06-04',
    type: 'prop', pick: 'Champagnie Over 9.5 PRA', odds: '-300',
    facts: [
      {label:'Recent PRA',value:'WCF G5-G7 24 avg; G1 27 (16/10/1)'},
      {label:'Minutes',value:'31 min in G1 — SECURE rotation role'},
      {label:'G1 lesson',value:'Minutes-secure legs held; Keldon (8 min) broke'},
    ],
    reasoning: "Champagnie cleared 9.5 PRA AGAIN in G1 (27 — 16pts/10reb/1ast, 5-10 from 3) and crucially logged 31 SECURE minutes. The G1 lesson is the whole thesis: the role-player PRA floor broke ONLY on Keldon Johnson's 8-minute playoff-low burial — the minutes-secure legs (Champagnie, Harper) both cleared with room. Champagnie is now the locked-in bench scorer of the SAS run (24-28 min every game), so his PRA floor doesn't carry the minutes-correlation risk that sank the Keldon leg. Engine ~14 PRA; line 9.5 is a deep blowout-stable floor. The anchor of the G2 reliable parlay — vetted for minutes security per the G1 retro.",
    confidence: 'lean', thesis: ['model'], narrative: 'minutes-secure-floor',
    result: { outcome:'win', actual:'Champagnie 8pts/4reb/1ast = 13 PRA in 30 SECURE min — cleared 9.5 even on a 2-6 cold-shooting night. The minutes-vetted floor HELD exactly as the G1 retro screened for.' },
  },
  {
    id: 'finals-g2-sas-nyk-harper-pra',
    slate: 'Finals-G2', series: 'SAS-NYK', game: 2, postedAt: '2026-06-04',
    type: 'prop', pick: 'Harper Over 9.5 PRA', odds: '-240',
    facts: [
      {label:'Recent PRA',value:'WCF G5-G7 19 avg; G1 25 (16/8/1)'},
      {label:'Minutes',value:'28 min in G1 — SECURE bench role'},
      {label:'Engine',value:'~16 PRA'},
    ],
    reasoning: "Harper cleared the G1 floor comfortably (25 PRA — 16pts/8reb/1ast on 6-10 FG) in 28 SECURE minutes, the other minutes-stable leg that held when Keldon's didn't. The rookie's combo-guard PRA composite (scoring + rebounding + the occasional dime) is game-script-independent and his bench role is locked at 26-30 min. Line bumped to 9.5 (from G1's 8.5 — the alt re-priced after he cleared) but still proj-6 deep. Pairs with Champagnie as the two minutes-vetted legs of the G2 reliable parlay; the G1 retro explicitly confirmed both held while the staple-benched wing broke.",
    confidence: 'lean', thesis: ['model'], narrative: 'minutes-secure-floor',
    result: { outcome:'win', actual:'Harper 15pts/6reb/2ast = 23 PRA in 28 SECURE min — cleared 9.5 with room. The second minutes-vetted floor that held; both Champagnie and Harper validated the minutes-security thesis.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // FINALS G3 — Mon 6/8 at MSG (NYK home), NYK leads 2-0
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'finals-g3-sas-nyk-spread',
    slate: 'Finals-G3', series: 'SAS-NYK', game: 3, postedAt: '2026-06-08',
    type: 'spread', pick: 'SAS +2.5', odds: '-110',
    facts: [
      {label:'Market',value:'NYK -2.5 (-110)'},
      {label:'Engine margin',value:'NYK by 1'},
      {label:'Precedent',value:'NYK +5.5 (G1) + NYK +5.5 (G2) both cashed — spread read 2-0'},
    ],
    reasoning: "Engine NYK 105, SAS 104 (NYK by 1) sits 1.5pts INSIDE the -2.5 line, so SAS +2.5 carries the model's cover edge — the exact same spread-value logic that cashed NYK +5.5 in both G1 and G2 (the engine's margin read is 2-0 even as its winner pick went 0-2). SAS is the desperate home-cliff team facing 0-3, plays its tightest game of the series, and the model sees a single-digit COMPETITIVE finish: SAS +2.5 hits if SAS wins OR loses by ≤2. The cleanest value on the G3 board for the same structural reason it's been right twice — the market keeps pricing the favorite a hair past where the engine sees the margin. Phase 71 spread CAUTION + Finals out-of-sample → half-stake lean.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'SAS won 115-111 outright — SAS +2.5 covers. The spread-value side the engine flagged (SAS getting points with the margin read inside the line) is now a PERFECT 3-for-3 in the Finals (NYK +5.5, NYK +2.5, SAS +2.5) even as the winner pick went 0-3.' },
  },
  {
    id: 'finals-g3-sas-nyk-ml',
    slate: 'Finals-G3', series: 'SAS-NYK', game: 3, postedAt: '2026-06-08',
    type: 'ml', pick: 'NYK ML vs SAS', odds: '-125',
    facts: [
      {label:'Series',value:'NYK leads 2-0'},
      {label:'Engine',value:'NYK by 1 (COMPETITIVE)'},
      {label:'Caution',value:'Model winner pick 0-2 in the Finals (home lean)'},
    ],
    reasoning: "Phase 71c engine: NYK 105, SAS 104 (NYK by 1) at MSG — the model leans NYK at home, but with a LOUD caveat: the engine's home-court lean has gone wrong-winner in both Finals games so far (favored SAS twice, NYK won both). The same +1pt home nudge now points at NYK, and the wrongStreak detector is at 2. NYK -125 implies ~55.6% vs the model's ~52% home win — essentially FAIR, no clean edge. NYK is the better-positioned side (up 2-0, home crowd, secondary creation that doesn't depend on Brunson scoring), but this is a coin-flip-tier ML the way the Finals have played; the spread (SAS +2.5) is the cleaner expression of the model's read. CAUTION pill auto-stamps in the out-of-sample Finals.",
    confidence: 'coin-flip', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'SAS 115-111 — NYK lost outright as a -125 home favorite. The model winner pick (home/+1pt lean) is now 0-3 in the Finals; the loud CAUTION the bet carried played out. SAS finally closed a fourth quarter.' },
  },
  {
    id: 'finals-g3-sas-nyk-total',
    slate: 'Finals-G3', series: 'SAS-NYK', game: 3, postedAt: '2026-06-08',
    type: 'total', pick: 'Under 216.5', odds: '-110',
    facts: [
      {label:'Finals totals',value:'G1 200, G2 209 — both UNDER'},
      {label:'Engine',value:'~210 (UNDER the 216.5)'},
      {label:'Pattern',value:'SAS desperation = tighter, lower-possession grind'},
    ],
    reasoning: "Engine projects ~210, a clean ~6.5pts UNDER the 216.5 market, extending the documented Finals UNDER lean that cashed both prior games (200, then 209). The structural case: both defenses have a full film look at each other, MSG Finals atmosphere tends to tighten the early game, and a desperate SAS team facing the 0-3 cliff plays controlled, lower-variance basketball rather than a track meet. The counter-case is a Wemby/Fox shootout if SAS abandons caution down 0-2 — but the base rate (every Finals game this series went UNDER) plus the engine number make UNDER the lean. Totals carry the auto-CAUTION pill regardless; half-stake.",
    confidence: 'lean', thesis: ['historical','model'], narrative: null,
    result: { outcome:'loss', actual:'Total 226 (SAS 115, NYK 111) — Over 216.5. The first OVER of the Finals after G1 (200) and G2 (209) both cashed UNDER; the documented UNDER pattern broke at MSG, lifted by a faster home pace + OG Anunoby 28 (4-6 3PT) + Brunson restored 25-FGA volume. The UNDER read regresses to 2-1.' },
  },
  {
    id: 'finals-g3-sas-nyk-wemby-pra',
    slate: 'Finals-G3', series: 'SAS-NYK', game: 3, postedAt: '2026-06-08',
    type: 'prop', pick: 'Wembanyama Over 33.5 PRA', odds: '-125',
    facts: [
      {label:'Finals PRA',value:'40 (G1), 41 (G2) — both cleared'},
      {label:'Desperation',value:'0-3 cliff → maximum usage expected'},
      {label:'Engine',value:'~38 PRA'},
    ],
    reasoning: "Wemby's PRA has cleared 32.5+ in both Finals games (40, 41) on wildly different shooting nights (6-21, then 11-21) because the REB/FT/scoring composite is variance-proof — the most dependable single-player line in the series. For G3, SAS faces the 0-3 cliff, which means MAXIMUM Wemby usage in their most desperate game; the central PRA estimate sits ~38 and the 33.5 line is proj-4.5 in the deep-alt zone. The minutes are guaranteed (38-40 every game). NOTE: this is the PRA composite, NOT the REB-alt — the G2 REB floor (O11.5) broke on Robinson's deterrence, so this run keys the PRA line (rebound-independent) rather than a standalone REB leg. The cleanest single-player floor on the board.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: 'pra-floor',
    result: { outcome:'win', actual:'Wembanyama 32/8/6 = 46 PRA — cleared the 33.5 alt comfortably for the third straight game (40, 41, 46). The composite is variance-proof; this time it came on an EFFICIENT 11-18 closeout night as SAS protected the lead.' },
  },
  {
    id: 'finals-g3-sas-nyk-kat-pra',
    slate: 'Finals-G3', series: 'SAS-NYK', game: 3, postedAt: '2026-06-08',
    type: 'prop', pick: 'Karl-Anthony Towns Over 30.5 PRA', odds: '-120',
    facts: [
      {label:'Finals PRA',value:'34 (G1), 38 (G2) — both cleared'},
      {label:'Role',value:'Stretch-5 + primary glass vs Wemby; secure 34-36 min'},
      {label:'G2 lesson',value:'NYK secondary creators carried while Brunson struggled'},
    ],
    reasoning: "KAT has cleared 30.5 PRA in both Finals games (34, then 38 — 21/13/4 in G2) and is the more reliable NYK play than the Brunson points line after Castle suppressed Brunson to 20 on 7-25 in G2. The KAT composite (scoring + a locked ~12 rpg glass role at the 5 vs Wemby + secondary playmaking) is game-script-independent and his minutes are secure at 34-36. The G2 lesson is the whole thesis: NYK won because the SECONDARY creators (Bridges 20/6/6, KAT 21/13) absorbed the load when Brunson couldn't score — so the KAT PRA is the structurally-correct NYK star play. Engine ~36 PRA; the 30.5 line is a deep, blowout-stable floor. Anchor of the NYK reliable parlay.",
    confidence: 'lean', thesis: ['model'], narrative: 'pra-floor',
    result: { outcome:'loss', actual:'KAT 11/8/2 = 21 PRA — MISSED the 30.5 alt after clearing 34 and 38. Wemby\'s rim presence (3 blocks) bothered him inside on a 4-11 shooting night. The lesson: a PRA floor that depends on the player SCORING (KAT\'s reb/ast base ~10) is matchup-fragile vs an elite shot-blocker — distinct from the minutes-secure role-player floors (Harper/Champagnie) that held.' },
  },
  {
    id: 'finals-g3-sas-nyk-champagnie-pra',
    slate: 'Finals-G3', series: 'SAS-NYK', game: 3, postedAt: '2026-06-08',
    type: 'prop', pick: 'Champagnie Over 9.5 PRA', odds: '-280',
    facts: [
      {label:'Finals PRA',value:'27 (G1), 13 (G2) — both cleared'},
      {label:'Minutes',value:'30-31 min both games — SECURE'},
      {label:'Lesson',value:'Minutes-vetted floors held both games'},
    ],
    reasoning: "Champagnie cleared 9.5 PRA in BOTH Finals games (27, then 13 even on a 2-6 cold-shooting night) on 30-31 SECURE minutes — the minutes-security thesis vindicated twice. He's the locked-in SAS bench scorer/wing (28-31 min every game), so his floor doesn't carry the minutes-correlation risk that sank the G1 Keldon leg. In a desperate G3 his rotation role is, if anything, MORE secure. Engine ~13 PRA; the 9.5 line is a deep blowout-stable floor. The anchor of the SAS reliable parlay, screened for minutes per the running retro.",
    confidence: 'lean', thesis: ['model'], narrative: 'minutes-secure-floor',
    result: { outcome:'win', actual:'Champagnie 12/5/1 = 18 PRA — cleared the 9.5 alt for the third straight Finals game (27, 13, 18) on a locked 30 minutes. Minutes-security thesis vindicated again; bounce-back 3-6 shooting.' },
  },
  {
    id: 'finals-g3-sas-nyk-harper-pra',
    slate: 'Finals-G3', series: 'SAS-NYK', game: 3, postedAt: '2026-06-08',
    type: 'prop', pick: 'Harper Over 9.5 PRA', odds: '-230',
    facts: [
      {label:'Finals PRA',value:'25 (G1), 23 (G2) — both cleared'},
      {label:'Minutes',value:'28 min both games — SECURE bench role'},
      {label:'Engine',value:'~17 PRA'},
    ],
    reasoning: "Harper cleared 9.5 PRA in both Finals games (25, then 23) in 28 SECURE minutes — the other minutes-stable SAS leg that held both nights. The rookie combo-guard's scoring + rebounding + occasional-dime composite is game-script-independent and his bench role is locked at 26-30 min. Pairs with Champagnie as the two minutes-vetted legs of the SAS reliable parlay; both have now cleared in every Finals game. Engine ~17 PRA; the 9.5 line is proj-7.5 deep.",
    confidence: 'lean', thesis: ['model'], narrative: 'minutes-secure-floor',
    result: { outcome:'win', actual:'Harper 13/9/3 = 25 PRA — cleared the 9.5 alt for the third straight game (25, 23, 25) on 28 SECURE minutes, a near-double-double. The minutes-vetted role-PRA floor is the most reliable dimension in the series.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // FINALS G4 — Wed 6/10 at MSG (NYK home), NYK leads 2-1
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'finals-g4-sas-nyk-spread',
    slate: 'Finals-G4', series: 'SAS-NYK', game: 4, postedAt: '2026-06-09',
    type: 'spread', pick: 'SAS +1.5', odds: '-110',
    facts: [
      {label:'Market',value:'NYK -1.5 (-110)'},
      {label:'Engine margin',value:'NYK by 1 (OT/coin flip)'},
      {label:'Precedent',value:'Spread-value side 3-for-3 (NYK +5.5, NYK +2.5, SAS +2.5 all cashed)'},
    ],
    reasoning: "Engine NYK 107, SAS 106 (NYK by 1) sits INSIDE the -1.5 line, so SAS +1.5 carries the model's cover edge — the exact spread-value logic that has cashed all THREE Finals games even as the raw winner pick went 0-3. The engine reads G4 as the tightest game of the series (character OVERTIME, projectedOT true), and SAS carries real momentum after finally closing a fourth quarter in G3. SAS +1.5 hits if SAS wins OR loses by 1 (covers OT, covers any single-possession finish). The structural read: in a literal coin-flip game the points are worth more than the side, and the model's margin calibration (close predicted, close delivered every game) is its most trustworthy Finals output. Phase 71 spread CAUTION + Finals out-of-sample → half-stake lean. The cleanest value on the G4 board for the fourth straight game.",
    confidence: 'lean', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'SAS lost 106-107 by exactly 1 — SAS +1.5 COVERS. The spread-value side the engine flagged is now a PERFECT 4-for-4 in the Finals (NYK +5.5, NYK +2.5, SAS +2.5, SAS +1.5). The engine read NYK by 1 and the game finished NYK by 1 — an exact-margin hit.' },
  },
  {
    id: 'finals-g4-sas-nyk-ml',
    slate: 'Finals-G4', series: 'SAS-NYK', game: 4, postedAt: '2026-06-09',
    type: 'ml', pick: 'NYK ML vs SAS', odds: '-125',
    facts: [
      {label:'Series',value:'NYK leads 2-1'},
      {label:'Engine',value:'NYK by 1 (OVERTIME/coin flip)'},
      {label:'Caution',value:'Model winner pick 0-3 in the Finals (home lean)'},
    ],
    reasoning: "Phase 71c engine: NYK 107, SAS 106 (NYK by 1) at MSG — the model leans NYK at home, but the home/+1pt nudge is now 0-3 on Finals winners (it favored SAS twice, NYK once; the actual winners were NYK, NYK, SAS). The wrongStreak detector is at 3. NYK -125 implies ~55.6% vs the model's ~52% NYK win — essentially FAIR, no clean edge. NYK is better-positioned (up 2-1, home, secondary creation that should bounce back from the G3 KAT/Bridges no-shows), and a win goes up 3-1, but the way this Finals has played the moneyline is a coin flip and the spread (SAS +1.5) is the cleaner expression of the model's read. CAUTION pill auto-stamps; the running R4 rule is to distrust this winner pick and lean on the margin/spread. Documented as the model's nominal lean, not a placed bet.",
    confidence: 'coin-flip', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'NYK 107-106 — NYK held on as a -125 home favorite to complete the largest comeback in Finals history. The model winner pick (home/+1pt lean) finally HITS, snapping to 1-3 in the Finals after an 0-3 start. NYK leads 3-1.' },
  },
  {
    id: 'finals-g4-sas-nyk-total',
    slate: 'Finals-G4', series: 'SAS-NYK', game: 4, postedAt: '2026-06-09',
    type: 'total', pick: 'Under 215.5', odds: '-110',
    facts: [
      {label:'Finals totals',value:'200, 209 UNDER — then 226 OVER at MSG (G3)'},
      {label:'Engine',value:'OT-adjusted ~214 (UNDER 215.5)'},
      {label:'Caution',value:'UNDER pattern BROKE in G3 on MSG pace — now 2-1, venue-dependent'},
    ],
    reasoning: "Engine OT-adjusted total ~214 leans a hair UNDER the 215.5 — but with MUCH lower conviction than G1/G2. The Finals-UNDER pattern that cashed twice (200, 209) BROKE in G3 (226 OVER) on MSG's faster home pace + OG Anunoby's 28; the same court hosts G4, so the venue-pace risk that beat the UNDER is live again. The case FOR the UNDER: an OT-character coin flip is a half-court grind by definition, both defenses have a full series of film, and SAS plays controlled basketball when it's tight. The case AGAINST (and why this is a reduced lean): MSG ran fast in G3 and a NYK secondary-creator bounce-back (KAT/Bridges) adds points. Totals carry the auto-CAUTION pill; quarter-stake at most given the G3 break. Honestly the weakest of the model's G4 reads.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'Total 213 (NYK 107, SAS 106) — UNDER 215.5 cashes. The MSG-pace worry that broke the G3 UNDER did not repeat; the total read recovers to 3-1 (200, 209, [226 over], 213). The model\'s weakest G4 read still cashed.' },
  },
  {
    id: 'finals-g4-sas-nyk-wemby-pra',
    slate: 'Finals-G4', series: 'SAS-NYK', game: 4, postedAt: '2026-06-09',
    type: 'prop', pick: 'Wembanyama Over 33.5 PRA', odds: '-125',
    facts: [
      {label:'Finals PRA',value:'40, 41, 46 — all cleared'},
      {label:'Engine',value:'~40 PRA'},
      {label:'Minutes',value:'38-40 guaranteed every game'},
    ],
    reasoning: "Wemby's PRA has cleared 33.5 in ALL three Finals games (40, 41, 46) across a 6-21 dud, an 11-21 bounce-back, and a clean 11-18 closeout — the REB/FT/scoring composite is the most variance-proof line in the series and is rebound-independent (keys the composite, not the standalone REB alt that broke twice). For G4, an OT-character coin flip means maximum Wemby usage and minutes (38-40 guaranteed); the central PRA estimate sits ~40 and the 33.5 line is proj-6.5 in the deep-alt zone. The single cleanest player floor on the board for the fourth straight game. Cross-references the G3 KAT lesson: anchor on the player whose floor is carried by GUARANTEED reb/ast volume (Wemby ~12 reb base), not by scoring alone.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: 'pra-floor',
    result: { outcome:'win', actual:'Wembanyama 24/13/1 = 38 PRA — cleared the 33.5 alt for the FOURTH straight game (40, 41, 46, 38) on a COLD 9-25 shooting night. The 13 rebounds + FT volume carried the composite when the shot wasn\'t falling — exactly the reb/ast-backed variance-proofing the thesis keys on (vs the G3 KAT scoring-dependent break).' },
  },
  {
    id: 'finals-g4-sas-nyk-champagnie-pra',
    slate: 'Finals-G4', series: 'SAS-NYK', game: 4, postedAt: '2026-06-09',
    type: 'prop', pick: 'Champagnie Over 9.5 PRA', odds: '-280',
    facts: [
      {label:'Finals PRA',value:'27, 13, 18 — cleared all three'},
      {label:'Minutes',value:'30-31 min every game — SECURE'},
      {label:'Lesson',value:'Minutes-vetted role-PRA is 3-for-3'},
    ],
    reasoning: "Champagnie has cleared 9.5 PRA in ALL three Finals games (27, 13, 18) on 30-31 SECURE minutes — the minutes-security thesis vindicated three straight times across hot and cold shooting nights. He's the locked-in SAS bench scorer/wing (28-31 min every game) with no minutes-correlation risk. With SAS riding G3 momentum and the rotation tight in a coin-flip game, his role is, if anything, MORE secure. Engine ~13 PRA; the 9.5 line is a deep blowout-stable floor. The anchor of the SAS reliable parlay and — per the G3 KAT-break lesson — exactly the kind of minutes-secure role-PRA floor to PREFER over a scoring-dependent star composite.",
    confidence: 'lean', thesis: ['model'], narrative: 'minutes-secure-floor',
    result: { outcome:'win', actual:'Champagnie 5/5/3 + 4 STL = 13 PRA — cleared the 9.5 alt for the FOURTH straight game (27, 13, 18, 13) on a frigid 2-9 shooting night. The cold-night clear is the whole thesis: the reb/ast/stl composite backstops a bad scoring night for a minutes-secure (33 min) role player. The single most reliable dimension in the series.' },
  },
  {
    id: 'finals-g4-sas-nyk-harper-pra',
    slate: 'Finals-G4', series: 'SAS-NYK', game: 4, postedAt: '2026-06-09',
    type: 'prop', pick: 'Harper Over 9.5 PRA', odds: '-230',
    facts: [
      {label:'Finals PRA',value:'25, 23, 25 — cleared all three'},
      {label:'Minutes',value:'28 min every game — SECURE bench role'},
      {label:'Engine',value:'~18 PRA'},
    ],
    reasoning: "Harper has cleared 9.5 PRA in ALL three Finals games (25, 23, 25 — a near-double-double in G3) on 28 SECURE minutes — the most consistent role-PRA floor in the series alongside Champagnie. The rookie combo-guard's scoring + rebounding + occasional-dime composite is game-script-independent and his bench role is locked at 26-30 min. Pairs with Champagnie as the two minutes-vetted legs of the SAS reliable parlay; both have cleared in every Finals game. Engine ~18 PRA; the 9.5 line is proj-8.5 deep. The reliable-tier structure that is now 2-1 in the Finals and has cleared every leg in all three games.",
    confidence: 'lean', thesis: ['model'], narrative: 'minutes-secure-floor',
    result: { outcome:'win', actual:'Harper 21/4/3 = 28 PRA — cleared the 9.5 alt for the FOURTH straight game (25, 23, 25, 28) on a team-best-efficiency 8-12 night, 32 secure minutes. The rookie was SAS\'s most efficient scorer; the role-PRA floor is now 3-for-3 when authored as a parlay (G2, G3, G4).' },
  },

  // ═══════════════════════════════════════════════════════════════
  // FINALS G5 — Sat 6/13 at Frost Bank Center (SAS home), NYK leads 3-1
  // NYK can clinch its first title since 1973; SAS faces elimination
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'finals-g5-sas-nyk-spread',
    slate: 'Finals-G5', series: 'SAS-NYK', game: 5, postedAt: '2026-06-12',
    type: 'spread', pick: 'NYK +3', odds: '-110',
    facts: [
      {label:'Market',value:'SAS -3 (-110)'},
      {label:'Engine margin',value:'SAS by 3 (COMPETITIVE)'},
      {label:'Precedent',value:'Spread-value side 4-for-4 (NYK +5.5, NYK +2.5, SAS +2.5, SAS +1.5)'},
    ],
    reasoning: "Engine SAS 108, NYK 105 (SAS by 3) sits RIGHT AT the SAS -3 market line — so this is the THINNEST spread read of the series: the engine's margin equals the line, no clean inside-the-number edge for either side. The nominal value lean is NYK +3 (taking the points with the team that needs only one win and is playing with house money up 3-1), but conviction is genuinely low because the engine number IS the line. The spread-value side has cashed all four Finals games when the engine put a team inside the line; here there's no such cushion, so this is a documented lean at most, not the clean 4-4 setup. The Phase 73 elimination amplifier widens the SAS-win/SAS-cover tail (desperate home team), which is the honest argument AGAINST NYK +3. Half-stake at best; the spread is close to a true pick'em on the number.",
    confidence: 'coin-flip', thesis: ['model','market'], narrative: null,
    result: { outcome:'win', actual:'NYK won 94-90 OUTRIGHT, so NYK +3 covers easily. The spread-value side the engine flagged finishes a PERFECT 5-for-5 in the Finals (NYK +5.5, NYK +2.5, SAS +2.5, SAS +1.5, NYK +3) — taking the points with the live dog cashed even though the engine\'s SAS-by-3 margin was wrong by 7, because New York won the game on the way to the title.' },
  },
  {
    id: 'finals-g5-sas-nyk-ml',
    slate: 'Finals-G5', series: 'SAS-NYK', game: 5, postedAt: '2026-06-12',
    type: 'ml', pick: 'SAS ML vs NYK', odds: '-155',
    facts: [
      {label:'Series',value:'NYK leads 3-1 (can clinch)'},
      {label:'Engine',value:'SAS by 3 (home + elimination amplifier)'},
      {label:'Caution',value:'Model winner pick 1-3 in the Finals'},
    ],
    reasoning: "Phase 71c engine: SAS 108, NYK 105 (SAS by 3) at Frost Bank Center — the model flips back to San Antonio on the home/closeout dynamics (SAS 6-1 at home this run) and the Phase 73 elimination amplifier (a desperate home team down 3-1 earns a desperation bump + wider variance). SAS -155 implies ~60.8% vs the model's ~58% SAS win — roughly fair, a thin negative edge. The LOUD caveat: the model winner pick is only 1-3 in the Finals, and the four games have been a coin flip decided by execution, not the favorite. The structural case for SAS: maximum Wemby usage, the loudest crowd of the series, and a NYK team that can afford to lose (two more chances). The case for NYK: the better team all series, the Anunoby/Brunson scoring that won G4, and a closeout opportunity. Documented as the model's nominal SAS lean; the running R4 rule says distrust this pick and lean on the margin — which here offers no spread edge either. A genuine coin flip.",
    confidence: 'coin-flip', thesis: ['model','market'], narrative: null,
    result: { outcome:'loss', actual:'SAS lost 90-94 — the engine\'s nominal SAS pick missed as New York closed out the championship on the road. The Finals winner pick finishes 1-4: the home/elimination lean was misleading all series, and the Phase 73 amplifier\'s bump on a desperate home SAS was exactly the wrong read. The running R4 rule (distrust the side, bet the spread) was vindicated one last time — NYK +3 cashed while SAS ML lost.' },
  },
  {
    id: 'finals-g5-sas-nyk-total',
    slate: 'Finals-G5', series: 'SAS-NYK', game: 5, postedAt: '2026-06-12',
    type: 'total', pick: 'Under 211.5', odds: '-110',
    facts: [
      {label:'Finals totals',value:'SA: 200, 209 UNDER · MSG: 226 OVER, 213 UNDER'},
      {label:'Engine',value:'~209 (UNDER 211.5)'},
      {label:'Venue',value:'Both Frost Bank games went UNDER — grind pace'},
    ],
    reasoning: "Engine ~209 leans a hair UNDER the 211.5 — and unlike the G4 MSG total, this read has the venue tailwind: BOTH games in San Antonio went comfortably UNDER (200, 209) on the Frost Bank grind pace, while the only OVER of the series was the faster MSG G3 (226). Back at Frost Bank, the documented Finals-UNDER pattern that the engine's number was built on is on home turf. The case FOR: a COMPETITIVE elimination game tends to slow into the half-court, both defenses have a full series of film, and SAS plays controlled basketball at home. The case AGAINST: an elimination-desperate SAS could push pace, and a NYK closeout means full intensity. Totals carry the auto-CAUTION pill; half-stake. The cleanest of the model's G5 reads given the venue-UNDER history.",
    confidence: 'lean', thesis: ['model','historical'], narrative: null,
    result: { outcome:'win', actual:'Total 184 (NYK 94, SAS 90) — UNDER 211.5 cashes by 27, the lowest-scoring game of the series. The title-clinching defensive rock fight blew the UNDER away; all three San Antonio games went under (200, 209, 184) and the Finals total read finishes 4-1.' },
  },
  {
    id: 'finals-g5-sas-nyk-wemby-pra',
    slate: 'Finals-G5', series: 'SAS-NYK', game: 5, postedAt: '2026-06-12',
    type: 'prop', pick: 'Wembanyama Over 33.5 PRA', odds: '-125',
    facts: [
      {label:'Finals PRA',value:'40, 41, 46, 38 — all cleared'},
      {label:'Engine',value:'~40 PRA'},
      {label:'Minutes',value:'38-44 every game — max usage in elimination'},
    ],
    reasoning: "Wemby's PRA has cleared 33.5 in ALL FOUR Finals games (40, 41, 46, 38) across every shooting profile (6-21, 11-21, 11-18, 9-25) because the REB/FT/scoring composite is rebound-backed and variance-proof — even the cold 9-25 G4 cleared on 13 boards. For an elimination G5 at home, expect MAXIMUM usage and minutes (he played 44 in G4); the central PRA estimate sits ~40 and the 33.5 line is proj-6.5 in the deep-alt zone. The single cleanest player floor on the board for the fifth straight game, and the G4 lesson confirmed it: anchor on the player whose floor is carried by GUARANTEED reb volume (~13/game), not by scoring. The anchor of the SAS reliable parlay.",
    confidence: 'lean', thesis: ['model','matchup'], narrative: 'pra-floor',
    result: { outcome:'win', actual:'Wembanyama 19/14/2 = 35 PRA — cleared the 33.5 alt for the FIFTH straight game (40, 41, 46, 38, 35) even on a quiet 7-18 shooting night, carried by 14 boards + the reb-backed composite in defeat. The single cleanest player floor in the series, perfect across the Finals.' },
  },
  {
    id: 'finals-g5-sas-nyk-harper-pra',
    slate: 'Finals-G5', series: 'SAS-NYK', game: 5, postedAt: '2026-06-12',
    type: 'prop', pick: 'Harper Over 9.5 PRA', odds: '-230',
    facts: [
      {label:'Finals PRA',value:'25, 23, 25, 28 — cleared all four'},
      {label:'Minutes',value:'28-32 every game — SECURE bench role'},
      {label:'Engine',value:'~19 PRA'},
    ],
    reasoning: "Harper has cleared 9.5 PRA in ALL FOUR Finals games (25, 23, 25, 28) on 28-32 SECURE minutes — the most consistent role-PRA floor in the series alongside Champagnie, and his most efficient game (21/4/3 on 8-12) came in G4. The rookie combo-guard's scoring + rebounding composite is game-script-independent and his bench role only deepens in an elimination game at home. Pairs with Champagnie as the two minutes-vetted legs of the SAS reliable parlay; both have cleared every Finals game. Engine ~19 PRA; the 9.5 line is proj-9.5 deep. The single most reliable dimension in the series — the role-PRA floor parlay is 3-for-3 when authored (G2/G3/G4).",
    confidence: 'lean', thesis: ['model'], narrative: 'minutes-secure-floor',
    result: { outcome:'win', actual:'Harper 25/5/4 = 34 PRA — a team-high 25 points in the clincher; cleared the 9.5 alt for the FIFTH straight game (25, 23, 25, 28, 34). The minutes-vetted role-PRA floor finishes 4-for-4 when authored as a parlay (G2, G3, G4, G5).' },
  },
  {
    id: 'finals-g5-sas-nyk-champagnie-pra',
    slate: 'Finals-G5', series: 'SAS-NYK', game: 5, postedAt: '2026-06-12',
    type: 'prop', pick: 'Champagnie Over 9.5 PRA', odds: '-280',
    facts: [
      {label:'Finals PRA',value:'27, 13, 18, 13 — cleared all four'},
      {label:'Minutes',value:'30-33 every game — SECURE'},
      {label:'Lesson',value:'Cleared on a 2-9 cold night in G4 — variance-proof'},
    ],
    reasoning: "Champagnie has cleared 9.5 PRA in ALL FOUR Finals games (27, 13, 18, 13) on 30-33 SECURE minutes — including the G4 clear on a frigid 2-9 shooting night, which is the whole thesis: the rebound/assist/steal composite backstops a cold scoring night for a minutes-secure role player. He's the locked-in SAS bench wing whose role, if anything, deepens in an elimination home game. Engine ~14 PRA; the 9.5 line is a deep blowout-stable floor. The second anchor of the SAS reliable parlay and exactly the minutes-secure role-PRA floor the running retro says to PREFER over scoring-dependent star composites.",
    confidence: 'lean', thesis: ['model'], narrative: 'minutes-secure-floor',
    result: { outcome:'win', actual:'Champagnie 14/7/1 = 22 PRA — cleared the 9.5 alt for the FIFTH straight game (27, 13, 18, 13, 22) on 31 secure minutes (4-8 from deep). The reb/ast-backed role floor went a perfect 5-for-5 across the Finals — the most reliable dimension in the playoffs.' },
  },
];

// ============================================================
// FEATURED PARLAYS — declarative parlay schema
// ============================================================
// Schema:
//   id        : stable unique key
//   slate     : 'R2-G2' | …            which slate this parlay plays in
//   date      : 'YYYY-MM-DD'           when the parlay resolves
//   category  : 'floor' | 'traditional'  toggle group on Home page
//   type      : 'best-bet' | 'chaos' | 'value'  drives accent color
//   name      : display name
//   stake     : number (dollars)
//   odds      : string ('+110', '-120')
//   payout    : string  optional, e.g. '+$125'
//   legs      : [{ pick, odds, confidence, status?: 'hit'|'miss'|null, note }]
//   thesis    : free-form one-paragraph reasoning
//   result    : null | { outcome: 'win'|'loss'|'push', delta: '+125'|'-100' }
// ============================================================
const FEATURED_PARLAYS = [
  // ─── R2 G1 — RESOLVED ──────────────────────────────────────────
  {
    id: 'r2-g1-100-okc-det',
    slate: 'R2-G1', date: '2026-05-05',
    category: 'traditional', type: 'best-bet',
    name: '$100 Play — OKC Fortress + DET Home Court',
    stake: 100, odds: '+125', payout: '+$125',
    legs: [
      { pick:'OKC ML vs LAL', odds:'-900', confidence:'high', status:'hit',
        note:'OKC 108-90. Holmgren 24/12/3blk. LeBron 27 but LAL shot 37%.' },
      { pick:'DET ML vs CLE', odds:'-155', confidence:'medium-high', status:'hit',
        note:'DET 111-101. Cade 23/7ast, D.Robinson 19 (5-8 3PT). Duren clutch block.' },
    ],
    thesis:'Both home teams dominated G1. OKC\'s talent gap massive; DET\'s defense forced 19 CLE TOs (12 stl).',
    result: { outcome:'win', delta:'+125' },
  },
  {
    id: 'r2-g1-1-chaos-lebron',
    slate: 'R2-G1', date: '2026-05-05',
    category: 'traditional', type: 'chaos',
    name: '$1 Chaos Ticket — LeBron\'s Last Stand',
    stake: 1, odds: '+1800', payout: '-$1',
    legs: [
      { pick:'LAL ML @ OKC', odds:'+600', confidence:'chaos', status:'miss',
        note:'OKC 108-90. LAL shot 37% FG, never competitive.' },
      { pick:'CLE ML @ DET', odds:'+130', confidence:'chaos', status:'miss',
        note:'DET 111-101. CLE rallied to 93-93 but couldn\'t close.' },
    ],
    thesis:'No chaos tonight — favorites won both games convincingly.',
    result: { outcome:'loss', delta:'-1' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G2 — ARCHIVED (May 6: NYK-PHI + SAS-MIN)
  // ═══════════════════════════════════════════════════════════════

  // ─── RELIABLE FLOOR (80%+ hit rate per leg) ────────────────────
  {
    id: 'r2-g2-floor-iron',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'floor', type: 'best-bet',
    name: 'Iron Floor (3-Leg)',
    stake: 100, odds: '+190', payout: 'To Win: $190',
    legs: [
      { pick:'Brunson Over 19.5 pts (NYK-PHI G2)', odds:'-400', confidence:'floor', status:'hit',
        note:'26pts ✓. Game stayed close so he played 38min — exactly the scenario the floor thesis required.' },
      { pick:'Randle Over 14.5 pts (SAS-MIN G2)', odds:'-220', confidence:'floor', status:'miss',
        note:'12pts in 28min — sat early Q4 in 38pt blowout. Floor thesis assumed sub-15 only in blowouts; this WAS a blowout.' },
      { pick:'Vassell Over 9.5 pts (SAS-MIN G2)', odds:'-250', confidence:'floor', status:'hit',
        note:'12pts in 26min ✓ — held the floor as projected.' },
    ],
    thesis:'Every leg uses the FLOOR, not the ceiling. Brunson 19.5 is less than half his career avg vs PHI; he hasn\'t scored below 20 as a Knick in playoffs. Randle dipped below 15 only once all playoffs (24min game). Vassell locked into 11-16pts every game. Each leg clears 80%+ individually; combined at +190 is high-probability.',
    result: { outcome: 'loss', delta: '-100', actual: '2-of-3 legs hit. Randle\'s blowout-cap killed it — historical exception (sub-15 in blowouts) became the rule when SAS won by 38. Lesson: even "floor" props have correlated downside risk when the host team\'s blowout takes them out of the rotation.' },
  },
  {
    id: 'r2-g2-floor-home-stars',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'floor', type: 'best-bet',
    name: 'Home Stars (3-Leg)',
    stake: 100, odds: '+280', payout: 'To Win: $280',
    legs: [
      { pick:'OG Anunoby Over 12.5 pts (NYK-PHI G2)', odds:'-180', confidence:'floor', status:'hit',
        note:'24pts ✓ — cleared with massive room to spare. OG was 10-15 FG before exiting late.' },
      { pick:'Brunson Over 24.5 pts (NYK-PHI G2)', odds:'-150', confidence:'floor', status:'hit',
        note:'26pts ✓ — go-ahead bucket with 5:06 left, played 38min in tight game.' },
      { pick:'KAT Over 14.5 pts (NYK-PHI G2)', odds:'-200', confidence:'floor', status:'hit',
        note:'20pts/10reb/7ast ✓ — full triple-double-line floor performance.' },
    ],
    thesis:'All three legs are NYK home players with proven floor scoring. OG shot 87.5% G1 — midrange matchup-proof against PHI perimeter D. Brunson\'s 24.5 still 11pts below career avg vs PHI. KAT only below 15 in a sat-out blowout. Competitive G2 at MSG, all three clear comfortably.',
    result: { outcome: 'win', delta: '+280', actual: '3-of-3 legs hit ✓. Best parlay of the night. The "competitive G2" assumption was right (108-102, 25 lead changes); all three NYK starters played 30+ minutes and cleared their floors. +$280 on $100 stake.' },
  },
  {
    id: 'r2-g2-floor-spread',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'floor', type: 'best-bet',
    name: 'Spread + Floor (2-Leg)',
    stake: 100, odds: '+175', payout: 'To Win: $175',
    legs: [
      { pick:'MIN +9.5 (SAS-MIN G2)', odds:'-110', confidence:'floor', status:'miss',
        note:'SAS won by 38 — MIN didn\'t cover by 28.5. Largest playoff loss in MIN history. ATS history flag was right but G2 was the historical exception.' },
      { pick:'Brunson Over 19.5 pts (NYK-PHI G2)', odds:'-400', confidence:'floor', status:'hit',
        note:'26pts ✓.' },
    ],
    thesis:'MIN already won in San Antonio (G1, 104-102). Getting 9.5 means stay competitive — defense + Randle 21pts + Edwards expanding minutes ensures it. MIN 3-1 ATS as 9.5+ dogs, 5-1 last 6. Paired with Brunson rock-solid floor: two near-locks combined.',
    result: { outcome: 'loss', delta: '-100', actual: '1-of-2 — MIN +9.5 was the killer. The "post-upset bounce-back beatdown" pattern (favorite gets revenge at home) overwhelmed the ATS history. Lesson: angry-favorite home games can produce historical-record outcomes that no ATS pattern would predict.' },
  },

  // ─── TRADITIONAL (full range — regression / bounce-back / chaos) ─
  {
    id: 'r2-g2-trad-regression',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'traditional', type: 'best-bet',
    name: 'Regression Lock (2-Leg)',
    stake: 100, odds: '+145', payout: 'To Win: $145',
    legs: [
      { pick:'NYK ML vs PHI (G2)', odds:'-270', confidence:'high', status:'hit',
        note:'NYK 108-102 ✓ — Brunson 26 + KAT 20/10/7 led the close-out. Hart 3 + Q4 19-12 sealed it.' },
      { pick:'SAS ML vs MIN (G2)', odds:'-360', confidence:'high', status:'hit',
        note:'SAS 133-95 ✓ — regression validated MASSIVELY. SAS 41% 3PT vs G1 28%. Wemby 19/15.' },
    ],
    thesis:'Both home teams heavy favorites. SAS shot 28% 3PT G1 (season avg 37.5%) — 3.5 extra makes = +10.5pts of regression. NYK at home after dominant G1 vs tired PHI. Two strong favorites at home with bounce-back narratives.',
    result: { outcome: 'win', delta: '+145', actual: '2-of-2 ✓. Both home favorites won as projected. The regression thesis was the cleanest read of the night — when both teams shoot below their season averages and both are at home, the math is on your side. +$145 on $100.' },
  },
  {
    id: 'r2-g2-trad-bounceback',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'traditional', type: 'value',
    name: 'Bounce-Back Props (3-Leg)',
    stake: 100, odds: '+450', payout: 'To Win: $450',
    legs: [
      { pick:'Wembanyama Over 22.5 pts (G2)', odds:'-125', confidence:'medium', status:'miss',
        note:'19/15 — bounced back efficiency-wise (7-12 FG) but blowout took him out of Q4. Right thesis, wrong context (38pt rout).' },
      { pick:'Brunson Over 26.5 pts (G2)', odds:'-120', confidence:'high', status:'miss',
        note:'26pts — under by 0.5. Edgecombe defense early kept him at 9-21 (43%) below his usual ceiling.' },
      { pick:'Edwards Over 19.5 pts (G2)', odds:'-115', confidence:'medium', status:'miss',
        note:'12pts in 24min off bench — knee + blowout context killed it.' },
    ],
    thesis:'Wemby 0-8 3PT was career-worst for a 37.5% shooter — regression says 25+ G2. NOT a floor pick: Gobert + MIN defense scheme to contain him. Career avg vs MIN 22.6ppg, just clearing line. Edwards expanded minutes if knee holds. High upside at +450 but riskier than Floor parlays.',
    result: { outcome: 'loss', delta: '-100', actual: '0-of-3 ✗. All three played to their projected character but the LINES were just slightly above the deliveries — Brunson missed 26.5 by 0.5, Wemby and Edwards undermined by blowout-cap (sat in Q4). The "bounce-back happened, just not enough" loss.' },
  },
  {
    id: 'r2-g2-trad-chaos',
    slate: 'R2-G2', date: '2026-05-06',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — Double Upset (2-Leg)',
    stake: 100, odds: '+1800', payout: 'To Win: $1,800',
    legs: [
      { pick:'PHI ML vs NYK (G2)', odds:'+220', confidence:'chaos', status:'miss',
        note:'PHI lost 102-108. Played without Embiid (ruled out morning of game) so the "Embiid bounce-back" thesis was already moot. PHI did keep it close (25 lead changes) but couldn\'t close.' },
      { pick:'MIN ML vs SAS (G2)', odds:'+280', confidence:'chaos', status:'miss',
        note:'MIN lost by 38 — largest playoff loss in franchise history. Anti-chaos result.' },
    ],
    thesis:'MIN already won in San Antonio — not impossible. Dosunmu may return, Edwards 30+ min. PHI bounce-back potential real if Embiid goes nuclear. At +1800, $100 risk for $1,800 payout. Pure chaos.',
    result: { outcome: 'loss', delta: '-100', actual: '0-of-2 ✗. Embiid OUT (not in for the bounce-back) and MIN got run off the floor. Chaos didn\'t come — favorites swept. Common theme of the slate: this was a "favorites night."' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G2 — ARCHIVED (May 7: DET-CLE + OKC-LAL — bets pending manual resolution)
  // ═══════════════════════════════════════════════════════════════

  // ─── RELIABLE FLOOR ────────────────────────────────────────────
  // Restructured (May 7 PM): user pointed out that DK alternate prop lines
  // (lower line, higher juice) DO produce real floor parlays — earlier
  // mistake was treating them as unavailable. Compounding 90%+ legs with
  // juicy odds gives combined parlays at 80%+ hit rate.
  //
  // ALL ALT-LINE ODDS ARE ESTIMATES — daily checklist must verify exact
  // DK pricing before placing. The hit-rate notes are based on player's
  // last 10 games + engine projection.
  {
    id: 'r2-g2-may7-floor-star-compound',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'floor', type: 'best-bet',
    name: 'Star Scoring Floor (3-Leg, Alt Lines)',
    stake: 100, odds: '+90', payout: 'To Win: ~$90 (verify on DK)',
    legs: [
      { pick:'SGA Over 22.5 pts (alt line — OKC-LAL G2)', odds:'~-300', confidence:'high', status:'miss',
        note:'SGA 22pts ✗ — under 22.5 by 0.5. Foul trouble + OKC blowing them out by 18 with Holmgren/bench leading. The "9 of 10 over 22.5" recent run snapped on the worst-possible heartbreak margin.' },
      { pick:'Cade Over 17.5 pts (alt line — DET-CLE G2)', odds:'~-500', confidence:'high', status:'hit',
        note:'Cade 25pts ✓ — easily cleared 17.5. Q4 closing run pushed him from ~13 through 3Q to 25.' },
      { pick:'LeBron Over 21.5 pts (alt line — OKC-LAL G2)', odds:'~-200', confidence:'high', status:'hit',
        note:'LeBron 23pts ✓ — cleared 21.5 by 1.5. Reaves took the scoring load (31) so LeBron facilitated more than expected.' },
    ],
    thesis:'Three star scoring overs at ALTERNATE LINES below their main DK lines. Compounding 90-95% legs gives ~80% combined hit rate. SGA + Cade + LeBron are each 22.5/17.5/21.5 — all comfortably below their playoff averages of 31/27/24. Combined +90 estimate (with -300/-500/-200 alt juice). This is the parlay structure we should have kept all along — earlier removal was a mistake (treated alt lines as unavailable).',
    result: { outcome: 'loss', delta: '-100', actual: '2-of-3 ✗. SGA 22 was the killer — exactly 0.5 short of the alt line. Two days running of "deep alt + foul trouble" combining to bust a "floor" parlay. Lesson: when the line is ABOVE a player\'s G1 output (SGA G1 = 18; alt at 22.5), you\'re no longer betting on the floor — you\'re betting on a normal-mean game, and "normal" can break the wrong way.' },
  },
  {
    id: 'r2-g2-may7-floor-volume-compound',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'floor', type: 'best-bet',
    name: 'Volume Floor (2-Leg, Alt Lines)',
    stake: 100, odds: '+66', payout: 'To Win: ~$66 (verify on DK)',
    legs: [
      { pick:'Cade Over 4.5 assists (deep alt line — DET-CLE G2)', odds:'~-700', confidence:'high', status:'hit',
        note:'Cade 10 ast ✓ — cleared 4.5 by a mile. Facilitator-mode game, double-digit assists for the second straight in series.' },
      { pick:'Holmgren Over 7.5 rebounds (alt line — OKC-LAL G2)', odds:'~-220', confidence:'high', status:'hit',
        note:'Holmgren 9 reb ✓ — cleared 7.5 by 1.5. Counting-stat thesis worked even though scoring under-performed.' },
    ],
    thesis:'Counting-stat 2-leg using deep alt lines to clear the 80% floor threshold. Math: 0.95 × 0.85 ≈ 81% combined. Tightened from a 3-leg version (was ~65-70% with SGA O4.5 ast as the dragging leg) by dropping the weakest leg AND pushing Cade\'s line one tick deeper to 4.5. Counting stats remain blowout-proof — even if either game gets out of hand, the primary ball-handler and the rim-running big accumulate stats by Q3. ~$66 payout is the right price for a true 80%+ floor.',
    result: { outcome: 'win', delta: '+66', actual: '2-of-2 ✓. Cleanest floor parlay of the night — counting stats DID prove blowout-proof. The lesson learned 5/6 (Randle blowout-cap) was applied: counting stats over scoring stats. +$66 on $100.' },
  },
  {
    id: 'r2-g2-may7-floor-okc-lebron-compound',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'floor', type: 'best-bet',
    name: 'OKC Lock + LeBron Floor (2-Leg, Alt Line)',
    stake: 100, odds: '+67', payout: 'To Win: ~$67 (verify on DK)',
    legs: [
      { pick:'OKC ML vs LAL', odds:'-900', confidence:'high', status:'hit',
        note:'OKC 125-107 ✓ — 18-pt win, mirror of G1 margin. Same dominant pattern: Holmgren plus bench depth.' },
      { pick:'LeBron Over 21.5 pts (alt line — OKC-LAL G2)', odds:'~-200', confidence:'high', status:'hit',
        note:'LeBron 23 ✓ — cleared 21.5 by 1.5. Independence-from-blowout thesis correct (he scored 23 even though LAL lost by 18).' },
    ],
    thesis:'Two-leg parlay specifically engineered to clear the 80% floor threshold while paying meaningfully more than the solo OKC ML\'s $11. Math: 0.95 × 0.89 ≈ 85% combined. Crucial property: LeBron\'s scoring is INDEPENDENT of OKC blowing them out — he had 27pts (12-17 FG) in G1 while LAL lost by 18, so even a one-sided OKC win still produces a LeBron over. Three-leg compounds drop below 80% (0.95 × 0.85 × 0.92 = 74%), which is why this is capped at two legs.',
    result: { outcome: 'win', delta: '+67', actual: '2-of-2 ✓. The "LeBron scores independent of OKC dominating" thesis held perfectly — LAL lost by 18 and LeBron still went over. +$67 on $100.' },
  },

  // ─── TRADITIONAL (Value plays) ──────────────────────────────────
  // Demoted from Floor to Traditional: hit rates honest, +EV per engine but
  // not 75%+ combined. These are the "chase the engine edge" parlays where
  // we beat the market line per our model, but not at floor-pick reliability.
  {
    id: 'r2-g2-may7-trad-chalk-sweep',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'traditional', type: 'value',
    name: 'Chalk Sweep — Both Home MLs (2-Leg)',
    stake: 100, odds: '+80', payout: 'To Win: $80',
    legs: [
      { pick:'OKC ML vs LAL', odds:'-900', confidence:'high', status:'hit',
        note:'OKC 125-107 ✓.' },
      { pick:'DET ML vs CLE', odds:'-162', confidence:'medium', status:'hit',
        note:'DET 107-97 ✓ — Allen healthy (22/7) but Cade\'s 12-pt Q4 sealed it. Coin-flip read was too cautious; DET\'s defensive structure carried through.' },
    ],
    thesis:'DEMOTED from Floor (combined ~57% hit rate after honest analysis). DET ML at ~60% is the dragging leg — Allen returning makes G2 a near-coin-flip per the engine, but DK still has DET as a 3.5-pt favorite. Combined +80 only makes sense if you really trust DET defense to suppress CLE again. Honest take: skip if you can\'t handle a 40% loss probability.',
    result: { outcome: 'win', delta: '+80', actual: '2-of-2 ✓. Both home favorites won. The hesitation about DET (downgraded from best-bet to medium) was overcautious — DET\'s structural advantages carried through Allen\'s return. +$80 on $100.' },
  },
  {
    id: 'r2-g2-may7-trad-star-scoring',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'traditional', type: 'value',
    name: 'Star Scoring 2-Leg — SGA + Cade Overs',
    stake: 100, odds: '+240', payout: 'To Win: $240',
    legs: [
      { pick:'SGA Over 29 pts (OKC-LAL G2)', odds:'-120', confidence:'medium', status:'miss',
        note:'SGA 22 ✗ — way under 29. Foul trouble + OKC bench/Holmgren carrying.' },
      { pick:'Cade Over 27.5 pts (DET-CLE G2)', odds:'-118', confidence:'medium', status:'miss',
        note:'Cade 25 ✗ — under 27.5 by 2.5. Facilitator-mode (10 ast) capped scoring volume.' },
    ],
    thesis:'DEMOTED from Floor (combined ~40% after honest hit-rate analysis — even though both legs are +EV vs the market, neither is a 75%+ leg, so the parlay isn\'t a floor play). Engine projects clear overs on both, but recent variance makes this a value/upside play, not a floor parlay. +240 reflects the 40% combined miss probability.',
    result: { outcome: 'loss', delta: '-100', actual: '0-of-2 ✗. Both star scoring overs missed — a real value play that hit the wrong side of variance. SGA\'s 22-pt G2 (paired with G1\'s 18) suggests OKC\'s system is genuinely making him a co-equal (not a 30+ scorer) this series. Cade\'s facilitator mode caps his scoring whenever DET is up comfortably.' },
  },
  {
    id: 'r2-g2-may7-trad-star-props',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'traditional', type: 'value',
    name: 'Star Props 3-Leg — SGA + Cade + LeBron',
    stake: 100, odds: '+800', payout: 'To Win: $800',
    legs: [
      { pick:'SGA Over 29 pts (OKC-LAL G2)', odds:'-120', confidence:'medium', status:'miss',
        note:'SGA 22 ✗.' },
      { pick:'Cade Over 27.5 pts (DET-CLE G2)', odds:'-118', confidence:'medium', status:'miss',
        note:'Cade 25 ✗.' },
      { pick:'LeBron Over 23.5 pts (OKC-LAL G2)', odds:'+185', confidence:'lean', status:'miss',
        note:'LeBron 23 ✗ — under by 0.5. Book pricing (Under -250) was correct on the blowout-cap thesis.' },
    ],
    thesis:'Honest combined hit rate ~25-30%. The +800 odds reflect that. This is a high-variance value play — engine likes all 3 individually but the combined probability is ~1-in-4. Use for ceiling chase, not floor.',
    result: { outcome: 'loss', delta: '-100', actual: '0-of-3 ✗. Worst-case outcome: all three missed, with LeBron the heartbreaker (0.5 under). +800 reflected a ~1-in-4 hit rate; this slate hit the 3-in-4 outcome.' },
  },
  {
    id: 'r2-g2-may7-trad-chaos',
    slate: 'R2-G2', date: '2026-05-07',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — Road Upset Double (2-Leg)',
    stake: 100, odds: '+1750', payout: 'To Win: $1,750',
    legs: [
      { pick:'CLE ML vs DET', odds:'+136', confidence:'chaos', status:'miss',
        note:'CLE lost 97-107 ✗. Mitchell 31 + Allen 22/7 wasn\'t enough — DET defense + Cade Q4 closing run.' },
      { pick:'LAL ML vs OKC', odds:'+600', confidence:'chaos', status:'miss',
        note:'LAL lost 107-125 ✗. Reaves 31 (the bounce-back leg) hit, but OKC bench + 21 LAL TOs blew it open.' },
    ],
    thesis:'Combined hit rate ~2% per engine. Pure chaos play — $100 risk for $1,750 upside. As designed.',
    result: { outcome: 'loss', delta: '-100', actual: '0-of-2 ✗. Same as 5/6 chaos — favorites swept the slate. Both home teams up 2-0 now in their respective series.' },
  },

  // ─── R2 G3 — ARCHIVED (Fri May 8: NYK-PHI + SAS-MIN) ────────────
  // RELIABLE FLOOR PARLAYS — each leg ≥80% per-leg hit rate.
  // Tonight uses 4 floor structures spanning pts / reb / blocks / assists / spread.
  {
    id: 'r2-g3-may8-floor-star-pts',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'floor', type: 'best-bet',
    name: 'Star Triple Floor — Pts (3-Leg)',
    stake: 100, odds: '+60', payout: 'To Win: ~$60 (verify on DK)',
    legs: [
      { pick:'Brunson Over 19.5 pts (alt line — NYK-PHI G3)', odds:'~-350', confidence:'floor', status:'hit',
        note:'Brunson 33pts (11-22 FG, 38min) — over 19.5 cleared by 13.5pts. Floor confirmed.' },
      { pick:'KAT Over 14.5 pts (alt line — NYK-PHI G3)', odds:'~-300', confidence:'floor', status:'miss',
        note:'KAT 8pts in 26min — passive offensively (focused on glass: 12 reb, 4 OREB). Under 14.5 missed. The "hasn\'t scored under 15" claim broke at the worst time — when he played starter minutes but never looked for shots in PHI\'s perimeter-tight scheme.' },
      { pick:'Wembanyama Over 1.5 blocks (SAS-MIN G3)', odds:'~-300', confidence:'floor', status:'hit',
        note:'Wemby 5 blocks — over 1.5 cleared comfortably. ~95% floor confirmed.' },
    ],
    thesis:'Three pts/blocks legs at deep alt lines, each ≥92% per leg. Math: 0.92 × 0.92 × 0.95 ≈ 80.4% combined. Spans both games and both Eastern stars (Brunson, KAT) plus the West\'s defensive engine (Wemby). Independent legs across different games means correlation risk is minimal.',
    result: { outcome: 'loss', delta: '-100', actual: '2-of-3 ✗. Brunson 33pts ✅, Wemby 5blk ✅, but KAT 8pts in 26min ✗. KAT-as-floor leg lesson: "hasn\'t scored under 15" pattern can break in a low-volume game where the role tilts to playmaker-rebounder rather than scorer. The KAT 4-OREB / 7-AST line shows he played the right game for NYK\'s win — just not the points-volume one the bet needed.' },
  },
  {
    id: 'r2-g3-may8-floor-wemby-twoway',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'floor', type: 'best-bet',
    name: 'Wembanyama Two-Way (2-Leg, Same Game)',
    stake: 100, odds: '+50', payout: 'To Win: ~$50',
    legs: [
      { pick:'Wembanyama Over 12.5 rebounds (SAS-MIN G3)', odds:'-140', confidence:'floor', status:'hit',
        note:'Wemby 15reb — third straight 15-reb game. Cushion held.' },
      { pick:'Wembanyama Over 1.5 blocks (SAS-MIN G3)', odds:'~-300', confidence:'floor', status:'hit',
        note:'Wemby 5 blocks — ~95% floor confirmed across all 3 games.' },
    ],
    thesis:'Same-game compound on Wemby\'s defensive/rebounding dominance. Math: 0.87 × 0.95 ≈ 82.7% combined. Legs are positively correlated (same player, same shift) which technically tightens the joint probability around the player\'s minutes baseline — if he plays 30+min, both hit; if he gets blown out of minutes due to garbage time, both could miss. Lower payout (+50) reflects the correlation, but the floor reliability is genuine.',
    result: { outcome: 'win', delta: '+50', actual: '2-of-2 ✅. Wemby 15reb + 5blk in 39pts/15reb/5blk Kareem-tier line. Counting-stat floor played out exactly as designed.' },
  },
  {
    id: 'r2-g3-may8-floor-multistat',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'floor', type: 'best-bet',
    name: 'Multi-Stat Floor — Ast / Reb / Blk (3-Leg)',
    stake: 100, odds: '+40', payout: 'To Win: ~$40 (verify on DK)',
    legs: [
      { pick:'Brunson Over 3.5 assists (deep alt line — NYK-PHI G3)', odds:'~-450', confidence:'floor', status:'hit',
        note:'Brunson 9 ast — over 3.5 cleared by 5.5. Floor confirmed.' },
      { pick:'Hart Over 4.5 rebounds (NYK-PHI G3)', odds:'~-280', confidence:'floor', status:'hit',
        note:'Hart 11 reb — over 4.5 cleared by 6.5. The "workhorse double-double" floor confirmed.' },
      { pick:'Wembanyama Over 1.5 blocks (SAS-MIN G3)', odds:'~-300', confidence:'floor', status:'hit',
        note:'Wemby 5 blocks — over 1.5 cleared by 3.5.' },
    ],
    thesis:'NEW prop dimensions — assists, rebounds, blocks (no scoring lines). Math: 0.95 × 0.90 × 0.95 ≈ 81.2% combined. Less variance than scoring-driven parlays because counting stats accrue throughout the game and don\'t depend on hot/cold shooting nights. Lower payout (+40) reflects the deeper alt juice.',
    result: { outcome: 'win', delta: '+40', actual: '3-of-3 ✅. The cleanest counting-stat parlay possible — every leg cleared by 3.5+ over the line. The May 6 Randle blowout-cap lesson (use counting stats, not scoring) paid off explicitly.' },
  },
  {
    id: 'r2-g3-may8-floor-spread-stat',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'floor', type: 'best-bet',
    name: 'Deep Spread + Stat Floor (3-Leg)',
    stake: 100, odds: '+50', payout: 'To Win: ~$50 (verify on DK)',
    legs: [
      { pick:'NYK +9.5 (alt spread — NYK-PHI G3)', odds:'~-200', confidence:'floor', status:'hit',
        note:'NYK won by 14 outright — +9.5 covered by 23.5pts. The "win or lose by ≤9" thesis got the strongest possible version (outright road W).' },
      { pick:'Brunson Over 3.5 assists (deep alt — NYK-PHI G3)', odds:'~-450', confidence:'floor', status:'hit',
        note:'Brunson 9 ast — cleared comfortably.' },
      { pick:'Wembanyama Over 1.5 blocks (SAS-MIN G3)', odds:'~-300', confidence:'floor', status:'hit',
        note:'Wemby 5 blocks — cleared comfortably.' },
    ],
    thesis:'Spread-driven parlay using deep alt spread (NYK +9.5) instead of player props. Math: 0.88 × 0.95 × 0.95 ≈ 79.4% combined — just under the 80% threshold but the most game-script-resilient leg structure on the slate (NYK only needs to lose by ≤9 OR win — covers most realistic outcomes). Pairs with two reliable counting-stat legs.',
    result: { outcome: 'win', delta: '+50', actual: '3-of-3 ✅. NYK won the road game outright by 14 — the model edge played out at maximum value. Stat legs cleared cleanly.' },
  },

  // TRADITIONAL (value plays — engine edge but lower floor)
  {
    id: 'r2-g3-may8-trad-nyk-edge',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'traditional', type: 'value',
    name: 'NYK Model Edge (2-Leg)',
    stake: 100, odds: '+220', payout: 'To Win: $220',
    legs: [
      { pick:'NYK ML vs PHI', odds:'+100', confidence:'medium', status:'hit',
        note:'NYK won 108-94. ML +100 cashed. Model edge validated.' },
      { pick:'Brunson Under 26.5 pts (NYK-PHI G3)', odds:'-118', confidence:'medium', status:'miss',
        note:'Brunson 33pts (11-22 FG, 38min) — went the other way. The FT-volume-drop thesis was right structurally (he had ~6 FT) but FG volume jumped (22 attempts) — Brunson hunted his shot rather than facilitating in the clincher spot. Road FT compression alone wasn\'t enough vs aggressive shot-hunting.' },
    ],
    thesis:'Honest combined ~33% hit rate. Both legs are model-edge plays where the market is mispricing — NYK at +100 when model says they\'re the better side, Brunson Under at a road game where the FT volume drop alone is worth 3 points. +220 reflects ~33% combined. Engine-edge value play, not a floor.',
    result: { outcome: 'loss', delta: '-100', actual: '1-of-2 ✗. NYK ML hit ✅, Brunson Under 26.5 missed ✗ (33pts). Cleanest example of the "right thesis, wrong leg pairing" — the ML and the Brunson Under were correlated NEGATIVELY (NYK winning a tight road game often correlates with Brunson going off, not Brunson being limited). Lesson: stacking ML + scorer-Under in the same game double-counts a single thesis.' },
  },
  {
    id: 'r2-g3-may8-trad-chaos-sweep',
    slate: 'R2-G3', date: '2026-05-08',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — Both Road Favorites (2-Leg)',
    stake: 100, odds: '+330', payout: 'To Win: $330',
    legs: [
      { pick:'NYK ML vs PHI', odds:'+100', confidence:'medium', status:'hit',
        note:'NYK 108-94 ✅. Structural edge cashed.' },
      { pick:'SAS ML vs MIN', odds:'-198', confidence:'high', status:'hit',
        note:'SAS 115-108 ✅. Wemby 39/15/5 carried.' },
    ],
    thesis:'Two road games with both road teams favored by the model (NYK by engine edge, SAS by market). Combined ~43%. Cleaner than the chaos slates of 5/6-5/7 because both legs have model conviction. Pays +330 if both road teams win — common scenario in playoff games where home crowd matters less than rest/scheme.',
    result: { outcome: 'win', delta: '+330', actual: '2-of-2 ✅. Both road favorites cashed by 7+ pts. Best return on the slate — model conviction + correlation absent (different games, different conferences) is the right "chaos" structure.' },
  },

  // ─── R2 G3 — TOMORROW (Sat May 9: OKC-LAL + DET-CLE) ─────────────
  // RELIABLE FLOOR PARLAYS — each leg ≥80% per-leg hit rate.
  {
    id: 'r2-g3-may9-floor-okc-core',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'floor', type: 'best-bet',
    name: 'OKC Core Floor (3-Leg, Alt Lines)',
    stake: 100, odds: '+55', payout: 'To Win: ~$55 (verify on DK)',
    legs: [
      { pick:'OKC ML vs LAL (G3)', odds:'-375', confidence:'high', status:'hit',
        note:'OKC 131-108 ✅. Won by 23 — third straight blowout.' },
      { pick:'Holmgren Over 7.5 rebounds (alt line — OKC-LAL G3)', odds:'~-250', confidence:'floor', status:'hit',
        note:'9reb ✅. Cleared 7.5 by 1.5.' },
      { pick:'LeBron Over 21.5 pts (alt line — OKC-LAL G3)', odds:'~-200', confidence:'floor', status:'miss',
        note:'19pts (7-19 FG, 8 ast/6 reb) — facilitator mode at 37min/age 41 in a 23-pt loss. Floor broke when LAL had no second creator (Reaves regressed to 17 from 31).' },
    ],
    thesis:'Same structure as the winning May 7 "OKC Lock + LeBron Floor" parlay (2-of-2 ✓, +$67) but expanded to 3 legs by adding Holmgren rebounds. LeBron\'s scoring independence from OKC blowouts is PROVEN (27, 23 in G1+G2 18-pt losses). Holmgren\'s rebounding is structural (Ayton matchup dominated). Math: 0.80 × 0.87 × 0.89 ≈ 61.9% — below 80% threshold due to 3-leg compound, but each leg individually is floor-grade. Lower payout (+55) reflects the compound risk.',
    result: { outcome:'loss', delta:'-$100', actual:'2-of-3 (OKC ML ✅, Holmgren O7.5 ✅, LeBron O21.5 ❌). The LeBron leg was the soft spot — facilitator-mode at age 41 in a road blowout broke the "scoring is independent" thesis.' },
  },
  {
    id: 'r2-g3-may9-floor-counting-stats',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'floor', type: 'best-bet',
    name: 'Counting Stat Floor (2-Leg)',
    stake: 100, odds: '+40', payout: 'To Win: ~$40 (verify on DK)',
    legs: [
      { pick:'Cade Over 5.5 assists (alt line — DET-CLE G3)', odds:'~-400', confidence:'floor', status:'hit',
        note:'10 ast (also 27pts/10reb triple-double). Cleared 5.5 by 4.5.' },
      { pick:'Holmgren Over 7.5 rebounds (alt line — OKC-LAL G3)', odds:'~-250', confidence:'floor', status:'hit',
        note:'9 reb. Cleared 7.5 by 1.5.' },
    ],
    thesis:'Pure counting-stat parlay — the lesson from May 6 (Randle blowout-cap killed a "floor" scoring prop) applied directly. Assists and rebounds accrue throughout the game regardless of score margin. Both legs cleared in EVERY game this series. Math: 0.93 × 0.87 ≈ 80.9% combined. Clean 80%+ floor.',
    result: { outcome:'win', delta:'+$40', actual:'2-of-2 ✅. Counting-stat thesis validated — assists and rebounds accrue regardless of game script.' },
  },
  {
    id: 'r2-g3-may9-floor-okc-lebron',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'floor', type: 'best-bet',
    name: 'OKC Lock + LeBron Floor (2-Leg)',
    stake: 100, odds: '+50', payout: 'To Win: ~$50 (verify on DK)',
    legs: [
      { pick:'OKC ML vs LAL (G3)', odds:'-375', confidence:'high', status:'hit',
        note:'OKC 131-108 ✅. Won by 23.' },
      { pick:'LeBron Over 21.5 pts (alt line — OKC-LAL G3)', odds:'~-200', confidence:'floor', status:'miss',
        note:'19pts — pivoted to playmaker (8ast/6reb in 37min) when Reaves regressed to 17. Scoring independence broke at age 41 in a 23-pt road loss.' },
    ],
    thesis:'REPEAT of the winning May 7 parlay structure (2-of-2 ✓, +$67). Same thesis: LeBron\'s scoring is INDEPENDENT of OKC blowing them out. He scored 27 and 23 in consecutive 18-pt losses. At home with desperation, he\'ll be even more aggressive. Math: 0.80 × 0.89 ≈ 71.2% — slightly below 80% threshold but proven structure.',
    result: { outcome:'loss', delta:'-$100', actual:'1-of-2 (OKC ML ✅, LeBron O21.5 ❌). Same LeBron leg failure as the 3-leg parlay — scoring independence is real for 1 game but not for 3 straight blowouts at age 41.' },
  },

  // TRADITIONAL (value plays — engine edge, lower combined hit rate)
  {
    id: 'r2-g3-may9-trad-cle-home',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'traditional', type: 'value',
    name: 'CLE Home Stand (2-Leg)',
    stake: 100, odds: '+175', payout: 'To Win: $175',
    legs: [
      { pick:'CLE ML vs DET (G3)', odds:'-175', confidence:'lean', status:'hit',
        note:'CLE 116-109 ✅. Model: CLE by 4 (actual: by 7). HCA + Mitchell rhythm cashed.' },
      { pick:'Mitchell Over 27.5 pts (DET-CLE G3)', odds:'-120', confidence:'medium', status:'hit',
        note:'35pts (13-24, 7-8 FT, 10reb, 4ast) ✅. Cleared by 7.5.' },
    ],
    thesis:'CLE at home is a different team — Mitchell\'s home splits are significantly better. Down 0-2 with maximum desperation + Allen healthy gives CLE their best shot. Combined ~42% hit rate. Engine-edge play, not a floor.',
    result: { outcome:'win', delta:'+$175', actual:'2-of-2 ✅. Best return of the slate — both legs hit cleanly. Mitchell sustained 31-pt G2 form into 35; CLE bench finally outscored DET bench.' },
  },
  {
    id: 'r2-g3-may9-trad-chalk-sweep',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'traditional', type: 'value',
    name: 'Favorites Sweep — OKC + CLE MLs (2-Leg)',
    stake: 100, odds: '+100', payout: 'To Win: $100',
    legs: [
      { pick:'OKC ML vs LAL (G3)', odds:'-375', confidence:'high', status:'hit',
        note:'OKC 131-108 ✅.' },
      { pick:'CLE ML vs DET (G3)', odds:'-175', confidence:'lean', status:'hit',
        note:'CLE 116-109 ✅.' },
    ],
    thesis:'Both favorites per model. OKC\'s structural dominance makes them ~80% even on the road; CLE at home with desperation and Mitchell rhythm is ~62%. Combined ~50% — coin flip at +100 odds. Better value than the May 7 Chalk Sweep (+80) because CLE has stronger model conviction than DET did at -162.',
    result: { outcome:'win', delta:'+$100', actual:'2-of-2 ✅. Both road favorites cashed (OKC away → won by 23; CLE home → won by 7). The 50% combined hit at +100 odds was the right value play.' },
  },
  {
    id: 'r2-g3-may9-trad-chaos',
    slate: 'R2-G3', date: '2026-05-09',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — LAL Home + DET Road Sweep (2-Leg)',
    stake: 100, odds: '+1200', payout: 'To Win: $1,200',
    legs: [
      { pick:'LAL ML vs OKC (G3)', odds:'+295', confidence:'chaos', status:'miss',
        note:'LAL lost by 23 — Reaves regressed to 17, LeBron pivoted to playmaker, OKC bench (A.Mitchell 24, Wallace 16, Joe 12) blew it open. Worst LAL G3 of the series.' },
      { pick:'DET ML vs CLE (G3)', odds:'+145', confidence:'chaos', status:'miss',
        note:'DET lost by 7. Cade triple-double on 10-27 FG / 8 TOs wasn\'t the closer-mode game DET needed; Strus go-ahead steal sealed it for CLE.' },
    ],
    thesis:'~5% combined hit rate. Pure chaos play. LAL at home with LeBron + Reaves healthy is the best version of this team — but they still lost by 18 at their best. DET winning on the road would require Cade Q4 magic + CLE shooting staying broken. $100 for $1,200 upside.',
    result: { outcome:'loss', delta:'-$100', actual:'0-of-2. Both road faves cashed; chaos play correctly priced ~5% and missed at expected rate.' },
  },

  // ─── R2 G4 — ARCHIVED (Sun May 10: NYK-PHI G4 + SAS-MIN G4) ────────────
  // RELIABLE FLOOR PARLAYS — each leg ≥80% per-leg hit rate.
  {
    id: 'r2-g4-may10-floor-wemby-counting',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'floor', type: 'best-bet',
    name: 'Wemby Counting-Stat Floor (2-Leg)',
    stake: 100, odds: '+45', payout: 'To Win: ~$45 (verify on DK)',
    legs: [
      { pick:'Wemby Over 11.5 rebounds (alt — SAS-MIN G4)', odds:'~-300', confidence:'floor', status:'miss',
        note:'15reb in EVERY series game. Counting stat, blowout-proof. Real hit rate ~95%.' },
      { pick:'Wemby Over 2.5 blocks (SAS-MIN G4)', odds:'-140', confidence:'floor', status:'miss',
        note:'12, 5, 5 blocks in series. MIN drives through the lane out of necessity. Real hit rate ~95%.' },
    ],
    thesis:'Pure counting-stat parlay anchored on Wemby. Both legs cleared in EVERY series game. The matchup is structural — MIN has no answer for his length. Math: 0.95 × 0.95 ≈ 90.3% combined. Highest-floor parlay on the slate.',
    result: { outcome: "loss", delta: "-$100", actual: "0-of-2. Wemby ejection (Flagrant 2 elbow to Reid) torpedoed BOTH counting-stat legs in one variance shock. A 95%×95% parlay went to zero on an unpredictable single-incident discipline call." },
  },
  {
    id: 'r2-g4-may10-floor-kat-brunson',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'floor', type: 'best-bet',
    name: 'NYK Star Floor (2-Leg)',
    stake: 100, odds: '+50', payout: 'To Win: ~$50 (verify on DK)',
    legs: [
      { pick:'KAT Over 8.5 rebounds (alt — NYK-PHI G4)', odds:'~-220', confidence:'floor', status:'miss',
        note:'10reb G2, 12reb G3 — PHI C rotation thin (Drummond + Bona + hobbled Embiid). Real hit rate ~85%.' },
      { pick:'Brunson Over 24.5 points (alt — NYK-PHI G4)', odds:'~-220', confidence:'floor', status:'miss',
        note:'Series avg 31.3 ppg (35, 26, 33). Closeout games push star usage UP. Real hit rate ~88%.' },
    ],
    thesis:'NYK star counting-stat floor. KAT rebounding edge is structural (PHI thin C rotation); Brunson scoring is sustained at 31+ in series with PHI defense having no answer for his PnR. Math: 0.85 × 0.88 ≈ 74.8% combined. Slightly below 80% threshold but each leg individually ≥85%.',
    result: { outcome: "loss", delta: "-$100", actual: "0-of-2. NYK won 144-114 in a 3PT variance walkover (25-44 from 3, postseason record). Usage spread to shooters (McBride 7 threes) — star counting-stat legs both fail." },
  },
  {
    id: 'r2-g4-may10-floor-multi-stat',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'floor', type: 'best-bet',
    name: 'Multi-Stat Floor (3-Leg, Alt Lines)',
    stake: 100, odds: '+85', payout: 'To Win: ~$85 (verify on DK)',
    legs: [
      { pick:'Wemby Over 2.5 blocks (SAS-MIN G4)', odds:'-140', confidence:'floor', status:'miss',
        note:'12, 5, 5 blocks. ~95% hit.' },
      { pick:'Wemby Over 11.5 rebounds (alt — SAS-MIN G4)', odds:'~-300', confidence:'floor', status:'miss',
        note:'15 in every game. ~95% hit.' },
      { pick:'KAT Over 8.5 rebounds (alt — NYK-PHI G4)', odds:'~-220', confidence:'floor', status:'miss',
        note:'10, 12 in last two. ~85% hit.' },
    ],
    thesis:'Three-leg counting-stat compound. The slate\'s safest legs combined for higher payout. Math: 0.95 × 0.95 × 0.85 ≈ 76.7% combined. Below 80% combined due to 3-leg compound but each leg individually is floor-grade.',
    result: { outcome: "loss", delta: "-$100", actual: "0-of-3. Worst-case slate for counting-stat compounds — Wemby ejected AND KAT passive on glass on the same night. Independent stat lines correlated downward by two unrelated variance events." },
  },

  // TRADITIONAL (value plays — engine edge, lower combined hit rate)
  {
    id: 'r2-g4-may10-trad-sas-ml-wemby',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'traditional', type: 'best-bet',
    name: 'SAS Lock + Wemby Reb (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: $105',
    legs: [
      { pick:'SAS ML vs MIN (G4)', odds:'-195', confidence:'high', status:'miss',
        note:'Model: SAS by 3 (~65%). G3 win at MIN proved road durability with Wemby in transcendent form.' },
      { pick:'Wemby Over 12.5 rebounds (SAS-MIN G4)', odds:'-140', confidence:'floor', status:'miss',
        note:'15 in every game — 92% hit.' },
    ],
    thesis:'SAS ML at -195 is the model\'s single best edge on the slate; pair with the Wemby rebounding floor (which clears regardless of game outcome). Combined ~60% at +105 payout. Better value than the chalk sweep because SAS spread (-4.5) is too rich.',
    result: { outcome: "loss", delta: "-$100", actual: "0-of-2. Both legs killed by the same Wemby ejection. Model thesis (SAS by 3) was sound; the discipline shock dominated." },
  },
  {
    id: 'r2-g4-may10-trad-nyk-closeout',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'traditional', type: 'value',
    name: 'NYK Closeout — ML + Brunson (2-Leg)',
    stake: 100, odds: '+165', payout: 'To Win: $165',
    legs: [
      { pick:'NYK ML vs PHI (G4)', odds:'-122', confidence:'medium', status:'hit',
        note:'Sweep-cliff closeout. Model ~63% vs market ~55%.' },
      { pick:'Brunson Over 27.5 points (NYK-PHI G4)', odds:'-115', confidence:'high', status:'miss',
        note:'Series avg 31.3 ppg. ~75% hit.' },
    ],
    thesis:'NYK ML + Brunson scoring — both correlated to NYK structural edge. Brunson scoring 28+ usually means NYK wins. Combined ~52% at +165 — solid traditional value play. Better than NYK -1.5 spread because closeout games are notoriously hard to cover.',
    result: { outcome: "loss", delta: "-$100", actual: "1-of-2 (NYK ML hit, Brunson Over missed). Correlation thesis (NYK wins → Brunson 28+) broke because the win came via 3PT variance (McBride 7-of-9), not Brunson playmaking." },
  },
  {
    id: 'r2-g4-may10-trad-chaos',
    slate: 'R2-G4', date: '2026-05-10',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — PHI Backdoor + MIN Home Hold (2-Leg)',
    stake: 50, odds: '+650', payout: 'To Win: $325',
    legs: [
      { pick:'PHI ML vs NYK (G4)', odds:'+102', confidence:'chaos', status:'miss',
        note:'Last home game; Embiid back; Maxey/George 40+min in desperation. Closeout backdoor scenario.' },
      { pick:'MIN ML vs SAS (G4)', odds:'+162', confidence:'chaos', status:'hit',
        note:'Home + Edwards full minutes + Wemby reverts to mean. Down 1-2 desperation game.' },
    ],
    thesis:'~13% combined hit rate. Both home dogs in must-win-or-bust spots. PHI is the more plausible backdoor (closeout games have ~50% home wins for non-sweep dogs). MIN needs a Wemby off-night. Stake reduced to $50 (chaos) for $325 upside.',
    result: { outcome: "loss", delta: "-$50", actual: "1-of-2 (MIN ML hit on the Wemby-ejection variance, PHI ML missed in a blowout). Chaos parlay only pays if BOTH home dogs hit." },
  },

  // ─── R2 G4 — ARCHIVED (Mon May 11: DET-CLE G4 CLE wins 112-103 / OKC-LAL G4 OKC wins 115-110 sweeps) ────────────
  // RELIABLE FLOOR PARLAYS — each leg ≥80% per-leg hit rate.
  {
    id: 'r2-g4-may11-floor-sga-cade',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'floor', type: 'best-bet',
    name: 'Star Volume Floor (2-Leg)',
    stake: 100, odds: '+75', payout: 'To Win: ~$75 (verify on DK)',
    legs: [
      { pick:'SGA Over 30.5 points (OKC-LAL G4)', odds:'-115', confidence:'floor', status:'hit',
        note:'SGA 35pts — closeout mode validated (first 30+ of series after 18/22/23 cruise).' },
      { pick:'Cunningham Over 24.5 points (DET-CLE G4)', odds:'-115', confidence:'floor', status:'miss',
        note:'Cade 19pts (FIRST under-20 in 11 straight playoff games). CLE doubled aggressively, denied closing-Q4 control.' },
    ],
    thesis:'Star volume floor parlay anchored on each game\'s primary creator. SGA in closeout mode (historical 33+ ppg pattern). Cade as DET\'s only consistent shot creator in a series where DET has won 2 of 3 by leaning on his usage. Math: 0.80 × 0.80 ≈ 64.0% combined. Slightly below the strict 80% threshold combined but each leg individually ≥80% — true to the floor category definition.',
    result: { outcome: "loss", delta: "-$100", actual: "1-of-2 (SGA 35 HIT, Cade 19 MISS — first sub-20 in 11 straight playoff games)." },
  },
  {
    id: 'r2-g4-may11-floor-lebron-mitchell',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'floor', type: 'best-bet',
    name: 'Home-Star Floor (2-Leg)',
    stake: 100, odds: '+85', payout: 'To Win: ~$85 (verify on DK)',
    legs: [
      { pick:'LeBron Over 22.5 points (alt — OKC-LAL G4)', odds:'~-180', confidence:'floor', status:'hit',
        note:'LeBron 24/12reb at age 41 — final home playoff game effort, left it all on the court.' },
      { pick:'Mitchell Over 26.5 points (alt — DET-CLE G4)', odds:'~-180', confidence:'floor', status:'hit',
        note:'Mitchell 43pts — 39 in 2H, tied Sleepy Floyd 1987 NBA playoff record. Career playoff high.' },
    ],
    thesis:'Home-star floor parlay. Both stars in must-perform spots at home: LeBron elimination, Mitchell must-protect-home. Alt-line drops to ~22.5 LeBron / 26.5 Mitchell give meaningful cushion below their series median. Math: 0.88 × 0.85 ≈ 74.8% combined.',
    result: { outcome: "win", delta: "+$85", actual: "2-of-2 (LeBron 24, Mitchell 43). Best bet of the slate — Home-Star Floor delivered on both legs with margin to spare." },
  },
  {
    id: 'r2-g4-may11-floor-multi-volume',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'floor', type: 'best-bet',
    name: 'Multi-Volume Floor (3-Leg, Alt Lines)',
    stake: 100, odds: '+135', payout: 'To Win: ~$135 (verify on DK)',
    legs: [
      { pick:'SGA Over 26.5 points (alt — OKC-LAL G4)', odds:'~-280', confidence:'floor', status:'hit',
        note:'SGA 35pts (12-25 FG, 8-9 FT) — closeout-mode volume jump validated.' },
      { pick:'Cunningham Over 22.5 points (alt — DET-CLE G4)', odds:'~-260', confidence:'floor', status:'miss',
        note:'Cade 19pts (7-19 FG, 5 TOs). CLE doubled aggressively, denied closing-Q4 control. Even the alt-22.5 cushion broke.' },
      { pick:'LeBron Over 22.5 points (alt — OKC-LAL G4)', odds:'~-180', confidence:'floor', status:'hit',
        note:'LeBron 24/12reb at age 41 in his final home playoff game of the season.' },
    ],
    thesis:'Three-leg star-volume compound at deep alt lines. Each leg is structurally pushed UP by tonight\'s game context (closeout for SGA, must-win road for Cade, elimination home for LeBron). Math: 0.92 × 0.88 × 0.88 ≈ 71.3% combined. Below 80% combined due to 3-leg compound but each leg individually ≥85% floor-grade.',
    result: { outcome: "loss", delta: "-$100", actual: "2-of-3 (SGA 35 HIT, LeBron 24 HIT, Cade 19 MISS). Cade alt-22.5 floor leg blew up — CLE\'s scheme adjustment + 7-19 FG capped him below the cushion line. Honest retro: when a star\'s usage gets actively schemed against in a closeout context, even \'deep alt floor\' lines aren\'t safe." },
  },

  // TRADITIONAL (value plays — engine edge, lower combined hit rate)
  {
    id: 'r2-g4-may11-trad-lal-cover',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'traditional', type: 'best-bet',
    name: 'LAL Cover + Under (2-Leg)',
    stake: 100, odds: '+265', payout: 'To Win: $265',
    legs: [
      { pick:'LAL +11.5 (OKC-LAL G4)', odds:'-110', confidence:'high', status:'hit',
        note:'OKC won by 5 (115-110) — LAL covered the +11.5 spread comfortably. Engine edge fully validated.' },
      { pick:'Under 214.5 (OKC-LAL G4)', odds:'-110', confidence:'lean', status:'miss',
        note:'Final 225 (OKC 115 + LAL 110) — OVER by 10.5. LAL\'s late desperation rally + OKC\'s Q4 closing pace pushed it over. Anti-correlation with the spread leg — when LAL covers, the total drops in theory; here both teams kept scoring.' },
    ],
    thesis:'<strong>Largest engine edge on the slate.</strong> LAL +11.5 is the single best read tonight — sweep-cliff favorites cover only ~40% ATS as bench rotations eat minutes. Under 214.5 is the correlated leg: if LAL covers, the game is tighter and the total drops to ~205-210 range. Both legs ride the same "OKC eases off / LAL keeps pace" thesis. Math: ~58% × ~55% ≈ 32% combined at +265 = clean +EV.',
    result: { outcome: "loss", delta: "-$100", actual: "1-of-2 (LAL +11.5 HIT comfortably with OKC by 5, Under 214.5 MISS at 225 total). The \'correlated thesis\' broke: LAL covered AND the total went over because both teams kept scoring in a fast-paced Q4. Retro: under-the-spread + LAL-covers correlation assumed slower pace; actual pace stayed high because LAL had to push to keep it close." },
  },
  {
    id: 'r2-g4-may11-trad-det-cle-edge',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'traditional', type: 'value',
    name: 'DET Upset + Cade Volume (2-Leg)',
    stake: 100, odds: '+340', payout: 'To Win: $340',
    legs: [
      { pick:'DET ML vs CLE (G4)', odds:'+140', confidence:'medium', status:'miss',
        note:'CLE 112-103. DET lost by 9 — Mitchell\'s 43pt explosion (39 in 2H, NBA playoff record-tied) was the swing.' },
      { pick:'Cunningham Over 24.5 points (DET-CLE G4)', odds:'-115', confidence:'high', status:'miss',
        note:'Cade 19pts (first under-20 in 11 straight playoffs). CLE\'s schematic adjustment (Mobley primary screen-defender + doubles) capped him.' },
    ],
    thesis:'DET ML at +140 is the second-best value on the slate IF the HCA-flip-retro calibration applies (model has been wrong-direction on home-favored picks in NYK-PHI/SAS-MIN G3s). Cade volume is correlated — if DET wins, Cade is the driver. Combined ~38% at +340 = +EV. Better than DET +3.5 spread because the edge is on outright winning, not covering.',
    result: { outcome: "loss", delta: "-$100", actual: "0-of-2. The HCA-flip retro lesson did NOT apply here — CLE was the home team in G4 and Mitchell\'s tail-event 43 (39 in 2H, tying Sleepy Floyd) was the swing. Both legs went down together — Cade\'s sub-20 was CLE\'s schematic adjustment doing exactly what we feared." },
  },
  {
    id: 'r2-g4-may11-trad-chaos-road-dogs',
    slate: 'R2-G4', date: '2026-05-11',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — DET Upset + LAL Upset (2-Leg)',
    stake: 50, odds: '+1150', payout: 'To Win: $575',
    legs: [
      { pick:'DET ML vs CLE (G4)', odds:'+140', confidence:'chaos', status:'miss',
        note:'CLE 112-103 at home. DET lost by 9 — Mitchell\'s 43 + Q3 deluge sealed it.' },
      { pick:'LAL ML vs OKC (G4)', odds:'+390', confidence:'chaos', status:'miss',
        note:'OKC 115-110 — completed the sweep. LAL fought hard with Reaves 27 + Hachimura 25 + LeBron 24 but bench depth + closeout SGA prevailed.' },
    ],
    thesis:'~13% combined hit rate. Both road/home dogs in spots where the engine sees more upside than the market does. DET upset is plausible (~52% engine); LAL upset is variance (~25% engine). At +1150 a $50 chaos stake returns $575 if both hit. Stake reduced (chaos) to reflect the variance.',
    result: { outcome: "loss", delta: "-$50", actual: "0-of-2. Chaos parlay went down both legs. Both home favorites held serve. Stake was reduced ($50) to reflect the ~13% combined probability — expected outcome on a losing chaos play." },
  },

  // ─── R2 G5 — TONIGHT (Tue May 12: SAS-MIN G5 ONLY) ────────────────────
  // Single-game slate. DET-CLE G5 is tomorrow (Wed 5/13).
  // RELIABLE FLOOR PARLAYS — each leg ≥80% per-leg hit rate.
  {
    id: 'r2-g5-may12-floor-wemby-edwards',
    slate: 'R2-G5', date: '2026-05-12',
    category: 'floor', type: 'best-bet',
    name: 'Star Counting-Stat Floor (2-Leg)',
    stake: 100, odds: '+80', payout: 'To Win: ~$80 (verify on DK)',
    legs: [
      { pick:'Wemby Over 11.5 rebounds (SAS-MIN G5)', odds:'-130', confidence:'floor', status:'hit',
        note:'17 rebounds ✓. Cleared comfortably as the cleanest floor signal in the dataset held.' },
      { pick:'Edwards Over 23.5 points (SAS-MIN G5)', odds:'-115', confidence:'floor', status:'miss',
        note:'20 points ✗. Edwards regressed sharply from G3-G4 32/36 — knee fatigue + foul trouble + Castle perimeter D. The "knee no longer a limiter" thesis was right for G3-G4 but the 5-game stretch caught up to him in a blowout he didn\'t need to play through.' },
    ],
    thesis:'Star counting-stat floor parlay anchored on each team\'s rebound leader (Wemby) and primary scorer (Edwards). Both are at career-floor lines well below their series median. Wemby\'s rebound floor is the cleanest signal in the dataset — he\'s grabbed 15 in every game he\'s played >25min this series. Edwards\' knee is no longer a limiter and the must-win road spot pushes his usage up. Math: 0.92 × 0.88 ≈ 81.0% combined — clears the strict 80% threshold.',
    result: { outcome: 'loss', delta: '-$100', actual: '1-of-2. Edwards leg blowout-capped — same lesson as the May 7 Iron Floor retro (Randle): scoring legs in blowouts are NOT structurally floor-safe even when the player is healthy. Rebound leg held. Counting-stat floor (rebounds/assists) is safer than scoring floor in blowout-risk games.' },
  },
  {
    id: 'r2-g5-may12-floor-wemby-fox-castle',
    slate: 'R2-G5', date: '2026-05-12',
    category: 'floor', type: 'best-bet',
    name: 'SAS Triple-Volume Floor (3-Leg, Alt Lines)',
    stake: 100, odds: '+110', payout: 'To Win: ~$110 (verify on DK)',
    legs: [
      { pick:'Wemby Over 23.5 points (alt — SAS-MIN G5)', odds:'~-200', confidence:'floor', status:'hit',
        note:'27 points ✓ (18 in Q1).' },
      { pick:'Fox Over 16.5 points (alt — SAS-MIN G5)', odds:'~-200', confidence:'floor', status:'hit',
        note:'18 points ✓ (with 5 ast). Cleared comfortably.' },
      { pick:'Castle Over 4.5 assists (alt — SAS-MIN G5)', odds:'~-170', confidence:'floor', status:'hit',
        note:'7 assists ✓. Facilitator role validated.' },
    ],
    thesis:'Three-leg SAS-side volume compound. All three players are home, healthy, and have series-long floor patterns at their respective alt lines. Wemby re-aggression after his first career ejection in a home crowd setting is the highest-EV leg. Castle facilitator volume (5+ assists every game) is structural. Math: 0.88 × 0.88 × 0.92 ≈ 71.3% combined — below 80% combined due to 3-leg compound but each leg individually ≥85% floor-grade.',
    result: { outcome: 'win', delta: '+$110', actual: '3-of-3 legs hit ✓. SAS-side volume compound was the cleanest play of the night. Wemby re-aggression thesis nailed (18 Q1 pts), Fox bounced back, Castle facilitator role held. Best parlay of the slate.' },
  },

  // TRADITIONAL (value plays — engine edge, lower combined hit rate)
  {
    id: 'r2-g5-may12-trad-min-cover',
    slate: 'R2-G5', date: '2026-05-12',
    category: 'traditional', type: 'best-bet',
    name: 'MIN Cover + Edwards Volume (2-Leg)',
    stake: 100, odds: '+285', payout: 'To Win: $285',
    legs: [
      { pick:'MIN +10.5 (SAS-MIN G5)', odds:'-110', confidence:'high', status:'miss',
        note:'SAS won by 29. MIN +10.5 missed by 18.5. The "G2 was the only blowout" thesis was wrong — Wemby post-ejection re-aggression mirrored the G2 bounce-back pattern.' },
      { pick:'Edwards Over 26.5 points (SAS-MIN G5)', odds:'-115', confidence:'high', status:'miss',
        note:'20 points ✗. Sharp regression from G3-G4 32/36 — knee fatigue + foul trouble + SAS Wemby-anchored paint defense. Correlated parlay failed both legs together as expected.' },
    ],
    thesis:'Correlated parlay. The engine edge: market overprices SAS at -10.5 in a series where the only blowout was a G1-anomaly bounce-back (SAS 0-8 → 13-18 from Wemby was variance-driven). Edwards has scored 32 and 36 in his last two games; the line of 26.5 is asking him to regress 7pts from his series median. Combined ~38% at +285 = clean +EV. Math: ~0.58 × 0.65 ≈ 37.7% combined.',
    result: { outcome: 'loss', delta: '-$100', actual: '0-of-2. Correlated parlay went down together — same lesson as G2 retro: post-anomaly home games for top-3 favorites can produce blowouts that no ATS pattern would predict.' },
  },
  {
    id: 'r2-g5-may12-trad-chaos-min-upset',
    slate: 'R2-G5', date: '2026-05-12',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — MIN Upset + Edwards 30+ (2-Leg)',
    stake: 50, odds: '+700', payout: 'To Win: $350',
    legs: [
      { pick:'MIN ML vs SAS (G5)', odds:'+320', confidence:'chaos', status:'miss',
        note:'SAS won 126-97. MIN lost by 29 — no chance of an upset once Wemby went 18-pt Q1.' },
      { pick:'Edwards Over 30.5 points (SAS-MIN G5)', odds:'+125', confidence:'chaos', status:'miss',
        note:'20 points ✗. Correlation held — both legs missed together.' },
    ],
    thesis:'~14% combined hit rate. Pure correlation: MIN upset requires Edwards to dominate. Stake reduced (chaos) to reflect the variance. At +700 a $50 stake returns $350 if both hit. Note: NOT a floor parlay; this is the high-variance lottery ticket.',
    result: { outcome: 'loss', delta: '-$50', actual: '0-of-2. Chaos ticket — expected outcome on a $50 lottery stake. Both legs correlated to MIN upset which never materialized.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G6 — RESOLVED (Fri May 15: SAS-MIN G6 + DET-CLE G6)
  // ═══════════════════════════════════════════════════════════════

  // ─── RELIABLE FLOOR (per-leg ≥80%) ─────────────────────────────
  {
    id: 'r2-g6-may14-floor-wemby-cade-rebs',
    slate: 'R2-G6', date: '2026-05-15',
    category: 'floor', type: 'best-bet',
    name: 'Big Man Rebound Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify on DK)',
    legs: [
      { pick:'Wemby Over 12.5 rebounds (SAS-MIN G6)', odds:'-145', confidence:'floor', status:'miss',
        note:'Wemby 6 reb in 27 min — limited by SAS\'s wire-to-wire blowout (sat much of Q4). Floor signal broke on the blowout side-effect, not on a defensive scheme.' },
      { pick:'Castle Over 5.5 assists (SAS-MIN G6)', odds:'-130', confidence:'floor', status:'hit',
        note:'Castle 6 ast (plus 32 pts / 11 reb closeout masterpiece). Facilitator floor held — barely cleared the line.' },
    ],
    thesis:'Counting-stat floor parlay built off the May 12 retro: scoring legs in blowout-risk games are NOT structurally floor-safe (Edwards 20 last night). Rebound and assist floors are blowout-PROOF (Wemby and Castle play 30+ min regardless of game state). Both legs come from the same team (SAS) so correlated upside: if SAS plays comfortable, Castle racks up assists and Wemby controls boards. Math: 0.92 × 0.85 ≈ 78.2% combined — clears floor discipline once both are above the strict 85% floor individually.',
    result: { outcome: 'loss', delta: '-$100', actual: '1-of-2. Wemby reb floor BROKE because SAS blew them out by 30 — Wemby sat much of Q4 (27 min total). The "blowout-PROOF" framing on rebounds turned out to be wrong: if the blowout is large enough, even rebound floors get capped by minutes. NEW LESSON for the retro pile: rebound floors are bench-PROOF, but they ARE blowout-proof only if minutes hold; in a 34-pt blowout, the star\'s minutes drop and the rebound rate doesn\'t scale.' },
  },
  {
    id: 'r2-g6-may14-floor-edwards-randle-pts',
    slate: 'R2-G6', date: '2026-05-15',
    category: 'floor', type: 'best-bet',
    name: 'MIN Must-Win Volume Floor (2-Leg)',
    stake: 100, odds: '+130', payout: 'To Win: ~$130 (verify on DK)',
    legs: [
      { pick:'Edwards Over 22.5 points (alt — SAS-MIN G6)', odds:'-180', confidence:'floor', status:'hit',
        note:'Edwards 24 pts on 9-of-26 FG (3-of-12 3PT). Cleared the alt line by 1.5 — Castle perimeter D destroyed efficiency but volume came.' },
      { pick:'Randle Over 14.5 points (alt — SAS-MIN G6)', odds:'-200', confidence:'floor', status:'miss',
        note:'Randle 2 pts on 1-of-9 FG — Randle + Gobert COMBINED 3 pts on 1-of-12 in elimination. CATASTROPHIC interior collapse. Phase 59 "Randle suppressed by Wemby paint presence" compoundScenario validated yet again — sixth time in series at 12pts-or-fewer.' },
    ],
    thesis:'MIN-side scoring floor in must-win elimination. Edwards usage spikes in elimination, Randle gets his usual 12-18min stretches but at home with desperation, the volume climbs. Both lines are 2-3 pts below their series median. Math: 0.85 × 0.88 ≈ 74.8% combined — below 80% combined but each leg individually clears 85% floor-grade. Note: HONESTLY documenting the combined drop per May 7 lesson.',
    result: { outcome: 'loss', delta: '-$100', actual: '1-of-2. Edwards floor held (24/25 against the 22.5 alt). Randle floor SHATTERED by Wemby paint defense — 2 pts on 1-of-9. The "Randle 14.5 floor in must-win at home" thesis was wrong; Wemby\'s paint gravity made interior scoring structurally unviable for the SIXTH game in a row (his floors: 21, 12, 12, 12, 17, 2). Floor parlay discipline failure: any series where one player has gone sub-12 in 4-of-5 games should not have that player as a floor leg, regardless of "home + desperation" framing.' },
  },

  // ─── DET-CLE G6 (Fri 5/15) — counted in tomorrow\'s P&L ────────
  {
    id: 'r2-g6-may15-floor-cle-volume',
    slate: 'R2-G6', date: '2026-05-15',
    category: 'floor', type: 'best-bet',
    name: 'CLE Closeout Volume Floor (3-Leg)',
    stake: 100, odds: '+140', payout: 'To Win: ~$140 (verify on DK)',
    legs: [
      { pick:'Mobley Over 6.5 rebounds (alt — DET-CLE G6)', odds:'-200', confidence:'floor', status:'hit',
        note:'Mobley 8 reb (also 18pts/8ast — near triple-double). Floor cleared.' },
      { pick:'Mitchell Over 22.5 points (alt — DET-CLE G6)', odds:'-200', confidence:'floor', status:'miss',
        note:'Mitchell 18 pts on 7-of-19 FG — sub-Mitchell night. DET\'s defensive scheme held CLE to 41% FG team-wide; the "closeout at home" framing broke when CLE lost its home fortress status. 4.5 short of the alt line.' },
      { pick:'Allen Over 5.5 rebounds (alt — DET-CLE G6)', odds:'-220', confidence:'floor', status:'hit',
        note:'Allen 7 reb (with 10 pts). Cleared the line; Allen-rebound floor held even in the loss.' },
    ],
    thesis:'CLE structural floor parlay anchored on the three CLE players with the cleanest counting-stat floors. All home + closeout-favorable. Math: 0.9 × 0.9 × 0.92 ≈ 74.5% combined — each leg ≥90% individually clears floor discipline.',
    result: { outcome: 'loss', delta: '-$100', actual: '2-of-3. Mobley + Allen rebound floors held (the structural rebound thesis on CLE bigs is real). Mitchell pts floor SHATTERED because DET\'s defensive scheme actually held — the "Mitchell 22.5 at home in closeout" thesis assumed CLE\'s offensive ceiling would scale; instead DET held CLE to 41% FG. Floor parlay lesson: scoring floors are fragile when the OPPOSING defense locks in. Counting-stat floors (rebounds) are blowout-proof in the OTHER direction (CLE losing didn\'t affect Mobley/Allen reb production).' },
  },

  // ─── TRADITIONAL (value plays — engine edge, lower combined hit rate)
  {
    id: 'r2-g6-may14-trad-sas-cover',
    slate: 'R2-G6', date: '2026-05-15',
    category: 'traditional', type: 'best-bet',
    name: 'SAS Spread + Wemby Rebound (2-Leg)',
    stake: 100, odds: '+180', payout: 'To Win: $180',
    legs: [
      { pick:'SAS +2.5 (SAS-MIN G6)', odds:'-110', confidence:'high', status:'hit',
        note:'SAS won outright by 30 — covered the +2.5 by 32.5.' },
      { pick:'Wemby Over 12.5 rebounds (SAS-MIN G6)', odds:'-145', confidence:'high', status:'miss',
        note:'Wemby 6 reb in 27 min — limited by SAS\'s blowout. The "15+ floor" thesis broke on the blowout side-effect.' },
    ],
    thesis:'Engine + floor combination. Engine sees MIN by 2 (slight HCA lean) — SAS +2.5 is a half-pt hook play with EV. Wemby reb floor is structural. Math: ~0.52 × 0.92 ≈ 47.8% combined at +180. Clean +EV.',
    result: { outcome: 'loss', delta: '-$100', actual: '1-of-2. SAS spread leg HIT massively (won outright by 30). Wemby reb leg MISSED because the blowout limited his Q4 minutes. Same blowout-vs-reb-floor lesson as the Big Man Rebound parlay above.' },
  },
  {
    id: 'r2-g6-may14-trad-chaos-sas-closeout',
    slate: 'R2-G6', date: '2026-05-15',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — SAS Closeout + Wemby 25+ (2-Leg)',
    stake: 50, odds: '+450', payout: 'To Win: $225',
    legs: [
      { pick:'SAS ML vs MIN (G6)', odds:'+150', confidence:'chaos', status:'hit',
        note:'SAS won 139-109. Road dog at +150 cashed; chaos-bet structural pick proved correct.' },
      { pick:'Wemby Over 25.5 points (SAS-MIN G6)', odds:'+115', confidence:'chaos', status:'miss',
        note:'Wemby 19 pts in 27 min — limited by blowout (sat much of Q4). Castle had the closeout night (32 pts) instead.' },
    ],
    thesis:'~18% combined hit rate. SAS closeout WCF + Wemby tail-event. Stake reduced (chaos) to reflect variance. At +450 a $50 stake returns $225 if both hit.',
    result: { outcome: 'loss', delta: '-$50', actual: '1-of-2 on a chaos ticket. SAS ML hit (the structural call), Wemby 25+ missed (the variance call). At +450 the chaos return required both — the variance leg failed because Castle ate Wemby\'s minutes/usage. Expected outcome on a $50 chaos stake.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // R2 G7 — SUN MAY 17: DET-CLE G7 at LCA (winner advances to ECF vs NYK)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'r2-g7-may17-floor-cade-duren-volume',
    slate: 'R2-G7', date: '2026-05-17',
    category: 'floor', type: 'best-bet',
    name: 'DET Home G7 Volume Floor (2-Leg) — REDUCED STAKE',
    stake: 50, odds: '+115', payout: 'To Win: ~$58 (verify on DK)',
    legs: [
      { pick:'Cade Over 21.5 points (alt — DET-CLE G7)', odds:'-180', confidence:'floor', status:'miss',
        note:'Phase 71c projection: 27.9pts. Line 21.5 = proj−6.4 (DEEPER than the 70%-calibrated alt-line zone of proj−5). Audit shows deep alts clear at 70%+. Series scoring 23, 25, 27, 19, 39, 21 confirms. ACTUAL: 13pts on 5-16 FG / 0-7 3PT — career-worst playoff game. CLE switch-everything + early double on Cade collapsed his ceiling.' },
      { pick:'Duren Over 7.5 rebounds (alt — DET-CLE G7)', odds:'-200', confidence:'floor', status:'hit',
        note:'Phase 71c projection: 8.8 reb (down from pre-fix 9.8 — Duren was over-predicted residual +6.2pp post-tier). Line 7.5 = proj−1.3, just inside calibrated zone. Series rebs all in 7-11 range. ACTUAL: 9 reb — cleared by 1.5.' },
    ],
    thesis:'Two counting-stat floors. Math: 0.85 × 0.78 ≈ 66% combined (more honest with Phase 71c Duren correction). STAKE REDUCED from $100 → $50: G7 elimination context has 50% winner accuracy in audit; concentration risk on one game means a single bad outcome wipes 5% of bankroll. Pre-Phase-71 stake was bigger than the model evidence supports.',
    result: { outcome:'loss', delta:'-$50', actual:'Cade O21.5 MISSED (13pts — career-worst), Duren O7.5 HIT (9 reb). Stake reduction limited blast radius. Phase 71 G7-cap discipline validated.' },
  },
  {
    id: 'r2-g7-may17-floor-cle-veterans',
    slate: 'R2-G7', date: '2026-05-17',
    category: 'floor', type: 'best-bet',
    name: 'CLE Star Volume Floor (2-Leg) — REDUCED STAKE',
    stake: 50, odds: '+120', payout: 'To Win: ~$60 (verify on DK)',
    legs: [
      { pick:'Mitchell Over 21.5 points (alt — DET-CLE G7)', odds:'-180', confidence:'floor', status:'hit',
        note:'Engine projection: 25.3pts. Line 21.5 = proj−3.8 (well within 70%-calibrated alt-line zone). Series scoring 23, 31, 35, 43, 21, 18 supports floor. Mitchell not in per-player override table — engine projection trusted. ACTUAL: 26pts in 31min — cleared by 4.5.' },
      { pick:'Mobley Over 6.5 rebounds (alt — DET-CLE G7)', odds:'-220', confidence:'floor', status:'hit',
        note:'Engine projection: 8.0 reb. Line 6.5 = proj−1.5 (calibrated zone). Series rebs all in 6-9 range. Road G7 = 35+ min minimum. ACTUAL: 12 reb — cleared by 5.5 (double-double).' },
    ],
    thesis:'CLE-side floor at deep alt lines. Math: 0.80 × 0.85 ≈ 68% combined. STAKE REDUCED $100 → $50 per G7 discipline (50% winner accuracy in audit). Each leg individually clears floor discipline; combined isn\'t at the 80% reliable threshold so this is honest "lean reliable" not "lock."',
    result: { outcome:'win', delta:'+$60', actual:'Both legs HIT — Mitchell 26pts, Mobley 12 reb. Floor parlay payout to win ~$60 at +120 (verify on DK ticket). The CLE-road-G7-blowout was the model\'s wrong-winner call, but the deep alt floor anchored on counting stats still cashed.' },
  },
  // REMOVED Phase 71: "DET -3.5 + Cade O27.5" traditional parlay.
  // Both legs hit SKIP/coin-flip in the framework:
  //   DET -3.5: spread cell DOWNGRADED to CAUTION (Phase 71 — margin
  //     MAE 12.94pt = no real spread edge); G7 cap reinforces.
  //   Cade O27.5: high×prop = SKIP cross-tab cell. New Phase 71c
  //     projection 27.9pts = the LINE is at the engine's central
  //     estimate → coin flip, not edge.
  // Adding more legs to compensate would amplify the underlying noise,
  // not reduce it. Discipline: refuse to ship a parlay neither leg of
  // which the framework supports.
  {
    id: 'r2-g7-may17-trad-chaos-cle-road',
    slate: 'R2-G7', date: '2026-05-17',
    category: 'traditional', type: 'chaos',
    name: 'Chaos — CLE Road G7 + Mitchell 30+ (2-Leg)',
    stake: 50, odds: '+650', payout: 'To Win: $325',
    legs: [
      { pick:'CLE ML vs DET (G7)', odds:'+150', confidence:'chaos', status:'hit',
        note:'Road dog G7 at +150 (~40% implied). Engine ~46% CLE win — slight value play. ACTUAL: CLE 125, DET 94 — road blowout, 31pt margin. Half the parlay hit; the other half (Mitchell 30+) was a tail-event ask.' },
      { pick:'Mitchell Over 29.5 points (DET-CLE G7)', odds:'+150', confidence:'chaos', status:'miss',
        note:'Series scoring high 43 (G4). Road G7 hostile-environment hero spot. Sub-Mitchell G6 (18) is the bounce-back primer. ACTUAL: 26pts (only 31min in a blowout) — UNDER 29.5 by 3.5. Mitchell didn\'t need 30+ because CLE blew it out.' },
    ],
    thesis:'~13% combined hit rate. CLE road G7 upset + Mitchell tail-event. Stake reduced (chaos) to reflect variance. At +650 a $50 stake returns $325 if both hit. Correlated: CLE road win likely requires Mitchell 30+.',
    result: { outcome:'loss', delta:'-$50', actual:'CLE ML HIT (road blowout) but Mitchell 30+ MISSED at 26pts (31min in a blowout). Correlation thesis broke — CLE won by 31 without needing Mitchell tail-event. -$50.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF G1 — MON MAY 18: WCF SAS @ OKC at Paycom Center
  // OKC -6.5 / total 219.5. Defending champ vs Wemby. Reg-season: SAS 4-1.
  // CF tab UI is not yet wired — these parlays surface on the Home page
  // Featured Parlays section (the parlay renderer doesn't require a
  // SERIES_DATA lookup). Bets page R3 tab will land in a follow-up phase.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cf-g1-may18-floor-okc-stars',
    slate: 'CF-G1', date: '2026-05-18',
    category: 'floor', type: 'best-bet',
    name: 'WCF G1 — OKC Stars Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify on DK)',
    legs: [
      { pick:'SGA Over 22.5 points (alt — WCF G1)', odds:'-280', confidence:'floor', status:'hit',
        note:'SGA 24pts (7-23 FG) — cleared by 1.5 in 49+min of 2OT. Cut close but held.' },
      { pick:'Holmgren Over 6.5 rebounds (alt — WCF G1)', odds:'-220', confidence:'floor', status:'hit',
        note:'Holmgren 8 reb. Wemby drew Holmgren into rebound battles all night; the alt threshold was comfortable.' },
    ],
    thesis:'OKC stars at home in G1 of a series they\'re favored to win. Math: 0.88 × 0.85 ≈ 75% combined (just below the 80% Reliable threshold so this is "lean reliable" not lock). Stake $100 reflects medium confidence (CF G1 historical accuracy ~67% per Phase 17). SGA + Holmgren are the structural pillars; both need to function for OKC to cover -6.5.',
    result: { outcome:'win', delta:'+$105', actual:'Both alts cleared despite OKC losing the game outright. SGA scored 24 (line 22.5), Holmgren 8 reb (line 6.5). The 2-leg Reliable Floor structure paid even though the OKC chalk thesis collapsed — exactly the point of the dual-pillar framing.' },
  },
  {
    id: 'cf-g1-may18-floor-wemby-anchor',
    slate: 'CF-G1', date: '2026-05-18',
    category: 'floor', type: 'best-bet',
    name: 'WCF G1 — Wemby + Castle Counting-Stat Floor (2-Leg)',
    stake: 100, odds: '+125', payout: 'To Win: ~$125 (verify on DK)',
    legs: [
      { pick:'Wembanyama Over 8.5 rebounds (alt — WCF G1)', odds:'-220', confidence:'floor', status:'hit',
        note:'Wemby 24 rebounds (playoff career high) — cleared by 15. Drive-and-kick miss volume thesis worked exactly as authored.' },
      { pick:'Castle Over 14.5 points (alt — WCF G1)', odds:'-180', confidence:'floor', status:'hit',
        note:'Castle 17pts — cleared by 2.5. Third-creator role held even in a Wemby-centric scoring night.' },
    ],
    thesis:'SAS-side floor. Math: 0.85 × 0.80 ≈ 68% combined — honest "lean reliable" tier (not 80% lock). The SAS upset path runs through Wemby controlling the glass + Castle scoring 17+ as third creator. Both legs cleared 80%+ across R2 individually. Stake $100.',
    result: { outcome:'win', delta:'+$125', actual:'Both legs hit comfortably; the SAS upset path thesis matched reality. Wemby 24 reb cleared 8.5 by 15; Castle 17 pts cleared 14.5 by 2.5. The lean-reliable framing was right.' },
  },
  {
    id: 'cf-g1-may18-trad-okc-chalk',
    slate: 'CF-G1', date: '2026-05-18',
    category: 'traditional', type: 'best-bet',
    name: 'WCF G1 — OKC Chalk Stack (3-Leg)',
    stake: 50, odds: '+285', payout: 'To Win: ~$142',
    legs: [
      { pick:'OKC ML vs SAS (WCF G1)', odds:'-260', confidence:'high', status:'miss',
        note:'SAS 122-115 (2OT). The 4-1 reg-season pattern held — SAS stole HCA. Phase 71 prediction that "high × ml" was the better label vs "lean × ml" still has data accumulating.' },
      { pick:'SGA Over 27.5 points (WCF G1)', odds:'-130', confidence:'high', status:'miss',
        note:'SGA 24pts on 7-23 FG. Castle/Harper hounded him at POA; only 30% from the field through 49+min. The "Castle isn\'t Wemby" thesis missed that Castle himself is an elite POA defender.' },
      { pick:'OKC -6.5 (WCF G1)', odds:'-110', confidence:'medium', status:'miss',
        note:'SAS won outright by 7 — covered by 13.5. Spread cell continues to be the worst single-leg bucket per Phase 71.' },
    ],
    thesis:'Three correlated OKC legs. Math: 0.72 × 0.65 × 0.55 ≈ 26% combined (Phase 71 calibrated, raw MC would say higher). At +285 payout, 26% true hit gives positive EV. Stake $50 (chaos/traditional discipline at CF G1 unknown-territory cap).',
    result: { outcome:'loss', delta:'-$50', actual:'All three legs missed. SAS 122-115 (2OT) blew up the correlated OKC chalk thesis. The 4-1 reg-season SAS record was the lurking signal we underweighted; the season series mattered more than the playoff rest gap.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF G1 — TUE MAY 19: ECF CLE @ NYK at MSG
  // NYK -7.5 / total 215.5. NYK swept PHI 4-0 (rested 9 days); CLE
  // beat DET 4-3 in G7 road blowout (1 day rest, MSG turnaround).
  // The rest gap (9 vs 1) is the dominant ECF G1 variable.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ecf-g1-may19-floor-nyk-stars',
    slate: 'CF-G1', date: '2026-05-19',
    category: 'floor', type: 'best-bet',
    name: 'ECF G1 — NYK Stars Floor (2-Leg)',
    stake: 100, odds: '+115', payout: 'To Win: ~$115 (verify on DK)',
    legs: [
      { pick:'Brunson Over 19.5 points (alt — ECF G1)', odds:'-260', confidence:'floor', status:'hit',
        note:'Brunson 38 — drove the 22pt comeback. Cleared deep alt by 18.5.' },
      { pick:'KAT Over 7.5 rebounds (alt — ECF G1)', odds:'-200', confidence:'floor', status:'hit',
        note:'KAT 13reb — CLE twin-big produced exactly the rebound volume thesis predicted.' },
    ],
    thesis:'NYK at home with 9 days rest. Math: 0.88 × 0.82 ≈ 72% combined — honest lean-reliable. The Phase 71 STARTER tier correction (-2pp PTS) was applied to Brunson but he still cleared 19.5 easily even with the haircut — deep alt threshold absorbs the bias correction. KAT is in the calibrated bucket so no override active.',
    result: { outcome:'win', delta:'+$115', actual:'Both deep-alt legs hit comfortably; floor logic vindicated even with the 22pt comeback drama.' },
  },
  {
    id: 'ecf-g1-may19-floor-mitchell-mobley',
    slate: 'CF-G1', date: '2026-05-19',
    category: 'floor', type: 'best-bet',
    name: 'ECF G1 — CLE Stars Counting-Stat Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify on DK)',
    legs: [
      { pick:'Mitchell Over 19.5 points (alt — ECF G1)', odds:'-280', confidence:'floor', status:'hit',
        note:'Mitchell 29 — cleared even with the 1-of-6 Q4+OT freeze.' },
      { pick:'Mobley Over 7.5 rebounds (alt — ECF G1)', odds:'-220', confidence:'floor', status:'hit',
        note:'Mobley 14reb/15pts/3blk — KAT matchup drove rebound volume as projected.' },
    ],
    thesis:'CLE side. Math: 0.84 × 0.78 ≈ 65% combined — slim-side lean reliable. The one-day rest is the structural risk (Mitchell legs after G7); 31min in a blowout mitigates that. Mobley\'s rebound floor is the more reliable of the two legs. Stake $100.',
    result: { outcome:'win', delta:'+$105', actual:'Both legs hit despite CLE losing the game — separates leg-level floor from outcome-level risk. The floor logic worked.' },
  },
  {
    id: 'ecf-g1-may19-trad-nyk-rest',
    slate: 'CF-G1', date: '2026-05-19',
    category: 'traditional', type: 'best-bet',
    name: 'ECF G1 — NYK Rest Advantage Stack (3-Leg)',
    stake: 50, odds: '+340', payout: 'To Win: ~$170',
    legs: [
      { pick:'NYK ML vs CLE (ECF G1)', odds:'-265', confidence:'medium', status:'hit',
        note:'NYK 115-104 OT — comeback ML hit.' },
      { pick:'Brunson Over 26.5 points (ECF G1)', odds:'-115', confidence:'medium', status:'hit',
        note:'Brunson 38 — cleared by 11.5.' },
      { pick:'Under 215.5 total (ECF G1)', odds:'-110', confidence:'lean', status:'miss',
        note:'219 total (OT). Regulation 99-99 = 198 (would have hit); OT pushed it over by 3.5.' },
    ],
    thesis:'Three correlated NYK-favorable legs. Math: 0.62 × 0.58 × 0.55 ≈ 20% combined (Phase 71 calibrated). At +340 payout, 20% true hit is +EV. Stake $50 (CF unknown-territory cap).',
    result: { outcome:'loss', delta:'-$50', actual:'Under leg lost on OT — regulation would have pushed/won under but the 5min OT killed the parlay. Two legs hit; the third killed it. Phase 71 SKIP-on-total guidance was the right read.' },
  },

  // Phase 72 deduplication: my "Bigs Rebounding Floor" + "OKC + Wemby
  // Volume" parlays overlapped with the 3 cf-g1-may18-* parlays above
  // (which author both an OKC-stars floor AND a SAS-side floor AND a
  // 3-leg chalk stack). User's parlays are more comprehensive.

  // ═══════════════════════════════════════════════════════════════
  // CF G3 — FRI MAY 22: WCF OKC @ SAS at Frost Bank Center
  // SAS home after 1-1 split. Wemby home court energy + Castle's POA
  // defense vs SGA are the structural drivers. CF unknown-territory
  // cap on stakes ($100 floor / $50 trad).
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'wcf-g3-may22-floor-wemby-castle',
    slate: 'CF-G3', date: '2026-05-22',
    category: 'floor', type: 'best-bet',
    name: 'WCF G3 — SAS Stars Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify on DK)',
    legs: [
      { pick:'Wembanyama Over 18.5 points (alt — WCF G3)', odds:'-280', confidence:'floor', status:'hit',
        note:'Wemby 26pts (8-15 FG) — clear. Series 41 + 21 → 31 avg; G3 dropped to 26 but well clear of 18.5.' },
      { pick:'Wembanyama Over 11.5 rebounds (alt — WCF G3)', odds:'-200', confidence:'floor', status:'miss',
        note:'Wemby 4 reb — first time the deep-alt-REB floor missed all playoffs. OKC gameplanned to box him out tag-team style; SAS had no secondary rebounders.' },
    ],
    thesis:'Two Wemby legs at home. Math: 0.90 × 0.86 ≈ 77% combined — reliable floor. Deep alt thresholds absorb the ELITE-tier PTS correction (-2.6) and the calibrated REB. Single-player stack accepted at this confidence level (Wemby is structurally the engine of this team). CF stake cap $100.',
    result: { outcome:'loss', delta:'-$100', actual:'Wemby 26pts/4reb — PTS hit, REB missed (deep alt-REB floor fell for the first time all playoffs; OKC double-boxed)' },
  },
  {
    id: 'wcf-g3-may22-floor-sga-castle',
    slate: 'CF-G3', date: '2026-05-22',
    category: 'floor', type: 'best-bet',
    name: 'WCF G3 — Counter-Side Floor (SGA + Castle)',
    stake: 100, odds: '+110', payout: 'To Win: ~$110 (verify on DK)',
    legs: [
      { pick:'SGA Over 19.5 points (alt — WCF G3)', odds:'-260', confidence:'floor', status:'hit',
        note:'SGA 26pts — clear. Bounce-back game after Castle had injury fatigue. Castle was clearly not the same defender, opened the matchup.' },
      { pick:'Castle Over 5.5 assists (alt — WCF G3)', odds:'-200', confidence:'floor', status:'hit',
        note:'Castle 6 ast — barely clears (one over the line). Castle scoring fell off (only 13pts) but his playmaking still ticked the line.' },
    ],
    thesis:'Counter-side floor — covers OKC ML upside + SAS depth. Math: 0.85 × 0.88 ≈ 75% combined. SGA leg is the structural risk: Phase 71c override drags the projection to 20.1 vs line 19.5 — razor edge. Castle assists is the calibrated leg. Stake $100.',
    result: { outcome:'win', delta:'+$110', actual:'SGA 26pts ✓ / Castle 6 ast ✓ (cleared 5.5 by one) — both hits, +$110 net' },
  },
  {
    id: 'wcf-g3-may22-trad-sas-home',
    slate: 'CF-G3', date: '2026-05-22',
    category: 'traditional', type: 'best-bet',
    name: 'WCF G3 — SAS Home Stack (3-Leg)',
    stake: 50, odds: '+360', payout: 'To Win: ~$180',
    legs: [
      { pick:'SAS ML vs OKC (WCF G3)', odds:'-125', confidence:'medium', status:'miss',
        note:'OKC won 123-108 — clear miss. SAS started 15-0 but couldn\'t hold against the 76-pt OKC bench output.' },
      { pick:'Wembanyama Over 25.5 points (WCF G3)', odds:'-115', confidence:'medium', status:'hit',
        note:'Wemby 26pts on 8-15 FG — squeaked over the line by 0.5.' },
      { pick:'Castle Over 19.5 points (WCF G3)', odds:'-110', confidence:'medium', status:'miss',
        note:'Castle 13pts — Wed contact + OKC defense gutted his scoring; he had 25 in G2 but couldn\'t replicate.' },
    ],
    thesis:'Three correlated SAS-favorable legs. Math: 0.55 × 0.60 × 0.55 ≈ 18% combined. At +360 payout, 18% true hit is +EV. Stake $50 (CF cap).',
    result: { outcome:'loss', delta:'-$50', actual:'ML miss (OKC won) + Castle 13pts (under 19.5) — only Wemby leg hit. Stack failed.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF G3 — SAT MAY 23: ECF NYK @ CLE at Rocket Arena (next-day)
  // CLE down 0-2 facing must-win at home. Author tonight so the slate
  // is ready when CHS Lab + market open tomorrow morning.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ecf-g3-may23-floor-mitchell-mobley',
    slate: 'CF-G3', date: '2026-05-23',
    category: 'floor', type: 'best-bet',
    name: 'ECF G3 — CLE Stars Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify on DK)',
    legs: [
      { pick:'Mitchell Over 19.5 points (alt — ECF G3)', odds:'-280', confidence:'floor', status:'hit',
        note:'Mitchell 23pts — cleared by 3.5 on 9-21 FG. Volume held even with the efficiency drop.' },
      { pick:'Mobley Over 7.5 rebounds (alt — ECF G3)', odds:'-220', confidence:'floor', status:'miss',
        note:'Mobley 6reb — missed by 1.5. Allen back at full 36min shrank the rebound share exactly as the 5/23 MC re-validation flagged.' },
    ],
    thesis:'CLE-desperation home stack. <strong>5/23 MC re-validation:</strong> 0.87 × 0.70 = 0.61 combined — under the 80% floor threshold. Mitchell-over leg is solid floor (engine 31.6 vs deep alt 19.5); Mobley leg is too close to engine projection (9.0) to qualify as floor. Treat as a TRADITIONAL-style parlay at the "floor" label rather than a true reliable floor. CLE-side correlated thesis still holds: Mitchell volume + Mobley defensive REB share both correlate with CLE controlling the game. Recommended: trim stake or swap Mobley leg to Over 5.5 reb (~88% over).',
    result: { outcome:'loss', delta:'-$100', actual:'Mitchell 23pts ✓ / Mobley 6reb ✗ — Mobley leg missed by 1.5. The 5/23 MC re-validation correctly flagged this leg as <80% and recommended swap to 5.5 alt. Listened to the framework? Should have swapped. Confirmation cost.' },
  },
  {
    id: 'ecf-g3-may23-floor-brunson-kat',
    slate: 'CF-G3', date: '2026-05-23',
    category: 'floor', type: 'best-bet',
    name: 'ECF G3 — NYK Counter-Side Floor (2-Leg)',
    stake: 100, odds: '+115', payout: 'To Win: ~$115 (verify on DK)',
    legs: [
      { pick:'Brunson Over 17.5 points (alt — ECF G3)', odds:'-260', confidence:'floor', status:'hit',
        note:'Brunson 30pts on 10-19 FG / 10-12 FT — cleared by 12.5. Deep alt floor exactly as designed.' },
      { pick:'KAT Over 7.5 rebounds (alt — ECF G3)', odds:'-220', confidence:'floor', status:'hit',
        note:'KAT 8reb — just cleared by 0.5. Mobley twin-big matchup held tight; KAT 7-asst facilitator night meant fewer board chances, but enough to clear.' },
    ],
    thesis:'Counter-side hedge. Math: 0.88 × 0.85 ≈ 75% combined. Deep alt absorbs the facilitator-mode variability of G2 Brunson.',
    result: { outcome:'win', delta:'+$115', actual:'Brunson 30pts ✓ / KAT 8reb ✓ (cleared by 0.5) — both hits, +$115 net. Deep-alt-points floor discipline continues to cash even in narrow REB margins.' },
  },
  {
    id: 'ecf-g3-may23-trad-cle-desperation',
    slate: 'CF-G3', date: '2026-05-23',
    category: 'traditional', type: 'best-bet',
    name: 'ECF G3 — CLE Desperation Home Stack (3-Leg)',
    stake: 50, odds: '+320', payout: 'To Win: ~$160',
    legs: [
      { pick:'CLE ML vs NYK (ECF G3)', odds:'-140', confidence:'medium', status:'miss',
        note:'NYK won 121-108. Down-0-2-home prior + B2B fatigue thesis didn\'t hold.' },
      { pick:'Mitchell Over 27.5 points (ECF G3)', odds:'-115', confidence:'medium', status:'miss',
        note:'Mitchell 23pts on 9-21 FG — under 27.5 by 4.5. NYK switching scheme capped efficiency.' },
      { pick:'Mobley Over 9.5 rebounds (ECF G3)', odds:'-130', confidence:'medium', status:'miss',
        note:'Mobley 6reb — under 9.5 by 3.5. Allen back at full 36min crushed share, exactly as the coin-flip flag predicted.' },
    ],
    thesis:'CLE desperation stack. <strong>5/23 MC re-validation:</strong> ~0.55 × ~0.65 × ~0.50 ≈ 18% combined (closer to authoring claim of 22%; first reconcile pass showed lower 8% because MC mean drifts ~15% below calcExpectedPlayerStats for stars — known issue). At +320 payout, 18-22% range is breakeven-to-marginal-EV. Mobley leg is the weak link; swap to 7.5 reb alt if available. Stake $50 (CF cap).',
    result: { outcome:'loss', delta:'-$50', actual:'All 3 legs missed (CLE ML / Mitchell O27.5 / Mobley O9.5). Stack failed comprehensively — same retro as the floor parlay\'s Mobley leg, and the 5/23 re-validation called this stack -EV.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF G4 — SUN MAY 24: WCF OKC @ SAS at Frost Bank Center
  // SAS down 1-2 facing must-win-or-1-3. Wemby + Castle/Harper
  // health restoration is the structural narrative. Lines pre-authored
  // off DK opener (SAS -1.5 / 218.5); fuller slate refined Sun morning.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'wcf-g4-may24-floor-wemby-fox',
    slate: 'CF-G4', date: '2026-05-24',
    category: 'floor', type: 'best-bet',
    name: 'WCF G4 — SAS Stars Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify Sun morning)',
    legs: [
      { pick:'Wembanyama Over 19.5 points (alt — WCF G4)', odds:'-280', confidence:'floor', status:'hit',
        note:'Wemby 33pts — over 19.5 by 13.5. Revenge-game-script delivered: 40-ft buzzer-beater + 27-footer 24sec in, dominated +29. Deep alt floor zone held.' },
      { pick:'Fox Over 4.5 assists (alt — WCF G4)', odds:'-220', confidence:'floor', status:'hit',
        note:'Fox 5ast — over 4.5 by 0.5. Floor leg held by the slimmest margin. Also added 12/10 DD on the rebound side.' },
    ],
    thesis:'Two SAS-must-win legs. Math: 0.88 × 0.86 ≈ 76% combined — reliable floor. Wemby alt deep-points + Fox ast both calibrated. CF stake cap $100. Authored pre-game; refine Sun morning with confirmed lineups.',
    result: { outcome:'win', delta:'+$105', actual:'Both legs hit (Wemby 33 / Fox 5ast). +$105 on $100 stake. The 0.88 × 0.86 ≈ 76% combined floor projection held — Fox 5ast cut close to the 4.5 line but cleared.' },
  },
  // ═══════════════════════════════════════════════════════════════
  // ECF G4 — MON MAY 25: NYK @ CLE at Rocket Arena (closeout)
  // NYK leads 3-0 — sweep chance. CLE elimination (0-156 historical
  // for down-0-3). DK: NYK -1.5 / 217.5. Authored 5/24 with closeout
  // discipline; refresh Mon morning when official inactives drop.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ecf-g4-may25-floor-brunson-bridges',
    slate: 'CF-G4', date: '2026-05-25',
    category: 'floor', type: 'best-bet',
    name: 'ECF G4 — NYK Closeout Floor (2-Leg)',
    stake: 100, odds: '+110', payout: 'To Win: ~$110 (verify Mon morning)',
    legs: [
      { pick:'Brunson Over 19.5 points (alt — ECF G4)', odds:'-260', confidence:'floor', status:'miss',
        note:'Brunson 15pts in 28min (no Q4) — UNDER 19.5 by 4.5. Closeout-blowout cap fired in real life: 0 Q4 minutes negated the volume projection. The "deep alt floor" wasn\'t deep enough for a 37pt blowout closeout.' },
      { pick:'Bridges Over 11.5 points (alt — ECF G4)', odds:'-240', confidence:'floor', status:'hit',
        note:'Bridges 15pts — OVER 11.5 by 3.5. Counting-stat-blowout-stable held; deep alt zone correctly absorbed the variance.' },
    ],
    thesis:'NYK closeout floor stack — two stars with structural sweep-game volume. Math: 0.88 × 0.86 ≈ 76% combined — reliable floor. Both legs absorb the ELITE/STARTER tier corrections. CF stake cap $100. Verify Mon morning with confirmed lineups + DK pricing.',
    result: { outcome:'loss', delta:'-$100', actual:'1 of 2 legs hit — Brunson U19.5 (15pts in 28min, 0 Q4 minutes) broke the floor. Bridges over hit. Lesson: closeout-blowout sweep is its own variance regime even for star scoring — Phase 73o cap correctly suppressed the engine projection but the deep-alt 19.5 line still wasn\'t deep enough. Bet authoring should switch to PTS-deep-alt + REB/AST stat-stable floor in 0-3 closeout setups.' },
  },
  {
    id: 'wcf-g4-may24-trad-sas-stack',
    slate: 'CF-G4', date: '2026-05-24',
    category: 'traditional', type: 'best-bet',
    name: 'WCF G4 — SAS Home Stack (3-Leg)',
    stake: 50, odds: '+320', payout: 'To Win: ~$160 (verify Sun morning)',
    legs: [
      { pick:'SAS ML vs OKC (WCF G4)', odds:'-120', confidence:'medium', status:'hit',
        note:'SAS won 103-82 — never trailed after the opening 16-0 run. Healthy Castle/Harper + Wemby revenge-game-script delivered exactly as the down-1-2 must-win prior suggested.' },
      { pick:'Wembanyama Over 26.5 points (WCF G4)', odds:'-115', confidence:'medium', status:'hit',
        note:'Wemby 33pts — over 26.5 by 6.5. The G3 4-reb gameplan box backfired on OKC; revenge response was the structural game state.' },
      { pick:'Castle Over 19.5 points (WCF G4)', odds:'-110', confidence:'medium', status:'miss',
        note:'Castle 13pts — under 19.5 by 6.5. The 5/23 re-validation\'s coin-flip flag was right: Castle was healthy but in distribution mode (5ast), not a scoring lead. The blowout context capped his Q4 minutes too.' },
    ],
    thesis:'Three correlated SAS-favorable legs. <strong>5/23 MC re-validation:</strong> 0.56 × ~0.48 × ~0.45 ≈ 12% combined (originally claimed 19% based on overoptimistic per-leg estimates). At +320 payout (4.2x), 12% true hit = -EV by ~50%. Recommend SWAPPING legs to deep-alt lines (Wemby O22.5 ~80%, Castle O14.5 ~65%) before placing. Or treat as the SAS ML lead bet only and drop the prop legs. Stake $50 (CF cap). Lines provisional; refresh Sun morning with confirmed lineups + DK pricing.',
    result: { outcome:'loss', delta:'-$50', actual:'2 of 3 legs hit (SAS ML / Wemby O26.5); Castle U19.5 broke the stack at 13pts. Stack failed exactly where the 5/23 re-validation flagged — Castle leg was a coin-flip even on healthy projection, and the SAS blowout capped his late-game minutes. The Wemby O22.5 alt would have hit at 33pts; the rebuilt stack the thesis suggested would have been a winner.' },
  },
  {
    id: 'ecf-g4-may25-floor-hart-anunoby',
    slate: 'CF-G4', date: '2026-05-25',
    category: 'floor', type: 'best-bet',
    name: 'ECF G4 — NYK Role-Player Counting Floor (2-Leg)',
    stake: 100, odds: '+120', payout: 'To Win: ~$120 (verify Mon morning)',
    legs: [
      { pick:'Hart Over 7.5 rebounds (alt — ECF G4)', odds:'-260', confidence:'floor', status:'hit',
        note:'Hart 9reb in 29min — OVER 7.5 by 1.5. Workhorse-DD pattern held in closeout; rebound volume insensitive to blowout context.' },
      { pick:'KAT Over 7.5 rebounds (alt — ECF G4)', odds:'-240', confidence:'floor', status:'hit',
        note:'KAT 14reb — OVER 7.5 by 6.5. Mobley matchup produced the rebound volume exactly as projected. Phase 71 REB calibration cleanest signal again.' },
    ],
    thesis:'Two NYK rebound legs — the most calibrated Phase 71 signal (±0.2pt across tiers). Math: 0.88 × 0.85 ≈ 75% combined. Rebound floors are independent of who wins the game (Mobley vs KAT, Allen vs Hart on the glass produces volume even in CLE blowout scenarios). Counting-stat floor logic at its purest. CF stake cap $100.',
    result: { outcome:'win', delta:'+$120', actual:'Both legs hit (Hart 9reb / KAT 14reb). +$120 on $100 stake. REB floors held cleanly — Phase 71 calibration delivered exactly the signal it was supposed to. This is the canonical example of the "counting-stat floor" thesis working: REB volume is blowout-stable, the projection was correct, and the deep alt 7.5 lines absorbed any role variance.' },
  },
  {
    id: 'ecf-g4-may25-trad-nyk-closeout',
    slate: 'CF-G4', date: '2026-05-25',
    category: 'traditional', type: 'best-bet',
    name: 'ECF G4 — NYK Closeout Stack (3-Leg)',
    stake: 50, odds: '+340', payout: 'To Win: ~$170 (verify Mon morning)',
    legs: [
      { pick:'NYK ML vs CLE (ECF G4)', odds:'-135', confidence:'medium', status:'hit',
        note:'NYK 130-93 — outright win, sweep clinched. The structural composure prior the engine flagged was the dominant signal.' },
      { pick:'Brunson Over 24.5 points (ECF G4)', odds:'-115', confidence:'medium', status:'miss',
        note:'Brunson 15pts in 28min — UNDER 24.5 by 9.5. The closeout-blowout cap (Phase 73o) correctly suppressed the projection but the bet author still posted the 24.5 line. Authoring lesson: when the engine projects 27pts pre-cap, the closeout-cap should reduce TO ~17-18 (proj−7) for bet placement — the line authored too high.' },
      { pick:'Under 218.5 total (ECF G4)', odds:'-110', confidence:'lean', status:'miss',
        note:'Total 223 — OVER 218.5 by 4.5. The structural risk the thesis flagged ("any NYK 3PT eruption tips over") materialized: NYK shot 16-of-36 from three in the blowout. Elimination-runs-under prior failed in this 0-3 sweep variant.' },
    ],
    thesis:'Three correlated NYK-closeout legs. Math: 0.65 × 0.62 × 0.55 ≈ 22% combined (Phase 71 calibrated). At +340 payout (4.4x), 22% true hit gives ~-3% EV — coin-flip-marginal. The Under leg is the structural risk (any OT or NYK 3PT eruption tips over). Stake $50 (CF cap). Phase 71 R3 reduction holds.',
    result: { outcome:'loss', delta:'-$50', actual:'1 of 3 legs hit (NYK ML). Brunson U24.5 broke from the closeout-blowout cap + 0 Q4 minutes; Over 218.5 broke from NYK 3PT eruption. Stack outcome was the predicted coin-flip-marginal -EV. The thesis correctly flagged Under as the structural risk; the Brunson PTS leg was the authoring miss given Phase 73o cap.' },
  },
  // ═══════════════════════════════════════════════════════════════
  // WCF G5 — TUE MAY 26: SAS @ OKC at Paycom Center (series tied 2-2)
  // Reliable + Traditional parlay candidates. CF cap $100 floor / $50 trad.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'wcf-g5-may26-floor-wemby-fox',
    slate: 'CF-G5', date: '2026-05-26',
    category: 'floor', type: 'best-bet',
    name: 'WCF G5 — SAS Stars Counting Floor (2-Leg)',
    stake: 100, odds: '+115', payout: 'To Win: ~$115 (verify Tue evening)',
    legs: [
      { pick:'Wembanyama Over 21.5 points (alt — WCF G5)', odds:'-260', confidence:'floor', status:'miss',
        note:'Wemby series 30.3 avg / 26 road avg. Engine 26. Line 21.5 = proj−5 deep alt zone. Phase 71 ELITE tier correction applied; floor signal cleanest at this depth.' },
      { pick:'Wembanyama Over 7.5 rebounds (alt — WCF G5)', odds:'-300', confidence:'floor', status:'miss',
        note:'Wemby series 13.3 avg even with the G3 4-reb anomaly. Engine 12.8 REB. Line 7.5 = proj−5 deep alt zone. Phase 71 REB the most calibrated dimension.' },
    ],
    thesis:'Two Wemby legs — deep PTS alt + deep REB alt — for a same-player floor stack. Math: 0.85 × 0.92 ≈ 78% combined (Phase 71 REB calibrated higher than PTS by design). Both legs absorb the OKC box-out risk that materialized only once (G3). Floor stack discipline: no PTS-at-the-line, no triple-dip on shooting variance. CF stake cap $100.',
    result: { outcome:'loss', delta:'-100', actual:'0-of-2 — both Wemby legs missed (20 pts / 6 reb, his series-low in BOTH). OKC\'s box-out + length suppressed scoring AND boards simultaneously — the exact correlated downside the same-player stack was exposed to. Lesson: stacking two legs on one player removes the diversification that makes a floor parlay safe; when the defense takes the player out of one dimension it often takes both.' },
  },
  {
    id: 'wcf-g5-may26-floor-fox-caruso',
    slate: 'CF-G5', date: '2026-05-26',
    category: 'floor', type: 'best-bet',
    name: 'WCF G5 — Game-Script Floor (2-Leg)',
    stake: 100, odds: '+125', payout: 'To Win: ~$125 (verify Tue evening)',
    legs: [
      { pick:'Fox Over 4.5 assists (alt — WCF G5)', odds:'-240', confidence:'floor', status:'hit',
        note:'Fox series avg 6.0 ast (6/7/6/5). Engine 6.2 ast. Line 4.5 = proj−1.5 deep alt. Phase 71 AST calibrated for primary ball-handlers.' },
      { pick:'Caruso Over 8.5 points (alt — WCF G5)', odds:'-180', confidence:'floor', status:'hit',
        note:'Caruso home games (G1+G3 at Paycom) 31/29; G4 road cooldown to 8. Home + reset spot = volume-bench-game pattern. Engine 14pts. Line 8.5 = proj−5 deep alt; 3PT variance absorbed.' },
    ],
    thesis:'Two opposite-side floor legs (SAS Fox + OKC Caruso) — both home-game-stable counting stats. Math: 0.86 × 0.85 ≈ 73% combined — at the floor threshold. Fox AST is the safest leg; Caruso PTS deep alt protects against the 3PT-cold tail. CF stake cap $100.',
    result: { outcome:'win', delta:'+125', actual:'2-of-2 ✓ — Fox 8 ast (facilitated through the leg) + Caruso 22 pts (home heater returned). The two-team, two-stat diversification did exactly its job: opposite-side counting stats stayed independent of the game script. +$125 on $100.' },
  },
  {
    id: 'wcf-g5-may26-floor-wemby-fox-reb',
    slate: 'CF-G5', date: '2026-05-26',
    category: 'floor', type: 'best-bet',
    name: 'WCF G5 — Counting-Stat Stack (3-Leg)',
    stake: 100, odds: '+220', payout: 'To Win: ~$220 (verify Tue evening)',
    legs: [
      { pick:'Wembanyama Over 7.5 rebounds (alt — WCF G5)', odds:'-300', confidence:'floor', status:'miss',
        note:'Phase 71 REB cleanest signal. Engine 12.8. Line 7.5 = proj−5. Box-out risk priced in.' },
      { pick:'Fox Over 4.5 assists (alt — WCF G5)', odds:'-240', confidence:'floor', status:'hit',
        note:'Engine 6.2 ast. Line 4.5 = proj−1.5. Primary-ball-handler AST is stable.' },
      { pick:'SGA Over 7.5 assists (alt — WCF G5)', odds:'-220', confidence:'floor', status:'hit',
        note:'SGA series 8.5/12/12/5 = 9.4 avg. Engine ~9 ast. Line 7.5 = proj−1.5. Bouncing back from G4 + Castle POA limited his Q4 minutes.' },
    ],
    thesis:'Three counting-stat legs (Wemby REB + Fox AST + SGA AST). Math: 0.92 × 0.86 × 0.83 ≈ 66% combined — below 80% floor threshold but at +220 payout the EV is ~+45% true vs implied. Reliable-tier reach; technically traditional if strict 80% floor required. CF stake cap $100.',
    result: { outcome:'loss', delta:'-100', actual:'2-of-3 — Fox 8 ast ✓ and SGA 9 ast ✓ both cleared, but Wemby 6 reb missed the 7.5 (OKC box-out). The single REB leg sank the three-legger — same root cause as the Wemby same-player stack. The deep-alt REB floor (Phase 71\'s most-trusted signal) lost again vs OKC, the second time this CF (G3 was the first). R3 audit: OKC\'s Hartenstein/Holmgren tag-team box-out is a repeatable Wemby-REB suppressor that the calibrated REB signal does not model.' },
  },
  {
    id: 'wcf-g5-may26-trad-okc-home-stack',
    slate: 'CF-G5', date: '2026-05-26',
    category: 'traditional', type: 'best-bet',
    name: 'WCF G5 — OKC Home Stack (3-Leg)',
    stake: 50, odds: '+340', payout: 'To Win: ~$170 (verify Tue evening)',
    legs: [
      { pick:'OKC ML vs SAS (WCF G5)', odds:'-218', confidence:'medium', status:'hit',
        note:'Engine OKC by 4 at home; bench depth structural edge. Mean-revert from G4 6-33 3PT anomaly expected.' },
      { pick:'SGA Over 27.5 points (WCF G5)', odds:'-115', confidence:'lean', status:'hit',
        note:'Home G1+G2 avg 27 (24/30). Phase 71c override applied. Bounce-back from G4 19pt anomaly + Wemby gravity drawing Castle off SGA in second half.' },
      { pick:'Over 215.5 total (WCF G5)', odds:'-110', confidence:'lean', status:'hit',
        note:'Series totals 237/235/231/185 — G4 defensive anomaly. Engine 224 total. Mean reversion at Paycom = the cleanest reversion-trade on the slate.' },
    ],
    thesis:'Three correlated OKC-home-bounce-back legs. Math: 0.54 × 0.55 × 0.55 ≈ 16% combined. At +340 payout (4.4x), 16% true hit gives ~-29% EV — coin-flip-marginal. The Over leg is the structural anchor (mean reversion); SGA PTS is the override-risk leg; OKC ML is the lead bet. Stake $50 (CF cap). Phase 71 R3 stake reduction holds.',
    result: { outcome:'win', delta:'+170', actual:'3-of-3 ✓ — OKC ML (won by 13) + SGA 32 (Over 27.5) + 241 total (Over 215.5). The correlated OKC-home-bounce-back thesis hit on all three: the mean-reversion read (G4 6-33 from 3PT → home regression) was the structural anchor and it cashed cleanly. Best ticket of the slate at +$170 on $50.' },
  },
  {
    id: 'wcf-g6-may28-floor-creator',
    slate: 'CF-G6', date: '2026-05-28',
    category: 'floor', type: 'best-bet',
    name: 'WCF G6 — Cross-Team Creator Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify Thu evening)',
    legs: [
      { pick:'Castle Over 4.5 assists (alt — WCF G6)', odds:'-160', confidence:'floor', status:'hit',
        note:'Castle series ast 8/8/6/5/6 = 6.6 avg. Engine 6.0. Line 4.5 = proj−1.5 deep alt. Primary SAS creator at home — facilitator floor independent of the Wemby scoring variance.' },
      { pick:'SGA Over 7.5 assists (alt — WCF G6)', odds:'-220', confidence:'floor', status:'miss',
        note:'SGA series ast 12/9/12/5/9 = 9.4 avg. Engine ~9. Line 7.5 = proj−1.5 deep alt. Elite creator; cross-team leg keeps the parlay independent of any single game script.' },
    ],
    thesis:'Two primary-creator assist floors on opposite teams (Castle SAS + SGA OKC) — deliberately diversified after the G5 same-player Wemby stack imploded. Math: 0.86 × 0.85 ≈ 73% combined; each leg independently clears the 80% deep-alt zone. AST is Phase 71\'s best-calibrated dimension for primary ball-handlers and is structurally independent of the OKC box-out that wrecked the Wemby-REB floors. CF stake cap $100.',
    result: { outcome:'loss', delta:'-$100', actual:'1 of 2 legs hit — Castle 9 ast ✓ but SGA had only 4 ast (quiet 15/1/4 in the blowout loss, minutes cut on the road) and broke the floor. The cross-team diversification still failed because SGA\'s down game collapsed BOTH his scoring and playmaking at once. Lesson: a star\'s AST floor is NOT blowout-resilient the way a role-player PRA floor is — when his team is routed on the road his minutes and usage both fall. Diversifying across teams doesn\'t help if one leg is a star whose volume is game-script-dependent.' },
  },
  {
    id: 'wcf-g6-may28-floor-star-scoring',
    slate: 'CF-G6', date: '2026-05-28',
    category: 'floor', type: 'best-bet',
    name: 'WCF G6 — Deep-Alt Star Scoring Floor (2-Leg)',
    stake: 100, odds: '+120', payout: 'To Win: ~$120 (verify Thu evening)',
    legs: [
      { pick:'Wembanyama Over 17.5 points (alt — WCF G6)', odds:'-280', confidence:'floor', status:'hit',
        note:'Wemby PTS by game: 41/21/26/33/20 — floor was 20 even on the G5 box-out night. Line 17.5 = proj−9 deep alt, well clear of his worst CF output. This is the SAFE Wemby leg: scoring floor, NOT the OKC-suppressed REB floor that lost twice.' },
      { pick:'SGA Over 21.5 points (alt — WCF G6)', odds:'-240', confidence:'floor', status:'miss',
        note:'SGA PTS 24/30/26/19/32 — only G4 (19) dipped under 21.5. Line 21.5 = proj−5 deep alt. Closeout-game usage tends to rise; cross-team scoring floor.' },
    ],
    thesis:'Two deep-alt SCORING floors on opposite-team stars — explicitly avoiding the Wemby-REB dimension that OKC\'s box-out has suppressed (4 and 6 reb in the two gameplanned games). Both stars have scored above these lines in 4 of 5 CF games. Math: 0.85 × 0.86 ≈ 73% combined; each clears the 80% deep-alt zone. Diversified across teams so neither leg depends on who wins. CF stake cap $100.',
    result: { outcome:'loss', delta:'-$100', actual:'1 of 2 legs hit — Wemby 28 ✓ cleared the 17.5 deep alt easily, but SGA scored a series-LOW 15 (5-15 FG) and missed even the proj−5 deep alt 21.5. The "over in 4 of 5 CF games" prior didn\'t protect against a fresh-Castle POA + road-blowout suppression game (his 2nd sub-20 road game: G4 19, G6 15). Same root cause as the creator floor: SGA\'s production floor is matchup-fragile vs Castle on the road, not the safe deep-alt the line implied.' },
  },
  {
    id: 'wcf-g6-may28-trad-sas-elimination',
    slate: 'CF-G6', date: '2026-05-28',
    category: 'traditional', type: 'best-bet',
    name: 'WCF G6 — SAS Forces Game 7 Stack (3-Leg)',
    stake: 50, odds: '+360', payout: 'To Win: ~$180 (verify Thu evening)',
    legs: [
      { pick:'SAS ML vs OKC (WCF G6)', odds:'-155', confidence:'lean', status:'hit',
        note:'Engine SAS by 3 at home; must-win desperation + 4-1 reg-season pattern. Lead bet of the correlated stack.' },
      { pick:'Wembanyama Over 25.5 points (WCF G6)', odds:'-115', confidence:'lean', status:'hit',
        note:'Bounce-back spot at home; if SAS wins, Wemby almost certainly leads the scoring. Engine ~27. Correlated with the SAS ML leg.' },
      { pick:'Over 219.5 total (WCF G6)', odds:'-110', confidence:'lean', status:'miss',
        note:'4 of 5 CF games cleared 219.5; a desperate uptempo SAS keeps possessions high. Engine ~227. The mean-reversion-style anchor.' },
    ],
    thesis:'A CORRELATED SAS-forces-G7 stack — applying the G5 lesson that correlated theses (the OKC home stack that won +$170) beat mixed-direction legs. If SAS wins this elimination game at home, Wemby scoring 25+ and an uptempo Over are the natural co-occurrences. Math: 0.56 × 0.55 × 0.55 ≈ 17% combined; at +360 (4.6x) that\'s roughly break-even EV, lifted by the positive leg correlation the raw multiplication ignores. Phase 73 elimination amplifier ACTIVE + G6 CAUTION downgrade → reduced $50 stake. The first CF traditional only just broke through (G5); keep stakes small.',
    result: { outcome:'loss', delta:'-$50', actual:'2 of 3 legs hit — SAS ML ✓ (118-91) and Wemby O25.5 ✓ (28) both cashed, but Over 219.5 broke (total 209). The correlated SAS-forces-G7 read was right on the win AND the Wemby scoring, but elimination-game defensive intensity compressed the total — OKC managed only 91. The Under was the structural risk the model under-weighted in a desperate-defense elimination spot; 2 of 3 correlated legs landing still loses a traditional.' },
  },
  {
    id: 'wcf-g6-may28-floor-role-pra',
    slate: 'CF-G6', date: '2026-05-28',
    category: 'floor', type: 'best-bet',
    name: 'WCF G6 — SAS Role-Player PRA Floor (3-Leg)',
    stake: 100, odds: '+135', payout: 'To Win: ~$135 (verify Thu evening)',
    legs: [
      { pick:'Champagnie Over 9.5 PRA (alt — WCF G6)', odds:'-350', confidence:'floor', status:'hit',
        note:'Champagnie cleared this easily in G5 (28 PRA, career playoff-high 22pts). 24-28 min role at home. Deep PRA floor is blowout-resilient — clears even in a SAS loss.' },
      { pick:'Keldon Johnson Over 9.5 PRA (alt — WCF G6)', odds:'-330', confidence:'floor', status:'hit',
        note:'Keldon 15 PRA in G5; steady bench-wing minutes. PRA composite (pts+reb+ast) smooths single-stat variance — the safest role-player floor dimension.' },
      { pick:'Harper Over 9.5 PRA (alt — WCF G6)', odds:'-300', confidence:'floor', status:'hit',
        note:'Rookie Harper 14 PRA in G5 (8/3/3). Combo-guard line accrues across pts+reb+ast even on a quiet scoring night.' },
    ],
    thesis:'Replicates the validated user edge (G5 CHS Lab role-player PRA stack went 4-for-4 and cashed DESPITE SAS losing by 13). The structural insight: role-player PRA floors at deep lines (9.5) are BLOWOUT-RESILIENT and diversified across three players, so they avoid the correlated single-player downside that sank the G5 Wemby stacks (OKC\'s box-out suppressed Wemby PTS and REB simultaneously). PRA is 10/10 in the user-bet ledger — the most reliable dimension on record. Math: 0.90 × 0.89 × 0.87 ≈ 70% combined; each leg independently clears the 80% deep-alt zone. At SAS home in an elimination game these role players see secure minutes. CF stake cap $100.',
    result: { outcome:'win', delta:'+$135', actual:'3 of 3 ✓ — Champagnie 18 PRA (10/6/2), Keldon 21 PRA (14/5/2), Harper 20 PRA (12/4/4). The role-player PRA floor cashed AGAIN — a second straight CF game validating the blowout-resilient thesis, and the ONLY winning parlay on a slate where BOTH star-floor stacks broke on SGA\'s down game (4 ast / 15 pts). The edge is now unmistakable: diversified deep-alt role-player PRA >> star-concentrated floors. PRA stays the premier reliable-tier dimension. +$135 on $100.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // CF-G7 PARLAYS — Sat 5/30 @ Paycom. Series tied 3-3, winner to Finals.
  // Lead with the validated role-player PRA floor (3-for-3 in G6, the lone
  // slate winner). Avoid star-concentrated floors (both broke on SGA's G6
  // down game). G7 elimination amplifier ACTIVE → CAUTION pills, reduced stakes.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'wcf-g7-may30-floor-role-pra',
    slate: 'CF-G7', date: '2026-05-30',
    category: 'floor', type: 'best-bet',
    name: 'WCF G7 — SAS Role-Player PRA Floor (3-Leg)',
    stake: 100, odds: '+135', payout: 'To Win: ~$135 (verify Sat evening)',
    legs: [
      { pick:'Champagnie Over 9.5 PRA (alt — WCF G7)', odds:'-350', confidence:'floor', status:'hit',
        note:'Champagnie PRA last two: G5 28, G6 18 (10/6/2). 24-28 min bench-wing role. Deep PRA floor is blowout-resilient whether SAS wins or loses.' },
      { pick:'Keldon Johnson Over 9.5 PRA (alt — WCF G7)', odds:'-330', confidence:'floor', status:'hit',
        note:'Keldon PRA G5 15, G6 21 (14/5/2). Steady bench-wing minutes; PRA composite smooths single-stat variance.' },
      { pick:'Harper Over 9.5 PRA (alt — WCF G7)', odds:'-300', confidence:'floor', status:'hit',
        note:'Rookie Harper PRA G5 14, G6 20 (12/4/4). Combo-guard line accrues across pts+reb+ast even on a quiet scoring night.' },
    ],
    thesis:'The validated reliable-tier play: this exact role-player PRA stack went 3-for-3 in G6 (Champagnie 18 / Keldon 21 / Harper 20) and was the ONLY winning parlay on the slate while both star floors broke on SGA. Role-player PRA at deep lines (9.5) is BLOWOUT-RESILIENT and diversified across three players — it clears whether SAS wins or loses the G7. PRA is now 11/11 in the user-bet ledger, the most reliable dimension on record. Math: 0.90 × 0.89 × 0.87 ≈ 70% combined; each leg independently clears the 80% deep-alt zone. CF stake cap $100.',
    result: { outcome:'win', delta:'+$135', actual:'3 of 3 ✓ — Champagnie 26 PRA (20/4/2), Keldon 10 PRA (7/2/1 — JUST cleared), Harper 23 PRA (14/5/4). The role-player PRA floor cashed in a 3rd straight CF game. PRA dimension is now 13/13 across the playoffs — the cleanest reliable-tier rule in the framework. Anchor of the Finals reliable parlay going forward. +$135 on $100.' },
  },
  {
    id: 'wcf-g7-may30-floor-creator-big',
    slate: 'CF-G7', date: '2026-05-30',
    category: 'floor', type: 'best-bet',
    name: 'WCF G7 — Cross-Team Creator + Big PRA Floor (2-Leg)',
    stake: 100, odds: '+115', payout: 'To Win: ~$115 (verify Sat evening)',
    legs: [
      { pick:'Castle Over 4.5 assists (alt — WCF G7)', odds:'-160', confidence:'floor', status:'hit',
        note:'Castle ast 8/8/6/5/6/9 = 7.0 avg; 9 in G6. Engine 6.2. Line 4.5 = proj−1.7 deep alt. Primary SAS creator — facilitator floor independent of the game script.' },
      { pick:'Holmgren Over 15.5 PRA (alt — WCF G7)', odds:'-280', confidence:'floor', status:'hit',
        note:'Holmgren PRA has been 17-28 across the CF (22 in G6, 28 in G5) — never below 17. At home in a G7 his minutes are secure; a starting-center PRA floor is the OKC-side counterpart to the SAS role-player PRA. Deep 15.5 line.' },
    ],
    thesis:'Two STABLE-dimension floors on opposite teams (Castle AST + Holmgren PRA) — deliberately avoiding the star-scoring/star-AST legs that broke the G6 cross-team floors when SGA cratered (4 ast / 15 pts). AST and big-man PRA are the two dimensions least sensitive to game script: a creator keeps facilitating and a starting center keeps accruing pts+reb regardless of who wins. Math: 0.86 × 0.84 ≈ 72% combined; each clears the 80% deep-alt zone. Cross-team so neither leg depends on the winner. CF stake cap $100.',
    result: { outcome:'win', delta:'+$115', actual:'2 of 2 ✓ — Castle 6 ast (cleared 4.5), Holmgren 22 PRA (12pts/9reb/1ast — cleared 15.5 by 6.5). Cross-team stable-dimension floor thesis validated: a creator kept facilitating AND a starting big kept accruing pts+reb regardless of which team won. The AST + big-man PRA dimensions are confirmed as game-script-independent. +$115 on $100.' },
  },
  {
    id: 'wcf-g7-may30-trad-okc-home-close',
    slate: 'CF-G7', date: '2026-05-30',
    category: 'traditional', type: 'best-bet',
    name: 'WCF G7 — OKC Closes At Home Stack (3-Leg)',
    stake: 50, odds: '+340', payout: 'To Win: ~$170 (verify Sat evening)',
    legs: [
      { pick:'OKC ML vs SAS (WCF G7)', odds:'-162', confidence:'lean', status:'miss',
        note:'Engine OKC by 5 at home; Paycom + bench depth + SGA home bounce-back. Lead leg of the correlated stack.' },
      { pick:'SGA Over 27.5 points (WCF G7)', odds:'-115', confidence:'lean', status:'hit',
        note:'Home bounce-back from his series-low 15; Paycom games 24/30/32. If OKC wins, SGA almost certainly leads the scoring — correlated with OKC ML.' },
      { pick:'Under 213.5 total (WCF G7)', odds:'-110', confidence:'lean', status:'miss',
        note:'G7 defensive grind; the line dropped to 213.5 and the SAS-controlled games went 185/209. A "SGA carries, defense wins" G7 is the coherent co-occurrence with an OKC home win.' },
    ],
    thesis:'A CORRELATED OKC-closes-at-home stack — applying the G5 lesson (the +$170 OKC home stack was the first CF traditional winner; correlated theses beat mixed-direction legs). The coherent G7 script: OKC wins a defensive grind at home behind an SGA bounce-back — OKC ML + Under are correlated (a defensive win) and SGA O27.5 is the bounce-back carry. Two OKC-team legs + one game total respects the 2-per-team parlay cap. Math: 0.55 × 0.55 × 0.53 ≈ 16% combined; at +340 (4.4x) ≈ break-even EV, lifted by the positive leg correlation. Phase 73 elimination amplifier ACTIVE + G7 CAUTION downgrade → reduced $50 stake. Keep stakes small in a coin-flip G7.',
    result: { outcome:'loss', delta:'-$50', actual:'1 of 3 ✓ — SGA 35 cleared, but OKC ML broke (SAS won 111-103) and Under 213.5 missed by 0.5 (total 214). The correlated stack thesis was DIRECTIONALLY validated by the G5 win but reversed here when the coin-flip winner went SAS. The Phase 71 R3 audit (G7 ~50% winner accuracy / 19.8pt MAE) held: the engine 3-4 on CF winners. Confirms that even a coherent correlated thesis loses ~50% of the time in G7.' },
  },

  // ═══════════════════════════════════════════════════════════════
  // FINALS-G1 PARLAYS — Wed 6/3 @ Frost Bank Center.
  // Lead with the validated role-player PRA floor (13/13 across the
  // playoffs; cleared all 3 CF games including WCF G7). NYK's perimeter
  // D is tighter than OKC's, so PRA lines have less air — trim the lines
  // accordingly. Finals out-of-sample stake cap stays 50%.
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'finals-g1-jun3-floor-role-pra',
    slate: 'Finals-G1', date: '2026-06-03',
    category: 'floor', type: 'best-bet',
    name: 'Finals G1 — SAS Role-Player PRA Floor (3-Leg)',
    stake: 100, odds: '+125', payout: 'To Win: ~$125 (verify Wed evening)',
    legs: [
      { pick:'Champagnie Over 9.5 PRA (alt — Finals G1)', odds:'-350', confidence:'floor', status:'hit',
        note:'HIT — 27 PRA (16pts/10reb/1ast, 5-10 from 3). 24-28 min role held; cleared with room.' },
      { pick:'Keldon Johnson Over 8.5 PRA (alt — Finals G1)', odds:'-280', confidence:'floor', status:'miss',
        note:'MISS — 4 PRA (2pts/2reb/0ast) in a PLAYOFF-LOW 8 min. Minutes were NOT secure in a tight starter-heavy game (Wemby 38, Fox 38, Vassell 36). The hidden minutes-correlation risk that sank the floor.' },
      { pick:'Harper Over 8.5 PRA (alt — Finals G1)', odds:'-260', confidence:'floor', status:'hit',
        note:'HIT — 25 PRA (16pts/8reb/1ast, 6-10 FG). Sustained ascension held off the bench.' },
    ],
    thesis:'The validated reliable-tier play, ported to Finals G1: this exact role-player PRA stack went 3-for-3 in WCF G6 + 3-for-3 again in WCF G7. PRA is now 13/13 across the playoffs — the cleanest reliable-tier rule in the framework. Trimmed Keldon + Harper lines (9.5→8.5) to account for NYK perimeter D (OG/Bridges/Hart 0.9-1.7 dLEBRON, all meaningfully tighter than OKC Dort). Math: 0.90 × 0.85 × 0.83 ≈ 64% combined; each leg independently clears the 80% deep-alt zone. Phase 71 R3 out-of-sample Finals stake cap: $100 ($50 reduced from R3 $100 cap initially feels right, but PRA has earned a full $100 — keeping cap at $100 to honor the validated edge).',
    result: { outcome:'loss', delta:'-$100', actual:'Champagnie 27 PRA ✓ / Harper 25 PRA ✓ / Keldon Johnson 4 PRA ✗ (8-min playoff low). The floor BROKE on minutes insecurity — first PRA-floor loss of the playoffs (13/14). The two minutes-secure legs cleared; the staple-benched wing did not.' },
  },
  {
    id: 'finals-g1-jun3-floor-creator-big',
    slate: 'Finals-G1', date: '2026-06-03',
    category: 'floor', type: 'best-bet',
    name: 'Finals G1 — Cross-Team Stable-Dimension Floor (2-Leg)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify Wed evening)',
    legs: [
      { pick:'Castle Over 4.5 assists (alt — Finals G1)', odds:'-160', confidence:'floor', status:'miss',
        note:'MISS — 3 ast. Usage tilted to scoring (17pts on 16 FGA, Brunson POA duty) rather than creating. The AST floor that held all WCF cracked when the offense ran through Fox/Wemby instead.' },
      { pick:'Wembanyama Over 11.5 rebounds (alt — Finals G1)', odds:'-180', confidence:'floor', status:'hit',
        note:'HIT — 12 reb (barely cleared 11.5). The softer NYK rim duel held on the glass as projected, even on a 6-21 shooting night.' },
    ],
    thesis:'Two STABLE-dimension floors on opposite teams (Castle AST + Wemby REB) — the WCF G7 validated this cross-team approach (Castle AST + Holmgren PRA cleared together). Each leg is structurally game-script-independent: a creator keeps facilitating and a 7-4 paint dominator keeps rebounding even on a quiet scoring night. Subbing Wemby REB for Holmgren PRA exploits the NYK rim-defense downgrade. Math: 0.86 × 0.82 ≈ 71% combined. Cross-team so neither leg depends on the winner.',
    result: { outcome:'loss', delta:'-$100', actual:'Wemby 12 reb ✓ / Castle 3 ast ✗. The cross-team structure didn\'t save it — Castle\'s AST collapsed when SAS ran offense through Fox/Wemby. REB floor was the right read; the AST floor assumed creator usage that the game script took away.' },
  },
  {
    id: 'finals-g1-jun3-trad-sas-home-defend',
    slate: 'Finals-G1', date: '2026-06-03',
    category: 'traditional', type: 'best-bet',
    name: 'Finals G1 — SAS Defends Home + Wemby Carries (3-Leg)',
    stake: 50, odds: '+350', payout: 'To Win: ~$175 (verify Wed evening)',
    legs: [
      { pick:'SAS ML vs NYK (Finals G1)', odds:'-135', confidence:'lean', status:'miss',
        note:'MISS — NYK 105-95. SAS led by 14 in Q3 then got outscored 57-40 in the second half; the 8-day NYK rest was a 4th-quarter ASSET, not a Q1 liability.' },
      { pick:'Wembanyama Over 27.5 points (Finals G1)', odds:'-115', confidence:'lean', status:'miss',
        note:'MISS — 26 pts on 6-21 FG. Mitchell Robinson (fractured hand) was a better individual deterrent than the stretch-5 framing assumed; 12-13 FT kept it close to the line but under.' },
      { pick:'Brunson Under 26.5 points (Finals G1)', odds:'-115', confidence:'lean', status:'miss',
        note:'MISS — Brunson 30 (12-31 FG). Castle held the FG% (38.7%) but a 31-FGA volume night + clutch closing shots cleared the points line anyway.' },
    ],
    thesis:'A CORRELATED SAS-defends-home stack — applying the WCF G5 + G7 lessons (correlated theses beat mixed-direction legs even when the ML is a coin-flip). The coherent G1 script: SAS wins at home behind a Wemby carry game (KAT softer-than-Holmgren rim D = Wemby ceiling unlocks) AND Castle suppresses Brunson on the road. Two SAS-positive legs + one NYK-negative leg are all internally consistent: a SAS home win is correlated with both stars trending the right way. Math: 0.54 × 0.55 × 0.55 ≈ 16% combined; at +350 (4.5x) ≈ break-even EV, lifted by positive leg correlation. Phase 71 R3 out-of-sample Finals stake cap → reduced $50 stake. Keep traditional stakes small in the first Finals game (CAUTION pill auto-stamps).',
    result: { outcome:'loss', delta:'-$50', actual:'SAS ML ✗ / Wemby 26 pts ✗ (O27.5) / Brunson 30 pts ✗ (U26.5). 0-for-3 — the SAS-defends-home script inverted on every leg. The correlation cut the wrong way: NYK won AND both star-prop reads missed.' },
  },

  // ─── FINALS G2 (Fri 6/5) — minutes-vetted floors per the G1 retro ───
  {
    id: 'finals-g2-jun5-floor-minutes-vetted-pra',
    slate: 'Finals-G2', date: '2026-06-05',
    category: 'floor', type: 'best-bet',
    name: 'Finals G2 — SAS Minutes-Vetted Role PRA (3-Leg)',
    stake: 100, odds: '+135', payout: 'To Win: ~$135 (verify Fri evening)',
    legs: [
      { pick:'Champagnie Over 9.5 PRA (alt — Finals G2)', odds:'-300', confidence:'floor', status:'hit',
        note:'HIT — 13 PRA (8/4/1) in 30 SECURE min, even on a 2-6 cold-shooting night. The anchor held.' },
      { pick:'Harper Over 9.5 PRA (alt — Finals G2)', odds:'-240', confidence:'floor', status:'hit',
        note:'HIT — 23 PRA (15/6/2) in 28 SECURE min. Combo-guard composite cleared with room.' },
      { pick:'Wembanyama Over 27.5 PRA (alt — Finals G2)', odds:'-280', confidence:'floor', status:'hit',
        note:'HIT — 41 PRA (29/9/3) even with the REB dip to 9; the composite is variance-proof. Third straight 40+ PRA game.' },
    ],
    thesis:'The role-PRA floor REBUILT around the G1 lesson: the only leg that broke G1 was Keldon Johnson\'s (8-min playoff low) — every MINUTES-SECURE leg cleared (Champagnie 27, Harper 25, Wemby 40 PRA). This parlay drops Keldon entirely and uses three players with guaranteed rotation minutes; Wemby\'s deep-alt PRA (27.5) is added because it cleared on his WORST shooting night of the playoffs, proving the composite is variance-proof. Math: 0.90 × 0.86 × 0.88 ≈ 68% combined; each leg independently in the 80%+ deep-alt zone. Phase 71 R3 Finals stake cap holds at $100 — the PRA edge survives even after its first loss, because that loss was minutes-driven and is now explicitly screened out.',
    result: { outcome:'win', delta:'+$135', actual:'WIN — all three minutes-vetted legs cleared (Champagnie 13 PRA, Harper 23 PRA, Wemby 41 PRA). The G1 retro fix worked: screening out the minutes-volatile Keldon leg and keeping only locked-rotation players delivered. PRA floor moves to 16/17 on the ledger.' },
  },
  {
    id: 'finals-g2-jun5-floor-bigman-reb',
    slate: 'Finals-G2', date: '2026-06-05',
    category: 'floor', type: 'best-bet',
    name: 'Finals G2 — Cross-Team Big-Man REB Floor (2-Leg)',
    stake: 100, odds: '+110', payout: 'To Win: ~$110 (verify Fri evening)',
    legs: [
      { pick:'Wembanyama Over 11.5 rebounds (alt — Finals G2)', odds:'-180', confidence:'floor', status:'miss',
        note:'MISS — only 9 reb (down from 12 in G1). Mitchell Robinson\'s INCREASED minutes (16 vs 12) on the fractured hand was the suppressor — a committed second deterrent held the board count down. Validates the "degrade REB ~30% vs a heavier-deterrent look" rule.' },
      { pick:'Karl-Anthony Towns Over 9.5 rebounds (alt — Finals G2)', odds:'-200', confidence:'floor', status:'hit',
        note:'HIT — 13 reb. KAT cleaned the glass as projected; the cross-team structure worked but couldn\'t save the parlay once the Wemby leg broke.' },
    ],
    thesis:'Two STABLE big-man rebounding floors on OPPOSITE teams — both cleared their lines in G1 (Wemby 12, KAT 12). Rebounding is the most game-script-independent dimension for a paint anchor: a 7-4 shot-blocker and a 7-foot stretch-5 keep cleaning the glass whether their team wins by 10 or loses by 10. Cross-team structure means neither leg depends on the winner (the lesson the G1 cross-team floor confirmed even as one leg missed). NEVER stacked on one player (the documented REB rule) — two different bigs. Math: 0.84 × 0.82 ≈ 69% combined. The complement to the PRA floor.',
    result: { outcome:'loss', delta:'-$100', actual:'LOSS — Wemby REB floor BROKE (9 reb vs the 11.5 line) on Mitchell Robinson\'s increased rim-deterrent minutes; KAT 13 reb HIT but a 2-leg floor needs both. The documented REB-vulnerability rule (degrade vs a committed box-out/deterrent) cost this one — the lesson is logged for G3.' },
  },
  {
    id: 'finals-g2-jun5-trad-nyk-cover-stars',
    slate: 'Finals-G2', date: '2026-06-05',
    category: 'traditional', type: 'best-bet',
    name: 'Finals G2 — NYK Cover + Stars Produce (3-Leg)',
    stake: 50, odds: '+420', payout: 'To Win: ~$210 (verify Fri evening)',
    legs: [
      { pick:'NYK +5.5 vs SAS (Finals G2)', odds:'-110', confidence:'lean', status:'hit',
        note:'HIT — NYK won outright 105-104. The lead leg landed, but the stack needs all three.' },
      { pick:'Brunson Over 24.5 points (Finals G2)', odds:'-115', confidence:'lean', status:'miss',
        note:'MISS — 20 on 7-25. Castle FINALLY suppressed the POINTS (not just the FG%) this time; the G1 "volume still clears" pattern broke. This leg sank the parlay.' },
      { pick:'Karl-Anthony Towns Over 30.5 PRA (Finals G2)', odds:'-120', confidence:'lean', status:'hit',
        note:'HIT — 38 PRA (21/13/4). The second-star line produced exactly as the correlation thesis expected; KAT carried the scoring Brunson couldn\'t.' },
    ],
    thesis:'A CORRELATED NYK stack built on the model\'s actual G2 edge (NYK +5.5 is the value, NOT the SAS ML) — flipping the direction of the G1 traditional that lost 0-3 betting SAS-defends-home. The coherent G2 script: NYK covers (or wins outright) behind another Brunson volume night and a KAT double-double composite. All three legs move together — a NYK cover correlates with both NYK stars producing. Math: 0.55 × 0.58 × 0.60 ≈ 19% combined; at +420 (5.2x) ≈ positive EV, lifted by leg correlation. Phase 71 R3 Finals cap → reduced $50 stake; CAUTION pill auto-stamps in the out-of-sample Finals.',
    result: { outcome:'loss', delta:'-$50', actual:'LOSS — NYK +5.5 HIT (won outright) and KAT 38 PRA HIT, but Brunson 20 pts BUSTED the Over 24.5 (7-25, Castle suppressed the scoring). 2 of 3 legs; the correlated stack still needs all three. The right DIRECTION (NYK cover) on the wrong leg — the Brunson points line is now a coin flip vs Castle.' },
  },

  // ─── FINALS G3 (Mon 6/8 at MSG) — minutes-vetted floors + cross-star PRA ───
  {
    id: 'finals-g3-jun8-floor-minutes-vetted-pra',
    slate: 'Finals-G3', date: '2026-06-08',
    category: 'floor', type: 'best-bet',
    name: 'Finals G3 — SAS Minutes-Vetted Role PRA (3-Leg)',
    stake: 100, odds: '+130', payout: 'To Win: ~$130 (verify Mon evening)',
    legs: [
      { pick:'Champagnie Over 9.5 PRA (alt — Finals G3)', odds:'-280', confidence:'floor', status:'hit',
        note:'HIT — 12/5/1 = 18 PRA on 30 SECURE min. Third straight Finals clear (27, 13, 18). The anchor held again.' },
      { pick:'Harper Over 9.5 PRA (alt — Finals G3)', odds:'-230', confidence:'floor', status:'hit',
        note:'HIT — 13/9/3 = 25 PRA in 28 SECURE min, a near-double-double. Cleared all three Finals games (25, 23, 25).' },
      { pick:'Wembanyama Over 27.5 PRA (alt — Finals G3)', odds:'-300', confidence:'floor', status:'hit',
        note:'HIT — 32/8/6 = 46 PRA on an efficient 11-18 closeout. 40/41/46 across the series; the composite is variance-proof.' },
    ],
    thesis:'The exact minutes-vetted PRA floor that WON in G2 (+$135), re-run for G3 because every leg cleared both Finals games. Champagnie (27/13 PRA), Harper (25/23 PRA), and Wemby\'s deep-alt PRA (40/41) are all minutes-secure and rebound-independent — the structure keys the PRA composite, deliberately avoiding the standalone REB-alt that broke the G2 big-man floor on Wemby\'s 9-reb dip. In a desperate SAS G3 the rotation tightens AROUND these players, making the minutes floor even safer. Math: 0.90 × 0.87 × 0.90 ≈ 70% combined; each leg independently in the 80%+ deep-alt zone. Phase 71 R3 Finals stake cap holds at $100.',
    result: { outcome:'win', delta:'+$130', actual:'All three legs HIT (Champagnie 18 PRA, Harper 25 PRA, Wemby 46 PRA). The minutes-vetted role-PRA floor is now 2-1 in the Finals and cleared every leg in all three games — the most reliable structure in the series.' },
  },
  {
    id: 'finals-g3-jun8-floor-cross-star-pra',
    slate: 'Finals-G3', date: '2026-06-08',
    category: 'floor', type: 'best-bet',
    name: 'Finals G3 — Cross-Team Star PRA Floor (2-Leg)',
    stake: 100, odds: '+115', payout: 'To Win: ~$115 (verify Mon evening)',
    legs: [
      { pick:'Wembanyama Over 33.5 PRA (Finals G3)', odds:'-125', confidence:'floor', status:'hit',
        note:'HIT — 46 PRA (32/8/6). The composite cleared a third straight game on an efficient closeout night.' },
      { pick:'Karl-Anthony Towns Over 30.5 PRA (Finals G3)', odds:'-120', confidence:'floor', status:'miss',
        note:'MISS — 11/8/2 = 21 PRA after 34 and 38. Wemby\'s 3 blocks bothered KAT inside (4-11 FG); a SCORING-dependent big\'s PRA is matchup-fragile vs an elite shot-blocker. The leg that sank the floor.' },
    ],
    thesis:'Two STABLE star PRA composites on OPPOSITE teams — both cleared their lines in BOTH Finals games (Wemby 40/41, KAT 34/38). Unlike a single-stat REB or PTS line (which swings on matchup/box-out — see the G2 Wemby REB break and the Brunson points bust), the PRA composite aggregates three categories and is the single most reliable dimension in this series. Cross-team structure means neither leg depends on the winner. The KAT side is doubly supported by the G2 lesson — NYK\'s secondary creators carry when Brunson can\'t score. Math: 0.84 × 0.83 ≈ 70% combined. The complement to the minutes-vetted role floor.',
    result: { outcome:'loss', delta:'-$100', actual:'KAT 21 PRA BROKE the floor (Wemby\'s 46 hit). Lesson: even a "stable star PRA" leg is fragile when it depends on the player SCORING — KAT\'s reb/ast base (~10) couldn\'t backstop a 4-11 night vs Wemby\'s rim deterrence. Prefer minutes-secure role-player PRA (Harper/Champagnie) over scoring-dependent star PRA for floors.' },
  },
  {
    id: 'finals-g3-jun8-trad-sas-keep-close',
    slate: 'Finals-G3', date: '2026-06-08',
    category: 'traditional', type: 'best-bet',
    name: 'Finals G3 — SAS Covers in a Grind (3-Leg)',
    stake: 50, odds: '+360', payout: 'To Win: ~$180 (verify Mon evening)',
    legs: [
      { pick:'SAS +2.5 vs NYK (Finals G3)', odds:'-110', confidence:'lean', status:'hit',
        note:'HIT — SAS won 115-111 outright. The spread-value side is now 3-for-3 in the Finals.' },
      { pick:'Under 216.5 (Finals G3)', odds:'-110', confidence:'lean', status:'miss',
        note:'MISS — total 226 went OVER. The first OVER of the series; MSG\'s faster pace + OG\'s 28 ended the Finals-UNDER run. The leg that broke the stack.' },
      { pick:'Wembanyama Over 33.5 PRA (Finals G3)', odds:'-125', confidence:'lean', status:'hit',
        note:'HIT — 46 PRA (32/8/6). The Wemby monster game the SAS-covers script needed.' },
    ],
    thesis:'A CORRELATED stack on the model\'s actual G3 edge: the spread value is SAS +2.5 (NOT the NYK ML, which the model\'s 0-2 winner record warns against), and the coherent script is a desperate, defensively-tight SAS keeping it within a possession behind a heavy Wemby PRA night. All three legs move together — SAS covering a single-digit game correlates with both the UNDER and a high-usage Wemby. Math: 0.55 × 0.57 × 0.62 ≈ 19% combined; at +360 (4.6x) ≈ positive EV, lifted by leg correlation. Phase 71 R3 Finals cap → reduced $50 stake; CAUTION pill auto-stamps in the out-of-sample Finals.',
    result: { outcome:'loss', delta:'-$50', actual:'2 of 3 legs hit (SAS +2.5 ✓, Wemby 46 PRA ✓) but the UNDER 216.5 BROKE on a 226 total — the assumed grind/UNDER correlation didn\'t hold at MSG. The spread thesis was right (SAS won) but the total leg sank the parlay. SAS covered in a TRACK MEET, not a grind.' },
  },
  // ─── Finals G4 — Wed 6/10 @ MSG (NYK leads 2-1) ──────────────────
  {
    id: 'finals-g4-jun10-floor-sas-role-pra',
    slate: 'Finals-G4', date: '2026-06-10',
    category: 'floor', type: 'best-bet',
    name: 'Finals G4 — SAS Minutes-Vetted Role PRA (3-Leg)',
    stake: 100, odds: '+135', payout: 'To Win: ~$135 (verify Wed evening)',
    legs: [
      { pick:'Champagnie Over 9.5 PRA (alt — Finals G4)', odds:'-280', confidence:'floor', status:'hit',
        note:'13 PRA (5/5/3 + 4 STL) on 33 min — cleared even on a frigid 2-9 night. The composite backstopped the cold shooting.' },
      { pick:'Harper Over 9.5 PRA (alt — Finals G4)', odds:'-230', confidence:'floor', status:'hit',
        note:'28 PRA (21/4/3 on 8-12) in 32 min — team-best efficiency, the deepest clear of the night.' },
      { pick:'Wembanyama Over 27.5 PRA (alt — Finals G4)', odds:'-300', confidence:'floor', status:'hit',
        note:'38 PRA (24/13/1, 3 blk) on 9-25 — the 13 rebounds carried the composite past 27.5 on a cold scoring night. Fourth straight clear.' },
    ],
    thesis:'The minutes-vetted PRA floor that has now cleared EVERY leg in all three Finals games (and won the tier in G2 +$135 and G3 +$130), re-run for G4. Champagnie (27/13/18 PRA), Harper (25/23/25 PRA), and Wemby\'s deep-alt PRA (40/41/46) are all minutes-secure and rebound-independent — the structure deliberately keys the PRA composite and avoids both the standalone REB-alt (broke twice) and the scoring-dependent KAT star-PRA (broke in G3). This is the single most reliable structure in the series. Math: 0.90 × 0.88 × 0.91 ≈ 72% combined; each leg independently in the 80%+ deep-alt zone. Phase 71 R3 Finals stake cap holds at $100.',
    result: { outcome:'win', delta:'+$135', actual:'ALL THREE legs hit (Champagnie 13 PRA, Harper 28 PRA, Wemby 38 PRA) — the minutes-vetted role-PRA floor wins a third straight time it was authored (G2 +$135, G3 +$130, G4 +$135). Both Champagnie (2-9) and Wemby (9-25) shot cold and STILL cleared; the reb/ast/stl backstop is the whole thesis. The single most reliable structure in the series, now 3-for-3.' },
  },
  {
    id: 'finals-g4-jun10-floor-two-leg-role',
    slate: 'Finals-G4', date: '2026-06-10',
    category: 'floor', type: 'best-bet',
    name: 'Finals G4 — Wemby + Champagnie PRA (2-Leg Tight Floor)',
    stake: 100, odds: '+105', payout: 'To Win: ~$105 (verify Wed evening)',
    legs: [
      { pick:'Wembanyama Over 33.5 PRA (Finals G4)', odds:'-125', confidence:'floor', status:'hit',
        note:'38 PRA (24/13/1) on a cold 9-25 — the ~13-reb base carried it past 33.5. Reb-backed composite did exactly what the thesis predicted.' },
      { pick:'Champagnie Over 9.5 PRA (Finals G4)', odds:'-280', confidence:'floor', status:'hit',
        note:'13 PRA (5/5/3 + 4 STL) on 2-9 shooting, 33 secure min — cleared on a cold night via the rebound/steal floor.' },
    ],
    thesis:'A two-leg tight floor pairing the series\' most variance-proof star composite (Wemby PRA, reb/ast-backed) with its most minutes-secure role floor (Champagnie). Deliberately AVOIDS the KAT scoring-dependent star-PRA that broke the G3 cross-team floor — per the running retro, anchor floors on guaranteed reb/ast volume + locked minutes, not on a player needing to score. Both cleared all three Finals games. Math: 0.86 × 0.90 ≈ 77% combined — the highest-floor parlay on the slate. Phase 71 R3 Finals cap → $100.',
    result: { outcome:'win', delta:'+$105', actual:'Both legs hit (Wemby 38 PRA, Champagnie 13 PRA) despite BOTH shooting cold (9-25 and 2-9) — the reb/ast-backed-floor thesis vindicated: the highest-floor parlay on the slate cashed exactly as designed. The deliberate avoidance of the scoring-dependent KAT leg (which fell short at 25 PRA) was the correct call.' },
  },
  {
    id: 'finals-g4-jun10-trad-sas-even-series',
    slate: 'Finals-G4', date: '2026-06-10',
    category: 'traditional', type: 'best-bet',
    name: 'Finals G4 — SAS Covers + Wemby Monster (3-Leg)',
    stake: 50, odds: '+340', payout: 'To Win: ~$170 (verify Wed evening)',
    legs: [
      { pick:'SAS +1.5 vs NYK (Finals G4)', odds:'-110', confidence:'lean', status:'hit',
        note:'SAS lost by exactly 1 (106-107) → +1.5 covers. The spread-value side is now 4-for-4 in the Finals.' },
      { pick:'Wembanyama Over 33.5 PRA (Finals G4)', odds:'-125', confidence:'lean', status:'hit',
        note:'38 PRA (24/13/1) — cleared on the 13-reb base even on a 9-25 night.' },
      { pick:'Harper Over 11.5 PRA (Finals G4)', odds:'-150', confidence:'lean', status:'hit',
        note:'28 PRA (21/4/3 on 8-12) — blew past the deeper 11.5 line; SAS\'s most efficient scorer.' },
    ],
    thesis:'A CORRELATED stack on the model\'s G4 edge: the spread value is SAS +1.5 (NOT the NYK ML, which the 0-3 winner record warns against), and the coherent script is a tight, OT-character game with SAS riding G3 momentum behind a heavy Wemby PRA night and steady role-player production. All three legs move together — SAS covering a coin-flip game correlates with both a big Wemby composite and the secure-minutes bench guard producing. Math: 0.55 × 0.66 × 0.60 ≈ 22% combined; at +340 (4.4x) ≈ positive EV, lifted by leg correlation. Deliberately drops the UNDER leg that broke the G3 trad stack (MSG pace risk). Phase 71 R3 Finals cap → $50 stake; CAUTION pill auto-stamps.',
    result: { outcome:'win', delta:'+$170', actual:'ALL THREE legs hit (SAS +1.5 covered on the 1-pt loss, Wemby 38 PRA, Harper 28 PRA) — the correlated SAS-stays-close stack cashed at +340 even though SAS LOST: a 1-point game is a cover, and the spread-value side (4-4) plus the two PRA floors carried it. Dropping the G3-breaking UNDER leg was the correct adjustment. Traditional snaps its 0-3 Finals skid.' },
  },
  // ─── Finals G5 — Sat 6/13 @ Frost Bank Center (NYK leads 3-1) ─────
  {
    id: 'finals-g5-jun13-floor-sas-role-pra',
    slate: 'Finals-G5', date: '2026-06-13',
    category: 'floor', type: 'best-bet',
    name: 'Finals G5 — SAS Minutes-Vetted Role PRA (3-Leg)',
    stake: 100, odds: '+135', payout: 'To Win: ~$135 (verify Sat evening)',
    legs: [
      { pick:'Champagnie Over 9.5 PRA (alt — Finals G5)', odds:'-280', confidence:'floor', status:'hit',
        note:'Cleared ALL FOUR Finals games (27, 13, 18, 13) on 30-33 SECURE min — including a 2-9 cold-shooting night. Locked SAS bench wing; role deepens in an elimination home game. The anchor.' },
      { pick:'Harper Over 9.5 PRA (alt — Finals G5)', odds:'-230', confidence:'floor', status:'hit',
        note:'Cleared all four (25, 23, 25, 28) in 28-32 SECURE min — most efficient in G4 (21/4/3 on 8-12). Combo-guard composite, game-script-independent.' },
      { pick:'Wembanyama Over 27.5 PRA (alt — Finals G5)', odds:'-320', confidence:'floor', status:'hit',
        note:'40/41/46/38 PRA — the REB/FT/scoring composite cleared even on a cold 9-25 G4 via 13 boards. Max usage + minutes in an elimination home game. PRA line, NOT the REB-alt.' },
    ],
    thesis:'The minutes-vetted PRA floor that has cleared EVERY leg in all FOUR Finals games and won the tier each time it was authored (G2 +$135, G3 +$130, G4 +$135), re-run for an elimination G5 at home where SAS\'s rotation only tightens. Champagnie (27/13/18/13 PRA), Harper (25/23/25/28 PRA), and Wemby\'s deep-alt PRA (40/41/46/38) are all minutes-secure and rebound-backed — the structure keys the PRA composite and avoids both the standalone REB-alt and the scoring-dependent KAT star-PRA (both broke). The single most reliable structure in the series, 3-for-3 as a parlay. Math: 0.90 × 0.88 × 0.92 ≈ 73% combined; each leg independently in the 80%+ deep-alt zone. Phase 71 R3 Finals stake cap holds at $100.',
    result: { outcome:'win', delta:'+$135', actual:'ALL THREE legs hit (Champagnie 22 PRA, Harper 34 PRA, Wemby 35 PRA) — the minutes-vetted role-PRA floor wins a FOURTH straight time it was authored (G2 +$135, G3 +$130, G4 +$135, G5 +$135) and cleared every leg in all five Finals games, even in the title-clinching SAS loss. Harper\'s team-high 25 and Wemby\'s reb-backed 35 carried it. The single most reliable structure in the playoffs, 4-for-4.' },
  },
  {
    id: 'finals-g5-jun13-floor-two-leg',
    slate: 'Finals-G5', date: '2026-06-13',
    category: 'floor', type: 'best-bet',
    name: 'Finals G5 — Wemby + Harper PRA (2-Leg Tight Floor)',
    stake: 100, odds: '+115', payout: 'To Win: ~$115 (verify Sat evening)',
    legs: [
      { pick:'Wembanyama Over 33.5 PRA (Finals G5)', odds:'-125', confidence:'floor', status:'hit',
        note:'40/41/46/38 PRA all four games. Carried by a guaranteed ~13-reb base, NOT scoring alone — cleared on the cold 9-25 G4. Max usage in elimination.' },
      { pick:'Harper Over 9.5 PRA (Finals G5)', odds:'-230', confidence:'floor', status:'hit',
        note:'25/23/25/28 PRA on 28-32 SECURE min every game. The most consistent role floor in the series; cleared all four.' },
    ],
    thesis:'A two-leg tight floor pairing the series\' most variance-proof star composite (Wemby PRA, reb-backed) with its most consistent role floor (Harper, 25/23/25/28). Deliberately keys the two cleanest cleared-every-game lines and anchors on guaranteed reb/ast volume + locked minutes per the running retro (avoids the scoring-dependent KAT star-PRA that fell short twice). Both cleared all four Finals games. Math: 0.86 × 0.90 ≈ 77% combined — the highest-floor parlay on the slate. Phase 71 R3 Finals cap → $100.',
    result: { outcome:'win', delta:'+$115', actual:'Both legs hit (Wemby 35 PRA on 19/14/5blk, Harper 34 PRA on a team-high 25) — the two cleanest cleared-every-game lines delivered again in the clincher. The highest-floor parlay on the slate cashed exactly as designed, perfect across the Finals.' },
  },
  {
    id: 'finals-g5-jun13-trad-sas-stays-alive',
    slate: 'Finals-G5', date: '2026-06-13',
    category: 'traditional', type: 'best-bet',
    name: 'Finals G5 — SAS Grind Stays Alive (3-Leg)',
    stake: 50, odds: '+330', payout: 'To Win: ~$165 (verify Sat evening)',
    legs: [
      { pick:'Under 211.5 (Finals G5)', odds:'-110', confidence:'lean', status:'hit',
        note:'BOTH Frost Bank games went UNDER (200, 209); the only OVER was faster MSG (226). Back on the grind court, the venue-backed UNDER is the cleaner total read. Lead leg.' },
      { pick:'Wembanyama Over 33.5 PRA (Finals G5)', odds:'-125', confidence:'lean', status:'hit',
        note:'40/41/46/38 PRA. A controlled grind game (UNDER script) with max elimination usage correlates with a heavy Wemby composite. Correlated with the UNDER.' },
      { pick:'Harper Over 11.5 PRA (Finals G5)', odds:'-150', confidence:'lean', status:'hit',
        note:'25/23/25/28 PRA — pushed one tick deeper than the floor line. A SAS-stays-alive grind means the secure bench guard keeps producing. Rounds out the stack.' },
    ],
    thesis:'A CORRELATED stack on the model\'s coherent G5 script: a controlled, venue-backed UNDER grind (both SA games went under) at Frost Bank with maximum Wembanyama usage in an elimination game and steady role-player production. Deliberately AVOIDS both the moneyline (the 1-3 Finals winner record warns against the side) and the spread (engine SAS by 3 sits AT the line — no edge). All three legs move with a SAS-stays-alive half-court game. Math: 0.55 × 0.66 × 0.62 ≈ 23% combined; at +330 (4.3x) ≈ positive EV, lifted by leg correlation. The G3 lesson (UNDER broke at MSG pace) is mitigated by the Frost Bank venue here. Phase 71 R3 Finals cap → $50 stake; CAUTION pill auto-stamps.',
    result: { outcome:'win', delta:'+$165', actual:'ALL THREE legs hit (UNDER 211.5 on a 184 total, Wemby 35 PRA, Harper 34 PRA) — the correlated grind/role-production stack cashed in the title-clinching defensive rock fight. The UNDER blew out by 27 (lowest total of the series) and both PRA floors held even as SAS lost the championship; the structure carried regardless of the winner. The cleanest correlated stack of the series.' },
  },
];

// ============================================================
// Slate metadata — header info for each slate's series
// ============================================================
// Tier 1.2: each game uses STRUCTURED date/time/venue fields. The
// `when` string is auto-derived by buildWhenLabel() below; SLATE_GAME_DATES
// in home.js is auto-derived from these dates. This is now the single
// source of truth for game scheduling — no parallel maps to keep in sync.
//
// Schema per game:
//   series  : 'NYK-PHI'           → matches SERIES_DATA.id suffix
//   date    : 'YYYY-MM-DD'        → drives Home page Tonight/Tomorrow detection
//   time    : '7:00 PM ET'        → display only
//   venue   : 'MSG'               → display only
//   context : 'NYK leads 1-0'     → series state at time of slate
//   recap   : '<strong>...'        → HTML-rich slate-header narrative
//
// Backward compat: if a future entry omits date/time/venue but includes
// `when`, the parser in `buildWhenLabel` returns it as-is.
// ============================================================
function buildWhenLabel(g) {
  if (g.date && g.time && g.venue) {
    const [y, m, d] = g.date.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    const wd = dt.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const md = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    return `${wd} ${md}, ${g.time} @ ${g.venue}`;
  }
  return g.when || '';
}

const BET_SLATES = {
  'R2-G1': {
    label: 'Round 2 — Game 1 (Archive)',
    games: [
      { series:'NYK-PHI', date:'2026-05-04', time:'8:00 PM ET', venue:'MSG', context:'Series 0-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 137-98 — most lopsided R2 G1 in a decade. Brunson 35pts (12-18 FG). Embiid 14pts (3-11). PHI 48hr turnaround was catastrophic.' },
      { series:'SAS-MIN', date:'2026-05-04', time:'9:30 PM ET', venue:'Frost Bank Center', context:'Series 0-0',
        recap:'<strong style="color:var(--red)">Result:</strong> MIN 104-102 (UPSET). Wemby 0-8 3PT (career worst) but 15reb/12blk. Edwards off bench: 18pts in 25min. SAS shot 28% 3PT (10-36).' },
      { series:'DET-CLE', date:'2026-05-05', time:'7:00 PM ET', venue:'LCA', context:'Series 0-0',
        recap:'<strong style="color:var(--green)">Result:</strong> DET 111-101. Cade 23/7ast, D.Robinson 19pts (5-8 3PT). DET forced 19 CLE TOs. Allen limited to 18min (knee).' },
      { series:'OKC-LAL', date:'2026-05-05', time:'8:30 PM ET', venue:'Paycom Center', context:'Series 0-0',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 108-90 (+18). Holmgren 24/12/3blk. SGA only 18pts (7 TOs!) but OKC still dominated. Reaves catastrophic 3-16 FG.' },
    ],
  },
  'R2-G2': {
    label: 'Round 2 — Game 2 (Archive)',
    games: [
      { series:'NYK-PHI', date:'2026-05-06', time:'7:00 PM ET', venue:'MSG', context:'NYK leads 1-0',
        recap:'<strong style="color:var(--red)">🚨 EMBIID OUT G2:</strong> Ruled out morning of May 6 with right ankle sprain + right hip soreness. Did not participate in shootaround. PHI projected lineup: Maxey/Edgecombe/Oubre/George/Drummond. <strong style="color:var(--green)">G1 Recap:</strong> NYK 137-98 blowout. Brunson 35pts (12-18 FG). NYK 63% FG, 51% 3PT. Embiid 3-11 (-24). <strong>Key G2 Factor:</strong> Without Embiid, PHI ceiling collapses entirely — Drummond cannot create offense, and KAT stretch-5 will pull him out of the paint. Mitchell Robinson (NYK) questionable with illness. Spread re-priced from -7.5 to -10.5+.' },
      { series:'SAS-MIN', date:'2026-05-06', time:'9:30 PM ET', venue:'Frost Bank Center', context:'MIN leads 1-0',
        recap:'<strong style="color:var(--yellow)">G1 Recap:</strong> MIN 104-102 upset. Wemby 0-8 3PT (career worst) but 15reb/12blk. Edwards off bench: 18pts in 25min. Fox -13 (0-4 3PT). SAS shot 28% 3PT (10-36). MIN won Q4 35-30. <strong style="color:var(--yellow)">G2 Update (May 6):</strong> Edwards listed as <strong>QUESTIONABLE</strong> for G2 — knee bothered him at the end of G1. SAS rotation healthy, no new concerns. <strong>Key G2 Factor:</strong> Wemby\'s 3PT regresses to 37.5% mean. Fox must be aggressive. Dosunmu returns for MIN.' },
      { series:'DET-CLE', date:'2026-05-07', time:'7:10 PM ET', venue:'LCA', context:'DET leads 1-0',
        recap:'<strong style="color:var(--green)">Result:</strong> DET 107-97 — DET leads 2-0. Cade 25/10ast (12 of 25 in Q4 closing run), Tobias Harris 21, D.Robinson 17 (5-9 3PT), Jenkins 14 off bench (3rd straight bench DD-figures). Allen healthy this time (22/7) but Mitchell\'s game-high 31pts couldn\'t carry — DET\'s structural defense + Cade\'s Q4 run sealed it. DET ML hit -162; spread (DET -3.5) covered by 6.5; total 204 stayed under 214.5.' },
      { series:'OKC-LAL', date:'2026-05-07', time:'9:30 PM ET', venue:'Paycom Center', context:'OKC leads 1-0',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 125-107 — OKC leads 2-0. Same +18 margin as G1 in a totally different style. Holmgren 22/9/3ast/4stl/2blk (steady), SGA limited to 22 (foul trouble). Reaves bounced back hard for LAL: game-high 31 (10-16, 6 ast) with the oblique evidently improved. LeBron 23 (9-18, 6 ast) facilitator-mode. Game flipped on 21 LAL TOs that OKC turned into 26 transition points. OKC ML hit; OKC -15.5 covered by 2.5; total 232 went OVER 209.5 by 22.5 (turnover-driven track meet).' },
    ],
  },
  'R2-G3': {
    label: 'Round 2 — Game 3 (Archive)',
    games: [
      { series:'NYK-PHI', date:'2026-05-08', time:'7:00 PM ET', venue:'Wells Fargo Center', context:'NYK leads 2-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 108-94 — NYK leads 3-0 (sweep cliff). Brunson 33pts/5reb/9ast (11-22 FG, 38min) — 24th career 30+ playoff game (most in Knicks history). Bridges 23pts (8-14 FG). Hart 12pts/11reb (workhorse double-double). KAT 8pts/12reb/7ast in 26min (passive on offense, dominant on glass — 4 OREB). Shamet bench spark: 15pts. NYK shot 23-of-32 FT. Oubre 22pts (PHI team-high), Embiid back from ankle/hip OUT for 18pts in 35min (rusty but functional), Maxey 17pts, George 15pts (all in Q1, then 0-of-9 the rest of the way). OG Anunoby OUT (left hamstring strain). NYK turned back repeated PHI rallies — Wells Fargo crowd never got the run that flips momentum.' },
      { series:'SAS-MIN', date:'2026-05-08', time:'9:30 PM ET', venue:'Target Center', context:'Series tied 1-1',
        recap:'<strong style="color:var(--green)">Result:</strong> SAS 115-108 — SAS leads 2-1. Wembanyama 39pts/15reb/5blk (3 made 3PT, 10 FT made, 5 fouls) — joined Kareem/Hakeem/Shaq company with the stat line. Edwards returned to the starting lineup for the first time since 4/26 hyperextension (15pts/7reb/1ast) — knee held up but rust + SAS rotations limited his usual rim aggression. SAS led 18-3 to start; halftime tied 51-51; SAS up 86-79 entering Q4. Castle 8/2/7ast, Vassell 8/4. Carter Bryant, K.Johnson, Champagnie each made 2 threes. Wemby\'s rebounding floor (15 in BOTH G2 and G3) was the structural anchor. Model: predicted SAS by 9, actual SAS by 7 — within 2 pts.' },
      { series:'OKC-LAL', date:'2026-05-09', time:'8:30 PM ET', venue:'Crypto.com Arena', context:'OKC leads 2-0',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 131-108 — OKC leads 3-0 (sweep cliff, 7-0 in playoffs overall). Ajay Mitchell career-high 24pts/10ast (10-17 FG) led OKC; SGA cruise control again with 23pts/9ast on 7-20 FG. Holmgren 18/9/1blk. Cason Wallace 16pts (4-6 3PT). Hartenstein 12/9 (+26). LAL: Hachimura 21 (5-8 3PT), LeBron 19/6/8 in 37min/age 41 facilitator mode, Reaves regression to 17 (5-13 from 31 G2), Kennard 18 off bench. OKC bench outscored LAL bench 59-31. Third straight blowout +23 — same script, bigger margin.' },
      { series:'DET-CLE', date:'2026-05-09', time:'3:00 PM ET', venue:'Rocket Mortgage FieldHouse', context:'DET leads 2-0',
        recap:'<strong style="color:var(--green)">Result:</strong> CLE 116-109 — DET leads 2-1 (5-game playoff win streak snapped). Mitchell 35/10reb/4ast (13-24 FG) sustained G2 form; Harden bounce-back 19pts (8-14, 3-7 3PT) hit three big shots late; Allen 18/4/2blk (7-9 FG); Strus 7pts/5reb but came up with the steal and go-ahead basket; Mobley 13/8/4ast; Schroder 11pts (3-3 3PT) bench spark; Merrill returned (7pts in 14min). DET: Cade triple-double 27/10/10 on 10-27 FG / 8 TOs (high-volume mode), Harris 21pts (5-5 FT), D.Robinson 15pts (5 STL!), Reed 11pts in 10min off bench. CLE bench finally outscored DET bench (28-24). Model: CLE by 4 predicted, CLE by 7 actual — within 3pts.' },
    ],
  },
  'R2-G4': {
    label: 'Round 2 — Game 4 (Archive)',
    games: [
      { series:'NYK-PHI', date:'2026-05-10', time:'3:30 PM ET', venue:'Wells Fargo Center', context:'NYK leads 3-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 144-114 — series-clinching closeout, NYK SWEEPS 4-0, advances to ECF. McBride 25pts (7-9 3PT, started for OG out), Brunson 22, Hart 17, KAT 17/4/10ast, Shamet 12 (4 threes off bench). NYK tied NBA postseason record with 25 made 3s (25-44, 56.8%); set new playoff record with 11 made threes in Q1. PHI 8-35 3PT (22%), 35-51 2PT (68%) — Embiid 24, Maxey 17 not enough to keep up with the 3PT barrage. Model predicted NYK by 4; actual NYK by 30 — RIGHT WINNER, magnitude missed by 26pts via 3PT variance.' },
      { series:'SAS-MIN', date:'2026-05-10', time:'7:30 PM ET', venue:'Target Center', context:'SAS leads 2-1',
        recap:'<strong style="color:var(--green)">Result:</strong> MIN 114-109 — series TIED 2-2. WEMBANYAMA EJECTED early Q2 (Flagrant 2 elbow to Naz Reid\'s neck on a double-team) — first career ejection. Wemby line: 4pts/4reb/0blk in 13min. Edwards 36 (16 in Q4 closing 4pt swing) — knee fully back. Reid 15/9 (took the elbow, finished the game). McDaniels 14, Randle 12, Gobert 11/13. SAS guards Harper 24, Fox 24, Castle 20 (68 combined without Wemby) — nearly stole it at 102-99 with 4min left before Edwards\' Q4. NBA review cleared Wemby — no suspension, plays G5. Model: SAS by 3 with Wemby; the ejection swing produced MIN by 5 — wrong winner but within 8pts via the variance shock.' },
      { series:'DET-CLE', date:'2026-05-11', time:'8:00 PM ET', venue:'Rocket Mortgage FieldHouse', context:'DET leads 2-1',
        recap:'<strong style="color:var(--green)">Result:</strong> CLE 112-103 — series TIED 2-2. Donovan Mitchell 43pts (13-26 FG, 13-14 FT) — 39 PTS IN 2H tied Sleepy Floyd\'s 1987 NBA playoff record for most points in a half; career playoff scoring high. Started 0-7 with 4pts at halftime (CLE down 56-52), then erupted for 21pts in Q3 alone matching DET\'s entire Q3 total (CLE 38-21 Q3). Harden 24pts/11ast (40th career playoff DD). Mobley 17/8/5ast/5blk/3stl. Allen 14/8/2blk. DET: Caris LeVert SEASON-HIGH 24pts off the bench; Cade 19pts (FIRST under-20 in 11 straight playoff games) as CLE doubled aggressively. Harris 16, D.Robinson 12. Model predicted CLE by 3, actual CLE by 9 — RIGHT WINNER, Mitchell tail-event accounted for the margin miss. Series shifts to LCA for G5 Wednesday May 13.' },
      { series:'OKC-LAL', date:'2026-05-11', time:'10:30 PM ET', venue:'Crypto.com Arena', context:'OKC leads 3-0',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 115-110 — OKC SWEEPS 4-0, advances to Western Conference Finals (8-0 in playoffs overall — ties 5th-best start in NBA history). Toughest playoff win of OKC\'s postseason — first single-digit margin after three straight blowouts. SGA 35pts/8ast — first 30+ of the series after 18/22/23 cruise. Holmgren tiebreaking dunk off Hartenstein assist with 32.8s left; 8 of his 16 pts came in final 5:10 of Q4. Ajay Mitchell 28pts (10 in Q4). Hartenstein 5/10/5ast/5stl in 28min. LAL fought hard in elimination at home: Reaves 27 (team-high), Hachimura 25, LeBron 24/12reb at age 41 in his final home playoff game. Model predicted OKC by 5, actual OKC by 5 — BULLSEYE.' },
    ],
  },
  'R2-G5': {
    label: 'Round 2 — Game 5 (Archive)',
    games: [
      { series:'SAS-MIN', date:'2026-05-12', time:'8:00 PM ET', venue:'Frost Bank Center', context:'Series tied 2-2',
        recap:'<strong style="color:var(--green)">Result:</strong> SAS 126-97 — SAS leads 3-2. Wembanyama historic return from ejection: 27pts/17reb/5ast/3blk + 2 made 3s (first player in NBA postseason history with that stat line since 3PT line introduced in 1979-80). 18 of his 27 came in Q1. SAS led by 30 at peak; 68-36 paint advantage. K.Johnson 21 (8-11 FG) bench spark. Fox 18/5ast. Castle 17/7ast. Harper 12/10 (5 OREB). MIN: Randle 17/10 DD, Edwards 20 (sharp regression from G3-G4 32/36), Dosunmu 16 off bench. Model: predicted SAS by 8; actual SAS by 29 — RIGHT WINNER, +21 margin underestimate.' },
      { series:'DET-CLE', date:'2026-05-13', time:'8:00 PM ET', venue:'Little Caesars Arena', context:'Series tied 2-2',
        recap:'<strong style="color:var(--red)">Result:</strong> CLE 117-113 OT — CLE leads 3-2. Home-team-wins pattern FINALLY broken. DET led 103-94 with 2min left; CLE 9-0 closing run to force OT, then 13-0 over the late-Q4-to-mid-OT stretch. Harden CAREER PLAYOFF HIGH 30/8/6. Mitchell 21 (deferred to Harden in comeback). Mobley 19 (tying FTs). Strus 20 on 6 made 3s. Allen 16/9. DET: Cade CAREER PLAYOFF HIGH 39/7/9 (bounce-back from G4 sub-20). Jenkins 19 off bench. Model: predicted DET by 5; actual CLE by 4 (OT) — WRONG WINNER, 9pt swing.' },
    ],
  },
  'R2-G6': {
    label: 'Round 2 — Game 6 (Archive)',
    games: [
      { series:'SAS-MIN', date:'2026-05-15', time:'7:00 PM ET', venue:'Target Center', context:'SAS leads 3-2',
        recap:'<strong style="color:var(--green)">Result:</strong> SAS 139-109 — SAS WINS SERIES 4-2, advances to WCF vs OKC. Castle MASTERPIECE 32pts/11reb/6ast (11-of-16 FG, 5-of-7 3PT) in the closeout. Wemby quieter than usual (19/6/6ast/3blk in 27min, capped by blowout). Fox 21/9ast. All five SAS starters in double figures. SAS led wire-to-wire, by as many as 34; 20-0 SAS run early Q2. MIN: Edwards 24 on 9-of-26 FG (volume came, efficiency didn\'t — Castle perimeter D). Randle + Gobert COMBINED 3 PTS on 1-of-12 FG (catastrophic). The home-team-wins-every-game pattern broke in the elimination spot. Model: predicted MIN by 2 (LOW), actual SAS by 30 — WRONG WINNER, +32 margin miss.' },
      { series:'DET-CLE', date:'2026-05-15', time:'7:00 PM ET', venue:'Rocket Arena', context:'CLE leads 3-2',
        recap:'<strong style="color:var(--green)">Result:</strong> DET 115-94 — series TIED 3-3, G7 at LCA Sun 5/17. DET\'s 21-pt road win tied a 66-year-old NBA playoff record for largest G6 road win by a team trailing 3-2. CLE\'s first home loss of the entire 2026 playoffs (6-0 → 6-1 at Rocket). Cade 21/9/7 distributing (not hero-mode); Jenkins 15 bench spark; Duren 15/11/3blk dominated the paint; Harris 14, D.Robinson 11 (3-7 3PT). DET held CLE to 41% FG, forced 16 TOs. CLE: Harden 23, Mitchell 18 (sub-Mitchell night), Mobley 18/8/8 (near triple-double), Allen passive 10/7, Strus regressed to 9 (from G5\'s 20). Model: predicted CLE by 6 (MEDIUM), actual DET by 21 — WRONG WINNER, +27 margin miss.' },
    ],
  },
  'R2-G7': {
    label: 'Round 2 — Game 7 (Archive)',
    games: [
      { series:'DET-CLE', date:'2026-05-17', time:'TBD ET', venue:'Little Caesars Arena', context:'Series tied 3-3',
        recap:'<strong style="color:var(--green)">Result:</strong> CLE 125-94 — CLE WINS SERIES 4-3, ADVANCES TO ECF VS NYK. Cavs road blowout in DET — Mitchell 26pts (15 in Q3 dagger run, only 31min, 0 TOs), Allen 23/7reb (knee held up), Merrill 23 off bench (5-8 3PT, bench game of the playoffs), Mobley 21/12reb (2blk/2stl), Harden 9/6ast (gravity-game). CLE shot 50.6% FG, 50-41 rebound edge, forced 14 DET TOs. <strong style="color:var(--red)">DET COLLAPSED at home:</strong> Cade career-low 13pts on 5-16 FG / 0-7 3PT (CLE schemed him off the floor). Harris 0-6 FG (5pts, biggest no-show). Duren 7/9 with 3 TOs vs Allen/Mobley. Jenkins led DET with 17 off bench but inefficient (4-12). <strong>MODEL: DET by 4 LOW; ACTUAL CLE by 31</strong> — wrong-winner G7 (third straight wrong call in this series). Phase 71 audit\'s G6/G7 50%-accuracy / 19.8pt-MAE banner held. ECF G1 is Tue 5/19 at MSG (CLE on 1 day rest vs NYK on 9 days rest).' },
    ],
  },
  'CF-G1': {
    label: 'Conference Finals — Game 1 (Archive)',
    games: [
      { series:'OKC-SAS', date:'2026-05-18', time:'8:30 PM ET', venue:'Paycom Center', context:'WCF G1',
        recap:'<strong style="color:var(--red)">Result:</strong> SAS 122-115 (2OT) — SAS leads WCF 1-0. <strong>Instant classic</strong>: Wemby 41pts/24reb/3blk in 49+min, joined Wilt as the only players with 40+pts and 20+reb in their Conference Finals debut. Harper 24pts/11reb/6ast/7stl (first rookie with 15+/5+/5stl in a playoff game since Magic Johnson 1980). SGA 24/12ast on 7-23 FG — Castle/Harper hounded him at the POA. Caruso 31pts off bench (8 made threes) was OKC\'s offensive lifeline. Wemby hit a Curry-range logo three to send to 2OT. The 4-1 reg-season SAS pattern held — they stole HCA on the road.' },
      { series:'NYK-CLE', date:'2026-05-19', time:'8:00 PM ET', venue:'Madison Square Garden', context:'ECF G1',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 115-104 (OT) — NYK leads ECF 1-0. <strong>22-POINT COMEBACK</strong> — one of the greatest in NBA postseason history. CLE led 93-71 with 7:52 left in Q4; NYK closed on a 44-11 run to force OT then win it. Brunson 38pts/5reb/6ast carried the rally. KAT 13/13/5/1blk anchored the interior. Mitchell 29pts/6stl on 12-23 FG / 4-11 3PT — but only 3pts in Q4+OT (1-6 over the final 17min). Mobley 15/14/3blk. CLE shot 22% over the closing stretch as NYK switched to small-ball + aggressive POA pressure on Harden. The 9-day-rest NYK looked completely outclassed for 41 minutes, then suddenly didn\'t.' },
    ],
  },
  'CF-G2': {
    label: 'Conference Finals — Game 2 (Archive)',
    games: [
      { series:'OKC-SAS', date:'2026-05-20', time:'8:30 PM ET', venue:'Paycom Center', context:'SAS leads 1-0',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 122-113 — series TIED 1-1. SGA bounce-back 30pts/9ast (clinical, sealed late with a jumper). Holmgren 13, Caruso 17 off bench (sustaining G1 form), Cason Wallace + Jared McCain 12 each. OKC led for 80% of the game; forced 21 SAS TOs → 27 transition points. SAS: Wemby 21/17/6ast/4blk (steady but couldn\'t carry), Castle 25/8ast, Vassell 22. OKC bench outscored SAS 57-25 — the decisive structural edge. Wemby on minutes restriction in Q4 after 49+min G1 marathon — OKC closed when SAS legs faded. Pressure D was the OKC win condition.' },
      { series:'NYK-CLE', date:'2026-05-21', time:'8:00 PM ET', venue:'Madison Square Garden', context:'NYK leads 1-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 109-93 — NYK leads 2-0. Hart PLAYOFF CAREER-HIGH 26pts. Brunson 19/14ast (facilitator night — leaning into KAT/Hart roles). NYK ran an 18-0 third-quarter run to 71-53, the decisive momentum shift. CLE 0-for-13 stretch mirrored the late-G1 collapse — Harden specifically targeted by NYK switches. Mitchell 26, Harden 18, but couldn\'t recover. NYK halfway to first Finals appearance since 1999.' },
    ],
  },
  'CF-G3': {
    label: 'Conference Finals — Game 3 (Archive)',
    games: [
      { series:'OKC-SAS', date:'2026-05-22', time:'8:30 PM ET', venue:'Frost Bank Center', context:'Series tied 1-1',
        recap:'<strong style="color:var(--red)">Result:</strong> OKC 123-108 — OKC LEADS 2-1. SAS started 15-0 (longest CF-opening run since PBP era 1997) then OKC outscored SAS by 30 the rest of the way. SGA 26/12ast, Jared McCain CAREER PLAYOFF-HIGH 24 off bench (+28), Jaylin Williams 18 off bench, Caruso 15. <strong>OKC bench 76, SAS bench 23 — structural decider.</strong> SAS: Wemby 26/4reb/3ast/2blk (OKC double-boxed; reb dropped from 20.5 avg to 4), Fox 15/7/6 (sharp post-Wed scare), Castle 13/4/6 (playing through Wed contact, +14 FT), Harper 6 off bench. Model: SAS by 4 → actual OKC by 15. WRONG WINNER.' },
      { series:'NYK-CLE', date:'2026-05-23', time:'8:00 PM ET', venue:'Rocket Arena', context:'NYK leads 2-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 121-108 — NYK LEADS 3-0 (sweep cliff, 10th straight playoff win). Brunson 30/3/6 (10-19 FG / 10-12 FT), Bridges 22/6/2 on 11-15 FG (efficiency masterclass), Anunoby 21/7/4 (6-10 FG / 3-4 3PT / 6-6 FT — perfect-line wing), Hart 12/9/5, Shamet bench spark 14 (4-5 3PT). NYK 55.8% FG, 11-28 3PT, 24-27 FT (88.9%). CLE: Mobley 24/6 (10-18 FG), Mitchell 23/1/4 (9-21 FG / 3-10 3PT), Harden 19/5/5 (6 TOs), Allen 17/7 efficient (7-9), Strus 13/7/6. CLE 50% FG but 12-41 from 3 (29.3%) + only 12-19 FT. <strong>Model: CLE by 6 → actual NYK by 13. WRONG WINNER, 19pt margin miss.</strong>' },
    ],
  },
  'CF-G4': {
    label: 'Conference Finals — Game 4 (Archive)',
    games: [
      { series:'OKC-SAS', date:'2026-05-24', time:'8:00 PM ET', venue:'Frost Bank Center', context:'OKC leads 2-1',
        recap:'<strong style="color:var(--green)">Result:</strong> SAS 103-82 — series TIED 2-2. Wembanyama 33pts/8reb/5ast/3blk (+29) with a 40-foot 1H buzzer-beater and a 27-footer 24 sec into the game. Fox 12/10/5 DD, Castle 13, Vassell 13. SAS held OKC to its 2nd-lowest postseason total ever — 33% FG, 6-of-33 from 3PT (18%). Spurs opened on a 16-0 run for a 23-8 lead and never trailed; OKC scoring drought 5:08 in Q1. SGA 19 on 6-15. Caruso 8 (1-5 3PT cooldown from G3 heater); J.Williams 6 (regression from G3 22pt eruption). Game 5 Tue 5/26 at Paycom Center, 8:30 PM ET — series 2-2.' },
      { series:'NYK-CLE', date:'2026-05-25', time:'8:00 PM ET', venue:'Rocket Arena', context:'NYK leads 3-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 130-93 — NYK WINS SERIES 4-0, ADVANCES TO NBA FINALS (first Finals trip since 1999). Most lopsided closeout in franchise playoff history. Brunson 15/5ast in 28min (0 Q4 min) — ECF MVP. KAT 19/14, OG Anunoby 17, Bridges 15, Shamet 16 off bench. CLE: Mitchell 31 (career-worst sweep), Mobley 15/7, Harden 12 on 0-of-6 3PT (NYK switches fully neutralized him). NYK led by as many as 40. Model: NYK by 7 predicted, NYK by 37 actual — right winner, +30pt margin underestimate.' },
    ],
  },
  'CF-G5': {
    label: 'Conference Finals — Game 5 (Archive)',
    games: [
      { series:'OKC-SAS', date:'2026-05-26', time:'8:30 PM ET', venue:'Paycom Center', context:'Series tied 2-2',
        recap:'<strong style="color:var(--green)">Result:</strong> OKC 127-114 — OKC LEADS 3-2, one win from the Finals. SGA 32/9ast (7-19 FG, a surgical 16-of-17 FT), Alex Caruso 22 off the bench (3 stl), Jared McCain 20 (bench heater, 4 threes), Holmgren 16/11, Hartenstein 12/15 on the glass. OKC held Wembanyama to a series-LOW 20pts on 4-of-15 FG and just 6 reb via the Hartenstein/Holmgren box-out. SAS: Castle 24/6ast (7-11), Julian Champagnie career playoff-high 22 off the bench (4 threes), De\'Aaron Fox 9/8ast through the leg. <strong>Model: OKC by 4 predicted, OKC by 13 actual — RIGHT WINNER, +9 margin underestimate</strong> (mean-reversion from G4\'s 6-33 3PT dud landed). Slate 2-2 (+$95): OKC home stack was the first CF traditional winner; both Wemby floor stacks lost to the box-out. Series shifts to Frost Bank Center for G6 Thu 5/28 — SAS faces elimination.' },
    ],
  },
  'CF-G6': {
    label: 'Conference Finals — Game 6 (Archive)',
    games: [
      { series:'OKC-SAS', date:'2026-05-28', time:'8:30 PM ET', venue:'Frost Bank Center', context:'OKC leads 3-2',
        recap:'<strong style="color:var(--green)">Result:</strong> SAS 118-91 — series TIED 3-3, forcing a winner-take-all Game 7. Wembanyama answered the G5 box-out (28/10/2blk in 28min) by getting deep touches before the double arrived; Castle 17/9ast ran the offense, Champagnie 10/6 and Keldon 14 off the bench. A 20-0 third-quarter run (OKC scoreless for nearly seven minutes) blew it open and SAS led wire to wire. OKC: SGA held to a series-LOW 15 on 5-15 FG (Castle POA + the Frost Bank crowd), Jalen Williams returned from the 3-game hamstring absence (11/3stl in 20 limited min), Holmgren 10/11. No bench eruption (Caruso 7, McCain 11 — the road-cooldown pattern). <strong>Model: SAS by 3 predicted, SAS by 27 actual — RIGHT WINNER, +24 margin underestimate</strong> (the Phase 73 elimination amplifier honestly carried the blowout tail). Slate 1-3 (-$115): the role-player PRA floor was the lone winner (+$135; Champagnie/Keldon/Harper all cleared O9.5 PRA), while BOTH star floors broke on SGA\'s 4ast/15pt down game. Winner-take-all G7 Sat 5/30 at Paycom Center — winner faces the Knicks in the NBA Finals.' },
    ],
  },
  'CF-G7': {
    label: 'Conference Finals — Game 7 (Archive)',
    games: [
      { series:'OKC-SAS', date:'2026-05-30', time:'8:00 PM ET', venue:'Paycom Center', context:'Series tied 3-3',
        recap:'<strong style="color:var(--red)">Result:</strong> SAS 111-103 — SAS WINS WCF 4-3, advances to NBA Finals (first Finals trip since 2014 championship). Spurs led 92% of the game. Wembanyama 22/7/3blk (quieter than CF norm but rim deterrence anchored a 102-104 def rating night), Champagnie 20pts off bench (4-7 3PT) — bench scorer of the series, Castle 18/6ast/5reb (POA pressure on SGA), Harper 14/5/4, Fox 13/8ast (3-12 FG but ran the offense + late FTs). OKC: SGA 35/9ast (12-26 FG, 9-10 FT) — series-best volume but Castle/Harper forced 5 TOs, Wallace 17 (14 in Q4 lone heater), Holmgren 12/9 (Wemby gravity again), Caruso 8 / McCain 6 (home-bench eruption never landed). MODEL: predicted OKC by 5 (MEDIUM, COIN FLIP); ACTUAL SAS by 8 — WRONG WINNER. Phase 73 amplifier was ACTIVE; the MC distribution honestly carried SAS-win mass. Phase 71 R3 caveat fires for the 4th time in the WCF (engine 3-4 on winners). Slate 2-3 (+$200 net): role-player PRA floor +$135 / cross-team stable-dim floor +$115 / OKC home stack -$50. PRA dimension now 13/13 across the playoffs. Series shifts to NBA Finals: SAS hosts NYK G1 Wed 6/3 at Frost Bank Center, 8:30 PM ET on ABC.' },
    ],
  },
  'Finals-G1': {
    label: 'NBA Finals — Game 1 (Archive)',
    games: [
      { series:'SAS-NYK', date:'2026-06-03', time:'8:30 PM ET', venue:'Frost Bank Center', context:'Series 0-0 — first Finals game',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 105-95 — Knicks STEAL Game 1 on the road, lead 1-0. New York erased a 14-point Q3 deficit and outscored SAS 57-40 in the second half, closing on an 11-0 run. Brunson 30 (12-31 FG, clutch late), KAT 18/12, OG Anunoby 17 (3-6 3PT), Josh Hart 3/15reb/6ast/4stl (unsung engine), Shamet 13 off the bench. Mitchell Robinson (fractured hand) anchored Wemby\'s 6-21 night. SAS: Wembanyama 26/12/3blk (inefficient debut), Castle 17/8 (held Brunson\'s FG% but only 3 ast), Champagnie 16/10 + Harper 16/8 off the bench, Fox 7 on 3-13. SAS shot 36% FG / 26% 3PT — first-look defensive tightness hit the HOME team. <strong>Model: SAS by 2 → actual NYK by 10 (WRONG WINNER, Finals out-of-sample caveat fired G1).</strong> Total 200 cashed the UNDER 215.5. Parlays 0-3 (-$250): the role-player PRA floor BROKE for the first time on Keldon Johnson\'s 8-min (4 PRA) playoff low. <span style="color:var(--text-dim)">— Original preview:</span> 1999 Finals REMATCH at Frost Bank Center — Spurs hosting Knicks 27 years after the lockout-shortened series (SAS won 4-1 then). NYK swept all three prior rounds (BOS R1, PHI R2, CLE ECF) — 12-1 playoff record, the best non-1996 Bulls start since the 2017 Warriors. SAS won the WCF 4-3 over OKC in a 7-game grind. Rest gap: NYK 8 days off (Mavericks-style layoff rust risk) vs SAS 3 days. The central structural matchup: <strong>Castle on Brunson</strong> — Castle\'s 0.91 dLEBRON is the best POA defender Brunson has faced this run (CLE Garland 0.21, PHI Maxey nominal); Castle\'s WCF MVP pattern is to hold star scorers to suppressed lines (SGA held to 19 G4 / 15 G6 on the road). The structural matchup tilting NYK: <strong>KAT vs Wemby</strong> — a meaningfully fairer rim duel than SAS faced from Holmgren/Hartenstein (KAT 1.2bpg vs Holmgren 2.2). Wemby\'s PRA floor should clear cleanly vs the softer NYK paint D. DK (6/3 morning): SAS -2.5 / 215.5 / ML SAS -135, NYK +115. Engine view: SAS by 2 at home — agrees with market on winner + margin; OVER 215.5 is the cleanest engine edge (engine ~224) but Finals G1s historically run UNDER (rust + first-look defense). <strong>Phase 71 R3 out-of-sample stake cap stays at 50%</strong> — Finals is first-ever Finals calibration data, CAUTION pill auto-stamps. CF stakes ($100 floor / $50 trad) hold.' },
    ],
  },
  'Finals-G2': {
    label: 'NBA Finals — Game 2 (Archive)',
    games: [
      { series:'SAS-NYK', date:'2026-06-05', time:'8:30 PM ET', venue:'Frost Bank Center', context:'NYK leads 1-0',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 105-104 — Knicks STEAL Game 2 too, lead 2-0 and head home, just the third team ever to start a Finals 2-0 on the road (1993 Bulls, 1995 Rockets — both champions). A near-mirror of G1: NYK trailed by 8 in Q2, surged to a 56-52 halftime lead, pushed to 97-83 in Q4, then survived a SAS 14-0 run that tied it ~99-99 with 3 min left. Brunson buried the go-ahead FT off a <strong>Wembanyama turnover</strong>, and Wemby\'s contested final-possession jumper rimmed out. KAT 21/13 (8-12, 38 PRA), Mikal Bridges 20/6/6 (the quiet carry), OG Anunoby 17 (3-6 3PT, road shooting traveled again), Brunson 20 on 7-25 (Castle finally suppressed the POINTS) but 6 ast/5 stl + the clutch FT, Josh Hart 0/6/4 glue, Mitchell Robinson 6/7/2blk on the fractured hand. SAS: Wembanyama 29/9/4blk (bounce-back scoring but only 9 reb + the decisive late mistakes), Fox a cleaner 20/5, Vassell 14/9/5, Harper 15/6 + Champagnie 8/4 (both PRA floors held). <strong>Model: SAS by 4 → actual NYK by 1 (WRONG WINNER again, but NYK +5.5 + UNDER 214.5 BOTH cashed — total 209).</strong> Parlays 1-2 (+$135 / -$150): the minutes-vetted PRA floor WON (Champagnie 13 / Harper 23 / Wemby 41 PRA), but the cross-team REB floor LOST on Wemby\'s 9-reb dip (Robinson\'s extra deterrent minutes) and the NYK-cover trad LOST on Brunson\'s 20-pt night. <span style="color:var(--text-dim)">— Original preview:</span> San Antonio faced a near-must-win at Frost Bank Center after dropping G1 on shooting variance. The G2 case rested on a Wembanyama bounce-back and a cleaner Fox; both happened, but NYK\'s secondary creation (Bridges/KAT) and late-game execution won it anyway. DK (6/4): SAS -5.5 / 214.5 / ML SAS -230 — engine SAS by 4 flagged NYK +5.5 as the value, which cashed.' },
    ],
  },
  'Finals-G3': {
    label: 'NBA Finals — Game 3 (Archive)',
    games: [
      { series:'SAS-NYK', date:'2026-06-08', time:'8:30 PM ET', venue:'Madison Square Garden', context:'NYK leads 2-0',
        recap:'<strong style="color:var(--green)">Result:</strong> SAS 115-111 — the Spurs avoid the 0-3 cliff and pull within 2-1 in the first Finals game at MSG since 1999. SAS finally CLOSED: after NYK\'s 42-point Q2 built a 64-57 halftime lead, San Antonio answered with a 35-27 third quarter and never trailed again. Wembanyama was the season-saver — 32/8/6 with 3 blocks on an efficient 11-18 (46 PRA), the mistake-free closeout he hadn\'t delivered in the two road losses. Castle 23/5/5 (two-way), Fox 12 on 4-14 but 8 ast, and the minutes-vetted bench floors held a third straight time (Harper 25 PRA / 13-9, Champagnie 18 PRA / 12-5). NYK got 32 from Brunson (11-25, volume restored) and a career 28 from OG Anunoby (9-13, 4-6 3PT — the MSG crowd lifted his shooting), but the secondary creation vanished: KAT cratered to 11/8 on 4-11, Bridges fell to 15/4/3. <strong>Model: NYK by 1 → actual SAS by 4 (WRONG WINNER a THIRD straight time; the home/+1pt nudge is now 0-3).</strong> SAS +2.5 cashed (spread-value side now 3-3) but the UNDER 216.5 BROKE on a 226 total — the first OVER of the series, ending the Finals-UNDER pattern at MSG\'s faster pace. Bets: spread WIN, Wemby/Champagnie/Harper PRA WIN, ML/total/KAT-PRA LOSS. Parlays 1-2 (+$130 / -$150): the minutes-vetted SAS role-PRA floor WON again (Champagnie/Harper/Wemby all cleared), but the cross-team star floor LOST on KAT\'s 21 PRA and the SAS-grind trad LOST on the busted UNDER. <span style="color:var(--text-dim)">— Original preview:</span> San Antonio faced the 0-3 cliff and played its most desperate, Wemby-centric game; the read was to trust the margin/spread (SAS +2.5) and distrust the winner pick (0-2 home lean). DK (6/8): NYK -2.5 / 216.5 / ML NYK -125. Engine: NYK by 1 — SAS +2.5 the spread value (cashed), UNDER 216.5 the total lean (broke).' },
    ],
  },
  'Finals-G4': {
    label: 'NBA Finals — Game 4 (Archive)',
    games: [
      { series:'SAS-NYK', date:'2026-06-10', time:'8:30 PM ET', venue:'Madison Square Garden', context:'NYK leads 2-1',
        recap:'<strong style="color:var(--green)">Result:</strong> NYK 107-106 — the LARGEST COMEBACK IN NBA FINALS HISTORY. New York trailed by 29 and was down 76-49 at the half, then outscored San Antonio 58-30 over the final 24 minutes to steal it on the last possession and take a commanding 3-1 lead. OG Anunoby authored a career Finals night — 33 on 10-15 (7-9 from 3) AND the game-sealing BLOCK on De\'Aaron Fox\'s go-ahead layup — while Brunson (36/5/7 on 12-25) drove the charge and KAT bounced back to a clean 13/10 (4-5). SAS got 24/13/3blk from Wembanyama (cold 9-25), 18/5/7 from Fox (4 TO + the blocked layup), 18 from Vassell (5-8 3PT), and 21/4/3 from rookie Harper, but the offense cratered after the break. <strong>Model: NYK by 1 → actual NYK by 1 — EXACT-SCORE HIT (107-106) and the first correct Finals winner (home lean snaps to 1-3).</strong> Every model read cashed: NYK ML WIN, SAS +1.5 covered (spread-value side now 4-4), UNDER 215.5 hit on 213 (total read back to 3-1), all three PRA floors cleared (Wemby 38, Harper 28, Champagnie 13). Bets 6-0; parlays 3-0 (+$135 floor / +$105 floor / +$170 trad = +$410) — the slate\'s best night of the Finals. <span style="color:var(--text-dim)">— Original preview:</span> Back at MSG with NYK up 2-1; the engine saw the tightest game of the series (NYK by 1, OVERTIME character). The read was to trust the margin/spread (SAS +1.5) and distrust the 0-3 home-lean winner pick, key the minutes-secure role-PRA floors, and drop the MSG-pace-risky UNDER from the traditional stack. DK (6/9): NYK -1.5 / 215.5 / ML NYK -125, SAS +105.' },
    ],
  },
  'Finals-G5': {
    label: 'NBA Finals — Game 5 (Archive) · 🏆 NYK CHAMPIONS',
    games: [
      { series:'SAS-NYK', date:'2026-06-13', time:'8:30 PM ET', venue:'Frost Bank Center', context:'NYK leads 3-1',
        recap:'<strong style="color:var(--green)">🏆 Result:</strong> NYK 94-90 — the <strong>New York Knicks WIN THE 2026 NBA CHAMPIONSHIP</strong>, their first title since 1973, closing out San Antonio 4-1 ON THE ROAD. Fitting to the series, SAS led by 16 in the 1H and by 10 in the 4Q before New York surged back behind Brunson and a clamp-down defense — the FIFTH straight game the Spurs won the first quarter and the Knicks won the game in the second half. <strong>Jalen Brunson, FINALS MVP</strong>, scored a Knicks Finals-record <strong>45</strong> (14-27, 13-15 FT) despite rolling his left ankle, hitting the go-ahead FTs at 1:08. Josh Hart 13/11, OG Anunoby 10/6/3stl, Mikal Bridges 13 (3-7 3PT); KAT ground out 2/10/3stl before fouling out at 1:53. SAS\'s stars cratered in their first Finals closeout — Fox 7 on 3-15, Castle 6 on 1-10, Wembanyama a quiet 19/14/5blk on 7-18 — while rookie Dylan Harper led the Spurs with 25/5/4 and Champagnie added 14/7. <strong>Model: SAS by 3 → actual NYK by 4 (WRONG WINNER a 4th time, Finals winner pick finishes 1-4).</strong> But the other reads held to the end: NYK +3 cashed (spread-value side a PERFECT 5-for-5), UNDER 211.5 hit on a 184 total (lowest of the series), and all three SAS role-PRA floors cleared (Harper 34, Wemby 35, Champagnie 22 — the minutes-vetted floor finished 5-for-5). Bets 5-1 (only SAS ML lost); parlays 3-0 (+$135 / +$115 / +$165 = +$415). <span style="color:var(--text-dim)">— Original preview:</span> Back in San Antonio with NYK one win from its FIRST TITLE SINCE 1973 — the Knicks lead 3-1 after the largest comeback in Finals history. <strong>The stakes:</strong> a NYK win CLINCHES the championship on the road; a SAS win forces G6 back at MSG and keeps the comeback story alive. <strong>The model read:</strong> the engine flips back to San Antonio — SAS by 3 (108-105), character COMPETITIVE — on the home/closeout dynamics: SAS is 6-1 at Frost Bank this playoff run and the Phase 73 elimination amplifier is now ACTIVE (a desperate home team down 3-1 widens variance and earns a desperation bump). But the running rule holds: the raw winner pick is only 1-3 in the Finals, so weight the margin/spread (the spread-value side is a PERFECT 4-for-4) over the side — with SAS favored at home, NYK getting the points is likely the model value side. <strong>The swing:</strong> SAS\'s elimination desperation + the 6-1 home edge vs a NYK team playing with house money behind the Anunoby/Brunson scoring that won G4 and a bounce-back KAT. The total leans UNDER again (~209) on the Frost Bank grind pace (both SA games went UNDER: 200, 209). DK (6/12): SAS -3 / 211.5 / ML SAS -155, NYK +135. Engine: SAS by 3 — the spread sits near fair, UNDER 211.5 the thin total lean. <strong>Phase 71 R3 out-of-sample stake cap stays 50%</strong>; CAUTION pill auto-stamps. Finals stakes ($100 floor / $50 trad) hold.' },
    ],
  },
};

// Auto-populate `when` on every game from structured fields, so existing
// renderers that read `g.when` keep working with no edits.
Object.values(BET_SLATES).forEach(slate => {
  slate.games.forEach(g => { if (!g.when) g.when = buildWhenLabel(g); });
});
