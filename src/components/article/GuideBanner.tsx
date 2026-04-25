import React, { useState, useMemo } from "react";
import s from "./GuideBanner.module.css";

interface GuideBannerProps {
  themeColor: string;
}

export default function GuideBanner({ themeColor }: GuideBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("guide-banner-dismissed") === "1";
    } catch {
      return false;
    }
  });

  const isMac = useMemo(
    () => /Mac|iPhone|iPad|iPod/.test(navigator.userAgent),
    []
  );

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem("guide-banner-dismissed", "1");
    } catch {}
  };

  return (
    <div className={s.banner}>
      <aside
        className={s.bannerInner}
        style={{ "--theme": themeColor } as React.CSSProperties}
        role="note"
      >
        <div className={s.bannerHead}>
          <svg className={s.bannerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          <h4 className={s.bannerTitle}>Avant de commencer</h4>
        </div>

        <button className={s.bannerClose} onClick={dismiss} aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <p className={s.bannerIntro}>
          Ce guide est conçu pour vous accompagner sur plusieurs jours, voire plusieurs semaines. Prenez le temps qu'il faut — chaque étape compte.
        </p>

        <ul className={s.bannerList}>
          <li className={s.bannerItem}>
            <svg className={s.bannerItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
            <span>
              Ajoutez cette page à vos favoris{" "}
              (<span className={s.bannerKbd}>{isMac ? "⌘" : "Ctrl"}+D</span>)
              {" "}pour la retrouver facilement.
            </span>
          </li>
          <li className={s.bannerItem}>
            <svg className={s.bannerItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
            <span>Conservez le lien dans vos notes ou votre application préférée.</span>
          </li>
          <li className={s.bannerItem}>
            <svg className={s.bannerItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Prévoyez un moment pour y revenir — un rappel dans votre agenda peut suffire.</span>
          </li>
          <li className={s.bannerItem}>
            <svg className={s.bannerItemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <span>Les cases à cocher du plan d'action enregistrent votre progression dans votre navigateur. Fermez la page, revenez — tout est sauvegardé.</span>
          </li>
        </ul>
      </aside>
    </div>
  );
}
