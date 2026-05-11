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

  return (
    <section className={s.section}>
      <div className={s.chapterMark}>
        <span className={s.cNum}>Ch.03</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Dernières vidéos</span>
        <Link to="/videos" className={s.seeAll}>
          Toutes les vidéos <span className={s.arrow}>→</span>
        </Link>
      </div>

      <div className={s.grid}>
        {items.map((v, i) => (
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
              <div className={s.playBtn}>
                <svg viewBox="0 0 24 24" fill="currentColor" className={s.playIcon}>
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              </div>
              {v.duree && (
                <span className={s.duration}>{v.duree}</span>
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
    </section>
  );
}
