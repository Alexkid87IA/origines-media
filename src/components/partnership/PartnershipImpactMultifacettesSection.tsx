import React, { useState, useEffect, useRef } from 'react';
import { Camera, Smartphone, Mic, Film, BarChart3, Users, TrendingUp, Zap, ArrowRight, Play, Hash, DollarSign, Package } from 'lucide-react';

const PartnershipImpactMultifacettesSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFormat, setActiveFormat] = useState(0);
  const [activeRevenue, setActiveRevenue] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Les 4 formats dérivés d'une action
  const contentFormats = [
    {
      id: 'short',
      name: 'Short',
      duration: '15-30s',
      platform: 'TikTok, Reels',
      icon: Smartphone,
      color: '#EC4899',
      description: 'Le hook qui arrête le scroll',
      metrics: '2.3M vues'
    },
    {
      id: 'reel',
      name: 'Reel',
      duration: '60-90s',
      platform: 'Instagram, YouTube',
      icon: Camera,
      color: '#8B5CF6',
      description: "L'histoire complète",
      metrics: '450K engagements'
    },
    {
      id: 'doc',
      name: 'Mini-Doc',
      duration: '6-8 min',
      platform: 'YouTube, Facebook',
      icon: Film,
      color: '#F97316',
      description: 'Le parcours approfondi',
      metrics: '85% rétention'
    },
    {
      id: 'podcast',
      name: 'Podcast',
      duration: '15 min',
      platform: 'Spotify, Apple',
      icon: Mic,
      color: '#10B981',
      description: 'Réflexion et coulisses',
      metrics: '12K écoutes'
    }
  ];

  // Sources de revenus
  const revenueStreams = [
    { id: 'dons', name: 'Micro-dons live', percentage: 40, color: '#10B981', icon: DollarSign },
    { id: 'sponsor', name: 'Sponsoring Impact', percentage: 25, color: '#8B5CF6', icon: TrendingUp },
    { id: 'merch', name: 'Merch solidaire', percentage: 10, color: '#EC4899', icon: Package },
    { id: 'events', name: 'Événements privés', percentage: 15, color: '#F97316', icon: Users },
    { id: 'grants', name: 'Subventions', percentage: 10, color: '#3B82F6', icon: BarChart3 }
  ];

  // Les 6 rôles clés
  const teamRoles = [
    {
      title: 'Showrunner Live',
      description: 'Programmation Twitch',
      icon: Play,
      color: '#8B5CF6'
    },
    {
      title: 'Community Manager',
      description: 'Hashtags, modération',
      icon: Hash,
      color: '#EC4899'
    },
    {
      title: 'Producteur Vidéo',
      description: 'Tournages & montage',
      icon: Camera,
      color: '#F97316'
    },
    {
      title: 'Data-Storyteller',
      description: 'KPI impacts, overlays',
      icon: BarChart3,
      color: '#10B981'
    },
    {
      title: 'Resp. Partenariats',
      description: 'Marques & subventions',
      icon: Users,
      color: '#3B82F6'
    },
    {
      title: 'Tech/Ops',
      description: 'Régie streaming',
      icon: Zap,
      color: '#EF4444'
    }
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

  // Animation des formats
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveFormat((prev) => (prev + 1) % contentFormats.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8 xl:px-16 bg-gray-50 overflow-hidden"
    >
      {/* Background effet */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/5 via-transparent to-orange-900/5" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.5'%3E%3Cpath d='M0 50h100M50 0v100'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transform transition-all duration-3000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 sm:w-16 lg:w-20 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            <span className="font-inter text-violet-400 text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase">L'apport d'Origines</span>
            <div className="w-12 sm:w-16 lg:w-20 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          </div>
          
          <h2 className="font-montserrat font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl uppercase tracking-wider text-gray-900 mb-3 sm:mb-6">
            La Machine à
            <br />
            <span className="gradient-text-animated text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Impact Origines</span>
          </h2>
          
          <p className="font-inter text-sm sm:text-base lg:text-xl text-gray-500 max-w-3xl mx-auto px-4">
            Nous transformons chaque geste d'entraide en onde de choc médiatique
          </p>
        </div>

        {/* Section 1: Machine à formats - Simplifié pour mobile */}
        <div className={`mb-12 sm:mb-16 lg:mb-20 transform transition-all duration-3000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="text-center mb-6 sm:mb-8 lg:mb-12">
            <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-900 mb-2 sm:mb-4">
              Une action = 4 formats viraux
            </h3>
            <p className="font-inter text-gray-500 text-sm sm:text-base max-w-2xl mx-auto px-4">
              Exemple : "Marie donne un canapé" devient une machine à contenus
            </p>
          </div>

          {/* Action initiale - Simplifiée */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="bg-gradient-to-br from-violet-600/20 to-orange-600/20 shadow-sm border border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md mx-auto">
              <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">Action filmée</h4>
              <p className="font-inter text-gray-500 text-xs sm:text-sm">Marie donne son canapé via Wanted</p>
            </div>
          </div>

          {/* Les 4 formats - Grid sur mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {contentFormats.map((format, index) => {
              const isActive = activeFormat === index;

              return (
                <div key={format.id} className={`transition-all duration-500 ${
                  isActive ? 'scale-105' : 'scale-100 opacity-80'
                }`}>
                  <div 
                    className="bg-gray-50 shadow-sm border rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white transition-all duration-300"
                    style={{
                      borderColor: isActive ? format.color : 'rgba(255,255,255,0.1)',
                      boxShadow: isActive ? `0 10px 20px ${format.color}30` : 'none'
                    }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${format.color}20`,
                          border: `1px solid ${format.color}40`
                        }}
                      >
                        <format.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: format.color }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-1">
                          <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base">{format.name}</h4>
                          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                            {format.duration}
                          </span>
                        </div>
                        <p className="font-inter text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">{format.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 truncate mr-2">{format.platform}</span>
                          <span className="text-xs font-bold whitespace-nowrap" style={{ color: format.color }}>
                            {format.metrics}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Growth Engine */}
        <div className={`mb-12 sm:mb-16 lg:mb-20 transform transition-all duration-3000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-900 text-center mb-6 sm:mb-8 lg:mb-12">
            Le Growth Engine Origines
          </h3>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {/* Data Storytelling */}
            <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-4 sm:mb-6">
                <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-violet-400" />
              </div>
              <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-2 sm:mb-3">Data-Storytelling</h4>
              <ul className="space-y-1.5 sm:space-y-2 font-inter text-gray-500 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 sm:mt-1">•</span>
                  <span>Overlays temps réel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 sm:mt-1">•</span>
                  <span>Compteurs d'urgence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-0.5 sm:mt-1">•</span>
                  <span>Hook en 3 secondes</span>
                </li>
              </ul>
            </div>

            {/* Optimisation Algo */}
            <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-4 sm:mb-6">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-orange-400" />
              </div>
              <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-2 sm:mb-3">Science des Algos</h4>
              <ul className="space-y-1.5 sm:space-y-2 font-inter text-gray-500 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 sm:mt-1">•</span>
                  <span>A/B testing titres</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 sm:mt-1">•</span>
                  <span>SEO par format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 sm:mt-1">•</span>
                  <span>Retargeting actifs</span>
                </li>
              </ul>
            </div>

            {/* Kit Mobile */}
            <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center mb-4 sm:mb-6">
                <Camera className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-fuchsia-400" />
              </div>
              <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-2 sm:mb-3">Kit Pro Mobile</h4>
              <ul className="space-y-1.5 sm:space-y-2 font-inter text-gray-500 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-0.5 sm:mt-1">•</span>
                  <span>4 caméras + 5 phones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-0.5 sm:mt-1">•</span>
                  <span>Régie portable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-0.5 sm:mt-1">•</span>
                  <span>Plug & play</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Modèle économique - Simplifié pour mobile */}
        <div className={`mb-12 sm:mb-16 lg:mb-20 transform transition-all duration-3000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-900 text-center mb-6 sm:mb-8 lg:mb-12">
            Modèle économique hybride
          </h3>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Visualisation circulaire - Cachée sur très petit mobile */}
            <div className="hidden sm:block relative h-[300px] lg:h-[400px] flex items-center justify-center">
              <svg className="w-full h-full max-w-[300px] lg:max-w-[400px]" viewBox="0 0 400 400">
                {/* Cercle de base */}
                <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                
                {/* Segments */}
                {(() => {
                  let cumulativePercentage = 0;
                  return revenueStreams.map((stream, index) => {
                    const startAngle = (cumulativePercentage * 360) / 100 - 90;
                    const endAngle = ((cumulativePercentage + stream.percentage) * 360) / 100 - 90;
                    cumulativePercentage += stream.percentage;

                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = (endAngle * Math.PI) / 180;

                    const x1 = 200 + 120 * Math.cos(startAngleRad);
                    const y1 = 200 + 120 * Math.sin(startAngleRad);
                    const x2 = 200 + 120 * Math.cos(endAngleRad);
                    const y2 = 200 + 120 * Math.sin(endAngleRad);

                    const largeArcFlag = stream.percentage > 50 ? 1 : 0;

                    const isActive = activeRevenue === stream.id;

                    return (
                      <g key={stream.id}>
                        <path
                          d={`M 200 200 L ${x1} ${y1} A 120 120 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={stream.color}
                          opacity={isActive ? 0.8 : 0.3}
                          stroke={isActive ? stream.color : 'transparent'}
                          strokeWidth="3"
                          className="cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setActiveRevenue(stream.id)}
                          onMouseLeave={() => setActiveRevenue(null)}
                        />
                        
                        {/* Pourcentage */}
                        {isActive && (
                          <text
                            x={200 + 80 * Math.cos((startAngleRad + endAngleRad) / 2)}
                            y={200 + 80 * Math.sin((startAngleRad + endAngleRad) / 2)}
                            fill="white"
                            fontSize="20"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {stream.percentage}%
                          </text>
                        )}
                      </g>
                    );
                  });
                })()}
                
                {/* Centre */}
                <circle cx="200" cy="200" r="50" fill="#0A0A0A" />
                <text x="200" y="190" fill="white" fontSize="14" textAnchor="middle" className="font-inter">
                  ROI 18 mois
                </text>
                <text x="200" y="210" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle" className="font-montserrat">
                  100%
                </text>
              </svg>
            </div>

            {/* Liste des revenus */}
            <div className="space-y-3 sm:space-y-4">
              {revenueStreams.map((stream) => (
                <div
                  key={stream.id}
                  className={`relative bg-gray-50 shadow-sm border rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 ${
                    activeRevenue === stream.id ? 'bg-white scale-105' : 'hover:bg-white'
                  }`}
                  style={{
                    borderColor: activeRevenue === stream.id ? stream.color : 'rgba(255,255,255,0.1)'
                  }}
                  onMouseEnter={() => setActiveRevenue(stream.id)}
                  onMouseLeave={() => setActiveRevenue(null)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${stream.color}20` }}
                      >
                        <stream.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: stream.color }} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base truncate">{stream.name}</h4>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-montserrat font-black text-xl sm:text-2xl" style={{ color: stream.color }}>
                        {stream.percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: L'équipe - Grid optimisé */}
        <div className={`transform transition-all duration-3000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-900 text-center mb-6 sm:mb-8 lg:mb-12">
            L'équipe fusion : 6 rôles clés
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teamRoles.map((role, index) => (
              <div
                key={index}
                className="group bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white transition-all duration-500 hover:scale-105"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500"
                    style={{
                      backgroundColor: `${role.color}20`,
                      border: `1px solid ${role.color}40`
                    }}
                  >
                    <role.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: role.color }} />
                  </div>
                  
                  <div className="min-w-0">
                    <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                      {role.title}
                    </h4>
                    <p className="font-inter text-gray-500 text-xs sm:text-sm">
                      {role.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .gradient-text-animated {
          background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </section>
  );
};

export default PartnershipImpactMultifacettesSection;