import React, { useState, useEffect, useRef } from 'react';
import { Play, Clock, Eye, Heart, Calendar, ChevronLeft, ChevronRight, TrendingUp, Star, Sparkles, Volume2, VolumeX, Share2, Plus, Check, Info, PlayCircle } from 'lucide-react';

interface Episode {
  id: string;
  titre: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoPreview?: string;
  datePublication: string;
  duree: string;
  vues: number;
  likes: number;
  episode?: number;
  saison?: number;
  isPopular?: boolean;
  isRecent?: boolean;
  tags: string[];
  rating?: number;
  progress?: number;
}

interface ActeEpisodesRecentsProps {
  formatId: string;
  formatName: string;
  formatColor: string;
  episodes: Episode[];
}

const ActeEpisodesRecents: React.FC<ActeEpisodesRecentsProps> = ({
  formatId,
  formatName,
  formatColor,
  episodes
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [savedEpisodes, setSavedEpisodes] = useState<Set<string>>(new Set());
  const [previewMuted, setPreviewMuted] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const itemsPerView = 4;
  const itemWidth = 320;
  const gap = 24;

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

  useEffect(() => {
    episodes.forEach((episode) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, episode.id]));
      };
      img.src = episode.thumbnailUrl;
    });
  }, [episodes]);

  const handleMouseEnter = (episodeId: string) => {
    setHoveredCard(episodeId);

    previewTimeoutRef.current = setTimeout(() => {
      setActivePreview(episodeId);
      const video = videoRefs.current[episodeId];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }, 1000);
  };

  const handleMouseLeave = (episodeId: string) => {
    setHoveredCard(null);
    setActivePreview(null);

    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    const video = videoRefs.current[episodeId];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (direction === 'next') {
      setCurrentIndex(prev => Math.min(prev + itemsPerView, episodes.length - itemsPerView));
    } else {
      setCurrentIndex(prev => Math.max(prev - itemsPerView, 0));
    }

    setTimeout(() => setIsTransitioning(false), 500);
  };

  const toggleSaveEpisode = (episodeId: string) => {
    setSavedEpisodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex < episodes.length - itemsPerView;

  if (episodes.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-[1920px] mx-auto px-8 lg:px-16">

        {/* Section Header */}
        <div className={`mb-12 transform transition-all duration-3000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-px"
                  style={{
                    background: `linear-gradient(to right, transparent, ${formatColor}, transparent)`
                  }}
                />
                <span
                  className="font-inter text-sm tracking-[0.3em] uppercase font-medium flex items-center gap-2"
                  style={{ color: formatColor }}
                >
                  <Sparkles className="w-4 h-4" />
                  Acte 2
                </span>
              </div>

              <h2 className="font-montserrat font-black text-4xl lg:text-5xl text-gray-900 leading-tight">
                Épisodes{' '}
                <span
                  className="inline-block"
                  style={{ color: formatColor }}
                >
                  Récents
                </span>
              </h2>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('prev')}
                disabled={!canNavigatePrev}
                className={`
                  w-12 h-12 rounded-full border flex items-center justify-center
                  transition-all duration-300 group
                  ${canNavigatePrev
                    ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:scale-110 shadow-sm'
                    : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <ChevronLeft className={`w-6 h-6 ${canNavigatePrev ? 'text-gray-700 group-hover:scale-110' : 'text-gray-400'}`} />
              </button>

              <button
                onClick={() => navigate('next')}
                disabled={!canNavigateNext}
                className={`
                  w-12 h-12 rounded-full border flex items-center justify-center
                  transition-all duration-300 group
                  ${canNavigateNext
                    ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:scale-110 shadow-sm'
                    : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <ChevronRight className={`w-6 h-6 ${canNavigateNext ? 'text-gray-700 group-hover:scale-110' : 'text-gray-400'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Episodes Carousel Container */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (itemWidth + gap)}px)`
              }}
            >
              {episodes.map((episode, index) => {
                const isHovered = hoveredCard === episode.id;
                const hasPreview = activePreview === episode.id;
                const isSaved = savedEpisodes.has(episode.id);
                const progress = episode.progress || 0;

                return (
                  <div
                    key={episode.id}
                    className={`
                      flex-shrink-0 transform transition-all duration-700
                      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}
                    `}
                    style={{
                      width: `${itemWidth}px`,
                      marginRight: `${gap}px`,
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <div
                      className={`
                        group relative cursor-pointer transform transition-all duration-500
                        ${isHovered ? 'scale-105 z-20' : 'scale-100 z-10'}
                      `}
                      onMouseEnter={() => handleMouseEnter(episode.id)}
                      onMouseLeave={() => handleMouseLeave(episode.id)}
                    >
                      {/* Card Container */}
                      <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300">

                        {/* Thumbnail/Video Container */}
                        <div className="relative aspect-video overflow-hidden">
                          {/* Video Preview */}
                          {episode.videoPreview && (
                            <video
                              ref={(el) => { if (el) videoRefs.current[episode.id] = el; }}
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                                hasPreview ? 'opacity-100' : 'opacity-0'
                              }`}
                              src={episode.videoPreview || episode.videoUrl}
                              muted={previewMuted}
                              loop
                              playsInline
                            />
                          )}

                          {/* Thumbnail */}
                          {loadedImages.has(episode.id) ? (
                            <img
                              src={episode.thumbnailUrl}
                              alt={episode.titre}
                              className={`w-full h-full object-cover transition-all duration-700 ${
                                hasPreview ? 'opacity-0' : 'opacity-100'
                              }`}
                              style={{
                                filter: isHovered ? 'brightness(0.8)' : 'brightness(1)'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 animate-pulse" />
                          )}

                          {/* Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-500 ${
                            isHovered ? 'opacity-100' : 'opacity-60'
                          }`} />

                          {/* Episode Number Badge */}
                          {episode.episode && (
                            <div className="absolute top-3 left-3 z-10">
                              <div className="px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-lg">
                                <span className="font-inter text-white text-sm font-bold">
                                  S{episode.saison}:E{episode.episode}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Duration Badge */}
                          <div className="absolute top-3 right-3 z-10">
                            <div className="px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-lg flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-white/80" />
                              <span className="font-inter text-white text-sm font-medium">
                                {episode.duree}
                              </span>
                            </div>
                          </div>

                          {/* Play Button */}
                          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                          }`}>
                            <div
                              className="w-16 h-16 rounded-full backdrop-blur-md border-2 flex items-center justify-center transform hover:scale-110 transition-transform duration-300"
                              style={{
                                backgroundColor: `${formatColor}30`,
                                borderColor: formatColor
                              }}
                            >
                              <Play
                                className="w-7 h-7 ml-1"
                                style={{ color: formatColor }}
                              />
                            </div>
                          </div>

                          {/* Progress Bar */}
                          {progress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300/50">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Title */}
                          <h3 className="font-montserrat font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                            {episode.titre}
                          </h3>

                          {/* Description - Visible on hover */}
                          <p className={`font-inter text-gray-600 text-sm leading-relaxed line-clamp-3 transition-all duration-500 ${
                            isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
                          }`}>
                            {episode.description}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 mt-3 text-gray-500 text-xs">
                            {/* Date */}
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDate(episode.datePublication)}</span>
                            </div>

                            {/* Views */}
                            <div className="flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{formatNumber(episode.vues)}</span>
                            </div>

                            {/* Rating */}
                            {episode.rating && (
                              <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span>{episode.rating}</span>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {episode.tags.length > 0 && (
                            <div className={`flex flex-wrap gap-2 mt-3 transition-all duration-500 ${
                              isHovered ? 'opacity-100' : 'opacity-0'
                            }`}>
                              {episode.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 rounded-md text-gray-600 text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons - Visible on hover */}
                          <div className={`flex items-center gap-2 mt-4 transition-all duration-500 ${
                            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                          }`}>
                            {/* Save Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveEpisode(episode.id);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-all duration-300"
                            >
                              {isSaved ? (
                                <>
                                  <Check className="w-4 h-4 text-green-600" />
                                  <span className="text-gray-700 text-sm font-medium">Enregistré</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 text-gray-600" />
                                  <span className="text-gray-700 text-sm font-medium">Ma liste</span>
                                </>
                              )}
                            </button>

                            {/* Share Button */}
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-all duration-300"
                            >
                              <Share2 className="w-4 h-4 text-gray-600" />
                            </button>

                            {/* Info Button */}
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-all duration-300"
                            >
                              <Info className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div
                        className={`absolute -inset-px rounded-xl transition-all duration-500 pointer-events-none ${
                          isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{
                          boxShadow: `0 0 40px ${formatColor}20`
                        }}
                      />

                      {/* Popular/Recent Badges */}
                      {(episode.isPopular || episode.isRecent) && (
                        <div className="absolute -top-2 -right-2 z-30">
                          {episode.isPopular && (
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${formatColor}, ${formatColor}cc)`,
                                boxShadow: `0 4px 20px ${formatColor}40`
                              }}
                            >
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Navigation Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(episodes.length / itemsPerView) }).map((_, idx) => {
            const isActive = idx === Math.floor(currentIndex / itemsPerView);
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx * itemsPerView)}
                className={`transition-all duration-300 rounded-full ${
                  isActive ? 'w-8 h-2' : 'w-2 h-2'
                }`}
                style={{
                  backgroundColor: isActive ? formatColor : 'rgba(156,163,175,0.5)'
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ActeEpisodesRecents;
