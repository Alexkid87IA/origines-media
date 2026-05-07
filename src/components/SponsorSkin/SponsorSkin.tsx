import { useEffect, type ReactNode } from "react";
import s from "./SponsorSkin.module.css";

export interface SponsorConfig {
  name: string;
  url: string;
  logo?: string;
  cta?: string;
  bgColor?: string;
  bgImage?: string;
  bannerBg?: string;
  bannerColor?: string;
}

interface SponsorSkinProps {
  sponsor: SponsorConfig;
  children: ReactNode;
}

export default function SponsorSkin({ sponsor, children }: SponsorSkinProps) {
  useEffect(() => {
    document.body.style.overflow = "auto";
    document.body.style.background = sponsor.bgColor || "#1a1a2e";
    return () => {
      document.body.style.background = "";
    };
  }, [sponsor.bgColor]);

  function handleSkinClick() {
    window.open(sponsor.url, "_blank", "noopener,noreferrer");
  }

  const bgStyle = {
    "--skin-color": sponsor.bgColor || "#1a1a2e",
    "--skin-image": sponsor.bgImage ? `url(${sponsor.bgImage})` : "none",
    "--skin-banner-bg": sponsor.bannerBg || "#111",
    "--skin-banner-color": sponsor.bannerColor || "#fff",
  } as React.CSSProperties;

  return (
    <div style={bgStyle}>
      {/* Fond cliquable */}
      <div
        className={s.skinBg}
        onClick={handleSkinClick}
        role="link"
        tabIndex={-1}
        aria-label={`Visiter ${sponsor.name}`}
      />

      {/* Zones cliquables latérales au-dessus du contenu */}
      <div className={s.skinClickLeft} onClick={handleSkinClick} aria-hidden="true" />
      <div className={s.skinClickRight} onClick={handleSkinClick} aria-hidden="true" />

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

      {/* Contenu rétréci */}
      <div className={s.content}>
        {children}
      </div>
    </div>
  );
}
