import React from 'react';

interface CarouselHeaderProps {
  isVisible: boolean;
  slideCount: number;
}

const CarouselHeader: React.FC<CarouselHeaderProps> = ({ isVisible, slideCount }) => {
  return (
    <div className={`text-center mb-8 md:mb-16 transform transition-all duration-3000 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
    }`}>
      <div className="inline-flex items-center gap-2 md:gap-4 mb-4 md:mb-8">
        <div className="w-12 md:w-24 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase font-medium">Success Story</span>
        <div className="w-12 md:w-24 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      <h2 className="font-black text-2xl md:text-4xl lg:text-6xl uppercase tracking-tight text-gray-900 mb-2 md:mb-4">
        La transformation
        <br />
        <span className="gradient-text-animated text-3xl md:text-5xl lg:text-7xl">en {slideCount} slides</span>
      </h2>

      <p className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto px-4">
        Comment transformer 1.5M de membres Facebook en empire média de l'entraide
      </p>
    </div>
  );
};

export default CarouselHeader;
