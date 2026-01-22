// src/components/navbar/types.ts
// Types pour les composants de navigation

export interface SubCategory {
  name: string;
  href: string;
}

export interface FeaturedArticle {
  title: string;
  image: string;
  href: string;
  tag: string;
  tagColor: string;
}

export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  color?: string;
  hoverColor?: string;
  hoverBg?: string;
  subcategories?: SubCategory[][];
  featuredArticles?: FeaturedArticle[];
}

export interface SocialLink {
  icon: React.FC;
  href: string;
  label: string;
  color: string;
}

export interface SeriesItem {
  title: string;
  image: string;
  href: string;
  episodes?: number;
  color: string;
}

export interface FeaturedContent {
  title: string;
  image: string;
  href: string;
  tag: string;
  tagColor: string;
}

export interface UniversItem {
  name: string;
  href: string;
  color: string;
}

export interface AcademieItem {
  name: string;
  subtitle: string;
  href: string;
  price: string;
  originalPrice?: string;
  highlight?: boolean;
  free?: boolean;
}

export interface RecoItem {
  name: string;
  href: string;
  color: string;
}
