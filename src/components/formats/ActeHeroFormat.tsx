import React, { useState, useEffect, useRef } from 'react';
import { Video, Clock, Eye, Calendar, Play, Pause, Volume2, VolumeX, Maximize2, Star, Award, TrendingUp, Sparkles, ChevronDown } from 'lucide-react';

interface ActeHeroFormatProps {
  formatId: string;
  formatName: string;
  formatColor: string;
  tagline: string;
  description: string;
  imageHero: string;
  videoTeaser?: string; // Nouveau: URL de la vidéo teaser
  stats: {
    episodes: number;
    dureeTotal: string;
    vuesMoyennes: number;
    frequence: string;
  };
  rating?: number; // Nouveau: Note moyenne
  awards?: string[]; // Nouveau: Prix remportés
}

const ActeHeroFormat: React.FC<ActeHeroFormatProps> = ({
  formatId,
  formatName,
  formatColor,
  tagline,
  description,
  imageHero,
  videoTeaser = 'https://www.w3schools.com/html/mov_bbb.mp4', // Vidéo par défaut
  stats,
  rating = 4.8,
  awards = []
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (videoRef.current) {
            videoRef.current.play();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = imageHero;
  }, [imageHero]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-screen min-h-[800px] overflow-hidden"
    >
      <div ref={containerRef} className="absolute inset-0">
        {/* Video Background avec Parallax */}
        <div 
          className="absolute inset-0 scale-110"
          style={{
            transform: `translate(${mousePosition.x * 20 - 10}px, ${mousePosition.y * 20 - 10}px) scale(1.1)`,
            transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          {videoTeaser ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              style={{
                filter: `brightness(${0.4 + scrollProgress * 0.2}) contrast(1.2) saturate(1.1)`
              }}
            >
              <source src={videoTeaser} type="video/mp4" />
            </video>
          ) : (
            imageLoaded && (
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${imageHero})`,
                  filter: 'brightness(0.4) contrast(1.2)'
                }}
              />
            )
          )}
        </div>

        {/* Gradient Overlays Dynamiques */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
        <div 
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40"
          style={{
            opacity: 0.8 + scrollProgress * 0.2
          }}
        />
        
        {/* Color Accent Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${formatColor}20 0%, transparent 50%)`,
            opacity: 0.6
          }}
        />

        {/* Particules flottantes animées */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
        </div>

        {/* Video Controls */}
        {videoTeaser && (
          <div className="absolute bottom-8 right-8 flex items-center gap-2 z-30">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Contenu Principal */}
      <div className="relative z-20 h-full flex items-center px-8 lg:px-16">
        <div className="max-w-5xl">
          
          {/* Badge Animé "Format Exclusif" */}
          <div className={`mb-8 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div 
              className="inline-flex items-center px-5 py-2.5 rounded-full backdrop-blur-md border gap-3 animate-pulse-subtle"
              style={{
                backgroundColor: `${formatColor}15`,
                borderColor: `${formatColor}40`,
                boxShadow: `0 0 30px ${formatColor}30`
              }}
            >
              <div className="relative">
                <Video className="w-5 h-5" style={{ color: formatColor }} />
                <div 
                  className="absolute -inset-1 rounded-full animate-ping"
                  style={{ backgroundColor: `${formatColor}40` }}
                />
              </div>
              <span 
                className="font-inter font-bold text-sm tracking-[0.2em] uppercase"
                style={{ color: formatColor }}
              >
                Format Exclusif
              </span>
              <Sparkles className="w-4 h-4 animate-sparkle" style={{ color: formatColor }} />
            </div>
          </div>

          {/* Title avec effet de révélation cinématographique */}
          <h1 
            className={`font-montserrat font-black text-6xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.9] transform transition-all duration-1500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{
              textShadow: `0 20px 60px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.8), 0 0 120px ${formatColor}30`,
              letterSpacing: '-0.02em',
              animation: isVisible ? 'titleGlitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
              animationDelay: '0.4s'
            }}
          >
            <span className="block overflow-hidden">
              <span 
                className="block"
                style={{
                  animation: isVisible ? 'slideUpReveal 1s cubic-bezier(0.65, 0, 0.35, 1) forwards' : 'none',
                  animationDelay: '0.5s',
                  transform: 'translateY(100%)'
                }}
              >
                {formatName}
              </span>
            </span>
          </h1>

          {/* Tagline avec gradient animé */}
          <p 
            className={`font-inter text-2xl md:text-3xl mb-8 leading-relaxed transform transition-all duration-1000 delay-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{
              background: `linear-gradient(135deg, white 0%, ${formatColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none'
            }}
          >
            {tagline}
          </p>

          {/* Description avec glassmorphism */}
          <div 
            className={`mb-10 transform transition-all duration-1000 delay-900 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
          >
            <p 
              className="font-inter text-lg text-white/90 leading-relaxed max-w-3xl backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10"
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              {description}
            </p>
          </div>

          {/* Stats enrichies avec animations */}
          <div 
            className={`flex flex-wrap items-center gap-6 mb-10 transform transition-all duration-1000 delay-1100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
          >
            {/* Episodes */}
            <div className="group flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-5 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="relative">
                <Video className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                <div className="absolute -inset-2 rounded-full bg-purple-500/20 animate-pulse-slow" />
              </div>
              <div>
                <span className="block font-montserrat font-bold text-white text-lg">{stats.episodes}</span>
                <span className="block text-white/60 text-xs uppercase tracking-wider">Épisodes</span>
              </div>
            </div>

            {/* Durée totale */}
            <div className="group flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-5 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="relative">
                <Clock className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                <div className="absolute -inset-2 rounded-full bg-blue-500/20 animate-pulse-slow" />
              </div>
              <div>
                <span className="block font-montserrat font-bold text-white text-lg">{stats.dureeTotal}</span>
                <span className="block text-white/60 text-xs uppercase tracking-wider">Durée totale</span>
              </div>
            </div>

            {/* Vues moyennes */}
            <div className="group flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-5 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="relative">
                <Eye className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                <div className="absolute -inset-2 rounded-full bg-green-500/20 animate-pulse-slow" />
              </div>
              <div>
                <span className="block font-montserrat font-bold text-white text-lg">{formatNumber(stats.vuesMoyennes)}</span>
                <span className="block text-white/60 text-xs uppercase tracking-wider">Vues/épisode</span>
              </div>
            </div>

            {/* Fréquence */}
            <div className="group flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-5 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="relative">
                <Calendar className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                <div className="absolute -inset-2 rounded-full bg-orange-500/20 animate-pulse-slow" />
              </div>
              <div>
                <span className="block font-montserrat font-bold text-white text-lg">{stats.frequence}</span>
                <span className="block text-white/60 text-xs uppercase tracking-wider">Publication</span>
              </div>
            </div>

            {/* Rating */}
            <div className="group flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-5 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="relative">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <div className="absolute -inset-2 rounded-full bg-yellow-500/20 animate-pulse-slow" />
              </div>
              <div>
                <span className="block font-montserrat font-bold text-white text-lg">{rating}/5</span>
                <span className="block text-white/60 text-xs uppercase tracking-wider">Note moyenne</span>
              </div>
            </div>
          </div>

          {/* Awards si disponibles */}
          {awards.length > 0 && (
            <div 
              className={`flex flex-wrap items-center gap-4 transform transition-all duration-1000 delay-1300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
            >
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30"
                >
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/90 text-sm font-medium">{award}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator Animé */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30">
        <div 
          className={`flex flex-col items-center gap-2 animate-bounce transform transition-all duration-1000 delay-1500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}
        >
          <span className="text-white/60 text-xs uppercase tracking-wider">Découvrir</span>
          <ChevronDown className="w-5 h-5 text-white/60" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-40">
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${scrollProgress * 100}%`,
            background: `linear-gradient(90deg, ${formatColor} 0%, ${formatColor}cc 100%)`
          }}
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.5; transform: scale(1.2) rotate(180deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }

        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes titleGlitch {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
          100% { transform: translateX(0); }
        }

        @keyframes slideUpReveal {
          to { transform: translateY(0); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default ActeHeroFormat;