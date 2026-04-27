// src/pages/UniversPage.tsx
// Page Univers V2 — Affiche les verticales (catégories principales)

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import { sanityFetch } from "../lib/sanity";
import { sanityImg } from "../lib/sanityImage";
import {
  VERTICALES_FOR_UNIVERS_PAGE_QUERY,
  VERTICALE_DETAIL_QUERY,
} from "../lib/queries";
import { typo } from "../lib/typography";
import { getUniversColors } from "../lib/universColors";
import { UNIVERS_MAP, verticaleToUnivers } from "../data/univers";
import Breadcrumb from '@/components/ui/Breadcrumb';
import s from "./UniversPage.module.css";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Univers {
  _id: string;
  nom: string;
  slug: string;
  couleur: string;
  description: string;
}

interface Verticale {
  _id: string;
  nom: string;
  slug: string;
  couleurDominante: string;
  description: string;
  imageUrl: string;
  ordre: number;
  stats: {
    articles: number;
  };
  univers: Univers[];
}

interface Production {
  _id: string;
  titre: string;
  description: string;
  slug: string;
  imageUrl: string;
  datePublication: string;
  tempsLecture: number;
  univers?: {
    nom: string;
    slug: string;
    couleur: string;
  };
}

interface VerticaleDetail extends Verticale {
  productions: Production[];
}

/* ------------------------------------------------------------------ */
/*  Inline SVG icons                                                   */
/* ------------------------------------------------------------------ */

function ArrowRightIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function BookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
    >
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

/* ================================================================== */
/*  UniversListPage                                                    */
/* ================================================================== */

function UniversListPage() {
  const [verticales, setVerticales] = useState<Verticale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  useEffect(() => {
    const fetchVerticales = async () => {
      try {
        setLoading(true);
        const data = await sanityFetch<Verticale[]>(
          VERTICALES_FOR_UNIVERS_PAGE_QUERY
        );
        setVerticales(data || []);
      } catch {
        setError("Impossible de charger les univers");
      } finally {
        setLoading(false);
      }
    };
    fetchVerticales();
  }, []);

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main id="main" role="main">
          <div className={s.loadingWrap}>
            <div className={s.spinner} />
          </div>
        </main>
        <Footer2 />
      </>
    );
  }

  if (error) {
    return (
      <>
        <SiteHeader />
        <main id="main" role="main">
          <div className={s.errorWrap}>
            <p className={s.errorText}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={s.errorCta}
            >
              R&eacute;essayer
            </button>
          </div>
        </main>
        <Footer2 />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Nos Univers"
        description={`Explorez nos ${verticales.length} univers thématiques : ${verticales.map((v) => v.nom).join(", ")}.`.slice(0, 155)}
        url="/univers"
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Univers', url: '/univers' },
        ]}
      />

      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          <Breadcrumb items={[
            { name: 'Accueil', url: '/' },
            { name: 'Univers', url: '/univers' },
          ]} />
          <section className={s.page}>
            {/* Chapter mark */}
            <div className={`${s.chapterMark} mono`}>
              <span className={s.cNum}>Univers</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Exploration</span>
            </div>

            {/* Section header */}
            <header className={s.sectionHead}>
              <div className={s.sectionHeadRow}>
                <div>
                  <span className={s.sectionKicker}>
                    <span className={s.sectionKickerDot} aria-hidden="true" />
                    {verticales.length} th&eacute;matiques &agrave; explorer
                  </span>
                  <h1 className={s.sectionTitle}>
                    Nos <em>univers.</em>
                  </h1>
                </div>
                <div className={s.sectionHeadRight}>
                  <Link to="/bibliotheque" className={s.linkArrow}>
                    Voir la biblioth&egrave;que
                    <ArrowRightIcon size={12} />
                  </Link>
                </div>
              </div>
            </header>

            {/* Univers grid — 5 cols desktop */}
            <div className={s.universGrid}>
              {verticales.map((verticale) => {
                const colors = getUniversColors(verticale.nom);

                return (
                  <article
                    key={verticale._id}
                    className={s.universCard}
                    style={
                      { "--cat-color": colors.bg } as React.CSSProperties
                    }
                  >
                    <Link
                      to={`/univers/${verticale.slug}`}
                      className={s.universCardLink}
                    >
                      <div className={s.universCardImgWrap}>
                        <img
                          src={sanityImg(verticale.imageUrl, 600)}
                          alt={verticale.nom}
                          className={s.universCardImg}
                          loading="lazy"
                          decoding="async"
                        />
                        <span
                          className={s.universCardBadge}
                          style={{ backgroundColor: colors.bg }}
                        >
                          {verticale.stats.articles} r&eacute;cits
                        </span>
                      </div>

                      <div className={s.universCardBody}>
                        <div className={s.universCardMeta}>
                          <div
                            className={s.universCardAccent}
                            style={{ backgroundColor: colors.bg }}
                          />
                          <h2 className={s.universCardTitle}>
                            {verticale.nom}
                          </h2>
                        </div>

                        <p className={s.universCardDesc}>
                          {verticale.description}
                        </p>

                        <span
                          className={s.universCardCta}
                          style={{ color: colors.bg }}
                        >
                          Explorer
                          <ArrowRightIcon size={12} />
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            {/* Footer */}
            <div className={s.listFooter}>
              <span className={s.listFooterCount}>
                {verticales.reduce((acc, v) => acc + v.stats.articles, 0)}{" "}
                r&eacute;cits disponibles
              </span>
              <Link to="/bibliotheque" className={s.listFooterCta}>
                Voir la biblioth&egrave;que &rarr;
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}

/* ================================================================== */
/*  UniversDetailPage                                                  */
/* ================================================================== */

function UniversDetailPage({ universId }: { universId: string }) {
  const [verticale, setVerticale] = useState<VerticaleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allVerticales, setAllVerticales] = useState<Verticale[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [verticaleData, allData] = await Promise.all([
          sanityFetch<VerticaleDetail>(VERTICALE_DETAIL_QUERY, {
            slug: universId,
          }),
          sanityFetch<Verticale[]>(VERTICALES_FOR_UNIVERS_PAGE_QUERY),
        ]);
        setVerticale(verticaleData);
        setAllVerticales(allData || []);
      } catch {
        setError("Impossible de charger cet univers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [universId]);

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main id="main" role="main">
          <div className={s.loadingWrap}>
            <div className={s.spinner} />
          </div>
        </main>
        <Footer2 />
      </>
    );
  }

  if (error || !verticale) {
    return (
      <>
        <SiteHeader />
        <main id="main" role="main">
          <div className={s.errorWrap}>
            <p className={s.errorText}>{error || "Univers non trouvé"}</p>
            <Link to="/univers" className={s.errorCta}>
              Retour aux univers
            </Link>
          </div>
        </main>
        <Footer2 />
      </>
    );
  }

  const colors = getUniversColors(verticale.nom);
  const featuredProduction = verticale.productions?.[0];
  const otherProductions = verticale.productions?.slice(1) || [];
  const relatedUniverses = allVerticales
    .filter((v) => v.slug !== verticale.slug)
    .slice(0, 4);

  const totalPages = Math.ceil(otherProductions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProductions = otherProductions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <SEO
        title={`Univers ${verticale.nom}`}
        description={verticale.description}
        url={`/univers/${verticale.slug}`}
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Univers', url: '/univers' },
          { name: verticale.nom, url: `/univers/${verticale.slug}` },
        ]}
      />

      <SiteHeader />

      <main id="main" role="main">
        <div className="v2-container">
          <Breadcrumb items={[
            { name: 'Accueil', url: '/' },
            { name: 'Univers', url: '/univers' },
            { name: verticale.nom, url: `/univers/${verticale.slug}` },
          ]} />
        </div>
        {/* ── Hero ── */}
        <section className={s.hero}>
          <div className={s.heroImgWrap}>
            <img
              src={sanityImg(verticale.imageUrl, 1200)}
              alt={verticale.nom}
              className={s.heroImg}
              fetchpriority="high"
              loading="eager"
            />
            <div className={s.heroOverlay} />
            <div
              className={s.heroColorOverlay}
              style={{ backgroundColor: colors.bg }}
            />
          </div>

          <div className={s.heroContent}>
            <div className={s.heroGrid}>
              {/* Left column */}
              <div>
                {/* Nav */}
                <nav className={s.heroNav}>
                  <Link to="/univers" className={s.heroBackLink}>
                    <ArrowLeftIcon size={12} />
                    Retour
                  </Link>
                  <span
                    className={s.heroLabel}
                    style={{ backgroundColor: `${colors.bg}cc` }}
                  >
                    <span className={s.heroLabelDot} />
                    Univers
                  </span>
                </nav>

                {/* Title */}
                <h1 className={s.heroTitle}>{verticale.nom}</h1>
                <span
                  className={s.heroAccent}
                  style={{ backgroundColor: colors.bg }}
                />

                {/* Description */}
                <p className={s.heroDesc}>{verticale.description}</p>

                {/* Tags */}
                {verticale.univers && verticale.univers.length > 0 && (
                  <div className={s.heroTags}>
                    {verticale.univers.map((u) => (
                      <span key={u._id} className={s.heroTag}>
                        {u.nom}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <Link
                  to={`/bibliotheque?verticale=${verticale.slug}`}
                  className={s.heroCta}
                >
                  <BookIcon size={16} />
                  Explorer les r&eacute;cits
                  <ArrowRightIcon size={14} />
                </Link>
              </div>

              {/* Right column — Stats (desktop) */}
              <div className={s.heroStats}>
                <div className={s.heroStatBlock}>
                  <div className={s.heroStatValue}>
                    {verticale.stats.articles}
                  </div>
                  <div className={s.heroStatLabel}>Articles</div>
                </div>

                {verticale.univers && verticale.univers.length > 0 && (
                  <>
                    <div className={s.heroStatSep} />
                    <div className={s.heroStatBlock}>
                      <div className={s.heroStatValue}>
                        {verticale.univers.length}
                      </div>
                      <div className={s.heroStatLabel}>Th&egrave;mes</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile stats */}
            <div className={s.heroStatsMobile}>
              <div className={s.heroStatMobileItem}>
                <span className={s.heroStatMobileValue}>
                  {verticale.stats.articles}
                </span>
                <span className={s.heroStatMobileLabel}>articles</span>
              </div>
              {verticale.univers && verticale.univers.length > 0 && (
                <div className={s.heroStatMobileItem}>
                  <span className={s.heroStatMobileValue}>
                    {verticale.univers.length}
                  </span>
                  <span className={s.heroStatMobileLabel}>
                    th&egrave;mes
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Sous-topics navigation ── */}
        {(() => {
          const universIdMapped = verticaleToUnivers(verticale.nom);
          const uni = UNIVERS_MAP[universIdMapped];
          if (!uni || uni.subtopics.length === 0) return null;
          return (
            <section className={s.subtopicSection}>
              <div className={s.subtopicInner}>
                <h2 className={s.subtopicTitle}>Explorer par th&eacute;matique</h2>
                <div className={s.subtopicGrid}>
                  {uni.subtopics.map((st) => (
                    <Link
                      key={st.slug}
                      to={`/univers/${uni.id}/${st.slug}`}
                      className={s.subtopicChip}
                      style={{ "--cat-color": colors.bg } as React.CSSProperties}
                    >
                      {st.label}
                      <ArrowRightIcon size={12} className={s.subtopicArrow} />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })()}

        {/* ── Featured production ── */}
        {featuredProduction && (
          <section className={s.featuredSection}>
            <div className={s.featuredSectionInner}>
              <div className={s.featuredHead}>
                <div>
                  <div
                    className={s.featuredHeadAccent}
                    style={{ backgroundColor: colors.bg }}
                  />
                  <h2 className={s.featuredHeadTitle}>
                    &Agrave; la une
                  </h2>
                </div>
              </div>

              <Link
                to={`/article/${featuredProduction.slug}`}
                className={s.featuredCard}
              >
                <div className={s.featuredImgWrap}>
                  <img
                    src={sanityImg(featuredProduction.imageUrl, 800)}
                    alt={featuredProduction.titre}
                    className={s.featuredImg}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className={s.featuredBody}>
                  {featuredProduction.univers && (
                    <span
                      className={s.featuredCategory}
                      style={{ color: colors.bg }}
                    >
                      <span
                        className={s.featuredCatDot}
                        style={{ backgroundColor: colors.bg }}
                      />
                      {featuredProduction.univers.nom}
                    </span>
                  )}

                  <h3 className={s.featuredTitle}>
                    {typo(featuredProduction.titre)}
                  </h3>

                  <p className={s.featuredDesc}>
                    {featuredProduction.description}
                  </p>

                  <div className={s.featuredFoot}>
                    <span className={s.featuredReadTime}>
                      {featuredProduction.tempsLecture || 5} min de lecture
                    </span>
                    <span
                      className={s.featuredCta}
                      style={{ color: colors.bg }}
                    >
                      Lire l&rsquo;article
                      <ArrowRightIcon size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ── Productions grid ── */}
        {otherProductions.length > 0 && (
          <section className={s.gridSection}>
            <div className={s.gridSectionInner}>
              <div className={s.gridHead}>
                <div
                  className={s.gridHeadAccent}
                  style={{ backgroundColor: colors.bg }}
                />
                <div className={s.gridHeadRow}>
                  <div>
                    <h2 className={s.gridHeadTitle}>
                      Tous les r&eacute;cits
                    </h2>
                    <p className={s.gridHeadSub}>
                      {otherProductions.length} articles sur{" "}
                      {verticale?.nom?.toLowerCase() || "cet univers"}
                    </p>
                  </div>
                  {totalPages > 1 && (
                    <span className={s.gridHeadPage}>
                      Page {currentPage} / {totalPages}
                    </span>
                  )}
                </div>
              </div>

              <div className={s.prodGrid}>
                {paginatedProductions.map((prod) => (
                  <article
                    key={prod._id}
                    className={s.prodCard}
                    style={
                      { "--cat-color": colors.bg } as React.CSSProperties
                    }
                  >
                    <Link
                      to={`/article/${prod.slug}`}
                      className={s.prodCardLink}
                    >
                      <div className={s.prodCardImgWrap}>
                        <img
                          src={sanityImg(prod.imageUrl, 400)}
                          alt={prod.titre}
                          className={s.prodCardImg}
                          loading="lazy"
                          decoding="async"
                        />
                        <div className={s.prodCardOverlay} />

                        {prod.univers && (
                          <span
                            className={s.prodCardBadge}
                            style={{
                              backgroundColor: `${colors.bg}dd`,
                            }}
                          >
                            {prod.univers.nom}
                          </span>
                        )}

                        <div className={s.prodCardContent}>
                          <h3 className={s.prodCardTitle}>
                            {typo(prod.titre)}
                          </h3>
                          <span className={s.prodCardTime}>
                            {prod.tempsLecture || 5} min
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className={s.pagination} aria-label="Pagination">
                  <button
                    className={s.pageBtn}
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 500, behavior: "smooth" });
                    }}
                  >
                    <ArrowLeftIcon size={14} />
                  </button>

                  <div className={s.pageNums}>
                    {Array.from(
                      { length: totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        className={`${s.pageNum} ${
                          currentPage === page ? s.pageNumActive : ""
                        }`}
                        style={
                          currentPage === page
                            ? { backgroundColor: colors.bg, borderColor: colors.bg }
                            : undefined
                        }
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({
                            top: 500,
                            behavior: "smooth",
                          });
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className={s.pageBtn}
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setCurrentPage((p) =>
                        Math.min(totalPages, p + 1)
                      );
                      window.scrollTo({ top: 500, behavior: "smooth" });
                    }}
                  >
                    <ArrowRightIcon size={14} />
                  </button>
                </nav>
              )}
            </div>
          </section>
        )}

        {/* ── Related universes ── */}
        {relatedUniverses.length > 0 && (
          <section className={s.relatedSection}>
            <div className={s.relatedInner}>
              {/* Header */}
              <div className={s.relatedHead}>
                <span className={s.relatedKicker}>
                  <span className={s.relatedKickerDot} />
                  Continuez l&rsquo;exploration
                </span>
                <h2 className={s.relatedTitle}>
                  D&rsquo;autres univers &agrave; d&eacute;couvrir
                </h2>
                <p className={s.relatedDeck}>
                  Chaque univers raconte une histoire unique. Lequel vous
                  appelle&nbsp;?
                </p>
              </div>

              {/* Grid */}
              <div className={s.relatedGrid}>
                {relatedUniverses.map((uni) => {
                  const uniColors = getUniversColors(uni.nom);
                  return (
                    <article
                      key={uni._id}
                      className={s.relatedCard}
                      style={
                        {
                          "--cat-color": uniColors.bg,
                        } as React.CSSProperties
                      }
                    >
                      <Link
                        to={`/univers/${uni.slug}`}
                        className={s.relatedCardLink}
                      >
                        <div className={s.relatedCardImgWrap}>
                          <img
                            src={sanityImg(uni.imageUrl, 600)}
                            alt={uni.nom}
                            className={s.relatedCardImg}
                            loading="lazy"
                            decoding="async"
                          />
                          <div className={s.relatedCardOverlay} />
                          <div
                            className={s.relatedCardColorOverlay}
                            style={{
                              backgroundColor: uniColors.bg,
                            }}
                          />

                          <div className={s.relatedCardContent}>
                            <span className={s.relatedCardBadge}>
                              {uni.stats.articles} r&eacute;cits
                            </span>

                            <div className={s.relatedCardBottom}>
                              <h3 className={s.relatedCardName}>
                                {uni.nom}
                              </h3>
                              <span className={s.relatedCardArrow}>
                                <ArrowRightIcon size={16} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className={s.relatedBottomCta}>
                <Link to="/univers" className={s.relatedCtaLink}>
                  Voir tous les univers
                  <ArrowRightIcon size={14} />
                </Link>
              </div>

              {/* Color bar */}
              <div className={s.relatedColorBar}>
                {relatedUniverses.map((uni) => {
                  const uniColors = getUniversColors(uni.nom);
                  return (
                    <div
                      key={uni._id}
                      className={s.relatedColorBarSegment}
                      style={{ backgroundColor: uniColors.bg }}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}

/* ================================================================== */
/*  Router switch                                                      */
/* ================================================================== */

export default function UniversPage() {
  const { universId } = useParams<{ universId: string }>();

  if (!universId) {
    return <UniversListPage />;
  }

  return <UniversDetailPage universId={universId} />;
}
