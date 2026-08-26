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

Phases 0-2 BUILT and GATED: `test-game.js` green (incl. factory calibration
vs hand-authored defMatchups, 12/16 target agreement), score-realism
harness green (18/18 metrics vs the 169-game reference, incl. favorite win
rate 59.4% vs real 58.6%), solver audit green. Equity table (CPU-vs-CPU):
OKC ~30%, SAS/BOS/DET 12-19%, mid teams 2-8%, 7-8 seeds <1%.
The first solver audit CAUGHT a degenerate 48-minute-stars meta → fixed
with minutes physics (42-min hard cap + overload penalty above 34 min +
superlinear injury hazard), not by nerfing strategy. Browser wiring of
`js/game/` into index.html deliberately deferred to Phase 3 (no dead code
on the live site until there is a UI to use it).

## Parallel track (non-blocking)

Role-decomposition study (frozen git snapshots; predicts series shifts from
usage vacuum/role/matchup/coach) refines the shift priors the sim ships with.
Same educated-priors → empirical-recalibration pattern as SIGNAL_CALIBRATION.

## Deferred (explicitly, not forgotten)

Full-season mode (30 teams, 82 games — the data model is game-centric-ready
via the factory), AI misdirection against the user, after-timeout plays, junk
defenses, SPM synergy modifier on custom lineups (hook exists in capacity
opts), user coach-style profiling across runs.
