import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, Zap, TrendingUp, Users, Clock } from 'lucide-react';

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
      className="relative min-h-screen bg-black overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background sophistiqué */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url(${actualImageHero})`,
            transform: `scale(${isHovered ? 1.05 : 1}) translate(${(mousePos.x - 0.5) * 10}px, ${(mousePos.y - 0.5) * 10}px)`,
            filter: 'brightness(0.2) contrast(1.3)'
          }}
        />
        
        {/* Overlay gradient moderne */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        {/* Effet de lumière dynamique */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${universColor}40 0%, transparent 50%)`,
            transition: 'all 0.5s ease-out'
          }}
        />

        {/* Pattern géométrique subtil */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 100px, ${universColor} 100px, ${universColor} 101px)`,
          }}
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-6 lg:p-12 xl:p-16">
        
        {/* Header épuré */}
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[1px] bg-white/30" />
              <span className="text-white/50 text-xs font-light tracking-[0.2em] uppercase">
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
            
            {/* Titre responsive intelligent */}
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
                    // Pour les mots longs, on adapte la taille
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
            <p className="max-w-3xl text-lg lg:text-xl text-white/70 leading-relaxed mb-12">
              {actualDescription}
            </p>

            {/* Stats en ligne */}
            <div className="flex flex-wrap gap-8 lg:gap-16 mb-12">
              <div className="space-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-white">
                  {defaultStats.articles}
                </div>
                <div className="text-sm text-white/50">Articles</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-white">
                  {defaultStats.auteurs}
                </div>
                <div className="text-sm text-white/50">Auteurs</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl lg:text-4xl font-bold text-white">
                  {defaultStats.tempsTotal}
                </div>
                <div className="text-sm text-white/50">De lecture</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button 
                className="group px-8 py-4 bg-white text-black font-medium rounded-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
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

        {/* Footer minimal */}
        <footer className="flex justify-between items-end">
          <div className="flex items-center gap-8">
            <div className="text-white/30 text-sm">
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

      {/* Grain subtil */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  );
};

export default ActeManifeste;