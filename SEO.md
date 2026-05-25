# SEO — Privacy Score (privacyscore.fr)

## TL;DR

- **Confidence: 7/10** (honest score — strong foundations, real gaps on E-E-A-T and verified facts)
- **Status: yellow** for production. The technical SEO and structured-data layers are clean and would ship safely today, but six known-weak items (legal entity name, App Store URL, real social/repo URLs, footer link targets, app version mismatch, single-page footprint) need decisions before the first crawl is invited via Google Search Console.
- **One-paragraph summary.** Privacy Score ships as a single bilingual landing page (`/fr/` + `/en/`) with full SEO plumbing: per-locale meta + canonical + hreflang, four JSON-LD blocks per page (`WebSite`, `Organization`, `MobileApplication`, `FAQPage`), an indexed sitemap, a robots.txt with an explicit AI-crawler allow-list (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, Applebot, MistralAI-User, meta-externalagent, plus a `Bytespider` block), `security.txt` (RFC 9116), `humans.txt`, and accessibility-grade semantic HTML. The native FR and EN copy was written by the dedicated copywriter agents (no machine translation). What it does NOT yet have: a content surface beyond one page, real (non-`#`) footer URLs, a resolved legal-entity name in structured data, AVIF screenshots, or self-hosted fonts — all known, all tracked below.

---

## What's in place

Inventory of every SEO deliverable that ships with the current `pnpm build`.

- **Per-page meta tags** — `src/components/SEO.astro` emits charset, viewport (`width=device-width, initial-scale=1, viewport-fit=cover`), dual `theme-color` (dark `#020617` + light `#F2F2F7`), `<title>`, `<meta name="description">`, `<meta name="format-detection" content="telephone=no">`. Current values:
  - FR title: `Privacy Score — Reprenez le contrôle de vos données.` (54 chars — within ≤60 budget)
  - FR description: `Un score sur 100, trois actions concrètes, aucun discours alarmiste. Privacy Score lit le Rapport de Confidentialité d'iOS, 100 % en local. Gratuit.` (152 chars — within ≤155 budget)
  - EN title: `Privacy Score — Take back control of your data.` (48 chars)
  - EN description: `See what every app on your iPhone shares behind your back. On-device analysis of Apple's App Privacy Report — a score out of 100, three fixes.` (143 chars)
- **Canonical** — Absolute URL with mandatory trailing slash (matches `astro.config.mjs` `trailingSlash: 'always'`). Each locale page is its own canonical (never points across locales).
- **hreflang strategy** — Reciprocal `fr-FR` ↔ `en-US`, plus `x-default` pointing at the FR variant. Reciprocity is also mirrored inside `sitemap-0.xml` via `<xhtml:link>` entries. Verified in `dist/sitemap-0.xml`.
- **Open Graph** — `og:type=website`, `og:site_name`, `og:locale` (`fr_FR` / `en_US`), `og:locale:alternate`, `og:title`, `og:description`, `og:url`, `og:image` (absolute, 512×512 PNG), `og:image:width/height/type/alt`.
- **Twitter Card** — `summary_large_image` with title, description, image.
- **Robots meta** — `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1` on `/fr/` and `/en/`. The root sniffer `/` carries `noindex,nofollow`. The 404 is also marked `noindex` (via BaseLayout head slot).
- **Favicon + apple-touch-icon** — `/assets/app-icon-256.png` (favicon) and `/assets/app-icon-512.png` (apple-touch-icon).
- **JSON-LD blocks** (4 per locale, emitted as separate `<script type="application/ld+json">` by `BaseLayout`):
  1. **`WebSite`** — name, url per locale, `inLanguage`, description, publisher.
  2. **`Organization`** — name, legalName (`Codevelop` — `[UNVERIFIED]`), url, logo, email (`hello@privacyscore.fr`), empty `sameAs[]` (intentional — placeholder social URLs are NOT shipped into structured data).
  3. **`MobileApplication`** — name, `operatingSystem: 'iOS 17+'`, `applicationCategory: UtilitiesApplication`, `applicationSubCategory: Privacy`, url, `inLanguage`, description, `offers` (price=0, EUR), `publisher`, `image`, `softwareVersion: '1.4.0'` (`[UNVERIFIED]` — real build is `0.0.7`). `aggregateRating` deliberately omitted (no verified App Store rating data — including a fabricated one would violate Google's rich-results policy).
  4. **`FAQPage`** — 5 question/answer items, sourced from `dict.faq.items` so the on-page `<details>`/`<summary>` UI and the structured data share one truth source.
- **Sitemap** — `/sitemap-index.xml` references `/sitemap-0.xml`, which lists exactly the two indexable URLs (`/fr/` and `/en/`) with reciprocal `<xhtml:link>` annotations. Excluded by `astro.config.mjs` filter: bare `/` (sniffer) and `/404/`.
- **`robots.txt`** — wildcard `Allow: /`, blocks `/404` and `/api/`, then an explicit positive allow-list of 14 AI/answer-engine crawlers (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Amazonbot, CCBot, cohere-ai, MistralAI-User, meta-externalagent), plus mainstream search engines, plus a single block on `Bytespider` (notoriously poor robots compliance). Sitemap pointer at bottom.
- **`security.txt`** (RFC 9116) — at `/.well-known/security.txt`. Contact = `mailto:security@privacyscore.fr`, expires `2027-05-26`, languages `fr, en`, canonical URL.
- **`humans.txt`** — author, company (`Codevelop`), country, contact, stack notes ("no tracker, no cookie, no analytics"), credits to App Privacy Report team + DuckDuckGo Tracker Radar.
- **Internal anchor navigation** — header links and hero CTAs point to in-page section ids (`#story`, `#angles`, `#manifesto`, `#download`, `#top`). Same hashes in both locales — no cross-locale links.
- **Semantic HTML** — exactly one `<h1>` per page, logical `<h2>`/`<h3>` hierarchy across the 12 sections, native `<details>`/`<summary>` for FAQ (keyboard-accessible by default), `<article>` per storyboard panel and per angle/manifesto card, `<header role="banner">`, `<footer role="contentinfo">`, `<nav aria-label>` per nav and per footer column. Every Material Icons span gets `aria-hidden="true"`.
- **Image best practices** — Hero brand mark uses `loading="eager" fetchpriority="high"` with explicit `width="256" height="256"` to prevent CLS. Below-the-fold screenshots (`screen-dashboard.png`, `screen-recommendations.png`, `screen-evolution.png`, `screen-network.png`) are `loading="lazy"`. Alt text comes from the i18n dict.
- **`prefers-reduced-motion`** — `site.js` honours it; reveal animations degrade to instant. SEO-crawler-safe: all content is rendered server-side, no JS gates visibility (a crawler that ignores JS still sees every section).
- **Locale routing** — Astro built-in i18n with `prefixDefaultLocale: true`. Root `/` is a client-side `navigator.languages` sniffer with a `meta http-equiv="refresh"` fallback to `/fr/`, explicitly `noindex,nofollow`.

---

## Confidence rating — 7/10

| Dimension | Score | Notes |
|---|---|---|
| Technical SEO foundations | 9/10 | Meta, canonical, hreflang, sitemap, robots — clean and standards-compliant. Single rendered output verified in `dist/`. |
| Structured data | 8/10 | Four schema.org types per page, all well-formed, all locale-aware. Holds back: `Organization.legalName` and `MobileApplication.publisher.name` are still `[UNVERIFIED]`; `softwareVersion` is set to a marketing-friendly `1.4.0` while the real build is `0.0.7`. |
| On-page content quality | 8/10 | Native bilingual writing by `seo-copywriter-fr` and `seo-copywriter-en`, no translation, verified via the design source. Storyboard uses US-relevant news anchors (Secret Service 2024, Strava 2018) that translate naturally for both locales. |
| Crawlability | 9/10 | Server-rendered HTML, no JS-only nav, no infinite scroll, no client-side route gating. Crawlers see the full page. Sitemap clean. |
| Performance / Core Web Vitals (predicted) | 8/10 | Critical CSS path ≈ 45 KB unminified-gzip-equivalent (12.8 KB + 32 KB CSS), single JS file `page.D1uwR3nK.js` weighs **2.24 KB** total. All below-the-fold imagery lazy. Predicted LCP < 2s if app icon is preloaded. Not yet measured with Lighthouse on production hardware — predicted, not verified. |
| Accessibility | 8/10 | Semantic landmarks, ARIA labels in dict (`nav.aria.*`, `metrics.ariaLabel`), `aria-hidden` on icons, `<details>` native a11y, focus styles inherited from `ds.css`, reduced-motion honoured. Not yet audited with axe/Lighthouse. |
| E-E-A-T signals | 4/10 | **Weakest dimension.** Single page, no author bio, no /about, no /blog, no track record, no expert citations, no `Person` schema, `Organization.legalName` unverified. Search engines have very little to corroborate "who is behind this app" beyond the bundle prefix. |
| Internationalization | 9/10 | FR + EN first-class, hreflang reciprocal, BCP-47 tags correct (`fr-FR`/`en-US`), native copy on both sides, `x-default = fr`. The root-`/` sniffer is the standard pattern. |
| Brand/entity disambiguation | 5/10 | `Organization` JSON-LD exists, but `legalName: "Codevelop"` is `[UNVERIFIED]` per `APP_RECAP.md §7` (Codevelop bundle prefix vs Swiftlab privacy-policy host vs Skander BAHRI as file author). `sameAs[]` empty until real social URLs land. Until resolved, search engines cannot anchor the entity. |
| **Overall** | **7/10** | Strong technical floor, real content gaps; production-yellow until the `[UNVERIFIED]` items are closed and a /legal surface exists. |

---

## Known weaknesses (what we accept for v1)

- **`[UNVERIFIED]` items leaking into JSON-LD.** `Organization.legalName`, `Organization.publisher.name`, `MobileApplication.publisher.name`, `MobileApplication.softwareVersion`. All three references hard-code `"Codevelop"`; the version hard-codes `"1.4.0"`. APP_RECAP §1 / §7 documents the uncertainty. **Why we ship:** the four candidate names all point to the same operator (Skander Bahri); silently swapping to a definitely-wrong legal name would be worse than carrying `[UNVERIFIED]` placeholders into a clearly time-bound first deploy.
- **9 `href="#"` placeholders per page.** The two App Store CTAs (header + hero) point at `#`; the final CTA primary button points at `#`; the footer has 5–6 placeholders (App Store, release notes, source repo, mentions légales, politique de confidentialité, CGU, Mastodon, Bluesky). **Why we ship:** the design lockup is intact and the placeholders are non-crawlable (anchor-to-self). They DO appear in the rendered HTML and a strict SEO crawler will flag them as broken navigation. Mitigation today: `Organization.sameAs[]` is empty in JSON-LD, so the placeholders never make it into structured data.
- **Single-page site.** There is no internal link graph yet — no `/blog`, no `/about`, no `/faq` standalone, no `/legal`, no `/privacy`, no `/terms`. Footer columns advertise legal pages that 404. **Why we ship:** the homepage spec (`docs/homepage-spec.md`) is explicitly scoped to phase 3; sub-pages belong to a later phase. The footer placeholder URLs avoid a 404 because they currently point at `#`, not at `/legal/`.
- **No `BreadcrumbList` JSON-LD.** Moot today — single-page site has nothing to breadcrumb. Will be re-added when sub-pages exist.
- **No `AggregateRating` on `MobileApplication`.** Deliberate omission. The app has no public App Store reviews yet; fabricating an aggregateRating violates Google's rich-results quality policy and risks a structured-data penalty.
- **Google Fonts external fetch.** `BaseLayout` includes `<link rel="preconnect">` to `fonts.googleapis.com` and `fonts.gstatic.com`. The actual font CSS is imported from Google (Manrope, JetBrains Mono, Material Icons). **Trade-off:** privacy hit (Google sees every visitor's IP), perf hit (extra DNS + TLS roundtrip), but self-hosting fonts adds ~250 KB to the deploy footprint and requires picking glyph subsets — deferred to a follow-up.
- **No image format conversion.** Phone screenshots ship as PNGs (the four `screen-*.png` assets are ~5 MB combined). They are `loading="lazy"` so they don't hit LCP, but on slow connections the angles section will be heavy. AVIF + WebP via Astro `<Image />` would cut this 70–80%.
- **App version mismatch.** Design renders `v 1.4.0 · iOS 17+` in the footer and the same `1.4.0` appears in `MobileApplication.softwareVersion`. The real shipping build per `APP_RECAP §1` is `0.0.7` (build 7). The mismatch is intentional and flagged for user decision — but it does leak into structured data.
- **No per-locale `og:image`.** Both FR and EN reuse `/assets/app-icon-512.png` (the app icon, square, language-neutral). A locale-specific social card with a translated headline would lift social-share CTR but is a Phase 4 item.
- **Critical-path CSS volume.** `index.HiGDxPqD.css` (the chapter/storyboard/angles/manifesto scoped CSS) is 32 KB unminified. Astro's `inlineStylesheets: 'auto'` may inline it; on first paint this is fine, but it's a candidate for splitting if a second page reuses only part of it.

---

## Next-step recommendations (prioritized)

| # | Action | Impact | Effort | Why |
|---|---|---|---|---|
| 1 | **Resolve `[UNVERIFIED]` items** — confirm legal entity (Codevelop vs Swiftlab vs Skander Bahri), real `softwareVersion`, real App Store URL, real social handles. Update `src/i18n/jsonld.ts` (`organizationJsonLd`, `softwareApplicationJsonLd`) and the footer. | HIGH | S | Every downstream SEO/E-E-A-T improvement depends on the entity being anchored. Search engines cross-check `legalName` against open data sources (Sirene/OpenCorporates). |
| 2 | **Replace `href="#"` placeholders** with real URLs (9 per page). Real App Store link unlocks the primary CTA path, the `MobileApplication.downloadUrl` field, and removes the only broken-link signal in the build. | HIGH | S | A working primary CTA is the single most valuable action you can take. |
| 3 | **Add `/legal/`, `/privacy/`, `/terms/` static pages** in FR and EN. APP_RECAP §7 already inventories the LCEN art. 6 III + RGPD art. 13 content needed. Use the `astro-builder` skill. | HIGH | M | Footer already links to them (currently `#`). Mandatory for French compliance; also unlocks an internal link graph. |
| 4 | **Self-host the three font families** (Manrope, JetBrains Mono, Material Icons subset). Drop the external Google fetch. Use Astro's font-face inlining + `font-display: swap`. | MEDIUM | M | Privacy story consistency (the marketing site contacts a third party every visit while claiming "no tracker, no cookie, no analytics" in humans.txt) and a measurable LCP win. |
| 5 | **Convert phone screenshots PNG → AVIF + WebP** via Astro `<Image />`. The four screenshots in `public/assets/screen-*.png` are the heaviest static assets. | MEDIUM | M | ~80% byte reduction on the angles section. Below-the-fold so it doesn't move LCP, but improves the "soft" CWV (data savings, mobile UX on slow 4G). |
| 6 | **Launch a `/fr/blog/` + `/en/blog/`** via Astro Content Collections. Use the `publish-blog` skill (already configured) — one post per week per locale, starting with topics in the storyboard (Strava heatmap 2018, Secret Service 2024 reporting, App Privacy Report explainer). | MEDIUM | L | Opens up keyword surface area — currently the site competes only on `privacy score iphone` / `audit confidentialité iphone`. A blog is the single biggest E-E-A-T lever (item 7/10 → 8/10). |
| 7 | **Add `BreadcrumbList` JSON-LD** to every sub-page as soon as sub-pages exist. | LOW | S | Standard schema.org practice; no value while the site is one page. |
| 8 | **Add real `AggregateRating` on `MobileApplication`** once the App Store has reviews. Pull via Apple's iTunes Lookup API (the `CustomNetwork` module already exists in the iOS app — APP_RECAP §4). | MEDIUM | S | Rich snippets in the SERP (yellow stars). Only ethical once verified data exists. |
| 9 | **Per-locale `og:image`** — generate a 1200×630 OG card per page per locale at build time. Astro's `@vercel/og` or a Satori-based generator. | LOW | M | Social-share CTR. Less critical than items 1–6. |
| 10 | **Submit sitemap to GSC** (`google-search-console` MCP `list_sitemaps` + verify property) and Bing Webmaster Tools. | HIGH | S | Indexing only happens after submission. The plugin already ships the GSC MCP — use it. |
| 11 | **Set up GSC monitoring** via the GSC MCP. Schedule a weekly `weekly_seo_report` via the `schedule` skill. | HIGH | S | Detects ranking regressions, indexing coverage drops, CTR anomalies. Zero ongoing effort once scheduled. |
| 12 | **Add `MobileApplication.screenshot` array** pointing at the four phone screenshot PNGs (absolute URLs). | LOW | S | Eligible for App rich result tile in SERP. Trivial to add to `softwareApplicationJsonLd`. |
| 13 | **Add `Article` + `Person` schema** when the blog launches. `Person` carries author E-E-A-T weight. | MEDIUM | S | Pairs with item 6. |
| 14 | **GEO/AEO (answer-engine optimization).** AI Overviews / Perplexity / Claude prefer crisp factual leads over the current dramatic hero. Add a 1–2-sentence factual lead near the top of `/fr/` and `/en/` that summarizes "what Privacy Score is" in answer-engine prose. Also consider rephrasing `WebSite.description` in JSON-LD as a one-sentence factual summary (the current value is the marketing meta-description — fine for SERP, less ideal for AI quoting). | MEDIUM | S | The robots.txt already opens the door to GPTBot, ClaudeBot, Perplexity, etc. Capitalize on that with prose those crawlers will quote cleanly. |

---

## Tooling already configured in the plugin (use these on next iterations)

- **`dataforseo` MCP** — keyword research (`dataforseo_labs_google_keyword_suggestions`, `_keyword_overview`), SERP analysis (`serp_organic_live_advanced`), backlink monitoring (`backlinks_summary`, `backlinks_bulk_new_lost_backlinks`), AI-search visibility (`ai_opt_llm_ment_search` for ChatGPT/Perplexity mentions).
- **`google-search-console` MCP** — `performance_overview`, `quick_wins`, `top_movers`, `weekly_seo_report`, `indexing_coverage`, `inspect_url`, `cannibalization`, `content_decay`. Use after first 7-day crawl window.
- **`screaming-frog` MCP** — `crawl_site` post-deploy to validate the live build, then `read_crawl_data` for broken-link reports and meta sanity.
- **`audit-seo` skill** — re-run on every content addition; full-site or per-page.
- **`seo-master` skill** — reference for technical SEO patterns (meta budgets, structured-data templates, hreflang reciprocity, sitemap rules, CWV targets).
- **`seo-copywriter-fr` / `seo-copywriter-en`** — for any new copy. They never translate — always native.
- **`i18n-manager` skill** — to keep `fr.json` ↔ `en.json` key parity and hreflang reciprocity validated.
- **`web-animator` skill** — for any new motion work without breaking the no-JS rendering baseline.
- **`publish-blog` skill** — orchestrates keyword research + drafting + SEO validation + commit for a single blog post in one locale.
- **`check-i18n` skill** — validates i18n setup before every deploy.

---

## How to re-validate

Three commands the user runs after any content change:

```bash
pnpm build              # build clean — produces dist/
pnpm astro check        # 0 errors expected
# Then in Claude Code:
/audit-seo              # invoke the audit-seo skill — full or per-page
```

For a deeper post-deploy verification once the site is live:

```bash
# In Claude Code, with the GSC and Screaming Frog MCPs configured:
/audit-seo              # re-run after deploy to catch any render drift
# Then run an MCP crawl:
#   mcp__plugin_privacy-score-web_screaming-frog__crawl_site
#   mcp__plugin_privacy-score-web_google-search-console__inspect_url
```

---

## Audit trail — what the seo-specialist agent did in this build

The `seo-specialist` agent (this agent) consumed the homepage spec, the meta-tag emitter (`src/components/SEO.astro`), the structured-data builders (`src/i18n/jsonld.ts`), the locale dictionaries (`src/i18n/fr.json`, `src/i18n/en.json`), the rendered build output (`dist/fr/index.html`, `dist/en/index.html`, `dist/sitemap-0.xml`, `dist/sitemap-index.xml`), the static-asset sidecars (`public/robots.txt`, `public/.well-known/security.txt`, `public/humans.txt`), the Astro build config (`astro.config.mjs`), and the verified product facts (`APP_RECAP.md`). It then cross-checked: title/description byte budgets per locale, hreflang reciprocity, sitemap completeness against the exclusion filter, JSON-LD type coverage (`WebSite`, `Organization`, `MobileApplication`, `FAQPage` — verified 4 blocks per locale), robots.txt allow-list against the published AI-crawler list (May 2026), and the propagation of `[UNVERIFIED]` flags from `APP_RECAP.md` into the structured-data layer (legalName, publisher, softwareVersion). This document is the resulting recap.
