// src/pages/EnsemblePage.tsx
// V2 — Angular editorial design — Hub central Origines

import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import s from "./EnsemblePage.module.css";

/* ══════════════════════════════════════════════════════════
   Data
   ══════════════════════════════════════════════════════════ */

const contentFormats = [
  {
    id: "series",
    title: "Nos series",
    description:
      "Des recits en plusieurs episodes pour explorer en profondeur",
    longDescription:
      "Plongez dans nos series documentaires qui explorent des thematiques fortes a travers plusieurs episodes. Chaque serie est une immersion complete dans un univers, avec des temoignages authentiques et des perspectives variees.",
    href: "/series",
    color: "#6366F1",
    stat: "6 series",
    cta: "Decouvrir les series",
  },
  {
    id: "videos",
    title: "Nos videos",
    description: "Portraits, interviews et documentaires courts",
    longDescription:
      "Des formats video varies pour decouvrir des histoires inspirantes : portraits intimistes, interviews approfondies, mini-documentaires et temoignages percutants. Chaque video est une fenetre sur un parcours unique.",
    href: "/videos",
    color: "#06B6D4",
    stat: "50+ videos",
    cta: "Voir les videos",
  },
  {
    id: "bibliotheque",
    title: "La bibliotheque",
    description: "Articles, analyses et reflexions approfondies",
    longDescription:
      "Notre bibliotheque rassemble articles de fond, analyses et reflexions sur des sujets qui comptent. Un espace pour prendre le temps de lire, comprendre et s'inspirer a travers des contenus ecrits de qualite.",
    href: "/bibliotheque",
    color: "#F59E0B",
    stat: "100+ articles",
    cta: "Explorer la bibliotheque",
  },
  {
    id: "univers",
    title: "Les univers",
    description: "Psychologie, Societe, Carriere, Art & Creativite...",
    longDescription:
      "Nos contenus sont organises par univers thematiques : Psychologie, Societe, Carriere, Art & Creativite, Spiritualite... Chaque univers regroupe des histoires et reflexions autour d'un meme fil conducteur.",
    href: "/univers",
    color: "#8B5CF6",
    stat: "5 univers",
    cta: "Parcourir les univers",
  },
];

const values = [
  {
    title: "Authenticite",
    description: "Des histoires vraies, sans filtre ni artifice",
    color: "#EC4899",
  },
  {
    title: "Diversite",
    description: "Des voix multiples et des parcours varies",
    color: "#F97316",
  },
  {
    title: "Inspiration",
    description: "Des recits qui donnent envie d'agir",
    color: "#8B5CF6",
  },
];

const socialPresence = [
  {
    name: "Instagram",
    href: "https://instagram.com/originesmedia",
    color: "#E4405F",
    handle: "@originesmedia",
    followers: "12K",
    description: "Coulisses, stories et extraits quotidiens",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@originesmedia",
    color: "#FF0000",
    handle: "Origines Media",
    followers: "8K",
    description: "Toutes nos videos et series completes",
  },
];

const communityActions = [
  {
    title: "Racontez votre histoire",
    description:
      "Vous avez un parcours, une experience a partager ? On veut vous entendre.",
    href: "/racontez-votre-histoire",
    color: "#F97316",
    cta: "Soumettre mon histoire",
  },
  {
    title: "Proposez une amelioration",
    description:
      "Une idee pour ameliorer Origines ? Vos retours nous font avancer.",
    href: "/contact?sujet=suggestion",
    color: "#10B981",
    cta: "Faire une suggestion",
  },
  {
    title: "Suggerez un sujet",
    description:
      "Un theme qu'on devrait explorer ? Un angle qu'on a manque ?",
    href: "/contact?sujet=idee",
    color: "#8B5CF6",
    cta: "Proposer un sujet",
  },
];

const contactPoints = [
  {
    title: "Rejoindre l'equipe",
    description: "Contributeur, createur ou partenaire",
    href: "/rejoindre",
    color: "#F97316",
  },
  {
    title: "Nous contacter",
    description: "Une question, une idee ?",
    href: "/contact",
    color: "#10B981",
  },
  {
    title: "Partenariats",
    description: "Collaborons ensemble",
    href: "/partenariats",
    color: "#8B5CF6",
  },
];

/* ══════════════════════════════════════════════════════════
   Inline SVG icons (no lucide-react)
   ══════════════════════════════════════════════════════════ */

/* Shared arrow-right icon */
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/* -- Format-specific icons -- */

function PlayIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function FilmIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M17 3v18" />
      <path d="M3 7.5h4" />
      <path d="M17 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  );
}

function BookIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function CompassIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

/* -- Social icons -- */

function InstagramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

/* -- Community action icons -- */

function PenLineIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function LightbulbIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

function TargetIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

/* -- Contact icons -- */

function UsersIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MessageCircleIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
    </svg>
  );
}

function HandshakeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14h2" />
      <path d="m3 3 1 11h2" />
      <path d="M13 7 8 2" />
    </svg>
  );
}

/* Icon maps keyed by data IDs */
const formatIcons: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  series: PlayIcon,
  videos: FilmIcon,
  bibliotheque: BookIcon,
  univers: CompassIcon,
};

const socialIcons: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  Instagram: InstagramIcon,
  YouTube: YoutubeIcon,
};

const communityIcons: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  "Racontez votre histoire": PenLineIcon,
  "Proposez une amelioration": LightbulbIcon,
  "Suggerez un sujet": TargetIcon,
};

const contactIcons: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  "Rejoindre l'equipe": UsersIcon,
  "Nous contacter": MessageCircleIcon,
  Partenariats: HandshakeIcon,
};

/* ══════════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════════ */

export default function EnsemblePage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFormat, setExpandedFormat] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className={s.page}>
      <SEO
        title="Ensemble - Decouvrir Origines"
        description="Decouvrez l'univers Origines Media. Des contenus d'utilite publique : series, videos et articles qui inspirent, transforment et eclairent."
        url="/ensemble"
      />
      <SiteHeader />

      <main>
        {/* ── Hero ── */}
        <header className={s.hero}>
          <div className={s.inner}>
            <span className={s.heroKicker}>
              <span className={s.heroKickerDot} />
              Des contenus d&rsquo;utilite publique
            </span>

            <h1 className={s.heroTitle}>
              Bienvenue dans l&rsquo;univers Origines
            </h1>

            <p className={s.heroDeck}>
              Origines Media raconte des histoires qui inspirent, transforment
              et eclairent. Des recits authentiques portes par des voix
              diverses.
            </p>

            <div className={s.heroCtas}>
              <Link to="/a-propos" className={s.heroPrimary}>
                Qui sommes-nous
                <ArrowRightIcon className={s.heroPrimaryArrow} />
              </Link>
              <Link to="/bibliotheque" className={s.heroSecondary}>
                <BookOpenIcon className={s.heroSecondaryIcon} />
                Explorer les contenus
              </Link>
            </div>
          </div>
        </header>

        {/* ── Ce qu'on fait — Formats with accordion ── */}
        <section className={s.formats}>
          <div className={s.inner}>
            <span className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              Nos formats
            </span>
            <h2 className={s.sectionTitle}>Ce qu&rsquo;on fait</h2>
            <p className={s.sectionDeck}>
              Differentes facons de decouvrir nos histoires
            </p>

            <div className={s.formatsGrid}>
              {contentFormats.map((fmt) => {
                const isOpen = expandedFormat === fmt.id;
                const Icon = formatIcons[fmt.id];

                return (
                  <div
                    key={fmt.id}
                    className={`${s.formatCard} ${isOpen ? s.formatCardExpanded : ""}`}
                  >
                    {/* Left accent bar */}
                    <div
                      className={`${s.formatAccent} ${isOpen ? s.formatAccentVisible : ""}`}
                      style={{ background: fmt.color }}
                    />

                    {/* Clickable header */}
                    <button
                      className={s.formatBtn}
                      onClick={() =>
                        setExpandedFormat(isOpen ? null : fmt.id)
                      }
                      aria-expanded={isOpen}
                    >
                      <div
                        className={s.formatIcon}
                        style={{ background: `${fmt.color}15` }}
                      >
                        {Icon && <Icon style={{ color: fmt.color }} />}
                      </div>

                      <div className={s.formatBody}>
                        <div className={s.formatHeader}>
                          <h3 className={s.formatTitle}>{fmt.title}</h3>
                          <span className={s.formatStat}>{fmt.stat}</span>
                        </div>
                        <p className={s.formatDesc}>{fmt.description}</p>
                      </div>

                      <div
                        className={`${s.formatChevron} ${isOpen ? s.formatChevronOpen : ""}`}
                      >
                        <ChevronDownIcon />
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isOpen && (
                      <div className={s.formatDrop}>
                        <p className={s.formatLong}>{fmt.longDescription}</p>
                        <Link
                          to={fmt.href}
                          className={s.formatCta}
                          style={{ background: fmt.color }}
                        >
                          {fmt.cta}
                          <ArrowUpRightIcon className={s.formatCtaArrow} />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Nos valeurs ── */}
        <section className={s.values}>
          <div className={s.inner}>
            <span className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              Nos valeurs
            </span>
            <h2 className={s.sectionTitle}>En quoi on croit</h2>
            <p className={s.sectionDeck}>
              Les valeurs qui guident chacune de nos histoires
            </p>

            <div className={s.valuesGrid}>
              {values.map((val) => (
                <div key={val.title} className={s.valueCard}>
                  <div
                    className={s.valueAccent}
                    style={{ background: val.color }}
                  />
                  <div
                    className={s.valueDot}
                    style={{ background: val.color }}
                  />
                  <h3 className={s.valueTitle}>{val.title}</h3>
                  <p className={s.valueDesc}>{val.description}</p>
                </div>
              ))}
            </div>

            <Link to="/a-propos" className={s.valuesLink}>
              En savoir plus sur notre mission
              <ArrowRightIcon className={s.valuesLinkArrow} />
            </Link>
          </div>
        </section>

        {/* ── Ou nous trouver — Reseaux sociaux ── */}
        <section className={s.social}>
          <div className={s.inner}>
            <span className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              Reseaux
            </span>
            <h2 className={s.sectionTitle}>Ou nous trouver</h2>
            <p className={s.sectionDeck}>
              Suivez-nous sur les reseaux pour ne rien manquer
            </p>

            <div className={s.socialGrid}>
              {socialPresence.map((soc) => {
                const Icon = socialIcons[soc.name];
                return (
                  <a
                    key={soc.name}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.socialCard}
                  >
                    <div
                      className={s.socialIcon}
                      style={{ background: `${soc.color}15` }}
                    >
                      {Icon && <Icon style={{ color: soc.color }} />}
                    </div>

                    <div className={s.socialBody}>
                      <div className={s.socialName}>
                        <span className={s.socialNameText}>{soc.name}</span>
                        <span className={s.socialFollowers}>
                          {soc.followers} abonnes
                        </span>
                      </div>
                      <div className={s.socialHandle}>{soc.handle}</div>
                      <div className={s.socialDesc}>{soc.description}</div>
                    </div>

                    <ArrowUpRightIcon className={s.socialArrow} />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Participez — Community interaction ── */}
        <section className={s.participate}>
          <div className={s.inner}>
            <span className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              Communaute
            </span>
            <h2 className={s.sectionTitle}>Participez</h2>
            <p className={s.sectionDeck}>
              Origines, c&rsquo;est aussi vous &mdash; contribuez au projet
            </p>

            <div className={s.participateGrid}>
              {communityActions.map((act) => {
                const Icon = communityIcons[act.title];
                return (
                  <Link
                    key={act.title}
                    to={act.href}
                    className={s.participateCard}
                  >
                    <div
                      className={s.participateIcon}
                      style={{ background: `${act.color}15` }}
                    >
                      {Icon && <Icon style={{ color: act.color }} />}
                    </div>

                    <h3 className={s.participateTitle}>{act.title}</h3>
                    <p className={s.participateDesc}>{act.description}</p>

                    <span
                      className={s.participateCta}
                      style={{ color: act.color }}
                    >
                      {act.cta}
                      <ArrowRightIcon className={s.participateCtaArrow} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Restons en contact ── */}
        <section className={s.contact}>
          <div className={s.inner}>
            <span className={s.sectionKicker}>
              <span className={s.sectionKickerDot} />
              Contact
            </span>
            <h2 className={s.sectionTitle}>Restons en contact</h2>
            <p className={s.sectionDeck}>
              Rejoignez-nous ou collaborons ensemble
            </p>

            <div className={s.contactGrid}>
              {contactPoints.map((pt) => {
                const Icon = contactIcons[pt.title];
                return (
                  <Link
                    key={pt.title}
                    to={pt.href}
                    className={s.contactCard}
                  >
                    <div
                      className={s.contactIcon}
                      style={{ background: `${pt.color}15` }}
                    >
                      {Icon && <Icon style={{ color: pt.color }} />}
                    </div>
                    <div className={s.contactBody}>
                      <h3 className={s.contactTitle}>{pt.title}</h3>
                      <p className={s.contactDesc}>{pt.description}</p>
                    </div>
                    <ArrowRightIcon className={s.contactArrow} />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Newsletter ── */}
        <section className={s.newsletter}>
          <div className={s.inner}>
            <div className={s.newsletterCard}>
              <div className={s.newsletterBody}>
                <span className={s.newsletterKicker}>
                  <MailIcon className={s.newsletterKickerIcon} />
                  Newsletter
                </span>
                <h3 className={s.newsletterTitle}>
                  Restez inspire chaque semaine
                </h3>
                <p className={s.newsletterDeck}>
                  Nos meilleures histoires et recommandations, directement
                  dans votre boite mail.
                </p>
              </div>

              {!isSubmitted ? (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className={s.newsletterForm}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={s.newsletterInput}
                    placeholder="votre@email.com"
                  />
                  <button type="submit" className={s.newsletterSubmit}>
                    S&rsquo;inscrire
                    <ArrowRightIcon className={s.newsletterSubmitArrow} />
                  </button>
                </form>
              ) : (
                <div className={s.newsletterSuccess}>
                  <div className={s.successIcon}>
                    <CheckIcon />
                  </div>
                  <p className={s.successText}>
                    Merci ! Verifiez votre boite mail.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
