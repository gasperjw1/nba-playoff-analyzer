// ============================================================
// BETS PAGE
// ============================================================

function renderBetsPage(el) {
  el.innerHTML = `
  <div style="max-width:900px;margin:0 auto;padding:20px 10px;">
    <h2 style="text-align:center;color:#fff;margin-bottom:4px;">2026 NBA Playoff Bets — Round 1</h2>
    <p style="text-align:center;color:#aaa;font-size:13px;margin-bottom:8px;">Model-driven picks for all 8 first-round series | G1 Record: 8/13 (61.5%)</p>

    <!-- BET TABS -->
    <div style="display:flex;gap:0;margin-bottom:24px;justify-content:center;">
      <div class="bet-tab active" onclick="switchBetTab('parlays')" id="betTab-parlays" style="padding:10px 24px;border-radius:8px 0 0 8px;cursor:pointer;font-size:13px;font-weight:700;background:var(--accent);color:#fff;border:1px solid var(--accent);transition:all 0.2s;">Featured Parlays</div>
      <div class="bet-tab" onclick="switchBetTab('g1')" id="betTab-g1" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Game 1 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g2')" id="betTab-g2" style="padding:10px 24px;border-radius:0 8px 8px 0;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Game 2 Bets</div>
    </div>

    <!-- ===== PARLAYS TAB ===== -->
    <div id="betContent-parlays" class="bet-content">
    <div class="parlay-featured">
      <h3 style="color:#f0c040;margin:0 0 16px 0;font-size:18px;">Featured Parlays</h3>

      <div class="parlay-card">
        <div class="parlay-header">
          <span class="parlay-name">The G2 Chalk Slam</span>
          <span class="parlay-odds">~+280</span>
        </div>
        <div class="parlay-legs">
          <div class="parlay-leg">
            <span class="parlay-leg-num">1</span>
            <span class="parlay-leg-pick">CLE ML vs TOR (G2)</span>
            <span class="parlay-leg-odds">-320</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">2</span>
            <span class="parlay-leg-pick">BOS ML vs PHI (G2)</span>
            <span class="parlay-leg-odds">-700</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">3</span>
            <span class="parlay-leg-pick">OKC ML vs PHX (G2)</span>
            <span class="parlay-leg-odds">-900</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">4</span>
            <span class="parlay-leg-pick">SAS ML vs POR (G2)</span>
            <span class="parlay-leg-odds">-600</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
        </div>
        <div class="parlay-reasoning">Four highest-confidence G2 MLs backed by margin engine + fatigue factor. CLE: SEPARATION (CLE +13), Rajakovic's adjustmentRating (5) limits recovery. BOS: SEPARATION (BOS +15) — no Embiid is unsurmountable. OKC: SEPARATION (OKC +16), Ott's adjustmentRating (4) is bracket-worst. SAS: SEPARATION (SAS +16), Splitter's interim coaching can't close the gap. Fatigue monitor (MEDIUM CONFIDENCE) now validates — all four favorites have lower team fatigue than their opponents.</div>
      </div>

      <div class="parlay-card">
        <div class="parlay-header">
          <span class="parlay-name">G2 Star Power Parlay</span>
          <span class="parlay-odds">~+350</span>
        </div>
        <div class="parlay-legs">
          <div class="parlay-leg">
            <span class="parlay-leg-num">1</span>
            <span class="parlay-leg-pick">Donovan Mitchell Over 24.5 pts (G2)</span>
            <span class="parlay-leg-odds">-150</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">2</span>
            <span class="parlay-leg-pick">Wembanyama Over 24.5 pts (G2)</span>
            <span class="parlay-leg-odds">-140</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">3</span>
            <span class="parlay-leg-pick">Jaylen Brown Over 24.5 pts (G2)</span>
            <span class="parlay-leg-odds">-150</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">4</span>
            <span class="parlay-leg-pick">Jalen Brunson Over 19.5 pts (G2)</span>
            <span class="parlay-leg-odds">-180</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
        </div>
        <div class="parlay-reasoning">Four stars in SEPARATION or COMPETITIVE character games — high margins mean sustained star minutes. Mitchell (CLE +10, COMPETITIVE): stays on court through Q3 with 32pts G1 baseline. Wemby (SAS +16, SEPARATION): 35pts G1, but Star Prop Trap risk — blowout could mean early rest (mitigated by Wemby's lower blowout probability vs OKC). Brown (BOS +15, SEPARATION): Star Prop Trap alert — may rest Q4 again, but 28pts came in 3Qs. Brunson (NYK +8, COMPETITIVE): COMPETITIVE character means full minutes — 28pts G1 with 9.2 clutch rating sustains volume.</div>
      </div>

      <div class="parlay-card">
        <div class="parlay-header">
          <span class="parlay-name">G2 Margin Engine Edge Parlay</span>
          <span class="parlay-odds">~+420</span>
        </div>
        <div class="parlay-legs">
          <div class="parlay-leg">
            <span class="parlay-leg-num">1</span>
            <span class="parlay-leg-pick">HOU ML vs LAL (G2)</span>
            <span class="parlay-leg-odds">-125</span>
            <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">2</span>
            <span class="parlay-leg-pick">ORL ML vs DET (G2)</span>
            <span class="parlay-leg-odds">+140</span>
            <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">3</span>
            <span class="parlay-leg-pick">NYK -5.5 vs ATL (G2)</span>
            <span class="parlay-leg-odds">-110</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">4</span>
            <span class="parlay-leg-pick">Under 208.5 BOS-PHI (G2)</span>
            <span class="parlay-leg-odds">-110</span>
            <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
          </div>
        </div>
        <div class="parlay-reasoning">Margin engine edge plays. HOU ML: COIN FLIP character (HOU +3) — engine favors HOU despite LAL's G1 win because Udoka's Coaching Adjustment Compression (adjustmentRating: 8) + KD's Star Absence Margin Boost compound. ORL at +140: GRIND character (DET +4) — Mosley's higher adjustmentRating (7 vs Bickerstaff's 5) means ORL adapts faster. NYK -5.5: COMPETITIVE (NYK +8) covers with 2.5pt cushion. BOS-PHI Under: SEPARATION means starters rest Q4, compressing totals below 208.5.</div>
      </div>

      <div class="parlay-card">
        <div class="parlay-header">
          <span class="parlay-name">G2 Value Hunter Parlay</span>
          <span class="parlay-odds">~+1400</span>
        </div>
        <div class="parlay-legs">
          <div class="parlay-leg">
            <span class="parlay-leg-num">1</span>
            <span class="parlay-leg-pick">MIN ML vs DEN (G2)</span>
            <span class="parlay-leg-odds">+160</span>
            <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">2</span>
            <span class="parlay-leg-pick">Anthony Edwards Over 24.5 pts (G2)</span>
            <span class="parlay-leg-odds">-130</span>
            <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">3</span>
            <span class="parlay-leg-pick">PHX +12.5 vs OKC (G2)</span>
            <span class="parlay-leg-odds">-110</span>
            <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
          </div>
          <div class="parlay-leg">
            <span class="parlay-leg-num">4</span>
            <span class="parlay-leg-pick">Deni Avdija Over 22.5 pts (G2)</span>
            <span class="parlay-leg-odds">-110</span>
            <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
          </div>
        </div>
        <div class="parlay-reasoning">Margin engine variance plays. MIN ML: DEN's COMPETITIVE character (+8) means Close Game Probability ~30% — Edwards' starCeiling (2.0) can flip outcomes in tight games. Edwards O24.5: bounce-back after "limited" 22pts, with altitude's Active Injury Drag lessening as he acclimates. PHX +12.5: Engine projects SEPARATION (OKC +16) but variance profile shows 75% of outcomes under 16 — blowout risk exists but Booker's clutch (7.8) provides floor. Avdija O22.5: SAS's SEPARATION character means POR trails and feeds their #1 option — 30pts in G1 baseline.</div>
      </div>
    </div>

    </div><!-- end parlay-featured -->
    </div><!-- end betContent-parlays -->

    <!-- ===== GAME 1 TAB ===== -->
    <div id="betContent-g1" class="bet-content" style="display:none;">
    <h3 style="color:#fff;text-align:center;margin:0 0 4px;font-size:20px;border-bottom:1px solid #333;padding-bottom:8px;">Game 1 Picks — All 8 Series</h3>
    <p style="text-align:center;color:#888;font-size:12px;margin-bottom:4px;">SAS-POR G1: ✅ SAS 111-98 (3/3 bets hit) | BOS-PHI G1: ✅ BOS 123-91 | OKC-PHX G1: ✅ OKC 119-84 | DET-ORL G1: ❌ ORL 112-101 (upset)</p>
    <p style="text-align:center;color:#888;font-size:12px;margin-bottom:20px;">HOU-LAL G1: ✅ LAL 107-98 | DEN-MIN G1: ✅ DEN 116-105 | CLE-TOR G1: ✅ CLE 126-113 | NYK-ATL G1: ✅ NYK 113-102</p>

    <!-- HIGH CONFIDENCE — GAME 1 -->
    <div class="risk-tier">
      <div class="risk-tier-header">
        <span class="risk-tier-badge high-conf">HIGH CONFIDENCE</span>
        <span style="color:#888;font-size:13px;">Model edge 5%+ vs. market | Structural mismatches</span>
      </div>
      <div class="bet-grid">
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">OKC Thunder ML</div>
          <div class="bet-line">-850 vs PHX | Model: 91% (implied: 89%)</div>
          <div class="bet-reasoning">The biggest mismatch in R1. SGA's 67% TS on 30 PPG is historically elite — only 3 players in NBA history have matched that efficiency at that volume in a playoff year. OKC's +11.6 NetRtg and +8.5 clutch NetRtg mean they close games. PHX's -1.4 NetRtg makes them a negative team overall. Dort's DRtg of 102.1 is the Booker clamp. Even with Brooks' breakout (20.2 PPG), PHX lacks the depth to stay within range.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">BOS Celtics ML</div>
          <div class="bet-line">-625 vs PHI | Model: 88% (implied: 86%)</div>
          <div class="bet-reasoning">No Embiid (-13.2 on/off swing) collapses PHI's interior. Drummond starting is a massive downgrade. Brown has elevated to 28.7 PPG as #1 and PHI can't contain him. George's 4.8 clutch rating after a 25-game suspension means PHI's second option disappears when it matters. PHI is 0-6 vs BOS in playoffs since 1982 — the psychological weight is real. Maxey (28.3 PPG) is brilliant but can't carry alone.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">SAS Spurs ML</div>
          <div class="bet-line">-550 vs POR | Model: 86% (implied: 85%)</div>
          <div class="bet-reasoning">Wemby's +16.9 on/off is historic — when he plays, SAS is a 65-win team. Fox's addition transforms the backcourt. Portland lost HC Billups to a gambling investigation and Splitter (interim) is coaching his first playoff game against his former franchise. Clingan's PER is 12.7 points below Wemby. Johnson's system and the coaching disruption create a structural edge that talent alone can't overcome.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">OKC -14.5 vs PHX</div>
          <div class="bet-line">-110 | Model margin: 14.0</div>
          <div class="bet-reasoning">Our model projects a 14-point OKC win. SGA's dominance (+12.1 on/off), OKC's defending champion pedigree (playoffPedigree: 2), and systemBonus +2.5 vs PHX's -0.5 create a compounding advantage. PHX's 5-5 in their last 10 shows inconsistency. Even with Brooks' emergence, the depth gap (OKC's bench includes McCain, Caruso, Isaiah Joe) is too wide for PHX to cover.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">BOS -12.5 vs PHI</div>
          <div class="bet-line">-110 | Model margin: 14.0</div>
          <div class="bet-reasoning">The biggest Game 1 spread for good reason. Without Embiid, PHI's ORtg drops to 108.4 and DRtg balloons to 115.2 — that's a bottom-5 team. BOS's system (+2.0 bonus) and championship DNA (playoffPedigree: 2) at TD Garden compound the advantage. Mazzulla's 16-4 playoff record shows he knows how to close out inferior opponents. PHI needs Maxey to score 35+ just to keep it competitive.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">SGA Over 27.5 pts</div>
          <div class="bet-line">-140 | Season avg: 30.0 PPG</div>
          <div class="bet-reasoning">SGA averages 30 PPG on 67% TS — the most efficient high-volume scorer in the league. His 50% from 3 vs PHX this season and +12.1 on/off mean he'll have the ball in crunch time. PHX's first-year coach Ott has no playoff adjustment history. Dort's defensive assignment on Booker frees SGA from energy-draining matchups. With a starCeiling of 2, he's more likely to go 35+ than under 28.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Wembanyama Over 22.5 pts</div>
          <div class="bet-line">-130 | Season avg: 24.8 PPG</div>
          <div class="bet-reasoning">Wemby's 24.8 PPG baseline easily clears 22.5, and his playoff debut at home adds adrenaline. Clingan can't match his offensive versatility — Wemby shoots 37% from 3 while protecting the rim (3.1 BPG). The rib contusion is a minor concern but he says he's "close to 100%." With Fox feeding him in the PnR and Johnson's system maximizing his touches, 25+ is the likeliest outcome.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Jaylen Brown Over 25.5 pts</div>
          <div class="bet-line">-135 | Season avg: 28.7 PPG</div>
          <div class="bet-reasoning">Brown averaging 28.7 as the #1 option comfortably clears this line. Without Embiid, PHI's rim protection disappears — Brown will attack the paint freely. His 8.0 clutch rating and Finals MVP pedigree mean he elevates in these moments. PHI's best perimeter defender (Edgecombe) is a rookie with no playoff experience guarding this caliber of star.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type series">SERIES</span>
          <div class="bet-pick">OKC to win series</div>
          <div class="bet-line">-2500 | Model series win%: 96%</div>
          <div class="bet-reasoning">Our model projects OKC's series win probability at 96% — the highest in R1. Defending champs with the best player (SGA), best net rating (+11.6), best clutch rating (+8.5), and deepest roster. PHX would need Booker to have the series of his life AND SGA to regress significantly. The only series with a higher model edge than the market implies.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">DET Pistons ML</div>
          <div class="bet-line">-400 vs ORL | Model: 78% (implied: 80%)</div>
          <div class="bet-reasoning">UPGRADED from medium confidence. Line moved from -3.5 to -8.5 — a massive 5-point market shift suggesting Cade is closer to full health than feared. DET's #1 defense (107.2 DRtg) meets ORL's #24 offense (110.2 ORtg). Cade's +9.0 on/off and Duren's All-Star interior dominance are structural advantages. DET won 15 of their last 19 and the market now agrees this is a mismatch.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
      </div>
    </div>

    <!-- MEDIUM CONFIDENCE — GAME 1 -->
    <div class="risk-tier">
      <div class="risk-tier-header">
        <span class="risk-tier-badge med-conf">MEDIUM CONFIDENCE</span>
        <span style="color:#888;font-size:13px;">Model leans but uncertainty factors present</span>
      </div>
      <div class="bet-grid">
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">SAS -10.5 vs POR</div>
          <div class="bet-line">-110 | Model margin: 13.0</div>
          <div class="bet-reasoning">Our model projects a 13-point SAS win, but the 10.5 spread gives a 2.5-point cushion. The coaching disruption (Billups out, Splitter interim) compounds POR's structural disadvantage. Wemby's +16.9 on/off means SAS needs him healthy for ~32 minutes to cover. The rib contusion and first-playoff-game jitters for SAS's young core keep this at medium — double-digit spreads are inherently riskier even when the model loves them.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type total">TOTAL</span>
          <div class="bet-pick">Under 211.5 BOS-PHI</div>
          <div class="bet-line">-110 | Proj: BOS 112 — PHI 98 (210 total)</div>
          <div class="bet-reasoning">Without Embiid, PHI's offense craters to 108.4 ORtg. Drummond starting means fewer post-ups and more empty possessions. BOS's DRtg of 109.2 tightens further in playoffs — Mazzulla's teams have historically played slower in the postseason. Brown and Tatum can score efficiently but won't need to push pace against a depleted opponent. This game projects to the low 200s.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">De'Aaron Fox Over 16.5 pts</div>
          <div class="bet-line">-130 | Season avg: 18.5 PPG</div>
          <div class="bet-reasoning">Fox's playoff debut with SAS will feature him prominently in the Fox-Wemby PnR — the deadliest action on the team. POR's Holiday/Henderson backcourt will struggle to contain his elite speed despite Holiday's strong perimeter D. His 18.5 PPG average and the spacing Wemby creates make 17+ highly probable. Medium confidence only because this is Fox's first game in SAS's playoff system.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Tyrese Maxey Over 26.5 pts</div>
          <div class="bet-line">+105 | Season avg: 28.3 PPG</div>
          <div class="bet-reasoning">Even in a loss, Maxey will score. He's averaged 30 PPG in 4 games vs BOS this season and his 8.0 on/off means PHI's offense lives and dies with him. Without Embiid, Maxey's usage rate will spike to 35%+. White's defense is a concern (held Maxey below average in 2/4 meetings) but volume alone gets him there. The +105 price offers value.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Deni Avdija Over 22.5 pts</div>
          <div class="bet-line">-115 | Season avg: 24.2 PPG</div>
          <div class="bet-reasoning">Without Lillard (torn Achilles, out for season), Avdija IS Portland's offense. Averaging 24.2 PPG with a 28.5 USG%, his usage will spike further in the playoffs as the undisputed #1 option. SAS may throw Vassell or Castle at him, but his 6.7 APG creation ability means double-teams free teammates. All-Star breakout season makes 23+ points very likely even against SAS's elite defense.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Cade Cunningham Over 8.5 assists</div>
          <div class="bet-line">-115 | Season avg: 9.9 APG</div>
          <div class="bet-reasoning">Cade averages 9.9 APG — elite creation. His +9.0 on/off shows DET's offense revolves around his passing. ORL's Suggs has a -11.7 PER gap vs Cade in the creation matchup. DET's system funnels everything through Cade in the half-court, and Duren's rim-running + Ivey's cutting create easy assists. The collapsed lung limits his scoring burst but not his court vision.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
      </div>
    </div>

    <!-- LOW CONFIDENCE — GAME 1 -->
    <div class="risk-tier">
      <div class="risk-tier-header">
        <span class="risk-tier-badge low-conf">LOW CONFIDENCE</span>
        <span style="color:#888;font-size:13px;">Contrarian value | High variance | Long-shot upside</span>
      </div>
      <div class="bet-grid">
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">PHX Suns +14.5</div>
          <div class="bet-line">-110 vs OKC | Covers if loss by 14 or fewer</div>
          <div class="bet-reasoning">14.5 is a massive playoff spread (moved from 13.5). Booker's 7.8 clutch rating and Brooks' breakout (20.2 PPG) give PHX enough firepower to keep it within range. Our 2025 backtest showed heavy underdogs covered 13+ point spreads 55% of the time in R1 — playoff intensity compresses margins. Green's play-in momentum (35 + 36 pts in elimination games) adds variance. OKC may also rest starters early if they build a lead.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">ORL Magic +8.5</div>
          <div class="bet-line">-110 vs DET | Covers if loss by 8 or fewer</div>
          <div class="bet-reasoning">Line moved massively from +3.5 to +8.5 — market now sees this as a mismatch. Still worth a contrarian look: ORL's Banchero/Wagner/Bane trio has enough creation to keep it competitive, and ORL's +3.8 clutch NetRtg shows they fight in close games. 8.5 is a big number for a playoff game even with DET's elite defense. Low confidence because DET's defense may be too suffocating, but playoff games compress margins.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Dillon Brooks Over 18.5 pts</div>
          <div class="bet-line">+110 | Season avg: 20.2 PPG</div>
          <div class="bet-reasoning">Brooks' breakout season (20.2 PPG, Player of the Week) transformed PHX from a one-man show. His physical style and confidence make him dangerous as a #2 option. OKC's 25th-ranked 3PT defense creates open looks for Brooks. Low confidence because Dort's perimeter defense could shift onto him if Booker is cold, but at +110 the value is there if you believe the breakout is real.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Paolo Banchero Over 21.5 pts</div>
          <div class="bet-line">+100 | Season avg: 22.4 PPG</div>
          <div class="bet-reasoning">Banchero's 6.2 clutch rating is ORL's best weapon. Even against DET's elite D, his physical scoring style (46.2 FG%) can generate paint points. Ausar Thompson is a tough assignment but Banchero's size advantage creates mismatches in the post. ORL needs him to go 25+ for a chance — and with increased playoff usage, the volume is there.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Devin Booker Over 24.5 pts</div>
          <div class="bet-line">+115 | Season avg: 26.0 PPG</div>
          <div class="bet-reasoning">Booker averages 26 PPG and has a 7.8 clutch rating, plus he hit a game-winner vs OKC in January. Even in a likely loss, he'll get his shots as PHX's entire offense funnels through him. Low confidence because Dort (DRtg 102.1) is specifically designed to limit him, but Booker's shot-making ability can overcome defensive pressure. The +115 offers value on a star who needs 25+ for PHX to have any hope.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type series">SERIES</span>
          <div class="bet-pick">POR to win series vs SAS</div>
          <div class="bet-line">+500 | Model series win%: ~12%</div>
          <div class="bet-reasoning">Without Lillard (torn Achilles), this is a much tougher ask. But Avdija + Sharpe + Holiday still have offensive firepower. Clingan's elite LEBRON (3.4) makes him a legitimate two-way anchor. Wemby's rib, SAS's playoff inexperience, and POR's interim coach being a former Spur who knows their system could create chaos. If Sharpe is healthy and explosive, POR can score with anyone. Pure longshot sprinkle.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
      </div>
    </div>

    </div><!-- end betContent-g1 -->

    <!-- ===== GAME 2 TAB ===== -->
    <div id="betContent-g2" class="bet-content" style="display:none;">
    <h3 style="color:#fff;text-align:center;margin:0 0 4px;font-size:20px;border-bottom:1px solid #333;padding-bottom:8px;">Game 2 Picks — All 8 Series</h3>
    <p style="text-align:center;color:#888;font-size:12px;margin-bottom:20px;">All Game 1 results incorporated into predictions | Schedule: Mon Apr 20 (3 games) · Tue Apr 21 (5 games)</p>

    <!-- HIGH CONFIDENCE — GAME 2 -->
    <div class="risk-tier">
      <div class="risk-tier-header">
        <span class="risk-tier-badge high-conf">HIGH CONFIDENCE</span>
        <span style="color:#888;font-size:13px;">Model edge 5%+ vs. market | G1 data validated</span>
      </div>
      <div class="bet-grid">
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">CLE Cavaliers ML</div>
          <div class="bet-line">-320 vs TOR | Margin Engine: SEPARATION (CLE +13)</div>
          <div class="bet-reasoning">Margin engine projects CLE by 13 — SEPARATION character. Fatigue differential favors CLE (5.6% vs TOR 4.3%) despite both being low. Rajakovic's adjustmentRating (5) limits coaching recovery. CLE's Depth Disparity Factor is bracket-best — Strus's 24pts off bench exemplifies depth TOR can't match. Mitchell-Harden proven chemistry eliminates uncertainty. TOR's playoffPedigree:0 and CLE's triple-initiator system make this structurally dominant.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">NYK Knicks ML</div>
          <div class="bet-line">-220 vs ATL | Margin Engine: SEPARATION (NYK +13)</div>
          <div class="bet-reasoning">Margin engine projects NYK by 13 — SEPARATION character, boosted by fatigue differential (NYK 3.3% vs ATL 5.1%). Talent Gap Amplifier strongly favors NYK — Brunson/Towns outclass NAW/McCollum. Brown's halftime transition defense adjustment carries forward as institutional knowledge. ATL's higher fatigue index reflects post-ASB intensity and fewer rest days. NYK's 9.2 clutch rating provides insurance if the game tightens.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">CLE -7.5</div>
          <div class="bet-line">-110 vs TOR | Margin Engine: SEPARATION (CLE +13)</div>
          <div class="bet-reasoning">Margin engine projects CLE by 13 — SEPARATION character upgraded by fatigue differential. Rajakovic's adjustmentRating (5) limits coaching recovery. CLE's triple-initiator system creates massive Depth Disparity edge. TOR's fatigue (4.3%) is slightly lower but their playoffPedigree:0 and CLE's paint dominance (48-30 in G1) are structural. Covers -7.5 with 5.5pt cushion — this is now our widest spread cushion among covered bets.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Donovan Mitchell Over 24.5 pts</div>
          <div class="bet-line">-150 | G1: 32 pts</div>
          <div class="bet-reasoning">Mitchell's starCeiling (1.8) means he regularly exceeds his baseline in playoff home games. Scored 32 in G1 and historically averages 28+ in R1 home games. TOR lacks a true Mitchell stopper.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Jalen Brunson Over 19.5 pts</div>
          <div class="bet-line">-180 | G1: 28 pts (19 in Q1)</div>
          <div class="bet-reasoning">Brunson's home playoff scoring is remarkably consistent — he's exceeded 20 pts in 85% of home playoff games over the last 2 seasons. His starCeiling (1.5) and NYK's system coherence maximize his usage in half-court sets.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type series">SERIES</span>
          <div class="bet-pick">CLE to win series</div>
          <div class="bet-line">-550 | Model series win%: 88%</div>
          <div class="bet-reasoning">Even at heavy chalk, our model projects CLE's series win probability at 88%, above the -550 implied 85%. System coherence, playoff pedigree, and Mitchell's dominance make an upset nearly impossible. TOR would need 4 wins against the best home team in the league.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
      </div>
    </div>

    <!-- MEDIUM CONFIDENCE — GAME 2 -->
    <div class="risk-tier">
      <div class="risk-tier-header">
        <span class="risk-tier-badge med-conf">MEDIUM CONFIDENCE</span>
        <span style="color:#888;font-size:13px;">Model leans but market is close | Situational edges</span>
      </div>
      <div class="bet-grid">
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">HOU Rockets ML</div>
          <div class="bet-line">-125 vs LAL | Margin Engine: COIN FLIP (HOU +3)</div>
          <div class="bet-reasoning">MARGIN ENGINE CORRECTION: Flipping from LAL to HOU. The margin variance engine projects HOU by 3 — a COIN FLIP character game. LAL's G1 win (107-98) was fueled by unsustainable 61%/53% shooting. Udoka's Coaching Adjustment Compression (adjustmentRating: 8, highest tier) projects 16.4% margin recovery — his 2022 bounce-backs averaged +17.3pts. KD's probable return triggers Star Absence Margin Boost (+2.0 pts). LAL shooting regression + Udoka adjustments + KD return = three compounding factors. Medium confidence because LAL's home court and LeBron's pedigree (2.0) keep this in COIN FLIP territory.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type total">TOTAL</span>
          <div class="bet-pick">Under 211.5 HOU-LAL</div>
          <div class="bet-line">-110 | Margin Engine: COIN FLIP (HOU +3)</div>
          <div class="bet-reasoning">COIN FLIP character games tend to be lower-scoring — close contests mean fewer transition points and more half-court grinds. Pace-Based Score Projection from the engine suggests ~207 total. LAL's 61%/53% shooting will regress hard. Udoka's Coaching Adjustment Compression (adjustmentRating: 8) specifically targets opponent efficiency — his 2022 defensive adjustments cut opposing ORtg by 8+ pts in G2s. KD's return may actually slow HOU's pace as they integrate him. Both defenses tighten.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">NYK -5.5 vs ATL</div>
          <div class="bet-line">-110 | Margin Engine: SEPARATION (NYK +13)</div>
          <div class="bet-reasoning">Margin engine projects NYK by 13 — SEPARATION character, widened by fatigue differential (NYK 3.3% vs ATL 5.1% — NYK is better rested). Snyder's adjustmentRating (7) applies coaching compression but can't close the structural gap. NYK's system coherence and Brunson's 9.2 clutch rating sustain dominance. Covers -5.5 with 7.5pt cushion — upgrading from medium to high confidence territory given fatigue-boosted margin.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">LeBron James Over 7.5 assists</div>
          <div class="bet-line">+110 | G1: 13 assists</div>
          <div class="bet-reasoning">LeBron posted 13 assists in G1 — with KD potentially returning but likely on a minutes restriction, LeBron will continue as primary facilitator. His playoff assist rate increases when he has capable shooters around him. The +110 price offers value on a likely 9+ assist performance.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Alperen Sengun Over 9.5 rebounds</div>
          <div class="bet-line">-120 | G1: 10 rebounds</div>
          <div class="bet-reasoning">Sengun had 19pts in G1 and his interior physicality creates consistent rebounding opportunities against LAL's frontcourt. Even on the road at Crypto.com Arena, his size advantage over Ayton generates 10+ rebounding chances. System coherence means HOU runs through Sengun in the post, and with KD's probable return drawing defensive attention, Sengun could see easier boards.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Anthony Edwards Over 24.5 pts</div>
          <div class="bet-line">-130 | G1: 22 pts</div>
          <div class="bet-reasoning">Edwards' starCeiling (2.0) is the highest in the bracket — his ceiling games are spectacular. While 22 pts in G1 was solid, his bounce-back scoring tendency after "quiet" games (by his standards) is strong. DEN's perimeter defense is exploitable, and Ant has the green light.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Luke Kennard Over 2.5 threes</div>
          <div class="bet-line">+100 | G1: 27 pts (career playoff-high)</div>
          <div class="bet-reasoning">Kennard's 7/11 from three in G1 was extraordinary but his role as LAL's primary floor spacer means high-volume attempts are sustainable with LeBron creating open looks. Even with regression, 3+ threes is likely given his 5+ attempts per game. Confidence is medium because Udoka will adjust HOU's closeout scheme to deny Kennard clean looks in G2.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
      </div>
    </div>

    <!-- LOW CONFIDENCE — GAME 2 -->
    <div class="risk-tier">
      <div class="risk-tier-header">
        <span class="risk-tier-badge low-conf">LOW CONFIDENCE</span>
        <span style="color:#888;font-size:13px;">Contrarian value | High variance | Long-shot upside</span>
      </div>
      <div class="bet-grid">
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">MIN Timberwolves ML</div>
          <div class="bet-line">+160 vs DEN | Model: 38% (implied: 38%)</div>
          <div class="bet-reasoning">No model edge here — this is pure value on Edwards' ceiling. His starCeiling of 2.0 means a 35+ point explosion is always one game away. MIN's bounce-back probability after G1 loss is 54% (R1 modifier). DEN's altitude factor compounds but MIN has the athlete to overcome it. Worth a sprinkle at +160.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">ATL Hawks +5.5</div>
          <div class="bet-line">-110 vs NYK | Covers if loss by 5 or fewer</div>
          <div class="bet-reasoning">ATL lost G1 but McCollum's 26pts and J.Johnson's 23pts showed they can score in bunches. Our 2025 backtest showed underdogs covered the spread in 42% of R1 games — not profitable alone, but ATL's offensive ceiling with NAW + McCollum means blowouts are less likely than the line suggests.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Max Strus Over 2.5 threes</div>
          <div class="bet-line">+120 | G1: 24 pts (multiple 3s)</div>
          <div class="bet-reasoning">Strus's 24-pt G1 breakout suggests he's locked into a high-usage role for CLE. His three-point shooting is streaky but volume-dependent — if he takes 6+ attempts, 3+ makes is plausible. Low confidence because his role could shrink if Mitchell and Harden dominate touches.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Nickeil Alexander-Walker Over 22.5 pts</div>
          <div class="bet-line">+120 | ATL's primary scorer at 20.8 PPG</div>
          <div class="bet-reasoning">NAW is ATL's go-to scorer at 20.8 PPG with 40% from three. Down 0-1, Snyder will funnel even more usage his way. Low confidence because NYK's defense is specifically designed to limit primary scorers, but NAW's shot-making ability from deep creates high variance — he's capable of 25+ when the volume is there.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type series">SERIES</span>
          <div class="bet-pick">MIN to win series vs DEN</div>
          <div class="bet-line">+280 | Model series win%: 30%</div>
          <div class="bet-reasoning">The longest shot in our model, but not unreasonable. Edwards' starCeiling (2.0) means MIN has the single most explosive player in any series. DEN's Murray (injuryRisk: 0.8) could break down as the series grinds on. The health degradation curve increasingly favors MIN in a 6-7 game series. Pure upside play.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
      </div>
    </div>

    <!-- ===== SUNDAY SERIES G2 BETS (BOS-PHI, OKC-PHX, DET-ORL, SAS-POR) ===== -->
    <h4 style="color:var(--purple);text-align:center;margin:32px 0 4px;font-size:16px;border-bottom:1px solid #333;padding-bottom:6px;">Sunday Series — Game 2 (Tue Apr 21)</h4>
    <p style="text-align:center;color:#888;font-size:12px;margin-bottom:20px;">BOS-PHI · OKC-PHX · DET-ORL · SAS-POR — Blowout G1 results recalibrated</p>

    <!-- HIGH CONFIDENCE — G2 SUNDAY SERIES -->
    <div class="risk-tier">
      <div class="risk-tier-header">
        <span class="risk-tier-badge high-conf">HIGH CONFIDENCE</span>
        <span style="color:#888;font-size:13px;">G1 blowouts validated structural edges</span>
      </div>
      <div class="bet-grid">
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">BOS Celtics ML (G2)</div>
          <div class="bet-line">-700 vs PHI | Margin Engine: SEPARATION (BOS +15) | Tue 7:30pm TNT</div>
          <div class="bet-reasoning">Margin engine projects BOS by 15 — SEPARATION character even after Coaching Adjustment Compression. Nurse's adjustmentRating (8) applies 16.4% compression to the 18-pt cap, but the Talent Gap Amplifier (no Embiid = Star Absence Margin Boost for BOS) keeps margins extreme. G1's 32-pt BLOWOUT RISK materialized. Drummond starting triggers Active Injury Margin Drag equivalent. PHI has the bracket's worst Depth Disparity Factor without Embiid.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">OKC Thunder ML (G2)</div>
          <div class="bet-line">-900 vs PHX | Margin Engine: SEPARATION (OKC +16) | Tue 10pm TNT</div>
          <div class="bet-reasoning">Margin engine projects OKC by 16 — SEPARATION character. Ott's adjustmentRating (4) is the bracket's lowest, meaning Coaching Adjustment Compression is minimal (only 13.2% G2 recovery). G1's 35-pt BLOWOUT cascaded from the bracket's widest Talent Gap Amplifier. PHX's Active Injury Margin Drag (Allen hamstring, Williams foot) compounds Depth Disparity. Even after compression, OKC's margin stays in SEPARATION territory — this is the most structurally lopsided series. Star Prop Trap: avoid SGA OVER — blowout means early rest.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">SAS Spurs ML (G2)</div>
          <div class="bet-line">-600 vs POR | Margin Engine: SEPARATION (SAS +16) | Tue 9:30pm TNT</div>
          <div class="bet-reasoning">Margin engine projects SAS by 16 — SEPARATION character, wider than G1's 13-pt actual. Splitter's adjustmentRating (4) barely compresses the margin (13.2% recovery). Wemby's Talent Gap Amplifier is historic — 35pts in G1 confirmed he's the bracket's most dominant force. POR's Active Injury Margin Drag (Sharpe fibula, Lillard OUT) creates compounding depth loss. Johnson's coaching (A in G1) sustains SAS's schematic edge with Fox-Wemby PnR.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">BOS -13.5 (G2)</div>
          <div class="bet-line">-110 vs PHI | Margin Engine: SEPARATION (BOS +15)</div>
          <div class="bet-reasoning">Margin engine projects BOS by 15 — SEPARATION character. The 18-pt pre-compression cap is reduced by Coaching Adjustment Compression (Nurse adjustmentRating: 8, 16.4% G2 compression). Even after compression, the structural gap (no Embiid, Drummond overmatched, White suppressing Maxey) sustains a 15-pt margin. G1's 32-pt blowout was above the Blowout Cascade threshold — G2 margins average 60% of G1 when exceeding 25. PHI's Talent Gap Amplifier is the bracket's widest. Covers -13.5 with 1.5pt cushion.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Wembanyama Over 24.5 pts (G2)</div>
          <div class="bet-line">-140 | G1: 35 pts (5-6 3PT)</div>
          <div class="bet-reasoning">Wemby's G1 was a masterpiece: 35pts on 5-6 from three (franchise playoff record). Rib contusion downgraded to 0.1 severity — non-factor. POR's Clingan can't match his offensive versatility. Line should be higher after G1 explosion. Fox-Wemby PnR generated elite looks. 25+ is baseline expectation.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Jaylen Brown Over 24.5 pts (G2)</div>
          <div class="bet-line">-150 | G1: 28pts in rout</div>
          <div class="bet-reasoning">Brown dominated in G1 with 28pts in a rout. As BOS's #1 option, his usage stays high even in blowouts. PHI has no answer — Edgecombe is a rookie guard. Brown's Finals MVP pedigree and 8.0 clutch rating means consistent high output. Tatum's return may spread touches but Brown still clears 25.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
      </div>
    </div>

    <!-- MEDIUM CONFIDENCE — G2 SUNDAY SERIES -->
    <div class="risk-tier">
      <div class="risk-tier-header">
        <span class="risk-tier-badge med-conf">MEDIUM CONFIDENCE</span>
        <span style="color:#888;font-size:13px;">G1 data validated but regression factors present</span>
      </div>
      <div class="bet-grid">
        <div class="bet-card">
          <span class="bet-type moneyline">MONEYLINE</span>
          <div class="bet-pick">ORL Magic ML (G2)</div>
          <div class="bet-line">+140 vs DET | Engine: DET +13 BUT G1 CORRECTION | Tue 7pm ESPN</div>
          <div class="bet-reasoning">MODEL CORRECTION — GOING AGAINST ENGINE. Structural ratings still favor DET (+13 SEPARATION), but G1 proved the model's ratings are wrong for this matchup. Single-initiator penalty is real — Cade scored 39 but DET bench went 4-16. Mosley's scheme (adjustmentRating: 7 vs Bickerstaff's 5) is repeatable. DET's 11-game home playoff losing streak is a franchise culture deficit. Fatigue differential slight (DET 6.2% vs ORL 5.5%). At +140, this is a value contrarian play where the eye test overrides the engine.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">SAS -10.5 (G2)</div>
          <div class="bet-line">-110 vs POR | Margin Engine: SEPARATION (SAS +16)</div>
          <div class="bet-reasoning">Margin engine projects SAS by 16 — SEPARATION character, wider than the 13-pt G1 result. Splitter's low adjustmentRating (4) means minimal Coaching Adjustment Compression (only 13.2% G2 recovery), keeping the margin elevated. Wemby's Talent Gap Amplifier is extreme (+16.9 on/off). Active Injury Drag on Sharpe's fibula compounds with fatigue. POR's Depth Disparity Factor also widens the gap — SAS has more players rated 55+. Covers -10.5 with 5.5pt cushion.</div>
          <span class="bet-edge model">Model Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type total">TOTAL</span>
          <div class="bet-pick">Under 208.5 BOS-PHI (G2)</div>
          <div class="bet-line">-110 | Margin Engine: SEPARATION (BOS +15)</div>
          <div class="bet-reasoning">Pace-Based Score Projection from the margin engine suggests ~206 total. BOS's SEPARATION character means starters rest in Q4, compressing totals. PHI's offense without Embiid produced only 91 in G1 — their Active Injury Margin Drag from missing a 90-rated star is the bracket's most impactful. Mazzulla's coaching compression works both ways — tighter defense limits both teams. G1 total was 214 but BOS's 123 won't repeat with shooting regression.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Tyrese Maxey Over 22.5 pts (G2)</div>
          <div class="bet-line">-110 | G1: 20pts on 8/20</div>
          <div class="bet-reasoning">Maxey was held to 20 on 8/20 in G1 — White's suppression worked. But his 28.3 PPG season average and increased desperation usage (only offensive threat without Embiid) support higher volume in G2. Line dropped from 26.5 to 22.5 post-G1. Bounce-back scoring likely even in a loss. Medium because White's defense is elite.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Cade Cunningham Over 9.5 assists (G2)</div>
          <div class="bet-line">-110 | G1: strong creation despite loss</div>
          <div class="bet-reasoning">Cade's 9.9 APG season average is elite creation. Even in G1 loss, his playmaking was DET's engine. Down 0-2 means DET funnels everything through him. ORL's defensive scheme double-teams Cade, which actually creates more passing lanes. Collapsed lung limits scoring burst but not court vision. 10+ assists is likely.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">De'Aaron Fox Over 17.5 pts (G2)</div>
          <div class="bet-line">-120 | G1: strong debut</div>
          <div class="bet-reasoning">Fox's first playoff game with SAS featured prominently in the Fox-Wemby PnR — the deadliest action on the team. Avg 18.5 PPG. With Wemby drawing all defensive attention after 35pts in G1, Fox gets even cleaner looks in G2. POR's backcourt defense can't contain his elite speed. Medium because POR may adjust scheme.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
      </div>
    </div>

    <!-- LOW CONFIDENCE — G2 SUNDAY SERIES -->
    <div class="risk-tier">
      <div class="risk-tier-header">
        <span class="risk-tier-badge low-conf">LOW CONFIDENCE</span>
        <span style="color:#888;font-size:13px;">Contrarian value | Regression plays | High variance</span>
      </div>
      <div class="bet-grid">
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">PHX Suns +12.5 (G2)</div>
          <div class="bet-line">-110 vs OKC | Margin Engine: SEPARATION (OKC +16)</div>
          <div class="bet-reasoning">Engine projects OKC by 16 — DOES NOT COVER at +12.5 based on expected margin. However, Blowout Cascade research shows G2 margins average 60% of G1 when exceeding 25 (35 × 0.6 = 21, but Coaching Adjustment Compression reduces further). The variance profile shows ~25% Blowout Probability — meaning 75% of the time the margin is under 16. Booker's 7.8 clutch rating provides GRIND potential. Risk: Ott's adjustmentRating (4) is too low to meaningfully compress OKC's dominance.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type spread">SPREAD</span>
          <div class="bet-pick">PHI 76ers +16.5 (G2)</div>
          <div class="bet-line">-110 vs BOS | Margin Engine: SEPARATION (BOS +15)</div>
          <div class="bet-reasoning">Engine projects BOS by 15 — COVERS +16.5 by 1.5pts based on expected margin. Nurse's Coaching Adjustment Compression (adjustmentRating: 8) is the key factor — his Toronto tenure showed elite G2 adjustments. The Blowout Cascade Pattern compresses G1's 32-pt margin to ~19 expected, then coaching compression brings it to 15. George's suspension-rust clearing and Maxey's shooting regression upward both support tighter margins. Low confidence because BOS's structural dominance could still produce another blowout (25% Blowout Probability).</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Paolo Banchero Over 23.5 pts (G2)</div>
          <div class="bet-line">+100 | G1: led ORL upset</div>
          <div class="bet-reasoning">Banchero's 6.2 clutch rating is ORL's best weapon. G1 upset validated ORL's offensive system — multi-creator approach with Banchero/Wagner/Bane. With momentum from the upset, Banchero's confidence and usage spike. DET may over-correct defensively on Cade, opening lanes for Paolo. 22.4 PPG baseline makes 24+ achievable.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Devin Booker Over 26.5 pts (G2)</div>
          <div class="bet-line">+130 | G1: held to low output in blowout</div>
          <div class="bet-reasoning">Booker was suppressed in the G1 blowout but his 26.0 PPG average and 7.8 clutch rating mean a bounce-back. Down 0-1 with playoff survival instincts, PHX funnels everything through Book. Star Prop Trap doesn't apply to the losing team's star — Booker plays 36+ minutes even in a loss. The +130 price offers value on a likely 25+ performance.</div>
          <span class="bet-edge historical">Historical Edge</span>
        </div>
        <div class="bet-card">
          <span class="bet-type prop">PLAYER PROP</span>
          <div class="bet-pick">Deni Avdija Over 22.5 pts (G2)</div>
          <div class="bet-line">-110 | G1: 30 pts</div>
          <div class="bet-reasoning">Avdija exploded for 30pts in G1 despite the loss — confirming he IS Portland's offense without Lillard. SAS may adjust with Vassell/Castle on him but his 6.7 APG creation means double-teams free teammates. All-Star breakout season and 28.5 USG% make 23+ points very likely. Low confidence only because SAS defensive adjustments in G2 may feature a dedicated stopper.</div>
          <span class="bet-edge matchup">Matchup Edge</span>
        </div>
      </div>
    </div>

    </div><!-- end betContent-g2 -->

    <!-- DISCLAIMER -->
    <div class="bets-disclaimer">
      <strong>Disclaimer:</strong> These picks are generated by a statistical model calibrated against 2025 NBA Playoff results (73.5% accuracy across 49 games). They are not guaranteed outcomes. All betting involves risk. Lines shown are approximate and may differ from your sportsbook. The model accounts for Home Court Advantage (round-adjusted), System Coherence, Championship DNA, Health Degradation, and Star Ceiling Variance — but cannot predict injuries, ejections, or one-game anomalies. Bet responsibly.
    </div>
  </div>`;
}
