// src/pages/RecherchePage.tsx
// V2 — angular design system, CSS modules, no lucide-react
// Page de recherche globale - Filtrage cote client

import React, { useState, useEffect, useMemo, memo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import Footer2 from '@/components/Footer2';
import ScrollToTopV2 from '@/components/ScrollToTop/ScrollToTopV2';
import SEO from '../components/SEO';
import { sanityFetch } from '../lib/sanity';
import { typo } from '../lib/typography';
import { getUniversColors } from '../lib/universColors';
import s from './RecherchePage.module.css';

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const IconFileText = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconBookOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SearchResult {
  _id: string;
  titre: string;
  slug: string;
  type: 'article' | 'histoire' | 'video' | 'recommandation';
  imageUrl?: string;
  extrait?: string;
  verticale?: { nom: string; couleurDominante: string };
  categorie?: string;
}

interface RawArticle {
  _id: string;
  titre: string;
  slug: string;
  typeArticle?: string;
  imageUrl?: string;
  extrait?: string;
  description?: string;
  verticale?: { nom: string; couleurDominante: string };
}

interface RawHistoire {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  accroche?: string;
  citation?: string;
  categorie?: string;
}

interface RawReco {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  accroche?: string;
  type?: string;
}

/* ------------------------------------------------------------------ */
/*  Sanity queries                                                     */
/* ------------------------------------------------------------------ */

const ALL_ARTICLES_QUERY = `
  *[_type == "production"] | order(datePublication desc) {
    _id,
    titre,
    "slug": slug.current,
    typeArticle,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    extrait,
    description,
    "verticale": verticale->{
      nom,
      couleurDominante
    }
  }
`;

const ALL_HISTOIRES_QUERY = `
  *[_type == "portrait"] | order(_createdAt desc) {
    _id,
    titre,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    accroche,
    citation,
    categorie
  }
`;

const ALL_RECOS_QUERY = `
  *[_type == "recommendation"] | order(_createdAt desc) {
    _id,
    titre,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    accroche,
    type
  }
`;

/* ------------------------------------------------------------------ */
/*  Text normalisation (accent-tolerant search)                        */
/* ------------------------------------------------------------------ */

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters (e -> e + accent)
    .replace(/[̀-ͯ]/g, '') // Remove accent marks
    .replace(/[œ]/g, 'oe') // Ligatures
    .replace(/[æ]/g, 'ae')
    .trim();
};

/* ------------------------------------------------------------------ */
/*  Type config                                                        */
/* ------------------------------------------------------------------ */

const TYPE_CONFIG: Record<
  string,
  {
    label: string;
    Icon: React.FC;
    color: string;
    path: string;
  }
> = {
  article: { label: 'Article', Icon: IconFileText, color: '#10B981', path: '/article' },
  video: { label: 'Video', Icon: IconPlay, color: '#06B6D4', path: '/video' },
  histoire: { label: 'Histoire', Icon: IconHeart, color: '#EC4899', path: '/histoire' },
  recommandation: { label: 'Reco', Icon: IconStar, color: '#F59E0B', path: '/recommandation' },
};

/* ------------------------------------------------------------------ */
/*  Result card                                                        */
/* ------------------------------------------------------------------ */

const ResultCard: React.FC<{ result: SearchResult; index: number }> = memo(({
  result,
  index,
}) => {
  const config = TYPE_CONFIG[result.type];
  const { Icon } = config;
  const colors = result.verticale
    ? getUniversColors(result.verticale.nom)
    : { bg: config.color, text: '#FFFFFF' };

  const catColor = result.verticale ? colors.bg : config.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Link
        to={`${config.path}/${result.slug}`}
        className={s.card}
        style={{ '--cat-color': catColor } as React.CSSProperties}
      >
        {/* Image */}
        <div className={s.cardImgWrap}>
          {result.imageUrl ? (
            <img
              src={result.imageUrl}
              alt={result.titre}
              className={s.cardImg}
              loading="lazy"
            />
          ) : (
            <div className={s.cardImgFallback}>
              <Icon />
            </div>
          )}

          {/* Type badge */}
          <span className={s.cardBadge}>
            <Icon />
            {config.label}
          </span>
        </div>

        {/* Body */}
        <div className={s.cardBody}>
          {(result.verticale?.nom || result.categorie) && (
            <span className={s.cardCategory}>
              <span className={s.cardCategoryDot} />
              {result.verticale?.nom || result.categorie}
            </span>
          )}

          <h3 className={s.cardTitle}>{typo(result.titre)}</h3>

          {result.extrait && (
            <p className={s.cardExcerpt}>{typo(result.extrait)}</p>
          )}

          <span className={s.cardCta}>
            Lire
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
});

/* ------------------------------------------------------------------ */
/*  Skeleton loader                                                    */
/* ------------------------------------------------------------------ */

const SkeletonGrid: React.FC = () => (
  <div className={s.skeleton}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className={s.skelCard}>
        <div className={`${s.skelImg} ${s.skelPulse}`} />
        <div className={s.skelBody}>
          <div className={s.skelLineTiny} />
          <div className={s.skelLine} />
          <div className={s.skelLineShort} />
        </div>
      </div>
    ))}
  </div>
);

/* ================================================================== */
/*  Page component                                                     */
/* ================================================================== */

const RecherchePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [allData, setAllData] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('tous');

  /* — Load all data on mount — */
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [articles, histoires, recos] = await Promise.all([
          sanityFetch<RawArticle[]>(ALL_ARTICLES_QUERY),
          sanityFetch<RawHistoire[]>(ALL_HISTOIRES_QUERY),
          sanityFetch<RawReco[]>(ALL_RECOS_QUERY),
        ]);

        const transformedArticles: SearchResult[] = (articles || []).map(
          (a) => ({
            _id: a._id,
            titre: a.titre,
            slug: a.slug,
            type: a.typeArticle === 'video' ? 'video' : 'article',
            imageUrl: a.imageUrl,
            extrait: a.extrait || a.description,
            verticale: a.verticale,
          }),
        );

        const transformedHistoires: SearchResult[] = (histoires || []).map(
          (h) => ({
            _id: h._id,
            titre: h.titre,
            slug: h.slug,
            type: 'histoire',
            imageUrl: h.imageUrl,
            extrait: h.accroche || h.citation,
            categorie: h.categorie,
          }),
        );

        const transformedRecos: SearchResult[] = (recos || []).map((r) => ({
          _id: r._id,
          titre: r.titre,
          slug: r.slug,
          type: 'recommandation',
          imageUrl: r.imageUrl,
          extrait: r.accroche,
          categorie: r.type,
        }));

        setAllData([
          ...transformedArticles,
          ...transformedHistoires,
          ...transformedRecos,
        ]);
      } catch (error) {
        console.error('Erreur chargement donnees:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  /* — Sync search input with URL — */
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  /* — Submit search — */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  /* — Clear search — */
  const handleClear = () => {
    setSearchInput('');
    setSearchParams({});
  };

  /* — Filter results client-side (accent-tolerant) — */
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerms = normalizeText(query)
      .split(/\s+/)
      .filter(Boolean);

    let results = allData.filter((item) => {
      const searchableText = normalizeText(
        [item.titre, item.extrait, item.verticale?.nom, item.categorie]
          .filter(Boolean)
          .join(' '),
      );
      return searchTerms.every((term) => searchableText.includes(term));
    });

    if (activeFilter !== 'tous') {
      results = results.filter((r) => r.type === activeFilter);
    }

    return results;
  }, [allData, query, activeFilter]);

  /* — Count by type (with normalisation) — */
  const countByType = useMemo(() => {
    if (!query.trim()) return { tous: 0 };

    const searchTerms = normalizeText(query)
      .split(/\s+/)
      .filter(Boolean);

    const matchingResults = allData.filter((item) => {
      const searchableText = normalizeText(
        [item.titre, item.extrait, item.verticale?.nom, item.categorie]
          .filter(Boolean)
          .join(' '),
      );
      return searchTerms.every((term) => searchableText.includes(term));
    });

    const counts: Record<string, number> = { tous: matchingResults.length };
    matchingResults.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [allData, query]);

  const hasSearched = query.trim().length > 0;

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className={s.page}>
      <SEO
        title={query ? `Recherche : ${query}` : 'Recherche'}
        description="Recherchez parmi nos articles, histoires, videos et recommandations."
        type="website"
        noindex
      />
      <SiteHeader />

      {/* ── Header ── */}
      <header className={s.header}>
        <div className={s.headerInner}>
          <p className={s.kicker}>
            <span className={s.kickerDot} />
            Recherche
          </p>
          <h1 className={s.title}>
            Trouvez votre <em>contenu</em>
          </h1>
          <p className={s.deck}>
            {typo(
              'Explorez notre catalogue d’articles, d’histoires inspirantes, de videos et de recommandations.',
            )}
          </p>
        </div>
      </header>

      {/* ── Search bar ── */}
      <div className={s.searchSection}>
        <form onSubmit={handleSubmit} className={s.searchForm}>
          <span className={s.searchIcon}>
            <IconSearch />
          </span>

          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tapez votre recherche..."
            className={s.searchInput}
            autoFocus
          />

          {searchInput && (
            <button
              type="button"
              onClick={handleClear}
              className={s.searchClear}
              aria-label="Effacer la recherche"
            >
              <IconX />
            </button>
          )}

          <button
            type="submit"
            className={s.searchSubmit}
            aria-label="Rechercher"
          >
            <IconArrowRight />
          </button>
        </form>
      </div>

      {/* ── Main content ── */}
      <main className={s.main}>
        {loading ? (
          /* Loading skeleton */
          <SkeletonGrid />
        ) : (
          <>
            {/* ── Filter tabs ── */}
            {hasSearched && countByType.tous > 0 && (
              <div className={s.filters}>
                {(
                  ['tous', 'article', 'video', 'histoire', 'recommandation'] as const
                ).map((type) => {
                  const count = countByType[type] || 0;
                  if (type !== 'tous' && count === 0) return null;

                  const isActive = activeFilter === type;
                  const label =
                    type === 'tous'
                      ? 'Tous'
                      : TYPE_CONFIG[type].label;

                  return (
                    <button
                      key={type}
                      onClick={() => setActiveFilter(type)}
                      className={
                        isActive ? s.filterBtnActive : s.filterBtn
                      }
                    >
                      {label}
                      <span className={s.filterCount}>{count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Results ── */}
            {hasSearched && filteredResults.length === 0 ? (
              /* No results */
              <div className={s.empty}>
                <div className={s.emptyIcon}>
                  <IconSearch />
                </div>
                <h3 className={s.emptyTitle}>Aucun resultat</h3>
                <p className={s.emptyText}>
                  {typo(`Aucun contenu ne correspond a « ${query} ».`)}
                </p>
                <div className={s.emptyLinks}>
                  <Link to="/articles" className={s.emptyLink}>
                    <IconFileText />
                    Articles
                  </Link>
                  <Link to="/histoires" className={s.emptyLink}>
                    <IconHeart />
                    Histoires
                  </Link>
                  <Link to="/videos" className={s.emptyLink}>
                    <IconPlay />
                    Videos
                  </Link>
                </div>
              </div>
            ) : hasSearched ? (
              /* Results list */
              <>
                <p className={s.resultCount}>
                  {filteredResults.length} resultat
                  {filteredResults.length > 1 ? 's' : ''} pour
                  {' « '}
                  {query}
                  {' »'}
                </p>
                <div className={s.grid}>
                  <AnimatePresence mode="popLayout">
                    {filteredResults.slice(0, 50).map((result, index) => (
                      <ResultCard
                        key={result._id}
                        result={result}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Initial state */
              <div className={s.initial}>
                <div className={s.initialIcon}>
                  <IconBookOpen />
                </div>
                <h3 className={s.initialTitle}>
                  {typo('Que cherchez-vous ?')}
                </h3>
                <p className={s.initialText}>
                  {typo(
                    'Explorez notre catalogue d’articles, d’histoires inspirantes, de videos et de recommandations.',
                  )}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
};

export default RecherchePage;
