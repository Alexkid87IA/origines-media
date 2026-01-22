// src/components/article/ArticleHero.tsx
// Section Hero pour les articles

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { typo } from '../../lib/typography';
import { ArticleTag, ArticleVerticale } from './types';

interface ArticleHeroProps {
  title: string;
  description?: string;
  imageUrl?: string;
  verticale?: ArticleVerticale;
  authorName: string;
  authorImage?: string;
  date?: string;
  readTime: number;
  tags?: ArticleTag[];
  themeColor: string;
}

const ArticleHero: React.FC<ArticleHeroProps> = ({
  title,
  description,
  imageUrl,
  verticale,
  authorName,
  authorImage,
  date,
  readTime,
  tags,
  themeColor
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="relative">
      {/* Header de navigation flottant */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 lg:p-10">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full shadow-xl hover:bg-gray-800 hover:scale-105 transition-all"
          aria-label="Retour à la page précédente"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Retour</span>
        </button>
      </div>

      {/* Layout en deux colonnes */}
      <div className="grid lg:grid-cols-2 min-h-[70vh] lg:min-h-[80vh]">
        {/* Colonne image */}
        <div className="relative h-[45vh] lg:h-auto order-1 lg:order-1">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${imageUrl || '/placeholder.svg'})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-white" />
          </div>
        </div>

        {/* Colonne contenu */}
        <div className="flex flex-col justify-center p-6 lg:p-12 xl:p-16 bg-white order-2 lg:order-2">
          {/* Catégorie */}
          {verticale && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-4"
              style={{ color: themeColor }}
            >
              {verticale.nom}
            </motion.p>
          )}

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6 leading-[1.1]"
          >
            {typo(title)}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-lg text-gray-600 leading-relaxed mb-8"
            >
              {typo(description)}
            </motion.p>
          )}

          {/* Métadonnées */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 text-gray-500 text-sm"
          >
            {authorImage && (
              <img
                src={authorImage}
                alt={authorName}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
              />
            )}
            <div className="flex flex-col">
              <span className="text-gray-900 font-medium">{authorName}</span>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(date)}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTime} min
                </span>
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          {tags && tags.filter((t) => t && t.title).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {tags.filter((t) => t && t.title).slice(0, 4).map((tag) => (
                <span
                  key={tag._id}
                  className="px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}15` : '#F3F4F6',
                    color: tag.color || '#6B7280',
                  }}
                >
                  {tag.title}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArticleHero;
