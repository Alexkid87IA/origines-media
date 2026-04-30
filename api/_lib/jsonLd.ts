import { BASE_URL, SITE_NAME } from './constants.js'

const LOGO_URL = `${BASE_URL}/logos/logo-publisher.png`

export function articleSchema(props: {
  title: string
  description: string
  image: string
  url: string
  publishedAt?: string
  modifiedAt?: string
  author?: string
  section?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    image: props.image,
    url: props.url,
    datePublished: props.publishedAt,
    dateModified: props.modifiedAt || props.publishedAt,
    author: {
      '@type': props.author ? 'Person' : 'Organization',
      name: props.author || SITE_NAME,
      ...(props.author ? {} : { url: BASE_URL }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL, width: 255, height: 60 },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': props.url },
    articleSection: props.section,
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

export function itemListSchema(items: Array<{ name: string; url: string; image?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: `${BASE_URL}${item.url}`,
      ...(item.image ? { image: item.image } : {}),
    })),
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logos/logo-black.png`,
    sameAs: [
      'https://www.youtube.com/@origines',
      'https://x.com/originesmedia',
      'https://www.instagram.com/origines.media',
      'https://www.linkedin.com/company/origines-media',
    ],
  }
}

export function jsonLdTag(schema: Record<string, unknown>): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}
