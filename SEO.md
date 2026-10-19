# SEO operating notes — October 19, 2026

This file describes the current migration and its verification process. Historical audits under `docs/` record earlier findings; they are not the live route or pricing specification. Production status must be checked after deployment.

## Public URLs and languages

The canonical origin is **https://www.privacyscore.fr**. English lives at `/` with `/blog/`, `/about/`, and the English legal paths. French stays at `/fr/`, with localized legal/about paths. `src/i18n/routes.mjs` is the shared route registry; components, canonical URLs, JSON-LD, the sitemap, and origin redirects must agree with it.

`/en/` was a valid multilingual path, not an intrinsic indexing defect. Removing it is the owner's chosen URL migration. That change does not guarantee a ranking improvement; preserve historical signals using direct 301 redirects and consistent internal links. The static redirect HTML emitted by Astro is a fallback, not a substitute for origin status codes.

Every indexable page has one absolute self-referencing canonical, a unique useful title and description, and one main heading. English and French are explicit navigable URLs; do not automatically redirect visitors by IP or browser language.

## Hreflang and the sitemap

Use `en`, `fr`, and an English `x-default` only for actual page equivalents. Each group must contain reciprocal links, including self-references. The homepage, blog index, about page, and legal equivalents have explicit route pairs.

Articles are paired only through a shared `translationKey`. The two current article groups are:

| Group | English | French |
|---|---|---|
| `export-report` | `/blog/export-app-privacy-report/` | `/fr/blog/importer-rapport-confidentialite-iphone/` |
| `empty-report` | `/blog/app-privacy-report-empty/` | `/fr/blog/rapport-confidentialite-iphone-vide/` |

The two older English posts and the two older French posts cover different subjects. They must not use each other or the other language's blog index as hreflang substitutes. A visible language switch can offer the other blog index as navigation without declaring it an equivalent article.

The sitemap contains all current indexable pages, including **four articles per language**. Exclude 404 pages, redirect stubs, and any explicitly unpublished/noindex content. The revised articles are published and indexable; no quarantine of the English blog is planned. A future draft should remain out of public routes and the sitemap; if an accessible preview uses `noindex`, verify both its directive and sitemap exclusion. Do not block a public noindex page in robots.txt while expecting crawlers to read that directive.

## Editorial and product facts

The guides answer distinct tasks: permissions, privacy settings, a general audit, reading the report, export/import, and troubleshooting an empty report. Existing article slugs and original publication dates are preserved. Show the real revision date and author, and link readers to the relevant next step.

Use accessible Apple primary documentation for iOS behavior. A source review date does not mean a physical device test was performed. Clearly identify sample screenshot values; they are neither audience statistics nor measurements representative of all users. Avoid inferring a data leak or successful tracking solely from a domain contact, or claiming the report reveals encrypted request contents.

Privacy Score analyzes an imported report locally. Network filtering depends on the configuration and provider the user approves; analysis alone does not block domains. The first analysis is free, with Premium purchases for additional functions. The owner confirms the French annual launch offer is **€23.88 for the first year**; the regular French annual renewal price is **€59.99**. The six-month launch offer is **€20.94 for the first six months**, then **€39.99/six months** at the current French renewal price. Qualify storefront and eligibility, and direct customers to Apple's final purchase terms. Do not present the introductory price as a permanent worldwide rate.

Structured data must match visible content and verified product facts. Do not invent app versions, star ratings, reviews, test results, or security guarantees. Valid JSON-LD does not by itself confer rich-result eligibility. Translated or independently written localized pages can both be useful when accurate and suited to their audience; neither workflow inherently guarantees rankings.

## Repeatable release checks

```bash
node scripts/generate-redirects.mjs
node scripts/check-redirects.mjs
pnpm build
python3 scripts/check-seo.py
node scripts/generate-redirects.mjs --check
```

The dependency-free validator reads the built HTML and XML. It checks self-canonicals, noindex/sitemap consistency, published article presence, removal of `/en/` from current destinations, exact reciprocal language groups, JSON-LD syntax, one H1 per indexable page, local resources, internal links, and fragment targets. Redirect stubs are checked against the route registry and excluded from normal page checks. Static checks do not prove Google has indexed a page or that the server returns the intended status.

`node scripts/check-redirects.mjs` exercises the generated original-request regexes, including slash, explicit-index, query-string, and canonical-loop cases. Test the merged configuration with the origin's `nginx -t`, then GET the live paths after deployment. See `DEPLOY.md` for Plesk integration, atomic releases, edge caches, consent checks, and rollback.

External links require periodic live GET checks. A confirmed final 404/410 is a repair candidate. A 403, 429, timeout, or bot challenge is **inconclusive**, not proof that a page is gone. Check both HTTP success and whether the destination supports the surrounding claim.

## Measurement after release

Search Console is the source for organic queries, impressions, clicks, CTR, position, crawl/indexing issues, and sitemap processing. DataForSEO supplies additional query/SERP context; it does not replace the site's first-party Search Console history. Establish a dated baseline before interpreting the migration.

Google Analytics requires a verified Privacy Score GA4 property, a configured measurement ID, working consent controls, and an allowed effective CSP. Separate product local processing from the website's optional analytics. Check real-time data and the App Store click event on the deployed build. An outbound click measures the transition to Apple; it is not an installation or purchase.

Review weekly for the first month: new canonical URLs, redirects, accidental noindex, landing queries, clicks, consented traffic, and App Store clicks. Compare after 28 days and again after eight weeks, using comparable periods and query/page/device/country segments. Seasonality, low sample sizes, changing search demand, and the URL migration can affect interpretation. Indexing, clicks, or ranks are not guaranteed within that period.

The site needs continued maintenance: check important external sources and offer terms monthly, update guides when iOS behavior changes, and prioritize new topics from real query and support questions. Publishing volume or a fixed word quota is not a substitute for useful, supported answers.

Reference guidance: [Google on localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions), [moving URLs](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), and [people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
