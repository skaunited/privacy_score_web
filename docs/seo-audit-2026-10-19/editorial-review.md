# Revue éditoriale et conversion — 19 octobre 2026

> Mise à jour du propriétaire, 19 octobre : les montants 23,88 €/an et 20,94 €/six mois sont des offres de lancement pour la première période, et non des erreurs de prix. La migration anglais à la racine et la réécriture immédiate des blogs sont désormais autorisées. La quarantaine et le calendrier progressif proposés ci-dessous restent des hypothèses historiques non appliquées. Search Console est maintenant connecté ; voir `search-console-baseline.json`. Le bilan de livraison courant sera dans `docs/seo-rebuild-2026-10-19.md`.
Périmètre : les quatre articles complets, les deux dictionnaires et homepages, les deux pages À propos, les templates de blog et les constructeurs JSON-LD. Lecture de `CLAUDE.md`, `ERRORS.md`, du skill local `seo-master`, de la stratégie de mots-clés et de l'audit du 31 mai. Aucune modification des sources, aucun crawl externe général, aucun appel DataForSEO. Vérifications ciblées auprès d'Apple, DuckDuckGo et Google, plus la source journalistique originale.

Ces constats prouvent des défauts de contenu et de parcours ; ils ne prouvent pas la cause de la baisse d'audience ni la raison du refus d'indexation de deux URL. Ces deux diagnostics nécessitent les données Search Console, les dates et les URL exactes.

Les deux articles EN signalés doivent être révisés **avant toute demande d'indexation**. La proposition de mise à l'écart temporaire est conservée séparément dans `quarantine-en-articles.patch` ; elle n'est pas appliquée par cette revue.

## Priorités transversales

### P0 — Les prix publiés ne correspondent pas à l'App Store français

La [fiche App Store consultée](https://apps.apple.com/fr/app/privacy-score-tracker-audit/id6762229573) affiche **59,99 €/an et 39,99 €/6 mois**. Les sources du site affichent **23,88 €/an et 20,94 €/6 mois** :

- `src/i18n/fr.json:286`, `src/i18n/en.json:286` ; ces réponses alimentent également le FAQ JSON-LD.
- `src/content/about/fr.md:34-35`, `src/content/about/en.md:31`.
- `src/content/blog/en/iphone-permissions-guide.md:181`, `src/content/blog/en/iphone-privacy-settings-2026.md:122`.
- `src/content/legal/fr/cgu.md:57-58`, `src/content/legal/fr/politique-de-confidentialite.md:97-98`, `src/content/legal/en/terms-of-use.md:57-58`, `src/content/legal/en/privacy-policy.md:97-98`.

La fiche décrit aussi les outils DNS/VPN et l'export parmi les fonctions de l'abonnement, alors que le site parle surtout des imports suivants. Réconcilier avec App Store Connect, la tarification par pays et le binaire distribué ; centraliser prix, périmètre gratuit et fonctions payantes. Pour l'anglais international, préciser qu'un prix en euros correspond à un marché et que le prix local apparaît dans l'App Store. Conserver l'offre gratuite dans le schéma est cohérent avec le téléchargement gratuit ; elle ne remplace pas l'explication des achats intégrés.

### P1 — Promesse de blocage et de protection trop forte

`src/i18n/{fr,en}.json:78,86-87` affiche « Appareil protégé / Device protected » et « Traceurs bloqués aujourd'hui / Trackers blocked today » avec 2 487 événements. Ces éléments sont effectivement affichés par `src/components/sections/HeroSection.astro:141` et la puce du hero. Le récapitulatif historique (`APP_RECAP.md:449`) décrit une analyse avec aide à la configuration ; la fiche App Store actuelle décrit aussi des profils DNS/VPN pour filtrer des domaines. Le récapitulatif ne permet donc pas de conclure que la version actuelle est incapable de blocage. Vérifier sur le binaire distribué si un compteur de blocages existe réellement, dans quelles conditions et avec quel fournisseur. À défaut de preuve, remplacer par « domaines identifiés » et qualifier ces nombres d'exemple de démonstration.

`src/i18n/{fr,en}.json:143` garantit que la prochaine fuite ne sera pas celle du lecteur ; `:151` promet de cesser de produire ces données. Ces résultats dépassent ce qu'un outil d'observation peut garantir. Remplacer par une description vérifiable : domaines identifiés, actions proposées, mesures appliquées par l'utilisateur. Présenter les nombres de démonstration comme un exemple, jamais une moyenne ni un compteur réel.

### P1 — L'histoire centrale confond très probablement plusieurs enquêtes

Les homepages (`src/i18n/{fr,en}.json:99-143`), les pages À propos (`src/content/about/fr.md:10`, `en.md:9`) et les introductions des articles attribuent l'identification de 26 agents à un achat de données publicitaires par Wired/404 Media. La source originale retrouvée est [l'enquête Le Monde du 28 octobre 2024](https://www.lemonde.fr/en/united-states/article/2024/10/28/biden-and-trump-put-in-danger-by-secret-service-agents-watch-the-second-episode-of-stravaleaks_6730825_133.html) : ses journalistes identifient 26 agents à partir de leurs activités **publiques sur Strava**. [404 Media documente par ailleurs l'utilisation de Locate X par le Secret Service](https://www.404media.co/fyi-a-warrant-isnt-needed-secret-service-says-you-agreed-to-be-tracked-with-location-data/).

Il faut dissocier ces mécanismes et retrouver une source qui étaye chaque chiffre avant de réutiliser le récit. Le détail « Jan 2024 », le prix d'un repas et les cent millions de positions ne sont pas établis par la source des 26 agents. Une seule histoire erronée est aujourd'hui répétée à travers presque tout le contenu.

### P1 — Statistiques et preuves non documentées

- Homepage FR `src/i18n/fr.json:133` : « 909 traceurs par semaine en moyenne », localisation dans 26 pays ; EN `:133` fait la même généralisation sans chiffre exact. Aucun protocole, échantillon ou source.
- Les gains « +5 à +45 points » (`src/i18n/{fr,en}.json:185,200-203`) ne sont pas une baisse de risque mesurée ; publier la formule et qualifier le score d'indicateur interne.
- « Aucune requête sortante » (`:231`) et « aucun domaine » (`:298`) sont des engagements à revalider contre le binaire actuel. Le fonctionnement hors ligne prouve que l'analyse peut fonctionner hors ligne, pas à lui seul l'absence de réseau en toute circonstance. `APP_RECAP.md:248` mentionne notamment les liens ouverts via Safari.
- `APP_RECAP.md:288-292,439` mentionne d'anciens liens d'affiliation, alors que `src/i18n/{fr,en}.json:286` affirme l'absence de commissions. La fiche App Store actuelle parle de recommandations non rémunérées. Traiter le récapitulatif de mai comme une archive à réconcilier, pas comme la preuve d'une affiliation actuelle.

### P2 — Métadonnées produit encore partiellement issues du lancement

La disponibilité App Store et les CTA sont **déjà actifs** dans le dépôt (`src/i18n/utils.ts:53-62`, `src/components/sections/HeroSection.astro:86-90`). Le « coming soon » de la session de juin dans `CLAUDE.md` n'est plus l'état du code.

La compatibilité reste « iOS 17+ » (`src/i18n/jsonld.ts:68`, dictionnaires `:306,365`), tandis que la fiche Apple exige iOS/iPadOS **17.6+**. Le schéma `MobileApplication` (`src/i18n/jsonld.ts:63-86`) n'inclut toujours pas `installUrl`/`downloadUrl` et fixe `softwareVersion` à `0.1.0` sans liaison à la version distribuée. Aligner ces informations sur une source produit unique ; ne pas inventer notes ou avis pour obtenir des résultats enrichis.

La marque « Privacy Guard » subsiste dans la citation de homepage (`src/i18n/{fr,en}.json:252`). Vérifier que la capture/citation appartient bien à la version actuelle et harmoniser le nom.

### P1 — Liens cassés et liens qui n'étayent pas leur ancre

Le contrôle GET de l'audit principal, consigné dans `links-to-fix.md` et `crawl.json`, confirme huit destinations externes en HTTP 404 : les deux URL 404 Media, trois CNIL, Wired, EFF et The Verge. Leurs emplacements éditoriaux sont :

- FR audit : `:14` (CNIL et 404 Media), `:58` (CNIL DNS).
- FR rapport : `:14` (Wired et 404 Media), `:115` (CNIL cookies).
- EN permissions : `:31` (404 Media), `:103` (The Verge), `:142` (EFF).
- EN réglages : `:14` (Wired), `:40` (EFF).
- À propos FR `:10` et EN `:9` : récit et sources associés.

Le lien Apple `https://support.apple.com/guide/iphone/iphd34a4cdf7/ios` finit sur le guide iPhone générique, pas sur la documentation promise. Remplacer par la [page Apple du rapport](https://support.apple.com/en-us/102188), et sa version FR selon la langue. Occurrences : les deux dictionnaires `:282`, À propos EN `:17`, permissions EN `:152`, réglages EN `:72`. Adjust répond 429 dans le contrôle : statut non concluant, pas une preuve de lien mort.

Le Header (`src/components/Header.astro:85-88`) génère quatre ancres vers la page courante, alors que ses sections n'existent que sur la homepage : 64 liens sans cible sur 16 sous-pages. Les préfixer par le chemin de la homepage de la langue, ou adapter la navigation aux sous-pages. Le CTA App Store indépendant (`:105`) fonctionne déjà ; ne pas confondre les deux liens « télécharger ».

## Articles, un par un

### 1. FR — Audit confidentialité iPhone

Fichier : `src/content/blog/fr/audit-confidentialite-iphone.md`. **P1 : révision factuelle avant amplification.** L'intention « réaliser un audit » est pertinente, et le lien vers le guide de lecture est utile.

- `:14,22` : supériorité générale d'un iPhone sur Android, quasi-totalité des apps, moyenne de 6 à 10 SDK, 30 à 50 domaines par ouverture : affirmations non étayées. Remplacer par un constat délimité et sourcé.
- `:34` : Mail iCloud ne devient pas chiffré de bout en bout grâce à la Protection avancée ; le Trousseau bénéficie déjà de ce chiffrement avec la protection standard. [Table officielle Apple](https://support.apple.com/en-us/102651).
- `:46,107` : le chemin français « Rapport sur l'App Privacy » diverge du libellé de la [documentation Apple actuelle](https://support.apple.com/fr-fr/102188). Vérifier sur appareil pour la version testée et illustrer.
- `:52-54` : confond personnalisation des annonces Apple, autorisation ATT et régénération de l'IDFA. Le geste désactiver/réactiver ne doit pas être présenté comme une remise à zéro garantie ; expliquer le retrait des autorisations existantes. [Apple, IDFA](https://developer.apple.com/documentation/adsupport/asidentifiermanager/advertisingidentifier), [annonces Apple](https://support.apple.com/en-us/105131).
- `:58` : « ajouter un profil DNS » n'est pas un tutoriel opérationnel : il manque l'obtention du profil, l'installation et la vérification. Le lien CNIL doit étayer la recommandation exacte.
- `:76,78,84,94` : « suffit dans 95 % des cas », VPN gratuits assimilés globalement à la revente, réglages réintroduits à chaque mise à jour, temps moyens de 45/15 minutes : retirer les chiffres et généralisations sans étude vérifiable.
- `:92-101` : « remplace l'audit manuel » surestime le produit : l'analyse ne réalise pas à la place de l'utilisateur toutes les modifications de réglages et le tri des applications. Préciser ce qui est automatisé et ce qui reste manuel.

Réécriture recommandée : checklist illustrée et testée, explicitation des limites, puis analyse du rapport par l'app. Garder cette URL et son rôle distinct du guide de lecture ; pas de fusion automatique ni changement de slug pour la seule année.

### 2. FR — Rapport de confidentialité iPhone

Fichier : `src/content/blog/fr/rapport-confidentialite-iphone-guide.md`. **P1 : contenu le plus proche du produit, à réparer en premier.** Les limites sur le contenu des requêtes et la distinction observation/filtrage (`:74,123`) constituent une bonne base.

- `:20` : la liste ajoute calendrier et presse-papiers sans preuve ; le modèle cité dans `APP_RECAP.md:189` ne les comprend pas. Refaire la liste à partir de la documentation Apple et du format réellement supporté.
- `:48-64` : décrit mal les quatre rubriques et invente une « timeline brute » à la place de l'activité réseau des sites web. Reprendre les intitulés Apple et distinguer l'écran natif du fichier exporté. [Source Apple](https://support.apple.com/fr-fr/102188).
- `:52,60,68` : déduire un pistage ou une fuite du seul nombre de contacts vers un domaine est excessif. Le « cas réel, anonymisé » avec 4 218 connexions et une banque à quatre domaines n'a ni rapport associé, ni capture, ni protocole. Apporter la preuve anonymisée ou l'étiqueter clairement « exemple fictif ».
- `:95` : « plus de 200 000 domaines », « référence la plus complète » et « licence permissive » ne sont pas démontrés. Le [README officiel Tracker Radar](https://github.com/duckduckgo/tracker-radar) précise que les données sont sous **CC BY-NC-SA 4.0**, avec licence commerciale sur demande. Corriger le texte et vérifier la licence effectivement obtenue ; le dépôt web ne permet pas de conclure sur la situation juridique du binaire distribué.
- `:103` : autonomie « inférieure à 1 % » sans mesure publiée : retirer cette précision ou fournir un test reproductible.
- `:123` : chiffrer DNS et filtrer des traceurs sont deux propriétés distinctes. Vérifier aussi l'offre réelle de chaque fournisseur cité avant de promettre des listes personnalisées.
- `:127` : l'absence de toute jurisprudence française est une affirmation juridique invérifiable dans cet audit ; conserver seulement une explication prudente de l'usage documentaire, ou faire valider une source juridique.
- `:131` : **l'ancre « App Tracking Transparency » pointe vers la propre politique de confidentialité du site**. Défaut certain de destination, même si l'URL répond 200 ; remplacer par la source Apple ATT.

Réécriture recommandée : réponse utile dès le début, quatre captures réelles, guide pour exporter, un domaine commenté avec limites, puis CTA vers l'analyse. La valeur différenciante doit venir d'une démonstration vérifiable, pas de l'introduction alarmante.

### 3. EN — iPhone permissions guide

Fichier : `src/content/blog/en/iphone-permissions-guide.md`. **P1 : plusieurs erreurs techniques nettes.** Le format par permission et le tableau sont utilisables après correction.

- `:14,57-65` : « Allow Photos » n'accorde pas nécessairement toute la photothèque ; distinguer le sélecteur système, accès limité et accès complet dès l'introduction.
- `:16,18,185` : prétend couvrir la liste exhaustive des douze permissions, alors que le périmètre est une sélection et que le texte regroupe plusieurs catégories. `:148` parle ensuite de « hidden ninth permission » : incohérence éditoriale manifeste.
- `:28` : « While Using » n'interdit pas absolument tous les cas d'usage de localisation en arrière-plan. Expliquer les conditions au lieu d'une garantie.
- `:47-49` : confond les niveaux d'accès Calendrier avec Rappels ; l'écriture seule documentée ici concerne les événements. [Apple EventKit](https://developer.apple.com/documentation/eventkit/accessing-the-event-store).
- `:69,77` : voyant caméra décrit orange, alors qu'il est **vert** ; le micro n'est pas limité au premier plan. [Apple sur les indicateurs](https://support.apple.com/en-ie/108331), [Apple sur l'enregistrement en arrière-plan](https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/record). Retirer aussi la garantie non démontrée « hardware level ».
- `:91` : voir l'adresse MAC de tous les appareils Bluetooth n'est pas une description correcte du périmètre général de Core Bluetooth sur iOS ; revoir cette partie contre les API autorisées et un test, sans extrapoler « tout appareil ».
- `:133` : le tri d'apps désinstallées dont toutes les autorisations seraient encore affichées n'est pas accompagné de reproduction. Remplacer par un parcours testé.
- `:164` : conseille « Always allowed » pour toute navigation/banque : autorisation excessive par défaut. Adapter à la fonction demandée.
- `:177` : décrit l'interface native comme un journal JSON sans taxonomie ; le rapport natif possède déjà plusieurs vues structurées. Expliquer précisément l'enrichissement apporté par Privacy Score.
- `:181` : prix à réconcilier (P0 transversal).

Réécriture recommandée : sélectionner explicitement les permissions sensibles, captures sur version iOS actuelle, recommandations de moindre privilège, et section qui distingue accès autorisé, usage observé et collecte par un serveur. Ajouter le cas « changer les permissions après coup » en tête pour répondre à une intention pratique.

### 4. EN — iPhone privacy settings 2026

Fichier : `src/content/blog/en/iphone-privacy-settings-2026.md`. **P1 : actualité et procédures à reprendre.**

- `:3,16` : annonce une référence à jour de 2026 tout en présentant iOS 17/18 comme la base de mi-2026. [iOS 26 est sorti le 15 septembre 2025](https://www.apple.com/newsroom/2025/09/new-versions-of-apples-software-platforms-are-available-today/). Retester la version actuelle, conserver les variantes utiles pour appareils plus anciens et dater le test réel.
- `:14` : reprend le récit contesté des 26 agents ; `:22` attribue un changement de ciblage du fil social à un taux ATT sans démontrer le lien de causalité.
- `:38` : l'interrupteur global ne doit pas être présenté comme annulant automatiquement toutes les autorisations déjà conservées ; Apple distingue le statut de chaque app. [Documentation IDFA](https://developer.apple.com/documentation/adsupport/asidentifiermanager/advertisingidentifier).
- `:54` : réinitialisation de l'identifiant interne Apple non étayée par le réglage de personnalisation. Limiter la promesse à la personnalisation des annonces.
- `:60` versus `:109` : la partie explique un profil/app DNS chiffré, puis la checklist conseille de saisir un DNS dans les réglages Wi-Fi, voire cellulaires. Changer simplement l'adresse d'un résolveur ne configure pas DoH/DoT. [Apple sur la configuration du DNS chiffré](https://developer.apple.com/videos/play/wwdc2020/10047/).
- `:72` : « most users discover at least three apps » sans enquête ; retirer.
- `:94-100` : la rubrique « settings that look private but aren't » mélange un partage volontaire oublié, le préchargement Safari et des allégations sur toutes les frappes Spotlight, sans preuve de fuite. Le réglage de clavier cité doit être retrouvé sur appareil ; sinon supprimer le parcours.
- `:118` : même caricature du rapport natif en JSON chronologique.
- `:122` : prix à réconcilier (P0 transversal).

Réécriture recommandée : un guide de réglages hiérarchisé par besoin et conséquence, sans la rubrique « théâtre » non démontrée. La page doit compléter le guide des permissions, pas répéter la même histoire et la même description produit.

## Présentation, maillage et conversion

- Les quatre articles renseignent `hero.alt` mais aucun `hero.src` (`:10-11` de chacun). Les templates `src/pages/fr/blog/[slug].astro:74-89` et `src/pages/en/blog/[slug].astro:71-86` n'affichent aucune image, aucune date de révision, aucune bio courte liée à l'auteur et aucune recommandation d'article connexe. Le JSON-LD contient pourtant `dateModified` (`src/i18n/jsonld.ts:242-247`). Afficher ces éléments utiles et ajouter les captures qui rendent le tutoriel reproductible.
- L'auteur est uniquement du texte dans les templates FR `:80` et EN `:77`. Lier la fiche auteur et décrire l'expérience vérifiable ; le `Person` JSON-LD seul ne remplace pas les preuves visibles.
- Les CTA de corps des quatre articles renvoient surtout à la homepage. Le téléchargement existe en navigation/pied de page, mais un encart contextuel après le résultat du tutoriel raccourcirait le parcours. Formulation : premier audit gratuit, rapport analysé localement, achats intégrés pour les fonctions payantes.
- Le guide FR rapport ne renvoie pas au guide audit ; ajouter un lien contextuel à l'étape d'action. Les deux guides EN ont déjà des liens réciproques utiles.
- `src/i18n/{fr,en}.json:174` suppose que le rapport existe déjà, alors que l'enregistrement doit être activé. Le parcours de conversion doit couvrir les deux états : « rapport prêt » et « activer puis revenir après usage ».
- La promesse « aucun historique Safari touché » (`src/i18n/{fr,en}.json:282`) doit préciser que le rapport peut inclure des domaines visités dans des apps : il ne lit pas la base d'historique Safari, mais les métadonnées réseau peuvent révéler une activité de navigation. [Description Apple du périmètre](https://support.apple.com/en-us/102188).

## Réviser le playbook SEO avant de l'utiliser pour produire davantage

Les consignes locales sont une provenance importante des défauts et ne doivent pas être traitées comme des règles de Google.

| Provenance exacte | Problème | Correction de méthode |
|---|---|---|
| `CLAUDE.md:138-147` | La traduction, même relue, est présentée comme intrinsèquement mauvaise pour le SEO. | Adapter les sujets au marché et faire une relecture idiomatique ; une traduction de qualité n'est pas interdite. Google documente expressément les [pages traduites](https://developers.google.com/search/docs/specialty/international/localized-versions). |
| `.claude/plugins/privacy-score-web/skills/seo-master/references/keyword-strategy.md:9-29` ; copywriter FR `SKILL.md:27-33` | Volumes estimés sans date ni source, répétés comme objectifs. Le rapport de mai avait déjà signalé l'absence de volumes FR réels. | Conserver pays, langue, moteur, date et sortie API. Une absence de données n'est pas un volume nul. |
| `docs/seo-audit-2026-05-31.md:559,564-567` | Difficulté fournisseur transformée en promesse « #1 rapidement » et nombre de mots imposé. | Prioriser la pertinence, les preuves et les conversions ; pas de rang garanti ni quota de mots. |
| Audit de mai `:726,737` ; `seo-master/SKILL.md:32-33` | Ponctuation en P0 et longueurs de titres/descriptions comme barrières SEO. | Ce sont des préférences éditoriales ; Google n'impose pas ces bornes strictes. [Titres](https://developers.google.com/search/docs/appearance/title-link), [descriptions](https://developers.google.com/search/docs/appearance/snippet). |
| `seo-master/SKILL.md:50,94,198` ; `src/i18n/jsonld.ts:214-220` | Schémas/règles robot présentés comme accès privilégié aux réponses IA ; `Google-Extended` confondu avec accès à AI Overviews. | Google précise [qu'il n'existe pas de schéma spécial ni d'exigence supplémentaire](https://developers.google.com/search/docs/appearance/ai-features). La gestion Search relève de Googlebot. Ni présence de FAQ ni citation Apple ne garantit une citation IA. |
| `seo-master/SKILL.md:102-104` | `x-default` toujours vers la home FR et sitemap considéré supérieur. | Les méthodes hreflang sont équivalentes pour Google ; seules de vraies versions équivalentes doivent être associées. Le choix des sous-répertoires n'est pas un handicap en soi. [Multilingue](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites), [hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions). |
| `SEO.md:6-7,29-31` et journal de juin `CLAUDE.md:670-688` | Mélange d'un état pré-lancement, d'anciennes versions et du produit distribué. | Marquer les audits comme historiques ; maintenir un état courant synthétique vérifié après livraison. |

Les règles positives à conserver : rendu HTML statique, titres distincts, liens canoniques cohérents, auteur identifiable, sources primaires, performance, absence de notes inventées. La rédaction automatisée n'est pas en soi la preuve d'une pénalité ; le risque observable ici est l'accumulation de faits et parcours non vérifiés.

## Calendrier éditorial réaliste sur 12 semaines

Capacité proposée : **un dossier bilingue toutes les deux semaines** après réparation, soit quatre nouvelles URL par mois au maximum ; prévoir environ une demi-journée à une journée par dossier avec test et captures. FR et EN peuvent utiliser les mêmes faits validés tout en adaptant questions et formulation. Réduire la cadence si la validation produit n'est pas disponible.

| Période à partir du 19/10/2026 | Travail FR/EN | Livrable et intention |
|---|---|---|
| Semaines 1–2 | Corriger offre et homepage ; réviser les quatre articles existants ; contrôler chaque lien et publier les vrais jours de révision. | Socle fiable ; aucune nouvelle publication de remplissage. |
| Semaines 3–4 | « Exporter son rapport iPhone vers Privacy Score » / « Export and import an iPhone App Privacy Report ». | Tutoriel complet avec captures, partage/import, limites ; intention directement liée à l'utilisation de l'app. |
| Semaines 5–6 | « Rapport vide ou données manquantes : que vérifier ? » / « App Privacy Report empty or missing data ». | Diagnostic des cas observés en support ; activation, attente, navigation privée, format. |
| Semaines 7–8 | « Lire un rapport : exemple commenté » / « A worked App Privacy Report example ». | Rapport synthétique explicitement étiqueté ou cas réel autorisé, captures et explication de domaines légitimes/tiers. |
| Semaines 9–10 | « Comment le score est calculé et ce qu'il ne mesure pas » / « How the privacy score is calculated ». | Méthodologie produit, version, critères et limites ; preuve différenciante et confiance. |
| Semaines 11–12 | Revoir les pages d'après Search Console et les clics App Store ; actualiser le contenu le plus utile. | Amélioration mesurée ; publier DNS chiffré versus filtrage seulement si la demande et la capacité de test le justifient. |

Routine : 20–30 minutes de revue hebdomadaire des pages d'entrée, requêtes, URL exclues et clics vers l'App Store ; contrôle mensuel des liens et de l'offre ; vérification des tutoriels lors des changements majeurs d'iOS. Pour chaque publication : source primaire accessible et pertinente, geste testé, capture datée, affirmation chiffrée justifiée ou retirée, liens internes contextuels, CTA adapté, relecture humaine. Réutiliser un dossier pour les canaux du développeur est possible, mais aucune prise de contact ni publication externe n'a été effectuée dans cet audit.

Mesure : suivre séparément visibilité (impressions/requêtes), acquisition (clics organiques), passage vers l'App Store et téléchargements attribuables à une campagne si disponible. Un clic sortant n'est pas une installation. Évaluer les premiers changements après 28 jours puis 8–12 semaines, sans promettre un délai d'indexation ou un classement.
