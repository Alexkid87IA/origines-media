import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Users, Heart, Target, Award, Globe, Lightbulb } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import EngagementSection from '../components/EngagementSection';

const AboutPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animations
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

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Marie Dubois",
      role: "Fondatrice & Directrice Éditoriale",
      description: "Ancienne journaliste, Marie a créé Origines pour donner une voix aux récits authentiques qui transforment.",
      imageUrl: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg"
    },
    {
      id: 2,
      name: "Thomas Martin",
      role: "Directeur Créatif",
      description: "Réalisateur et storyteller, Thomas orchestre la dimension visuelle et narrative de nos productions.",
      imageUrl: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg"
    },
    {
      id: 3,
      name: "Sophie Chen",
      role: "Responsable Communauté",
      description: "Psychologue de formation, Sophie cultive les liens avec notre communauté et anime nos échanges.",
      imageUrl: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg"
    }
  ];

  // Values data
  const values = [
    {
      icon: Heart,
      title: "Authenticité",
      description: "Nous privilégions les récits vrais, sans filtre, qui touchent au cœur de l'expérience humaine."
    },
    {
      icon: Target,
      title: "Profondeur",
      description: "Nous creusons au-delà de la surface pour révéler les nuances et la complexité de chaque histoire."
    },
    {
      icon: Globe,
      title: "Diversité",
      description: "Nous célébrons la richesse des perspectives et des expériences de toutes les communautés."
    },
    {
      icon: Lightbulb,
      title: "Inspiration",
      description: "Nous croyons au pouvoir transformateur des récits pour éclairer et guider nos vies."
    }
  ];

  // Preload images
  useEffect(() => {
    teamMembers.forEach((member) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, member.id.toString()]));
      };
      img.src = member.imageUrl;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen md:ml-[280px]">
        
        {/* Hero Section */}
        <section 
          ref={sectionRef}
          className="relative bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 px-8 lg:px-16 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5CF6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Header Content */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <span className="font-inter text-violet-400 text-sm tracking-[0.2em] uppercase">
                Notre Histoire
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            </div>
            
            <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
              À Propos
              <br />
              <span className="gradient-text-animated">d'Origines</span>
            </h1>
            
            <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Découvrez l'histoire, la mission et les valeurs qui animent notre média
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-8 lg:px-16 bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Text Content */}
              <div className={`transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}>
                <h2 className="font-montserrat font-black text-3xl lg:text-4xl text-white mb-8 leading-tight">
                  Notre <span className="text-violet-400">Mission</span>
                </h2>
                
                <div className="space-y-6 text-white/80 font-inter text-lg leading-relaxed">
                  <p>
                    <strong className="text-white">Origines Media</strong> est né d'une conviction profonde : 
                    les récits authentiques ont le pouvoir de transformer nos vies et notre société.
                  </p>
                  
                  <p>
                    Dans un monde saturé d'informations superficielles, nous créons un espace dédié 
                    aux histoires qui comptent vraiment. Celles qui révèlent la profondeur de l'expérience 
                    humaine et inspirent un changement positif.
                  </p>
                  
                  <p>
                    Notre approche éditoriale privilégie la qualité sur la quantité, l'authenticité 
                    sur le sensationnel, et la réflexion sur la réaction immédiate.
                  </p>
                </div>

                <div className="mt-8">
                  <a
                    href="/contact"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-inter font-bold tracking-widest uppercase text-sm rounded-xl transition-all duration-500 hover:from-violet-500 hover:to-fuchsia-500 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/25"
                  >
                    <span>Nous Contacter</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>

              {/* Visual Element */}
              <div className={`transform transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}>
                <div className="relative">
                  <div className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="font-montserrat font-black text-4xl text-violet-400 mb-2">2021</div>
                        <div className="font-inter text-white/70 text-sm uppercase tracking-wider">Création</div>
                      </div>
                      <div className="text-center">
                        <div className="font-montserrat font-black text-4xl text-fuchsia-400 mb-2">847</div>
                        <div className="font-inter text-white/70 text-sm uppercase tracking-wider">Récits</div>
                      </div>
                      <div className="text-center">
                        <div className="font-montserrat font-black text-4xl text-emerald-400 mb-2">2.1M</div>
                        <div className="font-inter text-white/70 text-sm uppercase tracking-wider">Lecteurs</div>
                      </div>
                      <div className="text-center">
                        <div className="font-montserrat font-black text-4xl text-amber-400 mb-2">10</div>
                        <div className="font-inter text-white/70 text-sm uppercase tracking-wider">Univers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="font-montserrat font-black text-3xl lg:text-4xl text-white mb-6">
                Nos <span className="text-violet-400">Valeurs</span>
              </h2>
              <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                Les principes qui guident notre travail éditorial et notre vision du média
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={index}
                    className={`
                      group relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 
                      hover:bg-black/60 hover:border-white/20 transition-all duration-500 hover:scale-105
                      transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                    `}
                    style={{
                      transitionDelay: `${index * 150}ms`,
                    }}
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-violet-400" />
                    </div>

                    {/* Content */}
                    <h3 className="font-montserrat font-bold text-xl text-white mb-4">
                      {value.title}
                    </h3>
                    <p className="font-inter text-white/70 leading-relaxed">
                      {value.description}
                    </p>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-8 lg:px-16 bg-gradient-to-br from-[#0F0F0F] to-[#0A0A0A]">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="font-montserrat font-black text-3xl lg:text-4xl text-white mb-6">
                Notre <span className="text-violet-400">Équipe</span>
              </h2>
              <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                Les personnes passionnées qui donnent vie à Origines Media
              </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`
                    group relative overflow-hidden rounded-3xl cursor-pointer
                    h-[500px] transform transition-all duration-700 hover:scale-[1.02]
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                  `}
                  style={{
                    transitionDelay: `${index * 200}ms`,
                  }}
                >
                  {/* Image Background */}
                  <div className="absolute inset-0">
                    {loadedImages.has(member.id.toString()) ? (
                      <div
                        className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${member.imageUrl})`,
                          filter: 'brightness(0.6) contrast(1.1) saturate(1.1)'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
                    )}
                    
                    {/* Strategic Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                    <h3 className="font-montserrat font-bold text-2xl text-white mb-2 leading-tight">
                      {member.name}
                    </h3>
                    
                    <div className="text-violet-400 font-inter font-medium text-sm uppercase tracking-wider mb-4">
                      {member.role}
                    </div>
                    
                    <p className="font-inter text-white/80 text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-violet-500/20 group-hover:ring-1 group-hover:ring-violet-500/30" />
                </div>
              ))}
            </div>

            {/* Team CTA */}
            <div className="text-center mt-16">
              <a
                href="/equipe"
                className="group inline-flex items-center gap-4 px-8 py-4 border border-white/20 text-white font-inter font-medium tracking-widest uppercase text-sm hover:border-white/40 hover:bg-white/5 transition-all duration-500 backdrop-blur-sm rounded-full"
              >
                <Users className="w-5 h-5" />
                <span>Découvrir toute l'équipe</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
              </a>
            </div>
          </div>
        </section>

        {/* Engagement Section */}
        <EngagementSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;