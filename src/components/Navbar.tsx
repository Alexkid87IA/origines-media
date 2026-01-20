// src/components/Navbar.tsx
// Navbar 2 niveaux - Top bar avec réseaux sociaux + Nav avec 7 catégories

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ChevronDown, ArrowRight, Search, PenLine, X, Sparkles, Star } from 'lucide-react';

// ============ ICÔNES RÉSEAUX SOCIAUX ============
const YouTubeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

// ============ TYPES ============
interface SubCategory {
  name: string;
  href: string;
}

interface FeaturedArticle {
  title: string;
  image: string;
  href: string;
  tag: string;
  tagColor: string;
}

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  color?: string;
  hoverColor?: string;
  hoverBg?: string;
  subcategories?: SubCategory[][];
  featuredArticles?: FeaturedArticle[];
}

// ============ DATA ============
const socialLinks = [
  { icon: YouTubeIcon, href: 'https://youtube.com/@originesmedia', label: 'YouTube', color: '#FF0000' },
  { icon: XIcon, href: 'https://x.com/originesmedia', label: 'X', color: '#000000' },
  { icon: SnapchatIcon, href: 'https://snapchat.com/add/originesmedia', label: 'Snapchat', color: '#FFFC00' },
  { icon: FacebookIcon, href: 'https://facebook.com/originesmedia', label: 'Facebook', color: '#1877F2' },
  { icon: InstagramIcon, href: 'https://instagram.com/originesmedia', label: 'Instagram', color: '#E4405F' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@originesmedia', label: 'TikTok', color: '#000000' },
];

// Séries pour le mega menu showcase
interface SeriesItem {
  title: string;
  image: string;
  href: string;
  episodes?: number;
  color: string;
}

const seriesShowcase: SeriesItem[] = [
  { title: 'Transmission', image: '/series/01_transmission_poster.jpg', href: '/series/transmission', episodes: 12, color: '#6366F1' },
  { title: 'État d\'esprit', image: '/series/02_etat_esprit_poster.jpg', href: '/series/etat-d-esprit', episodes: 8, color: '#06B6D4' },
  { title: 'Il était une fois', image: '/series/03_il_etait_une_fois_poster.jpg', href: '/series/il-etait-une-fois', episodes: 15, color: '#F59E0B' },
  { title: 'Secrets pro', image: '/series/04_secrets_professionnels_poster.jpg', href: '/series/secrets-professionnels', episodes: 10, color: '#8B5CF6' },
  { title: 'La lettre', image: '/series/05_la_lettre_poster.jpg', href: '/series/la-lettre', episodes: 6, color: '#10B981' },
  { title: 'Imagine', image: '/series/06_imagine_poster.jpg', href: '/series/imagine', episodes: 9, color: '#EC4899' },
];

// Contenus mis en avant
interface FeaturedContent {
  title: string;
  image: string;
  href: string;
  tag: string;
  tagColor: string;
}

// Contenus dynamiques par univers
const universFeaturedByCategory: Record<string, FeaturedContent[]> = {
  'default': [
    { title: 'Les secrets du bonheur', image: '/placeholder.svg', href: '/article/secrets-bonheur', tag: 'Psychologie', tagColor: '#4F46E5' },
    { title: 'Voyager autrement', image: '/placeholder.svg', href: '/article/voyager-autrement', tag: 'Voyage', tagColor: '#10B981' }
  ],
  'Psychologie': [
    { title: 'Les secrets du bonheur', image: '/placeholder.svg', href: '/article/secrets-bonheur', tag: 'Psychologie', tagColor: '#4F46E5' },
    { title: 'Comprendre ses émotions', image: '/placeholder.svg', href: '/article/comprendre-emotions', tag: 'Psychologie', tagColor: '#4F46E5' }
  ],
  'Société': [
    { title: 'Vivre ensemble demain', image: '/placeholder.svg', href: '/article/vivre-ensemble', tag: 'Société', tagColor: '#D97706' },
    { title: 'Les nouveaux liens sociaux', image: '/placeholder.svg', href: '/article/liens-sociaux', tag: 'Société', tagColor: '#D97706' }
  ],
  'Famille': [
    { title: 'Transmission entre générations', image: '/placeholder.svg', href: '/article/transmission-generations', tag: 'Famille', tagColor: '#FB7185' },
    { title: 'L\'amour au quotidien', image: '/placeholder.svg', href: '/article/amour-quotidien', tag: 'Famille', tagColor: '#FB7185' }
  ],
  'Voyage': [
    { title: 'Voyager autrement', image: '/placeholder.svg', href: '/article/voyager-autrement', tag: 'Voyage', tagColor: '#10B981' },
    { title: 'Destinations inspirantes', image: '/placeholder.svg', href: '/article/destinations-inspirantes', tag: 'Voyage', tagColor: '#10B981' }
  ],
  'Spiritualité': [
    { title: 'Le chemin intérieur', image: '/placeholder.svg', href: '/article/chemin-interieur', tag: 'Spiritualité', tagColor: '#9333EA' },
    { title: 'Méditation guidée', image: '/placeholder.svg', href: '/article/meditation-guidee', tag: 'Spiritualité', tagColor: '#9333EA' }
  ],
  'Carrière': [
    { title: 'Réussir sa reconversion', image: '/placeholder.svg', href: '/article/reussir-reconversion', tag: 'Carrière', tagColor: '#0EA5E9' },
    { title: 'Leadership au féminin', image: '/placeholder.svg', href: '/article/leadership-feminin', tag: 'Carrière', tagColor: '#0EA5E9' }
  ],
  'Art & Créativité': [
    { title: 'L\'art de créer', image: '/placeholder.svg', href: '/article/art-creer', tag: 'Créativité', tagColor: '#D946EF' },
    { title: 'Portraits d\'artistes', image: '/placeholder.svg', href: '/article/portraits-artistes', tag: 'Créativité', tagColor: '#D946EF' }
  ],
  'Santé': [
    { title: 'Prendre soin de soi', image: '/placeholder.svg', href: '/article/prendre-soin', tag: 'Santé', tagColor: '#DC2626' },
    { title: 'Bien-être au naturel', image: '/placeholder.svg', href: '/article/bien-etre-naturel', tag: 'Santé', tagColor: '#DC2626' }
  ],
  'Tech': [
    { title: 'L\'IA au service de l\'humain', image: '/placeholder.svg', href: '/article/ia-humain', tag: 'Tech', tagColor: '#2563EB' },
    { title: 'Innovations de demain', image: '/placeholder.svg', href: '/article/innovations-demain', tag: 'Tech', tagColor: '#2563EB' }
  ],
  'Business': [
    { title: 'Entreprendre autrement', image: '/placeholder.svg', href: '/article/entreprendre-autrement', tag: 'Business', tagColor: '#14B8A6' },
    { title: 'Success stories', image: '/placeholder.svg', href: '/article/success-stories', tag: 'Business', tagColor: '#14B8A6' }
  ]
};

// Épisodes mis en avant pour Séries
const seriesFeatured: FeaturedContent[] = [
  {
    title: 'Transmission - Ép. 1 : L\'héritage',
    image: '/series/01_transmission.jpg',
    href: '/series/transmission/episode-1',
    tag: 'Nouveau',
    tagColor: '#6366F1'
  },
  {
    title: 'État d\'esprit - Ép. 3 : La résilience',
    image: '/series/02_etat_esprit.jpg',
    href: '/series/etat-d-esprit/episode-3',
    tag: 'Populaire',
    tagColor: '#EC4899'
  },
  {
    title: 'Il était une fois - Ép. 5 : Le destin',
    image: '/series/03_il_etait_une_fois.jpg',
    href: '/series/il-etait-une-fois/episode-5',
    tag: 'Tendance',
    tagColor: '#F59E0B'
  }
];

// Items pour le dropdown Univers
interface UniversItem {
  name: string;
  href: string;
  color: string;
}

const universItems: UniversItem[] = [
  { name: 'Psychologie', href: '/univers/psychologie', color: '#4F46E5' },
  { name: 'Société', href: '/univers/societe', color: '#D97706' },
  { name: 'Famille', href: '/univers/famille', color: '#FB7185' },
  { name: 'Voyage', href: '/univers/voyage', color: '#10B981' },
  { name: 'Spiritualité', href: '/univers/spiritualite', color: '#9333EA' },
  { name: 'Carrière', href: '/univers/carriere', color: '#0EA5E9' },
  { name: 'Art & Créativité', href: '/univers/art-creativite', color: '#D946EF' },
  { name: 'Santé', href: '/univers/sante', color: '#DC2626' },
  { name: 'Tech', href: '/univers/tech', color: '#2563EB' },
  { name: 'Business', href: '/univers/business', color: '#14B8A6' },
];

// Items pour le dropdown Académie - Style Premium
interface AcademieItem {
  name: string;
  subtitle: string;
  href: string;
  price: string;
  originalPrice?: string;
  highlight?: boolean;
  free?: boolean;
}

const academieItems: AcademieItem[] = [
  { name: 'Kit d\'Introspection', subtitle: 'Démarrez votre voyage', href: '/academie/kit-introspection', price: 'Gratuit', free: true },
  { name: 'Masterclass Storytelling', subtitle: 'L\'art du récit', href: '/academie/masterclass-storytelling', price: '29€', originalPrice: '49€', highlight: true },
  { name: 'Guide Mindset', subtitle: 'Transformez votre mental', href: '/academie/guide-mindset', price: '19€' },
  { name: 'Programme Complet', subtitle: 'Accès illimité à vie', href: '/academie/programme-complet', price: '79€', originalPrice: '147€' },
];

// Items pour le dropdown Recos (synchronisé avec RecommandationsSection)
interface RecoItem {
  name: string;
  href: string;
  color: string;
}

const recoItems: RecoItem[] = [
  { name: 'Livres', href: '/recommandations?type=livre', color: '#EC4899' },
  { name: 'Films & Séries', href: '/recommandations?type=film', color: '#8B5CF6' },
  { name: 'Musique', href: '/recommandations?type=musique', color: '#6366F1' },
  { name: 'Podcasts', href: '/recommandations?type=podcast', color: '#14B8A6' },
  { name: 'Social', href: '/recommandations?type=reseaux-sociaux', color: '#0891B2' },
  { name: 'YouTube', href: '/recommandations?type=youtube', color: '#EF4444' },
  { name: 'Activité', href: '/recommandations?type=activite', color: '#10B981' },
  { name: 'Destination', href: '/recommandations?type=destination', color: '#0EA5E9' },
  { name: 'Culture', href: '/recommandations?type=culture', color: '#A855F7' },
  { name: 'Produits', href: '/recommandations?type=produit', color: '#F59E0B' },
];


// Items pour le dropdown Articles (catégories/verticales)
const articlesItems: UniversItem[] = [
  { name: 'Psychologie', href: '/articles?verticale=psychologie', color: '#4F46E5' },
  { name: 'Société', href: '/articles?verticale=societe', color: '#D97706' },
  { name: 'Famille', href: '/articles?verticale=famille', color: '#FB7185' },
  { name: 'Voyage', href: '/articles?verticale=voyage', color: '#10B981' },
  { name: 'Spiritualité', href: '/articles?verticale=spiritualite', color: '#9333EA' },
  { name: 'Carrière', href: '/articles?verticale=carriere', color: '#0EA5E9' },
  { name: 'Art & Créativité', href: '/articles?verticale=art-creativite', color: '#D946EF' },
  { name: 'Santé', href: '/articles?verticale=sante', color: '#DC2626' },
  { name: 'Tech', href: '/articles?verticale=tech', color: '#2563EB' },
  { name: 'Business', href: '/articles?verticale=business', color: '#14B8A6' },
];

// Items pour le dropdown Histoires (émotions)
const histoiresItems: UniversItem[] = [
  { name: 'Inspiration', href: '/histoires?emotion=inspiration', color: '#F59E0B' },
  { name: 'Résilience', href: '/histoires?emotion=resilience', color: '#10B981' },
  { name: 'Amour', href: '/histoires?emotion=amour', color: '#EC4899' },
  { name: 'Courage', href: '/histoires?emotion=courage', color: '#EF4444' },
  { name: 'Espoir', href: '/histoires?emotion=espoir', color: '#06B6D4' },
  { name: 'Gratitude', href: '/histoires?emotion=gratitude', color: '#8B5CF6' },
  { name: 'Transformation', href: '/histoires?emotion=transformation', color: '#6366F1' },
  { name: 'Liberté', href: '/histoires?emotion=liberte', color: '#14B8A6' },
];

// Items pour le dropdown Vidéos (formats)
const videosItems: UniversItem[] = [
  { name: 'Reportages', href: '/videos?format=reportages', color: '#0891B2' },
  { name: 'Témoignages', href: '/videos?format=temoignages', color: '#8B5CF6' },
  { name: 'Concept YouTube', href: '/videos?format=youtube', color: '#EF4444' },
  { name: 'Shorts', href: '/videos?format=shorts', color: '#EC4899' },
  { name: 'Live', href: '/videos?format=live', color: '#10B981' },
  { name: 'Vlogs', href: '/videos?format=vlogs', color: '#F59E0B' },
  { name: 'Décryptages', href: '/videos?format=decryptages', color: '#6366F1' },
  { name: 'Débats', href: '/videos?format=debats', color: '#DC2626' },
  { name: 'Portraits', href: '/videos?format=portraits', color: '#14B8A6' },
  { name: 'News', href: '/videos?format=news', color: '#1F2937' },
];

const navItems: NavItem[] = [
  { label: 'Articles', href: '/articles', hasDropdown: true, color: '#374151', hoverColor: '#059669', hoverBg: 'bg-emerald-50' },
  { label: 'Vidéos', href: '/videos', hasDropdown: true, color: '#374151', hoverColor: '#0891B2', hoverBg: 'bg-cyan-50' },
  { label: 'Histoires', href: '/histoires', hasDropdown: true, color: '#374151', hoverColor: '#DB2777', hoverBg: 'bg-rose-50' },
  { label: 'Séries', href: '/series', hasDropdown: true, color: '#374151', hoverColor: '#8B5CF6', hoverBg: 'bg-violet-50' },
  { label: 'Recos', href: '/recommandations', hasDropdown: true, color: '#374151', hoverColor: '#EC4899', hoverBg: 'bg-pink-50' },
  { label: 'Académie', href: '/academie', hasDropdown: true, color: '#374151', hoverColor: '#D97706', hoverBg: 'bg-amber-50' },
];

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
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredUnivers, setHoveredUnivers] = useState<string>('default');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update shadow state
      setIsScrolled(currentScrollY > 20);

      // Determine scroll direction and visibility
      // Always show navbar at the very top of the page
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide navbar
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
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
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
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
            <nav className="hidden lg:flex items-center gap-1">
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
                                    <span className="text-sm font-semibold text-gray-900">Explorer par émotion</span>
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

                                  {/* Popular emotions */}
                                  <div className="mt-4">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Populaires</p>
                                    <div className="flex flex-wrap gap-2">
                                      {['Inspiration', 'Résilience', 'Amour'].map((name) => {
                                        const emotion = histoiresItems.find(e => e.name === name);
                                        return emotion && (
                                          <button
                                            key={name}
                                            onClick={() => handleNavigation(emotion.href)}
                                            className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-100 hover:scale-105"
                                            style={{
                                              backgroundColor: `${emotion.color}15`,
                                              color: emotion.color,
                                              border: `1px solid ${emotion.color}30`
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
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Burger */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-600"
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
              <form onSubmit={handleSearch} className="p-3 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:border-gray-400 focus:outline-none"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg transition-all
                      ${isActiveRoute(item.href)
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600'
                      }
                    `}
                  >
                    <span className={isActiveRoute(item.href) ? (item.color || '') : ''}>
                      {item.label}
                    </span>
                    {item.hasDropdown && <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </Link>
                ))}

                {/* Réseaux sociaux mobile - couleurs de marque */}
                <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-100 mt-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 transition-all duration-300 hover:scale-110"
                      style={{ color: social.color }}
                      aria-label={social.label}
                    >
                      <social.icon />
                    </a>
                  ))}
                </div>

                {/* CTA Mobile - Outline Premium */}
                <div className="pt-3">
                  <Link
                    to="/racontez-votre-histoire"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-gray-900 border-2 border-gray-900 rounded-full active:bg-gray-900 active:text-white transition-colors"
                  >
                    <PenLine className="w-4 h-4" />
                    Racontez votre histoire
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
