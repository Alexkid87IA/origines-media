import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface SousCategorie {
  id: string;
  nom: string;
  url: string;
  iconName: string;
  description: string;
  imageUrl: string;
  articleCount: number;
  isPopular?: boolean;
}

interface ActeExplorerSujetsProps {
  universId: string;
  universName: string;
  universColor: string;
  sousCategories?: SousCategorie[];
}

const ActeExplorerSujets: React.FC<ActeExplorerSujetsProps> = ({ 
  universId, 
  universName, 
  universColor,
  sousCategories 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Données par défaut simplifiées
  const defaultSousCategories: SousCategorie[] = [
    { 
      id: "sub-01", 
      nom: "Résilience & Épreuves", 
      url: `/univers/${universId}/resilience`, 
      iconName: "Shield",
      description: "Développer sa capacité à rebondir face aux difficultés",
      imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=90",
      articleCount: 24,
      isPopular: true
    },
    { 
      id: "sub-02", 
      nom: "Confiance en soi", 
      url: `/univers/${universId}/confiance`, 
      iconName: "UserCheck",
      description: "Construire une relation saine avec soi-même",
      imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&q=90",
      articleCount: 18
    },
    { 
      id: "sub-03", 
      nom: "Intelligence Émotionnelle", 
      url: `/univers/${universId}/emotions`, 
      iconName: "Heart",
      description: "Comprendre et maîtriser ses émotions",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=90",
      articleCount: 31
    },
    { 
      id: "sub-04", 
      nom: "Habitudes & Discipline", 
      url: `/univers/${universId}/habitudes`, 
      iconName: "Target",
      description: "Créer des routines positives",
      imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=90",
      articleCount: 15
    },
    { 
      id: "sub-05", 
      nom: "Mindset & Mental", 
      url: `/univers/${universId}/mindset`, 
      iconName: "Brain",
      description: "Développer un état d'esprit de croissance",
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=90",
      articleCount: 27
    },
    { 
      id: "sub-06", 
      nom: "Thérapies & Guérison", 
      url: `/univers/${universId}/therapies`, 
      iconName: "MessageSquareHeart",
      description: "Explorer les approches thérapeutiques",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=90",
      articleCount: 12
    }
  ];

  const currentSousCategories = sousCategories || defaultSousCategories;

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Navigation du carousel
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < currentSousCategories.length - 3;

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(Math.min(currentSousCategories.length - 3, currentIndex + 1));
    }
  };

  // Helper pour récupérer l'icône
  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-black py-24 lg:py-32 overflow-hidden"
    >
      {/* Fond subtil */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        
        {/* Orbe de lumière */}
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full opacity-10"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translate(${(mousePos.x - 0.5) * 100}px, ${(mousePos.y - 0.5) * 100}px)`,
            background: `radial-gradient(circle, ${universColor}30 0%, transparent 70%)`,
            filter: 'blur(80px)',
            transition: 'transform 1.5s cubic-bezier(0.33, 1, 0.68, 1)'
          }}
        />
        
        {/* Pattern géométrique très subtil */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 100px, ${universColor}10 100px, ${universColor}10 101px)`,
          }}
        />
      </div>

      <div className="relative z-10 px-6 lg:px-12 xl:px-16">
        {/* Header de section */}
        <div className={`max-w-7xl mx-auto mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="space-y-6">
            {/* Indicateur */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-[1px] bg-white/30" />
              <span className="text-white/50 text-xs font-light tracking-[0.2em] uppercase">
                Explorer par thème
              </span>
            </div>
            
            {/* Titre */}
            <h2 className="font-bold text-5xl lg:text-6xl xl:text-7xl text-white leading-none">
              Sujets
              <br />
              <span 
                className="inline-block mt-2"
                style={{
                  background: `linear-gradient(135deg, white 0%, ${universColor} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                spécifiques
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-lg lg:text-xl text-white/60 max-w-2xl font-light">
              Explorez les différentes facettes de l'univers {universName ? universName.toLowerCase() : 'narratif'} à travers nos thématiques.
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="max-w-7xl mx-auto relative">
          {/* Navigation */}
          {currentSousCategories.length > 3 && (
            <>
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={`absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border transition-all duration-300 ${
                  canGoPrev 
                    ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:scale-110' 
                    : 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-6 h-6 text-white mx-auto" />
              </button>

              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border transition-all duration-300 ${
                  canGoNext 
                    ? 'bg-white/10 border-white/20 hover:bg-white/20 hover:scale-110' 
                    : 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-6 h-6 text-white mx-auto" />
              </button>
            </>
          )}

          {/* Cards Container */}
          <div 
            ref={containerRef}
            className="overflow-hidden"
          >
            <div 
              className="flex gap-6 transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / 3)}%)`
              }}
            >
              {currentSousCategories.map((sousCategorie, index) => {
                const IconComponent = getIconComponent(sousCategorie.iconName);
                
                return (
                  <article
                    key={sousCategorie.id}
                    className={`group flex-shrink-0 w-[calc(33.333%-16px)] transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                    onMouseEnter={() => setHoveredCard(sousCategorie.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <a 
                      href={sousCategorie.url}
                      className="block relative h-[400px] rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-b from-gray-900/50 to-gray-900/80 border border-white/10 hover:border-white/20 transition-all duration-500"
                    >
                      {/* Fond avec gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                      
                      {/* Icône centrale */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                          className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500"
                          style={{
                            backgroundColor: hoveredCard === sousCategorie.id 
                              ? `${universColor}30` 
                              : 'rgba(255,255,255,0.05)',
                            transform: hoveredCard === sousCategorie.id 
                              ? 'scale(1.2)' 
                              : 'scale(1)'
                          }}
                        >
                          <IconComponent 
                            className="w-12 h-12 transition-all duration-500"
                            style={{
                              color: hoveredCard === sousCategorie.id 
                                ? universColor 
                                : 'rgba(255,255,255,0.5)'
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Contenu */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        {/* Badge nombre d'articles */}
                        <div className="inline-flex items-center gap-2 mb-4">
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: universColor }}
                          />
                          <span className="text-white/60 text-sm">
                            {sousCategorie.articleCount} articles
                          </span>
                        </div>
                        
                        {/* Titre */}
                        <h3 className="text-2xl font-bold text-white mb-3 transition-all duration-500">
                          {sousCategorie.nom}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                          {sousCategorie.description}
                        </p>
                        
                        {/* CTA */}
                        <div className="flex items-center justify-between">
                          <span className="text-white/90 text-sm font-medium">
                            Explorer
                          </span>
                          
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                            style={{
                              backgroundColor: hoveredCard === sousCategorie.id 
                                ? universColor 
                                : 'rgba(255,255,255,0.1)',
                              transform: hoveredCard === sousCategorie.id 
                                ? 'scale(1.1)' 
                                : 'scale(1)'
                            }}
                          >
                            <ArrowRight 
                              className="w-5 h-5 text-white transition-transform duration-500"
                              style={{
                                transform: hoveredCard === sousCategorie.id 
                                  ? 'translateX(2px)' 
                                  : 'translateX(0)'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Effet de hover */}
                      <div 
                        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
                        style={{
                          boxShadow: hoveredCard === sousCategorie.id 
                            ? `inset 0 0 0 1px ${universColor}40, 0 20px 40px rgba(0,0,0,0.3)` 
                            : 'none'
                        }}
                      />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Dots de navigation */}
          {currentSousCategories.length > 3 && (
            <div className="flex justify-center gap-2 mt-12">
              {[...Array(Math.max(1, currentSousCategories.length - 2))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'w-8' : 'w-1.5'
                  }`}
                  style={{
                    backgroundColor: currentIndex === i 
                      ? universColor 
                      : 'rgba(255,255,255,0.2)'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA final */}
        <div className={`text-center mt-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <a
            href="/bibliotheque"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
          >
            Voir tous les sujets
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ActeExplorerSujets;