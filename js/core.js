/* Amber's Dream: engine. Router, page transitions, intro, scroll effects. */
(function () {
  var AD = window.AD;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  AD.$ = $; AD.$$ = $$; AD.reduce = reduce;
  AD.clamp = function (v, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.min(b, Math.max(a, v)); };
  AD.ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  AD.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- storage that never throws ---------- */
  function store(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; }
  }

  /* ---------- ready gate (hero waits for the intro) ---------- */
  var ready = false, readyQ = [];
  AD.whenReady = function (fn) { if (ready) fn(); else readyQ.push(fn); };
  function setReady() {
    if (ready) return;
    ready = true;
    document.body.classList.add('ready');
    readyQ.splice(0).forEach(function (f) { f(); });
  }

  /* ---------- scroll loop ---------- */
  var scrollFns = [];
  AD.onScroll = function (fn) { scrollFns.push(fn); fn(); };
  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY || 0;
    document.documentElement.style.setProperty('--sy', y);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var bar = $('#progress');
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? AD.clamp(y / max) : 0) + ')';
    var nav = $('#nav');
    if (nav) nav.classList.toggle('solid', y > 30);
    for (var i = 0; i < scrollFns.length; i++) scrollFns[i](y);
  }
  function requestFrame() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);

  /* ---------- nav, menu, footer ---------- */
  function renderChrome() {
    $('#nav').innerHTML =
      '<div class="wrap nav-in">' +
      '<a class="brand" href="#/" aria-label="Amber\'s Dream, home">Amber\'s Dream</a>' +
      '<nav class="nav-links" aria-label="Main">' +
      AD.nav.map(function (n) { return '<a href="#' + n.path + '" data-path="' + n.path + '">' + n.label + '</a>'; }).join('') +
      '<a class="btn btn-amber" href="#/enter" data-path="/enter" data-mag>Enter for $10</a>' +
      '</nav>' +
      '<button class="burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><i></i><i></i></button>' +
      '</div>';

    $('#menu').innerHTML = AD.menu.map(function (n) { return '<a href="#' + n.path + '" data-path="' + n.path + '">' + n.label + '</a>'; }).join('');

    var f = AD.footerHTML();
    $('#footer').innerHTML = f;
    fixLinks();

    $('#burger').addEventListener('click', function () { toggleMenu(); });
    $('#menu').addEventListener('click', function (e) { if (e.target.closest('a')) toggleMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });
  }
  function toggleMenu(force) {
    var b = $('#burger'), m = $('#menu');
    var open = force === undefined ? !m.classList.contains('open') : force;
    m.classList.toggle('open', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  function setCurrent(path) {
    $$('#nav a[data-path], #menu a[data-path], #footer a[data-path]').forEach(function (a) {
      if (a.getAttribute('data-path') === path) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* ---------- routes ---------- */
  var routes = {};
  AD.route = function (path, def) { routes[path] = def; };
  function pathFromHash(h) {
    h = String(h || '').replace(/^#/, '').split('?')[0].replace(/^\/+/, '').replace(/\/+$/, '');
    var path = (!h || h === 'home') ? '/' : '/' + h;
    return (AD.alias && AD.alias[path]) || path;
  }
  function getPath() { return pathFromHash(location.hash); }
  AD.hrefFor = function (path) { return '#' + (path === '/' ? 'home' : path.replace(/^\//, '')); };
  function fixLinks() {
    $$('a[href^="#/"]').forEach(function (a) { a.setAttribute('href', AD.hrefFor(pathFromHash(a.getAttribute('href')))); });
  }
  var current = null, busy = false;

  function show(path) {
    var def = routes[path] || routes['*'];
    current = path;
    scrollFns = [];
    $('#main').innerHTML = def.render();
    document.title = (def.title ? def.title + ' | ' : '') + "Amber's Dream" + (def.title ? '' : ' | Affordable screenplay contest');
    setCurrent(path);
    window.scrollTo(0, 0);
    fixLinks();
    initPage(def);
    try { $('#main').focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    requestFrame();
  }

  function navigate() {
    var path = getPath();
    if (path === current || busy) return;
    if (reduce || current === null) { show(path); return; }
    busy = true;
    var def = routes[path] || routes['*'];
    var c = $('#curtain');
    $('span', c).textContent = def.word || '';
    c.className = 'cover';
    setTimeout(function () {
      show(path);
      c.className = 'leave';
      setTimeout(function () {
        c.className = '';
        busy = false;
        if (getPath() !== current) navigate();
      }, 650);
    }, 560);
  }
  window.addEventListener('hashchange', navigate);

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    var p = pathFromHash(a.getAttribute('href'));
    if (p === current && !busy) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }
  });

  /* ---------- per-page setup ---------- */
  function split(el) {
    var txt = el.textContent.trim();
    var i = 0;
    var d = parseFloat(el.getAttribute('data-d') || '0');
    el.style.setProperty('--d', d + 's');
    el.innerHTML = '<span class="sr">' + AD.esc(txt) + '</span>' +
      txt.split(' ').map(function (word) {
        return '<span class="w" aria-hidden="true">' + Array.prototype.map.call(word, function (ch) {
          return '<span class="c" style="--i:' + (i++) + '">' + AD.esc(ch) + '</span>';
        }).join('') + '</span>';
      }).join(' ');
  }

  function countUp(el) {
    var to = parseFloat(el.getAttribute('data-to')), pre = el.getAttribute('data-prefix') || '', t0 = null, dur = 1500;
    if (reduce) { el.textContent = pre + to.toLocaleString('en-US'); return; }
    function step(t) {
      if (!t0) t0 = t;
      var k = AD.clamp((t - t0) / dur);
      el.textContent = pre + Math.round(AD.ease(k) * to).toLocaleString('en-US');
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initPage(def) {
    $$('[data-split]').forEach(split);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        if (en.target.hasAttribute('data-count')) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    AD.whenReady(function () {
      $$('[data-reveal], [data-split], [data-bars], .step, [data-count], .final').forEach(function (el) { io.observe(el); });
    });

    /* hero spotlight */
    var hero = $('.hero');
    if (hero && !reduce) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }

    /* manuscript scroll sequence */
    initManuscript();

    /* timeline fill */
    var tl = $('.tline');
    if (tl) {
      AD.onScroll(function () {
        var r = tl.getBoundingClientRect();
        var p = AD.clamp((window.innerHeight * 0.62 - r.top) / r.height);
        tl.style.setProperty('--p', p.toFixed(4));
      });
    }

    if (def.init) def.init();
    bindMagnetic();
  }

  function initManuscript() {
    var ms = $('.ms');
    if (!ms || reduce) return;
    var first = $('.sh.first', ms), last = $('.sh.last', ms), mids = $$('.sh.mid', ms);
    var caps = $$('.ms-caps p', ms), tags = $('.ms-tags', ms), N = mids.length;
    var clamp = AD.clamp, ease = AD.ease;
    AD.onScroll(function () {
      var r = ms.getBoundingClientRect();
      var total = ms.offsetHeight - window.innerHeight;
      var p = clamp(-r.top / total);
      var sx = window.innerWidth < 560 ? 0.78 : 1;

      var f = ease(clamp((p - 0.04) / 0.2));
      first.style.transform = 'translate(' + (-72 * sx * f) + '%,' + (-2 * f) + '%) rotate(' + (-5 * f) + 'deg)';

      mids.forEach(function (m, i) {
        var t0 = 0.2 + i * (0.34 / N);
        var q = ease(clamp((p - t0) / 0.15));
        var dir = i % 2 ? 1 : -1;
        var dx = dir * (95 + (i * 41) % 110);
        var dy = 18 + (i * 29) % 70;
        var rot = dir * (16 + (i * 13) % 40);
        m.style.transform = 'translate(' + (dx * q) + '%,' + (dy * q) + '%) translateY(' + ((1 - q) * -(i + 1) * 1.3) + 'px) rotate(' + (rot * q) + 'deg)';
        m.style.opacity = String(1 - clamp((q - 0.5) / 0.5));
      });

      var l = ease(clamp((p - 0.62) / 0.2));
      last.style.transform = 'translate(' + (72 * sx * l) + '%,' + (-2 * l) + '%) rotate(' + (4 * l) + 'deg)';

      var o = [
        1 - clamp((p - 0.14) / 0.08),
        clamp((p - 0.2) / 0.08) * (1 - clamp((p - 0.62) / 0.08)),
        clamp((p - 0.72) / 0.08)
      ];
      caps.forEach(function (c, i) {
        c.style.opacity = String(o[i]);
        c.style.transform = 'translateY(' + ((1 - o[i]) * 26) + 'px)';
      });
      tags.style.opacity = String(clamp((p - 0.86) / 0.08));
    });
  }

  /* magnetic buttons */
  function bindMagnetic() {
    if (reduce) return;
    $$('[data-mag]').forEach(function (b) {
      if (b._mag) return; b._mag = true;
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) * 0.22;
        var y = (e.clientY - (r.top + r.height / 2)) * 0.32;
        b.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* delegated: card radial reveal, accordion */
  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.card');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--x', (e.clientX - r.left) + 'px');
    c.style.setProperty('--y', (e.clientY - r.top) + 'px');
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.qa > button');
    if (!b) return;
    var qa = b.parentNode;
    var open = !qa.classList.contains('open');
    qa.classList.toggle('open', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ---------- intro: film leader ---------- */
  function intro() {
    var L = $('#leader');
    if (reduce || store('ad-intro') === '1') {
      L.className = 'gone';
      setReady();
      return;
    }
    store('ad-intro', '1');
    document.body.style.overflow = 'hidden';
    var num = $('.l-num', L), n = 3, done = false;
    function tick() { num.classList.remove('tick'); void num.offsetWidth; num.classList.add('tick'); }
    tick();
    var iv = setInterval(function () {
      n--;
      if (n >= 1) { num.textContent = n; tick(); } else { clearInterval(iv); finish(); }
    }, 700);
    function finish() {
      if (done) return; done = true;
      clearInterval(iv);
      L.classList.add('open');
      document.body.style.overflow = '';
      setTimeout(setReady, 350);
      setTimeout(function () { L.className = 'gone'; }, 1100);
    }
    $('.l-skip', L).addEventListener('click', finish);
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderChrome();
    $('#skip').addEventListener('click', function () { $('#main').focus(); $('#main').scrollIntoView(); });
    intro();
    show(getPath());
  });
})();
