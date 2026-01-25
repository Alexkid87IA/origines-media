// src/pages/RecherchePage.tsx
// Page de recherche globale - Filtrage côté client

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ArrowRight,
  FileText,
  Play,
  Heart,
  Star,
  Loader2,
  BookOpen
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { sanityFetch } from '../lib/sanity';
import { typo } from '../lib/typography';
import { getUniversColors } from '../lib/universColors';

// Types
interface SearchResult {
  _id: string;
  titre: string;
  slug: string;
  type: 'article' | 'histoire' | 'video' | 'recommandation';
  imageUrl?: string;
  extrait?: string;
  verticale?: { nom: string; couleurDominante: string };
  categorie?: string;
}

// Queries pour charger toutes les données
const ALL_ARTICLES_QUERY = `
  *[_type == "production"] | order(datePublication desc) {
    _id,
    titre,
    "slug": slug.current,
    typeArticle,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    extrait,
    description,
    "verticale": verticale->{
      nom,
      couleurDominante
    }
  }
`;

const ALL_HISTOIRES_QUERY = `
  *[_type == "portrait"] | order(_createdAt desc) {
    _id,
    titre,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    accroche,
    citation,
    categorie
  }
`;

const ALL_RECOS_QUERY = `
  *[_type == "recommendation"] | order(_createdAt desc) {
    _id,
    titre,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    accroche,
    type
  }
`;

// Fonction pour normaliser le texte (retire les accents, met en minuscules)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués (é -> e + accent)
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[œ]/g, 'oe') // Ligatures
    .replace(/[æ]/g, 'ae')
    .trim();
};

// Config par type de résultat
const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; path: string }> = {
  article: { label: 'Article', icon: FileText, color: '#10B981', path: '/article' },
  video: { label: 'Vidéo', icon: Play, color: '#06B6D4', path: '/video' },
  histoire: { label: 'Histoire', icon: Heart, color: '#EC4899', path: '/histoire' },
  recommandation: { label: 'Recommandation', icon: Star, color: '#F59E0B', path: '/recommandation' },
};

// Composant carte de résultat
const ResultCard: React.FC<{ result: SearchResult; index: number }> = ({ result, index }) => {
  const config = TYPE_CONFIG[result.type];
  const Icon = config.icon;
  const colors = result.verticale
    ? getUniversColors(result.verticale.nom)
    : { bg: config.color, text: '#FFFFFF' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`${config.path}/${result.slug}`}
        className="group flex gap-4 p-4 bg-white rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{
          boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
        }}
      >
        {/* Image */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
          {result.imageUrl ? (
            <img
              src={result.imageUrl}
              alt={result.titre}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${config.color}15` }}
            >
              <Icon className="w-8 h-8" style={{ color: config.color }} />
            </div>
          )}

          {/* Badge type */}
          <div className="absolute top-2 left-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: config.color }}
            >
              <Icon className="w-2.5 h-2.5" />
              {config.label}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Catégorie / Verticale */}
          {(result.verticale?.nom || result.categorie) && (
            <span
              className="text-xs font-semibold mb-1"
              style={{ color: colors.bg }}
            >
              {result.verticale?.nom || result.categorie}
            </span>
          )}

          {/* Titre */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors mb-2">
            {typo(result.titre)}
          </h3>

          {/* Extrait */}
          {result.extrait && (
            <p className="text-sm text-gray-500 line-clamp-2 hidden sm:block">
              {typo(result.extrait)}
            </p>
          )}

          {/* CTA */}
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold mt-2 transition-all group-hover:gap-2"
            style={{ color: config.color }}
          >
            Voir
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

// Interface pour les données brutes
interface RawArticle {
  _id: string;
  titre: string;
  slug: string;
  typeArticle?: string;
  imageUrl?: string;
  extrait?: string;
  description?: string;
  verticale?: { nom: string; couleurDominante: string };
}

interface RawHistoire {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  accroche?: string;
  citation?: string;
  categorie?: string;
}

interface RawReco {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  accroche?: string;
  type?: string;
}

const RecherchePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [allData, setAllData] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('tous');

  // Charger toutes les données au montage
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [articles, histoires, recos] = await Promise.all([
          sanityFetch<RawArticle[]>(ALL_ARTICLES_QUERY),
          sanityFetch<RawHistoire[]>(ALL_HISTOIRES_QUERY),
          sanityFetch<RawReco[]>(ALL_RECOS_QUERY),
        ]);

        // Transformer les articles
        const transformedArticles: SearchResult[] = (articles || []).map(a => ({
          _id: a._id,
          titre: a.titre,
          slug: a.slug,
          type: a.typeArticle === 'video' ? 'video' : 'article',
          imageUrl: a.imageUrl,
          extrait: a.extrait || a.description,
          verticale: a.verticale,
        }));

        // Transformer les histoires
        const transformedHistoires: SearchResult[] = (histoires || []).map(h => ({
          _id: h._id,
          titre: h.titre,
          slug: h.slug,
          type: 'histoire',
          imageUrl: h.imageUrl,
          extrait: h.accroche || h.citation,
          categorie: h.categorie,
        }));

        // Transformer les recommandations
        const transformedRecos: SearchResult[] = (recos || []).map(r => ({
          _id: r._id,
          titre: r.titre,
          slug: r.slug,
          type: 'recommandation',
          imageUrl: r.imageUrl,
          extrait: r.accroche,
          categorie: r.type,
        }));

        setAllData([...transformedArticles, ...transformedHistoires, ...transformedRecos]);
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Synchroniser searchInput avec l'URL
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Soumettre la recherche
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  // Effacer la recherche
  const handleClear = () => {
    setSearchInput('');
    setSearchParams({});
  };

  // Filtrer les résultats côté client (tolérant aux accents)
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    // Normaliser les termes de recherche (sans accents)
    const searchTerms = normalizeText(query).split(/\s+/).filter(Boolean);

    // Filtrer par recherche
    let results = allData.filter(item => {
      // Construire le texte searchable et le normaliser
      const searchableText = normalizeText([
        item.titre,
        item.extrait,
        item.verticale?.nom,
        item.categorie,
      ].filter(Boolean).join(' '));

      // Tous les termes doivent être présents (recherche tolérante)
      return searchTerms.every(term => searchableText.includes(term));
    });

    // Filtrer par type si nécessaire
    if (activeFilter !== 'tous') {
      results = results.filter(r => r.type === activeFilter);
    }

    return results;
  }, [allData, query, activeFilter]);

  // Compter par type (avec normalisation)
  const countByType = useMemo(() => {
    if (!query.trim()) return { tous: 0 };

    const searchTerms = normalizeText(query).split(/\s+/).filter(Boolean);

    const matchingResults = allData.filter(item => {
      const searchableText = normalizeText([
        item.titre,
        item.extrait,
        item.verticale?.nom,
        item.categorie,
      ].filter(Boolean).join(' '));

      return searchTerms.every(term => searchableText.includes(term));
    });

    const counts: Record<string, number> = { tous: matchingResults.length };
    matchingResults.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [allData, query]);

  const hasSearched = query.trim().length > 0;

  return (
    <>
      <SEO
        title={query ? `Recherche : ${query}` : 'Recherche'}
        description="Recherchez parmi nos articles, histoires, vidéos et recommandations."
        type="website"
      />
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
              <Search className="w-6 h-6 text-violet-500" />
              <div className="h-1 w-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Recherche
            </h1>
            <p className="text-gray-600 text-lg">
              {typo("Trouvez des articles, histoires, vidéos et recommandations.")}
            </p>
          </div>

          {/* Barre de recherche */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tapez votre recherche..."
                className="w-full pl-12 pr-24 py-4 text-lg bg-white border border-gray-200 rounded-2xl focus:border-violet-400 focus:ring-2 focus:ring-violet-100 focus:outline-none transition-all shadow-sm"
                autoFocus
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-16 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-violet-500 text-white font-semibold rounded-xl hover:bg-violet-600 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-4" />
              <p className="text-gray-500">Chargement...</p>
            </div>
          ) : (
            <>
              {/* Filtres par type */}
              {hasSearched && countByType.tous > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {['tous', 'article', 'video', 'histoire', 'recommandation'].map(type => {
                    const count = countByType[type] || 0;
                    if (type !== 'tous' && count === 0) return null;

                    const isActive = activeFilter === type;
                    const config = type === 'tous'
                      ? { label: 'Tous', color: '#6B7280' }
                      : TYPE_CONFIG[type];

                    return (
                      <button
                        key={type}
                        onClick={() => setActiveFilter(type)}
                        className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="searchFilterIndicator"
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: config.color }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span
                          className="relative z-10 transition-colors"
                          style={{ color: isActive ? 'white' : '#6B7280' }}
                        >
                          {config.label}
                        </span>
                        <span
                          className="relative z-10 text-xs px-1.5 py-0.5 rounded-full transition-all"
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

              {/* Résultats */}
              <div className="space-y-4">
                {hasSearched && filteredResults.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Aucun résultat
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {typo(`Aucun contenu ne correspond à "${query}".`)}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link
                        to="/articles"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Voir les articles
                      </Link>
                      <Link
                        to="/histoires"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-medium hover:bg-pink-100 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        Voir les histoires
                      </Link>
                      <Link
                        to="/videos"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full text-sm font-medium hover:bg-cyan-100 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Voir les vidéos
                      </Link>
                    </div>
                  </div>
                ) : hasSearched ? (
                  <>
                    <p className="text-sm text-gray-500 mb-4">
                      {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} pour "{query}"
                    </p>
                    <AnimatePresence mode="popLayout">
                      {filteredResults.slice(0, 50).map((result, index) => (
                        <ResultCard key={result._id} result={result} index={index} />
                      ))}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-violet-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {typo("Que cherchez-vous ?")}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {typo("Explorez notre catalogue d'articles, d'histoires inspirantes, de vidéos et de recommandations.")}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
};

export default RecherchePage;
