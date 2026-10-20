# IndexNow après publication Plesk

## Fonctionnement

Le propriétaire pousse `main`, GitHub vérifie le site et prépare `deploy`, puis le propriétaire fait **Pull Updates** dans Plesk. Le workflow **IndexNow after production deployment** vérifie ensuite la production, sans déclencher le pull Plesk ni modifier le serveur.

- Après la réussite de **Test, build and publish**, une première vérification est déclenchée.
- Une vérification horaire (minute 17 UTC) prend le relais si le pull Plesk est fait plus tard. Les horaires GitHub sont indicatifs et peuvent être retardés.
- **Actions → IndexNow after production deployment → Run workflow → main** permet une vérification immédiate après le pull. Une exécution inchangée ne renvoie pas toutes les pages.

Le build génère `indexnow-manifest.json` depuis les URLs canoniques du sitemap, avec une empreinte SHA-256 par fichier HTML. La preuve d’appartenance `<clé>.txt` est publique à la racine ; ce n’est pas une clé de compte Bing et aucun secret Bing/Plesk n’est ajouté à GitHub. Le manifeste ne contient que des URLs et empreintes publiques, aucun SHA du dépôt privé ni donnée Analytics.

Avant toute notification, le script exige :

1. Le manifeste public correspond à celui du dernier build de `deploy`.
2. Le fichier de preuve répond 200 sans redirection, avec la bonne clé.
3. Chaque page nouvelle/modifiée répond 200, reste auto-canonique, sans `noindex` HTML ou HTTP, et son HTML correspond exactement au build. Ce contrôle évite une soumission prématurée pendant la copie non atomique de Plesk.
4. Les URLs retirées depuis la dernière soumission répondent 404/410 ou redirigent définitivement (301/308) vers une page canonique actuelle.
5. Le manifeste public correspond encore au build à la fin du contrôle.

La première exécution effective envoie les **22 URLs canoniques actuelles**. Les suivantes comparent les empreintes avec le dernier reçu et transmettent les pages ajoutées, modifiées et retirées. Les anciennes routes `/en/`, les redirections, les brouillons, les fichiers techniques et les pages `noindex` ne sont pas ajoutés comme pages canoniques.

Le reçu est conservé dans le cache GitHub Actions, partagé uniquement entre les exécutions de la branche principale. Les jobs sont sérialisés et le workflow n’exécute ni code de pull request ni soumission depuis une autre branche. Le cache n’est pas un journal durable : s’il est évincé ou supprimé, la prochaine exécution vérifie puis renvoie le lot complet. Une interruption après réception et avant sauvegarde peut aussi produire un doublon ; le mécanisme ne promet pas une livraison exactement une fois.

## Lire les résultats

Consulter **Actions → IndexNow after production deployment → résumé**, puis l’artefact **indexnow-…**, fichier `result.json` (conservé 30 jours).

| État | Sens |
|---|---|
| `pending-deployment` | Le build ou certaines pages ne sont pas encore visibles en production. Aucune URL envoyée ; nouveau contrôle à l’exécution suivante. |
| `unchanged` | Le contenu a déjà été soumis ; aucun nouvel envoi. |
| `submitted`, HTTP 200 | Le moteur a reçu les URLs. Ce n’est pas une confirmation d’indexation. |
| `submitted`, HTTP 202 | URLs reçues, mais vérification de la clé encore en attente. |
| `error` | Accès bloqué, erreur réseau/origine, preuve invalide, `noindex`, manifeste invalide ou refus IndexNow. Le job échoue et le dernier reçu réussi est conservé. |

Les erreurs 429/5xx ne sont pas relancées en boucle : le contrôle horaire suivant réessaie. Si la réponse est ambiguë après une coupure réseau, un doublon est possible. Le script contacte uniquement le domaine canonique et l’endpoint officiel `https://api.indexnow.org/indexnow`, sans transmettre de données visiteurs ni de jeton GitHub.

**Une exécution verte n’implique pas forcément un envoi** : lire son état et le nombre d’URLs. Ne jamais interpréter `indexed: false` comme un verdict Bing négatif ; ce champ rappelle que le script ne prouve pas l’indexation.

## Premier déploiement et diagnostic

Après le push du propriétaire et le pull Plesk, vérifier que `/indexnow-manifest.json` et le fichier de preuve répondent 200. Le premier envoi ne peut pas être validé avant cette publication. Aucun envoi avec une clé non publiée ne doit être tenté pour contourner cette étape.

Le script utilise `User-Agent: PrivacyScore-IndexNow/1.0 (+https://www.privacyscore.fr/)`, sans fausse identité de Googlebot/Bingbot. En cas de 403, examiner l’événement Cloudflare correspondant ; ne pas désactiver globalement le WAF ni autoriser tous les visiteurs qui déclarent ce User-Agent. Les réponses 521/5xx sont des erreurs d’accès, pas des confirmations de publication.

Le CDN doit servir le HTML construit sans injection ni transformation. Une modification HTML à la volée (par exemple une nouvelle injection Cloudflare) ou un ancien cache peut empêcher la correspondance des empreintes ; le résumé cite l’URL concernée. Inspecter la différence et les règles de cache avant de modifier ce contrôle. Une ancienne version encore en cache peut retarder l’envoi ; elle ne provoque pas l’envoi du nouveau contenu prématurément.

Commande locale optionnelle après build : `pnpm indexnow:submit`. Elle peut réellement notifier IndexNow si le build est déjà publié ; elle conserve son état sous `.indexnow/` et son rapport sous `reports/indexnow/`, tous deux ignorés par Git. Les tests n’utilisent jamais le vrai endpoint de soumission.

## Vérifier dans Bing

Dans **Bing Webmaster Tools → privacyscore.fr** :

- **Sitemaps** : vérifier `https://www.privacyscore.fr/sitemap-index.xml`, son état, sa dernière lecture et les URLs découvertes.
- **IndexNow** : consulter les dernières soumissions, leur source et les problèmes remontés. Le tableau peut être mis à jour après le reçu HTTP ; l’écran de présentation ne prouve pas une activation.
- **URL Inspection** : saisir une URL canonique complète avec `https://www.privacyscore.fr/`. **Bing Index** décrit la connaissance actuelle du moteur ; **Live URL** teste l’accessibilité actuelle. Distinguer découverte, autorisation d’exploration, autorisation d’indexation et présence dans l’index.

Le protocole partage les notifications entre les moteurs participants ; l’indexation reste leur décision. Search Console et ses demandes Google sont un suivi séparé. Cloudflare Crawler Hints reste désactivé pour conserver ici une source explicite de soumission et des reçus par lot.

Références : [protocole IndexNow](https://www.indexnow.org/documentation), [FAQ IndexNow](https://www.indexnow.org/faq), [déclencheurs GitHub](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), [cache GitHub](https://github.com/actions/cache).
