/** Basic consent mode: never load Google or send analytics before agreement. */
type Choice = 'granted' | 'denied';
type ConsentRecord = { version: 1; analytics: Choice; savedAt: number };
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean;
  }
}

const panel = document.querySelector<HTMLElement>('#audience-consent');
const id = panel?.dataset.measurementId;
if (panel && id && /^G-[A-Z0-9]+$/.test(id)) {
  const storageKey = 'privacy-score-audience-consent-v1';
  const expiry = 180 * 24 * 60 * 60 * 1000;
  let choice: Choice = 'denied';
  let configured = false;
  let pageViewed = false;
  let returnFocus: HTMLElement | null = null;
  const preferences = document.querySelector<HTMLButtonElement>('[data-privacy-settings]');

  const read = (): ConsentRecord | undefined => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (stored?.version === 1 && ['granted', 'denied'].includes(stored.analytics)
        && Number.isFinite(stored.savedAt) && Date.now() - stored.savedAt < expiry) return stored;
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

  // Exclude query strings, fragments, article data and arbitrary link destinations.
  const event = (name: string, params: Record<string, string> = {}) => {
    if (choice !== 'granted') return;
    window.gtag?.('event', name, { language: panel.dataset.locale, page_path: location.pathname, ...params });
  };

  const apply = (next: Choice) => {
    choice = next;
    window[`ga-disable-${id}`] = next !== 'granted';
    if (next === 'denied') {
      if (configured) window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
      removeCookies();
      return;
    }
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
  };

  panel.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((button) => button.addEventListener('click', () => {
    const next = button.dataset.consent as Choice;
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, analytics: next, savedAt: Date.now() })); } catch { /* Apply for this document anyway. */ }
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
    if (change.key !== storageKey) return;
    const record = read();
    apply(record?.analytics ?? 'denied');
    panel.hidden = Boolean(record);
  });
  document.addEventListener('click', (click) => {
    const target = click.target instanceof Element ? click.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!target) return;
    const url = new URL(target.href, location.href);
    if (url.hostname === 'apps.apple.com' && url.pathname.includes('id6762229573')) {
      const position = target.dataset.cta ?? (target.closest('footer') ? 'footer' : target.closest('article') ? 'article-body' : 'content');
      event('app_store_click', { cta_position: position });
    } else if (target.closest('.lang-switch')) event('language_switch', { target_language: url.pathname.startsWith('/fr/') ? 'fr' : 'en' });
    else if (target.dataset.articleCta) event('article_cta_click', { destination: url.pathname });
  });
  const stored = read();
  apply(stored?.analytics ?? 'denied');
  panel.hidden = Boolean(stored);
}
export {};
