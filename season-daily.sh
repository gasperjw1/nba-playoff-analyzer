#!/usr/bin/env bash
# ============================================================
# season-daily.sh — run the right fetch-slate.js phase for the
# time of day, at most once per phase per day.
#
#   any hour        settle open ledger rows via ESPN (safe to repeat)
#   from 11:00 ET   snapshot the NB.AI feed + record tonight's predictions
#                   (the feed refreshes early afternoon; before that it is
#                   usually yesterday's slate, which --record refuses)
#   from 17:00 ET   if NB.AI is still stale or unreachable, record from the ESPN fallback
#                   slate instead (fetch-slate.js --espn). The day stays
#                   open, so a later run records from NB.AI once it
#                   refreshes, replacing the fallback rows before tip-off.
#
# State lives in .season-daily-state (gitignored) so repeat runs in a
# day are no-ops. Run by hand; commands are pinned at the top of
# DAILY_UPDATE.md.
#
#   ./season-daily.sh            normal run
#   ./season-daily.sh --force    ignore the once-per-day state
#   ./season-daily.sh --hook     never exits non-zero (for any automation)
#   ./season-daily.sh --status   show what has run today, do nothing
#   ./season-daily.sh --espn     use the ESPN fallback now (any hour) if NB.AI is stale or down
# ============================================================
set -u
cd "$(dirname "$0")" || exit 1

STATE=.season-daily-state
RECORD_FROM_HOUR=11
FALLBACK_FROM_HOUR=17
FORCE=0; HOOK=0; STATUS=0; ESPN=0
for a in "$@"; do
  case "$a" in
    --force) FORCE=1 ;;
    --hook) HOOK=1 ;;
    --status) STATUS=1 ;;
    --espn) ESPN=1 ;;
  esac
done

TODAY=$(TZ=America/New_York date +%F)
HOUR=$((10#$(TZ=America/New_York date +%H)))
touch "$STATE"

log() { echo "[season-daily] $*"; }
done_today() { grep -q "^$1=$TODAY\$" "$STATE"; }
mark() {
  grep -v "^$1=" "$STATE" > "$STATE.tmp" 2>/dev/null || true
  echo "$1=$TODAY" >> "$STATE.tmp"
  mv "$STATE.tmp" "$STATE"
}
fail_exit() { [ "$HOOK" -eq 1 ] && exit 0 || exit 1; }

if [ "$STATUS" -eq 1 ]; then
  log "today (ET) $TODAY, hour $HOUR"
  done_today settle && log "settle: done today" || log "settle: not yet today"
  done_today record && log "record: done today" || log "record: not yet today"
  exit 0
fi

if ! command -v node >/dev/null 2>&1; then
  log "node not found on PATH — nothing run"
  fail_exit
fi

# ── 1. settle yesterday's open rows ──────────────────────────
if [ "$FORCE" -eq 1 ] || ! done_today settle; then
  if out=$(node fetch-slate.js --settle 2>&1); then
    mark settle
    log "settle: $(printf '%s\n' "$out" | grep -E '^(Settled|Nothing)' | head -1)"
    printf '%s\n' "$out" | grep -E '^  (ours|friend|market|blend|baseline|props) ' | sed 's/^/[season-daily]   /'
  else
    log "settle FAILED: $(printf '%s\n' "$out" | tail -2 | tr '\n' ' ')"
  fi
else
  log "settle: already ran today"
fi

# ── 2. snapshot + record tonight's slate ─────────────────────
espn_fallback() {
  if fb=$(node fetch-slate.js --espn --record 2>&1); then
    log "ESPN fallback: $(printf '%s\n' "$fb" | grep -E '^(Slate |Ledger:|Props ledger:)' | tr '\n' ' ')"
    printf '%s\n' "$fb" | grep -E '^  ([A-Z]{2,4} @ |check: )' | sed 's/^/[season-daily]   /'
    if printf '%s\n' "$fb" | grep -q '^Ledger: +[1-9]\|[1-9][0-9]* replaced'; then
      log "fallback rows recorded (no NB.AI) — review any 'check:' lines, commit js/season/data/slate-snapshot.js, season-ledger.js and props-ledger.js; run again if NB.AI refreshes before tip-off"
    fi
  else
    log "ESPN fallback FAILED: $(printf '%s\n' "$fb" | tail -2 | tr '\n' ' ')"
  fi
}

if [ "$HOUR" -lt "$RECORD_FROM_HOUR" ] && [ "$FORCE" -eq 0 ] && [ "$ESPN" -eq 0 ]; then
  log "record: before ${RECORD_FROM_HOUR}:00 ET (now ${HOUR}:xx) — NB.AI refreshes early afternoon; run again later"
elif [ "$FORCE" -eq 1 ] || ! done_today record; then
  NBAI_DOWN=0
  if out=$(node fetch-slate.js --record 2>&1); then
    # Only count the day as done when the feed was today's slate; a stale
    # feed leaves the phase open so a later run retries.
    if printf '%s\n' "$out" | grep -q '^Ledger: +'; then mark record; fi
    log "record: $(printf '%s\n' "$out" | grep -E '^(Slate |Ledger:|Props ledger:|record skipped)' | tr '\n' ' ')"
    printf '%s\n' "$out" | grep -E '^  [A-Z]{2,4} @ ' | sed 's/^/[season-daily]   /'
    if printf '%s\n' "$out" | grep -q '^Ledger: +[1-9]\|[1-9][0-9]* replaced'; then
      log "new rows recorded — commit js/season/data/slate-snapshot.js, season-ledger.js and props-ledger.js"
    fi
    printf '%s\n' "$out" | grep -q '^record skipped: feed slate is' && NBAI_DOWN=1
  else
    log "record FAILED (NB.AI): $(printf '%s\n' "$out" | tail -2 | tr '\n' ' ')"
    NBAI_DOWN=1
  fi
  # NB.AI stale or unreachable: from FALLBACK_FROM_HOUR (or with --espn)
  # record from ESPN instead. The phase stays open so NB.AI can still
  # replace these rows before tip-off.
  if [ "$NBAI_DOWN" -eq 1 ]; then
    if [ "$HOUR" -ge "$FALLBACK_FROM_HOUR" ] || [ "$ESPN" -eq 1 ]; then
      espn_fallback
    else
      log "NB.AI not usable yet — run again later; from ${FALLBACK_FROM_HOUR}:00 ET this records from ESPN instead (or now: ./season-daily.sh --espn)"
    fi
  fi
else
  log "record: already ran today"
fi

exit 0
