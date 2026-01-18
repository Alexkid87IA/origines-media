// src/lib/tagCategories.ts
// Catégories thématiques pour organiser les tags en "Bibliothèque Émotionnelle"

export interface TagCategory {
  id: string;
  nom: string;
  couleur: string;
  tags: string[]; // Slugs des tags
}

// 6 catégories thématiques pour organiser les 47 tags existants
export const TAG_CATEGORIES: Record<string, TagCategory> = {
  emotions: {
    id: "emotions",
    nom: "Émotions & Bien-être",
    couleur: "#EC4899",
    tags: [
      "amour",
      "emotions",
      "bien-etre",
      "equilibre",
      "stress",
      "epuisement",
      "anxiete",
      "anxiete-sociale",
      "phobie",
      "timidite"
    ]
  },
  developpement: {
    id: "developpement",
    nom: "Développement",
    couleur: "#10B981",
    tags: [
      "developpement-personnel",
      "autonomie",
      "estime-de-soi",
      "conscience-de-soi",
      "decision",
      "pensee-critique",
      "croyances-limitantes",
      "auto-sabotage",
      "perfectionnisme"
    ]
  },
  parcours: {
    id: "parcours",
    nom: "Parcours & Résilience",
    couleur: "#8B5CF6",
    tags: [
      "resilience",
      "reconversion",
      "parcours-atypique",
      "depassement",
      "succes",
      "reussite",
      "performance"
    ]
  },
  relations: {
    id: "relations",
    nom: "Relations & Famille",
    couleur: "#F59E0B",
    tags: [
      "relations",
      "famille",
      "enfance",
      "attachement",
      "dependance-affective",
      "manipulation",
      "engagement"
    ]
  },
  sante: {
    id: "sante",
    nom: "Santé mentale",
    couleur: "#06B6D4",
    tags: [
      "sante-mentale",
      "therapie",
      "psychanalyse",
      "neurosciences",
      "biais-cognitifs",
      "mecanismes-defense",
      "inconscient",
      "charge-mentale"
    ]
  },
  epreuves: {
    id: "epreuves",
    nom: "Épreuves & Inspiration",
    couleur: "#6366F1",
    tags: [
      "deuil",
      "perte",
      "inspiration",
      "innovation",
      "leadership",
      "accompagnement"
    ]
  }
};

// Liste ordonnée des catégories pour l'affichage
export const CATEGORY_ORDER = [
  "emotions",
  "developpement",
  "parcours",
  "relations",
  "sante",
  "epreuves"
];

// Trouver la catégorie d'un tag par son slug
export function getTagCategory(slug: string): TagCategory | undefined {
  return Object.values(TAG_CATEGORIES).find(cat => cat.tags.includes(slug));
}

// Obtenir toutes les catégories dans l'ordre
export function getOrderedCategories(): TagCategory[] {
  return CATEGORY_ORDER.map(id => TAG_CATEGORIES[id]);
}

// Compter les histoires par catégorie
export function countStoriesByCategory(
  stories: { tags?: { slug: string }[] }[],
  categoryId: string
): number {
  const category = TAG_CATEGORIES[categoryId];
  if (!category) return 0;
  return stories.filter(story =>
    story.tags?.some(tag => category.tags.includes(tag.slug))
  ).length;
}

// Filtrer les histoires par catégorie
export function filterStoriesByCategory<T extends { tags?: { slug: string }[] }>(
  stories: T[],
  categoryId: string
): T[] {
  const category = TAG_CATEGORIES[categoryId];
  if (!category) return stories;
  return stories.filter(story =>
    story.tags?.some(tag => category.tags.includes(tag.slug))
  );
}

// Obtenir les couleurs dérivées d'une catégorie (pour le styling)
export function getCategoryColors(categoryId: string) {
  const category = TAG_CATEGORIES[categoryId];
  if (!category) {
    return {
      bg: "#6366F1",
      text: "#FFFFFF",
      light: "#6366F120",
      shadow: "#6366F140"
    };
  }
  return {
    bg: category.couleur,
    text: "#FFFFFF",
    light: `${category.couleur}20`,
    shadow: `${category.couleur}40`
  };
}
