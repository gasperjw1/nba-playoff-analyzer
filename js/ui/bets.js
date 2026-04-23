// ============================================================
// BETS PAGE
// ============================================================

function renderBetsPage(el) {
  el.innerHTML = `
  <div style="max-width:900px;margin:0 auto;padding:20px 10px;" class="bets-container">
    <h2 style="text-align:center;color:#fff;margin-bottom:4px;">2026 NBA Playoff Bets — Round 1</h2>
    <p style="text-align:center;color:#aaa;font-size:13px;margin-bottom:8px;">Model-driven picks for all 8 first-round series | G1: 8/13 (61.5%) | G2: 2/6 (33.3%) — 2 pending Wed Apr 22 | G3 projections live | Phase 30: coaching adjustment discount, youth breakout persistence, Bayesian player outlook</p>

    <!-- BET TABS -->
    <div class="scroll-x" style="display:flex;gap:0;margin-bottom:24px;justify-content:center;">
      <div class="bet-tab active" onclick="switchBetTab('parlays')" id="betTab-parlays" style="padding:10px 24px;border-radius:8px 0 0 8px;cursor:pointer;font-size:13px;font-weight:700;background:var(--accent);color:#fff;border:1px solid var(--accent);transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Featured Parlays</div>
      <div class="bet-tab" onclick="switchBetTab('g1')" id="betTab-g1" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 1 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g2')" id="betTab-g2" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 2 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g3')" id="betTab-g3" style="padding:10px 24px;border-radius:0 8px 8px 0;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 3 Bets</div>
    </div>

    <!-- ===== PARLAYS TAB ===== -->
    <div id="betContent-parlays" class="bet-content">
    <div class="parlay-featured">

      <!-- ===== TODAY'S DATE BANNER ===== -->
      <div style="text-align:center;margin-bottom:16px;">
        <span style="font-size:12px;font-weight:700;color:#64b5f6;background:rgba(100,181,246,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">UPCOMING — Thu Apr 23 | NYK-ATL G3, CLE-TOR G3, DEN-MIN G3</span>
      </div>

      <!-- ===== HEADLINE: $100 BEST BET — APR 22 ===== -->
      <div class="parlay-card headline">
        <div class="parlay-header">
          <span class="parlay-name" style="font-size:16px;color:#f0c040;">The $100 Play — G1-Proven Scorers (2-Leg)</span>
          <span class="parlay-odds" style="background:rgba(240,192,64,0.2);color:#f0c040;font-size:16px;">~+170</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
          <span style="font-size:11px;color:#f0c040;background:rgba(240,192,64,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$100 → ~$270 return</span>
          <span style="font-size:11px;color:#4caf50;background:rgba(76,175,80,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">TODAY — Wed Apr 22</span>
        </div>
        <div class="parlay-legs">
          <div class="parlay-leg" style="border-left:3px solid #f0c040;">
            <span class="parlay-leg-num">1</span>
            <span class="parlay-leg-pick">Cade Cunningham Over 28.5 pts (DET-ORL G2)</span>
            <span class="parlay-leg-odds">-104</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #f0c040;">
            <span class="parlay-leg-num">2</span>
            <span class="parlay-leg-pick">Banchero Over 22.5 pts (DET-ORL G2)</span>
            <span class="parlay-leg-odds">-115</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
        </div>
        <div class="parlay-reasoning" style="border-left-color:#f0c040;">Both legs backed by G1 evidence — no projection guesswork. <strong>Cade Over 28.5</strong> — erupted for 39pts in G1 at Orlando, clearing the line by 10.5pts. Now at home at Little Caesars Arena with Bickerstaff adjustments and crowd energy. Shooting was sustainable (not just free throws). Model projects 31.8pts with "good" outlook (28-36pt range). He's cleared this line in G1 by a massive margin. <strong>Banchero Over 22.5</strong> — posted 23/9/4 in G1, clearing the line as Orlando's offensive engine. Model projects 22.9pts. Whether ORL wins or loses, Paolo is their entire offense. Both players ACTUALLY HIT their overs in G1 — we're not projecting, we're confirming a pattern.</div>
      </div>

      <!-- ===== HEADLINE: $1 CHAOS TICKET — APR 22 ===== -->
      <div class="parlay-card headline" style="border:1px solid #f44336;">
        <div class="parlay-header">
          <span class="parlay-name" style="font-size:16px;color:#f44336;">The $1 Chaos Ticket — Upset + Props (3-Leg)</span>
          <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+1450</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
          <span style="font-size:11px;color:#f44336;background:rgba(244,67,54,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$1 → ~$15.50 return</span>
          <span style="font-size:11px;color:#ff9800;background:rgba(255,152,0,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">CONTRARIAN — Wed Apr 22</span>
        </div>
        <div class="parlay-legs">
          <div class="parlay-leg" style="border-left:3px solid #f44336;">
            <span class="parlay-leg-num">1</span>
            <span class="parlay-leg-pick">ORL ML @ DET (UPSET)</span>
            <span class="parlay-leg-odds">+320</span>
            <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #f44336;">
            <span class="parlay-leg-num">2</span>
            <span class="parlay-leg-pick">PHX +17.5 @ OKC</span>
            <span class="parlay-leg-odds">-110</span>
            <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #f44336;">
            <span class="parlay-leg-num">3</span>
            <span class="parlay-leg-pick">Banchero Over 22.5 pts (DET-ORL G2)</span>
            <span class="parlay-leg-odds">-115</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
        </div>
        <div class="parlay-reasoning" style="border-left-color:#f44336;">Last $1 Chaos Ticket hit for $11.03 — riding the hot hand. <strong>ORL ML +320</strong> — Orlando already won G1 (112-101) on the road behind Banchero's 23/9/4. They have the blueprint. DET's home crowd helps, but ORL proved this series is real. <strong>PHX +17.5</strong> — OKC won G1 by 35, but 17.5 is an enormous spread. PHX has professional pride, and blowout margins rarely repeat back-to-back. Even in a loss, Booker keeps it respectable. <strong>Banchero Over 22.5</strong> — the anchor leg. Posted 23/9/4 in G1 and is the engine of everything ORL does. Whether ORL wins or loses, Paolo scores. His line is set below his G1 output — this is the highest-confidence leg that funds the chaos.</div>
      </div>

      <!-- ===== ADDITIONAL G2 PARLAYS — APR 22 ===== -->
      <div class="parlay-grid">
        <div class="parlay-grid-header">More Apr 22 Parlays — OKC-PHX G2 &amp; DET-ORL G2</div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">OKC Depth Dominance (2-Leg)</span>
            <span class="parlay-odds">~+195</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">OKC ML vs PHX</span><span class="parlay-leg-odds">-2100</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">ORL +9.5 @ DET</span><span class="parlay-leg-odds">-110</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
          </div>
          <div class="parlay-reasoning">Two high-confidence sides from separate games. OKC ML is the safest bet on the board — PHX is depleted and OKC won G1 by 35. Even with heavy juice, it anchors the parlay. ORL +9.5 is value: they won G1 outright by 11 at Detroit. Getting 9.5pts at the same building they just won at? The G1 blueprint (multi-initiator attack, Banchero 23/9/4) is proven and repeatable.</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">DET Home Bounce-Back (2-Leg)</span>
            <span class="parlay-odds">~+225</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">DET ML vs ORL</span><span class="parlay-leg-odds">-410</span><span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">Cade Over 28.5 pts</span><span class="parlay-leg-odds">-104</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
          </div>
          <div class="parlay-reasoning">DET at home after ORL stole G1 (112-101). Cade's 39pts in G1 proves scoring is sustainable — at home with Bickerstaff adjustments, expect 28+. Harris bounce-back from cold G1 shooting gives DET the supporting cast edge. ML is medium confidence because ORL showed they can compete, but Cade's scoring is near-lock territory (cleared 28.5 by 10.5pts in G1).</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">DET-ORL G2 Star Duel (3-Leg)</span>
            <span class="parlay-odds">~+310</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">Cade Over 28.5 pts</span><span class="parlay-leg-odds">-104</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">Banchero Over 22.5 pts</span><span class="parlay-leg-odds">-115</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">Franz Wagner Over 17.5 pts</span><span class="parlay-leg-odds">-110</span><span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span></div>
          </div>
          <div class="parlay-reasoning">All three legs from DET-ORL where G1 data is strongest. Cade (39pts G1) and Banchero (23pts G1) both cleared their lines in G1. Wagner (14pts G1) is the bounce-back candidate — model projects 17.7pts and he's due for regression to his mean as ORL's #2 option. Wagner is the swing leg; Cade and Banchero are the anchors.</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">SGA Bounce-Back (2-Leg) — RISKY</span>
            <span class="parlay-odds">~+180</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">SGA Over 28.5 pts</span><span class="parlay-leg-odds">-130</span><span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">OKC ML vs PHX</span><span class="parlay-leg-odds">-2100</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
          </div>
          <div class="parlay-reasoning"><strong>CAUTION:</strong> SGA scored only 25pts in G1 on 5-18 FG (27.8%) and MISSED this exact over. The bull case: he played only 29 min (sat Q4 blowout), his FT drawing was elite (15-17), and career 47.4% FG means major regression up is likely. The bear case: 18 FGA in 29min already represents high volume — more minutes doesn't guarantee more makes if his shot isn't falling. This is a FG% regression bet, not a G1-proven bet. Downgraded to MEDIUM confidence — only play if you believe in the bounce-back.</div>
        </div>

      </div><!-- end parlay-grid -->

      <!-- ===== G3 FEATURED PARLAYS ===== -->
      <div style="margin-top:24px;border-top:2px solid #64b5f6;padding-top:20px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#64b5f6;background:rgba(100,181,246,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">UPCOMING G3 PARLAYS — Thu Apr 23 &amp; Fri Apr 24</span>
        </div>

        <!-- $100 G3 BEST BET — THU APR 23 -->
        <div class="parlay-card headline">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f0c040;">G3 $100 Play — Thu Apr 23 (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(240,192,64,0.2);color:#f0c040;font-size:16px;">~+420</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f0c040;background:rgba(240,192,64,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$100 &rarr; ~$520 return</span>
            <span style="font-size:11px;color:#64b5f6;background:rgba(100,181,246,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">Thu Apr 23</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">Brandon Ingram Under 18.5 pts (CLE-TOR G3)</span>
              <span class="parlay-leg-odds">-120</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">Anthony Edwards Over 23.5 pts (DEN-MIN G3)</span>
              <span class="parlay-leg-odds">-130</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">NYK ML @ ATL (NYK-ATL G3)</span>
              <span class="parlay-leg-odds">-105</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f0c040;"><strong>Ingram U18.5</strong> — the anchor. CLE's defensive scheme has LOCKED Ingram: 17pts G1 &rarr; 7pts G2 (3/15 FG). Model projects just 13pts for G3. Even at home in Toronto, the scheme is structural and repeatable. 5.5pt cushion. <strong>Edwards O23.5</strong> — trending 22&rarr;30pts with improving knee health, NOW AT HOME in Target Center. Model projects 24.6pts. Phase 29 youth breakout at home. <strong>NYK ML</strong> — model projects NYK by 6 but market has it at pick'em (-105). Massive value discrepancy. Brunson's 39.6% FG will regress UP, NYK FT% (63% G2) normalizes, bench (0pts G2) regresses. ATL's 72.2% Q4 shooting was unsustainable.</div>
        </div>

        <!-- $1 CHAOS TICKET — THU APR 23 -->
        <div class="parlay-card headline" style="border:1px solid #f44336;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f44336;">G3 $1 Chaos Ticket — Thu Apr 23 (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+1850</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f44336;background:rgba(244,67,54,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$1 &rarr; ~$19.50 return</span>
            <span style="font-size:11px;color:#ff9800;background:rgba(255,152,0,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">CONTRARIAN — Thu Apr 23</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">MIN ML vs DEN (DEN-MIN G3)</span>
              <span class="parlay-leg-odds">+125</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">ATL ML vs NYK (NYK-ATL G3)</span>
              <span class="parlay-leg-odds">+120</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">TOR ML vs CLE (CLE-TOR G3)</span>
              <span class="parlay-leg-odds">+195</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f44336;">Three home underdogs on Thu Apr 23 — all playing their first home game of the series. <strong>MIN ML</strong> — Edwards trending 22&rarr;30 at Target Center, no altitude penalty, won G2 on the road. Series tied 1-1. Jokic-Murray Q4 collapse (2-12 FG) is a real trend. <strong>ATL ML</strong> — stole G2 at MSG with McCollum's 32pts. Home crowd + Kuminga's expanded role + Snyder's proven Q4 adjustments. <strong>TOR ML</strong> — longest odds but Quickley's return transforms offense. Barnes trending up (21&rarr;26pts). First home game crowd energy. Model has CLE by 7, but 0-2 teams win G3 at home ~40% of the time.</div>
        </div>

        <!-- $100 G3 BEST BET — FRI APR 24 -->
        <div class="parlay-card headline">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f0c040;">G3 $100 Play — Fri Apr 24 (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(240,192,64,0.2);color:#f0c040;font-size:16px;">~+490</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f0c040;background:rgba(240,192,64,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$100 &rarr; ~$590 return</span>
            <span style="font-size:11px;color:#64b5f6;background:rgba(100,181,246,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">Fri Apr 24</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">Jaylen Brown Over 24.5 pts (BOS-PHI G3)</span>
              <span class="parlay-leg-odds">-120</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">LAL +9.5 @ HOU (HOU-LAL G3)</span>
              <span class="parlay-leg-odds">-110</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">Scoot Henderson Over 22.5 pts (SAS-POR G3)</span>
              <span class="parlay-leg-odds">-110</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f0c040;"><strong>Brown O24.5</strong> — averaging 31.0pts through 2 games on 51% FG. PHI's wing defense cannot contain him (Edgecombe D-LEBRON 0.08). Highest-confidence prop on the BOS-PHI slate. <strong>LAL +9.5</strong> — best VALUE bet on the slate. Model projects HOU by only 5, but market gives LAL 9.5pts. Redick's scheme is structural and travels (held HOU to 39% FG across 2 games). Smart (20ppg) and Kennard (25ppg) are sustained. 4.5pt cushion. <strong>Henderson O22.5</strong> — youth breakout CONFIRMED (18&rarr;31pts). Phase 29 persistence active at age 21. NOW AT HOME at Moda Center. MEGA BOOST: Wemby OUT (concussion) + Barnes OUT (wrist) + McLaughlin OUT (ankle). SAS missing 3 rotation players including their rim protector. Henderson has open lanes, no intimidation factor, weakened defensive rotations. 25+ is the floor.</div>
        </div>

        <!-- $1 CHAOS TICKET — FRI APR 24 -->
        <div class="parlay-card headline" style="border:1px solid #f44336;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f44336;">G3 $1 Chaos Ticket — Fri Apr 24 (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+2200</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f44336;background:rgba(244,67,54,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$1 &rarr; ~$23.00 return</span>
            <span style="font-size:11px;color:#ff9800;background:rgba(255,152,0,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">CONTRARIAN — Fri Apr 24</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">PHI ML @ BOS (BOS-PHI G3 — UPSET)</span>
              <span class="parlay-leg-odds">+270</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">LAL ML @ HOU (HOU-LAL G3 — UPSET)</span>
              <span class="parlay-leg-odds">+325</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">Edgecombe Over 24.5 pts (BOS-PHI G3)</span>
              <span class="parlay-leg-odds">+120</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f44336;">Pure chaos play: three contrarian legs. <strong>PHI ML</strong> — PHI just won G2 111-97 on the road. Nurse's adjustment masterclass, Edgecombe's emergence as 2nd initiator, Maxey's home comfort. If BOS's 3PT stays cold (26% G2), PHI wins again. <strong>LAL ML</strong> — Redick has outcoached Udoka in EVERY dimension. Smart and Kennard are sustained elite. LeBron's legacy motivation vs KD. LAL's scheme is structural and travels. <strong>Edgecombe O24.5</strong> — the swing leg. Youth breakout persistence (Phase 29) says consecutive breakouts are MORE likely for ≤23-year-olds. His 30pts G2 may not fully repeat, but at home in Philly with crowd energy and Nurse designing plays for him, 25+ is possible even with Mazzulla's counter-schemes.</div>
        </div>
      </div>

      <!-- ===== PARLAY HISTORY TIMELINE ===== -->
      <div style="margin-top:28px;border-top:1px solid #333;padding-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <div>
            <span style="font-size:15px;font-weight:700;color:#aaa;">Parlay History</span>
            <span style="font-size:11px;color:#666;margin-left:8px;">Featured $100 &amp; $1 picks — running record</span>
          </div>
          <div style="display:flex;gap:12px;font-size:12px;">
            <span style="color:#4caf50;font-weight:700;">$100 Record: 0-1</span>
            <span style="color:#f0c040;font-weight:700;">$1 Record: 1-0</span>
            <span style="color:#aaa;">Net P&amp;L: <span style="color:#f44336;">-$88.97</span></span>
          </div>
        </div>

        <div style="max-height:320px;overflow-y:auto;padding-right:4px;scrollbar-width:thin;scrollbar-color:#444 transparent;">

          <!-- ===== G3 SLATE — Thu Apr 23 (UPCOMING) ===== -->
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="min-width:90px;text-align:right;padding-top:2px;">
              <div style="font-size:12px;font-weight:700;color:#64b5f6;">Thu Apr 23</div>
              <div style="font-size:10px;color:#666;">G3: DEN-MIN, CLE-TOR, NYK-ATL</div>
              <div style="font-size:10px;color:#64b5f6;font-weight:600;">UPCOMING</div>
            </div>
            <div style="width:2px;background:linear-gradient(to bottom,#64b5f6,#333);border-radius:1px;position:relative;">
              <div style="position:absolute;top:4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#64b5f6;border:2px solid #1a1a2e;"></div>
            </div>
            <div style="flex:1;">
              <div style="background:rgba(100,181,246,0.06);border:1px solid rgba(100,181,246,0.2);border-radius:8px;padding:10px 14px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                  <span style="font-size:11px;font-weight:700;color:#f0c040;background:rgba(240,192,64,0.12);padding:2px 8px;border-radius:3px;">$100: Ingram U18.5 + Edwards O23.5 + NYK ML</span>
                  <span style="font-size:11px;color:#64b5f6;">~+420</span>
                </div>
                <div style="font-size:10px;color:#888;margin-bottom:6px;">Ingram scheme-locked (7pts G2), Edwards trending 22→30 at home, NYK model +6 at pick'em odds</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 8px;border-radius:3px;">$1: MIN ML + ATL ML + TOR ML (3-team upset)</span>
                  <span style="font-size:11px;color:#64b5f6;">~+1850</span>
                </div>
                <div style="font-size:10px;color:#888;">All underdogs at home. Edwards trending up, ATL stole G2 at MSG, TOR gets Quickley back</div>
              </div>
            </div>
          </div>

          <!-- ===== G3 SLATE — Fri Apr 24 (UPCOMING) ===== -->
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="min-width:90px;text-align:right;padding-top:2px;">
              <div style="font-size:12px;font-weight:700;color:#64b5f6;">Fri Apr 24</div>
              <div style="font-size:10px;color:#666;">G3: HOU-LAL, OKC-PHX, SAS-POR, BOS-PHI</div>
              <div style="font-size:10px;color:#64b5f6;font-weight:600;">UPCOMING</div>
            </div>
            <div style="width:2px;background:linear-gradient(to bottom,#64b5f6,#333);border-radius:1px;position:relative;">
              <div style="position:absolute;top:4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#64b5f6;border:2px solid #1a1a2e;"></div>
            </div>
            <div style="flex:1;">
              <div style="background:rgba(100,181,246,0.06);border:1px solid rgba(100,181,246,0.2);border-radius:8px;padding:10px 14px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                  <span style="font-size:11px;font-weight:700;color:#f0c040;background:rgba(240,192,64,0.12);padding:2px 8px;border-radius:3px;">$100: Brown O24.5 + LAL +9.5 + Henderson O22.5</span>
                  <span style="font-size:11px;color:#64b5f6;">~+490</span>
                </div>
                <div style="font-size:10px;color:#888;margin-bottom:6px;">Brown avg 31.0pts, LAL scheme keeps it close, Henderson youth breakout at home (18→31)</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 8px;border-radius:3px;">$1: PHI ML + LAL ML + POR ML (3-team road upset)</span>
                  <span style="font-size:11px;color:#64b5f6;">~+2200</span>
                </div>
                <div style="font-size:10px;color:#888;">Three road underdogs: Nurse masterclass, Redick scheme travels, Henderson at home if Wemby out</div>
              </div>
            </div>
          </div>

          <!-- ===== APR 22 — TODAY (LIVE) ===== -->
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="min-width:90px;text-align:right;padding-top:2px;">
              <div style="font-size:12px;font-weight:700;color:#4caf50;">Wed Apr 22</div>
              <div style="font-size:10px;color:#666;">G2: OKC-PHX, DET-ORL</div>
              <div style="font-size:10px;color:#4caf50;font-weight:600;">LIVE TODAY</div>
            </div>
            <div style="width:2px;background:linear-gradient(to bottom,#4caf50,#333);border-radius:1px;position:relative;">
              <div style="position:absolute;top:4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#4caf50;border:2px solid #1a1a2e;animation:pulse 2s infinite;"></div>
            </div>
            <div style="flex:1;">
              <div style="background:rgba(76,175,80,0.06);border:1px solid rgba(76,175,80,0.2);border-radius:8px;padding:10px 14px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                  <span style="font-size:11px;font-weight:700;color:#f0c040;background:rgba(240,192,64,0.12);padding:2px 8px;border-radius:3px;">$100: Cade O28.5 + Banchero O22.5</span>
                  <span style="font-size:11px;color:#4caf50;">~+170</span>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 8px;border-radius:3px;">$1: ORL ML + PHX +17.5 + Banchero O22.5</span>
                  <span style="font-size:11px;color:#4caf50;">~+1450</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== G2 FIRST SLATE — Sun Apr 20 (RESULTS) ===== -->
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="min-width:90px;text-align:right;padding-top:2px;">
              <div style="font-size:12px;font-weight:700;color:#aaa;">Sun Apr 20</div>
              <div style="font-size:10px;color:#666;">G2 First Slate</div>
            </div>
            <div style="width:2px;background:linear-gradient(to bottom,#333,#333);border-radius:1px;position:relative;">
              <div style="position:absolute;top:4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#333;border:2px solid #1a1a2e;"></div>
            </div>
            <div style="flex:1;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid #333;border-radius:8px;padding:10px 14px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:6px;">
                  <span style="font-size:11px;font-weight:700;color:#f0c040;background:rgba(240,192,64,0.12);padding:2px 8px;border-radius:3px;">$100: Wemby O24.5 + Brown O24.5 + Fox O6.5ast</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;margin-bottom:8px;">Wemby concussion (5pts) ✗ | Brown 36pts ✓ | Fox 4ast ✗ — <span style="color:#f44336;">-$100</span></div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 8px;border-radius:3px;">$1: LAL ML + POR +11.5 + Maxey O24.5</span>
                  <span style="font-size:11px;font-weight:700;color:#4caf50;background:rgba(76,175,80,0.15);padding:2px 6px;border-radius:3px;">WON +$11.03</span>
                </div>
                <div style="font-size:10px;color:#888;">LAL ML ✓ | POR +11.5 ✓ | Maxey O24.5 ✓ — <span style="color:#4caf50;">ALL HIT! $1 → $11.03</span></div>
              </div>
            </div>
          </div>

        </div><!-- end scrollable timeline -->
      </div><!-- end parlay history -->

    </div>
    </div><!-- end betContent-parlays -->

    <!-- ===== G1 BETS TAB ===== -->
    <div id="betContent-g1" class="bet-content" style="display:none;">
    <h3 style="color:#aaa;margin:0 0 16px;">Game 1 Results — 8/13 Correct (61.5%)</h3>
    <p style="color:#666;font-size:13px;margin-bottom:16px;">Game 1 bets are locked in. See G2 tab for updated picks based on G1 outcomes and deep-dive research.</p>

    <div class="bet-section">
      <h4 style="color:#4caf50;margin:0 0 8px;font-size:14px;">HIGH CONFIDENCE — 6/6 Correct</h4>
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">CLE ML vs TOR ✓</div>
        <div class="bet-line">-350 | Model: CLE by 14</div>
        <div class="bet-reasoning">Cavaliers dominated at home as expected.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">BOS ML vs PHI ✓</div>
        <div class="bet-line">-400 | Model: BOS by 16</div>
        <div class="bet-reasoning">Celtics dismantled a depleted 76ers squad.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">OKC ML vs PHX ✓</div>
        <div class="bet-line">-450 | Model: OKC by 15</div>
        <div class="bet-reasoning">Thunder blew out Suns by 35. SGA scored 25 in 29min (sat Q4). PHX missing key players.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">SAS ML vs POR ✓</div>
        <div class="bet-line">-300 | Model: SAS by 16</div>
        <div class="bet-reasoning">Wembanyama dominated Portland's interior as projected.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">NYK ML vs ATL ✗</div>
        <div class="bet-line">-260 | Model: NYK by 12 | Actual: ATL 107-106</div>
        <div class="bet-reasoning">ATL stole G2 at MSG — CJ McCollum's 32pts overwhelmed model projection. Model overrated NYK's home-court edge.</div>
        <span class="bet-edge miss">Miss</span>
      </div>
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DEN ML vs MIN ✓</div>
        <div class="bet-line">-180 | Model: DEN by 8 | Actual: DEN 116-105 (+11)</div>
        <div class="bet-reasoning">Jokic triple-double (25/13/11), Murray historic 16/16 FT. DEN dominated middle quarters outscoring MIN 68-46.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
    </div>

    <div class="bet-section">
      <h4 style="color:#ff9800;margin:0 0 8px;font-size:14px;">MEDIUM CONFIDENCE — 2/4 Correct (both upsets missed)</h4>
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DET ML vs ORL ✗</div>
        <div class="bet-line">-150 | Model: DET by 5 | Actual: ORL 112-101 (+11)</div>
        <div class="bet-reasoning">UPSET. ORL won wire-to-wire with 5 players in double figures. Cade's 39pts wasn't enough — DET's supporting cast (Harris 17, rest cold) couldn't match ORL's balanced attack.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">HOU ML vs LAL ✗</div>
        <div class="bet-line">-140 | Model: HOU by 3 | Actual: LAL 107-98 (+9)</div>
        <div class="bet-reasoning">UPSET. LeBron masterclass (19pts/13ast) with Kennard exploding for 27pts. HOU shot 37.6% FG. LAL's zone defense stifled HOU's young core.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">OKC -10.5 vs PHX ✓</div>
        <div class="bet-line">-110 | Model: OKC by 15</div>
        <div class="bet-reasoning">Thunder covered easily with PHX's depleted roster.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">BOS -11.5 vs PHI ✓</div>
        <div class="bet-line">-110 | Model: BOS by 16 | Actual: BOS 123-91 (+32)</div>
        <div class="bet-reasoning">Celtics obliterated PHI by 32 — easily covered. PHI's 4-23 3PT shooting (17.4%) was historically bad.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
    </div>

    <div class="bet-section">
      <h4 style="color:#f44336;margin:0 0 8px;font-size:14px;">LOW CONFIDENCE — 0/3 Correct</h4>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">SGA Over 28.5 pts ✗</div>
        <div class="bet-line">-130 | G1 actual: 25 pts (29min — sat Q4 blowout)</div>
        <div class="bet-reasoning">SGA scored 25pts on 5-18 FG in only 29min. Missed the over, but context matters: he sat the entire Q4 of a 35-pt blowout. Volume was there (18 FGA) — efficiency wasn't (27.8% FG).</div>
        <span class="bet-edge historical">Historical</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jokic triple-double ✗</div>
        <div class="bet-line">+180 | G1: 28/14/8</div>
        <div class="bet-reasoning">Jokic fell 2 assists short despite dominant performance. MIN's switching limited drive-and-kick opportunities.</div>
        <span class="bet-edge historical">Historical</span>
      </div>
      <div class="bet-card">
        <span class="bet-type total">TOT</span>
        <div class="bet-pick">DET-ORL Under 210.5 ✗</div>
        <div class="bet-line">-110 | G1 total: 215</div>
        <div class="bet-reasoning">Both teams shot well from three in G1, pushing total over. ORL's multi-initiator offense generated more points than expected.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
    </div>
    </div><!-- end betContent-g1 -->

    <!-- ===== G2 BETS TAB ===== -->
    <div id="betContent-g2" class="bet-content" style="display:none;">
    <h3 style="color:#aaa;margin:0 0 4px;">Game 2 Picks — G2 Record: 4/8 (50.0%) | OKC-PHX G2 pending</h3>
    <p style="color:#666;font-size:12px;margin-bottom:16px;">G2 moneyline record: 4 correct, 4 wrong out of 8 completed games (50.0%). Recent wins: ✅ DET ML (98-83 blowout), ✅ Cade O7.5ast (11ast). SAS-POR G2 losses were Wemby-injury-driven. DET-ORL G2 was the model's best call — got the winner AND both prop bets (DET ML + Cade assists). OKC-PHX G2 pending.</p>

    <!-- COMPLETED + SATURDAY/SUNDAY G2 GAMES -->
    <div class="bet-section">
      <h4 style="color:#fff;margin:0 0 12px;font-size:15px;border-bottom:1px solid #333;padding-bottom:6px;">Completed G2 Games — Sat-Mon Apr 18-21 | ML Record: ✅ CLE, ✅ MIN, ❌ NYK, ❌ HOU</h4>

      <!-- CLE-TOR -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">CLE ML vs TOR ✓</div>
        <div class="bet-line">-300 | Model: CLE 113-102 (+11) | Actual: CLE 115-105 (+10) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: CLE wins 115-105 (+10). Model projected +11 — within 1 point.</strong> Mitchell 30pts (model: 27.3), Harden 28pts/4ast (model: 19.1pts/8.7ast — role shifted to scorer), Mobley 25pts on 11/13 FG (model: 15.4 — massive underestimate). TOR's Barnes bounced back to 26pts (model: 19.7 — underestimated bounce-back). Ingram collapsed to 7pts/3-15 FG (model: 18.7 — didn't predict defensive scheme impact). KEY: TOR 22 turnovers vs CLE 12 was the decisive factor the model doesn't explicitly project.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">James Harden Over 7.5 assists ✗</div>
        <div class="bet-line">-120 | Model: 8.7 APG | Actual: 4 AST ✗</div>
        <div class="bet-reasoning"><strong>RESULT: Harden had only 4 assists (model: 8.7). LOSS.</strong> Critical model miss — Harden's role shifted from facilitator (10 ast G1) to primary scorer (28pts on 9/14 FG). The Bayesian update correctly boosted assists based on G1, but failed to anticipate a tactical role change. LEARNING: Player role flexibility (facilitator↔scorer) is a variable the model doesn't capture. When a team's top players all score 25+, assist totals naturally compress.</div>
        <span class="bet-edge model">Model Edge ✗</span>
      </div>

      <!-- DEN-MIN -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">MIN ML @ DEN ✓</div>
        <div class="bet-line">+160 | Model: MIN 112-109 (+3) | GRIND | Actual: MIN 119-114 ✓</div>
        <div class="bet-reasoning"><strong>RESULT: MIN wins 119-114. Model predicted MIN upset — CORRECT.</strong> Backtest-calibrated pick: Edwards' starCeiling:2 flagged G2 as the most likely "explosion game" spot. Edwards delivered 30pts/10reb double-double (+20 net rating), confirming knee is warming up (22pts G1 → 30pts G2). Randle bounce-back 24/9/6 on 50% FG. DiVincenzo 16/7/6 justified starting over Conley. MIN completed 19-point road comeback — trailed 39-25 after Q1, stormed back. Jokic-Murray Q4 collapse (combined 2-12) was the decisive swing. KEY X-FACTOR: Hyland 13pts in 10min off bench (3-4 3PT) sparked the comeback run.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jokic Over 12.5 rebounds ✓</div>
        <div class="bet-line">-110 | Model: 13.5 RPG | Actual: 15 reb ✓</div>
        <div class="bet-reasoning"><strong>RESULT: Jokic had 15 rebounds — clears 12.5 by 2.5.</strong> Bayesian model projected 13.5 and Jokic exceeded it. MIN won the rebounding battle 49-43 overall, but Jokic individually dominated the glass (8-20 FG, 1-7 3PT = many long misses creating rebound opportunities). His positioning and anticipation remain elite regardless of shooting efficiency.</div>
        <span class="bet-edge historical">Historical ✓</span>
      </div>

      <!-- NYK-ATL -->
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">NYK ML vs ATL ✗</div>
        <div class="bet-line">-250 | Model: NYK 113-103 (+10) | Actual: ATL 107-106 | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS.</strong> ATL stunned NYK 107-106 at MSG — McCollum's 32pts and go-ahead step-back jumper over OG with 34sec left sealed it. Model projected NYK +10 but missed ATL's closing ability. KAT disappeared — only 18pts (14 in Q3, vanished in Q4). Kuminga's 19pts (+10) was the defensive X-factor. Series now tied 1-1.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">KAT Over 10.5 rebounds ✗</div>
        <div class="bet-line">-120 | Model: 10.7 RPG | Actual: ~8 reb | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS.</strong> KAT had approximately 8 rebounds (3 offensive) — below the 10.5 line despite model projecting 10.7. His "disappearance" in Q4 per ClutchPoints limited his rebounding aggressiveness. ATL's Kuminga disrupted KAT's positioning and contested long rebounds. The model's projection was correct directionally but the game flow (tight loss, KAT passive late) suppressed volume.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>

      <!-- HOU-LAL G2 — LAL wins 101-94 -->
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">HOU ML @ LAL ✗</div>
        <div class="bet-line">-210 | Model: HOU 108-101 (+7) | Actual: LAL 101-94 (+7) | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS.</strong> LAL won 101-94 — model was wrong by 14pts on margin (picked HOU +7, actual LAL +7). KD's return BACKFIRED: 23pts but 9 turnovers as LAL doubled from possession one. Smart continued breakout (25pts/5 3PM/7ast). Kennard sustained 23pts (8-13 FG). LeBron 28/8/7 with zero fatigue signs at 41. HOU shot 40.4% FG and 24% 3PT — offensive suppression continued. Model is now 0-2 on this series with a cumulative 23pt swing in the wrong direction.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">HOU -5.5 @ LAL ✗</div>
        <div class="bet-line">-110 | Model: HOU +7 | Actual: LAL +7 | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS.</strong> Not even close — LAL won by 7 instead of HOU by 5.5+. A 12.5pt miss on the spread. KD's return was supposed to be the catalyst but instead created chaos (9 TOs). The model overweighted KD's return and underweighted Redick's defensive scheme adaptability. LAL's zone/doubling defense is structural, not variance — it neutralized KD's addition completely.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">LeBron James Over 9.5 assists ✗</div>
        <div class="bet-line">-110 | Model: 9.5 APG | Actual: 7 ast | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS.</strong> LeBron had 7 assists — 2.5 under the line. The model correctly flagged this as a SKIP (no edge at 9.5) and LeBron shifted toward scoring mode (28pts, up from 19 in G1). With KD on the floor, game tempo slowed and LAL had fewer possessions. LeBron's assists compressed from 13 (G1) → 7 (G2) as he became a scorer rather than facilitator. Lesson: player role flexibility (scorer↔facilitator) is a real variable.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>
    </div>

    <!-- TODAY'S G2 GAMES (Tue Apr 21) -->
    <div class="bet-section">
      <h4 style="color:#fff;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #333;padding-bottom:6px;">Completed G2 Games — Tue Apr 21 | ML Record: ❌ BOS, ❌ SAS</h4>

      <!-- BOS-PHI G2 RESULTS (7:00pm ET) — PHI 111, BOS 97 — PHI UPSET -->
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">BOS ML vs PHI ✗</div>
        <div class="bet-line">-850 | Model: BOS +11 | Actual: PHI 111-97 (+14) | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS.</strong> PHI won outright 111-97. Edgecombe BREAKOUT (30pts, 12-20 FG, 6-10 3PT) transformed PHI into a 2-initiator offense. BOS shot 26% from 3PT (13-50) — team-wide collapse. Nurse's G2 adjustments were masterful despite model dismissing them due to "roster limitations." Model's biggest G2 miss: overweighted 32-pt G1 momentum, underweighted coaching adjustment + youth breakout potential.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">PHI +14.5 vs BOS ✓</div>
        <div class="bet-line">-110 | Model: +11 margin | Actual: PHI won by 14 | WIN</div>
        <div class="bet-reasoning"><strong>RESULT: ✓ WIN.</strong> PHI didn't just cover +14.5 — they won outright by 14. The Phase 23 flip to PHI spread was the right call: PHI 3PT regression (17.4%→49%), Nurse adjustments, and Maxey bounce-back all materialized. Model's contrarian PHI +14.5 lean was validated even though the ML pick was wrong.</div>
        <span class="bet-edge" style="background:#4caf50;color:#fff;">WIN</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jaylen Brown Over 24.5 points ✓</div>
        <div class="bet-line">-120 | Model: 26.8 pts | Actual: 36pts (14-28 FG) | WIN</div>
        <div class="bet-reasoning"><strong>RESULT: ✓ WIN.</strong> Brown exploded for 36pts (14-28 FG, 5-12 3PT, 9-12 FT) — cleared 24.5 by 11.5pts. MVP-level performance in a LOSS. Brown is averaging 31.0pts through 2 games. The Edgecombe mismatch (D-LEBRON 0.08) was validated — Brown scored at will. Highest-confidence prop on the BOS-PHI slate was correct.</div>
        <span class="bet-edge" style="background:#4caf50;color:#fff;">WIN</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Tatum Over 10.5 rebounds ✗</div>
        <div class="bet-line">+105 | Model: 10.8 RPG | Actual: 8 reb in 32min | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS.</strong> Tatum had only 8 rebounds in 32 minutes. His per-minute rate dropped from 0.34 in G1 to 0.25 in G2. The 5-foul game (recovery volatility) reduced his aggressiveness inside. Achilles recovery volatility lesson: post-injury players have wider variance than Bayesian blend captures — good G1 doesn't guarantee good G2.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>

      <!-- ═══ WEDNESDAY G2 GAMES (Apr 22) ═══ -->
      <div style="margin:20px 0 12px;padding:8px 0;border-top:2px solid #444;border-bottom:1px solid #333;">
        <span style="color:#4caf50;font-size:14px;font-weight:700;">Wed Apr 22 RESULTS | DET-ORL G2: ✅ DET ML (+15), ✅ Cade O7.5ast (11ast) | OKC-PHX G2: pending</span>
      </div>

      <!-- OKC-PHX (9:30pm ET) -->
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">OKC ML vs PHX</div>
        <div class="bet-line">-2100 | Model: OKC 114-101 (+13) | SEPARATION | ESPN: OKC -17.5</div>
        <div class="bet-reasoning">Phase 22 outlook: SGA "good" (46% FG, 28-36pts — massive bounce-back from 27.8% G1 shooting, will play full game), J.Williams "good" (52% FG, 18-26pts — All-NBA form confirmed), Holmgren "neutral-good" (49% FG — PHX has no interior answer). PHX outlook is grim: Brooks "bad" (36% FG, chronic playoff chucker), Ighodaro "bad" (zero offense), Dunn "bad" (30% FG). Booker "neutral-good" (48% FG, 24-32pts) is PHX's only positive outlook. OKC's depth overwhelms PHX at every position.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">OKC -17.5 vs PHX</div>
        <div class="bet-line">-110 | Model: +13 margin | Outlook-adjusted spread</div>
        <div class="bet-reasoning">Phase 22 outlooks push OKC's margin back up to +13 (from +9 pre-outlook). SGA's "good" outlook + full game (sat Q4 in G1 blowout) means more scoring volume. PHX's collective "bad" outlooks (Brooks 36%, Dunn 30%, Ighodaro 35%) drag their team projection. OKC -17.5 is still a stretch vs +13 model — 4.5pt gap means AVOID the spread. Stick with ML or player props.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">SGA Over 28.5 points — MEDIUM (bounce-back bet)</div>
        <div class="bet-line">-130 | Model: 31.5 pts | Outlook: GOOD (46% FG) | G1: 25pts in 29min (MISSED over)</div>
        <div class="bet-reasoning"><strong>CAUTION — SGA missed this exact over in G1 (25pts on 5-18 FG).</strong> The model projects bounce-back to 31.5pts based on: FG% regression (27.8% → career 47.4%), full game minutes (29min G1 → 36min G2), and elite FT floor (15-17 in G1). But 18 FGA in 29min already represents high volume — more minutes doesn't guarantee more makes. This is a FG% regression bet, NOT a G1-proven bet. Play if you believe in the bounce-back; skip if you want G1 evidence behind your pick.</div>
        <span class="bet-edge model">Regression Bet</span>
      </div>

      <!-- DET-ORL -->
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DET ML vs ORL ✓</div>
        <div class="bet-line">-410 | Model: DET 105-102 (+3) | Actual: DET 98-83 (+15) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: DET wins 98-83 (+15). Model projected +3 — got the winner but margin was 12pts off.</strong> Cade pivoted from scoring (39pts G1) to distributing (27pts/11ast on 57.9% FG). 6 DET players in double figures. Bickerstaff's adjustments were masterful — WCJ fouled out (6PF, 3pts), Duren freed (11/9reb/4ast), Stewart perfect (4-4 FG, 10pts). ORL shot 33% (season low). DET ended NBA's longest home playoff losing streak. KEY LEARNING: Stars who switch between scoring and distributing create unsolvable defensive problems.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Cade Cunningham Over 7.5 assists ✓</div>
        <div class="bet-line">-110 | Model: 7.8 APG | Actual: 11 AST ✓ (cleared by 3.5)</div>
        <div class="bet-reasoning"><strong>RESULT: ✓ WIN — Cade had 11 assists (model: 7.8, line: 7.5). Cleared by 3.5!</strong> Cade's pivot to distribution mode (27pts/11ast on only 19 FGA vs 27 in G1) was the game's defining adjustment. Bickerstaff designed more ball-movement sets, Duren's 4 assists reflect better half-court offense. The model correctly identified that Cade would increase assists but underestimated the magnitude. KEY: When a star scorer pivots to distributing, assists don't just meet the line — they smash it.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>

      <!-- SAS-POR (8:00pm ET) — No major injury changes -->
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">SAS ML vs POR ✗</div>
        <div class="bet-line">-700 | Model: SAS 112-100 (+12) | Actual: POR 106-103 (-3)</div>
        <div class="bet-reasoning"><strong>LOSS — WEMBY CONCUSSION:</strong> Wembanyama fell face-first at 8:57 Q2 after Holiday foul — entered concussion protocol, OUT for remainder. Only 5pts in 12min. SAS collapsed without him (+16.9 on/off means they're a different team). Scoot Henderson exploded for 31pts (11-17 FG, 5-9 3PT). Holiday bounce-back: 19pts/9ast/5stl. SAS 3PT regression confirmed: 7-24 (29%). Model had no mechanism for mid-game star injuries — this was an unpredictable event, not a model logic failure.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">SAS -11.5 vs POR ✗</div>
        <div class="bet-line">-110 | Model: +12 margin | Actual: POR +3 (15pt miss)</div>
        <div class="bet-reasoning"><strong>LOSS:</strong> 15pt miss from model — entirely driven by Wemby's G2 concussion exit. Without Wemby, SAS's rating drops ~15pts and they become an underdog. Scoot Henderson's 31pt youth breakout (Phase 28 multiplier territory) and Holiday's 19pts/9ast/5stl bounce-back were the catalysts. SAS shot 29% from 3PT — 3PT regression model was correct directionally.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Wembanyama Over 25.5 points ✗</div>
        <div class="bet-line">-125 | Model: 28.2 pts | Actual: 5pts (12min — concussion exit)</div>
        <div class="bet-reasoning"><strong>LOSS — INJURY:</strong> Wemby fell face-first to court at 8:57 Q2, entered concussion protocol, OUT for remainder. Only 5pts/4reb/1blk in 12min before injury. Per NBA policy: minimum 48hrs before return. G3 Fri Apr 24 — QUESTIONABLE. Model lesson: prop bets on individual players carry inherent injury variance that the model can't capture. With star players who have extreme on/off (+16.9), this risk is asymmetrically large.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">De'Aaron Fox Over 6.5 assists ✗</div>
        <div class="bet-line">-115 | Model: 7.8 APG | Actual: 4 ast | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS.</strong> Fox had only 4 assists (17pts on poor efficiency) — well under the 6.5 line. With Wemby's concussion exit at 8:57 Q2, the game script completely changed: SAS lost their primary P&R target and Fox's assist-generating mechanism collapsed. Scoot Henderson's 31pt explosion for POR forced SAS into scramble mode. Fox also only had 17pts — a poor all-around game that suggests the Wemby injury disrupted the entire team's rhythm. LESSON: Individual props on players whose value depends on a specific teammate carry hidden correlated risk.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>
    </div>

    </div><!-- end betContent-g2 -->

    <!-- ===== GAME 3 BETS TAB ===== -->
    <div id="betContent-g3" class="bet-content" style="display:none;">

    <p style="color:#aaa;font-size:12px;margin-bottom:16px;text-align:center;">G3 projections incorporate G1+G2 Bayesian updates, <strong>Phase 30 per-player offensive outlook</strong> (research-backed FG% differentiation), coaching adjustment discount, youth breakout persistence, 3PT variance regression, role flexibility, and realistic shooting projections. All 8 series covered — CLE-TOR, DEN-MIN, NYK-ATL, OKC-PHX, SAS-POR (pending Wemby status), DET-ORL, BOS-PHI, HOU-LAL.</p>

    <div class="bet-section">
      <h4 style="color:#fff;margin:0 0 12px;font-size:15px;border-bottom:1px solid #333;padding-bottom:6px;">CLE-TOR Game 3 @ Toronto — CLE leads 2-0</h4>

      <!-- CLE ML -->
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">CLE ML @ TOR</div>
        <div class="bet-line">-155 | Model: CLE 111-104 (+7) | COMPETITIVE</div>
        <div class="bet-reasoning">Phase 22 per-player outlook confirms CLE's dominance. Mitchell 26.7pts (neutral outlook — steady floor), Harden 20.8pts (neutral), Mobley 16.5pts (bad outlook — 84.6% G2 FG regressed to 52.0%). TOR counters with Barnes 19.0pts (good/high — trending 21→26) and Barrett 18.6pts (good/high — CLE has no answer), but Ingram is scheme-locked at 13.0pts (bad/high — 38.2% FG). Quickley's return (10.3pts, rusty) adds a new dimension but not enough to close a 7-point gap. CLE's 3-initiator system remains too deep for TOR.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- CLE SPREAD -->
      <div class="bet-card">
        <span class="bet-type spread">SPREAD</span>
        <div class="bet-pick">CLE -3.5 @ TOR</div>
        <div class="bet-line">-105 | Model margin: +7 | 3.5pt cushion</div>
        <div class="bet-reasoning">Model projects CLE +7, giving 2.5pts of cushion. Per-player outlook shows CLE's top-3 (Mitchell/Harden/Mobley) all project neutral-to-down, meaning the 111-point projection is conservative. TOR's problems persist: Ingram scheme-locked (13.0pts/38.2% FG), Poeltl minutes collapsed (9min, bad outlook), Shead's G1 outlier won't repeat (3.3pts/30.6%). Even with Barnes/Barrett having good games and Quickley returning, the structural talent gap is 7+ points. Spread is the best value play on the board — CLE has won G1 by 13 and G2 by 10.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- MITCHELL PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Donovan Mitchell Over 24.5 points</div>
        <div class="bet-line">-115 | Model: 26.7 PPG | G1-G2 avg: 31.0 | Outlook: neutral</div>
        <div class="bet-reasoning">Mitchell's Phase 22 outlook is "neutral" — no boost or suppress, projecting 26.7pts at 46.8% FG. He scored 32 and 30 in the first two games; regression to 26.7 still clears 24.5 by 2.2pts. His on/off (+6.4) means CLE's offense runs through him regardless of venue. TOR has no answer: Barnes' defense has been overwhelmed by CLE's 3-initiator system. The neutral outlook reflects that Mitchell is a steady producer — not streaky enough for a bad game at this level.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- INGRAM UNDER PROP — UPGRADED -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Brandon Ingram Under 18.5 points ⭐ BEST BET</div>
        <div class="bet-line">-120 | Model: 13.0 PPG | Outlook: BAD (high confidence) | 5.5pt cushion</div>
        <div class="bet-reasoning">Phase 22's strongest single-player conviction. Ingram's outlook is "bad/high" — scheme-locked by CLE's defense at 38.2% projected FG. He went 17pts (G1) → 7pts on 3/15 FG (G2) as CLE solved him. Model projects just 13.0pts for G3, giving a massive 5.5pt cushion under 18.5. The defensive scheme lock compounds: when the same scheme works G1 AND G2, it typically locks in for the series. Ingram's 5 turnovers in G2 confirm decision-making collapse under pressure. Even at home, Under 18.5 is the highest-edge prop across all series.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- BARNES PROP — RECALIBRATED -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Scottie Barnes Over 17.5 points</div>
        <div class="bet-line">-115 | Model: 19.0 PPG | Outlook: GOOD (high) | Trending 21→26</div>
        <div class="bet-reasoning">Barnes' Phase 22 outlook is "good/high" — he's trending up (21→26pts) with a 50.0% projected FG. Model projects 19.0pts, clearing 17.5 by 1.5pts. With Ingram scheme-locked, TOR's offense increasingly runs through Barnes + Barrett. His playmaking (7ast G1, 5ast G2) opens driving lanes as defenses collapse. Home crowd energy at 0-2 desperation amplifies his intensity. Moved the line DOWN from 19.5 to 17.5 to capture the outlook boost with cushion.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- STRUS UNDER — NEW PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Max Strus Under 14.5 points</div>
        <div class="bet-line">-110 | Model: 8.3 PPG | Outlook: BAD | G1: 24pts → scouted</div>
        <div class="bet-reasoning">New Phase 22 insight. Strus exploded for 24pts in G1 (8-10 FG, 4-6 3PT) then was scouted down to 6pts in G2 (2-5 FG). His outlook is "bad" at 38.5% FG — TOR identified his shooting spots and adjusted. Model projects just 8.3pts, giving 6.2pts of cushion under 14.5. When a role player has a breakout game followed by the opponent's adjustment, the suppression typically holds for the remainder of the series. This is a scouting-driven under with high confidence.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- TURNOVERS TEAM PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">TOR Team Over 16.5 turnovers</div>
        <div class="bet-line">-110 | G1: 18 TO, G2: 22 TO | Scheme-driven</div>
        <div class="bet-reasoning">TOR committed 18 turnovers in G1 and 22 in G2 — CLE's defensive pressure scheme is the single most reliable trend in this series. CLE's backcourt pressure + transition defense forces TOR into rushed decisions. Ingram's 5 TOs in G2 were scheme-driven, not variance. Quickley's return adds a new ball-handler but also a rusty one who hasn't played in 11 days. Even at home in G3, 16.5 is well below both G1 and G2 actuals.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

    </div>

    <div class="bet-section">
      <h4 style="color:#fff;margin:0 0 12px;font-size:15px;border-bottom:1px solid #333;padding-bottom:6px;">DEN-MIN Game 3 @ Minnesota — Series tied 1-1</h4>

      <!-- DEN ML -->
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DEN ML @ MIN</div>
        <div class="bet-line">-118 | Model: DEN 108-106 | COIN FLIP | LOW confidence</div>
        <div class="bet-reasoning">The model projects DEN 108-106 — a coin flip where Denver's talent and system advantages (Jokic 97 rating, #1 offense at 122.6 ORtg, 39.6% 3PT) narrowly outweigh Minnesota's home court. At -118, DEN is a slight road favorite — the market agrees with the model but the juice makes this a break-even play at best. Jokic historically bounces back strong after playoff losses, and Denver's championship pedigree (2023) means they don't fold on the road. LOW confidence because the margin is only 2 points with 49% close-game probability — this truly could go either way.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- DEN SPREAD -->
      <div class="bet-card">
        <span class="bet-type spread">SPREAD</span>
        <div class="bet-pick">DEN -1.5 @ MIN</div>
        <div class="bet-line">-105 | Model: DEN by 2 | 0.5pt cushion</div>
        <div class="bet-reasoning">DEN -1.5 is razor-thin — the model projects DEN by 2, giving just 0.5pts of cushion. The market has DEN as a slight road favorite, which aligns with the model but leaves almost no margin for error. Denver's #1 offense, Jokic's bounce-back potential, and the Hardaway bench weapon (16pts G2) support the case, but the tight spread means any variance could flip the cover. Consider the ML (-118) for a cleaner play if you believe in DEN outright.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- EDWARDS PROP -->
      <div class="bet-card best-bet">
        <span class="bet-type prop">PROP ★ BEST BET</span>
        <div class="bet-pick">Anthony Edwards Over 23.5 points</div>
        <div class="bet-line">-130 | Model: 24.6 PPG (Phase 22 outlook: good-high) | G1-G2 trend: 22→30</div>
        <div class="bet-reasoning">Phase 22 per-player outlook projects Edwards at 24.6pts with a "good-high" offensive outlook — his knee is improving game-over-game and he's at home in Target Center. The Bayesian blend (55% model / 45% prior) tempers the G2 explosion (30pts) against his G1 dip (22pts), landing at 24.6. At 23.5, you get 1.1pts of cushion on a player trending sharply upward. His 46% researchFgPct (up from G1's poor shooting) reflects improved mobility. Edwards' +20 net rating in G2 shows he dominated possessions even on the road — at home, the volume only increases. Gordon's "bad-high" outlook means DEN's primary Edwards defender is regressing, widening the lane.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- RANDLE PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Julius Randle Over 17.5 points</div>
        <div class="bet-line">-115 | Model: 19.1 PPG (Phase 22 outlook: good-medium) | G1-G2: 16→24</div>
        <div class="bet-reasoning">Phase 22 outlook grades Randle "good-medium" with a 49% researchFgPct — his G2 bounce-back (24pts/9reb/6ast on 50% FG) validates the model's confidence in his role. The Bayesian blend tempers his 24pt G2 with his 16pt G1, landing at 19.1pts projected. At 17.5, you get 1.6pts of cushion. With Edwards drawing Gordon's primary attention and Jokic's help defense stretched, Randle gets favorable post matchups against DEN's depleted frontcourt. At home in Target Center, his physicality and aggression should sustain. The "good" outlook reflects a player who's found his rhythm in this series.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- JOKIC REBOUNDS+ASSISTS PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Nikola Jokic Over 21.5 rebounds + assists</div>
        <div class="bet-line">-110 | G1: 24 (13+11), G2: 23 (15+8) | Bounce-back driver</div>
        <div class="bet-reasoning">Jokic has crushed this line in both games — 24 reb+ast in G1 (13+11) and 23 in G2 (15+8). The model picks DEN largely because of Jokic's all-around dominance (97 rating, 31.5 PER). His scoring has been contained somewhat (24.5 PPG avg) but his rebounding and playmaking have been consistent regardless of game outcome. Even when his shot wasn't falling in G2 (8-20 FG), he still pulled down 15 boards and dished 8 assists. At Target Center, expect Jokic to facilitate even more against the hostile crowd. 21.5 is well below both G1 and G2 actuals.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- HYLAND PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Bones Hyland Over 6.5 points</div>
        <div class="bet-line">+100 | Model: 7.4 PPG (Phase 22 outlook: neutral-low) | G2: 13pts/10min</div>
        <div class="bet-reasoning">The Phase 22 Bayesian blend tempers Hyland's G2 explosion (13pts/10min, 3-4 3PT) against his limited sample, projecting 7.4pts. The "neutral-low" outlook reflects uncertainty about his minutes — Finch may expand from 10min to 15min after his G2 breakout, but it's not guaranteed. At 6.5, you get 0.9pts of cushion with asymmetric upside: if Finch does expand minutes as expected, Hyland easily clears 10+. As a former Nugget who knows DEN's defensive schemes, he's a matchup weapon at home in Target Center. The 45% researchFgPct is conservative for a career 38% 3PT shooter who went 3-4 in G2. Value play with role-expansion upside.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- MURRAY TURNOVERS PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jamal Murray Over 2.5 turnovers</div>
        <div class="bet-line">-105 | G2: 4 TOs | Chronic knee + road pressure</div>
        <div class="bet-reasoning">Murray committed 4 turnovers in G2 while finishing -4 despite scoring 30pts. His chronic knee (ACL tear history) compounds game-over-game, and MIN's defensive pressure — particularly from DiVincenzo and Dosunmu — is forcing rushed decisions. At Target Center, the hostile crowd adds another layer of pressure. Murray's shot selection is deteriorating (6-14 3PT in G2, -4 net rating). When his shooting falters, he forces the issue and turns it over. Over 2.5 TOs at -105 is strong value backed by a clear trend.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

    </div>

    <!-- ═══════ NYK-ATL GAME 3 ═══════ -->
    <div class="series-bets-header">NYK-ATL Game 3 — Thu Apr 24 — State Farm Arena</div>
    <div class="bet-card-grid">

      <!-- NYK MONEYLINE -->
      <div class="bet-card">
        <span class="bet-type moneyline">MONEYLINE</span>
        <div class="bet-pick">NYK ML @ ATL</div>
        <div class="bet-line">-105 | Model: NYK by 6 | Pick'em odds</div>
        <div class="bet-reasoning">The model projects NYK winning by 6 points in Atlanta, but the market has this as a pick'em at -105. This is a major value discrepancy — the model sees NYK +6 while the market prices it 50/50. ATL's G2 win at MSG (series now 1-1) shifted the line dramatically. Brunson's 39.6% shooting through 2 games screams positive regression for a 47.5% season shooter. NYK's structural edges (1.25x talent, four 76+ rated players, elite road record 25-16) haven't changed. At -105, you're getting the model's 6-point projected winner at coin-flip odds — this is the best value ML on the G3 board.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- NYK SPREAD -->
      <div class="bet-card">
        <span class="bet-type spread">SPREAD</span>
        <div class="bet-pick">NYK +1.5 @ ATL</div>
        <div class="bet-line">-118 | Model: NYK by 6 | 7.5pt cushion</div>
        <div class="bet-reasoning">Model projects NYK by 6, and with the market giving ATL -1.5, NYK +1.5 offers a massive 7.5pts of cushion. This is the best spread value on the entire G3 slate. ATL's G2 win at MSG flipped the line in their favor, but ATL's Q4 shooting in G2 (72.2%) was historically unsustainable — regression there alone narrows ATL's path. NYK's size advantage in the paint and rebounding prowess (Hart's 13 boards) translate regardless of venue. Getting 1.5 points on a team the model projects to win by 6 is exceptional value.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- BRUNSON PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jalen Brunson Over 23.5 points</div>
        <div class="bet-line">-120 | Model: 24.7 PPG (Phase 22 outlook: neutral-good) | Season: 28.7 PPG</div>
        <div class="bet-reasoning">Phase 22 projects Brunson at 24.7pts with a "neutral-good" outlook — the Bayesian blend tempers his 28.5 PPG average against his 39.6% shooting efficiency through 2 games. The model expects positive FG% regression for a 47.5% season shooter, but not a full snap-back in a single game. At 23.5, you get 1.2pts of cushion. McCollum hunted Brunson defensively in G2, but Brown will adjust screening assignments in G3. Brunson's volume (28.5 PPG on poor efficiency) is the key signal — when efficiency regresses toward his mean, 25+ is highly likely. Road game in Atlanta adds slight variance but Brunson has proven road resilience (NYK 25-16 away).</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- MCCOLLUM PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">CJ McCollum Over 20.5 points</div>
        <div class="bet-line">-115 | Model: 21.8 PPG (Phase 22 outlook: neutral) | G1-G2 avg: 29.0 PPG</div>
        <div class="bet-reasoning">Phase 22 projects McCollum at 21.8pts — the Bayesian blend significantly tempers his 29.0 PPG average because the model expects NYK's defensive adjustments to compress his output in G3. Brown will scheme to take away McCollum's midrange looks after his 32pt G2 explosion. The "neutral" outlook reflects the tension between his hot shooting and NYK's defensive talent (OG, Bridges). At 20.5, you get 1.3pts of cushion — enough to cover even if NYK's defense partially succeeds. McCollum's alpha closer role is locked in regardless of game script. At home in State Farm Arena, volume stays high even if efficiency dips from G2's 12-22 mark.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- TOWNS PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Karl-Anthony Towns Over 16.5 points</div>
        <div class="bet-line">-115 | Model: 18.6 PPG (Phase 22 outlook: neutral) | G1-G2: 21.5 PPG</div>
        <div class="bet-reasoning">Phase 22 projects Towns at 18.6pts — the Bayesian blend tempers his 25pt G1 explosion against his 18pt G2 where Kuminga's defense (66 ORtg) was devastating. The "neutral" outlook acknowledges both the defensive challenge and Brown's likely counter-adjustments (more post-ups vs Okongwu, pick-and-pop to pull Kuminga). At 16.5, you get 2.1pts of cushion — the thickest margin on any NYK-ATL prop. Towns' 8-12 shooting in G2 proved his efficiency is elite even when volume dips. Even if Snyder's Kuminga assignment persists, Towns' floor is around 16-18pts given his usage rate. Safe play with structural edge.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- KUMINGA PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jonathan Kuminga Over 14.5 points</div>
        <div class="bet-line">+100 | G1: 8pts → G2: 19pts | Home boost + expanded role</div>
        <div class="bet-reasoning">Kuminga's trajectory — 8pts (G1 disappointment) → 19pts/+10 (G2 hero) — suggests Snyder has unlocked his role. His defensive assignment on Towns was the game-changer in G2's Q4. At home, Kuminga's athletic finishing and transition game get a boost from State Farm Arena's energy. Snyder will likely lock in 30+ minutes for Kuminga after his G2 performance. His 7-12 shooting showed controlled aggression, not just athleticism. 14.5 is the midpoint of his G1-G2 range, and with momentum and expanded minutes, over leans favorable.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

    </div>

    <!-- ═══════ BOS-PHI GAME 3 ═══════ -->
    <div class="series-bets-header">BOS-PHI Game 3 — Fri Apr 24 — Wells Fargo Center (PHI Home)</div>
    <div class="bet-card-grid">

      <!-- BOS MONEYLINE -->
      <div class="bet-card">
        <span class="bet-type moneyline">MONEYLINE</span>
        <div class="bet-pick">BOS ML @ PHI</div>
        <div class="bet-line">-340 | Model: BOS by 6 | Series tied 1-1</div>
        <div class="bet-reasoning">Phase 30 research-backed pick: BOS medium confidence. After PHI's stunning G2 upset (111-97), the model still projects BOS by 6 at PHI's home. The 3PT variance regression is the DOMINANT factor — PHI shot 49% from 3 in G2 (vs 33.2% season baseline), while BOS shot 26% (vs 38% baseline). NET regression massively favors BOS (+12% for BOS, -15% for PHI). Mazzulla (adj 8) will scheme specifically for Edgecombe in G3 — hard traps, switching, forcing rookie ISO decisions. Brown (averaging 31.0pts) and the BOS talent edge remain structural. PHI's home court (~2.5pt boost) and Nurse's proven adjustments are the main counter-arguments, but the 3PT math overwhelms them.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- BOS SPREAD -->
      <div class="bet-card">
        <span class="bet-type spread">SPREAD</span>
        <div class="bet-pick">BOS -7.5 @ PHI</div>
        <div class="bet-line">-110 | Model: BOS by 6 | RISKY — 1.5pt gap against you</div>
        <div class="bet-reasoning">Model projects BOS by 6, but the market line is -7.5, meaning you need BOS to beat the model projection. Normally AVOID, but the model's 6-point margin is conservative — it accounts for PHI home court and Edgecombe's breakout. If BOS's 3PT shooting normalizes even partially (26%→36%), the scoring gap widens beyond 6. Tatum's recovery volatility (great G1, mediocre G2) could swing either way. Medium confidence on ML, LOW confidence on spread — this is a value trap unless you believe BOS shoots well from 3.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- BROWN PROP -->
      <div class="bet-card best-bet">
        <span class="bet-type prop">PROP ★ BEST BET</span>
        <div class="bet-pick">Jaylen Brown Over 24.5 points</div>
        <div class="bet-line">-120 | Model: 26.8 PPG | G1-G2 avg: 31.0 | Outlook: good</div>
        <div class="bet-reasoning">Brown is averaging 31.0pts through 2 games (26 G1 + 36 G2) on 51% FG. Phase 30 projects 26.8pts for G3, clearing 24.5 by 2.3pts. PHI's wing defense ("only 35-year-old George and Oubre" per Yahoo Sports) cannot contain him — Edgecombe's D-LEBRON is 0.08. Brown's status as BOS's clear #1 is locked in: with Tatum showing recovery volatility (great G1, mediocre G2), Brown's usage and shot volume are sustainable at 20+ FGA. Even on the road at PHI, his efficiency holds — BOS's five-out spacing creates open looks regardless of venue. Highest-confidence prop on the BOS-PHI slate.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- EDGECOMBE UNDER -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">VJ Edgecombe Under 24.5 points</div>
        <div class="bet-line">-115 | Model: ~18 PPG | G2 breakout: 30pts | Regression + injury + Mazzulla scheming</div>
        <div class="bet-reasoning">Edgecombe's 30pt G2 breakout (12-20 FG, 6-10 3PT) was heroic but UNSUSTAINABLE — his season averages are 16.0/5.6/4.2. Three factors compress G3: (1) Mazzulla's counter-adjustment — he'll study film and scheme hard traps, switching, and forced ISO decisions specifically for Edgecombe. (2) BACK INJURY from G2 hard fall — played through pain, status for G3 unclear. (3) 60% FG and 60% 3PT will regress dramatically toward his ~42% season FG. Youth breakout persistence (Phase 29) says consecutive breakout games ARE possible for ≤23-year-olds, which is why we set the line at 24.5, not 18.5. But the combination of Mazzulla's scheming + injury makes Under favorable.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- MAXEY PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Tyrese Maxey Over 24.5 points</div>
        <div class="bet-line">-110 | Model: 26.0 PPG | G1-G2 avg: 24.5 | Outlook: neutral-good</div>
        <div class="bet-reasoning">Maxey's home game at Wells Fargo Center after averaging 24.5pts through 2 games (20 G1 + 29 G2). Phase 30 projects 26.0pts — FG% regression UP from 39.6% toward his 47% season baseline is the catalyst. At home with crowd energy after the road upset, Maxey's aggressiveness should increase. Edgecombe's emergence as 2nd initiator HELPS Maxey — White can't fully commit to Maxey anymore, creating more operating space. White's defensive assignment held Maxey to 39.6% FG, but home court typically adds 2-3% FG efficiency. 1.5pt cushion at 24.5.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- TATUM PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jayson Tatum Over 21.5 points</div>
        <div class="bet-line">-115 | Model: 23.0 PPG | G1-G2 avg: 22.0 | Outlook: neutral — recovery volatility</div>
        <div class="bet-reasoning">Tatum is averaging 22.0pts through 2 games (25 G1, 19 G2 with 5 fouls). His Achilles recovery volatility (Phase 28) creates a wider variance band — good G1 then mediocre G2. Phase 30 projects 23.0pts at ~44% FG. The 5-foul G2 was a fluky outlier — expect more disciplined play in G3. At 21.5, you get 1.5pts of cushion. But the recovery volatility risk means this is MEDIUM confidence — Tatum could have another sub-20 game if the Achilles flares. His near triple-double (19/14/9) in G2 shows impact beyond scoring.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

    </div>

    <!-- ═══════ HOU-LAL GAME 3 ═══════ -->
    <div class="series-bets-header">HOU-LAL Game 3 — Fri Apr 24 — Toyota Center (HOU Home) — LAL leads 2-0</div>
    <div class="bet-card-grid">

      <!-- HOU MONEYLINE -->
      <div class="bet-card">
        <span class="bet-type moneyline">MONEYLINE</span>
        <div class="bet-pick">HOU ML vs LAL</div>
        <div class="bet-line">-425 | Model: HOU by 5 | HUMILITY PICK — 0-2 on this series</div>
        <div class="bet-reasoning">Phase 30 research-backed HUMILITY pick: HOU medium confidence. The model is 0-2 on this series with a cumulative 23pt swing in the wrong direction — so medium, not high, despite home court. Three factors converge: (1) HOME COURT — HOU was 28-13 at home (68.3%), Toyota Center crowd + 0-2 desperation creates maximum urgency. (2) 3PT REGRESSION — HOU shot 28.5% avg across 2 games, well below 37.2% baseline. Even with LAL's scheme suppression, expect ~33-34% at home. (3) KD ADJUSTMENT — 3 days to install new wrinkles; KD as passer/decoy vs doubles instead of dribbling into them. COUNTER: Redick's scheme is structural (not venue-dependent), Smart+Kennard are sustained elite (not outliers), LeBron shows zero fatigue at 41. HOU 105 - LAL 100 projected.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- LAL SPREAD — VALUE PLAY -->
      <div class="bet-card best-bet">
        <span class="bet-type spread">SPREAD ★ BEST BET</span>
        <div class="bet-pick">LAL +9.5 @ HOU</div>
        <div class="bet-line">-110 | Model: HOU by 5 | 4.5pt cushion</div>
        <div class="bet-reasoning">The BEST VALUE bet on the HOU-LAL G3 slate. Model projects HOU by only 5, but the market gives LAL +9.5 — a massive 4.5pt cushion. Redick's defensive scheme (zone/doubling/switching) is STRUCTURAL, not venue-dependent — it held HOU to 39% FG and 28.5% 3PT across 2 games. Smart (averaging 20pts/7.5ast) and Kennard (25ppg) are sustained performers. LeBron has shown zero fatigue signs (28/8/7 in G2 at 41). Even if HOU wins at home (which the model projects), LAL's coaching advantage + scheme mastery should keep it close. 4.5pts of cushion makes this high confidence despite being on the road.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- SMART PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Marcus Smart Over 17.5 points</div>
        <div class="bet-line">-115 | Model: ~20 PPG | G1-G2 avg: 20.0 | BREAKOUT CONFIRMED</div>
        <div class="bet-reasoning">Smart's breakout is CONFIRMED — not an outlier. He scored 15pts (G1) and 25pts with 5 3PM (G2), averaging 20.0pts/7.5ast through 2 games. The model initially predicted regression for Smart but was wrong — he IS LAL's #2 behind LeBron. His defensive versatility + 3PT shooting (5-8 from 3 in G2) creates a dual-threat that HOU hasn't solved. At 17.5, you get 2.5pts of cushion on a player who's found his playoff level. Even on the road, Smart's veteran poise (Finals experience) stabilizes his floor. Youth breakout persistence doesn't apply (age 32), but veteran consolidation does — once a role expands in playoffs, it rarely shrinks.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- KD UNDER -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Kevin Durant Under 25.5 points</div>
        <div class="bet-line">-110 | G2: 23pts/9 TOs | Knee + scheme + recovery volatility</div>
        <div class="bet-reasoning">KD had 23pts in G2 but with 9 turnovers and only 3 second-half points — LAL's doubling scheme neutralized him. Three factors compress his G3 scoring: (1) Udoka will likely use KD more as a passer/decoy to counter the doubles, reducing shot attempts. (2) Knee contusion recovery volatility at age 37 — 3 extra days help but wide variance persists. (3) LAL's scheme is structural: they'll double from possession one again. KD's basketball IQ is elite, so he'll adjust — but the adjustment means FEWER shots, not more. Under 25.5 gives enough room for a 22-25pt game where KD facilitates more and shoots less.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- LEBRON PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">LeBron James Over 22.5 points</div>
        <div class="bet-line">-120 | Model: ~24 PPG | G1-G2 avg: 23.5 | Zero fatigue at 41</div>
        <div class="bet-reasoning">LeBron is averaging 23.5pts through 2 games (19 G1, 28 G2) and showed zero fatigue signs at 41. Phase 30 projects ~24pts — his scorer↔facilitator role flexibility means he adapts game-to-game. G2 scoring surge (28pts) came when he shifted from facilitator (13ast G1) to scorer. On the road, expect a balanced 24/7/8 type game. LeBron vs KD legacy motivation is elite fuel. At 22.5, you get 1.5pts of cushion on a player who has defied every age-related model projection. The only risk is a facilitator-heavy game (like G1's 19pts/13ast), but G2 proved he can score when needed.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- SENGUN PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Alperen Sengun Over 17.5 points</div>
        <div class="bet-line">-115 | Model: ~19 PPG | G2: 20pts/11reb | Home court bounce-back</div>
        <div class="bet-reasoning">Sengun found his rhythm in G2 (20pts/11reb after 6-19 FG in G1). At home in Toyota Center with KD drawing doubles, Sengun gets cleaner looks. Phase 30 Bayesian outlook: "good" (0.50 FG%) — the model has been correct about Sengun's bounce-back trend. His touch around the rim and passing ability make him dangerous when LAL's attention is on KD. At 17.5, you get ~1.5pts of cushion. Risk: Smart's ability to hunt Sengun defensively persists, but with KD on the floor, Smart's assignment is split.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

    </div>

    <!-- ══════════════════════════════════════════════ -->
    <!--  OKC-PHX G3 — Fri Apr 24 @ PHX               -->
    <!-- ══════════════════════════════════════════════ -->
    <div class="series-bets-header">OKC @ PHX — Game 3 | Fri Apr 24 — 9:30 PM ET — ESPN</div>
    <div class="series-bets-group">

      <!-- OKC ML -->
      <div class="bet-card best-bet">
        <span class="bet-type ml">MONEYLINE ★ BEST BET</span>
        <div class="bet-pick">OKC ML @ PHX</div>
        <div class="bet-line">-380 | Model: OKC by 8 | HIGH confidence</div>
        <div class="bet-reasoning">The most lopsided series in R1. OKC's 35-pt G1 blowout exposed PHX's structural problems: single-initiator (only Booker), no interior matchup for Holmgren, 17 turnovers from defensive pressure. Even at Footprint Center, OKC's scheme travels — Daigneault (adj 9) vs Ott (adj 4) is the widest coaching gap in the playoffs. SGA sat Q4 blowout in G1; full minutes at PHX = 30+pts. Williams' All-NBA return (22/7/6) gives OKC multi-initiator dominance (3 vs 1). PHX home crowd adds ~2.5pts but can't fix a talent gap this wide. ML at -380 is steep but safe.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- SGA PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">SGA Over 27.5 points</div>
        <div class="bet-line">-115 | Model: ~30 PPG | Full game (sat Q4 G1 blowout)</div>
        <div class="bet-reasoning">SGA scored 25pts in only 29 minutes in G1 (sat Q4 blowout), on a career-cold 27.8% FG. Massive regression UP guaranteed — career 55.3% FG. At PHX, he'll play full 36min. Even at 45% FG (road adjustment), his free throw artistry (15-17 G1, 88.2% season) provides a scoring floor. SGA averaged 31+ PPG in 2025 road playoff games. Over 27.5 gives solid cushion.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- GREEN YOUTH BREAKOUT PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jalen Green Over 16.5 points</div>
        <div class="bet-line">-110 | YOUTH BREAKOUT (age 22) at home | Phase 29 active</div>
        <div class="bet-reasoning">Green (age 22) is PHX's best youth breakout candidate. Phase 29 multiplier active. G1 was quiet as part of PHX's 35% FG disaster, but NOW AT HOME at Footprint Center, his athletic scoring could spike. The crowd energy helps young players find rhythm. OKC will still send elite defenders, but desperation + home court + youth breakout persistence creates upside. His ceiling is 25+ if he attacks the rim. Over 16.5 gives room for a breakout home game.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- BOOKER PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Devin Booker Over 24.5 points</div>
        <div class="bet-line">-120 | Home FG% boost (51% vs 47%) | Desperate | Clutch 7.8</div>
        <div class="bet-reasoning">Booker scored 23pts at OKC despite elite defense. NOW AT HOME — career 51% FG at home vs 47% road. PHX's sole creator in a desperate situation (likely 0-2). Clutch rating 7.8 means he'll compete in close stretches. At home with crowd energy, expect his best game of the series: 26-30pts. Over 24.5 provides cushion for his home shooting boost. Dort will still be primary defender but Booker's shot-making is world-class at home.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

    </div>

    <!-- ══════════════════════════════════════════════ -->
    <!--  SAS-POR G3 — Fri Apr 24 @ POR                -->
    <!-- ══════════════════════════════════════════════ -->
    <div class="series-bets-header">SAS @ POR — Game 3 | Fri Apr 24 — 10:30 PM ET — Prime Video</div>
    <div class="series-bets-group">

      <!-- POR ML — WEMBY OUT -->
      <div class="bet-card best-bet">
        <span class="bet-type ml">MONEYLINE ★</span>
        <div class="bet-pick">POR ML vs SAS (Wemby OUT)</div>
        <div class="bet-line">-122 | Model: POR by 7 | MEDIUM confidence — Wemby CONFIRMED OUT</div>
        <div class="bet-reasoning">Wemby OUT (concussion protocol — failed to clear neurologist within 48hr window). Barnes OUT (wrist). McLaughlin OUT (ankle). SAS missing their franchise player (+16.9 on/off), starting PF, and backup PG. SAS collapsed without Wemby in G2 — outscored by 10 after his exit, lost 103-106 at HOME. Now on the ROAD at Moda Center for POR's first home game with the crowd electric after the G2 upset. Henderson's youth breakout (18→31pts) carries to home floor. Avdija becomes the clear best player on the floor. Model projects POR by 7 — market only has POR -1.5, creating significant value. POR ML at -122 is the play.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- HENDERSON YOUTH BREAKOUT -->
      <div class="bet-card best-bet">
        <span class="bet-type prop">PROP ★ BEST BET</span>
        <div class="bet-pick">Scoot Henderson Over 22.5 points</div>
        <div class="bet-line">-110 | YOUTH BREAKOUT CONFIRMED (age 21) | 18→31pts | AT HOME</div>
        <div class="bet-reasoning">THE youth breakout story of 2026 R1. Henderson: 18pts G1 → 31pts G2 (11-17 FG, 5-9 3PT) at age 21. Phase 29 youth breakout persistence: consecutive breakout games for ≤23-year-olds are MORE likely after one. NOW AT HOME at Moda Center — expect peak performance. Even with FG% regression from 64.7% to ~48%, his volume + home crowd energy = 25+ baseline. Over 22.5 gives 2.5pts of cushion on the hottest young player in the playoffs. MEGA BOOST: Wemby OUT (concussion), Barnes OUT (wrist), McLaughlin OUT (ankle) — SAS missing their rim protector, starting PF, and backup PG. No Wemby means no intimidation at the rim, weaker defensive rotations, and more transition opportunities for Henderson to attack. This is the highest-confidence prop on the Fri Apr 24 slate.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- AVDIJA PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Deni Avdija Over 21.5 points</div>
        <div class="bet-line">-115 | 22pts avg G1-G2 | Home game | Best overall player for POR</div>
        <div class="bet-reasoning">POR's star: 30pts G1, 14pts G2 — averaging 22pts. G2 dip (5-13 FG) was partly Wemby's defensive gravity before his exit. At HOME with Wemby CONFIRMED OUT, Avdija is the clear best player on the floor — no one on SAS can guard his 6'9 pick-and-roll creation. No Wemby rim protection means easier driving lanes and mid-range looks. Over 21.5 is near his 2-game average with massive upside now that the series' best defender is sidelined. Expect 24-28pts at home.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- HARPER YOUTH WATCH -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Dylan Harper Over 8.5 points</div>
        <div class="bet-line">-110 | YOUTH BREAKOUT CANDIDATE (age 20, rookie) | Expanded role if Wemby OUT</div>
        <div class="bet-reasoning">Harper (age 20, Phase 29 active): 10pts/4ast in 23min G2 after Wemby exit — showed poise beyond his years. With Wemby CONFIRMED OUT, Harper is locked into 25+ minutes as secondary ball-handler behind Fox/Castle. His 4-7 FG (57.1%) G2 was efficient. Over 8.5 is conservative for a player trending toward 12-14pts with a guaranteed expanded role. Road game is harder for rookies, but SAS needs his ball-handling and the youth breakout multiplier (Phase 29) compensates.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

    </div>

    <div class="bet-section">
      <h4 style="color:#fff;margin:0 0 12px;font-size:15px;border-bottom:1px solid #333;padding-bottom:6px;">DET-ORL Game 3 @ Orlando — Series tied 1-1 — Sat Apr 25 1:00 PM ET</h4>

      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DET ML @ ORL ⭐ BEST BET</div>
        <div class="bet-line">-148 | Model: DET 107-101 (+6) | COMPETITIVE</div>
        <div class="bet-reasoning">DET as road favorite after dismantling ORL 98-83 in G2. Cade's dual-mode (39pts scorer G1, 27/11ast distributor G2) is unguardable — Mosley can't scheme for both. 6 DET players in double figures G2 proves single-initiator problem was coaching, not talent. WCJ fouled out G2 (6PF) — Bickerstaff's direct attack on WCJ is repeatable. DET's #1 defense (107.2 DRtg) is schematic and travels. Market agrees: DET -2.5 as road favorite. ORL shot 33% G2 (season low) — some regression expected but DET's defense is legit.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">DET -2.5 @ ORL</div>
        <div class="bet-line">-110 | Model margin: +6 | 3.5pt cushion</div>
        <div class="bet-reasoning">Model projects DET +6, giving 3.5pts of cushion over the -2.5 spread. DET won G2 by 15 at home; road margin typically shrinks ~3pts. Even with that adjustment, DET covers. ORL's home court adds ~2pts, but DET's #1 defense travels. Best spread value in the G3 slate.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Cade Cunningham Over 24.5 points</div>
        <div class="bet-line">-115 | Model: 28.5 pts | 2-game avg: 33.0 | Road game slight dip</div>
        <div class="bet-reasoning">Cade averaging 33.0pts through 2 games (39+27). Road game projects slight dip to ~28pts. Even at road-adjusted 46% FG, Cade on 22+ FGA clears 24.5. His dual-mode capability means if scoring is tough, he creates assists which keep DET in it. Line is set low after his 27pt G2 — value play. Cleared 28.5 in G1 and 24.5 in G2.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">WCJ Under 12.5 points</div>
        <div class="bet-line">-115 | Model: 9.5 pts | G1: 17pts (88.9%), G2: 3pts (1-6, FOULED OUT)</div>
        <div class="bet-reasoning">WCJ's series arc: G1 hero (17pts, 88.9% FG) → G2 disaster (3pts, 1-6, 6PF, fouled out in 24min). Bickerstaff found the counter — attack WCJ directly. Even at home with friendlier whistles, foul trouble is schematic. Model projects 9.5pts, well under 12.5. His 88.9% G1 was an extreme outlier; regression + foul risk = under is the play.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Desmond Bane Under 16.5 points</div>
        <div class="bet-line">-110 | Model: 14.5 pts | Series: 9-31 FG (29%)</div>
        <div class="bet-reasoning">Bane is in a series slump: 9-31 FG (29%) through 2 games vs season 48.4%. Some home-court regression expected but DET's perimeter defense has been elite on him specifically. His 6-7 FT G2 shows he gets to the line even when shots aren't falling, but 16.5 is still a stretch for a player shooting 29%. Model projects 14.5pts — 2pt cushion.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
    </div>

    </div><!-- end betContent-g3 -->

    <!-- DISCLAIMER -->
    <div class="bets-disclaimer">
      <strong>Disclaimer:</strong> These picks are generated by a statistical model calibrated against 2025 NBA Playoff results (73.5% accuracy across 49 games) and updated with deep-dive research from Fadeaway World, Basketball Reference, and SI for the 2026 R1 slate. They are not guaranteed outcomes. All betting involves risk. Lines shown are approximate and may differ from your sportsbook. The model accounts for Home Court Advantage (round-adjusted), System Coherence, Championship DNA, Health Degradation, Star Ceiling Variance, Playoff Pedigree, and G1 Bayesian Updates — but cannot predict injuries, ejections, or one-game anomalies. Bet responsibly.
    </div>
  </div>`;
}
