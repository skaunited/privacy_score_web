---
name: web-animator
description: Performance-first web animations for the Astro site. Uses pure CSS, View Transitions API, and Motion mini (~2.5KB) only. NEVER uses GSAP, Lottie, or Framer Motion for the marketing site (too heavy, hurts Core Web Vitals). Use when adding scroll reveals, hover effects, page transitions, or micro-interactions.
when_to_use: scroll reveal, hover effect, page transition, micro-interaction, loading state, parallax
allowed-tools: Read Write Edit Glob Grep
model: inherit
paths: "**/*.astro,**/*.css,src/styles/**"
---

# Web Animator — privacyscore.fr

You add animations to the Astro site **without hurting performance**. Every animation must justify its existence. Default to CSS; reach for JavaScript only when CSS can't do it.

## Animation budget (HARD LIMITS)

| Resource | Budget | Reason |
|---|---|---|
| Total JS for animations | ≤ 3 KB gzipped | Anything more hurts INP and TBT |
| Layout-thrashing properties | NEVER | Only `transform` and `opacity` |
| Main-thread blocking | NEVER | Use `will-change` + `transform` (GPU-accelerated) |
| Animations on hover during scroll | NEVER | Causes jank |
| Reduced-motion override | ALWAYS RESPECT | `@media (prefers-reduced-motion: reduce)` |

## Stack (in order of preference)

### 1. CSS animations (default — use 90% of the time)

For: fades, slides, hover effects, loading states, button feedback, simple reveals.

```css
/* GOOD: GPU-accelerated, no JS */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease, transform 600ms ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* BAD: triggers layout */
.bad-fade {
  margin-top: 20px;          /* layout property */
  transition: margin-top 600ms;
}
```

### 2. View Transitions API (page-to-page transitions)

Use Astro's `<ClientRouter />`. Adds NO bundle weight (browser-native).

```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
```

For per-element transitions:
```astro
<img src="..." transition:name="hero-image" />
```

### 3. Motion mini (2.5 KB — for scroll-triggered animations only)

Use ONLY when CSS can't do it (sequenced reveals, scroll-linked progress). NEVER for hover or click.

```ts
// src/scripts/scroll-reveal.ts
import { inView, animate } from "motion/mini";

inView("[data-reveal]", (element) => {
  animate(
    element,
    { opacity: [0, 1], y: [40, 0] },
    { duration: 0.6, easing: "ease-out" }
  );
  return () => {}; // optional cleanup
});
```

Used in pages that need scroll reveals only:
```astro
<script>
  import("../scripts/scroll-reveal.ts");
</script>
```

## What we DO NOT use (and why)

| Library | Size | Why not |
|---|---|---|
| GSAP + ScrollTrigger | ~37 KB | Overkill for marketing site. Runs on main thread. |
| Framer Motion | ~50 KB | React-only, too heavy |
| Lottie | ~60 KB | Blocks interactivity. Use SVG animations instead. |
| AOS (Animate on Scroll) | ~29 KB | Replaceable with 10 lines of Motion mini or IntersectionObserver |
| Anime.js | ~17 KB | Worse perf than Motion mini |
| Three.js | huge | Not needed |

## Required: respect `prefers-reduced-motion`

Every animation must check this. CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For JS (Motion):
```ts
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  inView("[data-reveal]", (el) => animate(el, { opacity: [0, 1] }));
}
```

## Canonical patterns

### Pattern 1: Fade-in on scroll (most common)

CSS-only with IntersectionObserver (no Motion needed):

```astro
---
// Component
---
<div class="reveal">Content</div>

<style>
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 600ms ease, transform 600ms ease;
  }
  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
</style>

<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
</script>
```

Total cost: ~200 bytes of inline JS. No external dependency.

### Pattern 2: Hero entrance animation

Pure CSS with staggered children:

```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-content > * {
  opacity: 0;
  animation: slide-up 800ms ease-out forwards;
}
.hero-content > *:nth-child(1) { animation-delay: 0ms; }
.hero-content > *:nth-child(2) { animation-delay: 150ms; }
.hero-content > *:nth-child(3) { animation-delay: 300ms; }
```

### Pattern 3: Button hover with depth

```css
.btn {
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 200ms ease;
  will-change: transform;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.btn:active {
  transform: translateY(0);
}
```

### Pattern 4: Number counter (for stats section)

Motion mini (~2.5 KB acceptable here for the smooth counter):

```ts
import { inView, animate } from "motion/mini";

inView("[data-counter]", (el) => {
  const target = Number(el.dataset.counter);
  animate(
    { value: 0 },
    { value: target },
    {
      duration: 2,
      onUpdate: (latest) => {
        el.textContent = Math.round(latest.value).toLocaleString('fr-FR');
      }
    }
  );
});
```

### Pattern 5: Page transition with View Transitions API

Already enabled globally via `<ClientRouter />`. For specific elements:

```astro
<!-- Image that morphs across pages -->
<Image src={hero} transition:name="app-screenshot" />
```

In CSS, customize the transition:
```css
::view-transition-old(app-screenshot),
::view-transition-new(app-screenshot) {
  animation-duration: 400ms;
}
```

## What to ANIMATE on each page type

### Homepage
- Hero text: staggered fade-up (CSS, 600ms total)
- Trust section icons: fade-in on scroll
- Features cards: fade-up on scroll, 100ms stagger
- Stats counter: number animation when in view
- CTA buttons: subtle hover depth

### Feature pages
- Hero: simple fade-up
- Screenshots: fade-in on scroll
- Feature comparison table: NO animation (clarity > flair)

### Blog
- Hero image: subtle parallax (CSS `transform` + `position: sticky`)
- Heading reveals: fade-up
- Code blocks: no animation
- Tables: no animation

### NEVER animate
- Body text during scroll (kills readability)
- Navigation
- Footer links
- Forms / inputs
- Anything during page load that blocks LCP

## Performance checklist for every animation added

- [ ] Uses only `transform` and `opacity` (not `top`, `left`, `width`, etc.)
- [ ] `prefers-reduced-motion` respected
- [ ] No animation lasts > 800ms
- [ ] No more than 5 elements animate simultaneously
- [ ] No animation on elements above the fold during initial LCP window
- [ ] If using JS, total added bundle < 3 KB gzipped
- [ ] Tested at 4× CPU throttling in DevTools
- [ ] Lighthouse Performance still ≥ 95

## Related references

- [Pattern library](references/patterns.md)
- [Performance gotchas](references/performance-gotchas.md)
- Sister skill: [astro-builder](../astro-builder/SKILL.md)
