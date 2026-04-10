// src/components/navbar/MobileMenu.tsx
// Menu mobile plein écran avec accordéons

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Search, PenLine, X, Star } from 'lucide-react';
import { socialLinks, navItems, articlesItems, videosItems, histoiresItems, seriesShowcase, recoItems, boutiqueItems } from './navData';

// Mapping des sous-menus pour mobile
const mobileSubMenus: Record<string, { items: Array<{ name: string; href: string; color: string }>; allLink: string; allLabel: string }> = {
  'Articles': { items: articlesItems, allLink: '/articles', allLabel: 'Tous les articles' },
  'Vidéos': { items: videosItems, allLink: '/videos', allLabel: 'Toutes les vidéos' },
  'Histoires': { items: histoiresItems, allLink: '/histoires', allLabel: 'Toutes les histoires' },
  'Séries': { items: seriesShowcase.map(s => ({ name: s.title, href: s.href, color: s.color })), allLink: '/series', allLabel: 'Toutes les séries' },
  'Recos': { items: recoItems, allLink: '/recommandations', allLabel: 'Toutes les recos' },
  'Boutique': { items: boutiqueItems.map(a => ({ name: a.name, href: a.href, color: a.free ? '#10B981' : '#D97706' })), allLink: '/boutique', allLabel: 'Toute la boutique' },
};

interface MobileMenuProps {
  isActiveRoute: (href: string) => boolean;
  mobileAccordion: string | null;
  onSetMobileAccordion: (label: string | null) => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isActiveRoute,
  mobileAccordion,
  onSetMobileAccordion,
  onClose,
}) => {
  return (
    <motion.div
      id="mobile-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="lg:hidden fixed inset-0 z-[100] bg-white"
      role="navigation"
      aria-label="Menu principal mobile"
    >
      {/* Header avec logo et close */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100">
        <Link to="/" onClick={onClose}>
          <img src="/logo-origines.png" alt="Origines Media" className="h-9 w-auto" />
        </Link>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Contenu scrollable */}
      <div className="overflow-y-auto h-[calc(100vh-56px)] pb-safe">
        {/* Navigation principale avec accordéons */}
        <div className="px-5 py-6">
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = isActiveRoute(item.href);
              const isAccordionOpen = mobileAccordion === item.label;
              const subMenu = mobileSubMenus[item.label];

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Header de l'accordéon */}
                  <button
                    onClick={() => onSetMobileAccordion(isAccordionOpen ? null : item.label)}
                    className="w-full group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 active:scale-[0.98]"
                    style={{
                      backgroundColor: isAccordionOpen ? `${item.hoverColor}10` : isActive ? `${item.hoverColor}15` : 'transparent',
                      border: isAccordionOpen ? `2px solid ${item.hoverColor}40` : isActive ? `2px solid ${item.hoverColor}30` : '2px solid transparent'
                    }}
                  >
                    {/* Dot indicateur */}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 transition-transform"
                      style={{ backgroundColor: item.hoverColor }}
                    />

                    {/* Texte */}
                    <span
                      className="text-lg font-semibold transition-colors"
                      style={{ color: isAccordionOpen || isActive ? item.hoverColor : '#1F2937' }}
                    >
                      {item.label}
                    </span>

                    {/* Chevron */}
                    <ChevronDown
                      className="w-5 h-5 ml-auto transition-transform duration-300"
                      style={{
                        color: isAccordionOpen || isActive ? item.hoverColor : '#9CA3AF',
                        transform: isAccordionOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </button>

                  {/* Contenu de l'accordéon */}
                  <AnimatePresence>
                    {isAccordionOpen && subMenu && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pb-3 pl-8 pr-4 space-y-1">
                          {/* Lien "Voir tout" */}
                          <Link
                            to={subMenu.allLink}
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.98]"
                            style={{ backgroundColor: `${item.hoverColor}15` }}
                          >
                            <span className="text-base font-bold" style={{ color: item.hoverColor }}>
                              {subMenu.allLabel}
                            </span>
                            <ArrowRight className="w-4 h-4 ml-auto" style={{ color: item.hoverColor }} />
                          </Link>

                          {/* Sous-items en grille de pills */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {subMenu.items.slice(0, 8).map((subItem) => (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                onClick={onClose}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all active:scale-95"
                                style={{
                                  backgroundColor: `${subItem.color}15`,
                                  color: subItem.color,
                                  border: `1px solid ${subItem.color}30`
                                }}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: subItem.color }}
                                />
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* Séparateur avec gradient */}
        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Section Découvrir */}
        <div className="px-5 py-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">
            Découvrir
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Bibliothèque */}
            <Link
              to="/bibliotheque"
              onClick={onClose}
              className="group p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Search className="w-5 h-5" />
              </div>
              <p className="font-bold text-base">Bibliothèque</p>
              <p className="text-white/70 text-xs mt-1">Tout explorer</p>
            </Link>

            {/* Univers */}
            <Link
              to="/univers"
              onClick={onClose}
              className="group p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Star className="w-5 h-5" />
              </div>
              <p className="font-bold text-base">Univers</p>
              <p className="text-white/70 text-xs mt-1">Par thématique</p>
            </Link>
          </div>
        </div>

        {/* Séparateur */}
        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Réseaux sociaux */}
        <div className="px-5 py-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">
            Suivez-nous
          </p>
          <div className="flex items-center justify-center gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90"
                style={{
                  backgroundColor: `${social.color}15`,
                  color: social.color
                }}
                aria-label={social.label}
              >
                <social.icon />
              </motion.a>
            ))}
          </div>
        </div>

        {/* CTA Principal */}
        <div className="px-5 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/racontez-votre-histoire"
              onClick={onClose}
              className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold text-base active:scale-[0.98] transition-transform shadow-lg shadow-gray-900/20"
            >
              <PenLine className="w-5 h-5" />
              Racontez votre histoire
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
