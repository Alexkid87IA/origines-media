// src/pages/HistoiresPage.tsx
// Design "Bibliothèque Émotionnelle" avec Sidebar
// Style cohérent avec HomePage/Navbar - Glassmorphism, pas d'emojis

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  Play,
  PenLine,
  ChevronDown,
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { sanityFetch } from '../lib/sanity';
import { HISTOIRES_PAGE_QUERY, TAGS_QUERY } from '../lib/queries';
import { typo } from '../lib/typography';
import { getUniversColors } from '../lib/universColors';
import {
  TAG_CATEGORIES,
  getOrderedCategories,
  countStoriesByCategory,
  filterStoriesByCategory,
  getCategoryColors,
  TagCategory
} from '../lib/tagCategories';

interface Tag {
  _id: string;
  nom: string;
  title?: string;
  slug: string;
  couleur?: string;
}

interface Univers {
  _id: string;
  nom: string;
  couleur: string;
  slug: string;
}

interface Histoire {
  _id: string;
  titre: string;
  categorie: string;
  accroche: string;
  imageUrl: string;
  slug: string;
  citation?: string;
  tags?: Tag[];
  univers?: Univers;
  articleSlug?: string;
}

const ITEMS_PER_PAGE = 12;

const HistoiresPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [histoires, setHistoires] = useState<Histoire[]>([]);
  const [cmsTags, setCmsTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // État des filtres depuis l'URL
  const searchQuery = searchParams.get('q') || '';
  const activeCategory = searchParams.get('categorie') || '';
  const activeTagSlug = searchParams.get('tag') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // État local pour le champ de recherche
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [histoiresData, tagsData] = await Promise.all([
          sanityFetch<Histoire[]>(HISTOIRES_PAGE_QUERY),
          sanityFetch<Tag[]>(TAGS_QUERY)
        ]);
        setHistoires(histoiresData || []);
        setCmsTags(tagsData || []);
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

  // Compter les histoires par catégorie
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    getOrderedCategories().forEach(cat => {
      counts[cat.id] = countStoriesByCategory(histoires, cat.id);
    });
    return counts;
  }, [histoires]);

  // Filtrer les histoires
  const filteredHistoires = useMemo(() => {
    let result = [...histoires];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(h =>
        h.titre.toLowerCase().includes(query) ||
        h.accroche?.toLowerCase().includes(query) ||
        h.categorie?.toLowerCase().includes(query) ||
        h.univers?.nom?.toLowerCase().includes(query) ||
        h.tags?.some(tag => tag.nom?.toLowerCase().includes(query))
      );
    }

    if (activeCategory) {
      result = filterStoriesByCategory(result, activeCategory);
    }

    if (activeTagSlug) {
      result = result.filter(h =>
        h.tags?.some(tag => tag.slug === activeTagSlug)
      );
    }

    return result;
  }, [histoires, searchQuery, activeCategory, activeTagSlug]);

  // Pagination
  const totalPages = Math.ceil(filteredHistoires.length / ITEMS_PER_PAGE);
  const paginatedHistoires = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHistoires.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHistoires, currentPage]);

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

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams);
    if (activeCategory === categoryId) {
      params.delete('categorie');
    } else {
      params.set('categorie', categoryId);
      params.delete('tag');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleTagClick = (tagSlug: string) => {
    const params = new URLSearchParams(searchParams);
    if (activeTagSlug === tagSlug) {
      params.delete('tag');
    } else {
      params.set('tag', tagSlug);
      params.delete('categorie');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
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
    setExpandedCategories([]);
  };

  const hasActiveFilters = searchQuery || activeCategory || activeTagSlug;

  // Couleurs actives
  const activeColors = useMemo(() => {
    if (activeCategory) {
      return getCategoryColors(activeCategory);
    }
    if (activeTagSlug) {
      const tag = cmsTags.find(t => t.slug === activeTagSlug);
      if (tag?.couleur) {
        return {
          bg: tag.couleur,
          text: '#FFFFFF',
          light: `${tag.couleur}20`,
          shadow: `${tag.couleur}40`
        };
      }
    }
    return { bg: '#8B5CF6', text: '#FFFFFF', light: '#8B5CF620', shadow: '#8B5CF640' };
  }, [activeCategory, activeTagSlug, cmsTags]);

  // Obtenir les tags d'une catégorie
  const getTagsForCategory = (category: TagCategory) => {
    return category.tags
      .map(slug => cmsTags.find(t => t.slug === slug))
      .filter((t): t is Tag => t !== undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-gray-400 text-lg">Chargement...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <SEO
        title="Histoires"
        description="Des récits singuliers qui inspirent, transforment et éclairent."
        url="/histoires"
      />

      <Navbar />

      <main className="pt-3 pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="h-1 w-8 rounded-full"
                style={{ backgroundColor: activeColors.bg }}
              />
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Histoires
              </h1>
              <span className="text-gray-400 text-sm">
                {filteredHistoires.length} récit{filteredHistoires.length > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-gray-500 text-[11px] lg:text-xs ml-11">
              Des parcours singuliers qui inspirent et transforment
            </p>
          </div>

          <div className="flex gap-6 lg:gap-8">

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SIDEBAR - Desktop */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-5">

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

                {/* Catégories thématiques */}
                <div className="bg-white rounded-2xl ring-1 ring-gray-200/50 overflow-hidden" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Explorer par thème
                    </h3>
                  </div>

                  <div className="p-2">
                    {/* Bouton Toutes */}
                    <button
                      onClick={clearFilters}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                        ${!activeCategory && !activeTagSlug
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-medium">Toutes les histoires</span>
                      </div>
                      <span className={`text-xs ${!activeCategory && !activeTagSlug ? 'text-white/60' : 'text-gray-400'}`}>
                        {histoires.length}
                      </span>
                    </button>

                    {/* Catégories */}
                    {getOrderedCategories().map((category) => {
                      const isActive = activeCategory === category.id;
                      const isExpanded = expandedCategories.includes(category.id);
                      const categoryTags = getTagsForCategory(category);

                      return (
                        <div key={category.id} className="mt-1">
                          <button
                            onClick={() => handleCategoryClick(category.id)}
                            className={`
                              w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                              ${isActive ? 'text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}
                            `}
                            style={{
                              backgroundColor: isActive ? category.couleur : undefined
                            }}
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor: isActive ? 'rgba(255,255,255,0.6)' : category.couleur
                                }}
                              />
                              <span className="font-medium">{category.nom}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                                {categoryCounts[category.id]}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCategoryExpansion(category.id);
                                }}
                                className={`p-0.5 rounded transition-colors ${isActive ? 'hover:bg-white/20' : 'hover:bg-gray-100'}`}
                              >
                                <ChevronDown
                                  className={`w-2.5 h-2.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                  style={{ color: isActive ? 'rgba(255,255,255,0.8)' : '#9CA3AF' }}
                                />
                              </button>
                            </div>
                          </button>

                          {/* Tags expandables */}
                          <AnimatePresence>
                            {isExpanded && categoryTags.length > 0 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-7 pr-2 py-1.5 space-y-0.5">
                                  {categoryTags.map(tag => {
                                    const isTagActive = activeTagSlug === tag.slug;
                                    return (
                                      <button
                                        key={tag._id}
                                        onClick={() => handleTagClick(tag.slug)}
                                        className={`
                                          w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150
                                          ${isTagActive
                                            ? 'font-semibold'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                          }
                                        `}
                                        style={{
                                          color: isTagActive ? (tag.couleur || category.couleur) : undefined,
                                          backgroundColor: isTagActive ? `${tag.couleur || category.couleur}12` : undefined
                                        }}
                                      >
                                        {tag.nom}
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Raconter */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white ring-1 ring-gray-200/50">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    Vous avez une histoire ?
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Partagez votre parcours et inspirez des milliers de lecteurs.
                  </p>
                  <Link
                    to="/racontez-votre-histoire"
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-900 border-2 border-gray-900 rounded-full transition-all hover:bg-gray-900 hover:text-white"
                  >
                    <PenLine className="w-3 h-3" />
                    Racontez la vôtre
                  </Link>
                </div>
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
                  Thèmes
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
                    <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            !activeCategory && !activeTagSlug ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          Toutes
                        </button>
                        {getOrderedCategories().map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => { handleCategoryClick(cat.id); setShowMobileFilters(false); }}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5"
                            style={{
                              backgroundColor: activeCategory === cat.id ? cat.couleur : `${cat.couleur}15`,
                              color: activeCategory === cat.id ? '#FFFFFF' : cat.couleur
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: activeCategory === cat.id ? 'rgba(255,255,255,0.6)' : cat.couleur }}
                            />
                            {cat.nom}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Filtres actifs */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-xs text-gray-500">Filtres :</span>
                  {activeCategory && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: TAG_CATEGORIES[activeCategory]?.couleur || '#6366F1' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                      {TAG_CATEGORIES[activeCategory]?.nom}
                      <button onClick={() => handleCategoryClick(activeCategory)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {activeTagSlug && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: cmsTags.find(t => t.slug === activeTagSlug)?.couleur || '#6366F1' }}
                    >
                      {cmsTags.find(t => t.slug === activeTagSlug)?.nom}
                      <button onClick={() => handleTagClick(activeTagSlug)} className="ml-1 hover:bg-white/20 rounded-full p-0.5">
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

              {/* Grille d'histoires */}
              {paginatedHistoires.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                    {paginatedHistoires.map((histoire, index) => {
                      const colors = histoire.univers?.couleur
                        ? {
                            bg: histoire.univers.couleur,
                            text: '#FFFFFF',
                            shadow: `${histoire.univers.couleur}40`
                          }
                        : getUniversColors(histoire.categorie);

                      const badgeLabel = histoire.univers?.nom || histoire.categorie;

                      return (
                        <motion.article
                          key={histoire._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="group"
                        >
                          <Link
                            to={histoire.articleSlug ? `/article/${histoire.articleSlug}` : `/histoire/${histoire.slug}`}
                            className="block"
                          >
                            <div
                              className="rounded-2xl overflow-hidden bg-white ring-1 ring-gray-200/50 transition-all duration-300 group-hover:ring-2 group-hover:scale-[1.02]"
                              style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 30px -8px ${colors.shadow}, 0 0 0 2px ${colors.bg}`;
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px -4px rgba(0,0,0,0.08)';
                              }}
                            >
                              {/* Image */}
                              <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                  src={histoire.imageUrl || '/placeholder.svg'}
                                  alt={histoire.titre}
                                  loading="lazy"
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Badge catégorie */}
                                {badgeLabel && (
                                  <div className="absolute top-3 left-3">
                                    <span
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg"
                                      style={{ backgroundColor: colors.bg, color: colors.text }}
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                                      {badgeLabel}
                                    </span>
                                  </div>
                                )}

                                {/* Play button */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-xl backdrop-blur-md bg-white/90">
                                    <Play className="w-4 h-4 ml-0.5 text-gray-900" fill="currentColor" />
                                  </div>
                                </div>
                              </div>

                              {/* Contenu texte */}
                              <div className="p-4">
                                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors">
                                  {typo(histoire.titre)}
                                </h3>

                                {histoire.accroche && (
                                  <p className="text-gray-500 text-[11px] line-clamp-2 mb-3">
                                    {histoire.accroche}
                                  </p>
                                )}

                                <span
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2 transition-all"
                                  style={{ color: colors.bg }}
                                >
                                  Lire l'histoire
                                  <ArrowRight className="w-3 h-3" />
                                </span>
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
                                  backgroundColor: page === currentPage ? activeColors.bg : 'transparent',
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
                    style={{ backgroundColor: activeColors.light }}
                  >
                    <Search className="w-8 h-8" style={{ color: activeColors.bg }} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Aucune histoire trouvée</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Essayez de modifier vos filtres'}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
                  >
                    Voir toutes les histoires
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {/* CTA mobile */}
              <div className="lg:hidden mt-8 p-4 rounded-2xl bg-white ring-1 ring-gray-200/50">
                <h3 className="font-bold text-gray-900 text-base mb-1">
                  Vous avez une histoire ?
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                  Partagez votre parcours et inspirez des milliers de lecteurs.
                </p>
                <Link
                  to="/racontez-votre-histoire"
                  className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-900 border-2 border-gray-900 rounded-full transition-all hover:bg-gray-900 hover:text-white"
                >
                  <PenLine className="w-4 h-4" />
                  Racontez la vôtre
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HistoiresPage;
