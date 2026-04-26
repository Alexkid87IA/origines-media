import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import Ticker from "@/components/Ticker/Ticker";
import Marquee from "@/components/Marquee/Marquee";
import s from "./ComptePage.module.css";

const SPACES = [
  {
    num: "01",
    title: "Mon profil",
    desc: "Votre identité éditoriale. Centres d'intérêt, univers favoris, ton préféré — tout ce qui fait de votre fil un reflet de vous.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
      </svg>
    ),
    features: ["Bio & photo de profil", "Univers & thématiques", "Préférences de lecture"],
  },
  {
    num: "02",
    title: "Mes journaux",
    desc: "Vos carnets personnels. Notez vos réflexions, suivez votre évolution, relisez-vous. Un espace intime, rien qu'à vous.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8M8 12h6M8 16h4" />
      </svg>
    ),
    features: ["Carnets thématiques", "Entrées datées", "Export & sauvegarde"],
  },
  {
    num: "03",
    title: "Ma liste",
    desc: "Votre bibliothèque personnelle. Articles, vidéos, recommandations — tout ce que vous voulez retrouver, au même endroit.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 5h14v16l-7-4-7 4V5z" />
      </svg>
    ),
    features: ["Articles sauvegardés", "Vidéos en favoris", "Collections personnalisées"],
  },
  {
    num: "04",
    title: "Paramètres",
    desc: "Votre expérience, vos règles. Notifications, fréquence de la newsletter, confidentialité — vous gardez le contrôle.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" />
      </svg>
    ),
    features: ["Notifications sur mesure", "Préférences newsletter", "Confidentialité & données"],
  },
];

const BENEFITS = [
  {
    stat: "100%",
    title: "Personnalisé",
    desc: "Un fil de lecture construit autour de vos centres d'intérêt, pas d'un algorithme publicitaire.",
  },
  {
    stat: "∞",
    title: "Sauvegardé",
    desc: "Vos articles, vidéos et recommandations accessibles à vie dans votre bibliothèque personnelle.",
  },
  {
    stat: "0 pub",
    title: "Respectueux",
    desc: "Passez à l'abonnement pour une expérience sans aucune publicité. Votre attention mérite mieux.",
  },
];

export default function ComptePage() {
  return (
    <>
      <Helmet>
        <title>Mon compte — Origines Media</title>
        <meta
          name="description"
          content="Votre espace personnel Origines Media. Profil, journales, liste de lecture et paramètres — un compte pensé pour vous."
        />
      </Helmet>

      <SiteHeader />
      <Ticker />

      <main className={s.page}>
        <div className={s.inner}>

          {/* ── Ch.01 — Hero ── */}
          <section className={s.hero}>
            <span className={s.heroKicker}>
              <span className={s.heroKickerDot} />
              Espace personnel
            </span>
            <h1 className={s.heroTitle}>
              Votre univers,
              <br />
              <em>à portée de main</em>
            </h1>
            <p className={s.heroDeck}>
              Un espace pensé pour vous — vos lectures, vos réflexions,
              vos découvertes. Tout ce qui compte, réuni au même endroit.
            </p>
            <a href="#inscription" className={s.heroCta}>
              Créer mon compte
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <span className={s.heroNote}>Gratuit — Sans engagement — Sans publicité</span>
          </section>

          {/* ── Ch.02 — Espaces ── */}
          <section className={s.spaces}>
            <div className={s.chapterMark}>
              <span className={s.cNum}>Ch.02</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Vos espaces</span>
            </div>
            <h2 className={s.spacesTitle}>
              Quatre espaces, <em>une seule promesse</em>
            </h2>
            <div className={s.spacesGrid}>
              {SPACES.map((sp) => (
                <div key={sp.num} className={s.spaceCard}>
                  <div className={s.spaceIcon}>{sp.icon}</div>
                  <span className={s.spaceNum}>{sp.num}</span>
                  <h3 className={s.spaceCardTitle}>{sp.title}</h3>
                  <p className={s.spaceCardDesc}>{sp.desc}</p>
                  <ul className={s.spaceFeatures}>
                    {sp.features.map((f) => (
                      <li key={f} className={s.spaceFeature}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Ch.03 — Avantages (dark full-bleed) ── */}
        <section className={s.benefits}>
          <div className={s.benefitsInner}>
            <div className={s.chapterMarkDark}>
              <span className={s.cNum}>Ch.03</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Pourquoi nous rejoindre</span>
            </div>
            <h2 className={s.benefitsTitle}>
              Un média <em>qui vous respecte</em>
            </h2>
            <div className={s.benefitsGrid}>
              {BENEFITS.map((b) => (
                <div key={b.title} className={s.benefitCard}>
                  <p className={s.benefitStat}>{b.stat}</p>
                  <h3 className={s.benefitCardTitle}>{b.title}</h3>
                  <p className={s.benefitCardDesc}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ch.04 — CTA final ── */}
        <div className={s.inner}>
          <section className={s.cta} id="inscription">
            <div className={s.chapterMark}>
              <span className={s.cNum}>Ch.04</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Inscription</span>
            </div>
            <h2 className={s.ctaTitle}>
              Prêt·e à nous <em>rejoindre</em>&nbsp;?
            </h2>
            <p className={s.ctaDeck}>
              Créez votre compte en quelques secondes et accédez
              à un espace conçu pour votre curiosité.
            </p>
            <form
              className={s.ctaForm}
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="votre@email.com"
                className={s.ctaInput}
                required
              />
              <button type="submit" className={s.ctaBtn}>
                S'inscrire
              </button>
            </form>
            <div className={s.ctaGuarantees}>
              <span className={s.ctaGuarantee}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L3 7v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" />
                </svg>
                Données protégées
              </span>
              <span className={s.ctaGuarantee}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                100% gratuit
              </span>
              <span className={s.ctaGuarantee}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                </svg>
                Désinscription libre
              </span>
            </div>
          </section>
        </div>
      </main>

      <Marquee />
      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
