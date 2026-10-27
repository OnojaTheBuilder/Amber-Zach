/* Amber's Dream: forms. Entry wizard and simple forms.
   AD.submit() is the one place to connect the real backend (see README). */
(function () {
  var AD = window.AD, cfg = AD.config, $ = AD.$, esc = AD.esc, I = AD.icon;

  /* Replace the body of this function when payments, file storage and email are connected.
     kind: 'entry' | 'reader' | 'contact' | 'notify'. Must resolve { ok: true } or reject. */
  AD.submit = function (kind, payload) {
    return new Promise(function (resolve) { setTimeout(function () { resolve({ ok: true }); }, 900); });
  };

  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function flag(fieldEl, bad) { if (fieldEl) fieldEl.classList.toggle('err', !!bad); return !bad; }
  function fieldOf(id) { var el = document.getElementById(id); return el ? el.closest('.field') : null; }

  /* ---------- simple forms (readers, contact, notify) ---------- */
  AD.simpleForm = function (formSel, okSel, ids, kind) {
    var form = $(formSel), ok = $(okSel);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var good = true, first = null;
      ids.forEach(function (id) {
        var el = document.getElementById(id), v = (el.value || '').trim();
        var valid = el.type === 'email' ? emailRe.test(v) : v.length > 0;
        flag(fieldOf(id), !valid);
        if (!valid) { good = false; if (!first) first = el; }
      });
      if (!good) { first.focus(); return; }
      var btn = $('button[type=submit]', form);
      btn.disabled = true; btn.firstChild.textContent = 'Sending... ';
      var data = {}; ids.forEach(function (id) { data[id] = document.getElementById(id).value; });
      AD.submit(kind, data).then(function () {
        form.style.display = 'none';
        var banner = form.parentNode.querySelector('.demo-banner'); if (banner) banner.style.display = 'none';
        ok.classList.add('show'); ok.setAttribute('tabindex', '-1'); ok.focus();
      });
    });
  };

  /* ---------- entry wizard ---------- */
  AD.initWizard = function () {
    var root = $('#wiz'); if (!root) return;
    var S = { step: 1, name: '', email: '', country: '', title: '', genre: '', first: null, last: null, method: 'card', agree: false, err: {} };

    function stepper() {
      var labels = ['Your details', 'Your pages', 'Payment'];
      return '<ol class="steps" aria-label="Progress">' + labels.map(function (l, i) {
        var n = i + 1, cls = S.step > n ? 'done' : S.step === n ? 'now' : '';
        return '<li class="' + cls + '"' + (S.step === n ? ' aria-current="step"' : '') + '>' + n + '. ' + l + '</li>';
      }).join('') + '</ol>';
    }

    function textField(id, label, val, type, req, msg, hint) {
      return '<div class="field' + (S.err[id] ? ' err' : '') + '"><label for="' + id + '">' + label + (hint ? ' <span class="hint">' + hint + '</span>' : '') + '</label>' +
        '<input id="' + id + '" type="' + (type || 'text') + '" value="' + esc(val) + '"' + (req ? ' required' : '') + '>' +
        (msg ? '<div class="errmsg">' + msg + '</div>' : '') + '</div>';
    }

    function dropField(key, label) {
      var f = S[key];
      return '<div class="field' + (S.err[key] ? ' err' : '') + '"><span class="lab" id="lab-' + key + '">' + label + '</span>' +
        '<label class="drop' + (f ? ' has' : '') + '" data-key="' + key + '" style="margin:0;font-family:var(--f-body);font-weight:400">' +
        '<input type="file" id="f-' + key + '" accept="' + cfg.accept.join(',') + '" aria-labelledby="lab-' + key + '">' +
        (f ? '<span class="fn">' + esc(f.name) + '</span><span>' + (f.size / 1024 < 1024 ? Math.max(1, Math.round(f.size / 1024)) + ' KB' : (f.size / 1048576).toFixed(1) + ' MB') + '. Click to change.</span>'
          : '<strong>Drop your file here</strong><span>or click to choose. ' + cfg.accept.join(', ') + ' up to ' + cfg.maxMB + ' MB.</span>') +
        '</label>' +
        '<div class="errmsg" id="e-' + key + '">' + esc(S.err[key] || '') + '</div></div>';
    }

    function view() {
      if (S.step === 1) {
        return stepper() + '<div class="pane"><h2>Tell us about you</h2><p class="sub lead" style="font-size:19px">We use this to contact winners by email.</p>' +
          '<div class="form">' +
          '<div class="two-col">' + textField('w-name', 'Your name', S.name, 'text', true, 'Please add your name.') +
          textField('w-email', 'Email', S.email, 'email', true, 'Please add a valid email.') + '</div>' +
          '<div class="two-col">' + textField('w-country', 'Country', S.country, 'text', false, '', '(optional)') +
          textField('w-title', 'Screenplay title', S.title, 'text', true, 'Please add your screenplay title.') + '</div>' +
          '<div class="field"><label for="w-genre">Genre <span class="hint">(optional, any genre is welcome)</span></label><select id="w-genre"><option value="">Choose a genre</option>' +
          AD.genres.map(function (g) { return '<option' + (S.genre === g ? ' selected' : '') + '>' + g + '</option>'; }).join('') + '</select></div>' +
          '</div>' +
          '<div class="wiz-nav"><span></span><button class="btn btn-dark" type="button" id="next" data-mag>Next: your pages ' + I.arrow + '</button></div></div>';
      }
      if (S.step === 2) {
        return stepper() + '<div class="pane"><h2>Add your two pages</h2><p class="sub lead" style="font-size:19px">Only the first full page and the last full page of your screenplay.</p>' +
          '<div class="form">' + dropField('first', 'First full page') + dropField('last', 'Last full page') + '</div>' +
          '<div class="wiz-nav"><button class="btn btn-line" type="button" id="back">Back</button><button class="btn btn-dark" type="button" id="next" data-mag>Next: payment ' + I.arrow + '</button></div></div>';
      }
      if (S.step === 3) {
        return stepper() + '<div class="pane"><h2>Check and pay</h2><p class="sub lead" style="font-size:19px">One fee. No early bird or late entry price.</p>' +
          '<div class="form">' +
          '<div class="sum"><div><span>Screenplay</span><strong>' + esc(S.title) + '</strong></div><div><span>Writer</span><span>' + esc(S.name) + '</span></div>' +
          '<div><span>Pages</span><span>' + esc(S.first ? S.first.name : '') + ', ' + esc(S.last ? S.last.name : '') + '</span></div>' +
          '<div class="tot"><span>Total</span><span>$' + cfg.fee + '</span></div></div>' +
          '<div class="field"><span class="lab">How would you like to pay?</span><div class="pay" role="radiogroup" aria-label="Payment method">' +
          '<label><input type="radio" name="m" value="card"' + (S.method === 'card' ? ' checked' : '') + '> Credit or debit card</label>' +
          '<label><input type="radio" name="m" value="paypal"' + (S.method === 'paypal' ? ' checked' : '') + '> PayPal</label></div></div>' +
          '<div class="field' + (S.err.agree ? ' err' : '') + '"><label class="check" style="margin:0;font-family:var(--f-body);font-weight:400"><input type="checkbox" id="w-agree"' + (S.agree ? ' checked' : '') + '><span>I confirm this is my own work and I am happy for the readers to read these two pages.</span></label><div class="errmsg">Please tick the box to continue.</div></div>' +
          '</div>' +
          '<div class="wiz-nav"><button class="btn btn-line" type="button" id="back">Back</button><button class="btn btn-amber" type="button" id="pay" data-mag>Pay $' + cfg.fee + ' and send my pages ' + I.arrow + '</button></div></div>';
      }
      var drops = '';
      for (var i = 0; i < 16; i++) drops += '<i style="--x:' + (Math.random() * 96) + '%;--t:' + (2.2 + Math.random() * 2.2).toFixed(2) + 's;--r:' + Math.round(Math.random() * 60 - 30) + 'deg;animation-delay:' + (Math.random() * 1.2).toFixed(2) + 's"></i>';
      return '<div class="done-box pane" tabindex="-1" id="donebox"><div class="rain" aria-hidden="true">' + drops + '</div>' +
        '<div class="display">Your two pages are in.</div>' +
        '<p class="lead" style="margin:22px auto 0;text-align:center">' +
        (cfg.demo ? 'This was a preview: nothing was sent or charged. When the site is live, this is where your confirmation email goes out.' : 'Thank you, ' + esc(S.name) + '. A confirmation is on its way to ' + esc(S.email) + '.') +
        '</p><div class="cta-row" style="justify-content:center;margin-top:34px"><a class="btn btn-dark" href="#home">Back to the start</a><a class="btn btn-line" href="#winners">See the winners page</a></div></div>';
    }

    function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

    function render(focusSel) {
      root.innerHTML = view();
      bind();
      var t = root.getBoundingClientRect().top + window.scrollY - 110;
      if (window.scrollY > t) window.scrollTo({ top: t, behavior: AD.reduce ? 'auto' : 'smooth' });
      if (focusSel) { var f = $(focusSel, root); if (f) f.focus({ preventScroll: true }); }
    }

    function bind() {
      var next = $('#next', root), back = $('#back', root), pay = $('#pay', root);
      if (back) back.addEventListener('click', function () { S.err = {}; S.step--; render('h2'); });

      if (S.step === 1) {
        next.addEventListener('click', function () {
          S.name = val('w-name'); S.email = val('w-email'); S.country = val('w-country'); S.title = val('w-title'); S.genre = val('w-genre');
          S.err = {};
          if (!S.name) S.err['w-name'] = 1;
          if (!emailRe.test(S.email)) S.err['w-email'] = 1;
          if (!S.title) S.err['w-title'] = 1;
          var bad = Object.keys(S.err);
          if (bad.length) { render('#' + bad[0]); return; }
          S.step = 2; render();
        });
      }

      if (S.step === 2) {
        AD.$$('.drop', root).forEach(function (d) {
          var key = d.getAttribute('data-key'), input = $('input', d);
          function take(file) {
            var ext = '.' + file.name.split('.').pop().toLowerCase();
            S.err[key] = '';
            if (cfg.accept.indexOf(ext) === -1) S.err[key] = 'Please use ' + cfg.accept.join(', ') + '.';
            else if (file.size > cfg.maxMB * 1048576) S.err[key] = 'That file is over ' + cfg.maxMB + ' MB.';
            if (S.err[key]) { S[key] = null; } else { S[key] = file; S.err[key] = ''; }
            var keep = { first: S.first, last: S.last };
            render();
            if (S.err[key]) { var e = $('#e-' + key, root); if (e) e.parentNode.classList.add('err'); }
          }
          input.addEventListener('change', function () { if (input.files[0]) take(input.files[0]); });
          ['dragenter', 'dragover'].forEach(function (ev) { d.addEventListener(ev, function (e) { e.preventDefault(); d.classList.add('over'); }); });
          ['dragleave', 'drop'].forEach(function (ev) { d.addEventListener(ev, function (e) { e.preventDefault(); d.classList.remove('over'); }); });
          d.addEventListener('drop', function (e) { if (e.dataTransfer.files[0]) take(e.dataTransfer.files[0]); });
        });
        next.addEventListener('click', function () {
          S.err = {};
          if (!S.first) S.err.first = 'Please add your first full page.';
          if (!S.last) S.err.last = 'Please add your last full page.';
          if (Object.keys(S.err).length) { render(); AD.$$('.field', root).forEach(function (f) { var e = $('.errmsg', f); if (e && e.textContent) f.classList.add('err'); }); return; }
          S.step = 3; render();
        });
      }

      if (S.step === 3) {
        AD.$$('input[name=m]', root).forEach(function (r) { r.addEventListener('change', function () { S.method = r.value; }); });
        pay.addEventListener('click', function () {
          S.agree = $('#w-agree', root).checked;
          if (!S.agree) { S.err = { agree: 1 }; render('#w-agree'); return; }
          pay.disabled = true; pay.firstChild.textContent = 'Sending your pages... ';
          AD.submit('entry', { name: S.name, email: S.email, country: S.country, title: S.title, genre: S.genre, method: S.method, first: S.first, last: S.last })
            .then(function () { S.step = 4; render('#donebox'); });
        });
      }
    }

    render();
  };
})();
