# Indexation et attribution — 20 octobre 2026

> Le premier relevé ci-dessous précède la connexion aux trois interfaces. Le propriétaire s’est ensuite connecté : lire la section **Intervention après connexion** pour l’état courant. L’accès MCP GA4 et la clé API Apple gardent leurs limites propres ; la connexion au navigateur ne les élargit pas.

## Vérifié pendant cette intervention

- Le sitemap public annonce **22 URLs**. Les 22 pages répondent en HTTP 200, sans redirection, avec une canonical unique vers leur propre URL, une directive `index,follow` et aucun en-tête `X-Robots-Tag`. Les huit articles sont inclus. Ce contrôle établit leur accessibilité et leur indexabilité technique, **pas leur présence dans l’index Google**. Preuve : [public-pages.json](public-pages.json).
- Les deux anciennes URLs `/en/blog/iphone-permissions-guide/` et `/en/blog/iphone-privacy-settings-2026/` répondent en **301 directe** vers leur équivalent sans `/en/`.
- Le bon ID GA4 `G-QT0QFTD7L5` est présent sur les 22 pages. Sa présence ne prouve pas la réception des événements dans Google Analytics.
- Search Console est lisible via Windsor.ai pour `sc-domain:privacyscore.fr`. Le relevé retourné du sitemap indique une dernière lecture le **15 octobre**, 18 URLs soumises, zéro erreur et zéro avertissement. Il précède la migration du 19 octobre : ni ce nombre ni le champ obsolète `indexed` ne permettent de compter les URLs actuellement indexées.
- Les dernières données de performance finalisées retournées s’arrêtent au **17 octobre**. Du 20 septembre au 17 octobre inclus : **7 clics, 208 impressions, CTR 3,37 %**. Les données ne mesurent donc pas encore les effets de la migration. Les sommes de lignes par page ne doivent pas remplacer les totaux par propriété. Preuve : [search-console.json](search-console.json).
- Le connecteur Google Analytics ne voit toujours que Codevelop. La lecture de la propriété Privacy Score `559523211` renvoie **403**. La lecture des définitions, des événements et des rapports reste à faire.
- La clé App Store Connect locale peut lire la fiche de Privacy Score (`6762229573`), mais la liste des demandes Analytics renvoie une erreur de droits. Aucune session web Apple locale n’est authentifiée. Aucune clé n’a été créée, élargie ou copiée.

## Accès nécessaires pour terminer

Trois onglets ont été préparés dans le navigateur intégré ; la connexion doit être effectuée par le propriétaire, sans envoyer de mot de passe, code à usage unique ou secret dans la conversation.

1. **Search Console**, propriété `privacyscore.fr` : utilisateur complet/propriétaire, pour consulter l’indexation et l’inspection d’URL, tester les pages publiques et soumettre de nouveau le sitemap si nécessaire. Le connecteur Windsor donne les performances et le relevé de sitemap, pas l’inspection des URLs.
2. **Google Analytics**, propriété `559523211` : rôle **Éditeur**, pour contrôler le flux web, créer/réutiliser les définitions personnalisées et l’événement clé, puis enregistrer les explorations. Pour les lectures MCP ultérieures, reconnecter également le connecteur au compte ayant accès à cette propriété ; la connexion au navigateur ne change pas les droits du connecteur.
3. **App Store Connect**, app Privacy Score : accès à **Analytics et aux campagnes** pour générer le lien de campagne officiel et consulter ses résultats. La clé API existante est insuffisante pour les rapports Analytics ; l’interface authentifiée peut permettre de terminer sans créer de nouvelle clé.

Lors du premier relevé, ces accès manquaient et aucune modification distante n’avait encore été réalisée. La connexion du propriétaire a ensuite permis les opérations ci-dessous.

## Intervention après connexion

- **Sitemap envoyé à nouveau et confirmé par Google le 20 octobre**, avec état « Opération effectuée » et dernière lecture le même jour. Le compteur affichait encore 18 pages découvertes lors du contrôle ; le sitemap public contient bien 22 URLs. Ce compteur n’est pas le nombre de pages indexées et peut refléter le traitement des sous-sitemaps.
- Le rapport global d’indexation, daté du **12 octobre**, affiche 14 pages indexées et 11 exclusions : 4 redirections, 3 anciennes directives noindex, 3 pages détectées non indexées et 1 page explorée non indexée. Il ne décrit pas encore les nouvelles destinations après migration.
- **Inspection individuelle des 12 pages principales** : accueil FR et index de blog FR indexés ; accueil EN encore exclu sur la base d’une exploration du 15 octobre (ancien noindex, canonical `/en/`) ; index du blog EN inconnu ; huit articles non indexés à l’instant du contrôle. Les deux articles FR originaux sont détectés mais jamais explorés ; les six autres adresses d’article sont inconnues de l’index.
- Le test Google en direct de `/` et de `/blog/iphone-privacy-settings-2026/` indique **Google a accès à cette URL / La page peut être indexée**. La version actuelle de la racine ne reproduit donc pas l’ancien noindex observé le 15 octobre.
- **Neuf demandes d’indexation acceptées par Google** : `/` et les huit articles, après le contrôle d’admissibilité de Google. Le guide EN d’export a rencontré une erreur Google générique au premier envoi ; une seule reprise ultérieure a été acceptée. Le sitemap assure aussi la découverte des pages qui ne font pas l’objet d’une demande manuelle.
- **GA4 : neuf dimensions événementielles créées** et vérifiées dans l’administration, ainsi que **Temps de lecture actif**, paramètre `reading_time_msec`, unité Millisecondes. Le nom d’affichage autorisé par Google pour la fin d’article est **Fin article atteinte**.
- **`app_store_click` marqué comme événement clé**. Les événements récents du flux PrivacyScore comprennent réellement `app_store_click` et `page_scroll` ; leur réception n’est plus une simple déduction du HTML. Les chiffres initiaux peuvent inclure les essais du propriétaire et de cette intervention.
- L’exploration **Acquisition et lecture Privacy Score** contient les vues **Web vers App Store**, **Lecture vers App Store** et un tableau **Engagement des articles**. Les paramètres personnalisés ne sont exploitables sur de nouvelles données qu’après leur enregistrement et traitement.
- **Collecte réelle confirmée en Temps réel** : `article_view`, `article_read_time`, `article_engagement`, `page_scroll` et `app_store_click` comme événement clé. Une visite consentie de contrôle et un clic App Store ont été réalisés ; le consentement de cette visite a ensuite été retiré. Ces essais ne doivent pas être interprétés comme des visiteurs acquis ou des ventes. La confirmation des événements ne dépend pas du connecteur MCP, qui renvoie encore 403.
- **Lien de campagne Apple officiel généré** : provider token `119041406`, campagne `privacyscore_web`, type média `8`. Le tableau Apple affiche « Données insuffisantes pour afficher les campagnes » ; la génération d’un lien ne crée pas des résultats avant les seuils Apple.
- **Code local préparé** pour appliquer la campagne aux liens App Store après consentement et restaurer les liens simples au retrait/refus/expiration. Ce code et `content_language` attendent le push du propriétaire et son déploiement habituel ; aucune publication n’est effectuée ici.

Les demandes d’indexation ne constituent pas une confirmation d’indexation. Conserver ces observations datées plutôt que de présenter les nouveaux contenus comme déjà indexés.

Relevé structuré : [connected-setup.json](connected-setup.json). Accès aux [rapports GA4 enregistrés](https://analytics.google.com/analytics/web/#/analysis/a344906043p559523211/edit/rIseypLPRoi5SCJ_0YQ7zg).

## Procédure de contrôle et de maintenance

### Search Console

1. Lire le rapport d’indexation et le sitemap existant ; distinguer les anciennes URLs redirigées des 22 destinations finales.
2. Inspecter `/`, `/fr/`, les deux index de blog et les huit articles. Relever pour chaque page : état, motif d’exclusion éventuel, dernière exploration, récupération, indexation autorisée et canonical choisie par Google.
3. Pour une destination absente ou basée sur une ancienne exploration, lancer un test en direct. Si le test confirme son admissibilité, demander l’indexation lorsque pertinent. Une demande est une invitation à réexplorer, pas une confirmation d’indexation.
4. Soumettre à nouveau `https://www.privacyscore.fr/sitemap-index.xml` si la lecture reste antérieure à la migration ; consigner l’état reçu et la date. Ne pas utiliser l’outil de changement d’adresse pour une migration de chemins sur le même domaine.

### Google Analytics

La [spécification des événements et définitions](../analytics-measurement.md) est la référence. Lire l’existant avant de créer quoi que ce soit pour éviter les doublons.

- Créer/réutiliser les neuf dimensions événementielles : `content_language`, `page_type`, `article_path`, `destination`, `cta_position`, `scroll_percent`, `max_scroll_percent`, `read_seconds`, `article_end_reached`.
- Créer/réutiliser la métrique événementielle `reading_time_msec`, en millisecondes. Additionner uniquement cette durée incrémentale ; ne pas additionner les cumuls `active_read_seconds` ou les paliers `read_seconds`.
- Marquer `app_store_click` comme événement clé. Conserver les comptes de clics et de visiteurs distincts ; utiliser les sessions ayant un clic / sessions consenties pour le taux de passage vers l’App Store. Ne pas additionner le clic sortant automatique au clic personnalisé.
- Enregistrer **Acquisition web → App Store** : entonnoir ouvert `page_view` → `app_store_click`, étapes indirectes, ventilations disponibles par page d’entrée, langue du contenu, appareil et source/support.
- Enregistrer **Lecture → App Store** : entonnoir ouvert `article_view` → `article_read_time` avec `read_seconds = 30` → `app_store_click`, étapes indirectes, ventilation par article. Prévoir une variante avec `article_complete` pour la lecture approfondie. Une exploration par utilisateurs ne remplace pas le taux par sessions ci-dessus.
- Enregistrer une exploration **Engagement des articles** : article, langue du contenu, vues, paliers, fins, lectures complètes et temps actif. Le temps total divisé par les utilisateurs lecteurs doit être nommé précisément ; ce n’est ni la rétention iOS ni une preuve de lecture intégrale.
- Vérifier en Temps réel une visite réelle après consentement, puis le refus/retrait. Les tests locaux interceptent Google et ne prouvent pas sa réception. Attendre la disponibilité des nouvelles définitions avant de conclure qu’un rapport vide est un défaut de collecte.

**Correction locale du 20 octobre :** les événements utilisent désormais `content_language`. La dimension native **Langue** représente le navigateur/appareil et ne doit pas être remplacée par la langue de la page. Un navigateur français visitant `/` doit conserver sa langue navigateur française et produire `content_language = en`. Cette correction n’est effective en production qu’après le push du propriétaire, la pipeline et le pull Plesk.

### App Store Connect

1. Lire les campagnes existantes. Générer/réutiliser un lien officiel pour une campagne initiale globale, par exemple `privacyscore_web` ; éviter de fragmenter d’emblée le faible volume en une campagne par article ou bouton.
2. Récupérer le **provider token réellement généré par Apple** ; ne pas le déduire de l’ID app, du Team ID ou du provider ID de la session.
3. Intégrer le lien aux CTA après consentement à la mesure ; conserver la destination simple après refus/retrait. Les URLs de téléchargement dans les données structurées restent propres. Contrôler tous les boutons, y compris ceux présents dans les articles.
4. Vérifier que le lien ouvre la bonne fiche et que le nom de campagne est exact. Un clic de contrôle n’est ni une installation ni une preuve d’attribution d’achat.
5. Enregistrer les vues de fiche, premiers téléchargements et abonnements disponibles par campagne, en conservant les dates et définitions Apple. Les métriques ne sont affichées qu’au-delà des seuils Apple ; absence de ligne n’équivaut pas à zéro. La campagne n’est pas un identifiant permettant de suivre individuellement un visiteur GA4 dans l’app.

Le provider token officiel a été obtenu et intégré au code local. Aucun token fictif ni paramètre de campagne incomplet n’a été ajouté au site. Après publication par le propriétaire, vérifier un lien consenti en production et attendre les seuils Apple avant d’interpréter les rapports de campagne.

## Sources primaires

- [Inspection d’URL Google](https://support.google.com/webmasters/answer/9012289)
- [Définitions personnalisées GA4](https://support.google.com/analytics/answer/14240153)
- [Dimension Langue GA4 : navigateur/appareil](https://support.google.com/analytics/answer/13785913?hl=en)
- [Campagnes et seuils App Store Connect](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links)

## Vérifications locales

- `pnpm check` : Astro, zéro erreur/avertissement ; contrôles SEO de 35 fichiers HTML et 22 URLs indexables ; 208 cas de redirection validés.
- `TEST_BUILT_SITE=1 pnpm test:browser` : **26 tests réussis** sur le build, dont refus/retrait du consentement, progression de lecture, parcours App Store, campagne sur quatre pages EN/FR, retrait entre onglets, expiration, navigation FR/EN, accessibilité et navigateur français consultant le contenu anglais.
- `git diff --check` : réussi.
- `pnpm audit:performance` : trois mesures par scénario EN/FR mobile/ordinateur ; performances médianes **96/100 sur mobile**, **100/100 sur ordinateur**, et **100/100** pour accessibilité, bonnes pratiques, SEO et navigation agentique. Le LCP mobile de laboratoire est d’environ 2,70 s ; ces scores ne représentent pas des Core Web Vitals terrain.

Ces tests interceptent Google ; la réception dans GA4 a été vérifiée séparément dans l’interface de production. Le contenu et la présentation du site sont conservés.

Les changements du dépôt sont préparés sur `main`, sans push. Aucune modification graphique n’est incluse.
