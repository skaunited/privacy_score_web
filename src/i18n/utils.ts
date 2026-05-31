/**
 * i18n utilities for privacyscore.fr
 *
 * Loads static FR and EN dictionaries and exposes typed helpers
 * for routing, hreflang generation and alternate-URL discovery.
 *
 * Note on the `chapters.word` key:
 *   Both fr.json and en.json MUST expose `chapters.word` (e.g. "Chapitre" / "Chapter").
 *   That single key is consumed by the storyboard section to prefix each panel header
 *   in a locale-aware way ("Chapitre 1", "Chapter 1", …). Removing it will break the
 *   storyboard render.
 *
 * Static imports below will fail `astro check` until Phase 3a writes the JSON files.
 * That is expected and documented in the orchestrator brief.
 */

import frDict from './fr.json';
import enDict from './en.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Supported locales. `fr` is the default and primary market. */
export type Locale = 'fr' | 'en';

/**
 * Dictionary shape.
 *
 * Kept intentionally permissive for now - the dictionary will be type-narrowed
 * once Phase 3a lands the canonical JSON shape (we'll switch to
 * `typeof frDict` then).
 */
export type Dictionary = Record<string, any>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** All supported locales, ordered with the default first. */
export const LOCALES: readonly Locale[] = ['fr', 'en'] as const;

/** Default locale used by the home redirect and `x-default`. */
export const DEFAULT_LOCALE: Locale = 'fr';

/** Canonical site origin (no trailing slash). */
// Must match `site` in astro.config.mjs. Canonical host is www
// (Cloudflare also redirects apex → www); every URL emitted by SEO.astro
// - canonical, hreflang, og:url, twitter:image - derives from this constant.
export const SITE_ORIGIN = 'https://www.privacyscore.fr';

/** `<html lang>` value per locale. Use regioned tags for SEO accuracy. */
export const htmlLang: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-US',
};

/** `hreflang` attribute value per locale (regioned, mirrors `htmlLang`). */
export const hreflangTag: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-US',
};

/** `x-default` always points to the FR experience (primary market). */
export const X_DEFAULT_LOCALE: Locale = 'fr';

// ---------------------------------------------------------------------------
// Dictionaries
// ---------------------------------------------------------------------------

/** All loaded dictionaries, keyed by locale. */
export const dictionaries: Record<Locale, Dictionary> = {
  fr: frDict as Dictionary,
  en: enDict as Dictionary,
};

/**
 * Returns the dictionary for the given locale.
 * Throws (rather than silently falling back) if the locale is unknown - this
 * surfaces routing bugs at build time instead of in production.
 */
export function getDictionary(locale: Locale): Dictionary {
  const dict = dictionaries[locale];
  if (!dict) {
    throw new Error(`[i18n] Unknown locale "${locale}"`);
  }
  return dict;
}

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

/**
 * Build a locale-prefixed, trailing-slash path.
 *
 * Examples:
 *   localizedPath('fr', '')           -> '/fr/'
 *   localizedPath('fr', '/')          -> '/fr/'
 *   localizedPath('en', 'faq')        -> '/en/faq/'
 *   localizedPath('en', '/features/') -> '/en/features/'
 *   localizedPath('fr', '/fr/faq/')   -> '/fr/faq/'  (idempotent: strips an existing locale prefix)
 */
export function localizedPath(locale: Locale, path: string): string {
  // Normalize: strip leading/trailing slashes, then strip a leading locale segment if present.
  let normalized = (path || '').trim();
  normalized = normalized.replace(/^\/+/, '').replace(/\/+$/, '');

  for (const l of LOCALES) {
    if (normalized === l || normalized.startsWith(`${l}/`)) {
      normalized = normalized.slice(l.length).replace(/^\/+/, '');
      break;
    }
  }

  return normalized ? `/${locale}/${normalized}/` : `/${locale}/`;
}

/**
 * Strip the locale prefix from a path, returning the locale-neutral remainder.
 *
 * Examples:
 *   stripLocalePrefix('/fr/')        -> '/'
 *   stripLocalePrefix('/en/faq/')    -> '/faq/'
 *   stripLocalePrefix('/about/')     -> '/about/'
 */
export function stripLocalePrefix(currentPath: string): string {
  const path = currentPath || '/';
  for (const l of LOCALES) {
    if (path === `/${l}` || path === `/${l}/`) return '/';
    if (path.startsWith(`/${l}/`)) return path.slice(`/${l}`.length);
  }
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Locale-aware page slug mapping.
 *
 * Some routes have locale-native slugs (e.g. `/fr/mentions-legales/` vs
 * `/en/legal-notice/`) because the SEO win from native FR slugs on legal pages
 * is real. When a page is here, the language switcher uses it; otherwise we
 * fall back to the naive locale-prefix swap (fine for routes whose slugs
 * match across locales: blog index, security-policy).
 *
 * To add a new locale-specific slug:
 *   1. Add a new entry to `PageKey` below.
 *   2. Map it to its slug in each locale.
 *   3. The matching `.astro` page route MUST live at `src/pages/{locale}/{slug}.astro`.
 *
 * Blog POSTS are intentionally NOT mapped here: each language has different
 * blog posts (native copywriting, not translation), so a slug-to-slug map
 * does not apply. The switcher resolves blog-post paths to the locale's
 * blog index instead (see `getAlternateLocaleUrl` below).
 */
export type PageKey =
  | 'legal-notice'
  | 'privacy-policy'
  | 'terms-of-use'
  | 'about'
  | 'security-policy';

const pageSlugs: Record<Locale, Record<PageKey, string>> = {
  fr: {
    'legal-notice': 'mentions-legales',
    'privacy-policy': 'politique-de-confidentialite',
    'terms-of-use': 'cgu',
    'about': 'a-propos',
    'security-policy': 'politique-de-securite',
  },
  en: {
    'legal-notice': 'legal-notice',
    'privacy-policy': 'privacy-policy',
    'terms-of-use': 'terms-of-use',
    'about': 'about',
    'security-policy': 'security-policy',
  },
};

/**
 * Reverse lookup: given a locale and a slug (first path segment), return the
 * canonical PageKey or `null` if the slug is not in the mapping (which means
 * the page uses identical slugs across locales or is not mapped).
 */
function pageKeyFromSlug(locale: Locale, slug: string): PageKey | null {
  const map = pageSlugs[locale];
  for (const k of Object.keys(map) as PageKey[]) {
    if (map[k] === slug) return k;
  }
  return null;
}

/**
 * Build the public path for a known page in a given locale.
 * Example: `pathForPage('fr', 'legal-notice')` -> `/fr/mentions-legales/`.
 */
export function pathForPage(locale: Locale, pageKey: PageKey): string {
  return `/${locale}/${pageSlugs[locale][pageKey]}/`;
}

/**
 * Given the current locale and current path (e.g. `/fr/mentions-legales/`),
 * return entries for every OTHER locale with the equivalent URL.
 *
 * Resolution order:
 *   1. Strip the locale prefix.
 *   2. If the first segment is a known PageKey slug for the current locale,
 *      map it to the alt locale's slug for the same PageKey.
 *   3. If the path is `/blog/<post-slug>/`, send the alt locale to its blog
 *      index (`/<alt>/blog/`) because blog posts are locale-specific content.
 *   4. Otherwise fall back to the naive locale-prefix swap.
 *
 * Returned URLs are root-relative. Use {@link toAbsoluteUrl} for absolute tags.
 */
export function getAlternateLocaleUrl(
  currentLocale: Locale,
  currentPath: string,
): { locale: Locale; url: string }[] {
  const remainder = stripLocalePrefix(currentPath);
  const tail = remainder.replace(/^\/+/, '').replace(/\/+$/, '');
  const segments = tail ? tail.split('/') : [];
  const firstSeg = segments[0] ?? '';
  const rest = segments.slice(1);

  return LOCALES.filter((l) => l !== currentLocale).map((altLocale) => {
    // 1. Known PageKey slug -> map to alt locale's slug.
    const pageKey = pageKeyFromSlug(currentLocale, firstSeg);
    if (pageKey) {
      const altSlug = pageSlugs[altLocale][pageKey];
      const suffix = rest.length ? `${rest.join('/')}/` : '';
      return { locale: altLocale, url: `/${altLocale}/${altSlug}/${suffix}` };
    }

    // 2. Blog post -> alt locale's blog index (posts are not translations).
    if (firstSeg === 'blog' && rest.length > 0) {
      return { locale: altLocale, url: `/${altLocale}/blog/` };
    }

    // 3. Naive fallback.
    return {
      locale: altLocale,
      url: localizedPath(altLocale, tail),
    };
  });
}

/** Build an absolute URL from a root-relative path. */
export function toAbsoluteUrl(rootRelativePath: string): string {
  const path = rootRelativePath.startsWith('/')
    ? rootRelativePath
    : `/${rootRelativePath}`;
  return `${SITE_ORIGIN}${path}`;
}

/** Helper for `<link rel="alternate" hreflang="x-default">` href. */
export function getXDefaultUrl(currentPath: string): string {
  const remainder = stripLocalePrefix(currentPath);
  const tail = remainder.replace(/^\/+/, '');
  return toAbsoluteUrl(localizedPath(X_DEFAULT_LOCALE, tail));
}
