import { useState, useEffect, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
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
  datePublication?: string;
}

const QUERY = `
  *[_type == "production" && typeArticle == "video" && defined(image.asset)] | order(datePublication desc) [0...4] {
    _id, titre, description, datePublication,
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

function formatDate(value?: string) {
  if (!value) return null;

  try {
    return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(value));
  } catch {
    return null;
  }
}

function deckOf(video: VideoItem) {
  return video.description || "Un format vidéo Origines pour écouter une histoire, une idée ou un basculement jusqu'au bout.";
}

function VideoMeta({ video, compact = false }: { video: VideoItem; compact?: boolean }) {
  const univers = uLabel(video.univpilar);
  const date = formatDate(video.datePublication);
  const parts = [date, video.duree, compact ? null : "Vidéo"].filter(Boolean);

  return (
    <div className={s.metaLine}>
      {univers && (
        <span className={s.univers} style={{ "--accent": uColor(video.univpilar) } as CSSProperties}>
          <span className={s.universDot} />
          {univers}
        </span>
      )}
      {parts.length > 0 && <span className={s.metaText}>{parts.join(" / ")}</span>}
    </div>
  );
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
    <section className={s.section} aria-labelledby="latest-videos-title">
      <div className={s.inner}>
        <div className={s.chapterMark}>
          <span className={s.cNum}>Ch.03</span>
          <span className={s.cSep}>/</span>
          <span className={s.cLabel}>Dernières vidéos</span>
          <Link to="/videos" className={s.seeAll}>
            Toutes les vidéos <ArrowRight className={s.arrow} aria-hidden="true" />
          </Link>
        </div>

        <header className={s.editorialHeader}>
          <div>
            <span className={s.sectionKicker}>À voir maintenant</span>
            <h2 id="latest-videos-title" className={s.sectionTitle}>
              Des récits vidéo à regarder jusqu'au bout.
            </h2>
          </div>
          <p className={s.sectionDeck}>
            Témoignages, entretiens et formats longs : l'image garde l'intensité, le texte donne la profondeur.
          </p>
        </header>

        <div className={s.videoLayout}>
          <Card
            href={`/article/${hero.slug}`}
            variant="outlined"
            size="sm"
            className={s.hero}
            style={{ "--accent": uColor(hero.univpilar) } as CSSProperties}
          >
            <div className={s.heroFrame}>
              <img
                src={sanityImg(hero.imageUrl, 1200) || "/placeholder.svg"}
                alt={hero.titre}
                className={s.heroImg}
                loading="lazy"
              />
              <div className={s.heroOverlay} />
              <span className={s.heroLabel}>Grand format</span>
              <span className={s.heroDuration}>{hero.duree || "Vidéo"}</span>
              <span className={s.heroPlay} aria-hidden="true">
                <Play className={s.heroPlayIcon} fill="currentColor" />
              </span>
            </div>

            <div className={s.heroBody}>
              <VideoMeta video={hero} />
              <h3 className={s.heroTitle}>{hero.titre}</h3>
              <p className={s.heroDeck}>{deckOf(hero)}</p>
              <span className={s.watchLink}>
                Lancer la vidéo <ArrowRight className={s.watchArrow} aria-hidden="true" />
              </span>
            </div>
          </Card>

          <div className={s.playlist}>
            <div className={s.playlistHead}>
              <span>Playlist</span>
              <span>{rest.length} vidéos</span>
            </div>

            {rest.map((video, index) => (
              <Card
                key={video._id}
                href={`/article/${video.slug}`}
                variant="outlined"
                size="sm"
                className={s.queueCard}
                style={{ "--i": index, "--accent": uColor(video.univpilar) } as CSSProperties}
              >
                <div className={s.queueVisual}>
                  <img
                    src={sanityImg(video.imageUrl, 520) || "/placeholder.svg"}
                    alt={video.titre}
                    className={s.queueImg}
                    loading="lazy"
                  />
                  <span className={s.queuePlay} aria-hidden="true">
                    <Play className={s.queuePlayIcon} fill="currentColor" />
                  </span>
                </div>
                <div className={s.queueBody}>
                  <VideoMeta video={video} compact />
                  <h3 className={s.queueTitle}>{video.titre}</h3>
                  <p className={s.queueDeck}>{deckOf(video)}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
