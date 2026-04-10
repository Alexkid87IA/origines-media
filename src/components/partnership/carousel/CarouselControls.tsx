import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Slide } from './carouselTypes';

interface CarouselControlsProps {
  slides: Slide[];
  currentSlide: number;
  isAutoPlaying: boolean;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onGoToSlide: (index: number) => void;
  onToggleAutoPlay: () => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  slides,
  currentSlide,
  isAutoPlaying,
  onPrevSlide,
  onNextSlide,
  onGoToSlide,
  onToggleAutoPlay,
}) => {
  return (
    <>
      {/* Desktop Navigation Arrows */}
      <button
        onClick={onPrevSlide}
        className="hidden md:flex absolute -left-16 lg:-left-20 top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-100 shadow-sm border border-gray-300 rounded-2xl items-center justify-center hover:bg-white/20 transition-all duration-300 group hover:scale-110"
      >
        <ChevronLeft className="w-7 h-7 text-gray-900 group-hover:text-orange-300 transition-colors" />
      </button>
      <button
        onClick={onNextSlide}
        className="hidden md:flex absolute -right-16 lg:-right-20 top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-100 shadow-sm border border-gray-300 rounded-2xl items-center justify-center hover:bg-white/20 transition-all duration-300 group hover:scale-110"
      >
        <ChevronRight className="w-7 h-7 text-gray-900 group-hover:text-purple-300 transition-colors" />
      </button>
    </>
  );
};

// ============ MOBILE NAVIGATION ============
interface MobileNavigationProps {
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

export const CarouselMobileNavigation: React.FC<MobileNavigationProps> = ({
  onPrevSlide,
  onNextSlide,
}) => {
  return (
    <div className="flex md:hidden justify-center gap-4 mb-6">
      <button
        onClick={onPrevSlide}
        className="w-12 h-12 bg-gray-100 shadow-sm border border-gray-300 rounded-xl flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>
      <button
        onClick={onNextSlide}
        className="w-12 h-12 bg-gray-100 shadow-sm border border-gray-300 rounded-xl flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6 text-gray-900" />
      </button>
    </div>
  );
};

// ============ SLIDE INDICATORS ============
interface SlideIndicatorsProps {
  slides: Slide[];
  currentSlide: number;
  onGoToSlide: (index: number) => void;
}

export const CarouselSlideIndicators: React.FC<SlideIndicatorsProps> = ({
  slides,
  currentSlide,
  onGoToSlide,
}) => {
  return (
    <div className="flex items-center justify-center gap-1.5 md:gap-3 mb-6 md:mb-8 overflow-x-auto pb-2">
      <div className="flex gap-1.5 md:gap-3">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => onGoToSlide(index)}
            className="relative group flex-shrink-0"
          >
            <div className={`h-2 rounded-full transition-all duration-500 ${
              currentSlide === index
                ? 'w-8 md:w-12 bg-gradient-to-r from-orange-500 to-purple-500'
                : 'w-2 bg-white/20 hover:bg-white/40 hover:w-3'
            }`} />
            {/* Tooltip - Hidden on mobile */}
            <div className="hidden md:block absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-white shadow-sm text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                {slide.title}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============ BOTTOM CONTROLS ============
interface BottomControlsProps {
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

export const CarouselBottomControls: React.FC<BottomControlsProps> = ({
  isAutoPlaying,
  onToggleAutoPlay,
}) => {
  return (
    <div className="flex flex-col items-center gap-3 md:gap-4">
      {/* Auto-play toggle */}
      <button
        onClick={onToggleAutoPlay}
        className={`text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border shadow-sm transition-all duration-300 flex items-center gap-2 md:gap-3 ${
          isAutoPlaying
            ? 'bg-gradient-to-r from-orange-500/20 to-purple-500/20 border-orange-500/50 text-gray-900'
            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-600'
        }`}
      >
        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-white/40'}`} />
        {isAutoPlaying ? 'Lecture auto activée' : 'Activer lecture auto'}
      </button>

      {/* Swipe indicator for mobile */}
      <p className="md:hidden text-xs text-gray-400 flex items-center gap-2">
        <ChevronLeft className="w-3 h-3" />
        Glissez pour naviguer
        <ChevronRight className="w-3 h-3" />
      </p>

      {/* Download/Share section */}
      <div className="flex items-center gap-4 text-center">
        <p className="text-xs md:text-sm text-gray-400">
          Présentation optimisée pour convaincre en 5 minutes
        </p>
      </div>
    </div>
  );
};

export default CarouselControls;
