// src/components/RecommandationsSection.tsx
// Section recommandations - Design Premium avec données Sanity

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Film, Headphones, Youtube, Music, Share2, Heart, Sparkles, Dumbbell, MapPin, Palette, ShoppingBag, Loader2 } from 'lucide-react';
import { typo } from '../lib/typography';
import { sanityFetch } from '../lib/sanity';

// Configuration des catégories avec couleurs (synchronisé avec Sanity)
const categories = [
  { id: 'livres', name: 'Livres', icon: BookOpen, color: '#EC4899', gradient: 'from-pink-500 to-rose-600' },
  { id: 'films-series', name: 'Films & Séries', icon: Film, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-600' },
  { id: 'musique', name: 'Musique', icon: Music, color: '#6366F1', gradient: 'from-indigo-500 to-blue-600' },
  { id: 'podcasts', name: 'Podcasts', icon: Headphones, color: '#14B8A6', gradient: 'from-teal-500 to-emerald-600' },
  { id: 'reseaux-sociaux', name: 'Réseaux sociaux', icon: Share2, color: '#F59E0B', gradient: 'from-amber-500 to-orange-600' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#EF4444', gradient: 'from-red-500 to-rose-600' },
  { id: 'activite', name: 'Activité', icon: Dumbbell, color: '#10B981', gradient: 'from-emerald-500 to-green-600' },
  { id: 'destination', name: 'Destination', icon: MapPin, color: '#0EA5E9', gradient: 'from-sky-500 to-blue-600' },
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

// Composant carte de recommandation - Design Magazine Premium
interface RecoCardProps {
  reco: SanityReco;
  index: number;
  category: typeof categories[0];
}

const RecoCard: React.FC<RecoCardProps> = ({ reco, index, category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        to={`/recommandation/${reco.slug}`}
        className="group block h-full"
      >
        <div
          className="relative h-full bg-white rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl"
          style={{
            boxShadow: `0 4px 24px -8px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)`
          }}
        >
          {/* Header visuel avec gradient */}
          <div
            className="relative h-24 sm:h-28 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}30 50%, ${category.color}15 100%)`
            }}
          >
            {/* Pattern décoratif */}
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full"
                style={{ backgroundColor: category.color, opacity: 0.2 }}
              />
              <div
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full"
                style={{ backgroundColor: category.color, opacity: 0.15 }}
              />
            </div>

            {/* Icône centrale grande */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:shadow-xl"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    boxShadow: `0 8px 32px -8px ${category.color}50`
                  }}
                >
                  <category.icon
                    className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300"
                    style={{ color: category.color }}
                  />
                </div>
                {/* Glow effect */}
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ backgroundColor: category.color }}
                />
              </motion.div>
            </div>

            {/* Badge catégorie en haut à droite */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              {reco.coupDeCoeur && (
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm shadow-md">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                </span>
              )}
              <span
                className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white shadow-md"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            </div>

            {/* Note en bas à gauche si présente */}
            {reco.note && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-bold text-amber-600">{reco.note}/5</span>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="p-4 sm:p-5">
            {/* Titre */}
            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2 leading-snug">
              {typo(reco.titre)}
            </h3>

            {/* Description / Accroche */}
            {reco.accroche && (
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                {typo(reco.accroche)}
              </p>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 group-hover:gap-2"
                style={{ color: category.color }}
              >
                Découvrir
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>

              {reco.auteur && (
                <span className="text-[10px] text-gray-400 truncate max-w-[100px]">
                  {reco.auteur}
                </span>
              )}
            </div>
          </div>

          {/* Barre de progression colorée en bas */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
            <div
              className="h-full w-0 group-hover:w-full transition-all duration-700 ease-out"
              style={{ backgroundColor: category.color }}
            />
          </div>
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

  // Auto-rotation des catégories toutes les 5 secondes
  useEffect(() => {
    if (!isAutoRotating || availableCategories.length === 0) return;

    const interval = setInterval(() => {
      setActiveCategory(current => {
        const currentIndex = availableCategories.findIndex(c => c.id === current);
        const nextIndex = (currentIndex + 1) % availableCategories.length;
        return availableCategories[nextIndex].id;
      });
    }, 5000);

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
      <section className="py-8 sm:py-10 lg:py-14 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        </div>
      </section>
    );
  }

  // Pas de recommandations
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-10 lg:py-14 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-5 mb-8 sm:mb-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Coups de cœur</span>
            </div>
            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Nos recommandations
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {typo("Livres, films, podcasts, séries... Notre équipe partage ses découvertes culturelles. Des recommandations sincères pour nourrir votre curiosité.")}
            </p>
          </div>

          <Link
            to="/recommandations"
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 transition-all duration-300 self-start lg:self-center flex-shrink-0 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5"
          >
            <span>Toutes les recos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Catégories - Pills premium (uniquement celles avec des recos) */}
        {availableCategories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
            {availableCategories.map((category) => {
              const isActive = activeCategory === category.id;
              const Icon = category.icon;
              const count = recommendations.filter(r => r.type === category.id).length;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`group relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-600 hover:text-gray-900 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                  style={{
                    backgroundColor: isActive ? category.color : undefined,
                    boxShadow: isActive ? `0 10px 30px -5px ${category.color}50` : undefined,
                  }}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                  <span>{category.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {count}
                  </span>

                  {/* Indicateur actif animé */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ backgroundColor: category.color }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Grille de recommandations avec animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredRecos.slice(0, 6).map((reco, index) => (
              <div key={reco._id} className={index >= 2 ? 'hidden sm:block' : ''}>
                <RecoCard reco={reco} index={index} category={activeConfig} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer stats premium */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 sm:mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-6 sm:gap-8">
            <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100">
                <Sparkles className="w-3 h-3 text-rose-500" />
              </span>
              {recommendations.length}+ recommandations
            </span>
            <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100">
                <Heart className="w-3 h-3 text-rose-500" />
              </span>
              Testées et approuvées
            </span>
          </div>

          <Link
            to="/recommandations"
            className="text-sm font-semibold text-gray-600 hover:text-rose-500 transition-colors flex items-center gap-1.5 group"
          >
            Tout découvrir
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
