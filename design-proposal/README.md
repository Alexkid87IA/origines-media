# Design Proposal — Homepage V2

Prototype HTML/CSS/JS autonome de la **future homepage Origines Media**.
Vit en parallèle du site React pour ne rien casser en prod.

---

## Comment ouvrir

### Option 1 — Ouverture directe (le plus simple)
Double-clic sur `homepage-v2.html` depuis le Finder.
Le navigateur par défaut l'ouvre et les images chargent via chemins relatifs.

### Option 2 — Serveur local
```bash
cd "/Users/alexquilghini1/Documents/origines media front/design-proposal"
python3 -m http.server 1489
```
Puis ouvrir http://localhost:1489/homepage-v2.html

---

## Contenu du dossier

```
design-proposal/
├── homepage-v2.html          ← Prototype complet (1 seul fichier ~280 Ko)
├── README.md                 ← ce fichier
├── logo-black.png            ← Logo officiel (usage watermark / badges clairs)
├── logo-white.png            ← Logo détouré blanc (usage sur fonds sombres)
├── logo-origines.png         ← Version complète
├── hero-cover.jpg            ← Cover hero par défaut
├── cover-01.jpg → 05.jpg     ← 5 covers pour le carousel "La une du jour"
├── series/                   ← 6 posters des séries originales (authentiques)
├── histoires/                ← 6 images des thématiques communauté (authentiques)
└── recos/                    ← 10 images des types de recommandations (authentiques)
```

---

## Architecture du prototype

Le fichier `homepage-v2.html` contient **toutes les sections** de la homepage
dans un seul document, avec CSS inline (pas de dépendances externes hormis
Google Fonts : Archivo, Fraunces, Inter Tight, JetBrains Mono).

### Enchaînement des sections

| # | Section | Rôle | Scores |
|---|---------|------|--------|
| — | Navbar + ticker + sub-nav univers | Navigation + signal live | — |
| 01 | **La une du jour** | Carousel 5 unes rédac, point d'entrée quotidien | SEO ★★★ · Marque ★★★ |
| 02 | **Le Fil** | 6 sujets chauds — maillage SEO agressif | SEO ★★★ · Rétent ★★★ |
| 03 | **Aujourd'hui en 3 contenus** | Article + Vidéo 9:16 + Histoire | Marque ★★★ · Rétent ★★★ |
| 04 | **Newsletter inline** | Capture email mi-page | Conv ★★★ |
| 05 | **Séries originales (V2)** | Featured avec épisode en cours + 5 cartes à statuts | Rétent ★★★ |
| 06 | **Vidéos** | 1 hero 16:9 + 4 shorts 9:16 + 3 secondaires + CTA chaîne | Rétent ★★★ |
| 07 | **Raconte ton histoire** | Bannière ink, inverse flux, pipeline UGC | Conv ★★★ · Marque ★★★ |
| 08 | **Histoires de la communauté** | 1 featured + 6 thématiques UGC | Marque ★★★ |
| 09 | **Recommandations culturelles** | 1 coup de cœur + 3 recos + 10 chips types | Marque ★★★ |
| 10 | **Boutique & Academy** | À faire — monétisation |  |
| — | Footer éditorial | Sitemap + manifeste | SEO ★★★ |

---

## Contrats respectés

### Brand Bible
- Typo : **Archivo 900** (titres), **Fraunces italic** (serif éditorial),
  **Inter Tight** (body), **JetBrains Mono** (méta/tags)
- Couleurs : **ink #0A0A0A**, **paper #F7F5F0**, stones (gris)
- **Les 10 couleurs catégories** (psycho, société, famille, voyage, spiritualité,
  carrière, art, santé, tech, business) sont réservées aux éléments éditoriaux
  rattachés à leur univers.
- Aucune couleur arbitraire n'est utilisée sur les sections transverses
  (NL, share-story, titres généraux).

### SEO structurel
- 1 seul `<h1>` par page (hero) + `<h2>` sur chaque section + `<h3>` sur cards
- Tous les articles liés en `<a href>` dans le HTML statique (crawlables)
- `<time datetime>` pour toutes les dates
- Alt descriptifs sur les images
- **JSON-LD multi-types** dans `<head>` :
  - WebSite + Organization + BreadcrumbList
  - NewsArticle ×4 (hero unes)
  - Article / VideoObject / SocialMediaPosting
  - ItemList ×5 (Le Fil, séries, histoires, types recos, unes)
  - PodcastSeries ×6 (séries)
  - VideoObject ×4 (vidéos mises en avant)
  - Review (coup de cœur reco) + Book + Rating
- 4 `<article>` SEO-hidden pour crawler les unes du carousel non visibles

### Accessibilité
- Balises sémantiques (`section`, `article`, `nav`, `aside`, `figure`, `blockquote`, `time`)
- `aria-labelledby` / `aria-label` / `aria-hidden` corrects
- `@media (prefers-reduced-motion: reduce)` sur toutes les animations
- `role="progressbar"` + `aria-valuenow` sur la barre série
- Honeypot anti-spam invisible dans le form newsletter

### Responsive
- **≥1081px** : desktop full
- **881–1080px** : laptop — grilles resserrées, tailles de titres réduites
- **641–880px** : tablet — 2 colonnes max, shorts en 2×2
- **≤640px** : mobile — tout en colonne, CTAs pleine largeur

---

## Comment éditer / itérer

Toute modif se fait directement dans `homepage-v2.html` :
- **Styles** : bloc `<style>` en haut du fichier
- **Sections** : chacune est commentée `<!-- ===== SECTION XX — NOM ===== -->`
- **JS** : bloc `<script>` en bas (carousel, intro reveal, scroller univers)

---

## Prochaines étapes possibles

### Intégration React (quand prêt)
Transformer chaque section en composant React dans
`src/components/homepage-v2/SectionXX.tsx`, puis remplacer progressivement
`src/pages/HomePage.tsx`.

### Alimentation CMS
Les données sont actuellement **hardcodées**. Pour passer en prod, il faut :
- Hero carousel → `FEATURED_ARTICLES_QUERY` Sanity
- Le Fil → nouveau schema Sanity `trendingTopics`
- Triad → nouveau schema `dailyMix` ou queries existantes
- Newsletter → API `/api/subscribe` déjà en place
- Séries → `SERIES_QUERY` existant + nouveaux champs (épisode en cours, statut)
- Vidéos → `VIDEOS_QUERY` + distinguer format 16:9 vs 9:16
- Share-story → form déjà existant sur `/share-story`
- Histoires → `PORTRAITS_QUERY` existant
- Recos → `RECOMMENDATIONS_QUERY` existant

### Sections restantes à coder
- **#10 Boutique & Academy** (monétisation, dernier bloc avant footer)
- **Footer** refondu (manifeste + sitemap 6 colonnes) — remplacerait l'actuel

---

## Durée de vie de ce dossier

Ce dossier est **temporaire** : il sera retiré du repo quand le V2 sera
complètement converti en React et mergé dans `src/`. D'ici là, il sert de
**référence visuelle** pour toute session Claude (et humaine) qui travaille
sur la refonte.

---

*Dernière mise à jour : 21 avril 2026*
