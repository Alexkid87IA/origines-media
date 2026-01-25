// src/components/VideosSection.tsx
// Section "Nos dernières vidéos" - Grandes cartes 16:9 avec carousel

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { typo } from '../lib/typography';
import { sanityFetch } from '../lib/sanity';
import { VIDEOS_SECTION_QUERY } from '../lib/queries';
import { getUniversColors } from '../lib/universColors';

interface SanityVideo {
  _id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  duree?: number;
  tempsLecture?: number;
  slug?: string;
  datePublication?: string;
  verticale?: {
    _id: string;
    nom: string;
    couleurDominante?: string;
    slug?: string;
  };
}

interface VideoDisplay {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  slug: string;
  color: string;
}

// Convertit durée en minutes vers format "X:XX"
const formatDuration = (minutes?: number): string => {
  if (!minutes) return '';
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Transforme les données Sanity en format d'affichage
const transformSanityVideo = (video: SanityVideo): VideoDisplay => {
  const colors = getUniversColors(video.verticale?.nom);
  return {
    id: video._id,
    title: video.titre,
    description: video.description || '',
    category: video.verticale?.nom || 'Société',
    thumbnail: video.imageUrl || '/placeholder.svg',
    duration: formatDuration(video.tempsLecture || video.duree),
    slug: video.slug || 'default',
    color: colors.bg,
  };
};

// Composant VideoCard - Grande carte style premium
const VideoCard: React.FC<{ video: VideoDisplay; index: number }> = ({ video, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="flex-shrink-0 w-full"
  >
    <Link
      to={`/video/${video.slug}`}
      className="group block"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
        {/* Thumbnail 16:9 - Grande taille */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Play button central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center backdrop-blur-md bg-white/20 border border-white/30 group-hover:scale-110 transition-transform duration-300"
              whileHover={{ scale: 1.15 }}
            >
              <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white ml-1" />
            </motion.div>
          </div>

          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
              {video.duration}
            </div>
          )}

          {/* Category badge en haut */}
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide shadow-lg"
              style={{
                backgroundColor: video.color,
                color: 'white',
              }}
            >
              {video.category}
            </span>
          </div>
        </div>

        {/* Content - Plus d'espace */}
        <div className="p-4 sm:p-5">
          {/* Title - Plus grand */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors">
            {typo(video.title)}
          </h3>

          {/* Description */}
          {video.description && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
              {typo(video.description)}
            </p>
          )}

          {/* Regarder link */}
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
            style={{ color: video.color }}
          >
            Regarder
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default function VideosSection() {
  const [videos, setVideos] = useState<VideoDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Nombre de cartes visibles selon la taille d'écran
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const sanityVideos = await sanityFetch(VIDEOS_SECTION_QUERY) as SanityVideo[];
        if (sanityVideos && sanityVideos.length > 0) {
          // Shuffle et sélection
          const shuffled = [...sanityVideos].sort(() => Math.random() - 0.5);
          const selected: SanityVideo[] = [];
          const remaining = [...shuffled];

          while (selected.length < 6 && remaining.length > 0) {
            const lastCategory = selected.length > 0
              ? selected[selected.length - 1].verticale?.nom
              : null;
            let foundIndex = remaining.findIndex(v => v.verticale?.nom !== lastCategory);
            if (foundIndex === -1) foundIndex = 0;
            selected.push(remaining[foundIndex]);
            remaining.splice(foundIndex, 1);
          }

          setVideos(selected.map(transformSanityVideo));
        }
      } catch (error) {
        console.error('Erreur chargement vidéos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || videos.length <= visibleCards) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = videos.length - visibleCards;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, videos.length, visibleCards]);

  const goToSlide = useCallback((index: number) => {
    const maxIndex = Math.max(0, videos.length - visibleCards);
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  }, [videos.length, visibleCards]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    goToSlide(currentIndex + 1);
  };

  // Ne pas afficher si pas de vidéos
  if (!loading && videos.length === 0) {
    return null;
  }

  const maxIndex = Math.max(0, videos.length - visibleCards);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  // Touch swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && canGoNext) {
      goToNext();
    }
    if (isRightSwipe && canGoPrev) {
      goToPrev();
    }
  };

  return (
    <section className="bg-gray-50 py-10 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Regarder</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Nos dernières{' '}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                vidéos
              </span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              {typo("Des formats immersifs pensés pour vous inspirer : témoignages authentiques, documentaires et moments de réflexion.")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Navigation arrows */}
            {videos.length > visibleCards && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={goToPrev}
                  disabled={!canGoPrev}
                  className={`p-2.5 rounded-full border transition-all ${
                    canGoPrev
                      ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-100 text-gray-700'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                  aria-label="Vidéos précédentes"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={!canGoNext}
                  className={`p-2.5 rounded-full border transition-all ${
                    canGoNext
                      ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-100 text-gray-700'
                      : 'border-gray-200 text-gray-300 cursor-not-allowed'
                  }`}
                  aria-label="Vidéos suivantes"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            <Link
              to="/videos"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
            >
              <span>Toutes les vidéos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Carousel container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Cards grid avec animation */}
          <motion.div
            className="flex gap-5"
            animate={{
              x: `-${currentIndex * (100 / visibleCards)}%`,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="flex-shrink-0"
                style={{ width: `calc((100% - ${(visibleCards - 1) * 20}px) / ${visibleCards})` }}
              >
                <VideoCard video={video} index={index} />
              </div>
            ))}
          </motion.div>

          {/* Fade edges pour indiquer plus de contenu */}
          {canGoPrev && (
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10 hidden lg:block" />
          )}
          {canGoNext && (
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10 hidden lg:block" />
          )}
        </div>

        {/* Dots indicator */}
        {videos.length > visibleCards && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  goToSlide(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-cyan-500 to-blue-500'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Aller à la page ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Mobile: Bouton voir tout */}
        <div className="sm:hidden mt-6">
          <Link
            to="/videos"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
          >
            <span>Voir toutes les vidéos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
