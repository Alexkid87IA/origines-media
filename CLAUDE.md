# Instructions pour Claude Code - Origines Media

## Avant de coder quoi que ce soit

**OBLIGATOIRE**: Lis `CLAUDE_STYLE_GUIDE.md` avant de créer ou modifier un composant UI.

Ce projet a un design system strict. Aucune déviation n'est permise.

---

## Règles critiques

### 1. Composants UI
- **TOUJOURS** utiliser les composants de `src/components/ui/`
- **JAMAIS** créer de boutons, cards, badges inline
- Imports: `import { Button } from '@/components/ui/Button'`

### 2. Couleurs
- Palette: Violet `#8B5CF6`, Pink `#EC4899`
- Neutres: noir `#0A0A0A` → blanc `#F5F5F5`
- Couleurs d'univers: voir `src/lib/universColors.ts`

### 3. Typographie
- Titres: `font-montserrat font-bold`
- Corps: `font-inter`
- Échelle: utiliser uniquement les classes Tailwind (text-sm, text-base, text-lg, etc.)

### 4. Animations
- Framer Motion pour les apparitions
- `transition-all duration-300` pour les hovers
- Pattern standard: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`

### 5. Layout
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Mobile-first: toujours commencer sans préfixe, puis `sm:`, `md:`, `lg:`
- Grilles: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### 6. CTAs
- Un seul CTA principal par section
- Principal: `variant="cta"` ou `variant="gradient"`
- Secondaire: `variant="outline"` ou `variant="ghost"`

---

## Structure du projet

```
src/
├── components/
│   ├── ui/           # Composants réutilisables (Button, Card, Badge, etc.)
│   ├── partnership/  # Sections page partenariats
│   ├── univers/      # Sections pages univers
│   └── formats/      # Sections pages formats
├── pages/            # Pages de l'application
├── lib/              # Utilitaires (Sanity, couleurs, typo)
├── styles/           # Tokens, styles globaux
└── contexts/         # Contextes React
```

---

## Fichiers de référence

| Besoin | Fichier |
|--------|---------|
| Guide complet | `CLAUDE_STYLE_GUIDE.md` |
| Boutons | `src/components/ui/Button.tsx` |
| Cards | `src/components/ui/Card.tsx` |
| Couleurs univers | `src/lib/universColors.ts` |
| Design tokens | `src/styles/tokens.ts` |
| Styles globaux | `src/index.css` |

---

## Checklist rapide

Avant de soumettre du code:
- [ ] Boutons avec `<Button />` ?
- [ ] Cards avec `<Card />` ?
- [ ] Couleurs de la palette ?
- [ ] Animations avec duration ?
- [ ] Responsive testé ?
- [ ] Un seul CTA principal ?
