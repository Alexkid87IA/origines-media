// src/components/SeriesSection.tsx
// Section "Nos séries" - Style Magazine Coloré (cohérent avec HeroSection)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
const seriesAccents = [
  { bg: '#6366F1', text: '#ffffff' }, // Indigo
  { bg: '#06B6D4', text: '#ffffff' }, // Cyan
  { bg: '#F59E0B', text: '#ffffff' }, // Amber
  { bg: '#8B5CF6', text: '#ffffff' }, // Violet
  { bg: '#10B981', text: '#ffffff' }, // Emerald
  { bg: '#EC4899', text: '#ffffff' }, // Pink
];

const SeriesSection: React.FC<SeriesSectionProps> = ({ series = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide toutes les 4 secondes
  useEffect(() => {
    if (series.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % series.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [series.length]);

  if (series.length === 0) return null;

  const currentSerie = series[currentIndex];
  const currentAccent = seriesAccents[currentIndex % seriesAccents.length];
  const otherSeries = series.filter((_, i) => i !== currentIndex).slice(0, 4);

  const goToSerie = (index: number) => {
    setCurrentIndex(index);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % series.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + series.length) % series.length);
  };

  return (
    <section className="bg-white py-6 lg:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header - même style que les autres sections */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-4">
          <div>
            <div className="h-0.5 w-10 bg-gray-900 rounded-full mb-2" />
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-0.5">
              Nos séries
            </h2>
            <p className="text-gray-500 text-xs">
              Des récits en plusieurs épisodes pour explorer en profondeur
            </p>
          </div>

          <Link
            to="/series"
            className="group inline-flex items-center gap-1 text-gray-900 font-medium text-xs hover:text-violet-600 transition-colors"
          >
            <span>Toutes les séries</span>
            <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-2 lg:gap-3">

          {/* Main Featured Serie (8 cols) */}
          <motion.div
            className="col-span-12 lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-full min-h-[220px] lg:min-h-[280px] rounded-xl overflow-hidden group">
              {/* Background Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`bg-${currentIndex}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentSerie.imageUrl || '/placeholder.svg'}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Overlay gradient - Neutre */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-gray-900/20" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-3 lg:p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col lg:flex-row lg:items-end gap-3"
                  >
                    {/* Poster thumbnail */}
                    <div className="hidden lg:block flex-shrink-0">
                      <div className="w-16 rounded-md overflow-hidden shadow-2xl ring-2 ring-white/20">
                        <img
                          src={currentSerie.posterUrl || currentSerie.imageUrl}
                          alt=""
                          className="w-full h-auto"
                        />
                      </div>
                    </div>

                    {/* Text content */}
                    <div className="flex-1">
                      {/* Badge série - Style sobre */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider mb-2 bg-white/90 backdrop-blur-sm text-gray-900">
                        <Play className="w-2 h-2" fill="currentColor" />
                        Série • {currentSerie.nombreEpisodes || '?'} épisodes
                      </span>

                      <h3 className="text-base lg:text-lg font-bold text-white mb-1">
                        {typo(currentSerie.titre)}
                      </h3>

                      {currentSerie.description && (
                        <p className="text-white/70 text-[10px] lg:text-xs mb-2 max-w-lg line-clamp-2">
                          {currentSerie.description}
                        </p>
                      )}

                      <Link
                        to={`/series/${currentSerie.slug.current}`}
                        className="inline-flex items-center gap-1 text-white font-semibold text-[10px] hover:gap-1.5 transition-all"
                      >
                        Découvrir la série
                        <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation arrows */}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <button
                  onClick={goPrev}
                  className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <ChevronLeft className="w-3 h-3 text-white" />
                </button>
                <button
                  onClick={goNext}
                  className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <ChevronRight className="w-3 h-3 text-white" />
                </button>
              </div>

              {/* Progress indicators - Style sobre */}
              <div className="absolute bottom-0 left-0 right-0 flex">
                {series.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSerie(index)}
                    className="flex-1 h-1 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20" />
                    {index === currentIndex && (
                      <motion.div
                        className="absolute inset-0 bg-white"
                        initial={{ scaleX: 0, transformOrigin: 'left' }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Side cards - Other series (4 cols) - Style sobre */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-2">
            {otherSeries.map((serie, index) => {
              const originalIndex = series.findIndex(s => s._id === serie._id);
              const accent = seriesAccents[originalIndex % seriesAccents.length];
              const isCurrentlyHovered = false; // Will be managed by CSS

              return (
                <motion.div
                  key={serie._id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group"
                >
                  <button
                    onClick={() => goToSerie(originalIndex)}
                    className="w-full text-left rounded-xl overflow-hidden transition-all duration-300 bg-white ring-1 ring-gray-200 hover:ring-2 hover:shadow-lg"
                    style={{
                      ['--accent-color' as string]: accent.bg,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 10px 25px -5px ${accent.bg}30`;
                      e.currentTarget.style.ringColor = accent.bg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <div className="relative p-2 lg:p-2 flex items-center gap-2">
                      {/* Bordure gauche colorée */}
                      <div
                        className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                        style={{ backgroundColor: accent.bg }}
                      />

                      {/* Poster thumbnail */}
                      <div
                        className="flex-shrink-0 w-8 h-11 lg:w-9 lg:h-12 rounded-sm overflow-hidden shadow-md transition-all duration-300"
                        style={{
                          border: '1px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = accent.bg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                      >
                        <img
                          src={serie.posterUrl || serie.imageUrl}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-[7px] font-bold uppercase tracking-widest text-gray-400 mb-0.5 block transition-colors duration-300 group-hover:text-gray-500"
                        >
                          {serie.nombreEpisodes || '?'} épisodes
                        </span>
                        <h4 className="text-[10px] lg:text-[11px] font-semibold text-gray-900 leading-snug line-clamp-2 transition-colors duration-300">
                          {typo(serie.titre)}
                        </h4>
                      </div>

                      {/* Arrow */}
                      <ArrowRight
                        className="w-2.5 h-2.5 flex-shrink-0 text-gray-400 transition-all duration-300 group-hover:translate-x-1"
                        style={{
                          color: undefined,
                        }}
                      />
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Progress dots below - Style sobre */}
        <div className="mt-3 flex items-center justify-center gap-1">
          {series.map((_, index) => {
            const isActive = index === currentIndex;

            return (
              <button
                key={index}
                onClick={() => goToSerie(index)}
                className="relative h-1 rounded-full transition-all duration-300 overflow-hidden"
                style={{
                  width: isActive ? '18px' : '4px',
                  backgroundColor: isActive ? '#111827' : '#e5e7eb',
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SeriesSection;
