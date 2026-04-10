// src/components/navbar/MegaMenuSeries.tsx
// Mega menu pour la catégorie Séries (avec SeriesCard)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { SeriesItem } from './types';
import { seriesShowcase, seriesFeatured } from './navData';

// ============ SERIES CARD COMPONENT ============
interface SeriesCardProps {
  serie: SeriesItem;
  idx: number;
  onNavigate: (href: string) => void;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ serie, idx, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onNavigate(serie.href)}
      className="group text-left rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03]"
      style={{
        border: `2px solid ${serie.color}`,
        backgroundColor: isHovered ? serie.color : 'transparent',
        boxShadow: isHovered ? `0 8px 20px -5px ${serie.color}50` : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-2.5 flex flex-col gap-1.5">
        {/* Poster thumbnail */}
        <div
          className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md transition-all duration-300"
          style={{ border: `2px solid ${isHovered ? 'rgba(255,255,255,0.3)' : `${serie.color}30`}` }}
        >
          <img
            src={serie.image}
            alt={serie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div>
          <span
            className="text-[8px] font-bold uppercase tracking-widest block transition-colors duration-300"
            style={{ color: isHovered ? 'rgba(255,255,255,0.7)' : `${serie.color}99` }}
          >
            {serie.episodes} ép.
          </span>
          <h4
            className="text-[11px] font-bold leading-tight line-clamp-1 transition-colors duration-300"
            style={{ color: isHovered ? 'white' : serie.color }}
          >
            {serie.title}
          </h4>
        </div>
      </div>
    </button>
  );
};

// ============ MEGA MENU SERIES ============
interface MegaMenuSeriesProps {
  onNavigate: (href: string) => void;
}

const MegaMenuSeries: React.FC<MegaMenuSeriesProps> = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className="fixed inset-x-0 top-[123px] z-50"
    >
      <div className="relative bg-white border-b border-gray-200 shadow-xl overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-8">
            {/* Left side - Series grid */}
            <div className="col-span-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 bg-amber-500 rounded-full" />
                  <span className="text-sm font-semibold text-gray-900">Nos séries</span>
                </div>
                <button
                  onClick={() => onNavigate('/series')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  Tout voir
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid de séries - Outline style */}
              <div className="grid grid-cols-6 gap-3">
                {seriesShowcase.map((serie, idx) => (
                  <SeriesCard
                    key={serie.href}
                    serie={serie}
                    idx={idx}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>

            {/* Right side - Featured episodes */}
            <div className="col-span-4 border-l border-gray-100 pl-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-rose-500 rounded-full" />
                <span className="text-sm font-semibold text-gray-900">Derniers épisodes</span>
              </div>

              <div className="space-y-4">
                {seriesFeatured.map((content) => (
                  <button
                    key={content.href}
                    onClick={() => onNavigate(content.href)}
                    className="group flex gap-3 text-left w-full"
                  >
                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0 shadow-md ring-1 ring-black/5">
                      <img
                        src={content.image}
                        alt={content.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span
                        className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: content.tagColor }}
                      >
                        {content.tag}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
                        {content.title}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenuSeries;
