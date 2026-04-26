import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import s from "./Spotlight.module.css";

export interface CMSSpotlightItem {
  univers: UniversId;
  category: string;
  title: string;
  deck: string;
  author: string;
  readTime: string;
  href: string;
  image: string;
  date: string;
  isVideo?: boolean;
}

interface SpotlightProps {
  cmsItems?: CMSSpotlightItem[];
}

/* ------------------------------------------------------------------ */
/*  Fallback data                                                      */
/* ------------------------------------------------------------------ */

const FALLBACK: CMSSpotlightItem[] = [
  {
    univers: "corps",
    category: "Santé",
    title: "On a tous un corps. Très peu savent l'écouter.",
    deck: "Pendant des mois, notre rédaction a suivi cinq personnes qui ont décidé de tout changer. Pas de régime, pas de coach. Juste une attention nouvelle portée aux signaux que le corps envoie.",
    author: "Léo Marchand",
    readTime: "32 min",
    href: "/article/ecouter-son-corps",
    image: "/covers/cover-03.webp",
    date: "2026-04-25",
  },
  {
    univers: "esprit",
    category: "Psychologie",
    title: "Ce que cache la procrastination.",
    deck: "Ce n'est pas de la paresse. C'est un signal.",
    author: "Marie Dupont",
    readTime: "14 min",
    href: "/article/procrastination",
    image: "/covers/cover-05.webp",
    date: "2026-04-24",
  },
  {
    univers: "liens",
    category: "Famille",
    title: "La conversation qu'on repousse toujours.",
    deck: "On vit avec des non-dits qui pèsent plus lourd que les mots.",
    author: "Clara Dubois",
    readTime: "18 min",
    href: "/article/conversation-repoussee",
    image: "/covers/cover-06.webp",
    date: "2026-04-23",
  },
  {
    univers: "monde",
    category: "Voyage",
    title: "2 200 km à pied, seul.",
    deck: "Il a tout quitté. Il raconte ce qu'il a trouvé.",
    author: "Thomas Leroy",
    readTime: "22 min",
    href: "/article/2200-km-a-pied",
    image: "/covers/cover-07.webp",
    date: "2026-04-22",
  },
  {
    univers: "avenir",
    category: "Travail",
    title: "Le retour du numérique lent.",
    deck: "Moins d'écrans, plus de sens.",
    author: "Sophie Martin",
    readTime: "8 min",
    href: "/article/numerique-lent",
    image: "/covers/cover-08.webp",
    date: "2026-04-21",
    isVideo: true,
  },
  {
    univers: "esprit",
    category: "Conscience",
    title: "Pourquoi on ne sait plus s'ennuyer.",
    deck: "L'ennui est un luxe que personne ne s'offre.",
    author: "Julie Perrin",
    readTime: "11 min",
    href: "/article/ennui-modernite",
    image: "/covers/cover-09.webp",
    date: "2026-04-20",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  } catch {
    return "";
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Spotlight({ cmsItems }: SpotlightProps) {
  const items = cmsItems && cmsItems.length > 0 ? cmsItems : FALLBACK;
  const [lead, ...rest] = items;
  const leadU = UNIVERS_MAP[lead.univers];

  return (
    <section className={s.spotlight} aria-labelledby="spotlight-title">
      {/* ── Chapter mark ── */}
      <div className={s.chapterMark}>
        <span className={`${s.cNum} mono`}>Ch.02</span>
        <span className={`${s.cSep} mono`}>/</span>
        <span className={`${s.cLabel} mono`}>Ce qui vient de para&icirc;tre</span>
      </div>

      {/* ── Section intro ── */}
      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            Derni&egrave;res publications
          </span>
          <h2 id="spotlight-title" className={s.sectionTitle}>
            Ce qu&rsquo;on vient <em>de publier.</em>
          </h2>
          <p className={s.sectionDeck}>
            Les articles, vid&eacute;os et r&eacute;cits les plus r&eacute;cents.
            Frais du jour &mdash; avant que le fil ne les emporte.
          </p>
        </div>
        <a className={s.sectionAll} href="/articles" aria-label="Tous les articles">
          Tout voir
          <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
        </a>
      </header>

      {/* ── Lead article — full width ── */}
      <a href={lead.href} className={s.leadCard}>
        <div className={s.leadImage}>
          <img
            src={lead.image}
            alt={lead.title}
            className={s.leadImg}
            loading="lazy"
            decoding="async"
          />
          {lead.isVideo && (
            <span className={s.leadVideoBadge} aria-label="Vidéo">
              <svg viewBox="0 0 24 24" fill="currentColor" className={s.leadVideoIcon}>
                <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z" />
              </svg>
              Vid&eacute;o
            </span>
          )}
        </div>
        <div className={s.leadText}>
          <div className={s.leadMeta}>
            <span className={s.leadTag} style={{ color: leadU.color }}>
              {lead.category}
            </span>
            <span className={s.leadDate}>{formatDate(lead.date)}</span>
          </div>
          <h3 className={s.leadTitle}>{lead.title}</h3>
          <p className={s.leadDeck}>{lead.deck}</p>
          <div className={s.leadByline}>
            Par <strong>{lead.author}</strong>
            <span className={s.dot} />
            {lead.readTime}
            <SaveBookmark
              inline
              type={lead.isVideo ? "video" : "article"}
              slug={lead.href.split("/").pop() || ""}
              title={lead.title}
              image={lead.image}
              univers={lead.category}
            />
          </div>
        </div>
      </a>

      {/* ── Recent grid — 5 smaller cards ── */}
      {rest.length > 0 && (
        <div className={s.grid}>
          {rest.map((item) => {
            const u = UNIVERS_MAP[item.univers];
            return (
              <a key={item.href} href={item.href} className={s.card}>
                <div className={s.cardThumb}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={s.cardImg}
                    loading="lazy"
                    decoding="async"
                  />
                  {item.isVideo && (
                    <span className={s.cardVideoBadge} aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className={s.cardBody}>
                  <div className={s.cardMeta}>
                    <span className={s.cardDot} style={{ background: u.color }} aria-hidden="true" />
                    <span className={s.cardCategory}>{item.category}</span>
                    <span className={s.cardDate}>{formatDate(item.date)}</span>
                  </div>
                  <h4 className={s.cardTitle}>{item.title}</h4>
                  <span className={s.cardByline}>
                    {item.author}
                    <span className={s.dot} />
                    {item.readTime}
                    <SaveBookmark
                      inline
                      type={item.isVideo ? "video" : "article"}
                      slug={item.href.split("/").pop() || ""}
                      title={item.title}
                      image={item.image}
                      univers={item.category}
                    />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
