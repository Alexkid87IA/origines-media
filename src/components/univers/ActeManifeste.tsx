// src/components/univers/ActeManifeste.tsx
// Design épuré - Style minimaliste blanc avec hero image

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface ActeManifesteProps {
  universId: string;
  universName: string;
  universColor: string;
  philosophie?: string;
  description?: string;
  imageHero?: string;
  videoHero?: string;
  stats?: {
    articles: number;
    auteurs: number;
    tempsTotal: string;
  };
}

const ActeManifeste: React.FC<ActeManifesteProps> = ({
  universId,
  universName,
  universColor,
  philosophie,
  description,
  imageHero,
  videoHero,
  stats
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultStats = stats || {
    articles: 127,
    auteurs: 24,
    tempsTotal: '186h'
  };

  const actualPhilosophie = philosophie || "Explorer l'essence de l'expérience humaine";
  const actualDescription = description || "Plongez dans un univers où chaque histoire révèle les nuances infinies des connexions humaines et de la conscience.";
  const actualImageHero = imageHero || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=90';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background avec image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-3000 ease-out"
          style={{
            backgroundImage: `url(${actualImageHero})`,
            transform: `scale(${isHovered ? 1.05 : 1}) translate(${(mousePos.x - 0.5) * 10}px, ${(mousePos.y - 0.5) * 10}px)`,
            filter: 'brightness(0.3) contrast(1.2)'
          }}
        />

        {/* Overlay gradient pour lisibilité */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-6 lg:p-12 xl:p-16">

        {/* Header */}
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[1px] bg-white/40" />
              <span className="text-white/60 text-xs font-light tracking-[0.2em] uppercase">
                Univers {universId}
              </span>
            </div>
            <div
              className="text-sm font-light tracking-wide"
              style={{ color: universColor }}
            >
              {actualPhilosophie}
            </div>
          </div>
        </header>

        {/* Zone centrale */}
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="max-w-7xl w-full">

            {/* Titre */}
            <div className="mb-12">
              <h1 className="relative inline-block">
                <span
                  className="block font-bold tracking-tight leading-none text-white"
                  style={{
                    fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                    letterSpacing: '-0.02em',
                    textShadow: `0 20px 60px ${universColor}30`,
                  }}
                >
                  {universName.length > 10 ? (
                    <span style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                      {universName}
                    </span>
                  ) : (
                    universName
                  )}
                </span>

                {/* Ligne d'accent */}
                <div
                  className="absolute -bottom-6 left-0 h-[2px] transition-all duration-700"
                  style={{
                    width: isHovered ? '100%' : '60px',
                    background: `linear-gradient(90deg, ${universColor} 0%, ${universColor}00 100%)`
                  }}
                />
              </h1>
            </div>

            {/* Description */}
            <p className="max-w-3xl text-lg lg:text-xl text-white/80 leading-relaxed mb-12">
              {actualDescription}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 lg:gap-16 mb-12">
              <div className="space-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-white">
                  {defaultStats.articles}
                </div>
                <div className="text-sm text-white/60">Articles</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-white">
                  {defaultStats.auteurs}
                </div>
                <div className="text-sm text-white/60">Auteurs</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-white">
                  {defaultStats.tempsTotal}
                </div>
                <div className="text-sm text-white/60">De lecture</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <button
                className="group px-8 py-4 bg-white text-gray-900 font-medium rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  boxShadow: `0 10px 30px ${universColor}30`
                }}
              >
                Commencer l'exploration
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-end">
          <div className="flex items-center gap-8">
            <div className="text-white/40 text-sm">
              Scroll pour explorer
            </div>
          </div>

          {/* Indicateurs de section */}
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-[2px] transition-all duration-300"
                style={{
                  backgroundColor: i === 0 ? universColor : 'rgba(255,255,255,0.2)'
                }}
              />
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ActeManifeste;
