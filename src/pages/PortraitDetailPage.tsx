// src/pages/PortraitDetailPage.tsx
// Design avec Sidebar complète + Navigation entre histoires

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Quote,
  Share2,
  Heart,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Route,
  Users,
  Brain,
  Flame,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  List,
  PenLine,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { sanityFetch } from '../lib/sanity';
import { PORTRAIT_BY_SLUG_QUERY, SIMILAR_HISTOIRES_QUERY, ALL_HISTOIRES_SLUGS_QUERY } from '../lib/queries';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { typo } from '../lib/typography';
import { getTagCategory, getCategoryColors } from '../lib/tagCategories';

interface Tag {
  _id: string;
  nom: string;
  slug: string;
  couleur?: string;
}

interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{
    _type: string;
    _key: string;
    text?: string;
    marks?: string[];
  }>;
  url?: string;
}

interface Production {
  _id: string;
  titre: string;
  imageUrl?: string;
  slug: string;
  description?: string;
  typeArticle?: string;
  videoUrl?: string;
  contenu?: PortableTextBlock[];
}

interface Portrait {
  _id: string;
  titre: string;
  categorie: string;
  accroche: string;
  imageUrl?: string;
  slug: { current: string };
  biographie?: string;
  citation?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  tags?: Tag[];
  univers?: { _id: string; nom: string; couleur: string };
  productions?: Production[];
}

interface HistoireNav {
  _id: string;
  titre: string;
  categorie?: string;
  slug: string;
  tags?: { nom: string; couleur?: string };
}

interface SimilarHistoire {
  _id: string;
  titre: string;
  categorie?: string;
  accroche?: string;
  slug: string | { current: string };
  citation?: string;
  tags?: Tag[];
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

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
  const [tocExpanded, setTocExpanded] = useState(true);

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
        console.error('Erreur chargement navigation histoires:', error);
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

        console.log('🔍 Fetching similar histoires with:', { currentId: portrait._id, tagIds, universId });

        const data = await sanityFetch<SimilarHistoire[]>(SIMILAR_HISTOIRES_QUERY, {
          currentId: portrait._id,
          tagIds,
          universId
        });

        console.log('📋 Similar histoires found:', data?.length || 0, data);

        setSimilarHistoires(data || []);
      } catch (error) {
        console.error('❌ Erreur chargement histoires similaires:', error);
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
  // SIDEBAR JSX (variable, pas composant pour éviter problèmes de re-render)
  // ═══════════════════════════════════════════════════════════════
  const sidebarJSX = (
    <div className="sticky top-24 space-y-4">
      {/* Navigation rapide */}
      {currentIndex >= 0 && (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200/50 p-4" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span>Histoire {currentIndex + 1} / {totalHistoires}</span>
          </div>
          <div className="flex gap-2">
            {prevHistoire ? (
              <Link
                to={`/histoire/${prevHistoire.slug}`}
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="truncate">Précédente</span>
              </Link>
            ) : (
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-300 text-sm cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                <span>Précédente</span>
              </div>
            )}
            {nextHistoire ? (
              <Link
                to={`/histoire/${nextHistoire.slug}`}
                className="flex-1 flex items-center justify-end gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
              >
                <span className="truncate">Suivante</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex-1 flex items-center justify-end gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-300 text-sm cursor-not-allowed">
                <span>Suivante</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table des matières */}
      {headings.length > 0 && (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200/50 overflow-hidden" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}>
          <button
            onClick={() => setTocExpanded(!tocExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sommaire</span>
            </div>
            {tocExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {tocExpanded && (
            <nav className="p-3 max-h-64 overflow-y-auto">
              <ul className="space-y-1">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <button
                      onClick={() => scrollToSection(heading.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        activeHeading === heading.id
                          ? 'font-medium'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      style={{
                        paddingLeft: `${12 + (heading.level - 1) * 12}px`,
                        color: activeHeading === heading.id ? colors.bg : undefined,
                        backgroundColor: activeHeading === heading.id ? `${colors.bg}10` : undefined
                      }}
                    >
                      <span className="line-clamp-2">{heading.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      )}

      {/* Histoires similaires */}
      {similarHistoires.length > 0 && (
        <div className="bg-white rounded-2xl ring-1 ring-gray-200/50 overflow-hidden" style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)' }}>
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Histoires similaires
            </h3>
          </div>
          <div className="p-3 space-y-2">
            {similarHistoires.slice(0, 4).map((histoire) => {
              const histoireCategory = histoire.tags?.[0] ? getTagCategory(histoire.tags[0].slug) : null;
              const histoireColors = histoireCategory ? getCategoryColors(histoireCategory.id) : colors;
              // Handle slug as string or object
              const histoireSlug = typeof histoire.slug === 'string' ? histoire.slug : histoire.slug?.current;

              if (!histoireSlug) return null;

              return (
                <Link
                  key={histoire._id}
                  to={`/histoire/${histoireSlug}`}
                  className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${histoireColors.bg}15` }}
                    >
                      <Quote className="w-4 h-4" style={{ color: histoireColors.bg }} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors">
                        {typo(histoire.titre)}
                      </h4>
                      {histoire.citation && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 italic">
                          "{histoire.citation}"
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link
            to="/histoires"
            className="flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100 text-sm font-medium hover:bg-gray-50 transition-colors"
            style={{ color: colors.bg }}
          >
            Voir toutes les histoires
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* CTA Raconter */}
      <div
        className="p-4 rounded-2xl ring-1 ring-gray-200/50"
        style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <PenLine className="w-4 h-4" style={{ color: colors.bg }} />
          <h4 className="font-semibold text-gray-900 text-sm">
            Vous avez une histoire ?
          </h4>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          {typo("Partagez votre parcours et inspirez des milliers de lecteurs.")}
        </p>
        <Link
          to="/racontez-votre-histoire"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-full transition-all hover:opacity-90"
          style={{ backgroundColor: colors.bg }}
        >
          Racontez la vôtre
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION PREV/NEXT EN BAS - Design Premium (variable JSX)
  // ═══════════════════════════════════════════════════════════════
  const navigationFooterJSX = (prevHistoire || nextHistoire) ? (
    <div className="mt-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Continuer la lecture</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Précédent */}
          {prevHistoire ? (
            <Link
              to={`/histoire/${prevHistoire.slug}`}
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: colors.bg,
                boxShadow: `0 4px 20px -4px ${colors.bg}50`
              }}
            >
              {/* Decorative */}
              <div className="absolute top-0 right-0 opacity-10">
                <Quote className="w-24 h-24 text-white -mt-6 -mr-6" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-white/60 mb-3">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Histoire précédente</span>
                </div>
                <h4 className="font-bold text-white text-lg leading-snug line-clamp-2 group-hover:text-white/90 transition-colors">
                  {typo(prevHistoire.titre)}
                </h4>
                {prevHistoire.categorie && (
                  <span className="inline-block mt-3 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/20 text-white/80">
                    {prevHistoire.categorie}
                  </span>
                )}
              </div>

              {/* Hover effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, transparent 0%, ${colors.bg}30 100%)` }}
              />
            </Link>
          ) : (
            <div className="rounded-2xl p-6 bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-400">Vous êtes au début</span>
            </div>
          )}

          {/* Suivant */}
          {nextHistoire ? (
            <Link
              to={`/histoire/${nextHistoire.slug}`}
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: colors.bg,
                boxShadow: `0 4px 20px -4px ${colors.bg}50`
              }}
            >
              {/* Decorative */}
              <div className="absolute top-0 left-0 opacity-10">
                <Quote className="w-24 h-24 text-white -mt-6 -ml-6 transform scale-x-[-1]" />
              </div>

              <div className="relative z-10 text-right">
                <div className="flex items-center justify-end gap-2 text-white/60 mb-3">
                  <span className="text-xs font-medium uppercase tracking-wider">Histoire suivante</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-lg leading-snug line-clamp-2 group-hover:text-white/90 transition-colors">
                  {typo(nextHistoire.titre)}
                </h4>
                {nextHistoire.categorie && (
                  <span className="inline-block mt-3 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/20 text-white/80">
                    {nextHistoire.categorie}
                  </span>
                )}
              </div>

              {/* Hover effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(225deg, transparent 0%, ${colors.bg}30 100%)` }}
              />
            </Link>
          ) : (
            <div className="rounded-2xl p-6 bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <span className="text-sm text-gray-400">Vous êtes à la fin</span>
            </div>
          )}
        </div>

        {/* Retour à la liste */}
        <div className="flex justify-center mt-6">
          <Link
            to="/histoires"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Voir toutes les histoires
          </Link>
        </div>
      </div>
  ) : null;

  // ═══════════════════════════════════════════════════════════════
  // LAYOUT TEXT-FIRST (pas d'image)
  // ═══════════════════════════════════════════════════════════════
  if (!hasImage) {
    return (
      <div className="min-h-screen bg-gray-50">
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
