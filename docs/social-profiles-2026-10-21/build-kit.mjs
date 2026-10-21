import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const source = dirname(fileURLToPath(import.meta.url));
const root = resolve(source, '../..');
const out = join(root, 'artifacts/social-profiles-2026-10-21');
const data = JSON.parse(await readFile(join(source, 'profiles.json'), 'utf8'));
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fonts = `@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${(await readFile(join(root, 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'))).toString('base64')})}
@font-face{font-family:Material;src:url(data:font/woff;base64,${(await readFile(join(root, 'src/assets/fonts/material-icons-round.woff'))).toString('base64')})}`;
const icon = (await readFile(join(root, 'public/assets/app-icon-512.png'))).toString('base64');
const image = (x, y, size) => `<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/png;base64,${icon}"/>`;
const text = (value, x, y, size, color = '#F8FAFC', weight = 700, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" ${extra}>${esc(value)}</text>`;

await mkdir(out, { recursive: true });
for (const folder of ['covers', 'posts', 'highlights', 'licenses']) await mkdir(join(out, folder), { recursive: true });
await copyFile(join(root, 'public/assets/app-icon-512.png'), join(out, 'avatar-privacy-score.png'));
await copyFile(join(source, 'README.md'), join(out, 'README.md'));
await copyFile(join(source, 'profiles.json'), join(out, 'profiles.json'));
await copyFile(join(root, 'public/assets/licenses/material-icons.txt'), join(out, 'licenses/material-icons.txt'));
await copyFile(join(root, 'node_modules/@fontsource-variable/manrope/LICENSE'), join(out, 'licenses/manrope.txt'));

const counts = [];
for (const profile of data.profiles) {
  const limit = profile.platform === 'Instagram' ? 150 : 80;
  const variants = [profile.bio, profile.bioWithoutWebsiteField].filter(Boolean);
  for (const value of variants) assert.ok(value.length <= limit, `${profile.id}: bio exceeds conservative ${limit}-character budget`);
  assert.ok(profile.name.length <= 30, `${profile.id}: name exceeds conservative 30-character budget`);
  assert.equal(profile.handle, profile.language.startsWith('en') ? 'privacyscoreapp' : 'privacyscorefr');
  const website = new URL(profile.website);
  assert.equal(website.origin, 'https://www.privacyscore.fr');
  assert.equal(website.pathname, profile.language.startsWith('en') ? '/' : '/fr/');
  assert.equal(website.searchParams.get('utm_source'), profile.platform.toLowerCase());
  assert.equal(website.searchParams.get('utm_medium'), 'organic_social');
  counts.push({ profile: profile.id, name: profile.name.length, bio: profile.bio.length, fallbackBio: profile.bioWithoutWebsiteField?.length, editorialBioBudget: limit });
  const fields = [
    ['LANGUE', profile.language], ['IDENTIFIANT — champ nom d’utilisateur', profile.handle],
    ['NOM AFFICHÉ', profile.name], ['BIO — copier avec les sauts de ligne', profile.bio],
    ['TITRE DU LIEN — si le champ existe', profile.linkTitle], ['SITE WEB — dans le champ lien externe', profile.website],
    ['CONTACT PUBLIC — vérifier que la boîte reçoit les messages', data.contactEmail],
    ['CATÉGORIE SUGGÉRÉE — selon les choix proposés', profile.categorySuggestion],
    ['AVATAR', 'avatar-privacy-score.png — icône officielle inchangée, 512 × 512'],
    ['LIEN APP STORE DIRECT FACULTATIF', profile.appStore],
    ['URL DU PROFIL ATTENDUE APRÈS CRÉATION — non réservée par ce kit', profile.profileUrl],
    ['BIO SI LE CHAMP SITE WEB MANQUE — adresse en texte, pas de lien cliquable garanti', profile.bioWithoutWebsiteField],
    ['TITRE SUR LA COUVERTURE D’ACCUEIL', profile.welcomeTitle],
    ['LÉGENDE DE LA PREMIÈRE PUBLICATION', profile.welcomeCaption],
    ['LÉGENDE SI LE LIEN DE PROFIL MANQUE', profile.welcomeCaptionWithoutWebsiteField],
    ['TEXTE ALTERNATIF — si proposé pour ce format', profile.altText],
    ['RÉPONSE DE SUPPORT — à utiliser manuellement', profile.supportReply],
    ['RÉPONSE TARIFS — à utiliser manuellement', profile.pricingReply],
    ['STORIES À LA UNE — après publication des stories', profile.highlights?.join(' · ')],
  ].filter(([, value]) => value);
  const filename = `${String(profile.step).padStart(2, '0')}-${profile.id}.txt`;
  profile.copyFile = filename;
  await writeFile(join(out, filename), `PRIVACY SCORE — ${profile.platform.toUpperCase()} — ${profile.language}\nPréparé le ${data.preparedAt}. À créer par le propriétaire.\n\n${fields.map(([label, value]) => `${label}\n${value}`).join('\n\n')}\n`);
}

function svgFrame(width, height, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title><style>${fonts}text{font-family:Manrope,Arial,sans-serif}</style>
<defs><radialGradient id="glow"><stop stop-color="#12365B"/><stop offset="1" stop-color="#020617"/></radialGradient><pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse"><path d="M72 0H0V72" fill="none" stroke="#8BD6F3" stroke-opacity=".055"/></pattern></defs>
<rect width="100%" height="100%" fill="#020617"/><ellipse cx="800" cy="380" rx="850" ry="950" fill="url(#glow)"/><rect width="100%" height="100%" fill="url(#grid)"/>
${body}</svg>`;
}

function coverSvg(cover, post = false) {
  const top = post ? 80 : 145;
  const logoY = post ? 270 : 405;
  const headingY = post ? 740 : 860;
  const bodyY = post ? 955 : 1085;
  const footerY = post ? 1140 : 1280;
  return svgFrame(1080, post ? 1350 : 1920, cover.altText,
    image(84, top - 40, 64) + text('Privacy Score', 168, top, 32) + text(cover.language.toUpperCase(), 992, top, 24, '#CBD5E1', 700, 'text-anchor="end"')
    + `<rect x="${post ? 80 : 84}" y="${post ? 180 : 280}" width="${cover.eyebrow.length * 18 + 64}" height="54" rx="27" fill="#102442" stroke="#2E5791"/>`
    + text(cover.eyebrow, post ? 112 : 116, post ? 215 : 315, 22, '#93C5FD', 700, 'letter-spacing="2"')
    + image(396, logoY, 288)
    + cover.title.map((line, i) => text(line, 84, headingY + i * 104, 82, i ? '#60A5FA' : '#F8FAFC', 800)).join('')
    + cover.body.map((line, i) => text(line, 84, bodyY + i * 54, 36, '#CBD5E1', 500)).join('')
    + `<path d="M84 ${footerY - 44}H996" stroke="#24354F"/>`
    + text(cover.footer, 84, footerY, 21, '#93C5FD', 700, 'letter-spacing="1.2"')
    + text(`@${cover.handle}`, 84, footerY + 78, 30, '#E2E8F0', 600)
  );
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
async function renderSvg(svg, path, width, height) {
  await writeFile(path.replace(/\.png$/, '.svg'), svg);
  await page.setViewportSize({ width, height });
  await page.setContent(`<html><head><style>html,body{margin:0}svg{display:block}</style></head><body>${svg}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  // Assert each text node fits horizontally before rasterizing the final art.
  const clipped = await page.locator('svg text').evaluateAll((nodes) => nodes.filter((node) => {
    const box = node.getBBox(); return box.x < 0 || box.x + box.width > 1080;
  }).map((node) => node.textContent));
  assert.deepEqual(clipped, [], `Clipped text: ${path}`);
  await page.locator('svg').screenshot({ path });
}
try {
  for (const cover of data.covers) {
    await renderSvg(coverSvg(cover), join(out, `covers/${cover.id}.png`), 1080, 1920);
    if (cover.id.startsWith('01-')) await renderSvg(coverSvg(cover, true), join(out, `posts/${cover.id}.png`), 1080, 1350);
  }
  const highlights = [
    ['01-app', 'phone_iphone'], ['02-start', 'ios_share'], ['03-tips', 'trending_up'],
    ['04-privacy', 'cloud_off'], ['05-help', 'dashboard'],
  ];
  for (const [name, glyph] of highlights) {
    const svg = svgFrame(1080, 1080, name,
      `<circle cx="540" cy="540" r="262" fill="#10213D" stroke="#355D90" stroke-width="3"/>`
      + `<text x="540" y="620" text-anchor="middle" font-size="240" fill="#60A5FA" style="font-family:Material;font-feature-settings:'liga';font-weight:normal">${glyph}</text>`);
    await renderSvg(svg, join(out, `highlights/${name}.png`), 1080, 1080);
  }
} finally { await browser.close(); }

const previews = await Promise.all(data.covers.map(async (cover, i) => ({
  input: await sharp(join(out, `covers/${cover.id}.png`)).resize(300, 534).png().toBuffer(),
  left: 20 + i % 3 * 320, top: 20 + Math.floor(i / 3) * 554,
})));
await sharp({ create: { width: 980, height: 1128, channels: 4, background: '#E2E8F0' } }).composite(previews).png().toFile(join(out, 'preview.png'));
await writeFile(join(out, 'character-counts.json'), `${JSON.stringify(counts, null, 2)}\n`);

const field = (label, value) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`;
const profileCards = data.profiles.map((profile) => `<section id="${profile.id}"><div class="card-top"><img width="72" height="72" src="avatar-privacy-score.png" alt="Icône officielle Privacy Score"><div><span class="eyebrow">ÉTAPE ${profile.step} · ${profile.language}</span><h2>${esc(profile.platform)} · ${esc(profile.handle)}</h2></div></div><dl>${field('Identifiant à enregistrer', profile.handle)}${field('Nom affiché', profile.name)}${field(`Bio · ${profile.bio.length} caractères`, profile.bio)}${field('Titre du lien', profile.linkTitle)}${field('URL du site à copier dans le champ lien', profile.website)}${profile.bioWithoutWebsiteField ? field('Bio de secours si le champ Site Web manque — adresse non cliquable', profile.bioWithoutWebsiteField) : ''}${field('Catégorie suggérée, selon le menu', profile.categorySuggestion)}${field('Contact public', data.contactEmail)}</dl><a class="download" href="${profile.copyFile}" download>Télécharger tous les textes de ce profil</a><details><summary>Légende d’accueil et réponses de support</summary><dl>${field('Légende d’accueil', profile.welcomeCaption)}${profile.welcomeCaptionWithoutWebsiteField ? field('Légende sans lien cliquable', profile.welcomeCaptionWithoutWebsiteField) : ''}${field('Texte alternatif de l’image d’accueil', profile.altText)}${field('Réponse de support à utiliser manuellement', profile.supportReply)}${field('Réponse tarifs', profile.pricingReply)}</dl></details></section>`).join('');
const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Privacy Score — kit de création des profils</title><style>${fonts}*{box-sizing:border-box}body{font-family:Manrope,Arial,sans-serif;background:#F1F5F9;color:#0F172A;margin:0;line-height:1.65}main{max-width:1120px;padding:48px 24px;margin:auto}header{padding:32px;border-radius:24px;background:#020617;color:#F8FAFC}h1{font-size:clamp(28px,4vw,44px);line-height:1.2;letter-spacing:-1px;margin:12px 0 20px}h2{font-size:24px;line-height:1.3;margin:8px 0}.eyebrow{font-size:12px;font-weight:800;letter-spacing:1.2px;color:#93C5FD}.muted{color:#CBD5E1}.download{display:inline-block;background:#0758B9;color:white;padding:12px 18px;border-radius:12px;text-decoration:none;font-weight:700;margin:12px 0}nav{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0}nav a{padding:8px 12px;background:#E2E8F0;border-radius:8px;color:#0F172A}section{background:white;padding:28px;border-radius:20px;margin:24px 0;border:1px solid #CBD5E1}.card-top{display:flex;gap:16px;align-items:center}.card-top img{border-radius:16px}.card-top .eyebrow{color:#0758B9}dt{font-weight:800;font-size:13px;margin-top:20px}dd{margin:6px 0 0;padding:12px 14px;background:#F1F5F9;border-radius:10px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:15px;user-select:all}p{max-width:78ch}summary{cursor:pointer;padding:16px 0;font-weight:700}.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.gallery img{width:100%;height:auto;border-radius:12px}.highlights{display:flex;gap:12px;flex-wrap:wrap}.highlights figure{margin:0;text-align:center;font-size:13px}.highlights img{width:108px;height:108px;border-radius:50%}a{color:#0758B9}@media(max-width:600px){main{padding:20px 12px}header,section{padding:20px}.gallery{grid-template-columns:repeat(2,1fr)}.card-top{align-items:flex-start}h2{font-size:20px}}</style><main><header><span class="eyebrow">PRÊT À COPIER · 21 OCTOBRE 2026</span><h1>Quatre profils.<br>Une seule identité.</h1><p class="muted">Réservez d’abord @privacyscoreapp et @privacyscorefr sur Instagram et TikTok, puis complétez chaque profil dans l’ordre ci-dessous. Ce kit ne réserve aucun identifiant et ne publie rien.</p><a class="download" href="privacy-score-social-kit.zip" download>Télécharger le pack complet</a></header><nav>${data.profiles.map((p) => `<a href="#${p.id}">${p.step}. ${p.platform} ${p.language.startsWith('en') ? 'EN' : 'FR'}</a>`).join('')}</nav><section><h2>Avant de commencer</h2><p>Identifiants sans @ dans le formulaire · compte professionnel Business · e-mail contrôlé · mot de passe unique · double authentification · informations réelles du titulaire et de l’entreprise. La disponibilité d’un identifiant est confirmée seulement lors de son enregistrement.</p><p>Pour TikTok, vérifier si le champ Site Web est accessible : le simple changement de type de compte ne garantit pas un lien cliquable. Les bios de secours sont fournies. L’avatar est identique pour les quatre profils ; aucune bannière de profil n’est nécessaire pour leur configuration standard.</p><p><a href="README.md">Guide détaillé, sources, vérifications et étapes après création</a> · <a href="avatar-privacy-score.png" download>Avatar officiel PNG, 512 × 512</a></p></section>${profileCards}<section><h2>Couvertures des publications · EN puis FR</h2><p>Six PNG de 1080 × 1920. Ce sont des couvertures, pas des vidéos montées. Sur TikTok, si l’interface ne propose pas d’import, intégrer le visuel au montage puis sélectionner cette image comme couverture.</p><div class="gallery">${data.covers.map((c) => `<a href="covers/${c.id}.png" download><img width="1080" height="1920" src="covers/${c.id}.png" alt="${esc(c.altText)}"></a>`).join('')}</div><p><a href="posts/01-welcome-en.png" download>Image d’accueil EN · 1080 × 1350</a> · <a href="posts/01-welcome-fr.png" download>Image d’accueil FR · 1080 × 1350</a></p></section><section><h2>Stories à la une Instagram</h2><p>À ajouter après publication des stories. Les icônes sont communes ; choisir les titres de la langue du profil.</p><div class="highlights">${[['01-app','The app / L’app'],['02-start','Start here / Débuter'],['03-tips','Tips / Conseils'],['04-privacy','Privacy / Vie privée'],['05-help','Help / Aide']].map(([id,label]) => `<figure><a href="highlights/${id}.png" download><img width="108" height="108" src="highlights/${id}.png" alt="${esc(label)}"></a><figcaption>${esc(label)}</figcaption></figure>`).join('')}</div></section><p>Les paramètres UTM distinguent les quatre liens de profil. Les mesures GA4 restent soumises au consentement ; un clic App Store n’est pas un achat. Aucune automatisation de publication n’est activée.</p></main></html>`;
await writeFile(join(out, 'index.html'), html);
// Exclude prior archives and screenshots from subsequent reproducible bundles.
execFileSync('/usr/bin/zip', ['-qr', 'privacy-score-social-kit.zip', 'README.md', 'profiles.json', 'character-counts.json', 'index.html', 'avatar-privacy-score.png', ...data.profiles.map((p) => p.copyFile), 'covers', 'posts', 'highlights', 'licenses', 'preview.png'], { cwd: out });
console.log(JSON.stringify({ output: out, profiles: counts, covers: data.covers.length, welcomePosts: 2, highlightIcons: 5, actualAccountsCreated: 0 }, null, 2));
