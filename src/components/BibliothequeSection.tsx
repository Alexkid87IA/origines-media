import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Production {
  id: string;
  titre: string;
  imageUrl: string;
  url: string;
}

interface Verticale {
  id: string;
  nom: string;
  couleurDominante: string;
}

interface VerticaleData {
  verticale: Verticale;
  productions: Production[];
}

interface BibliothequeSectionProps {
  verticales: VerticaleData[];
}

const BibliothequeSection: React.FC<BibliothequeSectionProps> = ({ verticales }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Preload images for current tab
  useEffect(() => {
    if (verticales[activeTab]) {
      verticales[activeTab].productions.forEach((production) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, production.id]));
        };
        img.src = production.imageUrl;
      });
    }
  }, [activeTab, verticales]);

  const handleTabChange = (index: number) => {
    if (index === activeTab || isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveTab(index);
    setHoveredCard(null);
    
    // Reset transition after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  };

  const handleNavigateToBibliotheque = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/bibliotheque');
  };

  const currentVerticale = verticales[activeTab];
  const currentColor = currentVerticale?.verticale.couleurDominante || '#8B5CF6';

  // Convert hex to RGB for CSS custom properties
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 139, g: 92, b: 246 }; // fallback to violet
  };

  const currentRgb = hexToRgb(currentColor);

  if (!currentVerticale) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-12 xl:px-16 relative overflow-hidden transition-all duration-500"
      aria-labelledby="bibliotheque-section-title"
      style={{
        // Dynamic theme color as CSS custom properties
        '--theme-color': currentColor,
        '--theme-rgb': `${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}`,
      } as React.CSSProperties}
    >
      {/* Background Pattern with Dynamic Color */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 transition-all duration-500" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(currentColor)}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Section Header */}
      <div className={`text-center mb-16 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          <span className="font-inter text-violet-400 text-sm tracking-[0.2em] uppercase">
            Acte 2
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
        </div>
        
        <h2 id="bibliotheque-section-title" className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
          Les
          <br />
          <span className="gradient-text-animated">Essentiels</span>
        </h2>
        
        <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Notre sélection éditoriale pour aller plus loin
        </p>
      </div>

      {/* Tabs Navigation with Dynamic Colors */}
      <div className={`max-w-7xl mx-auto mb-12 transform transition-all duration-1000 delay-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        {/* Desktop Tabs */}
        <div className="hidden lg:flex justify-center gap-3 flex-wrap" role="tablist" aria-label="Sélection de verticale">
          {verticales.map((verticaleData, index) => {
            const isActive = index === activeTab;
            const tabColor = verticaleData.verticale.couleurDominante;

            return (
              <button
                key={verticaleData.verticale.id}
                onClick={() => handleTabChange(index)}
                className={`
                  relative px-6 py-3 rounded-full font-inter font-medium tracking-wider uppercase text-sm
                  transition-colors duration-300 border backdrop-blur-sm
                  ${isActive
                    ? 'text-white border-transparent'
                    : 'text-white/70 bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30 hover:text-white'
                  }
                  ${isTransitioning ? 'pointer-events-none' : 'cursor-pointer'}
                `}
                disabled={isTransitioning}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${verticaleData.verticale.id}`}
                id={`tab-${verticaleData.verticale.id}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bibliothequeTabIndicatorDesktop"
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: tabColor,
                      boxShadow: `0 8px 25px ${tabColor}40`
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{verticaleData.verticale.nom}</span>
              </button>
            );
          })}
        </div>

        {/* Tablet Tabs */}
        <div className="hidden md:flex lg:hidden justify-center gap-2 flex-wrap" role="tablist" aria-label="Sélection de verticale">
          {verticales.map((verticaleData, index) => {
            const isActive = index === activeTab;
            const tabColor = verticaleData.verticale.couleurDominante;

            return (
              <button
                key={verticaleData.verticale.id}
                onClick={() => handleTabChange(index)}
                className={`
                  relative px-4 py-2 rounded-full font-inter font-medium tracking-wider uppercase text-xs
                  transition-colors duration-300 border backdrop-blur-sm
                  ${isActive
                    ? 'text-white border-transparent'
                    : 'text-white/70 bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30 hover:text-white'
                  }
                  ${isTransitioning ? 'pointer-events-none' : 'cursor-pointer'}
                `}
                disabled={isTransitioning}
                role="tab"
                aria-selected={isActive}
              >
                {isActive && (
                  <motion.div
                    layoutId="bibliothequeTabIndicatorTablet"
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: tabColor,
                      boxShadow: `0 8px 25px ${tabColor}40`
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{verticaleData.verticale.nom}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Tabs - Scrollable */}
        <div className="md:hidden overflow-x-auto scrollbar-hide" role="tablist" aria-label="Sélection de verticale">
          <div className="flex gap-3 px-4 pb-2" style={{ width: 'max-content' }}>
            {verticales.map((verticaleData, index) => {
              const isActive = index === activeTab;
              const tabColor = verticaleData.verticale.couleurDominante;

              return (
                <button
                  key={verticaleData.verticale.id}
                  onClick={() => handleTabChange(index)}
                  className={`
                    relative px-5 py-2.5 rounded-full font-inter font-medium tracking-wider uppercase text-xs
                    transition-colors duration-300 border backdrop-blur-sm whitespace-nowrap
                    ${isActive
                      ? 'text-white border-transparent'
                      : 'text-white/70 bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30 hover:text-white'
                    }
                    ${isTransitioning ? 'pointer-events-none' : 'cursor-pointer'}
                  `}
                  disabled={isTransitioning}
                  role="tab"
                  aria-selected={isActive}
                >
                  {isActive && (
                    <motion.div
                      layoutId="bibliothequeTabIndicatorMobile"
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: tabColor,
                        boxShadow: `0 8px 25px ${tabColor}40`
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{verticaleData.verticale.nom}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Grid - NOUVEAU DESIGN PREMIUM */}
      <div className="max-w-7xl mx-auto">
        <div
          className={`
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10
            transition-all duration-400 ease-in-out
            ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}
          `}
          role="tabpanel"
          id={`tabpanel-${currentVerticale.verticale.id}`}
          aria-labelledby={`tab-${currentVerticale.verticale.id}`}
        >
          {currentVerticale.productions.map((production, index) => (
            <div
              key={production.id}
              className={`
                group relative overflow-hidden rounded-3xl cursor-pointer
                h-[500px] lg:h-[550px]
                transform transition-all duration-700 hover:scale-[1.02] hover:z-10
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
              `}
              style={{
                transitionDelay: `${(index * 100) + 600}ms`,
              }}
              onMouseEnter={() => setHoveredCard(production.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(production.url)}
              role="article"
              aria-label={`Article: ${production.titre} - ${currentVerticale.verticale.nom}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(production.url);
                }
              }}
              >
              {/* Image Container - IMAGES NETTES */}
              <div className="absolute inset-0">
                {loadedImages.has(production.id) ? (
                  <div
                    className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${production.imageUrl})`,
                      filter: hoveredCard === production.id 
                        ? 'brightness(0.3) contrast(1.3) saturate(1.2)' 
                        : 'brightness(0.5) contrast(1.2) saturate(1.1)'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                )}
                
                {/* Film Grain Texture Overlay */}
                <div 
                  className="absolute inset-0 film-grain-texture opacity-15 mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                    backgroundSize: '256px 256px'
                  }}
                />

                {/* Strategic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
              </div>

              {/* Large Number Watermark - Plus visible */}
              <div className="absolute top-8 right-8 pointer-events-none z-10">
                <span 
                  className="font-playfair text-white select-none transition-all duration-500"
                  style={{
                    fontSize: 'clamp(4rem, 6vw, 6rem)',
                    opacity: hoveredCard === production.id ? 0.6 : 0.25,
                    fontWeight: 700,
                    lineHeight: 1,
                    textShadow: '0 0 30px rgba(255,255,255,0.2)',
                    color: hoveredCard === production.id ? currentColor : 'white',
                    WebkitTextStroke: `1px ${hoveredCard === production.id ? currentColor + '40' : 'rgba(255,255,255,0.1)'}`
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content Overlay - NOUVEAU DESIGN */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 z-20">
                
                {/* Top Section - Category Badge */}
                <div className="flex justify-between items-start">
                  <div 
                    className="px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-500"
                    style={{
                      backgroundColor: `${currentColor}20`,
                      borderColor: `${currentColor}40`,
                      boxShadow: hoveredCard === production.id ? `0 8px 25px ${currentColor}30` : 'none'
                    }}
                  >
                    <span 
                      className="font-inter font-bold text-xs tracking-[0.15em] uppercase transition-colors duration-500"
                      style={{ color: hoveredCard === production.id ? currentColor : 'white' }}
                    >
                      {currentVerticale.verticale.nom}
                    </span>
                  </div>

                  {/* Play Icon - Appears on Hover */}
                  <div
                    className={`
                      w-12 h-12 rounded-full backdrop-blur-md border border-white/20
                      flex items-center justify-center transition-all duration-500
                      ${hoveredCard === production.id
                        ? 'opacity-100 scale-110 bg-white/10'
                        : 'opacity-0 scale-90'
                      }
                    `}
                    aria-hidden="true"
                  >
                    <BookOpen className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                </div>

                {/* Bottom Section - Title & CTA */}
                <div>
                  {/* Title - Montserrat Bold */}
                  <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-white mb-6 leading-tight">
                    {production.titre}
                  </h3>

                  {/* Decorative Line with Dynamic Color */}
                  <div 
                    className="h-1 mb-6 rounded-full transition-all duration-500"
                    style={{
                      width: hoveredCard === production.id ? '120px' : '60px',
                      background: `linear-gradient(90deg, ${currentColor}, ${currentColor}80)`,
                      boxShadow: hoveredCard === production.id ? `0 0 20px ${currentColor}60` : 'none'
                    }}
                  />

                  {/* CTA Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="font-inter text-white/90 text-sm tracking-wide uppercase font-medium">
                        Lire l'article
                      </span>
                      
                      {/* Reading Time Estimate */}
                      <div className="flex items-center gap-2 text-white/60 text-xs">
                        <Clock className="w-3 h-3" aria-hidden="true" />
                        <span>{Math.floor(Math.random() * 5) + 3} min de lecture</span>
                      </div>
                    </div>

                    <div 
                      className={`
                        w-14 h-14 rounded-full flex items-center justify-center 
                        transition-all duration-500 backdrop-blur-md border
                        ${hoveredCard === production.id 
                          ? 'scale-110 shadow-lg' 
                          : 'scale-100'
                        }
                      `}
                      style={{
                        backgroundColor: hoveredCard === production.id ? `${currentColor}40` : `${currentColor}20`,
                        borderColor: hoveredCard === production.id ? `${currentColor}60` : `${currentColor}30`,
                        boxShadow: hoveredCard === production.id ? `0 12px 30px ${currentColor}40` : 'none'
                      }}
                    >
                      <ArrowRight
                        className={`w-5 h-5 transition-all duration-500 ${
                          hoveredCard === production.id ? 'translate-x-1' : ''
                        }`}
                        style={{ color: hoveredCard === production.id ? currentColor : 'white' }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect with Dynamic Color */}
              <div 
                className={`
                  absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none
                  ${hoveredCard === production.id 
                    ? 'ring-2 shadow-2xl' 
                    : ''
                  }
                `}
                style={{
                  ringColor: hoveredCard === production.id ? `${currentColor}60` : 'transparent',
                  boxShadow: hoveredCard === production.id ? `0 25px 50px ${currentColor}25` : 'none'
                }}
              />

              {/* Premium Border Animation */}
              <div 
                className={`
                  absolute inset-0 rounded-3xl border-2 transition-all duration-500 pointer-events-none
                  ${hoveredCard === production.id ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                  borderColor: hoveredCard === production.id ? `${currentColor}50` : 'transparent',
                  background: hoveredCard === production.id 
                    ? `linear-gradient(135deg, ${currentColor}05 0%, transparent 50%, ${currentColor}05 100%)` 
                    : 'transparent'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA - CORRIGÉ AVEC REACT ROUTER */}
      <div className={`text-center mt-20 transform transition-all duration-1000 delay-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <button
          onClick={handleNavigateToBibliotheque}
          className="group inline-flex items-center gap-4 px-8 py-4 border text-white font-inter font-medium tracking-widest uppercase text-sm transition-all duration-500 backdrop-blur-sm rounded-full hover:scale-105 cursor-pointer"
          style={{
            borderColor: `${currentColor}40`,
            backgroundColor: `${currentColor}10`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${currentColor}60`;
            e.currentTarget.style.backgroundColor = `${currentColor}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${currentColor}40`;
            e.currentTarget.style.backgroundColor = `${currentColor}10`;
          }}
        >
          <span>Explorer toute la bibliothèque</span>
          <ArrowRight
            className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500"
            style={{ color: currentColor }}
            aria-hidden="true"
          />
        </button>
      </div>
    </section>
  );
};

export default BibliothequeSection;