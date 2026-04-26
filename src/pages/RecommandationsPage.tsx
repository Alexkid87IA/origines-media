// src/pages/RecommandationsPage.tsx
// Page des recommandations — V2 design system

import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { sanityFetch } from "../lib/sanity";
import { EXPLORER_RECOS_QUERY } from "../lib/queries";
import { typo } from "../lib/typography";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import s from "./RecommandationsPage.module.css";

/* ------------------------------------------------------------------ */
/*  Inline SVG icon paths (replaces lucide-react)                      */
/* ------------------------------------------------------------------ */

const ICONS: Record<string, JSX.Element> = {
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  film: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="0" />
      <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
    </svg>
  ),
  headphones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  at: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  mapPin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  shoppingBag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="0" />
      <polyline points="22 4 12 13 2 4" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

const recommendationTypes = {
  livres: {
    color: "#E11D48",
    label: "Livre",
    icon: ICONS.book,
  },
  "films-series": {
    color: "#7C3AED",
    label: "Film & Série",
    icon: ICONS.film,
  },
  musique: {
    color: "#2563EB",
    label: "Musique",
    icon: ICONS.music,
  },
  podcasts: {
    color: "#0D9488",
    label: "Podcast",
    icon: ICONS.headphones,
  },
  youtube: {
    color: "#DC2626",
    label: "YouTube",
    icon: ICONS.youtube,
  },
  "reseaux-sociaux": {
    color: "#0891B2",
    label: "Social",
    icon: ICONS.at,
  },
  activite: {
    color: "#16A34A",
    label: "Activité",
    icon: ICONS.globe,
  },
  destination: {
    color: "#EA580C",
    label: "Destination",
    icon: ICONS.mapPin,
  },
  culture: {
    color: "#9333EA",
    label: "Culture",
    icon: ICONS.palette,
  },
  produit: {
    color: "#CA8A04",
    label: "Produit",
    icon: ICONS.shoppingBag,
  },
} as const;

type RecommendationType = keyof typeof recommendationTypes;

/* ------------------------------------------------------------------ */
/*  Sanity types & mapping                                             */
/* ------------------------------------------------------------------ */

interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  slug: string;
  rating?: number;
  author?: string;
  coupDeCoeur?: boolean;
  imageUrl?: string;
}

interface SanityReco {
  _id: string;
  titre: string;
  type?: string;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  slug?: string;
  imageUrl?: string;
}

const typeMapping: Record<string, RecommendationType> = {
  livres: "livres",
  "films-series": "films-series",
  musique: "musique",
  podcasts: "podcasts",
  youtube: "youtube",
  "reseaux-sociaux": "reseaux-sociaux",
  activite: "activite",
  destination: "destination",
  culture: "culture",
  produit: "produit",
  // Legacy fallbacks
  livre: "livres",
  film: "films-series",
  podcast: "podcasts",
};

const transformSanityReco = (reco: SanityReco): Recommendation => {
  const mappedType = reco.type ? typeMapping[reco.type] : undefined;
  const validType = mappedType || "livres";

  return {
    id: reco._id,
    type: validType,
    title: reco.titre,
    description: reco.accroche || "",
    slug: reco.slug || reco._id,
    rating: reco.note,
    author: reco.auteur,
    coupDeCoeur: reco.coupDeCoeur,
    imageUrl: reco.imageUrl,
  };
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ITEMS_PER_PAGE = 9;
const MAX_PER_TYPE_FIRST_PAGE = 2;

/* ------------------------------------------------------------------ */
/*  Shuffle with diversity: max 2 of each type per "page" of 9         */
/* ------------------------------------------------------------------ */

const shuffleWithDiversity = (recos: Recommendation[]): Recommendation[] => {
  if (recos.length === 0) return [];

  const byType: Record<string, Recommendation[]> = {};
  recos.forEach((reco) => {
    if (!byType[reco.type]) byType[reco.type] = [];
    byType[reco.type].push(reco);
  });

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  Object.keys(byType).forEach((key) => {
    byType[key] = shuffleArray(byType[key]);
  });

  const result: Recommendation[] = [];
  const typeIndices: Record<string, number> = {};
  const typeKeys = shuffleArray(Object.keys(byType));
  typeKeys.forEach((key) => (typeIndices[key] = 0));

  const totalRecos = recos.length;
  const numPages = Math.ceil(totalRecos / ITEMS_PER_PAGE);

  for (let page = 0; page < numPages; page++) {
    const pageTypeCount: Record<string, number> = {};
    let addedThisPage = 0;
    let attempts = 0;
    const maxAttempts = typeKeys.length * ITEMS_PER_PAGE;

    while (
      addedThisPage < ITEMS_PER_PAGE &&
      result.length < totalRecos &&
      attempts < maxAttempts
    ) {
      for (const typeKey of typeKeys) {
        if (addedThisPage >= ITEMS_PER_PAGE || result.length >= totalRecos)
          break;

        const typeCount = pageTypeCount[typeKey] || 0;
        if (typeCount >= MAX_PER_TYPE_FIRST_PAGE) continue;

        if (typeIndices[typeKey] < byType[typeKey].length) {
          result.push(byType[typeKey][typeIndices[typeKey]]);
          typeIndices[typeKey]++;
          pageTypeCount[typeKey] = typeCount + 1;
          addedThisPage++;
        }
      }
      attempts++;
    }

    // Fill remaining slots if page not full
    if (addedThisPage < ITEMS_PER_PAGE && result.length < totalRecos) {
      for (const typeKey of typeKeys) {
        while (
          typeIndices[typeKey] < byType[typeKey].length &&
          result.length < totalRecos &&
          addedThisPage < ITEMS_PER_PAGE
        ) {
          result.push(byType[typeKey][typeIndices[typeKey]]);
          typeIndices[typeKey]++;
          addedThisPage++;
        }
      }
    }
  }

  return result;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RecommandationsPage() {
  const [allRecommendations, setAllRecommendations] = useState<
    Recommendation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    RecommendationType | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /* ── Set V2 body style ── */
  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  /* ── Fetch data ── */
  useEffect(() => {
    const fetchRecos = async () => {
      try {
        setLoading(true);
        const sanityRecos = (await sanityFetch(
          EXPLORER_RECOS_QUERY
        )) as SanityReco[];
        if (sanityRecos && sanityRecos.length > 0) {
          setAllRecommendations(sanityRecos.map(transformSanityReco));
        }
        setError(null);
      } catch (err) {
        console.error("Erreur chargement recommandations:", err);
        setError("Impossible de charger les recommandations");
      } finally {
        setLoading(false);
      }
    };
    fetchRecos();
  }, []);

  /* ── Group by type ── */
  const recosByType = useMemo(() => {
    const grouped: Record<RecommendationType, Recommendation[]> = {
      livres: [],
      "films-series": [],
      musique: [],
      podcasts: [],
      youtube: [],
      "reseaux-sociaux": [],
      activite: [],
      destination: [],
      culture: [],
      produit: [],
    };
    allRecommendations.forEach((reco) => {
      if (grouped[reco.type]) grouped[reco.type].push(reco);
    });
    return grouped;
  }, [allRecommendations]);

  /* ── Available types ── */
  const availableTypes = useMemo(() => {
    return Object.keys(recommendationTypes) as RecommendationType[];
  }, []);

  /* ── Diversified shuffle ── */
  const shuffledRecos = useMemo(() => {
    return shuffleWithDiversity(allRecommendations);
  }, [allRecommendations]);

  /* ── Filtered ── */
  const filteredRecos = useMemo(() => {
    if (activeFilter === "all") return shuffledRecos;
    return recosByType[activeFilter] || [];
  }, [activeFilter, shuffledRecos, recosByType]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(filteredRecos.length / ITEMS_PER_PAGE);
  const paginatedRecos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecos, currentPage]);

  /* ── Reset page on filter change ── */
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFilterClick = useCallback(
    (type: RecommendationType | "all") => {
      setActiveFilter(type);
      setShowMobileFilters(false);
    },
    []
  );

  /* ── Stats ── */
  const totalRecos = allRecommendations.length;
  const totalCategories = availableTypes.length;

  /* ── Render ── */
  return (
    <>
      <SEO
        title="Recommandations"
        description="Nos coups de coeur : livres, films, podcasts et produits s&eacute;lectionn&eacute;s par l'&eacute;quipe Origines."
        url="/recommandations"
      />
      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          <section className={s.page}>
            {/* ── Chapter mark ── */}
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Biblioth&egrave;que</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Recommandations</span>
            </div>

            {/* ── Section header ── */}
            <header className={s.sectionHead}>
              <div className={s.heroLayout}>
                <div className={s.heroLeft}>
                  <div className={s.sectionLabel}>
                    <span className={s.sectionKicker}>
                      <span
                        className={s.sectionKickerDot}
                        aria-hidden="true"
                      />
                      Recommandations &middot; nos s&eacute;lections
                    </span>
                    <h1 className={s.sectionTitle}>
                      Ce qu&rsquo;on a aim&eacute;,{" "}
                      <em>ce qu&rsquo;on vous conseille.</em>
                    </h1>
                    <p className={s.sectionDeck}>
                      Livres qui font r&eacute;fl&eacute;chir, films qui font
                      vibrer, podcasts qui ouvrent l&rsquo;esprit&hellip; Voici
                      tout ce que l&rsquo;&eacute;quipe Origines a ador&eacute;
                      et veut partager avec vous.
                    </p>
                  </div>

                  {/* Stats */}
                  <div className={s.stats}>
                    <div className={s.stat}>
                      <span className={s.statValue}>{totalRecos}</span>
                      <span className={s.statLabel}>recommandations</span>
                    </div>
                    <div className={s.statDivider} aria-hidden="true" />
                    <div className={s.stat}>
                      <span className={s.statValue}>{totalCategories}</span>
                      <span className={s.statLabel}>cat&eacute;gories</span>
                    </div>
                  </div>
                </div>

                {/* CTA cards */}
                <div className={s.heroRight}>
                  <Link to="/contact" className={s.ctaCard}>
                    <div className={s.ctaCardIcon}>{ICONS.send}</div>
                    <div className={s.ctaCardText}>
                      <p className={s.ctaCardTitle}>
                        Une p&eacute;pite &agrave; partager ?
                      </p>
                      <p className={s.ctaCardSub}>Proposer une reco</p>
                    </div>
                    <svg
                      className={s.ctaCardArrow}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="16"
                      height="16"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link to="/newsletter" className={s.ctaCard}>
                    <div className={s.ctaCardIcon}>{ICONS.mail}</div>
                    <div className={s.ctaCardText}>
                      <p className={s.ctaCardTitle}>
                        Recevoir nos p&eacute;pites
                      </p>
                      <p className={s.ctaCardSub}>Newsletter mensuelle</p>
                    </div>
                    <svg
                      className={s.ctaCardArrow}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="16"
                      height="16"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            </header>

            {/* ── Filter bar ── */}
            <div className={s.filterBar}>
              <div className={s.filterBarInner}>
                {/* Desktop filters */}
                <div className={s.desktopFilters}>
                  <button
                    className={
                      activeFilter === "all"
                        ? s.filterChipActive
                        : s.filterChip
                    }
                    onClick={() => handleFilterClick("all")}
                  >
                    Tout
                  </button>
                  {availableTypes.map((type) => {
                    const config = recommendationTypes[type];
                    const count = recosByType[type]?.length || 0;
                    const isEmpty = count === 0;
                    const isActive = activeFilter === type;

                    if (isEmpty) {
                      return (
                        <button
                          key={type}
                          className={s.filterChipDisabled}
                          disabled
                        >
                          <span
                            className={s.filterChipDot}
                            style={
                              {
                                "--chip-color": config.color,
                              } as React.CSSProperties
                            }
                          />
                          {config.label}
                        </button>
                      );
                    }

                    return (
                      <button
                        key={type}
                        className={
                          isActive ? s.filterChipActive : s.filterChip
                        }
                        style={
                          {
                            "--chip-color": config.color,
                          } as React.CSSProperties
                        }
                        onClick={() => handleFilterClick(type)}
                      >
                        <span className={s.filterChipDot} />
                        {config.label}
                        {count > 0 && (
                          <span className={s.filterChipCount}>{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile filter toggle */}
                <button
                  type="button"
                  className={s.mobileFilterBtn}
                  onClick={() => setShowMobileFilters((v) => !v)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    width="14"
                    height="14"
                  >
                    <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" />
                  </svg>
                  <span className={s.mobileFilterBtnLabel}>
                    Filtrer par cat&eacute;gorie
                  </span>
                  {activeFilter !== "all" && (
                    <span className={s.mobileActiveTag}>
                      {recommendationTypes[activeFilter].label}
                    </span>
                  )}
                  <svg
                    className={
                      showMobileFilters
                        ? s.mobileFilterChevronOpen
                        : s.mobileFilterChevron
                    }
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    width="14"
                    height="14"
                  >
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </button>

                {/* Mobile filter panel */}
                {showMobileFilters && (
                  <div className={s.mobileFilterPanel}>
                    <button
                      className={
                        activeFilter === "all"
                          ? s.mobileFilterAllActive
                          : s.mobileFilterAll
                      }
                      onClick={() => handleFilterClick("all")}
                    >
                      <span>Tout voir</span>
                      <span>{allRecommendations.length}</span>
                    </button>

                    <div className={s.mobileFilterGrid}>
                      {availableTypes.map((type) => {
                        const config = recommendationTypes[type];
                        const count = recosByType[type]?.length || 0;
                        const isEmpty = count === 0;
                        const isActive = activeFilter === type;

                        if (isEmpty) {
                          return (
                            <button
                              key={type}
                              className={s.mobileFilterItemDisabled}
                              disabled
                            >
                              <span
                                className={s.mobileFilterItemDot}
                                style={
                                  {
                                    "--chip-color": config.color,
                                  } as React.CSSProperties
                                }
                              />
                              <span className={s.mobileFilterItemLabel}>
                                {config.label}
                              </span>
                            </button>
                          );
                        }

                        return (
                          <button
                            key={type}
                            className={
                              isActive
                                ? s.mobileFilterItemActive
                                : s.mobileFilterItem
                            }
                            style={
                              {
                                "--chip-color": config.color,
                              } as React.CSSProperties
                            }
                            onClick={() => handleFilterClick(type)}
                          >
                            <span className={s.mobileFilterItemDot} />
                            <span className={s.mobileFilterItemLabel}>
                              {config.label}
                            </span>
                            {count > 0 && (
                              <span className={s.mobileFilterItemCount}>
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Content ── */}
            <div className={s.content}>
              {/* Loading */}
              {loading && (
                <div className={s.loading}>
                  <div className={s.spinner} />
                  <span className={s.loadingText}>Chargement&hellip;</span>
                </div>
              )}

              {/* Error */}
              {error && !loading && (
                <div className={s.error}>
                  <p className={s.emptyText}>{error}</p>
                </div>
              )}

              {/* Results */}
              {!loading && !error && allRecommendations.length > 0 && (
                <>
                  {/* Result bar */}
                  <div className={s.resultBar}>
                    <span className={`${s.resultCount} mono`}>
                      {filteredRecos.length} recommandation
                      {filteredRecos.length > 1 ? "s" : ""}
                      {activeFilter !== "all" &&
                        ` — ${recommendationTypes[activeFilter].label}`}
                    </span>
                    {totalPages > 1 && (
                      <span className={s.pageInfo}>
                        Page {currentPage} / {totalPages}
                      </span>
                    )}
                  </div>

                  {/* Grid */}
                  <div className={s.grid}>
                    {paginatedRecos.map((reco) => {
                      const config = recommendationTypes[reco.type];
                      return (
                        <article
                          key={reco.id}
                          className={s.card}
                          style={
                            {
                              "--type-color": config.color,
                            } as React.CSSProperties
                          }
                        >
                          <Link
                            to={`/recommandation/${reco.slug}`}
                            className={s.cardLink}
                          >
                            {/* Cover image */}
                            {reco.imageUrl && (
                              <div className={s.cardImgWrap}>
                                <img
                                  src={reco.imageUrl}
                                  alt=""
                                  className={s.cardImg}
                                  loading="lazy"
                                />
                              </div>
                            )}

                            <div className={s.cardBody}>
                              {/* Header */}
                              <div className={s.cardHeader}>
                                <span className={s.cardType}>
                                  <span className={s.cardTypeDot} />
                                  <span className={s.cardTypeIcon}>
                                    {config.icon}
                                  </span>
                                  {config.label}
                                </span>
                                {reco.rating && (
                                  <span className={s.cardRating}>
                                    <svg
                                      className={s.cardRatingStar}
                                      viewBox="0 0 24 24"
                                      fill="#CA8A04"
                                      stroke="none"
                                      width="12"
                                      height="12"
                                    >
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    {reco.rating}/5
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h3 className={s.cardTitle}>
                                {typo(reco.title)}
                              </h3>

                              {/* Description */}
                              {reco.description && (
                                <p className={s.cardDesc}>
                                  {typo(reco.description)}
                                </p>
                              )}

                              {/* Footer */}
                              <div className={s.cardFoot}>
                                {reco.author ? (
                                  <span className={s.cardAuthor}>
                                    par {reco.author}
                                  </span>
                                ) : (
                                  <span />
                                )}
                                <SaveBookmark inline type="recommandation" slug={reco.slug} title={reco.title} />
                                <span className={s.cardCta}>
                                  Voir &rarr;
                                </span>
                              </div>
                            </div>
                          </Link>

                          {/* Coup de coeur badge */}
                          {reco.coupDeCoeur && (
                            <div className={s.coupDeCoeur} aria-label="Coup de coeur">
                              {ICONS.heart}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav
                      className={s.pagination}
                      aria-label="Pagination"
                    >
                      <button
                        className={s.pageBtn}
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        &larr; Pr&eacute;c&eacute;dent
                      </button>

                      <div className={s.pageNums}>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 &&
                              page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                className={`${s.pageNum} ${
                                  page === currentPage
                                    ? s.pageNumActive
                                    : ""
                                }`}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span
                                key={page}
                                className={s.pageEllipsis}
                              >
                                &hellip;
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        className={s.pageBtn}
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Suivant &rarr;
                      </button>
                    </nav>
                  )}
                </>
              )}

              {/* Empty state */}
              {!loading && !error && allRecommendations.length === 0 && (
                <div className={s.empty}>
                  <p className={s.emptyText}>
                    Aucune recommandation pour le moment.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
