# JSON-LD Schema Templates for privacyscore.fr

All templates use `set:html={JSON.stringify(...)}` for SSR injection. Never inject via client-side JS.

## SoftwareApplication + MobileApplication (homepage)

```ts
const appSchema = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "MobileApplication"],
  "name": "Privacy Score",
  "alternateName": "Privacy Guard",
  "operatingSystem": "iOS 17.6 or later",
  "applicationCategory": "UtilitiesApplication",
  "applicationSubCategory": "Privacy",
  "downloadUrl": "https://apps.apple.com/app/privacy-score/idXXXXXXXXX",
  "softwareVersion": "0.0.7",
  "datePublished": "2026-05-18",
  "dateModified": "2026-05-18",
  "fileSize": "12 MB",
  "permissions": "Reads Apple App Privacy Report (NDJSON)",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Codevelop",
    "url": "https://privacyscore.fr",
    "logo": "https://privacyscore.fr/logo.png"
  },
  "inLanguage": ["fr", "en"],
  "screenshot": [
    "https://privacyscore.fr/screenshots/dashboard.png",
    "https://privacyscore.fr/screenshots/recommendations.png",
    "https://privacyscore.fr/screenshots/evolution.png"
  ],
  "featureList": [
    "Analyse locale du rapport de confidentialité Apple",
    "Score de confidentialité 0-100",
    "Détection des traceurs publicitaires",
    "Recommandations VPN et DNS",
    "100% local - aucune donnée envoyée en ligne"
  ]
};
```

## Organization (every page)

```ts
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Codevelop",
  "url": "https://privacyscore.fr",
  "logo": "https://privacyscore.fr/logo.png",
  "founder": {
    "@type": "Person",
    "name": "Skander Bahri",
    "url": "https://privacyscore.fr/fr/a-propos"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@codevelop.fr",
    "contactType": "Customer Support"
  }
};
```

## WebSite + SearchAction (every page)

```ts
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Privacy Score",
  "url": "https://privacyscore.fr",
  "inLanguage": ["fr-FR", "en-US"]
  // SearchAction omitted - we have no site search yet. Add when implemented:
  // "potentialAction": {
  //   "@type": "SearchAction",
  //   "target": { "@type": "EntryPoint", "urlTemplate": "https://privacyscore.fr/fr/recherche?q={query}" },
  //   "query-input": "required name=query"
  // }
};
```

## FAQPage (FAQ page)

```ts
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Privacy Score envoie-t-il mes données sur internet ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Non. Privacy Score fonctionne entièrement sur votre iPhone. Aucune connexion à un serveur n'est faite. Le rapport de confidentialité Apple est analysé localement et les résultats restent sur votre appareil."
      }
    },
    {
      "@type": "Question",
      "name": "L'application est-elle gratuite ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, Privacy Score est entièrement gratuite. Il n'y a pas d'achats intégrés, pas de compte à créer, pas de publicité."
      }
    }
    // ... add all FAQ Q&A pairs
  ]
};
```

## BlogPosting (each blog post)

```ts
const blogPostSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": frontmatter.title,
  "description": frontmatter.description,
  "image": new URL(frontmatter.heroImage.src, Astro.site).toString(),
  "datePublished": frontmatter.publishDate.toISOString(),
  "dateModified": (frontmatter.updatedDate ?? frontmatter.publishDate).toISOString(),
  "author": {
    "@type": "Person",
    "name": frontmatter.author,
    "url": "https://privacyscore.fr/fr/a-propos"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Codevelop",
    "logo": {
      "@type": "ImageObject",
      "url": "https://privacyscore.fr/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": canonicalUrl
  },
  "inLanguage": frontmatter.lang,
  "keywords": frontmatter.tags.join(", ")
};
```

## BreadcrumbList (every non-homepage)

```ts
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://privacyscore.fr/fr/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://privacyscore.fr/fr/blog/" },
    { "@type": "ListItem", "position": 3, "name": frontmatter.title }
  ]
};
```

## HowTo (how-it-works page) — semantic only, no rich result

```ts
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Comment auditer la confidentialité de votre iPhone",
  "totalTime": "PT5M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Activer le rapport de confidentialité Apple",
      "text": "Allez dans Réglages > Confidentialité et sécurité > Rapport sur l'App Privacy. Activez l'option."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Attendre 7 jours pour collecter des données",
      "text": "Le rapport collecte les accès aux ressources et l'activité réseau de toutes vos apps."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Importer le rapport dans Privacy Score",
      "text": "Dans Réglages iOS, appuyez sur Partager le Rapport sur l'App Privacy. Sélectionnez Privacy Score."
    }
  ]
};
```
