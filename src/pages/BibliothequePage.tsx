// src/pages/BibliothequePage.tsx
// Page Explorer - Hub central de tous les contenus

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Grid3X3, FileText, Play, Film, Heart, User,
  Clock, Eye, Star, BookOpen, ChevronDown, SlidersHorizontal,
  ArrowRight, X
} from 'lucide-react';
import { sanityFetch } from '../lib/sanity';
import {
  EXPLORER_ARTICLES_QUERY,
  EXPLORER_VIDEOS_QUERY,
  EXPLORER_SERIES_QUERY,
  EXPLORER_RECOS_QUERY,
  EXPLORER_HISTOIRES_QUERY,
  VERTICALES_QUERY
} from '../lib/queries';
import type {
  ExplorerArticle,
  ExplorerVideo,
  ExplorerSerie,
  ExplorerReco,
  ExplorerHistoire,
  ExplorerVerticale
} from '../types/sanity';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// ============ TYPES ============
interface Verticale {
  _id: string;
  nom: string;
  slug: { current: string };
  couleurDominante: string;
}

interface ContentItem {
  _id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
  contentType: 'article' | 'video' | 'serie' | 'reco' | 'histoire';
  // Article specific
  typeArticle?: string;
  tempsLecture?: number;
  // Video specific
  duree?: number;
  vues?: number;
  videoUrl?: string;
  // Serie specific
  episodeCount?: number;
  // Reco specific
  type?: string;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  // Histoire specific
  categorie?: string;
  // Common
  verticale?: {
    _id: string;
    nom: string;
    couleurDominante: string;
    slug: string;
  };
}

// ============ CONSTANTS ============
const CONTENT_TYPES = [
  { id: 'all', label: 'Tout', icon: Grid3X3, color: '#6B7280' },
  { id: 'article', label: 'Articles', icon: FileText, color: '#10B981' },
  { id: 'video', label: 'Vidéos', icon: Play, color: '#06B6D4' },
  { id: 'serie', label: 'Séries', icon: Film, color: '#8B5CF6' },
  { id: 'reco', label: 'Recos', icon: Heart, color: '#EC4899' },
  { id: 'histoire', label: 'Histoires', icon: User, color: '#F59E0B' },
];

const RECO_TYPE_ICONS: Record<string, string> = {
  'livre': '📚',
  'film': '🎬',
  'podcast': '🎧',
  'youtube': '📺',
  'instagram': '📸',
  'livre-audio': '🎵',
  'musee': '🏛️',
  'theatre': '🎭',
};

const SORT_OPTIONS = [
  { id: 'recent', label: 'Plus récents' },
  { id: 'popular', label: 'Populaires' },
  { id: 'alpha', label: 'A-Z' },
];

// ============ HELPER FUNCTIONS ============
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}` : `${h}h`;
}

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
  return views.toString();
}

function getContentLink(item: ContentItem): string {
  switch (item.contentType) {
    case 'article':
      return `/article/${item.slug}`;
    case 'video':
      return `/video/${item.slug}`;
    case 'serie':
      return `/series/${item.slug}`;
    case 'reco':
      return `/recommandation/${item.slug}`;
    case 'histoire':
      return `/histoire/${item.slug}`;
    default:
      return `/article/${item.slug}`;
  }
}

// ============ CARD COMPONENTS ============

// Article Card
const ArticleCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  const color = item.verticale?.couleurDominante || '#6B7280';

  return (
    <Link to={getContentLink(item)} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={item.imageUrl || '/placeholder.svg'}
            alt={item.titre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badge type */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: color }}
            >
              {item.verticale?.nom || 'Article'}
            </span>
          </div>

          {/* Badge article type */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 text-gray-700">
              <FileText className="w-3 h-3 inline mr-1" />
              Article
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {item.titre}
          </h3>
          {item.tempsLecture && (
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.tempsLecture} min de lecture
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

// Video Card
const VideoCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  const color = item.verticale?.couleurDominante || '#06B6D4';

  return (
    <Link to={getContentLink(item)} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Image with play button */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.imageUrl || '/placeholder.svg'}
            alt={item.titre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Duration badge */}
          {item.duree && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-1 rounded-md text-xs font-semibold bg-black/80 text-white">
                {formatDuration(item.duree)}
              </span>
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500 text-white">
              Vidéo
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {item.titre}
          </h3>
          {item.vues && (
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViews(item.vues)} vues
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

// Serie Card
const SerieCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  return (
    <Link to={getContentLink(item)} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Poster */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={item.imageUrl || '/placeholder.svg'}
            alt={item.titre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500 text-white">
              Série
            </span>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white line-clamp-2">
              {item.titre}
            </h3>
            {item.episodeCount !== undefined && (
              <p className="mt-1 text-sm text-white/80 flex items-center gap-1">
                <Film className="w-3.5 h-3.5" />
                {item.episodeCount} épisode{item.episodeCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Reco Card
const RecoCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  const typeIcon = RECO_TYPE_ICONS[item.type || 'livre'] || '📌';

  return (
    <Link to={getContentLink(item)} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={item.imageUrl || '/placeholder.svg'}
            alt={item.titre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-gray-800">
              {typeIcon} {item.type || 'Reco'}
            </span>
          </div>

          {/* Rating */}
          {item.note && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-900 flex items-center gap-0.5">
                <Star className="w-3 h-3" fill="currentColor" />
                {item.note}
              </span>
            </div>
          )}

          {/* Coup de coeur */}
          {item.coupDeCoeur && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                ❤️ Coup de coeur
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {item.titre}
          </h3>
          {item.auteur && (
            <p className="mt-1 text-sm text-gray-500">
              {item.auteur}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

// Histoire Card
const HistoireCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  const color = item.verticale?.couleurDominante || '#F59E0B';

  return (
    <Link to={getContentLink(item)} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={item.imageUrl || '/placeholder.svg'}
            alt={item.titre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: color }}
            >
              {item.categorie || 'Histoire'}
            </span>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white line-clamp-2">
              {item.titre}
            </h3>
            {item.accroche && (
              <p className="mt-2 text-sm text-white/80 line-clamp-2">
                {item.accroche}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Content Card Router
const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  switch (item.contentType) {
    case 'article':
      return <ArticleCard item={item} />;
    case 'video':
      return <VideoCard item={item} />;
    case 'serie':
      return <SerieCard item={item} />;
    case 'reco':
      return <RecoCard item={item} />;
    case 'histoire':
      return <HistoireCard item={item} />;
    default:
      return <ArticleCard item={item} />;
  }
};

// ============ MAIN COMPONENT ============
function BibliothequePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<string>(searchParams.get('type') || 'all');
  const [activeVerticale, setActiveVerticale] = useState<string | null>(searchParams.get('categorie') || null);
  const [sortBy, setSortBy] = useState('recent');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Data states
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [series, setSeries] = useState<ContentItem[]>([]);
  const [recos, setRecos] = useState<ContentItem[]>([]);
  const [histoires, setHistoires] = useState<ContentItem[]>([]);
  const [verticales, setVerticales] = useState<Verticale[]>([]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesData, videosData, seriesData, recosData, histoiresData, verticalesData] = await Promise.all([
          sanityFetch<ExplorerArticle[]>(EXPLORER_ARTICLES_QUERY),
          sanityFetch<ExplorerVideo[]>(EXPLORER_VIDEOS_QUERY),
          sanityFetch<ExplorerSerie[]>(EXPLORER_SERIES_QUERY),
          sanityFetch<ExplorerReco[]>(EXPLORER_RECOS_QUERY),
          sanityFetch<ExplorerHistoire[]>(EXPLORER_HISTOIRES_QUERY),
          sanityFetch<ExplorerVerticale[]>(VERTICALES_QUERY),
        ]);

        // Transform data with content type
        setArticles((articlesData || []).map((a) => ({ ...a, contentType: 'article' as const })));
        setVideos((videosData || []).map((v) => ({ ...v, contentType: 'video' as const })));
        setSeries((seriesData || []).map((s) => ({ ...s, contentType: 'serie' as const })));
        setRecos((recosData || []).map((r) => ({ ...r, contentType: 'reco' as const })));
        setHistoires((histoiresData || []).map((h) => ({ ...h, contentType: 'histoire' as const })));
        setVerticales(verticalesData || []);
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Combine and filter content
  const allContent = useMemo(() => {
    let content: ContentItem[] = [];

    // Filter by type
    if (activeType === 'all') {
      content = [...articles, ...videos, ...series, ...recos, ...histoires];
    } else if (activeType === 'article') {
      content = articles;
    } else if (activeType === 'video') {
      content = videos;
    } else if (activeType === 'serie') {
      content = series;
    } else if (activeType === 'reco') {
      content = recos;
    } else if (activeType === 'histoire') {
      content = histoires;
    }

    // Filter by verticale (only for types that have it)
    if (activeVerticale && activeType !== 'reco') {
      content = content.filter(item => item.verticale?.slug === activeVerticale);
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      content = content.filter(item =>
        item.titre?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.accroche?.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === 'recent') {
      content.sort((a, b) => new Date(b.datePublication || '').getTime() - new Date(a.datePublication || '').getTime());
    } else if (sortBy === 'alpha') {
      content.sort((a, b) => (a.titre || '').localeCompare(b.titre || ''));
    } else if (sortBy === 'popular') {
      content.sort((a, b) => (b.vues || 0) - (a.vues || 0));
    }

    return content;
  }, [articles, videos, series, recos, histoires, activeType, activeVerticale, searchTerm, sortBy]);

  // Stats
  const stats = useMemo(() => ({
    total: articles.length + videos.length + series.length + recos.length + histoires.length,
    articles: articles.length,
    videos: videos.length,
    series: series.length,
    recos: recos.length,
    histoires: histoires.length,
  }), [articles, videos, series, recos, histoires]);

  // Handle type change
  const handleTypeChange = (type: string) => {
    setActiveType(type);
    setActiveVerticale(null);
    const params = new URLSearchParams(searchParams);
    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    params.delete('categorie');
    setSearchParams(params);
  };

  // Handle verticale change
  const handleVerticaleChange = (slug: string | null) => {
    setActiveVerticale(slug);
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('categorie', slug);
    } else {
      params.delete('categorie');
    }
    setSearchParams(params);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Explorer - Origines Media"
        description="Explorez tous nos contenus : articles, vidéos, séries, recommandations et histoires inspirantes."
      />
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* ════════════════════════════════════════════════════════════ */}
        {/* HEADER */}
        {/* ════════════════════════════════════════════════════════════ */}
        <div className="bg-white border-b border-gray-100 pt-[104px]">
          <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Explorer
              </h1>
              <p className="text-gray-500">
                Tous nos contenus au même endroit
              </p>
            </div>

            {/* Search bar */}
            <div className="max-w-xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un contenu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {stats.total} contenus
              </span>
              <span>•</span>
              <span>{verticales.length} catégories</span>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* FILTERS */}
        {/* ════════════════════════════════════════════════════════════ */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            {/* Content Type Filters */}
            <div className="py-4 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 min-w-max">
                {CONTENT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isActive = activeType === type.id;
                  const count = type.id === 'all' ? stats.total :
                    type.id === 'article' ? stats.articles :
                    type.id === 'video' ? stats.videos :
                    type.id === 'serie' ? stats.series :
                    type.id === 'reco' ? stats.recos :
                    type.id === 'histoire' ? stats.histoires : 0;

                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeChange(type.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                        ${isActive
                          ? 'text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                      style={{
                        backgroundColor: isActive ? type.color : undefined,
                        boxShadow: isActive ? `0 4px 14px -3px ${type.color}50` : undefined,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{type.label}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}

                {/* Sort dropdown - Desktop */}
                <div className="hidden md:block ml-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile filter button */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="md:hidden ml-auto p-2 rounded-full bg-gray-100 text-gray-600"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filters (only show for content types that have categories) */}
            {activeType !== 'reco' && (
              <div className="pb-4 overflow-x-auto scrollbar-hide border-t border-gray-50 pt-3">
                <div className="flex items-center gap-2 min-w-max">
                  <button
                    onClick={() => handleVerticaleChange(null)}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                      ${!activeVerticale
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    Toutes catégories
                  </button>
                  {verticales.map((v) => {
                    const isActive = activeVerticale === v.slug.current;
                    return (
                      <button
                        key={v._id}
                        onClick={() => handleVerticaleChange(v.slug.current)}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                          ${isActive ? 'text-white' : 'text-gray-600 hover:opacity-80'}
                        `}
                        style={{
                          backgroundColor: isActive ? v.couleurDominante : `${v.couleurDominante}15`,
                          color: isActive ? 'white' : v.couleurDominante,
                          border: `1.5px solid ${v.couleurDominante}${isActive ? '' : '40'}`,
                        }}
                      >
                        {v.nom}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════ */}
        {/* CONTENT GRID */}
        {/* ════════════════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {allContent.length} résultat{allContent.length > 1 ? 's' : ''}
              {searchTerm && ` pour "${searchTerm}"`}
              {activeVerticale && ` dans ${verticales.find(v => v.slug.current === activeVerticale)?.nom}`}
            </p>
          </div>

          {/* Grid */}
          {allContent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {allContent.map((item, index) => (
                  <motion.div
                    key={`${item.contentType}-${item._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <ContentCard item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun résultat
              </h3>
              <p className="text-gray-500 mb-4">
                Essayez de modifier vos filtres ou votre recherche
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveType('all');
                  setActiveVerticale(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Filtres</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Trier par</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:border-gray-300"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-6 px-4 py-3 bg-gray-900 text-white font-semibold rounded-xl"
              >
                Appliquer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default BibliothequePage;
