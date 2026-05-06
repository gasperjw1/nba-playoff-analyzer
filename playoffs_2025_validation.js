// 2025 NBA Playoffs — Complete Game-by-Game Validation Dataset
// Source: Basketball Reference (https://www.basketball-reference.com/playoffs/NBA_2025_games.html)
// Purpose: Independent validation of patterns found in 2026 R1 data

const PLAYOFFS_2025 = {
  // ============================================================
  // ROUND 1 — EAST
  // ============================================================

  // (4) IND vs (5) MIL — IND 4-1
  'IND-MIL': {
    round: 'R1', conference: 'East',
    favorite: 'IND', favSeed: 4, underdog: 'MIL', dogSeed: 5,
    seriesResult: '4-1', favWon: true,
    games: [
      { game: 1, home: 'IND', away: 'MIL', homeScore: 117, awayScore: 98,  winner: 'IND', margin: 19, ot: false },
      { game: 2, home: 'IND', away: 'MIL', homeScore: 123, awayScore: 115, winner: 'IND', margin: 8,  ot: false },
      { game: 3, home: 'MIL', away: 'IND', homeScore: 117, awayScore: 101, winner: 'MIL', margin: 16, ot: false },
      { game: 4, home: 'MIL', away: 'IND', homeScore: 103, awayScore: 129, winner: 'IND', margin: 26, ot: false },
      { game: 5, home: 'IND', away: 'MIL', homeScore: 119, awayScore: 118, winner: 'IND', margin: 1,  ot: true  },
    ]
  },

  // (3) NYK vs (6) DET — NYK 4-2
  'NYK-DET': {
    round: 'R1', conference: 'East',
    favorite: 'NYK', favSeed: 3, underdog: 'DET', dogSeed: 6,
    seriesResult: '4-2', favWon: true,
    games: [
      { game: 1, home: 'NYK', away: 'DET', homeScore: 123, awayScore: 112, winner: 'NYK', margin: 11, ot: false },
      { game: 2, home: 'NYK', away: 'DET', homeScore: 94,  awayScore: 100, winner: 'DET', margin: 6,  ot: false },
      { game: 3, home: 'DET', away: 'NYK', homeScore: 116, awayScore: 118, winner: 'NYK', margin: 2,  ot: false },
      { game: 4, home: 'DET', away: 'NYK', homeScore: 93,  awayScore: 94,  winner: 'NYK', margin: 1,  ot: false },
      { game: 5, home: 'NYK', away: 'DET', homeScore: 103, awayScore: 106, winner: 'DET', margin: 3,  ot: false },
      { game: 6, home: 'DET', away: 'NYK', homeScore: 113, awayScore: 116, winner: 'NYK', margin: 3,  ot: false },
    ]
  },

  // (2) BOS vs (7) ORL — BOS 4-1
  'BOS-ORL': {
    round: 'R1', conference: 'East',
    favorite: 'BOS', favSeed: 2, underdog: 'ORL', dogSeed: 7,
    seriesResult: '4-1', favWon: true,
    games: [
      { game: 1, home: 'BOS', away: 'ORL', homeScore: 103, awayScore: 86,  winner: 'BOS', margin: 17, ot: false },
      { game: 2, home: 'BOS', away: 'ORL', homeScore: 109, awayScore: 100, winner: 'BOS', margin: 9,  ot: false },
      { game: 3, home: 'ORL', away: 'BOS', homeScore: 95,  awayScore: 93,  winner: 'ORL', margin: 2,  ot: false },
      { game: 4, home: 'ORL', away: 'BOS', homeScore: 98,  awayScore: 107, winner: 'BOS', margin: 9,  ot: false },
      { game: 5, home: 'BOS', away: 'ORL', homeScore: 120, awayScore: 89,  winner: 'BOS', margin: 31, ot: false },
    ]
  },

  // (1) CLE vs (8) MIA — CLE 4-0
  'CLE-MIA': {
    round: 'R1', conference: 'East',
    favorite: 'CLE', favSeed: 1, underdog: 'MIA', dogSeed: 8,
    seriesResult: '4-0', favWon: true,
    games: [
      { game: 1, home: 'CLE', away: 'MIA', homeScore: 121, awayScore: 100, winner: 'CLE', margin: 21, ot: false },
      { game: 2, home: 'CLE', away: 'MIA', homeScore: 121, awayScore: 112, winner: 'CLE', margin: 9,  ot: false },
      { game: 3, home: 'MIA', away: 'CLE', homeScore: 87,  awayScore: 124, winner: 'CLE', margin: 37, ot: false },
      { game: 4, home: 'MIA', away: 'CLE', homeScore: 83,  awayScore: 138, winner: 'CLE', margin: 55, ot: false },
    ]
  },

  // ============================================================
  // ROUND 1 — WEST
  // ============================================================

  // (1) OKC vs (8) MEM — OKC 4-0
  'OKC-MEM': {
    round: 'R1', conference: 'West',
    favorite: 'OKC', favSeed: 1, underdog: 'MEM', dogSeed: 8,
    seriesResult: '4-0', favWon: true,
    games: [
      { game: 1, home: 'OKC', away: 'MEM', homeScore: 131, awayScore: 80,  winner: 'OKC', margin: 51, ot: false },
      { game: 2, home: 'OKC', away: 'MEM', homeScore: 118, awayScore: 99,  winner: 'OKC', margin: 19, ot: false },
      { game: 3, home: 'MEM', away: 'OKC', homeScore: 108, awayScore: 114, winner: 'OKC', margin: 6,  ot: false },
      { game: 4, home: 'MEM', away: 'OKC', homeScore: 115, awayScore: 117, winner: 'OKC', margin: 2,  ot: false },
    ]
  },

  // (2) DEN vs (7) LAC — DEN 4-3
  'DEN-LAC': {
    round: 'R1', conference: 'West',
    favorite: 'DEN', favSeed: 2, underdog: 'LAC', dogSeed: 7,
    seriesResult: '4-3', favWon: true,
    games: [
      { game: 1, home: 'DEN', away: 'LAC', homeScore: 112, awayScore: 110, winner: 'DEN', margin: 2,  ot: true  },
      { game: 2, home: 'DEN', away: 'LAC', homeScore: 102, awayScore: 105, winner: 'LAC', margin: 3,  ot: false },
      { game: 3, home: 'LAC', away: 'DEN', homeScore: 117, awayScore: 83,  winner: 'LAC', margin: 34, ot: false },
      { game: 4, home: 'LAC', away: 'DEN', homeScore: 99,  awayScore: 101, winner: 'DEN', margin: 2,  ot: false },
      { game: 5, home: 'DEN', away: 'LAC', homeScore: 131, awayScore: 115, winner: 'DEN', margin: 16, ot: false },
      { game: 6, home: 'LAC', away: 'DEN', homeScore: 111, awayScore: 105, winner: 'LAC', margin: 6,  ot: false },
      { game: 7, home: 'DEN', away: 'LAC', homeScore: 120, awayScore: 101, winner: 'DEN', margin: 19, ot: false },
    ]
  },

  // LAL (home court) vs MIN — MIN 4-1 (underdog wins series!)
  'LAL-MIN': {
    round: 'R1', conference: 'West',
    favorite: 'LAL', favSeed: 6, underdog: 'MIN', dogSeed: 3,
    seriesResult: '1-4', favWon: false,
    // NOTE: MIN was likely the better team despite LAL having home court
    // Seeding may have been affected by play-in or other factors
    games: [
      { game: 1, home: 'LAL', away: 'MIN', homeScore: 95,  awayScore: 117, winner: 'MIN', margin: 22, ot: false },
      { game: 2, home: 'LAL', away: 'MIN', homeScore: 94,  awayScore: 85,  winner: 'LAL', margin: 9,  ot: false },
      { game: 3, home: 'MIN', away: 'LAL', homeScore: 116, awayScore: 104, winner: 'MIN', margin: 12, ot: false },
      { game: 4, home: 'MIN', away: 'LAL', homeScore: 116, awayScore: 113, winner: 'MIN', margin: 3,  ot: false },
      { game: 5, home: 'LAL', away: 'MIN', homeScore: 96,  awayScore: 103, winner: 'MIN', margin: 7,  ot: false },
    ]
  },

  // HOU (home court) vs GSW — GSW 4-3 (underdog wins series!)
  'HOU-GSW': {
    round: 'R1', conference: 'West',
    favorite: 'HOU', favSeed: 5, underdog: 'GSW', dogSeed: 4,
    seriesResult: '3-4', favWon: false,
    games: [
      { game: 1, home: 'HOU', away: 'GSW', homeScore: 85,  awayScore: 95,  winner: 'GSW', margin: 10, ot: false },
      { game: 2, home: 'HOU', away: 'GSW', homeScore: 109, awayScore: 94,  winner: 'HOU', margin: 15, ot: false },
      { game: 3, home: 'GSW', away: 'HOU', homeScore: 104, awayScore: 93,  winner: 'GSW', margin: 11, ot: false },
      { game: 4, home: 'GSW', away: 'HOU', homeScore: 109, awayScore: 106, winner: 'GSW', margin: 3,  ot: false },
      { game: 5, home: 'HOU', away: 'GSW', homeScore: 131, awayScore: 116, winner: 'HOU', margin: 15, ot: false },
      { game: 6, home: 'GSW', away: 'HOU', homeScore: 107, awayScore: 115, winner: 'HOU', margin: 8,  ot: false },
      { game: 7, home: 'HOU', away: 'GSW', homeScore: 89,  awayScore: 103, winner: 'GSW', margin: 14, ot: false },
    ]
  },

  // ============================================================
  // ROUND 2 — EAST
  // ============================================================

  // (1) CLE vs (4) IND — IND 4-1 (underdog wins series!)
  'CLE-IND-R2': {
    round: 'R2', conference: 'East',
    favorite: 'CLE', favSeed: 1, underdog: 'IND', dogSeed: 4,
    seriesResult: '1-4', favWon: false,
    games: [
      { game: 1, home: 'CLE', away: 'IND', homeScore: 112, awayScore: 121, winner: 'IND', margin: 9,  ot: false },
      { game: 2, home: 'CLE', away: 'IND', homeScore: 119, awayScore: 120, winner: 'IND', margin: 1,  ot: false },
      { game: 3, home: 'IND', away: 'CLE', homeScore: 104, awayScore: 126, winner: 'CLE', margin: 22, ot: false },
      { game: 4, home: 'IND', away: 'CLE', homeScore: 129, awayScore: 109, winner: 'IND', margin: 20, ot: false },
      { game: 5, home: 'CLE', away: 'IND', homeScore: 105, awayScore: 114, winner: 'IND', margin: 9,  ot: false },
    ]
  },

  // (2) BOS vs (3) NYK — NYK 4-2 (underdog wins series!)
  'BOS-NYK-R2': {
    round: 'R2', conference: 'East',
    favorite: 'BOS', favSeed: 2, underdog: 'NYK', dogSeed: 3,
    seriesResult: '2-4', favWon: false,
    // NOTE: Tatum ruptured Achilles in G4
    games: [
      { game: 1, home: 'BOS', away: 'NYK', homeScore: 105, awayScore: 108, winner: 'NYK', margin: 3,  ot: true  },
      { game: 2, home: 'BOS', away: 'NYK', homeScore: 90,  awayScore: 91,  winner: 'NYK', margin: 1,  ot: false },
      { game: 3, home: 'NYK', away: 'BOS', homeScore: 93,  awayScore: 115, winner: 'BOS', margin: 22, ot: false },
      { game: 4, home: 'NYK', away: 'BOS', homeScore: 121, awayScore: 113, winner: 'NYK', margin: 8,  ot: false },
      { game: 5, home: 'BOS', away: 'NYK', homeScore: 127, awayScore: 102, winner: 'BOS', margin: 25, ot: false },
      { game: 6, home: 'NYK', away: 'BOS', homeScore: 119, awayScore: 81,  winner: 'NYK', margin: 38, ot: false },
    ]
  },

  // ============================================================
  // ROUND 2 — WEST
  // ============================================================

  // (1) OKC vs (2) DEN — OKC 4-3
  'OKC-DEN-R2': {
    round: 'R2', conference: 'West',
    favorite: 'OKC', favSeed: 1, underdog: 'DEN', dogSeed: 2,
    seriesResult: '4-3', favWon: true,
    games: [
      { game: 1, home: 'OKC', away: 'DEN', homeScore: 119, awayScore: 121, winner: 'DEN', margin: 2,  ot: false },
      { game: 2, home: 'OKC', away: 'DEN', homeScore: 149, awayScore: 106, winner: 'OKC', margin: 43, ot: false },
      { game: 3, home: 'DEN', away: 'OKC', homeScore: 113, awayScore: 104, winner: 'DEN', margin: 9,  ot: true  },
      { game: 4, home: 'DEN', away: 'OKC', homeScore: 87,  awayScore: 92,  winner: 'OKC', margin: 5,  ot: false },
      { game: 5, home: 'OKC', away: 'DEN', homeScore: 112, awayScore: 105, winner: 'OKC', margin: 7,  ot: false },
      { game: 6, home: 'DEN', away: 'OKC', homeScore: 119, awayScore: 107, winner: 'DEN', margin: 12, ot: false },
      { game: 7, home: 'OKC', away: 'DEN', homeScore: 125, awayScore: 93,  winner: 'OKC', margin: 32, ot: false },
    ]
  },

  // MIN vs GSW — MIN 4-1
  'MIN-GSW-R2': {
    round: 'R2', conference: 'West',
    favorite: 'MIN', favSeed: 3, underdog: 'GSW', dogSeed: 4,
    seriesResult: '4-1', favWon: true,
    games: [
      { game: 1, home: 'MIN', away: 'GSW', homeScore: 88,  awayScore: 99,  winner: 'GSW', margin: 11, ot: false },
      { game: 2, home: 'MIN', away: 'GSW', homeScore: 117, awayScore: 93,  winner: 'MIN', margin: 24, ot: false },
      { game: 3, home: 'GSW', away: 'MIN', homeScore: 97,  awayScore: 102, winner: 'MIN', margin: 5,  ot: false },
      { game: 4, home: 'GSW', away: 'MIN', homeScore: 110, awayScore: 117, winner: 'MIN', margin: 7,  ot: false },
      { game: 5, home: 'MIN', away: 'GSW', homeScore: 121, awayScore: 110, winner: 'MIN', margin: 11, ot: false },
    ]
  },

  // ============================================================
  // CONFERENCE FINALS
  // ============================================================

  // ECF: NYK (home court) vs IND — IND 4-2 (underdog wins!)
  'NYK-IND-CF': {
    round: 'CF', conference: 'East',
    favorite: 'NYK', favSeed: 3, underdog: 'IND', dogSeed: 4,
    seriesResult: '2-4', favWon: false,
    games: [
      { game: 1, home: 'NYK', away: 'IND', homeScore: 135, awayScore: 138, winner: 'IND', margin: 3,  ot: true  },
      { game: 2, home: 'NYK', away: 'IND', homeScore: 109, awayScore: 114, winner: 'IND', margin: 5,  ot: false },
      { game: 3, home: 'IND', away: 'NYK', homeScore: 100, awayScore: 106, winner: 'NYK', margin: 6,  ot: false },
      { game: 4, home: 'IND', away: 'NYK', homeScore: 130, awayScore: 121, winner: 'IND', margin: 9,  ot: false },
      { game: 5, home: 'NYK', away: 'IND', homeScore: 111, awayScore: 94,  winner: 'NYK', margin: 17, ot: false },
      { game: 6, home: 'IND', away: 'NYK', homeScore: 125, awayScore: 108, winner: 'IND', margin: 17, ot: false },
    ]
  },

  // WCF: OKC vs MIN — OKC 4-1
  'OKC-MIN-CF': {
    round: 'CF', conference: 'West',
    favorite: 'OKC', favSeed: 1, underdog: 'MIN', dogSeed: 3,
    seriesResult: '4-1', favWon: true,
    games: [
      { game: 1, home: 'OKC', away: 'MIN', homeScore: 114, awayScore: 88,  winner: 'OKC', margin: 26, ot: false },
      { game: 2, home: 'OKC', away: 'MIN', homeScore: 118, awayScore: 103, winner: 'OKC', margin: 15, ot: false },
      { game: 3, home: 'MIN', away: 'OKC', homeScore: 143, awayScore: 101, winner: 'MIN', margin: 42, ot: false },
      { game: 4, home: 'MIN', away: 'OKC', homeScore: 126, awayScore: 128, winner: 'OKC', margin: 2,  ot: false },
      { game: 5, home: 'OKC', away: 'MIN', homeScore: 124, awayScore: 94,  winner: 'OKC', margin: 30, ot: false },
    ]
  },

  // ============================================================
  // FINALS
  // ============================================================

  // OKC vs IND — OKC 4-3
  'OKC-IND-F': {
    round: 'Finals', conference: null,
    favorite: 'OKC', favSeed: 1, underdog: 'IND', dogSeed: 4,
    seriesResult: '4-3', favWon: true,
    games: [
      { game: 1, home: 'OKC', away: 'IND', homeScore: 110, awayScore: 111, winner: 'IND', margin: 1,  ot: false },
      { game: 2, home: 'OKC', away: 'IND', homeScore: 123, awayScore: 107, winner: 'OKC', margin: 16, ot: false },
      { game: 3, home: 'IND', away: 'OKC', homeScore: 116, awayScore: 107, winner: 'IND', margin: 9,  ot: false },
      { game: 4, home: 'IND', away: 'OKC', homeScore: 104, awayScore: 111, winner: 'OKC', margin: 7,  ot: false },
      { game: 5, home: 'OKC', away: 'IND', homeScore: 120, awayScore: 109, winner: 'OKC', margin: 11, ot: false },
      { game: 6, home: 'IND', away: 'OKC', homeScore: 108, awayScore: 91,  winner: 'IND', margin: 17, ot: false },
      { game: 7, home: 'OKC', away: 'IND', homeScore: 103, awayScore: 91,  winner: 'OKC', margin: 12, ot: false },
    ]
  },
};

// ============================================================
// ANALYSIS 1: Underdog Win Patterns
// ============================================================
function analyzeUnderdogPatterns() {
  console.log('\n' + '='.repeat(70));
  console.log('ANALYSIS 1: UNDERDOG WIN PATTERNS — 2025 NBA PLAYOFFS');
  console.log('='.repeat(70));

  const allGames = [];
  const seriesList = [];

  for (const [id, series] of Object.entries(PLAYOFFS_2025)) {
    const dogTeam = series.underdog;
    const favTeam = series.favorite;

    seriesList.push({
      id, round: series.round,
      fav: favTeam, dog: dogTeam,
      favWon: series.favWon,
      totalGames: series.games.length,
      seriesResult: series.seriesResult
    });

    series.games.forEach((g, i) => {
      const isDogWin = g.winner === dogTeam;
      const dogIsHome = g.home === dogTeam;
      const prevGame = i > 0 ? series.games[i - 1] : null;

      // Check for post-blowout bounce-back
      let postBlowout = false;
      if (prevGame) {
        const prevWinner = prevGame.winner;
        const prevMargin = prevGame.margin;
        if (prevWinner === favTeam && prevMargin >= 15) {
          postBlowout = true;
        }
      }

      allGames.push({
        seriesId: id, round: series.round,
        game: g.game,
        fav: favTeam, dog: dogTeam,
        winner: g.winner, margin: g.margin,
        isDogWin, dogIsHome,
        isHome: g.winner === g.home,
        postBlowout,
        ot: g.ot
      });
    });
  }

  // --- Overall underdog win rate ---
  const totalGames = allGames.length;
  const dogWins = allGames.filter(g => g.isDogWin).length;
  console.log(`\nTotal games: ${totalGames}`);
  console.log(`Underdog wins: ${dogWins} (${(dogWins/totalGames*100).toFixed(1)}%)`);
  console.log(`Favorite wins: ${totalGames - dogWins} (${((totalGames-dogWins)/totalGames*100).toFixed(1)}%)`);

  // --- By round ---
  console.log('\n--- Underdog Win Rate by Round ---');
  for (const round of ['R1', 'R2', 'CF', 'Finals']) {
    const roundGames = allGames.filter(g => g.round === round);
    const roundDogWins = roundGames.filter(g => g.isDogWin).length;
    if (roundGames.length > 0) {
      console.log(`  ${round}: ${roundDogWins}/${roundGames.length} (${(roundDogWins/roundGames.length*100).toFixed(1)}%)`);
    }
  }

  // --- R1 specifically (for comparison with 2026 R1) ---
  const r1Games = allGames.filter(g => g.round === 'R1');
  const r1DogWins = r1Games.filter(g => g.isDogWin).length;
  console.log(`\n--- R1 Comparison (2025 vs 2026) ---`);
  console.log(`  2025 R1: Underdogs won ${r1DogWins}/${r1Games.length} (${(r1DogWins/r1Games.length*100).toFixed(1)}%)`);
  console.log(`  2026 R1: Underdogs won 20/48 (41.7%) [from prior analysis]`);

  // --- Home vs Road for underdogs ---
  const dogHome = allGames.filter(g => g.isDogWin && g.dogIsHome);
  const dogRoad = allGames.filter(g => g.isDogWin && !g.dogIsHome);
  const dogHomeGames = allGames.filter(g => g.dogIsHome);
  const dogRoadGames = allGames.filter(g => !g.dogIsHome);
  console.log(`\n--- Underdog Win Rate by Venue ---`);
  console.log(`  At HOME: ${dogHome.length}/${dogHomeGames.length} (${(dogHome.length/dogHomeGames.length*100).toFixed(1)}%)`);
  console.log(`  On ROAD: ${dogRoad.length}/${dogRoadGames.length} (${(dogRoad.length/dogRoadGames.length*100).toFixed(1)}%)`);

  // --- By game number ---
  console.log(`\n--- Underdog Win Rate by Game Number ---`);
  for (let gn = 1; gn <= 7; gn++) {
    const gnGames = allGames.filter(g => g.game === gn);
    const gnDogWins = gnGames.filter(g => g.isDogWin).length;
    if (gnGames.length > 0) {
      console.log(`  G${gn}: ${gnDogWins}/${gnGames.length} (${(gnDogWins/gnGames.length*100).toFixed(1)}%)`);
    }
  }

  // --- Post-blowout bounce-back ---
  const postBlowoutGames = allGames.filter(g => g.postBlowout);
  const postBlowoutDogWins = postBlowoutGames.filter(g => g.isDogWin).length;
  console.log(`\n--- Post-Blowout (15+) Bounce-Back ---`);
  console.log(`  Games after fav blowout: ${postBlowoutGames.length}`);
  console.log(`  Underdog wins after blowout: ${postBlowoutDogWins}/${postBlowoutGames.length}`);
  postBlowoutGames.forEach(g => {
    console.log(`    ${g.seriesId} G${g.game}: ${g.isDogWin ? g.dog + ' BOUNCED BACK' : g.fav + ' won again'} (margin: ${g.margin})`);
  });

  // --- Win alternation ---
  let alternations = 0, totalTransitions = 0;
  for (const [id, series] of Object.entries(PLAYOFFS_2025)) {
    for (let i = 1; i < series.games.length; i++) {
      totalTransitions++;
      if (series.games[i].winner !== series.games[i-1].winner) {
        alternations++;
      }
    }
  }
  console.log(`\n--- Win Alternation ---`);
  console.log(`  Transitions: ${totalTransitions}`);
  console.log(`  Alternations: ${alternations} (${(alternations/totalTransitions*100).toFixed(1)}%)`);
  console.log(`  Same-winner streaks: ${totalTransitions - alternations} (${((totalTransitions-alternations)/totalTransitions*100).toFixed(1)}%)`);

  // --- Underdog series wins ---
  const underdogSeriesWins = seriesList.filter(s => !s.favWon);
  console.log(`\n--- Underdog Series Wins ---`);
  console.log(`  Total series: ${seriesList.length}`);
  console.log(`  Underdog won series: ${underdogSeriesWins.length}/${seriesList.length} (${(underdogSeriesWins.length/seriesList.length*100).toFixed(1)}%)`);
  underdogSeriesWins.forEach(s => {
    console.log(`    ${s.id}: ${s.dog} (${s.round}) over ${s.fav} — ${s.seriesResult}`);
  });

  // --- Series length distribution ---
  console.log(`\n--- Series Length Distribution ---`);
  const lengths = { 4: 0, 5: 0, 6: 0, 7: 0 };
  seriesList.forEach(s => { lengths[s.totalGames]++; });
  const avgLen = seriesList.reduce((sum, s) => sum + s.totalGames, 0) / seriesList.length;
  for (const [len, count] of Object.entries(lengths)) {
    console.log(`  ${len} games: ${count} series (${(count/seriesList.length*100).toFixed(1)}%)`);
  }
  console.log(`  Average: ${avgLen.toFixed(1)} games`);
  console.log(`  2026 R1 average: 5.9 games [from prior analysis]`);

  // --- Margin distribution ---
  const margins = allGames.map(g => g.margin);
  const avgMargin = margins.reduce((a,b) => a+b, 0) / margins.length;
  const closeGames = margins.filter(m => m <= 5).length;
  const blowouts = margins.filter(m => m >= 15).length;
  console.log(`\n--- Margin Distribution ---`);
  console.log(`  Average margin: ${avgMargin.toFixed(1)} pts`);
  console.log(`  Close games (≤5): ${closeGames}/${totalGames} (${(closeGames/totalGames*100).toFixed(1)}%)`);
  console.log(`  Blowouts (≥15): ${blowouts}/${totalGames} (${(blowouts/totalGames*100).toFixed(1)}%)`);

  // --- Extreme blowouts ---
  const extremeBlowouts = allGames.filter(g => g.margin >= 30).sort((a,b) => b.margin - a.margin);
  console.log(`\n--- Extreme Blowouts (30+) ---`);
  extremeBlowouts.forEach(g => {
    console.log(`  ${g.seriesId} G${g.game}: ${g.winner} by ${g.margin} (${g.isDogWin ? 'UNDERDOG' : 'favorite'})`);
  });
}

// ============================================================
// ANALYSIS 2: Resilience & Bounce-Back Patterns
// ============================================================
function analyzeResilience() {
  console.log('\n' + '='.repeat(70));
  console.log('ANALYSIS 2: RESILIENCE & BOUNCE-BACK PATTERNS');
  console.log('='.repeat(70));

  for (const [id, series] of Object.entries(PLAYOFFS_2025)) {
    const games = series.games;
    if (games.length <= 4 && series.favWon) continue; // Skip sweeps by favorites

    const dogTeam = series.underdog;
    const favTeam = series.favorite;

    console.log(`\n--- ${id} (${series.round}) ---`);
    console.log(`  Favorite: ${favTeam} | Underdog: ${dogTeam} | Result: ${series.favWon ? favTeam : dogTeam} won ${series.seriesResult}`);

    let dogTrail = 0, favTrail = 0;
    let maxDeficit = 0;
    let bouncebacks = 0;

    games.forEach((g, i) => {
      const isDogWin = g.winner === dogTeam;
      if (isDogWin) dogTrail++; else favTrail++;

      const deficit = favTrail - dogTrail; // positive = dog is behind
      if (deficit > maxDeficit) maxDeficit = deficit;

      // Bounce-back: dog wins after losing
      if (i > 0 && isDogWin && games[i-1].winner === favTeam) {
        bouncebacks++;
        const prevMargin = games[i-1].margin;
        console.log(`    G${g.game}: ${dogTeam} bounced back after G${i} loss (prev margin: ${prevMargin}, this margin: ${g.margin})`);
      }
    });

    console.log(`  Max underdog deficit: 0-${maxDeficit}`);
    console.log(`  Underdog bounce-backs: ${bouncebacks}`);
  }

  // --- Post-loss margin analysis ---
  console.log('\n--- Post-Loss Margin Compression ---');
  console.log('When a team loses by X, what happens next game?');

  const transitions = [];
  for (const [id, series] of Object.entries(PLAYOFFS_2025)) {
    for (let i = 1; i < series.games.length; i++) {
      const prev = series.games[i-1];
      const curr = series.games[i];
      const sameWinner = prev.winner === curr.winner;
      transitions.push({
        seriesId: id,
        prevMargin: prev.margin,
        prevWinner: prev.winner,
        currMargin: curr.margin,
        currWinner: curr.winner,
        sameWinner,
        loserBounced: !sameWinner
      });
    }
  }

  // Group by prev margin buckets
  const buckets = [
    { label: 'Close (1-5)', min: 1, max: 5 },
    { label: 'Medium (6-14)', min: 6, max: 14 },
    { label: 'Blowout (15-29)', min: 15, max: 29 },
    { label: 'Demolition (30+)', min: 30, max: 999 },
  ];

  for (const bucket of buckets) {
    const inBucket = transitions.filter(t => t.prevMargin >= bucket.min && t.prevMargin <= bucket.max);
    if (inBucket.length === 0) continue;
    const bounced = inBucket.filter(t => t.loserBounced).length;
    const avgNextMargin = inBucket.reduce((s, t) => s + t.currMargin, 0) / inBucket.length;
    console.log(`  After ${bucket.label} loss: ${bounced}/${inBucket.length} losers won next (${(bounced/inBucket.length*100).toFixed(0)}%), avg next margin: ${avgNextMargin.toFixed(1)}`);
  }
}

// ============================================================
// ANALYSIS 3: Home Court Impact
// ============================================================
function analyzeHomeCourt() {
  console.log('\n' + '='.repeat(70));
  console.log('ANALYSIS 3: HOME COURT ADVANTAGE');
  console.log('='.repeat(70));

  const allGames = [];
  for (const [id, series] of Object.entries(PLAYOFFS_2025)) {
    series.games.forEach(g => {
      allGames.push({
        ...g,
        seriesId: id, round: series.round,
        fav: series.favorite, dog: series.underdog
      });
    });
  }

  const homeWins = allGames.filter(g => g.winner === g.home).length;
  console.log(`\nOverall home win rate: ${homeWins}/${allGames.length} (${(homeWins/allGames.length*100).toFixed(1)}%)`);

  // By round
  console.log('\n--- Home Win Rate by Round ---');
  for (const round of ['R1', 'R2', 'CF', 'Finals']) {
    const rg = allGames.filter(g => g.round === round);
    const hw = rg.filter(g => g.winner === g.home).length;
    if (rg.length > 0) {
      console.log(`  ${round}: ${hw}/${rg.length} (${(hw/rg.length*100).toFixed(1)}%)`);
    }
  }

  // Average margin for home vs away wins
  const homeWinMargins = allGames.filter(g => g.winner === g.home).map(g => g.margin);
  const awayWinMargins = allGames.filter(g => g.winner !== g.home).map(g => g.margin);
  const avgHomeWinMargin = homeWinMargins.reduce((a,b)=>a+b,0)/homeWinMargins.length;
  const avgAwayWinMargin = awayWinMargins.reduce((a,b)=>a+b,0)/awayWinMargins.length;
  console.log(`\n  Avg home win margin: ${avgHomeWinMargin.toFixed(1)} pts`);
  console.log(`  Avg away win margin: ${avgAwayWinMargin.toFixed(1)} pts`);

  // Game 7s specifically
  const g7s = allGames.filter(g => g.game === 7);
  console.log(`\n--- Game 7s ---`);
  console.log(`  Total: ${g7s.length}`);
  const g7HomeWins = g7s.filter(g => g.winner === g.home).length;
  console.log(`  Home wins: ${g7HomeWins}/${g7s.length}`);
  g7s.forEach(g => {
    console.log(`    ${g.seriesId}: ${g.winner} (${g.winner === g.home ? 'HOME' : 'AWAY'}) by ${g.margin}`);
  });
}

// ============================================================
// ANALYSIS 4: Series Length vs Win Probability
// ============================================================
function analyzeSeriesLength() {
  console.log('\n' + '='.repeat(70));
  console.log('ANALYSIS 4: SERIES LENGTH vs EXPECTED LENGTH');
  console.log('='.repeat(70));

  // For each series, calculate what a typical model would predict
  // Based on seed differential → approximate win probability
  const seedDiffToWinProb = {
    0: 0.52,  // 4v5, 3v4 etc — slight edge
    1: 0.57,  // 3v5, 2v4 etc
    2: 0.62,
    3: 0.67,
    4: 0.72,
    5: 0.77,
    6: 0.82,
    7: 0.87,  // 1v8
  };

  function expectedSeriesLength(p) {
    // Probability of winning in exactly N games using binomial
    const p4 = Math.pow(p, 4);
    const p5 = 4 * Math.pow(p, 4) * (1-p);
    const p6 = 10 * Math.pow(p, 4) * Math.pow(1-p, 2);
    const p7 = 20 * Math.pow(p, 4) * Math.pow(1-p, 3);

    const q4 = Math.pow(1-p, 4);
    const q5 = 4 * Math.pow(1-p, 4) * p;
    const q6 = 10 * Math.pow(1-p, 4) * Math.pow(p, 2);
    const q7 = 20 * Math.pow(1-p, 4) * Math.pow(p, 3);

    return 4*(p4+q4) + 5*(p5+q5) + 6*(p6+q6) + 7*(p7+q7);
  }

  let totalExpected = 0, totalActual = 0, seriesCount = 0;

  console.log('\n  Series                 | Seed Gap | Est P(fav) | Exp Len | Actual | Error');
  console.log('  ' + '-'.repeat(80));

  for (const [id, series] of Object.entries(PLAYOFFS_2025)) {
    const seedGap = Math.abs(series.favSeed - series.dogSeed);
    const estP = seedDiffToWinProb[Math.min(seedGap, 7)] || 0.55;
    const expLen = expectedSeriesLength(estP);
    const actualLen = series.games.length;
    const error = actualLen - expLen;

    totalExpected += expLen;
    totalActual += actualLen;
    seriesCount++;

    const padId = id.padEnd(20);
    console.log(`  ${padId} | ${seedGap}        | ${(estP*100).toFixed(0)}%        | ${expLen.toFixed(1)}    | ${actualLen}      | ${error >= 0 ? '+' : ''}${error.toFixed(1)}`);
  }

  console.log('  ' + '-'.repeat(80));
  console.log(`  AVERAGE               |          |            | ${(totalExpected/seriesCount).toFixed(1)}    | ${(totalActual/seriesCount).toFixed(1)}      | ${((totalActual-totalExpected)/seriesCount >= 0 ? '+' : '')}${((totalActual-totalExpected)/seriesCount).toFixed(1)}`);
  console.log(`\n  Model expects avg ${(totalExpected/seriesCount).toFixed(1)} games, reality is ${(totalActual/seriesCount).toFixed(1)} games`);
  console.log(`  2026 R1: Model expected 4.2, actual 5.9 (+1.8 error)`);
}

// ============================================================
// ANALYSIS 5: Momentum & Streaks
// ============================================================
function analyzeMomentum() {
  console.log('\n' + '='.repeat(70));
  console.log('ANALYSIS 5: MOMENTUM & STREAK PATTERNS');
  console.log('='.repeat(70));

  // Track 2+ game win streaks and what happens after
  let streakOf2 = 0, streakOf3 = 0, streakOf4 = 0;
  let afterStreak2Continues = 0, afterStreak2Breaks = 0;

  for (const [id, series] of Object.entries(PLAYOFFS_2025)) {
    const games = series.games;
    for (let i = 0; i < games.length; i++) {
      // Check for streak of 2+
      if (i >= 1 && games[i].winner === games[i-1].winner) {
        streakOf2++;
        // Check if streak continues
        if (i + 1 < games.length) {
          if (games[i+1].winner === games[i].winner) {
            afterStreak2Continues++;
          } else {
            afterStreak2Breaks++;
          }
        }

        if (i >= 2 && games[i].winner === games[i-2].winner) {
          streakOf3++;
          if (i >= 3 && games[i].winner === games[i-3].winner) {
            streakOf4++;
          }
        }
      }
    }
  }

  console.log(`\n  2-game win streaks: ${streakOf2}`);
  console.log(`  3-game win streaks: ${streakOf3}`);
  console.log(`  4-game win streaks: ${streakOf4}`);
  console.log(`  After 2-game streak: continued ${afterStreak2Continues}, broke ${afterStreak2Breaks}`);
  if (afterStreak2Continues + afterStreak2Breaks > 0) {
    console.log(`  Streak break rate: ${(afterStreak2Breaks/(afterStreak2Continues+afterStreak2Breaks)*100).toFixed(0)}%`);
  }

  // --- Elimination game performance ---
  console.log('\n--- Elimination Game Performance ---');
  let elimGames = 0, elimSaves = 0;

  for (const [id, series] of Object.entries(PLAYOFFS_2025)) {
    const games = series.games;
    let favWins = 0, dogWins = 0;

    for (const g of games) {
      if (g.winner === series.favorite) favWins++;
      else dogWins++;

      // Check if this was an elimination game for either team
      const favFacing = dogWins === 3 && favWins < 4;
      const dogFacing = favWins === 3 && dogWins < 4;

      if (favFacing || dogFacing) {
        elimGames++;
        const facingTeam = favFacing ? series.favorite : series.underdog;
        const saved = g.winner === facingTeam;
        if (saved) elimSaves++;
        console.log(`  ${id} G${g.game}: ${facingTeam} facing elimination → ${saved ? 'SURVIVED' : 'ELIMINATED'} (margin: ${g.margin})`);
      }
    }
  }
  console.log(`\n  Total elimination games: ${elimGames}`);
  console.log(`  Saves: ${elimSaves}/${elimGames} (${(elimSaves/elimGames*100).toFixed(0)}%)`);
}

// ============================================================
// RUN ALL ANALYSES
// ============================================================
analyzeUnderdogPatterns();
analyzeResilience();
analyzeHomeCourt();
analyzeSeriesLength();
analyzeMomentum();

console.log('\n' + '='.repeat(70));
console.log('2025 VALIDATION COMPLETE');
console.log('='.repeat(70));
