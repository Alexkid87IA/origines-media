// src/components/HeroSection.tsx
// Hero Premium - Cinématique, Glassmorphisme, Magazine de luxe

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { getUniversColors } from '../lib/universColors';
import { typo } from '../lib/typography';
import { sanityFetch } from '../lib/sanity';

interface Portrait {
  id: number;
  titre: string;
  categorie: string;
  accroche: string;
  imageUrl: string;
  url: string;
}

interface HeroSectionProps {
  portraits?: Portrait[];
}

// Interface pour les articles Sanity
interface SanityArticle {
  _id: string;
  titre: string;
  extrait?: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  verticale?: {
    _id: string;
    nom: string;
    slug: string;
  };
}

// Interface pour les recommandations Sanity
interface SanityRecoItem {
  _key: string;
  titre: string;
}

interface SanityReco {
  _id: string;
  titre: string;
  type: string;
  accroche?: string;
  slug: string;
  imageUrl?: string;
  items?: SanityRecoItem[];
}

// Query pour récupérer 2 recommandations aléatoires de types différents
const HERO_RECOS_QUERY = `
  *[_type == "recommendation"] | order(_createdAt desc) {
    _id,
    titre,
    type,
    accroche,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    "items": items[0...5] { _key, titre }
  }
`;

// Query pour récupérer les articles (productions) pour "À découvrir aussi"
const ARTICLES_DISCOVER_QUERY = `
  *[_type == "production" && coalesce(typeArticle, "article") in ["article", "actu", "guide", "interview"]] | order(datePublication desc) [0...50] {
    _id,
    titre,
    extrait,
    description,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    "verticale": verticale->{
      _id,
      nom,
      "slug": slug.current
    }
  }
`;

// Mapping des types Sanity vers labels affichés
const typeLabels: Record<string, string> = {
  'livres': 'Livres',
  'films-series': 'Films & Séries',
  'musique': 'Musique',
  'podcasts': 'Podcasts',
  'reseaux-sociaux': 'Réseaux',
  'youtube': 'YouTube',
  'activite': 'Activité',
  'destination': 'Destination',
  'culture': 'Culture',
  'produit': 'Produits',
};

// Images de catégorie pour les recommandations (synchronisé avec RecommandationsSection)
// Inclut les variantes de noms possibles venant de Sanity
const categoryImages: Record<string, string> = {
  'livres': '/recos/reco_livre.png',
  'livre': '/recos/reco_livre.png',
  'films-series': '/recos/reco_film_serie.png',
  'film': '/recos/reco_film_serie.png',
  'musique': '/recos/reco_musique.png',
  'podcasts': '/recos/reco_podcast.png',
  'podcast': '/recos/reco_podcast.png',
  'youtube': '/recos/reco_youtube.png',
  'reseaux-sociaux': '/recos/reco_social.png',
  'activite': '/recos/reco_activite.png',
  'destination': '/recos/reco_destination.png',
  'culture': '/recos/reco_culture.png',
  'produit': '/recos/reco_produit.png',
};

// Couleurs par type de recommandation (avec variantes)
const typeColors: Record<string, string> = {
  'livres': '#E11D48',
  'livre': '#E11D48',
  'films-series': '#7C3AED',
  'film': '#7C3AED',
  'musique': '#2563EB',
  'podcasts': '#0D9488',
  'podcast': '#0D9488',
  'youtube': '#DC2626',
  'reseaux-sociaux': '#0891B2',
  'activite': '#16A34A',
  'destination': '#EA580C',
  'culture': '#9333EA',
  'produit': '#CA8A04',
};

// Palette de couleurs disponibles pour les recommandations
const recommendationColorPalette = [
  '#FBBF24', '#F97316', '#EC4899', '#10B981', '#8B5CF6',
  '#EF4444', '#6366F1', '#14B8A6', '#0EA5E9',
];

const HeroSection: React.FC<HeroSectionProps> = ({ portraits = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    type: string;
    typeKey: string;
    title: string;
    imageUrl: string;
    slug: string;
    description: string;
    items: string[];
  }>>([]);
  const [articles, setArticles] = useState<SanityArticle[]>([]);

  // Fetch des recommandations depuis Sanity
  useEffect(() => {
    const fetchRecos = async () => {
      try {
        const data = await sanityFetch(HERO_RECOS_QUERY) as SanityReco[];
        if (data && data.length > 0) {
          const today = new Date();
          const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
          const seed = dayOfYear + today.getFullYear();

          const seededShuffle = <T,>(array: T[], seedValue: number): T[] => {
            const result = [...array];
            let currentSeed = seedValue;
            const random = () => {
              currentSeed = (currentSeed * 9301 + 49297) % 233280;
              return currentSeed / 233280;
            };
            for (let i = result.length - 1; i > 0; i--) {
              const j = Math.floor(random() * (i + 1));
              [result[i], result[j]] = [result[j], result[i]];
            }
            return result;
          };

          const shuffled = seededShuffle(data, seed);
          const selected: SanityReco[] = [];

          for (const reco of shuffled) {
            if (selected.length === 0) {
              selected.push(reco);
            } else if (selected.length === 1 && reco.type !== selected[0].type) {
              selected.push(reco);
              break;
            }
          }

          if (selected.length < 2 && shuffled.length >= 2) {
            const nextReco = shuffled.find(r => !selected.includes(r));
            if (nextReco) selected.push(nextReco);
          }

          const transformed = selected.slice(0, 2).map(reco => ({
            id: reco._id,
            type: typeLabels[reco.type] || reco.type,
            typeKey: reco.type,
            title: reco.titre,
            imageUrl: reco.imageUrl || '',
            slug: reco.slug,
            description: reco.accroche || '',
            items: reco.items?.map(item => item.titre) || [],
          }));

          setRecommendations(transformed);
        }
      } catch (error) {
        console.error('Erreur fetch recommandations hero:', error);
      }
    };

    fetchRecos();
  }, []);

  // Fetch des articles depuis Sanity pour "À découvrir aussi"
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await sanityFetch(ARTICLES_DISCOVER_QUERY) as SanityArticle[];
        if (data && data.length > 0) {
          setArticles(data);
        }
      } catch (error) {
        console.error('Erreur fetch articles discover:', error);
      }
    };

    fetchArticles();
  }, []);


  const allItems = portraits.slice(0, 7);

  // Sélectionner 3 articles pour "À découvrir aussi" :
  // - Articles Sanity (productions) EXCLUSIVEMENT
  // - Exclure ceux qui sont déjà dans le slideshow hero
  // - Shuffle pour la variété
  // - Jamais 2 verticales identiques
  const discoverItems = React.useMemo(() => {
    if (articles.length === 0) return [];

    // Récupérer les titres des articles dans le slideshow pour les exclure
    const slideshowTitles = new Set(allItems.map(p => p.titre.toLowerCase().trim()));

    // Filtrer les articles qui ne sont pas dans le slideshow
    const availableArticles = articles.filter(
      article => !slideshowTitles.has(article.titre.toLowerCase().trim())
    );

    if (availableArticles.length === 0) return [];

    // Shuffle (Fisher-Yates)
    const shuffled = [...availableArticles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Sélectionner 3 articles avec verticales différentes
    const selected: SanityArticle[] = [];
    const usedVerticales = new Set<string>();

    for (const article of shuffled) {
      if (selected.length >= 3) break;
      const verticaleName = article.verticale?.nom || 'default';
      if (!usedVerticales.has(verticaleName)) {
        selected.push(article);
        usedVerticales.add(verticaleName);
      }
    }

    // Si on n'a pas 3 articles avec verticales différentes, compléter
    if (selected.length < 3) {
      for (const article of shuffled) {
        if (selected.length >= 3) break;
        if (!selected.includes(article)) {
          selected.push(article);
        }
      }
    }

    return selected;
  }, [articles, allItems]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (allItems.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % allItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allItems.length]);

  // Swipe handlers pour mobile - améliorés pour ne pas bloquer les clics
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    // Vérifier si le touch commence sur un élément cliquable
    const target = e.target as HTMLElement;
    const isClickable = target.closest('a, button');

    if (isClickable) {
      // Ne pas interférer avec les clics sur les liens/boutons
      setIsSwiping(false);
      return;
    }

    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!isSwiping || !touchStartX || !touchEndX) {
      setIsSwiping(false);
      return;
    }

    const distanceX = touchStartX - touchEndX;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (isLeftSwipe && allItems.length > 1) {
      setActiveIndex((prev) => (prev + 1) % allItems.length);
    }
    if (isRightSwipe && allItems.length > 1) {
      setActiveIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    }

    setIsSwiping(false);
  };


  // Couleurs utilisées par les articles
  const usedColors = React.useMemo(() => {
    const colors = new Set<string>();
    allItems.forEach(item => {
      const itemColors = getUniversColors(item.categorie);
      colors.add(itemColors.bg.toLowerCase());
    });
    return colors;
  }, [allItems]);

  // Couleurs pour les recommandations
  const recommendationColors = React.useMemo(() => {
    const availableColors = recommendationColorPalette.filter(
      color => !usedColors.has(color.toLowerCase())
    );
    const colorsToUse = availableColors.length >= 2 ? availableColors : recommendationColorPalette;
    return [colorsToUse[0], colorsToUse[1] || colorsToUse[0]];
  }, [usedColors]);

  if (allItems.length === 0) return null;

  const safeIndex = Math.min(activeIndex, allItems.length - 1);
  const currentItem = allItems[safeIndex];
  if (!currentItem) return null;

  const currentColors = getUniversColors(currentItem.categorie);

  return (
    <section className="relative overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* HERO PRINCIPAL - FULL WIDTH CINÉMATIQUE                                 */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative">
        {/* Image de fond full-width - avec swipe sur mobile */}
        <div
          className="relative h-[70vh] sm:h-[75vh] lg:h-[80vh] min-h-[550px] max-h-[900px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <img
                src={currentItem.imageUrl}
                alt={currentItem.titre}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                // @ts-expect-error fetchPriority is valid but not in React types yet
                fetchpriority="high"
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay gradient sophistiqué */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

          {/* Effets visuels premium */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />

          {/* Contenu principal */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 sm:pb-12 lg:pb-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">

                {/* Colonne gauche: Contenu featured */}
                <div className="lg:col-span-7">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={safeIndex}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {/* Badge catégorie avec glow */}
                      <motion.span
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 sm:mb-5"
                        style={{
                          backgroundColor: currentColors.bg,
                          color: currentColors.text,
                          boxShadow: `0 0 30px ${currentColors.bg}60, 0 4px 20px ${currentColors.bg}40`,
                        }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: currentColors.text }}
                        />
                        {currentItem.categorie}
                      </motion.span>

                      {/* Titre principal - Grand et impactant */}
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-4 sm:mb-5 max-w-2xl">
                        {typo(currentItem.titre)}
                      </h1>

                      {/* Accroche - Si disponible */}
                      {currentItem.accroche && (
                        <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-5 sm:mb-6 max-w-xl line-clamp-2">
                          {typo(currentItem.accroche)}
                        </p>
                      )}

                      {/* CTA Premium */}
                      <Link
                        to={currentItem.url}
                        className="group inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: currentColors.bg,
                          color: currentColors.text,
                          boxShadow: `0 4px 20px ${currentColors.bg}50`,
                        }}
                      >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                        <span>Lire l'histoire</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Colonne droite: Navigation dots + Info */}
                <div className="hidden lg:flex lg:col-span-5 flex-col items-end gap-4">
                  {/* Indicateur de progression */}
                  <div className="flex items-center gap-3">
                    <span className="text-white/60 text-sm font-medium">
                      {String(safeIndex + 1).padStart(2, '0')}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {allItems.map((item, index) => {
                        const dotColors = getUniversColors(item.categorie);
                        const isActive = index === safeIndex;

                        return (
                          <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className="relative h-1 rounded-full transition-all duration-500 overflow-hidden"
                            style={{
                              width: isActive ? '48px' : '16px',
                              backgroundColor: isActive ? 'transparent' : 'rgba(255,255,255,0.3)',
                            }}
                          >
                            {isActive && (
                              <>
                                <div
                                  className="absolute inset-0 rounded-full opacity-30"
                                  style={{ backgroundColor: dotColors.bg }}
                                />
                                <motion.div
                                  className="absolute inset-0 rounded-full"
                                  style={{ backgroundColor: dotColors.bg }}
                                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                                  animate={{ scaleX: 1 }}
                                  transition={{ duration: 5, ease: 'linear' }}
                                />
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-white/40 text-sm font-medium">
                      {String(allItems.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots - Mobile */}
        <div className="lg:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
          {allItems.map((item, index) => {
            const dotColors = getUniversColors(item.categorie);
            const isActive = index === safeIndex;

            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className="relative h-1.5 rounded-full transition-all duration-300 overflow-hidden"
                style={{
                  width: isActive ? '24px' : '8px',
                  backgroundColor: isActive ? dotColors.bg : 'rgba(255,255,255,0.4)',
                }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: dotColors.bg, filter: 'brightness(0.7)' }}
                    initial={{ scaleX: 0, transformOrigin: 'left' }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION À DÉCOUVRIR - 3 ARTICLES PREMIUM                               */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {discoverItems.length > 0 && (
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
            {/* Header - Format standard homepage */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-1 w-8 bg-violet-500 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Lire</span>
                </div>
                <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  À découvrir aussi
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {typo("D'autres récits sélectionnés pour vous, à explorer selon vos envies du moment.")}
                </p>
              </div>

              <Link
                to="/articles"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
              >
                <span>Tous les articles</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Grid 3 colonnes - Cartes premium avec image + contenu séparé */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {discoverItems.map((article, index) => {
                const verticaleName = article.verticale?.nom || 'Actualité';
                const itemColors = getUniversColors(verticaleName);

                return (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Link
                      to={`/article/${article.slug}`}
                      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                      style={{
                        boxShadow: '0 4px 25px -5px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)',
                      }}
                    >
                      {/* Image container */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={article.imageUrl || '/placeholder.svg'}
                          alt={article.titre}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Badge catégorie */}
                        <div className="absolute top-4 left-4">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-lg"
                            style={{
                              backgroundColor: itemColors.bg,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                            {verticaleName}
                          </span>
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="flex-1 flex flex-col p-5 sm:p-6">
                        {/* Title - 4 lignes max */}
                        <h3 className="flex-1 text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-4 mb-3 group-hover:text-gray-700 transition-colors">
                          {typo(article.titre)}
                        </h3>

                        {/* CTA */}
                        <span
                          className="inline-flex items-center gap-2 text-sm font-bold transition-all duration-300 group-hover:gap-3 mt-auto"
                          style={{ color: itemColors.bg }}
                        >
                          Lire l'article
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION RECOMMANDATIONS - STYLE CLEAN AVEC IMAGES CATÉGORIE            */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {recommendations.length > 0 && (
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
            {/* Header - Format standard homepage */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-1 w-8 bg-orange-500 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Découvrir</span>
                </div>
                <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Aujourd'hui, on recommande
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  {typo("Livres, films, podcasts... Les coups de cœur sélectionnés par notre équipe.")}
                </p>
              </div>

              <Link
                to="/recommandations"
                className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
              >
                <span>Toutes les recos</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Grille de recommandations avec images de catégorie */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendations.map((reco, index) => {
                const accentColor = typeColors[reco.typeKey] || recommendationColors[index];
                const categoryImage = categoryImages[reco.typeKey];

                return (
                  <motion.div
                    key={reco.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      to={`/recommandation/${reco.slug}`}
                      className="group block rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1"
                      style={{
                        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                      }}
                    >
                      {/* Image de catégorie en 16:9 */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={categoryImage}
                          alt={reco.type}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Badge type en haut à gauche */}
                        <div className="absolute top-3 left-3">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                            style={{
                              backgroundColor: accentColor,
                              boxShadow: `0 2px 10px ${accentColor}50`,
                            }}
                          >
                            {reco.type}
                          </span>
                        </div>

                        {/* Titre sur l'image */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug line-clamp-2 mb-1">
                            {typo(reco.title)}
                          </h3>
                          {reco.description && (
                            <p className="text-white/70 text-sm line-clamp-1">
                              {reco.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer avec items preview + CTA */}
                      <div className="p-4 flex items-center justify-between">
                        {/* Preview des items */}
                        {reco.items.length > 0 ? (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs text-gray-400">Inclut :</span>
                            <span className="text-xs font-medium text-gray-600 truncate">
                              {reco.items.slice(0, 2).join(', ')}
                              {reco.items.length > 2 && ` +${reco.items.length - 2}`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Notre sélection</span>
                        )}

                        {/* CTA */}
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 group-hover:scale-105"
                          style={{
                            backgroundColor: `${accentColor}15`,
                            color: accentColor,
                          }}
                        >
                          Voir
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
