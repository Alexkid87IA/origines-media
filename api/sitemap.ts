// API serverless pour générer le sitemap.xml dynamiquement
import type { VercelRequest, VercelResponse } from '@vercel/node'

const SANITY_PROJECT_ID = 'r941i081'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-03-01'
const BASE_URL = 'https://www.origines.media'

// Pages statiques du site
const STATIC_PAGES = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/articles', priority: 0.9, changefreq: 'daily' },
  { url: '/videos', priority: 0.9, changefreq: 'daily' },
  { url: '/histoires', priority: 0.9, changefreq: 'daily' },
  { url: '/series', priority: 0.8, changefreq: 'weekly' },
  { url: '/univers', priority: 0.8, changefreq: 'weekly' },
  { url: '/recommandations', priority: 0.8, changefreq: 'weekly' },
  { url: '/bibliotheque', priority: 0.7, changefreq: 'weekly' },
  { url: '/a-propos', priority: 0.6, changefreq: 'monthly' },
  { url: '/contact', priority: 0.5, changefreq: 'monthly' },
  { url: '/partenariats', priority: 0.5, changefreq: 'monthly' },
  { url: '/racontez-votre-histoire', priority: 0.5, changefreq: 'monthly' },
  { url: '/mentions-legales', priority: 0.3, changefreq: 'yearly' },
  { url: '/cgu', priority: 0.3, changefreq: 'yearly' },
  { url: '/cgv', priority: 0.3, changefreq: 'yearly' },
]

// Query pour récupérer tous les contenus dynamiques avec images
const CONTENT_QUERY = `{
  "articles": *[_type == "production" && defined(slug.current)] | order(datePublication desc) [0...500] {
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "titre": titre,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "typeArticle": typeArticle,
    "videoUrl": videoUrl
  },
  "series": *[_type == "serie" && defined(slug.current)] | order(_createdAt desc) [0...100] {
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "titre": titre,
    "imageUrl": imageUrl
  },
  "histoires": *[_type == "portrait" && defined(slug.current)] | order(datePublication desc) [0...200] {
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "titre": titre,
    "imageUrl": imageUrl
  },
  "recommandations": *[_type == "recommandation" && defined(slug.current)] | order(_createdAt desc) [0...100] {
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "titre": titre,
    "imageUrl": imageUrl
  },
  "univers": *[_type == "verticale" && defined(slug.current)] [0...20] {
    "slug": slug.current,
    "updatedAt": _updatedAt,
    "nom": nom,
    "imageUrl": image.asset->url
  }
}`

async function fetchSanityContent() {
  const params = new URLSearchParams({ query: CONTENT_QUERY })
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?${params}`

  try {
    const response = await fetch(url)
    if (!response.ok) return null
    const data = await response.json()
    return data.result
  } catch (error) {
    console.error('Error fetching Sanity content for sitemap:', error)
    return null
  }
}

function formatDate(date: string | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0]
  return new Date(date).toISOString().split('T')[0]
}

// Helper pour échapper les caractères XML
function escapeXml(str: string | undefined): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Helper pour générer la balise image
function generateImageTag(imageUrl: string | undefined, title: string | undefined): string {
  if (!imageUrl) return ''
  return `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
    </image:image>`
}

// Helper pour générer la balise video
function generateVideoTag(videoUrl: string | undefined, title: string | undefined, imageUrl: string | undefined): string {
  if (!videoUrl) return ''
  // Extraire l'ID YouTube si présent
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

function generateSitemapXML(content: any): string {
  const today = new Date().toISOString().split('T')[0]
  let urls = ''

  // Pages statiques avec lastmod
  for (const page of STATIC_PAGES) {
    urls += `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  }

  // Articles dynamiques avec images
  if (content?.articles) {
    for (const article of content.articles) {
      const isVideo = article.typeArticle === 'video' && article.videoUrl
      urls += `
  <url>
    <loc>${BASE_URL}/article/${article.slug}</loc>
    <lastmod>${formatDate(article.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${generateImageTag(article.imageUrl, article.titre)}${isVideo ? generateVideoTag(article.videoUrl, article.titre, article.imageUrl) : ''}
  </url>`
    }
  }

  // Séries avec images
  if (content?.series) {
    for (const serie of content.series) {
      urls += `
  <url>
    <loc>${BASE_URL}/series/${serie.slug}</loc>
    <lastmod>${formatDate(serie.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${generateImageTag(serie.imageUrl, serie.titre)}
  </url>`
    }
  }

  // Histoires/Portraits avec images
  if (content?.histoires) {
    for (const histoire of content.histoires) {
      urls += `
  <url>
    <loc>${BASE_URL}/histoire/${histoire.slug}</loc>
    <lastmod>${formatDate(histoire.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${generateImageTag(histoire.imageUrl, histoire.titre)}
  </url>`
    }
  }

  // Recommandations avec images
  if (content?.recommandations) {
    for (const reco of content.recommandations) {
      urls += `
  <url>
    <loc>${BASE_URL}/recommandation/${reco.slug}</loc>
    <lastmod>${formatDate(reco.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${generateImageTag(reco.imageUrl, reco.titre)}
  </url>`
    }
  }

  // Univers avec images
  if (content?.univers) {
    for (const uni of content.univers) {
      urls += `
  <url>
    <loc>${BASE_URL}/univers/${uni.slug}</loc>
    <lastmod>${formatDate(uni.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${generateImageTag(uni.imageUrl, uni.nom)}
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
    const content = await fetchSanityContent()
    const sitemap = generateSitemapXML(content)

    res.setHeader('Content-Type', 'application/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).send(sitemap)
  } catch (error) {
    console.error('Error generating sitemap:', error)
    res.status(500).send('Error generating sitemap')
  }
}
