---
title: "Audit confidentialité iPhone : les vérifications utiles"
description: "Un audit de confidentialité iPhone pour vérifier les autorisations, le suivi et les domaines contactés. Suivez une méthode concrète, sans conclusions hâtives."
publishedAt: "2026-06-01"
updatedAt: "2026-10-19"
author: "Skander Bahri"
language: "fr"
slug: "audit-confidentialite-iphone"
tags: ["audit confidentialité", "iphone", "autorisations", "suivi publicitaire"]
hero:
  src: "/assets/screen-network.webp"
  alt: "Écran en anglais du trafic réseau de Privacy Score, avec les onglets destinations, traceurs et entreprises."
---

Un **audit de confidentialité iPhone** consiste à rapprocher trois choses : les autorisations accordées aux applications, les usages enregistrés par iOS et les services contactés sur le réseau. Commencez par vérifier les accès sensibles dans Réglages, puis utilisez le rapport de confidentialité pour décider quoi modifier. Le nombre de connexions, à lui seul, ne permet pas de conclure qu'une application vous piste.

Cette méthode sert à prendre des décisions précises : limiter l'accès aux photos, retirer une autorisation devenue inutile ou demander à un éditeur pourquoi son application contacte un domaine. Elle ne constitue ni une certification de sécurité ni une recherche exhaustive de logiciels malveillants.

## 1. Préparer une observation utile

Dans **Réglages → Confidentialité et sécurité**, ouvrez **Rapport de confidentialité des apps** et activez-le si nécessaire. Le rapport se remplit après l'activation ; il ne reconstitue pas votre activité antérieure. Consultez le [guide de lecture du rapport](/fr/blog/rapport-confidentialite-iphone-guide/) pour comprendre ses rubriques et ses limites.

Utilisez ensuite votre iPhone normalement : messagerie, navigation, cartes, applications que vous souhaitez examiner. Une période contenant vos usages habituels sera plus informative qu'un rapport exporté immédiatement après l'activation. Il n'existe pas de délai unique qui rende tous les rapports représentatifs.

Notez ce que vous cherchez à vérifier. Par exemple : « Cette application a-t-elle besoin de ma position précise ? » ou « Quels domaines ce jeu contacte-t-il ? ». Si aucune donnée n'apparaît, suivez d'abord le [diagnostic d'un rapport vide](/fr/blog/rapport-confidentialite-iphone-vide/).

## 2. Réduire les autorisations au besoin réel

Ouvrez chaque catégorie dans **Réglages → Confidentialité et sécurité**, puis examinez les applications qui ont demandé un accès. [Apple explique comment modifier ces autorisations](https://support.apple.com/fr-fr/guide/iphone/iph251e92810/ios). Commencez par les données qui comptent le plus pour vous.

| Accès à examiner | Question à poser | Action possible |
|---|---|---|
| Localisation | La fonction utilisée a-t-elle besoin de ma position en continu ou avec précision ? | Réduire l'accès et la précision lorsque la fonction le permet. |
| Photos | L'application doit-elle parcourir toute ma photothèque ? | Limiter la sélection lorsque cette option est proposée. |
| Contacts | Le carnet d'adresses est-il nécessaire à mon usage ? | Retirer l'accès si vous n'utilisez pas la recherche de contacts. |
| Micro et appareil photo | Ai-je encore besoin d'enregistrer ou d'appeler dans cette application ? | Désactiver l'accès devenu inutile, puis vérifier la fonction concernée. |
| Bluetooth et réseau local | L'application pilote-t-elle un accessoire ou un appareil du domicile ? | Garder l'autorisation pour cet usage, la retirer sinon. |

Une autorisation permet un accès ; elle ne prouve pas que les données ont été envoyées à un serveur. Inversement, retirer la localisation ne supprime pas toutes les informations qu'un service peut déduire de votre compte ou de vos connexions. Les [réglages matériels décrits par Apple](https://support.apple.com/fr-fr/guide/iphone/iph168c4bbd5/ios) complètent ce premier passage.

## 3. Vérifier le suivi et les publicités séparément

Dans **Réglages → Confidentialité et sécurité → Suivi**, passez en revue les décisions de chaque application. Vous pouvez retirer une autorisation déjà accordée et désactiver les nouvelles demandes. Ce contrôle concerne le suivi entre applications et sites de différentes entreprises ; il n'interdit pas toute connexion réseau ni tout traitement par le service que vous utilisez. Voir [l'explication d'Apple sur les demandes de suivi](https://support.apple.com/fr-fr/102420).

La rubrique **Publicité Apple** contient un autre réglage : les publicités personnalisées diffusées par Apple. Le désactiver ne supprime pas nécessairement les annonces. Il ne faut pas non plus présenter ce geste comme une remise à zéro garantie de l'identifiant publicitaire. [Apple décrit le périmètre de la personnalisation publicitaire](https://support.apple.com/fr-fr/105131).

## 4. Examiner les domaines avant de décider

Choisissez une application dans l'activité réseau du rapport. Pour un domaine inconnu, relevez le nom exact, l'application associée et le contexte d'utilisation. Cherchez ensuite une explication dans la politique de confidentialité de l'éditeur ou auprès de son assistance.

Un même domaine peut servir à fournir une vidéo, distribuer des images, diagnostiquer une erreur ou mesurer une audience. Une classification comme « publicité » ou « mesure » apporte un indice ; elle ne révèle pas le contenu précis de chaque échange chiffré.

Si vous souhaitez regrouper les résultats, vous pouvez [importer le rapport dans Privacy Score](/fr/blog/importer-rapport-confidentialite-iphone/). L'application analyse le fichier localement et organise les domaines et les recommandations. Le score est un indicateur interne pour orienter votre revue, pas une note attribuée par Apple ni une mesure de conformité au RGPD.

*La capture de cet article illustre l'interface de Privacy Score en anglais. Ses chiffres concernent la capture présentée ; ils ne constituent pas une moyenne des utilisateurs.*

## 5. Appliquer une action et vérifier son effet

Procédez par changements ciblés. Après avoir réduit une autorisation, réutilisez la fonction concernée. Après avoir désinstallé une application inutile, vérifiez simplement que vous n'en avez plus besoin. Pour comparer deux rapports, gardez à l'esprit que les applications utilisées et la durée observée peuvent changer.

Le DNS et le VPN méritent un choix distinct. **Chiffrer le DNS protège les échanges DNS avec le résolveur ; filtrer des domaines dépend des règles du fournisseur.** Saisir une adresse DNS dans les réglages Wi-Fi ne suffit pas à activer DoH ou DoT. Apple décrit la [configuration du DNS chiffré par application ou profil](https://developer.apple.com/videos/play/wwdc2020/10047/).

Privacy Score propose des outils de profils DNS et VPN parmi ses fonctions Premium. Le fournisseur choisi traite alors les échanges nécessaires à son service : l'analyse locale du rapport ne rend pas ce fournisseur invisible. Consultez sa politique de confidentialité avant de configurer un profil.

Votre prochaine revue peut tenir en une liste courte : autorisations sensibles, suivi, domaines à expliquer, applications encore utiles. Reprenez-la lorsque vos usages changent, plutôt que de viser un nombre arbitraire de domaines à supprimer.

## Questions fréquentes

### Faut-il désactiver toutes les autorisations ?

Non. Conservez celles qui servent une fonction que vous utilisez et dont vous acceptez le fonctionnement. Un refus peut empêcher une fonction utile ; vous pouvez modifier votre décision ensuite.

### Un bon score garantit-il que mes données sont protégées ?

Non. Un score résume les critères d'un outil et les données dont il dispose. Il ne révèle pas ce qu'un serveur conserve et ne couvre pas tous les risques liés à un compte ou à un appareil.

### Dois-je payer pour commencer l'audit ?

Les réglages et le rapport Apple sont accessibles sans Privacy Score. Le premier audit dans l'application est gratuit ; les fonctions Premium et leur tarif sont présentés avant achat sur l'App Store.

[Découvrir l'audit de confidentialité sur iPhone avec Privacy Score](/fr/#how) ou [télécharger l'application sur l'App Store](https://apps.apple.com/fr/app/privacy-score-tracker-audit/id6762229573).
