import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Coffee, Camera, Share2, Heart, Mic, Film, RefreshCw,
  Facebook, ChevronRight, Play, Users, DollarSign
} from 'lucide-react';

const PartnershipConceptSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFlow, setActiveFlow] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Données du flux de création
  const creationFlow = [
    { step: "Post Facebook", entity: "wanted", icon: Facebook },
    { step: "Sélection histoire", entity: "both", icon: Heart },
    { step: "Live multi-plateforme", entity: "both", icon: Mic },
    { step: "Captation pro", entity: "origines", icon: Camera },
    { step: "200 contenus/mois", entity: "origines", icon: Film },
    { step: "Viralité + Revenus", entity: "both", icon: Share2 },
    { step: "Réinvestissement", entity: "wanted", icon: RefreshCw }
  ];

  // Intersection Observer
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

  // Animation du flux
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveFlow((prev) => (prev + 1) % creationFlow.length);
      }, 3000); // Ralenti de 2s à 3s pour mieux voir l'animation
      return () => clearInterval(interval);
    }
  }, [isVisible, creationFlow.length]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Background effects - simplified on mobile */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="hidden md:block absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-10 md:mb-20 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase font-medium">
              La Synergie
            </span>
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>
          
          {/* Main title with animation */}
          <h2 className="font-black text-3xl md:text-5xl lg:text-7xl uppercase tracking-tight text-white mb-2 md:mb-4 leading-none">
            <span className="inline-block gradient-text-orange text-4xl md:text-6xl lg:text-8xl">Wanted</span>
            <span className="inline-block mx-2 md:mx-4 text-3xl md:text-5xl lg:text-7xl gradient-text-fusion">×</span>
            <span className="inline-block gradient-text-purple text-4xl md:text-6xl lg:text-8xl">Origines</span>
          </h2>
          
          {/* Subtitle with better styling */}
          <p className="text-base md:text-xl lg:text-2xl text-white/70 mt-4 md:mt-6 max-w-3xl mx-auto px-4 leading-relaxed">
            Deux forces complémentaires qui créent 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 font-semibold"> le premier empire média</span> de l'entraide
          </p>
          
          {/* Animated underline */}
          <div className="mt-6 md:mt-8 flex justify-center">
            <div className="h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full animate-pulse-width" style={{ width: '120px' }} />
          </div>
        </div>

        {/* Ce que chacun apporte */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-24 transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {/* Wanted apporte */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl md:rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-10 border border-orange-500/20 h-full">
              <h3 className="font-bold text-xl md:text-2xl text-white mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
                <Coffee className="w-8 h-8 md:w-10 md:h-10 text-orange-400" />
                Wanted apporte
              </h3>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 md:mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-base md:text-lg mb-0.5 md:mb-1">La matière première</h4>
                    <p className="text-white/60 text-sm md:text-base">1.5M histoires vraies quotidiennes, des besoins réels, des élans spontanés</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 md:mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-base md:text-lg mb-0.5 md:mb-1">Les lieux vivants</h4>
                    <p className="text-white/60 text-sm md:text-base">Cafés-studios authentiques, scènes ouvertes, espaces de rencontre</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 md:mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-base md:text-lg mb-0.5 md:mb-1">La communauté active</h4>
                    <p className="text-white/60 text-sm md:text-base">Lives spontanés, engagement réel, énergie du terrain</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 md:mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-base md:text-lg mb-0.5 md:mb-1">L'impact mesurable</h4>
                    <p className="text-white/60 text-sm md:text-base">Compteurs temps réel, preuves terrain, data transparente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Origines transforme */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl md:rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-10 border border-violet-500/20 h-full">
              <h3 className="font-bold text-xl md:text-2xl text-white mb-6 md:mb-8 flex items-center gap-2 md:gap-3">
                <Camera className="w-8 h-8 md:w-10 md:h-10 text-violet-400" />
                Origines transforme
              </h3>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 md:mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-base md:text-lg mb-0.5 md:mb-1">En contenus émotionnels</h4>
                    <p className="text-white/60 text-sm md:text-base">Stories qui touchent, formats qui cartonnent, narration pro</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 md:mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-base md:text-lg mb-0.5 md:mb-1">En production scalable</h4>
                    <p className="text-white/60 text-sm md:text-base">200 contenus/mois, système de recyclage, IA d'optimisation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 md:mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-base md:text-lg mb-0.5 md:mb-1">En audiences qualifiées</h4>
                    <p className="text-white/60 text-sm md:text-base">Distribution multi-plateformes, ciblage par verticale, reach x10</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 md:mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-base md:text-lg mb-0.5 md:mb-1">En revenus éthiques</h4>
                    <p className="text-white/60 text-sm md:text-base">Monétisation sans compromis, sponsors alignés, 100% réinvesti</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Le cycle de création de valeur */}
        <div className={`relative mb-12 md:mb-24 transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 border border-white/10 overflow-hidden">
            <h3 className="font-bold text-xl md:text-2xl lg:text-3xl text-white text-center mb-8 md:mb-12">
              Le Cycle de Création de Valeur
            </h3>
            
            {/* Desktop: Flux horizontal */}
            <div className="hidden lg:block">
              <div className="relative max-w-5xl mx-auto">
                {/* Cards en ligne */}
                <div className="relative flex justify-between items-center">
                  {/* Ligne de connexion de fond - déplacée ici */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 -z-10">
                    <div className="h-full bg-white/10 rounded-full" />
                  </div>
                  
                  {creationFlow.map((item, index) => (
                    <div key={index} className="relative flex items-center">
                      <div className="relative group">
                        <div 
                          className={`relative p-4 rounded-2xl border-2 transition-all duration-700 ${
                            activeFlow === index 
                              ? 'scale-110 shadow-2xl' 
                              : 'scale-100 opacity-60 hover:opacity-80'
                          }`}
                          style={{
                            backgroundColor: activeFlow === index 
                              ? item.entity === 'wanted' 
                                ? 'rgba(249, 115, 22, 0.25)' 
                                : item.entity === 'origines'
                                ? 'rgba(139, 92, 246, 0.25)'
                                : 'rgba(236, 72, 153, 0.25)'
                              : 'rgba(0, 0, 0, 0.4)',
                            borderColor: activeFlow === index
                              ? item.entity === 'wanted'
                                ? '#F97316'
                                : item.entity === 'origines'
                                ? '#8B5CF6'
                                : '#EC4899'
                              : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: activeFlow === index
                              ? item.entity === 'wanted'
                                ? '0 0 30px rgba(249, 115, 22, 0.5)'
                                : item.entity === 'origines'
                                ? '0 0 30px rgba(139, 92, 246, 0.5)'
                                : '0 0 30px rgba(236, 72, 153, 0.5)'
                              : 'none'
                          }}
                        >
                          <item.icon 
                            className={`w-6 h-6 mx-auto mb-2 transition-all duration-700 ${
                              activeFlow === index
                                ? item.entity === 'wanted'
                                  ? 'text-orange-400'
                                  : item.entity === 'origines'
                                  ? 'text-violet-400'
                                  : 'text-pink-400'
                                : 'text-white/60'
                            } ${activeFlow === index ? 'scale-110' : 'scale-100'}`}
                          />
                          <p className={`text-center text-xs font-medium whitespace-nowrap transition-all duration-700 ${
                            activeFlow === index ? 'text-white font-semibold' : 'text-white/60'
                          }`}>
                            {item.step}
                          </p>
                          
                          {/* Tag de l'entité */}
                          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-700 ${
                            item.entity === 'wanted'
                              ? 'bg-orange-500'
                              : item.entity === 'origines'
                              ? 'bg-violet-500'
                              : 'bg-gradient-to-r from-orange-500 to-violet-500'
                          } ${activeFlow === index ? 'scale-110' : 'scale-100'}`}>
                            {item.entity === 'both' ? 'W+O' : item.entity === 'wanted' ? 'W' : 'O'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Flèche entre les étapes */}
                      {index < creationFlow.length - 1 && (
                        <ChevronRight className={`w-5 h-5 mx-2 transition-all duration-700 ${
                          activeFlow >= index ? 'text-white/60' : 'text-white/20'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: Scroll horizontal */}
            <div className="lg:hidden">
              <div className="overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex gap-3 min-w-max">
                  {creationFlow.map((item, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <div 
                        className={`relative p-3 md:p-4 pt-5 rounded-xl md:rounded-2xl border-2 transition-all duration-700 min-w-[120px] ${
                          activeFlow === index 
                            ? 'scale-110 shadow-2xl' 
                            : 'scale-100 opacity-60 hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: activeFlow === index 
                            ? item.entity === 'wanted' 
                              ? 'rgba(249, 115, 22, 0.25)' 
                              : item.entity === 'origines'
                              ? 'rgba(139, 92, 246, 0.25)'
                              : 'rgba(236, 72, 153, 0.25)'
                            : 'rgba(0, 0, 0, 0.4)',
                          borderColor: activeFlow === index
                            ? item.entity === 'wanted'
                              ? '#F97316'
                              : item.entity === 'origines'
                              ? '#8B5CF6'
                              : '#EC4899'
                            : 'rgba(255, 255, 255, 0.1)',
                          boxShadow: activeFlow === index
                            ? item.entity === 'wanted'
                              ? '0 0 30px rgba(249, 115, 22, 0.5)'
                              : item.entity === 'origines'
                              ? '0 0 30px rgba(139, 92, 246, 0.5)'
                              : '0 0 30px rgba(236, 72, 153, 0.5)'
                            : 'none'
                        }}
                      >
                        {/* Tag de l'entité - déplacé à l'intérieur */}
                        <div className={`absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold z-10 transition-all duration-700 ${
                          item.entity === 'wanted'
                            ? 'bg-orange-500'
                            : item.entity === 'origines'
                            ? 'bg-violet-500'
                            : 'bg-gradient-to-r from-orange-500 to-violet-500'
                        } ${activeFlow === index ? 'scale-110' : 'scale-100'}`}>
                          {item.entity === 'both' ? 'W+O' : item.entity === 'wanted' ? 'W' : 'O'}
                        </div>
                        
                        <item.icon 
                          className={`w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 transition-all duration-700 ${
                            activeFlow === index
                              ? item.entity === 'wanted'
                                ? 'text-orange-400'
                                : item.entity === 'origines'
                                ? 'text-violet-400'
                                : 'text-pink-400'
                              : 'text-white/60'
                          } ${activeFlow === index ? 'scale-110' : 'scale-100'}`}
                        />
                        <p className={`text-center text-xs font-medium transition-all duration-700 ${
                          activeFlow === index ? 'text-white font-semibold' : 'text-white/60'
                        }`}>
                          {item.step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Indicateur de scroll */}
              <div className="flex justify-center mt-2">
                <p className="text-xs text-white/40 flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 rotate-180" />
                  Glissez pour voir le cycle
                  <ChevronRight className="w-3 h-3" />
                </p>
              </div>
            </div>
            
            {/* Indicateur de cycle */}
            <div className="mt-6 md:mt-8 text-center">
              <div className="inline-flex items-center gap-2 md:gap-3 text-white/60 text-xs md:text-sm">
                <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 transition-all ${
                  activeFlow === creationFlow.length - 1 ? 'text-green-400 rotate-180' : ''
                }`} />
                <span>Le cycle recommence, amplifié</span>
              </div>
            </div>
          </div>
        </div>

        {/* Qui fait quoi */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-24 transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {/* Wanted */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-orange-500/20">
            <h4 className="font-bold text-lg md:text-xl text-orange-400 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
              <Users className="w-5 h-5 md:w-6 md:h-6" />
              WANTED
            </h4>
            <ul className="space-y-2 md:space-y-3 text-white/80">
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-orange-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Anime la communauté 24/7</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-orange-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Gère les cafés-studios</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-orange-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Organise les lives thématiques</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-orange-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Mesure l'impact terrain</span>
              </li>
            </ul>
          </div>

          {/* Origines */}
          <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-violet-500/20">
            <h4 className="font-bold text-lg md:text-xl text-violet-400 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
              <Camera className="w-5 h-5 md:w-6 md:h-6" />
              ORIGINES
            </h4>
            <ul className="space-y-2 md:space-y-3 text-white/80">
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-violet-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Filme et monte pro</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-violet-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Optimise pour les algos</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-violet-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Distribue multi-plateformes</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-violet-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Monétise éthiquement</span>
              </li>
            </ul>
          </div>

          {/* Ensemble */}
          <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-pink-500/20">
            <h4 className="font-bold text-lg md:text-xl text-pink-400 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
              <Share2 className="w-5 h-5 md:w-6 md:h-6" />
              ENSEMBLE
            </h4>
            <ul className="space-y-2 md:space-y-3 text-white/80">
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-pink-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Co-création éditoriale</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-pink-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Sélection des histoires</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-pink-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Direction artistique</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3">
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-pink-400 mt-0.5 md:mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base">Partage des revenus 50/50</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Impact concret */}
        <div className={`bg-gradient-to-r from-violet-600/10 via-pink-600/10 to-orange-600/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-16 border border-white/10 text-center transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h3 className="font-bold text-xl md:text-2xl lg:text-3xl text-white mb-6 md:mb-8">
            L'Impact en Chiffres
          </h3>
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div>
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-1 md:mb-2">
                1 Live
              </div>
              <p className="text-white/60 text-sm md:text-base">=</p>
              <p className="text-white font-semibold text-sm md:text-base">127 repas financés</p>
            </div>
            <div>
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-1 md:mb-2">
                1 Story
              </div>
              <p className="text-white/60 text-sm md:text-base">=</p>
              <p className="text-white font-semibold text-sm md:text-base">500 partages</p>
            </div>
            <div>
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-1 md:mb-2">
                1 Doc
              </div>
              <p className="text-white/60 text-sm md:text-base">=</p>
              <p className="text-white font-semibold text-sm md:text-base">50 entreprises créées</p>
            </div>
            <div>
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500 mb-1 md:mb-2">
                1 Mois
              </div>
              <p className="text-white/60 text-sm md:text-base">=</p>
              <p className="text-white font-semibold text-sm md:text-base">10k vies changées</p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .gradient-text-orange {
          background: linear-gradient(135deg, #F97316 0%, #EF4444 50%, #DC2626 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-text-purple {
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-text-fusion {
          background: linear-gradient(135deg, #F97316 0%, #EC4899 50%, #8B5CF6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes pulse-width {
          0%, 100% {
            width: 120px;
            opacity: 1;
          }
          50% {
            width: 160px;
            opacity: 0.8;
          }
        }
        
        .animate-pulse-width {
          animation: pulse-width 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default PartnershipConceptSection;