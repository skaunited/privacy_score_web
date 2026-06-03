/* ===========================================================
   Privacy Score - Marketing site interactions

   DESIGN PRINCIPLE (2026 rewrite):
   This file contains ONLY genuine, event-driven interactivity.
   It does NOT control visibility, run entrance animations, drive
   scroll parallax, or use setTimeout/requestAnimationFrame tweening.

   Why: the previous version hid every section with `opacity: 0` and
   revealed it via IntersectionObserver + setTimeout, animated counters
   from 0, drew the gauge with a timer, and moved background orbs on
   every scroll frame. On mobile Safari that produced:
     - content that "appeared with a delay" as you scrolled (by design),
     - numbers stuck at 0 until JS ran,
     - scroll stutter from per-frame transform writes on blurred layers,
     - and excluded our text from LCP (opacity:0 is not an LCP candidate),
       which hurts mobile SEO.

   All visual content now renders fully and correctly in the static HTML.
   Any future entrance animation must be pure CSS (animation-timeline:
   view()), never JS timers. See site.css.
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Feature tabs — genuine click interaction, no timers, no animation loop.
  const tabs = document.querySelectorAll('.tab');
  const panes = document.querySelectorAll('.feature-pane');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle('tab-active', t === tab));
      panes.forEach((p) =>
        p.classList.toggle('feature-active', p.dataset.pane === target),
      );
    });
  });
});
