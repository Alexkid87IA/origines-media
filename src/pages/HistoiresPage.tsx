// src/pages/HistoiresPage.tsx
// Design "Text-First" - Citations et parcours inspirants
// Sans dépendance aux images de couverture

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowRight,
  PenLine,
  ChevronDown,
  SlidersHorizontal,
  BookOpen,
  Quote,
  Heart,
  TrendingUp,
  Route,
  Users,
  Brain,
  Flame,
  LucideIcon
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { sanityFetch } from '../lib/sanity';
import { HISTOIRES_PAGE_QUERY, TAGS_QUERY } from '../lib/queries';
import { typo } from '../lib/typography';
import {
  TAG_CATEGORIES,
  getOrderedCategories,
  countStoriesByCategory,
  filterStoriesByCategory,
  getCategoryColors,
  TagCategory,
  getTagCategory
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
  slug: string;
  citation?: string;
  tags?: Tag[];
  univers?: Univers;
}

// Icônes par catégorie thématique
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  emotions: Heart,
  developpement: TrendingUp,
  parcours: Route,
  relations: Users,
  sante: Brain,
  epreuves: Flame
};

const ITEMS_PER_PAGE = 6;

// Fonction pour mélanger les histoires avec diversité de catégories
const shuffleWithDiversity = (histoires: Histoire[]): Histoire[] => {
  if (histoires.length === 0) return [];

  // Grouper par catégorie thématique
  const byCategory: Record<string, Histoire[]> = {};
  const uncategorized: Histoire[] = [];

  histoires.forEach(h => {
    let foundCategory = false;
    if (h.tags && h.tags.length > 0) {
      for (const tag of h.tags) {
        const category = getTagCategory(tag.slug);
        if (category) {
          if (!byCategory[category.id]) {
            byCategory[category.id] = [];
          }
          byCategory[category.id].push(h);
          foundCategory = true;
          break;
        }
      }
    }
    if (!foundCategory) {
      uncategorized.push(h);
    }
  });

  // Mélanger chaque groupe
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  Object.keys(byCategory).forEach(key => {
    byCategory[key] = shuffleArray(byCategory[key]);
  });

  // Round-robin pour alterner les catégories
  const result: Histoire[] = [];
  const categoryKeys = shuffleArray(Object.keys(byCategory));
  const categoryIndices: Record<string, number> = {};
  categoryKeys.forEach(key => categoryIndices[key] = 0);

  let currentCategoryIdx = 0;
  const totalFromCategories = Object.values(byCategory).reduce((sum, arr) => sum + arr.length, 0);

  while (result.length < totalFromCategories) {
    const catKey = categoryKeys[currentCategoryIdx % categoryKeys.length];
    const catArray = byCategory[catKey];

    if (categoryIndices[catKey] < catArray.length) {
      result.push(catArray[categoryIndices[catKey]]);
      categoryIndices[catKey]++;
    }

    currentCategoryIdx++;

    // Éviter boucle infinie si une catégorie est vide
    let attempts = 0;
    while (
      categoryIndices[categoryKeys[currentCategoryIdx % categoryKeys.length]] >=
      byCategory[categoryKeys[currentCategoryIdx % categoryKeys.length]].length &&
      attempts < categoryKeys.length
    ) {
      currentCategoryIdx++;
      attempts++;
    }
  }

  // Ajouter les non-catégorisés à la fin (mélangés)
  return [...result, ...shuffleArray(uncategorized)];
};

// ═══════════════════════════════════════════════════════════════
// COMPOSANT: Carte Histoire Text-First
// ═══════════════════════════════════════════════════════════════
interface HistoireCardProps {
  histoire: Histoire;
  index: number;
  cmsTags: Tag[];
}

const HistoireCard: React.FC<HistoireCardProps> = ({ histoire, index, cmsTags }) => {
  // Trouver la catégorie thématique principale
  const mainCategory = useMemo(() => {
    if (!histoire.tags || histoire.tags.length === 0) return null;
    for (const tag of histoire.tags) {
      const category = getTagCategory(tag.slug);
      if (category) return category;
    }
    return null;
  }, [histoire.tags]);

  // Couleurs basées sur la catégorie ou l'univers
  const colors = useMemo(() => {
    if (mainCategory) {
      return getCategoryColors(mainCategory.id);
    }
    if (histoire.univers?.couleur) {
      return {
        bg: histoire.univers.couleur,
        text: '#FFFFFF',
        light: `${histoire.univers.couleur}15`,
        shadow: `${histoire.univers.couleur}40`
      };
    }
    return getCategoryColors('parcours'); // Default violet
  }, [mainCategory, histoire.univers]);

  const CategoryIcon = mainCategory ? CATEGORY_ICONS[mainCategory.id] : Route;
  const categoryLabel = mainCategory?.nom || histoire.univers?.nom || 'Parcours';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group"
    >
      <Link
        to={`/histoire/${histoire.slug}`}
        className="block h-full"
      >
        <div
          className="h-full rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1"
          style={{
            backgroundColor: colors.light,
            border: `1px solid ${colors.bg}20`,
            boxShadow: '0 2px 12px -4px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 30px -8px ${colors.shadow}`;
            (e.currentTarget as HTMLDivElement).style.borderColor = `${colors.bg}40`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px -4px rgba(0,0,0,0.04)';
            (e.currentTarget as HTMLDivElement).style.borderColor = `${colors.bg}20`;
          }}
        >
          {/* Header: Icône + Catégorie */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.bg }}
            >
              <CategoryIcon className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: colors.bg }}
            >
              {categoryLabel}
            </span>
          </div>

          {/* Citation (si disponible) */}
          {histoire.citation && (
            <div className="mb-4 relative">
              <Quote
                className="absolute -top-1 -left-1 w-6 h-6 opacity-20"
                style={{ color: colors.bg }}
              />
              <p
                className="text-sm italic leading-relaxed pl-5 line-clamp-3"
                style={{ color: colors.bg }}
              >
                {typo(histoire.citation)}
              </p>
            </div>
          )}

          {/* Titre */}
          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors">
            {typo(histoire.titre)}
          </h3>

          {/* Accroche */}
          {histoire.accroche && (
            <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-4">
              {typo(histoire.accroche)}
            </p>
          )}

          {/* Tags (max 3) */}
          {histoire.tags && histoire.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {histoire.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag._id}
                  className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-white/60 text-gray-600"
                >
                  {tag.nom}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2 transition-all mt-auto"
            style={{ color: colors.bg }}
          >
            Lire l'histoire
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPOSANT: Featured Histoire (plus grande)
// ═══════════════════════════════════════════════════════════════
interface FeaturedHistoireProps {
  histoire: Histoire;
  cmsTags: Tag[];
}

const FeaturedHistoire: React.FC<FeaturedHistoireProps> = ({ histoire, cmsTags }) => {
  const mainCategory = useMemo(() => {
    if (!histoire.tags || histoire.tags.length === 0) return null;
    for (const tag of histoire.tags) {
      const category = getTagCategory(tag.slug);
      if (category) return category;
    }
    return null;
  }, [histoire.tags]);

  const colors = useMemo(() => {
    if (mainCategory) {
      return getCategoryColors(mainCategory.id);
    }
    return getCategoryColors('parcours');
  }, [mainCategory]);

  const CategoryIcon = mainCategory ? CATEGORY_ICONS[mainCategory.id] : Route;

  return (
    <Link
      to={`/histoire/${histoire.slug}`}
      className="block group"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-6 lg:p-8 transition-all duration-300"
        style={{
          backgroundColor: colors.bg,
          boxShadow: `0 8px 32px -8px ${colors.shadow}`
        }}
      >
        {/* Decorative quote marks */}
        <div className="absolute top-4 right-4 opacity-10">
          <Quote className="w-24 h-24 text-white" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CategoryIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/80 text-xs font-bold uppercase tracking-wider">
              {mainCategory?.nom || 'À la une'}
            </span>
          </div>

          {/* Citation */}
          {histoire.citation && (
            <blockquote className="text-white/90 text-lg lg:text-xl italic leading-relaxed mb-6 max-w-2xl">
              "{typo(histoire.citation)}"
            </blockquote>
          )}

          {/* Titre */}
          <h2 className="text-white font-bold text-xl lg:text-2xl leading-tight mb-3 max-w-xl group-hover:text-white/90 transition-colors">
            {typo(histoire.titre)}
          </h2>

          {/* Accroche */}
          {histoire.accroche && (
            <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-6 max-w-xl">
              {typo(histoire.accroche)}
            </p>
          )}

          {/* CTA */}
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold group-hover:bg-white/30 transition-all">
            Découvrir cette histoire
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

// ═══════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════════
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
        console.log('🔄 Fetching histoires from Sanity...');
        console.log('📋 Query utilisée:', HISTOIRES_PAGE_QUERY);

        const [histoiresData, tagsData] = await Promise.all([
          sanityFetch<Histoire[]>(HISTOIRES_PAGE_QUERY),
          sanityFetch<Tag[]>(TAGS_QUERY)
        ]);

        console.log('✅ Histoires récupérées:', histoiresData?.length || 0);
        console.log('📋 Premiers résultats:', histoiresData?.slice(0, 3));
        console.log('🏷️ Tags récupérés:', tagsData?.length || 0);

        setHistoires(histoiresData || []);
        setCmsTags(tagsData || []);
      } catch (err) {
        console.error('❌ Erreur chargement histoires:', err);
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

  // Filtrer les histoires avec diversité
  const filteredHistoires = useMemo(() => {
    let result = [...histoires];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(h =>
        h.titre.toLowerCase().includes(query) ||
        h.accroche?.toLowerCase().includes(query) ||
        h.categorie?.toLowerCase().includes(query) ||
        h.citation?.toLowerCase().includes(query) ||
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

    // Appliquer le shuffle pour diversité visuelle (seulement si pas de filtre actif)
    if (!activeCategory && !activeTagSlug && !searchQuery) {
      result = shuffleWithDiversity(result);
    }

    return result;
  }, [histoires, searchQuery, activeCategory, activeTagSlug]);

  // Featured histoire (premier résultat avec citation)
  const featuredHistoire = useMemo(() => {
    if (!activeCategory && !activeTagSlug && !searchQuery) {
      return filteredHistoires.find(h => h.citation) || filteredHistoires[0];
    }
    return null;
  }, [filteredHistoires, activeCategory, activeTagSlug, searchQuery]);

  // Histoires pour la grille (sans le featured)
  const gridHistoires = useMemo(() => {
    if (featuredHistoire) {
      return filteredHistoires.filter(h => h._id !== featuredHistoire._id);
    }
    return filteredHistoires;
  }, [filteredHistoires, featuredHistoire]);

  // Pagination
  const totalPages = Math.ceil(gridHistoires.length / ITEMS_PER_PAGE);
  const paginatedHistoires = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return gridHistoires.slice(start, start + ITEMS_PER_PAGE);
  }, [gridHistoires, currentPage]);

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
        description="Des récits singuliers qui inspirent, transforment et éclairent. Découvrez des parcours authentiques et des témoignages qui résonnent."
        url="/histoires"
      />

      <Navbar />

      <main className="pt-3 pb-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* HERO SECTION */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="mb-8">
            {/* Header éditorial */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-1 w-8 rounded-full"
                  style={{ backgroundColor: activeColors.bg }}
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Parcours inspirants
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {activeCategory
                  ? TAG_CATEGORIES[activeCategory]?.nom || 'Histoires'
                  : 'Des histoires qui transforment'}
              </h1>
              <p className="text-gray-600 text-sm lg:text-base max-w-2xl">
                {typo("Chaque parcours est unique. Découvrez des témoignages authentiques, des récits de résilience et des expériences qui éclairent notre humanité commune.")}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{histoires.length}</span> histoires
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">6</span> thématiques
                  </span>
                </div>
              </div>
            </div>

            {/* Featured histoire */}
            {featuredHistoire && !hasActiveFilters && (
              <FeaturedHistoire histoire={featuredHistoire} cmsTags={cmsTags} />
            )}
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
                    placeholder="Rechercher une histoire..."
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

                    {/* Catégories avec icônes */}
                    {getOrderedCategories().map((category) => {
                      const isActive = activeCategory === category.id;
                      const isExpanded = expandedCategories.includes(category.id);
                      const categoryTags = getTagsForCategory(category);
                      const CategoryIcon = CATEGORY_ICONS[category.id] || BookOpen;

                      return (
                        <div key={category.id} className="mt-1">
                          <button
                            onClick={() => handleCategoryClick(category.id)}
                            className="relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors duration-200"
                          >
                            {isActive && (
                              <motion.div
                                layoutId="histoiresCategoryIndicator"
                                className="absolute inset-0 rounded-xl shadow-md"
                                style={{ backgroundColor: category.couleur }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                            <div className={`relative z-10 flex items-center gap-2.5 ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                              <CategoryIcon
                                className="w-4 h-4"
                                style={{
                                  color: isActive ? 'rgba(255,255,255,0.9)' : category.couleur
                                }}
                              />
                              <span className="font-medium">{category.nom}</span>
                            </div>
                            <div className="relative z-10 flex items-center gap-2">
                              <span className={`text-xs ${isActive ? 'text-white/60' : 'text-gray-400'}`}>
                                {categoryCounts[category.id]}
                              </span>
                              {categoryTags.length > 0 && (
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
                              )}
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
                <div
                  className="p-4 rounded-2xl ring-1 ring-gray-200/50"
                  style={{
                    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <PenLine className="w-4 h-4 text-violet-500" />
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Vous avez une histoire ?
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {typo("Partagez votre parcours et inspirez des milliers de lecteurs.")}
                  </p>
                  <Link
                    to="/racontez-votre-histoire"
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-violet-500 rounded-full transition-all hover:bg-violet-600"
                  >
                    Racontez la vôtre
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
                        {getOrderedCategories().map((cat) => {
                          const CatIcon = CATEGORY_ICONS[cat.id] || BookOpen;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => { handleCategoryClick(cat.id); setShowMobileFilters(false); }}
                              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5"
                              style={{
                                backgroundColor: activeCategory === cat.id ? cat.couleur : `${cat.couleur}15`,
                                color: activeCategory === cat.id ? '#FFFFFF' : cat.couleur
                              }}
                            >
                              <CatIcon className="w-3 h-3" />
                              {cat.nom}
                            </button>
                          );
                        })}
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
                      {React.createElement(CATEGORY_ICONS[activeCategory] || BookOpen, { className: 'w-3 h-3' })}
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

              {/* Compteur résultats */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  {gridHistoires.length} histoire{gridHistoires.length > 1 ? 's' : ''}
                  {hasActiveFilters && ' trouvée' + (gridHistoires.length > 1 ? 's' : '')}
                </span>
              </div>

              {/* Grille d'histoires */}
              {paginatedHistoires.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginatedHistoires.map((histoire, index) => (
                      <HistoireCard
                        key={histoire._id}
                        histoire={histoire}
                        index={index}
                        cmsTags={cmsTags}
                      />
                    ))}
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
                <div className="flex items-center gap-2 mb-2">
                  <PenLine className="w-4 h-4 text-violet-500" />
                  <h3 className="font-bold text-gray-900 text-base">
                    Vous avez une histoire ?
                  </h3>
                </div>
                <p className="text-gray-500 text-sm mb-3">
                  {typo("Partagez votre parcours et inspirez des milliers de lecteurs.")}
                </p>
                <Link
                  to="/racontez-votre-histoire"
                  className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-violet-500 rounded-full transition-all hover:bg-violet-600"
                >
                  Racontez la vôtre
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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
