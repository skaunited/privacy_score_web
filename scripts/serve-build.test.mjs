import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serveBuild } from './serve-build.mjs';

async function fixture(run) {
  const directory = await mkdtemp(join(tmpdir(), 'privacy-score-preview-'));
  await mkdir(join(directory, '_astro'));
  await writeFile(join(directory, 'index.html'), '<h1>Privacy Score</h1>');
  await writeFile(
    join(directory, '_astro', 'app.hash.js'),
    'export const ready = true;',
  );
  await writeFile(join(directory, '_astro', 'image.hash.avif'), 'image');
  await writeFile(join(directory, '.env'), 'PRIVATE');
  const preview = await serveBuild({ directory });
  try {
    await run(preview.url);
  } finally {
    await preview.close();
    await rm(directory, { recursive: true, force: true });
  }
}

test('audit server applies security headers to real page loads and HEAD responses', async () => {
  await fixture(async (url) => {
    for (const method of ['GET', 'HEAD']) {
      const response = await fetch(url, { method });
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-security-policy'), /^default-src 'self';/);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert.match(response.headers.get('cache-control'), /max-age=0/);
      assert.equal(
        await response.text(),
        method === 'GET' ? '<h1>Privacy Score</h1>' : '',
      );
    }
  });
});

test('only fingerprinted resources get immutable caching and correct MIME types', async () => {
  await fixture(async (url) => {
    const script = await fetch(`${url}/_astro/app.hash.js`);
    assert.match(
      script.headers.get('cache-control'),
      /max-age=31536000, immutable/,
    );
    assert.match(script.headers.get('content-type'), /application\/javascript/);
    const image = await fetch(`${url}/_astro/image.hash.avif`);
    assert.equal(image.headers.get('content-type'), 'image/avif');
  });
});

test('private files and missing routes are not served by the audit server', async () => {
  await fixture(async (url) => {
    assert.equal((await fetch(`${url}/.env`)).status, 403);
    assert.equal((await fetch(`${url}/_astro/.htaccess`)).status, 403);
    assert.equal((await fetch(`${url}/missing`)).status, 404);
    assert.equal((await fetch(url, { method: 'POST' })).status, 405);
  });
});
