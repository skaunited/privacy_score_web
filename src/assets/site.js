/* ===========================================================
   Privacy Score - Marketing site interactions
   - Reveal on scroll
   - Animated counters (data-count-to)
   - Animated gauge draw + number
   - Feature tabs switcher
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ────────────────────────────────────────────────────────────
  // Reveal on scroll
  // ────────────────────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('in'), delay);
        revealIO.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealIO.observe(el));

  // ────────────────────────────────────────────────────────────
  // Counter animation
  // ────────────────────────────────────────────────────────────
  const animateCount = (el) => {
    const target = parseInt(el.dataset.countTo, 10);
    if (isNaN(target)) return;
    const duration = 1600;
    const start = performance.now();
    const startVal = 0;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const val = Math.round(startVal + (target - startVal) * easeOut(t));
      el.textContent = val.toLocaleString('fr-FR');
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('fr-FR');
    };
    requestAnimationFrame(step);
  };

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count-to]').forEach(el => counterIO.observe(el));

  // ────────────────────────────────────────────────────────────
  // Hero gauge animation (score number + ring)
  // ────────────────────────────────────────────────────────────
  const gaugeArc = document.getElementById('gaugeArc');
  const gaugeNum = document.getElementById('gaugeNum');
  if (gaugeArc && gaugeNum) {
    const targetScore = 77;
    const circ = 2 * Math.PI * 92;          // ≈ 577.9
    const targetOffset = circ * (1 - targetScore / 100);

    // Delay slightly so the hero feels alive
    setTimeout(() => {
      gaugeArc.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.30, 1)';
      gaugeArc.style.strokeDashoffset = targetOffset;

      const start = performance.now();
      const duration = 1600;
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        gaugeNum.textContent = Math.round(targetScore * eased);
        if (t < 1) requestAnimationFrame(step);
        else gaugeNum.textContent = targetScore;
      };
      requestAnimationFrame(step);
    }, 350);
  }

  // ────────────────────────────────────────────────────────────
  // Feature tabs
  // ────────────────────────────────────────────────────────────
  const tabs  = document.querySelectorAll('.tab');
  const panes = document.querySelectorAll('.feature-pane');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('tab-active', t === tab));
      panes.forEach(p => p.classList.toggle('feature-active', p.dataset.pane === target));
    });
  });

  // ────────────────────────────────────────────────────────────
  // Mild parallax on orbs (perf-cheap)
  // ────────────────────────────────────────────────────────────
  const orbs = document.querySelectorAll('.orb');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = (i % 3 + 1) * 0.04;
          orb.style.transform = `translateY(${y * speed * -1}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

});
