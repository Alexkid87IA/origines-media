// src/components/navbar/MegaMenuVideos.tsx
// Mega menu pour la catégorie Vidéos

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { videosItems } from './navData';

interface MegaMenuVideosProps {
  hoveredUnivers: string;
  onHoverUnivers: (name: string) => void;
  onResetHover: () => void;
  onNavigate: (href: string) => void;
}

const MegaMenuVideos: React.FC<MegaMenuVideosProps> = ({
  hoveredUnivers,
  onHoverUnivers,
  onResetHover,
  onNavigate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className="fixed inset-x-0 top-[123px] z-50"
      onMouseLeave={onResetHover}
    >
      <div className="relative bg-white border-b border-gray-200 shadow-xl overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-8">
            {/* Left side - Formats */}
            <div className="col-span-7">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-cyan-500 rounded-full" />
                <span className="text-sm font-semibold text-gray-900">Explorer par format</span>
              </div>

              {/* Horizontal pills wrap - Outline style */}
              <div className="flex flex-wrap gap-2">
                {videosItems.map((format) => (
                  <button
                    key={format.href}
                    onClick={() => onNavigate(format.href)}
                    onMouseEnter={() => onHoverUnivers(format.name)}
                    className="group rounded-full overflow-hidden transition-all duration-300"
                    style={{
                      border: `2px solid ${format.color}`,
                      backgroundColor: hoveredUnivers === format.name ? format.color : 'transparent',
                      boxShadow: hoveredUnivers === format.name ? `0 4px 15px -3px ${format.color}50` : 'none',
                      transform: hoveredUnivers === format.name ? 'scale(1.03)' : 'scale(1)'
                    }}
                  >
                    <div className="px-4 py-2 flex items-center gap-2">
                      <span
                        className="text-sm font-semibold transition-colors duration-300"
                        style={{ color: hoveredUnivers === format.name ? 'white' : format.color }}
                      >
                        {format.name}
                      </span>
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-all duration-300"
                        style={{
                          color: hoveredUnivers === format.name ? 'rgba(255,255,255,0.8)' : `${format.color}99`,
                          transform: hoveredUnivers === format.name ? 'translateX(2px)' : 'translateX(0)'
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - CTA & Quick actions */}
            <div className="col-span-5 border-l border-gray-100 pl-8 flex flex-col justify-between">
              {/* Main CTA */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-8 bg-cyan-500 rounded-full" />
                  <span className="text-sm font-semibold text-gray-900">Accès rapide</span>
                </div>

                <button
                  onClick={() => onNavigate('/videos')}
                  className="group w-full p-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-xs font-medium text-white/70 mb-0.5">Découvrir</p>
                      <p className="text-base font-bold">Toutes les vidéos</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Popular formats */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Populaires</p>
                <div className="flex flex-wrap gap-2">
                  {['Reportages', 'Shorts', 'Live'].map((name) => {
                    const format = videosItems.find(f => f.name === name);
                    return format && (
                      <button
                        key={name}
                        onClick={() => onNavigate(format.href)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: `${format.color}15`,
                          color: format.color,
                          border: `1px solid ${format.color}30`
                        }}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenuVideos;
