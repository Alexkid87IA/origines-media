import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface Video {
  id: string;
  titre: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface FragmentsSectionProps {
  videos: Video[];
}

const FragmentsSection: React.FC<FragmentsSectionProps> = ({ videos }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  // Preload images
  useEffect(() => {
    videos.forEach((video) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, video.id]));
      };
      img.src = video.thumbnailUrl;
    });
  }, [videos]);

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
      const cardWidth = 320 + 24; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2, // Scroll 2 cards at a time
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320 + 24; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2, // Scroll 2 cards at a time
        behavior: 'smooth'
      });
    }
  };

  // Wheel scroll handling for horizontal scroll
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
          
          if (canScrollHorizontally) {
            const scrollingRight = e.deltaY > 0;
            const scrollingLeft = e.deltaY < 0;
            
            const canScrollRightMore = scrollLeft < scrollWidth - clientWidth - 1;
            const canScrollLeftMore = scrollLeft > 1;
            
            if ((scrollingRight && canScrollRightMore) || (scrollingLeft && canScrollLeftMore)) {
              e.preventDefault();
              container.scrollLeft += e.deltaY;
              checkScrollPosition();
            }
          }
        }
      }
    };

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
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20L10 10v20l10-10zm0 0l10 10V10L20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Section Header */}
      <div className={`text-center mb-16 px-8 lg:px-16 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <span className="font-inter text-emerald-400 text-sm tracking-[0.2em] uppercase">
            Acte 1
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </div>
        
        <h2 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
          <span className="gradient-text-animated">Fragments</span>
        </h2>
        
        <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Des éclats de récits bruts pour nourrir la réflexion
        </p>
      </div>

      {/* Navigation Instructions */}
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
                ? 'text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:scale-110 cursor-pointer' 
                : 'text-white/30 cursor-not-allowed'
              }
            `}
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Instructions */}
          <div className="inline-flex items-center gap-3 text-white/70 text-sm font-inter tracking-wider bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
            <div className="w-6 h-px bg-white/40" />
            <span>Faites défiler horizontalement pour découvrir</span>
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
                ? 'text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:scale-110 cursor-pointer' 
                : 'text-white/30 cursor-not-allowed'
              }
            `}
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
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
              ? 'text-white hover:bg-black/80 hover:border-emerald-500/50 hover:scale-110 cursor-pointer shadow-2xl' 
              : 'text-white/30 cursor-not-allowed opacity-50'
            }
          `}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          <ChevronLeft className="w-8 h-8" />
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
              ? 'text-white hover:bg-black/80 hover:border-emerald-500/50 hover:scale-110 cursor-pointer shadow-2xl' 
              : 'text-white/30 cursor-not-allowed opacity-50'
            }
          `}
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          <ChevronRight className="w-8 h-8" />
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
            {/* Video Cards */}
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`
                  group relative overflow-hidden rounded-2xl cursor-pointer flex-shrink-0
                  w-[320px] h-[480px] md:w-[340px] md:h-[500px]
                  transform transition-all duration-700 hover:scale-[1.03] hover:z-10
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                `}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
                onClick={() => navigate(`/video/${video.id}`)}              >
                {/* Image Background */}
                <div className="absolute inset-0">
                  {loadedImages.has(video.id) ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${video.thumbnailUrl})`,
                        filter: 'brightness(0.8) contrast(1.1) saturate(1.1)'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                  )}
                  
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                {/* Enhanced Collection Number - BEAUCOUP PLUS VISIBLE */}
                <div className="absolute top-6 left-6 z-20">
                  <span 
                    className="font-playfair text-white select-none transition-all duration-500 group-hover:text-emerald-400"
                    style={{
                      fontSize: 'clamp(4rem, 8vw, 6rem)', // BEAUCOUP PLUS GRAND : 64px à 96px
                      opacity: 0.8, // BEAUCOUP PLUS VISIBLE : de 0.3 à 0.8
                      fontWeight: 700, // PLUS BOLD : de 400 à 700
                      lineHeight: 1,
                      textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(16, 185, 129, 0.3)', // OMBRE PLUS FORTE avec couleur emerald
                      WebkitTextStroke: '1px rgba(16, 185, 129, 0.2)' // CONTOUR SUBTIL en emerald
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content Area - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  {/* Title */}
                  <h3 className="font-montserrat font-bold text-xl text-white mb-3 leading-tight">
                    {video.titre}
                  </h3>
                  
                  {/* Decorative Line - Emerald Accent */}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 mb-4" />
                  
                  {/* Description */}
                  <p className="font-inter text-white/80 text-sm leading-relaxed line-clamp-2">
                    {video.description}
                  </p>
                </div>

                {/* Video Duration Badge - Top Right */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-inter font-medium px-2 py-1 rounded-full border border-white/20">
                    {Math.floor(Math.random() * 8) + 3}:00
                  </span>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 group-hover:ring-1 group-hover:ring-emerald-500/30" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className={`text-center mt-16 px-8 lg:px-16 transform transition-all duration-1000 delay-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <a
          href="/videos"
          className="group inline-flex items-center gap-4 px-8 py-4 border border-white/20 text-white font-inter font-medium tracking-widest uppercase text-sm hover:border-emerald-400/60 hover:bg-emerald-500/10 transition-all duration-500 backdrop-blur-sm rounded-full"
        >
          <span>Voir toutes les vidéos</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
        </a>
      </div>
    </section>
  );
};

export default FragmentsSection;