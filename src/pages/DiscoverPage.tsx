import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { typo } from "../lib/typography";
import { sanityFetch } from "@/lib/sanity";
import { sanityImg } from "@/lib/sanityImage";
import { RT } from "@/lib/queries";
import { UNIVERS } from "@/data/univers";
import Breadcrumb from "@/components/ui/Breadcrumb";
import s from "./DiscoverPage.module.css";

interface Article {
  _id: string;
  titre: string;
  deck?: string;
  slug: string;
  datePublication: string;
  tempsLecture?: number;
  univpilar?: string;
  authorName?: string;
  imageUrl?: string;
}

const QUERY = `
  *[_type == "production" && typeArticle == "actu" && defined(image.asset) && defined(slug.current)] | order(datePublication desc) {
    _id,
    titre,
    deck,
    "slug": slug.current,
    datePublication,
    ${RT},
    univpilar,
    "authorName": author->name,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl)
  }
`;

const UNIVERS_COLORS: Record<string, string> = {
  esprit: "#7B5CD6",
  corps: "#5AA352",
  liens: "#E67839",
  monde: "#2E9B74",
  avenir: "#2E94B5",
};

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

function relativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 5) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `il y a ${diffD} j`;
  return formatDate(dateString);
}

function isoDate(dateString: string): string {
  return new Date(dateString).toISOString();
}

const ITEMS_PER_PAGE = 20;

export default function DiscoverPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUnivers, setActiveUnivers] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    sanityFetch<Article[]>(QUERY)
      .then((data) => setArticles(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const universCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    UNIVERS.forEach((u) => {
      counts[u.id] = articles.filter((a) => a.univpilar === u.id).length;
    });
    return counts;
  }, [articles]);

  const filtered = useMemo(() => {
    if (!activeUnivers) return articles;
    return articles.filter((a) => a.univpilar === activeUnivers);
  }, [articles, activeUnivers]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  const isFirstPage = page === 1;
  const featured = isFirstPage ? filtered[0] : undefined;
  const gridArticles = isFirstPage ? paginated.slice(1, 5) : [];
  const filArticles = isFirstPage ? paginated.slice(5) : paginated;

  const handleFilter = (id: string | null) => {
    setActiveUnivers(id);
    setPage(1);
  };

  const handlePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const universName = (id: string) =>
    UNIVERS.find((u) => u.id === id)?.name;

  return (
    <div className={s.page}>
      <SEO
        title="Discover — Le radar d'Origines Media"
        description="L'essentiel de l'actualité décrypté par Origines Media. Société, culture, psychologie, technologie — les sujets qui comptent, maintenant."
        url="/discover"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Discover", url: "/discover" },
        ]}
        itemListData={filtered.slice(0, 10).map((a) => ({
          name: a.titre,
          description: a.deck || "",
          image: a.imageUrl || "",
          url: `/article/${a.slug}`,
        }))}
      />
      <SiteHeader />

      <main>
        <div className="v2-container">
          <Breadcrumb
            items={[
              { name: "Accueil", url: "/" },
              { name: "Discover", url: "/discover" },
            ]}
          />

          {/* ── Header ── */}
          <header className={s.header}>
            <div className={s.titleRow}>
              <h1 className={s.pageTitle}>
                <span className={s.pulseDot} aria-hidden="true" />
                Discover
              </h1>
              <p className={s.subtitle}>Le radar d&rsquo;Origines Media</p>
            </div>

            <p className={s.headerMeta}>
              <strong>{articles.length}</strong> articles publi&eacute;s
            </p>

            <nav className={s.filters} aria-label="Filtrer par univers">
              <button
                className={`${s.filterBtn} ${!activeUnivers ? s.filterBtnActive : ""}`}
                onClick={() => handleFilter(null)}
                aria-pressed={!activeUnivers}
              >
                Tous
                <span className={s.filterCount}>{articles.length}</span>
              </button>
              {UNIVERS.map((u) => {
                const count = universCounts[u.id] || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={u.id}
                    className={`${s.filterBtn} ${activeUnivers === u.id ? s.filterBtnActive : ""}`}
                    style={{ "--filter-color": u.color } as React.CSSProperties}
                    onClick={() => handleFilter(u.id)}
                    aria-pressed={activeUnivers === u.id}
                  >
                    <span className={s.filterDot} style={{ background: u.color }} aria-hidden="true" />
                    {u.name}
                    <span className={s.filterCount}>{count}</span>
                  </button>
                );
              })}
            </nav>
          </header>

          <hr className={s.divider} />

          {/* ── Loading ── */}
          {loading && (
            <div className={s.loadingWrap} role="status" aria-label="Chargement des articles">
              <div className={s.spinner} />
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && filtered.length === 0 && (
            <div className={s.emptyState}>
              <p>Aucun article trouv&eacute; dans cette cat&eacute;gorie.</p>
            </div>
          )}

          {/* ── Featured article ── */}
          {!loading && featured && (
            <article className={s.featured} itemScope itemType="https://schema.org/NewsArticle">
              <Link to={`/article/${featured.slug}`} className={s.featuredLink}>
                <div className={s.featuredImgWrap}>
                  <img
                    src={sanityImg(featured.imageUrl, 1200)}
                    alt={featured.titre}
                    className={s.featuredImg}
                    loading="eager"
                    width={1200}
                    height={750}
                    itemProp="image"
                  />
                  {featured.univpilar && (
                    <span
                      className={s.badge}
                      style={{ backgroundColor: UNIVERS_COLORS[featured.univpilar] }}
                    >
                      {universName(featured.univpilar)}
                    </span>
                  )}
                </div>
                <div className={s.featuredBody}>
                  <div className={s.featuredMeta}>
                    <time dateTime={isoDate(featured.datePublication)} itemProp="datePublished">
                      {relativeTime(featured.datePublication)}
                    </time>
                    {featured.authorName && (
                      <>
                        <span className={s.dot} aria-hidden="true" />
                        <span itemProp="author">{featured.authorName}</span>
                      </>
                    )}
                    {featured.tempsLecture && (
                      <>
                        <span className={s.dot} aria-hidden="true" />
                        <span>{featured.tempsLecture} min de lecture</span>
                      </>
                    )}
                  </div>
                  <h2 className={s.featuredTitle} itemProp="headline">
                    {typo(featured.titre)}
                  </h2>
                  {featured.deck && (
                    <p className={s.featuredDeck} itemProp="description">
                      {typo(featured.deck)}
                    </p>
                  )}
                  <span className={s.readMore} aria-hidden="true">Lire l&rsquo;article &rarr;</span>
                </div>
              </Link>
            </article>
          )}

          {/* ── Grid "À la une" ── */}
          {!loading && gridArticles.length > 0 && (
            <section className={s.gridSection} aria-label="À la une">
              <h2 className={s.sectionLabel}>&Agrave; la une</h2>
              <div className={s.grid}>
                {gridArticles.map((a) => (
                  <article key={a._id} className={s.gridCard} itemScope itemType="https://schema.org/NewsArticle">
                    <Link to={`/article/${a.slug}`} className={s.gridCardLink}>
                      <div className={s.gridImgWrap}>
                        <img
                          src={sanityImg(a.imageUrl, 600)}
                          alt={a.titre}
                          className={s.gridImg}
                          loading="lazy"
                          decoding="async"
                          width={600}
                          height={375}
                          itemProp="image"
                        />
                        {a.univpilar && (
                          <span
                            className={s.badge}
                            style={{ backgroundColor: UNIVERS_COLORS[a.univpilar] }}
                          >
                            {universName(a.univpilar)}
                          </span>
                        )}
                      </div>
                      <div className={s.gridCardBody}>
                        <h3 className={s.gridCardTitle} itemProp="headline">
                          {typo(a.titre)}
                        </h3>
                        {a.deck && (
                          <p className={s.gridCardDeck} itemProp="description">
                            {typo(a.deck)}
                          </p>
                        )}
                        <footer className={s.gridCardMeta}>
                          <time dateTime={isoDate(a.datePublication)} itemProp="datePublished">
                            {relativeTime(a.datePublication)}
                          </time>
                          {a.authorName && (
                            <>
                              <span className={s.dot} aria-hidden="true" />
                              <span itemProp="author">{a.authorName}</span>
                            </>
                          )}
                          {a.tempsLecture && (
                            <>
                              <span className={s.dot} aria-hidden="true" />
                              <span>{a.tempsLecture} min</span>
                            </>
                          )}
                        </footer>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── Fil (dense list) ── */}
          {!loading && filArticles.length > 0 && (
            <section className={s.filSection} aria-label="Tous les articles">
              <h2 className={s.sectionLabel}>Fil</h2>
              <div className={s.filList}>
                {filArticles.map((a) => (
                  <article key={a._id} className={s.filRow} itemScope itemType="https://schema.org/NewsArticle">
                    <Link to={`/article/${a.slug}`} className={s.filLink}>
                      <div className={s.filThumb}>
                        <img
                          src={sanityImg(a.imageUrl, 160)}
                          alt=""
                          className={s.filThumbImg}
                          loading="lazy"
                          decoding="async"
                          width={160}
                          height={160}
                          itemProp="image"
                        />
                      </div>
                      <div className={s.filContent}>
                        <h3 className={s.filTitle} itemProp="headline">{typo(a.titre)}</h3>
                        {a.deck && (
                          <p className={s.filDeck} itemProp="description">{typo(a.deck)}</p>
                        )}
                        <footer className={s.filMeta}>
                          <time dateTime={isoDate(a.datePublication)} itemProp="datePublished">
                            {relativeTime(a.datePublication)}
                          </time>
                          {a.authorName && (
                            <>
                              <span className={s.dot} aria-hidden="true" />
                              <span itemProp="author">{a.authorName}</span>
                            </>
                          )}
                          {a.tempsLecture && (
                            <>
                              <span className={s.dot} aria-hidden="true" />
                              <span>{a.tempsLecture} min</span>
                            </>
                          )}
                        </footer>
                      </div>
                      {a.univpilar && (
                        <span
                          className={s.filBadge}
                          style={{ backgroundColor: `${UNIVERS_COLORS[a.univpilar]}18`, color: UNIVERS_COLORS[a.univpilar] }}
                          aria-label={`Univers : ${universName(a.univpilar)}`}
                        >
                          {universName(a.univpilar)}
                        </span>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <nav className={s.pagination} aria-label="Pagination">
              <button
                className={s.pageArrow}
                onClick={() => handlePage(page - 1)}
                disabled={page === 1}
                aria-label="Page précédente"
              >
                &larr;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`${s.pageBtn} ${page === p ? s.pageBtnActive : ""}`}
                  onClick={() => handlePage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={page === p ? "page" : undefined}
                >
                  {p}
                </button>
              ))}
              <button
                className={s.pageArrow}
                onClick={() => handlePage(page + 1)}
                disabled={page === totalPages}
                aria-label="Page suivante"
              >
                &rarr;
              </button>
            </nav>
          )}

          {/* ── Closing CTA ── */}
          <section className={s.closingCta}>
            <p className={s.closingText}>Explorer d&rsquo;autres formats</p>
            <div className={s.closingLinks}>
              <Link to="/articles" className={s.closingLink}>
                Articles &rarr;
              </Link>
              <Link to="/videos" className={s.closingLink}>
                Vid&eacute;os &rarr;
              </Link>
              <Link to="/recommandations" className={s.closingLink}>
                Recommandations &rarr;
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
