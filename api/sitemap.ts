// API serverless pour générer le sitemap.xml dynamiquement
import type { VercelRequest, VercelResponse } from '@vercel/node'

const SANITY_PROJECT_ID = 'r941i081'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-01-01'
const SANITY_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
const BASE_URL = 'https://www.origines.media'

// Pages statiques du site
const STATIC_PAGES = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/articles', priority: 0.9, changefreq: 'daily' },
  { url: '/media', priority: 0.9, changefreq: 'daily' },
  { url: '/programmes', priority: 0.8, changefreq: 'weekly' },
  { url: '/guides', priority: 0.8, changefreq: 'weekly' },
  { url: '/boutique', priority: 0.8, changefreq: 'weekly' },
  { url: '/newsletter', priority: 0.7, changefreq: 'monthly' },
  { url: '/temoignages', priority: 0.8, changefreq: 'weekly' },
  { url: '/histoires', priority: 0.9, changefreq: 'daily' },
  { url: '/recommandations', priority: 0.8, changefreq: 'weekly' },
  { url: '/dossiers', priority: 0.8, changefreq: 'weekly' },
  { url: '/ensemble', priority: 0.7, changefreq: 'weekly' },
  { url: '/bibliotheque', priority: 0.7, changefreq: 'weekly' },
  { url: '/recherche', priority: 0.5, changefreq: 'weekly' },
  { url: '/a-propos', priority: 0.6, changefreq: 'monthly' },
  { url: '/contact', priority: 0.5, changefreq: 'monthly' },
  { url: '/partenariats', priority: 0.5, changefreq: 'monthly' },
  { url: '/rejoindre', priority: 0.5, changefreq: 'monthly' },
  { url: '/racontez-votre-histoire', priority: 0.5, changefreq: 'monthly' },
  { url: '/ecrire-mon-histoire', priority: 0.5, changefreq: 'monthly' },
  { url: '/series', priority: 0.8, changefreq: 'weekly' },
  { url: '/videos', priority: 0.9, changefreq: 'daily' },
]

// GROQ queries pour récupérer tous les contenus dynamiques
const CONTENT_QUERY = `{
  "productions": *[_type == "production" && defined(slug.current)] | order(datePublication desc) {
    "slug": slug.current,
    "type": coalesce(typeArticle, "article"),
    "lastmod": coalesce(dateModification, datePublication, _updatedAt),
    "titre": titre,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "videoUrl": videoUrl
  },
  "portraits": *[_type == "portrait" && defined(slug.current)] | order(datePublication desc) {
    "slug": slug.current,
    "lastmod": coalesce(_updatedAt, datePublication),
    "titre": titre,
    "imageUrl": imageUrl
  },
  "recommendations": *[_type == "recommendation" && defined(slug.current)] | order(_createdAt desc) {
    "slug": slug.current,
    "lastmod": _updatedAt,
    "titre": titre,
    "imageUrl": imageUrl
  },
  "series": *[_type == "serie" && defined(slug.current)] {
    "slug": slug.current,
    "lastmod": _updatedAt,
    "titre": titre,
    "imageUrl": imageUrl
  }
}`

interface SanityContent {
  productions?: Array<{
    slug: string
    type: string
    lastmod: string
    titre?: string
    imageUrl?: string
    videoUrl?: string
  }>
  portraits?: Array<{
    slug: string
    lastmod: string
    titre?: string
    imageUrl?: string
  }>
  recommendations?: Array<{
    slug: string
    lastmod: string
    titre?: string
    imageUrl?: string
  }>
  series?: Array<{
    slug: string
    lastmod: string
    titre?: string
    imageUrl?: string
  }>
}

async function fetchSanityContent(): Promise<SanityContent | null> {
  const params = new URLSearchParams({ query: CONTENT_QUERY })
  const url = `${SANITY_URL}?${params}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`Sanity API responded with ${response.status}: ${response.statusText}`)
      return null
    }
    const data = await response.json()
    return data.result as SanityContent
  } catch (error) {
    console.error('Error fetching Sanity content for sitemap:', error)
    return null
  }
}

function formatDate(date: string | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0]
  try {
    return new Date(date).toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

// Helper pour echapper les caracteres XML
function escapeXml(str: string | undefined): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Helper pour generer la balise image
function generateImageTag(imageUrl: string | undefined, title: string | undefined): string {
  if (!imageUrl) return ''
  return `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
    </image:image>`
}

// Helper pour generer la balise video
function generateVideoTag(videoUrl: string | undefined, title: string | undefined, imageUrl: string | undefined): string {
  if (!videoUrl) return ''
  // Extraire l'ID YouTube si present
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  const thumbnailUrl = youtubeMatch
    ? `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`
    : imageUrl

  return `
    <video:video>
      <video:thumbnail_loc>${escapeXml(thumbnailUrl)}</video:thumbnail_loc>
      <video:title>${escapeXml(title)}</video:title>
      <video:player_loc>${escapeXml(videoUrl)}</video:player_loc>
    </video:video>`
}

function generateSitemapXML(content: SanityContent | null): string {
  const today = new Date().toISOString().split('T')[0]
  let urls = ''

  // Pages statiques
  for (const page of STATIC_PAGES) {
    urls += `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  }

  // Articles et videos dynamiques
  if (content?.productions) {
    for (const item of content.productions) {
      const isVideo = item.type === 'video'
      const urlPath = isVideo ? `/video/${item.slug}` : `/article/${item.slug}`
      const priority = isVideo ? 0.7 : 0.8

      urls += `
  <url>
    <loc>${BASE_URL}${urlPath}</loc>
    <lastmod>${formatDate(item.lastmod)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>${generateImageTag(item.imageUrl, item.titre)}${isVideo && item.videoUrl ? generateVideoTag(item.videoUrl, item.titre, item.imageUrl) : ''}
  </url>`
    }
  }

  // Histoires/Portraits
  if (content?.portraits) {
    for (const histoire of content.portraits) {
      urls += `
  <url>
    <loc>${BASE_URL}/histoire/${histoire.slug}</loc>
    <lastmod>${formatDate(histoire.lastmod)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${generateImageTag(histoire.imageUrl, histoire.titre)}
  </url>`
    }
  }

  // Recommandations
  if (content?.recommendations) {
    for (const reco of content.recommendations) {
      urls += `
  <url>
    <loc>${BASE_URL}/recommandation/${reco.slug}</loc>
    <lastmod>${formatDate(reco.lastmod)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${generateImageTag(reco.imageUrl, reco.titre)}
  </url>`
    }
  }

  // Series
  if (content?.series) {
    for (const serie of content.series) {
      urls += `
  <url>
    <loc>${BASE_URL}/series/${serie.slug}</loc>
    <lastmod>${formatDate(serie.lastmod)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${generateImageTag(serie.imageUrl, serie.titre)}
  </url>`
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Fetch dynamic content from Sanity; falls back to static pages only on failure
    const content = await fetchSanityContent()
    const sitemap = generateSitemapXML(content)

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).send(sitemap)
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Even on unexpected error, serve static-only sitemap
    try {
      const fallbackSitemap = generateSitemapXML(null)
      res.setHeader('Content-Type', 'application/xml')
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
      res.status(200).send(fallbackSitemap)
    } catch (fatalError) {
      console.error('Fatal error generating sitemap:', fatalError)
      res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>')
    }
  }
}
