import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ExternalLink, Sparkles, TrendingUp } from 'lucide-react';

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
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
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

  // Données complètes de TOUS les univers avec images et suggestions intelligentes
  const tousLesUnivers = {
    'psychologie': {
      id: 'psychologie',
      nom: 'PSYCHOLOGIE',
      color: '#4299E1',
      description: 'Outiller et inspirer pour mieux se comprendre et grandir',
      imageUrl: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg',
      articleCount: 127,
      isPopular: true
    },
    'societe': {
      id: 'societe',
      nom: 'SOCIÉTÉ',
      color: '#ED8936',
      description: 'Explorer les changements sociaux, la diversité et les tabous',
      imageUrl: 'https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg',
      articleCount: 98,
      isPopular: true
    },
    'carriere': {
      id: 'carriere',
      nom: 'CARRIÈRE',
      color: '#4A5568',
      description: 'Parcours professionnels, reconversions et équilibre de vie',
      imageUrl: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
      articleCount: 156,
      isPopular: true
    },
    'voyage': {
      id: 'voyage',
      nom: 'VOYAGE',
      color: '#48BB78',
      description: 'Quêtes identitaires et expériences transformatrices',
      imageUrl: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg',
      articleCount: 89,
      isPopular: false
    },
    'art-creativite': {
      id: 'art-creativite',
      nom: 'ART & CRÉATIVITÉ',
      color: '#9F7AEA',
      description: 'L\'art comme levier de résilience et de changement',
      imageUrl: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg',
      articleCount: 134,
      isPopular: true
    },
    'spiritualite': {
      id: 'spiritualite',
      nom: 'SPIRITUALITÉ',
      color: '#805AD5',
      description: 'Nourrir la recherche de sens et la connexion intérieure',
      imageUrl: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
      articleCount: 112,
      isPopular: false
    },
    'sante': {
      id: 'sante',
      nom: 'SANTÉ',
      color: '#38B2AC',
      description: 'Aborder bien-être physique, mental et émotionnel',
      imageUrl: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg',
      articleCount: 143,
      isPopular: true
    },
    'technologie': {
      id: 'technologie',
      nom: 'TECHNOLOGIE',
      color: '#3182CE',
      description: 'Questionner l\'impact sociotechnique et valoriser l\'innovation',
      imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      articleCount: 87,
      isPopular: false
    },
    'relations': {
      id: 'relations',
      nom: 'RELATIONS',
      color: '#E53E3E',
      description: 'Décrypter dynamiques familiales et défis relationnels',
      imageUrl: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      articleCount: 165,
      isPopular: true
    },
    'environnement': {
      id: 'environnement',
      nom: 'ENVIRONNEMENT',
      color: '#38A169',
      description: 'Initiatives positives et consommation consciente', // ✅ TEXTE RACCOURCI
      imageUrl: 'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg',
      articleCount: 121,
      isPopular: true
    }
  };

  // Suggestions intelligentes basées sur l'univers actuel
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

  // Obtenir les suggestions pour l'univers actuel
  const suggestionsIds = suggestionsPourUnivers[universId as keyof typeof suggestionsPourUnivers] || ['psychologie', 'societe', 'carriere', 'voyage'];
  const autresUnivers = suggestionsIds.map(id => tousLesUnivers[id as keyof typeof tousLesUnivers]).filter(Boolean);

  // Preload images
  useEffect(() => {
    autresUnivers.forEach((univers) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, univers.id]));
      };
      img.src = univers.imageUrl;
    });
  }, [autresUnivers]);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 px-8 lg:px-16 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(universColor)}' fill-opacity='0.1'%3E%3Cpath d='M60 60L30 30v60l30-30zm0 0l30 30V30L60 60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} 
        />
      </div>

      {/* Section Header */}
      <div className={`text-center mb-16 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="inline-flex items-center gap-4 mb-6">
          <div 
            className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
          <span 
            className="font-inter text-sm tracking-[0.2em] uppercase"
            style={{ color: universColor }}
          >
            Acte 5
          </span>
          <div 
            className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
        </div>
        
        <h2 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
          Découvrez
          <br />
          <span 
            className="gradient-text-animated"
            style={{
              background: `linear-gradient(-45deg, ${universColor}, #EC4899, #F59E0B, ${universColor})`,
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 3s ease infinite'
            }}
          >
            d'Autres Univers
          </span>
        </h2>
        
        <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Explorez nos autres univers thématiques et élargissez vos horizons narratifs
        </p>
      </div>

      {/* Grid d'Autres Univers - DESIGN PREMIUM */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {autresUnivers.map((univers, index) => (
            <div
              key={univers.id}
              className={`
                group relative overflow-hidden rounded-3xl cursor-pointer
                h-[400px] lg:h-[450px] transform transition-all duration-700 hover:scale-[1.03] hover:z-10
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
              `}
              style={{
                transitionDelay: `${index * 150 + 300}ms`,
              }}
              onMouseEnter={() => setHoveredCard(univers.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => window.open(`/univers/${univers.id}`, '_blank')}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                {loadedImages.has(univers.id) ? (
                  <div
                    className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${univers.imageUrl})`,
                      filter: hoveredCard === univers.id 
                        ? 'brightness(0.4) contrast(1.3) saturate(1.2)' 
                        : 'brightness(0.6) contrast(1.1) saturate(1.1)'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                )}
                
                {/* Film Grain Texture */}
                <div 
                  className="absolute inset-0 film-grain-texture opacity-15 mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                    backgroundSize: '256px 256px'
                  }}
                />

                {/* Strategic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
                
                {/* Dynamic Color Overlay */}
                <div 
                  className="absolute inset-0 mix-blend-overlay transition-all duration-500"
                  style={{
                    background: `radial-gradient(circle at 30% 70%, ${univers.color}15 0%, transparent 50%)`,
                    opacity: hoveredCard === univers.id ? 0.8 : 0.4
                  }}
                />
              </div>

              {/* Badges - Top */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                {/* Popular Badge */}
                {univers.isPopular && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-400/50 rounded-full backdrop-blur-md">
                    <TrendingUp className="w-3 h-3 text-amber-400" />
                    <span className="font-inter text-amber-300 text-xs font-bold tracking-wider uppercase">
                      Populaire
                    </span>
                  </div>
                )}

                {/* External Link Icon - Appears on Hover */}
                <div 
                  className={`
                    w-10 h-10 rounded-full backdrop-blur-md border border-white/20 
                    flex items-center justify-center transition-all duration-500
                    ${hoveredCard === univers.id 
                      ? 'opacity-100 scale-110 bg-white/10' 
                      : 'opacity-0 scale-90'
                    }
                  `}
                >
                  <ExternalLink className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 z-20">
                
                {/* Spacer for top badges */}
                <div className="h-12" />

                {/* Bottom Content */}
                <div>
                  {/* Titre avec couleur dynamique - TAILLE RÉDUITE POUR ENVIRONNEMENT */}
                  <h3 
                    className={`
                      font-montserrat font-bold text-white mb-4 leading-tight transition-all duration-500
                      ${univers.id === 'environnement' 
                        ? 'text-xl lg:text-2xl' // ✅ TAILLE PLUS PETITE pour ENVIRONNEMENT
                        : 'text-2xl lg:text-3xl' // Taille normale pour les autres
                      }
                    `}
                    style={{
                      color: hoveredCard === univers.id ? univers.color : 'white',
                      textShadow: '0 4px 20px rgba(0,0,0,0.8)'
                    }}
                  >
                    {univers.nom}
                  </h3>

                  {/* Description - AVEC CONTRÔLE DE TAILLE RENFORCÉ */}
                  <p className="font-inter text-white/90 text-sm leading-relaxed mb-6 line-clamp-2 max-h-12 overflow-hidden">
                    {univers.description}
                  </p>

                  {/* Stats & CTA Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      {/* Article Count */}
                      <div className="flex items-center gap-2 text-white/70 text-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>{univers.articleCount} contenus</span>
                      </div>
                      
                      <span className="font-inter text-white/90 text-xs tracking-wide uppercase font-medium">
                        Explorer l'univers
                      </span>
                    </div>

                    {/* CTA Arrow */}
                    <div 
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center 
                        transition-all duration-500 backdrop-blur-md border
                        ${hoveredCard === univers.id 
                          ? 'scale-110 shadow-lg' 
                          : 'scale-100'
                        }
                      `}
                      style={{
                        backgroundColor: hoveredCard === univers.id ? `${univers.color}40` : `${univers.color}20`,
                        borderColor: hoveredCard === univers.id ? `${univers.color}60` : `${univers.color}30`,
                        boxShadow: hoveredCard === univers.id ? `0 12px 30px ${univers.color}40` : 'none'
                      }}
                    >
                      <ArrowRight 
                        className={`w-5 h-5 transition-all duration-500 ${
                          hoveredCard === univers.id ? 'translate-x-1' : ''
                        }`}
                        style={{ color: hoveredCard === univers.id ? univers.color : 'white' }}
                      />
                    </div>
                  </div>

                  {/* Decorative Line avec couleur dynamique */}
                  <div 
                    className={`
                      h-1 mt-4 rounded-full transition-all duration-500
                      ${hoveredCard === univers.id ? 'w-20' : 'w-10'}
                    `}
                    style={{
                      background: `linear-gradient(90deg, ${univers.color}, ${univers.color}80)`,
                      boxShadow: hoveredCard === univers.id ? `0 0 20px ${univers.color}60` : 'none'
                    }}
                  />
                </div>
              </div>

              {/* Hover Glow Effect avec couleur dynamique */}
              <div 
                className={`
                  absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none
                  ${hoveredCard === univers.id ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                  boxShadow: hoveredCard === univers.id ? `0 25px 60px ${univers.color}30` : 'none',
                  border: hoveredCard === univers.id ? `1px solid ${univers.color}40` : 'none'
                }}
              />

              {/* Premium Border Animation */}
              <div 
                className={`
                  absolute inset-0 rounded-3xl border-2 transition-all duration-500 pointer-events-none
                  ${hoveredCard === univers.id ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                  borderColor: hoveredCard === univers.id ? `${univers.color}50` : 'transparent',
                  background: hoveredCard === univers.id 
                    ? `linear-gradient(135deg, ${univers.color}05 0%, transparent 50%, ${univers.color}05 100%)` 
                    : 'transparent'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA - SPECTACULAIRE */}
      <div className={`text-center mt-20 transform transition-all duration-1000 delay-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="max-w-4xl mx-auto">
          {/* Message personnalisé */}
          <p className="font-inter text-white/80 text-lg leading-relaxed mb-8">
            Vous avez exploré <strong style={{ color: universColor }}>{universName}</strong>. 
            Continuez votre voyage à travers nos autres univers narratifs.
          </p>

          {/* CTA Principal */}
          <a
            href="/univers"
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-inter font-bold tracking-widest uppercase text-sm rounded-xl transition-all duration-500 hover:from-violet-500 hover:to-fuchsia-500 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/25 overflow-hidden"
          >
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Explorer tous nos univers</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
            </div>
          </a>

          {/* Secondary CTA */}
          <div className="mt-6">
            <a
              href="/"
              className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 text-white/80 font-inter font-medium tracking-wider uppercase text-xs rounded-full hover:border-white/40 hover:bg-white/5 hover:text-white transition-all duration-500 backdrop-blur-sm"
            >
              <span>Retour à l'accueil</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActeAutresUnivers;