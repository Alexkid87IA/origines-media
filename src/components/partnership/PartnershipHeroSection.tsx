import React, { useState, useEffect, useRef } from 'react';

interface PartnershipHeroSectionProps {
  onGoLive?: () => void;
}

const PartnershipHeroSection: React.FC<PartnershipHeroSectionProps> = ({ onGoLive }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Nouveau texte de la lettre
  const letterParagraphs = [
    "À la croisée d'un comptoir de quartier et d'un studio de télévision, nous allons faire naître un lieu – et un média – où chaque café se convertit en acte de solidarité et chaque histoire enflamme les réseaux.",
    
    "Wanted devient la scène. Origines Media devient l'écho. Ensemble, nous transformons l'entraide en spectacle vivant :",
    
    "Le Café n'est plus seulement un refuge pour les estomacs vides : c'est le cœur battant d'une narration en temps réel. Des micros branchés en continu, un compteur lumineux qui grimpe à chaque don, des écrans qui diffusent la gratitude en direct. Ici, le public ne se contente pas d'applaudir ; il nourrit, il relaie, il rallume l'étincelle suivante.",
    
    "Pendant ce temps, Origines Media capte la matière brute – ces éclats d'humanité, ces scènes improvisées – et les propulse partout : TikTok, Reels, YouTube, podcasts. Les formats longs révèlent la profondeur, les formats courts déclenchent l'impulsion. Nous recyclons chaque seconde vécue pour qu'elle revienne, démultipliée, gonfler la vague de générosité."
  ];

  const promises = [
    "Un live, un repas.",
    "Un témoignage, un électrochoc.",
    "Un like, une graine de changement."
  ];

  const circleSteps = [
    "Le Café nourrit les gens.",
    "Les Lives nourrissent les histoires.",
    "Les Histoires nourrissent la communauté."
  ];

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

  // Animation sequence
  useEffect(() => {
    if (isVisible) {
      // Phase 1: Logos appear
      setTimeout(() => setAnimationPhase(1), 500);
      // Phase 2: DNA strands emit
      setTimeout(() => setAnimationPhase(2), 1500);
      // Phase 3: Helix forms
      setTimeout(() => setAnimationPhase(3), 2500);
      // Phase 4: Text appears
      setTimeout(() => setTextVisible(true), 3500);
    }
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A] overflow-hidden"
    >
      {/* Background subtil */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/5 via-transparent to-orange-900/5" />
      </div>

      {/* Animation des logos avec Fusion Magnétique */}
      <div className="relative z-10 min-h-[50vh] lg:min-h-[60vh] flex items-center justify-center">
        <div className="relative w-full max-w-6xl mx-auto px-8">
          {/* Container pour l'animation */}
          <div className="relative h-[250px] lg:h-[350px]">
            
            {/* Logo Origines - Position initiale à gauche */}
            <div className={`absolute left-0 lg:left-10 top-1/2 -translate-y-1/2 transition-all ${
              animationPhase >= 2 
                ? 'duration-[2000ms] ease-in-out' 
                : 'duration-1000'
            } ${
              animationPhase >= 3
                ? 'left-1/2 -translate-x-[150px] scale-75 opacity-80'
                : animationPhase >= 2 
                  ? 'left-1/2 -translate-x-[60px]' 
                  : animationPhase >= 1
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-50'
            }`}>
              <div className="relative">
                {/* Effet magnétique */}
                <div className={`absolute inset-0 -m-8 transition-all duration-1000 ${
                  animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="w-full h-full rounded-full bg-violet-500/20 blur-xl animate-pulse" />
                </div>
                <img
                  src="https://res.cloudinary.com/diqco2njt/image/upload/v1751568726/LOGO_ORIGINES_WHITE_pzbo2m.png"
                  alt="Origines Media"
                  className={`h-20 lg:h-24 w-auto relative z-10 transition-transform duration-1000 ${
                    animationPhase >= 2 ? 'scale-110' : 'scale-100'
                  }`}
                />
              </div>
            </div>

            {/* Logo Wanted - Position initiale à droite */}
            <div className={`absolute right-0 lg:right-10 top-1/2 -translate-y-1/2 transition-all ${
              animationPhase >= 2 
                ? 'duration-[2000ms] ease-in-out' 
                : 'duration-1000'
            } ${
              animationPhase >= 3
                ? 'right-1/2 translate-x-[150px] scale-75 opacity-80'
                : animationPhase >= 2 
                  ? 'right-1/2 translate-x-[60px]' 
                  : animationPhase >= 1
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-50'
            }`}>
              <div className="relative">
                {/* Effet magnétique */}
                <div className={`absolute inset-0 -m-8 transition-all duration-1000 ${
                  animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="w-full h-full rounded-full bg-orange-500/20 blur-xl animate-pulse" />
                </div>
                <img
                  src="https://wanted.community/wp-content/uploads/2019/12/logo-wanted-community-.png"
                  alt="Wanted Community"
                  className={`h-16 lg:h-20 w-auto relative z-10 transition-transform duration-1000 ${
                    animationPhase >= 2 ? 'scale-110' : 'scale-100'
                  }`}
                />
              </div>
            </div>

            {/* Lignes de force magnétiques pendant l'attraction */}
            {animationPhase >= 2 && animationPhase < 3 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-32 opacity-30">
                  {[...Array(5)].map((_, i) => (
                    <line
                      key={`force-${i}`}
                      x1="20%"
                      y1="50%"
                      x2="80%"
                      y2="50%"
                      stroke="url(#forceGradient)"
                      strokeWidth="1"
                      strokeDasharray="5 5"
                      className="animate-dash"
                      style={{
                        transform: `translateY(${(i - 2) * 8}px)`
                      }}
                    />
                  ))}
                  <defs>
                    <linearGradient id="forceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}

            {/* Explosion et symbole infini au centre */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {animationPhase >= 3 && (
                <>
                  {/* Explosion de particules */}
                  <div className="absolute inset-0">
                    {[...Array(40)].map((_, i) => {
                      const angle = (i * 9) * Math.PI / 180;
                      const distance = 80 + Math.random() * 120;
                      const x = Math.cos(angle) * distance;
                      const y = Math.sin(angle) * distance;
                      const isViolet = i % 2 === 0;
                      const size = Math.random() * 6 + 2;
                      
                      return (
                        <div
                          key={`explosion-${i}`}
                          className="absolute rounded-full"
                          style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: '50%',
                            top: '50%',
                            backgroundColor: isViolet ? '#8B5CF6' : '#F97316',
                            boxShadow: `0 0 ${size * 3}px ${isViolet ? '#8B5CF6' : '#F97316'}`,
                            animation: `explode 2s ease-out forwards`,
                            animationDelay: `${Math.random() * 0.3}s`,
                            '--x': `${x}px`,
                            '--y': `${y}px`
                          } as React.CSSProperties}
                        />
                      );
                    })}
                  </div>

                  {/* Symbole de l'infini */}
                  <div className="relative z-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <svg 
                      className="w-[200px] h-[100px] lg:w-[280px] lg:h-[140px]"
                      viewBox="0 0 280 140"
                      style={{
                        filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.5))'
                      }}
                    >
                      {/* Infini principal */}
                      <path
                        d="M 70 70 C 70 40, 40 40, 40 70 C 40 100, 70 100, 70 70 L 210 70 C 210 100, 240 100, 240 70 C 240 40, 210 40, 210 70"
                        fill="none"
                        stroke="url(#infinityGradient)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="animate-draw-infinity"
                        style={{
                          strokeDasharray: 800,
                          strokeDashoffset: 800
                        }}
                      />
                      
                      {/* Points lumineux qui parcourent l'infini */}
                      <circle r="4" fill="#8B5CF6" filter="url(#glow)">
                        <animateMotion dur="4s" repeatCount="indefinite">
                          <mpath href="#infinityPath" />
                        </animateMotion>
                      </circle>
                      
                      <circle r="4" fill="#F97316" filter="url(#glow)">
                        <animateMotion dur="4s" repeatCount="indefinite" begin="2s">
                          <mpath href="#infinityPath" />
                        </animateMotion>
                      </circle>

                      {/* Path invisible pour l'animation */}
                      <path
                        id="infinityPath"
                        d="M 70 70 C 70 40, 40 40, 40 70 C 40 100, 70 100, 70 70 L 210 70 C 210 100, 240 100, 240 70 C 240 40, 210 40, 210 70"
                        fill="none"
                        stroke="none"
                      />

                      {/* Définitions */}
                      <defs>
                        <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6">
                            <animate attributeName="stop-color" values="#8B5CF6;#F97316;#8B5CF6" dur="4s" repeatCount="indefinite" />
                          </stop>
                          <stop offset="50%" stopColor="#EC4899" />
                          <stop offset="100%" stopColor="#F97316">
                            <animate attributeName="stop-color" values="#F97316;#8B5CF6;#F97316" dur="4s" repeatCount="indefinite" />
                          </stop>
                        </linearGradient>
                        
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                    </svg>

                    {/* Effet de pulsation derrière l'infini */}
                    <div className="absolute inset-0 -m-20 flex items-center justify-center">
                      <div className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px] rounded-full bg-gradient-to-r from-violet-500/10 to-orange-500/10 blur-3xl animate-pulse-slow" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Titre */}
          <div className={`text-center mt-8 lg:mt-12 transition-all duration-1000 ${
            textVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h1 className="font-playfair text-xl lg:text-2xl text-white/60 mb-2">
              Lettre d'allumage
            </h1>
            <div className="font-montserrat font-black text-3xl lg:text-5xl uppercase tracking-wider">
              <span className="gradient-text-animated-orange">Wanted</span>
              <span className="text-white/60 mx-2 lg:mx-3">×</span>
              <span className="text-white">Origines Media</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lettre d'intention */}
      <div className={`relative z-10 max-w-5xl mx-auto px-8 lg:px-16 pb-20 transition-all duration-1000 delay-500 ${
        textVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        {/* Carte principale avec design premium */}
        <div className="relative">
          {/* Effet de lueur derrière la carte */}
          <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-transparent to-orange-600/20 blur-3xl opacity-50" />
          
          {/* Carte avec glassmorphism amélioré */}
          <div className="relative bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden">
            {/* Pattern décoratif en arrière-plan */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.5'%3E%3Cpath d='M0 0L50 50L0 100M50 0L100 50L50 100'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px'
              }} />
            </div>

            {/* Contenu de la lettre */}
            <div className="relative p-10 lg:p-16">
              {/* En-tête élégant */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="font-playfair text-white/50 text-lg italic">Manifeste</span>
                  <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
              </div>

              {/* Paragraphes avec typographie solennelle */}
              <div className="space-y-8 mb-12">
                {/* Premier paragraphe - Mise en scène */}
                <p className="font-playfair text-xl lg:text-2xl text-white/90 leading-relaxed tracking-wide text-center lg:text-left">
                  <span className="text-3xl lg:text-4xl float-left mr-3 mt-1 font-bold text-white/80">À</span>
                  la croisée d'un comptoir de quartier et d'un studio de télévision, nous allons faire naître un lieu – et un média – où chaque café se convertit en acte de solidarité et chaque histoire enflamme les réseaux.
                </p>

                {/* Deuxième paragraphe - La transformation */}
                <div className="relative pl-8 lg:pl-12 border-l-2 border-gradient-to-b from-violet-500/50 to-orange-500/50">
                  <p className="font-inter text-lg lg:text-xl text-white/80 leading-relaxed italic">
                    Wanted devient la scène.<br />
                    Origines Media devient l'écho.<br />
                    <span className="text-white font-semibold not-italic">Ensemble, nous transformons l'entraide en spectacle vivant :</span>
                  </p>
                </div>

                {/* Les promesses - Design cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
                  {promises.map((promise, index) => (
                    <div 
                      key={index}
                      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500"
                      style={{
                        animationDelay: `${index * 100 + 1000}ms`,
                        opacity: textVisible ? 1 : 0,
                        transform: textVisible ? 'translateY(0)' : 'translateY(20px)'
                      }}
                    >
                      <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-violet-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <p className="relative font-montserrat font-bold text-white text-center">
                        {promise}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Paragraphes centraux avec style magazine */}
                <div className="space-y-6">
                  <p className="font-inter text-lg lg:text-xl text-white/85 leading-relaxed">
                    Le Café n'est plus seulement un refuge pour les estomacs vides : c'est le <span className="font-semibold text-white bg-gradient-to-r from-violet-500/20 to-orange-500/20 px-2 py-1 rounded">cœur battant</span> d'une narration en temps réel. Des micros branchés en continu, un compteur lumineux qui grimpe à chaque don, des écrans qui diffusent la gratitude en direct. Ici, le public ne se contente pas d'applaudir ; il nourrit, il relaie, il rallume l'étincelle suivante.
                  </p>

                  <p className="font-inter text-lg lg:text-xl text-white/85 leading-relaxed">
                    Pendant ce temps, Origines Media capte la matière brute – ces éclats d'humanité, ces scènes improvisées – et les propulse partout : TikTok, Reels, YouTube, podcasts. Les formats longs révèlent la profondeur, les formats courts déclenchent l'impulsion. Nous recyclons chaque seconde vécue pour qu'elle revienne, démultipliée, gonfler la vague de générosité.
                  </p>
                </div>

                {/* Le cercle vertueux - Visualisation */}
                <div className="my-12 p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <p className="font-playfair text-xl text-white text-center mb-8">
                    Le résultat ? Un cercle vertueux qui tourne à plein régime :
                  </p>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                    {circleSteps.map((step, index) => (
                      <React.Fragment key={index}>
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-violet-500/20 to-orange-500/20 flex items-center justify-center border border-white/20">
                            <span className="font-montserrat font-bold text-2xl text-white">
                              {index + 1}
                            </span>
                          </div>
                          <p className="font-inter text-white/80 max-w-[200px]">
                            {step}
                          </p>
                        </div>
                        {index < circleSteps.length - 1 && (
                          <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-violet-500/50 to-orange-500/50" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section finale avec emphase */}
              <div className="space-y-6 border-t border-white/10 pt-10">
                <p className="font-inter text-lg lg:text-xl text-white/90 leading-relaxed">
                  Et cette communauté, en retour, garde la roue lancée. Pas de hiérarchie, pas de barrières : tu entres, tu parles, tu changes le monde à hauteur de voix.
                </p>

                <div className="my-8 p-8 bg-gradient-to-r from-violet-500/10 to-orange-500/10 rounded-2xl border border-white/20">
                  <p className="font-playfair text-xl lg:text-2xl text-white leading-relaxed text-center">
                    Nous ne promettons pas un simple média ;<br />
                    nous promettons un <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-orange-400">accélérateur d'espérance</span>.
                  </p>
                </div>

                <p className="font-inter text-lg lg:text-xl text-white/90 leading-relaxed">
                  Un endroit où l'on peut voir, entendre, ressentir et mesurer – instant après instant – l'impact de notre volonté collective.
                </p>

                <div className="space-y-4 my-10">
                  <p className="font-inter text-lg lg:text-xl text-white/90 leading-relaxed">
                    Que ceux qui doutent passent la porte : ils verront une caméra braquée sur un inconnu devenu héros, sentiront le parfum d'un repas payé par un viewer à l'autre bout de la ville, entendront battre le tambour d'une solidarité qui ne dort jamais.
                  </p>
                  
                  <p className="font-inter text-lg lg:text-xl text-white/90 leading-relaxed">
                    Et à ceux qui rêvent d'un monde qui raconte mieux qu'il ne consomme :
                  </p>
                  
                  <p className="font-playfair text-2xl lg:text-3xl text-white text-center mt-6 italic">
                    Bienvenue dans notre révolution à caféine.
                  </p>
                </div>

                {/* Call to Action final avec bouton GO */}
                <div className="text-center mt-12 pt-8 border-t border-white/10">
                  <p className="font-montserrat font-black text-2xl lg:text-3xl text-white mb-8">
                    Appuie sur "Go Live". Le reste suivra.
                  </p>
                  
                  {/* Bouton GO spectaculaire */}
                  <button
                    onClick={onGoLive}
                    className="group relative inline-flex items-center justify-center"
                  >
                    <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-violet-600 to-orange-600 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                    <div className="relative w-32 h-32 bg-gradient-to-r from-violet-600 to-orange-600 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-active:scale-95">
                      <div className="absolute inset-2 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="font-montserrat font-black text-4xl text-white tracking-wider">
                          GO
                        </span>
                      </div>
                    </div>
                    {/* Cercles concentriques animés */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-40 h-40 border-2 border-white/20 rounded-full animate-ping" />
                      <div className="absolute w-48 h-48 border border-white/10 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                    </div>
                  </button>
                  
                  <p className="font-inter text-white/60 text-sm mt-6 animate-pulse">
                    Cliquez pour découvrir la suite
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes explode {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(1);
            opacity: 0;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes draw-infinity {
          0% {
            stroke-dashoffset: 800;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes dash {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 10;
          }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-explode {
          animation: explode 2s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }

        .animate-draw-infinity {
          animation: draw-infinity 2s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-dash {
          animation: dash 1s linear infinite;
        }

        .gradient-text-animated {
          background: linear-gradient(135deg, #F97316 0%, #EF4444 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }

        .gradient-text-animated-orange {
          background: linear-gradient(135deg, #F97316 0%, #EF4444 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
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
      `}</style>
    </section>
  );
};

export default PartnershipHeroSection;