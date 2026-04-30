import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  BASE_URL, DEFAULT_OG_IMAGE, SITE_NAME,
  DEFAULT_TITLE, DEFAULT_DESCRIPTION,
  UNIVERS_MAP, UNIVERS_DATA,
} from '../_lib/constants'
import {
  articleSchema, videoSchema, breadcrumbSchema,
  faqSchema, organizationSchema, jsonLdTag,
} from '../_lib/jsonLd'
import {
  ARTICLE_FULL_QUERY, VIDEO_FULL_QUERY,
  PORTRAIT_FULL_QUERY, RECOMMENDATION_FULL_QUERY,
  SERIES_FULL_QUERY, DOSSIER_FULL_QUERY,
  SUBTOPIC_ARTICLES_QUERY, LIST_ARTICLES_QUERY,
  fetchSanity,
} from '../_lib/queries'
import { renderPortableText } from '../_lib/portableTextToHtml'

// ---------------------------------------------------------------------------
// Static page meta
// ---------------------------------------------------------------------------
interface PageMeta {
  title: string
  description: string
  image?: string
  ogType?: string
}

const STATIC_PAGES: Record<string, PageMeta> = {
  '/': { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, ogType: 'website' },
  '/articles': { title: 'Articles — Origines Media', description: 'Tous nos articles : analyses, récits, interviews et réflexions sur les grands sujets de société.' },
  '/videos': { title: 'Vidéos — Origines Media', description: 'Découvrez nos programmes vidéo originaux : documentaires, interviews et contenus exclusifs.' },
  '/histoires': { title: 'Histoires — Origines Media', description: 'Des parcours de vie inspirants, des témoignages authentiques et des portraits intimes.' },
  '/recommandations': { title: 'Recommandations — Origines Media', description: 'Livres, films, podcasts, musiques… les coups de cœur de la rédaction.' },
  '/series': { title: 'Séries — Origines Media', description: 'Nos séries éditoriales : des contenus à suivre sur la durée.' },
  '/dossiers': { title: 'Dossiers — Origines Media', description: 'La question de la semaine et nos dossiers thématiques approfondis.' },
  '/univers': { title: 'Univers — Origines Media', description: 'Explorez nos univers narratifs : psychologie, société, culture, bien-être, spiritualité.' },
  '/bibliotheque': { title: 'Bibliothèque — Origines Media', description: 'Explorez toute notre bibliothèque de contenus par format, thème et popularité.' },
  '/programmes': { title: 'Programmes — Origines Media', description: 'Nos programmes vidéo originaux : Il était une fois, État d\'esprit, Transmission…' },
  '/guides': { title: 'Guides — Origines Media', description: 'Nos guides pratiques pour vous accompagner au quotidien.' },
  '/boutique': { title: 'Boutique — Origines Media', description: 'La boutique Origines : guides, ateliers et contenus premium.' },
  '/newsletter': { title: 'Newsletter — Origines Media', description: 'Inscrivez-vous à la newsletter Origines pour recevoir le meilleur de nos contenus.' },
  '/temoignages': { title: 'Témoignages — Origines Media', description: 'Les témoignages de notre communauté : partages de vie et expériences.' },
  '/ensemble': { title: 'Ensemble — Origines Media', description: 'Rejoignez la communauté Origines et participez à l\'aventure.' },
  '/a-propos': { title: 'À propos — Origines Media', description: 'Découvrez l\'histoire et la mission d\'Origines Media, un média de sens.' },
  '/contact': { title: 'Contact — Origines Media', description: 'Contactez l\'équipe Origines Media.' },
  '/partenariats': { title: 'Partenariats — Origines Media', description: 'Découvrez nos offres de partenariat et de sponsoring.' },
  '/rejoindre': { title: 'Rejoindre Origines — Origines Media', description: 'Contribuez à Origines Media : écrivez, filmez, partagez votre histoire.' },
  '/ecrire-mon-histoire': { title: 'Écrire mon histoire — Origines Media', description: 'Rédigez et partagez votre témoignage sur Origines Media.' },
  '/recherche': { title: 'Recherche — Origines Media', description: 'Recherchez parmi tous les contenus d\'Origines Media.' },
  '/media': { title: 'Média — Origines Media', description: 'L\'actualité Origines : tous nos derniers articles, vidéos et contenus.', ogType: 'website' },
  '/inscription': { title: 'Inscription — Origines Media', description: 'Créez votre compte Origines Media.' },
  '/connexion': { title: 'Connexion — Origines Media', description: 'Connectez-vous à votre compte Origines Media.' },
  '/cgu': { title: 'CGU — Origines Media', description: 'Conditions générales d\'utilisation du site Origines Media.' },
  '/cgv': { title: 'CGV — Origines Media', description: 'Conditions générales de vente d\'Origines Media.' },
  '/confidentialite': { title: 'Confidentialité — Origines Media', description: 'Politique de confidentialité d\'Origines Media.' },
  '/cookies': { title: 'Cookies — Origines Media', description: 'Politique de cookies du site Origines Media.' },
  '/mentions-legales': { title: 'Mentions Légales — Origines Media', description: 'Mentions légales du site Origines Media.' },
  '/plan-du-site': { title: 'Plan du Site — Origines Media', description: 'Retrouvez toutes les pages du site Origines Media.' },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function esc(text: string | undefined | null): string {
  if (!text) return ''
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

function formatDate(d: string | undefined): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return '' }
}

// ---------------------------------------------------------------------------
// Enriched meta interface
// ---------------------------------------------------------------------------
interface ResolvedMeta {
  title: string
  description: string
  image: string
  url: string
  ogType: string
  publishedAt?: string
  modifiedAt?: string
  author?: string
  bodyHtml?: string
  jsonLdBlocks?: string[]
  breadcrumbs?: Array<{ name: string; url: string }>
  readTime?: number
  section?: string
}

// ---------------------------------------------------------------------------
// Route → meta resolver
// ---------------------------------------------------------------------------
async function resolveMeta(path: string): Promise<ResolvedMeta> {
  const url = `${BASE_URL}${path}`
  const defaults: ResolvedMeta = {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    url,
    ogType: 'website',
  }

  // Static pages
  const staticMeta = STATIC_PAGES[path]
  if (staticMeta) {
    const meta: ResolvedMeta = {
      ...defaults,
      title: staticMeta.title,
      description: staticMeta.description,
      image: staticMeta.image || DEFAULT_OG_IMAGE,
      ogType: staticMeta.ogType || 'website',
    }
    if (path === '/') {
      meta.jsonLdBlocks = [jsonLdTag(organizationSchema())]
    }
    return meta
  }

  const segments = path.split('/').filter(Boolean)

  // /article/:slug  /recit/:slug  /production/:slug
  if (segments.length === 2 && ['article', 'recit', 'production'].includes(segments[0])) {
    const slug = segments[1]
    const data = await fetchSanity<any>(ARTICLE_FULL_QUERY, { slug })
    if (data) {
      const isVideo = data.type === 'video'
      const crumbs = [
        { name: 'Accueil', url: '/' },
        { name: isVideo ? 'Vidéos' : 'Articles', url: isVideo ? '/videos' : '/articles' },
        { name: data.title || slug, url: `/article/${slug}` },
      ]
      const schemas: string[] = []
      if (isVideo && data.videoUrl) {
        schemas.push(jsonLdTag(videoSchema({
          title: data.title, description: data.description || '', image: data.image || DEFAULT_OG_IMAGE,
          url, videoUrl: data.videoUrl, publishedAt: data.publishedAt,
        })))
      } else {
        schemas.push(jsonLdTag(articleSchema({
          title: data.title, description: data.description || '', image: data.image || DEFAULT_OG_IMAGE,
          url, publishedAt: data.publishedAt, modifiedAt: data.modifiedAt,
          author: data.author, section: data.verticaleNom || data.soustopic,
        })))
      }
      schemas.push(jsonLdTag(breadcrumbSchema(crumbs)))

      return {
        ...defaults,
        title: data.title || defaults.title,
        description: data.description || defaults.description,
        image: data.image || DEFAULT_OG_IMAGE,
        ogType: isVideo ? 'video.other' : 'article',
        publishedAt: data.publishedAt,
        modifiedAt: data.modifiedAt,
        author: data.author,
        readTime: data.readTime,
        section: data.verticaleNom,
        bodyHtml: renderPortableText(data.contenu),
        jsonLdBlocks: schemas,
        breadcrumbs: crumbs,
      }
    }
    return defaults
  }

  // /video/:slug
  if (segments.length === 2 && segments[0] === 'video') {
    const slug = segments[1]
    const data = await fetchSanity<any>(VIDEO_FULL_QUERY, { slug })
    if (data) {
      const crumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Vidéos', url: '/videos' },
        { name: data.title || slug, url: `/video/${slug}` },
      ]
      const schemas = [
        jsonLdTag(videoSchema({
          title: data.title, description: data.description || '', image: data.image || DEFAULT_OG_IMAGE,
          url, videoUrl: data.videoUrl, publishedAt: data.publishedAt,
        })),
        jsonLdTag(breadcrumbSchema(crumbs)),
      ]
      return {
        ...defaults,
        title: data.title || defaults.title,
        description: data.description || defaults.description,
        image: data.image || DEFAULT_OG_IMAGE,
        ogType: 'video.other',
        publishedAt: data.publishedAt,
        author: data.author,
        readTime: data.readTime,
        bodyHtml: renderPortableText(data.contenu),
        jsonLdBlocks: schemas,
        breadcrumbs: crumbs,
      }
    }
    return defaults
  }

  // /histoire/:slug  /portraits/:slug
  if (segments.length === 2 && ['histoire', 'portraits'].includes(segments[0])) {
    const slug = segments[1]
    const data = await fetchSanity<any>(PORTRAIT_FULL_QUERY, { slug })
    if (data) {
      const crumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Histoires', url: '/histoires' },
        { name: data.title || slug, url: `/${segments[0]}/${slug}` },
      ]
      let body = ''
      if (data.citation) body += `<blockquote><p>${esc(data.citation)}</p></blockquote>`
      if (data.biographie) body += `<p>${esc(data.biographie)}</p>`

      return {
        ...defaults,
        title: data.title || defaults.title,
        description: data.description || defaults.description,
        image: data.image || DEFAULT_OG_IMAGE,
        ogType: 'article',
        bodyHtml: body,
        jsonLdBlocks: [jsonLdTag(breadcrumbSchema(crumbs))],
        breadcrumbs: crumbs,
      }
    }
    return defaults
  }

  // /recommandations/:slug  /recommandation/:slug
  if (segments.length === 2 && ['recommandations', 'recommandation'].includes(segments[0])) {
    const slug = segments[1]
    const data = await fetchSanity<any>(RECOMMENDATION_FULL_QUERY, { slug })
    if (data) {
      const crumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Recommandations', url: '/recommandations' },
        { name: data.title || slug, url: `/recommandations/${slug}` },
      ]
      return {
        ...defaults,
        title: data.title || defaults.title,
        description: data.description || defaults.description,
        image: data.image || DEFAULT_OG_IMAGE,
        ogType: 'article',
        author: data.author,
        bodyHtml: renderPortableText(data.contenu),
        jsonLdBlocks: [jsonLdTag(breadcrumbSchema(crumbs))],
        breadcrumbs: crumbs,
      }
    }
    return defaults
  }

  // /series/:slug
  if (segments.length === 2 && segments[0] === 'series') {
    const slug = segments[1]
    const data = await fetchSanity<any>(SERIES_FULL_QUERY, { slug })
    if (data) {
      const crumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Séries', url: '/series' },
        { name: data.title || slug, url: `/series/${slug}` },
      ]
      let body = data.description ? `<p>${esc(data.description)}</p>` : ''
      if (data.episodes?.length) {
        body += '<h2>Épisodes</h2><ol>'
        for (const ep of data.episodes) {
          body += `<li><a href="/article/${ep.slug}">${esc(ep.title)}</a>${ep.description ? ` — ${esc(ep.description)}` : ''}</li>`
        }
        body += '</ol>'
      }
      return {
        ...defaults,
        title: data.title || defaults.title,
        description: data.description || defaults.description,
        image: data.image || DEFAULT_OG_IMAGE,
        ogType: 'website',
        bodyHtml: body,
        jsonLdBlocks: [jsonLdTag(breadcrumbSchema(crumbs))],
        breadcrumbs: crumbs,
      }
    }
    return defaults
  }

  // /dossiers/:slug
  if (segments.length === 2 && segments[0] === 'dossiers') {
    const slug = segments[1]
    const data = await fetchSanity<any>(DOSSIER_FULL_QUERY, { slug })
    if (data) {
      const crumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Dossiers', url: '/dossiers' },
        { name: data.title || slug, url: `/dossiers/${slug}` },
      ]
      let body = data.description ? `<p>${esc(data.description)}</p>` : ''
      if (data.articles?.length) {
        body += '<h2>Articles du dossier</h2><ul>'
        for (const a of data.articles) {
          body += `<li><a href="/article/${a.slug}">${esc(a.title)}</a>${a.description ? ` — ${esc(a.description)}` : ''}</li>`
        }
        body += '</ul>'
      }
      return {
        ...defaults,
        title: data.title || defaults.title,
        description: data.description || defaults.description,
        image: data.image || DEFAULT_OG_IMAGE,
        ogType: 'article',
        bodyHtml: body,
        jsonLdBlocks: [jsonLdTag(breadcrumbSchema(crumbs))],
        breadcrumbs: crumbs,
      }
    }
    return defaults
  }

  // /univers/:universId
  if (segments.length === 2 && segments[0] === 'univers') {
    const univers = UNIVERS_MAP[segments[1]]
    if (univers) {
      const crumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Univers', url: '/univers' },
        { name: univers.name, url: `/univers/${univers.id}` },
      ]
      const allFaqs = univers.subtopics.flatMap(st => st.faq || [])
      let body = `<p>${esc(univers.tagline)}</p>`
      body += '<h2>Thématiques</h2><ul>'
      for (const st of univers.subtopics) {
        body += `<li><a href="/univers/${univers.id}/${st.slug}">${esc(st.label)}</a>${st.description ? ` — ${esc(st.description)}` : ''}</li>`
      }
      body += '</ul>'
      if (allFaqs.length > 0) {
        body += '<h2>Questions fréquentes</h2><dl>'
        for (const faq of allFaqs.slice(0, 8)) {
          body += `<dt>${esc(faq.question)}</dt><dd>${esc(faq.answer)}</dd>`
        }
        body += '</dl>'
      }
      const schemas = [jsonLdTag(breadcrumbSchema(crumbs))]
      if (allFaqs.length > 0) schemas.push(jsonLdTag(faqSchema(allFaqs.slice(0, 10))))

      return {
        ...defaults,
        title: `${univers.name} — Origines Media`,
        description: `${univers.tagline} Explorez ${univers.subtopics.length} thématiques : ${univers.subtopics.slice(0, 5).map(s => s.label).join(', ')} et plus.`,
        ogType: 'website',
        bodyHtml: body,
        jsonLdBlocks: schemas,
        breadcrumbs: crumbs,
      }
    }
    return defaults
  }

  // /univers/:universId/:soustopic
  if (segments.length === 3 && segments[0] === 'univers') {
    const univers = UNIVERS_MAP[segments[1]]
    const subtopic = univers?.subtopics.find(st => st.slug === segments[2])
    if (univers && subtopic) {
      const crumbs = [
        { name: 'Accueil', url: '/' },
        { name: 'Univers', url: '/univers' },
        { name: univers.name, url: `/univers/${univers.id}` },
        { name: subtopic.label, url: `/univers/${univers.id}/${subtopic.slug}` },
      ]
      let body = subtopic.description ? `<p>${esc(subtopic.description)}</p>` : ''

      const articles = await fetchSanity<any[]>(SUBTOPIC_ARTICLES_QUERY, { soustopic: subtopic.slug })
      if (articles?.length) {
        body += '<h2>Articles</h2><ul>'
        for (const a of articles) {
          const href = a.type === 'video' ? `/video/${a.slug}` : `/article/${a.slug}`
          body += `<li><a href="${href}">${esc(a.title)}</a>${a.description ? ` — ${esc(a.description)}` : ''}</li>`
        }
        body += '</ul>'
      }

      if (subtopic.faq?.length) {
        body += '<h2>Questions fréquentes</h2><dl>'
        for (const faq of subtopic.faq) {
          body += `<dt>${esc(faq.question)}</dt><dd>${esc(faq.answer)}</dd>`
        }
        body += '</dl>'
      }

      const schemas = [jsonLdTag(breadcrumbSchema(crumbs))]
      if (subtopic.faq?.length) schemas.push(jsonLdTag(faqSchema(subtopic.faq)))

      return {
        ...defaults,
        title: `${subtopic.label} — ${univers.name} · Origines Media`,
        description: subtopic.description || `Tous nos articles sur ${subtopic.label.toLowerCase()} dans l'univers ${univers.name}.`,
        ogType: 'website',
        bodyHtml: body,
        jsonLdBlocks: schemas,
        breadcrumbs: crumbs,
      }
    }
    return defaults
  }

  // /format/:formatId
  if (segments.length === 2 && segments[0] === 'format') {
    const label = segments[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    return {
      ...defaults,
      title: `${label} — Origines Media`,
      description: `Découvrez nos contenus au format ${label} sur Origines Media.`,
    }
  }

  // /comprendre/:slug  /reflexions/:slug  /temoignages/:slug
  if (segments.length === 2 && ['comprendre', 'reflexions', 'temoignages'].includes(segments[0])) {
    const slug = segments[1]
    const data = await fetchSanity<any>(ARTICLE_FULL_QUERY, { slug })
    if (data) {
      const crumbs = [
        { name: 'Accueil', url: '/' },
        { name: segments[0].charAt(0).toUpperCase() + segments[0].slice(1), url: `/${segments[0]}` },
        { name: data.title || slug, url: `/${segments[0]}/${slug}` },
      ]
      const schemas = [
        jsonLdTag(articleSchema({
          title: data.title, description: data.description || '', image: data.image || DEFAULT_OG_IMAGE,
          url, publishedAt: data.publishedAt, modifiedAt: data.modifiedAt, author: data.author,
        })),
        jsonLdTag(breadcrumbSchema(crumbs)),
      ]
      return {
        ...defaults,
        title: data.title || defaults.title,
        description: data.description || defaults.description,
        image: data.image || DEFAULT_OG_IMAGE,
        ogType: 'article',
        publishedAt: data.publishedAt,
        author: data.author,
        readTime: data.readTime,
        bodyHtml: renderPortableText(data.contenu),
        jsonLdBlocks: schemas,
        breadcrumbs: crumbs,
      }
    }
    return defaults
  }

  return defaults
}

// ---------------------------------------------------------------------------
// HTML renderer
// ---------------------------------------------------------------------------
function renderHTML(meta: ResolvedMeta): string {
  const t = esc(meta.title)
  const d = esc(meta.description)
  const h1 = esc(meta.title.replace(/ — Origines Media$/, '').replace(/ · Origines Media$/, ''))

  const breadcrumbNav = meta.breadcrumbs
    ? `<nav aria-label="Breadcrumb">${meta.breadcrumbs.map((c, i) =>
        i < meta.breadcrumbs!.length - 1
          ? `<a href="${c.url}">${esc(c.name)}</a> &rsaquo; `
          : `<span>${esc(c.name)}</span>`
      ).join('')}</nav>`
    : ''

  const metaLine = [
    meta.author ? `Par ${esc(meta.author)}` : '',
    meta.publishedAt ? formatDate(meta.publishedAt) : '',
    meta.readTime ? `${meta.readTime} min de lecture` : '',
  ].filter(Boolean).join(' · ')

  const heroImg = meta.image && meta.image !== DEFAULT_OG_IMAGE
    ? `<img src="${meta.image}" alt="${h1}" style="max-width:100%;height:auto;margin:24px 0" />`
    : ''

  const jsonLd = meta.jsonLdBlocks?.join('\n  ') || ''

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <title>${t}</title>
  <meta name="title" content="${t}" />
  <meta name="description" content="${d}" />
  <link rel="canonical" href="${meta.url}" />
  <meta property="og:type" content="${meta.ogType}" />
  <meta property="og:url" content="${meta.url}" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:image" content="${meta.image}" />
  <meta property="og:image:alt" content="${t}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:locale" content="fr_FR" />
  ${meta.publishedAt ? `<meta property="article:published_time" content="${meta.publishedAt}" />` : ''}
  ${meta.modifiedAt ? `<meta property="article:modified_time" content="${meta.modifiedAt}" />` : ''}
  ${meta.author ? `<meta property="article:author" content="${esc(meta.author)}" />` : ''}
  ${meta.section ? `<meta property="article:section" content="${esc(meta.section)}" />` : ''}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${meta.url}" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image" content="${meta.image}" />
  <meta name="twitter:site" content="@originesmedia" />
  <meta name="theme-color" content="#0A0A0A" />
  ${jsonLd}
  <style>
    body{font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:0 auto;padding:20px 24px;line-height:1.7;color:#1a1a1a;background:#fff}
    nav[aria-label="Breadcrumb"]{font-size:13px;color:#888;margin-bottom:24px}
    nav[aria-label="Breadcrumb"] a{color:#888;text-decoration:none}
    h1{font-size:2em;line-height:1.2;margin:0 0 12px}
    h2{font-size:1.4em;margin:32px 0 16px;border-bottom:1px solid #eee;padding-bottom:8px}
    h3{font-size:1.2em;margin:24px 0 12px}
    .meta{font-size:14px;color:#666;margin-bottom:24px}
    img{max-width:100%;height:auto;display:block}
    figure{margin:24px 0}
    figcaption{font-size:13px;color:#888;margin-top:8px}
    blockquote{border-left:3px solid #8B5CF6;padding:8px 0 8px 20px;margin:24px 0;font-style:italic;color:#444}
    blockquote footer{font-style:normal;font-size:14px;color:#666;margin-top:8px}
    aside{background:#f7f5f0;padding:16px 20px;margin:24px 0;border-left:3px solid #E67839}
    dl{margin:16px 0}
    dt{font-weight:700;margin:16px 0 4px}
    dd{margin:0 0 12px;color:#444}
    a{color:#7B5CD6}
    table{border-collapse:collapse;width:100%;margin:24px 0}
    th,td{border:1px solid #ddd;padding:8px 12px;text-align:left}
    th{background:#f5f5f5;font-weight:600}
    footer.site{margin-top:48px;padding-top:24px;border-top:1px solid #eee;font-size:13px;color:#888}
  </style>
</head>
<body>
  ${breadcrumbNav}
  <article>
    <header>
      <h1>${h1}</h1>
      ${metaLine ? `<p class="meta">${metaLine}</p>` : ''}
    </header>
    ${heroImg}
    ${meta.bodyHtml ? `<div class="content">${meta.bodyHtml}</div>` : `<p>${d}</p>`}
  </article>
  <footer class="site">
    <p>&copy; ${SITE_NAME}</p>
    <nav>
      <a href="/">Accueil</a> · <a href="/articles">Articles</a> · <a href="/videos">Vidéos</a> · <a href="/univers">Univers</a> · <a href="/a-propos">À propos</a>
    </nav>
  </footer>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pathParam = req.query.path
  const pathStr = Array.isArray(pathParam) ? `/${pathParam.join('/')}` : `/${pathParam || ''}`
  const path = pathStr === '/' ? '/' : pathStr.replace(/\/+$/, '')

  try {
    const meta = await resolveMeta(path)
    const html = renderHTML(meta)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).send(html)
  } catch (err) {
    console.error('[prerender] error:', err)
    const fallback = renderHTML({
      title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION,
      image: DEFAULT_OG_IMAGE, url: `${BASE_URL}${path}`, ogType: 'website',
    })
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
    return res.status(200).send(fallback)
  }
}
