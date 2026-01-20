// src/components/HistoiresSection.tsx
// Section Histoires pour la homepage - Style cohérent avec les autres sections

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
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

// Query pour récupérer les histoires (portraits)
const HISTOIRES_HOME_QUERY = `
  *[_type == "portrait"] | order(ordre asc, _createdAt desc) [0...12] {
    _id,
    titre,
    categorie,
    accroche,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    citation
  }
`;

interface Histoire {
  _id: string;
  titre: string;
  categorie?: string;
  accroche?: string;
  imageUrl?: string;
  slug: string;
  citation?: string;
}

export default function HistoiresSection() {
  const [histoires, setHistoires] = useState<Histoire[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEmotion, setActiveEmotion] = useState<string>('tous');

  useEffect(() => {
    const fetchHistoires = async () => {
      try {
        const data = await sanityFetch(HISTOIRES_HOME_QUERY) as Histoire[];
        setHistoires(data || []);
      } catch (error) {
        console.error('Erreur fetch histoires:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoires();
  }, []);

  // Filtrer par émotion/catégorie
  const filteredHistoires = activeEmotion === 'tous'
    ? histoires
    : histoires.filter(h => h.categorie?.toLowerCase() === activeEmotion);

  // Émotions disponibles (celles qui ont des histoires)
  const availableEmotions = emotions.filter(e =>
    histoires.some(h => h.categorie?.toLowerCase() === e.id)
  );

  // Obtenir la couleur de l'émotion
  const getEmotionColor = (categorie?: string): string => {
    if (!categorie) return '#6366F1';
    const emotion = emotions.find(e => e.id === categorie.toLowerCase());
    return emotion?.color || '#6366F1';
  };

  if (loading) {
    return (
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
        </div>
      </section>
    );
  }

  if (histoires.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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

        {/* Filtres par émotion */}
        {availableEmotions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveEmotion('tous')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                activeEmotion === 'tous'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              Tous
            </button>
            {availableEmotions.map(emotion => (
              <button
                key={emotion.id}
                onClick={() => setActiveEmotion(emotion.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200"
                style={{
                  backgroundColor: activeEmotion === emotion.id ? emotion.color : 'white',
                  color: activeEmotion === emotion.id ? 'white' : emotion.color,
                  border: `1px solid ${activeEmotion === emotion.id ? emotion.color : emotion.color + '40'}`,
                }}
              >
                {emotion.name}
              </button>
            ))}
          </div>
        )}

        {/* Grid des histoires */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEmotion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filteredHistoires.slice(0, 4).map((histoire, index) => {
              const emotionColor = getEmotionColor(histoire.categorie);

              return (
                <motion.div
                  key={histoire._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/histoire/${histoire.slug}`}
                    className="group block"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3">
                      <img
                        src={histoire.imageUrl || '/placeholder.svg'}
                        alt={histoire.titre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Badge catégorie */}
                      {histoire.categorie && (
                        <span
                          className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                          style={{ backgroundColor: emotionColor }}
                        >
                          {histoire.categorie}
                        </span>
                      )}

                      {/* Titre sur l'image */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">
                          {typo(histoire.titre)}
                        </h3>
                      </div>
                    </div>

                    {/* Accroche sous l'image */}
                    {histoire.accroche && (
                      <p className="text-gray-600 text-xs line-clamp-2">
                        {typo(histoire.accroche)}
                      </p>
                    )}

                    {/* CTA */}
                    <div
                      className="flex items-center gap-1 mt-2 text-xs font-semibold transition-colors"
                      style={{ color: emotionColor }}
                    >
                      <span>Découvrir</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
