/* Diego Navarro — site interactions.
 * Plain JavaScript, no dependencies. Recreates the behaviour of the original
 * site (hover states, hero accordion, lightbox, contact pop-up, mobile menu,
 * archive filter, autoplaying videos) on top of the static HTML. */
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;

  var LINEAR_OK = !!(window.CSS && CSS.supports && CSS.supports('transition-timing-function', 'linear(0, 1)'));
  var SPRING_04 = LINEAR_OK
    ? 'linear(0, 0.0425, 0.143, 0.2706, 0.4045, 0.5317, 0.645, 0.7409, 0.8189, 0.8801, 0.9263, 0.9599, 0.9832, 0.9986, 1.0079, 1.013, 1.015, 1.015, 1.0138, 1.0121, 1.01, 1.008, 1.0062, 1.0046, 1.0033, 1.0023, 1.0014, 1.0008, 1.0004, 1.0001, 1)'
    : 'cubic-bezier(0.25, 1, 0.5, 1)';
  var SPRING_04_MS = 423;
  var TWEEN = 'cubic-bezier(0.15, 0.45, 0.15, 1.35)';

  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }
  function closest(el, sel) { return el && el.closest ? el.closest(sel) : null; }
  function overlayRoot() { return d.getElementById('overlay') || d.body; }
  function anim(el, frames, opts) {
    if (el.animate) return el.animate(frames, opts);
    var last = frames[frames.length - 1];
    for (var k in last) el.style[k] = last[k];
    var fake = { onfinish: null, cancel: function () {} };
    setTimeout(function () { if (fake.onfinish) fake.onfinish(); }, 0);
    return fake;
  }

  /* ------------------------------------------------------------------ hover
   * Mouse/pen only (touch never produces hover), delegated so that content
   * swapped in later (archive filter) works too. */
  var HOVER_SEL = '.dn-S9bPR, .dn-hENS9, .dn-pQ0w7';
  function onHover(el, on) {
    if (on) el.classList.add('hover'); else el.classList.remove('hover');
    if (el.classList.contains('dn-S9bPR')) cardHover(el, on);
    if (el.classList.contains('dn-pQ0w7') && el.classList.contains('dn-v-fn3fmj')) presetSwap(el, on);
  }
  function hoverEvent(e, on) {
    if (e.pointerType === 'touch') return;
    var el = closest(e.target, HOVER_SEL);
    while (el) {
      if (!(e.relatedTarget && el.contains(e.relatedTarget))) {
        if (on !== el.classList.contains('hover')) onHover(el, on);
      }
      el = closest(el.parentElement, HOVER_SEL);
    }
  }
  d.addEventListener('pointerover', function (e) { hoverEvent(e, true); });
  d.addEventListener('pointerout', function (e) { hoverEvent(e, false); });

  // Home gallery card: the shooting details appear under the photo while the
  // card grows (same 0.4s overshooting tween as the original layout animation).
  function cardHover(el, on) {
    var block = null;
    for (var i = 0; i < el.children.length; i++) {
      if (el.children[i].hasAttribute('data-dn-hover-only')) block = el.children[i];
    }
    if (!block || !on) return;
    var h1 = el.getBoundingClientRect().height;
    var bh = block.getBoundingClientRect().height + 18; // block + gap + hover padding
    if (bh > 18) {
      anim(block, [{ transform: 'translateY(' + (-bh / 2).toFixed(1) + 'px)' }, { transform: 'none' }],
        { duration: 400, easing: TWEEN });
    }
    return h1;
  }

  // "Default" button: the label switches text style while hovered.
  function presetSwap(el, on) {
    var p = $('p', el);
    if (!p) return;
    var a = on ? ['dn-styles-preset-xt28ft', 'xCTKtlkmz'] : ['dn-styles-preset-t3d9tg', 'EgMhfcC4b'];
    var b = on ? ['dn-styles-preset-t3d9tg', 'EgMhfcC4b'] : ['dn-styles-preset-xt28ft', 'xCTKtlkmz'];
    if (p.classList.contains(a[0])) {
      p.classList.remove(a[0]);
      p.classList.add(b[0]);
      p.setAttribute('data-styles-preset', b[1]);
    }
  }

  /* ------------------------------------------------------------------ hero accordion (home) */
  function heroItems(box) {
    var out = [];
    for (var i = 0; i < box.children.length; i++) {
      var c = box.children[i];
      out.push(c.classList.contains('ssr-variant') && c.firstElementChild ? c.firstElementChild : c);
    }
    return out;
  }
  $$('.dn-1xdqujy').forEach(function (box) {
    var T = 'flex 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.45s ease';
    function target(e) {
      var items = heroItems(box);
      for (var i = 0; i < items.length; i++) if (e.target && items[i].contains(e.target)) return items[i];
      return null;
    }
    // (the original also ran an "enter" handler right after this one with the
    // same filter values, so a single mouseover handler is equivalent)
    box.addEventListener('mouseover', function (e) {
      var o = target(e);
      heroItems(box).forEach(function (c) {
        c.style.transition = T;
        c.style.flex = c === o ? '2 1 0%' : '0.55 1 0%';
        c.style.filter = c === o ? 'grayscale(0%)' : 'grayscale(100%)';
      });
    });
    box.addEventListener('mouseleave', function () {
      heroItems(box).forEach(function (c) { c.style.transition = T; c.style.flex = '1 1 0%'; c.style.filter = 'grayscale(100%)'; });
    });
  });

  /* ------------------------------------------------------------------ nested links */
  function go(href, target, newTab) {
    var a = d.createElement('a');
    a.href = href;
    if (newTab) a.target = '_blank'; else if (target) a.target = target;
    d.body.appendChild(a); a.click(); a.remove();
  }
  d.addEventListener('click', function (e) {
    var s = closest(e.target, '[data-nested-link][href]');
    if (!s) return;
    e.preventDefault(); e.stopPropagation();
    go(s.getAttribute('href'), s.getAttribute('target'), e.metaKey || e.ctrlKey);
  }, true);
  d.addEventListener('auxclick', function (e) {
    var s = closest(e.target, '[data-nested-link][href]');
    if (s && e.button === 1) { e.preventDefault(); go(s.getAttribute('href'), null, true); }
  }, true);
  d.addEventListener('keydown', function (e) {
    var s = closest(e.target, '[data-nested-link][href]');
    if (s && e.key === 'Enter') { e.preventDefault(); go(s.getAttribute('href'), s.getAttribute('target')); }
  });

  /* ------------------------------------------------------------------ scroll lock */
  var locks = 0;
  function lock() { if (locks++ === 0) root.style.overflow = 'hidden'; }
  function unlock() { if (--locks <= 0) { locks = 0; root.style.overflow = ''; } }

  /* ------------------------------------------------------------------ lightbox */
  function bestSrc(img) {
    var ss = img.getAttribute('srcset');
    if (!ss) return img.currentSrc || img.src;
    var parts = ss.split(',').map(function (s) { return s.trim().split(/\s+/); });
    return parts[parts.length - 1][0];
  }
  function openLightbox(el) {
    var img = $('img', el);
    if (!img || el.__dnOpen) return;
    el.__dnOpen = true;
    var w = +img.getAttribute('width') || img.naturalWidth || 1;
    var h = +img.getAttribute('height') || img.naturalHeight || 1;
    var ar = (w / h).toFixed(5) + ' / 1';
    var host = overlayRoot();
    var backdrop = d.createElement('div');
    backdrop.className = 'dn-lightbox-backdrop';
    var holder = d.createElement('div');
    holder.className = 'dn-lightbox-holder';
    var wrap = d.createElement('div');
    wrap.className = 'dn-lightbox-wrap';
    wrap.style.aspectRatio = ar;
    var box = d.createElement('div');
    box.className = 'dn-lightbox-container';
    box.style.aspectRatio = ar;
    var low = d.createElement('img');
    low.alt = img.alt || '';
    low.src = img.currentSrc || img.src;
    var hi = d.createElement('img');
    hi.alt = img.alt || '';
    hi.decoding = 'async';
    var ss = img.getAttribute('srcset');
    if (ss) { hi.srcset = ss; hi.sizes = 'min(1920px, 100vw)'; }
    hi.src = bestSrc(img);
    box.appendChild(low); box.appendChild(hi);
    wrap.appendChild(box); holder.appendChild(wrap);
    host.appendChild(backdrop); host.appendChild(holder);
    lock();

    var from = el.getBoundingClientRect();
    var to = box.getBoundingClientRect();
    function delta(a, b) {
      return 'translate(' + ((a.left + a.width / 2) - (b.left + b.width / 2)).toFixed(2) + 'px,' +
        ((a.top + a.height / 2) - (b.top + b.height / 2)).toFixed(2) + 'px) scale(' +
        (a.width / b.width).toFixed(5) + ',' + (a.height / b.height).toFixed(5) + ')';
    }
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    var opts = { duration: SPRING_04_MS, easing: SPRING_04, fill: 'both' };
    anim(box, [{ transform: delta(from, to) }, { transform: 'none' }], opts);
    anim(backdrop, [{ opacity: 0 }, { opacity: 1 }], opts);

    var closing = false;
    function close() {
      if (closing) return;
      closing = true;
      var now = el.getBoundingClientRect();
      var cur = box.getBoundingClientRect();
      anim(backdrop, [{ opacity: 1 }, { opacity: 0 }], opts);
      var a = anim(box, [{ transform: 'none' }, { transform: delta(now, cur) }], opts);
      a.onfinish = function () {
        backdrop.remove(); holder.remove();
        el.style.opacity = ''; el.style.pointerEvents = '';
        el.__dnOpen = false;
        unlock();
      };
      d.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    backdrop.addEventListener('click', close);
    box.addEventListener('click', close);
    d.addEventListener('keydown', onKey);
  }
  d.addEventListener('click', function (e) {
    var el = closest(e.target, '[data-dn-lightbox]');
    if (!el || closest(e.target, 'a[href]')) return;
    e.preventDefault();
    openLightbox(el);
  });

  /* ------------------------------------------------------------------ contact pop-up (home) */
  (function () {
    var tpl = d.getElementById('dn-contact-popup');
    if (!tpl) return;
    var fired = false, open = false, nodes = [], backdrop = null;
    function show() {
      if (open) return;
      open = true;
      var frag = tpl.content.cloneNode(true);
      nodes = Array.prototype.slice.call(frag.children);
      backdrop = $('[data-dn-popup-backdrop]', frag);
      overlayRoot().appendChild(frag);
      nodes.forEach(function (n) {
        $$('[data-dn-popup-close]', n).forEach(function (x) {
          x.addEventListener('click', hide);
          x.addEventListener('keydown', function (e) { if (e.key === 'Enter') hide(); });
        });
      });
      lock();
      if (backdrop) anim(backdrop, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'cubic-bezier(0.5, 0, 0.88, 0.77)', fill: 'both' });
    }
    function hide() {
      if (!open) return;
      var done = function () { nodes.forEach(function (n) { n.remove(); }); nodes = []; open = false; unlock(); };
      if (!backdrop) return done();
      var a = anim(backdrop, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'cubic-bezier(0.12, 0.23, 0.5, 1)', fill: 'both' });
      a.onfinish = done;
    }
    function trigger() { if (fired) return; fired = true; show(); }
    setTimeout(trigger, 20000);
    var start = window.scrollY + window.innerHeight;
    window.addEventListener('scroll', function () {
      var pos = window.scrollY + window.innerHeight;
      var mark = d.body.scrollHeight * 0.5;
      if (pos >= mark && start < mark) trigger();
    }, { passive: true });
    var t = d.getElementById('284ul1');
    if (t) t.addEventListener('click', function () { fired = true; if (open) hide(); else show(); });
  })();

  /* ------------------------------------------------------------------ mobile menu */
  (function () {
    var tpl = d.getElementById('dn-mobile-menu');
    if (!tpl) return;
    var current = null;
    function show(anchor) {
      if (current) return;
      var frag = tpl.content.cloneNode(true);
      var wrap = frag.firstElementChild;
      wrap.style.cssText = 'position:absolute;z-index:11;width:auto;height:auto;visibility:hidden;top:0;left:0';
      overlayRoot().appendChild(frag);
      var panel = $('[data-dn-menu-panel]', wrap);
      var ar = anchor.getBoundingClientRect();
      var pr = panel.getBoundingClientRect();
      var base = (wrap.offsetParent || d.body).getBoundingClientRect();
      var left = ar.left + ar.width / 2 - 71 - pr.width / 2;
      left = Math.max(20, Math.min(left, window.innerWidth - 20 - pr.width));
      var top = ar.bottom + 3.5;
      wrap.style.left = (left - base.left) + 'px';
      wrap.style.top = (top - base.top) + 'px';
      wrap.style.visibility = 'visible';
      current = wrap;
      anim(panel, [{ opacity: 0 }, { opacity: 1 }], { duration: SPRING_04_MS, easing: SPRING_04, fill: 'both' });
      var dismiss = $('[data-dn-menu-dismiss]', wrap);
      if (dismiss) dismiss.addEventListener('click', hide);
    }
    function hide() {
      if (!current) return;
      var wrap = current;
      var panel = $('[data-dn-menu-panel]', wrap);
      var a = anim(panel, [{ opacity: 1 }, { opacity: 0 }], { duration: SPRING_04_MS, easing: SPRING_04, fill: 'both' });
      a.onfinish = function () { wrap.remove(); };
      current = null;
    }
    d.addEventListener('click', function (e) {
      var hb = closest(e.target, '.dn-1c78vmq');
      if (hb) { e.preventDefault(); show(hb); }
    });
  })();

  /* ------------------------------------------------------------------ autoplay videos */
  (function () {
    var vids = $$('video[data-dn-autoplay]');
    if (!vids.length) return;
    function play(v) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    if (!('IntersectionObserver' in window)) { vids.forEach(play); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) play(en.target); else en.target.pause(); });
    });
    vids.forEach(function (v) { v.muted = true; io.observe(v); });
  })();

  /* ------------------------------------------------------------------ archive filter */
  (function () {
    var cache = {};
    function load(cat) {
      var k = cat.toLowerCase();
      if (!cache[k]) {
        cache[k] = fetch('/assets/archive/' + encodeURIComponent(k) + '.html').then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.text();
        });
        cache[k].catch(function () { delete cache[k]; });
      }
      return cache[k];
    }
    d.addEventListener('pointerover', function (e) {
      var b = closest(e.target, '[data-dn-filter]');
      if (b) load(b.getAttribute('data-dn-filter')).catch(function () {});
    });
    d.addEventListener('click', function (e) {
      var b = closest(e.target, '[data-dn-filter]');
      if (!b) return;
      var slot = closest(b, '[data-dn-archive-slot]');
      if (!slot) return;
      var cat = b.getAttribute('data-dn-filter');
      if (slot.getAttribute('data-dn-archive-current') === cat) return;
      var bp = slot.getAttribute('data-dn-archive-slot').split(',');
      load(cat).then(function (html) {
        slot.innerHTML = html.replace(/\{\{D\}\}/g, bp[0]).replace(/\{\{T\}\}/g, bp[1]).replace(/\{\{P\}\}/g, bp[2]);
        slot.setAttribute('data-dn-archive-current', cat);
      }).catch(function () {
        var map = { All: 'archive', Urban: 'archive-urban', Concert: 'archive-concert', Video: 'archive-video', Food: 'archive-food', Portrait: 'archive-portrait' };
        location.href = '/archivo-don-goa/' + map[cat];
      });
    });
  })();
})();
