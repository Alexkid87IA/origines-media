// src/components/HistoiresSection.tsx
// Section Histoires pour la homepage - Design textuel élégant sans images

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Quote, Sparkles } from 'lucide-react';
import { typo } from '../lib/typography';
import { sanityFetch } from '../lib/sanity';

// Émotions/catégories pour les histoires (synchronisé avec navbar)
const emotions = [
  { id: 'inspiration', name: 'Inspiration', color: '#F59E0B' },
  { id: 'resilience', name: 'Résilience', color: '#10B981' },
  { id: 'amour', name: 'Amour', color: '#EC4899' },
  { id: 'courage', name: 'Courage', color: '#EF4444' },
  { id: 'espoir', name: 'Espoir', color: '#06B6D4' },
  { id: 'gratitude', name: 'Gratitude', color: '#8B5CF6' },
  { id: 'transformation', name: 'Transformation', color: '#6366F1' },
  { id: 'liberte', name: 'Liberté', color: '#14B8A6' },
];

// Query pour récupérer les histoires SANS images de couverture
const HISTOIRES_HOME_QUERY = `
  *[_type == "portrait" && !defined(image.asset)] {
    _id,
    titre,
    categorie,
    accroche,
    "slug": slug.current,
    citation
  }
`;

interface Histoire {
  _id: string;
  titre: string;
  categorie?: string;
  accroche?: string;
  slug: string;
  citation?: string;
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

export default function HistoiresSection() {
  const [histoires, setHistoires] = useState<Histoire[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEmotion, setActiveEmotion] = useState<string>('tous');

  useEffect(() => {
    const fetchHistoires = async () => {
      try {
        const data = await sanityFetch(HISTOIRES_HOME_QUERY) as Histoire[];
        // Shuffle les histoires pour avoir un ordre aléatoire à chaque chargement
        setHistoires(shuffleArray(data || []));
      } catch (error) {
        console.error('Erreur fetch histoires:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoires();
  }, []);

  // Filtrer par émotion/catégorie
  const filteredHistoires = useMemo(() => {
    const filtered = activeEmotion === 'tous'
      ? histoires
      : histoires.filter(h => h.categorie?.toLowerCase() === activeEmotion);
    // Re-shuffle à chaque changement de filtre pour varier l'affichage
    return shuffleArray(filtered);
  }, [activeEmotion, histoires]);

  // Émotions disponibles (celles qui ont des histoires)
  const availableEmotions = emotions.filter(e =>
    histoires.some(h => h.categorie?.toLowerCase() === e.id)
  );

  // Obtenir la config de l'émotion
  const getEmotionConfig = (categorie?: string) => {
    if (!categorie) return emotions[0];
    return emotions.find(e => e.id === categorie.toLowerCase()) || emotions[0];
  };

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

        {/* Filtres par émotion - Style tabs comme les articles */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Bouton "Tous" */}
          <button
            onClick={() => setActiveEmotion('tous')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              activeEmotion === 'tous'
                ? 'bg-gray-900 text-white border border-gray-900'
                : 'bg-white text-gray-900 border border-gray-900'
            }`}
          >
            Tous
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Boutons par émotion */}
          {availableEmotions.map(emotion => {
            const isActive = activeEmotion === emotion.id;
            return (
              <button
                key={emotion.id}
                onClick={() => setActiveEmotion(emotion.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200"
                style={{
                  backgroundColor: isActive ? emotion.color : 'white',
                  color: isActive ? 'white' : emotion.color,
                  border: `1px solid ${emotion.color}`,
                }}
              >
                {emotion.name}
              </button>
            );
          })}
        </div>

        {/* Grid des histoires - Design carte élégant */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEmotion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {filteredHistoires.slice(0, 4).map((histoire, index) => {
              const emotionConfig = getEmotionConfig(histoire.categorie);

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
                        style={{ backgroundColor: emotionConfig.color }}
                      />

                      {/* Header avec icône et badge */}
                      <div className="relative flex items-start justify-between mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, ${emotionConfig.color}20 0%, ${emotionConfig.color}10 100%)`,
                          }}
                        >
                          <Quote className="w-5 h-5" style={{ color: emotionConfig.color }} />
                        </div>

                        {histoire.categorie && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                            style={{ backgroundColor: emotionConfig.color }}
                          >
                            <Sparkles className="w-3 h-3" />
                            {histoire.categorie}
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
                          style={{ color: emotionConfig.color }}
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
      </div>
    </section>
  );
}
