/**
 * Nousvara — shared header, footer, product catalogue, checkout and demo.
 *
 * Paths are computed from page depth so links work locally and on the live
 * domain. Everything about a product that more than one page needs lives in
 * CATALOGUE below, so adding a product means adding one entry here plus its
 * own pages, rather than hunting through every file.
 */
(function () {
  var path = location.pathname;
  var inProducts = path.indexOf('/products/') !== -1;
  var base = inProducts ? '../' : '';
  var page = path.split('/').pop() || 'index.html';
  var isHome = (/((^|\/)index\.html$)|(^\/$)/.test(path) || path === '' || path.charAt(path.length - 1) === '/') && !inProducts;

  var home = base + 'index.html';
  var products = base + 'products.html';
  var philosophy = base + 'philosophy.html';
  var method = base + 'method.html';
  var about = base + 'about.html';
  var refund = base + 'refund-policy.html';
  var privacy = base + 'privacy-policy.html';
  var terms = base + 'terms.html';
  function homeAnchor(id) { return isHome ? '#' + id : base + 'index.html#' + id; }
  function current(active) { return active ? ' aria-current="page"' : ''; }
  var contact = homeAnchor('contact');

  /* ---- Product catalogue: the one place a product is described ---------------
     pages:  file names that get this product's own header
     links:  that header's links (match = the page that marks the link current)
     urls:   external links. Leave a value empty until it exists; any element
             marked data-link="key.name" stays hidden until the URL is filled in,
             and anything marked data-link-missing="key.name" shows instead. */
  var CATALOGUE = [
    {
      key: 'swaro',
      name: 'Swaro',
      icon: base + 'assets/products/swaro-icon.webp',
      home: base + 'products/swaro.html',
      pages: ['swaro.html', 'swaro-pricing.html', 'swaro-changelog.html'],
      links: [
        { label: 'Overview', href: base + 'products/swaro.html', match: 'swaro.html' },
        { label: 'Pricing', href: base + 'products/swaro-pricing.html#pricing', match: 'swaro-pricing.html' },
        { label: 'Changelog', href: base + 'products/swaro-changelog.html', match: 'swaro-changelog.html' }
      ],
      cta: { label: 'Start free trial', href: base + 'products/swaro-pricing.html#download' },
      urls: {
        /* Hosted checkout link from the payment provider. The device code is
           appended as checkout[custom][device_code]; adjust that parameter in
           the checkout code below to match the provider once one is chosen. */
        checkout: ''
      }
    },
    {
      key: 'jigsaw',
      name: 'Jigsaw',
      icon: '',
      home: base + 'products/jigsaw.html',
      pages: ['jigsaw.html'],
      links: [
        { label: 'Overview', href: base + 'products/jigsaw.html', match: 'jigsaw.html' }
      ],
      cta: { label: 'Get Jigsaw', href: base + 'products/jigsaw.html#download' },
      urls: {
        /* Direct link to the release APK, e.g. .../releases/latest/download/jigsaw.apk */
        android: 'https://github.com/GulshanLabs/jigsaw-puzzle/releases/latest/download/jigsaw-puzzle.apk',
        /* The public GitHub repository */
        source: 'https://github.com/GulshanLabs/jigsaw-puzzle'
      }
    }
  ];

  function productByKey(key) {
    for (var i = 0; i < CATALOGUE.length; i++) if (CATALOGUE[i].key === key) return CATALOGUE[i];
    return null;
  }
  function productForPage(file) {
    for (var i = 0; i < CATALOGUE.length; i++) if (CATALOGUE[i].pages.indexOf(file) !== -1) return CATALOGUE[i];
    return null;
  }
  /* Resolves "swaro.checkout" to that product's URL, or '' when not set yet. */
  function catalogueUrl(ref) {
    var parts = String(ref).split('.');
    var product = productByKey(parts[0]);
    return product && product.urls && product.urls[parts[1]] ? product.urls[parts[1]] : '';
  }

  /* The N is a geometric glyph, drawn from primitives (no font outlines embedded). The two vertical
     stems follow the text colour (dark ink on light backgrounds, white on dark) via --wm-stem; the
     middle diagonal is always bright cyan (#03a9f5) so the letterform pops. role="img" + aria-label
     keeps the name accessible. */
  var wordmark =
    '<span class="wm" role="img" aria-label="Nousvara">' +
      '<svg class="wm-n" viewBox="0 0 87 100" aria-hidden="true" focusable="false">' +
        '<rect class="wm-n-stem" x="0" y="0" width="18" height="100"/>' +
        '<rect class="wm-n-stem" x="69" y="0" width="18" height="100"/>' +
        '<polygon class="wm-n-diag" points="18,0 37,0 87,100 69,100"/>' +
      '</svg>OUSVARA</span>';

  var navHTML =
    '<nav class="nav" id="nav"><div class="container nav-container">' +
      '<a href="' + home + '" class="nav-logo" aria-label="Nousvara — home">' + wordmark + '</a>' +
      '<button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links"><span></span><span></span><span></span></button>' +
      '<ul class="nav-links" id="nav-links">' +
        '<li><a href="' + products + '"' + current(page === 'products.html' || inProducts) + '>Products</a></li>' +
        '<li><a href="' + philosophy + '"' + current(page === 'philosophy.html' || page === 'method.html') + '>Philosophy</a></li>' +
        '<li><a href="' + about + '"' + current(page === 'about.html') + '>About</a></li>' +
        '<li><a href="' + contact + '" class="btn-nav">Get in touch</a></li>' +
      '</ul>' +
    '</div></nav>';

  /* ---- Product-aware header (Zoho-style product sub-nav) -------------------- */
  var product = productForPage(page);
  var productNavHTML = '';
  if (product) {
    var pIcon = product.icon
      ? '<img class="pnav-icon" src="' + product.icon + '" alt="" aria-hidden="true">'
      : '';
    var pLinks = product.links.map(function (l) {
      return '<li><a href="' + l.href + '"' + current(page === l.match) + '>' + l.label + '</a></li>';
    }).join('');
    productNavHTML =
      '<nav class="nav pnav" id="nav"><div class="container nav-container">' +
        '<div class="pnav-brand">' +
          '<a href="' + home + '" class="pnav-home" aria-label="Nousvara — home">' + wordmark + '</a>' +
          '<span class="pnav-sep" aria-hidden="true"></span>' +
          '<a href="' + product.home + '" class="pnav-product" aria-label="' + product.name + ' — overview">' + pIcon + '<span>' + product.name + '</span></a>' +
        '</div>' +
        '<button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links"><span></span><span></span><span></span></button>' +
        '<ul class="nav-links" id="nav-links">' +
          pLinks +
          '<li><a href="' + products + '">All products</a></li>' +
          '<li><a href="' + product.cta.href + '" class="btn-nav">' + product.cta.label + '</a></li>' +
        '</ul>' +
      '</div></nav>';
  }

  var iconEmail = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 6 9-6"></path></svg>';
  var iconLocation = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>';

  var footerProducts = CATALOGUE.map(function (p) {
    return '<a href="' + p.home + '">' + p.name + '</a>';
  }).join('');

  var year = new Date().getFullYear();
  var footerHTML =
    '<footer class="footer"><div class="container">' +
      '<div class="footer-top">' +
        '<div><div class="footer-logo">' + wordmark + '</div>' +
        '<p>An independent software studio building private, offline-first tools, grounded in twenty years of embedded, IoT and cloud engineering.</p></div>' +
        '<div class="footer-col"><h5>Products</h5>' +
          footerProducts +
          '<a href="' + products + '">All products</a></div>' +
        '<div class="footer-col"><h5>Studio &amp; policies</h5>' +
          '<a href="' + philosophy + '">Philosophy</a>' +
          '<a href="' + method + '">The Unlearn First method</a>' +
          '<a href="' + about + '">About</a>' +
          '<a href="' + privacy + '">Privacy policy</a>' +
          '<a href="' + terms + '">Terms &amp; license</a>' +
          '<a href="' + refund + '">Refund policy</a></div>' +
        '<div class="footer-col"><h5>Contact</h5>' +
          '<div class="footer-contact" aria-label="Contact Nousvara" style="flex-direction:column;align-items:flex-start;gap:12px;">' +
            '<a href="mailto:contact@nousvara.com">' + iconEmail + '<span>contact@nousvara.com</span></a>' +
            '<span>' + iconLocation + '<span>Gurugram, India · building globally</span></span>' +
          '</div></div>' +
      '</div>' +
      '<div class="footer-bottom"><span class="made">Built in India, <b>for people everywhere.</b></span>' +
      '<span>© ' + year + ' Nousvara. All rights reserved.</span></div>' +
    '</div></footer>';

  var navMount = document.getElementById('site-nav');
  if (navMount) {
    navMount.insertAdjacentHTML('beforebegin', productNavHTML || navHTML);
    navMount.parentNode.removeChild(navMount);
  }
  var footMount = document.getElementById('site-footer');
  // Pages ship the footer in their HTML (see sources/build_static.py)
  // so crawlers that do not run JavaScript still see the policy and contact
  // links. Only fill it in when a page has none, e.g. a newly added page.
  if (footMount && !footMount.children.length) footMount.innerHTML = footerHTML;

  var main = document.querySelector('main');
  if (main && !main.id) main.id = 'main-content';
  if (main && !document.querySelector('.skip-link')) {
    var skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main-content';
    skip.textContent = 'Skip to main content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  /* ---- Catalogue links: show a link only once its URL exists ---------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-link]'), function (el) {
    var url = catalogueUrl(el.getAttribute('data-link'));
    if (!url) return;
    el.setAttribute('href', url);
    el.hidden = false;
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-link-missing]'), function (el) {
    if (catalogueUrl(el.getAttribute('data-link-missing'))) el.hidden = true;
  });

  /* ---- Swaro checkout ---------------------------------------------------------
     A Swaro license is bound to one device, so the buyer's device code must
     reach us with the order. It is checked here with the same checksum the app
     uses, so a mistyped code is caught before anyone pays, then passed to the
     payment provider with the order. Until the checkout link is
     configured, the same button sends an email with the code filled in. */
  var DEVICE_CODE = /^SWD1-(WIN|MAC|LNX)-((?:[0-9A-F]{4}-){10})([0-9A-F]{8})$/;
  function deviceChecksum(tag, identifier) {
    var bytes = new TextEncoder().encode('swaro-device-checksum-v1\u0000' + tag + '\u0000' + identifier);
    return crypto.subtle.digest('SHA-256', bytes).then(function (digest) {
      return Array.prototype.map.call(new Uint8Array(digest).slice(0, 4), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('').toUpperCase();
    });
  }
  /* Resolves to '' for an empty code, the cleaned code when valid, or null. */
  function checkDeviceCode(raw) {
    var code = String(raw || '').replace(/\s+/g, '').toUpperCase();
    if (!code) return Promise.resolve('');
    var match = DEVICE_CODE.exec(code);
    if (!match) return Promise.resolve(null);
    // Without Web Crypto (very old browsers, or http:// pages) the shape check
    // alone is used; the code is validated again when the key is issued.
    if (!window.crypto || !crypto.subtle || !window.TextEncoder) return Promise.resolve(code);
    var identifier = match[2].replace(/-/g, '');
    return deviceChecksum(match[1], identifier).then(function (sum) {
      return sum === match[3] ? code : null;
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-checkout]'), function (form) {
    var input = form.querySelector('input');
    var message = form.querySelector('.checkout-msg');
    var url = catalogueUrl(form.getAttribute('data-checkout') + '.checkout');
    var live = form.querySelector('[data-checkout-live]');
    var interim = form.querySelector('[data-checkout-interim]');
    if (live) live.hidden = !url;
    if (interim) interim.hidden = !!url;

    function say(text, isError) {
      if (!message) return;
      message.textContent = text;
      message.classList.toggle('error', !!isError);
    }
    if (input) {
      input.addEventListener('input', function () {
        input.removeAttribute('aria-invalid');
        say('', false);
      });
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      checkDeviceCode(input ? input.value : '').then(function (code) {
        if (code === null) {
          input.setAttribute('aria-invalid', 'true');
          say('That device code does not look right. Copy it again from Swaro → Settings → License — it starts with SWD1-.', true);
          input.focus();
          return;
        }
        var target;
        if (url) {
          target = url + (url.indexOf('?') === -1 ? '?' : '&') +
            (code ? 'checkout%5Bcustom%5D%5Bdevice_code%5D=' + encodeURIComponent(code) : '');
        } else {
          target = 'mailto:contact@nousvara.com?subject=' + encodeURIComponent('Swaro lifetime license') +
            '&body=' + encodeURIComponent('I would like to buy a Swaro lifetime license ($29).\n\nDevice code: ' + (code || '(I will send it later)') + '\n');
        }
        window.location.href = target;
      });
    });
  });

  /* ---- Swaro demo: a looping, captioned walkthrough of both directions ------
     Built from HTML rather than video so it weighs a few kilobytes and stays
     sharp. It pauses when off screen and stays still for reduced motion. */
  Array.prototype.forEach.call(document.querySelectorAll('.swaro-demo'), function (demo) {
    var typed = demo.querySelector('.demo-typed');
    var sentence = typed ? typed.getAttribute('data-text') : '';
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var stages = ['listen', 'type', 'select', 'speak'];
    var timers = [];
    var running = false;

    function clear() { timers.forEach(clearTimeout); timers = []; }
    function stage(name) {
      stages.forEach(function (s) { demo.classList.toggle('is-' + s, s === name); });
      Array.prototype.forEach.call(demo.querySelectorAll('[data-step]'), function (step) {
        var on = step.getAttribute('data-step').split(' ').indexOf(name) !== -1;
        step.classList.toggle('active', on);
      });
    }
    function later(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function cycle() {
      if (!running) return;
      typed.textContent = '';
      stage('listen');
      later(2200, function () {
        stage('type');
        var i = 0;
        (function next() {
          if (!running) return;
          typed.textContent = sentence.slice(0, ++i);
          if (i < sentence.length) later(38, next);
          else later(1300, function () {
            stage('select');
            later(1400, function () {
              stage('speak');
              later(3400, cycle);
            });
          });
        })();
      });
    }
    function start() { if (running) return; running = true; cycle(); }
    function stop() { running = false; clear(); }

    if (still || !typed) {
      if (typed) typed.textContent = sentence;
      stage('speak');
      return;
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { entry.isIntersecting ? start() : stop(); });
      }, { threshold: 0.3 }).observe(demo);
    } else {
      start();
    }
  });

  /* ---- Playable mini puzzle (Jigsaw page) ------------------------------------
     The same rule as the app: tap one piece, then another, to swap them. Pieces
     are buttons, so it also works from the keyboard (Tab, then Enter or Space). */
  Array.prototype.forEach.call(document.querySelectorAll('.mini-puzzle'), function (root) {
    var board = root.querySelector('.mp-board');
    var movesEl = root.querySelector('.mp-moves');
    var status = root.querySelector('.mp-status');
    var reset = root.querySelector('.mp-shuffle');
    var size = parseInt(board.getAttribute('data-size'), 10) || 3;
    var image = board.getAttribute('data-image');
    var count = size * size;
    var order = [];     // order[slot] = the piece shown in that slot
    var picked = -1;
    var moves = 0;
    board.style.gridTemplateColumns = 'repeat(' + size + ', 1fr)';

    function solved() {
      for (var i = 0; i < count; i++) if (order[i] !== i) return false;
      return true;
    }
    function shuffle() {
      order = [];
      for (var i = 0; i < count; i++) order.push(i);
      // Fisher-Yates, repeated until at least one piece is out of place. Any
      // arrangement can be solved by swapping, so no solvability check is needed.
      do {
        for (var j = count - 1; j > 0; j--) {
          var k = Math.floor(Math.random() * (j + 1));
          var t = order[j]; order[j] = order[k]; order[k] = t;
        }
      } while (solved());
      moves = 0; picked = -1;
      board.classList.remove('solved');
      if (status) { status.textContent = 'Tap a piece, then another, to swap them.'; status.classList.remove('win'); }
      render();
    }
    function render() {
      board.innerHTML = '';
      order.forEach(function (piece, slot) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'mp-piece';
        var row = Math.floor(piece / size), col = piece % size;
        b.style.backgroundImage = 'url("' + image + '")';
        b.style.backgroundSize = (size * 100) + '% ' + (size * 100) + '%';
        b.style.backgroundPosition = (col / (size - 1) * 100) + '% ' + (row / (size - 1) * 100) + '%';
        b.setAttribute('aria-label', 'Piece ' + (piece + 1) + ', in position ' + (slot + 1));
        b.setAttribute('aria-pressed', slot === picked ? 'true' : 'false');
        b.disabled = board.classList.contains('solved');
        b.addEventListener('click', function () { tap(slot); });
        board.appendChild(b);
      });
      if (movesEl) movesEl.textContent = moves;
    }
    function tap(slot) {
      if (picked === -1) { picked = slot; render(); board.children[slot].focus(); return; }
      if (picked !== slot) {
        var t = order[picked]; order[picked] = order[slot]; order[slot] = t;
        moves++;
      }
      picked = -1;
      if (solved()) {
        board.classList.add('solved');
        if (status) { status.textContent = 'Solved in ' + moves + ' move' + (moves === 1 ? '' : 's') + '. The app does this with your own photos.'; status.classList.add('win'); }
      }
      render();
      if (!board.classList.contains('solved')) board.children[slot].focus();
    }
    if (reset) reset.addEventListener('click', shuffle);
    shuffle();
  });

  /* Lightbox: click any .zoomable image to view it large; Esc or click to close. */
  (function () {
    var zoomables = document.querySelectorAll('img.zoomable, .zoomable img');
    if (!zoomables.length) return;
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<button class="lightbox-close" aria-label="Close">\u2715</button><img alt=""><p class="lightbox-hint">Click anywhere or press Esc to close</p>';
    document.body.appendChild(box);
    var big = box.querySelector('img');
    var closeButton = box.querySelector('.lightbox-close');
    var lastFocus = null;
    var inertNodes = [];
    function open(src, alt) {
      lastFocus = document.activeElement;
      big.src = src; big.alt = alt || '';
      inertNodes = [];
      Array.prototype.forEach.call(document.body.children, function (child) {
        if (child !== box && !child.inert) { child.inert = true; inertNodes.push(child); }
      });
      box.classList.add('open');
      closeButton.focus();
    }
    function close() {
      box.classList.remove('open'); big.src = '';
      inertNodes.forEach(function (node) { node.inert = false; });
      inertNodes = [];
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    zoomables.forEach(function (img) {
      img.classList.add('zoomable');
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.addEventListener('click', function () { open(img.currentSrc || img.src, img.alt); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img.currentSrc || img.src, img.alt); }
      });
    });
    box.addEventListener('click', close);
    box.querySelector('img').addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { e.preventDefault(); closeButton.focus(); }
    });
  })();

  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    function setOpen(open) {
      links.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    toggle.addEventListener('click', function () { setOpen(!links.classList.contains('active')); });
    links.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('click', function (event) {
      if (links.classList.contains('active') && !toggle.contains(event.target) && !links.contains(event.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && links.classList.contains('active')) { setOpen(false); toggle.focus(); }
    });
  }
})();
