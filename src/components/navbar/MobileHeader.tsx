// src/components/navbar/MobileHeader.tsx
// Header mobile : logo, bouton recherche, bouton hamburger

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  searchOpen: boolean;
  onToggleSearch: () => void;
  onToggleMobileMenu: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  isMobileMenuOpen,
  searchOpen,
  onToggleSearch,
  onToggleMobileMenu,
}) => {
  return (
    <div className="lg:hidden flex items-center justify-between w-full">
      <Link to="/" className="group">
        <motion.img
          src="/logo-origines.png"
          alt="Origines Media"
          className="h-10 w-auto"
          whileHover={{
            scale: 1.05,
            rotate: [0, -2, 2, 0],
            transition: {
              scale: { duration: 0.2 },
              rotate: { duration: 0.4, ease: "easeInOut" }
            }
          }}
          whileTap={{ scale: 0.95 }}
        />
      </Link>

      <div className="flex items-center gap-1">
        {/* Search mobile */}
        <button
          onClick={onToggleSearch}
          className="p-2 text-gray-600"
          aria-label={searchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
          aria-expanded={searchOpen}
        >
          <Search className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Burger */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-gray-600"
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
