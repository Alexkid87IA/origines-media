import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import s from "./MiniPromoCard.module.css";

export default function MiniPromoCard({
  eyebrow,
  title,
  body,
  cta,
  to,
  tone,
  image,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  to: string;
  tone: "violet" | "pink" | "green" | "ink";
  image?: string;
}) {
  const toneClass = {
    violet: s.miniPromoViolet,
    pink: s.miniPromoPink,
    green: s.miniPromoGreen,
    ink: s.miniPromoInk,
  }[tone];

  const hasImage = !!image;

  return (
    <Card href={to} variant="outlined" size="sm" className={`${s.miniPromo} ${toneClass} ${hasImage ? s.miniPromoImage : ""}`}>
      {hasImage && (
        <span className={s.miniPromoBackground} aria-hidden="true">
          <img src={image} alt="" />
        </span>
      )}
      {!hasImage && (
        <span className={s.miniPromoMark} aria-hidden="true">
          <span />
          <span />
          <span>
            <img src="/logos/logo-black.webp" alt="" />
          </span>
        </span>
      )}
      <span className={s.miniPromoLabel}>{eyebrow}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      <span className={s.miniPromoCta}>
        {cta}
        <ArrowRight aria-hidden="true" />
      </span>
    </Card>
  );
}
