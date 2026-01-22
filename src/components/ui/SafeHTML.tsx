// Composant pour afficher du HTML de manière sécurisée (protection XSS)
import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

// Configuration par défaut de DOMPurify
const DEFAULT_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    // Structure
    'div', 'span', 'p', 'br', 'hr',
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Lists
    'ul', 'ol', 'li',
    // Text formatting
    'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
    // Links & Media
    'a', 'img',
    // Tables
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    // Quotes & Code
    'blockquote', 'pre', 'code',
    // Iframe (pour embeds YouTube, etc.) - avec restrictions
    'iframe',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id',
    'width', 'height', 'style',
    // Iframe specific
    'frameborder', 'allowfullscreen', 'allow', 'loading',
  ],
  ALLOW_DATA_ATTR: false,
  // Forcer les liens externes à s'ouvrir dans un nouvel onglet
  ADD_ATTR: ['target'],
  // Interdire javascript: URLs
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  // Autoriser uniquement certains domaines pour les iframes
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

// Configuration stricte pour les embeds (iframes)
const EMBED_CONFIG: DOMPurify.Config = {
  ...DEFAULT_CONFIG,
  ALLOWED_TAGS: ['iframe', 'div'],
  ALLOWED_ATTR: [
    'src', 'width', 'height', 'frameborder', 'allowfullscreen',
    'allow', 'loading', 'title', 'class', 'style',
  ],
};

// Liste des domaines autorisés pour les embeds
const ALLOWED_EMBED_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'vimeo.com',
  'open.spotify.com',
  'soundcloud.com',
  'w.soundcloud.com',
  'twitter.com',
  'platform.twitter.com',
  'instagram.com',
  'www.instagram.com',
];

// Vérifie si un embed vient d'un domaine autorisé
function isAllowedEmbedDomain(html: string): boolean {
  const srcMatch = html.match(/src=["']([^"']+)["']/i);
  if (!srcMatch) return false;

  try {
    const url = new URL(srcMatch[1]);
    return ALLOWED_EMBED_DOMAINS.some(domain =>
      url.hostname === domain || url.hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Composant SafeHTML - Affiche du HTML de manière sécurisée
 *
 * @example
 * // Pour du contenu texte riche
 * <SafeHTML html={article.content} className="prose" />
 *
 * @example
 * // Pour des embeds (YouTube, Vimeo, etc.)
 * <SafeHTML html={embedCode} className="aspect-video" />
 */
const SafeHTML: React.FC<SafeHTMLProps> = ({
  html,
  className = '',
  allowedTags,
  allowedAttributes,
}) => {
  const sanitizedHTML = useMemo(() => {
    if (!html) return '';

    // Détecter si c'est un embed (iframe)
    const isEmbed = html.includes('<iframe');

    // Pour les embeds, vérifier le domaine source
    if (isEmbed && !isAllowedEmbedDomain(html)) {
      console.warn('SafeHTML: Blocked iframe from untrusted domain');
      return '<p class="text-gray-500 italic">Contenu non disponible</p>';
    }

    // Choisir la configuration appropriée
    let config: DOMPurify.Config = isEmbed ? EMBED_CONFIG : DEFAULT_CONFIG;

    // Personnalisation si des tags/attributs spécifiques sont fournis
    if (allowedTags || allowedAttributes) {
      config = {
        ...config,
        ...(allowedTags && { ALLOWED_TAGS: allowedTags }),
        ...(allowedAttributes && { ALLOWED_ATTR: allowedAttributes }),
      };
    }

    // Sanitizer le HTML
    const clean = DOMPurify.sanitize(html, config);

    // Post-traitement : ajouter rel="noopener noreferrer" aux liens externes
    return clean.replace(
      /<a\s+(?=[^>]*href=["']https?:\/\/)/gi,
      '<a rel="noopener noreferrer" '
    );
  }, [html, allowedTags, allowedAttributes]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default SafeHTML;
