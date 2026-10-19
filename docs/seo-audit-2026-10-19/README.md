# Audit Privacy Score Web — 19 octobre 2026

> Mise à jour du propriétaire, 19 octobre : les montants 23,88 €/an et 20,94 €/six mois sont des offres de lancement pour la première période, et non des erreurs de prix. La migration anglais à la racine et la réécriture immédiate des blogs sont désormais autorisées. La quarantaine et le calendrier progressif proposés ci-dessous restent des hypothèses historiques non appliquées. Search Console est maintenant connecté ; voir `search-console-baseline.json`. Le bilan de livraison courant sera dans `docs/seo-rebuild-2026-10-19.md`.
## Décision recommandée

Conserver Astro et l'hébergement actuel. Corriger d'abord l'offre commerciale, les erreurs factuelles et les liens ; installer une mesure d'acquisition exploitable ; développer ensuite quelques contenus pratiques et vérifiés. Ne pas lancer une migration générale des URL pour tenter de réparer la visibilité.

Les deux articles anglais signalés par le propriétaire doivent rester hors index tant qu'ils ne sont pas révisés. Leur absence de Google est déclarée par le propriétaire ; le motif exact Search Console n'est pas disponible. Aujourd'hui, leur HTML autorise pourtant l'indexation et le sitemap les soumet aux moteurs.

Cet audit ne constate pas une pénalité Google. Il identifie des défauts vérifiés et une faible visibilité dans la base DataForSEO ; il ne permet pas d'attribuer causalement une baisse de trafic à une erreur précise sans historique Search Console.

## Ce qui a été contrôlé

- Dépôt au commit `df3bf12` : routes, contenu complet des quatre articles, métadonnées, schémas, navigation, configuration Astro, documentation d'exploitation et ancien audit.
- Site public derrière Cloudflare : 18 URL du sitemap et la racine ; liens internes, fragments, 24 destinations externes uniques, redirections historiques et variantes d'hôte/protocole ; pages introuvables ; robots et sitemap.
- Build à partir du lockfile : `pnpm install --frozen-lockfile`, puis `pnpm build`. Résultat : 0 erreur, 0 warning et 45 hints (principalement API Zod dépréciée et imports inutilisés). Le HTML des 18 pages du sitemap est identique octet par octet à celui servi publiquement.
- DataForSEO : visibilité France/français et États-Unis/anglais ; historique mai–octobre ; 18 expressions demandées ; deux SERP Google mobiles en direct ; résumé backlinks ; deux audits Lighthouse mobiles.
- Connecteur Analytics : seule la propriété `codevelop.fr` est accessible. Aucune propriété Privacy Score n'est visible dans ce compte connecté.
- Fiche App Store française en ligne et documentation primaire Apple/Google/CNIL pour les recommandations concernées.

Les requêtes DataForSEO de cet audit ont coûté **0,227036 USD**, selon les réponses API, dont 0,01 USD pour les deux tâches Lighthouse. Aucun abonnement ni suivi payant récurrent n'a été créé.

Le crawl HTTP ne lit pas les réglages Cloudflare/Plesk, la configuration effective du serveur, les logs d'origine, l'historique GSC ou le binaire iOS. Simuler un User-Agent Googlebot ne prouve pas l'accès des véritables robots Google. Les tests Lighthouse représentent deux chargements de laboratoire, pas le 75e percentile des visiteurs.

## État mesuré

| Élément | Résultat vérifié | Conséquence |
|---|---|---|
| Pages annoncées dans le sitemap | 18, toutes en HTTP 200 | Pas de panne générale de découverte ou de disponibilité |
| Canonical des 18 pages | Auto-référents, HTTPS, `www`, slash final | Le domaine canonique principal est cohérent |
| Racine `/` | HTTP 200, `noindex,nofollow`, JavaScript + meta refresh vers une langue | À simplifier après choix durable de la page racine |
| Deux articles EN | HTTP 200, `index,follow`, présents au sitemap | Leur exclusion actuelle de Google n'est pas une protection durable |
| Réponses inexistantes | Vrai HTTP 404 avec page personnalisée | Pas de soft 404 général observé |
| Destinations externes | 8 HTTP 404 sur 24 ; 1 HTTP 429 | Registre de réparation dans `links-to-fix.md` ; 429 à revérifier |
| Ancres du menu | 64 URL avec fragment sans cible sur 16 pages secondaires | Quatre liens de navigation ne fonctionnent pas hors accueil |
| Analytics | Aucun marqueur GA4/autre outil repéré dans le HTML ou le code | Impossible d'évaluer actuellement les conversions web depuis ce dispositif |
| Données structurées | JSON lisible, produit partiellement obsolète | Syntaxe valide ne signifie ni contenu exact, ni résultat enrichi acquis |
| Host/protocole | HTTP et apex redirigés en 301 vers HTTPS `www` sur les variantes testées | Conserver ce choix, ne pas changer d'hôte en même temps que les chemins |

### Performance : le socle est déjà bon

Lighthouse **13.4.0**, mobile, throttling simulé, exécution du 19/10/2026 via DataForSEO :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO technique | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/fr/` | 99 | 92 | 92 | 100 | 2,02 s | 0,008 | 11 ms |
| `/en/blog/iphone-permissions-guide/` | 98 | 92 | 92 | 100 | 2,29 s | 0,005 | 0 ms |

Le score SEO 100 ne vérifie ni la vérité des articles, ni leur indexation, ni leur potentiel commercial. Ces résultats ne justifient pas une refonte du framework. L'INP réel n'est pas mesuré ici ; il faudra une mesure terrain. [Définition et distinction laboratoire/terrain](https://web.dev/articles/vitals).

## Corrections prioritaires

P0 = à traiter immédiatement pour fiabiliser l'information ou respecter l'exclusion éditoriale. P1 = prochain lot de correction. P2 = amélioration après stabilisation. Ces priorités ne sont pas des « pénalités SEO ».

| ID | Priorité | Constat | Action et critère de réussite |
|---|---|---|---|
| A01 | P0 | Deux articles EN de mauvaise qualité toujours indexables | Déployer une exclusion temporaire explicite ; les deux URL doivent émettre `noindex`, sortir du sitemap et ne faire l'objet d'aucune demande d'indexation |
| A02 | P0 | Prix et périmètre Premium périmés | Réconcilier la fiche Apple, le produit et les sources du site ; aucune contradiction restante dans textes/FAQ/JSON-LD/docs légaux |
| A03 | P1 | Erreurs techniques dans les quatre articles | Réviser contre documentation primaire et appareil réel ; chaque procédure reproduite et chaque statistique justifiée ou retirée |
| A04 | P1 | Huit destinations 404 et lien Apple générique | Remplacer les sources par des pages existantes soutenant réellement l'affirmation ; contrôler aussi l'ancre et les redirections |
| A05 | P1 | Hreflang des articles vers l'index du blog de l'autre langue | Réserver les alternates à de véritables équivalents ; supprimer les faux couples, vérifier réciprocité et cible canonique |
| A06 | P1 | Navigation à fragments locaux sur toutes les pages | Renvoyer vers `/{lang}/#section` hors accueil ; zéro fragment interne sans cible |
| A07 | P1 | Aucun parcours web → App Store mesuré | Propriété GA4 et flux web dédiés, consentement, événement de clic, tableau de bord et validation sur vraies visites de test |
| A08 | P1 | Accroche, chiffres et récit journalistique fragiles | Sourcer ou retirer les chiffres ; séparer les enquêtes ; démontrer les fonctions réelles de la version distribuée |
| A09 | P2 | Contenu produit dispersé et incohérent | Centraliser URL App Store, compatibilité, offre/prix par marché, version et date de revue ; ne plus recopier un ancien récapitulatif comme vérité courante |
| A10 | P2 | Erreurs CSS/CSP et accessibilité | Corriger les fontes bloquées, `<main>`, liste invalide, contrastes et liens identifiables ; retest ciblé |
| A11 | P2 | Cache et médias améliorables | Cache long uniquement sur assets versionnés, petit logo responsive, icônes allégées ; vérifier les en-têtes après Cloudflare |
| A12 | P2 | Publication et exploitation sans garde-fous suffisants | Checks de build/liens/canonical/hreflang, déploiement versionné, contrôle après livraison et responsable de revue |

### A01 — Retrait temporaire des deux articles anglais

URL concernées uniquement :

- `https://www.privacyscore.fr/en/blog/iphone-permissions-guide/`
- `https://www.privacyscore.fr/en/blog/iphone-privacy-settings-2026/`

Un **correctif proposé, non appliqué**, est fourni dans [`quarantine-en-articles.patch`](quarantine-en-articles.patch). Il utilise le `noindex` existant du layout pour ces deux slugs, les exclut du sitemap et supprime les hreflang sur les pages rendues `noindex`. Le composant existant émet `noindex,nofollow` : c'est le comportement exact de cette proposition minimale. Une gestion éditoriale durable pourra distinguer `index`, `noindex,follow` et `draft`.

`git apply --check` a validé que la proposition correspond aux sources actuelles. Un build isolé avec `astro check` puis `astro build` confirme les deux directives `noindex`, leur absence du sitemap (16 URL restantes), l'absence de hreflang sur ces pages et le maintien de l'indexabilité des deux accueils. Voir `verification.json` et `quarantine-build.txt`. Elle n'a pas été déployée ; les deux pages restent donc actuellement indexables dans le site public. Ne pas les bloquer dans `robots.txt` : un robot doit pouvoir lire la directive `noindex`. Le retrait du sitemap seul ne suffit pas. [Documentation Google sur noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

La remise en index sera une étape distincte, après réécriture, tests et relecture : retrait du `noindex`, retour au sitemap, puis inspection GSC et éventuelle demande. Aucun calendrier ne peut garantir la décision du moteur. Pour un article sans équivalent français réel, aucun hreflang vers l'index FR.

### A02 — L'offre présentée doit correspondre au produit vendu

Le site annonce **23,88 €/an et 20,94 €/6 mois** ; la [fiche française Apple](https://apps.apple.com/fr/app/privacy-score-tracker-audit/id6762229573) affiche **59,99 €/an et 39,99 €/6 mois** au moment du contrôle. L'écart apparaît dans la FAQ, les pages À propos, les articles EN et les documents légaux. La fiche mentionne aussi outils DNS/VPN et export dans l'abonnement.

Vérifier d'abord l'offre réellement distribuée et les marchés, puis modifier toutes les représentations ensemble. Pour l'anglais international, éviter de présenter le tarif français comme universel. Le téléchargement et le premier audit gratuits sont à distinguer des fonctions Premium. Conserver une source structurée pour l'offre ; aligner les documents légaux par leur circuit de mise à jour, sans remplacer aveuglément des montants dans toutes les langues.

### A03/A08 — La qualité éditoriale est le chantier principal

La [`revue détaillée`](editorial-review.md) donne les fichiers, lignes, preuves et quatre fiches de réécriture. Exemples vérifiés :

- Guide EN permissions : voyant caméra décrit orange alors qu'il est vert ; explication trop restrictive du micro ; accès Photos décrit sans distinguer accès limité et complet.
- Guide EN réglages : prétend être à jour de 2026 tout en s'appuyant sur des versions/chemins anciens ; changement d'adresse DNS confondu avec configuration DoH/DoT.
- Guide FR audit : Mail iCloud présenté comme chiffré de bout en bout grâce à la Protection avancée ; procédure de régénération d'identifiant publicitaire non démontrée.
- Guide FR rapport : rubriques et catégories non conformes au rapport Apple ; exemple dit réel sans preuve associée ; ancre « App Tracking Transparency » qui renvoie à notre propre politique.

Le récit des « 26 agents » mélange vraisemblablement l'enquête Strava du Monde et les enquêtes sur les données de localisation. Il faut retrouver les faits exacts et leur source avant de réutiliser l'histoire. Les compteurs de démonstration, moyennes de traceurs et gains de score doivent être identifiés comme exemples ou accompagnés de mesures documentées.

La fiche App Store actuelle décrit aussi des profils de filtrage DNS/VPN. On ne peut donc pas conclure, sur le seul récapitulatif historique, que le produit actuel ne propose aucun blocage. En revanche, un compteur « traceurs bloqués aujourd'hui » et « appareil protégé » exige une preuve de la mesure et une explication de ses conditions/limites. Un rapport historique et un score interne ne garantissent pas l'absence de fuite.

Pour les deux articles FR, le défaut de contenu mérite également une correction rapide ; l'audit ne présume pas leur état d'indexation. Les erreurs sensibles doivent être retirées sans attendre de nouveaux articles.

### A04/A06 — Liens et parcours

Le [`registre complet`](links-to-fix.md) liste les huit 404 et toutes leurs pages sources. Le contrôle retrouve aussi une URL Apple qui redirige vers l'accueil générique du guide iPhone : une réponse 200 ne garantit pas la pertinence documentaire. Le lien Adjust en 429 nécessite une nouvelle vérification manuelle ou différée.

Dans `src/components/Header.astro:85`, les quatre liens `#story`, `#angles`, `#manifesto`, `#download` sont relatifs à la page courante. Les sections n'existent que sur l'accueil : **16 pages × 4 fragments = 64 destinations sans cible**. Rendre ces liens absolus dans le site vers l'accueil de la langue lorsqu'on lit un article ou une page secondaire. Le CTA App Store séparé fonctionne déjà.

Améliorer aussi le chemin utile : article → import du rapport → App Store, avec un encart contextuel après le tutoriel. Ajouter les captures datées, un auteur lié à sa fiche, une vraie date de révision et des articles connexes. Les quatre fichiers n'ont pas d'image de tutoriel rendue ; la seule longueur du texte n'apporte pas de preuve d'expérience.

### A05 — Hreflang et canonical : deux rôles différents

Les canonical auto-référents du site sont cohérents. Le défaut est dans les alternates : `getAlternateLocaleUrl()` renvoie, pour chaque article, vers l'index du blog dans l'autre langue, et `SEO.astro` réutilise ce choix pour hreflang. Cet index ne renvoie pas vers l'article comme équivalent. Les couples sont donc à la fois non équivalents et non réciproques.

Le sélecteur de langue peut proposer de découvrir le blog dans une autre langue ; une balise hreflang doit décrire une variante du même contenu. Séparer ces responsabilités. Les articles écrits indépendamment n'ont pas besoin d'être artificiellement appariés. Une adaptation réellement équivalente peut l'être même si les slugs diffèrent.

Le sitemap n'annote actuellement que les accueils et les index de blog. Il ne trouve pas automatiquement les pages dont les slugs FR/EN diffèrent ; ce n'est pas une exclusion de ces URL. HTML et sitemap sont des méthodes possibles, sans avantage à multiplier des implémentations divergentes. Utiliser un registre commun des vrais couples, ou garder uniquement des annotations HTML correctes. [Règles Google sur les variantes localisées](https://developers.google.com/search/docs/specialty/international/localized-versions).

## Stratégie des URL : ne pas confondre préférence et nécessité SEO

`/en/` et `/fr/` sont des chemins de langue valables. Le segment `/en/` ne constitue pas, à lui seul, un handicap de référencement. Les versions linguistiques doivent garder des canonical dans leur propre langue. Le `.fr` envoie un signal de ciblage géographique français ; supprimer `/en/` ne le transforme pas en domaine international neutre. [Guide Google des sites multilingues et multirégionaux](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

| Choix | Avantage | Coût/risque | Avis |
|---|---|---|---|
| Garder `/fr/` et `/en/` ; racine avec destination stable ou sélection de langue | Préserve les URL existantes ; correction limitée | Il faut remplacer le mélange sniffer/noindex/canonical de la racine par une politique simple | Recommandé pour la première phase |
| Anglais à `/`, français à `/fr/` | Répond à la préférence produit exprimée ; URL anglaises plus courtes | Migration de toutes les pages EN, signaux à retraiter, fluctuation temporaire possible | Valable si décision durable d'anglais par défaut, pas comme remède automatique à la visibilité |
| Français à `/`, anglais à `/en/` | Cohérent avec marché France et `.fr` | Migration FR similaire | À considérer uniquement si le marché principal reste la France ; pas nécessaire pour corriger le site |

Recommandation : stabiliser qualité et mesure pendant les quatre premières semaines. À ce stade, décider la langue de la racine à partir du marché réellement visé et des données disponibles. Aucune garantie de gain ne justifie une migration immédiate.

Si l'anglais à la racine est retenu :

1. Conserver `https://www.privacyscore.fr` comme origine canonique et le slash final.
2. Établir une table complète : `/en/` → `/`, `/en/about/` → `/about/`, `/en/blog/` → `/blog/`, chaque article et document EN → son équivalent sans `/en`. Conserver les routes FR. La future `/blog/` répond actuellement 404 : il faut vraiment la créer.
3. Servir l'accueil anglais en HTML 200 à `/`, sans redirection automatique selon navigateur, sans `noindex` et avec canonical vers `/`.
4. Modifier routage Astro, helpers d'URL, liens, données structurées, canonical, hreflang et sitemap dans un même lot. Les hreflang ne doivent référencer que les destinations finales et les vrais équivalents.
5. Déployer des **301 serveur** page par page dans Plesk/Nginx, ou des règles Cloudflare précisément bornées. Un stub meta refresh statique Astro ne remplace pas le contrôle HTTP. Éviter les boucles et les chaînes entre règles d'hôte et de chemin.
6. Tester toutes les anciennes/nouvelles URL, y compris slash absent et `index.html`. Ne pas modifier simultanément les sujets ou slugs des articles.
7. Mettre à jour les liens contrôlés, y compris App Store et profils externes, conserver durablement les redirections et comparer GSC avant/après. L'outil de changement d'adresse GSC n'est pas requis pour un simple changement de chemins sur le même domaine.

Ne pas rediriger indistinctement toutes les pages retirées vers l'accueil et ne pas canonicaliser les articles anglais vers le français. [Procédure Google de migration d'URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## Ce que révèle DataForSEO, et ce qu'il ne révèle pas

### Visibilité

La base France/français ne retrouve qu'une expression : **« test privacy »**, accueil FR, position organique **25**, dernier relevé de SERP de cette entrée le **27 août 2026**. L'ETV modélisé est de 0,231 ; ce n'est pas un compteur de visiteurs. Les points d'août, septembre et octobre reprennent la même estimation. Mai–juillet renvoient `null` : aucune conclusion « zéro trafic » ne doit en être tirée.

Le résumé États-Unis/anglais ne renvoie aucune entrée. Le résumé backlinks renvoie aussi un résultat `null` malgré une réponse API réussie ; il ne prouve pas l'absence de backlinks. La couverture et la fraîcheur de ces bases sont insuffisantes pour établir la baisse déclarée.

Sur les SERP mobiles en direct du 19/10 : les premières places des deux expressions « rapport de confidentialité iphone » (FR) et « app privacy report » (US) montrent notamment Apple et des discussions communautaires. Privacy Score n'apparaît pas parmi les résultats organiques retournés sur ces deux requêtes. Ce relevé est un échantillon, pas un audit exhaustif de tous les mots-clés.

### Demande : hypothèses à ajuster

| Expression | Marché | Volume mensuel estimé retourné | Usage conseillé |
|---|---|---:|---|
| confidentialité iphone | France/fr | 50 | Thématique utile, traiter le besoin concret |
| rapport de confidentialité des apps | France/fr | 20 | Très proche du produit ; contenu de référence pratique |
| rapport de confidentialité iphone | France/fr | 10 | Guide existant à réparer en priorité |
| sécurité iphone | France/fr | 140 | Plus large que le produit ; éviter les promesses de sécurité générales |
| tracker iphone | France/fr | 260 | Ambigu : vérifier si l'internaute cherche géolocalisation, traceur physique ou confidentialité |
| app privacy report | États-Unis/en | 590 | Guide précis avec exemple et étapes d'import |
| iphone privacy settings | États-Unis/en | 1 300 | Concurrentiel et vaste : choisir un angle démontrable |
| iphone app tracking | États-Unis/en | 1 900 | Distinguer ATT, réseau observé et protection effective |
| iphone permissions | États-Unis/en | 140 | Réparer le guide, limiter explicitement son périmètre |

Ces valeurs sont celles de `keyword_info.search_volume`, avec des dates de mise à jour variant selon la requête entre septembre et octobre 2026. Elles ne sont ni des visites attendues ni des volumes à additionner. Les mots-clés absents, dont « audit confidentialité iphone », n'ont pas de mesure dans la réponse : ce n'est pas une preuve de demande nulle. Les volumes fictifs fournis comme exemples dans d'anciens playbooks ne doivent pas devenir des objectifs commerciaux.

Privilégier l'intention : lire, exporter, importer, comprendre un domaine, expliquer un score et résoudre un rapport vide. Ces tâches sont plus directement liées à l'application que « confidentialité » au sens large.

## Mesure d'audience et conversion

### Choix proposé

Créer une propriété **GA4 dédiée Privacy Score**, un flux Web pour `https://www.privacyscore.fr`, et relier Search Console. C'est cohérent avec la demande explicite de disposer de Google Analytics. L'ancienne règle de `CLAUDE.md` refusant tout outil tiers doit être révisée pour la mesure du site ; il faut conserver une distinction claire entre **analytics du site** et **absence de collecte du rapport par l'app**.

La propriété n'est pas visible dans le connecteur actuel et aucun identifiant `G-...` n'est présent dans le dépôt. Il faut soit créer la propriété/flux dans le compte voulu, soit donner accès à une propriété existante. Ne pas réutiliser l'identifiant de `codevelop.fr` et mélanger les deux activités.

Implémentation recommandée : chargement de GA4 après accord, refus aussi accessible que l'acceptation, conservation du choix et retrait possible ; pas de script GA ni d'événement analytique envoyé avant consentement dans cette variante. Le **Consent Mode basic** permet de garder les balises bloquées avant le choix ; ne pas confondre avec la variante avancée et ses pings. Mettre à jour les mentions sur la mesure du site, limiter les données et désactiver les fonctions publicitaires inutiles. [Documentation Google du consentement](https://developers.google.com/tag-platform/security/guides/consent).

Une solution auto-hébergée comme Matomo reste une alternative si la priorité est une mesure plus complète avec moins de dépendance à Google. Une exemption de consentement n'est jamais automatique : elle dépend de la finalité et de la configuration. [Critères CNIL des outils de mesure d'audience](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience). Choisir une seule solution principale au départ.

### Plan de marquage minimal

| Événement | Déclenchement | Paramètres utiles | Exploitation |
|---|---|---|---|
| `page_view` | Une seule fois par navigation de page | chemin canonique, langue, type de page | Pages d'entrée, parcours, engagement |
| `app_store_click` | Clic sur un vrai lien App Store | langue, chemin, article, position du CTA (`header`, `hero`, `article`, `footer`) | Événement clé web ; intention de téléchargement |
| `article_cta_click` | Clic vers guide d'import ou présentation produit | identifiant article, destination, position | Comprendre le passage du contenu à l'app |
| `language_switch` | Changement explicite de langue | langue d'origine/destination, chemin | Diagnostiquer l'orientation linguistique |
| `scroll` | Seuil défini et non répété, si utile | type de page, article | Lecture, avec prudence sur l'interprétation |

Éviter le doublon entre les clics sortants automatiques et l'événement App Store personnalisé dans le calcul des conversions. Ne transmettre ni rapport Apple, ni liste de domaines observés, ni texte libre, ni identifiant de compte/appareil, ni paramètres sensibles d'URL. Les événements sont à tester sur acceptation, refus et retrait, ainsi qu'en navigation clavier.

GA4 donne une vue des visiteurs mesurés, avec délais et refus de consentement : pas une observation exhaustive de tous les gestes, pas de rejeu de session par défaut. Un clic vers l'App Store **n'est pas une installation**. Pour relier davantage l'acquisition au produit, générer des liens de campagne dans App Store Connect et suivre téléchargements/abonnements agrégés par campagne selon disponibilité et seuils Apple. Aucun jeton ne doit être inventé. [Campagnes App Store Connect](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links).

### Tableau de bord à installer

Une vue hebdomadaire compacte :

1. Search Console : clics/impressions organiques, requêtes marque/hors marque, pages, pays, appareils ; 28 jours complets versus 28 jours précédents ; 90 jours et comparaison annuelle si l'historique existe. Analyser la position à périmètre de requêtes constant pour ne pas confondre changement de mix et baisse.
2. Indexation : seulement les URL **destinées à être indexées**, sitemap reçu, erreurs HTTP, canonical déclarée/choisie et dernière exploration ; exclure les deux EN en quarantaine du dénominateur.
3. GA4 : pages d'entrée, visiteurs mesurés, source/support, clics App Store uniques, taux de clic par page/langue/CTA, évolution de l'acceptation du consentement.
4. App Store Connect : vues de fiche et téléchargements attribuables aux campagnes web, puis abonnements si le volume le permet.

Ne pas présenter impressions GSC, visiteurs GA4 et installations comme des grandeurs interchangeables. Le connecteur ne recrée pas un historique d'événements qui n'a jamais été collecté.

## Architecture et exploitation

### Conserver le socle

Le build statique Astro 6.4.3, Cloudflare puis Plesk/Nginx correspondent au site public et conviennent au besoin. Les en-têtes publics confirment Cloudflare et Plesk ; ils ne prouvent pas le détail de la VM ou de l'amont Apache. Les accès panneau/serveur ne sont pas disponibles dans cette session.

Il serait prématuré de déplacer l'hébergement ou d'ajouter un CMS pour résoudre quatre articles, des liens défectueux et l'absence d'instrumentation. Markdown reste adapté. Revoir le CMS uniquement si le circuit éditorial devient le vrai point de blocage.

### Réparer les petits défauts mesurés

- **Polices bloquées par CSP** : Lighthouse retrouve deux fontes encodées en `data:font/woff2` refusées par `font-src 'self'`. Vérifier l'inlining Vite ; privilégier des fichiers WOFF2 locaux externes et un test réseau/console après publication. Ne pas assouplir toute la CSP pour réparer ce point.
- **Cache des ressources** : TTL de quatre heures observé, y compris sur le WOFF2 à nom hashé. Mettre un cache long avec `immutable` sur les assets versionnés et une politique de revalidation des documents HTML. Vérifier le résultat à la sortie de Cloudflare, pas uniquement le fichier de configuration.
- **Logo** : PNG de 147 141 octets affiché en environ 28 px CSS ; Lighthouse estime près de 143 Kio évitables. Produire une petite variante adaptée à la densité d'écran, éviter de charger plusieurs gros formats du même logo. La fonte complète d'icônes pèse environ 174 Ko ; des SVG locaux peuvent remplacer les quelques glyphes utilisés après inventaire.
- **Sémantique** : accueil sans `<main>` ; `<ol class="steps">` contient directement des `<article>` au lieu de `<li>` ; corriger sans changer la présentation.
- **Accessibilité** : gris du pied de page à 4,23:1, petit compteur de chapitre à 3,02:1 ; liens de métadonnées distingués seulement par couleur. Corriger les couleurs/soulignements, tester le clavier et conserver la préférence de réduction des animations déjà prévue.
- **Variantes `index.html`** : `/fr/index.html` et `/en/index.html` sont accessibles en 200 avec canonical correct. Ce n'est pas un blocage majeur ; ajouter des 301 vers les chemins propres lors du travail de routage, sans créer une boucle avec les rewrites internes du serveur.

### Mettre à jour les instructions d'exploitation

`DEPLOY.md` propose encore un hôte canonique apex alors que le site public est en `www`. Il mélange une configuration Nginx autonome et l'exploitation Plesk documentée plus tard dans `CLAUDE.md`. Ne pas recopier ce vhost sur la VM de production. Les règles de redirection existantes des trois anciennes pages légales FR fonctionnent en 301 et doivent rester.

Le guide conseille aussi de supprimer `_astro/` avant un upload : cela peut casser les pages en cache pendant une livraison non atomique. Préparer une release complète, la contrôler, puis basculer atomiquement avec retour arrière ; conserver les anciens assets le temps des caches. Les chemins Plesk doivent être vérifiés avant d'écrire les commandes finales.

Centraliser le registre des routes, les équivalences linguistiques et les métadonnées produit. Ajouter un état éditorial (`draft`, `review`, `published` ou équivalent), une date de vérification réelle, un responsable et les sources. Ne pas forcer une publication anglaise et française le même jour si l'une n'est pas prête.

## Revoir les anciennes règles SEO

Les instructions locales sont un historique de décisions, pas une source d'autorité sur Google. Plusieurs affirmations de l'ancien audit/playbook doivent être corrigées :

- Une ponctuation comme le tiret cadratin n'est pas un « bloqueur SEO ». Les seuils 50–60 caractères pour le titre et 150–160 pour la description sont des repères d'affichage, pas des conditions d'indexation. Un texte exact, distinct et compréhensible est prioritaire. [Conseils Google sur les titres](https://developers.google.com/search/docs/appearance/title-link).
- Un nombre minimal de mots ou une fréquence de publication ne prouve pas la qualité. Une traduction ou une assistance IA ne constitue pas à elle seule une infraction ; il faut contrôler exactitude, utilité et valeur ajoutée. Ne pas générer des pages en série pour couvrir artificiellement des expressions. [Google et contenu généré](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content).
- FAQPage/HowTo et l'autorisation de robots IA ne garantissent pas une citation dans un moteur de réponse. Ne pas créer un `SearchAction` sans recherche réelle ni inventer des avis.
- Un score Lighthouse SEO à 100 et une accumulation de schémas n'établissent pas la qualité éditoriale ni la capacité à acquérir des utilisateurs.

## Calendrier d'exécution : douze semaines

Estimation de charge à confirmer après choix d'analytics et accès GSC : **environ 7 à 12 jours de travail répartis sur le trimestre**, plus une courte routine hebdomadaire. Les dates sont des créneaux proposés, pas des automatisations déjà programmées. Le rédacteur teste les procédures ; le propriétaire valide les faits produit/prix ; le développeur livre et vérifie.

| Période | Travail | Livraison attendue | Validation |
|---|---|---|---|
| 19–21 octobre | A01, réconciliation de l'offre, correction des erreurs les plus sensibles ; collecte baseline GSC | Correctif de retrait temporaire + inventaire produit fiable | EN `noindex`, sitemap nettoyé, prix vérifiés, aucun texte trompeur conservé pour attendre le SEO |
| 22–25 octobre | Liens externes, menu, faux hreflang ; premiers textes homepage | Lot technique et confiance | Zéro lien interne/fragment cassé ; sources pertinentes ; alternates réciproques entre vrais équivalents |
| 26 octobre–1er novembre | GA4/consentement/marquage, tableau de bord ; révision des quatre articles | Mesure testée + contenus existants corrigés | Tests acceptation/refus/retrait ; comparaison à l'offre ; validation factuelle ; remise en index EN seulement après revue |
| 2–15 novembre | Guide FR/EN pour activer, exporter et importer le rapport ; petits correctifs Lighthouse | Un dossier pratique illustré, adapté dans les deux langues | Procédure reproduite, captures, liens et CTA ; aucune régression de performance |
| 16–29 novembre | Rapport vide/données manquantes ; première lecture sur 28 jours | Dossier de diagnostic et bilan initial | Erreurs rencontrées réelles ; actions tirées des pages/requêtes qui progressent |
| 30 novembre–13 décembre | Exemple de rapport commenté ; revue liens/offre | Contenu de preuve et optimisation du parcours | Rapport synthétique explicitement identifié, ou cas réel autorisé ; limites expliquées |
| 14 décembre–10 janvier 2027 | Méthodologie du score ; bilan 8–12 semaines ; décision URL si toujours souhaitée | Dossier méthodologie + priorités du trimestre suivant | Résultats acquisition/conversion séparés ; migration seulement avec mapping et tests prêts |

Cadence durable : **un dossier utile toutes les deux à trois semaines**, adapté en FR/EN quand pertinent, et une amélioration des contenus existants entre deux dossiers. Reporter un nouveau sujet si les erreurs existantes ne sont pas encore réparées. Le [calendrier éditorial détaillé](editorial-review.md) précise les intentions de chaque dossier.

## Veille légère et critères de réussite

| Fréquence | Contrôle | Action/alerte utile |
|---|---|---|
| À chaque build | Pages HTML, canonical, alternates, sitemap, liens internes/fragments, état éditorial | Bloquer une livraison qui réintroduit une page en quarantaine ou une destination inexistante |
| Après déploiement | Site public, redirections, cache/CSP, consentement et événements | Rollback si problème fonctionnel ; noter la date de release dans le tableau de bord |
| Hebdomadaire, 20–30 min | GSC, GA4, campagnes App Store et erreurs serveur pertinentes | Une décision éditoriale/conversion basée sur un signal exploitable ; rester silencieux si rien ne change dans une future automatisation |
| Mensuelle | Liens externes, offre App Store, version/compatibilité, indexation voulue | Corriger les 404 confirmées ; revérifier 403/429 avant de les classer mortes |
| À chaque changement majeur iOS/app | Chemins Réglages, captures, fonctionnalités et promesses | Réviser uniquement les contenus affectés et dater leur vraie vérification |

Objectifs techniques : 0 lien interne cassé, 0 source externe 404 connue sans traitement, 0 faux hreflang, offre cohérente, aucune collecte avant accord pour l'option GA4 choisie. Préserver les bons chargements mobiles ; suivre LCP/CLS et obtenir une mesure INP terrain quand le volume le permet.

Objectifs business : établir les 28 premiers jours de baseline, puis augmenter les clics qualifiés hors marque et les clics App Store par page utile. Ne pas fixer un pourcentage de croissance ou un nombre d'installations sans point de départ. Avec peu de trafic, lire des volumes et fenêtres suffisamment larges avant de conclure à une tendance.

## Accès à compléter et livrables fournis

**Nécessaire pour quantifier la baisse :** Search Console, idéalement propriété Domaine `privacyscore.fr`, accès en lecture ou exports performances et indexation. Il faut le motif de chaque URL exclue, dernière exploration et canonical choisie. Ne pas attribuer la baisse au contenu, aux URL ou à une mise à jour Google sans chronologie vérifiable.

La recherche dans le catalogue a trouvé **Windsor.ai**, une intégration tierce qui annonce l'accès à Search Console ; elle a été suggérée, pas installée ni connectée. Une connexion GSC directe configurée par le propriétaire ou des exports restent possibles. Aucun outil GSC n'est devenu disponible pendant cet audit.

**Nécessaire pour instrumenter :** propriété/flux Web GA4 dédié ou accès à la propriété existante, identifiant de mesure public et décision finale de la solution ; accès App Store Connect si l'on souhaite créer des liens de campagne et rapprocher les téléchargements. **Nécessaire pour livrer/réviser l'infrastructure :** configuration actuelle Plesk/Cloudflare et chemin de publication ; des logs exportés peuvent suffire au diagnostic des robots.

Aucun nouveau skill n'est indispensable. DataForSEO a suffi à la recherche et aux mesures Lighthouse ; un MCP Search Console est l'ajout le plus utile. Chrome DevTools MCP serait utile pour des traces et tests interactifs approfondis. Le skill [web-perf](/Users/skanderbahri/.codex/skills/web-perf/SKILL.md) impose d'arrêter son workflow de trace Chrome si le MCP manque (« If unavailable, STOP ») ; aucune trace DevTools n'a donc été prétendue. Les résultats de performance présentés viennent du workflow Lighthouse DataForSEO distinct. L'API publique PageSpeed a répondu 429, et la documentation du endpoint Lighthouse live était indisponible ; les tâches Lighthouse standard ont abouti.

Fichiers :

- [`editorial-review.md`](editorial-review.md) : erreurs détaillées et sources, article par article.
- [`links-to-fix.md`](links-to-fix.md) : registre des liens et fragments à réparer.
- [`crawl.json`](crawl.json) et [`audit_site.py`](audit_site.py) : preuves HTTP et contrôle reproductible en lecture seule (`python3 docs/seo-audit-2026-10-19/audit_site.py`).
- [`dataforseo.json`](dataforseo.json) : réponses initiales de visibilité, historique et mots-clés ; [`market-summary.json`](market-summary.json) : synthèse des appels, SERP et limites.
- [`lighthouse.json`](lighthouse.json) : mesures de laboratoire, configuration et détails des défauts repérés.
- [`quarantine-en-articles.patch`](quarantine-en-articles.patch) : proposition minimale de retrait temporaire des deux EN, vérifiée par `git apply --check`, non appliquée.
- [`verification.json`](verification.json) et [`quarantine-build.txt`](quarantine-build.txt) : vérification du correctif par build isolé ; sources du site non modifiées.

**État de livraison : audit et proposition de correctif uniquement. Aucun fichier produit modifié, aucune configuration distante changée, aucune demande d'indexation, aucune publication ni automatisation créée.**
