# Privacy Score Web

Static Astro 6 website for the Privacy Score iOS app. English is served at `/`; French at `/fr/`. Canonical origin: `https://www.privacyscore.fr`.

## Develop and verify

Requires Node 22.12+ and pnpm 11 (see packageManager).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test:deployment
pnpm test:browser
```

Browser tests use installed Google Chrome locally; CI may install Playwright Chromium and set `CI=true`. Tests intercept Google requests and never write events to the production Analytics property.

## Source map

- `src/i18n/routes.mjs`: shared canonical pages and historical redirect map.
- `src/config/product.ts`: verified product facts, French launch/renewal prices and public GA4 ID.
- `src/content/blog/{en,fr}`: four published guides per language. `status: draft` excludes a post; `translationKey` pairs actual equivalents.
- `src/components/BlogPost.astro`: article navigation, review dates, author, optimized screenshot, related guides and App Store CTA.
- `src/components/Analytics.astro` and `src/assets/analytics.ts`: consent-controlled website measurement, independent of app report processing.
- `scripts/`: redirect generation, static SEO verification and release packaging.
- `.github/workflows/site.yml`: validate, build and audit `main`, then publish public files to `deploy` for Plesk.

The first app audit is free. Introductory subscription prices apply to the first eligible period in the French App Store, not permanently or worldwide. Apple confirms local purchase terms.

## Analytics

The owner supplied public measurement ID `G-QT0QFTD7L5`, property 559523211. Google loads only after agreement. Consent can be refused or withdrawn from the footer. A public build environment variable `PUBLIC_GA_MEASUREMENT_ID` overrides the default; an explicit empty value disables Analytics. See `.env.example` and `DEPLOY.md` for GA4 configuration and privacy details.

## Release

As on Codevelop, pushing `main` runs GitHub Actions. After successful build, browser and Lighthouse checks, the verified static site is published to `deploy` with its own history, without a force push. Pull requests run the checks without publishing. Only the publication job can write to the repository; no Plesk credentials or webhook are required.

In Plesk, select **`deploy`**, the verified document root (normally `/httpdocs`), no post-deployment actions, and click **Pull Updates** for each release. Automatic mode publishes after the manual pull; Manual mode requires **Deploy now** too. This is distinct from building on the server. Configure the migration's origin redirects and CSP before the first publication. See [deployment setup](DEPLOY.md).

An archive is available as an alternative:

```sh
pnpm release /absolute/path/privacy-score-release.tar.gz
```

The archive contains only public `dist/` files, including `.well-known/`. It does not deploy. Use either the Plesk Git method or the documented atomic archive method for the same target. Keep old hashed assets for cached pages and rollback.

See [deployment instructions](DEPLOY.md), [SEO operations](SEO.md), [current rebuild report](docs/seo-rebuild-2026-10-19.md), and the [historical audit](docs/seo-audit-2026-10-19/README.md).
