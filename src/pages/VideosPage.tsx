import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import { sanityFetch } from "@/lib/sanity";
import { typo } from "@/lib/typography";
import { UNIVERS, UNIVERS_MAP, type UniversId } from "@/data/univers";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import Breadcrumb from "@/components/ui/Breadcrumb";
import s from "./VideosPage.module.css";

const VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video"] | order(datePublication desc) {
    _id,
    titre,
    "slug": slug.current,
    description,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    videoUrl,
    "duree": tempsLecture,
    datePublication,
    "verticale": verticale->{ titre, slug, couleur },
    "vues": coalesce(vues, 0),
    univpilar,
    "authorName": author->name
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
  verticale?: { titre: string; slug: string; couleur: string };
  vues: number;
  univpilar?: string;
  authorName?: string;
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

function getThumb(v: Video): string {
  return v.imageUrl || getYouTubeThumbnail(v.videoUrl);
}

function formatDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

const VIDEOS_PER_PAGE = 12;

const UNIVERS_COLORS: Record<string, string> = {
  esprit: "#7B5CD6",
  corps: "#5AA352",
  liens: "#E67839",
  monde: "#2E9B74",
  avenir: "#2E94B5",
};

/* ── Video card ── */

const VideoCard = memo(function VideoCard({ video }: { video: Video }) {
  const thumb = getThumb(video);
  const uid = (video.univpilar || "esprit") as UniversId;
  const uData = UNIVERS_MAP[uid] || UNIVERS_MAP.esprit;

  return (
    <article className={s.card} style={{ "--cat-color": uData.color } as React.CSSProperties}>
      <Link to={`/video/${video.slug}`} className={s.cardLink}>
        <div className={s.cardThumb}>
          <img
            src={thumb}
            alt={video.titre}
            loading="lazy"
            decoding="async"
            className={s.cardImg}
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
          />
          <SaveBookmark type="video" slug={video.slug} title={video.titre} image={thumb} />
          <span className={s.cardOverlay} />
          <div className={s.cardPlay}>
            <span className={s.playCircle}>
              <svg viewBox="0 0 24 24" fill="currentColor" className={s.playIcon}>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
          </div>
          {video.duree > 0 && (
            <span className={s.cardDuration}>{video.duree} min</span>
          )}
        </div>
        <div className={s.cardBody}>
          <div className={s.cardMeta}>
            <span className={s.cardDot} />
            <span className={s.cardCategory} style={{ color: uData.color }}>{uData.name}</span>
            {video.datePublication && (
              <>
                <span className={s.cardSep}>&middot;</span>
                <time className={s.cardDate} dateTime={video.datePublication}>{formatDate(video.datePublication)}</time>
              </>
            )}
          </div>
          <h3 className={s.cardTitle}>{typo(video.titre)}</h3>
          {video.description && (
            <p className={s.cardExcerpt}>{video.description}</p>
          )}
          <div className={s.cardFoot}>
            <span className={s.cardAuthor}>{video.authorName || "Rédaction Origines"}</span>
            <span className={s.cardCta}>Regarder &rarr;</span>
          </div>
        </div>
      </Link>
    </article>
  );
});

/* ── Page ── */

export default function VideosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const searchQuery = searchParams.get("q") || "";
  const activeUnivers = searchParams.get("univers") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [sortBy, setSortBy] = useState(searchParams.get("tri") || "recent");
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => { document.body.style.background = ""; document.body.style.color = ""; };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await sanityFetch<Video[]>(VIDEOS_QUERY);
        setVideos(data || []);
      } catch {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => { setSearchInput(searchQuery); }, [searchQuery]);

  /* ── Univers counts ── */
  const universCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    UNIVERS.forEach((u) => {
      counts[u.id] = videos.filter((v) => v.univpilar === u.id).length;
    });
    return counts;
  }, [videos]);

  /* ── Filter + Sort ── */
  const filteredVideos = useMemo(() => {
    let result = [...videos];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) => v.titre?.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q)
      );
    }
    if (activeUnivers) {
      result = result.filter((v) => v.univpilar === activeUnivers);
    }
    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.datePublication || "").getTime() - new Date(a.datePublication || "").getTime());
    } else if (sortBy === "popular") {
      result.sort((a, b) => (b.vues || 0) - (a.vues || 0));
    }
    return result;
  }, [videos, searchQuery, activeUnivers, sortBy]);

  /* ── Featured ── */
  const showFeatured = currentPage === 1 && !searchQuery && !activeUnivers;
  const featuredVideo = showFeatured ? filteredVideos.find(v => v.imageUrl || v.videoUrl) : undefined;

  const gridVideos = useMemo(() => {
    if (!featuredVideo) return filteredVideos;
    return filteredVideos.filter(v => v._id !== featuredVideo._id);
  }, [filteredVideos, featuredVideo]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(gridVideos.length / VIDEOS_PER_PAGE);
  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * VIDEOS_PER_PAGE;
    return gridVideos.slice(start, start + VIDEOS_PER_PAGE);
  }, [gridVideos, currentPage]);

  const hasActiveFilters = searchQuery || activeUnivers;

  /* ── Handlers ── */
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (searchInput) p.set("q", searchInput); else p.delete("q");
    p.set("page", "1");
    setSearchParams(p);
  }, [searchInput, searchParams, setSearchParams]);

  const handleUniversClick = useCallback((id: string) => {
    const p = new URLSearchParams(searchParams);
    if (activeUnivers === id) p.delete("univers"); else p.set("univers", id);
    p.set("page", "1");
    setSearchParams(p);
  }, [activeUnivers, searchParams, setSearchParams]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortBy(val);
    const p = new URLSearchParams(searchParams);
    if (val === "recent") p.delete("tri"); else p.set("tri", val);
    p.delete("page");
    setSearchParams(p);
  }, [searchParams, setSearchParams]);

  const handlePageChange = useCallback((page: number) => {
    const p = new URLSearchParams(searchParams);
    p.set("page", page.toString());
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSortBy("recent");
    setSearchParams({});
    setSearchInput("");
  }, [setSearchParams]);

  return (
    <>
      <SEO
        title="Vidéos — Documentaires, reportages et témoignages"
        description={`${videos.length} vidéos Origines Media : documentaires, reportages et témoignages sur la psychologie, les relations, la culture et l'avenir. Regardez ce qui compte.`}
        url="/videos"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Vidéos", url: "/videos" },
        ]}
        itemListData={filteredVideos.slice(0, 10).map((v) => ({
          name: v.titre,
          description: v.description,
          image: v.imageUrl,
          url: `/video/${v.slug}`,
        }))}
      />
      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          <Breadcrumb items={[
            { name: "Accueil", url: "/" },
            { name: "Vidéos", url: "/videos" },
          ]} />

          <section className={s.page}>
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Biblioth&egrave;que</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Vid&eacute;os</span>
            </div>

            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} aria-hidden="true" />
                  Vid&eacute;os &middot; {videos.length} publications
                </span>
                <h1 className={s.sectionTitle}>
                  Toutes nos <em>vid&eacute;os.</em>
                </h1>
                <p className={s.sectionDeck}>
                  Documentaires, reportages, t&eacute;moignages : nos vid&eacute;os
                  racontent ce que les mots seuls ne peuvent pas dire.
                </p>
              </div>
            </header>

            {/* À la une */}
            {featuredVideo && (() => {
              const thumb = getThumb(featuredVideo);
              const uid = (featuredVideo.univpilar || "esprit") as UniversId;
              const uData = UNIVERS_MAP[uid] || UNIVERS_MAP.esprit;
              return (
                <section className={s.featured}>
                  <Link to={`/video/${featuredVideo.slug}`} className={s.featuredLink}>
                    <div className={s.featuredImgWrap}>
                      <img src={thumb} alt={featuredVideo.titre} className={s.featuredImg} loading="eager" decoding="async" />
                      <span className={s.featuredOverlay} />
                      <div className={s.featuredPlay}>
                        <span className={s.featuredPlayCircle}>
                          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </span>
                      </div>
                      {featuredVideo.duree > 0 && (
                        <span className={s.featuredDuration}>{featuredVideo.duree} min</span>
                      )}
                    </div>
                    <div className={s.featuredBody}>
                      <span className={s.featuredKicker}>
                        <span className={s.featuredKickerDot} style={{ background: uData.color }} />
                        &Agrave; la une &middot; {uData.name}
                      </span>
                      <h2 className={s.featuredTitle}>{typo(featuredVideo.titre)}</h2>
                      {featuredVideo.description && (
                        <p className={s.featuredExcerpt}>{featuredVideo.description}</p>
                      )}
                      <div className={s.featuredFoot}>
                        <div className={s.featuredMeta}>
                          <span>{featuredVideo.authorName || "Rédaction Origines"}</span>
                          {featuredVideo.datePublication && (
                            <>
                              <span className={s.featuredMetaSep}>&middot;</span>
                              <time dateTime={featuredVideo.datePublication}>{formatDate(featuredVideo.datePublication)}</time>
                            </>
                          )}
                        </div>
                        <span className={s.featuredCta}>Regarder &rarr;</span>
                      </div>
                    </div>
                  </Link>
                </section>
              );
            })()}

            {/* Toolbar */}
            <div className={s.toolbar}>
              <form onSubmit={handleSearch} className={s.searchWrap}>
                <svg className={s.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher une vidéo…"
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
                      p.delete("q"); p.set("page", "1");
                      setSearchParams(p);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </form>

              <button
                type="button"
                className={s.mobileFilterBtn}
                onClick={() => setShowMobileFilters((v) => !v)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                  <path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14h6M9 8h6M17 16h6" />
                </svg>
                Filtres
              </button>

              <div className={s.sortWrap}>
                <select className={s.sortSelect} value={sortBy} onChange={handleSortChange} aria-label="Trier par">
                  <option value="recent">Plus r&eacute;centes</option>
                  <option value="popular">Populaires</option>
                </select>
                <svg className={s.sortChevron} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12">
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className={s.activeFilters}>
                <span className={`${s.activeLabel} mono`}>Filtres :</span>
                {activeUnivers && UNIVERS_MAP[activeUnivers as UniversId] && (
                  <button
                    className={s.activeChip}
                    style={{ "--chip-color": UNIVERS_COLORS[activeUnivers] || "#7B5CD6" } as React.CSSProperties}
                    onClick={() => handleUniversClick(activeUnivers)}
                  >
                    <span className={s.activeChipDot} />
                    {UNIVERS_MAP[activeUnivers as UniversId].name}
                    <span className={s.activeChipX}>&times;</span>
                  </button>
                )}
                {searchQuery && (
                  <button className={s.activeChip} onClick={clearFilters}>
                    &laquo;&nbsp;{searchQuery}&nbsp;&raquo;
                    <span className={s.activeChipX}>&times;</span>
                  </button>
                )}
                <button className={s.clearAll} onClick={clearFilters}>Tout effacer</button>
              </div>
            )}

            {/* Mobile filter drawer */}
            {showMobileFilters && (
              <div className={s.mobileFilterDrawer}>
                <div className={s.filterGroup}>
                  <h3 className={`${s.filterGroupTitle} mono`}>Univers</h3>
                  <div className={s.filterList}>
                    <button
                      className={`${s.filterBtn} ${!activeUnivers ? s.filterBtnActive : ""}`}
                      onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                    >
                      <span className={s.filterDot} />
                      Toutes les vid&eacute;os
                      <span className={s.filterCount}>{videos.length}</span>
                    </button>
                    {UNIVERS.map((u) => {
                      const count = universCounts[u.id] || 0;
                      if (count === 0) return null;
                      return (
                        <button
                          key={u.id}
                          className={`${s.filterBtn} ${activeUnivers === u.id ? s.filterBtnActive : ""}`}
                          style={{ "--chip-color": u.color } as React.CSSProperties}
                          onClick={() => { handleUniversClick(u.id); setShowMobileFilters(false); }}
                        >
                          <span className={s.filterDot} />
                          {u.name}
                          <span className={s.filterCount}>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Layout: sidebar + grid */}
            <div className={s.layout}>
              <aside className={s.sidebar}>
                <div className={s.filterGroup}>
                  <h3 className={`${s.filterGroupTitle} mono`}>Univers</h3>
                  <div className={s.filterList}>
                    <button
                      className={`${s.filterBtn} ${!activeUnivers ? s.filterBtnActive : ""}`}
                      onClick={clearFilters}
                    >
                      <span className={s.filterDot} />
                      Toutes les vid&eacute;os
                      <span className={s.filterCount}>{videos.length}</span>
                    </button>
                    {UNIVERS.map((u) => {
                      const count = universCounts[u.id] || 0;
                      if (count === 0) return null;
                      return (
                        <button
                          key={u.id}
                          className={`${s.filterBtn} ${activeUnivers === u.id ? s.filterBtnActive : ""}`}
                          style={{ "--chip-color": u.color } as React.CSSProperties}
                          onClick={() => handleUniversClick(u.id)}
                        >
                          <span className={s.filterDot} />
                          {u.name}
                          <span className={s.filterCount}>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              <div className={s.content}>
                <div className={s.resultBar}>
                  <span className={`${s.resultCount} mono`}>
                    {filteredVideos.length} vid&eacute;o{filteredVideos.length > 1 ? "s" : ""}
                  </span>
                </div>

                {loading ? (
                  <div className={s.skeleton}>
                    {Array.from({ length: 6 }).map((_, i) => (
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
                ) : paginatedVideos.length > 0 ? (
                  <>
                    <div className={s.grid}>
                      {paginatedVideos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <nav className={s.pagination} aria-label="Pagination">
                        <button className={s.pageBtn} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                          &larr; Pr&eacute;c&eacute;dent
                        </button>
                        <div className={s.pageNums}>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                              return (
                                <button
                                  key={page}
                                  className={`${s.pageNum} ${page === currentPage ? s.pageNumActive : ""}`}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </button>
                              );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                              return <span key={page} className={s.pageEllipsis}>…</span>;
                            }
                            return null;
                          })}
                        </div>
                        <button className={s.pageBtn} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                          Suivant &rarr;
                        </button>
                      </nav>
                    )}
                  </>
                ) : (
                  <div className={s.empty}>
                    <svg className={s.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <h3 className={s.emptyTitle}>Aucune vid&eacute;o trouv&eacute;e</h3>
                    <p className={s.emptyText}>
                      {searchQuery ? `Aucun résultat pour « ${searchQuery} »` : "Essayez de modifier vos filtres."}
                    </p>
                    <button className={s.emptyCta} onClick={clearFilters}>Voir toutes les vid&eacute;os &rarr;</button>
                  </div>
                )}
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
