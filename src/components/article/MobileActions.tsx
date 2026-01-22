// src/components/article/MobileActions.tsx
// Actions mobiles flottantes pour les articles

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Bookmark, List, X } from 'lucide-react';
import { Heading } from './types';

interface MobileActionBarProps {
  isLiked: boolean;
  isBookmarked: boolean;
  onLikeToggle: () => void;
  onBookmarkToggle: () => void;
  onShareClick: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  isLiked,
  isBookmarked,
  onLikeToggle,
  onBookmarkToggle,
  onShareClick
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 lg:hidden z-50">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl">
        <button
          onClick={onLikeToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isLiked
              ? 'bg-pink-100 text-pink-500'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          aria-label={isLiked ? "Retirer le j'aime" : "J'aime"}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={onShareClick}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white font-medium transition-all"
          aria-label="Partager l'article"
        >
          <Share2 className="w-5 h-5" />
          <span>Partager</span>
        </button>

        <button
          onClick={onBookmarkToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isBookmarked
              ? 'bg-violet-100 text-violet-500'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          aria-label={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};

interface MobileTocButtonProps {
  onClick: () => void;
  visible: boolean;
}

export const MobileTocButton: React.FC<MobileTocButtonProps> = ({ onClick, visible }) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 lg:hidden z-50 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-500/30"
      aria-label="Ouvrir le sommaire"
    >
      <List className="w-6 h-6" />
    </button>
  );
};

interface MobileTocModalProps {
  isOpen: boolean;
  onClose: () => void;
  headings: Heading[];
  activeHeading: string;
  onHeadingClick: (id: string) => void;
}

export const MobileTocModal: React.FC<MobileTocModalProps> = ({
  isOpen,
  onClose,
  headings,
  activeHeading,
  onHeadingClick
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-3xl max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900 font-bold text-lg">Sommaire</h3>
                <button onClick={onClose} className="text-gray-400" aria-label="Fermer le sommaire">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-3" aria-label="Sommaire de l'article">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => onHeadingClick(heading.id)}
                    className={`block w-full text-left py-2 px-4 rounded-xl transition-all ${
                      heading.level === 3 ? 'pl-8' : ''
                    } ${
                      activeHeading === heading.id
                        ? 'bg-violet-100 text-violet-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileActionBar;
