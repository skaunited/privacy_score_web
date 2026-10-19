# Restauration visuelle — 19 octobre 2026

À la demande du propriétaire, la présentation et les textes de l'accueil FR/EN reviennent à la version `df3bf12` : titres, barre sur « not », téléphone, score 77, encart « Trackers blocked today / 2487 », « Encrypted DNS / On », trois piliers, récit illustré, citation, navigation et sections d'origine. Les deux nouvelles sections d'accueil sont retirées. Les pages du blog retrouvent leur présentation précédente.

Les articles réécrits et les nouveaux guides restent publiés. Les routes anglaises à la racine, le français sous `/fr/`, les redirections, les canonical/hreflang, les métadonnées, Analytics/consentement et la pipeline restent en place. Les conditions commerciales corrigées sont conservées dans la FAQ et les pages légales. Les chiffres du téléphone sont une illustration fournie par le propriétaire.

Les icônes originales Material Icons Round remplacent les SVG introduits lors de la refonte. Le sous-ensemble local de 20 pictogrammes conserve exactement leurs tracés, métriques et ligatures, avec une taille de 3 252 octets. Leurs dimensions sont réservées avant chargement pour éviter les décalages. Quelques textes gris conservent une légère correction de contraste ; les listes et dates utilisent un balisage accessible sans modifier leur composition.

Vérifications locales :

- Même navigateur et même viewport : dimensions et positions du titre, du téléphone, des piliers et des icônes identiques au build d'origine, en français et en anglais.
- Build Astro sans erreur, avertissement ni indication ; 22 URLs indexables et huit articles conservés.
- Liens internes, ressources, fragments, JSON-LD et 208 cas de redirection validés.
- Sept tests navigateur réussis, avec contrôles des encarts, des huit panneaux et des trois icônes, en plus du consentement et de l'accessibilité.
- Douze audits Lighthouse : performance médiane 96 sur mobile et 100 sur ordinateur, dans les deux langues ; autres catégories à 100. Seuils de la pipeline inchangés. Mesures de laboratoire locales, pas des performances de production.

Cette correction est préparée localement sur `main`. Le propriétaire effectue le push ; GitHub construit ensuite `deploy`, à récupérer depuis Plesk.
