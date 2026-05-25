# Astro Performance Checklist

Run through this before EVERY production deploy. All items must be checked.

## Build configuration

- [ ] `output: 'static'` confirmed
- [ ] `inlineStylesheets: 'auto'` for small CSS
- [ ] `prefetch.prefetchAll: true, defaultStrategy: 'viewport'`
- [ ] No `client:load` directive unless above-the-fold and interactive
- [ ] All third-party scripts use `is:inline` only if absolutely necessary

## Images

- [ ] All content images use `<Image />` or `<Picture />` from `astro:assets`
- [ ] All images have explicit `width` and `height` (prevents CLS)
- [ ] Hero images use `loading="eager"`, everything else `loading="lazy"`
- [ ] AVIF + WebP formats specified for content images
- [ ] No images > 200 KB in `public/`

## Fonts

- [ ] Self-hosted fonts in `public/fonts/` (no Google Fonts CDN)
- [ ] `font-display: swap` in @font-face
- [ ] `<link rel="preload">` for the hero font
- [ ] WOFF2 format only
- [ ] No more than 2 font families

## CSS

- [ ] Tailwind purge confirmed (`content` paths cover all .astro files)
- [ ] Global CSS < 50 KB minified
- [ ] No `!important` unless overriding a third-party library
- [ ] No unused @tailwind layers

## JavaScript

- [ ] Total JS bundle (per page) < 50 KB gzipped
- [ ] No `lodash` or other large utility libraries imported globally
- [ ] Motion library used only on pages that need animation
- [ ] No analytics scripts that block render

## Lighthouse targets (mobile, slow 4G)

- [ ] Performance ≥ 95
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 95
- [ ] SEO ≥ 95

## Core Web Vitals targets

- [ ] LCP < 2.0s (target; absolute limit 2.5s)
- [ ] INP < 100ms (target; absolute limit 200ms)
- [ ] CLS < 0.05 (target; absolute limit 0.1)

## Bundle inspection

```bash
pnpm build
ls -lh dist/_astro/ | sort -k 5 -h    # Sort by size, find culprits
npx vite-bundle-visualizer            # Visual bundle inspection
```

If any single JS chunk > 30 KB, investigate.
