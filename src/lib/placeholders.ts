// src/lib/placeholders.ts
// Placeholders centralisés pour remplacer les images Pexels hardcodées
// Ces placeholders seront utilisés uniquement quand Sanity ne retourne pas d'image

// Placeholder générique - image grise avec icône
export const PLACEHOLDER_IMAGE = '/placeholder.svg';

// Placeholder pour les avatars (plus petit, carré)
export const PLACEHOLDER_AVATAR = '/placeholder-avatar.svg';

// Placeholder pour les vidéos (ratio 16:9)
export const PLACEHOLDER_VIDEO = '/placeholder.svg';

// Placeholder pour les séries (poster vertical)
export const PLACEHOLDER_POSTER = '/placeholder.svg';

// Fonction helper pour obtenir l'URL d'image avec fallback
export function getImageWithFallback(url: string | null | undefined, fallback = PLACEHOLDER_IMAGE): string {
  if (!url || url.trim() === '') {
    return fallback;
  }
  return url;
}

// Fonction helper pour les avatars
export function getAvatarWithFallback(url: string | null | undefined): string {
  return getImageWithFallback(url, PLACEHOLDER_AVATAR);
}
