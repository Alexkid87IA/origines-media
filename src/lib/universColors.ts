// src/lib/universColors.ts
// Couleurs officielles pour chaque univers/verticale
// Palette optimisée pour une distinction maximale entre les couleurs

export interface UniversColor {
  bg: string;
  text: string;
  shadow: string;
  light: string;
}

// Palette distincte - chaque couleur est sur une teinte différente du cercle chromatique
export const universColors: Record<string, UniversColor> = {
  // ═══════════════════════════════════════════════════════
  // VERTICALES PRINCIPALES (les plus utilisées)
  // ═══════════════════════════════════════════════════════

  // Psychologie - Indigo profond (bleu-violet)
  'Psychologie': {
    bg: '#4F46E5',
    text: '#ffffff',
    shadow: 'rgba(79, 70, 229, 0.35)',
    light: '#EEF2FF'
  },

  // Société - Ambre doré (jaune-orange chaud)
  'Société': {
    bg: '#D97706',
    text: '#ffffff',
    shadow: 'rgba(217, 119, 6, 0.35)',
    light: '#FFFBEB'
  },

  // Carrière - Bleu ciel (cyan clair)
  'Carrière': {
    bg: '#0EA5E9',
    text: '#ffffff',
    shadow: 'rgba(14, 165, 233, 0.35)',
    light: '#F0F9FF'
  },

  // Voyage - Émeraude (vert vif)
  'Voyage': {
    bg: '#10B981',
    text: '#ffffff',
    shadow: 'rgba(16, 185, 129, 0.35)',
    light: '#ECFDF5'
  },

  // Spiritualité - Pourpre profond (violet mystique)
  'Spiritualité': {
    bg: '#9333EA',
    text: '#ffffff',
    shadow: 'rgba(147, 51, 234, 0.35)',
    light: '#FAF5FF'
  },

  // Santé - Rouge vif
  'Santé': {
    bg: '#DC2626',
    text: '#ffffff',
    shadow: 'rgba(220, 38, 38, 0.35)',
    light: '#FEF2F2'
  },

  // Famille - Rose chaud (rose-corail)
  'Famille': {
    bg: '#FB7185',
    text: '#ffffff',
    shadow: 'rgba(251, 113, 133, 0.35)',
    light: '#FFF1F2'
  },

  // Technologie - Bleu électrique
  'Technologie': {
    bg: '#2563EB',
    text: '#ffffff',
    shadow: 'rgba(37, 99, 235, 0.35)',
    light: '#EFF6FF'
  },

  // Relations - Rose passion
  'Relations': {
    bg: '#E11D48',
    text: '#ffffff',
    shadow: 'rgba(225, 29, 72, 0.35)',
    light: '#FFF1F2'
  },

  // Culture - Violet vif
  'Culture': {
    bg: '#7C3AED',
    text: '#ffffff',
    shadow: 'rgba(124, 58, 237, 0.35)',
    light: '#F5F3FF'
  },

  // ═══════════════════════════════════════════════════════
  // VERTICALES SECONDAIRES
  // ═══════════════════════════════════════════════════════

  // Art & Créativité - Fuchsia
  'Art & Créativité': {
    bg: '#D946EF',
    text: '#ffffff',
    shadow: 'rgba(217, 70, 239, 0.35)',
    light: '#FDF4FF'
  },

  // Environnement - Vert forêt (plus foncé que Voyage)
  'Environnement': {
    bg: '#059669',
    text: '#ffffff',
    shadow: 'rgba(5, 150, 105, 0.35)',
    light: '#ECFDF5'
  },

  // Histoire - Marron terre
  'Histoire': {
    bg: '#92400E',
    text: '#ffffff',
    shadow: 'rgba(146, 64, 14, 0.35)',
    light: '#FFFBEB'
  },

  // Science - Teal (bleu-vert)
  'Science': {
    bg: '#0D9488',
    text: '#ffffff',
    shadow: 'rgba(13, 148, 136, 0.35)',
    light: '#F0FDFA'
  },

  // Économie - Vert dollar
  'Économie': {
    bg: '#16A34A',
    text: '#ffffff',
    shadow: 'rgba(22, 163, 74, 0.35)',
    light: '#F0FDF4'
  },

  // Sport - Orange brûlé
  'Sport': {
    bg: '#EA580C',
    text: '#ffffff',
    shadow: 'rgba(234, 88, 12, 0.35)',
    light: '#FFF7ED'
  },

  // Musique - Pourpre
  'Musique': {
    bg: '#9333EA',
    text: '#ffffff',
    shadow: 'rgba(147, 51, 234, 0.35)',
    light: '#FAF5FF'
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

  // Éducation - Bleu azur
  'Éducation': {
    bg: '#0284C7',
    text: '#ffffff',
    shadow: 'rgba(2, 132, 199, 0.35)',
    light: '#E0F2FE'
  },

  // Bien-être - Lavande (violet clair)
  'Bien-être': {
    bg: '#A855F7',
    text: '#ffffff',
    shadow: 'rgba(168, 85, 247, 0.35)',
    light: '#FAF5FF'
  },

  // Alimentation - Vert lime
  'Alimentation': {
    bg: '#65A30D',
    text: '#ffffff',
    shadow: 'rgba(101, 163, 13, 0.35)',
    light: '#F7FEE7'
  },

  // Finance - Vert émeraude foncé
  'Finance': {
    bg: '#047857',
    text: '#ffffff',
    shadow: 'rgba(4, 120, 87, 0.35)',
    light: '#ECFDF5'
  },

  // Mode - Rose poudré
  'Mode': {
    bg: '#DB2777',
    text: '#ffffff',
    shadow: 'rgba(219, 39, 119, 0.35)',
    light: '#FDF2F8'
  },

  // Lifestyle - Corail
  'Lifestyle': {
    bg: '#F43F5E',
    text: '#ffffff',
    shadow: 'rgba(244, 63, 94, 0.35)',
    light: '#FFF1F2'
  },

  // ═══════════════════════════════════════════════════════
  // CATÉGORIES HISTOIRES (tagCategories)
  // ═══════════════════════════════════════════════════════

  // Émotions & Bien-être - Pink
  'Émotions & Bien-être': {
    bg: '#EC4899',
    text: '#ffffff',
    shadow: 'rgba(236, 72, 153, 0.35)',
    light: '#FDF2F8'
  },

  // Développement - Emerald
  'Développement': {
    bg: '#10B981',
    text: '#ffffff',
    shadow: 'rgba(16, 185, 129, 0.35)',
    light: '#ECFDF5'
  },

  // Parcours & Résilience - Violet
  'Parcours & Résilience': {
    bg: '#8B5CF6',
    text: '#ffffff',
    shadow: 'rgba(139, 92, 246, 0.35)',
    light: '#F5F3FF'
  },

  // Relations & Famille - Amber
  'Relations & Famille': {
    bg: '#F59E0B',
    text: '#ffffff',
    shadow: 'rgba(245, 158, 11, 0.35)',
    light: '#FFFBEB'
  },

  // Santé mentale - Cyan
  'Santé mentale': {
    bg: '#06B6D4',
    text: '#ffffff',
    shadow: 'rgba(6, 182, 212, 0.35)',
    light: '#ECFEFF'
  },

  // Épreuves & Inspiration - Indigo
  'Épreuves & Inspiration': {
    bg: '#6366F1',
    text: '#ffffff',
    shadow: 'rgba(99, 102, 241, 0.35)',
    light: '#EEF2FF'
  },
};

// Couleur par défaut si l'univers n'est pas trouvé - Gris neutre
const defaultColor: UniversColor = {
  bg: '#6B7280',
  text: '#ffffff',
  shadow: 'rgba(107, 114, 128, 0.35)',
  light: '#F3F4F6'
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

/**
 * Vérifie si deux couleurs sont trop similaires (pour debug)
 */
export function getColorDistinctionReport(): string[] {
  const issues: string[] = [];
  const entries = Object.entries(universColors);

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [name1, color1] = entries[i];
      const [name2, color2] = entries[j];

      // Simple check: if hex codes are too similar
      if (color1.bg === color2.bg) {
        issues.push(`${name1} et ${name2} ont la même couleur!`);
      }
    }
  }

  return issues;
}
