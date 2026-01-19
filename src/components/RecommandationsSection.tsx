// src/components/RecommandationsSection.tsx
// Section recommandations - Design épuré avec 5 recos + carte "Voir plus"

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, BookOpen, Film, Headphones, Youtube, Music,
  Share2, Heart, Sparkles, Dumbbell, MapPin, Palette,
  ShoppingBag, Loader2, Plus
} from 'lucide-react';
import { typo } from '../lib/typography';
import { sanityFetch } from '../lib/sanity';

// Configuration des catégories avec couleurs (synchronisé avec Sanity)
const categories = [
  { id: 'livres', name: 'Livres', icon: BookOpen, color: '#EC4899', gradient: 'from-pink-500 to-rose-600' },
  { id: 'films-series', name: 'Films & Séries', icon: Film, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-600' },
  { id: 'musique', name: 'Musique', icon: Music, color: '#6366F1', gradient: 'from-indigo-500 to-blue-600' },
  { id: 'podcasts', name: 'Podcasts', icon: Headphones, color: '#14B8A6', gradient: 'from-teal-500 to-emerald-600' },
  { id: 'reseaux-sociaux', name: 'Réseaux', icon: Share2, color: '#F59E0B', gradient: 'from-amber-500 to-orange-600' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#EF4444', gradient: 'from-red-500 to-rose-600' },
  { id: 'activite', name: 'Activité', icon: Dumbbell, color: '#10B981', gradient: 'from-emerald-500 to-green-600' },
  { id: 'destination', name: 'Voyage', icon: MapPin, color: '#0EA5E9', gradient: 'from-sky-500 to-blue-600' },
  { id: 'culture', name: 'Culture', icon: Palette, color: '#A855F7', gradient: 'from-purple-500 to-fuchsia-600' },
  { id: 'produit', name: 'Produits', icon: ShoppingBag, color: '#F59E0B', gradient: 'from-amber-500 to-yellow-600' },
];

// Query pour récupérer les recommandations depuis Sanity
const RECOS_FOR_HOME_QUERY = `
  *[_type == "recommendation"] | order(coupDeCoeur desc, datePublication desc) {
    _id,
    titre,
    type,
    auteur,
    note,
    coupDeCoeur,
    accroche,
    "slug": slug.current,
    "datePublication": coalesce(datePublication, _createdAt)
  }
`;

// Interface pour les données Sanity
interface SanityReco {
  _id: string;
  titre: string;
  type: string;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  slug: string;
  datePublication?: string;
}

// Composant carte de recommandation - Design compact
interface RecoCardProps {
  reco: SanityReco;
  index: number;
  category: typeof categories[0];
}

const RecoCard: React.FC<RecoCardProps> = ({ reco, index, category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="h-full"
    >
      <Link
        to={`/recommandation/${reco.slug}`}
        className="group block h-full"
      >
        <div className="relative h-full bg-white rounded-xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl border border-gray-100">
          {/* Header compact avec icône */}
          <div
            className="relative h-20 overflow-hidden flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${category.color}10 0%, ${category.color}20 100%)`
            }}
          >
            {/* Cercles décoratifs subtils */}
            <div
              className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-20"
              style={{ backgroundColor: category.color }}
            />

            {/* Icône */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm transition-transform duration-300 group-hover:scale-110"
              style={{ boxShadow: `0 4px 12px -4px ${category.color}40` }}
            >
              <category.icon
                className="w-5 h-5"
                style={{ color: category.color }}
              />
            </div>

            {/* Coup de coeur badge */}
            {reco.coupDeCoeur && (
              <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              </span>
            )}
          </div>

          {/* Contenu */}
          <div className="p-3">
            {/* Badge catégorie */}
            <span
              className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white mb-2"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>

            {/* Titre */}
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-gray-700 transition-colors min-h-[2.5rem]">
              {typo(reco.titre)}
            </h3>

            {/* Note si présente */}
            {reco.note && (
              <div className="flex items-center gap-1 mt-2">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-semibold text-amber-600">{reco.note}/5</span>
              </div>
            )}
          </div>

          {/* Barre de progression au hover */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-50">
            <div
              className="h-full w-0 group-hover:w-full transition-all duration-500"
              style={{ backgroundColor: category.color }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Carte "Voir plus"
interface SeeMoreCardProps {
  categoryColor: string;
  totalCount: number;
}

const SeeMoreCard: React.FC<SeeMoreCardProps> = ({ categoryColor, totalCount }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="h-full"
    >
      <Link
        to="/recommandations"
        className="group block h-full"
      >
        <div
          className="relative h-full rounded-xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed"
          style={{
            borderColor: `${categoryColor}40`,
            background: `linear-gradient(135deg, ${categoryColor}05 0%, ${categoryColor}10 100%)`
          }}
        >
          {/* Icône Plus */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor
            }}
          >
            <Plus className="w-6 h-6" />
          </div>

          {/* Texte */}
          <span
            className="text-sm font-bold mb-1"
            style={{ color: categoryColor }}
          >
            Voir plus
          </span>
          <span className="text-xs text-gray-400">
            {totalCount}+ recos
          </span>

          {/* Flèche animée */}
          <ArrowRight
            className="w-4 h-4 mt-2 transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: categoryColor }}
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default function RecommandationsSection() {
  const [recommendations, setRecommendations] = useState<SanityReco[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Fetch des données Sanity
  useEffect(() => {
    const fetchRecos = async () => {
      try {
        const data = await sanityFetch(RECOS_FOR_HOME_QUERY) as SanityReco[];
        setRecommendations(data || []);

        // Définir la première catégorie qui a des recos
        if (data && data.length > 0) {
          const firstType = data[0].type;
          setActiveCategory(firstType);
        }
      } catch (error) {
        console.error('Erreur fetch recommandations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecos();
  }, []);

  // Catégories qui ont des recommandations
  const availableCategories = categories.filter(cat =>
    recommendations.some(r => r.type === cat.id)
  );

  // Auto-rotation des catégories toutes les 6 secondes
  useEffect(() => {
    if (!isAutoRotating || availableCategories.length === 0) return;

    const interval = setInterval(() => {
      setActiveCategory(current => {
        const currentIndex = availableCategories.findIndex(c => c.id === current);
        const nextIndex = (currentIndex + 1) % availableCategories.length;
        return availableCategories[nextIndex].id;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoRotating, availableCategories]);

  // Filtrer les recommandations par catégorie active
  const filteredRecos = recommendations.filter(r => r.type === activeCategory);
  const activeConfig = categories.find(c => c.id === activeCategory) || categories[0];

  // Quand l'utilisateur clique, on arrête l'auto-rotation
  const handleCategoryClick = (categoryId: string) => {
    setIsAutoRotating(false);
    setActiveCategory(categoryId);
  };

  // État de chargement
  if (loading) {
    return (
      <section className="py-10 sm:py-12 lg:py-16 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
        </div>
      </section>
    );
  }

  // Pas de recommandations
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-gray-50/50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header simple */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-rose-300" />
            <Heart className="w-4 h-4 text-rose-400" />
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-rose-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Nos recommandations
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            {typo("Livres, films, podcasts... Les coups de cœur de notre équipe.")}
          </p>
        </div>

        {/* Catégories - Pills compacts sans chiffre */}
        {availableCategories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {availableCategories.map((category) => {
              const isActive = activeCategory === category.id;
              const Icon = category.icon;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-xs transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'bg-white text-gray-500 hover:text-gray-700 shadow-sm hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: isActive ? category.color : undefined,
                    boxShadow: isActive ? `0 4px 12px -2px ${category.color}50` : undefined,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{category.name}</span>

                  {/* Indicateur actif animé */}
                  {isActive && (
                    <motion.div
                      layoutId="recoActiveIndicator"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ backgroundColor: category.color }}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Grille : 5 recommandations + carte "Voir plus" */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
          >
            {/* 5 premières recommandations */}
            {filteredRecos.slice(0, 5).map((reco, index) => (
              <div
                key={reco._id}
                className={`${index >= 4 ? 'hidden sm:block' : ''} ${index >= 2 && index < 4 ? 'hidden sm:block' : ''}`}
              >
                <RecoCard reco={reco} index={index} category={activeConfig} />
              </div>
            ))}

            {/* Carte "Voir plus" */}
            <div className={filteredRecos.length <= 2 ? '' : 'hidden sm:block'}>
              <SeeMoreCard
                categoryColor={activeConfig.color}
                totalCount={recommendations.length}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile: Afficher 2 recos + voir plus */}
        <div className="sm:hidden mt-4">
          <Link
            to="/recommandations"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              backgroundColor: `${activeConfig.color}10`,
              color: activeConfig.color
            }}
          >
            <span>Voir toutes les recommandations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
