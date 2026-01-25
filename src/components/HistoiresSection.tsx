// src/components/HistoiresSection.tsx
// Section Histoires pour la homepage - Layout 2 colonnes avec image catégorie 16:9

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

// Images 16:9 par catégorie
const CATEGORY_IMAGES: Record<string, string> = {
  emotions: '/histoires/histoire_emotions_bienetre.png',
  developpement: '/histoires/histoire_developpement.png',
  parcours: '/histoires/histoire_parcours_resilience.png',
  relations: '/histoires/histoire_relations_famille.png',
  sante: '/histoires/histoire_sante_mentale.png',
  epreuves: '/histoires/histoire_epreuves_inspiration.png'
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

// Composant image de catégorie (gauche)
interface CategoryImageProps {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  count: number;
}

const CategoryImage: React.FC<CategoryImageProps> = ({ categoryId, categoryName, categoryColor, count }) => {
  const Icon = CATEGORY_ICONS[categoryId];
  const imageUrl = CATEGORY_IMAGES[categoryId];

  return (
    <div className="relative">
      {/* Image - pas de conteneur avec overflow, juste l'image */}
      <img
        src={imageUrl}
        alt={categoryName}
        className="w-full rounded-2xl"
        style={{ display: 'block' }}
      />

      {/* Overlay gradient doux */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)'
        }}
      />

      {/* Badge glassmorphisme en bas */}
      <div className="absolute bottom-4 left-4 right-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: categoryColor }}
          >
            {Icon && <Icon className="w-4 h-4 text-white" />}
          </span>
          <div>
            <p className="text-white font-semibold text-sm">{categoryName}</p>
            <p className="text-white/70 text-xs">{count} témoignages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant carte histoire textuelle (droite)
interface HistoireCardProps {
  histoire: Histoire;
  index: number;
}

const HistoireCard: React.FC<HistoireCardProps> = ({ histoire, index }) => {
  const category = histoire.thematicCategory;
  const categoryColor = category?.couleur || '#6366F1';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <Link
        to={`/histoire/${histoire.slug}`}
        className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
        style={{
          backgroundColor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
        }}
      >
        {/* Icône quote avec couleur */}
        <div
          className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundColor: `${categoryColor}15`,
            boxShadow: `0 4px 12px ${categoryColor}20`
          }}
        >
          <Quote className="w-4 h-4" style={{ color: categoryColor }} />
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors">
            {typo(histoire.titre)}
          </h4>
          {(histoire.citation || histoire.accroche) && (
            <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">
              {typo(histoire.citation || histoire.accroche || '')}
            </p>
          )}
        </div>

        {/* Flèche */}
        <div
          className="w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ backgroundColor: `${categoryColor}15` }}
        >
          <ArrowRight className="w-3.5 h-3.5" style={{ color: categoryColor }} />
        </div>
      </Link>
    </motion.div>
  );
};

export default function HistoiresSection() {
  const [histoires, setHistoires] = useState<Histoire[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    const fetchHistoires = async () => {
      try {
        const data = await sanityFetch(HISTOIRES_HOME_QUERY) as Histoire[];
        const enrichedData = (data || []).map(h => ({
          ...h,
          thematicCategory: getHistoireCategory(h)
        }));
        setHistoires(shuffleArray(enrichedData));

        // Sélectionner automatiquement la première catégorie disponible
        const categories = getOrderedCategories();
        const firstAvailable = categories.find(cat =>
          enrichedData.some(h => h.thematicCategory?.id === cat.id)
        );
        if (firstAvailable) {
          setActiveCategory(firstAvailable.id);
        }
      } catch (error) {
        console.error('Erreur fetch histoires:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoires();
  }, []);

  // Catégories disponibles
  const availableCategories = useMemo(() => {
    const categories = getOrderedCategories();
    return categories.filter(cat =>
      histoires.some(h => h.thematicCategory?.id === cat.id)
    );
  }, [histoires]);

  // Rotation automatique des catégories toutes les 3 secondes
  useEffect(() => {
    if (!isAutoRotating || availableCategories.length <= 1) return;

    const interval = setInterval(() => {
      setActiveCategory(current => {
        const currentIndex = availableCategories.findIndex(c => c.id === current);
        const nextIndex = (currentIndex + 1) % availableCategories.length;
        return availableCategories[nextIndex].id;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoRotating, availableCategories]);

  // Arrêter la rotation quand l'utilisateur clique sur une catégorie
  const handleCategoryClick = (categoryId: string) => {
    setIsAutoRotating(false);
    setActiveCategory(categoryId);
  };

  // Filtrer par catégorie
  const filteredHistoires = useMemo(() => {
    if (!activeCategory) return [];
    const filtered = histoires.filter(h => h.thematicCategory?.id === activeCategory);
    return shuffleArray(filtered);
  }, [activeCategory, histoires]);

  // Config de la catégorie active
  const activeConfig = useMemo(() => {
    if (!activeCategory) return { id: '', nom: '', couleur: '#EC4899' };
    const cat = TAG_CATEGORIES[activeCategory];
    return cat ? { id: cat.id, nom: cat.nom, couleur: cat.couleur } : { id: '', nom: '', couleur: '#EC4899' };
  }, [activeCategory]);

  if (loading) {
    return (
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <Loader2 className="w-6 h-6 text-fuchsia-500 animate-spin" />
        </div>
      </section>
    );
  }

  if (histoires.length === 0 || !activeCategory) {
    return null;
  }

  const sideHistoires = filteredHistoires.slice(0, 4);

  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-8 bg-fuchsia-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Découvrir</span>
            </div>
            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Nos histoires
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
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

        {/* Filtres par catégorie avec animation layoutId */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {availableCategories.map(category => {
            const isActive = activeCategory === category.id;
            const count = histoires.filter(h => h.thematicCategory?.id === category.id).length;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
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
                <span
                  className="relative z-10 transition-colors duration-300"
                  style={{ color: isActive ? 'white' : '#6B7280' }}
                >
                  {category.nom}
                </span>
                <span
                  className="relative z-10 text-[10px] px-1.5 py-0.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${category.couleur}15`,
                    color: isActive ? 'white' : category.couleur,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Layout: Image catégorie 16:9 + 3 cartes histoires */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start"
          >
            {/* Colonne gauche: Image de la catégorie */}
            <div>
              <CategoryImage
                categoryId={activeConfig.id}
                categoryName={activeConfig.nom}
                categoryColor={activeConfig.couleur}
                count={filteredHistoires.length}
              />
            </div>

            {/* Colonne droite: cartes histoires */}
            <div className="flex flex-col gap-2">
              {sideHistoires.map((histoire, index) => (
                <HistoireCard key={histoire._id} histoire={histoire} index={index} />
              ))}

              {/* Bouton voir plus - glassmorphisme */}
              <Link
                to="/histoires"
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 group hover:-translate-y-0.5"
                style={{
                  backgroundColor: `${activeConfig.couleur}`,
                  color: 'white',
                  boxShadow: `0 4px 20px ${activeConfig.couleur}40`
                }}
              >
                <span>Découvrir toutes les histoires</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
