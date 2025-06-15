import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, Eye, Heart, Share2, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/Layout';

interface Video {
  id: string;
  titre: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duree: string;
  vues: number;
  likes: number;
  datePublication: string;
  categorie: string;
  tags: string[];
  credits?: {
    realisateur?: string;
    producteur?: string;
    montage?: string;
    musique?: string;
  };
}

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Mock data - replace with actual data fetching
  const video: Video = {
    id: id || 'default',
    titre: 'Développer un mindset d\'exception',
    description: 'Dans cette vidéo exclusive, nous explorons les secrets des entrepreneurs qui réussissent et transforment leur vision du monde. Découvrez les habitudes mentales, les stratégies de pensée et les techniques pratiques qui font la différence entre ceux qui rêvent et ceux qui réalisent.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
    duree: '12:34',
    vues: 15420,
    likes: 892,
    datePublication: '2024-01-20',
    categorie: 'Développement Personnel',
    tags: ['Mindset', 'Entrepreneuriat', 'Réussite', 'Psychologie'],
    credits: {
      realisateur: 'Marie Dubois',
      producteur: 'Origines Media',
      montage: 'Thomas Martin',
      musique: 'Julien Rousseau'
    }
  };

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

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <Layout>
      <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]">
        
        {/* Back Button */}
        <div className="pt-8 px-8 lg:px-16">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-3 px-6 py-3 bg-black/40 border border-white/20 text-white font-inter font-medium rounded-xl hover:bg-black/60 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Retour</span>
          </button>
        </div>

        {/* Video Player Section */}
        <section 
          ref={sectionRef}
          className="py-12 px-8 lg:px-16"
        >
          <div className="max-w-6xl mx-auto">
            
            {/* Video Player */}
            <div className={`relative bg-black rounded-3xl overflow-hidden mb-8 transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster={video.thumbnailUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="w-full p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlay}
                          className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </button>
                        
                        <button
                          onClick={toggleMute}
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>

                        <span className="text-white/90 font-inter text-sm">
                          {video.duree}
                        </span>
                      </div>

                      <button
                        onClick={toggleFullscreen}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                      >
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Title & Category */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-violet-600/20 border border-violet-500/30 text-violet-400 rounded-full font-inter font-bold text-xs tracking-wider uppercase">
                      {video.categorie}
                    </span>
                    <span className="text-white/60 font-inter text-sm">
                      {formatDate(video.datePublication)}
                    </span>
                  </div>
                  
                  <h1 className="font-montserrat font-bold text-3xl lg:text-4xl text-white leading-tight mb-4">
                    {video.titre}
                  </h1>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-8 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(video.vues)} vues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{formatNumber(video.likes)} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{video.duree}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="flex items-center justify-between w-full text-left mb-4"
                  >
                    <h3 className="font-montserrat font-bold text-white text-lg">
                      Description
                    </h3>
                    {showDescription ? (
                      <ChevronUp className="w-5 h-5 text-white/60" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/60" />
                    )}
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${
                    showDescription ? 'max-h-96 opacity-100' : 'max-h-20 opacity-70'
                  }`}>
                    <p className="font-inter text-white/80 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <h4 className="font-inter font-medium text-white/80 text-sm mb-3 uppercase tracking-wider">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/10 border border-white/20 text-white/70 rounded-full font-inter text-sm hover:bg-white/20 transition-colors duration-300 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Actions */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="font-montserrat font-bold text-white text-lg mb-4">
                    Actions
                  </h3>
                  
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-inter">
                      <Heart className="w-5 h-5" />
                      <span>Ajouter aux favoris</span>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-inter">
                      <Share2 className="w-5 h-5" />
                      <span>Partager</span>
                    </button>
                  </div>
                </div>

                {/* Credits */}
                {video.credits && (
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="font-montserrat font-bold text-white text-lg mb-4">
                      Crédits
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      {video.credits.realisateur && (
                        <div>
                          <span className="text-white/60 font-inter">Réalisateur:</span>
                          <span className="text-white ml-2 font-inter">{video.credits.realisateur}</span>
                        </div>
                      )}
                      {video.credits.producteur && (
                        <div>
                          <span className="text-white/60 font-inter">Producteur:</span>
                          <span className="text-white ml-2 font-inter">{video.credits.producteur}</span>
                        </div>
                      )}
                      {video.credits.montage && (
                        <div>
                          <span className="text-white/60 font-inter">Montage:</span>
                          <span className="text-white ml-2 font-inter">{video.credits.montage}</span>
                        </div>
                      )}
                      {video.credits.musique && (
                        <div>
                          <span className="text-white/60 font-inter">Musique:</span>
                          <span className="text-white ml-2 font-inter">{video.credits.musique}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default VideoPage;