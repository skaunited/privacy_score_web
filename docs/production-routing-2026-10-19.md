# Cookies et sélecteur de langue — 19 octobre 2026

Le contrôle « Choix des cookies » / « Cookie choices » est placé après les CGU dans la colonne Légal / Legal du footer. Il a l'aspect des liens voisins et reste un bouton sémantique, puisque son action rouvre les préférences de consentement. Le refus, l'acceptation, le retrait et le retour du focus restent actifs.

## Observation de la production

Vérifications GET sans suivi automatique de redirection, avec préférence de langue française, puis navigation Chrome dans un contexte neuf `fr-FR` :

- `/` répond **200**, document anglais, canonical à la racine. Une query de diagnostic donne également l'anglais.
- `/fr/` répond **200**, document français ; son lien EN pointe vers `/`.
- Le clic sur EN depuis `/fr/`, puis un rechargement, restent bien sur `/` en anglais dans cette session neuve.
- `/en/` répond encore **200** avec un meta refresh vers `/`. Cela confirme que la vraie 301 de migration n'est pas active pour cette URL lors du contrôle.
- La CSP effective autorise uniquement les scripts et connexions de même origine : elle bloque le tag Google fourni même après consentement.

Le propriétaire observe un retour à `/fr/` dans son navigateur habituel. Les règles fournies ne comportent aucune redirection automatique de `/` vers `/fr/`. Un ancien document racine qui choisissait la langue ou une redirection en cache sont des hypothèses cohérentes ; la cause exacte dans ce profil n'est pas confirmée. Le contrôle ne permet pas d'exclure une autre règle conditionnelle située ailleurs dans Plesk/Cloudflare.

Tester le clic EN dans une fenêtre privée. S'il fonctionne, purger le cache du site dans le navigateur habituel et recharger la racine. Si le retour à `/fr/` existe aussi en privé, relever la chaîne de navigation/réponses et examiner la configuration effective de l'origine et les règles Cloudflare. Une nouvelle réponse `no-cache` ne supprime pas à distance une ancienne entrée déjà stockée par le navigateur.

## Configuration prête à appliquer

Dans **Plesk → Apache & nginx Settings → Additional nginx directives**, remplacer le bloc fourni par le contenu de [`deploy/plesk-additional.nginx.conf`](../deploy/plesk-additional.nginx.conf), sans ajouter les deux extraits séparément. Aucun réglage serveur n'a été changé pendant cette préparation.

Le fichier conserve les protections existantes, ajoute les vraies 301 de migration, autorise Google dans la CSP tout en conservant le consentement dans le code, et fait revalider le HTML. Les ressources Astro conservent un cache d'un an avec `immutable`, les fichiers stables sous `/assets/` une heure. Les certificats, le document root et le choix d'hôte restent gérés par Plesk.

Validation : syntaxe correcte sur Nginx 1.30.6 isolé ; **210 requêtes HTTP réussies**, couvrant les 22 pages indexables, variantes `index.html`, anciennes URLs, paramètres, absence de boucle, 404 personnalisée, CSP unique et caches. Les neuf tests navigateur passent, dont le contrôle cookies dans Légal et les clics FR → EN → FR avec préférence française. La configuration complète générée par Plesk reste à valider sur le serveur.

Références : [Nginx, variables de requête](https://nginx.org/en/docs/http/ngx_http_core_module.html#var_request_uri), [redirections](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html), [expiration et héritage des en-têtes](https://nginx.org/en/docs/http/ngx_http_headers_module.html).
