# PLAYOFF RUN — Coaching Sim Game Plan

> Design + build plan for the coaching simulation game built on the analyzer's
> engine and 2026 playoff dataset. Agreed across design sessions Aug 2026.
> Working name: **Playoff Run**. Lives in this repo under `js/game/` as an
> additive namespace (baseball precedent) — no NBA analyzer file is modified
> beyond `index.html` script tags. Long-term: expand to full season + playoffs.

---

## The game in one paragraph

You pick one of the 16 teams from the 2026 playoffs and coach it through the
bracket. AI coaches (typed profiles derived from the real 2026 coaching data)
run the other 15 teams. You control rotations/minutes, defensive assignments,
star-coverage posture, pace/3PT posture, offensive hierarchy, timeouts, and a
halftime adjustment. Every run diverges from history: seeded RNG drives game
outcomes, per-series hidden player form, and injuries. Scoring is
expectation-relative (each team's championship equity is shown up front) plus
**Coaching Value Added** — your decisions vs. what your CPU assistant would
have done, evaluated in expectation (process, not outcome).

## Design laws (from the data work — do not violate silently)

1. **Rating is an output**: player effectiveness = base skill × role fit ×
   lineup context × matchup × fatigue × hidden series shift. Never a static input.
2. **Show samples, never means.** The engine's point estimates are calibrated
   means of a σ≈17 distribution. The game always samples.
3. **No lever without a mechanism.** Every user control maps to a modeled,
   measured effect. No cosmetic sliders.
4. **No cross-game momentum.** Measured serial correlation of margins ≈ 0.
   Only fatigue, injuries, and coach adjustments (small mean shifts) carry.
5. **Tiered honesty** (green/yellow/red): validated effects shown as numbers;
   noisy effects shown as ranges; variance shown as events, never knobs.
6. **Anti-solvability is a tested property** (solver audit), not an assertion.

## Empirical targets (measured from 169 real playoff games, 2025+2026)

| Statistic | Target | Notes |
|---|---|---|
| Mean abs margin | 14.0 | ±1.5 tolerance |
| P(margin ≥ 15 / 20 / 30) | 37% / 23% / 12% | fat tails are real |
| Serial corr of consecutive margins | ~0 | \|r\| < 0.08 |
| Consecutive-game 20+ pt swings | 40% | ±7pp |
| Home win rate / home vs road win margin | ~57% / 16.9 vs 9.4 | blowouts are home events |
| Elimination saves (one side facing) | ~46% | facing team often hosts G6; wide tolerance |
| Player pts CV by tier (star/mid/role) | 0.27 / 0.35 / 0.55 | flat 0.28 was wrong for role players |
| Player serial corr vs season baseline | +0.33 | persistent series shift, ICC ≈ 0.3 |
| Post-spike / post-dud next game | 113% / 73% of baseline | duds 2× stickier than spikes |
| Playoff scoring vs season | 92% | league-wide suppression |

Research anchors: Clauset/Kogan/Redner (anti-persistent walk, lead-safety),
Goldman & Rao + Skinner (usage-efficiency curves), Miller & Sanjurjo
(small-sample streak bias — the artifact we hit ourselves), Bocskocsky
(defense responds to hot players → scheme response lives in coach AI),
timeout momentum study (−3.74 → −1.20), B2B/rest studies (non-monotonic
fatigue: rust after 3+ days), ACWR critique + healthy-worker bias (keep the
injury hazard simple). Full list in the Aug 2026 research session.

## Architecture — three sim layers

1. **Capacity** (`capacity.js`) — deterministic. Active roster + minutes →
   team ORtg/DRtg via minutes-weighted player impacts (oLEBRON/dLEBRON),
   self-calibrated so the full-strength default rotation reproduces each
   team's real advStats (fidelity guarantee). Usage redistribution with
   efficiency penalty (Goldman-Rao) makes star-less teams score sub-100
   naturally. Outputs expected score pair + player share vector.
2. **Regime** (`regime.js`) — samples the game's character (competitive /
   home runaway / away runaway) conditioned on venue, styles, elimination.
   This is where 130-90-then-90-130 comes from.
3. **Trajectory** (`trajectory.js`) — quarter-by-quarter anti-persistent walk
   with capitulation/garbage dynamics (lead-safety), OT; allocates team
   totals down to player box lines (per-tier CV, right-skewed noise, hidden
   series shift). Timeout + halftime hooks.

Orchestrated by `game-sim.js` (single game + best-of-7 series), consumed by
`run-state.js` (bracket, persistence) in Phase 2.

## Phases & gates

- **Phase 0 — Foundations**: `GAME_PLAN.md`, `js/game/data/game-constants.js`
  (all tunables, cited), `js/game/data/coach-profiles.js` (16 typed profiles
  from the coaching blocks), `js/game/data/team-db.js` (derives GAME_TEAM_DB
  from SERIES_DATA at load — zero data duplication; role-fit via adjacency
  tables), `js/game/engine/matchup-factory.js` (any pairing → matchup
  context; derived defensive assignments). *Gate*: `test-game.js` schema +
  calibration checks; factory's derived assignments sanity-checked against
  the 8 hand-authored R1 defMatchups.
- **Phase 1 — Sim core**: the three layers + `game-sim.js`. *Gate*:
  `backtest-score-realism.js` passes the empirical-targets table above;
  `node test-projections.js` stays green (additive namespace).
- **Phase 2 — Run structure**: `injury-gen.js` (hazard = base × proneness ×
  fatigue × minutes; module header documents ACWR + healthy-worker
  warnings), `coach-ai.js` (profile-driven decisions through the SAME
  decision API as the user; **evidence model is core** — observed-evidence
  adjustment with spike/dud Bayesian discounting so baiting works but costs),
  `run-state.js` (seeded runs, bracket, graduation reuse, localStorage).
  *Gates*: headless full-bracket CPU-vs-CPU run completes in Node; equity
  table generated (10k brackets); `backtest-solver-audit.js` (no static
  config beats adaptive play; bait-loops not dominant).
- **Phase 3 — UI** (existing dashboard idiom): Run Setup (equity display),
  Gameplan, Game (quarter margin trace, timeouts, halftime), Series Hub
  (scouting report = decision-level attribution + AI decision grades, with
  honest confidence), Bracket, Run Summary (CVA).
- **Phase 3.5 — Roguelike layer**: `boons.js`. Boon award by **process CVA**
  (re-sim user plan vs assistant plan under same latent state; expected
  margin delta): win+clear edge → rare; win+comparable → common;
  loss+clear edge → common (the anti-tilt rule). Boon taxonomy: dice
  (advantage/disadvantage sampling), state (re-roll a shift, fatigue
  refresh, injury protection), information (shift estimates, opponent
  adjustment hints). Flavored as coaching prep, never magic. Loadout slots,
  not unlimited stacking. Scouting-report depth gated by information boons.

## Status (Aug 26, 2026)

**Phases 0-3 BUILT and GATED — the game is playable.** Enter via the
🏆 Playoff Run sport-switcher button. Setup (equity-honest team select,
shareable seed) → Gameplan (minutes budget vs 240, coverage, scratches/
fatigue badges, series log, league ticker) → Result (quarter margin trace,
box scores, per-game process-CVA chip) → Bracket → Summary (CVA total,
outcome vs baseline equity). Save/resume via localStorage (counting-RNG
fast-forward; verified across real page reloads). Browser playtest caught
and fixed: depth-first scheduler (whole West CF resolving before an East
R1 G1 — now strictly round-major, regression-tested) and a 241/240
default-minutes rounding drift. Solver-audit round 2 caught the adaptive
coach overreacting to single-game duds (belief 0.78 off one bad game →
minutes cut); fixed with evidence-discipline rules (n>=2 to react, top-2
talent protected, conviction scales with sample) + playoff-weighted
default rotations. Audit now confirms adaptive >= best static on fresh
seeds. Coaching-depth iteration (user playtest feedback, same day): plans now
PERSIST across games/series (reconcile-don't-reset + localStorage prefs);
per-player role assignment selects with live miscast tinting; explicit
STARTERS (drive OT minutes, garbage handling, and the new SPM synergy
lever — analyzer chemistry engine reused, self-calibrated so the default
five = 0, sized small after TEST 21 caught chemistry offsetting a benched
star); stopper (defensive assignment) override with interior-miscast
penalty; post-game COACH'S REPORT (true attribution: coverage outcomes vs
season baselines, double tradeoff results, chemistry, overload warnings,
spike/dud notes with the duds-2x-predictive framing).
Playtest rounds 2-3 (same day): RETURNING PLAYERS (real injuries parsed
into return timelines — Edwards ~9 games, Doncic ~6, Lillard out-for-run;
no more ghosted stars), physical per-minute stat caps (29-pts-in-12-min
killed), visible fatigue (Fresh column; light nights <24 min recover
extra; benched-player decay bug fixed), playing-hurt AGGRAVATION risk
(resting still runs the clock — load management stays a real gamble),
LINEUP COMPOSITION (G/W/B shape: 3-big spacing tax, 3-guard size tax,
shown live; composition-aware AI counters — lineups are observable, so
no evidence discount, and composition-baiting works only vs low-adjust
coaches), per-game coverage derivation (no ghost targets).
Playtest round 4 (user design): POSITIONS → DESIGNATIONS (guard /
guard-wing / wing / big / flex, derived from stats + roles, not listed
position — LeBron and Hart grade flex); composition math runs on
fractional designation credits (guard-wings half each side, flex
everywhere — versatility priced as value); NATURAL SECONDARY ROLES
derived from actual profiles (Hart→Cutter ≈ free: 7.4 rpg as a guard IS
the cutting signal; his low fgp comes from skipping threes); usage-aware
scoring depth (per-minute ceiling × shot-diet factor + damped upside
noise for low-usage players — "some players should not be scoring so
much" solved by analysis, not flat caps). NYK-ATL closeness DIAGNOSED as
data, not bug: analyzer advStats have ATL +5.7 netRtg vs NYK +6.3 —
near-even teams in 3-vs-6 clothing; sim gives NYK 65% (real series was a
competitive 4-2). Ghost-double fix: coaches can't call coverage on
players not dressing tonight.
Playtest round 5 (user design): TYPED COVERAGE JOBS — the assignment's
required role comes from the TARGET (creators/guards → Point of Attack,
bigs → Anchor Big, non-creating wings → Wing Stopper; retires the queued
Gobert-on-Jokic mispricing — big-on-big is now native fit) — and SCHEME
DISPLACEMENT: a defense is a system of assignments, so spending your
best point-of-attack defender on a non-ballhandler vacates the PoA job
and the drop-off to your next perimeter defender is a whole-scheme DRtg
cost (deep defensive corps displace cheaply; thin ones pay; guarding the
creator himself displaces nothing). Fixing the resulting TEST 21
regression surfaced a missing physics term: CREATION DEPENDENCY —
minutes-weighted playmaking below the team baseline degrades everyone's
shot quality beyond the usage-volume penalty (benching Brunson had
graded near-even because the model priced his poor defense, refunded the
opponent's coverage, and promoted a rim protector; real but incomplete).
Jobs + displacement surface live on the plan screen and in the report.
Remaining phases: 3.1 (in-game timeouts + halftime via steppable
trajectory), 3.5 (boons + scouting-report depth), parallel role study.

Phases 0-2 originally BUILT and GATED: `test-game.js` green (incl. factory calibration
vs hand-authored defMatchups, 12/16 target agreement), score-realism
harness green (18/18 metrics vs the 169-game reference, incl. favorite win
rate 59.4% vs real 58.6%), solver audit green. Equity table (CPU-vs-CPU):
OKC ~30%, SAS/BOS/DET 12-19%, mid teams 2-8%, 7-8 seeds <1%.
The first solver audit CAUGHT a degenerate 48-minute-stars meta → fixed
with minutes physics (42-min hard cap + overload penalty above 34 min +
superlinear injury hazard), not by nerfing strategy. Browser wiring of
`js/game/` into index.html deliberately deferred to Phase 3 (no dead code
on the live site until there is a UI to use it).

## Phase 3.1 (BUILT + GATED) — the in-game layer

Steppable game: regulation = **8 six-minute segments** (variance re-split
from the quarter walk; realism harness re-gated), OT = 5-min segments.
Game becomes a SESSION (open → step → finish) mirroring the series-session
pattern; simulateGameOnce wraps it, so headless paths and gates run the
same core. Player box allocation moves to per-half with a PER-GAME form
draw (noise drawn once per player per game, both halves share it — keeps
the calibrated CVs; garbage/OT effects land in H2).

- **Timeouts** (budget 4/side): mechanically a next-segment intervention —
  damps the regime drift running against the caller + adds a restoring
  pull. Honest mapping of the timeout-momentum study (−3.74 → −1.20 per
  min): timeouts blunt momentum-driven runs, do little in neutral flow,
  and damp YOUR run if called while rolling (the study's asymmetry). CPU
  calls them on a run threshold; no CVA grading of timeouts in v1.
- **Halftime adjustment**: user may revise H2 minutes (120-min budget),
  coverage (stopper/double), and roles; H2 capacities + expectation
  recomputed. Halftime CVA = expected-H2-margin delta of the revision vs
  standing pat (half-game weight, folded into run CVA). CPU coaches stand
  pat at half in v1 (documented asymmetry; their edge stays between-game
  adjustment — CPU halftime revision is a 3.1 follow-up).

Phase 3.1 build notes: segment walk re-tuned (segSD 5.2, restoringK
0.035 — 8 small steps compound more restoring pullback than 4 large
ones; realism re-gated 18/18, P(15+) dead-on 37.3%). Steppable session
chain: openSeriesGame → gameSessionStep/Timeout/Halftime →
commitSeriesGame; playSeriesGame + simulateGameOnce wrap the same core
(parity-tested). Manual timeout control is interactive-only — headless
policy runs keep CPU timeouts on both sides (a static rotation is not a
vow of timeout abstinence; audit fairness). Timeout gain measured ~+1
pt/segment when called on an opponent run. Mid-live-game saves are
forbidden by design: reloading mid-game replays cleanly from the
pre-game state. The split also caught that oppLastStarters /
oppUnavailable were consumed by coach-ai but NEVER FED in real runs
(composition counters + no-ghost-double were inert in brackets) — now
wired and pinned by TEST 22h.

## Phase 4 (speced, data-gated) — plays & playbooks

Play families as matchup modifiers: per-team typed play-profiles
(offensive family weights: drag/PnR, post splits, motion, iso; defensive
VULNERABILITIES — e.g. the user's observed "double drag was NYK defense's
kryptonite"). Effect = chosen emphasis × personnel fit (archetypes) ×
opponent vulnerability − counter-prep decay (evidence model learns what
you lean on). Data source: the USER'S season of watching + the coaching
prose — hand-authored like coach-profiles.js, each field traceable.
Not built until the data exists (no invented playbooks). May debut as a
boon-gated scouting insight before becoming a full lever.

## Parallel track (non-blocking)

Role-decomposition study (frozen git snapshots; predicts series shifts from
usage vacuum/role/matchup/coach) refines the shift priors the sim ships with.
Same educated-priors → empirical-recalibration pattern as SIGNAL_CALIBRATION.

## Deferred (explicitly, not forgotten)

Full-season mode (30 teams, 82 games — the data model is game-centric-ready
via the factory), AI misdirection against the user, after-timeout plays, junk
defenses, SPM synergy modifier on custom lineups (hook exists in capacity
opts), user coach-style profiling across runs.
