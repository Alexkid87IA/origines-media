import { useParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { useSanityQuery } from "@/hooks/useSanityQuery";
import { V2_DOSSIER_DETAIL_QUERY } from "@/lib/queries";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import { smartExcerpt, estimateReadingTimeFromText } from "@/lib/typography";
import { sanityImg } from "@/lib/sanityImage";
import Breadcrumb from "@/components/ui/Breadcrumb";
import s from "./DossierDetailPage.module.css";

interface SanityArticle {
  _id: string;
  titre: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  imageUrl?: string;
  slug?: string;
  datePublication?: string;
  tempsLecture?: number;
  univpilar?: string;
  soustopic?: string;
  tags?: string[];
  verticaleSlug?: string;
  verticaleNom?: string;
  authorName?: string;
}

interface RelatedDossier {
  question: string;
  semaine: number;
  annee: number;
  univpilar?: string;
  slug?: string;
  articleCount?: number;
  imageUrl?: string;
}

interface SanityDossier {
  question: string;
  semaine: number;
  annee: number;
  univpilar?: string;
  slug?: string;
  chapeau?: string;
  seoDescription?: string;
  imageUrl?: string;
  isActive?: boolean;
  articles?: SanityArticle[];
  relatedDossiers?: RelatedDossier[];
}

function getExcerpt(a: SanityArticle): string {
  if (a.extrait) return a.extrait;
  if (a.description) return a.description;
  if (a.contenuTexte) return smartExcerpt(a.contenuTexte, 200);
  return "";
}

function getUniversInfo(uid?: string) {
  if (uid && uid in UNIVERS_MAP) return UNIVERS_MAP[uid as UniversId];
  return UNIVERS_MAP.esprit;
}

function getReadTime(a: SanityArticle): number {
  return estimateReadingTimeFromText(a.contenuTexte) || a.tempsLecture || 5;
}

function imgSrc(url?: string, w = 800): string | undefined {
  if (!url) return undefined;
  return url.includes("sanity.io") ? sanityImg(url, w) : url;
}

export default function DossierDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: dossier, isLoading } = useSanityQuery<SanityDossier>(
    ["v2-dossier", slug || ""],
    V2_DOSSIER_DETAIL_QUERY,
    { params: { slug } }
  );

  const u = getUniversInfo(dossier?.univpilar);
  const articles = dossier?.articles || [];
  const related = dossier?.relatedDossiers || [];
  const firstArticle = articles[0];
  const restArticles = articles.slice(1);
  const totalReadTime = articles.reduce((sum, a) => sum + getReadTime(a), 0);

  const faqData = articles.slice(0, 5).map((a) => ({
    question: a.titre.includes("?") ? a.titre : `Que dit l’article « ${a.titre} » ?`,
    answer: getExcerpt(a) || `Cet article explore un angle unique de la question « ${dossier?.question} ».`,
  }));

  if (isLoading) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.loading}>
          <div className={s.spinner} />
        </div>
        <Footer2 />
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.errorWrap}>
          <h1 className={s.errorTitle}>Dossier introuvable</h1>
          <p className={s.errorMsg}>Ce dossier n&rsquo;existe pas ou a &eacute;t&eacute; retir&eacute;.</p>
          <Link to="/dossiers" className={s.errorBack}>&larr; Tous les dossiers</Link>
        </div>
        <Footer2 />
      </div>
    );
  }

  const metaDesc =
    dossier.seoDescription ||
    dossier.chapeau ||
    `${dossier.question} — ${articles.length} articles pour explorer cette question sous tous les angles.`;

  return (
    <div className={s.page}>
      <SEO
        title={`${dossier.question} — Dossiers · Origines Media`}
        description={metaDesc}
        url={`/dossiers/${dossier.slug || slug}`}
        image={dossier.imageUrl}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Dossiers", url: "/dossiers" },
          { name: dossier.question, url: `/dossiers/${dossier.slug || slug}` },
        ]}
        faqData={faqData}
      />
      <SiteHeader />

      <div className="v2-container">
        <Breadcrumb
          items={[
            { name: "Accueil", url: "/" },
            { name: "Dossiers", url: "/dossiers" },
            { name: dossier.question, url: `/dossiers/${dossier.slug || slug}` },
          ]}
        />
      </div>

      {/* ── Hero ── */}
      <header
        className={s.hero}
        style={
          {
            "--dossier-color": u.color,
            "--hero-bg": dossier.imageUrl
              ? `url(${imgSrc(dossier.imageUrl, 1600)})`
              : firstArticle?.imageUrl
                ? `url(${imgSrc(firstArticle.imageUrl, 1600)})`
                : "none",
          } as React.CSSProperties
        }
      >
        <div className={s.heroOverlay} />
        <div className={s.heroAccentGlow} />
        <div className={s.heroContent}>
          <Link to="/dossiers" className={s.heroBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Tous les dossiers
          </Link>

          <div className={s.heroTopLine}>
            <span className={s.heroUnivBadge}>{u.name}</span>
            <span className={s.heroWeek}>Semaine {dossier.semaine} &middot; {dossier.annee}</span>
            {dossier.isActive && (
              <span className={s.heroActivePill}>En cours</span>
            )}
          </div>

          <h1 className={s.heroTitle}>{dossier.question}</h1>

          <p className={s.heroDeck}>
            {dossier.chapeau ||
              `${articles.length} article${articles.length > 1 ? "s" : ""} pour explorer cette question sous tous les angles.`}
          </p>

          <div className={s.heroStatsRow}>
            <div className={s.heroStatBlock}>
              <span className={s.heroStatNum}>{articles.length}</span>
              <span className={s.heroStatLabel}>articles</span>
            </div>
            <span className={s.heroStatDivider} />
            <div className={s.heroStatBlock}>
              <span className={s.heroStatNum}>{totalReadTime}</span>
              <span className={s.heroStatLabel}>min de lecture</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Sommaire ── */}
      <section className={s.sommaire}>
        <div className={s.sommaireInner}>
          <div className={s.sommaireLeft}>
            <p className={s.sommaireLabel}>Ce dossier</p>
            <h2 className={s.sommaireQuestion}>Pourquoi cette question&nbsp;?</h2>
          </div>
          <div className={s.sommaireRight}>
            <p className={s.sommaireText}>
              {dossier.chapeau ||
                `Chaque semaine, Origines Media explore une question essentielle sous plusieurs angles — psychologie, science, témoignage, société, pratique. Découvrez les ${articles.length} articles de ce dossier pour construire votre propre réponse.`}
            </p>
          </div>
        </div>
      </section>

      {/* ── Timeline index ── */}
      <section className={s.timeline} style={{ "--dossier-color": u.color } as React.CSSProperties}>
        <div className={s.timelineInner}>
          <div className={s.timelineHeader}>
            <span className={s.timelineCount}>{articles.length}</span>
            <span className={s.timelineLabel}>articles &agrave; explorer</span>
          </div>
          <div className={s.timelineList}>
            {articles.map((article, idx) => {
              const au = getUniversInfo(article.univpilar);
              const rt = getReadTime(article);
              return (
                <Link
                  key={article._id}
                  to={`/article/${article.slug || ""}`}
                  className={s.timelineItem}
                >
                  <span className={s.timelineNum}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className={s.timelineItemContent}>
                    <div className={s.timelineItemMeta}>
                      <span className={s.timelineItemDot} style={{ background: au.color }} />
                      <span className={s.timelineItemUniv}>{au.name}</span>
                      <span className={s.timelineItemTime}>&middot; {rt} min</span>
                    </div>
                    <h3 className={s.timelineItemTitle}>{article.titre}</h3>
                  </div>
                  <span className={s.timelineArrow}>Lire &rarr;</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured first article ── */}
      {firstArticle && (
        <section className={s.featured} style={{ "--dossier-color": u.color } as React.CSSProperties}>
          <div className={s.featuredInner}>
            <p className={s.featuredLabel}>Article phare</p>
            <Link to={`/article/${firstArticle.slug || ""}`} className={s.featuredCard}>
              <div className={s.featuredImgWrap}>
                {imgSrc(firstArticle.imageUrl, 900) ? (
                  <img
                    src={imgSrc(firstArticle.imageUrl, 900)!}
                    alt={firstArticle.titre}
                    className={s.featuredImg}
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <div className={s.featuredImgPlaceholder}>
                    <span className={s.featuredImgPlaceholderNum}>01</span>
                  </div>
                )}
                <span className={s.featuredImgNum}>01</span>
              </div>
              <div className={s.featuredBody}>
                <div className={s.featuredMeta}>
                  <span className={s.featuredDot} style={{ background: getUniversInfo(firstArticle.univpilar).color }} />
                  <span className={s.featuredMetaText}>
                    {getUniversInfo(firstArticle.univpilar).name} &middot; {getReadTime(firstArticle)} min
                  </span>
                </div>
                <h3 className={s.featuredTitle}>{firstArticle.titre}</h3>
                <p className={s.featuredExcerpt}>{getExcerpt(firstArticle)}</p>
                <div className={s.featuredFoot}>
                  <span className={s.featuredAuthor}>
                    Par {firstArticle.authorName || "Rédaction Origines"}
                  </span>
                  <span className={s.featuredCta}>Lire l&rsquo;article &rarr;</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── Remaining articles grid ── */}
      {restArticles.length > 0 && (
        <main className={s.content} style={{ "--dossier-color": u.color } as React.CSSProperties}>
          <div className={s.contentInner}>
            <h2 className={s.contentTitle}>Continuer la lecture</h2>

            <div className={s.grid}>
              {restArticles.map((article, idx) => {
                const au = getUniversInfo(article.univpilar);
                const readTime = getReadTime(article);
                const heroImg = imgSrc(article.imageUrl, 640);
                const num = idx + 2;

                return (
                  <article key={article._id} className={s.card}>
                    <Link to={`/article/${article.slug || ""}`} className={s.cardLink}>
                      <div className={s.cardImgWrap}>
                        {heroImg ? (
                          <img
                            src={heroImg}
                            alt={article.titre}
                            className={s.cardImg}
                            loading={idx < 4 ? "eager" : "lazy"}
                            decoding="async"
                          />
                        ) : (
                          <div className={s.cardImgPlaceholder}>
                            <span className={s.cardImgPlaceholderNum}>
                              {String(num).padStart(2, "0")}
                            </span>
                          </div>
                        )}
                        <span className={s.cardNum}>
                          {String(num).padStart(2, "0")}
                        </span>
                      </div>
                      <div className={s.cardBody}>
                        <div className={s.cardMeta}>
                          <span className={s.cardDot} style={{ background: au.color }} />
                          <span>{au.name}</span>
                          <span className={s.cardMetaSep}>&middot;</span>
                          <span>{readTime} min</span>
                        </div>
                        <h3 className={s.cardTitle}>{article.titre}</h3>
                        <p className={s.cardExcerpt}>{getExcerpt(article)}</p>
                        <div className={s.cardFoot}>
                          <span className={s.cardAuthor}>
                            Par {article.authorName || "Rédaction Origines"}
                          </span>
                          <span className={s.cardCta}>Lire &rarr;</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* ── FAQ ── */}
      {faqData.length > 0 && (
        <section className={s.faqSection} style={{ "--dossier-color": u.color } as React.CSSProperties}>
          <div className={s.faqInner}>
            <div className={s.faqHeader}>
              <p className={s.faqLabel}>FAQ</p>
              <h2 className={s.faqTitle}>Questions fr&eacute;quentes</h2>
            </div>
            <div className={s.faqList}>
              {faqData.map((item, i) => (
                <details key={i} className={s.faqItem}>
                  <summary className={s.faqQuestion}>{item.question}</summary>
                  <p className={s.faqAnswer}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related dossiers ── */}
      {related.length > 0 && (
        <section className={s.relatedSection}>
          <div className={s.relatedInner}>
            <div className={s.relatedHeader}>
              <p className={s.relatedLabel}>Explorer aussi</p>
              <h2 className={s.relatedTitle}>Dossiers dans le m&ecirc;me univers</h2>
            </div>
            <div className={s.relatedGrid}>
              {related.map((rd) => {
                const ru = getUniversInfo(rd.univpilar);
                const rdImg = imgSrc(rd.imageUrl, 480);
                return (
                  <Link
                    key={rd.slug}
                    to={`/dossiers/${rd.slug}`}
                    className={s.relatedCard}
                  >
                    <span className={s.relatedCardAccent} style={{ background: ru.color }} />
                    {rdImg && (
                      <div className={s.relatedCardImgWrap}>
                        <img src={rdImg} alt={rd.question} className={s.relatedCardImg} loading="lazy" decoding="async" />
                      </div>
                    )}
                    <div className={s.relatedCardBody}>
                      <span className={s.relatedCardMeta}>
                        S.{rd.semaine} &middot; {rd.articleCount || 0} articles
                      </span>
                      <h3 className={s.relatedCardTitle}>{rd.question}</h3>
                    </div>
                    <span className={s.relatedCardArrow}>Lire &rarr;</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className={s.ctaSection}>
        <div className={s.ctaInner}>
          <p className={s.ctaText}>D&eacute;couvrez tous nos dossiers th&eacute;matiques</p>
          <Link to="/dossiers" className={s.ctaLink}>
            &larr; Tous les dossiers
          </Link>
        </div>
      </section>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
