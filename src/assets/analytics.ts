/** Basic consent mode: never load Google or send analytics before agreement. */
import { measureEngagement, type EventParams } from './engagement';
import { isPrivacyScoreAppStoreUrl, withAppStoreCampaign } from '../config/app-store-campaign';

type Choice = 'granted' | 'denied';
type ConsentRecord = { version: 2; analytics: Choice; savedAt: number };
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

const panel = document.querySelector<HTMLElement>('#audience-consent');
const candidateId = panel?.dataset.measurementId;
if (panel && candidateId && /^G-[A-Z0-9]+$/.test(candidateId)) {
  const id = candidateId;
  const storageKey = 'privacy-score-audience-consent-v2';
  const expiry = 180 * 24 * 60 * 60 * 1000;
  let choice: Choice = 'denied';
  let configured = false;
  let pageViewed = false;
  let consentExpiresAt = 0;
  let expiryTimer: number | undefined;
  let engagement: ReturnType<typeof measureEngagement> | undefined;
  const article = document.querySelector('[data-analytics-article]');
  const pageType = article ? 'article' : /^\/(?:fr\/)?blog\/$/.test(location.pathname) ? 'blog_index'
    : ['/', '/fr/'].includes(location.pathname) ? 'home' : 'other';
  let returnFocus: HTMLElement | null = null;
  const preferences = document.querySelector<HTMLButtonElement>('[data-privacy-settings]');
  const plainAppStoreLinks = new Map<HTMLAnchorElement, string>();

  const updateAppStoreLinks = (granted: boolean) => {
    if (!granted) {
      for (const [link, original] of plainAppStoreLinks) link.setAttribute('href', original);
      plainAppStoreLinks.clear();
      return;
    }
    for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href]')) {
      const url = new URL(link.href, location.href);
      if (!isPrivacyScoreAppStoreUrl(url)) continue;
      if (!plainAppStoreLinks.has(link)) plainAppStoreLinks.set(link, link.getAttribute('href')!);
      link.href = withAppStoreCampaign(url);
    }
  };

  const read = (): ConsentRecord | undefined => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (stored?.version === 2 && ['granted', 'denied'].includes(stored.analytics)
        && Number.isFinite(stored.savedAt) && stored.savedAt <= Date.now() && Date.now() - stored.savedAt < expiry) return stored;
      // Respect existing refusals without extending them. Older grants need the updated notice.
      if (!stored) {
        const previous = JSON.parse(localStorage.getItem('privacy-score-audience-consent-v1') ?? 'null');
        if (previous?.version === 1 && previous.analytics === 'denied' && Number.isFinite(previous.savedAt)
          && previous.savedAt <= Date.now() && Date.now() - previous.savedAt < expiry) {
          return { version: 2, analytics: 'denied', savedAt: previous.savedAt };
        }
      }
    } catch { /* Storage can be unavailable; the visitor can still choose. */ }
  };

  const removeCookies = () => {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      const hostname = location.hostname;
      for (const domain of ['', hostname, `.${hostname}`, hostname.replace(/^www\./, ''), `.${hostname.replace(/^www\./, '')}`]) {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure${domain ? `; Domain=${domain}` : ''}`;
      }
    }
  };

  // Exclude query strings, fragments, article text and arbitrary link destinations.
  const event = (name: string, params: EventParams = {}) => {
    if (choice !== 'granted') return;
    if (Date.now() >= consentExpiresAt) { expire(); return; }
    window.gtag?.('event', name, { content_language: panel.dataset.locale, page_path: location.pathname,
      page_type: pageType, ...(article ? { article_path: location.pathname } : {}), ...params });
  };

  function expire() {
    apply('denied');
    panel!.hidden = false;
  }
  function scheduleExpiry() {
    clearTimeout(expiryTimer);
    // Browser timeouts cannot exceed a signed 32-bit delay.
    expiryTimer = window.setTimeout(() => {
      if (Date.now() >= consentExpiresAt) expire();
      else scheduleExpiry();
    }, Math.min(consentExpiresAt - Date.now(), 2_147_483_647));
  }
  function apply(next: Choice, savedAt = Date.now()) {
    choice = next;
    updateAppStoreLinks(next === 'granted');
    window[`ga-disable-${id}`] = next !== 'granted';
    if (next === 'denied') {
      clearTimeout(expiryTimer);
      engagement?.stop();
      engagement = undefined;
      if (configured) window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      removeCookies();
      return;
    }
    consentExpiresAt = savedAt + expiry;
    scheduleExpiry();
    if (!configured) {
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = function () { window.dataLayer!.push(arguments); };
      window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      window.gtag('js', new Date());
      window.gtag('config', id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
        page_location: `${location.origin}${location.pathname}`, page_referrer: document.referrer ? new URL(document.referrer).origin : '',
        cookie_expires: 60 * 60 * 24 * 30 * 13, cookie_update: false, cookie_flags: 'SameSite=Lax;Secure' });
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      script.id = 'privacy-score-ga';
      document.head.append(script);
      configured = true;
    }
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    if (!pageViewed) {
      event('page_view', { page_location: `${location.origin}${location.pathname}` });
      pageViewed = true;
    }
    engagement ??= measureEngagement(event);
  }

  panel.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((button) => button.addEventListener('click', () => {
    const next = button.dataset.consent as Choice;
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 2, analytics: next, savedAt: Date.now() })); } catch { /* Apply for this document anyway. */ }
    apply(next);
    panel.hidden = true;
    returnFocus?.focus();
  }));
  if (preferences) {
    preferences.hidden = false;
    preferences.addEventListener('click', () => {
      returnFocus = preferences;
      panel.hidden = false;
      panel.querySelector<HTMLButtonElement>('button')?.focus();
    });
  }
  window.addEventListener('storage', (change) => {
    if (change.key !== storageKey && change.key !== null) return;
    const record = read();
    apply(record?.analytics ?? 'denied', record?.savedAt);
    panel.hidden = Boolean(record);
  });
  document.addEventListener('click', (click) => {
    const target = click.target instanceof Element ? click.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!target) return;
    const url = new URL(target.href, location.href);
    if (isPrivacyScoreAppStoreUrl(url)) {
      const position = target.dataset.cta ?? (target.closest('footer') ? 'footer' : target.closest('article') ? 'article-body' : 'content');
      engagement?.flush();
      event('app_store_click', { cta_position: position, ...engagement?.snapshot() });
    } else if (target.closest('.lang-switch')) event('language_switch', { target_language: url.pathname.startsWith('/fr/') ? 'fr' : 'en' });
    else if (url.origin === location.origin && url.pathname !== location.pathname && /^\/(?:fr\/)?blog\/[^/]+\/$/.test(url.pathname)) {
      event('article_link_click', { destination: url.pathname });
    }
    if (url.origin === location.origin && url.pathname !== location.pathname) engagement?.flush();
  });
  window.addEventListener('pageshow', (show) => {
    if (!show.persisted) return;
    const record = read();
    apply(record?.analytics ?? 'denied', record?.savedAt);
    panel.hidden = Boolean(record);
  });
  const stored = read();
  apply(stored?.analytics ?? 'denied', stored?.savedAt);
  panel.hidden = Boolean(stored);
}
export {};
