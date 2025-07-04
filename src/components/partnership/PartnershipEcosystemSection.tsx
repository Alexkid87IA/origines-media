import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, TrendingUp, Shield, Clock, Eye, DollarSign,
  CheckCircle, ArrowRight, BarChart3, Users, Zap, Target,
  Package, Megaphone, Sparkles, HandshakeIcon
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
            Notre Offre Commerciale
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Comment on monétise l'empire média : sponsors alignés, production evergreen, 
            impact mesurable. Voici ce qu'on peut proposer.
          </p>
        </div>

        {/* Le modèle en chiffres */}
        <div className={`mb-20 transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-3xl p-10 border border-orange-500/20">
            <h3 className="font-montserrat font-bold text-2xl text-white text-center mb-10">
              Le Modèle Économique Wanted × Origines
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400 mb-2">12</div>
                <div className="text-white/80">Verticales monétisables</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">200</div>
                <div className="text-white/80">Contenus/mois</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400 mb-2">400k€</div>
                <div className="text-white/80">Potentiel mensuel</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-white/80">Réinvesti impact</div>
              </div>
            </div>

            {/* La formule magique */}
            <div className="text-center p-6 bg-black/30 rounded-2xl border border-white/10">
              <p className="text-lg text-white/90">
                <span className="font-bold text-orange-400">1 sponsor par verticale</span> × 
                <span className="font-bold text-purple-400"> 12 verticales</span> × 
                <span className="font-bold text-pink-400"> 30k€ moyen</span> = 
                <span className="font-bold text-green-400"> 360k€/mois</span>
              </p>
              <p className="text-sm text-white/60 mt-2">
                50% production Origines, 50% actions terrain Wanted
              </p>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className={`flex justify-center mb-12 transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10">
            <button
              onClick={() => setActiveTab('model')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                activeTab === 'model'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Le Modèle
            </button>
            <button
              onClick={() => setActiveTab('verticales')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                activeTab === 'verticales'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Par Verticale
            </button>
            <button
              onClick={() => setActiveTab('process')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                activeTab === 'process'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <HandshakeIcon className="w-5 h-5 inline mr-2" />
              Process Commercial
            </button>
          </div>
        </div>

        {/* Contenu des tabs */}
        <div className={`transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          
          {/* Tab: Le Modèle */}
          {activeTab === 'model' && (
            <div>
              <h3 className="font-montserrat font-bold text-2xl text-white text-center mb-10">
                Ce qu'on propose aux sponsors
              </h3>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Package Découverte */}
                <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
                  <h4 className="font-montserrat font-bold text-xl text-white mb-2">Package Découverte</h4>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">
                    10k€/mois
                  </p>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>1 verticale au choix</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>4 contenus sponsorisés/mois</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>500k vues minimum garanties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Présence logo sur contenus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Rapport d'impact mensuel</span>
                    </li>
                  </ul>
                </div>

                {/* Package Engagement */}
                <div className="relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                      RECOMMANDÉ
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-500/40 transition-all">
                    <h4 className="font-montserrat font-bold text-xl text-white mb-2">Package Engagement</h4>
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
                      25k€/mois
                    </p>
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>3 verticales synergiques</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>12 contenus/mois + série dédiée</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>2M vues minimum garanties</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Co-création éditoriale</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Activation café-studio 1x/mois</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>Data insights exclusifs</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Package Impact */}
                <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
                  <h4 className="font-montserrat font-bold text-xl text-white mb-2">Package Impact</h4>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-6">
                    50k€/mois
                  </p>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Toutes les verticales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>30 contenus/mois omniformats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>5M vues minimum garanties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Documentaire trimestriel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Events partenaires VIP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>Co-branding série signature</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Ce qui est inclus */}
              <div className="mt-12 grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20">
                  <h4 className="font-semibold text-xl text-green-400 mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Garanties Incluses
                  </h4>
                  <ul className="space-y-2 text-white/80">
                    <li>✓ Vues minimum garanties ou remboursées</li>
                    <li>✓ Contenu evergreen (durée de vie 12+ mois)</li>
                    <li>✓ Brand safety 100% (validation avant diffusion)</li>
                    <li>✓ Exclusivité sectorielle par verticale</li>
                    <li>✓ Droits d'usage illimités sur contenus</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
                  <h4 className="font-semibold text-xl text-blue-400 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" />
                    KPIs Mesurés
                  </h4>
                  <ul className="space-y-2 text-white/80">
                    <li>📊 Vues totales et reach unique</li>
                    <li>💬 Engagement (likes, partages, commentaires)</li>
                    <li>🎯 Conversions vers actions concrètes</li>
                    <li>😊 Sentiment analysis de l'audience</li>
                    <li>📈 Evolution de la notoriété marque</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Par Verticale */}
          {activeTab === 'verticales' && (
            <div>
              <h3 className="font-montserrat font-bold text-2xl text-white text-center mb-10">
                Potentiel Commercial par Verticale
              </h3>

              <div className="grid lg:grid-cols-2 gap-8">
                {verticales.map((verticale, index) => (
                  <div key={index} className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-montserrat font-bold text-xl text-white">
                        {verticale.nom}
                      </h4>
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-green-400 text-sm font-semibold">
                        {verticale.potentiel}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-white/60 mb-1">Audience active</p>
                        <p className="font-semibold text-white">{verticale.audience}</p>
                      </div>

                      <div>
                        <p className="text-sm text-white/60 mb-2">Sponsors potentiels</p>
                        <div className="flex flex-wrap gap-2">
                          {verticale.sponsors.map((sponsor, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80">
                              {sponsor}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-white/60 mb-2">Formats qui cartonnent</p>
                        <div className="space-y-1">
                          {verticale.formats.map((format, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-white/70">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
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
              <div className="mt-12 bg-gradient-to-r from-violet-600/10 to-purple-600/10 backdrop-blur-xl rounded-3xl p-8 border border-violet-500/20 text-center">
                <h4 className="font-montserrat font-bold text-xl text-white mb-4">
                  Projection Année 1
                </h4>
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-3xl font-bold text-violet-400">12</p>
                    <p className="text-white/60">Sponsors majeurs</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-purple-400">4.8M€</p>
                    <p className="text-white/60">CA annuel</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-pink-400">2.4M€</p>
                    <p className="text-white/60">Réinvesti terrain</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Process Commercial */}
          {activeTab === 'process' && (
            <div>
              <h3 className="font-montserrat font-bold text-2xl text-white text-center mb-10">
                Comment on vend ça
              </h3>

              {/* Les 4 étapes */}
              <div className="space-y-8 mb-12">
                {[
                  {
                    step: 1,
                    title: "Identification & Qualification",
                    desc: "On cible les marques alignées avec nos valeurs",
                    actions: [
                      "Mapping des sponsors potentiels par verticale",
                      "Scoring d'alignement valeurs/impact",
                      "Prise de contact via réseau ou direct"
                    ]
                  },
                  {
                    step: 2,
                    title: "Pitch & Personnalisation",
                    desc: "On montre l'impact concret et l'audience qualifiée",
                    actions: [
                      "Présentation cas d'usage leur secteur",
                      "Demo live de contenus existants",
                      "Proposition sur-mesure selon objectifs"
                    ]
                  },
                  {
                    step: 3,
                    title: "Test & Validation",
                    desc: "On prouve la valeur avec un pilote",
                    actions: [
                      "Campagne test 1 mois sur 1 verticale",
                      "Reporting hebdo des performances",
                      "Ajustements temps réel"
                    ]
                  },
                  {
                    step: 4,
                    title: "Scale & Fidélisation",
                    desc: "On développe le partenariat dans la durée",
                    actions: [
                      "Extension progressive aux autres verticales",
                      "Co-création de formats exclusifs",
                      "Events partenaires et activations terrain"
                    ]
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-white mb-2">{item.title}</h4>
                      <p className="text-white/60 mb-3">{item.desc}</p>
                      <ul className="space-y-1">
                        {item.actions.map((action, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-white/80">
                            <ArrowRight className="w-4 h-4 text-orange-400" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Outils commerciaux */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
                  <Megaphone className="w-8 h-8 text-cyan-400 mb-3" />
                  <h5 className="font-semibold text-white mb-2">Kit de Vente</h5>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Deck de présentation</li>
                    <li>• Vidéo démo 3 min</li>
                    <li>• Case studies PDF</li>
                    <li>• Simulateur ROI</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                  <Target className="w-8 h-8 text-purple-400 mb-3" />
                  <h5 className="font-semibold text-white mb-2">CRM & Tracking</h5>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• Pipeline Notion/Airtable</li>
                    <li>• Templates emails</li>
                    <li>• Calendly démos</li>
                    <li>• Dashboard performances</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                  <Users className="w-8 h-8 text-green-400 mb-3" />
                  <h5 className="font-semibold text-white mb-2">Équipe Commerciale</h5>
                  <ul className="space-y-1 text-sm text-white/70">
                    <li>• 1 Head of Sales</li>
                    <li>• 2 Account Managers</li>
                    <li>• 1 Customer Success</li>
                    <li>• Commissions attractives</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message final */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-orange-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20">
            <p className="text-xl text-white/90 mb-4">
              On ne vend pas de la pub. On vend de <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">l'impact mesurable</span>.
            </p>
            <p className="text-lg text-white/70">
              Chaque euro investi génère des vues, mais surtout des actions concrètes.
              <br />
              Les sponsors deviennent des partenaires du changement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipEcosystemSection;