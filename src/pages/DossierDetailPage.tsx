import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import { useSanityQuery } from "@/hooks/useSanityQuery";
import { V2_DOSSIER_DETAIL_QUERY } from "@/lib/queries";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import { smartExcerpt } from "@/lib/typography";
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
  verticaleSlug?: string;
  verticaleNom?: string;
  authorName?: string;
}

interface SanityDossier {
  question: string;
  semaine: number;
  annee: number;
  univpilar?: string;
  slug?: string;
  imageUrl?: string;
  isActive?: boolean;
  articles?: SanityArticle[];
}

function getExcerpt(a: SanityArticle): string {
  if (a.extrait) return a.extrait;
  if (a.description) return a.description;
  if (a.contenuTexte) {
    return smartExcerpt(a.contenuTexte, 180);
  }
  return "";
}

function getUniversInfo(uid?: string) {
  if (uid && uid in UNIVERS_MAP) return UNIVERS_MAP[uid as UniversId];
  return UNIVERS_MAP.esprit;
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

  if (isLoading) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.loading}>Chargement&hellip;</div>
        <Footer2 />
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.loading}>Dossier introuvable.</div>
        <Footer2 />
      </div>
    );
  }

  return (
    <div className={s.page}>
      <Helmet>
        <title>{dossier.question} — Dossiers · Origines Media</title>
        <meta
          name="description"
          content={`Dossier S.${dossier.semaine} — ${dossier.question}. ${articles.length} articles pour explorer la question sous tous les angles.`}
        />
      </Helmet>
      <SiteHeader />

      <header className={s.hero} style={{ "--dossier-color": u.color } as React.CSSProperties}>
        <div className={s.heroInner}>
          <a href="/dossiers" className={s.breadcrumb}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Tous les dossiers
          </a>
          <span className={s.heroMeta}>
            <span className={s.heroUniv} style={{ background: u.color }}>
              {u.name}
            </span>
            <span>Semaine {dossier.semaine} &middot; {dossier.annee}</span>
            {dossier.isActive && (
              <span className={s.heroActive}>En cours</span>
            )}
          </span>
          <h1 className={s.heroTitle}>{dossier.question}</h1>
          <p className={s.heroDeck}>
            {articles.length} article{articles.length > 1 ? "s" : ""} pour explorer
            cette question sous tous les angles.
          </p>
        </div>
      </header>

      <main className={s.content}>
        <div className={s.contentInner}>
          <ol className={s.articleList}>
            {articles.map((article, idx) => {
              const au = getUniversInfo(article.univpilar);
              return (
                <li key={article._id} className={s.articleItem}>
                  <a
                    href={`/article/${article.slug || ""}`}
                    className={s.articleCard}
                  >
                    <span className={s.articleNum}>{String(idx + 1).padStart(2, "0")}</span>
                    {article.imageUrl && (
                      <div className={s.articleImgWrap}>
                        <img
                          src={article.imageUrl}
                          alt={article.titre}
                          className={s.articleImg}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className={s.articleBody}>
                      <span className={s.articleMeta}>
                        <span
                          className={s.articleDot}
                          style={{ background: au.color }}
                          aria-hidden="true"
                        />
                        {au.name}
                        {article.tempsLecture && (
                          <> &middot; {article.tempsLecture} min</>
                        )}
                      </span>
                      <h2 className={s.articleTitle}>{article.titre}</h2>
                      <p className={s.articleExcerpt}>{getExcerpt(article)}</p>
                      <span className={s.articleAuthor}>
                        Par {article.authorName || "Rédaction Origines"}
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </main>

      <Footer2 />
    </div>
  );
}
