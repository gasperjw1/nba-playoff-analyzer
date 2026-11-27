# Do big line moves overreact? — research `move-1` (pre-registered 2026-11-26)

Written and committed before any game result is joined to an open-to-close move on past seasons.
Code: `research-line-move.js`, written after this file is committed. Before this commit, the only
thing computed on these seasons for this study was how many games moved by how much, from the odds
files alone. No scores were read.

## Why

`RESEARCH_GAPS.md` (R2) found one untested lead in this season's replay:
- when DraftKings' moneyline moved 8+ pts (no-vig chance) from open to close, the side it moved
  toward won **14 of 32**;
- the close expected 18.9 wins and the open 14.8;
- so the results matched the open, as if the close had over-corrected (Detroit without Cunningham:
  the line moved 11 pts against them and they won by 18).

Thirty-two games can't support that. This season's games are where the idea came from, so they
can't confirm it and are only described. The literature points the other way: open-to-close moves
in NBA spreads are read as informed money (Gandar et al., `MODEL_AUDIT.md`).

## Data

Two sets. Each game's open and close come from the same source, and the result comes from the
final score.

**Set A — 2023-24 to 2025-26 (dev set; part of it has been seen, see below).**
- **Odds:** `.cache/espn-nba/hist-odds`, ESPN's core odds endpoint, with each book's opening and
  closing moneyline.
- **Book, one per game:** ESPN BET when it has both an open and a close, else DraftKings.
  - 2023-24: ESPN BET 1,210 games, DraftKings 7.
  - 2024-25: ESPN BET 1,233.
  - 2025-26: ESPN BET 298, DraftKings 932.
- **Results:** `.cache/espn-nba/hist` box scores (final scores).
- **Size:** 3,666 games after the exclusions below, 473 of them with moves of 8+ pts.

**Set B — 2015-16 and 2016-17 (holdout; never scored open against close).**
- **Open:** ESPN's "Opening" provider moneyline, cached in `.cache/espn-nba/early`.
- **Close:** the median no-vig chance across the listed books, with the same exclusions as
  engine-close-2: "Opening", live lines, "consensus" and tipster sites (accuscore, teamrankings,
  numberfire). At least 2 books.
- **Results:** the same cache's scoreboards (`sb-*.json`), regular season, final.
- **Size:** about 2,400 games, about 166 with moves of 8+ pts.
- 2017-21 have no "Opening" line, and 2021-23 have no opens at ESPN.
- **Caveat:** the open and the close come from different sources, which adds noise. Requiring Set A
  (one book) and Set B to agree guards against a book artefact.

**Exclusions, decided now:**
- Moves larger than 30 pts. In past seasons these are mostly a broken "open", like the Nov 4 San
  Antonio +503 against a −620 close. That drops 14 games in A and 11 in B.
- Any moneyline that isn't a valid price (|odds| < 100).
- Set B games with fewer than 2 books.

**Chances:** proportional no-vig for both the open and the close (the in-season number used this).
The power method is described as a check, not decided on.

**What's been seen already (disclosed):**
- **Set A:** `research-favourites-open.js` (pre-registered, 3,585 games) found:
  - the close more accurate than the open overall (Brier 0.197 vs 0.202);
  - ticket legs "kept moving the way the line moved";
  - it also re-ran its tables without games that moved more than 25 pts (its Q7); that output isn't
    recorded in any file and hasn't been seen in this session.

  So Set A's aggregate is known to favour the close; the subset of big moves hasn't been scored.
- **Set B:**
  - engine-close-2 scored its closes against the engine;
  - totals-1 compared "Opening" totals with the median only to show they differ.

  No study has joined Set B's "Opening" moneyline to results.
- **This season:** the replay and the ledgers are where the idea came from; described, never decided.

## Definitions

For each game:
- **move** = p_close(home) − p_open(home), in points of no-vig chance.
- **The moved-to side, s:** home if move > 0, else away. Games with move = 0 have no side.
- **For a set of games with |move| ≥ T:**
  - W = wins by s.
  - Ec = Σ p_close(s) and Eo = Σ p_open(s).
  - V = Σ p_close(s)(1 − p_close(s)).
  - **z_close = (W − Ec) / √V.** Negative means s won less often than the close said
    (overreaction); positive means more often (underreaction).
  - **k = (W − Eo) / (Ec − Eo),** the share of the move that was real, with SE √V / (Ec − Eo).
    1 means the close was right, 0 the open, below 1 an overreaction, above 1 an underreaction.

## Questions

**Q1. Do 8+ pt moves overreact? (decided)**
- At T = 8 pts in both sets: W, Ec, Eo, z_close and k.
- **Pass (the overreaction is real):**
  - Set A: z_close ≤ −2.0; and
  - Set B: z_close ≤ −1.0 (the same sign).
- **Fail:** anything else.
  - If both sets have k ≥ 1, the record says the close was right or under-moved, and the lead is
    closed in that direction.

**Q2. The shape (described).**
- Q1's numbers at T = 5 and 12 pts.
- By season.
- By direction: moved toward the favourite, toward the underdog, or flipped the favourite.
- Across every game: the OLS slope of (y_home − p_close(home)) on move, with SE. Slope b means
  truth ≈ close + b × move, so b < 0 is overreaction.

**Q3. Would fading it pay? (described; it gates any tracker)**
- At T = 8: betting 1 unit on the side the line moved away from at its closing price.
  - Set A: the book's close.
  - Set B: the median of the books' closing American odds for that side.
- Units, the return, and the break-even win rate. The vig is about 4–5%, so an overreaction can be
  real and still not pay at the close.

**Q4. This season (described, never decided).**
- The same Q1 numbers on the replay's DraftKings open and close (replay-9) and on the live ledger's
  open and close.
- Rows where ESPN's open contradicts itself are dropped as in Q1, and so are moves over 30 pts.

## What follows

- **Q1 passes and Q3 is positive in both sets:**
  - a new frozen live spec (`move-2`) tracks the fade side at real prices and the closing line;
  - nothing is recommended until it has its own live record.
- **Q1 passes, Q3 negative:** written up as "real but priced out". No tracker. Possibly a reason to
  defer less to the close after big moves in the morning reports.
- **Q1 fails:** the lead is closed. This season's 14 of 32 is recorded as noise.

Whatever the result, this file is never edited after scoring except to append the results below a
line. A change of method is a new version (`move-2`).

## Caveats

- **"Open" is the first posted price,** often the day before and at low limits, in both sets.
- **Causes:** big moves mix injury news, rest decisions and money, and past seasons have no
  timestamps to tell them apart. R3 (injury-news timing) needs this season's timestamped prices.
- **Set B is two seasons, a decade old,** from offshore books. Set A is the more relevant set but
  partly seen. That's why both must agree.
