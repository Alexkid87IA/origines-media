// src/components/Sidebar.tsx
// VERSION ULTRA PREMIUM - Design exceptionnel avec animations avancées

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, Compass, Info, Mail, Play, Users, Edit3,
  ChevronRight, Sparkles, Crown, Flame, Star, Zap
} from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onClose }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredFormat, setHoveredFormat] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<'formats' | 'univers' | null>('formats');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const sidebar = document.getElementById('premium-sidebar');
      if (sidebar) {
        const rect = sidebar.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const mainNavigation = [
    { id: 'home', nom: 'Accueil', href: '/', icon: Home },
    { id: 'bibliotheque', nom: 'Bibliothèque', href: '/bibliotheque', icon: BookOpen },
    { id: 'univers', nom: 'Nos Univers', href: '/univers', icon: Compass },
    { id: 'about', nom: 'À Propos', href: '/a-propos', icon: Info },
    { id: 'contact', nom: 'Contact', href: '/contact', icon: Mail },
  ];

  const formats = [
    { id: 'il-etait-une-fois', nom: 'Il Était Une Fois', color: '#F59E0B', gradient: 'from-amber-500 to-orange-600', icon: Star, episodes: 32 },
    { id: 'la-lettre', nom: 'La Lettre', color: '#8B5CF6', gradient: 'from-violet-500 to-purple-600', icon: Mail, episodes: 24, badge: 'HOT' },
    { id: 'secrets-pro', nom: 'Secrets Pro', color: '#EC4899', gradient: 'from-pink-500 to-rose-600', icon: Crown, episodes: 18, badge: 'NEW' },
    { id: 'connexion', nom: 'Connexion', color: '#10B981', gradient: 'from-emerald-500 to-teal-600', icon: Zap, episodes: 21 },
    { id: 'transmission', nom: 'Transmission', color: '#3B82F6', gradient: 'from-blue-500 to-indigo-600', icon: Sparkles, episodes: 15 },
    { id: 'etat-esprit', nom: 'État d\'Esprit', color: '#EF4444', gradient: 'from-red-500 to-rose-600', icon: Flame, episodes: 28 },
  ];

  const univers = [
    { id: 'psychologie', nom: 'Psychologie', color: '#4299E1', emoji: '🧠' },
    { id: 'societe', nom: 'Société', color: '#ED8936', emoji: '🌍' },
    { id: 'carriere', nom: 'Carrière', color: '#4A5568', emoji: '💼' },
    { id: 'voyage', nom: 'Voyage', color: '#48BB78', emoji: '✈️' },
    { id: 'art-creativite', nom: 'Art & Créativité', color: '#9F7AEA', emoji: '🎨' },
    { id: 'spiritualite', nom: 'Spiritualité', color: '#805AD5', emoji: '✨' },
    { id: 'sante', nom: 'Santé', color: '#38B2AC', emoji: '💚' },
    { id: 'technologie', nom: 'Technologie', color: '#3182CE', emoji: '💻' },
    { id: 'relations', nom: 'Relations', color: '#E53E3E', emoji: '❤️' },
    { id: 'environnement', nom: 'Environnement', color: '#38A169', emoji: '🌱' }
  ];

  const handleLinkClick = () => {
    if (isMobile && onClose) onClose();
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes border-dance {
          0%, 100% { border-color: rgba(139, 92, 246, 0.3); }
          50% { border-color: rgba(236, 72, 153, 0.3); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #a78bfa 50%, #fff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s infinite;
        }
        .float-animation { animation: float 3s ease-in-out infinite; }
        .glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
        .border-dance { animation: border-dance 2s ease-in-out infinite; }
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%);
          border-radius: 4px;
        }
      `}</style>

      <aside
        id="premium-sidebar"
        role="navigation"
        aria-label="Navigation principale"
        className={`
          ${isMobile ? 'relative w-full h-full' : 'fixed top-0 left-0 h-full w-[260px] hidden md:flex'}
          flex flex-col z-40 overflow-hidden
        `}
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,0,20,0.98) 100%)',
        }}
      >
        {/* Spotlight Effect following mouse */}
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            left: mousePosition.x - 150,
            top: mousePosition.y - 150,
            width: 300,
            height: 300,
            background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
            opacity: hoveredItem || hoveredFormat ? 1 : 0.5,
          }}
        />

        {/* Ambient Orbs */}
        <div className="absolute top-10 -left-10 w-32 h-32 bg-violet-600/20 rounded-full blur-3xl glow-pulse" />
        <div className="absolute top-1/2 -right-10 w-24 h-24 bg-fuchsia-600/15 rounded-full blur-2xl glow-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 -left-5 w-20 h-20 bg-pink-600/10 rounded-full blur-2xl glow-pulse" style={{ animationDelay: '2s' }} />

        {/* Border gradient right */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-violet-500/30 via-fuchsia-500/20 to-transparent" />

        {/* ═══════════════════════════════════════════ */}
        {/* HEADER - Logo Zone (Compact) */}
        {/* ═══════════════════════════════════════════ */}
        <div className="relative z-10 px-4 py-3">
          <Link to="/" onClick={handleLinkClick} className="block group">
            <img
              src="https://26.staticbtf.eno.do/v1/12-default/6b72d83f2de3f869e8fae974e755f62d/media.jpg"
              alt="Origines Media"
              className="h-12 w-auto group-hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          </Link>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* MAIN NAVIGATION (Compact) */}
        {/* ═══════════════════════════════════════════ */}
        <div className="relative z-10 px-3 py-2">
          <nav className="space-y-0.5">
            {mainNavigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={handleLinkClick}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    relative flex items-center gap-2.5 px-3 py-2 rounded-lg
                    transition-all duration-200
                    ${isActive
                      ? 'bg-violet-500/15 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-500 rounded-full" />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : ''}`} />
                  <span className="text-sm">{item.nom}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/5" />

        {/* ═══════════════════════════════════════════ */}
        {/* SCROLLABLE CONTENT */}
        {/* ═══════════════════════════════════════════ */}
        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-thin px-3 py-2">

          {/* ─────────────────────────────────────────── */}
          {/* FORMATS SECTION */}
          {/* ─────────────────────────────────────────── */}
          <div className="mb-4">
            {/* Section Header */}
            <div className="flex items-center gap-2 px-2 mb-2">
              <Play className="w-3 h-3 text-violet-400" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Formats</span>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500/10 rounded-full">
                <Crown className="w-2 h-2 text-amber-400" />
                <span className="text-[8px] text-amber-400 font-bold">EXCLUSIF</span>
              </div>
            </div>

            {/* Formats List - Compact */}
            <div className="space-y-0.5">
              {formats.map((format) => (
                <Link
                  key={format.id}
                  to={`/format/${format.id}`}
                  onClick={handleLinkClick}
                  onMouseEnter={() => setHoveredFormat(format.id)}
                  onMouseLeave={() => setHoveredFormat(null)}
                  className={`
                    flex items-center gap-2.5 px-2 py-1.5 rounded-lg
                    transition-all duration-200
                    ${hoveredFormat === format.id ? 'bg-white/[0.05]' : ''}
                  `}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${format.color}15` }}
                  >
                    <Play className="w-3 h-3 ml-0.5" style={{ color: format.color }} />
                  </div>
                  <span className={`text-sm flex-1 truncate ${hoveredFormat === format.id ? 'text-white' : 'text-gray-400'}`}>
                    {format.nom}
                  </span>
                  {format.badge && (
                    <span className={`
                      px-1 py-0.5 rounded text-[8px] font-bold
                      ${format.badge === 'NEW' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}
                    `}>
                      {format.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-2 h-px bg-white/5 mb-4" />

          {/* ─────────────────────────────────────────── */}
          {/* UNIVERS SECTION */}
          {/* ─────────────────────────────────────────── */}
          <div>
            {/* Section Header */}
            <div className="flex items-center gap-2 px-2 mb-2">
              <Compass className="w-3 h-3 text-violet-400" />
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Univers</span>
              <span className="text-[10px] text-gray-600">{univers.length}</span>
            </div>

            {/* Univers List - Compact */}
            <div className="grid grid-cols-2 gap-1">
              {univers.map((u) => (
                <Link
                  key={u.id}
                  to={`/univers/${u.id}`}
                  onClick={handleLinkClick}
                  className="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.03] transition-all"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: u.color }}
                  />
                  <span className="text-xs text-gray-500 group-hover:text-white transition-colors truncate">
                    {u.nom}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* FOOTER - CTAs (Compact) */}
        {/* ═══════════════════════════════════════════ */}
        <div className="relative z-10 p-3 space-y-2 border-t border-white/5">
          {/* Primary CTA */}
          <Link
            to="/rejoindre"
            onClick={handleLinkClick}
            className="group flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white text-sm font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Rejoindre</span>
          </Link>

          {/* Secondary CTA */}
          <Link
            to="/proposer-histoire"
            onClick={handleLinkClick}
            className="flex items-center justify-center gap-2 py-2 text-xs text-gray-500 hover:text-violet-400 transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span>Proposer mon histoire</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
