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
 * Kept intentionally permissive for now — the dictionary will be type-narrowed
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
export const SITE_ORIGIN = 'https://privacyscore.fr';

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
 * Throws (rather than silently falling back) if the locale is unknown — this
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
 * Given the current locale and current path (e.g. `/fr/faq/`), return entries
 * for every OTHER locale with the equivalent URL.
 *
 * The returned URLs are root-relative (start with `/`). Use {@link toAbsoluteUrl}
 * to build absolute URLs for SEO tags.
 */
export function getAlternateLocaleUrl(
  currentLocale: Locale,
  currentPath: string,
): { locale: Locale; url: string }[] {
  const remainder = stripLocalePrefix(currentPath);
  // Drop leading slash for localizedPath
  const tail = remainder.replace(/^\/+/, '');
  return LOCALES.filter((l) => l !== currentLocale).map((locale) => ({
    locale,
    url: localizedPath(locale, tail),
  }));
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
