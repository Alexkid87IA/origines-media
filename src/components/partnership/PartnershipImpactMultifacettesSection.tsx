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
      metrics: '2.3M vues moyennes'
    },
    {
      id: 'reel',
      name: 'Reel',
      duration: '60-90s',
      platform: 'Instagram, YouTube Shorts',
      icon: Camera,
      color: '#8B5CF6',
      description: "L'histoire complète verticale",
      metrics: '450K engagements'
    },
    {
      id: 'doc',
      name: 'Mini-Doc',
      duration: '6-8 min',
      platform: 'YouTube, Facebook',
      icon: Film,
      color: '#F97316',
      description: 'Le parcours en profondeur',
      metrics: '85% de rétention'
    },
    {
      id: 'podcast',
      name: 'Podcast',
      duration: '15 min',
      platform: 'Spotify, Apple',
      icon: Mic,
      color: '#10B981',
      description: 'La réflexion et les coulisses',
      metrics: '12K écoutes complètes'
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
      description: 'Programmation Twitch, dynamique chat',
      icon: Play,
      color: '#8B5CF6'
    },
    {
      title: 'Community Manager',
      description: 'Hashtags, modération, lien assos',
      icon: Hash,
      color: '#EC4899'
    },
    {
      title: 'Producteur Vidéo',
      description: 'Tournages & planning montage',
      icon: Camera,
      color: '#F97316'
    },
    {
      title: 'Data-Storyteller',
      description: 'KPI impacts, overlays dynamiques',
      icon: BarChart3,
      color: '#10B981'
    },
    {
      title: 'Responsable Partenariats',
      description: 'Marques & subventions',
      icon: Users,
      color: '#3B82F6'
    },
    {
      title: 'Tech/Ops',
      description: 'Régie streaming, kit mobile',
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
      className="relative py-20 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] overflow-hidden"
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
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            <span className="font-inter text-violet-400 text-sm tracking-[0.2em] uppercase">L'apport d'Origines</span>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          </div>
          
          <h2 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider text-white mb-6">
            La Machine à
            <br />
            <span className="gradient-text-animated">Impact Origines</span>
          </h2>
          
          <p className="font-inter text-xl text-white/70 max-w-3xl mx-auto">
            Nous transformons chaque geste d'entraide en onde de choc médiatique calibrée pour les algorithmes
          </p>
        </div>

        {/* Section 1: Machine à formats */}
        <div className={`mb-20 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-white mb-4">
              Une action = 4 formats viraux
            </h3>
            <p className="font-inter text-white/60 max-w-2xl mx-auto">
              Exemple : "Marie donne un canapé" devient une machine à contenus
            </p>
          </div>

          {/* Timeline de transformation */}
          <div className="relative max-w-5xl mx-auto">
            {/* Ligne centrale */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-orange-500 to-fuchsia-500 -translate-x-1/2" />

            {/* Action initiale */}
            <div className="relative mb-16">
              <div className="flex justify-center">
                <div className="relative bg-gradient-to-br from-violet-600/20 to-orange-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md">
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-br from-violet-600 to-orange-600 rounded-full animate-pulse" />
                  <h4 className="font-montserrat font-bold text-white mb-2">Action filmée</h4>
                  <p className="font-inter text-white/70">Marie donne son canapé via le groupe Facebook Wanted</p>
                </div>
              </div>
            </div>

            {/* Les 4 formats */}
            <div className="space-y-8">
              {contentFormats.map((format, index) => {
                const isActive = activeFormat === index;
                const isLeft = index % 2 === 0;

                return (
                  <div key={format.id} className={`relative flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                    {/* Connecteur */}
                    <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'left-1/2' : 'right-1/2'} w-16 h-0.5 bg-white/20`} />
                    
                    {/* Card format */}
                    <div className={`relative max-w-md transition-all duration-500 ${
                      isActive ? 'scale-105' : 'scale-100 opacity-80'
                    }`}>
                      <div 
                        className="bg-black/40 backdrop-blur-xl border rounded-2xl p-6 hover:bg-black/60 transition-all duration-300"
                        style={{
                          borderColor: isActive ? format.color : 'rgba(255,255,255,0.1)',
                          boxShadow: isActive ? `0 20px 40px ${format.color}30` : 'none'
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${format.color}20`,
                              border: `1px solid ${format.color}40`
                            }}
                          >
                            <format.icon className="w-6 h-6" style={{ color: format.color }} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-montserrat font-bold text-white">{format.name}</h4>
                              <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
                                {format.duration}
                              </span>
                            </div>
                            <p className="font-inter text-white/60 text-sm mb-2">{format.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/40">{format.platform}</span>
                              <span className="text-xs font-bold" style={{ color: format.color }}>
                                {format.metrics}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Growth Engine */}
        <div className={`mb-20 transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-white text-center mb-12">
            Le Growth Engine Origines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Data Storytelling */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-violet-400" />
              </div>
              <h4 className="font-montserrat font-bold text-xl text-white mb-3">Data-Storytelling</h4>
              <ul className="space-y-2 font-inter text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Overlays temps réel des impacts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Compteurs qui créent l'urgence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 mt-1">•</span>
                  <span>Hook chiffré en 3 secondes</span>
                </li>
              </ul>
            </div>

            {/* Optimisation Algo */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
              <h4 className="font-montserrat font-bold text-xl text-white mb-3">Science des Algos</h4>
              <ul className="space-y-2 font-inter text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>A/B testing miniatures + titres</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>SEO optimisé par format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">•</span>
                  <span>Retargeting donateurs actifs</span>
                </li>
              </ul>
            </div>

            {/* Kit Mobile */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center mb-6">
                <Camera className="w-8 h-8 text-fuchsia-400" />
              </div>
              <h4 className="font-montserrat font-bold text-xl text-white mb-3">Kit Pro Mobile</h4>
              <ul className="space-y-2 font-inter text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-1">•</span>
                  <span>4 caméras + 5 smartphones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-1">•</span>
                  <span>Régie streaming portable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-fuchsia-400 mt-1">•</span>
                  <span>Plug & play dans chaque ville</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Modèle économique */}
        <div className={`mb-20 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-white text-center mb-12">
            Modèle économique hybride
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visualisation circulaire */}
            <div className="relative h-[400px] flex items-center justify-center">
              <svg className="w-full h-full max-w-[400px]" viewBox="0 0 400 400">
                {/* Cercle de base */}
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                
                {/* Segments */}
                {(() => {
                  let cumulativePercentage = 0;
                  return revenueStreams.map((stream, index) => {
                    const startAngle = (cumulativePercentage * 360) / 100 - 90;
                    const endAngle = ((cumulativePercentage + stream.percentage) * 360) / 100 - 90;
                    cumulativePercentage += stream.percentage;

                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = (endAngle * Math.PI) / 180;

                    const x1 = 200 + 150 * Math.cos(startAngleRad);
                    const y1 = 200 + 150 * Math.sin(startAngleRad);
                    const x2 = 200 + 150 * Math.cos(endAngleRad);
                    const y2 = 200 + 150 * Math.sin(endAngleRad);

                    const largeArcFlag = stream.percentage > 50 ? 1 : 0;

                    const isActive = activeRevenue === stream.id;

                    return (
                      <g key={stream.id}>
                        <path
                          d={`M 200 200 L ${x1} ${y1} A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
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
                            x={200 + 100 * Math.cos((startAngleRad + endAngleRad) / 2)}
                            y={200 + 100 * Math.sin((startAngleRad + endAngleRad) / 2)}
                            fill="white"
                            fontSize="24"
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
                <circle cx="200" cy="200" r="60" fill="#0A0A0A" />
                <text x="200" y="190" fill="white" fontSize="16" textAnchor="middle" className="font-inter">
                  ROI 18 mois
                </text>
                <text x="200" y="215" fill="white" fontSize="24" fontWeight="bold" textAnchor="middle" className="font-montserrat">
                  100%
                </text>
              </svg>
            </div>

            {/* Liste des revenus */}
            <div className="space-y-4">
              {revenueStreams.map((stream) => (
                <div
                  key={stream.id}
                  className={`relative bg-black/40 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                    activeRevenue === stream.id ? 'bg-black/60 scale-105' : 'hover:bg-black/50'
                  }`}
                  style={{
                    borderColor: activeRevenue === stream.id ? stream.color : 'rgba(255,255,255,0.1)'
                  }}
                  onMouseEnter={() => setActiveRevenue(stream.id)}
                  onMouseLeave={() => setActiveRevenue(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${stream.color}20` }}
                      >
                        <stream.icon className="w-5 h-5" style={{ color: stream.color }} />
                      </div>
                      <div>
                        <h4 className="font-montserrat font-bold text-white">{stream.name}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-montserrat font-black text-2xl" style={{ color: stream.color }}>
                        {stream.percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: L'équipe */}
        <div className={`transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h3 className="font-montserrat font-bold text-2xl lg:text-3xl text-white text-center mb-12">
            L'équipe fusion : 6 rôles clés
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamRoles.map((role, index) => (
              <div
                key={index}
                className="group bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-black/60 transition-all duration-500 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500"
                    style={{
                      backgroundColor: `${role.color}20`,
                      border: `1px solid ${role.color}40`
                    }}
                  >
                    <role.icon className="w-6 h-6" style={{ color: role.color }} />
                  </div>
                  
                  <div>
                    <h4 className="font-montserrat font-bold text-white mb-2">
                      {role.title}
                    </h4>
                    <p className="font-inter text-white/60 text-sm">
                      {role.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
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