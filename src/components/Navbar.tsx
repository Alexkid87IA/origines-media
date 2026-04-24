// src/components/Navbar.tsx
// Navbar magazine — 2 niveaux
// Top: Logo · Recherche · S'abonner
// Bottom: 10 catégories en uppercase

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { getUniversColors } from '../lib/universColors';

import {
  socialLinks,
} from './navbar/navData';

// Les 10 catégories du screenshot
const categories = [
  { name: 'Psychologie', href: '/univers/psychologie' },
  { name: 'Société', href: '/univers/societe' },
  { name: 'Famille', href: '/univers/famille' },
  { name: 'Voyage', href: '/univers/voyage' },
  { name: 'Spiritualité', href: '/univers/spiritualite' },
  { name: 'Carrière', href: '/univers/carriere' },
  { name: 'Art & Créativité', href: '/univers/art-creativite' },
  { name: 'Santé', href: '/univers/sante' },
  { name: 'Tech', href: '/univers/tech' },
  { name: 'Business', href: '/univers/business' },
];

// Liens secondaires pour le menu mobile
const secondaryLinks = [
  { name: 'Articles', href: '/articles' },
  { name: 'Vidéos', href: '/videos' },
  { name: 'Histoires', href: '/histoires' },
  { name: 'Séries', href: '/series' },
  { name: 'Recos', href: '/recommandations' },
  { name: 'Boutique', href: '/boutique' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const isActiveCategory = (href: string) => {
    return location.pathname.startsWith(href);
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
      {/* ============ NAVBAR ============ */}
      <div
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isVisible || isMobileMenuOpen || searchOpen ? 'translate-y-0' : '-translate-y-full'}
        `}
        style={{
          backgroundColor: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(12px)',
          boxShadow: isScrolled ? '0 1px 8px rgba(0,0,0,0.04)' : 'none',
        }}
      >

        {/* ── Top bar : Logo + Search + S'abonner ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[56px] lg:h-[64px]">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 w-[160px] flex items-center">
              <img
                src="/logo-origines.png"
                alt="Origines Media"
                className="h-9 lg:h-10 w-auto"
                loading="eager"
                decoding="async"
              />
            </Link>

            {/* Right: Search + S'abonner (desktop) + Burger (mobile) */}
            <div className="flex items-center gap-3">
              {/* Search icon */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 transition-opacity hover:opacity-60"
                style={{ color: '#3A3A3A' }}
                aria-label={searchOpen ? 'Fermer la recherche' : 'Rechercher'}
              >
                {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* S'abonner (desktop) */}
              <Link
                to="/newsletter"
                className="hidden sm:inline-flex items-center px-5 py-2 font-inter-tight text-[13px] font-semibold transition-all duration-200 hover:bg-[#0A0A0A] hover:text-[#F7F5F0]"
                style={{
                  border: '1.5px solid #0A0A0A',
                  color: '#0A0A0A',
                }}
              >
                S'abonner
              </Link>

              {/* Burger (mobile) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2"
                style={{ color: '#3A3A3A' }}
                aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ── Search overlay ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
              style={{ borderTop: '1px solid #E8E5DE' }}
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <form onSubmit={handleSearch} className="relative" role="search">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#B8B6AF' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un article, une série..."
                    aria-label="Rechercher sur le site"
                    className="w-full pl-11 pr-4 py-2.5 font-inter-tight text-[14px] focus:outline-none"
                    style={{
                      border: '1px solid #B8B6AF',
                      color: '#0A0A0A',
                      backgroundColor: '#FFF',
                    }}
                    autoFocus
                  />
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Séparateur ── */}
        <div className="h-px" style={{ backgroundColor: '#E8E5DE' }} />

        {/* ── Barre catégories (desktop) ── */}
        <div className="hidden lg:block">
          <div className="max-w-6xl mx-auto px-8">
            <nav
              className="flex items-center justify-center gap-7 h-[44px]"
              role="navigation"
              aria-label="Catégories"
            >
              {categories.map((cat) => {
                const isActive = isActiveCategory(cat.href);
                const colors = getUniversColors(cat.name);
                return (
                  <Link
                    key={cat.href}
                    to={cat.href}
                    className="relative font-inter-tight text-[13px] uppercase tracking-[0.06em] whitespace-nowrap transition-colors duration-200 hover:opacity-70"
                    style={{
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? colors.dark : '#3A3A3A',
                    }}
                  >
                    {cat.name}
                    {isActive && (
                      <motion.div
                        layoutId="categoryActiveBorder"
                        className="absolute -bottom-[11px] left-0 right-0 h-[2px]"
                        style={{ backgroundColor: colors.dark }}
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* ============ MOBILE MENU ============ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-[100]"
            style={{ backgroundColor: '#FFF' }}
            role="navigation"
            aria-label="Menu principal mobile"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14" style={{ borderBottom: '1px solid #E8E5DE' }}>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/logo-origines.png" alt="Origines Media" className="h-9 w-auto" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center"
                style={{ color: '#3A3A3A' }}
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-[calc(100vh-56px)] pb-safe">

              {/* Catégories */}
              <div className="px-5 py-6">
                <p className="font-jetbrains text-[10px] uppercase tracking-[0.14em] mb-4 px-2" style={{ color: '#B8B6AF' }}>
                  Catégories
                </p>
                <nav className="space-y-0.5">
                  {categories.map((cat, index) => {
                    const isActive = isActiveCategory(cat.href);
                    const colors = getUniversColors(cat.name);
                    return (
                      <motion.div
                        key={cat.href}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link
                          to={cat.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 transition-colors"
                          style={{ color: isActive ? colors.dark : '#0A0A0A' }}
                        >
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: colors.mid }}
                          />
                          <span
                            className="font-inter-tight text-[15px] uppercase tracking-[0.04em]"
                            style={{ fontWeight: isActive ? 700 : 500 }}
                          >
                            {cat.name}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Séparateur */}
              <div className="mx-5 h-px" style={{ backgroundColor: '#E8E5DE' }} />

              {/* Liens secondaires */}
              <div className="px-5 py-6">
                <p className="font-jetbrains text-[10px] uppercase tracking-[0.14em] mb-4 px-2" style={{ color: '#B8B6AF' }}>
                  Explorer
                </p>
                <div className="flex flex-wrap gap-2 px-2">
                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2 font-inter-tight text-[13px] font-medium transition-opacity active:opacity-70"
                      style={{
                        border: '1.5px solid #0A0A0A',
                        color: '#0A0A0A',
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Séparateur */}
              <div className="mx-5 h-px" style={{ backgroundColor: '#E8E5DE' }} />

              {/* Réseaux sociaux */}
              <div className="px-5 py-6">
                <p className="font-jetbrains text-[10px] uppercase tracking-[0.14em] mb-4 px-2" style={{ color: '#B8B6AF' }}>
                  Suivez-nous
                </p>
                <div className="flex items-center justify-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
                      style={{ color: '#3A3A3A' }}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-8">
                <Link
                  to="/newsletter"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-6 py-3.5 font-inter-tight font-semibold text-[14px]"
                  style={{
                    backgroundColor: '#0A0A0A',
                    color: '#F7F5F0',
                  }}
                >
                  S'abonner
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer — hauteur de la navbar */}
      <div className="h-14 lg:h-[109px]" />
    </>
  );
};

export default Navbar;
