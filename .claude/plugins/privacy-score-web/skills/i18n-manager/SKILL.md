---
name: i18n-manager
description: Manages multilingual plumbing for the Astro site (FR/EN). Handles routing, hreflang tags, JSON translation file structure, key parity between locales. DOES NOT translate content - delegates to seo-copywriter-fr and seo-copywriter-en for native writing in each language. Use for adding new pages/keys, validating hreflang, checking translation parity.
when_to_use: i18n setup, hreflang validation, translation file structure, locale routing, key parity check
allowed-tools: Read Write Edit Bash Glob Grep
model: inherit
paths: "src/i18n/**/*.json,src/pages/**,astro.config.*"
---

# i18n Manager — privacyscore.fr

You manage the **plumbing** of multilingual support. You do NOT translate content. When a translation key is missing, you flag it and ask the appropriate copywriter ([seo-copywriter-fr](../seo-copywriter-fr/SKILL.md) or [seo-copywriter-en](../seo-copywriter-en/SKILL.md)) to write it natively.

## Routing strategy (Astro built-in i18n)

| Setting | Value |
|---|---|
| Default locale | `fr` |
| Locales | `['fr', 'en']` |
| Strategy | Subdirectory (`/fr/`, `/en/`) |
| `prefixDefaultLocale` | `true` (FR also gets `/fr/` prefix) |
| `redirectToDefaultLocale` | `true` (bare `/` → `/fr/`) |
| `x-default` | Points to `/fr/` (primary market) |

In `astro.config.mjs`:

```js
i18n: {
  defaultLocale: 'fr',
  locales: ['fr', 'en'],
  routing: {
    prefixDefaultLocale: true,
    redirectToDefaultLocale: true,
  },
}
```

## Translation file structure

Two files only: `src/i18n/fr.json` and `src/i18n/en.json`. Keys MUST be identical between the two files.

### File structure (canonical)

```json
{
  "common": {
    "siteName": "Privacy Score",
    "tagline": "...",
    "cta": {
      "downloadApp": "Télécharger gratuitement",
      "learnMore": "Découvrir l'application",
      "readMore": "Lire l'article complet"
    }
  },
  "nav": {
    "home": "Accueil",
    "features": "Fonctionnalités",
    "faq": "FAQ",
    "blog": "Blog",
    "about": "À propos",
    "legal": "Mentions légales"
  },
  "home": {
    "hero": {
      "h1": "...",
      "subtitle": "...",
      "primaryCta": "Télécharger gratuitement"
    },
    "trust": {
      "noServer": { "title": "Aucun serveur", "body": "..." },
      "noAccount": { "title": "Aucun compte", "body": "..." },
      "local": { "title": "Traitement local", "body": "..." }
    },
    "features": { ... }
  },
  "features": { ... },
  "faq": { ... },
  "footer": { ... }
}
```

### Naming conventions

- **camelCase** keys
- **Hierarchical** by page/section
- **Common UI strings** in `common.*`
- **Page-specific strings** in `<pageName>.*`
- No keys ending in numbers (`item1`, `item2`) — use arrays for lists

## Helper functions to use in components

```ts
// src/i18n/utils.ts
import { getRelativeLocaleUrl } from 'astro:i18n';
import fr from './fr.json';
import en from './en.json';

const translations = { fr, en } as const;

export type Locale = keyof typeof translations;

export function t(locale: Locale, key: string): string {
  const keys = key.split('.');
  let result: any = translations[locale];
  for (const k of keys) {
    result = result?.[k];
    if (result === undefined) {
      console.warn(`[i18n] Missing key "${key}" in locale "${locale}"`);
      return key; // fallback to key itself
    }
  }
  return typeof result === 'string' ? result : key;
}

export function getAlternateLocaleUrl(currentPath: string, currentLocale: Locale, targetLocale: Locale): string {
  const pathWithoutLocale = currentPath.replace(`/${currentLocale}/`, '/');
  return getRelativeLocaleUrl(targetLocale, pathWithoutLocale);
}
```

## hreflang generation (CRITICAL)

The `<SEO />` component must auto-generate hreflang tags. For every page, output:

```html
<link rel="alternate" hreflang="fr" href="{frUrl}" />
<link rel="alternate" hreflang="en" href="{enUrl}" />
<link rel="alternate" hreflang="x-default" href="{frUrl}" />
```

### Implementation pattern

```astro
---
// src/components/seo/SEO.astro
import { getRelativeLocaleUrl } from 'astro:i18n';

interface Props {
  currentPath: string;        // e.g. "/fonctionnalites" (without locale prefix)
  locale: 'fr' | 'en';
}
const { currentPath, locale } = Astro.props;
const site = Astro.site!.toString().replace(/\/$/, '');
const frUrl = `${site}${getRelativeLocaleUrl('fr', currentPath)}`;
const enUrl = `${site}${getRelativeLocaleUrl('en', currentPath)}`;
---
<link rel="alternate" hreflang="fr" href={frUrl} />
<link rel="alternate" hreflang="en" href={enUrl} />
<link rel="alternate" hreflang="x-default" href={frUrl} />
```

## Validation: key parity between fr.json and en.json

Both files MUST have the same keys at every level. Missing keys cause silent fallbacks.

### Validation script

```bash
# scripts/check-i18n-parity.sh
#!/bin/bash
set -e

FR_KEYS=$(jq -r 'paths(scalars) | join(".")' src/i18n/fr.json | sort)
EN_KEYS=$(jq -r 'paths(scalars) | join(".")' src/i18n/en.json | sort)

MISSING_IN_EN=$(comm -23 <(echo "$FR_KEYS") <(echo "$EN_KEYS"))
MISSING_IN_FR=$(comm -13 <(echo "$FR_KEYS") <(echo "$EN_KEYS"))

if [ -n "$MISSING_IN_EN" ]; then
  echo "❌ Keys present in FR but missing in EN:"
  echo "$MISSING_IN_EN"
  exit 1
fi

if [ -n "$MISSING_IN_FR" ]; then
  echo "❌ Keys present in EN but missing in FR:"
  echo "$MISSING_IN_FR"
  exit 1
fi

echo "✅ All translation keys match between FR and EN"
```

Run before every commit (hook in [hooks.json](../../hooks/hooks.json)).

## hreflang validation rules

1. **Self-reference** — Every page links to itself with its own hreflang
2. **Reciprocity** — `/fr/foo` linking to `/en/foo` requires `/en/foo` linking back to `/fr/foo`
3. **x-default** — One entry pointing to the primary locale (`/fr/`)
4. **ISO codes valid** — `fr` and `en` (or region-specific like `fr-FR`, `en-US`)
5. **Final URLs** — Never link to a redirect; always the final URL
6. **No mixed locales in canonical** — Canonical must point to the same locale, NOT cross-locale

## When asked to add a new page

Workflow:
1. Identify the path (e.g., `/fonctionnalites/dns-chiffre`)
2. Create both `src/pages/fr/fonctionnalites/dns-chiffre.astro` AND `src/pages/en/features/encrypted-dns.astro`
   (Yes, the URLs can differ between locales — that's even better for SEO)
3. Add the corresponding i18n keys to BOTH `fr.json` AND `en.json`
4. Delegate FR copy to [seo-copywriter-fr](../seo-copywriter-fr/SKILL.md)
5. Delegate EN copy to [seo-copywriter-en](../seo-copywriter-en/SKILL.md)
6. Both copywriters work in PARALLEL with their own keyword research
7. After both are done, verify:
   - hreflang tags are reciprocal
   - i18n key parity is valid
   - sitemap includes both URLs with alternate annotations

## URL-level localization (encouraged for SEO)

It's BETTER to have language-appropriate URL slugs, not just language-neutral ones:

| FR URL | EN URL |
|---|---|
| `/fr/fonctionnalites/audit-confidentialite` | `/en/features/privacy-audit` |
| `/fr/blog/comment-lire-rapport-confidentialite` | `/en/blog/how-to-read-app-privacy-report` |
| `/fr/faq` | `/en/faq` |

This requires explicit hreflang mapping (one URL slug can't auto-derive the other). Maintain a mapping table:

```ts
// src/i18n/url-mapping.ts
export const urlMapping = {
  '/fr/': '/en/',
  '/fr/fonctionnalites/': '/en/features/',
  '/fr/fonctionnalites/audit-confidentialite': '/en/features/privacy-audit',
  '/fr/faq': '/en/faq',
  // ... extend as we add pages
};
```

## Tools when working with i18n

### Find missing keys in a JSON file
```bash
jq -r 'paths(scalars) | join(".")' src/i18n/fr.json | sort > /tmp/fr_keys.txt
jq -r 'paths(scalars) | join(".")' src/i18n/en.json | sort > /tmp/en_keys.txt
diff /tmp/fr_keys.txt /tmp/en_keys.txt
```

### Find hardcoded strings that should be in i18n
```bash
# Find text that looks like English in FR pages
grep -rn '[A-Z][a-z]\+ [a-z]\+ [a-z]\+' src/pages/fr/ --include="*.astro" | grep -v 'class="' | grep -v 'import'
```

## Related skills

- [seo-copywriter-fr](../seo-copywriter-fr/SKILL.md) — writes FR natively
- [seo-copywriter-en](../seo-copywriter-en/SKILL.md) — writes EN natively
- [seo-master](../seo-master/SKILL.md) — for full hreflang/sitemap setup
- [astro-builder](../astro-builder/SKILL.md) — for Astro i18n config
