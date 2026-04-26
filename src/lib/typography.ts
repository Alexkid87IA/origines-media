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

export function smartExcerpt(text: string | undefined | null, maxLen = 200): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  const sentenceEnd = /[.!?…]/g;
  let lastGoodCut = -1;
  let match;
  while ((match = sentenceEnd.exec(clean)) !== null) {
    if (match.index + 1 <= maxLen) {
      lastGoodCut = match.index + 1;
    } else {
      break;
    }
  }
  if (lastGoodCut > 40) return clean.slice(0, lastGoodCut).trim();
  const wordBoundary = clean.lastIndexOf(" ", maxLen);
  if (wordBoundary > 40) return clean.slice(0, wordBoundary).trim() + "…";
  return clean.slice(0, maxLen).trim() + "…";
}

const WORDS_PER_MINUTE = 230;

export function estimateReadingTime(blocks: any[] | undefined | null): number {
  if (!blocks || !Array.isArray(blocks)) return 0;
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

export function estimateReadingTimeFromText(text: string | undefined | null): number {
  if (!text) return 0;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount === 0) return 0;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
