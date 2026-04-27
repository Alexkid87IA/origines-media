// src/pages/BibliothequePage.tsx
// Page Explorer V2 — Hub central de tous les contenus

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useSearchParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { sanityFetch } from "../lib/sanity";
import {
  EXPLORER_ARTICLES_QUERY,
  EXPLORER_VIDEOS_QUERY,
  EXPLORER_RECOS_QUERY,
  EXPLORER_HISTOIRES_QUERY,
  VERTICALES_QUERY,
} from "../lib/queries";
import type {
  ExplorerArticle,
  ExplorerVideo,
  ExplorerReco,
  ExplorerHistoire,
  ExplorerVerticale,
} from "../types/sanity";
import Breadcrumb from '@/components/ui/Breadcrumb';
import s from "./BibliothequePage.module.css";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Verticale {
  _id: string;
  nom: string;
  slug: { current: string };
  couleurDominante: string;
}

interface ContentItem {
  _id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
  contentType: "article" | "video" | "reco" | "histoire";
  typeArticle?: string;
  tempsLecture?: number;
  duree?: number;
  vues?: number;
  videoUrl?: string;
  type?: string;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  categorie?: string;
  verticale?: {
    _id: string;
    nom: string;
    couleurDominante: string;
    slug: string;
  };
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

interface ContentTypeConfig {
  id: string;
  label: string;
  color: string;
}

const CONTENT_TYPES: ContentTypeConfig[] = [
  { id: "all", label: "Tout", color: "#6B7280" },
  { id: "article", label: "Articles", color: "#10B981" },
  { id: "video", label: "Vidéos", color: "#06B6D4" },
  { id: "reco", label: "Recos", color: "#EC4899" },
  { id: "histoire", label: "Histoires", color: "#F59E0B" },
];

const SORT_OPTIONS = [
  { id: "recent", label: "Plus récents" },
  { id: "popular", label: "Populaires" },
  { id: "alpha", label: "A → Z" },
];

const ITEMS_PER_PAGE = 9;
const MAX_HISTOIRES_PER_PAGE = 2;

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function IconGrid({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function IconFileText({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconPlay({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function IconHeart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const TYPE_ICONS: Record<string, (props: { className?: string }) => JSX.Element> = {
  all: IconGrid,
  article: IconFileText,
  video: IconPlay,
  reco: IconHeart,
  histoire: IconUser,
};

/* ------------------------------------------------------------------ */
/*  Helper functions                                                   */
/* ------------------------------------------------------------------ */

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function distributeByVerticale(items: ContentItem[]): ContentItem[] {
  if (items.length <= 1) return items;
  const result: ContentItem[] = [];
  const remaining = [...items];
  while (remaining.length > 0) {
    const lastSlug =
      result.length > 0 ? result[result.length - 1].verticale?.slug : null;
    let foundIndex = remaining.findIndex(
      (item) => item.verticale?.slug !== lastSlug
    );
    if (foundIndex === -1) foundIndex = 0;
    result.push(remaining[foundIndex]);
    remaining.splice(foundIndex, 1);
  }
  return result;
}

function limitHistoiresPerPage(
  items: ContentItem[],
  itemsPerPage: number,
  maxHistoires: number
): ContentItem[] {
  const result: ContentItem[] = [];
  let pageHistoireCount = 0;
  let currentPageIndex = 0;
  for (const item of items) {
    const pageIndex = Math.floor(result.length / itemsPerPage);
    if (pageIndex > currentPageIndex) {
      currentPageIndex = pageIndex;
      pageHistoireCount = 0;
    }
    if (item.contentType === "histoire") {
      if (pageHistoireCount >= maxHistoires) continue;
      pageHistoireCount++;
    }
    result.push(item);
  }
  const addedIds = new Set(result.map((r) => r._id));
  for (const item of items) {
    if (!addedIds.has(item._id)) result.push(item);
  }
  return result;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}` : `${h}h`;
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getContentLink(item: ContentItem): string {
  switch (item.contentType) {
    case "article":
      return `/article/${item.slug}`;
    case "video":
      return `/video/${item.slug}`;
    case "reco":
      return `/recommandations/${item.slug}`;
    case "histoire":
      return `/histoire/${item.slug}`;
    default:
      return `/article/${item.slug}`;
  }
}

function getTypeLabel(item: ContentItem): string {
  switch (item.contentType) {
    case "article":
      return "Article";
    case "video":
      return "Vidéo";
    case "reco":
      return item.type || "Reco";
    case "histoire":
      return "Histoire";
    default:
      return "Contenu";
  }
}

function getSubInfo(item: ContentItem): string {
  if (item.contentType === "video" && item.duree) return formatDuration(item.duree);
  if (item.contentType === "article" && item.tempsLecture)
    return `${item.tempsLecture} min`;
  if (item.contentType === "histoire") return item.categorie || "";
  if (item.contentType === "reco" && item.auteur) return item.auteur;
  return "";
}

/* ------------------------------------------------------------------ */
/*  Content Card                                                       */
/* ------------------------------------------------------------------ */

const ContentCard = memo(function ContentCard({ item }: { item: ContentItem }) {
  const color =
    item.verticale?.couleurDominante ||
    CONTENT_TYPES.find((t) => t.id === item.contentType)?.color ||
    "#6B7280";

  const hasValidImage =
    item.imageUrl &&
    !item.imageUrl.includes("placeholder") &&
    item.imageUrl.trim() !== "";

  const subInfo = getSubInfo(item);
  const ctaLabel =
    item.contentType === "video"
      ? "Regarder"
      : item.contentType === "reco"
      ? "Découvrir"
      : item.contentType === "histoire"
      ? "Lire"
      : "Lire";

  return (
    <article className={s.card} style={{ "--cat-color": color } as React.CSSProperties}>
      <a href={getContentLink(item)} className={s.cardLink}>
        {/* Image or no-image zone */}
        {hasValidImage ? (
          <div className={s.cardImgWrap}>
            <img
              src={item.imageUrl}
              alt={item.titre}
              className={s.cardImg}
              loading="lazy"
              decoding="async"
            />
            {item.contentType === "video" && (
              <div className={s.playOverlay}>
                <div className={s.playBtn}>
                  <IconPlay className={s.playIcon} />
                </div>
              </div>
            )}
            {item.coupDeCoeur && (
              <div className={s.heartBadge}>
                <IconHeart />
              </div>
            )}
          </div>
        ) : (
          <div className={s.cardNoImgWrap}>
            {(() => {
              const Icon = TYPE_ICONS[item.contentType] || IconFileText;
              return <Icon className={s.cardNoImgIcon} />;
            })()}
            <p className={s.cardNoImgTitle}>{item.titre}</p>
            {item.coupDeCoeur && (
              <div className={s.heartBadge}>
                <IconHeart />
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className={s.cardBody}>
          {/* Meta line */}
          <div className={s.cardMeta}>
            <span className={s.cardDot} aria-hidden="true" />
            <span className={s.cardType}>{getTypeLabel(item)}</span>
            {item.verticale?.nom && (
              <>
                <span className={s.cardSep}>&middot;</span>
                <span className={s.cardCategory}>{item.verticale.nom}</span>
              </>
            )}
            {subInfo && (
              <>
                <span className={s.cardSep}>&middot;</span>
                <span className={s.cardTime}>{subInfo}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className={s.cardTitle}>{item.titre}</h3>

          {/* Excerpt */}
          {(item.description || item.accroche) && (
            <p className={s.cardExcerpt}>{item.description || item.accroche}</p>
          )}

          {/* Footer */}
          <div className={s.cardFoot}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {item.datePublication && (
                <time className={s.cardDate} dateTime={item.datePublication}>
                  {formatDate(item.datePublication)}
                </time>
              )}
              {item.note && (
                <span className={s.cardNote}>
                  <IconStar className={s.cardNoteStar} />
                  {item.note}/5
                </span>
              )}
            </div>
            <span className={s.cardCta}>{ctaLabel} &rarr;</span>
          </div>
        </div>
      </a>
    </article>
  );
});

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function BibliothequePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Data states
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [recos, setRecos] = useState<ContentItem[]>([]);
  const [histoires, setHistoires] = useState<ContentItem[]>([]);
  const [verticales, setVerticales] = useState<Verticale[]>([]);

  // Params from URL
  const searchQuery = searchParams.get("q") || "";
  const activeType = searchParams.get("type") || "all";
  const activeVerticale = searchParams.get("categorie") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [sortBy, setSortBy] = useState(searchParams.get("tri") || "recent");
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Set page background
  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          articlesData,
          videosData,
          recosData,
          histoiresData,
          verticalesData,
        ] = await Promise.all([
          sanityFetch<ExplorerArticle[]>(EXPLORER_ARTICLES_QUERY),
          sanityFetch<ExplorerVideo[]>(EXPLORER_VIDEOS_QUERY),
          sanityFetch<ExplorerReco[]>(EXPLORER_RECOS_QUERY),
          sanityFetch<ExplorerHistoire[]>(EXPLORER_HISTOIRES_QUERY),
          sanityFetch<ExplorerVerticale[]>(VERTICALES_QUERY),
        ]);
        setArticles(
          (articlesData || []).map((a) => ({
            ...a,
            contentType: "article" as const,
          }))
        );
        setVideos(
          (videosData || []).map((v) => ({
            ...v,
            contentType: "video" as const,
          }))
        );
        setRecos(
          (recosData || []).map((r) => ({
            ...r,
            contentType: "reco" as const,
          }))
        );
        setHistoires(
          (histoiresData || []).map((h) => ({
            ...h,
            contentType: "histoire" as const,
          }))
        );
        setVerticales(verticalesData || []);
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Stats
  const stats = useMemo(
    () => ({
      total:
        articles.length + videos.length + recos.length + histoires.length,
      articles: articles.length,
      videos: videos.length,
      recos: recos.length,
      histoires: histoires.length,
    }),
    [articles, videos, recos, histoires]
  );

  // Verticale counts (for sidebar)
  const verticaleCounts = useMemo(() => {
    const allItems = [...articles, ...videos, ...histoires];
    const counts: Record<string, number> = {};
    verticales.forEach((v) => {
      counts[v.slug.current] = allItems.filter(
        (item) => item.verticale?.slug === v.slug.current
      ).length;
    });
    return counts;
  }, [articles, videos, histoires, verticales]);

  // Combine and filter content
  const allContent = useMemo(() => {
    let content: ContentItem[] = [];
    if (activeType === "all") {
      content = [...articles, ...videos, ...recos, ...histoires];
    } else if (activeType === "article") {
      content = [...articles];
    } else if (activeType === "video") {
      content = [...videos];
    } else if (activeType === "reco") {
      content = [...recos];
    } else if (activeType === "histoire") {
      content = [...histoires];
    }

    // Filter by verticale (only for types that have it)
    if (activeVerticale && activeType !== "reco") {
      content = content.filter(
        (item) => item.verticale?.slug === activeVerticale
      );
    }

    // Filter by search
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      content = content.filter(
        (item) =>
          item.titre?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.accroche?.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === "recent") {
      content.sort(
        (a, b) =>
          new Date(b.datePublication || "").getTime() -
          new Date(a.datePublication || "").getTime()
      );
    } else if (sortBy === "alpha") {
      content.sort((a, b) =>
        (a.titre || "").localeCompare(b.titre || "", "fr")
      );
    } else if (sortBy === "popular") {
      content.sort((a, b) => (b.vues || 0) - (a.vues || 0));
    }

    // Smart shuffle for "Tout" with no filters
    if (
      activeType === "all" &&
      !searchQuery &&
      !activeVerticale &&
      sortBy === "recent"
    ) {
      content = shuffleArray(content);
      content = distributeByVerticale(content);
      content = limitHistoiresPerPage(
        content,
        ITEMS_PER_PAGE,
        MAX_HISTOIRES_PER_PAGE
      );
    }

    return content;
  }, [
    articles,
    videos,
    recos,
    histoires,
    activeType,
    activeVerticale,
    searchQuery,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(allContent.length / ITEMS_PER_PAGE);
  const paginatedContent = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allContent.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allContent, currentPage]);

  /* ── Handlers ── */

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const p = new URLSearchParams(searchParams);
      if (searchInput) p.set("q", searchInput);
      else p.delete("q");
      p.set("page", "1");
      setSearchParams(p);
    },
    [searchInput, searchParams, setSearchParams]
  );

  const handleTypeChange = useCallback(
    (type: string) => {
      const p = new URLSearchParams(searchParams);
      if (type === "all") {
        p.delete("type");
      } else {
        p.set("type", type);
      }
      p.delete("categorie");
      p.delete("page");
      setSearchParams(p);
    },
    [searchParams, setSearchParams]
  );

  const handleVerticaleChange = useCallback(
    (slug: string) => {
      const p = new URLSearchParams(searchParams);
      if (activeVerticale === slug) {
        p.delete("categorie");
      } else {
        p.set("categorie", slug);
      }
      p.delete("page");
      setSearchParams(p);
    },
    [activeVerticale, searchParams, setSearchParams]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setSortBy(val);
      const p = new URLSearchParams(searchParams);
      if (val === "recent") p.delete("tri");
      else p.set("tri", val);
      p.delete("page");
      setSearchParams(p);
    },
    [searchParams, setSearchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const p = new URLSearchParams(searchParams);
      if (page === 1) p.delete("page");
      else p.set("page", page.toString());
      setSearchParams(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSortBy("recent");
    setSearchInput("");
    setSearchParams({});
  }, [setSearchParams]);

  const getVerticaleColor = useCallback(
    (slug: string) => {
      const v = verticales.find((v) => v.slug.current === slug);
      return v?.couleurDominante || "#6B6B6B";
    },
    [verticales]
  );

  const hasActiveFilters =
    searchQuery || activeType !== "all" || activeVerticale;

  /* ── Render ── */

  return (
    <>
      <SEO
        title="Bibliothèque — Explorer nos contenus"
        description="Explorez tous nos contenus : articles, vidéos, recommandations et histoires inspirantes."
        url="/bibliotheque"
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Bibliothèque', url: '/bibliotheque' },
        ]}
      />
      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          <Breadcrumb items={[
            { name: 'Accueil', url: '/' },
            { name: 'Bibliothèque', url: '/bibliotheque' },
          ]} />
          <section className={s.page}>
            {/* Chapter mark */}
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Biblioth&egrave;que</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Explorer</span>
            </div>

            {/* Section header */}
            <header className={s.sectionHead}>
              <span className={s.sectionKicker}>
                <span className={s.sectionKickerDot} aria-hidden="true" />
                Explorer &middot; {stats.total} contenus
              </span>
              <h1 className={s.sectionTitle}>
                Tous nos <em>contenus.</em>
              </h1>
              <p className={s.sectionDeck}>
                Articles, vid&eacute;os, recommandations et histoires
                inspirantes. Filtrez par type, cat&eacute;gorie, triez comme
                vous voulez.
              </p>

              {/* Stats */}
              <div className={s.statsBar}>
                {CONTENT_TYPES.filter((t) => t.id !== "all").map((t) => {
                  const count =
                    t.id === "article"
                      ? stats.articles
                      : t.id === "video"
                      ? stats.videos
                      : t.id === "reco"
                      ? stats.recos
                      : stats.histoires;
                  return (
                    <span key={t.id} className={s.statItem}>
                      <span
                        className={s.statDot}
                        style={
                          { "--stat-color": t.color } as React.CSSProperties
                        }
                      />
                      {count} {t.label.toLowerCase()}
                    </span>
                  );
                })}
              </div>
            </header>

            {/* Content type tabs */}
            <div className={s.typeTabs}>
              {CONTENT_TYPES.map((t) => {
                const isActive = activeType === t.id;
                const Icon = TYPE_ICONS[t.id] || IconGrid;
                const count =
                  t.id === "all"
                    ? stats.total
                    : t.id === "article"
                    ? stats.articles
                    : t.id === "video"
                    ? stats.videos
                    : t.id === "reco"
                    ? stats.recos
                    : stats.histoires;

                return (
                  <button
                    key={t.id}
                    className={isActive ? s.typeTabActive : s.typeTab}
                    onClick={() => handleTypeChange(t.id)}
                  >
                    <Icon className={s.typeTabIcon} />
                    <span>{t.label}</span>
                    <span className={s.typeTabCount}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Toolbar: search + sort */}
            <div className={s.toolbar}>
              <form onSubmit={handleSearch} className={s.searchWrap}>
                <svg
                  className={s.searchIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher un contenu…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className={s.searchInput}
                />
                {searchInput && (
                  <button
                    type="button"
                    className={s.searchClear}
                    onClick={() => {
                      setSearchInput("");
                      const p = new URLSearchParams(searchParams);
                      p.delete("q");
                      p.set("page", "1");
                      setSearchParams(p);
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="12"
                      height="12"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </form>

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
                >
                  <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" />
                </svg>
                Filtres
              </button>

              <div className={s.sortWrap}>
                <select
                  className={s.sortSelect}
                  value={sortBy}
                  onChange={handleSortChange}
                  aria-label="Trier par"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <svg
                  className={s.sortChevron}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className={s.activeFilters}>
                <span className={`${s.activeLabel} mono`}>Filtres :</span>
                {activeType !== "all" && (
                  <button
                    className={s.activeChip}
                    style={
                      {
                        "--chip-color":
                          CONTENT_TYPES.find((t) => t.id === activeType)
                            ?.color || "#6B7280",
                      } as React.CSSProperties
                    }
                    onClick={() => handleTypeChange("all")}
                  >
                    <span className={s.activeChipDot} />
                    {CONTENT_TYPES.find((t) => t.id === activeType)?.label}
                    <span className={s.activeChipX}>&times;</span>
                  </button>
                )}
                {activeVerticale && (
                  <button
                    className={s.activeChip}
                    style={
                      {
                        "--chip-color": getVerticaleColor(activeVerticale),
                      } as React.CSSProperties
                    }
                    onClick={() => handleVerticaleChange(activeVerticale)}
                  >
                    <span className={s.activeChipDot} />
                    {verticales.find(
                      (v) => v.slug.current === activeVerticale
                    )?.nom || activeVerticale}
                    <span className={s.activeChipX}>&times;</span>
                  </button>
                )}
                {searchQuery && (
                  <button className={s.activeChip} onClick={clearFilters}>
                    &laquo;&nbsp;{searchQuery}&nbsp;&raquo;
                    <span className={s.activeChipX}>&times;</span>
                  </button>
                )}
                <button className={s.clearAll} onClick={clearFilters}>
                  Tout effacer
                </button>
              </div>
            )}

            {/* Layout: sidebar + grid */}
            <div className={s.layout}>
              {/* Sidebar — desktop only */}
              {activeType !== "reco" && (
                <aside className={s.sidebar}>
                  <div className={s.filterGroup}>
                    <h3 className={`${s.filterGroupTitle} mono`}>
                      Cat&eacute;gorie
                    </h3>
                    <div className={s.filterList}>
                      <button
                        className={
                          !activeVerticale ? s.filterBtnActive : s.filterBtn
                        }
                        onClick={() => {
                          const p = new URLSearchParams(searchParams);
                          p.delete("categorie");
                          p.delete("page");
                          setSearchParams(p);
                        }}
                      >
                        <span className={s.filterDot} />
                        Toutes
                        <span className={s.filterCount}>{allContent.length}</span>
                      </button>
                      {verticales
                        .filter((v) => verticaleCounts[v.slug.current] > 0)
                        .map((v) => (
                          <button
                            key={v._id}
                            className={
                              activeVerticale === v.slug.current
                                ? s.filterBtnActive
                                : s.filterBtn
                            }
                            style={
                              {
                                "--chip-color": v.couleurDominante,
                              } as React.CSSProperties
                            }
                            onClick={() =>
                              handleVerticaleChange(v.slug.current)
                            }
                          >
                            <span className={s.filterDot} />
                            {v.nom}
                            <span className={s.filterCount}>
                              {verticaleCounts[v.slug.current]}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                </aside>
              )}

              {/* Content */}
              <div className={s.content}>
                <div className={s.resultBar}>
                  <span className={`${s.resultCount} mono`}>
                    {allContent.length > ITEMS_PER_PAGE ? (
                      <>
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}&ndash;
                        {Math.min(
                          currentPage * ITEMS_PER_PAGE,
                          allContent.length
                        )}{" "}
                        sur {allContent.length} r&eacute;sultat
                        {allContent.length > 1 ? "s" : ""}
                      </>
                    ) : (
                      <>
                        {allContent.length} r&eacute;sultat
                        {allContent.length > 1 ? "s" : ""}
                      </>
                    )}
                    {searchQuery && ` pour « ${searchQuery} »`}
                    {activeVerticale &&
                      ` dans ${
                        verticales.find(
                          (v) => v.slug.current === activeVerticale
                        )?.nom
                      }`}
                  </span>
                </div>

                {loading ? (
                  <div className={s.skeleton}>
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className={s.skelCard}>
                        <div className={s.skelImg} />
                        <div className={s.skelBody}>
                          <div className={s.skelLineTiny} />
                          <div className={s.skelLine} />
                          <div className={s.skelLineShort} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : paginatedContent.length > 0 ? (
                  <>
                    <div className={s.grid}>
                      {paginatedContent.map((item) => (
                        <ContentCard
                          key={`${item.contentType}-${item._id}`}
                          item={item}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <nav className={s.pagination} aria-label="Pagination">
                        <button
                          className={s.pageBtn}
                          disabled={currentPage === 1}
                          onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
                          }
                        >
                          &larr; Pr&eacute;c.
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
                          onClick={() =>
                            handlePageChange(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                        >
                          Suiv. &rarr;
                        </button>
                      </nav>
                    )}

                    {totalPages > 1 && (
                      <p className={s.pageInfo}>
                        Page {currentPage} sur {totalPages}
                      </p>
                    )}
                  </>
                ) : (
                  <div className={s.empty}>
                    <svg
                      className={s.emptyIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      width="48"
                      height="48"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <h3 className={s.emptyTitle}>
                      Aucun r&eacute;sultat
                    </h3>
                    <p className={s.emptyText}>
                      {searchQuery
                        ? `Aucun résultat pour « ${searchQuery} »`
                        : "Essayez de modifier vos filtres ou votre recherche."}
                    </p>
                    <button className={s.emptyCta} onClick={clearFilters}>
                      R&eacute;initialiser &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div
          className={`${s.mobileFilterDrawer} ${s.mobileFilterDrawerOpen}`}
        >
          <div
            className={s.mobileFilterOverlay}
            onClick={() => setShowMobileFilters(false)}
          />
          <div className={s.mobileFilterPanel}>
            <div className={s.mobileFilterHeader}>
              <h3 className={s.mobileFilterTitle}>Filtres</h3>
              <button
                className={s.mobileFilterClose}
                onClick={() => setShowMobileFilters(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sort */}
            <div className={s.filterGroup}>
              <h3 className={`${s.filterGroupTitle} mono`}>Trier par</h3>
              <div className={s.filterList}>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    className={
                      sortBy === opt.id ? s.filterBtnActive : s.filterBtn
                    }
                    onClick={() => {
                      setSortBy(opt.id);
                      const p = new URLSearchParams(searchParams);
                      if (opt.id === "recent") p.delete("tri");
                      else p.set("tri", opt.id);
                      p.delete("page");
                      setSearchParams(p);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            {activeType !== "reco" && (
              <div className={s.filterGroup}>
                <h3 className={`${s.filterGroupTitle} mono`}>
                  Cat&eacute;gorie
                </h3>
                <div className={s.filterList}>
                  <button
                    className={
                      !activeVerticale ? s.filterBtnActive : s.filterBtn
                    }
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete("categorie");
                      p.delete("page");
                      setSearchParams(p);
                      setShowMobileFilters(false);
                    }}
                  >
                    <span className={s.filterDot} />
                    Toutes
                  </button>
                  {verticales
                    .filter((v) => verticaleCounts[v.slug.current] > 0)
                    .map((v) => (
                      <button
                        key={v._id}
                        className={
                          activeVerticale === v.slug.current
                            ? s.filterBtnActive
                            : s.filterBtn
                        }
                        style={
                          {
                            "--chip-color": v.couleurDominante,
                          } as React.CSSProperties
                        }
                        onClick={() => {
                          handleVerticaleChange(v.slug.current);
                          setShowMobileFilters(false);
                        }}
                      >
                        <span className={s.filterDot} />
                        {v.nom}
                        <span className={s.filterCount}>
                          {verticaleCounts[v.slug.current]}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            <button
              className={s.mobileFilterApply}
              onClick={() => setShowMobileFilters(false)}
            >
              Appliquer
            </button>
          </div>
        </div>
      )}

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
