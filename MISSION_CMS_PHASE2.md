# Mission CMS — Phase 2 : Migration Sanity vers 5 Univers

> A executer apres la Phase 1 (integration homepage).
> Derniere mise a jour : 24 avril 2026

---

## 1. Contexte

La homepage V2 utilise **5 univers** avec 8 sous-topics chacun (40 total).
Le CMS Sanity actuel (`r941i081`, dataset `production`) utilise **10 verticales**
avec des documents `_type == "univers"` comme sous-categories.

La terminologie est inversee entre l'ancien et le nouveau systeme :

| Concept | CMS actuel | Nouveau design |
|---------|-----------|----------------|
| Categorie principale | `verticale` (10) | `univers` (5) |
| Sous-categorie | `univers` (sous verticale) | `subtopic` (8 par univers) |

---

## 2. Mapping 10 verticales → 5 univers

```
L'Esprit    ← Psychologie + Spiritualite
Le Corps    ← Sante
Les Liens   ← Famille + Societe
Le Monde    ← Voyage + Art & Creativite
L'Avenir    ← Carriere + Technologie + Business (si existe)
```

### Couleurs

| Univers | Couleur | Dark | Verticales absorbees (couleurs actuelles) |
|---------|---------|------|------------------------------------------|
| L'Esprit | #7B5CD6 | #4A2FA8 | Psychologie (#7B5CD6), Spiritualite (#5A66D6) |
| Le Corps | #5AA352 | #2A6F22 | Sante (#5AA352) |
| Les Liens | #E67839 | #B04E15 | Famille (#C99B1E), Societe (#E67839) |
| Le Monde | #2E9B74 | #0A6848 | Voyage (#2E9B74), Art & Creativite (#D64C90) |
| L'Avenir | #2E94B5 | #0A6383 | Carriere (#3E7DD6), Technologie (#2E94B5) |

---

## 3. Sous-topics (40 total)

### L'Esprit
emotions, conscience, meditation, developpement-personnel, neurosciences, philosophie, quete-de-sens, therapies

### Le Corps
nutrition, sommeil, mouvement, prevention, medecine-douce, bien-etre, sport, respiration

### Les Liens
parentalite, couples, amitie, education, generations, communaute, ruptures, enquetes-sociales

### Le Monde
recits-voyage, destinations, art, musique, litterature, cinema, creativite, photographie

### L'Avenir
carriere, entrepreneuriat, innovation, ia, economie, leadership, numerique, nomadisme

---

## 4. Plan de migration CMS

### Etape 1 — Creer les 5 nouveaux documents univers dans Sanity

Creer un nouveau type `pilier` (ou renommer `verticale`) avec ces champs :

```
_type: "pilier"
nom: string           (ex: "L'Esprit")
slug: slug             (ex: "esprit")
tagline: string        (ex: "Comprendre ce qui se joue en nous...")
couleur: string        (ex: "#7B5CD6")
couleurDark: string    (ex: "#4A2FA8")
ordre: number          (1-5)
subtopics: array of { slug: string, label: string }
```

### Etape 2 — Ajouter un champ `pilier` sur les contenus existants

Sur `production`, `portrait`, `recommendation` :
- Ajouter un champ `pilier` (reference → pilier)
- Garder `verticale` et `univers` temporairement (retrocompatibilite)

### Etape 3 — Script de migration des donnees

Assigner automatiquement le `pilier` a chaque document en fonction de sa `verticale` :

```javascript
// Pseudo-code de migration
const MAPPING = {
  'psychologie': 'esprit',
  'spiritualite': 'esprit',
  'sante': 'corps',
  'famille': 'liens',
  'societe': 'liens',
  'voyage': 'monde',
  'art-creativite': 'monde',
  'carriere': 'avenir',
  'technologie': 'avenir',
  'business': 'avenir',
};

// Pour chaque production/portrait/recommendation :
// 1. Lire verticale->slug
// 2. Trouver le pilier correspondant via MAPPING
// 3. Assigner pilier._ref
```

### Etape 4 — Assigner les sous-topics

Option A : Utiliser les documents `_type == "univers"` existants comme sous-topics
- Renommer le type `univers` en `subtopic`
- Les rattacher aux `pilier` au lieu des `verticale`

Option B : Ajouter un champ `subtopic` (string) sur chaque contenu
- Plus simple, pas de reference supplementaire
- Le slug correspond a la liste des 40 sous-topics

### Etape 5 — Migrer les queries GROQ

Toutes les queries de `src/lib/queries.ts` (25 au total) doivent etre mises a jour :

```groq
// AVANT (verticale)
*[_type == "verticale"] | order(ordre asc) [0...7] {
  "article": *[_type == "production" && references(^._id)] ...
}

// APRES (pilier)
*[_type == "pilier"] | order(ordre asc) [0...5] {
  "article": *[_type == "production" && references(^._id)] ...
}
```

#### Queries a modifier :

| Query | Fichier | Changement |
|-------|---------|------------|
| FEATURED_ARTICLES_QUERY | queries.ts:14 | verticale → pilier, [0...7] → [0...5] |
| PORTRAITS_QUERY | queries.ts:36 | Ajouter pilier->{...} |
| SERIES_QUERY | queries.ts:67 | Pas de changement (pas de verticale) |
| VERTICALES_WITH_PRODUCTIONS_QUERY | queries.ts:79 | verticale → pilier |
| VIDEOS_SECTION_QUERY | queries.ts:102 | verticale → pilier |
| VERTICALES_QUERY | queries.ts:127 | verticale → pilier |
| VERTICALES_FOR_UNIVERS_PAGE_QUERY | queries.ts:141 | Refonte complete |
| VERTICALE_DETAIL_QUERY | queries.ts:170 | verticale → pilier |
| Toutes les queries d'explorer | queries.ts:200+ | verticale → pilier |
| ARTICLE_BY_SLUG_QUERY | queries.ts | verticale → pilier |
| PORTRAIT_BY_SLUG_QUERY | queries.ts | verticale → pilier |

### Etape 6 — Mettre a jour universColors.ts

Remplacer les 20+ entrees par 5 :

```typescript
export const universColors: Record<string, UniversColor> = {
  "L'Esprit": { bg: '#7B5CD6', text: '#fff', shadow: '...', light: '#A78BE8', mid: '#7B5CD6', dark: '#4A2FA8' },
  "Le Corps":  { bg: '#5AA352', text: '#fff', shadow: '...', light: '#8FD088', mid: '#5AA352', dark: '#2A6F22' },
  "Les Liens": { bg: '#E67839', text: '#fff', shadow: '...', light: '#F5A878', mid: '#E67839', dark: '#B04E15' },
  "Le Monde":  { bg: '#2E9B74', text: '#fff', shadow: '...', light: '#6FC9A6', mid: '#2E9B74', dark: '#0A6848' },
  "L'Avenir":  { bg: '#2E94B5', text: '#fff', shadow: '...', light: '#6FC5DE', mid: '#2E94B5', dark: '#0A6383' },
};
```

Garder un mapping de retrocompatibilite pour les anciens noms :

```typescript
const LEGACY_MAPPING: Record<string, string> = {
  'Psychologie': "L'Esprit",
  'Spiritualite': "L'Esprit",
  'Sante': "Le Corps",
  'Famille': "Les Liens",
  'Societe': "Les Liens",
  'Voyage': "Le Monde",
  'Art & Creativite': "Le Monde",
  'Carriere': "L'Avenir",
  'Technologie': "L'Avenir",
};
```

### Etape 7 — Supprimer les anciens champs

Une fois tout migre et valide :
- Retirer `verticale` des schemas Sanity
- Retirer `univers` (ancien sens) des schemas
- Retirer les entrees legacy de universColors.ts
- Supprimer les 10 documents `_type == "verticale"`

---

## 5. Nouveaux types de contenu (apres migration)

Le nouveau design introduit des sections qui n'existent pas dans le CMS actuel :

| Type | Sections concernees | Champs cles |
|------|-------------------|-------------|
| `dossier` | HeroCarousel | question, semaine, pilier, progression, articles lies |
| `programme` | VideoChannel | nom, tagline, couleur, poster, videos[] |
| `immersion` | Immersions | numero, wordCount, fieldDays, interviews, pullquote, isPaywall |
| `cours` | Shop | titre, format, prix, prixBarre, badge, description |
| `produit` | Shop | titre, format, prix, badge, description |
| `interlude` | Interludes | type (sondage/chiffre/mot/reco), contenu dynamique |

Ces types sont optionnels dans un premier temps — les composants peuvent fonctionner
avec des donnees hardcodees en attendant.

---

## 6. URLs et redirections 301

Les anciennes URLs (`/articles?verticale=psychologie`) doivent rediriger :

```
/univers/psychologie     → /esprit/
/univers/spiritualite    → /esprit/
/univers/sante           → /corps/
/univers/famille         → /liens/
/univers/societe         → /liens/
/univers/voyage          → /monde/
/univers/art-creativite  → /monde/
/univers/carriere        → /avenir/
/univers/technologie     → /avenir/
```

A configurer dans `vercel.json` (redirects).

---

## 7. Checklist de validation

Avant de considerer la migration terminee :

- [ ] 5 documents `pilier` crees dans Sanity
- [ ] 40 sous-topics definis (en dur ou en documents)
- [ ] Chaque `production` a un `pilier` assigne
- [ ] Chaque `portrait` a un `pilier` assigne
- [ ] Chaque `recommendation` a un `pilier` assigne
- [ ] Toutes les queries GROQ mises a jour
- [ ] universColors.ts simplifie (5 entrees + legacy)
- [ ] Homepage affiche les bonnes couleurs/noms
- [ ] Pages univers fonctionnelles (/esprit/, /corps/, etc.)
- [ ] Redirections 301 configurees
- [ ] Anciens champs verticale/univers retires
- [ ] Aucune regression sur les pages existantes (articles, videos, histoires)

---

## 8. Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Perte de donnees pendant migration | Eleve | Script de migration avec dry-run + backup |
| URLs cassees (SEO) | Eleve | Redirections 301 exhaustives |
| Composants existants qui cassent | Moyen | Garder verticale temporairement, mapping frontend |
| Contenu orphelin (sans pilier) | Moyen | Script de verification post-migration |

---

## 9. Fichiers impactes

```
src/lib/queries.ts              ← 25 queries a modifier
src/lib/universColors.ts        ← Simplifier 20+ → 5 entrees
src/lib/sanity.ts               ← Pas de changement (client OK)
src/pages/HomePage.tsx           ← Adapter les fetches
src/pages/UniversPage.tsx        ← Refonte (verticale → pilier)
src/components/Navbar.tsx        ← Navigation 5 univers
vercel.json                      ← Ajouter redirections 301
```

---

*Ce document sert de reference pour la Phase 2. Ne pas commencer avant que la Phase 1 (homepage) soit terminee et validee.*
