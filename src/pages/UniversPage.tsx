import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { sanityFetch } from "../lib/sanity";
import { sanityImg } from "../lib/sanityImage";
import { UNIVERS_COUNTS_QUERY, ARTICLES_BY_UNIVPILAR_QUERY } from "../lib/queries";
import { typo, smartExcerpt } from "../lib/typography";
import { UNIVERS, UNIVERS_MAP, type UniversId } from "../data/univers";
import s from "./UniversPage.module.css";

interface ArticlePreview {
  _id: string;
  titre: string;
  description?: string;
  extrait?: string;
  contenuTexte?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
  tempsLecture?: number;
  univpilar?: string;
  soustopic?: string;
  category?: string;
  authorName?: string;
}

interface UniversCounts {
  esprit: number;
  corps: number;
  liens: number;
  monde: number;
  avenir: number;
  latest: ArticlePreview[];
}

function useReveal() {
  const [visible, setVisible] = useState(false);
  const obsRef = { current: null as IntersectionObserver | null };
  const ref = useCallback((el: HTMLElement | null) => {
    if (obsRef.current) { obsRef.current.disconnect(); obsRef.current = null; }
    if (!el || visible) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    obsRef.current = obs;
  }, [visible]);
  return { ref, className: `${s.reveal} ${visible ? s.visible : ""}` };
}

function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={size} height={size}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeftIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={size} height={size}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function getExcerpt(a: ArticlePreview): string {
  if (a.extrait) return a.extrait;
  if (a.description) return a.description;
  if (a.contenuTexte) return smartExcerpt(a.contenuTexte, 140);
  return "";
}

function formatDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

/* ================================================================== */
/*  UniversListPage                                                    */
/* ================================================================== */

function UniversListPage() {
  const [counts, setCounts] = useState<UniversCounts | null>(null);
  const heroReveal = useReveal();
  const gridReveal = useReveal();
  const themesReveal = useReveal();
  const latestReveal = useReveal();
  const pillarOrder: UniversId[] = ["esprit", "corps", "liens", "monde", "avenir"];

  useEffect(() => {
    sanityFetch<UniversCounts>(UNIVERS_COUNTS_QUERY).then(setCounts).catch(() => {});
  }, []);

  const totalArticles = counts ? counts.esprit + counts.corps + counts.liens + counts.monde + counts.avenir : 0;

  return (
    <>
      <SEO
        title="Nos Univers — Origines Media"
        description="Cinq regards sur ce qui nous construit. Explorez L'Esprit, Le Corps, Les Liens, Le Monde et L'Avenir — plus de 600 récits pour comprendre l'expérience humaine."
        url="/univers"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Univers", url: "/univers" },
        ]}
        itemListData={UNIVERS.map((u) => ({
          name: u.name,
          description: u.tagline,
          image: "/icons/origines-og.png",
          url: `/univers/${u.id}`,
        }))}
      />
      <SiteHeader />

      <main>
        <section ref={heroReveal.ref} className={`${s.hero} ${heroReveal.className}`}>
          <div className="v2-container">
            <Breadcrumb items={[{ name: "Accueil", url: "/" }, { name: "Univers", url: "/univers" }]} />
            <div className={s.heroInner}>
              <div className={s.chapterMark}>
                <span className={s.cNum}>Explorer</span>
                <span className={s.cSep}>/</span>
                <span className={s.cLabel}>5 piliers</span>
              </div>
              <h1 className={s.heroTitle}>Nos <em>univers.</em></h1>
              <p className={s.heroDeck}>
                Cinq regards sur ce qui nous construit. Chaque univers est une
                porte d&rsquo;entr&eacute;e vers des r&eacute;cits, des id&eacute;es et des voix
                qui &eacute;clairent un pan de l&rsquo;exp&eacute;rience humaine.
              </p>
              {totalArticles > 0 && (
                <div className={s.heroMeta}>
                  <span className={s.heroMetaCount}>{totalArticles.toLocaleString("fr-FR")}</span>
                  <span className={s.heroMetaLabel}>r&eacute;cits publi&eacute;s</span>
                </div>
              )}
              <div className={s.spectrumLine}>
                {pillarOrder.map((id) => (
                  <span key={id} className={s.spectrumSeg} style={{ backgroundColor: UNIVERS_MAP[id].color }} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section ref={gridReveal.ref} className={`${s.bentoSection} ${gridReveal.className}`}>
          <div className="v2-container">
            <div className={s.bentoGrid}>
              {pillarOrder.map((id, i) => {
                const u = UNIVERS_MAP[id];
                const count = counts ? counts[id] : 0;
                return (
                  <Link key={id} to={`/univers/${id}`} className={s.bentoCard} style={{ "--pillar-color": u.color, "--i": i } as React.CSSProperties}>
                    <span className={s.bentoAccent} />
                    <div className={s.bentoContent}>
                      <span className={s.bentoKicker}><span className={s.bentoDot} />{count > 0 ? `${count} récits` : "Explorer"}</span>
                      <h2 className={s.bentoName}>{u.name}</h2>
                      <p className={s.bentoTagline}>{u.tagline}</p>
                      <div className={s.bentoSubtopics}>
                        {u.subtopics.slice(0, 6).map((st, j) => (
                          <span key={st.slug}>{j > 0 && <span className={s.bentoSubSep}>&middot;</span>}{st.label}</span>
                        ))}
                        {u.subtopics.length > 6 && <span className={s.bentoSubMore}>+{u.subtopics.length - 6}</span>}
                      </div>
                    </div>
                    <span className={s.bentoArrow}><ArrowIcon size={18} /></span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={themesReveal.ref} className={`${s.themesSection} ${themesReveal.className}`}>
          <div className="v2-container">
            <header className={s.sectionHead}>
              <span className={s.sectionKicker}><span className={s.sectionKickerDot} />Th&eacute;matiques</span>
              <h2 className={s.sectionTitle}>Explorer par <em>th&egrave;me.</em></h2>
            </header>
            <div className={s.themesGrid}>
              {UNIVERS.map((u) => (
                <div key={u.id} className={s.themesGroup}>
                  <span className={s.themesGroupLabel} style={{ color: u.color }}>
                    <span className={s.themesGroupDot} style={{ backgroundColor: u.color }} />{u.name}
                  </span>
                  <div className={s.themesChips}>
                    {u.subtopics.map((st) => (
                      <Link key={st.slug} to={`/univers/${u.id}/${st.slug}`} className={s.themesChip} style={{ "--pillar-color": u.color } as React.CSSProperties}>{st.label}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {counts?.latest && counts.latest.length > 0 && (
          <section ref={latestReveal.ref} className={`${s.latestSection} ${latestReveal.className}`}>
            <div className="v2-container">
              <header className={s.sectionHead}>
                <span className={s.sectionKicker}><span className={s.sectionKickerDot} />Derniers r&eacute;cits</span>
                <h2 className={s.sectionTitle}>Publi&eacute;s <em>r&eacute;cemment.</em></h2>
              </header>
              <div className={s.latestGrid}>
                {counts.latest.slice(0, 4).map((art, i) => {
                  const pc = art.univpilar && UNIVERS_MAP[art.univpilar as UniversId] ? UNIVERS_MAP[art.univpilar as UniversId].color : "#0A0A0A";
                  return (
                    <Link key={art._id} to={`/article/${art.slug}`} className={s.latestCard} style={{ "--i": i } as React.CSSProperties}>
                      {art.imageUrl && <div className={s.latestImgWrap}><img src={sanityImg(art.imageUrl, 500)} alt={art.titre} className={s.latestImg} loading="lazy" decoding="async" /></div>}
                      <div className={s.latestBody}>
                        <span className={s.latestPillar} style={{ color: pc }}><span className={s.latestPillarDot} style={{ backgroundColor: pc }} />{art.univpilar && UNIVERS_MAP[art.univpilar as UniversId]?.name}</span>
                        <h3 className={s.latestTitle}>{typo(art.titre)}</h3>
                        <span className={s.latestMeta}>{art.tempsLecture || 5} min &middot; {art.authorName || "Origines"}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className={s.latestFoot}><Link to="/articles" className={s.latestCta}>Tous les articles <ArrowIcon size={14} /></Link></div>
            </div>
          </section>
        )}

        <div className={s.spectrumBar}>
          {pillarOrder.map((id) => <span key={id} className={s.spectrumBarSeg} style={{ backgroundColor: UNIVERS_MAP[id].color }} />)}
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
  const univers = UNIVERS_MAP[universId as UniversId];
  const [articles, setArticles] = useState<ArticlePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const heroReveal = useReveal();
  const subtopicReveal = useReveal();
  const featuredReveal = useReveal();
  const gridReveal = useReveal();
  const topicsReveal = useReveal();
  const faqReveal = useReveal();
  const relatedReveal = useReveal();

  useEffect(() => {
    if (!univers) return;
    setLoading(true);
    sanityFetch<ArticlePreview[]>(ARTICLES_BY_UNIVPILAR_QUERY, { univpilar: universId })
      .then((data) => setArticles(data || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [universId, univers]);

  useEffect(() => { setCurrentPage(1); }, [universId]);

  if (!univers) {
    return (
      <><SiteHeader /><main><div className="v2-container" style={{ padding: "120px 0", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--body)", color: "var(--stone500)" }}>Univers non trouv&eacute;</p>
        <Link to="/univers" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "var(--ink)", marginTop: 20, display: "inline-block" }}>Retour &rarr;</Link>
      </div></main><Footer2 /></>
    );
  }

  const featuredArticle = articles.find((a) => a.imageUrl);
  const otherArticles = articles.filter((a) => a !== featuredArticle);
  const totalPages = Math.ceil(otherArticles.length / ITEMS_PER_PAGE);
  const paginated = otherArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const otherPillars = UNIVERS.filter((u) => u.id !== universId);

  const allFaqs = useMemo(() => {
    return univers.subtopics.flatMap((st) => st.faq || []);
  }, [univers]);

  const articlesBySubtopic = useMemo(() => {
    const map: Record<string, ArticlePreview[]> = {};
    for (const a of articles) {
      if (a.soustopic) {
        if (!map[a.soustopic]) map[a.soustopic] = [];
        map[a.soustopic].push(a);
      }
    }
    return map;
  }, [articles]);

  const color = univers.color;

  return (
    <>
      <SEO
        title={`${univers.name} — Origines Media`}
        description={`${univers.tagline} ${articles.length} articles pour explorer ${univers.name.toLowerCase()}.`}
        url={`/univers/${universId}`}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Univers", url: "/univers" },
          { name: univers.name, url: `/univers/${universId}` },
        ]}
        itemListData={articles.filter((a) => a.imageUrl).slice(0, 10).map((a) => ({
          name: a.titre,
          description: getExcerpt(a),
          image: a.imageUrl!,
          url: `/article/${a.slug}`,
        }))}
        faqData={allFaqs.slice(0, 10)}
      />
      <SiteHeader />

      <main>
        {/* ═══ HERO ═══ */}
        <section ref={heroReveal.ref} className={`${s.detailHero} ${heroReveal.className}`} style={{ "--pillar-color": color } as React.CSSProperties}>
          <div className="v2-container">
            <Breadcrumb items={[
              { name: "Accueil", url: "/" },
              { name: "Univers", url: "/univers" },
              { name: univers.name, url: `/univers/${universId}` },
            ]} />
            <nav className={s.detailNav}>
              <Link to="/univers" className={s.detailBack}><ArrowLeftIcon size={12} /> Univers</Link>
            </nav>

            <div className={s.detailHeroInner}>
              <div className={s.detailHeroText}>
                <span className={s.detailAccentBar} />
                <h1 className={s.detailTitle}>{univers.name}<em>.</em></h1>
                <p className={s.detailTagline}>{univers.tagline}</p>
              </div>
              <div className={s.detailStats}>
                <div className={s.detailStat}>
                  <span className={s.detailStatVal}>{articles.length}</span>
                  <span className={s.detailStatLabel}>articles</span>
                </div>
                <span className={s.detailStatSep} />
                <div className={s.detailStat}>
                  <span className={s.detailStatVal}>{univers.subtopics.length}</span>
                  <span className={s.detailStatLabel}>th&egrave;mes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SUBTOPICS NAV ═══ */}
        <section ref={subtopicReveal.ref} className={`${s.subtopicSection} ${subtopicReveal.className}`}>
          <div className="v2-container">
            <div className={s.subtopicScroll}>
              {univers.subtopics.map((st) => (
                <Link key={st.slug} to={`/univers/${universId}/${st.slug}`} className={s.subtopicChip} style={{ "--pillar-color": color } as React.CSSProperties}>
                  <span className={s.subtopicDot} />
                  {st.label}
                  {articlesBySubtopic[st.slug] && <span className={s.subtopicCount}>{articlesBySubtopic[st.slug].length}</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {loading && <div className={s.loadingWrap}><div className={s.spinner} /></div>}

        {/* ═══ FEATURED ═══ */}
        {!loading && featuredArticle && (
          <section ref={featuredReveal.ref} className={`${s.featuredSection} ${featuredReveal.className}`}>
            <div className="v2-container">
              <Link to={`/article/${featuredArticle.slug}`} className={s.featuredCard} style={{ "--pillar-color": color } as React.CSSProperties}>
                <div className={s.featuredImgWrap}>
                  <img src={sanityImg(featuredArticle.imageUrl!, 1000)} alt={featuredArticle.titre} className={s.featuredImg} loading="eager" />
                  <div className={s.featuredGradient} />
                  <div className={s.featuredImgContent}>
                    <span className={s.featuredLabel}>
                      <span className={s.featuredLabelDot} />
                      &Agrave; la une &middot; {univers.name}
                    </span>
                  </div>
                </div>
                <div className={s.featuredBody}>
                  {featuredArticle.soustopic && (
                    <span className={s.featuredCat}>{featuredArticle.soustopic.replace(/-/g, " ")}</span>
                  )}
                  <h2 className={s.featuredTitle}>{typo(featuredArticle.titre)}</h2>
                  <p className={s.featuredDesc}>{getExcerpt(featuredArticle)}</p>
                  <div className={s.featuredFoot}>
                    <div className={s.featuredFootLeft}>
                      {featuredArticle.authorName && <span className={s.featuredAuthor}>{featuredArticle.authorName}</span>}
                      <span className={s.featuredTime}>{featuredArticle.tempsLecture || 5} min de lecture</span>
                    </div>
                    <span className={s.featuredCta}>Lire <ArrowIcon size={14} /></span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ═══ THÈMES EN PROFONDEUR ═══ */}
        {!loading && univers.subtopics.length > 0 && (
          <section ref={topicsReveal.ref} className={`${s.topicsSection} ${topicsReveal.className}`}>
            <div className="v2-container">
              <header className={s.sectionHead}>
                <span className={s.sectionKicker}><span className={s.sectionKickerDot} style={{ backgroundColor: color }} />Th&eacute;matiques</span>
                <h2 className={s.sectionTitle}>En <em>profondeur.</em></h2>
              </header>
              <div className={s.topicsGrid}>
                {univers.subtopics.slice(0, 4).map((st, i) => {
                  const stArticles = articlesBySubtopic[st.slug] || articlesBySubtopic[st.slug.replace(/-/g, "-")] || [];
                  const topArt = stArticles.find((a) => a.imageUrl);
                  return (
                    <div key={st.slug} className={s.topicCard} style={{ "--i": i, "--pillar-color": color } as React.CSSProperties}>
                      {topArt && topArt.imageUrl && (
                        <Link to={`/article/${topArt.slug}`} className={s.topicCardThumb}>
                          <img src={sanityImg(topArt.imageUrl, 400)} alt={topArt.titre} className={s.topicCardImg} loading="lazy" decoding="async" />
                          <span className={s.topicCardOverlay} />
                          <span className={s.topicCardImgTitle}>{typo(topArt.titre)}</span>
                        </Link>
                      )}
                      <div className={s.topicCardBody}>
                        <Link to={`/univers/${universId}/${st.slug}`} className={s.topicCardHead}>
                          <span className={s.topicCardDot} />
                          <h3 className={s.topicCardName}>{st.label}</h3>
                          <span className={s.topicCardCount}>{stArticles.length}</span>
                          <ArrowIcon size={12} />
                        </Link>
                        <p className={s.topicCardDesc}>{st.description?.slice(0, 120)}…</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══ ARTICLES GRID ═══ */}
        {!loading && otherArticles.length > 0 && (
          <section ref={gridReveal.ref} className={`${s.gridSection} ${gridReveal.className}`}>
            <div className="v2-container">
              <header className={s.sectionHead}>
                <span className={s.sectionKicker}><span className={s.sectionKickerDot} style={{ backgroundColor: color }} />{univers.name}</span>
                <h2 className={s.sectionTitle}>Tous les <em>r&eacute;cits.</em></h2>
              </header>
              <div className={s.gridMeta}>
                <span className={s.gridCount}>{otherArticles.length} articles</span>
                {totalPages > 1 && <span className={s.gridPage}>Page {currentPage} / {totalPages}</span>}
              </div>
              <div className={s.articlesGrid}>
                {paginated.map((art, i) => (
                  <Link key={art._id} to={`/article/${art.slug}`} className={s.articleCard} style={{ "--i": i } as React.CSSProperties}>
                    <div className={s.articleThumb}>
                      {art.imageUrl ? (
                        <img src={sanityImg(art.imageUrl, 420)} alt={art.titre} className={s.articleImg} loading="lazy" decoding="async" />
                      ) : (
                        <div className={s.articlePlaceholder} />
                      )}
                    </div>
                    <div className={s.articleBody}>
                      <div className={s.articleCardMeta}>
                        <span className={s.articleDot} style={{ backgroundColor: color }} />
                        <span className={s.articleCat}>{art.soustopic ? art.soustopic.replace(/-/g, " ") : univers.name}</span>
                        <span className={s.articleTime}>{art.tempsLecture || 5} min</span>
                      </div>
                      <h3 className={s.articleTitle}>{typo(art.titre)}</h3>
                      {art.authorName && <span className={s.articleAuthor}>{art.authorName}</span>}
                    </div>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <nav className={s.pagination}>
                  <button className={s.pageBtn} disabled={currentPage === 1} onClick={() => { setCurrentPage((p) => p - 1); window.scrollTo({ top: 500, behavior: "smooth" }); }}><ArrowLeftIcon size={14} /></button>
                  <div className={s.pageNums}>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let p: number;
                      if (totalPages <= 7) p = i + 1;
                      else if (currentPage <= 4) p = i + 1;
                      else if (currentPage >= totalPages - 3) p = totalPages - 6 + i;
                      else p = currentPage - 3 + i;
                      return (
                        <button key={p} className={`${s.pageNum} ${currentPage === p ? s.pageNumActive : ""}`} style={currentPage === p ? { backgroundColor: color, borderColor: color } : undefined} onClick={() => { setCurrentPage(p); window.scrollTo({ top: 500, behavior: "smooth" }); }}>{p}</button>
                      );
                    })}
                  </div>
                  <button className={s.pageBtn} disabled={currentPage === totalPages} onClick={() => { setCurrentPage((p) => p + 1); window.scrollTo({ top: 500, behavior: "smooth" }); }}><ArrowIcon size={14} /></button>
                </nav>
              )}
            </div>
          </section>
        )}

        {/* ═══ FAQ ═══ */}
        {allFaqs.length > 0 && (
          <section ref={faqReveal.ref} className={`${s.faqSection} ${faqReveal.className}`}>
            <div className="v2-container">
              <header className={s.sectionHead}>
                <span className={s.sectionKicker}><span className={s.sectionKickerDot} style={{ backgroundColor: color }} />Questions fr&eacute;quentes</span>
                <h2 className={s.sectionTitle}>Comprendre <em>{univers.name.replace(/^(L'|Le |Les )/, "").toLowerCase()}.</em></h2>
              </header>
              <div className={s.faqList}>
                {allFaqs.slice(0, 8).map((faq, i) => (
                  <details key={i} className={s.faqItem}>
                    <summary className={s.faqQuestion}>
                      <span className={s.faqQ}>{faq.question}</span>
                      <span className={s.faqToggle}>+</span>
                    </summary>
                    <div className={s.faqAnswer}>{faq.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ AUTRES UNIVERS ═══ */}
        <section ref={relatedReveal.ref} className={`${s.relatedSection} ${relatedReveal.className}`}>
          <div className="v2-container">
            <header className={s.sectionHead}>
              <span className={s.sectionKicker}><span className={s.sectionKickerDot} />Continuez</span>
              <h2 className={s.sectionTitle}>D&rsquo;autres <em>univers.</em></h2>
            </header>
            <div className={s.relatedGrid}>
              {otherPillars.map((u, i) => (
                <Link key={u.id} to={`/univers/${u.id}`} className={s.relatedCard} style={{ "--pillar-color": u.color, "--i": i } as React.CSSProperties}>
                  <span className={s.relatedAccent} />
                  <span className={s.relatedKicker}><span className={s.relatedDot} />{u.subtopics.length} th&egrave;mes</span>
                  <h3 className={s.relatedName}>{u.name}</h3>
                  <p className={s.relatedTagline}>{u.tagline}</p>
                  <span className={s.relatedArrow}><ArrowIcon size={14} /></span>
                </Link>
              ))}
            </div>
            <div className={s.spectrumBar}>
              {UNIVERS.map((u) => <span key={u.id} className={s.spectrumBarSeg} style={{ backgroundColor: u.color }} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}

export default function UniversPage() {
  const { universId } = useParams<{ universId: string }>();
  if (!universId) return <UniversListPage />;
  return <UniversDetailPage universId={universId} />;
}
