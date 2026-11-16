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
