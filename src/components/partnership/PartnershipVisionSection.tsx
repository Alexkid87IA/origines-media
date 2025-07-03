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

  // Timeline data mise à jour avec les vrais chiffres
  const timeframes = [
    {
      id: 0,
      label: 'MAINTENANT',
      title: '1,5M membres, un trésor inexploité',
      description: 'Tu es assis sur une mine d\'or médiatique.',
      stats: {
        members: '1,5M',
        exchanges: '—',
        cities: '1',
        impact: '0€ média'
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
      title: 'Brain-juice et premiers rails',
      description: '200 contenus/mois dès le jour 30.',
      stats: {
        members: '10k actifs',
        exchanges: '5k',
        cities: '1',
        impact: '1M vues'
      },
      lines: {
        phygital: ['Café Paris 2.0', 'Studio streaming'],
        media: ['200 contenus/mois', '2 verticales tests'],
        marketplace: ['IA Valuator beta', 'Hashtags tests'],
        academy: ['Module pilote', '30 certifiés']
      }
    },
    {
      id: 2,
      label: '6 MOIS',
      title: '12 chaînes, 20M de vues',
      description: 'L\'empire des 12 verticales spécialisées.',
      stats: {
        members: '50k actifs',
        exchanges: '25k',
        cities: '3',
        impact: '20M vues'
      },
      lines: {
        phygital: ['Hub Lille', 'Hub Lyon', 'Events mensuels'],
        media: ['12 verticales actives', 'StoryCrafter IA', 'Cross-pollination'],
        marketplace: ['Matching IA', '12 flux dédiés', 'Sponsors verticaux'],
        academy: ['5 parcours', 'Bootcamp', 'Badges digitaux']
      }
    },
    {
      id: 3,
      label: '1 AN',
      title: 'La machine à cash solidaire',
      description: 'Chaque verticale s\'autofinance.',
      stats: {
        members: '200k actifs',
        exchanges: '500k',
        cities: '7',
        impact: '100M vues/an'
      },
      lines: {
        phygital: ['5 hubs FR', 'Mexico City', 'LA', 'Bus mobile'],
        media: ['2400 contenus/an', 'Wanted Daily', 'Séries originales'],
        marketplace: ['API ouverte', 'Trust Score', '100k€/mois'],
        academy: ['500 entreprises', '25k apprenants', 'Certif officielle']
      }
    },
    {
      id: 4,
      label: '3 ANS',
      title: 'Le Netflix de la Solidarité',
      description: 'LE média référence de l\'impact positif.',
      stats: {
        members: '5M actifs',
        exchanges: '10M',
        cities: '20',
        impact: '1Md vues/an'
      },
      lines: {
        phygital: ['20 villes', 'WantedFest', 'Studios permanents'],
        media: ['10k contenus/an', 'Prod fiction', 'Licence médias'],
        marketplace: ['12 verticales rentables', '10M€ CA', 'Blockchain'],
        academy: ['Wanted University', 'Research lab', '100k certifiés']
      }
    }
  ];

  // Production mensuelle détaillée
  const productionData = {
    total: 200,
    breakdown: [
      { type: 'Formats longs', count: 8, desc: '15-20 min : portraits, immersions', icon: Film, color: '#8B5CF6' },
      { type: 'Formats moyens', count: 40, desc: '3-5 min : tutos, témoignages', icon: Play, color: '#EC4899' },
      { type: 'Shorts', count: 120, desc: '15-60s : 80 extraits + 40 originaux', icon: Smartphone, color: '#F97316' },
      { type: 'Carrousels', count: 32, desc: 'LinkedIn/Insta : data stories', icon: Layers, color: '#10B981' }
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
            <span className="font-inter text-violet-400 text-xs tracking-[0.3em] uppercase font-medium">Vision 3.0</span>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          </div>
          
          <h2 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-4">
            Wanted × Origines :
            <br />
            <span className="gradient-text-animated text-5xl md:text-6xl lg:text-7xl">La Machine Média de l'Entraide</span>
          </h2>
          
          <p className="font-inter text-white/60 text-lg max-w-3xl mx-auto mb-4">
            Comment transformer 1,5 million de membres en empire média verticalisé
          </p>
          
          <p className="font-playfair italic text-xl text-white/80">
            "Chaque histoire de ta communauté vaut de l'or. On va la raconter 100 fois mieux."
          </p>
        </div>

        {/* Navigation tabs */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          {[
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'production', label: 'Production Média', icon: Tv },
            { id: 'verticales', label: '12 Verticales', icon: Layers },
            { id: 'setup', label: 'Setup Opérationnel', icon: Rocket },
            { id: 'vision', label: 'Vision Éditoriale', icon: Eye }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-inter font-medium transition-all duration-300 ${
                activeSection === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timeline Section */}
        {activeSection === 'timeline' && (
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            {/* Timeline Slider */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
              <p className="font-inter text-center text-white/60 mb-6">
                Voici comment on transforme Wanted en Netflix de la solidarité
              </p>
              
              {/* Timeline navigation */}
              <div className="relative">
                <div className="flex justify-between items-center mb-8">
                  {timeframes.map((timeframe, idx) => (
                    <button
                      key={timeframe.id}
                      onClick={() => setCurrentTimeframe(idx)}
                      className={`relative flex flex-col items-center transition-all duration-300 ${
                        currentTimeframe === idx ? 'scale-110' : 'scale-100 opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full mb-2 transition-all duration-300 ${
                        currentTimeframe === idx 
                          ? 'bg-gradient-to-r from-violet-500 to-orange-500 shadow-lg shadow-violet-500/50' 
                          : 'bg-white/30'
                      }`} />
                      <span className={`font-inter text-xs transition-all duration-300 ${
                        currentTimeframe === idx ? 'text-white font-bold' : 'text-white/50'
                      }`}>
                        {timeframe.label}
                      </span>
                    </button>
                  ))}
                </div>
                
                {/* Progress bar */}
                <div className="absolute top-2 left-0 right-0 h-0.5 bg-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-orange-500 transition-all duration-700"
                    style={{ width: `${(currentTimeframe / (timeframes.length - 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current timeframe info */}
              <div className="text-center mt-8">
                <h3 className="font-montserrat font-bold text-2xl text-white mb-2">
                  {timeframes[currentTimeframe].title}
                </h3>
                <p className="font-inter text-white/60 max-w-2xl mx-auto mb-6">
                  {timeframes[currentTimeframe].description}
                </p>
                
                {/* Paragraphes détaillés selon la période */}
                <div className="max-w-4xl mx-auto text-left space-y-4">
                  {currentTimeframe === 0 && (
                    <>
                      <p className="font-inter text-white/80">
                        1,5 million de membres. Des milliers d\'histoires bouleversantes chaque jour. Un café qui pulse à Paris. 
                        Mais soyons francs : tout ça reste sous-exploité. Les plus belles actions disparaissent dans le flux Facebook, 
                        zéro monétisation média, impact réel non tracé. C\'est comme avoir Netflix mais diffuser sur cassette VHS.
                      </p>
                      <p className="font-inter text-white/80">
                        Origines apporte la machine industrielle qui manque : 200+ contenus/mois, ligne éditoriale béton, 
                        distribution multi-plateforme optimisée. On ne dénature rien, on révèle. Chaque geste devient une saga, 
                        chaque membre un héros potentiel, chaque action un revenu qui finance la suivante.
                      </p>
                    </>
                  )}
                  
                  {currentTimeframe === 1 && (
                    <>
                      <p className="font-inter text-white/80">
                        On démarre par le brain-juice : toi, tes modérateurs stars, notre équipe créative. 48h pour tout poser : 
                        ton ADN, tes non-négociables, la vision commune. On ressort avec LA ligne éditoriale : 
                        "Factuel + Émotion + Action immédiate". Ton ton reste, on ajoute juste la puissance de feu.
                      </p>
                      <p className="font-inter text-white/80">
                        Plan de production : 8 formats longs (15-20 min), 40 formats moyens (3-5 min), 120 shorts (15-60s), 
                        32 carrousels. Total : 200 contenus/mois, avec système de recyclage intelligent. 
                        On teste sur 2 verticales pilotes : #WantedAnimaux et #WantedBusiness.
                      </p>
                    </>
                  )}
                  
                  {currentTimeframe === 2 && (
                    <>
                      <p className="font-inter text-white/80">
                        Plus question de tout mélanger. Wanted devient 12 médias spécialisés : WantedAnimaux, WantedBusiness, 
                        WantedLogement... Chaque verticale a sa couleur, son rythme, ses créateurs dédiés. 
                        Le passionné d\'animaux ne voit plus les posts business, et inversement. Pertinence maximale.
                      </p>
                      <p className="font-inter text-white/80">
                        L\'IA StoryCrafter habille automatiquement selon la charte. Cross-posting intelligent : 
                        un short Santé qui cartonne pousse un contenu Bien-être. Les cafés deviennent modulables : 
                        coin adoption le matin, bureau mentor l\'après-midi, scène culture le soir. 
                        Objectif : 20M vues/mois, 50k échanges tracés, 100k€ revenus médias.
                      </p>
                    </>
                  )}
                  
                  {currentTimeframe === 3 && (
                    <>
                      <p className="font-inter text-white/80">
                        Les chiffres parlent : 20M de vues mensuelles × 12 verticales = audience de média national. 
                        Mais contrairement aux médias classiques, chaque euro gagné retourne dans l'action. 
                        WantedAnimaux génère 20k€/mois, finance 500 adoptions. WantedBusiness : 35k€/mois, crée 50 micro-entreprises.
                      </p>
                      <p className="font-inter text-white/80">
                        Production augmentée : 12 Hack-Trocs thématiques filmés, séries "7 jours pour s'en sortir", 
                        documentaires 52min sur les héros ordinaires, Wanted Daily (JT 5min). Les cafés sont des studios : 
                        plateau le matin, workshop l'après-midi, scène le soir. Production annuelle : 2400 contenus, 100M vues.
                      </p>
                    </>
                  )}
                  
                  {currentTimeframe === 4 && (
                    <>
                      <p className="font-inter text-white/80">
                        Wanted n\'est plus une page Facebook avec un café. C\'est LE média référence de l\'impact positif : 
                        20 villes, 4 langues, 12 verticales autonomes, 5M d\'users actifs. Chaque matin, 1 million de personnes 
                        ouvrent Wanted comme elles ouvraient leur journal. Sauf qu\'au lieu de déprimer, elles trouvent comment agir.
                      </p>
                      <p className="font-inter text-white/80">
                        Wanted Studios : 50 créateurs permanents, IA génère 1000 variantes/jour, série fiction avec Canal+, 
                        API contenus pour médias traditionnels, WantedFest façon Coachella du bien. 10 000 contenus/an, 
                        1 milliard de vues, 10M€ CA média, 100% réinvesti. Mission accomplie ? Non, c\'est juste le début.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Metro Map et Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Metro Map */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h4 className="font-montserrat font-bold text-xl text-white mb-6">Le Réseau Wanted</h4>
                
                <div className="relative h-[400px] overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 500 400" className="w-full h-full">
                    {/* Background grid */}
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* Render lines */}
                    {metroLines.map((line, index) => {
                      const yPosition = 80 + index * 80;
                      const stations = timeframes[currentTimeframe].lines[line.id as keyof typeof timeframes[0]['lines']];
                      
                      return (
                        <g key={line.id}>
                          {/* Line background */}
                          <line
                            x1="50"
                            y1={yPosition}
                            x2="450"
                            y2={yPosition}
                            stroke={line.color}
                            strokeWidth="2"
                            opacity="0.1"
                          />
                          
                          {/* Active line */}
                          {stations.length > 0 && (
                            <line
                              x1="50"
                              y1={yPosition}
                              x2={50 + Math.min(stations.length * 120, 400)}
                              y2={yPosition}
                              stroke={line.color}
                              strokeWidth="6"
                              strokeLinecap="round"
                            />
                          )}
                          
                          {/* Stations */}
                          {stations.map((station, idx) => (
                            <g key={`${line.id}-${idx}`}>
                              <circle
                                cx={50 + idx * 120}
                                cy={yPosition}
                                r="10"
                                fill="#0A0A0A"
                                stroke={line.color}
                                strokeWidth="3"
                              />
                              <foreignObject
                                x={50 + idx * 120 - 50}
                                y={yPosition - 35}
                                width="100"
                                height="30"
                              >
                                <div className="text-center">
                                  <p className="font-inter text-[10px] text-white/80 leading-tight">
                                    {station}
                                  </p>
                                </div>
                              </foreignObject>
                            </g>
                          ))}
                        </g>
                      );
                    })}
                    
                    {/* Central WANTED station */}
                    <g>
                      {/* La ligne <circle> a été supprimée, il ne reste que le texte */}
                      <text x="50" y="205" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">
                        WANTED
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {metroLines.map((line) => (
                    <div 
                      key={line.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/10 hover:bg-black/60 transition-all duration-300"
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: line.color }}
                      />
                      <div>
                        <p className="font-montserrat font-bold text-white text-sm">{line.name}</p>
                        <p className="font-inter text-white/50 text-xs">{line.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="space-y-6">
                {/* KPIs */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <h4 className="font-montserrat font-bold text-xl text-white mb-6">Indicateurs clés</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-500/20">
                      <p className="font-inter text-violet-300 text-sm mb-1">Membres</p>
                      <p className="font-montserrat font-black text-3xl text-white">
                        {timeframes[currentTimeframe].stats.members}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
                      <p className="font-inter text-orange-300 text-sm mb-1">Échanges</p>
                      <p className="font-montserrat font-black text-3xl text-white">
                        {timeframes[currentTimeframe].stats.exchanges}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                      <p className="font-inter text-green-300 text-sm mb-1">Villes</p>
                      <p className="font-montserrat font-black text-3xl text-white">
                        {timeframes[currentTimeframe].stats.cities}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20">
                      <p className="font-inter text-blue-300 text-sm mb-1">Impact</p>
                      <p className="font-montserrat font-black text-3xl text-white">
                        {timeframes[currentTimeframe].stats.impact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions for current timeframe */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <h4 className="font-montserrat font-bold text-xl text-white mb-6">Actions clés</h4>
                  
                  <div className="space-y-3">
                    {currentTimeframe === 0 && (
                      <>
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">1,5 million de membres Facebook non monétisés</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">Des milliers d'histoires non racontées</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">0€ de monétisation média</p>
                        </div>
                      </>
                    )}
                    
                    {currentTimeframe === 1 && (
                      <>
                        <div className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">Brain-juice 48h : stratégie + ligne édito</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Tv className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">200 contenus/mois : longs, moyens, shorts, carrousels</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Hash className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">#WantedAnimaux et #WantedBusiness en test</p>
                        </div>
                      </>
                    )}
                    
                    {currentTimeframe === 2 && (
                      <>
                        <div className="flex items-start gap-3">
                          <Layers className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">12 verticales spécialisées lancées</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Rocket className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">StoryCrafter IA : habillage auto par verticale</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Eye className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">20M vues/mois (objectif atteint)</p>
                        </div>
                      </>
                    )}
                    
                    {currentTimeframe === 3 && (
                      <>
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">Chaque verticale génère 20-35k€/mois</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">7 villes actives (FR + Mexico + LA)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Play className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">2400 contenus/an, 100M vues cumulées</p>
                        </div>
                      </>
                    )}
                    
                    {currentTimeframe === 4 && (
                      <>
                        <div className="flex items-start gap-3">
                          <Trophy className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">LE média référence de l'impact positif</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Tv className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">10k contenus/an, 1Md vues, série fiction</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                          <p className="font-inter text-white/80">WantedFest : Coachella de l'entraide</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Production Section */}
        {activeSection === 'production' && (
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="font-montserrat font-bold text-2xl text-white mb-2 text-center">
                200 contenus/mois : La Machine de Production
              </h3>
              <p className="font-inter text-white/60 text-center mb-8">
                1 long = 10 shorts + 2 carrousels + 1 podcast
              </p>

              {/* Production breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {productionData.breakdown.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div 
                      className="bg-black/60 backdrop-blur-sm border rounded-2xl p-6 hover:scale-105 transition-all duration-300"
                      style={{ borderColor: item.color + '40' }}
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: item.color + '20' }}
                      >
                        <item.icon className="w-6 h-6" style={{ color: item.color }} />
                      </div>
                      <h4 className="font-montserrat font-bold text-white mb-1">{item.type}</h4>
                      <p className="font-montserrat font-black text-3xl mb-2" style={{ color: item.color }}>
                        {item.count}
                      </p>
                      <p className="font-inter text-white/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ligne éditoriale */}
              <div className="bg-gradient-to-br from-violet-500/10 to-orange-500/10 rounded-2xl p-8 border border-white/20">
                <h4 className="font-montserrat font-bold text-xl text-white mb-6 text-center">
                  La Formule Éditoriale Origines
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { pilier: 'Urgence', desc: 'Il faut agir MAINTENANT', percentage: '20%', color: '#EF4444' },
                    { pilier: 'Émotion', desc: 'Cette histoire va vous bouleverser', percentage: '30%', color: '#EC4899' },
                    { pilier: 'Solution', desc: 'Voici comment faire', percentage: '30%', color: '#10B981' },
                    { pilier: 'Célébration', desc: 'Regardez ce qu\'on a accompli', percentage: '20%', color: '#F59E0B' }
                  ].map((item, idx) => (
                    <div key={idx} className="text-center">
                      <div 
                        className="font-montserrat font-black text-3xl mb-2"
                        style={{ color: item.color }}
                      >
                        {item.percentage}
                      </div>
                      <h5 className="font-montserrat font-bold text-white mb-1">{item.pilier}</h5>
                      <p className="font-inter text-white/60 text-xs">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="font-inter text-white/80 text-center">
                    <strong>Règles d'or :</strong> Toujours une action possible • Max 3 messages • 
                    Overlay impact visible • Témoignage authentique &gt; voix off
                  </p>
                </div>
              </div>
            </div>

            {/* Production team */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h4 className="font-montserrat font-bold text-xl text-white mb-6">Équipe de Production</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-white/80">Créateurs full-time Origines</span>
                    <span className="font-montserrat font-bold text-violet-400 text-xl">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-white/80">Micro-reporters (1/verticale)</span>
                    <span className="font-montserrat font-bold text-orange-400 text-xl">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-white/80">Showrunner principal (toi)</span>
                    <span className="font-montserrat font-bold text-green-400 text-xl">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-white/80">IA habillage/distribution</span>
                    <span className="font-montserrat font-bold text-blue-400 text-xl">24/7</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h4 className="font-montserrat font-bold text-xl text-white mb-6">Formats Signature</h4>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-3">
                    <h5 className="font-montserrat font-bold text-white text-sm">Wanted Daily</h5>
                    <p className="font-inter text-white/60 text-xs">JT de l'entraide 5min (lun-ven)</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <h5 className="font-montserrat font-bold text-white text-sm">7 jours pour s\'en sortir</h5>
                    <p className="font-inter text-white/60 text-xs">Série immersive mensuelle</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <h5 className="font-montserrat font-bold text-white text-sm">Du déchet au trésor</h5>
                    <p className="font-inter text-white/60 text-xs">Transformation d'objets hebdo</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <h5 className="font-montserrat font-bold text-white text-sm">Mentor surprise</h5>
                    <p className="font-inter text-white/60 text-xs">Coaching inattendu bimensuel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verticales Section */}
        {activeSection === 'verticales' && (
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="font-montserrat font-bold text-2xl text-white mb-2 text-center">
                12 Verticales = 12 Médias Spécialisés
              </h3>
              <p className="font-inter text-white/60 text-center">
                L\'entraide n\'est pas monolithique. Elle mérite 12 langages, 12 publics, 12 business models.
              </p>
            </div>

            {/* Grid des verticales */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {verticales.map((verticale) => (
                <button
                  key={verticale.id}
                  onClick={() => setSelectedVerticale(verticale.id)}
                  className={`group relative bg-black/40 backdrop-blur-sm border rounded-2xl p-6 hover:scale-105 transition-all duration-300 ${
                    selectedVerticale === verticale.id ? 'scale-105' : ''
                  }`}
                  style={{
                    borderColor: selectedVerticale === verticale.id ? verticale.color : 'rgba(255,255,255,0.1)',
                    boxShadow: selectedVerticale === verticale.id ? `0 20px 40px ${verticale.color}30` : 'none'
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto"
                    style={{ backgroundColor: verticale.color + '20' }}
                  >
                    <verticale.icon className="w-6 h-6" style={{ color: verticale.color }} />
                  </div>
                  <h4 className="font-montserrat font-bold text-white text-sm mb-1">
                    {verticale.name}
                  </h4>
                  <p className="font-inter text-white/60 text-xs">
                    {verticale.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Détail de la verticale sélectionnée */}
            {selectedVerticale && (
              <div className="bg-gradient-to-br from-violet-500/10 to-orange-500/10 rounded-2xl p-8 border border-white/20">
                {(() => {
                  const v = verticales.find(v => v.id === selectedVerticale)!;
                  return (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: v.color + '20' }}
                        >
                          <v.icon className="w-8 h-8" style={{ color: v.color }} />
                        </div>
                        <div>
                          <h3 className="font-montserrat font-bold text-2xl text-white">
                            Wanted{v.name}
                          </h3>
                          <p className="font-inter text-white/60">{v.desc}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-montserrat font-bold text-white mb-3">Ligne éditoriale</h4>
                          <p className="font-playfair italic text-lg text-white/80">{v.edito}</p>
                        </div>

                        <div>
                          <h4 className="font-montserrat font-bold text-white mb-3">Production/mois</h4>
                          <ul className="space-y-2">
                            <li className="font-inter text-white/80 text-sm">• 2 lives thématiques</li>
                            <li className="font-inter text-white/80 text-sm">• 15 shorts viraux</li>
                            <li className="font-inter text-white/80 text-sm">• 3 carrousels data</li>
                            <li className="font-inter text-white/80 text-sm">• 1 newsletter dédiée</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-montserrat font-bold text-white mb-3">Sponsors types</h4>
                          <p className="font-inter text-white/60 text-sm">
                            {v.name === 'Animaux' && 'Purina, Royal Canin, SPA'}
                            {v.name === 'Business' && 'LinkedIn, Indeed, BPI'}
                            {v.name === 'Logement' && 'Nexity, Action Logement'}
                            {v.name === 'Mode' && 'Vinted, H&M Conscious'}
                            {v.name === 'Alimentation' && 'Too Good To Go, Carrefour'}
                            {v.name === 'Formation' && 'OpenClassrooms, Pôle Emploi'}
                            {v.name === 'Santé' && 'Mutuelle, ARS, Fondations santé'}
                            {v.name === 'Culture' && 'Ministère Culture, Fnac'}
                            {v.name === 'Environnement' && 'Ademe, Veolia'}
                            {v.name === 'Famille' && 'CAF, Fondations famille'}
                            {v.name === 'Seniors' && 'AG2R, Malakoff Humanis'}
                            {v.name === 'Mobilité' && 'SNCF, Blablacar'}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Setup Section */}
        {activeSection === 'setup' && (
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="font-montserrat font-bold text-2xl text-white mb-2 text-center">
                Setup Opérationnel : Du Brain-Juice au Netflix
              </h3>
              <p className="font-inter text-white/60 text-center">
                Une feuille de route millimétrée pour ne rien laisser au hasard
              </p>
            </div>

            {/* Timeline de setup */}
            <div className="space-y-6">
              {[
                {
                  period: 'Jour 1-2',
                  title: 'Brain-Juice Fondateur',
                  tasks: [
                    'Atelier intensif 48h avec équipe fondatrice + modérateurs + Origines',
                    'Carte des besoins sociaux par ville',
                    'Hiérarchie d\'impacts et promesse éditoriale',
                    'Choix des 12 verticales + chartes couleurs'
                  ],
                  color: '#8B5CF6'
                },
                {
                  period: 'Mois 1',
                  title: 'Poser les Rails',
                  tasks: [
                    'Audit technique complet (cafés, flux, back-office)',
                    'Synchronisation lignes éditoriales Wanted/Origines',
                    'Prototype plateforme + IA Valuator (scan 3 sec)',
                    'Recrutement 5 rôles critiques + formation sprint'
                  ],
                  color: '#EC4899'
                },
                {
                  period: 'Mois 2-3',
                  title: 'Relier les Mondes',
                  tasks: [
                    'Lancement #DonObjets et #WantedBusiness tests',
                    'Premier Twitch Live augmenté depuis le café',
                    'Origines produit 3 shorts + 1 mini-doc + 1 podcast',
                    'API pont live → site → compteur impacts'
                  ],
                  color: '#F97316'
                },
                {
                  period: 'Mois 4-6',
                  title: 'Passer à l\'Échelle',
                  tasks: [
                    'Déploiement 12 verticales complètes',
                    'Formation micro-reporters (1 par verticale)',
                    'Ouverture hubs Lille + Lyon',
                    'Premier Baromètre Wanted + sponsors verticaux'
                  ],
                  color: '#10B981'
                },
                {
                  period: 'An 1',
                  title: 'Machine Autonome',
                  tasks: [
                    '5 cafés fixes + bus mobile + 2 internationaux',
                    'Production 2400 contenus/an',
                    'Marketplace complète avec Trust Score',
                    'Break-even atteint, réinvestissement 60%'
                  ],
                  color: '#3B82F6'
                }
              ].map((phase, idx) => (
                <div key={idx} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-2 h-full rounded-full"
                      style={{ backgroundColor: phase.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span 
                          className="font-montserrat font-black text-lg"
                          style={{ color: phase.color }}
                        >
                          {phase.period}
                        </span>
                        <h4 className="font-montserrat font-bold text-xl text-white">
                          {phase.title}
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {phase.tasks.map((task, taskIdx) => (
                          <li key={taskIdx} className="flex items-start gap-2">
                            <span className="text-white/40 mt-1">•</span>
                            <span className="font-inter text-white/80 text-sm">{task}</span>
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
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="font-montserrat font-bold text-2xl text-white mb-2 text-center">
                Vision Éditoriale : Le Netflix de la Solidarité
              </h3>
              <p className="font-inter text-white/60 text-center">
                Comment on passe de 0 à 1 milliard de vues en gardant l\'âme
              </p>
            </div>

            {/* Les 4 piliers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl p-8 border border-violet-500/20">
                <h4 className="font-montserrat font-bold text-xl text-white mb-6">
                  Les 4 Piliers de Contenu
                </h4>
                <div className="space-y-4">
                  {[
                    { pilier: 'Urgence', desc: 'Il faut agir MAINTENANT', percentage: '20%' },
                    { pilier: 'Émotion', desc: 'Cette histoire va vous bouleverser', percentage: '30%' },
                    { pilier: 'Solution', desc: 'Voici comment faire', percentage: '30%' },
                    { pilier: 'Célébration', desc: 'Regardez ce qu\'on a accompli', percentage: '20%' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <h5 className="font-montserrat font-bold text-white">{item.pilier}</h5>
                        <p className="font-inter text-white/60 text-sm">{item.desc}</p>
                      </div>
                      <span className="font-montserrat font-black text-2xl text-violet-400">
                        {item.percentage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-8 border border-orange-500/20">
                <h4 className="font-montserrat font-bold text-xl text-white mb-6">
                  KPIs qui Comptent Vraiment
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-white/80">Taux conversion vue → action</span>
                    <span className="font-montserrat font-bold text-orange-400">Cible: 5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-white/80">Coût par impact généré</span>
                    <span className="font-montserrat font-bold text-orange-400">Cible: &lt;1€</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-white/80">Rétention verticale</span>
                    <span className="font-montserrat font-bold text-orange-400">Cible: 60%/sem</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-white/80">NPS communautaire</span>
                    <span className="font-montserrat font-bold text-orange-400">Cible: &gt;70</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision finale */}
            <div className="bg-gradient-to-br from-violet-600/10 to-orange-600/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
              <h3 className="font-montserrat font-black text-3xl text-white mb-6">
                La Promesse 2030
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <p className="font-montserrat font-black text-5xl text-violet-400 mb-2">0</p>
                  <p className="font-inter text-white/80">objet dormant</p>
                </div>
                <div>
                  <p className="font-montserrat font-black text-5xl text-orange-400 mb-2">0</p>
                  <p className="font-inter text-white/80">talent gâché</p>
                </div>
                <div>
                  <p className="font-montserrat font-black text-5xl text-green-400 mb-2">0</p>
                  <p className="font-inter text-white/80">excuse pour ne pas s'entraider</p>
                </div>
              </div>
              
              <p className="font-playfair italic text-xl text-white/80 max-w-3xl mx-auto mb-8">
                "Tes 1,5 million de membres méritent mieux qu'un groupe Facebook. 
                Construisons ensemble la première plateforme média où chaque clic finance une vraie action."
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-inter font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105">
                  <span className="relative z-10">On commence quand ?</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA - toujours visible */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-900 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <p className="font-playfair italic text-lg text-white/60">
            "Wanted 3.0 × Origines : Quand 1,5 million de membres deviennent 12 médias spécialisés 
            qui changent le monde, une verticale à la fois."
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
      `}</style>
    </section>
  );
};

export default PartnershipVisionSection;