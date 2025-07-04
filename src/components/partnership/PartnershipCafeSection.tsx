import React, { useState, useEffect, useRef } from 'react';
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

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="font-montserrat font-black text-3xl lg:text-5xl text-white mb-4">
            Wanted Café & Co
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Le seul café au monde qui nourrit le jour et devient viral la nuit. 
            Un tiers-lieu rentable qui prouve qu'on peut faire du business ET de l'impact.
          </p>
        </div>

        {/* Stats rapides */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <Coffee className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="font-montserrat font-bold text-3xl text-white">200</div>
            <div className="text-white/60 text-sm">couverts/jour</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <Mic className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="font-montserrat font-bold text-3xl text-white">50</div>
            <div className="text-white/60 text-sm">podcasts/mois</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <Camera className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <div className="font-montserrat font-bold text-3xl text-white">200k</div>
            <div className="text-white/60 text-sm">vues/soir</div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="font-montserrat font-bold text-3xl text-white">75k€</div>
            <div className="text-white/60 text-sm">CA/mois</div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex justify-center mb-12 transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('concept')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                activeTab === 'concept'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Clock className="w-5 h-5 inline mr-2" />
              Une journée type
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Services & Innovation
            </button>
            <button
              onClick={() => setActiveTab('franchise')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                activeTab === 'franchise'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Building2 className="w-5 h-5 inline mr-2" />
              Devenir franchisé
            </button>
          </div>
        </div>

        {/* Contenu des tabs */}
        <div className={`transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          
          {/* Tab: Une journée type */}
          {activeTab === 'concept' && (
            <div>
              <h3 className="font-montserrat font-bold text-2xl text-white text-center mb-10">
                Un lieu qui vit et se transforme
              </h3>

              {/* Timeline selector */}
              <div className="flex justify-center gap-2 mb-10">
                {Object.entries(timeSlots).map(([key, slot]) => (
                  <button
                    key={key}
                    onClick={() => setTimeOfDay(key as any)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      timeOfDay === key
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-105'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    <slot.icon className="w-5 h-5 inline mr-2" />
                    {slot.hours}
                  </button>
                ))}
              </div>

              {/* Contenu par moment */}
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                  <h4 className="font-montserrat font-bold text-2xl text-white mb-2">
                    {timeSlots[timeOfDay].title}
                  </h4>
                  <p className="text-white/60 mb-6">{timeSlots[timeOfDay].vibe}</p>
                  
                  <div className="space-y-3 mb-6">
                    {timeSlots[timeOfDay].activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <ChevronRight className="w-5 h-5 text-orange-400" />
                        <span className="text-white/80">{activity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">CA estimé</span>
                      <span className="text-2xl font-bold text-green-400">
                        {timeSlots[timeOfDay].revenue}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visualisation transformation */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10">
                    <h5 className="font-semibold text-white mb-4 text-center">
                      Configuration de l'espace
                    </h5>
                    
                    {timeOfDay === 'midi' && (
                      <div className="space-y-2 text-white/70">
                        <p>• 80 places assises restaurant</p>
                        <p>• 20 places mange debout</p>
                        <p>• Service rapide optimisé</p>
                        <p>• Four à pizza plein feu</p>
                      </div>
                    )}
                    
                    {timeOfDay === 'apres-midi' && (
                      <div className="space-y-2 text-white/70">
                        <p>• 4 tables podcast équipées</p>
                        <p>• 12 places coworking</p>
                        <p>• Espace détente canapés</p>
                        <p>• Zone kids surveillée</p>
                      </div>
                    )}
                    
                    {timeOfDay === 'soir' && (
                      <div className="space-y-2 text-white/70">
                        <p>• Scène centrale 20m²</p>
                        <p>• 60 places spectacle</p>
                        <p>• 3 caméras + éclairage pro</p>
                        <p>• Zone networking/bar</p>
                      </div>
                    )}
                    
                    <div className="mt-6 text-center">
                      <p className="text-sm text-white/50">Transformation en</p>
                      <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
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
              <div className="mb-16">
                <h3 className="font-montserrat font-bold text-2xl text-white text-center mb-10">
                  Services solidaires permanents
                </h3>
                <div className="grid lg:grid-cols-3 gap-6">
                  {services.map((service, idx) => (
                    <div key={idx} className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                      <service.icon className="w-10 h-10 text-orange-400 mb-4" />
                      <h4 className="font-semibold text-white mb-2">{service.title}</h4>
                      <p className="text-white/60 text-sm">{service.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu Podcast Innovation */}
              <div>
                <h3 className="font-montserrat font-bold text-2xl text-white text-center mb-4">
                  🎙️ Le Menu Podcast
                </h3>
                <p className="text-center text-white/60 mb-10 max-w-2xl mx-auto">
                  "Viens déjeuner, repars avec ton podcast monté" - Transform ta table en studio pro
                </p>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                  {podcastPackages.map((pkg, idx) => (
                    <div key={idx} className={`relative ${pkg.popular ? 'lg:-mt-4' : ''}`}>
                      {pkg.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                            PLUS POPULAIRE
                          </div>
                        </div>
                      )}
                      
                      <div className={`h-full bg-black/60 backdrop-blur-xl rounded-3xl p-8 border transition-all ${
                        pkg.popular ? 'border-yellow-500/30' : 'border-white/10 hover:border-white/20'
                      }`}>
                        <h4 className="font-montserrat font-bold text-xl text-white mb-2">
                          {pkg.name}
                        </h4>
                        <p className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${pkg.color} mb-6`}>
                          {pkg.price}
                        </p>
                        
                        <ul className="space-y-3">
                          {pkg.features.map((feature, fidx) => (
                            <li key={fidx} className="flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-white/40 mt-0.5" />
                              <span className="text-white/80 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Setup technique */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20">
                  <h4 className="font-semibold text-xl text-white mb-4 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-purple-400" />
                    Setup technique anti-bruit
                  </h4>
                  <div className="grid lg:grid-cols-2 gap-6 text-white/80">
                    <div>
                      <p className="mb-2">• Micros cardioïdes directionnels</p>
                      <p className="mb-2">• Panneaux acoustiques design intégrés</p>
                      <p>• Zone podcast avec tables espacées</p>
                    </div>
                    <div>
                      <p className="mb-2">• Casques monitoring discrets</p>
                      <p className="mb-2">• Interface audio dans la table</p>
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
              <h3 className="font-montserrat font-bold text-2xl text-white text-center mb-10">
                Rejoins le réseau Wanted Café
              </h3>

              <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Investment */}
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20">
                  <h4 className="font-semibold text-xl text-white mb-6 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                    Investment initial : 150k€
                  </h4>
                  <div className="space-y-3">
                    {franchiseData.investment.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-white/80">{item.label}</span>
                        <span className="font-bold text-blue-400">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projections */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-3xl p-8 border border-green-500/20">
                  <h4 className="font-semibold text-xl text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    Projections financières
                  </h4>
                  <div className="space-y-3">
                    {franchiseData.projections.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-white/80">{item.label}</span>
                        <span className="font-bold text-green-400">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ce qu'apporte la franchise */}
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-10 border border-white/10 mb-12">
                <h4 className="font-semibold text-xl text-white mb-8 text-center">
                  Ce qu'on t'apporte
                </h4>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                    <h5 className="font-semibold text-white mb-2">Community 1.5M</h5>
                    <p className="text-white/60 text-sm">Flux client garanti dès J1</p>
                  </div>
                  <div className="text-center">
                    <Book className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <h5 className="font-semibold text-white mb-2">Playbook complet</h5>
                    <p className="text-white/60 text-sm">Formation + process + outils</p>
                  </div>
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                    <h5 className="font-semibold text-white mb-2">Pipeline contenus</h5>
                    <p className="text-white/60 text-sm">Events et tournages garantis</p>
                  </div>
                </div>
              </div>

              {/* Timeline expansion */}
              <div className="bg-gradient-to-r from-orange-600/10 via-purple-600/10 to-blue-600/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
                <h4 className="font-semibold text-xl text-white mb-8 text-center">
                  Plan d'expansion
                </h4>
                <div className="space-y-4">
                  {[
                    { year: 'An 1', goal: '3 cafés pilotes', cities: 'Paris, Lyon, Marseille' },
                    { year: 'An 2', goal: '10 franchises', cities: 'Grandes villes' },
                    { year: 'An 3', goal: '20 cafés', cities: '+ version light' },
                    { year: 'An 5', goal: '50 cafés', cities: 'France + Belgique/Suisse' }
                  ].map((phase, idx) => (
                    <div key={idx} className="flex items-center gap-6">
                      <div className="w-20 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-1">
                          <span className="text-white font-bold">{idx + 1}</span>
                        </div>
                        <span className="text-xs text-white/60">{phase.year}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-white">{phase.goal}</h5>
                        <p className="text-white/60 text-sm">{phase.cities}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Franchise */}
              <div className="text-center mt-12">
                <p className="text-xl text-white/80 mb-6">
                  Profil idéal : Duo complémentaire (resto + impact) avec ancrage local fort
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-bold text-lg hover:scale-105 transition-transform">
                  Demander le dossier franchise
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message final */}
        <div className={`mt-20 text-center transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-orange-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
            <MapPin className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="font-montserrat font-bold text-2xl text-white mb-4">
              Visite le café pilote
            </h3>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
              Viens découvrir le concept en vrai au Wanted Café Paris. 
              Prends un café le matin, déjeune le midi, enregistre ton podcast l'après-midi 
              et assiste à un event le soir !
            </p>
            <div className="inline-flex items-center gap-2 text-white/60">
              <MapPin className="w-5 h-5" />
              <span>14 rue de la Solidarité, 75011 Paris</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipCafeSection;