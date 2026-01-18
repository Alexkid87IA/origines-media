import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Video, Star } from 'lucide-react';

interface Univers {
  id: string;
  nom: string;
  description: string;
  imageUrl: string;
  url: string;
  isSpecial?: boolean; // Pour identifier la carte "NOS SÉRIES"
}

interface UniversSectionProps {
  univers: Univers[];
}

const UniversSection: React.FC<UniversSectionProps> = ({ univers }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHorizontalScrolling, setIsHorizontalScrolling] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Preload images
  useEffect(() => {
    univers.forEach((univ) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, univ.id]));
      };
      img.src = univ.imageUrl;
    });
  }, [univers]);

  // Check scroll position to update navigation indicators
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Navigation functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 350 + 24; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2, // Scroll 2 cards at a time
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 350 + 24; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2, // Scroll 2 cards at a time
        behavior: 'smooth'
      });
    }
  };

  // Improved wheel scroll handling - Only intercept when actually scrolling horizontally
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainerRef.current && sectionRef.current) {
        const container = scrollContainerRef.current;
        const rect = container.getBoundingClientRect();
        
        // Check if mouse is over the scroll container
        const isOverContainer = e.clientX >= rect.left && 
                               e.clientX <= rect.right && 
                               e.clientY >= rect.top && 
                               e.clientY <= rect.bottom;
        
        if (isOverContainer) {
          const { scrollLeft, scrollWidth, clientWidth } = container;
          const canScrollHorizontally = scrollWidth > clientWidth;
          
          // Only prevent default if we can actually scroll horizontally
          // and we're not at the edges trying to scroll in the blocked direction
          if (canScrollHorizontally) {
            const scrollingRight = e.deltaY > 0;
            const scrollingLeft = e.deltaY < 0;
            
            const canScrollRightMore = scrollLeft < scrollWidth - clientWidth - 1;
            const canScrollLeftMore = scrollLeft > 1;
            
            // Only intercept if we can actually scroll in the intended direction
            if ((scrollingRight && canScrollRightMore) || (scrollingLeft && canScrollLeftMore)) {
              e.preventDefault();
              setIsHorizontalScrolling(true);
              container.scrollLeft += e.deltaY;
              checkScrollPosition();
              
              // Reset horizontal scrolling flag after a short delay
              setTimeout(() => setIsHorizontalScrolling(false), 150);
            }
          }
        }
      }
    };

    // Add event listener to the document to catch all wheel events
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Add scroll event listener to update navigation indicators
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 relative overflow-hidden"
      aria-labelledby="univers-section-title"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M40 40L20 20v40l20-20zm0 0l20 20V20L40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Section Header */}
      <div className={`text-center mb-16 px-8 lg:px-16 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />
          <span className="font-inter text-fuchsia-400 text-sm tracking-[0.2em] uppercase">
            Acte 3
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />
        </div>
        
        <h2 id="univers-section-title" className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
          Explorer nos
          <br />
          <span className="gradient-text-animated">Univers</span>
        </h2>
        
        <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Plongez dans les grandes thématiques qui façonnent nos récits et découvrez l'univers qui vous inspire
        </p>
      </div>

      {/* Navigation Instructions with Arrow Buttons */}
      <div className={`text-center mb-8 px-8 lg:px-16 transform transition-all duration-1000 delay-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="flex items-center justify-center gap-6">
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`
              w-12 h-12 rounded-full border border-white/20 backdrop-blur-sm
              flex items-center justify-center transition-all duration-300
              ${canScrollLeft
                ? 'text-white hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 hover:scale-110 cursor-pointer'
                : 'text-white/30 cursor-not-allowed'
              }
            `}
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
            aria-label="Faire défiler vers la gauche"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Instructions */}
          <div className="inline-flex items-center gap-3 text-white/70 text-sm font-inter tracking-wider bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
            <div className="w-6 h-px bg-white/40" />
            <span>Utilisez les flèches ou faites défiler horizontalement</span>
            <div className="w-6 h-px bg-white/40" />
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`
              w-12 h-12 rounded-full border border-white/20 backdrop-blur-sm
              flex items-center justify-center transition-all duration-300
              ${canScrollRight
                ? 'text-white hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10 hover:scale-110 cursor-pointer'
                : 'text-white/30 cursor-not-allowed'
              }
            `}
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
            aria-label="Faire défiler vers la droite"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container with Navigation Arrows */}
      <div className="relative">
        {/* Large Navigation Arrows - Left */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`
            absolute left-4 top-1/2 -translate-y-1/2 z-30
            w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20
            flex items-center justify-center transition-all duration-300
            ${canScrollLeft
              ? 'text-white hover:bg-black/80 hover:border-fuchsia-500/50 hover:scale-110 cursor-pointer shadow-2xl'
              : 'text-white/30 cursor-not-allowed opacity-50'
            }
          `}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
          aria-label="Univers précédents"
        >
          <ChevronLeft className="w-8 h-8" aria-hidden="true" />
        </button>

        {/* Large Navigation Arrows - Right */}
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`
            absolute right-4 top-1/2 -translate-y-1/2 z-30
            w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20
            flex items-center justify-center transition-all duration-300
            ${canScrollRight
              ? 'text-white hover:bg-black/80 hover:border-fuchsia-500/50 hover:scale-110 cursor-pointer shadow-2xl'
              : 'text-white/30 cursor-not-allowed opacity-50'
            }
          `}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
          aria-label="Univers suivants"
        >
          <ChevronRight className="w-8 h-8" aria-hidden="true" />
        </button>

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-8 cursor-grab active:cursor-grabbing"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          <div className="flex gap-6 px-8 lg:px-16" style={{ width: 'max-content' }}>
            {/* Univers Cards */}
            {univers.map((univ, index) => {
              // Logique spéciale pour la carte "NOS SÉRIES"
              const isSeriesCard = univ.isSpecial;
              
              return (
                <div
                  key={univ.id}
                  className={`
                    group relative overflow-hidden rounded-3xl cursor-pointer flex-shrink-0
                    w-[320px] h-[480px] md:w-[350px] md:h-[500px] lg:w-[380px] lg:h-[520px]
                    transform transition-all duration-700 hover:scale-[1.02] hover:z-10
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                  `}
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                  onMouseEnter={() => setHoveredCard(univ.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.open(univ.url, '_blank')}
                  role="article"
                  aria-label={`Univers ${univ.nom}: ${univ.description}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.open(univ.url, '_blank');
                    }
                  }}
                >
                  {/* Background - Différent pour la carte Séries */}
                  <div className="absolute inset-0">
                    {isSeriesCard ? (
                      // ✨ DESIGN SPÉCIAL POUR "NOS SÉRIES" - Gradient Signature
                      <div className="w-full h-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-800 relative">
                        {/* Pattern Overlay pour texture */}
                        <div 
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          }}
                        />
                        
                        {/* Animated Gradient Overlay */}
                        <div className={`
                          absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent
                          transition-all duration-500
                          ${hoveredCard === univ.id ? 'opacity-100' : 'opacity-0'}
                        `} />

                        {/* Montage de vignettes pour suggérer une collection */}
                        <div className="absolute inset-0 grid grid-cols-3 gap-1 p-4 opacity-20">
                          <div className="bg-white/10 rounded-lg"></div>
                          <div className="bg-white/15 rounded-lg"></div>
                          <div className="bg-white/10 rounded-lg"></div>
                          <div className="bg-white/15 rounded-lg"></div>
                          <div className="bg-white/20 rounded-lg"></div>
                          <div className="bg-white/15 rounded-lg"></div>
                          <div className="bg-white/10 rounded-lg"></div>
                          <div className="bg-white/15 rounded-lg"></div>
                          <div className="bg-white/10 rounded-lg"></div>
                        </div>
                      </div>
                    ) : (
                      // Design normal pour les autres cartes
                      <>
                        {loadedImages.has(univ.id) ? (
                          <div
                            className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-105"
                            style={{
                              backgroundImage: `url(${univ.imageUrl})`,
                              filter: hoveredCard === univ.id 
                                ? 'brightness(0.4) contrast(1.3) saturate(1.2)' 
                                : 'brightness(0.6) contrast(1.1) saturate(1.1)'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                        )}
                        
                        {/* Film Grain Texture */}
                        <div 
                          className="absolute inset-0 film-grain-texture opacity-20 mix-blend-overlay pointer-events-none"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                            backgroundSize: '256px 256px'
                          }}
                        />
                        
                        {/* Strategic Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
                      </>
                    )}
                  </div>

                  {/* Badge "EXCLUSIF" pour la carte Séries */}
                  {isSeriesCard && (
                    <div className="absolute top-6 right-6 z-20">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-400/50 rounded-full backdrop-blur-md">
                        <Star className="w-3 h-3 text-amber-400" aria-hidden="true" />
                        <span className="font-inter text-amber-300 text-xs font-bold tracking-wider uppercase">
                          Exclusif
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Vertical Typography - Left Side */}
                  <div className="absolute left-6 top-6 bottom-6 flex items-center z-20">
                    <h3 
                      className={`
                        font-montserrat font-bold tracking-[0.3em] uppercase select-none
                        transition-all duration-500 transform-gpu
                        ${hoveredCard === univ.id 
                          ? (isSeriesCard ? 'text-white scale-105' : 'text-fuchsia-400 scale-105')
                          : 'text-white'
                        }
                      `}
                      style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        lineHeight: 1.2,
                        textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.3)',
                        letterSpacing: '0.3em',
                        // ✨ GRADIENT TEXT pour "NOS SÉRIES"
                        ...(isSeriesCard && hoveredCard === univ.id ? {
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        } : {})
                      }}
                    >
                      {univ.nom}
                    </h3>
                  </div>

                  {/* Content Overlay - Appears on Hover */}
                  <div className={`
                    absolute inset-0 flex flex-col justify-end p-8 z-30
                    transition-all duration-500 ease-out
                    ${hoveredCard === univ.id 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                    }
                  `}>
                    {/* Enhanced Glassmorphism Background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-md" />
                    
                    <div className="relative z-10">
                      {/* Description */}
                      <p className="font-inter text-white/90 text-lg leading-relaxed mb-6 max-w-xs">
                        {univ.description}
                      </p>

                      {/* CTA Button - Différent pour la carte Séries */}
                      <div className="flex items-center justify-between">
                        <span className="font-inter text-sm text-white/80 tracking-wide uppercase">
                          {isSeriesCard ? 'Découvrir nos séries' : 'Explorer l\'univers'}
                        </span>
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-white/20
                          ${isSeriesCard
                            ? 'bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30'
                            : 'bg-gradient-to-r from-fuchsia-500/30 to-violet-500/30'
                          }
                        `}>
                          {isSeriesCard ? (
                            <Video className="w-5 h-5 text-white" aria-hidden="true" />
                          ) : (
                            <ArrowRight className="w-5 h-5 text-white" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collection Number - Enhanced Visibility */}
                  <div className="absolute bottom-6 right-6 pointer-events-none z-10">
                    <span 
                      className="font-playfair text-white select-none"
                      style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        opacity: isSeriesCard ? 0.4 : 0.3,
                        fontWeight: 400,
                        lineHeight: 1,
                        textShadow: '0 0 20px rgba(255,255,255,0.1)',
                        // ✨ Couleur spéciale pour la carte Séries
                        color: isSeriesCard && hoveredCard === univ.id ? '#EC4899' : 'white'
                      }}
                    >
                      {isSeriesCard ? '★' : String(index).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`
                    absolute inset-0 rounded-3xl transition-all duration-500
                    ${hoveredCard === univ.id 
                      ? (isSeriesCard 
                          ? 'shadow-2xl shadow-violet-500/30 ring-1 ring-violet-500/40' 
                          : 'shadow-2xl shadow-fuchsia-500/20 ring-1 ring-fuchsia-500/30'
                        )
                      : ''
                    }
                  `} />

                  {/* Interactive Border Animation */}
                  <div className={`
                    absolute inset-0 rounded-3xl border-2 transition-all duration-500
                    ${hoveredCard === univ.id 
                      ? (isSeriesCard 
                          ? 'border-violet-500/50' 
                          : 'border-fuchsia-500/50'
                        )
                      : 'border-transparent'
                    }
                  `} />
                </div>
              );
            })}

            {/* ✅ CORRECTION : "Voir Tout" Card - LIEN CORRIGÉ vers /univers */}
            <div
              className={`
                group relative overflow-hidden rounded-3xl cursor-pointer flex-shrink-0
                w-[320px] h-[480px] md:w-[350px] md:h-[500px] lg:w-[380px] lg:h-[520px]
                transform transition-all duration-700 hover:scale-[1.02] hover:z-10
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
              `}
              style={{
                transitionDelay: `${univers.length * 150}ms`,
              }}
              onMouseEnter={() => setHoveredCard('voir-tout')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => window.open('/univers', '_self')}
              role="article"
              aria-label="Explorer les 10 univers - Découvrir toute la collection"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open('/univers', '_self');
                }
              }}
            >
              {/* Gradient Background - Signature Violet-Fuchsia */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-violet-800">
                {/* Subtle Pattern Overlay */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                
                {/* Animated Gradient Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent
                  transition-all duration-500
                  ${hoveredCard === 'voir-tout' ? 'opacity-100' : 'opacity-0'}
                `} />
              </div>

              {/* Content - Centered */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20">
                {/* Large Arrow Icon */}
                <div className={`
                  w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                  flex items-center justify-center mb-8
                  transition-all duration-500 group-hover:scale-110 group-hover:bg-white/30
                  ${hoveredCard === 'voir-tout' ? 'animate-pulse' : ''}
                `}>
                  <ArrowRight className="w-10 h-10 text-white" aria-hidden="true" />
                </div>

                {/* Text Content */}
                <div className="text-center">
                  <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-white mb-4 tracking-wider uppercase">
                    Explorer les
                  </h3>
                  <div className="font-montserrat font-black text-4xl lg:text-5xl text-white mb-6 tracking-wider">
                    10 UNIVERS
                  </div>
                  <p className="font-inter text-white/80 text-sm tracking-wide uppercase">
                    Découvrir toute la collection
                  </p>
                </div>
              </div>

              {/* Collection Number for "Voir Tout" Card */}
              <div className="absolute bottom-6 right-6 pointer-events-none z-10">
                <span 
                  className="font-playfair text-white select-none"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    opacity: 0.3,
                    fontWeight: 400,
                    lineHeight: 1,
                    textShadow: '0 0 20px rgba(255,255,255,0.1)'
                  }}
                >
                  +
                </span>
              </div>

              {/* Hover Glow Effect */}
              <div className={`
                absolute inset-0 rounded-3xl transition-all duration-500
                ${hoveredCard === 'voir-tout' 
                  ? 'shadow-2xl shadow-violet-500/30 ring-1 ring-white/30' 
                  : ''
                }
              `} />

              {/* Interactive Border Animation */}
              <div className={`
                absolute inset-0 rounded-3xl border-2 transition-all duration-500
                ${hoveredCard === 'voir-tout' 
                  ? 'border-white/50' 
                  : 'border-transparent'
                }
              `} />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Indicators */}
      <div className={`text-center mt-16 px-8 lg:px-16 transform transition-all duration-1000 delay-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        {/* Scroll Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[...univers, { id: 'voir-tout' }].map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index < 3 ? 'bg-fuchsia-500/60' : 'bg-white/20'
              }`}
            />
          ))}
          <div className="mx-2 text-white/40 text-xs font-inter">
            {canScrollRight && '→ Plus d\'univers'}
          </div>
        </div>
        
        {/* ✅ CORRECTION : Lien vers /univers */}
        <a
          href="/univers"
          className="group inline-flex items-center gap-4 px-8 py-4 border border-white/20 text-white font-inter font-medium tracking-widest uppercase text-sm hover:border-white/40 hover:bg-white/5 transition-all duration-500 backdrop-blur-sm rounded-full"
        >
          <span>Découvrir tous nos univers</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
};

export default UniversSection;