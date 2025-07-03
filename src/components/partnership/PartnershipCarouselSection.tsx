import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Coffee, Users, TrendingUp, Zap, Calendar, Target, Heart, Share2, DollarSign, Package, Home, Brain, BarChart3, Rocket } from 'lucide-react';

const PartnershipCarouselSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const slides = [
    {
      id: 1,
      type: 'cover',
      title: 'Wanted × Origines Media',
      subtitle: 'Le premier accélérateur d\'entraide phygital',
      punchline: '« Chaque geste devient récit. Chaque récit déclenche un nouveau geste. »',
      bgGradient: 'from-violet-900/20 via-fuchsia-900/20 to-orange-900/20',
      icon: Heart
    },
    {
      id: 2,
      type: 'problem',
      title: 'Le problème',
      subtitle: 'Fracture sociale × Attention émiettée',
      points: [
        '1 Français sur 5 renonce à des besoins essentiels',
        'Les bonnes actions restent locales, invisibles, isolées',
        'Les plateformes captent l\'attention mais pas l\'impact concret'
      ],
      conclusion: 'Il manque un pont entre entraide réelle et puissance médiatique.',
      bgGradient: 'from-red-900/20 via-orange-900/20 to-amber-900/20',
      icon: Zap
    },
    {
      id: 3,
      type: 'solution',
      title: 'Notre solution',
      subtitle: 'Un écosystème vertueux',
      components: [
        { icon: Coffee, label: 'Wanted Café', desc: 'QG physique, micros ouverts' },
        { icon: Users, label: 'Groupes FB', desc: 'Radar des besoins et idées' },
        { icon: TrendingUp, label: 'Lives multi-plateformes', desc: 'Collecte & preuve temps réel' },
        { icon: Zap, label: 'Origines Factory', desc: 'Machine à contenus viraux' }
      ],
      flow: 'Post → Live → Impact → Vidéo → Nouveau post',
      bgGradient: 'from-green-900/20 via-emerald-900/20 to-teal-900/20',
      icon: Rocket
    },
    {
      id: 4,
      type: 'impact',
      title: 'Impact 360°',
      subtitle: 'Cinq piliers et métriques associées',
      pillars: [
        { name: 'Alimentaire', examples: 'Repas suspendus', metrics: '# repas servis', icon: Coffee, color: '#F97316' },
        { name: 'Objets & logistique', examples: '#DonObjets, déménagements', metrics: 'kg réemployés', icon: Package, color: '#8B5CF6' },
        { name: 'Mobilité & logement', examples: 'Covoiturage, #UrgenceLogement', metrics: 'km partagés, nuits', icon: Home, color: '#10B981' },
        { name: 'Compétences', examples: 'Mentorat, ateliers', metrics: 'h bénévolat, jobs', icon: Brain, color: '#EC4899' },
        { name: 'Bien-être & lien', examples: 'Groupes parole, open-mic', metrics: 'participants', icon: Heart, color: '#3B82F6' }
      ],
      bgGradient: 'from-blue-900/20 via-indigo-900/20 to-purple-900/20',
      icon: Target
    },
    {
      id: 5,
      type: 'media',
      title: 'Notre arme secrète média',
      subtitle: 'Pipeline "1 action → 4 formats"',
      formats: [
        { type: 'Short', duration: '15s', platforms: 'TikTok/Reels', desc: 'hook & émotion' },
        { type: 'Clip', duration: '60-90s', platforms: 'X, LinkedIn', desc: 'digest percutant' },
        { type: 'Mini-doc', duration: '6-8min', platforms: 'YouTube', desc: 'profondeur narrative' },
        { type: 'Podcast', duration: '15min', platforms: 'Spotify', desc: 'coulisses & réflexions' }
      ],
      features: [
        'Data-storytelling : overlay temps réel → « 1€ = +1 repas »',
        'Growth : A/B titres, SEO & retargeting donateurs'
      ],
      bgGradient: 'from-violet-900/20 via-purple-900/20 to-fuchsia-900/20',
      icon: Zap
    },
    {
      id: 6,
      type: 'business',
      title: 'Business model hybride',
      subtitle: 'Répartition des revenus',
      revenues: [
        { name: 'Micro-dons live', percentage: 40, color: '#10B981' },
        { name: 'Sponsoring Impact', percentage: 25, color: '#8B5CF6' },
        { name: 'Merch solidaire', percentage: 10, color: '#EC4899' },
        { name: 'Événements privés', percentage: 15, color: '#F97316' },
        { name: 'Subventions', percentage: 10, color: '#3B82F6' }
      ],
      breakeven: 'Break-even visé : mois 18',
      note: 'Tout excédent réinvesti en impacts locaux',
      bgGradient: 'from-emerald-900/20 via-teal-900/20 to-cyan-900/20',
      icon: DollarSign
    },
    {
      id: 7,
      type: 'roadmap',
      title: 'Roadmap 12 mois',
      subtitle: 'Plan de déploiement',
      quarters: [
        { period: 'T1', goal: 'POC Paris', desc: 'Boucle Post/Live/Vidéo, dashboard public' },
        { period: 'T2', goal: 'Sponsoring pilote', desc: 'Premiers formats scalables' },
        { period: 'T3', goal: 'Kit "Wanted City"', desc: 'Duplication Lille & Lyon' },
        { period: 'T4', goal: 'Tournée bus mobile', desc: '1M d\'impacts cumulés' }
      ],
      bgGradient: 'from-orange-900/20 via-red-900/20 to-pink-900/20',
      icon: Calendar
    },
    {
      id: 8,
      type: 'team',
      title: 'Équipe cœur',
      subtitle: 'Les talents clés',
      roles: [
        { poste: 'Showrunner live', power: 'Engagement & gamification chat' },
        { poste: 'Producteur vidéo', power: 'Contenu multi-formats 24h' },
        { poste: 'Community lead FB', power: 'Modé + copy qui convertit' },
        { poste: 'Data-storyteller', power: 'KPI en overlay sexy' },
        { poste: 'BizDev impact', power: 'Cash & marques alignées' }
      ],
      bgGradient: 'from-indigo-900/20 via-blue-900/20 to-cyan-900/20',
      icon: Users
    },
    {
      id: 9,
      type: 'roi',
      title: 'ROI social & économique',
      subtitle: 'À 24 mois',
      metrics: [
        { value: '2M', label: 'd\'impacts mesurés', desc: 'repas, objets, heures, km, nuits' },
        { value: '3×', label: 'vitalité groupe FB', desc: '+5 villes actives' },
        { value: '500k€', label: 'CA annuel', desc: '60% reversé en actions' },
        { value: '÷2', label: 'CAC donateur', desc: 'grâce au recyclage contenus' }
      ],
      bgGradient: 'from-green-900/20 via-emerald-900/20 to-lime-900/20',
      icon: BarChart3
    },
    {
      id: 10,
      type: 'cta',
      title: 'Rejoignez l\'accélérateur d\'entraide',
      subtitle: '3 façons de participer',
      actions: [
        { id: 1, text: 'Investissez ou sponsorisez un pilier d\'impact' },
        { id: 2, text: 'Devenez ville pilote avec le kit "Wanted City"' },
        { id: 3, text: 'Partagez nos contenus pour décupler la boucle' }
      ],
      signature: 'Wanted ♡ Origines Media',
      bgGradient: 'from-violet-900/20 via-fuchsia-900/20 to-purple-900/20',
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
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, isVisible, slides.length]);

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
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <slide.icon className="w-16 h-16 text-violet-400 mb-8" />
            <h1 className="font-montserrat font-black text-4xl lg:text-5xl text-white mb-4">{slide.title}</h1>
            <p className="font-inter text-xl text-violet-300 mb-8">{slide.subtitle}</p>
            <p className="font-playfair italic text-lg text-white/80 max-w-2xl">{slide.punchline}</p>
          </div>
        );

      case 'problem':
        return (
          <div className="flex flex-col justify-center h-full p-12">
            <slide.icon className="w-12 h-12 text-orange-400 mb-6" />
            <h2 className="font-montserrat font-bold text-3xl text-white mb-2">{slide.title}</h2>
            <p className="font-inter text-lg text-orange-300 mb-8">{slide.subtitle}</p>
            <div className="space-y-4 mb-8">
              {slide.points.map((point: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">•</span>
                  <p className="font-inter text-white/80">{point}</p>
                </div>
              ))}
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
              <p className="font-inter text-orange-200">{slide.conclusion}</p>
            </div>
          </div>
        );

      case 'solution':
        return (
          <div className="flex flex-col justify-center h-full p-12">
            <slide.icon className="w-12 h-12 text-green-400 mb-6" />
            <h2 className="font-montserrat font-bold text-3xl text-white mb-2">{slide.title}</h2>
            <p className="font-inter text-lg text-green-300 mb-8">{slide.subtitle}</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {slide.components.map((comp: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <comp.icon className="w-8 h-8 text-green-400 mb-2" />
                  <h4 className="font-montserrat font-bold text-white text-sm mb-1">{comp.label}</h4>
                  <p className="font-inter text-xs text-white/60">{comp.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4">
              <p className="font-inter text-center text-green-200">{slide.flow}</p>
            </div>
          </div>
        );

      case 'impact':
        return (
          <div className="flex flex-col justify-center h-full p-12">
            <slide.icon className="w-12 h-12 text-blue-400 mb-6" />
            <h2 className="font-montserrat font-bold text-3xl text-white mb-2">{slide.title}</h2>
            <p className="font-inter text-lg text-blue-300 mb-8">{slide.subtitle}</p>
            <div className="space-y-3">
              {slide.pillars.map((pillar: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <pillar.icon className="w-6 h-6" style={{ color: pillar.color }} />
                    <div className="flex-1">
                      <h4 className="font-montserrat font-bold text-white text-sm">{pillar.name}</h4>
                      <p className="font-inter text-xs text-white/60">{pillar.examples}</p>
                    </div>
                    <span className="font-inter text-xs font-bold" style={{ color: pillar.color }}>
                      {pillar.metrics}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="flex flex-col justify-center h-full p-12">
            <slide.icon className="w-12 h-12 text-violet-400 mb-6" />
            <h2 className="font-montserrat font-bold text-3xl text-white mb-2">{slide.title}</h2>
            <p className="font-inter text-lg text-violet-300 mb-8">{slide.subtitle}</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {slide.formats.map((format: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-montserrat font-bold text-white text-sm">{format.type}</h4>
                    <span className="text-xs text-violet-400">{format.duration}</span>
                  </div>
                  <p className="font-inter text-xs text-white/60 mb-1">{format.platforms}</p>
                  <p className="font-inter text-xs text-violet-300">{format.desc}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {slide.features.map((feature: string, idx: number) => (
                <p key={idx} className="font-inter text-sm text-white/80">• {feature}</p>
              ))}
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="flex flex-col justify-center h-full p-12">
            <slide.icon className="w-12 h-12 text-emerald-400 mb-6" />
            <h2 className="font-montserrat font-bold text-3xl text-white mb-2">{slide.title}</h2>
            <p className="font-inter text-lg text-emerald-300 mb-8">{slide.subtitle}</p>
            
            {/* Pie chart visualization */}
            <div className="relative h-48 mb-6">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {(() => {
                  let cumulativePercentage = 0;
                  return slide.revenues.map((revenue: any, index: number) => {
                    const startAngle = (cumulativePercentage * 360) / 100 - 90;
                    const endAngle = ((cumulativePercentage + revenue.percentage) * 360) / 100 - 90;
                    cumulativePercentage += revenue.percentage;

                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = (endAngle * Math.PI) / 180;

                    const x1 = 100 + 80 * Math.cos(startAngleRad);
                    const y1 = 100 + 80 * Math.sin(startAngleRad);
                    const x2 = 100 + 80 * Math.cos(endAngleRad);
                    const y2 = 100 + 80 * Math.sin(endAngleRad);

                    const largeArcFlag = revenue.percentage > 50 ? 1 : 0;

                    return (
                      <path
                        key={index}
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={revenue.color}
                        opacity="0.8"
                      />
                    );
                  });
                })()}
              </svg>
            </div>

            <div className="space-y-2 mb-6">
              {slide.revenues.map((revenue: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: revenue.color }} />
                    <span className="font-inter text-sm text-white/80">{revenue.name}</span>
                  </div>
                  <span className="font-montserrat font-bold text-sm" style={{ color: revenue.color }}>
                    {revenue.percentage}%
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <p className="font-inter text-sm text-emerald-200 mb-1">{slide.breakeven}</p>
              <p className="font-inter text-xs text-emerald-300">{slide.note}</p>
            </div>
          </div>
        );

      case 'roadmap':
        return (
          <div className="flex flex-col justify-center h-full p-12">
            <slide.icon className="w-12 h-12 text-orange-400 mb-6" />
            <h2 className="font-montserrat font-bold text-3xl text-white mb-2">{slide.title}</h2>
            <p className="font-inter text-lg text-orange-300 mb-8">{slide.subtitle}</p>
            <div className="grid grid-cols-2 gap-4">
              {slide.quarters.map((quarter: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-montserrat font-black text-2xl text-orange-400">{quarter.period}</span>
                    <h4 className="font-montserrat font-bold text-white">{quarter.goal}</h4>
                  </div>
                  <p className="font-inter text-xs text-white/60">{quarter.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="flex flex-col justify-center h-full p-12">
            <slide.icon className="w-12 h-12 text-indigo-400 mb-6" />
            <h2 className="font-montserrat font-bold text-3xl text-white mb-2">{slide.title}</h2>
            <p className="font-inter text-lg text-indigo-300 mb-8">{slide.subtitle}</p>
            <div className="space-y-3">
              {slide.roles.map((role: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <h4 className="font-montserrat font-bold text-white mb-1">{role.poste}</h4>
                  <p className="font-inter text-sm text-indigo-300">{role.power}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'roi':
        return (
          <div className="flex flex-col justify-center h-full p-12">
            <slide.icon className="w-12 h-12 text-green-400 mb-6" />
            <h2 className="font-montserrat font-bold text-3xl text-white mb-2">{slide.title}</h2>
            <p className="font-inter text-lg text-green-300 mb-8">{slide.subtitle}</p>
            <div className="grid grid-cols-2 gap-4">
              {slide.metrics.map((metric: any, idx: number) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                  <div className="font-montserrat font-black text-3xl text-green-400 mb-1">{metric.value}</div>
                  <div className="font-inter text-sm text-white mb-1">{metric.label}</div>
                  <div className="font-inter text-xs text-white/60">{metric.desc}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-12">
            <slide.icon className="w-16 h-16 text-violet-400 mb-8" />
            <h2 className="font-montserrat font-bold text-3xl text-white mb-4">{slide.title}</h2>
            <p className="font-inter text-lg text-violet-300 mb-8">{slide.subtitle}</p>
            <div className="space-y-4 mb-12">
              {slide.actions.map((action: any) => (
                <div key={action.id} className="flex items-center gap-3">
                  <span className="font-montserrat font-bold text-violet-400">{action.id}.</span>
                  <p className="font-inter text-white/80">{action.text}</p>
                </div>
              ))}
            </div>
            <div className="font-playfair text-2xl text-white">
              {slide.signature}
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
      className="relative py-20 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] overflow-hidden"
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
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <span className="font-inter text-violet-400 text-xs tracking-[0.3em] uppercase font-medium">Deck investisseur</span>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          </div>
          
          <h2 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-4">
            L\'essentiel en
            <br />
            <span className="gradient-text-animated text-5xl md:text-6xl lg:text-7xl">10 slides</span>
          </h2>
          
          <p className="font-inter text-white/60 text-lg max-w-2xl mx-auto">
            Une présentation calibrée pour convaincre en moins de 5 minutes
          </p>
        </div>

        {/* Carousel Container */}
        <div className={`relative transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {/* 3D Perspective Container */}
          <div className="relative perspective-1000 max-w-4xl mx-auto mb-12">
            {/* Glow effects */}
            <div className="absolute -inset-20 bg-gradient-to-r from-violet-600/20 via-transparent to-orange-600/20 blur-3xl opacity-50" />
            
            {/* Main Slide Area with 3D effect */}
            <div className="relative aspect-square transform-gpu transition-transform duration-700 hover:rotate-y-2">
              {/* Shadow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-black/40 blur-2xl rounded-full" />
              
              {/* Card Container */}
              <div className="relative h-full group">
                {/* Decorative frame */}
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-orange-600/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Main card */}
                <div 
                  className={`relative h-full bg-gradient-to-br ${slides[currentSlide].bgGradient} backdrop-blur-2xl rounded-3xl overflow-hidden transition-all duration-500`}
                  style={{
                    boxShadow: `
                      0 25px 50px -12px rgba(0, 0, 0, 0.5),
                      0 0 0 1px rgba(255, 255, 255, 0.1),
                      inset 0 1px 0 0 rgba(255, 255, 255, 0.1)
                    `
                  }}
                >
                  {/* Glass effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.05]" />
                  
                  {/* Content */}
                  <div className="relative h-full">
                    {renderSlideContent(slides[currentSlide])}
                  </div>
                  
                  {/* Slide number indicator */}
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <span className="font-inter text-xs text-white/40">Slide</span>
                    <span className="font-montserrat font-bold text-xl text-white">{currentSlide + 1}</span>
                    <span className="font-inter text-xs text-white/40">/ {slides.length}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows with new design */}
              <button
                onClick={prevSlide}
                className="absolute -left-16 lg:-left-20 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 group hover:scale-110"
              >
                <ChevronLeft className="w-7 h-7 text-white group-hover:text-violet-300 transition-colors" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute -right-16 lg:-right-20 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 group hover:scale-110"
              >
                <ChevronRight className="w-7 h-7 text-white group-hover:text-violet-300 transition-colors" />
              </button>
            </div>
          </div>

          {/* Enhanced Slide Indicators */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative group"
              >
                <div className={`h-2 rounded-full transition-all duration-500 ${
                  currentSlide === index 
                    ? 'w-12 bg-gradient-to-r from-violet-500 to-orange-500' 
                    : 'w-2 bg-white/20 hover:bg-white/40 hover:w-3'
                }`} />
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {slide.title}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Controls section */}
          <div className="flex flex-col items-center gap-4">
            {/* Auto-play toggle with better design */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`font-inter text-sm px-6 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 flex items-center gap-3 ${
                isAutoPlaying 
                  ? 'bg-gradient-to-r from-violet-500/20 to-orange-500/20 border-violet-500/50 text-white' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white/80'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-white/40'}`} />
              {isAutoPlaying ? 'Lecture automatique activée' : 'Activer la lecture automatique'}
            </button>

            {/* Download/Share section */}
            <div className="flex items-center gap-4 text-center">
              <p className="font-inter text-sm text-white/40">
                Format 1080×1080 • Optimisé pour les réseaux sociaux
              </p>
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

        .perspective-1000 {
          perspective: 1000px;
        }

        .rotate-y-2:hover {
          transform: rotateY(2deg);
        }

        .transform-gpu {
          transform: translateZ(0);
        }
      `}</style>
    </section>
  );
};

export default PartnershipCarouselSection;