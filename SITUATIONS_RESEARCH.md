# Situational pockets vs the close — research `situ-1` (exploration 2026-11-15; confirmation frozen 2026-11-15)

Code: `research-situations.js`. Data: the 2023-24 → 2025-26 games, closes and box scores used by
matchup-1 and luck-sched-1, plus tip times and national TV from ESPN's scoreboards
(`.cache/espn-nba/hist-sched.json`, fetched 2026-11-15). ESPN only, no Odds API credits.

## Why

matchup-1 and luck-sched-1 fitted one straight line per feature across every game, and only the
back-to-back split held. The user pointed out that an edge needn't be one-size-fits-all: the close
could price the average game right and still misprice a **pocket**. luck-sched-1 hinted at this:
time-zone travel did nothing at one zone and everything at 2–3.

Searching pockets means many tests, and some pockets will look good by chance. So this runs in
two stages:
1. **Exploration** (this file, done): scan freely on 2023-26, data we've already seen, and compare
   the number of good-looking pockets with what shuffled residuals produce.
2. **Confirmation** (not started): freeze a few pockets here, commit, then score them once on
   **2021-22 + 2022-23**, which have never been scored. ESPN has DraftKings lines for both. They
   carry no close field, but DraftKings' listed line equalled its close in 2,178 of 2,198 games in
   2023-26.

## Method (exploration)

- **Target:** the side's residual against the closing spread (its margin plus its spread). It
  covers when that's above 0; pushes are left out of cover rates.
- **Situations:**
  - **Team situations:** a pocket uses games where only that team has the situation. There are 28,
    covering fatigue, form, players, spots, timing, home underdogs and coaching changes.
  - **Game situations:** 7 (national TV, division, rematch, early tip, first 4 weeks, last 3
    weeks, first game after the All-Star break).
  - **Players:** built from who played in each box score, since there are no historical injury
    reports. A "top-2 player" means top 2 by minutes per game among players with 5+ games for the
    team who were last seen with it.
  - **Coaching changes** (from news reports, checked against team records at each change):

    | Season | Teams (date the new coach took over) |
    |---|---|
    | 2023-24 | MIL 1-23, WSH 1-25, BKN 2-19 |
    | 2024-25 | SA 11-2 (Popovich's leave), SAC 12-27, MEM 3-28, DEN 4-8 |
    | 2025-26 | POR 10-23 (Billups's leave), NO 11-15 |

- **Cuts:**
  - Each team situation alone, and split by venue (home or away) and by the side's price (big
    favourite, 7+ points; small favourite; small underdog; big underdog).
  - Game situations are split by home, big favourite and small favourite; the other cuts mirror
    these.
  - Pairs of team situations, except near-duplicates.
- **Size:** pockets with at least 150 sides go into the scan. Rarer situations are described only.
- **Consistent:**
  - the same lean in all three seasons;
  - at least 52.4% against the spread in each, which is −110's break-even;
  - at least 30 sides in each season.
- **Noise baseline:** 200 runs with the residuals shuffled within each season. That keeps every
  pocket's games and breaks any link to the results.
- **Checks:**
  - A separate, simpler implementation recomputed six situations (back-to-back, revenge, a top-2
    player's first game out, first game back, home underdog 8+, early tip) for all 3,427 games
    with no mismatches.
  - Coaching-change dates match the team records reported at each firing: WSH 7-36, MIL 30-13 and
    NO 2-10.
  - Embiid's first game out after his Jan 30 2024 injury (Feb 1 at UTAH, on TNT) is flagged, and
    so is PHI's 2-zone trip east back home on Feb 3.
  - His Apr 2 return isn't scored, because DraftKings' line for it contradicts itself (−148 with
    +5.5) and the filter drops it.

## Results (exploration)

`node research-situations.js --all`: 3,427 games and 118 distinct pockets with at least 150 sides. (The first
run counted 126; 8 were cuts with the same games as another cut.)

**Consistent pockets: 4.** Shuffled residuals give a median of 4 and a 95th percentile of 9, so the
real data shows no more consistent pockets than noise does. On a second set of 300 shuffles, the
median was 5, and 73% of shuffled runs matched or beat the real count.

| Pocket (lean) | Sides | Mean | Median | t | 23-24 | 24-25 | 25-26 |
|---|---|---|---|---|---|---|---|
| bottom-8 opponent with a top-8 opponent next, big favourite (bet it) | 204 | +2.00 | +1.0 | 2.28 | 54.1% | 66.1% | 55.0% |
| a top-2 player's first game out, small favourite (fade it) | 166 | −2.14 | −2.5 | −1.98 | 57.8% | 53.8% | 57.1% |
| division game, big favourite (bet it) | 293 | +1.53 | +1.5 | 1.98 | 55.2% | 54.3% | 53.5% |
| hot 3P% over the last 5, big favourite (bet it) | 170 | +1.35 | +1.0 | 1.24 | 55.4% | 54.9% | 59.3% |

(Percentages are against the spread in the lean's direction.)

**The largest |t| of any pocket: 3.22**, for big favourites in the first 4 weeks: +2.80 points,
covering 56.8%, 50.0% and 63.9%. It isn't consistent (2024-25 broke even), and 13% of shuffled runs
produce a pocket at least that large.

**Big favourites as a whole** (7+ points):
- They beat the spread by +0.88 points (t 2.60) but covered only 52.2%: 52.5%, 53.5% and 50.6% by
  season.
- A few blowouts carry the mean, so they don't beat the vig.
- Three of the four consistent pockets are big-favourite pockets and partly ride this baseline.
- After week 4, big favourites beat the spread by +0.64. In the first 4 weeks it was +2.80.

**Rare situations** (described only):

| Situation | Sides | Mean | Seasons (vs the spread) |
|---|---|---|---|
| back-to-back after overtime | 55 | −1.26 | 73% / 55% / 28% |
| a top-2 player's first game back | 105 | −0.37 | 55% / 47% / 50% |
| Western team, early tip in the East | 18 | −3.92 | n 4 / 5 / 9 |
| Eastern team, early tip in the Pacific zone | 8 | +3.00 | n 6 / 1 / 1 |
| first 10 games under a new coach | 74 | +0.49 | 43% / 50% / 50% |
| first game after the All-Star break, favourite | 38 | +1.36 | 62% / 67% / 46% |

None is large enough to read.

## Re-check (2026-11-15, after the first run)

**Problems found and fixed:**
- **Traded stars:** 14 of 814 "top-2 player's first game out" flags were trades (Siakam, Rozier,
  Dinwiddie, Schröder and others): the player was gone, not out. A player now leaves a team's
  roster once his next appearance is for another team. Trades are public before tip, so this
  doesn't use the result. The flags went to 805; the pocket moved from −2.17 to −2.14.
- **National TV:** the list missed truTV, HBO Max and NBCSN, which carried national games in
  2024-26. The count didn't change (543 games), because those games were already listed under TNT
  or NBC. NBA TV, ESPN+ and TSN aren't counted.
- **Duplicates:** 8 pockets had the same games as another cut (for example, a home underdog's
  "home" cut). They're now dropped, leaving 118 pockets.

**Checked and correct:**
- **The cross-check:** a separately written implementation recomputed 24 of the 35 situations on
  all 3,427 games, with no mismatches:
  - fatigue: back-to-back, 3 games in 4 nights, rest advantage, 2+ zones east and west, road
    trip, first home game after a trip;
  - form: streaks, hot and cold shooting;
  - players: a top-2 player's first game out and first game back;
  - spots: letdown, bounce-back, revenge, lookahead;
  - the rest: home underdog 8+, coaching change, early tip, division, rematch, first 4 weeks and
    last 3 weeks.
- **Residuals and pocket figures:** every residual matched the final score plus the spread. The
  division big-favourite figures (98/94/101 games; 55.2%, 54.3% and 53.5%) were recomputed from
  scratch and matched.
- **The closing spreads:**
  - Where 2+ other books are listed, the spread we use is within 1 point of their median in
    1,206 of 1,227 games, and 3 or more points off in only 3.
  - Spread and moneyline agree within 2.5 points in 3,649 of 3,664 games (a moneyline converted to
    points, at 12.8 points per standard deviation). The worst are huge favourites, where that
    conversion is loose.
- **Not cross-checked** (small or descriptive situations): national TV, early tips by
  conference, 2+ starters out, traded-in player, back-to-back on the road and after overtime, the
  smaller home-underdog bands, and the first game after the All-Star break.

**The headline under other rules** (300 shuffles each; "share" is how often noise matched or beat
the real count):

| Rule | Pockets | Real | Noise median (95th) | Share |
|---|---|---|---|---|
| base: ≥150 sides, ≥30 a season, ≥52.4% each season | 118 | 4 | 5 (10) | 0.73 |
| ≥100 sides | 161 | 6 | 8 (14) | 0.76 |
| ≥250 sides | 64 | 1 | 2 (5) | 0.84 |
| ≥55% each season | 118 | 0 | 1 (4) | 1.00 |
| same lean each season (>50%) | 118 | 13 | 13 (21) | 0.54 |
| same sign each season, pooled \|t\| ≥ 2 | 118 | 6 | 4 (10) | 0.33 |
| matchup-1's rule (train \|t\| ≥ 2, 2025-26 same sign, \|t\| ≥ 1) | 118 | 1 | 1 (3) | 0.57 |

No rule finds more than noise. Under matchup-1's rule, the one pass is big favourites in the first 4
weeks.

**Big favourites early in the season, by window** (exploratory; chosen after seeing the scan). Each
cell is the cover rate, sides and mean points by season. The first scored game comes 10 days after
the opener, because both teams need 5 prior games.

| Favourite by 7+ | 2023-24 | 2024-25 | 2025-26 |
|---|---|---|---|
| days 10–21 | 58%, 24, +4.0 | 57%, 35, +1.9 | 68%, 40, +4.3 |
| days 10–28 (the scanned pocket) | 57%, 44, +4.2 | 50%, 62, +1.0 | 64%, 61, +3.6 |
| days 29–56 | 57%, 71, +2.3 | 53%, 70, +2.5 | 36%, 78, −2.6 |
| after day 56 | 51%, 384, +0.6 | 54%, 365, +0.8 | 51%, 385, +0.5 |

It fades as the season goes on, which fits lines leaning on preseason ratings until enough games
are in. But the best window (days 10–21) was picked after looking, and it's only 99 sides. If it's
frozen, it should be frozen as originally scanned (the first 4 weeks, 7+). In 2026-27, day 28 is
Nov 17, so even a confirmed result would mostly apply next season.

## Reading

Cutting by situation turned up no more consistent pockets than chance. That's the same answer as
the straight-line tests: the close prices the situations we can build from box scores, schedules
and broadcast data about as well as it prices the average game.

What's left is weak and mostly one theme: **big favourites beat the spread by points, but not
often enough to beat the vig**, most of all early in the season. The early-season version has a
reason behind it: lines may lean on preseason ratings and under-rate how far apart teams really
are. It's also the pocket we're in right now (week 4 of 2026-27).

## Confirmation (pre-registered, frozen 2026-11-15)

Written and committed before any 2021-22 or 2022-23 game is fetched. Each pocket is scored once.
Nothing here changes after the fetch; a different question becomes `situ-2`.

### Data

- **Games:** 2021-22 and 2022-23 regular seasons, between the 30 NBA teams. The game list comes from
  ESPN's scoreboards (season type 2 only, so no play-in, playoffs or exhibitions).
- **Box scores and lines:** ESPN's game summaries give the team box lines and player minutes. The
  core odds endpoint gives the lines.
- **The close:**
  - DraftKings' listed moneyline and spread. These seasons have no close field; in 2023-26 the
    listed line equalled DraftKings' close in 2,178 of 2,198 games.
  - Use the close field instead wherever one exists.
  - No fallback book. Games without a DraftKings line are left out.
  - Lines whose spread favourite contradicts the moneyline are dropped, as before.
- **Everything else as in the exploration:**
  - the code at this commit (`research-situations.js` `build`);
  - both teams need 5 prior games;
  - the side's residual against the spread;
  - pushes are left out of cover rates.
- **Known context, decided now:** 2021-22 includes the December–January Omicron wave, when many
  players missed games under health protocols. All games are kept; nothing is excluded after
  seeing results. Coaching changes and broadcasts aren't needed for these pockets, so they aren't
  collected.

### Pockets (lean from the exploration)

| # | Pocket | Lean | Exploration (sides, mean, t) |
|---|---|---|---|
| 1 | big favourite (7+) in the first 4 weeks (`first4w\|bigFav`) | bet it | 167, +2.80, 3.22 |
| 2 | big favourite vs a bottom-8 team, top-8 team next within 2 days (`lookahead\|bigFav`) | bet it | 204, +2.00, 2.28 |
| 3 | small favourite on a top-2 player's first game out (`starOut1\|smallFav`) | fade it | 166, −2.14, −1.98 |
| 4 | big favourite in a division game (`division\|bigFav`) | bet it | 293, +1.53, 1.98 |
| 5 | big favourite after hot 3P% over the last 5 (`hot5\|bigFav`) | bet it | 170, +1.35, 1.24 |
| 6 | control: every big favourite (7+) | bet it | 1,520, +0.88, 2.60 |

"First 4 weeks" is within 28 days of the season's first game, as scanned. The days 10–21 window
seen in the re-check is not a question here.

### Pass rule (each pocket, both fresh seasons together)

1. **Same lean**, with t ≥ 2 on the mean residual in that direction.
2. **Beats the vig:** at least 52.4% against the spread in that direction.
3. **Beats the control (pockets 1, 2, 4 and 5):** the pocket's mean minus the mean of the other big
   favourites in the same seasons, in the lean's direction, with t ≥ 1 (Welch). This rules out a
   pocket that's only the big-favourite baseline again.

Pocket 6 passes on 1 and 2 alone.

**Also reported, not part of the rule:** each season alone, the median residual, and profit at −110.

**False passes:** with 6 questions, the chance that noise passes at least one is roughly 10%. Each
needs t ≥ 2 one-sided (about 2.3%) plus the cover rate.

**Power, if the exploration effects were fully real:**
- The fresh seasons should hold about two-thirds of the exploration's sides.
- The expected t would then be about 2.2, 1.7, 1.7, 1.6, 1.1 and 2.1 for pockets 1–6.
- The chance of t ≥ 2 would be about 57%, 39%, 37%, 34%, 18% and 53%.
- Pockets chosen from a scan usually come back smaller, so the real chances are lower. A failure
  mostly says the pocket isn't large; a pass would be worth tracking.

### What a pass leads to

A live shadow on ledger rows, like `b2b-1`, judged on 2026-27 and later against the close. It's
never an engine change, and never a bet before it holds live. Pocket 1 can only be judged live
from next October; this season's 4-week window ends Nov 17.

## Confirmation results (run 2026-11-15, after the pre-registration commit e7bd82f)

`node research-situations.js --fetch-old`, then `--confirm`, scored once. Checked before scoring:
- **Coverage:** all 1,230 games in each season are present, 1,231 listed less the All-Star game.
  DraftKings lines exist for 1,228 and 1,230 games; one was dropped for a contradictory spread and
  one has no line.
- **Box scores:** team minutes add up in 4,919 of 4,920 team-games.
- **Spreads:** DraftKings' is within 1 point of other books' median in 2,435 of 2,458 games. It
  agrees with the moneyline in all but 2.
- **Situation rates** are close to 2023-26's. One exception: games with an 8+ point home underdog
  were about half as common.
- **A known event:** Durant's first game out after his Jan 15 2022 knee injury (Jan 17 at CLE) is
  flagged.
- **Scored:** 1,150 and 1,151 games.

| # | Pocket (lean) | Sides | Mean (lean's direction) | t | vs the spread | vs other big favourites | 21-22 | 22-23 | Result |
|---|---|---|---|---|---|---|---|---|---|
| 1 | big favourite, first 4 weeks (bet) | 76 | −0.61 | −0.40 | 45.2% | −0.60, t −0.38 | 50.0% | 40.0% | no |
| 2 | big favourite vs a bottom-8 team, top-8 team next (bet) | 104 | +0.54 | 0.49 | 50.0% | +0.69, t 0.56 | 42.3% | 58.0% | no |
| 3 | small favourite, a top-2 player's first game out (fade) | 127 | −0.38 | −0.33 | 50.0% | — | 46.4% | 52.9% | no |
| 4 | big favourite, division game (bet) | 160 | +1.69 | 1.70 | 52.9% | +2.17, t 1.94 | 55.7% | 49.3% | no (t < 2) |
| 5 | big favourite, hot 3P% last 5 (bet) | 109 | +1.88 | 1.51 | 47.7% | +2.22, t 1.67 | 48.3% | 46.9% | no |
| 6 | control: every big favourite | 839 | −0.06 | −0.13 | 48.8% | — | 46.9% | 51.0% | no |

**0 of 6 pass.** The division game and control figures were recomputed independently and matched.

- **The early-season pocket reversed:** 45.2% against the spread, below the other big favourites.
- **The big-favourite baseline didn't carry over:** −0.06 points in 2021-23, against +0.88 in
  2023-26.
- **The nearest miss is pocket 4,** division games with a big favourite:
  - +1.69 points, 52.9% against the spread, and 2.17 points better than the other big favourites;
  - but t 1.70 misses the bar, and 2022-23 went 49.3%;
  - by the rule it doesn't pass, and it isn't tracked;
  - a later test would need data not yet seen (the live seasons), as `situ-2`.
- **Power was lower than planned:** 2021-23 had fewer 7+ point spreads, so the big-favourite
  pockets got about 70% of the sides the power estimate assumed (76 rather than about 111 for
  pocket 1).

## Conclusion

Situational pockets don't beat the close. Exploration found no more consistent pockets than noise.
The five best candidates, scored once on two unseen seasons, all failed, and the big-favourite
pattern behind most of them disappeared.

With matchup-1 and luck-sched-1, three rounds of research have now tested:
- 23 straight-line features;
- 118 situational pockets;
- 5 frozen pockets on fresh seasons.

Only the team-specific back-to-back split (`b2b-1`) has held. The closing spread prices what box
scores, schedules, player availability and broadcasts can tell us.
