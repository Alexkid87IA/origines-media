// src/components/navbar/DesktopNav.tsx
// Navigation desktop : items de navigation avec mega menus

import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { navItems } from './navData';
import MegaMenuArticles from './MegaMenuArticles';
import MegaMenuVideos from './MegaMenuVideos';
import MegaMenuHistoires from './MegaMenuHistoires';
import MegaMenuSeries from './MegaMenuSeries';
import MegaMenuBoutique from './MegaMenuBoutique';
import MegaMenuRecos from './MegaMenuRecos';

interface DesktopNavProps {
  activeDropdown: string | null;
  onSetActiveDropdown: (label: string | null) => void;
  isActiveRoute: (href: string) => boolean;
  onNavigate: (href: string) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
  activeDropdown,
  onSetActiveDropdown,
  isActiveRoute,
  onNavigate,
}) => {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoveredUnivers, setHoveredUnivers] = useState<string>('default');

  const resetHover = () => setHoveredUnivers('default');

  return (
    <LayoutGroup>
      <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Menu principal">
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          const isDropdownOpen = activeDropdown === item.label;
          const isHovered = hoveredNav === item.label;

          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.hasDropdown && onSetActiveDropdown(item.label)}
              onMouseLeave={() => onSetActiveDropdown(null)}
            >
              <button
                onClick={() => onNavigate(item.href)}
                onMouseEnter={() => setHoveredNav(item.label)}
                onMouseLeave={() => setHoveredNav(null)}
                className="group relative h-9 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                {/* Background indicator */}
                {(isActive || isHovered || isDropdownOpen) && (
                  <motion.div
                    layoutId="navActiveIndicator"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      backgroundColor: `${item.hoverColor}10`,
                      boxShadow: `inset 0 0 0 1px ${item.hoverColor}15`
                    }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                {/* Active dot indicator */}
                {isActive && (
                  <motion.div
                    layoutId="navActiveDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: item.hoverColor }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                  />
                )}
                <span
                  className="relative z-10 text-[13px] font-semibold transition-colors duration-300"
                  style={{
                    color: (isHovered || isActive || isDropdownOpen)
                      ? item.hoverColor
                      : '#4B5563'
                  }}
                >
                  {item.label}
                </span>
                {item.hasDropdown && (
                  <ChevronDown
                    className="relative z-10 w-3.5 h-3.5 transition-all duration-300"
                    style={{
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: (isHovered || isActive || isDropdownOpen)
                        ? item.hoverColor
                        : '#9CA3AF'
                    }}
                  />
                )}
              </button>

              {/* Mega Menu ARTICLES */}
              <AnimatePresence>
                {item.label === 'Articles' && isDropdownOpen && (
                  <MegaMenuArticles
                    hoveredUnivers={hoveredUnivers}
                    onHoverUnivers={setHoveredUnivers}
                    onResetHover={resetHover}
                    onNavigate={onNavigate}
                  />
                )}
              </AnimatePresence>

              {/* Mega Menu VIDÉOS */}
              <AnimatePresence>
                {item.label === 'Vidéos' && isDropdownOpen && (
                  <MegaMenuVideos
                    hoveredUnivers={hoveredUnivers}
                    onHoverUnivers={setHoveredUnivers}
                    onResetHover={resetHover}
                    onNavigate={onNavigate}
                  />
                )}
              </AnimatePresence>

              {/* Mega Menu HISTOIRES */}
              <AnimatePresence>
                {item.label === 'Histoires' && isDropdownOpen && (
                  <MegaMenuHistoires
                    hoveredUnivers={hoveredUnivers}
                    onHoverUnivers={setHoveredUnivers}
                    onResetHover={resetHover}
                    onNavigate={onNavigate}
                  />
                )}
              </AnimatePresence>

              {/* Mega Menu SÉRIES */}
              <AnimatePresence>
                {item.label === 'Séries' && isDropdownOpen && (
                  <MegaMenuSeries onNavigate={onNavigate} />
                )}
              </AnimatePresence>

              {/* Mega Menu BOUTIQUE */}
              <AnimatePresence>
                {item.label === 'Boutique' && isDropdownOpen && (
                  <MegaMenuBoutique
                    hoveredUnivers={hoveredUnivers}
                    onHoverUnivers={setHoveredUnivers}
                    onResetHover={resetHover}
                    onNavigate={onNavigate}
                  />
                )}
              </AnimatePresence>

              {/* Mega Menu RECOS */}
              <AnimatePresence>
                {item.label === 'Recos' && isDropdownOpen && (
                  <MegaMenuRecos
                    hoveredUnivers={hoveredUnivers}
                    onHoverUnivers={setHoveredUnivers}
                    onResetHover={resetHover}
                    onNavigate={onNavigate}
                  />
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </nav>
    </LayoutGroup>
  );
};

export default DesktopNav;
