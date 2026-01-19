import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Film, Music, Palette, Edit3, Camera, Headphones, Twitter, Instagram, Linkedin, Globe, Mail, Star, TrendingUp, Users, Heart, MessageCircle, Share2, ChevronRight, Sparkles, Zap, Trophy, Target, Coffee, Layers, type LucideIcon } from 'lucide-react';

interface Animateur {
  nom: string;
  bio: string;
  avatar: string;
  role: string;
  reseaux?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
    email?: string;
  };
  stats?: {
    episodesAnimes?: number;
    anneeDebut?: number;
    specialite?: string;
  };
}

interface Credits {
  producteur?: string;
  realisateur?: string;
  montage?: string;
  musique?: string;
  direction_artistique?: string;
  sound_design?: string;
  coloriste?: string;
  assistant_production?: string;
}

interface TeamMember {
  nom: string;
  role: string;
  avatar?: string;
  specialite?: string;
  episodesContribution?: number;
  reseaux?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface ActeEquipeCreditsProps {
  formatId: string;
  formatName: string;
  formatColor: string;
  animateur: Animateur;
  credits: Credits;
  teamMembers?: TeamMember[];
  awards?: string[];
  partenaires?: { nom: string; logo: string }[];
}

const ActeEquipeCredits: React.FC<ActeEquipeCreditsProps> = ({
  formatId,
  formatName,
  formatColor,
  animateur,
  credits,
  teamMembers = [
    {
      nom: 'Emma Chen',
      role: 'Directrice Artistique',
      avatar: '/placeholder.svg',
      specialite: 'Visual Storytelling',
      episodesContribution: 45,
      reseaux: { twitter: '@emmachen', instagram: '@emma.chen' }
    },
    {
      nom: 'Lucas Bernard',
      role: 'Sound Designer',
      avatar: '/placeholder.svg',
      specialite: 'Audio Immersif',
      episodesContribution: 38,
      reseaux: { linkedin: 'lucas-bernard' }
    }
  ],
  awards = ['Emmy Digital 2024', 'Prix Innovation Media', 'Best Format Award'],
  partenaires = [
    { nom: 'Netflix', logo: '/placeholder.svg' },
    { nom: 'Arte', logo: '/placeholder.svg' }
  ]
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'team' | 'credits' | 'awards'>('team');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getRoleIcon = (role: string): LucideIcon => {
    const roleMap: Record<string, LucideIcon> = {
      'producteur': Film,
      'realisateur': Camera,
      'montage': Edit3,
      'musique': Music,
      'direction_artistique': Palette,
      'sound_design': Headphones,
      'coloriste': Palette,
      'assistant_production': Users
    };
    return roleMap[role] || User;
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'linkedin': return Linkedin;
      case 'website': return Globe;
      case 'email': return Mail;
      default: return Globe;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gray-50"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">

        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div
              className="w-16 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
            <span
              className="font-inter text-sm tracking-[0.3em] uppercase font-medium flex items-center gap-2"
              style={{ color: formatColor }}
            >
              <Users className="w-4 h-4" />
              Acte 4
            </span>
            <div
              className="w-16 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
          </div>

          <h2 className="font-montserrat font-black text-4xl lg:text-5xl text-gray-900 mb-6">
            L'Équipe &{' '}
            <span style={{ color: formatColor }}>
              Crédits
            </span>
          </h2>

          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Les talents créatifs derrière {formatName}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className={`flex justify-center mb-12 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
            {[
              { id: 'team', label: 'Équipe', icon: Users },
              { id: 'credits', label: 'Crédits', icon: Film },
              { id: 'awards', label: 'Récompenses', icon: Trophy }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="relative px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="equipeCreditsTabIndicator"
                      className="absolute inset-0 rounded-full shadow-md"
                      style={{ backgroundColor: formatColor }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={`relative z-10 w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                  <span className={`relative z-10 font-medium ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content based on active tab */}
        <div className={`transform transition-all duration-1000 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-12">
              {/* Animateur Principal - Hero Card */}
              <div
                className="relative group"
                onMouseEnter={() => setHoveredCard('animateur')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="relative overflow-hidden rounded-3xl border transition-all duration-700 bg-white"
                  style={{
                    borderColor: hoveredCard === 'animateur' ? `${formatColor}60` : 'rgb(229, 231, 235)',
                    transform: hoveredCard === 'animateur' ? 'scale(1.01)' : 'scale(1)',
                    boxShadow: hoveredCard === 'animateur' ? `0 20px 60px ${formatColor}15` : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                      {/* Avatar */}
                      <div className="relative group-hover:scale-105 transition-transform duration-700">
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                          <img
                            src={animateur.avatar}
                            alt={animateur.nom}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Badge de rôle flottant */}
                        <div
                          className="absolute -bottom-2 -right-2 px-4 py-2 rounded-full border flex items-center gap-2 shadow-md"
                          style={{
                            backgroundColor: `${formatColor}15`,
                            borderColor: `${formatColor}40`
                          }}
                        >
                          <Sparkles className="w-4 h-4" style={{ color: formatColor }} />
                          <span className="text-sm font-bold" style={{ color: formatColor }}>
                            {animateur.role}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center lg:text-left">
                        <h3 className="font-montserrat font-black text-3xl lg:text-4xl text-gray-900 mb-4">
                          {animateur.nom}
                        </h3>

                        <p className="font-inter text-lg text-gray-600 leading-relaxed mb-6 max-w-2xl">
                          {animateur.bio}
                        </p>

                        {/* Stats */}
                        {animateur.stats && (
                          <div className="flex flex-wrap items-center gap-6 mb-8">
                            {animateur.stats.episodesAnimes && (
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                                  style={{
                                    backgroundColor: `${formatColor}15`,
                                    border: `1px solid ${formatColor}30`
                                  }}
                                >
                                  <Film className="w-5 h-5" style={{ color: formatColor }} />
                                </div>
                                <div>
                                  <div className="font-montserrat font-bold text-xl text-gray-900">
                                    {animateur.stats.episodesAnimes}
                                  </div>
                                  <div className="text-gray-500 text-sm">Épisodes animés</div>
                                </div>
                              </div>
                            )}

                            {animateur.stats.anneeDebut && (
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                                  style={{
                                    backgroundColor: `${formatColor}15`,
                                    border: `1px solid ${formatColor}30`
                                  }}
                                >
                                  <Trophy className="w-5 h-5" style={{ color: formatColor }} />
                                </div>
                                <div>
                                  <div className="font-montserrat font-bold text-xl text-gray-900">
                                    {new Date().getFullYear() - animateur.stats.anneeDebut} ans
                                  </div>
                                  <div className="text-gray-500 text-sm">D'expérience</div>
                                </div>
                              </div>
                            )}

                            {animateur.stats.specialite && (
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                                  style={{
                                    backgroundColor: `${formatColor}15`,
                                    border: `1px solid ${formatColor}30`
                                  }}
                                >
                                  <Target className="w-5 h-5" style={{ color: formatColor }} />
                                </div>
                                <div>
                                  <div className="font-montserrat font-bold text-xl text-gray-900">
                                    {animateur.stats.specialite}
                                  </div>
                                  <div className="text-gray-500 text-sm">Spécialité</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Social Links */}
                        {animateur.reseaux && (
                          <div className="flex items-center gap-3">
                            {Object.entries(animateur.reseaux).map(([platform, handle]) => {
                              const Icon = getSocialIcon(platform);
                              return (
                                <a
                                  key={platform}
                                  href={`https://${platform}.com/${handle}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/social relative w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 bg-gray-50 border-gray-200 hover:bg-gray-100"
                                >
                                  <Icon className="w-5 h-5 text-gray-500 group-hover/social:text-gray-700 transition-colors" />

                                  {/* Tooltip */}
                                  <div className="absolute bottom-full mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                                    {handle}
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Grid */}
              {teamMembers.length > 0 && (
                <div>
                  <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-8 text-center">
                    L'Équipe Créative
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member, index) => (
                      <div
                        key={member.nom}
                        className="group relative"
                        onMouseEnter={() => setHoveredCard(member.nom)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div
                          className="relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 bg-white"
                          style={{
                            borderColor: hoveredCard === member.nom ? `${formatColor}40` : 'rgb(229, 231, 235)',
                            transform: hoveredCard === member.nom ? 'translateY(-5px)' : 'translateY(0)',
                            boxShadow: hoveredCard === member.nom ? `0 20px 40px ${formatColor}10` : '0 1px 3px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            {member.avatar && (
                              <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
                                  <img
                                    src={member.avatar}
                                    alt={member.nom}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                                {index === 0 && (
                                  <div
                                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                                    style={{
                                      backgroundColor: formatColor,
                                      boxShadow: `0 0 20px ${formatColor}60`
                                    }}
                                  >
                                    <Star className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex-1">
                              <h4 className="font-montserrat font-bold text-lg text-gray-900 mb-1">
                                {member.nom}
                              </h4>
                              <p className="text-gray-500 text-sm mb-3">{member.role}</p>

                              {member.specialite && (
                                <div
                                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3"
                                  style={{
                                    backgroundColor: `${formatColor}10`,
                                    color: formatColor
                                  }}
                                >
                                  <Zap className="w-3 h-3" />
                                  {member.specialite}
                                </div>
                              )}

                              {member.episodesContribution && (
                                <div className="text-gray-400 text-xs">
                                  {member.episodesContribution} épisodes
                                </div>
                              )}

                              {/* Social Links */}
                              {member.reseaux && (
                                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                  {Object.entries(member.reseaux).map(([platform, handle]) => {
                                    const Icon = getSocialIcon(platform);
                                    return (
                                      <a
                                        key={platform}
                                        href={`https://${platform}.com/${handle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300"
                                      >
                                        <Icon className="w-4 h-4 text-gray-500" />
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Credits Tab */}
          {activeTab === 'credits' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(credits).map(([role, nom]) => {
                const Icon = getRoleIcon(role);

                return (
                  <div
                    key={role}
                    className="group relative"
                    onMouseEnter={() => setHoveredCard(role)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className="relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 bg-white"
                      style={{
                        borderColor: hoveredCard === role ? `${formatColor}40` : 'rgb(229, 231, 235)',
                        transform: hoveredCard === role ? 'translateY(-5px)' : 'translateY(0)',
                        boxShadow: hoveredCard === role ? `0 20px 40px ${formatColor}10` : '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500"
                        style={{
                          backgroundColor: `${formatColor}10`,
                          border: `1px solid ${formatColor}30`,
                          transform: hoveredCard === role ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)'
                        }}
                      >
                        <Icon className="w-8 h-8" style={{ color: formatColor }} />
                      </div>

                      {/* Role */}
                      <h4 className="font-inter font-medium text-gray-500 text-sm uppercase tracking-wider mb-2">
                        {role.replace(/_/g, ' ')}
                      </h4>

                      {/* Name */}
                      <p className="font-montserrat font-bold text-xl text-gray-900">
                        {nom}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Additional Credits */}
              <div className="md:col-span-2 lg:col-span-3">
                <div className="relative overflow-hidden rounded-2xl border p-8 text-center bg-white border-gray-200">
                  <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="font-inter text-gray-600 text-lg">
                    Un grand merci à toute l'équipe technique et créative qui rend ce format possible
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Awards Tab */}
          {activeTab === 'awards' && (
            <div className="space-y-8">
              {/* Awards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {awards.map((award, index) => (
                  <div
                    key={award}
                    className="group relative"
                    onMouseEnter={() => setHoveredCard(award)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className="relative overflow-hidden rounded-2xl border p-6 text-center transition-all duration-500 bg-white"
                      style={{
                        borderColor: hoveredCard === award ? 'rgba(234, 179, 8, 0.4)' : 'rgb(229, 231, 235)',
                        transform: hoveredCard === award ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
                        boxShadow: hoveredCard === award ? '0 20px 40px rgba(234, 179, 8, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {/* Trophy Icon */}
                      <div className="relative inline-block mb-4">
                        <Trophy
                          className="w-16 h-16 text-yellow-500 transition-all duration-500"
                          style={{
                            transform: hoveredCard === award ? 'rotate(15deg) scale(1.1)' : 'rotate(0) scale(1)',
                            filter: hoveredCard === award ? 'drop-shadow(0 0 20px rgba(234, 179, 8, 0.5))' : 'none'
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-xs font-bold text-white">1</span>
                          </div>
                        )}
                      </div>

                      {/* Award Name */}
                      <h4 className="font-montserrat font-bold text-lg text-gray-900 mb-2">
                        {award}
                      </h4>

                      {/* Year */}
                      <p className="text-gray-500 text-sm">
                        {award.includes('2024') ? '2024' : '2023'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Partners Section */}
              {partenaires && partenaires.length > 0 && (
                <div>
                  <h3 className="font-montserrat font-bold text-2xl text-gray-900 mb-6 text-center">
                    Partenaires & Sponsors
                  </h3>

                  <div className="flex flex-wrap items-center justify-center gap-8">
                    {partenaires.map((partenaire) => (
                      <div
                        key={partenaire.nom}
                        className="group relative"
                        onMouseEnter={() => setHoveredCard(partenaire.nom)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div
                          className="relative w-32 h-32 rounded-2xl border p-4 flex items-center justify-center transition-all duration-500 bg-white"
                          style={{
                            borderColor: hoveredCard === partenaire.nom ? 'rgb(209, 213, 219)' : 'rgb(229, 231, 235)',
                            transform: hoveredCard === partenaire.nom ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: hoveredCard === partenaire.nom ? '0 10px 30px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <img
                            src={partenaire.logo}
                            alt={partenaire.nom}
                            className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                            style={{
                              opacity: hoveredCard === partenaire.nom ? 1 : 0.7
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-600 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <p className="font-inter text-gray-600 text-lg mb-8">
            Envie de rejoindre l'aventure {formatName} ?
          </p>

          <a
            href="/contact"
            className="group inline-flex items-center gap-4 px-8 py-4 bg-white border border-gray-200 text-gray-700 font-inter font-medium tracking-wider uppercase text-sm transition-all duration-500 rounded-full hover:scale-105 hover:shadow-lg hover:border-gray-300"
          >
            <span>Nous contacter</span>
            <ChevronRight
              className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500"
              style={{ color: formatColor }}
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ActeEquipeCredits;
