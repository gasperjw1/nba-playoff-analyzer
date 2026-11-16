# Early-season totals — research `totals-1` (pre-registered 2026-11-16)

Written and committed before any closing total is fetched or compared with a final score. Code:
`research-totals.js`, written after this commit.

## Why

The engine and team studies found no edge against the closing *spread*. Totals (over/under) have
never been tested here. The literature points at the start of each season:
- **Baryla et al.** (*Finance Research Letters*, 2007): NBA totals lines are significantly biased
  early in the season and sides aren't. Line moves from open to close go the right way but don't
  remove it.
- **Girdner, Davis, Fodor and Kirch** (*Journal of Prediction Markets*, 2013; 2009–12 seasons):
  betting every under in the first week returned about 11% a game. Points scored and total lines
  both rose over the first 17 weeks before levelling off.

Taken from abstracts, not full texts. The question is whether the bias was there in 2015-26, a
decade after it was published, and whether it's still there now.

## Data

- **Games:** 2015-16 to 2025-26 regular seasons (11 seasons), every game in the walk and ESPN
  caches. The actual total is the final score (home + away).
- **The closing total:** the median listed `overUnder` across sportsbooks from ESPN's core odds
  endpoint.
  - Excluded: "Opening", live lines, "consensus" and tipster sites (accuscore, teamrankings,
    numberfire).
  - At least 2 books are needed.
  - This is engine-close-2's median rule, kept for every season because no single book covers all
    eleven.
  - In 2023-26, where ESPN also has a close field, the listed total's agreement with the close is
    reported. For spreads and moneylines it was 96–99%.
- **resid** = actual total − closing total. A push (resid 0) is left out of over/under counts.
- **Day of season:** days since that season's first regular-season game. Week 1 is days 0–6.
  - 2019-20's bubble restart and 2020-21's December start are kept; each season counts from its own
    opener.

## Questions

- **T1. Week 1 (days 0–6):** are unders favoured?
  - **Pass:** mean resid < 0 with t ≤ −2 pooled over the 11 seasons, *and* unders win more than
    52.4% (−110's break-even), *and* the mean resid is negative in at least 7 of the 11 seasons.
- **T2. Weeks 1–4 (days 0–27):** the same rule.
- **T3. Early against late:** mean resid in days 0–27 minus mean resid after day 27.
  - **Pass:** the difference is < 0 with t ≤ −2 (Welch), and negative in at least 7 of 11 seasons.

**Described, not decided:**
- each season;
- week by week, weeks 1–10;
- the recent seasons alone (2021-22 to 2025-26), since the market may have learned after 2013;
- profit at −110 for the T1 and T2 unders;
- the 1% largest |resid| trimmed;
- totals' listed-against-close agreement for 2023-26.

**Power:**
- About 45 games in a season's first week, so about 500 for T1.
- With resid sd around 18–19 points, the standard error is about 0.85 points. A 2-point bias gives
  t ≈ −2.4.
- T2 has about 2,000 games, a standard error of about 0.42 points.

**False passes:** 3 decisions. The chance that noise passes at least one is about 5%.

## What a pass leads to

- **A live tracker of early-season unders for October 2027.** This season's 4-week window ends
  today (day 27 of 2026-27), so it can only be logged next season.
- **Priced at the user's books** through the odds feed (totals would need adding to odds-2's line
  call, the same region).
- **Never a bet before it holds live.**
- **A fail** means the published bias is gone or was never stable. Totals then join the list of
  markets this project can't beat with schedule information.

## Results (run 2026-11-16, after the pre-registration commit 650ec84)

`node research-totals.js --fetch`, `--check`, then scored once. 13,212 regular-season games among
the 30 NBA teams; the 2023-26 NBA Cup finals are kept, one game a season.

**Checked before scoring:**
- **Listed is closing:** DraftKings' listed total equalled its close field in 1,204 of 1,229 games
  (98%).
- **Agreement across books:** DraftKings was within 1 point of the median in 5,206 of 5,685 games
  (92%; totals vary more across books than spreads).
- **Median books per game:** 9.
- **Coverage gap, by the pre-registered two-book rule:**
  - ESPN lists only ESPN BET in 2024-25, and DraftKings ("Draft Kings") in 979 and ESPN BET in 299
    of 2025-26's games.
  - So 2024-25 is out, and 2025-26 keeps 47 games, none in its first four weeks.
  - The decided tests cover 2015-16 to 2023-24 (9 full seasons) plus those 47 games: 10,760 games.
  - The "negative in at least 7 seasons" bar was kept as written, which is stricter with fewer
    seasons.

| Q | | Games | Mean resid (t) | Unders | Return at −110 | Seasons negative | Decision |
|---|---|---|---|---|---|---|---|
| T1 | week 1 | 438 | +0.09 (0.10) | 224-212, 51.4% | −1.9% | 4 of 9 | no |
| T2 | weeks 1–4 | 1,820 | −0.53 (−1.25) | 936-868, 51.9% | −0.9% | 6 of 9 | no |
| T3 | early minus later | | **−1.29 (−2.77)** | | | **8 of 9** | **PASS** |

An independent Python recompute from the raw files reproduces T1, T2 and T3 to the hundredth.

**Described:**
- **Week by week** (mean resid; unders):

  | Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
  |---|---|---|---|---|---|---|---|---|---|---|
  | Mean resid | +0.09 | −1.13 | −0.44 | −0.60 | −0.73 | +1.99 | +0.96 | +1.47 | +0.52 | +0.64 |
  | Unders | 51.4% | 53.6% | 52.1% | 50.4% | 51.1% | 46.2% | 50.0% | 47.8% | 49.2% | 48.6% |

- **What T3 is:** after day 27, totals average +0.76 points over the line (t 3.98), but overs win
  only 50.6%. The mean is carried by high-scoring games, overtime among them. By win rate, unders
  were 51.9% early against 49.4% later (z 1.93). Neither side clears −110's 52.4%.
- **Trimmed** (1% largest |resid|): T2 −0.75 (t −1.84); T3 −1.14 (t −2.55).
- **The recent two-book seasons (2021-24):** week 1 −1.67 (t −1.10), unders 52.3%; weeks 1–4 −0.65
  (t −0.91).
- **After the fact, 2024-26 on a single book** (ESPN BET; DraftKings or ESPN BET):
  - week 1 **+3.42** (t 2.05), unders **41.0%** (105 games);
  - weeks 1–4 +1.52 (t 1.69), unders 45.9%;
  - later +0.49, unders 49.4%.
  - The early-season lean has reversed to overs, consistent with a market that now overcorrects.

## Conclusion

- **The published first-week under bias is gone.** In 2015-24, week-1 unders won 51.4% (−1.9% at
  −110), and the first four weeks 51.9%.
- **A relative pattern remains (T3):** early-season totals land lower against the line than later
  totals, in 8 of 9 seasons.
  - Neither early unders nor later overs beat the vig.
  - The size comes mostly from the later-season average being pushed up by high-scoring games.
- **The newest seasons point the other way:** early overs in 2024-26 on a single book. So any early
  totals rule would be betting on a pattern that has already moved.
- **No tracker:** the pre-registration tied a tracker to T1 or T2 passing, and neither did.
- **Totals join spreads and moneylines** as markets where schedule-based timing doesn't beat the
  close.

## Second round of checks (2026-11-16, at the user's ask)

No result changed.
- **Two games rebuilt by hand from the raw files:**
  - **CLE at IND, 2023-11-03:** 11 books kept (the live line, consensus and tipster entries
    dropped), median 230; final 121–116 = 237; resid +7; day 10 from the Oct 24 opener.
  - **A 2015-16 game:** 5 offshore books kept ("Opening", consensus and tipsters dropped), median
    191.5; total 193; resid +1.5.
  - Both match the script.
- **Openers:** every season's first game is the real opening night (Oct 27 2015 … Oct 21 2025;
  Dec 22 2020).
- **Early-season coverage, 2015-24:** 1,820 of 1,823 games in the first four weeks are scored (matching T2's 1,820), and
  every week-1 game in 8 of 9 seasons.
- **Closing, not opening:**
  - In 2015-17 the median total equals ESPN's "Opening" line in only 7% of games.
  - In 2023-24, DraftKings' listed total equals its own open in 7% and its close in 98%.
  - 2017-23 have no opening or close data at ESPN. They rest on the same feed behaving the same
    way.
- **The single-book 2024-26 totals:** ESPN BET's and DraftKings' listed totals equal their close
  fields in 100% of games. A separate Python recompute using the close field reproduces week 1
  +3.42 (t 2.05, unders 41.0%) and weeks 1–4 +1.52 (unders 45.9%).
- **The tables reconcile:**
  - Weeks 1–4 total 1,820 games, weighted mean −0.53, matching T2.
  - Early −0.53 and later +0.76 blend to the overall +0.54.
  - Later overs and unders (4,479–4,372) plus 89 pushes make the 8,940 later games.
- **Corrections made in writing up:**
  - the win-rate z was first rounded to "about 1.9", then "1.96"; computed exactly it's 1.93;
  - the script prints "4 of 10" seasons negative for T1 because 2025-26 has no early games, so
    it's 4 of 9.
