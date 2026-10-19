#!/usr/bin/env node
/** Verify the generated request regexes; nginx -t and live HTTP checks remain required. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SITE_ORIGIN, PAGE_PATHS, LEGACY_REDIRECTS } from '../src/i18n/routes.mjs';
const config = await readFile(new URL('../deploy/redirects.nginx.conf', import.meta.url), 'utf8');
const rules = [...config.matchAll(/if \(\$request_uri ~ "([^"]+)"\) \{\s*return 301 ([^;]+);\s*\}/g)]
  .map(([, expression, destination]) => ({ pattern: new RegExp(expression), destination }));
assert(rules.length > 0, 'No generated rules found');
function resolve(request) {
  const matches = rules.filter(({ pattern }) => pattern.test(request));
  assert(matches.length <= 1, `Ambiguous redirect: ${request}`);
  return matches[0]?.destination;
}
let checks = 0;
for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
  const base = from.slice(0, -1);
  for (const variant of [base, `${base}/`, `${base}/index.html`]) {
    for (const query of ['', '?utm_source=migration&x=1']) {
      assert.equal(resolve(variant + query), `${SITE_ORIGIN}${to}$is_args$args`, variant + query);
      checks++;
    }
  }
}
const canonical = rules.map(({ destination }) => destination.replace(SITE_ORIGIN, '').replace('$is_args$args', ''));
for (const route of new Set([...canonical, ...Object.values(PAGE_PATHS).flatMap(Object.values)])) {
  for (const query of ['', '?utm_source=test']) {
    assert.equal(resolve(route + query), undefined, `Canonical/internal index loop: ${route + query}`);
    const base = route === '/' ? '' : route.slice(0, -1);
    assert.equal(resolve(`${base}/index.html${query}`), `${SITE_ORIGIN}${route}$is_args$args`);
    if (route !== '/') assert.equal(resolve(base + query), `${SITE_ORIGIN}${route}$is_args$args`);
    checks += 3;
  }
}
for (const unknown of ['/en/unknown/', '/en/blog/iphone-permissions-guide/extra/', '/blog/unknown/', '/assets/screen-network.webp']) {
  assert.equal(resolve(unknown), undefined, `Unexpected broad redirect: ${unknown}`);
  checks++;
}
console.log(`Redirect validation passed: ${rules.length} rules, ${checks} route/query/loop checks.`);
