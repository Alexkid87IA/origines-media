import React, { useState, useEffect, useRef } from 'react';
import { Video, Clock, Eye, Calendar } from 'lucide-react';

interface ActeHeroFormatProps {
  formatId: string;
  formatName: string;
  formatColor: string;
  tagline: string;
  description: string;
  imageHero: string;
  stats: {
    episodes: number;
    dureeTotal: string;
    vuesMoyennes: number;
    frequence: string;
  };
}

const ActeHeroFormat: React.FC<ActeHeroFormatProps> = ({
  formatId,
  formatName,
  formatColor,
  tagline,
  description,
  imageHero,
  stats
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = imageHero;
  }, [imageHero]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-[70vh] min-h-[500px] overflow-hidden flex items-end"
    >
      {/* Background Image avec Ken Burns Effect */}
      <div className="absolute inset-0">
        {imageLoaded ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${imageHero})`,
              animation: 'kenBurnsEnhanced 25s ease-in-out infinite alternate',
              transform: 'scale(1.1)',
              filter: 'brightness(0.4) contrast(1.2)'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
        )}
        
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        {/* Dynamic Color Overlay */}
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-30"
          style={{
            background: `radial-gradient(circle at center, ${formatColor}20 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Contenu Principal */}
      <div className="relative z-10 w-full px-8 lg:px-16 pb-16">
        <div className="max-w-4xl">
          
          {/* Badge "Acte 1" */}
          <div className={`inline-flex items-center gap-4 mb-6 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div 
              className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
            <span 
              className="font-inter text-sm tracking-[0.2em] uppercase font-medium"
              style={{ color: formatColor }}
            >
              Acte 1
            </span>
            <div 
              className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
          </div>

          {/* Format Badge */}
          <div className={`mb-6 transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div 
              className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-md border flex items-center gap-2"
              style={{
                backgroundColor: `${formatColor}20`,
                borderColor: `${formatColor}40`,
                color: formatColor
              }}
            >
              <Video className="w-4 h-4" />
              <span className="font-inter font-bold text-sm tracking-[0.15em] uppercase">
                Format Exclusif
              </span>
            </div>
          </div>

          {/* Title avec Animation Enhanced */}
          <h1 
            className={`font-montserrat font-black text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight transform transition-all duration-1500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{
              textShadow: '0 8px 40px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.8)',
              animation: isVisible ? 'titleRevealEnhanced 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
              animationDelay: '0.4s'
            }}
          >
            {formatName}
          </h1>

          {/* Tagline */}
          <p 
            className={`font-inter text-2xl text-white/90 mb-6 leading-relaxed transform transition-all duration-1000 delay-600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.8)'
            }}
          >
            {tagline}
          </p>

          {/* Description */}
          <p 
            className={`font-inter text-lg text-white/80 mb-8 leading-relaxed max-w-3xl transform transition-all duration-1000 delay-800 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.8)'
            }}
          >
            {description}
          </p>

          {/* Stats */}
          <div 
            className={`flex flex-wrap items-center gap-8 text-white/70 text-sm transform transition-all duration-1000 delay-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
          >
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>{stats.episodes} épisodes</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{stats.dureeTotal}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{formatNumber(stats.vuesMoyennes)} vues/épisode</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{stats.frequence}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Film Grain Texture Overlay */}
      <div 
        className="absolute inset-0 film-grain-texture opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px'
        }}
      />
    </section>
  );
};

export default ActeHeroFormat;