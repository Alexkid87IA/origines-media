import type { VercelRequest, VercelResponse } from '@vercel/node'
import { BASE_URL, SANITY_URL, SITE_NAME } from './_lib/constants.js'

const NEWS_WINDOW_HOURS = 48

const NEWS_QUERY = `
  *[
    _type == "production" &&
    defined(slug.current) &&
    defined(datePublication) &&
    datePublication >= $from &&
    coalesce(typeArticle, "article") != "video"
  ] | order(datePublication desc)[0...1000] {
    "slug": slug.current,
    "title": titre,
    "publishedAt": datePublication
  }
`

interface NewsItem {
  slug: string
  title: string
  publishedAt: string
}

function escapeXml(value: string | undefined | null): string {
  if (!value) return ''
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function fetchRecentNews(): Promise<NewsItem[]> {
  const from = new Date(Date.now() - NEWS_WINDOW_HOURS * 60 * 60 * 1000).toISOString()
  const params = new URLSearchParams({ query: NEWS_QUERY })
  params.set('$from', JSON.stringify(from))

  const response = await fetch(`${SANITY_URL}?${params}`)
  if (!response.ok) {
    throw new Error(`Sanity news sitemap responded with ${response.status}`)
  }

  const data = await response.json()
  return Array.isArray(data.result) ? data.result : []
}

function generateNewsSitemap(items: NewsItem[]): string {
  const urls = items
    .filter(item => item.slug && item.title && item.publishedAt)
    .map(item => {
      return `  <url>
    <loc>${BASE_URL}/article/${escapeXml(item.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>fr</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(new Date(item.publishedAt).toISOString())}</news:publication_date>
      <news:title>${escapeXml(item.title)}</news:title>
    </news:news>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const news = await fetchRecentNews()
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=900')
    res.status(200).send(generateNewsSitemap(news))
  } catch (error) {
    console.error('[sitemap-news] error:', error)
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600')
    res.status(200).send(generateNewsSitemap([]))
  }
}
