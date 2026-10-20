/** Public campaign link generated in App Store Connect on 2026-10-20. */
export const APP_STORE_CAMPAIGN = {
  appId: '6762229573',
  providerToken: '119041406',
  campaignToken: 'privacyscore_web',
  mediaType: '8',
} as const;

export function isPrivacyScoreAppStoreUrl(url: URL): boolean {
  return url.protocol === 'https:' && url.hostname === 'apps.apple.com'
    && new RegExp(`/id${APP_STORE_CAMPAIGN.appId}/?$`).test(url.pathname);
}

/** Preserve the storefront and product slug; never forward the current page URL. */
export function withAppStoreCampaign(url: URL): string {
  const campaign = new URL(url.href);
  campaign.searchParams.set('pt', APP_STORE_CAMPAIGN.providerToken);
  campaign.searchParams.set('ct', APP_STORE_CAMPAIGN.campaignToken);
  campaign.searchParams.set('mt', APP_STORE_CAMPAIGN.mediaType);
  return campaign.href;
}
