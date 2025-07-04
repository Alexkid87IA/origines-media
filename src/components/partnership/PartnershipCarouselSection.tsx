import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Coffee, Users, TrendingUp, Zap, Calendar, Target, Heart, Share2, DollarSign, Package, Home, Brain, BarChart3, Rocket, Film, Globe, Shield } from 'lucide-react';

const PartnershipCarouselSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const slides = [
    {
      id: 1,
      type: 'cover',
      title: 'Wanted × Origines Media',
      subtitle: 'L\'empire média de l\'entraide',
      punchline: '« 1.5M de membres. 12 verticales. 0€ de monétisation média. C\'est fini. »',
      bgGradient: 'from-orange-900/20 via-purple-900/20 to-pink-900/20',
      icon: Heart
    },
    {
      id: 2,
      type: 'problem',
      title: 'Le constat brutal',
      subtitle: '90% de valeur perdue',
      points: [
        '1.5 million de membres ultra-engagés sur Facebook',
        'Des milliers d\'histoires qui changent des vies chaque jour',
        'Mais tout meurt dans le flux, aucune monétisation, impact non mesuré'
      ],
      conclusion: 'C\'est comme posséder Netflix mais diffuser sur Périscope.',
      bgGradient: 'from-red-900/20 via-orange-900/20 to-amber-900/20',
      icon: TrendingUp
    },
    {
      id: 3,
      type: 'solution',
      title: 'La transformation',
      subtitle: 'De Facebook à empire média',
      components: [
        { icon: Users, label: 'Wanted', desc: 'La scène : 1.5M membres, 12 verticales' },
        { icon: Film, label: 'Origines', desc: 'La machine : 200 contenus/mois' },
        { icon: Zap, label: 'Ensemble', desc: 'L\'alchimie : stories → viral → revenus' },
        { icon: Heart, label: 'Impact', desc: '100% réinvesti dans l\'entraide' }
      ],
      flow: '1 histoire Facebook → 1 tournage pro → 14 formats → 1M vues → Actions financées',
      bgGradient: 'from-violet-900/20 via-purple-900/20 to-indigo-900/20',
      icon: Rocket
    },
    {
      id: 4,
      type: 'verticales',
      title: 'Les 12 empires verticaux',
      subtitle: 'Chacun son audience, sa ligne édito, ses sponsors',
      verticales: [
        { name: 'WantedAnimaux', metric: '500 adoptions/mois', sponsor: 'Purina', color: '#F97316' },
        { name: 'WantedBusiness', metric: '50 entreprises créées', sponsor: 'LinkedIn', color: '#3B82F6' },
        { name: 'WantedLogement', metric: '200 hébergements', sponsor: 'Airbnb', color: '#10B981' },
        { name: 'WantedSanté', metric: '300 consultations', sponsor: 'Doctolib', color: '#EC4899' }
      ],
      total: '12 verticales = 12 business units autonomes',
      bgGradient: 'from-blue-900/20 via-purple-900/20 to-pink-900/20',
      icon: Globe
    },
    {
      id: 5,
      type: 'troc',
      title: 'Le troc réinventé',
      subtitle: 'L\'économie circulaire qui génère des vues',
      ecosystem: [
        { step: 'Post Facebook', desc: 'Marie cherche un vélo', icon: Users },
        { step: 'Live Wanted', desc: 'Paul propose d\'échanger', icon: Coffee },
        { step: 'Match trouvé', desc: 'Sophie complète le triangle', icon: Zap },
        { step: 'Story virale', desc: '1M vues = 50 nouveaux trocs', icon: Heart }
      ],
      stats: {
        monthly: '10k échanges/mois',
        value: '500k€ de valeur échangée',
        impact: 'Zéro déchet, 100% solidaire'
      },
      bgGradient: 'from-green-900/20 via-emerald-900/20 to-cyan-900/20',
      icon: Package
    },
    {
      id: 6,
      type: 'orchestration',
      title: 'La machine parfaitement huilée',
      subtitle: 'Du post Facebook aux millions d\'euros',
      flow: [
        { source: 'Groupes FB', action: 'Détection besoins', result: '1000 posts/jour', icon: Users },
        { source: 'Cafés Wanted', action: 'Lives quotidiens', result: '50k€ dons/mois', icon: Coffee },
        { source: 'Production', action: 'Stories virales', result: '20M vues/mois', icon: Film },
        { source: 'Data & Sponsors', action: 'Monétisation', result: '400k€/mois', icon: DollarSign }
      ],
      magic: 'Chaque euro gagné = 1 action financée. La boucle est bouclée.',
      bgGradient: 'from-orange-900/20 via-purple-900/20 to-blue-900/20',
      icon: Target
    },
    {
      id: 7,
      type: 'production',
      title: 'La machine de production',
      subtitle: '1 tournage = 14 contenus = 100x plus de reach',
      formula: {
        input: '1 histoire touchante filmée en live',
        outputs: [
          { format: '1 vidéo longue', detail: '15-20 min YouTube' },
          { format: '10 shorts', detail: 'TikTok, Reels, Shorts' },
          { format: '3 carrousels', detail: 'LinkedIn, Instagram' },
          { format: '1 podcast', detail: 'Version audio Spotify' }
        ]
      },
      stats: '200 contenus/mois × 12 verticales = 2400/an',
      bgGradient: 'from-pink-900/20 via-purple-900/20 to-violet-900/20',
      icon: Film
    },
    {
      id: 8,
      type: 'tech',
      title: 'La tech qui scale',
      subtitle: 'IA + Algorithmes + Data = Machine automatisée',
      features: [
        { name: 'IA Editor', desc: 'Découpe automatique en shorts', icon: Brain },
        { name: 'Smart Titles', desc: 'A/B testing des accroches', icon: Target },
        { name: 'Impact Tracker', desc: 'Dashboard temps réel', icon: BarChart3 },
        { name: 'Viral Engine', desc: 'Optimisation multi-plateformes', icon: Zap }
      ],
      result: 'Production 10x plus rapide, reach 100x plus large',
      bgGradient: 'from-cyan-900/20 via-blue-900/20 to-indigo-900/20',
      icon: Shield
    },
    {
      id: 9,
      type: 'business',
      title: 'Modèle économique',
      subtitle: '400k€/mois de potentiel',
      revenues: [
        { name: 'Sponsors verticales', amount: '30k€ × 12', color: '#8B5CF6' },
        { name: 'Branded content', amount: '40k€/mois', color: '#EC4899' },
        { name: 'Events & activations', amount: '20k€/mois', color: '#F97316' },
        { name: 'Formations & masterclass', amount: '15k€/mois', color: '#10B981' }
      ],
      distribution: '50% production Origines, 50% actions terrain Wanted',
      bgGradient: 'from-emerald-900/20 via-green-900/20 to-teal-900/20',
      icon: DollarSign
    },
    {
      id: 10,
      type: 'traction',
      title: 'La traction actuelle',
      subtitle: 'Les preuves que ça marche déjà',
      metrics: [
        { label: 'Membres actifs', value: '1.5M', growth: '+15%/mois' },
        { label: 'Vues actuelles', value: '2M/mois', growth: 'Potentiel: 20M' },
        { label: 'Actions terrain', value: '50k/an', growth: 'Objectif: 500k' },
        { label: 'Cafés ouverts', value: '3 villes', growth: 'Plan: 20 villes' }
      ],
      highlight: 'La communauté est là. Il manque juste la machine média.',
      bgGradient: 'from-orange-900/20 via-red-900/20 to-pink-900/20',
      icon: BarChart3
    },
    {
      id: 11,
      type: 'roadmap',
      title: 'Les 4 actes de transformation',
      subtitle: 'De 0 à 10M€ en 3 ans',
      phases: [
        { name: 'Sprint 30j', goal: '200 contenus/mois', desc: 'Machine lancée', icon: Rocket },
        { name: '6 mois', goal: '20M vues/mois', desc: '12 verticales actives', icon: Target },
        { name: '1 an', goal: '500k€ CA', desc: 'Autofinancé', icon: TrendingUp },
        { name: '3 ans', goal: '10M€ CA', desc: 'Netflix de la solidarité', icon: Globe }
      ],
      bgGradient: 'from-violet-900/20 via-purple-900/20 to-pink-900/20',
      icon: Calendar
    },
    {
      id: 12,
      type: 'team',
      title: 'L\'équipe de choc',
      subtitle: '120+ passionnés prêts à transformer l\'entraide',
      stats: [
        { role: '2 fondateurs visionnaires', detail: 'Wanted + Origines' },
        { role: '50 créateurs de contenus', detail: 'Tous formats' },
        { role: '12 responsables verticales', detail: '1 expert/thématique' },
        { role: '10 développeurs', detail: 'Tech & IA' }
      ],
      culture: 'Impact first. Authenticité. Excellence Netflix.',
      bgGradient: 'from-indigo-900/20 via-purple-900/20 to-pink-900/20',
      icon: Users
    },
    {
      id: 13,
      type: 'impact',
      title: 'L\'impact projeté',
      subtitle: 'Ce qu\'on va accomplir ensemble',
      projections: [
        { timeline: '6 mois', metric: '100k actions financées', equivalent: '= 1 stade de France aidé' },
        { timeline: '1 an', metric: '1M heures de bénévolat', equivalent: '= 500 emplois créés' },
        { timeline: '2 ans', metric: '5M personnes touchées', equivalent: '= Lyon + Marseille' },
        { timeline: '3 ans', metric: '10M€ redistribués', equivalent: '= 1000 vies transformées' }
      ],
      bgGradient: 'from-green-900/20 via-emerald-900/20 to-teal-900/20',
      icon: Heart
    },
    {
      id: 14,
      type: 'cta',
      title: 'Le futur commence dans 48h',
      subtitle: 'On se voit. On pose tout. On lance.',
      actions: [
        { text: 'Dans 48h → Workshop stratégie ensemble' },
        { text: 'Dans 30 jours → 200 premiers contenus en ligne' },
        { text: 'Dans 6 mois → Tu ne reconnais plus Wanted' },
        { text: 'Dans 3 ans → Standard mondial créé' }
      ],
      punchline: 'Tes 1.5M de membres méritent mieux qu\'un groupe Facebook.',
      bgGradient: 'from-orange-900/20 via-purple-900/20 to-violet-900/20',
      icon: Share2
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

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying && isVisible) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, isVisible, slides.length]);

  // Touch handlers pour mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const renderSlideContent = (slide: any) => {
    switch (slide.type) {
      case 'cover':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-12">
            <slide.icon className="w-12 h-12 md:w-20 md:h-20 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-4 md:mb-8" />
            <div className="flex items-center justify-center gap-2 md:gap-6 mb-4 md:mb-8">
              {/* Logo Wanted */}
              <img 
                src="https://wanted.community/wp-content/uploads/2019/12/logo-wanted-community-.png" 
                alt="Wanted Community" 
                className="h-10 md:h-16 lg:h-20 object-contain"
              />
              
              {/* Symbole × */}
              <span className="font-bold text-2xl md:text-4xl lg:text-5xl text-white/80">×</span>
              
              {/* Logo Origines */}
              <img 
                src="https://res.cloudinary.com/diqco2njt/image/upload/v1751568726/LOGO_ORIGINES_WHITE_pzbo2m.png" 
                alt="Origines Media" 
                className="h-10 md:h-16 lg:h-20 object-contain"
              />
            </div>
            
            <p className="text-base md:text-xl text-white/80 mb-4 md:mb-8">{slide.subtitle}</p>
            <p className="text-sm md:text-lg text-white/60 max-w-3xl italic px-4">{slide.punchline}</p>
          </div>
        );

      case 'problem':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-red-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-red-300 mb-4 md:mb-8">{slide.subtitle}</p>
            <div className="space-y-2 md:space-y-4 mb-4 md:mb-8">
              {slide.points.map((point: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 md:gap-3">
                  <span className="text-red-400 mt-0.5 md:mt-1">•</span>
                  <p className="text-sm md:text-base text-white/80">{point}</p>
                </div>
              ))}
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-red-200 font-semibold">{slide.conclusion}</p>
            </div>
          </div>
        );

      case 'solution':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-violet-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-violet-300 mb-4 md:mb-8">{slide.subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-8">
              {slide.components.map((comp: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 hover:border-violet-500/30 transition-all">
                  <comp.icon className="w-6 h-6 md:w-8 md:h-8 text-violet-400 mb-1 md:mb-2" />
                  <h4 className="font-bold text-white text-xs md:text-sm mb-0.5 md:mb-1">{comp.label}</h4>
                  <p className="text-xs text-white/60">{comp.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-center text-violet-200">{slide.flow}</p>
            </div>
          </div>
        );

      case 'verticales':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-blue-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-blue-300 mb-4 md:mb-8">{slide.subtitle}</p>
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              {slide.verticales.map((vert: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <h4 className="font-bold text-sm md:text-base text-white" style={{ color: vert.color }}>
                        {vert.name}
                      </h4>
                      <p className="text-xs md:text-sm text-white/60">{vert.metric}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs text-white/40">Sponsor type</p>
                      <p className="text-xs md:text-sm font-semibold text-white/80">{vert.sponsor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-center text-blue-200 font-semibold">{slide.total}</p>
            </div>
          </div>
        );

      case 'troc':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-green-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-green-300 mb-4 md:mb-8">{slide.subtitle}</p>
            
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              {slide.ecosystem.map((step: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 md:gap-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3">
                  <step.icon className="w-5 h-5 md:w-6 md:h-6 text-green-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-xs md:text-sm truncate">{step.step}</h4>
                    <p className="text-xs text-white/60 truncate">{step.desc}</p>
                  </div>
                  {idx < slide.ecosystem.length - 1 && (
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-green-400/50 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                <div>
                  <p className="font-bold text-xs md:text-base text-green-400">{slide.stats.monthly}</p>
                  <p className="text-xs text-white/60">Volume</p>
                </div>
                <div>
                  <p className="font-bold text-xs md:text-base text-emerald-400">{slide.stats.value}</p>
                  <p className="text-xs text-white/60">Valeur</p>
                </div>
                <div>
                  <p className="font-bold text-xs md:text-base text-cyan-400">{slide.stats.impact}</p>
                  <p className="text-xs text-white/60">Impact</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'orchestration':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-orange-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-orange-300 mb-4 md:mb-8">{slide.subtitle}</p>
            
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              {slide.flow.map((step: any, idx: number) => (
                <div key={idx} className="relative">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-white text-xs md:text-sm">{step.source}</h4>
                          <p className="text-xs text-white/60">{step.action}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="font-bold text-xs md:text-sm text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                            {step.result}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {idx < slide.flow.length - 1 && (
                    <div className="ml-5 md:ml-6 h-3 md:h-4 w-px bg-gradient-to-b from-white/20 to-transparent" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-center text-white font-semibold">{slide.magic}</p>
            </div>
          </div>
        );

      case 'production':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-pink-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-pink-300 mb-4 md:mb-8">{slide.subtitle}</p>
            
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-6">
              <p className="text-sm md:text-base text-white/80 mb-3 md:mb-4 text-center">{slide.formula.input}</p>
              <div className="flex justify-center mb-3 md:mb-4">
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-pink-400 animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {slide.formula.outputs.map((output: any, idx: number) => (
                  <div key={idx} className="bg-pink-500/10 rounded-lg p-2 md:p-3">
                    <p className="font-bold text-xs md:text-sm text-pink-400">{output.format}</p>
                    <p className="text-xs text-white/60">{output.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-center text-pink-200 font-semibold">{slide.stats}</p>
            </div>
          </div>
        );

      case 'tech':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-cyan-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-cyan-300 mb-4 md:mb-8">{slide.subtitle}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              {slide.features.map((feature: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 mb-1 md:mb-2" />
                  <h4 className="font-bold text-white text-xs md:text-sm mb-0.5 md:mb-1">{feature.name}</h4>
                  <p className="text-xs text-white/60">{feature.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-center text-cyan-200 font-semibold">{slide.result}</p>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-emerald-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-emerald-300 mb-4 md:mb-8">{slide.subtitle}</p>
            
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              {slide.revenues.map((revenue: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm md:text-base font-semibold text-white">{revenue.name}</h4>
                    <span className="font-bold text-sm md:text-lg" style={{ color: revenue.color }}>
                      {revenue.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-center text-emerald-200 font-semibold">{slide.distribution}</p>
            </div>
          </div>
        );

      case 'traction':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-orange-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-orange-300 mb-4 md:mb-8">{slide.subtitle}</p>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              {slide.metrics.map((metric: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
                  <p className="text-xs md:text-sm text-white/60 mb-0.5 md:mb-1">{metric.label}</p>
                  <p className="font-black text-lg md:text-2xl text-orange-400">{metric.value}</p>
                  <p className="text-xs text-green-400">{metric.growth}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-center text-orange-200 font-semibold">{slide.highlight}</p>
            </div>
          </div>
        );

      case 'roadmap':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-violet-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-violet-300 mb-4 md:mb-8">{slide.subtitle}</p>
            
            <div className="space-y-3 md:space-y-4">
              {slide.phases.map((phase: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <phase.icon className="w-8 h-8 md:w-10 md:h-10 text-violet-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 md:gap-2">
                        <h4 className="font-bold text-white text-sm md:text-base">{phase.name}</h4>
                        <span className="text-xs md:text-sm text-violet-400">{phase.goal}</span>
                      </div>
                      <p className="text-xs text-white/60">{phase.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-indigo-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-indigo-300 mb-4 md:mb-8">{slide.subtitle}</p>
            
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              {slide.stats.map((stat: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
                  <h4 className="font-bold text-white text-sm md:text-base mb-0.5 md:mb-1">{stat.role}</h4>
                  <p className="text-xs md:text-sm text-indigo-300">{stat.detail}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg md:rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-center text-indigo-200 font-semibold">{slide.culture}</p>
            </div>
          </div>
        );

      case 'impact':
        return (
          <div className="flex flex-col justify-center h-full p-6 md:p-12">
            <slide.icon className="w-8 h-8 md:w-12 md:h-12 text-green-400 mb-4 md:mb-6" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-1 md:mb-2">{slide.title}</h2>
            <p className="text-sm md:text-lg text-green-300 mb-4 md:mb-8">{slide.subtitle}</p>
            
            <div className="space-y-3 md:space-y-4">
              {slide.projections.map((proj: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-0.5 md:mb-1">
                    <span className="font-bold text-green-400 text-sm md:text-base">{proj.timeline}</span>
                    <span className="font-bold text-base md:text-xl text-white">{proj.metric}</span>
                  </div>
                  <p className="text-xs md:text-sm text-green-300">{proj.equivalent}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-12">
            <slide.icon className="w-12 h-12 md:w-16 md:h-16 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 mb-4 md:mb-8" />
            <h2 className="font-bold text-xl md:text-3xl text-white mb-2 md:mb-4">{slide.title}</h2>
            <p className="text-sm md:text-lg text-white/80 mb-4 md:mb-8">{slide.subtitle}</p>
            
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-8 text-left w-full max-w-md">
              {slide.actions.map((action: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 md:gap-3">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 flex-shrink-0" />
                  <p className="text-sm md:text-base text-white/80">{action.text}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 rounded-lg md:rounded-xl p-4 md:p-6 border border-white/20">
              <p className="text-base md:text-xl text-white font-semibold">{slide.punchline}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-10 md:py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpath d='M60 0v120M0 60h120'/%3E%3Ccircle cx='60' cy='60' r='40' stroke-dasharray='2,4'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-8 md:mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-2 md:gap-4 mb-4 md:mb-8">
            <div className="w-12 md:w-24 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase font-medium">Success Story</span>
            <div className="w-12 md:w-24 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>
          
          <h2 className="font-black text-2xl md:text-4xl lg:text-6xl uppercase tracking-tight text-white mb-2 md:mb-4">
            La transformation
            <br />
            <span className="gradient-text-animated text-3xl md:text-5xl lg:text-7xl">en {slides.length} slides</span>
          </h2>
          
          <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto px-4">
            Comment transformer 1.5M de membres Facebook en empire média de l'entraide
          </p>
        </div>

        {/* Carousel Container */}
        <div className={`relative transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {/* 3D Perspective Container */}
          <div className="relative max-w-4xl mx-auto mb-8 md:mb-12">
            {/* Glow effects - Hidden on mobile for performance */}
            <div className="hidden md:block absolute -inset-20 bg-gradient-to-r from-orange-600/20 via-transparent to-purple-600/20 blur-3xl opacity-50" />
            
            {/* Main Slide Area */}
            <div 
              className="relative aspect-square sm:aspect-[4/3] md:aspect-square transition-transform duration-700"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Shadow - Simplified on mobile */}
              <div className="hidden md:block absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-black/40 blur-2xl rounded-full" />
              
              {/* Card Container */}
              <div className="relative h-full group">
                {/* Decorative frame - Hidden on mobile */}
                <div className="hidden md:block absolute -inset-4 bg-gradient-to-r from-orange-600/20 to-purple-600/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Main card */}
                <div 
                  className={`relative h-full bg-gradient-to-br ${slides[currentSlide].bgGradient} backdrop-blur-xl md:backdrop-blur-2xl rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500`}
                  style={{
                    boxShadow: `
                      0 10px 25px -5px rgba(0, 0, 0, 0.3),
                      0 0 0 1px rgba(255, 255, 255, 0.1),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
                    `
                  }}
                >
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.05]" />
                  
                  {/* Content */}
                  <div className="relative h-full overflow-y-auto md:overflow-hidden">
                    {renderSlideContent(slides[currentSlide])}
                  </div>
                  
                  {/* Slide number indicator */}
                  <div className="absolute top-3 right-3 md:top-6 md:right-6 flex items-center gap-1 md:gap-2 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5">
                    <span className="text-xs text-white/40">Slide</span>
                    <span className="font-bold text-sm md:text-xl text-white">{currentSlide + 1}</span>
                    <span className="text-xs text-white/40">/ {slides.length}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows - Hidden on mobile (using swipe) */}
              <button
                onClick={prevSlide}
                className="hidden md:flex absolute -left-16 lg:-left-20 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl items-center justify-center hover:bg-white/20 transition-all duration-300 group hover:scale-110"
              >
                <ChevronLeft className="w-7 h-7 text-white group-hover:text-orange-300 transition-colors" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden md:flex absolute -right-16 lg:-right-20 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl items-center justify-center hover:bg-white/20 transition-all duration-300 group hover:scale-110"
              >
                <ChevronRight className="w-7 h-7 text-white group-hover:text-purple-300 transition-colors" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden justify-center gap-4 mb-6">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Enhanced Slide Indicators */}
          <div className="flex items-center justify-center gap-1.5 md:gap-3 mb-6 md:mb-8 overflow-x-auto pb-2">
            <div className="flex gap-1.5 md:gap-3">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="relative group flex-shrink-0"
                >
                  <div className={`h-2 rounded-full transition-all duration-500 ${
                    currentSlide === index 
                      ? 'w-8 md:w-12 bg-gradient-to-r from-orange-500 to-purple-500' 
                      : 'w-2 bg-white/20 hover:bg-white/40 hover:w-3'
                  }`} />
                  {/* Tooltip - Hidden on mobile */}
                  <div className="hidden md:block absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {slide.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Controls section */}
          <div className="flex flex-col items-center gap-3 md:gap-4">
            {/* Auto-play toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`text-xs md:text-sm px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border backdrop-blur-sm transition-all duration-300 flex items-center gap-2 md:gap-3 ${
                isAutoPlaying 
                  ? 'bg-gradient-to-r from-orange-500/20 to-purple-500/20 border-orange-500/50 text-white' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white/80'
              }`}
            >
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-white/40'}`} />
              {isAutoPlaying ? 'Lecture auto activée' : 'Activer lecture auto'}
            </button>

            {/* Swipe indicator for mobile */}
            <p className="md:hidden text-xs text-white/40 flex items-center gap-2">
              <ChevronLeft className="w-3 h-3" />
              Glissez pour naviguer
              <ChevronRight className="w-3 h-3" />
            </p>

            {/* Download/Share section */}
            <div className="flex items-center gap-4 text-center">
              <p className="text-xs md:text-sm text-white/40">
                Présentation optimisée pour convaincre en 5 minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gradient-text-animated {
          background: linear-gradient(135deg, #F97316 0%, #EC4899 50%, #8B5CF6 100%);
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

        /* Scrollbar styling for mobile */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
          }
        }
      `}</style>
    </section>
  );
};

export default PartnershipCarouselSection;