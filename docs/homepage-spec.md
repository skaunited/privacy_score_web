# Homepage spec — privacyscore.fr

> **Source of truth design:** `privacy-score-web-design/project/variation-illustrated.html` (1616 lines, "Illustré" variation). Every section below references that file by line range. The CSS lives in `privacy-score-web-design/project/assets/ds.css` and `…/assets/site.css` — both files have already been copied to `src/styles/ds.css` and `src/styles/site.css` and are imported globally from `src/layouts/BaseLayout.astro`.
>
> **Site URLs:** `https://privacyscore.fr/fr/` (primary) and `https://privacyscore.fr/en/`. Root `/` is a client-side Accept-Language sniffer (no-index).
>
> **Verified product facts** come from `APP_RECAP.md`. Every `[UNVERIFIED]` flag in `APP_RECAP.md` is repeated here and must NOT silently turn into a claim in copy.
>
> **Scope of this spec:** the homepage only, both locales. Out of scope (for later phases): FAQ standalone page, legal pages, blog.

---

## Component tree

```
src/pages/
├── index.astro                 ← root /, client-side locale sniffer, noindex
├── 404.astro                   ← bilingual 404
├── fr/
│   └── index.astro             ← /fr/ — wires BaseLayout + sections, dict = getDictionary('fr')
└── en/
    └── index.astro             ← /en/ — wires BaseLayout + sections, dict = getDictionary('en')

each fr|en/index.astro renders:
┌─ BaseLayout (locale, title, description, jsonLd[])
│  ├─ <SEO />                                            (auto via BaseLayout)
│  ├─ <Header               nav={dict.nav} />
│  ├─ <HeroSection          hero={dict.hero}        locale={locale} />
│  ├─ <StoryboardSection    story={dict.story}     chapters={dict.chapters} />
│  ├─ <ProductIntroSection  product={dict.product} chapters={dict.chapters} />
│  ├─ <HowItWorksSection    how={dict.how}         chapters={dict.chapters} />
│  ├─ <AnglesSection        angles={dict.angles}   chapters={dict.chapters} />
│  ├─ <ManifestoSection     manifesto={dict.manifesto} chapters={dict.chapters} />
│  ├─ <TrustQuoteSection    quote={dict.quote} />
│  ├─ <MetricsSection       metrics={dict.metrics} />
│  ├─ <FAQSection           faq={dict.faq} />
│  ├─ <CTASection           cta={dict.cta} />
│  └─ <Footer               footer={dict.footer} />
└─ </BaseLayout>
```

All section components live under `src/components/sections/`.

---

## i18n dictionary shape

Both `src/i18n/fr.json` and `src/i18n/en.json` MUST match this shape exactly. **Copywriters write values; they do not change keys.** Where a value is annotated `[HTML-SAFE]`, the spec-developer renders that value with Astro's `set:html` (no auto-escape) — `<strong>`, `<em>`, `<br/>` are the only tags allowed. Where a value is annotated `[PLAIN]`, the spec-developer interpolates it normally and Astro will escape it.

Sample values shown are FR (from the design); EN values are written natively by `seo-copywriter-en` (not translated).

```ts
type Dictionary = {
  // ───────────── Document-level metadata ─────────────
  meta: {
    title: string;            // [PLAIN] e.g. "Privacy Score — Reprenez le contrôle de vos données."
    description: string;      // [PLAIN] ≤ 160 chars
    ogTitle?: string;         // [PLAIN] optional, defaults to meta.title
    ogDescription?: string;   // [PLAIN] optional, defaults to meta.description
  };

  // ───────────── Chapter etiquette (shared across sections) ─────────────
  chapters: {
    word: string;             // [PLAIN] "Chapitre" / "Chapter"
    story:   { label: string }; // [PLAIN] "L'histoire" / "The story"
    product: { label: string }; // [PLAIN] "Le produit" / "The product"
    method:  { label: string }; // [PLAIN] "La méthode" / "The method"
    app:     { label: string }; // [PLAIN] "L'app"      / "The app"
    promise: { label: string }; // [PLAIN] "La promesse"/ "The promise"
  };

  // ───────────── Header ─────────────
  nav: {
    brand: string;            // [PLAIN] "Privacy Score" (proper noun, identical in both locales)
    aria: {
      brand: string;          // [PLAIN] aria-label for brand link, e.g. "Privacy Score — home"
      switcher: string;       // [PLAIN] aria-label for language switcher
    };
    links: {
      story: string;          // [PLAIN] "L'histoire"
      app: string;            // [PLAIN] "L'app"
      trust: string;          // [PLAIN] "Confiance"
      download: string;       // [PLAIN] "Télécharger"
    };
    cta: string;              // [PLAIN] CTA pill label, "Télécharger"
    switcher: {
      fr: string;             // [PLAIN] "FR"
      en: string;             // [PLAIN] "EN"
    };
  };

  // ───────────── Hero ─────────────
  hero: {
    overline: string;         // [PLAIN] "Disponible sur l'App Store"
    title: {
      line1Pre: string;       // [PLAIN] "Vous pensez être "
      line1Em: string;        // [PLAIN] italic word, "anonyme"
      line1Post: string;      // [PLAIN] "."
      line2Pre: string;       // [PLAIN] "Vous ne l'êtes "
      line2Strike: string;    // [PLAIN] strike-through word, "pas"
      line2Post: string;      // [PLAIN] "."
    };
    lede: string;             // [HTML-SAFE] contains <strong>. e.g. "Chaque app... <strong>Privacy Score</strong>..."
    ctas: {
      primary: string;        // [PLAIN] "Télécharger sur l'App Store"
      ghost: string;          // [PLAIN] "Voir comment"
    };
    pillars: {                // exactly 3
      cloud:  { title: string; sub: string }; // [PLAIN] "Aucun serveur" / "Rien ne quitte votre appareil."
      person: { title: string; sub: string };
      phone:  { title: string; sub: string };
    };
    phone: {                  // phone mockup labels
      statusbarTime: string;  // [PLAIN] "09:41"
      dashboardTitle: string; // [PLAIN] "Dashboard"
      statusOverline: string; // [PLAIN] "Statut"
      statusValue: string;    // [PLAIN] "Appareil protégé"
      gaugeGrade: string;     // [PLAIN] "Bon"
      metaBrand: string;      // [PLAIN] "Privacy Score"
      metaDetail: string;     // [HTML-SAFE] allows &nbsp;. e.g. "909 traceurs détectés, 5 apps&nbsp;géolocalisées."
      cta: string;            // [PLAIN] "Améliorer le score"
    };
    chips: {                  // 2 floating chips
      trackers: {
        label: string;        // [PLAIN] "Traceurs bloqués aujourd'hui"
        countTo: number;      // 2487 — passed as data-count-to (locale-independent integer)
      };
      dns: {
        label: string;        // [PLAIN] "DNS chiffré"
        value: string;        // [PLAIN] "Actif"
      };
    };
    scrollCue: string;        // [PLAIN] "Faites défiler"
  };

  // ───────────── Storyboard (chapter 01/05) ─────────────
  story: {
    overline?: string;        // [PLAIN] optional small overline above title (design does NOT use one here — keep optional)
    title: {
      pre: string;            // [PLAIN] "En 2024, des journalistes ont identifié "
      hi: string;             // [PLAIN] highlighted span, "26 agents du Secret Service"
      post: string;           // [PLAIN] " — en achetant des données publicitaires."
    };
    intro: string;            // [PLAIN] sub paragraph under h2
    panels: [Panel, Panel, Panel, Panel, Panel, Panel, Panel, Panel]; // exactly 8
    pivot: {
      // "Vous ne pouvez pas <em>supprimer</em> ces données. Mais vous pouvez <strong>arrêter d'en produire.</strong>"
      line1Pre: string;       // [PLAIN] "Vous ne pouvez pas "
      line1Em: string;        // [PLAIN] em (red), "supprimer"
      line1Post: string;      // [PLAIN] " ces données."
      line2Pre: string;       // [PLAIN] "Mais vous pouvez "
      line2Strong: string;    // [PLAIN] strong (blue), "arrêter d'en produire."
    };
  };

  // each Panel:
  //   tag       — short uppercase pill text (e.g. "Jan 2024", "Marché ouvert")
  //   tagStyle  — discriminated by spec-developer from a fixed enum, NOT user-editable. See section 3.
  //   captionStrong — title line of caption
  //   caption       — body line(s) of caption

  // Inline in dict but flattened:
  //   story.panels[i] = {
  //     tag: string;            // [PLAIN]
  //     captionStrong: string;  // [PLAIN]
  //     caption: string;        // [PLAIN]
  //   }
  // Position (tl/tr/bl/br) and alert flag come from the component, NOT the dict.

  // ───────────── Product intro (chapter 02/05) ─────────────
  product: {
    title: {
      line1: string;          // [PLAIN] "Un score sur 100."
      line2: string;          // [PLAIN] "Trois actions concrètes."
      line3: string;          // [PLAIN] "Aucun discours alarmiste."
    };
    body: string;             // [HTML-SAFE] contains <strong>. "Privacy Score lit le <strong>Rapport de Confidentialité</strong>..."
    bullets: [string, string, string, string]; // [PLAIN] exactly 4
    phoneAlt: string;         // [PLAIN] alt text for screen-dashboard.png
  };

  // ───────────── How it works (chapter 03/05) ─────────────
  how: {
    title: string;            // [PLAIN] "Trois étapes. Soixante secondes. Hors-ligne."
    steps: [Step, Step, Step]; // exactly 3
  };
  // Step = {
  //   title: string;          // [PLAIN] e.g. "Exportez votre Rapport"
  //   body: string;           // [HTML-SAFE] allows <strong>, <em>, &nbsp;
  //   meta: string;           // [HTML-SAFE] e.g. "Format&nbsp;: .ndjson · 100% Apple"
  // }

  // ───────────── Angles / the 4 tabs (chapter 04/05) ─────────────
  angles: {
    title: string;            // [PLAIN] "Quatre onglets. Quatre angles sur votre exposition."
    cards: [AngleCard, AngleCard, AngleCard, AngleCard]; // exactly 4
  };
  // AngleCard = {
  //   callout: string;        // [PLAIN] short uppercase pill, e.g. "Vue d'ensemble"
  //   title: string;          // [PLAIN] "Dashboard"
  //   body: string;           // [PLAIN] short paragraph
  //   meta: string;           // [PLAIN] dashed footer, "Score · Statuts · 7 vecteurs"
  //   imageAlt: string;       // [PLAIN] alt text
  // }

  // ───────────── Manifesto (chapter 05/05) ─────────────
  manifesto: {
    title: {
      line1: string;          // [PLAIN] "Ce que Privacy Score"
      negLine: string;        // [PLAIN] red emphasis, "ne fait pas."
    };
    body: string;             // [PLAIN] paragraph under title
    cards: [ManCard, ManCard, ManCard, ManCard]; // exactly 4
  };
  // ManCard = {
  //   title: string;          // [PLAIN] UPPERCASE (CSS uppercases for us), "Pas de serveur"
  //   body: string;           // [PLAIN]
  //   code: string;           // [PLAIN] mono chip, "URLSession · 0"
  // }

  // ───────────── Trust quote ─────────────
  quote: {
    body: string;             // [HTML-SAFE] contains <em>. e.g. "Privacy Guard ne voit jamais votre trafic. Il vous montre ce que les <em>autres</em> en voient."
    attribution: string;      // [PLAIN] "— Pied de page de l'écran Réglages, dans l'app."
  };

  // ───────────── Metrics ─────────────
  metrics: {
    items: [Metric, Metric, Metric, Metric]; // exactly 4
  };
  // Metric = {
  //   countTo: number;        // integer, 0 is allowed (e.g. "0 octet envoyé")
  //   label: string;          // [PLAIN]
  // }

  // ───────────── FAQ ─────────────
  faq: {
    overline: string;         // [PLAIN] "Questions fréquentes"
    title: string;            // [PLAIN] "Tout ce que vous vous demandez encore."
    items: FaqItem[];         // exactly 5 (length-locked)
  };
  // FaqItem = {
  //   q: string;              // [PLAIN] question
  //   a: string;              // [HTML-SAFE] allows <em>, <strong>, &nbsp;
  // }

  // ───────────── Final CTA ─────────────
  cta: {
    title: string;            // [PLAIN] "Reprenez le contrôle de vos données."
    body: string;             // [PLAIN]
    primary: string;          // [PLAIN] "Télécharger sur l'App Store"
    note: string;             // [HTML-SAFE] allows &amp; / &nbsp;. "iPhone · iPadOS 17+ · gratuit · français & anglais"
  };

  // ───────────── Footer ─────────────
  footer: {
    tagline: string;          // [PLAIN] "Une app indépendante, faite en France..."
    columns: {
      app: {
        heading: string;      // [PLAIN] "App"
        links: { label: string; href: string }[]; // 3 items
      };
      legal: {
        heading: string;      // [PLAIN] "Légal"
        links: { label: string; href: string }[]; // 3 items
      };
      contact: {
        heading: string;      // [PLAIN] "Contact"
        links: { label: string; href: string }[]; // 3 items
      };
    };
    copyright: string;        // [PLAIN] "© 2026 Privacy Score — Made in France"
    version: string;          // [PLAIN] "v 1.4.0 · iOS 17+"   [UNVERIFIED — pull from APP_RECAP §1, current real build is 0.0.7 / 7; ask user before publishing]
  };
};
```

---

## Per-section spec

### 1. Header

- **File:** `src/components/sections/Header.astro`
- **Design ref:** lines 435-452 of `variation-illustrated.html`
- **Props interface:**
  ```ts
  interface Props {
    locale: Locale;            // current locale, drives switcher active state
    pathname: string;          // current URL path, used to build alternate /en/ or /fr/ link
    nav: Dictionary['nav'];
  }
  ```
- **i18n keys consumed:** `nav.*`. The switcher uses `localizedPath()` from `@i18n/utils` to compute the cross-locale URL of the same page.
  - Sample FR values: `nav.links.story = "L'histoire"`, `nav.cta = "Télécharger"`, `nav.switcher.fr = "FR"`, `nav.switcher.en = "EN"`.
- **Inline SVGs:** none. The brand mark is an `<img>` referencing `/assets/app-icon-256.png` (in `public/`). The download icon is a Material Icons round font glyph: `<span class="material-icons-round">download</span>`.
- **Scoped CSS:** **no**. All styles already exist as global classes in `site.css` — `.site-nav`, `.nav-inner`, `.brand`, `.brand-mark`, `.brand-word`, `.nav-links`, `.nav-cta`. **New scoped CSS needed** only for the FR↔EN switcher pill: design did not contain one. Reuse the look of `.var-switch` from `variation-illustrated.html` lines 18-31 — copy that ruleset into a scoped `<style>` block under a new class name `.lang-switch` (don't reuse `.var-switch`, that name belongs to the design preview only). Place it next to (not inside) `.nav-cta`. Mobile: hidden if `<= 760px` (or stacked into the pill) — match the existing `@media (max-width: 760px) { .nav-links { display: none; } }` rule in `site.css`.
- **Notable IDs/classes:**
  - Brand link `<a class="brand" href="/${locale}/" aria-label={nav.aria.brand}>`.
  - Nav anchors point to in-page sections by id: `#story`, `#angles`, `#manifesto`, `#download`. Same hashes in both locales.
  - Lang switcher: render BOTH `fr` and `en` as `<a>` pills; current locale gets `aria-current="page"` AND a class for the active style.
- **Asset references:** `/assets/app-icon-256.png`.
- **Accessibility notes:**
  - `<header class="site-nav" role="banner">`.
  - Brand `<a aria-label={nav.aria.brand}>`.
  - `<nav class="nav-links" aria-label={nav.aria.nav}>` (add `nav.aria.nav` key if missing — spec-developer must add the corresponding key to the dict and the type above, then ping copywriter).
  - Lang switcher wrapped in `<div class="lang-switch" role="group" aria-label={nav.aria.switcher}>`.
  - All Material Icons spans get `aria-hidden="true"`.

---

### 2. HeroSection

- **File:** `src/components/sections/HeroSection.astro`
- **Design ref:** lines 455-591 of `variation-illustrated.html`
- **Props interface:**
  ```ts
  interface Props {
    hero: Dictionary['hero'];
    locale: Locale;        // for `data-locale` on the count target (counter uses 'fr-FR' formatting today; EN needs 'en-US')
  }
  ```
- **i18n keys consumed:** all under `hero.*`.
- **Inline SVGs:**
  - **Gauge SVG** (lines 536-554): extract verbatim into `<svg class="gauge" viewBox="0 0 220 220" aria-hidden="true">…</svg>`. **Do NOT regenerate.** Critical IDs that the global `site.js` reads:
    - `<linearGradient id="gaugeGrad">`
    - `<filter id="gaugeGlow">`
    - `<circle id="gaugeArc" …>` — `stroke-dasharray="578" stroke-dashoffset="578"` — these initial values MUST stay; `site.js` animates `stroke-dashoffset` toward `circ * (1 - 77/100)`.
    - The companion `<div class="gauge-num" id="gaugeNum">0</div>` MUST also keep its id; `site.js` writes its `textContent`.
- **Scoped CSS:** **no**. All hero CSS classes (`.hero`, `.orb`, `.dot-grid`, `.hero-inner`, `.hero-copy`, `.hero-overline`, `.live-dot`, `.hero-title`, `.hero-strike`, `.hero-lede`, `.hero-ctas`, `.btn`, `.btn-primary`, `.btn-ghost`, `.hero-pillars`, `.pillar`, `.pillar-title`, `.pillar-sub`, `.hero-visual`, `.hero-phone`, `.phone-screen`, `.phone-statusbar`, `.phone-rs`, `.phone-h1`, `.phone-status`, `.phone-status-row`, `.status-dot`, `.gauge-card`, `.gauge`, `.gauge-center`, `.gauge-num`, `.gauge-grade`, `.phone-meta`, `.phone-cta`, `.float-chip`, `.chip-trackers`, `.chip-dns`, `.chip-label`, `.chip-value`, `.chip-good`, `.scroll-cue`) live in `site.css`.
- **Notable IDs/classes:**
  - `<section id="top" class="hero">` — `#top` is referenced by the brand link.
  - `#gaugeArc`, `#gaugeNum` — load-bearing.
  - `[data-count-to="2487"]` on the trackers chip span — `site.js` reads `dataset.countTo`.
- **Asset references:** none in the hero (only Material Icons font glyphs).
- **Accessibility notes:**
  - `<section class="hero" aria-labelledby="hero-h1">` and give `<h1 id="hero-h1">`.
  - `<h1>` HTML: render the strikethrough word `pas` / `not` inside `<span class="hero-strike">`. Construct from three i18n parts (`line1Pre` + `<em>` + `line1Post` + `<br/>` + `line2Pre` + `<span class="hero-strike">` + `line2Post`) — spec-developer assembles, copy provides plain strings.
  - All Material Icons spans get `aria-hidden="true"`.
  - `.live-dot` (the green pulse next to the overline) is decorative — no aria.
  - Lede `<p class="hero-lede" set:html={hero.lede} />` — `[HTML-SAFE]`.
  - `.scroll-cue` already has `aria-hidden="true"` in the design — keep it.
  - Two CTAs: primary `<a href="#download" class="btn btn-primary">` and ghost `<a href="#story" class="btn btn-ghost">`. The ghost CTA's hash MUST match the storyboard `id="story"` set on section 3.

---

### 3. StoryboardSection

- **File:** `src/components/sections/StoryboardSection.astro`
- **Design ref:** lines 595-1076 of `variation-illustrated.html`. **Within that range the 8 individual panels are at lines 620-685 (P1), 687-735 (P2), 737-789 (P3), 791-845 (P4), 847-901 (P5), 903-961 (P6), 963-1016 (P7), 1018-1065 (P8).**
- **Props interface:**
  ```ts
  interface Props {
    story:    Dictionary['story'];
    chapters: Dictionary['chapters'];
  }
  ```
- **i18n keys consumed:**
  - `chapters.word`, `chapters.story.label` for the chapter pill.
  - `story.title.pre`, `story.title.hi`, `story.title.post`.
  - `story.intro`.
  - `story.panels[0..7].tag`, `…captionStrong`, `…caption`.
  - `story.pivot.line1Pre`, `.line1Em`, `.line1Post`, `.line2Pre`, `.line2Strong`.
- **Inline SVGs (load-bearing — extract verbatim):**
  Each panel is one `<svg class="scene-svg" viewBox="0 0 200 184" …>`. These are language-INDEPENDENT illustrations and **must be copy-pasted byte-for-byte from the design file**. They contain unique `<defs>` IDs (`ill1-sky`, `ill1-moon`, `ill2-bg`, `ill3-bg`, `ill3-grid`, `redGlow`, `ill5-sky`, `trailGlow`, `ill6-bg`, `leakGlow`, `ill7-burst`, `ill7-ring`, `ringGlow`, `ill8-burst`, `checkGlow`) — these IDs must be preserved unchanged because they are referenced inside the same SVG via `fill="url(#…)"` / `filter="url(#…)"`.

  | Panel | Tag (FR) | Tag style (component-side, not from dict) | Caption strong / body (FR) | SVG design lines |
  | --- | --- | --- | --- | --- |
  | 01 | "Jan 2024"          | `position="tr"`               | "Washington, D.C." / Secret Service…              | 625-679 |
  | 02 | "Marché ouvert"     | `position="tr"`, `alert`      | "Des journalistes achètent…" / Cent millions…     | 692-729 |
  | 03 | "26 points rouges"  | `position="tl"`               | "Le fichier cartographie…" / Entrant, sortant…    | 742-783 |
  | 04 | "Identifiés"        | `position="br"`, `alert`      | "26 noms. 26 visages." / Recoupé…                  | 796-839 |
  | 05 | "Strava · 2018"     | `position="tl"`               | "2018 — déjà." / Une app de fitness…              | 852-895 |
  | 06 | "Votre iPhone"      | `position="tr"`, `alert`      | "Maintenant — votre iPhone." / 909 traceurs…      | 908-955 |
  | 07 | "Un outil apparaît" | `position="tl"`               | "Privacy Score." / Lit le rapport iOS…             | 968-1010 |
  | 08 | "+ 45 points"       | `position="br"`               | "Soixante secondes." / Un score. Trois fixes…    | 1023-1059 |

  Tag position and alert flag are NOT i18n strings; spec-developer hard-codes them as a const array in the component because they are part of the illustration layout, not the copy. Copywriters can change the tag text (e.g. EN "Open market" instead of "Marché ouvert") but cannot move the pill around the panel.

- **Scoped CSS:** **YES**. Copy the rulesets from `variation-illustrated.html` lines 36-208 (chapter etiquette + storyboard) and 412-413 (responsive) into a scoped `<style>` block inside `StoryboardSection.astro`. Specifically:
  - `.chapter`, `.ch-pill`, `.ch-pill .ch-current`, `.ch-pill .ch-total`, `.ch-label`, `.ch-label::before` — **NOTE:** these chapter classes are also used by `ProductIntroSection`, `HowItWorksSection`, `AnglesSection`, `ManifestoSection`. To avoid duplication, spec-developer should put `.chapter`, `.ch-pill`, `.ch-label` into a `_chapter.css` partial imported by all 5 chapter-bearing components — OR (simpler, locked decision): drop them into `src/styles/site.css` as global classes since `ds.css`/`site.css` are already global. **Decision: append the chapter etiquette block (design lines 36-67) to the bottom of `src/styles/site.css` once, then each section uses the global classes.** Storyboard-specific selectors (`.story-board`, `.story-board .orb`, `.sb-head`, `.sb-strip`, `.sb-panel`, `.sb-tag`, `.sb-pivot`, etc.) stay in the StoryboardSection scoped block (design lines 70-210).
- **Notable IDs/classes:**
  - `<section class="story-board" id="story">` — `#story` is anchored from the header and from the hero ghost CTA.
  - Panels use `.reveal` for IntersectionObserver scroll reveal (already wired in `site.js`).
  - `.sb-tag` positions `.tl / .tr / .bl / .br` and the `.alert` red variant are styled in the scoped block.
- **Asset references:** none — all illustrations are inline SVG.
- **Accessibility notes:**
  - `<section aria-labelledby="story-h2">` and give the `<h2>` `id="story-h2"`.
  - Each `<article class="sb-panel">` is a list item conceptually; wrap the strip in `<ol class="sb-strip">` and change each `<article>` to `<li class="sb-panel">` OR keep `<article>` but add `<div class="sb-strip" role="list">` + `<article role="listitem">`. **Preferred: keep semantic `<article>` and add `role="list" / role="listitem"`** (allows reordering for `prefers-reduced-motion` later).
  - Every illustration SVG keeps `aria-hidden="true"`.
  - Tag pills are decorative text inside a labelled article — no extra aria.
  - `.sb-pivot` is a final summary paragraph; render as `<p>` with the inline `<em>` and `<strong>` taken from the dict.

---

### 4. ProductIntroSection

- **File:** `src/components/sections/ProductIntroSection.astro`
- **Design ref:** lines 1082-1119 of `variation-illustrated.html`
- **Props interface:**
  ```ts
  interface Props {
    product:  Dictionary['product'];
    chapters: Dictionary['chapters'];
  }
  ```
- **i18n keys consumed:** `chapters.word`, `chapters.product.label`, `product.title.line{1,2,3}`, `product.body`, `product.bullets[0..3]`, `product.phoneAlt`.
- **Inline SVGs:** none. The intro mark uses `<img src="/assets/app-icon-256.png" alt="">`. Bullet check icons are Material font glyphs `<span class="material-icons-round">check</span>`.
- **Scoped CSS:** **no**. All classes (`.product-intro`, `.intro-grid`, `.intro-copy`, `.intro-mark`, `.intro-h`, `.intro-p`, `.intro-bullets`, `.intro-visual`, `.intro-phone`) exist in `site.css`. `.chapter`/`.ch-pill`/`.ch-label` come from the appended global block (see section 3).
- **Notable IDs/classes:**
  - `<section id="product-intro" class="product-intro">`.
  - `.intro-copy` and `.intro-visual` both carry `.reveal` for scroll-in.
  - The chapter etiquette here has inline style `style="justify-content: flex-start;"` (left-aligned in this section). Keep that inline override OR add a `.chapter--start` modifier; locked decision: keep inline style to match the design 1:1.
- **Asset references:** `/assets/app-icon-256.png`, `/assets/screen-dashboard.png`.
- **Accessibility notes:**
  - `<section aria-labelledby="product-h2">`, give `<h2 class="intro-h" id="product-h2">`.
  - The intro mark `<img alt="">` is decorative (the brand name appears below).
  - The phone screenshot `<img alt={product.phoneAlt} />` is informative.
  - Body `<p class="intro-p" set:html={product.body}>` — `[HTML-SAFE]`.
  - Bullets: `<ul class="intro-bullets">`, each `<li>` contains an aria-hidden icon span then text.

---

### 5. HowItWorksSection

- **File:** `src/components/sections/HowItWorksSection.astro`
- **Design ref:** lines 1125-1170 of `variation-illustrated.html`
- **Props interface:**
  ```ts
  interface Props {
    how:      Dictionary['how'];
    chapters: Dictionary['chapters'];
  }
  ```
- **i18n keys consumed:** `chapters.word`, `chapters.method.label`, `how.title`, `how.steps[0..2].{title,body,meta}`.
- **Inline SVGs:** none. Each step icon is a Material Icons glyph chosen by the component (NOT i18n): step 1 → `ios_share`, step 2 → `radar`, step 3 → `trending_up`. Hard-code those in a const array.
- **Scoped CSS:** **no**. Classes (`.how`, `.section-head`, `.steps`, `.step`, `.step-number`, `.step-icon`, `.step-meta`, `.mono`) exist in `site.css`.
- **Notable IDs/classes:**
  - `<section id="how" class="how">`.
  - Each step has `<article class="step reveal" data-delay="0|120|240">` — the `data-delay` values (0/120/240ms) are picked up by `site.js` to stagger the reveal. Hard-code them in the loop.
- **Asset references:** none.
- **Accessibility notes:**
  - `<section aria-labelledby="how-h2">`, give the `<h2>` `id="how-h2"`.
  - Wrap the 3 step articles in `<ol class="steps">` so the numbering is conveyed semantically; the visible `.step-number` becomes a styled `<span class="step-number" aria-hidden="true">{i+1}</span>` to avoid double-announcing.
  - `body` and `meta` use `set:html` because both can contain `<strong>`, `<em>`, `&nbsp;`.

---

### 6. AnglesSection

- **File:** `src/components/sections/AnglesSection.astro`
- **Design ref:** lines 1176-1242 of `variation-illustrated.html`. Scoped CSS source: lines 213-316.
- **Props interface:**
  ```ts
  interface Props {
    angles:   Dictionary['angles'];
    chapters: Dictionary['chapters'];
  }
  ```
- **i18n keys consumed:** `chapters.word`, `chapters.app.label`, `angles.title`, `angles.cards[0..3].{callout,title,body,meta,imageAlt}`.
- **Inline SVGs:** none. Each card has a Material Icons callout icon (`dashboard`, `add`, `trending_up`, `hub`) and an `<img>` screenshot. Hard-code icon name + callout color class + image src + screenshot index in a component const array (NOT in the dict):
  ```ts
  const cards = [
    { icon: 'dashboard',    style: 'new',      img: '/assets/screen-dashboard.png' },
    { icon: 'add',          style: 'points',   img: '/assets/screen-recommendations.png' },
    { icon: 'trending_up',  style: 'trending', img: '/assets/screen-evolution.png' },
    { icon: 'hub',          style: 'detail',   img: '/assets/screen-network.png' },
  ];
  ```
- **Scoped CSS:** **YES**. Copy the ruleset block from design lines 213-316 (the `/* FOUR-CARD GRID — replaces .features section */` block) into a scoped `<style>` inside `AnglesSection.astro`. That covers `.angles`, `.angles .orb-x`, `.angles .head`, `.angles-grid`, `.angle-card`, `.angle-card .num`, `.angle-card h3`, `.angle-card p`, `.angle-card .meta`, `.angle-card .callout`, `.callout.new`, `.callout.points`, `.callout.trending`, `.callout.detail`, `.angle-card .shot`, and the `@media (max-width: 900px)` block.
- **Notable IDs/classes:**
  - `<section class="angles" id="angles">`.
  - Each card is `<article class="angle-card reveal">`.
  - Callout pill: `<span class={`callout ${style}`}>` with the icon + label.
  - The card's `.num` ("01/04"-"04/04") is hard-coded by index, NOT in the dict.
- **Asset references:** `/assets/screen-dashboard.png`, `/assets/screen-recommendations.png`, `/assets/screen-evolution.png`, `/assets/screen-network.png`. All four already exist in `public/assets/`.
- **Accessibility notes:**
  - `<section aria-labelledby="angles-h2">`, give the `<h2>` `id="angles-h2"`.
  - The callout pill is purely decorative — wrap text in a `<span aria-hidden="false">` so it IS announced (it provides context like "+5 à +45 pts").
  - Each screenshot uses informative alt text from `cards[i].imageAlt`.

---

### 7. ManifestoSection

- **File:** `src/components/sections/ManifestoSection.astro`
- **Design ref:** lines 1248-1303 of `variation-illustrated.html`. Scoped CSS source: lines 322-413.
- **Props interface:**
  ```ts
  interface Props {
    manifesto: Dictionary['manifesto'];
    chapters:  Dictionary['chapters'];
  }
  ```
- **i18n keys consumed:** `chapters.word`, `chapters.promise.label`, `manifesto.title.line1`, `manifesto.title.negLine`, `manifesto.body`, `manifesto.cards[0..3].{title,body,code}`.
- **Inline SVGs:** none. Each manifesto card has a Material Icons round glyph inside the `.x` circle. Hard-coded icons by index: 1 → `cloud_off`, 2 → `person_off`, 3 → `phone_iphone`, 4 → `notifications_off`. (Mirrors the design.)
- **Scoped CSS:** **YES**. Copy the ruleset block from design lines 322-413 (the `/* MANIFESTO — replaces .trust section */` block) into a scoped `<style>` inside `ManifestoSection.astro`. Covers `.manifesto`, `.manifesto::before`, `.manifesto .head`, `.manifesto .head .overline`, `.manifesto .head h2`, `.manifesto .head h2 .neg`, `.manifesto .head p`, `.man-grid`, `.man-card`, `.man-card::before`, `.man-card .x`, `.man-card .x svg`, `.man-card .x .material-icons-round`, `.man-card h3`, `.man-card p`, `.man-card code`, and the two responsive `@media` blocks.
- **Notable IDs/classes:**
  - `<section class="manifesto" id="manifesto">` — `#manifesto` is anchored from the header.
  - Cards use `c-1`/`c-2`/`c-3`/`c-4` modifier classes already in the design — keep them even though no CSS targets them today (they reserve a future hook for per-card accent variation).
- **Asset references:** none.
- **Accessibility notes:**
  - `<section aria-labelledby="manifesto-h2">`, give the `<h2>` `id="manifesto-h2"`.
  - Each card has a decorative `.x` icon container — `aria-hidden="true"` on the icon span.
  - `.man-card` h3 is rendered uppercase by CSS — render plain title cased in the dict, let CSS do the transform.

---

### 8. TrustQuoteSection

- **File:** `src/components/sections/TrustQuoteSection.astro`
- **Design ref:** lines 1309-1320 of `variation-illustrated.html`
- **Props interface:**
  ```ts
  interface Props {
    quote: Dictionary['quote'];
  }
  ```
- **i18n keys consumed:** `quote.body`, `quote.attribution`.
- **Inline SVGs:** none.
- **Scoped CSS:** **no**. Uses `.trust`, `.trust-quote`, `.qmark` from `site.css`. The design overrides padding inline: `<section class="trust" style="padding: 100px 32px 60px;">`. Carry the inline style as-is — small enough not to need a class.
- **Notable IDs/classes:** none beyond the existing globals.
- **Asset references:** none.
- **Accessibility notes:**
  - Render as `<figure class="trust-quote">` → `<blockquote><p set:html={quote.body} /></blockquote><figcaption>{quote.attribution}</figcaption>` if semantically practical, OR keep the design's `<div class="trust-quote"><span class="qmark">"</span><p>…</p><footer>…</footer></div>` markup. **Locked decision: stay with the design markup** (the `<footer>` inside a div is intentional and the global CSS targets it).
  - `.qmark` decorative glyph — wrap in `<span class="qmark" aria-hidden="true">`.

---

### 9. MetricsSection

- **File:** `src/components/sections/MetricsSection.astro`
- **Design ref:** lines 1326-1347 of `variation-illustrated.html`
- **Props interface:**
  ```ts
  interface Props {
    metrics: Dictionary['metrics'];
  }
  ```
- **i18n keys consumed:** `metrics.items[0..3].{countTo, label}`.
- **Inline SVGs:** none.
- **Scoped CSS:** **no**. Uses `.metrics`, `.metric-row`, `.metric`, `.metric-num`, `.metric-label` from `site.css`.
- **Notable IDs/classes:** each `.metric-num` wraps `<span data-count-to={item.countTo}>0</span>` — `site.js` reads `dataset.countTo`. **Note:** `site.js` currently formats with `toLocaleString('fr-FR')` regardless of locale (line 1535 of the design source). For EN, we accept this for v1 (the largest number in the homepage metrics is `100` which formats identically in fr-FR and en-US, and `0/4/2` are single digits). **Flag for later:** pass a `lang` attribute on the wrapper so `site.js` could pick the locale up — non-blocking for v1.
- **Asset references:** none.
- **Accessibility notes:** wrap in `<section aria-label={dict.metrics.ariaLabel}>` — **add `metrics.ariaLabel: string` to the dict** ("Privacy Score en chiffres" / "Privacy Score by the numbers"). Each metric is a `<div>` with `.metric-num` (decorative animation target) and `.metric-label` (the readable label).

---

### 10. FAQSection

- **File:** `src/components/sections/FAQSection.astro`
- **Design ref:** lines 1353-1420 of `variation-illustrated.html`
- **Props interface:**
  ```ts
  interface Props {
    faq: Dictionary['faq'];
  }
  ```
- **i18n keys consumed:** `faq.overline`, `faq.title`, `faq.items[i].q`, `faq.items[i].a` (5 items locked).
- **Inline SVGs:** none. Each `<summary>` ends with `<span class="material-icons-round chev">expand_more</span>`.
- **Scoped CSS:** **no**. Uses `.faq`, `.faq-list`, `.faq` `details` / `summary`, `.chev` from `site.css`.
- **Notable IDs/classes:**
  - `<section class="faq" aria-labelledby="faq-h2">`, give the `<h2>` `id="faq-h2"`.
  - Each `<details>` is allowed `open` only on the first item if we want it expanded by default — locked decision: **all closed**.
- **Asset references:** none.
- **Accessibility notes:**
  - `<details>`/`<summary>` is natively keyboard-accessible — no extra ARIA needed.
  - The chevron icon `<span class="material-icons-round chev" aria-hidden="true">`.
  - Answer paragraph rendered with `set:html` because `faq.items[i].a` may contain `<em>`, `<strong>`, `&nbsp;`.
  - **AEO note:** see "JSON-LD blocks needed" below — the FAQ data here is also serialized into a `FAQPage` structured-data blob inside `<BaseLayout jsonLd={…}>`. Same source of truth; do NOT duplicate.

---

### 11. CTASection

- **File:** `src/components/sections/CTASection.astro`
- **Design ref:** lines 1426-1448 of `variation-illustrated.html`
- **Props interface:**
  ```ts
  interface Props {
    cta: Dictionary['cta'];
  }
  ```
- **i18n keys consumed:** `cta.title`, `cta.body`, `cta.primary`, `cta.note`.
- **Inline SVGs:** none. App Store icon is the Material Icons `download` glyph (placeholder — when the real Apple App Store URL is known, replace the `href="#"` and consider swapping for the official "Download on the App Store" SVG badge; that's a copywriter/design follow-up, not blocking).
- **Scoped CSS:** **no**. Uses `.cta`, `.orb-f`, `.cta-inner`, `.cta-copy`, `.cta-buttons`, `.btn-big`, `.cta-note`, `.cta-mark` from `site.css`.
- **Notable IDs/classes:**
  - `<section id="download" class="cta">` — `#download` is anchored from the header and from the hero primary CTA.
  - `<div class="orb orb-f">` decorative background.
- **Asset references:** `/assets/app-icon-512.png`.
- **Accessibility notes:**
  - `<section aria-labelledby="cta-h2">`, give the `<h2>` `id="cta-h2"`.
  - `.cta-mark img` is decorative — `alt=""`.
  - The primary CTA `<a class="btn btn-primary btn-big">` — initial `href="#"` placeholder; **flag for user**: provide real App Store URL before launch.

---

### 12. Footer

- **File:** `src/components/sections/Footer.astro`
- **Design ref:** lines 1454-1491 of `variation-illustrated.html`
- **Props interface:**
  ```ts
  interface Props {
    footer: Dictionary['footer'];
    locale: Locale; // optional, only if any link is locale-aware (mentions légales path will differ)
  }
  ```
- **i18n keys consumed:** `footer.tagline`, `footer.columns.{app,legal,contact}.{heading,links[]}`, `footer.copyright`, `footer.version`.
- **Inline SVGs:** none. Brand mark is `<img src="/assets/app-icon-256.png" alt="">`.
- **Scoped CSS:** **no**. Uses `.site-footer`, `.footer-inner`, `.foot-brand`, `.foot-sub`, `.foot-cols`, `.foot-h`, `.footer-rule`, `.footer-foot` from `site.css`.
- **Notable IDs/classes:** the inline style `style="color:#F8FAFC; font-family: var(--font-display); font-weight: 700;"` on the brand `<strong>` in the design — keep inline (small, design-specific tweak).
- **Asset references:** `/assets/app-icon-256.png`.
- **Accessibility notes:**
  - `<footer class="site-footer" role="contentinfo">`.
  - Each column is a `<nav aria-label={col.heading}>` containing `<ul>` of links.
  - The mailto link in the Contact column is real (`mailto:hello@privacyscore.fr`). Other hrefs are `"#"` placeholders for now — **flag for user**: confirm final URLs for App Store, release notes, source repo, mentions légales, politique de confidentialité, CGU, Mastodon, Bluesky before launch.
  - The footer-foot row has two spans — render as a single flex row, not a `<small>`, to match the design.

---

### Special pages

#### `src/pages/fr/index.astro` and `src/pages/en/index.astro`

Both follow the exact same composition pattern; only the `locale` constant differs.

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/sections/Header.astro';
import HeroSection from '@components/sections/HeroSection.astro';
import StoryboardSection from '@components/sections/StoryboardSection.astro';
import ProductIntroSection from '@components/sections/ProductIntroSection.astro';
import HowItWorksSection from '@components/sections/HowItWorksSection.astro';
import AnglesSection from '@components/sections/AnglesSection.astro';
import ManifestoSection from '@components/sections/ManifestoSection.astro';
import TrustQuoteSection from '@components/sections/TrustQuoteSection.astro';
import MetricsSection from '@components/sections/MetricsSection.astro';
import FAQSection from '@components/sections/FAQSection.astro';
import CTASection from '@components/sections/CTASection.astro';
import Footer from '@components/sections/Footer.astro';
import { getDictionary } from '@i18n/utils';
import { buildHomepageJsonLd } from '@lib/jsonLd'; // helper described below

const locale = 'fr' as const; // 'en' in en/index.astro
const dict = getDictionary(locale);

const jsonLd = buildHomepageJsonLd(locale, dict);
---
<BaseLayout
  locale={locale}
  title={dict.meta.title}
  description={dict.meta.description}
  ogTitle={dict.meta.ogTitle}
  ogDescription={dict.meta.ogDescription}
  jsonLd={jsonLd}
>
  <Header              locale={locale} pathname={Astro.url.pathname} nav={dict.nav} />
  <HeroSection         hero={dict.hero} locale={locale} />
  <StoryboardSection   story={dict.story}        chapters={dict.chapters} />
  <ProductIntroSection product={dict.product}    chapters={dict.chapters} />
  <HowItWorksSection   how={dict.how}            chapters={dict.chapters} />
  <AnglesSection       angles={dict.angles}      chapters={dict.chapters} />
  <ManifestoSection    manifesto={dict.manifesto} chapters={dict.chapters} />
  <TrustQuoteSection   quote={dict.quote} />
  <MetricsSection      metrics={dict.metrics} />
  <FAQSection          faq={dict.faq} />
  <CTASection          cta={dict.cta} />
  <Footer              footer={dict.footer} locale={locale} />
</BaseLayout>
```

> **Aliases:** `tsconfig.json` should already expose `@i18n/*`, `@components/*`, `@layouts/*`. If `@lib/*` is not yet aliased, spec-developer adds it (`src/lib/jsonLd.ts`).

#### `src/pages/index.astro` — root redirect

- **Goal:** sniff `navigator.languages`, redirect to `/fr/` or `/en/` (default `/fr/`).
- **Must NOT be indexed.**
- **Must work without JS** (meta-refresh fallback to `/fr/`).

```astro
---
// Bare root: noindex, client-side Accept-Language sniffer, meta-refresh fallback.
const TITLE = 'Privacy Score';
---
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{TITLE}</title>
    <meta name="robots" content="noindex,nofollow" />
    {/* JS-first sniffer */}
    <script is:inline>
      (function () {
        try {
          var langs = (navigator.languages && navigator.languages.length)
            ? navigator.languages
            : [navigator.language || 'fr'];
          var target = '/fr/';
          for (var i = 0; i < langs.length; i++) {
            var l = (langs[i] || '').toLowerCase();
            if (l.indexOf('fr') === 0) { target = '/fr/'; break; }
            if (l.indexOf('en') === 0) { target = '/en/'; break; }
          }
          window.location.replace(target);
        } catch (_) {
          window.location.replace('/fr/');
        }
      })();
    </script>
    {/* No-JS fallback */}
    <meta http-equiv="refresh" content="0; url=/fr/" />
    <link rel="canonical" href="https://privacyscore.fr/fr/" />
  </head>
  <body>
    <p style="font-family: system-ui; padding: 24px;">
      <a href="/fr/" hreflang="fr">Continuer en français →</a><br/>
      <a href="/en/" hreflang="en">Continue in English →</a>
    </p>
  </body>
</html>
```

#### `src/pages/404.astro`

Bilingual; uses `BaseLayout` with `locale='fr'` (default surface), but renders BOTH FR and EN copy stacked. Title and meta description should reflect "page not found" in FR.

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
const locale = 'fr' as const;
---
<BaseLayout
  locale={locale}
  title="404 — Page introuvable | Privacy Score"
  description="Cette page n'existe pas. This page does not exist."
>
  <main style="min-height: 70vh; display: grid; place-items: center; text-align: center; padding: 64px 24px;">
    <div>
      <h1 style="font-family: var(--font-display); font-size: clamp(48px, 8vw, 96px); margin: 0 0 12px;">404</h1>
      <p style="color: #94A3B8; margin: 0 0 32px;">
        Cette page n'existe pas. · This page does not exist.
      </p>
      <p>
        <a class="btn btn-primary" href="/fr/">Retour à l'accueil</a>
        &nbsp;
        <a class="btn btn-ghost" href="/en/">Go to homepage</a>
      </p>
    </div>
  </main>
</BaseLayout>
```

Add `noindex` for the 404 page by passing a `<meta name="robots" content="noindex">` via BaseLayout's `head` slot. (Spec-developer adds this and exposes the slot if not yet wired — BaseLayout already has `<slot name="head" />`.)

---

## JSON-LD blocks needed

Centralized in `src/lib/jsonLd.ts`. Function `buildHomepageJsonLd(locale, dict)` returns an array of plain objects ready for `BaseLayout`'s `jsonLd` prop. Shapes (seo-master will refine in phase 4):

1. **WebSite**
   ```ts
   {
     '@context': 'https://schema.org',
     '@type': 'WebSite',
     name: 'Privacy Score',
     url: 'https://privacyscore.fr/',
     inLanguage: locale === 'fr' ? 'fr-FR' : 'en-US',
   }
   ```

2. **Organization**
   ```ts
   {
     '@context': 'https://schema.org',
     '@type': 'Organization',
     name: 'Codevelop', // [UNVERIFIED — confirm legal name with user before publish, see APP_RECAP §7]
     url: 'https://privacyscore.fr/',
     logo: 'https://privacyscore.fr/assets/app-icon-512.png',
     sameAs: [], // populate when Mastodon/Bluesky/GitHub URLs are confirmed
   }
   ```

3. **MobileApplication**
   ```ts
   {
     '@context': 'https://schema.org',
     '@type': 'MobileApplication',
     name: 'Privacy Score',
     operatingSystem: 'iOS 17+',           // verified APP_RECAP §1
     applicationCategory: 'UtilitiesApplication',
     applicationSubCategory: 'Privacy',
     offers: {
       '@type': 'Offer',
       price: '0',
       priceCurrency: 'EUR',
       availability: 'https://schema.org/InStock',
     },
     publisher: { '@type': 'Organization', name: 'Codevelop' }, // [UNVERIFIED]
     softwareVersion: '0.0.7',             // verified APP_RECAP §1 — confirm before publish
     downloadUrl: '#',                     // [UNVERIFIED — replace with real App Store URL]
     inLanguage: ['fr-FR', 'en-US'],
   }
   ```

4. **FAQPage** (built from `dict.faq.items`)
   ```ts
   {
     '@context': 'https://schema.org',
     '@type': 'FAQPage',
     mainEntity: dict.faq.items.map(item => ({
       '@type': 'Question',
       name: item.q,
       acceptedAnswer: {
         '@type': 'Answer',
         // Strip any HTML for the JSON-LD value (don't ship <em> into JSON-LD)
         text: stripHtml(item.a),
       },
     })),
   }
   ```

Order in the returned array: WebSite, Organization, MobileApplication, FAQPage. `BaseLayout` already serializes each as a separate `<script type="application/ld+json">` (see `BaseLayout.astro` lines 72-78).

---

## Open questions for the user

1. **Editor / legal entity name.** `APP_RECAP §7` flags three candidates: `Codevelop` (bundle prefix), `Swiftlab` (privacy policy host), `Skander BAHRI` (file headers). The footer `© 2026 Privacy Score — Made in France`, the Organization JSON-LD `name`, and the MobileApplication `publisher` all depend on this. **Until confirmed, the spec uses `Codevelop` as a placeholder with `[UNVERIFIED]` annotations.** Decision needed before launch.
2. **App version surfaced in the footer.** Design renders `v 1.4.0 · iOS 17+`, but the real build per `APP_RECAP §1` is `0.0.7` (build `7`). Should the public footer show the truthful version, hide it, or keep the marketing-friendly `1.4.0` until a real 1.x ship?
3. **App Store URL.** Header CTA, hero primary CTA, and final CTA all link to `#` placeholders. Need the real `https://apps.apple.com/...` URL before launch (also fills the MobileApplication `downloadUrl`).
4. **Real footer URLs.** Mentions légales, Politique de confidentialité (currently points to `https://www.swiftlab.fr/fr/politique-de-confidentialite/` per `APP_RECAP §1` — confirm we keep that or move it to `/fr/politique-de-confidentialite/`), CGU, Notes de version, Code source (GitHub URL?), Mastodon, Bluesky.
5. **Hero claim "909 traceurs détectés, 5 apps géolocalisées".** Verbatim from the design; this is a *sample illustration* shown on the phone mockup, not a verified average. Decision: keep as visual illustration (no claim in body copy), but flag for `seo-copywriter-fr` to surface it as "illustration" rather than statistic if questioned. The EN copy should mirror the illustration framing, not assert it.
6. **Storyboard panel 6 hero number "909 traceurs par semaine en moyenne".** This is a claim and currently unverified. Per `APP_RECAP §2.2`, the app's `PrivacyScoreEngine` can produce this number on an individual device, but we don't have a population average. **Decision needed**: weaken the wording to "Jusqu'à 909 traceurs par semaine sur un seul appareil" or remove the figure. Flag for `seo-copywriter-fr` and `seo-copywriter-en`.
7. **NEW dict keys not in the design.** This spec adds:
   - `nav.aria.brand`, `nav.aria.nav`, `nav.aria.switcher` (accessibility)
   - `metrics.ariaLabel` (accessibility)
   - The five `chapters.{story|product|method|app|promise}.label` keys + `chapters.word` (already locked-in by the spec brief)
   Copywriters must write values for all of these in both locales.
8. **Decision: `seo-copywriter-en` is asked to write natively, not translate.** Confirm with the user that the EN landing page CAN re-anchor the storyboard around a US/UK-known data-broker incident (e.g. Strava heatmap 2018 — already there, panel 5; the Secret Service / Washington Post 2024 incident — already there, panels 1-4) rather than literally translating "26 agents du Secret Service". The current FR storyboard already uses US-relevant news, so a faithful EN retelling will land naturally — but it must not feel like a French→English translation.

---

## Resolved decisions

- **CSS strategy:** `ds.css` + `site.css` are global, already imported in `BaseLayout.astro`. **No Tailwind.** New CSS only when the design provides a scoped `<style>` block — copy it verbatim into a scoped block in the same component. The chapter etiquette ruleset (design lines 36-67) is promoted to a global block appended to `site.css` because 5 different sections use those classes.
- **Animation strategy:** **vanilla `site.js` bundled via `BaseLayout`** (already wired). The script handles `.reveal` on scroll, `[data-count-to]` counters, `#gaugeArc`/`#gaugeNum` hero animation, and orb parallax. **No Motion, no GSAP, no Lottie, no Framer Motion.** web-animator can refine timings inside `site.js`, but must not add a new dependency.
- **Scope:** Phase 3 ends with the 12 sections + 3 page files compiling. SEO infrastructure refinements (sitemap entries, robots.txt rules, Open Graph image generation) belong to Phase 4. Production deploy belongs to Phase 5.
- **FR copy:** extracted **verbatim** from the design (`seo-copywriter-fr` reads the design and assembles the JSON, does not rewrite). `[UNVERIFIED]` items in `APP_RECAP.md` are NOT smoothed into claims.
- **EN copy:** **native** writing by `seo-copywriter-en`, never translation. Same dictionary shape, idiomatic English keywords for the privacy/security niche.
- **Locale routing:** Astro's built-in i18n, `prefixDefaultLocale: true`, `trailingSlash: 'always'` (already configured in `astro.config.mjs`). Both `/fr/` and `/en/` are first-class; root `/` is a sniffer with `noindex`.
- **Storyboard SVG illustrations:** copy-paste **byte-for-byte** from `variation-illustrated.html`. Never regenerated. SVG IDs preserved (they are referenced inside the same SVG via `url(#…)`).
- **Gauge SVG:** `#gaugeArc` and `#gaugeNum` IDs MUST survive — `site.js` reads them by id.
- **Chapter pills word:** locale-aware via `chapters.word`; the 5 chapter labels live under `chapters.{story|product|method|app|promise}.label`.
- **Tag pill positioning (storyboard panels):** layout concern, hard-coded in `StoryboardSection.astro`, not in the dict.
- **Material Icons font:** loaded globally via `BaseLayout` (already wired in `site.css` / font preconnects). Every icon span gets `aria-hidden="true"`.
- **Component prop style:** every section receives the relevant slice of the dictionary as a typed prop; **no global `t()` function**, no React context, no shared Astro store.
