// src/lib/universColors.ts
// Couleurs officielles pour chaque univers/verticale
// Palette optimisée pour une distinction maximale entre les couleurs

export interface UniversColor {
  bg: string;
  text: string;
  shadow: string;
  light: string;
  mid: string;
  dark: string;
}

// Palette distincte - chaque couleur est sur une teinte différente du cercle chromatique
export const universColors: Record<string, UniversColor> = {
  // ═══════════════════════════════════════════════════════
  // VERTICALES PRINCIPALES (les plus utilisées)
  // ═══════════════════════════════════════════════════════

  // Psychologie — Violet oklch
  'Psychologie': {
    bg: '#7B5CD6',
    text: '#ffffff',
    shadow: 'rgba(123, 92, 214, 0.35)',
    light: '#A78BE8',
    mid: '#7B5CD6',
    dark: '#4A2FA8',
  },

  // Société — Orange oklch
  'Société': {
    bg: '#E67839',
    text: '#ffffff',
    shadow: 'rgba(230, 120, 57, 0.35)',
    light: '#F5A878',
    mid: '#E67839',
    dark: '#B04E15',
  },

  // Carrière — Bleu oklch
  'Carrière': {
    bg: '#3E7DD6',
    text: '#ffffff',
    shadow: 'rgba(62, 125, 214, 0.35)',
    light: '#7AA8E8',
    mid: '#3E7DD6',
    dark: '#1A4FA0',
  },

  // Voyage — Émeraude oklch
  'Voyage': {
    bg: '#2E9B74',
    text: '#ffffff',
    shadow: 'rgba(46, 155, 116, 0.35)',
    light: '#6FC9A6',
    mid: '#2E9B74',
    dark: '#0A6848',
  },

  // Spiritualité — Indigo oklch
  'Spiritualité': {
    bg: '#5A66D6',
    text: '#ffffff',
    shadow: 'rgba(90, 102, 214, 0.35)',
    light: '#9098E8',
    mid: '#5A66D6',
    dark: '#2A34A0',
  },

  // Santé — Vert oklch
  'Santé': {
    bg: '#5AA352',
    text: '#ffffff',
    shadow: 'rgba(90, 163, 82, 0.35)',
    light: '#8FD088',
    mid: '#5AA352',
    dark: '#2A6F22',
  },

  // Famille — Or oklch
  'Famille': {
    bg: '#C99B1E',
    text: '#ffffff',
    shadow: 'rgba(201, 155, 30, 0.35)',
    light: '#E8C872',
    mid: '#C99B1E',
    dark: '#8A6700',
  },

  // Technologie — Teal oklch
  'Technologie': {
    bg: '#2E94B5',
    text: '#ffffff',
    shadow: 'rgba(46, 148, 181, 0.35)',
    light: '#6FC5DE',
    mid: '#2E94B5',
    dark: '#0A6383',
  },

  // Relations — Rose oklch (mapped to Art)
  'Relations': {
    bg: '#D64C90',
    text: '#ffffff',
    shadow: 'rgba(214, 76, 144, 0.35)',
    light: '#E88AB8',
    mid: '#D64C90',
    dark: '#A01A5F',
  },

  // Culture — Violet oklch (mapped to Psychologie)
  'Culture': {
    bg: '#7B5CD6',
    text: '#ffffff',
    shadow: 'rgba(123, 92, 214, 0.35)',
    light: '#A78BE8',
    mid: '#7B5CD6',
    dark: '#4A2FA8',
  },

  // ═══════════════════════════════════════════════════════
  // VERTICALES SECONDAIRES
  // ═══════════════════════════════════════════════════════

  // Art & Créativité — mapped to Art (Rose oklch)
  'Art & Créativité': {
    bg: '#D64C90',
    text: '#ffffff',
    shadow: 'rgba(214, 76, 144, 0.35)',
    light: '#E88AB8',
    mid: '#D64C90',
    dark: '#A01A5F',
  },

  // Environnement — mapped to Voyage (Émeraude oklch)
  'Environnement': {
    bg: '#2E9B74',
    text: '#ffffff',
    shadow: 'rgba(46, 155, 116, 0.35)',
    light: '#6FC9A6',
    mid: '#2E9B74',
    dark: '#0A6848',
  },

  // Histoire — mapped to Société (Orange oklch)
  'Histoire': {
    bg: '#E67839',
    text: '#ffffff',
    shadow: 'rgba(230, 120, 57, 0.35)',
    light: '#F5A878',
    mid: '#E67839',
    dark: '#B04E15',
  },

  // Science — mapped to Tech (Teal oklch)
  'Science': {
    bg: '#2E94B5',
    text: '#ffffff',
    shadow: 'rgba(46, 148, 181, 0.35)',
    light: '#6FC5DE',
    mid: '#2E94B5',
    dark: '#0A6383',
  },

  // Économie — mapped to Business (Teal oklch)
  'Économie': {
    bg: '#1EA0A3',
    text: '#ffffff',
    shadow: 'rgba(30, 160, 163, 0.35)',
    light: '#5FCED0',
    mid: '#1EA0A3',
    dark: '#006D70',
  },

  // Sport — mapped to Société (Orange oklch)
  'Sport': {
    bg: '#E67839',
    text: '#ffffff',
    shadow: 'rgba(230, 120, 57, 0.35)',
    light: '#F5A878',
    mid: '#E67839',
    dark: '#B04E15',
  },

  // Musique — mapped to Spiritualité (Indigo oklch)
  'Musique': {
    bg: '#5A66D6',
    text: '#ffffff',
    shadow: 'rgba(90, 102, 214, 0.35)',
    light: '#9098E8',
    mid: '#5A66D6',
    dark: '#2A34A0',
  },

  // Cinéma — mapped to Famille (Or oklch)
  'Cinéma': {
    bg: '#C99B1E',
    text: '#ffffff',
    shadow: 'rgba(201, 155, 30, 0.35)',
    light: '#E8C872',
    mid: '#C99B1E',
    dark: '#8A6700',
  },

  // Politique — mapped to Carrière (Bleu oklch)
  'Politique': {
    bg: '#3E7DD6',
    text: '#ffffff',
    shadow: 'rgba(62, 125, 214, 0.35)',
    light: '#7AA8E8',
    mid: '#3E7DD6',
    dark: '#1A4FA0',
  },

  // Éducation — mapped to Carrière (Bleu oklch)
  'Éducation': {
    bg: '#3E7DD6',
    text: '#ffffff',
    shadow: 'rgba(62, 125, 214, 0.35)',
    light: '#7AA8E8',
    mid: '#3E7DD6',
    dark: '#1A4FA0',
  },

  // Bien-être — mapped to Psychologie (Violet oklch)
  'Bien-être': {
    bg: '#7B5CD6',
    text: '#ffffff',
    shadow: 'rgba(123, 92, 214, 0.35)',
    light: '#A78BE8',
    mid: '#7B5CD6',
    dark: '#4A2FA8',
  },

  // Alimentation — mapped to Santé (Vert oklch)
  'Alimentation': {
    bg: '#5AA352',
    text: '#ffffff',
    shadow: 'rgba(90, 163, 82, 0.35)',
    light: '#8FD088',
    mid: '#5AA352',
    dark: '#2A6F22',
  },

  // Finance — mapped to Business (Teal oklch)
  'Finance': {
    bg: '#1EA0A3',
    text: '#ffffff',
    shadow: 'rgba(30, 160, 163, 0.35)',
    light: '#5FCED0',
    mid: '#1EA0A3',
    dark: '#006D70',
  },

  // Mode — mapped to Art (Rose oklch)
  'Mode': {
    bg: '#D64C90',
    text: '#ffffff',
    shadow: 'rgba(214, 76, 144, 0.35)',
    light: '#E88AB8',
    mid: '#D64C90',
    dark: '#A01A5F',
  },

  // Lifestyle — mapped to Art (Rose oklch)
  'Lifestyle': {
    bg: '#D64C90',
    text: '#ffffff',
    shadow: 'rgba(214, 76, 144, 0.35)',
    light: '#E88AB8',
    mid: '#D64C90',
    dark: '#A01A5F',
  },

  // ═══════════════════════════════════════════════════════
  // CATÉGORIES HISTOIRES (tagCategories)
  // ═══════════════════════════════════════════════════════

  // Émotions & Bien-être — mapped to Art (Rose oklch)
  'Émotions & Bien-être': {
    bg: '#D64C90',
    text: '#ffffff',
    shadow: 'rgba(214, 76, 144, 0.35)',
    light: '#E88AB8',
    mid: '#D64C90',
    dark: '#A01A5F',
  },

  // Développement — mapped to Voyage (Émeraude oklch)
  'Développement': {
    bg: '#2E9B74',
    text: '#ffffff',
    shadow: 'rgba(46, 155, 116, 0.35)',
    light: '#6FC9A6',
    mid: '#2E9B74',
    dark: '#0A6848',
  },

  // Parcours & Résilience — mapped to Psychologie (Violet oklch)
  'Parcours & Résilience': {
    bg: '#7B5CD6',
    text: '#ffffff',
    shadow: 'rgba(123, 92, 214, 0.35)',
    light: '#A78BE8',
    mid: '#7B5CD6',
    dark: '#4A2FA8',
  },

  // Relations & Famille — mapped to Famille (Or oklch)
  'Relations & Famille': {
    bg: '#C99B1E',
    text: '#ffffff',
    shadow: 'rgba(201, 155, 30, 0.35)',
    light: '#E8C872',
    mid: '#C99B1E',
    dark: '#8A6700',
  },

  // Santé mentale — mapped to Tech (Teal oklch)
  'Santé mentale': {
    bg: '#2E94B5',
    text: '#ffffff',
    shadow: 'rgba(46, 148, 181, 0.35)',
    light: '#6FC5DE',
    mid: '#2E94B5',
    dark: '#0A6383',
  },

  // Épreuves & Inspiration — mapped to Spiritualité (Indigo oklch)
  'Épreuves & Inspiration': {
    bg: '#5A66D6',
    text: '#ffffff',
    shadow: 'rgba(90, 102, 214, 0.35)',
    light: '#9098E8',
    mid: '#5A66D6',
    dark: '#2A34A0',
  },
};

// Couleur par défaut si l'univers n'est pas trouvé - Gris neutre
const defaultColor: UniversColor = {
  bg: '#6B6B6B',
  text: '#ffffff',
  shadow: 'rgba(107, 107, 107, 0.35)',
  light: '#B8B6AF',
  mid: '#6B6B6B',
  dark: '#3A3A3A',
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
