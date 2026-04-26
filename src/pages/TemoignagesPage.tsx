import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { typo } from "../lib/typography";
import { sanityFetch } from "@/lib/sanity";
import { UNIVERS, UNIVERS_MAP, type UniversId } from "@/data/univers";
import { TAG_CATEGORIES, CATEGORY_ORDER, getTagCategory, countStoriesByCategory, filterStoriesByCategory } from "@/lib/tagCategories";
import s from "./TemoignagesPage.module.css";

/* ================================================================
   TYPES & QUERY
   ================================================================ */

interface TemoignageTag {
  slug: string;
  label?: string;
}

interface Temoignage {
  _id: string;
  titre: string;
  deck?: string;
  slug: string;
  datePublication: string;
  tempsLecture?: number;
  univpilar?: string;
  category?: string;
  soustopic?: string;
  authorName?: string;
  imageUrl?: string;
  tags?: TemoignageTag[];
}

const QUERY = `
  *[_type == "production" && category in ["temoignages", "portraits"]] | order(datePublication desc) {
    _id,
    titre,
    deck,
    "slug": slug.current,
    datePublication,
    tempsLecture,
    univpilar,
    category,
    soustopic,
    "authorName": author->name,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    "tags": tags[defined(@)]{ "slug": coalesce(slug, @->slug.current, lower(@)), "label": coalesce(label, @->title, @) }
  }
`;

const UNIVERS_COLORS: Record<string, string> = {
  esprit: "#7B5CD6",
  corps: "#5AA352",
  liens: "#E67839",
  monde: "#2E9B74",
  avenir: "#2E94B5",
};

const SOUSTOPIC_LABELS: Record<string, string> = {
  emotions: "Émotions", conscience: "Conscience", meditation: "Méditation",
  "developpement-personnel": "Développement personnel", neurosciences: "Neurosciences",
  philosophie: "Philosophie", "quete-de-sens": "Quête de sens", therapies: "Thérapies",
  nutrition: "Nutrition", sommeil: "Sommeil", mouvement: "Mouvement",
  prevention: "Prévention", "bien-etre-physique": "Bien-être physique",
  sport: "Sport", respiration: "Respiration",
  parentalite: "Parentalité", couples: "Couples", amitie: "Amitié",
  education: "Éducation", generations: "Générations", communaute: "Communauté",
  ruptures: "Ruptures", "enquetes-sociales": "Enquêtes sociales",
  "recits-de-voyage": "Récits de voyage", destinations: "Destinations",
  art: "Art", musique: "Musique", litterature: "Littérature",
  cinema: "Cinéma", creativite: "Créativité", photographie: "Photographie",
  carriere: "Carrière", entrepreneuriat: "Entrepreneuriat", innovation: "Innovation",
  "intelligence-artificielle": "Intelligence artificielle", economie: "Économie",
  leadership: "Leadership", numerique: "Numérique", nomadisme: "Nomadisme",
};

function formatDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

const ITEMS_PER_PAGE = 18;

/* ================================================================
   PAGE
   ================================================================ */

export default function TemoignagesPage() {
  const [articles, setArticles] = useState<Temoignage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUnivers, setActiveUnivers] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    sanityFetch<Temoignage[]>(QUERY)
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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORY_ORDER.forEach((catId) => {
      counts[catId] = countStoriesByCategory(articles, catId);
    });
    return counts;
  }, [articles]);

  const filtered = useMemo(() => {
    let result = articles;
    if (activeUnivers) result = result.filter((a) => a.univpilar === activeUnivers);
    if (activeCategory) result = filterStoriesByCategory(result, activeCategory);
    return result;
  }, [articles, activeUnivers, activeCategory]);

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

  const handleCategoryFilter = (id: string | null) => {
    setActiveCategory(id);
    setPage(1);
  };

  const handlePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={s.page}>
      <SEO
        title="Témoignages et portraits — Récits de vie"
        description="Des histoires vraies, racontées à la première personne. Témoignages, portraits, récits de vie."
        url="/temoignages"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Témoignages", url: "/temoignages" },
        ]}
      />
      <SiteHeader />

      <main>
        <div className="v2-container">
          {/* ═══ HERO ═══ */}
          <section className={s.hero}>
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Rubrique</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>T&eacute;moignages</span>
            </div>

            <h1 className={s.heroTitle}>
              Des histoires <em>vraies.</em>
            </h1>
            <p className={s.heroDeck}>
              Pas de jugement, pas de le&ccedil;on. Juste la v&eacute;rit&eacute; de
              ceux qui osent la partager. Chaque r&eacute;cit est une fen&ecirc;tre
              sur un monde que vous ne connaissez peut-&ecirc;tre pas &mdash;&nbsp;ou
              que vous reconna&icirc;trez trop bien.
            </p>

            <div className={s.heroStats}>
              <span className={s.heroStat}>
                <strong>{articles.length}</strong> r&eacute;cits publi&eacute;s
              </span>
              <span className={s.dot} />
              <span className={s.heroStat}>
                Anonymat <strong>garanti</strong>
              </span>
            </div>

            {/* ── Univers filters ── */}
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

            {/* ── Category filters ── */}
            <div className={s.catFilters}>
              <button
                className={`${s.catBtn} ${!activeCategory ? s.catBtnActive : ""}`}
                onClick={() => handleCategoryFilter(null)}
              >
                Toutes les thématiques
              </button>
              {CATEGORY_ORDER.map((catId) => {
                const cat = TAG_CATEGORIES[catId];
                const count = categoryCounts[catId] || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={catId}
                    className={`${s.catBtn} ${activeCategory === catId ? s.catBtnActive : ""}`}
                    onClick={() => handleCategoryFilter(catId)}
                  >
                    <span className={s.catDot} style={{ background: cat.couleur }} />
                    {cat.nom}
                    <span className={s.catCount}>{count}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {loading ? (
            <div className={s.skeleton}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={s.skelCard}>
                  <div className={s.skelLine} />
                  <div className={s.skelLineShort} />
                  <div className={s.skelLineTiny} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* ═══ FEATURED ARTICLE ═══ */}
              {page === 1 && featured && (
                <section className={s.featured}>
                  <Link to={`/article/${featured.slug}`} className={s.featuredLink}>
                    <div className={s.featuredBody}>
                      <span className={s.featuredKicker}>
                        <span className={s.featuredDot} style={{ background: UNIVERS_COLORS[featured.univpilar || "esprit"] }} />
                        {UNIVERS_MAP[(featured.univpilar || "esprit") as UniversId]?.name || "Esprit"}
                        {featured.soustopic && SOUSTOPIC_LABELS[featured.soustopic] && (
                          <> &middot; {SOUSTOPIC_LABELS[featured.soustopic]}</>
                        )}
                      </span>
                      <h2 className={s.featuredTitle}>{typo(featured.titre)}</h2>
                      {featured.deck && (
                        <p className={s.featuredDeck}>{typo(featured.deck)}</p>
                      )}
                      <div className={s.featuredMeta}>
                        {featured.tempsLecture && <span>{featured.tempsLecture} min de lecture</span>}
                        {featured.datePublication && (
                          <>
                            <span className={s.dot} />
                            <span>{formatDate(featured.datePublication)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={s.featuredCta}>
                      Lire le r&eacute;cit
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </span>
                  </Link>
                </section>
              )}

              {/* ═══ GRID ═══ */}
              <section className={s.gridSection}>
                <div className={s.resultBar}>
                  <span className={s.resultCount}>
                    {filtered.length} r&eacute;cit{filtered.length > 1 ? "s" : ""}
                    {activeUnivers && UNIVERS_MAP[activeUnivers as UniversId] && (
                      <> dans <strong>{UNIVERS_MAP[activeUnivers as UniversId].name}</strong></>
                    )}
                    {activeCategory && TAG_CATEGORIES[activeCategory] && (
                      <> &middot; <strong>{TAG_CATEGORIES[activeCategory].nom}</strong></>
                    )}
                  </span>
                </div>

                <div className={s.grid}>
                  {rest.map((t) => {
                    const uid = (t.univpilar || "esprit") as UniversId;
                    const u = UNIVERS_MAP[uid] || UNIVERS_MAP.esprit;
                    const stLabel = t.soustopic ? SOUSTOPIC_LABELS[t.soustopic] || "" : "";

                    return (
                      <Link key={t._id} to={`/article/${t.slug}`} className={s.card}>
                        <div className={s.cardInner}>
                          <span className={s.cardKicker}>
                            <span className={s.cardDot} style={{ background: u.color }} />
                            {u.name}
                            {stLabel && <> &middot; {stLabel}</>}
                          </span>
                          <h3 className={s.cardTitle}>{typo(t.titre)}</h3>
                          {t.deck && (
                            <p className={s.cardDeck}>{typo(t.deck)}</p>
                          )}
                          <div className={s.cardMeta}>
                            {t.tempsLecture && <span>{t.tempsLecture} min</span>}
                            {t.datePublication && (
                              <>
                                <span className={s.dot} />
                                <span>{formatDate(t.datePublication)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                  <nav className={s.pagination} aria-label="Pagination">
                    <button
                      className={s.pageBtn}
                      disabled={page === 1}
                      onClick={() => handlePage(page - 1)}
                    >
                      &larr; Pr&eacute;c&eacute;dent
                    </button>
                    <div className={s.pageNums}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                        if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                          return (
                            <button
                              key={p}
                              className={`${s.pageNum} ${p === page ? s.pageNumActive : ""}`}
                              onClick={() => handlePage(p)}
                            >
                              {p}
                            </button>
                          );
                        } else if (p === page - 2 || p === page + 2) {
                          return <span key={p} className={s.pageEllipsis}>&hellip;</span>;
                        }
                        return null;
                      })}
                    </div>
                    <button
                      className={s.pageBtn}
                      disabled={page === totalPages}
                      onClick={() => handlePage(page + 1)}
                    >
                      Suivant &rarr;
                    </button>
                  </nav>
                )}
              </section>
            </>
          )}
        </div>

        {/* ═══ CALLOUT — Racontez votre histoire ═══ */}
        <section className={s.callout}>
          <div className="v2-container">
            <div className={s.calloutInner}>
              <div className={s.calloutText}>
                <span className={s.calloutKicker}>Contribuer</span>
                <h2 className={s.calloutTitle}>
                  Et si c&rsquo;&eacute;tait votre <em>tour&nbsp;?</em>
                </h2>
                <p className={s.calloutDeck}>
                  Vous avez une histoire, un parcours, une exp&eacute;rience &agrave;
                  partager&nbsp;? Anonymat garanti. Votre r&eacute;cit peut aider
                  quelqu&rsquo;un que vous ne conna&icirc;trez jamais.
                </p>
                <Link to="/ecrire-mon-histoire" className={s.calloutBtn}>
                  Raconter mon histoire
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>
              <div className={s.calloutCount}>
                <span className={s.calloutNum}>{articles.length}</span>
                <span className={s.calloutNumLabel}>r&eacute;cits publi&eacute;s</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CLOSING ═══ */}
        <section className={s.closing}>
          <div className="v2-container">
            <div className={s.closingInner}>
              <div className={s.closingRule} />
              <p className={s.closingLogo}>Origines Media</p>
              <p className={s.closingText}>
                Chaque histoire partag&eacute;e est un pas vers l&rsquo;autre.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
