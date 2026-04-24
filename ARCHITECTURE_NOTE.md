# Origines Media — Architecture du site (avril 2026)

Note de contexte pour briefer un autre agent Claude Code sur l'état actuel du projet.

---

## Stack technique

- **Frontend** : Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion
- **CMS** : Sanity (project `r941i081`, dataset `production`)
- **Client Sanity** : `src/lib/sanity.ts` — fonction `sanityFetch<T>(query, params)` qui appelle l'API CDN Sanity
- **Requetes GROQ** : `src/lib/queries.ts` — toutes les queries sont centralisées ici
- **Routing** : React Router v6 — routes definies dans `src/App.tsx`
- **Design system V2** : CSS Modules (`.module.css`) avec variables CSS custom (`--paper`, `--ink`, `--stone*`, `--display`, `--body`, `--mono`, `--serif`)

---

## Architecture des contenus Sanity

### Types de documents principaux

| Type Sanity       | Description                          | Page frontend             |
|-------------------|--------------------------------------|---------------------------|
| `production`      | Articles, videos, guides, interviews | `/article/:slug`, `/video/:slug` |
| `portrait`        | Histoires / temoignages              | `/histoire/:slug`         |
| `recommendation`  | Recommandations (livres, films...)   | `/recommandations/:slug`  |
| `verticale`       | 10 sous-categories editoriales       | Legacy, toujours reference |
| `serie`           | Series editoriales                   | `/series/:slug`           |

### Taxonomie : Univers vs Verticales

C'est le point le plus important a comprendre.

**5 Univers** (macro-categories, definies en frontend dans `src/data/univers.ts`) :

| ID       | Nom         | Couleur   | Verticales associees                    |
|----------|-------------|-----------|----------------------------------------|
| `esprit` | L'Esprit    | `#7B5CD6` | Psychologie, Spiritualite              |
| `corps`  | Le Corps    | `#5AA352` | Sante                                  |
| `liens`  | Les Liens   | `#E67839` | Famille, Societe                       |
| `monde`  | Le Monde    | `#2E9B74` | Voyage, Art & Creativite               |
| `avenir` | L'Avenir    | `#2E94B5` | Carriere, Technologie, Business        |

**10 Verticales** (sous-categories dans Sanity, documents `_type == "verticale"`) :
Psychologie, Spiritualite, Sante, Famille, Societe, Voyage, Art & Creativite, Carriere, Technologie, Business

**Champ `univpilar`** (nouveau, avril 2026) : champ string enum directement sur les `production` dans Sanity. Valeurs : `"esprit"`, `"corps"`, `"liens"`, `"monde"`, `"avenir"`. Ajoute en plus du champ `verticale` (reference) qui reste present.

**Mapping verticale → univers** : fonction `verticaleToUnivers()` dans `src/data/univers.ts` — utilise un dictionnaire `VERTICALE_TO_UNIVERS` pour convertir un slug/nom de verticale en UniversId.

**Tags sur les productions** : stockes comme **tableau de strings** (PAS des references). Exemple : `["creativite", "art", "voyage"]`. Les queries GROQ qui font `tags[]->` ne fonctionnent PAS — il faut utiliser `tags` directement.

### Affichage des categories (kickers)

Sur le site, les kickers (petits labels au-dessus des titres) affichent le **nom de la verticale** (ex: "Psychologie", "Famille") pour le SEO, pas le nom de l'univers (ex: "L'Esprit", "Les Liens"). La couleur du kicker correspond a l'univers parent.

---

## Pages principales

### Home Page V2 (`src/pages/HomePageV2.tsx`)

Page d'accueil complete avec 10+ sections, toutes alimentees par Sanity :

1. **IntroOverlay** — animation d'entree
2. **Ticker** — bande defilante
3. **SiteHeader** — header avec mega menu
4. **HeroCarousel** — article principal + 3 secondaires (diversifies par verticale)
5. **Interlude1**
6. **Spotlight** — "Choix de la redaction" (1 article star + 3 editoriaux)
7. **Feed** — flux de 16 articles avec filtres par univers, tri, recherche
8. **Triad** — grille par univers avec articles
9. **Interlude2**
10. **VideoChannel** — videos recentes
11. **Immersions** — articles long-format (>15 min)
12. **Interlude3**
13. **Voix** — portraits / histoires
14. **Interlude4**
15. **Recos** — recommandations
16. **Shop** — boutique
17. **Marquee** — bande defilante
18. **Footer2**

Les fonctions de mapping CMS dans `HomePageV2.tsx` :
- `toCMSArticle()`, `toCMSSpotlight()`, `toCMSEditorial()`, `toCMSFeedItem()`, `toCMSImmersion()`, `toCMSStory()`, `toCMSReco()`
- `diversifyByVerticale(articles, count)` — selectionne des articles de verticales differentes pour la diversite
- `verticaleToUnivers()` — convertit une verticale en univers
- `authorName` est recupere via `author->name` dans les queries GROQ (pas `verticaleNom`)

### Articles Page V2 (`src/pages/ArticlesPageV2.tsx`)

Page d'archive avec :
- **Sidebar desktop** : filtres par univers (5 boutons utilisant `univpilar`) + nuage de tags (construit dynamiquement depuis les tags string des articles)
- **Toolbar** : recherche textuelle + tri (recent/populaire/A-Z)
- **Grille** : cards avec kicker verticale, auteur, date, excerpt
- **Pagination** : 12 articles/page
- **URL params** : `?univers=esprit`, `?tag=resilience`, `?q=recherche`, `?tri=popular`, `?page=2`
- **Query inline** : fetch direct avec `sanityFetch()`, pas via `queries.ts`
- **CSS** : `src/pages/ArticlesPageV2.module.css`

### Article Page V2 (`src/pages/ArticlePageV2.tsx`)

Page de detail d'article — utilise `ARTICLE_BY_SLUG_QUERY` depuis `queries.ts`.

---

## Navigation (SiteHeader)

Le header (`src/components/SiteHeader/SiteHeader.tsx`) contient :

- **Logo** avec animation square → target
- **Bouton "Univers"** qui ouvre un **mega menu** avec les 5 univers + leurs subtopics (definis dans `src/data/univers.ts`)
- **6 liens secondaires** avec dropdowns :
  - Articles (par univers : `?univers=esprit`, etc.)
  - Collections (Le Divan, Le Signal, La Lettre, Le Carnet, Le Virage)
  - Videos (par format : reportages, documentaires, interviews, shorts, live)
  - Guides (masterclass, ateliers, programmes, kits)
  - Ensemble (histoires, recommandations, newsletter, etc.)
  - Boutique
- **Barre de recherche** (expand/collapse)
- **CTA "Racontez votre histoire"**
- **Compte utilisateur** avec dropdown

Le mega menu Univers charge ses donnees depuis `src/data/univers.ts` (UNIVERS array) — chaque univers a 8 subtopics avec slugs.

---

## Composants V2 principaux

Tous dans `src/components/`, chacun avec son `.module.css` :

| Composant        | Fichier                                  | Role                                   |
|------------------|------------------------------------------|-----------------------------------------|
| SiteHeader       | `SiteHeader/SiteHeader.tsx`              | Header + mega menu + recherche          |
| HeroCarousel     | `HeroCarousel/HeroCarousel.tsx`          | Carousel hero avec article principal    |
| Spotlight        | `Spotlight/Spotlight.tsx`                | Selection editoriale + canaux           |
| Feed             | `Feed/Feed.tsx`                          | Flux d'articles avec filtres            |
| Triad            | `Triad/Triad.tsx`                        | Grille articles par univers             |
| VideoChannel     | `VideoChannel/VideoChannel.tsx`          | Section videos                          |
| Immersions       | `Immersions/Immersions.tsx`              | Articles long-format                    |
| Voix             | `Voix/Voix.tsx`                          | Portraits / temoignages                 |
| Recos            | `Recos/Recos.tsx`                        | Recommandations                         |
| Shop             | `Shop/Shop.tsx`                          | Produits boutique                       |
| Footer2          | `Footer2/Footer2.tsx`                    | Footer V2                               |
| Interludes       | `Interludes/Interludes.tsx`              | Separateurs visuels                     |
| Ticker           | `Ticker/Ticker.tsx`                      | Bande defilante                         |
| IntroOverlay     | `IntroOverlay/IntroOverlay.tsx`          | Animation d'entree du site              |

---

## Fichiers cles a connaitre

| Fichier                        | Contenu                                              |
|--------------------------------|------------------------------------------------------|
| `src/App.tsx`                  | Routes React Router                                  |
| `src/data/univers.ts`          | 5 univers, subtopics, mapping verticale→univers       |
| `src/lib/queries.ts`           | Toutes les queries GROQ Sanity                       |
| `src/lib/sanity.ts`            | Client Sanity + `sanityFetch()`                      |
| `src/lib/universColors.ts`     | Couleurs des univers (UniversColor interface)         |
| `src/styles/tokens.ts`         | Design tokens                                        |
| `src/index.css`                | Variables CSS globales, fonts                         |
| `CLAUDE_STYLE_GUIDE.md`        | Guide de style complet pour le design V2             |
| `CLAUDE.md`                    | Instructions pour Claude Code                        |

---

## Conventions CSS V2

- **Variables** : `--paper` (fond creme `#F7F5F0`), `--ink` (noir `#0A0A0A`), `--stone50` a `--stone800`, `--pure` (blanc)
- **Fonts** : `--display` (Archivo), `--body` (Inter Tight), `--mono` (JetBrains Mono), `--serif` (Fraunces italic)
- **Cards** : angular (0 border-radius), border `1px solid var(--stone100)`, pas de glow
- **Kickers** : mono, 9-11px, uppercase, letter-spacing 0.12-0.14em, avec dot colore
- **Container** : classe `.v2-container` (definie globalement)
- **Responsive** : breakpoints a 1280, 1024, 880, 640, 480, 360px
- **Animations** : subtiles, `cubic-bezier(.2,.7,.2,1)`, `prefers-reduced-motion` respecte

---

## Points d'attention / pieges connus

1. **Tags = strings, pas references** : sur `production`, `tags` est un `string[]`. Ne JAMAIS faire `tags[]->`.
2. **`verticale` toujours presente** : meme avec `univpilar`, le champ `verticale` (reference) existe toujours. Utiliser `verticale->nom` pour les kickers SEO.
3. **Diversite des articles** : utiliser `diversifyByVerticale()` quand on fetch un pool d'articles pour eviter d'afficher N articles du meme univers.
4. **Auteur** : toujours via `author->name`, jamais `verticaleNom` (bug corrige en avril 2026).
5. **Pages legacy vs V2** : les pages suffixees `V2` sont les actuelles. Les pages sans suffixe (`HomePage.tsx`, `ArticlesPage.tsx`) sont legacy mais toujours routees dans `App.tsx`.
6. **CSS Modules** : tous les composants V2 utilisent des CSS Modules (`.module.css`), pas Tailwind inline.

---

*Note generee le 24 avril 2026.*
