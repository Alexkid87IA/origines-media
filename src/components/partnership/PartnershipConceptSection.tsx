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
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="font-montserrat font-black text-3xl lg:text-5xl text-white mb-4">
            Les Ponts entre
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="font-montserrat font-black text-4xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Wanted</span>
            <span className="font-montserrat font-black text-4xl lg:text-6xl text-white">&</span>
            <span className="font-montserrat font-black text-4xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">Origines</span>
          </div>
          <p className="text-xl text-white/60 mt-6 max-w-3xl mx-auto">
            Comment deux forces complémentaires créent le premier empire média de l'entraide
          </p>
        </div>

        {/* Ce que chacun apporte */}
        <div className={`grid lg:grid-cols-2 gap-8 mb-24 transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {/* Wanted apporte */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-10 border border-orange-500/20 h-full">
              <h3 className="font-montserrat font-bold text-2xl text-white mb-8 flex items-center gap-3">
                <Coffee className="w-10 h-10 text-orange-400" />
                Wanted apporte
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-1">La matière première</h4>
                    <p className="text-white/60">1.5M histoires vraies quotidiennes, des besoins réels, des élans spontanés</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-1">Les lieux vivants</h4>
                    <p className="text-white/60">Cafés-studios authentiques, scènes ouvertes, espaces de rencontre</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-1">La communauté active</h4>
                    <p className="text-white/60">Lives spontanés, engagement réel, énergie du terrain</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-1">L'impact mesurable</h4>
                    <p className="text-white/60">Compteurs temps réel, preuves terrain, data transparente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Origines transforme */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-10 border border-violet-500/20 h-full">
              <h3 className="font-montserrat font-bold text-2xl text-white mb-8 flex items-center gap-3">
                <Camera className="w-10 h-10 text-violet-400" />
                Origines transforme
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-1">En contenus émotionnels</h4>
                    <p className="text-white/60">Stories qui touchent, formats qui cartonnent, narration pro</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-1">En production scalable</h4>
                    <p className="text-white/60">200 contenus/mois, système de recyclage, IA d'optimisation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-1">En audiences qualifiées</h4>
                    <p className="text-white/60">Distribution multi-plateformes, ciblage par verticale, reach x10</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-1">En revenus éthiques</h4>
                    <p className="text-white/60">Monétisation sans compromis, sponsors alignés, 100% réinvesti</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Le cycle de création de valeur */}
        <div className={`relative mb-24 transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="relative bg-black/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/10 overflow-hidden">
            <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-white text-center mb-12">
              Le Cycle de Création de Valeur
            </h3>
            
            {/* Desktop: Flux horizontal */}
            <div className="hidden lg:block">
              <div className="relative max-w-5xl mx-auto">
                {/* Ligne de connexion de fond */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2">
                  <div className="h-full bg-white/10 rounded-full" />
                </div>

                {/* Cards en ligne */}
                <div className="relative flex justify-between items-center">
                  {creationFlow.map((item, index) => (
                    <div key={index} className="relative flex items-center">
                      <div className="relative group">
                        <div 
                          className={`relative p-4 rounded-2xl border transition-all duration-500 ${
                            activeFlow === index 
                              ? 'scale-110 shadow-xl' 
                              : 'scale-100 hover:scale-105'
                          }`}
                          style={{
                            backgroundColor: activeFlow === index 
                              ? item.entity === 'wanted' 
                                ? 'rgba(249, 115, 22, 0.15)' 
                                : item.entity === 'origines'
                                ? 'rgba(139, 92, 246, 0.15)'
                                : 'rgba(236, 72, 153, 0.15)'
                              : 'rgba(0, 0, 0, 0.6)',
                            borderColor: activeFlow === index
                              ? item.entity === 'wanted'
                                ? '#F97316'
                                : item.entity === 'origines'
                                ? '#8B5CF6'
                                : '#EC4899'
                              : 'rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          <item.icon 
                            className={`w-6 h-6 mx-auto mb-2 transition-all ${
                              activeFlow === index
                                ? item.entity === 'wanted'
                                  ? 'text-orange-400'
                                  : item.entity === 'origines'
                                  ? 'text-violet-400'
                                  : 'text-pink-400'
                                : 'text-white/60'
                            }`}
                          />
                          <p className={`text-center text-xs font-medium whitespace-nowrap transition-all ${
                            activeFlow === index ? 'text-white' : 'text-white/60'
                          }`}>
                            {item.step}
                          </p>
                          
                          {/* Tag de l'entité */}
                          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            item.entity === 'wanted'
                              ? 'bg-orange-500'
                              : item.entity === 'origines'
                              ? 'bg-violet-500'
                              : 'bg-gradient-to-r from-orange-500 to-violet-500'
                          }`}>
                            {item.entity === 'both' ? 'W+O' : item.entity === 'wanted' ? 'W' : 'O'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Flèche entre les étapes */}
                      {index < creationFlow.length - 1 && (
                        <ChevronRight className={`w-5 h-5 mx-2 transition-all ${
                          activeFlow >= index ? 'text-white/60' : 'text-white/20'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: Grille 2x4 */}
            <div className="lg:hidden">
              <div className="grid grid-cols-2 gap-4">
                {creationFlow.map((item, index) => (
                  <div key={index} className="relative">
                    <div 
                      className={`relative p-4 rounded-2xl border transition-all duration-500 ${
                        activeFlow === index 
                          ? 'scale-105 shadow-xl' 
                          : 'scale-100'
                      }`}
                      style={{
                        backgroundColor: activeFlow === index 
                          ? item.entity === 'wanted' 
                            ? 'rgba(249, 115, 22, 0.15)' 
                            : item.entity === 'origines'
                            ? 'rgba(139, 92, 246, 0.15)'
                            : 'rgba(236, 72, 153, 0.15)'
                          : 'rgba(0, 0, 0, 0.6)',
                        borderColor: activeFlow === index
                          ? item.entity === 'wanted'
                            ? '#F97316'
                            : item.entity === 'origines'
                            ? '#8B5CF6'
                            : '#EC4899'
                          : 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <item.icon 
                        className={`w-6 h-6 mx-auto mb-2 transition-all ${
                          activeFlow === index
                            ? item.entity === 'wanted'
                              ? 'text-orange-400'
                              : item.entity === 'origines'
                              ? 'text-violet-400'
                              : 'text-pink-400'
                            : 'text-white/60'
                        }`}
                      />
                      <p className={`text-center text-xs font-medium transition-all ${
                        activeFlow === index ? 'text-white' : 'text-white/60'
                      }`}>
                        {item.step}
                      </p>
                      
                      {/* Tag de l'entité */}
                      <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        item.entity === 'wanted'
                          ? 'bg-orange-500'
                          : item.entity === 'origines'
                          ? 'bg-violet-500'
                          : 'bg-gradient-to-r from-orange-500 to-violet-500'
                      }`}>
                        {item.entity === 'both' ? 'W+O' : item.entity === 'wanted' ? 'W' : 'O'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Indicateur de cycle */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 text-white/60 text-sm">
                <RefreshCw className={`w-5 h-5 transition-all ${
                  activeFlow === creationFlow.length - 1 ? 'text-green-400 rotate-180' : ''
                }`} />
                <span>Le cycle recommence, amplifié</span>
              </div>
            </div>
          </div>
        </div>

        {/* Qui fait quoi */}
        <div className={`grid lg:grid-cols-3 gap-8 mb-24 transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {/* Wanted */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-3xl p-8 border border-orange-500/20">
            <h4 className="font-montserrat font-bold text-xl text-orange-400 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6" />
              WANTED
            </h4>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span>Anime la communauté 24/7</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span>Gère les cafés-studios</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span>Organise les lives thématiques</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                <span>Mesure l'impact terrain</span>
              </li>
            </ul>
          </div>

          {/* Origines */}
          <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-8 border border-violet-500/20">
            <h4 className="font-montserrat font-bold text-xl text-violet-400 mb-6 flex items-center gap-3">
              <Camera className="w-6 h-6" />
              ORIGINES
            </h4>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                <span>Filme et monte pro</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                <span>Optimise pour les algos</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                <span>Distribue multi-plateformes</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                <span>Monétise éthiquement</span>
              </li>
            </ul>
          </div>

          {/* Ensemble */}
          <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 backdrop-blur-sm rounded-3xl p-8 border border-pink-500/20">
            <h4 className="font-montserrat font-bold text-xl text-pink-400 mb-6 flex items-center gap-3">
              <Share2 className="w-6 h-6" />
              ENSEMBLE
            </h4>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-pink-400 mt-1 flex-shrink-0" />
                <span>Co-création éditoriale</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-pink-400 mt-1 flex-shrink-0" />
                <span>Sélection des histoires</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-pink-400 mt-1 flex-shrink-0" />
                <span>Direction artistique</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-pink-400 mt-1 flex-shrink-0" />
                <span>Partage des revenus 50/50</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Impact concret */}
        <div className={`bg-gradient-to-r from-violet-600/10 via-pink-600/10 to-orange-600/10 backdrop-blur-sm rounded-3xl p-10 lg:p-16 border border-white/10 text-center transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-white mb-8">
            L'Impact en Chiffres
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-2">
                1 Live
              </div>
              <p className="text-white/60">=</p>
              <p className="text-white font-semibold">127 repas financés</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                1 Story
              </div>
              <p className="text-white/60">=</p>
              <p className="text-white font-semibold">500 partages</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-2">
                1 Doc
              </div>
              <p className="text-white/60">=</p>
              <p className="text-white font-semibold">50 entreprises créées</p>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500 mb-2">
                1 Mois
              </div>
              <p className="text-white/60">=</p>
              <p className="text-white font-semibold">10k vies changées</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipConceptSection;