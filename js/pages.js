/* Amber's Dream: page templates. */
(function () {
  var AD = window.AD, cfg = AD.config, I = AD.icon, esc = AD.esc;

  /* ---------- shared pieces ---------- */
  function link(path, label, cls, extra) {
    return '<a class="btn ' + cls + '" href="#' + path + '" ' + (extra || '') + '>' + label + ' ' + I.arrow + '</a>';
  }

  function pageHero(slug, title, lead, ghost) {
    return '<section class="phero">' +
      '<div class="ghost" aria-hidden="true">' + ghost + '</div>' +
      '<div class="wrap">' +
      '<div class="slug tl" style="--n:' + slug.length + ';--dur:1.3s;--t:.2s">' + esc(slug) + '</div>' +
      '<h1 data-split data-d=".25">' + esc(title) + '</h1>' +
      '<p class="lead rise" style="--t:1s">' + lead + '</p>' +
      '</div></section>';
  }

  function finalCta(top, line1, line2, line3, primary) {
    return '<section class="sec sec-ink final"><div class="wrap">' +
      '<p class="slug tl" style="--n:' + top.length + ';--dur:.8s;--t:0s" data-reveal>' + esc(top) + '</p>' +
      '<h2 class="display"><span data-split data-d="0">' + esc(line1) + '</span><br><span data-split data-d=".35">' + esc(line2) + '</span><br><em data-split data-d=".7">' + esc(line3) + '</em></h2>' +
      '<div class="cta-row" data-reveal style="--d:.6s">' + (primary || link('/enter', 'Enter for $10', 'btn-amber', 'data-mag')) + '</div>' +
      '</div></section>';
  }

  AD.footerHTML = function () {
    function col(title, items) {
      return '<div><h4>' + title + '</h4><ul>' + items.map(function (i) { return '<li><a href="#' + i[0] + '" data-path="' + i[0] + '">' + i[1] + '</a></li>'; }).join('') + '</ul></div>';
    }
    return '<div class="wrap">' +
      '<div class="fo-big" aria-hidden="true">FADE OUT.</div>' +
      '<div class="fo-grid">' +
      '<div class="fo-sign"><p>Wishing you all wonderful and inspirational writing time!</p><div class="display">Amber and Zach</div></div>' +
      col('The contest', [['/how-it-works', 'How it works'], ['/rules', 'The rules'], ['/prizes', 'Prizes and charity'], ['/faq', 'FAQ']]) +
      col('Take part', [['/enter', 'Enter for $10'], ['/readers', 'Become a reader'], ['/winners', 'Winners']]) +
      col('About', [['/about', 'Our story'], ['/contact', 'Contact']]) +
      '</div>' +
      '<div class="fo-bottom"><span>Amber\'s Dream, the affordable screenplay contest</span><span>' + esc(cfg.email) + '</span></div>' +
      '</div>';
  };

  function sliderPanel() {
    var pile = '';
    for (var i = 0; i < 50; i++) pile += '<i></i>';
    return '<div class="panel" id="prize-panel">' +
      '<label for="entries" class="cap">Move the slider to see how entries add up</label>' +
      '<div class="big" id="o-entries">500</div><div class="cap">writers enter</div>' +
      '<input id="entries" type="range" min="100" max="5000" step="50" value="500">' +
      '<div class="pile" id="pile" aria-hidden="true">' + pile + '</div>' +
      '<div class="readouts"><div><span class="cap">Entry fees collected</span><b id="o-income">$5,000</b></div>' +
      '<div class="am"><span class="cap">To charity (5%)</span><b id="o-charity">$250</b></div></div>' +
      '<p class="fine">An illustration of the 5% pledge, not a prize promise. Prizes are set from the real entry numbers.</p>' +
      '</div>';
  }

  function initSlider() {
    var inp = AD.$('#entries'); if (!inp) return;
    var oE = AD.$('#o-entries'), oI = AD.$('#o-income'), oC = AD.$('#o-charity'), pile = AD.$$('#pile i');
    var shown = { e: 500, i: 5000, c: 250 }, target = { e: 500, i: 5000, c: 250 }, raf = null;
    function paint() {
      oE.textContent = Math.round(shown.e).toLocaleString('en-US');
      oI.textContent = '$' + Math.round(shown.i).toLocaleString('en-US');
      oC.textContent = '$' + Math.round(shown.c).toLocaleString('en-US');
    }
    function loop() {
      var moving = false;
      ['e', 'i', 'c'].forEach(function (k) {
        var d = target[k] - shown[k];
        if (Math.abs(d) > 0.5) { shown[k] += d * 0.16; moving = true; } else shown[k] = target[k];
      });
      paint();
      raf = moving ? requestAnimationFrame(loop) : null;
    }
    function update() {
      var v = Number(inp.value);
      target = { e: v, i: v * cfg.fee, c: v * cfg.fee * cfg.charityPercent / 100 };
      var on = Math.ceil(v / 100);
      pile.forEach(function (p, i) { p.classList.toggle('on', i < on); });
      inp.style.setProperty('--fill', ((v - 100) / 4900 * 100) + '%');
      if (AD.reduce) { shown = Object.assign({}, target); paint(); } else if (!raf) raf = requestAnimationFrame(loop);
    }
    inp.addEventListener('input', update);
    update();
  }

  /* ---------- HOME ---------- */
  function homeRender() {
    var band = AD.band.map(function (t) { return '<span>' + t + I.star + '</span>'; }).join('');
    var half = band + band + band;
    var mids = '';
    for (var i = 0; i < 14; i++) mids += '<div class="sh mid"></div>';
    var fees = AD.fees.map(function (f, i) {
      return '<div class="bar-row"><div class="meta"><span>' + esc(f.label) + '</span><strong>' + f.amount + '</strong></div>' +
        '<div class="bar"><span style="--w:' + f.w + ';--c:' + f.c + ';--d:' + (i * 0.18) + 's"></span></div></div>';
    }).join('');

    var cards = [
      ['01', 'How it works', 'Six simple steps from your first page to the winners list.', '/how-it-works'],
      ['02', 'The rules', 'Everything a writer needs to know, on one call sheet.', '/rules'],
      ['03', 'Prizes and charity', 'Prizes grow with every entry. 5% of the income goes to charity.', '/prizes'],
      ['04', 'Become a reader', 'Movie buff, actor in the making or writer? Read with us.', '/readers'],
      ['05', 'Questions', 'Short answers to the things writers ask us most.', '/faq'],
      ['06', 'Our story', 'Why two pages, why ten dollars, and who Amber and Zach are.', '/about']
    ].map(function (c) {
      return '<a class="card" href="#' + c[3] + '" data-reveal><div><div class="num">' + c[0] + '</div><h3>' + c[1] + '</h3><p>' + c[2] + '</p></div><span class="go">Open ' + I.arrow + '</span></a>';
    }).join('');

    return '' +
      '<section class="hero" id="hero">' +
      '<div class="ghost a" aria-hidden="true">A</div><div class="ghost z" aria-hidden="true">Z</div>' +
      '<div class="fsheet f1" aria-hidden="true"><b>FADE IN:</b></div>' +
      '<div class="fsheet f2" aria-hidden="true"><b>FADE OUT.</b></div>' +
      '<div class="fsheet f3" aria-hidden="true"><b>CUT TO:</b></div>' +
      '<div class="wrap"><div class="hero-copy">' +
      '<span class="slug tl" style="--n:8;--dur:.7s;--t:.3s">FADE IN:</span>' +
      '<span class="tl mono" style="--n:28;--dur:1.5s;--t:1.1s;color:rgba(251,241,220,.85);font-size:clamp(15px,1.6vw,18px)">INT. A WRITER\'S DESK - NIGHT</span>' +
      '<h1 class="mark"><span class="ln" data-split data-d=".3">Amber\'s</span><span class="ln l2" data-split data-d=".7">Dream</span></h1>' +
      '<p class="lead rise" style="--t:1.7s">A screenplay contest for writers who count every penny. Send us your first page and your last.</p>' +
      '<div class="cta-row rise" style="--t:2s">' + link('/enter', 'Enter for $10', 'btn-amber', 'data-mag') + link('/how-it-works', 'How it works', 'btn-ghost', 'data-mag') + '</div>' +
      '</div></div>' +
      '<div class="scrollcue" aria-hidden="true">scroll<i></i></div>' +
      '</section>' +

      '<div class="bands" aria-hidden="true">' +
      '<div class="band b1"><div class="track">' + half + half + '</div></div>' +
      '<div class="band b2"><div class="track">' + half + half + '</div></div>' +
      '</div>' +

      '<section class="sec sec-paper"><div class="wrap split">' +
      '<div><div class="bigprice" data-reveal aria-hidden="true">$10</div>' +
      '<h2 class="h2" data-split>Most contests charge $45 to $95. Ours is $10.</h2>' +
      '<p class="lead" style="margin-top:28px" data-reveal>Every penny counts for a struggling writer, so we built a contest that does not ask for more. Seasoned or beginner, anyone can afford to enter.</p></div>' +
      '<div class="bars" data-bars>' + fees + '</div>' +
      '</div></section>' +

      '<section class="ms" aria-label="How a two page entry works"><div class="ms-sticky">' +
      '<div class="ms-caps">' +
      '<p>This is your screenplay.</p>' +
      '<p>The middle stays with you.</p>' +
      '<p>Send the first page and the last.<small>The beginning creates curiosity. The ending stays with the viewer.</small></p>' +
      '</div>' +
      '<div class="ms-stage" aria-hidden="true"><div class="sh last"><b>FADE OUT.</b></div>' + mids + '<div class="sh first"><b>FADE IN:</b></div></div>' +
      '<div class="ms-tags" aria-hidden="true"><span>First full page</span><span>Last full page</span></div>' +
      '</div></section>' +

      '<section class="sec sec-paper"><div class="wrap split">' +
      '<div><h2 class="h2" data-split>Every entry raises the prizes.</h2>' +
      '<p class="lead" style="margin-top:28px" data-reveal>The prize amount depends on participation. More entries means more writers recognized and higher prizes. There are also draws among all contestants, and 5% of the income goes to charity.</p>' +
      '<div class="cta-row" style="margin-top:34px" data-reveal>' + link('/prizes', 'Prizes and charity', 'btn-line', 'data-mag') + '</div></div>' +
      '<div data-reveal="zoom">' + sliderPanel() + '</div>' +
      '</div></section>' +

      '<section class="sec sec-ink"><div class="wrap">' +
      '<h2 class="h2" data-split>Where to next?</h2>' +
      '<div class="next">' +
      '<a class="card wide" href="#/enter" data-reveal><div><div class="num">Ready?</div><h3>Enter your two pages</h3><p>Pay $10 by card or PayPal, upload your first and last page, and you are in.</p></div><span class="go">Start your entry ' + I.arrow + '</span></a>' +
      cards + '</div></div></section>' +

      finalCta('CUT TO:', 'Two pages.', 'Ten dollars.', 'One dream.');
  }

  AD.route('/', { title: '', word: "Amber's Dream", render: homeRender, init: initSlider });

  /* ---------- HOW IT WORKS ---------- */
  AD.route('/how-it-works', {
    title: 'How it works', word: 'How it works',
    render: function () {
      var steps = AD.steps.map(function (s, i) {
        return '<li class="step"><div class="dot">' + (i + 1) + '</div><h3>' + esc(s.t) + '</h3><p>' + esc(s.p) + '</p><span class="tag">' + esc(s.tag) + '</span></li>';
      }).join('');
      return pageHero('INT. THE PROCESS - DAY', 'How it works', 'Six simple steps. You only ever send two pages.', 'A') +
        '<section class="sec sec-paper"><div class="wrap">' +
        '<h2 class="h2" data-split>From your first page to the winners list.</h2>' +
        '<ol class="tline">' + steps + '</ol>' +
        '</div></section>' +
        finalCta('CUT TO:', 'Ready?', 'Send us', 'the first and last.');
    }
  });

  /* ---------- RULES ---------- */
  AD.route('/rules', {
    title: 'The rules', word: 'The rules',
    render: function () {
      var rows = AD.rows.map(function (r) {
        return '<div class="row" data-reveal><div class="k">' + esc(r[0]) + '</div><div class="v">' + esc(r[1]) + '</div></div>';
      }).join('');
      return pageHero('INT. THE RULES - DAY', 'The rules', 'Everything a writer needs to know, on one call sheet.', 'Z') +
        '<section class="sec sec-ink"><div class="wrap" style="max-width:1000px">' +
        '<h2 class="h2" data-split>Call sheet</h2>' +
        '<div class="call">' + rows + '</div>' +
        '</div></section>' +
        '<section class="sec sec-paper"><div class="wrap" style="max-width:1000px">' +
        '<h2 class="h2" data-split>The short version.</h2>' +
        '<ul class="big-list">' +
        '<li data-reveal><strong>Two pages.</strong><span>Your first full page and your last full page. Nothing else to send.</span></li>' +
        '<li data-reveal><strong>Ten dollars.</strong><span>One fee, no early bird or late entry price. That is the whole cost.</span></li>' +
        '<li data-reveal><strong>Any genre.</strong><span>Every kind of story is welcome, from writers all over the world.</span></li>' +
        '<li data-reveal><strong>5% to charity.</strong><span>Five per cent of the income goes to charity.</span></li>' +
        '</ul>' +
        '<div class="note-box" data-reveal><h3>Still to be confirmed before entries open</h3><ul>' +
        '<li>[File format and file size for your two pages]</li>' +
        '<li>[Ownership of your work and how entries are handled]</li>' +
        '<li>[How readers score and choose winners]</li>' +
        '<li>[Age and eligibility requirements]</li></ul></div>' +
        '</div></section>' +
        finalCta('CUT TO:', 'Got it?', 'Then enter.', 'It is ten dollars.');
    }
  });

  /* ---------- PRIZES ---------- */
  AD.route('/prizes', {
    title: 'Prizes and charity', word: 'Prizes',
    render: function () {
      return pageHero('INT. THE PRIZE TABLE - NIGHT', 'Prizes and charity', 'The more writers enter, the more writers we can reward.', 'P') +
        '<section class="sec sec-paper"><div class="wrap split">' +
        '<div><h2 class="h2" data-split>Every entry raises the prizes.</h2>' +
        '<p class="lead" style="margin-top:28px" data-reveal>The prize amount depends on participation. More entries means more contestants recognized and higher prizes. There are also draws among all contestants.</p></div>' +
        '<div data-reveal="zoom">' + sliderPanel() + '</div>' +
        '</div></section>' +

        '<section class="sec sec-ink"><div class="wrap split">' +
        '<div class="five" data-reveal aria-hidden="true">5%</div>' +
        '<div><h2 class="h2" data-split>Five per cent goes to charity.</h2>' +
        '<p class="lead" style="margin-top:26px" data-reveal>Besides prizes, we think it matters that 5% of the income goes to charity. Every entry helps a writer and helps someone beyond the page.</p></div>' +
        '</div></section>' +

        '<section class="sec sec-esp"><div class="wrap">' +
        '<h2 class="h2" data-split>What you can win.</h2>' +
        '<div class="tiers">' +
        '<div class="tier" data-reveal><h3>Prizes</h3><p>They grow with the number of entries.</p><span class="ph">[Prize amounts announced when entries open]</span></div>' +
        '<div class="tier" data-reveal style="--d:.1s"><h3>Draws</h3><p>Every contestant is in the draws, not only the finalists.</p><span class="ph">[Draw prizes to be confirmed]</span></div>' +
        '<div class="tier" data-reveal style="--d:.2s"><h3>Charity</h3><p>5% of the income goes to charity.</p><span class="ph">[Charity name to be confirmed]</span></div>' +
        '</div>' +
        '<div class="cta-row" style="margin-top:50px" data-reveal>' + link('/enter', 'Enter for $10', 'btn-amber', 'data-mag') + '</div>' +
        '</div></section>';
    },
    init: initSlider
  });

  /* ---------- ENTER ---------- */
  AD.route('/enter', {
    title: 'Enter', word: 'Enter',
    render: function () {
      return pageHero('INT. THE SUBMISSION DESK - DAY', 'Enter your two pages', 'Three short steps: your details, your pages, your payment.', 'A') +
        '<section class="sec sec-paper"><div class="wrap">' +
        (cfg.demo ? '<div class="demo-banner" style="max-width:860px;margin-inline:auto;margin-bottom:30px">Preview build. Payment and file upload connect when the site goes live.</div>' : '') +
        '<div class="wiz" id="wiz" data-reveal></div>' +
        '</div></section>';
    },
    init: function () { AD.initWizard(); }
  });

  /* ---------- READERS ---------- */
  AD.route('/readers', {
    title: 'Become a reader', word: 'Readers',
    render: function () {
      return pageHero('INT. THE READING ROOM - NIGHT', 'Become a reader', 'Every entry gets read. We are building a team of part-time readers: movie buffs, actors in the making and writers who know the struggle.', 'R') +
        '<section class="sec sec-paper"><div class="wrap contact-grid">' +
        '<div><h2 class="h2" data-split>Read with us.</h2>' +
        '<p class="lead" style="margin-top:26px" data-reveal>Reading every entry is the biggest job in the contest, and it is the heart of it. If you love film and care about new writers, we would like to hear from you.</p>' +
        '<div class="note-box" data-reveal><h3>Still to be confirmed</h3><ul><li>[Pay for readers]</li><li>[Hours and how reading is shared out]</li></ul></div></div>' +
        '<div data-reveal>' +
        (cfg.demo ? '<div class="demo-banner">Preview build. This form connects to email when the site goes live.</div>' : '') +
        '<form class="form" id="readerform" novalidate>' +
        '<div class="two-col"><div class="field"><label for="r-name">Your name</label><input id="r-name" type="text" autocomplete="name" required><div class="errmsg">Please add your name.</div></div>' +
        '<div class="field"><label for="r-email">Email</label><input id="r-email" type="email" autocomplete="email" required><div class="errmsg">Please add a valid email.</div></div></div>' +
        '<div class="two-col"><div class="field"><label for="r-country">Country</label><input id="r-country" type="text" autocomplete="country-name"></div>' +
        '<div class="field"><label for="r-who">Which describes you best?</label><select id="r-who" required><option value="">Choose one</option><option>Movie buff</option><option>Actor or actor in the making</option><option>Writer</option><option>Something else</option></select><div class="errmsg">Please choose one.</div></div></div>' +
        '<div class="field"><label for="r-about">Tell us about yourself</label><textarea id="r-about" required></textarea><div class="errmsg">A few words about you, please.</div></div>' +
        '<div class="field"><label for="r-when">When could you read? <span class="hint">(days, evenings, weekends)</span></label><input id="r-when" type="text"></div>' +
        '<button class="btn btn-dark" type="submit" data-mag>Apply to read ' + I.arrow + '</button>' +
        '</form>' +
        '<div class="ok" id="readerok"><h3>Thank you!</h3><p class="lead">We have your note. We will be in touch when readers are needed.</p></div>' +
        '</div></div></section>';
    },
    init: function () { AD.simpleForm('#readerform', '#readerok', ['r-name', 'r-email', 'r-who', 'r-about'], 'reader'); }
  });

  /* ---------- FAQ ---------- */
  AD.route('/faq', {
    title: 'FAQ', word: 'FAQ',
    render: function () {
      var qa = AD.faq.map(function (q, i) {
        return '<div class="qa" data-reveal><button type="button" aria-expanded="false" aria-controls="a' + i + '"><span>' + esc(q[0]) + '</span><span class="pm" aria-hidden="true"></span></button>' +
          '<div class="ans" id="a' + i + '" role="region"><div><p>' + esc(q[1]) + '</p></div></div></div>';
      }).join('');
      return pageHero('INT. THE INFORMATION DESK - DAY', 'Questions', 'Short answers to the things writers ask us most.', '?') +
        '<section class="sec sec-paper"><div class="wrap" style="max-width:1000px">' +
        '<div class="faq">' + qa + '</div>' +
        '<p class="lead" style="margin-top:50px" data-reveal>Still wondering? <a href="#/contact" style="color:var(--brown);font-weight:700">Write to us</a>.</p>' +
        '</div></section>' +
        finalCta('CUT TO:', 'Questions answered?', 'Send us', 'your two pages.');
    }
  });

  /* ---------- ABOUT ---------- */
  AD.route('/about', {
    title: 'Our story', word: 'Our story',
    render: function () {
      return pageHero('INT. THE BEGINNING - DAWN', 'Our story', 'A contest built on one idea: every penny counts, and so does every first page.', 'A') +
        '<section class="sec sec-esp"><div class="wrap">' +
        '<div class="az" data-reveal><span aria-hidden="true">A</span><i aria-hidden="true"></i><span aria-hidden="true">Z</span></div>' +
        '<div class="az-cap" aria-hidden="true"><span>the first page</span><span>the last page</span></div>' +
        '<p class="lead" style="margin:44px auto 0;text-align:center" data-reveal>Amber and Zach stand for A to Z. Our contest only asks for the beginning and the end.</p>' +
        '</div></section>' +

        '<section class="sec sec-paper"><div class="wrap">' +
        '<p class="pull" data-split>Every penny counts. Every first page matters.</p>' +
        '<div class="cols2" style="margin-top:60px">' +
        '<p data-reveal>Normal screenplay contests can cost anything from $45 for an early bird to $95 or more for a late entry. We also know there are so many struggling writers to whom every penny counts.</p>' +
        '<p data-reveal>That is why we built a contest that costs only ten dollars. And what is more, you only need to send us the first and last full page.</p>' +
        '<p data-reveal>After all, it is the beginning that creates fantasies and curiosity, and the end that surprises the viewer or leaves an everlasting memory.</p>' +
        '<p data-reveal>Prizes depend on participation: the more entries, the more contestants are recognized and the higher the prizes get. Five per cent of the income goes to charity. And it all happens twice a year, for writers from all over the world.</p>' +
        '</div></div></section>' +

        '<section class="sec sec-ink"><div class="wrap split">' +
        '<div class="logo-frame" data-reveal="zoom"><img src="assets/logo.png" alt="Amber\'s Dream logo: a man at a typewriter and a woman writing with a quill, facing each other" width="645" height="577" loading="lazy"></div>' +
        '<div><h2 class="h2" data-split>Two writers. One desk.</h2>' +
        '<p class="lead" style="margin-top:26px" data-reveal>Our logo shows two writers facing each other across a table, one at a typewriter and one with a quill. Different pens, same dream.</p>' +
        '<div class="cta-row" style="margin-top:34px" data-reveal>' + link('/enter', 'Enter for $10', 'btn-amber', 'data-mag') + '</div></div>' +
        '</div></section>';
    }
  });

  /* ---------- WINNERS ---------- */
  AD.route('/winners', {
    title: 'Winners', word: 'Winners',
    render: function () {
      var clap = '<svg class="clap" viewBox="0 0 240 190" role="img" aria-label="A film clapperboard" onmouseenter="this.classList.add(\'go\')">' +
        '<rect x="14" y="70" width="212" height="108" rx="8" fill="#2B1A10" stroke="#E2A12F" stroke-width="4"/>' +
        '<g class="arm"><rect x="14" y="34" width="212" height="34" rx="6" fill="#1E120A" stroke="#E2A12F" stroke-width="4"/>' +
        '<path d="M40 34l-22 34M82 34L60 68M124 34l-22 34M166 34l-22 34M208 34l-22 34" stroke="#E2A12F" stroke-width="9"/></g>' +
        '<path d="M34 100h172M34 128h172M34 156h110" stroke="rgba(251,241,220,.35)" stroke-width="3" stroke-linecap="round"/>' +
        '</svg>';
      return pageHero('INT. THE AWARDS STAGE - NIGHT', 'Winners', 'The first winners will be announced after our first deadline.', 'W') +
        '<section class="sec sec-paper center"><div class="wrap" style="max-width:820px">' +
        '<div data-reveal="zoom">' + clap + '</div>' +
        '<h2 class="h2" data-split>The stage is set.</h2>' +
        '<p class="lead" style="margin-top:26px" data-reveal>The first deadline is ' + esc(cfg.deadline) + '. Winners will appear here, in film publications and on movie sites, and each winner is contacted by email.</p>' +
        '<div style="margin-top:44px;text-align:left" data-reveal>' +
        '<form class="form" id="notifyform" novalidate><div class="field"><label for="n-email">Tell me when winners are announced</label><input id="n-email" type="email" autocomplete="email" required><div class="errmsg">Please add a valid email.</div></div>' +
        '<button class="btn btn-dark" type="submit" data-mag>Notify me ' + I.arrow + '</button></form>' +
        '<div class="ok" id="notifyok"><h3>You are on the list.</h3></div></div>' +
        '</div></section>';
    },
    init: function () { AD.simpleForm('#notifyform', '#notifyok', ['n-email'], 'notify'); }
  });

  /* ---------- CONTACT ---------- */
  AD.route('/contact', {
    title: 'Contact', word: 'Contact',
    render: function () {
      return pageHero('INT. THE FRONT OFFICE - DAY', 'Contact', 'Questions about entries, readers or prizes? Write to us.', '@') +
        '<section class="sec sec-paper"><div class="wrap contact-grid">' +
        '<div><h2 class="h2" data-split>Say hello.</h2>' +
        '<p class="lead" style="margin-top:26px" data-reveal>Send us a note and we will answer by email.</p>' +
        '<p class="mail" style="margin-top:30px;color:var(--brown)" data-reveal>' + esc(cfg.email) + '</p></div>' +
        '<div data-reveal>' +
        (cfg.demo ? '<div class="demo-banner">Preview build. This form connects to email when the site goes live.</div>' : '') +
        '<form class="form" id="contactform" novalidate>' +
        '<div class="two-col"><div class="field"><label for="c-name">Your name</label><input id="c-name" type="text" autocomplete="name" required><div class="errmsg">Please add your name.</div></div>' +
        '<div class="field"><label for="c-email">Email</label><input id="c-email" type="email" autocomplete="email" required><div class="errmsg">Please add a valid email.</div></div></div>' +
        '<div class="field"><label for="c-msg">Your message</label><textarea id="c-msg" required></textarea><div class="errmsg">Please write a message.</div></div>' +
        '<button class="btn btn-dark" type="submit" data-mag>Send message ' + I.arrow + '</button></form>' +
        '<div class="ok" id="contactok"><h3>Message sent.</h3><p class="lead">Thank you. We will answer by email.</p></div>' +
        '</div></div></section>';
    },
    init: function () { AD.simpleForm('#contactform', '#contactok', ['c-name', 'c-email', 'c-msg'], 'contact'); }
  });

  /* ---------- 404 ---------- */
  AD.route('*', {
    title: 'Page not found', word: 'Cut!',
    render: function () {
      return '<section class="nf"><div><div class="big" aria-hidden="true">CUT!</div><h1 class="display" style="font-size:clamp(40px,7vw,90px);line-height:1.05;margin-top:18px">That page is not on our script.</h1>' +
        '<div class="cta-row" style="justify-content:center;margin-top:36px">' + link('/', 'Back to the start', 'btn-amber', 'data-mag') + '</div></div></section>';
    }
  });
})();
