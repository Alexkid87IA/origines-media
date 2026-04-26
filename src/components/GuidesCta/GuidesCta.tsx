import s from "./GuidesCta.module.css";

const GUIDES_HIGHLIGHTS = [
  { label: "Enquêtes", count: 12 },
  { label: "Portraits", count: 8 },
  { label: "Essais", count: 6 },
  { label: "Reportages", count: 9 },
];

export default function GuidesCta() {
  return (
    <section className={s.section} aria-labelledby="guides-cta-heading">
      <div className={s.chapterMark}>
        <span className={s.cNum}>Ch.06</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Guides</span>
      </div>

      <a href="/guides" className={s.band}>
        <div className={s.bandImg}>
          <img
            src="/series/01_transmission_poster.jpg"
            alt="Immersion — Guides Origines"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={s.bandOverlay} />

        <div className={s.bandContent}>
          <div className={s.bandLeft}>
            <span className={s.bandKicker}>
              <span className={s.bandKickerDot} aria-hidden="true" />
              Origines &middot; Guides immersifs
            </span>
            <h2 id="guides-cta-heading" className={s.bandTitle}>
              Nos plus belles <em>plong&eacute;es.</em>
            </h2>
            <p className={s.bandDeck}>
              Des guides au long cours &mdash; enqu&ecirc;tes, portraits, essais.
              De 2&nbsp;000 &agrave; 4&nbsp;000 mots, des mois d&rsquo;investigation.
            </p>
          </div>

          <div className={s.bandRight}>
            <div className={s.formats}>
              {GUIDES_HIGHLIGHTS.map((f) => (
                <span key={f.label} className={s.format}>
                  <span className={s.formatCount}>{f.count}</span>
                  <span className={s.formatLabel}>{f.label}</span>
                </span>
              ))}
            </div>
            <span className={s.bandAction}>
              <span className={s.bandIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </span>
              <span className={s.bandActionLabel}>Explorer les guides</span>
              <svg
                className={s.bandArrow}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </section>
  );
}
