// src/components/article/ShareModal.tsx
// Modal de partage pour les articles

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Check } from 'lucide-react';
import { shareButtons } from './SocialIcons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: string) => void;
  copySuccess: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShare,
  copySuccess
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-bold text-lg">Partager</h3>
              <button onClick={onClose} className="text-gray-400" aria-label="Fermer">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {shareButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => onShare(btn.id)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300"
                  style={{ backgroundColor: `${btn.color}10` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = btn.color;
                    const span = e.currentTarget.querySelector('span') as HTMLElement;
                    const svg = e.currentTarget.querySelector('svg') as SVGElement;
                    if (span) span.style.color = 'white';
                    if (svg) svg.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${btn.color}10`;
                    const span = e.currentTarget.querySelector('span') as HTMLElement;
                    const svg = e.currentTarget.querySelector('svg') as SVGElement;
                    if (span) span.style.color = '#6B7280';
                    if (svg) svg.style.color = btn.color;
                  }}
                  aria-label={`Partager sur ${btn.label}`}
                >
                  <div style={{ color: btn.color }}>
                    <btn.icon />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{btn.label}</span>
                </button>
              ))}
              <button
                onClick={() => onShare('copy')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-violet-50 hover:bg-violet-500 transition-all duration-300 group"
                aria-label="Copier le lien"
              >
                {copySuccess ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Link2 className="w-4 h-4 text-violet-500 group-hover:text-white" />
                )}
                <span className="text-[10px] text-gray-500 group-hover:text-white font-medium">
                  {copySuccess ? 'Copié' : 'Lien'}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
