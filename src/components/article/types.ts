// src/components/article/types.ts
// Types pour les composants d'article

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface ArticleAuthor {
  nom?: string;
  name?: string;
  role?: string;
  bio?: string;
  specialites?: string[];
  imageUrl?: string;
  image?: { asset?: { url?: string } };
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

export interface ArticleVerticale {
  nom: string;
  couleurDominante?: string;
}

export interface ArticleTag {
  _id: string;
  title?: string;
  color?: string;
  slug?: string;
}

export interface Article {
  _id: string;
  titre?: string;
  title?: string;
  description?: string;
  excerpt?: string;
  imageUrl?: string;
  mainImage?: string;
  datePublication?: string;
  publishedAt?: string;
  tempsLecture?: number;
  readTime?: number;
  contenu?: any[];
  body?: any[];
  auteur?: ArticleAuthor;
  author?: ArticleAuthor;
  verticale?: ArticleVerticale;
  univers?: { _id: string };
  categories?: Array<{ _id: string; title?: string }>;
  tags?: ArticleTag[];
  videoUrl?: string;
}

export interface PopularArticle {
  _id: string;
  title?: string;
  slug: { current: string };
  imageUrl?: string;
  views?: number;
}

export interface RelatedArticle {
  _id: string;
  titre?: string;
  title?: string;
  slug: { current: string };
  imageUrl?: string;
  verticale?: ArticleVerticale;
}

export interface ShareButton {
  id: string;
  icon: React.FC;
  label: string;
  color: string;
}
