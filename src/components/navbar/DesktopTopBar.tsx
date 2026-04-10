// src/components/navbar/DesktopTopBar.tsx
// Barre supérieure desktop : logo, réseaux sociaux, recherche, CTA

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, PenLine } from 'lucide-react';
import { socialLinks } from './navData';

interface DesktopTopBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

const DesktopTopBar: React.FC<DesktopTopBarProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
}) => {
  return (
    <div className="hidden lg:block">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-between h-[70px]">

          {/* Logo (Left) */}
          <Link to="/" className="flex-shrink-0 group relative">
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.img
              src="/logo-origines.png"
              alt="Origines Media"
              className="h-12 w-auto relative"
              loading="eager"
              decoding="async"
              // @ts-expect-error fetchPriority is valid HTML attribute
              fetchpriority="high"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
              }}
              whileTap={{ scale: 0.98 }}
            />
          </Link>

          {/* Réseaux sociaux (Center-left) */}
          <div className="flex items-center gap-0.5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>

          {/* Recherche (Center) - Premium glass effect */}
          <div className="w-[380px]">
            <form onSubmit={onSearchSubmit} className="relative group" role="search">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/10 via-transparent to-pink-500/10 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 transition-all duration-300 group-focus-within:text-violet-500 group-focus-within:scale-110" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Rechercher un article, une série..."
                aria-label="Rechercher sur le site"
                className="relative w-full pl-12 pr-5 py-3 text-sm text-gray-800 bg-gray-50/80 border border-gray-200/80 rounded-full focus:bg-white focus:border-violet-400/50 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.08),0_4px_16px_-4px_rgba(139,92,246,0.15)] focus:outline-none transition-all duration-300 placeholder:text-gray-400"
              />
            </form>
          </div>

          {/* CTA Principal (Right) - Premium outline */}
          <Link
            to="/racontez-votre-histoire"
            className="group relative flex items-center gap-2.5 px-6 py-2.5 text-sm font-semibold rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Background fill on hover */}
            <div className="absolute inset-0 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            {/* Border */}
            <div className="absolute inset-0 rounded-full border-2 border-gray-900" />
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <PenLine className="w-4 h-4 relative z-10 text-gray-900 group-hover:text-white transition-colors duration-300 group-hover:rotate-[-8deg]" />
            <span className="relative z-10 text-gray-900 group-hover:text-white transition-colors duration-300">Racontez votre histoire</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DesktopTopBar;
