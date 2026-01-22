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
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(ARTICLE_META_QUERY)}&$slug="${slug}"`

  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const data = await response.json()
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

// Fonction pour injecter les métadonnées dans le HTML
function injectMetaTags(baseHTML: string, article: any, slug: string): string {
  const title = article?.title || 'Origines Media - La profondeur du récit'
  const description = article?.description || 'Une expérience média premium pour les chercheurs de sens. Découvrez des récits authentiques et des univers narratifs profonds.'
  const image = article?.image || 'https://origines.media/og-image.png'
  const url = `https://origines.media/article/${slug}`

  let html = baseHTML

  // 1. SUPPRIMER toutes les balises Open Graph existantes
  html = html.replace(/<meta property="og:[^"]*"[^>]*>/g, '')
  html = html.replace(/<meta name="twitter:[^"]*"[^>]*>/g, '')
  html = html.replace(/<meta property="article:[^"]*"[^>]*>/g, '')

  // 2. SUPPRIMER les balises meta génériques (title, description, canonical)
  html = html.replace(/<meta name="title"[^>]*>/g, '')
  html = html.replace(/<meta name="description"[^>]*>/g, '')
  html = html.replace(/<link rel="canonical"[^>]*>/g, '')

  // 3. REMPLACER le <title>
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)} | Origines Media</title>`)

  // 4. INJECTER les nouvelles métadonnées
  const metaTags = `
    <!-- Article Dynamic Meta Tags -->
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
  `

  html = html.replace('</head>', `${metaTags}\n  </head>`)

  return html
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query
  const userAgent = req.headers['user-agent'] || ''

  try {
    // Récupérer le HTML de base (index.html buildé par Vite)
    const baseHTMLResponse = await fetch('https://origines.media/index.html')
    const baseHTML = await baseHTMLResponse.text()

    // Récupérer les métadonnées de l'article
    const article = await fetchArticleMeta(slug as string)

    // Injecter les métadonnées dans le HTML
    const html = injectMetaTags(baseHTML, article, slug as string)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

    // Logging pour debug
    if (isCrawler(userAgent)) {
      console.log(`Crawler detected: ${userAgent.substring(0, 50)} for article: ${slug}`)
    }

    res.status(200).send(html)
  } catch (error) {
    console.error('Error in article pre-render:', error)
    // En cas d'erreur, rediriger vers l'index
    res.redirect(302, '/')
  }
}
