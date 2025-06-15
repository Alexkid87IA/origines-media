import React, { useState, useEffect, useRef } from 'react';

interface ActeManifesteProps {
  universId: string;
  universName: string;
  universColor: string;
}

const ActeManifeste: React.FC<ActeManifesteProps> = ({ 
  universId, 
  universName, 
  universColor 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Données complètes pour chaque univers
  const universData = {
    'psychologie': {
      nom: "Psychologie & Développement Personnel",
      promesseEditoriale: "Outiller et inspirer pour mieux se comprendre et grandir.",
      imageUrl: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg"
    },
    'societe': {
      nom: "Société & Culture",
      promesseEditoriale: "Explorer les changements sociaux, la diversité et les tabous.",
      imageUrl: "https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg"
    },
    'carriere': {
      nom: "Carrière & Récits de Travail",
      promesseEditoriale: "Mettre en lumière parcours pros, reconversions & équilibre vie-pro.",
      imageUrl: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg"
    },
    'voyage': {
      nom: "Voyage & Découverte",
      promesseEditoriale: "Partager des quêtes identitaires et expériences transformatrices.",
      imageUrl: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg"
    },
    'art-creativite': {
      nom: "Art & Créativité",
      promesseEditoriale: "Célébrer l'art comme levier de résilience et de changement.",
      imageUrl: "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg"
    },
    'spiritualite': {
      nom: "Spiritualité",
      promesseEditoriale: "Nourrir la recherche de sens et la connexion intérieure.",
      imageUrl: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg"
    },
    'sante': {
      nom: "Santé & Bien-être",
      promesseEditoriale: "Aborder bien-être physique, mental et émotionnel.",
      imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg"
    },
    'technologie': {
      nom: "Technologie",
      promesseEditoriale: "Questionner l'impact sociotechnique et valoriser l'innovation.",
      imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
    },
    'relations': {
      nom: "Famille & Relations",
      promesseEditoriale: "Décrypter dynamiques familiales et défis relationnels.",
      imageUrl: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg"
    },
    'environnement': {
      nom: "Environnement",
      promesseEditoriale: "Initiatives Positives, Consommation Consciente, Vivre Autrement.",
      imageUrl: "https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg"
    }
  };

  const currentUnivers = universData[universId as keyof typeof universData] || {
    nom: universName,
    promesseEditoriale: "Découvrez des récits authentiques et des univers narratifs profonds.",
    imageUrl: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg"
  };

  // Intersection Observer pour déclencher les animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Preload de l'image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = currentUnivers.imageUrl;
  }, [currentUnivers.imageUrl]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-[60vh] min-h-[500px] overflow-hidden flex items-center justify-center"
    >
      {/* Background Image avec Ken Burns Effect */}
      <div className="absolute inset-0">
        {imageLoaded ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentUnivers.imageUrl})`,
              animation: 'kenBurnsEnhanced 25s ease-in-out infinite alternate',
              transform: 'scale(1.1)',
              filter: 'brightness(0.7) contrast(1.2) saturate(1.3)'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
        )}
        
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Gradient overlay avec couleur thématique */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at center, ${universColor}20 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Contenu Principal - Centré */}
      <div className="relative z-10 text-center px-6 lg:px-12 max-w-5xl mx-auto">
        
        {/* Badge "Acte 1" */}
        <div className={`inline-flex items-center gap-4 mb-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div 
            className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
          <span 
            className="font-inter text-sm tracking-[0.2em] uppercase font-medium"
            style={{ color: universColor }}
          >
            Acte 1
          </span>
          <div 
            className="w-12 h-px bg-gradient-to-r from-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, transparent, ${universColor}, transparent)`
            }}
          />
        </div>

        {/* Titre Principal avec Animation Enhanced */}
        <h1 
          className={`font-montserrat font-black uppercase tracking-wider text-white mb-8 leading-[0.85] transform transition-all duration-1500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            textShadow: '0 8px 40px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.8)',
            animation: isVisible ? 'titleRevealEnhanced 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
            animationDelay: '0.3s'
          }}
        >
          {/* Diviser le titre en mots pour l'animation */}
          {currentUnivers.nom.split(' ').map((word, index) => (
            <span
              key={index}
              className="inline-block mr-3 lg:mr-4"
              style={{
                animation: isVisible ? `wordSlideInEnhanced 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards` : 'none',
                animationDelay: `${0.5 + (index * 0.1)}s`,
                opacity: 0,
                transform: 'translateY(60px) rotateX(90deg)'
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Ligne décorative avec couleur thématique */}
        <div 
          className={`mx-auto mb-8 h-1 rounded-full transform transition-all duration-1200 ${
            isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
          }`}
          style={{
            width: 'clamp(80px, 12vw, 150px)',
            background: `linear-gradient(90deg, ${universColor}, ${universColor}80)`,
            boxShadow: `0 0 20px ${universColor}60`,
            animationDelay: '1s'
          }}
        />

        {/* Promesse Éditoriale */}
        <p 
          className={`font-inter text-white/90 leading-relaxed max-w-3xl mx-auto transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
          style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            animationDelay: '1.2s'
          }}
        >
          {currentUnivers.promesseEditoriale}
        </p>

        {/* Indicateur de scroll subtil */}
        <div 
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-60' : 'translate-y-10 opacity-0'
          }`}
          style={{ animationDelay: '1.5s' }}
        >
          <div className="flex flex-col items-center gap-2">
            <div 
              className="w-px h-12 bg-gradient-to-b from-transparent via-white to-transparent"
              style={{
                background: `linear-gradient(to bottom, transparent, ${universColor}, transparent)`
              }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: universColor }}
            />
          </div>
        </div>
      </div>

      {/* Film Grain Texture Overlay */}
      <div 
        className="absolute inset-0 film-grain-texture opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px'
        }}
      />
    </section>
  );
};

export default ActeManifeste;