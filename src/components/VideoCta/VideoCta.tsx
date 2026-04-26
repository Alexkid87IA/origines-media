import s from "./VideoCta.module.css";

const TOTAL_VIDEOS = 106;
const TOTAL_PROGRAMMES = 10;

export default function VideoCta() {
  return (
    <section className={s.section} aria-labelledby="video-cta-heading">
      <div className={s.chapterMark}>
        <span className={s.cNum}>Ch.05</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Vid&eacute;os</span>
      </div>

      <a href="/programmes" className={s.band}>
        <div className={s.bandImg}>
          <img
            src="/visages-origines.png"
            alt="Les visages d'Origines"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={s.bandOverlay} />

        <div className={s.bandContent}>
          <div className={s.bandLeft}>
            <span className={s.bandKicker}>
              <span className={s.bandKickerDot} aria-hidden="true" />
              Origines &middot; Programmes
            </span>
            <h2 id="video-cta-heading" className={s.bandTitle}>
              Ce qu&rsquo;on a <em>film&eacute; pour vous.</em>
            </h2>
            <p className={s.bandDeck}>
              Enqu&ecirc;tes, documentaires, portraits et formats courts.
              Des histoires qu&rsquo;on ne raconte pas ailleurs.
            </p>
          </div>

          <div className={s.bandRight}>
            <div className={s.stats}>
              <div className={s.stat}>
                <span className={s.statNum}>{TOTAL_PROGRAMMES}</span>
                <span className={s.statLabel}>Programmes</span>
              </div>
              <span className={s.statSep} aria-hidden="true" />
              <div className={s.stat}>
                <span className={s.statNum}>{TOTAL_VIDEOS}</span>
                <span className={s.statLabel}>Vid&eacute;os</span>
              </div>
            </div>
            <span className={s.bandAction}>
              <span className={s.bandPlay} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </span>
              <span className={s.bandActionLabel}>Explorer la cha&icirc;ne</span>
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
