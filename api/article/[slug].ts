// Vercel Serverless Function pour pre-rendering des métadonnées Open Graph
import type { VercelRequest, VercelResponse } from '@vercel/node'

// Liste des user agents de crawlers de réseaux sociaux
const CRAWLER_USER_AGENTS = [
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'TelegramBot',
  'Slackbot',
  'Discordbot',
  'SkypeUriPreview',
  'pinterest',
  'redditbot',
]

// Configuration Sanity
const SANITY_PROJECT_ID = 'r941i081'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-03-01'

// Query pour récupérer les métadonnées d'un article
const ARTICLE_META_QUERY = `
  *[_type == "production" && slug.current == $slug][0] {
    "title": titre,
    "description": description,
    "image": coalesce(image.asset->url, imageUrl),
    "publishedAt": datePublication,
    "author": auteur->nom
  }
`

// Fonction pour détecter si c'est un crawler
function isCrawler(userAgent: string): boolean {
  if (!userAgent) return false
  const lowerUA = userAgent.toLowerCase()
  return CRAWLER_USER_AGENTS.some(crawler => lowerUA.includes(crawler.toLowerCase()))
}

// Fonction pour récupérer les données depuis Sanity
async function fetchArticleMeta(slug: string) {
  // Utiliser URLSearchParams pour un encodage correct des paramètres
  const params = new URLSearchParams({
    query: ARTICLE_META_QUERY,
    '$slug': `"${slug}"`
  })
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?${params.toString()}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`Sanity API error: ${response.status} ${response.statusText}`)
      return null
    }
    const data = await response.json()
    console.log(`Article meta fetched for slug "${slug}":`, data.result ? 'found' : 'not found')
    return data.result
  } catch (error) {
    console.error('Error fetching article meta:', error)
    return null
  }
}

// Fonction pour échapper le HTML
function escapeHtml(text: string): string {
  if (!text) return ''
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

// Génère le HTML complet avec meta tags pour les crawlers
function generateCrawlerHTML(article: any, slug: string): string {
  const title = article?.title || 'Origines Media - La profondeur du récit'
  const description = article?.description || 'Une expérience média premium pour les chercheurs de sens. Découvrez des récits authentiques et des univers narratifs profonds.'
  const image = article?.image || 'https://origines.media/og-image.png'
  const url = `https://origines.media/article/${slug}`

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Favicons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

    <!-- SEO -->
    <title>${escapeHtml(title)} | Origines Media</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${url}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Origines Media" />
    <meta property="og:locale" content="fr_FR" />
    ${article?.publishedAt ? `<meta property="article:published_time" content="${article.publishedAt}" />` : ''}
    ${article?.author ? `<meta property="article:author" content="${escapeHtml(article.author)}" />` : ''}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:site" content="@originesmedia" />

    <meta name="theme-color" content="#0A0A0A" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query
  const userAgent = req.headers['user-agent'] || ''
  const slugStr = Array.isArray(slug) ? slug.join('/') : (slug as string)

  // Vérifier si c'est un crawler ou un vrai utilisateur
  const isCrawlerRequest = isCrawler(userAgent)

  // Pour les vrais utilisateurs, rediriger vers la même URL avec ?_rdr=1
  // Ce paramètre permet de bypasser l'API et servir le SPA directement
  if (!isCrawlerRequest) {
    const redirectUrl = `/article/${slugStr}?_rdr=1`
    res.setHeader('Cache-Control', 'no-cache')
    return res.redirect(302, redirectUrl)
  }

  // Pour les crawlers: générer le HTML avec les meta tags
  try {
    const article = await fetchArticleMeta(slugStr)
    console.log(`Crawler pre-render for slug "${slugStr}":`, article ? 'found' : 'not found')
    console.log(`Crawler UA: ${userAgent.substring(0, 80)}`)

    const html = generateCrawlerHTML(article, slugStr)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).send(html)
  } catch (error) {
    console.error('Error in crawler pre-render:', error)
    const html = generateCrawlerHTML(null, slugStr)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.status(200).send(html)
  }
}
