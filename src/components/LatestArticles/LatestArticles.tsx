import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sanityFetch } from "@/lib/sanity";
import { sanityImg } from "@/lib/sanityImage";
import { RT } from "@/lib/queries";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./LatestArticles.module.css";

interface ArticleItem {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  univpilar?: string;
  tempsLecture?: number;
  authorName?: string;
  description?: string;
}

const QUERY = `
  *[_type == "production" && defined(image.asset) && coalesce(typeArticle, "article") != "video" && rubrique != "guides"] | order(datePublication desc) [0...5] {
    _id, titre, description,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url),
    univpilar, ${RT},
    "authorName": author->name
  }
`;

function uLabel(id?: string) {
  return id ? UNIVERS_MAP[id as UniversId]?.label ?? null : null;
}
function uColor(id?: string) {
  return id ? UNIVERS_MAP[id as UniversId]?.color ?? "var(--stone500)" : "var(--stone500)";
}

export default function LatestArticles() {
  const [items, setItems] = useState<ArticleItem[]>([]);

  useEffect(() => {
    sanityFetch<ArticleItem[]>(QUERY).then((d) => setItems(d || []));
  }, []);

  if (!items.length) return null;

  const hero = items[0];
  const rest = items.slice(1, 5);

  return (
    <section className={s.section}>
      <div className={s.chapterMark}>
        <span className={s.cNum}>Ch.02</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Derniers articles</span>
        <Link to="/articles" className={s.seeAll}>
          Tous les articles <span className={s.arrow}>→</span>
        </Link>
      </div>

      <div className={s.grid}>
        {/* Hero card */}
        <Link to={`/article/${hero.slug}`} className={s.heroCard}>
          <img
            src={sanityImg(hero.imageUrl, 800) || "/placeholder.svg"}
            alt={hero.titre}
            className={s.heroImg}
            loading="lazy"
          />
          <div className={s.heroGradient} />
          <div className={s.heroBody}>
            {uLabel(hero.univpilar) && (
              <span className={s.heroKicker} style={{ color: uColor(hero.univpilar) }}>
                {uLabel(hero.univpilar)}
              </span>
            )}
            <h3 className={s.heroTitle}>{hero.titre}</h3>
            {hero.description && (
              <p className={s.heroDeck}>{hero.description}</p>
            )}
            <div className={s.heroMeta}>
              {hero.authorName && <span>{hero.authorName}</span>}
              {hero.tempsLecture && (
                <>
                  <span className={s.dot}>·</span>
                  <span>{hero.tempsLecture} min</span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Side stack */}
        <div className={s.stack}>
          {rest.map((a, i) => (
            <Link key={a._id} to={`/article/${a.slug}`} className={s.card} style={{ "--i": i } as React.CSSProperties}>
              <div className={s.cardImgWrap}>
                <img
                  src={sanityImg(a.imageUrl, 400) || "/placeholder.svg"}
                  alt={a.titre}
                  className={s.cardImg}
                  loading="lazy"
                />
              </div>
              <div className={s.cardBody}>
                <div className={s.cardMeta}>
                  {uLabel(a.univpilar) && (
                    <span className={s.cardUnivers} style={{ color: uColor(a.univpilar) }}>
                      {uLabel(a.univpilar)}
                    </span>
                  )}
                  {a.tempsLecture && (
                    <>
                      <span className={s.cardSep}>·</span>
                      <span className={s.cardTime}>{a.tempsLecture} min</span>
                    </>
                  )}
                </div>
                <h4 className={s.cardTitle}>{a.titre}</h4>
                {a.authorName && (
                  <span className={s.cardAuthor}>{a.authorName}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
