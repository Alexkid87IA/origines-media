// src/components/navbar/MegaMenuHistoires.tsx
// Mega menu pour la catégorie Histoires

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { histoiresItems } from './navData';

interface MegaMenuHistoiresProps {
  hoveredUnivers: string;
  onHoverUnivers: (name: string) => void;
  onResetHover: () => void;
  onNavigate: (href: string) => void;
}

const MegaMenuHistoires: React.FC<MegaMenuHistoiresProps> = ({
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
            {/* Left side - Émotions */}
            <div className="col-span-7">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-rose-500 rounded-full" />
                <span className="text-sm font-semibold text-gray-900">Explorer par thème</span>
              </div>

              {/* Horizontal pills wrap - Outline style */}
              <div className="flex flex-wrap gap-2">
                {histoiresItems.map((emotion) => (
                  <button
                    key={emotion.href}
                    onClick={() => onNavigate(emotion.href)}
                    onMouseEnter={() => onHoverUnivers(emotion.name)}
                    className="group rounded-full overflow-hidden transition-all duration-300"
                    style={{
                      border: `2px solid ${emotion.color}`,
                      backgroundColor: hoveredUnivers === emotion.name ? emotion.color : 'transparent',
                      boxShadow: hoveredUnivers === emotion.name ? `0 4px 15px -3px ${emotion.color}50` : 'none',
                      transform: hoveredUnivers === emotion.name ? 'scale(1.03)' : 'scale(1)'
                    }}
                  >
                    <div className="px-4 py-2 flex items-center gap-2">
                      <span
                        className="text-sm font-semibold transition-colors duration-300"
                        style={{ color: hoveredUnivers === emotion.name ? 'white' : emotion.color }}
                      >
                        {emotion.name}
                      </span>
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-all duration-300"
                        style={{
                          color: hoveredUnivers === emotion.name ? 'rgba(255,255,255,0.8)' : `${emotion.color}99`,
                          transform: hoveredUnivers === emotion.name ? 'translateX(2px)' : 'translateX(0)'
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
                  <div className="h-1 w-8 bg-rose-500 rounded-full" />
                  <span className="text-sm font-semibold text-gray-900">Accès rapide</span>
                </div>

                <button
                  onClick={() => onNavigate('/histoires')}
                  className="group w-full p-4 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-xs font-medium text-white/70 mb-0.5">Découvrir</p>
                      <p className="text-base font-bold">Toutes les histoires</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Popular themes */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Populaires</p>
                <div className="flex flex-wrap gap-2">
                  {['Émotions & Bien-être', 'Parcours & Résilience', 'Développement'].map((name) => {
                    const theme = histoiresItems.find(e => e.name === name);
                    return theme && (
                      <button
                        key={name}
                        onClick={() => onNavigate(theme.href)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: `${theme.color}15`,
                          color: theme.color,
                          border: `1px solid ${theme.color}30`
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

export default MegaMenuHistoires;
