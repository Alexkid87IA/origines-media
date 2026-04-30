import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import Breadcrumb from "@/components/ui/Breadcrumb";
import EmailCapture from "@/components/EmailCapture";
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

const SOUSTOPIC_CANONICAL: Record<string, string> = {
  "bien-etre-physique": "bien-etre",
  "recits-de-voyage": "recits-voyage",
  "intelligence-artificielle": "ia",
};

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
        description={totalArticles > 0
          ? `Cinq regards sur ce qui nous construit : L'Esprit, Le Corps, Les Liens, Le Monde et L'Avenir. ${totalArticles} récits, reportages et vidéos pour explorer l'expérience humaine en profondeur.`
          : "Cinq regards sur ce qui nous construit : L'Esprit, Le Corps, Les Liens, Le Monde et L'Avenir. Articles, vidéos et reportages pour explorer l'expérience humaine en profondeur."
        }
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
  const [faqExpanded, setFaqExpanded] = useState(false);
  const ITEMS_PER_PAGE = 12;

  const heroReveal = useReveal();
  const subtopicReveal = useReveal();
  const featuredReveal = useReveal();
  const bandsReveal = useReveal();
  const gridReveal = useReveal();
  const ctaReveal = useReveal();
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
        <p style={{ fontFamily: "var(--body)", color: "var(--stone500)" }}>Univers non trouvé</p>
        <Link to="/univers" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "var(--ink)", marginTop: 20, display: "inline-block" }}>Retour →</Link>
      </div></main><Footer2 /></>
    );
  }

  const featuredArticle = articles.find((a) => a.imageUrl);
  const secondaryPicks = articles.filter((a) => a !== featuredArticle).slice(0, 3);
  const otherArticles = articles.filter((a) => a !== featuredArticle && !secondaryPicks.includes(a));
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
        const canonical = SOUSTOPIC_CANONICAL[a.soustopic];
        if (canonical && canonical !== a.soustopic) {
          if (!map[canonical]) map[canonical] = [];
          map[canonical].push(a);
        }
      }
    }
    return map;
  }, [articles]);

  const rankedSubtopics = useMemo(() => {
    return [...univers.subtopics]
      .map((st) => ({ ...st, count: (articlesBySubtopic[st.slug] || []).length }))
      .filter((st) => st.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [univers.subtopics, articlesBySubtopic]);

  const color = univers.color;
  const visibleFaqs = faqExpanded ? allFaqs : allFaqs.slice(0, 6);

  return (
    <>
      <SEO
        title={`${univers.name} — Origines Media`}
        description={`${univers.tagline} ${articles.length > 0 ? `${articles.length} articles` : "Articles, vidéos et reportages"} pour explorer ${univers.name.toLowerCase()} : ${univers.subtopics.slice(0, 5).map(st => st.label).join(", ")} et plus.`}
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
        <section ref={heroReveal.ref} className={`${s.dHero} ${heroReveal.className}`} style={{ "--pillar-color": color } as React.CSSProperties}>
          <span className={s.dHeroAccent} />
          <div className="v2-container">
            <Breadcrumb items={[
              { name: "Accueil", url: "/" },
              { name: "Univers", url: "/univers" },
              { name: univers.name, url: `/univers/${universId}` },
            ]} />
            <div className={s.dHeroGrid}>
              <div className={s.dHeroText}>
                <nav className={s.dHeroNav}>
                  <Link to="/univers" className={s.dHeroBack}><ArrowLeftIcon size={12} /> Tous les univers</Link>
                </nav>
                <div className={s.dHeroMeta}>
                  <span className={s.dHeroDot} />
                  <span>{articles.length} articles</span>
                  <span className={s.dHeroMetaSep}>·</span>
                  <span>{univers.subtopics.length} thèmes</span>
                </div>
                <h1 className={s.dHeroTitle}>{univers.name}<em>.</em></h1>
                <p className={s.dHeroTagline}>{univers.tagline}</p>
                <div className={s.dHeroSubtopics}>
                  {univers.subtopics.slice(0, 5).map((st, i) => (
                    <span key={st.slug}>{i > 0 && <span className={s.dHeroSubSep}>·</span>}{st.label}</span>
                  ))}
                  {univers.subtopics.length > 5 && <span className={s.dHeroSubMore}>+{univers.subtopics.length - 5}</span>}
                </div>
              </div>
              {featuredArticle?.imageUrl && (
                <Link to={`/article/${featuredArticle.slug}`} className={s.dHeroFeatured}>
                  <img src={sanityImg(featuredArticle.imageUrl, 800)} alt={featuredArticle.titre} className={s.dHeroFeaturedImg} />
                  <div className={s.dHeroFeaturedOverlay} />
                  <div className={s.dHeroFeaturedContent}>
                    <span className={s.dHeroFeaturedLabel}>
                      <span className={s.dHeroFeaturedLabelDot} />
                      À la une
                    </span>
                    <h2 className={s.dHeroFeaturedTitle}>{typo(featuredArticle.titre)}</h2>
                    <span className={s.dHeroFeaturedMeta}>
                      {featuredArticle.authorName || "Origines"} · {featuredArticle.tempsLecture || 5} min
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ═══ SUBTOPICS NAV (sticky) ═══ */}
        <section ref={subtopicReveal.ref} className={`${s.dSubnav} ${subtopicReveal.className}`}>
          <div className={s.dSubnavInner}>
            <div className={s.dSubnavScroll}>
              {univers.subtopics.map((st) => {
                const count = (articlesBySubtopic[st.slug] || []).length;
                return (
                  <Link key={st.slug} to={`/univers/${universId}/${st.slug}`} className={s.dSubnavChip} style={{ "--pillar-color": color } as React.CSSProperties}>
                    <span className={s.dSubnavDot} />
                    {st.label}
                    {count > 0 && <span className={s.dSubnavCount}>{count}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {loading && <div className={s.loadingWrap}><div className={s.spinner} /></div>}

        {/* ═══ FEATURED + SECONDARY PICKS ═══ */}
        {!loading && featuredArticle && (
          <section ref={featuredReveal.ref} className={`${s.dFeatured} ${featuredReveal.className}`}>
            <div className="v2-container">
              <Link to={`/article/${featuredArticle.slug}`} className={s.dFeaturedCard} style={{ "--pillar-color": color } as React.CSSProperties}>
                <div className={s.dFeaturedImgWrap}>
                  <img src={sanityImg(featuredArticle.imageUrl!, 1000)} alt={featuredArticle.titre} className={s.dFeaturedImg} loading="eager" />
                  <div className={s.dFeaturedGradient} />
                </div>
                <div className={s.dFeaturedBody}>
                  {featuredArticle.soustopic && (
                    <span className={s.dFeaturedCat}>{featuredArticle.soustopic.replace(/-/g, " ")}</span>
                  )}
                  <h2 className={s.dFeaturedTitle}>{typo(featuredArticle.titre)}</h2>
                  <p className={s.dFeaturedExcerpt}>{getExcerpt(featuredArticle)}</p>
                  <div className={s.dFeaturedFoot}>
                    <div className={s.dFeaturedFootLeft}>
                      {featuredArticle.authorName && <span className={s.dFeaturedAuthor}>{featuredArticle.authorName}</span>}
                      <span className={s.dFeaturedTime}>{featuredArticle.tempsLecture || 5} min de lecture</span>
                    </div>
                    <span className={s.dFeaturedCta}>Lire <ArrowIcon size={14} /></span>
                  </div>
                </div>
              </Link>

              {secondaryPicks.length > 0 && (
                <div className={s.dSecondary}>
                  {secondaryPicks.map((art, i) => (
                    <Link key={art._id} to={`/article/${art.slug}`} className={s.dSecondaryItem} style={{ "--i": i } as React.CSSProperties}>
                      <div className={s.dSecondaryText}>
                        <span className={s.dSecondaryMeta}>
                          <span className={s.dSecondaryDot} style={{ backgroundColor: color }} />
                          {art.soustopic ? art.soustopic.replace(/-/g, " ") : univers.name}
                        </span>
                        <h3 className={s.dSecondaryTitle}>{typo(art.titre)}</h3>
                      </div>
                      <span className={s.dSecondaryTime}>{art.tempsLecture || 5} min</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ═══ PAR THÈME ═══ */}
        {!loading && rankedSubtopics.length > 0 && (
          <section ref={bandsReveal.ref} className={`${s.dBands} ${bandsReveal.className}`}>
            <div className="v2-container">
              <header className={s.sectionHead}>
                <span className={s.sectionKicker}><span className={s.sectionKickerDot} style={{ backgroundColor: color }} />Thématiques</span>
                <h2 className={s.sectionTitle}>Explorer par <em>thème.</em></h2>
              </header>
              <div className={s.dBandsList}>
                {rankedSubtopics.slice(0, 6).map((st, i) => {
                  const stArticles = articlesBySubtopic[st.slug] || [];
                  return (
                    <div key={st.slug} className={s.dBand} style={{ "--i": i, "--pillar-color": color } as React.CSSProperties}>
                      <div className={s.dBandInfo}>
                        <Link to={`/univers/${universId}/${st.slug}`} className={s.dBandHead}>
                          <span className={s.dBandDot} />
                          <h3 className={s.dBandName}>{st.label}</h3>
                          <ArrowIcon size={12} />
                        </Link>
                        <p className={s.dBandDesc}>{st.description?.slice(0, 100)}</p>
                        <span className={s.dBandCount}>{st.count} article{st.count > 1 ? "s" : ""}</span>
                      </div>
                      <div className={s.dBandCards}>
                        {stArticles.slice(0, 3).map((art) => (
                          <Link key={art._id} to={`/article/${art.slug}`} className={s.dBandCard}>
                            {art.imageUrl ? (
                              <div className={s.dBandCardImg}>
                                <img src={sanityImg(art.imageUrl, 360)} alt={art.titre} loading="lazy" decoding="async" />
                              </div>
                            ) : (
                              <div className={s.dBandCardPlaceholder} />
                            )}
                            <h4 className={s.dBandCardTitle}>{typo(art.titre)}</h4>
                            <span className={s.dBandCardMeta}>{art.authorName || "Origines"} · {art.tempsLecture || 5} min</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              {univers.subtopics.length > 6 && (
                <div className={s.dBandsFoot}>
                  <Link to={`/univers/${universId}`} className={s.dBandsMore}>
                    Voir les {univers.subtopics.length} thèmes <ArrowIcon size={14} />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ═══ TOUS LES RÉCITS ═══ */}
        {!loading && otherArticles.length > 0 && (
          <section ref={gridReveal.ref} className={`${s.dGrid} ${gridReveal.className}`}>
            <div className="v2-container">
              <header className={s.sectionHead}>
                <span className={s.sectionKicker}><span className={s.sectionKickerDot} style={{ backgroundColor: color }} />{univers.name}</span>
                <h2 className={s.sectionTitle}>Tous les <em>récits.</em></h2>
              </header>
              <div className={s.gridMeta}>
                <span className={s.gridCount}>{otherArticles.length} articles</span>
                {totalPages > 1 && <span className={s.gridPage}>Page {currentPage} / {totalPages}</span>}
              </div>

              {currentPage === 1 && paginated.length >= 3 && (
                <div className={s.dGridLead}>
                  <Link to={`/article/${paginated[0].slug}`} className={s.dGridLeadCard} style={{ "--pillar-color": color } as React.CSSProperties}>
                    <div className={s.dGridLeadImg}>
                      {paginated[0].imageUrl ? (
                        <img src={sanityImg(paginated[0].imageUrl, 600)} alt={paginated[0].titre} loading="lazy" decoding="async" />
                      ) : (
                        <div className={s.dGridLeadPlaceholder} />
                      )}
                    </div>
                    <div className={s.dGridLeadBody}>
                      <span className={s.dGridLeadMeta}>
                        <span className={s.articleDot} style={{ backgroundColor: color }} />
                        <span className={s.articleCat}>{paginated[0].soustopic?.replace(/-/g, " ") || univers.name}</span>
                      </span>
                      <h3 className={s.dGridLeadTitle}>{typo(paginated[0].titre)}</h3>
                      <p className={s.dGridLeadExcerpt}>{getExcerpt(paginated[0])}</p>
                      <span className={s.dGridLeadAuthor}>{paginated[0].authorName || "Origines"} · {paginated[0].tempsLecture || 5} min</span>
                    </div>
                  </Link>
                  <div className={s.dGridLeadSide}>
                    {paginated.slice(1, 3).map((art) => (
                      <Link key={art._id} to={`/article/${art.slug}`} className={s.dGridLeadSideCard}>
                        {art.imageUrl && (
                          <div className={s.dGridLeadSideImg}>
                            <img src={sanityImg(art.imageUrl, 400)} alt={art.titre} loading="lazy" decoding="async" />
                          </div>
                        )}
                        <div className={s.dGridLeadSideBody}>
                          <span className={s.dGridLeadSideMeta}>
                            <span className={s.articleDot} style={{ backgroundColor: color }} />
                            <span className={s.articleCat}>{art.soustopic?.replace(/-/g, " ") || univers.name}</span>
                          </span>
                          <h3 className={s.dGridLeadSideTitle}>{typo(art.titre)}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className={s.articlesGrid}>
                {(currentPage === 1 ? paginated.slice(3) : paginated).map((art, i) => (
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

        {/* ═══ NEWSLETTER CTA ═══ */}
        <section ref={ctaReveal.ref} className={`${s.dCta} ${ctaReveal.className}`} style={{ "--pillar-color": color } as React.CSSProperties}>
          <div className={s.dCtaInner}>
            <span className={s.dCtaAccent} />
            <p className={s.dCtaLine}>Chaque dimanche, le meilleur de <em>{univers.name.replace(/^(L'|Le |Les )/, "").toLowerCase()}</em> dans votre boîte.</p>
            <EmailCapture source="newsletter" variant="dark" placeholder="Votre email" buttonText="S'inscrire" accentColor={color} />
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        {allFaqs.length > 0 && (
          <section ref={faqReveal.ref} className={`${s.faqSection} ${faqReveal.className}`} style={{ "--pillar-color": color } as React.CSSProperties}>
            <div className="v2-container">
              <header className={s.sectionHead}>
                <span className={s.sectionKicker}><span className={s.sectionKickerDot} style={{ backgroundColor: color }} />Questions fréquentes</span>
                <h2 className={s.sectionTitle}>Comprendre <em>{univers.name.replace(/^(L'|Le |Les )/, "").toLowerCase()}.</em></h2>
              </header>
              <div className={s.faqList}>
                {visibleFaqs.map((faq, i) => (
                  <details key={i} className={s.faqItem}>
                    <summary className={s.faqQuestion}>
                      <span className={s.faqQ}>{faq.question}</span>
                      <span className={s.faqToggle}>+</span>
                    </summary>
                    <div className={s.faqAnswer}>{faq.answer}</div>
                  </details>
                ))}
              </div>
              {allFaqs.length > 6 && !faqExpanded && (
                <button className={s.faqMore} onClick={() => setFaqExpanded(true)}>
                  Voir toutes les questions ({allFaqs.length}) <ArrowIcon size={12} />
                </button>
              )}
            </div>
          </section>
        )}

        {/* ═══ AUTRES UNIVERS ═══ */}
        <section ref={relatedReveal.ref} className={`${s.relatedSection} ${relatedReveal.className}`}>
          <div className="v2-container">
            <header className={s.sectionHead}>
              <span className={s.sectionKicker}><span className={s.sectionKickerDot} />Continuez</span>
              <h2 className={s.sectionTitle}>D'autres <em>univers.</em></h2>
            </header>
            <div className={s.relatedGrid}>
              {otherPillars.map((u, i) => (
                <Link key={u.id} to={`/univers/${u.id}`} className={s.relatedCard} style={{ "--pillar-color": u.color, "--i": i } as React.CSSProperties}>
                  <span className={s.relatedAccent} />
                  <span className={s.relatedKicker}><span className={s.relatedDot} />{u.subtopics.length} thèmes</span>
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
