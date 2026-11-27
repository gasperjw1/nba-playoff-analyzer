# Research gaps and next steps (2026-11-26)

The user asked where the model goes wrong, where more research is needed, and which areas are the gaps.
This file records the answer and the research queue that comes out of it. It does not freeze anything:
each study below gets its own pre-registered spec before any number is looked at.

**Data used:**
- the leak-free replay (replay-9, engine `2026-11-07.rotcap`): 270 games through Nov 25;
- the live ledger: 111 settled games over 14 recorded days (Nov 2–18);
- the backfill (`js/season/data/season-backfill.js`, Nov 19–25, 48 games), display only and counted in nothing below except where it says so;
- the walk notes (`WALK_2026-11-19_25.md`).

The numbers come from two scratch scripts that read the committed ledgers (not committed, the same way as `MODEL_AUDIT.md`).

---

## 1. The headline

The model is about as good as DraftKings' close, and no better. It seemed to **anticipate where the
line will move**, but the re-check below shows most of that came from the tip-time model seeing injury
news the open didn't have. A model limited to what was known when the open was posted keeps only a weak
edge over the open (z about 1). We almost never record early prices, so we can't test even that.

| Model minus the close, Brier (lower is better) | Games | Difference |
|---|---|---|
| Replay, whole season | 270 | +0.0011 ± 0.0029 (even) |
| Live, with the injury report | 111 | +0.0106 ± 0.0076 |
| Live, Ours · 2025-26 | 82 | +0.0057 ± 0.0053 |
| NB.AI | 73 | +0.0328 ± 0.0117 (clearly worse) |

**Line moves (replay, games where the model was 5+ pts off DraftKings' open, n 106):**
- the close moved toward the model in **81 of 106**;
- the model's side won 60;
- the open's prices expected 54.9 wins and the close's 59.9.

The model knows what the market learns later in the day, and nothing beyond that.

**Re-check (2026-11-26): most of this is timing, not skill.**
- The tip model reads the injury report 60+ minutes before tip. The open is posted earlier, usually
  the day before, so part of the "anticipation" is just later news.
- The same test using the replay's earlier models (the injury report available at that time) gives:

| Model used | Games 5+ pts off the open | Close moved toward it | Its side won | Open said | Close said | z vs open |
|---|---|---|---|---|---|---|
| Tip (report 60+ min before) | 106 | 81 (gap closed on average: 42%) | 60 | 54.9 | 59.9 | 1.04 |
| Morning (8:30 AM report) | 101 | 66 (24%) | 59 | 53.4 | 56.4 | 1.16 |
| Evening before (8:30 PM report) | 100 | 66 (26%) | 58 | 53.1 | 56.1 | 1.04 |

- Against the close, the earlier models are no worse than the tip model:
  - evening Brier −0.0009 ± 0.0039;
  - morning −0.0007 ± 0.0038;
  - tip +0.0011 ± 0.0029.

  So on the replay, the near-tip report step adds nothing.
- **What survives:** an early model beat the open by about 5 wins in 100 (z ≈ 1), and the close took
  only about a quarter of its gap. That's a lead to test with real early prices (R1), not an edge.

---

## 2. Where we go wrong

### 2a. We record late, or not at all (the biggest gap)
- 9 of the 23 game days from Nov 2 to Nov 25 were never recorded: Nov 14, 17 and 19–25. Nov 3 had no games. (The first version of this file said 11 of 25, counting Nov 3 and today.)
- Recorded rows sit a median **4.2 h** before tip, after most of the line move.
- morning-1 (`MORNING_SPEC.md`), the test built for exactly this question, has **0 rows**.

### 2b. Patterns drawn from small samples fail live
- **Trust rule R2 (roster change):** 7 of 9 on the replay dev set it was drafted from, **2 of 7 live (−3.57u)**.
- **All trust rules live:** 10 of 22, −2.23u.
- **Basketball takes:** 1 win, 4 losses, plus ATL withdrawn (it won).
- **My shading off the close in the catch-up walk:** 2 of 5.

The rule stands (`feedback_live_evidence`): replay results are a dev set. A rule counts only after it
survives games it was not drawn from.

### 2c. The model loses when it disagrees because of injuries
Gaps of 5+ pts driven by absences won **6 of 17** in the replay (7.5 expected by the close). Gaps driven
by roster changes went 12 of 16 (8.1 expected) on the same dev set, which is where R2 came from and
then failed. absence-1 (`ABSENCE_ROLES_RESEARCH.md`) showed the absence *values* are about right. So
the open question is timing, not value (study R3).

### 2d. Too many overlapping trackers, each too small to read

| Tracker | Live record |
|---|---|
| pitch-1 floor | 7 of 9 tickets, legs 24 of 26 |
| pitch-1 edge | never pitched in 9 nights |
| pitch-2 favourites | safe 3 of 4, lean 3 of 4 |
| flat-1 (every favourite −299 to −100) | 21 of 35, −$57.49 |
| The user's own FanDuel legs | 19 of 28, +$54.29 |
| fade-1 | 4 of 8, −$43.73 |
| pitch-3 straights | 4 of 7 (z 0.11), +$56.82 |
| pitch-3 pairs | 0 of 2 |
| b2b-1 | 8 games, pooled t 2.61 |

- flat-1, pitch-2 and the user's own legs are largely the same favourites bet.
- pitch-3 and flat-1 often take opposite sides of the same game (`MODEL_AUDIT.md`).
- Each tracker splits a small sample further.

### 2e. NB.AI is the weakest input
- Brier vs the close: +0.0328 ± 0.0117.
- It needs refreshing by hand, and its prior leaks this season (`walk_forward_replay`).

---

## 3. What is working
- **Props 90% floor is calibrated:** 92.0% went over against 91.1% shown (n 1,270). The floor ticket is
  honest, but this is calibration, not an edge over a price. No prop price is tracked yet.
- **b2b-1:** the team-specific back-to-back split is the one structural factor that holds up (pooled
  t 2.61 with last season), but it has only 8 live games.

---

## 4. Research queue, in priority order

Each item says what it asks, the data, what must be pre-registered, and what "done" looks like.

### R1. Early price capture (process; blocks R3 and the live half of R2)
- **Question:** does the model's side beat the price it could actually be bet at, early in the day? The re-check in §1 makes the expected edge small (an early model won about 5 more games in 100 than the open said, z ≈ 1), so R1 is needed to *test* the edge before anyone counts on it.
- **Needs:** a morning price with a timestamp on every slate, from DraftKings and FanDuel.
  - ESPN's core odds endpoint gives DraftKings' open for free.
  - The Odds API costs credits, so pull it only when the user asks (never below 5,000 left, at most 10 credits per game).
- **Steps:**
  1. Run the morning record (morning-1, 11 AM–1 PM ET) every day.
  2. Store the open beside every ledger row.
  3. Flag missed days on the site instead of leaving them blank.
- **Done when:** two straight weeks with no unrecorded day and morning-1 rows on every slate. Then
  morning-1 is read at its own retire point (300 games, t ≥ 2 at season end).

### R2. Do big line moves overreact? (`move-1`, the best untested lead)
**Status:** pre-registered 2026-11-26 in `LINE_MOVE_RESEARCH.md` (commit d2d5ea8); code `research-line-move.js` (7e69475), dry run only, not yet scored.

**Re-check (2026-11-26):**
- The maths was tested on simulated games: a right close gives k 0.99, a right open k 0.03, a half-real move k 0.49, and an under-move k 1.46. Swapping home and away gives identical numbers, and the betting returns check by hand.
- **Under the spec's 30-pt cap, this season's lead is 14 of 31** (z −1.58), not 14 of 32 (z −1.84). The dropped game is DAL@CLE on Nov 14 (home 56% → 26%).
- **What it can detect** (prices only, no results):
  - Set A passes only if k ≤ 0.65 (SE 0.18);
  - Set B only if k ≤ 0.70 (SE 0.30).

  An overreaction where most of the move is real (k ≈ 0.8) would fail. A fail rules out a large overreaction, not a small one.

- **Seen this season (it can't confirm itself):**
  - when the price moved 8+ pts from open to close, the side it moved to won **14 of 32**;
  - the close expected 18.9 and the open 14.8, so results matched the open;
  - example: Detroit without Cunningham, a line moving 11 pts against them, won by 18.
- **Data:** `.cache/espn-nba/hist-odds`, 3,701 past games with multi-book opens and closes.
  This season's 32 games are where the idea came from, so they're excluded from the test.
- **Pre-register before looking:**
  - the move threshold (or a small fixed grid);
  - the side;
  - the metric: wins against the close's implied total, and the paired Brier of open vs close;
  - the split by season, with one holdout block scored once;
  - what counts as a pass.
- **Done when:** the spec is committed, then scored once.
  - A pass becomes a frozen live tracker.
  - A fail is written up and the lead is closed.

### R3. When injury news reaches the line, not what it's worth
- **Question:** when the official report changes, how fast does the price move, and does the model's
  absence-driven gap still lose once the news is in the price?
- **Data:**
  - report snapshots (posted every 15 minutes; our lookup still steps in 30-minute slots, see `TODO.md`);
  - timestamped prices from R1;
  - historical timestamps would need credits, so pull them only when the user asks.
- **Done when:** a pre-registered timing study runs on 2025-26 plus this season's recorded rows. It
  decides whether the AVOID rule should key on report timing instead of the size of the gap.

### R4. Watch list: signals at 0.8–1.7 SE, re-checked at set points, no action before then

| Signal | Now | Re-check at | Pre-registered on history first? |
|---|---|---|---|
| Road teams beat the close | won 140 of 270 vs 145.8 expected, z −0.78 (the model expects 148.7, so its home court may be too big) | 500 games | yes: home court by season vs the close, 2021–26 |
| Favourites at 75%+ by the close | won 62 of 69 vs 56.7, z +1.68 | 150 such games | yes: favourite calibration vs the close on hist-odds |
| Model picks at 50–60% | won 38 of 77 vs 42.3, z −0.98; the close's own 50–60% picks won 45 of 80 vs 44.1 (defer to the market in near-even games?) | 150 games | no, live only |
| b2b-1 | 8 games, pooled t 2.61 | 40 live games | already frozen |

### R5. Fewer trackers (a decision, not a study)
Frozen specs are never edited, so consolidation means either retiring a tracker at a stated point or a
new combined spec. The proposal, for the user to decide:
- keep pitch-1 floor, pitch-3 straights, b2b-1 and morning-1;
- treat flat-1, pitch-2 and the user's own legs as one favourites read;
- read fade-1 and the pitch-3 pairs only at their own retire points.

### R6. Data quality
- ESPN's records contradict themselves on the open in 4 of 270 games. Exclude or flag them in every open-vs-close study (R2, R3).
- The Replay tab stops at Nov 6, because refreshing `season-replay.js` breaks 3 tests that pin frozen text (morning reports ≥6 h before tip, the LATE2 description).
  - Fix: update the tests to read the frozen values instead of pinning text, or add a dated replay file. Never edit the frozen specs.
- The Nov 18 ball-ledger takes are not yet settled (NO lost, DAL won, BOS lost, ATL withdrawn and won). The peer session owns `ball-ledger.js`.
- NB.AI is refreshed by hand. The ESPN fallback (`--espn`) covers stale days.

---

## 4b. Where an edge over the market could come from (added 2026-11-26)

The user's goal is to be more accurate than the market by using information it doesn't use.

**The honest base rate:**
- About 150 questions have been tested here against the close; one passed (the team back-to-back split).
- The market already holds the box scores, ratings, schedule, travel, rest, returns and injury news (all tested).
- So an edge has to come from one of three places:
  - **Speed:** knowing news before the price moves;
  - **Structure:** a pricing shortcut the books take;
  - **Data the books don't model:** lineups, officials, shot profiles.

The basketball questions are queued in `BASKETBALL_PLAN.md` (the peer session's plan: B1–B7, then
play-by-play stages 0–4). This list ranks them alongside the market-structure ideas from this review:

| Order | Idea | Why the market might miss it | Data we have | Status |
|---|---|---|---|---|
| 1 | **B1 "live by the three":** game-specific variance | Books turn a spread into a moneyline with one fixed spread of outcomes, and so does our engine (12.5). In high-variance games (many threes, slow pace) the underdog's moneyline would be too long. It needs no better forecast of the margin, only of its spread. | box scores and closes, 2015-26 | not run; highest prior in the plan |
| 2 | **Sharp book leads DraftKings and FanDuel** | DraftKings and FanDuel shade toward recreational money. Pinnacle prices for sharp bettors and moves first, so a gap between them is information DraftKings and FanDuel haven't priced yet. | odds-2 already pulls Pinnacle at no extra credit, but `.odds/odds-ledger.json` has Pinnacle on only 7 games (pulls stopped after Nov 18) | **built as shop-2** (SHOP2_SPEC.md, frozen 30178a2): the backfill (108 bets) shows the better of FanDuel and DraftKings lifts EV by 0.65 pts a bet; FanDuel and DraftKings almost never beat Pinnacle by 1%+ (1 side in 16 nights); live from Nov 27, needs the hour-before `--odds` pulls |
| 3 | **move-1:** overreaction to big moves | Recreational money piles onto news | registered | ready to score |
| 4 | **Questionable players: who actually plays** | The open has to price the uncertainty. Predicting the resolution (player history, reason, back-to-back, team habits) beats it only before the news is out. | 579 cached report snapshots | R3; needs timestamped prices (R1) |
| 5 | **B3 return ramp,** star-specific, first 3 games back | Minutes limits | box scores | prior lowered: returns and arrivals were priced right at team level (0.99 ± 0.16, `INJURY_PIECE_RESEARCH.md`) |
| 6 | **B2 bench depth** behind b2b-1 | Extends the only pass | box scores | queued |
| 7 | **Lineups, closers, referees** (stages 0–2) | Books price teams and injuries, not who actually closes games or the whistle | needs the full play-by-play build (about 3 GB, free) | after B1–B5 |
| — | **In-game prices** | Live markets are far less efficient | needs live data and fast action | not planned: a different product |

**How each is judged** (the plan's standard):
- pre-registered;
- scored against the close;
- built on some seasons and judged on others;
- then a live shadow judged by line movement (about 150 games) before results.

"More accurate than the market" can be claimed only after the live shadow holds.

## 5. What not to do next
- **No new engine features before R1 and R2.** Four engine versions already scored about the same against the close (`MODEL_AUDIT.md`).
- **No rule from the replay alone.** It is the dev set.
- **Never cite "DraftKings or FanDuel sided with us" as support.** Judge by results where we differ from the price.
- **Never backfill missed days into a ledger.** The backfill file is display only.

None of this is betting advice, and no edge here is proven.
