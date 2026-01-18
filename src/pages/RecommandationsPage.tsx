// src/pages/RecommandationsPage.tsx
// Page des recommandations - Style Magazine Compact

import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Film, Headphones, ShoppingBag, Sparkles,
  ArrowRight, Calendar, Star, ChevronDown, ArrowUpRight, Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// Types de recommandations
const recommendationTypes = {
  all: { color: '#6366F1', label: 'Tout', icon: Sparkles },
  livre: { color: '#F59E0B', label: 'Livres', icon: BookOpen },
  film: { color: '#EF4444', label: 'Films', icon: Film },
  podcast: { color: '#8B5CF6', label: 'Podcasts', icon: Headphones },
  produit: { color: '#10B981', label: 'Produits', icon: ShoppingBag },
};

type RecommendationType = keyof typeof recommendationTypes;

interface Recommendation {
  id: string;
  type: Exclude<RecommendationType, 'all'>;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
  date: string;
  rating?: number;
  author?: string;
  readTime?: number;
}

// Données statiques
const allRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'livre',
    title: "La BD de l'année et nos coups de coeur littéraires",
    description: "Notre sélection littéraire de janvier avec des pépites pour tous les goûts.",
    imageUrl: '/placeholder.svg',
    slug: 'lectures-janvier-2026',
    date: '2026-01-15',
    rating: 5,
    author: 'Marie',
    readTime: 8,
  },
  {
    id: '2',
    type: 'film',
    title: "Les 10 films qui ont marqué 2025",
    description: "Retour sur les films qui nous ont fait vibrer cette année.",
    imageUrl: '/placeholder.svg',
    slug: 'films-2025',
    date: '2026-01-10',
    rating: 5,
    author: 'Thomas',
    readTime: 12,
  },
  {
    id: '3',
    type: 'podcast',
    title: "5 podcasts pour booster votre mindset",
    description: "Des conversations inspirantes pour bien commencer l'année.",
    imageUrl: '/placeholder.svg',
    slug: 'podcasts-mindset-2026',
    date: '2026-01-08',
    rating: 4,
    author: 'Sophie',
    readTime: 6,
  },
  {
    id: '4',
    type: 'produit',
    title: "Les essentiels bien-être de 2025",
    description: "Notre sélection de produits testés et approuvés.",
    imageUrl: '/placeholder.svg',
    slug: 'produits-bien-etre-2025',
    date: '2026-01-05',
    rating: 4,
    author: 'Emma',
    readTime: 5,
  },
  {
    id: '5',
    type: 'livre',
    title: "Romans feel-good pour l'hiver",
    description: "Des histoires douces et réconfortantes.",
    imageUrl: '/placeholder.svg',
    slug: 'romans-feel-good-hiver',
    date: '2025-12-20',
    rating: 5,
    author: 'Marie',
    readTime: 7,
  },
  {
    id: '6',
    type: 'film',
    title: "Séries à binger pendant les vacances",
    description: "Notre top des séries addictives.",
    imageUrl: '/placeholder.svg',
    slug: 'series-vacances',
    date: '2025-12-15',
    rating: 4,
    author: 'Thomas',
    readTime: 10,
  },
];

// Card Component avec accordion
const RecoCard: React.FC<{ reco: Recommendation; index: number }> = ({ reco, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const typeConfig = recommendationTypes[reco.type];
  const Icon = typeConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative group"
    >
      <div
        className={`rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
          isExpanded ? 'ring-2' : 'ring-1 hover:ring-2'
        } ring-gray-100`}
        style={{
          ringColor: isExpanded ? typeConfig.color : undefined,
          boxShadow: isExpanded
            ? `0 20px 40px -12px rgba(0,0,0,0.15), 0 0 0 2px ${typeConfig.color}`
            : '0 2px 12px -4px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header cliquable */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left"
        >
          <div className="relative p-2.5 lg:p-3 flex items-center gap-2.5">
            {/* Image thumbnail */}
            <motion.div
              className="relative flex-shrink-0"
              animate={{ scale: isExpanded ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  boxShadow: isExpanded ? `0 4px 12px -2px ${typeConfig.color}40` : '0 2px 8px -2px rgba(0,0,0,0.1)',
                  border: isExpanded ? `2px solid ${typeConfig.color}` : '2px solid transparent',
                }}
              >
                <img
                  src={reco.imageUrl}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Type badge */}
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: typeConfig.color }}
              >
                <Icon className="w-2.5 h-2.5 text-white" />
              </span>
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="text-[9px] font-bold uppercase tracking-wider"
                  style={{ color: typeConfig.color }}
                >
                  {typeConfig.label}
                </span>
                {reco.rating && (
                  <span className="flex items-center gap-0.5 text-[9px] text-amber-500">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    {reco.rating}/5
                  </span>
                )}
              </div>
              <h3 className="text-xs lg:text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
                {reco.title}
              </h3>
            </div>

            {/* Arrow */}
            <motion.div
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{
                backgroundColor: isExpanded ? `${typeConfig.color}15` : '#f3f4f6',
              }}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown
                className="w-3 h-3 transition-colors duration-300"
                style={{ color: isExpanded ? typeConfig.color : '#9ca3af' }}
                strokeWidth={2}
              />
            </motion.div>

            {/* Bordure gauche colorée */}
            <div
              className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: typeConfig.color,
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'scaleY(1)' : 'scaleY(0)',
              }}
            />
          </div>
        </button>

        {/* Dropdown Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-t border-gray-100"
            >
              <motion.div
                className="p-3 lg:p-4 bg-gray-50/50"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.05 }}
              >
                {/* Description */}
                <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
                  {reco.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                  <div className="flex items-center gap-3 text-[9px] font-medium text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(reco.date)}
                    </span>
                    {reco.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {reco.readTime} min
                      </span>
                    )}
                    {reco.author && (
                      <span>par {reco.author}</span>
                    )}
                  </div>

                  <Link
                    to={`/recommandation/${reco.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: typeConfig.color,
                      boxShadow: `0 2px 8px ${typeConfig.color}40`
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Lire
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function RecommandationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentType = (searchParams.get('type') || 'all') as RecommendationType;

  const filteredRecommendations = useMemo(() => {
    if (currentType === 'all') return allRecommendations;
    return allRecommendations.filter(r => r.type === currentType);
  }, [currentType]);

  const setFilter = (type: RecommendationType) => {
    if (type === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', type);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title="Recommandations"
        description="Nos coups de coeur : livres, films, podcasts et produits."
        url="/recommandations"
      />
      <Navbar />

      <main>
        {/* Hero - Style compact */}
        <section className="bg-gradient-to-br from-amber-50 via-white to-red-50/30 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-6 left-8 w-10 h-10 rounded-full bg-amber-400/15" />
          <div className="absolute top-1/3 right-10 w-6 h-6 rounded-full bg-red-400/20" />
          <div className="absolute bottom-6 left-1/4 w-8 h-8 rounded-full bg-violet-400/10" />
          <div className="absolute top-1/2 left-4 w-1.5 h-1.5 rounded-full bg-amber-500" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Badge */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-red-100 rounded-full text-gray-700 text-[8px] font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-2 h-2 text-amber-500" />
                  Nos coups de coeur
                </span>

                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Recommandations{' '}
                  <span className="bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
                    Origines
                  </span>
                </h1>

                <p className="text-gray-500 text-xs mt-1 max-w-sm">
                  Livres, films, podcasts et produits sélectionnés par l'équipe.
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 text-[10px]"
              >
                <div className="text-center px-3 py-2 bg-white rounded-lg ring-1 ring-gray-100 shadow-sm">
                  <p className="text-base font-bold text-gray-900">{allRecommendations.length}</p>
                  <p className="text-gray-500">recos</p>
                </div>
                <div className="text-center px-3 py-2 bg-white rounded-lg ring-1 ring-gray-100 shadow-sm">
                  <p className="text-base font-bold text-gray-900">4</p>
                  <p className="text-gray-500">catégories</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filters - Style pills compact */}
        <section className="py-4 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(recommendationTypes).map(([key, config]) => {
                const Icon = config.icon;
                const isActive = currentType === key;
                return (
                  <motion.button
                    key={key}
                    onClick={() => setFilter(key as RecommendationType)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="group rounded-full overflow-hidden transition-all duration-200"
                    style={{
                      border: `2px solid ${config.color}`,
                      backgroundColor: isActive ? config.color : 'transparent',
                      boxShadow: isActive ? `0 4px 12px -3px ${config.color}50` : 'none'
                    }}
                  >
                    <div className="px-3 py-1.5 flex items-center gap-1.5">
                      <Icon
                        className="w-3 h-3 transition-colors duration-200"
                        style={{ color: isActive ? 'white' : config.color }}
                      />
                      <span
                        className="text-[10px] font-semibold transition-colors duration-200"
                        style={{ color: isActive ? 'white' : config.color }}
                      >
                        {config.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-6 lg:py-8 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-6 bg-amber-500 rounded-full" />
                <span className="text-sm font-semibold text-gray-900">
                  {currentType === 'all' ? 'Toutes les recos' : recommendationTypes[currentType].label}
                </span>
              </div>
              <span className="text-[10px] text-gray-500">
                {filteredRecommendations.length} résultat{filteredRecommendations.length > 1 ? 's' : ''}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentType}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 gap-3"
              >
                {filteredRecommendations.map((reco, index) => (
                  <RecoCard key={reco.id} reco={reco} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty state */}
            {filteredRecommendations.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  Aucune recommandation
                </h3>
                <p className="text-[11px] text-gray-500 mb-4">
                  Pas encore de contenu dans cette catégorie.
                </p>
                <button
                  onClick={() => setFilter('all')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white text-[10px] font-semibold rounded-full hover:bg-amber-600 transition-colors"
                >
                  Voir tout
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
