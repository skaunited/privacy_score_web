---
title: "Rapport de confidentialité iPhone vide : que vérifier ?"
description: "Votre rapport de confidentialité iPhone est vide ? Vérifiez l'activation, la période, le fichier exporté et son périmètre avant de tout réinitialiser."
publishedAt: "2026-10-19"
updatedAt: "2026-10-19"
author: "Skander Bahri"
language: "fr"
slug: "rapport-confidentialite-iphone-vide"
translationKey: "empty-report"
tags: ["rapport de confidentialité", "iphone", "dépannage", "import"]
hero:
  src: "/assets/screen-network.webp"
  alt: "Exemple d'analyse réseau remplie dans Privacy Score, avec des domaines et entreprises affichés en anglais."
---

Un **rapport de confidentialité iPhone vide** signifie d'abord qu'il manque des observations à afficher. Vérifiez l'activation dans Réglages, utilisez vos applications, puis regardez le rapport Apple avant d'exporter un nouveau fichier. Ne le désactivez pas pour tenter de le réparer : cette action efface les données qu'il contient.

La première distinction est simple : **le rapport est-il vide dans Réglages, ou seulement après son import dans Privacy Score ?** Ces situations ne se diagnostiquent pas de la même façon. L'absence de données ne prouve ni l'absence de suivi ni la présence d'un problème de sécurité.

## Identifier le point où les données manquent

| Ce que vous constatez | Vérification prioritaire | Prochaine action |
|---|---|---|
| Aucune activité dans Réglages | L'enregistrement est-il actif depuis votre usage récent ? | Activer si nécessaire, puis utiliser les applications concernées. |
| Des domaines, mais pas d'accès au micro ou aux photos | Ces ressources ont-elles été utilisées ? | Examiner la rubrique pertinente ; toutes les apps n'ont pas besoin de tous les capteurs. |
| Un site ou une application manque | L'activité recherchée entre-t-elle dans le périmètre du rapport ? | Vérifier la période et le contexte de navigation. |
| Réglages contient des données, l'import ne les montre pas | Le fichier partagé est-il le bon et est-il récent ? | Exporter de nouveau l'original, sans conversion. |
| Le résultat n'a pas changé après un réglage | Avez-vous importé de nouvelles observations ? | Réutiliser l'app concernée, puis créer un nouvel export. |

## 1. Vérifier l'activation et la période

Ouvrez **Réglages → Confidentialité et sécurité → Rapport de confidentialité des apps**. Si une action d'activation est proposée, le recueil n'est pas encore actif. Si des événements sont déjà affichés, évitez de repartir de zéro sans raison.

[Apple explique que les informations apparaissent après l'activation](https://support.apple.com/fr-fr/guide/personal-safety/ipsd4dac4a2c/web), à mesure que vous utilisez les applications. L'enregistrement ne récupère pas les activités passées. Il n'existe donc pas de durée d'attente qui garantisse, à elle seule, un rapport complet.

Reproduisez une activité ordinaire dans une application que vous connaissez, puis revenez consulter le rapport. Vous n'avez pas besoin d'autoriser l'accès à vos contacts, à votre position ou au micro uniquement pour remplir un tableau. Les données utiles sont celles de vos usages réels.

## 2. Comprendre ce qui peut manquer normalement

Un rapport contenant des domaines mais aucun accès à l'appareil photo n'est pas forcément incomplet. Une application peut utiliser Internet sans prendre de photo. De même, la liste des permissions accordées est différente de la liste des utilisations enregistrées : l'autorisation peut exister sans avoir été utilisée pendant la période observée.

La [documentation du rapport Apple](https://support.apple.com/fr-fr/102188) précise aussi une limite de navigation : les sessions privées des navigateurs n'y sont pas incluses. Les modes privés d'autres types d'applications peuvent, eux, apparaître. Il ne faut pas interpréter le rapport comme une copie exhaustive de tout l'historique web.

Pour les usages observés, la présentation distingue l'application, les sites qu'elle affiche et les domaines regroupés. Un contenu intégré peut expliquer qu'un domaine soit associé à une application inattendue. Notre [guide des quatre rubriques](/fr/blog/rapport-confidentialite-iphone-guide/) permet de retrouver le bon contexte.

## 3. Vérifier le fichier transmis à Privacy Score

Si Réglages affiche de l'activité mais pas Privacy Score, reprenez le parcours d'export :

1. Revenez dans le rapport Apple de l'iPhone concerné.
2. Utilisez son action d'enregistrement pour produire un fichier récent.
3. Partagez ce fichier vers Privacy Score, sans le convertir ni le modifier.
4. Vérifiez que vous consultez le résultat de cet import.

Une capture d'écran ou un PDF montre une présentation, pas les événements structurés attendus. Renommer le document en `.ndjson` ne corrige pas son contenu. Le [tutoriel d'import du rapport](/fr/blog/importer-rapport-confidentialite-iphone/) détaille le parcours et distingue le fichier Apple de l'export des résultats Premium.

L'analyse locale ne peut pas inventer les lignes absentes. Elle peut aussi regrouper ou classer les domaines différemment de l'écran Apple ; une différence entre deux totaux ne suffit pas à diagnostiquer une perte de données.

*L'image de cette page montre un exemple d'écran rempli de Privacy Score en anglais. Elle ne représente pas un message d'erreur ni une quantité de données minimale à atteindre.*

## 4. Demander de l'aide sans partager vos habitudes

Si le problème persiste, préparez quatre informations : version d'iOS, version de Privacy Score, étape exacte et message affiché. Précisez si des données sont visibles dans Réglages et si vous venez d'exporter le fichier.

Écrivez à [support@privacyscore.fr](mailto:support@privacyscore.fr) avec ces éléments. Une capture recadrée et masquée peut montrer l'erreur sans exposer les domaines, les applications et les heures de votre activité. N'envoyez pas le rapport intégral par défaut et ne le publiez pas sur un forum.

## Questions fréquentes

### Désactiver puis réactiver le rapport peut-il aider ?

Cela efface l'historique conservé par la fonction et recommence le recueil. Ce n'est pas une première étape de dépannage : vous perdriez les observations utiles pour comprendre le problème.

### Faut-il attendre sept jours avant tout import ?

Non. Les sept jours correspondent à la fenêtre du rapport, pas à un seuil obligatoire pour commencer. Regardez si le fichier couvre des usages pertinents pour votre question.

### Aucun domaine classé comme traceur signifie-t-il aucun suivi ?

Non. La période peut être limitée, une classification peut manquer et un domaine ne révèle pas le contenu des échanges. Interprétez le résultat avec ces limites, puis appliquez une [vérification de confidentialité ciblée](/fr/blog/audit-confidentialite-iphone/).

Pour commencer, [découvrez Privacy Score](/fr/) ou [téléchargez l'application sur l'App Store](https://apps.apple.com/fr/app/privacy-score-tracker-audit/id6762229573). Le premier audit est gratuit ; les fonctions Premium et leurs conditions sont affichées avant achat.
