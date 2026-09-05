# -*- coding: utf-8 -*-
"""Rewrites every WordPress-export post under blog/posts/ as a notebook page.

The exports already break the body into <div class="cell"> blocks, which map
straight onto notebook cells:

  prose            -> a markdown cell
  figure / image   -> an output cell, Out[n], centred
  table            -> an output cell rendered as a pandas dataframe repr
  <pre> with a url -> a markdown cell holding a centred link
  wp oEmbed card   -> a plain link (the hidden blockquote and iframe are dropped)

Run from the repo root:  python tools/convert_posts.py
"""
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, 'blog', 'posts')

FA = '۰۱۲۳۴۵۶۷۸۹'
def fa(n):
    return ''.join(FA[int(c)] if c.isdigit() else c for c in str(n))

TR = str.maketrans('۰۱۲۳۴۵۶۷۸۹', '0123456789')


# ── reading the export ──────────────────────────────────────────────
def parse(src):
    title = re.search(r'class="post-title">(.*?)</h1>', src, re.S)
    if not title:
        title = re.search(r'<title>(.*?)</title>', src, re.S)
    title = re.sub(r'<[^>]+>', '', title.group(1)).strip() if title else ''

    d = re.search(r'class="date">([^<]+)<', src)
    raw = d.group(1).strip().translate(TR) if d else ''
    parts = [p for p in re.split(r'[/-]', raw) if p]
    if len(parts) == 3:
        y, m, day = (parts if len(parts[0]) == 4 else [parts[2], parts[1], parts[0]])
        date = (int(y), int(m), int(day))
    else:
        date = None

    open_rx = re.compile(r'<(?:div|section|main)[^>]*class="[^"]*\bcontent\b[^"]*"[^>]*>')
    o = open_rx.search(src)
    if not o:
        return title, date, ''
    rest = src[o.end():]
    # a couple of exports are truncated and never close the wrapper
    end = re.search(r'</section>|</article>|</body>', rest)
    return title, date, (rest[:end.start()] if end else rest)


def cells_of(body):
    """Cells nest other divs, so the closing tag has to be found by balancing."""
    tok = '<div class="cell">'
    out, i = [], 0
    while True:
        s = body.find(tok, i)
        if s < 0:
            break
        j, depth = s + len(tok), 1
        while depth and j < len(body):
            nd = body.find('<div', j)
            cd = body.find('</div>', j)
            if cd < 0:
                break
            if 0 <= nd < cd:
                depth += 1
                j = nd + 4
            else:
                depth -= 1
                j = cd + 6
                if depth == 0:
                    out.append(body[s + len(tok):cd])
        if depth:                      # truncated export: keep what is there
            out.append(body[s + len(tok):])
        i = j
    if out:
        return out
    # a few posts have no .cell wrappers; split on top-level paragraphs
    return re.split(r'(?<=</p>)\s*(?=<p)', body)


# ── cleaning one cell ───────────────────────────────────────────────
KEEP = {'p', 'a', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'br', 'hr',
        'h2', 'h3', 'h4', 'blockquote', 'code', 'sub', 'sup', 'del', 'figcaption'}

def clean(html):
    html = re.sub(r'<iframe.*?</iframe>', '', html, flags=re.S)
    html = re.sub(r'<script.*?</script>', '', html, flags=re.S)
    html = re.sub(r'<style.*?</style>', '', html, flags=re.S)
    # the hidden oEmbed card leaves a usable link behind
    html = re.sub(r'<blockquote class="wp-embedded-content"[^>]*>(.*?)</blockquote>',
                  r'<p class="embed">\1</p>', html, flags=re.S)

    def tag(m):
        close, name, attrs = m.group(1), m.group(2).lower(), m.group(3)
        if name in ('div', 'figure', 'span', 'section'):
            return ''
        if name not in KEEP:
            return ''
        if close:
            return '</%s>' % name
        if name == 'a':
            href = re.search(r'href="([^"]*)"', attrs)
            if not href:
                return '<a>'
            ext = href.group(1).startswith('http')
            return '<a href="%s"%s>' % (href.group(1),
                                        ' target="_blank" rel="noopener"' if ext else '')
        if name == 'p':
            cls = re.search(r'class="([^"]*)"', attrs)
            c = cls.group(1) if cls else ''
            if 'has-text-align-center' in c:
                return '<p class="ctr">'
            if 'embed' in c:
                return '<p class="embed">'
            return '<p>'
        return '<%s>' % name

    html = re.sub(r'<(/?)(\w+)([^>]*)>', tag, html)
    html = re.sub(r'<p>\s*</p>', '', html)
    html = re.sub(r'(<br>\s*){3,}', '<br><br>', html)
    return html.strip()


def text_of(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html)).strip()


def images_of(html):
    """wp-content/ paths point at an upload folder that was never carried over,
    so those images can never resolve and are dropped rather than shown broken."""
    out = []
    for m in re.finditer(r'<img[^>]*>', html):
        src = re.search(r'src="([^"]+)"', m.group(0))
        alt = re.search(r'alt="([^"]*)"', m.group(0))
        if src and not src.group(1).startswith(('wp-content/', '/wp-content/')):
            out.append((src.group(1), (alt.group(1) if alt else '')))
    return out


def caption_of(html):
    m = re.search(r'<figcaption[^>]*>(.*?)</figcaption>', html, re.S)
    return text_of(m.group(1)) if m else ''


def table_of(html):
    m = re.search(r'<table.*?</table>', html, re.S)
    if not m:
        return None
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', m.group(0), re.S)
    grid = []
    for r in rows:
        cells = []
        for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.S):
            pics = images_of(c)          # some tables compare pictures
            if pics:
                cells.append(''.join('<img src="%s" alt="%s" loading="lazy" class="thumb">'
                                     % (s, esc(a)) for s, a in pics))
            else:
                cells.append(esc(text_of(c)))
        grid.append(cells)
    grid = [g for g in grid if any(g)]
    # a column whose every body cell came out empty (its pictures are gone)
    if len(grid) > 1:
        width = max(len(g) for g in grid)
        grid = [g + [''] * (width - len(g)) for g in grid]
        live = [c for c in range(width) if any(row[c].strip() for row in grid[1:])]
        grid = [[row[c] for c in live] for row in grid]
    return grid


def is_num(s):
    return bool(s) and '<' not in s and all(
        c in '۰۱۲۳۴۵۶۷۸۹0123456789٫,./%- ' for c in s)


# ── emitting ───────────────────────────────────────────────────────
def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def md_cell(inner):
    return ('  <div class="jp-cell">\n'
            '    <div class="jp-collapser"></div>\n'
            '    <div class="jp-md rtl">%s</div>\n'
            '  </div>\n' % inner)


def out_cell(n, inner):
    return ('  <div class="jp-cell">\n'
            '    <div class="jp-collapser"></div>\n'
            '    <div class="jp-inner"><div class="jp-io">\n'
            '      <div class="jp-prompt out">Out[%d]:</div>\n'
            '      <div class="jp-outputs">%s</div>\n'
            '    </div></div>\n'
            '  </div>\n' % (n, inner))


def figure_html(imgs, cap):
    parts = []
    for src, alt in imgs:
        parts.append('<img src="%s" alt="%s" loading="lazy">' % (src, esc(alt)))
    fig = '<figure class="figout">%s%s</figure>' % (
        ''.join(parts),
        ('<figcaption>%s</figcaption>' % esc(cap)) if cap else '')
    return fig


def table_html(grid):
    head, body = grid[0], grid[1:]
    th = ''.join('<th>%s</th>' % c for c in head)
    trs = []
    for i, row in enumerate(body):
        tds = ''.join('<td%s>%s</td>' % (' class="num"' if is_num(c) else '', c)
                      for c in row)
        trs.append('<tr><th class="l mono">%d</th>%s</tr>' % (i, tds))
    return ('<div class="tblout"><table class="dataframe">'
            '<thead><tr><th></th>%s</tr></thead><tbody>%s</tbody></table>'
            '<div class="df-shape code">%d rows × %d columns</div></div>'
            % (th, ''.join(trs), len(body), len(head)))


PAGE = '''<!DOCTYPE html>
<html lang="fa">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} — وحید باقی</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="article">
<link rel="icon" href="/favicon.ico">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Vazirmatn:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/lab.css">
<style>
.meta{{display:flex;gap:9px;align-items:center;flex-wrap:wrap;color:var(--jp-ui-font-color2);
  font-size:12.5px;margin:-.2em 0 1.5em;max-width:none}}
.meta .dot{{width:3px;height:3px;border-radius:50%;background:var(--jp-border2);flex:0 0 3px}}
.meta .tag{{border:1px solid var(--jp-border2);border-radius:2px;padding:0 7px;font-size:11.5px}}
.meta .mono{{direction:ltr;font-family:"JetBrains Mono",Menlo,monospace}}
.mono{{font-family:"JetBrains Mono",Menlo,monospace;font-size:12.5px}}
.figout{{margin:0;display:flex;flex-direction:column;align-items:center;text-align:center}}
.figout img{{max-width:min(100%,720px);height:auto;border:1px solid var(--jp-border1);
  border-radius:2px;display:block;margin:0 auto 6px}}
.figout img:last-of-type{{margin-bottom:0}}
.figout figcaption{{color:var(--jp-ui-font-color2);font-size:12px;padding-top:8px;
  max-width:60ch;text-align:center}}
.tblout{{overflow-x:auto;max-width:100%}}
.jp-md p.ctr{{text-align:center}}
.jp-md p.embed a{{display:inline-block;border:1px solid var(--jp-border2);border-radius:3px;
  padding:8px 13px;text-decoration:none;background:var(--jp-editor-bg)}}
.jp-md p.embed a:hover{{border-color:var(--jp-brand1)}}
</style>
</head>
<body>
<div id="cells" hidden>
{cells}</div>
<script src="/assets/lab.js"></script>
<script>
Lab.chrome({{ active:'post', tab:{{ name:'{slug}.ipynb', href:'{href}' }} }});
Lab.wire();
Lab.kernel(false);
</script>
</body>
</html>
'''


def slugify(pid):
    return 'post_%02d' % pid


def convert(pid, index):
    path = os.path.join(POSTS, '%d.html' % pid)
    src = io.open(path, encoding='utf-8', errors='replace').read()
    title, date, body = parse(src)

    n_out = 0
    parts = []

    # title + meta
    row = index.get(pid)
    meta = ''
    if date:
        meta += '<span class="mono">%s/%s/%s</span>' % (
            fa(date[0]), fa('%02d' % date[1]), fa('%02d' % date[2]))
    if row:
        meta += '<span class="dot"></span>'
        meta += ''.join('<span class="tag">%s</span>' % c for c in row['cats'])
        meta += '<span class="dot"></span><span>%s</span>' % row['topic']
    parts.append(md_cell('\n      <h1>%s</h1>\n      <div class="meta">%s</div>\n    '
                         % (esc(title), meta)))

    first_text = ''
    for raw in cells_of(body):
        if not raw or not raw.strip():
            continue
        grid = table_of(raw)
        if grid and len(grid) > 1:
            n_out += 1
            parts.append(out_cell(n_out, table_html(grid)))
            continue
        imgs = images_of(raw)
        stripped = re.sub(r'<figcaption.*?</figcaption>', '', raw, flags=re.S)
        if imgs and len(text_of(stripped)) < 45:
            n_out += 1
            parts.append(out_cell(n_out, figure_html(imgs, caption_of(raw))))
            continue
        html = clean(raw)
        if not text_of(html) and not imgs:
            continue
        if imgs:                       # prose and a picture in one block
            n_out += 1
            html = re.sub(r'<img[^>]*>', '', html)
            if text_of(html):
                parts.append(md_cell('\n      %s\n    ' % html))
            parts.append(out_cell(n_out, figure_html(imgs, caption_of(raw))))
            continue
        if not first_text:
            first_text = text_of(html)[:180]
        parts.append(md_cell('\n      %s\n    ' % html))

    # prev / next
    ids = sorted(index)
    pos = ids.index(pid)
    nav = []
    if pos > 0:
        nav.append(('prev', index[ids[pos - 1]]))
    if pos < len(ids) - 1:
        nav.append(('next', index[ids[pos + 1]]))
    if nav:
        rows = ''.join(
            '<tr><th class="l mono">%s</th><td><a href="%s">%s</a></td>'
            '<td class="num">%s/%s</td></tr>'
            % (k, r['href'], esc(r['title']), fa(r['y']), fa('%02d' % r['m']))
            for k, r in nav)
        parts.append(
            '  <div class="jp-cell">\n'
            '    <div class="jp-collapser"></div>\n'
            '    <div class="jp-inner">\n'
            '      <div class="jp-io"><div class="jp-prompt">[%d]:</div>\n'
            '        <div class="jp-editor"><pre>nb<span class="o">.</span>'
            '<span class="f">neighbours</span>()</pre></div></div>\n'
            '      <div class="jp-io"><div class="jp-prompt out">Out[%d]:</div>\n'
            '        <div class="jp-outputs"><table class="dataframe"><thead><tr><th></th>'
            '<th>title</th><th>date</th></tr></thead><tbody>%s</tbody></table></div></div>\n'
            '    </div>\n  </div>\n' % (n_out + 1, n_out + 1, rows))

    desc = re.sub(r'"', "'", first_text)[:155]
    return PAGE.format(title=esc(title), desc=esc(desc), cells=''.join(parts),
                       slug=slugify(pid), href='/blog/posts/%d.html' % pid)


def load_index():
    src = io.open(os.path.join(ROOT, 'assets', 'posts.js'), encoding='utf-8').read()
    idx = {}
    for m in re.finditer(
            r'^\[(\d+),"([^"]*)",(\d+),(\d+),(\d+),"([^"]*)",\[([^\]]*)\],"([^"]*)","([^"]*)"\]',
            src, re.M):
        pid = int(m.group(1))
        if int(m.group(1)) > 51:
            continue
        idx[pid] = {'title': m.group(2), 'y': int(m.group(3)), 'm': int(m.group(4)),
                    'cats': [c.strip('"') for c in m.group(7).split(',')],
                    'topic': m.group(8), 'href': m.group(9)}
    return idx


def main():
    index = load_index()
    n = 0
    for pid in sorted(index):
        path = os.path.join(POSTS, '%d.html' % pid)
        if not os.path.exists(path):
            print('  missing', pid)
            continue
        html = convert(pid, index)
        io.open(path, 'w', encoding='utf-8', newline='').write(html)
        n += 1
    print('converted %d posts' % n)


if __name__ == '__main__':
    main()
