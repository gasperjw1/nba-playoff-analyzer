// ============================================================
// Integration Tests for NBA Playoff Analyzer
// Run: node test-projections.js
// ============================================================

const fs = require('fs');
const path = require('path');

// Load all data files by evaluating them (they define globals)
function loadGlobals() {
  // series-data.js defines SERIES_DATA, TURNOVER_FOUL_DATA, THREE_POINT_VARIANCE_DATA, ROLE_FLEXIBILITY_DATA
  const seriesDataCode = fs.readFileSync(path.join(__dirname, 'js/data/series-data.js'), 'utf8');
  const constantsCode = fs.readFileSync(path.join(__dirname, 'js/data/constants.js'), 'utf8');
  const boxscoresCode = fs.readFileSync(path.join(__dirname, 'js/data/boxscores.js'), 'utf8');

  // Replace const/let with var so variables become context properties in vm
  const toVar = (code) => code.replace(/^(const|let) /gm, 'var ');

  const vm = require('vm');
  const ctx = vm.createContext({ console, Math, Array, Object, Set, Map, JSON, parseInt, parseFloat, isNaN, Boolean, Number, String, RegExp, Date, Error });
  vm.runInContext(toVar(constantsCode), ctx);
  vm.runInContext(toVar(seriesDataCode), ctx);
  vm.runInContext(toVar(boxscoresCode), ctx);
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
