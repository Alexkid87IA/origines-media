# Guide de Style - Origines Media Front

> **IMPORTANT POUR CLAUDE CODE**: Ce fichier est la référence absolue pour le design system de ce projet.
> Avant de coder un composant, lis ce guide. Aucune déviation n'est autorisée sans validation explicite.

---

## Table des matières

1. [Couleurs](#1-couleurs)
2. [Typographie](#2-typographie)
3. [Boutons](#3-boutons)
4. [Composants UI](#4-composants-ui)
5. [Espacements](#5-espacements)
6. [Animations](#6-animations)
7. [Call to Action (CTA)](#7-call-to-action-cta)
8. [Layout & Grilles](#8-layout--grilles)
9. [Règles Absolues](#9-règles-absolues)

---

## 1. Couleurs

### Palette Principale

| Nom | Hex | Usage |
|-----|-----|-------|
| **Violet** | `#8B5CF6` | Couleur primaire, liens, accents |
| **Pink** | `#EC4899` | Couleur secondaire, CTAs, highlights |
| **Purple** | `#A855F7` | Dégradés, variantes |
| **Fuchsia** | `#D946EF` | Accents complémentaires |

### Neutres (Thème sombre)

| Nom | Hex | Usage |
|-----|-----|-------|
| **Black** | `#0A0A0A` | Background principal |
| **Dark Gray** | `#0F0F0F` | Background secondaire |
| **Gray** | `#1A1A1A` | Cards, surfaces |
| **Light Gray** | `#2A2A2A` | Bordures, séparateurs |
| **White** | `#F5F5F5` | Texte principal |

### Variables CSS (à utiliser)

```css
--bg-primary: #000000;
--bg-secondary: #0a0a0a;
--bg-card: rgba(255, 255, 255, 0.03);
--bg-card-hover: rgba(255, 255, 255, 0.06);
--text-primary: #ffffff;
--text-secondary: #a1a1aa;
--text-muted: #71717a;
--border-color: rgba(255, 255, 255, 0.1);
--border-color-hover: rgba(255, 255, 255, 0.2);
```

### Couleurs par Univers

Chaque univers a sa propre couleur. Utilise `src/lib/universColors.ts` pour les récupérer.

| Univers | Couleur | Texte |
|---------|---------|-------|
| Psychologie | `#4F46E5` | blanc |
| Société | `#F59E0B` | noir |
| Carrière | `#06B6D4` | blanc |
| Voyage | `#10B981` | blanc |
| Art & Créativité | `#8B5CF6` | blanc |
| Spiritualité | `#EC4899` | blanc |
| Santé | `#14B8A6` | blanc |
| Technologie | `#3B82F6` | blanc |
| Relations | `#EF4444` | blanc |
| Environnement | `#22C55E` | blanc |
| Culture | `#F97316` | blanc |
| Histoire | `#92400E` | blanc |

**Format d'ombre pour univers**: `rgba(couleur, 0.35)`

---

## 2. Typographie

### Familles de polices

```css
/* Titres */
font-family: 'Montserrat', sans-serif;

/* Corps de texte */
font-family: 'Inter', sans-serif;

/* Fallback */
font-family: 'Sora', sans-serif;
```

### Classes Tailwind

| Élément | Classes |
|---------|---------|
| **H1 Hero** | `text-4xl md:text-5xl lg:text-7xl font-black tracking-tight` |
| **H2 Section** | `text-3xl md:text-4xl font-bold` |
| **H3 Card** | `text-xl font-bold font-montserrat` |
| **Body** | `text-base font-inter leading-relaxed` |
| **Small** | `text-sm text-white/70` |
| **Muted** | `text-xs text-white/50` |

### Hiérarchie de poids

| Poids | Valeur | Usage |
|-------|--------|-------|
| Light | `300` | Rarement utilisé |
| Normal | `400` | Corps de texte |
| Medium | `500` | Labels, badges |
| Semibold | `600` | Sous-titres |
| Bold | `700` | Titres de cards |
| Extrabold | `800` | Titres de sections |
| Black | `900` | Hero, H1 |

### Espacement des lignes

- **Titres**: `leading-tight` (1.1)
- **Paragraphes**: `leading-relaxed` (1.625)
- **Body**: `leading-normal` (1.5)

---

## 3. Boutons

### Composant: `src/components/ui/Button.tsx`

**TOUJOURS utiliser ce composant. Ne jamais créer de bouton inline.**

### Variants

```tsx
// Bouton principal plein
<Button variant="primary">Action</Button>

// Bouton secondaire
<Button variant="secondary">Secondaire</Button>

// Bouton fantôme (transparent)
<Button variant="ghost">Ghost</Button>

// Bouton contour
<Button variant="outline">Outline</Button>

// Dégradé violet → rose
<Button variant="gradient">Gradient</Button>

// CTA (arrondi complet, plus gros)
<Button variant="cta">Call to Action</Button>

// CTA contour
<Button variant="cta-outline">CTA Outline</Button>
```

### Tailles

| Taille | Classes | Usage |
|--------|---------|-------|
| `sm` | `px-3 py-1.5 text-sm` | Actions secondaires, tags |
| `md` | `px-4 py-2 text-sm` | **Par défaut** |
| `lg` | `px-6 py-3 text-base` | Actions importantes |
| `xl` | `px-8 py-4 text-lg` | CTAs principaux |

### Options

```tsx
// Avec flèche
<Button withArrow>Voir plus</Button>

// Avec icône
<Button leftIcon={<Play />}>Lancer</Button>
<Button rightIcon={<ArrowRight />}>Suivant</Button>

// Pleine largeur
<Button fullWidth>Envoyer</Button>

// État de chargement
<Button loading>Chargement...</Button>

// Couleur personnalisée (univers)
<Button color="#8B5CF6">Psychologie</Button>
```

### Quand utiliser quel variant

| Situation | Variant | Taille |
|-----------|---------|--------|
| Action principale de page | `cta` | `lg` ou `xl` |
| Action secondaire | `secondary` | `md` |
| Navigation interne | `ghost` | `md` |
| Action dans une card | `primary` | `sm` ou `md` |
| Formulaire submit | `gradient` | `lg` |
| Lien externe | `outline` | `md` |

---

## 4. Composants UI

### Tous les composants sont dans `src/components/ui/`

### Card (`Card.tsx`)

```tsx
import { Card, CardImage, CardContent, CardTitle, CardDescription, CardBadge, CardFooter } from '@/components/ui/Card';

<Card variant="default" size="md">
  <CardImage
    src={image}
    alt={title}
    aspectRatio="video"
    gradient
  />
  <CardContent>
    <CardBadge color="#8B5CF6">Psychologie</CardBadge>
    <CardTitle>{title}</CardTitle>
    <CardDescription lines={2}>{description}</CardDescription>
  </CardContent>
  <CardFooter>
    <Button size="sm">Lire</Button>
  </CardFooter>
</Card>
```

**Variants de Card:**
- `default` - Fond semi-transparent
- `elevated` - Avec ombre
- `outlined` - Bordure visible
- `glass` - Effet glassmorphism

**Aspect ratios pour images:**
- `video` - 16:9 (défaut)
- `square` - 1:1
- `portrait` - 3:4
- `landscape` - 16:9

### Badge (`Badge.tsx`)

```tsx
import { Badge } from '@/components/ui/Badge';

// Sans couleur
<Badge>Nouveau</Badge>

// Avec couleur (solid)
<Badge variant="solid" color="#8B5CF6">Psychologie</Badge>

// Contour
<Badge variant="outline" color="#EC4899">Live</Badge>

// Subtle (fond léger)
<Badge variant="subtle" color="#10B981">Gratuit</Badge>
```

**Tailles:** `sm`, `md` (défaut), `lg`

### IconButton (`IconButton.tsx`)

```tsx
import { IconButton } from '@/components/ui/IconButton';
import { Play, Heart, Share2 } from 'lucide-react';

<IconButton
  icon={<Play />}
  aria-label="Lire la vidéo"
  variant="solid"
  size="lg"
  color="#8B5CF6"
/>
```

**Variants:** `default`, `ghost`, `outline`, `solid`
**Tailles:** `sm` (32px), `md` (40px), `lg` (48px), `xl` (56px)

---

## 5. Espacements

### Échelle d'espacement (Tailwind)

| Classe | Pixels | Usage |
|--------|--------|-------|
| `1` | 4px | Micro-espacement |
| `2` | 8px | Entre éléments proches |
| `3` | 12px | Gap dans flex/grid |
| `4` | 16px | Padding cards |
| `6` | 24px | Marges sections |
| `8` | 32px | Séparation groupes |
| `12` | 48px | Entre sections |
| `16` | 64px | Grande séparation |
| `20` | 80px | Padding vertical sections |
| `32` | 128px | Espacement majeur |

### Patterns d'espacement

```tsx
// Section standard
<section className="py-20 md:py-32">

// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Card content
<div className="p-4 md:p-6">

// Gap entre éléments
<div className="flex gap-3">        // Éléments proches
<div className="flex gap-6">        // Éléments séparés
<div className="grid gap-4 lg:gap-6"> // Grille de cards
```

---

## 6. Animations

### Framer Motion (patterns standard)

```tsx
import { motion } from 'framer-motion';

// Fade in + slide up (le plus courant)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// Scale + fade
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>

// Stagger children
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: index * 0.08 }}
  />
))}
```

### Durées

| Nom | Valeur | Usage |
|-----|--------|-------|
| `fast` | 150ms | Hover, états |
| `normal` | 300ms | **Par défaut** |
| `slow` | 500ms | Apparitions |
| `slower` | 700ms | Animations complexes |

### Transitions CSS

```css
/* Standard */
transition: all 0.3s ease;

/* Tailwind */
transition-all duration-300

/* Avec easing custom */
transition-all duration-300 ease-out
```

### Hover sur cards

```tsx
// Scale image au hover
<div className="group overflow-hidden">
  <img className="transition-transform duration-700 group-hover:scale-110" />
</div>

// Mouvement d'icône
<ArrowRight className="transition-transform group-hover:translate-x-1" />
```

---

## 7. Call to Action (CTA)

### Règles d'or

1. **Un seul CTA principal par section visible**
2. **Le CTA principal est toujours en `variant="cta"` ou `variant="gradient"`**
3. **Les CTAs secondaires sont en `outline` ou `ghost`**

### Patterns de CTA

```tsx
// CTA principal de section
<Button
  variant="cta"
  size="lg"
  withArrow
  className="shadow-[0_10px_30px_rgba(139,92,246,0.4)]"
>
  Découvrir
</Button>

// CTA dans hero
<motion.div className="flex flex-col sm:flex-row gap-4">
  <Button variant="gradient" size="xl">Action principale</Button>
  <Button variant="outline" size="xl">Action secondaire</Button>
</motion.div>

// CTA dans card
<CardFooter>
  <Button
    size="sm"
    color={universeColor}
    className="shadow-[0_2px_8px_${color}40]"
  >
    Lire l'histoire
  </Button>
</CardFooter>

// CTA formulaire
<Button
  variant="gradient"
  size="lg"
  fullWidth
  loading={isSubmitting}
>
  Envoyer
</Button>
```

### Box shadows pour CTAs colorés

```tsx
// Pattern de shadow dynamique
style={{ boxShadow: `0 10px 30px ${color}40` }}

// Ou en className
className="shadow-[0_10px_30px_rgba(139,92,246,0.4)]"
```

---

## 8. Layout & Grilles

### Breakpoints

| Prefix | Min-width | Cible |
|--------|-----------|-------|
| (none) | 0px | Mobile |
| `sm:` | 640px | Mobile paysage |
| `md:` | 768px | Tablette |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Grand écran |
| `2xl:` | 1536px | Très grand écran |

### Container standard

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Contenu */}
</div>
```

### Grilles

```tsx
// Hero bento grid
<div className="grid grid-cols-12 gap-3 lg:gap-4">
  <div className="col-span-12 lg:col-span-8">{/* Main */}</div>
  <div className="col-span-12 lg:col-span-4">{/* Sidebar */}</div>
</div>

// Grille de cards (responsive)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">

// Deux colonnes
<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
```

### Structure de section

```tsx
<section className="relative py-20 md:py-32 overflow-hidden">
  {/* Background optionnel */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black" />

  {/* Container */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header de section */}
    <div className="text-center mb-12 lg:mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Titre</h2>
      <p className="text-lg text-white/70 max-w-2xl mx-auto">Description</p>
    </div>

    {/* Contenu */}
    <div className="grid ...">
      {/* Cards, etc. */}
    </div>
  </div>
</section>
```

---

## 9. Règles Absolues

### NE JAMAIS FAIRE

1. **Créer des boutons inline** - Toujours utiliser `<Button />`
2. **Utiliser des couleurs hardcodées** - Utiliser les variables CSS ou les couleurs définies
3. **Inventer des tailles de police** - Utiliser l'échelle Tailwind
4. **Créer des animations sans `duration-300`** au minimum
5. **Oublier le responsive** - Toujours tester mobile-first
6. **Utiliser `px-*` différents** du système d'espacement
7. **Créer des cards sans le composant `<Card />`**
8. **Utiliser des icônes hors de `lucide-react`**
9. **Créer des gradients non violet→rose** sans validation

### TOUJOURS FAIRE

1. **Importer depuis `@/components/ui/`** pour les composants
2. **Utiliser Framer Motion** pour les animations d'apparition
3. **Ajouter `group` et `group-hover:`** pour les interactions
4. **Utiliser `transition-all duration-300`** pour les hovers
5. **Respecter la hiérarchie** : un seul H1, H2 pour sections, etc.
6. **Ajouter des `aria-label`** aux IconButtons
7. **Utiliser `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`** pour les containers
8. **Tester en mobile d'abord** (approche mobile-first)

### Checklist avant commit

- [ ] Les couleurs sont dans la palette définie
- [ ] Les boutons utilisent le composant `<Button />`
- [ ] Les cards utilisent le composant `<Card />`
- [ ] Les animations utilisent Framer Motion ou `duration-300`
- [ ] Le layout est responsive (testé sur mobile)
- [ ] Les textes suivent la hiérarchie typographique
- [ ] Les espacements suivent l'échelle (pas de valeurs arbitraires)
- [ ] Les CTAs sont bien hiérarchisés (1 principal, reste secondaire)

---

## Fichiers de référence

| Fichier | Contenu |
|---------|---------|
| `src/components/ui/Button.tsx` | Composant bouton |
| `src/components/ui/Card.tsx` | Composant card |
| `src/components/ui/Badge.tsx` | Composant badge |
| `src/components/ui/IconButton.tsx` | Bouton icône |
| `src/styles/tokens.ts` | Design tokens |
| `src/lib/universColors.ts` | Couleurs par univers |
| `src/lib/typography.ts` | Utilitaires typo |
| `src/index.css` | Styles globaux, animations |

---

*Dernière mise à jour: Janvier 2026*
