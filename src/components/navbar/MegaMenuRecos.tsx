// src/components/navbar/MegaMenuRecos.tsx
// Mega menu pour la catégorie Recos

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { recoItems } from './navData';

interface MegaMenuRecosProps {
  hoveredUnivers: string;
  onHoverUnivers: (name: string) => void;
  onResetHover: () => void;
  onNavigate: (href: string) => void;
}

const MegaMenuRecos: React.FC<MegaMenuRecosProps> = ({
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
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" />
            <span className="text-sm font-semibold text-gray-900">Nos coups de cœur</span>
          </div>

          {/* Pills outline style */}
          <div className="flex flex-wrap gap-3">
            {recoItems.map((reco) => (
              <button
                key={reco.href}
                onClick={() => onNavigate(reco.href)}
                onMouseEnter={() => onHoverUnivers(reco.name)}
                className="group rounded-full overflow-hidden transition-all duration-300"
                style={{
                  border: `2px solid ${reco.color}`,
                  backgroundColor: hoveredUnivers === reco.name ? reco.color : 'transparent',
                  boxShadow: hoveredUnivers === reco.name ? `0 4px 15px -3px ${reco.color}50` : 'none',
                  transform: hoveredUnivers === reco.name ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <div className="px-5 py-2.5 flex items-center gap-2">
                  <span
                    className="text-sm font-semibold transition-colors duration-300"
                    style={{ color: hoveredUnivers === reco.name ? 'white' : reco.color }}
                  >
                    {reco.name}
                  </span>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-all duration-300"
                    style={{
                      color: hoveredUnivers === reco.name ? 'rgba(255,255,255,0.8)' : `${reco.color}99`,
                      transform: hoveredUnivers === reco.name ? 'translateX(4px)' : 'translateX(0)'
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenuRecos;
