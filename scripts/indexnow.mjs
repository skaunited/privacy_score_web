import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SITE_ORIGIN } from '../src/i18n/routes.mjs';

export const ORIGIN = SITE_ORIGIN;
// Public ownership proof, not an account credential. It must be served verbatim.
export const KEY = 'a2ebd8a2c0775ce612deb6ae2164ae4d';
export const KEY_FILE = `${KEY}.txt`;
export const MANIFEST_FILE = 'indexnow-manifest.json';
export const ENDPOINT = 'https://api.indexnow.org/indexnow';
export const hash = (value) => createHash('sha256').update(value).digest('hex');
const userAgent = 'PrivacyScore-IndexNow/1.0 (+https://www.privacyscore.fr/)';

function pageUrl(value) {
  const url = new URL(value);
  if (url.origin !== ORIGIN || url.href !== value || url.username || url.password || url.search || url.hash
    || !/^\/(?:[a-z0-9-]+\/)*$/.test(url.pathname)
    || url.pathname.startsWith('/en/') || url.pathname === '/404/')
    throw new Error(`Invalid canonical IndexNow URL: ${value}`);
  return url;
}

export function manifestFor(pages) {
  // Fixed byte-compatible ordering, independent of the runner's locale.
  const entries = Object.entries(pages).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  if (!entries.length || entries.length > 10_000) throw new Error('Invalid IndexNow page count.');
  for (const [url, digest] of entries) {
    pageUrl(url);
    if (typeof digest !== 'string' || !/^[a-f0-9]{64}$/.test(digest)) throw new Error('Invalid page digest.');
  }
  const sorted = Object.fromEntries(entries);
  return { version: 1, origin: ORIGIN, release: hash(JSON.stringify(sorted)), pages: sorted };
}

export function validateManifest(value) {
  if (value?.version !== 1 || value.origin !== ORIGIN || !value.pages
    || Array.isArray(value.pages) || typeof value.pages !== 'object')
    throw new Error('Invalid IndexNow manifest.');
  const normalized = manifestFor(value.pages);
  if (value.release !== normalized.release) throw new Error('IndexNow manifest digest mismatch.');
  return normalized;
}

export function isNoindex(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].some(([tag]) =>
    /\bname\s*=\s*["'](?:robots|googlebot|bingbot)["']/i.test(tag)
    && /\bcontent\s*=\s*["'][^"']*\bnoindex\b/i.test(tag));
}

function isCanonical(html, url) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].some(([tag]) =>
    /\brel\s*=\s*["']canonical["']/i.test(tag)
    && /\bhref\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1] === url);
}

export async function prepareManifest(directory) {
  if ((await readFile(join(directory, KEY_FILE), 'utf8')).trim() !== KEY)
    throw new Error('IndexNow ownership file missing or invalid.');
  const pages = {};
  for (const file of (await readdir(directory)).filter((name) => /^sitemap.*\.xml$/.test(name))) {
    const xml = await readFile(join(directory, file), 'utf8');
    if (!/<urlset\b/.test(xml)) continue;
    for (const [, value] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = pageUrl(value);
      if (Object.hasOwn(pages, value)) throw new Error('Duplicate sitemap URL.');
      const html = await readFile(join(directory, url.pathname.slice(1), 'index.html'), 'utf8');
      if (isNoindex(html) || !isCanonical(html, value))
        throw new Error(`Sitemap URL is not indexable/self-canonical: ${value}`);
      pages[value] = hash(html);
    }
  }
  const manifest = manifestFor(pages);
  await writeFile(join(directory, MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

export function validateState(state) {
  if (state == null) return;
  validateManifest(state.manifest);
  if (state.version !== 1 || ![200, 202].includes(state.responseStatus)
    || !Number.isFinite(Date.parse(state.submittedAt))) throw new Error('Invalid IndexNow state.');
}

async function get(url, fetcher) {
  const response = await fetcher(url, {
    redirect: 'manual', signal: AbortSignal.timeout(15_000),
    headers: { 'User-Agent': userAgent, 'Cache-Control': 'no-cache' }, cache: 'no-store',
  });
  if (response.status === 403 || response.status === 429 || response.status >= 500)
    throw new Error(`Production access failed (HTTP ${response.status}): ${url}`);
  return response;
}

async function text(response) {
  const chunks = [];
  let length = 0;
  for await (const chunk of response.body ?? []) {
    length += chunk.length;
    if (length > 2_000_000) throw new Error('Response exceeds IndexNow verification limit.');
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function submitDeployed({ manifest, state, fetcher = fetch, now = new Date(), checkOnly = false }) {
  manifest = validateManifest(manifest);
  validateState(state);
  const report = { checkedAt: now.toISOString(), release: manifest.release, status: 'pending-deployment',
    indexed: false, submittedUrls: [], checks: [] };
  const pending = (reason) => ({ report: { ...report, reason } });
  const liveManifest = async () => {
    const response = await get(`${ORIGIN}/${MANIFEST_FILE}`, fetcher);
    if (response.status === 404) return;
    if (response.status !== 200) throw new Error(`Unexpected manifest HTTP ${response.status}.`);
    return validateManifest(JSON.parse(await text(response)));
  };
  const live = await liveManifest();
  if (!live || live.release !== manifest.release) return pending('The latest deploy build is not yet visible on Plesk/CDN.');
  const previous = state?.manifest.pages ?? {};
  const changed = Object.keys(manifest.pages).filter((url) => previous[url] !== manifest.pages[url]);
  const removed = Object.keys(previous).filter((url) => !Object.hasOwn(manifest.pages, url));
  const urls = [...changed, ...removed];
  if (!urls.length) return { report: { ...report, status: 'unchanged', reason: 'This content was already submitted.',
    previousResponseStatus: state.responseStatus, previousSubmittedAt: state.submittedAt } };
  if (urls.length > 10_000) throw new Error('IndexNow batch exceeds 10,000 URLs.');
  const proof = await get(`${ORIGIN}/${KEY_FILE}`, fetcher);
  if (proof.status !== 200 || (await text(proof)).trim() !== KEY)
    throw new Error('Public IndexNow ownership proof is missing, redirected or incorrect.');
  // Plesk copies files non-atomically. A fresh manifest alone cannot prove all
  // pages have arrived. Require each public HTML response to match this build.
  for (const url of changed) {
    const response = await get(url, fetcher);
    if (response.status !== 200) return pending(`Waiting for a final HTTP 200 page: ${url}`);
    const html = await text(response);
    if (/\bnoindex\b/i.test(response.headers.get('x-robots-tag') ?? '') || isNoindex(html))
      throw new Error(`Production disallows indexing: ${url}`);
    if (!/text\/html/i.test(response.headers.get('content-type') ?? '') || !isCanonical(html, url)
      || hash(html) !== manifest.pages[url]) return pending(`Waiting for the matching public HTML: ${url}`);
    report.checks.push({ url, status: 200, matchesBuild: true });
  }
  for (const url of removed) {
    const response = await get(url, fetcher);
    const location = response.headers.get('location');
    const redirected = [301, 308].includes(response.status) && location
      && Object.hasOwn(manifest.pages, new URL(location, url).href);
    if (![404, 410].includes(response.status) && !redirected)
      return pending(`Removed URL is not yet 404/410 or permanently redirected to a current page: ${url}`);
    report.checks.push({ url, status: response.status, removed: true });
  }
  if ((await liveManifest())?.release !== manifest.release)
    return pending('Production changed during verification; wait for a stable deployment.');
  if (checkOnly) return { report: { ...report, status: 'ready-to-submit', plannedUrls: urls,
    addedOrUpdated: changed.length, removed: removed.length } };
  const response = await fetcher(ENDPOINT, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30_000),
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'User-Agent': userAgent },
    body: JSON.stringify({ host: new URL(ORIGIN).host, key: KEY, keyLocation: `${ORIGIN}/${KEY_FILE}`, urlList: urls }),
  });
  // Never advance the receipt on failure. The next hourly run retries, including
  // rate limits; no burst retry loop and no claim that a 202 key is validated.
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow rejected the batch: HTTP ${response.status}.`);
  return {
    report: { ...report, status: 'submitted', responseStatus: response.status, keyValidationPending: response.status === 202,
      addedOrUpdated: changed.length, removed: removed.length, submittedUrls: urls },
    state: { version: 1, manifest, submittedAt: now.toISOString(), responseStatus: response.status },
  };
}
