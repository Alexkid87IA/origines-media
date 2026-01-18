// src/lib/imageUrl.ts
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { client } from './sanity';

// Créer une instance du builder
const builder = imageUrlBuilder(client);

// Type pour les assets d'images
interface ImageAsset {
  _ref: string;
}

// Helper function pour obtenir l'URL d'une image
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Fonction spécifique pour les images dans PortableText
export function getImageUrl(asset: ImageAsset | null | undefined): string {
  if (!asset?._ref) return '';

  try {
    // Utiliser le builder pour construire l'URL
    return urlFor(asset).url();
  } catch {
    // Fallback : construction manuelle
    const projectId = 'r941i081';
    const dataset = 'production';
    const ref = asset._ref;

    // Format: image-{id}-{width}x{height}-{format}
    const [, id, dimensions, format] = ref.split('-');
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }
}