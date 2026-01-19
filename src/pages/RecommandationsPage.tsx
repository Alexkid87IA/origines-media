// src/pages/RecommandationsPage.tsx
// Page des recommandations - Design éditorial avec sections et CTAs

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Film, Headphones, ShoppingBag, Music, Youtube, MapPin, Palette, Globe,
  ArrowRight, Star, ArrowUpRight, Loader2, Send, Heart, MessageCircle, AtSign,
  ChevronLeft, ChevronRight, Mail, SlidersHorizontal, X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { sanityFetch } from '../lib/sanity';
import { EXPLORER_RECOS_QUERY } from '../lib/queries';
import { typo } from '../lib/typography';

// Types de recommandations (clés = valeurs Sanity)
// Palette avec 10 couleurs bien distinctes
const recommendationTypes = {
  'livres': { color: '#E11D48', lightBg: '#FFF1F2', label: 'Livre', icon: BookOpen },           // Rose vif
  'films-series': { color: '#7C3AED', lightBg: '#F5F3FF', label: 'Film & Série', icon: Film },  // Violet
  'musique': { color: '#2563EB', lightBg: '#EFF6FF', label: 'Musique', icon: Music },           // Bleu
  'podcasts': { color: '#0D9488', lightBg: '#F0FDFA', label: 'Podcast', icon: Headphones },     // Teal
  'youtube': { color: '#DC2626', lightBg: '#FEF2F2', label: 'YouTube', icon: Youtube },         // Rouge
  'reseaux-sociaux': { color: '#0891B2', lightBg: '#ECFEFF', label: 'Social', icon: AtSign },   // Cyan
  'activite': { color: '#16A34A', lightBg: '#F0FDF4', label: 'Activité', icon: Globe },         // Vert
  'destination': { color: '#EA580C', lightBg: '#FFF7ED', label: 'Destination', icon: MapPin }, // Orange
  'culture': { color: '#9333EA', lightBg: '#FAF5FF', label: 'Culture', icon: Palette },         // Pourpre
  'produit': { color: '#CA8A04', lightBg: '#FEFCE8', label: 'Produit', icon: ShoppingBag },     // Or
};

type RecommendationType = keyof typeof recommendationTypes;

const ITEMS_PER_PAGE = 9;
const MAX_PER_TYPE_FIRST_PAGE = 2;

// Shuffle avec diversité : max 2 de chaque type par "page" de 9
const shuffleWithDiversity = (recos: Recommendation[]): Recommendation[] => {
  if (recos.length === 0) return [];

  // Grouper par type
  const byType: Record<string, Recommendation[]> = {};
  recos.forEach(reco => {
    if (!byType[reco.type]) byType[reco.type] = [];
    byType[reco.type].push(reco);
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

  Object.keys(byType).forEach(key => {
    byType[key] = shuffleArray(byType[key]);
  });

  // Construire le résultat avec max 2 par type par "page"
  const result: Recommendation[] = [];
  const typeIndices: Record<string, number> = {};
  const typeKeys = shuffleArray(Object.keys(byType));
  typeKeys.forEach(key => typeIndices[key] = 0);

  // Calculer combien de pages on aura
  const totalRecos = recos.length;
  const numPages = Math.ceil(totalRecos / ITEMS_PER_PAGE);

  for (let page = 0; page < numPages; page++) {
    const pageTypeCount: Record<string, number> = {};
    let addedThisPage = 0;
    let attempts = 0;
    const maxAttempts = typeKeys.length * ITEMS_PER_PAGE;

    while (addedThisPage < ITEMS_PER_PAGE && result.length < totalRecos && attempts < maxAttempts) {
      for (const typeKey of typeKeys) {
        if (addedThisPage >= ITEMS_PER_PAGE || result.length >= totalRecos) break;

        const typeCount = pageTypeCount[typeKey] || 0;
        if (typeCount >= MAX_PER_TYPE_FIRST_PAGE) continue;

        if (typeIndices[typeKey] < byType[typeKey].length) {
          result.push(byType[typeKey][typeIndices[typeKey]]);
          typeIndices[typeKey]++;
          pageTypeCount[typeKey] = typeCount + 1;
          addedThisPage++;
        }
      }
      attempts++;
    }

    // Si on n'a pas rempli la page, prendre ce qui reste
    if (addedThisPage < ITEMS_PER_PAGE && result.length < totalRecos) {
      for (const typeKey of typeKeys) {
        while (typeIndices[typeKey] < byType[typeKey].length && result.length < totalRecos && addedThisPage < ITEMS_PER_PAGE) {
          result.push(byType[typeKey][typeIndices[typeKey]]);
          typeIndices[typeKey]++;
          addedThisPage++;
        }
      }
    }
  }

  return result;
};

interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  slug: string;
  rating?: number;
  author?: string;
  coupDeCoeur?: boolean;
}

interface SanityReco {
  _id: string;
  titre: string;
  type?: string;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  slug?: string;
}

// Mapping des anciennes valeurs Sanity vers les nouvelles
const typeMapping: Record<string, RecommendationType> = {
  // Nouvelles valeurs (déjà correctes)
  'livres': 'livres',
  'films-series': 'films-series',
  'musique': 'musique',
  'podcasts': 'podcasts',
  'youtube': 'youtube',
  'reseaux-sociaux': 'reseaux-sociaux',
  'activite': 'activite',
  'destination': 'destination',
  'culture': 'culture',
  'produit': 'produit',
  // Anciennes valeurs (fallback)
  'livre': 'livres',
  'film': 'films-series',
  'podcast': 'podcasts',
};

const transformSanityReco = (reco: SanityReco): Recommendation => {
  // Mapper le type (supporte anciennes et nouvelles valeurs)
  const mappedType = reco.type ? typeMapping[reco.type] : undefined;
  const validType = mappedType || 'livres';

  return {
    id: reco._id,
    type: validType,
    title: reco.titre,
    description: reco.accroche || '',
    slug: reco.slug || reco._id,
    rating: reco.note,
    author: reco.auteur,
    coupDeCoeur: reco.coupDeCoeur,
  };
};

// ============ COMPOSANTS ============

// Card recommandation
const RecoCard: React.FC<{ reco: Recommendation; index: number }> = ({ reco, index }) => {
  const config = recommendationTypes[reco.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Link to={`/recommandation/${reco.slug}`} className="group block h-full">
        <div
          className="relative p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
          style={{ backgroundColor: config.lightBg }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: config.color }}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: config.color }}
              >
                {config.label}
              </span>
            </div>
            {reco.rating && (
              <div className="flex items-center gap-1 px-2 py-1 bg-white/80 rounded-full">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-bold text-gray-700">{reco.rating}/5</span>
              </div>
            )}
          </div>

          {/* Titre */}
          <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
            {typo(reco.title)}
          </h3>

          {/* Description */}
          {reco.description && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
              {typo(reco.description)}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-2">
            {reco.author ? (
              <span className="text-[10px] text-gray-400">par {reco.author}</span>
            ) : <span />}
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all"
              style={{ color: config.color }}
            >
              Voir <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>

          {/* Coup de coeur */}
          {reco.coupDeCoeur && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-red-500">
              <Heart className="w-2.5 h-2.5 text-white fill-white" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

// CTA Card
const CTACard: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  href: string;
  color: string;
  icon: React.ElementType;
}> = ({ title, description, buttonText, href, color, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative overflow-hidden rounded-2xl p-6"
    style={{ backgroundColor: `${color}08`, border: `1px solid ${color}20` }}
  >
    <div className="relative z-10">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <Link
        to={href}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
        style={{ backgroundColor: color }}
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
    {/* Decorative */}
    <div
      className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10"
      style={{ backgroundColor: color }}
    />
  </motion.div>
);

// Section catégorie
const CategorySection: React.FC<{
  type: RecommendationType;
  recommendations: Recommendation[];
  sectionIndex: number;
}> = ({ type, recommendations, sectionIndex }) => {
  const config = recommendationTypes[type];
  const Icon = config.icon;

  if (recommendations.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: sectionIndex * 0.05 }}
      className="mb-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: config.color }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{config.label}s</h2>
            <p className="text-xs text-gray-400">{recommendations.length} recommandation{recommendations.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="h-px flex-1 mx-4 bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((reco, idx) => (
          <RecoCard key={reco.id} reco={reco} index={idx} />
        ))}
      </div>
    </motion.section>
  );
};

// ============ PAGE PRINCIPALE ============

export default function RecommandationsPage() {
  const [allRecommendations, setAllRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<RecommendationType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchRecos = async () => {
      try {
        setLoading(true);
        const sanityRecos = await sanityFetch(EXPLORER_RECOS_QUERY) as SanityReco[];
        if (sanityRecos && sanityRecos.length > 0) {
          setAllRecommendations(sanityRecos.map(transformSanityReco));
        }
        setError(null);
      } catch (err) {
        console.error('Erreur chargement recommandations:', err);
        setError('Impossible de charger les recommandations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecos();
  }, []);

  // Grouper par type
  const recosByType = useMemo(() => {
    const grouped: Record<RecommendationType, Recommendation[]> = {
      'livres': [], 'films-series': [], 'musique': [], 'podcasts': [],
      'youtube': [], 'reseaux-sociaux': [], 'activite': [], 'destination': [],
      'culture': [], 'produit': [],
    };
    allRecommendations.forEach(reco => {
      if (grouped[reco.type]) grouped[reco.type].push(reco);
    });
    return grouped;
  }, [allRecommendations]);

  // Types disponibles (tous les types, même vides, pour afficher les filtres)
  const availableTypes = useMemo(() => {
    return Object.keys(recommendationTypes) as RecommendationType[];
  }, []);

  // Recommandations shufflées avec diversité
  const shuffledRecos = useMemo(() => {
    return shuffleWithDiversity(allRecommendations);
  }, [allRecommendations]);

  // Filtrer
  const filteredRecos = useMemo(() => {
    if (activeFilter === 'all') return shuffledRecos;
    return recosByType[activeFilter] || [];
  }, [activeFilter, shuffledRecos, recosByType]);

  // Pagination
  const totalPages = Math.ceil(filteredRecos.length / ITEMS_PER_PAGE);
  const paginatedRecos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecos, currentPage]);

  // Reset page quand filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stats
  const totalRecos = allRecommendations.length;
  const totalCategories = availableTypes.length;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Recommandations"
        description="Nos coups de coeur : livres, films, podcasts et produits sélectionnés par l'équipe Origines."
        url="/recommandations"
      />
      <Navbar />

      <main>
        {/* ============ HERO ============ */}
        <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Texte gauche */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1"
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  <Heart className="w-4 h-4 text-red-400" />
                  Nos sélections
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Ce qu'on a aimé, <br className="hidden sm:block" />
                  <span className="text-gray-400">ce qu'on vous conseille.</span>
                </h1>
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  Livres qui font réfléchir, films qui font vibrer, podcasts qui ouvrent l'esprit...
                  Voici tout ce que l'équipe Origines a adoré et veut partager avec vous.
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalRecos}</p>
                    <p className="text-xs text-gray-500">recommandations</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
                    <p className="text-xs text-gray-500">catégories</p>
                  </div>
                </div>
              </motion.div>

              {/* CTAs droite */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-3 lg:w-72"
              >
                <div className="group rounded-2xl bg-white border border-gray-200 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-100/50 transition-all overflow-hidden">
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 p-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center group-hover:bg-pink-500 transition-colors flex-shrink-0">
                      <Send className="w-5 h-5 text-pink-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">Une pépite à partager ?</p>
                      <p className="text-xs text-gray-500">Proposer une reco</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                  <div className="max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-300 ease-out">
                    <p className="px-4 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                      Un livre qui vous a marqué ? Un film inoubliable ? Partagez vos découvertes avec notre communauté.
                    </p>
                  </div>
                </div>

                <div className="group rounded-2xl bg-white border border-gray-200 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition-all overflow-hidden">
                  <Link
                    to="/newsletter"
                    className="flex items-center gap-3 p-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-500 transition-colors flex-shrink-0">
                      <Mail className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">Recevoir nos pépites</p>
                      <p className="text-xs text-gray-500">Newsletter mensuelle</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                  <div className="max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-300 ease-out">
                    <p className="px-4 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                      Chaque mois, recevez nos meilleures découvertes : livres, films, podcasts et plus encore. Zéro spam.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============ FILTRES ============ */}
        <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Mobile: Bouton filtres */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filtrer par catégorie</span>
                  {activeFilter !== 'all' && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: recommendationTypes[activeFilter].color }}
                    >
                      {recommendationTypes[activeFilter].label}
                    </span>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: showMobileFilters ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </motion.div>
              </button>

              {/* Mobile filters panel */}
              <AnimatePresence>
                {showMobileFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 pb-2 space-y-3">
                      {/* Bouton Tout */}
                      <button
                        onClick={() => {
                          setActiveFilter('all');
                          setShowMobileFilters(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                          activeFilter === 'all'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-medium">Tout voir</span>
                        <span className="text-sm opacity-70">{allRecommendations.length}</span>
                      </button>

                      {/* Categories */}
                      <div className="grid grid-cols-2 gap-2">
                        {availableTypes.map(type => {
                          const config = recommendationTypes[type];
                          const Icon = config.icon;
                          const isActive = activeFilter === type;
                          const count = recosByType[type]?.length || 0;
                          const isEmpty = count === 0;

                          return (
                            <button
                              key={type}
                              onClick={() => {
                                if (!isEmpty) {
                                  setActiveFilter(type);
                                  setShowMobileFilters(false);
                                }
                              }}
                              disabled={isEmpty}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all ${
                                isEmpty ? 'opacity-40 cursor-not-allowed' : ''
                              }`}
                              style={{
                                backgroundColor: isActive ? config.color : config.lightBg,
                                color: isActive ? 'white' : config.color,
                              }}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="text-sm font-medium truncate">{config.label}</span>
                              {count > 0 && (
                                <span className={`text-xs ml-auto ${isActive ? 'opacity-70' : 'opacity-60'}`}>
                                  {count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop: Filtres en ligne */}
            <div className="hidden lg:flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className="relative px-5 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                {activeFilter === 'all' && (
                  <motion.div
                    layoutId="recoPageFilterIndicator"
                    className="absolute inset-0 rounded-full bg-gray-900 shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 ${activeFilter === 'all' ? 'text-white' : 'text-gray-600'}`}>
                  Tout
                </span>
              </button>
              {availableTypes.map(type => {
                const config = recommendationTypes[type];
                const Icon = config.icon;
                const isActive = activeFilter === type;
                const count = recosByType[type]?.length || 0;
                const isEmpty = count === 0;
                return (
                  <button
                    key={type}
                    onClick={() => !isEmpty && setActiveFilter(type)}
                    className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${isEmpty ? 'opacity-40 cursor-default' : ''}`}
                    style={{
                      backgroundColor: !isActive ? config.lightBg : undefined,
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="recoPageFilterIndicator"
                        className="absolute inset-0 rounded-full"
                        style={{
                          backgroundColor: config.color,
                          boxShadow: `0 4px 12px -2px ${config.color}50`
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className={`relative z-10 w-4 h-4 ${isActive ? 'text-white' : ''}`} style={{ color: isActive ? undefined : config.color }} />
                    <span className="relative z-10" style={{ color: isActive ? 'white' : config.color }}>
                      {config.label}
                    </span>
                    {count > 0 && (
                      <span className={`relative z-10 text-xs ${isActive ? 'text-white/70' : ''}`} style={{ color: isActive ? undefined : config.color, opacity: isActive ? undefined : 0.7 }}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ CONTENT ============ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin mb-3" />
            <p className="text-sm text-gray-500">Chargement...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-500">{error}</p>
          </div>
        )}

        {!loading && !error && allRecommendations.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Compteur */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-500">
                {filteredRecos.length} recommandation{filteredRecos.length > 1 ? 's' : ''}
                {activeFilter !== 'all' && ` de type ${recommendationTypes[activeFilter].label}`}
              </span>
              {totalPages > 1 && (
                <span className="text-sm text-gray-400">
                  Page {currentPage} sur {totalPages}
                </span>
              )}
            </div>

            {/* Grille de recommandations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {paginatedRecos.map((reco, idx) => (
                <RecoCard key={reco.id} reco={reco} index={idx} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-gray-100">
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
                            backgroundColor: page === currentPage ? '#8B5CF6' : 'transparent',
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

          </div>
        )}

        {/* Empty */}
        {!loading && !error && allRecommendations.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">Aucune recommandation pour le moment.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
