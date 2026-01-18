// src/components/VideosSection.tsx
// Section "Nos dernières vidéos" - Format 9:16 vertical - Style sobre

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { typo } from '../lib/typography';

// Données statiques (à remplacer par Sanity plus tard)
const videos = [
  {
    id: '1',
    title: "Comment j'ai surmonté mon anxiété sociale",
    category: 'Psychologie',
    thumbnail: '/placeholder.svg',
    duration: '3:24',
    slug: 'surmonter-anxiete-sociale',
    color: '#8B5CF6',
  },
  {
    id: '2',
    title: "Une journée dans la vie d'un chef étoilé",
    category: 'Carrière',
    thumbnail: '/placeholder.svg',
    duration: '5:12',
    slug: 'journee-chef-etoile',
    color: '#1F2937',
  },
  {
    id: '3',
    title: 'Le secret des couples qui durent',
    category: 'Famille',
    thumbnail: '/placeholder.svg',
    duration: '4:45',
    slug: 'secret-couples-durent',
    color: '#EC4899',
  },
  {
    id: '4',
    title: "L'art de la méditation en pleine conscience",
    category: 'Spiritualité',
    thumbnail: '/placeholder.svg',
    duration: '6:30',
    slug: 'art-meditation-pleine-conscience',
    color: '#A855F7',
  },
  {
    id: '5',
    title: 'Voyage solo : mes 30 jours au Japon',
    category: 'Voyage',
    thumbnail: '/placeholder.svg',
    duration: '8:15',
    slug: 'voyage-solo-japon',
    color: '#10B981',
  },
];

export default function VideosSection() {
  return (
    <section className="bg-gray-50 py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-4">
          <div>
            <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
              Nos dernières vidéos
            </h2>
            <p className="text-gray-500 text-xs">
              Des formats courts qui inspirent et transforment
            </p>
          </div>

          <Link
            to="/bibliotheque?format=video"
            className="group inline-flex items-center gap-1 text-gray-900 font-medium text-xs hover:text-gray-600 transition-colors"
          >
            <span>Toutes les vidéos</span>
            <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid 5 vidéos en 9:16 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 lg:gap-2">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                to={`/video/${video.slug}`}
                className="group block relative rounded-xl overflow-hidden"
              >
                {/* Video card 9:16 */}
                <div className="relative aspect-[9/16]">
                  {/* Thumbnail */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Play button - Blanc uniforme */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-xl">
                      <Play className="w-3 h-3 text-gray-900 ml-0.5" fill="currentColor" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute top-1.5 right-1.5">
                    <span className="px-1 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[8px] font-medium text-white">
                      {video.duration}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    {/* Category badge - Dot coloré + texte blanc */}
                    <span className="inline-flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-wider text-white/90 mb-1">
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: video.color }}
                      />
                      {video.category}
                    </span>

                    <h3 className="text-[10px] font-semibold text-white leading-snug line-clamp-2">
                      {typo(video.title)}
                    </h3>
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
