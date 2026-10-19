import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  // Tests must never send events to the real Analytics property.
  await page.route(/https:\/\/.*(googletagmanager|google-analytics)\.com\//, (route) => route.fulfill({ status:200, contentType:'application/javascript', body:'/* isolated analytics test */' }));
});

test('consent gates Google, remembers refusal, and withdrawal stops custom events', async ({ page, context }) => {
  const google: string[] = [];
  page.on('request', (request) => { if (/googletagmanager|google-analytics/.test(request.url())) google.push(request.url()); });
  await page.goto('/');
  await expect(page.locator('#audience-consent')).toBeVisible();
  expect(google).toHaveLength(0);
  await page.locator('[data-consent="denied"]').click();
  await page.goto('/blog/');
  await expect(page.locator('#audience-consent')).toBeHidden();
  expect(google).toHaveLength(0);
  await page.locator('[data-privacy-settings]').click();
  await page.locator('[data-consent="granted"]').click();
  await expect.poll(() => google.length).toBe(1);
  const events = () => page.evaluate(() => Array.from(window.dataLayer ?? []).map((item: any) => Array.from(item)));
  expect((await events()).filter((item) => item[0] === 'event' && item[1] === 'page_view')).toHaveLength(1);
  await context.addCookies([{ name:'_ga', value:'test', url:'http://127.0.0.1:4329' }]);
  await page.locator('[data-privacy-settings]').click();
  await page.locator('[data-consent="denied"]').click();
  await expect.poll(async () => (await context.cookies()).filter((cookie) => cookie.name.startsWith('_ga')).length).toBe(0);
  const count = (await events()).filter((item) => item[0] === 'event').length;
  await page.locator('a[href*="apps.apple.com"]').first().evaluate((link) => {
    link.addEventListener('click', (event) => event.preventDefault(), { once:true });
    (link as HTMLAnchorElement).click();
  });
  expect((await events()).filter((item) => item[0] === 'event')).toHaveLength(count);
  expect(await page.evaluate(() => window['ga-disable-G-TESTPRIVACY'])).toBe(true);
});

test('page views and App Store events omit query strings and fragments', async ({ page }) => {
  await page.goto('/?private=test#how');
  await page.locator('[data-consent="granted"]').click();
  await page.locator('a[data-cta="hero"]').evaluate((link) => {
    link.addEventListener('click', (event) => event.preventDefault(), { once:true });
    (link as HTMLAnchorElement).click();
  });
  const events = await page.evaluate(() => Array.from(window.dataLayer ?? []).map((item: any) => Array.from(item)));
  const appStore = events.filter((item) => item[0] === 'event' && item[1] === 'app_store_click');
  expect(appStore).toHaveLength(1);
  expect(appStore[0][2]).toMatchObject({ page_path:'/', cta_position:'hero', language:'en' });
  expect(JSON.stringify(events)).not.toContain('private=test');
});

test('expired consent does not load Google', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('privacy-score-audience-consent-v1', JSON.stringify({ version:1, analytics:'granted', savedAt:Date.now()-181*86400000 })));
  await page.goto('/');
  await expect(page.locator('#audience-consent')).toBeVisible();
  await expect(page.locator('#privacy-score-ga')).toHaveCount(0);
});

for (const path of ['/', '/fr/', '/blog/iphone-permissions-guide/', '/fr/blog/importer-rapport-confidentialite-iphone/']) {
  test(`mobile layout and accessibility ${path}`, async ({ page }) => {
    await page.setViewportSize({ width:390, height:844 });
    await page.goto(path);
    await page.locator('[data-consent="denied"]').click();
    const switcher = page.locator('.lang-switch');
    await expect(switcher).toBeVisible();
    const alternative = switcher.locator('a:not([aria-current="page"])');
    await expect(alternative).toHaveCount(1);
    await expect(alternative).toHaveAttribute('href', path === '/' ? '/fr/' : path === '/fr/' ? '/' : path.startsWith('/fr/') ? '/blog/export-app-privacy-report/' : '/fr/blog/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (path === '/') await page.screenshot({ path:'test-results/home-viewport.png' });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(results.violations.map((violation) => ({ id:violation.id, nodes:violation.nodes.map((node) => ({ target:node.target, summary:node.failureSummary })) }))).toEqual([]);
    await page.screenshot({ path:`test-results/${path === '/' ? 'home-en' : path === '/fr/' ? 'home-fr' : path.startsWith('/fr/') ? 'article-fr' : 'article-en'}.png`, fullPage:true });
  });
}
