import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sanityFetch } from "@/lib/sanity";
import { sanityImg } from "@/lib/sanityImage";
import { RT } from "@/lib/queries";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./LatestContent.module.css";

/* ── Types ── */

interface ArticleItem {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  univpilar?: string;
  tempsLecture?: number;
  authorName?: string;
  typeArticle?: string;
  videoUrl?: string;
  duree?: string;
}

interface VideoItem {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  duree?: string;
  univpilar?: string;
}

interface GuideItem {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  univpilar?: string;
  tempsLecture?: number;
  authorName?: string;
}

interface DossierItem {
  question: string;
  slug: string;
  imageUrl?: string;
  univpilar?: string;
  articleCount: number;
}

/* ── Queries ── */

const ARTICLES_QUERY = `
  *[_type == "production" && defined(image.asset) && coalesce(typeArticle, "article") != "video" && rubrique != "guides"] | order(datePublication desc) [0...6] {
    _id, titre,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url),
    univpilar, ${RT},
    "authorName": author->name
  }
`;

const VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video" && defined(image.asset)] | order(datePublication desc) [0...4] {
    _id, titre,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    duree, univpilar
  }
`;

const GUIDES_QUERY = `
  *[_type == "production" && rubrique == "guides" && defined(image.asset)] | order(datePublication desc) [0...3] {
    _id, titre,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    univpilar, ${RT},
    "authorName": coalesce(author->name, author)
  }
`;

const DOSSIERS_QUERY = `
  *[_type == "questionDeLaSemaine"] | order(annee desc, semaine desc) [0...3] {
    question, univpilar,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url),
    "articleCount": count(articles)
  }
`;

/* ── Helpers ── */

function universLabel(id?: string) {
  if (!id) return null;
  return UNIVERS_MAP[id as UniversId]?.label ?? null;
}

function universColor(id?: string) {
  if (!id) return "var(--stone500)";
  return UNIVERS_MAP[id as UniversId]?.color ?? "var(--stone500)";
}

/* ── Section header ── */

function SectionHead({ kicker, title, href, linkLabel }: {
  kicker: string;
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className={s.head}>
      <div>
        <div className={s.kicker}>
          <span className={s.kickerDot} />
          {kicker}
        </div>
        <h2 className={s.title}>{title}</h2>
      </div>
      <Link to={href} className={s.seeAll}>
        {linkLabel} <span className={s.arrow}>→</span>
      </Link>
    </div>
  );
}

/* ── Component ── */

export default function LatestContent() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [dossiers, setDossiers] = useState<DossierItem[]>([]);

  useEffect(() => {
    Promise.all([
      sanityFetch<ArticleItem[]>(ARTICLES_QUERY),
      sanityFetch<VideoItem[]>(VIDEOS_QUERY),
      sanityFetch<GuideItem[]>(GUIDES_QUERY),
      sanityFetch<DossierItem[]>(DOSSIERS_QUERY),
    ]).then(([a, v, g, d]) => {
      setArticles(a || []);
      setVideos(v || []);
      setGuides(g || []);
      setDossiers(d || []);
    });
  }, []);

  return (
    <>
      {/* ═══ Derniers articles ═══ */}
      {articles.length > 0 && (
        <section className={s.section}>
          <SectionHead
            kicker="Publications"
            title="Derniers articles"
            href="/articles"
            linkLabel="Tous les articles"
          />
          <div className={s.grid}>
            {articles.map((a) => (
              <Link key={a._id} to={`/article/${a.slug}`} className={s.card}>
                <div className={s.cardThumb}>
                  <img
                    src={sanityImg(a.imageUrl, 480) || "/placeholder.svg"}
                    alt={a.titre}
                    className={s.cardImg}
                    loading="lazy"
                  />
                </div>
                <div className={s.cardBody}>
                  <div className={s.cardMeta}>
                    {universLabel(a.univpilar) && (
                      <span className={s.cardUnivers} style={{ color: universColor(a.univpilar) }}>
                        {universLabel(a.univpilar)}
                      </span>
                    )}
                    {a.tempsLecture ? (
                      <>
                        <span className={s.cardSep}>&middot;</span>
                        <span className={s.cardTime}>{a.tempsLecture} min</span>
                      </>
                    ) : null}
                  </div>
                  <h3 className={s.cardTitle}>{a.titre}</h3>
                  {a.authorName && (
                    <span className={s.cardAuthor}>{a.authorName}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Vidéos récentes ═══ */}
      {videos.length > 0 && (
        <section className={s.section}>
          <SectionHead
            kicker="Vidéo"
            title="Dernières vidéos"
            href="/videos"
            linkLabel="Toutes les vidéos"
          />
          <div className={s.grid4}>
            {videos.map((v) => (
              <Link key={v._id} to={`/article/${v.slug}`} className={s.card}>
                <div className={s.cardThumb}>
                  <img
                    src={sanityImg(v.imageUrl, 480) || "/placeholder.svg"}
                    alt={v.titre}
                    className={s.cardImg}
                    loading="lazy"
                  />
                  <span className={s.videoBadge}>
                    <svg className={s.playIcon} viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                    {v.duree || "Vidéo"}
                  </span>
                </div>
                <div className={s.cardBody}>
                  {universLabel(v.univpilar) && (
                    <div className={s.cardMeta}>
                      <span className={s.cardUnivers} style={{ color: universColor(v.univpilar) }}>
                        {universLabel(v.univpilar)}
                      </span>
                    </div>
                  )}
                  <h3 className={s.cardTitle}>{v.titre}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Guides ═══ */}
      {guides.length > 0 && (
        <section className={s.section}>
          <SectionHead
            kicker="Guides"
            title="Nos derniers guides"
            href="/guides"
            linkLabel="Tous les guides"
          />
          <div className={s.grid}>
            {guides.map((g) => (
              <Link key={g._id} to={`/article/${g.slug}`} className={s.card}>
                <div className={s.cardThumb}>
                  <img
                    src={sanityImg(g.imageUrl, 480) || "/placeholder.svg"}
                    alt={g.titre}
                    className={s.cardImg}
                    loading="lazy"
                  />
                </div>
                <div className={s.cardBody}>
                  <div className={s.cardMeta}>
                    {universLabel(g.univpilar) && (
                      <span className={s.cardUnivers} style={{ color: universColor(g.univpilar) }}>
                        {universLabel(g.univpilar)}
                      </span>
                    )}
                    {g.tempsLecture ? (
                      <>
                        <span className={s.cardSep}>&middot;</span>
                        <span className={s.cardTime}>{g.tempsLecture} min</span>
                      </>
                    ) : null}
                  </div>
                  <h3 className={s.cardTitle}>{g.titre}</h3>
                  {g.authorName && (
                    <span className={s.cardAuthor}>{g.authorName}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Dossiers ═══ */}
      {dossiers.length > 0 && (
        <section className={s.section}>
          <SectionHead
            kicker="Dossiers"
            title="Questions en cours"
            href="/dossiers"
            linkLabel="Tous les dossiers"
          />
          <div className={s.grid}>
            {dossiers.map((d) => (
              <Link key={d.slug} to={`/dossier/${d.slug}`} className={s.dossierCard}>
                {d.imageUrl && (
                  <img
                    src={sanityImg(d.imageUrl, 480) || "/placeholder.svg"}
                    alt={d.question}
                    className={s.dossierImg}
                    loading="lazy"
                  />
                )}
                <div className={s.dossierBody}>
                  <span className={s.dossierKicker}>
                    {universLabel(d.univpilar) || "Dossier"}
                  </span>
                  <h3 className={s.dossierTitle}>{d.question}</h3>
                  <span className={s.dossierCount}>
                    {d.articleCount} article{d.articleCount > 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
