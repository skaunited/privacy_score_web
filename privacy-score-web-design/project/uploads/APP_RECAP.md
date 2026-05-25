# Privacy Score — recap technique et juridique

Cette fiche récapitule l'état du code de l'application **Privacy Score** au 18 mai 2026. Elle est destinée à deux usages :

1. Rédaction du site marketing `privacyscore.fr` (copy, captures, valeur produit).
2. Rédaction des **mentions légales** du site et de la fiche App Store (RGPD / Loi pour la Confiance dans l'Économie Numérique).

Chaque affirmation est rattachée à un fichier source. Les éléments non vérifiables depuis le code sont marqués `[UNVERIFIED]`.

---

## 1. Identité de l'application

| Champ | Valeur | Source |
| --- | --- | --- |
| Nom affiché (FR + EN) | `Privacy Score` | `App/Privacy Score/Privacy Score/Supporting Files/en.lproj/InfoPlist.strings`, `…/fr.lproj/InfoPlist.strings` (clé `CFBundleDisplayName`) |
| Nom marketing utilisé dans l'UI (FR) | `Privacy Guard` apparaît dans le footer Settings (« Privacy Guard ne voit jamais votre trafic ») et dans plusieurs chaînes localisées | `App/Privacy Score/Privacy Score/Ressources/fr.lproj/Localizable.strings` ligne 163, 227, … |
| Identifiant de bundle | `codevelop.fr.Privacy-Score` | `App/Privacy Score/Privacy Score.xcodeproj/project.pbxproj` lignes 398, 447 |
| Subsystem OSLog | `fr.codevelop.Privacy-Score` (utilisé pour les logs structurés) | `App/Privacy Score/Privacy Score/App/Privacy_ScoreApp.swift` ligne 19, etc. |
| Version (marketing) | `0.0.7` | `project.pbxproj` lignes 397, 446 |
| Build (interne) | `7` | `project.pbxproj` lignes 374, 423 |
| Cible iOS minimum | `17.6` | `project.pbxproj` lignes 393, 442 |
| Plateformes prises en charge | `iphoneos iphonesimulator macosx xros xrsimulator` (la build a été activée pour macOS Catalyst et visionOS — `MACOSX_DEPLOYMENT_TARGET = 26.2`, `XROS_DEPLOYMENT_TARGET = 26.2`) | `project.pbxproj` lignes 405, 396, 411 |
| Devices ciblés (`TARGETED_DEVICE_FAMILY`) | `1,2,7` → iPhone (1) + iPad (2) + Apple Vision (7) | `project.pbxproj` lignes 410, 459 |
| Orientations iPhone | Portrait + Landscape Left + Landscape Right | `project.pbxproj` ligne 392 |
| Orientations iPad | Portrait + Portrait Upside Down + Landscape Left + Landscape Right | `project.pbxproj` ligne 391 |
| Sandbox iOS / Hardened runtime | `ENABLE_APP_SANDBOX = YES`, `ENABLE_HARDENED_RUNTIME = YES` | `project.pbxproj` lignes 377-378 |
| Region par défaut | `en` ; régions connues : `en`, `Base`, `fr` | `project.pbxproj` lignes 174-179 |
| Langues distribuables | Anglais (`en.lproj`) + Français (`fr.lproj`) — deux fichiers `Localizable.strings`, deux fichiers `InfoPlist.strings` | `App/Privacy Score/Privacy Score/Ressources/en.lproj/`, `…/fr.lproj/`, `Supporting Files/` |
| Apple Developer Team ID | `6HLHYZ382H` | `project.pbxproj` ligne 285, 347, 375, 424 |
| Préfixe d'identifiant de bundle | `codevelop.fr.*` (le préfixe DNS-inverse implique un domaine `codevelop.fr` détenu par le développeur). Editeur identifié par le préfixe : « Codevelop » `[UNVERIFIED]` — à confirmer par l'utilisateur (raison sociale exacte, RCS, SIREN) | `project.pbxproj` lignes 398, 447 |
| Auteur déclaré dans les en-têtes de fichiers | `Skander BAHRI` | `App/Privacy Score/Privacy Score/App/Privacy_ScoreApp.swift` ligne 5, `Supporting Files/*.lproj/InfoPlist.strings` |
| URL Conditions / Politique de confidentialité | `https://www.swiftlab.fr/fr/politique-de-confidentialite/` (cible unique pour les deux liens d'onboarding) | `Localizable.strings` ligne 30, et son équivalent EN |

> Remarque : trois identifiants apparaissent dans le code — `codevelop.fr.Privacy-Score` (bundle), `swiftlab.fr` (politique de confidentialité), et `Skander BAHRI` (auteur). L'utilisateur doit clarifier dans les mentions légales lequel est l'éditeur de droit.

---

## 2. Ce que fait l'application — surfaces utilisateur

L'app est organisée en **4 onglets principaux** (`HomeTabView`), accessibles après un **onboarding** en 4 pages. L'onglet « Réglages » donne accès à 5 sous-écrans modaux. Détails ci-dessous, dans l'ordre d'apparition pour l'utilisateur.

### 2.1 Onboarding (premier lancement)

Fichier : `App/Privacy Score/Privacy Score/App/Features/Onboarding/OnboardingView.swift`.

- 4 pages : **Accueil** → **Confiance** → **Aperçu du score** → **Importer le rapport**.
- Page 1 (Accueil) : 3 cartes (Scan, Score, Recommandations) + footer « Sécurisé & Chiffré localement ».
- Page 2 (Confiance) : 3 promesses verbatim — **Aucun serveur**, **Aucun compte**, **Traitement local** (« Votre rapport est analysé localement, sur cet iPhone. Jamais envoyé en ligne. ») — `Localizable.strings` lignes 50-61.
- Page 3 (Aperçu) : score fictif 72/B avec deux chips d'illustration (« Tracking publicitaire · refusé », « +8 corrections rapides »).
- Page 4 (Import) : 3 étapes guidées vers Réglages iOS → Confidentialité et sécurité → Rapport sur l'App Privacy. Footer « Les données sont traitées localement sur l'appareil ».
- Une ligne de **terms** affichée dans le pied (`onboarding.terms`) : « En appuyant sur Continuer, vous acceptez nos **Conditions** et notre **Politique de confidentialité**. » Les deux liens pointent vers `https://www.swiftlab.fr/fr/politique-de-confidentialite/`.
- Les liens s'ouvrent via `SFSafariViewController` **dans l'app** (et non Safari) — voir `App/Features/Onboarding/SafariView.swift`. SwiftUI intercepte `openURL` via `OpenURLAction { ... return .handled }`.

Le drapeau « onboarding terminé » est persisté dans `UserDefaults` (clé `privacy_guard_onboarding`, voir `OnboardingManager.swift` ligne 20).

### 2.2 Onglet Dashboard (`tab.dashboard` / « Tableau de bord »)

Fichiers : `App/Features/Dashboard/DashboardPresenter.swift`, `DashboardView.swift`, `DashboardScreen.swift`.

- En-tête statut (`STATUT` → « Appareil protégé » / « Appareil à risque »).
- **Score de confidentialité** 0–100 (calculé par `PrivacyScoreEngine`, voir §6).
- Cartes de stats :
  - **Traceurs détectés** (en %).
  - **Apps utilisant le GPS**.
  - **Connexion DNS** (chiffré / non chiffré, basé sur `NEDNSSettings`).
  - **Wi-Fi** (sécurisé / ouvert / déconnecté).
  - **Protection VPN** (actif / inactif).
  - **Tracking publicitaire** (statut ATT — refusé / autorisé / non déterminé) ; pop-up détail avec l'identifiant publicitaire (IDFA) et le nombre de jours d'exposition.
- Section « Hygiène numérique » (montre la taille du cache à nettoyer).
- Une astuce contextuelle générée par `PrivacyTipEngine`.

### 2.3 Onglet Recommendations (`tab.audit` / « Audit »)

Fichiers : `App/Features/Recommendations/RecommendationsPresenter.swift`, `RecommendationsView.swift`.

- Liste de tips priorisés par `PrivacyTipEngine` (carte par recommandation).
- Liens vers les sous-écrans : **Analyse VPN**, **Analyse DNS**, **Suivi publicitaire**, **Trafic réseau**, **Localisation**.
- Sheet « Review apps » (`ReviewAppsSheet.swift`) pour passer en revue les apps qui sortent dans les recommandations.

### 2.4 Onglet Score Evolution (`tab.evolution` / « Évolution »)

Fichiers : `App/Features/ScoreEvolution/ScoreEvolutionPresenter.swift`, `ScoreEvolutionView.swift`.

- Graphique d'évolution des scores au fil des imports (chaque import → une entrée `StoredPrivacyScore`).
- Liste des scans récents (`RecentScansListView.swift`) avec date, score, grade, nombre de traceurs détectés.

### 2.5 Onglet Settings (`tab.settings` / « Réglages »)

Fichier : `App/Features/Settings/SettingsView.swift`. Structure exhaustive :

1. **Hero** : « Réglages et sécurité » + sous-titre (`settings.title`, `settings.subtitle`).
2. **Apparence** (section `settings.section.appearance`) :
   - Picker `Système` / `Clair` / `Sombre` (`AppearancePreference`, persistance via `AppearanceManager` → `UserDefaults`).
3. **Vos configurations** (`settings.section.my_configs`) :
   - **Vos VPN** → ouvre `VPNAnalysisScreen` (liste des profils IKEv2 user-defined).
   - **Vos DNS** → ouvre `DNSAnalysisScreen` (liste des profils DoH/DoT user-defined).
4. **Confidentialité réseau** (`settings.section.network`) :
   - **Fournisseurs VPN** → `VPNSetupScreen` (catalogue curated : Mullvad, Proton, NordVPN, Surfshark — voir §4).
   - **Résolveurs DNS** → `DNSSetupScreen` (catalogue curated, `DNSProviderRegistry`).
   - Caption « Inclut des partenaires qui peuvent nous rémunérer. » (transparency FTC-style).
5. **App** (`settings.section.app`) :
   - **Revoir l'introduction** (rejoue l'onboarding).
   - **Importer un nouveau rapport** (re-affiche l'onboarding pour guider l'utilisateur — il n'y a **pas** de file picker in-app ; l'import passe par `onOpenURL`).
6. **Rappels** (`settings.section.reminders`) :
   - **Rappels** → `RemindersScreen` (configuration des notifications, voir §2.6).
7. **Footer de confiance** : « Privacy Guard ne voit jamais votre trafic. »
8. **À propos** (`settings.section.about`) :
   - « Politique de confidentialité » (lien — texte localisé, comportement à vérifier `[UNVERIFIED]` — la chaîne existe mais aucun handler de tap n'a été lu directement dans `SPGSettingsAboutSection`).
   - « Version de l'app » (lue dynamiquement depuis `Bundle.main` : `CFBundleShortVersionString` + `CFBundleVersion`).
9. **Débogage** (`#if DEBUG` uniquement — n'apparaît **pas** en build Release) :
   - « Exporter la base (.store) » : énumère les fichiers `*.store`, `*.store-shm`, `*.store-wal` dans `Application Support/` et les partage via `UIActivityViewController`. Voir `SettingsView.swift` lignes 653-698.
   - Détail du rapport stocké (nombre d'entrées + nom de fichier).
   - « Réinitialiser tous les réglages » : remet le flag onboarding à zéro, vide tous les stores SwiftData (rapport, score history, mitigation samples).

### 2.6 Reminders / Notifications

Fichiers : `App/Features/Notifications/RemindersPresenter.swift`, `RemindersView.swift`, `App/Features/Notifications/NotificationPermissionPrompt.swift`, et tout `Common/CoreCommon/Sources/CoreCommon/Notifications/`.

- L'app peut programmer **4 catégories** de notifications locales (voir `SPGNotificationCategory.swift`) :
  - `importReminder` — « Rafraîchir votre rapport » (cadence personnalisée, défaut mensuelle).
  - `newTip` — « Nouvelle astuce » (cadence personnalisée, défaut bi-hebdomadaire).
  - `iosVersionChanged` — event-driven (déclenché quand `UIDevice.current.systemVersion` change).
  - `privacyGradeDrop` — event-driven (déclenché quand le score d'un nouveau scan est inférieur au précédent).
- **100 % local** : `UNUserNotificationCenter` uniquement. Pas de push remote.
- **Badge** : volontairement non utilisé (« Privacy Guard never maintains an unread count ; badging on a privacy app reads as a security warning » — `RemindersPresenter.swift` ligne 178).
- Permissions demandées : `[.alert, .sound]` uniquement.
- Soft pre-prompt avant la dialog iOS (gestion par `RemindersPresenter.grantPermission()`).
- **Heures calmes** : 22h-8h par défaut, override par catégorie possible.
- **Auto-pause 3 strikes** : après 3 dismissals consécutifs sans engagement, la catégorie est mise en pause 14 jours.

### 2.7 Sous-écrans annexes accessibles depuis l'audit

- **Tracker Analysis** (`App/Features/TrackerAnalysis/`) : 3 onglets — Destinations (countries), Domaines (top trackers), Réseau (réseau d'entreprises). Tutorial gate à la première ouverture.
- **DNS Analysis** + **DNS Setup** (`App/Features/DNSAnalysis/`, `DNSSetup/`) : explique le DNS chiffré et propose des résolveurs.
- **VPN Analysis** + **VPN Setup** (`App/Features/VPNAnalysis/`, `VPNSetup/`) : explique le tunneling et propose des fournisseurs.
- **Custom DNS / Custom VPN** (`App/Features/CustomDNS/`, `CustomVPN/`) : éditeurs pour saisir un profil personnalisé (DoH URL ou DoT host pour DNS ; IKEv2 server + auth pour VPN). Génération d'un fichier `.mobileconfig` à installer dans Réglages iOS.
- **Location Analysis** (`App/Features/LocationAnalysis/`) : analyse fine des apps qui accèdent à la localisation, croisée avec le rapport.
- **IDFA Detail** (`App/Features/Dashboard/IDFADetailView.swift`) : explication du tracking publicitaire + guide pas-à-pas pour le désactiver dans Réglages.
- **Scan Progress** (`App/Features/ScanProgress/ScanProgressSheet.swift`) : sheet plein écran présenté pendant l'analyse d'un import.

### 2.8 Flux d'import du rapport Apple

Code : `Privacy_ScoreApp.swift` ligne 435 (`onOpenURL`), `PrivacyReportImportManager.swift`.

- L'app déclare gérer les fichiers `.ndjson` (voir §5, document types).
- Quand l'utilisateur partage un App Privacy Report depuis Réglages iOS, iOS envoie l'URL au handler `onOpenURL` de l'app.
- Pipeline : security-scoped access → copie vers `Documents/PrivacyReports/<filename>.ndjson` → parsing ligne-à-ligne en streaming → persistance SwiftData → calcul du score → sauvegarde dans l'historique.
- **Aucune dialogue serveur**, aucune URL externe : tout est read-from-disk → parse → save-to-disk.

---

## 3. Données traitées — partie critique pour les mentions légales / RGPD

### 3.1 Données lues depuis l'appareil

Source unique : `App/Privacy Score/Privacy Score/Common/CoreCommon/Sources/CoreCommon/DevicePrivacy/DevicePrivacyManager.swift`.

| Donnée lue | Mécanisme | Stockée ? | Source |
| --- | --- | --- | --- |
| App Privacy Report (NDJSON) — log d'accès aux ressources + activité réseau des autres apps de l'appareil | Parse `AsyncLineSequence`, ISO-8601 strict | Oui (SwiftData `PrivacyReportStore`, voir §3.2) | `PrivacyReportManager.swift`, `PrivacyReportEntry.swift` |
| Version iOS (`systemVersion`) | `UIDevice.current.systemVersion` | Oui (UserDefaults `privacy_guard_last_seen_os_version`) | `Privacy_ScoreApp.swift` ligne 346 |
| Statut DNS chiffré | `NEDNSSettingsManager.shared().loadFromPreferences()` | Non (lu à chaque rendu) | `DevicePrivacyManager.swift` lignes 126-213 |
| Configuration VPN | `NEVPNManager.shared().loadFromPreferences()` + heuristique `CFNetworkCopySystemProxySettings` (interfaces `utun`, `ipsec`, `ppp`, `tap`, `tun`) | Non (transient) | `DevicePrivacyManager.swift` lignes 251-346 |
| Wi-Fi sécurisé / non sécurisé | `NWPathMonitor` + `NEHotspotNetwork.fetchCurrent` | Non. Note : `NEHotspotNetwork` requiert l'entitlement `com.apple.developer.networking.wifi-info` **qui n'est PAS dans `Privacy Score.entitlements`** — le résultat sera donc systématiquement `.unavailable` en prod sauf à demander cet entitlement à Apple. `[UNVERIFIED]` — à confirmer | `DevicePrivacyManager.swift` lignes 357-387 |
| Taille du cache disque | `FileManager.urls(for: .cachesDirectory, ...)` (sandbox uniquement) | Non | `DevicePrivacyManager.swift` lignes 394-425 |
| Permission de localisation (statut, **pas** la localisation) | `CLLocationManager().authorizationStatus` | Non | `DevicePrivacyManager.swift` lignes 432-453 |
| Mail Privacy Protection | **Aucune API publique iOS** — toujours `.unavailable` | Non | `DevicePrivacyManager.swift` lignes 463-466 |
| App Tracking Transparency status | `ATTrackingManager.trackingAuthorizationStatus` | Non | `DevicePrivacyManager.swift` lignes 473-491 |
| IDFA (identifiant publicitaire) | `ASIdentifierManager.shared().advertisingIdentifier.uuidString` | **Oui** (UserDefaults `privacyScore.idfa.identifier` + `privacyScore.idfa.firstSeenDate`) — uniquement pour calculer la durée d'exposition « X jours ». Si l'IDFA est zéroisé, la date n'est pas stockée. | `IDFAExposureService.swift` lignes 67-103 |

> Important RGPD : l'IDFA est une **donnée à caractère personnel** au sens du RGPD selon la jurisprudence CNIL (équivalent d'un identifiant unique). L'app le lit et le stocke localement. À couvrir explicitement dans les mentions légales.

### 3.2 Données stockées sur l'appareil

#### SwiftData — 5 conteneurs distincts

Chaque conteneur est un `ModelContainer` séparé, sur disque, dans `Application Support/`. Code : `Privacy_ScoreApp.init()` lignes 140-216.

| Conteneur | Identifiant | Tables / Models | Cycle de vie | Source |
| --- | --- | --- | --- | --- |
| Rapport Apple (transitoire) | `PrivacyReportStore` | `StoredPrivacyReport`, `StoredAccessEntry`, `StoredNetworkActivityEntry` | **Effacé à chaque nouvel import** | `PrivacyReport/Store/PrivacyReportStore.swift`, `StoredPrivacyReport.swift`, etc. |
| Historique des scores | `ScoreHistoryStore` | `StoredPrivacyScore`, `StoredCategoryPenalty` | Persistant (jamais effacé sur import, uniquement via Debug → Reset all) | `Store/ScoreHistory/` |
| Profils DNS personnalisés | `CustomDNSProfileStore` | `StoredCustomDNSProfile` (id, nom, protocole, URL/host, IPs, flag actif, flag « blocks trackers », notes, dates) | Persistant | `Store/CustomDNS/StoredCustomDNSProfile.swift` |
| Profils VPN personnalisés | `CustomVPNProfileStore` | `StoredCustomVPNProfile` (id, nom, server, remote ID, username, flag « blocks trackers », notes, dates). **Le mot de passe n'est PAS stocké en SwiftData.** | Persistant | `Store/CustomVPN/StoredCustomVPNProfile.swift` (ligne 13-19, 60) |
| Échantillons d'atténuation (DNS/VPN actifs au fil du temps) | `MitigationSampleStore` | `StoredMitigationSample` (timestamp, dnsActive, dnsProviderID, dnsBlocksTrackersRaw, vpnActive, vpnProviderID, vpnBlocksTrackersRaw) | Auto-prune par âge + cap de quantité ; effacé via Debug Reset | `MitigationCredit/StoredMitigationSample.swift`, `MitigationSampleStore.swift` |

Données stockées dans le rapport (par scan) :
- `StoredAccessEntry` : bundle ID de l'app, catégorie d'accès (caméra / contacts / location / mediaLibrary / microphone / photos / screenRecording), timestamp, type d'intervalle (`intervalBegin` / `intervalEnd`), broadcaster optionnel.
- `StoredNetworkActivityEntry` : bundle ID, domaine contacté, propriétaire du domaine, classification (first/third-party), classification (tracker/non-tracker), `appInitiated`/`nonAppInitiated`, nombre de hits, timestamps.

#### UserDefaults — clés persistées

Recherche exhaustive (grep `forKey:` + `storageKey`). Toutes les clés listées :

| Clé | Type | Rôle | Source |
| --- | --- | --- | --- |
| `privacy_guard_onboarding` | Bool | Onboarding terminé | `OnboardingManager.swift` ligne 20 |
| `privacy_guard_appearance_preference` | String (raw `AppearancePreference`) | Thème | `AppearanceManager.swift` ligne 42 |
| `privacy_guard_last_seen_os_version` | String | Détection upgrade iOS (pour la notif `iosVersionChanged`) | `Privacy_ScoreApp.swift` ligne 304 |
| `privacy_guard_last_app_active_at` | Date | Dernier passage `.active` | `Privacy_ScoreApp.swift` ligne 312 |
| `privacy_guard_reminders_first_visit_completed` | Bool | Cacher la carte d'intro Rappels | `RemindersPresenter.swift` ligne 99 |
| `privacy_guard_notification_preferences` | Data (JSON) | Préférences par catégorie | `NotificationPreferencesManager.swift` ligne 40 |
| `privacy_guard_notification_master_enabled` | Bool | Interrupteur principal | idem ligne 45 |
| `privacy_guard_notification_dismissal_count` | Data (JSON) | Compteur de dismissals par catégorie | idem ligne 51 |
| `privacy_guard_notification_auto_paused_until` | Data (JSON) | Map catégorie → timestamp expiration de pause | idem ligne 58 |
| `privacy_guard_notification_auto_pause_history` | Data (JSON) | Compteur historique on-device (jamais transmis) | idem ligne 65 |
| `privacy_guard_last_fired_grade_drop_import_at` | Double (TimeInterval) | Anti-doublon notif grade drop | `NotificationScheduler.swift` ligne 85 |
| `privacy_guard_last_dismissal_scan_at` | TimeInterval | Curseur du scan de dismissals | idem ligne 94 |
| `fr.codevelop.PrivacyScore.dnsTutorial.hasSeen` | Bool | Le tutoriel DNS a déjà été vu | `DNSTutorialPreferences.swift` ligne 19 |
| `fr.codevelop.PrivacyScore.trackerTutorial.hasSeen` | Bool | Idem trackers | `TrackerTutorialPreferences.swift` ligne 20 |
| `privacyScore.idfa.identifier` | String | IDFA capturé (cf. §3.1) | `IDFAExposureService.swift` ligne 107 |
| `privacyScore.idfa.firstSeenDate` | Date | Date de première observation de l'IDFA non-zéro | idem ligne 108 |

> Toutes ces clés vivent dans `UserDefaults.standard`, c.-à-d. dans le `plist` sandbox de l'app. Aucun App Group / shared container n'est utilisé (`REGISTER_APP_GROUPS = YES` dans `project.pbxproj` mais aucun `applicationGroups` n'est déclaré dans l'entitlements file).

#### Fichiers générés sur disque

| Fichier | Emplacement | Contenu sensible | Source |
| --- | --- | --- | --- |
| NDJSON importé | `Documents/PrivacyReports/<filename>` | Copie du rapport Apple original (PII : bundles d'apps + domaines contactés + horodatages) | `PrivacyReportImportManager.swift` lignes 204-228 |
| `.mobileconfig` DNS | `Documents/Profiles/<safe-name>.mobileconfig` | Spec DNS chiffré (URL DoH, host DoT, IPs) — pas de credential | `MobileConfigGenerator.swift` lignes 110-142 |
| `.mobileconfig` VPN | `tmp/VPN-Profiles/<UUID>/<safe-name>-<short>.mobileconfig` avec `.completeFileProtection` + `isExcludedFromBackup = true` | **Contient le mot de passe IKEv2 EAP-MSCHAPv2 en CLAIR** (clé `AuthPassword`) — le générateur le précise en commentaire, `VPNMobileConfigGenerator.swift` lignes 120-145. Cleanup explicite après partage (`deleteGeneratedFile`) + safety-net au launch (`cleanupAllGeneratedFiles` appelé dans `Privacy_ScoreApp.init` ligne 287) + au backgrounding (ligne 504). Le password n'est jamais stocké en SwiftData. | `VPNMobileConfigGenerator.swift` |

> **Mention légale recommandée** : préciser que les fichiers `.mobileconfig` générés sont temporaires et ne quittent pas l'appareil, et que le mot de passe VPN saisi par l'utilisateur n'est pas conservé par l'app au-delà de la session de génération.

### 3.3 Transmissions réseau — vérification exhaustive

Grep ciblé sur tout `App/Privacy Score/` (hors `Tests`, `Mocks`).

**Résultat** : la seule classe qui appelle `URLSession` dans tout le code source est `AppIconManager` (Common/CustomNetwork/Sources/CustomNetwork/AppIconManager.swift), qui appelle `https://itunes.apple.com/lookup?bundleId=...` pour récupérer des icônes d'apps.

**MAIS** : recherche `AppIconManager|AppIconProviding|import CustomNetwork` dans `App/` :

```
(aucun résultat — le manager n'est référencé qu'à l'intérieur de son propre module et dans CustomNetworkTests)
```

Donc :

- Le module `CustomNetwork` est **lié au binaire** (déclaré dans `packageProductDependencies` du target Privacy Score, voir `project.pbxproj` ligne 65) mais **aucun code applicatif ne l'utilise** à ce jour. Aucune instance d'`AppIconManager` n'est créée nulle part dans le code de l'app.
- Aucun autre `URLSession`, `URLRequest`, `NWConnection`, ni SDK d'analytics (Firebase, Mixpanel, Amplitude, Segment, PostHog, Sentry, Crashlytics) n'a été trouvé.
- Aucune exception ATS dans `Info.plist`.

**Conclusion vérifiable** : à la date du recap, **l'application ne déclenche aucune connexion sortante en runtime**. La capacité technique d'appeler l'API iTunes Lookup existe dans le binaire (via le module CustomNetwork) mais n'est jamais activée. Si cette feature est activée plus tard (résolution des icônes d'apps tierces dans Tracker Analysis), il faudra mettre à jour le claim « aucune connexion sortante ».

**Ce qui passe par le réseau quand même** (mais initié par l'utilisateur / iOS, pas par notre code) :
- `SFSafariViewController` (in-app Safari) ouvert sur les liens de politique de confidentialité et de partenaires VPN/DNS. Le code charge l'URL — la requête réseau est faite par `SFSafariViewController`/Apple.
- `UIApplication.shared.open(url)` — ouvre l'URL dans Safari/une app externe (recommandations, guide ATT). Idem, c'est iOS qui charge.

### 3.4 Partage / export

- **Partage du `.mobileconfig` DNS ou VPN** : `UIActivityViewController` pour permettre à l'utilisateur d'envoyer le fichier à Mail / Files / AirDrop / etc. La transmission est faite par l'app cible (pas par nous).
- **Debug → Exporter la base** (`#if DEBUG` uniquement) : partage les fichiers `*.store` / `*.store-shm` / `*.store-wal` (les bases SwiftData) via `UIActivityViewController`. **N'est jamais accessible en build Release.** Voir `SettingsView.swift` lignes 653-698.
- **Aucun share du rapport NDJSON original** dans l'UI utilisateur.

---

## 4. Tiers et dépendances

### Swift Packages déclarés (project.pbxproj + chaque `Package.swift`)

| Package | Type | Utilisation | Source |
| --- | --- | --- | --- |
| `SPGComponents` (local) | Local SPM, in-house | Design system (composants UI : panels glass, headers, settings rows, tabs, etc.) | `Components/SPGComponents/Package.swift` |
| `CoreCommon` (local) | Local SPM, in-house | Domain layer : parseurs, modèles SwiftData, score engine, notifications, device privacy. Re-exporte `CoreCommonMocks` pour les tests. | `App/Privacy Score/Privacy Score/Common/CoreCommon/Package.swift` |
| `CustomNetwork` (local) | Local SPM, in-house | Manager pour appeler iTunes Lookup. **Linké mais non utilisé** au runtime aujourd'hui. | `App/Privacy Score/Privacy Score/Common/CustomNetwork/Package.swift` |
| `ViewInspector` (remote, `github.com/nalexn/ViewInspector`) | SPM tiers, **uniquement en `testTarget`** | Inspection SwiftUI dans les tests `SPGComponentsTests` | `Components/SPGComponents/Package.swift` ligne 16 |

**Aucun** SDK Firebase, Mixpanel, Amplitude, Segment, PostHog, Sentry, Crashlytics, Branch, Adjust, Datadog, AppsFlyer, etc. Aucun framework binaire embedded (`Frameworks/` est vide dans le projet Xcode).

### Frameworks iOS / Apple utilisés (imports explicites)

- `SwiftUI`, `SwiftData`, `Combine`, `Foundation`, `UIKit`
- `UserNotifications` (notifications locales)
- `OSLog` (logs structurés)
- `Network` (`NWPathMonitor`)
- `NetworkExtension` (`NEDNSSettingsManager`, `NEVPNManager`, `NEHotspotNetwork`)
- `CoreLocation` (`CLLocationManager` — pour lire le **statut** d'autorisation uniquement, jamais la position)
- `AppTrackingTransparency` (`ATTrackingManager`)
- `AdSupport` (`ASIdentifierManager`)
- `CFNetwork` (`CFNetworkCopySystemProxySettings`)
- `SafariServices` (`SFSafariViewController`)
- `Testing` (Swift Testing) + `XCTest` dans les tests

### Catalogues curated de fournisseurs (partenaires affichés dans l'UI)

`VPNProviderRegistry.swift` (ligne 183) liste 4 fournisseurs VPN avec URL de redirection :
- **Mullvad VPN** (Suède) — `https://mullvad.net/en/vpn` (`freeSignup`, pas affilié)
- **Proton VPN** (Suisse) — `https://protonvpn.com` (`freeSignup`)
- **NordVPN** (Panama) — `https://nordvpn.com/?from=privacyscore` (`affiliate`)
- **Surfshark** (Pays-Bas) — `https://surfshark.com/?coupon=privacyscore` (`affiliate`)

`DNSProviderRegistry.swift` — catalogue similaire de résolveurs (Quad9, JoinDNS4, NextDNS, etc., à vérifier au cas par cas si besoin pour les mentions légales).

> **À mentionner dans les mentions légales** : présence de liens d'affiliation (`affiliate`) vers NordVPN et Surfshark. Le caption « Inclut des partenaires qui peuvent nous rémunérer » est déjà affiché dans l'écran Settings.

---

## 5. Capacités iOS déclarées

### Entitlements (`Privacy Score.entitlements`)

Un seul entitlement :
```xml
<key>com.apple.developer.networking.networkextension</key>
<array>
  <string>dns-settings</string>
</array>
```
→ permet à l'app d'utiliser `NEDNSSettingsManager` pour lire le profil DNS système (lecture uniquement — l'app ne s'enregistre pas comme provider). Pas de Push Notifications, pas d'App Groups effectif (le flag `REGISTER_APP_GROUPS = YES` du pbxproj est inerte sans entitlement correspondant), pas d'Associated Domains, pas de HomeKit / HealthKit / iCloud / CloudKit.

### Privacy usage strings — clés `NS*UsageDescription`

Recherche `grep -rn "NSPhotoLibrary\|NSCamera\|NSLocation\|NSContacts\|NSMicrophone\|NSAppleMusic\|NSUserTracking\|NSFaceID\|NSMotion\|NSBluetooth\|NSCalendars\|NSReminders\|NSSpeechRecognition\|NSHealthShare"` dans tout le projet :

**Aucune** `NS*UsageDescription` n'est définie dans `Info.plist` ni dans `INFOPLIST_KEY_NS*` du `project.pbxproj`.

Cohérent avec ce que l'app fait : elle **lit** des statuts d'autorisation (ATT, Location) mais ne demande **jamais** la permission elle-même (et donc ne peut pas exécuter de prompt iOS). Conséquence pratique :
- L'app ne peut **pas** lire la position GPS (CLLocationManager renvoie `notDetermined` ou un statut accordé à une autre app, mais ne déclenche jamais de dialog).
- L'app n'a **pas** de bouton « Demander à suivre » (ATT) — elle se contente d'afficher le statut actuel.

### App Transport Security

Pas de clé `NSAppTransportSecurity` dans `Info.plist`. La politique iOS par défaut s'applique : tout `http://` est bloqué, seul `https://` autorisé. Cohérent avec l'absence de connexions sortantes.

### URL schemes / Associated Domains

- **Aucun** `CFBundleURLTypes` dans `Info.plist` (l'app n'a pas de scheme custom comme `privacyscore://`).
- **Aucun** `com.apple.developer.associated-domains` dans les entitlements (pas de Universal Links).

### Document types (gestion des fichiers ouverts par l'app)

`Info.plist` ligne 4-15 :

```xml
<key>CFBundleDocumentTypes</key>
<array>
  <dict>
    <key>CFBundleTypeName</key><string>App Privacy Report</string>
    <key>CFBundleTypeRole</key><string>Viewer</string>
    <key>LSHandlerRank</key><string>Alternate</string>
    <key>LSItemContentTypes</key>
    <array>
      <string>org.ndjson</string>
      <string>public.ndjson</string>
      <string>com.privacy-score.ndjson</string>
    </array>
  </dict>
</array>
```

L'app se déclare comme **Viewer** de fichiers NDJSON (rang `Alternate` — d'autres apps peuvent le gérer). Elle déclare aussi son propre UTI `com.privacy-score.ndjson` (`UTImportedTypeDeclarations` lignes 17-42).

`UIFileSharingEnabled = true` → les fichiers du dossier `Documents/` sont visibles via l'app Files / iTunes File Sharing. À mentionner dans les mentions légales si pertinent.

### `INFOPLIST_KEY_*` build settings (project.pbxproj)

- `INFOPLIST_KEY_LSSupportsOpeningDocumentsInPlace = YES` — l'app peut ouvrir des documents in-place (sans copier dans la sandbox d'abord).
- `INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES`
- `INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES`
- `INFOPLIST_KEY_UILaunchScreen_Generation = YES`
- `INFOPLIST_KEY_UIStatusBarStyle = UIStatusBarStyleDefault`
- `ENABLE_USER_SELECTED_FILES = readonly` — l'app a la capacité de **lire** les fichiers sélectionnés par l'utilisateur, sans écrire (cohérent avec le flux d'import NDJSON read-only).

---

## 6. Stack technique (pour le press kit / site)

| Champ | Valeur | Source |
| --- | --- | --- |
| Langage | Swift 5.0 (`SWIFT_VERSION = 5.0`), mais target outils Swift 6.2 (`Package.swift` lignes 1) | `project.pbxproj` ligne 409, `Package.swift` |
| Concurrence | `SWIFT_APPROACHABLE_CONCURRENCY = YES`, `SWIFT_DEFAULT_ACTOR_ISOLATION = MainActor` (Swift 6 mode strict) | `project.pbxproj` lignes 406-407 |
| UI | SwiftUI 100 % (aucun storyboard, aucun XIB) | `Privacy_ScoreApp.swift` (`@main struct ... : App`) |
| Architecture | Pattern Presenter (MVP-ish) — chaque feature `*Screen.swift` instancie un `*Presenter` en `@StateObject` ; `*View.swift` consomme `@Published` `state` | Exemple : `DashboardScreen.swift`, `DashboardPresenter.swift` |
| Persistance | SwiftData (5 conteneurs séparés, voir §3.2) | `Privacy_ScoreApp.init()` |
| Préférences | `UserDefaults.standard` (clés listées §3.2) | divers |
| Notifications | `UserNotifications` local-only (pas de remote) | `NotificationScheduler.swift` |
| Routing notifications | `NotificationRouter` publie `pendingDeepLink` ; `ContentView` route via `.onChange` | `NotificationRouter.swift`, `ContentView.swift` |
| Logging | `OSLog` avec subsystem `fr.codevelop.Privacy-Score` (catégorie variable par feature). Tout log de PII utilise `privacy: .public` ou `.private` explicite. | `Privacy_ScoreApp.swift` ligne 19 etc. |
| Design system | SPGComponents (in-house, SPM local, iOS 17+) — voir `Components/SPGComponents/Sources/` | `Components/SPGComponents/Package.swift` |
| Tests app target | Swift Testing (`import Testing`) — fichiers comme `TipPriorityMappingTests.swift`, `XAxisLabelBuilderTests.swift` | `Privacy ScoreTests/` |
| Tests CoreCommon / SPGComponents | XCTest (`XCTestCase`) | `Common/CoreCommon/Tests/`, `Components/SPGComponents/Tests/` |
| Dépendance tests | `ViewInspector` (introspection SwiftUI), uniquement test-target | `SPGComponents/Package.swift` ligne 16 |
| Plan de tests | `PrivacyScoreTests.xctestplan` au niveau project root | `App/Privacy Score/PrivacyScoreTests.xctestplan` |

---

## 7. Points sensibles à mentionner dans les mentions légales (RGPD / LCEN)

Liste des éléments à couvrir explicitement, avec l'info disponible depuis le code :

### Identification de l'éditeur

- **Nom commercial** : `[UNVERIFIED]` — à clarifier par l'utilisateur. Trois pistes :
  - `Codevelop` (préfixe bundle `codevelop.fr`)
  - `Swiftlab` (host de la politique de confidentialité actuelle)
  - `Skander BAHRI` (auteur déclaré dans les en-têtes de fichiers)
- **Forme juridique / RCS / SIREN / adresse / capital social / TVA intracom** : `[UNVERIFIED]` — non inscrit dans le code.
- **Directeur de la publication** : `[UNVERIFIED]`.
- **Apple Developer Team ID** : `6HLHYZ382H` (utile pour la fiche App Store, pas pour les mentions légales du site).

### Identification du site web (LCEN art. 6 III)

- Hébergeur du site `privacyscore.fr` : `[UNVERIFIED]` — non lié au code app.
- À fournir à minima : raison sociale, adresse, numéro de téléphone de l'hébergeur.

### Identification de l'éditeur de l'app

- Sur App Store : Apple agit en tant que **distributeur**. Le développeur reste **éditeur** au sens RGPD.
- À noter : la rubrique « App Privacy » de l'App Store doit refléter exactement ce que le binaire fait. À jour du recap :
  - Aucune donnée n'est **collectée** au sens Apple (« linked to user », « not linked to user », « tracking »).
  - L'IDFA est lu **localement** uniquement et stocké en `UserDefaults` ; aucune transmission. Reste à voir comment Apple veut le déclarer.

### Traitement des données personnelles (RGPD art. 13)

À couvrir dans la politique de confidentialité :

| Élément RGPD | Contenu vérifié |
| --- | --- |
| Données traitées | NDJSON Apple Privacy Report (bundles d'apps utilisées, domaines réseaux, accès ressources), IDFA, statuts iOS (DNS / VPN / ATT / Location permission), version OS, préférences notifications, profils DNS/VPN saisis par l'utilisateur (sans mot de passe). |
| Finalité | Calcul d'un score de confidentialité, affichage de recommandations actionnables, notifications locales de rappel. |
| Base légale (Art. 6 RGPD) | Intérêt légitime (calcul on-device, sans tiers) + consentement implicite via import volontaire du rapport. |
| Destinataires | **Aucun** — toutes les données restent sur l'appareil de l'utilisateur. Aucun serveur, aucun sous-traitant (vérifié : pas de SDK d'analytics, pas d'URLSession active en runtime). |
| Durée de conservation | NDJSON : remplacé à chaque import. Score history / DNS profiles / VPN profiles : indéfiniment, jusqu'à action de l'utilisateur (Debug Reset en build DEBUG, ou désinstallation de l'app). MitigationSampleStore : auto-prune par âge + cap interne. |
| Transfert hors UE | Aucun. |
| Droits d'accès / rectification / effacement / portabilité | À gérer côté UX. Aujourd'hui : effacement complet via désinstallation ou Debug Reset. **Il n'y a PAS de bouton « effacer mes données » accessible en build Release**. À implémenter pour conformité RGPD si l'app est publiée. |
| Délégué à la protection des données (DPO) | Non requis si pas de traitement à grande échelle ; à confirmer. |
| Contact | Email de contact à fournir dans les mentions légales (`[UNVERIFIED]`). |

### CNIL / Cookies / Trackers

- Aucun cookie dans l'app (n/a — l'app n'a pas de WebView qui charge des cookies hors `SFSafariViewController`, lequel utilise son propre contexte isolé).
- Pas de tracker tiers (FB Pixel, Google Analytics, etc.).
- Déclaration CNIL : a priori non nécessaire (pas de fichier de personnes, pas de profilage centralisé). À confirmer juridiquement.

### Liens d'affiliation

- 2 partenaires VPN génèrent une rémunération (NordVPN avec `?from=privacyscore`, Surfshark avec `?coupon=privacyscore`) — `VPNProviderRegistry.swift` lignes 303, 334.
- À déclarer dans les mentions légales / page « Affiliations » du site.
- La disclosure inline est déjà faite dans l'UI (caption « Inclut des partenaires qui peuvent nous rémunérer » dans Settings + badge `PARTENAIRE` sur les cartes).

---

## 8. Limitations connues / choix produit

### Ce que l'app NE FAIT PAS

- **Elle ne bloque pas les trackers** — elle les analyse uniquement depuis le rapport Apple. Pour bloquer, il faut installer un profil DNS / VPN, ce que l'app aide à faire mais ne fait pas elle-même.
- Elle ne fait **aucune connexion sortante** (sauf via SFSafariViewController et `UIApplication.shared.open` initiés par l'utilisateur).
- Elle n'a **pas de file picker in-app** — l'import passe forcément par le share sheet de Réglages iOS → l'app.
- Elle ne lit **pas** la géolocalisation, ne demande **pas** ATT, n'utilise **pas** la caméra / le micro / les contacts / les photos.
- Elle ne maintient **pas** de badge d'icône.
- Elle n'a **pas** de mode hors-ligne dédié — elle est en permanence hors-ligne par design.
- Elle ne supporte **pas** iPad/Vision pleinement `[UNVERIFIED]` — bien que `TARGETED_DEVICE_FAMILY` inclue iPad (2) et Vision (7), la qualité d'adaptation n'a pas été vérifiée dans ce recap.

### Limites de capacité technique

- `NEHotspotNetwork.fetchCurrent` retourne `.unavailable` sans l'entitlement `com.apple.developer.networking.wifi-info` qui n'est pas demandé — la carte Wi-Fi peut donc dégrader silencieusement en prod.
- Mail Privacy Protection : aucune API publique, toujours `.unavailable` — c'est un choix Apple.
- `NEVPNManager.shared()` ne renvoie les métadonnées que si l'app a l'entitlement Personal VPN (`com.apple.developer.networking.vpn.api`) — pas dans `Privacy Score.entitlements` aujourd'hui — donc l'app retombe sur la simple heuristique d'interface tunnel pour détecter le VPN.

### Marqueurs TODO repérés dans le code

- `ContentView.swift` ligne 45 : `// TODO(import-funnel-v1)` — la deep link `.importFlow` n'a pas de surface finale.
- Le mot-clé `[UNVERIFIED]` apparaît dans ce recap pour :
  - Raison sociale exacte de l'éditeur
  - Hébergeur du site `privacyscore.fr`
  - Statut effectif de l'entitlement Wi-Fi Info
  - Adresse e-mail de contact RGPD
  - Numéro CNIL / SIRET / etc.
  - Couverture iPad / Apple Vision réelle
  - Comportement du tap sur « Politique de confidentialité » dans `SPGSettingsAboutSection` (non lu en détail, mais probablement un lien vers `swiftlab.fr`)

### Cohérence des promesses marketing avec le code

- « Aucun serveur » — ✅ vérifié (aucune URL d'API maison, aucune connexion sortante runtime).
- « Aucun compte » — ✅ vérifié (aucune trace de Sign in with Apple / login / register / Firebase Auth dans le code).
- « Traitement local » — ✅ vérifié (parse NDJSON via `PrivacyReportManager`, calcul via `PrivacyScoreEngine`, persistance SwiftData on-device).
- « Sécurisé & Chiffré localement » — partiellement vrai : le SwiftData store est protégé par le chiffrement iOS sandbox standard, le `.mobileconfig` VPN utilise `.completeFileProtection`. Aucun chiffrement applicatif additionnel n'est ajouté par l'app.
- « Privacy Guard ne voit jamais votre trafic » — ✅ vérifié.

---

## Fichiers / dossiers non couverts dans ce recap

Lus partiellement ou pas du tout, à vérifier au besoin :

- `App/Privacy Score/Privacy Score/App/Features/Audit/` (dossier vide à la racine du projet d'après l'arbo `ls`, à confirmer)
- Détail complet de chaque presenter (j'ai lu en grande partie Dashboard / Recommendations / TrackerAnalysis / Reminders / Settings ; pas en détail Score Evolution, Location Analysis, Custom DNS/VPN editors, Mitigation Credit).
- `Components/SPGComponents/Sources/` (le design system — non critique pour les mentions légales mais important pour le press kit ; structure générale connue via la mémoire du projet, voir aussi `README.md` du package).
- `App/Privacy Score/Privacy Score/Common/CoreCommon/Sources/CoreCommon/PrivacyReport/Analysis/PrivacyTipEngine.swift` et `PrivacyRiskEngine.swift` (engines de recommandations — fonctionnels mais leur catalogue n'a pas été listé).
- `Demo & MVP/` à la racine du repo (semble être du legacy / archive).
- `UX_Test_Session_FR.docx` et `build_ux_test_doc.py` à la racine — outils de test utilisateur, non liés au binaire app.
