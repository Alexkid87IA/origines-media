import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Users, TrendingUp, DollarSign, Play, Zap, Target, Rocket } from 'lucide-react';

interface PartnershipHeroSectionProps {
  onGoLive?: () => void;
}

// Hook personnalisé pour animer les compteurs
const useCountUp = (end: number, duration: number = 2000, startCounting: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!startCounting) return;
    
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, startCounting]);
  
  return count;
};

const PartnershipHeroSection: React.FC<PartnershipHeroSectionProps> = ({ onGoLive }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentActe, setCurrentActe] = useState(0);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Fonction de scroll personnalisée
  const handleGoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onGoLive) {
      onGoLive();
      return;
    }
    
    if (sectionRef.current) {
      const sectionBottom = sectionRef.current.offsetTop + sectionRef.current.offsetHeight;
      window.scrollTo({
        top: sectionBottom,
        behavior: 'smooth'
      });
    }
  };

  // Données des 4 actes
  const actes = [
    {
      title: "Sprint 30 jours",
      subtitle: "L'allumage",
      metrics: { value: 200, unit: "contenus/mois" },
      color: "from-violet-600 to-purple-600"
    },
    {
      title: "6 mois",
      subtitle: "Les 12 empires",
      metrics: { value: 20, unit: "M vues/mois" },
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "1 an",
      subtitle: "Machine auto-financée",
      metrics: { value: 500, unit: "k€ CA média" },
      color: "from-pink-600 to-orange-600"
    },
    {
      title: "3 ans",
      subtitle: "Netflix de la solidarité",
      metrics: { value: 10, unit: "M€ CA/an" },
      color: "from-orange-600 to-red-600"
    }
  ];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setMetricsVisible(true), 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-progression des actes
  useEffect(() => {
    if (isVisible && currentActe < 3) {
      const timer = setTimeout(() => {
        setCurrentActe(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, currentActe]);

  // Compteurs animés
  const membersCount = useCountUp(1500000, 2000, metricsVisible);
  const verticalesCount = useCountUp(12, 1500, metricsVisible);
  const contentCount = useCountUp(200, 2000, metricsVisible);
  const viewsCount = useCountUp(20, 1800, metricsVisible);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* Background avec gradient animé */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-orange-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1),transparent_70%)]" />
      </div>

      {/* Header avec métriques clés */}
      <div className="relative z-10 pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8 lg:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Logos principaux */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative group">
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src="https://wanted.community/wp-content/uploads/2019/12/logo-wanted-community-.png" 
                alt="Wanted Community" 
                className="h-12 sm:h-14 lg:h-20 w-auto relative z-10 filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            
            <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/40">×</div>
            
            <div className="relative group">
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src="https://res.cloudinary.com/diqco2njt/image/upload/v1751568726/LOGO_ORIGINES_WHITE_pzbo2m.png" 
                alt="Origines Media" 
                className="h-12 sm:h-14 lg:h-20 w-auto relative z-10 opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
          
          {/* Sous-titre */}
          <div className={`text-center transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-base sm:text-xl lg:text-2xl text-white/60 font-light px-4">
              L'empire média de l'entraide commence maintenant
            </p>
          </div>

          {/* Métriques en temps réel - Optimisé mobile */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mt-8 sm:mt-10 lg:mt-12 transition-all duration-1000 delay-300 ${metricsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
              <Users className="w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 text-violet-400 mx-auto mb-1 sm:mb-2" />
              <div className="font-montserrat font-bold text-xl sm:text-2xl lg:text-3xl text-white">
                {(membersCount / 1000000).toFixed(1)}M
              </div>
              <div className="text-white/60 text-[10px] sm:text-xs lg:text-sm">membres Wanted</div>
            </div>

            <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
              <Users className="w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 text-purple-500 mx-auto mb-1 sm:mb-2" />
              <div className="font-montserrat font-bold text-xl sm:text-2xl lg:text-3xl text-white">
                3M
              </div>
              <div className="text-white/60 text-[10px] sm:text-xs lg:text-sm">abonnés Origines</div>
              <div className="text-white/40 text-[9px] sm:text-[10px] lg:text-xs mt-0.5 sm:mt-1">(FR, MX, US)</div>
            </div>
            
            <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
              <Target className="w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 text-purple-400 mx-auto mb-1 sm:mb-2" />
              <div className="font-montserrat font-bold text-xl sm:text-2xl lg:text-3xl text-white">
                {verticalesCount}
              </div>
              <div className="text-white/60 text-[10px] sm:text-xs lg:text-sm">verticales prêtes</div>
            </div>
            
            <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
              <Zap className="w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 text-pink-400 mx-auto mb-1 sm:mb-2" />
              <div className="font-montserrat font-bold text-xl sm:text-2xl lg:text-3xl text-white">
                {contentCount}
              </div>
              <div className="text-white/60 text-[10px] sm:text-xs lg:text-sm">contenus/mois</div>
            </div>
            
            <div className="text-center p-3 sm:p-4 lg:p-6 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 group hover:bg-white/10 transition-all col-span-2 sm:col-span-1">
              <TrendingUp className="w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 text-orange-400 mx-auto mb-1 sm:mb-2" />
              <div className="font-montserrat font-bold text-xl sm:text-2xl lg:text-3xl text-white">
                {viewsCount}M
              </div>
              <div className="text-white/60 text-[10px] sm:text-xs lg:text-sm">vues/mois (cible)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section principale : Les faits */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
        <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          {/* Card "Les faits" */}
          <div className="relative group mb-12 sm:mb-16 lg:mb-20">
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-violet-600/20 to-orange-600/20 rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-16">
              <h2 className="font-montserrat font-black text-2xl sm:text-3xl lg:text-4xl text-white mb-4 sm:mb-6 lg:mb-8">
                Les faits :
              </h2>
              <p className="text-base sm:text-xl lg:text-2xl text-white/90 leading-relaxed mb-4 sm:mb-6">
                <span className="font-bold text-orange-400">1,5 million de membres</span>. 
                <span className="font-bold text-purple-400"> 12 verticales</span> prêtes à exploser. 
                Des milliers d'histoires qui changent des vies chaque jour.
              </p>
              <p className="text-sm sm:text-lg lg:text-xl text-white/80 leading-relaxed">
                Mais soyons lucides : <span className="text-red-400 font-semibold">90% de cette valeur se perd</span> dans le flux Facebook. 
                <span className="text-red-400 font-semibold"> Zéro euro</span> généré par le média. 
                Impact réel non mesuré. C'est comme posséder Netflix mais diffuser sur Périscope.
              </p>
              
              {/* Mini visualisation de la perte */}
              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                <div className="text-center p-3 sm:p-4 bg-red-500/10 rounded-lg sm:rounded-xl border border-red-500/20">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400">90%</div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-white/60">Valeur perdue</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-red-500/10 rounded-lg sm:rounded-xl border border-red-500/20">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400">0€</div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-white/60">Généré</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-red-500/10 rounded-lg sm:rounded-xl border border-red-500/20">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400">?</div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-white/60">Impact réel</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vision centrale */}
          <div className="text-center my-12 sm:my-16 lg:my-20 px-4">
            <p className="text-lg sm:text-2xl lg:text-3xl text-white font-light">
              Wanted devient <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">la scène</span>.
            </p>
            <p className="text-lg sm:text-2xl lg:text-3xl text-white font-light mt-1 sm:mt-2">
              Origines Media devient <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-500">la machine</span>.
            </p>
            <p className="text-xl sm:text-3xl lg:text-4xl text-white font-bold mt-4 sm:mt-6">
              Ensemble, nous créons le premier empire média où{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400">
                chaque clic finance une action concrète
              </span>.
            </p>
          </div>

          {/* Timeline des 4 actes */}
          <div className="relative mt-16 sm:mt-24 lg:mt-32">
            <h2 className="font-montserrat font-black text-2xl sm:text-3xl lg:text-4xl text-white text-center mb-8 sm:mb-12 lg:mb-16 px-4">
              La transformation en 4 actes
            </h2>

            {/* Barre de progression - Cachée sur mobile */}
            <div className="relative mb-12 sm:mb-16 lg:mb-20 hidden sm:block">
              <div className="absolute left-0 right-0 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-orange-600 rounded-full transition-all duration-1000"
                  style={{ width: `${((currentActe + 1) / 4) * 100}%` }}
                />
              </div>
              
              {/* Points de la timeline */}
              <div className="relative flex justify-between">
                {actes.map((acte, index) => (
                  <div 
                    key={index} 
                    className={`relative transition-all duration-500 ${index <= currentActe ? 'scale-100 opacity-100' : 'scale-75 opacity-50'}`}
                  >
                    <div className={`w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 rounded-full border-2 sm:border-3 lg:border-4 ${index <= currentActe ? 'bg-white border-white' : 'bg-transparent border-white/30'} transition-all`} />
                    <div className="absolute top-8 sm:top-10 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                      <div className="font-montserrat font-bold text-xs sm:text-sm lg:text-base text-white">{acte.title}</div>
                      <div className="text-[10px] sm:text-xs lg:text-sm text-white/60">{acte.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Version mobile de la timeline */}
            <div className="sm:hidden mb-8">
              <div className="flex items-center justify-center gap-2">
                {actes.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentActe(index)}
                    className={`transition-all ${
                      index === currentActe 
                        ? 'w-8 h-2 bg-gradient-to-r from-violet-500 to-orange-500 rounded-full' 
                        : 'w-2 h-2 bg-white/30 rounded-full'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center mt-4">
                <div className="font-montserrat font-bold text-sm text-white">{actes[currentActe].title}</div>
                <div className="text-xs text-white/60">{actes[currentActe].subtitle}</div>
              </div>
            </div>

            {/* Contenu de l'acte actuel */}
            <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-16 border border-white/20">
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <div className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${actes[currentActe].color} text-white text-xs sm:text-sm font-bold`}>
                  <Rocket className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">{actes[currentActe].title}</span>
                </div>
              </div>

              {/* Acte I : Sprint 30 jours */}
              {currentActe === 0 && (
                <div className="animate-fade-in">
                  <h3 className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-white mb-4 sm:mb-6 pr-16 sm:pr-0">
                    Acte I : Sprint 30 jours - L'allumage
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8">
                    Dès le jour 1, on lance la production : <span className="font-bold text-violet-400">200 contenus/mois</span>. 
                    Pas de blabla, que de l'exécution.
                  </p>
                  
                  {/* Breakdown de la production */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
                      <div className="text-2xl sm:text-3xl font-bold text-violet-400">8</div>
                      <div className="text-xs sm:text-sm text-white/70">formats longs</div>
                      <div className="text-[10px] sm:text-xs text-white/50 mt-0.5 sm:mt-1">15-20 min</div>
                    </div>
                    <div className="p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-400">40</div>
                      <div className="text-xs sm:text-sm text-white/70">formats moyens</div>
                      <div className="text-[10px] sm:text-xs text-white/50 mt-0.5 sm:mt-1">3-5 min</div>
                    </div>
                    <div className="p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
                      <div className="text-2xl sm:text-3xl font-bold text-pink-400">120</div>
                      <div className="text-xs sm:text-sm text-white/70">shorts</div>
                      <div className="text-[10px] sm:text-xs text-white/50 mt-0.5 sm:mt-1">15-60 sec</div>
                    </div>
                    <div className="p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10">
                      <div className="text-2xl sm:text-3xl font-bold text-orange-400">32</div>
                      <div className="text-xs sm:text-sm text-white/70">carrousels</div>
                      <div className="text-[10px] sm:text-xs text-white/50 mt-0.5 sm:mt-1">LinkedIn/Insta</div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl border border-violet-500/20">
                    <p className="text-sm sm:text-base text-white font-semibold">
                      🎯 La formule magique : 1 tournage = 1 long = 10 shorts = 3 carrousels = 15 points de contact
                    </p>
                  </div>
                </div>
              )}

              {/* Acte II : 6 mois */}
              {currentActe === 1 && (
                <div className="animate-fade-in">
                  <h3 className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-white mb-4 sm:mb-6 pr-16 sm:pr-0">
                    Acte II : 6 mois - Les 12 empires verticaux
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8">
                    Fini le mélange des genres. Wanted éclate en <span className="font-bold text-purple-400">12 médias spécialisés</span>, 
                    chacun avec sa ligne éditoriale laser.
                  </p>
                  
                  {/* Exemples de verticales */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl sm:rounded-2xl border border-orange-500/20">
                      <h4 className="font-bold text-orange-400 text-lg sm:text-xl mb-1 sm:mb-2">WantedAnimaux</h4>
                      <p className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2">Mignon + Urgent = Adoption</p>
                      <p className="text-white/60 text-xs sm:text-sm">→ 20k€/mois = 500 adoptions financées</p>
                    </div>
                    <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl sm:rounded-2xl border border-purple-500/20">
                      <h4 className="font-bold text-purple-400 text-lg sm:text-xl mb-1 sm:mb-2">WantedBusiness</h4>
                      <p className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2">Échec + Mentor = Rebond</p>
                      <p className="text-white/60 text-xs sm:text-sm">→ 35k€/mois = 50 entreprises créées</p>
                    </div>
                  </div>

                  <div className="text-center p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-2xl">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                      Résultat : <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">20M vues/mois</span> vs 2M aujourd'hui
                    </p>
                  </div>
                </div>
              )}

              {/* Acte III : 1 an */}
              {currentActe === 2 && (
                <div className="animate-fade-in">
                  <h3 className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-white mb-4 sm:mb-6 pr-16 sm:pr-0">
                    Acte III : 1 an - La machine auto-financée
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8">
                    Les chiffres explosent. Chaque verticale devient <span className="font-bold text-pink-400">rentable et redistribue</span>.
                  </p>
                  
                  {/* Formats de production */}
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                      <Play className="w-5 sm:w-6 h-5 sm:h-6 text-pink-400 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-white text-sm sm:text-base">12 Hack-Trocs filmés</span>
                        <span className="text-white/60 text-xs sm:text-sm ml-1 sm:ml-2">(1/mois/verticale)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                      <Play className="w-5 sm:w-6 h-5 sm:h-6 text-pink-400 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-white text-sm sm:text-base">Séries signatures</span>
                        <span className="text-white/60 text-xs sm:text-sm ml-1 sm:ml-2">"7 jours pour s'en sortir"</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl">
                      <Play className="w-5 sm:w-6 h-5 sm:h-6 text-pink-400 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-white text-sm sm:text-base">Wanted Daily</span>
                        <span className="text-white/60 text-xs sm:text-sm ml-1 sm:ml-2">JT de l'entraide 5min</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 text-center">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-lg sm:rounded-xl">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-400">2400</div>
                      <div className="text-[10px] sm:text-xs lg:text-sm text-white/70">contenus/an</div>
                    </div>
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-lg sm:rounded-xl">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-400">100M</div>
                      <div className="text-[10px] sm:text-xs lg:text-sm text-white/70">vues cumulées</div>
                    </div>
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-lg sm:rounded-xl">
                      <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400">500k€</div>
                      <div className="text-[10px] sm:text-xs lg:text-sm text-white/70">CA média</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Acte IV : 3 ans */}
              {currentActe === 3 && (
                <div className="animate-fade-in">
                  <h3 className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-white mb-4 sm:mb-6 pr-16 sm:pr-0">
                    Acte IV : 3 ans - Le Netflix de la solidarité
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8">
                    Wanted n'est plus une page Facebook. C'est <span className="font-bold text-orange-400">LE média de référence mondiale</span> de l'impact positif.
                  </p>
                  
                  {/* L'empire en chiffres */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg sm:rounded-xl">
                      <div className="text-2xl sm:text-3xl font-bold text-orange-400">20</div>
                      <div className="text-xs sm:text-sm text-white/70">villes</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg sm:rounded-xl">
                      <div className="text-2xl sm:text-3xl font-bold text-orange-400">5M</div>
                      <div className="text-xs sm:text-sm text-white/70">users actifs</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg sm:rounded-xl">
                      <div className="text-2xl sm:text-3xl font-bold text-red-400">1B</div>
                      <div className="text-xs sm:text-sm text-white/70">vues/an</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg sm:rounded-xl">
                      <div className="text-2xl sm:text-3xl font-bold text-red-400">10M€</div>
                      <div className="text-xs sm:text-sm text-white/70">CA/an</div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl sm:rounded-2xl border border-orange-500/30">
                    <p className="text-base sm:text-lg lg:text-xl text-white font-bold text-center">
                      100% réinvesti dans l'action directe
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation entre actes - Version desktop */}
            <div className="hidden sm:flex justify-center gap-4 mt-8">
              {actes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentActe(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentActe 
                      ? 'w-8 bg-gradient-to-r from-violet-500 to-orange-500' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* La formule éditoriale */}
          <div className="mt-16 sm:mt-24 lg:mt-32">
            <h2 className="font-montserrat font-black text-2xl sm:text-3xl lg:text-4xl text-white text-center mb-8 sm:mb-12 px-4">
              La formule éditoriale qui tue
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                { pct: 20, title: "Urgence", desc: "Il faut agir MAINTENANT", color: "from-red-500 to-orange-500" },
                { pct: 30, title: "Émotion", desc: "Cette histoire va vous bouleverser", color: "from-purple-500 to-pink-500" },
                { pct: 30, title: "Solution", desc: "Voici exactement comment faire", color: "from-blue-500 to-purple-500" },
                { pct: 20, title: "Célébration", desc: "Regardez ce qu'on a accompli", color: "from-green-500 to-teal-500" }
              ].map((pilier, index) => (
                <div key={index} className="relative group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative h-full bg-black/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 group-hover:border-white/20 transition-all flex flex-col">
                    <div className={`flex items-center justify-center w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 rounded-full bg-gradient-to-br ${pilier.color} mb-3 sm:mb-4 flex-shrink-0`}>
                      <span className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-white">{pilier.pct}%</span>
                    </div>
                    <h4 className="font-bold text-base sm:text-lg lg:text-xl text-white mb-1 sm:mb-2">{pilier.title}</h4>
                    <p className="text-xs sm:text-sm text-white/70 flex-grow">{pilier.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Final */}
          <div className="mt-16 sm:mt-24 lg:mt-32 text-center px-4">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              <p className="text-base sm:text-xl lg:text-2xl text-white/80 leading-relaxed">
                Chaque jour qui passe, des milliers d'histoires extraordinaires meurent dans l'oubli d'un fil Facebook.
                Chaque jour, ton impact réel reste invisible. 
                Chaque jour, des sponsors passent à côté de la plus belle audience de France.
              </p>
              
              <p className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-black text-white">
                C'est fini.
              </p>

              <div className="space-y-3 sm:space-y-4 text-base sm:text-xl lg:text-2xl text-white/90">
                <p>Dans <span className="font-bold text-violet-400">48h</span>, on se voit. On pose tout.</p>
                <p>Dans <span className="font-bold text-purple-400">30 jours</span>, les 200 premiers contenus sont en ligne.</p>
                <p>Dans <span className="font-bold text-pink-400">6 mois</span>, tu ne reconnais plus Wanted.</p>
                <p>Dans <span className="font-bold text-orange-400">3 ans</span>, on a créé le nouveau standard mondial.</p>
              </div>

              <div className="relative inline-block mt-12 sm:mt-16">
                <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-violet-600 to-orange-600 rounded-full blur-xl sm:blur-2xl opacity-70 animate-pulse" />
                <button
                  onClick={handleGoClick}
                  type="button"
                  className="relative group px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-violet-600 to-orange-600 rounded-full text-white font-montserrat font-black text-lg sm:text-xl lg:text-2xl tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="flex items-center gap-2 sm:gap-3 pointer-events-none">
                    APPUIE SUR GO
                    <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
              
              <p className="text-white/60 text-sm sm:text-base lg:text-lg mt-4 sm:mt-6">
                Le reste, c'est de l'histoire.
              </p>
            </div>
          </div>

          {/* Citation finale */}
          <div className="mt-16 sm:mt-24 lg:mt-32 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-pink-600/10 to-orange-600/10 blur-2xl sm:blur-3xl" />
            <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 border border-white/20 text-center">
              <p className="text-base sm:text-xl lg:text-3xl text-white/90 leading-relaxed font-light italic">
                "Tes 1,5 million de membres méritent mieux qu'un groupe Facebook. 
                Construisons ensemble le premier empire média où chaque clic finance une vraie action. 
                Où chaque vue sauve une vie. Où chaque partage change une destinée."
              </p>
            </div>
          </div>

          {/* P.S. */}
          <p className="text-center text-white/50 text-sm sm:text-base lg:text-lg mt-8 sm:mt-12 px-4">
            P.S. : On ne fait pas dans le charity porn. On fait dans l'impact entertainment. Nuance.
          </p>
        </div>
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 10s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default PartnershipHeroSection;