import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ENDPOINT, KEY, KEY_FILE, MANIFEST_FILE, ORIGIN, hash, manifestFor, prepareManifest, submitDeployed } from './indexnow.mjs';

const a = `${ORIGIN}/`;
const b = `${ORIGIN}/fr/blog/exemple/`;
const html = (url, extra = '') => `<!doctype html><html><head><link href="${url}" rel="canonical"></head><body>Confidentialité ${extra}</body></html>`;
const manifest = (pages = { [a]: html(a), [b]: html(b) }) => manifestFor(Object.fromEntries(Object.entries(pages).map(([url, content]) => [url, hash(content)])));
const acceptedState = (value) => ({ version: 1, manifest: value, submittedAt: '2026-10-20T10:00:00Z', responseStatus: 200 });

function network(value, { overrides = {}, status = 200, pages = { [a]: html(a), [b]: html(b) } } = {}) {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, ...options });
    assert.ok([ORIGIN, new URL(ENDPOINT).origin].includes(new URL(url).origin));
    assert.ok(!options.headers.Authorization);
    if (Object.hasOwn(overrides, url)) return overrides[url](calls, options);
    if (url === ENDPOINT) return new Response('', { status });
    if (url === `${ORIGIN}/${MANIFEST_FILE}`) return Response.json(value);
    if (url === `${ORIGIN}/${KEY_FILE}`) return new Response(`${KEY}\n`);
    if (pages[url]) return new Response(pages[url], { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    return new Response('missing', { status: 404 });
  };
  return { calls, fetcher, posts: () => calls.filter(({ method }) => method === 'POST') };
}

test('initial receipt verifies live pages and sends every canonical URL once; repeated run is incremental', async () => {
  const value = manifest();
  const net = network(value);
  const result = await submitDeployed({ manifest: value, fetcher: net.fetcher });
  assert.equal(result.report.status, 'submitted');
  assert.equal(result.report.indexed, false);
  assert.equal(result.report.checks.length, 2);
  const payload = JSON.parse(net.posts()[0].body);
  assert.deepEqual(payload, { host: 'www.privacyscore.fr', key: KEY, keyLocation: `${ORIGIN}/${KEY_FILE}`, urlList: Object.keys(value.pages) });
  assert.equal((await submitDeployed({ manifest: value, state: result.state, fetcher: net.fetcher })).report.status, 'unchanged');
  assert.equal(net.posts().length, 1);
});

test('changed and removed pages are submitted, unchanged pages are not; previous live content is retained in state until success', async () => {
  const old = manifest();
  const value = manifest({ [a]: html(a, 'updated') });
  const net = network(value, { pages: { [a]: html(a, 'updated') } });
  const state = acceptedState(old);
  const result = await submitDeployed({ manifest: value, state, fetcher: net.fetcher });
  assert.deepEqual(result.report.submittedUrls, [a, b]);
  assert.equal(result.report.removed, 1);
  assert.deepEqual(state.manifest, old);
  assert.deepEqual(result.state.manifest, value);
});

test('deployment marker must be public and current; an absent/old marker never sends anything', async () => {
  for (const response of [() => new Response('', { status: 404 }), () => Response.json(manifest({ [a]: html(a, 'old') }))]) {
    const value = manifest();
    const net = network(value, { overrides: { [`${ORIGIN}/${MANIFEST_FILE}`]: response } });
    const result = await submitDeployed({ manifest: value, fetcher: net.fetcher });
    assert.equal(result.report.status, 'pending-deployment');
    assert.equal(result.state, undefined);
    assert.equal(net.posts().length, 0);
  }
});

test('a marker copied early by Plesk cannot submit stale HTML, redirects or missing pages', async () => {
  for (const response of [
    () => new Response(html(b, 'old'), { headers: { 'Content-Type': 'text/html' } }),
    () => new Response('', { status: 301, headers: { Location: a } }),
    () => new Response('', { status: 404 }),
  ]) {
    const value = manifest();
    const net = network(value, { overrides: { [b]: response } });
    assert.equal((await submitDeployed({ manifest: value, fetcher: net.fetcher })).report.status, 'pending-deployment');
    assert.equal(net.posts().length, 0);
  }
});

test('incorrect/redirected ownership proofs, WAF/origin errors and noindex responses cannot submit', async () => {
  for (const overrides of [
    { [`${ORIGIN}/${KEY_FILE}`]: () => new Response('wrong') },
    { [`${ORIGIN}/${KEY_FILE}`]: () => new Response('', { status: 301, headers: { Location: a } }) },
    { [a]: () => new Response('WAF', { status: 403 }) },
    { [b]: () => new Response('Origin', { status: 521 }) },
    { [a]: () => new Response(html(a), { headers: { 'Content-Type': 'text/html', 'X-Robots-Tag': 'noindex' } }) },
    { [b]: () => new Response(html(b, '<meta content="noindex, follow" name="robots">'), { headers: { 'Content-Type': 'text/html' } }) },
  ]) {
    const value = manifest();
    const net = network(value, { overrides });
    await assert.rejects(submitDeployed({ manifest: value, fetcher: net.fetcher }));
    assert.equal(net.posts().length, 0);
  }
});

test('failed receipts never return a new state; a 202 stays received with key validation pending, never indexed', async () => {
  const value = manifest();
  for (const status of [400, 403, 422, 429, 503]) {
    const net = network(value, { status });
    await assert.rejects(submitDeployed({ manifest: value, fetcher: net.fetcher }), new RegExp(`HTTP ${status}`));
    assert.equal(net.posts().length, 1);
  }
  const net = network(value, { status: 202 });
  const result = await submitDeployed({ manifest: value, fetcher: net.fetcher });
  assert.equal(result.state.responseStatus, 202);
  assert.equal(result.report.keyValidationPending, true);
  assert.equal(result.report.indexed, false);
});

test('reject cross-origin/noncanonical/tampered manifests and corrupt receipts before contacting any endpoint', async () => {
  for (const url of ['https://example.com/', 'https://name:password@www.privacyscore.fr/', `${ORIGIN}/en/`, `${ORIGIN}/404/`, `${a}?utm_source=test`, `${a}#fragment`]) {
    assert.throws(() => manifest({ [url]: html(url) }));
  }
  const value = manifest();
  const net = network(value);
  await assert.rejects(submitDeployed({ manifest: { ...value, release: 'tampered' }, fetcher: net.fetcher }));
  await assert.rejects(submitDeployed({ manifest: value, state: { ...acceptedState(value), responseStatus: 403 }, fetcher: net.fetcher }));
  assert.equal(net.calls.length, 0);
});

test('removed URLs must return 404/410 or a permanent redirect to a current canonical URL', async () => {
  const value = manifest({ [a]: html(a) });
  for (const [status, location, ready] of [[200, null, false], [302, a, false], [301, 'https://example.com/', false], [301, a, true], [308, a, true], [404, null, true], [410, null, true]]) {
    const net = network(value, { overrides: { [b]: () => new Response('', { status, headers: location ? { Location: location } : {} }) } });
    const result = await submitDeployed({ manifest: value, state: acceptedState(manifest()), fetcher: net.fetcher });
    assert.equal(result.report.status, ready ? 'submitted' : 'pending-deployment');
    assert.equal(net.posts().length, ready ? 1 : 0);
  }
});

test('a deployment switching during verification is not notified', async () => {
  const value = manifest();
  let reads = 0;
  const net = network(value, { overrides: { [`${ORIGIN}/${MANIFEST_FILE}`]: () => Response.json(++reads === 1 ? value : manifest({ [a]: html(a, 'next') })) } });
  assert.equal((await submitDeployed({ manifest: value, fetcher: net.fetcher })).report.status, 'pending-deployment');
  assert.equal(net.posts().length, 0);
});

test('UTF-8 split across network chunks preserves the HTML digest', async () => {
  const value = manifest();
  const bytes = Buffer.from(html(b));
  const split = bytes.indexOf(Buffer.from('é')) + 1;
  const net = network(value, { overrides: { [b]: () => new Response(new ReadableStream({ start(controller) {
    controller.enqueue(bytes.subarray(0, split)); controller.enqueue(bytes.subarray(split)); controller.close();
  } }), { headers: { 'Content-Type': 'text/html' } }) } });
  assert.equal((await submitDeployed({ manifest: value, fetcher: net.fetcher })).report.status, 'submitted');
});

test('manifest generation follows the sitemap and rejects noindex/noncanonical entries and incorrect key files', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'indexnow-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'fr/blog/exemple'), { recursive: true });
  await writeFile(join(directory, KEY_FILE), KEY);
  await writeFile(join(directory, 'sitemap-index.xml'), '<sitemapindex><sitemap><loc>https://www.privacyscore.fr/sitemap-0.xml</loc></sitemap></sitemapindex>');
  await writeFile(join(directory, 'sitemap-0.xml'), `<urlset><url><loc>${a}</loc></url><url><loc>${b}</loc></url></urlset>`);
  await writeFile(join(directory, 'index.html'), html(a));
  await writeFile(join(directory, 'fr/blog/exemple/index.html'), html(b));
  assert.deepEqual(await prepareManifest(directory), manifest());
  assert.deepEqual(JSON.parse(await readFile(join(directory, MANIFEST_FILE), 'utf8')), manifest());
  await writeFile(join(directory, 'index.html'), html(a, '<meta name="robots" content="noindex">'));
  await assert.rejects(prepareManifest(directory), /not indexable/);
  await writeFile(join(directory, 'index.html'), html(b));
  await assert.rejects(prepareManifest(directory), /not indexable/);
  await writeFile(join(directory, KEY_FILE), 'wrong');
  await assert.rejects(prepareManifest(directory), /ownership/);
});

test('before the first IndexNow build reaches deploy, the CLI reports pending without a receipt or submission', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'indexnow-cli-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const script = new URL('./submit-indexnow.mjs', import.meta.url);
  const output = execFileSync(process.execPath, [script.pathname, 'missing-build'], {
    cwd: directory, encoding: 'utf8',
    env: { ...process.env, GITHUB_OUTPUT: join(directory, 'output'), GITHUB_STEP_SUMMARY: join(directory, 'summary') },
  });
  assert.equal(JSON.parse(output).status, 'pending-deployment');
  const report = JSON.parse(await readFile(join(directory, 'reports/indexnow/result.json'), 'utf8'));
  assert.equal(report.submittedUrls.length, 0);
  await assert.rejects(readFile(join(directory, '.indexnow/state.json')), { code: 'ENOENT' });
  assert.match(await readFile(join(directory, 'output'), 'utf8'), /state_changed=false/);
  assert.match(await readFile(join(directory, 'summary'), 'utf8'), /pending-deployment/);
});

test('oversized production responses fail without notifying IndexNow', async () => {
  const value = manifest();
  const net = network(value, { overrides: { [a]: () => new Response('x'.repeat(2_000_001), { headers: { 'Content-Type': 'text/html' } }) } });
  await assert.rejects(submitDeployed({ manifest: value, fetcher: net.fetcher }), /exceeds/);
  assert.equal(net.posts().length, 0);
});
