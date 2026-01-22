# Habillage Publicitaire (Skin) Panoramique - Guide d'utilisation

## 📋 Vue d'ensemble

L'habillage publicitaire encadre visuellement le site avec une image panoramique artistique. Le contenu principal reste centré et passe par-dessus le skin.

---

## 🎨 Effet visuel

Sur les grands écrans (> 1536px) :
- **Gauche** : Éléments chaotiques (cercles gris/noirs)
- **Haut** : Vague colorée (bleue/orange)
- **Droite** : Soleil et montagne
- **Centre** : Masqué par le contenu du site (fond blanc)

Sur mobile/tablette :
- Background fixe désactivé pour les performances
- Scroll normal

---

## ⚙️ Installation (ÉTAPE MANUELLE REQUISE)

### 1. Sauvegarder l'image

**IMPORTANT** : Télécharge l'image panoramique `image_11.png` depuis ton message et sauvegarde-la dans :

```
/Users/alexquilghini1/Documents/origines media front/public/skin/panoramic-skin.png
```

Si le dossier `/public/skin/` n'existe pas encore, crée-le :
```bash
mkdir -p public/skin
```

Puis copie ton image :
```bash
cp /chemin/vers/image_11.png public/skin/panoramic-skin.png
```

### 2. Fichiers déjà créés ✅

Les fichiers suivants ont été automatiquement créés :
- ✅ `src/components/SkinWrapper.tsx` - Composant wrapper
- ✅ `src/index.css` - Styles CSS ajoutés
- ✅ `src/App.tsx` - Intégration du wrapper

---

## 🚀 Activation / Désactivation

### Pour **activer** le skin (défaut)

Le skin est déjà actif par défaut. Il suffit de :
1. Sauvegarder l'image dans `/public/skin/panoramic-skin.png`
2. Rebuild le projet : `npm run build`
3. Déployer sur Vercel

### Pour **désactiver** temporairement le skin

**Option 1 : Commenter le wrapper dans App.tsx**

```tsx
// Dans src/App.tsx, ligne 51
function App() {
  return (
    // <SkinWrapper>  {/* ← Commenter cette ligne */}
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        {/* ... routes ... */}
      </Suspense>
    </>
    // </SkinWrapper>  {/* ← Commenter cette ligne */}
  );
}
```

**Option 2 : Masquer via CSS**

Ajoute dans `src/index.css` :
```css
.skin-background {
  display: none !important;
}
```

**Option 3 : Supprimer l'image**

Supprime ou renomme le fichier `/public/skin/panoramic-skin.png`

---

## 🎯 Spécifications techniques

### CSS appliqué

```css
.skin-background {
  position: fixed;              /* Fixe à l'écran */
  background-attachment: fixed; /* Parallax effect */
  background-position: center top;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;                  /* Derrière le contenu */
}

.skin-content {
  position: relative;
  z-index: 1;                   /* Par-dessus le skin */
  max-width: 1400px;            /* Sur grands écrans */
  margin: 0 auto;               /* Centré */
}
```

### Breakpoints

| Résolution | Comportement |
|------------|--------------|
| < 1024px | Background scroll (pas fixed) pour mobile |
| 1024-1536px | Background fixed, contenu full-width |
| 1536-1920px | Contenu max 1400px, bords visibles |
| > 1920px | Background size 100% auto |

---

## 🧪 Test

### Tester localement

```bash
npm run dev
```

Puis ouvre :
- http://localhost:5173 (résolution normale)
- Redimensionne ton navigateur pour tester différentes tailles

### Tester les bords visibles

1. Ouvre Chrome DevTools (F12)
2. Mode responsive (Cmd+Shift+M)
3. Règle la largeur à **2560px** (Ultra-wide)
4. Tu devrais voir les éléments artistiques sur les bords

---

## 📊 Performance

### Optimisations incluses

✅ `will-change: transform` pour smooth scrolling
✅ Background fixed désactivé sur mobile
✅ `pointer-events: none` pour éviter interférences
✅ Désactivation en mode impression (`@media print`)

### Taille recommandée de l'image

- **Format** : PNG ou JPG
- **Largeur** : 2560px minimum (pour ultra-wide)
- **Hauteur** : 1440px minimum
- **Poids** : < 500 KB (compresse avec TinyPNG si nécessaire)

---

## 🛠️ Personnalisation

### Changer l'image

Remplace `/public/skin/panoramic-skin.png` par une nouvelle image.

### Ajuster le positionnement

Modifie dans `src/index.css` :

```css
.skin-background {
  background-position: center top;  /* ou: left top, right center, etc. */
}
```

### Ajuster la largeur du contenu

Modifie dans `src/index.css` :

```css
@media (min-width: 1536px) {
  .skin-content {
    max-width: 1600px;  /* Au lieu de 1400px */
  }
}
```

---

## ⚠️ Troubleshooting

### Le skin ne s'affiche pas

1. **Vérifie que l'image existe** :
   ```bash
   ls -lh public/skin/panoramic-skin.png
   ```

2. **Vérifie la console** : Ouvre Chrome DevTools > Console
   - Erreur 404 ? → Image mal placée
   - Pas d'erreur mais pas de skin ? → Vide le cache (Cmd+Shift+R)

3. **Rebuild** :
   ```bash
   npm run build
   npm run preview
   ```

### Le skin est coupé/déformé

- Vérifie que l'image source fait au moins 2560x1440px
- Essaie `background-size: 100% auto` au lieu de `cover`

### Performance mobile lente

C'est normal si l'image est trop lourde. Compresse-la avec :
- https://tinypng.com/
- Ou `npm install -g imagemin-cli && imagemin public/skin/*.png --out-dir=public/skin/`

---

## 📦 Déploiement

### Sur Vercel

1. Assure-toi que l'image est dans `/public/skin/`
2. Commit :
   ```bash
   git add public/skin/panoramic-skin.png
   git add src/components/SkinWrapper.tsx src/App.tsx src/index.css
   git commit -m "feat: ajout habillage publicitaire panoramique"
   git push
   ```
3. Vercel rebuild automatiquement

---

## 📝 Fichiers modifiés

| Fichier | Action |
|---------|--------|
| `src/components/SkinWrapper.tsx` | ✅ Créé |
| `src/App.tsx` | ✅ Modifié (import + wrapper) |
| `src/index.css` | ✅ Modifié (+60 lignes CSS) |
| `public/skin/panoramic-skin.png` | ⚠️ À sauvegarder manuellement |

---

## 🎉 Résultat attendu

- Sur **desktop** (> 1536px) : Contenu centré, bords artistiques visibles
- Sur **laptop** (1024-1536px) : Background visible, pas de bords
- Sur **mobile** (< 1024px) : Background scroll normal

Effet premium avec parallax sur desktop ! ✨
