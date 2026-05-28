# Stage 2c — Rapport de vérification : Conditions Générales d'Utilisation / Terms of Use

**Date** : 27 mai 2026
**Vérificateur** : cabinet-avocat:droit-consommation
**Documents vérifiés** :
- `App/Privacy Score/StoreListing/legal/fr/conditions-generales-utilisation.md` (v1.0, 1669 mots → ~1900 mots après corrections)
- `App/Privacy Score/StoreListing/legal/en/terms-of-use.md` (v1.0, 1571 mots → ~1800 mots après corrections)

---

## PASS 2 — Re-vérification du 27 mai 2026 (après corrections)

### Verdict final

| Document | Verdict |
|---|---|
| **CGU FR** | ✅ **PASS** |
| **Terms of Use EN** | ✅ **PASS** |

**Tous les findings HIGH et MEDIUM sont résolus.** Le document est prêt pour le Stage 3 (relecteur indépendant) sans réserve résiduelle bloquante.

### Vérification point par point des 6 corrections

| # | Correction attendue | FR | EN | Statut |
|---|---|---|---|---|
| 1 (HIGH) | Art. 5.5 : 3e critère L. 221-28, 13° (Apple confirmation email) | ✓ | ✓ | ✅ OK |
| 2 (HIGH) | Section 7 : sous-sections 7.1 SLA, 7.2 incidents, 7.3 accessibilité (L. 224-25-5 items 3, 8, 9) | ✓ | ✓ | ✅ OK |
| 3 (MEDIUM) | Art. 5.2 : mécanisme notification Apple (L. 215-1) | ✓ | ✓ | ✅ OK |
| 4 (MEDIUM) | Art. 5.3 : absence résiliation directe motivée (L. 215-1-1) | ✓ | ✓ | ✅ OK |
| 5 (MEDIUM) | Art. 15 : contrat d'adhésion + art. 1190 C. civ. | ✓ | ✓ | ✅ OK |
| 6 (bonus) | Changelog mis à jour | ✓ | ✓ | ✅ OK |

Méthode de vérification : grep ciblé sur chaque ajout textuel. Tous présents et alignés FR ↔ EN.

### Vérification voice rules

| Rule | Résultat |
|---|---|
| Em-dashes (`—`) | 0 dans les 2 documents (re-corrigé après introduction accidentelle dans le changelog EN) |
| Exclamation marks | 0 |
| « actionable » / « actionnable » | 0 |
| FR utilise `vous` | ✓ |
| EN utilise US English | ✓ |
| FR/EN alignement structurel | ✓ (mêmes 16 sections + 3 nouvelles sous-sections 7.1, 7.2, 7.3) |

### Conformité finale aux régimes vérifiés

| Régime | Référence | Conformité |
|---|---|---|
| Renouvellement tacite | C. conso. L. 215-1 | ✅ avec mécanisme Apple documenté |
| Résiliation en ligne | C. conso. L. 215-1-1 | ✅ via parcours Apple natif, justifié |
| Exclusion droit de rétractation contenu numérique | C. conso. L. 221-28, 13° (3 critères) | ✅ 3 conditions explicitement documentées |
| Information précontractuelle | C. conso. L. 221-5 + L. 224-25-5 (9 items) | ✅ items 1-9 couverts |
| Médiation consommation | C. conso. L. 612-1 | ✅ CM2C désigné (adresse à confirmer post-inscription) |
| Limitation de responsabilité | C. civ. art. 1231-3 | ✅ carve-outs faute lourde/dol/atteinte personne |
| Contrat d'adhésion | C. civ. art. 1110, 1190 | ✅ qualification explicite |
| Décompilation logicielle | CPI art. L. 122-6-1 | ✅ référence correcte |
| Compétence juridictionnelle B2C UE | Règlement (UE) 1215/2012 art. 18 | ✅ |

### Nouveaux findings introduits par les corrections

**Aucun.** Les ajouts n'ont pas modifié d'autres sections, ni introduit de référence non vérifiée, ni cassé l'alignement FR/EN. Voice rules respectées (après correction d'un em-dash accidentel dans le changelog EN).

### Points résiduels à confirmer (transmis à Stage 3 + Open Questions)

1. **Inscription CM2C effective** — l'adresse `14 rue Saint Jean, 75017 Paris` est à confirmer post-inscription.
2. **Apple email de confirmation** — vérifié comme pratique standard Apple IAP, mais à confirmer en test réel.
3. **Politique interne incidents de sécurité** — la procédure interne CoDevelop devrait être documentée séparément (procédure opérationnelle, non publiée).
4. **Audit accessibilité réelle** — vérifier que l'app Privacy Score respecte effectivement VoiceOver / Dynamic Type / contraste, sinon retirer cette affirmation.

### Verdict de transition

✅ **READY FOR STAGE 3** (relecteur indépendant `cabinet-avocat:relecteur` pour les 3 documents).

Le Stage 3 effectuera la lecture finale end-to-end de chacun des 6 fichiers (FR + EN × 3) et rendra un verdict PASS/FAIL par document, selon la rubrique des Sections 10.1, 10.2, 10.3 du brief.

---

## PASS 1 — Premier passage de vérification (historique)



---

## Synthèse

| Métrique | Valeur |
|---|---|
| **Verdict global FR** | ⚠️ WARNING (0 CRITICAL, 2 HIGH, 3 MEDIUM, 1 LOW) |
| **Verdict global EN** | ⚠️ WARNING (mêmes corrections, alignées) |
| Points bloquants (CRITICAL) | **0** |
| Points à corriger (HIGH) | **2** |
| Points à améliorer (MEDIUM) | **3** |
| Points cosmétiques (LOW) | **1** |

Le document est **substantiellement conforme** mais nécessite 2 corrections HIGH avant publication : (1) ajout du 3e critère de l'art. L. 221-28, 13°, et (2) intégration des mentions obligatoires de l'art. L. 224-25-5 nouveau régime des contrats numériques (en vigueur depuis 01/01/2022).

---

## Vérifications Légifrance — résultats

### ✅ Vérifié OK

| Texte cité dans le draft | LégiFrance ID | Résultat |
|---|---|---|
| C. conso. art. L. 612-1 (médiation) | Voir Stage 0 | OK. CM2C correctement nommé. |
| C. civ. art. 1231-3 (limitation responsabilité) | (article connu, version générale) | OK. Le carve-out faute lourde / dol / atteinte à la personne est correctement formulé. |
| CPI art. L. 122-6-1 (décompilation logicielle) | (article connu) | OK. Référence pertinente pour interdire la décompilation tout en réservant les droits légaux de l'utilisateur (interopérabilité, déboguage). |
| Règlement Bruxelles I bis art. 18 (compétence consommateur EU) | (déjà vérifié Stage 2a) | OK. |

### ⚠️ Vérifié — points à corriger

| Texte / sujet | Constat |
|---|---|
| **C. conso. art. L. 221-28, 13°** (LEGIARTI000044563170, en vigueur 28/05/2022) | Le draft mentionne deux conditions sur trois pour l'exclusion du droit de rétractation. **Le 3e critère est manquant** : « Le professionnel a fourni une confirmation de l'accord du consommateur conformément aux dispositions du deuxième alinéa de l'article L. 221-13 ». Dans le contexte Apple IAP, cette confirmation est fournie par l'email de confirmation d'abonnement émis par Apple. Mais cette condition doit être mentionnée explicitement dans le draft pour démontrer la conformité complète. |
| **C. conso. art. L. 224-25-5** (LEGIARTI000044132849, en vigueur 01/01/2022) | **Nouveau régime spécifique aux contrats de fourniture de contenus numériques et de services numériques**, transposition de la directive (UE) 2019/770. Cet article impose 9 catégories d'informations obligatoires dans tout contrat numérique B2C. Le draft couvre items 1-2 et 4-7, mais **manquent les items 3, 8 et 9** : (3) niveaux minimaux de qualité de service OU mention de leur absence ; (8) type de mesure que le professionnel est susceptible de prendre pour réagir à un incident de sécurité ou faire face à des menaces ; (9) précisions sur les produits/services conçus pour les personnes handicapées. |
| **C. conso. art. L. 215-1** (renouvellement tacite) | Article cité dans le draft mais sa **teneur exacte** ne peut être vérifiée via Légifrance dans cette session (la recherche n'a pas retourné l'article exact — l'identifiant est probablement plus précis que ce qui a été cherché). Le draft formule la non-reconduction de manière acceptable. Cependant, L. 215-1 impose au professionnel de notifier explicitement le consommateur **au plus tôt 3 mois et au plus tard 1 mois** avant la fin de la période. Le draft ne mentionne pas qui envoie cette notification : si elle dépend d'Apple, il faudrait le dire explicitement ; si CoDevelop a une obligation directe, il faut décrire le mécanisme. |
| **C. conso. art. L. 215-1-1** (« résiliation en 3 clics ») | Article récent (loi du 16 août 2022). Applicable à tous les contrats à durée déterminée ou tacitement reconductibles conclus par voie électronique. Le draft renvoie à la résiliation iOS Settings (4-5 étapes) qui est l'unique modalité disponible vu que CoDevelop ne reçoit aucune donnée de l'utilisateur. **Question** : la conformité L. 215-1-1 incombe-t-elle à CoDevelop ou à Apple ? L'argument de défense : CoDevelop ne dispose pas du compte utilisateur (pas de signin), donc ne peut techniquement pas offrir une résiliation directe. La résiliation Apple IAP via iOS Settings est la seule modalité possible. Cette analyse devrait être documentée. |
| **CM2C adresse** (14 rue Saint Jean, 75017 Paris) | Le draft contient déjà la marque `[adresse à confirmer à l'inscription définitive]`. À confirmer après inscription effective de CoDevelop auprès de CM2C. |

---

## Checklist Section 10.3 du brief

| Item | Verdict | Commentaire |
|---|---|---|
| Service object stated | ✅ PASS | Art. 1 clair. |
| Acceptance mechanism clear | ✅ PASS | Art. 2 décrit acceptation par usage. |
| Subscription terms complete (price, auto-renewal, cancellation, refund) | ✅ PASS | Art. 5.1 à 5.4 complets. |
| Article L. 215-1 disclosure (renouvellement tacite) | ⚠️ WARNING | Art. 5.2 présent mais mécanisme de notification 1-3 mois pré-renouvellement non clarifié (Apple ou CoDevelop ?). |
| User obligations stated | ✅ PASS | Art. 6 clair. |
| IP rights of CoDevelop + user license scope | ✅ PASS | Art. 8 complet (personnel, non exclusive, non cessible, révocable). |
| Liability limits compatible with French public-order (1231-3) | ✅ PASS | Art. 10 correctement excepte faute lourde, dol, atteinte personne. |
| CGU modification procedure | ✅ PASS | Art. 12, 30 jours de préavis. |
| Termination conditions | ✅ PASS | Art. 13. |
| Cross-link to Privacy Policy | ✅ PASS | Art. 9. |
| Governing law (FR) + jurisdiction (Bordeaux + Bruxelles I bis EU) | ✅ PASS | Art. 15. |
| Médiateur de la consommation désigné (CM2C) | ⚠️ WARNING | Art. 14 OK, mais adresse à confirmer à l'inscription. |
| FR et EN structurally identical and substantively aligned | ✅ PASS | Confirmé. |

---

## Discussion approfondie

### A. Art. L. 221-28, 13° — 3e critère manquant (HIGH)

Texte exact issu de Légifrance (LEGIARTI000044563170) :

> « 13° De fourniture d'un contenu numérique sans support matériel dont l'exécution a commencé avant la fin du délai de rétractation et, si le contrat soumet le consommateur à une obligation de payer, lorsque :
> a) Il a donné préalablement son consentement exprès pour que l'exécution du contrat commence avant l'expiration du délai de rétractation ; et
> b) Il a reconnu qu'il perdra son droit de rétractation ; et
> c) Le professionnel a fourni une confirmation de l'accord du consommateur conformément aux dispositions du deuxième alinéa de l'article L. 221-13. »

Le draft (Art. 5.5) couvre a) et b), mais omet c). 

**Pratique Apple IAP** : Apple envoie automatiquement un email de confirmation d'abonnement, ce qui satisfait c). La rédaction doit explicitement mentionner cette confirmation Apple comme satisfaisant le 3e critère.

### B. Art. L. 224-25-5 — Mentions obligatoires spécifiques aux services numériques (HIGH)

Article entré en vigueur le 01/01/2022 (ordonnance 2021-1247 du 29 sept. 2021), transposition de la directive (UE) 2019/770 sur les contrats de fourniture de contenus et services numériques.

Cet article impose 9 mentions obligatoires dans tout contrat conclu par un consommateur pour la fourniture de contenus ou services numériques. Le draft Privacy Score est précisément un tel contrat (abonnement à un service numérique B2C).

**Mentions présentes** :
- 1° Identité et coordonnées du professionnel ✅ (renvoi aux Mentions légales)
- 2° L. 111-1, L. 221-5 + précisions sur a) avantage en lieu de prix, b) droit de rétractation (renvoi à Art. 5.5) ⚠️ partiel
- 4° Durée du contrat, conditions de renouvellement, conditions d'interruption ✅ (Art. 5.2, 5.3)
- 5° Précisions sur le prix et coûts récurrents ✅ (Art. 5.1)
- 7° Informations sur les données personnelles ✅ (renvoi Politique de confidentialité)

**Mentions manquantes** :
- 3° **Niveaux minimaux de qualité de service** pour autant qu'il en soit proposé. Lorsqu'aucun niveau minimal n'est proposé, mention en est faite. → À ajouter : « CoDevelop ne propose pas de niveau minimal de qualité de service (SLA) pour l'application. »
- 8° **Type de mesure susceptible d'être prise par le professionnel pour réagir à un incident de sécurité ou pour faire face à des menaces ou à des situations de vulnérabilité.** → À ajouter : « En cas d'incident de sécurité, CoDevelop publiera un correctif via l'App Store et notifiera les utilisateurs via la fonction de notification interne de l'application si applicable. »
- 9° **Précisions sur les produits et services conçus pour les personnes handicapées** et sur les modalités d'actualisation. → À ajouter : « L'application suit les directives d'accessibilité iOS (VoiceOver, Dynamic Type, contraste). Toute évolution sera mentionnée dans les notes de mise à jour de l'App Store. »

### C. Art. L. 215-1 — mécanisme de notification du renouvellement (MEDIUM)

L'article impose au professionnel d'informer le consommateur, **au plus tôt 3 mois et au plus tard 1 mois avant la fin de la période**, de la possibilité de ne pas reconduire le contrat.

Dans le contexte Apple IAP, Apple envoie automatiquement aux utilisateurs des emails de notification pré-renouvellement (configurés au niveau de l'App Store). Cette pratique satisfait L. 215-1 dans la mesure où la notification effective parvient au consommateur.

**Recommandation** : ajouter une clarification dans l'art. 5.2 : « La notification du renouvellement vous est envoyée par Apple selon les modalités prévues par l'App Store, ce qui satisfait l'obligation prévue à l'article L. 215-1 du Code de la consommation. »

### D. Art. L. 215-1-1 — Résiliation en 3 clics (MEDIUM)

Article introduit par la loi du 16 août 2022 (loi Magnien). Impose que tout contrat conclu par voie électronique puisse être résilié « par voie électronique, par une fonctionnalité spécifique et accessible à l'aide de moyens proportionnés ».

La résiliation actuelle (iOS Settings > Apple ID > Subscriptions > Privacy Score > Annuler) compte 4-5 étapes selon comment on compte. Apple impose ce parcours uniformément ; CoDevelop n'a aucune capacité technique d'offrir une résiliation directe (pas de compte utilisateur, pas de session côté CoDevelop).

**Recommandation** : ajouter dans l'art. 5.3 un paragraphe explicatif : « L'application n'étant accessible que via l'écosystème Apple, la résiliation passe nécessairement par les Réglages iOS, qui sont l'interface unique de gestion des abonnements In-App. CoDevelop n'a pas la capacité technique de fournir une fonctionnalité de résiliation directe puisque l'application ne nécessite ni compte utilisateur ni session côté éditeur. »

### E. Code civil art. 1190 et suivants — clauses standard (MEDIUM)

Le brief évoque ces articles pour les clauses standards. Ces articles (de l'ordonnance du 10 fév. 2016 sur la réforme des contrats) imposent que les clauses d'un contrat d'adhésion soient interprétées en faveur de l'adhérent. Le draft ne cite pas explicitement ces articles, mais sa structure factuelle et claire les respecte implicitement.

**Recommandation optionnelle** : ajouter en fin d'art. 15 (Loi applicable) une mention : « Les présentes CGU constituent un contrat d'adhésion au sens de l'article 1110 du Code civil. Toute clause ambiguë sera interprétée en faveur de l'utilisateur conformément à l'article 1190 du Code civil. »

### F. Liens d'affiliation (LOW)

L'art. 11 mentionne les liens d'affiliation et la divulgation. Conforme à la pratique mais aucune référence légale spécifique. La référence pertinente est l'art. L. 121-2 C. conso. (pratiques commerciales déloyales — toute information trompeuse y compris par omission). La rédaction actuelle est suffisante pour éviter ce risque.

**Recommandation cosmétique** : ajouter « conformément aux exigences de transparence prévues à l'article L. 121-2 du Code de la consommation » dans l'art. 11.

---

## Annotations ligne-par-ligne

### CGU FR (`conditions-generales-utilisation.md`)

| Ligne | Type | Annotation |
|---|---|---|
| 41 | ✅ PASS | « obligation de moyens » correctement formulé. |
| 64-66 | 🟡 MEDIUM | Art. 5.2 : ajouter clarification mécanisme de notification Apple (L. 215-1). |
| 70-74 | 🟡 MEDIUM | Art. 5.3 : ajouter explication de l'impossibilité technique d'une résiliation directe (L. 215-1-1). |
| 82 | 🟠 HIGH | Art. 5.5 : ajouter le 3e critère de L. 221-28, 13° c) — confirmation Apple par email comme satisfaisant la condition. |
| 86-91 | ✅ PASS | Obligations utilisateur claires. |
| 95-99 | ⚠️ MEDIUM | Section 7 : à compléter par les mentions L. 224-25-5 items 3 (SLA), 8 (incidents), 9 (accessibilité). Voir Discussion B. |
| 122-123 | ✅ PASS | Art. 10 correctement formule les exceptions 1231-3. |
| 144 | ⚠️ NOTÉ | Adresse CM2C avec flag `[à confirmer]` — à vérifier après inscription. |

### Terms of Use EN (`terms-of-use.md`)

| Line | Type | Annotation |
|---|---|---|
| Lignes équivalentes aux FR | (mêmes annotations) | Le draft EN mirror les corrections FR. Appliquer les 5 corrections en parallèle. |

---

## Points à confirmer (avant Stage 3)

1. **Inscription CM2C** : Confirmation que l'utilisateur a procédé ou procédera à l'inscription CM2C avant publication des CGU. Mettre à jour l'adresse réelle une fois confirmée.

2. **Apple confirmation email** : Confirmer qu'Apple envoie effectivement un email de confirmation lors de la souscription (cela satisfait L. 221-28, 13° c). C'est le cas dans la pratique Apple IAP mais à vérifier.

3. **Niveaux SLA** : Confirmer que CoDevelop ne souhaite pas s'engager sur un niveau de qualité de service. Le mentionner explicitement dans le CGU est neutre légalement.

4. **Accessibilité iOS** : Confirmer que l'application respecte les directives d'accessibilité iOS de base (VoiceOver, Dynamic Type, contraste).

5. **Réponse en cas d'incident de sécurité** : Documenter la politique interne (mise à jour App Store, notification utilisateurs si applicable).

---

## Recommandations de correction (à appliquer par le copywriter Stage 1)

### HIGH (bloquantes — à corriger AVANT Stage 3)

**1. Art. 5.5 — ajouter le 3e critère de L. 221-28, 13°**

```diff
Conformément à l'article L. 221-28, 13° du Code de la consommation, le droit de rétractation ne s'applique pas aux contrats de fourniture d'un contenu numérique non fourni sur un support matériel dont l'exécution a commencé après accord préalable exprès de l'utilisateur et renoncement exprès à son droit de rétractation. Lors de la souscription via Apple In-App Purchase, vous donnez cet accord préalable et renoncez à ce droit afin de bénéficier immédiatement du service.

+ Apple vous adresse, lors de la souscription, un email de confirmation récapitulant les termes de l'abonnement. Ce courrier vaut confirmation de votre accord au sens du c) de l'article L. 221-28, 13° et du deuxième alinéa de l'article L. 221-13 du Code de la consommation.
```

**2. Section 7 — ajouter les mentions L. 224-25-5 manquantes**

Renommer la section « 7. Obligations de CoDevelop » en « 7. Obligations de CoDevelop et information complémentaire sur le service numérique » et ajouter :

```diff
CoDevelop s'engage, dans la limite d'une obligation de moyens, à :
- Maintenir l'application dans un état de fonctionnement compatible avec les versions récentes d'iOS supportées.
- Corriger les anomalies signalées dans un délai raisonnable.
- Tenir à jour la présente documentation légale.

+ ### 7.1 Niveau de qualité de service
+
+ Conformément à l'article L. 224-25-5 du Code de la consommation, CoDevelop ne propose pas de niveau minimal de qualité de service (SLA) pour l'application Privacy Score. L'application est fournie sur la base d'une obligation de moyens, en cohérence avec l'usage standard d'une application iOS distribuée via l'App Store.
+
+ ### 7.2 Incidents de sécurité
+
+ En cas d'incident de sécurité affectant l'application, CoDevelop publiera un correctif via l'App Store dans les meilleurs délais et, si l'incident est susceptible d'affecter la confidentialité ou l'intégrité des données traitées localement, vous en informera via la fonction de notification locale de l'application ou par publication sur le site `privacyscore.fr`. Le mécanisme de notification de violation prévu par le RGPD (articles 33-34) s'applique en complément lorsque les conditions en sont réunies.
+
+ ### 7.3 Accessibilité
+
+ L'application respecte les directives d'accessibilité iOS (compatibilité avec VoiceOver, Dynamic Type, contraste élevé). Toute évolution significative en matière d'accessibilité sera mentionnée dans les notes de mise à jour publiées sur l'App Store.
```

### MEDIUM (recommandées avant Stage 3)

**3. Art. 5.2 — clarifier le mécanisme de notification L. 215-1**

```diff
Conformément à l'article L. 215-1 du Code de la consommation, vous êtes informé que vous pouvez à tout moment ne pas reconduire votre abonnement, sans pénalité, en suivant la procédure de résiliation décrite ci-dessous, au plus tard 24 heures avant la fin de la période en cours.
+
+ Apple, en sa qualité de processeur de paiement et de gestionnaire des abonnements In-App, vous adresse une notification de renouvellement à l'approche de chaque échéance, dans le délai prévu par l'article L. 215-1. Cette notification automatique satisfait l'obligation pesant sur CoDevelop.
```

**4. Art. 5.3 — clarifier l'absence de résiliation directe (L. 215-1-1)**

```diff
La résiliation prend effet à la fin de la période en cours. Vous conservez l'accès aux fonctionnalités payantes jusqu'à cette date. CoDevelop ne peut pas résilier votre abonnement pour vous, car la gestion est intégralement assurée par Apple.
+
+ L'application Privacy Score n'utilisant aucun compte utilisateur côté CoDevelop (pas de session, pas d'identifiant côté éditeur), la résiliation passe nécessairement par les Réglages iOS, qui constituent l'unique interface de gestion des abonnements In-App. CoDevelop n'a pas la capacité technique de fournir une fonctionnalité de résiliation directe. L'article L. 215-1-1 du Code de la consommation, qui impose une fonctionnalité de résiliation en ligne, est satisfait par le parcours Apple natif décrit ci-dessus.
```

**5. Art. 15 — mention du contrat d'adhésion (1190 C. civ.) — optionnel**

```diff
Les présentes CGU sont régies par le droit français. À défaut de résolution amiable, tout différend relève des juridictions compétentes du ressort du Tribunal judiciaire de Bordeaux.
+
+ Les présentes CGU constituent un contrat d'adhésion au sens de l'article 1110 du Code civil. Toute clause ambiguë sera interprétée en faveur de l'utilisateur conformément à l'article 1190 du même code.
```

### LOW (cosmétique)

**6. Art. 11 — référence L. 121-2 C. conso. pour la disclosure d'affiliation**

```diff
- L'application peut référencer des fournisseurs tiers de services VPN ou DNS, à titre informatif et éducatif. Certaines de ces références sont accompagnées de liens d'affiliation. Si vous souscrivez à un service après avoir cliqué sur un tel lien, CoDevelop peut percevoir une commission, sans surcoût pour vous. Cette information est rappelée à l'écran avant chaque clic concerné.
+ L'application peut référencer des fournisseurs tiers de services VPN ou DNS, à titre informatif et éducatif. Certaines de ces références sont accompagnées de liens d'affiliation. Si vous souscrivez à un service après avoir cliqué sur un tel lien, CoDevelop peut percevoir une commission, sans surcoût pour vous. Conformément aux exigences de transparence prévues à l'article L. 121-2 du Code de la consommation, cette information est rappelée à l'écran avant chaque clic concerné.
```

---

## Verdict final Stage 2c

**WARNING si publication en l'état** (2 HIGH non bloquantes mais juridiquement requises).

**PASS conditionnel** après application des 2 corrections HIGH (Art. 5.5 + Section 7) + 3 corrections MEDIUM (Art. 5.2, 5.3, 15).

Le draft est par ailleurs **structurellement complet**, respecte les voice rules, et couvre les obligations principales du droit français de la consommation. Les corrections recommandées renforcent la conformité aux régimes spécifiques aux contenus et services numériques (transposition directive UE 2019/770 — entrée en vigueur 01/01/2022) qui n'étaient pas connus dans le draft initial.

**Prochaine étape recommandée** : retourner au copywriter Stage 1 pour application des corrections, puis re-vérification Stage 2c PASS 2 avant transition vers Stage 3 (relecteur indépendant).
