import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { typo } from "../lib/typography";
import { sanityFetch } from "@/lib/sanity";
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

function relativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 5) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `il y a ${diffD} j`;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
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

          <section className={s.header}>
            <div className={s.titleRow}>
              <h1 className={s.pageTitle}>
                <span className={s.pulseDot} />
                Discover
              </h1>
              <span className={s.subtitle}>Le radar d&rsquo;Origines Media</span>
            </div>

            <div className={s.headerMeta}>
              <span>
                <strong>{articles.length}</strong> articles
              </span>
            </div>

            <div className={s.filters}>
              <button
                className={`${s.filterBtn} ${!activeUnivers ? s.filterBtnActive : ""}`}
                onClick={() => handleFilter(null)}
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
                  >
                    <span className={s.filterDot} style={{ background: u.color }} />
                    {u.name}
                    <span className={s.filterCount}>{count}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className={s.divider} />

          {loading && (
            <div className={s.loadingWrap}>
              <div className={s.spinner} />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className={s.emptyState}>
              <p>Aucun article trouv&eacute;.</p>
            </div>
          )}

          {!loading && featured && (
            <section className={s.featuredSection}>
              <Link to={`/article/${featured.slug}`} className={s.featuredCard}>
                <div className={s.featuredImgWrap}>
                  <img
                    src={featured.imageUrl || ""}
                    alt={featured.titre}
                    className={s.featuredImg}
                    loading="eager"
                  />
                </div>
                <div className={s.featuredBody}>
                  {featured.univpilar && (
                    <span
                      className={s.featuredUnivers}
                      style={{ color: UNIVERS_COLORS[featured.univpilar] }}
                    >
                      <span
                        className={s.featuredDot}
                        style={{ background: UNIVERS_COLORS[featured.univpilar] }}
                      />
                      {UNIVERS.find((u) => u.id === featured.univpilar)?.name}
                    </span>
                  )}
                  <h2 className={s.featuredTitle}>{typo(featured.titre)}</h2>
                  {featured.deck && (
                    <p className={s.featuredDeck}>{featured.deck}</p>
                  )}
                  <div className={s.featuredMeta}>
                    <span>{relativeTime(featured.datePublication)}</span>
                    {featured.authorName && (
                      <>
                        <span className={s.dot} />
                        <span>{featured.authorName}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </section>
          )}

          {!loading && gridArticles.length > 0 && (
            <section className={s.gridSection}>
              <h3 className={s.sectionLabel}>&Agrave; la une</h3>
              <div className={s.grid}>
                {gridArticles.map((a) => (
                  <article key={a._id} className={s.gridCard}>
                    <Link to={`/article/${a.slug}`} className={s.gridCardLink}>
                      <div className={s.gridImgWrap}>
                        <img
                          src={a.imageUrl || ""}
                          alt={a.titre}
                          className={s.gridImg}
                          loading="lazy"
                          decoding="async"
                        />
                        {a.univpilar && (
                          <span
                            className={s.gridBadge}
                            style={{ backgroundColor: UNIVERS_COLORS[a.univpilar] }}
                          >
                            {UNIVERS.find((u) => u.id === a.univpilar)?.name}
                          </span>
                        )}
                      </div>
                      <div className={s.gridCardBody}>
                        <h4 className={s.gridCardTitle}>{typo(a.titre)}</h4>
                        <span className={s.gridCardTime}>
                          {relativeTime(a.datePublication)}
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!loading && filArticles.length > 0 && (
            <section className={s.filSection}>
              <h3 className={s.sectionLabel}>Fil</h3>
              <div className={s.filList}>
                {filArticles.map((a) => (
                  <Link
                    key={a._id}
                    to={`/article/${a.slug}`}
                    className={s.filRow}
                  >
                    <div className={s.filThumb}>
                      <img
                        src={a.imageUrl || ""}
                        alt=""
                        className={s.filThumbImg}
                        loading="lazy"
                      />
                    </div>
                    <span className={s.filTitle}>{typo(a.titre)}</span>
                    <span className={s.filTime}>
                      {relativeTime(a.datePublication)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!loading && totalPages > 1 && (
            <nav className={s.pagination} aria-label="Pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`${s.pageBtn} ${page === p ? s.pageBtnActive : ""}`}
                  onClick={() => handlePage(p)}
                >
                  {p}
                </button>
              ))}
            </nav>
          )}

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
