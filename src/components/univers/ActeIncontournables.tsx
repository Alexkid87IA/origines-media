import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

interface Production {
  id: string;
  titre: string;
  imageUrl: string;
  url: string;
}

interface ActeIncontournablesProps {
  universId: string;
  universName: string;
  universColor: string;
  productions?: Production[];
}

const ActeIncontournables: React.FC<ActeIncontournablesProps> = ({ 
  universId, 
  universName, 
  universColor,
  productions 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Données par défaut pour chaque univers (3 productions incontournables)
  const defaultProductionsByUnivers = {
    'psychologie': [
      { 
        id: "p-psy-01", 
        titre: "Comprendre et Apprivoiser son Anxiété", 
        imageUrl: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg", 
        url: "/recit/comprendre-anxiete" 
      },
      { 
        id: "p-psy-02", 
        titre: "L'Art de la Résilience Émotionnelle", 
        imageUrl: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg", 
        url: "/recit/resilience-emotionnelle" 
      },
      { 
        id: "p-psy-03", 
        titre: "Développer sa Confiance en Soi", 
        imageUrl: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg", 
        url: "/recit/confiance-en-soi" 
      }
    ],
    'societe': [
      { 
        id: "p-soc-01", 
        titre: "Les Nouveaux Codes de la Société Moderne", 
        imageUrl: "https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg", 
        url: "/recit/nouveaux-codes-societe" 
      },
      { 
        id: "p-soc-02", 
        titre: "Diversité et Inclusion : Au-delà des Mots", 
        imageUrl: "https://images.pexels.com/photos/5083490/pexels-photo-5083490.jpeg", 
        url: "/recit/diversite-inclusion" 
      },
      { 
        id: "p-soc-03", 
        titre: "Briser les Tabous de Notre Époque", 
        imageUrl: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg", 
        url: "/recit/briser-tabous" 
      }
    ],
    'carriere': [
      { 
        id: "p-car-01", 
        titre: "Réussir sa Reconversion Professionnelle", 
        imageUrl: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg", 
        url: "/recit/reconversion-professionnelle" 
      },
      { 
        id: "p-car-02", 
        titre: "L'Équilibre Vie Pro / Vie Perso", 
        imageUrl: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg", 
        url: "/recit/equilibre-vie-pro" 
      },
      { 
        id: "p-car-03", 
        titre: "Entrepreneuriat : De l'Idée au Succès", 
        imageUrl: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg", 
        url: "/recit/entrepreneuriat-succes" 
      }
    ],
    'voyage': [
      { 
        id: "p-voy-01", 
        titre: "Voyager Seul : Guide de l'Aventure Intérieure", 
        imageUrl: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg", 
        url: "/recit/voyage-solitaire" 
      },
      { 
        id: "p-voy-02", 
        titre: "Nomadisme Numérique : Liberté ou Illusion ?", 
        imageUrl: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg", 
        url: "/recit/nomadisme-numerique" 
      },
      { 
        id: "p-voy-03", 
        titre: "Les Leçons du Voyage Lent", 
        imageUrl: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg", 
        url: "/recit/voyage-lent" 
      }
    ],
    'art-creativite': [
      { 
        id: "p-art-01", 
        titre: "L'Art comme Thérapie et Transformation", 
        imageUrl: "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg", 
        url: "/recit/art-therapie" 
      },
      { 
        id: "p-art-02", 
        titre: "Créativité et Intelligence Artificielle", 
        imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg", 
        url: "/recit/creativite-ia" 
      },
      { 
        id: "p-art-03", 
        titre: "Vaincre le Syndrome de la Page Blanche", 
        imageUrl: "https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg", 
        url: "/recit/syndrome-page-blanche" 
      }
    ],
    'spiritualite': [
      { 
        id: "p-spi-01", 
        titre: "Méditation et Neurosciences : Ce que Dit la Science", 
        imageUrl: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg", 
        url: "/recit/meditation-neurosciences" 
      },
      { 
        id: "p-spi-02", 
        titre: "Trouver le Silence dans un Monde Bruyant", 
        imageUrl: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg", 
        url: "/recit/trouver-silence" 
      },
      { 
        id: "p-spi-03", 
        titre: "Rituels Modernes pour une Vie Consciente", 
        imageUrl: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg", 
        url: "/recit/rituels-modernes" 
      }
    ],
    'sante': [
      { 
        id: "p-san-01", 
        titre: "L'Alimentation Intuitive : Écouter son Corps", 
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", 
        url: "/recit/alimentation-intuitive" 
      },
      { 
        id: "p-san-02", 
        titre: "Sport et Santé Mentale : Le Duo Gagnant", 
        imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg", 
        url: "/recit/sport-sante-mentale" 
      },
      { 
        id: "p-san-03", 
        titre: "Sommeil : Retrouver un Rythme Naturel", 
        imageUrl: "https://images.pexels.com/photos/935777/pexels-photo-935777.jpeg", 
        url: "/recit/sommeil-naturel" 
      }
    ],
    'technologie': [
      { 
        id: "p-tech-01", 
        titre: "Intelligence Artificielle et Créativité Humaine", 
        imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg", 
        url: "/recit/ia-creativite" 
      },
      { 
        id: "p-tech-02", 
        titre: "Déconnexion Digitale : Retrouver l'Équilibre", 
        imageUrl: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg", 
        url: "/recit/deconnexion-digitale" 
      },
      { 
        id: "p-tech-03", 
        titre: "Le Futur du Travail à l'Ère Numérique", 
        imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg", 
        url: "/recit/futur-travail" 
      }
    ],
    'relations': [
      { 
        id: "p-rel-01", 
        titre: "Communication Non-Violente : Transformer les Conflits", 
        imageUrl: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg", 
        url: "/recit/communication-non-violente" 
      },
      { 
        id: "p-rel-02", 
        titre: "L'Amitié à l'Âge Adulte : Cultiver les Liens", 
        imageUrl: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg", 
        url: "/recit/amitie-adulte" 
      },
      { 
        id: "p-rel-03", 
        titre: "Couple et Épanouissement Personnel", 
        imageUrl: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg", 
        url: "/recit/couple-epanouissement" 
      }
    ],
    'environnement': [
      { 
        id: "p-env-01", 
        titre: "Minimalisme : Moins pour Vivre Mieux", 
        imageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", 
        url: "/recit/minimalisme" 
      },
      { 
        id: "p-env-02", 
        titre: "Permaculture Urbaine : Cultiver en Ville", 
        imageUrl: "https://images.pexels.com/photos/2519392/pexels-photo-2519392.jpeg", 
        url: "/recit/permaculture-urbaine" 
      },
      { 
        id: "p-env-03", 
        titre: "Consommation Consciente : Choisir avec Intention", 
        imageUrl: "https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg", 
        url: "/recit/consommation-consciente" 
      }
    ]
  };

  // Utiliser les productions passées en props ou les données par défaut
  const currentProductions = productions || defaultProductionsByUnivers[universId as keyof typeof defaultProductionsByUnivers] || [];

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

  // Preload images
  useEffect(() => {
    currentProductions.forEach((production) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, production.id]));
      };
      img.src = production.imageUrl;
    });
  }, [currentProductions]);

  if (currentProductions.length === 0) {
    return null;
  }

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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(universColor)}' fill-opacity='0.1'%3E%3Cpath d='M20 20L10 10v20l10-10zm0 0l10 10V10L20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            Acte 2
          </span>
          <div 
            className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
        </div>
        
        <h2 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
          Les
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
            Incontournables
          </span>
        </h2>
        
        <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Notre sélection des contenus essentiels pour comprendre l'univers {universName.toLowerCase()}
        </p>
      </div>

      {/* Grille Asymétrique - 1 Grande + 2 Petites */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Carte HÉRO - Plus grande (6 colonnes sur desktop) */}
          <div className="lg:col-span-6">
            {currentProductions[0] && (
              <div
                className={`
                  group relative overflow-hidden rounded-3xl cursor-pointer
                  h-[600px] lg:h-[700px]
                  transform transition-all duration-700 hover:scale-[1.02] hover:z-10
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                `}
                style={{
                  transitionDelay: '300ms',
                }}
                onMouseEnter={() => setHoveredCard(currentProductions[0].id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => window.open(currentProductions[0].url, '_blank')}
              >
                {/* Image Container */}
                <div className="absolute inset-0">
                  {loadedImages.has(currentProductions[0].id) ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${currentProductions[0].imageUrl})`,
                        filter: hoveredCard === currentProductions[0].id 
                          ? 'brightness(0.3) contrast(1.3) saturate(1.2)' 
                          : 'brightness(0.5) contrast(1.2) saturate(1.1)'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                  )}
                  
                  {/* Film Grain Texture Overlay */}
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
                </div>

                {/* Large Number Watermark */}
                <div className="absolute top-8 right-8 pointer-events-none z-10">
                  <span 
                    className="font-playfair text-white select-none transition-all duration-500"
                    style={{
                      fontSize: 'clamp(6rem, 8vw, 8rem)',
                      opacity: hoveredCard === currentProductions[0].id ? 0.6 : 0.25,
                      fontWeight: 700,
                      lineHeight: 1,
                      textShadow: '0 0 30px rgba(255,255,255,0.2)',
                      color: hoveredCard === currentProductions[0].id ? universColor : 'white',
                      WebkitTextStroke: `1px ${hoveredCard === currentProductions[0].id ? universColor + '40' : 'rgba(255,255,255,0.1)'}`
                    }}
                  >
                    01
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 z-20">
                  
                  {/* Top Section - Category Badge */}
                  <div className="flex justify-between items-start">
                    <div 
                      className="px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-500"
                      style={{
                        backgroundColor: `${universColor}20`,
                        borderColor: `${universColor}40`,
                        boxShadow: hoveredCard === currentProductions[0].id ? `0 8px 25px ${universColor}30` : 'none'
                      }}
                    >
                      <span 
                        className="font-inter font-bold text-xs tracking-[0.15em] uppercase transition-colors duration-500"
                        style={{ color: hoveredCard === currentProductions[0].id ? universColor : 'white' }}
                      >
                        {universName}
                      </span>
                    </div>

                    {/* Play Icon - Appears on Hover */}
                    <div 
                      className={`
                        w-12 h-12 rounded-full backdrop-blur-md border border-white/20 
                        flex items-center justify-center transition-all duration-500
                        ${hoveredCard === currentProductions[0].id 
                          ? 'opacity-100 scale-110 bg-white/10' 
                          : 'opacity-0 scale-90'
                        }
                      `}
                    >
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Bottom Section - Title & CTA */}
                  <div>
                    {/* Title */}
                    <h3 className="font-montserrat font-bold text-3xl lg:text-4xl text-white mb-6 leading-tight">
                      {currentProductions[0].titre}
                    </h3>

                    {/* Decorative Line with Dynamic Color */}
                    <div 
                      className="h-1 mb-6 rounded-full transition-all duration-500"
                      style={{
                        width: hoveredCard === currentProductions[0].id ? '150px' : '80px',
                        background: `linear-gradient(90deg, ${universColor}, ${universColor}80)`,
                        boxShadow: hoveredCard === currentProductions[0].id ? `0 0 20px ${universColor}60` : 'none'
                      }}
                    />

                    {/* CTA Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-2">
                        <span className="font-inter text-white/90 text-sm tracking-wide uppercase font-medium">
                          Lire l'article
                        </span>
                        
                        {/* Reading Time Estimate */}
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 5) + 5} min de lecture</span>
                        </div>
                      </div>

                      <div 
                        className={`
                          w-16 h-16 rounded-full flex items-center justify-center 
                          transition-all duration-500 backdrop-blur-md border
                          ${hoveredCard === currentProductions[0].id 
                            ? 'scale-110 shadow-lg' 
                            : 'scale-100'
                          }
                        `}
                        style={{
                          backgroundColor: hoveredCard === currentProductions[0].id ? `${universColor}40` : `${universColor}20`,
                          borderColor: hoveredCard === currentProductions[0].id ? `${universColor}60` : `${universColor}30`,
                          boxShadow: hoveredCard === currentProductions[0].id ? `0 12px 30px ${universColor}40` : 'none'
                        }}
                      >
                        <ArrowRight 
                          className={`w-6 h-6 transition-all duration-500 ${
                            hoveredCard === currentProductions[0].id ? 'translate-x-1' : ''
                          }`}
                          style={{ color: hoveredCard === currentProductions[0].id ? universColor : 'white' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div 
                  className={`
                    absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none
                    ${hoveredCard === currentProductions[0].id 
                      ? 'ring-2 shadow-2xl' 
                      : ''
                    }
                  `}
                  style={{
                    ringColor: hoveredCard === currentProductions[0].id ? `${universColor}60` : 'transparent',
                    boxShadow: hoveredCard === currentProductions[0].id ? `0 25px 50px ${universColor}25` : 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Cartes Secondaires - Plus petites (3 colonnes chacune sur desktop) */}
          <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
            {currentProductions.slice(1, 3).map((production, index) => (
              <div
                key={production.id}
                className={`
                  group relative overflow-hidden rounded-3xl cursor-pointer
                  h-[400px] lg:h-[330px]
                  transform transition-all duration-700 hover:scale-[1.02] hover:z-10
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                `}
                style={{
                  transitionDelay: `${(index + 1) * 200 + 300}ms`,
                }}
                onMouseEnter={() => setHoveredCard(production.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => window.open(production.url, '_blank')}
              >
                {/* Image Container */}
                <div className="absolute inset-0">
                  {loadedImages.has(production.id) ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${production.imageUrl})`,
                        filter: hoveredCard === production.id 
                          ? 'brightness(0.3) contrast(1.3) saturate(1.2)' 
                          : 'brightness(0.5) contrast(1.2) saturate(1.1)'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                  )}
                  
                  {/* Strategic Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
                </div>

                {/* Number Watermark */}
                <div className="absolute top-6 right-6 pointer-events-none z-10">
                  <span 
                    className="font-playfair text-white select-none transition-all duration-500"
                    style={{
                      fontSize: 'clamp(3rem, 5vw, 4rem)',
                      opacity: hoveredCard === production.id ? 0.6 : 0.25,
                      fontWeight: 700,
                      lineHeight: 1,
                      textShadow: '0 0 30px rgba(255,255,255,0.2)',
                      color: hoveredCard === production.id ? universColor : 'white',
                      WebkitTextStroke: `1px ${hoveredCard === production.id ? universColor + '40' : 'rgba(255,255,255,0.1)'}`
                    }}
                  >
                    {String(index + 2).padStart(2, '0')}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 z-20">
                  
                  {/* Top Section - Category Badge */}
                  <div className="flex justify-between items-start">
                    <div 
                      className="px-3 py-1.5 rounded-full backdrop-blur-md border transition-all duration-500"
                      style={{
                        backgroundColor: `${universColor}20`,
                        borderColor: `${universColor}40`,
                        boxShadow: hoveredCard === production.id ? `0 8px 25px ${universColor}30` : 'none'
                      }}
                    >
                      <span 
                        className="font-inter font-bold text-xs tracking-[0.15em] uppercase transition-colors duration-500"
                        style={{ color: hoveredCard === production.id ? universColor : 'white' }}
                      >
                        {universName}
                      </span>
                    </div>

                    {/* Play Icon - Appears on Hover */}
                    <div 
                      className={`
                        w-10 h-10 rounded-full backdrop-blur-md border border-white/20 
                        flex items-center justify-center transition-all duration-500
                        ${hoveredCard === production.id 
                          ? 'opacity-100 scale-110 bg-white/10' 
                          : 'opacity-0 scale-90'
                        }
                      `}
                    >
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Bottom Section - Title & CTA */}
                  <div>
                    {/* Title */}
                    <h3 className="font-montserrat font-bold text-xl lg:text-2xl text-white mb-4 leading-tight">
                      {production.titre}
                    </h3>

                    {/* Decorative Line */}
                    <div 
                      className="h-0.5 mb-4 rounded-full transition-all duration-500"
                      style={{
                        width: hoveredCard === production.id ? '100px' : '50px',
                        background: `linear-gradient(90deg, ${universColor}, ${universColor}80)`,
                        boxShadow: hoveredCard === production.id ? `0 0 20px ${universColor}60` : 'none'
                      }}
                    />

                    {/* CTA Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-inter text-white/90 text-xs tracking-wide uppercase font-medium">
                          Lire l'article
                        </span>
                        
                        {/* Reading Time Estimate */}
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{Math.floor(Math.random() * 5) + 3} min</span>
                        </div>
                      </div>

                      <div 
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center 
                          transition-all duration-500 backdrop-blur-md border
                          ${hoveredCard === production.id 
                            ? 'scale-110 shadow-lg' 
                            : 'scale-100'
                          }
                        `}
                        style={{
                          backgroundColor: hoveredCard === production.id ? `${universColor}40` : `${universColor}20`,
                          borderColor: hoveredCard === production.id ? `${universColor}60` : `${universColor}30`,
                          boxShadow: hoveredCard === production.id ? `0 12px 30px ${universColor}40` : 'none'
                        }}
                      >
                        <ArrowRight 
                          className={`w-4 h-4 transition-all duration-500 ${
                            hoveredCard === production.id ? 'translate-x-1' : ''
                          }`}
                          style={{ color: hoveredCard === production.id ? universColor : 'white' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div 
                  className={`
                    absolute inset-0 rounded-3xl transition-all duration-500 pointer-events-none
                    ${hoveredCard === production.id 
                      ? 'ring-2 shadow-2xl' 
                      : ''
                    }
                  `}
                  style={{
                    ringColor: hoveredCard === production.id ? `${universColor}60` : 'transparent',
                    boxShadow: hoveredCard === production.id ? `0 25px 50px ${universColor}25` : 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className={`text-center mt-20 transform transition-all duration-1000 delay-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <a
          href={`/univers/${universId}/incontournables`}
          className="group inline-flex items-center gap-4 px-8 py-4 border text-white font-inter font-medium tracking-widest uppercase text-sm transition-all duration-500 backdrop-blur-sm rounded-full hover:scale-105"
          style={{
            borderColor: `${universColor}40`,
            backgroundColor: `${universColor}10`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${universColor}60`;
            e.currentTarget.style.backgroundColor = `${universColor}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${universColor}40`;
            e.currentTarget.style.backgroundColor = `${universColor}10`;
          }}
        >
          <span>Voir tous les incontournables</span>
          <ArrowRight 
            className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500"
            style={{ color: universColor }}
          />
        </a>
      </div>
    </section>
  );
};

export default ActeIncontournables;