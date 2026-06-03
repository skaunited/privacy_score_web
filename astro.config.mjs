// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical host is www (Cloudflare also redirects apex → www). All Astro-emitted
// URLs (sitemap, canonical, hreflang, og:url) must use this exact origin so the
// site has a single, search-engine-visible identity.
const SITE = 'https://www.privacyscore.fr';

// Excluded routes from the sitemap:
//  - The root `/` is a client-side language sniffer that 0-meta-refreshes to /fr/.
//    It has <meta name="robots" content="noindex"> so we must NOT advertise it.
//  - /404/ is a static error page and must never appear in the sitemap.
const excludedSitemapUrls = new Set([
  `${SITE}/`,
  `${SITE}/404/`,
]);

// 301 redirects for the FR slug rename (2026-06-01).
//
// Background: the FR legal pages briefly used English slugs
// (/fr/legal-notice/, /fr/privacy-policy/, /fr/terms-of-use/) as a temporary
// workaround for the naive language switcher. The slugs are now native French
// (/fr/mentions-legales/, /fr/politique-de-confidentialite/, /fr/cgu/) for
// better French SEO. Any inbound link, sitemap snapshot, or AI-Overview
// citation pointing at the old URLs lands on the right page.
//
// Astro emits these as static `<meta http-equiv="refresh" content="0; url=...">`
// stubs at build time (since output: 'static' has no server to issue a real
// 301). Nginx will be configured to emit proper 301s server-side as well; the
// meta-refresh is the belt-and-braces fallback if the Nginx rule is missed.
// `trailingSlash: 'always'` is set below, so only the trailing-slash variants
// belong here. Nginx will canonicalize non-trailing-slash inbound paths to
// the trailing-slash form before they ever hit the static file lookup.
const REDIRECTS = {
  '/fr/legal-notice/':    '/fr/mentions-legales/',
  '/fr/privacy-policy/':  '/fr/politique-de-confidentialite/',
  '/fr/terms-of-use/':    '/fr/cgu/',
};

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,

  // prefetch disabled on purpose. Astro's prefetch ships a client module that
  // builds <link rel="prefetch"> via a viewport IntersectionObserver + hover
  // setTimeout debounces. Safari ignores rel="prefetch" and falls back to
  // fetch(), so on iOS this downloads next-page HTML in the background as
  // links scroll into view — background network churn during scroll, for no
  // real gain on a site whose pages are < 120 KB and already navigate
  // instantly. Turning it off also removes the last setTimeout +
  // IntersectionObserver from the shipped JS (the homepage's own JS is just a
  // ~0.5 KB click handler for the feature tabs). Re-enable only if a real
  // navigation-latency need appears.
  prefetch: false,

  // Map old FR slugs to their new native-French slugs.
  redirects: REDIRECTS,

  build: {
    format: 'directory',
    // 'always' inlines every CSS bundle into the page <head>. On a marketing
    // site where each route is a single document, this eliminates one
    // render-blocking stylesheet request and improves LCP. Trade-off: pages
    // get slightly larger HTML, but we ship only ~10 routes and the CSS
    // per page is small (Tailwind + a couple of section overrides).
    inlineStylesheets: 'always',
  },

  // Astro's built-in i18n. We always prefix the URL with the locale so that
  // /fr/ and /en/ are both first-class. The bare `/` route is implemented
  // separately as a client-side Accept-Language sniffer with a noindex meta —
  // so we must disable Astro's automatic root→/fr/ redirect to let our own
  // `src/pages/index.astro` win.
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  vite: {
    build: {
      cssCodeSplit: true,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-FR',
          en: 'en-US',
        },
      },
      filter: (page) => !excludedSitemapUrls.has(page),
    }),
  ],
});
