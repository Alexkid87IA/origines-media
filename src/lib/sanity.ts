// src/lib/sanity.ts
import { createClient } from '@sanity/client'

const PROJECT_ID = 'r941i081'
const DATASET = 'production'
const API_VERSION = '2024-03-01'

export const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: !import.meta.env.DEV,
  apiVersion: API_VERSION,
})

const DEV_SANITY_PROXY = `/sanity-api/v${API_VERSION}/data/query/${DATASET}`

async function fetchViaDevProxy<T>(query: string, params: Record<string, unknown>): Promise<T> {
  const searchParams = new URLSearchParams({ query })

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(`$${key}`, JSON.stringify(value))
    }
  })

  const response = await fetch(`${DEV_SANITY_PROXY}?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error(`Sanity proxy error ${response.status}: ${response.statusText}`)
  }

  const payload = await response.json()

  if (payload.error) {
    throw new Error(payload.error.description || payload.error.message || 'Sanity query error')
  }

  return payload.result as T
}

// Fonction utilitaire pour retry avec exponential backoff
async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  maxRetries = 3,
  timeout = 30000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Créer un AbortController pour le timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const result = await Promise.race([
          fetchFn(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
          )
        ])
        clearTimeout(timeoutId)
        return result
      } finally {
        clearTimeout(timeoutId)
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Si c'est le dernier essai, throw
      if (attempt === maxRetries) {
        break
      }

      // Exponential backoff: 500ms, 1s, 2s
      const delay = Math.min(500 * Math.pow(2, attempt), 3000)
      console.warn(`Sanity fetch attempt ${attempt + 1} failed, retrying in ${delay}ms...`, lastError.message)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Unknown error in fetchWithRetry')
}

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return fetchWithRetry(async () => {
    if (import.meta.env.DEV) {
      return fetchViaDevProxy<T>(query, params)
    }

    return client.fetch<T>(query, params)
  })
}

// Fonction helper pour récupérer des données
export async function fetchFromSanity(query: string, params = {}) {
  if (import.meta.env.DEV) {
    return fetchViaDevProxy(query, params)
  }

  return client.fetch(query, params)
}

// Type pour les sources d'images
interface SanityImageRef {
  _type: 'image';
  asset?: {
    _ref: string;
  };
}

type ImageSource = string | SanityImageRef | null | undefined;

// Options pour l'optimisation d'images
interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto' | 'jpg' | 'png';
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  blur?: number;
}

// Fonction pour construire les URLs d'images Sanity avec optimisation
export function urlFor(source: ImageSource, options: ImageOptions = {}): string {
  if (!source) return ''

  // Si c'est déjà une URL complète (comme vos placeholders Pexels), on la retourne
  if (typeof source === 'string' && source.startsWith('http')) {
    // Si c'est une image Sanity CDN, on ajoute les paramètres d'optimisation
    if (source.includes('cdn.sanity.io')) {
      return buildSanityImageUrl(source, options)
    }
    return source
  }

  // Si c'est une référence d'image Sanity
  if (typeof source === 'object' && source._type === 'image' && source.asset?._ref) {
    const ref = source.asset._ref
    const projectId = 'r941i081'
    const dataset = 'production'

    // Format: image-{id}-{width}x{height}-{format}
    const [, id, dimensions, format] = ref.split('-')
    const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`

    return buildSanityImageUrl(baseUrl, options)
  }

  return typeof source === 'string' ? source : ''
}

// Helper pour ajouter les paramètres d'optimisation à une URL Sanity
function buildSanityImageUrl(baseUrl: string, options: ImageOptions): string {
  const params = new URLSearchParams()

  // Dimensions
  if (options.width) params.set('w', String(options.width))
  if (options.height) params.set('h', String(options.height))

  // Qualité (défaut 80 pour un bon compromis taille/qualité)
  params.set('q', String(options.quality || 80))

  // Format automatique (WebP/AVIF selon support navigateur)
  if (options.format === 'auto' || !options.format) {
    params.set('auto', 'format')
  } else {
    params.set('fm', options.format)
  }

  // Fit mode
  if (options.fit) params.set('fit', options.fit)

  // Blur (pour placeholders)
  if (options.blur) params.set('blur', String(options.blur))

  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}${params.toString()}`
}

// Fonction pour générer un srcset responsive
export function generateSrcSet(source: ImageSource, widths: number[] = [320, 640, 768, 1024, 1280, 1536]): string {
  if (!source) return ''

  return widths
    .map(w => `${urlFor(source, { width: w, format: 'auto' })} ${w}w`)
    .join(', ')
}

// Fonction pour générer une image placeholder blur
export function getBlurPlaceholder(source: ImageSource): string {
  return urlFor(source, { width: 20, quality: 20, blur: 50 })
}

// Export par défaut du client pour compatibilité
export default client
