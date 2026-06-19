import { Fragment } from "react";
import { Card } from "@/components/ui/Card";
import CardMeta from "./shared/CardMeta";
import SectionHead from "./shared/SectionHead";
import MiniPromoCard from "./shared/MiniPromoCard";
import type { HomeItem } from "@/lib/homeUtils";
import { itemHref, keepFrenchPunctuation, excerptOf } from "@/lib/homeUtils";
import { sanityImg } from "@/lib/sanityImage";
import s from "./ThreadSection.module.css";

export default function ThreadSection({ items }: { items: HomeItem[] }) {
  return (
    <section className={s.threadSection} aria-labelledby="thread-title">
      <SectionHead eyebrow="Le fil" title="Les dernières publications" href="/articles" action="Tous les articles" />
      <div className={s.threadLayout}>
        {items.map((item, index) => (
          <Fragment key={item._id}>
            <Card href={itemHref(item)} variant="outlined" size="sm" className={s.threadCard}>
              <span className={s.threadNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <CardMeta item={item} />
                <h3>{keepFrenchPunctuation(item.titre)}</h3>
                <p>{excerptOf(item, 150)}</p>
              </div>
              <img src={sanityImg(item.imageUrl, 260) || "/placeholder.svg"} alt={item.titre} />
            </Card>
            {index === 2 && (
              <MiniPromoCard
                eyebrow="Newsletter"
                title="Recevoir les récits qui restent."
                body="Une sélection courte pour garder le fil sans se noyer dans l'actualité."
                cta="S'inscrire"
                to="/newsletter"
                tone="violet"
                image="/images/mini-newsletter.jpg"
              />
            )}
            {index === 5 && (
              <MiniPromoCard
                eyebrow="Boutique"
                title="Un kit pour continuer après la lecture."
                body="Carnets, workbooks et guides pour transformer une idée en pratique."
                cta="Explorer"
                to="/boutique"
                tone="pink"
                image="/images/mini-boutique.jpg"
              />
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
