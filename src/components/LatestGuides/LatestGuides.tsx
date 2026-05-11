import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sanityFetch } from "@/lib/sanity";
import { sanityImg } from "@/lib/sanityImage";
import { RT } from "@/lib/queries";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./LatestGuides.module.css";

interface GuideItem {
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
  *[_type == "production" && rubrique == "guides" && defined(image.asset)] | order(datePublication desc) [0...3] {
    _id, titre, description,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    univpilar, ${RT},
    "authorName": coalesce(author->name, author)
  }
`;

function uLabel(id?: string) {
  return id ? UNIVERS_MAP[id as UniversId]?.label ?? null : null;
}
function uColor(id?: string) {
  return id ? UNIVERS_MAP[id as UniversId]?.color ?? "var(--stone500)" : "var(--stone500)";
}

export default function LatestGuides() {
  const [items, setItems] = useState<GuideItem[]>([]);

  useEffect(() => {
    sanityFetch<GuideItem[]>(QUERY).then((d) => setItems(d || []));
  }, []);

  if (!items.length) return null;

  return (
    <section className={s.section}>
      <div className={s.chapterMark}>
        <span className={s.cNum}>Ch.04</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Nos guides</span>
        <Link to="/guides" className={s.seeAll}>
          Tous les guides <span className={s.arrow}>→</span>
        </Link>
      </div>

      <div className={s.list}>
        {items.map((g, i) => (
          <Link
            key={g._id}
            to={`/article/${g.slug}`}
            className={s.card}
            style={{ "--i": i, "--accent": uColor(g.univpilar) } as React.CSSProperties}
          >
            <div className={s.cardAccent} />
            <div className={s.cardImgWrap}>
              <img
                src={sanityImg(g.imageUrl, 400) || "/placeholder.svg"}
                alt={g.titre}
                className={s.cardImg}
                loading="lazy"
              />
            </div>
            <div className={s.cardBody}>
              <div className={s.cardMeta}>
                {uLabel(g.univpilar) && (
                  <span className={s.cardUnivers} style={{ color: uColor(g.univpilar) }}>
                    {uLabel(g.univpilar)}
                  </span>
                )}
                {g.tempsLecture && (
                  <>
                    <span className={s.cardSep}>·</span>
                    <span className={s.cardTime}>{g.tempsLecture} min de lecture</span>
                  </>
                )}
              </div>
              <h3 className={s.cardTitle}>{g.titre}</h3>
              {g.description && (
                <p className={s.cardDeck}>{g.description}</p>
              )}
              <span className={s.cardCta}>
                Lire le guide <span className={s.ctaArrow}>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
