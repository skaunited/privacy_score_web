/**
 * jsonld.ts — schema.org JSON-LD builders for privacyscore.fr.
 *
 * Each builder is a pure function returning a plain object that BaseLayout
 * serialises via `<script type="application/ld+json">`. They are intentionally
 * kept small and side-effect free so they can be composed per-page.
 *
 * Rationale on what is included vs. omitted:
 *   - We DO include WebSite, MobileApplication, Organization, and FAQPage on
 *     the homepage — these are the four high-signal types Google recognises
 *     for a single-app product site and are safe to ship without third-party
 *     verifications.
 *   - We DO NOT emit `aggregateRating` on MobileApplication because we have no
 *     verified App Store rating data; ginning one up would be a Google rich
 *     results policy violation.
 *   - We DO NOT emit `sameAs` for Organization until the social handles in the
 *     footer are real URLs (currently `#` placeholders).
 *
 * Note on HTML inside FAQ answers:
 *   Some FAQ answers contain inline `<em>` or `<strong>` markup. schema.org's
 *   `Answer.text` explicitly allows safe HTML, and Google's Rich Results test
 *   renders it. We pass `item.a` through unchanged.
 */
import type { Locale, Dictionary } from './utils';
import { SITE_ORIGIN } from './utils';

/** Map our locale codes to BCP-47 region tags used by schema.org `inLanguage`. */
const inLanguageFor: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-US',
};

/**
 * WebSite — the site itself, per locale. Emits `inLanguage` so Google can
 * distinguish the FR and EN variants instead of treating them as duplicates.
 */
export function websiteJsonLd(locale: Locale, dict: Dictionary) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Privacy Score',
    url: `${SITE_ORIGIN}/${locale}/`,
    inLanguage: inLanguageFor[locale],
    description: dict.meta.description,
    publisher: {
      '@type': 'Organization',
      name: 'Codevelop',
    },
  };
}

/**
 * MobileApplication — the iOS app the site exists to promote.
 *
 * `softwareVersion` is set to the version surfaced in the site footer so the
 * structured data is consistent with what a crawler also sees rendered on the
 * page. Real shipping build version is tracked separately in APP_RECAP.
 *
 * `aggregateRating` is intentionally omitted — we have no verified App Store
 * rating data to surface, and Google's rich-results policy forbids fabricated
 * or self-asserted ratings.
 */
export function softwareApplicationJsonLd(locale: Locale, dict: Dictionary) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Privacy Score',
    operatingSystem: 'iOS 17+',
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: 'Privacy',
    url: `${SITE_ORIGIN}/${locale}/`,
    inLanguage: [inLanguageFor[locale]],
    description: dict.meta.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Codevelop',
      url: SITE_ORIGIN,
    },
    image: `${SITE_ORIGIN}/assets/app-icon-512.png`,
    softwareVersion: '1.4.0',
  };
}

/**
 * Organization — the legal entity behind the site/app. Kept locale-neutral.
 *
 * `sameAs` is empty until the footer Mastodon/Bluesky links resolve to real
 * profiles; emitting placeholder `#` URLs would be a structured-data quality
 * regression.
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Privacy Score',
    legalName: 'Codevelop',
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/assets/app-icon-512.png`,
    email: 'hello@privacyscore.fr',
    sameAs: [],
  };
}

/**
 * FAQPage — built from `dict.faq.items`. Answers may legitimately contain
 * inline `<em>` / `<strong>` tags; schema.org allows safe HTML in
 * `Answer.text` and Google renders it.
 */
export function faqJsonLd(dict: Dictionary) {
  const items: Array<{ q: string; a: string }> = dict.faq.items ?? [];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}
