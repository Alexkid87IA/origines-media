import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { sanityFetch } from "@/lib/sanity";
import { sanityImg } from "@/lib/sanityImage";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./LatestVideos.module.css";

interface VideoItem {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  duree?: string;
  univpilar?: string;
  description?: string;
}

const QUERY = `
  *[_type == "production" && typeArticle == "video" && defined(image.asset)] | order(datePublication desc) [0...4] {
    _id, titre, description,
    "slug": slug.current,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    duree, univpilar
  }
`;

function uLabel(id?: string) {
  return id ? UNIVERS_MAP[id as UniversId]?.label ?? null : null;
}
function uColor(id?: string) {
  return id ? UNIVERS_MAP[id as UniversId]?.color ?? "var(--stone500)" : "var(--stone500)";
}

export default function LatestVideos() {
  const [items, setItems] = useState<VideoItem[]>([]);

  useEffect(() => {
    sanityFetch<VideoItem[]>(QUERY).then((d) => setItems(d || []));
  }, []);

  if (!items.length) return null;

  const hero = items[0];
  const rest = items.slice(1, 4);

  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.chapterMark}>
          <span className={s.cNum}>Ch.03</span>
          <span className={s.cSep}>/</span>
          <span className={s.cLabel}>Dernières vidéos</span>
          <Link to="/videos" className={s.seeAll}>
            Toutes les vidéos <span className={s.arrow}>→</span>
          </Link>
        </div>

        {/* Featured video */}
        <Link to={`/article/${hero.slug}`} className={s.hero}>
          <img
            src={sanityImg(hero.imageUrl, 1200) || "/placeholder.svg"}
            alt={hero.titre}
            className={s.heroImg}
            loading="lazy"
          />
          <div className={s.heroOverlay} />
          <div className={s.heroPlay}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={s.heroPlayIcon}>
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </div>
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
              {hero.duree && <span>{hero.duree}</span>}
              <span className={s.heroMetaDot}>·</span>
              <span>Vidéo</span>
            </div>
          </div>
        </Link>

        {/* Secondary videos */}
        {rest.length > 0 && (
          <div className={s.grid}>
            {rest.map((v, i) => (
              <Link
                key={v._id}
                to={`/article/${v.slug}`}
                className={s.card}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className={s.cardVisual}>
                  <img
                    src={sanityImg(v.imageUrl, 600) || "/placeholder.svg"}
                    alt={v.titre}
                    className={s.cardImg}
                    loading="lazy"
                  />
                  <div className={s.cardOverlay} />
                  <div className={s.cardPlay}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className={s.cardPlayIcon}>
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  </div>
                  {v.duree && (
                    <span className={s.cardDuration}>{v.duree}</span>
                  )}
                </div>
                <div className={s.cardBody}>
                  {uLabel(v.univpilar) && (
                    <span className={s.cardKicker} style={{ color: uColor(v.univpilar) }}>
                      {uLabel(v.univpilar)}
                    </span>
                  )}
                  <h3 className={s.cardTitle}>{v.titre}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
