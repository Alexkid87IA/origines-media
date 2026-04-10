// src/components/navbar/MegaMenuArticles.tsx
// Mega menu pour la catégorie Articles

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { articlesItems } from './navData';

interface MegaMenuArticlesProps {
  hoveredUnivers: string;
  onHoverUnivers: (name: string) => void;
  onResetHover: () => void;
  onNavigate: (href: string) => void;
}

const MegaMenuArticles: React.FC<MegaMenuArticlesProps> = ({
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
            {/* Left side - Catégories */}
            <div className="col-span-7">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                <span className="text-sm font-semibold text-gray-900">Explorer par catégorie</span>
              </div>

              {/* Horizontal pills wrap - Outline style */}
              <div className="flex flex-wrap gap-2">
                {articlesItems.map((cat) => (
                  <button
                    key={cat.href}
                    onClick={() => onNavigate(cat.href)}
                    onMouseEnter={() => onHoverUnivers(cat.name)}
                    className="group rounded-full overflow-hidden transition-all duration-300"
                    style={{
                      border: `2px solid ${cat.color}`,
                      backgroundColor: hoveredUnivers === cat.name ? cat.color : 'transparent',
                      boxShadow: hoveredUnivers === cat.name ? `0 4px 15px -3px ${cat.color}50` : 'none',
                      transform: hoveredUnivers === cat.name ? 'scale(1.03)' : 'scale(1)'
                    }}
                  >
                    <div className="px-4 py-2 flex items-center gap-2">
                      <span
                        className="text-sm font-semibold transition-colors duration-300"
                        style={{ color: hoveredUnivers === cat.name ? 'white' : cat.color }}
                      >
                        {cat.name}
                      </span>
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-all duration-300"
                        style={{
                          color: hoveredUnivers === cat.name ? 'rgba(255,255,255,0.8)' : `${cat.color}99`,
                          transform: hoveredUnivers === cat.name ? 'translateX(2px)' : 'translateX(0)'
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
                  <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-semibold text-gray-900">Accès rapide</span>
                </div>

                <button
                  onClick={() => onNavigate('/articles')}
                  className="group w-full p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-xs font-medium text-white/70 mb-0.5">Découvrir</p>
                      <p className="text-base font-bold">Tous les articles</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Popular categories */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Populaires</p>
                <div className="flex flex-wrap gap-2">
                  {['Psychologie', 'Voyage', 'Santé'].map((name) => {
                    const cat = articlesItems.find(u => u.name === name);
                    return cat && (
                      <button
                        key={name}
                        onClick={() => onNavigate(cat.href)}
                        className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: `${cat.color}15`,
                          color: cat.color,
                          border: `1px solid ${cat.color}30`
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

export default MegaMenuArticles;
