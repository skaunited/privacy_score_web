import frDict from './fr.json';
import enDict from './en.json';
import { annualOfferText } from '../config/product';
import { SITE_ORIGIN, PAGE_PATHS } from './routes.mjs';
export { SITE_ORIGIN };
export type Locale = 'fr' | 'en';
export type Dictionary = Record<string, any>;
export type PageKey = keyof typeof PAGE_PATHS;
export type LocaleLink = { locale: Locale; url: string };
export const LOCALES: readonly Locale[] = ['en', 'fr'];
export const DEFAULT_LOCALE: Locale = 'en';
export const X_DEFAULT_LOCALE: Locale = 'en';
export const htmlLang: Record<Locale, string> = { en: 'en', fr: 'fr' };
export const hreflangTag = htmlLang;
export const APP_STORE_URL: Record<Locale, string> = {
  fr: 'https://apps.apple.com/fr/app/privacy-score-tracker-audit/id6762229573',
  en: 'https://apps.apple.com/app/privacy-score-tracker-audit/id6762229573',
};
export const dictionaries: Record<Locale, Dictionary> = { fr: frDict, en: enDict };
export function getDictionary(locale: Locale): Dictionary {
  const dict = structuredClone(dictionaries[locale]);
  dict.faq.items[1].a = (locale === 'fr'
    ? 'Le premier audit est gratuit. Premium inclut les audits supplémentaires, les outils DNS/VPN et l’export. '
    : 'Your first audit is free. Premium includes additional audits, DNS/VPN tools and report export. ') + annualOfferText(locale);
  return dict;
}
export function stripLocalePrefix(path: string): string {
  return `/${(path || '/').replace(/^\/+|\/+$/g, '').replace(/^(fr|en)(\/|$)/, '')}`;
}
export function localizedPath(locale: Locale, path = ''): string {
  const tail = stripLocalePrefix(path).replace(/^\/+|\/+$/g, '');
  return `${locale === 'fr' ? '/fr' : ''}/${tail ? `${tail}/` : ''}`;
}
export function pathForPage(locale: Locale, pageKey: PageKey): string { return PAGE_PATHS[pageKey][locale]; }
export function toAbsoluteUrl(path: string): string { return new URL(path, `${SITE_ORIGIN}/`).href; }
/** Only actual content equivalents belong in hreflang. */
export function getEquivalentLocaleUrls(path: string): LocaleLink[] {
  const route = Object.values(PAGE_PATHS).find((pair) => Object.values(pair).includes(path));
  return route ? LOCALES.map((locale) => ({ locale, url: route[locale] })) : [];
}
/** The visible language switcher may offer the other blog index as navigation. */
export function getAlternateLocaleUrl(locale: Locale, path: string): LocaleLink[] {
  const equivalent = getEquivalentLocaleUrls(path).filter((entry) => entry.locale !== locale);
  return equivalent.length ? equivalent : LOCALES.filter((other) => other !== locale)
    .map((other) => ({ locale: other, url: pathForPage(other, 'blog') }));
}
export function getXDefaultUrl(path: string): string {
  const equivalent = getEquivalentLocaleUrls(path).find((entry) => entry.locale === 'en');
  return toAbsoluteUrl(equivalent?.url ?? '/');
}
