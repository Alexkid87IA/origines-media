import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import { sanityFetch } from "@/lib/sanity";
import { typo } from "@/lib/typography";
import s from "./VideosPage.module.css";

const VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video"] | order(datePublication desc) {
    _id,
    "titre": titre,
    "slug": slug.current,
    "description": description,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "videoUrl": videoUrl,
    "duree": tempsLecture,
    "datePublication": datePublication,
    "verticale": verticale->{ titre, slug, couleur },
    "vues": vues
  }
`;

interface Video {
  _id: string;
  titre: string;
  slug: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  duree: number;
  datePublication: string;
  verticale: { titre: string; slug: string; couleur: string };
  vues: number;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return m ? m[1] : null;
}

function getYouTubeThumbnail(url: string): string {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "/placeholder.svg";
}

const VIDEOS_PER_PAGE = 12;

const formatFilters = [
  { id: "all", label: "Tous les formats", color: "#6B6B6B" },
  { id: "reportages", label: "Reportages", color: "#0891B2" },
  { id: "temoignages", label: "Témoignages", color: "#7B5CD6" },
  { id: "youtube", label: "Concepts YouTube", color: "#FF0000" },
  { id: "shorts", label: "Shorts", color: "#F97316" },
  { id: "live", label: "Lives", color: "#EF4444" },
  { id: "vlogs", label: "Vlogs", color: "#5AA352" },
  { id: "decryptages", label: "Décryptages", color: "#2E94B5" },
  { id: "debats", label: "Débats", color: "#D64C90" },
  { id: "portraits", label: "Portraits", color: "#A855F7" },
  { id: "news", label: "News", color: "#6366F1" },
];

const sortOptions = [
  { id: "recent", label: "Plus récentes" },
  { id: "popular", label: "Plus populaires" },
];

/* ── Inline SVG icons ── */

function SearchSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function PlaySvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function ClockSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ChevronLeftSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function FilterSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" />
      <line x1="1" x2="7" y1="14" y2="14" />
      <line x1="9" x2="15" y1="8" y2="8" />
      <line x1="17" x2="23" y1="16" y2="16" />
    </svg>
  );
}

/* ── Video card ── */

const VideoCard = memo(function VideoCard({
  video,
  index,
}: {
  video: Video;
  index: number;
}) {
  const thumb = video.imageUrl || getYouTubeThumbnail(video.videoUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link to={`/video/${video.slug}`} className={s.card}>
        <div className={s.cardThumb}>
          <img
            src={thumb}
            alt={video.titre}
            loading="lazy"
            className={s.cardImg}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className={s.cardOverlay} />
          <div className={s.cardPlay}>
            <div className={s.playCircle}>
              <PlaySvg className={s.playIcon} />
            </div>
          </div>
          {video.duree > 0 && (
            <div className={s.cardDuration}>
              <ClockSvg className={s.durationIcon} />
              {video.duree} min
            </div>
          )}
        </div>
        <h3 className={s.cardTitle}>{typo(video.titre)}</h3>
      </Link>
    </motion.div>
  );
});

/* ── Page ── */

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFormat, setActiveFormat] = useState("all");
  const [activeSort, setActiveSort] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await sanityFetch(VIDEOS_QUERY);
        setVideos(data || []);
      } catch (err) {
        console.error("Erreur chargement vidéos:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredVideos = videos.filter((v) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return v.titre?.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q);
  });

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (activeSort === "popular") return (b.vues || 0) - (a.vues || 0);
    return new Date(b.datePublication || 0).getTime() - new Date(a.datePublication || 0).getTime();
  });

  const totalPages = Math.ceil(sortedVideos.length / VIDEOS_PER_PAGE);
  const start = (currentPage - 1) * VIDEOS_PER_PAGE;
  const paginatedVideos = sortedVideos.slice(start, start + VIDEOS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeFormat, activeSort]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [currentPage]);

  function getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "…", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages);
    }
    return pages;
  }

  return (
    <>
      <SEO
        title="Vidéos"
        description="Explorez notre collection de contenus vidéo inspirants. Documentaires, interviews et reportages sur des thématiques qui comptent."
        url="/videos"
      />
      <SiteHeader />

      <main className={s.page}>
        {/* Header */}
        <header className={s.header}>
          <div className={s.headerInner}>
            <span className={s.headerKicker}>Catalogue</span>
            <h1 className={s.headerTitle}>Vidéos</h1>
            {!loading && (
              <span className={s.headerCount}>
                {sortedVideos.length} vidéo{sortedVideos.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </header>

        <div className={s.container}>
          {/* Mobile toolbar */}
          <div className={s.mobileToolbar}>
            <div className={s.mobileSearch}>
              <SearchSvg className={s.mobileSearchIcon} />
              <input
                type="text"
                placeholder="Rechercher…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={s.mobileSearchInput}
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={s.mobileFilterBtn}
            >
              <FilterSvg className={s.filterIcon} />
              Filtres
            </button>
          </div>

          {/* Mobile filter panel */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div className={s.mobileFilterPanel}>
                  <div className={s.mobileFilterSection}>
                    <p className={s.mobileFilterLabel}>Format</p>
                    <div className={s.mobilePills}>
                      {formatFilters.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setActiveFormat(f.id);
                            setShowMobileFilters(false);
                          }}
                          className={`${s.mobilePill} ${activeFormat === f.id ? s.mobilePillActive : ""}`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={s.mobileFilterSection}>
                    <p className={s.mobileFilterLabel}>Trier par</p>
                    <div className={s.mobilePills}>
                      {sortOptions.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => {
                            setActiveSort(o.id);
                            setShowMobileFilters(false);
                          }}
                          className={`${s.mobilePill} ${activeSort === o.id ? s.mobilePillActive : ""}`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={s.layout}>
            {/* Sidebar */}
            <aside className={s.sidebar}>
              <div className={s.sidebarSticky}>
                {/* Search */}
                <div className={s.searchBox}>
                  <SearchSvg className={s.searchIcon} />
                  <input
                    type="text"
                    placeholder="Rechercher…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={s.searchInput}
                  />
                </div>

                {/* Formats */}
                <div>
                  <p className={s.filterLabel}>Format</p>
                  <div className={s.filterGroup}>
                    {formatFilters.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFormat(f.id)}
                        className={`${s.filterBtn} ${activeFormat === f.id ? s.filterBtnActive : ""}`}
                      >
                        <span
                          className={s.filterDot}
                          style={{ backgroundColor: f.color }}
                        />
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <p className={s.filterLabel}>Trier par</p>
                  <div className={s.filterGroup}>
                    {sortOptions.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setActiveSort(o.id)}
                        className={`${s.filterBtn} ${activeSort === o.id ? s.filterBtnActive : ""}`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div>
              {loading ? (
                <div className={s.skeletonGrid}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={s.skeletonCard}>
                      <div className={s.skeletonThumb} />
                      <div className={s.skeletonTitle} />
                      <div className={s.skeletonMeta} />
                    </div>
                  ))}
                </div>
              ) : sortedVideos.length === 0 ? (
                <div className={s.empty}>
                  <p className={s.emptyText}>Aucune vidéo trouvée</p>
                </div>
              ) : (
                <>
                  <div className={s.grid}>
                    {paginatedVideos.map((video, i) => (
                      <VideoCard key={video._id} video={video} index={i} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className={s.pagination}>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={s.pageBtn}
                      >
                        <ChevronLeftSvg className={s.pageArrow} />
                      </button>
                      {getPageNumbers().map((page, idx) => (
                        <button
                          key={idx}
                          onClick={() => typeof page === "number" && setCurrentPage(page)}
                          disabled={typeof page === "string"}
                          className={`${s.pageBtn} ${
                            page === currentPage
                              ? s.pageBtnActive
                              : typeof page === "string"
                              ? s.pageBtnEllipsis
                              : ""
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={s.pageBtn}
                      >
                        <ChevronRightSvg className={s.pageArrow} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
