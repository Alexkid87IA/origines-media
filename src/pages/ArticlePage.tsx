// src/pages/ArticlePage.tsx
// Design épuré - Style minimaliste blanc + Sidebar Premium

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, Heart, Share2, Bookmark, Calendar,
  ChevronUp, Link2, Check, X, List
} from 'lucide-react';
import { sanityFetch } from '../lib/sanity';
import { getImageUrl } from '../lib/imageUrl';
import { ARTICLE_BY_SLUG_QUERY, RELATED_ARTICLES_QUERY, POPULAR_ARTICLES_QUERY } from '../lib/queries';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { PortableText } from '@portabletext/react';
import { typo } from '../lib/typography';
import { useShare } from '../hooks/useShare';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { AdPlaceholder } from '../components/AdSense';
import SafeHTML from '../components/ui/SafeHTML';
import { createPortableTextComponents } from '../components/article/PortableTextComponents';
import {
  XIcon, LinkedInIcon, InstagramIcon, shareButtons
} from '../components/article/SocialIcons';
import { Heading, Article, PopularArticle, RelatedArticle } from '../components/article/types';
import RelatedArticles from '../components/article/RelatedArticles';
import {
  SidebarTableOfContents, SidebarShare, SidebarVideo,
  SidebarTags, SidebarNewsletter, SidebarPopular,
  SidebarRelated, SidebarCTA
} from '../components/sidebar/index';

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [readingTimeLeft, setReadingTimeLeft] = useState(0);
  // Newsletter + ToC state moved to sidebar widgets

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const lastSidebarStateRef = useRef<string>('');

  // Sidebar sticky state
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  // Shared hooks
  const shareTitle = article?.titre || article?.title || '';
  const { copySuccess, handleShare, handleCopyLink } = useShare(shareTitle);
  const { scrollProgress, showScrollTop, scrollToTop } = useScrollProgress();

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
      // scrollProgress + showScrollTop handled by useScrollProgress hook

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

  // handleShare provided by useShare hook

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
  // handleCopyLink provided by useShare hook

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
                  <SidebarTableOfContents headings={headings} activeHeading={activeHeading} onScrollToSection={scrollToSection} />
                  <SidebarShare shareButtons={shareButtons} onShare={handleShare} title={article?.titre || article?.title || ''} copySuccess={copySuccess} />
                  {article?.videoUrl && <SidebarVideo videoUrl={article.videoUrl} imageUrl={imageUrl || ''} title={title} />}
                  {article?.tags && <SidebarTags tags={article.tags} />}
                  <SidebarNewsletter variant="coming-soon" />
                  <SidebarPopular items={popularArticles} contentType="article" />
                  <SidebarRelated items={relatedArticles} contentType="article" />
                  <SidebarCTA />
                  <AdPlaceholder format="rectangle" />
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Articles Section (Full Width) */}
        <RelatedArticles articles={relatedArticles} />
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
          onClick={scrollToTop}
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
