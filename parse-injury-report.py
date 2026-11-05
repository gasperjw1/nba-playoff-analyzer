#!/usr/bin/env python3
# ============================================================
# parse-injury-report.py — official NBA injury report PDF → JSON
# ============================================================
# The NBA publishes the league injury report as a PDF every half hour
# (https://ak-static.cms.nba.com/referee/injury/Injury-Report_<date>_<hh_mmAM|PM>.pdf,
# times ET). replay-season.js uses it to know, for a past day, who the
# league listed as Out / Doubtful / Questionable / Probable before tip-off.
#
# The PDF's text stream is in the table's row order; each word's x
# position says which column it is in (edges read from the header row).
# Reasons that wrap onto a second line stay with their player, and a
# team or matchup carries forward until the next one, across pages.
#
# Setup (once): python3 -m venv .cache/pyenv && .cache/pyenv/bin/pip install pypdf
# Usage:        .cache/pyenv/bin/python -I parse-injury-report.py <report.pdf>
# Output (stdout): {"reportTime": "...", "entries": [...], "notSubmitted": [...], "unparsed": [...]}
#   entry = {gameDate, gameTime, matchup, team, player, status, reason}
# ============================================================
import json
import re
import sys

import pypdf

TEAMS = [
    'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets', 'Chicago Bulls',
    'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons',
    'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers', 'LA Clippers',
    'Los Angeles Clippers', 'Los Angeles Lakers', 'Memphis Grizzlies', 'Miami Heat',
    'Milwaukee Bucks', 'Minnesota Timberwolves', 'New Orleans Pelicans', 'New York Knicks',
    'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns',
    'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors',
    'Utah Jazz', 'Washington Wizards',
]
STATUSES = ('Out', 'Doubtful', 'Questionable', 'Probable', 'Available')


COLUMNS = ('gameDate', 'gameTime', 'matchup', 'team', 'player', 'status', 'reason')
# Header row: "Game Date | Game Time | Matchup | Team | Player Name | Current Status | Reason".
# Each column's left edge is the x of its header's first word.
HEADER_FIRST = [('Game', 'gameDate'), ('Game', 'gameTime'), ('Matchup', 'matchup'), ('Team', 'team'),
                ('Player', 'player'), ('Current', 'status'), ('Reason', 'reason')]


def fragments(path):
    """(page, x, y, word) in content-stream order, which is the table's row order."""
    out = []
    for n, page in enumerate(pypdf.PdfReader(path).pages):
        def visit(text, cm, tm, font, size, n=n):
            if text.strip():
                out.append((n, tm[4] * cm[0] + cm[4], tm[5] * cm[3] + cm[5], text.strip()))
        page.extract_text(visitor_text=visit)
    return out


def parse(path):
    frags = fragments(path)
    # Column left edges from the header row ("Game Date", "Game Time", ...): a word
    # belongs to the right-most column whose edge is at or left of it (2 pt slack).
    header_y = next((y for n, x, y, w in frags if n == 0 and w == 'Matchup'), None)
    if header_y is None:
        raise ValueError('header row not found on page 1')
    head = [(x, w) for n, x, y, w in frags if n == 0 and abs(y - header_y) < 1]
    edges, k = {}, 0
    for x, w in sorted(head):
        if k < len(HEADER_FIRST) and w == HEADER_FIRST[k][0]:
            edges[HEADER_FIRST[k][1]] = x; k += 1
    if set(edges) != set(COLUMNS):
        raise ValueError(f'header columns not found: {sorted(set(COLUMNS) - set(edges))}')
    order = sorted(COLUMNS, key=lambda c: edges[c])
    # Every page has a banner ("Injury Report: <date> <time> PM") on top and a
    # "Page N of M" footer; only page 1 has the header row.
    top = {n: y for n, x, y, w in frags if w == 'Report:'}
    bottom = {n: y for n, x, y, w in frags if w == 'Page'}
    page1_body_top = header_y - 1

    def column(x):
        col = order[0]
        for c in order:
            if x >= edges[c] - 2:
                col = c
        return col

    merged, i = [], 0
    while i < len(frags):
        if [f[3] for f in frags[i:i + 3]] == ['NOT', 'YET', 'SUBMITTED']:
            merged.append((frags[i][0], edges['player'], frags[i][2], 'NOT YET SUBMITTED')); i += 3
        else:
            merged.append(frags[i]); i += 1
    frags = merged
    state = {'gameDate': None, 'gameTime': None, 'matchup': None, 'team': None}
    entries, not_submitted, unparsed = [], [], []
    cur, name, team_words, prev_col, glue = None, [], [], None, False
    for n, x, y, w in frags:
        if (n == 0 and y >= page1_body_top) or (n in top and y >= top[n] - 1) or (n in bottom and y <= bottom[n] + 1):
            continue
        col = column(x)
        if col != 'team' and team_words:
            state['team'] = ' '.join(team_words); team_words = []
        if col == 'gameDate':
            state['gameDate'] = w; cur = None
        elif col == 'gameTime':
            state['gameTime'] = (state['gameTime'] + ' ' + w) if prev_col == 'gameTime' else w
            cur = None
        elif col == 'matchup':
            state['matchup'] = w; cur = None
        elif col == 'team':
            if prev_col != 'team':
                team_words = []
            team_words.append(w); cur = None
        elif col == 'player':
            if w == 'NOT YET SUBMITTED':
                not_submitted.append({**state}); cur = None
            elif name and (glue or (len(w) == 1 and not w.isascii())):
                # Accented letters come out as their own fragment ("L", "ó", "pez"):
                # glue the letter and the fragment after it back onto the word.
                name[-1] += w; glue = len(w) == 1 and not w.isascii()
            else:
                name.append(w); glue = False
        elif col == 'status':
            if not name or w not in STATUSES:
                unparsed.append(f'{w} (no player)'); prev_col = col; continue
            cur = {**state, 'player': ' '.join(name), 'status': w, 'reason': ''}
            entries.append(cur); name = []
        else:  # reason
            if cur is None:
                unparsed.append(w)
            else:
                cur['reason'] = (cur['reason'] + ' ' + w).strip()
        prev_col = col
    if name:
        unparsed.append(' '.join(name))
    for e in entries:
        e['reason'] = re.sub(r'\s*-\s*', ' - ', e['reason']).replace('Two - Way', 'Two-Way').strip()
        e['gameTime'] = (e['gameTime'] or '').replace(' (ET)', '')
    bad = [e for e in entries if not (e['gameDate'] and e['gameTime'] and e['matchup'] and e['team'] in TEAMS and ', ' in e['player'])]
    unparsed += [f"malformed: {e}" for e in bad]
    return {'entries': entries, 'notSubmitted': not_submitted, 'unparsed': unparsed}


if __name__ == '__main__':
    out = parse(sys.argv[1])
    m = re.search(r'Injury-Report_(\d{4}-\d{2}-\d{2})_(\d{2})_(\d{2})([AP]M)', sys.argv[1])
    out['reportTime'] = f'{m.group(1)} {m.group(2)}:{m.group(3)} {m.group(4)} ET' if m else None
    json.dump(out, sys.stdout)
