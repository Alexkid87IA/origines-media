# Vérification AdSense Origines Media

Date : 8 octobre 2026. Contrôle public en lecture seule et comparaison avec le code local corrigé.

## Problème confirmé

Le robot Mediapartners-Google reçoit sur les douze articles examinés une réponse HTTP 200 dont le corps ne contient que le message demandant JavaScript (99 caractères). Googlebot reçoit le texte complet d’un article testé séparément. Les règles du projet ne reconnaissaient pas le robot AdSense. Cela confirme un défaut d’accès au contenu. Cela ne prouve pas que ce défaut soit l’unique raison du refus AdSense du 26 septembre.

## Corrections réalisées

- Ajout de Mediapartners-Google et AdsBot-Google aux 51 règles de rendu HTML existantes. Le navigateur habituel conserve le parcours React.
- Accueil : titres, extraits et liens réels tirés du même flux public que la page React. La compilation Vercel déplace son entrée de index.html vers app.html afin que le fichier statique ne masque pas le routage du robot. Les compilations locales conservent index.html.
- Articles : texte principal et ancien champ body, auteur, liens internes résolus, encadrés avec leurs références, accordéons et points clés.
- Pages de confiance : texte généré depuis les quatre pages React existantes, régénéré avant chaque compilation. Aucune information juridique ni éditoriale ajoutée.
- Contenu absent : réponse 404 et noindex. Incident du CMS : réponse temporaire 503 avec Retry-After, sans mise en cache d’une page vide.

## Résultats avec les données publiques réelles

Les douze articles présentent un auteur et une section de sources. Les références bibliographiques n’ont pas été validées individuellement. La longueur est descriptive, pas un seuil Google. Quarante points clés ont été vérifiés dans le HTML corrigé.

| Article | Mots du texte principal | Caractères publics pour AdSense | Caractères du rendu corrigé | Points clés conservés |
| --- | ---: | ---: | ---: | ---: |
| corps-comprendre-bouffees-chaleur-thermostat-cerveau-perimenopause | 1877 | 99 | 13290 | 4 |
| liens-comprendre-education-sexualite-ecole-evars-classe | 1569 | 99 | 10644 | 5 |
| esprit-reflexions-confier-chatbot-absence-jugement | 1362 | 99 | 9441 | 3 |
| avenir-comprendre-capitalisme-solitude-klotz-compagnons-ia | 1611 | 99 | 11669 | 4 |
| liens-reflexions-ia-solitude-presence-sans-reciprocite | 1384 | 99 | 9555 | 0 |
| monde-comprendre-franchise-medicale-plafond-140-euros-exonerations | 1149 | 99 | 8756 | 5 |
| liens-portraits-etudiante-residence-senior-cohabitation | 1581 | 99 | 11714 | 4 |
| corps-reflexions-perimenopause-brouillard-cognitif-mal-nomme | 1460 | 99 | 9821 | 3 |
| avenir-temoignages-confier-chatbot-non-jugement-parole | 1491 | 99 | 10698 | 3 |
| monde-reflexions-franchise-medicale-plafond-140-euros-soin | 1293 | 99 | 8956 | 0 |
| avenir-portraits-ramanujan-genie-intuition-cambridge | 1746 | 99 | 12953 | 6 |
| liens-reflexions-se-confier-inconnu-intimite-faible-cout | 1330 | 99 | 8878 | 3 |

| Page | HTTP public | Caractères publics pour AdSense | HTTP corrigé local | Caractères corrigés locaux |
| --- | ---: | ---: | ---: | ---: |
| / | 200 | 99 | 200 | 6572 |
| /articles | 200 | 99 | 200 | 4604 |
| /a-propos | 200 | 99 | 200 | 3884 |
| /contact | 200 | 99 | 200 | 423 |
| /mentions-legales | 200 | 99 | 200 | 3293 |
| /confidentialite | 200 | 99 | 200 | 3291 |
| /ads.txt | 200 | 58 | 200 | 58 |
| /robots.txt | 200 | 1240 | 200 | 1240 |

Douze liens internes sélectionnés depuis ces articles répondent HTTP 200 et contiennent du texte avec Googlebot. Le sitemap public contient 1 274 URL, dont 792 URL d’articles. Il n’y a pas eu de revue éditoriale exhaustive de toutes ces pages.

## ads.txt et robots.txt

Le fichier public https://www.origines.media/ads.txt répond HTTP 200. Il est identique au fichier local et contient google.com, pub-1236201752351510, DIRECT, f08c47fec0942fa0. L’identifiant correspond à la configuration du site. Aucun changement d’identifiant nécessaire. Le robots.txt public est accessible ; il n’interdit pas explicitement Mediapartners-Google.

## Validation et reproduction

- Dix tests ciblés passent : routage des robots et du navigateur normal, entrée Vercel, accueil, contenu et références, pages de confiance, encodage, pages absentes, incident du CMS, identifiant publicitaire.
- Vérification TypeScript des fichiers serveur modifiés : réussie.
- Compilation complète : réussie dans une copie temporaire propre avec les dépendances exactes du package-lock.json ; 2 431 modules, 6,31 secondes. Les dix tests ont également réussi dans cette copie. Les dépendances originales n’ont pas été remplacées.
- Scripts : node scripts/generate-static-pages.mjs ; node --test scripts/adsense.test.mjs ; node scripts/audit-adsense.mjs /private/tmp/origines-adsense-audit.
- Les captures HTML et le détail des résultats ont été enregistrés dans /private/tmp/origines-adsense-audit.

## Déploiement et contrôle en production

Alex a explicitement autorisé le push et le déploiement le 8 octobre 2026. Le premier déploiement du commit 1f82461 a été confirmé actif sur www.origines.media. Un nouveau contrôle public a confirmé le texte complet des douze articles, des cinq autres pages et les douze liens internes. Les caractères publics sont devenus identiques à la colonne corrigée. Le rapport est enregistré dans /private/tmp/origines-adsense-production-audit/report.json.

Ce contrôle a aussi révélé un second problème sur l’accueil : Vercel servait index.html avant la réécriture conditionnelle, malgré la règle présente. La correction d’entrée Vercel est incluse dans cette version. Son résultat public doit être confirmé après ce second déploiement avec node scripts/audit-adsense.mjs /private/tmp/origines-adsense-production-final --require-live-match. Ce mode compare le contenu public complet au rendu attendu et échoue au moindre écart.

Les tableaux ci-dessus conservent les mesures initiales pour montrer le défaut avant correction. Ils ne représentent plus l’état actuel des articles. Le nouvel examen AdSense doit suivre la mise en ligne et sa vérification. L’acceptation reste une décision de Google.

Deux points préexistants doivent être contrôlés séparément : les mentions légales indiquent OVH alors que ce projet possède une configuration Vercel ; le formulaire de contact simule actuellement un envoi sans service de transmission. Ces constats ne sont pas présentés comme les causes confirmées du refus.
