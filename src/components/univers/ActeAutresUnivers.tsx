import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ActeAutresUniversProps {
  universId: string;
  universName: string;
  universColor: string;
}

const ActeAutresUnivers: React.FC<ActeAutresUniversProps> = ({ 
  universId, 
  universName, 
  universColor 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const sectionRef = useRef<HTMLElement>(null);

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

  // Données simplifiées des univers
  const tousLesUnivers = {
    'psychologie': {
      id: 'psychologie',
      nom: 'Psychologie',
      color: '#4299E1',
      description: 'Comprendre l\'esprit humain'
    },
    'societe': {
      id: 'societe',
      nom: 'Société',
      color: '#ED8936',
      description: 'Explorer les dynamiques sociales'
    },
    'carriere': {
      id: 'carriere',
      nom: 'Carrière',
      color: '#4A5568',
      description: 'Développer son parcours professionnel'
    },
    'voyage': {
      id: 'voyage',
      nom: 'Voyage',
      color: '#48BB78',
      description: 'Découvrir le monde et soi-même'
    },
    'art-creativite': {
      id: 'art-creativite',
      nom: 'Art & Créativité',
      color: '#9F7AEA',
      description: 'Libérer son potentiel créatif'
    },
    'spiritualite': {
      id: 'spiritualite',
      nom: 'Spiritualité',
      color: '#805AD5',
      description: 'Nourrir son âme'
    },
    'sante': {
      id: 'sante',
      nom: 'Santé',
      color: '#38B2AC',
      description: 'Cultiver le bien-être'
    },
    'technologie': {
      id: 'technologie',
      nom: 'Technologie',
      color: '#3182CE',
      description: 'Comprendre le monde digital'
    },
    'relations': {
      id: 'relations',
      nom: 'Relations',
      color: '#E53E3E',
      description: 'Créer des liens authentiques'
    },
    'environnement': {
      id: 'environnement',
      nom: 'Environnement',
      color: '#38A169',
      description: 'Vivre de manière durable'
    }
  };

  // Suggestions intelligentes - 4 univers par défaut
  const suggestionsPourUnivers = {
    'psychologie': ['relations', 'spiritualite', 'sante', 'carriere'],
    'societe': ['relations', 'environnement', 'technologie', 'art-creativite'],
    'carriere': ['psychologie', 'relations', 'technologie', 'sante'],
    'voyage': ['spiritualite', 'art-creativite', 'environnement', 'psychologie'],
    'art-creativite': ['psychologie', 'spiritualite', 'voyage', 'societe'],
    'spiritualite': ['psychologie', 'sante', 'voyage', 'art-creativite'],
    'sante': ['psychologie', 'spiritualite', 'relations', 'environnement'],
    'technologie': ['societe', 'carriere', 'environnement', 'psychologie'],
    'relations': ['psychologie', 'societe', 'sante', 'spiritualite'],
    'environnement': ['societe', 'sante', 'voyage', 'spiritualite']
  };

  const suggestionsIds = suggestionsPourUnivers[universId as keyof typeof suggestionsPourUnivers] || ['psychologie', 'societe', 'carriere', 'voyage'];
  const autresUnivers = suggestionsIds.map(id => tousLesUnivers[id as keyof typeof tousLesUnivers]).filter(Boolean);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-black py-24 lg:py-32 overflow-hidden"
    >
      {/* Fond subtil */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950" />
        
        {/* Effet de lumière douce */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-5"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translate(${(mousePos.x - 0.5) * 50}px, ${(mousePos.y - 0.5) * 50}px)`,
            background: `radial-gradient(circle, ${universColor}40 0%, transparent 70%)`,
            filter: 'blur(100px)',
            transition: 'transform 2s cubic-bezier(0.33, 1, 0.68, 1)'
          }}
        />
      </div>

      <div className="relative z-10 px-6 lg:px-12 xl:px-16">
        {/* Header de section */}
        <div className={`max-w-7xl mx-auto mb-20 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="space-y-6">
            {/* Indicateur */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-[1px] bg-white/30" />
              <span className="text-white/50 text-xs font-light tracking-[0.2em] uppercase">
                Continuez l'exploration
              </span>
              <div className="w-8 h-[1px] bg-white/30" />
            </div>
            
            {/* Titre */}
            <h2 className="font-bold text-5xl lg:text-6xl xl:text-7xl text-white leading-none">
              Autres
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
                univers
              </span>
            </h2>
            
            {/* Description */}
            <p className="text-lg lg:text-xl text-white/60 max-w-2xl mx-auto font-light">
              Explorez d'autres thématiques qui pourraient vous intéresser.
            </p>
          </div>
        </div>

        {/* Grille d'univers - 4 cartes */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {autresUnivers.map((univers, index) => (
              <article
                key={univers.id}
                className={`group relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                onMouseEnter={() => setHoveredCard(univers.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <a 
                  href={`/univers/${univers.id}`}
                  className="block relative p-6 lg:p-8 rounded-2xl bg-gradient-to-b from-gray-900/30 to-gray-900/50 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-500 h-full min-h-[280px]"
                >
                  {/* Fond coloré au hover */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${univers.color}10 0%, transparent 70%)`
                    }}
                  />
                  
                  {/* Contenu */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Indicateur coloré */}
                    <div 
                      className="w-12 h-1 rounded-full mb-6 transition-all duration-500"
                      style={{
                        backgroundColor: univers.color,
                        width: hoveredCard === univers.id ? '48px' : '24px'
                      }}
                    />
                    
                    {/* Titre - Gérer les mots longs */}
                    <h3 
                      className={`font-bold mb-4 transition-all duration-500 ${
                        univers.nom.length > 12 ? 'text-2xl' : 'text-3xl lg:text-4xl'
                      }`}
                      style={{
                        color: hoveredCard === univers.id ? univers.color : 'white',
                        wordBreak: 'break-word',
                        hyphens: 'auto'
                      }}
                    >
                      {univers.nom}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/60 text-sm lg:text-base mb-6 flex-grow line-clamp-2">
                      {univers.description}
                    </p>
                    
                    {/* CTA */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-white/80 text-sm font-medium">
                        Explorer
                      </span>
                      
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
                        style={{
                          backgroundColor: hoveredCard === univers.id 
                            ? univers.color 
                            : 'rgba(255,255,255,0.05)',
                          transform: hoveredCard === univers.id 
                            ? 'scale(1.1)' 
                            : 'scale(1)'
                        }}
                      >
                        <ArrowRight 
                          className="w-5 h-5 text-white transition-transform duration-500"
                          style={{
                            transform: hoveredCard === univers.id 
                              ? 'translateX(2px)' 
                              : 'translateX(0)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Bordure au hover */}
                  <div 
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
                    style={{
                      boxShadow: hoveredCard === univers.id 
                        ? `inset 0 0 0 1px ${univers.color}40` 
                        : 'none'
                    }}
                  />
                </a>
              </article>
            ))}
          </div>
        </div>

        {/* Message de conclusion */}
        <div className={`text-center mt-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Vous avez exploré l'univers <span style={{ color: universColor }} className="font-medium">{universName}</span>. 
            Continuez votre voyage à travers nos autres thématiques.
          </p>
          
          {/* CTA principal */}
          <a
            href="/univers"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium rounded-lg transition-all duration-300 hover:scale-105 group"
          >
            <Sparkles className="w-5 h-5" />
            Voir tous les univers
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ActeAutresUnivers;