// src/pages/BibliothequePage.tsx
// Page Explorer - Hub central de tous les contenus

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Grid3X3, FileText, Play, Heart, User,
  Clock, Eye, Star, BookOpen, ChevronDown, SlidersHorizontal,
  ArrowRight, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { sanityFetch } from '../lib/sanity';
import {
  EXPLORER_ARTICLES_QUERY,
  EXPLORER_VIDEOS_QUERY,
  EXPLORER_RECOS_QUERY,
  EXPLORER_HISTOIRES_QUERY,
  VERTICALES_QUERY
} from '../lib/queries';
import type {
  ExplorerArticle,
  ExplorerVideo,
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
  contentType: 'article' | 'video' | 'reco' | 'histoire';
  // Article specific
  typeArticle?: string;
  tempsLecture?: number;
  // Video specific
  duree?: number;
  vues?: number;
  videoUrl?: string;
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

const ITEMS_PER_PAGE = 9;
const MAX_HISTOIRES_PER_PAGE = 2;

// ============ HELPER FUNCTIONS ============

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Réorganise pour éviter 2 contenus de même verticale côte à côte
function distributeByVerticale(items: ContentItem[]): ContentItem[] {
  if (items.length <= 1) return items;

  const result: ContentItem[] = [];
  const remaining = [...items];

  while (remaining.length > 0) {
    const lastVerticale = result.length > 0 ? result[result.length - 1].verticale?.slug : null;

    // Cherche un item avec une verticale différente
    let foundIndex = remaining.findIndex(item => item.verticale?.slug !== lastVerticale);

    // Si pas trouvé, prend le premier disponible
    if (foundIndex === -1) foundIndex = 0;

    result.push(remaining[foundIndex]);
    remaining.splice(foundIndex, 1);
  }

  return result;
}

// Limite les histoires par page
function limitHistoiresPerPage(items: ContentItem[], itemsPerPage: number, maxHistoires: number): ContentItem[] {
  const result: ContentItem[] = [];
  let pageHistoireCount = 0;
  let currentPageIndex = 0;

  for (const item of items) {
    const pageIndex = Math.floor(result.length / itemsPerPage);

    // Nouvelle page, reset du compteur
    if (pageIndex > currentPageIndex) {
      currentPageIndex = pageIndex;
      pageHistoireCount = 0;
    }

    // Si c'est une histoire et qu'on a déjà atteint la limite pour cette page
    if (item.contentType === 'histoire') {
      if (pageHistoireCount >= maxHistoires) {
        // On la met à la fin pour les pages suivantes
        continue;
      }
      pageHistoireCount++;
    }

    result.push(item);
  }

  // Ajoute les histoires restantes à la fin
  const addedIds = new Set(result.map(r => r._id));
  for (const item of items) {
    if (!addedIds.has(item._id)) {
      result.push(item);
    }
  }

  return result;
}
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
    case 'reco':
      return `/recommandation/${item.slug}`;
    case 'histoire':
      return `/histoire/${item.slug}`;
    default:
      return `/article/${item.slug}`;
  }
}

// ============ CARD COMPONENT - Design unifié avec variante sans image ============

const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => {
  const color = item.verticale?.couleurDominante || CONTENT_TYPES.find(t => t.id === item.contentType)?.color || '#6B7280';
  const typeConfig = CONTENT_TYPES.find(t => t.id === item.contentType);
  const TypeIcon = typeConfig?.icon || FileText;

  // Détecte si l'image est valide (pas placeholder, pas vide, pas undefined)
  const hasValidImage = item.imageUrl &&
    !item.imageUrl.includes('placeholder') &&
    item.imageUrl.trim() !== '';

  // Label du type de contenu
  const getTypeLabel = () => {
    switch (item.contentType) {
      case 'article': return 'Article';
      case 'video': return 'Vidéo';
      case 'reco': return item.type || 'Reco';
      case 'histoire': return 'Histoire';
      default: return 'Contenu';
    }
  };

  // Info supplémentaire
  const getSubInfo = () => {
    if (item.contentType === 'video' && item.duree) return formatDuration(item.duree);
    if (item.contentType === 'article' && item.tempsLecture) return `${item.tempsLecture} min`;
    if (item.contentType === 'histoire') return item.categorie || '';
    if (item.contentType === 'reco' && item.auteur) return item.auteur;
    return '';
  };

  // ═══════════════════════════════════════════════════════════════
  // CARD SANS IMAGE - Design texte avec fond coloré
  // ═══════════════════════════════════════════════════════════════
  if (!hasValidImage) {
    return (
      <Link to={getContentLink(item)} className="group block">
        <div className="relative rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-100 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
          {/* Zone principale avec fond coloré */}
          <div
            className="relative aspect-video overflow-hidden p-4 flex flex-col justify-between"
            style={{
              background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
              borderLeft: `4px solid ${color}`,
            }}
          >
            {/* Motif décoratif subtil */}
            <div
              className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8"
              style={{ color }}
            >
              <TypeIcon className="w-full h-full" strokeWidth={0.5} />
            </div>

            {/* Header avec badges */}
            <div className="flex items-start justify-between gap-2 relative z-10">
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: typeConfig?.color || color }}
              >
                <TypeIcon className="w-3 h-3" />
                {getTypeLabel()}
              </span>

              {item.coupDeCoeur && (
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white flex items-center gap-1">
                  <Heart className="w-3 h-3" fill="currentColor" />
                </span>
              )}
            </div>

            {/* Titre et description */}
            <div className="relative z-10 mt-auto">
              <h3
                className="text-base font-bold line-clamp-2 mb-1 transition-colors leading-snug"
                style={{ color: color }}
              >
                {item.titre}
              </h3>
              {(item.description || item.accroche) && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {item.description || item.accroche}
                </p>
              )}
            </div>

            {/* Footer avec info et note */}
            <div className="flex items-center justify-between mt-2 relative z-10">
              {getSubInfo() && (
                <span className="text-[10px] font-medium text-gray-500">
                  {getSubInfo()}
                </span>
              )}
              {item.note && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-500">
                  <Star className="w-3 h-3" fill="currentColor" />
                  {item.note}/5
                </span>
              )}
              {item.verticale?.nom && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color
                  }}
                >
                  {item.verticale.nom}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // CARD AVEC IMAGE - Design standard 16:9
  // ═══════════════════════════════════════════════════════════════
  return (
    <Link to={getContentLink(item)} className="group block">
      <div className="relative rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        {/* Image 16:9 */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.titre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badge type en haut à gauche */}
          <div className="absolute top-2 left-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: typeConfig?.color || color }}
            >
              <TypeIcon className="w-3 h-3" />
              {getTypeLabel()}
            </span>
          </div>

          {/* Badge catégorie en haut à droite */}
          {item.verticale?.nom && (
            <div className="absolute top-2 right-2">
              <span
                className="px-2 py-1 rounded-full text-[10px] font-semibold text-white"
                style={{ backgroundColor: color }}
              >
                {item.verticale.nom}
              </span>
            </div>
          )}

          {/* Durée/Info en bas à droite */}
          {getSubInfo() && (
            <div className="absolute bottom-2 right-2">
              <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-black/70 text-white">
                {getSubInfo()}
              </span>
            </div>
          )}

          {/* Play button pour vidéos */}
          {item.contentType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Play className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" />
              </div>
            </div>
          )}

          {/* Coup de coeur pour recos */}
          {item.coupDeCoeur && (
            <div className="absolute bottom-2 left-2">
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white flex items-center gap-1">
                <Heart className="w-3 h-3" fill="currentColor" />
              </span>
            </div>
          )}

          {/* Note pour recos */}
          {item.note && !item.coupDeCoeur && (
            <div className="absolute bottom-2 left-2">
              <span className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                <Star className="w-3 h-3" fill="currentColor" />
                {item.note}/5
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors leading-snug">
            {item.titre}
          </h3>
          {item.contentType === 'reco' && item.auteur && (
            <p className="text-xs text-gray-500 mt-1">{item.auteur}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

// ============ MAIN COMPONENT ============
function BibliothequePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [activeType, setActiveType] = useState<string>(searchParams.get('type') || 'all');
  const [activeVerticale, setActiveVerticale] = useState<string | null>(searchParams.get('categorie') || null);
  const [sortBy, setSortBy] = useState(searchParams.get('tri') || 'recent');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Data states
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [recos, setRecos] = useState<ContentItem[]>([]);
  const [histoires, setHistoires] = useState<ContentItem[]>([]);
  const [verticales, setVerticales] = useState<Verticale[]>([]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesData, videosData, recosData, histoiresData, verticalesData] = await Promise.all([
          sanityFetch<ExplorerArticle[]>(EXPLORER_ARTICLES_QUERY),
          sanityFetch<ExplorerVideo[]>(EXPLORER_VIDEOS_QUERY),
          sanityFetch<ExplorerReco[]>(EXPLORER_RECOS_QUERY),
          sanityFetch<ExplorerHistoire[]>(EXPLORER_HISTOIRES_QUERY),
          sanityFetch<ExplorerVerticale[]>(VERTICALES_QUERY),
        ]);

        // Transform data with content type
        setArticles((articlesData || []).map((a) => ({ ...a, contentType: 'article' as const })));
        setVideos((videosData || []).map((v) => ({ ...v, contentType: 'video' as const })));
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
      content = [...articles, ...videos, ...recos, ...histoires];
    } else if (activeType === 'article') {
      content = [...articles];
    } else if (activeType === 'video') {
      content = [...videos];
    } else if (activeType === 'reco') {
      content = [...recos];
    } else if (activeType === 'histoire') {
      content = [...histoires];
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

    // Pour le mode "Tout" sans recherche ni filtre verticale, on applique le shuffle intelligent
    if (activeType === 'all' && !searchTerm && !activeVerticale && sortBy === 'recent') {
      // 1. Shuffle initial
      content = shuffleArray(content);
      // 2. Redistribue pour éviter 2 verticales consécutives
      content = distributeByVerticale(content);
      // 3. Limite les histoires à MAX par page
      content = limitHistoiresPerPage(content, ITEMS_PER_PAGE, MAX_HISTOIRES_PER_PAGE);
    }

    return content;
  }, [articles, videos, recos, histoires, activeType, activeVerticale, searchTerm, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(allContent.length / ITEMS_PER_PAGE);
  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allContent.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allContent, currentPage]);


  // Stats
  const stats = useMemo(() => ({
    total: articles.length + videos.length + recos.length + histoires.length,
    articles: articles.length,
    videos: videos.length,
    recos: recos.length,
    histoires: histoires.length,
  }), [articles, videos, recos, histoires]);

  // Handle type change
  const handleTypeChange = (type: string) => {
    setActiveType(type);
    setActiveVerticale(null);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (type === 'all') {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    params.delete('categorie');
    params.delete('page');
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
    params.delete('page');
    setSearchParams(params);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    const params = new URLSearchParams(searchParams);
    if (sort === 'recent') {
      params.delete('tri');
    } else {
      params.set('tri', sort);
    }
    params.delete('page');
    setSearchParams(params);
  };

  // Handle search change
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    params.delete('page');
    setSearchParams(params);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange('')}
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
                    type.id === 'reco' ? stats.recos :
                    type.id === 'histoire' ? stats.histoires : 0;

                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeChange(type.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
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
                    onChange={(e) => handleSortChange(e.target.value)}
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
              {allContent.length > ITEMS_PER_PAGE ? (
                <>
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, allContent.length)} sur {allContent.length} résultat{allContent.length > 1 ? 's' : ''}
                </>
              ) : (
                <>
                  {allContent.length} résultat{allContent.length > 1 ? 's' : ''}
                </>
              )}
              {searchTerm && ` pour "${searchTerm}"`}
              {activeVerticale && ` dans ${verticales.find(v => v.slug.current === activeVerticale)?.nom}`}
            </p>
          </div>

          {/* Grid */}
          {allContent.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {paginatedContent.map((item, index) => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`
                      flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Précédent</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first, last, current and adjacent pages
                      const showPage = page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1;

                      // Show ellipsis
                      const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                      const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`
                            w-10 h-10 rounded-full text-sm font-semibold transition-all
                            ${currentPage === page
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`
                      flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <span className="hidden sm:inline">Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Page info */}
              {totalPages > 1 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Page {currentPage} sur {totalPages}
                </p>
              )}
            </>
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
                  setSortBy('recent');
                  setCurrentPage(1);
                  setSearchParams(new URLSearchParams());
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
                    onChange={(e) => handleSortChange(e.target.value)}
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
