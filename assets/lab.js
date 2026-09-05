/* vahidbaghi.ir — shared notebook chrome: activity bar, file browser (which is
   the site navigation), tab bar, toolbar, kernel indicator, cell execution. */
var Lab = (function () {
  var FA = '۰۱۲۳۴۵۶۷۸۹';
  function fa(n) { return String(n).replace(/\d/g, function (d) { return FA[+d] }) }

  var I = {
    folder: '<path d="M2 5.5A1.5 1.5 0 013.5 4h3.2l1.5 1.8h8.3A1.5 1.5 0 0118 7.3v8.2a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5z"/>',
    clock: '<circle cx="10" cy="10" r="7"/><path d="M10 6v4.2l2.8 1.7"/>',
    palette: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/>',
    toc: '<path d="M3 5h3M8 5h9M3 10h3M8 10h9M3 15h3M8 15h9"/>',
    puzzle: '<path d="M8 3h4v2.2a1.8 1.8 0 103.6 0V3H17v4h-1.8a1.8 1.8 0 100 3.6H17V17h-4.4v-1.8a1.8 1.8 0 10-3.6 0V17H5v-4.4h1.8a1.8 1.8 0 100-3.6H5V5h3z"/>',
    menu: '<path d="M3 5.5h14M3 10h14M3 14.5h14"/>',
    save: '<path d="M3.5 3.5h9L16.5 7v9.5h-13z"/><path d="M6 3.5v4.2h6V3.5M6.5 16.5v-4.6h7v4.6"/>',
    plus: '<path d="M10 4v12M4 10h12"/>',
    scissors: '<circle cx="5.5" cy="14.5" r="2"/><circle cx="5.5" cy="5.5" r="2"/><path d="M7 6.6L16 15M7 13.4L16 5"/>',
    copy: '<rect x="7" y="7" width="9" height="9" rx="1.3"/><path d="M13 5.2A1.2 1.2 0 0011.8 4H5.2A1.2 1.2 0 004 5.2v6.6A1.2 1.2 0 005.2 13"/>',
    paste: '<rect x="5" y="4.6" width="10" height="12" rx="1.3"/><path d="M8 4.6V3.4h4v1.2"/>',
    run: '<path d="M6 4l10 6-10 6z"/>',
    stop: '<rect x="5.5" y="5.5" width="9" height="9" rx="1"/>',
    restart: '<path d="M16 10a6 6 0 11-2-4.5"/><path d="M16.5 3v3.2h-3.2"/>',
    ffwd: '<path d="M4 5l5.5 5L4 15z"/><path d="M11 5l5.5 5L11 15z"/>',
    theme: '<circle cx="10" cy="10" r="7"/><path d="M10 3a7 7 0 000 14z" fill="currentColor" stroke="none"/>',
    nbook: '<path d="M5.6 2.2h6.1l3.4 3.4v9.9a1.3 1.3 0 01-1.3 1.3H5.6a1.3 1.3 0 01-1.3-1.3V3.5a1.3 1.3 0 011.3-1.3z" fill="#f37726" stroke="none"/><path d="M6.6 9.4c1.6 2.4 4.9 2.4 6.5 0M6.6 12.4c1.6-2.4 4.9-2.4 6.5 0" stroke="#fff" stroke-width="1.2" fill="none"/>',
    dirsm: '<path d="M2 4.6A1.2 1.2 0 013.2 3.4h2.5l1.2 1.5h6.9a1.2 1.2 0 011.2 1.2v6.3a1.2 1.2 0 01-1.2 1.2H3.2A1.2 1.2 0 012 12.4z" fill="currentColor" stroke="none"/>',
    filesm: '<path d="M5 2h4.5L13 5.5V15a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" fill="currentColor" stroke="none" opacity=".55"/>'
  };
  function svg(n, cls) {
    return '<svg viewBox="0 0 20 20" class="' + (cls || '') + '" aria-hidden="true">' + I[n] + '</svg>';
  }

  /* the site, as a file tree — every entry is a real page */
  var TREE = [
    { t: 'nb', name: 'vahid_baghi.ipynb', href: '/', id: 'home' },
    { t: 'dir', name: 'blog' },
    { t: 'nb', name: 'posts.ipynb', href: '/blog/', id: 'blog', ind: 1 },
    { t: 'dir', name: 'hobby' },
    { t: 'nb', name: 'index.ipynb', href: '/hobby/', id: 'hobby', ind: 1 },
    { t: 'nb', name: 'tehran_metro.ipynb', href: '/hobby/tehran_metro_stations_betweenness_heatmap.html', ind: 1 },
    { t: 'nb', name: 'tehran_schools.ipynb', href: '/hobby/tehran_schools.html', ind: 1 },
    { t: 'nb', name: 'snapp_heatmap.ipynb', href: '/hobby/snapp_s-t_heatmap.html', ind: 1 },
    { t: 'nb', name: 'kalleh_products.ipynb', href: '/hobby/kalleh_snapp_products.html', ind: 1 },
    { t: 'nb', name: 'ganjoor_wordcloud.ipynb', href: '/hobby/ganjoor_wordcloud.html', ind: 1 },
    { t: 'file', name: 'cron_simulator.html', href: '/hobby/cron.html', ind: 1 },
    { t: 'file', name: 'clinic_appointment.html', href: '/hobby/clinic-appointment.html', ind: 1 },
    { t: 'file', name: 'compare_boxes.html', href: '/hobby/compare-boxes.html', ind: 1 }
  ];
  var BASE_TABS = [
    { name: 'vahid_baghi.ipynb', href: '/', id: 'home' },
    { name: 'posts.ipynb', href: '/blog/', id: 'blog' }
  ];

  var CLOSED_KEY = 'vb_closed_tabs';
  function closedTabs() {
    try { return JSON.parse(sessionStorage.getItem(CLOSED_KEY) || '[]') } catch (e) { return [] }
  }
  function closeTab(id) {
    try {
      var c = closedTabs();
      if (c.indexOf(id) < 0) { c.push(id); sessionStorage.setItem(CLOSED_KEY, JSON.stringify(c)) }
    } catch (e) { /* private mode — the tab still closes for this view */ }
  }

  function chrome(o) {
    o = o || {};
    var act = o.active;
    var tabs = BASE_TABS.slice();
    if (o.tab) tabs.push({ name: o.tab.name, href: o.tab.href, id: act, extra: true });
    var closed = closedTabs();
    tabs = tabs.filter(function (t) { return t.id === act || closed.indexOf(t.id) < 0 });

    var bar = '<div class="jp-bar">' +
      '<button class="on" id="jp-files" title="File Browser">' + svg('folder') + '</button>' +
      '<button title="Running Terminals and Kernels">' + svg('clock') + '</button>' +
      '<button title="Commands">' + svg('palette') + '</button>' +
      '<button title="Table of Contents">' + svg('toc') + '</button>' +
      '<button title="Extension Manager">' + svg('puzzle') + '</button>' +
      '<div class="gap"></div>' +
      '<button id="jp-theme" title="تم روشن یا تاریک">' + svg('theme') + '</button>' +
      '</div>';

    var tree = TREE.map(function (n) {
      if (n.t === 'dir') return '<div class="dir">' + svg('dirsm', 'ic-dir') + n.name + '/</div>';
      var ic = n.t === 'nb' ? svg('nbook') : svg('filesm', 'ic-file');
      return '<a href="' + n.href + '" class="' + (n.ind ? 'ind ' : '') +
        (n.id && n.id === act ? 'on' : '') + '">' + ic + n.name + '</a>';
    }).join('');

    var side = '<div class="jp-side" id="jp-side">' +
      '<h3>File Browser<button id="jp-side-x" aria-label="بستن">×</button></h3>' +
      '<div class="jp-tree">' + tree + '</div>' +
      '<div class="foot">vahidbaghi.ir</div></div><div class="jp-scrim" id="jp-scrim"></div>';

    var tabbar = tabs.map(function (t) {
      return '<a class="jp-tab' + (t.id === act ? ' on' : '') + '" href="' + t.href +
        '" data-id="' + t.id + '">' + svg('nbook') + '<span class="nm">' + t.name + '</span>' +
        '<span class="x" role="button" tabindex="0" aria-label="بستن تب">×</span></a>';
    }).join('');

    var tb = '<div class="jp-toolbar">' +
      '<button class="jp-tb" id="jp-menu" title="فهرست فایل‌ها">' + svg('menu') + '</button>' +
      '<button class="jp-tb opt" title="ذخیره">' + svg('save') + '</button>' +
      '<button class="jp-tb opt" title="افزودن سلول">' + svg('plus') + '</button>' +
      '<div class="jp-sep opt"></div>' +
      '<button class="jp-tb opt" title="Cut">' + svg('scissors') + '</button>' +
      '<button class="jp-tb opt" title="Copy">' + svg('copy') + '</button>' +
      '<button class="jp-tb opt" title="Paste">' + svg('paste') + '</button>' +
      '<div class="jp-sep opt"></div>' +
      '<button class="jp-tb fill" id="jp-run" title="اجرای سلول">' + svg('run') + '</button>' +
      '<button class="jp-tb fill opt" title="توقف کرنل">' + svg('stop') + '</button>' +
      '<button class="jp-tb opt" title="ری‌استارت کرنل">' + svg('restart') + '</button>' +
      '<button class="jp-tb fill" id="jp-runall" title="ری‌استارت و اجرای همه">' + svg('ffwd') + '</button>' +
      '<div class="jp-sep opt"></div>' +
      '<select class="jp-ctype"><option>Code</option><option>Markdown</option><option>Raw</option></select>' +
      '<div class="sp"></div>' +
      '<button class="jp-tb" id="jp-theme-sm" title="تم روشن یا تاریک">' + svg('theme') + '</button>' +
      '<div class="jp-kernel busy" id="jp-kernel"><span>Python 3 (ipykernel)</span>' +
      '<span class="jp-kdot"></span></div></div>';

    document.body.insertAdjacentHTML('afterbegin',
      '<div class="jp-app">' + bar + side +
      '<div class="jp-main"><div class="jp-tabs">' + tabbar + '</div>' + tb +
      '<div class="jp-nb" id="jp-nb"></div></div></div>');

    var cells = document.getElementById('cells');
    document.getElementById('jp-nb').appendChild(cells);
    cells.removeAttribute('hidden');

    /* theme */
    function toggleTheme() {
      var r = document.documentElement;
      var cur = r.getAttribute('data-theme') ||
        (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
      var next = cur === 'dark' ? 'light' : 'dark';
      r.setAttribute('data-theme', next);
      try { localStorage.setItem('vb_theme', next) } catch (e) {}
    }
    document.getElementById('jp-theme').addEventListener('click', toggleTheme);
    document.getElementById('jp-theme-sm').addEventListener('click', toggleTheme);

    /* file browser: a pane on desktop, a drawer on phones */
    var side = document.getElementById('jp-side'),
        scrim = document.getElementById('jp-scrim');
    function openSide(on) {
      if (matchMedia('(max-width:900px)').matches) {
        side.classList.toggle('open', on); scrim.classList.toggle('on', on);
      } else {
        side.classList.toggle('hide', !on);
        document.getElementById('jp-files').classList.toggle('on', on);
      }
    }
    document.getElementById('jp-files').addEventListener('click', function () {
      openSide(side.classList.contains('hide'));
    });
    document.getElementById('jp-menu').addEventListener('click', function () {
      openSide(!side.classList.contains('open'));
    });
    document.getElementById('jp-side-x').addEventListener('click', function () { openSide(false) });
    scrim.addEventListener('click', function () { openSide(false) });

    /* closing a tab actually closes it */
    [].forEach.call(document.querySelectorAll('.jp-tab .x'), function (x) {
      function shut(e) {
        e.preventDefault(); e.stopPropagation();
        var tab = x.closest('.jp-tab'), id = tab.dataset.id;
        closeTab(id);
        if (tab.classList.contains('on')) {
          var next = document.querySelector('.jp-tab:not(.on)');
          location.href = next ? next.getAttribute('href') : '/';
        } else tab.remove();
      }
      x.addEventListener('click', shut);
      x.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') shut(e) });
    });

    /* selecting a cell, the way the real thing does */
    document.getElementById('jp-nb').addEventListener('click', function (e) {
      var c = e.target.closest('.jp-cell'); if (!c) return;
      [].forEach.call(document.querySelectorAll('.jp-cell.sel'), function (x) { x.classList.remove('sel') });
      c.classList.add('sel');
    });
  }

  function kernel(busy) {
    var k = document.getElementById('jp-kernel');
    if (k) k.className = 'jp-kernel' + (busy ? ' busy' : '');
  }

  var COUNT = 0, onRun = {};
  function clear(c) {
    [].forEach.call(c.querySelectorAll('.jp-prompt'), function (p) {
      p.innerHTML = p.classList.contains('out') ? '' : '[&nbsp;]:';
    });
    [].forEach.call(c.querySelectorAll('.jp-io.res'), function (o) { o.hidden = true });
  }
  function mark(c, n) {
    var quiet = c.hasAttribute('data-noprompt');
    [].forEach.call(c.querySelectorAll('.jp-prompt'), function (p) {
      /* a cell that only displays returns None, and the real thing prints no
         Out[n] beside it */
      p.innerHTML = p.classList.contains('out')
        ? (quiet ? '' : 'Out[' + n + ']:')
        : '[' + n + ']:';
    });
    [].forEach.call(c.querySelectorAll('.jp-io.res'), function (o) { o.hidden = false });
    var k = c.getAttribute('data-exec');
    if (k && onRun[k]) onRun[k]();
  }
  function runCell(c) {
    if (!c || !c.hasAttribute('data-exec')) return;
    kernel(true);
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    setTimeout(function () { mark(c, ++COUNT); kernel(false) }, reduce ? 0 : 240);
  }
  function runAll(done) {
    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    var cells = [].slice.call(document.querySelectorAll('.jp-cell[data-exec]'));
    COUNT = 0;
    cells.forEach(clear);
    kernel(true);
    var i = 0;
    (function step() {
      if (i >= cells.length) { kernel(false); if (done) done(); return }
      var c = cells[i++];
      /* a cell left for the reader to run stays unexecuted, prompt still [ ] */
      if (!c.hasAttribute('data-manual')) mark(c, ++COUNT);
      setTimeout(step, reduce ? 0 : Math.max(28, 180 - i * 4));
    })();
  }
  function selected() { return document.querySelector('.jp-cell.sel') }

  function wire(handlers) {
    onRun = handlers || {};
    var ra = document.getElementById('jp-runall');
    if (ra) ra.addEventListener('click', function () { runAll() });
    var r = document.getElementById('jp-run');
    if (r) r.addEventListener('click', function () {
      var c = selected();
      if (c && c.hasAttribute('data-exec')) runCell(c); else runAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey)) {
        var c = selected();
        if (c && c.hasAttribute('data-exec')) { e.preventDefault(); runCell(c) }
      }
    });
    [].forEach.call(document.querySelectorAll('.jp-cell[data-exec]'), function (c) {
      var b = document.createElement('button');
      b.className = 'jp-cellrun';
      b.title = 'اجرای این سلول (Shift+Enter)';
      b.innerHTML = svg('run');
      b.addEventListener('click', function (e) { e.stopPropagation(); runCell(c) });
      c.appendChild(b);
    });
  }

  return { chrome: chrome, runAll: runAll, runCell: runCell, kernel: kernel,
           wire: wire, fa: fa, svg: svg };
})();

/* apply the remembered theme before first paint where possible */
(function () {
  try {
    var t = localStorage.getItem('vb_theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
