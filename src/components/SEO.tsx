// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

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
  // Structured Data props
  jsonLd?: 'organization' | 'article' | 'person' | 'breadcrumb' | 'video';
  breadcrumbs?: Array<{ name: string; url: string }>;
  videoUrl?: string;
  duration?: string; // ISO 8601 format for video
}

const DEFAULT_TITLE = 'Origines Media';
const DEFAULT_DESCRIPTION = 'Une expérience média premium pour les chercheurs de sens. Découvrez des récits authentiques et des univers narratifs profonds.';
const DEFAULT_IMAGE = 'https://origines.media/og-image.png';
const SITE_URL = 'https://origines.media';

// Structured Data JSON-LD generators
const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Origines Media',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: DEFAULT_DESCRIPTION,
  sameAs: [
    'https://twitter.com/originesmedia',
    'https://www.instagram.com/originesmedia',
    'https://www.linkedin.com/company/originesmedia'
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
      url: `${SITE_URL}/logo.png`
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
  duration: props.duration
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
  jsonLd,
  breadcrumbs,
  videoUrl,
  duration,
}) => {
  const fullTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const safeImage = image || DEFAULT_IMAGE;
  const imageUrl = safeImage.startsWith('http') ? safeImage : `${SITE_URL}${safeImage}`;

  // Generate JSON-LD based on type
  const getJsonLd = () => {
    switch (jsonLd) {
      case 'organization':
        return generateOrganizationSchema();
      case 'article':
        return generateArticleSchema({
          title: fullTitle,
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
          title: fullTitle,
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
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@originesmedia" />

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
    </Helmet>
  );
};

export default SEO;
