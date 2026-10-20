# IndexNow et vérification Bing — 20 octobre 2026

## Intégration préparée localement

- Génération du manifeste de **22 pages canoniques** et du fichier de preuve avec le build.
- Vérification de la production après la pipeline et chaque heure pour accompagner le pull Plesk manuel.
- Soumissions incrémentales, contrôle du contenu effectivement publié, reçus HTTP et rapports privés GitHub Actions.
- Aucune publication, aucun push ni changement Plesk/Cloudflare durant cette intervention. La première réception réelle 200/202 ne peut être confirmée avant publication du nouveau fichier de preuve par le propriétaire.
- Le script réel exécuté contre la production renvoie **`pending-deployment`**, sans POST IndexNow : la preuve et le manifeste ne sont pas encore publiés.

Procédure : [../indexnow.md](../indexnow.md).

## Contrôles techniques

- `pnpm test:deployment` : **38 tests réussis**, dont 13 tests IndexNow (prématurité, incrément, suppression/redirection, preuve, noindex, WAF/origine, refus 4xx/5xx, 202, entrées étrangères/corrompues, bascule concurrente, UTF-8, génération, premier build absent et limite de taille).
- `pnpm check` : Astro **46 fichiers sans diagnostic**, build, **35 HTML / 22 pages indexables / 8 articles**, liens et données structurées validés ; **208 vérifications de redirection** réussies.
- `TEST_BUILT_SITE=1 pnpm test:browser` : **26 tests réussis** sur le build, dont Analytics/consentement/campagne Apple et accessibilité. Google est intercepté dans ces tests.
- Syntaxe YAML des workflows validée ; l’abonnement `workflow_run` correspond exactement au nom `Test, build and publish`. Les nouveaux jobs n’ont pas été exécutés dans GitHub, puisqu’aucun push n’est effectué.
- GET publics sur les **22 URLs** avec l’identité du futur client IndexNow : **22 réponses 200**, contenu HTML identique au build, canonical exact, aucune directive `noindex` HTTP/HTML. [Résultats](public-check.json).
- Contrôle complémentaire du guide EN d’export avec un User-Agent déclaré Bingbot : 200, canonical exact et aucune directive `noindex`. Un User-Agent seul ne prouve pas l’identité d’un robot vérifié et ce test ne remplace pas le crawl réel de Bing.

## Résultats Bing

Source : interface authentifiée **Bing Webmaster Tools**, propriété existante `https://privacyscore.fr/`, inspection des URLs canoniques `https://www.privacyscore.fr/…`.

Le sitemap `https://www.privacyscore.fr/sitemap-index.xml` affiche **Success**, envoi et dernière lecture le **20 octobre**, avec **22 URLs découvertes** au total. La ligne de l’index de sitemaps compte un sous-sitemap ; ce n’est pas une seule page du site. Le menu IndexNow affiche encore l’écran de présentation/mise en place, sans tableau de soumissions disponible.

| Article | Verdict dans Bing Index |
|---|---|
| `/fr/blog/audit-confidentialite-iphone/` | Indexed successfully — URL can appear on Bing |
| `/fr/blog/rapport-confidentialite-iphone-guide/` | Indexed successfully — URL can appear on Bing |
| `/blog/export-app-privacy-report/` | URL cannot appear on Bing |
| `/blog/iphone-permissions-guide/` | URL cannot appear on Bing |
| `/blog/iphone-privacy-settings-2026/` | Discovered but not crawled — URL cannot appear on Bing |
| `/blog/app-privacy-report-empty/` | URL cannot appear on Bing |
| `/fr/blog/importer-rapport-confidentialite-iphone/` | URL cannot appear on Bing |
| `/fr/blog/rapport-confidentialite-iphone-vide/` | URL cannot appear on Bing |

Les cinq verdicts génériques négatifs détaillent une découverte le 20 octobre, une récupération réussie et **« Indexing allowed? No »**, sans canonical sélectionné. Le site actuel renvoie pourtant `index,follow` et aucun `X-Robots-Tag: noindex` sur les 22 pages contrôlées. Ce désaccord n’établit ni une erreur du code actuel, ni la raison du refus de Bing : ne pas conclure que tout est indexé, qu’il s’agit forcément d’un simple délai, ou que le WAF doit être désactivé.

Le test **Live URL** du guide EN d’export a renvoyé **« Error encountered while inspecting Live URL »** deux fois. Une inspection Bing Index du guide EN de réglages a également rencontré une erreur générique, puis a réussi après une seule reprise. Aucune demande d’indexation manuelle Bing n’a été envoyée pour masquer l’absence du futur reçu IndexNow.

Relevé sélectionné sans données de compte : [bing.json](bing.json). Captures locales conservées dans `reports/measurement-2026-10-20/` (ignoré par Git).

## Après le push et le pull du propriétaire

1. Ouvrir le workflow **IndexNow after production deployment** ; le lancer manuellement après le pull si l’on ne souhaite pas attendre la vérification horaire.
2. Vérifier **`submitted`**, le nombre de pages et **HTTP 200/202** dans le résumé et `result.json`. Un 202 laisse la validation de clé en attente ; aucune réponse ne garantit l’indexation.
3. Revenir à **Bing → IndexNow** pour vérifier les soumissions reçues.
4. Réinspecter les six articles non indexés et reprendre le test Live URL. Si le désaccord persiste, examiner le crawl et les événements de sécurité correspondant à de vrais robots Bing, sans affaiblir les protections sur la seule base de leur User-Agent.
