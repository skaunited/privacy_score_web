# Livraison de la refonte SEO — 19 octobre 2026

> Mise à jour visuelle demandée par le propriétaire après publication : l'habillage, les textes d'accueil, les illustrations et les gabarits du blog reviennent à leur présentation antérieure (`df3bf12`). Les nouvelles sections d'offre et de guides sur l'accueil sont retirées ; les conditions commerciales restent dans la FAQ et les pages légales. Les articles corrigés, la migration, les métadonnées, Analytics et la pipeline sont conservés. Les descriptions et mesures ci-dessous documentent la livraison initiale et ne constituent pas une validation éditoriale des textes d'accueil restaurés. Consulter `CLAUDE.md` pour l'état courant.

La refonte demandée est implémentée sur la branche `codex/seo-rebuild`. Le site statique et le paquet de publication sont validés localement. **Cette livraison n'est pas encore déployée sur Plesk/Cloudflare** : les réponses HTTP de production, les en-têtes et la réception effective des événements GA4 restent à vérifier après publication.

## Corrections livrées

| Sujet | Résultat |
|---|---|
| Langues et URLs | Anglais à `/`, français à `/fr/`, sans redirection automatique selon la langue du navigateur. |
| Migration | 12 chemins historiques redirigés vers leurs destinations finales dans la configuration Nginx générée ; normalisation des 22 URLs canoniques. Les fichiers HTML de redirection restent un secours, les vrais statuts 301 exigent les règles serveur. |
| Canonical et hreflang | Canonical propre à chaque page, paires réciproques uniquement pour des pages équivalentes, `x-default` anglais. Le sélecteur de langue peut proposer l'index du blog sans le déclarer équivalent à un article. |
| Contenu existant | Quatre articles entièrement revus, slugs et dates de publication conservés, date de révision visible, sources Apple, suppression des affirmations techniques non étayées. |
| Nouveau contenu | Quatre guides publiés, deux par langue, sur l'export/import du rapport et le dépannage d'un rapport vide. Total : huit articles, quatre par langue. |
| Acquisition | Accès au blog depuis la navigation et l'accueil, liens entre guides, sommaires, auteur, captures légendées et appels vers l'App Store. |
| Offre | Deux offres de lancement françaises mises en valeur, avec durée initiale, éligibilité et renouvellement clairement indiqués. |
| Analytics | Identifiant fourni intégré, chargement Google après consentement seulement, refus et retrait accessibles, événements de navigation et clics App Store. |
| Interface et performance | Sélecteur de langue mobile rétabli, liens et contrastes corrigés, navigation clavier, icônes SVG légères, images optimisées et chargement différé sous le premier écran. |
| Maintenance | Contrôles reproductibles des routes, du sitemap, des liens internes, des fragments, des ressources, des données structurées et du consentement. |

Les deux articles anglais initialement signalés sont maintenant corrigés et publiables à leurs nouvelles adresses : `/blog/iphone-permissions-guide/` et `/blog/iphone-privacy-settings-2026/`. Leurs anciennes URLs sous `/en/` sont conservées dans la migration. Le blog n'est pas mis en quarantaine.

Les corrections factuelles portent notamment sur les témoins caméra/microphone, les limites du rapport Apple, le suivi publicitaire, la distinction analyse/filtrage DNS et les promesses de sécurité. Les anciennes statistiques et histoires présentées sans preuve ont été retirées. Les captures restantes sont des exemples illustratifs, pas des résultats représentatifs des utilisateurs. Aucun test physique d'iPhone n'est revendiqué.

L'offre annuelle confirmée par le propriétaire est de **23,88 € la première année**, puis **59,99 €/an au tarif français actuel**. L'offre semestrielle est de **20,94 € les six premiers mois**, puis **39,99 €/six mois au tarif français actuel**. Les tarifs de lancement ne sont pas traités comme des prix périmés. Les conditions finales affichées par Apple restent celles de l'achat.

## Validation locale

- Build Astro : **0 erreur, 0 avertissement, 0 indication**.
- Sortie : **35 fichiers HTML**, dont **22 pages indexables**, une page 404 et 12 fichiers de secours pour les anciennes URLs.
- Redirections : **208 cas validés**, dont paramètres, variantes sans slash, `index.html` et prévention des boucles.
- Liens externes présents dans les pages finales : **27 destinations**, toutes avec un statut final HTTP **200** lors de la vérification du 19 octobre. Le statut seul ne prouve pas la qualité éditoriale ; les sources des guides ont aussi été revues.
- Navigateur : **7 tests réussis**, couvrant consentement, refus, expiration, retrait, paramètres transmis, affichage mobile et contrôles axe WCAG A/AA sur quatre pages représentatives. Les requêtes Google sont interceptées : aucun événement de test n'a été envoyé à la propriété réelle.
- Lighthouse mobile sur l'accueil local : **performance 99**, **accessibilité 100**, **bonnes pratiques 100**, **SEO 100** ; LCP environ **2,0 s**, CLS **0**, TBT **0 ms**. Il s'agit d'une mesure de laboratoire sur localhost, pas des performances réelles du serveur ni des Core Web Vitals des visiteurs.

Preuves : [validation synthétique](seo-rebuild-validation-2026-10-19.json), [destinations externes](seo-links-2026-10-19.json). Les scores techniques ne prouvent pas que Google indexera ou classera les pages.

## Mesure de référence et interprétation

Search Console est accessible pour `sc-domain:privacyscore.fr` via Windsor.ai. La [référence enregistrée](seo-audit-2026-10-19/search-console-baseline.json) contient les données quotidiennes et les requêtes disponibles.

| Fenêtre de 28 jours | Clics | Impressions | CTR | Position moyenne pondérée |
|---|---:|---:|---:|---:|
| 22 août–18 septembre 2026 | 6 | 207 | 2,90 % | 9,86 |
| 19 septembre–16 octobre 2026 | 7 | 211 | 3,32 % | 7,87 |

Ces deux fenêtres ne démontrent pas une forte baisse récente. Elles montrent surtout un volume faible, avec des clics concentrés sur la marque. La requête « rapport de confidentialité » a notamment 14 impressions et aucun clic sur l'accueil français dans les lignes de requêtes disponibles. Les requêtes anonymisées ne sont pas toutes restituées ; leur somme peut différer des totaux quotidiens.

Le passage de `/en/` à `/` correspond au choix du propriétaire ; un préfixe `/en/` n'est pas en soi une pénalité SEO. Les améliorations attendues viennent de la cohérence technique, de réponses éditoriales précises et d'un parcours vers l'application. La migration peut temporairement perturber les résultats ; aucun gain de position ni délai d'indexation n'est garanti.

## Analytics fourni

- ID de mesure : **G-QT0QFTD7L5** ; propriété : **559523211**.
- Google est chargé après accord, avec les fonctions publicitaires désactivées. Les URLs envoyées par le code du site omettent paramètres et fragments ; le référent est réduit à son origine.
- Événements : `page_view`, `app_store_click`, `language_switch` et `article_cta_click` lorsqu'applicable. Un clic vers l'App Store ne constitue ni une installation ni un achat attribué.
- Les rapports importés dans l'application ne font pas partie des données collectées par ce module web.
- L'accès en lecture à la nouvelle propriété via le connecteur Analytics retourne **403**. Cela n'empêche pas le tag fourni de fonctionner ; il faut autoriser/reconnecter le compte pour lire les rapports avec cet outil.

Après déploiement, vérifier dans GA4 les données en temps réel, la conservation des données événementielles à deux mois, les options de mesure améliorée pour éviter les événements automatiques superflus, puis définir `app_store_click` comme événement clé. Ces réglages de propriété ne sont pas modifiés par les fichiers statiques du site.

## Mise en ligne et calendrier

Le [guide de déploiement](../DEPLOY.md) détaille l'intégration aux réglages Plesk existants, le changement atomique de version, la conservation des anciens assets, le cache Cloudflare et le retour arrière. Les fichiers `deploy/redirects.nginx.conf` et `deploy/plesk-security.nginx.conf` sont des propositions à fusionner avec la configuration effective. Leurs expressions de redirection ont été testées localement ; `nginx -t` doit être exécuté sur l'origine avant activation.

| Moment | Actions et critère de fin |
|---|---|
| Jour de publication | Sauvegarder version/configuration, intégrer les règles, valider Nginx, publier le paquet, ajuster/purger les caches nécessaires. Vérifier les pages en 200, anciennes URLs en 301 directe, URL inexistante en 404, CSP et assets accessibles. |
| Immédiatement après | Tester consentement et collecte réelle GA4, vérifier les réglages de propriété, soumettre le sitemap final et inspecter les principales pages dans Search Console. Aucune demande d'indexation n'a été faite pendant cette préparation locale. |
| Première semaine | Surveiller les nouvelles canoniques, les redirections, les exclusions d'indexation et les erreurs de ressources. Corriger les anomalies opérationnelles dès qu'elles apparaissent. |
| Chaque semaine, premier mois | Relever clics, impressions et requêtes par page/langue ; suivre les visites consenties et clics App Store. Préserver la référence avant migration. |
| Après 28 jours | Comparer des fenêtres complètes de même durée. Séparer marque/hors marque et FR/EN ; examiner les pages ayant des impressions utiles et peu de clics avant de retoucher titres et réponses. |
| Après huit semaines | Faire le bilan acquisition/conversion web. Croiser avec App Store Connect pour les installations/abonnements lorsque l'attribution le permet ; ne pas déduire les ventes des seuls clics web. |
| Entretien mensuel | Recontrôler les sources externes et les conditions commerciales ; mettre à jour les parcours iOS modifiés. Prioriser le prochain guide à partir des requêtes réelles et des questions de support. |

La première base de contenu est livrée maintenant. Ensuite, viser un nouveau sujet utile toutes les deux à quatre semaines si une demande vérifiable existe, plutôt qu'une cadence de publication sans besoin identifié. Ne pas changer à nouveau les URLs pendant la période d'observation, sauf erreur bloquante.

## Paquet et historique

Archive locale prête à transférer : `artifacts/privacy-score-web-2026-10-19-final.tar.gz`, accompagnée de sa somme SHA-256. Elle contient uniquement les **78 fichiers publics** du build, dont `.well-known/security.txt`, sans métadonnées AppleDouble. Les snippets serveur sont livrés séparément et ne doivent pas être placés dans le document root.

SHA-256 : `154de976f3c151b2eecf7c09dee740caadc4121643d8af73a593838e8bd8677f`.

Les changements sont répartis en commits séparant l'audit, la migration/mesure, le contenu, l'offre et les pages légales, puis les contrôles et la documentation. Le [rapport d'audit initial](seo-audit-2026-10-19/README.md) est une trace historique : ses hypothèses d'offre périmée ou d'exclusion du blog ont été remplacées par les instructions du propriétaire et cette livraison.
