import { defineConfig } from '@playwright/test';
const builtSite = process.env.TEST_BUILT_SITE === '1';
export default defineConfig({
  testDir: './tests',
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4329', channel: process.env.CI ? undefined : 'chrome', headless: true, viewport: { width: 1280, height: 900 } },
  webServer: {
    command: builtSite ? 'node scripts/serve-build.mjs --port 4329' : 'pnpm exec astro dev --host 127.0.0.1 --port 4329',
    url: 'http://127.0.0.1:4329',
    env: { PUBLIC_GA_MEASUREMENT_ID: 'G-TESTPRIVACY' },
    reuseExistingServer: false,
  },
});
