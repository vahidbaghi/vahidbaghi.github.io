/* vahidbaghi.ir — a comment box on every post and interactive page.
   Comments are not stored or shown anywhere: each one goes, like the home
   page's anonymous message, through the same worker straight to me, with the
   page's title and address on top.
   On a notebook page (lab.js) it is the last cell; on any other page it is a
   small floating button that opens a panel (inside a shadow root, so the
   page's own CSS and the panel's never touch). */
(function () {
  if (window.__vbComment) return;
  window.__vbComment = 1;
  /* a page shown inside a post's iframe: the post itself has the box */
  if (window.top !== window.self) return;

  var ENDPOINT = 'https://hello-world-wild-field-dc82.vbaghi.workers.dev/?message=';
  var MAX = 2000;
  var FAIL = 'نرسید. دوباره امتحان کن، یا به vbaghi@gmail.com ایمیل بزن.';

  function pageTitle() {
    var og = document.querySelector('meta[property="og:title"]');
    var t = og && og.getAttribute('content');
    if (!t) { var h = document.querySelector('h1'); t = h && h.textContent }
    if (!t) t = document.title;
    t = (t || '').replace(/\s*[—|]\s*وحید باقی\s*$/, '').replace(/\s+/g, ' ').trim();
    return t || decodeURIComponent(location.pathname);
  }
  function pageUrl() { return location.origin + location.pathname }

  function post(text) {
    var msg = '💬 نظر روی «' + pageTitle() + '»\n' + pageUrl() + '\n\n' + text;
    /* a filtered connection can hang rather than fail: give up after 15 s so
       the reader sees the failure line and the email address */
    var ctl = window.AbortController ? new AbortController() : null;
    var t = ctl && setTimeout(function () { ctl.abort() }, 15000);
    return fetch(ENDPOINT + encodeURIComponent(msg), ctl ? { signal: ctl.signal } : undefined)
      .then(function (r) { return r.ok }, function () { return false })
      .then(function (ok) { clearTimeout(t); return ok });
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fa(n) { return String(n).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[+d] }) }

  /* ── 1. notebook pages: one more cell at the end ─────────────────── */
  function notebook(cells) {
    var css = document.createElement('style');
    css.textContent =
      '.vbc .jp-editor .live{display:block;width:100%;margin:2px 0;padding:2px 4px;border:0;border-radius:2px;' +
      'outline:none;resize:none;overflow:hidden;background:transparent;color:var(--cm-str);' +
      'font:inherit;line-height:inherit;white-space:pre-wrap;overflow-wrap:anywhere;' +
      'font-family:Vazirmatn,system-ui,sans-serif;min-height:1.6em}' +
      '.vbc .jp-editor .live::placeholder{color:var(--jp-ui-font-color3)}' +
      '.vbc .jp-editor .live:placeholder-shown{direction:rtl}' +
      '.vbc .jp-editor .live:focus{background:var(--jp-layout1);box-shadow:0 0 0 3px rgba(33,150,243,.14)}' +
      '.vbc .jp-editor pre{white-space:pre-wrap}' +
      '@media (max-width:700px){.vbc .jp-editor .live{font-size:16px;line-height:1.5}}' +
      '.vbc-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;direction:rtl;' +
      'font-family:Vazirmatn,system-ui,sans-serif;font-size:13.5px;margin:2px 0 4px}' +
      '.vbc-send{font:inherit;font-weight:600;font-size:13px;cursor:pointer;border-radius:3px;' +
      'padding:6px 16px;border:1px solid var(--jp-brand1);background:var(--jp-brand1);color:#fff;' +
      'transition:opacity .14s}' +
      '.vbc-send:hover{opacity:.88}.vbc-send:disabled{opacity:.55;cursor:default}' +
      '.vbc-note{color:var(--jp-ui-font-color2);font-size:12.5px}' +
      '@media (hover:none){.vbc-out.vbc-note.hint{display:none}}' +
      '.vbc-cnt{color:var(--jp-ui-font-color3);font-size:12px;direction:ltr}' +
      '.vbc-cnt.over{color:var(--jp-warn)}' +
      '.vbc-ok{color:#2ca02c;font-weight:600}' +
      '.vbc-err{color:var(--jp-warn)}';
    document.head.appendChild(css);

    /* the cell number it gets once it runs: one after the last one shown */
    var last = 0;
    [].forEach.call(document.querySelectorAll('.jp-prompt:not(.out)'), function (p) {
      var m = /\[(\d+)\]/.exec(p.textContent); if (m) last = Math.max(last, +m[1]);
    });

    var head = document.createElement('div');
    head.className = 'jp-cell';
    head.innerHTML =
      '<div class="jp-collapser"></div>' +
      '<div class="jp-md rtl"><p><strong>نظرت درباره‌ی این پست چیه؟</strong> ' +
      'جایی منتشر نمی‌شه؛ ناشناس و مستقیم به خودم می‌رسه.</p></div>';
    cells.appendChild(head);

    var cell = document.createElement('div');
    cell.className = 'jp-cell vbc';
    cell.setAttribute('data-manual', '');
    cell.innerHTML =
      '<div class="jp-collapser"></div>' +
      '<div class="jp-inner">' +
        '<div class="jp-io"><div class="jp-prompt">[&nbsp;]:</div>' +
          '<div class="jp-editor"><pre>' +
          'nb<span class="o">.</span><span class="f">comment</span>(<span class="s">"""</span>' +
          '<textarea class="live" rows="2" dir="auto" spellcheck="false" maxlength="' + MAX + '" ' +
          'aria-label="متن نظر" placeholder="نظرت درباره‌ی این پست…"></textarea>' +
          '<span class="s">"""</span>)</pre></div></div>' +
        '<div class="jp-io"><div class="jp-prompt out"></div>' +
          '<div class="jp-outputs"><div class="vbc-row">' +
            '<button type="button" class="vbc-send">ارسال نظر</button>' +
            '<span class="vbc-out vbc-note hint">یا Shift+Enter</span>' +
            '<span class="vbc-cnt" hidden></span>' +
          '</div></div></div>' +
      '</div>';
    cells.appendChild(cell);

    var live = cell.querySelector('.live'), btn = cell.querySelector('.vbc-send'),
        out = cell.querySelector('.vbc-out'), cnt = cell.querySelector('.vbc-cnt'),
        inP = cell.querySelector('.jp-prompt:not(.out)'), outP = cell.querySelector('.jp-prompt.out');

    var run = document.createElement('button');
    run.className = 'jp-cellrun';
    run.title = 'ارسال نظر (Shift+Enter)';
    run.innerHTML = window.Lab && Lab.svg ? Lab.svg('run') : '▶';
    cell.appendChild(run);

    var sending = false;
    function send() {
      if (sending) return;
      var text = live.value.trim();
      if (!text) {
        out.className = 'vbc-out vbc-err';
        out.textContent = '! اول نظرت رو بنویس.';
        live.focus(); return;
      }
      /* the text can't change under a send in flight, so clearing it after
         never drops anything typed in the meantime */
      sending = true; btn.disabled = true; live.readOnly = true;
      inP.innerHTML = '[*]:';
      out.className = 'vbc-out vbc-note';
      out.textContent = 'در حال ارسال…';
      if (window.Lab) Lab.kernel(true);
      post(text).then(function (ok) {
        sending = false; btn.disabled = false; live.readOnly = false;
        if (window.Lab) Lab.kernel(false);
        if (ok) {
          last += 1;
          inP.innerHTML = '[' + last + ']:';
          outP.innerHTML = 'Out[' + last + ']:';
          out.className = 'vbc-out vbc-ok';
          out.textContent = '✓ نظرت رسید، ممنون.';
          live.value = ''; grow(); count();
        } else {
          inP.innerHTML = '[&nbsp;]:';
          out.className = 'vbc-out vbc-err';
          out.textContent = '! ' + FAIL;
        }
      });
    }
    function grow() { live.style.height = 'auto'; live.style.height = live.scrollHeight + 'px' }
    function count() {
      var n = live.value.length;
      cnt.hidden = n < MAX * 0.75;
      cnt.textContent = fa(n) + ' / ' + fa(MAX);
      cnt.classList.toggle('over', n >= MAX);
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); send() });
    run.addEventListener('click', function (e) { e.stopPropagation(); send() });
    /* the toolbar's run button, with this cell selected, sends too (lab.js
       would otherwise run the whole notebook) */
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('#jp-run') && cell.classList.contains('sel')) {
        e.stopPropagation(); e.preventDefault(); send();
      }
    }, true);
    live.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey || e.metaKey)) {
        e.preventDefault(); e.stopPropagation(); send();
      }
    });
    live.addEventListener('input', function () {
      grow(); count();
      if (out.classList.contains('vbc-err') || out.classList.contains('vbc-ok')) {
        out.className = 'vbc-out vbc-note hint'; out.textContent = 'یا Shift+Enter';
      }
    });
    live.addEventListener('focus', function () {
      [].forEach.call(document.querySelectorAll('.jp-cell.sel'), function (x) { x.classList.remove('sel') });
      cell.classList.add('sel');
    });
    addEventListener('resize', grow);
  }

  /* ── 2. every other page: a floating button and a panel ─────────── */
  function floating() {
    if (!document.querySelector('link[href*="Vazirmatn"]')) {
      var f = document.createElement('link');
      f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600&display=swap';
      document.head.appendChild(f);
    }
    var host = document.createElement('div');
    host.id = 'vb-comment';
    /* the page's own CSS can't reach in, and inline position keeps the host
       itself out of the page's layout */
    /* above maps and page content, below the pages' own dialogs (z-index 1000) */
    host.style.cssText = 'position:fixed;inset:auto;z-index:999;';
    document.body.appendChild(host);
    var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

    root.innerHTML =
      '<style>' +
      ':host{all:initial}' +
      '.w{--bg:#ffffff;--fg:rgba(0,0,0,.87);--fg2:rgba(0,0,0,.56);--fg3:rgba(0,0,0,.40);' +
        '--bd:#e0e0e0;--field:#f7f7f7;--brand:#2196f3;--ok:#2a8f2a;--warn:#c27a00;' +
        '--shadow:0 6px 28px rgba(0,0,0,.16),0 1px 4px rgba(0,0,0,.10);--scrim:rgba(0,0,0,.32);' +
        'font-family:Vazirmatn,Tahoma,system-ui,sans-serif;font-size:14px;line-height:1.6;color:var(--fg);direction:rtl}' +
      '.w.dark{--bg:#212121;--fg:rgba(255,255,255,.88);--fg2:rgba(255,255,255,.60);--fg3:rgba(255,255,255,.40);' +
        '--bd:#464646;--field:#2a2a2a;--brand:#42a5f5;--ok:#5ec25e;--warn:#f0b429;' +
        '--shadow:0 6px 28px rgba(0,0,0,.55),0 1px 4px rgba(0,0,0,.4);--scrim:rgba(0,0,0,.55)}' +
      '*{box-sizing:border-box}' +
      '.fab{position:fixed;left:16px;bottom:calc(16px + var(--lift,0px));display:flex;align-items:center;gap:7px;cursor:pointer;' +
        'font:600 13.5px/1 Vazirmatn,Tahoma,system-ui,sans-serif;color:var(--fg);background:var(--bg);' +
        'border:1px solid var(--bd);border-radius:999px;padding:10px 15px 10px 14px;box-shadow:var(--shadow);' +
        'transition:transform .14s,border-color .14s}' +
      '.fab:hover{border-color:var(--brand);transform:translateY(-1px)}' +
      '.fab svg{width:17px;height:17px;fill:none;stroke:var(--brand);stroke-width:1.7;stroke-linejoin:round}' +
      '.fab[hidden]{display:none}' +
      '.scrim{position:fixed;inset:0;background:var(--scrim);opacity:0;pointer-events:none;transition:opacity .18s}' +
      '.p{position:fixed;left:16px;bottom:calc(16px + var(--lift,0px));width:min(380px,calc(100vw - 32px));background:var(--bg);' +
        'border:1px solid var(--bd);border-radius:10px;box-shadow:var(--shadow);padding:16px 16px 14px;' +
        'opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .18s,transform .18s}' +
      '.w.open .p{opacity:1;transform:none;pointer-events:auto}' +
      '.hd{display:flex;align-items:flex-start;gap:10px;margin:0 0 4px}' +
      '.ttl{flex:1;font-weight:600;font-size:15px;margin:0}' +
      '.ttl bdi{unicode-bidi:isolate}' +
      '.x{flex:0 0 auto;width:30px;height:30px;margin:-5px -6px 0 0;border:0;border-radius:6px;background:transparent;' +
        'color:var(--fg2);font:22px/1 system-ui,sans-serif;cursor:pointer}' +
      '.x:hover{background:var(--field);color:var(--fg)}' +
      '.note{margin:0 0 12px;color:var(--fg2);font-size:12.5px}' +
      'textarea{display:block;width:100%;min-height:110px;max-height:45vh;resize:vertical;padding:10px 11px;' +
        'border:1px solid var(--bd);border-radius:7px;background:var(--field);color:var(--fg);' +
        'font:15px/1.65 Vazirmatn,Tahoma,system-ui,sans-serif;outline:none}' +
      'textarea:placeholder-shown{direction:rtl}' +
      'textarea::placeholder{color:var(--fg3)}' +
      'textarea:focus{border-color:var(--brand);box-shadow:0 0 0 3px rgba(33,150,243,.16)}' +
      '.ft{display:flex;align-items:center;gap:10px;margin-top:12px;flex-wrap:wrap}' +
      '.send{font:600 13.5px/1 Vazirmatn,Tahoma,system-ui,sans-serif;cursor:pointer;border-radius:7px;' +
        'padding:10px 20px;border:1px solid var(--brand);background:var(--brand);color:#fff}' +
      '.send:hover{opacity:.9}.send:disabled{opacity:.55;cursor:default}' +
      '.msg{flex:1;min-width:0;font-size:13px;color:var(--fg2)}' +
      '.msg.ok{color:var(--ok);font-weight:600}.msg.err{color:var(--warn)}' +
      '.cnt{font-size:12px;color:var(--fg3);direction:ltr}.cnt.over{color:var(--warn)}' +
      '@media (max-width:560px){' +
        '.w.open .scrim{opacity:1;pointer-events:auto}' +
        '.p{left:0;right:0;bottom:var(--kb,0px);width:auto;border-radius:14px 14px 0 0;border-bottom:0;' +
          'padding:16px 16px calc(16px + env(safe-area-inset-bottom))}' +
        'textarea{font-size:16px}' +
        '.fab{left:12px;bottom:calc(12px + var(--lift,0px))}' +
      '}' +
      '@media (prefers-reduced-motion:reduce){.p,.scrim,.fab{transition:none}}' +
      '</style>' +
      '<div class="w">' +
        '<button class="fab" type="button" aria-haspopup="dialog">' +
          '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4.5h12a1.5 1.5 0 011.5 1.5v7a1.5 1.5 0 01-1.5 1.5H9l-3.6 2.8v-2.8H4A1.5 1.5 0 012.5 13V6A1.5 1.5 0 014 4.5z"/></svg>' +
          '<span>نظر</span></button>' +
        '<div class="scrim"></div>' +
        '<div class="p" role="dialog" aria-modal="false" aria-label="نظر درباره‌ی این صفحه" hidden>' +
          '<div class="hd"><p class="ttl">نظرت درباره‌ی «<bdi></bdi>» چیه؟</p>' +
            '<button class="x" type="button" aria-label="بستن">×</button></div>' +
          '<p class="note">جایی منتشر نمی‌شه؛ ناشناس و مستقیم به خودم می‌رسه.</p>' +
          '<textarea dir="auto" maxlength="' + MAX + '" aria-label="متن نظر" placeholder="بنویس…"></textarea>' +
          '<div class="ft"><button class="send" type="button">ارسال</button>' +
            '<span class="msg"></span><span class="cnt" hidden></span></div>' +
        '</div>' +
      '</div>';

    var w = root.querySelector('.w'), fab = root.querySelector('.fab'), p = root.querySelector('.p'),
        scrim = root.querySelector('.scrim'), ta = root.querySelector('textarea'),
        btn = root.querySelector('.send'), msg = root.querySelector('.msg'), cnt = root.querySelector('.cnt');
    root.querySelector('bdi').textContent = pageTitle();

    /* the panel matches the page it sits on: the site's data-theme when the
       page has one, else how dark the page's own background really is
       (pages with their own dark switch, maps that are always light) */
    var mq = matchMedia('(prefers-color-scheme:dark)');
    function bgDark() {
      var els = [document.body, document.documentElement];
      for (var i = 0; i < els.length; i++) {
        var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(getComputedStyle(els[i]).backgroundColor);
        if (m && (m[4] === undefined || +m[4] > .5))
          return (0.2126 * m[1] + 0.7152 * m[2] + 0.0722 * m[3]) < 110;
      }
      return false;
    }
    function theme() {
      var t = document.documentElement.getAttribute('data-theme');
      w.classList.toggle('dark', t ? t === 'dark' : bgDark());
    }
    /* a page's own switch may animate its background: look again once it settles */
    function later() { theme(); setTimeout(theme, 400) }
    theme();
    if (mq.addEventListener) mq.addEventListener('change', later);
    if (window.MutationObserver) {
      var mo = new MutationObserver(later), opt = { attributes: true, attributeFilter: ['data-theme', 'class', 'style', 'data-bs-theme'] };
      mo.observe(document.documentElement, opt);
      mo.observe(document.body, opt);
    }
    addEventListener('load', theme);

    /* on a map, keep clear of the controls in its bottom-left corner, and of
       the schools maps' help panel, which sits at the bottom on a phone */
    function lift() {
      var h = 0, c = document.querySelector('.leaflet-bottom.leaflet-left');
      var r = c && c.getBoundingClientRect();
      if (r && r.height > 0) h = Math.round(r.height) + 4;
      var fp = document.querySelector('.fh-panel:not(.closed)');
      r = fp && fp.getBoundingClientRect();
      if (r && r.height > 0 && r.left < 120 && r.bottom > innerHeight - 70)
        h = Math.max(h, Math.round(innerHeight - r.top) - 4);
      w.style.setProperty('--lift', h + 'px');
    }
    lift();
    addEventListener('load', lift);
    addEventListener('resize', lift);
    var fhp = document.querySelector('.fh-panel');
    if (fhp && window.MutationObserver)
      new MutationObserver(function () { lift(); setTimeout(lift, 300) })
        .observe(fhp, { attributes: true, attributeFilter: ['class'] });

    /* a phone's keyboard covers the bottom of the layout viewport: keep the
       sheet, and its send button, above it */
    var vv = window.visualViewport;
    function kb() {
      var k = vv ? Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop)) : 0;
      w.style.setProperty('--kb', k + 'px');
    }
    if (vv) { vv.addEventListener('resize', kb); vv.addEventListener('scroll', kb) }

    var timer = null;
    function isOpen() { return w.classList.contains('open') }
    function open() {
      clearTimeout(timer);
      p.hidden = false;
      fab.hidden = true;
      /* one frame for the panel to exist before it fades in */
      requestAnimationFrame(function () { w.classList.add('open'); ta.focus() });
    }
    function close() {
      if (!isOpen()) return;
      /* focus goes back to the button only if it was in the panel; an Esc
         typed into the page leaves the page's focus where it is */
      var inside = !!(root.activeElement && root.activeElement !== fab);
      w.classList.remove('open');
      fab.hidden = false;
      timer = setTimeout(function () { p.hidden = true }, 200);
      if (inside) fab.focus();
    }
    fab.addEventListener('click', open);
    root.querySelector('.x').addEventListener('click', close);
    scrim.addEventListener('click', close);
    /* Esc closes it wherever the focus has gone */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close();
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); close() }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send() }
      /* the page's own shortcuts must not fire while typing here */
      e.stopPropagation();
    });
    ['keyup', 'keypress', 'wheel', 'touchmove'].forEach(function (k) {
      p.addEventListener(k, function (e) { e.stopPropagation() });
    });

    function count() {
      var n = ta.value.length;
      cnt.hidden = n < MAX * 0.75;
      cnt.textContent = fa(n) + ' / ' + fa(MAX);
      cnt.classList.toggle('over', n >= MAX);
    }
    ta.addEventListener('input', function () {
      count();
      if (msg.className !== 'msg') { msg.className = 'msg'; msg.textContent = '' }
    });

    var sending = false;
    function send() {
      if (sending) return;
      var text = ta.value.trim();
      if (!text) { msg.className = 'msg err'; msg.textContent = 'اول نظرت رو بنویس.'; ta.focus(); return }
      sending = true; btn.disabled = true; ta.readOnly = true;
      msg.className = 'msg'; msg.textContent = 'در حال ارسال…';
      post(text).then(function (ok) {
        sending = false; btn.disabled = false; ta.readOnly = false;
        /* the disabled button dropped the focus; on a phone that would
           bring the keyboard back up, so only with a mouse */
        if (isOpen() && matchMedia('(hover:hover)').matches) ta.focus();
        if (ok) {
          ta.value = ''; count();
          msg.className = 'msg ok'; msg.textContent = '✓ رسید، ممنون.';
        } else {
          msg.className = 'msg err'; msg.textContent = FAIL;
        }
      });
    }
    btn.addEventListener('click', send);
  }

  function boot() {
    var cells = document.getElementById('cells');
    if (cells && document.getElementById('jp-nb')) notebook(cells);
    else if (document.body) floating();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
