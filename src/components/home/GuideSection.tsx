import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import CardMeta from "./shared/CardMeta";
import SectionHead from "./shared/SectionHead";
import type { HomeItem } from "@/lib/homeUtils";
import { itemHref, keepFrenchPunctuation, excerptOf } from "@/lib/homeUtils";
import { sanityImg } from "@/lib/sanityImage";
import s from "./GuideSection.module.css";

export default function GuideSection({ guides }: { guides: HomeItem[] }) {
  return (
    <div className={s.mediaBlock}>
      <SectionHead eyebrow="Guides" title="À mettre en pratique" href="/guides" action="Tous les guides" />
      <div className={s.guideGrid}>
        {guides.slice(0, 4).map((guide, index) => {
          const isFeature = index === 0;
          const imageWidth = isFeature ? 940 : 520;
          const imageHeight = isFeature ? 627 : 347;

          return (
            <Card
              key={guide._id}
              href={itemHref(guide)}
              variant="outlined"
              size="sm"
              className={`${s.compactGuideCard} ${isFeature ? s.guideFeatureCard : ""}`}
            >
              <div className={s.guideMedia}>
                <img
                  src={sanityImg(guide.imageUrl, imageWidth) || "/placeholder.svg"}
                  alt={guide.titre}
                  width={imageWidth}
                  height={imageHeight}
                  loading={isFeature ? "eager" : "lazy"}
                />
              </div>
              <div className={s.guideContent}>
                <CardMeta item={guide} fallback="Guide" />
                <h3>{keepFrenchPunctuation(guide.titre)}</h3>
                <p>{excerptOf(guide, isFeature ? 230 : 118)}</p>
                <span className={s.guideFeatureCta}>
                  {isFeature ? "Lire le guide" : "Ouvrir"}
                  <ArrowRight aria-hidden="true" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
