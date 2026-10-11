# Corrections complémentaires AdSense — 11 octobre 2026

Les corrections prolongent l’audit du 8 octobre. La vérification du paiement et l’approbation du contenu AdSense restent deux étapes distinctes.

## Changements

- Génération du texte existant de 16 pages publiques, dont les pages légales, la galaxie et les pages de présentation. Aucun témoignage, chiffre ni argumentaire supplémentaire n’est inventé.
- Catalogues réels du CMS pour la bibliothèque, les programmes, les guides et leurs catégories, la boutique, les produits recommandés, l’actualité et la découverte. Les témoignages pointent vers leurs articles réels. Les catalogues vides et les écrans de compte sont non indexables.
- Les 11 carrousels exposent leurs images et le texte de leur article compagnon existant.
- Les formats affichent leurs épisodes publiés ; retrait de l’épisode pilote de démonstration et des valeurs de vues et de likes ajoutées par défaut. Les autres données éditoriales existantes n’ont pas fait l’objet d’une certification.
- Les annotations de liens vers des articles absents conservent leur texte sans produire un lien cassé. Une projection CMS partagée applique cette règle au navigateur et au rendu HTML.
- Contact et candidatures : envoi serveur vers Brevo, réponse positive uniquement avec un identifiant de message confirmé, contrôle des champs et des tentatives répétées, maintien du texte en cas d’échec et email prérempli de secours. Adresse retenue : admin@origines.media, déjà publiée dans les mentions légales.
- Inscription aux guides : source acceptée par le serveur ; une configuration email absente ne produit plus de faux succès.
- Hébergement : remplacement d’OVH par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis. Adresse vérifiée dans la [politique de confidentialité Vercel](https://vercel.com/legal/privacy-notice) et le [DPA Vercel](https://vercel.com/legal/dpa).

## Vérification locale

- Compilation complète réussie avec le package-lock existant dans une copie de validation ; entrée Vercel app.html conservée.
- 24 tests ciblés réussis : contenu, liens, familles de pages, réponses 404/503, formulaires et abonnement aux guides.
- Vérification TypeScript serveur réussie. Le contrôle global de l’application conserve des erreurs préexistantes d’alias, de variables inutilisées et de DOMPurify ; il n’est pas présenté comme réussi.
- Formulaires vérifiés dans le navigateur à 1280 px et 390 px, y compris succès, échec, conservation du message et absence de débordement. Les confirmations email ont été simulées localement : aucun email de test n’a été transmis.
- Audit du CMS réel : 65 pages, 12 articles, 12 liens internes valides. Quatre liens vers trois cibles absentes ont été retirés du rendu, avec vérification de l’absence de ces cibles dans le CMS publié.
- Rapport avant publication : /private/tmp/origines-adsense-additional-predeploy/report.json. Les différences avec la production sont attendues avant le push de ce lot.

## Contrôle de production

Le contrôle doit suivre le push unique sur main. Aucune commande de déploiement manuel n’est nécessaire.

```text
node scripts/audit-adsense.mjs /private/tmp/origines-adsense-additional-production --require-live-match
```

GET /api/contact effectue un contrôle en lecture seule de la clé et de l’expéditeur Brevo actif, sans envoyer de message ni révéler la clé. L’expéditeur préfère noreply@origines.media, puis admin@origines.media, puis une autre adresse Origines déjà active dans Brevo. Un échec indique seulement sa catégorie (configuration, authentification, expéditeur ou disponibilité). Les variables Vercel sensibles ne sont pas exportables ; leur présence dans une exportation vide ne prouve pas qu’elles soient absentes du serveur.

Le premier contrôle en production a révélé un échec de démarrage du rendu des robots : Node ESM exige l’attribut type: json pour l’import du fichier des images de carrousel. L’import a été corrigé. Un test supplémentaire charge désormais tous les modules serveur avec le chargeur natif Node, sans regroupement préalable qui masquerait ce problème. Les 25 tests et une nouvelle compilation complète passent en local avant le push correctif.

L’acceptation AdSense reste une décision de Google. La vérification technique ne certifie pas individuellement toutes les sources, tous les témoignages ou toutes les statistiques du site.
