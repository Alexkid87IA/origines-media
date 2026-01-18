import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Clock, Eye, Heart, 
  Share2, ArrowLeft, ChevronDown, ChevronUp, MessageCircle,
  Bookmark, Download, ThumbsUp, Sparkles
} from 'lucide-react';
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
  commentaires: number;
  datePublication: string;
  verticale: string;
  verticaleColor: string;
  tags: string[];
  aspectRatio: '16/9' | '9/16';
  createur: {
    nom: string;
    bio: string;
    avatar: string;
    role: string;
  };
  chapitres?: {
    titre: string;
    timestamp: string;
  }[];
}

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [showChapitres, setShowChapitres] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock data enrichie
  const video: Video = {
    id: id || 'default',
    titre: 'L\'art du storytelling visuel : transformer vos idées en récits captivants',
    description: `Dans cette masterclass exclusive, Marie Dubois explore les techniques narratives utilisées par les plus grands réalisateurs contemporains. 

    Vous découvrirez comment structurer vos histoires, créer des personnages mémorables et utiliser le langage visuel pour transmettre des émotions puissantes. Cette formation s'adresse aux créateurs de contenu, vidéastes et storytellers qui souhaitent élever leur art narratif.

    Points clés abordés :
    • La structure en trois actes revisitée
    • L'importance du conflit narratif
    • Les techniques de montage émotionnel
    • La psychologie des couleurs en narration
    • L'utilisation du son comme élément narratif`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: '/placeholder.svg',
    duree: '45:32',
    vues: 125420,
    likes: 8921,
    commentaires: 342,
    datePublication: '2024-01-20',
    verticale: 'ART & CRÉATIVITÉ',
    verticaleColor: '#8B5CF6',
    aspectRatio: '16/9',
    tags: ['Storytelling', 'Cinéma', 'Narration', 'Créativité', 'Montage'],
    createur: {
      nom: 'Marie Dubois',
      bio: 'Réalisatrice et formatrice en storytelling visuel avec 15 ans d\'expérience',
      avatar: '/placeholder.svg',
      role: 'Experte en narration visuelle'
    },
    chapitres: [
      { titre: 'Introduction au storytelling', timestamp: '00:00' },
      { titre: 'Les fondamentaux de la narration', timestamp: '05:23' },
      { titre: 'Créer des personnages authentiques', timestamp: '12:45' },
      { titre: 'Le montage émotionnel', timestamp: '25:30' },
      { titre: 'Études de cas pratiques', timestamp: '35:15' },
      { titre: 'Conclusion et exercices', timestamp: '42:00' }
    ]
  };

  const isVertical = video.aspectRatio === '9/16';

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
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
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
        
        {/* Header avec bouton retour */}
        <div className="pt-8 px-8 lg:px-16">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-3 px-6 py-3 bg-black/40 border border-white/20 text-white font-inter font-medium rounded-xl hover:bg-black/60 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Retour</span>
          </button>
        </div>

        {/* Contenu principal */}
        <section className="py-12 px-8 lg:px-16">
          <div className={`${isVertical ? 'max-w-7xl mx-auto lg:grid lg:grid-cols-[1fr,2fr] lg:gap-12' : 'max-w-6xl mx-auto'}`}>
            
            {/* Conteneur vidéo adaptatif */}
            <div className={`${isVertical ? 'lg:sticky lg:top-8 lg:h-fit' : 'mb-12'}`}>
              {/* Player vidéo avec design moderne */}
              <div className={`relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${
                isVertical ? 'aspect-[9/16]' : 'aspect-video'
              }`}>
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

                {/* Overlay de contrôles élégant */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                  <div className="p-6 space-y-4">
                    {/* Barre de progression */}
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    </div>
                    
                    {/* Contrôles */}
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

                        <span className="text-white/90 font-inter text-sm font-medium">
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

              {/* Actions rapides sous la vidéo (mobile/vertical) */}
              {isVertical && (
                <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`px-6 py-3 rounded-full font-medium transition-all ${
                      isLiked 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                  </button>
                  
                  <button className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                  
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-3 rounded-full transition-colors ${
                      isSaved ? 'bg-white/20 text-purple-400' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              )}
            </div>

            {/* Informations et contenu */}
            <div>
              {/* En-tête avec titre et métadonnées */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span 
                    className="px-4 py-2 rounded-full font-inter font-bold text-xs tracking-wider uppercase"
                    style={{
                      backgroundColor: video.verticaleColor + '20',
                      color: video.verticaleColor,
                      borderWidth: '1px',
                      borderColor: video.verticaleColor + '40'
                    }}
                  >
                    {video.verticale}
                  </span>
                  <span className="text-white/60 font-inter text-sm">
                    Publié le {formatDate(video.datePublication)}
                  </span>
                </div>
                
                <h1 className="font-montserrat font-bold text-3xl lg:text-4xl xl:text-5xl text-white leading-tight mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {video.titre}
                </h1>

                {/* Statistiques */}
                <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(video.vues)} vues</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{formatNumber(video.likes)} j'aime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{formatNumber(video.commentaires)} commentaires</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{video.duree}</span>
                  </div>
                </div>
              </div>

              {/* Actions principales (desktop/horizontal) */}
              {!isVertical && (
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                      isLiked 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                    <span>J'aime</span>
                  </button>
                  
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Partager</span>
                  </button>
                  
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                      isSaved 
                        ? 'bg-white/20 text-purple-400 border border-purple-400/40' 
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    <span>Sauvegarder</span>
                  </button>
                  
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Télécharger</span>
                  </button>
                </div>
              )}

              {/* Créateur */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8 hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <img 
                    src={video.createur.avatar} 
                    alt={video.createur.nom}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-white/20"
                  />
                  <div className="flex-1">
                    <h3 className="font-montserrat font-bold text-white text-lg mb-1">
                      {video.createur.nom}
                    </h3>
                    <p className="text-white/60 text-sm mb-3">{video.createur.role}</p>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {video.createur.bio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description détaillée */}
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center justify-between w-full text-left mb-4 group"
                >
                  <h3 className="font-montserrat font-bold text-white text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    À propos de cette vidéo
                  </h3>
                  {showDescription ? (
                    <ChevronUp className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  )}
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ${
                  showDescription ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="prose prose-invert max-w-none">
                    <p className="font-inter text-white/80 leading-relaxed whitespace-pre-line">
                      {video.description}
                    </p>
                  </div>
                  
                  {/* Tags */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="font-inter font-medium text-white/60 text-sm mb-3 uppercase tracking-wider">
                      Mots-clés
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {video.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 bg-white/10 border border-white/20 text-white/80 rounded-full font-inter text-sm hover:bg-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapitres */}
              {video.chapitres && video.chapitres.length > 0 && (
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <button
                    onClick={() => setShowChapitres(!showChapitres)}
                    className="flex items-center justify-between w-full text-left mb-4 group"
                  >
                    <h3 className="font-montserrat font-bold text-white text-xl">
                      Chapitres ({video.chapitres.length})
                    </h3>
                    {showChapitres ? (
                      <ChevronUp className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                    )}
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-500 ${
                    showChapitres ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="space-y-2">
                      {video.chapitres.map((chapitre, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                        >
                          <span className="text-purple-400 font-mono text-sm font-medium">
                            {chapitre.timestamp}
                          </span>
                          <span className="text-white/80 group-hover:text-white transition-colors">
                            {chapitre.titre}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default VideoPage;