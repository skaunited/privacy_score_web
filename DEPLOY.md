# Publication via GitHub Actions et Plesk

Le circuit principal reprend celui de Codevelop : **push sur `main` → contrôles et build GitHub → branche `deploy` → clic sur Pull Updates dans Plesk**. Le propriétaire garde la main sur la mise en ligne depuis son accès privé au panneau. La méthode par archive décrite plus bas reste une alternative.

## Pipeline GitHub Actions

Le workflow `.github/workflows/site.yml` s'exécute sur les pushes et pull requests vers `main`, ainsi que manuellement avec **Actions → Test, build and publish → Run workflow → main** une fois le workflow fusionné.

1. **Verify and build Astro** installe les dépendances verrouillées avec pnpm 11 et Node 24, teste le mécanisme de publication, construit le site et vérifie le SEO et les redirections. Les tests Chromium contrôlent consentement, accessibilité et navigation mobile sans envoyer d'événements à la propriété Analytics réelle.
2. Le build validé est enregistré dans l'artefact `site-<commit>`, conservé sept jours. Les fichiers cachés publics, dont `.well-known/security.txt`, sont inclus.
3. **Lighthouse mobile and desktop · EN and FR** audite ce même build trois fois dans chacun des quatre scénarios. La performance médiane doit atteindre **95/100**, conformément au budget de ce projet ; les autres catégories doivent atteindre 100 à chaque mesure, le TBT médian rester à 150 ms maximum et le CLS médian à 0,02 maximum. Rapports, traces et résumé sont conservés sept jours dans `lighthouse-<commit>`. Les en-têtes proposés sont appliqués au serveur d'audit local ; cela ne valide pas les en-têtes réellement configurés dans Plesk.
4. **Publish the built site for Plesk** publie l'artefact validé à la racine de `deploy`, sans le reconstruire. Il s'exécute seulement pour `main`, hors pull request, et refuse de remplacer `deploy` par un ancien build si `main` a avancé.

Les exécutions d'une même branche sont sérialisées. Un contrôle échoué empêche la publication. Les pull requests peuvent être contrôlées sans mettre à jour `deploy`.

Si Lighthouse ne parvient pas à enregistrer la trace (`NO_NAVSTART`), seule cette mesure invalide est relancée, au maximum deux fois, avec un nouveau processus et navigateur. Les scores complets, même insuffisants, ne sont jamais relancés pour améliorer la médiane. Les autres erreurs et les timeouts restent bloquants. Chaque tentative conserve ses rapports disponibles et ses journaux `.process.json` dans un dossier d’audit distinct ; `summary.json` et le résumé GitHub rendent les relances visibles. Trois mesures complètes restent obligatoires par scénario ; trois échecs de trace consécutifs empêchent la publication. Cette erreur est également [signalée dans Lighthouse](https://github.com/GoogleChrome/lighthouse/issues/15382).

La première publication crée un historique indépendant de celui des sources. Les suivantes ajoutent un commit normal, **sans force push**. Les anciennes pages disparaissent du build publié ; les anciens fichiers `/_astro/` sont conservés pour les visiteurs disposant d'un HTML en cache. Ne pas nettoyer ces assets sans vérifier les références et les besoins de retour arrière.

Seul le job de publication reçoit `contents: write`, via le jeton temporaire `GITHUB_TOKEN`. Aucun jeton personnel, secret Plesk, webhook ni accès SSH au serveur n'est nécessaire. La variable GitHub facultative `PUBLIC_GA_MEASUREMENT_ID` peut remplacer l'ID public de production ; sinon le workflow utilise `G-QT0QFTD7L5`. Le chargement reste soumis au consentement.

**Une pipeline verte signifie que le build est prêt sur `deploy`. Elle ne signifie pas que Plesk l'a publié.**

## Notifications IndexNow après déploiement

Le workflow séparé **IndexNow - check Plesk and submit** contrôle la production après un build réussi, puis chaque heure si le pull Plesk intervient plus tard. Le job **Check Plesk deployment - no submission** compare le manifeste et le HTML publics à `deploy` et vérifie la preuve d’appartenance. Tant que Plesk n'a pas publié ce build, le résumé affiche **En attente de publication Plesk** et le job **Submit changed URLs to IndexNow** est **ignoré (skipped)**. Il est aussi ignoré si aucun contenu n'a changé depuis le dernier reçu.

Le job de soumission revérifie la production et ne réussit qu'après réception HTTP 200/202 d'un lot non vide : URLs ajoutées/modifiées/retirées depuis le dernier reçu (22 pages au premier envoi). Le workflow ne déclenche pas le pull Plesk et n’exige aucun accès SSH ni secret Bing. Une vérification immédiate peut aussi être lancée avec **Actions → IndexNow - check Plesk and submit → Run workflow → main** après le pull.

Les états `pending-deployment`, `unchanged`, `ready-to-submit`, `submitted` et `error` figurent dans le résumé. L’artefact `indexnow-check-…/check.json` décrit le contrôle sans POST ; `indexnow-…/result.json` décrit un job de soumission exécuté. Les réponses 200/202 confirment une réception, pas l’indexation. Le cache de reçus existant est conservé. Les détails, limites du cache et contrôles Bing sont dans [docs/indexnow.md](docs/indexnow.md).

## Configuration initiale dans Plesk

Avant la première publication, sauvegarder le site et sa configuration. Garder le déploiement Git **Disabled / No deployment** pendant la connexion du dépôt et le choix de la branche, pour éviter de copier les sources de `main` dans le site.

| Réglage | Valeur |
|---|---|
| Dépôt Git distant | `git@github.com:skaunited/privacy_score_web.git` |
| Accès GitHub | Clé publique générée par Plesk, ajoutée en Deploy key **en lecture seule** sur ce dépôt privé si nécessaire |
| Branche | **`deploy`**, disponible après le premier build réussi de `main` |
| Deployment directory | **`/httpdocs`** si c'est le document root actuel du domaine ; vérifier dans Hosting Settings, sans remplacer un autre chemin confirmé |
| Deployment mode | **Automatic** pour publier après le clic manuel sur Pull Updates ; ou Manual puis Deploy now |
| Additional deployment actions | **Désactivées** : aucune installation Node ni compilation côté serveur |
| Webhook externe | Aucun : récupération déclenchée depuis le panneau, comme Codevelop |

Après création de `deploy`, cliquer sur **Pull Updates** pour récupérer les branches, puis **Change branch and path**, sélectionner `deploy` et le document root vérifié. Activer ensuite le mode choisi. Le mode Automatic publie après récupération ; aucun appel depuis GitHub n'est configuré pour déclencher cette récupération.

Le site utilise Nginx : les règles HTTP 301 de migration et la CSP Analytics restent à intégrer dans les réglages existants, selon la section « Prepare the origin configuration » ci-dessous. Elles ne sont pas des fichiers publics et ne sont pas copiées dans `deploy`. `.well-known/security.txt` doit être présent sans effacer les fichiers ACME gérés par l'hébergeur.

## Publier une nouvelle version

1. Fusionner/pousser les sources sur `main`, puis attendre la réussite des trois jobs GitHub Actions.
2. Dans **Plesk → privacyscore.fr → Git**, vérifier la branche **`deploy`**, puis cliquer sur **Pull Updates / Pull now**.
3. Avec le mode Automatic, les fichiers sont publiés après récupération. Avec Manual, cliquer ensuite sur **Deploy from Repository / Deploy now**.
4. Vérifier le journal, les pages, les anciennes URLs en 301, le sitemap et les événements GA4 consentis. Ajuster/purger le cache Cloudflare si nécessaire.

Plesk copie le build dans le document root ; ce mécanisme ne garantit pas une bascule atomique de tout le site. Garder une sauvegarde de la version précédente. L'alternative par archive et lien atomique ci-dessous reste disponible pour un hébergement configuré en ce sens ; les deux méthodes ne doivent pas piloter simultanément le même document root.

Pour revenir en arrière, faire un `git revert` du changement sur `main`, laisser la pipeline préparer un nouveau build et le récupérer depuis Plesk. Ne pas éditer `deploy` manuellement. Un retour à une version antérieure à la migration doit aussi restaurer les règles de routage correspondantes pour éviter les boucles.

Si la publication GitHub échoue, vérifier que la politique du dépôt autorise `contents: write` et que la protection de `deploy` autorise GitHub Actions. Si l'interface ne propose pas encore le workflow, vérifier qu'il est fusionné dans `main`. Relancer une ancienne exécution réutilise son ancien code ; lancer une nouvelle exécution de `main` pour prendre les derniers réglages.

Références : [GitHub : déclenchement et GITHUB_TOKEN](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow), [Plesk : dépôt distant, branche, Pull Updates et modes de publication](https://docs.plesk.com/en-US/obsidian/customer-guide/git-support/using-remote-git-hosting.75848/).

## Archive de secours et configuration serveur

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

Before changing server trust settings, see [the authenticated Plesk 521 diagnostic](docs/origin-521-2026-10-19.md). `deploy/cloudflare-realip.nginx.conf` was manually installed at `/etc/nginx/conf.d/cloudflare-realip.conf` on October 19, with the owner's explicit approval, and the four identified Cloudflare relays were unbanned. The GPTBot filter change was deferred. This is a separate global HTTP-context configuration; it is not part of the domain's generated Additional nginx directives and must not be published to the document root or installed by the website pipeline. Its scope, validation, private backup location and rollback are documented in that report. Review its trusted CIDRs against the official Cloudflare lists when those lists change.

For the Additional nginx directives supplied by the owner on October 19, use **`deploy/plesk-additional.nginx.conf` as the complete replacement for that field**. Do not append it to the old text or paste the two component snippets a second time. It combines slash normalization, the generated migration redirects, custom 404 routing, the existing HSTS/COOP/CORP policies, the consent-compatible Analytics CSP, and cache settings. English `/` remains a 200 page, with no browser-language redirect. The generator and `--check` keep this combined file synchronized with the route registry and security snippet.

HTML is revalidated (`no-cache`); hashed `/_astro/` assets retain a year of caching with `immutable`, and stable `/assets/` files use one hour. No `map` at http level or extra location block is required. Review the effective Plesk locations: their own headers/expiration directives can override server-level inheritance. Validate the panel's merged configuration before saving and check live GET responses afterward.

The combined snippet was syntax-tested with an isolated local Nginx 1.30.6, then exercised through 210 HTTP requests for routes, queries, loops, duplicate slashes, cache headers and 404s. This does not validate the server's complete effective vhost. See [the October 19 production diagnostic](docs/production-routing-2026-10-19.md) for the English-switch observation and one-time browser-cache checks.

The authoritative route registry is `src/i18n/routes.mjs`. `scripts/generate-redirects.mjs` generates `deploy/redirects.nginx.conf` from that registry and the published article routes. Keep the generated file synchronized when adding a route.

If maintaining the component snippets separately instead of using the full replacement, merge `deploy/redirects.nginx.conf` into **Plesk > Websites & Domains > Apache & nginx Settings > Additional nginx directives**. These are server-level `if`/`return 301` rules, with no duplicate `location /` or `location = /404.html` block. Each old URL, its slashless form, and its explicit `index.html` form points directly to its new canonical URL. Query strings are preserved. Canonical slash and explicit-index normalization uses the original `$request_uri`, avoiding loops when Nginx internally serves `index.html`.

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
