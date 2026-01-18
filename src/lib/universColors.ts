// src/lib/universColors.ts
// Couleurs officielles pour chaque univers/verticale

export interface UniversColor {
  bg: string;
  text: string;
  shadow: string;
  light: string; // Version claire pour les backgrounds
}

export const universColors: Record<string, UniversColor> = {
  // Psychologie - Indigo profond
  'Psychologie': {
    bg: '#4F46E5',
    text: '#ffffff',
    shadow: 'rgba(79, 70, 229, 0.35)',
    light: '#EEF2FF'
  },

  // Société - Jaune vif
  'Société': {
    bg: '#F59E0B',
    text: '#000000',
    shadow: 'rgba(245, 158, 11, 0.35)',
    light: '#FFFBEB'
  },

  // Carrière - Cyan moderne
  'Carrière': {
    bg: '#06B6D4',
    text: '#ffffff',
    shadow: 'rgba(6, 182, 212, 0.35)',
    light: '#ECFEFF'
  },

  // Voyage - Vert émeraude
  'Voyage': {
    bg: '#10B981',
    text: '#ffffff',
    shadow: 'rgba(16, 185, 129, 0.35)',
    light: '#ECFDF5'
  },

  // Art & Créativité - Violet vif
  'Art & Créativité': {
    bg: '#8B5CF6',
    text: '#ffffff',
    shadow: 'rgba(139, 92, 246, 0.35)',
    light: '#F5F3FF'
  },

  // Spiritualité - Rose fuchsia
  'Spiritualité': {
    bg: '#EC4899',
    text: '#ffffff',
    shadow: 'rgba(236, 72, 153, 0.35)',
    light: '#FDF2F8'
  },

  // Santé - Turquoise
  'Santé': {
    bg: '#14B8A6',
    text: '#ffffff',
    shadow: 'rgba(20, 184, 166, 0.35)',
    light: '#F0FDFA'
  },

  // Technologie - Bleu électrique
  'Technologie': {
    bg: '#3B82F6',
    text: '#ffffff',
    shadow: 'rgba(59, 130, 246, 0.35)',
    light: '#EFF6FF'
  },

  // Relations - Rouge passion
  'Relations': {
    bg: '#EF4444',
    text: '#ffffff',
    shadow: 'rgba(239, 68, 68, 0.35)',
    light: '#FEF2F2'
  },

  // Environnement - Vert forêt
  'Environnement': {
    bg: '#22C55E',
    text: '#ffffff',
    shadow: 'rgba(34, 197, 94, 0.35)',
    light: '#F0FDF4'
  },

  // Culture - Orange brûlé
  'Culture': {
    bg: '#F97316',
    text: '#ffffff',
    shadow: 'rgba(249, 115, 22, 0.35)',
    light: '#FFF7ED'
  },

  // Histoire - Marron terre
  'Histoire': {
    bg: '#92400E',
    text: '#ffffff',
    shadow: 'rgba(146, 64, 14, 0.35)',
    light: '#FFFBEB'
  },

  // Science - Cyan
  'Science': {
    bg: '#06B6D4',
    text: '#ffffff',
    shadow: 'rgba(6, 182, 212, 0.35)',
    light: '#ECFEFF'
  },

  // Économie - Vert dollar
  'Économie': {
    bg: '#059669',
    text: '#ffffff',
    shadow: 'rgba(5, 150, 105, 0.35)',
    light: '#ECFDF5'
  },

  // Sport - Rouge dynamique
  'Sport': {
    bg: '#DC2626',
    text: '#ffffff',
    shadow: 'rgba(220, 38, 38, 0.35)',
    light: '#FEF2F2'
  },

  // Musique - Violet deep
  'Musique': {
    bg: '#7C3AED',
    text: '#ffffff',
    shadow: 'rgba(124, 58, 237, 0.35)',
    light: '#F5F3FF'
  },

  // Cinéma - Or
  'Cinéma': {
    bg: '#CA8A04',
    text: '#ffffff',
    shadow: 'rgba(202, 138, 4, 0.35)',
    light: '#FEFCE8'
  },

  // Politique - Bleu marine
  'Politique': {
    bg: '#1E40AF',
    text: '#ffffff',
    shadow: 'rgba(30, 64, 175, 0.35)',
    light: '#DBEAFE'
  },

  // Éducation - Bleu ciel
  'Éducation': {
    bg: '#0EA5E9',
    text: '#ffffff',
    shadow: 'rgba(14, 165, 233, 0.35)',
    light: '#F0F9FF'
  },

  // Bien-être - Lavande
  'Bien-être': {
    bg: '#A855F7',
    text: '#ffffff',
    shadow: 'rgba(168, 85, 247, 0.35)',
    light: '#FAF5FF'
  },
};

// Couleur par défaut si l'univers n'est pas trouvé
const defaultColor: UniversColor = {
  bg: '#6366F1',
  text: '#ffffff',
  shadow: 'rgba(99, 102, 241, 0.35)',
  light: '#EEF2FF'
};

/**
 * Récupère les couleurs d'un univers (insensible à la casse)
 * @param univers - Nom de l'univers
 * @returns Les couleurs associées à l'univers
 */
export function getUniversColors(univers?: string): UniversColor {
  if (!univers) return defaultColor;

  // Recherche exacte d'abord
  if (universColors[univers]) {
    return universColors[univers];
  }

  // Recherche insensible à la casse
  const normalizedInput = univers.toLowerCase().trim();
  const matchingKey = Object.keys(universColors).find(
    key => key.toLowerCase() === normalizedInput
  );

  if (matchingKey) {
    return universColors[matchingKey];
  }

  // Recherche partielle (si le nom contient le mot clé)
  const partialMatch = Object.keys(universColors).find(
    key => normalizedInput.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedInput)
  );

  if (partialMatch) {
    return universColors[partialMatch];
  }

  return defaultColor;
}

/**
 * Liste tous les univers disponibles avec leurs couleurs
 */
export function getAllUniversColors(): Array<{ name: string; colors: UniversColor }> {
  return Object.entries(universColors).map(([name, colors]) => ({
    name,
    colors
  }));
}
