import { useState, useEffect, useMemo, useCallback } from "react";
import SEO from "@/components/SEO";
import { useSearchParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { sanityFetch } from "@/lib/sanity";
import { smartExcerpt } from "@/lib/typography";
import { UNIVERS, UNIVERS_MAP, type UniversId } from "@/data/univers";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import s from "./ArticlesPageV2.module.css";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Article {
  _id: string;
  titre: string;
  typeArticle: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  imageUrl: string;
  slug: string;
  datePublication: string;
  tempsLecture?: number;
  vues?: number;
  tags?: unknown[];
  univpilar?: string;
  category?: string;
  verticaleNom?: string;
  authorName?: string;
}

/* ------------------------------------------------------------------ */
/*  Query                                                              */
/* ------------------------------------------------------------------ */

const ARTICLES_V2_QUERY = `
  *[_type == "production" && coalesce(typeArticle, "article") in ["article", "actu", "guide", "interview"]] | order(datePublication desc) {
    _id,
    titre,
    typeArticle,
    extrait,
    description,
    "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    "slug": slug.current,
    datePublication,
    tempsLecture,
    "vues": coalesce(stats.views, views, vues, 0),
    tags,
    univpilar,
    category,
    "verticaleNom": verticale->nom,
    "authorName": author->name
  }
`;

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ITEMS_PER_PAGE = 12;

const UNIVERS_COLORS: Record<string, string> = {
  esprit: "#7B5CD6",
  corps: "#5AA352",
  liens: "#E67839",
  monde: "#2E9B74",
  avenir: "#2E94B5",
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function tagToString(tag: unknown): string | null {
  if (typeof tag === "string") return tag;
  if (typeof tag === "object" && tag !== null) {
    const obj = tag as Record<string, unknown>;
    if (typeof obj.label === "string") return obj.label;
    if (typeof obj.title === "string") return obj.title;
    if (typeof obj.nom === "string") return obj.nom;
  }
  return null;
}

function getExtrait(a: Article): string {
  if (a.extrait) return a.extrait;
  if (a.description) return a.description;
  if (a.contenuTexte) {
    return smartExcerpt(a.contenuTexte, 160);
  }
  return "";
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ArticlesPageV2() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  const searchQuery = searchParams.get("q") || "";
  const activeUnivers = searchParams.get("univers") || "";
  const activeCategory = searchParams.get("category") || "";
  const activeTag = searchParams.get("tag") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [sortBy, setSortBy] = useState(searchParams.get("tri") || "recent");
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await sanityFetch<Article[]>(ARTICLES_V2_QUERY);
        setArticles(data || []);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  /* ── Univers counts ── */
  const universCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    UNIVERS.forEach((u) => {
      counts[u.id] = articles.filter((a) => a.univpilar === u.id).length;
    });
    return counts;
  }, [articles]);

  /* ── Tag cloud ── */
  const tagCloud = useMemo(() => {
    const tagMap: Record<string, number> = {};
    articles.forEach((a) => {
      a.tags?.forEach((tag: unknown) => {
        const str = tagToString(tag);
        if (str) {
          const normalized = str.toLowerCase().trim();
          tagMap[normalized] = (tagMap[normalized] || 0) + 1;
        }
      });
    });
    return Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  const visibleTags = showAllTags ? tagCloud : tagCloud.slice(0, 20);

  /* ── Filter + Sort ── */
  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.titre?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.verticaleNom?.toLowerCase().includes(q) ||
          a.tags?.some((tag) => tagToString(tag)?.toLowerCase().includes(q))
      );
    }

    if (activeUnivers) {
      result = result.filter((a) => a.univpilar === activeUnivers);
    }

    if (activeCategory) {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (activeTag) {
      const tagLower = activeTag.toLowerCase();
      result = result.filter(
        (a) => a.tags?.some((t) => tagToString(t)?.toLowerCase() === tagLower)
      );
    }

    if (sortBy === "recent") {
      result.sort(
        (a, b) =>
          new Date(b.datePublication || "").getTime() -
          new Date(a.datePublication || "").getTime()
      );
    } else if (sortBy === "alpha") {
      result.sort((a, b) => (a.titre || "").localeCompare(b.titre || "", "fr"));
    } else if (sortBy === "popular") {
      result.sort((a, b) => (b.vues || 0) - (a.vues || 0));
    }

    return result;
  }, [articles, searchQuery, activeUnivers, activeCategory, activeTag, sortBy]);

  /* ── Pagination ── */
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

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

  const handleUniversClick = useCallback(
    (id: string) => {
      const p = new URLSearchParams(searchParams);
      if (activeUnivers === id) p.delete("univers");
      else p.set("univers", id);
      p.set("page", "1");
      setSearchParams(p);
    },
    [activeUnivers, searchParams, setSearchParams]
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      const p = new URLSearchParams(searchParams);
      if (activeTag.toLowerCase() === tag.toLowerCase()) p.delete("tag");
      else p.set("tag", tag);
      p.set("page", "1");
      setSearchParams(p);
    },
    [activeTag, searchParams, setSearchParams]
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
      p.set("page", page.toString());
      setSearchParams(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSortBy("recent");
    setSearchParams({});
    setSearchInput("");
  }, [setSearchParams]);

  const hasActiveFilters = searchQuery || activeUnivers || activeTag;

  /* ── Render ── */
  return (
    <>
      <SEO
        title="Articles — Psychologie, santé, relations, culture, avenir"
        description="Explorez tous les articles Origines Media par univers et thématique. Psychologie, bien-être, relations, culture et avenir — filtrez, triez, trouvez ce qui vous parle."
        url="/articles"
      />
      <SiteHeader />
      <main id="main" role="main">
        <div className="v2-container">
          <section className={s.page}>
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Biblioth&egrave;que</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Articles</span>
            </div>

            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} aria-hidden="true" />
                  Articles &middot; {articles.length} publications
                </span>
                <h1 className={s.sectionTitle}>
                  Tous nos <em>articles.</em>
                </h1>
                <p className={s.sectionDeck}>
                  Explorez par univers ou par th&eacute;matique. Filtrez, triez,
                  trouvez ce qui vous parle.
                </p>
              </div>
            </header>

            {/* Toolbar */}
            <div className={s.toolbar}>
              <form onSubmit={handleSearch} className={s.searchWrap}>
                <svg className={s.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher un article…"
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
                <select
                  className={s.sortSelect}
                  value={sortBy}
                  onChange={handleSortChange}
                  aria-label="Trier par"
                >
                  <option value="recent">Plus r&eacute;cents</option>
                  <option value="popular">Populaires</option>
                  <option value="alpha">A &rarr; Z</option>
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
                {activeTag && (
                  <button
                    className={s.activeChip}
                    style={{ "--chip-color": "#7B5CD6" } as React.CSSProperties}
                    onClick={() => handleTagClick(activeTag)}
                  >
                    {activeTag}
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

            {/* Mobile filter drawer */}
            {showMobileFilters && (
              <div className={s.mobileFilterDrawer} style={{ display: "block" }}>
                <div className={s.filterGroup}>
                  <h3 className={`${s.filterGroupTitle} mono`}>Univers</h3>
                  <div className={s.filterList}>
                    <button
                      className={`${s.filterBtn} ${!activeUnivers ? s.filterBtnActive : ""}`}
                      onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                    >
                      <span className={s.filterDot} />
                      Tous les articles
                      <span className={s.filterCount}>{articles.length}</span>
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
                <div className={s.filterGroup}>
                  <h3 className={`${s.filterGroupTitle} mono`}>Th&eacute;matiques</h3>
                  <div className={s.tagCloud}>
                    {tagCloud.slice(0, 15).map(({ tag, count }) => (
                      <button
                        key={tag}
                        className={`${s.tagChip} ${activeTag.toLowerCase() === tag ? s.tagChipActive : ""}`}
                        onClick={() => { handleTagClick(tag); setShowMobileFilters(false); }}
                      >
                        {tag} <span className={s.tagChipCount}>{count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Layout: sidebar + grid */}
            <div className={s.layout}>
              {/* Sidebar — desktop */}
              <aside className={s.sidebar}>
                {/* Univers filter */}
                <div className={s.filterGroup}>
                  <h3 className={`${s.filterGroupTitle} mono`}>Univers</h3>
                  <div className={s.filterList}>
                    <button
                      className={`${s.filterBtn} ${!activeUnivers && !activeTag ? s.filterBtnActive : ""}`}
                      onClick={clearFilters}
                    >
                      <span className={s.filterDot} />
                      Tous les articles
                      <span className={s.filterCount}>{articles.length}</span>
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

                {/* Tag cloud */}
                <div className={s.filterGroup}>
                  <h3 className={`${s.filterGroupTitle} mono`}>Th&eacute;matiques</h3>
                  <div className={s.tagCloud}>
                    {visibleTags.map(({ tag, count }) => (
                      <button
                        key={tag}
                        className={`${s.tagChip} ${activeTag.toLowerCase() === tag ? s.tagChipActive : ""}`}
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag} <span className={s.tagChipCount}>{count}</span>
                      </button>
                    ))}
                  </div>
                  {tagCloud.length > 20 && (
                    <button
                      className={s.showMoreTags}
                      onClick={() => setShowAllTags((v) => !v)}
                    >
                      {showAllTags ? "Voir moins" : `Voir tout (${tagCloud.length})`}
                    </button>
                  )}
                </div>
              </aside>

              {/* Content */}
              <div className={s.content}>
                <div className={s.resultBar}>
                  <span className={`${s.resultCount} mono`}>
                    {filteredArticles.length} article
                    {filteredArticles.length > 1 ? "s" : ""}
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
                ) : paginatedArticles.length > 0 ? (
                  <>
                    <div className={s.grid}>
                      {paginatedArticles.map((article) => {
                        const uid = (article.univpilar || "esprit") as UniversId;
                        const uData = UNIVERS_MAP[uid] || UNIVERS_MAP.esprit;
                        const categoryLabel = uData.name;

                        return (
                          <article
                            key={article._id}
                            className={s.card}
                            style={{ "--cat-color": uData.color } as React.CSSProperties}
                          >
                            <a href={`/article/${article.slug}`} className={s.cardLink}>
                              <div className={s.cardImgWrap}>
                                <img
                                  src={article.imageUrl || "/placeholder.svg"}
                                  alt={article.titre}
                                  className={s.cardImg}
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                              <div className={s.cardBody}>
                                <div className={s.cardMeta}>
                                  <span className={s.cardDot} aria-hidden="true" />
                                  <span className={s.cardCategory} style={{ color: uData.color }}>
                                    {categoryLabel}
                                  </span>
                                  {article.tempsLecture && (
                                    <>
                                      <span className={s.cardSep}>&middot;</span>
                                      <span className={s.cardTime}>{article.tempsLecture} min</span>
                                    </>
                                  )}
                                </div>
                                <h3 className={s.cardTitle}>{article.titre}</h3>
                                <p className={s.cardExcerpt}>{getExtrait(article)}</p>
                                <div className={s.cardFoot}>
                                  <span className={s.cardAuthor}>
                                    {article.authorName || "Rédaction Origines"}
                                  </span>
                                  {article.datePublication && (
                                    <>
                                      <span className={s.cardSep}>&middot;</span>
                                      <time className={s.cardDate} dateTime={article.datePublication}>
                                        {formatDate(article.datePublication)}
                                      </time>
                                    </>
                                  )}
                                  <SaveBookmark
                                    inline
                                    type="article"
                                    slug={article.slug}
                                    title={article.titre}
                                    image={article.imageUrl}
                                    univers={categoryLabel}
                                  />
                                  <span className={s.cardCta}>Lire &rarr;</span>
                                </div>
                              </div>
                            </a>
                          </article>
                        );
                      })}
                    </div>

                    {totalPages > 1 && (
                      <nav className={s.pagination} aria-label="Pagination">
                        <button
                          className={s.pageBtn}
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          &larr; Pr&eacute;c&eacute;dent
                        </button>
                        <div className={s.pageNums}>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
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
                ) : (
                  <div className={s.empty}>
                    <svg className={s.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <h3 className={s.emptyTitle}>Aucun article trouv&eacute;</h3>
                    <p className={s.emptyText}>
                      {searchQuery
                        ? `Aucun résultat pour « ${searchQuery} »`
                        : "Essayez de modifier vos filtres."}
                    </p>
                    <button className={s.emptyCta} onClick={clearFilters}>
                      Voir tous les articles &rarr;
                    </button>
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
