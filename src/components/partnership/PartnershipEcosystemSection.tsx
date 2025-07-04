import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, TrendingUp, Shield, Clock, Eye, DollarSign,
  CheckCircle, ArrowRight, BarChart3, Users, Zap, Target,
  Package, Megaphone, Sparkles, Handshake
} from 'lucide-react';

const PartnershipEcosystemSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'model' | 'verticales' | 'process'>('model');
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

  // Les 12 verticales avec leur potentiel commercial
  const verticales = [
    {
      nom: 'WantedAnimaux',
      audience: '280k membres',
      sponsors: ['Purina', 'Royal Canin', 'SantéVet'],
      potentiel: '25-40k€/mois',
      formats: ['Adoptions filmées', 'Conseils véto', 'Avant/Après']
    },
    {
      nom: 'WantedBusiness',
      audience: '350k membres',
      sponsors: ['LinkedIn', 'Indeed', 'BpiFrance'],
      potentiel: '40-60k€/mois',
      formats: ['Success stories', 'Masterclass', 'Mentoring live']
    },
    {
      nom: 'WantedLogement',
      audience: '420k membres',
      sponsors: ['Century21', 'Leboncoin Immo', 'CAF'],
      potentiel: '35-50k€/mois',
      formats: ['Tours virtuels', 'Guides quartiers', 'Témoignages']
    },
    {
      nom: 'WantedSanté',
      audience: '190k membres',
      sponsors: ['Doctolib', 'MGEN', 'Santé.fr'],
      potentiel: '30-45k€/mois',
      formats: ['Parcours patients', 'Prévention', 'Interviews médecins']
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.08),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Badge supérieur */}
          <div className="inline-flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
            <span className="font-inter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase font-medium">
              MACHINE À CASH
            </span>
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
          </div>
          
          {/* Titre principal */}
          <h2 className="font-montserrat font-black uppercase tracking-tight leading-tight mb-3 sm:mb-4">
            <span className="block text-3xl sm:text-5xl lg:text-7xl text-white">
              L'OFFRE
            </span>
            <span className="block text-4xl sm:text-6xl lg:text-8xl gradient-text-animated">
              COMMERCIALE
            </span>
          </h2>
          
          {/* Sous-titre enrichi */}
          <p className="text-base sm:text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto px-4 mb-4 sm:mb-6">
            Des sponsors qui <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">financent l'impact</span>, 
            des contenus qui <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">génèrent du sens</span>
          </p>
          
          {/* Punchline finale */}
          <p className="text-sm sm:text-base text-white/50 font-medium max-w-2xl mx-auto px-4">
            La première plateforme média où chaque euro investi crée une action concrète sur le terrain
          </p>
        </div>

        {/* Le modèle en chiffres */}
        <div className={`mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 border border-orange-500/20">
            <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-white text-center mb-6 sm:mb-8 lg:mb-10">
              Le Modèle Économique Wanted × Origines
            </h3>
            
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 mb-6 sm:mb-8 lg:mb-10">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-400 mb-1 sm:mb-2">12</div>
                <div className="text-xs sm:text-sm lg:text-base text-white/80">Verticales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-1 sm:mb-2">200</div>
                <div className="text-xs sm:text-sm lg:text-base text-white/80">Contenus/mois</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-400 mb-1 sm:mb-2">400k€</div>
                <div className="text-xs sm:text-sm lg:text-base text-white/80">Potentiel/mois</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mb-1 sm:mb-2">100%</div>
                <div className="text-xs sm:text-sm lg:text-base text-white/80">Réinvesti</div>
              </div>
            </div>

            {/* La formule magique */}
            <div className="text-center p-4 sm:p-6 bg-black/30 rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10">
              <p className="text-sm sm:text-base lg:text-lg text-white/90">
                <span className="font-bold text-orange-400">1 sponsor</span> × 
                <span className="font-bold text-purple-400"> 12 verticales</span> × 
                <span className="font-bold text-pink-400"> 30k€</span> = 
                <span className="font-bold text-green-400"> 360k€/mois</span>
              </p>
              <p className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-2">
                50% production, 50% actions terrain
              </p>
            </div>
          </div>
        </div>

        {/* Tabs navigation - Scroll horizontal sur mobile */}
        <div className={`flex justify-center mb-8 sm:mb-10 lg:mb-12 transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10 min-w-max">
              <button
                onClick={() => setActiveTab('model')}
                className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'model'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                Le Modèle
              </button>
              <button
                onClick={() => setActiveTab('verticales')}
                className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'verticales'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                Par Verticale
              </button>
              <button
                onClick={() => setActiveTab('process')}
                className={`px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'process'
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Handshake className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                Process
              </button>
            </div>
          </div>
        </div>

        {/* Contenu des tabs */}
        <div className={`transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          
          {/* Tab: Le Modèle */}
          {activeTab === 'model' && (
            <div>
              <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-white text-center mb-6 sm:mb-8 lg:mb-10">
                Ce qu'on propose aux sponsors
              </h3>

              <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
                {/* Package Découverte */}
                <div className="bg-black/60 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all">
                  <h4 className="font-montserrat font-bold text-lg sm:text-xl text-white mb-1 sm:mb-2">Package Découverte</h4>
                  <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4 sm:mb-6">
                    10k€/mois
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-white/80 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>1 verticale au choix</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>4 contenus sponsorisés/mois</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>500k vues minimum</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Présence logo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Rapport mensuel</span>
                    </li>
                  </ul>
                </div>

                {/* Package Engagement */}
                <div className="relative">
                  <div className="absolute -top-3 sm:top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 rounded-full">
                      RECOMMANDÉ
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 border border-purple-500/30 hover:border-purple-500/40 transition-all">
                    <h4 className="font-montserrat font-bold text-lg sm:text-xl text-white mb-1 sm:mb-2">Package Engagement</h4>
                    <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 sm:mb-6">
                      25k€/mois
                    </p>
                    <ul className="space-y-2 sm:space-y-3 text-white/80 text-sm sm:text-base">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>3 verticales synergiques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>12 contenus + série</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>2M vues minimum</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Co-création éditoriale</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Activation café 1x/mois</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Data insights exclusifs</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Package Impact */}
                <div className="bg-black/60 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all">
                  <h4 className="font-montserrat font-bold text-lg sm:text-xl text-white mb-1 sm:mb-2">Package Impact</h4>
                  <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-4 sm:mb-6">
                    50k€/mois
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-white/80 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Toutes les verticales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>30 contenus omniformats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>5M vues minimum</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Doc trimestriel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Events VIP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Co-branding série</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Ce qui est inclus - Stack sur mobile */}
              <div className="mt-8 sm:mt-10 lg:mt-12 grid gap-6 sm:gap-8 lg:grid-cols-2">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-green-500/20">
                  <h4 className="font-semibold text-lg sm:text-xl text-green-400 mb-3 sm:mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                    Garanties Incluses
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-white/80 text-sm sm:text-base">
                    <li>✓ Vues garanties ou remboursées</li>
                    <li>✓ Contenu evergreen (12+ mois)</li>
                    <li>✓ Brand safety 100%</li>
                    <li>✓ Exclusivité sectorielle</li>
                    <li>✓ Droits d'usage illimités</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-blue-500/20">
                  <h4 className="font-semibold text-lg sm:text-xl text-blue-400 mb-3 sm:mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                    KPIs Mesurés
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-white/80 text-sm sm:text-base">
                    <li>📊 Vues et reach unique</li>
                    <li>💬 Engagement total</li>
                    <li>🎯 Conversions actions</li>
                    <li>😊 Sentiment analysis</li>
                    <li>📈 Evolution notoriété</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Par Verticale */}
          {activeTab === 'verticales' && (
            <div>
              <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-white text-center mb-6 sm:mb-8 lg:mb-10">
                Potentiel Commercial par Verticale
              </h3>

              <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
                {verticales.map((verticale, index) => (
                  <div key={index} className="bg-black/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <h4 className="font-montserrat font-bold text-base sm:text-lg lg:text-xl text-white">
                        {verticale.nom}
                      </h4>
                      <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-green-400 text-xs sm:text-sm font-semibold">
                        {verticale.potentiel}
                      </span>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <p className="text-xs sm:text-sm text-white/60 mb-0.5 sm:mb-1">Audience active</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{verticale.audience}</p>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm text-white/60 mb-1.5 sm:mb-2">Sponsors potentiels</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {verticale.sponsors.map((sponsor, idx) => (
                            <span key={idx} className="px-2 py-0.5 sm:py-1 bg-white/10 rounded-md sm:rounded-lg text-xs text-white/80">
                              {sponsor}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm text-white/60 mb-1.5 sm:mb-2">Formats qui cartonnent</p>
                        <div className="space-y-1">
                          {verticale.formats.map((format, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-violet-400" />
                              {format}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Projection globale */}
              <div className="mt-8 sm:mt-10 lg:mt-12 bg-gradient-to-r from-violet-600/10 to-purple-600/10 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 border border-violet-500/20 text-center">
                <h4 className="font-montserrat font-bold text-lg sm:text-xl text-white mb-3 sm:mb-4">
                  Projection Année 1
                </h4>
                <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-violet-400">12</p>
                    <p className="text-xs sm:text-sm lg:text-base text-white/60">Sponsors</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-400">4.8M€</p>
                    <p className="text-xs sm:text-sm lg:text-base text-white/60">CA annuel</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-pink-400">2.4M€</p>
                    <p className="text-xs sm:text-sm lg:text-base text-white/60">Réinvesti</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Process Commercial */}
          {activeTab === 'process' && (
            <div>
              <h3 className="font-montserrat font-bold text-lg sm:text-xl lg:text-2xl text-white text-center mb-6 sm:mb-8 lg:mb-10">
                Comment on vend ça
              </h3>

              {/* Les 4 étapes */}
              <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10 lg:mb-12">
                {[
                  {
                    step: 1,
                    title: "Identification",
                    desc: "Cibler les marques alignées",
                    actions: [
                      "Mapping sponsors potentiels",
                      "Scoring alignement valeurs",
                      "Prise de contact"
                    ]
                  },
                  {
                    step: 2,
                    title: "Pitch",
                    desc: "Montrer l'impact concret",
                    actions: [
                      "Présentation cas d'usage",
                      "Demo live contenus",
                      "Proposition sur-mesure"
                    ]
                  },
                  {
                    step: 3,
                    title: "Test",
                    desc: "Prouver la valeur",
                    actions: [
                      "Campagne test 1 mois",
                      "Reporting hebdo",
                      "Ajustements temps réel"
                    ]
                  },
                  {
                    step: 4,
                    title: "Scale",
                    desc: "Développer dans la durée",
                    actions: [
                      "Extension aux verticales",
                      "Formats exclusifs",
                      "Events partenaires"
                    ]
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 sm:gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base sm:text-lg lg:text-xl text-white mb-1 sm:mb-2">{item.title}</h4>
                      <p className="text-white/60 text-sm sm:text-base mb-2 sm:mb-3">{item.desc}</p>
                      <ul className="space-y-1">
                        {item.actions.map((action, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 flex-shrink-0" />
                            <span className="truncate">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Outils commerciaux - Stack sur mobile */}
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-cyan-500/20">
                  <Megaphone className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 mb-2 sm:mb-3" />
                  <h5 className="font-semibold text-white text-sm sm:text-base mb-1.5 sm:mb-2">Kit de Vente</h5>
                  <ul className="space-y-1 text-xs sm:text-sm text-white/70">
                    <li>• Deck présentation</li>
                    <li>• Vidéo démo 3 min</li>
                    <li>• Case studies PDF</li>
                    <li>• Simulateur ROI</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/20">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mb-2 sm:mb-3" />
                  <h5 className="font-semibold text-white text-sm sm:text-base mb-1.5 sm:mb-2">CRM & Tracking</h5>
                  <ul className="space-y-1 text-xs sm:text-sm text-white/70">
                    <li>• Pipeline Notion</li>
                    <li>• Templates emails</li>
                    <li>• Calendly démos</li>
                    <li>• Dashboard perfs</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mb-2 sm:mb-3" />
                  <h5 className="font-semibold text-white text-sm sm:text-base mb-1.5 sm:mb-2">Équipe</h5>
                  <ul className="space-y-1 text-xs sm:text-sm text-white/70">
                    <li>• 1 Head of Sales</li>
                    <li>• 2 Account Managers</li>
                    <li>• 1 Customer Success</li>
                    <li>• Commissions top</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message final */}
        <div className={`text-center mt-12 sm:mt-16 lg:mt-20 transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-orange-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20">
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-2 sm:mb-4">
              On ne vend pas de la pub. On vend de <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">l'impact mesurable</span>.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-white/70">
              Chaque euro investi génère des vues et des actions concrètes.
              <br className="hidden sm:block" />
              Les sponsors deviennent partenaires du changement.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* Animation gradient pour le titre */
        .gradient-text-animated {
          background: linear-gradient(
            135deg, 
            #F97316 0%,    /* Orange */
            #EC4899 25%,   /* Rose */
            #8B5CF6 50%,   /* Violet */
            #3B82F6 75%,   /* Bleu */
            #F97316 100%   /* Orange */
          );
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

export default PartnershipEcosystemSection;