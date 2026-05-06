// ============================================================
// BETS PAGE
// ============================================================

function renderBetsPage(el) {
  // Route to appropriate round renderer
  if (currentPlayoffRound === 'R2') {
    renderR2Bets(el);
    return;
  }
  el.innerHTML = `
  <div style="max-width:900px;margin:0 auto;padding:20px 10px;" class="bets-container">
    <h2 style="text-align:center;color:#fff;margin-bottom:4px;">2026 NBA Playoff Bets — Round 1 (Archived)</h2>
    <p style="text-align:center;color:#aaa;font-size:13px;margin-bottom:8px;">R1 Final Record: ML 25/42 (59.5%) | G1: 7/8 (88%) | G4: 3/4 (75%) | G5: 6/7 (86%) | G6: 1/3 (33%) | P&amp;L: -$698.47</p>
    <div style="text-align:center;margin-bottom:16px;"><button onclick="currentPlayoffRound='R2';renderBetsPage(document.getElementById('main'))" style="padding:8px 20px;border-radius:6px;background:var(--accent);color:#fff;border:none;cursor:pointer;font-weight:700;font-size:13px;">Switch to Round 2 Bets &rarr;</button></div>

    <!-- BET TABS -->
    <div class="scroll-x" style="display:flex;gap:0;margin-bottom:24px;justify-content:center;">
      <div class="bet-tab active" onclick="switchBetTab('parlays')" id="betTab-parlays" style="padding:10px 24px;border-radius:8px 0 0 8px;cursor:pointer;font-size:13px;font-weight:700;background:var(--accent);color:#fff;border:1px solid var(--accent);transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Featured Parlays</div>
      <div class="bet-tab" onclick="switchBetTab('g1')" id="betTab-g1" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 1 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g2')" id="betTab-g2" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 2 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g3')" id="betTab-g3" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 3 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g4')" id="betTab-g4" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 4 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g5')" id="betTab-g5" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 5 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g6')" id="betTab-g6" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 6 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g7')" id="betTab-g7" style="padding:10px 24px;border-radius:0 8px 8px 0;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 7 Bets</div>
    </div>

    <!-- ===== PARLAYS TAB ===== -->
    <div id="betContent-parlays" class="bet-content">
    <div class="parlay-featured">

      <!-- ===== TODAY'S DATE BANNER ===== -->
      <div style="text-align:center;margin-bottom:16px;">
        <span style="font-size:12px;font-weight:700;color:#a78bfa;background:rgba(167,139,250,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">NEXT — Thu May 7 | R2 G2: CLE @ DET 7:00 PM | NYK-PHI 7:00 PM | LAL @ OKC 9:30 PM | SAS-MIN 9:30 PM</span>
      </div>

      <!-- ===== R2 OVERVIEW ===== -->
      <div style="margin-bottom:20px;border-top:2px solid #a78bfa;padding-top:16px;">
        <div style="text-align:center;margin-bottom:12px;">
          <span style="font-size:12px;font-weight:700;color:#a78bfa;background:rgba(167,139,250,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">ROUND 2 — Conference Semifinals | Phase 44</span>
        </div>
        <div style="background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.2);border-radius:10px;padding:14px;margin-bottom:16px;">
          <div style="font-size:11px;color:#a78bfa;font-weight:700;margin-bottom:8px;">R2 G1 WIN PROBABILITIES</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
            <div style="text-align:center;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);">
              <div style="font-size:10px;color:#3dd68c;">NYK-PHI G1 ✅</div>
              <div style="font-size:18px;font-weight:700;color:#3dd68c;">NYK 137-98</div>
              <div style="font-size:9px;color:#666;">Model: NYK 110-101 | Actual margin +39</div>
            </div>
            <div style="text-align:center;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);">
              <div style="font-size:10px;color:#ef4444;">SAS-MIN G1 ❌</div>
              <div style="font-size:18px;font-weight:700;color:#ef4444;">MIN 104-102</div>
              <div style="font-size:9px;color:#666;">Model: SAS 112-105 | MIN upset (+2)</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
            <div style="text-align:center;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);">
              <div style="font-size:10px;color:#3dd68c;">OKC-LAL G1 ✅</div>
              <div style="font-size:18px;font-weight:700;color:#3dd68c;">OKC 108-90</div>
              <div style="font-size:9px;color:#666;">Model: OKC 116-101 | Winner ✅ margin off</div>
            </div>
            <div style="text-align:center;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);">
              <div style="font-size:10px;color:#3dd68c;">DET-CLE G1 ✅</div>
              <div style="font-size:18px;font-weight:700;color:#3dd68c;">DET 111-101</div>
              <div style="font-size:9px;color:#666;">Model: DET 108-105 | Winner ✅ margin +7</div>
            </div>
          </div>
          <div style="font-size:11px;color:#a78bfa;font-weight:700;margin-bottom:8px;">R1 FINAL RESULTS</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;font-size:10px;">
            <div style="padding:6px;border-radius:4px;background:rgba(0,0,0,0.2);text-align:center;"><span style="color:#3dd68c;">DET 4-3</span><br/>G7: 116-94 ✅</div>
            <div style="padding:6px;border-radius:4px;background:rgba(0,0,0,0.2);text-align:center;"><span style="color:#3dd68c;">CLE 4-3</span><br/>G7: 114-102 ✅</div>
            <div style="padding:6px;border-radius:4px;background:rgba(0,0,0,0.2);text-align:center;"><span style="color:#f44336;">PHI 4-3</span><br/>BOS upset ❌</div>
            <div style="padding:6px;border-radius:4px;background:rgba(0,0,0,0.2);text-align:center;"><span style="color:#4caf50;">R1 Done</span><br/>All 8 series</div>
          </div>
          <div style="font-size:10px;color:#666;margin-top:8px;text-align:center;font-style:italic;">R2 G1 Complete: 3/4 winner picks correct (NYK ✅, DET ✅, OKC ✅, SAS ❌). Allen (CLE) limited to 18min G1 — knee tendonitis. DET forced 19 CLE TOs. G2: Thu May 7 (DET-CLE, NYK-PHI) + Sat May 9 (all 4 series G2/G3).</div>
        </div>
      </div>

      <!-- ===== R2 FEATURED PARLAYS — MAY 5 (TONIGHT) ===== -->
      <div style="margin-bottom:20px;border-top:2px solid #4caf50;padding-top:20px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#4caf50;background:rgba(76,175,80,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">R2 G1 RESULTS — Tue May 5 | OKC ✅ DET ✅ | $100 Play: ✅ WON (+$125)</span>
        </div>

        <!-- $100 BEST BET PARLAY — WON -->
        <div class="parlay-card headline" style="border:1px solid #4caf50;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#4caf50;">$100 Play — OKC Fortress + DET Home Court (2-Leg) ✅ WON</span>
            <span class="parlay-odds" style="background:rgba(76,175,80,0.2);color:#4caf50;font-size:16px;">~+125 | +$125</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #4caf50;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">OKC ML vs LAL ✅ — OKC 108-90. Holmgren 24/12/3blk. LeBron 27pts but LAL shot 37% FG.</span>
              <span class="parlay-leg-odds">-900</span>
              <span class="parlay-leg-conf" style="background:#1a3a1a;color:#4caf50;">✅ HIT</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #4caf50;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">DET ML vs CLE ✅ — DET 111-101. Cade 23/7ast, D.Robinson 19pts (5-8 3PT). Duren clutch block.</span>
              <span class="parlay-leg-odds">-155</span>
              <span class="parlay-leg-conf" style="background:#1a3a1a;color:#4caf50;">✅ HIT</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#4caf50;"><strong>✅ WON +$125!</strong> Both legs hit cleanly. OKC dominated LAL 108-90 behind Holmgren's 24/12/3blk — the talent gap was massive as predicted. DET beat CLE 111-101 — model picked the right winner (DET +3 predicted, actual +10). DET's #1 defense forced 19 CLE turnovers with 12 steals. Allen limited to 18min/2pts due to knee. First R2 $100 parlay WIN.</div>
        </div>

        <!-- $1 CHAOS TICKET — LOST -->
        <div class="parlay-card" style="border:1px solid #f44336;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f44336;">$1 Chaos Ticket — LeBron's Last Stand (2-Leg) ❌ LOST</span>
            <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+1800 | -$1</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">LAL ML @ OKC ❌ — OKC 108-90. LAL shot 37% FG, never competitive after Q2.</span>
              <span class="parlay-leg-odds">+600</span>
              <span class="parlay-leg-conf" style="background:#5a2d2d;color:#f44336;">❌ MISS</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">CLE ML @ DET ❌ — DET 111-101. CLE rallied to 93-93 but couldn't close.</span>
              <span class="parlay-leg-odds">+130</span>
              <span class="parlay-leg-conf" style="background:#5a2d2d;color:#f44336;">❌ MISS</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f44336;"><strong>❌ LOST — both legs missed.</strong> LAL never had a chance — OKC's defense held them to 37% FG. CLE showed grit (rallied from -18 to tie 93-93) but DET closed with a Duren block + 3 dunks off Cade assists. No chaos tonight — favorites won both games convincingly.</div>
        </div>
      </div>

      <!-- ===== R2 G2 PARLAYS — MAY 7 (UPCOMING) ===== -->
      <div style="margin-bottom:20px;border-top:2px solid #a78bfa;padding-top:20px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#a78bfa;background:rgba(167,139,250,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">R2 G2 — Thu May 7 | DET-CLE 7 PM | OKC-LAL 9:30 PM | NYK-PHI 7 PM</span>
        </div>

        <!-- $100 BEST BET — MAY 7 -->
        <div class="parlay-card headline" style="border:1px solid #a78bfa;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#a78bfa;">$100 Play — Home Court Dominance (2-Leg)</span>
            <span class="parlay-odds" style="background:rgba(167,139,250,0.2);color:#a78bfa;font-size:16px;">~+110</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">OKC ML vs LAL — J.Williams ramp-up + SGA bounce-back from 7 TOs. Won G1 by 18 with SGA at floor. LAL has no answer to depth gap.</span>
              <span class="parlay-leg-odds">-800</span>
              <span class="parlay-leg-conf" style="background:rgba(167,139,250,0.12);color:#a78bfa;">HIGH</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">DET ML vs CLE — DET forced 19 CLE TOs G1. Allen limited (knee). Cade 23/7ast controls pace. Home defense suffocates.</span>
              <span class="parlay-leg-odds">-190</span>
              <span class="parlay-leg-conf" style="background:rgba(167,139,250,0.12);color:#a78bfa;">MEDIUM-HIGH</span>
            </div>
          </div>
          <div class="parlay-reasoning"><strong>Thesis:</strong> Both home teams dominated G1 (DET +10, OKC +18). DET's defense forced 19 TOs and OKC's depth is unsolvable for LAL. CLE may adjust but Allen's knee + DET's turnover machine is structural. OKC gets J.Williams ramping + SGA floor was 18pts/7TOs and STILL won by 18. Combined ML at ~+110 is excellent value for two teams that proved dominance in G1.</div>
        </div>

        <!-- $1 CHAOS TICKET ��� MAY 7 -->
        <div class="parlay-card" style="border:1px solid #ff9800;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#ff9800;">$1 Chaos Ticket — CLE Road Revenge + PHI Steal (2-Leg)</span>
            <span class="parlay-odds" style="background:rgba(255,152,0,0.2);color:#ff9800;font-size:16px;">~+800</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #ff9800;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">CLE ML @ DET — CLE rallied from -18 to 93-93 in G1. Mitchell/Garland revenge. If Allen plays 30+ min, CLE's ceiling is higher.</span>
              <span class="parlay-leg-odds">+160</span>
              <span class="parlay-leg-conf" style="background:rgba(255,152,0,0.12);color:#ff9800;">CHAOS</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #ff9800;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">PHI ML @ NYK — PHI lost G1 by 39 but fatigue was catastrophic (3 days rest). With 3 days between, Embiid + Maxey could steal one.</span>
              <span class="parlay-leg-odds">+200</span>
              <span class="parlay-leg-conf" style="background:rgba(255,152,0,0.12);color:#ff9800;">CHAOS</span>
            </div>
          </div>
          <div class="parlay-reasoning"><strong>Chaos thesis:</strong> CLE showed G1 grit — rallied from -18 to tie 93-93 before DET's closing burst. If Allen's knee is better + CLE adjusts to DET's trapping, their talent can overcome. PHI's G1 was catastrophic (137-98) but they had 3 fewer days rest — fatigue was THE story. With equal rest and Embiid's playoff pride, PHI can be competitive. Long shot but +800 pays $9 on $1.</div>
        </div>
      </div>

      <!-- ===== R2 G1 PARLAYS — MAY 4 (RESULTS) ===== -->
      <div style="margin-bottom:20px;border-top:2px solid #888;padding-top:20px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#888;background:rgba(136,136,136,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">R2 G1 PARLAYS — Sun May 4 | NYK ✅ SAS ❌ | $100 Play: ❌ LOST (SAS leg busted)</span>
        </div>

        <!-- $100 PLAY RESULT -->
        <div class="parlay-card headline" style="border:1px solid #f44336;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f44336;">$100 Play — R2 Home Court (2-Leg) ❌ LOST</span>
            <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+200 | -$100</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #4caf50;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">NYK ML vs PHI ✅ — NYK 137-98 blowout. Brunson 35pts. PHI fatigue was catastrophic.</span>
              <span class="parlay-leg-odds">-310</span>
              <span class="parlay-leg-conf" style="background:#1a3a1a;color:#4caf50;">✅ HIT</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">SAS ML vs MIN ❌ — MIN 104-102 upset. Wemby 0-8 3PT (!). Edwards off bench was masterclass.</span>
              <span class="parlay-leg-odds">-300</span>
              <span class="parlay-leg-conf" style="background:#5a2d2d;color:#f44336;">❌ MISS — Wemby cold + Edwards clutch</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f44336;"><strong>❌ LOST — SAS leg busted.</strong> NYK crushed PHI as expected (137-98). But SAS lost 102-104 to MIN in a shocking upset. Wemby shot 0-8 from 3PT (11pts on 5-17 FG) — worst game of his career. Edwards came off the bench fresh and scored 8 of MIN's final 16pts. Finch's coaching adjustment was the difference. Model was 1/2 on winner picks but the parlay is dead.</div>
        </div>

        <!-- $1 CHAOS TICKET RESULT -->
        <div class="parlay-card" style="border:1px solid #ff9800;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#ff9800;">$1 Chaos Ticket — Road Warriors (3-Leg) ❌ LOST</span>
            <span class="parlay-odds" style="background:rgba(255,152,0,0.2);color:#f44336;font-size:16px;">~+2000 | -$1</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">PHI ML @ NYK ❌ — NYK 137-98. Total blowout. PHI had no chance.</span>
              <span class="parlay-leg-odds">+250</span>
              <span class="parlay-leg-conf" style="background:#5a2d2d;color:#f44336;">❌ MISS</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #4caf50;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">MIN ML @ SAS ✅ — MIN 104-102. Edwards + Finch coaching won it.</span>
              <span class="parlay-leg-odds">+240</span>
              <span class="parlay-leg-conf" style="background:#1a3a1a;color:#4caf50;">✅ HIT</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #888;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">CLE ML @ DET — Tonight (May 5, 7:00 PM ET)</span>
              <span class="parlay-leg-odds">+130</span>
              <span class="parlay-leg-conf" style="background:#333;color:#888;">DEAD — PHI leg killed it</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f44336;"><strong>❌ LOST — PHI leg killed it instantly.</strong> MIN did upset SAS (the Chaos call was right!) but PHI got blown out 98-137. MIN's upset at +240 would've been a great hit but the PHI blowout ended the parlay.</div>
        </div>
      </div>

      <!-- ===== PREVIOUS PARLAYS — MAY 1-3 (RESULTS) ===== -->
      <div style="margin-bottom:20px;border-top:2px solid #888;padding-top:20px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#888;background:rgba(136,136,136,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">R1 RESULTS — G7: DET ✅ (4-3), CLE ✅ (4-3), PHI ✅ upset (4-3 vs BOS)</span>
        </div>

        <!-- $100 PLAY RESULT -->
        <div class="parlay-card headline" style="border:1px solid #f44336;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f44336;">$100 Play — G7 Blockbuster + Road Close-Out (2-Leg) ❌ LOST</span>
            <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+165 | -$100</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #888;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">BOS ML vs PHI (BOS-PHI G7) — PENDING (tonight May 2)</span>
              <span class="parlay-leg-odds">-200</span>
              <span class="parlay-leg-conf" style="background:#333;color:#888;">PENDING</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">CLE ML @ TOR (CLE-TOR G6) — ❌ TOR 112-110 OT</span>
              <span class="parlay-leg-odds">-200</span>
              <span class="parlay-leg-conf" style="background:#5a2d2d;color:#f44336;">MISS — TOR won OT thriller</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f44336;"><strong>❌ LOST — CLE leg busted.</strong> TOR won 112-110 OT behind Barnes' 14ast and Walter's 24pts. CLE's bench disappeared (14pts vs 36pts G5) and Harden's 4 TOs in a 2-point game were fatal. The model's 62% CLE probability was wrong — TOR's home court was worth more than projected.</div>
        </div>

        <!-- $50 TRIPLE THREAT RESULT -->
        <div class="parlay-card headline" style="border:1px solid #ff9800;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#ff9800;">$50 Triple Threat — 3 Road Favorites (3-Leg) — PARTIAL ✅✅❌</span>
            <span class="parlay-odds" style="background:rgba(255,152,0,0.2);color:#ff9800;font-size:16px;">~+300 | -$50</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #4caf50;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">DET ML @ ORL — ✅ DET 93-79 (dominant road win)</span>
              <span class="parlay-leg-odds">-160</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIT — Cade 32/10/4stl</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">CLE ML @ TOR — ❌ TOR 112-110 OT</span>
              <span class="parlay-leg-odds">-200</span>
              <span class="parlay-leg-conf" style="background:#5a2d2d;color:#f44336;">MISS — Barnes 25/14ast</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #4caf50;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">LAL ML @ HOU — ✅ LAL 98-78 (series won 4-2)</span>
              <span class="parlay-leg-odds">+140</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIT — LeBron 28pts closeout</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#ff9800;"><strong>❌ LOST — CLE leg killed the parlay.</strong> 2/3 legs hit: DET dominated ORL 93-79 and LAL blew out HOU 98-78, but CLE's loss at TOR (112-110 OT) busted the parlay. The CLE pick was the most overconfident — TOR's home court was the most underweighted factor across all models.</div>
        </div>
      </div>

      <!-- ===== UPCOMING FEATURED PARLAYS — MAY 2-3 ===== -->
      <div style="margin-bottom:20px;border-top:2px solid #4caf50;padding-top:20px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#4caf50;background:rgba(76,175,80,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">UPCOMING — May 2-3 | BOS-PHI G7, DET-ORL G7, CLE-TOR G7</span>
        </div>

        <!-- $100 PLAY — TRIPLE G7 HOME SWEEP -->
        <div class="parlay-card headline">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f0c040;">$100 Play — Triple G7 Home Sweep (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(240,192,64,0.2);color:#f0c040;font-size:16px;">~+150</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f0c040;background:rgba(240,192,64,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$100 &rarr; ~$250 return</span>
            <span style="font-size:11px;color:#4caf50;background:rgba(76,175,80,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">May 2-3</span>
            <span style="font-size:10px;color:#a78bfa;background:rgba(167,139,250,0.12);padding:3px 8px;border-radius:4px;font-weight:600;">G7 OVERRIDE: Home teams win 78% of G7s historically</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">BOS ML vs PHI (BOS-PHI G7 — Sat May 2) &star;</span>
              <span class="parlay-leg-odds">-298</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH — G7 Override +5 HCA, TD Garden fortress</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">DET ML vs ORL (DET-ORL G7 — Sun May 3)</span>
              <span class="parlay-leg-odds">-298</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH — Cade averaging 38.5pts in elimination games, Wagner OUT</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">CLE ML vs TOR (CLE-TOR G7 — Sun May 3)</span>
              <span class="parlay-leg-odds">-333</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED — CLE 3-0 at home but TOR has proven resilience</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f0c040;"><strong>G7 Override is the strongest signal in the model.</strong> Home teams have won ~78% of Game 7s historically. All 3 home teams (BOS, DET, CLE) have been dominant at their arenas this series. BOS won G1/G2 at TD Garden. DET won G2 98-83 at LCA. CLE is 3-0 at Rocket Mortgage. The combined probability of all 3 home teams winning is ~33% (65% × 75% × 68%). At +150 implied odds of 40%, this parlay has slight +EV if the G7 Override holds. The biggest risk is CLE — TOR has been the most resilient underdog in R1.</div>
        </div>

        <!-- $25 CADE + LEBRON SCORER PARLAY -->
        <div class="parlay-card headline" style="border:1px solid #a78bfa;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#a78bfa;">$25 Star Props — G7 Scorers Parlay (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(167,139,250,0.2);color:#a78bfa;font-size:16px;">~+500</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#a78bfa;background:rgba(167,139,250,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$25 &rarr; ~$150 return</span>
            <span style="font-size:11px;color:#4caf50;background:rgba(76,175,80,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">Phase 43 Props</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">Cade Cunningham O30.5pts (DET-ORL G7)</span>
              <span class="parlay-leg-odds">-110</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH — 38.5pts avg in G5-G6, G7 at home</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">Donovan Mitchell O24.5pts (CLE-TOR G7)</span>
              <span class="parlay-leg-odds">-115</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED — Series avg 24.3pts, home court shooting boost</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">Jaylen Brown O24.5pts (BOS-PHI G7)</span>
              <span class="parlay-leg-odds">-120</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH — 28+ PPG avg, G7 at home = legacy game</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#a78bfa;"><strong>Three stars at home in Game 7 = maximum usage.</strong> Cade has averaged 38.5pts in elimination games and is virtually guaranteed 30+ at LCA. Mitchell's home shooting (49% FG vs 38% road) gives him a significant boost. Brown has been BOS's most consistent scorer all series. All three lines are beatable at home in a G7.</div>
        </div>

        <!-- $1 CHAOS — ROAD TEAMS STEAL G7 -->
        <div class="parlay-card headline" style="border:1px solid #f44336;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f44336;">$1 Chaos — Road Underdogs Steal Game 7 (2-Leg)</span>
            <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+1500</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f44336;background:rgba(244,67,54,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$1 &rarr; ~$16 return</span>
            <span style="font-size:11px;color:#ff9800;background:rgba(255,152,0,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">CONTRARIAN — May 3</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">ORL ML @ DET (DET-ORL G7) — Banchero revenge game</span>
              <span class="parlay-leg-odds">+240</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW — Banchero bounce-back from 4-20</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">TOR ML @ CLE (CLE-TOR G7) — Barnes' facilitator mode</span>
              <span class="parlay-leg-odds">+260</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW — TOR has won 3 elimination games this series</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f44336;"><strong>The road chaos special.</strong> ORL's Banchero had a career-worst 4-20 in G6 — historically, stars bounce back hard from their worst games. TOR has won 3 elimination games already (G3, G4, G6). Barnes' 14-assist G6 showed a facilitator gear that can beat anyone. Both legs are long shots but at +1500, the $1 price is right for two teams that have proven they can defy the odds.</div>
        </div>
      </div>

      <!-- ===== THU APR 30 G6 RESULTS (COLLAPSED) ===== -->
      <details style="margin-bottom:16px;border:1px solid #333;border-radius:8px;padding:8px 12px;">
        <summary style="cursor:pointer;color:#888;font-size:12px;font-weight:600;">📊 Thu Apr 30 G6 Results — NYK-ATL: NYK 140-89 ✅ SERIES WON 4-2 | BOS-PHI: PHI 106-93 ❌ Tied 3-3 | DEN-MIN: MIN 110-98 ❌ SERIES LOST 4-2</summary>
        <div style="margin-top:8px;padding:8px;background:rgba(255,255,255,0.03);border-radius:4px;font-size:11px;color:#666;">
          <div><strong>$100 Road Closers: ❌ LOST</strong> — BOS ML ❌ (PHI won 106-93, Maxey 30pts, George 23pts, BOS 42% FG/29% 3PT). NYK ML ✅ (140-89 blowout). Parlay dead on BOS loss.</div>
          <div style="margin-top:4px;"><strong>$50 Ensemble Edge: ❌ LOST</strong> — DEN +6.5 ❌ (MIN won 110-98, DEN lost by 12, didn't cover). CLE leg pending (G6 May 1).</div>
          <div style="margin-top:4px;"><strong>$1 Chaos: ❌ LOST</strong> — PHI ML ✅ (won 106-93), ATL ML ❌ (NYK 140-89 blowout), MIN ML ✅ (won 110-98). Needed all 3, ATL busted it.</div>
          <div style="margin-top:4px;"><strong>$75 Player Props: ❌ LOST</strong> — Embiid O27.5 ❌ (19pts), Brunson O27.5 ❌ (17pts), Jokic O29.5 ❌ (28pts). All 3 Thu legs missed — parlay dead.</div>
          <div style="margin-top:4px;"><strong>NYK-ATL G6:</strong> NYK 140, ATL 89 (+51). NYK WINS SERIES 4-2. Anunoby 29pts (11-14 FG), Bridges 24pts, Brunson 17pts/8ast. Historic blowout. Model ✅.</div>
          <div style="margin-top:4px;"><strong>BOS-PHI G6:</strong> PHI 106, BOS 93. Series TIED 3-3 → G7 at Boston. Maxey 30pts (0 TOs), George 23pts (5-9 3PT), Embiid 19/10/8. BOS shot 42% FG, 29% 3PT — road close-out failures continue. Model ❌.</div>
          <div style="margin-top:4px;"><strong>DEN-MIN G6:</strong> MIN 110, DEN 98. MIN WINS SERIES 4-2. MIN closed out without Edwards/DiVincenzo — team effort overwhelmed Jokic (28pts). Model ❌ — underestimated MIN's depth without stars.</div>
          <div style="margin-top:4px;"><strong>G6 Model Record:</strong> 1/3 (33.3%). Only NYK-ATL correct. Cumulative: 23/41 (56.1%).</div>
        </div>
      </details>

      <!-- ===== WED APR 29 G5 RESULTS (COLLAPSED) ===== -->
      <details style="margin-bottom:16px;border:1px solid #333;border-radius:8px;padding:8px 12px;">
        <summary style="cursor:pointer;color:#888;font-size:12px;font-weight:600;">📊 Wed Apr 29 G5 Results — DET-ORL: DET 116-109 (Model ✅) | CLE-TOR: CLE 125-120 (Model ✅) | HOU-LAL: HOU 99-93 (Model ❌) | DEN-MIN: DEN 125-113 (Model engine ✅)</summary>
        <div style="margin-top:8px;padding:8px;background:rgba(255,255,255,0.03);border-radius:4px;font-size:11px;color:#666;">
          <div><strong>DET-ORL G5:</strong> DET 116, ORL 109. ORL leads 3-2. Historic 45-45 dual scoring duel — Cade Cunningham 45pts, Paolo Banchero 45/9/7. Wagner DNP (calf) elevated Banchero to carry mode. Model picked DET medium — CORRECT.</div>
          <div style="margin-top:4px;"><strong>CLE-TOR G5:</strong> CLE 125, TOR 120. CLE leads 3-2. Shooting regression normalized after G4's nightmare (CLE 37%/TOR 32% → both shot normally). Harden 23/9reb, Barrett 25/12reb. CLE won Q4 25-17 via defensive tightening. Model picked CLE medium — CORRECT.</div>
          <div style="margin-top:4px;"><strong>HOU-LAL G5:</strong> HOU 99, LAL 93. LAL leads 3-2. Smith Jr 22pts (4-9 3PT). Reaves returned (22pts but 4-16 FG, FT-merchant 12-13 FT). LeBron 25pts 0-6 3PT. Smart 6 TOs. Ayton 18/17reb. Model picked LAL ❌ — wrong.</div>
          <div style="margin-top:4px;"><strong>DEN-MIN G5:</strong> DEN 125, MIN 113. MIN leads 3-2. DEN avoids elimination. Jokic triple-double 27/16ast/12reb. Spencer Jones 20pts (Star Absence Liberation). MIN 25 TOs without Edwards/DiVincenzo. Model engine picked DEN — CORRECT.</div>
          <div style="margin-top:4px;"><strong>G5 Model Record (Wed):</strong> 3/4 picks correct (DET ✅, CLE ✅, HOU-LAL ❌, DEN ✅). G5 overall: 5/7 (71.4%) across Tue+Wed.</div>
        </div>
      </details>

      <!-- ===== TUE APR 28 G5 RESULTS (COLLAPSED) ===== -->
      <details style="margin-bottom:16px;border:1px solid #333;border-radius:8px;padding:8px 12px;">
        <summary style="cursor:pointer;color:#888;font-size:12px;font-weight:600;">📊 Tue Apr 28 G5 Results — BOS-PHI: PHI 113-97 ($100 ❌, $1 Leg 1 ✅) | NYK-ATL: NYK 126-97 ($100 Leg 2 ✅) | SAS-POR: SAS 114-95 ($100 Leg 3 ✅, SERIES OVER)</summary>
        <div style="margin-top:8px;padding:8px;background:rgba(255,255,255,0.03);border-radius:4px;font-size:11px;color:#666;">
          <div><strong>$100 Play: ❌ LOST</strong> — BOS ML leg busted. BOS 97, PHI 113. Embiid exploded for 33pts (only 2 in Q1 then 31 in final 3Q). BOS collapsed in Q4: 11pts on 3-22 FG. NYK and SAS legs hit but parlay dead.</div>
          <div style="margin-top:4px;"><strong>$1 Chaos: ❌ LOST</strong> — PHI ML leg HIT (Embiid went nuclear as we predicted!), but ATL and POR legs missed. NYK 126-97 blowout, SAS 114-95 clincher.</div>
          <div style="margin-top:4px;"><strong>BOS-PHI G5:</strong> PHI 113, BOS 97. BOS leads 3-2. Embiid 33pts, Maxey 25/10/5, George 16/9/7, Grimes 18 off bench. BOS Q4 collapse (11pts).</div>
          <div style="margin-top:4px;"><strong>NYK-ATL G5:</strong> NYK 126, ATL 97. NYK leads 3-2. Brunson 39pts (15-23 FG, 65.2%). McCollum 6pts (3-10). NYK shot 57% FG.</div>
          <div style="margin-top:4px;"><strong>SAS-POR G5:</strong> SAS 114, POR 95. SAS WINS SERIES 4-1. Wemby 17/14/6blk. Fox 21/9ast. Champagnie 5-7 3PT. Model prediction SAS 116-99 was nearly perfect.</div>
        </div>
      </details>

      <!-- ===== APR 26 G4 RESULTS (COLLAPSED) ===== -->
      <details style="margin-bottom:16px;border:1px solid #333;border-radius:8px;padding:8px 12px;">
        <summary style="cursor:pointer;color:#888;font-size:12px;font-weight:600;">📊 Sun Apr 26 G4 Results — CLE-TOR: TOR 93-89 (Model ✅) | SAS-POR: SAS 114-93 | BOS-PHI: BOS 128-96 | HOU-LAL: HOU 115-96</summary>
        <div style="margin-top:8px;padding:8px;background:rgba(255,255,255,0.03);border-radius:4px;font-size:11px;color:#666;">
          <div><strong>CLE-TOR G4:</strong> TOR 93, CLE 89. Series tied 2-2. Model picked TOR ✅ — Barnes and Barrett led TOR to a gritty defensive win, holding CLE to 89pts. TOR's home-court advantage proved decisive.</div>
          <div style="margin-top:4px;"><strong>SAS-POR G4:</strong> SAS 114, POR 93. SAS leads 3-1. SAS dominated at home with a 21-point blowout. POR's youth breakout faded on the road.</div>
          <div style="margin-top:4px;"><strong>BOS-PHI G4:</strong> BOS 128, PHI 96. BOS leads 3-1. BOS's 3PT shooting normalized and they obliterated PHI by 32. Close-out game at home next.</div>
          <div style="margin-top:4px;"><strong>HOU-LAL G4:</strong> HOU 115, LAL 96. LAL leads 3-1. HOU's home-court finally kicked in with a dominant 19-point win. LAL's defensive scheme cracked at Toyota Center.</div>
        </div>
      </details>

      <!-- ===== G4 FEATURED PARLAYS — SAT APR 25 (COLLAPSED) ===== -->
      <details style="margin-bottom:16px;border:1px solid #333;border-radius:8px;padding:8px 12px;">
        <summary style="cursor:pointer;color:#888;font-size:12px;font-weight:600;">📊 G4 Featured Parlays — Sat Apr 25 | $100: ATL ML + Barnes O27.5 + TOR +3.5 | $1: NYK ML + CLE ML + Kuminga O19.5</summary>
      <div style="margin-top:8px;">
      <div style="margin-bottom:20px;border-top:2px solid #4caf50;padding-top:20px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#4caf50;background:rgba(76,175,80,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">SAT APR 25 | G4: NYK-ATL, CLE-TOR</span>
        </div>

        <!-- $100 G4 BEST BET — SAT APR 25 -->
        <div class="parlay-card headline">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f0c040;">G4 $100 Best Bet — Sat Apr 25 (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(240,192,64,0.2);color:#f0c040;font-size:16px;">~+380</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f0c040;background:rgba(240,192,64,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$100 &rarr; ~$480 return</span>
            <span style="font-size:11px;color:#64b5f6;background:rgba(100,181,246,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">Sat Apr 25</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">ATL ML vs NYK (NYK-ATL G4)</span>
              <span class="parlay-leg-odds">-135</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">Scottie Barnes Over 27.5 pts (CLE-TOR G4)</span>
              <span class="parlay-leg-odds">-120</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">TOR +3.5 vs CLE (CLE-TOR G4)</span>
              <span class="parlay-leg-odds">-110</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f0c040;"><strong>ATL ML</strong> — the anchor. Kuminga's breakout arc 8&rarr;19&rarr;21pts and Snyder's scheme on Bridges make ATL genuine favorites at home. <strong>Barnes O27.5</strong> — trending 21&rarr;26&rarr;33pts. At home in Scotiabank Arena with 8.5pt cushion from G3's 33pts. <strong>TOR +3.5</strong> — massive cushion after a 22-point G3 win. Harden TO issues persist at home.</div>
        </div>

        <!-- $1 CHAOS TICKET — SAT APR 25 (G4) -->
        <div class="parlay-card headline" style="border:1px solid #f44336;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f44336;">G4 $1 Chaos Ticket — Sat Apr 25 (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+1200</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f44336;background:rgba(244,67,54,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$1 &rarr; ~$13.00 return</span>
            <span style="font-size:11px;color:#ff9800;background:rgba(255,152,0,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">CONTRARIAN — Sat Apr 25</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">NYK ML @ ATL (NYK-ATL G4 — UPSET)</span>
              <span class="parlay-leg-odds">+115</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">CLE ML @ TOR (CLE-TOR G4)</span>
              <span class="parlay-leg-odds">+105</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">Kuminga Over 19.5 pts (NYK-ATL G4)</span>
              <span class="parlay-leg-odds">+110</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f44336;">Contrarian play betting on the road favorites. <strong>NYK ML</strong> — Brunson 3PT regression up, OG averaging 20.7. <strong>CLE ML</strong> — CLE historically 12-2 vs TOR in playoffs. CLE's 3PT regression up (31% &rarr; 36%+). <strong>Kuminga O19.5</strong> — breakout arc 8&rarr;19&rarr;21 suggests 20+ is the new floor. Correlation hedge that works with either side.</div>
        </div>
      </div>
      </div>
      </details>

      <!-- ===== APR 24 G3 PARLAY RESULTS (COLLAPSED) ===== -->
      <details style="margin-bottom:16px;border:1px solid #333;border-radius:8px;padding:8px 12px;">
        <summary style="cursor:pointer;color:#888;font-size:12px;font-weight:600;">📊 Fri Apr 24 Parlay Results — $100 Play: ✗ LOSS (Henderson missed O22.5) | $1 Chaos: ✗ LOSS (PHI ML missed, Edgecombe 10pts)</summary>
        <div style="margin-top:8px;padding:8px;background:rgba(255,255,255,0.03);border-radius:4px;font-size:11px;color:#666;">
          <div><strong>$100 Play (3-Leg ~+490):</strong> ✗ LOSS — Leg 1: Brown O24.5 ✓ (25pts). Leg 2: LAL +9.5 ✓ (LAL won 112-108 OT). Leg 3: Henderson O22.5 ✗ (POR collapsed in 2H, Henderson quiet). Two legs hit but parlay dead on Henderson miss.</div>
          <div style="margin-top:4px;"><strong>$1 Chaos (3-Leg ~+2200):</strong> ✗ LOSS — Leg 1: PHI ML ✗ (BOS won 108-100). Leg 2: LAL ML ✓ (won 112-108 OT). Leg 3: Edgecombe O24.5 ✗ (10pts, 0-7 3PT — Mazzulla schemed him out). PHI ML was the killer.</div>
        </div>
      </details>

      <!-- ===== SAT APR 25 G3 FEATURED PARLAYS (COLLAPSED) ===== -->
      <details style="margin-bottom:16px;border:1px solid #333;border-radius:8px;padding:8px 12px;">
        <summary style="cursor:pointer;color:#888;font-size:12px;font-weight:600;">📊 Sat Apr 25 G3 Parlays — $100: DET ML + OKC ML + SGA O27.5 | $1: ORL ML + PHX ML + Brooks O22.5</summary>
      <div style="margin-top:8px;">
      <div style="margin-top:24px;border-top:2px solid #64b5f6;padding-top:20px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#64b5f6;background:rgba(100,181,246,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">SAT APR 25 — DET-ORL G3 (OT Projected!) &amp; OKC-PHX G3</span>
        </div>

        <!-- $100 BEST BET — SAT APR 25 -->
        <div class="parlay-card headline">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f0c040;">Sat $100 Play — G2 Winners Roll (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(240,192,64,0.2);color:#f0c040;font-size:16px;">~+380</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f0c040;background:rgba(240,192,64,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$100 &rarr; ~$480 return</span>
            <span style="font-size:11px;color:#4caf50;background:rgba(76,175,80,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">Sat Apr 25</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">DET ML @ ORL (DET-ORL G3) ⭐</span>
              <span class="parlay-leg-odds">-148</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">OKC ML @ PHX (OKC-PHX G3)</span>
              <span class="parlay-leg-odds">-455</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">SGA Over 27.5 pts (OKC-PHX G3)</span>
              <span class="parlay-leg-odds">-125</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f0c040;"><strong>DET ML</strong> — the anchor. DET won G2 by 15 with Cade's dual-mode (27pts/11ast). They're road favorites (-2.5) for a reason. Model projects OVERTIME — meaning this game is a coin flip, but Cade's adaptability gives DET the edge. <strong>OKC ML</strong> — OKC won G1 by 35, G2 by 13. PHX had 21 turnovers G2. Even at Phoenix, OKC's depth overwhelms. Heavy juice (-455) but safe floor. <strong>SGA O27.5</strong> — G2 proved the bounce-back: 37pts on 52% FG, 9-9 FT. Two-game avg of 31pts. At Phoenix he'll play full minutes with no blowout risk. This is the highest-confidence prop on the Sat slate.</div>
        </div>

        <!-- $1 CHAOS TICKET — SAT APR 25 -->
        <div class="parlay-card headline" style="border:1px solid #f44336;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f44336;">Sat $1 Chaos Ticket — OT + Upset (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+2800</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f44336;background:rgba(244,67,54,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$1 &rarr; ~$29.00 return</span>
            <span style="font-size:11px;color:#ff9800;background:rgba(255,152,0,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">CONTRARIAN — Sat Apr 25</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">ORL ML vs DET (DET-ORL G3 — OVERTIME UPSET)</span>
              <span class="parlay-leg-odds">+124</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">PHX ML vs OKC (OKC-PHX G3 — DESPERATION)</span>
              <span class="parlay-leg-odds">+350</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">Dillon Brooks Over 22.5 pts (OKC-PHX G3)</span>
              <span class="parlay-leg-odds">+115</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f44336;">The engine projects DET-ORL G3 as OVERTIME — dead even. If any game this round goes to OT, it's this one. <strong>ORL ML +124</strong> — first home game, model says regulation is a toss-up, Banchero's career playoff avg is 28ppg. Home OT = crowd advantage. <strong>PHX ML +350</strong> — 0-2 desperation at home. Brooks just scored 30pts (52.2%) proving PHX has firepower. 0-2 teams win G3 at home ~35% of the time. <strong>Brooks O22.5</strong> — model was WRONG about Brooks (projected "bad", he scored 30). Upgrade to neutral means 22+ is realistic at home with desperation minutes.</div>
        </div>
      </div>
      </div>
      </details>

      <!-- ===== APR 23 PARLAY RESULTS (COLLAPSED) ===== -->
      <details style="margin-bottom:16px;border:1px solid #333;border-radius:8px;padding:8px 12px;">
        <summary style="cursor:pointer;color:#888;font-size:12px;font-weight:600;">📊 Thu Apr 23 Parlay Results — $100 Play: ✗ LOSS (Edwards 17pts foul trouble, NYK lost) | $1 Chaos: ✅ WIN ~$19.50! (3/3 home underdogs swept!)</summary>
        <div style="margin-top:8px;padding:8px;background:rgba(255,255,255,0.03);border-radius:4px;font-size:11px;color:#666;">
          <div><strong>$100 Play (3-Leg ~+420):</strong> ✗ LOSS — Leg 1: Ingram U18.5 ✅ (12pts, CLE scheme lock continues). Leg 2: Edwards O23.5 ❌ (17pts in 24min, 5 fouls limited him). Leg 3: NYK ML ❌ (ATL won 109-108, Kuminga 21pts). Two legs missed — Edwards foul trouble was unforeseeable.</div>
          <div style="margin-top:4px;"><strong>$1 Chaos (3-Leg ~+1850):</strong> ✅ WIN! $1 → $19.50! ALL THREE home underdogs won. Leg 1: MIN ML ✅ (won 113-96, Dosunmu 25pts). Leg 2: ATL ML ✅ (won 109-108, Kuminga 21pts). Leg 3: TOR ML ✅ (won 126-104, Barnes/Barrett 33pts each). Historic sweep — the Chaos Ticket hits for the first time!</div>
        </div>
      </details>

      <!-- ===== APR 22 PARLAY RESULTS (COLLAPSED) ===== -->
      <details style="margin-bottom:16px;border:1px solid #333;border-radius:8px;padding:8px 12px;">
        <summary style="cursor:pointer;color:#888;font-size:12px;font-weight:600;">📊 Wed Apr 22 Parlay Results — $100 Play: ✗ LOSS (Cade 27pts, missed O28.5) | $1 Chaos: ✗ LOSS (DET won, ORL ML missed)</summary>
        <div style="margin-top:8px;padding:8px;background:rgba(255,255,255,0.03);border-radius:4px;font-size:11px;color:#666;">
          <div><strong>$100 Play (2-Leg ~+170):</strong> ✗ LOSS — Leg 1: Cade O28.5 ✗ (had 27pts, missed by 1.5). Leg 2: Banchero O22.5 ✗ (had 18pts, missed by 4.5). Neither star hit their over — DET's defensive game suppressed individual scoring.</div>
          <div style="margin-top:4px;"><strong>$1 Chaos (3-Leg ~+1450):</strong> ✗ LOSS — Leg 1: ORL ML ✗ (DET won 98-83). Leg 2: PHX +17.5 ✗ (OKC won by 13, PHX covered). Leg 3: Banchero O22.5 ✗ (18pts). ORL ML was the killer — DET dominated.</div>
          <div style="margin-top:4px;"><strong>DET Home Bounce-Back:</strong> ✓ HIT partially — DET ML ✓ but Cade O28.5 ✗ (27pts). <strong>OKC Depth Dominance:</strong> ✓/✗ Split — OKC ML ✓ but ORL +9.5 ✗ (DET won by 15).</div>
        </div>
      </details>

      <!-- ===== PARLAY HISTORY TIMELINE ===== -->
      <div style="margin-top:28px;border-top:1px solid #333;padding-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <div>
            <span style="font-size:15px;font-weight:700;color:#aaa;">Parlay History</span>
            <span style="font-size:11px;color:#666;margin-left:8px;">Featured $100 &amp; $1 picks — running record</span>
          </div>
          <div style="display:flex;gap:12px;font-size:12px;">
            <span style="color:#4caf50;font-weight:700;">$100 Record: 0-6</span>
            <span style="color:#f0c040;font-weight:700;">$1 Record: 2-4</span>
            <span style="color:#aaa;">Net P&amp;L: <span style="color:#f44336;">-$698.47</span></span>
          </div>
        </div>

        <div style="max-height:320px;overflow-y:auto;padding-right:4px;scrollbar-width:thin;scrollbar-color:#444 transparent;">

          <!-- ===== G6 SLATE — Thu Apr 30 (RESULTS) ===== -->
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="min-width:90px;text-align:right;padding-top:2px;">
              <div style="font-size:12px;font-weight:700;color:#aaa;">Thu Apr 30</div>
              <div style="font-size:10px;color:#666;">G6: NYK-ATL, BOS-PHI, DEN-MIN</div>
            </div>
            <div style="width:2px;background:linear-gradient(to bottom,#333,#333);border-radius:1px;position:relative;">
              <div style="position:absolute;top:4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#333;border:2px solid #1a1a2e;"></div>
            </div>
            <div style="flex:1;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid #333;border-radius:8px;padding:10px 14px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:6px;">
                  <span style="font-size:11px;font-weight:700;color:#f0c040;background:rgba(240,192,64,0.12);padding:2px 8px;border-radius:3px;">$100: BOS ML + NYK ML</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;margin-bottom:8px;">BOS ML ✗ (PHI 106-93) | NYK ML ✓ (140-89 blowout) — <span style="color:#f44336;">-$100</span></div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:6px;">
                  <span style="font-size:11px;font-weight:700;color:#a78bfa;background:rgba(167,139,250,0.12);padding:2px 8px;border-radius:3px;">$50: CLE ML + DEN +6.5</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;margin-bottom:8px;">DEN +6.5 ✗ (MIN won 110-98, -12) | CLE pending (G6 May 1) — <span style="color:#f44336;">-$50</span></div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 8px;border-radius:3px;">$1: PHI ML + ATL ML + MIN ML</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;">PHI ML ✓ | ATL ML ✗ (NYK 140-89) | MIN ML ✓ — <span style="color:#f44336;">-$1</span></div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:6px;">
                  <span style="font-size:11px;font-weight:700;color:#a78bfa;background:rgba(167,139,250,0.12);padding:2px 8px;border-radius:3px;">$75: Props Parlay (Embiid + Brunson + Jokic + Mitchell)</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;">Embiid O27.5 ✗ (19pts) | Brunson O27.5 ✗ (17pts) | Jokic O29.5 ✗ (28pts) — <span style="color:#f44336;">-$75</span></div>
              </div>
            </div>
          </div>

          <!-- ===== G3 SLATE — Thu Apr 23 (RESULTS) ===== -->
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="min-width:90px;text-align:right;padding-top:2px;">
              <div style="font-size:12px;font-weight:700;color:#aaa;">Thu Apr 23</div>
              <div style="font-size:10px;color:#666;">G3: DEN-MIN, CLE-TOR, NYK-ATL</div>
            </div>
            <div style="width:2px;background:linear-gradient(to bottom,#333,#333);border-radius:1px;position:relative;">
              <div style="position:absolute;top:4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#333;border:2px solid #1a1a2e;"></div>
            </div>
            <div style="flex:1;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid #333;border-radius:8px;padding:10px 14px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:6px;">
                  <span style="font-size:11px;font-weight:700;color:#f0c040;background:rgba(240,192,64,0.12);padding:2px 8px;border-radius:3px;">$100: Ingram U18.5 + Edwards O23.5 + NYK ML</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;margin-bottom:8px;">Ingram U18.5 ✓ (12pts) | Edwards O23.5 ✗ (17pts, foul trouble 24min) | NYK ML ✗ (ATL won 109-108) — <span style="color:#f44336;">-$100</span></div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 8px;border-radius:3px;">$1: MIN ML + ATL ML + TOR ML (3-team upset)</span>
                  <span style="font-size:11px;font-weight:700;color:#4caf50;background:rgba(76,175,80,0.15);padding:2px 6px;border-radius:3px;">WON +$19.50</span>
                </div>
                <div style="font-size:10px;color:#888;">MIN ML ✓ (113-96) | ATL ML ✓ (109-108) | TOR ML ✓ (126-104) — <span style="color:#4caf50;">ALL HIT! $1 → $19.50</span></div>
              </div>
            </div>
          </div>

          <!-- ===== G5 SLATE — Tue-Wed Apr 28-29 (RESULTS) ===== -->
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="min-width:90px;text-align:right;padding-top:2px;">
              <div style="font-size:12px;font-weight:700;color:#aaa;">Tue-Wed Apr 28-29</div>
              <div style="font-size:10px;color:#666;">G5: All 7 series</div>
            </div>
            <div style="width:2px;background:linear-gradient(to bottom,#333,#333);border-radius:1px;position:relative;">
              <div style="position:absolute;top:4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#333;border:2px solid #1a1a2e;"></div>
            </div>
            <div style="flex:1;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid #333;border-radius:8px;padding:10px 14px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:6px;">
                  <span style="font-size:11px;font-weight:700;color:#f0c040;background:rgba(240,192,64,0.12);padding:2px 8px;border-radius:3px;">$100: BOS ML + SAS ML + Brown O24.5</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;margin-bottom:8px;">BOS ML ✗ (PHI won 113-97) | SAS ML ✓ (114-95) | Brown O24.5 ✗ (BOS lost, Brown limited) — <span style="color:#f44336;">-$100</span></div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 8px;border-radius:3px;">$1: POR ML + PHI ML + TOR ML (3-team elimination)</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;">PHI ML ✓ (113-97) | POR ML ✗ (SAS 114-95) | TOR ML ✗ (CLE 125-120) — <span style="color:#f44336;">-$1</span></div>
              </div>
            </div>
          </div>

          <!-- ===== G4 SLATE — Sun Apr 26 (RESULTS) ===== -->
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="min-width:90px;text-align:right;padding-top:2px;">
              <div style="font-size:12px;font-weight:700;color:#aaa;">Sun Apr 26</div>
              <div style="font-size:10px;color:#666;">G4: CLE-TOR, SAS-POR, BOS-PHI, HOU-LAL</div>
            </div>
            <div style="width:2px;background:linear-gradient(to bottom,#333,#333);border-radius:1px;position:relative;">
              <div style="position:absolute;top:4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#333;border:2px solid #1a1a2e;"></div>
            </div>
            <div style="flex:1;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid #333;border-radius:8px;padding:10px 14px;">
                <div style="font-size:11px;font-weight:700;color:#aaa;margin-bottom:6px;">G4 ML Record: 3/4 (75%) — Model picked TOR ✅, SAS ✅, BOS ✅, LAL ❌ (HOU won)</div>
                <div style="font-size:10px;color:#888;">TOR 93-89 CLE (series 2-2) | SAS 114-93 POR (SAS 3-1) | BOS 128-96 PHI (BOS 3-1) | HOU 115-96 LAL (LAL 3-1)</div>
              </div>
            </div>
          </div>

          <!-- ===== G3 SLATE — Fri Apr 24 (RESULTS) ===== -->
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="min-width:90px;text-align:right;padding-top:2px;">
              <div style="font-size:12px;font-weight:700;color:#aaa;">Fri Apr 24</div>
              <div style="font-size:10px;color:#666;">G3: HOU-LAL, OKC-PHX, SAS-POR, BOS-PHI</div>
            </div>
            <div style="width:2px;background:linear-gradient(to bottom,#333,#333);border-radius:1px;position:relative;">
              <div style="position:absolute;top:4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#333;border:2px solid #1a1a2e;"></div>
            </div>
            <div style="flex:1;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid #333;border-radius:8px;padding:10px 14px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                  <span style="font-size:11px;font-weight:700;color:#f0c040;background:rgba(240,192,64,0.12);padding:2px 8px;border-radius:3px;">$100: Brown O24.5 + LAL +9.5 + Henderson O22.5</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;margin-bottom:6px;">Brown avg 31.0pts, LAL scheme keeps it close, Henderson youth breakout at home (18→31) — <span style="color:#f44336;">-$100</span></div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 8px;border-radius:3px;">$1: PHI ML + LAL ML + POR ML (3-team road upset)</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;">Three road underdogs: Nurse masterclass, Redick scheme travels, Henderson at home if Wemby out — <span style="color:#f44336;">-$1</span></div>
              </div>
            </div>
          </div>

          <!-- ===== APR 22 — RESULTS ===== -->
          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="min-width:90px;text-align:right;padding-top:2px;">
              <div style="font-size:12px;font-weight:700;color:#aaa;">Wed Apr 22</div>
              <div style="font-size:10px;color:#666;">G2: OKC-PHX, DET-ORL</div>
            </div>
            <div style="width:2px;background:linear-gradient(to bottom,#333,#333);border-radius:1px;position:relative;">
              <div style="position:absolute;top:4px;left:-4px;width:10px;height:10px;border-radius:50%;background:#333;border:2px solid #1a1a2e;"></div>
            </div>
            <div style="flex:1;">
              <div style="background:rgba(255,255,255,0.03);border:1px solid #333;border-radius:8px;padding:10px 14px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:6px;">
                  <span style="font-size:11px;font-weight:700;color:#f0c040;background:rgba(240,192,64,0.12);padding:2px 8px;border-radius:3px;">$100: Cade O28.5 + Banchero O22.5</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;margin-bottom:8px;">Cade O28.5 ✗ (27pts) | Banchero O22.5 ✗ (18pts) — <span style="color:#f44336;">-$100</span></div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 8px;border-radius:3px;">$1: ORL ML + PHX +17.5 + Banchero O22.5</span>
                  <span style="font-size:11px;font-weight:700;color:#f44336;background:rgba(244,67,54,0.12);padding:2px 6px;border-radius:3px;">LOST</span>
                </div>
                <div style="font-size:10px;color:#888;">ORL ML ✗ (DET won 98-83) | PHX +17.5 ✓ (OKC won by 13) | Banchero O22.5 ✗ (18pts) — <span style="color:#f44336;">-$1</span></div>
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
    <h3 style="color:#aaa;margin:0 0 4px;">Game 2 Picks — G2 Record: 6/11 (54.5%) | All G2 Complete</h3>
    <p style="color:#666;font-size:12px;margin-bottom:16px;">G2 moneyline record: 6 correct, 5 wrong out of 11 bets (54.5%). All G2 games complete. Best calls: ✅ OKC ML (120-107, exact +13 margin match), ✅ SGA O28.5 (37pts, cleared by 8.5), ✅ DET ML (98-83 blowout), ✅ Cade O7.5ast (11ast). Misses: ✗ OKC -17.5 (won by 13, not 17.5), plus earlier SAS/HOU/BOS/NYK upsets. Key learning: ML bets outperform spread bets when model margin < line by 4+pts. Star bounce-back props (SGA, Cade) are high-conviction plays.</p>

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
        <span style="color:#4caf50;font-size:14px;font-weight:700;">Wed Apr 22 RESULTS | DET-ORL: ✅ DET ML, ✅ Cade O7.5ast | OKC-PHX: ✅ OKC ML, ✅ SGA O28.5, ✗ OKC -17.5 | 4/5 on the night</span>
      </div>

      <!-- OKC-PHX (9:30pm ET) -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">OKC ML vs PHX ✓</div>
        <div class="bet-line">-2100 | Model: OKC 114-101 (+13) | Actual: OKC 120-107 (+13) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: OKC wins 120-107 (+13). Model projected +13 — EXACT MARGIN MATCH.</strong> SGA bounce-back: 37pts (52% FG, 9-9 FT perfect), 9ast — massive improvement from G1's 25pts on 27.8%. Holmgren 19pts/4blk dominated interior. PHX had 21 turnovers (OKC 14 steals). Brooks scored 30pts but team collapsed under pressure. OKC leads 2-0.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">OKC -17.5 vs PHX ✗</div>
        <div class="bet-line">-110 | Model: +13 margin | Actual: +13 (missed by 4.5pts)</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS. OKC won by 13, missing -17.5 by 4.5pts.</strong> Model correctly warned: "+13 model projection means 4.5pt gap — AVOID the spread." The advice was right — ML was the play, not the spread. PHX's Brooks (30pts) and O'Neale (16pts) kept the game close enough to avoid the blowout cover. Lesson confirmed: when model margin < spread by 4+pts, avoid the spread.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">SGA Over 28.5 points ✓</div>
        <div class="bet-line">-130 | Model: 31.5 pts | Actual: 37 pts ✓ (cleared by 8.5!)</div>
        <div class="bet-reasoning"><strong>RESULT: ✓ WIN — SGA had 37pts (model: 31.5, line: 28.5). Cleared by 8.5!</strong> The FG% regression bet PAID OFF: G1's 27.8% → G2's 52.0% (career 47.4%). Full game (38min vs 29min G1) + elite FT floor (9-9 perfect) + 9 assists. This is exactly the bounce-back scenario the model predicted. LEARNING: When a star shoots 28% in a blowout win with reduced minutes, the over is almost always the play in the next game.</div>
        <span class="bet-edge model">Model Edge ✓</span>
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
    <div class="series-bets-header">OKC @ PHX — Game 3 | OKC leads 2-0 — Sat Apr 25 3:30 PM ET</div>
    <div class="series-bets-group">

      <!-- OKC ML -->
      <div class="bet-card best-bet">
        <span class="bet-type ml">MONEYLINE ★ BEST BET</span>
        <div class="bet-pick">OKC ML @ PHX</div>
        <div class="bet-line">-320 | Model: OKC by 8 | HIGH confidence</div>
        <div class="bet-reasoning">OKC dominated G1 (+35) and G2 (+13, model EXACT margin match). SGA's G2 bounce-back (37pts, 52% FG, 9-9 FT) proves he's fully locked in. Holmgren's 19pts/4blk G2 confirms PHX has no interior answer. PHX committed 21 turnovers in G2 (OKC 14 steals) — the defensive pressure scheme is structural and travels to Footprint Center. Daigneault (adj 9) vs Ott (adj 4) is the widest coaching gap in the playoffs. PHX home crowd adds ~2.5pts but can't fix a talent gap this wide when they're 0-2. ML at -320 is the play — avoid the spread (lesson from G2's -17.5 miss).</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- SGA PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">SGA Over 27.5 points</div>
        <div class="bet-line">-115 | Model: ~30 PPG | G2 bounce-back CONFIRMED: 37pts (52% FG, 9-9 FT)</div>
        <div class="bet-reasoning">SGA's G2 bounce-back was massive: 37pts on 52% FG with 9-9 perfect FT and 9 assists. The FG% regression bet from G1 (27.8%) paid off in spectacular fashion — cleared 28.5 by 8.5pts. Now at PHX, expect slight road dip but his floor is elite: G1 25pts (29min, cold shooting) + G2 37pts = 31.0 PPG average. Even at 45% FG (road adjustment), his FT artistry (9-9 G2, 15-17 G1) provides a 28+ floor. Over 27.5 gives solid cushion on a player averaging 31.0 through 2 games. HIGHEST-CONFIDENCE PROP on this slate after G2 confirmation.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- OKC SPREAD — AVOID LESSON -->
      <div class="bet-card">
        <span class="bet-type spread">SPREAD</span>
        <div class="bet-pick">OKC -9.5 @ PHX — CAUTION</div>
        <div class="bet-line">-110 | Model: OKC by 8 | 1.5pt gap AGAINST you</div>
        <div class="bet-reasoning">G2 LESSON APPLIED: OKC -17.5 missed by 4.5pts despite a 13-point win. Model projects OKC by 8 at PHX, but the line is -9.5 — meaning you need OKC to beat the model projection by 1.5pts. PHX at home with 0-2 desperation + Booker's home FG% boost (51% vs 47%) should keep this closer than G1/G2. Brooks' 30pts in G2 shows PHX can score when desperate. RECOMMENDATION: Skip the spread, play ML or SGA prop instead. When model margin < spread, avoid — this was the G2 lesson.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- GREEN YOUTH BREAKOUT PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jalen Green Over 16.5 points</div>
        <div class="bet-line">-110 | YOUTH BREAKOUT (age 22) at home | Phase 29 active</div>
        <div class="bet-reasoning">Green (age 22) is PHX's best youth breakout candidate. Phase 29 multiplier active. G1-G2 at OKC were quiet as part of PHX's overall struggles, but NOW AT HOME at Footprint Center with 0-2 desperation, his athletic scoring could spike. The crowd energy helps young players find rhythm. OKC will still send elite defenders, but desperation + home court + youth breakout persistence creates upside. His ceiling is 25+ if he attacks the rim. Over 16.5 gives room for a breakout home game.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- BOOKER PROP -->
      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Devin Booker Over 24.5 points</div>
        <div class="bet-line">-120 | Home FG% boost (51% vs 47%) | 0-2 desperate | Clutch 7.8</div>
        <div class="bet-reasoning">Booker scored 23pts G1 and was PHX's best player in G2 despite the loss (OKC 120-107). NOW AT HOME down 0-2 — career 51% FG at home vs 47% road. PHX's sole creator in a desperate must-win situation. Clutch rating 7.8 means he'll compete in close stretches. With Brooks' 30pts G2 proving PHX CAN score at OKC, expect Booker to push for 28-32pts at home. Over 24.5 provides cushion for his home shooting boost. Dort will still be primary defender but Booker's shot-making is world-class at home. Desperation games historically boost star usage by 5-10%.</div>
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

    <!-- ===== G4 BETS TAB ===== -->
    <div id="betContent-g4" class="bet-content" style="display:none;">
    <h3 style="color:#aaa;margin:0 0 4px;">Game 4 Results &amp; Game 5 Picks — G4 Record: 3/4 (75%)</h3>
    <p style="color:#666;font-size:12px;margin-bottom:16px;">G4 moneyline record: 3 correct, 1 wrong out of 4 bets (75%). Best calls: Model picked TOR ✅ in G4 upset at home (93-89), BOS ✅ blowout (128-96), SAS ✅ dominant (114-93). Miss: LAL ❌ — HOU finally broke through at home (115-96). G5 predictions below for continuing series.</p>

    <!-- ═══════ G4 RESULTS ═══════ -->
    <div class="bet-section">
      <h4 style="color:#fff;margin:0 0 12px;font-size:15px;border-bottom:1px solid #333;padding-bottom:6px;">G4 Results — Sun Apr 26 | ML Record: ✅ TOR, ✅ SAS, ✅ BOS, ❌ LAL</h4>

      <!-- CLE-TOR G4 -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">TOR ML vs CLE ✓</div>
        <div class="bet-line">+120 | Model picked TOR at home | Actual: TOR 93, CLE 89 (+4) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: TOR wins 93-89. Model picked TOR — CORRECT.</strong> Series now tied 2-2. TOR's home-court advantage proved decisive in a low-scoring, physical G4. Barnes and Barrett led the charge defensively, holding CLE to just 89 points — their lowest of the series. Harden struggled with turnovers again on the road. The model's G3 read on TOR's home-court momentum was validated.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>

      <!-- SAS-POR G4 -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">SAS ML vs POR ✓</div>
        <div class="bet-line">-280 | Model: SAS at home | Actual: SAS 114, POR 93 (+21) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: SAS wins 114-93 (+21). SAS leads 3-1.</strong> SAS dominated at home with a 21-point blowout. POR's youth breakout (Henderson) faded on the road. SAS's interior dominance and home-court advantage proved overwhelming. POR now faces elimination in G5 at San Antonio.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>

      <!-- BOS-PHI G4 -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">BOS ML vs PHI ✓</div>
        <div class="bet-line">-450 | Model: BOS dominant | Actual: BOS 128, PHI 96 (+32) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: BOS wins 128-96 (+32). BOS leads 3-1.</strong> BOS obliterated PHI by 32 points. The 3PT regression the model predicted fully materialized — BOS's shooting normalized while PHI couldn't replicate their G2 3PT explosion. Edgecombe's youth breakout cooled significantly. Mazzulla's adjustments shut down PHI's secondary creation. BOS can close out at home in G5.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>

      <!-- HOU-LAL G4 -->
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">LAL ML @ HOU ✗</div>
        <div class="bet-line">+180 | Model leaned LAL | Actual: HOU 115, LAL 96 (+19) | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS. HOU wins 115-96 (+19). LAL still leads 3-1.</strong> HOU's home-court finally kicked in with a dominant 19-point win. LAL's defensive scheme that held HOU to 39% FG in Games 1-3 cracked at Toyota Center. HOU shot well from 3PT at home and their young core played with maximum urgency facing 0-3. The model's bias toward LAL's scheme being "structural and venue-independent" was proven wrong — home-court matters in elimination scenarios.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>
    </div>

    <!-- ═══════ G5 PREDICTIONS ═══════ -->
    <div class="bet-section">
      <h4 style="color:#4caf50;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">G5 Predictions — Tue-Wed Apr 28-29</h4>

      <!-- ═══ BOS-PHI G5 ═══ -->
      <div style="margin:12px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">BOS-PHI G5 — Tue Apr 28, 7:00 PM ET, ESPN | BOS leads 3-1 — Close-out at home</span>
      </div>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML ★ BEST BET</span>
        <div class="bet-pick">BOS ML vs PHI (Close-out)</div>
        <div class="bet-line">-500 | Model: BOS by 10+ | HIGH confidence</div>
        <div class="bet-reasoning">BOS won G4 by 32 (128-96) and now closes out at home up 3-1. PHI's 3PT regression fully materialized — their G2 49% from 3 was an outlier. BOS's defense has been suffocating: PHI scored 91, 97, and 96 in the 3 losses. Mazzulla has fully schemed for Edgecombe. Brown continues to be unguardable (averaging 31+ PPG). At home in TD Garden with close-out energy, BOS should finish this decisively. Heavy juice but near-certain.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jaylen Brown Over 24.5 points</div>
        <div class="bet-line">-120 | Series avg: 31+ PPG | Close-out game at home</div>
        <div class="bet-reasoning">Brown has been BOS's most consistent performer all series, averaging 31+ PPG. PHI's wing defense (Edgecombe D-LEBRON 0.08) still cannot contain him. In a close-out game at home, expect high usage and aggressive play. Brown O24.5 has hit in every game this series. Highest-confidence prop on the G5 slate.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Tyrese Maxey Over 22.5 points</div>
        <div class="bet-line">-110 | Elimination desperation | PHI's go-to scorer</div>
        <div class="bet-reasoning">Facing elimination, Maxey's usage will be at its peak. He's PHI's best player and will have maximum green light. Desperation games historically boost star usage by 5-10%. Even in a BOS blowout, Maxey will get his 25+ shots. Road game but elimination energy compensates.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- ═══ SAS-POR G5 ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">SAS-POR G5 — Tue Apr 28, 9:30 PM ET, ESPN | SAS leads 3-1 — Close-out at home</span>
      </div>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML ★ BEST BET</span>
        <div class="bet-pick">SAS ML vs POR (Close-out)</div>
        <div class="bet-line">-300 | Model: SAS by 8+ | HIGH confidence</div>
        <div class="bet-reasoning">SAS won G4 by 21 (114-93) and now closes out at home. SAS has dominated this series except the G2 Wemby concussion game and the G3 road loss. At home with full strength and crowd energy, SAS should close this out. POR's Henderson breakout has faded — his G4 was quiet (SAS 114-93 blowout). SAS's interior dominance and home-court make this a high-confidence close-out.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Scoot Henderson Over 18.5 points</div>
        <div class="bet-line">-110 | Elimination desperation | Youth breakout potential</div>
        <div class="bet-reasoning">Henderson's series arc: 18 → 31 → solid → faded in G4 blowout. Facing elimination, expect maximum effort and usage as POR's primary ball-handler. Phase 29 youth breakout persistence still applies at age 21 — desperation + youth = high ceiling. Even in a loss, Henderson should get 20+ shots. Over 18.5 provides cushion for an elimination-game scoring push.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- ═══ CLE-TOR G5 ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">CLE-TOR G5 — Wed Apr 29, 7:30 PM ET, ESPN | Series tied 2-2 — Pivotal G5 @ CLE</span>
      </div>

      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">CLE ML vs TOR (G5 @ Home)</div>
        <div class="bet-line">-200 | Model: CLE by 6 | CLE favored at home, series tied 2-2</div>
        <div class="bet-reasoning">Pivotal G5 with the series tied 2-2. CLE returns home where they won G1 and G2 convincingly (+13, +10). Home-court advantage has been the dominant factor in this series — every home team has won. CLE's 3-initiator system (Mitchell/Harden/Mobley) is at its best in Rocket Mortgage FieldHouse. TOR's G4 win was impressive but built on home-court energy that won't travel. CLE at -200 represents fair value for a team that hasn't lost at home this series.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type spread">SPREAD</span>
        <div class="bet-pick">CLE -4.5 vs TOR</div>
        <div class="bet-line">-110 | Model: CLE by 6 | 1.5pt cushion</div>
        <div class="bet-reasoning">Model projects CLE by 6 at home, giving 1.5pts of cushion over -4.5. CLE has won both home games by 10+ points. TOR's defensive effort in G4 was admirable but CLE's offensive firepower at home should reassert. Series pattern: home team wins by 4+ every game. CLE -4.5 aligns with the trend.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Donovan Mitchell Over 25.5 points</div>
        <div class="bet-line">-115 | Series avg: 28+ PPG at home | Pivotal G5</div>
        <div class="bet-reasoning">Mitchell has been dominant at home through the series. In a pivotal G5 tied 2-2, expect maximum effort and usage from CLE's alpha scorer. His playoff pedigree (multiple 40+ point playoff games) and home-court comfort make 26+ highly likely. TOR's perimeter defense has been solid but Mitchell's shot creation is elite in high-leverage spots.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Scottie Barnes Over 22.5 points</div>
        <div class="bet-line">-110 | Trending up: 21→26→33→G4 leader | Must-match energy</div>
        <div class="bet-reasoning">Barnes has been TOR's most reliable scorer, trending sharply upward through the series (21→26→33pts). Even on the road at CLE, Barnes' physicality and versatile scoring translate. In a tied series with both teams desperate, Barnes will have maximum green light as TOR's alpha. His playmaking (averaging 6+ assists) creates secondary scoring even when shots are tough. Over 22.5 gives cushion for a road game adjustment while respecting his upward trajectory.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- ═══ HOU-LAL G5 RESULT ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#f44336;font-size:13px;font-weight:700;">HOU-LAL G5 — Wed Apr 29 | HOU 99-93 | Model ❌ (picked LAL)</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">LAL ML @ HOU ✗</div>
        <div class="bet-line">-150 | Model leaned LAL | Actual: HOU 99, LAL 93 (+6) | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS. HOU wins 99-93. LAL leads 3-2.</strong> Smith Jr 22pts (4-9 3PT) led HOU's gutsy elimination survival. Reaves returned but was rusty (22pts, 4-16 FG, 12-13 FT). LeBron 25pts but 0-6 3PT. Smart 6 TOs. HOU's home court proved decisive again — undefeated at Toyota Center. Model overweighted LAL's close-out ability on the road. <strong>G6 UPDATE: Reaves' 2nd game back should show improved efficiency (rating 68→74), shifting G6 back toward LAL lean.</strong></div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>

    </div>

    </div><!-- end betContent-g4 -->

    <!-- ===== G5 TAB ===== -->
    <div id="betContent-g5" class="bet-content" style="display:none;">
    <h3 style="color:#aaa;margin:0 0 4px;">Game 5 Results &amp; Game 6 Picks — G5 Record: 5/7 (71.4%)</h3>
    <p style="color:#666;font-size:12px;margin-bottom:16px;">G5 moneyline record: 5 correct, 2 wrong out of 7 bets (71.4%). Best calls: DET ✅ (Cade 45pts masterpiece), CLE ✅ (closed Q4 25-17), DEN ✅ (Jokic triple-double). Misses: BOS ❌ (Embiid 33pt eruption, BOS Q4 collapse 11pts on 3-22 FG), HOU-LAL ❌ (Smith Jr 22pts, LeBron 0-6 3PT). SAS clinched 4-1.</p>

    <!-- ═══════ G5 RESULTS — TUE APR 28 ═══════ -->
    <div class="bet-section">
      <h4 style="color:#fff;margin:0 0 12px;font-size:15px;border-bottom:1px solid #333;padding-bottom:6px;">G5 Results — Tue Apr 28 | ML Record: ❌ BOS, ✅ NYK, ✅ SAS (series clinch)</h4>

      <!-- BOS-PHI G5 -->
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">BOS ML vs PHI ✗</div>
        <div class="bet-line">-500 | Model: BOS close-out | Actual: PHI 113, BOS 97 (+16) | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS. PHI wins 113-97. BOS leads 3-2.</strong> Embiid erupted for 33pts (only 2 in Q1 then 31 in final 3Q). BOS collapsed in Q4: 11pts on 3-22 FG — one of the worst close-out chokes in recent memory. Maxey added 25/10/5, George 16/9/7, Grimes 18 off bench. PHI's elimination desperation + Embiid's star elevation was massively underweighted by the model.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>

      <!-- NYK-ATL G5 -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">NYK ML vs ATL ✓</div>
        <div class="bet-line">-220 | Model: NYK dominant | Actual: NYK 126, ATL 97 (+29) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: NYK wins 126-97 (+29). NYK leads 3-2.</strong> Brunson went nuclear: 39pts on 15-23 FG (65.2%). McCollum was completely schemed out — 6pts on 3-10 FG. NYK shot 57% FG as a team. The model's read on NYK's offensive ceiling was perfectly validated. ATL had no answer for Brunson's mid-range mastery.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>

      <!-- SAS-POR G5 -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">SAS ML vs POR ✓ — SERIES CLINCH 4-1</div>
        <div class="bet-line">-300 | Model: SAS close-out | Actual: SAS 114, POR 95 (+19) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: SAS wins 114-95 (+19). SAS WINS SERIES 4-1.</strong> Wembanyama 17/14reb/6blk dominated the paint. Fox 21/9ast ran the offense. Champagnie 5-7 3PT provided spacing. Model prediction of SAS 116-99 was nearly perfect (actual 114-95). POR's youth breakout fully faded on the road. First series completed in R1.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>
    </div>

    <!-- ═══════ G5 RESULTS — WED APR 29 ═══════ -->
    <div class="bet-section">
      <h4 style="color:#fff;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #333;padding-bottom:6px;">G5 Results — Wed Apr 29 | ML Record: ✅ DET, ✅ CLE, ❌ HOU-LAL, ✅ DEN</h4>

      <!-- DET-ORL G5 -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DET ML @ ORL ✓</div>
        <div class="bet-line">+130 | Model: DET medium | Actual: DET 116, ORL 109 (+7) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: DET wins 116-109. ORL leads 3-2.</strong> Historic 45-45 dual scoring duel — Cade Cunningham 45pts (14-14 FT) vs Paolo Banchero 45/9/7. Wagner DNP (calf) elevated Banchero to carry mode but also removed ORL's secondary creation. Ausar Thompson 15reb/6ast/5stl/2blk was the X-factor. Harris added 23pts as a reliable second scorer. DET's desperation energy overwhelmed ORL late.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>

      <!-- CLE-TOR G5 -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">CLE ML vs TOR ✓</div>
        <div class="bet-line">-200 | Model: CLE by 6 | Actual: CLE 125, TOR 120 (+5) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: CLE wins 125-120. CLE leads 3-2.</strong> Shooting regression normalized — both teams shot efficiently after G4's nightmare percentages. Harden 23/9reb, Barrett 25/12reb. CLE won Q4 25-17 via defensive tightening when it mattered most. Model's home-court read validated again — CLE remains unbeaten at home. TOR Q4 collapse (17pts) raises road closing concerns.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>

      <!-- HOU-LAL G5 -->
      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">LAL ML @ HOU ✗</div>
        <div class="bet-line">-150 | Model leaned LAL | Actual: HOU 99, LAL 93 (+6) | LOSS</div>
        <div class="bet-reasoning"><strong>RESULT: ✗ LOSS. HOU wins 99-93. LAL leads 3-2.</strong> Smith Jr 22pts (4-9 3PT) led HOU's gutsy elimination survival. Reaves returned but was inefficient (22pts on 4-16 FG, FT-merchant 12-13 FT). LeBron had 25pts but went 0-6 from 3PT. Smart had 6 TOs. Ayton dominated the boards with 18pts/17reb. Model overweighted LAL's road close-out ability — HOU's desperation at Toyota Center proved too much.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">LOSS</span>
      </div>

      <!-- DEN-MIN G5 -->
      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DEN ML @ MIN ✓</div>
        <div class="bet-line">+200 | Model engine: DEN | Actual: DEN 125, MIN 113 (+12) ✓</div>
        <div class="bet-reasoning"><strong>RESULT: DEN wins 125-113. MIN leads 3-2.</strong> Jokic triple-double 27/16ast/12reb orchestrated DEN's survival. Spencer Jones 20pts (Star Absence Liberation effect — Murray/Porter out elevated role players). MIN had 25 turnovers without Edwards (suspension) and DiVincenzo (illness). DEN exploited MIN's chaos ruthlessly. Model engine correctly read DEN's desperation + MIN's absences.</div>
        <span class="bet-edge model">Model Edge ✓</span>
      </div>
    </div>

    </div><!-- end betContent-g5 -->

    <!-- ===== G6 BETS TAB ===== -->
    <div id="betContent-g6" class="bet-content" style="display:none;">
    <h3 style="color:#aaa;margin:0 0 4px;">Game 6 Picks &amp; Results — G6 Record: 3/6 (50%)</h3>
    <p style="color:#666;font-size:12px;margin-bottom:16px;">G6 results (Thu Apr 30): NYK ✅ 140-89 (series 4-2), PHI ✅ 106-93 (model ❌), MIN ✅ 110-98 (model ❌). G6 results (Fri May 1): LAL ✅ 98-78 (model ✅ series 4-2), DET ✅ 93-79 (model ✅ series 3-3), TOR ✅ 112-110 OT (model ❌ series 3-3). G6 ML Record: 3/6 (50%). Cumulative: 25/44 (56.8%).</p>

    <!-- ═══════ G6 THU APR 30 ═══════ -->
    <div class="bet-section">
      <h4 style="color:#4caf50;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">G6 Results — Thu Apr 30 | NYK ✅ (4-2), BOS ❌ (3-3→G7), DEN ❌ (2-4 eliminated)</h4>

      <!-- ═══ NYK-ATL G6 ═══ -->
      <div style="margin:12px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">NYK-ATL G6 — Thu Apr 30 | NYK leads 3-2 — Close-out @ ATL</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML ★ BEST BET</span>
        <div class="bet-pick">NYK ML @ ATL ✓ — SERIES WON 4-2</div>
        <div class="bet-line">-155 | NYK -2.5 | Model: NYK by 4 | Actual: NYK 140, ATL 89 (+51) ✓ | <span style="color:#4caf50;">Ensemble: NYK 61%</span> — Systems agree</div>
        <div class="bet-reasoning"><strong>✅ CORRECT — NYK 140, ATL 89.</strong> Historic 51-point blowout — largest halftime lead in NBA playoff history. Anunoby 29pts (11-14 FG), Bridges 24pts (10-12 FG), Brunson 17pts/8ast, KAT triple-double 12/11reb/10ast. NYK shot 59% FG. ATL collapsed: 19 TOs, Daniels ejected. NYK advances to Round 2.</div>
        <span class="bet-edge model">Model + Sim ✓</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jalen Brunson Over 27.5 points ✗ — 17pts (6-12 FG)</div>
        <div class="bet-line">-115 | G5: 39pts (15-23 FG) | Series avg: 31.2pts | <span style="color:#f44336;">Actual: 17pts ❌</span></div>
        <div class="bet-reasoning"><strong>❌ UNDER — Brunson 17pts (6-12 FG, 1-6 3PT).</strong> In a 51-point blowout, Brunson only played 30min and didn't need to force. Anunoby (29pts) and Bridges (24pts) carried the scoring. When the game is a blowout, star usage drops — the model's "close-out aggression" thesis was correct but the blowout magnitude made it irrelevant. LESSON: player props are voided by extreme blowouts.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">CJ McCollum Under 18.5 points ✓ — 11pts (4-13 FG)</div>
        <div class="bet-line">-110 | G5: 6pts (3-10 FG) | <span style="color:#4caf50;">Actual: 11pts ✅</span></div>
        <div class="bet-reasoning"><strong>✅ CORRECT — McCollum 11pts (4-13 FG, 1-4 3PT, -24).</strong> Brown's defensive scheme continued to neutralize McCollum. He shot 30.8% FG in a game where ATL's entire offense collapsed. The defensive scheme lock thesis has been the single most reliable bet of this series — McCollum averaged just 10pts over the last 3 games after his 32pt G2 outlier.</div>
        <span class="bet-edge" style="background:#4caf50;color:#fff;">Model ✓</span>
      </div>

      <!-- ═══ BOS-PHI G6 ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">BOS-PHI G6 — Thu Apr 30 | BOS leads 3-2 — Close-out @ PHI</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">BOS ML @ PHI ✗</div>
        <div class="bet-line">-230 | BOS -6.5 | Model: BOS by 4 | Actual: PHI 106, BOS 93 | Series tied 3-3 → G7 | <span style="color:#f44336;">Model ❌</span></div>
        <div class="bet-reasoning"><strong>❌ WRONG — PHI 106, BOS 93.</strong> Maxey 30pts (11-22 FG, 0 TOs), George 23pts (5-9 3PT), Embiid 19/10/8. BOS shot 42% FG but only 29% 3PT (12-41). PHI's Q2 explosion (38pts) broke the game open. BOS's 3PT shooting collapsed AGAIN. Series tied 3-3 heading to G7 at Boston.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Joel Embiid Over 27.5 points ✗ — 19pts (6-18 FG)</div>
        <div class="bet-line">-112 | G5: 33pts | <span style="color:#f44336;">Actual: 19pts ❌</span></div>
        <div class="bet-reasoning"><strong>❌ UNDER — Embiid 19pts (6-18 FG, 1-5 3PT).</strong> Embiid shifted to facilitator mode: 10reb, 8ast, only 1 TO. He didn't need to force scoring because Maxey (30pts) and George (23pts) carried the offense. The model assumed "elimination monster" would mean high scoring, but Embiid chose efficiency and playmaking over volume. PHI won by 13 without Embiid needing 30+. LESSON: Star Elevation doesn't always mean scoring — sometimes it means facilitating.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jayson Tatum Over 24.5 points ✗ — 17pts (6-13 FG)</div>
        <div class="bet-line">-110 | Series avg: 26.8pts | <span style="color:#f44336;">Actual: 17pts ❌</span></div>
        <div class="bet-reasoning"><strong>❌ UNDER — Tatum 17pts (6-13 FG, 2-6 3PT, -11).</strong> The "bounce-back" narrative failed entirely. Tatum was passive and inefficient on the road. PHI's defense forced uncomfortable shots and Tatum's 29 minutes were limited by the game getting away from BOS early. BOS's entire offense went cold (42% FG, 29% 3PT). The model's "championship DNA responds to adversity" thesis was wrong — Tatum looked defeated, not motivated.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>

      <!-- ═══ DEN-MIN G6 ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">DEN-MIN G6 — Thu Apr 30 | MIN leads 3-2 — DEN faces elimination @ MIN</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DEN ML vs MIN ✗ — MIN WINS SERIES 4-2</div>
        <div class="bet-line">-258 | DEN -6.5 | Ensemble: DEN by 4 | Actual: MIN 110, DEN 98 | LOSS | <span style="color:#f44336;">Model ❌</span></div>
        <div class="bet-reasoning"><strong>❌ WRONG — MIN 110, DEN 98.</strong> MIN WINS SERIES 4-2. MIN closed out without Edwards and DiVincenzo — team effort overwhelmed Jokic (28pts). The model badly underestimated MIN's depth and collective will without their stars. DEN eliminated despite Jokic's brilliance. The ensemble's 61% DEN probability was the biggest miss of G6.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Nikola Jokic Over 29.5 points ✗ — 28pts (11-19 FG)</div>
        <div class="bet-line">-104 | G5: 27pts triple-double | <span style="color:#f44336;">Actual: 28pts ❌ (missed by 1.5)</span></div>
        <div class="bet-reasoning"><strong>❌ UNDER — Jokic 28pts (11-19 FG, 1-5 3PT, 9reb, 10ast, -9).</strong> Jokic was brilliant individually (near triple-double) but missed the 29.5 line by 1.5pts. His scoring was efficient (58% FG) but MIN's rebounding dominance (50-33) limited second-chance opportunities. Jokic was -9 despite great individual stats — the model correctly identified his quality but the line was just too high. Murray's 4-17 collapse meant Jokic couldn't get easy assists-to-scores.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Nikola Jokic Over 9.5 assists ✓ — 10ast</div>
        <div class="bet-line">-148 | G5: 16 assists | <span style="color:#4caf50;">Actual: 10ast ✅ (barely over)</span></div>
        <div class="bet-reasoning"><strong>✅ CORRECT — Jokic 10ast (just over 9.5).</strong> Jokic's playmaking remained elite even in an elimination loss. His 10 assists on 11-19 FG showed he was finding teammates, but Murray's 4-17 shooting meant many of those looks didn't convert to buckets. The 9.5 line was the right play — Jokic averaged 12+ assists over G5-G6. His orchestrator mode is the most bankable prop in the series.</div>
        <span class="bet-edge" style="background:#4caf50;color:#fff;">Model ✓</span>
      </div>
    </div>

    <!-- ═══════ G6 FRI MAY 1 ═══════ -->
    <div class="bet-section">
      <h4 style="color:#4caf50;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">G6 Results — Fri May 1 | DET ✅ (3-3→G7), TOR ✅ upset (3-3→G7), LAL ✅ (4-2 series won)</h4>

      <!-- ═══ DET-ORL G6 ═══ -->
      <div style="margin:12px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">DET-ORL G6 — Fri May 1 | ORL led 3-2 — DET won @ ORL to force G7</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DET ML @ ORL ✓ — DET 93-79 (series tied 3-3)</div>
        <div class="bet-line">DET -3.5 (-160) | Model: DET by 6 | Actual: DET 93, ORL 79 (+14) ✓ | <span style="color:#4caf50;">Model ✅ — correct winner</span></div>
        <div class="bet-reasoning"><strong>✅ CORRECT — DET 93-79.</strong> Cade 32/10/3/4stl dominated. Banchero collapsed to 4-20 FG (0-9 3PT). Ausar Thompson was a defensive force (10reb/6ast/4blk). DET's defense held ORL to 79pts (series low). The model's coin-flip framing was too conservative — DET was clearly the better team on the night. Wagner's absence (calf) proved decisive as predicted.</div>
        <span class="bet-edge" style="background:#4caf50;color:#fff;">Model ✓</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Cade Cunningham Over 30.5 points ✓ — 32pts (10-23 FG, 10-12 FT)</div>
        <div class="bet-line">-105 | G5: 45pts | <span style="color:#4caf50;">Actual: 32pts ✅</span></div>
        <div class="bet-reasoning"><strong>✅ CORRECT — Cade 32pts (10-23 FG, 2-4 3PT, 10-12 FT).</strong> Cade delivered again in elimination mode. His FT mastery (10-12) was the scoring floor as predicted. The 30.5 line was too low for a player averaging 38.5pts in elimination games. His 4 steals showed defensive intensity too.</div>
        <span class="bet-edge" style="background:#4caf50;color:#fff;">Model ✓</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Paolo Banchero Over 28.5 points ✗ — 17pts (4-20 FG, 0-9 3PT)</div>
        <div class="bet-line">-110 | G5: 45pts | <span style="color:#f44336;">Actual: 17pts ❌ (career-worst)</span></div>
        <div class="bet-reasoning"><strong>❌ WRONG — Banchero 17pts (4-20 FG, 0-9 3PT, 9-12 FT).</strong> HISTORIC collapse. The model assumed "solo star at home = high volume scoring" but DET's defense (especially Ausar Thompson's 4blk) completely shut Banchero down. His 0-9 from 3PT was the worst single-game 3PT performance of his career. LESSON: star volume doesn't guarantee scoring — elite defense can shut down anyone.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>

      <!-- ═══ CLE-TOR G6 ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">CLE-TOR G6 — Fri May 1 | CLE led 3-2 — TOR won 112-110 OT (series 3-3)</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #f44336;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">CLE ML @ TOR ✗ — TOR 112-110 OT</div>
        <div class="bet-line">-200 | CLE -4.5 | Model: CLE by 6 | Actual: TOR 112, CLE 110 OT | <span style="color:#f44336;">Model ❌</span></div>
        <div class="bet-reasoning"><strong>❌ WRONG — TOR 112-110 OT.</strong> Barnes' facilitator mode (25pts/14ast career-high) transformed TOR's offense. Walter's breakout (24pts, 4-9 3PT) gave TOR a legitimate #2 scorer. CLE's bench disappeared (14pts vs 36pts G5) and Harden's 4 TOs in a 2-point OT game were fatal. The model's 64% CLE probability was wrong — TOR's Scotiabank home court was worth more than projected (now 3-0 at home this series).</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Donovan Mitchell Over 24.5 points ✗ — 24pts (11-26 FG, 2-10 3PT)</div>
        <div class="bet-line">-115 | Series avg: 27.4pts | <span style="color:#f44336;">Actual: 24pts ❌ (missed by 0.5)</span></div>
        <div class="bet-reasoning"><strong>❌ UNDER — Mitchell 24pts (11-26 FG, 2-10 3PT).</strong> Missed by just 0.5pts. Mitchell's 3PT shooting at Scotiabank continues to be suppressed (5-26, 19.2% in last 3 games). His volume was high (26 shots) but efficiency suffered on the road. Venue-adjusted 3PT projections would have flagged this.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Scottie Barnes Over 22.5 points ✓ — 25pts (11-21 FG, 14ast)</div>
        <div class="bet-line">-110 | Home elimination | <span style="color:#4caf50;">Actual: 25pts ✅ + 14ast career-high</span></div>
        <div class="bet-reasoning"><strong>✅ CORRECT — Barnes 25pts (11-21 FG, 0-2 3PT, 3-4 FT) + 14ast.</strong> Barnes exceeded the scoring line AND added a historic 14-assist performance. At Scotiabank he's been electric all series. The model correctly identified his home elimination ceiling — but even underestimated his facilitator impact. Barnes is TOR's alpha.</div>
        <span class="bet-edge" style="background:#4caf50;color:#fff;">Model ✓</span>
      </div>

      <!-- ═══ HOU-LAL G6 ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">HOU-LAL G6 — Fri May 1 | LAL led 3-2 — LAL won 98-78 (SERIES WON 4-2)</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">LAL ML @ HOU ✓ — LAL 98-78 (SERIES WON 4-2)</div>
        <div class="bet-line">+140 | HOU -3.5 | Model: LAL by 2 | Actual: LAL 98, HOU 78 (+20) ✓ | <span style="color:#4caf50;">Model ✅</span></div>
        <div class="bet-reasoning"><strong>✅ CORRECT — LAL 98-78.</strong> The model's LAL lean was vindicated in spectacular fashion. LeBron 28pts (10-25 FG) controlled the game. Hachimura's 5-7 3PT breakout was the dagger. Reaves returned to form at 7-14 FG (50%). Sheppard collapsed to 4-19 FG (21%). HOU's home court advantage evaporated in a closeout — Toyota Center's magic ended when it mattered most. LAL +140 was VALUE — the market had HOU favored at -180 but LAL was clearly the superior team.</div>
        <span class="bet-edge" style="background:#4caf50;color:#fff;">Model ✓</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">LeBron James Over 25.5 points ✓ — 28pts (10-25 FG, 2-5 3PT)</div>
        <div class="bet-line">-110 | G5: 25pts | <span style="color:#4caf50;">Actual: 28pts ✅</span></div>
        <div class="bet-reasoning"><strong>✅ CORRECT — LeBron 28pts (10-25 FG, 2-5 3PT, 6-8 FT).</strong> Vintage playoff LeBron in a close-out game. He hit 2 threes (improving from 0-6 G5) and attacked the basket with purpose. The 25.5 line was too low for a close-out game from a player with 4 championships. His 8 assists showed he was still creating for others while scoring 28.</div>
        <span class="bet-edge" style="background:#4caf50;color:#fff;">Model ✓</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Austin Reaves Over 18.5 points ✗ — 15pts (7-14 FG)</div>
        <div class="bet-line">-105 | G5: 22pts | <span style="color:#f44336;">Actual: 15pts ❌</span></div>
        <div class="bet-reasoning"><strong>❌ UNDER — Reaves 15pts (7-14 FG, 50%).</strong> Reaves' efficiency improved dramatically (50% FG vs 25% G5) as the model predicted, but his volume dropped in a blowout. He only took 14 shots because LAL was dominating and didn't need him to force. His 3 blocks showed defensive impact. LESSON: In blowouts, secondary scorers' volume drops even if efficiency improves.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jabari Smith Jr Over 12.5 points ✗ — 9pts (3-11 FG)</div>
        <div class="bet-line">+105 | G5: 22pts | <span style="color:#f44336;">Actual: 9pts ❌</span></div>
        <div class="bet-reasoning"><strong>❌ UNDER — Smith Jr 9pts (3-11 FG, 1-6 3PT).</strong> Smith Jr's G5 breakout (22pts) didn't carry over. LAL's defensive scheme clamped down and the blowout margin meant HOU's role players never found rhythm. Smith Jr DNP'd in G6 per some rotational decisions. The "emerging X-factor" thesis was a one-game anomaly.</div>
        <span class="bet-edge" style="background:#f44336;color:#fff;">Model ✗</span>
      </div>
    </div>

    <!-- ═══════ G6 FEATURED PARLAY ═══════ -->
    <div class="bet-section">
      <h4 style="color:#a78bfa;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #a78bfa;padding-bottom:6px;">G6 Player Props Parlay — High Confidence</h4>

      <div class="parlay-card headline" style="border:1px solid #a78bfa;">
        <div class="parlay-header">
          <span class="parlay-name" style="font-size:16px;color:#f44336;">G6 $75 Player Props Special — Star Elevation (4-Leg) ❌ LOST</span>
          <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+1200 | -$75</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
          <span style="font-size:11px;color:#a78bfa;background:rgba(167,139,250,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$75 &rarr; ~$975 return</span>
          <span style="font-size:11px;color:#4caf50;background:rgba(76,175,80,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">Thu-Fri Apr 30 - May 1</span>
          <span style="font-size:10px;color:#ff9800;background:rgba(255,152,0,0.12);padding:3px 8px;border-radius:4px;font-weight:600;">All HIGH confidence props</span>
        </div>
        <div class="parlay-legs">
          <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
            <span class="parlay-leg-num">1</span>
            <span class="parlay-leg-pick">Embiid O27.5pts (BOS-PHI G6) — ❌ 19pts (6-18 FG)</span>
            <span class="parlay-leg-odds">-112</span>
            <span class="parlay-leg-conf" style="background:#5a2d2d;color:#f44336;">MISS</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #f44336;">
            <span class="parlay-leg-num">2</span>
            <span class="parlay-leg-pick">Brunson O27.5pts (NYK-ATL G6) — ❌ 17pts (6-12 FG, blowout)</span>
            <span class="parlay-leg-odds">-115</span>
            <span class="parlay-leg-conf" style="background:#5a2d2d;color:#f44336;">MISS</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #f44336;">
            <span class="parlay-leg-num">3</span>
            <span class="parlay-leg-pick">Jokic O29.5pts (DEN-MIN G6) — ❌ 28pts (11-19 FG, missed by 1.5)</span>
            <span class="parlay-leg-odds">-104</span>
            <span class="parlay-leg-conf" style="background:#5a2d2d;color:#f44336;">MISS</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #888;">
            <span class="parlay-leg-num">4</span>
            <span class="parlay-leg-pick">Mitchell O24.5pts (CLE-TOR G6) — Parlay dead (3 legs missed)</span>
            <span class="parlay-leg-odds">-115</span>
            <span class="parlay-leg-conf" style="background:#333;color:#888;">VOID</span>
          </div>
        </div>
        <div class="parlay-reasoning" style="border-left-color:#a78bfa;"><strong>❌ LOST — All 3 Thursday legs missed.</strong> The Star Elevation Parlay was a complete bust. Embiid (19pts) chose facilitator mode over scoring. Brunson (17pts) coasted in a 51-point blowout. Jokic (28pts) missed by just 1.5. The fundamental flaw: "Star Elevation = high scoring" is wrong. Stars elevate in DIFFERENT ways — Embiid elevated through playmaking (8ast), Brunson through efficiency (not volume), Jokic through assists (10ast). The model needs to decouple "star elevation" from "scoring volume." Props record for G6 Thu: 2/6 (33.3%) — only McCollum Under and Jokic assists hit.</div>
      </div>
    </div>

    </div><!-- end betContent-g6 -->

    <!-- ===== G7 BETS TAB ===== -->
    <div id="betContent-g7" class="bet-content" style="display:none;">
    <h3 style="color:#aaa;margin:0 0 4px;">Game 7 — BOS-PHI (May 2), DET-ORL (May 3), CLE-TOR (May 3)</h3>
    <p style="color:#666;font-size:12px;margin-bottom:16px;">G7 Override: +5 HCA (home teams win ~78% of Game 7s historically). Three G7s this weekend — BOS tonight, DET and CLE tomorrow. All 3 home teams are heavy favorites.</p>

    <div class="bet-section">
      <h4 style="color:#4caf50;margin:0 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">BOS-PHI Game 7 — Sat May 2, 7:30 PM ET @ TD Garden</h4>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML ★ BEST BET</span>
        <div class="bet-pick">BOS ML vs PHI (G7 at home)</div>
        <div class="bet-line">-200 | BOS -4.5 | Model: BOS by 5 | <span style="color:#4caf50;">G7 OVERRIDE: +5 HCA — Home teams win 78%</span></div>
        <div class="bet-reasoning"><strong>G7 OVERRIDE is the strongest single-game signal in the model.</strong> Home teams have won ~78% of Game 7s historically. BOS has championship DNA (2024), TD Garden will be hostile, and Tatum/Brown have been in this exact spot before. PHI has won two straight elimination games (G5: Embiid 33pts, G6: Embiid 19pts) but road G7s are a different animal. BOS's talent edge (Tatum+Brown+Pritchard vs Embiid+Maxey) is amplified by crowd energy. The model projects BOS 108-103 with medium confidence. Embiid's elimination heroics prove he elevates in must-win games, but G7 at BOS is the toughest close-out in basketball.</div>
        <span class="bet-edge model">G7 Override + Model</span>
      </div>

      <div class="bet-card">
        <span class="bet-type spread">SPREAD</span>
        <div class="bet-pick">BOS -4.5 vs PHI</div>
        <div class="bet-line">-110 | Model: BOS by 5 | 0.5pt cushion</div>
        <div class="bet-reasoning">Model projects BOS by 5 with the G7 Override, giving just 0.5pts of cushion on -4.5. The G7 Override generates BOS dominance at home, but Embiid's elimination-game elevation (26pts avg in elim games) is a real counter. Tight spread — ML is safer unless you're very confident in the G7 HCA effect.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Joel Embiid Over 27.5 points</div>
        <div class="bet-line">-115 | G5: 33pts, G6: 19pts | Elimination heroics</div>
        <div class="bet-reasoning">Embiid has elevated in elimination games: 33pts G5, 19pts G6 (PHI won both). His physicality in the post is unguardable in a Game 7 atmosphere. The 27.5 line respects his G5 ceiling — his 26pts avg in elimination games and G7 desperation amplifies everything. Road game concerns are offset by his proven big-game elevation.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jaylen Brown Over 24.5 points</div>
        <div class="bet-line">-120 | Series avg: 28+ PPG | G7 at home — legacy game</div>
        <div class="bet-reasoning">Brown has been BOS's most consistent scorer all series (28+ PPG avg). In a Game 7 at home, expect maximum effort. PHI's wing defense still can't contain his athleticism and finishing. Brown O24.5 has hit in nearly every game this series. Championship-level players show up in G7.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jayson Tatum Over 24.5 points</div>
        <div class="bet-line">-110 | G7 redemption arc | Series avg: 26.8pts</div>
        <div class="bet-reasoning">Tatum was part of BOS's Q4 collapse in G5 and has been inconsistent this series. But G7 at home is the ultimate stage for redemption. Championship players respond to adversity, and TD Garden energy lifts Tatum. His series average is 26.8pts — expect him at or above that in the biggest game of the season. The 24.5 line gives 2.3pts of cushion.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Tyrese Maxey Over 22.5 points</div>
        <div class="bet-line">-110 | G6: 25/10/5 | PHI's engine alongside Embiid</div>
        <div class="bet-reasoning">Maxey has been brilliant alongside Embiid in elimination games — 25/10/5 in G6. In G7, he'll have maximum green light as PHI's #2 option. Road game hurts slightly, but Maxey's speed and shot creation travel. His floor is 20pts given his usage, making 22.5 very beatable.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
    </div>

    <!-- ═══════ DET-ORL G7 ═══════ -->
    <div class="bet-section">
      <h4 style="color:#4caf50;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">DET-ORL Game 7 — Sun May 3, 3:30 PM ET @ Little Caesars Arena</h4>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML ★ BEST BET</span>
        <div class="bet-pick">DET ML vs ORL (G7 at home)</div>
        <div class="bet-line">-298 | DET -7.5 | Model: DET by 12 | <span style="color:#4caf50;">HIGH — G7 Override + Cade elimination mode + Wagner OUT</span></div>
        <div class="bet-reasoning"><strong>DET is the model's strongest G7 pick.</strong> Cade Cunningham has averaged 38.5pts in elimination games (G5: 45, G6: 32) and is playing career-best basketball. Harris (22/10 G6) provides reliable secondary scoring. LCA crowd will be volcanic. ORL's Banchero collapsed to 4-20 FG (0-9 3PT) in G6 — worst career game — and faces a hostile road environment. Wagner STILL OUT (calf). ORL is a single-initiator team that can be shut down when Banchero is locked up. Ausar Thompson's 4-block G6 defensive masterclass gives DET a scheme advantage. DET at -298 implies 75% — the model agrees at 75%.</div>
        <span class="bet-edge model">G7 Override + Model</span>
      </div>

      <div class="bet-card">
        <span class="bet-type spread">SPREAD</span>
        <div class="bet-pick">DET -7.5 vs ORL</div>
        <div class="bet-line">-110 | Model: DET by 12 | 4.5pts cushion</div>
        <div class="bet-reasoning">Model projects DET by 12 (106-94), giving 4.5pts of cushion on -7.5. DET won G2 at LCA by 15 (98-83) and G6 on the road by 14 (93-79). The defense has held ORL below 80 and 83 in the two biggest DET wins. With G7 home crowd energy and Wagner out, a double-digit win is the most likely outcome.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Cade Cunningham Over 30.5 points</div>
        <div class="bet-line">-110 | G5: 45pts, G6: 32pts | G7 at home = maximum effort</div>
        <div class="bet-reasoning">Cade has scored 32+ in 3 of the last 4 games (39 G1, 45 G5, 32 G6). In a G7 at home, expect his absolute ceiling. His FT mastery (10-12 G6, 14-14 G5) provides a scoring floor even if shots don't fall. LCA crowd energy amplifies his aggression. 30.5 is too low for a player averaging 38.5pts in elimination games.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Paolo Banchero Under 24.5 points</div>
        <div class="bet-line">-110 | G6: 17pts (4-20 FG) | DET defense has his number</div>
        <div class="bet-reasoning">Banchero has been held under 25pts in 4 of 6 games this series. His G6 collapse (4-20 FG, 0-9 3PT) was career-worst and the mental damage of facing a hostile LCA crowd after that performance is real. DET's defense (especially Ausar Thompson) has a proven scheme to shut him down. Without Wagner, there's no secondary creator to take pressure off. Even a bounce-back (35% FG) only gets him to ~22pts.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
    </div>

    <!-- ═══════ CLE-TOR G7 ═══════ -->
    <div class="bet-section">
      <h4 style="color:#4caf50;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">CLE-TOR Game 7 — Sun May 3, 7:30 PM ET @ Rocket Mortgage FieldHouse</h4>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML ★ BEST BET</span>
        <div class="bet-pick">CLE ML vs TOR (G7 at home)</div>
        <div class="bet-line">-333 | CLE -8.5 | Model: CLE by 8 | <span style="color:#4caf50;">MED — G7 Override + CLE 3-0 at home + talent surplus</span></div>
        <div class="bet-reasoning"><strong>CLE is 3-0 at Rocket Mortgage with an avg +9.3pt margin.</strong> Mitchell (47% home FG vs 38% road), Mobley (26/14 G6), and Harden (potential triple-double) give CLE three star-caliber options. TOR is missing Ingram (heel) and Quickley (hamstring) — their two key depth pieces. CLE's bench depth (Schroder, Wade) performs better at home. However, confidence is MEDIUM not HIGH because TOR has been the most resilient underdog in R1 — they've won 3 elimination games (G3, G4, G6) and Barnes' 14-assist G6 showed a gear the model didn't project. TOR is 0-3 at Rocket Mortgage but their ceiling in elimination games defies prediction.</div>
        <span class="bet-edge model">G7 Override + Model</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Donovan Mitchell Over 24.5 points</div>
        <div class="bet-line">-115 | Home FG% boost: 49% at RM vs 38% road | G7 at home</div>
        <div class="bet-reasoning">Mitchell's home/road split is massive: 49% FG at Rocket Mortgage vs 38% on the road this series. His 3PT shooting at home (35%) vs Scotiabank (19.2% last 3 games) is a huge venue effect. In a G7 at home, expect Mitchell to attack aggressively and hit the 25+ mark. His series avg is 24.3pts — the line is essentially his average, which means home court boost pushes him over.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Scottie Barnes Over 22.5 points</div>
        <div class="bet-line">-110 | Series avg: 25.5pts | G7 = maximum effort regardless of venue</div>
        <div class="bet-reasoning">Barnes has scored 23+ in 4 of 6 games and averages 25.5pts this series. Even on the road, his physical play style translates — 25pts G5 at Rocket Mortgage. In a G7, expect maximum aggression. His 14-assist G6 showed he can dominate through playmaking even if shots aren't falling. The 22.5 line is very beatable for TOR's alpha in a win-or-go-home game.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">James Harden Under 7.5 turnovers</div>
        <div class="bet-line">-115 | G3: 8, G4: 7, G5: 6, G6: 4 TOs | Trending down but G7 pressure</div>
        <div class="bet-reasoning">Harden's TO count has been trending down (8→7→6→4) but G7 at home with maximum pressure could spike it. His 25 TOs in the last 4 games show systemic ball security issues. The 7.5 line is carefully set — in 3 of 4 games he was under 7.5. Lean UNDER because home court reduces pressure and Harden may be more careful in a G7, but this is a genuine coin flip.</div>
        <span class="bet-edge" style="background:#ff9800;color:#000;">Coin Flip</span>
      </div>
    </div>
    </div><!-- end betContent-g7 -->

    <!-- DISCLAIMER -->
    <div class="bets-disclaimer">
      <strong>Disclaimer:</strong> These picks are generated by a statistical model calibrated against 2025 NBA Playoff results (73.5% accuracy across 49 games) and updated with deep-dive research from Fadeaway World, Basketball Reference, and SI for the 2026 R1 slate. They are not guaranteed outcomes. All betting involves risk. Lines shown are approximate and may differ from your sportsbook. The model accounts for Home Court Advantage (round-adjusted), System Coherence, Championship DNA, Health Degradation, Star Ceiling Variance, Playoff Pedigree, and G1 Bayesian Updates — but cannot predict injuries, ejections, or one-game anomalies. Bet responsibly.
    </div>
  </div>`;
}

// ============================================================
// DYNAMIC R2 OVERVIEW — pulls all numbers from blended engine
// ============================================================
function renderR2DynamicOverview() {
  const r2Series = SERIES_DATA.filter(s => s.round === 2);
  const cards = r2Series.map(s => {
    const score = getSeriesScore(s);
    const gamesPlayed = getGamesPlayed(s);
    // Find the next unplayed game number
    let nextGame = 1;
    for (let i = 0; i < s.games.length; i++) {
      if (s.games[i].winner) nextGame = i + 2;
      else { nextGame = i + 1; break; }
    }

    // For each completed game, show result. For next game, show prediction.
    const completedGames = s.games.filter(g => g.winner);
    const nextUnplayed = s.games.find(g => !g.winner);

    // Build completed game mini-cards
    const completedHtml = completedGames.map((g, gi) => {
      const gNum = gi + 1;
      const blend = calcBlendedProjection(s, s.id, gNum);
      const predictedMargin = Math.round(Math.abs(blend.blendedMargin));
      const predictedWinner = blend.blendedWinner;
      const actualMargin = Math.abs(g.homeScore - g.awayScore);
      const actualWinner = g.winner;
      const correct = predictedWinner === actualWinner;
      const bgColor = correct ? 'rgba(61,214,140,0.08)' : 'rgba(239,68,68,0.08)';
      const borderColor = correct ? 'rgba(61,214,140,0.3)' : 'rgba(239,68,68,0.3)';
      const labelColor = correct ? '#3dd68c' : '#ef4444';
      const icon = correct ? '&check;' : '&cross;';
      const resultLabel = correct ? actualWinner + ' WIN' : predictedWinner + ' LOSS';
      const winnerScore = g.winner === s.homeTeam.abbr
        ? s.homeTeam.abbr + ' ' + g.homeScore + ' &mdash; ' + s.awayTeam.abbr + ' ' + g.awayScore
        : s.awayTeam.abbr + ' ' + g.awayScore + ' &mdash; ' + s.homeTeam.abbr + ' ' + g.homeScore;

      return '<div style="text-align:center;padding:10px;border-radius:8px;background:' + bgColor + ';border:1px solid ' + borderColor + ';">' +
        '<div style="font-size:10px;color:' + labelColor + ';margin-bottom:2px;font-weight:700;">G' + gNum + ' FINAL</div>' +
        '<div style="font-size:11px;color:#60a5fa;font-weight:700;">' + winnerScore + '</div>' +
        '<div style="font-size:18px;font-weight:700;color:' + labelColor + ';">' + icon + ' ' + resultLabel + '</div>' +
        '<div style="font-size:10px;color:#888;">Predicted ' + predictedWinner + ' by ' + predictedMargin + ' | Actual ' + (correct ? '+' : '') + actualMargin + '</div>' +
      '</div>';
    }).join('');

    // Build next game prediction card
    let nextGameHtml = '';
    if (nextUnplayed) {
      const nextGNum = completedGames.length + 1;
      const blend = calcBlendedProjection(s, s.id, nextGNum);
      const absMargin = Math.round(Math.abs(blend.blendedMargin));
      const winProb = Math.min(95, Math.round(50 + absMargin * 3));
      const favColor = winProb >= 70 ? '#3dd68c' : winProb >= 58 ? '#60a5fa' : '#f59e0b';
      const spreadStr = blend.blendedWinner + ' -' + (absMargin >= 1 ? (absMargin - 0.5).toFixed(1) : '0.5');

      nextGameHtml = '<div style="text-align:center;padding:10px;border-radius:8px;background:rgba(0,0,0,0.2);">' +
        '<div style="font-size:10px;color:#888;margin-bottom:2px;">G' + nextGNum + ' UPCOMING</div>' +
        '<div style="font-size:11px;color:#60a5fa;font-weight:700;">' + s.homeTeam.abbr + ' vs ' + s.awayTeam.abbr + '</div>' +
        '<div style="font-size:22px;font-weight:700;color:' + favColor + ';">' + blend.blendedWinner + ' ' + winProb + '%</div>' +
        '<div style="font-size:10px;color:#888;">' + blend.blendedScore + ' | ' + spreadStr + '</div>' +
      '</div>';
    }

    return { completedHtml, nextGameHtml, id: s.id, seriesLabel: '(' + s.homeTeam.seed + ') ' + s.homeTeam.abbr + ' vs (' + s.awayTeam.seed + ') ' + s.awayTeam.abbr, score };
  });

  // Count overall R2 record
  let correct = 0, total = 0;
  r2Series.forEach(s => {
    s.games.forEach((g, gi) => {
      if (!g.winner) return;
      const blend = calcBlendedProjection(s, s.id, gi + 1);
      total++;
      if (blend.blendedWinner === g.winner) correct++;
    });
  });
  const recordStr = total > 0 ? correct + '/' + total + ' (' + Math.round(correct/total*100) + '%)' : 'No results yet';

  // Build all cards into a grid
  const allCards = cards.map(c => c.completedHtml + c.nextGameHtml).join('');

  return '<div style="margin-bottom:20px;border-top:2px solid #a78bfa;padding-top:16px;">' +
    '<div style="text-align:center;margin-bottom:12px;">' +
      '<span style="font-size:12px;font-weight:700;color:#a78bfa;background:rgba(167,139,250,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">R2 BLENDED MODEL &mdash; Dynamic Projections | ML Record: ' + recordStr + '</span>' +
    '</div>' +
    '<div style="background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.2);border-radius:10px;padding:14px;">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">' + allCards + '</div>' +
    '</div>' +
  '</div>';
}

// ============================================================
// ROUND 2 BETS PAGE
// ============================================================
function renderR2Bets(el) {
  // ── Compute dynamic blended projections for all R2 series/games ──
  const r2 = SERIES_DATA.filter(s => s.round === 'R2');
  const bp = {}; // bp['OKC-LAL_1'] = { blendedWinner, blendedMargin, blendedScore, ... }
  r2.forEach(s => {
    for (let g = 1; g <= 7; g++) {
      try {
        const res = calcBlendedProjection(s, s.id, g);
        if (res) bp[s.id + '_' + g] = res;
      } catch(e) { /* game may not exist yet */ }
    }
  });
  // Helper: dynamic model line string for a given series + game
  function dml(seriesId, gameNum) {
    const b = bp[seriesId + '_' + gameNum];
    if (!b) return 'Model: N/A';
    return 'Model: ' + b.blendedWinner + ' by ' + Math.round(Math.abs(b.blendedMargin));
  }
  function dmargin(seriesId, gameNum) {
    const b = bp[seriesId + '_' + gameNum];
    return b ? Math.round(Math.abs(b.blendedMargin)) : '?';
  }
  function dwinner(seriesId, gameNum) {
    const b = bp[seriesId + '_' + gameNum];
    return b ? b.blendedWinner : '?';
  }

  el.innerHTML = `
  <div style="max-width:900px;margin:0 auto;padding:20px 10px;" class="bets-container">

    <!-- R2 HEADER -->
    <h2 style="text-align:center;color:#fff;margin-bottom:4px;">2026 NBA Playoff Bets — Round 2</h2>
    <p style="text-align:center;color:#aaa;font-size:12px;margin-bottom:6px;">4 series | Odds by DraftKings | R1 Model: 25/42 ML (59.5%) | R2: 1/2 correct (50%) | G1 tonight: DET-CLE, OKC-LAL</p>

    <!-- ROUND TOGGLE -->
    <div style="text-align:center;margin-bottom:16px;display:flex;justify-content:center;gap:0;">
      <button onclick="currentPlayoffRound='R1';renderBetsPage(document.getElementById('main'))" style="padding:7px 18px;border-radius:6px 0 0 6px;background:var(--card);color:var(--text-dim);border:1px solid var(--border);cursor:pointer;font-size:12px;font-weight:600;">R1 Archive</button>
      <button disabled style="padding:7px 18px;border-radius:0 6px 6px 0;background:var(--accent);color:#fff;border:1px solid var(--accent);cursor:default;font-size:12px;font-weight:700;">Round 2</button>
    </div>

    <!-- R2 BET TABS -->
    <div class="scroll-x" style="display:flex;gap:0;margin-bottom:24px;justify-content:center;">
      <div class="bet-tab active" onclick="switchBetTab('parlays')" id="betTab-parlays" style="padding:10px 24px;border-radius:8px 0 0 8px;cursor:pointer;font-size:13px;font-weight:700;background:var(--accent);color:#fff;border:1px solid var(--accent);transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Featured Parlays</div>
      <div class="bet-tab" onclick="switchBetTab('g1')" id="betTab-g1" style="padding:10px 24px;border-radius:0;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 1 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g2')" id="betTab-g2" style="padding:10px 24px;border-radius:0 8px 8px 0;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 2 Bets</div>
    </div>

    <!-- ═══════ FEATURED PARLAYS TAB ═══════ -->
    <div id="betContent-parlays" class="bet-content">

      <!-- R2 WIN PROBABILITIES (DYNAMIC) -->
      ${renderR2DynamicOverview()}

      <!-- R2 G1 FEATURED PARLAYS -->
      <div style="margin-bottom:20px;border-top:2px solid #4caf50;padding-top:16px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#4caf50;background:rgba(76,175,80,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">R2 GAME 1 FEATURED PARLAYS &mdash; Sun May 4 &amp; Mon May 5</span>
        </div>

        <!-- $100 BEST BET -->
        <div class="parlay-card headline" style="border:2px solid #ef4444;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;">$100 Best Bet &mdash; R2 G1 Chalk Sweep (3-Leg) <span style="color:#ef4444;font-size:12px;background:rgba(239,68,68,0.15);padding:2px 8px;border-radius:4px;">BUSTED (SAS lost)</span></span>
            <span class="parlay-odds" style="font-size:16px;">+175 | P&amp;L: -$100</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg">
              <span class="parlay-leg-num">1</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>NYK ML</strong> vs PHI <span style="color:#3dd68c;">&check; W (137-98)</span></div>
                <div class="parlay-leg-line">-290 | Brunson 35pts, NYK 63% FG blowout</div>
              </div>
              <span class="parlay-leg-conf high" style="background:rgba(61,214,140,0.15);color:#3dd68c;">HIT</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">2</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>SAS ML</strong> vs MIN <span style="color:#ef4444;">&cross; L (102-104)</span></div>
                <div class="parlay-leg-line">-345 | Wemby 0-8 3PT, Edwards 18pts off bench upset</div>
              </div>
              <span class="parlay-leg-conf high" style="background:rgba(239,68,68,0.15);color:#ef4444;">MISS</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">3</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>OKC ML</strong> vs LAL</div>
                <div class="parlay-leg-line">-1050 | ${dml('OKC-LAL', 1)} | 11-day rest, 4-0 vs LAL this year, no Doncic</div>
              </div>
              <span class="parlay-leg-conf high">LOCK</span>
            </div>
          </div>
          <div class="parlay-reasoning">
            <strong>Why this hits:</strong> Three massive home favorites with structural advantages. NYK has 6 days rest vs PHI's 2, MSG is a fortress. SAS has Wemby at home (62-20) even with Edwards back at reduced capacity. OKC is the best team in the NBA, rested 11 days, facing Doncic-less LAL. The +175 payout on three near-locks is excellent value. <strong>R1 G1 chalk went 7/8 (88%).</strong>
          </div>
        </div>

        <!-- $50 ENSEMBLE EDGE -->
        <div class="parlay-card" style="border:1px solid #60a5fa;">
          <div class="parlay-header">
            <span class="parlay-name" style="color:#60a5fa;">$50 Ensemble Edge &mdash; Spread + Total (4-Leg)</span>
            <span class="parlay-odds" style="background:rgba(96,165,250,0.15);color:#60a5fa;">+550 | To Win: $275</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg">
              <span class="parlay-leg-num">1</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>NYK -7.5</strong> vs PHI</div>
                <div class="parlay-leg-line">-112 | ${dml('NYK-PHI', 1)}</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">2</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Under 220.5</strong> SAS-MIN</div>
                <div class="parlay-leg-line">-105 | ${dml('SAS-MIN', 1)} | Edwards limited = reduced pace</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">3</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Under 214.5</strong> DET-CLE</div>
                <div class="parlay-leg-line">-110 | ${dml('DET-CLE', 1)} | DET #1 defense, both exhausted from G7s</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">4</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>OKC -15.5</strong> vs LAL</div>
                <div class="parlay-leg-line">-110 | ${dml('OKC-LAL', 1)} | OKC 31.8pt avg margin vs LAL</div>
              </div>
              <span class="parlay-leg-conf low">LOW</span>
            </div>
          </div>
          <div class="parlay-reasoning">
            <strong>Edge thesis:</strong> Unders hit at higher rate in R2 historically. DET-CLE Under 214.5 with both teams' defensive identities is the strongest leg. NYK -7.5 aligns with model margin of ${dmargin('NYK-PHI', 1)}pts. OKC -15.5 is the risky leg (model says ${dmargin('OKC-LAL', 1)}).
          </div>
        </div>

        <!-- $1 CHAOS TICKET -->
        <div class="parlay-card" style="border:1px solid #f59e0b;">
          <div class="parlay-header">
            <span class="parlay-name" style="color:#f59e0b;">$1 Chaos Ticket &mdash; R2 Upset Special (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(245,158,11,0.15);color:#f59e0b;">+4200 | To Win: $42</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg">
              <span class="parlay-leg-num">1</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>CLE ML</strong> vs DET</div>
                <div class="parlay-leg-line">+130 | ${dml('DET-CLE', 1)} (LOW conf) | CLE triple-initiator offense is dangerous</div>
              </div>
              <span class="parlay-leg-conf low">CHAOS</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">2</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>PHI +7.5</strong></div>
                <div class="parlay-leg-line">-108 | Embiid dropped 34/12/6 in G7 at Boston &mdash; if healthy, PHI covers</div>
              </div>
              <span class="parlay-leg-conf low">CHAOS</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">3</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Over 213.5</strong> OKC-LAL</div>
                <div class="parlay-leg-line">-110 | ${dml('OKC-LAL', 1)} | OKC pace + LeBron legacy scoring = points</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
          </div>
          <div class="parlay-reasoning">
            <strong>Chaos path:</strong> CLE is genuinely live at +130. PHI +7.5 hedges on Embiid health. OKC-LAL Over is the safest leg &mdash; OKC plays fast and even blowouts generate points.
          </div>
        </div>

        <!-- $25 PROPS PARLAY -->
        <div class="parlay-card" style="border:1px solid #a78bfa;">
          <div class="parlay-header">
            <span class="parlay-name" style="color:#a78bfa;">$25 Props Parlay &mdash; R2 Stars Shine (4-Leg)</span>
            <span class="parlay-odds" style="background:rgba(167,139,250,0.15);color:#a78bfa;">+650 | To Win: $162.50</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg">
              <span class="parlay-leg-num">1</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Brunson Over 27.5 pts</strong></div>
                <div class="parlay-leg-line">-115 | Playoff avg 28.6pts, MSG x-factor</div>
              </div>
              <span class="parlay-leg-conf high">HIGH</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">2</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Wembanyama Over 24.5 pts</strong></div>
                <div class="parlay-leg-line">-110 | 34ppg vs MIN reg season, healthy + rested</div>
              </div>
              <span class="parlay-leg-conf high">HIGH</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">3</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>SGA Over 28.5 pts</strong></div>
                <div class="parlay-leg-line">-115 | 31.1ppg R1, 11 days rest, LAL has no answer</div>
              </div>
              <span class="parlay-leg-conf high">HIGH</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">4</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Mitchell Over 24.5 pts</strong></div>
                <div class="parlay-leg-line">-115 | 8.5 clutch rating, CLE primary scorer</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
          </div>
          <div class="parlay-reasoning">
            <strong>Star power thesis:</strong> R2 G1 is where stars assert. All four are at home, all four are the best players in their series. Mitchell is the weakest leg due to DET's #1 defense.
          </div>
        </div>
      </div>

      <!-- R2 G1 FEATURED PARLAYS — TONIGHT MAY 5 -->
      <div style="margin-bottom:20px;border-top:2px solid #22c55e;padding-top:16px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#22c55e;background:rgba(34,197,94,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">TONIGHT &mdash; Mon May 5 | DET-CLE G1 7pm ET | OKC-LAL G1 8:30pm ET</span>
        </div>

        <!-- $100 BEST BET — TONIGHT -->
        <div class="parlay-card headline" style="border:2px solid #4caf50;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;">$100 Best Bet &mdash; Chalk Doubles (2-Leg)</span>
            <span class="parlay-odds" style="font-size:16px;">&asymp; -165 combined | To Win: ~$61</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg">
              <span class="parlay-leg-num">1</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>DET ML</strong> vs CLE (R2 G1 at Little Caesars Arena)</div>
                <div class="parlay-leg-line">-170 | DET -3.5 | Model: DET 108-105 (LOW conf) | #1 defense, 31-9 home record</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">2</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>OKC ML</strong> vs LAL (R2 G1 at Paycom Center)</div>
                <div class="parlay-leg-line">-1053 | OKC -15.5 | Model: OKC 116-101 (HIGH conf) | 11 days rest, Doncic OUT, J.Williams OUT, 4-0 vs LAL</div>
              </div>
              <span class="parlay-leg-conf high">LOCK</span>
            </div>
          </div>
          <div class="parlay-reasoning">
            <strong>Why this hits:</strong> Conservative 2-legger. DET ML at -170 is the swing leg &mdash; #1 defense at home in G1 with crowd advantage. OKC ML at -1053 is the near-lock &mdash; best team in the NBA, 11 days rest, facing a LAL squad missing Doncic. Combined juice is only ~-165 for two home favorites. DET -170 &times; OKC -1053 = approx -165 effective odds. Even with CLE&rsquo;s triple-initiator offense, DET&rsquo;s home court + defense should hold.
          </div>
        </div>

        <!-- $1 CHAOS TICKET — TONIGHT -->
        <div class="parlay-card" style="border:1px solid #f59e0b;">
          <div class="parlay-header">
            <span class="parlay-name" style="color:#f59e0b;">$1 Chaos Ticket &mdash; Road Dog + Alt Spread (2-Leg)</span>
            <span class="parlay-odds" style="background:rgba(245,158,11,0.15);color:#f59e0b;">+435 | To Win: $4.35</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg">
              <span class="parlay-leg-num">1</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>CLE ML</strong> vs DET (+145)</div>
                <div class="parlay-leg-line">+145 | Mitchell/Harden/Mobley triple-initiator offense is live on the road | DET only LOW conf favorite</div>
              </div>
              <span class="parlay-leg-conf low">CHAOS</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">2</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>LAL +15.5</strong> (alt spread)</div>
                <div class="parlay-leg-line">-120 | Covers if LAL loses by &lt;16 &mdash; LeBron legacy mode + AD interior presence keep it closer than 16</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
          </div>
          <div class="parlay-reasoning">
            <strong>Chaos path:</strong> CLE ML at +145 is genuinely live &mdash; model only has DET at LOW confidence, and CLE&rsquo;s triple-initiator offense with Mitchell (8.5 clutch rating) can steal G1 on the road. LAL +15.5 is the safer leg &mdash; even in a blowout, LeBron + AD typically keep games within 15. Long shot but reasonable chaos for $1.
          </div>
        </div>

        <!-- TONIGHT'S PLAYER PROPS -->
        <div class="parlay-card" style="border:1px solid #a78bfa;">
          <div class="parlay-header">
            <span class="parlay-name" style="color:#a78bfa;">Player Props &mdash; Tonight&rsquo;s G1 Stars (4-Leg)</span>
            <span class="parlay-odds" style="background:rgba(167,139,250,0.15);color:#a78bfa;">Individual Plays</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg">
              <span class="parlay-leg-num">1</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>SGA Over 28.5 pts</strong> (-115)</div>
                <div class="parlay-leg-line">11 days rest, 4-0 vs LAL this year, historic 31.1ppg season, no J.Williams = even more usage</div>
              </div>
              <span class="parlay-leg-conf high">HIGH</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">2</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Cade Over 22.5 pts</strong> (-110)</div>
                <div class="parlay-leg-line">Dual-mode star (45pts G5, 32/12ast G7), home G1, motivated &mdash; CLE defense allows star scoring</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">3</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>LeBron Over 25.5 pts</strong> (-110)</div>
                <div class="parlay-leg-line">Legacy mode in what could be final playoff run &mdash; fatigue risk after G7 but LeBron historically rises in elimination-adjacent spots</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">4</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Mitchell Over 24.5 pts</strong> (-115)</div>
                <div class="parlay-leg-line">8.5 clutch rating, CLE&rsquo;s primary scorer &mdash; but DET #1 defense (107.2 DRtg) makes this the riskiest leg</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
          </div>
          <div class="parlay-reasoning">
            <strong>Props thesis:</strong> SGA O28.5 is the strongest play &mdash; 11 days rest, historic season, 4-0 vs LAL, and J.Williams OUT means even more offensive burden. Cade O22.5 is solid at home in a high-stakes G1. LeBron O25.5 is a legacy bet with fatigue risk. Mitchell O24.5 is the weakest due to DET&rsquo;s elite perimeter D. Play SGA as a standalone best prop; parlay SGA + Cade for a 2-leg prop combo at ~+195.
          </div>
        </div>
      </div>

      <!-- R2 G2 FEATURED PARLAYS -->
      <div style="margin-bottom:20px;border-top:2px solid #60a5fa;padding-top:16px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#60a5fa;background:rgba(96,165,250,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">R2 GAME 2 FEATURED PARLAYS &mdash; Tue May 6 &amp; Wed May 7</span>
        </div>

        <!-- $75 REGRESSION LOCK -->
        <div class="parlay-card headline" style="border:2px solid #4caf50;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;">$75 Regression Lock &mdash; Bounce-Back Chalk (2-Leg)</span>
            <span class="parlay-odds" style="font-size:16px;">+145 | To Win: $108.75</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg">
              <span class="parlay-leg-num">1</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>NYK ML</strong> vs PHI (G2)</div>
                <div class="parlay-leg-line">-260 | NYK won G1 by 39 | MSG fortress | Brunson 35pts locked in</div>
              </div>
              <span class="parlay-leg-conf high">HIGH</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">2</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>SAS ML</strong> vs MIN (G2)</div>
                <div class="parlay-leg-line">-220 | SAS shot 28% 3PT in G1 (career-worst) | Wemby 0-8 3PT regresses to 37.5%</div>
              </div>
              <span class="parlay-leg-conf high">HIGH</span>
            </div>
          </div>
          <div class="parlay-reasoning">
            <strong>Regression thesis:</strong> Both home teams lost/underperformed due to extreme shooting variance in G1. SAS shot 28% 3PT (season avg 37.5%) — that's 3.5 extra makes = +10.5pts of regression. NYK is at home after a dominant G1 vs a tired PHI team. Two strong favorites at home with bounce-back narratives.
          </div>
        </div>

        <!-- $25 STAR BOUNCE-BACK PROPS -->
        <div class="parlay-card" style="border:1px solid #a78bfa;">
          <div class="parlay-header">
            <span class="parlay-name" style="color:#a78bfa;">$25 Star Bounce-Back Props (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(167,139,250,0.15);color:#a78bfa;">+450 | To Win: $112.50</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg">
              <span class="parlay-leg-num">1</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Wembanyama Over 22.5 pts</strong> (G2)</div>
                <div class="parlay-leg-line">-125 | G1: 11pts (0-8 3PT) | Season avg 24.8 | 34ppg vs MIN | EXTREME bounce-back</div>
              </div>
              <span class="parlay-leg-conf high">LOCK</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">2</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Brunson Over 26.5 pts</strong> (G2)</div>
                <div class="parlay-leg-line">-120 | G1: 35pts | 6 of last 8 playoff games Over 27.5 | MSG home</div>
              </div>
              <span class="parlay-leg-conf high">HIGH</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">3</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>Edwards Over 19.5 pts</strong> (G2)</div>
                <div class="parlay-leg-line">-115 | G1: 18pts in 25min | Expect 30+ min G2 | Knee improving</div>
              </div>
              <span class="parlay-leg-conf med">MED</span>
            </div>
          </div>
          <div class="parlay-reasoning">
            <strong>Star power thesis:</strong> Wemby's 0-8 3PT was a career-worst anomaly for a 37.5% shooter — he'll score 25+ in G2. Brunson is locked into MSG mode (35pts G1). Edwards gets expanded minutes if knee holds. All three at -115 to -125 individual odds = excellent combined value at +450.
          </div>
        </div>

        <!-- $1 G2 CHAOS -->
        <div class="parlay-card" style="border:1px solid #f59e0b;">
          <div class="parlay-header">
            <span class="parlay-name" style="color:#f59e0b;">$1 Chaos Ticket &mdash; G2 Double Upset (2-Leg)</span>
            <span class="parlay-odds" style="background:rgba(245,158,11,0.15);color:#f59e0b;">+1800 | To Win: $18</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg">
              <span class="parlay-leg-num">1</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>PHI ML</strong> vs NYK (G2)</div>
                <div class="parlay-leg-line">+210 | Embiid bounce-back after 14pt G1 | 2 extra days rest | Pride game</div>
              </div>
              <span class="parlay-leg-conf low">CHAOS</span>
            </div>
            <div class="parlay-leg">
              <span class="parlay-leg-num">2</span>
              <div class="parlay-leg-detail">
                <div class="parlay-leg-pick"><strong>MIN ML</strong> vs SAS (G2)</div>
                <div class="parlay-leg-line">+175 | Already proved they can win in SA | Edwards minutes expand | Dosunmu back</div>
              </div>
              <span class="parlay-leg-conf low">CHAOS</span>
            </div>
          </div>
          <div class="parlay-reasoning">
            <strong>Chaos path:</strong> MIN already won in SA — it's not impossible. Dosunmu returns, Edwards gets 30+ min. PHI's bounce-back potential is real if Embiid goes nuclear. At +1800, the $1 risk is worth the $18 payout.
          </div>
        </div>
      </div>

      <!-- R1 P&L SUMMARY -->
      <div style="margin-top:20px;border-top:2px solid #555;padding-top:16px;">
        <div style="text-align:center;margin-bottom:12px;">
          <span style="font-size:12px;font-weight:700;color:#888;background:rgba(136,136,136,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">R1 BETTING SUMMARY</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;">
          <div style="text-align:center;padding:10px;border-radius:8px;background:rgba(0,0,0,0.2);border:1px solid #333;">
            <div style="font-size:10px;color:#888;">$100 Plays</div>
            <div style="font-size:18px;font-weight:700;color:#f44336;">0-6</div>
            <div style="font-size:10px;color:#f44336;">-$600</div>
          </div>
          <div style="text-align:center;padding:10px;border-radius:8px;background:rgba(0,0,0,0.2);border:1px solid #333;">
            <div style="font-size:10px;color:#888;">$1 Chaos</div>
            <div style="font-size:18px;font-weight:700;color:#4caf50;">2-4</div>
            <div style="font-size:10px;color:#4caf50;">+$1.53</div>
          </div>
          <div style="text-align:center;padding:10px;border-radius:8px;background:rgba(0,0,0,0.2);border:1px solid #333;">
            <div style="font-size:10px;color:#888;">Net P&amp;L</div>
            <div style="font-size:18px;font-weight:700;color:#f44336;">-$698.47</div>
            <div style="font-size:10px;color:#888;">R1 Final</div>
          </div>
        </div>
        <div style="font-size:11px;color:#666;text-align:center;font-style:italic;">R1 lesson: Parlays are high-risk. R2 strategy: smaller 3-leg chalk, add $50 spread and $25 props parlays for diversification.</div>
      </div>

    </div><!-- end betContent-parlays -->

    <!-- ═══════ R2 GAME 1 BETS TAB ═══════ -->
    <div id="betContent-g1" class="bet-content" style="display:none;">

    <!-- NYK-PHI G1 -->
    <div class="bet-section">
      <h4 style="color:#4caf50;margin:0 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">(3) NYK vs (7) PHI &mdash; G1 Sun May 4, 8:00 PM ET @ MSG</h4>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML ★ BEST BET</span>
        <div class="bet-pick">NYK ML vs PHI</div>
        <div class="bet-line">-290 | NYK -7.5 | O/U 213.5 | ${dml('NYK-PHI', 1)} | <span style="color:#4caf50;">MEDIUM &mdash; fatigue + MSG fortress</span></div>
        <div class="bet-reasoning"><strong>NYK has 6 days rest vs PHI's 2 after a grueling G7 in Boston.</strong> Embiid played 39min in G7 (hip contusion + post-appendectomy) with a 48-hour turnaround to MSG. PHI's 3-1 comeback proves mental toughness but the physical toll is severe. NYK depth (OG/Bridges/Hart/McBride/Shamet) grinds PHI's 7-man rotation by Q3. Brunson (9.2 clutch NetRtg) feasts in PnR vs compromised Embiid. R1 G1 home favorites covered 7/8 (88%).</div>
        <span class="bet-edge model">Model + Market</span>
      </div>

      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">NYK -7.5</div>
        <div class="bet-line">-112 | Model margin: ${dmargin('NYK-PHI', 1)}pts | PHI fatigue Q3 collapse risk</div>
        <div class="bet-reasoning">Model says ${dwinner('NYK-PHI', 1)} by ${dmargin('NYK-PHI', 1)} &mdash; covers -7.5. PHI will compete early but fatigue hits in Q3. Embiid CAN dominate on the road (34/12 vs BOS G7) but at what physical cost? NYK bench depth (McBride, Shamet, Clarkson vs PHI's Grimes/Barlow) is a massive quality gap.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jalen Brunson Over 27.5 points</div>
        <div class="bet-line">-115 | Playoff avg 28.6pts | MSG home = elite efficiency | PnR vs tired Embiid</div>
        <div class="bet-reasoning">Brunson averaged 28.6pts in R1 with 9.2 clutch net rating at MSG. PHI perimeter defense will be compromised by fatigue. Brunson's PnR with KAT creates open lanes. The 27.5 line is below his playoff average &mdash; one of the safest props on the board.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Embiid Under 28.5 points</div>
        <div class="bet-line">-110 | 48hr turnaround after 39min G7 | Hip contusion limits burst moves</div>
        <div class="bet-reasoning">Embiid dropped 34/12/6 in G7 but that was an elimination game with adrenaline. G1 on 2 days rest with a hip contusion is different. OG Anunoby is an elite post defender. Expect 22-26pts on lower efficiency as Embiid conserves energy for a long series.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
    </div>

    <!-- SAS-MIN G1 -->
    <div class="bet-section">
      <h4 style="color:#4caf50;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">(2) SAS vs (6) MIN &mdash; G1 Sun May 4, 9:30 PM ET @ Frost Bank Center</h4>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">SAS ML vs MIN</div>
        <div class="bet-line">-345 | SAS -9.5 | O/U 220.5 | ${dml('SAS-MIN', 1)} | <span style="color:#4caf50;">MEDIUM &mdash; Edwards playing changes calculus</span></div>
        <div class="bet-reasoning"><strong>Edwards is expected to play (Shams, May 4).</strong> Line moved from -11.5 to -9.5. Edwards at 80% (knee) still transforms MIN, but SAS at Frost Bank Center (62-20) with Wemby healthy (34ppg vs MIN) is extremely tough. DiVincenzo OUT for the season &mdash; MIN 3PT depth is gutted. Fox/Castle/Champagnie give SAS bench advantage.</div>
        <span class="bet-edge model">Model + Market</span>
      </div>

      <div class="bet-card">
        <span class="bet-type total">TOT</span>
        <div class="bet-pick">Under 220.5</div>
        <div class="bet-line">-105 | ${dml('SAS-MIN', 1)} | Edwards limited = reduced pace</div>
        <div class="bet-reasoning">Edwards at 80% means fewer transition opportunities. SAS plays half-court controlling pace. Both teams have elite rim protectors (Wemby, Gobert). Model projects 217 total &mdash; 3.5pts under the line.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Wembanyama Over 24.5 points</div>
        <div class="bet-line">-110 | 34ppg vs MIN reg season | Gobert matchup = mid-range feast</div>
        <div class="bet-reasoning">Wemby averaged 34ppg vs MIN &mdash; Gobert protects the rim but Wemby's mid-range is unguardable at 7-4. Had 17/14/6blk in closeout G5 while coasting. In a competitive R2 G1, expect him to assert early. One of the strongest props on the slate.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Edwards Under 26.5 points (if playing)</div>
        <div class="bet-line">-115 | ~80% capacity | Knee limits explosion, may play 28-32min</div>
        <div class="bet-reasoning">Edwards coming off knee hyperextension + bone bruise will play limited minutes (28-32) without usual explosion. SAS wing D (Castle, Barnes, Champagnie) is elite. Expect jump shots over rim attacks. At 80%, efficiency drops to 20-24pt range.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
    </div>

    <!-- DET-CLE G1 -->
    <div class="bet-section">
      <h4 style="color:#f59e0b;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #f59e0b;padding-bottom:6px;">(1) DET vs (4) CLE &mdash; G1 Mon May 5, 7:00 PM ET @ LCA</h4>

      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DET ML vs CLE</div>
        <div class="bet-line">-155 | DET -3.5 | O/U 214.5 | ${dml('DET-CLE', 1)} | <span style="color:#f59e0b;">LOW &mdash; genuine coin flip with home tilt</span></div>
        <div class="bet-reasoning"><strong>The closest R2 matchup.</strong> Both finished grueling G7s with equal rest (3 days). DET has #1 defense (107.2 DRtg) and best home record (31-9). CLE has triple-initiator offense (Mitchell/Harden/Mobley). Cade showed dual-mode (45pts G5, 32/12ast G7). Harris G7 breakout (30pts, 5/7 3PT) gives DET a legit #2. But CLE bench (Strus, Tyson, Merrill) is elite. NOT a best bet &mdash; small play or skip.</div>
        <span class="bet-edge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Lean Only</span>
      </div>

      <div class="bet-card best-bet">
        <span class="bet-type total">TOT ★ VALUE</span>
        <div class="bet-pick">Under 214.5</div>
        <div class="bet-line">-110 | ${dml('DET-CLE', 1)} | DET #1 defense | Both exhausted from G7s</div>
        <div class="bet-reasoning"><strong>Best value bet on the R2 G1 slate.</strong> DET has #1 defense (107.2 DRtg). Both teams just played 7-game series with 3 days rest. G1s in R2 after 7-game R1s historically run ~5pts under total. CLE relies on Mitchell/Harden creation but DET perimeter D (A.Thompson, D-LEBRON 2.93) will suppress first-option scoring. Model at 209 vs line at 214.5 = 5.5pts of edge.</div>
        <span class="bet-edge model">Strong Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Cade Cunningham Over 24.5 points</div>
        <div class="bet-line">-115 | G7: 32pts | Scored 25+ in 5 of 7 R1 games | Home at LCA</div>
        <div class="bet-reasoning">Cade showed dual-mode dominance (45 G5, 32/12ast G7). Against CLE, expect scorer mode &mdash; Mitchell/Harden won't guard him. At home in LCA, he attacks early to set the tone. The 24.5 line is very beatable.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Donovan Mitchell Over 24.5 points</div>
        <div class="bet-line">-115 | 8.5 clutch rating | 26.8ppg R1 avg | Physical series = free throws</div>
        <div class="bet-reasoning">Mitchell has 8.5 clutch rating and averaged 26.8pts in R1. Against DET defense, he'll need to be aggressive &mdash; expect 7+ FTA. His mid-range game is harder to suppress than 3PT. Even in losses, Mitchell consistently scores 25+.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
    </div>

    <!-- OKC-LAL G1 -->
    <div class="bet-section">
      <h4 style="color:#4caf50;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">(1) OKC vs (4) LAL &mdash; G1 Mon May 5, 8:30 PM ET @ Paycom Center</h4>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML ★ BEST BET</span>
        <div class="bet-pick">OKC ML vs LAL</div>
        <div class="bet-line">-1050 | OKC -15.5 | O/U 213.5 | ${dml('OKC-LAL', 1)} | <span style="color:#4caf50;">HIGH &mdash; most lopsided R2 matchup</span></div>
        <div class="bet-reasoning"><strong>OKC is the most complete team in the NBA (64-18, +11.6 NetRtg) vs Doncic-less LAL.</strong> OKC went 4-0 vs LAL with 31.8pt avg margin. Swept PHX in R1 with 11 days rest. SGA (31.1ppg, 67% TS) feasts on LAL's limited perimeter D. LeBron at 41 is a fatigue risk. Holmgren neutralizes Ayton. OKC depth means no drop-off. ML is safe but expensive &mdash; best in a parlay.</div>
        <span class="bet-edge model">Model + Market</span>
      </div>

      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">OKC -15.5</div>
        <div class="bet-line">-110 | ${dml('OKC-LAL', 1)} | <span style="color:#f59e0b;">RISKY &mdash; tight gap vs model, LeBron floor</span></div>
        <div class="bet-reasoning">Model says ${dwinner('OKC-LAL', 1)} by ${dmargin('OKC-LAL', 1)}. OKC's 31.8pt avg margin vs LAL suggests upside, but LeBron provides a floor. The smart play is ML in a parlay, not the spread alone.</div>
        <span class="bet-edge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Risky Lean</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">SGA Over 28.5 points</div>
        <div class="bet-line">-115 | 31.1ppg R1 | 11 days rest | LAL has no primary defender without Doncic</div>
        <div class="bet-reasoning">SGA averaged 31.1ppg on 67% TS in R1 vs PHX's better defense. With 11 days rest, he'll be fully loaded. Smart is solid but can't contain SGA for 36min. The 28.5 line is well below his playoff average.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">LeBron Over 25.5 points</div>
        <div class="bet-line">-110 | Legacy mode | Higher usage without Doncic | Hits in both competitive and blowout scripts</div>
        <div class="bet-reasoning">LeBron carries massive usage without Doncic (28.2ppg R1 at 41). In a blowout, OKC pulls starters and LeBron scores against the bench. In a competitive game, he scores on volume. The over hits regardless of game script.</div>
        <span class="bet-edge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Game Script Hedge</span>
      </div>
    </div>

    </div><!-- end betContent-g1 -->

    <!-- ═══════ R2 GAME 2 BETS TAB ═══════ -->
    <div id="betContent-g2" class="bet-content" style="display:none;">

    <!-- NYK-PHI G2 -->
    <div class="bet-section">
      <h4 style="color:#4caf50;margin:0 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">(3) NYK vs (7) PHI &mdash; G2 Tue May 6, 7:30 PM ET @ MSG | NYK leads 1-0</h4>
      <div style="background:rgba(61,214,140,0.06);border:1px solid rgba(61,214,140,0.2);border-radius:8px;padding:10px;margin-bottom:12px;font-size:11px;color:#aaa;">
        <strong style="color:#3dd68c;">G1 Recap:</strong> NYK 137-98 blowout. Brunson 35pts (12-18 FG). NYK shot 63% FG, 51% 3PT. Embiid was a shell (3-11, -24). Maxey 3-9, 4TO. PHI fatigue from 48hr turnaround was catastrophic. <strong>Key G2 Factor:</strong> PHI has 2 extra days rest now. Shooting regression expected for NYK. Embiid's pride bounce-back is the variable.
      </div>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML &star; BEST BET</span>
        <div class="bet-pick">NYK ML vs PHI</div>
        <div class="bet-line">-260 | NYK -6.5 | O/U 214.5 | ${dml('NYK-PHI', 2)} | <span style="color:#4caf50;">MEDIUM &mdash; tighter than G1 but NYK still dominant</span></div>
        <div class="bet-reasoning"><strong>NYK won G1 by 39 — most lopsided R2 game in a decade.</strong> PHI gets 2 extra days rest which helps, and Embiid historically bounces back after bad games. But NYK's systemic advantages remain: MSG home court (9.2 clutch NetRtg), Brunson locked in (35pts on 67% FG), depth that suffocated PHI's 7-man rotation. NYK shooting will regress from 63%/51% — but even at normal efficiency they win by 6+. Embiid's conditioning post-appendectomy remains a Q3/Q4 concern.</div>
        <span class="bet-edge model">Model + Structural</span>
      </div>

      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">NYK -6.5</div>
        <div class="bet-line">-110 | Model margin: ${dmargin('NYK-PHI', 2)}pts | Edge vs spread</div>
        <div class="bet-reasoning">Model says ${dwinner('NYK-PHI', 2)} by ${dmargin('NYK-PHI', 2)}. PHI's rest helps but bench depth remains a fatal flaw. If Embiid has bounce-back (28+ pts), PHI covers. If not, NYK wins by 8-12. Lean NYK but this is the riskier play vs ML.</div>
        <span class="bet-edge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Coin Flip Lean</span>
      </div>

      <div class="bet-card best-bet">
        <span class="bet-type prop">PROP &star; HIGH CONF</span>
        <div class="bet-pick">Jalen Brunson Over 26.5 points</div>
        <div class="bet-line">-120 | G1: 35pts (12-18 FG) | Playoff avg 28.6pts | MSG home | PnR vs Embiid/Drummond</div>
        <div class="bet-reasoning"><strong>Brunson dropped 35 in G1 on 67% FG — and the line is only 26.5.</strong> PHI has no answer for the Brunson-KAT PnR. Embiid can't switch at speed post-appendectomy. Drummond is BBQ chicken. Brunson has hit O27.5 in 6 of his last 8 playoff games. At MSG, he's virtually guaranteed 25+ floor with 35+ ceiling.</div>
        <span class="bet-edge matchup">Strong Matchup</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Joel Embiid Over 22.5 points</div>
        <div class="bet-line">-115 | G1: only 14pts (3-11) | Bounce-back spot | 2 extra days rest | Pride factor</div>
        <div class="bet-reasoning">Embiid's 14pts in G1 was his worst playoff game in 3 years. With 2 extra days rest, his hip settles and conditioning improves. Historically bounces back hard after bad games (avg 32pts in bounce-back games). The 22.5 line is overcorrected from the G1 disaster. Even at 80% capacity, he's a 25+ scorer.</div>
        <span class="bet-edge matchup">Bounce-back Spot</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">OG Anunoby Over 14.5 points</div>
        <div class="bet-line">-110 | G1: 18pts (7-8 FG) | Elite efficiency continues | PHI can't guard him</div>
        <div class="bet-reasoning">OG went 7-8 from the field in G1 — PHI has no one who can match his combination of size and skill. With Brunson drawing doubles, OG gets clean looks. He's averaged 15.2pts in the last 6 playoff games. The 14.5 line undervalues his current hot streak.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
    </div>

    <!-- SAS-MIN G2 -->
    <div class="bet-section">
      <h4 style="color:#f59e0b;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #f59e0b;padding-bottom:6px;">(2) SAS vs (6) MIN &mdash; G2 Wed May 7, 9:00 PM ET @ Frost Bank Center | MIN leads 1-0</h4>
      <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:10px;margin-bottom:12px;font-size:11px;color:#aaa;">
        <strong style="color:#f59e0b;">G1 Recap:</strong> MIN 104-102 upset. Wemby 0-8 3PT (career worst) but 15reb/12blk. Edwards off bench: 18pts in 25min. Fox -13 (0-4 3PT). SAS shot 28% 3PT (10-36). MIN won Q4 35-30. <strong>Key G2 Factor:</strong> Wemby's 3PT regresses to 37.5% mean. Fox must be aggressive. Dosunmu returns for MIN.
      </div>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML &star; BEST BET</span>
        <div class="bet-pick">SAS ML vs MIN</div>
        <div class="bet-line">-220 | SAS -5.5 | O/U 216.5 | ${dml('SAS-MIN', 2)} | <span style="color:#4caf50;">MEDIUM &mdash; shooting regression + home court</span></div>
        <div class="bet-reasoning"><strong>SAS shot 28% 3PT in G1 (10-36) vs their 37.5% season average.</strong> That's ~3.5 extra makes expected in G2 = +10.5pts of shooting regression alone. Wemby's 0-8 3PT was a career aberration — he's a 37.5% shooter who will bounce back. Fox (0-4 3PT, -13) is also due. MIN proved competitive but needed SAS to have their worst shooting game all season to win by 2. Dosunmu returns for MIN which helps, but the math strongly favors SAS regression.</div>
        <span class="bet-edge model">Regression + Model</span>
      </div>

      <div class="bet-card">
        <span class="bet-type spread">SPR</span>
        <div class="bet-pick">SAS -5.5</div>
        <div class="bet-line">-110 | Model margin: ${dmargin('SAS-MIN', 2)}pts | Regression supports it</div>
        <div class="bet-reasoning">Model says ${dwinner('SAS-MIN', 2)} by ${dmargin('SAS-MIN', 2)}. If Wemby makes just 2 threes (his season avg is 2.8/game), that adds 6pts to G1's margin and SAS wins by ~8. Edwards' minutes will expand but knee limits explosiveness. Lean cover but it's razor-thin.</div>
        <span class="bet-edge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">Lean Cover</span>
      </div>

      <div class="bet-card best-bet">
        <span class="bet-type prop">PROP &star; HIGH CONF</span>
        <div class="bet-pick">Victor Wembanyama Over 22.5 points</div>
        <div class="bet-line">-125 | G1: only 11pts (5-17, 0-8 3PT) | Season avg 24.8 | 34ppg vs MIN reg season | MASSIVE bounce-back</div>
        <div class="bet-reasoning"><strong>Wemby scored only 11pts in G1 on his worst shooting night ever (0-8 3PT, 5-17 FG).</strong> This is a 24.8ppg scorer who averaged 34ppg vs MIN in the regular season. The 0-8 3PT is a statistical anomaly for a 37.5% shooter — regression alone adds 8-10pts to his scoring output. Expect 26-32pts in G2. Strongest bounce-back prop on the board.</div>
        <span class="bet-edge matchup">Extreme Bounce-back</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Anthony Edwards Over 19.5 points</div>
        <div class="bet-line">-115 | G1: 18pts in 25min | Expect 30+ min G2 | Knee holding up | Will likely start</div>
        <div class="bet-reasoning">Edwards scored 18pts in just 25min in G1 (8-13 FG = 62%). If knee holds, expect 30+ minutes and likely a starting role in G2. At his G1 efficiency with 30min, that's 22-25pts. The 19.5 line accounts for injury uncertainty but he proved he's effective.</div>
        <span class="bet-edge matchup">Volume Increase</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">De'Aaron Fox Over 17.5 points</div>
        <div class="bet-line">-110 | G1: only 10pts (5-14, 0-4 3PT, -13) | Season avg 18.5 | Aggression correction</div>
        <div class="bet-reasoning">Fox had his worst game of the playoffs in G1 — passive, 0-4 3PT, -13. Coaching staff will demand more PnR aggression with Wemby. His season avg is 18.5ppg and he averaged 20+ in R1. The 17.5 line is deflated by G1 — bounce-back to 20+ is likely.</div>
        <span class="bet-edge matchup">Bounce-back Spot</span>
      </div>
    </div>

    <!-- DET-CLE G2 (Pending G1 tonight) -->
    <div class="bet-section">
      <h4 style="color:#888;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #555;padding-bottom:6px;">(1) DET vs (4) CLE &mdash; G2 Wed May 7 @ LCA | G1 Tonight (May 5)</h4>
      <div style="background:rgba(136,136,136,0.06);border:1px solid rgba(136,136,136,0.2);border-radius:8px;padding:10px;margin-bottom:12px;font-size:11px;color:#888;">
        <strong>G1 Tonight (7:00 PM ET).</strong> G2 bets will be added after G1 result is recorded.
        <br><strong>Preliminary G2 Model:</strong> ${dml('DET-CLE', 2)}. G2 line will shift based on G1 result and model recalibration.
      </div>
    </div>

    <!-- OKC-LAL G2 (Pending G1 tonight) -->
    <div class="bet-section">
      <h4 style="color:#888;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #555;padding-bottom:6px;">(1) OKC vs (4) LAL &mdash; G2 Thu May 8 @ Paycom Center | G1 Tonight (May 5)</h4>
      <div style="background:rgba(136,136,136,0.06);border:1px solid rgba(136,136,136,0.2);border-radius:8px;padding:10px;margin-bottom:12px;font-size:11px;color:#888;">
        <strong>G1 Tonight (8:30 PM ET).</strong> G2 bets will be added after G1 result is recorded.
        <br><strong>Preliminary G2 Model:</strong> ${dml('OKC-LAL', 2)}. J. Williams (hamstring) may return for G2. Model recalibrates based on G1 result.
      </div>
    </div>

    </div><!-- end betContent-g2 -->

    <!-- DISCLAIMER -->
    <div class="bets-disclaimer">
      <strong>Disclaimer:</strong> Model-driven picks using a 47-phase prediction system calibrated against R1 results (59.5% ML, 88% G1) and R2 G1 results (1/2 correct winner, large margin miss). All lines from DraftKings as of May 5, 2026. Bet responsibly.
    </div>
  </div>`;
}
