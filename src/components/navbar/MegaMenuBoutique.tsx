// src/components/navbar/MegaMenuBoutique.tsx
// Mega menu pour la catégorie Boutique

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { boutiqueItems } from './navData';

interface MegaMenuBoutiqueProps {
  hoveredUnivers: string;
  onHoverUnivers: (name: string) => void;
  onResetHover: () => void;
  onNavigate: (href: string) => void;
}

const MegaMenuBoutique: React.FC<MegaMenuBoutiqueProps> = ({
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
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="grid grid-cols-12 gap-8">
            {/* Left side - Guides */}
            <div className="col-span-7">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-8 bg-amber-500 rounded-full" />
                <span className="text-sm font-semibold text-gray-900">Nos guides</span>
              </div>

              {/* Guides pills */}
              <div className="flex flex-wrap gap-2">
                {boutiqueItems.map((item) => {
                  const isHovered = hoveredUnivers === item.name;
                  const baseColor = item.highlight ? '#F59E0B' : '#D97706';
                  return (
                    <button
                      key={item.href}
                      onClick={() => onNavigate(item.href)}
                      onMouseEnter={() => onHoverUnivers(item.name)}
                      className="group rounded-full overflow-hidden transition-all duration-300"
                      style={{
                        border: `2px solid ${baseColor}`,
                        backgroundColor: isHovered ? baseColor : 'transparent',
                        boxShadow: isHovered ? `0 4px 15px -3px ${baseColor}50` : 'none',
                        transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      <div className="px-4 py-2 flex items-center gap-3">
                        <div className="flex flex-col items-start">
                          <span
                            className="text-sm font-semibold transition-colors duration-300"
                            style={{ color: isHovered ? 'white' : baseColor }}
                          >
                            {item.name}
                          </span>
                          <span
                            className="text-[10px] transition-colors duration-300"
                            style={{ color: isHovered ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}
                          >
                            {item.subtitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-xs font-bold transition-colors duration-300"
                            style={{ color: isHovered ? 'white' : (item.free ? '#10B981' : baseColor) }}
                          >
                            {item.price}
                          </span>
                          {item.originalPrice && (
                            <span
                              className="text-[10px] line-through transition-colors duration-300"
                              style={{ color: isHovered ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }}
                            >
                              {item.originalPrice}
                            </span>
                          )}
                        </div>
                        <ArrowRight
                          className="w-3.5 h-3.5 transition-all duration-300"
                          style={{
                            color: isHovered ? 'rgba(255,255,255,0.8)' : `${baseColor}99`,
                            transform: isHovered ? 'translateX(2px)' : 'translateX(0)'
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side - CTA */}
            <div className="col-span-5 border-l border-gray-100 pl-8 flex flex-col justify-between">
              {/* Main CTA */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-8 bg-amber-500 rounded-full" />
                  <span className="text-sm font-semibold text-gray-900">Accès rapide</span>
                </div>

                <button
                  onClick={() => onNavigate('/boutique')}
                  className="group w-full p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-xs font-medium text-white/70 mb-0.5">Découvrir</p>
                      <p className="text-base font-bold">Toute la Boutique</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  2,500+ apprenants
                </span>
                <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  4.9/5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenuBoutique;
