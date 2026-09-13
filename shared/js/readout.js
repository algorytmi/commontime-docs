/**
 * The live readout: §2 / commontime/1 arithmetic, in the browser.
 *
 * Ported from the Next.js client component this site replaced. The numbers
 * and the one instant are fixed here because the page is not connected to
 * anything — it derives its own tick, it does not receive one.
 *
 * BigInt throughout, as N14 requires. Number would lose the low digits of a
 * tick long before the 2^53 ceiling the page itself talks about.
 */
(function () {
  'use strict';

  var PPQ = 960;
  var BEATS_PER_BAR = 4;
  var BPM = 118;

  /** 13 September 2026, 00:00 UTC. */
  var ANCHOR_EPOCH_MS = 1789257600000;

  var PPQ_N = BigInt(PPQ);
  var BPM_N = BigInt(BPM);
  var ANCHOR_N = BigInt(ANCHOR_EPOCH_MS);
  var TICKS_PER_BAR = BigInt(PPQ * BEATS_PER_BAR);
  var MS_PER_MINUTE = 60000n;

  var THIN_SPACE = ' ';
  var HAIR_SPACE = ' ';
  var DASH = '—';

  /**
   * N14: a tick must be derived with floored division — toward negative
   * infinity — not truncation toward zero and not rounding. JavaScript's `/`
   * truncates, so the correction below is the whole point of this function.
   */
  function tickAt(nowMs) {
    var q = (BigInt(nowMs) - ANCHOR_N) * BPM_N * PPQ_N;
    var t = q / MS_PER_MINUTE;
    if (q < 0n && q % MS_PER_MINUTE !== 0n) t -= 1n;
    return t;
  }

  /** N14: the remainder used for a material position must be non-negative. */
  function floorMod(a, m) {
    var r = a % m;
    return r < 0n ? r + m : r;
  }

  function barBeat(tick) {
    var intoBar = floorMod(tick, TICKS_PER_BAR);
    return {
      bar: (tick - intoBar) / TICKS_PER_BAR,
      beat: intoBar / PPQ_N + 1n,
      intoBar: intoBar,
    };
  }

  function group(n, separator) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator || THIN_SPACE);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function cell(label, value) {
    var wrap = el('div', 'ct-cell');
    wrap.appendChild(el('dt', 'ct-lbl', label));
    var dd = el('dd', 'ct-val', value);
    wrap.appendChild(dd);
    return { node: wrap, value: dd };
  }

  /**
   * The tick is laid out one character per fixed cell, and the thousands gap
   * is an empty cell rather than a space character: a proportional-figure
   * face would otherwise shuffle the number sideways on every carry. The
   * visual copy is hidden from assistive tech, which gets the plain string —
   * read character by character, the number is noise.
   */
  function paintTick(host, text) {
    host.textContent = '';
    host.appendChild(el('span', 'ct-sr', text));
    var visual = el('span');
    visual.setAttribute('aria-hidden', 'true');
    Array.prototype.forEach.call(text, function (ch) {
      visual.appendChild(el('span', /\s/.test(ch) ? 'ct-sep' : 'ct-dg', /\s/.test(ch) ? '' : ch));
    });
    host.appendChild(visual);
  }

  function build(root) {
    var d = root.dataset;
    root.classList.add('ct-readout');
    root.setAttribute('role', 'group');
    root.setAttribute('aria-live', 'off');
    root.textContent = '';

    var heading = el('h2', 'ct-sr', d.labelRegion || 'Readout');
    root.appendChild(heading);
    root.setAttribute('aria-label', d.labelRegion || 'Readout');

    var top = el('div', 'ct-top');

    var main = el('dl', 'ct-main');
    main.appendChild(el('dt', 'ct-lbl', d.labelTick || 'Tick'));
    var tickDd = el('dd', 'ct-tick', DASH);
    main.appendChild(tickDd);
    top.appendChild(main);

    var side = el('dl', 'ct-side');
    var bar = cell(d.labelBar || 'Bar', DASH);
    var beat = cell(d.labelBeat || 'Beat', DASH);
    var meter = cell(d.labelMeter || 'Meter', BEATS_PER_BAR + '/' + BEATS_PER_BAR);
    var bpm = cell('BPM', String(BPM));
    var ppq = cell('PPQ', String(PPQ));
    [bar, beat, meter, bpm, ppq].forEach(function (c) {
      side.appendChild(c.node);
    });
    top.appendChild(side);
    root.appendChild(top);

    var sweep = el('div', 'ct-sweep');
    sweep.setAttribute('aria-hidden', 'true');
    var sweepFill = el('i');
    sweep.appendChild(sweepFill);
    root.appendChild(sweep);

    var form = el('div', 'ct-form');
    var nowSlot = el('b', null, d.formulaNow || DASH);
    var outSlot = el('b', null, DASH);
    form.appendChild(document.createTextNode((d.formulaName || 'tick') + ' = ('));
    form.appendChild(nowSlot);
    form.appendChild(
      document.createTextNode(
        ' − ' + ANCHOR_EPOCH_MS + ') × ' + BPM + ' × ' + PPQ + ' / 60000 = ',
      ),
    );
    form.appendChild(outSlot);
    root.appendChild(form);

    return {
      tick: tickDd,
      bar: bar.value,
      beat: beat.value,
      sweep: sweepFill,
      now: d.formulaNow ? null : nowSlot,
      out: outSlot,
    };
  }

  function paint(slots) {
    var nowMs = Date.now();
    var t = tickAt(nowMs);
    var bb = barBeat(t);

    paintTick(slots.tick, group(t, HAIR_SPACE));
    slots.bar.textContent = group(bb.bar);
    slots.beat.textContent = bb.beat.toString();
    slots.out.textContent = group(t);
    if (slots.now) slots.now.textContent = String(nowMs);
    slots.sweep.style.width =
      ((Number(bb.intoBar) / Number(TICKS_PER_BAR)) * 100).toFixed(2) + '%';
  }

  function start() {
    var roots = document.querySelectorAll('[data-readout]');
    Array.prototype.forEach.call(roots, function (root) {
      var slots = build(root);
      paint(slots);

      // Reduced motion gets one painted frame and then stillness, not a
      // counter that never stops moving.
      var still =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (still) return;

      setInterval(function () {
        paint(slots);
      }, 100);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
