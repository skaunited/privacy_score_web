# Accès des robots IA et llms.txt — 19 octobre 2026

## État du dépôt

`src/pages/llms.txt.ts` génère un fichier statique `/llms.txt` lors du build Astro. Il décrit le produit, distingue l’analyse locale de l’application de la mesure facultative du site, et reprend les titres, descriptions et URL des articles publiés en français et en anglais. Les brouillons et publications futures sont exclus par le même filtre que les pages du blog. Les prix ne sont pas dupliqués dans ce résumé : les pages produit et l’App Store portent les conditions détaillées.

Le fichier est annoncé dans le head par `rel="describedby"`. Le contrôle SEO valide son titre, ses destinations locales, l’absence de liens vers des redirections/noindex et la couverture exacte des articles publiés. Il n’est pas ajouté comme page HTML au sitemap. Il sera public après le push du propriétaire, le build de la pipeline et le Pull Updates Plesk.

Ce résumé est complémentaire à robots.txt. Il ne débloque pas un pare-feu et ne garantit ni indexation ni citation. La convention est décrite sur [llmstxt.org](https://llmstxt.org/).

## Observations de production

Lors du contrôle initial, les 22 URL du sitemap répondaient 200, avec du texte dans le HTML, des canonicals propres et sans noindex. Le robots.txt public autorise les robots de recherche IA, dont ceux d’Anthropic via la règle générique. Les identifiants de User-Agent testés ne prouvent pas l’accès d’un robot réel depuis les adresses IP de son fournisseur.

Requêtes sur `/fr/blog/importer-rapport-confidentialite-iphone/` le 19 octobre 2026, à 14:22 UTC :

| User-Agent de test | HTTP | Cloudflare Ray ID |
| --- | --- | --- |
| `ClaudeBot` | 403 | `a4d06f104e92c08f-MRS` |
| `Claude-SearchBot` | 521 | `a4d06f10ed2ee21c-MRS` |
| `OAI-SearchBot` | 200 | `a4d06f11b99a3ee8-MRS` |

Un contrôle immédiat à 14:23 UTC a renvoyé 200 pour un client normal, `Claude-SearchBot` et `Claude-User`, puis 403 pour `ClaudeBot` (Ray ID `a4d070622d8ee20d-MRS`). Le refus ClaudeBot était reproductible. Les erreurs 521 sont un problème distinct : elles correspondent à un refus de connexion entre Cloudflare et l’origine, pas à un blocage robots.txt. Voir [la documentation Cloudflare 521](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-521/).

`ClaudeBot` collecte pour l’entraînement ; `Claude-SearchBot` et `Claude-User` ont des rôles distincts de recherche et consultation. Voir [la documentation Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).

## Diagnostic authentifié et correction Cloudflare

La session Cloudflare ouverte par le propriétaire a permis de vérifier la zone **privacyscore.fr**, sans jeton API ni nouveau plugin.

- L’événement du Ray ID `a4d06f104e92c08f` correspond exactement au test ClaudeBot sur l’article français. Service : règles gérées ; ensemble : **Cloudflare Bot Management rules for all plans** ; règle : **Manage AI bots** (`7bd01eeccb6b420fa0be30264603a5cb`) ; action : bloquer.
- Les politiques « Recherche » et « Agent » étaient sur **Autoriser (ne pas bloquer)**, mais « Entraînement » sur **Interdire**. Le tableau AI Crawl Control indiquait un blocage hérité pour GPTBot, ClaudeBot, Claude-User et Google-CloudVertexBot, entre autres. Le blocage affiché de Claude-User ne signifie pas que ce robot sert à l’entraînement : son rôle reste la consultation à la demande.
- Aucune règle WAF personnalisée ni règle personnalisée de limitation de débit n’était configurée. Le mode Bot Fight et le Labyrinthe IA étaient déjà désactivés ; leurs valeurs ont été conservées. Les protections générales gérées par Cloudflare restent actives.

Correction enregistrée le 19 octobre 2026, puis vérifiée dans les paramètres sauvegardés et le tableau des robots :

| Réglage | Avant | Après |
| --- | --- | --- |
| Recherche | Autoriser | Autoriser |
| Agent | Autoriser | Autoriser |
| Entraînement | Interdire | Autoriser |
| Synchronisation des préférences vers robots.txt | Activée | Activée |
| Bytespider | Bloqué par la catégorie | Blocage individuel activé |

Cette politique autorise aussi la collecte du contenu public pour l’entraînement, conformément aux autorisations explicites déjà présentes dans le robots.txt du dépôt. Bytespider reste exclu, comme dans ce fichier. Aucun contournement global du WAF, aucune règle « skip » basée sur un simple User-Agent, aucune modification DNS/TLS/Plesk et aucune purge globale de cache n’ont été appliqués. Voir [les politiques de bots IA Cloudflare](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/).

## Vérifications après correction

À 14:29 UTC, des GET simulant ClaudeBot, Claude-SearchBot, Claude-User, OAI-SearchBot, ChatGPT-User et GPTBot ont chacun renvoyé **200** sur l’accueil anglais, l’index anglais du blog et l’article français contrôlé. Par exemple, ClaudeBot répond maintenant 200 sur l’article français (Ray ID `a4d0796e7ac913d3-MRS`), contre le 403 confirmé dans les événements avant correction.

Les huit articles ont ensuite tous répondu 200 avec leur contenu HTML, leur canonical et leur CSP lors des contrôles à 14:30 UTC, avec une exception transitoire détaillée ci-dessous avant un second passage réussi. L’index français du blog, Googlebot et Google-CloudVertexBot sur l’accueil ont également répondu 200. Le test Bytespider renvoie bien 403. Le robots.txt public conserve ses autorisations des robots IA et son exclusion Bytespider.

Ces essais vérifient les réponses et la configuration, **pas l’identité de véritables robots fournisseurs ni une indexation effective**. Les prochaines visites réelles pourront être examinées dans AI Crawl Control et les événements Cloudflare. L’indexation, la sélection des sources et les citations restent à la discrétion de chaque moteur.

Vérifications du dépôt :

- `pnpm check` : build, types, SEO et 208 cas de redirections réussis ; le fichier liste les huit articles publiés.
- `TEST_BUILT_SITE=1 pnpm test:browser` : 22 tests réussis.
- `pnpm test:deployment` : 25 tests réussis.
- `pnpm audit:performance` : trois mesures sur chacun des quatre scénarios EN/FR mobile/desktop, tous les seuils satisfaits. Performance 96 mobile / 100 desktop ; accessibilité, bonnes pratiques, SEO et navigation agentique à 100. Le contrôle llms.txt est désormais applicable et réussi : **3/3** contrôles agentiques applicables.
- GET local du fichier compilé : 200, `text/plain; charset=utf-8`, 25 liens Markdown.

## Point restant : connexion intermittente à l’origine

Deux réponses 521 ont été observées, avant et après la correction IA :

| Heure UTC | URL | User-Agent de test | Ray ID |
| --- | --- | --- | --- |
| 14:22:15 | `/fr/blog/importer-rapport-confidentialite-iphone/` | Claude-SearchBot | `a4d06f10ed2ee21c-MRS` |
| 14:30:17 | `/blog/iphone-permissions-guide/` | ClaudeBot | `a4d07ad4cac273ab-MRS` |

Le premier article est revenu à 200 au contrôle immédiat. Le second est revenu à 200 à 14:30:55–56 pour un client normal, ClaudeBot et Claude-User, avec contenu et CSP (`a4d07bc6382cc8e8-MRS`, `a4d07bc75fb3b618-MRS`, `a4d07bc8f932c1fb-MRS`). Deux requêtes initiales sur l’accueil avec des identifiants Google ont aussi expiré côté client ; les contrôles suivants ont répondu 200. Ces observations ne permettent pas d’affirmer que la disponibilité de l’origine est résolue.

Pour diagnostiquer ce point, accès en lecture aux journaux Nginx/Apache/Plesk, à l’état du serveur et aux événements de pare-feu/Fail2Ban correspondant à ces heures (16:22 et 16:30 à Paris). Vérifier un éventuel refus ou redémarrage de service et les autorisations des plages IP Cloudflare. Ne pas désactiver le pare-feu ni élargir les accès sans cause identifiée. Aucun accès supplémentaire n’est requis pour les modifications Cloudflare déjà réalisées.

Après publication du commit par le propriétaire et mise à jour Plesk, vérifier aussi `/llms.txt` en production ; il n’est pas encore déployé lors de cet audit.
