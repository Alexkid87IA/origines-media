import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Coffee, Pizza, Mic, Calendar, Clock, Users, Building2,
  Wifi, Camera, DollarSign, Target, Sparkles, ArrowRight,
  Sun, Moon, Package, Heart, Book, Phone, BatteryCharging,
  TrendingUp, MapPin, ChevronRight, Play, Settings
} from 'lucide-react';

const PartnershipCafeSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'concept' | 'services' | 'franchise'>('concept');
  const [timeOfDay, setTimeOfDay] = useState<'matin' | 'midi' | 'apres-midi' | 'soir'>('midi');
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
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

  // Configuration des services par moment
  const timeSlots = {
    matin: {
      icon: Sun,
      hours: '7h-11h',
      title: 'Café & Petits-déj',
      activities: [
        'Café/viennoiseries classiques',
        'Formule petit-déj solidaire 3€',
        'Café suspendu',
        'Lecture de presse gratuite'
      ],
      vibe: 'Ambiance calme et chaleureuse',
      revenue: '~300€'
    },
    midi: {
      icon: Pizza,
      hours: '11h30-14h30',
      title: 'Rush Bistrot & Pizza',
      activities: [
        'Plat du jour traditionnel',
        'Pizza Wawa au feu de bois',
        'Formules rapides 10-15€',
        'Zone mange debout'
      ],
      vibe: 'Service efficace, convivial',
      revenue: '~1500€'
    },
    'apres-midi': {
      icon: Mic,
      hours: '14h30-18h',
      title: 'Coworking & Podcasts',
      activities: [
        'Menu Podcast (50-100€/h)',
        'Salon de thé détente',
        'Espace coworking gratuit',
        'Goûters kids friendly'
      ],
      vibe: 'Créativité et collaboration',
      revenue: '~800€'
    },
    soir: {
      icon: Camera,
      hours: '18h-22h',
      title: 'Events & Production',
      activities: [
        'Apéro tapas/pizzas',
        'Tournages Wanted Live',
        'Pitch ton besoin',
        'Masterclass surprise'
      ],
      vibe: 'Studio vivant d\'entraide',
      revenue: '~1200€'
    }
  };

  // Services permanents
  const services = [
    { icon: Package, title: 'Conciergerie', desc: 'Colis, clés, services de quartier' },
    { icon: Book, title: 'Bibliothèque', desc: 'Prêt livres, outils, jeux' },
    { icon: Heart, title: 'Micro-dons', desc: 'Arrondi caisse, cagnotte digitale' },
    { icon: BatteryCharging, title: 'Recharge gratuite', desc: 'Téléphones, ordinateurs' },
    { icon: Users, title: 'Tableau besoins', desc: 'Physique + QR code' },
    { icon: Wifi, title: 'Wifi pro', desc: 'Streaming HD gratuit' }
  ];

  // Menu Podcast packages
  const podcastPackages = [
    {
      name: 'Première fois',
      price: '120€',
      features: ['1h enregistrement', 'Coaching inclus', 'Montage basique'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Creator',
      price: '200€',
      features: ['2h studio', 'Montage pro', '5 clips + miniature'],
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      name: 'Business',
      price: '350€',
      features: ['3h complet', 'Tout inclus', 'Diffusion multi-plateformes'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Données franchise
  const franchiseData = {
    investment: [
      { label: 'Travaux modularité', amount: '50k€' },
      { label: 'Équipement cuisine', amount: '30k€' },
      { label: 'Tech/production', amount: '30k€' },
      { label: 'Mobilier modulable', amount: '20k€' },
      { label: 'Fonds de roulement', amount: '20k€' }
    ],
    projections: [
      { label: 'CA mensuel', value: '75k€' },
      { label: 'Rentabilité', value: 'Mois 6' },
      { label: 'ROI complet', value: '18 mois' },
      { label: 'Marge nette', value: '15-20%' }
    ]
  };

  const tabs = [
    { id: 'concept', label: 'Une journée type', icon: Clock },
    { id: 'services', label: 'Services & Innovation', icon: Sparkles },
    { id: 'franchise', label: 'Devenir franchisé', icon: Building2 }
  ];

  const getTabColor = (tabId: string) => {
    switch(tabId) {
      case 'concept': return 'from-orange-600 to-red-600';
      case 'services': return 'from-purple-600 to-pink-600';
      case 'franchise': return 'from-blue-600 to-indigo-600';
      default: return 'from-orange-600 to-red-600';
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-32 bg-white overflow-hidden"
    >
      {/* Background effects - simplified on mobile */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.08),transparent_50%)]" />
        <div className="hidden md:block absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-8 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase font-medium">
              Révolution Café
            </span>
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          </div>
          
          {/* Main title with animation */}
          <h2 className="font-black text-3xl md:text-5xl lg:text-7xl uppercase tracking-tight text-gray-900 mb-3 md:mb-4 leading-tight">
            Wanted
            <span className="block text-4xl md:text-6xl lg:text-8xl">
              <span className="gradient-text-animated">Café & Co</span>
            </span>
          </h2>
          
          {/* Subtitle with better styling */}
          <p className="text-base md:text-xl lg:text-2xl text-gray-500 max-w-3xl mx-auto px-4 leading-relaxed">
            Le seul café au monde qui 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 font-semibold"> nourrit le jour</span> et devient 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-semibold"> viral la nuit</span>
          </p>
          
          {/* Punchline */}
          <div className="mt-4 md:mt-6">
            <p className="text-sm md:text-base text-gray-400 font-medium">
              Un tiers-lieu rentable qui prouve qu'on peut faire du business ET de l'impact
            </p>
          </div>
        </div>

        {/* Stats rapides */}
        <div className={`grid grid-cols-2 gap-3 md:gap-6 mb-8 md:mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="text-center p-4 md:p-6 bg-gray-50 shadow-sm rounded-xl md:rounded-2xl border border-gray-200">
            <Coffee className="w-6 h-6 md:w-8 md:h-8 text-orange-400 mx-auto mb-1 md:mb-2" />
            <div className="font-bold text-xl md:text-3xl text-gray-900">200</div>
            <div className="text-gray-500 text-xs md:text-sm">couverts/jour</div>
          </div>
          <div className="text-center p-4 md:p-6 bg-gray-50 shadow-sm rounded-xl md:rounded-2xl border border-gray-200">
            <Mic className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mx-auto mb-1 md:mb-2" />
            <div className="font-bold text-xl md:text-3xl text-gray-900">50</div>
            <div className="text-gray-500 text-xs md:text-sm">podcasts/mois</div>
          </div>
          <div className="text-center p-4 md:p-6 bg-gray-50 shadow-sm rounded-xl md:rounded-2xl border border-gray-200">
            <Camera className="w-6 h-6 md:w-8 md:h-8 text-pink-400 mx-auto mb-1 md:mb-2" />
            <div className="font-bold text-xl md:text-3xl text-gray-900">200k</div>
            <div className="text-gray-500 text-xs md:text-sm">vues/soir</div>
          </div>
          <div className="text-center p-4 md:p-6 bg-gray-50 shadow-sm rounded-xl md:rounded-2xl border border-gray-200">
            <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-400 mx-auto mb-1 md:mb-2" />
            <div className="font-bold text-xl md:text-3xl text-gray-900">75k€</div>
            <div className="text-gray-500 text-xs md:text-sm">CA/mois</div>
          </div>
        </div>

        {/* Tabs - Mobile dropdown and desktop tabs */}
        <div className={`mb-8 md:mb-12 transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {/* Mobile dropdown */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileTabOpen(!mobileTabOpen)}
              className="w-full px-4 py-3 bg-gray-50 shadow-sm rounded-xl border border-gray-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {tabs.find(t => t.id === activeTab)?.icon && (
                  <div className="w-5 h-5">
                    {React.createElement(tabs.find(t => t.id === activeTab)!.icon, { className: "w-5 h-5 text-gray-900" })}
                  </div>
                )}
                <span className="text-gray-900 font-medium">
                  {tabs.find(t => t.id === activeTab)?.label}
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${mobileTabOpen ? 'rotate-90' : ''}`} />
            </button>
            
            {mobileTabOpen && (
              <div className="mt-2 bg-gray-50 shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setMobileTabOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r ' + getTabColor(tab.id) + ' text-gray-900'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop tabs */}
          <div className="hidden md:flex justify-center">
            <div className="inline-flex bg-gray-50 shadow-sm rounded-full p-1 border border-gray-200">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="relative px-6 lg:px-8 py-3 rounded-full font-medium transition-colors"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="cafeTabIndicator"
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${getTabColor(tab.id)}`}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                      <tab.icon className="w-5 h-5 mr-2" />
                      <span className="hidden lg:inline">{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenu des tabs */}
        <div className={`transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          
          {/* Tab: Une journée type */}
          {activeTab === 'concept' && (
            <div>
              <h3 className="font-bold text-xl md:text-2xl text-gray-900 text-center mb-6 md:mb-10">
                Un lieu qui vit et se transforme
              </h3>

              {/* Timeline selector - Horizontal scroll on mobile */}
              <div className="overflow-x-auto pb-2 mb-6 md:mb-10">
                <div className="flex justify-start md:justify-center gap-2 min-w-max px-2 md:px-0">
                  {Object.entries(timeSlots).map(([key, slot]) => {
                    const isActive = timeOfDay === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setTimeOfDay(key as any)}
                        className="relative px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-medium transition-colors whitespace-nowrap"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="cafeTimeIndicator"
                            className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-orange-500 to-red-500"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span className={`relative z-10 flex items-center ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                          <slot.icon className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                          <span className="text-sm md:text-base">{slot.hours}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contenu par moment */}
              <div className="grid lg:grid-cols-2 gap-4 md:gap-8 items-center">
                <div className="bg-white shadow-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-200">
                  <h4 className="font-bold text-xl md:text-2xl text-gray-900 mb-1 md:mb-2">
                    {timeSlots[timeOfDay].title}
                  </h4>
                  <p className="text-gray-500 text-sm md:text-base mb-4 md:mb-6">{timeSlots[timeOfDay].vibe}</p>
                  
                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    {timeSlots[timeOfDay].activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-2 md:gap-3">
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-orange-400 flex-shrink-0" />
                        <span className="text-gray-600 text-sm md:text-base">{activity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 md:pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm md:text-base">CA estimé</span>
                      <span className="text-xl md:text-2xl font-bold text-green-400">
                        {timeSlots[timeOfDay].revenue}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visualisation transformation */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-500/10 to-purple-500/10 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-200">
                    <h5 className="font-semibold text-gray-900 text-base md:text-lg mb-3 md:mb-4 text-center">
                      Configuration de l'espace
                    </h5>
                    
                    {timeOfDay === 'midi' && (
                      <div className="space-y-1 md:space-y-2 text-gray-500 text-sm md:text-base">
                        <p>• 80 places assises restaurant</p>
                        <p>• 20 places mange debout</p>
                        <p>• Service rapide optimisé</p>
                        <p>• Four à pizza plein feu</p>
                      </div>
                    )}
                    
                    {timeOfDay === 'apres-midi' && (
                      <div className="space-y-1 md:space-y-2 text-gray-500 text-sm md:text-base">
                        <p>• 4 tables podcast équipées</p>
                        <p>• 12 places coworking</p>
                        <p>• Espace détente canapés</p>
                        <p>• Zone kids surveillée</p>
                      </div>
                    )}
                    
                    {timeOfDay === 'soir' && (
                      <div className="space-y-1 md:space-y-2 text-gray-500 text-sm md:text-base">
                        <p>• Scène centrale 20m²</p>
                        <p>• 60 places spectacle</p>
                        <p>• 3 caméras + éclairage pro</p>
                        <p>• Zone networking/bar</p>
                      </div>
                    )}
                    
                    {timeOfDay === 'matin' && (
                      <div className="space-y-1 md:space-y-2 text-gray-500 text-sm md:text-base">
                        <p>• Comptoir café central</p>
                        <p>• Tables individuelles calmes</p>
                        <p>• Coin lecture presse</p>
                        <p>• Terrasse ensoleillée</p>
                      </div>
                    )}
                    
                    <div className="mt-4 md:mt-6 text-center">
                      <p className="text-xs md:text-sm text-gray-400">Transformation en</p>
                      <p className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                        15 minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Services & Innovation */}
          {activeTab === 'services' && (
            <div>
              {/* Services permanents */}
              <div className="mb-8 md:mb-16">
                <h3 className="font-bold text-xl md:text-2xl text-gray-900 text-center mb-6 md:mb-10">
                  Services solidaires permanents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {services.map((service, idx) => (
                    <div key={idx} className="bg-white shadow-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 hover:border-gray-300 transition-all">
                      <service.icon className="w-8 h-8 md:w-10 md:h-10 text-orange-400 mb-3 md:mb-4" />
                      <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-1 md:mb-2">{service.title}</h4>
                      <p className="text-gray-500 text-xs md:text-sm">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu Podcast Innovation */}
              <div>
                <h3 className="font-bold text-xl md:text-2xl text-gray-900 text-center mb-3 md:mb-4">
                  🎙️ Le Menu Podcast
                </h3>
                <p className="text-center text-gray-500 text-sm md:text-base mb-6 md:mb-10 max-w-2xl mx-auto px-4">
                  "Viens déjeuner, repars avec ton podcast monté" - Transform ta table en studio pro
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
                  {podcastPackages.map((pkg, idx) => (
                    <div key={idx} className={`relative ${pkg.popular ? 'md:-mt-4' : ''}`}>
                      {pkg.popular && (
                        <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 z-10">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 text-xs md:text-sm font-bold px-3 md:px-4 py-1 rounded-full">
                            PLUS POPULAIRE
                          </div>
                        </div>
                      )}
                      
                      <div className={`h-full bg-white shadow-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border transition-all ${
                        pkg.popular ? 'border-yellow-500/30' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <h4 className="font-bold text-lg md:text-xl text-gray-900 mb-1 md:mb-2">
                          {pkg.name}
                        </h4>
                        <p className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${pkg.color} mb-4 md:mb-6`}>
                          {pkg.price}
                        </p>
                        
                        <ul className="space-y-2 md:space-y-3">
                          {pkg.features.map((feature, fidx) => (
                            <li key={fidx} className="flex items-start gap-2">
                              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 text-xs md:text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Setup technique */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 shadow-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/20">
                  <h4 className="font-semibold text-lg md:text-xl text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                    Setup technique anti-bruit
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-gray-600 text-sm md:text-base">
                    <div>
                      <p className="mb-1 md:mb-2">• Micros cardioïdes directionnels</p>
                      <p className="mb-1 md:mb-2">• Panneaux acoustiques design intégrés</p>
                      <p>• Zone podcast avec tables espacées</p>
                    </div>
                    <div>
                      <p className="mb-1 md:mb-2">• Casques monitoring discrets</p>
                      <p className="mb-1 md:mb-2">• Interface audio dans la table</p>
                      <p>• Gobos portables si besoin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Franchise */}
          {activeTab === 'franchise' && (
            <div>
              <h3 className="font-bold text-xl md:text-2xl text-gray-900 text-center mb-6 md:mb-10">
                Rejoins le réseau Wanted Café
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-16">
                {/* Investment */}
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 shadow-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-blue-500/20">
                  <h4 className="font-semibold text-lg md:text-xl text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                    Investment initial : 150k€
                  </h4>
                  <div className="space-y-2 md:space-y-3">
                    {franchiseData.investment.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm md:text-base">{item.label}</span>
                        <span className="font-bold text-blue-400 text-sm md:text-base">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projections */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 shadow-sm rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-500/20">
                  <h4 className="font-semibold text-lg md:text-xl text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                    Projections financières
                  </h4>
                  <div className="space-y-2 md:space-y-3">
                    {franchiseData.projections.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm md:text-base">{item.label}</span>
                        <span className="font-bold text-green-400 text-sm md:text-base">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ce qu'apporte la franchise */}
              <div className="bg-white shadow-sm rounded-2xl md:rounded-3xl p-6 md:p-10 border border-gray-200 mb-8 md:mb-12">
                <h4 className="font-semibold text-lg md:text-xl text-gray-900 mb-6 md:mb-8 text-center">
                  Ce qu'on t'apporte
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Users className="w-10 h-10 md:w-12 md:h-12 text-orange-400 mx-auto mb-2 md:mb-3" />
                    <h5 className="font-semibold text-gray-900 text-base md:text-lg mb-1 md:mb-2">Community 1.5M</h5>
                    <p className="text-gray-500 text-xs md:text-sm">Flux client garanti dès J1</p>
                  </div>
                  <div className="text-center">
                    <Book className="w-10 h-10 md:w-12 md:h-12 text-purple-400 mx-auto mb-2 md:mb-3" />
                    <h5 className="font-semibold text-gray-900 text-base md:text-lg mb-1 md:mb-2">Playbook complet</h5>
                    <p className="text-gray-500 text-xs md:text-sm">Formation + process + outils</p>
                  </div>
                  <div className="text-center">
                    <Camera className="w-10 h-10 md:w-12 md:h-12 text-pink-400 mx-auto mb-2 md:mb-3" />
                    <h5 className="font-semibold text-gray-900 text-base md:text-lg mb-1 md:mb-2">Pipeline contenus</h5>
                    <p className="text-gray-500 text-xs md:text-sm">Events et tournages garantis</p>
                  </div>
                </div>
              </div>

              {/* Timeline expansion */}
              <div className="bg-gradient-to-r from-orange-600/10 via-purple-600/10 to-blue-600/10 shadow-sm rounded-2xl md:rounded-3xl p-6 md:p-10 border border-gray-300">
                <h4 className="font-semibold text-lg md:text-xl text-gray-900 mb-6 md:mb-8 text-center">
                  Plan d'expansion
                </h4>
                <div className="space-y-3 md:space-y-4">
                  {[
                    { year: 'An 1', goal: '3 cafés pilotes', cities: 'Paris, Lyon, Marseille' },
                    { year: 'An 2', goal: '10 franchises', cities: 'Grandes villes' },
                    { year: 'An 3', goal: '20 cafés', cities: '+ version light' },
                    { year: 'An 5', goal: '50 cafés', cities: 'France + Belgique/Suisse' }
                  ].map((phase, idx) => (
                    <div key={idx} className="flex items-center gap-4 md:gap-6">
                      <div className="w-16 md:w-20 text-center flex-shrink-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-1">
                          <span className="text-gray-900 font-bold text-sm md:text-base">{idx + 1}</span>
                        </div>
                        <span className="text-xs text-gray-500">{phase.year}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 text-sm md:text-base">{phase.goal}</h5>
                        <p className="text-gray-500 text-xs md:text-sm">{phase.cities}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Franchise */}
              <div className="text-center mt-8 md:mt-12">
                <p className="text-base md:text-xl text-gray-600 mb-4 md:mb-6 px-4">
                  Profil idéal : Duo complémentaire (resto + impact) avec ancrage local fort
                </p>
                <button className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-gray-900 font-bold text-base md:text-lg hover:scale-105 transition-transform">
                  Demander le dossier franchise
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 inline ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message final */}
        <div className={`mt-12 md:mt-20 text-center transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-orange-600/10 via-purple-600/10 to-pink-600/10 shadow-sm rounded-2xl md:rounded-3xl p-6 md:p-10 border border-gray-300">
            <MapPin className="w-10 h-10 md:w-12 md:h-12 text-orange-400 mx-auto mb-3 md:mb-4" />
            <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-3 md:mb-4">
              Visite le café pilote
            </h3>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto mb-4 md:mb-6 px-4">
              Viens découvrir le concept en vrai au Wanted Café Paris. 
              Prends un café le matin, déjeune le midi, enregistre ton podcast l'après-midi 
              et assiste à un event le soir !
            </p>
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm md:text-base">
              <MapPin className="w-4 h-4 md:w-5 md:h-5" />
              <span>14 rue de la Solidarité, 75011 Paris</span>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .gradient-text-animated {
          background: linear-gradient(135deg, #F97316 0%, #EC4899 25%, #8B5CF6 50%, #3B82F6 75%, #F97316 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 4s ease infinite;
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

export default PartnershipCafeSection;