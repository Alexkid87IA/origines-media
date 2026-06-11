import { BASE_URL, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME } from './constants.js'

const LOGO_URL = `${BASE_URL}/logos/logo-publisher.png`
const ORGANIZATION_ID = `${BASE_URL}/#organization`
const WEBSITE_ID = `${BASE_URL}/#website`

const MAIN_NAVIGATION = [
  { name: 'Galaxie', url: '/galaxie', description: 'La carte des formats Origines Media : articles, vidéos, guides et boutique' },
  { name: 'Articles', url: '/articles', description: 'Analyses, récits et réflexions Origines Media' },
  { name: 'Vidéos', url: '/videos', description: 'Documentaires, interviews et formats vidéo' },
  { name: 'Guides', url: '/guides', description: 'Guides pratiques et parcours éditoriaux' },
  { name: 'Univers', url: '/univers', description: 'Les grands univers éditoriaux Origines Media' },
  { name: 'Histoires', url: '/histoires', description: 'Témoignages et récits de vie' },
  { name: 'Recommandations', url: '/recommandations', description: 'Livres, films, podcasts et ressources recommandées' },
  { name: 'Boutique', url: '/boutique', description: 'Guides et ressources premium Origines Media' },
  { name: 'À propos', url: '/a-propos', description: 'La mission et la rédaction Origines Media' },
]

function withoutContext(schema: Record<string, unknown>): Record<string, unknown> {
  const rest = { ...schema }
  delete rest['@context']
  return rest
}

export function articleSchema(props: {
  title: string
  description: string
  image: string
  url: string
  publishedAt?: string
  modifiedAt?: string
  author?: string
  section?: string
  tags?: string[]
  isNews?: boolean
}) {
  return {
    '@context': 'https://schema.org',
    '@type': props.isNews ? 'NewsArticle' : 'Article',
    '@id': `${props.url}#article`,
    headline: props.title,
    description: props.description,
    image: [props.image],
    url: props.url,
    datePublished: props.publishedAt,
    dateModified: props.modifiedAt || props.publishedAt,
    inLanguage: 'fr-FR',
    isAccessibleForFree: true,
    author: {
      '@type': props.author ? 'Person' : 'Organization',
      name: props.author || SITE_NAME,
      ...(props.author ? {} : { '@id': ORGANIZATION_ID, url: BASE_URL }),
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL, width: 255, height: 60 },
    },
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': props.url },
    articleSection: props.section,
    ...(props.tags?.length ? { keywords: props.tags.join(', ') } : {}),
  }
}

export function videoSchema(props: {
  title: string
  description: string
  image: string
  url: string
  videoUrl?: string
  publishedAt?: string
  duration?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: props.title,
    description: props.description,
    thumbnailUrl: props.image,
    uploadDate: props.publishedAt,
    contentUrl: props.videoUrl,
    embedUrl: props.videoUrl,
    duration: props.duration,
    url: props.url,
    inLanguage: 'fr-FR',
    isFamilyFriendly: true,
    publisher: {
      '@type': 'NewsMediaOrganization',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL, width: 255, height: 60 },
    },
    isPartOf: { '@id': WEBSITE_ID },
  }
}

export function breadcrumbSchema(crumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${BASE_URL}${c.url}`,
    })),
  }
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export function itemListSchema(items: Array<{ name: string; url: string; description?: string; image?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: item.name,
        url: `${BASE_URL}${item.url}`,
        ...(item.description ? { description: item.description } : {}),
        ...(item.image ? { image: item.image } : {}),
      },
    })),
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: ['Origines', 'origines.media'],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logos/logo-black.png`,
      width: 512,
      height: 512,
    },
    image: DEFAULT_OG_IMAGE,
    description: DEFAULT_DESCRIPTION,
    publishingPrinciples: `${BASE_URL}/a-propos`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: 'contact@origines.media',
    },
    sameAs: [
      'https://www.youtube.com/@origines',
      'https://x.com/originesmedia',
      'https://www.instagram.com/origines.media',
      'https://www.linkedin.com/company/origines-media',
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    alternateName: ['Origines', 'origines.media'],
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'fr-FR',
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/recherche?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function siteNavigationSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': MAIN_NAVIGATION.map(item => ({
      '@type': 'SiteNavigationElement',
      name: item.name,
      description: item.description,
      url: `${BASE_URL}${item.url}`,
    })),
  }
}

export function homePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      withoutContext(organizationSchema()),
      withoutContext(websiteSchema()),
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/#webpage`,
        url: BASE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORGANIZATION_ID },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: DEFAULT_OG_IMAGE,
        },
      },
      ...MAIN_NAVIGATION.map(item => ({
        '@type': 'SiteNavigationElement',
        name: item.name,
        description: item.description,
        url: `${BASE_URL}${item.url}`,
      })),
    ],
  }
}

export function jsonLdTag(schema: Record<string, unknown>): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}
