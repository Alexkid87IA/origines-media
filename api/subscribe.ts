// API serverless pour inscription email (newsletter + notifications produit)
// Abstraction CRM : supporte Brevo (Sendinblue) avec fallback gracieux
import type { VercelRequest, VercelResponse } from '@vercel/node'

// Validation email RFC 5322 simplifiée
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

// Sanitisation basique
function sanitize(str: string): string {
  return str.trim().toLowerCase()
}

// Sources autorisées
const VALID_SOURCES = ['newsletter', 'boutique', 'article', 'exit-intent', 'homepage'] as const
type Source = typeof VALID_SOURCES[number]

interface SubscribeBody {
  email: string
  source: Source
  productId?: string
  productName?: string
}

// Envoi vers Brevo API v3
async function addToBrevo(data: SubscribeBody): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.warn('[subscribe] BREVO_API_KEY not configured — email stored in logs only')
    return { success: true }
  }

  const attributes: Record<string, string> = {
    SOURCE: data.source,
  }
  if (data.productId) attributes.PRODUCT_INTEREST = data.productId
  if (data.productName) attributes.PRODUCT_NAME = data.productName

  // Listes Brevo par source
  const listIds: number[] = []
  const newsletterListId = process.env.BREVO_LIST_NEWSLETTER ? parseInt(process.env.BREVO_LIST_NEWSLETTER) : null
  const boutiqueListId = process.env.BREVO_LIST_BOUTIQUE ? parseInt(process.env.BREVO_LIST_BOUTIQUE) : null

  if (data.source === 'newsletter' && newsletterListId) {
    listIds.push(newsletterListId)
  } else if (data.source === 'boutique' && boutiqueListId) {
    listIds.push(boutiqueListId)
  } else if (newsletterListId) {
    listIds.push(newsletterListId)
  }

  const body: Record<string, unknown> = {
    email: data.email,
    attributes,
    updateEnabled: true,
  }
  if (listIds.length > 0) body.listIds = listIds

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(body),
    })

    // 201 = créé, 204 = mis à jour (duplicate)
    if (response.status === 201 || response.status === 204) {
      return { success: true }
    }

    // Contact déjà existant — Brevo retourne 400 avec "Contact already exist"
    if (response.status === 400) {
      const errorData = await response.json()
      if (errorData?.message?.includes('Contact already exist')) {
        return { success: true } // Pas une erreur pour nous
      }
      return { success: false, error: errorData?.message || 'Erreur Brevo' }
    }

    return { success: false, error: `Brevo HTTP ${response.status}` }
  } catch (err) {
    console.error('[subscribe] Brevo API error:', err)
    return { success: false, error: 'Erreur de connexion au service email' }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.origines.media')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store')

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // POST uniquement
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, source, productId, productName } = req.body as Partial<SubscribeBody>

  // Validation email
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email requis' })
  }

  const cleanEmail = sanitize(email)
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ error: 'Email invalide' })
  }

  // Validation source
  if (!source || !VALID_SOURCES.includes(source as Source)) {
    return res.status(400).json({ error: 'Source invalide' })
  }

  // Log pour monitoring (visible dans Vercel logs)
  console.log(`[subscribe] ${cleanEmail} from=${source}${productId ? ` product=${productId}` : ''}`)

  // Envoi au CRM
  const result = await addToBrevo({
    email: cleanEmail,
    source: source as Source,
    productId: typeof productId === 'string' ? productId : undefined,
    productName: typeof productName === 'string' ? productName : undefined,
  })

  if (!result.success) {
    return res.status(500).json({ error: result.error || 'Erreur interne' })
  }

  return res.status(200).json({
    success: true,
    message: 'Inscription réussie',
  })
}
