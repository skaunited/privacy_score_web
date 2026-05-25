# Astro 6.x Key Features We Use

## Content Layer API (Astro 5.0+, mature in 6.x)

- `glob()` loader replaces the old `defineCollection({type: 'content'})` pattern
- Up to 75% faster builds for content-heavy sites
- Custom loaders for remote content (RSS, CMS, API)
- Live Content Collections in dev (Astro 6 new)

## Server Islands (Astro 6 new)

NOT used in our project (we're 100% static). Mentioned here for reference only:
- Allows mixing static + dynamic on the same page
- `server:defer` directive for SSR'd component within static page
- Requires an adapter — not applicable to us

## Built-in image optimization

`astro:assets` — no integration needed. Uses sharp (or Squoosh in dev).
- `<Image />` for single images with art direction
- `<Picture />` for responsive images with multiple sources
- Auto AVIF/WebP generation
- Auto width/height inference from imports

## View Transitions

Stable since Astro 4, supported in 85%+ browsers (Chrome 126+, Firefox 144+).

```astro
---
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
```

Adds smooth page transitions automatically. Falls back gracefully on unsupported browsers.

## Content Security Policy (Astro 6 new)

Built-in CSP support. Set in `astro.config.mjs`:
```js
csp: {
  algorithm: 'SHA-256',
  scriptDirective: { strictDynamic: true },
}
```

## Markdown pipeline (~5x faster in Astro 6)

Uses unified ecosystem. Custom remark/rehype plugins still work.

## `astro:env` (Astro 5+)

Type-safe environment variables:
```ts
import { defineConfig, envField } from 'astro/config';
export default defineConfig({
  env: {
    schema: {
      SITE_URL: envField.string({ context: 'client', access: 'public' }),
    }
  }
});
```

## i18n routing (mature)

- `prefixDefaultLocale: true` → `/fr/` AND `/en/`, never bare `/`
- `redirectToDefaultLocale: true` → bare `/` redirects to `/fr/`
- `Astro.currentLocale` available in all pages
- `getRelativeLocaleUrl(locale, path)` helper for cross-locale links
