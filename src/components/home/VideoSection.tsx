import { ArrowRight, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import CardMeta from "./shared/CardMeta";
import SectionHead from "./shared/SectionHead";
import type { HomeItem } from "@/lib/homeUtils";
import { itemHref, keepFrenchPunctuation, excerptOf } from "@/lib/homeUtils";
import { sanityImg } from "@/lib/sanityImage";
import s from "./VideoSection.module.css";

export default function VideoSection({
  featured,
  thumbs,
}: {
  featured: HomeItem;
  thumbs: HomeItem[];
}) {
  return (
    <div className={`${s.mediaBlock} ${s.videoBlock}`}>
      <SectionHead eyebrow="Vidéos" title="À regarder" href="/videos" action="Toutes les vidéos" />

      <div className={s.videoShowcase}>
        <Card
          href={itemHref(featured)}
          variant="outlined"
          size="sm"
          className={s.videoHeroCard}
        >
          <span className={s.videoHeroMedia}>
            <img src={sanityImg(featured.imageUrl, 1280) || "/placeholder.svg"} alt={featured.titre} />
            <span className={s.videoHeroShade} aria-hidden="true" />
            <span className={s.videoHeroPlay} aria-hidden="true">
              <Play fill="currentColor" />
            </span>
          </span>
          <div className={s.videoHeroBody}>
            <CardMeta item={featured} fallback="Vidéo" />
            <h3>{keepFrenchPunctuation(featured.titre)}</h3>
            <p>{excerptOf(featured, 180)}</p>
            <span className={s.videoHeroCta}>
              Regarder la vidéo
              <ArrowRight aria-hidden="true" />
            </span>
          </div>
        </Card>

        {!!thumbs.length && (
          <div className={s.videoThumbRail} aria-label="Autres vidéos">
            {thumbs.map((video) => (
              <Card
                key={video._id}
                href={itemHref(video)}
                variant="outlined"
                size="sm"
                className={s.videoThumbCard}
              >
                <span className={s.videoThumbMedia}>
                  <img src={sanityImg(video.imageUrl, 460) || "/placeholder.svg"} alt={video.titre} />
                  <span className={s.videoThumbPlay} aria-hidden="true">
                    <Play fill="currentColor" />
                  </span>
                </span>
                <div className={s.videoThumbBody}>
                  <CardMeta item={video} fallback="Vidéo" />
                  <h3>{keepFrenchPunctuation(video.titre)}</h3>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
