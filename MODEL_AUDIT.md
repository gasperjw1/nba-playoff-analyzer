# Model and strategy audit (2026-11-15)

The user asked for a look back over the whole model:
- what was never tested on past seasons;
- what is redundant or conflicts with another piece;
- what works together and what doesn't;
- how to tell noise from a small real edge.

The numbers come from the code, the specs and research files, and the 82 settled ledger games
(Nov 2–15). The audit scripts were scratch scripts, not committed.

## 1. What's in the model, and what backs each piece

"Outcomes" means tested on past seasons against the results. "Close" means tested against the closing
line, the market. Only the second can show an edge: a piece can predict results well and still add
nothing the market doesn't already know.

### The engine (`js/season/engine.js`, constants in `season-constants.js`)

| Piece | Value | Tested on past seasons vs outcomes | Tested vs the close | Live |
|---|---|---|---|---|
| Last season's rating, retention | 0.75 | yes, 330 team-seasons at opening night | **no** | — |
| This season's form, shrink K | 20 games | yes, 13,209 games, leave-one-season-out | **no** | — |
| Home court | 2.0 | yes, 13,209 games | **no** | — |
| Back-to-back | −2.0 | yes, 13,209 games and 3,690 box scores | yes: the market prices it; the **team-specific** split beats it (b2b-1) | b2b-1 from 11-16 |
| 3 games in 4 nights | −0.5 | **no** ("untested" in the constants) | yes (luck-sched-1 S1): nothing | — |
| 3+ days rest | +0.5 | **no** | yes (S2): nothing | — |
| Player value (BPM, replacement, points per BPM) | fitted each run | yes, R² 0.998 team-level | **no** | — |
| Roster vs rating (absences, arrivals, departures) | — | yes, 330 team-seasons; rotcap pre-registered on 4,324 team-games | **no** | absences over-penalized ~27% vs the market (team-lean dig) |
| Injury report statuses, availability per status | — | **no** | **no** | 20 games with `pOursReport` |
| Aging | aging-fit.js | yes, 3,318 player-seasons; replay | **no** | — |
| Roster fit (continuity, rebounding) | chemistry-fit.js | yes, 2 of 7 features held out of sample | **no** | — |
| Caps: roster 12, fit 2, aging 4; 8-minute floor; 70% offence share | heuristics | **no** | **no** | — |
| Player baselines: season weights 1.0/0.5, regress 300 min, current-season K 1000/600/4 | heuristics ("until the backtest says otherwise") | **no** | **no** | — |
| Opponent-adjusted form (`pOursAdj`) | — | yes, −0.21 ± 0.12 MSE (marginal) | **no** | 24 games |

**What stands out:** every engine piece was built and checked against results. **None had been
tested against the closing line on past seasons.**
- **Update, same day:** `engine-close-1` (ENGINE_CLOSE_RESEARCH.md) tested the core against the
  2021-26 closes: team ratings, form, home court and rest.
- **Result:** no information beyond the close (slope −0.03 ± 0.05; 0 of 6 questions pass).
- **The first-five-games lead** (+0.54 ± 0.22) was scored once on six unseen seasons
  (engine-close-2, 2015-21) and came out +0.05 ± 0.19. It was noise.
- **The availability piece** (injury-close-1, INJURY_PIECE_RESEARCH.md) doesn't pass either
  (0 of 3).
  - The market lean is in the engine's direction: the market moved 0.87 per point of the engine's
    value, results 0.96.
  - The engine's absence values match results (0.95 ± 0.06), so its live harshness relative to the
    market isn't evidence it's wrong. The engine as a whole has only been compared
with the market on this season's walk-forward replay. That's a development set, and there it
trailed the close within noise.

### The model versions on every ledger row

| Version | What it is | Used by |
|---|---|---|
| `pOurs` | engine on NB.AI's feed | b2b-1 (shifts it), pitch-3 when there's no report |
| `pOursReport` | the same with the official injury report | **pitch-3** |
| `pOursClean` | engine on last season's final ratings | **pitch-1 edge, trust rules** (R1–R4, AVOID) |
| `pOursAdj` | clean plus opponent-adjusted form | nothing (tracked) |
| `pFriend` | NB.AI | **fade-1** |
| `pBlend` | log-odds average of `pOurs` and NB.AI | nothing (shown) |
| `pMarket` | DraftKings no-vig at record | flat-1, pitch-2, every judgement |

`ledger.js` documents a known flaw: NB.AI's "prior" already contains this season's games, and the
engine blends this season in again. **`pOurs` and `pOursReport` count current form twice.** pitch-3
was frozen today on `pOursReport`, so it inherits this. pitch-1's edge ticket and the trust rules
use the clean version.

### The tracked strategies

| Strategy | What | Evidence before it was frozen | Live so far |
|---|---|---|---|
| pitch-1 floor | 3 prop overs at the props model's 90% line | props backtests | not offered at FanDuel; 14-game FanDuel test 66% vs 75% implied |
| pitch-1 edge | 2–3 moneylines 8+ pp over DraftKings' no-vig price | replay (development set) | **0 tickets in 7 nights**: it has never fired |
| pitch-2 | 3-leg ticket of the strongest favourites | 3 past seasons: about −4% after the vig | 21 legs |
| flat-1 | every favourite −299 to −100 | 3 past seasons at the close: **−3.8% (z −2.3)** | 57 bets |
| fade-1 | 50–70% favourites NB.AI doubts by 8+ | found after the fact on 19 games | 10 fade, 17 control |
| pitch-3 | 5+ pp moneyline straights and a nightly pair | 45 pre-spec ledger legs, no edge | from 11-16 |
| trust R1–R4 | bet a disagreement driven by prior, roster change, rest or aging | replay (development set) | **3 of 12 won, 4.8 expected** |
| AVOID | skip injury-driven disagreements | replay | engine side 2 of 3, 1.2 expected |
| b2b-1 | team back-to-back split, as a shadow | 3 seasons, holdout passed | from 11-16 |

## 2. What works together, and what doesn't

**The four engine versions are mostly one opinion.** Correlation of each version's gap from the
market, game by game:

| | pOursClean | pOursAdj | pOursReport | NB.AI |
|---|---|---|---|---|
| pOurs | 0.88 | 0.87 | 0.99 | −0.14 |
| pOursClean | | 0.96 | 0.84 | −0.15 |

Tracking four versions doesn't give four pieces of evidence. When one does "best" on a few dozen
games, that's mostly noise between near-copies.

**NB.AI and the engine disagree with the market in different directions** (−0.14). In principle that
makes blending useful. In practice NB.AI hurts:
- **Brier score:** NB.AI 0.222, against the market's 0.176 on the same 44 games.
- **The blend is worse than the engine alone:** 0.187 against 0.181, on all 82 games.

**Live, against the market** (82 settled games; slope = how much of a version's gap from the market
showed up in results; 1 means fully real, 0 means noise):

| Version | Games | Brier | Market, same games | Slope ± se |
|---|---|---|---|---|
| pOurs, all engines | 82 | 0.181 | 0.172 | −0.12 ± 0.54 |
| pOurs, current engine (rotcap) | 35 | 0.158 | 0.162 | 0.85 ± 0.98 |
| pOursClean | 53 | 0.160 | 0.157 | −0.48 ± 1.07 |
| NB.AI | 44 | 0.222 | 0.176 | −0.78 ± 0.47 |
| the DraftKings close (as a check) | 82 | 0.168 | 0.172 | 2.77 ± 1.46 |

- **The check works:** the close beat the recorded price, as real information should.
- **The current engine is slightly ahead of the market,** but with an uncertainty of ±1 the
  slope can't tell an edge from noise.
- **Line movement toward each version** (when it disagreed by 3+ points) was positive but within
  noise everywhere: +0.22 ± 0.33 points for `pOurs` on 62 games.

## 3. Redundant and conflicting

1. **The favourites trackers are one bet counted three times.**
   - flat-1 backs every favourite from −299 to −100.
   - fade-1's fade and control groups are both subsets of flat-1's bets (27 of 27 shared).
   - pitch-2's legs are the strongest favourites.
   - Their records will move together, so three good runs are one piece of evidence. The past
     seasons say the family loses about the vig (−3.8% at the close).
2. **pitch-3 bets against flat-1.**
   - Of the 38 games both cover, **17 are opposite sides**: 20 of pitch-3's 50 legs are underdogs.
   - Holding both means paying the vig twice on a game with no net position.
   - Your own FanDuel legs were on the opposite side to flat-1 in 6 games and to pitch-3 in 6.
3. **Different model versions behind look-alike edge rules.** pitch-1 edge and the trust rules use
   the clean engine; pitch-3 uses the double-counting feed engine with the report. The same game can
   be an "edge" under one and not the other. On Nov 15, the 7.7 and 7.8 point gaps on LAL and LAC
   were clean-engine figures.
4. **The AVOID check doesn't match pitch-3's number.** AVOID is decided on the clean engine with the
   feed's statuses; pitch-3's gap comes from `pOursReport`. An injury-driven gap can pass AVOID and
   still qualify for pitch-3.
5. **Rest is in three places:**
   - the engine's −2.0;
   - trust rule R3 (bet rest-driven disagreements);
   - b2b-1's team split.
   - R3 bets on the generic cost the market already prices. b2b-1 is the only part with evidence
     against the close.
6. **Dead weight:**
   - pitch-1's edge ticket has never fired.
   - `pBlend` and `pOursAdj` drive nothing.
   - They cost attention and add more chances for a lucky-looking number.

## 4. Telling noise from a small real edge

A scorecard for every piece, in order of what it takes to believe one:

1. **Written down first.** The rule and the decision are committed before the data that judges them
   (pre-registered). Anything found by looking is a hypothesis until new data confirms it.
2. **Judged against the close, not results.** Beating results at a fair price needs huge samples.
   Beating the market's own close, or having the line move your way, needs far fewer.
3. **Big enough sample, known in advance.** How many bets it takes for z = 2:

   | What you're looking for | Bets needed |
   |---|---|
   | +2 pp win rate over break-even on moneylines | ~2,400 |
   | +5 pp | ~400 |
   | +1 point against the spread | ~730 |
   | +2 points against the spread | ~180 |
   | +0.5 pp line movement your way (sd ~3 pp) | ~150 |

   So a 9–1 run, a 10-of-15, or a 25-of-45 can't separate a small edge from luck. Line movement is
   the quickest honest signal.
4. **Count the tries.** Three rounds of research ran about 140 tests against the close, so a handful
   of t ≥ 2 results is expected by chance. A shuffled-results comparison says whether a batch beat
   chance. One pass is read against the total number of looks.
5. **Same direction everywhere.** It holds in each season, in the median and not just the mean
   (a few blowouts can carry a mean), and with the largest misses trimmed. Small definition changes
   don't flip it.
6. **A reason.** It has a mechanism a market might plausibly miss. The back-to-back split has one
   (teams differ in how they handle fatigue); "big favourites in division games" doesn't.
7. **Expect it to shrink.** The best of many tries overstates its size. Plan for half.
8. **Stop rules fixed in advance:** the retire point and the read date, so a cold or hot streak
   doesn't decide.

**Applied:**

| Piece | Verdict |
|---|---|
| b2b-1 | passes 1–6; live from 11-16 |
| The engine core (team ratings, form, home court, rest) | **fails vs the close**: 2021-26 (engine-close-1), and the first-five-games lead failed on 2015-21 (engine-close-2) |
| The engine's availability piece | fails vs the close on 2021-26 (injury-close-1: +0.09 ± 0.06, lean in its favour); its absence scale matches results (0.95) |
| Engine pieces | pass vs results; **untested vs the close** |
| Favourites family (flat-1, pitch-2, fade-1) | past seasons say it loses about the vig; this season's good run is within luck |
| Trust R1–R4 | built on a development set; 3 of 12 live vs 4.8 expected; too early, leaning wrong |
| pitch-3 | written down first; depends on the engine edge, which is undetermined |
| NB.AI | fails: worse than the market, and the blend is worse than the engine alone |
| Situational pockets, luck, schedule, style | tested and failed (matchup-1, luck-sched-1, situ-1) |

## 5. Recommendations, in order

1. **Done: the engine core against the close on 2021-26** (engine-close-1, 0 of 6 pass). Any live
   edge has to come from the roster and injury pieces. The first-five-games lead failed on 2015-21
   (engine-close-2). Original plan:
   - research-season-update.js already walks past seasons point-in-time: opening-night prior,
     in-season form, home court, rest.
   - Closes for 2021-26 are now cached (DraftKings).
   - The question: does the engine's gap from the close predict results, overall and by piece
     (prior, form, rest)? This is the largest untested question in the model.
   - Caveat: the constants were chosen on these seasons' results (leave-one-season-out), not on the
     market, so the market test isn't contaminated by tuning against it.
2. **One picks model.**
   - Name a single version as the model behind every edge rule, and treat the others as diagnostics.
   - The clean engine (last season's ratings plus this season once) avoids the double count. The
     report version adds the injury report.
   - A clean-with-report version could be logged as a shadow beside pitch-3 (frozen, not edited),
     so the two can be compared on the same games.
3. **Never hold both sides.** Treat the trackers as research records, not a betting portfolio. For
   bets you place, use one rule per game.
4. **Count the favourites trackers as one family** when reading results. Keep them, but expect
   about −4% unless prices improve, which is where price shopping comes in.
5. **Retire or freeze-and-ignore the dead pieces:** pitch-1's edge ticket (never fires), `pBlend`
   (worse than its parts), NB.AI as a blend member. Keep NB.AI recorded for fade-1 until fade-1's
   read.
6. **Keep a register of every test** (spec, date, data, result), so any new pass is read against
   the total number of tries.
7. **Untested constants to schedule,** each pre-registered, against results and the close:
   - 3-in-4 and long rest;
   - the availability assumed for Questionable and Doubtful;
   - the caps;
   - the player-baseline weights.
   The injury piece matters most, since live absences look over-penalized.
8. **Price shopping next.** The research keeps saying the close is hard to beat with information,
   so better prices are the most direct remaining lever.

## Related literature (searched 2026-11-16)

From abstracts and summaries returned by web search; the full texts weren't read, so methods and
samples should be checked before relying on details.

- **The closing line is hard to beat.**
  - Gandar et al. (*Journal of Finance*) found NBA spread lines move enough from open to close to
    remove early biases, which they read as informed money.
  - The anomalies found since are narrow: big home underdogs in 2000–08 (*The Sport Journal*),
    early-season *totals* but not sides (Baryla et al., *Finance Research Letters*, 2007; an
    early-season over/under study), and preseason games (*Applied Economics*, 2016).
  - This matches engine-close-1 and engine-close-2 (no information against the close; the
    early-season sides lead failed) and the memory that model edges show against the open, not
    the close.
  - Totals early in the season are an untested lead here.
  - [ETSU](https://dc.etsu.edu/etsu-works/17780) · [Sport Journal](https://thesportjournal.org/article/nba-gambling-inefficiencies-a-second-look/) · [UWF](https://ircommons.uwf.edu/esploro/outputs/journalArticle/Early-season-NBA-overunder-bias/99380090347306600) · [Applied Economics](https://informahealthcare.com/doi/full/10.1080/00036846.2016.1213367)
- **Streaks and the hot hand.**
  - Camerer (*American Economic Review*, 1989) found point spreads biased toward teams on streaks.
  - Brown and Sauer (1993) and Paul and Weinbach found betting against streaks isn't profitable,
    though bettors do pile onto hot teams.
  - Miller and Sanjurjo (*Econometrica*, 2018) showed the classic "no hot hand" result was biased:
    corrected, a shot-level hot hand appears.
  - This matches luck-sched-1 (past shooting luck doesn't fool the close) and situ-1 (streaks
    aren't an edge). Any player-level hot hand should be small.
  - [Caltech](https://resolver.caltech.edu/CaltechAUTHORS:20110211-141748791) · [arXiv 1902.01265](https://pdf.arxiv.org/pdf/1902.01265) · [Alberta](https://sites.ualberta.ca/~econwps/2011/wp2011-16.pdf)
- **Three-point defence is mostly noise.**
  - Ken Pomeroy (college) and Dan Feldman (NBA) found three-point percentage allowed far less
    stable than two-point: 0.24 correlation from a team's first 25 games to its rest, against 0.66
    for twos.
  - A player's three-point percentage last season explained about 14.5% of this season's
    variance.
  - This matches coinflip-1: threes above or below normal decide 58% of coin-flip margins; own
    accuracy regresses harder than the 300-attempt shrinkage assumes (t −5.0); the defence faced
    carries a smaller real signal (t +3.7).
  - Heavier three-point shrinkage is worth testing wherever three-point rates feed a model.
  - [kenpom](https://kenpom.com/blog/one-last-post-on-3p-defense/) · [numberFire](https://www.numberfire.com/nba/news/12065/which-nba-defenses-have-been-the-unluckiest-this-season) · [Power Rank](https://thepowerrank.com/2020/07/28/predictability-vs-skill-in-sports-analytics-3-point-shooting/)
- **Back-to-backs and travel.**
  - Charest et al. (*Journal of Clinical Sleep Medicine*, 2021, 2013–2020 seasons) found
    back-to-backs ending at home went best, about 4% lower win odds per extra 500 km travelled
    home, and only a marginal eastward effect.
  - Those are win rates, not results against the market. Here, the generic back-to-back cost is
    priced; only the team-specific split beat the close (b2b-1); eastward travel was fragile
    (luck-sched-1).
  - [PubMed 34170248](https://www.pubmed.gov/34170248/) · [PMC7925613](https://pmc.ncbi.nlm.nih.gov/articles/PMC7925613)
- **How random games are.**
  - Lopez, Matthews and Baumer (*Annals of Applied Statistics*, 2018) found the NBA the least
    random of the four major leagues, because of its wide talent spread.
  - So randomness concentrates in evenly matched games, consistent with coin flips' extra
    volatility.
  - [arXiv 1701.05976](https://arxiv.org/abs/1701.05976v3)
- **Consensus prices.**
  - A bookmaker consensus forecasts well (WU Vienna work on bookmaker consensus models); larger
    markets forecast better (Brown and Yang).
  - Bookmaker prices still carry margins and favourite–longshot bias.
  - This matches shop-1 (the multi-book consensus is calibrated) and its larger best-price edges
    on underdogs.
  - [WU Vienna](https://core.ac.uk/works/19204548) · [UEA](https://ueaeprints.uea.ac.uk/67342/)
- **Player props:** no academic study of NBA prop-market efficiency turned up; commercial claims
  that props are softer are unsourced. One study found the NBA's betting markets unusually
  inefficient during COVID-19 (empty arenas). [arXiv 2109.07581](https://arxiv.org/pdf/2109.07581)
