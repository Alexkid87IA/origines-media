// src/lib/sanity.ts
import { createClient } from '@sanity/client'

const PROJECT_ID = 'r941i081'
const DATASET = 'production'
const API_VERSION = '2024-03-01'

// Détection de l'environnement de développement
const isDev = import.meta.env.DEV

// Configuration du client Sanity avec proxy en développement
export const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: !isDev, // CDN activé en production, désactivé en dev
  apiVersion: API_VERSION,
})

// Fonction de fetch qui utilise le proxy en développement
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (isDev) {
    // En développement, utiliser le proxy Vite pour éviter CORS
    const encodedQuery = encodeURIComponent(query)
    const paramString = Object.entries(params)
      .map(([key, value]) => `$${key}=${encodeURIComponent(JSON.stringify(value))}`)
      .join('&')

    const url = `/sanity-api/v${API_VERSION}/data/query/${DATASET}?query=${encodedQuery}${paramString ? '&' + paramString : ''}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Sanity fetch error: ${response.status}`)
    }
    const data = await response.json()
    return data.result as T
  } else {
    // En production, utiliser le client Sanity directement
    return client.fetch<T>(query, params)
  }
}

// Fonction helper pour récupérer des données
export async function fetchFromSanity(query: string, params = {}) {
  try {
    const data = await client.fetch(query, params)
    return data
  } catch (error) {
    throw error
  }
}

// Type pour les sources d'images
interface SanityImageRef {
  _type: 'image';
  asset?: {
    _ref: string;
  };
}

type ImageSource = string | SanityImageRef | null | undefined;

// Fonction pour construire les URLs d'images Sanity
export function urlFor(source: ImageSource): string {
  // Pour l'instant on retourne l'URL directement
  // Plus tard vous pourrez utiliser @sanity/image-url pour plus d'options
  if (!source) return ''

  // Si c'est déjà une URL complète (comme vos placeholders Pexels), on la retourne
  if (typeof source === 'string' && source.startsWith('http')) {
    return source
  }

  // Si c'est une référence d'image Sanity
  if (typeof source === 'object' && source._type === 'image' && source.asset?._ref) {
    const ref = source.asset._ref
    const projectId = 'r941i081'
    const dataset = 'production'

    // Format: image-{id}-{width}x{height}-{format}
    const [, id, dimensions, format] = ref.split('-')

    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
  }

  return typeof source === 'string' ? source : ''
}

// Export par défaut du client pour compatibilité
export default client