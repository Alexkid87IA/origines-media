// Vercel Serverless Function — catch-all prerender for social-media bots.
// Returns minimal HTML with Open Graph / Twitter meta tags so that
// Facebook, LinkedIn, Twitter, WhatsApp, Telegram, Discord, Slack, etc.
// can display a rich preview without executing JavaScript.
//
// For real browsers the vercel.json rewrite won't match (no bot UA) so
// this function is never reached; the SPA is served as usual.

import type { VercelRequest, VercelResponse } from '@vercel/node'

// ---------------------------------------------------------------------------
// Sanity configuration
// ---------------------------------------------------------------------------
const SANITY_PROJECT_ID = 'r941i081'
const SANITY_DATASET = 'production'
const SANITY_API_VERSION = '2024-03-01'
const SANITY_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`

const BASE_URL = 'https://www.origines.media'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`
const SITE_NAME = 'Origines Media'
const DEFAULT_TITLE = 'Origines Media — La profondeur du récit'
const DEFAULT_DESCRIPTION =
  'Une expérience média premium pour les chercheurs de sens. Découvrez des récits authentiques et des univers narratifs profonds.'

// ---------------------------------------------------------------------------
// Sanity GROQ queries (meta-only — lightweight)
// ---------------------------------------------------------------------------
const ARTICLE_META_QUERY = `
  *[_type == "production" && slug.current == $slug][0] {
    "title": titre,
    "description": coalesce(description, extrait, chapeau),
    "image": coalesce(image.asset->url, imageUrl),
    "publishedAt": datePublication,
    "author": coalesce(author->name, auteur->nom),
    "type": coalesce(typeArticle, "article")
  }
`

const PORTRAIT_META_QUERY = `
  *[_type == "portrait" && slug.current == $slug][0] {
    "title": titre,
    "description": coalesce(accroche, citation),
    "image": coalesce(image.asset->url, imageUrl),
    "author": titre
  }
`

const RECOMMENDATION_META_QUERY = `
  *[_type == "recommendation" && slug.current == $slug][0] {
    "title": titre,
    "description": coalesce(accroche, type),
    "image": coalesce(image.asset->url, imageUrl),
    "author": auteur
  }
`

const SERIES_META_QUERY = `
  *[_type == "serie" && slug.current == $slug][0] {
    "title": titre,
    "description": description,
    "image": coalesce(poster.asset->url, imageUrl)
  }
`

const DOSSIER_META_QUERY = `
  *[_type == "questionDeLaSemaine" && slug.current == $slug][0] {
    "title": question,
    "description": chapeau,
    "image": coalesce(image.asset->url, mainImage.asset->url)
  }
`

// ---------------------------------------------------------------------------
// Static page meta lookup
// ---------------------------------------------------------------------------
interface PageMeta {
  title: string
  description: string
  image?: string
  ogType?: string
}

const STATIC_PAGES: Record<string, PageMeta> = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    ogType: 'website',
  },
  '/articles': {
    title: 'Articles — Origines Media',
    description:
      'Tous nos articles : analyses, récits, interviews et réflexions sur les grands sujets de société.',
  },
  '/videos': {
    title: 'Vidéos — Origines Media',
    description:
      'Découvrez nos programmes vidéo originaux : documentaires, interviews et contenus exclusifs.',
  },
  '/histoires': {
    title: 'Histoires — Origines Media',
    description:
      'Des parcours de vie inspirants, des témoignages authentiques et des portraits intimes.',
  },
  '/recommandations': {
    title: 'Recommandations — Origines Media',
    description:
      'Livres, films, podcasts, musiques… les coups de cœur de la rédaction.',
  },
  '/series': {
    title: 'Séries — Origines Media',
    description:
      'Nos séries éditoriales : des contenus à suivre sur la durée.',
  },
  '/dossiers': {
    title: 'Dossiers — Origines Media',
    description:
      'La question de la semaine et nos dossiers thématiques approfondis.',
  },
  '/univers': {
    title: 'Univers — Origines Media',
    description:
      'Explorez nos univers narratifs : psychologie, société, culture, bien-être, spiritualité.',
  },
  '/bibliotheque': {
    title: 'Bibliothèque — Origines Media',
    description:
      'Explorez toute notre bibliothèque de contenus par format, thème et popularité.',
  },
  '/programmes': {
    title: 'Programmes — Origines Media',
    description:
      'Nos programmes vidéo originaux : Il était une fois, État d\'esprit, Transmission…',
  },
  '/guides': {
    title: 'Guides — Origines Media',
    description: 'Nos guides pratiques pour vous accompagner au quotidien.',
  },
  '/boutique': {
    title: 'Boutique — Origines Media',
    description: 'La boutique Origines : guides, ateliers et contenus premium.',
  },
  '/newsletter': {
    title: 'Newsletter — Origines Media',
    description:
      'Inscrivez-vous à la newsletter Origines pour recevoir le meilleur de nos contenus.',
  },
  '/temoignages': {
    title: 'Témoignages — Origines Media',
    description:
      'Les témoignages de notre communauté : partages de vie et expériences.',
  },
  '/ensemble': {
    title: 'Ensemble — Origines Media',
    description:
      'Rejoignez la communauté Origines et participez à l\'aventure.',
  },
  '/communaute': {
    title: 'Communauté — Origines Media',
    description:
      'Rejoignez la communauté Origines et participez à l\'aventure.',
  },
  '/a-propos': {
    title: 'À propos — Origines Media',
    description:
      'Découvrez l\'histoire et la mission d\'Origines Media, un média de sens.',
  },
  '/contact': {
    title: 'Contact — Origines Media',
    description: 'Contactez l\'équipe Origines Media.',
  },
  '/partenariats': {
    title: 'Partenariats — Origines Media',
    description: 'Découvrez nos offres de partenariat et de sponsoring.',
  },
  '/rejoindre': {
    title: 'Rejoindre Origines — Origines Media',
    description:
      'Contribuez à Origines Media : écrivez, filmez, partagez votre histoire.',
  },
  '/racontez-votre-histoire': {
    title: 'Racontez votre histoire — Origines Media',
    description:
      'Partagez votre parcours de vie avec la communauté Origines.',
  },
  '/ecrire-mon-histoire': {
    title: 'Écrire mon histoire — Origines Media',
    description:
      'Rédigez et partagez votre témoignage sur Origines Media.',
  },
  '/recherche': {
    title: 'Recherche — Origines Media',
    description: 'Recherchez parmi tous les contenus d\'Origines Media.',
  },
  '/inscription': {
    title: 'Inscription — Origines Media',
    description: 'Créez votre compte Origines Media.',
  },
  '/connexion': {
    title: 'Connexion — Origines Media',
    description: 'Connectez-vous à votre compte Origines Media.',
  },
  '/media': {
    title: 'Média — Origines Media',
    description:
      'L\'actualité Origines : tous nos derniers articles, vidéos et contenus.',
    ogType: 'website',
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escapeHtml(text: string): string {
  if (!text) return ''
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

async function fetchSanity(query: string, slug: string): Promise<Record<string, string> | null> {
  const params = new URLSearchParams({
    query,
    '$slug': `"${slug}"`,
  })
  try {
    const response = await fetch(`${SANITY_URL}?${params}`)
    if (!response.ok) {
      console.error(`[prerender] Sanity ${response.status} for slug "${slug}"`)
      return null
    }
    const data = await response.json()
    return data.result ?? null
  } catch (err) {
    console.error('[prerender] Sanity fetch error:', err)
    return null
  }
}

// ---------------------------------------------------------------------------
// Route → meta resolver
// ---------------------------------------------------------------------------
interface ResolvedMeta {
  title: string
  description: string
  image: string
  url: string
  ogType: string
  publishedAt?: string
  author?: string
}

async function resolveMeta(path: string): Promise<ResolvedMeta> {
  const url = `${BASE_URL}${path}`
  const defaults: ResolvedMeta = {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    url,
    ogType: 'website',
  }

  // 1. Static pages --------------------------------------------------------
  const staticMeta = STATIC_PAGES[path]
  if (staticMeta) {
    return {
      ...defaults,
      title: staticMeta.title,
      description: staticMeta.description,
      image: staticMeta.image || DEFAULT_OG_IMAGE,
      ogType: staticMeta.ogType || 'website',
    }
  }

  // 2. Dynamic pages — match route patterns ---------------------------------
  const segments = path.split('/').filter(Boolean)

  // /article/:slug  or  /recit/:slug  or  /production/:slug
  if (
    segments.length === 2 &&
    (segments[0] === 'article' || segments[0] === 'recit' || segments[0] === 'production')
  ) {
    const slug = segments[1]
    const data = await fetchSanity(ARTICLE_META_QUERY, slug)
    if (data) {
      return {
        ...defaults,
        title: (data.title as string) || defaults.title,
        description: (data.description as string) || defaults.description,
        image: (data.image as string) || DEFAULT_OG_IMAGE,
        ogType: 'article',
        publishedAt: data.publishedAt as string | undefined,
        author: data.author as string | undefined,
      }
    }
    return defaults
  }

  // /video/:slug — also a production in Sanity
  if (segments.length === 2 && segments[0] === 'video') {
    const slug = segments[1]
    const data = await fetchSanity(ARTICLE_META_QUERY, slug)
    if (data) {
      return {
        ...defaults,
        title: (data.title as string) || defaults.title,
        description: (data.description as string) || defaults.description,
        image: (data.image as string) || DEFAULT_OG_IMAGE,
        ogType: 'video.other',
        publishedAt: data.publishedAt as string | undefined,
        author: data.author as string | undefined,
      }
    }
    return defaults
  }

  // /histoire/:slug  or  /portraits/:slug
  if (
    segments.length === 2 &&
    (segments[0] === 'histoire' || segments[0] === 'portraits')
  ) {
    const slug = segments[1]
    const data = await fetchSanity(PORTRAIT_META_QUERY, slug)
    if (data) {
      return {
        ...defaults,
        title: (data.title as string) || defaults.title,
        description: (data.description as string) || defaults.description,
        image: (data.image as string) || DEFAULT_OG_IMAGE,
        ogType: 'article',
        author: data.author as string | undefined,
      }
    }
    return defaults
  }

  // /recommandation/:slug  or  /recommandations/:slug
  if (
    segments.length === 2 &&
    (segments[0] === 'recommandation' || segments[0] === 'recommandations')
  ) {
    const slug = segments[1]
    const data = await fetchSanity(RECOMMENDATION_META_QUERY, slug)
    if (data) {
      return {
        ...defaults,
        title: (data.title as string) || defaults.title,
        description: (data.description as string) || defaults.description,
        image: (data.image as string) || DEFAULT_OG_IMAGE,
        ogType: 'article',
        author: data.author as string | undefined,
      }
    }
    return defaults
  }

  // /series/:slug
  if (segments.length === 2 && segments[0] === 'series') {
    const slug = segments[1]
    const data = await fetchSanity(SERIES_META_QUERY, slug)
    if (data) {
      return {
        ...defaults,
        title: (data.title as string) || defaults.title,
        description: (data.description as string) || defaults.description,
        image: (data.image as string) || DEFAULT_OG_IMAGE,
        ogType: 'website',
      }
    }
    return defaults
  }

  // /dossiers/:slug
  if (segments.length === 2 && segments[0] === 'dossiers') {
    const slug = segments[1]
    const data = await fetchSanity(DOSSIER_META_QUERY, slug)
    if (data) {
      return {
        ...defaults,
        title: (data.title as string) || defaults.title,
        description: (data.description as string) || defaults.description,
        image: (data.image as string) || DEFAULT_OG_IMAGE,
        ogType: 'article',
      }
    }
    return defaults
  }

  // /comprendre/:slug  /reflexions/:slug  /temoignages/:slug
  if (
    segments.length === 2 &&
    (segments[0] === 'comprendre' || segments[0] === 'reflexions' || segments[0] === 'temoignages')
  ) {
    const slug = segments[1]
    const data = await fetchSanity(ARTICLE_META_QUERY, slug)
    if (data) {
      return {
        ...defaults,
        title: (data.title as string) || defaults.title,
        description: (data.description as string) || defaults.description,
        image: (data.image as string) || DEFAULT_OG_IMAGE,
        ogType: 'article',
        publishedAt: data.publishedAt as string | undefined,
        author: data.author as string | undefined,
      }
    }
    return defaults
  }

  // Fallback — unknown route
  return defaults
}

// ---------------------------------------------------------------------------
// HTML template
// ---------------------------------------------------------------------------
function renderHTML(meta: ResolvedMeta): string {
  const t = escapeHtml(meta.title)
  const d = escapeHtml(meta.description)
  const img = meta.image // already a URL, no HTML escaping needed (not user-generated HTML)

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Favicons -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

  <!-- SEO -->
  <title>${t}</title>
  <meta name="title" content="${t}" />
  <meta name="description" content="${d}" />
  <link rel="canonical" href="${meta.url}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${meta.ogType}" />
  <meta property="og:url" content="${meta.url}" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:image" content="${img}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="fr_FR" />
  ${meta.publishedAt ? `<meta property="article:published_time" content="${meta.publishedAt}" />` : ''}
  ${meta.author ? `<meta property="article:author" content="${escapeHtml(meta.author)}" />` : ''}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${meta.url}" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image" content="${img}" />
  <meta name="twitter:site" content="@originesmedia" />

  <meta name="theme-color" content="#0A0A0A" />
</head>
<body>
  <h1>${t}</h1>
  <p>${d}</p>
  <noscript>
    <p>Ce site nécessite JavaScript. <a href="${meta.url}">${meta.url}</a></p>
  </noscript>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Reconstruct the original path from the catch-all parameter
  const pathParam = req.query.path
  const pathStr = Array.isArray(pathParam) ? `/${pathParam.join('/')}` : `/${pathParam || ''}`
  // Normalise: remove trailing slash (except for root)
  const path = pathStr === '/' ? '/' : pathStr.replace(/\/+$/, '')

  console.log(`[prerender] path="${path}" UA="${(req.headers['user-agent'] || '').substring(0, 80)}"`)

  try {
    const meta = await resolveMeta(path)
    const html = renderHTML(meta)

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).send(html)
  } catch (err) {
    console.error('[prerender] error:', err)
    // Fallback — always return *something* so the preview isn't blank
    const fallback = renderHTML({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      image: DEFAULT_OG_IMAGE,
      url: `${BASE_URL}${path}`,
      ogType: 'website',
    })
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
    return res.status(200).send(fallback)
  }
}
