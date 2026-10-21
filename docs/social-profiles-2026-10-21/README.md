# Privacy Score — création des profils Instagram et TikTok

Préparé le **21 octobre 2026**. Priorité éditoriale : anglais américain, puis français. Ce dossier prépare les comptes ; il ne les crée pas et ne réserve pas leurs identifiants. Les informations et les menus proposés peuvent varier selon le pays, la version de l’application et les fonctionnalités activées.

## 0. Réserver les quatre identifiants maintenant

| Ordre | Réseau | Langue | Identifiant exact, sans @ dans le formulaire |
|---|---|---|---|
| 1 | Instagram | Anglais | `privacyscoreapp` |
| 2 | TikTok | Anglais | `privacyscoreapp` |
| 3 | Instagram | Français | `privacyscorefr` |
| 4 | TikTok | Français | `privacyscorefr` |

Créer et enregistrer les quatre comptes avant de peaufiner les premiers contenus. Confirmer l’adresse de connexion et enregistrer l’identifiant exact pour chacun. Un nom visible « Privacy Score » seul ne réserve pas `@privacyscoreapp`. Une URL publique absente ne prouve pas qu’un identifiant est disponible : seule sa validation par la plateforme le confirme. Si un identifiant est refusé, relever le message avant de choisir une variante. Ne pas créer d’abord un nom provisoire en supposant pouvoir le transférer facilement : TikTok limite les changements d’identifiant à un tous les 30 jours et peut retenir temporairement un nom abandonné.

Préparer des adresses de connexion professionnelles que vous contrôlez et pouvez relever. Une adresse distincte ou un alias par compte simplifie la récupération ; ces alias doivent être créés et testés avant utilisation. L’adresse publique existante `support@privacyscore.fr` sert au contact, pas à la publication de vos identifiants de connexion.

Pour les informations privées d’inscription, saisir les informations réelles du titulaire et sa date de naissance si demandée. Pour une vérification d’entreprise, utiliser les informations légales réelles de l’activité et le pays réel d’établissement. La priorité commerciale américaine se traduit par la langue et les contenus, pas par une fausse adresse ou une fausse implantation américaine.

Après chaque création : mot de passe unique dans votre gestionnaire, double authentification, coordonnées de récupération confirmées et codes de secours conservés hors ligne. Garder les preuves de création et les URLs dans votre gestionnaire privé ; ne pas mettre mots de passe, codes ou justificatifs dans ce dossier. Refuser la synchronisation des contacts personnels si elle n’est pas utile au projet.

## Les fichiers à utiliser

Le pack généré dans `artifacts/social-profiles-2026-10-21/` contient :

- `01-instagram-en.txt`, `02-tiktok-en.txt`, `03-instagram-fr.txt`, `04-tiktok-fr.txt` : tous les champs et textes à copier, dans l’ordre.
- `avatar-privacy-score.png` : **icône officielle existante, 512 × 512 px**, inchangée, identique pour les quatre profils. Le « 75% » fait partie du logo existant ; ce n’est pas un score mesuré pour le visiteur.
- `covers/*.png` : six couvertures verticales **1080 × 1920 px**, trois par langue, avec PNG prêts à utiliser et sources SVG modifiables.
- `posts/01-welcome-en.png` et `posts/01-welcome-fr.png` : deux images d’accueil **1080 × 1350 px** pour une publication Instagram ou photo TikTok.
- `highlights/*.png` : cinq couvertures de stories à la une **1080 × 1080 px**, avec pictogrammes centraux ; mêmes fichiers EN/FR, libellés différents.
- `preview.png` : planche de contrôle des six couvertures ; ce fichier n’est pas à publier tel quel.
- `index.html` : fiche locale de préparation présentant les quatre profils et les visuels. Son affichage n’est pas une reproduction garantie des interfaces Instagram/TikTok.
- `privacy-score-social-kit.zip` : archive de livraison avec les textes et les visuels. Aucune donnée de connexion.

L’avatar reste le même en anglais et en français : les identifiants et les textes distinguent les langues. Aucun nouveau logo ni drapeau n’est nécessaire. Importer le carré fourni et vérifier le cadrage rond dans chaque application. Ne pas chercher à lire les petites lettres de l’icône comme une accroche de profil.

## 1. Instagram anglais — priorité États-Unis

1. Créer le compte et enregistrer `privacyscoreapp`.
2. Passer en **compte professionnel → Entreprise / Business**. Choisir une catégorie telle que **Software**, **Software company** ou, à défaut, **Product/service**, selon ce qui est proposé. Il s’agit de suggestions de catégorie, pas d’intitulés garantis dans le menu.
3. Importer `avatar-privacy-score.png`.
4. Dans **Modifier le profil**, saisir le nom et la bio ci-dessous, sans les guillemets ni le formatage Markdown.

**Nom affiché :** `Privacy Score | iPhone Privacy`

**Bio :**

```text
Understand your iPhone’s App Privacy Report.
On-device analysis. No account needed.
Explore the app and practical privacy guides.
```

5. Ajouter un **lien externe** dans le champ Liens, et non une longue URL dans la bio.

**Titre :** `Explore Privacy Score`

```text
https://www.privacyscore.fr/?utm_source=instagram&utm_medium=organic_social&utm_campaign=profile_en&utm_content=bio
```

6. Ajouter comme contact professionnel public `support@privacyscore.fr`, si la boîte reçoit bien les messages. Ne pas publier de numéro personnel ou d’adresse physique sans nécessité. Les pronoms sont facultatifs et ne sont pas nécessaires à une marque produit.
7. Un second lien direct App Store est facultatif : titre `Download on the App Store`, URL `https://apps.apple.com/us/app/privacy-score-tracker-audit/id6762229573`. Le lien principal vers le site permet de découvrir l’app et les guides et de mesurer les visites consenties ; un lien direct Apple contourne GA4.
8. Garder le profil public. Afficher ou masquer la catégorie selon le rendu ; ne pas choisir une catégorie « expert sécurité » pour suggérer une certification inexistante. Vérifier que le nom, la photo et la bio d’un compte personnel ne sont pas synchronisés automatiquement sur ce profil de marque.
9. Une Page Facebook liée peut être ajoutée ensuite pour les outils Meta qui la demandent ; ne pas retarder la réservation de l’identifiant pour cette étape. La création d’une Page Facebook n’est pas une étape de création du profil TikTok.

**URL attendue après création :** `https://www.instagram.com/privacyscoreapp/`.

## 2. TikTok anglais

1. Créer le compte et enregistrer `privacyscoreapp` dans **Profil → Modifier le profil → Nom d’utilisateur**. Garder ce même identifiant ; le nom visible est un champ différent.
2. Dans **Paramètres et confidentialité → Compte**, passer en **Business Account / Compte Entreprise**. Choisir une catégorie logicielle, applications ou technologie si proposée. Le changement de type de compte n’est pas équivalent à une validation administrative d’entreprise ni à un badge bleu.
3. Importer le même avatar. Remplir le nom visible et la bio :

**Nom :** `Privacy Score | iPhone Privacy`

**Bio :**

```text
Your iPhone privacy, explained.
On-device report analysis. No account needed.
```

4. Si un champ **Site Web / Liens** est disponible, y saisir :

```text
https://www.privacyscore.fr/?utm_source=tiktok&utm_medium=organic_social&utm_campaign=profile_en&utm_content=bio
```

5. **Si ce champ n’est pas disponible**, ne pas supposer qu’un simple passage en Business le débloque. L’aide TikTok sur les liens indique un seuil de 1 000 abonnés ou un compte d’entreprise enregistré, avec disponibilité des fonctions variable. Consulter le parcours d’enregistrement proposé sur ce compte. En attendant, utiliser cette bio de secours, qui affiche seulement une adresse à saisir :

```text
iPhone privacy, explained.
On-device report analysis.
privacyscore.fr
```

Le texte dans la bio n’est pas un lien cliquable garanti. Utiliser alors la légende d’accueil **sans lien de profil** fournie dans le fichier texte. Ajouter le lien vers l’Instagram anglais si TikTok propose cette liaison.

6. Ajouter l’adresse de contact professionnelle si un champ public existe, sans remplacer le lien du site. Pour les sons des contenus promotionnels, privilégier la bibliothèque commerciale TikTok ou une musique dont vous détenez les droits : les comptes Business n’ont pas les mêmes accès musicaux que les comptes personnels.

**URL attendue après création :** `https://www.tiktok.com/@privacyscoreapp`.

## 3. Instagram français

Reprendre les réglages Entreprise et de sécurité du compte anglais, puis remplir :

- **Identifiant :** `privacyscorefr`
- **Nom affiché :** `Privacy Score | Vie privée`
- **Photo :** le même `avatar-privacy-score.png`
- **Contact public :** `support@privacyscore.fr`
- **Catégorie suggérée :** Logiciel / Entreprise de logiciels ; sinon Produit/service, si proposé.

**Bio :**

```text
Comprenez le rapport de confidentialité de votre iPhone.
Analyse locale, sans compte.
Découvrez l’app et nos conseils pratiques.
```

**Lien principal — titre :** `Découvrir Privacy Score`

```text
https://www.privacyscore.fr/fr/?utm_source=instagram&utm_medium=organic_social&utm_campaign=profile_fr&utm_content=bio
```

**Lien App Store facultatif — titre :** `Télécharger sur l’App Store`

```text
https://apps.apple.com/fr/app/privacy-score-tracker-audit/id6762229573
```

**URL attendue après création :** `https://www.instagram.com/privacyscorefr/`.

## 4. TikTok français

Reprendre les réglages Business du compte anglais, avec la même réserve sur le lien cliquable.

- **Identifiant :** `privacyscorefr`
- **Nom :** `Privacy Score | Vie privée`
- **Photo :** le même avatar
- **Catégorie :** Logiciel / Applications / Technologie, selon les choix proposés.

**Bio :**

```text
La vie privée sur iPhone, en clair.
Analyse locale du rapport, sans compte.
```

**Lien dans le champ Site Web, s’il est disponible :**

```text
https://www.privacyscore.fr/fr/?utm_source=tiktok&utm_medium=organic_social&utm_campaign=profile_fr&utm_content=bio
```

**Bio de secours si le champ Site Web manque :**

```text
Vie privée sur iPhone.
Analyse locale, sans compte.
privacyscore.fr/fr/
```

**URL attendue après création :** `https://www.tiktok.com/@privacyscorefr`.

## 5. Couvertures et premières publications

Pour les profils standards, Instagram et TikTok ne demandent pas de grande bannière de profil de type Facebook ou YouTube. Préparer l’avatar d’abord. Les « couvertures » utiles ici sont celles des publications/Reels/vidéos et des stories à la une Instagram. Ne pas créer une mosaïque découpée entre plusieurs publications : chaque image fournie se comprend seule.

| Ordre éditorial | EN | FR | Fichier |
|---|---|---|---|
| Présentation | Meet Privacy Score | Découvrez Privacy Score | `01-welcome-en/fr` |
| Prise en main | Your first privacy audit | Votre premier audit | `02-start-en/fr` |
| Traitement local | Your report. On your device. | Votre rapport. Sur l’appareil. | `03-local-en/fr` |

L’image d’accueil 1080 × 1350 peut servir de première publication Instagram avec la légende du fichier `01-instagram-en.txt` ou `03-instagram-fr.txt`. Les titres sont du texte sur l’image ; Instagram ne propose pas un champ « titre de Page » distinct du nom du profil. Ajouter le texte alternatif fourni lorsque le format et l’interface le permettent.

Les images 1080 × 1920 sont des **couvertures**, pas des vidéos déjà montées. Sur Instagram, sélectionner la couverture lors de la préparation du Reel lorsque cette option est proposée. Sur TikTok, choisir **Sélectionner une couverture** avant publication : le parcours standard sélectionne une image de la vidéo. Si l’import d’une couverture n’est pas proposé, incorporer le visuel au montage puis sélectionner l’image correspondante. Vérifier l’aperçu dans la grille, car le recadrage varie selon le réseau et la surface. Les textes essentiels ont volontairement été placés au centre ; cela ne garantit pas tous les recadrages futurs.

Épingler les trois contenus seulement une fois produits et publiés, si la fonction est disponible. Il n’y a pas besoin de publier des tutoriels incomplets pour réserver les identifiants. Les deux couvertures suivantes servent aux futurs contenus de prise en main et de confidentialité.

### Stories à la une Instagram — à créer après avoir publié les stories

| Icône | Fichier | Nom EN | Nom FR | Contenu à prévoir |
|---|---|---|---|---|
| Téléphone | `01-app.png` | The app | L’app | Présentation de l’application et lien vers le site |
| Partage | `02-start.png` | Start here | Débuter | Activer, laisser collecter, exporter et partager le rapport Apple |
| Progression | `03-tips.png` | Tips | Conseils | Conseils pratiques, contextualisés |
| Nuage barré | `04-privacy.png` | Privacy | Vie privée | Analyse locale du rapport, aucun compte requis |
| Tableau de bord | `05-help.png` | Help | Aide | Questions fréquentes et contact de support |

Ces cinq couvertures n’ont pas de texte incrusté : le nom de la story à la une porte la langue. Les pictogrammes viennent de la même famille Material Icons Round que le site. Il n’existe pas de dossier de stories à la une à créer à l’identique sur TikTok ; utiliser les vidéos et, si le compte y a accès, les playlists disponibles.

### Accueil, assistance et tarifs

Les quatre fichiers texte incluent une légende d’accueil, une réponse de support et une réponse sur les tarifs. Ce sont des textes à utiliser manuellement ; aucune réponse automatique ni publication n’a été activée. Les légendes TikTok ont une variante si le lien cliquable manque.

Le premier audit est gratuit ; les audits supplémentaires et les outils Premium nécessitent un abonnement. Ne pas annoncer « tout gratuit », « bloque tous les traceurs », « analyse toutes vos apps en direct » ou « garantit votre anonymat ». Ne pas transformer chaque domaine contacté en preuve de pistage. Les prix français ne doivent pas être présentés comme des prix américains ; les bios restent sans prix et renvoient aux conditions locales de l’App Store. Le traitement local annoncé concerne le rapport analysé par l’app, pas les données traitées par Instagram/TikTok ou les statistiques consenties du site.

## 6. Vérification finale — un compte après l’autre

- [ ] Identifiant exact enregistré, e-mail de connexion confirmé et double authentification activée.
- [ ] Mot de passe et codes de récupération enregistrés en privé.
- [ ] Nom affiché, bio et catégorie correspondant à la langue ; relire les sauts de ligne dans l’app.
- [ ] Avatar net et entier dans le cadrage circulaire ; aucune fausse coche de vérification ajoutée.
- [ ] Lien ouvert depuis un autre appareil : page anglaise pour EN, `/fr/` pour FR.
- [ ] Sur TikTok, confirmer visuellement si le lien est cliquable ; sinon utiliser la variante de bio et de légende adaptée.
- [ ] Contact public correct, aucune coordonnée personnelle publiée involontairement.
- [ ] Profil public ouvert hors connexion ; noter son URL exacte après création.
- [ ] Premier contenu relu, recadrage contrôlé et légende de la bonne langue avant publication.
- [ ] Ajouter les réseaux au site et les relier entre eux seulement après confirmation de leur création. Ce kit ne modifie pas le site ni ses données structurées.

Les liens UTM distinguent Instagram/TikTok et EN/FR sans ajouter de nouvelle configuration Analytics. Ils décrivent l’origine du clic sur le lien de profil, pas chaque publication individuellement. GA4 mesure seulement les visites/événements autorisés par le consentement ; un clic App Store ne prouve ni un téléchargement ni un abonnement. Les liens Apple directs fournis sont sans identifiant de campagne sociale inventé. Une attribution Apple par réseau sera une étape séparée.

## Sources et portée de la vérification

- [TikTok : noms d’utilisateur et délai de changement](https://support.tiktok.com/en/getting-started/setting-up-your-profile/changing-your-username) — aide officielle retrouvée ; ne pas transférer un nom sans précaution.
- [TikTok : liens de site et de réseaux sociaux](https://support.tiktok.com/en/getting-started/setting-up-your-profile/linking-another-social-media-account) — l’extrait officiel retrouvé indique 1 000 abonnés ou un compte d’entreprise enregistré ; le champ réel fait foi pour les fonctionnalités accessibles.
- [TikTok : comptes personnels et professionnels](https://support.tiktok.com/en/using-tiktok/growing-your-audience/switching-to-a-creator-or-business-account) — distinction Business, fonctionnalités et bibliothèque musicale commerciale.
- [TikTok : sélectionner une couverture vidéo](https://support.tiktok.com/en/using-tiktok/creating-videos/editing-posting-and-deleting) — sélection d’une image de la vidéo dans le parcours standard.
- [Meta Blueprint : personnaliser le profil Instagram professionnel](https://www.facebookblueprint.com/student/activity/260492-bring-your-business-online-with-instagram-overview) — catégorie, coordonnées et tableau de bord professionnel ; certains écrans d’aide Meta nécessitent une connexion.
- [Formats d’images et absence de couverture de profil Instagram](https://www.shopify.com/blog/cover-photo) — source secondaire utilisée uniquement pour cette distinction visuelle ; les 1080 × 1920, 1080 × 1350 et 512 × 512 du kit sont des formats de travail choisis, pas des minima imposés par les réseaux.
- [Fiche App Store américaine consultée](https://apps.apple.com/us/app/privacy-score-tracker-audit/id6762229573) — analyse locale, premier audit gratuit, abonnements, EN/FR et iOS 17.6+. Le lien français existant est repris du site ; sa consultation Apple a renvoyé 429 au contrôle du jour, sans conclure à une indisponibilité.

Les bios sont volontairement limitées à **150 caractères au maximum pour Instagram et 80 pour TikTok**, noms TikTok à 30, y compris les sauts de ligne. Ce sont des budgets conservateurs validés par le générateur ; ils ne prétendent pas décrire toutes les limites ou expérimentations de toutes les versions des plateformes. Aucune disponibilité des identifiants ni vérification d’entreprise n’a été confirmée ici.

## Reproduire le pack

Depuis la racine du projet :

```sh
node docs/social-profiles-2026-10-21/build-kit.mjs
```

Utilise les dépendances et polices déjà présentes, l’icône officielle existante et les pictogrammes sous licence Apache 2.0. Ne contacte pas Instagram/TikTok et ne publie rien. Les fichiers de livraison restent sous `artifacts/`, ignoré par Git ; les sources éditoriales et le générateur sont versionnés dans ce dossier.
