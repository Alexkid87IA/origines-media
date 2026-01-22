// src/pages/ArticlesPage.tsx
// Page Articles : actualités, guides, interviews (contenus écrits)
// Style cohérent avec HistoiresPage

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Calendar,
  SlidersHorizontal,
  Newspaper
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { sanityFetch } from '../lib/sanity';
import { ARTICLES_PAGE_QUERY, VERTICALES_QUERY } from '../lib/queries';
import { typo } from '../lib/typography';

interface Tag {
  _id: string;
  nom: string;
  slug: string;
  couleur?: string;
}

interface Univers {
  _id: string;
  nom: string;
  couleur: string;
  slug: string;
}

interface Verticale {
  _id: string;
  nom: string;
  couleurDominante: string;
  slug: { current: string };
}

interface Article {
  _id: string;
  titre: string;
  typeArticle: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  imageUrl: string;
  slug: string;
  datePublication: string;
  tempsLecture?: number;
  tags?: Tag[];
  univers?: Univers;
  verticale?: { nom: string; couleurDominante: string; slug: string };
}

const ITEMS_PER_PAGE = 6;

// Labels pour les types d'articles (hors "article" standard qui est redondant)
const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  actu: { label: 'Actualité', color: '#DC2626' },
  guide: { label: 'Guide', color: '#7C3AED' },
  interview: { label: 'Interview', color: '#F59E0B' },
};

// Helper: récupère l'extrait avec fallback sur description ou contenu
const getExtrait = (article: Article): string => {
  if (article.extrait) return article.extrait;
  if (article.description) return article.description;
  if (article.contenuTexte) {
    const text = article.contenuTexte.substring(0, 120);
    return text.length === 120 ? text + '...' : text;
  }
  return '';
};

const ArticlesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [verticales, setVerticales] = useState<Verticale[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedVerticales, setExpandedVerticales] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // État des filtres depuis l'URL
  const searchQuery = searchParams.get('q') || '';
  const activeType = searchParams.get('type') || '';
  const activeVerticale = searchParams.get('verticale') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // État local pour le champ de recherche
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesData, verticalesData] = await Promise.all([
          sanityFetch<Article[]>(ARTICLES_PAGE_QUERY),
          sanityFetch<Verticale[]>(VERTICALES_QUERY)
        ]);
        setArticles(articlesData || []);
        setVerticales(verticalesData || []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Synchroniser le champ de recherche avec l'URL
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Compter les articles par type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(TYPE_LABELS).forEach(type => {
      counts[type] = articles.filter(a => a.typeArticle === type).length;
    });
    return counts;
  }, [articles]);

  // Compter les articles par verticale
  const verticaleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    verticales.forEach(v => {
      counts[v.slug.current] = articles.filter(a => a.verticale?.slug === v.slug.current).length;
    });
    return counts;
  }, [articles, verticales]);

  // Fonction de shuffle (Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filtrer les articles
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.titre.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query) ||
        a.univers?.nom?.toLowerCase().includes(query) ||
        a.verticale?.nom?.toLowerCase().includes(query) ||
        a.tags?.some(tag => tag.nom?.toLowerCase().includes(query))
      );
    }

    if (activeType) {
      result = result.filter(a => a.typeArticle === activeType);
    }

    if (activeVerticale) {
      // Si une verticale est sélectionnée, afficher tous ses articles
      result = result.filter(a => a.verticale?.slug === activeVerticale);
    } else {
      // Mode "Tous les articles" : 1 article par verticale, shufflé
      // Grouper par verticale
      const byVerticale: Record<string, Article[]> = {};
      result.forEach(article => {
        const vSlug = article.verticale?.slug || 'sans-verticale';
        if (!byVerticale[vSlug]) {
          byVerticale[vSlug] = [];
        }
        byVerticale[vSlug].push(article);
      });

      // Shuffler chaque groupe puis prendre un article de chaque
      const shuffledGroups = Object.values(byVerticale).map(group => shuffleArray(group));

      // Créer un pool d'articles diversifiés (1 par verticale à chaque tour)
      const diversified: Article[] = [];
      let hasMore = true;
      let roundIndex = 0;

      while (hasMore) {
        hasMore = false;
        for (const group of shuffledGroups) {
          if (group[roundIndex]) {
            diversified.push(group[roundIndex]);
            hasMore = true;
          }
        }
        roundIndex++;
      }

      result = diversified;
    }

    return result;
  }, [articles, searchQuery, activeType, activeVerticale]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set('q', searchInput);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleTypeClick = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (activeType === type) {
      params.delete('type');
    } else {
      params.set('type', type);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleVerticaleClick = (verticaleSlug: string) => {
    const params = new URLSearchParams(searchParams);
    if (activeVerticale === verticaleSlug) {
      params.delete('verticale');
    } else {
      params.set('verticale', verticaleSlug);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const hasActiveFilters = searchQuery || activeType || activeVerticale;

  // Couleur active - basée sur la verticale sélectionnée
  const activeColor = useMemo(() => {
    if (activeVerticale) {
      const v = verticales.find(v => v.slug.current === activeVerticale);
      if (v?.couleurDominante) return v.couleurDominante;
    }
    return '#111827'; // Gris foncé par défaut (neutre)
  }, [activeVerticale, verticales]);

  // Format de date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Navbar />
        <main className="pt-3 pb-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header skeleton */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-6 w-24 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="h-4 w-64 ml-11 rounded bg-gray-200 animate-pulse" />
            </div>

            <div className="flex gap-6 lg:gap-8">
              {/* Sidebar skeleton */}
              <aside className="hidden lg:block w-64 flex-shrink-0 space-y-5">
                <div className="h-10 rounded-xl bg-gray-200 animate-pulse" />
                <div className="bg-white rounded-2xl p-4 space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                  ))}
                </div>
              </aside>

              {/* Content skeleton */}
              <div className="flex-1">
                <SkeletonGrid count={6} columns={3} />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SEO
        title="Articles"
        description="Actualités, guides et interviews pour nourrir votre réflexion."
        url="/articles"
      />

      <Navbar />

      <main className="pt-3 pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="h-1 w-8 rounded-full"
                style={{ backgroundColor: activeColor }}
              />
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Articles
              </h1>
              <span className="text-gray-400 text-sm">
                {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-gray-500 text-[11px] lg:text-xs ml-11">
              Actualités, guides et interviews pour nourrir votre réflexion
            </p>
          </div>

          <div className="flex gap-6 lg:gap-8">

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SIDEBAR - Desktop - Sticky */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20 space-y-5">

                {/* Recherche */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-400"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        const params = new URLSearchParams(searchParams);
                        params.delete('q');
                        params.set('page', '1');
                        setSearchParams(params);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                {/* Types d'articles */}
                <div className="bg-white rounded-2xl ring-1 ring-gray-200/50 overflow-hidden" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Type de contenu
                    </h3>
                  </div>

                  <div className="p-2">
                    {/* Bouton Tous */}
                    <button
                      onClick={clearFilters}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                        ${!activeType && !activeVerticale
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <Newspaper className="w-4 h-4" />
                        <span className="font-medium">Tous les articles</span>
                      </div>
                      <span className={`text-xs ${!activeType && !activeVerticale ? 'text-white/60' : 'text-gray-400'}`}>
                        {articles.length}
                      </span>
                    </button>

                    {/* Types */}
                    {Object.entries(TYPE_LABELS).map(([type, { label, color }]) => {
                      const isActive = activeType === type;
                      const count = typeCounts[type] || 0;
                      if (count === 0) return null;

                      return (
                        <button
                          key={type}
                          onClick={() => handleTypeClick(type)}
                          className={`
                            w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 mt-1
                            ${isActive ? 'text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}
                          `}
                          style={{
                            backgroundColor: isActive ? color : undefined
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: isActive ? 'rgba(255,255,255,0.6)' : color
                              }}
                            />
                            <span className="font-medium">{label}</span>
                          </div>
                          <span className={`text-xs ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Verticales */}
                <div className="bg-white rounded-2xl ring-1 ring-gray-200/50 overflow-hidden" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Par catégorie
                    </h3>
                  </div>

                  <div className="p-2">
                    {verticales.filter(v => verticaleCounts[v.slug.current] > 0).map((verticale) => {
                      const isActive = activeVerticale === verticale.slug.current;
                      const count = verticaleCounts[verticale.slug.current] || 0;

                      return (
                        <button
                          key={verticale._id}
                          onClick={() => handleVerticaleClick(verticale.slug.current)}
                          className={`
                            w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 mt-0.5
                            ${isActive ? 'text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}
                          `}
                          style={{
                            backgroundColor: isActive ? verticale.couleurDominante : undefined
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: isActive ? 'rgba(255,255,255,0.6)' : verticale.couleurDominante
                              }}
                            />
                            <span className="font-medium">{verticale.nom}</span>
                          </div>
                          <span className={`text-xs ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Promo Académie - 9:16 */}
                <Link
                  to="/academie"
                  className="group block rounded-2xl overflow-hidden relative"
                  style={{ aspectRatio: '9/16' }}
                >
                  {/* Image de fond */}
                  <img
                    src="/academy/masterclass-storytelling.jpg"
                    alt="Académie Origines"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Contenu */}
                  <div className="relative z-10 flex flex-col justify-between h-full p-5">
                    {/* Badge */}
                    <span className="inline-block px-3 py-1.5 rounded-full bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider w-fit shadow-lg">
                      Nouveau
                    </span>

                    {/* Content en bas */}
                    <div>
                      <h3 className="text-white text-lg font-bold leading-tight mb-2 drop-shadow-lg">
                        L'Académie Origines
                      </h3>
                      <p className="text-white/90 text-xs leading-relaxed mb-4 drop-shadow">
                        Formations et masterclasses pour développer vos compétences.
                      </p>
                      <span className="inline-flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all">
                        Découvrir
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </aside>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CONTENU PRINCIPAL */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="flex-1 min-w-0">

              {/* Barre mobile */}
              <div className="lg:hidden flex items-center gap-2 mb-4">
                <form onSubmit={handleSearch} className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-300"
                  />
                </form>
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
                      {/* Types de contenu */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Type de contenu</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              !activeType && !activeVerticale ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Tous
                          </button>
                          {Object.entries(TYPE_LABELS).map(([type, { label, color }]) => (
                            <button
                              key={type}
                              onClick={() => { handleTypeClick(type); setShowMobileFilters(false); }}
                              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5"
                              style={{
                                backgroundColor: activeType === type ? color : `${color}15`,
                                color: activeType === type ? '#FFFFFF' : color
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: activeType === type ? 'rgba(255,255,255,0.6)' : color }}
                              />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Catégories */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Par catégorie</p>
                        <div className="flex flex-wrap gap-2">
                          {verticales.filter(v => verticaleCounts[v.slug.current] > 0).map((verticale) => (
                            <button
                              key={verticale._id}
                              onClick={() => { handleVerticaleClick(verticale.slug.current); setShowMobileFilters(false); }}
                              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5"
                              style={{
                                backgroundColor: activeVerticale === verticale.slug.current ? verticale.couleurDominante : `${verticale.couleurDominante}15`,
                                color: activeVerticale === verticale.slug.current ? '#FFFFFF' : verticale.couleurDominante
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: activeVerticale === verticale.slug.current ? 'rgba(255,255,255,0.6)' : verticale.couleurDominante }}
                              />
                              {verticale.nom}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filtres actifs */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-xs text-gray-500">Filtres :</span>
                  {activeType && TYPE_LABELS[activeType] && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: TYPE_LABELS[activeType].color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                      {TYPE_LABELS[activeType].label}
                      <button onClick={() => handleTypeClick(activeType)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {activeVerticale && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: verticales.find(v => v.slug.current === activeVerticale)?.couleurDominante || '#6366F1' }}
                    >
                      {verticales.find(v => v.slug.current === activeVerticale)?.nom}
                      <button onClick={() => handleVerticaleClick(activeVerticale)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                      "{searchQuery}"
                      <button onClick={clearFilters} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Grille d'articles */}
              {paginatedArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                    {paginatedArticles.map((article, index) => {
                      const typeInfo = TYPE_LABELS[article.typeArticle] || TYPE_LABELS.article;
                      const color = article.verticale?.couleurDominante || typeInfo.color;

                      return (
                        <motion.article
                          key={article._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="group"
                        >
                          <Link
                            to={`/article/${article.slug}`}
                            className="block"
                          >
                            {/* Version Mobile - 16:9 avec overlay */}
                            <div className="sm:hidden relative rounded-2xl overflow-hidden aspect-[16/9]">
                              <img
                                src={article.imageUrl || '/placeholder.svg'}
                                alt={article.titre}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              {/* Gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                              {/* Badge catégorie en haut */}
                              {article.verticale?.nom && (
                                <div className="absolute top-3 left-3">
                                  <span
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                                    style={{ backgroundColor: article.verticale.couleurDominante }}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                                    {article.verticale.nom}
                                  </span>
                                </div>
                              )}

                              {/* Contenu en bas */}
                              <div className="absolute inset-x-0 bottom-0 p-4">
                                <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-2">
                                  {typo(article.titre)}
                                </h3>
                                <p className="text-white/70 text-xs line-clamp-2 mb-3">
                                  {getExtrait(article)}
                                </p>
                                <span
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2 transition-all"
                                  style={{ color }}
                                >
                                  Lire l'article
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>

                            {/* Version Desktop - Card classique */}
                            <div
                              className="hidden sm:block rounded-2xl overflow-hidden bg-white ring-1 ring-gray-200/50 transition-all duration-300 group-hover:ring-2 group-hover:scale-[1.02]"
                              style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 30px -8px ${color}40, 0 0 0 2px ${color}`;
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px -4px rgba(0,0,0,0.08)';
                              }}
                            >
                              {/* Image */}
                              <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                  src={article.imageUrl || '/placeholder.svg'}
                                  alt={article.titre}
                                  loading="lazy"
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              </div>

                              {/* Contenu texte */}
                              <div className="p-4">
                                {/* Catégorie */}
                                {article.verticale?.nom && (
                                  <span
                                    className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                                    style={{ color: article.verticale.couleurDominante }}
                                  >
                                    {article.verticale.nom}
                                  </span>
                                )}

                                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors">
                                  {typo(article.titre)}
                                </h3>

                                <p className="text-gray-500 text-[11px] line-clamp-2 mb-3">
                                  {getExtrait(article)}
                                </p>

                                <div className="flex items-center justify-between">
                                  <span
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2 transition-all"
                                    style={{ color }}
                                  >
                                    Lire l'article
                                    <ArrowRight className="w-3 h-3" />
                                  </span>

                                  {article.datePublication && (
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(article.datePublication)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.article>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Précédent
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className="w-8 h-8 rounded-full text-sm font-medium transition-all"
                                style={{
                                  backgroundColor: page === currentPage ? activeColor : 'transparent',
                                  color: page === currentPage ? 'white' : '#6B7280',
                                }}
                              >
                                {page}
                              </button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="text-gray-400 text-sm px-1">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        Suivant
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl ring-1 ring-gray-200/50">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${activeColor}20` }}
                  >
                    <Search className="w-8 h-8" style={{ color: activeColor }} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Aucun article trouvé</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Essayez de modifier vos filtres'}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
                  >
                    Voir tous les articles
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlesPage;
