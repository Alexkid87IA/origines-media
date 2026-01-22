# Test des métadonnées Open Graph

## Comment tester après le déploiement

### 1. Tester avec les outils de validation

**Facebook Sharing Debugger**
- URL: https://developers.facebook.com/tools/debug/
- Coller l'URL d'un article (ex: `https://origines.media/article/votre-slug`)
- Cliquer sur "Scrape Again" pour forcer un nouveau crawl
- Vérifier que le titre, la description et l'image s'affichent correctement

**Twitter Card Validator**
- URL: https://cards-dev.twitter.com/validator
- Coller l'URL de l'article
- Vérifier l'aperçu de la carte

**LinkedIn Post Inspector**
- URL: https://www.linkedin.com/post-inspector/
- Coller l'URL de l'article
- Vérifier l'aperçu

**WhatsApp**
- Envoyer l'URL dans une conversation WhatsApp
- Vérifier que l'aperçu s'affiche avec l'image

### 2. Tester en ligne de commande

```bash
# Simuler un crawler Facebook
curl -A "facebookexternalhit/1.1" https://origines.media/article/votre-slug

# Simuler un crawler Twitter
curl -A "Twitterbot/1.0" https://origines.media/article/votre-slug

# Vérifier les métadonnées dans le HTML retourné
curl -A "facebookexternalhit/1.1" https://origines.media/article/votre-slug | grep "og:title"
```

### 3. Tester avec un navigateur

**Extension Chrome/Firefox**
- Installer "Meta SEO Inspector" ou "OpenGraph Preview"
- Visiter une page article
- Vérifier les métadonnées dans l'extension

### 4. Vérifier les logs Vercel

Après déploiement:
1. Aller sur votre dashboard Vercel
2. Cliquer sur votre projet
3. Aller dans "Functions" → "Edge Functions"
4. Vérifier que `api/_middleware.ts` est bien déployé
5. Consulter les logs pour voir si le middleware est appelé

## Ce qui devrait fonctionner

✅ Le titre de l'article apparaît dans les partages
✅ La description de l'article s'affiche
✅ L'image de couverture de l'article est visible
✅ Les métadonnées sont différentes pour chaque article
✅ Les utilisateurs normaux ne voient aucune différence (JavaScript fonctionne normalement)

## Déploiement

```bash
# Commit et push
git add api/_middleware.ts vercel.json
git commit -m "feat: ajout pre-rendering métadonnées Open Graph pour crawlers"
git push

# Vercel déploiera automatiquement
```

## Structure des fichiers

```
.
├── api/
│   └── _middleware.ts       # Middleware Edge qui détecte les crawlers
├── vercel.json               # Configuration Vercel avec Edge Functions
└── index.html                # HTML de base avec métadonnées par défaut
```

## Comment ça marche

1. Un crawler (Facebook, Twitter, etc.) demande une page article
2. Le middleware Edge détecte le user-agent du crawler
3. Le middleware récupère les métadonnées depuis Sanity
4. Le HTML est généré dynamiquement avec les bonnes métadonnées
5. Le crawler reçoit un HTML avec les métadonnées de l'article spécifique
6. Les utilisateurs normaux reçoivent l'HTML standard et React charge dynamiquement

## Troubleshooting

**Les métadonnées ne changent pas sur Facebook**
- Aller sur Facebook Debugger et cliquer "Scrape Again"
- Facebook met en cache les métadonnées pendant 24-48h

**Le middleware ne semble pas s'exécuter**
- Vérifier les logs Vercel Functions
- S'assurer que le fichier est bien à `api/_middleware.ts`
- Vérifier que vercel.json contient la config du middleware

**L'image ne s'affiche pas**
- Vérifier que l'URL de l'image est absolue (commence par https://)
- Vérifier que l'image est accessible publiquement
- Tester l'URL de l'image dans un navigateur

**Les métadonnées sont vides**
- Vérifier que l'article existe dans Sanity avec le slug correct
- Vérifier la requête GROQ dans le middleware
- Consulter les logs Vercel pour voir les erreurs

## Cache

Les métadonnées sont mises en cache:
- **Vercel Edge Cache**: 1 heure (s-maxage=3600)
- **Stale-while-revalidate**: 24 heures
- **Crawlers sociaux**: Variable selon la plateforme (24-48h pour Facebook)

Pour forcer un rafraîchissement, utiliser les outils de debug des plateformes.
