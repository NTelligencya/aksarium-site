/* Aksarium — shared page behaviour.
   Gold multilingual script overlays fade in on scroll (never behind body copy). */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var targets = document.querySelectorAll('.script-reveal');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) { io.observe(el); });
  });
})();
