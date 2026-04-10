// src/pages/PortraitDetailPage.tsx
// Design avec Sidebar complète + Navigation entre histoires

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Quote, Share2, Heart, BookOpen,
  TrendingUp, Route, Users, Brain, Flame, LucideIcon
} from 'lucide-react';
import { sanityFetch } from '../lib/sanity';
import { PORTRAIT_BY_SLUG_QUERY, SIMILAR_HISTOIRES_QUERY, ALL_HISTOIRES_SLUGS_QUERY } from '../lib/queries';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { typo } from '../lib/typography';
import { getTagCategory, getCategoryColors } from '../lib/tagCategories';
import { PortraitSidebar, PortraitNavigationFooter } from '../components/portrait';
import type {
  Tag, PortableTextBlock, Production, Portrait,
  HistoireNav, SimilarHistoire, Heading
} from '../components/portrait/types';

// Extraire l'ID YouTube d'une URL
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// Rendu du Portable Text avec IDs pour le sommaire
function renderPortableText(blocks: PortableTextBlock[], onHeadingsExtracted?: (headings: Heading[]) => void): React.ReactNode {
  if (!blocks || blocks.length === 0) return null;

  const headings: Heading[] = [];

  const content = blocks.map((block) => {
    // Bloc YouTube
    if (block._type === 'youtube') {
      const url = block.url;
      if (!url) return null;

      const videoId = getYouTubeId(url);
      if (!videoId) return null;

      return (
        <div key={block._key} className="my-8">
          <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-lg bg-gray-900">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title="Vidéo YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </div>
      );
    }

    // Bloc texte
    if (block._type === 'block' && block.children) {
      const text = block.children.map(child => child.text || '').join('');
      if (!text.trim()) return null;

      const id = `section-${block._key}`;

      switch (block.style) {
        case 'h1':
          headings.push({ id, text, level: 1 });
          return <h1 key={block._key} id={id} className="text-2xl font-bold text-gray-900 mt-10 mb-4 scroll-mt-24">{text}</h1>;
        case 'h2':
          headings.push({ id, text, level: 2 });
          return <h2 key={block._key} id={id} className="text-xl font-semibold text-gray-900 mt-8 mb-3 scroll-mt-24">{text}</h2>;
        case 'h3':
          headings.push({ id, text, level: 3 });
          return <h3 key={block._key} id={id} className="text-lg font-semibold text-gray-800 mt-6 mb-2 scroll-mt-24">{text}</h3>;
        case 'blockquote':
          return <blockquote key={block._key} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6">{text}</blockquote>;
        default:
          return <p key={block._key} className="text-gray-600 leading-relaxed mb-4">{text}</p>;
      }
    }

    return null;
  });

  // Notifier les headings extraits
  if (onHeadingsExtracted && headings.length > 0) {
    setTimeout(() => onHeadingsExtracted(headings), 0);
  }

  return content;
}

// Icônes par catégorie thématique
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  emotions: Heart,
  developpement: TrendingUp,
  parcours: Route,
  relations: Users,
  sante: Brain,
  epreuves: Flame
};

function PortraitDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [portrait, setPortrait] = useState<Portrait | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  // Navigation et sidebar
  const [allHistoires, setAllHistoires] = useState<HistoireNav[]>([]);
  const [similarHistoires, setSimilarHistoires] = useState<SimilarHistoire[]>([]);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  // tocExpanded state moved to PortraitSidebar component

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);

  // Charger le portrait
  useEffect(() => {
    const fetchPortrait = async () => {
      try {
        const data = await sanityFetch(PORTRAIT_BY_SLUG_QUERY, { slug });

        if (!data) {
          navigate('/404');
          return;
        }

        setPortrait(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPortrait();
      // Reset states
      setHeadings([]);
      setActiveHeading('');
    }
  }, [slug, navigate]);

  // Charger toutes les histoires pour navigation
  useEffect(() => {
    const fetchAllHistoires = async () => {
      try {
        const data = await sanityFetch<HistoireNav[]>(ALL_HISTOIRES_SLUGS_QUERY);
        setAllHistoires(data || []);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Erreur chargement navigation histoires:', error);
        }
      }
    };
    fetchAllHistoires();
  }, []);

  // Charger les histoires similaires
  useEffect(() => {
    if (!portrait) return;

    const fetchSimilar = async () => {
      try {
        const tagIds = portrait.tags?.map(t => t._id) || [];
        const universId = portrait.univers?._id || '';

        if (import.meta.env.DEV) {
          console.log('🔍 Fetching similar histoires with:', { currentId: portrait._id, tagIds, universId });
        }

        const data = await sanityFetch<SimilarHistoire[]>(SIMILAR_HISTOIRES_QUERY, {
          currentId: portrait._id,
          tagIds,
          universId
        });

        if (import.meta.env.DEV) {
          console.log('📋 Similar histoires found:', data?.length || 0, data);
        }

        setSimilarHistoires(data || []);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('❌ Erreur chargement histoires similaires:', error);
        }
      }
    };
    fetchSimilar();
  }, [portrait]);

  // Navigation précédent/suivant
  const { prevHistoire, nextHistoire, currentIndex, totalHistoires } = useMemo(() => {
    if (!slug || allHistoires.length === 0) {
      return { prevHistoire: null, nextHistoire: null, currentIndex: -1, totalHistoires: 0 };
    }

    const idx = allHistoires.findIndex(h => h.slug === slug);
    return {
      prevHistoire: idx > 0 ? allHistoires[idx - 1] : null,
      nextHistoire: idx < allHistoires.length - 1 ? allHistoires[idx + 1] : null,
      currentIndex: idx,
      totalHistoires: allHistoires.length
    };
  }, [slug, allHistoires]);

  // Scroll spy pour le TOC
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;

      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element && element.offsetTop <= scrollPos) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // Sidebar sticky - Utiliser CSS sticky au lieu de JS pour éviter les problèmes de clic
  // Le JS sticky causait des problèmes avec les événements de clic

  // Déterminer la catégorie thématique et les couleurs
  const { mainCategory, colors, CategoryIcon } = useMemo(() => {
    if (!portrait?.tags || portrait.tags.length === 0) {
      return {
        mainCategory: null,
        colors: getCategoryColors('parcours'),
        CategoryIcon: Route
      };
    }

    for (const tag of portrait.tags) {
      const category = getTagCategory(tag.slug);
      if (category) {
        return {
          mainCategory: category,
          colors: getCategoryColors(category.id),
          CategoryIcon: CATEGORY_ICONS[category.id] || Route
        };
      }
    }

    return {
      mainCategory: null,
      colors: getCategoryColors('parcours'),
      CategoryIcon: Route
    };
  }, [portrait?.tags]);

  // Vérifier si on a une vraie image
  const hasImage = portrait?.imageUrl && !portrait.imageUrl.includes('placeholder');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!portrait) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-900 text-2xl font-bold mb-4">Histoire non trouvée</h1>
          <button
            onClick={() => navigate('/histoires')}
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            Retour aux histoires
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = portrait.dateNaissance
    ? new Date(portrait.dateNaissance).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  const categoryLabel = mainCategory?.nom || portrait.categorie || 'Histoire';

  // ═══════════════════════════════════════════════════════════════
  // SIDEBAR
  // ═══════════════════════════════════════════════════════════════
  const sidebarJSX = (
    <PortraitSidebar
      currentIndex={currentIndex}
      totalHistoires={totalHistoires}
      prevHistoire={prevHistoire}
      nextHistoire={nextHistoire}
      headings={headings}
      activeHeading={activeHeading}
      onScrollToSection={scrollToSection}
      similarHistoires={similarHistoires}
      colors={colors}
    />
  );

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION PREV/NEXT EN BAS
  // ═══════════════════════════════════════════════════════════════
  const navigationFooterJSX = (
    <PortraitNavigationFooter
      prevHistoire={prevHistoire}
      nextHistoire={nextHistoire}
      colors={colors}
    />
  );


  // ═══════════════════════════════════════════════════════════════
  // LAYOUT TEXT-FIRST (pas d'image)
  // ═══════════════════════════════════════════════════════════════
  if (!hasImage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEO
          title={portrait.titre}
          description={portrait.accroche || portrait.citation || `Découvrez l'histoire de ${portrait.titre} sur Origines Media.`}
          image={portrait.imageUrl}
          url={`/histoire/${portrait.slug?.current || slug}`}
          type="profile"
          jsonLd="person"
          breadcrumbs={[
            { name: 'Accueil', url: '/' },
            { name: 'Histoires', url: '/histoires' },
            { name: portrait.titre, url: `/histoire/${portrait.slug?.current || slug}` }
          ]}
        />
        <Navbar />

        <main>
          {/* Hero Text-First avec fond coloré */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative overflow-hidden"
            style={{ backgroundColor: colors.bg }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 opacity-10">
              <Quote className="w-64 h-64 text-white -mt-16 -mr-16" />
            </div>
            <div className="absolute bottom-0 left-0 opacity-5">
              <CategoryIcon className="w-96 h-96 text-white -mb-32 -ml-32" />
            </div>

            {/* Navigation */}
            <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(-1)}
                  className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors backdrop-blur-sm bg-white/10">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span className="text-xs uppercase tracking-wider">Retour</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:border-white/50 transition-colors backdrop-blur-sm bg-white/10"
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-white text-white' : 'text-white/80'}`} />
                  </button>
                  <button className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:border-white/50 transition-colors backdrop-blur-sm bg-white/10">
                    <Share2 className="w-4 h-4 text-white/80" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              {/* Category badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CategoryIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/80 text-xs font-bold uppercase tracking-wider">
                  {categoryLabel}
                </span>
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight max-w-3xl"
              >
                {typo(portrait.titre)}
              </motion.h1>

              {/* Accroche */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg lg:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl"
              >
                {typo(portrait.accroche)}
              </motion.p>

              {/* Metadata */}
              {(formattedDate || portrait.lieuNaissance) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-4 text-white/60 text-sm mb-8"
                >
                  {formattedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Né(e) le {formattedDate}</span>
                    </div>
                  )}
                  {portrait.lieuNaissance && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{portrait.lieuNaissance}</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Citation featured */}
              {portrait.citation && (
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl"
                >
                  <Quote className="absolute -top-3 -left-3 w-8 h-8 text-white/30" />
                  <p className="text-lg lg:text-xl text-white/90 italic leading-relaxed pl-4">
                    "{typo(portrait.citation)}"
                  </p>
                </motion.blockquote>
              )}

              {/* Tags */}
              {portrait.tags && portrait.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 mt-8"
                >
                  {portrait.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-white/80 backdrop-blur-sm"
                    >
                      {tag.nom}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Contenu principal avec Sidebar */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-12 gap-8">
              {/* Contenu */}
              <div ref={contentRef} className="col-span-12 lg:col-span-8">
                {/* Contenu de la production liée */}
                {portrait.productions && portrait.productions.length > 0 && portrait.productions[0].contenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                  >
                    <div className="max-w-none">
                      {renderPortableText(portrait.productions[0].contenu, setHeadings)}
                    </div>
                  </motion.div>
                )}

                {/* Biographie (fallback) */}
                {portrait.biographie && (!portrait.productions || portrait.productions.length === 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                  >
                    <h2 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-3">
                      <BookOpen className="w-6 h-6" style={{ color: colors.bg }} />
                      L'histoire
                    </h2>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {typo(portrait.biographie)}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Navigation prev/next */}
                {navigationFooterJSX}
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block col-span-4">
                {sidebarJSX}
              </aside>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT AVEC IMAGE
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SEO
        title={portrait.titre}
        description={portrait.accroche || portrait.citation || `Découvrez l'histoire de ${portrait.titre} sur Origines Media.`}
        image={portrait.imageUrl}
        url={`/histoire/${portrait.slug?.current || slug}`}
        type="profile"
        jsonLd="person"
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Histoires', url: '/histoires' },
          { name: portrait.titre, url: `/histoire/${portrait.slug?.current || slug}` }
        ]}
      />
      <Navbar />

      <main>
        {/* Hero Section avec portrait */}
        <div className="relative">
          {/* Header de navigation */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-8 lg:p-16">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-white/90 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors backdrop-blur-sm bg-black/20">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="text-sm uppercase tracking-wider">Retour</span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLiked(!liked)}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-white/50 transition-colors backdrop-blur-sm bg-black/20"
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
              <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-white/50 transition-colors backdrop-blur-sm bg-black/20">
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Layout en deux colonnes */}
          <div className="grid lg:grid-cols-2 min-h-[80vh]">
            {/* Colonne image */}
            <div className="relative h-[50vh] lg:h-auto">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${portrait.imageUrl})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/30 lg:to-white" />
              </div>
            </div>

            {/* Colonne contenu */}
            <div className="flex flex-col justify-center p-8 lg:p-16 xl:p-24 bg-white">
              {/* Catégorie */}
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4 font-medium"
                style={{ color: colors.bg }}
              >
                {categoryLabel}
              </p>

              {/* Nom */}
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 mb-6 leading-[0.9]">
                {typo(portrait.titre)}
              </h1>

              {/* Accroche */}
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
                {typo(portrait.accroche)}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-6 text-gray-500 text-sm mb-8">
                {formattedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Né(e) le {formattedDate}</span>
                  </div>
                )}
                {portrait.lieuNaissance && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{portrait.lieuNaissance}</span>
                  </div>
                )}
              </div>

              {/* Citation */}
              {portrait.citation && (
                <blockquote
                  className="relative rounded-xl p-6 border"
                  style={{
                    backgroundColor: `${colors.bg}08`,
                    borderColor: `${colors.bg}20`
                  }}
                >
                  <Quote className="absolute -top-3 -left-3 w-8 h-8" style={{ color: `${colors.bg}40` }} />
                  <p className="text-xl lg:text-2xl text-gray-700 italic leading-relaxed pl-4">
                    "{typo(portrait.citation)}"
                  </p>
                </blockquote>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal avec Sidebar */}
        <div className="max-w-6xl mx-auto px-8 lg:px-16 py-16">
          <div className="grid grid-cols-12 gap-8">
            {/* Contenu */}
            <div ref={contentRef} className="col-span-12 lg:col-span-8">
              {/* Contenu de la production liée */}
              {portrait.productions && portrait.productions.length > 0 && portrait.productions[0].contenu && (
                <div className="mb-16">
                  <div className="max-w-none">
                    {renderPortableText(portrait.productions[0].contenu, setHeadings)}
                  </div>
                </div>
              )}

              {/* Biographie (fallback) */}
              {portrait.biographie && (!portrait.productions || portrait.productions.length === 0) && (
                <div className="mb-16">
                  <h2 className="font-bold text-3xl text-gray-900 mb-8">
                    L'histoire
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {typo(portrait.biographie)}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation prev/next */}
              {navigationFooterJSX}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block col-span-4">
              {sidebarJSX}
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PortraitDetailPage;
