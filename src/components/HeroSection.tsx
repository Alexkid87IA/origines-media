// src/components/HeroSection.tsx
// Hero Magazine Coloré - Bold, Pop, Premium

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Clock, ArrowUpRight } from 'lucide-react';
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

// Palette de couleurs disponibles pour les recommandations - Style magazine bold
const recommendationColorPalette = [
  '#FBBF24', // Amber/Yellow (style Konbini)
  '#F97316', // Orange
  '#EC4899', // Pink/Magenta
  '#10B981', // Emerald
  '#8B5CF6', // Violet
  '#EF4444', // Red
  '#6366F1', // Indigo profond
  '#14B8A6', // Teal
  '#0EA5E9', // Sky blue
];

const HeroSection: React.FC<HeroSectionProps> = ({ portraits = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSidebar, setExpandedSidebar] = useState<number | null>(null);
  const [expandedReco, setExpandedReco] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    type: string;
    title: string;
    imageUrl: string;
    slug: string;
    description: string;
    items: string[];
  }>>([]);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const recoRef = useRef<HTMLDivElement>(null);
  const [hasScrollHinted, setHasScrollHinted] = useState(false);

  // Fetch des recommandations depuis Sanity
  useEffect(() => {
    const fetchRecos = async () => {
      try {
        const data = await sanityFetch(HERO_RECOS_QUERY) as SanityReco[];
        if (data && data.length > 0) {
          // Shuffle déterministe basé sur la date (change toutes les 24h)
          const today = new Date();
          const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
          const seed = dayOfYear + today.getFullYear();

          // Fonction de shuffle avec seed (Fisher-Yates avec seed)
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

          // Si on n'a pas trouvé 2 types différents, prendre les 2 premiers
          if (selected.length < 2 && shuffled.length >= 2) {
            const nextReco = shuffled.find(r => !selected.includes(r));
            if (nextReco) selected.push(nextReco);
          }

          // Transformer en format d'affichage
          const transformed = selected.slice(0, 2).map(reco => ({
            id: reco._id,
            type: typeLabels[reco.type] || reco.type,
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

  // Fermer les dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Fermer sidebar dropdown si clic en dehors
      if (expandedSidebar !== null && sidebarRef.current && !sidebarRef.current.contains(target)) {
        setExpandedSidebar(null);
      }

      // Fermer reco dropdown si clic en dehors
      if (expandedReco !== null && recoRef.current && !recoRef.current.contains(target)) {
        setExpandedReco(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedSidebar, expandedReco]);

  const allItems = portraits.slice(0, 7); // 1 featured + 6 sidebar (6ème visible uniquement sur mobile)
  const sidebarItems = allItems.slice(1, 7); // 6 items for sidebar (dernier hidden on desktop)

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (allItems.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % allItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allItems.length]);

  // Animation "peek" pour montrer qu'on peut scroller (mobile uniquement)
  useEffect(() => {
    if (hasScrollHinted || !sidebarRef.current) return;

    // Protection SSR : vérifier que window existe
    if (typeof window === 'undefined') return;

    // Vérifier si on est sur mobile (viewport < 1024px)
    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;

    const container = sidebarRef.current;

    // Attendre que le contenu soit chargé
    const timer = setTimeout(() => {
      // Scroll vers la droite - bien visible
      container.scrollTo({ left: 200, behavior: 'smooth' });

      // Pause pour que l'utilisateur voie
      setTimeout(() => {
        // Revenir au début
        container.scrollTo({ left: 0, behavior: 'smooth' });
        setHasScrollHinted(true);
      }, 1200);
    }, 1500);

    return () => clearTimeout(timer);
  }, [hasScrollHinted, sidebarItems.length]);

  // Calculer les couleurs utilisées par les articles
  const usedColors = React.useMemo(() => {
    const colors = new Set<string>();
    allItems.forEach(item => {
      const itemColors = getUniversColors(item.categorie);
      colors.add(itemColors.bg.toLowerCase());
    });
    return colors;
  }, [allItems]);

  // Sélectionner 2 couleurs pour les recommandations qui ne sont pas utilisées
  const recommendationColors = React.useMemo(() => {
    const availableColors = recommendationColorPalette.filter(
      color => !usedColors.has(color.toLowerCase())
    );
    // Si pas assez de couleurs disponibles, utiliser la palette complète
    const colorsToUse = availableColors.length >= 2 ? availableColors : recommendationColorPalette;
    return [colorsToUse[0], colorsToUse[1] || colorsToUse[0]];
  }, [usedColors]);

  if (allItems.length === 0) return null;

  // Sécurité: s'assurer que activeIndex est valide
  const safeIndex = Math.min(activeIndex, allItems.length - 1);
  const currentItem = allItems[safeIndex];

  // Sécurité supplémentaire
  if (!currentItem) return null;

  const currentColors = getUniversColors(currentItem.categorie);

  return (
    <section className="bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-5 sm:pb-6">

        {/* Titre À la une */}
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            À la une
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>

        {/* Bento Grid Magazine */}
        <div className="grid grid-cols-12 gap-2.5 sm:gap-3 lg:gap-4">

          {/* Main Featured - Large card (8 cols) */}
          <motion.div
            className="col-span-12 lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to={currentItem.url} className="group block h-full">
              <div className="relative h-full min-h-[260px] sm:min-h-[280px] lg:min-h-[320px] rounded-xl overflow-hidden">
                {/* Image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={safeIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={currentItem.imageUrl}
                      alt={currentItem.titre}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Gradient neutre - couvre toute l'image subtilement */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-gray-900/10" />

                {/* Content - Positioned at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={safeIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Category pill with color */}
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 shadow-lg"
                        style={{
                          backgroundColor: currentColors.bg,
                          color: currentColors.text,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                        {currentItem.categorie}
                      </span>

                      <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-white leading-tight mb-3 max-w-2xl">
                        {typo(currentItem.titre)}
                      </h1>

                      <span className="inline-flex items-center gap-1.5 text-white font-semibold text-xs group-hover:gap-2 transition-all">
                        Lire l'histoire
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>
            </Link>
          </motion.div>

          {/* Navigation dots - Mobile uniquement, entre image et carousel */}
          <div className="col-span-12 lg:hidden flex items-center justify-center gap-1.5 py-3">
            {allItems.map((item, index) => {
              const dotColors = getUniversColors(item.categorie);
              const isActive = index === safeIndex;

              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className="relative h-1.5 rounded-full transition-all duration-300 overflow-hidden"
                  style={{
                    width: isActive ? '24px' : '6px',
                    backgroundColor: isActive ? dotColors.bg : '#e5e7eb',
                  }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: dotColors.bg, filter: 'brightness(0.8)' }}
                      initial={{ scaleX: 0, transformOrigin: 'left' }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5, ease: 'linear' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Side cards - Carousel horizontal sur mobile, vertical sur desktop */}
          <div className="col-span-12 lg:col-span-4 relative">
            {/* Gradient fondu à droite (mobile uniquement) */}
            <div className="absolute right-0 top-0 bottom-2 w-20 bg-gradient-to-l from-gray-50 via-gray-50/70 to-transparent z-10 pointer-events-none lg:hidden" />

            <div
              ref={sidebarRef}
              className="flex lg:grid lg:grid-cols-1
                         gap-2.5 lg:gap-2
                         overflow-x-auto lg:overflow-visible
                         pb-2 lg:pb-0
                         -mx-4 px-4 lg:mx-0 lg:px-0
                         snap-x snap-mandatory lg:snap-none
                         scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
            {sidebarItems.map((item, index) => {
              const itemColors = getUniversColors(item.categorie);
              const isActive = activeIndex === index + 1;
              const isExpanded = expandedSidebar === index;

              // Le 6ème article (index 5) est visible uniquement sur mobile
              const isLastItem = index === 5;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`relative group flex-shrink-0 lg:flex-shrink
                             w-[260px] sm:w-[280px] lg:w-auto
                             snap-start
                             ${isLastItem ? 'lg:hidden' : ''}`}
                >
                  <div
                    className="relative rounded-xl overflow-hidden transition-all duration-300 bg-white w-full"
                    style={{
                      boxShadow: isExpanded
                        ? `0 8px 24px -6px ${itemColors.bg}20`
                        : '0 2px 8px -2px rgba(0,0,0,0.04)',
                      border: `1px solid ${isActive || isExpanded ? itemColors.bg + '30' : 'rgba(0,0,0,0.05)'}`,
                    }}
                  >
                    {/* Header cliquable */}
                    <button
                      onClick={() => {
                        setActiveIndex(index + 1);
                        setExpandedSidebar(isExpanded ? null : index);
                      }}
                      className="w-full text-left"
                    >
                      <div className="relative p-2.5 lg:p-2.5 flex items-center gap-2.5">
                        {/* Image thumbnail avec bordure colorée au hover */}
                        <motion.div
                          className="relative flex-shrink-0"
                          animate={{
                            scale: isExpanded ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className="w-12 h-12 lg:w-10 lg:h-10 rounded-lg overflow-hidden transition-all duration-300"
                            style={{
                              boxShadow: isActive || isExpanded
                                ? `0 4px 12px -2px ${itemColors.bg}40`
                                : '0 2px 8px -2px rgba(0,0,0,0.1)',
                              border: isActive || isExpanded
                                ? `2px solid ${itemColors.bg}`
                                : '2px solid transparent',
                            }}
                          >
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 py-0.5">
                          {/* Badge pill coloré plein - petit */}
                          <span
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wide mb-1.5 whitespace-nowrap"
                            style={{
                              backgroundColor: itemColors.bg,
                              color: 'white',
                            }}
                          >
                            {item.categorie}
                          </span>
                          <h3 className="text-[11px] lg:text-[11px] font-medium text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
                            {typo(item.titre)}
                          </h3>
                        </div>

                        {/* Arrow */}
                        <motion.div
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 bg-white/80 backdrop-blur-sm"
                          style={{
                            boxShadow: isActive || isExpanded
                              ? `0 2px 6px ${itemColors.bg}20`
                              : '0 1px 3px rgba(0,0,0,0.08)',
                          }}
                          animate={{
                            rotate: isExpanded ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown
                            className="w-3 h-3 transition-colors duration-300"
                            style={{
                              color: isActive || isExpanded ? itemColors.bg : '#9ca3af',
                            }}
                            strokeWidth={2.5}
                          />
                        </motion.div>

                      </div>
                    </button>

                    {/* Dropdown Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden border-t border-gray-100"
                        >
                          <motion.div
                            className="p-3 lg:p-4 bg-gray-50/50"
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.25, delay: 0.05 }}
                          >
                            {/* Extrait / Description */}
                            <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                              {item.accroche || 'Découvrez cet article...'}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                              <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                                <Clock className="w-3 h-3" />
                                <span>5 min</span>
                              </div>

                              <Link
                                to={item.url}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                style={{
                                  backgroundColor: itemColors.bg,
                                  boxShadow: `0 2px 8px ${itemColors.bg}40`
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                Lire
                                <ArrowUpRight className="w-2.5 h-2.5" />
                              </Link>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Navigation dots - Desktop uniquement */}
        <div className="hidden lg:flex mt-3 sm:mt-4 items-center gap-1.5">
          {allItems.map((item, index) => {
            const dotColors = getUniversColors(item.categorie);
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className="relative h-1.5 rounded-full transition-all duration-300 overflow-hidden"
                style={{
                  width: isActive ? '24px' : '6px',
                  backgroundColor: isActive ? dotColors.bg : '#e5e7eb',
                }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: dotColors.bg, filter: 'brightness(0.8)' }}
                    initial={{ scaleX: 0, transformOrigin: 'left' }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Section Recommandations */}
        {recommendations.length > 0 && (
        <div className="mt-5 sm:mt-6">
          {/* Titre section */}
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Aujourd'hui, on recommande
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
            <Link
              to="/recommandations"
              className="text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
            >
              Voir tout
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Cartes recommandations - Style magazine premium */}
          <div ref={recoRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          {recommendations.map((reco, index) => {
            const accentColor = recommendationColors[index];
            const isExpanded = expandedReco === reco.id;

            return (
              <motion.div
                key={reco.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
                  style={{
                    background: isExpanded
                      ? `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 100%)`
                      : 'white',
                    boxShadow: isExpanded
                      ? `0 20px 40px -12px ${accentColor}30, 0 0 0 2px ${accentColor}`
                      : '0 2px 8px -2px rgba(0,0,0,0.06)',
                    border: isExpanded
                      ? `1px solid ${accentColor}40`
                      : '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Header cliquable */}
                  <button
                    onClick={() => {
                      // Accordion: ferme l'autre si on en ouvre une nouvelle
                      if (isExpanded) {
                        setExpandedReco(null);
                      } else {
                        setExpandedReco(reco.id);
                      }
                    }}
                    className="w-full text-left flex-shrink-0"
                  >
                    <div className="relative p-4 sm:p-5 flex items-center gap-4 min-h-[80px] sm:min-h-[90px]">
                      {/* Icône/Image stylisée */}
                      <motion.div
                        className="flex-shrink-0"
                        animate={{ scale: isExpanded ? 1.05 : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {reco.imageUrl ? (
                          <div
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden transition-all duration-300"
                            style={{
                              boxShadow: isExpanded
                                ? `0 8px 20px -4px ${accentColor}40`
                                : '0 4px 12px -2px rgba(0,0,0,0.1)',
                            }}
                          >
                            <img
                              src={reco.imageUrl}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${accentColor}20 0%, ${accentColor}40 100%)`,
                              boxShadow: isExpanded
                                ? `0 8px 20px -4px ${accentColor}40`
                                : '0 4px 12px -2px rgba(0,0,0,0.08)',
                            }}
                          >
                            <svg
                              className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110"
                              style={{ color: accentColor }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                        )}
                      </motion.div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        {/* Badge catégorie */}
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                          style={{
                            backgroundColor: accentColor,
                            color: 'white',
                          }}
                        >
                          {reco.type}
                        </span>

                        {/* Titre bold */}
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors min-h-[2.5em]">
                          {typo(reco.title)}
                        </h3>
                      </div>

                      {/* Chevron */}
                      <motion.div
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: isExpanded ? `${accentColor}15` : 'rgba(0,0,0,0.04)',
                          boxShadow: isExpanded ? `0 2px 8px ${accentColor}20` : 'none',
                        }}
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown
                          className="w-4 h-4 transition-colors duration-300"
                          style={{ color: isExpanded ? accentColor : '#9ca3af' }}
                          strokeWidth={2.5}
                        />
                      </motion.div>
                    </div>
                  </button>

                  {/* Dropdown Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className="p-4 sm:p-5 pt-0"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.25, delay: 0.05 }}
                        >
                          {/* Séparateur */}
                          <div
                            className="h-px mb-4"
                            style={{ backgroundColor: `${accentColor}30` }}
                          />

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                            {reco.description}
                          </p>

                          {/* Mini liste d'items */}
                          {reco.items.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {reco.items.map((item, i) => (
                                <motion.span
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/70 backdrop-blur-sm"
                                  style={{
                                    color: accentColor,
                                    boxShadow: `0 2px 6px ${accentColor}15`,
                                  }}
                                >
                                  {item}
                                </motion.span>
                              ))}
                            </div>
                          )}

                          {/* Bouton Découvrir */}
                          <Link
                            to={`/recommandation/${reco.slug}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            style={{
                              backgroundColor: accentColor,
                              boxShadow: `0 4px 14px ${accentColor}50`
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Découvrir la sélection
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
