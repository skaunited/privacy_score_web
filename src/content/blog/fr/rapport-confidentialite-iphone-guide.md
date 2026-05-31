---
title: "Rapport de confidentialité iPhone : guide complet 2026"
description: "Comprendre, activer et lire le Rapport de confidentialité des apps sur iPhone. Ce que vos applications font vraiment de vos données, en 30 secondes."
publishedAt: "2026-06-01"
updatedAt: "2026-06-01"
author: "Skander Bahri"
language: "fr"
slug: "rapport-confidentialite-iphone-guide"
tags: ["rapport de confidentialité", "iphone", "vie privée", "ios"]
hero:
  alt: "Capture de l'écran Réglages d'un iPhone affichant la section Rapport de confidentialité des apps."
---

En 2024, des journalistes de <a href="https://www.wired.com/story/secret-service-phone-location-data-babel-street/" rel="external">Wired</a> et de <a href="https://www.404media.co/data-broker-tracked-secret-service-fbi-agents-locado-babel-street-locate-x/" rel="external">404 Media</a> ont acheté, sur le marché légal des courtiers en données, l'historique de localisation de 26 agents des Services secrets américains. Pas de piratage, pas de fuite&nbsp;: une simple transaction commerciale, alimentée par des SDK publicitaires embarqués dans des applications grand public. L'épisode rappelle une réalité que la plupart des utilisateurs d'iPhone ignorent encore&nbsp;: chaque application installée contacte, en moyenne, des dizaines de domaines tiers chaque jour. Et la réponse d'Apple à ce phénomène existe depuis 2021. Elle s'appelle le **Rapport de confidentialité des apps**, et elle est désactivée par défaut. Ce guide explique ce qu'elle contient, comment l'activer en moins d'une minute, et comment l'interpréter sans bac+5 en cybersécurité.

## Qu'est-ce que le Rapport de confidentialité&nbsp;?

Le Rapport de confidentialité des apps est une fonctionnalité native d'iOS, introduite par Apple en décembre 2021 avec iOS 15.2. Il enregistre, sur sept jours glissants, deux types d'événements&nbsp;:

- **Les accès aux ressources sensibles** de votre téléphone par chaque application&nbsp;: photos, contacts, localisation, micro, appareil photo, calendrier, presse-papiers.
- **L'activité réseau** de chaque application&nbsp;: la liste des noms de domaine contactés en tâche de fond, avec horodatage à la seconde.

L'ensemble est stocké localement, sur votre appareil, dans un fichier au format <a href="https://github.com/ndjson/ndjson-spec" rel="external">NDJSON</a> (une ligne JSON par événement). Apple ne reçoit jamais ce rapport. Vous pouvez l'exporter via le bouton de partage standard d'iOS, le supprimer à tout moment ou désactiver l'enregistrement.

Le Rapport de confidentialité est, à ce jour, la seule source officielle, vérifiable et locale qui vous indique précisément ce que vos applications font dans votre dos.

### Pourquoi Apple l'a-t-il introduit&nbsp;?

L'historique compte. En avril 2021, iOS 14.5 a introduit l'<a href="https://www.apple.com/fr/privacy/control/" rel="external">App Tracking Transparency</a>, qui oblige les applications à demander votre consentement avant de vous suivre entre apps. La mesure a fait perdre, selon les estimations publiques de Meta, environ 10 milliards de dollars de revenus publicitaires en 2022 au seul Facebook. Le Rapport de confidentialité, sorti huit mois plus tard, ajoute une couche d'observabilité&nbsp;: l'ATT empêche un suivi déclaré, le rapport révèle les connexions silencieuses qui restent.

## Comment l'activer en 30&nbsp;secondes

Le chemin exact dans iOS&nbsp;17 et iOS&nbsp;18, confirmé par <a href="https://support.apple.com/fr-fr/102188" rel="external">la documentation Apple</a>&nbsp;:

1. Ouvrir **Réglages**.
2. Faire défiler jusqu'à **Confidentialité &amp; sécurité**.
3. Tout en bas de la liste, toucher **Rapport sur l'App Privacy**.
4. Toucher **Activer le rapport de confidentialité des apps**.

Une fois activé, le rapport commence à enregistrer immédiatement, mais il faut attendre **24 à 48&nbsp;heures** pour obtenir une vue représentative de votre usage. La fenêtre maximale est de sept jours&nbsp;; au-delà, les anciens événements sont effacés automatiquement.

### Important à savoir

L'activation est rétroactive seulement pour le futur. Si vous activez le rapport aujourd'hui, vous n'aurez aucune donnée sur la semaine passée. Pour cette raison, l'activation au plus tôt après un changement d'iPhone ou une réinitialisation est la bonne pratique.

## Comment le lire

Le Rapport de confidentialité s'affiche en quatre sections distinctes, accessibles depuis le même écran.

### Apps qui ont accédé aux données

Cette première section liste, par application, chaque accès aux ressources sensibles (localisation, photos, micro, etc.) avec la date et l'heure. C'est ici que vous voyez, par exemple, qu'une application de météo a interrogé votre position 47&nbsp;fois en deux jours, alors qu'une seule lecture quotidienne suffirait.

### Apps qui ont contacté des domaines

Pour chaque application, la liste des domaines contactés en réseau, classée par fréquence. C'est la section la plus révélatrice&nbsp;: vous découvrez que telle app de retouche photo contacte régulièrement `graph.facebook.com`, `googleadservices.com` ou `bidder.criteo.com`, alors que rien dans son interface ne le laissait deviner.

### Domaines les plus contactés

L'agrégation inverse&nbsp;: les domaines les plus sollicités sur tout votre téléphone, toutes apps confondues. Si `doubleclick.net` (Google) ou `appsflyer.com` apparaît en tête, c'est qu'un grand nombre de vos applications partagent un même prestataire de pistage.

### Activité réseau

La timeline brute&nbsp;: chaque connexion sortante avec horodatage. Utile pour corréler une fuite à une action précise (ouvrir telle app, recevoir telle notification).

### Un exemple concret de lecture

Prenons un cas réel, anonymisé. Sur un iPhone d'un utilisateur français standard, après 72&nbsp;heures d'enregistrement, le rapport remonte 4&nbsp;218&nbsp;connexions sortantes réparties sur 31&nbsp;applications. Les trois domaines les plus contactés sont, dans l'ordre, `firebase-settings.crashlytics.com` (Google, 612&nbsp;occurrences), `graph.facebook.com` (Meta, 384) et `app-measurement.com` (Google Analytics for Firebase, 271). L'application qui contacte le plus grand nombre de domaines distincts (47) est un jeu mobile gratuit installé deux semaines plus tôt&nbsp;; à l'inverse, l'application bancaire ne contacte que quatre domaines, tous appartenant à l'établissement émetteur. La lecture qui en découle est limpide&nbsp;: le poste d'effort prioritaire est le jeu, dont chaque ouverture déclenche en moyenne huit appels à des SDK publicitaires. Privacy Score, en traitement automatique, arrive à la même conclusion en quelques secondes.

## Ce que le rapport ne dit pas

Le Rapport de confidentialité a des limites qu'il faut connaître pour ne pas le sur-interpréter.

- **Il ne montre pas le contenu des requêtes.** Vous voyez qu'une app a contacté `analytics.example.com`, mais pas ce qu'elle a envoyé. Le chiffrement TLS protège le contenu, le rapport observe seulement la métadonnée «&nbsp;tel domaine a été joint&nbsp;».
- **Il n'identifie pas la société propriétaire du domaine.** `doubleclick.net` est Google, `connect.facebook.net` est Meta, `criteo.com` est Criteo, mais le rapport ne fait pas la traduction. C'est précisément le travail des bases comme <a href="https://github.com/duckduckgo/tracker-radar" rel="external">DuckDuckGo Tracker Radar</a> ou <a href="https://disconnect.me/trackerprotection" rel="external">Disconnect</a>, que des outils tiers utilisent pour enrichir le rapport.
- **Il ne couvre pas les connexions effectuées avant l'activation.** Une fois activé, le rapport remonte au maximum sept jours en arrière.
- **Il ne distingue pas le légitime du suspect.** Une banque qui contacte son propre domaine et un jeu gratuit qui contacte 30&nbsp;réseaux publicitaires apparaissent dans le même format. À vous (ou à un outil d'analyse) d'arbitrer.

Le rapport est une matière brute. Il documente sans juger.

## Comment Privacy Score l'interprète

Privacy Score est une application iOS native qui prend votre Rapport de confidentialité exporté et le transforme en audit lisible. Le fonctionnement&nbsp;:

1. Vous exportez le rapport depuis Réglages, en passant par le bouton de partage standard d'iOS, et vous le déposez dans Privacy Score.
2. L'application **parse le fichier localement**, dans le bac à sable d'iOS. Aucune donnée ne quitte votre téléphone. Aucun compte n'est nécessaire. Aucun serveur ne reçoit votre fichier.
3. Chaque domaine contacté est croisé avec la base DuckDuckGo Tracker Radar pour identifier la société propriétaire (Google, Meta, Criteo, etc.) et la nature de l'activité (publicité, mesure d'audience, hébergement légitime).
4. Un **score sur 100** est calculé, pondéré par le volume de traceurs uniques, leur réputation et leur concentration. Plus le score est élevé, plus votre exposition est faible.
5. Trois à cinq **solutions concrètes** sont surfacées, par ordre d'impact estimé&nbsp;: supprimer telle application particulièrement bavarde, révoquer telle autorisation, activer le DNS chiffré, et ainsi de suite.

Le code iOS est ouvert et auditable. La grille de notation est documentée. Le premier audit est gratuit à vie. C'est l'inverse exact du modèle des courtiers en données qui ont alimenté l'enquête sur les Services secrets&nbsp;: vous restez propriétaire de votre rapport, et personne d'autre n'y accède.

### Pourquoi un croisement avec une base externe

Le Rapport de confidentialité d'Apple ne dit pas «&nbsp;ce domaine appartient à Google&nbsp;» ou «&nbsp;ce domaine est un réseau publicitaire&nbsp;». Cette attribution est précisément la valeur ajoutée d'un outil tiers. La base DuckDuckGo Tracker Radar agrège plus de 200&nbsp;000 domaines actifs catalogués par société propriétaire, catégorie d'usage et prévalence sur le web. Sa licence permissive et ses mises à jour régulières en font la référence ouverte la plus complète. Privacy Score embarque une copie compressée de cette base, mise à jour à chaque mise à jour de l'application, et l'interroge localement&nbsp;: aucune requête ne sort de votre téléphone pendant le croisement.

[Découvrez Privacy Score sur la page d'accueil](/fr/) pour voir comment se présente un audit complet.

## FAQ

### Le Rapport de confidentialité ralentit-il mon iPhone&nbsp;?

Non. Apple a conçu l'enregistrement pour être asynchrone et compressé. L'impact mesuré sur l'autonomie est inférieur à 1&nbsp;%, et aucun ralentissement notable n'a été rapporté depuis iOS&nbsp;15.2.

### Apple voit-elle ce rapport&nbsp;?

Non. Le rapport est généré et stocké localement, sur votre appareil. Il n'est jamais transmis aux serveurs d'Apple. La <a href="https://www.apple.com/fr/legal/privacy/fr-ww/" rel="external">politique de confidentialité d'Apple</a> le confirme&nbsp;: la fonctionnalité est entièrement client-side.

### Puis-je effacer le rapport&nbsp;?

Oui. Depuis l'écran **Rapport sur l'App Privacy**, touchez «&nbsp;Désactiver le rapport de confidentialité des apps&nbsp;» puis réactivez-le immédiatement. Toute la fenêtre des sept derniers jours est effacée. C'est une pratique courante après avoir testé une nouvelle application.

### Que faire si une application contacte des centaines de domaines&nbsp;?

Trois pistes, dans l'ordre. Premièrement, vérifiez que l'application est bien la dernière version&nbsp;: les correctifs récents corrigent parfois des SDK fuyards. Deuxièmement, révoquez les autorisations sensibles (localisation, contacts) depuis Réglages &gt; Confidentialité. Troisièmement, si le comportement persiste sans justification fonctionnelle, désinstallez. La <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-utilisateurs" rel="external">CNIL rappelle régulièrement</a> que la transparence sur les traceurs reste une obligation, y compris pour les applications mobiles.

### Le Rapport de confidentialité existe-t-il sur iPad et Mac&nbsp;?

Sur iPad, oui, depuis iPadOS&nbsp;15.2, avec le même chemin dans Réglages. Sur macOS, non&nbsp;: il n'existe pas d'équivalent système intégré à ce jour. Les utilisateurs Mac peuvent se rabattre sur des outils comme Little Snitch ou LuLu pour observer les connexions sortantes.

### Le rapport remplace-t-il un VPN ou un DNS chiffré&nbsp;?

Non. Le Rapport de confidentialité est un outil d'**observation**, pas un outil de **filtrage**. Il vous indique quels domaines vos applications contactent, mais il ne bloque rien. Pour bloquer, il vous faut un DNS chiffré avec filtrage (NextDNS, AdGuard, Quad9 avec liste personnalisée) ou un VPN avec règles. Le rapport sert à choisir la cible du filtre, pas à se substituer à lui.

### Le rapport peut-il être utilisé comme preuve juridique&nbsp;?

À ce jour, aucune jurisprudence française ne l'a tranché. Le fichier est généré par votre appareil, sans signature horodatée par un tiers de confiance, et reste donc difficilement opposable en l'état. Sa valeur est documentaire et indicative. Pour un signalement à la <a href="https://www.cnil.fr/fr/plaintes" rel="external">CNIL</a> concernant une application qui ne respecterait pas le RGPD, il peut néanmoins servir de pièce versée au dossier, à côté de captures d'écran et de la politique de confidentialité de l'éditeur visé.

## Conclusion

Le Rapport de confidentialité des apps est l'outil d'observation le plus honnête qu'Apple ait livré à ses utilisateurs depuis l'<a href="/fr/politique-de-confidentialite/">App Tracking Transparency</a>. Il documente sans embellir et sans dramatiser. Pour la plupart des utilisateurs, le déchiffrer manuellement reste fastidieux&nbsp;: c'est précisément ce que [Privacy Score automatise](/fr/), en gardant la même promesse de traitement strictement local. Activez le rapport aujourd'hui, attendez 48&nbsp;heures, et regardez ce que votre téléphone fait quand vous ne le regardez pas.
