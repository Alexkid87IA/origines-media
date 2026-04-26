import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { sanityFetch } from "@/lib/sanity";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import s from "./RecommandationTypePage.module.css";

interface Recommendation {
  _id: string;
  titre: string;
  type: string;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
}

const RECO_TYPES: Record<
  string,
  { label: string; color: string; plural: string }
> = {
  livres: { label: "Livres", color: "#E11D48", plural: "livres" },
  "films-series": {
    label: "Films & Séries",
    color: "#7C3AED",
    plural: "films & séries",
  },
  musique: { label: "Musique", color: "#2563EB", plural: "musiques" },
  podcasts: { label: "Podcasts", color: "#0D9488", plural: "podcasts" },
  youtube: { label: "YouTube", color: "#DC2626", plural: "chaînes YouTube" },
  "reseaux-sociaux": {
    label: "Réseaux sociaux",
    color: "#0891B2",
    plural: "comptes sociaux",
  },
  activite: { label: "Activités", color: "#16A34A", plural: "activités" },
  destination: {
    label: "Destinations",
    color: "#EA580C",
    plural: "destinations",
  },
  culture: { label: "Culture", color: "#9333EA", plural: "recommandations culture" },
  produit: { label: "Produits", color: "#CA8A04", plural: "produits" },
};

const TYPE_ALIASES: Record<string, string[]> = {
  livres: ["livres", "livre"],
  "films-series": ["films-series", "film"],
  podcasts: ["podcasts", "podcast"],
};

const ITEMS_PER_PAGE = 12;

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildQuery(typeId: string): string {
  const aliases = TYPE_ALIASES[typeId];
  const filter = aliases
    ? `type in [${aliases.map((a) => `"${a}"`).join(", ")}]`
    : `type == "${typeId}"`;
  return `
    *[_type == "recommendation" && ${filter} && defined(slug.current)] | order(datePublication desc, _createdAt desc) {
      _id, titre, type, auteur, note, coupDeCoeur, accroche,
      "imageUrl": coalesce(image.asset->url, imageUrl),
      "slug": slug.current,
      "datePublication": coalesce(datePublication, _createdAt)
    }
  `;
}

function renderStars(note: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={i <= note ? s.starFilled : s.starEmpty}
        aria-hidden="true"
      >
        ★
      </span>
    );
  }
  return <span className={s.stars}>{stars}</span>;
}

export default function RecommandationTypePage() {
  const { slug: typeId } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recos, setRecos] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [sortBy, setSortBy] = useState(searchParams.get("tri") || "recent");

  const typeConfig = typeId && typeId in RECO_TYPES ? RECO_TYPES[typeId] : null;

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  useEffect(() => {
    if (!typeId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await sanityFetch<Recommendation[]>(buildQuery(typeId));
        setRecos(data || []);
      } catch {
        setRecos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [typeId]);

  const sortedRecos = useMemo(() => {
    const result = [...recos];
    if (sortBy === "recent") {
      result.sort(
        (a, b) =>
          new Date(b.datePublication || "").getTime() -
          new Date(a.datePublication || "").getTime()
      );
    } else if (sortBy === "alpha") {
      result.sort((a, b) =>
        (a.titre || "").localeCompare(b.titre || "", "fr")
      );
    } else if (sortBy === "note") {
      result.sort((a, b) => (b.note || 0) - (a.note || 0));
    } else if (sortBy === "coups") {
      result.sort((a, b) =>
        a.coupDeCoeur === b.coupDeCoeur ? 0 : a.coupDeCoeur ? -1 : 1
      );
    }
    return result;
  }, [recos, sortBy]);

  const totalPages = Math.ceil(sortedRecos.length / ITEMS_PER_PAGE);
  const paginatedRecos = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedRecos.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedRecos, currentPage]);

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

  if (!typeConfig) {
    return (
      <>
        <SiteHeader />
        <main className={s.page}>
          <div className="v2-container">
            <div className={s.empty}>
              <h2 className={s.emptyTitle}>Catégorie introuvable</h2>
              <p className={s.emptyText}>
                Cette catégorie de recommandation n&rsquo;existe pas.
              </p>
              <Link to="/recommandations" className={s.emptyCta}>
                Toutes les recommandations &rarr;
              </Link>
            </div>
          </div>
        </main>
        <Footer2 />
      </>
    );
  }

  const color = typeConfig.color;

  return (
    <>
      <SEO
        title={`${typeConfig.label} — Recommandations · Origines Media`}
        description={`Nos ${typeConfig.plural} recommandés par la rédaction. ${recos.length} sélections à découvrir.`}
        url={`/recommandations/${typeId}`}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Recommandations", url: "/recommandations" },
          {
            name: typeConfig.label,
            url: `/recommandations/${typeId}`,
          },
        ]}
        itemListData={recos
          .filter((r) => r.imageUrl)
          .slice(0, 10)
          .map((r) => ({
            name: r.titre,
            description: r.accroche || "",
            image: r.imageUrl!,
            url: `/recommandations/${r.slug}`,
          }))}
      />
      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          {/* Hero */}
          <header
            className={s.hero}
            style={{ "--type-color": color } as React.CSSProperties}
          >
            <nav className={s.breadcrumb} aria-label="Fil d'Ariane">
              <Link to="/recommandations" className={s.breadcrumbLink}>
                Recommandations
              </Link>
              <span className={s.breadcrumbSep}>/</span>
              <span className={s.breadcrumbCurrent}>{typeConfig.label}</span>
            </nav>

            <div className={s.heroContent}>
              <span className={s.heroKicker}>
                <span
                  className={s.heroKickerDot}
                  style={{ background: color }}
                  aria-hidden="true"
                />
                Recommandations
              </span>
              <h1 className={s.heroTitle}>{typeConfig.label}</h1>
              {!loading && (
                <p className={s.heroDeck}>
                  {recos.length} {typeConfig.plural} recommand&eacute;
                  {recos.length !== 1 ? "s" : ""} par la r&eacute;daction.
                </p>
              )}
            </div>

            <div className={s.heroAccent} style={{ background: color }} />
          </header>

          {/* Category navigation */}
          <nav className={s.typeNav} aria-label="Catégories">
            <Link
              to="/recommandations"
              className={s.typeChip}
            >
              Toutes
            </Link>
            {Object.entries(RECO_TYPES).map(([key, cfg]) => (
              <Link
                key={key}
                to={`/recommandations/${key}`}
                className={`${s.typeChip} ${key === typeId ? s.typeChipActive : ""}`}
                style={
                  key === typeId
                    ? ({ "--type-color": cfg.color } as React.CSSProperties)
                    : undefined
                }
              >
                {cfg.label}
              </Link>
            ))}
          </nav>

          {/* Toolbar */}
          <div className={s.toolbar}>
            <span className={`${s.resultCount} mono`}>
              {sortedRecos.length} recommandation
              {sortedRecos.length !== 1 ? "s" : ""}
            </span>
            <div className={s.sortWrap}>
              <select
                className={s.sortSelect}
                value={sortBy}
                onChange={handleSortChange}
                aria-label="Trier par"
              >
                <option value="recent">Plus r&eacute;cents</option>
                <option value="note">Meilleures notes</option>
                <option value="coups">Coups de c&oelig;ur</option>
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
          ) : paginatedRecos.length > 0 ? (
            <>
              <div className={s.grid}>
                {paginatedRecos.map((reco) => (
                  <article
                    key={reco._id}
                    className={s.card}
                    style={{ "--cat-color": color } as React.CSSProperties}
                  >
                    <a
                      href={`/recommandations/${reco.slug}`}
                      className={s.cardLink}
                    >
                      <div className={s.cardImgWrap}>
                        {reco.imageUrl ? (
                          <img
                            src={reco.imageUrl}
                            alt={reco.titre}
                            className={s.cardImg}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div
                            className={s.cardImgPlaceholder}
                            style={{ background: color }}
                          >
                            <span className={s.cardImgPlaceholderLabel}>
                              {typeConfig.label}
                            </span>
                          </div>
                        )}
                        {reco.coupDeCoeur && (
                          <span className={s.coupDeCoeur} aria-label="Coup de cœur">
                            ♥
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
                          <span className={s.cardCategory} style={{ color }}>
                            {typeConfig.label}
                          </span>
                          {reco.note && (
                            <>
                              <span className={s.cardSep}>&middot;</span>
                              {renderStars(reco.note)}
                            </>
                          )}
                        </div>
                        <h3 className={s.cardTitle}>{reco.titre}</h3>
                        {reco.accroche && (
                          <p className={s.cardExcerpt}>{reco.accroche}</p>
                        )}
                        <div className={s.cardFoot}>
                          <span className={s.cardAuthor}>
                            {reco.auteur || "Rédaction Origines"}
                          </span>
                          {reco.datePublication && (
                            <>
                              <span className={s.cardSep}>&middot;</span>
                              <time
                                className={s.cardDate}
                                dateTime={reco.datePublication}
                              >
                                {formatDate(reco.datePublication)}
                              </time>
                            </>
                          )}
                          <SaveBookmark
                            inline
                            type="recommandation"
                            slug={reco.slug}
                            title={reco.titre}
                            image={reco.imageUrl}
                            univers="Recommandations"
                          />
                          <span className={s.cardCta}>Voir &rarr;</span>
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
                Aucune recommandation pour l&rsquo;instant
              </h3>
              <p className={s.emptyText}>
                Nous n&rsquo;avons pas encore de{" "}
                {typeConfig.plural} &agrave; recommander. Explorez les autres
                cat&eacute;gories.
              </p>
              <Link to="/recommandations" className={s.emptyCta}>
                Toutes les recommandations &rarr;
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
