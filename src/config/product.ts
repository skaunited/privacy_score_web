/** Product facts confirmed by the owner and French App Store on 2026-10-19. */
export const PRODUCT = {
  name: 'Privacy Score',
  minimumOS: '17.6',
  annualIntroEUR: 23.88,
  annualRenewalEUR: 59.99,
  sixMonthIntroEUR: 20.94,
  sixMonthEUR: 39.99,
  pricingMarket: 'France',
  reviewedAt: '2026-10-19',
  gaMeasurementId: 'G-QT0QFTD7L5',
  gaPropertyId: '559523211',
} as const;

export function annualOfferText(locale: 'en' | 'fr'): string {
  const amount = (value: number) => new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-IE', {
    style: 'currency', currency: 'EUR',
  }).format(value);
  return locale === 'fr'
    ? `Annuel : ${amount(PRODUCT.annualIntroEUR)} la première année, puis ${amount(PRODUCT.annualRenewalEUR)}/an. Six mois : ${amount(PRODUCT.sixMonthIntroEUR)} les six premiers mois, puis ${amount(PRODUCT.sixMonthEUR)}/six mois. Tarifs actuels en France, pour les abonnements éligibles ; conditions confirmées dans l’App Store avant achat.`
    : `Annual: ${amount(PRODUCT.annualIntroEUR)} for the first year, then ${amount(PRODUCT.annualRenewalEUR)}/year. Six months: ${amount(PRODUCT.sixMonthIntroEUR)} for the first six months, then ${amount(PRODUCT.sixMonthEUR)}/six months. Current French App Store prices for eligible subscriptions; Apple confirms eligibility, local prices and renewal terms before purchase.`;
}
