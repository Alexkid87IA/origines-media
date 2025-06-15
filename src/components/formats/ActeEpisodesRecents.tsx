import React, { useState, useEffect, useRef } from 'react';
import { Play, Clock, Eye, Heart, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Episode {
  id: string;
  titre: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  datePublication: string;
  duree: string;
  vues: number;
  likes: number;
  episode?: number;
  saison?: number;
  isPopular?: boolean;
  isRecent?: boolean;
  tags: string[];
}

interface ActeEpisodesRecentsProps {
  formatId: string;
  formatName: string;
  formatColor: string;
  episodes: Episode[];
}

const ActeEpisodesRecents: React.FC<ActeEpisodesRecentsProps> = ({
  formatId,
  formatName,
  formatColor,
  episodes
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer
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
    episodes.forEach((episode) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, episode.id]));
      };
      img.src = episode.thumbnailUrl;
    });
  }, [episodes]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Navigation du carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % episodes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + episodes.length) % episodes.length);
  };

  if (episodes.length === 0) {
    return null;
  }

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-8 lg:px-16 bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div 
              className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
            <span 
              className="font-inter text-sm tracking-[0.2em] uppercase"
              style={{ color: formatColor }}
            >
              Acte 2
            </span>
            <div 
              className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
          </div>
          
          <h2 className="font-montserrat font-black text-3xl lg:text-4xl text-white mb-6">
            Épisodes
            <br />
            <span 
              className="gradient-text-animated"
              style={{
                background: `linear-gradient(-45deg, ${formatColor}, #EC4899, #F59E0B, ${formatColor})`,
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 3s ease infinite'
              }}
            >
              Récents
            </span>
          </h2>
          
          <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Découvrez nos dernières productions dans ce format exclusif
          </p>
        </div>

        {/* Episodes Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          {episodes.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300"
                style={{
                  borderColor: `${formatColor}40`
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300"
                style={{
                  borderColor: `${formatColor}40`
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Episode Card */}
          <div className="max-w-4xl mx-auto">
            {episodes.map((episode, index) => (
              <div
                key={episode.id}
                className={`
                  transition-all duration-500 ${
                    index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0'
                  }
                `}
              >
                <div
                  className="group relative overflow-hidden rounded-3xl cursor-pointer h-[400px] lg:h-[500px]"
                  onMouseEnter={() => setHoveredCard(episode.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.open(episode.videoUrl, '_blank')}
                >
                  {/* Thumbnail */}
                  <div className="absolute inset-0">
                    {loadedImages.has(episode.id) ? (
                      <div
                        className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${episode.thumbnailUrl})`,
                          filter: hoveredCard === episode.id 
                            ? 'brightness(0.3) contrast(1.3) saturate(1.2)' 
                            : 'brightness(0.5) contrast(1.2) saturate(1.1)'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                    )}
                    
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
                  </div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div 
                      className={`
                        w-24 h-24 rounded-full backdrop-blur-md border-2 flex items-center justify-center
                        transition-all duration-500
                        ${hoveredCard === episode.id ? 'scale-110 opacity-100' : 'scale-100 opacity-80'}
                      `}
                      style={{
                        backgroundColor: `${formatColor}30`,
                        borderColor: formatColor
                      }}
                    >
                      <Play 
                        className="w-10 h-10 ml-1"
                        style={{ color: formatColor }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                    {/* Episode Info */}
                    <div className="flex items-center gap-4 mb-4">
                      {episode.episode && (
                        <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full">
                          <span className="font-inter text-white text-sm font-bold">
                            S{episode.saison}E{episode.episode}
                          </span>
                        </div>
                      )}
                      <div className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full">
                        <span className="font-inter text-white text-sm font-medium">
                          {episode.duree}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-white mb-4 leading-tight">
                      {episode.titre}
                    </h3>
                    
                    {/* Description */}
                    <p className="font-inter text-white/80 text-lg leading-relaxed mb-6 max-w-3xl">
                      {episode.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-6 text-white/60 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(episode.datePublication)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(episode.vues)} vues</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        <span>{formatNumber(episode.likes)} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicators */}
          {episodes.length > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {episodes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'scale-125' 
                      : 'scale-100 opacity-50'
                  }`}
                  style={{
                    backgroundColor: index === currentSlide ? formatColor : 'white'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ActeEpisodesRecents;