// src/lib/typography.ts
// Utilitaires pour la typographie française

/**
 * Applique les règles typographiques françaises à un texte.
 * - Espace insécable avant les signes de ponctuation doubles (: ; ! ?)
 * - Empêche ces signes de se retrouver seuls en début de ligne
 */
export function frenchTypography(text: string | undefined | null): string {
  if (!text) return '';

  // Remplace l'espace normale avant : ; ! ? par une espace insécable
  return text
    .replace(/ :/g, '\u00A0:')   // deux-points
    .replace(/ ;/g, '\u00A0;')   // point-virgule
    .replace(/ !/g, '\u00A0!')   // point d'exclamation
    .replace(/ \?/g, '\u00A0?'); // point d'interrogation
}

/**
 * Alias court pour frenchTypography
 */
export const typo = frenchTypography;

const WORDS_PER_MINUTE = 230;

export function estimateReadingTime(blocks: any[] | undefined | null): number {
  if (!blocks || !Array.isArray(blocks)) return 1;
  let wordCount = 0;
  for (const block of blocks) {
    if (block._type === "block" && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (typeof child.text === "string") {
          wordCount += child.text.trim().split(/\s+/).filter(Boolean).length;
        }
      }
    }
  }
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
