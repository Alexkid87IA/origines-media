// src/pages/HistoiresPage.tsx
// V2 Design — Text-First stories with editorial grid layout

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { sanityFetch } from "../lib/sanity";
import { HISTOIRES_PAGE_QUERY, TAGS_QUERY } from "../lib/queries";
import { typo } from "../lib/typography";
import {
  TAG_CATEGORIES,
  getOrderedCategories,
  countStoriesByCategory,
  filterStoriesByCategory,
  getCategoryColors,
  TagCategory,
  getTagCategory,
} from "../lib/tagCategories";
import s from "./HistoiresPage.module.css";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Tag {
  _id: string;
  nom: string;
  title?: string;
  slug: string;
  couleur?: string;
}

interface Univers {
  _id: string;
  nom: string;
  couleur: string;
  slug: string;
}

interface Histoire {
  _id: string;
  titre: string;
  categorie: string;
  accroche: string;
  slug: string;
  citation?: string;
  tags?: Tag[];
  univers?: Univers;
}

/* ------------------------------------------------------------------ */
/*  Inline SVG icon components (no lucide-react)                       */
/* ------------------------------------------------------------------ */

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function IconChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function IconSliders(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" />
    </svg>
  );
}

function IconBookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

function IconQuote(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M10 8c-1.1 0-2 .9-2 2v2H6c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm8 0c-1.1 0-2 .9-2 2v2h-2c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z" />
    </svg>
  );
}

function IconPen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function IconRoute(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  );
}

function IconHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z" />
    </svg>
  );
}

function IconTrendingUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconUsers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconBrain(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M9.5 2A5.5 5.5 0 005 7.5c0 .88.21 1.72.58 2.46L4 12.5a2.5 2.5 0 002.5 4h.5V19a3 3 0 003 3h4a3 3 0 003-3v-2.5h.5a2.5 2.5 0 002.5-4l-1.58-2.54c.37-.74.58-1.58.58-2.46A5.5 5.5 0 0014.5 2" />
    </svg>
  );
}

function IconFlame(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.07-2.14 0-5.5 2.5-7 .5 2 1.5 3 2 4.5 1 3 2.5 5 2.5 7.5a5 5 0 01-10 0c0-1.5.5-2.5 1.5-4z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Category → SVG icon mapping                                        */
/* ------------------------------------------------------------------ */

type IconComponent = (props: React.SVGProps<SVGSVGElement>) => JSX.Element;

const CATEGORY_ICONS: Record<string, IconComponent> = {
  emotions: IconHeart,
  developpement: IconTrendingUp,
  parcours: IconRoute,
  relations: IconUsers,
  sante: IconBrain,
  epreuves: IconFlame,
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ITEMS_PER_PAGE = 6;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function shuffleWithDiversity(histoires: Histoire[]): Histoire[] {
  if (histoires.length === 0) return [];

  const byCategory: Record<string, Histoire[]> = {};
  const uncategorized: Histoire[] = [];

  histoires.forEach((h) => {
    let foundCategory = false;
    if (h.tags && h.tags.length > 0) {
      for (const tag of h.tags) {
        const category = getTagCategory(tag.slug);
        if (category) {
          if (!byCategory[category.id]) byCategory[category.id] = [];
          byCategory[category.id].push(h);
          foundCategory = true;
          break;
        }
      }
    }
    if (!foundCategory) uncategorized.push(h);
  });

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  Object.keys(byCategory).forEach((key) => {
    byCategory[key] = shuffleArray(byCategory[key]);
  });

  const result: Histoire[] = [];
  const categoryKeys = shuffleArray(Object.keys(byCategory));
  const categoryIndices: Record<string, number> = {};
  categoryKeys.forEach((key) => (categoryIndices[key] = 0));

  let currentCategoryIdx = 0;
  const totalFromCategories = Object.values(byCategory).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  while (result.length < totalFromCategories) {
    const catKey = categoryKeys[currentCategoryIdx % categoryKeys.length];
    const catArray = byCategory[catKey];

    if (categoryIndices[catKey] < catArray.length) {
      result.push(catArray[categoryIndices[catKey]]);
      categoryIndices[catKey]++;
    }

    currentCategoryIdx++;

    let attempts = 0;
    while (
      categoryIndices[categoryKeys[currentCategoryIdx % categoryKeys.length]] >=
        byCategory[categoryKeys[currentCategoryIdx % categoryKeys.length]].length &&
      attempts < categoryKeys.length
    ) {
      currentCategoryIdx++;
      attempts++;
    }
  }

  return [...result, ...shuffleArray(uncategorized)];
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Story Card                                          */
/* ------------------------------------------------------------------ */

interface HistoireCardProps {
  histoire: Histoire;
  cmsTags: Tag[];
}

function HistoireCard({ histoire, cmsTags }: HistoireCardProps) {
  const mainCategory = useMemo(() => {
    if (!histoire.tags || histoire.tags.length === 0) return null;
    for (const tag of histoire.tags) {
      const category = getTagCategory(tag.slug);
      if (category) return category;
    }
    return null;
  }, [histoire.tags]);

  const colors = useMemo(() => {
    if (mainCategory) return getCategoryColors(mainCategory.id);
    if (histoire.univers?.couleur) {
      return {
        bg: histoire.univers.couleur,
        text: "#FFFFFF",
        light: `${histoire.univers.couleur}15`,
        shadow: `${histoire.univers.couleur}40`,
      };
    }
    return getCategoryColors("parcours");
  }, [mainCategory, histoire.univers]);

  const CategoryIcon = mainCategory ? CATEGORY_ICONS[mainCategory.id] : IconRoute;
  const categoryLabel = mainCategory?.nom || histoire.univers?.nom || "Parcours";

  return (
    <article
      className={s.card}
      style={{ "--cat-color": colors.bg } as React.CSSProperties}
    >
      <Link to={`/histoire/${histoire.slug}`} className={s.cardLink}>
        <div className={s.cardBody}>
          {/* Meta: icon + category */}
          <div className={s.cardMeta}>
            <CategoryIcon className={s.cardCatIcon} />
            <span className={s.cardDot} />
            <span>{categoryLabel}</span>
          </div>

          {/* Citation */}
          {histoire.citation && (
            <p className={s.cardQuote}>{typo(histoire.citation)}</p>
          )}

          {/* Titre */}
          <h3 className={s.cardTitle}>{typo(histoire.titre)}</h3>

          {/* Accroche */}
          {histoire.accroche && (
            <p className={s.cardExcerpt}>{typo(histoire.accroche)}</p>
          )}

          {/* Tags (max 3) */}
          {histoire.tags && histoire.tags.length > 0 && (
            <div className={s.cardTags}>
              {histoire.tags.slice(0, 3).map((tag) => (
                <span key={tag._id} className={s.cardTag}>
                  {tag.nom}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className={s.cardFoot}>
            <span className={s.cardCta}>
              Lire l&rsquo;histoire
              <IconArrowRight width={10} height={10} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: Featured Story                                      */
/* ------------------------------------------------------------------ */

interface FeaturedHistoireProps {
  histoire: Histoire;
  cmsTags: Tag[];
}

function FeaturedHistoire({ histoire, cmsTags }: FeaturedHistoireProps) {
  const mainCategory = useMemo(() => {
    if (!histoire.tags || histoire.tags.length === 0) return null;
    for (const tag of histoire.tags) {
      const category = getTagCategory(tag.slug);
      if (category) return category;
    }
    return null;
  }, [histoire.tags]);

  const colors = useMemo(() => {
    if (mainCategory) return getCategoryColors(mainCategory.id);
    return getCategoryColors("parcours");
  }, [mainCategory]);

  const CategoryIcon = mainCategory ? CATEGORY_ICONS[mainCategory.id] : IconRoute;

  return (
    <Link
      to={`/histoire/${histoire.slug}`}
      className={s.featured}
      style={{ backgroundColor: colors.bg }}
    >
      {/* Decorative quote icon */}
      <IconQuote className={s.featuredQuoteDecor} />

      <div className={s.featuredInner}>
        {/* Meta */}
        <div className={s.featuredMeta}>
          <span className={s.featuredIcon}>
            <CategoryIcon />
          </span>
          <span className={s.featuredLabel}>
            {mainCategory?.nom || "À la une"}
          </span>
        </div>

        {/* Citation */}
        {histoire.citation && (
          <blockquote className={s.featuredQuote}>
            &laquo;&nbsp;{typo(histoire.citation)}&nbsp;&raquo;
          </blockquote>
        )}

        {/* Title */}
        <h2 className={s.featuredTitle}>{typo(histoire.titre)}</h2>

        {/* Accroche */}
        {histoire.accroche && (
          <p className={s.featuredExcerpt}>{typo(histoire.accroche)}</p>
        )}

        {/* CTA */}
        <span className={s.featuredCta}>
          D&eacute;couvrir cette histoire
          <IconArrowRight />
        </span>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function HistoiresPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [histoires, setHistoires] = useState<Histoire[]>([]);
  const [cmsTags, setCmsTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  /* ── URL state ── */
  const searchQuery = searchParams.get("q") || "";
  const activeCategory = searchParams.get("categorie") || "";
  const activeTagSlug = searchParams.get("tag") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [searchInput, setSearchInput] = useState(searchQuery);

  /* ── Data fetching ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [histoiresData, tagsData] = await Promise.all([
          sanityFetch<Histoire[]>(HISTOIRES_PAGE_QUERY),
          sanityFetch<Tag[]>(TAGS_QUERY),
        ]);
        setHistoires(histoiresData || []);
        setCmsTags(tagsData || []);
      } catch (err) {
        console.error("Erreur chargement histoires:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  /* ── Category counts ── */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    getOrderedCategories().forEach((cat) => {
      counts[cat.id] = countStoriesByCategory(histoires, cat.id);
    });
    return counts;
  }, [histoires]);

  /* ── Filter ── */
  const filteredHistoires = useMemo(() => {
    let result = [...histoires];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.titre.toLowerCase().includes(q) ||
          h.accroche?.toLowerCase().includes(q) ||
          h.categorie?.toLowerCase().includes(q) ||
          h.citation?.toLowerCase().includes(q) ||
          h.univers?.nom?.toLowerCase().includes(q) ||
          h.tags?.some((tag) => tag.nom?.toLowerCase().includes(q))
      );
    }

    if (activeCategory) {
      result = filterStoriesByCategory(result, activeCategory);
    }

    if (activeTagSlug) {
      result = result.filter((h) =>
        h.tags?.some((tag) => tag.slug === activeTagSlug)
      );
    }

    if (!activeCategory && !activeTagSlug && !searchQuery) {
      result = shuffleWithDiversity(result);
    }

    return result;
  }, [histoires, searchQuery, activeCategory, activeTagSlug]);

  /* ── Featured ── */
  const featuredHistoire = useMemo(() => {
    if (!activeCategory && !activeTagSlug && !searchQuery) {
      return filteredHistoires.find((h) => h.citation) || filteredHistoires[0];
    }
    return null;
  }, [filteredHistoires, activeCategory, activeTagSlug, searchQuery]);

  /* ── Grid histoires (sans featured) ── */
  const gridHistoires = useMemo(() => {
    if (featuredHistoire) {
      return filteredHistoires.filter((h) => h._id !== featuredHistoire._id);
    }
    return filteredHistoires;
  }, [filteredHistoires, featuredHistoire]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(gridHistoires.length / ITEMS_PER_PAGE);
  const paginatedHistoires = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return gridHistoires.slice(start, start + ITEMS_PER_PAGE);
  }, [gridHistoires, currentPage]);

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

  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      const p = new URLSearchParams(searchParams);
      if (activeCategory === categoryId) p.delete("categorie");
      else {
        p.set("categorie", categoryId);
        p.delete("tag");
      }
      p.set("page", "1");
      setSearchParams(p);
    },
    [activeCategory, searchParams, setSearchParams]
  );

  const handleTagClick = useCallback(
    (tagSlug: string) => {
      const p = new URLSearchParams(searchParams);
      if (activeTagSlug === tagSlug) p.delete("tag");
      else {
        p.set("tag", tagSlug);
        p.delete("categorie");
      }
      p.set("page", "1");
      setSearchParams(p);
    },
    [activeTagSlug, searchParams, setSearchParams]
  );

  const toggleCategoryExpansion = useCallback((categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      const p = new URLSearchParams(searchParams);
      p.set("page", page.toString());
      setSearchParams(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
    setSearchInput("");
    setExpandedCategories([]);
  }, [setSearchParams]);

  const hasActiveFilters = searchQuery || activeCategory || activeTagSlug;

  /* ── Active colors ── */
  const activeColors = useMemo(() => {
    if (activeCategory) return getCategoryColors(activeCategory);
    if (activeTagSlug) {
      const tag = cmsTags.find((t) => t.slug === activeTagSlug);
      if (tag?.couleur) {
        return {
          bg: tag.couleur,
          text: "#FFFFFF",
          light: `${tag.couleur}20`,
          shadow: `${tag.couleur}40`,
        };
      }
    }
    return { bg: "#8B5CF6", text: "#FFFFFF", light: "#8B5CF620", shadow: "#8B5CF640" };
  }, [activeCategory, activeTagSlug, cmsTags]);

  /* ── Tags for a category ── */
  const getTagsForCategory = useCallback(
    (category: TagCategory) => {
      return category.tags
        .map((slug) => cmsTags.find((t) => t.slug === slug))
        .filter((t): t is Tag => t !== undefined);
    },
    [cmsTags]
  );

  /* ══════════════════════════════════════════════════════════════════ */
  /*  Loading state                                                    */
  /* ══════════════════════════════════════════════════════════════════ */

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main id="main" role="main">
          <div className="v2-container">
            <section className={s.page}>
              <div className={s.skeleton}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={s.skelCard}>
                    <div className={s.skelBody}>
                      <div className={s.skelLineTiny} />
                      <div className={s.skelLine} />
                      <div className={s.skelLineShort} />
                      <div className={s.skelLineTiny} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
        <Footer2 />
      </>
    );
  }

  /* ══════════════════════════════════════════════════════════════════ */
  /*  Render                                                           */
  /* ══════════════════════════════════════════════════════════════════ */

  return (
    <>
      <SEO
        title="Histoires"
        description="Des r&eacute;cits singuliers qui inspirent, transforment et &eacute;clairent. D&eacute;couvrez des parcours authentiques et des t&eacute;moignages qui r&eacute;sonnent."
        url="/histoires"
      />

      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          <section className={s.page}>

            {/* ── Chapter mark ── */}
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Biblioth&egrave;que</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Histoires</span>
            </div>

            {/* ── Section header ── */}
            <header className={s.sectionHead}>
              <span className={s.sectionKicker}>
                <span className={s.sectionKickerDot} aria-hidden="true" />
                Histoires &middot; parcours inspirants
              </span>
              <h1 className={s.sectionTitle}>
                {activeCategory
                  ? TAG_CATEGORIES[activeCategory]?.nom || "Histoires"
                  : <>Des histoires qui <em>transforment.</em></>}
              </h1>
              <p className={s.sectionDeck}>
                {typo(
                  "Chaque parcours est unique. Découvrez des témoignages authentiques, des récits de résilience et des expériences qui éclairent notre humanité commune."
                )}
              </p>
              <div className={s.stats}>
                <span className={s.stat}>
                  <IconBookOpen className={s.statIcon} />
                  <span className={s.statNum}>{histoires.length}</span> histoires
                </span>
                <span className={s.stat}>
                  <IconRoute className={s.statIcon} />
                  <span className={s.statNum}>6</span> th&eacute;matiques
                </span>
              </div>
            </header>

            {/* ── Featured histoire ── */}
            {featuredHistoire && !hasActiveFilters && (
              <FeaturedHistoire histoire={featuredHistoire} cmsTags={cmsTags} />
            )}

            {/* ── Toolbar ── */}
            <div className={s.toolbar}>
              <form onSubmit={handleSearch} className={s.searchWrap}>
                <IconSearch className={s.searchIcon} width={14} height={14} />
                <input
                  type="text"
                  placeholder="Rechercher une histoire…"
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
                    <IconX width={12} height={12} />
                  </button>
                )}
              </form>

              {/* Mobile filter toggle */}
              <button
                type="button"
                className={s.mobileFilterBtn}
                onClick={() => setShowMobileFilters((v) => !v)}
              >
                <IconSliders width={14} height={14} />
                Th&egrave;mes
              </button>
            </div>

            {/* ── Active filter chips ── */}
            {hasActiveFilters && (
              <div className={s.activeFilters}>
                <span className={`${s.activeLabel} mono`}>Filtres&nbsp;:</span>
                {activeCategory && TAG_CATEGORIES[activeCategory] && (
                  <button
                    className={s.activeChip}
                    style={{ "--chip-color": TAG_CATEGORIES[activeCategory].couleur } as React.CSSProperties}
                    onClick={() => handleCategoryClick(activeCategory)}
                  >
                    <span className={s.activeChipDot} />
                    {TAG_CATEGORIES[activeCategory].nom}
                    <span className={s.activeChipX}>&times;</span>
                  </button>
                )}
                {activeTagSlug && (
                  <button
                    className={s.activeChip}
                    style={{
                      "--chip-color":
                        cmsTags.find((t) => t.slug === activeTagSlug)?.couleur || "#6366F1",
                    } as React.CSSProperties}
                    onClick={() => handleTagClick(activeTagSlug)}
                  >
                    <span className={s.activeChipDot} />
                    {cmsTags.find((t) => t.slug === activeTagSlug)?.nom || activeTagSlug}
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

            {/* ── Mobile filter drawer ── */}
            {showMobileFilters && (
              <div
                className={s.mobileFilterDrawer}
                style={{ display: "block" }}
              >
                <div
                  className={s.mobileFilterOverlay}
                  onClick={() => setShowMobileFilters(false)}
                />
                <div className={s.mobileFilterPanel}>
                  <div className={s.mobileFilterHeader}>
                    <h3 className={s.mobileFilterTitle}>
                      Explorer par th&egrave;me
                    </h3>
                    <button
                      className={s.mobileFilterClose}
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <IconX width={14} height={14} />
                    </button>
                  </div>
                  <div className={s.filterGroup}>
                    <div className={s.filterList}>
                      <button
                        className={
                          !activeCategory && !activeTagSlug
                            ? s.filterBtnActive
                            : s.filterBtn
                        }
                        onClick={() => {
                          clearFilters();
                          setShowMobileFilters(false);
                        }}
                      >
                        <span className={s.filterDot} />
                        Toutes
                        <span className={s.filterCount}>
                          {histoires.length}
                        </span>
                      </button>
                      {getOrderedCategories().map((cat) => (
                        <button
                          key={cat.id}
                          className={
                            activeCategory === cat.id
                              ? s.filterBtnActive
                              : s.filterBtn
                          }
                          style={{ "--chip-color": cat.couleur } as React.CSSProperties}
                          onClick={() => {
                            handleCategoryClick(cat.id);
                            setShowMobileFilters(false);
                          }}
                        >
                          <span className={s.filterDot} />
                          {cat.nom}
                          <span className={s.filterCount}>
                            {categoryCounts[cat.id]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Layout: sidebar + content ── */}
            <div className={s.layout}>

              {/* ── Sidebar (desktop) ── */}
              <aside className={s.sidebar}>

                {/* Category filters */}
                <div className={s.filterGroup}>
                  <h3 className={`${s.filterGroupTitle} mono`}>
                    Explorer par th&egrave;me
                  </h3>
                  <div className={s.filterList}>
                    {/* All button */}
                    <button
                      className={
                        !activeCategory && !activeTagSlug
                          ? s.filterBtnActive
                          : s.filterBtn
                      }
                      onClick={clearFilters}
                    >
                      <span className={s.filterDot} />
                      Toutes les histoires
                      <span className={s.filterCount}>{histoires.length}</span>
                    </button>

                    {/* Categories */}
                    {getOrderedCategories().map((category) => {
                      const isActive = activeCategory === category.id;
                      const isExpanded = expandedCategories.includes(category.id);
                      const categoryTags = getTagsForCategory(category);

                      return (
                        <div key={category.id}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <button
                              className={isActive ? s.filterBtnActive : s.filterBtn}
                              style={{ "--chip-color": category.couleur } as React.CSSProperties}
                              onClick={() => handleCategoryClick(category.id)}
                            >
                              <span className={s.filterDot} />
                              {category.nom}
                              <span className={s.filterCount}>
                                {categoryCounts[category.id]}
                              </span>
                            </button>
                            {categoryTags.length > 0 && (
                              <button
                                className={s.filterExpandBtn}
                                onClick={() => toggleCategoryExpansion(category.id)}
                                aria-label={
                                  isExpanded
                                    ? `Masquer les tags de ${category.nom}`
                                    : `Afficher les tags de ${category.nom}`
                                }
                              >
                                <IconChevronDown
                                  className={`${s.filterExpandIcon} ${
                                    isExpanded ? s.filterExpandIconOpen : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Expandable sub-tags */}
                          {isExpanded && categoryTags.length > 0 && (
                            <div className={s.subTagList}>
                              {categoryTags.map((tag) => {
                                const isTagActive = activeTagSlug === tag.slug;
                                return (
                                  <button
                                    key={tag._id}
                                    className={
                                      isTagActive
                                        ? s.subTagBtnActive
                                        : s.subTagBtn
                                    }
                                    style={
                                      isTagActive
                                        ? ({
                                            color: tag.couleur || category.couleur,
                                            background: `${tag.couleur || category.couleur}12`,
                                          } as React.CSSProperties)
                                        : undefined
                                    }
                                    onClick={() => handleTagClick(tag.slug)}
                                  >
                                    {tag.nom}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sidebar CTA */}
                <div className={s.sidebarCta}>
                  <div className={s.sidebarCtaHead}>
                    <IconPen className={s.sidebarCtaIcon} />
                    <h4 className={s.sidebarCtaTitle}>
                      Vous avez une histoire&nbsp;?
                    </h4>
                  </div>
                  <p className={s.sidebarCtaText}>
                    {typo(
                      "Partagez votre parcours et inspirez des milliers de lecteurs."
                    )}
                  </p>
                  <Link to="/racontez-votre-histoire" className={s.sidebarCtaLink}>
                    Racontez la v&ocirc;tre
                    <IconArrowRight />
                  </Link>
                </div>
              </aside>

              {/* ── Content ── */}
              <div className={s.content}>

                {/* Result count */}
                <div className={s.resultCount}>
                  {gridHistoires.length} histoire{gridHistoires.length > 1 ? "s" : ""}
                  {hasActiveFilters &&
                    " trouvée" + (gridHistoires.length > 1 ? "s" : "")}
                </div>

                {/* Grid */}
                {paginatedHistoires.length > 0 ? (
                  <>
                    <div className={s.grid}>
                      {paginatedHistoires.map((histoire) => (
                        <HistoireCard
                          key={histoire._id}
                          histoire={histoire}
                          cmsTags={cmsTags}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <nav className={s.pagination} aria-label="Pagination">
                        <button
                          className={s.pageBtn}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <IconChevronLeft width={14} height={14} />
                        </button>

                        <div className={s.pageNums}>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (page) => {
                              if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                              ) {
                                return (
                                  <button
                                    key={page}
                                    className={
                                      page === currentPage
                                        ? s.pageBtnActive
                                        : s.pageBtn
                                    }
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
                                  <span key={page} className={s.pageEllipsis}>
                                    &hellip;
                                  </span>
                                );
                              }
                              return null;
                            }
                          )}
                        </div>

                        <button
                          className={s.pageBtn}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <IconChevronRight width={14} height={14} />
                        </button>
                      </nav>
                    )}
                  </>
                ) : (
                  /* ── Empty state ── */
                  <div className={s.empty}>
                    <IconSearch className={s.emptyIcon} />
                    <h3 className={s.emptyTitle}>Aucune histoire trouv&eacute;e</h3>
                    <p className={s.emptyText}>
                      {searchQuery
                        ? `Aucun résultat pour « ${searchQuery} »`
                        : "Essayez de modifier vos filtres"}
                    </p>
                    <button className={s.emptyCta} onClick={clearFilters}>
                      Voir toutes les histoires
                      <IconArrowRight width={14} height={14} />
                    </button>
                  </div>
                )}

                {/* Mobile CTA */}
                <div className={s.mobileCta}>
                  <div className={s.sidebarCtaHead}>
                    <IconPen className={s.sidebarCtaIcon} />
                    <h4 className={s.sidebarCtaTitle}>
                      Vous avez une histoire&nbsp;?
                    </h4>
                  </div>
                  <p className={s.sidebarCtaText}>
                    {typo(
                      "Partagez votre parcours et inspirez des milliers de lecteurs."
                    )}
                  </p>
                  <Link to="/racontez-votre-histoire" className={s.sidebarCtaLink}>
                    Racontez la v&ocirc;tre
                    <IconArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
