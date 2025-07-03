import React, { useState, useEffect, useRef } from 'react';
import { Mic, Heart, Film, RotateCw, Coffee, Users, Camera, Radio, Zap, Facebook, Hash, Calendar, Share2 } from 'lucide-react';

const PartnershipConceptSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Les 4 étapes du cycle
  const cycleSteps = [
    {
      id: 'live',
      title: 'LIVE',
      icon: Mic,
      color: '#8B5CF6',
      description: 'Des micros ouverts 7j/7',
      details: 'Twitch, YouTube, TikTok, Insta Live, X Spaces'
    },
    {
      id: 'impact',
      title: 'IMPACT',
      icon: Heart,
      color: '#EC4899',
      description: 'Chaque minute finance un geste',
      details: 'Repas suspendu, collecte, service rendu'
    },
    {
      id: 'story',
      title: 'STORY',
      icon: Film,
      color: '#F97316',
      description: 'Origines capte et transforme',
      details: 'Shorts, reels, docs, podcasts'
    },
    {
      id: 'live-loop',
      title: 'LIVE',
      icon: RotateCw,
      color: '#10B981',
      description: 'Les contenus inspirent',
      details: 'La roue recommence, plus grande'
    }
  ];

  // Les plateformes et leur rôle
  const platforms = [
    {
      id: 'twitch',
      name: 'Twitch',
      role: 'Show interactif "Wanted Live"',
      icon: '🎮',
      color: '#9146FF'
    },
    {
      id: 'youtube',
      name: 'YouTube Live',
      role: 'Docs longs & after-movies',
      icon: '📺',
      color: '#FF0000'
    },
    {
      id: 'tiktok',
      name: 'TikTok & Reels',
      role: 'Clips < 90s, moments émotion',
      icon: '📱',
      color: '#000000'
    },
    {
      id: 'facebook',
      name: 'Groupes Facebook',
      role: 'Détecteur d\'histoires & amplificateur',
      icon: '👥',
      color: '#1877F2'
    }
  ];

  // Rituels hebdomadaires
  const weeklyRituals = [
    { day: 'Lundi', title: 'Héros', description: 'Nomme quelqu\'un, on l\'appelle en live', icon: '🦸' },
    { day: 'Mardi', title: 'Associations', description: 'Tag une asso, on l\'interviewe', icon: '🤝' },
    { day: 'Mercredi', title: 'Coup de main', description: 'Poste ce que tu offres, on relaie', icon: '🔧' },
    { day: 'Jeudi', title: 'Open-Mic', description: 'Monte sur scène, raconte ton déclic', icon: '🎤' },
    { day: 'Vendredi', title: 'Café-Concert', description: 'Artistes engagés, donations live', icon: '🎵' }
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

  // Animation du cycle
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % cycleSteps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            <span className="font-inter text-violet-400 text-sm tracking-[0.2em] uppercase">Le Concept Cœur</span>
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          </div>
          
          <h2 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider text-white mb-6">
            Live → Impact → Story →
            <br />
            <span className="gradient-text-animated">Live</span>
          </h2>
          
          <p className="font-inter text-xl text-white/70 max-w-3xl mx-auto">
            Un écosystème où chaque geste d'entraide devient instantanément du contenu qui nourrit l'action suivante
          </p>
        </div>

        {/* Cycle Visualization */}
        <div className={`mb-20 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="relative max-w-4xl mx-auto">
            {/* Cercle central */}
            <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
              {/* Logo central */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-violet-600/20 to-orange-600/20 backdrop-blur-xl flex items-center justify-center">
                  <Coffee className="w-16 h-16 lg:w-20 lg:h-20 text-white/80" />
                </div>
              </div>

              {/* Étapes du cycle */}
              {cycleSteps.map((step, index) => {
                const angle = (index * 90 - 90) * (Math.PI / 180);
                const radius = 150;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isActive = activeStep === index;

                return (
                  <div
                    key={step.id}
                    className={`absolute top-1/2 left-1/2 transition-all duration-1000 ${
                      isActive ? 'scale-110 z-20' : 'scale-100 z-10'
                    }`}
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                    }}
                  >
                    <div className="relative group">
                      {/* Glow effect */}
                      <div 
                        className={`absolute inset-0 -m-4 rounded-full blur-xl transition-all duration-500 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ backgroundColor: `${step.color}40` }}
                      />
                      
                      {/* Step card */}
                      <div 
                        className={`relative w-24 h-24 lg:w-32 lg:h-32 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 ${
                          isActive ? 'shadow-2xl' : 'shadow-lg'
                        }`}
                        style={{
                          backgroundColor: isActive ? `${step.color}20` : 'rgba(0,0,0,0.5)',
                          borderColor: isActive ? step.color : 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <step.icon 
                          className={`w-8 h-8 lg:w-10 lg:h-10 mb-2 transition-all duration-500`}
                          style={{ color: isActive ? step.color : 'rgba(255,255,255,0.6)' }}
                        />
                        <span 
                          className={`font-montserrat font-bold text-xs lg:text-sm transition-all duration-500 ${
                            isActive ? 'text-white' : 'text-white/60'
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>

                      {/* Details on hover/active */}
                      <div className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 p-3 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 transition-all duration-500 ${
                        isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                      }`}>
                        <p className="font-inter text-white font-semibold text-sm mb-1">
                          {step.description}
                        </p>
                        <p className="font-inter text-white/60 text-xs">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Flèches de connexion animées */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3, 0 6"
                      fill="url(#arrowGradient)"
                    />
                  </marker>
                  <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
                
                <circle
                  cx="50%"
                  cy="50%"
                  r="150"
                  fill="none"
                  stroke="url(#arrowGradient)"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  opacity="0.2"
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 250 250"
                    to="360 250 250"
                    dur="30s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          </div>
        </div>

        {/* Écosystème détaillé */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Le Café Wanted */}
          <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-montserrat font-bold text-xl text-white">Le Café Wanted</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span className="font-inter text-white/70">Scène physique permanente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span className="font-inter text-white/70">3€ = 1 repas servi le jour même</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span className="font-inter text-white/70">Mur-compteur lumineux temps réel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                <span className="font-inter text-white/70">Soirées thématiques & open-mic</span>
              </li>
            </ul>
          </div>

          {/* Les Lives */}
          <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                <Radio className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-montserrat font-bold text-xl text-white">Les Lives</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span className="font-inter text-white/70">Caisse de résonance temps réel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span className="font-inter text-white/70">Multi-plateforme simultané</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span className="font-inter text-white/70">Compteur qui s'illumine à chaque don</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-1">•</span>
                <span className="font-inter text-white/70">Interaction directe donateurs</span>
              </li>
            </ul>
          </div>

          {/* Origines Media */}
          <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center">
                <Camera className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="font-montserrat font-bold text-xl text-white">Origines Media</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-400 mt-1">•</span>
                <span className="font-inter text-white/70">Atelier de transmutation content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-400 mt-1">•</span>
                <span className="font-inter text-white/70">Shorts TikTok, docs YouTube</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-400 mt-1">•</span>
                <span className="font-inter text-white/70">Podcasts hebdomadaires</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-400 mt-1">•</span>
                <span className="font-inter text-white/70">Formats calibrés pour l'algo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Rôle central des Groupes Facebook */}
        <div className={`mb-20 transform transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-black text-3xl lg:text-4xl text-white mb-4">
              Le Cœur Battant :
              <br />
              <span className="gradient-text-animated">Les Groupes Facebook</span>
            </h3>
            <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto">
              Pépinière d'histoires et radar des besoins sociaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Hash,
                title: 'Détecteur d\'histoires',
                description: 'Posts scannés, protagonistes contactés',
                color: '#1877F2'
              },
              {
                icon: Calendar,
                title: 'Agenda participatif',
                description: 'La communauté vote les thèmes',
                color: '#1877F2'
              },
              {
                icon: Zap,
                title: 'Bourse d\'entraide',
                description: 'Hashtags triés, urgences relayées',
                color: '#1877F2'
              },
              {
                icon: Share2,
                title: 'Amplificateur',
                description: 'Vidéos repostées, impact prouvé',
                color: '#1877F2'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-blue-600/10 to-blue-800/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-montserrat font-bold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="font-inter text-white/60 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rituels hebdomadaires */}
        <div className={`transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="text-center mb-12">
            <h3 className="font-montserrat font-black text-3xl lg:text-4xl text-white mb-4">
              Rituels qui font
              <span className="gradient-text-animated"> tourner la roue</span>
            </h3>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {weeklyRituals.map((ritual, index) => (
                <div
                  key={index}
                  className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-black/60 transition-all duration-500 hover:scale-105"
                >
                  <div className="text-4xl mb-3">{ritual.icon}</div>
                  <div className="font-montserrat font-bold text-white mb-1">
                    {ritual.day}
                  </div>
                  <div className="font-montserrat font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-orange-400 mb-2">
                    {ritual.title}
                  </div>
                  <p className="font-inter text-white/60 text-xs">
                    {ritual.description}
                  </p>
                </div>
              ))}
            </div>
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

export default PartnershipConceptSection;