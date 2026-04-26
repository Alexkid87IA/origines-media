# Handoff — Claude Code · Front-end origines.media

Ce document liste **ce que le front-end doit me fournir** pour consolider la Brand Bible. Tout est à extraire depuis le codebase du site actuel (origines.media) et à me renvoyer sous forme de tokens + screenshots.

---

## 1. Tokens à extraire du codebase

Merci de me donner les valeurs **exactes** telles qu'elles sont dans le code (CSS vars, Tailwind config, theme.ts, etc.) :

### Couleurs par catégorie
Pour chaque catégorie (Psychologie, Société, Famille, Voyage, Spiritualité, Carrière, Art & Créativité, Santé, Tech, Business + celles que j'aurais ratées) :
- Couleur principale (hex)
- Couleur de fond/teinte claire si différente
- Couleur texte associée
- Nom du token dans le code (ex: `--color-psycho`, `colors.psycho.500`)

### Neutres
- Fond page (clair + sombre si dark mode)
- Fond carte / surface
- Texte principal / secondaire / tertiaire
- Bordures (claires, moyennes)

### Typographie
- Famille titres (nom exact + fallback stack)
- Famille corps
- Famille mono (si utilisée)
- Échelle complète (tailles + line-heights + weights en usage)
- Source (Google Fonts, fichiers locaux, Adobe Fonts)

### Spacing / Radius / Shadows
- Scale spacing (les valeurs en usage : 4, 8, 12, 16, 24, 32, 48, 64, 96 ?)
- Rayons de bordure utilisés (0, 4, 8, pill ?)
- Ombres si il y en a

---

## 2. Composants UI à me screenshoter individuellement

Zoom propre, fond neutre, états visibles :

- [ ] **Pill / tag catégorie** (le bouton coloré avec nom de catégorie) — un par catégorie
- [ ] **Bouton primaire** (CTA principal, ex. "S'abonner", "Lire l'article")
- [ ] **Bouton secondaire** + états hover/active si possible
- [ ] **Navigation principale** (desktop + mobile)
- [ ] **Carte article** (vignette + kicker + titre + métadonnées)
- [ ] **Carte vidéo / player**
- [ ] **Formulaire newsletter**
- [ ] **Footer**
- [ ] **Breadcrumb / fil d'ariane** si existe
- [ ] **Menu filtres catégories** (la barre qui permet de filtrer les vidéos/articles)

---

## 3. Assets à me fournir

- [ ] Logo SVG (black + white) — source vectorielle, pas PNG
- [ ] Favicon
- [ ] Icônes custom si il y en a (play, flèches, social)
- [ ] Photos éditoriales types (3-4 exemples représentatifs du ton photo)

---

## 4. Questions ouvertes pour le front

- Y a-t-il un **dark mode** actif sur le site ? Si oui, tokens équivalents.
- Comment les **catégories sont-elles nommées** dans le code (slugs) ?
- Quelle **grille** est utilisée (12 cols, 8pt, autre) ?
- Les **breakpoints** responsive (mobile / tablet / desktop).
- Le site utilise-t-il un **design system interne** déjà nommé, ou c'est libre ?

---

## 5. Format de retour attendu

Un dossier zippé avec :
```
/origines-ui-audit
  ├── tokens.json         # toutes les valeurs tokens
  ├── fonts.md            # ce qui est utilisé + sources
  ├── screenshots/        # tous les composants screenshots ci-dessus
  └── logos/              # SVG noir + blanc
```

Une fois ce package reçu, je mets à jour la Brand Bible avec les vraies valeurs et on peut avancer sur le kit social et les guidelines éditoriales complètes.

---

*Contact : [ton email]*
*Version Brand Bible actuelle : v1.0 · avril 2026*
