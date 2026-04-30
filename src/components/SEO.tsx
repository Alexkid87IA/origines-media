// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';
import { sanityOgImg } from '@/lib/sanityImage';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'video.other' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  twitterCreator?: string;
  // Structured Data props
  jsonLd?: 'organization' | 'article' | 'person' | 'breadcrumb' | 'video';
  breadcrumbs?: Array<{ name: string; url: string }>;
  videoUrl?: string;
  duration?: string; // ISO 8601 format for video
  // Additional structured data (rendered alongside jsonLd)
  itemListData?: Array<{
    name: string;
    description: string;
    image: string;
    url?: string;
  }>;
  faqData?: Array<{
    question: string;
    answer: string;
  }>;
}

const DEFAULT_TITLE = 'Origines Media';
const DEFAULT_DESCRIPTION = 'Origines Media explore ce qui nous construit : psychologie, bien-être, relations, culture et avenir. Articles, vidéos, histoires et recommandations pour ceux qui cherchent la profondeur.';
const DEFAULT_IMAGE = 'https://www.origines.media/og-image.png';
const SITE_URL = 'https://www.origines.media';

// Structured Data JSON-LD generators
const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Origines Media',
  url: SITE_URL,
  logo: `${SITE_URL}/logos/logo-black.png`,
  description: DEFAULT_DESCRIPTION,
  sameAs: [
    'https://www.youtube.com/@origines',
    'https://twitter.com/originesmedia',
    'https://www.instagram.com/origines.media',
    'https://www.linkedin.com/company/origines-media'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@origines.media'
  }
});

const generateArticleSchema = (props: {
  title: string;
  description: string;
  image: string;
  url: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: props.title,
  description: props.description,
  image: props.image,
  url: props.url,
  datePublished: props.publishedTime,
  dateModified: props.modifiedTime || props.publishedTime,
  author: {
    '@type': props.author ? 'Person' : 'Organization',
    name: props.author || 'Origines Media',
    url: props.author ? undefined : SITE_URL
  },
  publisher: {
    '@type': 'Organization',
    name: 'Origines Media',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logos/logo-publisher.png`,
      width: 255,
      height: 60
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': props.url
  },
  articleSection: props.section
});

const generatePersonSchema = (props: {
  name: string;
  description: string;
  image?: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: props.name,
  description: props.description,
  image: props.image,
  url: props.url
});

const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `${SITE_URL}${crumb.url}`
  }))
});

const generateVideoSchema = (props: {
  title: string;
  description: string;
  image: string;
  url: string;
  videoUrl?: string;
  publishedTime?: string;
  duration?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: props.title,
  description: props.description,
  thumbnailUrl: props.image,
  uploadDate: props.publishedTime,
  contentUrl: props.videoUrl,
  embedUrl: props.videoUrl,
  duration: props.duration,
  url: props.url
});

const generateItemListSchema = (items: Array<{
  name: string;
  description?: string;
  image?: string | null;
  url?: string;
}>) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.filter(i => i.name).map((item, index) => {
    const img = item.image && typeof item.image === 'string'
      ? (item.image.startsWith('http') ? item.image : `${SITE_URL}${item.image}`)
      : undefined;
    const href = item.url && typeof item.url === 'string'
      ? (item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`)
      : undefined;
    return {
      '@type': 'ListItem' as const,
      position: index + 1,
      item: {
        '@type': 'CreativeWork' as const,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        ...(img ? { image: img } : {}),
        ...(href ? { url: href } : {}),
      }
    };
  })
});

const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    }
  }))
});

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noindex = false,
  twitterCreator,
  jsonLd,
  breadcrumbs,
  videoUrl,
  duration,
  itemListData,
  faqData,
}) => {
  const fullTitle = title ? `${title} — ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const canonicalUrl = url ? `${SITE_URL}${url}` : (typeof window !== 'undefined' ? `${SITE_URL}${window.location.pathname}` : SITE_URL);
  const safeImage = (typeof image === 'string' ? image : '') || DEFAULT_IMAGE;
  const rawImageUrl = safeImage.startsWith('http') ? safeImage : `${SITE_URL}${safeImage}`;
  const imageUrl = sanityOgImg(rawImageUrl) || rawImageUrl;

  // Generate JSON-LD based on type
  const getJsonLd = () => {
    switch (jsonLd) {
      case 'organization':
        return generateOrganizationSchema();
      case 'article':
        return generateArticleSchema({
          title: title || DEFAULT_TITLE,
          description,
          image: imageUrl,
          url: canonicalUrl,
          publishedTime,
          modifiedTime,
          author,
          section
        });
      case 'person':
        return generatePersonSchema({
          name: title || '',
          description,
          image: imageUrl,
          url: canonicalUrl
        });
      case 'video':
        return generateVideoSchema({
          title: title || DEFAULT_TITLE,
          description,
          image: imageUrl,
          url: canonicalUrl,
          videoUrl,
          publishedTime,
          duration
        });
      case 'breadcrumb':
        return breadcrumbs ? generateBreadcrumbSchema(breadcrumbs) : null;
      default:
        return null;
    }
  };

  const jsonLdData = getJsonLd();
  const breadcrumbData = breadcrumbs ? generateBreadcrumbSchema(breadcrumbs) : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={title || DEFAULT_TITLE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={DEFAULT_TITLE} />
      <meta property="og:locale" content="fr_FR" />

      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.length > 0 && (
        tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title || DEFAULT_TITLE} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@originesmedia" />
      {twitterCreator && (
        <meta name="twitter:creator" content={twitterCreator} />
      )}

      {/* Additional SEO */}
      <meta name="author" content={author || DEFAULT_TITLE} />
      <meta name="theme-color" content="#0A0A0A" />

      {/* JSON-LD Structured Data */}
      {jsonLdData && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
      )}
      {breadcrumbData && jsonLd !== 'breadcrumb' && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      )}
      {itemListData && itemListData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateItemListSchema(itemListData))}
        </script>
      )}
      {faqData && faqData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema(faqData))}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
