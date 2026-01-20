// src/pages/VideoPage.tsx
// Page vidéo : YouTube hero + contenu enrichi + sidebar identique ArticlePage

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Clock, Heart, Share2, Bookmark, Calendar,
  ChevronUp, Link2, Check, PenLine, TrendingUp, Tag,
  X, BookOpen, List, AlertCircle, Quote, ChevronDown,
  CheckCircle, Lightbulb, Mail, Info, Sparkles, Play,
  Target, Star, Key, MapPin, Zap, Plus
} from 'lucide-react';
import { sanityFetch } from '../lib/sanity';
import { getImageUrl } from '../lib/imageUrl';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { PortableText } from '@portabletext/react';
import { typo } from '../lib/typography';

// ============ QUERIES SANITY POUR VIDÉOS ============
const VIDEO_BY_SLUG_QUERY = `
  *[_type == "production" && slug.current == $slug && typeArticle == "video"][0] {
    _id,
    "titre": titre,
    "title": titre,
    "description": description,
    "excerpt": description,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "videoUrl": videoUrl,
    "tempsLecture": tempsLecture,
    "readTime": tempsLecture,
    "datePublication": datePublication,
    "publishedAt": datePublication,
    "verticale": verticale->{ "nom": titre, "couleurDominante": couleur },
    "tags": tags[]->{ _id, "title": titre, "color": null, "slug": slug.current },
    "contenu": contenu,
    "body": contenu
  }
`;

const RELATED_VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video" && slug.current != $slug] | order(datePublication desc)[0...4] {
    _id,
    "titre": titre,
    "title": titre,
    "slug": slug,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "verticale": verticale->{ "nom": titre, "couleurDominante": couleur }
  }
`;

const POPULAR_VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video"] | order(vues desc)[0...5] {
    _id,
    "title": titre,
    slug,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "views": vues
  }
`;

// Extraire l'ID YouTube d'une URL
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// ============ ICÔNES RÉSEAUX SOCIAUX (Style Footer/Navbar) ============
const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

// Data des boutons de partage avec couleurs de marque
const shareButtons = [
  { id: 'twitter', icon: XIcon, label: 'X', color: '#000000' },
  { id: 'facebook', icon: FacebookIcon, label: 'Facebook', color: '#1877F2' },
  { id: 'linkedin', icon: LinkedInIcon, label: 'LinkedIn', color: '#0A66C2' },
  { id: 'whatsapp', icon: WhatsAppIcon, label: 'WhatsApp', color: '#25D366' },
  { id: 'telegram', icon: TelegramIcon, label: 'Telegram', color: '#0088CC' },
  { id: 'email', icon: EmailIcon, label: 'Email', color: '#EA4335' },
];

// Helper to extract text from Sanity block or return string
const extractText = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  // Object with text property: { text: "...", icon: "check" }
  if (typeof value === 'object' && value.text && typeof value.text === 'string') {
    return value.text;
  }
  // Sanity block structure: { _type: 'block', children: [{ text: '...' }] }
  if (value?.children && Array.isArray(value.children)) {
    return value.children.map((child: any) => child.text || '').join('');
  }
  // Array of blocks
  if (Array.isArray(value)) {
    return value.map((block: any) => {
      if (typeof block === 'string') return block;
      if (block?.text) return block.text;
      if (block?.children && Array.isArray(block.children)) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    }).join(' ');
  }
  return '';
};

// Single Accordion Item Component
const AccordionItem = ({
  question,
  answer,
  defaultOpen = false,
  index,
  style = 'simple',
  isLast = false,
  themeColor = '#8B5CF6'
}: {
  question: string;
  answer: any;
  defaultOpen?: boolean;
  index?: number;
  style?: string;
  isLast?: boolean;
  themeColor?: string;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Render answer content (can be string or portable text)
  const renderAnswer = () => {
    if (!answer) return null;
    if (typeof answer === 'string') {
      return <p className="text-gray-600 leading-relaxed text-[15px]">{answer}</p>;
    }
    if (Array.isArray(answer)) {
      const hasPortableText = answer.some((item: any) => item?._type);
      if (hasPortableText) {
        return (
          <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none">
            <PortableText value={answer} />
          </div>
        );
      }
    }
    if (answer?._type === 'block') {
      return (
        <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none">
          <PortableText value={[answer]} />
        </div>
      );
    }
    const text = extractText(answer);
    return text ? <p className="text-gray-600 leading-relaxed text-[15px]">{text}</p> : null;
  };

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
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-5 px-6 text-left gap-4 transition-all duration-200 ${
          isOpen ? 'bg-gradient-to-r from-gray-50/80 to-transparent' : 'hover:bg-gray-50/50'
        }`}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {style === 'numbered' && index !== undefined && (
            <motion.span
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm"
              style={{
                backgroundColor: isOpen ? themeColor : '#F3F4F6',
                color: isOpen ? 'white' : '#6B7280'
              }}
              animate={{
                scale: isOpen ? 1.05 : 1,
                backgroundColor: isOpen ? themeColor : '#F3F4F6'
              }}
              transition={{ duration: 0.2 }}
            >
              {index + 1}
            </motion.span>
          )}
          <span className={`font-semibold text-[17px] transition-colors duration-200 ${
            isOpen ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {question}
          </span>
        </div>

        {/* Animated icon */}
        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isOpen ? 'bg-gray-900' : 'bg-gray-100'
          }`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className={`w-4 h-4 transition-colors duration-200 ${
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
            <div className={`px-6 pb-6 ${style === 'numbered' ? 'pl-[72px]' : 'pl-6'}`}>
              <div className="pt-1">
                {renderAnswer()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Single Accordion Fallback Component (for non-group accordions)
const SingleAccordion = ({ value, themeColor = '#8B5CF6' }: { value: any; themeColor?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const rawTitle = value.title || value.heading || value.question || value.label || 'Voir plus';
  const rawContent = value.content || value.body || value.answer || value.text || value.description;
  const title = typeof rawTitle === 'string' ? rawTitle : extractText(rawTitle);

  const renderContent = () => {
    if (!rawContent) return <p className="text-gray-400 italic">Contenu non disponible</p>;
    if (typeof rawContent === 'string') return <p className="text-gray-600 leading-relaxed text-[15px]">{rawContent}</p>;
    if (Array.isArray(rawContent)) {
      const hasPortableText = rawContent.some((item: any) => item?._type);
      if (hasPortableText) {
        return (
          <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none">
            <PortableText value={rawContent} />
          </div>
        );
      }
    }
    const text = extractText(rawContent);
    return text ? <p className="text-gray-600 leading-relaxed text-[15px]">{text}</p> : null;
  };

  return (
    <motion.div
      className="my-8 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100"
      initial={false}
      animate={{
        boxShadow: isOpen
          ? '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-6 text-left gap-4 transition-all duration-200 ${
          isOpen ? 'bg-gradient-to-r from-gray-50 to-white' : 'hover:bg-gray-50/50'
        }`}
      >
        <div className="flex items-center gap-4 flex-1">
          <motion.div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${themeColor}15` }}
            animate={{ scale: isOpen ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus className="w-5 h-5" style={{ color: themeColor }} />
            </motion.div>
          </motion.div>
          <span className={`font-semibold text-lg transition-colors duration-200 ${
            isOpen ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {title}
          </span>
        </div>

        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isOpen ? 'bg-gray-900' : 'bg-gray-100'
          }`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className={`w-4 h-4 transition-colors duration-200 ${
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
            <div className="px-6 pb-6 pl-[72px]">
              <div className="pt-2 border-t border-gray-100">
                <div className="pt-4">
                  {renderContent()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Accordion Group Component (handles multiple accordion items)
const AccordionBlock = ({ value, themeColor = '#8B5CF6' }: { value: any; themeColor?: string }) => {
  // Check if this is a group of accordions (has items array) or a single accordion
  const items = value.items || value.accordions || value.sections || [];
  const groupTitle = value.title || value.heading;
  const style = value.style || 'simple'; // 'simple', 'numbered', 'cards'

  // If it's a group with items
  if (Array.isArray(items) && items.length > 0) {
    return (
      <div className="my-10">
        {groupTitle && (
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: themeColor }}
            />
            <h4 className="text-xl font-bold text-gray-900">{groupTitle}</h4>
          </div>
        )}
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
          {items.map((item: any, index: number) => (
            <AccordionItem
              key={item._key || index}
              question={item.question || item.title || item.heading || `Question ${index + 1}`}
              answer={item.answer || item.content || item.body || item.text}
              defaultOpen={item.defaultOpen || false}
              index={index}
              style={style}
              isLast={index === items.length - 1}
              themeColor={themeColor}
            />
          ))}
        </div>
      </div>
    );
  }

  // Fallback: Single accordion item
  return <SingleAccordion value={value} themeColor={themeColor} />;
};

// Types
interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Article {
  _id: string;
  titre?: string;
  title?: string;
  description?: string;
  excerpt?: string;
  imageUrl?: string;
  mainImage?: string;
  datePublication?: string;
  publishedAt?: string;
  tempsLecture?: number;
  readTime?: number;
  contenu?: any[];
  body?: any[];
  auteur?: { nom: string; imageUrl?: string; bio?: string; twitter?: string; linkedin?: string; instagram?: string };
  author?: { name: string; imageUrl?: string; bio?: string; twitter?: string; linkedin?: string; instagram?: string };
  verticale?: { nom: string; couleurDominante?: string };
  categories?: Array<{ _id: string; title?: string }>;
  tags?: Array<{ _id: string; title?: string; color?: string; slug?: string }>;
  videoUrl?: string;
}

interface PopularArticle {
  _id: string;
  title?: string;
  slug: { current: string };
  imageUrl?: string;
  views?: number;
}

interface RelatedArticle {
  _id: string;
  titre?: string;
  title?: string;
  slug: { current: string };
  imageUrl?: string;
  verticale?: { nom: string; couleurDominante?: string };
}

export default function VideoPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // States
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [readingTimeLeft, setReadingTimeLeft] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [tocExpanded, setTocExpanded] = useState(false);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  // Sidebar sticky via JavaScript (plus fiable que CSS sticky)
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  // Extract headings from content
  useEffect(() => {
    if (article?.contenu || article?.body) {
      const content = article.contenu || article.body;
      const extracted: Heading[] = [];

      content.forEach((block: any, index: number) => {
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
  }, [article]);

  // Scroll progress + Reading time remaining
  useEffect(() => {
    const totalReadTime = article?.tempsLecture || article?.readTime || 5;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
      setShowScrollTop(scrollTop > 500);

      // Calculate remaining reading time
      const remaining = Math.ceil(totalReadTime * (1 - progress / 100));
      setReadingTimeLeft(Math.max(0, remaining));

      // Active heading detection
      headings.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 0) {
            setActiveHeading(heading.id);
          }
        }
      });
    };

    // Initialize reading time
    setReadingTimeLeft(totalReadTime);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, article]);

  // Sidebar sticky via JavaScript - comportement "sticky bottom"
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

    setTimeout(handleSidebarScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleSidebarScroll);
      window.removeEventListener('resize', handleSidebarScroll);
    };
  }, [article]);

  // Fetch video data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const articleData = await sanityFetch(VIDEO_BY_SLUG_QUERY, { slug });

        if (!articleData) {
          navigate('/404');
          return;
        }

        setArticle(articleData);

        // Fetch related videos and popular videos in parallel
        try {
          const [related, popular] = await Promise.all([
            sanityFetch(RELATED_VIDEOS_QUERY, { slug }),
            sanityFetch(POPULAR_VIDEOS_QUERY)
          ]);

          setRelatedArticles(related || []);
          // Filter out current video from popular
          setPopularArticles((popular || []).filter((p: any) => p._id !== articleData._id).slice(0, 4));
        } catch {
          setRelatedArticles([]);
          setPopularArticles([]);
        }
      } catch {
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
      window.scrollTo(0, 0);
    }
  }, [slug, navigate]);

  // Helpers
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = article?.titre || article?.title || '';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Je voulais partager cet article avec toi : ' + url)}`;
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        break;
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    setNewsletterSuccess(true);
    setNewsletterSubmitting(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setShowMobileToc(false);
    }
  };

  // Get theme color for styled headings
  const themeColorForHeadings = article?.verticale?.couleurDominante || '#8B5CF6';

  // Helper function to convert URLs in text to clickable links
  // Detects patterns like "Text : https://url.com" and makes "Text" the clickable link
  const linkifyText = (text: string): React.ReactNode => {
    // Pattern: "Some text : https://url" or "Some text: https://url"
    const labeledUrlRegex = /([^•\n]+?)\s*:\s*(https?:\/\/[^\s]+)/g;
    const simpleUrlRegex = /(https?:\/\/[^\s]+)/g;

    // First, try to find labeled URLs (text : url)
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    // Reset regex
    labeledUrlRegex.lastIndex = 0;

    while ((match = labeledUrlRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        // Check for simple URLs in the before text
        parts.push(...linkifySimpleUrls(beforeText, parts.length));
      }

      const label = match[1].trim();
      const url = match[2];

      // Add the labeled link
      parts.push(
        <a
          key={`labeled-${parts.length}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-600 hover:text-violet-700 underline transition-colors"
        >
          {label}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      parts.push(...linkifySimpleUrls(remainingText, parts.length));
    }

    return parts.length > 0 ? parts : text;
  };

  // Helper for simple URL detection (fallback)
  const linkifySimpleUrls = (text: string, keyOffset: number): React.ReactNode[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        urlRegex.lastIndex = 0;
        return (
          <a
            key={`simple-${keyOffset}-${index}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 hover:text-violet-700 underline transition-colors break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    }).filter(part => part !== '');
  };

  // Helper component to process children and linkify URLs
  const LinkifyChildren: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const processNode = (node: React.ReactNode): React.ReactNode => {
      if (typeof node === 'string') {
        return linkifyText(node);
      }
      if (Array.isArray(node)) {
        return node.map((child, i) => <React.Fragment key={i}>{processNode(child)}</React.Fragment>);
      }
      if (React.isValidElement(node) && node.props.children) {
        return React.cloneElement(node, {}, processNode(node.props.children));
      }
      return node;
    };
    return <>{processNode(children)}</>;
  };

  // PortableText components - Light theme with clear hierarchy
  const portableTextComponents = {
    block: {
      // H1: Main title with themed underline
      h1: ({ children, value }: any) => {
        const index = (article?.contenu || article?.body)?.findIndex((b: any) => b._key === value._key);
        const id = `heading-${index}`;
        return (
          <h1 id={id} className="text-3xl md:text-4xl font-bold text-gray-900 mt-10 mb-6 scroll-mt-24">
            {children}
          </h1>
        );
      },
      // H2: Big section titles with themed underline
      h2: ({ children, value }: any) => {
        const index = (article?.contenu || article?.body)?.findIndex((b: any) => b._key === value._key);
        const id = `heading-${index}`;
        return (
          <h2 id={id} className="mt-14 mb-6 scroll-mt-24">
            <span className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight block">{children}</span>
            <div
              className="mt-3 h-1 w-16 rounded-full"
              style={{ background: `linear-gradient(to right, ${themeColorForHeadings}, ${themeColorForHeadings}40)` }}
            />
          </h2>
        );
      },
      // H3: Subsection titles with themed underline
      h3: ({ children, value }: any) => {
        const index = (article?.contenu || article?.body)?.findIndex((b: any) => b._key === value._key);
        const id = `heading-${index}`;
        return (
          <h3 id={id} className="mt-10 mb-4 scroll-mt-24">
            <span className="text-xl md:text-2xl font-semibold text-gray-800">{children}</span>
            <div
              className="mt-2 h-0.5 w-10 rounded-full"
              style={{ background: `linear-gradient(to right, ${themeColorForHeadings}80, ${themeColorForHeadings}20)` }}
            />
          </h3>
        );
      },
      // H4: Small titles for lists or minor sections
      h4: ({ children }: any) => (
        <h4 className="mt-8 mb-3 text-lg font-semibold text-gray-600">
          {children}
        </h4>
      ),
      normal: ({ children }: any) => (
        <p className="text-gray-600 leading-relaxed mb-6 text-lg">
          <LinkifyChildren>{children}</LinkifyChildren>
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 pl-6 py-4 my-8 bg-gray-50 rounded-r-xl" style={{ borderColor: themeColorForHeadings }}>
          <p className="text-gray-700 italic text-lg">{children}</p>
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
      em: ({ children }: any) => <em className="italic text-violet-600">{children}</em>,
      link: ({ children, value }: any) => {
        const href = value?.href || value?.url || '';
        if (!href) {
          return <span className="text-violet-600">{children}</span>;
        }
        return (
          <a href={href} className="text-violet-600 hover:text-violet-700 underline transition-colors" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      },
      internalLink: ({ children, value }: any) => {
        const slug = value?.slug;
        if (!slug) {
          return <span>{children}</span>;
        }
        return (
          <a
            href={`/video/${slug}`}
            className="text-violet-600 hover:text-violet-700 underline decoration-violet-300 hover:decoration-violet-500 transition-colors"
          >
            {children}
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="space-y-3 mb-6 pl-0 list-none">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="space-y-3 mb-6 pl-0 list-none">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className="flex items-start gap-3 text-gray-700 text-lg leading-relaxed">
          <span className="flex-shrink-0 w-2 h-2 mt-2.5 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          <span className="flex-1"><LinkifyChildren>{children}</LinkifyChildren></span>
        </li>
      ),
      number: ({ children, index }: any) => (
        <li className="flex items-start gap-3 text-gray-700 text-lg leading-relaxed">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
            {(index ?? 0) + 1}
          </span>
          <span className="flex-1"><LinkifyChildren>{children}</LinkifyChildren></span>
        </li>
      ),
    },
    types: {
      // Image (avec limite de hauteur pour les images verticales)
      image: ({ value }: any) => {
        const imageUrl = value.asset?._ref
          ? getImageUrl(value.asset)
          : (value.asset?.url || value.url);

        if (!imageUrl) return null;

        return (
          <figure className="my-8 flex justify-center">
            <img
              src={imageUrl}
              alt={value.alt || ''}
              className="max-h-[400px] w-auto max-w-full rounded-2xl object-contain"
            />
            {value.caption && (
              <figcaption className="text-center text-gray-500 text-sm mt-3">{value.caption}</figcaption>
            )}
          </figure>
        );
      },

      // Image Gallery - Galerie d'images
      imageGallery: ({ value }: any) => {
        if (!value?.images?.length) return null;

        const layout = value.layout || 'single';

        // Grille responsive selon le layout
        const gridClasses: Record<string, string> = {
          'single': 'grid-cols-1',
          'grid-2': 'grid-cols-1 md:grid-cols-2 gap-4',
          'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
          'carousel': 'grid-cols-1',
          'masonry': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
        };

        return (
          <div className={`my-10 grid ${gridClasses[layout] || gridClasses.single}`}>
            {value.images.map((img: any) => (
              <figure key={img._key} className="relative group">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={img.imageUrl || img.asset?.url}
                    alt={img.caption || img.alt || ''}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {img.caption && (
                  <figcaption className="text-center text-gray-500 text-sm mt-3 italic">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        );
      },

      // Callout - Encadré d'information/alerte
      callout: ({ value }: any) => {
        const types: Record<string, { icon: any; bg: string; border: string; text: string; iconBg: string }> = {
          info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconBg: 'bg-blue-100' },
          warning: { icon: AlertCircle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconBg: 'bg-amber-100' },
          success: { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', iconBg: 'bg-emerald-100' },
          tip: { icon: Lightbulb, bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', iconBg: 'bg-violet-100' },
          remember: { icon: BookOpen, bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', iconBg: 'bg-indigo-100' },
          didyouknow: { icon: Sparkles, bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', iconBg: 'bg-pink-100' },
          key: { icon: Zap, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', iconBg: 'bg-orange-100' },
          testimonial: { icon: Heart, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', iconBg: 'bg-rose-100' },
          stat: { icon: TrendingUp, bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800', iconBg: 'bg-cyan-100' },
        };
        const style = types[value.type] || types.info;
        const Icon = style.icon;
        const content = value.text || value.content || value.body;
        const isRichText = Array.isArray(content);

        // Style spécial pour les stats
        if (value.type === 'stat') {
          return (
            <div className="my-10 p-8 rounded-2xl bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 border border-violet-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                {value.title && (
                  <h4 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{value.title}</h4>
                )}
              </div>
              <div className="text-gray-700 leading-relaxed pl-13">
                {isRichText ? <PortableText value={content} /> : <p>{content}</p>}
              </div>
              {value.source && (
                <p className="mt-4 text-sm text-violet-600/70 italic pl-13">Source : {value.source}</p>
              )}
            </div>
          );
        }

        return (
          <div className={`my-8 p-6 rounded-xl border ${style.bg} ${style.border}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${style.text}`} />
              </div>
              <div className={`${style.text} text-base leading-relaxed flex-1`}>
                {value.title && <p className="font-bold mb-2 text-lg">{value.title}</p>}
                {isRichText ? (
                  <PortableText value={content} />
                ) : content ? (
                  <p>{content}</p>
                ) : null}
                {value.source && (
                  <p className="mt-3 text-sm opacity-70 italic">Source : {value.source}</p>
                )}
              </div>
            </div>
          </div>
        );
      },

      // Styled Quote - Citation stylisée
      styledQuote: ({ value }: any) => {
        const quoteStyle = value.style || 'classic';

        // Helper pour rendre la source avec lien cliquable si sourceUrl existe
        const renderSource = () => {
          if (!value.source) return null;
          if (value.sourceUrl) {
            return (
              <a
                href={value.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-500 transition-colors underline underline-offset-2"
              >
                {value.source}
              </a>
            );
          }
          return <>{value.source}</>;
        };

        // Style Testimonial - avec photo et rôle
        if (quoteStyle === 'testimonial' || value.image) {
          return (
            <figure className="my-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-6">
                {value.image?.asset?.url && (
                  <div className="flex-shrink-0">
                    <img
                      src={value.image.asset.url}
                      alt={value.author || ''}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Quote className="w-8 h-8 text-violet-300 mb-3" />
                  <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed italic mb-4">
                    "{value.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-0.5 bg-violet-300" />
                    <div>
                      {value.author && <p className="font-bold text-gray-900">{value.author}</p>}
                      {value.role && <p className="text-sm text-gray-500">{value.role}</p>}
                      {value.source && <p className="text-xs text-gray-400 mt-1">{renderSource()}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          );
        }

        // Style Large - grande citation mise en avant
        if (quoteStyle === 'large') {
          return (
            <figure className="my-12 py-8 border-y border-gray-200">
              <blockquote className="text-center">
                <p className="text-2xl md:text-4xl font-medium text-gray-800 leading-relaxed italic max-w-3xl mx-auto">
                  "{value.quote}"
                </p>
              </blockquote>
              {(value.author || value.source) && (
                <figcaption className="mt-6 text-center text-gray-500">
                  {value.author && <span className="font-semibold text-gray-700">{value.author}</span>}
                  {value.role && <span className="text-gray-500">, {value.role}</span>}
                  {value.source && <span className="text-gray-400"> — {renderSource()}</span>}
                </figcaption>
              )}
            </figure>
          );
        }

        // Style Filled - avec fond coloré
        if (quoteStyle === 'filled') {
          return (
            <figure className="my-10 p-8 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              <Quote className="w-10 h-10 text-white/30 mb-4" />
              <blockquote>
                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                  "{value.quote}"
                </p>
              </blockquote>
              {(value.author || value.source) && (
                <figcaption className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-0.5 bg-white/50" />
                  <div>
                    {value.author && <span className="font-semibold">{value.author}</span>}
                    {value.role && <span className="opacity-80">, {value.role}</span>}
                  </div>
                </figcaption>
              )}
            </figure>
          );
        }

        // Style Bordered - encadré élégant
        if (quoteStyle === 'bordered') {
          return (
            <figure className="my-10 p-6 md:p-8 border-2 border-gray-200 rounded-2xl relative">
              <Quote className="absolute -top-4 left-6 w-8 h-8 text-violet-400 bg-white px-1" />
              <blockquote>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
                  "{value.quote}"
                </p>
              </blockquote>
              {(value.author || value.source) && (
                <figcaption className="mt-4 pt-4 border-t border-gray-100 text-gray-500">
                  {value.author && <span className="font-semibold text-gray-700">{value.author}</span>}
                  {value.role && <span className="text-gray-500">, {value.role}</span>}
                  {value.source && <span className="text-gray-400"> — {renderSource()}</span>}
                </figcaption>
              )}
            </figure>
          );
        }

        // Style Classic (défaut)
        return (
          <figure className="my-12 relative">
            <Quote className="absolute -top-4 -left-2 w-12 h-12 text-violet-200" />
            <blockquote className="pl-8 pr-4">
              <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed italic">
                "{value.quote}"
              </p>
            </blockquote>
            {(value.author || value.source) && (
              <figcaption className="mt-4 pl-8 text-gray-500">
                {value.author && <span className="font-semibold text-gray-700">{value.author}</span>}
                {value.role && <span className="text-gray-500">, {value.role}</span>}
                {value.source && <span className="text-gray-400"> — {renderSource()}</span>}
              </figcaption>
            )}
          </figure>
        );
      },

      // Accordion - Section dépliable
      accordion: ({ value }: any) => <AccordionBlock value={value} themeColor={themeColorForHeadings} />,

      // Key Takeaways - Points clés à retenir
      keyTakeaways: ({ value }: any) => {
        // Handle different field names for items
        const items = value.items || value.points || value.takeaways || value.list || value.content || value.bullets || [];

        // Fonction pour extraire le contenu portable text ou texte simple
        const renderPortableTextOrString = (content: any) => {
          if (!content) return null;
          if (typeof content === 'string') return <p>{content}</p>;
          if (Array.isArray(content)) {
            // Si c'est un array avec des objets qui ont _type, c'est du portable text
            const hasPortableText = content.some((item: any) => item?._type);
            if (hasPortableText) {
              return <PortableText value={content} />;
            }
            // Sinon c'est un array de strings ou autre
            return content.map((item: any, i: number) => {
              if (typeof item === 'string') return <p key={i}>{item}</p>;
              if (item?.text) return <p key={i}>{item.text}</p>;
              return null;
            });
          }
          if (content?._type === 'block') {
            return <PortableText value={[content]} />;
          }
          if (content?.text) return <p>{content.text}</p>;
          return null;
        };

        // Helper to get the right icon based on item.icon value
        const getIcon = (iconName?: string, size: string = 'w-5 h-5') => {
          switch (iconName) {
            case 'bulb':
            case 'lightbulb':
              return <Lightbulb className={`${size} text-amber-500 flex-shrink-0`} />;
            case 'check':
            case 'checkmark':
              return <CheckCircle className={`${size} text-emerald-500 flex-shrink-0`} />;
            case 'target':
              return <Target className={`${size} text-rose-500 flex-shrink-0`} />;
            case 'star':
              return <Star className={`${size} text-yellow-500 flex-shrink-0`} />;
            case 'key':
              return <Key className={`${size} text-indigo-500 flex-shrink-0`} />;
            case 'pin':
              return <MapPin className={`${size} text-red-500 flex-shrink-0`} />;
            case 'info':
              return <Info className={`${size} text-blue-500 flex-shrink-0`} />;
            case 'alert':
            case 'warning':
              return <AlertCircle className={`${size} text-amber-500 flex-shrink-0`} />;
            case 'sparkle':
            case 'sparkles':
              return <Sparkles className={`${size} text-violet-500 flex-shrink-0`} />;
            default:
              return <CheckCircle className={`${size} text-violet-500 flex-shrink-0`} />;
          }
        };

        // Get the style from Sanity (list, cards, boxed, timeline)
        const style = value.style || 'boxed';

        const renderItem = (item: any, index: number) => {
          // Get the icon for this item
          const itemIcon = item?.icon;

          // CAS 1: L'item est un objet avec title/heading ET content/body/description
          // Structure: { title: "...", content: [...] } ou { heading: "...", body: [...] }
          const itemTitle = item?.title || item?.heading || item?.label || item?.name;
          const itemContent = item?.content || item?.body || item?.description || item?.text || item?.details || item?.answer;

          if (itemTitle && itemContent) {
            return (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1">{getIcon(itemIcon)}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">{typeof itemTitle === 'string' ? itemTitle : extractText(itemTitle)}</p>
                  <div className="text-gray-600 text-sm">
                    {renderPortableTextOrString(itemContent)}
                  </div>
                </div>
              </li>
            );
          }

          // CAS 2: L'item a seulement un titre (sans contenu séparé)
          if (itemTitle && !itemContent) {
            return (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5">{getIcon(itemIcon)}</span>
                <span className="text-gray-700">{typeof itemTitle === 'string' ? itemTitle : extractText(itemTitle)}</span>
              </li>
            );
          }

          // CAS 2.5: L'item a seulement un contenu (text/content/description) sans titre
          // Structure: { text: "...", icon: "bulb" } ou { content: "..." } ou { text: [...portableText] }
          if (!itemTitle && itemContent) {
            // Si c'est une string simple
            if (typeof itemContent === 'string' && itemContent.length > 0) {
              return (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5">{getIcon(itemIcon)}</span>
                  <span className="text-gray-700">{itemContent}</span>
                </li>
              );
            }
            // Si c'est un array (portable text)
            if (Array.isArray(itemContent) && itemContent.length > 0) {
              return (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1">{getIcon(itemIcon)}</span>
                  <div className="text-gray-700 flex-1">
                    <PortableText value={itemContent} />
                  </div>
                </li>
              );
            }
            // Sinon essayer d'extraire le texte
            const contentText = extractText(itemContent);
            if (contentText) {
              return (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5">{getIcon(itemIcon)}</span>
                  <span className="text-gray-700">{contentText}</span>
                </li>
              );
            }
          }

          // CAS 3: L'item est directement du portable text (array)
          if (Array.isArray(item)) {
            return (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1">{getIcon(itemIcon)}</span>
                <div className="text-gray-700 flex-1">
                  <PortableText value={item} />
                </div>
              </li>
            );
          }

          // CAS 4: L'item est un bloc portable text unique
          if (item?._type === 'block') {
            return (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1">{getIcon(itemIcon)}</span>
                <div className="text-gray-700 flex-1">
                  <PortableText value={[item]} />
                </div>
              </li>
            );
          }

          // CAS 5: L'item est une string simple
          if (typeof item === 'string') {
            return (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5">{getIcon(itemIcon)}</span>
                <span className="text-gray-700">{item}</span>
              </li>
            );
          }

          // CAS 6: L'item a des children (bloc Sanity avec texte)
          if (item?.children && Array.isArray(item.children)) {
            const text = item.children.map((child: any) => child.text || '').join('');
            if (text) {
              return (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5">{getIcon(itemIcon)}</span>
                  <span className="text-gray-700">{text}</span>
                </li>
              );
            }
          }

          // CAS 7: Fallback - essayer d'extraire n'importe quel texte
          const text = extractText(item);
          if (text) {
            return (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5">{getIcon(itemIcon)}</span>
                <span className="text-gray-700">{text}</span>
              </li>
            );
          }

          // CAS 8: Dernier recours - chercher dans les propriétés connues
          if (item && typeof item === 'object') {
            // Liste des propriétés à ignorer (internes Sanity)
            const ignoredKeys = ['_key', '_type', '_ref', '_id', 'icon', 'style', 'defaultOpen'];
            // Liste des propriétés de contenu à privilégier
            const contentKeys = ['text', 'content', 'body', 'description', 'title', 'heading', 'answer', 'question', 'label', 'value', 'point'];

            // Chercher d'abord dans les propriétés de contenu connues
            for (const key of contentKeys) {
              const val = item[key];
              if (val) {
                // String simple
                if (typeof val === 'string' && val.length > 0) {
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-0.5">{getIcon(itemIcon)}</span>
                      <span className="text-gray-700">{val}</span>
                    </li>
                  );
                }
                // Array (portable text)
                if (Array.isArray(val) && val.length > 0) {
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1">{getIcon(itemIcon)}</span>
                      <div className="text-gray-700 flex-1">
                        <PortableText value={val} />
                      </div>
                    </li>
                  );
                }
                // Essayer d'extraire le texte
                const extracted = extractText(val);
                if (extracted) {
                  return (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-0.5">{getIcon(itemIcon)}</span>
                      <span className="text-gray-700">{extracted}</span>
                    </li>
                  );
                }
              }
            }

            // Sinon, chercher n'importe quelle string valide (pas les clés internes)
            for (const [key, val] of Object.entries(item)) {
              if (!ignoredKeys.includes(key) && typeof val === 'string' && val.length > 0) {
                return (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-0.5">{getIcon(itemIcon)}</span>
                    <span className="text-gray-700">{val}</span>
                  </li>
                );
              }
            }
          }

          return null;
        };

        // Render based on style
        // Style: LIST - Liste simple sans background
        if (style === 'list') {
          return (
            <div className="my-8">
              {value.title && (
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{value.title}</h4>
              )}
              <ul className="space-y-3">
                {Array.isArray(items) && items.map((item: any, index: number) => renderItem(item, index))}
              </ul>
            </div>
          );
        }

        // Style: CARDS - Chaque item dans une card séparée
        if (style === 'cards') {
          return (
            <div className="my-10">
              {value.title && (
                <h4 className="text-xl font-bold text-gray-900 mb-6">{value.title}</h4>
              )}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(items) && items.map((item: any, index: number) => {
                  const itemIcon = item?.icon;
                  const itemText = item?.text || item?.content || extractText(item);
                  return (
                    <div
                      key={index}
                      className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-violet-200 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center">
                          {getIcon(itemIcon, 'w-5 h-5')}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed flex-1">{itemText}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // Style: TIMELINE - Affichage vertical simple avec icônes
        if (style === 'timeline') {
          return (
            <div className="my-10">
              {value.title && (
                <h4 className="text-xl font-bold text-gray-900 mb-6">{value.title}</h4>
              )}
              <div className="space-y-4">
                {Array.isArray(items) && items.map((item: any, index: number) => {
                  const itemIcon = item?.icon;
                  const itemText = item?.text || item?.content || extractText(item);
                  return (
                    <div key={index} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                      {getIcon(itemIcon, 'w-5 h-5 mt-0.5')}
                      <p className="text-gray-700 flex-1">{itemText}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // Style: BOXED (default) - Encadré avec fond gradient
        return (
          <div className="my-10 p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-violet-600" />
              <h4 className="text-lg font-bold text-gray-900">{value.title || 'Points clés à retenir'}</h4>
            </div>
            <ul className="space-y-3">
              {Array.isArray(items) && items.map((item: any, index: number) => renderItem(item, index))}
            </ul>
          </div>
        );
      },

      // Progress Steps - Étapes numérotées
      progressSteps: ({ value }: any) => (
        <div className="my-10">
          {value.title && (
            <h4 className="text-xl font-bold text-gray-900 mb-6">{value.title}</h4>
          )}
          <div className="space-y-4">
            {value.steps?.map((step: { title: string; description: string }, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <h5 className="font-semibold text-gray-900 mb-1">{step.title}</h5>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),

      // Newsletter CTA - Appel à l'inscription newsletter
      newsletterCta: ({ value }: any) => (
        <div className="my-12 relative overflow-hidden">
          <div className="relative bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-100/50">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-violet-400/20 rounded-full blur-3xl" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <Mail className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {value.title || 'Restez informé'}
                </h4>
                <p className="text-gray-500 mb-0 max-w-lg">
                  {value.description || 'Inscrivez-vous à notre newsletter.'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  to="/newsletter"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-2xl hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg"
                >
                  <span>{value.buttonText || "S'abonner"}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ),

      // YouTube / Video Embed
      youtube: ({ value }: any) => {
        const videoId = value.url?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        return videoId ? (
          <div className="my-10 relative rounded-2xl overflow-hidden aspect-video bg-gray-900">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={value.title || 'Vidéo'}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null;
      },
      videoEmbed: ({ value }: any) => {
        const url = value.url || value.videoUrl;
        return url ? (
          <div className="my-10 relative rounded-2xl overflow-hidden aspect-video bg-gray-900">
            <iframe
              src={url}
              title={value.title || 'Vidéo'}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null;
      },
      video: ({ value }: any) => {
        const url = value.url || value.asset?.url;
        return url ? (
          <div className="my-10 rounded-2xl overflow-hidden">
            <video controls className="w-full" poster={value.poster}>
              <source src={url} type="video/mp4" />
            </video>
            {value.caption && <p className="text-center text-gray-500 text-sm mt-3">{value.caption}</p>}
          </div>
        ) : null;
      },

      // Audio
      audio: ({ value }: any) => {
        const url = value.url || value.asset?.url;
        return url ? (
          <div className="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
            {value.title && <h4 className="font-semibold text-gray-900 mb-3">{value.title}</h4>}
            <audio controls className="w-full">
              <source src={url} type="audio/mpeg" />
            </audio>
          </div>
        ) : null;
      },

      // Code Block
      code: ({ value }: any) => (
        <div className="my-8 rounded-2xl overflow-hidden bg-gray-900">
          {value.filename && (
            <div className="px-4 py-2 bg-gray-800 text-gray-400 text-sm font-mono border-b border-gray-700">
              {value.filename}
            </div>
          )}
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-gray-100 font-mono">{value.code}</code>
          </pre>
        </div>
      ),

      // Table
      table: ({ value }: any) => (
        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                {value.rows?.[0]?.cells?.map((cell: string, i: number) => (
                  <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.rows?.slice(1).map((row: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.cells?.map((cell: string, j: number) => (
                    <td key={j} className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),

      // Gallery
      gallery: ({ value }: any) => (
        <div className="my-10">
          {value.title && <h4 className="text-lg font-semibold text-gray-900 mb-4">{value.title}</h4>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {value.images?.map((img: any, i: number) => (
              <figure key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={img.asset?.url || img.url}
                  alt={img.alt || ''}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </figure>
            ))}
          </div>
          {value.caption && <p className="text-center text-gray-500 text-sm mt-4">{value.caption}</p>}
        </div>
      ),

      // Divider / Break
      divider: () => (
        <hr className="my-12 border-none h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      ),
      break: () => (
        <hr className="my-12 border-none h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      ),

      // Button / CTA
      button: ({ value }: any) => (
        <div className="my-8 text-center">
          <a
            href={value.url || value.link}
            target={value.external ? '_blank' : undefined}
            rel={value.external ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            {value.text || value.label}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ),
      cta: ({ value }: any) => (
        <div className="my-10 p-8 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl border border-violet-100 text-center">
          {value.title && <h4 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h4>}
          {value.description && <p className="text-gray-600 mb-6">{value.description}</p>}
          <Link
            to={value.url || value.link || '/'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-700 transition-colors"
          >
            {value.buttonText || value.text || 'En savoir plus'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ),

      // Social Embed (Twitter, Instagram, etc.)
      socialEmbed: ({ value }: any) => (
        <div className="my-8 flex justify-center">
          <div className="w-full max-w-lg" dangerouslySetInnerHTML={{ __html: value.embed || value.html || '' }} />
        </div>
      ),
      tweet: ({ value }: any) => (
        <div className="my-8 flex justify-center">
          <blockquote className="twitter-tweet" data-theme="light">
            <a href={value.url}></a>
          </blockquote>
        </div>
      ),

      // File Download
      file: ({ value }: any) => (
        <a
          href={value.asset?.url || value.url}
          download
          className="my-6 flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{value.title || value.filename || 'Télécharger le fichier'}</p>
            {value.description && <p className="text-sm text-gray-500">{value.description}</p>}
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </a>
      ),

      // Embed générique (iframes)
      embed: ({ value }: any) => (
        <div className="my-8 rounded-2xl overflow-hidden aspect-video bg-gray-100">
          <iframe
            src={value.url}
            title={value.title || 'Contenu intégré'}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      ),

      // Person / Author highlight
      person: ({ value }: any) => (
        <div className="my-8 flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          {value.image && (
            <img src={value.image.asset?.url || value.image} alt="" className="w-16 h-16 rounded-full object-cover" />
          )}
          <div>
            <p className="font-semibold text-gray-900">{value.name}</p>
            {value.role && <p className="text-sm text-gray-500">{value.role}</p>}
            {value.bio && <p className="text-sm text-gray-600 mt-2">{value.bio}</p>}
          </div>
        </div>
      ),

      // Related Articles - Articles liés (inline)
      relatedArticles: ({ value }: any) => {
        const articles = value.articles || value.items || [];
        if (!articles.length) return null;

        return (
          <div className="my-10 p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              {value.title || 'Articles recommandés'}
            </h4>
            <div className="grid gap-4">
              {articles.slice(0, 3).map((article: any, index: number) => {
                const slug = article.slug?.current || article.slug;
                const title = article.title || article.titre;
                const image = article.imageUrl || article.mainImage?.asset?.url;

                if (!slug || !title) return null;

                return (
                  <Link
                    key={index}
                    to={`/video/${slug}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    {image && (
                      <img
                        src={image}
                        alt={title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2">
                        {title}
                      </h5>
                      {article.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">{article.excerpt}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-500 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        );
      },

      // Fallback pour types inconnus
      unknown: ({ value }: any) => {
        // Essayer de rendre le contenu texte s'il existe
        if (value.text || value.content) {
          return <p className="text-gray-600 mb-6">{value.text || value.content}</p>;
        }
        return null;
      },
    },
  };

  // Loading state
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

  if (!article) return null;

  const title = article.titre || article.title || '';
  const description = article.description || article.excerpt || '';
  const imageUrl = article.imageUrl || article.mainImage || '';
  const date = article.datePublication || article.publishedAt;
  const readTime = article.tempsLecture || article.readTime || 5;
  // Filtrer le premier H1 et le premier YouTube (déjà affichés dans le header/hero)
  const rawContent = article.contenu || article.body || [];
  const content = rawContent.filter((block: any, index: number) => {
    // Ignorer le premier H1 (déjà affiché dans le header)
    if (block._type === 'block' && block.style === 'h1') {
      const firstH1Index = rawContent.findIndex((b: any) => b._type === 'block' && b.style === 'h1');
      if (index === firstH1Index) return false;
    }
    // Ignorer le premier bloc YouTube (déjà affiché dans le hero vidéo)
    if (block._type === 'youtube' && article.videoUrl) {
      const firstYoutubeIndex = rawContent.findIndex((b: any) => b._type === 'youtube');
      if (index === firstYoutubeIndex) return false;
    }
    return true;
  });
  const authorName = article.auteur?.nom || article.author?.name || 'Origines Media';
  const authorImage = article.auteur?.imageUrl || article.author?.imageUrl;
  const verticale = article.verticale;
  const themeColor = verticale?.couleurDominante || '#8B5CF6';

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title={title}
        description={description}
        url={`/video/${slug}`}
        image={imageUrl}
        type="video.other"
        author={authorName}
        section={verticale?.nom}
      />

      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 z-[60] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      {/* Hero YouTube - Vidéo en pleine largeur */}
      {article?.videoUrl && extractYouTubeId(article.videoUrl) && (
        <section className="bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(article.videoUrl)}?rel=0&modestbranding=1`}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      <main>
        {/* Hero Section - Split Layout (masqué si vidéo YouTube présente) */}
        <section className={`relative ${article?.videoUrl ? 'hidden' : ''}`}>
          {/* Header de navigation flottant */}
          <div className="absolute top-0 left-0 right-0 z-20 p-6 lg:p-10">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full shadow-xl hover:bg-gray-800 hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Retour</span>
            </button>
          </div>

          {/* Layout en deux colonnes */}
          <div className="grid lg:grid-cols-2 min-h-[70vh] lg:min-h-[80vh]">
            {/* Colonne image */}
            <div className="relative h-[45vh] lg:h-auto order-1 lg:order-1">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${imageUrl || '/placeholder.svg'})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-white" />
              </div>
            </div>

            {/* Colonne contenu */}
            <div className="flex flex-col justify-center p-6 lg:p-12 xl:p-16 bg-white order-2 lg:order-2">
              {/* Catégorie */}
              {verticale && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs uppercase tracking-[0.2em] font-semibold mb-4"
                  style={{ color: themeColor }}
                >
                  {verticale.nom}
                </motion.p>
              )}

              {/* Titre */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6 leading-[1.1]"
              >
                {typo(title)}
              </motion.h1>

              {/* Description */}
              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-lg text-gray-600 leading-relaxed mb-8"
                >
                  {typo(description)}
                </motion.p>
              )}

              {/* Métadonnées */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-4 text-gray-500 text-sm"
              >
                {authorImage && (
                  <img src={authorImage} alt={authorName} className="w-10 h-10 rounded-full object-cover border-2 border-gray-100" />
                )}
                <div className="flex flex-col">
                  <span className="text-gray-900 font-medium">{authorName}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(date)}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {readTime} min
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Tags */}
              {article.tags && article.tags.filter((t: any) => t && t.title).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-wrap gap-2 mt-6"
                >
                  {article.tags.filter((t: any) => t && t.title).slice(0, 4).map((tag: any) => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor: tag.color ? `${tag.color}15` : '#F3F4F6',
                        color: tag.color || '#6B7280',
                      }}
                    >
                      {tag.title}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Article Content */}
              <div ref={contentRef} className="lg:col-span-8">
                {/* Main Content */}
                <div className="prose prose-lg max-w-none">
                  <PortableText value={content} components={portableTextComponents} />
                </div>

                {/* Author Box */}
                <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
                  <div className="flex items-start gap-4">
                    {authorImage && (
                      <img src={authorImage} alt={authorName} className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="text-sm text-violet-600 mb-1">Écrit par</p>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{authorName}</h4>
                      {(article.auteur?.bio || article.author?.bio) && (
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {article.auteur?.bio || article.author?.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Premium - sticky via JavaScript */}
              <aside
                ref={sidebarContainerRef}
                className="hidden lg:block lg:col-span-4 relative"
              >
                <div
                  ref={sidebarRef}
                  className="space-y-4"
                  style={sidebarStyle}
                >
                  {/* 1. Table of Contents - Repliée par défaut */}
                  {headings.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setTocExpanded(!tocExpanded)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <span className="text-gray-900 font-bold flex items-center gap-2 text-sm">
                          <List className="w-4 h-4 text-violet-500" />
                          Sommaire
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${tocExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {tocExpanded && (
                          <motion.nav
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4 overflow-hidden"
                          >
                            {(() => {
                              let h2Index = 0;
                              return headings.map((heading) => {
                                const isH2 = heading.level === 2;
                                const isActive = activeHeading === heading.id;
                                if (isH2) h2Index++;

                                return (
                                  <button
                                    key={heading.id}
                                    onClick={() => scrollToSection(heading.id)}
                                    className={`group flex items-start gap-2.5 w-full text-left transition-all duration-200 ${
                                      isH2 ? 'py-2.5' : 'py-1.5 ml-7'
                                    }`}
                                  >
                                    {isH2 ? (
                                      <>
                                        <span
                                          className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                                            isActive
                                              ? 'bg-violet-500 text-white'
                                              : 'bg-violet-100 text-violet-600 group-hover:bg-violet-200'
                                          }`}
                                        >
                                          {h2Index}
                                        </span>
                                        <span
                                          className={`text-xs leading-tight transition-colors ${
                                            isActive
                                              ? 'text-violet-600 font-semibold'
                                              : 'text-gray-700 group-hover:text-gray-900 font-medium'
                                          }`}
                                        >
                                          {heading.text}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span
                                          className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 transition-all ${
                                            isActive
                                              ? 'bg-violet-500'
                                              : 'bg-gray-300 group-hover:bg-gray-400'
                                          }`}
                                        />
                                        <span
                                          className={`text-[11px] leading-tight transition-colors ${
                                            isActive
                                              ? 'text-violet-600 font-medium'
                                              : 'text-gray-500 group-hover:text-gray-700'
                                          }`}
                                        >
                                          {heading.text}
                                        </span>
                                      </>
                                    )}
                                  </button>
                                );
                              });
                            })()}
                          </motion.nav>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* 2. Share Widget - Logos uniquement, grille 4x2 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                    <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2 text-sm">
                      <Share2 className="w-4 h-4 text-violet-500" />
                      Partager
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {shareButtons.map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => handleShare(btn.id)}
                          className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-200 hover:border-transparent hover:text-white hover:scale-105"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = btn.color;
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = 'transparent';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#6B7280';
                            e.currentTarget.style.borderColor = '#E5E7EB';
                          }}
                          title={btn.label}
                        >
                          <btn.icon />
                        </button>
                      ))}
                      {/* Threads */}
                      <button
                        onClick={() => window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(article?.titre || article?.title || '')} ${encodeURIComponent(window.location.href)}`, '_blank')}
                        className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-200 hover:bg-black hover:text-white hover:border-transparent hover:scale-105"
                        title="Threads"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.942-.783 2.264-1.217 3.727-1.223h.036c1.26.005 2.378.296 3.322.864.376.226.706.493.99.796.03-.317.043-.636.036-.957-.05-2.358-.756-4.022-2.098-4.942-1.135-.778-2.704-1.18-4.663-1.194-.964.008-1.87.1-2.694.28l-.485-1.947c.985-.216 2.07-.326 3.227-.334 2.431.018 4.396.567 5.844 1.632 1.72 1.266 2.614 3.394 2.674 6.33.003.165.003.33-.001.495.404.252.773.546 1.106.88 1.01 1.016 1.674 2.37 1.885 3.878.257 1.838-.168 3.878-1.282 5.28-1.692 2.131-4.381 3.31-7.57 3.322zm-1.25-8.063c-.06 0-.12.001-.18.003-1.347.06-2.28.537-2.547 1.303-.13.372-.12.784.028 1.16.242.615.857 1.108 1.739 1.392.525.168 1.09.244 1.678.224 1.073-.057 1.896-.453 2.449-1.178.476-.625.78-1.487.902-2.565-.724-.383-1.578-.586-2.534-.59h-.036c-.51.001-1.003.083-1.5.25z"/>
                        </svg>
                      </button>
                      {/* Copy Link */}
                      <button
                        onClick={() => handleShare('copy')}
                        className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-200 hover:bg-violet-500 hover:text-white hover:border-transparent hover:scale-105"
                        title="Copier le lien"
                      >
                        {copySuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 3. Video Widget (if article has video) */}
                  {article?.videoUrl && (
                    <div className="bg-gray-900 rounded-2xl overflow-hidden">
                      <div className="relative aspect-video">
                        <img
                          src={imageUrl || '/placeholder.svg'}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <a
                            href={article.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                          >
                            <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
                          </a>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-white/70 text-[10px] font-medium">Voir en vidéo</p>
                        <p className="text-white text-xs font-bold mt-0.5 line-clamp-1">{title}</p>
                      </div>
                    </div>
                  )}

                  {/* 4. Tags Widget */}
                  {article?.tags && article.tags.filter(t => t && t.title).length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4 text-violet-500" />
                        Thématiques
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {article.tags.filter(t => t && t.title).map((tag) => (
                          <Link
                            key={tag._id}
                            to={`/bibliotheque?tag=${tag.slug || tag._id}`}
                            className="px-2.5 py-1 text-[10px] font-medium rounded-full transition-all duration-200 hover:scale-105"
                            style={{
                              backgroundColor: tag.color ? `${tag.color}15` : '#F3F4F6',
                              color: tag.color || '#6B7280',
                              border: `1px solid ${tag.color ? `${tag.color}30` : '#E5E7EB'}`
                            }}
                          >
                            {tag.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Newsletter / Lead Magnet - Design élégant */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-fuchsia-50 to-rose-50 border border-violet-100/50">
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-200/40 to-fuchsia-200/40 rounded-full blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-2xl" />

                    <div className="relative p-5">
                      {!newsletterSuccess ? (
                        <>
                          {/* Header avec image */}
                          <div className="text-center mb-4">
                            <img
                              src="/kit-introspection.jpg"
                              alt="Kit d'Introspection"
                              className="w-20 h-auto mx-auto rounded-xl shadow-lg shadow-violet-500/20 mb-3 -rotate-3 hover:rotate-0 transition-transform"
                            />
                            <h4 className="text-gray-900 font-bold text-base">Kit d'Introspection</h4>
                            <p className="text-violet-600/70 text-[11px] font-medium mt-1">Guide gratuit • 24 pages</p>
                          </div>

                          <p className="text-gray-600 text-xs text-center mb-4 leading-relaxed">
                            Les meilleurs outils de développement personnel de nos intervenants.
                          </p>

                          <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                            <input
                              type="email"
                              value={newsletterEmail}
                              onChange={(e) => setNewsletterEmail(e.target.value)}
                              placeholder="votre@email.com"
                              required
                              className="w-full px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-violet-200/50 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                            />
                            <button
                              type="submit"
                              disabled={!newsletterEmail.trim() || newsletterSubmitting}
                              className="w-full px-4 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-semibold rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
                            >
                              {newsletterSubmitting ? 'Envoi...' : 'Recevoir mon guide'}
                              {!newsletterSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
                            </button>
                          </form>

                          <p className="text-[10px] text-gray-400 text-center mt-3">
                            Pas de spam. Désabonnement en 1 clic.
                          </p>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/25">
                            <Check className="w-7 h-7 text-white" />
                          </div>
                          <p className="text-gray-900 font-bold text-base">Merci !</p>
                          <p className="text-gray-500 text-xs mt-1">Vérifiez votre boîte mail</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 6. Popular Articles - Avec images */}
                  {popularArticles.filter(p => p && p.title).length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-rose-500" />
                        Les plus lus
                      </h4>
                      <div className="space-y-3">
                        {popularArticles.filter(p => p && p.title).slice(0, 4).map((pop, idx) => (
                          <Link
                            key={pop._id}
                            to={`/video/${pop.slug?.current || pop._id}`}
                            className="group flex items-center gap-3"
                          >
                            <div className="relative flex-shrink-0">
                              <img
                                src={pop.imageUrl || '/placeholder.svg'}
                                alt=""
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
                                {idx + 1}
                              </span>
                            </div>
                            <span className="text-gray-700 text-xs font-medium line-clamp-2 group-hover:text-rose-600 transition-colors flex-1">
                              {pop.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 7. Related Articles */}
                  {relatedArticles.filter(r => r && r.slug?.current).length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                      <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2 text-sm">
                        <Play className="w-4 h-4 text-violet-500" />
                        À voir aussi
                      </h4>
                      <div className="space-y-3">
                        {relatedArticles.filter(r => r && r.slug?.current).slice(0, 3).map((related) => (
                          <Link
                            key={related._id}
                            to={`/video/${related.slug.current}`}
                            className="group flex gap-3"
                          >
                            <img
                              src={related.imageUrl || '/placeholder.svg'}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-gray-900 text-xs font-medium line-clamp-2 group-hover:text-violet-600 transition-colors">
                                {related.titre || related.title}
                              </h5>
                              {related.verticale && (
                                <span className="text-[10px] text-gray-500 mt-0.5 block">{related.verticale.nom}</span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 8. CTA Racontez votre histoire - Style épuré */}
                  <Link
                    to="/racontez-votre-histoire"
                    className="group block border border-gray-200 bg-white rounded-2xl p-4 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-500 transition-colors">
                        <PenLine className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-bold text-sm group-hover:text-violet-600 transition-colors">
                          Racontez votre histoire
                        </p>
                        <p className="text-gray-500 text-[10px]">
                          Partagez et inspirez
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>

                  {/* 9. Espace publicitaire */}
                  <div className="bg-gray-100 border border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px]">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
                      Publicité
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Videos Section (Full Width) */}
        {relatedArticles.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Vidéos{' '}
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  recommandées
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.slice(0, 3).map((related) => (
                  <Link
                    key={related._id}
                    to={`/video/${related.slug.current}`}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={related.imageUrl || '/placeholder.svg'}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      {related.verticale && (
                        <span
                          className="inline-block px-2 py-1 rounded text-xs font-bold mb-3"
                          style={{
                            backgroundColor: `${related.verticale.couleurDominante || '#8B5CF6'}15`,
                            color: related.verticale.couleurDominante || '#8B5CF6'
                          }}
                        >
                          {related.verticale.nom}
                        </span>
                      )}
                      <h3 className="text-gray-900 font-bold line-clamp-2 group-hover:text-violet-600 transition-colors">
                        {related.titre || related.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile Floating Action Bar */}
      <div className="fixed bottom-4 left-4 right-4 lg:hidden z-50">
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl">
          {/* Like */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              isLiked
                ? 'bg-pink-100 text-pink-500'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white font-medium transition-all"
          >
            <Share2 className="w-5 h-5" />
            <span>Partager</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              isBookmarked
                ? 'bg-violet-100 text-violet-500'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile TOC Button */}
      {headings.length > 0 && (
        <button
          onClick={() => setShowMobileToc(true)}
          className="fixed bottom-24 right-4 lg:hidden z-50 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-500/30"
        >
          <List className="w-6 h-6" />
        </button>
      )}

      {/* Mobile TOC Modal */}
      <AnimatePresence>
        {showMobileToc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobileToc(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-3xl max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900 font-bold text-lg">Sommaire</h3>
                  <button onClick={() => setShowMobileToc(false)} className="text-gray-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-3">
                  {headings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToSection(heading.id)}
                      className={`block w-full text-left py-2 px-4 rounded-xl transition-all ${
                        heading.level === 3 ? 'pl-8' : ''
                      } ${
                        activeHeading === heading.id
                          ? 'bg-violet-100 text-violet-600'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900 font-bold text-lg">Partager</h3>
                <button onClick={() => setShowShareModal(false)} className="text-gray-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {shareButtons.map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => handleShare(btn.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200"
                    style={{ backgroundColor: `${btn.color}10` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = btn.color;
                      (e.currentTarget.querySelector('span') as HTMLElement).style.color = 'white';
                      (e.currentTarget.querySelector('svg') as SVGElement).style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${btn.color}10`;
                      (e.currentTarget.querySelector('span') as HTMLElement).style.color = '#6B7280';
                      (e.currentTarget.querySelector('svg') as SVGElement).style.color = btn.color;
                    }}
                  >
                    <div style={{ color: btn.color }}>
                      <btn.icon />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">{btn.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => handleShare('copy')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-violet-50 hover:bg-violet-500 transition-all duration-200 group"
                >
                  {copySuccess ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Link2 className="w-4 h-4 text-violet-500 group-hover:text-white" />
                  )}
                  <span className="text-[10px] text-gray-500 group-hover:text-white font-medium">
                    {copySuccess ? 'Copié' : 'Lien'}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top - Bouton en bas de page */}
      <div className="py-8 flex justify-center bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm"
        >
          <ChevronUp className="w-5 h-5" />
          <span className="text-sm font-medium">Retour en haut</span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
