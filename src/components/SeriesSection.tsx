// src/components/SeriesSection.tsx
// Section "Nos séries" - Style Outline Coloré Premium (inspiré du Navbar dropdown)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { typo } from '../lib/typography';

interface Serie {
  _id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  posterUrl?: string;
  slug: { current: string };
  nombreEpisodes?: number;
}

interface SeriesSectionProps {
  series?: Serie[];
}

// Couleurs signature pour chaque série
const seriesColors = [
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#10B981', // Emerald
  '#EC4899', // Pink
];

// Composant SeriesCard avec style outline coloré
interface SeriesCardProps {
  serie: Serie;
  color: string;
  index: number;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ serie, color, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        to={`/series/${serie.slug.current}`}
        className="group block rounded-xl overflow-hidden transition-all duration-150 hover:scale-[1.03]"
        style={{
          border: `2px solid ${color}`,
          backgroundColor: isHovered ? color : 'transparent',
          boxShadow: isHovered ? `0 12px 30px -8px ${color}60` : 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative p-2 sm:p-2.5 lg:p-3 flex flex-col gap-2">
          {/* Poster thumbnail */}
          <div
            className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md transition-all duration-150"
            style={{ border: `2px solid ${isHovered ? 'rgba(255,255,255,0.3)' : `${color}30`}` }}
          >
            <img
              src={serie.posterUrl || serie.imageUrl || '/placeholder.svg'}
              alt={serie.titre}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Content */}
          <div className="min-h-[40px] sm:min-h-[48px]">
            <span
              className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest block mb-0.5 transition-colors duration-150"
              style={{ color: isHovered ? 'rgba(255,255,255,0.7)' : `${color}99` }}
            >
              <Play className="w-2 h-2 inline mr-0.5" fill="currentColor" />
              {serie.nombreEpisodes || '?'} épisodes
            </span>
            <h4
              className="text-[10px] sm:text-[11px] lg:text-xs font-bold leading-tight line-clamp-2 transition-colors duration-150"
              style={{ color: isHovered ? 'white' : color }}
            >
              {typo(serie.titre)}
            </h4>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const SeriesSection: React.FC<SeriesSectionProps> = ({ series = [] }) => {
  if (series.length === 0) return null;

  // Prendre les 6 premières séries pour la grille principale
  const mainSeries = series.slice(0, 6);
  // Featured série (la première) pour la grande carte
  const featuredSerie = series[0];
  const featuredColor = seriesColors[0];
  const [featuredHovered, setFeaturedHovered] = useState(false);

  return (
    <section className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header avec introduction */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 lg:mb-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1 w-8 bg-violet-500 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Explorer</span>
            </div>
            <h2 className="text-xl sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Nos séries
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {typo("Plongez dans des récits en plusieurs épisodes, conçus pour explorer un thème en profondeur. Chaque série est une invitation à prendre le temps, à réfléchir et à grandir au fil des chapitres.")}
            </p>
          </div>
        </div>

        {/* Layout Desktop: Featured + Grid / Mobile: Grid seul */}
        <div className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">

          {/* Featured Serie - Grande carte (desktop only) */}
          <motion.div
            className="hidden lg:block col-span-5"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to={`/series/${featuredSerie.slug.current}`}
              className="group block h-full rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                border: `3px solid ${featuredColor}`,
                backgroundColor: featuredHovered ? featuredColor : 'transparent',
                boxShadow: featuredHovered ? `0 20px 50px -15px ${featuredColor}70` : 'none'
              }}
              onMouseEnter={() => setFeaturedHovered(true)}
              onMouseLeave={() => setFeaturedHovered(false)}
            >
              <div className="relative p-4 flex flex-col h-full">
                {/* Grande image poster */}
                <div
                  className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-xl mb-4 transition-all duration-200"
                  style={{ border: `2px solid ${featuredHovered ? 'rgba(255,255,255,0.3)' : `${featuredColor}30`}` }}
                >
                  <img
                    src={featuredSerie.posterUrl || featuredSerie.imageUrl || '/placeholder.svg'}
                    alt={featuredSerie.titre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest mb-2 transition-colors duration-150 flex items-center gap-1"
                    style={{ color: featuredHovered ? 'rgba(255,255,255,0.7)' : `${featuredColor}99` }}
                  >
                    <Play className="w-2.5 h-2.5" fill="currentColor" />
                    {featuredSerie.nombreEpisodes || '?'} épisodes
                  </span>

                  <h3
                    className="text-lg font-bold leading-snug mb-2 transition-colors duration-150"
                    style={{ color: featuredHovered ? 'white' : featuredColor }}
                  >
                    {typo(featuredSerie.titre)}
                  </h3>

                  {featuredSerie.description && (
                    <p
                      className="text-xs leading-relaxed mb-3 line-clamp-3 transition-colors duration-150"
                      style={{ color: featuredHovered ? 'rgba(255,255,255,0.8)' : '#6B7280' }}
                    >
                      {typo(featuredSerie.description)}
                    </p>
                  )}

                  <div className="mt-auto">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold transition-all duration-150 group-hover:gap-2"
                      style={{ color: featuredHovered ? 'white' : featuredColor }}
                    >
                      Découvrir la série
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Grid de séries - Style outline coloré */}
          <div className="col-span-12 lg:col-span-7">
            {/* Sur desktop: grid 3x2 sans la première série */}
            {/* Sur mobile/tablette: grid 3x2 avec toutes les séries */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 lg:gap-3">
              {/* Mobile/Tablette: afficher toutes les 6 séries */}
              {mainSeries.map((serie, index) => {
                const color = seriesColors[index % seriesColors.length];
                // Sur desktop, cacher la première (déjà dans featured)
                const hideOnDesktop = index === 0;

                return (
                  <div key={serie._id} className={hideOnDesktop ? 'lg:hidden' : ''}>
                    <SeriesCard
                      serie={serie}
                      color={color}
                      index={index}
                    />
                  </div>
                );
              })}

              {/* Desktop only: Carte CTA pour combler l'espace vide */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Link
                  to="/series"
                  className="group flex flex-col items-center justify-center h-full min-h-[200px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 hover:border-violet-400 hover:bg-violet-50/50 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mb-3 group-hover:bg-violet-200 group-hover:scale-110 transition-all duration-200">
                    <ArrowRight className="w-5 h-5 text-violet-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-violet-600 transition-colors">
                    Voir toutes
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-violet-500 transition-colors">
                    les séries
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Stats et CTA en bas de la grille - Desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="hidden sm:flex mt-4 sm:mt-5 pt-4 border-t border-gray-100 items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  {series.length} séries disponibles
                </span>
                <span className="hidden sm:flex text-[10px] sm:text-xs text-gray-400 items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Nouveaux épisodes chaque semaine
                </span>
              </div>

              <Link
                to="/series"
                className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                Tout voir
                <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>

            {/* Mobile: Bouton voir tout */}
            <div className="sm:hidden mt-4">
              <Link
                to="/series"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all bg-violet-50 text-violet-600 hover:bg-violet-100"
              >
                <span>Voir toutes les séries</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeriesSection;
