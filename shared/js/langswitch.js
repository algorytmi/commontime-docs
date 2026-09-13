/**
 * Puts the other language in the top bar.
 *
 * Appended to the header's trailing button group rather than inserted at a
 * fixed position: appending survives the theme rearranging what sits next to
 * the theme toggle, and if the group is ever renamed the link simply does not
 * appear — no broken layout.
 */
(function () {
  'use strict';

  function mount() {
    var cfg = window.CT_LANG_SWITCH;
    if (!cfg || !cfg.label || !cfg.href) return;

    var group = document.querySelector('header .ml-auto');
    if (!group) return;

    var a = document.createElement('a');
    a.className = 'ct-lang';
    a.href = cfg.href;
    a.textContent = cfg.label;
    a.setAttribute('rel', 'alternate');
    group.appendChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
