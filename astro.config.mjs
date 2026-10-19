// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_ORIGIN, LEGACY_REDIRECTS } from './src/i18n/routes.mjs';

const excluded = new Set([
  `${SITE_ORIGIN}/404/`, `${SITE_ORIGIN}/404.html`,
  ...Object.keys(LEGACY_REDIRECTS).map((path) => `${SITE_ORIGIN}${path}`),
]);
export default defineConfig({
  site: SITE_ORIGIN,
  output: 'static', trailingSlash: 'always', compressHTML: true, prefetch: false,
  // Static stubs are a fallback; deploy/redirects.nginx.conf provides real 301s.
  redirects: LEGACY_REDIRECTS,
  build: { format: 'directory', inlineStylesheets: 'always' },
  i18n: { defaultLocale: 'en', locales: ['en', 'fr'], routing: { prefixDefaultLocale: false } },
  vite: { build: { cssCodeSplit: true, assetsInlineLimit: 0 } },
  // Reciprocal hreflang lives in HTML, using explicit content equivalences.
  integrations: [sitemap({ filter: (page) => !excluded.has(page) })],
});
