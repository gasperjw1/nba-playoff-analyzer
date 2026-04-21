// ============================================================
// BETS PAGE
// ============================================================

function renderBetsPage(el) {
  el.innerHTML = `
  <div style="max-width:900px;margin:0 auto;padding:20px 10px;">
    <h2 style="text-align:center;color:#fff;margin-bottom:4px;">2026 NBA Playoff Bets — Round 1</h2>
    <p style="text-align:center;color:#aaa;font-size:13px;margin-bottom:8px;">Model-driven picks for all 8 first-round series | G1: 9/13 (69.2%) | G2 CLE-TOR: 1/2 (ML ✓, Harden ast ✗) | G3 projections live | Phase 23: Injury/fatigue-adjusted G2 projections — KD return, Tatum recovery, LeBron fatigue</p>

    <!-- BET TABS -->
    <div style="display:flex;gap:0;margin-bottom:24px;justify-content:center;">
      <div class="bet-tab active" onclick="switchBetTab('parlays')" id="betTab-parlays" style="padding:10px 24px;border-radius:8px 0 0 8px;cursor:pointer;font-size:13px;font-weight:700;background:var(--accent);color:#fff;border:1px solid var(--accent);transition:all 0.2s;">Featured Parlays</div>
      <div class="bet-tab" onclick="switchBetTab('g1')" id="betTab-g1" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Game 1 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g2')" id="betTab-g2" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Game 2 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g3')" id="betTab-g3" style="padding:10px 24px;border-radius:0 8px 8px 0;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;">Game 3 Bets</div>
    </div>

    <!-- ===== PARLAYS TAB ===== -->
    <div id="betContent-parlays" class="bet-content">
    <div class="parlay-featured">

      <!-- ===== HEADLINE: $100 BEST BET ===== -->
      <div class="parlay-card headline">
        <div class="parlay-header">
          <span class="parlay-name" style="font-size:16px;color:#f0c040;">The $100 Play — Today's Highest-Confidence Parlay (3-Leg)</span>
          <span class="parlay-odds" style="background:rgba(240,192,64,0.2);color:#f0c040;font-size:16px;">~+517</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
          <span style="font-size:11px;color:#f0c040;background:rgba(240,192,64,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$100 → $617 return</span>
          <span style="font-size:11px;color:#4caf50;background:rgba(76,175,80,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">ALL LEGS TODAY — Apr 21</span>
        </div>
        <div class="parlay-legs">
          <div class="parlay-leg" style="border-left:3px solid #f0c040;">
            <span class="parlay-leg-num">1</span>
            <span class="parlay-leg-pick">Wemby Over 25.5 pts (SAS-POR)</span>
            <span class="parlay-leg-odds">-125</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #f0c040;">
            <span class="parlay-leg-num">2</span>
            <span class="parlay-leg-pick">Brown Over 24.5 pts (BOS-PHI)</span>
            <span class="parlay-leg-odds">-120</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #f0c040;">
            <span class="parlay-leg-num">3</span>
            <span class="parlay-leg-pick">Fox Over 6.5 ast (SAS-POR)</span>
            <span class="parlay-leg-odds">-115</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
        </div>
        <div class="parlay-reasoning" style="border-left-color:#f0c040;">Phase 23 today-only parlay — all three games on Apr 21. <strong>Wemby Over 25.5</strong> (proj 28.2, 2.7pt cushion) — DPOY just announced, "good" outlook at 52% FG, POR has no answer for his length, home court. Highest cushion on the board. <strong>Brown Over 24.5</strong> (proj 26.8, 2.3pt cushion) — UPGRADED in Phase 23 because Tatum's Achilles minutes management (~30-32min) pushes more usage to Brown. G1: 26pts at 52.4% FG was baseline, not ceiling. Edgecombe mismatch (D-LEBRON 0.08). <strong>Fox Over 6.5 ast</strong> (proj 7.8, 1.3pt cushion) — G1: 8ast at 46.7% FG is sustainable. PnR with Wemby creates binary decisions for POR defense. SEPARATION game = structured half-court sets = consistent assists. Three uncorrelated legs across two games and two stat types.</div>
      </div>

      <div class="parlay-card headline" style="border:1px solid #f44336;">
        <div class="parlay-header">
          <span class="parlay-name" style="font-size:16px;color:#f44336;">The $1 Chaos Ticket — Upset Parlay (3-Leg)</span>
          <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+1003</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
          <span style="font-size:11px;color:#f44336;background:rgba(244,67,54,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$1 → $11.03 return</span>
          <span style="font-size:11px;color:#ff9800;background:rgba(255,152,0,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">CONTRARIAN — Apr 21</span>
        </div>
        <div class="parlay-legs">
          <div class="parlay-leg" style="border-left:3px solid #f44336;">
            <span class="parlay-leg-num">1</span>
            <span class="parlay-leg-pick">LAL ML vs HOU (UPSET)</span>
            <span class="parlay-leg-odds">+175</span>
            <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #f44336;">
            <span class="parlay-leg-num">2</span>
            <span class="parlay-leg-pick">POR +11.5 vs SAS (COVER)</span>
            <span class="parlay-leg-odds">+110</span>
            <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #f44336;">
            <span class="parlay-leg-num">3</span>
            <span class="parlay-leg-pick">Maxey Over 24.5 pts (BOS-PHI)</span>
            <span class="parlay-leg-odds">-110</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
          </div>
        </div>
        <div class="parlay-reasoning" style="border-left-color:#f44336;">The underdogs-fight-back parlay. <strong>LAL ML +175</strong> — the anchor upset. Pre-KD return, model had HOU-LAL as a COIN FLIP (+2). KD is back today but first game in weeks = rust, minutes restriction (~28-30min), and unfamiliar rhythm with teammates. If KD shoots under 40% (common in return games), this reverts to a toss-up — and LeBron at home in the playoffs with a desperate crowd tilts it. <strong>POR +11.5</strong> — model +12 vs line -11.5 is the thinnest cover on the board (0.5pt cushion). Holiday's "neutral-good" bounce-back from 26.7% → 40% FG is the swing factor. Avdija scored 30 in G1 — even if he regresses to 24-25 instead of the modeled 22, POR covers. Road teams in Game 2 often adjust after seeing the playbook. <strong>Maxey Over 24.5</strong> — the safest leg and the parlay's foundation. Model projects 26.0, bounce-back from 40% FG G1. With Embiid out, Maxey IS the offense — he has to cook for PHI to stay competitive. Even in a BOS blowout, Maxey's usage rate guarantees volume.</div>
      </div>

      <!-- ===== GRID: G3 PARLAYS ===== -->
      <div class="parlay-grid">
        <div class="parlay-grid-header">G3 Parlays (Phase 22)</div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">G3 ML Sweep (3-Leg)</span>
            <span class="parlay-odds">~+493</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">CLE ML @ TOR</span><span class="parlay-leg-odds">-155</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">NYK ML @ ATL</span><span class="parlay-leg-odds">-105</span><span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">DEN ML @ MIN</span><span class="parlay-leg-odds">-118</span><span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span></div>
          </div>
          <div class="parlay-reasoning">All three G3 road favorites. CLE -155 (proj +7) anchors. NYK -105 is value — model says +6 at pick'em odds. DEN -118 is riskiest — true coin flip.</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">CLE Sweep Builder (2-Leg)</span>
            <span class="parlay-odds">~+221</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">CLE ML @ TOR</span><span class="parlay-leg-odds">-155</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">CLE -3.5 @ TOR</span><span class="parlay-leg-odds">-105</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
          </div>
          <div class="parlay-reasoning">Model projects CLE +7 road. ML + spread at +221 is the highest-conviction single-series G3 play. CLE won G1 by 13, G2 by 10.</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">CLE-TOR G3 Props (3-Leg)</span>
            <span class="parlay-odds">~+554</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">Mitchell Over 24.5 pts</span><span class="parlay-leg-odds">-115</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">Ingram Under 18.5 ★</span><span class="parlay-leg-odds">-120</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">Barnes Over 17.5 pts</span><span class="parlay-leg-odds">-110</span><span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span></div>
          </div>
          <div class="parlay-reasoning">Mitchell (proj 26.7, 2.2pt cushion), Ingram Under (proj 13.0, 5.5pt cushion ★ anchor), Barnes (proj 19.0, "good" outlook at home).</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">Phase 22 Star Props (3-Leg)</span>
            <span class="parlay-odds">~+519</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">Edwards Over 23.5 ★</span><span class="parlay-leg-odds">-130</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">Jokic Over 21.5 r+a</span><span class="parlay-leg-odds">-110</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">Ingram Under 18.5 ★</span><span class="parlay-leg-odds">-120</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
          </div>
          <div class="parlay-reasoning">Cross-series BEST BETs. Edwards at home (proj 24.6), Jokic crushed 21.5 in both G1/G2, Ingram scheme-locked (proj 13.0).</div>
        </div>

        <!-- ===== G2 ML PARLAYS ===== -->
        <div class="parlay-grid-header">G2 ML Parlays</div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">G2 Chalk Slam (4-Leg)</span>
            <span class="parlay-odds">~-127</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">CLE ML vs TOR ✓</span><span class="parlay-leg-odds">-300</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIT</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">BOS ML vs PHI</span><span class="parlay-leg-odds">-850</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">OKC ML vs PHX</span><span class="parlay-leg-odds">-2100</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">4</span><span class="parlay-leg-pick">SAS ML vs POR</span><span class="parlay-leg-odds">-700</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
          </div>
          <div class="parlay-reasoning">CLE ✓ cashed. Remaining 3 legs are massive chalk — combined payout barely exceeds even money (~-127). High-probability, poor value.</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">Big 3 Lock (3-Leg)</span>
            <span class="parlay-odds">~-167</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">OKC ML vs PHX</span><span class="parlay-leg-odds">-2100</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">SAS ML vs POR</span><span class="parlay-leg-odds">-700</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">CLE ML vs TOR ✓</span><span class="parlay-leg-odds">-300</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIT</span></div>
          </div>
          <div class="parlay-reasoning">CLE ✓ cashed. OKC -2100 and SAS -700 remain — near-locks but ~-167 combined payout makes this a grind play.</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">Favorites + Value (3-Leg)</span>
            <span class="parlay-odds">~+149</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">SAS ML vs POR</span><span class="parlay-leg-odds">-700</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">NYK ML vs ATL ✗</span><span class="parlay-leg-odds">-250</span><span class="parlay-leg-conf" style="background:#5a2d2d;color:#f44336;">MISS</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">DEN ML vs MIN ✓</span><span class="parlay-leg-odds">-180</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIT</span></div>
          </div>
          <div class="parlay-reasoning">NYK ML ✗ — ATL upset at MSG (107-106). Parlay busted on leg 2 despite DEN ✓ cashing. CJ McCollum's 32pts was the model's blind spot.</div>
        </div>

        <!-- ===== G2 PROPS PARLAYS ===== -->
        <div class="parlay-grid-header">G2 Player Props Parlays (Remaining Series Only)</div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">Star Scorers (4-Leg)</span>
            <span class="parlay-odds">~+1035</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">SGA Over 28.5 pts</span><span class="parlay-leg-odds">-130</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">Maxey Over 24.5 pts</span><span class="parlay-leg-odds">-110</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">Brown Over 24.5 pts</span><span class="parlay-leg-odds">-120</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">4</span><span class="parlay-leg-pick">Wemby Over 25.5 pts</span><span class="parlay-leg-odds">-120</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
          </div>
          <div class="parlay-reasoning">Phase 23 update: Brown UPGRADED to 26.8 (Tatum minutes management → more Brown usage). SGA 31.5 (bounce-back), Wemby 28.2 (DPOY momentum), Maxey 26.0 (bounce-back). All four have 1.5+ pt cushion over their lines.</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">Facilitators (3-Leg)</span>
            <span class="parlay-odds">~+581</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">LeBron Over 9.5 ast</span><span class="parlay-leg-odds">-110</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">Cade Over 7.5 ast</span><span class="parlay-leg-odds">-110</span><span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">Fox Over 6.5 ast</span><span class="parlay-leg-odds">-115</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
          </div>
          <div class="parlay-reasoning">Phase 23 update: LeBron ast proj dipped 10.3→9.8 (fatigue + KD return = tighter game). Cade 7.8 ("good"), Fox 7.8 ("neutral-good"). LeBron leg now TIGHT (0.3pt cushion) — parlay weakened by its shakiest leg. Consider swapping LeBron for Harden assists if available.</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">Big Man Boards (3-Leg)</span>
            <span class="parlay-odds">~+604</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">Wemby Over 9.5 reb</span><span class="parlay-leg-odds">-125</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">Tatum Over 10.5 reb</span><span class="parlay-leg-odds">+105</span><span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">Duren Over 8.5 reb</span><span class="parlay-leg-odds">-110</span><span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span></div>
          </div>
          <div class="parlay-reasoning">Phase 23: Tatum reb dipped 11.4→10.8 (Achilles minutes management) but per-minute rate (0.34/min) holds at G1 pace. Wemby 9.8 (DPOY, no fatigue). Duren 9.3 (Wed game). Tatum leg is now tightest — 0.3pt cushion at +105.</div>
        </div>

        <div class="parlay-card">
          <div class="parlay-header">
            <span class="parlay-name">PG Scoring Surge (3-Leg)</span>
            <span class="parlay-odds">~+632</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg"><span class="parlay-leg-num">1</span><span class="parlay-leg-pick">Maxey Over 24.5 pts</span><span class="parlay-leg-odds">-110</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">2</span><span class="parlay-leg-pick">Cade Over 27.5 pts</span><span class="parlay-leg-odds">+105</span><span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span></div>
            <div class="parlay-leg"><span class="parlay-leg-num">3</span><span class="parlay-leg-pick">Fox Over 18.5 pts</span><span class="parlay-leg-odds">-115</span><span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span></div>
          </div>
          <div class="parlay-reasoning">Phase 22 outlook-adjusted: Maxey 26.0 ("neutral-good", 44% FG bounce-back). Cade 30.2 ("good", 46% FG — All-Star sustains it, line bumped to 27.5). Fox 21.0 ("neutral-good", 47% FG steady). All three are primary scorers for their teams.</div>
        </div>

      </div><!-- end parlay-grid -->
    </div>
    </div><!-- end betContent-parlays -->

    <!-- ===== G1 BETS TAB ===== -->
    <div id="betContent-g1" class="bet-content" style="display:none;">
    <h3 style="color:#aaa;margin:0 0 16px;">Game 1 Results — 9/13 Correct (69.2%)</h3>
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
        <div class="bet-reasoning">Thunder blew out Suns with SGA scoring 36. PHX missing key players.</div>
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
      <h4 style="color:#f44336;margin:0 0 8px;font-size:14px;">LOW CONFIDENCE — 1/3 Correct</h4>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">SGA Over 28.5 pts ✓</div>
        <div class="bet-line">-130 | G1 actual: 36 pts</div>
        <div class="bet-reasoning">SGA erupted for 36 — well over the line. Playoff mode activated.</div>
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
    <h3 style="color:#aaa;margin:0 0 4px;">Game 2 Picks — Phase 23 Injury + Fatigue Update</h3>
    <p style="color:#666;font-size:12px;margin-bottom:16px;">Phase 23: Injury/fatigue-adjusted G2 projections. CBS Sports injury report (Apr 21) + ESPN live odds integrated. KEY UPDATES: KD (HOU) likely returns today (line moved -4.5→-5.5), Tatum Achilles recovery management, LeBron fatigue (age 41, 2-day turnaround). LAL still missing Luka (hamstring) + Reaves (oblique). Embiid (PHI) remains OUT.</p>

    <!-- COMPLETED + SATURDAY/SUNDAY G2 GAMES -->
    <div class="bet-section">
      <h4 style="color:#fff;margin:0 0 12px;font-size:15px;border-bottom:1px solid #333;padding-bottom:6px;">Completed G2 Games — Sun Apr 20 (+ HOU-LAL Tonight)</h4>

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
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">NYK ML vs ATL</div>
        <div class="bet-line">-250 | Model: NYK 113-103 (+10) | COMPETITIVE</div>
        <div class="bet-reasoning">G2 margin drops from +16 to +10 via road-team bounce-back and coaching adjustment. ATL's coach Snyder (rated 8/10) will counter Brown's halftime transition D adjustment from G1. Brunson (27.6 proj, down from 28 in G1) and KAT (21.2/10.7r) still anchor NYK, but ATL's Jalen Johnson gets a bounce-back boost (23.1 proj). NAW's 18.8 projection reflects his G1 scoring outburst getting Bayesian uplift. COMPETITIVE character = closer than G1.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">KAT Over 10.5 rebounds</div>
        <div class="bet-line">-120 | Model: 10.7 RPG | G1 Bayesian with ATL's small lineup</div>
        <div class="bet-reasoning">KAT projects 10.7 RPG in G2 (slight regression from 11.5 pre-model as his G1 performance gets Bayesian-weighted). Still clears 10.5 thanks to ATL's perimeter-heavy lineup (McCollum/NAW/Kuminga) providing minimal help on the glass. In a COMPETITIVE game, more contested shots = more rebounds available. KAT's 6'11 frame dominates ATL's smaller frontcourt.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- HOU-LAL (10:30pm ET) — KD LIKELY RETURNS -->
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">HOU ML @ LAL</div>
        <div class="bet-line">-205 | Model: HOU 110-104 (+6) | COMPETITIVE</div>
        <div class="bet-reasoning"><strong>PHASE 23 UPGRADE — KD RETURNS:</strong> CBS injury report lists KD target date as Apr 21 (today). ESPN spread moved HOU -4.5→-5.5, strongly signaling KD plays. Model upgraded from +2 COIN FLIP to +6 COMPETITIVE. KD adds ~20pts and transforms HOU from single-initiator to dual-threat with Sengun. Even on ~28-30min restriction, his midrange gravity opens shots for Sheppard/Smith. LAL missing Luka (hamstring, out May 1) + Reaves (oblique, out May 1) — their backcourt is skeletal. LeBron "good" outlook but FATIGUE FACTOR: age 41, 2-day turnaround from high-usage G1 (13ast = constant decision load). Kennard "bad" (HOU will scheme). Market: HOU -5.5. Model aligns with market now.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">LeBron James Over 9.5 assists</div>
        <div class="bet-line">-110 | Model: 9.8 APG | Outlook: GOOD | G1: 13 ast</div>
        <div class="bet-reasoning">Phase 23 adjustment: LeBron's assist projection dipped from 10.3 to 9.8. G1 facilitator masterclass (13ast) supports playmaking, and Ayton/Hachimura/Kennard remain excellent targets. BUT: fatigue concern (41 years old, 2-day turnaround) + if KD returns, faster pace drains more energy. If LeBron shifts to more scoring mode (likely if Kennard gets schemed out), assist volume could dip. Line is now TIGHT — 0.3pt cushion down from 0.8. Still lean Over but confidence dropped from MEDIUM to LOW.</div>
        <span class="bet-edge historical">Historical</span>
      </div>
    </div>

    <!-- TODAY'S G2 GAMES (Tue Apr 21) -->
    <div class="bet-section">
      <h4 style="color:#fff;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #333;padding-bottom:6px;">Today's G2 Games — Tue Apr 21 (Phase 23 Injury/Fatigue Update)</h4>

      <!-- BOS-PHI (7:00pm ET) — Tatum recovery management -->
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">BOS ML vs PHI</div>
        <div class="bet-line">-850 | Model: BOS 111-100 (+11) | SEPARATION</div>
        <div class="bet-reasoning"><strong>PHASE 23:</strong> Tatum "good" (47% FG, 22-30pts) with Achilles recovery management — NBA.com flags workload monitoring, expect ~30-32min cap. Brown "good" (49% FG, 22-30pts — Edgecombe mismatch). Maxey "neutral-good" (44% FG — bounce-back from 40% G1). PHI structural problems unchanged: Embiid OUT (abdomen, Apr 24 target), Drummond "bad", PHI shot 4-23 3PT in G1. Model margin dipped 12→11 on Tatum minutes cap, but BOS depth (6 players scored 10+ in G1) covers easily. Ron Harper Jr. (ankle) may return for BOS today — minor bench depth boost. Market: BOS -14.5 (-110), wider than model.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">PHI +14.5 vs BOS</div>
        <div class="bet-line">-110 | Model: +11 margin | ESPN line: BOS -14.5</div>
        <div class="bet-reasoning"><strong>PHASE 23 FLIP:</strong> Model projects +11, market is -14.5 — 3.5pt gap FAVORS PHI SPREAD. Tatum minutes management (Achilles recovery) compresses BOS ceiling. Maxey bounce-back (44% FG) + PHI 3PT regression up from historic 4-23 G1. Nurse's adjustments should narrow margin from G1's 32pts. Even if BOS wins comfortably, +14.5 covers in the model. CHANGED from BOS -14.5 to PHI +14.5 — value shifted to the dog covering.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jaylen Brown Over 24.5 points</div>
        <div class="bet-line">-120 | Model: 26.8 pts | Outlook: GOOD (49% FG) | G1: 26pts</div>
        <div class="bet-reasoning"><strong>PHASE 23 UPGRADE:</strong> Brown's projection INCREASED from 26.1 to 26.8. If Tatum is on minutes management (~30-32min), Brown absorbs more touches and usage. G1: 26pts (52.4% FG, 7-9 in Q3) was near-baseline. Edgecombe's D-LEBRON (0.08) is a massive mismatch. Home court. Brown becomes BOS's primary option in Tatum-rest stretches. Clears 24.5 by 2.3pts — highest-confidence prop on the BOS-PHI slate.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Tatum Over 10.5 rebounds</div>
        <div class="bet-line">+105 | Model: 10.8 RPG | Outlook: GOOD | No Embiid = empty paint</div>
        <div class="bet-reasoning">Phase 23 adjustment: Tatum rebound proj dipped from 11.4 to 10.8 on minutes management. If capped at ~30-32min (Achilles recovery), he needs 10.8/32 = 0.34 reb/min — G1 rate was 11/32 = 0.34. So per-minute production sustains even with cap. No Embiid = PHI interior is rebounding wasteland (Drummond "bad"). Plus-odds on a line that clears at his G1 rate. Tighter than before but still has value at +105.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- ═══ WEDNESDAY G2 GAMES (Apr 22) ═══ -->
      <div style="margin:20px 0 12px;padding:8px 0;border-top:2px solid #444;border-bottom:1px solid #333;">
        <span style="color:#f0c040;font-size:14px;font-weight:700;">WEDNESDAY — Apr 22</span>
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
        <div class="bet-pick">SGA Over 28.5 points</div>
        <div class="bet-line">-130 | Model: 31.5 pts | Outlook: GOOD (46% FG) | G1: 25pts in 29min</div>
        <div class="bet-reasoning">Phase 22 "good" outlook driven by FG% bounce-back: G1's 27.8% FG was season-worst but still scored 25 in 29min via elite FT (15-17). Season 47.4% FG → major regression up expected. Will play FULL game in G2 (sat Q4 of blowout in G1). Even at projected 46% FG, his volume + FT artistry project 31+ pts. PHX has no perimeter stopper (Dunn 0-3 in G1). Safest player prop on the board — massive cushion over 28.5.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- DET-ORL -->
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DET ML vs ORL</div>
        <div class="bet-line">-410 | Model: DET 108-103 (+5) | GRIND | ESPN: DET -8.5</div>
        <div class="bet-reasoning">Phase 22 outlook: Cade "good" (46% FG, 28-36pts — All-Star sustains high efficiency), Harris "neutral-good" (42% FG, bounce-back from 33.3% G1). But ORL has TWO "good" outlooks: Banchero (49% FG, 22-30pts) and Wagner (48% FG, 16-24pts) + Bane "neutral-good" (42% FG, 3PT bounce-back from 1-8). ORL's multi-initiator attack (5 in double figures G1) vs DET's single-initiator dependence remains the structural problem. DET home crowd + Bickerstaff adjustments provide the slim edge. GRIND territory — tightest series in the bracket.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Cade Cunningham Over 7.5 assists</div>
        <div class="bet-line">-110 | Model: 7.8 APG | Outlook: GOOD | G1: 4ast (suppressed by Suggs)</div>
        <div class="bet-reasoning">Cade's "good" outlook (46% FG, 28-36pts) means he'll draw more defensive attention, creating kick-out opportunities. G1 only 4ast despite 39pts — Suggs' D suppressed CREATION not scoring. Bickerstaff must design more actions to involve Harris/Robinson/Duren. ORL's trapping creates short-roll passing lanes. At home, better ball movement expected as team settles playoff nerves. 7.5 is tight (0.3pt cushion) but directionally correct.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- SAS-POR (8:00pm ET) — No major injury changes -->
      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">SAS ML vs POR</div>
        <div class="bet-line">-700 | Model: SAS 112-100 (+12) | SEPARATION</div>
        <div class="bet-reasoning"><strong>PHASE 23:</strong> No significant injury changes for this series. SAS: Jordan McLaughlin OUT (ankle, minor backup PG). POR: Lillard OUT (season-ending Achilles, already modeled). Outlooks hold: Wemby "good" (52% FG), Fox "neutral-good" (47% FG), Avdija "neutral" (47% FG — regression from 57.1% G1). Wemby won DPOY (announced today per NBA.com) — confidence/momentum boost. ESPN market: SAS -11.5 (-110), ML -700. Model +12 aligns perfectly with market -11.5. Home again for SAS. Cleanest G2 on the board — no injury variance to factor.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">SAS -11.5 vs POR</div>
        <div class="bet-line">-110 | Model: +12 margin | ESPN line: SAS -11.5</div>
        <div class="bet-reasoning">Phase 23 confirms: model +12 vs market -11.5 — tight 0.5pt cushion. No new injuries disrupt either side. Wemby DPOY momentum is a psychological boost but not model-quantifiable. Avdija's "neutral" regression from 30pt G1 is the key dynamic — if he reverts to ~22pts, SAS covers. Holiday "neutral-good" bounce-back (40% FG, up from 26.7% G1) is the biggest cover risk. Lean SAS covers but razor-thin edge.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Wembanyama Over 25.5 points</div>
        <div class="bet-line">-125 | Model: 28.2 pts | Outlook: GOOD (52% FG) | G1: 35pts</div>
        <div class="bet-reasoning">Phase 23 holds: "good" outlook at 52% FG (26-34pt range). 3PT regression expected (season ~37% vs G1's 83.3%), but midrange/rim finishing (8-15 on 2PT in G1) is sustainable. Fresh off DPOY win — expect high energy and aggression. POR still has no answer for his length. Home court. Clears 25.5 by 2.7pts. No injury or fatigue concerns for a 22-year-old on 2-day rest.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">De'Aaron Fox Over 6.5 assists</div>
        <div class="bet-line">-115 | Model: 7.8 APG | Outlook: NEUTRAL-GOOD (47% FG) | G1: 8ast</div>
        <div class="bet-reasoning">Phase 23 holds: Fox's G1 baseline (8ast, 46.7% FG) is sustainable. No fatigue concerns (30 years old, 2-day rest). His speed creates binary decisions for POR in PnR: help on drives (Wemby/Vassell open) or stay home (Fox scores). SEPARATION game = structured half-court sets = consistent assist opportunities. 1.3pt cushion over 6.5 line.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
    </div>

    </div><!-- end betContent-g2 -->

    <!-- ===== GAME 3 BETS TAB ===== -->
    <div id="betContent-g3" class="bet-content" style="display:none;">

    <p style="color:#aaa;font-size:12px;margin-bottom:16px;text-align:center;">G3 projections incorporate G1+G2 Bayesian updates, <strong>Phase 22 per-player offensive outlook</strong> (research-backed FG% differentiation), coaching compression, and returning player logic. Props recalibrated to new individual projections.</p>

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

    </div><!-- end betContent-g3 -->

    <!-- DISCLAIMER -->
    <div class="bets-disclaimer">
      <strong>Disclaimer:</strong> These picks are generated by a statistical model calibrated against 2025 NBA Playoff results (73.5% accuracy across 49 games) and updated with deep-dive research from Fadeaway World, Basketball Reference, and SI for the 2026 R1 slate. They are not guaranteed outcomes. All betting involves risk. Lines shown are approximate and may differ from your sportsbook. The model accounts for Home Court Advantage (round-adjusted), System Coherence, Championship DNA, Health Degradation, Star Ceiling Variance, Playoff Pedigree, and G1 Bayesian Updates — but cannot predict injuries, ejections, or one-game anomalies. Bet responsibly.
    </div>
  </div>`;
}
