// src/components/article/RelatedArticles.tsx
// Section full-width des contenus recommandés (articles ou vidéos)

import React from 'react';
import { Link } from 'react-router-dom';
import { RelatedArticle } from './types';

type ContentType = 'article' | 'video';

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  contentType?: ContentType;
  maxItems?: number;
}

const LABELS: Record<ContentType, { noun: string; adjective: string; alt: string }> = {
  article: { noun: 'Articles', adjective: 'recommandés', alt: 'Article recommandé' },
  video: { noun: 'Vidéos', adjective: 'recommandées', alt: 'Vidéo recommandée' },
};

const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  articles,
  contentType = 'article',
  maxItems = 6,
}) => {
  if (articles.length === 0) return null;

  const { noun, adjective, alt } = LABELS[contentType];
  const basePath = contentType === 'video' ? '/video' : '/article';

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          {noun}{' '}
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            {adjective}
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, maxItems).map((related) => (
            <Link
              key={related._id}
              to={`${basePath}/${related.slug.current}`}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all"
            >
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={related.imageUrl || '/placeholder.svg'}
                  alt={related.titre || related.title || alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                {related.verticale && (
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-bold mb-3"
                    style={{
                      backgroundColor: `${related.verticale.couleurDominante || '#8B5CF6'}15`,
                      color: related.verticale.couleurDominante || '#8B5CF6'
                    }}
                  >
                    {related.verticale.nom}
                  </span>
                )}
                <h3 className="text-gray-900 font-bold line-clamp-2 group-hover:text-violet-600 transition-colors">
                  {related.titre || related.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;
