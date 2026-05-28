# Stage 2a — Rapport de vérification : Mentions légales / Legal Notice

**Date** : 27 mai 2026
**Vérificateur** : cabinet-avocat:droit-affaires
**Documents vérifiés** :
- `App/Privacy Score/StoreListing/legal/fr/mentions-legales.md` (v1.0)
- `App/Privacy Score/StoreListing/legal/en/legal-notice.md` (v1.0)

---

## PASS 2 — Re-vérification du 27 mai 2026 (après corrections)

### Verdict final

| Document | Verdict |
|---|---|
| **Mentions légales FR** | ✅ **PASS WITH CAVEAT** |
| **Legal Notice EN** | ✅ **PASS WITH CAVEAT** |

Le caveat unique = absence de numéro de téléphone éditeur, **risque légal explicitement accepté par l'utilisateur** (voir section dédiée ci-dessous).

### Vérification des 4 corrections appliquées

| # | Correction attendue | Lieu (ligne FR / EN) | Statut | Commentaire |
|---|---|---|---|---|
| 1 | LCEN art. 6 → art. 1-1 (+ SREN 2024) | FR L78 / EN L78 | ✅ OK | Référence correcte. Mention explicite de la loi n° 2024-449 du 21 mai 2024. Bonus : ajout de l'article 6 II pour la conservation des données techniques, ce qui couvre le « Signaler un contenu » sur le double registre (identification + conservation). |
| 2 | Hébergeur : note absence téléphone Hostinger | FR L45 / EN L45 | ✅ OK | Formulation honnête et factuelle. Distingue le téléphone (non publié) du chat 24/7 (disponible). Conforme à l'obligation de transparence sur l'hébergeur (LCEN art. 1-1, 4°). |
| 3 | Apple : directive 2000/31/CE → DSA (UE 2022/2065) | FR L56 / EN L56 | ✅ OK | Formulation correcte : « plateforme de distribution au sens du Règlement (UE) 2022/2065 du 19 octobre 2022 (Digital Services Act, applicable depuis le 17 février 2024) ». Reflète exactement le nouveau cadre juridique applicable à l'App Store. |
| 4 | Bruxelles I bis : préciser art. 18 | FR L74 / EN L74 | ✅ OK | Inclusion correcte : « notamment son article 18 relatif à la compétence en matière de contrats conclus par les consommateurs ». L'article 18 est bien le texte de référence pour la compétence des juridictions du domicile du consommateur en B2C UE. |
| 5 (bonus) | Changelog mis à jour | FR L84 / EN L84 | ✅ OK | L'entrée v1.0 documente les corrections appliquées et cross-référence ERRORS.md pour la décision email-only. Bonne pratique de traçabilité. |

### Alignement FR ↔ EN

Vérification structurelle :
- Même nombre de sections (10 sections de contenu + frontmatter + changelog) : ✅
- Même ordre des sections : ✅
- Contenu substantiellement équivalent par section : ✅
- Citations juridiques alignées (mêmes articles cités dans les mêmes ordres) : ✅
- Aucune divergence sémantique introduite par les corrections : ✅

### Risque accepté : téléphone éditeur manquant (LCEN art. 1-1, 1°)

**Texte applicable** : LCEN art. 1-1, 1° (en vigueur depuis 23/05/2024) — « S'il s'agit de personnes physiques, leurs nom, prénoms, domicile **et numéro de téléphone** ».

**Constat factuel** : Le draft fournit nom, prénoms, domicile (9 rue de Condé, 33000 Bordeaux), email (support@privacyscore.fr), mais PAS de numéro de téléphone. La lettre du texte n'est pas respectée.

**Évaluation du risque légal** :

| Dimension | Niveau | Justification |
|---|---|---|
| Risque procédural (sanction directe DGCCRF) | 🟡 MEDIUM-LOW | Possible avertissement DGCCRF, mais sanction effective rarement appliquée pour une micro-EI sans antécédent. Pas de seuil minimal d'amende fixe à l'art. 1-1 lui-même (les sanctions LCEN sont à l'art. 6-VI mais ne couvrent pas explicitement l'art. 1-1 post-SREN — ambiguïté législative à confirmer par jurisprudence). |
| Risque civil (litige contractuel) | 🟠 MEDIUM | Un consommateur en litige peut arguer que l'éditeur est inaccessible. Risque de tirer une procédure défavorable (référé, ordonnance de mise en demeure). |
| Risque réputationnel | 🟢 LOW | Le contact email est jugé suffisant par la majorité du public, surtout pour un service digital. |
| Risque administratif (signalement CNIL / DGCCRF) | 🟡 MEDIUM-LOW | Une plainte tierce pourrait inclure cette non-conformité parmi ses griefs, mais ne suffirait pas isolément à fonder une décision. |

**Risque global agrégé** : 🟡 **MEDIUM-LOW**

**Recommandation pour les sessions futures (à reporter dans Open questions)** :
1. Revoir la décision tous les 6 mois.
2. Si le trafic ou les litiges augmentent, acquérir un numéro VoIP dédié (OnOff, RingOver, Aircall — coût ~€5-15/mois).
3. Documenter explicitement dans le registre interne RGPD de CoDevelop la décision d'email-only et sa justification (proportionnalité avec la taille de l'activité).

### Nouveaux findings introduits par les corrections

**Aucun**. Les corrections sont chirurgicales, n'ont pas modifié le reste de la structure, n'ont pas introduit de nouvelle référence juridique non vérifiée. Voice rules toujours respectées (zero em-dash, zero exclamation, zero « actionable »).

### Verdict de transition

✅ **READY FOR STAGE 2b** (Privacy Policy via cabinet-avocat:rgpd-data).

Le Stage 3 (relecteur) re-marquera le risque accepté dans son verdict PASS/FAIL final mais ne devrait pas bloquer la publication si l'utilisateur confirme à nouveau l'acceptation lors du compte-rendu final.

---

## PASS 1 — Premier passage de vérification (historique)



---

## Synthèse

| Métrique | Valeur |
|---|---|
| **Verdict global FR** | ⚠️ WARNING (2 corrections CRITICAL + 4 HIGH avant publication) |
| **Verdict global EN** | ⚠️ WARNING (mêmes corrections, alignées) |
| Points bloquants (CRITICAL) | **2** |
| Points à corriger (HIGH) | **4** |
| Points à améliorer (MEDIUM/LOW) | **3** |

**Ne pas publier en l'état.** Les findings CRITICAL doivent être corrigés avant validation par le relecteur-juriste (Stage 3).

---

## Vérifications Légifrance — résultats

### ✅ Vérifié OK

| Texte cité | LégiFrance ID | Statut | Commentaire |
|---|---|---|---|
| Code de commerce art. L. 526-22 (statut EI) | LEGIARTI000049048964 | En vigueur depuis 28/01/2024 | La citation est correcte. L'article définit bien l'entrepreneur individuel et la séparation du patrimoine professionnel et personnel. |
| CPI art. L. 335-2 (contrefaçon) | LEGIARTI000006279167 | En vigueur depuis 05/06/2016 | La citation est correcte. Peines : 3 ans + 300 000 €, ou 7 ans + 750 000 € en bande organisée. |

### ❌ Vérifié NON CONFORME

| Texte cité dans le draft | Constat | Action |
|---|---|---|
| « article 6 de la loi n° 2004-575 du 21 juin 2004 » | **DÉPASSÉ.** La loi SREN du 21 mai 2024 (loi n° 2024-449) a renuméroté l'obligation d'identification de l'éditeur : elle se trouve désormais à l'**Article 1-1** de la LCEN (en vigueur depuis 23/05/2024 — LEGIARTI000049568614). L'ancien Article 6 LCEN couvre désormais uniquement la responsabilité des hébergeurs / FAI et l'obligation de conservation des données techniques (art. 6, II LCEN, anciennement art. 6-II). | Remplacer **toutes** les références à « article 6-III LCEN » par « article 1-1 LCEN » dans les deux langues. |
| « numéro de téléphone et l'adresse de courrier électronique » (paraphrase implicite via email-only) | **DÉPASSÉ.** L'art. 1-1, 1° de la LCEN (post-SREN) exige expressis verbis pour les personnes physiques : « leurs nom, prénoms, domicile **et numéro de téléphone** ». Le téléphone est désormais une mention **obligatoire**, pas optionnelle. L'email reste utile mais ne suffit plus à lui seul. | Ajouter un numéro de téléphone joignable. À défaut, mode dégradé : invoquer une exception (par exemple non-professionnel — Art. 1-1, II LCEN — qui ne s'applique pas ici puisque CoDevelop édite à titre professionnel). |
| « directive 2000/31/CE » | **IMPRÉCIS.** La référence à Apple comme « distributeur au sens de la directive 2000/31/CE » est inexacte. La directive sur le commerce électronique parle de « services de la société de l'information » et d'« intermédiaires » (hébergeur, cache, mere conduit). Apple est plus précisément qualifiable de « plateforme de partage » au sens du **Règlement (UE) 2022/2065 (DSA)** depuis fév. 2024. | Reformuler : « Apple agit en qualité de plateforme de distribution au sens du Règlement (UE) 2022/2065 (Digital Services Act, applicable depuis le 17 février 2024). » |

### ⚠️ Vérifié à confirmer

| Texte cité | Constat |
|---|---|
| « Règlement (UE) n° 1215/2012 (Bruxelles I bis) » | OK comme référence générale. Pour plus de précision, citer l'**article 18** de Bruxelles I bis qui traite spécifiquement de la compétence en matière de contrats conclus par les consommateurs. |
| Article R. 526-27 C. com. (non cité dans le draft mais applicable) | R. 526-27 impose que la dénomination de l'EI **incorpore** son nom + les mots « entrepreneur individuel » ou « EI ». Vérifier que les documents bancaires, factures et correspondances officielles utilisent bien « Skander BAHRI EI » ou « Skander BAHRI entrepreneur individuel ». Si CoDevelop figure sur les factures comme nom commercial, le format complet « Skander BAHRI EI, exerçant sous le nom commercial CoDevelop » est recommandé. |

---

## Checklist Section 10.1 du brief

| Item | Verdict | Commentaire |
|---|---|---|
| Identification éditeur complète (nom, prénom, raison commerciale, adresse, SIREN, contact, APE/NAF) | ⚠️ WARNING | Tout est présent sauf le **téléphone** désormais requis par LCEN art. 1-1 (post-SREN). |
| Mention explicite "entrepreneur individuel" | ✅ PASS | Correctement formulé : « entrepreneur individuel exerçant sous le nom commercial CoDevelop ». |
| Informations hébergeur présentes (HOSTINGER operations UAB + adresse Vilnius + contact) | ⚠️ WARNING | Nom et adresse OK. Manque le **téléphone de l'hébergeur** (LCEN art. 1-1, 4° l'exige). Hostinger ne publie pas de téléphone direct ; à défaut, indiquer l'URL du support 24/7 et reconnaître l'absence de numéro téléphonique direct. |
| Directeur de la publication nommé | ✅ PASS | Skander BAHRI explicitement désigné. |
| Mention propriété intellectuelle présente | ✅ PASS | Art. L. 335-2 et s. CPI correctement cité. |
| APE/NAF code (62.01Z) | ✅ PASS | Correct. |
| TVA intracom (assujetti, FR75 852 583 558) | ✅ PASS | Correct, mention explicite « assujetti à la TVA ». |
| Loi applicable et juridiction | ⚠️ WARNING | Droit français + Bordeaux + Bruxelles I bis. Pour Bruxelles I bis, préciser l'art. 18 pour la compétence consommateur. |
| Liens vers Politique de confidentialité et CGU | ✅ PASS | Présents. |
| Versions FR et EN alignées | ✅ PASS | Structure identique, contenu équivalent. |

---

## Annotations ligne-par-ligne

### Mentions légales FR (`mentions-legales.md`)

| Ligne | Type | Annotation |
|---|---|---|
| 29 | 🔴 CRITICAL | Ligne « Contact : `support@privacyscore.fr` ». Manque le numéro de téléphone exigé par LCEN art. 1-1, 1° (post-SREN, mai 2024). Ajouter : « Téléphone : [numéro à fournir par l'utilisateur] ». |
| 31 | ⚠️ MEDIUM | « article L. 526-22 du Code de commerce » — citation correcte. Optionnel : ajouter aussi R. 526-27 pour mentionner la dénomination « Skander BAHRI EI ». |
| 41-47 | 🟠 HIGH | Section Hébergeur. Manque le téléphone. Hostinger ne publie pas de numéro direct ; ajouter une note : « Hostinger ne fournit pas de numéro téléphonique public ; le support est joignable 24 h / 24 via chat à `hostinger.com`. » |
| 56 | 🟠 HIGH | « directive 2000/31/CE » — référence dépassée pour qualifier Apple comme plateforme. Remplacer par « Règlement (UE) 2022/2065 (DSA) ». |
| 74 | 🟡 MEDIUM | « Règlement (UE) n° 1215/2012 (Bruxelles I bis) » — préciser : « notamment l'article 18 du Règlement (UE) n° 1215/2012 relatif à la compétence en matière de contrats conclus par les consommateurs ». |
| 78 | 🔴 CRITICAL | « Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 » — référence dépassée. L'obligation d'identification est désormais à l'**article 1-1** de la LCEN. L'article 6 actuel concerne désormais la responsabilité des hébergeurs et la conservation des données techniques. Remplacer. |

### Legal Notice EN (`legal-notice.md`)

| Line | Type | Annotation |
|---|---|---|
| 29 | 🔴 CRITICAL | Same as FR line 29: phone number missing per LCEN Art. 1-1, 1° (post-SREN, May 2024). |
| 31 | ⚠️ MEDIUM | « Article L. 526-22 of the French Commercial Code » — correct citation. |
| 41-47 | 🟠 HIGH | Host section: phone missing. Same fix as FR. |
| 56 | 🟠 HIGH | « Directive 2000/31/EC » — outdated to qualify Apple as platform. Replace with « Regulation (EU) 2022/2065 (DSA) ». |
| 74 | 🟡 MEDIUM | Specify « notably Article 18 of Regulation (EU) No 1215/2012 on jurisdiction in consumer contracts ». |
| 78 | 🔴 CRITICAL | « Article 6 of French Law No. 2004-575 of June 21, 2004 » — outdated. Replace with **Article 1-1** of the LCEN (post-SREN, May 2024). The current Article 6 deals only with host liability and technical-data retention. |

---

## Points à confirmer (avant Stage 3)

1. **Numéro de téléphone (utilisateur)** : Skander BAHRI doit fournir un numéro de téléphone joignable pour LCEN art. 1-1. Sans cela, les Mentions légales ne sont pas conformes. Une exception (non-professionnel) ne s'applique pas ici (CoDevelop édite à titre professionnel : SIREN actif, abonnement payant, code NAF 62.01Z).

2. **Mention CNIL — non requise** : Confirmation que le numéro de déclaration CNIL n'est PAS requis dans les Mentions légales pour CoDevelop. Justification : CoDevelop n'a aucune obligation de déclaration préalable depuis l'entrée en vigueur du RGPD (25 mai 2018, fin du régime déclaratif). Les obligations actuelles sont la tenue d'un registre interne (art. 30 RGPD) et la disponibilité de la politique de confidentialité, déjà couverts par le document Privacy Policy.

3. **DGCCRF — non requise** : Pas d'obligation de mentionner la DGCCRF dans des Mentions légales, sauf cas particuliers (vente en ligne avec délais de livraison, etc.). Notre cas (abonnement digital via Apple IAP) n'entre pas dans ces catégories spécifiques.

4. **Dénomination commerciale R. 526-27 C. com.** : Bien que correctement formulée dans la prose, vérifier que les documents bancaires, factures Apple, et registres officiels utilisent bien « Skander BAHRI EI » (avec les initiales « EI ») et non simplement « CoDevelop ». Si ce n'est pas le cas aujourd'hui, le mettre en conformité indépendamment du document légal.

---

## Recommandations de correction (à appliquer par le copywriter Stage 1)

### CRITICAL (bloquantes — à corriger AVANT Stage 3)

```diff
- Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique
+ Conformément à l'article 1-1 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (modifié par la loi n° 2024-449 du 21 mai 2024 dite « SREN »)
```

```diff
- Contact : `support@privacyscore.fr`
+ Contact :
+ - Email : `support@privacyscore.fr`
+ - Téléphone : [À FOURNIR PAR L'UTILISATEUR]
```

### HIGH (à corriger AVANT publication, peut passer Stage 3 avec flag)

Dans la section « Hébergeur du site » :

```diff
**HOSTINGER operations, UAB**
Švitrigailos g. 34, LT-03230 Vilnius, Lituanie
Code d'enregistrement : 306308157
Site web : `https://www.hostinger.com`
- Support : assistance disponible 24 h / 24 via le chat en ligne accessible depuis `hostinger.com`
+ Téléphone : non publié par Hostinger pour le support général. Le support technique est joignable 24 h / 24 par chat en ligne via `hostinger.com`.
```

Dans la section « Distribution de l'application » :

```diff
- Apple agit en qualité de distributeur de l'application au sens de la directive 2000/31/CE et des règles propres à l'App Store.
+ Apple agit en qualité de plateforme de distribution au sens du Règlement (UE) 2022/2065 du 19 octobre 2022 (Digital Services Act, applicable depuis le 17 février 2024) et des règles propres à l'App Store.
```

### MEDIUM (recommandé mais non bloquant)

Dans la section « Loi applicable et juridiction compétente » :

```diff
- les règles du Règlement (UE) n° 1215/2012 du 12 décembre 2012 (Bruxelles I bis)
+ les règles du Règlement (UE) n° 1215/2012 du 12 décembre 2012 (Bruxelles I bis), notamment son article 18 relatif à la compétence en matière de contrats conclus par les consommateurs,
```

---

## Verdict final Stage 2a

**FAIL si publication en l'état** (2 CRITICAL, 4 HIGH).

**PASS conditionnel** après application des 6 corrections ci-dessus + fourniture du numéro de téléphone par l'utilisateur.

Le draft est par ailleurs bien structuré, juridiquement substantiel, et respecte les règles de voix (zero em-dash, zero exclamation, zero « actionable »). Les corrections sont essentiellement liées à la mise à jour 2024 du cadre LCEN, qui n'avait pas été intégrée dans le draft initial.

**Prochaine étape recommandée** : retourner au copywriter Stage 1 pour application des corrections, puis re-soumettre au Stage 2a avant transition vers Stage 2b (Privacy Policy via cabinet-avocat:rgpd-data).
