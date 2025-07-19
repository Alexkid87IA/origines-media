// src/lib/imageUrl.ts
import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity';

// Créer une instance du builder
const builder = imageUrlBuilder(client);

// Helper function pour obtenir l'URL d'une image
export function urlFor(source: any) {
  return builder.image(source);
}

// Fonction spécifique pour les images dans PortableText
export function getImageUrl(asset: any) {
  if (!asset?._ref) return '';
  
  try {
    // Utiliser le builder pour construire l'URL
    return urlFor(asset).url();
  } catch (error) {
    console.error('Erreur lors de la construction de l\'URL de l\'image:', error);
    
    // Fallback : construction manuelle
    const projectId = 'sf5v7lj3';
    const dataset = 'production';
    const ref = asset._ref;
    
    // Format: image-{id}-{width}x{height}-{format}
    const [, id, dimensions, format] = ref.split('-');
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }
}