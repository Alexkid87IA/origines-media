// src/pages/ProductionDetailPage.tsx
// V2 design system — split hero + sidebar widgets

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import EmailCapture from "@/components/EmailCapture";
import { sanityFetch } from "@/lib/sanity";
import { PRODUCTION_BY_SLUG_QUERY } from "@/lib/queries";
import { typo } from "@/lib/typography";
import { AdPlaceholder } from "@/components/AdSense";
import { createPortableTextComponentsV2 } from "@/components/article/PortableTextComponentsV2";
import { shareButtons } from "@/components/article/SocialIcons";
import type { Heading } from "@/components/article/types";
import s from "./ProductionDetailPage.module.css";

/* ------------------------------------------------------------------ */
/*  Inline SVG icon helpers (no lucide-react)                          */
/* ------------------------------------------------------------------ */

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const BookmarkIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
);

const BookOpenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const FlameIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <circle cx="7" cy="7" r="1" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Production {
  _id: string;
  titre: string;
  description: string;
  imageUrl: string;
  slug: { current: string };
  datePublication: string;
  duree: number;
  tempsLecture?: number;
  videoUrl?: string;
  contenu?: any[];
  univers?: {
    nom: string;
    couleur: string;
    slug: { current: string };
  };
  verticale?: {
    nom: string;
    couleurDominante: string;
    slug: { current: string };
  };
  formats?: Array<{
    nom: string;
    slug: { current: string };
  }>;
  tags?: Array<{
    nom: string;
    couleur: string;
    slug: { current: string };
  }>;
}

interface RelatedArticle {
  _id: string;
  titre: string;
  description?: string;
  imageUrl: string;
  slug: string;
  verticale?: { nom: string; couleurDominante: string };
  datePublication?: string;
}

/* ------------------------------------------------------------------ */
/*  Shuffle helper — no two consecutive same-category articles         */
/* ------------------------------------------------------------------ */

function shuffleWithVariety(articles: RelatedArticle[]): RelatedArticle[] {
  if (articles.length <= 1) return articles;

  const byCategory: { [key: string]: RelatedArticle[] } = {};
  articles.forEach((article) => {
    const cat = article.verticale?.nom || "Autre";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(article);
  });

  Object.values(byCategory).forEach((group) => {
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
  });

  const result: RelatedArticle[] = [];
  const categories = Object.keys(byCategory);
  let lastCategory = "";
  let maxIterations = articles.length * 2;

  while (result.length < articles.length && maxIterations > 0) {
    maxIterations--;
    let found = false;

    for (const cat of categories) {
      if (cat !== lastCategory && byCategory[cat].length > 0) {
        result.push(byCategory[cat].shift()!);
        lastCategory = cat;
        found = true;
        break;
      }
    }

    if (!found) {
      for (const cat of categories) {
        if (byCategory[cat].length > 0) {
          result.push(byCategory[cat].shift()!);
          lastCategory = cat;
          break;
        }
      }
    }
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ProductionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  /* ── State ── */
  const [production, setProduction] = useState<Production | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [latestArticles, setLatestArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeTab, setActiveTab] = useState<"recent" | "popular">("recent");
  const [tocExpanded, setTocExpanded] = useState(false);

  /* ── Refs ── */
  const articleRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const lastSidebarStateRef = useRef<string>("");
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  /* ── Set page background ── */
  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  /* ── Extract headings from content ── */
  useEffect(() => {
    if (production?.contenu) {
      const extracted: Heading[] = [];
      production.contenu.forEach((block: any, index: number) => {
        if (
          block._type === "block" &&
          (block.style === "h2" || block.style === "h3")
        ) {
          const text =
            block.children?.map((child: any) => child.text).join("") || "";
          if (text) {
            extracted.push({
              id: `heading-${index}`,
              text,
              level: block.style === "h2" ? 2 : 3,
            });
          }
        }
      });
      setHeadings(extracted);
    }
  }, [production]);

  /* ── Sync sidebar container height ── */
  useEffect(() => {
    const syncHeight = () => {
      if (articleRef.current && sidebarContainerRef.current) {
        const articleHeight = articleRef.current.offsetHeight;
        sidebarContainerRef.current.style.height = `${articleHeight}px`;
      }
    };

    syncHeight();
    window.addEventListener("resize", syncHeight);
    const timer = setTimeout(syncHeight, 500);

    return () => {
      window.removeEventListener("resize", syncHeight);
      clearTimeout(timer);
    };
  }, [production]);

  /* ── Sidebar sticky behaviour ── */
  useEffect(() => {
    const handleSidebarScroll = () => {
      if (!sidebarRef.current || !sidebarContainerRef.current) return;

      const container = sidebarContainerRef.current;
      const sidebar = sidebarRef.current;
      const containerRect = container.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const viewportHeight = window.innerHeight;
      const sidebarBottomIfRelative = containerRect.top + sidebarHeight;

      let newState: string;
      let newStyle: React.CSSProperties;

      if (sidebarBottomIfRelative > viewportHeight) {
        newState = "relative";
        newStyle = { position: "relative", top: 0 };
      } else if (containerRect.bottom > sidebarHeight) {
        const topPosition = viewportHeight - sidebarHeight;
        newState = `fixed-${Math.round(topPosition)}-${container.offsetWidth}`;
        newStyle = {
          position: "fixed",
          top: topPosition,
          width: container.offsetWidth,
        };
      } else {
        newState = "absolute";
        newStyle = {
          position: "absolute",
          bottom: 0,
          top: "auto",
          width: "100%",
        };
      }

      if (lastSidebarStateRef.current !== newState) {
        lastSidebarStateRef.current = newState;
        setSidebarStyle(newStyle);
      }
    };

    window.addEventListener("scroll", handleSidebarScroll, { passive: true });
    window.addEventListener("resize", handleSidebarScroll);
    setTimeout(handleSidebarScroll, 200);

    return () => {
      window.removeEventListener("scroll", handleSidebarScroll);
      window.removeEventListener("resize", handleSidebarScroll);
    };
  }, [production]);

  /* ── Scroll progress + active section ── */
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 0) {
            setActiveSection(heading.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  /* ── Fetch data ── */
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) setLoading(true);
        const data = await sanityFetch(PRODUCTION_BY_SLUG_QUERY, { slug });

        if (!isMounted) return;
        if (!data) {
          if (isMounted) navigate("/404");
          return;
        }

        if (isMounted) setProduction(data);

        try {
          const allProductions = await sanityFetch(
            `
            *[_type == "production" && slug.current != $slug] | order(datePublication desc) [0...30] {
              _id,
              titre,
              description,
              "imageUrl": coalesce(image.asset->url, imageUrl),
              "slug": slug.current,
              datePublication,
              verticale->{nom, couleurDominante}
            }
          `,
            { slug }
          );

          if (isMounted && allProductions) {
            const shuffledArticles = shuffleWithVariety(allProductions);
            setLatestArticles(shuffledArticles.slice(0, 6));

            const related = data.verticale
              ? allProductions
                  .filter(
                    (a: RelatedArticle) =>
                      a.verticale?.nom === data.verticale.nom
                  )
                  .slice(0, 4)
              : allProductions.slice(0, 4);
            setRelatedArticles(related);
          }
        } catch {
          // Silent fail for related articles
        }
      } catch {
        if (isMounted) navigate("/404");
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

  /* ── Helpers ── */
  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = production?.titre || "";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
          "_blank"
        );
        break;
      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent("Je voulais partager cet article avec toi : " + url)}`;
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        break;
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top =
        element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const publishedDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60)
    );
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "A l'instant";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `${diffInDays}j`;
    return publishedDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const themeColor =
    production?.verticale?.couleurDominante || "#0A0A0A";
  const isLongArticle = headings.length >= 3;

  const portableTextComponents = useMemo(
    () =>
      createPortableTextComponentsV2({
        themeColor,
        article: production,
      }),
    [themeColor, production]
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.skeleton}>
          <div className={s.skelTitle} />
          <div className={s.skelMeta} />
          <div className={s.skelImg} />
          <div className={s.skelLine} />
          <div className={s.skelLineShort} />
          <div className={s.skelLine} />
          <div className={s.skelLineTiny} />
        </div>
      </div>
    );
  }

  if (!production) return null;

  const readTime = production.tempsLecture || production.duree || 5;
  const tags = production.tags || [];

  return (
    <div className={s.page}>
      <SEO
        title={production.titre}
        description={production.description}
        url={`/article/${production.slug.current}`}
        image={production.imageUrl}
        type="article"
        jsonLd="article"
        section={production.verticale?.nom}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Bibliothèque", url: "/bibliotheque" },
          ...(production.verticale?.nom
            ? [
                {
                  name: production.verticale.nom,
                  url: `/univers/${production.verticale.slug?.current || production.verticale.nom.toLowerCase()}`,
                },
              ]
            : []),
          {
            name: production.titre,
            url: `/article/${production.slug.current}`,
          },
        ]}
      />

      {/* Progress Bar */}
      <div
        className={s.progressBar}
        style={{ width: `${scrollProgress}%` }}
      />

      <SiteHeader />

      <main>
        {/* ═══ Hero — Split layout ═══ */}
        <div className={s.hero}>
          {/* Floating nav */}
          <div className={s.heroNav}>
            <button
              onClick={() => navigate(-1)}
              className={s.heroBackBtn}
            >
              <span className={s.heroBackIcon}>
                <ArrowLeftIcon />
              </span>
              <span className={s.heroBackLabel}>Retour</span>
            </button>

            <div className={s.heroActions}>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={
                  isLiked ? s.heroActionBtnActive : s.heroActionBtn
                }
              >
                <HeartIcon filled={isLiked} />
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={
                  isBookmarked ? s.heroActionBtnActive : s.heroActionBtn
                }
              >
                <BookmarkIcon filled={isBookmarked} />
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className={s.heroActionBtn}
              >
                <ShareIcon />
              </button>
            </div>
          </div>

          {/* Split grid */}
          <div className={s.heroGrid}>
            {/* Image column */}
            <div className={s.heroImageCol}>
              <div
                className={s.heroImage}
                style={{
                  backgroundImage: `url(${production.imageUrl || "/placeholder.svg"})`,
                }}
              />
              <div className={s.heroImageOverlay} />
            </div>

            {/* Content column */}
            <div className={s.heroContentCol}>
              {production.verticale && (
                <Link
                  to={`/univers/${production.verticale.slug.current}`}
                  className={s.heroKicker}
                  style={{ color: themeColor }}
                >
                  {production.verticale.nom}
                </Link>
              )}

              <h1 className={s.heroTitle}>{typo(production.titre)}</h1>

              {production.description && (
                <p className={s.heroDeck}>
                  {typo(production.description)}
                </p>
              )}

              <div className={s.heroMeta}>
                <span className={s.heroMetaItem}>
                  <UserIcon />
                  Origines Media
                </span>
                {production.datePublication && (
                  <>
                    <span className={s.heroDot} aria-hidden="true" />
                    <time
                      className={s.heroMetaItem}
                      dateTime={production.datePublication}
                    >
                      <CalendarIcon />
                      {formatDate(production.datePublication)}
                    </time>
                  </>
                )}
                <span className={s.heroDot} aria-hidden="true" />
                <span className={s.heroMetaItem}>
                  <ClockIcon />
                  {readTime} min de lecture
                </span>
              </div>

              {tags.length > 0 && (
                <div className={s.heroTags}>
                  {tags.map(
                    (tag) =>
                      tag && (
                        <span
                          key={tag.slug?.current || tag.nom}
                          className={s.heroTag}
                        >
                          #{tag.nom}
                        </span>
                      )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ Content + Sidebar ═══ */}
        <section className={s.contentSection}>
          <div className={s.contentGrid}>
            {/* Article body */}
            <div ref={articleRef} className={s.articleBody}>
              {/* Mobile ad */}
              <AdPlaceholder format="banner" className={s.mobileAdBanner} />

              {production.contenu && production.contenu.length > 0 ? (
                <div className={s.prose}>
                  <PortableText
                    value={production.contenu}
                    components={portableTextComponents}
                  />
                </div>
              ) : (
                <div className={s.emptyContent}>
                  <BookOpenIcon />
                  <p>Contenu en cours de r&eacute;daction...</p>
                </div>
              )}

              {/* CTA box */}
              {production.verticale && (
                <div className={s.ctaBox}>
                  <h3 className={s.ctaBoxTitle}>
                    Envie d&rsquo;aller plus loin&nbsp;?
                  </h3>
                  <p className={s.ctaBoxText}>
                    D&eacute;couvrez tous nos articles sur{" "}
                    {production.verticale.nom}
                  </p>
                  <Link
                    to={`/univers/${production.verticale.slug.current}`}
                    className={s.ctaBoxLink}
                  >
                    Explorer {production.verticale.nom}
                    <ChevronRightIcon />
                  </Link>
                </div>
              )}

              {/* Author box */}
              <div className={s.authorBox}>
                <div className={s.authorBoxInner}>
                  <div
                    className={s.authorAvatar}
                    style={{ backgroundColor: themeColor }}
                  >
                    O
                  </div>
                  <div className={s.authorBoxContent}>
                    <p className={s.authorBoxLabel}>
                      &Eacute;crit par
                    </p>
                    <h4 className={s.authorBoxName}>Origines Media</h4>
                    <p className={s.authorBoxRole}>
                      R&eacute;daction
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside
              ref={sidebarContainerRef}
              className={s.sidebar}
            >
              <div
                ref={sidebarRef}
                className={s.sidebarInner}
                style={sidebarStyle}
              >
                {/* 1. TOC */}
                {isLongArticle && headings.length > 0 && (
                  <div className={s.widget}>
                    <button
                      className={s.widgetHead}
                      onClick={() => setTocExpanded(!tocExpanded)}
                    >
                      <h4 className={s.widgetTitle}>
                        <ListIcon />
                        Sommaire
                      </h4>
                      <svg
                        className={
                          tocExpanded
                            ? s.widgetChevronOpen
                            : s.widgetChevron
                        }
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {tocExpanded && (
                        <motion.nav
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className={s.widgetBody}>
                            <div className={s.tocList}>
                              {(() => {
                                let h2Index = 0;
                                return headings.map((heading) => {
                                  const isH2 = heading.level === 2;
                                  const isActive =
                                    activeSection === heading.id;
                                  if (isH2) h2Index++;

                                  return (
                                    <button
                                      key={heading.id}
                                      onClick={() =>
                                        scrollToSection(heading.id)
                                      }
                                      className={`${
                                        isActive
                                          ? s.tocItemActive
                                          : s.tocItem
                                      } ${!isH2 ? s.tocItemH3 : ""}`}
                                    >
                                      {isH2 ? (
                                        <>
                                          <span className={s.tocNum}>
                                            {h2Index}
                                          </span>
                                          <span>{heading.text}</span>
                                        </>
                                      ) : (
                                        <>
                                          <span className={s.tocDot} />
                                          <span>{heading.text}</span>
                                        </>
                                      )}
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        </motion.nav>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 2. Share */}
                <div className={s.widget}>
                  <div className={s.widgetHeadStatic}>
                    <h4 className={s.widgetTitle}>
                      <ShareIcon />
                      Partager
                    </h4>
                  </div>
                  <div className={s.widgetBody}>
                    <div className={s.shareGrid}>
                      {shareButtons.map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => handleShare(btn.id)}
                          className={s.shareBtn}
                          title={btn.label}
                        >
                          <btn.icon />
                        </button>
                      ))}
                      <button
                        onClick={() => handleShare("copy")}
                        className={s.shareBtn}
                        title="Copier le lien"
                      >
                        {copySuccess ? (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Ad */}
                <AdPlaceholder format="rectangle" />

                {/* 4. Explore (tabbed) */}
                {latestArticles.length > 0 && (
                  <div className={s.widget}>
                    <div className={s.exploreTabs}>
                      <button
                        onClick={() => setActiveTab("recent")}
                        className={
                          activeTab === "recent"
                            ? s.exploreTabActive
                            : s.exploreTab
                        }
                      >
                        <ZapIcon />
                        R&eacute;cents
                      </button>
                      <button
                        onClick={() => setActiveTab("popular")}
                        className={
                          activeTab === "popular"
                            ? s.exploreTabActive
                            : s.exploreTab
                        }
                      >
                        <FlameIcon />
                        Populaires
                      </button>
                    </div>

                    <div className={s.exploreList}>
                      {latestArticles.map((item) => (
                        <Link
                          key={item._id}
                          to={`/article/${item.slug}`}
                          className={s.exploreItem}
                        >
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.titre || "Article connexe"}
                              className={s.exploreItemImg}
                              loading="lazy"
                            />
                          )}
                          <div className={s.exploreItemBody}>
                            {item.verticale && (
                              <span
                                className={s.exploreItemVert}
                                style={{
                                  color:
                                    item.verticale.couleurDominante ||
                                    themeColor,
                                }}
                              >
                                {item.verticale.nom}
                              </span>
                            )}
                            <h4 className={s.exploreItemTitle}>
                              {typo(item.titre)}
                            </h4>
                            {item.datePublication && (
                              <span className={s.exploreItemDate}>
                                {getRelativeTime(item.datePublication)}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link
                      to="/bibliotheque"
                      className={s.exploreFooter}
                    >
                      Voir tous les articles
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  </div>
                )}

                {/* 5. Newsletter */}
                <div className={s.nlWidget}>
                  <svg
                    className={s.nlIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                  </svg>
                  <h4 className={s.nlTitle}>Ne manquez rien</h4>
                  <p className={s.nlDeck}>
                    Nos meilleurs r&eacute;cits, chaque semaine.
                  </p>
                  <EmailCapture
                    source="article"
                    variant="inline"
                    placeholder="votre@email.com"
                    buttonText="S'abonner"
                    successMessage="Bienvenue !"
                    successDescription="Rendez-vous vendredi dans votre boite mail."
                  />
                </div>

                {/* 6. Ad */}
                <AdPlaceholder format="rectangle" />

                {/* 7. Social follow */}
                <div className={s.socialWidget}>
                  <div className={s.socialWidgetHead}>
                    <h4 className={s.socialWidgetTitle}>Suivez-nous</h4>
                  </div>
                  <div className={s.socialGrid}>
                    <a
                      href="https://instagram.com/originesmedia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.socialLink}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span className={s.socialLinkLabel}>Instagram</span>
                    </a>
                    <a
                      href="https://linkedin.com/company/originesmedia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.socialLink}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span className={s.socialLinkLabel}>LinkedIn</span>
                    </a>
                    <a
                      href="https://twitter.com/originesmedia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.socialLink}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className={s.socialLinkLabel}>X</span>
                    </a>
                  </div>
                </div>

                {/* 8. Related articles */}
                {isLongArticle && relatedArticles.length > 0 && (
                  <div className={s.widget}>
                    <div className={s.widgetHeadStatic}>
                      <h4 className={s.widgetTitle}>
                        <TrendingUpIcon />
                        &Agrave; lire aussi
                      </h4>
                    </div>
                    <div className={s.widgetBody}>
                      {relatedArticles.map((related) => (
                        <Link
                          key={related._id}
                          to={`/article/${related.slug}`}
                          className={s.relItem}
                        >
                          {related.imageUrl && (
                            <img
                              src={related.imageUrl}
                              alt={related.titre || "Article"}
                              className={s.relImg}
                              loading="lazy"
                            />
                          )}
                          <h4 className={s.relTitle}>
                            {typo(related.titre)}
                          </h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 9. Tags */}
                {tags.length > 0 && (
                  <div className={s.widget}>
                    <div className={s.widgetHeadStatic}>
                      <h4 className={s.widgetTitle}>
                        <TagIcon />
                        Th&eacute;matiques
                      </h4>
                    </div>
                    <div className={s.widgetBody}>
                      <div className={s.tagsList}>
                        {tags.map(
                          (tag) =>
                            tag && (
                              <span
                                key={tag.slug?.current || tag.nom}
                                className={s.tagLink}
                              >
                                {tag.nom}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. Ad */}
                <AdPlaceholder format="rectangle" />
              </div>
            </aside>
          </div>
        </section>

        {/* ═══ Related content — gradient section ═══ */}
        {relatedArticles.length > 0 && (
          <section className={s.relatedSection}>
            <div className={s.relatedInner}>
              <span className={s.relatedKicker}>
                Continuez l&rsquo;exploration
              </span>
              <h2 className={s.relatedHeading}>
                Articles <em>recommand&eacute;s.</em>
              </h2>
              <div className={s.relatedGrid}>
                {relatedArticles.slice(0, 6).map((related) => (
                  <Link
                    key={related._id}
                    to={`/article/${related.slug}`}
                    className={s.relCard}
                  >
                    <div className={s.relCardImgWrap}>
                      <img
                        src={related.imageUrl || "/placeholder.svg"}
                        alt={related.titre || "Article recommandé"}
                        className={s.relCardImg}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    {related.verticale && (
                      <span className={s.relCardVert}>
                        {related.verticale.nom}
                      </span>
                    )}
                    <h3 className={s.relCardTitle}>
                      {typo(related.titre)}
                    </h3>
                  </Link>
                ))}
              </div>
              <div className={s.relatedCtaWrap}>
                <Link to="/bibliotheque" className={s.relatedCta}>
                  Voir tous les articles
                  <ChevronRightIcon />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ═══ End-of-article newsletter ═══ */}
      <section className={s.endNl}>
        <div className={s.endNlInner}>
          <h3 className={s.endNlTitle}>
            Cet article vous a plu&nbsp;?
          </h3>
          <p className={s.endNlDeck}>
            Recevez nos meilleurs r&eacute;cits chaque semaine,
            directement dans votre bo&icirc;te mail.
          </p>
          <EmailCapture
            source="article"
            variant="inline"
            placeholder="votre@email.com"
            buttonText="S'abonner"
            successMessage="Merci !"
            successDescription="Vous recevrez notre prochaine newsletter vendredi."
          />
        </div>
      </section>

      {/* ═══ Scroll to top ═══ */}
      <div className={s.scrollTopSection}>
        <button
          className={s.scrollTopBtn}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
          Retour en haut
        </button>
      </div>

      <Footer2 />

      {/* ═══ Mobile floating action bar ═══ */}
      <div className={s.mobileBar}>
        <div className={s.mobileBarInner}>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={
              isLiked ? s.mobileBarBtnActive : s.mobileBarBtn
            }
          >
            <HeartIcon filled={isLiked} />
          </button>

          <button
            className={s.mobileBarShare}
            onClick={() => setShowShareModal(true)}
          >
            <ShareIcon />
            Partager
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={
              isBookmarked ? s.mobileBarBtnActive : s.mobileBarBtn
            }
          >
            <BookmarkIcon filled={isBookmarked} />
          </button>
        </div>
      </div>

      {/* ═══ Share modal ═══ */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={s.shareOverlay}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={s.shareModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={s.shareModalHead}>
                <h3 className={s.shareModalTitle}>Partager</h3>
                <button
                  className={s.shareModalClose}
                  onClick={() => setShowShareModal(false)}
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
              <div className={s.shareModalGrid}>
                {shareButtons.map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => handleShare(btn.id)}
                    className={s.shareModalBtn}
                  >
                    <btn.icon />
                    <span className={s.shareModalLabel}>
                      {btn.label}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => handleShare("copy")}
                  className={s.shareModalBtn}
                >
                  {copySuccess ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                  )}
                  <span className={s.shareModalLabel}>
                    {copySuccess ? "Copié" : "Lien"}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollToTopV2 />
    </div>
  );
}
