import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedList } from "@/hooks/useSavedList";
import { useJournals } from "@/hooks/useJournals";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import Ticker from "@/components/Ticker/Ticker";
import Marquee from "@/components/Marquee/Marquee";
import s from "./ComptePage.module.css";

/* ── Pre-auth data ── */

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

const DASHBOARD_LINKS = [
  { href: "/compte", label: "Mon profil", icon: "M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" },
  { href: "/compte/journaux", label: "Mes journaux", icon: "M4 4h16v16H4zM8 8h8M8 12h6M8 16h4" },
  { href: "/compte/liste", label: "Ma liste", icon: "M5 5h14v16l-7-4-7 4V5z" },
  { href: "/compte/parametres", label: "Paramètres", icon: "M12 15a3 3 0 100-6 3 3 0 000 6z" },
];

/* ── Quick login card ── */

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "E-mail ou mot de passe incorrect.",
  "auth/user-not-found": "Aucun compte trouvé avec cette adresse.",
  "auth/wrong-password": "Mot de passe incorrect.",
  "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard.",
};

function QuickLogin() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/compte");
    } catch (err: any) {
      setError(FIREBASE_ERRORS[err?.code] || "Identifiants incorrects.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={s.loginCard}>
      <h3 className={s.loginCardTitle}>Connexion rapide</h3>

      <button
        type="button"
        className={s.loginCardGoogle}
        onClick={async () => {
          setError("");
          try {
            await loginWithGoogle();
            navigate("/compte");
          } catch (err: any) {
            if (err?.code !== "auth/popup-closed-by-user")
              setError("Échec Google. Réessayez.");
          }
        }}
      >
        <svg viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Google
      </button>

      <div className={s.loginCardDivider}>
        <span className={s.loginCardDividerText}>ou</span>
      </div>

      <form className={s.loginCardForm} onSubmit={handleSubmit}>
        {error && <p className={s.loginCardError}>{error}</p>}
        <input
          className={s.loginCardInput}
          type="email"
          placeholder="votre@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={s.loginCardInput}
          type="password"
          placeholder="Mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={s.loginCardBtn} disabled={submitting}>
          {submitting ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className={s.loginCardFooter}>
        Pas encore membre ? <a href="/inscription">Créer un compte</a>
      </p>
    </div>
  );
}

/* ── Dashboard (logged in) ── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Bonne nuit";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

const DASH_SPACES = [
  {
    href: "/compte/profil",
    title: "Mon profil",
    desc: "Identité, centres d'intérêt, univers favoris.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
      </svg>
    ),
    status: "Compléter mon profil",
  },
  {
    href: "/compte/journaux",
    title: "Mes journaux",
    desc: "Carnets personnels, réflexions, notes datées.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8M8 12h6M8 16h4" />
      </svg>
    ),
    status: "Créer un carnet",
  },
  {
    href: "/compte/liste",
    title: "Ma liste",
    desc: "Articles, vidéos et recommandations sauvegardés.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 5h14v16l-7-4-7 4V5z" />
      </svg>
    ),
    status: "Explorer le média",
  },
  {
    href: "/compte/parametres",
    title: "Paramètres",
    desc: "Notifications, newsletter, confidentialité.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" />
      </svg>
    ),
    status: "Configurer",
  },
];

function Dashboard() {
  const { user } = useAuth();
  const { items: savedItems } = useSavedList();
  const { entries: journalEntries } = useJournals();
  const displayName = user?.displayName || "Membre";
  const firstName = displayName.split(" ")[0];
  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : null;

  return (
    <>
      <SEO
        title="Mon compte"
        description="Votre espace personnel Origines Media. Profil, journaux, liste de lecture et paramètres."
        url="/compte"
        noindex
      />

      <SiteHeader />
      <Ticker />

      <main className={s.page}>
        <div className={s.inner}>

          {/* ── Hero ── */}
          <section className={s.dashHero}>
            <div className={s.dashHeroLeft}>
              <span className={s.heroKicker}>
                <span className={s.heroKickerDot} />
                Espace personnel
              </span>
              <h1 className={s.heroTitle}>
                {getGreeting()}, <em>{firstName}</em>
              </h1>
              <p className={s.heroDeck}>
                Retrouvez vos lectures, vos carnets et vos découvertes.
              </p>
              {memberSince && (
                <span className={s.dashMeta}>
                  Membre depuis {memberSince}
                </span>
              )}
            </div>
            <div className={s.dashHeroRight}>
              <div className={s.dashStatCard}>
                <span className={s.dashStatValue}>{savedItems.length}</span>
                <span className={s.dashStatLabel}>Article{savedItems.length !== 1 ? "s" : ""} sauvegardé{savedItems.length !== 1 ? "s" : ""}</span>
              </div>
              <div className={s.dashStatCard}>
                <span className={s.dashStatValue}>{journalEntries.length}</span>
                <span className={s.dashStatLabel}>Entrée{journalEntries.length !== 1 ? "s" : ""} de journal</span>
              </div>
              <div className={s.dashStatCard}>
                <span className={s.dashStatValue}>—</span>
                <span className={s.dashStatLabel}>Abonnement</span>
              </div>
            </div>
          </section>

          {/* ── Espaces ── */}
          <section className={s.spaces}>
            <div className={s.chapterMark}>
              <span className={s.cNum}>Ch.01</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Vos espaces</span>
            </div>
            <div className={s.spacesGrid}>
              {DASH_SPACES.map((sp) => (
                <a key={sp.href} href={sp.href} className={s.spaceCard} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className={s.spaceIcon}>{sp.icon}</div>
                  <h3 className={s.spaceCardTitle}>{sp.title}</h3>
                  <p className={s.spaceCardDesc}>{sp.desc}</p>
                  <span className={s.dashCardAction}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    {sp.status}
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* ── Découvrir ── */}
          <section className={s.spaces}>
            <div className={s.chapterMark}>
              <span className={s.cNum}>Ch.02</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Reprendre l'exploration</span>
            </div>
            <div className={s.dashExplore}>
              <a href="/articles" className={s.dashExploreLink}>
                <span className={s.dashExploreName}>Articles</span>
                <span className={s.dashExploreArrow}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </a>
              <a href="/videos" className={s.dashExploreLink}>
                <span className={s.dashExploreName}>Vidéos</span>
                <span className={s.dashExploreArrow}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </a>
              <a href="/recommandations" className={s.dashExploreLink}>
                <span className={s.dashExploreName}>Recommandations</span>
                <span className={s.dashExploreArrow}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </a>
              <a href="/dossiers" className={s.dashExploreLink}>
                <span className={s.dashExploreName}>Dossiers</span>
                <span className={s.dashExploreArrow}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </a>
            </div>
          </section>
        </div>

        {/* ── Abonnement (dark) ── */}
        <section className={s.benefits}>
          <div className={s.benefitsInner}>
            <div className={s.chapterMarkDark}>
              <span className={s.cNum}>Ch.03</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Abonnement</span>
            </div>
            <h2 className={s.benefitsTitle}>
              Passez à l'expérience <em>sans publicité</em>
            </h2>
            <div className={s.dashSubGrid}>
              <div className={s.dashSubCard}>
                <span className={s.dashSubBadge}>Actuel</span>
                <h3 className={s.dashSubName}>Gratuit</h3>
                <p className={s.dashSubPrice}>0 € / mois</p>
                <ul className={s.dashSubFeatures}>
                  <li>Accès aux articles</li>
                  <li>Sauvegarde & liste</li>
                  <li>Newsletter</li>
                </ul>
              </div>
              <div className={s.dashSubCardPro}>
                <span className={s.dashSubBadgePro}>Bientôt</span>
                <h3 className={s.dashSubName}>Abonné</h3>
                <p className={s.dashSubPrice}>—</p>
                <ul className={s.dashSubFeatures}>
                  <li>Tout le gratuit</li>
                  <li>Zéro publicité</li>
                  <li>Contenus exclusifs</li>
                  <li>Accès anticipé</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className={s.inner}>
          <div className={s.dashFooterActions}>
            <a href="/deconnexion" className={s.dashLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Se déconnecter
            </a>
          </div>
        </div>
      </main>

      <Marquee />
      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}

/* ── Pre-auth landing ── */

function PreAuthLanding() {
  return (
    <>
      <SEO
        title="Mon compte"
        description="Votre espace personnel Origines Media. Profil, journaux, liste de lecture et paramètres — un compte pensé pour vous."
        url="/compte"
        noindex
      />

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
            <a href="/inscription" className={s.heroCta}>
              Créer mon compte
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <span className={s.heroNote}>Gratuit — Sans engagement</span>
            <QuickLogin />
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
          <section className={s.cta}>
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
            <div className={s.ctaForm}>
              <a href="/inscription" className={s.ctaBtn} style={{ textDecoration: "none", textAlign: "center", flex: 1 }}>
                Créer mon compte
              </a>
            </div>
            <p className={s.ctaDeck} style={{ marginTop: 12, marginBottom: 0, fontSize: 14 }}>
              Déjà membre ? <a href="/connexion" style={{ color: "var(--ink)", fontWeight: 600 }}>Se connecter</a>
            </p>
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

/* ── Router ── */

export default function ComptePage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? <Dashboard /> : <PreAuthLanding />;
}
