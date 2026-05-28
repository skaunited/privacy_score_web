# Stage 2b — Rapport de vérification : Politique de confidentialité / Privacy Policy

**Date** : 27 mai 2026
**Vérificateur** : cabinet-avocat:rgpd-data
**Documents vérifiés** :
- `App/Privacy Score/StoreListing/legal/fr/politique-de-confidentialite.md` (v1.0, 1875 mots)
- `App/Privacy Score/StoreListing/legal/en/privacy-policy.md` (v1.0, 1725 mots)

---

## PASS 2 — Re-vérification du 27 mai 2026 (après corrections)

### Verdict final

| Document | Verdict |
|---|---|
| **Politique de confidentialité FR** | ✅ **PASS** |
| **Privacy Policy EN** | ✅ **PASS** |
| **ROPA interne** | ✅ **PASS** (satisfait Art. 30 RGPD) |

**Tous les findings sont résolus.** Le document est prêt pour le Stage 2c (CGU) sans réserve résiduelle bloquante.

### Vérification point par point des 4 corrections MEDIUM

| # | Correction attendue | FR | EN | Statut |
|---|---|---|---|---|
| 1 | Section "Ce qui n'est pas collecté" : ajout réserve temporelle | L31 ✓ | L31 ✓ | ✅ OK |
| 2 | Section IDFA : test de balance d'intérêts explicité | L70 ✓ | L70 ✓ | ✅ OK |
| 3 | Transferts hors UE : clarification chaîne Apple US + décision 2023/1795 | L120 ✓ | L120 ✓ | ✅ OK |
| 4 | Articles LIL : `art. 49 et suivants` → `art. 48 à 56` | L124 ✓ | L124 ✓ | ✅ OK |
| 5 (bonus) | Changelog mis à jour | L175 ✓ | L175 ✓ | ✅ OK |

### Vérification voice rules

| Rule | Résultat |
|---|---|
| Em-dashes (`—`) | 0 dans les 2 documents ✓ |
| Exclamations marks | 0 ✓ |
| « actionable » / « actionnable » | 0 ✓ |
| FR utilise `vous` | ✓ |
| EN utilise US English | ✓ |

### Évaluation du ROPA-codevelop.md

**Fichier** : `App/Privacy Score/StoreListing/internal/ROPA-codevelop.md` (17 724 octets)

**Structure vérifiée** :

| Section | Présence | Évaluation |
|---|---|---|
| Informations générales (responsable, contact, DPO) | ✅ | Conforme art. 30.1.a, b RGPD |
| 8 fiches de traitement | ✅ (8/8) | Couvrent l'ensemble des traitements décrits dans la Politique de confidentialité publiée |
| Pour chaque fiche : finalité, base légale, catégories de personnes, catégories de données, destinataires, sous-traitants, transferts, durée, mesures de sécurité | ✅ | Conforme art. 30.1.c → 30.1.g RGPD |
| LIA (test de mise en balance) pour l'IDFA | ✅ | Conforme aux lignes directrices EDPB WP 217 modernisées et fiches CNIL |
| Analyse AIPD (non requise) | ✅ | Justification conforme art. 35 RGPD + liste CNIL |
| Synthèse sous-traitants avec localisation et DPA | ✅ | Conforme art. 28 RGPD |
| Procédures d'exercice des droits | ✅ | Couvre les 6 droits (15-22 RGPD) |
| Procédure de notification de violation | ✅ | Conforme art. 33-34 RGPD |
| Cadence de révision (6 mois) | ✅ | Bonne pratique |

**Conclusion ROPA** : Le registre est **substantiellement complet** et **satisfait l'art. 30 RGPD** pour une micro-EI. La structure suit les recommandations CNIL. La LIA pour l'IDFA est documentée. L'analyse AIPD négative est motivée. Les sous-traitants sont identifiés. Les procédures internes (exercice des droits, notification violation) sont prêtes.

Recommandation pour l'utilisateur : ce ROPA doit être révisé tous les 6 mois et mis à jour à chaque évolution majeure de l'application. La prochaine révision est fixée au **27 novembre 2026**.

### Nouveaux findings introduits par les corrections

**Aucun.** Les corrections n'ont pas modifié d'autres sections, ni introduit de référence juridique non vérifiée, ni cassé l'alignement FR/EN. Voice rules respectées.

### Verdict de transition

✅ **READY FOR STAGE 2c** (CGU via cabinet-avocat:droit-consommation).

Le Stage 3 (relecteur) confirmera ce verdict après examen indépendant des 3 documents finalisés.

---

## PASS 1 — Premier passage de vérification (historique)



---

## Synthèse

| Métrique | Valeur |
|---|---|
| **Verdict global FR** | ⚠️ WARNING (0 CRITICAL, 1 HIGH, 4 MEDIUM, 1 LOW) |
| **Verdict global EN** | ⚠️ WARNING (mêmes corrections, alignées) |
| Points bloquants (CRITICAL) | **0** |
| Points à corriger (HIGH) | **1** (interne CoDevelop, pas dans le document) |
| Points à améliorer (MEDIUM) | **4** |
| Points cosmétiques (LOW) | **1** |

Le document est **substantiellement conforme** au RGPD et à la LIL. Les findings concernent essentiellement la précision rédactionnelle et une obligation interne (ROPA) qui ne se publie pas dans la politique elle-même.

Verdict général : **PASS WITH CAVEAT** après application des 4 corrections MEDIUM. Le point HIGH est une action interne pour CoDevelop, indépendante du document publié.

---

## Vérifications Légifrance — résultats

### ✅ Vérifié OK

| Texte cité | Résultat |
|---|---|
| RGPD art. 4.7 (responsable du traitement) | Référence correcte. La personne physique « Skander BAHRI » est bien le responsable, et non « CoDevelop » qui n'est qu'un nom commercial. |
| RGPD art. 6.1.b (exécution du service) | Base légale appropriée pour le traitement du rapport NDJSON et des analyses dérivées. |
| RGPD art. 6.1.f (intérêt légitime — IDFA) | Base légale acceptable pour l'IDFA local. Voir Discussion ci-dessous sur le test de balance d'intérêts. |
| RGPD art. 9 (catégories particulières) | Non applicable. Correctement implicite. |
| RGPD art. 12.3 (délai 1 mois) | Référence correcte. |
| RGPD art. 13 (information) | Toutes les rubriques obligatoires sont couvertes (voir checklist 10.2). |
| RGPD art. 15-22 (droits) | Les six droits cités sont les bons : accès, rectification, effacement, limitation, portabilité, opposition. |
| RGPD art. 22 (décision automatisée) | Correctement nié. |
| RGPD art. 37 (DPO) | Justification correcte : aucun des 3 critères de l'art. 37.1 n'est rempli (pas d'autorité publique, pas de surveillance systématique à grande échelle, pas de catégories particulières à grande échelle). |
| RGPD art. 77 (réclamation autorité de contrôle) | Coordonnées CNIL exactes (3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07, tél 01 53 73 22 22). |
| LIL art. 82 (cookies strictly-necessary) | Référence correcte. L'art. 82, II de la loi 78-17 modifiée exempte du consentement préalable les cookies « ayant pour finalité exclusive de permettre ou faciliter la communication par voie électronique » ou « strictement nécessaires à la fourniture d'un service de communication en ligne ». |
| LCEN art. 6 II (conservation 1 an par hébergeur) | Référence correcte. Durée légale d'un an pour les données techniques (URL, IP, identifiants) imposée par le décret n° 2021-1363 du 20 oct. 2021. |

### ⚠️ Vérifié avec nuance

| Texte cité | Constat |
|---|---|
| LIL « art. 49 et suivants » | Inexact. Les droits des personnes sont couverts par les articles 48 à 56 de la LIL modifiée (Chapitre III « Obligations incombant au responsable du traitement et droits des personnes concernées »). Plus précisément : art. 48 (droit d'opposition), art. 49 (droit d'accès), art. 50 (droit de rectification), art. 51 (droit à l'effacement), art. 53 (droit à la limitation), art. 55 (droit à la portabilité). Préférer « articles 48 et suivants » ou citer les articles précis. |
| Data Privacy Framework UE-USA (statut au 27 mai 2026) | Toujours en vigueur au 27 mai 2026. Le Tribunal de l'UE a rejeté l'action en annulation le 3 septembre 2025 (affaire T-553/23). Aucune décision "Schrems III" n'a invalidé le DPF à date. La mention reste donc correcte, mais sera à monitorer (NOYB a annoncé un nouvel appel possible). |
| RGPD art. 30 (registre interne — NON CITÉ dans le document) | **Manquant**. Voir Discussion. |

---

## Checklist Section 10.2 du brief

| Item | Verdict | Commentaire |
|---|---|---|
| Data controller identity present (Art. 13.1.a) | ✅ PASS | Skander BAHRI / CoDevelop, contact `support@privacyscore.fr`. |
| DPO presence/absence disclosed (Art. 13.1.b) | ✅ PASS | « Aucun DPO n'est désigné » avec justification basée sur art. 37 RGPD. |
| Each processing purpose has a stated legal basis (Art. 6) | ✅ PASS | Chaque catégorie de données (1-8) a sa base : art. 6.1.b pour le service, art. 6.1.f pour l'IDFA. |
| Categories of data accurately listed; no invented categories | ✅ PASS | 8 catégories listées, fidèles à `APP_RECAP.md`. |
| Recipients accurately listed | ✅ PASS | « Aucun » sauf Apple pour la facturation. |
| Transfers outside the EU disclosed | ⚠️ WARNING | Mention Apple (Irlande, UE) + Apple US via DPF. Pourrait préciser que CoDevelop NE fait PAS de transfert hors UE elle-même ; les transferts Apple → Apple US relèvent du contrôle d'Apple, pas de CoDevelop. |
| Retention duration stated per category | ✅ PASS | Chaque catégorie a une durée explicite (jusqu'à import nouveau / désinstallation / purge automatique). |
| User rights enumerated AND exercise mechanism | ✅ PASS | Les 6 droits sont enumérés ; mécanisme d'exercice clair (l'app + email pour les cas particuliers). |
| Right to lodge CNIL complaint with contact | ✅ PASS | Coordonnées CNIL exactes. Pourrait mentionner aussi la possibilité de saisir l'autorité de son pays de résidence pour les EU non-FR (déjà couvert par RGPD art. 77 implicitement). |
| Absence of automated decision-making / profiling stated | ✅ PASS | Section dédiée. |
| "What we don't collect" section present and faithful | ✅ PASS | Section très lisible. Voir cependant le finding MEDIUM sur la robustesse temporelle. |
| No factually false claim verifiable by Section 2 of brief | ✅ PASS | Conforme à `APP_RECAP.md` (architecture on-device, IDFA stocké local, etc.). |
| FR and EN versions structurally identical and substantively aligned | ✅ PASS | Confirmé : même ordre des 8 catégories, même contenu substantiel. |

---

## Discussion approfondie

### A. Registre interne (RGPD art. 30) — point HIGH, mais interne

L'article 30.5 du RGPD dispense les organismes de moins de 250 employés de la tenue d'un registre, **sauf** si :
1. Le traitement est susceptible de comporter un risque pour les droits et libertés des personnes concernées,
2. Le traitement n'est **pas occasionnel** (occasional),
3. Le traitement inclut des catégories particulières (art. 9) ou des données pénales (art. 10).

Pour CoDevelop :
- < 250 employés : ✅ (1 personne)
- Pas occasionnel : ❌ — le traitement est **continu** dès qu'un utilisateur installe et utilise l'app (chaque import est un traitement, l'IDFA persistant est un traitement permanent). L'exemption tombe.
- Catégories particulières : non.

**Conclusion** : CoDevelop **DOIT** tenir un registre interne des traitements (ROPA — Records of Processing Activities), même en tant que micro-EI. Ce registre n'est pas publié, mais doit être disponible sur demande de la CNIL (art. 30.4 RGPD). 

⚠️ **Cette obligation N'EST PAS un finding de rédaction** : elle n'a pas à apparaître dans la Politique de confidentialité (elle est interne). C'est un finding pour l'action de l'utilisateur en dehors du document.

**Recommandation** : créer un fichier `internal/ROPA-codevelop.md` documentant chacun des 8 traitements listés dans la Politique avec : finalité, base légale, catégories de données, catégories de personnes concernées, destinataires, transferts, durée de conservation, mesures de sécurité. La CNIL fournit un modèle gratuit.

### B. Intérêt légitime pour l'IDFA (RGPD art. 6.1.f)

L'utilisation de l'art. 6.1.f exige un test de balance d'intérêts (LIA, Legitimate Interest Assessment), conformément aux lignes directrices EDPB et CNIL.

L'IDFA est stocké localement, uniquement pour calculer la date de première observation. Aucune transmission, aucun usage commercial.

Le test :
- **Intérêt légitime** : éducation de l'utilisateur sur son exposition à la publicité (intérêt légitime à fournir une analyse pédagogique transparente).
- **Nécessité** : oui — sans persister l'IDFA et sa date de première observation, on ne peut calculer la durée d'exposition.
- **Mise en balance** : l'utilisateur peut retirer l'IDFA via Réglages iOS > Confidentialité et sécurité > Suivi (App Tracking Transparency) ou réinitialiser son IDFA. Le contrôle est entièrement entre ses mains.

Le test passe. **PASS**.

⚠️ Recommandation rédactionnelle : la section IDFA mentionne déjà la possibilité de réinitialisation. Pourrait être renforcée en mentionnant explicitement le test de mise en balance dans une phrase ou deux.

### C. « What we don't collect » — risque de promesse à terme

La liste est très spécifique (Firebase, Sentry, Amplitude, Mixpanel, Segment, PostHog, Crashlytics, autres SDK comparables). Si CoDevelop ajoute un SDK plus tard (par exemple Sentry pour le crash reporting), cette phrase deviendrait factuellement fausse, ce qui poserait un risque RGPD (information trompeuse — art. 12.1) et potentiellement consumériste.

**Recommandation** : ajouter une phrase de réserve temporelle :
> « Cet engagement reflète la version 1.0 de l'application. Toute évolution du périmètre des traitements sera notifiée et la présente politique sera mise à jour avant l'entrée en vigueur du nouveau périmètre. »

Cette phrase est partiellement présente dans la section « Modifications de la présente politique » (line 162-164) mais devrait être référencée directement dans la section « Ce qui n'est pas collecté » pour solidité juridique.

### D. Transferts hors UE — clarté

Le document mentionne « Apple, en Irlande, soumis aux clauses contractuelles types et au cadre Data Privacy Framework UE-USA pour ses traitements transatlantiques ». Cette formulation pourrait induire en erreur :

- Apple Distribution International Limited est en Irlande (EU member state). La relation contractuelle CoDevelop-Apple est intra-UE.
- Les sous-traitances Apple Ireland → Apple US sont gérées par Apple, pas par CoDevelop. CoDevelop n'a aucun contrôle, ni aucun rôle, dans ces sous-traitances.

**Recommandation** : clarifier la formulation pour éviter la confusion sur la chaîne de responsabilités. Suggérée :
> « CoDevelop ne transmet aucune donnée à un tiers situé hors de l'Union européenne pour son propre compte. Apple Distribution International Limited, qui traite les données de paiement pour notre compte, est établie en Irlande. Les éventuels transferts ultérieurs vers les États-Unis (par exemple, vers Apple Inc. à Cupertino) relèvent de la responsabilité d'Apple et sont encadrés par le cadre Data Privacy Framework UE-USA validé par la Commission européenne le 10 juillet 2023. »

### E. LIL articles 48-56 — précision

Remplacer « articles 49 et suivants de la loi Informatique et Libertés » par « articles 48 et suivants ». Mieux : citer les articles pertinents (48 opposition, 49 accès, 50 rectification, 51 effacement, 53 limitation, 55 portabilité).

### F. « Rédigée en français clair » — tone

Cette phrase liminaire (« Nous avons choisi de la rédiger en français clair, parce qu'une application qui analyse votre vie privée doit elle-même mériter votre confiance ») est conforme à l'article 12.1 du RGPD qui exige une rédaction « concise, transparente, intelligible, facilement accessible » et « formulé en termes clairs et simples ». La phrase est même une affirmation positive de cette obligation. **À conserver**. ✅

---

## Annotations ligne-par-ligne

### Politique de confidentialité FR (`politique-de-confidentialite.md`)

| Ligne | Type | Annotation |
|---|---|---|
| 17 | ✅ LOW | « Nous avons choisi de la rédiger en français clair » — Bonne formulation, conforme art. 12.1 RGPD. Conserver. |
| 22-29 | 🟢 PASS | Liste « Ce qui n'est pas collecté ». Voir D pour la suggestion d'ajout d'une réserve temporelle. |
| 41 | ✅ PASS | DPO non désigné, justification correcte. |
| 64-73 | 🟡 MEDIUM | Section IDFA. Test de balance d'intérêts implicite ; renforcer par une phrase explicite. |
| 73 | ✅ PASS | Note CNIL : excellente formulation. |
| 116 | 🟡 MEDIUM | Section « Destinataires et transferts hors UE ». Reformuler selon D pour clarifier que la chaîne Apple US est la responsabilité d'Apple. |
| 122 | 🟡 MEDIUM | « articles 49 et suivants » → « articles 48 et suivants ». |
| 152-154 | ✅ PASS | Décisions automatisées correctement niées. |
| 156-160 | ✅ PASS | Section Sécurité. Bonne formulation. |

### Privacy Policy EN (`privacy-policy.md`)

| Line | Type | Annotation |
|---|---|---|
| 17 | ✅ LOW | « we chose to write it in plain English » — conforme art. 12.1 GDPR. Keep. |
| 22-29 | 🟢 PASS | Mirror FR. Same recommendation on temporal reservation. |
| 41 | ✅ PASS | Mirror FR. |
| 64-73 | 🟡 MEDIUM | Same recommendation as FR on IDFA balance-of-interests phrase. |
| 116 | 🟡 MEDIUM | Same recommendation on transfers wording. |
| 122 | 🟡 MEDIUM | Update « Articles 49 et seq. of the French Data Protection Act » → « Articles 48 et seq. ». |
| 152-154 | ✅ PASS | Automated decisions correctly denied. |

---

## Points à confirmer (avant Stage 3)

1. **ROPA interne** : Confirmer auprès de l'utilisateur que CoDevelop **maintiendra** un registre interne des activités de traitement (art. 30 RGPD) en dehors du document publié. À ouvrir dans un fichier séparé `internal/ROPA-codevelop.md` (modèle CNIL disponible gratuitement).

2. **Data Privacy Framework — monitoring** : Confirmer que CoDevelop s'engage à mettre à jour la politique dans un délai raisonnable si le DPF est invalidé (Schrems III hypothétique).

3. **Adresse de réclamation pour les non-résidents FR** : Suggérer d'ajouter dans la section CNIL une mention pour les utilisateurs EU non-FR (« Si vous résidez dans un autre État membre de l'UE, vous pouvez également contacter l'autorité de contrôle de votre pays de résidence »). Conforme RGPD art. 77.

4. **ATT et IDFA** : Vérifier la cohérence avec ce que dit la fiche App Privacy de l'App Store Connect (qui devra refléter exactement ce qui est dans cette Politique). Apple peut rejeter une fiche si elle est incohérente avec la politique.

---

## Recommandations de correction (à appliquer par le copywriter Stage 1)

### MEDIUM (recommandées avant Stage 3)

**1. Section "Ce qui n'est pas collecté" — ajout d'une réserve temporelle**

```diff
- Aucun profilage, aucune prise de décision automatisée à votre égard.
+ Aucun profilage, aucune prise de décision automatisée à votre égard.
+
+ Cette liste reflète la version 1.0 de l'application. Toute évolution future qui modifierait le périmètre des traitements sera signalée dans l'application avant son entrée en vigueur, et la présente politique sera mise à jour avec une nouvelle version.
```

**2. Section IDFA — test de balance explicite**

```diff
- **Base légale** : intérêt légitime à fournir une analyse pédagogique de votre exposition publicitaire (art. 6.1.f). Aucune transmission à un tiers n'est faite.
+ **Base légale** : intérêt légitime à fournir une analyse pédagogique de votre exposition publicitaire (art. 6.1.f RGPD). Cet intérêt est mis en balance avec votre droit fondamental à la protection des données : aucune transmission à un tiers n'est faite, et vous gardez le contrôle complet via les réglages iOS (App Tracking Transparency, réinitialisation de l'identifiant publicitaire).
```

**3. Section "Destinataires et transferts hors UE" — clarification**

```diff
- Les données traitées par l'application **ne sont pas transmises** à des tiers, à l'exception du flux limité décrit ci-dessus pour la facturation (Apple, en Irlande, soumis aux clauses contractuelles types et au cadre `Data Privacy Framework` UE-USA pour ses traitements transatlantiques).
-
- Aucun transfert hors UE n'est réalisé par CoDevelop pour son propre compte.
+ CoDevelop ne transmet aucune donnée à un tiers situé hors de l'Union européenne pour son propre compte.
+
+ Apple Distribution International Limited, qui traite les données de paiement pour le compte de CoDevelop, est établie en Irlande (Union européenne). Les éventuels transferts ultérieurs vers les États-Unis (notamment vers Apple Inc. à Cupertino) relèvent de la seule responsabilité d'Apple et sont encadrés par le cadre EU-US Data Privacy Framework validé par la Commission européenne le 10 juillet 2023 (décision d'adéquation 2023/1795). La politique de confidentialité d'Apple, accessible à `https://www.apple.com/legal/privacy/`, régit ces traitements.
```

**4. Référence LIL — précision**

```diff
- Conformément aux articles 15 à 22 du RGPD et aux articles 49 et suivants de la loi Informatique et Libertés (loi n° 78-17 du 6 janvier 1978 modifiée), vous disposez des droits suivants :
+ Conformément aux articles 15 à 22 du RGPD et aux articles 48 à 56 de la loi Informatique et Libertés (loi n° 78-17 du 6 janvier 1978 modifiée), vous disposez des droits suivants :
```

### Bonus (LOW — optionnel)

**5. Réclamation aux autorités étrangères (post-art. 77 RGPD)**

```diff
3 place de Fontenoy
TSA 80715
75334 PARIS CEDEX 07
Téléphone : 01 53 73 22 22
Site internet : `https://www.cnil.fr`
+
+Si vous résidez dans un autre État membre de l'Union européenne, vous pouvez également saisir l'autorité de contrôle de votre pays de résidence.
```

---

## Verdict final Stage 2b

**PASS WITH CAVEAT** après application des 4 corrections MEDIUM et de la recommandation BONUS.

Point HIGH (ROPA interne) n'est pas une correction du document mais une action interne pour CoDevelop, à reporter dans les Open Questions du Session log.

Le document est par ailleurs **structurellement complet**, respecte les voice rules (zero em-dash, zero exclamation, zero « actionable »), et constitue un exemple solide de Privacy Policy honnête pour une application privacy-first.

**Prochaine étape recommandée** : retourner au copywriter Stage 1 pour application des 4 corrections MEDIUM, puis re-soumettre au Stage 2b (PASS 2) avant transition vers Stage 2c (CGU via cabinet-avocat:droit-consommation).
