import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ExternalLink, Sparkles, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import EngagementSection from '../components/EngagementSection';

const UniversPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  // Données complètes des 10 univers
  const tousLesUnivers = [
    {
      id: 'psychologie',
      nom: 'PSYCHOLOGIE',
      color: '#4299E1',
      description: 'Outiller et inspirer pour mieux se comprendre et grandir',
      imageUrl: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg',
      articleCount: 127,
      isPopular: true
    },
    {
      id: 'societe',
      nom: 'SOCIÉTÉ',
      color: '#ED8936',
      description: 'Explorer les changements sociaux, la diversité et les tabous',
      imageUrl: 'https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg',
      articleCount: 98,
      isPopular: true
    },
    {
      id: 'carriere',
      nom: 'CARRIÈRE',
      color: '#4A5568',
      description: 'Parcours professionnels, reconversions et équilibre de vie',
      imageUrl: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg',
      articleCount: 156,
      isPopular: true
    },
    {
      id: 'voyage',
      nom: 'VOYAGE',
      color: '#48BB78',
      description: 'Quêtes identitaires et expériences transformatrices',
      imageUrl: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg',
      articleCount: 89,
      isPopular: false
    },
    {
      id: 'art-creativite',
      nom: 'ART & CRÉATIVITÉ',
      color: '#9F7AEA',
      description: 'L\'art comme levier de résilience et de changement',
      imageUrl: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg',
      articleCount: 134,
      isPopular: true
    },
    {
      id: 'spiritualite',
      nom: 'SPIRITUALITÉ',
      color: '#805AD5',
      description: 'Nourrir la recherche de sens et la connexion intérieure',
      imageUrl: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg',
      articleCount: 112,
      isPopular: false
    },
    {
      id: 'sante',
      nom: 'SANTÉ',
      color: '#38B2AC',
      description: 'Aborder bien-être physique, mental et émotionnel',
      imageUrl: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg',
      articleCount: 143,
      isPopular: true
    },
    {
      id: 'technologie',
      nom: 'TECHNOLOGIE',
      color: '#3182CE',
      description: 'Questionner l\'impact sociotechnique et valoriser l\'innovation',
      imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      articleCount: 87,
      isPopular: false
    },
    {
      id: 'relations',
      nom: 'RELATIONS',
      color: '#E53E3E',
      description: 'Décrypter dynamiques familiales et défis relationnels',
      imageUrl: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
      articleCount: 165,
      isPopular: true
    },
    {
      id: 'environnement',
      nom: 'ENVIRONNEMENT',
      color: '#38A169',
      description: 'Initiatives positives et consommation consciente',
      imageUrl: 'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg',
      articleCount: 121,
      isPopular: true
    }
  ];

  // ✅ NOUVELLE FONCTION : Déterminer la taille de police adaptée
  const getTitleSizeClass = (nom: string) => {
    const length = nom.length;
    if (length > 12) {
      // Très longs (ENVIRONNEMENT, ART & CRÉATIVITÉ)
      return 'text-lg lg:text-xl xl:text-2xl';
    } else if (length > 10) {
      // Longs (PSYCHOLOGIE, TECHNOLOGIE, SPIRITUALITÉ)
      return 'text-xl lg:text-2xl xl:text-3xl';
    } else {
      // Courts (VOYAGE, SOCIÉTÉ, etc.)
      return 'text-2xl lg:text-3xl xl:text-4xl';
    }
  };

  // ✅ NOUVELLE FONCTION : Gérer les retours à la ligne intelligents
  const formatTitle = (nom: string) => {
    // Cas spéciaux pour les titres longs
    const specialCases: { [key: string]: string } = {
      'ART & CRÉATIVITÉ': 'ART &\nCRÉATIVITÉ',
      'ENVIRONNEMENT': 'ENVIRON-\nNEMENT',
      'SPIRITUALITÉ': 'SPIRITUA-\nLITÉ',
      'TECHNOLOGIE': 'TECHNO-\nLOGIE',
      'PSYCHOLOGIE': 'PSYCHO-\nLOGIE'
    };

    return specialCases[nom] || nom;
  };

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
    tousLesUnivers.forEach((univers) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, univers.id]));
      };
      img.src = univers.imageUrl;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen md:ml-[280px]">
        
        {/* Hero Section */}
        <section 
          ref={sectionRef}
          className="relative bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 px-8 lg:px-16 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5CF6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Header Content */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <span className="font-inter text-violet-400 text-sm tracking-[0.2em] uppercase">
                Nos Univers
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            </div>
            
            <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
              Explorer nos
              <br />
              <span className="gradient-text-animated">10 Univers</span>
            </h1>
            
            <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Plongez dans les grandes thématiques qui façonnent nos récits et découvrez l'univers qui vous inspire
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-violet-400 mb-2">10</div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">Univers</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-fuchsia-400 mb-2">1,232</div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">Contenus</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="font-montserrat font-bold text-3xl text-emerald-400 mb-2">2.1M</div>
                <div className="font-inter text-white/60 text-sm uppercase tracking-wider">Lectures</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Grille des Univers - 2 rangées de 5 */}
        <section className="py-20 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]">
          <div className="max-w-7xl mx-auto">
            
            {/* Première rangée - 5 univers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
              {tousLesUnivers.slice(0, 5).map((univers, index) => (
                <div
                  key={univers.id}
                  className={`
                    group relative overflow-hidden rounded-3xl cursor-pointer
                    h-[400px] lg:h-[450px] transform transition-all duration-700 hover:scale-[1.03] hover:z-10
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                  `}
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                  onMouseEnter={() => setHoveredCard(univers.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.open(`/univers/${univers.id}`, '_blank')}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {loadedImages.has(univers.id) ? (
                      <div
                        className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
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
                      {/* ✅ TITRE CORRIGÉ : Taille adaptative + Retours à la ligne intelligents */}
                      <h3 
                        className={`
                          font-montserrat font-bold text-white mb-4 leading-tight transition-all duration-500
                          ${getTitleSizeClass(univers.nom)}
                        `}
                        style={{
                          color: hoveredCard === univers.id ? univers.color : 'white',
                          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                          lineHeight: '1.1'
                        }}
                      >
                        {formatTitle(univers.nom).split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < formatTitle(univers.nom).split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h3>

                      {/* Description - Ajustée pour les titres plus longs */}
                      <p className="font-inter text-white/90 text-sm leading-relaxed mb-4 line-clamp-2">
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

            {/* Deuxième rangée - 5 univers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {tousLesUnivers.slice(5, 10).map((univers, index) => (
                <div
                  key={univers.id}
                  className={`
                    group relative overflow-hidden rounded-3xl cursor-pointer
                    h-[400px] lg:h-[450px] transform transition-all duration-700 hover:scale-[1.03] hover:z-10
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                  `}
                  style={{
                    transitionDelay: `${(index + 5) * 150}ms`,
                  }}
                  onMouseEnter={() => setHoveredCard(univers.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => window.open(`/univers/${univers.id}`, '_blank')}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {loadedImages.has(univers.id) ? (
                      <div
                        className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
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
                      {/* ✅ TITRE CORRIGÉ : Taille adaptative + Retours à la ligne intelligents */}
                      <h3 
                        className={`
                          font-montserrat font-bold text-white mb-4 leading-tight transition-all duration-500
                          ${getTitleSizeClass(univers.nom)}
                        `}
                        style={{
                          color: hoveredCard === univers.id ? univers.color : 'white',
                          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                          lineHeight: '1.1'
                        }}
                      >
                        {formatTitle(univers.nom).split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < formatTitle(univers.nom).split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h3>

                      {/* Description - Ajustée pour les titres plus longs */}
                      <p className="font-inter text-white/90 text-sm leading-relaxed mb-4 line-clamp-2">
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
        </section>

        {/* Section Kit d'Introspection */}
        <EngagementSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UniversPage;