// ============================================================
// Integration Tests for NBA Playoff Analyzer
// Run: node test-projections.js
// ============================================================

const fs = require('fs');
const path = require('path');

// Load all data files by evaluating them (they define globals)
function loadGlobals(includeEngine = false) {
  // Replace const/let with var so variables become context properties in vm
  const toVar = (code) => code.replace(/^(const|let) /gm, 'var ');
  const vm = require('vm');
  const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, Boolean, Number, String, RegExp, Date, Error });

  function load(rel) {
    vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), ctx);
  }

  // Data layer (always loaded)
  load('js/data/constants.js');
  load('js/data/series-data.js');
  load('js/data/boxscores.js');

  // Engine layer (only when running engine-level tests)
  if (includeEngine) {
    load('js/data/historical.js');
    load('js/utils.js');
    load('js/state.js');
    load('js/engine/fatigue.js');
    load('js/engine/chemistry.js');
    load('js/engine/matchups.js');
    load('js/engine/ratings.js');
    load('js/engine/scenarios.js');
    load('js/engine/projections.js');
  }
  return ctx;
}

// Standalone loader for validation tests — needs bets-data + validators
function loadValidatorContext() {
  const toVar = (code) => code.replace(/^(const|let) /gm, 'var ');
  const vm = require('vm');
  const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, Boolean, Number, String, RegExp, Date, Error });
  const load = (rel) => vm.runInContext(toVar(fs.readFileSync(path.join(__dirname, rel), 'utf8')), ctx);
  load('js/data/constants.js');
  load('js/data/series-data.js');
  load('js/data/boxscores.js');
  load('js/data/bets-data.js');
  load('js/data/news.js');
  load('js/validators.js');
  load('js/engine/auto-resolve.js');
  return ctx;
}

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, msg) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(msg);
    console.log(`  FAIL: ${msg}`);
  }
}

function runTests() {
  console.log('Loading data files...');
  const ctx = loadGlobals();
  const SERIES_DATA = ctx.SERIES_DATA;

  console.log(`Loaded ${SERIES_DATA.length} series.\n`);

  // ============================================================
  // TEST 1: All 8 series exist with required fields
  // ============================================================
  console.log('TEST 1: Series structure validation');
  const expectedIds = ['HOU-LAL', 'OKC-PHX', 'DEN-MIN', 'SAS-POR', 'DET-ORL', 'BOS-PHI', 'NYK-ATL', 'CLE-TOR'];
  expectedIds.forEach(id => {
    const s = SERIES_DATA.find(s => s.id === id);
    assert(!!s, `Series ${id} exists`);
    if (s) {
      assert(!!s.homeTeam, `${id} has homeTeam`);
      assert(!!s.awayTeam, `${id} has awayTeam`);
      assert(Array.isArray(s.games), `${id} has games array`);
      assert(s.games.length === 7, `${id} has 7 game slots`);
      assert(!!s.game1, `${id} has game1 prediction`);
    }
  });

  // ============================================================
  // TEST 2: BOS-PHI G2 box score corrections
  // ============================================================
  console.log('\nTEST 2: BOS-PHI G2 box score data integrity');
  const bosPhi = SERIES_DATA.find(s => s.id === 'BOS-PHI');
  const g2 = bosPhi.games[1]; // 0-indexed
  assert(g2.num === 2, 'G2 is game number 2');
  assert(g2.winner === 'PHI', 'G2 winner is PHI');
  assert(!!g2.boxScores, 'G2 has boxScores');

  if (g2.boxScores) {
    // Brown corrections
    const brown = g2.boxScores.home.find(p => p.name === 'Jaylen Brown');
    assert(!!brown, 'Brown found in home boxscore');
    if (brown) {
      assert(brown.fgm === 11, `Brown fgm should be 11, got ${brown.fgm}`);
      assert(brown.fga === 24, `Brown fga should be 24, got ${brown.fga}`);
      assert(brown.tpm === 5, `Brown tpm should be 5, got ${brown.tpm}`);
      assert(brown.tpa === 12, `Brown tpa should be 12, got ${brown.tpa}`);
      assert(brown.ftm === 9, `Brown ftm should be 9, got ${brown.ftm}`);
      assert(brown.fta === 12, `Brown fta should be 12, got ${brown.fta}`);
      assert(brown.reb === 7, `Brown reb should be 7, got ${brown.reb}`);
    }

    // Tatum corrections
    const tatum = g2.boxScores.home.find(p => p.name === 'Jayson Tatum');
    assert(!!tatum, 'Tatum found in home boxscore');
    if (tatum) {
      assert(tatum.min === 39, `Tatum min should be 39, got ${tatum.min}`);
      assert(tatum.reb === 14, `Tatum reb should be 14, got ${tatum.reb}`);
      assert(tatum.ast === 9, `Tatum ast should be 9, got ${tatum.ast}`);
      assert(tatum.tpa === 8, `Tatum tpa should be 8, got ${tatum.tpa}`);
      assert(tatum.blk === 0, `Tatum blk should be 0, got ${tatum.blk}`);
      assert(tatum.to === 3, `Tatum to should be 3, got ${tatum.to}`);
    }

    // White corrections
    const white = g2.boxScores.home.find(p => p.name === 'Derrick White');
    assert(!!white, 'White found in home boxscore');
    if (white) {
      assert(white.min === 39, `White min should be 39, got ${white.min}`);
      assert(white.pts === 8, `White pts should be 8, got ${white.pts}`);
      assert(white.fgm === 3, `White fgm should be 3, got ${white.fgm}`);
      assert(white.fga === 12, `White fga should be 12, got ${white.fga}`);
      assert(white.tpm === 2, `White tpm should be 2, got ${white.tpm}`);
      assert(white.tpa === 10, `White tpa should be 10, got ${white.tpa}`);
      assert(white.ftm === 0, `White ftm should be 0, got ${white.ftm}`);
      assert(white.fta === 0, `White fta should be 0, got ${white.fta}`);
      assert(white.reb === 2, `White reb should be 2, got ${white.reb}`);
      assert(white.ast === 3, `White ast should be 3, got ${white.ast}`);
      assert(white.stl === 0, `White stl should be 0, got ${white.stl}`);
      assert(white.blk === 2, `White blk should be 2, got ${white.blk}`);
      assert(white.to === 3, `White to should be 3, got ${white.to}`);
    }

    // Maxey corrections
    const maxey = g2.boxScores.away.find(p => p.name === 'Tyrese Maxey');
    assert(!!maxey, 'Maxey found in away boxscore');
    if (maxey) {
      assert(maxey.reb === 4, `Maxey reb should be 4, got ${maxey.reb}`);
      assert(maxey.ast === 9, `Maxey ast should be 9, got ${maxey.ast}`);
      assert(maxey.tpm === 5, `Maxey tpm should be 5, got ${maxey.tpm}`);
      assert(maxey.tpa === 12, `Maxey tpa should be 12, got ${maxey.tpa}`);
      assert(maxey.ftm === 2, `Maxey ftm should be 2, got ${maxey.ftm}`);
      assert(maxey.fta === 2, `Maxey fta should be 2, got ${maxey.fta}`);
      assert(maxey.stl === 2, `Maxey stl should be 2, got ${maxey.stl}`);
      assert(maxey.to === 1, `Maxey to should be 1, got ${maxey.to}`);
    }

    // Edgecombe corrections
    const edgecombe = g2.boxScores.away.find(p => p.name === 'VJ Edgecombe');
    assert(!!edgecombe, 'Edgecombe found in away boxscore');
    if (edgecombe) {
      assert(edgecombe.min === 35, `Edgecombe min should be 35, got ${edgecombe.min}`);
      assert(edgecombe.ast === 2, `Edgecombe ast should be 2, got ${edgecombe.ast}`);
    }
  }

  // ============================================================
  // TEST 3: G3 prediction consistency
  // ============================================================
  console.log('\nTEST 3: G3 prediction consistency');

  const confidenceRules = {
    // margin -> expected confidence
    // 0-3 = low, 4-6 = low-medium (accept "low" or "medium"), 7-11 = medium, 12-17 = high
  };

  function getExpectedConfidence(margin) {
    if (margin <= 3) return ['low'];
    if (margin <= 6) return ['low', 'low-medium', 'medium']; // borderline, accept medium too
    if (margin <= 11) return ['medium'];
    return ['high'];
  }

  SERIES_DATA.forEach(series => {
    const g3 = series.game3;
    if (!g3) return;

    const id = series.id;
    const homeAbbr = series.homeTeam.abbr;
    const awayAbbr = series.awayTeam.abbr;

    // Check pick matches projected winner
    if (g3.projScore && g3.pick) {
      const scoreMatch = g3.projScore.match(/(\w+)\s+(\d+)\s+.+\s+(\w+)\s+(\d+)/);
      if (scoreMatch) {
        const team1 = scoreMatch[1], score1 = parseInt(scoreMatch[2]);
        const team2 = scoreMatch[3], score2 = parseInt(scoreMatch[4]);
        const projWinner = score1 > score2 ? team1 : team2;
        assert(g3.pick === projWinner, `${id} G3: pick (${g3.pick}) matches projected winner (${projWinner})`);

        // Check confidence vs margin
        const margin = Math.abs(score1 - score2);
        const validConf = getExpectedConfidence(margin);
        assert(validConf.includes(g3.confidence),
          `${id} G3: confidence "${g3.confidence}" valid for ${margin}pt margin (expected one of: ${validConf.join(', ')})`);
      }
    }

    // Check spread/moneyline direction match
    if (g3.spread && g3.moneyline) {
      const spreadMatch = g3.spread.match(/(\w+)\s+-/);
      const mlMatch = g3.moneyline.match(/(\w+)\s+-/);
      if (spreadMatch && mlMatch) {
        assert(spreadMatch[1] === mlMatch[1],
          `${id} G3: spread favorite (${spreadMatch[1]}) matches ML favorite (${mlMatch[1]})`);
      }
    }

    // Check prosHome contains content about the series homeTeam
    if (g3.prosHome && g3.prosHome.length > 0) {
      const prosText = g3.prosHome.join(' ');
      // prosHome should reference homeTeam in SOME way (abbr or player names)
      const homePlayerNames = series.homeTeam.players.slice(0, 3).map(p => p.name.split(' ').pop());
      const referencesHome = prosText.includes(homeAbbr) || homePlayerNames.some(n => prosText.includes(n));
      assert(referencesHome,
        `${id} G3: prosHome references homeTeam (${homeAbbr})`);
    }
  });

  // ============================================================
  // TEST 4: Box score math validation (fgm + ftm checks)
  // ============================================================
  console.log('\nTEST 4: Box score math validation');

  SERIES_DATA.forEach(series => {
    if (!series.games) return;
    series.games.forEach(game => {
      if (!game.boxScores) return;
      ['home', 'away'].forEach(side => {
        const players = game.boxScores[side];
        if (!players) return;
        players.forEach(p => {
          // Some box scores use string format (e.g., fg:"3-4") instead of numeric (fgm:3, fga:4)
          // Skip validation for string-format box scores
          if (typeof p.fgm === 'undefined' && typeof p.fg === 'string') return;

          // pts should equal fgm*2 + tpm + ftm (roughly: pts = (fgm-tpm)*2 + tpm*3 + ftm)
          const expectedPts = (p.fgm - p.tpm) * 2 + p.tpm * 3 + p.ftm;
          assert(p.pts === expectedPts,
            `${series.id} G${game.num} ${p.name}: pts ${p.pts} should equal ${expectedPts} (fgm=${p.fgm}, tpm=${p.tpm}, ftm=${p.ftm})`);

          // fgm <= fga
          assert(p.fgm <= p.fga,
            `${series.id} G${game.num} ${p.name}: fgm (${p.fgm}) <= fga (${p.fga})`);
          // tpm <= tpa
          assert(p.tpm <= p.tpa,
            `${series.id} G${game.num} ${p.name}: tpm (${p.tpm}) <= tpa (${p.tpa})`);
          // ftm <= fta
          assert(p.ftm <= p.fta,
            `${series.id} G${game.num} ${p.name}: ftm (${p.ftm}) <= fta (${p.fta})`);
          // tpm <= fgm (3pt makes are a subset of field goal makes)
          assert(p.tpm <= p.fgm,
            `${series.id} G${game.num} ${p.name}: tpm (${p.tpm}) <= fgm (${p.fgm})`);
        });
      });
    });
  });

  // ============================================================
  // TEST 5: G3 reasoning text matches confidence field
  // ============================================================
  console.log('\nTEST 5: G3 reasoning text confidence consistency');

  SERIES_DATA.forEach(series => {
    const g3 = series.game3;
    if (!g3 || !g3.reasoning) return;
    const id = series.id;
    const reasoning = g3.reasoning.toUpperCase();
    const conf = g3.confidence;

    // Check the OPENING line for confidence (first 200 chars) to avoid
    // matching sub-scenario conditional confidence levels
    const openingText = reasoning.substring(0, 200);

    if (openingText.includes('HIGH CONFIDENCE') && conf !== 'high') {
      assert(false, `${id} G3: reasoning opening says HIGH confidence but field is "${conf}"`);
    } else if (openingText.includes('LOW CONFIDENCE') && conf !== 'low') {
      assert(false, `${id} G3: reasoning opening says LOW confidence but field is "${conf}"`);
    } else if (openingText.includes('MEDIUM CONFIDENCE') && conf !== 'medium') {
      assert(false, `${id} G3: reasoning opening says MEDIUM confidence but field is "${conf}"`);
    } else {
      passed++; // implicit pass
    }
  });

  // ============================================================
  // TEST 6: Compound Historical Scenarios engine wiring (Phase 52)
  // ============================================================
  // Verifies that CHS data and matching logic stay aligned: scenarios
  // fire for the players we expect, deltas point in the documented
  // direction, and the projection pipeline picks up the modifier.
  // (Replaces the ad-hoc test_scenarios.js dev script.)
  console.log('\nTEST 6: Compound Historical Scenarios engine wiring');
  const engineCtx = loadGlobals(true);
  const E = engineCtx; // shorthand
  const SD = E.SERIES_DATA;

  // 6a — OKC-LAL has compound scenarios for the named players
  const oklal = SD.find(s => s.id === 'OKC-LAL');
  assert(!!oklal, 'OKC-LAL series exists');
  if (oklal) {
    const keys = Object.keys(oklal.compoundScenarios || {});
    assert(keys.includes('Austin Reaves'), 'OKC-LAL compoundScenarios includes Austin Reaves');
    assert(keys.includes('Shai Gilgeous-Alexander'), 'OKC-LAL compoundScenarios includes SGA');

    // 6b — Reaves G1 context flags him as injured + away vs OKC + non-primary role
    const reaves = oklal.awayTeam.players.find(p => p.name.includes('Reaves'));
    assert(!!reaves, 'Reaves found in LAL roster');
    if (reaves) {
      const ctx = E.buildGameContext(reaves, oklal, 0, 'away');
      assert(ctx.oppAbbr === 'OKC', `Reaves ctx.oppAbbr is OKC (got "${ctx.oppAbbr}")`);
      assert(ctx.isHome === false, 'Reaves ctx.isHome is false');
      assert(ctx.hasActiveInjury === true, 'Reaves ctx.hasActiveInjury is true (oblique)');
      assert(['secondary','third','role'].includes(ctx.playerRole),
        `Reaves ctx.playerRole is non-primary (got "${ctx.playerRole}")`);

      // 6c — Reaves CHS fires with negative delta (vs OKC suppression)
      const rd = E.calcCompoundScenarioDelta(reaves, oklal, 0, 'away');
      assert(rd !== null, 'Reaves CHS delta is non-null for OKC-LAL G1 away');
      if (rd) {
        assert(rd.scenariosApplied.length >= 1, 'Reaves: at least 1 scenario fires');
        assert(rd.ptsDelta < 0, `Reaves CHS ptsDelta is negative (got ${rd.ptsDelta})`);
      }

      // 6d — Reaves full projection includes the Compound modifier
      const rf = E.calcExpectedPlayerStats(reaves, oklal, 0, 'away');
      assert(typeof rf.pts === 'number' && rf.pts >= 0, 'Reaves full projection has numeric pts');
      const compoundMod = rf.modifiers.find(m => m.label && m.label.includes('Compound'));
      assert(!!compoundMod, 'Reaves projection.modifiers contains a Compound entry');
    }

    // 6e — SGA CHS fires (post-rust + vs LAL dominance)
    const sga = oklal.homeTeam.players.find(p => p.name.includes('Gilgeous'));
    if (sga) {
      const sd = E.calcCompoundScenarioDelta(sga, oklal, 0, 'home');
      assert(sd !== null && sd.scenariosApplied.length >= 1, 'SGA CHS fires for OKC-LAL G1 home');
    }

    // 6f — Cascade summary populates effects for LAL
    const summary = E.getTeamScenarioSummary(oklal, 0, 'away');
    assert(!!summary, 'getTeamScenarioSummary returns object for LAL G1');
    if (summary) {
      assert(Array.isArray(summary.cascadeEffects), 'cascadeEffects is an array');
    }
  }

  // 6g — Other R2 series fire CHS for the headline players
  const cases = [
    { id:'NYK-PHI', side:'home', last:'Brunson' },
    { id:'DET-CLE', side:'home', last:'Cunningham' },
    { id:'SAS-MIN', side:'home', last:'Wembanyama' },
  ];
  cases.forEach(({ id, side, last }) => {
    const series = SD.find(s => s.id === id);
    if (!series) { assert(false, `${id} series exists`); return; }
    const team = side === 'home' ? series.homeTeam : series.awayTeam;
    const player = team.players.find(p => p.name.includes(last));
    if (!player) { assert(false, `${id}: ${last} found in roster`); return; }
    const d = E.calcCompoundScenarioDelta(player, series, 0, side);
    assert(d !== null && d.scenariosApplied.length >= 1, `${id} ${last} G1: at least 1 CHS scenario fires`);
  });

  // ============================================================
  // TEST 7: Duplicate-key sweep (regression guard for the
  //   `result: null` overwriting `result: {outcome:...}` bug + the
  //   Embiid-style two-activeInjury bug)
  // ============================================================
  console.log('\nTEST 7: Duplicate-key regression sweep');
  {
    // Player records inside series-data
    const seriesSrc = fs.readFileSync(path.join(__dirname, 'js/data/series-data.js'), 'utf8');
    let inPlayer = false; let braceCount = 0; let buf = '';
    const playerDupes = [];
    seriesSrc.split('\n').forEach((line) => {
      if (!inPlayer && /^\s*\{\s*name:\"/.test(line)) {
        inPlayer = true; buf = line; braceCount = 0;
        for (const ch of line) { if (ch==='{') braceCount++; else if (ch==='}') braceCount--; }
        if (braceCount === 0) { check(buf); inPlayer=false; buf=''; }
      } else if (inPlayer) {
        buf += '\n' + line;
        for (const ch of line) { if (ch==='{') braceCount++; else if (ch==='}') braceCount--; }
        if (braceCount === 0) { check(buf); inPlayer=false; buf=''; }
      }
    });
    function check(rec) {
      const stripped = rec.replace(/\"[^\"\\]*(?:\\.[^\"\\]*)*\"/g, '""');
      const counts = {};
      const re = /(?:^|[\s,{])([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
      let m; while ((m = re.exec(stripped)) !== null) counts[m[1]] = (counts[m[1]]||0) + 1;
      const dupes = Object.entries(counts).filter(([,v]) => v > 1);
      if (dupes.length) {
        const id = (rec.match(/name:\"([^\"]+)\"/)||[])[1] || '<unknown>';
        playerDupes.push(id + ' — ' + dupes.map(d => d[0]+'×'+d[1]).join(', '));
      }
    }
    assert(playerDupes.length === 0, `series-data.js player records have no duplicate keys (found: ${playerDupes.join('; ')})`);

    // Bet records inside bets-data — count top-level `result:` per record
    const betsSrc = fs.readFileSync(path.join(__dirname, 'js/data/bets-data.js'), 'utf8');
    const betDupes = [];
    let inBet = false; let recId = ''; let resultCount = 0;
    betsSrc.split('\n').forEach((line) => {
      if (/^  \{$/.test(line)) { inBet = true; recId = ''; resultCount = 0; return; }
      if (inBet) {
        const idMatch = line.match(/^\s+id:\s*['"]([^'"]+)/);
        if (idMatch) recId = idMatch[1];
        if (/^\s\s\s\sresult:/.test(line)) resultCount++;
        if (/^\s\s\}/.test(line)) {
          if (resultCount > 1) betDupes.push(recId + ' (' + resultCount + ' result: keys)');
          inBet = false;
        }
      }
    });
    assert(betDupes.length === 0, `bets-data.js bets/parlays have no duplicate result keys (found: ${betDupes.join('; ')})`);
  }

  // ============================================================
  // TEST 8: Schema validation (Tier 1.1 boot-time validators)
  //   Asserts validateAll() returns zero errors against the live
  //   data files. Catches duplicate keys, prediction↔score
  //   contradictions, missing fields, type mismatches, and bad
  //   series references — all the bug classes we've actually hit.
  // ============================================================
  console.log('\nTEST 8: Schema validation');
  {
    const vctx = loadValidatorContext();
    const errs = vctx.validateAll(vctx.SERIES_DATA, vctx.BETS, vctx.FEATURED_PARLAYS, vctx.BET_SLATES);

    // 8a — main assertion: zero errors
    if (errs.length === 0) {
      assert(true, 'validateAll returns 0 errors');
    } else {
      console.log(`  ${errs.length} validation error(s):`);
      errs.forEach(e => console.log(`    - ${e}`));
      assert(false, `validateAll found ${errs.length} schema issue(s) — see above`);
    }

    // 8b — sanity: a known-bad object trips the right validator
    const badPred = { homeWin: false, homeScore: 110, awayScore: 100, margin: 10 };
    const badPredErrs = vctx.validatePrediction(badPred, 'TEST');
    assert(
      badPredErrs.some(e => e.includes('contradicts scores')),
      'validatePrediction catches homeWin↔scores contradiction'
    );

    // 8c — sanity: bad outcome enum is caught
    const badBet = { id:'x', slate:'R2-G2', series:'NYK-PHI', game:2, type:'ml', pick:'NYK ML', result:{outcome:'won'} };
    const badBetErrs = vctx.validateBet(badBet, new Set(['NYK-PHI']));
    assert(
      badBetErrs.some(e => e.includes("not in [win|loss|push|void]")),
      'validateBet catches invalid outcome enum'
    );

    // 8d — sanity: missing required field is caught
    const badParlay = { id:'p', slate:'R2-G2', date:'2026-05-07', category:'floor', name:'X', odds:'+100', stake:100, legs:[{pick:'a',odds:'-100'}], thesis:'t' };
    const goodParlayErrs = vctx.validateParlay(badParlay, new Set());
    assert(goodParlayErrs.length === 0, 'validateParlay accepts a well-formed parlay');

    delete badParlay.thesis;
    const missingThesis = vctx.validateParlay(badParlay, new Set());
    assert(
      missingThesis.some(e => e.includes('missing thesis')),
      'validateParlay catches missing required field'
    );
  }

  // ============================================================
  // TEST 9: Auto-resolve reconciliation (Tier 1.3)
  //   For every bet with a declared result on a finished game,
  //   the auto-resolver must agree. Catches stale results, copy-
  //   paste errors, and bets pointing at the wrong game number.
  // ============================================================
  console.log('\nTEST 9: Auto-resolve reconciliation');
  {
    const vctx = loadValidatorContext();
    const recon = vctx.reconcileAllBets(vctx.BETS, vctx.SERIES_DATA);
    const disagreements = recon.filter(r => r.status === 'disagree');

    if (disagreements.length === 0) {
      assert(true, 'reconcileAllBets: 0 disagreements between declared and computed outcomes');
    } else {
      console.log(`  ${disagreements.length} bet(s) disagree with the auto-resolver:`);
      disagreements.forEach(d => {
        console.log(`    - ${d.betId}: declared=${d.declared.outcome} (${d.declared.actual}); computed=${d.computed.outcome} (${d.computed.actual})`);
      });
      assert(false, `reconcileAllBets found ${disagreements.length} declared/computed mismatch(es) — see above`);
    }

    // 9a — coverage check: at least one resolved game produces an
    //       'agree' verdict, so we know the resolver actually ran.
    const agrees = recon.filter(r => r.status === 'agree');
    assert(agrees.length > 0, 'reconcileAllBets: at least one bet resolved successfully');

    // 9b — sanity: a fabricated mismatch IS flagged.
    const fakeBet = {
      id:'fake', slate:'R2-G1', series:'NYK-PHI', game:1, type:'ml',
      pick:'PHI ML vs NYK', odds:'+260',
      result:{ outcome:'win', actual:'PHI won (lie)' },
    };
    const fakeRecon = vctx.reconcileBet(fakeBet, vctx.SERIES_DATA);
    assert(fakeRecon.status === 'disagree', 'reconcileBet flags fabricated win where loser was picked');

    // 9c — sanity: the resolver picks the right team for a real ML bet.
    const realML = { id:'real', series:'NYK-PHI', game:1, type:'ml', pick:'NYK ML vs PHI' };
    const realComp = vctx.resolveBetAgainstData(realML, vctx.SERIES_DATA);
    assert(realComp && realComp.outcome === 'win', 'resolveBetAgainstData computes ML win for NYK in G1');

    // 9d — sanity: total resolution math
    const totalBet = { id:'t', series:'SAS-MIN', game:1, type:'total', pick:'Under 220.5' };
    const totalComp = vctx.resolveBetAgainstData(totalBet, vctx.SERIES_DATA);
    assert(totalComp && totalComp.outcome === 'win', 'resolveBetAgainstData computes Under hit for SAS-MIN G1 (206 total)');
  }

  // ============================================================
  // TEST 10: Stale-label linter (Tier 1.4)
  //   Sweeps source files for date strings paired with TODAY/
  //   TONIGHT markers. If the date precedes CURRENT_DATE, the
  //   label is stale — yesterday's slate label that didn't get
  //   bumped when the day rolled forward. Catches the class of
  //   bug where the page shows "Tonight (May 5)" three days late.
  //
  //   Scope: scans bets-data.js, bets.js, home.js, learnings.js.
  //   Skips lines containing archive/result markers (intentional
  //   historical references).
  // ============================================================
  console.log('\nTEST 10: Stale-label linter');
  {
    const monthMap = { jan:1, feb:2, mar:3, apr:4, may:5, jun:6, jul:7, aug:8, sep:9, oct:10, nov:11, dec:12 };
    // Lines (±10 window) that contain any of these markers are historical
    // context — resolved parlay legs, archived recaps, phase-history entries.
    // We skip dates near them because they're describing the past, not "today".
    const archiveMarkers = /ARCHIVED|archived|recap|Recap|RESULT|HISTORY|prior|VOIDED|Last Game|R1 RESULTS|R2 RESULTS|❌|✅|LOST|WON|HIT|MISS|PENDING|DEAD|completed|Completed|Phase \d+|phase-history|G[1-7] Recap/;

    function findStaleLabels(filePath, currentDate) {
      const text = fs.readFileSync(filePath, 'utf8');
      const lines = text.split('\n');
      const cy = parseInt(currentDate.slice(0,4), 10);
      const cm = parseInt(currentDate.slice(5,7), 10);
      const cd = parseInt(currentDate.slice(8,10), 10);
      const cTotal = cy * 10000 + cm * 100 + cd;
      const dateRe = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})\b/i;
      const todayRe = /\b(TODAY|TONIGHT)\b/i;
      const WINDOW = 10;
      const issues = [];
      lines.forEach((line, idx) => {
        if (!todayRe.test(line)) return;
        const m = line.match(dateRe);
        if (!m) return;
        // Skip if any nearby line has an archive marker (resolved parlay context).
        const lo = Math.max(0, idx - WINDOW);
        const hi = Math.min(lines.length - 1, idx + WINDOW);
        for (let i = lo; i <= hi; i++) {
          if (archiveMarkers.test(lines[i])) return;
        }
        const month = monthMap[m[1].toLowerCase().slice(0,3)];
        const day = parseInt(m[2], 10);
        if (!month || !day) return;
        const total = cy * 10000 + month * 100 + day;
        if (total < cTotal) {
          const snippet = line.trim().slice(0, 110);
          issues.push(`${path.relative(__dirname, filePath)}:${idx + 1} — "${m[0]}" precedes CURRENT_DATE (${currentDate}): ${snippet}`);
        }
      });
      return issues;
    }

    const vctx = loadValidatorContext();
    // learnings.js is a phase-history timeline by design — every old date
    // inside is intentional. Skip it.
    const targetFiles = [
      'js/data/bets-data.js',
      'js/ui/bets.js',
      'js/ui/home.js',
    ];
    const allStale = [];
    targetFiles.forEach(rel => {
      const abs = path.join(__dirname, rel);
      if (!fs.existsSync(abs)) return;
      allStale.push(...findStaleLabels(abs, vctx.CURRENT_DATE));
    });

    if (allStale.length === 0) {
      assert(true, 'findStaleLabels: 0 stale TODAY/TONIGHT labels referencing past dates');
    } else {
      console.log(`  ${allStale.length} stale label(s) found:`);
      allStale.forEach(s => console.log(`    - ${s}`));
      assert(false, `findStaleLabels found ${allStale.length} stale TODAY/TONIGHT label(s) — see above`);
    }

    // 10a — sanity: a fabricated stale label IS flagged.
    const tmpFile = path.join(__dirname, '.tmp-stale-test.txt');
    fs.writeFileSync(tmpFile, 'Featured parlays — May 1 (TONIGHT)');
    const fakeIssues = findStaleLabels(tmpFile, vctx.CURRENT_DATE);
    fs.unlinkSync(tmpFile);
    assert(fakeIssues.length === 1, 'findStaleLabels flags a fabricated stale label');

    // 10b — sanity: a future-dated label is NOT flagged.
    const tmpFile2 = path.join(__dirname, '.tmp-future-test.txt');
    fs.writeFileSync(tmpFile2, 'Featured parlays — Dec 31 (TONIGHT)');
    const futureIssues = findStaleLabels(tmpFile2, vctx.CURRENT_DATE);
    fs.unlinkSync(tmpFile2);
    assert(futureIssues.length === 0, 'findStaleLabels does NOT flag a future-dated label');
  }

  // ============================================================
  // TEST 11: Prediction homeWin/score/margin internal consistency
  // ------------------------------------------------------------
  // Each series.games[N].prediction holds three fields whose values
  // must agree internally:
  //   homeWin (bool) — true iff homeScore > awayScore
  //   margin (int)   — must equal |homeScore - awayScore|
  // The Series Analysis renderer derives the displayed favorite +
  // score from these fields (not the reasoning prose), so a swap
  // (e.g. homeWin:true paired with homeScore < awayScore) silently
  // produces a card that contradicts the reasoning underneath.
  // Pre-existing bug found May 8 in NYK-PHI G3 + SAS-MIN G3.
  // ============================================================
  console.log('\nTEST 11: Prediction homeWin/score/margin consistency');

  SERIES_DATA.forEach(series => {
    if (!series.games) return;
    series.games.forEach(game => {
      const p = game.prediction;
      if (!p) return;
      // Skip if score fields aren't fully populated (placeholder predictions OK)
      if (typeof p.homeScore !== 'number' || typeof p.awayScore !== 'number') return;
      if (typeof p.homeWin !== 'boolean') return;

      const id = `${series.id} G${game.num} prediction`;
      const expectedHomeWin = p.homeScore > p.awayScore;
      const tied = p.homeScore === p.awayScore;
      if (!tied) {
        assert(p.homeWin === expectedHomeWin,
          `${id}: homeWin (${p.homeWin}) inconsistent with scores (home ${p.homeScore}, away ${p.awayScore})`);
      }
      if (typeof p.margin === 'number') {
        const expectedMargin = Math.abs(p.homeScore - p.awayScore);
        assert(p.margin === expectedMargin,
          `${id}: margin (${p.margin}) should equal |homeScore - awayScore| = ${expectedMargin}`);
      }
    });
  });

  // ============================================================
  // RESULTS
  // ============================================================
  console.log('\n============================================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log('============================================================');
  if (failures.length > 0) {
    console.log('\nFAILURES:');
    failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
