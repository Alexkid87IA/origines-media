import React, { useState, useEffect, useRef } from 'react';
import { User, Award, Film, Music, Palette, Edit3, Camera, Headphones, Twitter, Instagram, Linkedin, Globe, Mail, Star, TrendingUp, Users, Heart, MessageCircle, Share2, ChevronRight, Sparkles, Zap, Trophy, Target, Coffee, Layers } from 'lucide-react';

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
      avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg',
      specialite: 'Visual Storytelling',
      episodesContribution: 45,
      reseaux: { twitter: '@emmachen', instagram: '@emma.chen' }
    },
    {
      nom: 'Lucas Bernard',
      role: 'Sound Designer',
      avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
      specialite: 'Audio Immersif',
      episodesContribution: 38,
      reseaux: { linkedin: 'lucas-bernard' }
    }
  ],
  awards = ['Emmy Digital 2024', 'Prix Innovation Media', 'Best Format Award'],
  partenaires = [
    { nom: 'Netflix', logo: 'https://images.pexels.com/photos/2148216/pexels-photo-2148216.jpeg' },
    { nom: 'Arte', logo: 'https://images.pexels.com/photos/2148217/pexels-photo-2148217.jpeg' }
  ]
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'team' | 'credits' | 'awards'>('team');
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Intersection Observer
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

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 2,
        y: (clientY / innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getRoleIcon = (role: string) => {
    const roleMap: { [key: string]: any } = {
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
      className="relative py-24 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0F0F0F 0%, #0A0A0A 50%, #0F0F0F 100%)`
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at ${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%, ${formatColor}20 0%, transparent 50%)`,
            transition: 'all 0.3s ease'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: formatColor,
                opacity: 0.3 + Math.random() * 0.3,
                filter: `blur(${Math.random() * 2}px)`
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-px bg-gradient-to-r from-transparent to-transparent"
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
              className="w-16 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
          </div>
          
          <h2 className="font-montserrat font-black text-4xl lg:text-5xl text-white mb-6">
            L'Équipe &
            <br />
            <span 
              className="gradient-text-animated inline-block"
              style={{
                background: `linear-gradient(-45deg, ${formatColor}, #EC4899, #F59E0B, ${formatColor})`,
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 3s ease infinite'
              }}
            >
              Crédits
            </span>
          </h2>
          
          <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Les talents créatifs derrière {formatName}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className={`flex justify-center mb-12 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center bg-black/40 backdrop-blur-sm border border-white/20 rounded-full p-1">
            {[
              { id: 'team', label: 'Équipe', icon: Users },
              { id: 'credits', label: 'Crédits', icon: Film },
              { id: 'awards', label: 'Récompenses', icon: Trophy }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'text-white shadow-lg' 
                      : 'text-white/60 hover:text-white'
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? formatColor : 'transparent'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
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
                  className="relative overflow-hidden rounded-3xl backdrop-blur-md border transition-all duration-700"
                  style={{
                    backgroundColor: hoveredCard === 'animateur' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    borderColor: hoveredCard === 'animateur' ? `${formatColor}60` : 'rgba(255,255,255,0.1)',
                    transform: hoveredCard === 'animateur' ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: hoveredCard === 'animateur' ? `0 20px 60px ${formatColor}30` : 'none'
                  }}
                >
                  <div className="p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
                      {/* Avatar avec effet 3D */}
                      <div className="relative group-hover:scale-105 transition-transform duration-700">
                        <div 
                          className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden relative"
                          style={{
                            transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`,
                            transition: 'transform 0.3s ease'
                          }}
                        >
                          <img
                            src={animateur.avatar}
                            alt={animateur.nom}
                            className="w-full h-full object-cover"
                          />
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `radial-gradient(circle at 30% 30%, transparent 30%, ${formatColor}20 100%)`,
                              mixBlendMode: 'overlay'
                            }}
                          />
                        </div>
                        
                        {/* Badge de rôle flottant */}
                        <div 
                          className="absolute -bottom-2 -right-2 px-4 py-2 rounded-full backdrop-blur-md border flex items-center gap-2 animate-pulse-subtle"
                          style={{
                            backgroundColor: `${formatColor}20`,
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
                        <h3 className="font-montserrat font-black text-3xl lg:text-4xl text-white mb-4">
                          {animateur.nom}
                        </h3>
                        
                        <p className="font-inter text-lg text-white/80 leading-relaxed mb-6 max-w-2xl">
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
                                    backgroundColor: `${formatColor}20`,
                                    border: `1px solid ${formatColor}40`
                                  }}
                                >
                                  <Film className="w-5 h-5" style={{ color: formatColor }} />
                                </div>
                                <div>
                                  <div className="font-montserrat font-bold text-xl text-white">
                                    {animateur.stats.episodesAnimes}
                                  </div>
                                  <div className="text-white/60 text-sm">Épisodes animés</div>
                                </div>
                              </div>
                            )}
                            
                            {animateur.stats.anneeDebut && (
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                                  style={{
                                    backgroundColor: `${formatColor}20`,
                                    border: `1px solid ${formatColor}40`
                                  }}
                                >
                                  <Trophy className="w-5 h-5" style={{ color: formatColor }} />
                                </div>
                                <div>
                                  <div className="font-montserrat font-bold text-xl text-white">
                                    {new Date().getFullYear() - animateur.stats.anneeDebut} ans
                                  </div>
                                  <div className="text-white/60 text-sm">D'expérience</div>
                                </div>
                              </div>
                            )}
                            
                            {animateur.stats.specialite && (
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                                  style={{
                                    backgroundColor: `${formatColor}20`,
                                    border: `1px solid ${formatColor}40`
                                  }}
                                >
                                  <Target className="w-5 h-5" style={{ color: formatColor }} />
                                </div>
                                <div>
                                  <div className="font-montserrat font-bold text-xl text-white">
                                    {animateur.stats.specialite}
                                  </div>
                                  <div className="text-white/60 text-sm">Spécialité</div>
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
                                  className="group/social relative w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 hover:scale-110"
                                  style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    borderColor: 'rgba(255,255,255,0.2)'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = `${formatColor}30`;
                                    e.currentTarget.style.borderColor = formatColor;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                  }}
                                >
                                  <Icon className="w-5 h-5 text-white/70 group-hover/social:text-white transition-colors" />
                                  
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full mb-2 px-3 py-1 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
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

                  {/* Animated Border Gradient */}
                  <div 
                    className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `linear-gradient(45deg, transparent 30%, ${formatColor}40 50%, transparent 70%)`,
                      backgroundSize: '200% 200%',
                      animation: 'gradientMove 3s ease infinite'
                    }}
                  />
                </div>
              </div>

              {/* Team Members Grid */}
              {teamMembers.length > 0 && (
                <div>
                  <h3 className="font-montserrat font-bold text-2xl text-white mb-8 text-center">
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
                          className="relative overflow-hidden rounded-2xl backdrop-blur-md border p-6 transition-all duration-500"
                          style={{
                            backgroundColor: hoveredCard === member.nom ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                            borderColor: hoveredCard === member.nom ? `${formatColor}40` : 'rgba(255,255,255,0.1)',
                            transform: hoveredCard === member.nom ? 'translateY(-5px)' : 'translateY(0)',
                            boxShadow: hoveredCard === member.nom ? `0 20px 40px ${formatColor}20` : 'none'
                          }}
                        >
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            {member.avatar && (
                              <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 rounded-full overflow-hidden">
                                  <img
                                    src={member.avatar}
                                    alt={member.nom}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                                {index === 0 && (
                                  <div 
                                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center animate-pulse"
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
                              <h4 className="font-montserrat font-bold text-lg text-white mb-1">
                                {member.nom}
                              </h4>
                              <p className="text-white/60 text-sm mb-3">{member.role}</p>
                              
                              {member.specialite && (
                                <div 
                                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3"
                                  style={{
                                    backgroundColor: `${formatColor}20`,
                                    color: formatColor
                                  }}
                                >
                                  <Zap className="w-3 h-3" />
                                  {member.specialite}
                                </div>
                              )}
                              
                              {member.episodesContribution && (
                                <div className="text-white/50 text-xs">
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
                                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                                      >
                                        <Icon className="w-4 h-4 text-white/70" />
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Hover Effect */}
                          <div 
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                              background: `radial-gradient(circle at 50% 0%, ${formatColor}20 0%, transparent 70%)`
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
                      className="relative overflow-hidden rounded-2xl backdrop-blur-md border p-6 transition-all duration-500"
                      style={{
                        backgroundColor: hoveredCard === role ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                        borderColor: hoveredCard === role ? `${formatColor}40` : 'rgba(255,255,255,0.1)',
                        transform: hoveredCard === role ? 'translateY(-5px) rotateX(-2deg)' : 'translateY(0) rotateX(0)',
                        transformStyle: 'preserve-3d',
                        boxShadow: hoveredCard === role ? `0 20px 40px ${formatColor}20` : 'none'
                      }}
                    >
                      {/* Icon */}
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500"
                        style={{
                          backgroundColor: `${formatColor}20`,
                          border: `1px solid ${formatColor}40`,
                          transform: hoveredCard === role ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)'
                        }}
                      >
                        <Icon className="w-8 h-8" style={{ color: formatColor }} />
                      </div>

                      {/* Role */}
                      <h4 className="font-inter font-medium text-white/60 text-sm uppercase tracking-wider mb-2">
                        {role.replace(/_/g, ' ')}
                      </h4>

                      {/* Name */}
                      <p className="font-montserrat font-bold text-xl text-white">
                        {nom}
                      </p>

                      {/* Decorative Element */}
                      <div 
                        className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-10 transition-all duration-700"
                        style={{
                          backgroundColor: formatColor,
                          filter: 'blur(20px)',
                          transform: hoveredCard === role ? 'scale(1.5)' : 'scale(1)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              
              {/* Additional Credits */}
              <div className="md:col-span-2 lg:col-span-3">
                <div 
                  className="relative overflow-hidden rounded-2xl backdrop-blur-md border p-8 text-center"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderColor: 'rgba(255,255,255,0.1)'
                  }}
                >
                  <Coffee className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="font-inter text-white/60 text-lg">
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
                      className="relative overflow-hidden rounded-2xl backdrop-blur-md border p-6 text-center transition-all duration-500"
                      style={{
                        backgroundColor: hoveredCard === award ? 'rgba(255,236,64,0.1)' : 'rgba(255,255,255,0.02)',
                        borderColor: hoveredCard === award ? 'rgba(255,236,64,0.4)' : 'rgba(255,255,255,0.1)',
                        transform: hoveredCard === award ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
                        boxShadow: hoveredCard === award ? '0 20px 40px rgba(255,236,64,0.2)' : 'none'
                      }}
                    >
                      {/* Trophy Icon */}
                      <div className="relative inline-block mb-4">
                        <Trophy 
                          className="w-16 h-16 text-yellow-400 transition-all duration-500"
                          style={{
                            transform: hoveredCard === award ? 'rotate(15deg) scale(1.1)' : 'rotate(0) scale(1)',
                            filter: hoveredCard === award ? 'drop-shadow(0 0 20px rgba(255,236,64,0.5))' : 'none'
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-xs font-bold text-white">1</span>
                          </div>
                        )}
                      </div>

                      {/* Award Name */}
                      <h4 className="font-montserrat font-bold text-lg text-white mb-2">
                        {award}
                      </h4>

                      {/* Year */}
                      <p className="text-white/60 text-sm">
                        {award.includes('2024') ? '2024' : '2023'}
                      </p>

                      {/* Glow Effect */}
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(255,236,64,0.2) 0%, transparent 70%)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Partners Section */}
              {partenaires && partenaires.length > 0 && (
                <div>
                  <h3 className="font-montserrat font-bold text-2xl text-white mb-6 text-center">
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
                          className="relative w-32 h-32 rounded-2xl backdrop-blur-md border p-4 flex items-center justify-center transition-all duration-500"
                          style={{
                            backgroundColor: hoveredCard === partenaire.nom ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                            borderColor: hoveredCard === partenaire.nom ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                            transform: hoveredCard === partenaire.nom ? 'scale(1.1)' : 'scale(1)'
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
          <p className="font-inter text-white/60 text-lg mb-8">
            Envie de rejoindre l'aventure {formatName} ?
          </p>
          
          <a
            href="/contact"
            className="group inline-flex items-center gap-4 px-8 py-4 border text-white font-inter font-medium tracking-wider uppercase text-sm transition-all duration-500 backdrop-blur-sm rounded-full hover:scale-105"
            style={{
              borderColor: `${formatColor}40`,
              backgroundColor: `${formatColor}10`,
              boxShadow: `0 0 40px ${formatColor}20`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${formatColor}60`;
              e.currentTarget.style.backgroundColor = `${formatColor}20`;
              e.currentTarget.style.boxShadow = `0 0 60px ${formatColor}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${formatColor}40`;
              e.currentTarget.style.backgroundColor = `${formatColor}10`;
              e.currentTarget.style.boxShadow = `0 0 40px ${formatColor}20`;
            }}
          >
            <span>Nous contacter</span>
            <ChevronRight 
              className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500"
              style={{ color: formatColor }}
            />
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-30px) translateX(10px); }
          66% { transform: translateY(20px) translateX(-10px); }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }

        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
};

export default ActeEquipeCredits;