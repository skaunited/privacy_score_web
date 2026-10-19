import type { APIRoute } from 'astro';
import { publishedPosts, postPath } from '../content/blog';
import { APP_STORE_URL, pathForPage, toAbsoluteUrl, type Locale } from '../i18n/utils';

export const prerender = true;

// Keep link labels on one line and escape Markdown delimiters in editorial titles.
const text = (value: string) => value.replace(/\s+/g, ' ').trim();
const label = (value: string) => text(value).replace(/[\\[\]]/g, '\\$&');
const link = (name: string, path: string, description: string) =>
  `- [${label(name)}](${toAbsoluteUrl(path)}): ${text(description)}`;

export const GET: APIRoute = async () => {
  const posts = await publishedPosts();
  const guides = (locale: Locale) => posts.filter((post) => post.data.language === locale)
    .map((post) => link(post.data.title, postPath(post), post.data.description)).join('\n');
  const content = `# Privacy Score

> Privacy Score is an iOS app that analyzes exported Apple App Privacy Reports locally on the iPhone.

This is the official product website and guide collection, published by CoDevelop. English pages are at the site root; French pages are under /fr/.

Imported Apple reports are processed on the device. Optional, consent-based website analytics are separate from the app's local report analysis. Product capabilities, report limitations and subscription terms are explained on the linked pages. Apple confirms purchase eligibility and local prices in the App Store.

## Product and publisher

${link('Privacy Score (English)', pathForPage('en', 'home'), 'App overview, how it works, features, FAQ and download links.')}
${link('Privacy Score (Français)', pathForPage('fr', 'home'), 'Présentation, fonctionnement, fonctionnalités, FAQ et téléchargement.')}
${link('About Privacy Score', pathForPage('en', 'about'), 'Publisher and author information.')}
${link('À propos de Privacy Score', pathForPage('fr', 'about'), 'Informations sur l’éditeur et l’auteur.')}
- [Privacy Score on the App Store](${APP_STORE_URL.en}): Official iOS app listing and current purchase terms.

## Guides in English

${link('All English guides', pathForPage('en', 'blog'), 'Browse the published iPhone privacy guides.')}
${guides('en')}

## Guides en français

${link('Tous les guides en français', pathForPage('fr', 'blog'), 'Consulter les guides publiés sur la confidentialité iPhone.')}
${guides('fr')}

## Optional

${link('Privacy policy', pathForPage('en', 'privacy-policy'), 'App data handling and optional website audience measurement.')}
${link('Politique de confidentialité', pathForPage('fr', 'privacy-policy'), 'Traitements de l’application et mesure facultative du site.')}
${link('Terms of use', pathForPage('en', 'terms-of-use'), 'Usage, introductory offers and renewal terms.')}
${link('Conditions générales d’utilisation', pathForPage('fr', 'terms-of-use'), 'Utilisation, offres de lancement et renouvellement.')}
${link('Legal notice', pathForPage('en', 'legal-notice'), 'Publisher and website legal information.')}
${link('Mentions légales', pathForPage('fr', 'legal-notice'), 'Informations légales de l’éditeur et du site.')}
${link('Security policy', pathForPage('en', 'security-policy'), 'Security contact and responsible disclosure.')}
${link('Politique de sécurité', pathForPage('fr', 'security-policy'), 'Contact sécurité et signalement responsable.')}
${link('XML sitemap', '/sitemap-index.xml', 'Canonical public URLs for search crawlers.')}
${link('robots.txt', '/robots.txt', 'Crawler access directives, separate from this content overview.')}
`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
