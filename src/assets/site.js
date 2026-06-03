/* ===========================================================
   Privacy Score - Marketing site interactions

   DESIGN PRINCIPLE:
   Genuine, event-driven interactivity only. Nothing here controls
   content VISIBILITY (all content is visible in the static HTML), runs
   scroll parallax, or uses setTimeout for animation.

   The number count-up below is an enhancement, not a dependency:
     - the final value is already in the HTML (SEO-safe, correct with no JS),
     - it animates 0 -> final ONLY when the element scrolls into view AND
       the user has not asked for reduced motion,
     - it uses requestAnimationFrame (the browser-native way to animate),
       never setTimeout, and only writes textContent (no layout-thrash, no
       blur, nothing that costs anything during scroll).
   IntersectionObserver here is cheap and was never the scroll-perf issue
   (that was blur repaints, now removed).
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ── Feature tabs — genuine click interaction ──────────────────────────
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

  // ── Number count-up (rAF, in-view, motion-aware) ──────────────────────
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const counters = document.querySelectorAll('[data-count-to]');

  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (el) => {
      const target = parseInt(el.dataset.countTo, 10);
      if (Number.isNaN(target)) return;
      const duration = 1500;
      let startTs = null;
      el.textContent = '0';
      const step = (ts) => {
        if (startTs === null) startTs = ts;
        const p = Math.min((ts - startTs) / duration, 1);
        el.textContent = String(Math.round(target * easeOut(p)));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = String(target); // exact final value
      };
      requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );

    counters.forEach((el) => io.observe(el));
  }
  // If reduced-motion or no IntersectionObserver: the HTML's final values
  // simply stay as-is. Nothing to do.

  // ── Gauge ring draw — trigger when it scrolls into view ───────────────
  // CSS owns the animation (gated behind .gauge-card.gauge-animate AND the
  // reduced-motion media query). JS only adds the trigger class once, when
  // the gauge enters the viewport, so it plays where the user can see it
  // (on mobile the gauge sits below the fold). Plays once, then static.
  const gaugeCard = document.querySelector('.gauge-card');
  if (gaugeCard && 'IntersectionObserver' in window) {
    const gaugeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('gauge-animate');
            gaugeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    gaugeObserver.observe(gaugeCard);
  }
});
