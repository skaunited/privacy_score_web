# Mesure du parcours web — 19 octobre 2026

Propriété GA4 : `559523211`, flux web `G-QT0QFTD7L5`. Le code mesure l’usage du site après accord ; il ne confirme ni téléchargement ni achat dans l’application iOS.

## Événements disponibles après déploiement

Chaque événement comporte `language`, `page_path` et `page_type` (`home`, `blog_index`, `article`, `other`). Les événements des articles comportent aussi `article_path`. Les chemins excluent paramètres et fragments. La balise GA4 peut aussi transmettre le titre public de la page ; nos événements personnalisés ne copient pas le texte de l’article.

| Événement | Déclenchement | Paramètres spécifiques |
| --- | --- | --- |
| `page_view` | Page consultée après accord, une fois par document | `page_location` sans query ni fragment |
| `page_scroll` | Seuil franchi vers le bas, une fois par seuil et par période consentie dans le document | `scroll_percent` : 25, 50, 75, 90, 100 |
| `article_link_click` | Lien interne vers un article, depuis la liste ou une autre page | `destination`, chemin de l’article |
| `article_view` | Un article est visible dans un onglet au premier plan | — |
| `article_read_time` | Palier de lecture active atteint, une fois par palier | `read_seconds` : 30, 60, 120, 180, 300 |
| `article_engagement` | Temps actif transmis par tranches d’environ 15 secondes, puis solde lors d’une pause, d’une navigation ou d’un clic App Store | `reading_time_msec` : **durée supplémentaire**, `active_read_seconds` : cumul du document |
| `article_end` | Début du pied d’article visible à l’écran | Contexte de progression ci-dessous |
| `article_complete` | Fin atteinte et au moins 60 secondes de lecture active mesurée | Contexte de progression ci-dessous |
| `app_store_click` | Clic vers la fiche Privacy Score, depuis n’importe quelle page | `cta_position` et contexte de progression |
| `language_switch` | Clic du sélecteur de langue | `target_language` |

Le contexte de progression comprend `max_scroll_percent` (plus grand seuil observé après accord, ou 0). Sur un article, il comprend aussi `active_read_seconds`, `article_end_reached` (0/1) et `read_seconds` (plus grand palier de lecture atteint, ou 0). Ce dernier permet de segmenter les clics par palier avec la même dimension personnalisée. Le contexte décrit la page courante ; GA4 reconstitue la séquence entre pages à partir de ses sessions consenties. Aucun identifiant de parcours supplémentaire ni historique de navigation dans le stockage du site n’est créé.

## Définitions et limites

- Le défilement utilise le bas du viewport rapporté à la hauteur de la page entière, footer inclus. Une tolérance de deux pixels permet d’atteindre 100 %. Une page sans défilement ne produit pas `page_scroll`. Un saut en bas franchit tous les seuils intermédiaires ; il ne prouve aucune lecture. Un redimensionnement seul ne produit pas d’événement de scroll.
- Les seuils déjà dépassés avant l’accord ne sont pas reconstitués au démarrage. Le suivi d’une page commence à sa position courante.
- La lecture active exige un article visible, un document visible et le focus du navigateur. Elle s’interrompt après 60 secondes sans interaction (scroll, touche, pression ou geste). Aucun caractère tapé ni coordonnée n’est envoyé. Le retour au premier plan ou une interaction reprend la mesure. Les longues suspensions du navigateur sont plafonnées à cinq secondes par intervalle.
- `article_complete` est un indicateur de lecture probable, pas une preuve de compréhension ou de lecture intégrale. Le blog index et les pages légales n’ont pas de compteur de lecture.
- Additionner **uniquement `reading_time_msec`** pour obtenir le temps actif total. Ne pas sommer les cumuls `active_read_seconds` ni les paliers `read_seconds`. Le cumul peut servir à segmenter un clic App Store.
- Les événements sont envoyés dans la file `gtag`, sans bloquer la navigation. Un bloqueur, une fermeture du navigateur, une panne réseau ou un refus peuvent empêcher leur réception. Les chiffres portent sur les visites consenties ; aucun rattrapage rétroactif n’est possible.
- Le `scroll` automatique de GA4 à 90 %, s’il est activé, est distinct de notre `page_scroll`. Les rapports ci-dessous utilisent seulement `page_scroll`. De même, utiliser `app_store_click` pour le parcours App Store, sans additionner le `click` sortant automatique.

## Consentement et confidentialité

La notice FR/EN et les politiques de confidentialité v1.2 décrivent ce périmètre. Un ancien accord v1 doit être renouvelé avant le chargement de Google ; un ancien refus encore valide est conservé jusqu’à son échéance initiale. Le choix v2 est conservé au maximum 180 jours sous `privacy-score-audience-consent-v2`.

Aucun timer ni écouteur de mesure d’engagement n’est activé avant accord. Le retrait arrête et détruit la mesure, abandonne le solde non envoyé, désactive GA4 et efface les cookies Google accessibles au site. Le changement est propagé aux autres onglets du même site. L’expiration est aussi traitée dans un document resté ouvert. Le retour via le cache de navigation revalide le choix. Les fonctions publicitaires restent refusées et Google Signals reste désactivé.

## Configuration des rapports dans GA4

Les événements ne nécessitent pas de création préalable dans GA4. En revanche, leurs paramètres personnalisés nécessitent des définitions pour être exploités dans les rapports et explorations. L’accès API à cette propriété renvoyait **403** lors de la préparation : aucune configuration distante ni réception effective dans GA4 n’est confirmée par les tests locaux.

Dans la propriété **Privacy Score → Administration → Affichage des données → Définitions personnalisées**, créer ou réutiliser les dimensions de portée **Événement** suivantes (paramètre exact, sensible à la casse) :

| Nom conseillé | Paramètre |
| --- | --- |
| Type de page | `page_type` |
| Article | `article_path` |
| Destination article | `destination` |
| Position du bouton App Store | `cta_position` |
| Seuil de scroll | `scroll_percent` |
| Scroll maximal observé | `max_scroll_percent` |
| Palier de lecture en secondes | `read_seconds` |
| Fin d’article atteinte | `article_end_reached` |

Créer la métrique de portée Événement **Temps de lecture actif** : paramètre `reading_time_msec`, unité **Millisecondes**. Le paramètre `active_read_seconds` est un cumul de contexte, pas une métrique à additionner. La langue et le chemin de page ont déjà des dimensions natives dans GA4.

Marquer **`app_store_click` comme événement clé** pour analyser le taux de clic vers l’App Store. Conserver le nombre d’événements pour compter tous les clics et les utilisateurs/sessions pour mesurer combien de visiteurs ont cliqué.

Après disponibilité des définitions, créer deux explorations d’entonnoir avec étapes **indirectement suivies** (les événements de scroll peuvent s’intercaler) :

1. Parcours global ouvert : `page_view` → `app_store_click`. Ventiler par page d’entrée, langue, appareil et source/support.
2. Parcours éditorial ouvert : `article_view` → `article_read_time` avec `read_seconds = 30` → `app_store_click`. Variante de lecture approfondie : insérer `article_complete` avant le clic. Ventiler par `article_path`.

Dans l’exploration éditoriale, un clic ultérieur sur l’accueil peut suivre la lecture d’un article dans la même session ; le contexte du clic décrit alors l’accueil. Utiliser la dimension d’article de l’étape de lecture pour interpréter l’origine éditoriale, sans attribuer arbitrairement tous les clics à un seul article lorsque plusieurs ont été lus.

Les rapports standards et définitions personnalisées peuvent demander 24 à 48 heures. Après le push du propriétaire, le build de la pipeline et le Pull Updates Plesk, vérifier dans Temps réel une visite consentie : `page_view`, `article_view`, un palier à 30 secondes puis `app_store_click`. Contrôler aussi le refus et le retrait dans le navigateur. Les tests automatiques interceptent Google et ne polluent pas la propriété réelle. En développement ils utilisent un identifiant de test ; le mode `TEST_BUILT_SITE=1 pnpm test:browser` exerce le vrai `dist/`, sa CSP et son identifiant compilé, toujours avec interception de Google.

Références : [événements Google Analytics](https://developers.google.com/analytics/devguides/collection/ga4/events), [définitions personnalisées](https://support.google.com/analytics/answer/14240153), [scroll automatique GA4](https://support.google.com/analytics/answer/9216061).

## Validation locale

- `pnpm check` : Astro sans erreur ni avertissement ; 35 fichiers HTML, 22 URLs indexables et huit articles vérifiés ; 208 cas de redirection validés.
- `TEST_BUILT_SITE=1 pnpm test:browser` : 22 tests réussis sur le build avec sa CSP, dont consentement, navigation, temps/scroll, défilement natif, retrait entre onglets et accessibilité mobile. La visibilité et la perte de focus sont contrôlées explicitement dans les tests de temps : le navigateur headless émule le focus de chaque page.
- `pnpm test:deployment` : 12 tests réussis.
- `pnpm audit:performance` : trois audits par scénario EN/FR mobile/ordinateur ; médianes de performance 96/100 sur mobile et 100/100 sur ordinateur, autres catégories 100/100. Audits sur une visite sans accord, donc sans chargement du script Google.

La pipeline utilise désormais ce même mode de tests sur `dist/`, avant la publication dans `deploy`. Aucun push ni changement de serveur n’est effectué par ces vérifications locales.
