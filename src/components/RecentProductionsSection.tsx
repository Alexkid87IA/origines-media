// src/components/RecentProductionsSection.tsx
// Carrousel horizontal avec cartes 4/5

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUniversColors } from '../lib/universColors';
import { typo } from '../lib/typography';

interface Production {
  id: string;
  titre: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  imageUrl?: string;
  url: string;
  datePublication?: string;
  verticale?: {
    nom: string;
    couleurDominante?: string;
  };
}

// Helper: récupère l'extrait avec fallback (50 premiers caractères)
const getExtrait = (production: Production): string => {
  if (production.extrait) return production.extrait;
  if (production.description) return production.description;
  if (production.contenuTexte) {
    const text = production.contenuTexte.substring(0, 80);
    return text.length === 80 ? text + '...' : text;
  }
  return '';
};

interface Verticale {
  verticale: {
    id: string;
    nom: string;
    couleurDominante: string;
  };
  productions: Production[];
}

interface RecentProductionsSectionProps {
  verticales: Verticale[];
}

// Fonction de shuffle (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const RecentProductionsSection: React.FC<RecentProductionsSectionProps> = ({ verticales = [] }) => {
  const [activeTab, setActiveTab] = useState('tous');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Protection: si pas de verticales, ne pas afficher la section
  if (!verticales || verticales.length === 0) {
    return null;
  }

  // Récupère toutes les productions avec leur verticale
  const allProductions = React.useMemo(() => {
    return verticales.flatMap(v =>
      (v.productions || []).map(p => ({
        ...p,
        verticale: {
          nom: v.verticale?.nom || 'Inconnu',
          couleurDominante: v.verticale?.couleurDominante || '#6366F1'
        }
      }))
    );
  }, [verticales]);

  // Filtre selon l'onglet actif, puis mélange pour la variété
  const filteredProductions = React.useMemo(() => {
    const filtered = activeTab === 'tous'
      ? allProductions
      : allProductions.filter(p => p.verticale?.nom === activeTab);
    return shuffleArray(filtered);
  }, [activeTab, allProductions]);

  const verticaleNames = [...new Set(verticales.map(v => v.verticale?.nom).filter(Boolean))];

  // Vérifier si on peut scroller
  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Effet pour vérifier le scroll au chargement et lors des changements de filtre
  useEffect(() => {
    checkScrollability();
    // Reset scroll position when filter changes
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [activeTab, filteredProductions]);

  // Scroll functions
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.querySelector('article')?.offsetWidth || 300;
      const scrollAmount = cardWidth + 16; // card width + gap
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-gray-50 py-10 sm:py-12 lg:py-16">
      {/* Style pour cacher la scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header avec introduction étoffée */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-4">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Lire</span>
              </div>
              <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Nos articles
              </h2>
              <p className="text-gray-600 text-base leading-relaxed">
                {typo("Chaque univers est un monde à explorer : psychologie, carrière, famille, spiritualité... Trouvez les récits qui résonnent avec vos questionnements du moment et laissez-vous guider par vos centres d'intérêt.")}
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

          {/* Tabs - Style unifié avec HistoiresSection et RecommandationsSection */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('tous')}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
            >
              {activeTab === 'tous' && (
                <motion.div
                  layoutId="articlesTabIndicator"
                  className="absolute inset-0 bg-gray-900 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span
                className="relative z-10 transition-colors duration-300"
                style={{ color: activeTab === 'tous' ? 'white' : '#6B7280' }}
              >
                Tous
              </span>
              <span
                className="relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-all duration-300"
                style={{
                  backgroundColor: activeTab === 'tous' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)',
                  color: activeTab === 'tous' ? 'white' : '#6B7280',
                }}
              >
                {allProductions.length}
              </span>
            </button>
            {verticaleNames.map(name => {
              const colors = getUniversColors(name);
              const isActive = activeTab === name;
              const count = allProductions.filter(p => p.verticale?.nom === name).length;

              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="articlesTabIndicator"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: colors.bg }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span
                    className="relative z-10 transition-colors duration-300"
                    style={{ color: isActive ? colors.text : '#6B7280' }}
                  >
                    {name}
                  </span>
                  <span
                    className="relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-medium transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${colors.bg}15`,
                      color: isActive ? 'white' : colors.bg,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CARROUSEL PREMIUM - Aligné à gauche, déborde à droite                  */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}

        {/* Carrousel - reste dans le flow mais déborde à droite */}
        <div className="relative mt-6 -mr-4 sm:-mr-6 lg:-mr-8">
          {/* Masque de dégradé uniquement à droite */}
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-24 lg:w-40 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          {/* Bouton navigation droite uniquement */}
          <button
            onClick={() => scroll('right')}
            className={`hidden sm:flex absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-xl border border-white/50 transition-all duration-300 hover:scale-110 hover:bg-white ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Bouton navigation gauche - apparaît quand on a scrollé */}
          <button
            onClick={() => scroll('left')}
            className={`hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-xl border border-white/50 transition-all duration-300 hover:scale-110 hover:bg-white ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          {/* Container du carrousel - aligné à gauche, déborde à droite */}
          <div
            ref={carouselRef}
            onScroll={checkScrollability}
            className="flex gap-4 lg:gap-5 overflow-x-auto scrollbar-hide scroll-smooth py-2 pr-4 sm:pr-6 lg:pr-8"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
          <AnimatePresence mode="popLayout">
            {filteredProductions.slice(0, 15).map((production, index) => {
              const colors = getUniversColors(production.verticale?.nom);

              return (
                <motion.article
                  key={production.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: Math.min(index, 4) * 0.05 }}
                  className="group flex-shrink-0 w-[70vw] sm:w-[280px] lg:w-[260px]"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <Link to={production.url} className="block">
                    <div
                      className="relative rounded-2xl overflow-hidden aspect-[4/5] transition-all duration-500 group-hover:scale-[1.02]"
                      style={{
                        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
                      }}
                    >
                      <img
                        src={production.imageUrl || '/placeholder.svg'}
                        alt={production.titre}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Overlay gradient sophistiqué */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                      {/* Badge catégorie avec glow subtil */}
                      {production.verticale?.nom && (
                        <div className="absolute top-4 left-4">
                          <span
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide text-white"
                            style={{
                              backgroundColor: colors.bg,
                              boxShadow: `0 4px 12px ${colors.bg}50`
                            }}
                          >
                            {production.verticale.nom}
                          </span>
                        </div>
                      )}

                      {/* Contenu en bas avec effet de lift au hover */}
                      <div className="absolute inset-x-0 bottom-0 p-5 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                        <h3 className="font-bold text-white text-base leading-snug line-clamp-3 mb-3 drop-shadow-sm">
                          {typo(production.titre)}
                        </h3>
                        <span
                          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
                          style={{ color: colors.bg }}
                        >
                          Lire l'article
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
        </div>

        {/* Footer avec CTA */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-400 hidden sm:block">
            {filteredProductions.length} articles affichés sur {allProductions.length}
          </span>

          <Link
            to="/articles"
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all hover:scale-105 mx-auto sm:mx-0"
          >
            Voir tous les articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentProductionsSection;
