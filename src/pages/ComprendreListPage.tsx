import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { typo, estimateReadingTimeFromText } from "../lib/typography";
import { sanityFetch } from "@/lib/sanity";
import { RT } from "@/lib/queries";
import { UNIVERS, type UniversId } from "@/data/univers";
import Breadcrumb from "@/components/ui/Breadcrumb";
import s from "./ComprendreListPage.module.css";

interface Article {
  _id: string;
  titre: string;
  deck?: string;
  slug: string;
  datePublication: string;
  tempsLecture?: number;
  contenuTexte?: string;
  univpilar?: string;
  soustopic?: string;
  authorName?: string;
  imageUrl?: string;
}

const QUERY = `
  *[_type == "production" && category == "comprendre" && defined(image.asset)] | order(datePublication desc) {
    _id,
    titre,
    deck,
    "slug": slug.current,
    datePublication,
    ${RT},
    "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
    univpilar,
    soustopic,
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

function formatDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function readTime(a: Article): string {
  if (a.tempsLecture) return `${a.tempsLecture} min`;
  if (a.contenuTexte) return `${estimateReadingTimeFromText(a.contenuTexte)} min`;
  return "5 min";
}

const ITEMS_PER_PAGE = 18;

export default function ComprendreListPage() {
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

  const featured = filtered[0];
  const rest = paginated.slice(page === 1 ? 1 : 0);

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
        title="Comprendre — Articles de fond"
        description="Nos articles de fond pour comprendre les grands sujets : psychologie, neurosciences, philosophie, relations. Des explications claires, sourcées, sans jargon."
        url="/comprendre"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Comprendre", url: "/comprendre" },
        ]}
        itemListData={filtered.slice(0, 10).map((a) => ({
          name: a.titre,
          description: a.deck || "",
          image: a.imageUrl || "",
          url: `/comprendre/${a.slug}`,
        }))}
      />
      <SiteHeader />

      <main>
        <div className="v2-container">
          <Breadcrumb items={[
            { name: "Accueil", url: "/" },
            { name: "Comprendre", url: "/comprendre" },
          ]} />

          <section className={s.hero}>
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Rubrique</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Comprendre</span>
            </div>

            <h1 className={s.heroTitle}>
              Comprendre pour mieux <em>vivre.</em>
            </h1>
            <p className={s.heroDeck}>
              Des articles de fond, sourc&eacute;s et accessibles, pour d&eacute;coder
              les m&eacute;canismes qui nous traversent&nbsp;: &eacute;motions, cerveau,
              relations, soci&eacute;t&eacute;. La profondeur sans le jargon.
            </p>

            <div className={s.heroStats}>
              <span className={s.heroStat}>
                <strong>{articles.length}</strong> articles publi&eacute;s
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

          {!loading && featured && page === 1 && (
            <section className={s.featuredSection}>
              <Link to={`/comprendre/${featured.slug}`} className={s.featuredCard}>
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
                    <span className={s.featuredUnivers} style={{ color: UNIVERS_COLORS[featured.univpilar] }}>
                      <span className={s.featuredDot} style={{ background: UNIVERS_COLORS[featured.univpilar] }} />
                      {UNIVERS.find((u) => u.id === featured.univpilar)?.name}
                    </span>
                  )}
                  <h2 className={s.featuredTitle}>{typo(featured.titre)}</h2>
                  {featured.deck && <p className={s.featuredDeck}>{featured.deck}</p>}
                  <div className={s.featuredMeta}>
                    <span>{readTime(featured)} de lecture</span>
                    {featured.authorName && <><span className={s.dot} /><span>{featured.authorName}</span></>}
                  </div>
                </div>
              </Link>
            </section>
          )}

          {!loading && rest.length > 0 && (
            <section className={s.gridSection}>
              <div className={s.grid}>
                {rest.map((a) => (
                  <article key={a._id} className={s.card}>
                    <Link to={`/comprendre/${a.slug}`} className={s.cardLink}>
                      <div className={s.cardImgWrap}>
                        <img
                          src={a.imageUrl || ""}
                          alt={a.titre}
                          className={s.cardImg}
                          loading="lazy"
                          decoding="async"
                        />
                        {a.univpilar && (
                          <span
                            className={s.cardBadge}
                            style={{ backgroundColor: UNIVERS_COLORS[a.univpilar] }}
                          >
                            {UNIVERS.find((u) => u.id === a.univpilar)?.name}
                          </span>
                        )}
                      </div>
                      <div className={s.cardBody}>
                        <h3 className={s.cardTitle}>{typo(a.titre)}</h3>
                        {a.deck && <p className={s.cardDeck}>{a.deck}</p>}
                        <div className={s.cardMeta}>
                          <span>{readTime(a)}</span>
                          {a.authorName && <><span className={s.dot} /><span>{a.authorName}</span></>}
                        </div>
                      </div>
                    </Link>
                  </article>
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
            <p className={s.closingText}>
              Vous cherchez un autre format&nbsp;?
            </p>
            <div className={s.closingLinks}>
              <Link to="/reflexions" className={s.closingLink}>R&eacute;flexions &rarr;</Link>
              <Link to="/temoignages" className={s.closingLink}>T&eacute;moignages &rarr;</Link>
              <Link to="/articles" className={s.closingLink}>Tous les articles &rarr;</Link>
            </div>
          </section>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
