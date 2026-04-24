import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./Spotlight.module.css";

export interface CMSSpotlight {
  univers: UniversId;
  category: string;
  title: string;
  deck: string;
  author: string;
  readTime: string;
  href: string;
  image: string;
}

export interface CMSEditorial {
  univers: UniversId;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  href: string;
  image: string;
}

interface SpotlightProps {
  cmsPick?: CMSSpotlight;
  cmsEditorial?: CMSEditorial[];
}

/* ------------------------------------------------------------------ */
/*  1. Choix de la rédaction — article unique pleine largeur            */
/* ------------------------------------------------------------------ */

const PICK = {
  univers: "corps" as UniversId,
  category: "Santé",
  tag: "Le choix de la rédaction",
  title: "On a tous un corps. Très peu savent l'écouter.",
  deck: "Pendant des mois, notre rédaction a suivi cinq personnes qui ont décidé de tout changer. Pas de régime, pas de coach. Juste une attention nouvelle portée aux signaux que le corps envoie — et qu'on a appris à ignorer.",
  author: "Léo Marchand",
  readTime: "32 min",
  href: "/article/ecouter-son-corps",
  image: "/covers/cover-03.jpg",
  imageAlt: "Un homme assis en silence, les yeux fermés, la lumière du matin sur le visage.",
};

/* ------------------------------------------------------------------ */
/*  2. Suivre Origines — canaux                                        */
/* ------------------------------------------------------------------ */

const CHANNELS = [
  {
    name: "Newsletter",
    desc: "Chaque dimanche, le meilleur de la semaine.",
    href: "/newsletter",
    icon: "mail",
  },
  {
    name: "YouTube",
    desc: "Documentaires et conversations longues.",
    href: "https://youtube.com/@origines",
    icon: "play",
  },
  {
    name: "Instagram",
    desc: "Citations, extraits, coulisses.",
    href: "https://instagram.com/origines.media",
    icon: "camera",
  },
  {
    name: "Podcast",
    desc: "Des voix, des silences, des histoires.",
    href: "/podcast",
    icon: "mic",
  },
  {
    name: "LinkedIn",
    desc: "Réflexions sur le travail et le sens.",
    href: "https://linkedin.com/company/origines-media",
    icon: "briefcase",
  },
];

/* ------------------------------------------------------------------ */
/*  3. Articles éditoriaux (layout inversé : texte en haut, image bas) */
/* ------------------------------------------------------------------ */

const EDITORIAL = [
  {
    univers: "esprit" as UniversId,
    category: "Psychologie",
    title: "Le jour où j'ai arrêté de me mentir.",
    excerpt: "On croit se connaître. Puis un matin, une phrase anodine fait tout basculer. Récit d'un effondrement nécessaire.",
    author: "Émilie Roux",
    readTime: "14 min",
    href: "/article/arreter-de-mentir",
    image: "/covers/cover-01.jpg",
    imageAlt: "Une femme qui regarde par la fenêtre, pensive.",
  },
  {
    univers: "monde" as UniversId,
    category: "Voyage",
    title: "Là où les routes s'arrêtent, tout commence.",
    excerpt: "Au bout de l'asphalte, il y a un village sans nom sur aucune carte. Et des gens qui n'ont jamais eu besoin qu'on les trouve.",
    author: "Camille Dufresne",
    readTime: "22 min",
    href: "/article/routes-bout-du-monde",
    image: "/covers/cover-04.jpg",
    imageAlt: "Un chemin de terre qui disparaît dans la brume.",
  },
  {
    univers: "liens" as UniversId,
    category: "Famille",
    title: "Aimer quelqu'un qu'on ne comprend pas.",
    excerpt: "Ce n'est pas un échec de communication. C'est peut-être la forme la plus honnête de l'amour : accepter de ne pas tout saisir.",
    author: "Mathilde Aubry",
    readTime: "17 min",
    href: "/article/aimer-sans-comprendre",
    image: "/covers/cover-05.jpg",
    imageAlt: "Deux silhouettes assises dos à dos sur un banc.",
  },
];

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG)                                                  */
/* ------------------------------------------------------------------ */

function ChannelIcon({ icon }: { icon: string }) {
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": true as const, className: s.channelSvg };
  switch (icon) {
    case "mail":
      return <svg {...props}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case "play":
      return <svg {...props}><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case "camera":
      return <svg {...props}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" /></svg>;
    case "mic":
      return <svg {...props}><path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" /><path d="M19 10v1a7 7 0 01-14 0v-1M12 18v4M8 22h8" /></svg>;
    case "briefcase":
      return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Spotlight({ cmsPick, cmsEditorial }: SpotlightProps) {
  const pick = cmsPick
    ? { ...PICK, univers: cmsPick.univers, category: cmsPick.category, title: cmsPick.title, deck: cmsPick.deck, author: cmsPick.author, readTime: cmsPick.readTime, href: cmsPick.href, image: cmsPick.image }
    : PICK;
  const editorial = cmsEditorial
    ? cmsEditorial.map((a, i) => ({ ...(EDITORIAL[i] || EDITORIAL[0]), univers: a.univers, category: a.category, title: a.title, excerpt: a.excerpt, author: a.author, readTime: a.readTime, href: a.href, image: a.image }))
    : EDITORIAL;
  const pickU = UNIVERS_MAP[pick.univers];

  return (
    <section className={s.spotlight} aria-labelledby="spotlight-title">
      {/* ═══ Choix de la rédaction — pleine largeur ═══ */}
      <div className={s.chapterMark}>
        <span className={`${s.cNum} mono`}>Ch.02</span>
        <span className={`${s.cSep} mono`}>/</span>
        <span className={`${s.cLabel} mono`}>Le choix de la r&eacute;daction</span>
      </div>

      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            S&eacute;lection &middot; &Eacute;ditorial
          </span>
          <h3 className={s.sectionTitle}>
            Ce qu&rsquo;on a <em>choisi pour vous.</em>
          </h3>
          <p className={s.sectionDeck}>
            Chaque jour, la r&eacute;daction s&eacute;lectionne les articles qui comptent.
            Une curation exigeante &mdash; ni algorithme, ni tendances. Juste ce qui
            m&eacute;rite votre temps.
          </p>
        </div>
        <a className={s.sectionAll} href="/selection" aria-label="Toute la sélection">
          Toute la s&eacute;lection
          <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
        </a>
      </header>

      <a href={pick.href} className={s.pickCard}>
        <div className={s.pickText}>
          <span className={s.pickTag} style={{ color: pickU.color }}>
            {pick.category || pickU.name}
          </span>
          <h2 id="spotlight-title" className={s.pickTitle}>{pick.title}</h2>
          <p className={s.pickDeck}>{pick.deck}</p>
          <div className={s.pickByline}>
            Par <strong>{pick.author}</strong>
            <span className={s.dot} />
            {pick.readTime}
          </div>
        </div>
        <div className={s.pickImage}>
          <img src={pick.image} alt={pick.imageAlt} className={s.pickImg} />
        </div>
      </a>

      {/* ═══ Suivre Origines + 3 articles ═══ */}
      <div className={s.followGrid}>
        {/* Sidebar — canaux */}
        <aside className={s.followSidebar}>
          <h3 className={s.followTitle}>Suivre Origines</h3>
          <div className={s.channelList}>
            {CHANNELS.map((ch) => (
              <a
                key={ch.name}
                href={ch.href}
                className={s.channelItem}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <ChannelIcon icon={ch.icon} />
                <div className={s.channelInfo}>
                  <span className={s.channelName}>{ch.name}</span>
                  <span className={s.channelDesc}>{ch.desc}</span>
                </div>
              </a>
            ))}
          </div>
        </aside>

        {/* 3 articles éditoriaux */}
        {editorial.map((article) => {
          const u = UNIVERS_MAP[article.univers];
          return (
            <a key={article.href} href={article.href} className={s.edCard}>
              <div className={s.edContent}>
                <span className={s.edTag} style={{ color: u.color }}>
                  {article.category || u.name}
                </span>
                <h3 className={s.edTitle}>{article.title}</h3>
                <p className={s.edExcerpt}>{article.excerpt}</p>
                <span className={s.edMeta}>
                  Par <strong>{article.author}</strong> &middot; {article.readTime}
                </span>
              </div>
              <img src={article.image} alt={article.imageAlt} className={s.edImg} />
            </a>
          );
        })}
      </div>

      <div className={s.sectionBottom}>
        <a className={s.sectionBottomCta} href="/selection">
          Toute la s&eacute;lection
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
