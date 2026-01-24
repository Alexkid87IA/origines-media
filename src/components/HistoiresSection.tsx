// src/components/HistoiresSection.tsx
// Section Histoires pour la homepage - Design textuel élégant sans images

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Quote, Heart, TrendingUp, Route, Users, Brain, Flame, LucideIcon } from 'lucide-react';
import { typo } from '../lib/typography';
import { sanityFetch } from '../lib/sanity';
import { TAG_CATEGORIES, getTagCategory, getOrderedCategories } from '../lib/tagCategories';

// Query pour récupérer toutes les histoires avec leurs tags
const HISTOIRES_HOME_QUERY = `
  *[_type == "portrait"] {
    _id,
    titre,
    accroche,
    "slug": slug.current,
    citation,
    tags[]-> {
      _id,
      nom,
      "slug": slug.current
    }
  }
`;

// Icônes par catégorie thématique
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  emotions: Heart,
  developpement: TrendingUp,
  parcours: Route,
  relations: Users,
  sante: Brain,
  epreuves: Flame
};

interface Tag {
  _id: string;
  nom: string;
  slug: string;
}

interface Histoire {
  _id: string;
  titre: string;
  accroche?: string;
  slug: string;
  citation?: string;
  tags?: Tag[];
  // Catégorie déterminée dynamiquement
  thematicCategory?: {
    id: string;
    nom: string;
    couleur: string;
  };
}

// Fonction shuffle (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Fonction pour déterminer la catégorie thématique d'une histoire basée sur ses tags
const getHistoireCategory = (histoire: Histoire): { id: string; nom: string; couleur: string } | undefined => {
  if (!histoire.tags || histoire.tags.length === 0) return undefined;

  for (const tag of histoire.tags) {
    const category = getTagCategory(tag.slug);
    if (category) {
      return {
        id: category.id,
        nom: category.nom,
        couleur: category.couleur
      };
    }
  }
  return undefined;
};

export default function HistoiresSection() {
  const [histoires, setHistoires] = useState<Histoire[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('tous');

  useEffect(() => {
    const fetchHistoires = async () => {
      try {
        const data = await sanityFetch(HISTOIRES_HOME_QUERY) as Histoire[];
        // Ajouter la catégorie thématique à chaque histoire
        const enrichedData = (data || []).map(h => ({
          ...h,
          thematicCategory: getHistoireCategory(h)
        }));
        // Shuffle les histoires pour avoir un ordre aléatoire à chaque chargement
        setHistoires(shuffleArray(enrichedData));
      } catch (error) {
        console.error('Erreur fetch histoires:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoires();
  }, []);

  // Catégories thématiques disponibles (celles qui ont des histoires)
  const availableCategories = useMemo(() => {
    const categories = getOrderedCategories();
    return categories.filter(cat =>
      histoires.some(h => h.thematicCategory?.id === cat.id)
    );
  }, [histoires]);

  // Filtrer par catégorie
  const filteredHistoires = useMemo(() => {
    const filtered = activeCategory === 'tous'
      ? histoires
      : histoires.filter(h => h.thematicCategory?.id === activeCategory);
    // Re-shuffle à chaque changement de filtre pour varier l'affichage
    return shuffleArray(filtered);
  }, [activeCategory, histoires]);

  if (loading) {
    return (
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <Loader2 className="w-6 h-6 text-fuchsia-500 animate-spin" />
        </div>
      </section>
    );
  }

  if (histoires.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header - même style que les autres sections */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-8 bg-fuchsia-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Témoignages</span>
            </div>
            <h2 className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Nos histoires
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {typo("Des parcours de vie authentiques et inspirants. Découvrez ces témoignages qui nous rappellent la force de l'humain face aux défis de l'existence.")}
            </p>
          </div>

          <Link
            to="/histoires"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
          >
            <span>Toutes les histoires</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filtres par catégorie - Style tabs avec animation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Bouton "Tous" */}
          <button
            onClick={() => setActiveCategory('tous')}
            className="relative inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
          >
            {activeCategory === 'tous' && (
              <motion.div
                layoutId="histoiresTabIndicator"
                className="absolute inset-0 bg-gray-900 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className={`relative z-10 ${activeCategory === 'tous' ? 'text-white' : 'text-gray-900'}`}>
              Tous
            </span>
            <ArrowRight className={`relative z-10 w-3 h-3 ${activeCategory === 'tous' ? 'text-white' : 'text-gray-900'}`} />
          </button>

          {/* Boutons par catégorie thématique */}
          {availableCategories.map(category => {
            const isActive = activeCategory === category.id;
            const Icon = CATEGORY_ICONS[category.id];
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
              >
                {isActive && (
                  <motion.div
                    layoutId="histoiresTabIndicator"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: category.couleur }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {Icon && (
                  <Icon
                    className="relative z-10 w-3 h-3 transition-colors duration-300"
                    style={{ color: isActive ? 'white' : category.couleur }}
                  />
                )}
                <span
                  className="relative z-10 transition-colors duration-300"
                  style={{ color: isActive ? 'white' : category.couleur }}
                >
                  {category.nom}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid des histoires - Design carte élégant */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {filteredHistoires.slice(0, 4).map((histoire, index) => {
              const category = histoire.thematicCategory;
              const categoryColor = category?.couleur || '#6366F1';
              const Icon = category ? CATEGORY_ICONS[category.id] : null;

              return (
                <motion.div
                  key={histoire._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/histoire/${histoire.slug}`}
                    className="group block h-full"
                  >
                    <div className="relative h-full bg-white rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl border border-gray-100 overflow-hidden">
                      {/* Décoration de fond */}
                      <div
                        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"
                        style={{ backgroundColor: categoryColor }}
                      />

                      {/* Header avec icône et badge */}
                      <div className="relative flex items-start justify-between mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, ${categoryColor}20 0%, ${categoryColor}10 100%)`,
                          }}
                        >
                          <Quote className="w-5 h-5" style={{ color: categoryColor }} />
                        </div>

                        {category && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm text-white"
                            style={{ backgroundColor: categoryColor }}
                          >
                            {Icon && <Icon className="w-3 h-3" />}
                            {category.nom}
                          </span>
                        )}
                      </div>

                      {/* Titre */}
                      <h3 className="relative text-gray-900 font-bold text-base leading-snug mb-3 group-hover:text-gray-700 transition-colors">
                        {typo(histoire.titre)}
                      </h3>

                      {/* Citation ou accroche */}
                      {(histoire.citation || histoire.accroche) && (
                        <p className="relative text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                          "{typo(histoire.citation || histoire.accroche || '')}"
                        </p>
                      )}

                      {/* CTA */}
                      <div className="relative flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-400">Témoignage</span>
                        <div
                          className="flex items-center gap-1.5 text-xs font-semibold"
                          style={{ color: categoryColor }}
                        >
                          <span>Lire</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Mobile: Bouton voir tout */}
        <div className="sm:hidden mt-4">
          <Link
            to="/histoires"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-100"
          >
            <span>Voir toutes les histoires</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
