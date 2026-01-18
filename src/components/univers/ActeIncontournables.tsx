// src/components/univers/ActeIncontournables.tsx
// Design épuré - Style minimaliste blanc

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

  // Données par défaut
  const defaultProductionsByUnivers: { [key: string]: Production[] } = {
    'psychologie': [
      {
        id: "p-psy-01",
        titre: "Comprendre et Apprivoiser son Anxiété",
        imageUrl: "/placeholder.svg",
        url: "/recit/comprendre-anxiete"
      },
      {
        id: "p-psy-02",
        titre: "L'Art de la Résilience Émotionnelle",
        imageUrl: "/placeholder.svg",
        url: "/recit/resilience-emotionnelle"
      },
      {
        id: "p-psy-03",
        titre: "Développer sa Confiance en Soi",
        imageUrl: "/placeholder.svg",
        url: "/recit/confiance-en-soi"
      }
    ],
    'societe': [
      {
        id: "p-soc-01",
        titre: "Les Nouveaux Codes de la Société Moderne",
        imageUrl: "/placeholder.svg",
        url: "/recit/nouveaux-codes-societe"
      },
      {
        id: "p-soc-02",
        titre: "Diversité et Inclusion : Au-delà des Mots",
        imageUrl: "/placeholder.svg",
        url: "/recit/diversite-inclusion"
      },
      {
        id: "p-soc-03",
        titre: "Briser les Tabous de Notre Époque",
        imageUrl: "/placeholder.svg",
        url: "/recit/briser-tabous"
      }
    ],
    'carriere': [
      {
        id: "p-car-01",
        titre: "Réussir sa Reconversion Professionnelle",
        imageUrl: "/placeholder.svg",
        url: "/recit/reconversion-professionnelle"
      },
      {
        id: "p-car-02",
        titre: "L'Équilibre Vie Pro / Vie Perso",
        imageUrl: "/placeholder.svg",
        url: "/recit/equilibre-vie-pro"
      },
      {
        id: "p-car-03",
        titre: "Entrepreneuriat : De l'Idée au Succès",
        imageUrl: "/placeholder.svg",
        url: "/recit/entrepreneuriat-succes"
      }
    ],
    'voyage': [
      {
        id: "p-voy-01",
        titre: "Voyager Seul : Guide de l'Aventure Intérieure",
        imageUrl: "/placeholder.svg",
        url: "/recit/voyage-solitaire"
      },
      {
        id: "p-voy-02",
        titre: "Nomadisme Numérique : Liberté ou Illusion ?",
        imageUrl: "/placeholder.svg",
        url: "/recit/nomadisme-numerique"
      },
      {
        id: "p-voy-03",
        titre: "Les Leçons du Voyage Lent",
        imageUrl: "/placeholder.svg",
        url: "/recit/voyage-lent"
      }
    ],
    'art-creativite': [
      {
        id: "p-art-01",
        titre: "L'Art comme Thérapie et Transformation",
        imageUrl: "/placeholder.svg",
        url: "/recit/art-therapie"
      },
      {
        id: "p-art-02",
        titre: "Créativité et Intelligence Artificielle",
        imageUrl: "/placeholder.svg",
        url: "/recit/creativite-ia"
      },
      {
        id: "p-art-03",
        titre: "Vaincre le Syndrome de la Page Blanche",
        imageUrl: "/placeholder.svg",
        url: "/recit/syndrome-page-blanche"
      }
    ],
    'spiritualite': [
      {
        id: "p-spi-01",
        titre: "Méditation et Neurosciences : Ce que Dit la Science",
        imageUrl: "/placeholder.svg",
        url: "/recit/meditation-neurosciences"
      },
      {
        id: "p-spi-02",
        titre: "Trouver le Silence dans un Monde Bruyant",
        imageUrl: "/placeholder.svg",
        url: "/recit/trouver-silence"
      },
      {
        id: "p-spi-03",
        titre: "Rituels Modernes pour une Vie Consciente",
        imageUrl: "/placeholder.svg",
        url: "/recit/rituels-modernes"
      }
    ],
    'sante': [
      {
        id: "p-san-01",
        titre: "L'Alimentation Intuitive : Écouter son Corps",
        imageUrl: "/placeholder.svg",
        url: "/recit/alimentation-intuitive"
      },
      {
        id: "p-san-02",
        titre: "Sport et Santé Mentale : Le Duo Gagnant",
        imageUrl: "/placeholder.svg",
        url: "/recit/sport-sante-mentale"
      },
      {
        id: "p-san-03",
        titre: "Sommeil : Retrouver un Rythme Naturel",
        imageUrl: "/placeholder.svg",
        url: "/recit/sommeil-naturel"
      }
    ],
    'technologie': [
      {
        id: "p-tech-01",
        titre: "Intelligence Artificielle et Créativité Humaine",
        imageUrl: "/placeholder.svg",
        url: "/recit/ia-creativite"
      },
      {
        id: "p-tech-02",
        titre: "Déconnexion Digitale : Retrouver l'Équilibre",
        imageUrl: "/placeholder.svg",
        url: "/recit/deconnexion-digitale"
      },
      {
        id: "p-tech-03",
        titre: "Le Futur du Travail à l'Ère Numérique",
        imageUrl: "/placeholder.svg",
        url: "/recit/futur-travail"
      }
    ],
    'relations': [
      {
        id: "p-rel-01",
        titre: "Communication Non-Violente : Transformer les Conflits",
        imageUrl: "/placeholder.svg",
        url: "/recit/communication-non-violente"
      },
      {
        id: "p-rel-02",
        titre: "L'Amitié à l'Âge Adulte : Cultiver les Liens",
        imageUrl: "/placeholder.svg",
        url: "/recit/amitie-adulte"
      },
      {
        id: "p-rel-03",
        titre: "Couple et Épanouissement Personnel",
        imageUrl: "/placeholder.svg",
        url: "/recit/couple-epanouissement"
      }
    ],
    'environnement': [
      {
        id: "p-env-01",
        titre: "Minimalisme : Moins pour Vivre Mieux",
        imageUrl: "/placeholder.svg",
        url: "/recit/minimalisme"
      },
      {
        id: "p-env-02",
        titre: "Permaculture Urbaine : Cultiver en Ville",
        imageUrl: "/placeholder.svg",
        url: "/recit/permaculture-urbaine"
      },
      {
        id: "p-env-03",
        titre: "Consommation Consciente : Choisir avec Intention",
        imageUrl: "/placeholder.svg",
        url: "/recit/consommation-consciente"
      }
    ]
  };

  const currentProductions = productions || defaultProductionsByUnivers[universId] || [];

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

  const productionsToShow = [...currentProductions];
  while (productionsToShow.length < 9 && productionsToShow.length > 0) {
    const originalLength = currentProductions.length;
    const indexToCopy = productionsToShow.length % originalLength;
    productionsToShow.push({
      ...currentProductions[indexToCopy],
      id: `${currentProductions[indexToCopy].id}-copy-${productionsToShow.length}`
    });
  }

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-white py-20 px-8 lg:px-16 relative overflow-hidden"
    >
      {/* Background Pattern subtil */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(universColor)}' fill-opacity='0.03'%3E%3Cpath d='M20 20L10 10v20l10-10zm0 0l10 10V10L20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Section Header */}
      <div className={`text-center mb-16 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="inline-flex items-center gap-4 mb-6">
          <div
            className="w-12 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
          <span
            className="text-sm tracking-[0.2em] uppercase font-medium"
            style={{ color: universColor }}
          >
            Acte 2
          </span>
          <div
            className="w-12 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
        </div>

        <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-gray-900 mb-6 leading-[0.9]">
          Les
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${universColor}, #EC4899)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Incontournables
          </span>
        </h2>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Notre sélection des contenus essentiels pour comprendre l'univers {universName.toLowerCase()}
        </p>
      </div>

      {/* Grille */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productionsToShow.slice(0, 9).map((production, index) => (
            <div
              key={production.id}
              className={`
                group relative overflow-hidden rounded-2xl cursor-pointer
                transform transition-all duration-700 hover:scale-[1.02] hover:z-10
                bg-white border border-gray-200 hover:border-gray-300 hover:shadow-2xl
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
              `}
              style={{
                transitionDelay: `${index * 100}ms`,
                aspectRatio: '4/3'
              }}
              onMouseEnter={() => setHoveredCard(production.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => window.open(production.url, '_blank')}
            >
              {/* Image */}
              <div className="absolute inset-0">
                {loadedImages.has(production.id) ? (
                  <div
                    className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${production.imageUrl})`,
                      filter: hoveredCard === production.id
                        ? 'brightness(0.4) contrast(1.2)'
                        : 'brightness(0.6) contrast(1.1)'
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 animate-pulse" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Numéro */}
              <div className="absolute top-6 right-6 pointer-events-none z-10">
                <span
                  className="select-none transition-all duration-500 font-bold"
                  style={{
                    fontSize: 'clamp(2rem, 3vw, 3rem)',
                    opacity: hoveredCard === production.id ? 0.8 : 0.4,
                    color: hoveredCard === production.id ? universColor : 'white',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Contenu */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 z-20">
                {/* Badge */}
                <div className="flex justify-between items-start">
                  <div
                    className="px-4 py-2 rounded-full border transition-all duration-500"
                    style={{
                      backgroundColor: `${universColor}20`,
                      borderColor: `${universColor}40`,
                    }}
                  >
                    <span
                      className="font-bold text-xs tracking-wider uppercase text-white"
                    >
                      {universName}
                    </span>
                  </div>
                </div>

                {/* Icône au survol */}
                <div
                  className={`
                    absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-16 h-16 rounded-full border-2 flex items-center justify-center
                    transition-all duration-500
                    ${hoveredCard === production.id
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-75'
                    }
                  `}
                  style={{
                    backgroundColor: `${universColor}40`,
                    borderColor: `${universColor}80`,
                  }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>

                {/* Titre et CTA */}
                <div>
                  <h3 className="font-bold text-xl lg:text-2xl text-white mb-4 leading-tight">
                    {production.titre}
                  </h3>

                  <div
                    className="h-0.5 mb-4 rounded-full transition-all duration-500"
                    style={{
                      width: hoveredCard === production.id ? '100px' : '50px',
                      backgroundColor: universColor,
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-white/90 text-xs tracking-wide uppercase font-medium">
                        Lire l'article
                      </span>
                      <div className="flex items-center gap-2 text-white/60 text-xs">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{Math.floor(Math.random() * 5) + 3} min</span>
                      </div>
                    </div>

                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        transition-all duration-500 border
                        ${hoveredCard === production.id
                          ? 'scale-110'
                          : 'scale-100'
                        }
                      `}
                      style={{
                        backgroundColor: hoveredCard === production.id ? universColor : `${universColor}30`,
                        borderColor: `${universColor}60`,
                      }}
                    >
                      <ArrowRight
                        className={`w-4 h-4 text-white transition-all duration-500 ${
                          hoveredCard === production.id ? 'translate-x-1' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={`text-center mt-20 transform transition-all duration-1000 delay-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <a
          href={`/univers/${universId}/incontournables`}
          className="group inline-flex items-center gap-4 px-8 py-4 bg-white border border-gray-200 text-gray-900 font-medium tracking-wider uppercase text-sm transition-all duration-500 rounded-xl hover:scale-105 hover:shadow-lg hover:border-gray-300"
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
