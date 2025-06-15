import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';

interface Animateur {
  nom: string;
  bio: string;
  avatar: string;
  role: string;
}

interface Credits {
  producteur?: string;
  realisateur?: string;
  montage?: string;
  musique?: string;
}

interface ActeEquipeCreditsProps {
  formatId: string;
  formatName: string;
  formatColor: string;
  animateur: Animateur;
  credits: Credits;
}

const ActeEquipeCredits: React.FC<ActeEquipeCreditsProps> = ({
  formatId,
  formatName,
  formatColor,
  animateur,
  credits
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-8 lg:px-16 bg-[#0F0F0F] border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="inline-flex items-center gap-4 mb-6">
            <div 
              className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
            <span 
              className="font-inter text-sm tracking-[0.2em] uppercase"
              style={{ color: formatColor }}
            >
              Acte 4
            </span>
            <div 
              className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
          </div>
          
          <h2 className="font-montserrat font-black text-3xl lg:text-4xl text-white mb-6">
            L'Équipe &
            <br />
            <span 
              className="gradient-text-animated"
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
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          
          {/* Animateur Principal */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-start gap-6">
              <div 
                className="w-20 h-20 rounded-full bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url(${animateur.avatar})` }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-montserrat font-bold text-xl text-white">
                    {animateur.nom}
                  </h3>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
                    style={{
                      backgroundColor: `${formatColor}20`,
                      color: formatColor
                    }}
                  >
                    {animateur.role}
                  </span>
                </div>
                <p className="font-inter text-white/80 leading-relaxed">
                  {animateur.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Crédits de Production */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="font-montserrat font-bold text-xl text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5" style={{ color: formatColor }} />
              Crédits de Production
            </h3>
            
            <div className="space-y-4">
              {Object.entries(credits).map(([role, nom]) => (
                <div key={role} className="flex justify-between items-center">
                  <span className="font-inter text-white/60 text-sm capitalize">
                    {role.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                  </span>
                  <span className="font-inter text-white font-medium">{nom}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActeEquipeCredits;