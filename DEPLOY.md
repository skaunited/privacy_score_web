# Deployment and URL migration

Current target: Astro static output on the existing Plesk VM, with Cloudflare in front. The canonical origin is **https://www.privacyscore.fr**. English is served at `/`; French stays under `/fr/`. The origin host, certificates, document-root permissions, Plesk-generated routing, and Cloudflare rules must be inspected before applying server changes.

## Build a reviewable release

Use the Node and pnpm versions declared in `package.json` and the lockfile:

```bash
pnpm install --frozen-lockfile
node scripts/generate-redirects.mjs
node scripts/check-redirects.mjs
pnpm build
python3 scripts/check-seo.py
node scripts/generate-redirects.mjs --check
```

Alternatively, `bash scripts/package-release.sh /absolute/private/path/privacy-score-release.tar.gz` builds, validates, and packages the contents of `dist/`, including `.well-known/`. It creates a checksum beside the archive and refuses to overwrite an existing archive. The command does not contact the server. Keep the archive and server configuration outside the public document root.

Required output includes `index.html`, `fr/index.html`, eight published article pages, legal/about pages, both sitemaps, `robots.txt`, `404.html`, assets, and the old-path redirect stubs. Stubs are only a static-host fallback; the migration requires actual HTTP 301 responses at the origin.

The owner supplied Privacy Score measurement ID **G-QT0QFTD7L5** (property **559523211**). It is the production default in `src/config/product.ts`; `PUBLIC_GA_MEASUREMENT_ID` can override it, and an explicitly empty value disables analytics. The loader waits for consent. Test the final CSP and consented events on the deployed build. In GA4 Admin, set event-data retention to two months, disable unnecessary Enhanced Measurement automatic events to avoid duplicate App Store clicks, and register `app_store_click` as a key event. These property settings cannot be set by static website code. The current Analytics connector returns 403 for this newly created property; grant/reconnect read access if remote reporting is wanted.

## Prepare the origin configuration

The authoritative route registry is `src/i18n/routes.mjs`. `scripts/generate-redirects.mjs` generates `deploy/redirects.nginx.conf` from that registry and the published article routes. Keep the generated file synchronized when adding a route.

In **Plesk > Websites & Domains > Apache & nginx Settings > Additional nginx directives**, merge the reviewed content of `deploy/redirects.nginx.conf` with the existing configuration. These are server-level `if`/`return 301` rules, with no duplicate `location /` or `location = /404.html` block. Each old URL, its slashless form, and its explicit `index.html` form points directly to its new canonical URL. Query strings are preserved. Canonical slash and explicit-index normalization uses the original `$request_uri`, avoiding loops when Nginx internally serves `index.html`.

Review `deploy/plesk-security.nginx.conf` separately and **merge the policy into the effective existing headers**. Do not stack several Content-Security-Policy headers: browsers enforce all of them, so an older policy can still block Analytics. Nginx `add_header` inheritance also changes when a location sets its own headers; inspect the effective response on HTML and assets. The proposed policy permits the Google tag loader and regional Analytics endpoints, retains `font-src 'self'`, and preserves inline-script compatibility. Allowing a host in CSP does not authorize collection; the client must still wait for analytics consent.

Retain Plesk's valid 404 behavior: an unknown path must respond **404**, rather than falling back to the homepage with status 200. Do not install the standalone vhost or certificate commands from historical skill examples over the panel-managed configuration. Test the merged origin configuration with `nginx -t` using the server's configured Nginx binary before reloading through Plesk.

Configure the preferred host in Plesk/Cloudflare as `www.privacyscore.fr`, with HTTPS. Keep Cloudflare SSL set appropriately for the existing authenticated TLS origin; review any current redirect rules so they do not send `www` back to the apex. A host redirect may add a hop before the path redirect; avoid loops and keep each path migration direct on the canonical host.

## Cache and staging policy

Merge these behaviors into the locations already managed by Plesk and the Cloudflare cache rules. Do not add broad competing locations without reviewing the generated vhost.

| Response | Intended cache policy |
|---|---|
| HTML, including directory pages | `Cache-Control: no-cache` so clients revalidate |
| Sitemaps and robots.txt | Short TTL, for example 300 seconds during migration |
| Hashed Astro assets under `/_astro/` | `public, max-age=31536000, immutable` |
| Stable filenames under `/assets/` | Short TTL, for example 3600 seconds; purge changed URLs when needed |
| Future versioned images with content hashes | Long caching only when the filename changes with content |

Cloudflare must honor the HTML policy; remove any conflicting “cache everything” rule for pages or explicitly bypass HTML caching. Preserve self-hosted fonts and avoid external font CDNs. Do not enable Brotli directives unless the origin module is available; Cloudflare can compress responses independently.

Validate the release on a staging host or temporary protected document root. Protect staging with authentication or an HTTP `X-Robots-Tag: noindex` header; do not carry that header onto production. Keep production canonicals in the production artifact. Previewing static files does not validate origin redirects, TLS, CSP, or status codes.

## Upload and switch atomically

Use the Plesk subscription's actual paths and user. The example below assumes a reviewed document root pointing to `/var/www/vhosts/privacyscore.fr/current`, with `releases/` and `current` on the **same filesystem**. Establish that layout through Plesk first; do not replace an existing live directory blindly. Confirm Plesk permits these owner-controlled symlinks.

1. Upload the archive to a private directory, verify its checksum, and extract it into a **new** release directory.
2. Preserve the previous release and its configuration. Copy its hashed assets into the candidate with `--ignore-existing`, so cached HTML from older releases continues to resolve its CSS, JavaScript, and fonts.
3. Check permissions, the candidate's files, and the origin configuration. Switch the `current` symlink using one atomic rename, then run the HTTP checks below.

Example commands run **on the Linux server after adjusting the paths**:

```bash
site_base=/var/www/vhosts/privacyscore.fr
release_id=20261019T120000
release_dir="$site_base/releases/$release_id"
previous_dir=$(readlink -f "$site_base/current")
mkdir -p "$release_dir"
tar -xzf /private/upload/privacy-score-release.tar.gz -C "$release_dir"
rsync -a --ignore-existing "$previous_dir/_astro/" "$release_dir/_astro/"
ln -s "$release_dir" "$site_base/current.next-$release_id"
mv -Tf "$site_base/current.next-$release_id" "$site_base/current"
```

The final `mv -T` is GNU/Linux syntax. An ordinary sequence that deletes the active symlink before creating a new one is not atomic. If the hosting arrangement cannot use symlinks, stage a complete release and use the host's reviewed atomic document-root switch; do not upload page-by-page over the live tree.

Never delete the live `_astro/` directory before uploading. Retain hashes referenced by all retained releases and cached pages. Asset cleanup is separate maintenance, after checking references and rollback needs. Stable image names need a short cache policy because old and new releases can reference the same URL with different bytes.

## Verify the deployed migration

Use GET requests as well as HEAD, against both Cloudflare and the origin where access permits. Check representative cases:

```bash
curl -sS -o /dev/null -D - https://www.privacyscore.fr/
curl -sS -o /dev/null -D - https://www.privacyscore.fr/fr/
curl -sS -o /dev/null -D - 'https://www.privacyscore.fr/en/blog/iphone-permissions-guide/?utm_source=migration'
curl -sS -o /dev/null -D - https://www.privacyscore.fr/blog/iphone-permissions-guide
curl -sS -o /dev/null -D - https://www.privacyscore.fr/blog/iphone-permissions-guide/index.html
curl -sS -o /dev/null -D - https://www.privacyscore.fr/a-page-that-does-not-exist/
curl -sS -o /dev/null -D - https://www.privacyscore.fr/sitemap-index.xml
```

Expect 200 on final canonical pages, 301 with the direct final `Location` on migrated/normalized paths, and 404 on the unknown URL. The canonical `/blog/iphone-permissions-guide/` must return 200 without a redirect loop. Test every entry in the generated manifest, both host variants, query preservation, and French aliases. Check effective CSP/cache headers and an actual hashed asset from the deployed HTML rather than an old example filename.

After switching, purge Cloudflare's cached HTML, sitemaps, robots, and changed stable-image URLs as needed. Confirm old paths still return 301 at the edge. Retain redirects indefinitely rather than deleting them when old pages leave the index.

In a clean browser, verify no Google requests occur before consent or after refusal; acceptance should load the configured property and record a page view and an App Store click. Withdrawal must stop further collection. An App Store click is not an attributed installation. Validate the configured property's real-time/DebugView data before declaring Analytics operational.

Submit the current sitemap in Search Console after confirming the live artifact. Request inspection of the final article URLs when useful. Do not submit obsolete `/en/` URLs for indexing, remove the blog from the sitemap, or block old paths in robots.txt, since crawlers need to discover their redirects.

## Roll back

Keep the previous release path and matching origin configuration. Before pointing `current` back, copy the current release's hashed assets into the previous release using `rsync -a --ignore-existing`; this preserves URLs referenced by clients who received the newer HTML. Switch the symlink atomically in the same manner, restore the reviewed matching server settings if necessary, and repeat the HTTP checks. Purge affected edge HTML so the rollback is visible.

If a migrated release is rolled back to a pre-migration site, its route/redirect configuration must be rolled back as a unit: leaving `/en/ -> /` redirects while restoring an old `/ -> /fr/` or locale-sniffing root can create incorrect paths or loops. Keep redirects consistent with the artifact actually being served.

Only built public files belong in the document root. Source, `.env`, repository metadata, archives, private reports, and server snippets stay outside it. The existing `docs/seo-audit-2026-10-19/` is historical evidence, not a deployable directory.

Reference behavior: [Nginx rewrite/return](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html) and [Nginx request variables](https://nginx.org/en/docs/http/ngx_http_core_module.html#var_request_uri). Server syntax and the effective Plesk configuration must be validated on the origin; the local regex checks do not replace `nginx -t`.
