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

function getReadTime(a: SanityArticle): string | null {
  const t = estimateReadingTimeFromText(a.contenuTexte) || a.tempsLecture;
  if (!t) return null;
  return `${t} min`;
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

  const faqData = articles.slice(0, 5).map((a) => ({
    question: a.titre.includes("?") ? a.titre : `Que dit l'article « ${a.titre} » ?`,
    answer: getExcerpt(a) || `Cet article explore un angle unique de la question « ${dossier?.question} ».`,
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
            "--hero-bg": dossier.imageUrl ? `url(${imgSrc(dossier.imageUrl, 1400)})` : "none",
          } as React.CSSProperties
        }
      >
        <div className={s.heroOverlay} />
        <div className={s.heroInner}>
          <Link to="/dossiers" className={s.heroBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Tous les dossiers
          </Link>
          <div className={s.heroMeta}>
            <span className={s.heroUniv} style={{ background: u.color }}>
              {u.name}
            </span>
            <span>Semaine {dossier.semaine} &middot; {dossier.annee}</span>
            {dossier.isActive && <span className={s.heroActive}>En cours</span>}
          </div>
          <h1 className={s.heroTitle}>{dossier.question}</h1>
          <p className={s.heroDeck}>
            {dossier.chapeau ||
              `${articles.length} article${articles.length > 1 ? "s" : ""} pour explorer cette question sous tous les angles.`}
          </p>
          <div className={s.heroStats}>
            <span className={s.heroStat}>
              <strong>{articles.length}</strong> articles
            </span>
            <span className={s.heroStatSep} />
            <span className={s.heroStat}>
              <strong>{articles.reduce((sum, a) => sum + (estimateReadingTimeFromText(a.contenuTexte) || (typeof a.tempsLecture === 'number' ? a.tempsLecture : 0) || 5), 0)}</strong> min de lecture
            </span>
          </div>
        </div>
      </header>

      {/* ── Intro ── */}
      <section className={s.intro}>
        <div className={s.introInner}>
          <h2 className={s.introTitle}>Pourquoi cette question&nbsp;?</h2>
          <p className={s.introText}>
            Chaque semaine, Origines Media explore une question essentielle sous plusieurs angles
            &mdash; psychologie, science, t&eacute;moignage, soci&eacute;t&eacute;, pratique.
            D&eacute;couvrez les {articles.length} articles de ce dossier pour construire votre propre r&eacute;ponse.
          </p>
        </div>
      </section>

      {/* ── Article grid ── */}
      <main className={s.content}>
        <div className={s.contentInner}>
          <h2 className={s.contentTitle}>
            <span className={s.contentTitleCount}>{articles.length}</span>
            articles &agrave; explorer
          </h2>

          <div className={s.grid}>
            {articles.map((article, idx) => {
              const au = getUniversInfo(article.univpilar);
              const readTime = getReadTime(article);
              const heroImg = imgSrc(article.imageUrl, 640);
              const isFirst = idx === 0;

              return (
                <article
                  key={article._id}
                  className={`${s.card} ${isFirst ? s.cardFeatured : ""}`}
                >
                  <Link to={`/article/${article.slug || ""}`} className={s.cardLink}>
                    <div className={s.cardImgWrap}>
                      {heroImg ? (
                        <img
                          src={heroImg}
                          alt={article.titre}
                          className={s.cardImg}
                          loading={idx < 3 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      ) : (
                        <div className={s.cardImgPlaceholder}>
                          <span className={s.cardImgPlaceholderNum}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                      )}
                      <span className={s.cardNum}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className={s.cardBody}>
                      <div className={s.cardMeta}>
                        <span className={s.cardDot} style={{ background: au.color }} />
                        <span>{au.name}</span>
                        {readTime && (
                          <>
                            <span className={s.cardMetaSep}>&middot;</span>
                            <span>{readTime}</span>
                          </>
                        )}
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

      {/* ── FAQ ── */}
      {faqData.length > 0 && (
        <section className={s.faqSection}>
          <div className={s.faqInner}>
            <h2 className={s.faqTitle}>Questions fr&eacute;quentes</h2>
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
            <h2 className={s.relatedTitle}>Dossiers dans le m&ecirc;me univers</h2>
            <div className={s.relatedGrid}>
              {related.map((rd) => {
                const ru = getUniversInfo(rd.univpilar);
                return (
                  <Link
                    key={rd.slug}
                    to={`/dossiers/${rd.slug}`}
                    className={s.relatedCard}
                    style={{ "--rel-color": ru.color } as React.CSSProperties}
                  >
                    <span className={s.relatedCardAccent} style={{ background: ru.color }} />
                    <div className={s.relatedCardBody}>
                      <span className={s.relatedCardMeta}>
                        S.{rd.semaine} &middot; {rd.articleCount || 0} articles
                      </span>
                      <h3 className={s.relatedCardTitle}>{rd.question}</h3>
                    </div>
                    <span className={s.relatedCardArrow}>&rarr;</span>
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
