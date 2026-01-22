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

// Query pour récupérer tous les contenus dynamiques
const CONTENT_QUERY = `{
  "articles": *[_type == "production" && defined(slug.current)] | order(datePublication desc) [0...500] {
    "slug": slug.current,
    "updatedAt": _updatedAt
  },
  "series": *[_type == "serie" && defined(slug.current)] | order(_createdAt desc) [0...100] {
    "slug": slug.current,
    "updatedAt": _updatedAt
  },
  "histoires": *[_type == "portrait" && defined(slug.current)] | order(datePublication desc) [0...200] {
    "slug": slug.current,
    "updatedAt": _updatedAt
  },
  "recommandations": *[_type == "recommandation" && defined(slug.current)] | order(_createdAt desc) [0...100] {
    "slug": slug.current,
    "updatedAt": _updatedAt
  },
  "univers": *[_type == "verticale" && defined(slug.current)] [0...20] {
    "slug": slug.current,
    "updatedAt": _updatedAt
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

function generateSitemapXML(content: any): string {
  let urls = ''

  // Pages statiques
  for (const page of STATIC_PAGES) {
    urls += `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  }

  // Articles dynamiques
  if (content?.articles) {
    for (const article of content.articles) {
      urls += `
  <url>
    <loc>${BASE_URL}/article/${article.slug}</loc>
    <lastmod>${formatDate(article.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    }
  }

  // Séries
  if (content?.series) {
    for (const serie of content.series) {
      urls += `
  <url>
    <loc>${BASE_URL}/series/${serie.slug}</loc>
    <lastmod>${formatDate(serie.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    }
  }

  // Histoires/Portraits
  if (content?.histoires) {
    for (const histoire of content.histoires) {
      urls += `
  <url>
    <loc>${BASE_URL}/histoire/${histoire.slug}</loc>
    <lastmod>${formatDate(histoire.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    }
  }

  // Recommandations
  if (content?.recommandations) {
    for (const reco of content.recommandations) {
      urls += `
  <url>
    <loc>${BASE_URL}/recommandation/${reco.slug}</loc>
    <lastmod>${formatDate(reco.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    }
  }

  // Univers
  if (content?.univers) {
    for (const uni of content.univers) {
      urls += `
  <url>
    <loc>${BASE_URL}/univers/${uni.slug}</loc>
    <lastmod>${formatDate(uni.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
