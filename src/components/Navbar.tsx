// src/components/Navbar.tsx
// Navbar 2 niveaux - Top bar avec réseaux sociaux + Nav avec 7 catégories

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Imports depuis les modules navbar/
import { DesktopTopBar } from './navbar/index';
import { DesktopNav } from './navbar/index';
import { MobileHeader } from './navbar/index';
import { MobileSearchBar } from './navbar/index';
import { MobileMenu } from './navbar/index';

// ============ COMPONENT ============
const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update shadow state
      setIsScrolled(currentScrollY > 20);

      // Determine scroll direction and visibility
      // Always show navbar at the very top of the page
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show navbar
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down and past threshold - hide navbar
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
    setMobileAccordion(null);
  }, [location.pathname]);

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setActiveDropdown(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* ============ NAVBAR CONTAINER ============ */}
      <div className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
        bg-white/[0.98] backdrop-blur-xl border-b
        ${isScrolled
          ? 'border-gray-200/80 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.1)]'
          : 'border-gray-100/60'
        }
        ${isVisible || isMobileMenuOpen || activeDropdown || searchOpen ? 'translate-y-0' : '-translate-y-full'}
      `}>
        {/* Ligne d'accent premium en haut */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500/0 via-violet-500/40 to-violet-500/0" />

        {/* ============ TOP BAR (Desktop) ============ */}
        <DesktopTopBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearchSubmit={handleSearch}
        />

        {/* Séparateur élégant */}
        <div className="hidden lg:block h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* ============ NAV BAR ============ */}
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-center h-14 sm:h-12 lg:h-[52px]">

            {/* Desktop Navigation */}
            <DesktopNav
              activeDropdown={activeDropdown}
              onSetActiveDropdown={setActiveDropdown}
              isActiveRoute={isActiveRoute}
              onNavigate={handleNavigation}
            />

            {/* Mobile: Logo + burger */}
            <MobileHeader
              isMobileMenuOpen={isMobileMenuOpen}
              searchOpen={searchOpen}
              onToggleSearch={() => setSearchOpen(!searchOpen)}
              onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <MobileSearchBar
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearchSubmit={handleSearch}
              onClose={() => setSearchOpen(false)}
            />
          )}
        </AnimatePresence>

      </div>

      {/* ============ MOBILE MENU - FULLSCREEN PREMIUM ============ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            isActiveRoute={isActiveRoute}
            mobileAccordion={mobileAccordion}
            onSetMobileAccordion={setMobileAccordion}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 hidden lg:block"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-14 sm:h-12 lg:h-[123px]" />
    </>
  );
};

export default Navbar;
