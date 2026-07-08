// Configuration Google AdSense
// Les slot IDs se créent dans le dashboard AdSense : Annonces > Par bloc d'annonces.
// Coller ici l'ID (data-ad-slot) de chaque bloc créé. Un slot vide = emplacement non rendu.

export const AD_CLIENT = 'ca-pub-1236201752351510';

export const AD_SLOTS = {
  // Bloc "In-article" inséré dans le corps des articles
  articleInContent: '',
  // Multiplex (grille de contenus recommandés) en fin d'article
  articleMultiplex: '',
  // Rectangle 300x250 dans la sidebar des articles/vidéos
  sidebarRectangle: '',
  // Bannière horizontale mobile
  mobileBanner: '',
};

export const isSlotConfigured = (slot: string): boolean => slot.length > 0;
