// src/lib/sanity.ts
import { createClient } from '@sanity/client'

// Configuration du client Sanity
export const client = createClient({
  projectId: 'sf5v7lj3', // Votre Project ID
  dataset: 'production', // Le dataset à utiliser
  useCdn: true, // Utilise le CDN pour de meilleures performances
  apiVersion: '2024-03-01', // Version de l'API Sanity
})

// Fonction helper pour récupérer des données
export async function fetchFromSanity(query: string, params = {}) {
  try {
    const data = await client.fetch(query, params)
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des données Sanity:', error)
    throw error
  }
}

// Fonction pour construire les URLs d'images Sanity
export function urlFor(source: any) {
  // Pour l'instant on retourne l'URL directement
  // Plus tard vous pourrez utiliser @sanity/image-url pour plus d'options
  if (!source) return ''
  
  // Si c'est déjà une URL complète (comme vos placeholders Pexels), on la retourne
  if (typeof source === 'string' && source.startsWith('http')) {
    return source
  }
  
  // Si c'est une référence d'image Sanity
  if (source._type === 'image' && source.asset?._ref) {
    const ref = source.asset._ref
    const projectId = 'sf5v7lj3'
    const dataset = 'production'
    
    // Format: image-{id}-{width}x{height}-{format}
    const [, id, dimensions, format] = ref.split('-')
    
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
  }
  
  return source
}

// Export par défaut du client pour compatibilité
export default client