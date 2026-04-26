// src/components/HeroSection.tsx
// Hero — Split layout : image à gauche, contenu à droite
// Brand Bible v1.0 — Angular, Archivo, JetBrains Mono, papier #F7F5F0

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getUniversColors } from '../lib/universColors';
import { typo } from '../lib/typography';
import { sanityFetch } from '../lib/sanity';
import { sanityImg } from '../lib/sanityImage';

interface Portrait {
  id: number;
  titre: string;
  categorie: string;
  accroche: string;
  imageUrl: string;
  url: string;
}

interface HeroSectionProps {
  portraits?: Portrait[];
}

interface SanityArticle {
  _id: string;
  titre: string;
  extrait?: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  verticale?: {
    _id: string;
    nom: string;
    slug: string;
  };
}

interface SanityRecoItem {
  _key: string;
  titre: string;
}

interface SanityReco {
  _id: string;
  titre: string;
  type: string;
  accroche?: string;
  slug: string;
  imageUrl?: string;
  items?: SanityRecoItem[];
}

const HERO_RECOS_QUERY = `
  *[_type == "recommendation"] | order(_createdAt desc) {
    _id,
    titre,
    type,
    accroche,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    "items": items[0...5] { _key, titre }
  }
`;

const ARTICLES_DISCOVER_QUERY = `
  *[_type == "production" && coalesce(typeArticle, "article") in ["article", "actu", "guide", "interview"]] | order(datePublication desc) [0...50] {
    _id,
    titre,
    extrait,
    description,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    "verticale": verticale->{
      _id,
      nom,
      "slug": slug.current
    }
  }
`;

const typeLabels: Record<string, string> = {
  'livres': 'Livres',
  'films-series': 'Films & Séries',
  'musique': 'Musique',
  'podcasts': 'Podcasts',
  'reseaux-sociaux': 'Réseaux',
  'youtube': 'YouTube',
  'activite': 'Activité',
  'destination': 'Destination',
  'culture': 'Culture',
  'produit': 'Produits',
};

const categoryImages: Record<string, string> = {
  'livres': '/recos/reco_livre.png',
  'livre': '/recos/reco_livre.png',
  'films-series': '/recos/reco_film_serie.png',
  'film': '/recos/reco_film_serie.png',
  'musique': '/recos/reco_musique.png',
  'podcasts': '/recos/reco_podcast.png',
  'podcast': '/recos/reco_podcast.png',
  'youtube': '/recos/reco_youtube.png',
  'reseaux-sociaux': '/recos/reco_social.png',
  'activite': '/recos/reco_activite.png',
  'destination': '/recos/reco_destination.png',
  'culture': '/recos/reco_culture.png',
  'produit': '/recos/reco_produit.png',
};

const HeroSection: React.FC<HeroSectionProps> = ({ portraits = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<{
    id: string;
    type: string;
    typeKey: string;
    title: string;
    imageUrl: string;
    slug: string;
    description: string;
    items: string[];
  }>>([]);
  const [articles, setArticles] = useState<SanityArticle[]>([]);

  // --- Fetch recommandations ---
  useEffect(() => {
    const fetchRecos = async () => {
      try {
        const data = await sanityFetch(HERO_RECOS_QUERY) as SanityReco[];
        if (data && data.length > 0) {
          const today = new Date();
          const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
          const seed = dayOfYear + today.getFullYear();

          const seededShuffle = <T,>(array: T[], seedValue: number): T[] => {
            const result = [...array];
            let currentSeed = seedValue;
            const random = () => {
              currentSeed = (currentSeed * 9301 + 49297) % 233280;
              return currentSeed / 233280;
            };
            for (let i = result.length - 1; i > 0; i--) {
              const j = Math.floor(random() * (i + 1));
              [result[i], result[j]] = [result[j], result[i]];
            }
            return result;
          };

          const shuffled = seededShuffle(data, seed);
          const selected: SanityReco[] = [];
          for (const reco of shuffled) {
            if (selected.length === 0) {
              selected.push(reco);
            } else if (selected.length === 1 && reco.type !== selected[0].type) {
              selected.push(reco);
              break;
            }
          }
          if (selected.length < 2 && shuffled.length >= 2) {
            const nextReco = shuffled.find(r => !selected.includes(r));
            if (nextReco) selected.push(nextReco);
          }

          setRecommendations(selected.slice(0, 2).map(reco => ({
            id: reco._id,
            type: typeLabels[reco.type] || reco.type,
            typeKey: reco.type,
            title: reco.titre,
            imageUrl: reco.imageUrl || '',
            slug: reco.slug,
            description: reco.accroche || '',
            items: reco.items?.map(item => item.titre) || [],
          })));
        }
      } catch (error) {
        console.error('Erreur fetch recommandations hero:', error);
      }
    };
    fetchRecos();
  }, []);

  // --- Fetch articles ---
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await sanityFetch(ARTICLES_DISCOVER_QUERY) as SanityArticle[];
        if (data && data.length > 0) setArticles(data);
      } catch (error) {
        console.error('Erreur fetch articles discover:', error);
      }
    };
    fetchArticles();
  }, []);

  const allItems = portraits.slice(0, 7);

  const discoverItems = React.useMemo(() => {
    if (articles.length === 0) return [];
    const slideshowTitles = new Set(allItems.map(p => p.titre.toLowerCase().trim()));
    const available = articles.filter(a => !slideshowTitles.has(a.titre.toLowerCase().trim()));
    return available.slice(0, 12);
  }, [articles, allItems]);

  const discoverPages = React.useMemo(() => {
    const pages: SanityArticle[][] = [];
    for (let i = 0; i < discoverItems.length; i += 3) {
      const page = discoverItems.slice(i, i + 3);
      if (page.length === 3) pages.push(page);
    }
    return pages;
  }, [discoverItems]);

  const [discoverPage, setDiscoverPage] = useState(0);

  // Auto-slide
  useEffect(() => {
    if (allItems.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % allItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allItems.length]);

  // Swipe
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) { setIsSwiping(false); return; }
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setIsSwiping(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!isSwiping || !touchStartX || !touchEndX) { setIsSwiping(false); return; }
    const d = touchStartX - touchEndX;
    if (d > minSwipeDistance && allItems.length > 1) setActiveIndex(prev => (prev + 1) % allItems.length);
    if (d < -minSwipeDistance && allItems.length > 1) setActiveIndex(prev => (prev - 1 + allItems.length) % allItems.length);
    setIsSwiping(false);
  };

  if (allItems.length === 0) return null;
  const safeIndex = Math.min(activeIndex, allItems.length - 1);
  const currentItem = allItems[safeIndex];
  if (!currentItem) return null;
  const currentColors = getUniversColors(currentItem.categorie);

  return (
    <section style={{ backgroundColor: '#F7F5F0' }}>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* HERO — Split layout : image à gauche, contenu à droite     */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-10 sm:pb-12 lg:pb-14">

        {/* Filet fin + compteur */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="h-px flex-1" style={{ backgroundColor: '#E8E5DE' }} />
          <span className="font-jetbrains text-[11px] tracking-[0.14em] pl-4" style={{ color: '#B8B6AF' }}>
            {String(safeIndex + 1).padStart(2, '0')} / {String(allItems.length).padStart(2, '0')}
          </span>
        </div>

        {/* Split grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-0"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* ── Image ── */}
          <div
            className="relative overflow-hidden cursor-pointer"
            style={{ aspectRatio: '4 / 5' }}
            onClick={() => {
              if (!isSwiping && allItems.length > 1) setActiveIndex(prev => (prev + 1) % allItems.length);
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={safeIndex}
                src={sanityImg(currentItem.imageUrl, 800)}
                alt={currentItem.titre}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </AnimatePresence>

            {/* Progress bar en bas de l'image */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <motion.div
                className="h-full"
                style={{ backgroundColor: currentColors.bg }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
                key={`bar-${safeIndex}`}
              />
            </div>
          </div>

          {/* ── Contenu ── */}
          <div className="flex flex-col justify-center pt-6 lg:pt-0 lg:pl-12 xl:pl-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${safeIndex}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Catégorie — eyebrow */}
                <span
                  className="font-jetbrains text-[11px] font-medium uppercase tracking-[0.14em]"
                  style={{ color: currentColors.dark }}
                >
                  {currentItem.categorie}
                </span>

                {/* Titre */}
                <Link to={currentItem.url} className="group block mt-5">
                  <h1
                    className="font-archivo font-black text-[28px] sm:text-[36px] lg:text-[40px] xl:text-[44px] leading-[1.05] tracking-[-0.03em]"
                    style={{ color: '#0A0A0A' }}
                  >
                    {typo(currentItem.titre)}
                  </h1>
                </Link>

                {/* Accroche */}
                {currentItem.accroche && (
                  <p
                    className="font-inter-tight text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.55] mt-5 max-w-lg"
                    style={{ color: '#6B6B6B' }}
                  >
                    {typo(currentItem.accroche)}
                  </p>
                )}

                {/* CTA — lien discret */}
                <Link
                  to={currentItem.url}
                  className="group inline-flex items-center gap-2 mt-6 font-jetbrains text-[11px] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
                  style={{ color: currentColors.dark }}
                >
                  Lire l'histoire
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Dots navigation */}
            <div className="flex items-center gap-1.5 mt-8 pt-6" style={{ borderTop: '1px solid #E8E5DE' }}>
              {allItems.map((_, index) => {
                const isActive = index === safeIndex;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className="h-[3px] rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? '20px' : '8px',
                      backgroundColor: isActive ? '#0A0A0A' : '#E8E5DE',
                    }}
                    aria-label={`Slide ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* À LIRE AUSSI — grille minimale                              */}
      {/* ════════════════════════════════════════════════════════════ */}
      {discoverPages.length > 0 && (
        <div style={{ borderTop: '1px solid #E8E5DE' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-archivo font-black text-[20px] sm:text-[24px] tracking-[-0.03em] leading-[1.1]" style={{ color: '#0A0A0A' }}>
                À lire aussi
              </h2>
              <Link
                to="/articles"
                className="group inline-flex items-center gap-1.5 font-jetbrains text-[10px] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-60"
                style={{ color: '#6B6B6B' }}
              >
                Tout voir
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Grille 3 colonnes */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={discoverPage}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
                >
                  {(discoverPages[discoverPage] || []).map((article, index) => {
                    const verticaleName = article.verticale?.nom || 'Actualité';
                    const itemColors = getUniversColors(verticaleName);

                    return (
                      <motion.div
                        key={article._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                      >
                        <Link to={`/article/${article.slug}`} className="group block">
                          <div className="aspect-[4/3] overflow-hidden mb-4">
                            <img
                              src={sanityImg(article.imageUrl, 400) || '/placeholder.svg'}
                              alt={article.titre}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                          </div>
                          <span
                            className="font-jetbrains text-[10px] font-medium uppercase tracking-[0.12em]"
                            style={{ color: itemColors.dark }}
                          >
                            {verticaleName}
                          </span>
                          <h3
                            className="font-archivo font-extrabold text-[17px] sm:text-[18px] leading-[1.2] tracking-[-0.015em] mt-1.5 line-clamp-3 group-hover:opacity-70 transition-opacity"
                            style={{ color: '#0A0A0A' }}
                          >
                            {typo(article.titre)}
                          </h3>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {discoverPages.length > 1 && (
                <div className="flex items-center gap-1.5 mt-8">
                  {discoverPages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setDiscoverPage(i)}
                      className="h-[3px] rounded-full transition-all duration-300"
                      style={{
                        width: i === discoverPage ? '20px' : '8px',
                        backgroundColor: i === discoverPage ? '#0A0A0A' : '#E8E5DE',
                      }}
                      aria-label={`Page ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* RECOMMANDATIONS — compact, image + texte côte à côte        */}
      {/* ════════════════════════════════════════════════════════════ */}
      {recommendations.length > 0 && (
        <div style={{ borderTop: '1px solid #E8E5DE' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">

            <div className="flex items-center justify-between mb-8">
              <h2 className="font-archivo font-black text-[20px] sm:text-[24px] tracking-[-0.03em] leading-[1.1]" style={{ color: '#0A0A0A' }}>
                On recommande
              </h2>
              <Link
                to="/recommandations"
                className="group inline-flex items-center gap-1.5 font-jetbrains text-[10px] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-60"
                style={{ color: '#6B6B6B' }}
              >
                Tout voir
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {recommendations.map((reco, index) => {
                const recoColors = getUniversColors(reco.type);
                const categoryImage = categoryImages[reco.typeKey];

                return (
                  <motion.div
                    key={reco.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                  >
                    <Link
                      to={`/recommandations/${reco.slug}`}
                      className="group flex gap-4 sm:gap-5"
                    >
                      <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden">
                        <img
                          src={categoryImage}
                          alt={reco.type}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span
                          className="font-jetbrains text-[10px] font-medium uppercase tracking-[0.12em] mb-1"
                          style={{ color: recoColors.dark }}
                        >
                          {reco.type}
                        </span>
                        <h3
                          className="font-archivo font-extrabold text-[17px] sm:text-[19px] leading-[1.15] tracking-[-0.015em] line-clamp-2 group-hover:opacity-70 transition-opacity mb-1.5"
                          style={{ color: '#0A0A0A' }}
                        >
                          {typo(reco.title)}
                        </h3>
                        {reco.items.length > 0 && (
                          <p className="font-inter-tight text-[13px] leading-[1.4] truncate" style={{ color: '#B8B6AF' }}>
                            {reco.items.slice(0, 3).join(' · ')}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
