// src/components/VideosSection.tsx
// Section "Nos dernières vidéos" - Format 9:16 vertical - Style sobre

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { typo } from '../lib/typography';
import { sanityFetch } from '../lib/sanity';
import { VIDEOS_SECTION_QUERY } from '../lib/queries';
import { getUniversColors } from '../lib/universColors';

interface SanityVideo {
  _id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  duree?: number;
  tempsLecture?: number;
  slug?: string;
  datePublication?: string;
  verticale?: {
    _id: string;
    nom: string;
    couleurDominante?: string;
    slug?: string;
  };
}

interface VideoDisplay {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  slug: string;
  color: string;
  hideOnDesktop?: boolean;
  hideOnMobile?: boolean;
}

// Convertit durée en minutes vers format "X:XX"
const formatDuration = (minutes?: number): string => {
  if (!minutes) return '';
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Transforme les données Sanity en format d'affichage
const transformSanityVideo = (video: SanityVideo, index: number): VideoDisplay => {
  const colors = getUniversColors(video.verticale?.nom);
  return {
    id: video._id,
    title: video.titre,
    description: video.description || '',
    category: video.verticale?.nom || 'Société',
    thumbnail: video.imageUrl || '/placeholder.svg',
    duration: formatDuration(video.tempsLecture || video.duree),
    slug: video.slug || 'default',
    color: colors.bg,
    // Gestion responsive: index 4-5 cachées sur desktop, 6-8 tablette uniquement
    hideOnDesktop: index >= 4,
    hideOnMobile: index >= 6,
  };
};

export default function VideosSection() {
  const [videos, setVideos] = useState<VideoDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const sanityVideos = await sanityFetch(VIDEOS_SECTION_QUERY) as SanityVideo[];
        if (sanityVideos && sanityVideos.length > 0) {
          // Shuffle intelligent : mélanger puis sélectionner sans 2 catégories consécutives identiques
          const shuffled = [...sanityVideos].sort(() => Math.random() - 0.5);

          // Sélection avec règle : jamais 2 mêmes catégories côte à côte
          const selected: SanityVideo[] = [];
          const remaining = [...shuffled];

          while (selected.length < 4 && remaining.length > 0) {
            const lastCategory = selected.length > 0
              ? selected[selected.length - 1].verticale?.nom
              : null;

            // Chercher une vidéo avec une catégorie différente de la précédente
            let foundIndex = remaining.findIndex(v => v.verticale?.nom !== lastCategory);

            // Si on ne trouve pas, prendre la première disponible (fallback)
            if (foundIndex === -1) foundIndex = 0;

            selected.push(remaining[foundIndex]);
            remaining.splice(foundIndex, 1);
          }

          const transformed = selected.map(transformSanityVideo);
          setVideos(transformed);
        }
      } catch (error) {
        console.error('Erreur chargement vidéos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Ne pas afficher la section si pas de vidéos
  if (!loading && videos.length === 0) {
    return null;
  }
  return (
    <section className="bg-gray-50 py-6 sm:py-8 lg:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header avec introduction étoffée */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-8 bg-cyan-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Regarder</span>
            </div>
            <h2 className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Nos dernières vidéos
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {typo("Des formats courts pensés pour votre quotidien : témoignages authentiques, conseils pratiques et moments d'inspiration. Parfaits à regarder pendant une pause café ou dans les transports.")}
            </p>
          </div>

          <Link
            to="/bibliotheque?format=video"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 transition-colors self-start lg:self-center flex-shrink-0"
          >
            <span>Toutes les vidéos</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid vidéos en 16:9 - Style épisodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.slice(0, 4).map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                to={`/video/${video.slug}`}
                className="group block"
              >
                {/* Card container */}
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  {/* Thumbnail 16:9 */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Play button - toujours visible sur mobile */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                        style={{ backgroundColor: `${video.color}dd` }}
                      >
                        <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Duration badge */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-[10px] font-medium">
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    {/* Category badge */}
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase tracking-wide mb-2"
                      style={{
                        backgroundColor: video.color,
                        color: 'white',
                      }}
                    >
                      {video.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-gray-700 transition-colors">
                      {typo(video.title)}
                    </h3>

                    {/* Description */}
                    {video.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">
                        {typo(video.description)}
                      </p>
                    )}

                    {/* Regarder link */}
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                      style={{ color: video.color }}
                    >
                      Regarder
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
