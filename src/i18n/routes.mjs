/** Public route registry. English lives at /; French remains at /fr/. */
export const SITE_ORIGIN = 'https://www.privacyscore.fr';
export const PAGE_PATHS = {
  home: { en: '/', fr: '/fr/' },
  blog: { en: '/blog/', fr: '/fr/blog/' },
  about: { en: '/about/', fr: '/fr/a-propos/' },
  'legal-notice': { en: '/legal-notice/', fr: '/fr/mentions-legales/' },
  'privacy-policy': { en: '/privacy-policy/', fr: '/fr/politique-de-confidentialite/' },
  'terms-of-use': { en: '/terms-of-use/', fr: '/fr/cgu/' },
  'security-policy': { en: '/security-policy/', fr: '/fr/politique-de-securite/' },
};

// Published historical URLs only. Keep their server redirects indefinitely.
export const LEGACY_REDIRECTS = {
  ...Object.fromEntries(Object.values(PAGE_PATHS).map(({ en }) => [en === '/' ? '/en/' : `/en${en}`, en])),
  '/en/blog/iphone-permissions-guide/': '/blog/iphone-permissions-guide/',
  '/en/blog/iphone-privacy-settings-2026/': '/blog/iphone-privacy-settings-2026/',
  '/fr/legal-notice/': '/fr/mentions-legales/',
  '/fr/privacy-policy/': '/fr/politique-de-confidentialite/',
  '/fr/terms-of-use/': '/fr/cgu/',
};
