import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Sparkles, Award, LinkedinIcon, Twitter, Globe, 
  Camera, Mic, PenTool, BarChart3, Code, Megaphone,
  Heart, Target, Rocket, Shield, ChevronRight, Star
} from 'lucide-react';

const PartnershipTeamSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'founders' | 'creators' | 'advisory'>('founders');
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
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

  // Données des fondateurs
  const founders = [
    {
      id: 'wanted-founder',
      nom: 'Fondateur Wanted',
      role: 'CEO & Visionnaire',
      bio: '10 ans d\'expérience dans l\'impact social. A transformé une page Facebook en mouvement national de 1.5M de membres.',
      expertise: ['Community Building', 'Impact Social', 'Médias'],
      achievements: ['1.5M membres', '50k actions/an', 'Cafés solidaires'],
      color: 'from-orange-400 to-red-400',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 'origines-founder',
      nom: 'Fondateur Origines',
      role: 'CEO & Directeur Créatif',
      bio: 'Expert en production de contenus viraux. 100M+ de vues générées. Obsédé par l\'impact émotionnel.',
      expertise: ['Production Vidéo', 'Storytelling', 'Growth Hacking'],
      achievements: ['200+ formats créés', '100M vues', '50+ clients'],
      color: 'from-violet-400 to-purple-400',
      linkedin: '#',
      twitter: '#'
    }
  ];

  // Données des équipes
  const teams = {
    production: {
      title: 'Production & Création',
      icon: Camera,
      color: 'from-pink-500 to-rose-500',
      members: [
        { role: 'Head of Production', count: 1, skills: 'Coordination, Planning, Qualité' },
        { role: 'Réalisateurs', count: 8, skills: 'Tournage, Direction artistique' },
        { role: 'Monteurs', count: 12, skills: 'Editing, Motion design, Color' },
        { role: 'Créateurs de contenus', count: 30, skills: 'Shorts, Reels, Stories' }
      ]
    },
    editorial: {
      title: 'Éditorial & Stratégie',
      icon: PenTool,
      color: 'from-blue-500 to-indigo-500',
      members: [
        { role: 'Head of Content', count: 1, skills: 'Stratégie éditoriale, Ton' },
        { role: 'Responsables verticales', count: 12, skills: '1 expert par thématique' },
        { role: 'Copywriters', count: 6, skills: 'Scripts, Articles, Captions' },
        { role: 'Community Managers', count: 8, skills: 'Modération, Engagement' }
      ]
    },
    tech: {
      title: 'Tech & Data',
      icon: Code,
      color: 'from-green-500 to-emerald-500',
      members: [
        { role: 'CTO', count: 1, skills: 'Architecture, Vision tech' },
        { role: 'Développeurs', count: 4, skills: 'IA, Algorithmes, APIs' },
        { role: 'Data Analysts', count: 3, skills: 'Metrics, Insights, ROI' },
        { role: 'Growth Hackers', count: 2, skills: 'SEO, Viral loops, A/B' }
      ]
    },
    business: {
      title: 'Business & Impact',
      icon: Target,
      color: 'from-purple-500 to-violet-500',
      members: [
        { role: 'Head of Partnerships', count: 1, skills: 'Négociation, Stratégie' },
        { role: 'Account Managers', count: 4, skills: 'Relation sponsors' },
        { role: 'Impact Managers', count: 3, skills: 'Mesure impact, Reporting' },
        { role: 'Ops & Finance', count: 2, skills: 'Process, Comptabilité' }
      ]
    }
  };

  // Advisory Board
  const advisors = [
    {
      nom: 'Expert Média',
      expertise: 'Ex-Directeur France TV',
      apport: 'Stratégie média, Distribution',
      icon: Mic
    },
    {
      nom: 'Expert Tech',
      expertise: 'Ex-CTO Dailymotion',
      apport: 'Scalabilité, IA, Algos',
      icon: Code
    },
    {
      nom: 'Expert Impact',
      expertise: 'Fondateur ONG majeure',
      apport: 'Mesure impact, Partenariats',
      icon: Heart
    },
    {
      nom: 'Expert Finance',
      expertise: 'VC Partner Impact',
      apport: 'Levée de fonds, Growth',
      icon: BarChart3
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 bg-white overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.06),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="font-montserrat font-black text-3xl lg:text-5xl text-gray-900 mb-4">
            L'Équipe derrière l'Empire
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            50+ créateurs passionnés, 12 experts verticales, 2 fondateurs visionnaires. 
            Unis pour transformer l'entraide en média d'impact.
          </p>
        </div>

        {/* Stats rapides */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="text-center p-6 bg-gray-50 shadow-sm rounded-2xl border border-gray-200">
            <Users className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <div className="font-montserrat font-bold text-3xl text-gray-900">120+</div>
            <div className="text-gray-500 text-sm">Équipe totale</div>
          </div>
          <div className="text-center p-6 bg-gray-50 shadow-sm rounded-2xl border border-gray-200">
            <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="font-montserrat font-bold text-3xl text-gray-900">50</div>
            <div className="text-gray-500 text-sm">Créateurs</div>
          </div>
          <div className="text-center p-6 bg-gray-50 shadow-sm rounded-2xl border border-gray-200">
            <Target className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <div className="font-montserrat font-bold text-3xl text-gray-900">12</div>
            <div className="text-gray-500 text-sm">Experts verticales</div>
          </div>
          <div className="text-center p-6 bg-gray-50 shadow-sm rounded-2xl border border-gray-200">
            <Award className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="font-montserrat font-bold text-3xl text-gray-900">15</div>
            <div className="text-gray-500 text-sm">Années d'XP moyenne</div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex justify-center mb-12 transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex bg-gray-50 shadow-sm rounded-full p-1 border border-gray-200">
            <button
              onClick={() => setActiveTab('founders')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                activeTab === 'founders'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Star className="w-5 h-5 inline mr-2" />
              Fondateurs
            </button>
            <button
              onClick={() => setActiveTab('creators')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                activeTab === 'creators'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Équipes
            </button>
            <button
              onClick={() => setActiveTab('advisory')}
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                activeTab === 'advisory'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Shield className="w-5 h-5 inline mr-2" />
              Advisory
            </button>
          </div>
        </div>

        {/* Contenu des tabs */}
        <div className={`transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          
          {/* Tab: Fondateurs */}
          {activeTab === 'founders' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {founders.map((founder) => (
                <div
                  key={founder.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredMember(founder.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${founder.color} rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity`} />
                  <div className="relative bg-white shadow-sm rounded-3xl p-8 border border-gray-200 h-full">
                    {/* Header avec avatar placeholder */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${founder.color} flex items-center justify-center text-gray-900 text-3xl font-bold`}>
                        {founder.nom.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-1">
                          {founder.nom}
                        </h3>
                        <p className={`font-semibold text-transparent bg-clip-text bg-gradient-to-r ${founder.color}`}>
                          {founder.role}
                        </p>
                        {/* Social links */}
                        <div className="flex gap-3 mt-3">
                          <a href={founder.linkedin} className="text-gray-400 hover:text-gray-900 transition-colors">
                            <LinkedinIcon className="w-5 h-5" />
                          </a>
                          <a href={founder.twitter} className="text-gray-400 hover:text-gray-900 transition-colors">
                            <Twitter className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-600 mb-6">
                      {founder.bio}
                    </p>

                    {/* Expertise */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 mb-3">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {founder.expertise.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 mb-3">Réalisations clés</h4>
                      <div className="space-y-2">
                        {founder.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <ChevronRight className={`w-4 h-4 text-transparent bg-clip-text bg-gradient-to-r ${founder.color}`} />
                            <span className="text-gray-600 text-sm">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Équipes */}
          {activeTab === 'creators' && (
            <div>
              <div className="grid lg:grid-cols-2 gap-8">
                {Object.entries(teams).map(([key, team]) => (
                  <div key={key} className="bg-white shadow-sm rounded-3xl p-8 border border-gray-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${team.color} flex items-center justify-center`}>
                        <team.icon className="w-6 h-6 text-gray-900" />
                      </div>
                      <h3 className="font-montserrat font-bold text-xl text-gray-900">
                        {team.title}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {team.members.map((member, index) => (
                        <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{member.role}</h4>
                            <p className="text-sm text-gray-500">{member.skills}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${team.color} bg-opacity-20`}>
                            <span className="font-bold text-gray-900">{member.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total par équipe */}
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                      <p className="text-sm text-gray-500">Total équipe</p>
                      <p className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${team.color}`}>
                        {team.members.reduce((acc, m) => acc + m.count, 0)} personnes
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Culture d'équipe */}
              <div className="mt-12 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-pink-600/10 shadow-sm rounded-3xl p-10 border border-gray-300">
                <h3 className="font-montserrat font-bold text-2xl text-gray-900 text-center mb-8">
                  Notre Culture
                </h3>
                <div className="grid lg:grid-cols-3 gap-6 text-center">
                  <div>
                    <Rocket className="w-10 h-10 text-violet-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Impact First</h4>
                    <p className="text-gray-500 text-sm">Chaque décision est prise en fonction de l'impact réel généré</p>
                  </div>
                  <div>
                    <Heart className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Authenticité</h4>
                    <p className="text-gray-500 text-sm">Les vraies histoires, les vraies émotions, pas de bullshit</p>
                  </div>
                  <div>
                    <Sparkles className="w-10 h-10 text-pink-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Excellence</h4>
                    <p className="text-gray-500 text-sm">On vise Netflix, pas YouTube. Qualité sur quantité</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Advisory Board */}
          {activeTab === 'advisory' && (
            <div>
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {advisors.map((advisor, index) => (
                  <div key={index} className="bg-white shadow-sm rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                        <advisor.icon className="w-7 h-7 text-gray-900" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-montserrat font-bold text-xl text-gray-900 mb-1">
                          {advisor.nom}
                        </h4>
                        <p className="text-blue-400 font-semibold mb-3">
                          {advisor.expertise}
                        </p>
                        <p className="text-gray-500">
                          <span className="font-semibold">Apporte :</span> {advisor.apport}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pourquoi ils nous conseillent */}
              <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 shadow-sm rounded-3xl p-10 border border-blue-500/20 text-center">
                <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-6">
                  Pourquoi ils croient au projet
                </h3>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                  "C'est la première fois qu'on voit un modèle média où 
                  <span className="font-bold text-blue-400"> 100% de la valeur créée retourne à l'impact social</span>. 
                  Wanted × Origines ne fait pas dans le charity washing, ils créent un nouveau standard."
                </p>
                <p className="text-gray-500">
                  - Citation collective de l'Advisory Board
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message de recrutement */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 shadow-sm rounded-3xl p-10 border border-green-500/20">
            <Megaphone className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">
              On recrute les meilleurs
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Si tu veux créer du contenu qui a du sens, rejoins-nous. 
              On cherche des créateurs, des monteurs, des growth hackers qui veulent changer le game.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-gray-900 font-bold hover:scale-105 transition-transform">
              Voir les postes ouverts
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipTeamSection;