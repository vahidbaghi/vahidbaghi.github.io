# -*- coding: utf-8 -*-
"""Rewrites the prev/next table at the foot of every post.

Posts were numbered in the order they were written, but the ones recovered from
Telegram and X carry their original dates and slot in between, so neighbours
have to be worked out from the date rather than the file number.

Run from the repo root:  python tools/fix_nav.py
"""
import io
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FA = '۰۱۲۳۴۵۶۷۸۹'
def fa(n):
    return ''.join(FA[int(c)] if c.isdigit() else c for c in str(n))

src = io.open(os.path.join(ROOT, 'assets', 'posts.js'), encoding='utf-8').read()
rows = []
for m in re.finditer(
        r'^\[(\d+),"([^"]*)",(\d+),(\d+),(\d+),"([^"]*)",\[[^\]]*\],"[^"]*","([^"]*)"\],?$',
        src, re.M):
    if m.group(6) != 'پست':
        continue
    rows.append({'id': int(m.group(1)), 'title': m.group(2), 'y': int(m.group(3)),
                 'm': int(m.group(4)), 'd': int(m.group(5)), 'href': m.group(7)})
rows.sort(key=lambda r: (r['y'], r['m'], r['d'], r['id']))
print('%d posts, %s → %s' % (len(rows),
      '%d/%02d' % (rows[0]['y'], rows[0]['m']), '%d/%02d' % (rows[-1]['y'], rows[-1]['m'])))

TBL = re.compile(
    r'(<div class="jp-outputs"><table class="dataframe"><thead><tr><th></th>'
    r'<th>title</th><th>date</th></tr></thead><tbody>).*?(</tbody></table></div>)', re.S)

changed = 0
for i, r in enumerate(rows):
    path = os.path.join(ROOT, 'blog', 'posts', '%d.html' % r['id'])
    if not os.path.exists(path):
        continue
    nav = []
    if i > 0:
        nav.append(('prev', rows[i - 1]))
    if i < len(rows) - 1:
        nav.append(('next', rows[i + 1]))
    body = ''.join(
        '<tr><th class="l mono">%s</th><td><a href="%s">%s</a></td>'
        '<td class="num">%s/%s</td></tr>'
        % (k, n['href'], n['title'], fa(n['y']), fa('%02d' % n['m']))
        for k, n in nav)
    html = io.open(path, encoding='utf-8').read()
    new, n_sub = TBL.subn(lambda m: m.group(1) + body + m.group(2), html, count=1)
    if n_sub and new != html:
        io.open(path, 'w', encoding='utf-8', newline='').write(new)
        changed += 1
print('rewrote navigation in %d posts' % changed)
