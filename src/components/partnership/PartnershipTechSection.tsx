import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, GitBranch, Activity, Scan, Link2, BarChart3, Eye, Zap, Shield,
  Share2, DollarSign, RefreshCw, Radio, CreditCard, Users, Building2, Package
} from 'lucide-react';

export default function PartnershipTechSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeMatch, setActiveMatch] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

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

  // Animation du scan
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setScanProgress((prev) => (prev >= 100 ? 0 : prev + 10));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Animation des matchs
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveMatch((prev) => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 sm:py-24 lg:py-32 bg-gray-50 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(249,115,22,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header avec style professionnel */}
        <div className={`text-center mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Badge supérieur */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-orange-400" />
            <span className="text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
              INNOVATION TECH
            </span>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-purple-400" />
          </div>

          {/* Titre principal */}
          <h2 className="font-montserrat font-black uppercase leading-tight mb-3 sm:mb-4">
            <span className="block text-3xl sm:text-5xl lg:text-7xl text-gray-900 tracking-tight">
              LA TECH
            </span>
            <span className="block text-4xl sm:text-6xl lg:text-8xl tracking-tight text-transparent" style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EC4899 25%, #8B5CF6 50%, #3B82F6 75%, #F97316 100%)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}>
              DU TROC
            </span>
          </h2>

          {/* Sous-titre enrichi */}
          <p className="text-base sm:text-xl lg:text-2xl text-gray-900/70 max-w-3xl mx-auto">
            L'IA <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">valorise instantanément</span>, 
            les algorithmes <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">matchent parfaitement</span>
          </p>

          {/* Punchline */}
          <p className="text-sm sm:text-base text-gray-900/50 font-medium mt-4 sm:mt-6 max-w-2xl mx-auto">
            Une infrastructure qui transforme l'échange ancestral en système moderne et scalable
          </p>

          {/* Introduction conceptuelle */}
          <div className="max-w-4xl mx-auto text-left mt-12">
            <p className="text-sm sm:text-base lg:text-lg text-gray-900/80 leading-relaxed mb-4 sm:mb-6">
              Le troc existe depuis toujours, mais il était limité par la <span className="text-orange-400 font-semibold">double coïncidence des besoins</span> : 
              tu as ce que je veux ET je dois avoir ce que tu veux. Impossible à grande échelle.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-900/80 leading-relaxed mb-6">
              Origines × Wanted révolutionne ce système millénaire avec <span className="text-violet-400 font-semibold">3 innovations technologiques</span> qui 
              rendent le troc aussi simple qu'un achat Amazon, mais <span className="text-green-400 font-semibold">100% humain et circulaire</span>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
              <div className="text-center p-4 sm:p-6 bg-gray-50 shadow-sm rounded-xl sm:rounded-2xl border border-gray-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                  <Cpu className="w-6 sm:w-8 h-6 sm:h-8 text-gray-900" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">IA Valuator</h4>
                <p className="text-xs sm:text-sm text-gray-900/60">Estime la valeur en 3 secondes</p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-gray-50 shadow-sm rounded-xl sm:rounded-2xl border border-gray-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <GitBranch className="w-6 sm:w-8 h-6 sm:h-8 text-gray-900" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Matching Engine</h4>
                <p className="text-xs sm:text-sm text-gray-900/60">Trouve les échanges multi-parties</p>
              </div>
              <div className="text-center p-4 sm:p-6 bg-gray-50 shadow-sm rounded-xl sm:rounded-2xl border border-gray-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 sm:w-8 h-6 sm:h-8 text-gray-900" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Impact Tracker</h4>
                <p className="text-xs sm:text-sm text-gray-900/60">Mesure et valorise chaque geste</p>
              </div>
            </div>
          </div>
        </div>

        {/* 1. L'IA Valuator */}
        <div className={`mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 shadow-sm rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 border border-cyan-500/20 overflow-hidden">
            {/* Animation de scan en background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent"
                style={{
                  transform: `translateY(${100 - scanProgress}%)`,
                  transition: 'transform 0.2s linear'
                }}
              />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h3 className="font-montserrat font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <Cpu className="w-8 sm:w-10 h-8 sm:h-10 text-cyan-400" />
                  <span className="line-clamp-2">L'IA Valuator : De l'objet à la valeur</span>
                </h3>
                
                <div className="space-y-3 sm:space-y-4 text-gray-900/80">
                  <p className="text-sm sm:text-base lg:text-lg">
                    Tu postes une photo de ton vélo. En <span className="font-bold text-cyan-400">3 secondes</span>, l'IA reconnaît :
                  </p>
                  
                  <div className="bg-gray-50 shadow-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-cyan-500/30">
                    <div className="space-y-2 font-mono text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Scan className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-cyan-400">Modèle:</span> 
                        <span className="text-gray-900/80 truncate">VTT Decathlon Rockrider 540</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-cyan-400">Année:</span> 2021
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-cyan-400">État:</span> 7/10
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 sm:w-4 h-3 sm:h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-cyan-400">Valeur:</span> 280€
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-900/60">
                    Computer vision + base de données Le Bon Coin = estimation instantanée. 
                    Plus besoin de négocier pendant des heures. La valeur est objective.
                  </p>
                </div>
              </div>

              <div className="relative">
                {/* Visualisation du scan */}
                <div className="relative w-full h-60 sm:h-80 bg-gray-100 rounded-xl sm:rounded-2xl border border-cyan-500/30 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-cyan-400" />
                    </div>
                  </div>
                  
                  {/* Lignes de scan */}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 h-px bg-cyan-400/50"
                      style={{
                        top: `${20 + i * 15}%`,
                        opacity: scanProgress > i * 20 ? 1 : 0,
                        transition: 'opacity 0.3s'
                      }}
                    />
                  ))}
                  
                  {/* Points de détection */}
                  {scanProgress > 50 && (
                    <>
                      <div className="absolute top-1/4 left-1/4 w-3 sm:w-4 h-3 sm:h-4 bg-cyan-400 rounded-full animate-ping" />
                      <div className="absolute top-2/3 right-1/3 w-3 sm:w-4 h-3 sm:h-4 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                      <div className="absolute bottom-1/4 left-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                    </>
                  )}

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 bg-white">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-200"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Le Matching Engine */}
        <div className={`mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-sm rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 border border-purple-500/20">
            <h3 className="font-montserrat font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <GitBranch className="w-8 sm:w-10 h-8 sm:h-10 text-purple-400" />
              <span className="line-clamp-2">Le Matching Engine : L'échange parfait</span>
            </h3>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 lg:order-1">
                {/* Visualisation du matching - Simplifié sur mobile */}
                <div className="relative h-60 sm:h-80">
                  {/* Les 3 personnes */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
                    activeMatch === 0 ? 'scale-110' : 'scale-90 sm:scale-100'
                  }`}>
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                      <Users className="w-8 sm:w-10 h-8 sm:h-10 text-gray-900" />
                    </div>
                    <p className="text-center text-gray-900/80 mt-1 sm:mt-2 font-semibold text-sm sm:text-base">Marie</p>
                    <p className="text-center text-gray-900/60 text-xs sm:text-sm">Vélo (280€)</p>
                  </div>

                  <div className={`absolute bottom-0 left-0 transition-all duration-1000 ${
                    activeMatch === 1 ? 'scale-110' : 'scale-90 sm:scale-100'
                  }`}>
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Users className="w-8 sm:w-10 h-8 sm:h-10 text-gray-900" />
                    </div>
                    <p className="text-center text-gray-900/80 mt-1 sm:mt-2 font-semibold text-sm sm:text-base">Paul</p>
                    <p className="text-center text-gray-900/60 text-xs sm:text-sm">Cours + PS4</p>
                  </div>

                  <div className={`absolute bottom-0 right-0 transition-all duration-1000 ${
                    activeMatch === 2 ? 'scale-110' : 'scale-90 sm:scale-100'
                  }`}>
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <Users className="w-8 sm:w-10 h-8 sm:h-10 text-gray-900" />
                    </div>
                    <p className="text-center text-gray-900/80 mt-1 sm:mt-2 font-semibold text-sm sm:text-base">Sophie</p>
                    <p className="text-center text-gray-900/60 text-xs sm:text-sm">Veut les cours</p>
                  </div>

                  {/* Lignes de connexion animées */}
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F97316" />
                        <stop offset="50%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    
                    {/* Marie -> Paul */}
                    <line x1="50%" y1="25%" x2="25%" y2="75%" 
                      stroke="url(#matchGradient)" strokeWidth="2" 
                      strokeDasharray="5 5"
                      opacity={activeMatch >= 0 ? 0.6 : 0.2}
                    />
                    
                    {/* Paul -> Sophie */}
                    <line x1="25%" y1="75%" x2="75%" y2="75%" 
                      stroke="url(#matchGradient)" strokeWidth="2" 
                      strokeDasharray="5 5"
                      opacity={activeMatch >= 1 ? 0.6 : 0.2}
                    />
                    
                    {/* Sophie -> Marie */}
                    <line x1="75%" y1="75%" x2="50%" y2="25%" 
                      stroke="url(#matchGradient)" strokeWidth="2" 
                      strokeDasharray="5 5"
                      opacity={activeMatch >= 2 ? 0.6 : 0.2}
                    />
                  </svg>

                  {/* Centre avec le match trouvé */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center animate-pulse">
                      <Link2 className="w-8 sm:w-10 h-8 sm:h-10 text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-3 sm:space-y-4 text-gray-900/80">
                <p className="text-sm sm:text-base lg:text-lg">
                  L'algo détecte : <span className="font-bold text-purple-400">échange triangulaire possible</span>
                </p>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-purple-500/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-gray-900" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base">Marie donne son vélo à Paul</p>
                      <p className="text-xs sm:text-sm text-gray-900/60">Valeur : 280€</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-purple-500/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-gray-900" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base">Paul donne sa PS4 à Marie + cours à Sophie</p>
                      <p className="text-xs sm:text-sm text-gray-900/60">Valeur : 190€ + 90€</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-purple-500/30">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-gray-900" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base">Sophie compense la différence</p>
                      <p className="text-xs sm:text-sm text-gray-900/60">Service ou futur crédit</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-900/60">
                  Le moteur analyse <span className="font-bold text-purple-400">10 000 combinaisons/seconde</span> pour trouver les matchs parfaits. 
                  Résultat : 3 personnes satisfaites sans qu'un euro ne circule.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. L'Impact Tracker */}
        <div className={`mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="relative bg-gradient-to-br from-green-500/10 to-emerald-500/10 shadow-sm rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 border border-green-500/20">
            <h3 className="font-montserrat font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
              <Activity className="w-8 sm:w-10 h-8 sm:h-10 text-green-400" />
              <span className="line-clamp-2">L'Impact Tracker : Chaque geste compte</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Live Overlay */}
              <div className="bg-gray-50 shadow-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/30">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Overlay Live</h4>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-green-500/10 rounded-lg">
                    <span className="text-gray-900/80">CO2 évité</span>
                    <span className="font-mono font-bold text-green-400">2.4t</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-green-500/10 rounded-lg">
                    <span className="text-gray-900/80">Objets sauvés</span>
                    <span className="font-mono font-bold text-green-400">847</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-green-500/10 rounded-lg">
                    <span className="text-gray-900/80">Euros économisés</span>
                    <span className="font-mono font-bold text-green-400">124k€</span>
                  </div>
                </div>
              </div>

              {/* API Ouverte */}
              <div className="bg-gray-50 shadow-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/30">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Share2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">API Ouverte</h4>
                </div>
                <p className="text-gray-900/80 text-xs sm:text-sm mb-3 sm:mb-4">
                  Les données nourrissent la recherche sur l'économie circulaire
                </p>
                <div className="space-y-1 sm:space-y-2 font-mono text-[10px] sm:text-xs">
                  <div className="p-1.5 sm:p-2 bg-white rounded text-green-400 overflow-x-auto">
                    GET /api/impact/daily
                  </div>
                  <div className="p-1.5 sm:p-2 bg-white rounded text-green-400 overflow-x-auto">
                    GET /api/exchanges/stats
                  </div>
                  <div className="p-1.5 sm:p-2 bg-white rounded text-green-400 overflow-x-auto">
                    GET /api/carbon/saved
                  </div>
                </div>
              </div>

              {/* Score de Réputation */}
              <div className="bg-gray-50 shadow-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/30 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Score de Réputation</h4>
                </div>
                <p className="text-gray-900/80 text-xs sm:text-sm mb-3 sm:mb-4">
                  Blockchain light : chaque échange est tracé, vérifié, valorisé
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 sm:h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full" />
                    </div>
                    <span className="text-gray-900/80 text-xs sm:text-sm font-semibold">Niveau 8</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-900/60">
                    Plus tu donnes, plus tu reçois
                  </p>
                </div>
              </div>
            </div>

            {/* Message final */}
            <div className="mt-8 sm:mt-12 text-center p-6 sm:p-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl border border-green-500/30">
              <p className="text-base sm:text-lg lg:text-xl text-gray-900 font-medium">
                Wanted apporte la <span className="text-orange-400 font-bold">communauté et la confiance</span>. 
                Origines apporte la <span className="text-violet-400 font-bold">tech et la scalabilité</span>. 
                <br className="hidden lg:block" />
                Ensemble, on fait du troc un système aussi fluide qu'Amazon, mais <span className="text-green-400 font-bold">100% humain</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Growth Strategy & Business Model */}
        <div className="mt-16 sm:mt-24 lg:mt-32">
          <h3 className="font-montserrat font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 text-center mb-8 sm:mb-12">
            Comment on scale : Growth & Business Model
          </h3>

          {/* Acquisition Strategy */}
          <div className={`mb-12 sm:mb-16 transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <h4 className="font-montserrat font-bold text-lg sm:text-xl text-gray-900 text-center mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-3">
              <Radio className="w-5 sm:w-6 h-5 sm:h-6 text-orange-400" />
              Acquisition Organique via nos Communautés
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Wanted Channel */}
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 shadow-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-500/20">
                <h5 className="font-bold text-orange-400 mb-2 sm:mb-3 text-sm sm:text-base">Groupes Wanted (1.5M)</h5>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-900/80">
                  <li>• Posts épinglés par verticale</li>
                  <li>• Lives "Troc du jour" hebdo</li>
                  <li>• Notifications Messenger matchs</li>
                  <li>• Ambassadeurs dans 20 villes</li>
                </ul>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-orange-500/20">
                  <span className="text-orange-400 font-bold text-sm sm:text-base">5% conversion</span>
                </div>
              </div>

              {/* Origines Channel */}
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 shadow-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-violet-500/20">
                <h5 className="font-bold text-violet-400 mb-2 sm:mb-3 text-sm sm:text-base">Audiences Origines (20M/mois)</h5>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-900/80">
                  <li>• Shorts viraux avant/après</li>
                  <li>• QR codes dans vidéos</li>
                  <li>• Stories Instagram swipe-up</li>
                  <li>• Podcasts témoignages</li>
                </ul>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-violet-500/20">
                  <span className="text-violet-400 font-bold text-sm sm:text-base">2% conversion</span>
                </div>
              </div>

              {/* Viral Effect */}
              <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 shadow-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-pink-500/20 sm:col-span-2 lg:col-span-1">
                <h5 className="font-bold text-pink-400 mb-2 sm:mb-3 text-sm sm:text-base">Effet Viral (∞)</h5>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-900/80">
                  <li>• 1 troc = 1 story = 10 partages</li>
                  <li>• Gamification & badges sociaux</li>
                  <li>• Parrainage = boost visibilité</li>
                  <li>• SEO local "troc + ville"</li>
                </ul>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-pink-500/20">
                  <span className="text-pink-400 font-bold text-sm sm:text-base">10% conversion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Model */}
          <div className={`transition-all duration-1000 delay-1200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <h4 className="font-montserrat font-bold text-lg sm:text-xl text-gray-900 text-center mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-3 flex-wrap px-4">
              <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-green-400" />
              <span>5 Sources de Revenus (sans toucher au troc) = 1.2M€ ARR</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gray-50 shadow-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-500/20 text-center">
                <CreditCard className="w-5 sm:w-6 h-5 sm:h-6 text-green-400 mx-auto mb-1.5 sm:mb-2" />
                <h5 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Crédits Troc</h5>
                <p className="text-green-400 font-bold text-xs sm:text-sm">1€ = 1 crédit</p>
                <p className="text-[10px] sm:text-xs text-gray-900/60 mt-0.5 sm:mt-1">Compenser les écarts</p>
                <p className="text-[10px] sm:text-xs text-green-400 font-semibold mt-1.5 sm:mt-2">200k€/an</p>
              </div>

              <div className="bg-gray-50 shadow-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-500/20 text-center">
                <Users className="w-5 sm:w-6 h-5 sm:h-6 text-green-400 mx-auto mb-1.5 sm:mb-2" />
                <h5 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Abonnements</h5>
                <p className="text-green-400 font-bold text-xs sm:text-sm">9-99€/mois</p>
                <p className="text-[10px] sm:text-xs text-gray-900/60 mt-0.5 sm:mt-1">Features premium</p>
                <p className="text-[10px] sm:text-xs text-green-400 font-semibold mt-1.5 sm:mt-2">300k€/an</p>
              </div>

              <div className="bg-gray-50 shadow-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-500/20 text-center">
                <Building2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-400 mx-auto mb-1.5 sm:mb-2" />
                <h5 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Sponsors</h5>
                <p className="text-green-400 font-bold text-xs sm:text-sm">5-20k€/mois</p>
                <p className="text-[10px] sm:text-xs text-gray-900/60 mt-0.5 sm:mt-1">Par verticale</p>
                <p className="text-[10px] sm:text-xs text-green-400 font-semibold mt-1.5 sm:mt-2">400k€/an</p>
              </div>

              <div className="bg-gray-50 shadow-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-500/20 text-center">
                <BarChart3 className="w-5 sm:w-6 h-5 sm:h-6 text-green-400 mx-auto mb-1.5 sm:mb-2" />
                <h5 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Data & API</h5>
                <p className="text-green-400 font-bold text-xs sm:text-sm">1-10k€</p>
                <p className="text-[10px] sm:text-xs text-gray-900/60 mt-0.5 sm:mt-1">ESG, recherche</p>
                <p className="text-[10px] sm:text-xs text-green-400 font-semibold mt-1.5 sm:mt-2">200k€/an</p>
              </div>

              <div className="bg-gray-50 shadow-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-500/20 text-center col-span-2 sm:col-span-1">
                <Package className="w-5 sm:w-6 h-5 sm:h-6 text-green-400 mx-auto mb-1.5 sm:mb-2" />
                <h5 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Services+</h5>
                <p className="text-green-400 font-bold text-xs sm:text-sm">2-10€</p>
                <p className="text-[10px] sm:text-xs text-gray-900/60 mt-0.5 sm:mt-1">Livraison, assurance</p>
                <p className="text-[10px] sm:text-xs text-green-400 font-semibold mt-1.5 sm:mt-2">100k€/an</p>
              </div>
            </div>

            {/* Detail Data & Analytics */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 shadow-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-500/20 mb-6 sm:mb-8">
              <h5 className="font-bold text-emerald-400 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5" />
                Focus : Monétisation de la Data Éthique
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-900 font-semibold mb-0.5 sm:mb-1">Rapports ESG</p>
                  <p className="text-gray-900/60">CO2 évité, impact social certifié pour entreprises</p>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold mb-0.5 sm:mb-1">API Recherche</p>
                  <p className="text-gray-900/60">Données anonymisées pour universités</p>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold mb-0.5 sm:mb-1">Baromètre Wanted</p>
                  <p className="text-gray-900/60">Tendances du troc vendues aux médias</p>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold mb-0.5 sm:mb-1">Insights Marques</p>
                  <p className="text-gray-900/60">Comprendre les besoins par verticale</p>
                </div>
              </div>
            </div>

            {/* Growth Projection */}
            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="p-4 sm:p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl border border-violet-500/20">
                <h5 className="font-bold text-violet-400 mb-1.5 sm:mb-2 text-sm sm:text-base">Année 1</h5>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">100k users</p>
                <p className="text-gray-900/60 text-xs sm:text-sm mt-1">2M€ GMV • 100k€ revenus</p>
              </div>
              
              <div className="p-4 sm:p-6 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-xl sm:rounded-2xl border border-pink-500/20">
                <h5 className="font-bold text-pink-400 mb-1.5 sm:mb-2 text-sm sm:text-base">Année 2</h5>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">500k users</p>
                <p className="text-gray-900/60 text-xs sm:text-sm mt-1">10M€ GMV • 1M€ revenus</p>
              </div>
              
              <div className="p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl sm:rounded-2xl border border-green-500/20">
                <h5 className="font-bold text-green-400 mb-1.5 sm:mb-2 text-sm sm:text-base">Année 3</h5>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">2M users</p>
                <p className="text-gray-900/60 text-xs sm:text-sm mt-1">50M€ GMV • 5M€ revenus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}