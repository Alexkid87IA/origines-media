import s from "./MonHistoire.module.css";

export default function MonHistoire() {
  return (
    <section className={s.section} aria-labelledby="mon-histoire-heading">
      <div className={s.strip}>
        <img
          src="/images/mosaic-origines.png"
          alt="Visages de la communauté Origines"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={s.content}>
        <div className={s.left}>
          <div className={s.kicker}>
            <span className={s.kickerLine} aria-hidden="true" />
            <span>Vos histoires &middot; 1&nbsp;287 reçues en 2026</span>
          </div>

          <h2 id="mon-histoire-heading" className={s.title}>
            Vous avez une histoire
          </h2>
          <p className={s.titleItalic}>
            qui mérite d&rsquo;être <em>entendue</em>&thinsp;?
          </p>

          <p className={s.body}>
            Un récit, un témoignage, un moment-pivot. Quelque chose que vous
            n&rsquo;avez jamais dit à voix haute. On vous lit, on vous appelle,
            et si l&rsquo;histoire le demande &mdash; on la publie avec vous.
          </p>

          <hr className={s.sep} />

          <div className={s.steps}>
            <div className={s.step}>
              <span className={s.stepNum}>01</span>
              <strong className={s.stepTitle}>Vous écrivez</strong>
              <p className={s.stepDesc}>
                10 minutes suffisent. Aucune forme imposée.
              </p>
            </div>
            <div className={s.step}>
              <span className={s.stepNum}>02</span>
              <strong className={s.stepTitle}>On vous lit</strong>
              <p className={s.stepDesc}>
                Un membre de la rédac vous répond sous 5&nbsp;jours.
              </p>
            </div>
            <div className={s.step}>
              <span className={s.stepNum}>03</span>
              <strong className={s.stepTitle}>On publie ensemble</strong>
              <p className={s.stepDesc}>
                Si vous le voulez, anonyme ou signé &mdash; vous décidez.
              </p>
            </div>
          </div>

          <div className={s.actions}>
            <a href="/ecrire-mon-histoire" className={s.ctaPrimary}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Raconter mon histoire
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="/histoires" className={s.ctaSecondary}>
              Lire celles déjà publiées
              <span className={s.ctaBadge}>412</span>
            </a>
          </div>

          <p className={s.trust}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Confidentialité garantie &middot; Aucun partage &middot; Anonymat possible
          </p>
        </div>

        <aside className={s.right}>
          <div className={s.card}>
            <span className={s.cardQuote} aria-hidden="true">&ldquo;</span>
            <blockquote className={s.cardText}>
              <p>
                Je n&rsquo;avais jamais parlé de cette année à personne.
                Écrire à <strong>Origines</strong>, c&rsquo;était comme le
                dire une fois pour toutes &mdash; et après, pouvoir passer
                à autre chose.
              </p>
            </blockquote>
            <p className={s.cardAttrib}>
              Mathilde, 34 ans &middot; Histoire publiée en avril
            </p>
            <div className={s.cardStats}>
              <div className={s.cardStat}>
                <span className={s.cardStatNum}>1&nbsp;287</span>
                <span className={s.cardStatLabel}>Histoires reçues cette année</span>
              </div>
              <div className={s.cardStat}>
                <span className={s.cardStatNum}>5j</span>
                <span className={s.cardStatLabel}>Réponse moyenne</span>
              </div>
              <div className={s.cardStat}>
                <span className={s.cardStatNum}>412</span>
                <span className={s.cardStatLabel}>Publiées depuis 2022</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
