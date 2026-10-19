---
title: "Importer le rapport de confidentialité iPhone"
description: "Enregistrez votre rapport de confidentialité iPhone et partagez-le vers Privacy Score. Préparez un fichier utile et résolvez les difficultés d'importation."
publishedAt: "2026-10-19"
updatedAt: "2026-10-19"
author: "Skander Bahri"
language: "fr"
slug: "importer-rapport-confidentialite-iphone"
translationKey: "export-report"
tags: ["rapport de confidentialité", "iphone", "import", "tutoriel"]
hero:
  src: "/assets/screen-network.webp"
  alt: "Analyse du trafic réseau affichée dans Privacy Score après import d'un rapport, avec les onglets de navigation en anglais."
---

Pour **importer le rapport de confidentialité iPhone**, ouvrez le rapport dans Réglages, utilisez l'action d'enregistrement puis partagez le fichier vers Privacy Score. Vous n'avez pas à envoyer le fichier par e-mail ni à le déposer sur un site web : l'analyse se fait dans l'application, sur votre appareil.

Avant de commencer, vérifiez que le rapport contient de l'activité. Un fichier exporté juste après son activation peut être valide mais peu utile. Ce tutoriel couvre la préparation, le partage et les vérifications si l'import ne donne pas le résultat attendu.

## 1. Préparer le rapport dans Réglages

Ouvrez **Réglages → Confidentialité et sécurité → Rapport de confidentialité des apps**. Si l'enregistrement n'est pas actif, activez-le et revenez après avoir utilisé vos applications habituelles. [Apple précise le périmètre de cette fonction](https://support.apple.com/fr-fr/102188) : elle ne reconstitue pas les événements antérieurs à son activation.

Regardez si des applications et des domaines apparaissent. Vous pouvez commencer par consulter le [guide de lecture du rapport](/fr/blog/rapport-confidentialite-iphone-guide/) si les rubriques vous semblent difficiles à interpréter.

Pour une comparaison ultérieure, notez la date de l'export et votre contexte : applications utilisées, changement d'autorisation ou installation d'un filtre. Ces repères évitent d'attribuer une différence de résultat à une protection alors que vous avez simplement moins utilisé votre téléphone.

## 2. Enregistrer et partager vers Privacy Score

Installez d'abord [Privacy Score depuis l'App Store](https://apps.apple.com/fr/app/privacy-score-tracker-audit/id6762229573), puis revenez dans le rapport Apple.

1. Dans l'écran du rapport, cherchez l'action permettant de **l'enregistrer**. Selon les libellés de votre version d'iOS, le nom peut reprendre « Rapport de confidentialité des apps » ou « App Privacy ».
2. Dans la feuille de partage d'iOS, sélectionnez **Privacy Score** parmi les applications proposées. Parcourez la liste complète si l'icône n'est pas immédiatement visible.
3. Laissez l'application ouvrir le fichier et effectuer l'analyse locale.
4. Consultez le résultat : score, domaines identifiés et recommandations disponibles.

Le fichier source est au format **NDJSON**, utilisé pour transmettre les événements à un outil compatible. Vous n'avez pas à lire ses lignes ni à les modifier. Gardez le fichier original pour éviter qu'une conversion n'altère son format.

L'enregistrement et le partage du rapport Apple sont distincts des fonctions payantes de Privacy Score. Le premier audit de l'application est gratuit ; les audits suivants, les outils DNS/VPN et l'export de ses résultats font partie de Premium. Consultez les conditions affichées dans l'App Store avant tout achat.

## 3. Vérifier que vous analysez le bon fichier

Après l'import, rapprochez les résultats de l'activité visible dans Réglages. Les deux interfaces regroupent les informations différemment : leurs compteurs n'ont pas nécessairement le même sens.

| Vérification | Pourquoi elle compte |
|---|---|
| Le fichier vient du rapport Apple de cet iPhone. | Une capture d'écran, un PDF ou un autre journal ne remplace pas les événements du rapport. |
| L'export a été réalisé après l'usage que vous souhaitez examiner. | Un ancien fichier ne se met pas à jour après sa création. |
| Le rapport Apple contient déjà de l'activité. | L'analyse ne peut pas recréer des données absentes du fichier. |
| Vous comprenez le contexte des applications observées. | Un domaine peut venir d'une vidéo ou d'une page intégrée. |

*La capture de cet article montre l'écran de trafic réseau de Privacy Score en anglais, pas la feuille de partage d'iOS. Ses chiffres illustrent le rapport affiché.*

## Si l'importation ne fonctionne pas

Si Privacy Score n'apparaît pas dans les destinations, vérifiez que l'application est installée, ouvrez-la une première fois puis reprenez le partage depuis le rapport. Évitez d'envoyer une simple image de l'écran.

Si un fichier est refusé, exportez de nouveau le rapport original depuis Réglages. Changer uniquement son extension ne convertit pas un document en rapport valide. Si le résultat est vide ou paraît incomplet, utilisez notre [diagnostic des rapports de confidentialité vides](/fr/blog/rapport-confidentialite-iphone-vide/).

Pour demander de l'aide à [support@privacyscore.fr](mailto:support@privacyscore.fr), indiquez votre version d'iOS, la version de Privacy Score, l'étape concernée et le message d'erreur exact. Commencez sans joindre le rapport complet : il peut révéler des applications, domaines et horaires personnels.

## Questions fréquentes

### Le fichier doit-il passer par iCloud Drive ?

Non, le partage direct depuis Réglages vers Privacy Score suffit au parcours décrit. Si vous choisissez un service de stockage ou un envoi par e-mail, cette copie dépend ensuite du service utilisé.

### Faut-il réexporter après chaque changement ?

Pour analyser de nouvelles observations, oui : le fichier déjà importé reste un instantané. Utilisez les applications concernées après votre changement, puis créez un nouvel export.

### Privacy Score peut-il modifier les autorisations à ma place ?

L'analyse vous aide à choisir les actions. Les autorisations des autres applications se règlent dans iOS ; notre [checklist d'audit](/fr/blog/audit-confidentialite-iphone/) vous guide.

Vous pouvez maintenant [découvrir le fonctionnement de Privacy Score](/fr/#how) et examiner votre rapport sans le transmettre à un serveur d'analyse.
