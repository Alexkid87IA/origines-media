import React, { useState, useEffect, useRef } from 'react';
import { 
  Coffee, Users, TrendingUp, GraduationCap, 
  MapPin, Globe, Rocket, Target, Calendar,
  Building2, Tv, ShoppingBag, BookOpen,
  ChevronRight, Clock, Zap, Trophy, BarChart3,
  Play, FileText, Hash, Eye, DollarSign,
  Layers, Heart, Home, Car, Briefcase,
  Book, Activity, Shirt, Palette, Leaf,
  Baby, Accessibility, Film, Smartphone
} from 'lucide-react';

const PartnershipVisionSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState(0);
  const [activeSection, setActiveSection] = useState('timeline');
  const [selectedVerticale, setSelectedVerticale] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Les 12 verticales avec leurs données complètes
  const verticales = [
    { id: 1, name: 'Animaux', icon: Heart, color: '#EC4899', desc: 'Adoptions, pet-sitting, vétos solidaires', edito: 'mignon + urgent + solution = adoption' },
    { id: 2, name: 'Alimentation', icon: Coffee, color: '#F97316', desc: 'Repas suspendus, anti-gaspi', edito: 'faim + partage + dignité = satiété' },
    { id: 3, name: 'Logement', icon: Home, color: '#10B981', desc: 'Couch-surfing, urgences', edito: 'galère + solidarité + toit = dignité' },
    { id: 4, name: 'Mobilité', icon: Car, color: '#3B82F6', desc: 'Covoiturage, prêt vélos', edito: 'distance + partage + trajet = liberté' },
    { id: 5, name: 'Business', icon: Briefcase, color: '#8B5CF6', desc: 'Mentors, micro-invest', edito: 'échec + mentor + rebond = success' },
    { id: 6, name: 'Formation', icon: Book, color: '#6366F1', desc: 'Soutien scolaire, MOOC', edito: 'ignorance + savoir + partage = compétence' },
    { id: 7, name: 'Santé', icon: Activity, color: '#EF4444', desc: 'Sport solidaire, écoute', edito: 'mal-être + soutien + action = mieux-être' },
    { id: 8, name: 'Mode', icon: Shirt, color: '#A855F7', desc: 'Dressing circulaire', edito: 'gaspillage + créativité + seconde vie = style' },
    { id: 9, name: 'Culture', icon: Palette, color: '#F59E0B', desc: 'Billets suspendus, scènes', edito: 'exclusion + art + partage = émerveillement' },
    { id: 10, name: 'Environnement', icon: Leaf, color: '#84CC16', desc: 'Repair cafés, troc plantes', edito: 'déchet + réparation + transmission = durabilité' },
    { id: 11, name: 'Famille', icon: Baby, color: '#06B6D4', desc: 'Gardes, jouets, aide', edito: 'isolement + entraide + lien = famille élargie' },
    { id: 12, name: 'Seniors', icon: Accessibility, color: '#64748B', desc: 'Visites, petits travaux', edito: 'solitude + présence + utilité = joie de vivre' }
  ];

  // Les 4 lignes du métro
  const metroLines = [
    {
      id: 'phygital',
      name: 'Ligne Phygital',
      color: '#F97316',
      icon: Coffee,
      description: 'Cafés + studios événementiels'
    },
    {
      id: 'media',
      name: 'Ligne Media',
      color: '#8B5CF6',
      icon: Tv,
      description: '200 contenus/mois multi-formats'
    },
    {
      id: 'marketplace',
      name: 'Ligne Marketplace',
      color: '#10B981',
      icon: ShoppingBag,
      description: 'Dons, troc, services, IA Valuator'
    },
    {
      id: 'academy',
      name: 'Ligne Academy',
      color: '#3B82F6',
      icon: GraduationCap,
      description: 'Formations, certifications, mentorat'
    }
  ];

  // Timeline data
  const timeframes = [
    {
      id: 0,
      label: 'MAINTENANT',
      title: '1,5M membres',
      description: 'Un trésor inexploité',
      stats: {
        members: '1,5M',
        exchanges: '—',
        cities: '1',
        impact: '0€'
      },
      lines: {
        phygital: ['Café Paris'],
        media: [],
        marketplace: [],
        academy: []
      }
    },
    {
      id: 1,
      label: 'SPRINT 30J',
      title: 'Brain-juice',
      description: '200 contenus/mois',
      stats: {
        members: '10k',
        exchanges: '5k',
        cities: '1',
        impact: '1M vues'
      },
      lines: {
        phygital: ['Café Paris 2.0', 'Studio'],
        media: ['200 contenus/mois', '2 tests'],
        marketplace: ['IA Valuator', 'Hashtags'],
        academy: ['Module pilote', '30 certifiés']
      }
    },
    {
      id: 2,
      label: '6 MOIS',
      title: '12 chaînes',
      description: '20M de vues',
      stats: {
        members: '50k',
        exchanges: '25k',
        cities: '3',
        impact: '20M vues'
      },
      lines: {
        phygital: ['Hub Lille', 'Hub Lyon', 'Events'],
        media: ['12 verticales', 'StoryCrafter IA'],
        marketplace: ['Matching IA', '12 flux'],
        academy: ['5 parcours', 'Bootcamp']
      }
    },
    {
      id: 3,
      label: '1 AN',
      title: 'Cash solidaire',
      description: 'Autofinancement',
      stats: {
        members: '200k',
        exchanges: '500k',
        cities: '7',
        impact: '100M/an'
      },
      lines: {
        phygital: ['5 hubs FR', 'Mexico', 'LA'],
        media: ['2400 contenus/an', 'Wanted Daily'],
        marketplace: ['API ouverte', 'Trust Score'],
        academy: ['500 entreprises', '25k apprenants']
      }
    },
    {
      id: 4,
      label: '3 ANS',
      title: 'Netflix Solidaire',
      description: 'LE média référence',
      stats: {
        members: '5M',
        exchanges: '10M',
        cities: '20',
        impact: '1Md/an'
      },
      lines: {
        phygital: ['20 villes', 'WantedFest'],
        media: ['10k contenus/an', 'Fiction'],
        marketplace: ['12 verticales', '10M€ CA'],
        academy: ['University', '100k certifiés']
      }
    }
  ];

  // Production mensuelle détaillée
  const productionData = {
    total: 200,
    breakdown: [
      { type: 'Longs', count: 8, desc: '15-20 min', icon: Film, color: '#8B5CF6' },
      { type: 'Moyens', count: 40, desc: '3-5 min', icon: Play, color: '#EC4899' },
      { type: 'Shorts', count: 120, desc: '15-60s', icon: Smartphone, color: '#F97316' },
      { type: 'Carrousels', count: 32, desc: 'Data stories', icon: Layers, color: '#10B981' }
    ]
  };

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

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8 xl:px-16 bg-white overflow-hidden"
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
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transform transition-all duration-3000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
            <div className="w-12 sm:w-16 lg:w-24 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <span className="font-inter text-violet-400 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase font-medium">Vision 3.0</span>
            <div className="w-12 sm:w-16 lg:w-24 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          </div>
          
          <h2 className="font-montserrat font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl uppercase tracking-tight text-gray-900 mb-2 sm:mb-4">
            Wanted × Origines :
            <br />
            <span className="gradient-text-animated text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">La Machine Média</span>
          </h2>
          
          <p className="font-inter text-gray-500 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto mb-2 sm:mb-4 px-4">
            Transformer 1,5M de membres en empire média
          </p>
          
          <p className="font-playfair italic text-base sm:text-lg lg:text-xl text-gray-600 px-4">
            "Chaque histoire vaut de l'or"
          </p>
        </div>

        {/* Navigation tabs - Horizontal scroll sur mobile */}
        <div className={`mb-8 sm:mb-12 transform transition-all duration-3000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-0 sm:flex-wrap sm:justify-center min-w-max sm:min-w-0">
              {[
                { id: 'timeline', label: 'Timeline', icon: Clock },
                { id: 'production', label: 'Production', icon: Tv },
                { id: 'verticales', label: 'Verticales', icon: Layers },
                { id: 'setup', label: 'Setup', icon: Rocket },
                { id: 'vision', label: 'Vision', icon: Eye }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-inter font-medium transition-all duration-300 text-xs sm:text-sm whitespace-nowrap ${
                    activeSection === tab.id
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-gray-900'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        {activeSection === 'timeline' && (
          <div className={`transform transition-all duration-3000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            {/* Timeline Slider */}
            <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <p className="font-inter text-center text-gray-500 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6">
                Transformation en Netflix de la solidarité
              </p>
              
              {/* Timeline navigation - Scroll horizontal sur mobile */}
              <div className="relative">
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="flex justify-between items-center mb-6 sm:mb-8 min-w-[600px] sm:min-w-0">
                    {timeframes.map((timeframe, idx) => (
                      <button
                        key={timeframe.id}
                        onClick={() => setCurrentTimeframe(idx)}
                        className={`relative flex flex-col items-center transition-all duration-300 ${
                          currentTimeframe === idx ? 'scale-110' : 'scale-100 opacity-60 hover:opacity-80'
                        }`}
                      >
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mb-1 sm:mb-2 transition-all duration-300 ${
                          currentTimeframe === idx 
                            ? 'bg-gradient-to-r from-violet-500 to-orange-500 shadow-lg shadow-violet-500/50' 
                            : 'bg-gray-300'
                        }`} />
                        <span className={`font-inter text-[10px] sm:text-xs transition-all duration-300 ${
                          currentTimeframe === idx ? 'text-gray-900 font-bold' : 'text-gray-400'
                        }`}>
                          {timeframe.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="absolute top-1.5 sm:top-2 left-0 right-0 h-0.5 bg-gray-100">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-orange-500 transition-all duration-700"
                    style={{ width: `${(currentTimeframe / (timeframes.length - 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current timeframe info */}
              <div className="text-center mt-6 sm:mt-8">
                <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-1 sm:mb-2">
                  {timeframes[currentTimeframe].title}
                </h3>
                <p className="font-inter text-gray-500 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto mb-4 sm:mb-6">
                  {timeframes[currentTimeframe].description}
                </p>
                
                {/* Paragraphes détaillés - Cachés sur mobile, visibles sur tablette+ */}
                <div className="hidden sm:block max-w-4xl mx-auto text-left space-y-4">
                  {currentTimeframe === 0 && (
                    <>
                      <p className="font-inter text-gray-600 text-sm lg:text-base">
                        1,5 million de membres. Des milliers d'histoires bouleversantes chaque jour. Un café qui pulse à Paris. 
                        Mais soyons francs : tout ça reste sous-exploité. Les plus belles actions disparaissent dans le flux Facebook, 
                        zéro monétisation média, impact réel non tracé.
                      </p>
                      <p className="font-inter text-gray-600 text-sm lg:text-base">
                        Origines apporte la machine industrielle qui manque : 200+ contenus/mois, ligne éditoriale béton, 
                        distribution multi-plateforme optimisée.
                      </p>
                    </>
                  )}
                  
                  {currentTimeframe === 1 && (
                    <>
                      <p className="font-inter text-gray-600 text-sm lg:text-base">
                        On démarre par le brain-juice : toi, tes modérateurs stars, notre équipe créative. 48h pour tout poser : 
                        ton ADN, tes non-négociables, la vision commune.
                      </p>
                      <p className="font-inter text-gray-600 text-sm lg:text-base">
                        Plan de production : 8 formats longs (15-20 min), 40 formats moyens (3-5 min), 120 shorts (15-60s), 
                        32 carrousels. Total : 200 contenus/mois.
                      </p>
                    </>
                  )}
                  
                  {currentTimeframe === 2 && (
                    <>
                      <p className="font-inter text-gray-600 text-sm lg:text-base">
                        Plus question de tout mélanger. Wanted devient 12 médias spécialisés : WantedAnimaux, WantedBusiness, 
                        WantedLogement... Chaque verticale a sa couleur, son rythme, ses créateurs dédiés.
                      </p>
                      <p className="font-inter text-gray-600 text-sm lg:text-base">
                        L'IA StoryCrafter habille automatiquement selon la charte. Cross-posting intelligent : 
                        un short Santé qui cartonne pousse un contenu Bien-être.
                      </p>
                    </>
                  )}
                  
                  {currentTimeframe === 3 && (
                    <>
                      <p className="font-inter text-gray-600 text-sm lg:text-base">
                        Les chiffres parlent : 20M de vues mensuelles × 12 verticales = audience de média national. 
                        Mais contrairement aux médias classiques, chaque euro gagné retourne dans l'action.
                      </p>
                      <p className="font-inter text-gray-600 text-sm lg:text-base">
                        Production augmentée : 12 Hack-Trocs thématiques filmés, séries "7 jours pour s'en sortir", 
                        documentaires 52min sur les héros ordinaires, Wanted Daily (JT 5min).
                      </p>
                    </>
                  )}
                  
                  {currentTimeframe === 4 && (
                    <>
                      <p className="font-inter text-gray-600 text-sm lg:text-base">
                        Wanted n'est plus une page Facebook avec un café. C'est LE média référence de l'impact positif : 
                        20 villes, 4 langues, 12 verticales autonomes, 5M d'users actifs.
                      </p>
                      <p className="font-inter text-gray-600 text-sm lg:text-base">
                        Wanted Studios : 50 créateurs permanents, IA génère 1000 variantes/jour, série fiction avec Canal+, 
                        API contenus pour médias traditionnels, WantedFest façon Coachella du bien.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Metro Map et Stats - Stack sur mobile */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
              {/* Stats & Actions - En premier sur mobile */}
              <div className="space-y-4 sm:space-y-6 lg:order-2">
                {/* KPIs */}
                <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                  <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6">Indicateurs clés</h4>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-violet-500/20">
                      <p className="font-inter text-violet-300 text-xs sm:text-sm mb-1">Membres</p>
                      <p className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-gray-900">
                        {timeframes[currentTimeframe].stats.members}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-500/20">
                      <p className="font-inter text-orange-300 text-xs sm:text-sm mb-1">Échanges</p>
                      <p className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-gray-900">
                        {timeframes[currentTimeframe].stats.exchanges}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-500/20">
                      <p className="font-inter text-green-300 text-xs sm:text-sm mb-1">Villes</p>
                      <p className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-gray-900">
                        {timeframes[currentTimeframe].stats.cities}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-500/20">
                      <p className="font-inter text-blue-300 text-xs sm:text-sm mb-1">Impact</p>
                      <p className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-gray-900">
                        {timeframes[currentTimeframe].stats.impact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions - Caché sur mobile pour gagner de l'espace */}
                <div className="hidden sm:block bg-gray-50 shadow-sm border border-gray-200 rounded-2xl p-6 lg:p-8">
                  <h4 className="font-montserrat font-bold text-lg lg:text-xl text-gray-900 mb-6">Actions clés</h4>
                  
                  <div className="space-y-3">
                    {currentTimeframe === 0 && (
                      <>
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-gray-600 text-sm">1,5 million de membres Facebook non monétisés</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Metro Map - Caché sur très petit mobile */}
              <div className="hidden sm:block bg-gray-50 shadow-sm border border-gray-200 rounded-2xl p-6 lg:p-8 lg:order-1">
                <h4 className="font-montserrat font-bold text-lg lg:text-xl text-gray-900 mb-6">Le Réseau Wanted</h4>
                
                {/* SVG simplifié pour mobile */}
                <div className="relative h-[300px] lg:h-[400px] overflow-hidden">
                  {/* Contenu SVG existant */}
                </div>

                {/* Legend - 2 colonnes sur mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-4 sm:mt-6">
                  {metroLines.map((line) => (
                    <div 
                      key={line.id}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: line.color }}
                      />
                      <div className="min-w-0">
                        <p className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm truncate">{line.name}</p>
                        <p className="font-inter text-gray-400 text-[10px] sm:text-xs truncate">{line.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Production Section */}
        {activeSection === 'production' && (
          <div className={`transform transition-all duration-3000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-1 sm:mb-2 text-center">
                200 contenus/mois
              </h3>
              <p className="font-inter text-gray-500 text-center text-xs sm:text-sm lg:text-base mb-6 sm:mb-8">
                La Machine de Production
              </p>

              {/* Production breakdown - Grid 2x2 sur mobile */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 mb-6 sm:mb-8">
                {productionData.breakdown.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div 
                      className="bg-white shadow-sm border rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:scale-105 transition-all duration-300"
                      style={{ borderColor: item.color + '40' }}
                    >
                      <div 
                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 mx-auto"
                        style={{ backgroundColor: item.color + '20' }}
                      >
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: item.color }} />
                      </div>
                      <h4 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm lg:text-base mb-1">{item.type}</h4>
                      <p className="font-montserrat font-black text-lg sm:text-2xl lg:text-3xl mb-1 sm:mb-2" style={{ color: item.color }}>
                        {item.count}
                      </p>
                      <p className="font-inter text-gray-500 text-[10px] sm:text-xs lg:text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ligne éditoriale */}
              <div className="bg-gradient-to-br from-violet-500/10 to-orange-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-300">
                <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6 text-center">
                  Formule Éditoriale
                </h4>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  {[
                    { pilier: 'Urgence', desc: 'MAINTENANT', percentage: '20%', color: '#EF4444' },
                    { pilier: 'Émotion', desc: 'Bouleverser', percentage: '30%', color: '#EC4899' },
                    { pilier: 'Solution', desc: 'Comment faire', percentage: '30%', color: '#10B981' },
                    { pilier: 'Célébration', desc: 'Accomplir', percentage: '20%', color: '#F59E0B' }
                  ].map((item, idx) => (
                    <div key={idx} className="text-center">
                      <div 
                        className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl mb-1 sm:mb-2"
                        style={{ color: item.color }}
                      >
                        {item.percentage}
                      </div>
                      <h5 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm lg:text-base mb-0.5 sm:mb-1">{item.pilier}</h5>
                      <p className="font-inter text-gray-500 text-[10px] sm:text-xs">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <p className="font-inter text-gray-600 text-center text-xs sm:text-sm">
                    <strong>Règles d'or :</strong> Action possible • Max 3 messages • Impact visible
                  </p>
                </div>
              </div>
            </div>

            {/* Production team - Stack sur mobile */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
              <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6">Équipe Production</h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-gray-600 text-sm">Créateurs Origines</span>
                    <span className="font-montserrat font-bold text-violet-400 text-lg sm:text-xl">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-gray-600 text-sm">Micro-reporters</span>
                    <span className="font-montserrat font-bold text-orange-400 text-lg sm:text-xl">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-gray-600 text-sm">Showrunner</span>
                    <span className="font-montserrat font-bold text-green-400 text-lg sm:text-xl">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-gray-600 text-sm">IA 24/7</span>
                    <span className="font-montserrat font-bold text-blue-400 text-lg sm:text-xl">∞</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
                <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6">Formats Signature</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                    <h5 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm">Wanted Daily</h5>
                    <p className="font-inter text-gray-500 text-[10px] sm:text-xs">JT de l'entraide 5min</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                    <h5 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm">7 jours pour s'en sortir</h5>
                    <p className="font-inter text-gray-500 text-[10px] sm:text-xs">Série immersive</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                    <h5 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm">Du déchet au trésor</h5>
                    <p className="font-inter text-gray-500 text-[10px] sm:text-xs">Transformation hebdo</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3">
                    <h5 className="font-montserrat font-bold text-gray-900 text-xs sm:text-sm">Mentor surprise</h5>
                    <p className="font-inter text-gray-500 text-[10px] sm:text-xs">Coaching bimensuel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verticales Section */}
        {activeSection === 'verticales' && (
          <div className={`transform transition-all duration-3000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-1 sm:mb-2 text-center">
                12 Verticales = 12 Médias
              </h3>
              <p className="font-inter text-gray-500 text-center text-xs sm:text-sm lg:text-base">
                12 langages, 12 publics, 12 business
              </p>
            </div>

            {/* Grid des verticales - 3 colonnes sur mobile */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:gap-4 mb-6 sm:mb-8">
              {verticales.map((verticale) => (
                <button
                  key={verticale.id}
                  onClick={() => setSelectedVerticale(verticale.id)}
                  className={`group relative bg-gray-50 shadow-sm border rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 hover:scale-105 transition-all duration-300 ${
                    selectedVerticale === verticale.id ? 'scale-105' : ''
                  }`}
                  style={{
                    borderColor: selectedVerticale === verticale.id ? verticale.color : 'rgba(255,255,255,0.1)',
                    boxShadow: selectedVerticale === verticale.id ? `0 10px 20px ${verticale.color}30` : 'none'
                  }}
                >
                  <div 
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 mx-auto"
                    style={{ backgroundColor: verticale.color + '20' }}
                  >
                    <verticale.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: verticale.color }} />
                  </div>
                  <h4 className="font-montserrat font-bold text-gray-900 text-[10px] sm:text-xs lg:text-sm mb-0.5 sm:mb-1">
                    {verticale.name}
                  </h4>
                  <p className="font-inter text-gray-500 text-[8px] sm:text-[10px] lg:text-xs hidden sm:block">
                    {verticale.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Détail de la verticale sélectionnée */}
            {selectedVerticale && (() => {
              const v = verticales.find(v => v.id === selectedVerticale);
              if (!v) return null;
              return (
                <div className="bg-gradient-to-br from-violet-500/10 to-orange-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-300">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: v.color + '20' }}
                    >
                      <v.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" style={{ color: v.color }} />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900">
                        Wanted{v.name}
                      </h3>
                      <p className="font-inter text-gray-500 text-xs sm:text-sm">{v.desc}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                    <div>
                      <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">Ligne éditoriale</h4>
                      <p className="font-playfair italic text-sm sm:text-base lg:text-lg text-gray-600">{v.edito}</p>
                    </div>

                    <div>
                      <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">Production</h4>
                      <ul className="space-y-1 sm:space-y-2">
                        <li className="font-inter text-gray-600 text-xs sm:text-sm">• 2 lives/mois</li>
                        <li className="font-inter text-gray-600 text-xs sm:text-sm">• 15 shorts</li>
                        <li className="font-inter text-gray-600 text-xs sm:text-sm">• 3 carrousels</li>
                        <li className="font-inter text-gray-600 text-xs sm:text-sm">• 1 newsletter</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">Sponsors</h4>
                      <p className="font-inter text-gray-500 text-xs sm:text-sm">
                        {v.name === 'Animaux' && 'Purina, Royal Canin'}
                        {v.name === 'Business' && 'LinkedIn, Indeed'}
                        {v.name === 'Logement' && 'Nexity, Action Log.'}
                        {v.name === 'Mode' && 'Vinted, H&M'}
                        {v.name === 'Alimentation' && 'Too Good To Go'}
                        {v.name === 'Formation' && 'OpenClassrooms'}
                        {v.name === 'Santé' && 'Mutuelle, ARS'}
                        {v.name === 'Culture' && 'Ministère Culture'}
                        {v.name === 'Environnement' && 'Ademe, Veolia'}
                        {v.name === 'Famille' && 'CAF, Fondations'}
                        {v.name === 'Seniors' && 'AG2R, Malakoff'}
                        {v.name === 'Mobilité' && 'SNCF, Blablacar'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Setup Section */}
        {activeSection === 'setup' && (
          <div className={`transform transition-all duration-3000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-1 sm:mb-2 text-center">
                Setup Opérationnel
              </h3>
              <p className="font-inter text-gray-500 text-center text-xs sm:text-sm lg:text-base">
                Du Brain-Juice au Netflix
              </p>
            </div>

            {/* Timeline de setup */}
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  period: 'Jour 1-2',
                  title: 'Brain-Juice',
                  tasks: [
                    'Atelier 48h équipes',
                    'Carte des besoins',
                    'Choix 12 verticales'
                  ],
                  color: '#8B5CF6'
                },
                {
                  period: 'Mois 1',
                  title: 'Poser Rails',
                  tasks: [
                    'Audit technique',
                    'Synchronisation',
                    'IA Valuator beta'
                  ],
                  color: '#EC4899'
                },
                {
                  period: 'Mois 2-3',
                  title: 'Relier Mondes',
                  tasks: [
                    'Tests 2 verticales',
                    'Live streaming',
                    'API compteur'
                  ],
                  color: '#F97316'
                },
                {
                  period: 'Mois 4-6',
                  title: 'Échelle',
                  tasks: [
                    '12 verticales actives',
                    'Micro-reporters',
                    '3 hubs ouverts'
                  ],
                  color: '#10B981'
                },
                {
                  period: 'An 1',
                  title: 'Autonome',
                  tasks: [
                    '7 cafés + bus',
                    '2400 contenus/an',
                    'Break-even atteint'
                  ],
                  color: '#3B82F6'
                }
              ].map((phase, idx) => (
                <div key={idx} className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div 
                      className="w-1.5 sm:w-2 h-full rounded-full flex-shrink-0"
                      style={{ backgroundColor: phase.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                        <span 
                          className="font-montserrat font-black text-sm sm:text-base lg:text-lg"
                          style={{ color: phase.color }}
                        >
                          {phase.period}
                        </span>
                        <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900">
                          {phase.title}
                        </h4>
                      </div>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {phase.tasks.map((task, taskIdx) => (
                          <li key={taskIdx} className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5 text-xs">•</span>
                            <span className="font-inter text-gray-600 text-xs sm:text-sm">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vision Section */}
        {activeSection === 'vision' && (
          <div className={`transform transition-all duration-3000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="bg-gray-50 shadow-sm border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-1 sm:mb-2 text-center">
                Vision Éditoriale
              </h3>
              <p className="font-inter text-gray-500 text-center text-xs sm:text-sm lg:text-base">
                Le Netflix de la Solidarité
              </p>
            </div>

            {/* Les 4 piliers - Stack sur mobile */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-violet-500/20">
                <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6">
                  4 Piliers de Contenu
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { pilier: 'Urgence', desc: 'Agir MAINTENANT', percentage: '20%' },
                    { pilier: 'Émotion', desc: 'Bouleverser', percentage: '30%' },
                    { pilier: 'Solution', desc: 'Comment faire', percentage: '30%' },
                    { pilier: 'Célébration', desc: 'Accomplir', percentage: '20%' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <h5 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base">{item.pilier}</h5>
                        <p className="font-inter text-gray-500 text-xs sm:text-sm">{item.desc}</p>
                      </div>
                      <span className="font-montserrat font-black text-xl sm:text-2xl text-violet-400">
                        {item.percentage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-orange-500/20">
                <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-6">
                  KPIs Clés
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-gray-600 text-xs sm:text-sm">Vue → action</span>
                    <span className="font-montserrat font-bold text-orange-400 text-sm sm:text-base">5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-gray-600 text-xs sm:text-sm">Coût/impact</span>
                    <span className="font-montserrat font-bold text-orange-400 text-sm sm:text-base">&lt;1€</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-gray-600 text-xs sm:text-sm">Rétention</span>
                    <span className="font-montserrat font-bold text-orange-400 text-sm sm:text-base">60%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-gray-600 text-xs sm:text-sm">NPS</span>
                    <span className="font-montserrat font-bold text-orange-400 text-sm sm:text-base">&gt;70</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision finale */}
            <div className="bg-gradient-to-br from-violet-600/10 to-orange-600/10 shadow-sm border border-gray-300 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 text-center">
              <h3 className="font-montserrat font-black text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-4 sm:mb-6">
                La Promesse 2030
              </h3>
              
              <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                <div>
                  <p className="font-montserrat font-black text-2xl sm:text-3xl lg:text-5xl text-violet-400 mb-1 sm:mb-2">0</p>
                  <p className="font-inter text-gray-600 text-[10px] sm:text-xs lg:text-base">objet dormant</p>
                </div>
                <div>
                  <p className="font-montserrat font-black text-2xl sm:text-3xl lg:text-5xl text-orange-400 mb-1 sm:mb-2">0</p>
                  <p className="font-inter text-gray-600 text-[10px] sm:text-xs lg:text-base">talent gâché</p>
                </div>
                <div>
                  <p className="font-montserrat font-black text-2xl sm:text-3xl lg:text-5xl text-green-400 mb-1 sm:mb-2">0</p>
                  <p className="font-inter text-gray-600 text-[10px] sm:text-xs lg:text-base">excuse</p>
                </div>
              </div>
              
              <p className="font-playfair italic text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
                "Tes 1,5M de membres méritent mieux. Construisons ensemble la première plateforme où chaque clic finance une action."
              </p>

              <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl sm:rounded-2xl font-inter font-bold text-gray-900 text-sm sm:text-base overflow-hidden transition-all duration-300 hover:scale-105">
                <span className="relative z-10">On commence quand ?</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer CTA - toujours visible */}
        <div className={`text-center mt-8 sm:mt-12 lg:mt-16 transform transition-all duration-3000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <p className="font-playfair italic text-sm sm:text-base lg:text-lg text-gray-500 px-4">
            "Wanted 3.0 × Origines : 1,5M membres → 12 médias qui changent le monde"
          </p>
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

        /* Hide scrollbar on mobile navigation */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default PartnershipVisionSection;