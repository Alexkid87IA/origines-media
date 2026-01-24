// src/components/Navbar.tsx
// Navbar 2 niveaux - Top bar avec réseaux sociaux + Nav avec 7 catégories

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ChevronDown, ArrowRight, Search, PenLine, X, Star } from 'lucide-react';

// Imports depuis les modules navbar/
import type { SeriesItem } from './navbar/types';
import {
  socialLinks,
  seriesShowcase,
  seriesFeatured,
  academieItems,
  recoItems,
  articlesItems,
  histoiresItems,
  videosItems,
  navItems,
} from './navbar/navData';

// Mapping des sous-menus pour mobile
const mobileSubMenus: Record<string, { items: Array<{ name: string; href: string; color: string }>; allLink: string; allLabel: string }> = {
  'Articles': { items: articlesItems, allLink: '/articles', allLabel: 'Tous les articles' },
  'Vidéos': { items: videosItems, allLink: '/videos', allLabel: 'Toutes les vidéos' },
  'Histoires': { items: histoiresItems, allLink: '/histoires', allLabel: 'Toutes les histoires' },
  'Séries': { items: seriesShowcase.map(s => ({ name: s.title, href: s.href, color: s.color })), allLink: '/series', allLabel: 'Toutes les séries' },
  'Recos': { items: recoItems, allLink: '/recommandations', allLabel: 'Toutes les recos' },
  'Académie': { items: academieItems.map(a => ({ name: a.name, href: a.href, color: a.free ? '#10B981' : '#D97706' })), allLink: '/academie', allLabel: 'Toute l\'académie' },
};

// ============ SERIES CARD COMPONENT ============
interface SeriesCardProps {
  serie: SeriesItem;
  idx: number;
  onNavigate: (href: string) => void;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ serie, idx, onNavigate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onNavigate(serie.href)}
      className="group text-left rounded-xl overflow-hidden transition-all duration-150 hover:scale-[1.03]"
      style={{
        border: `2px solid ${serie.color}`,
        backgroundColor: isHovered ? serie.color : 'transparent',
        boxShadow: isHovered ? `0 8px 20px -5px ${serie.color}50` : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative p-2.5 flex flex-col gap-1.5">
        {/* Poster thumbnail */}
        <div
          className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md transition-all duration-150"
          style={{ border: `2px solid ${isHovered ? 'rgba(255,255,255,0.3)' : `${serie.color}30`}` }}
        >
          <img
            src={serie.image}
            alt={serie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div>
          <span
            className="text-[8px] font-bold uppercase tracking-widest block transition-colors duration-150"
            style={{ color: isHovered ? 'rgba(255,255,255,0.7)' : `${serie.color}99` }}
          >
            {serie.episodes} ép.
          </span>
          <h4
            className="text-[11px] font-bold leading-tight line-clamp-1 transition-colors duration-150"
            style={{ color: isHovered ? 'white' : serie.color }}
          >
            {serie.title}
          </h4>
        </div>
      </div>
    </button>
  );
};

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
  const [hoveredUnivers, setHoveredUnivers] = useState<string>('default');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
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
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${isScrolled ? 'bg-white shadow-sm' : 'bg-white'}
        border-b border-gray-100
        ${isVisible || isMobileMenuOpen || activeDropdown || searchOpen ? 'translate-y-0' : '-translate-y-full'}
      `}>

        {/* ============ TOP BAR (Desktop) ============ */}
        <div className="hidden lg:block border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 gap-4">

              {/* Logo + Réseaux sociaux (Left - aligned left) */}
              <div className="flex items-center gap-6">
                <Link to="/" className="flex-shrink-0">
                  <motion.img
                    src="/logo-origines.png"
                    alt="Origines Media"
                    className="h-11 w-auto"
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

                {/* Réseaux sociaux */}
                <div className="flex items-center gap-1">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                      aria-label={social.label}
                    >
                      <social.icon />
                    </a>
                  ))}
                </div>
              </div>

              {/* Recherche (Center - truly centered) */}
              <div className="w-80">
                <form onSubmit={handleSearch} className="relative" role="search">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    aria-label="Rechercher sur le site"
                    className="w-full pl-9 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:border-gray-300 focus:outline-none transition-all placeholder:text-gray-400"
                  />
                </form>
              </div>

              {/* CTA Principal (Right - aligned right) */}
              <div className="flex justify-end">
                <Link
                  to="/racontez-votre-histoire"
                  className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-900 border-2 border-gray-900 rounded-full transition-all duration-300 hover:bg-gray-900 hover:text-white hover:shadow-lg hover:-translate-y-0.5"
                >
                  <PenLine className="w-4 h-4 transition-transform duration-300 group-hover:rotate-[-8deg]" />
                  <span>Racontez votre histoire</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ============ NAV BAR ============ */}
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-center h-12">

            {/* Desktop Navigation */}
            <LayoutGroup>
            <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Menu principal">
              {navItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                const isDropdownOpen = activeDropdown === item.label;

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      onClick={() => handleNavigation(item.href)}
                      onMouseEnter={() => setHoveredNav(item.label)}
                      onMouseLeave={() => setHoveredNav(null)}
                      className="group relative h-7 px-2.5 rounded-md transition-colors duration-200 flex items-center justify-center gap-1 hover:bg-gray-100/60"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navActiveIndicator"
                          className="absolute inset-0 rounded-md bg-gray-100"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span
                        className="relative z-10 text-xs font-semibold transition-colors duration-200"
                        style={{
                          color: (hoveredNav === item.label || isActive || isDropdownOpen)
                            ? item.hoverColor
                            : item.color
                        }}
                      >
                        {item.label}
                      </span>
                      {item.hasDropdown && (
                        <ChevronDown
                          className="relative z-10 w-2.5 h-2.5 transition-transform duration-200"
                          style={{
                            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: (hoveredNav === item.label || isActive || isDropdownOpen)
                              ? item.hoverColor
                              : item.color
                          }}
                        />
                      )}
                    </button>

                    {/* Mega Menu ARTICLES - Style Premium avec catégories */}
                    <AnimatePresence>
                      {item.label === 'Articles' && isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.12, ease: "easeOut" }}
                          className="fixed inset-x-0 top-[104px] z-50"
                          onMouseLeave={() => setHoveredUnivers('default')}
                        >
                          <div className="relative bg-white border-b border-gray-200 shadow-xl overflow-hidden">
                            <div className="max-w-6xl mx-auto px-6 py-6">
                              <div className="grid grid-cols-12 gap-8">
                                {/* Left side - Catégories */}
                                <div className="col-span-7">
                                  {/* Header */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                                    <span className="text-sm font-semibold text-gray-900">Explorer par catégorie</span>
                                  </div>

                                  {/* Horizontal pills wrap - Outline style */}
                                  <div className="flex flex-wrap gap-2">
                                    {articlesItems.map((cat) => (
                                      <button
                                        key={cat.href}
                                        onClick={() => handleNavigation(cat.href)}
                                        onMouseEnter={() => setHoveredUnivers(cat.name)}
                                        className="group rounded-full overflow-hidden transition-all duration-100"
                                        style={{
                                          border: `2px solid ${cat.color}`,
                                          backgroundColor: hoveredUnivers === cat.name ? cat.color : 'transparent',
                                          boxShadow: hoveredUnivers === cat.name ? `0 4px 15px -3px ${cat.color}50` : 'none',
                                          transform: hoveredUnivers === cat.name ? 'scale(1.03)' : 'scale(1)'
                                        }}
                                      >
                                        <div className="px-4 py-2 flex items-center gap-2">
                                          <span
                                            className="text-sm font-semibold transition-colors duration-100"
                                            style={{ color: hoveredUnivers === cat.name ? 'white' : cat.color }}
                                          >
                                            {cat.name}
                                          </span>
                                          <ArrowRight
                                            className="w-3.5 h-3.5 transition-all duration-100"
                                            style={{
                                              color: hoveredUnivers === cat.name ? 'rgba(255,255,255,0.8)' : `${cat.color}99`,
                                              transform: hoveredUnivers === cat.name ? 'translateX(2px)' : 'translateX(0)'
                                            }}
                                          />
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Right side - CTA & Quick actions */}
                                <div className="col-span-5 border-l border-gray-100 pl-8 flex flex-col justify-between">
                                  {/* Main CTA */}
                                  <div>
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="h-1 w-8 bg-emerald-500 rounded-full" />
                                      <span className="text-sm font-semibold text-gray-900">Accès rapide</span>
                                    </div>

                                    <button
                                      onClick={() => handleNavigation('/articles')}
                                      className="group w-full p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white transition-all duration-150 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="text-left">
                                          <p className="text-xs font-medium text-white/70 mb-0.5">Découvrir</p>
                                          <p className="text-base font-bold">Tous les articles</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                          <ArrowRight className="w-5 h-5" />
                                        </div>
                                      </div>
                                    </button>
                                  </div>

                                  {/* Popular categories */}
                                  <div className="mt-4">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Populaires</p>
                                    <div className="flex flex-wrap gap-2">
                                      {['Psychologie', 'Voyage', 'Santé'].map((name) => {
                                        const cat = articlesItems.find(u => u.name === name);
                                        return cat && (
                                          <button
                                            key={name}
                                            onClick={() => handleNavigation(cat.href)}
                                            className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-100 hover:scale-105"
                                            style={{
                                              backgroundColor: `${cat.color}15`,
                                              color: cat.color,
                                              border: `1px solid ${cat.color}30`
                                            }}
                                          >
                                            {name}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mega Menu VIDÉOS - Formats */}
                    <AnimatePresence>
                      {item.label === 'Vidéos' && isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.12, ease: "easeOut" }}
                          className="fixed inset-x-0 top-[104px] z-50"
                          onMouseLeave={() => setHoveredUnivers('default')}
                        >
                          <div className="relative bg-white border-b border-gray-200 shadow-xl overflow-hidden">
                            <div className="max-w-6xl mx-auto px-6 py-6">
                              <div className="grid grid-cols-12 gap-8">
                                {/* Left side - Formats */}
                                <div className="col-span-7">
                                  {/* Header */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="h-1 w-8 bg-cyan-500 rounded-full" />
                                    <span className="text-sm font-semibold text-gray-900">Explorer par format</span>
                                  </div>

                                  {/* Horizontal pills wrap - Outline style */}
                                  <div className="flex flex-wrap gap-2">
                                    {videosItems.map((format) => (
                                      <button
                                        key={format.href}
                                        onClick={() => handleNavigation(format.href)}
                                        onMouseEnter={() => setHoveredUnivers(format.name)}
                                        className="group rounded-full overflow-hidden transition-all duration-100"
                                        style={{
                                          border: `2px solid ${format.color}`,
                                          backgroundColor: hoveredUnivers === format.name ? format.color : 'transparent',
                                          boxShadow: hoveredUnivers === format.name ? `0 4px 15px -3px ${format.color}50` : 'none',
                                          transform: hoveredUnivers === format.name ? 'scale(1.03)' : 'scale(1)'
                                        }}
                                      >
                                        <div className="px-4 py-2 flex items-center gap-2">
                                          <span
                                            className="text-sm font-semibold transition-colors duration-100"
                                            style={{ color: hoveredUnivers === format.name ? 'white' : format.color }}
                                          >
                                            {format.name}
                                          </span>
                                          <ArrowRight
                                            className="w-3.5 h-3.5 transition-all duration-100"
                                            style={{
                                              color: hoveredUnivers === format.name ? 'rgba(255,255,255,0.8)' : `${format.color}99`,
                                              transform: hoveredUnivers === format.name ? 'translateX(2px)' : 'translateX(0)'
                                            }}
                                          />
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Right side - CTA & Quick actions */}
                                <div className="col-span-5 border-l border-gray-100 pl-8 flex flex-col justify-between">
                                  {/* Main CTA */}
                                  <div>
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="h-1 w-8 bg-cyan-500 rounded-full" />
                                      <span className="text-sm font-semibold text-gray-900">Accès rapide</span>
                                    </div>

                                    <button
                                      onClick={() => handleNavigation('/videos')}
                                      className="group w-full p-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white transition-all duration-150 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="text-left">
                                          <p className="text-xs font-medium text-white/70 mb-0.5">Découvrir</p>
                                          <p className="text-base font-bold">Toutes les vidéos</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                          <ArrowRight className="w-5 h-5" />
                                        </div>
                                      </div>
                                    </button>
                                  </div>

                                  {/* Popular formats */}
                                  <div className="mt-4">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Populaires</p>
                                    <div className="flex flex-wrap gap-2">
                                      {['Reportages', 'Shorts', 'Live'].map((name) => {
                                        const format = videosItems.find(f => f.name === name);
                                        return format && (
                                          <button
                                            key={name}
                                            onClick={() => handleNavigation(format.href)}
                                            className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-100 hover:scale-105"
                                            style={{
                                              backgroundColor: `${format.color}15`,
                                              color: format.color,
                                              border: `1px solid ${format.color}30`
                                            }}
                                          >
                                            {name}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mega Menu HISTOIRES - Émotions */}
                    <AnimatePresence>
                      {item.label === 'Histoires' && isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.12, ease: "easeOut" }}
                          className="fixed inset-x-0 top-[104px] z-50"
                          onMouseLeave={() => setHoveredUnivers('default')}
                        >
                          <div className="relative bg-white border-b border-gray-200 shadow-xl overflow-hidden">
                            <div className="max-w-6xl mx-auto px-6 py-6">
                              <div className="grid grid-cols-12 gap-8">
                                {/* Left side - Émotions */}
                                <div className="col-span-7">
                                  {/* Header */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="h-1 w-8 bg-rose-500 rounded-full" />
                                    <span className="text-sm font-semibold text-gray-900">Explorer par thème</span>
                                  </div>

                                  {/* Horizontal pills wrap - Outline style */}
                                  <div className="flex flex-wrap gap-2">
                                    {histoiresItems.map((emotion) => (
                                      <button
                                        key={emotion.href}
                                        onClick={() => handleNavigation(emotion.href)}
                                        onMouseEnter={() => setHoveredUnivers(emotion.name)}
                                        className="group rounded-full overflow-hidden transition-all duration-100"
                                        style={{
                                          border: `2px solid ${emotion.color}`,
                                          backgroundColor: hoveredUnivers === emotion.name ? emotion.color : 'transparent',
                                          boxShadow: hoveredUnivers === emotion.name ? `0 4px 15px -3px ${emotion.color}50` : 'none',
                                          transform: hoveredUnivers === emotion.name ? 'scale(1.03)' : 'scale(1)'
                                        }}
                                      >
                                        <div className="px-4 py-2 flex items-center gap-2">
                                          <span
                                            className="text-sm font-semibold transition-colors duration-100"
                                            style={{ color: hoveredUnivers === emotion.name ? 'white' : emotion.color }}
                                          >
                                            {emotion.name}
                                          </span>
                                          <ArrowRight
                                            className="w-3.5 h-3.5 transition-all duration-100"
                                            style={{
                                              color: hoveredUnivers === emotion.name ? 'rgba(255,255,255,0.8)' : `${emotion.color}99`,
                                              transform: hoveredUnivers === emotion.name ? 'translateX(2px)' : 'translateX(0)'
                                            }}
                                          />
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Right side - CTA & Quick actions */}
                                <div className="col-span-5 border-l border-gray-100 pl-8 flex flex-col justify-between">
                                  {/* Main CTA */}
                                  <div>
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="h-1 w-8 bg-rose-500 rounded-full" />
                                      <span className="text-sm font-semibold text-gray-900">Accès rapide</span>
                                    </div>

                                    <button
                                      onClick={() => handleNavigation('/histoires')}
                                      className="group w-full p-4 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white transition-all duration-150 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="text-left">
                                          <p className="text-xs font-medium text-white/70 mb-0.5">Découvrir</p>
                                          <p className="text-base font-bold">Toutes les histoires</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                          <ArrowRight className="w-5 h-5" />
                                        </div>
                                      </div>
                                    </button>
                                  </div>

                                  {/* Popular themes */}
                                  <div className="mt-4">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Populaires</p>
                                    <div className="flex flex-wrap gap-2">
                                      {['Émotions & Bien-être', 'Parcours & Résilience', 'Développement'].map((name) => {
                                        const theme = histoiresItems.find(e => e.name === name);
                                        return theme && (
                                          <button
                                            key={name}
                                            onClick={() => handleNavigation(theme.href)}
                                            className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-100 hover:scale-105"
                                            style={{
                                              backgroundColor: `${theme.color}15`,
                                              color: theme.color,
                                              border: `1px solid ${theme.color}30`
                                            }}
                                          >
                                            {name}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mega Menu SÉRIES - Style Magazine Coloré avec featured */}
                    <AnimatePresence>
                      {item.label === 'Séries' && isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.12, ease: "easeOut" }}
                          className="fixed inset-x-0 top-[104px] z-50"
                        >
                          <div className="relative bg-white border-b border-gray-200 shadow-xl overflow-hidden">
                            <div className="max-w-6xl mx-auto px-6 py-6">
                              <div className="grid grid-cols-12 gap-8">
                                {/* Left side - Series grid */}
                                <div className="col-span-8">
                                  {/* Header */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                      <div className="h-1 w-8 bg-amber-500 rounded-full" />
                                      <span className="text-sm font-semibold text-gray-900">Nos séries</span>
                                    </div>
                                    <button
                                      onClick={() => handleNavigation('/series')}
                                      className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
                                    >
                                      Tout voir
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Grid de séries - Outline style */}
                                  <div className="grid grid-cols-6 gap-3">
                                    {seriesShowcase.map((serie, idx) => (
                                      <SeriesCard
                                        key={serie.href}
                                        serie={serie}
                                        idx={idx}
                                        onNavigate={handleNavigation}
                                      />
                                    ))}
                                  </div>
                                </div>

                                {/* Right side - Featured episodes */}
                                <div className="col-span-4 border-l border-gray-100 pl-8">
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="h-1 w-8 bg-rose-500 rounded-full" />
                                    <span className="text-sm font-semibold text-gray-900">Derniers épisodes</span>
                                  </div>

                                  <div className="space-y-4">
                                    {seriesFeatured.map((content) => (
                                      <button
                                        key={content.href}
                                        onClick={() => handleNavigation(content.href)}
                                        className="group flex gap-3 text-left w-full"
                                      >
                                        <div className="relative w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0 shadow-md ring-1 ring-black/5">
                                          <img
                                            src={content.image}
                                            alt={content.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                          <span
                                            className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white"
                                            style={{ backgroundColor: content.tagColor }}
                                          >
                                            {content.tag}
                                          </span>
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors duration-150">
                                            {content.title}
                                          </h4>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mega Menu ACADÉMIE - Style cohérent avec le site */}
                    <AnimatePresence>
                      {item.label === 'Académie' && isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.12, ease: "easeOut" }}
                          className="fixed inset-x-0 top-[104px] z-50"
                          onMouseLeave={() => setHoveredUnivers('default')}
                        >
                          <div className="relative bg-white border-b border-gray-200 shadow-xl overflow-hidden">
                            <div className="max-w-5xl mx-auto px-6 py-6">
                              <div className="grid grid-cols-12 gap-8">
                                {/* Left side - Guides */}
                                <div className="col-span-7">
                                  {/* Header */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="h-1 w-8 bg-amber-500 rounded-full" />
                                    <span className="text-sm font-semibold text-gray-900">Nos guides</span>
                                  </div>

                                  {/* Guides pills */}
                                  <div className="flex flex-wrap gap-2">
                                    {academieItems.map((item) => {
                                      const isHovered = hoveredUnivers === item.name;
                                      const baseColor = item.highlight ? '#F59E0B' : '#D97706';
                                      return (
                                        <button
                                          key={item.href}
                                          onClick={() => handleNavigation(item.href)}
                                          onMouseEnter={() => setHoveredUnivers(item.name)}
                                          className="group rounded-full overflow-hidden transition-all duration-100"
                                          style={{
                                            border: `2px solid ${baseColor}`,
                                            backgroundColor: isHovered ? baseColor : 'transparent',
                                            boxShadow: isHovered ? `0 4px 15px -3px ${baseColor}50` : 'none',
                                            transform: isHovered ? 'scale(1.02)' : 'scale(1)'
                                          }}
                                        >
                                          <div className="px-4 py-2 flex items-center gap-3">
                                            <div className="flex flex-col items-start">
                                              <span
                                                className="text-sm font-semibold transition-colors duration-100"
                                                style={{ color: isHovered ? 'white' : baseColor }}
                                              >
                                                {item.name}
                                              </span>
                                              <span
                                                className="text-[10px] transition-colors duration-100"
                                                style={{ color: isHovered ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}
                                              >
                                                {item.subtitle}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <span
                                                className="text-xs font-bold transition-colors duration-100"
                                                style={{ color: isHovered ? 'white' : (item.free ? '#10B981' : baseColor) }}
                                              >
                                                {item.price}
                                              </span>
                                              {item.originalPrice && (
                                                <span
                                                  className="text-[10px] line-through transition-colors duration-100"
                                                  style={{ color: isHovered ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }}
                                                >
                                                  {item.originalPrice}
                                                </span>
                                              )}
                                            </div>
                                            <ArrowRight
                                              className="w-3.5 h-3.5 transition-all duration-100"
                                              style={{
                                                color: isHovered ? 'rgba(255,255,255,0.8)' : `${baseColor}99`,
                                                transform: isHovered ? 'translateX(2px)' : 'translateX(0)'
                                              }}
                                            />
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Right side - CTA */}
                                <div className="col-span-5 border-l border-gray-100 pl-8 flex flex-col justify-between">
                                  {/* Main CTA */}
                                  <div>
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="h-1 w-8 bg-amber-500 rounded-full" />
                                      <span className="text-sm font-semibold text-gray-900">Accès rapide</span>
                                    </div>

                                    <button
                                      onClick={() => handleNavigation('/academie')}
                                      className="group w-full p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white transition-all duration-150 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="text-left">
                                          <p className="text-xs font-medium text-white/70 mb-0.5">Découvrir</p>
                                          <p className="text-base font-bold">Toute l'Académie</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                          <ArrowRight className="w-5 h-5" />
                                        </div>
                                      </div>
                                    </button>
                                  </div>

                                  {/* Stats */}
                                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                                    <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      2,500+ apprenants
                                    </span>
                                    <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                      4.9/5
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mega Menu RECOS - Style Premium compact */}
                    <AnimatePresence>
                      {item.label === 'Recos' && isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.12, ease: "easeOut" }}
                          className="fixed inset-x-0 top-[104px] z-50"
                          onMouseLeave={() => setHoveredUnivers('default')}
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
                                    onClick={() => handleNavigation(reco.href)}
                                    onMouseEnter={() => setHoveredUnivers(reco.name)}
                                    className="group rounded-full overflow-hidden transition-all duration-100"
                                    style={{
                                      border: `2px solid ${reco.color}`,
                                      backgroundColor: hoveredUnivers === reco.name ? reco.color : 'transparent',
                                      boxShadow: hoveredUnivers === reco.name ? `0 4px 15px -3px ${reco.color}50` : 'none',
                                      transform: hoveredUnivers === reco.name ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                  >
                                    <div className="px-5 py-2.5 flex items-center gap-2">
                                      <span
                                        className="text-sm font-semibold transition-colors duration-100"
                                        style={{ color: hoveredUnivers === reco.name ? 'white' : reco.color }}
                                      >
                                        {reco.name}
                                      </span>
                                      <ArrowRight
                                        className="w-3.5 h-3.5 transition-all duration-100"
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
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}
            </nav>
            </LayoutGroup>

            {/* Mobile: Logo + burger */}
            <div className="lg:hidden flex items-center justify-between w-full">
              <Link to="/" className="group">
                <motion.img
                  src="/logo-origines.png"
                  alt="Origines Media"
                  className="h-9 w-auto"
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
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-gray-600"
                  aria-label={searchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
                  aria-expanded={searchOpen}
                >
                  <Search className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Burger */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 overflow-hidden"
            >
              <form onSubmit={handleSearch} className="p-3 flex gap-2" role="search">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    aria-label="Rechercher sur le site"
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:border-gray-400 focus:outline-none"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-gray-400"
                  aria-label="Fermer la recherche"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ============ MOBILE MENU - FULLSCREEN PREMIUM ============ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
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
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img src="/logo-origines.png" alt="Origines Media" className="h-9 w-auto" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
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
                          onClick={() => setMobileAccordion(isAccordionOpen ? null : item.label)}
                          className="w-full group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 active:scale-[0.98]"
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
                                  onClick={() => setIsMobileMenuOpen(false)}
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
                                      onClick={() => setIsMobileMenuOpen(false)}
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
                    onClick={() => setIsMobileMenuOpen(false)}
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
                    onClick={() => setIsMobileMenuOpen(false)}
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold text-base active:scale-[0.98] transition-transform shadow-lg shadow-gray-900/20"
                  >
                    <PenLine className="w-5 h-5" />
                    Racontez votre histoire
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
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
      <div className="h-12 lg:h-[104px]" />
    </>
  );
};

export default Navbar;
