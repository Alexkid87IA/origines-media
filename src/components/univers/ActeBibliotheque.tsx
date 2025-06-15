import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActeBibliothequeProps {
  universId: string;
  universName: string;
  universColor: string;
}

const ActeBibliotheque: React.FC<ActeBibliothequeProps> = ({ 
  universId, 
  universName, 
  universColor 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

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

  // ✅ FONCTION DE NAVIGATION CORRIGÉE
  const handleNavigateToBibliotheque = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔍 Navigation vers /bibliotheque depuis page univers...');
    navigate('/bibliotheque');
  };

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] py-20 px-8 lg:px-16 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(universColor)}' fill-opacity='0.1'%3E%3Cpath d='M40 40L20 20v40l20-20zm0 0l20 20V20L40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} 
        />
      </div>

      {/* Section Header */}
      <div className={`text-center mb-16 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <div className="inline-flex items-center gap-4 mb-6">
          <div 
            className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
          <span 
            className="font-inter text-sm tracking-[0.2em] uppercase"
            style={{ color: universColor }}
          >
            Acte 3
          </span>
          <div 
            className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
        </div>
        
        <h2 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-wider text-white mb-6 leading-[0.9]">
          La Bibliothèque
          <br />
          <span 
            className="gradient-text-animated"
            style={{
              background: `linear-gradient(-45deg, ${universColor}, #EC4899, #F59E0B, ${universColor})`,
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 3s ease infinite'
            }}
          >
            Complète
          </span>
        </h2>
        
        <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
          Explorez l'intégralité de nos productions dans l'univers {universName.toLowerCase()}
        </p>
      </div>

      {/* Bottom CTA - CORRIGÉ AVEC REACT ROUTER */}
      <div className={`text-center mt-20 transform transition-all duration-1000 delay-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <button
          onClick={handleNavigateToBibliotheque}
          className="group inline-flex items-center gap-4 px-8 py-4 border text-white font-inter font-medium tracking-widest uppercase text-sm transition-all duration-500 backdrop-blur-sm rounded-full hover:scale-105 cursor-pointer"
          style={{
            borderColor: `${universColor}40`,
            backgroundColor: `${universColor}10`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${universColor}60`;
            e.currentTarget.style.backgroundColor = `${universColor}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${universColor}40`;
            e.currentTarget.style.backgroundColor = `${universColor}10`;
          }}
        >
          <span>Explorer toute la bibliothèque</span>
          <ArrowRight 
            className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500"
            style={{ color: universColor }}
          />
        </button>
      </div>
    </section>
  );
};

export default ActeBibliotheque;