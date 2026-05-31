---
title: Politique de confidentialité
language: fr
version: 1.0
last_updated: 2026-05-27
publisher: Skander BAHRI (entrepreneur individuel), CoDevelop
url_canonique: https://www.privacyscore.fr/fr/privacy-policy
liens_croises:
  - legal-notice: https://www.privacyscore.fr/fr/legal-notice
  - terms-of-use: https://www.privacyscore.fr/fr/terms-of-use
---

# Politique de confidentialité

Dernière mise à jour : 27 mai 2026, version 1.0

Cette politique explique comment **Privacy Score** (l'application iOS) et le site `privacyscore.fr` traitent vos données. Nous avons choisi de la rédiger en français clair, parce qu'une application qui analyse votre vie privée doit elle-même mériter votre confiance. Si une phrase manque de clarté, écrivez-nous à `support@privacyscore.fr` et nous la corrigerons.

## Ce qui n'est pas collecté

Avant de détailler ce qui l'est, voici ce que Privacy Score **ne collecte pas** :

- Aucun compte, aucune adresse email, aucun mot de passe, aucun identifiant utilisateur que vous nous auriez fourni.
- Aucun outil d'analyse intégré : pas de Firebase, pas de Sentry, pas d'Amplitude, pas de Mixpanel, pas de Segment, pas de PostHog, pas de Crashlytics, ni aucun autre SDK comparable.
- Aucun cookie de mesure d'audience ou de publicité sur le site `privacyscore.fr`.
- Aucune connexion sortante depuis l'application iOS pour vous suivre ou pour transmettre votre rapport.
- Aucun profilage, aucune prise de décision automatisée à votre égard.

Cette absence est vérifiable : l'application ne crée aucune requête réseau dirigée vers nos serveurs, parce que nous n'en avons pas pour cette fin.

Cette liste reflète la version 1.0 de l'application. Toute évolution future qui modifierait le périmètre des traitements sera signalée dans l'application avant son entrée en vigueur, et la présente politique sera mise à jour avec une nouvelle version.

## Responsable du traitement

Le responsable du traitement au sens de l'article 4.7 du Règlement (UE) 2016/679 (RGPD) est :

**Skander BAHRI**, entrepreneur individuel exerçant sous le nom commercial **CoDevelop**, dont les coordonnées figurent dans les [mentions légales](https://www.privacyscore.fr/fr/legal-notice).

Contact pour toute question relative à vos données : `support@privacyscore.fr`.

## Délégué à la protection des données

Compte tenu de l'activité (édition d'une application qui traite des données uniquement sur l'appareil de l'utilisateur, sans suivi à grande échelle ni catégories particulières au sens de l'article 9 du RGPD), CoDevelop n'est **pas tenu** de désigner un délégué à la protection des données en application de l'article 37 du RGPD. Aucun DPO n'est désigné. Les demandes liées à vos droits doivent être adressées à `support@privacyscore.fr`.

## Données traitées et finalités

### 1. Rapport de confidentialité Apple importé dans l'application

- **Ce que c'est** : un fichier au format NDJSON que vous exportez depuis Réglages iOS &gt; Confidentialité et sécurité &gt; Rapport sur l'App Privacy, puis que vous transmettez à Privacy Score via le partage iOS.
- **Finalité** : analyser ce rapport pour calculer un score de confidentialité sur 100, dresser la liste des traceurs détectés, des applications utilisant la localisation, et formuler des recommandations.
- **Base légale (art. 6 RGPD)** : exécution du service que vous avez demandé (art. 6.1.b).
- **Où le traitement a lieu** : intégralement sur votre iPhone. Le fichier est analysé localement par l'application.
- **Stockage** : dans la sandbox de l'application (base SwiftData et copie du fichier NDJSON sous `Documents/PrivacyReports/`). Aucun envoi sur un serveur, qu'il s'agisse de CoDevelop ou d'un tiers.
- **Durée de conservation** : jusqu'à ce que vous importiez un nouveau rapport (qui remplace le précédent) ou que vous supprimiez l'application.
- **Destinataires** : aucun.

### 2. Analyses dérivées du rapport

- **Ce que c'est** : score, comptage de traceurs, historique des scores au fil des imports, échantillons d'atténuation (statut DNS chiffré et VPN au moment du scan).
- **Finalité** : affichage du tableau de bord, de l'évolution dans le temps, des recommandations.
- **Base légale** : exécution du service (art. 6.1.b).
- **Stockage** : sandbox de l'application (bases SwiftData séparées par catégorie).
- **Durée de conservation** : indéfinie tant que l'application est installée. L'historique des échantillons d'atténuation est purgé automatiquement par ancienneté et plafond de quantité.
- **Destinataires** : aucun.

### 3. Identifiant publicitaire (IDFA)

- **Ce que c'est** : un identifiant unique attribué par iOS à votre appareil pour la publicité. Si vous avez refusé le suivi via App Tracking Transparency, cet identifiant est composé uniquement de zéros et n'a aucune valeur identifiante.
- **Finalité** : calculer la durée d'exposition (« vous portez cet identifiant publicitaire depuis X jours ») afin de vous expliquer ce que cela représente.
- **Base légale** : intérêt légitime à fournir une analyse pédagogique de votre exposition publicitaire (art. 6.1.f RGPD). Cet intérêt est mis en balance avec votre droit fondamental à la protection des données : aucune transmission à un tiers n'est faite, et vous gardez le contrôle complet via les réglages iOS (App Tracking Transparency, réinitialisation de l'identifiant publicitaire).
- **Stockage** : `UserDefaults` de l'application, sur votre appareil. L'identifiant est conservé localement uniquement pour calculer la date de première observation. Si l'identifiant est nul (refus ATT), aucune date n'est enregistrée.
- **Durée de conservation** : jusqu'à ce que vous réinitialisiez votre IDFA depuis iOS, ou supprimiez l'application.
- **Destinataires** : aucun.

> Selon la CNIL, l'identifiant publicitaire constitue une donnée à caractère personnel. C'est pourquoi nous le déclarons ici en toute transparence, même si nous ne le transmettons à personne.

### 4. Statuts iOS lus à la volée

Lors de l'ouverture du tableau de bord, l'application lit certains statuts du système (statut du DNS chiffré, état du VPN, version d'iOS, statut de l'autorisation de localisation, statut App Tracking Transparency). Ces valeurs sont lues à chaque rendu et **ne sont pas stockées**, à deux exceptions près :

- La **version d'iOS** est conservée dans `UserDefaults` afin de détecter une mise à jour du système et déclencher, si vous l'avez activée, une notification correspondante.
- L'**historique des notifications** (compteurs de rejets, pauses automatiques) est conservé localement pour respecter votre paramétrage.

### 5. Profils DNS et VPN personnalisés

Si vous saisissez un profil DNS chiffré (DoH/DoT) ou un profil VPN (IKEv2) dans l'application :

- Les paramètres saisis sont stockés dans la base SwiftData locale.
- **Le mot de passe VPN éventuellement saisi pour générer un fichier `.mobileconfig` n'est jamais conservé** au-delà de la session de génération. Le fichier `.mobileconfig` lui-même est temporaire et protégé par chiffrement (`completeFileProtection`), puis automatiquement effacé après partage.
- **Base légale** : exécution du service que vous avez demandé (art. 6.1.b).
- **Destinataires** : aucun (les profils restent sur votre appareil ; vous choisissez ensuite si vous installez le profil dans iOS).

### 6. Abonnement payant et facturation

L'application propose un abonnement à renouvellement automatique :

- Formule annuelle : 23,88 € par an (soit 1,99 €/mois).
- Formule semestrielle : 20,94 € par six mois (soit 3,49 €/mois).
- Le premier scan reste gratuit à vie et son audit complet est conservé sur votre appareil sans abonnement.

L'abonnement est intégralement géré par **Apple In-App Purchase** :

- **Apple** (Apple Distribution International Limited, Cork, Irlande) est le processeur de paiement. CoDevelop ne reçoit ni votre numéro de carte, ni votre adresse de facturation, ni votre identifiant Apple. CoDevelop reçoit uniquement, périodiquement et de manière agrégée, les données comptables qu'Apple consolide pour reverser le revenu.
- La **politique de confidentialité d'Apple** (`https://www.apple.com/legal/privacy/`) s'applique au traitement des données de paiement.
- Pour gérer ou résilier votre abonnement, vous passez par iOS &gt; Réglages &gt; votre identifiant Apple &gt; Abonnements. Tout remboursement éventuel est traité par Apple selon sa propre politique.

### 7. Notifications locales

L'application peut programmer des notifications locales (rappel d'import, nouvelle astuce, changement de version iOS, baisse du score) avec votre autorisation. Toutes les notifications sont **locales** : aucune notification push distante n'est utilisée, aucun serveur n'est sollicité. Vos préférences de notifications (catégories actives, plages calmes, historique de rejets) sont stockées dans `UserDefaults`.

### 8. Site `privacyscore.fr`

- **Cookies** : seuls les cookies strictement nécessaires au bon fonctionnement du site sont utilisés (par exemple, un cookie de session si un formulaire le requiert). Ces cookies sont exemptés du consentement préalable au titre de l'article 82, II de la loi n° 78-17 du 6 janvier 1978 modifiée. Aucun cookie de mesure d'audience tiers, ni cookie publicitaire, n'est déposé.
- **Journaux serveur** : notre hébergeur **HOSTINGER operations, UAB** conserve, comme tout hébergeur, des journaux techniques contenant notamment les adresses IP de connexion. Cette conservation est imposée par l'article 6 II de la loi n° 2004-575 du 21 juin 2004 (LCEN) à des fins de constatation, de recherche et de poursuite des infractions pénales. La durée légale est d'**un an**. Ces journaux sont gérés exclusivement par Hostinger et ne sont consultés que dans le cadre prévu par la loi.

## Destinataires et transferts hors UE

CoDevelop ne transmet aucune donnée à un tiers situé hors de l'Union européenne pour son propre compte.

Apple Distribution International Limited, qui traite les données de paiement pour le compte de CoDevelop, est établie en Irlande (Union européenne). Les éventuels transferts ultérieurs vers les États-Unis (notamment vers Apple Inc. à Cupertino) relèvent de la seule responsabilité d'Apple et sont encadrés par le cadre EU-US Data Privacy Framework validé par la Commission européenne le 10 juillet 2023 (décision d'adéquation 2023/1795). La politique de confidentialité d'Apple, accessible à `https://www.apple.com/legal/privacy/`, régit ces traitements.

## Vos droits

Conformément aux articles 15 à 22 du RGPD et aux articles 48 à 56 de la loi Informatique et Libertés (loi n° 78-17 du 6 janvier 1978 modifiée), vous disposez des droits suivants :

- Droit d'accès à vos données (art. 15 RGPD)
- Droit de rectification (art. 16)
- Droit à l'effacement (art. 17)
- Droit à la limitation du traitement (art. 18)
- Droit à la portabilité (art. 20)
- Droit d'opposition (art. 21)

### Comment exercer ces droits en pratique

La quasi-totalité des données restant sur votre appareil, l'exercice de ces droits passe d'abord par l'application elle-même :

- **Accès** : ouvrez l'application. Le contenu de votre rapport et toutes les analyses sont à votre disposition.
- **Rectification** : un rapport Apple n'est pas modifiable a posteriori. Pour obtenir des données plus à jour, importez un nouveau rapport.
- **Effacement** : supprimez l'application depuis iOS, ou utilisez la fonction « Réinitialiser tous les réglages » disponible en version de développement. La désinstallation supprime intégralement la base locale, les profils saisis et l'IDFA capturé.
- **Portabilité** : le rapport Apple importé reste un fichier NDJSON consultable et exportable via l'application Fichiers d'iOS, dans le dossier `Documents/PrivacyReports/` du sandbox de l'application.

Pour toute demande qui ne pourrait être satisfaite directement depuis l'application, écrivez à `support@privacyscore.fr`. CoDevelop répondra dans un délai d'un mois à compter de la réception, conformément à l'article 12.3 du RGPD.

## Droit d'introduire une réclamation auprès de la CNIL

Conformément à l'article 77 du RGPD, vous avez le droit d'introduire une réclamation auprès d'une autorité de contrôle. En France, il s'agit de la **Commission nationale de l'informatique et des libertés (CNIL)** :

3 place de Fontenoy
TSA 80715
75334 PARIS CEDEX 07
Téléphone : 01 53 73 22 22
Site internet : `https://www.cnil.fr`

## Décisions automatisées et profilage

Aucune décision produisant des effets juridiques ou vous affectant de manière significative n'est prise de manière automatisée vous concernant. Aucun profilage au sens de l'article 22 du RGPD n'est mis en œuvre.

## Sécurité

Les données stockées sur votre appareil bénéficient de la protection standard d'iOS (sandbox, chiffrement du système de fichiers lorsque vous avez défini un code de déverrouillage). Les fichiers `.mobileconfig` générés temporairement (profils DNS / VPN) sont marqués `completeFileProtection` et supprimés après partage.

CoDevelop ne disposant d'aucun serveur recevant vos données, le risque d'une fuite côté serveur est inexistant par construction.

## Modifications de la présente politique

CoDevelop peut modifier cette politique pour refléter une évolution de l'application, du cadre légal, ou des recommandations de la CNIL. La version en vigueur est toujours datée et numérotée en haut de cette page. Toute modification substantielle sera signalée dans l'application avant son entrée en vigueur.

## Historique des versions

| Version | Date | Modifications |
|---|---|---|
| 1.0 | 27 mai 2026 | Publication initiale. Conformité RGPD art. 13, LIL art. 48-56, DPF (décision 2023/1795), CNIL. ROPA interne tenu séparément (cf. `compliance/ROPA-codevelop.md`). |
