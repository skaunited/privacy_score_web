---
title: Registre des activités de traitement (ROPA)
language: fr
version: 1.0
last_updated: 2026-05-27
controller: Skander BAHRI (entrepreneur individuel) — CoDevelop
status: INTERNAL — NOT PUBLISHED
basis: Article 30 du Règlement (UE) 2016/679 (RGPD)
review_cadence: Semestrielle (mai et novembre)
---

# Registre des activités de traitement (ROPA) — CoDevelop

> ⚠️ **Document interne**. Ne pas publier sur le site web ni dans l'application. À tenir à la disposition de la CNIL en cas de contrôle (article 30.4 RGPD).

## 1. Informations générales

| Champ | Valeur |
|---|---|
| **Responsable du traitement** | Skander BAHRI |
| **Forme juridique** | Entrepreneur individuel (EI) |
| **Nom commercial** | CoDevelop |
| **SIREN** | 852 583 558 |
| **Adresse** | Bureau 3, 9 rue de Condé, 33000 Bordeaux, France |
| **Contact** | `support@privacyscore.fr` |
| **DPO désigné** | Non (article 37 RGPD non applicable — voir Politique de confidentialité) |
| **Représentant UE** | Non applicable (responsable déjà établi dans l'UE) |
| **Activité concernée** | Édition de l'application iOS « Privacy Score » + site web `privacyscore.fr` |

## 2. Pourquoi ce registre

L'article 30.5 du RGPD prévoit une dispense pour les organismes de moins de 250 employés, **sauf** lorsque l'une des conditions suivantes est remplie :

- Le traitement est **susceptible de comporter un risque** pour les droits et libertés des personnes concernées.
- Le traitement n'est **pas occasionnel**.
- Le traitement inclut des **catégories particulières** (article 9) ou des **données pénales** (article 10).

Pour CoDevelop, le traitement de données personnelles (rapport Apple, IDFA, préférences utilisateur) est **continu** dès qu'un utilisateur installe et utilise l'application. La dispense ne s'applique donc pas. La tenue du présent registre est obligatoire.

---

## 3. Fiches de traitement

### Fiche n° 1 — Analyse du rapport de confidentialité Apple (NDJSON)

| Champ | Valeur |
|---|---|
| **Finalité principale** | Permettre à l'utilisateur d'auditer la confidentialité de son iPhone via l'analyse locale du rapport Apple `App Privacy Report` |
| **Sous-finalités** | Calcul du score 0-100, identification des traceurs, repérage des apps utilisant la localisation, génération de recommandations |
| **Base légale (art. 6 RGPD)** | 6.1.b — Exécution du contrat de service que l'utilisateur a explicitement demandé en important son rapport |
| **Catégories de personnes concernées** | Utilisateurs de l'application iOS Privacy Score (personnes physiques majeures détenant un iPhone) |
| **Catégories de données traitées** | Données techniques du rapport Apple : bundle IDs d'applications tierces, domaines réseau contactés, horodatages, accès aux ressources (caméra, micro, location, etc.), classification tracker/non-tracker |
| **Destinataires** | Aucun. Données traitées intégralement sur l'appareil de l'utilisateur. |
| **Sous-traitants (art. 28)** | Aucun |
| **Transferts hors UE** | Aucun |
| **Durée de conservation** | Jusqu'à l'import d'un nouveau rapport (qui remplace le précédent) ou la désinstallation de l'application |
| **Mesures de sécurité techniques** | Sandbox iOS, chiffrement du système de fichiers (si code de déverrouillage défini par l'utilisateur), pas de transmission réseau |
| **Mesures de sécurité organisationnelles** | Conception privacy-by-design (article 25 RGPD), revue de code par l'éditeur, intégration dans aucun service distant |

### Fiche n° 2 — Analyses dérivées du rapport

| Champ | Valeur |
|---|---|
| **Finalité principale** | Persistance et affichage des analyses calculées localement à partir du rapport (score, historique, tendances) |
| **Base légale** | 6.1.b — Exécution du service |
| **Catégories de personnes** | Idem fiche n° 1 |
| **Catégories de données** | Score numérique, nombre de traceurs par catégorie, séries temporelles, échantillons d'atténuation (statut DNS chiffré, VPN au moment du scan) |
| **Destinataires** | Aucun |
| **Sous-traitants** | Aucun |
| **Transferts hors UE** | Aucun |
| **Durée de conservation** | Indéfinie tant que l'application est installée. Échantillons d'atténuation auto-purgés (cap d'ancienneté + cap de quantité) |
| **Mesures de sécurité** | Idem fiche n° 1. Bases SwiftData séparées par catégorie pour cloisonnement |

### Fiche n° 3 — Identifiant publicitaire (IDFA)

| Champ | Valeur |
|---|---|
| **Finalité principale** | Afficher à l'utilisateur la durée d'exposition à son identifiant publicitaire iOS (« vous portez cet IDFA depuis X jours ») dans une optique pédagogique |
| **Base légale** | 6.1.f — Intérêt légitime (analyse pédagogique de l'exposition publicitaire) |
| **Test de mise en balance (LIA)** | Voir section 4 ci-dessous |
| **Catégories de personnes** | Utilisateurs de l'application qui n'ont pas refusé le suivi via App Tracking Transparency |
| **Catégories de données** | UUID de l'IDFA + date de première observation |
| **Destinataires** | Aucun |
| **Sous-traitants** | Aucun |
| **Transferts hors UE** | Aucun |
| **Durée de conservation** | Jusqu'à réinitialisation de l'IDFA par l'utilisateur (depuis iOS), ou désinstallation de l'application |
| **Mesures de sécurité** | Stockage dans `UserDefaults` de la sandbox iOS, jamais transmis |
| **Mesures organisationnelles** | Affichage transparent à l'utilisateur, possibilité d'opt-out via Réglages iOS (ATT) |

### Fiche n° 4 — Statuts iOS lus à la volée

| Champ | Valeur |
|---|---|
| **Finalité principale** | Afficher l'état actuel de certains réglages iOS (DNS chiffré, VPN, version OS, autorisation de localisation, statut ATT) sur le tableau de bord |
| **Base légale** | 6.1.b — Exécution du service |
| **Catégories de personnes** | Utilisateurs de l'application |
| **Catégories de données** | Booléens et chaînes courtes décrivant l'état système (non-personnelles) |
| **Destinataires** | Aucun |
| **Sous-traitants** | Aucun |
| **Transferts hors UE** | Aucun |
| **Durée de conservation** | Lecture à chaque rendu, non stockés, à deux exceptions près : (a) version iOS dans `UserDefaults` pour détecter une mise à jour ; (b) historique des compteurs de notifications dans `UserDefaults` |
| **Mesures de sécurité** | Idem fiches précédentes |

### Fiche n° 5 — Profils DNS et VPN personnalisés

| Champ | Valeur |
|---|---|
| **Finalité principale** | Permettre à l'utilisateur de saisir un profil DNS chiffré (DoH/DoT) ou VPN (IKEv2) personnalisé, en vue de générer un fichier `.mobileconfig` à installer dans iOS |
| **Base légale** | 6.1.b — Exécution du service |
| **Catégories de personnes** | Utilisateurs qui saisissent un profil personnalisé (sous-ensemble) |
| **Catégories de données** | Paramètres de profil DNS : URL DoH ou hostname DoT, IPs. Paramètres de profil VPN : serveur, remote ID, username. **Le mot de passe VPN n'est jamais stocké** au-delà de la session de génération du `.mobileconfig` |
| **Destinataires** | Aucun (profils restent sur l'appareil ; l'installation iOS est à l'initiative de l'utilisateur) |
| **Sous-traitants** | Aucun |
| **Transferts hors UE** | Aucun |
| **Durée de conservation** | Indéfinie tant que l'utilisateur conserve le profil, ou jusqu'à désinstallation |
| **Mesures de sécurité** | Stockage SwiftData. Fichiers `.mobileconfig` générés avec `completeFileProtection`, supprimés automatiquement après partage |

### Fiche n° 6 — Abonnement payant et facturation via Apple IAP

| Champ | Valeur |
|---|---|
| **Finalité principale** | Gérer l'abonnement à renouvellement automatique de l'utilisateur (annuel 23,88 € ou semestriel 20,94 €) |
| **Base légale** | 6.1.b — Exécution du contrat d'abonnement |
| **Catégories de personnes** | Utilisateurs souscrivant un abonnement payant |
| **Catégories de données traitées par CoDevelop** | **Aucune donnée personnelle directement**. CoDevelop reçoit uniquement des données comptables agrégées d'Apple (revenu par formule, par pays) sans rattachement à un utilisateur identifié |
| **Catégories de données traitées par Apple** | Identifiant Apple, numéro de carte bancaire, adresse de facturation, historique d'achat (relevant de la politique d'Apple) |
| **Destinataires** | Apple Distribution International Limited (Cork, Irlande) — sous-traitant de facturation |
| **Sous-traitants (art. 28)** | Apple Distribution International Limited — soumise aux conditions d'Apple Developer Program qui incluent les clauses contractuelles type DPA |
| **Transferts hors UE** | Pour le compte de CoDevelop : aucun. Pour le compte d'Apple : Apple Inc. à Cupertino (US), encadrés par le EU-US Data Privacy Framework (décision d'adéquation 2023/1795 du 10 juillet 2023) |
| **Durée de conservation** | Côté CoDevelop : durée des relations contractuelles + délais comptables (10 ans, art. L. 123-22 C. com.). Côté Apple : selon la politique d'Apple |
| **Mesures de sécurité** | Apple gère intégralement le PCI-DSS et la sécurité du paiement |

### Fiche n° 7 — Notifications locales

| Champ | Valeur |
|---|---|
| **Finalité principale** | Programmer des rappels locaux à l'utilisateur (import à refaire, nouvelle astuce, changement de version iOS, baisse du score) |
| **Base légale** | 6.1.a — Consentement explicite (l'utilisateur autorise les notifications via la dialogue iOS standard) |
| **Catégories de personnes** | Utilisateurs ayant autorisé les notifications |
| **Catégories de données** | Préférences de notifications (catégories actives, plages calmes, compteurs de rejets, historique de pauses automatiques) |
| **Destinataires** | Aucun |
| **Sous-traitants** | Apple (`UserNotifications` framework, gère la file d'attente locale) |
| **Transferts hors UE** | Aucun (notifications strictement locales, aucun serveur push) |
| **Durée de conservation** | Indéfinie tant que l'application est installée |
| **Mesures de sécurité** | Stockage `UserDefaults` dans la sandbox |

### Fiche n° 8 — Site web `privacyscore.fr`

| Champ | Valeur |
|---|---|
| **Finalité principale** | Présenter l'application, publier les documents légaux, servir de page de téléchargement |
| **Base légale** | 6.1.f — Intérêt légitime (présence informationnelle de l'éditeur) |
| **Catégories de personnes** | Visiteurs du site |
| **Catégories de données** | Adresses IP de connexion (journaux serveur). Aucun cookie de mesure d'audience, aucun cookie publicitaire. Cookies strictly-necessary uniquement (par exemple cookie de session si formulaire requis) |
| **Destinataires** | HOSTINGER operations, UAB (Vilnius, Lituanie) — hébergeur, à des fins de service technique |
| **Sous-traitants (art. 28)** | HOSTINGER operations, UAB — contrat d'hébergement incluant les clauses contractuelles type via le Data Processing Agreement de Hostinger |
| **Transferts hors UE** | Aucun par CoDevelop (Hostinger est dans l'UE, et les serveurs physiques sont en France/Paris) |
| **Durée de conservation des journaux** | 1 an conformément à l'article 6 II de la LCEN (décret n° 2021-1363 du 20 octobre 2021) |
| **Mesures de sécurité** | HTTPS obligatoire (TLS 1.2+), certificats Let's Encrypt, headers de sécurité (CSP, HSTS, X-Content-Type-Options, Referrer-Policy), pas de scripts tiers |

---

## 4. Test de mise en balance des intérêts (LIA) — Fiche n° 3 (IDFA)

Conformément aux lignes directrices EDPB sur l'intérêt légitime (WP 217 modernisées) et aux fiches CNIL.

### 4.1 Intérêt légitime poursuivi

CoDevelop poursuit l'intérêt légitime d'**informer pédagogiquement** ses utilisateurs sur la durée d'exposition à leur identifiant publicitaire iOS. Cet intérêt s'inscrit dans la mission éducative de l'application (audit de la confidentialité mobile).

### 4.2 Nécessité du traitement

Sans persister l'IDFA et sa date de première observation, le calcul de la durée d'exposition (« vous portez cet IDFA depuis X jours ») serait impossible. Aucune alternative moins intrusive ne permettrait d'atteindre la même finalité (par exemple stocker uniquement la date sans l'IDFA serait insuffisant pour vérifier la persistance du même IDFA dans le temps).

### 4.3 Atteinte aux droits de la personne

L'atteinte est **minimale** :

- L'IDFA est lu via une API publique iOS (`ASIdentifierManager`).
- Il est stocké **localement** dans `UserDefaults`, jamais transmis.
- L'utilisateur dispose d'un contrôle complet : refus initial via App Tracking Transparency (qui rend l'IDFA composé uniquement de zéros, sans valeur identifiante), ou réinitialisation depuis Réglages iOS &gt; Confidentialité et sécurité &gt; Suivi.
- Aucun usage commercial, aucun ciblage publicitaire, aucun profilage.
- L'utilisateur est informé de manière transparente par la Politique de confidentialité publiée.

### 4.4 Conclusion de la mise en balance

L'intérêt légitime de CoDevelop (information de l'utilisateur) **prévaut** sur l'atteinte aux droits de la personne (collecte d'un identifiant local sans transmission), compte tenu :

- de la transparence de l'information,
- du contrôle complet conservé par l'utilisateur,
- de l'absence de tout usage secondaire,
- de la finalité strictement éducative.

Le traitement est licite au sens de l'article 6.1.f RGPD.

---

## 5. AIPD (Analyse d'impact relative à la protection des données)

Conformément à l'article 35 du RGPD et à la liste CNIL des traitements soumis à AIPD :

- Aucun des 8 traitements n'inclut des catégories particulières (art. 9), des données pénales (art. 10), ou un traitement à grande échelle.
- Aucun n'utilise des technologies innovantes au sens de l'art. 35.3.
- Aucun ne fait l'objet d'une décision automatisée affectant significativement la personne.

**Aucune AIPD n'est requise.** Cette décision sera réévaluée à chaque évolution majeure de l'application ou du périmètre des données.

---

## 6. Sous-traitants — Synthèse des contrats DPA

| Sous-traitant | Rôle | Localisation | Contrat DPA | Transferts hors UE |
|---|---|---|---|---|
| Apple Distribution International Limited | Facturation Apple IAP, distribution App Store | Cork, Irlande (UE) | Apple Developer Program License Agreement (inclut clauses DPA) | Vers Apple Inc. (US) sous DPF |
| HOSTINGER operations, UAB | Hébergement du site web | Vilnius, Lituanie (UE). Serveurs physiques : France (Paris) | Hostinger Data Processing Agreement (acceptable via T&C lors de l'inscription) | Aucun |

---

## 7. Procédure d'exercice des droits des personnes

| Droit | Procédure interne CoDevelop |
|---|---|
| Accès (art. 15) | L'utilisateur accède directement à ses données dans l'application. Pour les données serveur (journaux IP Hostinger), CoDevelop demande à Hostinger un export ponctuel sur demande motivée et formelle de l'utilisateur. |
| Rectification (art. 16) | Sans objet pour les données du rapport Apple (non modifiable a posteriori). L'utilisateur peut importer un nouveau rapport. |
| Effacement (art. 17) | Désinstallation de l'application = effacement total local. Pour les journaux serveur, CoDevelop demande à Hostinger leur suppression dans la mesure où cela ne contrevient pas à l'obligation de conservation LCEN (1 an). |
| Limitation (art. 18) | Possible via désactivation des notifications, opt-out IDFA via iOS ATT. |
| Portabilité (art. 20) | Le rapport NDJSON importé est consultable et exportable via l'application Files d'iOS. |
| Opposition (art. 21) | L'utilisateur peut désinstaller l'application à tout moment, ce qui constitue une opposition de fait. |

**Délai de réponse** : 1 mois conformément à l'art. 12.3 RGPD, prorogeable de 2 mois en cas de complexité particulière dûment motivée auprès de l'utilisateur.

**Canal unique** : `support@privacyscore.fr`

---

## 8. Procédure de notification de violation (art. 33-34 RGPD)

CoDevelop s'engage à :

1. Détecter et qualifier toute violation dans les meilleurs délais.
2. Notifier la CNIL **dans les 72 heures** si la violation est susceptible d'engendrer un risque pour les droits et libertés des personnes (art. 33).
3. Notifier les personnes concernées sans délai déraisonnable si le risque est **élevé** (art. 34).
4. Documenter toutes les violations, même non notifiées, dans une annexe au présent registre (art. 33.5).

Compte tenu de l'architecture on-device et de l'absence de serveur applicatif, le risque structurel de violation est minimal. Les vecteurs résiduels sont :

- Compromission d'un sous-traitant (Hostinger pour le site, Apple pour la facturation) : suivi via les notifications fournisseurs.
- Vulnérabilité applicative permettant l'extraction de la sandbox iOS : suivi via Apple Security Advisories.

---

## 9. Cadence de révision

Le présent registre est révisé :

- **Tous les 6 mois** au minimum (mai et novembre).
- **À chaque évolution majeure** de l'application qui modifierait le périmètre ou la nature d'un traitement (nouveau SDK, nouvelle catégorie de données, nouveau sous-traitant, etc.).
- **À chaque évolution réglementaire significative** (lignes directrices CNIL/EDPB, jurisprudence CJUE, modification de la LIL).

Date de la prochaine révision : **27 novembre 2026**.

---

## Historique des versions

| Version | Date | Modifications |
|---|---|---|
| 1.0 | 27 mai 2026 | Création initiale du registre. 8 fiches de traitement documentées. LIA effectuée pour la fiche IDFA. AIPD jugée non requise. Cadence de révision semestrielle posée. |
