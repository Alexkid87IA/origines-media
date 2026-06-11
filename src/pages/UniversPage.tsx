import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Brain, Compass, Globe2, HeartPulse, Rocket, Search, Sparkles, Users } from "lucide-react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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

const UNIVERS_ORDER: UniversId[] = ["esprit", "corps", "liens", "monde", "avenir"];

const UNIVERS_INTENTS = [
  {
    title: "Je veux mieux me comprendre",
    text: "Émotions, conscience, thérapies, quête de sens : entrer par ce qui se passe en vous.",
    href: "/univers/esprit",
    color: "#7B5CD6",
    icon: Brain,
    topics: ["Émotions", "Conscience", "Thérapies"],
  },
  {
    title: "Je veux prendre soin de moi",
    text: "Sommeil, nutrition, respiration, mouvement : revenir au corps sans injonction.",
    href: "/univers/corps",
    color: "#5AA352",
    icon: HeartPulse,
    topics: ["Sommeil", "Nutrition", "Respiration"],
  },
  {
    title: "Je veux comprendre mes liens",
    text: "Couple, famille, amitié, communauté : regarder ce qui nous attache et nous transforme.",
    href: "/univers/liens",
    color: "#E67839",
    icon: Users,
    topics: ["Couples", "Parentalité", "Amitié"],
  },
  {
    title: "Je veux ouvrir le regard",
    text: "Voyage, art, musique, littérature : partir du monde pour revenir autrement.",
    href: "/univers/monde",
    color: "#2E9B74",
    icon: Globe2,
    topics: ["Récits de voyage", "Art", "Cinéma"],
  },
  {
    title: "Je veux préparer la suite",
    text: "Carrière, IA, innovation, économie : comprendre ce qui change avant de le subir.",
    href: "/univers/avenir",
    color: "#2E94B5",
    icon: Rocket,
    topics: ["IA", "Carrière", "Innovation"],
  },
];

const UNIVERS_FAQ = [
  {
    question: "Quels sont les univers d'Origines Media ?",
    answer:
      "Origines Media organise ses contenus autour de cinq univers éditoriaux : L'Esprit, Le Corps, Les Liens, Le Monde et L'Avenir.",
  },
  {
    question: "À quoi sert la page Univers ?",
    answer:
      "La page Univers aide à choisir une porte d'entrée par sujet : psychologie, santé, relations, culture, voyage, travail, technologie ou société.",
  },
  {
    question: "Quelle est la différence entre Galaxie et Univers ?",
    answer:
      "La Galaxie organise les formats du média, tandis que les Univers organisent les sujets. On choisit la Galaxie pour lire, regarder ou pratiquer ; on choisit un Univers pour explorer un thème.",
  },
];

/* ================================================================== */
/*  UniversListPage                                                    */
/* ================================================================== */

function UniversListPage() {
  const [counts, setCounts] = useState<UniversCounts | null>(null);
  const intentReveal = useReveal();
  const universReveal = useReveal();
  const indexReveal = useReveal();
  const latestReveal = useReveal();

  useEffect(() => {
    sanityFetch<UniversCounts>(UNIVERS_COUNTS_QUERY).then(setCounts).catch(() => {});
  }, []);

  const totalArticles = counts ? counts.esprit + counts.corps + counts.liens + counts.monde + counts.avenir : 0;
  const totalThemes = UNIVERS.reduce((sum, u) => sum + u.subtopics.length, 0);
  const latestArticles = counts?.latest || [];
  const topicIndex = useMemo(
    () => UNIVERS.flatMap((u) => u.subtopics.slice(0, 5).map((st) => ({ ...st, univers: u }))),
    []
  );

  return (
    <>
      <SEO
        title="Tous les univers — Origines Media"
        description={totalArticles > 0
          ? `Explorez les cinq univers Origines Media : esprit, corps, liens, monde et avenir. ${totalArticles} contenus et ${totalThemes} thèmes pour trouver le bon point d'entrée.`
          : "Explorez les cinq univers Origines Media : esprit, corps, liens, monde et avenir. Une carte claire pour trouver articles, vidéos et guides par thème."
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
        faqData={UNIVERS_FAQ}
      />
      <SiteHeader />

      <main className={s.uPage}>
        <section className={s.uHero}>
          <div className="v2-container">
            <Breadcrumb items={[{ name: "Accueil", url: "/" }, { name: "Univers", url: "/univers" }]} />
            <div className={s.uHeroGrid}>
              <div className={s.uHeroText}>
                <span className={s.uKicker}>
                  <Compass size={14} aria-hidden="true" />
                  Carte des sujets
                </span>
                <h1 className={s.uHeroTitle}>Choisir le bon univers.</h1>
                <p className={s.uHeroDeck}>
                  Les univers classent tout Origines par grands territoires de
                  vie. Partez d&rsquo;une question, d&rsquo;un besoin ou d&rsquo;une
                  curiosit&eacute;, puis rejoignez les articles, vid&eacute;os et guides
                  qui vont avec.
                </p>
                <div className={s.uHeroActions}>
                  <Button as="link" to="/galaxie" variant="gradient" size="lg" withArrow>
                    Voir la galaxie
                  </Button>
                  <Button as="link" to="/articles" variant="outline" size="lg" color="#F5F5F5">
                    Derniers articles
                  </Button>
                </div>
              </div>

              <div className={s.uHeroPanel}>
                <div className={s.uPanelTop}>
                  <span>Origines index</span>
                  <span>{totalThemes} thèmes</span>
                </div>
                <div className={s.uPanelRows}>
                  {UNIVERS_ORDER.map((id, index) => {
                    const u = UNIVERS_MAP[id];
                    const count = counts ? counts[id] : 0;
                    return (
                      <Link
                        key={id}
                        to={`/univers/${id}`}
                        className={s.uPanelRow}
                        style={{ "--pillar-color": u.color } as React.CSSProperties}
                      >
                        <span className={s.uPanelIndex}>{String(index + 1).padStart(2, "0")}</span>
                        <span className={s.uPanelDot} />
                        <span className={s.uPanelName}>{u.name}</span>
                        <span className={s.uPanelCount}>{count > 0 ? `${count} contenus` : `${u.subtopics.length} thèmes`}</span>
                      </Link>
                    );
                  })}
                </div>
                <div className={s.uPanelFoot}>
                  <span>{totalArticles > 0 ? `${totalArticles.toLocaleString("fr-FR")} contenus classés` : "Articles, vidéos et guides"}</span>
                  <span>5 univers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={intentReveal.ref} className={`${s.uIntentSection} ${intentReveal.className}`}>
          <div className="v2-container">
            <header className={s.uSectionHead}>
              <span className={s.uSectionKicker}>
                <Search size={14} aria-hidden="true" />
                Par intention
              </span>
              <h2 className={s.uSectionTitle}>Vous cherchez quoi ?</h2>
            </header>
            <div className={s.uIntentGrid}>
              {UNIVERS_INTENTS.map((intent) => {
                const Icon = intent.icon;
                return (
                  <Card
                    key={intent.title}
                    className={s.uIntentCard}
                    style={{ "--pillar-color": intent.color } as React.CSSProperties}
                  >
                    <span className={s.uIntentIcon}>
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <h3 className={s.uIntentTitle}>{intent.title}</h3>
                    <p className={s.uIntentText}>{intent.text}</p>
                    <div className={s.uIntentTopics}>
                      {intent.topics.map((topic) => (
                        <span key={topic}>{topic}</span>
                      ))}
                    </div>
                    <Button as="link" to={intent.href} variant="outline" size="sm" color={intent.color} withArrow>
                      Explorer
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={universReveal.ref} className={`${s.uUniversSection} ${universReveal.className}`}>
          <div className="v2-container">
            <header className={s.uSectionHead}>
              <span className={s.uSectionKicker}>
                <Sparkles size={14} aria-hidden="true" />
                Les cinq piliers
              </span>
              <h2 className={s.uSectionTitle}>Une carte simple du site.</h2>
            </header>
            <div className={s.uUniversGrid}>
              {UNIVERS_ORDER.map((id, index) => {
                const u = UNIVERS_MAP[id];
                const count = counts ? counts[id] : 0;
                return (
                  <Card
                    key={u.id}
                    className={s.uUniversCard}
                    style={{ "--pillar-color": u.color, "--i": index } as React.CSSProperties}
                  >
                    <div className={s.uUniversAccent} />
                    <div className={s.uUniversHeader}>
                      <span className={s.uUniversNumber}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={s.uUniversCount}>{count > 0 ? `${count} contenus` : `${u.subtopics.length} thèmes`}</span>
                    </div>
                    <h3 className={s.uUniversName}>{u.name}</h3>
                    <p className={s.uUniversTagline}>{u.tagline}</p>
                    <div className={s.uUniversTopics}>
                      {u.subtopics.slice(0, 7).map((st) => (
                        <Link key={st.slug} to={`/univers/${u.id}/${st.slug}`} className={s.uTopicChip}>
                          {st.label}
                        </Link>
                      ))}
                    </div>
                    <Button as="link" to={`/univers/${u.id}`} variant="outline" size="sm" color={u.color} withArrow>
                      Voir l'univers
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section ref={indexReveal.ref} className={`${s.uIndexSection} ${indexReveal.className}`}>
          <div className="v2-container">
            <div className={s.uIndexGrid}>
              <div className={s.uIndexIntro}>
                <span className={s.uSectionKicker}>Index rapide</span>
                <h2 className={s.uIndexTitle}>Les thèmes les plus directs.</h2>
                <p className={s.uIndexText}>
                  Une entrée courte pour les recherches fréquentes : méditation,
                  sommeil, couples, IA, créativité, parentalité ou quête de sens.
                </p>
                <Button as="link" to="/articles" variant="gradient" size="md" withArrow>
                  Explorer tous les contenus
                </Button>
              </div>
              <div className={s.uIndexList}>
                {UNIVERS.map((u) => (
                  <div key={u.id} className={s.uIndexGroup}>
                    <Link to={`/univers/${u.id}`} className={s.uIndexGroupTitle} style={{ "--pillar-color": u.color } as React.CSSProperties}>
                      <span className={s.uIndexDot} />
                      {u.name}
                    </Link>
                    <div className={s.uIndexTopics}>
                      {u.subtopics.slice(0, 5).map((st) => (
                        <Link key={st.slug} to={`/univers/${u.id}/${st.slug}`} className={s.uIndexTopic}>
                          {st.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={s.uTopicCloud} aria-label="Thèmes Origines">
              {topicIndex.map((topic) => (
                <Link
                  key={`${topic.univers.id}-${topic.slug}`}
                  to={`/univers/${topic.univers.id}/${topic.slug}`}
                  className={s.uCloudItem}
                  style={{ "--pillar-color": topic.univers.color } as React.CSSProperties}
                >
                  {topic.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {latestArticles.length > 0 && (
          <section ref={latestReveal.ref} className={`${s.uLatestSection} ${latestReveal.className}`}>
            <div className="v2-container">
              <header className={s.uSectionHead}>
                <span className={s.uSectionKicker}>Récemment publiés</span>
                <h2 className={s.uSectionTitle}>Entrées fraîches.</h2>
              </header>
              <div className={s.uLatestGrid}>
                {latestArticles.slice(0, 5).map((art, i) => {
                  const uid = (art.univpilar || "esprit") as UniversId;
                  const u = UNIVERS_MAP[uid] || UNIVERS_MAP.esprit;
                  return (
                    <Link
                      key={art._id}
                      to={`/article/${art.slug}`}
                      className={`${s.uLatestCard} ${i === 0 ? s.uLatestCardLead : ""}`}
                      style={{ "--pillar-color": u.color } as React.CSSProperties}
                    >
                      {art.imageUrl && (
                        <div className={s.uLatestImage}>
                          <img src={sanityImg(art.imageUrl, i === 0 ? 900 : 520)} alt={art.titre} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
                        </div>
                      )}
                      <div className={s.uLatestBody}>
                        <span className={s.uLatestPillar}>
                          <span className={s.uLatestDot} />
                          {u.name}
                        </span>
                        <h3 className={s.uLatestTitle}>{typo(art.titre)}</h3>
                        <span className={s.uLatestMeta}>
                          {art.tempsLecture || 5} min
                          {art.authorName ? ` · ${art.authorName}` : ""}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className={s.uCtaSection}>
          <div className="v2-container">
            <div className={s.uCtaBox}>
              <div>
                <span className={s.uSectionKicker}>Encore plus simple</span>
                <h2 className={s.uCtaTitle}>Vous préférez choisir par format ?</h2>
                <p className={s.uCtaText}>
                  La Galaxie organise Origines par expérience : lire, regarder,
                  pratiquer ou garder un support pour plus tard.
                </p>
              </div>
              <Button as="link" to="/galaxie" variant="gradient" size="lg" withArrow>
                Ouvrir la galaxie
              </Button>
            </div>
          </div>
        </section>

        <div className={s.spectrumBar}>
          {UNIVERS_ORDER.map((id) => (
            <span key={id} className={s.spectrumBarSeg} style={{ backgroundColor: UNIVERS_MAP[id].color }} />
          ))}
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

  const heroArticle = articles.find((a) => a.imageUrl);
  const articlesAfterHero = articles.filter((a) => a !== heroArticle);
  const featuredArticle = articlesAfterHero.find((a) => a.imageUrl) || articlesAfterHero[0];
  const secondaryPicks = articlesAfterHero.filter((a) => a !== featuredArticle).slice(0, 3);
  const otherArticles = articlesAfterHero.filter((a) => a !== featuredArticle && !secondaryPicks.includes(a));
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
            <div className={`${s.dHeroGrid} ${!loading && !heroArticle?.imageUrl ? s.dHeroGridSolo : ""}`}>
              <div className={s.dHeroText}>
                <nav className={s.dHeroNav}>
                  <Link to="/univers" className={s.dHeroBack}><ArrowLeftIcon size={12} /> Tous les univers</Link>
                </nav>
                <div className={s.dHeroMeta}>
                  <span className={s.dHeroDot} />
                  <span>
                    {loading
                      ? "Articles en chargement"
                      : `${articles.length} article${articles.length > 1 ? "s" : ""}`}
                  </span>
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
              {heroArticle?.imageUrl ? (
                <Link to={`/article/${heroArticle.slug}`} className={s.dHeroFeatured}>
                  <img src={sanityImg(heroArticle.imageUrl, 800)} alt={heroArticle.titre} className={s.dHeroFeaturedImg} />
                  <div className={s.dHeroFeaturedOverlay} />
                  <div className={s.dHeroFeaturedContent}>
                    <span className={s.dHeroFeaturedLabel}>
                      <span className={s.dHeroFeaturedLabelDot} />
                      À la une
                    </span>
                    <h2 className={s.dHeroFeaturedTitle}>{typo(heroArticle.titre)}</h2>
                    <span className={s.dHeroFeaturedMeta}>
                      {heroArticle.authorName || "Origines"} · {heroArticle.tempsLecture || 5} min
                    </span>
                  </div>
                </Link>
              ) : loading ? (
                <div className={s.dHeroFeaturedSkeleton} aria-hidden="true">
                  <span className={s.dHeroSkeletonLine} />
                  <span className={s.dHeroSkeletonTitle} />
                  <span className={s.dHeroSkeletonText} />
                </div>
              ) : null}
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
                        <p className={s.dBandDesc}>{st.description}</p>
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
