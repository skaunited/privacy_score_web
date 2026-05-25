# Privacy Score — Marketing Site

> Static, bilingual (FR + EN) marketing site for the iOS app **Privacy Score**.
> Built with Astro 5.x, no tracker, no cookie, no analytics — same ethos as the app it advertises.

**Live target:** `https://privacyscore.fr` (FR default at `/fr/`, EN at `/en/`)

---

## 1. What this repo is

A static SSG (Server-Side Generated) website. After `pnpm build`, everything in `dist/` is plain HTML / CSS / JS / images that can be served by any static host — no Node runtime, no database, no server-side rendering.

The site implements **variation-illustrated.html** from the Claude Design handoff bundle (in `privacy-score-web-design/`), pixel-perfect, bilingual, with full SEO + structured data + accessibility instrumentation.

### Stack at a glance

| Concern | Choice |
|---|---|
| Framework | Astro 5.18 (static output) |
| Languages | TypeScript (strict) + Astro components |
| Styling | Two global CSS files copied verbatim from the design handoff — `ds.css` (design tokens) + `site.css` (component styles). No Tailwind, no CSS-in-JS. |
| Component-scoped styles | Three Astro components ship their own scoped `<style>` block (`StoryboardSection`, `AnglesSection`, `ManifestoSection`) for design isolation. |
| i18n | Astro built-in `i18n` config, `prefixDefaultLocale: true`, locales `fr` (default) + `en`. Dictionaries in JSON. |
| Routing | Static prerendered HTML, trailing-slash always |
| Animations | One 4 KB vanilla JS module (`src/assets/site.js`) — scroll reveals, animated counters, gauge stroke draw, parallax. No GSAP/Lottie/Framer/Motion. |
| Build tools | pnpm 11, `@astrojs/check` for TS, `@astrojs/sitemap` for sitemap-index |
| Total client JS shipped | **~2.24 KB raw / 1.01 KB gzip** |

---

## 2. Project layout

```
Privacy Score Web/
├── APP_RECAP.md                  ← upstream: verified product facts (don't claim anything not in here)
├── README.md                     ← you are here
├── SEO.md                        ← SEO inventory + confidence rating + roadmap
├── DEPLOY.md                     ← manual-upload deploy guide for your own server
│
├── astro.config.mjs              ← Astro config (i18n, sitemap, build)
├── package.json                  ← pnpm deps (4 direct)
├── pnpm-workspace.yaml           ← allowBuilds for esbuild + sharp
├── tsconfig.json                 ← strict + path aliases
├── .npmrc, .gitignore
│
├── src/
│   ├── env.d.ts                  ← Astro types
│   │
│   ├── styles/                   ← GLOBAL CSS — do not modify, kept as-is from design
│   │   ├── ds.css                ← design tokens (433 lines)
│   │   └── site.css              ← component styles (1051 lines)
│   │
│   ├── assets/
│   │   └── site.js               ← Vite-bundled vanilla JS (118 lines)
│   │
│   ├── i18n/
│   │   ├── utils.ts              ← Locale, Dictionary, getDictionary, hreflang helpers (166 lines)
│   │   ├── fr.json               ← French copy — extracted verbatim from design mockup (320 lines, 235 keys)
│   │   ├── en.json               ← English copy — written natively, NOT translated (329 lines, 235 keys)
│   │   └── jsonld.ts             ← 4 structured-data builders (128 lines)
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro      ← <html><head><body> + global CSS + site.js + JSON-LD slot (105 lines)
│   │
│   ├── components/
│   │   ├── SEO.astro             ← per-page meta + canonical + hreflang + OG + Twitter (159 lines)
│   │   ├── Header.astro          ← fixed pill nav + brand + 4 anchor links + EN/FR switcher + download CTA (132 lines)
│   │   ├── Footer.astro          ← 3-col grid + brand + tagline + rule + copyright (76 lines)
│   │   └── sections/
│   │       ├── HeroSection.astro             ← animated gauge + phone mockup + 3 pillars + 2 chips (192 lines)
│   │       ├── StoryboardSection.astro       ← 8 verbatim-extracted SVG panels + pivot quote (673 lines)
│   │       ├── ProductIntroSection.astro     ← chapter 02, intro grid + phone screenshot (83 lines)
│   │       ├── HowItWorksSection.astro       ← chapter 03, 3 steps (53 lines)
│   │       ├── AnglesSection.astro           ← chapter 04, 4-card grid + scoped CSS (192 lines)
│   │       ├── ManifestoSection.astro        ← chapter 05, "ne fait pas" cards + scoped CSS (156 lines)
│   │       ├── TrustQuoteSection.astro       ← in-app quote (25 lines)
│   │       ├── MetricsSection.astro          ← 4 animated counters (33 lines)
│   │       ├── FAQSection.astro              ← 5 native <details> (42 lines)
│   │       └── CTASection.astro              ← final download (44 lines)
│   │
│   └── pages/
│       ├── index.astro            ← root: noindex + Accept-Language sniffer → /fr/ or /en/ (55 lines)
│       ├── 404.astro              ← bilingual 404 (31 lines)
│       ├── fr/index.astro         ← FR homepage composition (60 lines)
│       └── en/index.astro         ← EN homepage composition (60 lines)
│
├── public/                       ← copied verbatim to dist/, served at site root
│   ├── robots.txt                ← AI-crawler allowlist, Bytespider blocked, sitemap declared
│   ├── humans.txt
│   ├── .well-known/security.txt  ← RFC 9116
│   └── assets/
│       ├── app-icon-256.png      ← favicon (256×256)
│       ├── app-icon-512.png      ← apple-touch-icon + OG image (512×512)
│       └── screen-*.png          ← 9 iPhone screenshots (1320×2868)
│
├── docs/                         ← artifacts produced by plugin agents during build
│   ├── homepage-spec.md          ← spec-architect's contract (860 lines)
│   ├── csp-policy.md             ← security-auditor's Phase-6 CSP + headers spec (211 lines)
│   └── sboms/
│       └── 2026-05.txt           ← Software Bill of Materials (453 transitive deps)
│
├── privacy-score-web-design/     ← upstream: Claude Design handoff bundle (READ-ONLY reference)
│
└── dist/                         ← build output (created by `pnpm build`, .gitignored)
```

---

## 3. Run + build

```bash
pnpm install      # installs 4 direct deps + transitive
pnpm dev          # http://localhost:4321/fr/
pnpm build        # produces dist/  (runs `astro check` first — 0 errors required)
pnpm preview      # serves dist/ locally for verification
```

**Requirements:** Node 20.3+, pnpm 11+. `pnpm-workspace.yaml` opts esbuild + sharp into running their install scripts (required by pnpm 10+).

---

## 4. The bilingual model

- **FR is the default.** URL path `/fr/...` always.
- **EN at `/en/...`.** All section keys present and validated for parity (235 scalar keys per locale).
- **Root `/`** is a `noindex` page that:
  1. Does a client-side `navigator.language` sniff → `window.location.replace('/en/')` if browser is EN, else `/fr/`
  2. Falls back to a `<meta http-equiv="refresh" content="0;url=/fr/">`
  3. Has a visible "Continuer en français · Continue in English" link pair as a no-JS fallback
- **Language switcher** in the header (round 36 × 36 pill, "EN" when on FR / "FR" when on EN) — points to the same URL on the other locale via `getAlternateLocaleUrl(locale, Astro.url.pathname)`.

### Why this matters for SEO

- Each page declares three `<link rel="alternate" hreflang="...">` tags: `fr-FR`, `en-US`, `x-default` (points to FR).
- Reciprocity is enforced and validated in `check-i18n` skill.
- The sitemap (`@astrojs/sitemap`) emits `<xhtml:link>` alternates per URL — only `/fr/` and `/en/` are listed; `/` (noindex) and `/404/` are filtered out.

---

## 5. How the homepage is composed

```
src/pages/fr/index.astro       (40 lines of glue — imports + composition)
└── BaseLayout
    ├── <SEO/> (meta, hreflang, OG, Twitter, favicon)
    ├── 4× JSON-LD scripts: WebSite, MobileApplication, Organization, FAQPage
    ├── Header  (nav + EN/FR switcher + CTA)
    ├── <main>
    │   ├── HeroSection           ← chapter intro
    │   ├── StoryboardSection     ← chapter 01 — the 8-panel narrative
    │   ├── ProductIntroSection   ← chapter 02
    │   ├── HowItWorksSection     ← chapter 03
    │   ├── AnglesSection         ← chapter 04
    │   ├── ManifestoSection      ← chapter 05
    │   ├── TrustQuoteSection
    │   ├── MetricsSection
    │   ├── FAQSection
    │   └── CTASection
    └── Footer
```

`en/index.astro` is the same file with `locale='en'` and a different dict — every section component is locale-agnostic.

---

## 6. What was built (by which plugin agent)

The user owns a custom Claude Code plugin (`privacy-score-web`) that supplied the agents and skills for every stage:

| Phase | Step | Plugin agent / skill |
|---|---|---|
| 1 — Foundation | Astro scaffold, configs | `astro-builder` skill (via `spec-orchestrator`) |
| 2 — i18n + layout | utils.ts, BaseLayout, SEO component | `i18n-manager` skill + `spec-developer` agent |
| 3a — Architecture | `docs/homepage-spec.md` | `spec-architect` agent |
| 3b — Copy | `src/i18n/{fr,en}.json` (parallel) | `copy-writer-fr` + `copy-writer-en` agents |
| 3c — Components | 12 sections + 4 pages | `spec-developer` agent |
| 3d — Animations | review + a11y fixes (no-JS fallback, prefers-reduced-motion) | `animation-designer` agent |
| 4 — SEO infra | JSON-LD, robots, security.txt | `seo-specialist` agent |
| 5 — Validation | SEO audit, security audit, i18n check, supply-chain audit | `seo-specialist` + `security-auditor` agents, `check-i18n` + `supply-chain-guard` skills |

Documentation produced as side artifacts:
- `docs/homepage-spec.md` — the architect's contract
- `docs/csp-policy.md` — exact CSP with pre-computed SHA-256 hashes (for the nginx config)
- `docs/sboms/2026-05.txt` — dependency manifest

---

## 7. Design fidelity rules

1. **Don't touch `src/styles/ds.css` or `src/styles/site.css`** — they're the design handoff CSS. Two narrow exceptions already merged: chapter etiquette block (added by spec-developer per spec) and a 14-line `prefers-reduced-motion` + no-JS fallback block (added by animation-designer for a11y).
2. **Don't regenerate the 8 storyboard SVGs** — they're verbatim extractions from `privacy-score-web-design/project/variation-illustrated.html` lines 624-1059. ~600 lines of inline SVG in `StoryboardSection.astro`. Future edits should copy-paste from the design source, never draw.
3. **No new frontend dependencies without `supply-chain-guard` review.** Current direct deps: `astro`, `@astrojs/check`, `@astrojs/sitemap`, `typescript`. That's it.
4. **No analytics, no cookies, no third-party scripts.** Brand promise. Only third-party fetch is Google Fonts CSS (`fonts.googleapis.com` + `fonts.gstatic.com`) — flagged as a v2 self-host candidate in `SEO.md`.

---

## 8. The plugin workflow (for future changes)

If you want to add a new page, blog post, or feature, **always** route through the plugin — don't edit files inline:

| Want to… | Use… |
|---|---|
| Create a new page (e.g. `/fr/about/` + `/en/about/`) | `/new-page` skill |
| Publish a blog post (one locale at a time) | `/publish-blog` skill |
| Audit SEO before publishing | `/audit-seo` skill |
| Audit security before deploying | `/audit-security` skill |
| Validate i18n parity | `/check-i18n` skill |
| Deploy to your server | `/deploy` skill (also see `DEPLOY.md`) |
| Re-run a full multi-agent build (rare) | `spec-orchestrator` agent |
| Tactical edit of a single component | `spec-developer` agent (don't edit by hand) |
| Write FR copy | `copy-writer-fr` agent (or `seo-copywriter-fr`) |
| Write EN copy | `copy-writer-en` agent (or `seo-copywriter-en`) |
| Add an animation or micro-interaction | `animation-designer` agent (or `web-animator` skill) |
| Generate App Store listing copy | `aso-iphone` skill |

The plugin also ships **3 MCP servers** wired into Claude Code: `google-search-console` (real GSC data after launch), `dataforseo` (SERP + keyword research + backlink audit), and `screaming-frog` (technical crawls).

---

## 9. Known `[UNVERIFIED]` items (must resolve before public launch)

All trace back to `APP_RECAP.md` §7 and §8:

1. **Legal entity name** — currently `Codevelop` everywhere (footer copyright, JSON-LD `Organization.legalName`, JSON-LD `MobileApplication.publisher`). APP_RECAP lists three possible names (Codevelop / Swiftlab / Skander BAHRI). Confirm and search-replace.
2. **App version** — currently `v 1.4.0` (matches design mockup); APP_RECAP says real ship is `0.0.7`. Decide which is "current" and standardize.
3. **App Store URL** — 4 `href="#"` placeholders (Header CTA, Hero primary CTA, Final CTA button, Footer App Store link). Replace with real `https://apps.apple.com/app/...`.
4. **Source code repository URL** — Footer "Code source" link is `#`. Once GitHub URL is decided, also add to `Organization.sameAs[]` in `src/i18n/jsonld.ts`.
5. **Social handles** — Mastodon + Bluesky in Footer are `#`. Same story.
6. **Legal pages** — Footer links `/legal/`, `/privacy/`, `/terms/` 404 (don't exist yet). Build them via `/new-page` skill before launch.
7. **Mailbox provisioning** — `hello@privacyscore.fr` and `security@privacyscore.fr` must be live mailboxes (Google + Apple may try to verify them).

Once those are resolved, see `DEPLOY.md` for the manual-upload deploy procedure to your own server.

---

## 10. License + credits

App and site by **Skander Bahri** / **Codevelop** (entity name pending confirmation).

Design: Claude Design handoff bundle, `variation-illustrated.html` variant — see `privacy-score-web-design/README.md`.

Build orchestration: Claude Code with the `privacy-score-web` plugin.
