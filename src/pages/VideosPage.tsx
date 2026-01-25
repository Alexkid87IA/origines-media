// src/pages/VideosPage.tsx
// Page catalogue vidéos - Connectée à Sanity

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Clock, Search, Clock3, Flame, ChevronLeft, ChevronRight, SlidersHorizontal
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/SEO';
import { sanityFetch } from '../lib/sanity';
import { typo } from '../lib/typography';

// Query Sanity pour les vidéos
const VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video"] | order(datePublication desc) {
    _id,
    "titre": titre,
    "slug": slug.current,
    "description": description,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "videoUrl": videoUrl,
    "duree": tempsLecture,
    "datePublication": datePublication,
    "verticale": verticale->{ titre, slug, couleur },
    "vues": vues
  }
`;

// Types
interface Video {
  _id: string;
  titre: string;
  slug: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  duree: number;
  datePublication: string;
  verticale: {
    titre: string;
    slug: string;
    couleur: string;
  };
  vues: number;
}

// Extraire l'ID YouTube d'une URL
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Obtenir la thumbnail YouTube
const getYouTubeThumbnail = (url: string): string => {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return '/placeholder.svg';
};

// Nombre de vidéos par page
const VIDEOS_PER_PAGE = 12;

// Filtres de format (10 formats)
const formatFilters = [
  { id: 'all', label: 'Tous les formats', color: '#6B7280' },
  { id: 'reportages', label: 'Reportages', color: '#0891B2' },
  { id: 'temoignages', label: 'Témoignages', color: '#8B5CF6' },
  { id: 'youtube', label: 'Concepts YouTube', color: '#FF0000' },
  { id: 'shorts', label: 'Shorts', color: '#F97316' },
  { id: 'live', label: 'Lives', color: '#EF4444' },
  { id: 'vlogs', label: 'Vlogs', color: '#10B981' },
  { id: 'decryptages', label: 'Décryptages', color: '#3B82F6' },
  { id: 'debats', label: 'Débats', color: '#EC4899' },
  { id: 'portraits', label: 'Portraits', color: '#A855F7' },
  { id: 'news', label: 'News', color: '#6366F1' },
];

// Filtres de tri
const sortOptions = [
  { id: 'recent', label: 'Plus récentes', icon: Clock3 },
  { id: 'popular', label: 'Plus populaires', icon: Flame },
];

// Composant carte vidéo avec memoization
const VideoCard: React.FC<{ video: Video; index: number }> = React.memo(({ video, index }) => {
  const thumbnail = video.imageUrl || getYouTubeThumbnail(video.videoUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/video/${video.slug}`}
        className="group block"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100">
          <img
            src={thumbnail}
            alt={video.titre}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />

          {/* Overlay au hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {/* Bouton play au hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform group-hover:scale-110 bg-black/70">
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Badge durée */}
          {video.duree && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duree} min
            </div>
          )}
        </div>

        {/* Titre */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {typo(video.titre)}
        </h3>
      </Link>
    </motion.div>
  );
});

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFormat, setActiveFormat] = useState('all');
  const [activeSort, setActiveSort] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await sanityFetch(VIDEOS_QUERY);
        setVideos(data || []);
      } catch (error) {
        console.error('Erreur chargement vidéos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filtrer les vidéos
  const filteredVideos = videos.filter(video => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        video.titre?.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Trier les vidéos
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (activeSort === 'popular') {
      return (b.vues || 0) - (a.vues || 0);
    }
    return new Date(b.datePublication || 0).getTime() - new Date(a.datePublication || 0).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(sortedVideos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const paginatedVideos = sortedVideos.slice(startIndex, startIndex + VIDEOS_PER_PAGE);

  // Reset page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFormat, activeSort]);

  // Scroll vers le haut quand on change de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <>
      <SEO
        title="Vidéos"
        description="Explorez notre collection de contenus vidéo inspirants. Documentaires, interviews et reportages sur des thématiques qui comptent."
        url="/videos"
      />
      <Navbar />

      <main className="min-h-screen bg-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-baseline gap-3 mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Vidéos
              </h1>
              <span className="text-gray-400 text-lg">
                {sortedVideos.length} vidéo{sortedVideos.length > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-gray-500">
              Explorez notre collection de contenus vidéo inspirants
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-[240px,1fr] lg:gap-8">

            {/* Sidebar filtres */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">

                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                  />
                </div>

                {/* Formats */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Format
                  </h3>
                  <div className="space-y-1">
                    {formatFilters.map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setActiveFormat(format.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeFormat === format.id
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: format.color }}
                        />
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tri */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Trier par
                  </h3>
                  <div className="space-y-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setActiveSort(option.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeSort === option.id
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </aside>

            {/* Grille vidéos */}
            <div>
              {/* Barre mobile */}
              <div className="lg:hidden flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-300"
                  />
                </div>
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                </button>
              </div>

              {/* Filtres mobile */}
              <AnimatePresence>
                {showMobileFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="lg:hidden overflow-hidden mb-4"
                  >
                    <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                      {/* Formats */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Format</p>
                        <div className="flex flex-wrap gap-2">
                          {formatFilters.map((format) => (
                            <button
                              key={format.id}
                              onClick={() => { setActiveFormat(format.id); setShowMobileFilters(false); }}
                              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                              style={{
                                backgroundColor: activeFormat === format.id ? format.color : `${format.color}15`,
                                color: activeFormat === format.id ? '#FFFFFF' : format.color
                              }}
                            >
                              {format.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tri */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Trier par</p>
                        <div className="flex flex-wrap gap-2">
                          {sortOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => { setActiveSort(option.id); setShowMobileFilters(false); }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                                activeSort === option.id
                                  ? 'bg-gray-900 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <option.icon className="w-3 h-3" />
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton variant="rectangular" className="w-full aspect-video rounded-xl" />
                      <Skeleton variant="text" className="h-4 w-3/4" />
                      <Skeleton variant="text" className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : sortedVideos.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">Aucune vidéo trouvée</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedVideos.map((video, index) => (
                      <VideoCard key={video._id} video={video} index={index} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      {/* Bouton précédent */}
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {/* Numéros de page */}
                      {getPageNumbers().map((page, idx) => (
                        <button
                          key={idx}
                          onClick={() => typeof page === 'number' && setCurrentPage(page)}
                          disabled={page === '...'}
                          className={`min-w-[40px] h-10 px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-gray-900 text-white'
                              : page === '...'
                              ? 'cursor-default text-gray-400'
                              : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      {/* Bouton suivant */}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VideosPage;
