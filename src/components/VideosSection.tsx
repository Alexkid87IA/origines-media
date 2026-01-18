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
    description: "Témoignage poignant sur le combat quotidien contre l'anxiété et les clés pour reprendre confiance.",
    category: 'Psychologie',
    thumbnail: '/placeholder.svg',
    duration: '3:24',
    slug: 'surmonter-anxiete-sociale',
    color: '#8B5CF6',
  },
  {
    id: '2',
    title: "Une journée dans la vie d'un chef étoilé",
    description: "Immersion dans les coulisses d'un restaurant gastronomique, entre passion et exigence.",
    category: 'Carrière',
    thumbnail: '/placeholder.svg',
    duration: '5:12',
    slug: 'journee-chef-etoile',
    color: '#1F2937',
  },
  {
    id: '3',
    title: 'Le secret des couples qui durent',
    description: "Les ingrédients essentiels d'une relation épanouissante selon les experts.",
    category: 'Famille',
    thumbnail: '/placeholder.svg',
    duration: '4:45',
    slug: 'secret-couples-durent',
    color: '#EC4899',
  },
  {
    id: '4',
    title: "L'art de la méditation en pleine conscience",
    description: "Guide pratique pour débuter la méditation et transformer votre quotidien.",
    category: 'Spiritualité',
    thumbnail: '/placeholder.svg',
    duration: '6:30',
    slug: 'art-meditation-pleine-conscience',
    color: '#A855F7',
  },
  {
    id: '5',
    title: 'Voyage solo : mes 30 jours au Japon',
    description: "Carnet de voyage introspectif à travers le pays du soleil levant.",
    category: 'Voyage',
    thumbnail: '/placeholder.svg',
    duration: '8:15',
    slug: 'voyage-solo-japon',
    color: '#10B981',
  },
  // Vidéo 6 : visible sur mobile + tablette, cachée sur desktop
  {
    id: '6',
    title: 'Reconversion professionnelle : par où commencer ?',
    description: "Les étapes clés pour réussir sa transition de carrière en douceur.",
    category: 'Carrière',
    thumbnail: '/placeholder.svg',
    duration: '7:02',
    slug: 'reconversion-professionnelle',
    color: '#1F2937',
    hideOnDesktop: true,
  },
  // Vidéos 7-9 : visibles sur tablette uniquement
  {
    id: '7',
    title: 'Les bienfaits insoupçonnés de la lecture',
    description: "Pourquoi lire change votre cerveau et enrichit votre vie.",
    category: 'Art & Créativité',
    thumbnail: '/placeholder.svg',
    duration: '4:18',
    slug: 'bienfaits-lecture',
    color: '#F59E0B',
    hideOnMobile: true,
    hideOnDesktop: true,
  },
  {
    id: '8',
    title: 'Apprendre à dire non sans culpabiliser',
    description: "Poser ses limites est un acte d'amour envers soi-même.",
    category: 'Psychologie',
    thumbnail: '/placeholder.svg',
    duration: '5:45',
    slug: 'apprendre-dire-non',
    color: '#8B5CF6',
    hideOnMobile: true,
    hideOnDesktop: true,
  },
  {
    id: '9',
    title: 'Ma routine matinale pour une journée productive',
    description: "Les habitudes qui transforment vos matins et boostent votre énergie.",
    category: 'Santé',
    thumbnail: '/placeholder.svg',
    duration: '6:12',
    slug: 'routine-matinale',
    color: '#10B981',
    hideOnMobile: true,
    hideOnDesktop: true,
  },
];

export default function VideosSection() {
  return (
    <section className="bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Header avec introduction étoffée */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="max-w-xl">
            <div className="h-0.5 w-8 sm:w-10 bg-gray-900 rounded-full mb-2 sm:mb-3" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Nos dernières vidéos
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
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

        {/* Grid vidéos en 9:16 - Responsive: 6 sur mobile, 9 sur tablette, 5 sur desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 lg:gap-2">
          {videos.map((video, index) => {
            // Gestion de la visibilité responsive
            const visibilityClass = video.hideOnMobile && video.hideOnDesktop
              ? 'hidden sm:block lg:hidden' // Vidéos 7-9 : tablette uniquement
              : video.hideOnDesktop
              ? 'lg:hidden' // Vidéo 6 : mobile + tablette
              : ''; // Vidéos 1-5 : partout

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.08 }}
                className={visibilityClass}
              >
                <Link
                  to={`/video/${video.slug}`}
                  className="group block relative rounded-xl overflow-visible"
                >
                  {/* Video card 9:16 */}
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden transition-all duration-300 lg:group-hover:-translate-y-2 lg:group-hover:shadow-2xl">
                    {/* Thumbnail */}
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Gradient overlay - Plus fort sur mobile pour lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent sm:from-black/90 sm:via-black/30" />

                    {/* Play button - Visible tablette + desktop (avant hover) */}
                    <div className="hidden sm:flex absolute inset-0 items-center justify-center lg:group-hover:opacity-0 transition-opacity duration-300">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-xl">
                        <Play className="w-3 h-3 text-gray-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute top-2 right-2 sm:top-1.5 sm:right-1.5 z-10">
                      <span className="px-1.5 py-0.5 sm:px-1 bg-black/60 backdrop-blur-sm rounded text-[9px] sm:text-[8px] font-medium text-white">
                        {video.duration}
                      </span>
                    </div>

                    {/* Content - Version tablette simple */}
                    <div className="hidden sm:flex lg:hidden absolute bottom-0 left-0 right-0 p-2 min-h-[33%] flex-col justify-end">
                      {/* Category badge - Dot coloré + texte blanc */}
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-wider text-white/90 mb-1">
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: video.color }}
                        />
                        {video.category}
                      </span>

                      <h3 className="text-[10px] font-semibold text-white leading-snug line-clamp-2 drop-shadow-sm">
                        {typo(video.title)}
                      </h3>
                    </div>

                    {/* OVERLAY COMPLET - Mobile (par défaut) + Desktop (au hover) */}
                    <div className="flex sm:hidden lg:flex absolute inset-0 flex-col justify-end lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                      <div className="p-3 sm:p-2.5 pt-16 sm:pt-12 bg-gradient-to-t from-black/95 via-black/85 to-transparent">
                        {/* Category badge */}
                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[8px] font-bold uppercase tracking-wider text-white/90 mb-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: video.color }}
                          />
                          {video.category}
                        </span>

                        {/* Titre plus gros */}
                        <h3 className="text-[12px] sm:text-[11px] font-bold text-white leading-tight mb-1.5 drop-shadow-lg">
                          {typo(video.title)}
                        </h3>

                        {/* Description */}
                        {video.description && (
                          <p className="text-white/70 text-[9px] sm:text-[8px] leading-relaxed mb-2 line-clamp-2">
                            {typo(video.description)}
                          </p>
                        )}

                        {/* Bouton Regarder */}
                        <span
                          className="inline-flex items-center gap-1 text-[9px] sm:text-[8px] font-semibold transition-all"
                          style={{ color: video.color }}
                        >
                          <Play className="w-3 h-3 sm:w-2.5 sm:h-2.5" fill="currentColor" />
                          Regarder
                          <ArrowRight className="w-2.5 h-2.5 sm:w-2 sm:h-2" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
