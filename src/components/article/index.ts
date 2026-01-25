// src/components/article/index.ts
// Barrel export pour les composants d'article

export * from './types';
export * from './SocialIcons';
export * from './Accordion';
export { default as ShareModal } from './ShareModal';
export { default as RelatedArticles } from './RelatedArticles';
export { default as ArticleHero } from './ArticleHero';
export { MobileActionBar, MobileTocButton, MobileTocModal } from './MobileActions';
export { createPortableTextComponents } from './PortableTextComponents';
