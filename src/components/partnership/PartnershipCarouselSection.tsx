import React, { useState, useEffect, useRef } from 'react';
import {
  CarouselSlideContent,
  CarouselHeader,
  CarouselControls,
  CarouselMobileNavigation,
  CarouselSlideIndicators,
  CarouselBottomControls,
  slides,
} from './carousel';

const PartnershipCarouselSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying && isVisible) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, isVisible]);

  // Touch handlers pour mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-10 md:py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M60 0v120M0 60h120'/%3E%3Ccircle cx='60' cy='60' r='40' stroke-dasharray='2,4'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <CarouselHeader isVisible={isVisible} slideCount={slides.length} />

        {/* Carousel Container */}
        <div className={`relative transform transition-all duration-3000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {/* 3D Perspective Container */}
          <div className="relative max-w-4xl mx-auto mb-8 md:mb-12">
            {/* Glow effects - Hidden on mobile for performance */}
            <div className="hidden md:block absolute -inset-20 bg-gradient-to-r from-orange-600/20 via-transparent to-purple-600/20 blur-3xl opacity-50" />

            {/* Main Slide Area */}
            <div
              className="relative aspect-square sm:aspect-[4/3] md:aspect-square transition-transform duration-700"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Shadow - Simplified on mobile */}
              <div className="hidden md:block absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-gray-50 blur-2xl rounded-full" />

              {/* Card Container */}
              <div className="relative h-full group">
                {/* Decorative frame - Hidden on mobile */}
                <div className="hidden md:block absolute -inset-4 bg-gradient-to-r from-orange-600/20 to-purple-600/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Main card */}
                <div
                  className={`relative h-full bg-gradient-to-br ${slides[currentSlide].bgGradient} shadow-sm md:backdrop-blur-2xl rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500`}
                  style={{
                    boxShadow: `
                      0 10px 25px -5px rgba(0, 0, 0, 0.3),
                      0 0 0 1px rgba(255, 255, 255, 0.1),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
                    `
                  }}
                >
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.05]" />

                  {/* Content */}
                  <div className="relative h-full overflow-y-auto md:overflow-hidden">
                    <CarouselSlideContent slide={slides[currentSlide]} />
                  </div>

                  {/* Slide number indicator */}
                  <div className="absolute top-3 right-3 md:top-6 md:right-6 flex items-center gap-1 md:gap-2 bg-gray-50 shadow-sm rounded-full px-2 py-1 md:px-3 md:py-1.5">
                    <span className="text-xs text-gray-400">Slide</span>
                    <span className="font-bold text-sm md:text-xl text-gray-900">{currentSlide + 1}</span>
                    <span className="text-xs text-gray-400">/ {slides.length}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows (Desktop) */}
              <CarouselControls
                slides={slides}
                currentSlide={currentSlide}
                isAutoPlaying={isAutoPlaying}
                onPrevSlide={prevSlide}
                onNextSlide={nextSlide}
                onGoToSlide={goToSlide}
                onToggleAutoPlay={toggleAutoPlay}
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <CarouselMobileNavigation
            onPrevSlide={prevSlide}
            onNextSlide={nextSlide}
          />

          {/* Enhanced Slide Indicators */}
          <CarouselSlideIndicators
            slides={slides}
            currentSlide={currentSlide}
            onGoToSlide={goToSlide}
          />

          {/* Controls section */}
          <CarouselBottomControls
            isAutoPlaying={isAutoPlaying}
            onToggleAutoPlay={toggleAutoPlay}
          />
        </div>
      </div>

      <style jsx>{`
        .gradient-text-animated {
          background: linear-gradient(135deg, #F97316 0%, #EC4899 50%, #8B5CF6 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Scrollbar styling for mobile */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
          }
        }
      `}</style>
    </section>
  );
};

export default PartnershipCarouselSection;
