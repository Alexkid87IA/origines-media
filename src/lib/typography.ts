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
