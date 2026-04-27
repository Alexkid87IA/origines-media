import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { sanityFetch } from "@/lib/sanity";
import { smartExcerpt, estimateReadingTimeFromText } from "@/lib/typography";
import { UNIVERS, UNIVERS_MAP, type UniversId } from "@/data/univers";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import s from "./SousTopicPage.module.css";

interface Article {
  _id: string;
  titre: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  imageUrl: string;
  slug: string;
  datePublication: string;
  tempsLecture?: number;
  vues?: number;
  univpilar?: string;
  soustopic?: string;
  category?: string;
  typeArticle?: string;
  rubrique?: string;
  videoUrl?: string;
  authorName?: string;
}

type ContentFilter = "all" | "articles" | "videos";

const ITEMS_PER_PAGE = 12;

function getExtrait(a: Article): string {
  if (a.extrait) return a.extrait;
  if (a.description) return a.description;
  if (a.contenuTexte) return smartExcerpt(a.contenuTexte, 160);
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

const SLUG_ALIASES: Record<string, string[]> = {
  "bien-etre": ["bien-etre", "bien-etre-physique"],
  "recits-voyage": ["recits-voyage", "recits-de-voyage"],
  "ia": ["ia", "intelligence-artificielle"],
};

function buildQuery(soustopic: string): string {
  const aliases = SLUG_ALIASES[soustopic];
  const filter = aliases
    ? `soustopic in [${aliases.map((a) => `"${a}"`).join(", ")}]`
    : `soustopic == "${soustopic}"`;
  return `
    *[_type == "production" && ${filter} && defined(slug.current)] | order(datePublication desc) {
      _id, titre, extrait, description,
      "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
      "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
      "slug": slug.current,
      datePublication, tempsLecture,
      "vues": coalesce(vues, 0),
      univpilar, soustopic, category,
      typeArticle, rubrique, videoUrl,
      "authorName": author->name
    }
  `;
}

function isVideo(a: Article): boolean {
  return a.typeArticle === "video" || a.rubrique === "videos" || !!a.videoUrl;
}

function contentUrl(a: Article): string {
  return isVideo(a) ? `/video/${a.slug}` : `/article/${a.slug}`;
}

export default function SousTopicPage() {
  const { universId, soustopic } = useParams<{
    universId: string;
    soustopic: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [sortBy, setSortBy] = useState(searchParams.get("tri") || "recent");
  const [contentFilter, setContentFilter] = useState<ContentFilter>("all");

  const univers = universId && universId in UNIVERS_MAP
    ? UNIVERS_MAP[universId as UniversId]
    : null;

  const subtopic = univers?.subtopics.find((st) => st.slug === soustopic);
  const allSubtopics = univers?.subtopics || [];

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  useEffect(() => {
    if (!soustopic) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await sanityFetch<Article[]>(buildQuery(soustopic));
        setArticles(data || []);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [soustopic]);

  const videoCount = useMemo(() => articles.filter(isVideo).length, [articles]);
  const articleCount = useMemo(() => articles.filter((a) => !isVideo(a)).length, [articles]);

  const filteredArticles = useMemo(() => {
    if (contentFilter === "videos") return articles.filter(isVideo);
    if (contentFilter === "articles") return articles.filter((a) => !isVideo(a));
    return articles;
  }, [articles, contentFilter]);

  const sortedArticles = useMemo(() => {
    const result = [...filteredArticles];
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
  }, [filteredArticles, sortBy]);

  const totalPages = Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedArticles, currentPage]);

  const handleContentFilterChange = useCallback(
    (filter: ContentFilter) => {
      setContentFilter(filter);
      const p = new URLSearchParams(searchParams);
      p.delete("page");
      setSearchParams(p);
    },
    [searchParams, setSearchParams]
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

  if (!univers || !subtopic) {
    return (
      <>
        <SiteHeader />
        <main className={s.page}>
          <div className="v2-container">
            <div className={s.empty}>
              <h2 className={s.emptyTitle}>Page introuvable</h2>
              <p className={s.emptyText}>
                Ce sous-topic n&rsquo;existe pas.
              </p>
              <Link to="/univers" className={s.emptyCta}>
                Voir les univers &rarr;
              </Link>
            </div>
          </div>
        </main>
        <Footer2 />
      </>
    );
  }

  const color = univers.color;

  return (
    <>
      <SEO
        title={`${subtopic.label} — ${univers.name} · Origines Media`}
        description={
          subtopic.description
            ? `${subtopic.description}${articles.length > 0 ? ` ${articles.length} articles et vidéos sur Origines Media.` : ""}`
            : `Tous nos articles sur ${subtopic.label.toLowerCase()} dans l'univers ${univers.name}. ${articles.length} publications pour explorer le sujet en profondeur.`
        }
        url={`/univers/${univers.id}/${subtopic.slug}`}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Univers", url: "/univers" },
          { name: univers.name, url: `/univers/${univers.id}` },
          { name: subtopic.label, url: `/univers/${univers.id}/${subtopic.slug}` },
        ]}
        itemListData={articles.filter((a) => a.imageUrl).slice(0, 10).map((a) => ({
          name: a.titre,
          description: getExtrait(a),
          image: a.imageUrl,
          url: `/article/${a.slug}`,
        }))}
        faqData={subtopic.faq}
      />
      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          {/* Hero */}
          <header
            className={s.hero}
            style={{ "--topic-color": color } as React.CSSProperties}
          >
            <nav className={s.breadcrumb} aria-label="Fil d'Ariane">
              <Link to="/univers" className={s.breadcrumbLink}>
                Univers
              </Link>
              <span className={s.breadcrumbSep}>/</span>
              <Link
                to={`/univers/${univers.id}`}
                className={s.breadcrumbLink}
                style={{ color }}
              >
                {univers.name}
              </Link>
              <span className={s.breadcrumbSep}>/</span>
              <span className={s.breadcrumbCurrent}>{subtopic.label}</span>
            </nav>

            <div className={s.heroContent}>
              <span className={s.heroKicker}>
                <span
                  className={s.heroKickerDot}
                  style={{ background: color }}
                  aria-hidden="true"
                />
                {univers.name}
              </span>
              <h1 className={s.heroTitle}>{subtopic.label}</h1>
              {!loading && (
                <p className={s.heroDeck}>
                  {articleCount} article{articleCount !== 1 ? "s" : ""}
                  {videoCount > 0 && <> &middot; {videoCount} vid&eacute;o{videoCount !== 1 ? "s" : ""}</>}
                </p>
              )}
              {subtopic.description && (
                <p className={s.heroDescription}>{subtopic.description}</p>
              )}
            </div>

            <div className={s.heroAccent} style={{ background: color }} />
          </header>

          {/* Sous-topics navigation */}
          <nav className={s.topicNav} aria-label="Sous-topics">
            {allSubtopics.map((st) => (
              <Link
                key={st.slug}
                to={`/univers/${univers.id}/${st.slug}`}
                className={`${s.topicChip} ${st.slug === soustopic ? s.topicChipActive : ""}`}
                style={
                  st.slug === soustopic
                    ? ({ "--topic-color": color } as React.CSSProperties)
                    : undefined
                }
              >
                {st.label}
              </Link>
            ))}
          </nav>

          {/* Toolbar */}
          <div className={s.toolbar}>
            <div className={s.toolbarLeft}>
              <div className={s.contentFilters}>
                <button
                  className={`${s.contentFilterBtn} ${contentFilter === "all" ? s.contentFilterBtnActive : ""}`}
                  onClick={() => handleContentFilterChange("all")}
                >
                  Tout <span className={s.contentFilterCount}>{articles.length}</span>
                </button>
                <button
                  className={`${s.contentFilterBtn} ${contentFilter === "articles" ? s.contentFilterBtnActive : ""}`}
                  onClick={() => handleContentFilterChange("articles")}
                >
                  Articles <span className={s.contentFilterCount}>{articleCount}</span>
                </button>
                {videoCount > 0 && (
                  <button
                    className={`${s.contentFilterBtn} ${contentFilter === "videos" ? s.contentFilterBtnActive : ""}`}
                    onClick={() => handleContentFilterChange("videos")}
                  >
                    Vid&eacute;os <span className={s.contentFilterCount}>{videoCount}</span>
                  </button>
                )}
              </div>
            </div>
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
              <svg
                className={s.sortChevron}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                width="12"
                height="12"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </div>
          </div>

          {/* Content */}
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
                {paginatedArticles.map((article) => (
                  <article
                    key={article._id}
                    className={s.card}
                    style={{ "--cat-color": color } as React.CSSProperties}
                  >
                    <a
                      href={contentUrl(article)}
                      className={s.cardLink}
                    >
                      <div className={s.cardImgWrap}>
                        <img
                          src={article.imageUrl || "/placeholder.svg"}
                          alt={article.titre}
                          className={s.cardImg}
                          loading="lazy"
                          decoding="async"
                        />
                        {isVideo(article) && (
                          <span className={s.cardPlayBadge} aria-label="Vidéo">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="6 3 20 12 6 21" /></svg>
                          </span>
                        )}
                      </div>
                      <div className={s.cardBody}>
                        <div className={s.cardMeta}>
                          <span
                            className={s.cardDot}
                            style={{ background: color }}
                            aria-hidden="true"
                          />
                          <span
                            className={s.cardCategory}
                            style={{ color }}
                          >
                            {subtopic.label}
                          </span>
                          {(estimateReadingTimeFromText(article.contenuTexte) || article.tempsLecture) && (
                            <>
                              <span className={s.cardSep}>&middot;</span>
                              <span className={s.cardTime}>
                                {estimateReadingTimeFromText(article.contenuTexte) || article.tempsLecture} min
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className={s.cardTitle}>{article.titre}</h3>
                        <p className={s.cardExcerpt}>
                          {getExtrait(article)}
                        </p>
                        <div className={s.cardFoot}>
                          <span className={s.cardAuthor}>
                            {article.authorName || "Rédaction Origines"}
                          </span>
                          {article.datePublication && (
                            <>
                              <span className={s.cardSep}>&middot;</span>
                              <time
                                className={s.cardDate}
                                dateTime={article.datePublication}
                              >
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
                            univers={univers.name}
                          />
                          <span className={s.cardCta}>{isVideo(article) ? "Voir" : "Lire"} &rarr;</span>
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className={s.pagination} aria-label="Pagination">
                  <button
                    className={s.pageBtn}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    &larr; Pr&eacute;c.
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
                              className={`${s.pageNum} ${page === currentPage ? s.pageNumActive : ""}`}
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
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Suiv. &rarr;
                  </button>
                </nav>
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
                Aucun article pour l&rsquo;instant
              </h3>
              <p className={s.emptyText}>
                Nous n&rsquo;avons pas encore d&rsquo;articles sur{" "}
                {subtopic.label.toLowerCase()}. Explorez les autres
                th&eacute;matiques.
              </p>
              <Link
                to={`/univers/${univers.id}`}
                className={s.emptyCta}
              >
                Retour &agrave; {univers.name} &rarr;
              </Link>
            </div>
          )}

          {/* FAQ */}
          {subtopic.faq && subtopic.faq.length > 0 && (
            <section className={s.faqSection}>
              <h2 className={s.faqTitle}>Questions fr&eacute;quentes</h2>
              <div className={s.faqList}>
                {subtopic.faq.map((item, i) => (
                  <details key={i} className={s.faqItem}>
                    <summary className={s.faqQuestion}>{item.question}</summary>
                    <p className={s.faqAnswer}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related topics */}
          {subtopic.related && subtopic.related.length > 0 && (
            <section className={s.relatedSection}>
              <h2 className={s.relatedTitle}>Th&egrave;mes proches</h2>
              <div className={s.relatedGrid}>
                {subtopic.related.map((slug) => {
                  const rel = UNIVERS.flatMap((u) =>
                    u.subtopics.map((st) => ({ ...st, univers: u }))
                  ).find((st) => st.slug === slug);
                  if (!rel) return null;
                  return (
                    <Link
                      key={slug}
                      to={`/univers/${rel.univers.id}/${slug}`}
                      className={s.relatedCard}
                      style={{ "--rel-color": rel.univers.color } as React.CSSProperties}
                    >
                      <span className={s.relatedCardDot} style={{ background: rel.univers.color }} />
                      <div>
                        <span className={s.relatedCardLabel}>{rel.label}</span>
                        <span className={s.relatedCardUnivers}>{rel.univers.name}</span>
                      </div>
                      <span className={s.relatedCardArrow}>&rarr;</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
