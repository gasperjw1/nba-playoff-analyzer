// ============================================================
// BETS PAGE
// ============================================================

function renderBetsPage(el) {
  el.innerHTML = `
  <div style="max-width:900px;margin:0 auto;padding:20px 10px;" class="bets-container">
    <h2 style="text-align:center;color:#fff;margin-bottom:4px;">2026 NBA Playoff Bets — ${typeof ROUND_META !== 'undefined' && ROUND_META[currentPlayoffRound] ? ROUND_META[currentPlayoffRound].label : 'Round 1'}</h2>
    <p style="text-align:center;color:#aaa;font-size:13px;margin-bottom:8px;">Model-driven picks for all 8 first-round series | G1: 8/13 (61.5%) | G2: 6/11 (54.5%) | G3: 0/3 (0%) | G4: 3/4 (75%) | G5: 5/7 (71.4%) | Phase 41: Unified Ensemble (blended model + chaos sim aligned, SD=11.6)</p>

    <!-- BET TABS -->
    <div class="scroll-x" style="display:flex;gap:0;margin-bottom:24px;justify-content:center;">
      <div class="bet-tab active" onclick="switchBetTab('parlays')" id="betTab-parlays" style="padding:10px 24px;border-radius:8px 0 0 8px;cursor:pointer;font-size:13px;font-weight:700;background:var(--accent);color:#fff;border:1px solid var(--accent);transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Featured Parlays</div>
      <div class="bet-tab" onclick="switchBetTab('g1')" id="betTab-g1" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 1 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g2')" id="betTab-g2" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 2 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g3')" id="betTab-g3" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 3 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g4')" id="betTab-g4" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 4 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g5')" id="betTab-g5" style="padding:10px 24px;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 5 Bets</div>
      <div class="bet-tab" onclick="switchBetTab('g6')" id="betTab-g6" style="padding:10px 24px;border-radius:0 8px 8px 0;cursor:pointer;font-size:13px;font-weight:700;background:var(--card);color:var(--text-dim);border:1px solid var(--border);border-left:none;transition:all 0.2s;white-space:nowrap;flex-shrink:0;">Game 6 Bets</div>
    </div>

    <!-- ===== PARLAYS TAB ===== -->
    <div id="betContent-parlays" class="bet-content">
    <div class="parlay-featured">

      <!-- ===== TODAY'S DATE BANNER ===== -->
      <div style="text-align:center;margin-bottom:16px;">
        <span style="font-size:12px;font-weight:700;color:#4caf50;background:rgba(76,175,80,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">TODAY — Thu Apr 30 | NYK-ATL G6, BOS-PHI G6, DEN-MIN G6</span>
      </div>

      <!-- ===== APR 22 PARLAY RESULTS (COLLAPSED) ===== -->
      <details style="margin-bottom:16px;border:1px solid #333;border-radius:8px;padding:8px 12px;">
        <summary style="cursor:pointer;color:#888;font-size:12px;font-weight:600;">📊 Wed Apr 22 Parlay Results — $100 Play: ✗ LOSS (Cade 27pts, missed O28.5) | $1 Chaos: ✗ LOSS (DET won, ORL ML missed)</summary>
        <div style="margin-top:8px;padding:8px;background:rgba(255,255,255,0.03);border-radius:4px;font-size:11px;color:#666;">
          <div><strong>$100 Play (2-Leg ~+170):</strong> ✗ LOSS — Leg 1: Cade O28.5 ✗ (had 27pts, missed by 1.5). Leg 2: Banchero O22.5 ✗ (had 18pts, missed by 4.5). Neither star hit their over — DET's defensive game suppressed individual scoring.</div>
          <div style="margin-top:4px;"><strong>$1 Chaos (3-Leg ~+1450):</strong> ✗ LOSS — Leg 1: ORL ML ✗ (DET won 98-83). Leg 2: PHX +17.5 ✗ (OKC won by 13, PHX covered). Leg 3: Banchero O22.5 ✗ (18pts). ORL ML was the killer — DET dominated.</div>
          <div style="margin-top:4px;"><strong>DET Home Bounce-Back:</strong> ✓ HIT partially — DET ML ✓ but Cade O28.5 ✗ (27pts). <strong>OKC Depth Dominance:</strong> ✓/✗ Split — OKC ML ✓ but ORL +9.5 ✗ (DET won by 15).</div>
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

      <!-- ===== CHAOS SIM SPOTLIGHT — THU APR 30 ===== -->
      <div style="margin-bottom:20px;border-top:2px solid #a78bfa;padding-top:16px;">
        <div style="text-align:center;margin-bottom:12px;">
          <span style="font-size:12px;font-weight:700;color:#a78bfa;background:rgba(167,139,250,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">UNIFIED ENSEMBLE — Blended Model + Chaos Sim | Phase 41</span>
        </div>
        <div style="background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.2);border-radius:10px;padding:14px;margin-bottom:16px;">
          <div style="font-size:11px;color:#a78bfa;font-weight:700;margin-bottom:8px;">TONIGHT'S WIN PROBABILITIES (Phase 41 Unified Ensemble — All Systems Aligned)</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
            <div style="text-align:center;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);">
              <div style="font-size:10px;color:#888;">BOS-PHI G6</div>
              <div style="font-size:18px;font-weight:700;color:#60a5fa;">BOS 61%</div>
              <div style="font-size:9px;color:#666;">106-102 | SD ±11.3</div>
            </div>
            <div style="text-align:center;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);">
              <div style="font-size:10px;color:#888;">NYK-ATL G6</div>
              <div style="font-size:18px;font-weight:700;color:#60a5fa;">NYK 61%</div>
              <div style="font-size:9px;color:#666;">108-104 | SD ±11.4</div>
            </div>
            <div style="text-align:center;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);">
              <div style="font-size:10px;color:#888;">DEN-MIN G6</div>
              <div style="font-size:18px;font-weight:700;color:#60a5fa;">DEN 61%</div>
              <div style="font-size:9px;color:#666;">109-105 | SD ±11.3</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
            <div style="text-align:center;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);">
              <div style="font-size:10px;color:#888;">HOU-LAL G6</div>
              <div style="font-size:18px;font-weight:700;color:#ffc73a;">HOU 55%</div>
              <div style="font-size:9px;color:#666;">103-101 | COIN FLIP</div>
            </div>
            <div style="text-align:center;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);">
              <div style="font-size:10px;color:#888;">DET-ORL G6</div>
              <div style="font-size:18px;font-weight:700;color:#ff9800;">50/50</div>
              <div style="font-size:9px;color:#666;">~100-99 | TRUE COIN FLIP</div>
            </div>
            <div style="text-align:center;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);">
              <div style="font-size:10px;color:#888;">CLE-TOR G6</div>
              <div style="font-size:18px;font-weight:700;color:#3dd68c;">CLE 64%</div>
              <div style="font-size:9px;color:#666;">111-107 | STRONGEST</div>
            </div>
          </div>
          <div style="font-size:11px;color:#a78bfa;font-weight:700;margin-bottom:8px;">SERIES OUTCOME PROBABILITIES</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:10px;">
            <div style="padding:6px;border-radius:4px;background:rgba(0,0,0,0.2);text-align:center;"><span style="color:#3dd68c;">BOS 84%</span> to win series<br/><span style="color:#666;">G6: 56% | G7: 44%</span></div>
            <div style="padding:6px;border-radius:4px;background:rgba(0,0,0,0.2);text-align:center;"><span style="color:#3dd68c;">NYK 84%</span> to win series<br/><span style="color:#666;">G6: 57% | G7: 43%</span></div>
            <div style="padding:6px;border-radius:4px;background:rgba(0,0,0,0.2);text-align:center;"><span style="color:#3dd68c;">CLE 86%</span> to win series<br/><span style="color:#666;">G6: 59% | G7: 41%</span></div>
            <div style="padding:6px;border-radius:4px;background:rgba(0,0,0,0.2);text-align:center;"><span style="color:#ffc73a;">MIN 67%</span> to win series<br/><span style="color:#666;">G6: 44% | G7: 56%</span></div>
            <div style="padding:6px;border-radius:4px;background:rgba(0,0,0,0.2);text-align:center;"><span style="color:#ffc73a;">LAL 71%</span> to win series<br/><span style="color:#666;">G6: 48% | G7: 52%</span></div>
            <div style="padding:6px;border-radius:4px;background:rgba(0,0,0,0.2);text-align:center;"><span style="color:#ffc73a;">ORL 71%</span> to win series<br/><span style="color:#666;">G6: 48% | G7: 52%</span></div>
          </div>
          <div style="font-size:10px;color:#666;margin-top:8px;text-align:center;font-style:italic;">Phase 41 Ensemble: blended model picks winners (72.7%), sim generates probability distributions | SD ±11.6 calibrated to 28K games | 5/6 series aligned, 1 coin flip</div>
        </div>
      </div>

      <!-- ===== G6 FEATURED PARLAYS — THU APR 30 ===== -->
      <div style="margin-bottom:20px;border-top:2px solid #4caf50;padding-top:20px;">
        <div style="text-align:center;margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:#4caf50;background:rgba(76,175,80,0.12);padding:5px 16px;border-radius:20px;letter-spacing:0.5px;">TODAY — Thu Apr 30 | NYK-ATL G6, BOS-PHI G6, DEN-MIN G6</span>
        </div>

        <!-- $100 G6 BEST BET — THU APR 30 (SIM-INFORMED) -->
        <div class="parlay-card headline">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f0c040;">G6 $100 Play — Road Closers (2-Leg)</span>
            <span class="parlay-odds" style="background:rgba(240,192,64,0.2);color:#f0c040;font-size:16px;">~+200</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f0c040;background:rgba(240,192,64,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$100 &rarr; ~$300 return</span>
            <span style="font-size:11px;color:#4caf50;background:rgba(76,175,80,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">Thu Apr 30</span>
            <span style="font-size:10px;color:#a78bfa;background:rgba(167,139,250,0.12);padding:3px 8px;border-radius:4px;font-weight:600;">ENSEMBLE: 37% parlay hit rate</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">BOS ML @ PHI (BOS-PHI G6) &star;</span>
              <span class="parlay-leg-odds">-170</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED — Ensemble: 61%</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f0c040;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">NYK ML @ ATL (NYK-ATL G6)</span>
              <span class="parlay-leg-odds">-200</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED — Ensemble: 61%</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f0c040;"><strong>ENSEMBLE REALITY CHECK:</strong> Both legs are 61% per the unified model — all three systems agree on both winners. Parlay hit rate = 0.61 × 0.61 = 37%. Still +EV at +200 odds (implied 33%, ensemble says 37%), but thin margin. <strong>BOS ML</strong> — Ensemble shows 15% blowout chance but also 32% close game chance. Embiid's elimination mode is real. <strong>NYK ML</strong> — Brunson's dominance raises the floor but ATL's elimination desperation gives them a 39% upset window. Both systems agree = higher floor than Phase 40's conflicted picks.</div>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(240,192,64,0.2);">
            <div style="font-size:10px;color:#f0c040;font-weight:700;margin-bottom:4px;">ADD-ON: HIGH-CONFIDENCE PLAYER PROPS</div>
            <div style="font-size:10px;color:#aaa;">Embiid O28.5pts (-115, 72%) • Brunson O27.5pts (-125, 70%) • McCollum U20.5pts (-110, 65%) — all correlated with ML picks. Adding Embiid + Brunson props creates a 4-leg at ~+850.</div>
          </div>
        </div>

        <!-- $50 SIM-EDGE BET — THU APR 30 (NEW) -->
        <div class="parlay-card headline" style="border:1px solid #a78bfa;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#a78bfa;">G6 $50 Ensemble Edge — Best Value (2-Leg)</span>
            <span class="parlay-odds" style="background:rgba(167,139,250,0.2);color:#a78bfa;font-size:16px;">~+250</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#a78bfa;background:rgba(167,139,250,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$50 &rarr; ~$175 return</span>
            <span style="font-size:11px;color:#4caf50;background:rgba(76,175,80,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">NEW — Phase 41 Ensemble Pick</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">CLE ML @ TOR (CLE-TOR G6 — STRONGEST ENSEMBLE EDGE)</span>
              <span class="parlay-leg-odds">+110</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH — Ensemble: 64%</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">DEN +5.5 vs MIN (DEN-MIN G6 — Ensemble: DEN 61%)</span>
              <span class="parlay-leg-odds">-110</span>
              <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH — Ensemble: 79% cover</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#a78bfa;"><strong>THE ENSEMBLE'S BEST EDGES.</strong> These are the two games where the unified model found the biggest gap between its probability and the implied odds. <strong>CLE ML +110</strong> — the ensemble gives CLE 64% but +110 implies only 48%. That's a 16% edge. CLE has the deepest rotation (bench 36pts G5), multiple closers, and 86% series win probability. <strong>DEN +5.5</strong> — DEN wins outright 61% in the ensemble. Jokic at home in elimination is a force multiplier — 27/16ast/12reb in G5. Getting 5.5 points of cushion is enormous value. MIN missing Edwards (knee) + DiVincenzo (Achilles) makes DEN the clear play.</div>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(167,139,250,0.2);">
            <div style="font-size:10px;color:#a78bfa;font-weight:700;margin-bottom:4px;">ADD-ON: PLAYER PROP BOOSTERS</div>
            <div style="font-size:10px;color:#aaa;">Mitchell O24.5pts (-115, 67%) • Jokic O24.5pts (-120, 68%) • Jokic O10.5ast (+110, 60%) — correlated with ML picks. Adding Mitchell + Jokic pts creates a 4-leg at ~+700.</div>
          </div>
        </div>

        <!-- $1 CHAOS TICKET — THU APR 30 (UPDATED) -->
        <div class="parlay-card headline" style="border:1px solid #f44336;">
          <div class="parlay-header">
            <span class="parlay-name" style="font-size:16px;color:#f44336;">G6 $1 Chaos — Elimination Heroics (3-Leg)</span>
            <span class="parlay-odds" style="background:rgba(244,67,54,0.2);color:#f44336;font-size:16px;">~+2200</span>
          </div>
          <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
            <span style="font-size:11px;color:#f44336;background:rgba(244,67,54,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$1 &rarr; ~$23.00 return</span>
            <span style="font-size:11px;color:#ff9800;background:rgba(255,152,0,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">CONTRARIAN — Thu Apr 30</span>
            <span style="font-size:10px;color:#a78bfa;background:rgba(167,139,250,0.12);padding:3px 8px;border-radius:4px;font-weight:600;">ENSEMBLE: ~3.5% hit rate</span>
          </div>
          <div class="parlay-legs">
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">1</span>
              <span class="parlay-leg-pick">PHI ML vs BOS (Embiid elimination mode — ensemble: 39%)</span>
              <span class="parlay-leg-odds">+140</span>
              <span class="parlay-leg-conf" style="background:#5a4a1a;color:#ff9800;">MED</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">2</span>
              <span class="parlay-leg-pick">ATL ML vs NYK (Home elimination — ensemble: 39%)</span>
              <span class="parlay-leg-odds">+165</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
            </div>
            <div class="parlay-leg" style="border-left:3px solid #f44336;">
              <span class="parlay-leg-num">3</span>
              <span class="parlay-leg-pick">MIN ML @ DEN (Edwards OUT — massive underdog, ensemble: 39%)</span>
              <span class="parlay-leg-odds">+140</span>
              <span class="parlay-leg-conf" style="background:#5a2a2a;color:#f44336;">LOW</span>
            </div>
          </div>
          <div class="parlay-reasoning" style="border-left-color:#f44336;">Three underdog scenarios the ensemble says are each ~39%. <strong>PHI ML</strong> — Embiid's 33pts G5 + Wells Fargo crowd. Ensemble gives PHI 39% — that's 2 in 5 games, not a long shot. <strong>ATL ML</strong> — weakest leg. ATL's road win at MSG (G2) proves they can punch. State Farm in desperation mode. <strong>MIN ML</strong> — the longest shot. Edwards is OUT (knee, May 9), DiVincenzo OUT FOR SEASON. MIN went 0-2 without Ant and had 25 TOs in G5. All three hitting = 0.39³ = ~5.9%. At +2200 (implied 4.3%), this is technically +EV but the MIN leg drags it down significantly.</div>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(244,67,54,0.2);">
            <div style="font-size:10px;color:#f44336;font-weight:700;margin-bottom:4px;">CHAOS PROP ADD-ONS (if betting individually)</div>
            <div style="font-size:10px;color:#aaa;">Embiid O28.5pts (-115) pairs with PHI ML • Barnes O22.5pts (-110) for TOR elimination heroics • Cade O30.5pts (-105) if DET fights for survival</div>
          </div>
        </div>
      </div>

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

      <!-- ===== PARLAY HISTORY TIMELINE ===== -->
      <div style="margin-top:28px;border-top:1px solid #333;padding-top:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <div>
            <span style="font-size:15px;font-weight:700;color:#aaa;">Parlay History</span>
            <span style="font-size:11px;color:#666;margin-left:8px;">Featured $100 &amp; $1 picks — running record</span>
          </div>
          <div style="display:flex;gap:12px;font-size:12px;">
            <span style="color:#4caf50;font-weight:700;">$100 Record: 0-5</span>
            <span style="color:#f0c040;font-weight:700;">$1 Record: 2-3</span>
            <span style="color:#aaa;">Net P&amp;L: <span style="color:#f44336;">-$472.47</span></span>
          </div>
        </div>

        <div style="max-height:320px;overflow-y:auto;padding-right:4px;scrollbar-width:thin;scrollbar-color:#444 transparent;">

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

      <!-- ═══ HOU-LAL — NO G5 SCHEDULED YET ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#888;font-size:13px;font-weight:700;">HOU-LAL G5 — HOU 99-93 ❌ | LAL leads 3-2</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #888;">
        <span class="bet-type moneyline">INFO</span>
        <div class="bet-pick">HOU-LAL G5 — Awaiting Schedule</div>
        <div class="bet-line">LAL leads 3-1 | HOU won G4 115-96 at home</div>
        <div class="bet-reasoning">No G5 details yet. LAL leads 3-1 and can close out on the road. HOU showed life in G4 with a 19-point home win, cracking LAL's defensive scheme. Key question for G5: Does Redick adjust back after HOU's G4 explosion, or has HOU solved the zone? LAL's scheme was "structural" for 3 games but broke down at Toyota Center. If G5 is at LAL, expect LAL ML as a strong close-out play. Picks will be added once schedule is confirmed.</div>
        <span class="bet-edge matchup">Pending</span>
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
    <h3 style="color:#aaa;margin:0 0 4px;">Game 6 Picks — Thu Apr 30 &amp; Fri May 1</h3>
    <p style="color:#666;font-size:12px;margin-bottom:16px;">Phase 41 Unified Ensemble picks for all 6 remaining series. G5 ML Record: 5/7 (71.4%). Cumulative: 22/38 (57.9%). Three series play Thu Apr 30 (BOS-PHI, NYK-ATL, DEN-MIN), three play Fri May 1 (DET-ORL, CLE-TOR, HOU-LAL).</p>

    <!-- ═══════ G6 THU APR 30 ═══════ -->
    <div class="bet-section">
      <h4 style="color:#4caf50;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #4caf50;padding-bottom:6px;">G6 — Thu Apr 30 | BOS-PHI, NYK-ATL, DEN-MIN</h4>

      <!-- ═══ NYK-ATL G6 ═══ -->
      <div style="margin:12px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">NYK-ATL G6 — Thu Apr 30 | NYK leads 3-2 — Close-out @ ATL</span>
      </div>

      <div class="bet-card best-bet">
        <span class="bet-type moneyline">ML ★ BEST BET</span>
        <div class="bet-pick">NYK ML @ ATL (Close-out)</div>
        <div class="bet-line">-200 | Model: NYK by 7 | <span style="color:#4caf50;">Ensemble: NYK 61%</span> — Systems agree</div>
        <div class="bet-reasoning">Brunson's 39pt G5 masterpiece proved NYK's offensive ceiling is untouchable. McCollum completely schemed out (6pts G5). NYK already won at ATL in G4 by 16 — they can close on the road. ATL's home-court advantage is the only resistance, but NYK's 57% FG shooting and Brunson's mid-range dominance should travel. <strong>Ensemble confirms: 61% win probability, 15% blowout rate, 33% close game.</strong> Highest-confidence G6 pick.</div>
        <span class="bet-edge model">Model + Sim ✓</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jalen Brunson Over 27.5 points</div>
        <div class="bet-line">-125 | G5: 39pts (15-23 FG) | Series avg: 31.2pts | Close-out aggression</div>
        <div class="bet-reasoning">Brunson has been on a tear: 39pts G5 (65.2% FG), 28pts G4, averaging 31.2pts this series. His mid-range game is unschemmable — ATL has no answer for his pull-up jumper. In a close-out game, expect maximum usage. Even in ATL's home environment, Brunson's shot creation travels. The 27.5 line is too low given his series trajectory.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">CJ McCollum Under 20.5 points</div>
        <div class="bet-line">-110 | G5: 6pts (3-10 FG) | NYK's defensive scheme lock</div>
        <div class="bet-reasoning">McCollum has been completely schemed out of this series — 6pts G5, declining efficiency since G2's 32pt explosion. NYK's switching defense denies him clean looks, and ATL's offensive hierarchy has shifted to Kuminga/Murray. The under is the play until McCollum proves he can break the scheme.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- ═══ BOS-PHI G6 ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">BOS-PHI G6 — Thu Apr 30 | BOS leads 3-2 — Close-out @ PHI</span>
      </div>

      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">BOS ML @ PHI (Close-out)</div>
        <div class="bet-line">-170 | Model: BOS by 5 | <span style="color:#4caf50;">Ensemble: BOS 61%</span> — Systems agree</div>
        <div class="bet-reasoning">BOS's Q4 collapse in G5 (3-22 FG, 11pts) was an anomaly — championship DNA (2024 champs) suggests bounce-back. Tatum/Brown/Pritchard give BOS 3 initiators vs PHI's 2. BUT: Embiid proved he's an elimination monster (33pts G5), and Wells Fargo Center will be electric. BOS is the better team but road close-outs are never easy. <strong>Ensemble: 61% BOS, but 32% chance of a close game — Embiid eruption risk is real.</strong></div>
        <span class="bet-edge model">Model + Sim ✓</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Joel Embiid Over 28.5 points</div>
        <div class="bet-line">-115 | G5: 33pts | Elimination monster at home</div>
        <div class="bet-reasoning">Embiid proved Star Elevation is real with 33pts in G5 (only 2 in Q1 then 31 in final 3Q). At home facing elimination again, expect maximum aggression. His series arc has been building and Wells Fargo Center energy amplifies his dominance. Even if BOS wins, Embiid gets his 30+.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jayson Tatum Over 24.5 points</div>
        <div class="bet-line">-120 | Series avg: 26.8pts | Bounce-back game after Q4 collapse</div>
        <div class="bet-reasoning">Tatum was part of the historic Q4 collapse (3-22 FG team) in G5, but his series average is 26.8pts. Championship-caliber players respond to adversity. Expect a focused, aggressive Tatum in the close-out attempt. PHI's defense will focus on Brown, giving Tatum cleaner looks. The 24.5 line undervalues his bounce-back motivation.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <!-- ═══ DEN-MIN G6 ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#64b5f6;font-size:13px;font-weight:700;">DEN-MIN G6 — Thu Apr 30 | MIN leads 3-2 — Close-out @ DEN</span>
      </div>

      <div class="bet-card">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DEN ML vs MIN (Survival at home)</div>
        <div class="bet-line">-160 | Ensemble: DEN by 3 | <span style="color:#4caf50;">Ensemble: DEN 61%</span> — Systems agree</div>
        <div class="bet-reasoning"><strong>Phase 41 ENSEMBLE UPDATE — pick flipped to DEN.</strong> Edwards (knee) is OUT until May 9, DiVincenzo (Achilles) OUT FOR SEASON — MIN is missing both starting guards. The unified model now aligns: engine, blended system, and chaos sim all favor DEN at home. Jokic's triple-double brilliance (27/16ast/12reb G5) + Ball Arena desperation + MIN's guard-depleted chaos (25 TOs in G5) = DEN 61%. <strong>If Edwards miraculously plays, this reverts to a coin flip. But as of now, DEN ML is the play.</strong></div>
        <span class="bet-edge model">Model + Sim ✓</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Nikola Jokic Over 24.5 points</div>
        <div class="bet-line">-120 | G5: 27pts triple-double | Elimination desperation</div>
        <div class="bet-reasoning">Jokic was magnificent in G5: 27/16ast/12reb. Facing elimination at home, expect maximum scoring aggression from the 3x MVP. Without Edwards defending, MIN's interior defense is compromised. Jokic's post mastery is unguardable — 25+ in an elimination game at Ball Arena is near-automatic.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Nikola Jokic Over 10.5 assists</div>
        <div class="bet-line">+110 | G5: 16 assists | MIN's turnover chaos creates passing lanes</div>
        <div class="bet-reasoning">Jokic dished 16 assists in G5 as MIN's depleted backcourt created constant passing windows. Without Edwards and DiVincenzo, MIN's defensive rotations are a step slow — leading to open shooters off Jokic's reads. Spencer Jones (20pts G5) and role players are converting. The 10.5 line is beatable when Jokic is in orchestrator mode.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>
    </div>

    <!-- ═══════ G6 FRI MAY 1 ═══════ -->
    <div class="bet-section">
      <h4 style="color:#888;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #444;padding-bottom:6px;">G6 — Fri May 1 | DET-ORL, CLE-TOR, HOU-LAL</h4>

      <!-- ═══ DET-ORL G6 ═══ -->
      <div style="margin:12px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#888;font-size:13px;font-weight:700;">DET-ORL G6 — Fri May 1 | ORL leads 3-2 — DET faces elimination @ ORL</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #888;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">DET-ORL G6 — COIN FLIP (Lean ORL at home)</div>
        <div class="bet-line">-180 | Ensemble: ORL by 1 | <span style="color:#ff9800;">Ensemble: 50/50</span> — TRUE TOSS-UP</div>
        <div class="bet-reasoning"><strong>Phase 41 ENSEMBLE: genuine coin flip.</strong> Engine says DET, manual analysis says ORL — the blended system gives ORL by just 1 point, and the chaos sim sees 50.6% DET / 49.4% ORL. Essentially even. Wagner's status (calf, questionable) is the swing factor. Without Wagner, Cade's 45pt ceiling vs Banchero-alone = chaos. <strong>ORL's 8-1 home record is the tiebreaker, but -180 is massive overpricing for a coin flip. SKIP the ML, consider DET +5.5 spread as value.</strong></div>
        <span class="bet-edge" style="background:#ff9800;color:#000;">Coin Flip — Skip ML</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Cade Cunningham Over 30.5 points</div>
        <div class="bet-line">-105 | G5: 45pts (14-14 FT) | Elimination mode activated</div>
        <div class="bet-reasoning">Cade exploded for 45pts in G5 — a career playoff high. Facing elimination on the road, he'll carry maximum usage. His FT mastery (14-14 G5) gives him a reliable scoring floor even if shots aren't falling. The 30.5 line respects G5 but still undervalues elimination desperation. DET lives and dies with Cade — expect 30+ in a must-win.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Paolo Banchero Over 28.5 points</div>
        <div class="bet-line">-110 | G5: 45/9/7 | Wagner likely OUT elevates volume</div>
        <div class="bet-reasoning">Banchero matched Cade's 45 in G5 (the historic 45-45 duel) and with Wagner likely out (calf), he IS Orlando's offense. Without secondary creation, Banchero's usage will be astronomical. He's averaged 32pts in the last 3 games — the 28.5 line is too low for a de facto solo star at home in a close-out game.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- ═══ CLE-TOR G6 ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#888;font-size:13px;font-weight:700;">CLE-TOR G6 — Fri May 1 | CLE leads 3-2 — TOR faces elimination @ TOR</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #4caf50;">
        <span class="bet-type moneyline">ML ★ VALUE</span>
        <div class="bet-pick">CLE ML @ TOR (Close-out on road)</div>
        <div class="bet-line">+110 | Model: CLE by 3 | <span style="color:#4caf50;">Ensemble: CLE 64%</span> — STRONGEST EDGE</div>
        <div class="bet-reasoning">CLE's 3-2 lead means one win from advancing. Mobley's evolution to 3-level scorer changes matchup dynamics. CLE has multiple closers (Mitchell, Harden, Mobley) — hard to scheme for all three. TOR won both home games but CLE's bench depth (36pts G5) and Q4 defensive tightening (25-17 G5) travel. <strong>Ensemble: CLE 64% — highest G6 win probability. CLE at +110 is the biggest value edge (implied 47.6% vs ensemble 64%).</strong></div>
        <span class="bet-edge model">Model + Sim ✓</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Donovan Mitchell Over 24.5 points</div>
        <div class="bet-line">-115 | Series avg: 27.4pts | Close-out mentality</div>
        <div class="bet-reasoning">Mitchell has been CLE's primary scorer (27.4pts avg) and in a close-out game, expect maximum aggression. TOR's perimeter defense has been solid at home, but Mitchell's shot-creation versatility (mid-range, 3PT, drives) makes him impossible to fully contain. He'll get his 25+ regardless of game flow.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Scottie Barnes Over 22.5 points</div>
        <div class="bet-line">-110 | Home elimination: 33pts G3, 28pts G4 | Scotiabank fortress</div>
        <div class="bet-reasoning">Barnes has been electric at home — 33pts G3 and 28pts G4. Facing elimination at Scotiabank Arena, expect another massive effort. His physical play style thrives with home crowd energy. Even in G5 on the road he scored 25 with 12reb. The 22.5 line is very beatable for a home elimination game.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>

      <!-- ═══ HOU-LAL G6 ═══ -->
      <div style="margin:20px 0 8px;padding:6px 0;border-top:1px solid #444;">
        <span style="color:#888;font-size:13px;font-weight:700;">HOU-LAL G6 — Fri May 1 | LAL leads 3-2 — HOU faces elimination @ LAL</span>
      </div>

      <div class="bet-card" style="border-left:3px solid #ff9800;">
        <span class="bet-type moneyline">ML</span>
        <div class="bet-pick">HOU ML @ LAL (Elimination survival)</div>
        <div class="bet-line">+180 | Ensemble: HOU by 2 | <span style="color:#4caf50;">Ensemble: HOU 55%</span> — Systems agree</div>
        <div class="bet-reasoning"><strong>Phase 41 ENSEMBLE UPDATE — pick flipped to HOU.</strong> HOU has won G4 by 19 and G5 by 6 — back-to-back elimination survival with escalating confidence. Smith Jr hot (4-9 3PT G5), Ayton dominant (18/17reb). LAL showed cracks: LeBron 0-6 3PT G5, Reaves rusty (4-16 FG), Smart 6 TOs. HOU at +180 is strong value — implied 35.7% vs ensemble 55%. <strong>Biggest value edge on the board if HOU's road momentum travels.</strong></div>
        <span class="bet-edge model">Model + Sim ✓</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">LeBron James Over 25.5 points</div>
        <div class="bet-line">-110 | G5: 25pts (0-6 3PT) | Close-out game at home — max effort</div>
        <div class="bet-reasoning">LeBron scored 25pts in G5 despite going 0-6 from 3PT — imagine if even 2 of those fall. In a potential close-out game at Crypto.com Arena, expect vintage playoff LeBron. His scoring floor is high (13ast G1, 25pts G5) and the crowd energy + legacy narrative push him over 25.5. 3PT regression to the mean alone could push him to 30+.</div>
        <span class="bet-edge model">Model Edge</span>
      </div>

      <div class="bet-card">
        <span class="bet-type prop">PROP</span>
        <div class="bet-pick">Jalen Smith Jr Over 12.5 points</div>
        <div class="bet-line">+105 | G5: 22pts (4-9 3PT) | Emerging as HOU's X-factor</div>
        <div class="bet-reasoning">Smith Jr has emerged as HOU's most dangerous offensive weapon — 22pts in G5 with elite 3PT shooting (4-9). He's been HOU's sparkplug in elimination games and his confidence is at a series high. The line undervalues his expanded role with HOU playing free in elimination mode. Even at LAL, expect 13+ if he gets 25+ minutes.</div>
        <span class="bet-edge matchup">Matchup Edge</span>
      </div>
    </div>

    <!-- ═══════ G6 FEATURED PARLAY ═══════ -->
    <div class="bet-section">
      <h4 style="color:#a78bfa;margin:16px 0 12px;font-size:15px;border-bottom:1px solid #a78bfa;padding-bottom:6px;">G6 Player Props Parlay — High Confidence</h4>

      <div class="parlay-card headline" style="border:1px solid #a78bfa;">
        <div class="parlay-header">
          <span class="parlay-name" style="font-size:16px;color:#a78bfa;">G6 $75 Player Props Special — Star Elevation (4-Leg)</span>
          <span class="parlay-odds" style="background:rgba(167,139,250,0.2);color:#a78bfa;font-size:16px;">~+650</span>
        </div>
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;">
          <span style="font-size:11px;color:#a78bfa;background:rgba(167,139,250,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">$75 &rarr; ~$562 return</span>
          <span style="font-size:11px;color:#4caf50;background:rgba(76,175,80,0.12);padding:3px 8px;border-radius:4px;font-weight:700;">Thu-Fri Apr 30 - May 1</span>
          <span style="font-size:10px;color:#ff9800;background:rgba(255,152,0,0.12);padding:3px 8px;border-radius:4px;font-weight:600;">All HIGH confidence props</span>
        </div>
        <div class="parlay-legs">
          <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
            <span class="parlay-leg-num">1</span>
            <span class="parlay-leg-pick">Embiid O28.5pts (BOS-PHI G6) — Elimination monster, 33pts G5</span>
            <span class="parlay-leg-odds">-115</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH — 72%</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
            <span class="parlay-leg-num">2</span>
            <span class="parlay-leg-pick">Brunson O27.5pts (NYK-ATL G6) — 39pts G5, unguardable mid-range</span>
            <span class="parlay-leg-odds">-125</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH — 70%</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
            <span class="parlay-leg-num">3</span>
            <span class="parlay-leg-pick">Jokic O24.5pts (DEN-MIN G6) — No Edwards = easier scoring</span>
            <span class="parlay-leg-odds">-120</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH — 68%</span>
          </div>
          <div class="parlay-leg" style="border-left:3px solid #a78bfa;">
            <span class="parlay-leg-num">4</span>
            <span class="parlay-leg-pick">Mitchell O24.5pts (CLE-TOR G6) — Close-out aggression, 27.4 avg</span>
            <span class="parlay-leg-odds">-115</span>
            <span class="parlay-leg-conf" style="background:#2d5a2d;color:#4caf50;">HIGH — 67%</span>
          </div>
        </div>
        <div class="parlay-reasoning" style="border-left-color:#a78bfa;"><strong>THE STAR ELEVATION PARLAY.</strong> All four legs target stars in elimination/close-out games who have demonstrated elevated scoring. Combined probability: 0.72 × 0.70 × 0.68 × 0.67 = ~23%. At +650 odds (implied 13.3%), this is strongly +EV. Key insight: playoff stars consistently elevate in high-stakes games — Star Elevation Effect has been the model's most reliable signal all series. If any leg misses, it's Mitchell (TOR's home defense is legit), but even he has a 67% floor.</div>
      </div>
    </div>

    </div><!-- end betContent-g6 -->

    <!-- DISCLAIMER -->
    <div class="bets-disclaimer">
      <strong>Disclaimer:</strong> These picks are generated by a statistical model calibrated against 2025 NBA Playoff results (73.5% accuracy across 49 games) and updated with deep-dive research from Fadeaway World, Basketball Reference, and SI for the 2026 R1 slate. They are not guaranteed outcomes. All betting involves risk. Lines shown are approximate and may differ from your sportsbook. The model accounts for Home Court Advantage (round-adjusted), System Coherence, Championship DNA, Health Degradation, Star Ceiling Variance, Playoff Pedigree, and G1 Bayesian Updates — but cannot predict injuries, ejections, or one-game anomalies. Bet responsibly.
    </div>
  </div>`;
}
