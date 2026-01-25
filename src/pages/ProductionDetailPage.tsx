// src/pages/ProductionDetailPage.tsx
// Nouvelle version avec hero split et sidebar widgets

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, Calendar, Tag, BookOpen, User,
  Share2, Heart, Bookmark, Copy, Check, X, ChevronRight,
  List, Zap, Flame, TrendingUp, Mail, ExternalLink,
  AlertCircle, Quote, ChevronDown, CheckCircle, Lightbulb, Info, Sparkles, Plus
} from 'lucide-react';
import { sanityFetch } from '../lib/sanity';
import { PRODUCTION_BY_SLUG_QUERY } from '../lib/queries';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { PortableText } from '@portabletext/react';
import { typo } from '../lib/typography';
import { AdPlaceholder } from '../components/AdSense';
import { createPortableTextComponents } from '../components/article/PortableTextComponents';
import { Heading } from '../components/article/types';

// Helper to extract text from Sanity block or return string
const extractTextFromSanity = (value: any): string => {
  if (typeof value === 'string') return value;
  // Sanity block structure: { _type: 'block', children: [{ text: '...' }] }
  if (value?.children && Array.isArray(value.children)) {
    return value.children.map((child: any) => child.text || '').join('');
  }
  // Array of blocks
  if (Array.isArray(value)) {
    return value.map((block: any) => {
      if (block?.children && Array.isArray(block.children)) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    }).join(' ');
  }
  return '';
};

// Accordion Item Component with animations
const AccordionItemProduction = ({
  question,
  answer,
  isOpen,
  onToggle,
  isLast = false,
  themeColor = '#8B5CF6'
}: {
  question: string;
  answer: any;
  isOpen: boolean;
  onToggle: () => void;
  isLast?: boolean;
  themeColor?: string;
}) => {
  const isRichText = Array.isArray(answer);

  return (
    <motion.div
      className={`relative ${!isLast ? 'border-b border-gray-100' : ''}`}
      initial={false}
    >
      {/* Colored accent line when open */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
        style={{ backgroundColor: themeColor }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          scaleY: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      />

      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between py-5 px-6 text-left gap-4 transition-all duration-300 ${
          isOpen ? 'bg-gradient-to-r from-gray-50/80 to-transparent' : 'hover:bg-gray-50/50'
        }`}
      >
        <span className={`font-semibold text-[17px] transition-colors duration-300 ${
          isOpen ? 'text-gray-900' : 'text-gray-700'
        }`}>
          {question}
        </span>

        {/* Animated icon */}
        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isOpen ? 'bg-gray-900' : 'bg-gray-100'
          }`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
            isOpen ? 'text-white' : 'text-gray-500'
          }`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="pt-1">
                {isRichText ? (
                  <div className="text-gray-600 leading-relaxed text-[15px]">
                    <PortableText value={answer} />
                  </div>
                ) : answer ? (
                  <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-line">{answer}</p>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Accordion Component for PortableText - handles both single item and items array
const AccordionBlockProduction = ({ value, themeColor = '#8B5CF6' }: { value: any; themeColor?: string }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [singleOpen, setSingleOpen] = useState(false);

  // Check if this is a multi-item accordion (has items array)
  const items = value.items || [];
  const hasMultipleItems = items.length > 0;
  const allowMultiple = value.allowMultiple !== false;
  const sectionTitle = value.title;

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Multi-item accordion (FAQ style)
  if (hasMultipleItems) {
    return (
      <div className="my-10">
        {sectionTitle && (
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: themeColor }}
            />
            <h4 className="text-xl font-bold text-gray-900">{sectionTitle}</h4>
          </div>
        )}
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
          {items.map((item: any, index: number) => {
            const question = item.question || item.title || item.heading || `Question ${index + 1}`;
            const answer = item.answer || item.content || item.body || item.text || '';
            const isOpen = openItems.has(index) || item.defaultOpen;

            return (
              <AccordionItemProduction
                key={item._key || index}
                question={question}
                answer={answer}
                isOpen={isOpen}
                onToggle={() => toggleItem(index)}
                isLast={index === items.length - 1}
                themeColor={themeColor}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Single item accordion (legacy format)
  const rawTitle = value.title || value.heading || value.question || value.label;
  const rawContent = value.content || value.body || value.answer || value.text || value.description;
  const title = extractTextFromSanity(rawTitle) || 'Voir plus';
  const isRichText = Array.isArray(rawContent);
  const contentText = isRichText ? null : extractTextFromSanity(rawContent);

  return (
    <motion.div
      className="my-8 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100"
      initial={false}
      animate={{
        boxShadow: singleOpen
          ? '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setSingleOpen(!singleOpen)}
        className={`w-full flex items-center justify-between p-6 text-left gap-4 transition-all duration-300 ${
          singleOpen ? 'bg-gradient-to-r from-gray-50 to-white' : 'hover:bg-gray-50/50'
        }`}
      >
        <div className="flex items-center gap-4 flex-1">
          <motion.div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${themeColor}15` }}
            animate={{ scale: singleOpen ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: singleOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus className="w-5 h-5" style={{ color: themeColor }} />
            </motion.div>
          </motion.div>
          <span className={`font-semibold text-lg transition-colors duration-300 ${
            singleOpen ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {title}
          </span>
        </div>

        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
            singleOpen ? 'bg-gray-900' : 'bg-gray-100'
          }`}
          animate={{ rotate: singleOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className={`w-4 h-4 transition-colors duration-300 ${
            singleOpen ? 'text-white' : 'text-gray-500'
          }`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {singleOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[72px]">
              <div className="pt-2 border-t border-gray-100">
                <div className="pt-4">
                  {isRichText ? (
                    <div className="text-gray-600 leading-relaxed text-[15px]">
                      <PortableText value={rawContent} />
                    </div>
                  ) : contentText ? (
                    <p className="text-gray-600 leading-relaxed text-[15px]">{contentText}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Types
interface Production {
  _id: string;
  titre: string;
  description: string;
  imageUrl: string;
  slug: { current: string };
  datePublication: string;
  duree: number;
  tempsLecture?: number;
  videoUrl?: string;
  contenu?: any[];
  univers?: {
    nom: string;
    couleur: string;
    slug: { current: string };
  };
  verticale?: {
    nom: string;
    couleurDominante: string;
    slug: { current: string };
  };
  formats?: Array<{
    nom: string;
    slug: { current: string };
  }>;
  tags?: Array<{
    nom: string;
    couleur: string;
    slug: { current: string };
  }>;
}

interface RelatedArticle {
  _id: string;
  titre: string;
  description?: string;
  imageUrl: string;
  slug: string;
  verticale?: { nom: string; couleurDominante: string };
  datePublication?: string;
}

// Fonction de shuffle intelligent - jamais 2 articles de même catégorie côte à côte
function shuffleWithVariety(articles: RelatedArticle[]): RelatedArticle[] {
  if (articles.length <= 1) return articles;

  // Grouper par catégorie
  const byCategory: { [key: string]: RelatedArticle[] } = {};
  articles.forEach(article => {
    const cat = article.verticale?.nom || 'Autre';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(article);
  });

  // Mélanger chaque groupe
  Object.values(byCategory).forEach(group => {
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
  });

  // Reconstruire la liste en alternant les catégories
  const result: RelatedArticle[] = [];
  const categories = Object.keys(byCategory);
  let lastCategory = '';
  let maxIterations = articles.length * 2; // Sécurité anti-boucle infinie

  while (result.length < articles.length && maxIterations > 0) {
    maxIterations--;

    // Trouver une catégorie différente de la précédente qui a encore des articles
    let found = false;

    // D'abord, essayer les catégories différentes de la dernière
    for (const cat of categories) {
      if (cat !== lastCategory && byCategory[cat].length > 0) {
        result.push(byCategory[cat].shift()!);
        lastCategory = cat;
        found = true;
        break;
      }
    }

    // Si pas trouvé (toutes les catégories restantes sont identiques à la dernière),
    // prendre n'importe quel article restant
    if (!found) {
      for (const cat of categories) {
        if (byCategory[cat].length > 0) {
          result.push(byCategory[cat].shift()!);
          lastCategory = cat;
          break;
        }
      }
    }
  }

  return result;
}


// Composant Widget Newsletter
const NewsletterWidget: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${themeColor}15` }}
        >
          <Mail className="w-5 h-5" style={{ color: themeColor }} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">Newsletter</h4>
          <p className="text-xs text-gray-500">Recevez nos meilleurs articles</p>
        </div>
      </div>

      {subscribed ? (
        <div className="flex items-center gap-2 text-emerald-600 text-sm">
          <Check className="w-4 h-4" />
          Merci pour votre inscription !
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: themeColor }}
          >
            S'inscrire
          </button>
        </form>
      )}
    </div>
  );
};

// Composant Table des matières dépliable
const TableOfContentsWidget: React.FC<{
  headings: Heading[];
  activeSection: string;
  scrollProgress: number;
  themeColor: string;
  onSectionClick: (id: string) => void;
}> = ({ headings, activeSection, scrollProgress, themeColor, onSectionClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
      {/* Header cliquable */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${themeColor}15` }}
          >
            <List className="w-5 h-5" style={{ color: themeColor }} />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-gray-900 text-sm">Sommaire</h4>
            <p className="text-xs text-gray-500">{headings.length} sections</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
        </motion.div>
      </button>

      {/* Contenu dépliable */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <nav className="p-4 pt-0 space-y-1 max-h-[300px] overflow-y-auto">
              {headings.map((heading, index) => {
                const isActive = activeSection === heading.id;
                return (
                  <button
                    key={heading.id}
                    onClick={() => onSectionClick(heading.id)}
                    className={`
                      w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-left
                      transition-all duration-300
                      ${heading.level === 3 ? 'ml-4' : ''}
                      ${isActive ? 'bg-white shadow-sm' : 'hover:bg-white/50'}
                    `}
                    style={{
                      borderLeft: isActive ? `3px solid ${themeColor}` : '3px solid transparent'
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: isActive ? themeColor : `${themeColor}15`,
                        color: isActive ? 'white' : themeColor
                      }}
                    >
                      {heading.level === 2 ? index + 1 : '•'}
                    </div>
                    <span className={`text-sm line-clamp-2 ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {heading.text}
                    </span>
                    {isActive && (
                      <div className="ml-auto flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Barre de progression */}
            <div className="p-4 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Progression</span>
                <span className="text-xs font-medium" style={{ color: themeColor }}>
                  {Math.round(scrollProgress)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: themeColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${scrollProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant Widget Réseaux Sociaux
const SocialWidget: React.FC = () => (
  <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
    <h4 className="font-bold text-gray-900 text-sm mb-4">Suivez-nous</h4>
    <div className="grid grid-cols-3 gap-2">
      <a
        href="https://instagram.com/originesmedia"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors group"
      >
        <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        <span className="text-xs text-gray-500 group-hover:text-pink-600">Instagram</span>
      </a>
      <a
        href="https://linkedin.com/company/originesmedia"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
      >
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span className="text-xs text-gray-500 group-hover:text-blue-600">LinkedIn</span>
      </a>
      <a
        href="https://twitter.com/originesmedia"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-100 transition-colors group"
      >
        <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span className="text-xs text-gray-500 group-hover:text-gray-800">X</span>
      </a>
    </div>
  </div>
);

function ProductionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // États principaux
  const [production, setProduction] = useState<Production | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [latestArticles, setLatestArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // États UI
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'popular' | 'univers'>('recent');

  // Refs pour sidebar sticky
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  // Extraction des headings du contenu
  useEffect(() => {
    if (production?.contenu) {
      const extracted: Heading[] = [];
      production.contenu.forEach((block: any, index: number) => {
        if (block._type === 'block' && (block.style === 'h2' || block.style === 'h3')) {
          const text = block.children?.map((child: any) => child.text).join('') || '';
          if (text) {
            extracted.push({
              id: `heading-${index}`,
              text,
              level: block.style === 'h2' ? 2 : 3
            });
          }
        }
      });
      setHeadings(extracted);
    }
  }, [production]);

  // Sync sidebar container height with article height
  useEffect(() => {
    const syncHeight = () => {
      if (articleRef.current && sidebarContainerRef.current) {
        const articleHeight = articleRef.current.offsetHeight;
        sidebarContainerRef.current.style.height = `${articleHeight}px`;
      }
    };

    syncHeight();
    window.addEventListener('resize', syncHeight);
    // Re-sync after images load
    const timer = setTimeout(syncHeight, 500);

    return () => {
      window.removeEventListener('resize', syncHeight);
      clearTimeout(timer);
    };
  }, [production]);

  // Sidebar sticky avec JavaScript - comportement "sticky bottom"
  // La sidebar défile avec la page, puis se fixe quand son bas atteint le bas du viewport
  useEffect(() => {
    const handleSidebarScroll = () => {
      if (!sidebarRef.current || !sidebarContainerRef.current) {
        return;
      }

      const container = sidebarContainerRef.current;
      const sidebar = sidebarRef.current;
      const containerRect = container.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Position du bas de la sidebar si elle était en position relative (en haut du conteneur)
      const sidebarBottomIfRelative = containerRect.top + sidebarHeight;

      if (sidebarBottomIfRelative > viewportHeight) {
        // État 1: Le bas de la sidebar n'a pas encore atteint le bas du viewport
        // → Scroll normal avec la page
        setSidebarStyle({ position: 'relative', top: 0 });
      } else if (containerRect.bottom > sidebarHeight) {
        // État 2: Le bas de la sidebar a atteint le bas du viewport
        // ET le conteneur n'est pas encore fini
        // → Fixed avec le bas collé au bas du viewport
        const topPosition = viewportHeight - sidebarHeight;
        setSidebarStyle({ position: 'fixed', top: topPosition, width: container.offsetWidth });
      } else {
        // État 3: Le conteneur est presque fini
        // → Absolute en bas du conteneur pour finir ensemble
        setSidebarStyle({ position: 'absolute', bottom: 0, top: 'auto', width: '100%' });
      }
    };

    window.addEventListener('scroll', handleSidebarScroll, { passive: true });
    window.addEventListener('resize', handleSidebarScroll);
    setTimeout(handleSidebarScroll, 200);

    return () => {
      window.removeEventListener('scroll', handleSidebarScroll);
      window.removeEventListener('resize', handleSidebarScroll);
    };
  }, [production]);

  // Scroll progress et section active
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      headings.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 0) {
            setActiveSection(heading.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await sanityFetch(PRODUCTION_BY_SLUG_QUERY, { slug });

        if (!data) {
          navigate('/404');
          return;
        }

        setProduction(data);

        // Charger les articles liés et récents
        try {
          const allProductions = await sanityFetch(`
            *[_type == "production" && slug.current != $slug] | order(datePublication desc) [0...30] {
              _id,
              titre,
              description,
              "imageUrl": coalesce(image.asset->url, imageUrl),
              "slug": slug.current,
              datePublication,
              verticale->{nom, couleurDominante}
            }
          `, { slug });

          if (allProductions) {
            // Shuffle intelligent : jamais 2 articles de même catégorie côte à côte
            const shuffledArticles = shuffleWithVariety(allProductions);
            setLatestArticles(shuffledArticles.slice(0, 6));

            // Filtrer par même verticale pour les articles liés
            const related = data.verticale
              ? allProductions.filter((a: RelatedArticle) => a.verticale?.nom === data.verticale.nom).slice(0, 4)
              : allProductions.slice(0, 4);
            setRelatedArticles(related);
          }
        } catch {
          // Silent fail for related articles
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
      window.scrollTo(0, 0);
    }
  }, [slug, navigate]);

  // Helpers
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `${diffInDays}j`;
    return publishedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const isLongArticle = headings.length >= 3;
  const themeColor = production?.verticale?.couleurDominante || '#8B5CF6';

  // Use extracted PortableText components factory (memoized)
  const portableTextComponents = useMemo(() =>
    createPortableTextComponents({ themeColor, article: production }),
    [themeColor, production]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
          <span className="text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!production) return null;

  const formattedDate = production.datePublication
    ? new Date(production.datePublication).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const readTime = production.tempsLecture || production.duree || 5;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title={production.titre}
        description={production.description}
        url={`/article/${production.slug.current}`}
        image={production.imageUrl}
        type="article"
        jsonLd="article"
        section={production.verticale?.nom}
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Bibliothèque', url: '/bibliotheque' },
          ...(production.verticale?.nom ? [{ name: production.verticale.nom, url: `/univers/${production.verticale.slug?.current || production.verticale.nom.toLowerCase()}` }] : []),
          { name: production.titre, url: `/article/${production.slug.current}` }
        ]}
      />

      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 z-[60] transition-all duration-300"
        style={{
          width: `${scrollProgress}%`,
          background: `linear-gradient(90deg, ${themeColor}, ${themeColor}99)`
        }}
      />

      <Navbar />

      <main className="pb-24 lg:pb-0">
        {/* Hero Section - Layout Split */}
        <div className="relative">
          {/* Header flottant */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 lg:p-12">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-white/90 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors backdrop-blur-sm bg-black/20">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="hidden sm:block text-sm uppercase tracking-wider">Retour</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors backdrop-blur-sm ${
                  liked ? 'bg-red-500/30 border-red-400/50' : 'border-white/30 bg-black/20 hover:border-white/50'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-red-400 text-red-400' : 'text-white'}`} />
              </button>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors backdrop-blur-sm ${
                  bookmarked ? 'bg-violet-500/30 border-violet-400/50' : 'border-white/30 bg-black/20 hover:border-white/50'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-violet-400 text-violet-400' : 'text-white'}`} />
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-white/50 transition-colors backdrop-blur-sm bg-black/20"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Layout Split 2 colonnes */}
          <div className="grid lg:grid-cols-2 min-h-[70vh]">
            {/* Colonne Image */}
            <div className="relative h-[50vh] lg:h-auto">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${production.imageUrl || '/placeholder.svg'})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-white" />
              </div>
            </div>

            {/* Colonne Contenu */}
            <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-16 bg-white">
              {/* Verticale Badge */}
              {production.verticale && (
                <Link
                  to={`/univers/${production.verticale.slug.current}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 w-fit transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    color: themeColor
                  }}
                >
                  {production.verticale.nom}
                </Link>
              )}

              {/* Titre */}
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6 leading-tight">
                {typo(production.titre)}
              </h1>

              {/* Description */}
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
                {typo(production.description)}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Origines Media</span>
                </div>
                {formattedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readTime} min de lecture</span>
                </div>
              </div>

              {/* Tags */}
              {production.tags && production.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {production.tags.map((tag) => tag && (
                    <span
                      key={tag.slug?.current || tag.nom}
                      className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-600"
                    >
                      #{tag.nom}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu Principal + Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

            {/* Colonne Contenu */}
            <div ref={articleRef} className="lg:col-span-8">
              {/* Pub banner en haut du contenu */}
              <AdPlaceholder format="banner" className="mb-8 lg:hidden" />

              {/* Contenu Article */}
              {production.contenu && production.contenu.length > 0 ? (
                <div className="prose prose-lg max-w-none">
                  <PortableText value={production.contenu} components={portableTextComponents} />
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Contenu en cours de rédaction...</p>
                </div>
              )}

              {/* Section CTA */}
              {production.verticale && (
                <div className="mt-16 p-8 rounded-2xl bg-gray-50 border border-gray-200">
                  <h3 className="font-bold text-xl text-gray-900 mb-3">
                    Envie d'aller plus loin ?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Découvrez tous nos articles sur {production.verticale.nom}
                  </p>
                  <Link
                    to={`/univers/${production.verticale.slug.current}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: themeColor }}
                  >
                    Explorer {production.verticale.nom}
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div
              ref={sidebarContainerRef}
              className="hidden lg:block lg:col-span-4 relative"
            >
              <div ref={sidebarRef} style={sidebarStyle} className="space-y-6">

                {/* Widget Auteur */}
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-5">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: themeColor }}
                    >
                      O
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Écrit par</p>
                      <h4 className="font-bold text-gray-900">Origines Media</h4>
                      <p className="text-sm text-gray-500">Rédaction</p>
                    </div>
                  </div>
                </div>

                {/* Table des matières dépliable (si article long) */}
                {isLongArticle && headings.length > 0 && (
                  <TableOfContentsWidget
                    headings={headings}
                    activeSection={activeSection}
                    scrollProgress={scrollProgress}
                    themeColor={themeColor}
                    onSectionClick={scrollToSection}
                  />
                )}

                {/* PUB 1 */}
                <AdPlaceholder format="rectangle" />

                {/* Widget À explorer */}
                <div className="rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
                  {/* Onglets */}
                  <div className="p-1 bg-gray-100">
                    <div className="flex gap-1">
                      {[
                        { id: 'recent' as const, label: 'Récents', icon: Zap },
                        { id: 'popular' as const, label: 'Populaires', icon: Flame },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                              flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                              text-sm font-medium transition-all
                              ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                            `}
                          >
                            <Icon size={14} />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Liste articles */}
                  <div className="max-h-[280px] overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {latestArticles.map((item) => (
                        <Link
                          key={item._id}
                          to={`/article/${item.slug}`}
                          className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white transition-all"
                        >
                          {item.imageUrl && (
                            <div className="w-14 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                              <img src={item.imageUrl} alt={item.titre || 'Article connexe'} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            {item.verticale && (
                              <span
                                className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mb-1"
                                style={{
                                  backgroundColor: `${item.verticale.couleurDominante || themeColor}15`,
                                  color: item.verticale.couleurDominante || themeColor
                                }}
                              >
                                {item.verticale.nom}
                              </span>
                            )}
                            <h4 className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2 leading-snug">
                              {typo(item.titre)}
                            </h4>
                            {item.datePublication && (
                              <span className="text-[10px] text-gray-400">{getRelativeTime(item.datePublication)}</span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/bibliotheque"
                    className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 p-3 border-t border-gray-200"
                  >
                    Voir tous les articles <ChevronRight size={14} />
                  </Link>
                </div>

                {/* Newsletter */}
                <NewsletterWidget themeColor={themeColor} />

                {/* PUB 2 */}
                <AdPlaceholder format="rectangle" />

                {/* Réseaux sociaux */}
                <SocialWidget />

                {/* À lire aussi (si article long) */}
                {isLongArticle && relatedArticles.length > 0 && (
                  <div className="rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" style={{ color: themeColor }} />
                      <span className="font-bold text-gray-900 text-sm">À lire aussi</span>
                    </div>
                    <div className="p-2 space-y-1">
                      {relatedArticles.map((related) => (
                        <Link
                          key={related._id}
                          to={`/article/${related.slug}`}
                          className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-all"
                        >
                          <div className="w-14 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                            {related.imageUrl && (
                              <img src={related.imageUrl} alt={related.titre || 'Article à lire'} className="w-full h-full object-cover" loading="lazy" />
                            )}
                          </div>
                          <h4 className="flex-1 text-xs text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2">
                            {typo(related.titre)}
                          </h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* PUB 3 */}
                <AdPlaceholder format="rectangle" />

              </div>
            </div>
          </div>
        </div>

        {/* Section Articles Recommandés (Full Width) */}
        {relatedArticles.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Articles recommandés
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.slice(0, 6).map((related) => (
                  <Link
                    key={related._id}
                    to={`/article/${related.slug}`}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={related.imageUrl || '/placeholder.svg'}
                        alt={related.titre || 'Article recommandé'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      {related.verticale && (
                        <span
                          className="inline-block px-2 py-1 rounded text-xs font-bold mb-3"
                          style={{
                            backgroundColor: `${related.verticale.couleurDominante || themeColor}15`,
                            color: related.verticale.couleurDominante || themeColor
                          }}
                        >
                          {related.verticale.nom}
                        </span>
                      )}
                      <h3 className="text-gray-900 font-bold line-clamp-2 group-hover:text-violet-600 transition-colors">
                        {typo(related.titre)}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mobile Floating Action Bar */}
        <div
          className="fixed bottom-0 left-0 right-0 lg:hidden z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 bg-gradient-to-t from-white via-white to-transparent"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-medium"
              style={{ backgroundColor: themeColor }}
            >
              <Share2 className="w-5 h-5" />
              <span>Partager</span>
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                bookmarked ? 'bg-violet-50 text-violet-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Share Modal */}
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-6">Partager</h3>

            <div className="space-y-3">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-500" />
                )}
                <span className="text-gray-900">{copied ? 'Lien copié !' : 'Copier le lien'}</span>
              </button>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(production.titre)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900">Partager sur X</span>
              </a>

              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(production.titre)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900">Partager sur LinkedIn</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default ProductionDetailPage;
