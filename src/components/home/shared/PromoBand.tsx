import Button from "@/components/ui/Button";
import s from "./PromoBand.module.css";

export default function PromoBand({
  kicker,
  title,
  body,
  cta,
  to,
  tone,
  aside,
  index,
  points,
}: {
  kicker: string;
  title: string;
  body: string;
  cta: string;
  to: string;
  tone: "story" | "shop" | "sponsors";
  aside: string;
  index: string;
  points: string[];
}) {
  const toneClass = {
    story: s.promoStory,
    shop: s.promoShop,
    sponsors: s.promoSponsors,
  }[tone];

  const isDark = tone === "story" || tone === "shop";

  return (
    <section className={`${s.promoBand} ${toneClass}`} aria-label={title}>
      <div className={s.promoVisual} aria-hidden="true">
        <span>{index}</span>
        <img src="/logos/logo-black.webp" alt="" />
        <small>{aside}</small>
      </div>
      <div className={s.promoBody}>
        <div className={s.promoContent}>
          <span>{kicker}</span>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
        <div className={s.promoFooter}>
          <div className={s.promoPoints} aria-label="Ce que propose Origines">
            {points.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
          <Button
            as="link"
            to={to}
            variant="cta"
            size="md"
            color={isDark ? "#F7F5F0" : "#0A0A0A"}
            withArrow
          >
            {cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
