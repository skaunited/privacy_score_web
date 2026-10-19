import { test, expect, type Page } from '@playwright/test';

const consentKey = 'privacy-score-audience-consent-v2';
const articlePath = '/blog/iphone-permissions-guide/';
const google = /https:\/\/[^/]*(?:googletagmanager\.com|google-analytics\.com|analytics\.google\.com)\//;
type RecordedEvent = { name: string; params: Record<string, string | number> };

test.beforeEach(async ({ context }) => {
  // Exercise our real browser bundle without contacting Google or polluting production reports.
  await context.route(google, (route) => route.fulfill({ status:200, contentType:'application/javascript', body:'/* isolated analytics test */' }));
});
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'reduce' });
});

async function events(page: Page, name?: string): Promise<RecordedEvent[]> {
  const recorded = await page.evaluate(() => Array.from(window.dataLayer ?? []).map((item: any) => Array.from(item)));
  return recorded.filter((item) => item[0] === 'event' && (!name || item[1] === name))
    .map((item) => ({ name: item[1] as string, params: item[2] as RecordedEvent['params'] }));
}
async function clickWithoutNavigation(page: Page, selector: string) {
  await page.locator(selector).first().evaluate((link) => {
    link.addEventListener('click', (event) => event.preventDefault(), { once:true });
    (link as HTMLAnchorElement).click();
  });
}
async function scrollToDepth(page: Page, percent: number) {
  await page.evaluate((value) => {
    window.scrollTo({ top:document.documentElement.scrollHeight * value / 100 - innerHeight, behavior:'instant' });
    // The browser's native scroll dispatch uses its rendering clock, not Playwright's virtual clock.
    // Notify the observer after the real position changes, then advance its animation-frame throttle.
    window.dispatchEvent(new Event('scroll'));
  }, percent);
  await page.clock.runFor(50);
}
async function grant(page: Page, path = articlePath) {
  await page.clock.install();
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('[data-consent="granted"]').click();
}

test('scroll and reading do not run before consent or reconstruct earlier activity', async ({ page }) => {
  await page.clock.install();
  await page.goto(articlePath);
  await scrollToDepth(page, 80);
  await page.clock.runFor(35_000);
  await clickWithoutNavigation(page, 'a[href*="apps.apple.com"]');
  expect(await events(page)).toEqual([]);
  await expect(page.locator('#privacy-score-ga')).toHaveCount(0);
  // Consent controls remain fixed while scrolled; accepting must not backfill 25/50/75%.
  await page.locator('[data-consent="granted"]').click();
  expect(await events(page, 'page_scroll')).toEqual([]);
  expect(await events(page, 'article_read_time')).toEqual([]);
  await scrollToDepth(page, 91);
  await expect.poll(async () => (await events(page, 'page_scroll')).map((event) => event.params.scroll_percent)).toEqual([90]);
});

test('page scroll thresholds fire once, including a jump to the bottom, in both languages', async ({ page }) => {
  await grant(page, '/');
  for (const percent of [26, 51, 76, 91, 100, 30, 100]) await scrollToDepth(page, percent);
  expect((await events(page, 'page_scroll')).map((event) => event.params.scroll_percent)).toEqual([25, 50, 75, 90, 100]);
  expect((await events(page, 'page_scroll')).every((event) => event.params.page_type === 'home')).toBe(true);
  await page.goto('/fr/');
  await expect.poll(async () => (await events(page, 'page_view')).length).toBe(1);
  await page.evaluate(() => document.fonts.ready);
  await scrollToDepth(page, 100);
  expect((await events(page, 'page_scroll')).map((event) => event.params.scroll_percent)).toEqual([25, 50, 75, 90, 100]);
  expect((await events(page, 'page_scroll'))[0].params).toMatchObject({ language:'fr', page_path:'/fr/' });
});

test('resize and pages without scrollable content do not manufacture scroll events', async ({ page }) => {
  await grant(page, '/blog/');
  await page.setViewportSize({ width:1280, height:1200 });
  await page.clock.runFor(100);
  expect(await events(page, 'page_scroll')).toEqual([]);
  await page.setViewportSize({ width:1280, height:16_000 });
  await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
  await page.clock.runFor(100);
  expect(await events(page, 'page_scroll')).toEqual([]);
  expect(await events(page, 'article_view')).toEqual([]); // The blog index is not an article.
});

test('native wheel scrolling and a real button click are observed without a virtual clock', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('[data-consent="granted"]').click();
  await page.mouse.wheel(0, 100_000);
  await expect.poll(async () => (await events(page, 'page_scroll')).map((event) => event.params.scroll_percent)).toEqual([25, 50, 75, 90, 100]);
  const button = page.locator('a[data-cta="header"]');
  await button.evaluate((link) => link.addEventListener('click', (event) => event.preventDefault(), { once:true }));
  await button.click();
  await expect.poll(async () => (await events(page, 'app_store_click')).length).toBe(1);
});

test('article journey preserves milestones and reading context through the App Store click', async ({ page }) => {
  await grant(page, `${articlePath}?private=secret#permissions`);
  expect(await events(page, 'article_view')).toHaveLength(1);
  await page.locator('[data-article-end]').scrollIntoViewIfNeeded();
  await page.clock.runFor(100);
  await expect.poll(async () => (await events(page, 'article_end')).length).toBe(1);
  expect(await events(page, 'article_complete')).toEqual([]); // A fast scroll is not a qualified read.
  await page.clock.runFor(31_000);
  await page.keyboard.press('Shift');
  await page.clock.runFor(31_000);
  expect((await events(page, 'article_read_time')).map((event) => event.params.read_seconds)).toEqual([30, 60]);
  expect(await events(page, 'article_complete')).toHaveLength(1);
  await clickWithoutNavigation(page, 'a[data-cta="header"]');
  const click = (await events(page, 'app_store_click'))[0];
  expect(click.params).toMatchObject({ article_path:articlePath, page_path:articlePath, page_type:'article', cta_position:'header', article_end_reached:1, read_seconds:60 });
  expect(click.params.active_read_seconds).toBeGreaterThanOrEqual(60);
  const readingMs = (await events(page, 'article_engagement')).reduce((sum, event) => sum + Number(event.params.reading_time_msec), 0);
  expect(readingMs).toBeGreaterThanOrEqual(60_000);
  expect(readingMs).toBeLessThan(65_000); // Deltas, not repeated cumulative time.
  const all = await events(page);
  expect(all.findIndex((event) => event.name === 'article_view')).toBeLessThan(all.findIndex((event) => event.name === 'article_read_time'));
  expect(all.at(-1)?.name).toBe('app_store_click');
  expect(JSON.stringify(all)).not.toMatch(/private=secret|#permissions/);
});

test('reading pauses in a hidden tab, after inactivity, and outside the article', async ({ page }) => {
  await grant(page);
  await page.clock.runFor(20_000);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable:true, value:'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const paused = await events(page);
  await page.clock.runFor(40_000);
  expect(await events(page)).toEqual(paused);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable:true, value:'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.runFor(90_000);
  const beforeClick = await events(page, 'article_engagement');
  const total = beforeClick.reduce((sum, event) => sum + Number(event.params.reading_time_msec), 0);
  expect(total).toBeGreaterThanOrEqual(79_000);
  expect(total).toBeLessThan(81_000); // About 20s before hiding, then a maximum of 60s idle.
  await page.setViewportSize({ width:1280, height:250 });
  await scrollToDepth(page, 100);
  await page.clock.runFor(1000);
  const outside = (await events(page, 'article_engagement')).reduce((sum, event) => sum + Number(event.params.reading_time_msec), 0);
  await page.clock.runFor(35_000);
  await clickWithoutNavigation(page, 'a[data-cta="header"]');
  const afterOutside = (await events(page, 'article_engagement')).reduce((sum, event) => sum + Number(event.params.reading_time_msec), 0);
  expect(afterOutside - outside).toBeLessThan(2000);
});

test('partial reading time is flushed on page hide without duplicating it on return', async ({ page }) => {
  await grant(page);
  await page.clock.runFor(8000);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted:true })));
  const initial = (await events(page, 'article_engagement')).reduce((sum, event) => sum + Number(event.params.reading_time_msec), 0);
  expect(initial).toBeGreaterThanOrEqual(8000);
  await page.clock.runFor(20_000);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted:true })));
  await page.clock.runFor(4000);
  await clickWithoutNavigation(page, 'a[data-cta="header"]');
  const total = (await events(page, 'article_engagement')).reduce((sum, event) => sum + Number(event.params.reading_time_msec), 0);
  expect(total).toBeGreaterThanOrEqual(12_000);
  expect(total).toBeLessThan(14_000);
  await expect.poll(async () => (await events(page, 'page_view')).length).toBe(1);
  expect(await events(page, 'article_view')).toHaveLength(1);
});

test('reading pauses on focus loss and resumes when focus returns', async ({ page }) => {
  await grant(page);
  await page.clock.runFor(20_000);
  // Playwright emulates focus in each headless page, even after another tab is brought forward.
  // Drive the observable focus API and events explicitly, independently of visibility above.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hasFocus', { configurable:true, value:() => false });
    window.dispatchEvent(new Event('blur'));
  });
  const paused = await events(page);
  await page.clock.runFor(40_000);
  expect(await events(page)).toEqual(paused);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hasFocus', { configurable:true, value:() => true });
    window.dispatchEvent(new Event('focus'));
  });
  await page.clock.runFor(11_000);
  expect((await events(page, 'article_read_time')).map((event) => event.params.read_seconds)).toEqual([30]);
});

test('blog links and App Store clicks form a journey across full page navigation', async ({ page }) => {
  await grant(page, '/fr/blog/');
  const link = page.locator('.blog-card h2 a').first();
  const destination = await link.getAttribute('href');
  await clickWithoutNavigation(page, '.blog-card h2 a');
  expect((await events(page, 'article_link_click'))[0].params).toMatchObject({ page_type:'blog_index', destination });
  await link.click();
  await expect(page).toHaveURL(new RegExp(`${destination}$`));
  await expect.poll(async () => (await events(page, 'page_view')).length).toBe(1);
  expect((await events(page, 'article_view'))[0].params.language).toBe('fr');
  await page.clock.runFor(31_000);
  await clickWithoutNavigation(page, 'a[data-cta="header"]');
  expect((await events(page, 'app_store_click'))[0].params).toMatchObject({ article_path:destination, page_type:'article' });
});

test('withdrawal discards pending time, stops all new events and propagates between tabs', async ({ page, context }) => {
  await grant(page);
  const second = await context.newPage();
  await second.goto(articlePath);
  await page.bringToFront();
  await page.clock.runFor(7000);
  await page.locator('[data-privacy-settings]').click();
  await page.locator('[data-consent="denied"]').click();
  await expect.poll(() => second.evaluate(() => window[`ga-disable-${(document.querySelector('#audience-consent') as HTMLElement).dataset.measurementId}`])).toBe(true);
  const before = await events(page);
  const otherBefore = await events(second);
  await scrollToDepth(page, 100);
  await page.clock.runFor(40_000);
  await clickWithoutNavigation(page, 'a[data-cta="header"]');
  await clickWithoutNavigation(second, 'a[data-cta="header"]');
  expect(await events(page)).toEqual(before);
  expect(await events(second)).toEqual(otherBefore);
  await second.close();
});

for (const previousChoice of ['granted', 'denied']) {
  test(`legacy ${previousChoice} consent ${previousChoice === 'granted' ? 'needs renewal' : 'remains respected'}`, async ({ page }) => {
    await page.addInitScript((analytics) => localStorage.setItem('privacy-score-audience-consent-v1', JSON.stringify({ version:1, analytics, savedAt:Date.now() })), previousChoice);
    await page.goto(articlePath);
    if (previousChoice === 'granted') await expect(page.locator('#audience-consent')).toBeVisible();
    else await expect(page.locator('#audience-consent')).toBeHidden();
    await expect(page.locator('#privacy-score-ga')).toHaveCount(0);
    expect(await events(page)).toEqual([]);
  });
}

test('consent expiring in an open document stops collection and requests a new choice', async ({ page }) => {
  await page.clock.install();
  await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({ version:2, analytics:'granted', savedAt:Date.now()-180*86400000+5000 })), consentKey);
  await page.goto(articlePath);
  await expect(page.locator('#privacy-score-ga')).toHaveCount(1);
  await page.clock.runFor(6000);
  await expect(page.locator('#audience-consent')).toBeVisible();
  expect(await page.evaluate(() => window[`ga-disable-${(document.querySelector('#audience-consent') as HTMLElement).dataset.measurementId}`])).toBe(true);
  const count = await events(page);
  await scrollToDepth(page, 100);
  await clickWithoutNavigation(page, 'a[data-cta="header"]');
  expect(await events(page)).toEqual(count);
});
