/**
 * Phase-locks the mark to the shared anchor.
 *
 * A CSS animation starts when its element is laid out, so without this every
 * reader's mark would beat in its own phase. For a mark whose whole subject is
 * getting independent clients onto one musical time, that would be a fair
 * amount of irony. The correction is what §2 of the specification prescribes:
 * derive the phase from the common anchor.
 *
 * The animation is added here rather than in the stylesheet, so a page without
 * scripting shows a still mark instead of an unsynchronised one — which is the
 * rule the mark's own documentation states for any embedding that cannot lock.
 */
(function () {
  'use strict';

  var BPM = 118;
  var BEATS_PER_BAR = 4;
  var ANCHOR_MS = 0;

  var barMs = (BEATS_PER_BAR * 60000) / BPM; // 2033.898...

  function lock(mark) {
    var beat = mark.querySelector('.ct-mark-beat');
    if (!beat) return;
    var phase = (Date.now() - ANCHOR_MS) % barMs;
    beat.style.animationDelay = -phase + 'ms';
    mark.classList.add('is-locked');
  }

  function start() {
    var marks = document.querySelectorAll('.ct-mark');
    if (!marks.length) return;

    Array.prototype.forEach.call(marks, lock);

    // A background tab throttles timers, so the animation drifts away from the
    // anchor while it is hidden. Re-anchor whenever the page comes back.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        Array.prototype.forEach.call(marks, lock);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
