// src/types/sanity.ts
// Types centralisés pour les données Sanity

import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Base document type
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
}

// Slug type
export interface SanitySlug {
  current: string;
  _type?: 'slug';
}

// Image type
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Author type
export interface Author extends SanityDocument {
  name: string;
  slug?: SanitySlug;
  image?: SanityImage;
  bio?: string;
  role?: string;
}

// Univers type
export interface Univers extends SanityDocument {
  nom: string;
  slug?: SanitySlug;
  description?: string;
  couleur?: string;
  imageUrl?: string;
}

// Verticale type
export interface Verticale extends SanityDocument {
  nom: string;
  slug?: SanitySlug;
  description?: string;
  couleurDominante?: string;
  imageUrl?: string;
}

// Format type
export interface Format extends SanityDocument {
  nom: string;
  slug?: SanitySlug;
  description?: string;
  couleur?: string;
}

// Tag type
export interface Tag extends SanityDocument {
  nom: string;
  slug?: SanitySlug;
  couleur?: string;
}

// PortableText block types
export interface PortableTextBlock {
  _key: string;
  _type: 'block' | 'image' | string;
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
  children?: Array<{
    _key: string;
    _type: 'span';
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
  }>;
  listItem?: 'bullet' | 'number';
  level?: number;
  asset?: SanityImage['asset'];
  alt?: string;
  caption?: string;
}

// Article type
export interface Article extends SanityDocument {
  titre: string;
  slug: SanitySlug;
  accroche?: string;
  chapeau?: string;
  imageUrl?: string;
  image?: SanityImage;
  contenu?: PortableTextBlock[];
  body?: PortableTextBlock[];
  author?: Author;
  datePublication?: string;
  tempsLecture?: number;
  vues?: number;
  likes?: number;
  verticale?: Verticale;
  univers?: Univers;
  format?: Format;
  tags?: Tag[];
  isFeatured?: boolean;
  isExclusif?: boolean;
}

// Portrait type
export interface Portrait extends SanityDocument {
  titre: string;
  slug?: SanitySlug;
  categorie?: string;
  accroche?: string;
  imageUrl?: string;
  contenu?: PortableTextBlock[];
}

// Video type
export interface Video extends SanityDocument {
  titre: string;
  slug?: SanitySlug;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  duree?: number;
}

// Production type
export interface Production extends SanityDocument {
  titre: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  format?: Format;
  univers?: Univers;
  verticale?: Verticale;
}

// Related article (simplified)
export interface RelatedArticle {
  _id: string;
  titre: string;
  slug: SanitySlug;
  accroche?: string;
  imageUrl?: string;
  tempsLecture?: number;
  verticale?: {
    nom: string;
    couleurDominante?: string;
  };
}

// Export type for urlFor function
export type ImageSource = SanityImageSource;

// ============ EXPLORER TYPES ============
// Types pour les données retournées par les queries Explorer

export interface ExplorerArticle {
  _id: string;
  titre: string;
  description?: string;
  typeArticle?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
  tempsLecture?: number;
  verticale?: {
    _id: string;
    nom: string;
    couleurDominante?: string;
    slug: string;
  };
}

export interface ExplorerVideo {
  _id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  duree?: number;
  vues?: number;
  slug: string;
  datePublication?: string;
  verticale?: {
    _id: string;
    nom: string;
    couleurDominante?: string;
    slug: string;
  };
}

export interface ExplorerSerie {
  _id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  episodeCount?: number;
  datePublication?: string;
  verticale?: {
    _id: string;
    nom: string;
    couleurDominante?: string;
    slug: string;
  };
}

export interface ExplorerReco {
  _id: string;
  titre: string;
  type?: string;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
}

export interface ExplorerHistoire {
  _id: string;
  titre: string;
  categorie?: string;
  accroche?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
  verticale?: {
    _id: string;
    nom: string;
    couleurDominante?: string;
    slug: string;
  };
}

export interface ExplorerVerticale {
  _id: string;
  nom: string;
  slug: { current: string };
  couleurDominante?: string;
}

// ============ PRODUCTION QUERY TYPES ============

export interface ProductionQueryResult {
  _id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  slug?: { current: string };
  datePublication?: string;
  duree?: number;
  vues?: number;
  likes?: number;
  videoUrl?: string;
}
