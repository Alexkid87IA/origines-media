import { useEffect, type ReactNode } from "react";
import s from "./SponsorSkin.module.css";

export interface SponsorConfig {
  name: string;
  url: string;
  logo?: string;
  cta?: string;
  bgColor?: string;
  bgImage?: string;
  bgImageLeft?: string;
  bgImageRight?: string;
  bannerBg?: string;
  bannerColor?: string;
}

interface SponsorSkinProps {
  sponsor: SponsorConfig;
  header?: ReactNode;
  children: ReactNode;
}

export default function SponsorSkin({ sponsor, header, children }: SponsorSkinProps) {
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.background = sponsor.bgColor || "#1a1a2e";
    return () => {
      document.body.style.background = "";
    };
  }, [sponsor.bgColor]);

  const hasLeftRight = sponsor.bgImageLeft && sponsor.bgImageRight;

  const bgStyle = {
    "--skin-color": sponsor.bgColor || "#1a1a2e",
    "--skin-image": !hasLeftRight && sponsor.bgImage ? `url(${sponsor.bgImage})` : "none",
    "--skin-image-left": sponsor.bgImageLeft ? `url(${sponsor.bgImageLeft})` : "none",
    "--skin-image-right": sponsor.bgImageRight ? `url(${sponsor.bgImageRight})` : "none",
    "--skin-banner-bg": sponsor.bannerBg || "#111",
    "--skin-banner-color": sponsor.bannerColor || "#fff",
  } as React.CSSProperties;

  return (
    <div style={bgStyle}>
      {/* Zones cliquables latérales */}
      <a
        href={sponsor.url}
        target="_blank"
        rel="sponsored noopener"
        className={s.skinClickLeft}
      >
        {sponsor.bgImageLeft && (
          <img src={sponsor.bgImageLeft} alt="" className={s.skinPanelImg} style={{ objectPosition: "right top" }} />
        )}
        <div className={s.skinCta}>
          <span className={s.skinCtaLabel}>{sponsor.name}</span>
          <span className={s.skinCtaTitle}>Créez un livre personnalisé avec votre enfant en héros</span>
          <span className={s.skinCtaBtn}>{sponsor.cta || "Découvrir"} →</span>
        </div>
      </a>
      <a
        href={sponsor.url}
        target="_blank"
        rel="sponsored noopener"
        className={s.skinClickRight}
      >
        {sponsor.bgImageRight && (
          <img src={sponsor.bgImageRight} alt="" className={s.skinPanelImg} style={{ objectPosition: "left top" }} />
        )}
        <div className={s.skinCta}>
          <span className={s.skinCtaLabel}>Offrez-lui son histoire</span>
          <span className={s.skinCtaTitle}>Des livres uniques où votre enfant est le héros</span>
          <span className={s.skinCtaBtn}>{sponsor.cta || "Découvrir"} →</span>
        </div>
      </a>

      {/* Bandeau sponsor */}
      <a href={sponsor.url} target="_blank" rel="sponsored noopener" className={s.banner}>
        <span className={s.bannerLabel}>En partenariat avec</span>
        {sponsor.logo ? (
          <img src={sponsor.logo} alt={sponsor.name} className={s.bannerLogo} />
        ) : (
          <span className={s.bannerName}>{sponsor.name}</span>
        )}
        {sponsor.cta && <span className={s.bannerCta}>{sponsor.cta}</span>}
      </a>

      {/* Header pleine largeur (entre bandeau et contenu rétréci) */}
      {header}

      {/* Contenu rétréci */}
      <div className={s.content}>
        {children}
      </div>
    </div>
  );
}
