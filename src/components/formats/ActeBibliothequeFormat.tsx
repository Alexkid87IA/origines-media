import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface ActeBibliothequeFormatProps {
  formatId: string;
  formatName: string;
  formatColor: string;
}

const ActeBibliothequeFormat: React.FC<ActeBibliothequeFormatProps> = ({
  formatId,
  formatName,
  formatColor
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
      className="py-20 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Section Header */}
        <div className={`mb-16 transform transition-all duration-1000 ${
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
              Acte 3
            </span>
            <div 
              className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
              style={{
                background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
              }}
            />
          </div>
          
          <h2 className="font-montserrat font-black text-3xl lg:text-4xl text-white mb-6">
            Bibliothèque
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
              Complète
            </span>
          </h2>
          
          <p className="font-inter text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
            Explorez tous les épisodes de {formatName}
          </p>

          {/* CTA */}
          <a
            href="/series"
            className="group inline-flex items-center gap-4 px-8 py-4 border text-white font-inter font-medium tracking-widest uppercase text-sm transition-all duration-500 backdrop-blur-sm rounded-full hover:scale-105"
            style={{
              borderColor: `${formatColor}40`,
              backgroundColor: `${formatColor}10`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${formatColor}60`;
              e.currentTarget.style.backgroundColor = `${formatColor}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${formatColor}40`;
              e.currentTarget.style.backgroundColor = `${formatColor}10`;
            }}
          >
            <span>Voir tous les épisodes</span>
            <ArrowRight 
              className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500"
              style={{ color: formatColor }}
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ActeBibliothequeFormat;