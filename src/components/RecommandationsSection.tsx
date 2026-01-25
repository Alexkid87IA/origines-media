// src/components/RecommandationsSection.tsx
// Section recommandations homepage - Design avec image featured + 3 recos

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, BookOpen, Film, Headphones, Youtube, Music,
  Heart, Star, Loader2, MapPin, Palette, Globe,
  ShoppingBag, AtSign
} from 'lucide-react';
import { typo } from '../lib/typography';
import { sanityFetch } from '../lib/sanity';

// Types de recommandations (SYNCHRONISÉ avec RecommandationsPage)
const recommendationTypes = {
  'livres': { color: '#E11D48', lightBg: '#FFF1F2', label: 'Livre', icon: BookOpen },
  'films-series': { color: '#7C3AED', lightBg: '#F5F3FF', label: 'Film & Série', icon: Film },
  'musique': { color: '#2563EB', lightBg: '#EFF6FF', label: 'Musique', icon: Music },
  'podcasts': { color: '#0D9488', lightBg: '#F0FDFA', label: 'Podcast', icon: Headphones },
  'youtube': { color: '#DC2626', lightBg: '#FEF2F2', label: 'YouTube', icon: Youtube },
  'reseaux-sociaux': { color: '#0891B2', lightBg: '#ECFEFF', label: 'Social', icon: AtSign },
  'activite': { color: '#16A34A', lightBg: '#F0FDF4', label: 'Activité', icon: Globe },
  'destination': { color: '#EA580C', lightBg: '#FFF7ED', label: 'Destination', icon: MapPin },
  'culture': { color: '#9333EA', lightBg: '#FAF5FF', label: 'Culture', icon: Palette },
  'produit': { color: '#CA8A04', lightBg: '#FEFCE8', label: 'Produit', icon: ShoppingBag },
};

type RecommendationType = keyof typeof recommendationTypes;

// Mapping des valeurs Sanity vers les clés internes
const typeMapping: Record<string, RecommendationType> = {
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
  'livre': 'livres',
  'film': 'films-series',
  'podcast': 'podcasts',
};

// Query pour récupérer les recommandations avec image
const RECOS_FOR_HOME_QUERY = `
  *[_type == "recommendation"] | order(coupDeCoeur desc, datePublication desc) {
    _id,
    titre,
    type,
    auteur,
    note,
    coupDeCoeur,
    accroche,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    "datePublication": coalesce(datePublication, _createdAt)
  }
`;

interface SanityReco {
  _id: string;
  titre: string;
  type: string;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
}

interface Reco {
  id: string;
  titre: string;
  type: RecommendationType;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  imageUrl?: string;
  slug: string;
}

const transformReco = (reco: SanityReco): Reco => {
  const mappedType = reco.type ? typeMapping[reco.type] : undefined;
  return {
    id: reco._id,
    titre: reco.titre,
    type: mappedType || 'livres',
    auteur: reco.auteur,
    note: reco.note,
    coupDeCoeur: reco.coupDeCoeur,
    accroche: reco.accroche,
    imageUrl: reco.imageUrl,
    slug: reco.slug,
  };
};

// Images d'illustration par catégorie
const categoryImages: Record<RecommendationType, string> = {
  'livres': '/recos/reco_livre.png',
  'films-series': '/recos/reco_film_serie.png',
  'musique': '/recos/reco_musique.png',
  'podcasts': '/recos/reco_podcast.png',
  'youtube': '/recos/reco_youtube.png',
  'reseaux-sociaux': '/recos/reco_social.png',
  'activite': '/recos/reco_activite.png',
  'destination': '/recos/reco_destination.png',
  'culture': '/recos/reco_culture.png',
  'produit': '/recos/reco_produit.png',
};

// Composant image d'illustration de catégorie (gauche)
const CategoryIllustration: React.FC<{ type: RecommendationType }> = ({ type }) => {
  const config = recommendationTypes[type];
  const Icon = config.icon;
  const imageUrl = categoryImages[type];

  return (
    <div className="relative h-full rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-100">
      {/* Image 4/5 */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={imageUrl}
          alt={`Illustration ${config.label}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback si l'image n'existe pas
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        {/* Fallback coloré si pas d'image */}
        <div
          className="hidden w-full h-full absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: config.lightBg }}
        >
          <Icon className="w-20 h-20 opacity-30" style={{ color: config.color }} />
        </div>

        {/* Overlay gradient subtil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badge catégorie en bas */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: config.color }}
          >
            <Icon className="w-4 h-4" />
            {config.label}
          </span>
          <p className="text-white/80 text-sm mt-2">
            Nos coups de cœur
          </p>
        </div>
      </div>
    </div>
  );
};

// Composant mini carte (pour la liste à droite)
const MiniRecoCard: React.FC<{ reco: Reco; index: number }> = ({ reco, index }) => {
  const config = recommendationTypes[reco.type];
  const Icon = config.icon;
  const hasImage = reco.imageUrl && !reco.imageUrl.includes('placeholder');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link to={`/recommandation/${reco.slug}`} className="group flex gap-3 p-3 rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
        {/* Image miniature carrée */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden">
          {hasImage ? (
            <img
              src={reco.imageUrl}
              alt={reco.titre}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: config.lightBg }}
            >
              <Icon className="w-6 h-6 opacity-50" style={{ color: config.color }} />
            </div>
          )}

          {/* Coup de coeur mini */}
          {reco.coupDeCoeur && (
            <div className="absolute top-1 right-1">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500 drop-shadow" />
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Badge type */}
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white self-start mb-1.5"
            style={{ backgroundColor: config.color }}
          >
            <Icon className="w-2.5 h-2.5" />
            {config.label}
          </span>

          {/* Titre */}
          <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-gray-700 transition-colors">
            {typo(reco.titre)}
          </h4>

          {/* Note ou auteur */}
          <div className="flex items-center gap-2 mt-1">
            {reco.note && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-semibold text-amber-600">{reco.note}/5</span>
              </div>
            )}
            {reco.auteur && (
              <span className="text-[10px] text-gray-500 truncate">{reco.auteur}</span>
            )}
          </div>
        </div>

        {/* Flèche */}
        <ArrowRight className="w-4 h-4 text-gray-300 self-center flex-shrink-0 transition-all duration-300 group-hover:text-gray-500 group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
};

export default function RecommandationsSection() {
  const [recommendations, setRecommendations] = useState<Reco[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<RecommendationType | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    const fetchRecos = async () => {
      try {
        const data = await sanityFetch(RECOS_FOR_HOME_QUERY) as SanityReco[];
        const transformed = (data || []).map(transformReco);
        setRecommendations(transformed);

        if (transformed.length > 0) {
          setActiveType(transformed[0].type);
        }
      } catch (error) {
        console.error('Erreur fetch recommandations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecos();
  }, []);

  const availableTypes = (Object.keys(recommendationTypes) as RecommendationType[]).filter(type =>
    recommendations.some(r => r.type === type)
  );

  useEffect(() => {
    if (!isAutoRotating || availableTypes.length === 0) return;

    const interval = setInterval(() => {
      setActiveType(current => {
        const currentIndex = availableTypes.findIndex(t => t === current);
        const nextIndex = (currentIndex + 1) % availableTypes.length;
        return availableTypes[nextIndex];
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoRotating, availableTypes]);

  const filteredRecos = recommendations.filter(r => r.type === activeType);
  const activeConfig = activeType ? recommendationTypes[activeType] : recommendationTypes['livres'];
  const sideRecos = filteredRecos.slice(0, 6); // 6 recos à droite

  const handleTypeClick = (type: RecommendationType) => {
    setIsAutoRotating(false);
    setActiveType(type);
  };

  if (loading) {
    return (
      <section className="py-10 sm:py-12 lg:py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-gray-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-8 rounded-full" style={{ backgroundColor: activeConfig.color }} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Découvrir</span>
            </div>
            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Nos recommandations
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              {typo("Livres, films, podcasts, chaînes YouTube... Les coups de cœur sélectionnés par notre équipe.")}
            </p>
          </div>

          <Link
            to="/recommandations"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
          >
            <span>Toutes les recos</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Catégories avec animation layoutId */}
        {availableTypes.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {availableTypes.map((type) => {
              const isActive = activeType === type;
              const config = recommendationTypes[type];
              const count = recommendations.filter(r => r.type === type).length;

              return (
                <button
                  key={type}
                  onClick={() => handleTypeClick(type)}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-xs transition-all duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="recosTabIndicator"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: config.color }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span
                    className="relative z-10 transition-colors duration-300"
                    style={{ color: isActive ? 'white' : '#6B7280' }}
                  >
                    {config.label}
                  </span>
                  <span
                    className="relative z-10 text-[10px] px-1.5 py-0.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${config.color}15`,
                      color: isActive ? 'white' : config.color,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Layout: Image illustration + 5 mini cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
          >
            {/* Colonne gauche: Image d'illustration de la catégorie */}
            {activeType && (
              <div className="lg:row-span-1">
                <CategoryIllustration type={activeType} />
              </div>
            )}

            {/* Colonne droite: 3 mini cards empilées */}
            <div className="flex flex-col gap-3">
              {sideRecos.map((reco, index) => (
                <MiniRecoCard key={reco.id} reco={reco} index={index} />
              ))}

              {/* Bouton voir plus */}
              <Link
                to="/recommandations"
                className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all group"
                style={{
                  backgroundColor: `${activeConfig.color}10`,
                  color: activeConfig.color
                }}
              >
                <span>Voir toutes les recommandations</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
