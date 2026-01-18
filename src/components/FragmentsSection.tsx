import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Nombre de cartes visibles selon la taille d'écran (estimation)
  const getVisibleCards = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const visibleCards = getVisibleCards();
  const maxIndex = Math.max(0, videos.length - visibleCards);

  const goLeft = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goRight = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < maxIndex;

  if (videos.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-16 lg:py-20">
      {/* Section Header */}
      <div className="text-center mb-12 px-8 lg:px-16">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
          <span className="font-inter text-emerald-400 text-sm tracking-[0.2em] uppercase">
            Acte 1
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </div>

        <h2 className="font-montserrat font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-wider text-white mb-4">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Fragments
          </span>
        </h2>

        <p className="font-inter text-base text-white/70 max-w-xl mx-auto">
          Des éclats de récits bruts pour nourrir la réflexion
        </p>
      </div>

      {/* Carrousel Container */}
      <div className="relative px-8 lg:px-16">
        {/* Flèche Gauche */}
        <button
          onClick={goLeft}
          disabled={!canGoLeft}
          className={`
            absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 z-20
            w-12 h-12 rounded-full bg-black/80 border border-white/20
            flex items-center justify-center transition-all duration-300
            ${canGoLeft
              ? 'text-white hover:bg-emerald-600 hover:border-emerald-500 cursor-pointer'
              : 'text-white/30 cursor-not-allowed opacity-0'
            }
          `}
          aria-label="Précédent"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Flèche Droite */}
        <button
          onClick={goRight}
          disabled={!canGoRight}
          className={`
            absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 z-20
            w-12 h-12 rounded-full bg-black/80 border border-white/20
            flex items-center justify-center transition-all duration-300
            ${canGoRight
              ? 'text-white hover:bg-emerald-600 hover:border-emerald-500 cursor-pointer'
              : 'text-white/30 cursor-not-allowed opacity-0'
            }
          `}
          aria-label="Suivant"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Cards Container */}
        <div ref={containerRef} className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`
            }}
          >
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div
                  className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4] bg-gray-900"
                  onClick={() => navigate(`/video/${video.id}`)}
                  role="article"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/video/${video.id}`);
                    }
                  }}
                >
                  {/* Image */}
                  <img
                    src={video.thumbnailUrl}
                    alt={video.titre}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: 'brightness(0.85)' }}
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Numéro */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="font-playfair text-5xl font-bold text-white/60">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3 className="font-montserrat font-bold text-lg text-white mb-2 line-clamp-2">
                      {video.titre}
                    </h3>
                    <div className="w-12 h-0.5 bg-emerald-500 mb-3" />
                    <p className="font-inter text-white/70 text-sm line-clamp-2">
                      {video.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-emerald-500/50 rounded-2xl transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicateurs de pagination */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${i === currentIndex
                  ? 'bg-emerald-500 w-6'
                  : 'bg-white/30 hover:bg-white/50'
                }
              `}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12 px-8">
        <Button
          as="a"
          href="/videos"
          variant="cta-outline"
          size="md"
          color="#10B981"
          withArrow
          className="uppercase tracking-wider"
        >
          Voir toutes les vidéos
        </Button>
      </div>
    </section>
  );
};

export default FragmentsSection;
