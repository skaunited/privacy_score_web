---
title: "Rapport de confidentialité iPhone : comment le lire"
description: "Comprenez le rapport de confidentialité iPhone : accès aux capteurs, activité réseau et domaines contactés. Distinguez les faits observés des interprétations."
publishedAt: "2026-06-01"
updatedAt: "2026-10-19"
author: "Skander Bahri"
language: "fr"
slug: "rapport-confidentialite-iphone-guide"
tags: ["rapport de confidentialité", "iphone", "activité réseau", "ios"]
hero:
  src: "/assets/screen-network.webp"
  alt: "Vue du trafic réseau dans Privacy Score, affichant les onglets destinations, traceurs et entreprises en anglais."
---

Le **rapport de confidentialité iPhone** montre des accès aux données et des domaines contactés pendant l'utilisation de vos applications. Pour l'ouvrir, allez dans **Réglages → Confidentialité et sécurité → Rapport de confidentialité des apps**. S'il est désactivé, activez-le puis utilisez votre iPhone : les informations se construisent à partir de ce moment.

La bonne question est : « Cet accès correspond-il à ce que j'ai demandé à l'application ? ». Un nom de domaine inconnu ou un grand nombre de contacts ne suffit pas à démontrer une fuite. Ce guide vous aide à lire le rapport avant de modifier vos réglages.

## Ce que contiennent les quatre rubriques

La [documentation Apple du rapport](https://support.apple.com/fr-fr/102188) distingue les accès aux données des différentes vues réseau. La fenêtre présentée couvre les sept derniers jours, sous réserve que l'enregistrement ait été actif.

| Rubrique | Information disponible | Première question utile |
|---|---|---|
| Accès aux données et aux capteurs | Utilisations de ressources comme la position, les photos, les contacts, le micro ou l'appareil photo. | Ai-je utilisé une fonction qui justifie cet accès ? |
| Activité réseau des apps | Domaines contactés directement par l'application ou par le contenu qu'elle affiche. | Le contact vient-il de l'app ou d'une page, vidéo ou publicité intégrée ? |
| Activité réseau des sites web | Domaines joints par des sites consultés depuis des applications. | Quelle page ai-je ouverte à ce moment-là ? |
| Domaines les plus contactés | Vue regroupée des domaines fréquemment joints. | Quelles applications ou quels contenus ont contacté ce domaine ? |

Vous pouvez commencer par ces vues déjà organisées dans Réglages. Le fichier à enregistrer et partager permet ensuite à un outil compatible de regrouper les événements autrement.

## Lire un accès sans le confondre avec une collecte

Commencez par une ressource : microphone, appareil photo, position ou contacts. Touchez une application pour examiner les informations disponibles, puis rapprochez-les de votre usage.

Un accès au micro pendant un message vocal peut être attendu. Un accès dont vous ne comprenez pas le contexte mérite une vérification. L'heure seule ne permet pas toujours de retrouver ce que vous faisiez : notez l'observation avant de conclure.

**Accéder à une donnée et la transmettre sont deux événements différents.** Une application peut utiliser une information uniquement sur l'appareil. Le rapport ne montre pas le contenu exact de chaque requête réseau. Pour comprendre le traitement annoncé par l'éditeur, consultez également sa politique et l'étiquette de confidentialité de sa fiche App Store.

Vous pouvez ensuite revoir les permissions dans Réglages. Notre [méthode d'audit de confidentialité iPhone](/fr/blog/audit-confidentialite-iphone/) propose un ordre de vérification et explique les conséquences des changements.

## Interpréter un domaine : un exemple fictif

Imaginons qu'une application de recettes contacte `images.example.com` et `metrics.example.net`. **Cet exemple est inventé** : les noms servent à expliquer une démarche, pas à désigner des services observés.

1. Vérifiez dans quelle vue le domaine apparaît : l'application elle-même ou un contenu web affiché dans l'application.
2. Notez si vous veniez d'ouvrir une vidéo, une page ou une fonction particulière.
3. Consultez les informations de l'éditeur pour rechercher le prestataire et son rôle.
4. Si l'explication manque, posez une question avec le nom exact du domaine et le contexte, sans envoyer tout votre rapport.

Le mot `metrics` suggère une mesure, mais un nom n'est pas une preuve. Le domaine d'images peut appartenir à un prestataire technique. Le volume des contacts peut aussi dépendre d'un contenu qui se recharge ou d'échecs répétés. Le rapport aide à formuler une question vérifiable, pas à deviner les données échangées.

Une base de classification de domaines peut ajouter un propriétaire ou une catégorie. Elle conserve des limites : un prestataire peut avoir plusieurs fonctions, une attribution peut manquer et les services évoluent.

## Enregistrer le rapport et l'analyser localement

Pour passer du relevé à une vue d'ensemble, suivez notre [guide d'export et d'import dans Privacy Score](/fr/blog/importer-rapport-confidentialite-iphone/). Il distingue l'enregistrement du rapport Apple de l'export des résultats dans l'application.

Privacy Score regroupe les domaines du fichier importé et propose un score ainsi que des pistes d'action. Cette analyse se déroule sur votre iPhone. Vous choisissez les recommandations à appliquer ; l'analyse ne retire pas automatiquement toutes les autorisations des autres applications.

Le score est propre à Privacy Score. Une note élevée ne garantit pas l'absence de suivi, et une note basse ne démontre pas qu'une donnée sensible a été transmise. Pour suivre une évolution, comparez aussi les usages et les périodes observées.

*La capture de Privacy Score présentée sur cette page est en anglais. Ses chiffres illustrent ce rapport affiché ; ils ne décrivent pas une moyenne ni le résultat attendu sur votre iPhone.*

## Les limites à garder en tête

- **Pas d'historique avant activation.** Si le rapport vient d'être activé, il manque naturellement les usages précédents.
- **Pas de contenu des échanges TLS.** Un contact réseau ne révèle ni le texte envoyé ni toutes les données conservées par le destinataire.
- **Pas d'inventaire complet de la navigation privée.** Apple exclut les sessions privées des navigateurs ; des modes privés proposés par d'autres types d'apps peuvent rester visibles dans le rapport.
- **Pas de verdict automatique.** Ni un compteur élevé ni l'absence d'une alerte ne suffisent à déclarer une application dangereuse ou sûre.

Ne publiez pas un rapport brut pour demander un avis. Les applications, les domaines et les horaires peuvent révéler vos habitudes. Préférez une question ciblée avec les informations personnelles masquées.

## Questions fréquentes

### Pourquoi le rapport est-il vide ?

Il vient peut-être d'être activé, la période contient peu d'usage ou les données recherchées ne font pas partie de son périmètre. Vérifiez ces cas dans le [guide des rapports vides ou incomplets](/fr/blog/rapport-confidentialite-iphone-vide/).

### Le rapport bloque-t-il les domaines affichés ?

Non. Il fournit une observation. Le filtrage dépend d'un outil et de règles distincts. Un DNS chiffré ne filtre pas automatiquement les domaines publicitaires.

### Faut-il le désactiver pour repartir de zéro ?

Désactiver le rapport efface les informations qu'iOS y conserve. Évitez ce geste si vous souhaitez encore les consulter ou les enregistrer. Il ne remplace pas la gestion séparée des fichiers déjà exportés.

Pour organiser votre lecture, [découvrez Privacy Score](/fr/) ou [téléchargez l'application sur l'App Store](https://apps.apple.com/fr/app/privacy-score-tracker-audit/id6762229573). Le premier audit est gratuit ; les fonctions Premium sont présentées avant achat.
