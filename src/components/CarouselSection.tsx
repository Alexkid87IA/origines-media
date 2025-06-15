import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface Portrait {
  id: number;
  titre: string;
  categorie: string;
  accroche: string;
  imageUrl: string;
  url: string;
}

interface CarouselSectionProps {
  portraits: Portrait[];
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ portraits }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const SLIDE_DURATION = 8000; // 8 seconds per slide
  const PROGRESS_INTERVAL = 50; // Update progress every 50ms

  // Système de couleurs pour les catégories - PLUS VIBRANT
  const getCategoryColor = (categorie: string) => {
    const colors = {
      'CARRIÈRE': {
        text: 'text-emerald-300',
        bg: 'bg-emerald-500/30',
        border: 'border-emerald-400/60',
        accent: 'from-emerald-400 to-teal-400',
        glow: 'shadow-emerald-500/30',
        primary: '#10B981'
      },
      'SOCIÉTÉ': {
        text: 'text-blue-300',
        bg: 'bg-blue-500/30',
        border: 'border-blue-400/60',
        accent: 'from-blue-400 to-cyan-400',
        glow: 'shadow-blue-500/30',
        primary: '#3B82F6'
      },
      'PSYCHOLOGIE': {
        text: 'text-purple-300',
        bg: 'bg-purple-500/30',
        border: 'border-purple-400/60',
        accent: 'from-purple-400 to-violet-400',
        glow: 'shadow-purple-500/30',
        primary: '#8B5CF6'
      },
      'VOYAGE': {
        text: 'text-orange-300',
        bg: 'bg-orange-500/30',
        border: 'border-orange-400/60',
        accent: 'from-orange-400 to-amber-400',
        glow: 'shadow-orange-500/30',
        primary: '#F97316'
      },
      'ART & CRÉATIVITÉ': {
        text: 'text-pink-300',
        bg: 'bg-pink-500/30',
        border: 'border-pink-400/60',
        accent: 'from-pink-400 to-rose-400',
        glow: 'shadow-pink-500/30',
        primary: '#EC4899'
      },
      'SPIRITUALITÉ': {
        text: 'text-violet-300',
        bg: 'bg-violet-500/30',
        border: 'border-violet-400/60',
        accent: 'from-violet-400 to-purple-400',
        glow: 'shadow-violet-500/30',
        primary: '#7C3AED'
      }
    };

    return colors[categorie as keyof typeof colors] || {
      text: 'text-gray-300',
      bg: 'bg-gray-500/30',
      border: 'border-gray-400/60',
      accent: 'from-gray-400 to-gray-500',
      glow: 'shadow-gray-500/30',
      primary: '#6B7280'
    };
  };

  const resetProgress = useCallback(() => {
    setProgress(0);
  }, []);

  const startProgressTimer = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / PROGRESS_INTERVAL));
      });
    }, PROGRESS_INTERVAL);
  }, []);

  const stopProgressTimer = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % portraits.length);
    resetProgress();
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, portraits.length, resetProgress]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + portraits.length) % portraits.length);
    resetProgress();
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, portraits.length, resetProgress]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    resetProgress();
    setTimeout(() => setIsTransitioning(false), 1000);
  }, [isTransitioning, currentSlide, resetProgress]);

  // Auto-advance slides
  useEffect(() => {
    if (!isHovered && !isPaused) {
      intervalRef.current = setInterval(nextSlide, SLIDE_DURATION);
      startProgressTimer();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (isHovered || isPaused) {
        stopProgressTimer();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopProgressTimer();
    };
  }, [isHovered, isPaused, nextSlide, startProgressTimer, stopProgressTimer]);

  // Reset progress when slide changes
  useEffect(() => {
    resetProgress();
    if (!isHovered && !isPaused) {
      startProgressTimer();
    }
  }, [currentSlide, isHovered, isPaused, resetProgress, startProgressTimer]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(!isPaused);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isPaused]);

  const currentPortrait = portraits[currentSlide];
  const categoryColors = getCategoryColor(currentPortrait?.categorie || '');

  if (!currentPortrait) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-xl font-montserrat tracking-wider">
          CHARGEMENT...
        </div>
      </section>
    );
  }

  return (
    <section 
      className="relative h-screen w-full overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Layers - AMÉLIORÉ */}
      <div className="absolute inset-0">
        {/* Primary Background with Enhanced Ken Burns */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1200 ease-out"
          style={{
            backgroundImage: `url(${currentPortrait.imageUrl})`,
            transform: 'scale(1.08)',
            animation: 'kenBurnsEnhanced 25s ease-in-out infinite alternate',
            filter: 'brightness(0.7) contrast(1.2) saturate(1.3)'
          }}
        />
        
        {/* Strategic Gradient Overlays - OPTIMISÉS */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        
        {/* Dynamic Color Overlay basé sur la catégorie */}
        <div 
          className="absolute inset-0 mix-blend-overlay transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at 30% 70%, ${categoryColors.primary}15 0%, transparent 50%)`
          }}
        />
      </div>

      {/* Content Container - RÉVOLUTIONNÉ */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top spacer */}
        <div className="flex-1 min-h-[15vh] lg:min-h-[20vh]" />
        
        {/* Main Content Area */}
        <div className="flex-2 flex flex-col justify-end pb-12 lg:pb-20 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto w-full">
            
            {/* Category Badge - AMÉLIORÉ */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <span className={`
                inline-flex items-center px-4 py-2 rounded-full 
                text-sm font-montserrat font-bold tracking-[0.15em] uppercase
                ${categoryColors.text} ${categoryColors.bg} ${categoryColors.border}
                border-2 backdrop-blur-md transition-all duration-300 shadow-lg
              `}
                style={{
                  animation: 'fadeInUp 0.8s ease-out 0.3s forwards',
                  opacity: 0,
                  transform: 'translateY(30px)',
                  boxShadow: `0 8px 25px ${categoryColors.primary}40`
                }}
              >
                {currentPortrait.categorie}
              </span>
            </div>

            {/* Title - DRAMATIQUEMENT AMÉLIORÉ */}
            <div className="mb-8">
              <h2 
                key={currentSlide}
                className="font-montserrat font-black uppercase tracking-wider text-white leading-[0.85] mb-6"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 4.5rem)',
                  textShadow: '0 8px 40px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.4)',
                  animation: 'titleRevealEnhanced 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                {currentPortrait.titre.split(' ').map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className="inline-block mr-2 lg:mr-3"
                    style={{
                      animation: `wordSlideInEnhanced 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                      animationDelay: `${wordIndex * 0.1}s`,
                      opacity: 0,
                      transform: 'translateY(60px) rotateX(90deg)'
                    }}
                  >
                    {word}
                  </span>
                ))}
              </h2>
              
              {/* Accent line - DYNAMIQUE avec couleur de catégorie */}
              <div 
                className={`h-1 bg-gradient-to-r ${categoryColors.accent} mb-6`}
                style={{
                  width: 'clamp(60px, 8vw, 120px)',
                  animation: 'lineExpandEnhanced 1.2s ease-out 0.8s forwards',
                  transform: 'scaleX(0)',
                  boxShadow: `0 0 20px ${categoryColors.primary}60`
                }}
              />
            </div>

            {/* Accroche Paragraph - AMÉLIORÉE */}
            <div
              className="mb-8"
              style={{
                animation: 'fadeInUp 1s ease-out 1.2s forwards',
                opacity: 0,
                transform: 'translateY(30px)'
              }}
            >
              <p className="font-inter text-white/95 leading-relaxed max-w-4xl text-lg lg:text-xl"
                 style={{
                   textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                 }}>
                {currentPortrait.accroche}
              </p>
            </div>

            {/* CTA Section - RÉVOLUTIONNÉE */}
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
              style={{
                animation: 'fadeInUp 1s ease-out 1.4s forwards',
                opacity: 0,
                transform: 'translateY(30px)'
              }}
            >
              {/* Primary CTA - SPECTACULAIRE */}
              <a
                href={currentPortrait.url}
                className={`group relative inline-flex items-center gap-3 border-2 text-white font-inter font-bold tracking-widest uppercase transition-all duration-500 backdrop-blur-md overflow-hidden rounded-xl ${categoryColors.border} hover:scale-105`}
                style={{
                  padding: 'clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 32px)',
                  fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                  background: `linear-gradient(135deg, ${categoryColors.primary}20 0%, ${categoryColors.primary}10 100%)`,
                  boxShadow: `0 12px 40px ${categoryColors.primary}30`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = categoryColors.primary;
                  e.currentTarget.style.boxShadow = `0 20px 60px ${categoryColors.primary}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${categoryColors.primary}30`;
                }}
              >
                <span className="relative z-10">Plonger dans cette Histoire</span>
                <ChevronRight 
                  className="group-hover:translate-x-2 transition-transform duration-500 relative z-10"
                  style={{
                    width: 'clamp(16px, 1.2vw, 20px)',
                    height: 'clamp(16px, 1.2vw, 20px)'
                  }}
                />
                
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${categoryColors.accent} opacity-30 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500`} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls - MASQUÉS SUR MOBILE */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Navigation Arrows - VISIBLES UNIQUEMENT SUR DESKTOP */}
        <button
          onClick={prevSlide}
          className={`hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 items-center justify-center bg-black/50 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-black/70 hover:border-white/50 hover:scale-110 transition-all duration-300 pointer-events-auto group z-30 ${
            isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          style={{
            width: 'clamp(48px, 4vw, 60px)',
            height: 'clamp(48px, 4vw, 60px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
          }}
          disabled={isTransitioning}
        >
          <ChevronLeft 
            className="group-hover:-translate-x-1 transition-all duration-300"
            style={{
              width: 'clamp(20px, 2vw, 28px)',
              height: 'clamp(20px, 2vw, 28px)'
            }}
          />
        </button>

        <button
          onClick={nextSlide}
          className={`hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 items-center justify-center bg-black/50 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-black/70 hover:border-white/50 hover:scale-110 transition-all duration-300 pointer-events-auto group z-30 ${
            isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          style={{
            width: 'clamp(48px, 4vw, 60px)',
            height: 'clamp(48px, 4vw, 60px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
          }}
          disabled={isTransitioning}
        >
          <ChevronRight 
            className="group-hover:translate-x-1 transition-all duration-300"
            style={{
              width: 'clamp(20px, 2vw, 28px)',
              height: 'clamp(20px, 2vw, 28px)'
            }}
          />
        </button>

        {/* Play/Pause Control - AMÉLIORÉ */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute top-4 lg:top-6 right-4 lg:right-6 flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-black/70 hover:border-white/50 transition-all duration-300 pointer-events-auto cursor-pointer z-30"
          style={{
            width: 'clamp(40px, 3vw, 48px)',
            height: 'clamp(40px, 3vw, 48px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}
        >
          {isPaused ? (
            <Play 
              className="ml-0.5"
              style={{
                width: 'clamp(14px, 1.5vw, 18px)',
                height: 'clamp(14px, 1.5vw, 18px)'
              }}
            />
          ) : (
            <Pause 
              style={{
                width: 'clamp(14px, 1.5vw, 18px)',
                height: 'clamp(14px, 1.5vw, 18px)'
              }}
            />
          )}
        </button>
      </div>

      {/* Progress Indicators - RÉVOLUTIONNÉS */}
      <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {portraits.map((portrait, index) => {
          const indicatorColors = getCategoryColor(portrait.categorie);
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`group relative bg-black/50 backdrop-blur-sm rounded-full overflow-hidden hover:bg-black/70 transition-all duration-300 border border-white/20 pointer-events-auto cursor-pointer ${
                isTransitioning ? 'opacity-50' : ''
              }`}
              style={{
                width: 'clamp(40px, 3.5vw, 50px)',
                height: 'clamp(6px, 0.5vw, 8px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
              }}
              disabled={isTransitioning}
            >
              {/* Progress Fill */}
              <div 
                className={`absolute inset-0 bg-gradient-to-r ${indicatorColors.accent} rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  width: index === currentSlide ? `${progress}%` : '0%'
                }}
              />
              
              {/* Active State */}
              <div 
                className={`absolute inset-0 bg-gradient-to-r ${indicatorColors.accent} rounded-full transition-all duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Slide Counter - AMÉLIORÉ */}
      <div className="absolute bottom-4 lg:bottom-6 right-4 lg:right-6 text-white/80 font-inter tracking-wider bg-black/50 backdrop-blur-sm rounded-full border border-white/20 z-30"
           style={{ 
             fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
             padding: 'clamp(6px, 0.8vw, 8px) clamp(12px, 1.5vw, 16px)',
             boxShadow: '0 4px 16px rgba(0,0,0,0.3)' 
           }}>
        <span className="text-white font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="mx-1.5">/</span>
        <span>{String(portraits.length).padStart(2, '0')}</span>
      </div>

      {/* Enhanced Loading Indicator */}
      <div className={`absolute top-0 left-0 bg-gradient-to-r ${categoryColors.accent} transition-all duration-100 z-30 ${!isPaused && !isHovered ? 'opacity-80' : 'opacity-0'}`}
           style={{ 
             width: `${progress}%`,
             height: 'clamp(2px, 0.3vw, 4px)',
             boxShadow: `0 0 10px ${categoryColors.primary}60`
           }} />
    </section>
  );
};

export default CarouselSection;