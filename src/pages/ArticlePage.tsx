// src/pages/ArticlePage.tsx
// Design épuré - Style minimaliste blanc + Sidebar Premium

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { ARTICLE_BY_SLUG_QUERY, RELATED_ARTICLES_QUERY, POPULAR_ARTICLES_QUERY } from '../lib/queries';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { PortableText } from '@portabletext/react';
import { typo } from '../lib/typography';
import { AdPlaceholder } from '../components/AdSense';
import SafeHTML from '../components/ui/SafeHTML';
import { createPortableTextComponents } from '../components/article/PortableTextComponents';
import {
  XIcon, LinkedInIcon, InstagramIcon, shareButtons
} from '../components/article/SocialIcons';
import { Heading, Article, PopularArticle, RelatedArticle } from '../components/article/types';

export default function ArticlePage() {
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
  const lastSidebarStateRef = useRef<string>('');

  // Sidebar sticky state
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

      let newState: string;
      let newStyle: React.CSSProperties;

      if (sidebarBottomIfRelative > viewportHeight) {
        // État 1: Le bas de la sidebar n'a pas encore atteint le bas du viewport
        newState = 'relative';
        newStyle = { position: 'relative', top: 0 };
      } else if (containerRect.bottom > sidebarHeight) {
        // État 2: Le bas de la sidebar a atteint le bas du viewport
        const topPosition = viewportHeight - sidebarHeight;
        newState = `fixed-${Math.round(topPosition)}-${container.offsetWidth}`;
        newStyle = { position: 'fixed', top: topPosition, width: container.offsetWidth };
      } else {
        // État 3: Le conteneur est presque fini
        newState = 'absolute';
        newStyle = { position: 'absolute', bottom: 0, top: 'auto', width: '100%' };
      }

      // Évite les re-renders inutiles
      if (lastSidebarStateRef.current !== newState) {
        lastSidebarStateRef.current = newState;
        setSidebarStyle(newStyle);
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

  // Fetch article data
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) setLoading(true);
        const articleData = await sanityFetch(ARTICLE_BY_SLUG_QUERY, { slug });

        if (!isMounted) return;

        if (!articleData) {
          if (isMounted) navigate('/404');
          return;
        }

        if (isMounted) setArticle(articleData);

        // Fetch related articles and popular articles in parallel
        try {
          const categoryIds = articleData.categories?.map((c: any) => c?._id).filter(Boolean) || [];
          const tagIds = articleData.tags?.map((t: any) => t?._id).filter(Boolean) || [];

          const [related, popular] = await Promise.all([
            sanityFetch(RELATED_ARTICLES_QUERY, {
              currentId: articleData._id,
              categoryIds,
              tagIds,
              universId: articleData.univers?._id || null,
              verticaleId: articleData.verticale?._id || null
            }),
            sanityFetch(POPULAR_ARTICLES_QUERY)
          ]);

          if (isMounted) {
            setRelatedArticles(related || []);
            // Filter out current article from popular
            setPopularArticles((popular || []).filter((p: any) => p._id !== articleData._id).slice(0, 4));
          }
        } catch {
          if (isMounted) {
            setRelatedArticles([]);
            setPopularArticles([]);
          }
        }
      } catch {
        if (isMounted) navigate('/404');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (slug) {
      fetchData();
      window.scrollTo(0, 0);
    }

    return () => {
      isMounted = false;
    };
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

  // Use extracted PortableText components factory (memoized to prevent re-renders)
  const portableTextComponents = useMemo(
    () => createPortableTextComponents({ themeColor: themeColorForHeadings, article }),
    [themeColorForHeadings, article]
  );

  // Loading state - Skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          {/* Skeleton pour le titre */}
          <div className="h-12 bg-gray-200 rounded-lg w-3/4 mb-4" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8" />

          {/* Skeleton pour l'image */}
          <div className="aspect-video bg-gray-200 rounded-xl mb-8" />

          {/* Skeleton pour le contenu */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-8">L'article que vous cherchez n'existe pas ou a été déplacé.</p>
          <Link
            to="/"
            className="px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const title = article.titre || article.title || 'Article';
  const description = article.description || article.excerpt || '';
  const imageUrl = article.imageUrl || article.mainImage || '';
  const date = article.datePublication || article.publishedAt;
  const readTime = article.tempsLecture || article.readTime || 5;
  const content = article.contenu || article.body || [];
  const verticale = article.verticale;
  const themeColor = verticale?.couleurDominante || '#8B5CF6';
  const tags = article.tags || [];
  const author = article.auteur || article.author;
  const authorName = author?.nom || author?.name || 'Rédaction';
  const authorBio = author?.bio || '';
  const authorRole = author?.role || 'Auteur';
  const authorSpecialites = author?.specialites || [];
  const authorImage = author?.imageUrl || author?.image?.asset?.url;
  const authorSocial = {
    twitter: author?.twitter || author?.social?.twitter,
    linkedin: author?.linkedin || author?.social?.linkedin,
    instagram: author?.instagram || author?.social?.instagram
  };

  // Share modal open
  const handleShareClick = () => setShowShareModal(true);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const formattedDate = date ? new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '';

  // Determine verticale slug based on nom
  const getVerticaleSlug = (nom: string | undefined) => {
    if (!nom) return 'actualites';
    switch(nom.toLowerCase()) {
      case 'santé': return 'sante';
      case 'écologie': return 'ecologie';
      case 'société': return 'societe';
      case 'géopolitique': return 'geopolitique';
      default: return nom.toLowerCase();
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title={title}
        description={description}
        url={`/article/${slug}`}
        image={imageUrl}
        type="article"
        author={authorName}
        publishedTime={date}
        section={verticale?.nom}
        jsonLd="article"
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Bibliothèque', url: '/bibliotheque' },
          ...(verticale?.nom ? [{ name: verticale.nom, url: `/univers/${verticale.slug?.current || verticale.nom.toLowerCase()}` }] : []),
          { name: title, url: `/article/${slug}` }
        ]}
      />

      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 z-[60] transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="pb-24 lg:pb-0">
        {/* Hero Section - Split Layout comme PortraitDetailPage */}
        <section className="relative">
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
                  <div className="flex items-start gap-5">
                    {authorImage && (
                      <img
                        src={authorImage}
                        alt={authorName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-violet-600 mb-1">Écrit par</p>
                      <h4 className="text-xl font-bold text-gray-900">{authorName}</h4>
                      {authorRole && (
                        <p className="text-sm text-gray-600 mb-2">{authorRole}</p>
                      )}
                      {authorBio && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-3">
                          {authorBio}
                        </p>
                      )}
                      {/* Réseaux sociaux */}
                      {(authorSocial?.linkedin || authorSocial?.instagram || authorSocial?.twitter) && (
                        <div className="flex items-center gap-3 mt-3">
                          {authorSocial?.linkedin && (
                            <a
                              href={authorSocial.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors"
                              title="LinkedIn"
                            >
                              <LinkedInIcon />
                            </a>
                          )}
                          {authorSocial?.instagram && (
                            <a
                              href={authorSocial.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-[#E4405F] hover:border-[#E4405F] transition-colors"
                              title="Instagram"
                            >
                              <InstagramIcon />
                            </a>
                          )}
                          {authorSocial?.twitter && (
                            <a
                              href={authorSocial.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-black hover:border-black transition-colors"
                              title="X (Twitter)"
                            >
                              <XIcon />
                            </a>
                          )}
                        </div>
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
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${tocExpanded ? 'rotate-180' : ''}`} />
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
                                    className={`group flex items-start gap-2.5 w-full text-left transition-all duration-300 ${
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
                          className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-300 hover:border-transparent hover:text-white hover:scale-105"
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
                        className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-300 hover:bg-black hover:text-white hover:border-transparent hover:scale-105"
                        title="Threads"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.942-.783 2.264-1.217 3.727-1.223h.036c1.26.005 2.378.296 3.322.864.376.226.706.493.99.796.03-.317.043-.636.036-.957-.05-2.358-.756-4.022-2.098-4.942-1.135-.778-2.704-1.18-4.663-1.194-.964.008-1.87.1-2.694.28l-.485-1.947c.985-.216 2.07-.326 3.227-.334 2.431.018 4.396.567 5.844 1.632 1.72 1.266 2.614 3.394 2.674 6.33.003.165.003.33-.001.495.404.252.773.546 1.106.88 1.01 1.016 1.674 2.37 1.885 3.878.257 1.838-.168 3.878-1.282 5.28-1.692 2.131-4.381 3.31-7.57 3.322zm-1.25-8.063c-.06 0-.12.001-.18.003-1.347.06-2.28.537-2.547 1.303-.13.372-.12.784.028 1.16.242.615.857 1.108 1.739 1.392.525.168 1.09.244 1.678.224 1.073-.057 1.896-.453 2.449-1.178.476-.625.78-1.487.902-2.565-.724-.383-1.578-.586-2.534-.59h-.036c-.51.001-1.003.083-1.5.25z"/>
                        </svg>
                      </button>
                      {/* Copy Link */}
                      <button
                        onClick={() => handleShare('copy')}
                        className="flex items-center justify-center w-full aspect-square rounded-xl bg-white border border-gray-200 text-gray-500 transition-all duration-300 hover:bg-violet-500 hover:text-white hover:border-transparent hover:scale-105"
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
                          alt={`Miniature vidéo : ${article?.titre || 'Vidéo'}`}
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
                            className="px-2.5 py-1 text-[10px] font-medium rounded-full transition-all duration-300 hover:scale-105"
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

                  {/* 5. Kit d'Introspection - Bientôt disponible */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50 via-fuchsia-50 to-rose-50 border border-violet-100/50">
                    {/* Decorative elements */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-200/40 to-fuchsia-200/40 rounded-full blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-2xl" />

                    <div className="relative p-5">
                      {/* Header avec image */}
                      <div className="text-center mb-4">
                        <div className="relative inline-block">
                          <img
                            src="/kit-introspection.jpg"
                            alt="Kit d'Introspection"
                            className="w-20 h-auto mx-auto rounded-xl shadow-lg shadow-violet-500/20 mb-3 -rotate-3 grayscale-[30%]"
                          />
                          {/* Badge Bientôt disponible */}
                          <span className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[8px] font-bold uppercase tracking-wider rounded-full shadow-lg animate-pulse">
                            Bientôt
                          </span>
                        </div>
                        <h4 className="text-gray-900 font-bold text-base">Kit d'Introspection</h4>
                        <p className="text-violet-600/70 text-[11px] font-medium mt-1">Guide gratuit • 24 pages</p>
                      </div>

                      <p className="text-gray-600 text-xs text-center mb-4 leading-relaxed">
                        Les meilleurs outils de développement personnel de nos intervenants.
                      </p>

                      {/* Coming Soon Badge */}
                      <div className="bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-xl p-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-2">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span className="text-amber-700 text-[10px] font-bold uppercase tracking-wider">Bientôt disponible</span>
                        </div>
                        <p className="text-gray-500 text-[11px]">
                          Nous préparons quelque chose de spécial pour vous.
                        </p>
                      </div>
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
                            to={`/article/${pop.slug?.current || pop._id}`}
                            className="group flex items-center gap-3"
                          >
                            <div className="relative flex-shrink-0">
                              <img
                                src={pop.imageUrl || '/placeholder.svg'}
                                alt={pop.title || 'Article populaire'}
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
                        <BookOpen className="w-4 h-4 text-violet-500" />
                        À lire aussi
                      </h4>
                      <div className="space-y-3">
                        {relatedArticles.filter(r => r && r.slug?.current).slice(0, 3).map((related) => (
                          <Link
                            key={related._id}
                            to={`/article/${related.slug.current}`}
                            className="group flex gap-3"
                          >
                            <img
                              src={related.imageUrl || '/placeholder.svg'}
                              alt={related.titre || related.title || 'Article connexe'}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                              loading="lazy"
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
                  <AdPlaceholder format="rectangle" />
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Articles Section (Full Width) */}
        {relatedArticles.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Articles{' '}
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  recommandés
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.slice(0, 6).map((related) => (
                  <Link
                    key={related._id}
                    to={`/article/${related.slug.current}`}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all"
                  >
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={related.imageUrl || '/placeholder.svg'}
                        alt={related.titre || related.title || 'Article connexe'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
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
      <div
        className="fixed bottom-0 left-0 right-0 lg:hidden z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 bg-gradient-to-t from-white via-white to-transparent"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl">
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
          className="fixed right-4 lg:hidden z-50 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-500/30"
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
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
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300"
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
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-violet-50 hover:bg-violet-500 transition-all duration-300 group"
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
