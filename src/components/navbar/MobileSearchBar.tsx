// src/components/navbar/MobileSearchBar.tsx
// Barre de recherche mobile (affichée/cachée via AnimatePresence)

import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface MobileSearchBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="lg:hidden border-t border-gray-100 overflow-hidden"
    >
      <form onSubmit={onSearchSubmit} className="p-3 flex gap-2" role="search">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Rechercher..."
            aria-label="Rechercher sur le site"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:border-gray-400 focus:outline-none"
            autoFocus
          />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-400"
          aria-label="Fermer la recherche"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </form>
    </motion.div>
  );
};

export default MobileSearchBar;
