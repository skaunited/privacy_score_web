// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://privacyscore.fr';

// Excluded routes from the sitemap:
//  - The root `/` is a client-side language sniffer that 0-meta-refreshes to /fr/.
//    It has <meta name="robots" content="noindex"> so we must NOT advertise it.
//  - /404/ is a static error page and must never appear in the sitemap.
const excludedSitemapUrls = new Set([
  `${SITE}/`,
  `${SITE}/404/`,
]);

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  prefetch: true,

  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
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
