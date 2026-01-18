// src/components/HeroSection.tsx
// Hero Magazine Coloré - Bold, Pop, Premium

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, BookOpen, Film, ChevronDown, Clock, ArrowUpRight } from 'lucide-react';
import { getUniversColors } from '../lib/universColors';
import { typo } from '../lib/typography';

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

// Recommandations statiques (à remplacer par Sanity plus tard)
const recommendations = [
  {
    id: 'r1',
    type: 'Lecture du mois',
    title: "La BD de l'année et nos coups de cœur littéraires",
    imageUrl: '/placeholder.svg',
    slug: 'lectures-janvier-2026',
    description: "Notre sélection des meilleures bandes dessinées et romans graphiques qui ont marqué cette année. Des récits puissants, des illustrations époustouflantes.",
    readTime: 8,
    items: ['Maus - Art Spiegelman', 'Persepolis - Marjane Satrapi', 'Le Chat du Rabbin'],
  },
  {
    id: 'r2',
    type: 'Sélection cinéma',
    title: "Les 10 films qui ont marqué 2025",
    imageUrl: '/placeholder.svg',
    slug: 'films-2025',
    description: "Du drame intimiste au blockbuster, retour sur les œuvres cinématographiques qui ont fait vibrer les salles obscures cette année.",
    readTime: 12,
    items: ['Dune: Part Three', 'The Brutalist', 'Anora'],
  },
];

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
  const [expandedReco, setExpandedReco] = useState<string | null>(null);
  const [expandedSidebar, setExpandedSidebar] = useState<number | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const recoRef = useRef<HTMLDivElement>(null);

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

  const currentItem = allItems[activeIndex];
  const currentColors = getUniversColors(currentItem?.categorie);

  return (
    <section className="bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6">

        {/* Bento Grid Magazine */}
        <div className="grid grid-cols-12 gap-3 lg:gap-4">

          {/* Main Featured - Large card (8 cols) */}
          <motion.div
            className="col-span-12 lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to={currentItem.url} className="group block h-full">
              <div className="relative h-full min-h-[240px] lg:min-h-[300px] rounded-xl overflow-hidden">
                {/* Image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
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
                <div className="absolute inset-x-0 bottom-0 p-4 lg:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
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

                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight mb-3 max-w-2xl">
                        {typo(currentItem.titre)}
                      </h1>

                      <span className="inline-flex items-center gap-1.5 text-white font-semibold text-xs group-hover:gap-2 transition-all">
                        Lire l'histoire
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Play button overlay - style neutre */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md bg-white/90">
                    <Play className="w-4 h-4 ml-0.5 text-gray-900" fill="currentColor" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Side cards - 5 Sober cards (4 cols) avec Accordion */}
          <div ref={sidebarRef} className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-2">
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
                  className={`relative group ${isLastItem ? 'lg:hidden' : ''}`}
                >
                  <div
                    className={`relative rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
                      isActive ? 'ring-2' : 'ring-1 hover:ring-2'
                    }`}
                    style={{
                      ringColor: isActive || isExpanded ? itemColors.bg : undefined,
                      boxShadow: isExpanded
                        ? `0 20px 40px -12px rgba(0,0,0,0.15), 0 0 0 2px ${itemColors.bg}`
                        : isActive
                        ? `0 8px 25px -8px rgba(0,0,0,0.12), 0 0 0 2px ${itemColors.bg}`
                        : '0 2px 12px -4px rgba(0,0,0,0.08)',
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
                      <div className="relative p-2 lg:p-2.5 flex items-center gap-2">
                        {/* Image thumbnail avec bordure colorée au hover */}
                        <motion.div
                          className="relative flex-shrink-0"
                          animate={{
                            scale: isExpanded ? 1.05 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className="w-9 h-9 lg:w-10 lg:h-10 rounded-md overflow-hidden transition-all duration-300"
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
                          {/* Badge coloré discret */}
                          <span
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1.5"
                            style={{ color: itemColors.bg }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: itemColors.bg }}
                            />
                            {item.categorie}
                          </span>
                          <h3 className="text-[11px] lg:text-xs font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
                            {typo(item.titre)}
                          </h3>
                        </div>

                        {/* Arrow */}
                        <motion.div
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300"
                          style={{
                            backgroundColor: isActive || isExpanded ? `${itemColors.bg}15` : '#f3f4f6',
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
                            strokeWidth={2}
                          />
                        </motion.div>

                        {/* Bordure gauche colorée au hover/active */}
                        <div
                          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: itemColors.bg,
                            opacity: isActive || isExpanded ? 1 : 0,
                            transform: isActive || isExpanded ? 'scaleY(1)' : 'scaleY(0)',
                          }}
                        />
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

        {/* Bottom row - 2 Recommendations - Style sobre */}
        <div ref={recoRef} className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3 mt-4">
          {recommendations.map((reco, index) => {
            const accentColor = recommendationColors[index];
            const isExpanded = expandedReco === reco.id;

            return (
              <motion.div
                key={reco.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative group"
              >
                <div
                  className={`rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
                    isExpanded ? 'ring-2' : 'ring-1 hover:ring-2'
                  }`}
                  style={{
                    ringColor: isExpanded ? accentColor : undefined,
                    boxShadow: isExpanded
                      ? `0 20px 40px -12px rgba(0,0,0,0.15), 0 0 0 2px ${accentColor}`
                      : '0 2px 12px -4px rgba(0,0,0,0.08)',
                  }}
                >
                  {/* Header cliquable */}
                  <button
                    onClick={() => setExpandedReco(isExpanded ? null : reco.id)}
                    className="w-full text-left"
                  >
                    <div className="relative p-2.5 lg:p-3 flex items-center gap-2.5">
                      {/* Image thumbnail */}
                      <motion.div
                        className="relative flex-shrink-0"
                        animate={{ scale: isExpanded ? 1.05 : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="w-10 h-10 lg:w-11 lg:h-11 rounded-md overflow-hidden transition-all duration-300"
                          style={{
                            boxShadow: isExpanded
                              ? `0 4px 12px -2px ${accentColor}40`
                              : '0 2px 8px -2px rgba(0,0,0,0.1)',
                            border: isExpanded
                              ? `2px solid ${accentColor}`
                              : '2px solid transparent',
                          }}
                        >
                          <img
                            src={reco.imageUrl}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Badge coloré discret */}
                        <span
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1.5"
                          style={{ color: accentColor }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: accentColor }}
                          />
                          {reco.type}
                        </span>
                        <h3 className="text-[11px] lg:text-xs font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
                          {typo(reco.title)}
                        </h3>
                      </div>

                      {/* Arrow */}
                      <motion.div
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300"
                        style={{
                          backgroundColor: isExpanded ? `${accentColor}15` : '#f3f4f6',
                        }}
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown
                          className="w-3 h-3 transition-colors duration-300"
                          style={{ color: isExpanded ? accentColor : '#9ca3af' }}
                          strokeWidth={2}
                        />
                      </motion.div>

                      {/* Bordure gauche colorée */}
                      <div
                        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: accentColor,
                          opacity: isExpanded ? 1 : 0,
                          transform: isExpanded ? 'scaleY(1)' : 'scaleY(0)',
                        }}
                      />
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
                          {/* Description */}
                          <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                            {reco.description}
                          </p>

                          {/* Mini liste d'items */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {reco.items.map((item, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border"
                                style={{
                                  borderColor: `${accentColor}40`,
                                  color: accentColor,
                                  backgroundColor: `${accentColor}08`,
                                }}
                              >
                                {item}
                              </motion.span>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{reco.readTime} min</span>
                            </div>

                            <Link
                              to={`/recommandation/${reco.slug}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                              style={{
                                backgroundColor: accentColor,
                                boxShadow: `0 2px 8px ${accentColor}40`
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Découvrir
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

        {/* Navigation dots + CTA */}
        <div className="mt-4 flex items-center justify-between">
          {/* Progress dots with colors */}
          <div className="flex items-center gap-1.5">
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

          <Link
            to="/bibliotheque"
            className="group inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors"
          >
            Voir tout
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
