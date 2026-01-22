// Vercel Edge Middleware pour pre-rendering des métadonnées Open Graph
// Compatible avec Vite et toutes les SPA

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

// Template HTML avec métadonnées dynamiques
function generateHTMLWithMeta(article: any, slug: string, baseHTML: string): string {
  const title = article?.title || 'Origines Media - La profondeur du récit'
  const description = article?.description || 'Une expérience média premium pour les chercheurs de sens. Découvrez des récits authentiques et des univers narratifs profonds.'
  const image = article?.image || 'https://origines.media/og-image.png'
  const url = `https://origines.media/article/${slug}`

  // Extraire la partie <head> et le reste
  const headEndIndex = baseHTML.indexOf('</head>')
  if (headEndIndex === -1) return baseHTML

  const beforeHead = baseHTML.substring(0, headEndIndex)
  const afterHead = baseHTML.substring(headEndIndex)

  // Métadonnées dynamiques
  const dynamicMeta = `
    <!-- Article Meta Tags (Dynamic) -->
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
  `

  return beforeHead + dynamicMeta + afterHead
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

// HTML de base (fallback si on ne peut pas fetch index.html)
const BASE_HTML_TEMPLATE = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`

export default async function middleware(req: Request) {
  const userAgent = req.headers.get('user-agent') || ''

  // Si ce n'est pas un crawler, laisser passer normalement
  if (!isCrawler(userAgent)) {
    return
  }

  // Vérifier si c'est une page article
  const url = new URL(req.url)
  const articleMatch = url.pathname.match(/^\/article\/([^/]+)$/)

  if (!articleMatch) {
    return
  }

  const slug = articleMatch[1]

  try {
    // Récupérer le HTML de base
    let baseHTML: string
    try {
      const origin = url.origin
      const htmlResponse = await fetch(`${origin}/index.html`, {
        headers: {
          'user-agent': 'Vercel-Edge-Middleware'
        }
      })
      baseHTML = await htmlResponse.text()
    } catch (error) {
      console.warn('Could not fetch base HTML, using template:', error)
      baseHTML = BASE_HTML_TEMPLATE
    }

    // Récupérer les métadonnées de l'article
    const article = await fetchArticleMeta(slug)

    // Générer le HTML avec les métadonnées
    const htmlWithMeta = generateHTMLWithMeta(article, slug, baseHTML)

    // Retourner le HTML modifié
    return new Response(htmlWithMeta, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'x-robots-tag': 'index, follow',
      },
    })
  } catch (error) {
    console.error('Error in middleware:', error)
    // En cas d'erreur, laisser passer la requête normalement
    return
  }
}

// Configuration du matcher pour Vercel Edge Middleware
export const config = {
  matcher: '/article/:slug*',
}
