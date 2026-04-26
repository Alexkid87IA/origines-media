import s from "./Immersions.module.css";

/* ------------------------------------------------------------------ */
/*  CMS types                                                          */
/* ------------------------------------------------------------------ */

export interface CMSImmersion {
  href: string;
  cover: string;
  category: string;
  readTime: string;
  headline: string;
  headlineEm: string;
  description: string;
  author: string;
}

interface ImmersionsProps {
  cmsItems?: CMSImmersion[];
}

/* ------------------------------------------------------------------ */
/*  Data — 5 guides immersifs                                          */
/* ------------------------------------------------------------------ */

interface Guide {
  id: string;
  href: string;
  cover: string;
  num: string;
  date: string;
  category: string;
  format: string;
  readTime: string;
  wordCount: string;
  headline: string;
  headlineEm: string;
  headlineSuffix: string;
  description: string;
  author: string;
  isPaywall: boolean;
  pullquote?: string;
  pullquoteEm?: string;
  fieldDays?: string;
  interviews?: string;
}

const GUIDES: Guide[] = [
  {
    id: "six-mois-famille-cisse",
    href: "/immersions/six-mois-famille-cisse",
    cover: "/series/01_transmission_poster.jpg",
    num: "N° 128",
    date: "Avril 2026",
    category: "Société",
    format: "Enquête",
    readTime: "34 min",
    wordCount: "4 200",
    headline: "Six mois dans une famille qui ",
    headlineEm: "ne se parlait plus",
    headlineSuffix: ".",
    description:
      "Pendant six mois, nous avons suivi les Cissé — quatre personnes qui vivaient sous le même toit et n'avaient pas échangé un mot depuis 2019. Récit d'une fracture ordinaire, et de ce qui a fini par la réparer.",
    author: "Camille Dufresne & Léo Marchand",
    isPaywall: true,
    pullquote:
      "« Au début, elle ne voulait pas qu'on enregistre.",
    pullquoteEm: "Puis elle a demandé qu'on filme.",
    fieldDays: "182",
    interviews: "12",
  },
  {
    id: "portrait-esther-mandelstam",
    href: "/immersions/portrait-esther-mandelstam",
    cover: "/series/02_etat_esprit_poster.jpg",
    num: "N° 127",
    date: "Avril 2026",
    category: "Psychologie",
    format: "Portrait",
    readTime: "22 min",
    wordCount: "2 800",
    headline: "Celle qui a gardé ",
    headlineEm: "les lettres de tous",
    headlineSuffix: ".",
    description:
      "Esther Mandelstam, 94 ans, vit à Belleville dans un appartement rempli de boîtes. À l'intérieur : 82 lettres qui n'ont jamais été envoyées.",
    author: "Émilie Roux",
    isPaywall: false,
  },
  {
    id: "essai-silence-moderne",
    href: "/immersions/essai-silence-moderne",
    cover: "/series/03_il_etait_une_fois_poster.jpg",
    num: "N° 126",
    date: "Avril 2026",
    category: "Spiritualité",
    format: "Essai",
    readTime: "18 min",
    wordCount: "2 100",
    headline: "Le silence est le dernier ",
    headlineEm: "luxe collectif",
    headlineSuffix: ".",
    description:
      "Nous avons perdu l'art de ne rien dire. Essai sur la disparition d'un espace mental — et sur ceux qui, encore, résistent.",
    author: "Mathilde Aubry",
    isPaywall: true,
  },
  {
    id: "homme-qui-marchait-a-rebours",
    href: "/immersions/homme-qui-marchait-a-rebours",
    cover: "/series/04_secrets_professionnels_poster.jpg",
    num: "N° 125",
    date: "Mars 2026",
    category: "Société",
    format: "Reportage",
    readTime: "28 min",
    wordCount: "3 400",
    headline: "L'homme qui marchait ",
    headlineEm: "à rebours",
    headlineSuffix: ".",
    description:
      "Il a traversé la France à pied, du sud au nord, en ne dormant que chez des inconnus. Journal de route d'un marcheur qui cherchait autre chose.",
    author: "Thomas Renard",
    isPaywall: true,
  },
  {
    id: "quand-la-terre-ne-repond-plus",
    href: "/immersions/quand-la-terre-ne-repond-plus",
    cover: "/series/05_la_lettre_poster.jpg",
    num: "N° 124",
    date: "Mars 2026",
    category: "Environnement",
    format: "Enquête",
    readTime: "26 min",
    wordCount: "3 100",
    headline: "Quand la terre ",
    headlineEm: "ne répond plus",
    headlineSuffix: ".",
    description:
      "Dans le Lot, des agriculteurs constatent que leurs sols ne produisent plus rien. Enquête sur un silence géologique.",
    author: "Nora Belkacem",
    isPaywall: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Component (server — no "use client")                               */
/* ------------------------------------------------------------------ */

export default function Immersions({ cmsItems }: ImmersionsProps) {
  const guides = cmsItems && cmsItems.length > 0
    ? cmsItems.map((a, i) => ({
        ...(GUIDES[i] || GUIDES[0]),
        href: a.href,
        cover: a.cover,
        category: a.category,
        readTime: a.readTime,
        headline: a.headline,
        headlineEm: a.headlineEm,
        headlineSuffix: ".",
        description: a.description,
        author: a.author,
      }))
    : GUIDES;
  const featured = guides[0];
  const secondary = guides.slice(1);

  return (
    <section className={s.immersions} aria-labelledby="immersions-heading">
      <div className={`${s.chapterMark} mono`}>
        <span className={s.cNum}>Ch.06</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Immersions</span>
      </div>

      {/* ═══ Section intro ═══ */}
      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            Immersions &middot; Guides exclusifs
          </span>
          <h2 id="immersions-heading" className={s.sectionTitle}>
            Nos plus belles <em>plong&eacute;es.</em>
          </h2>
          <p className={s.sectionDeck}>
            Des guides au long cours &mdash; enqu&ecirc;tes, portraits, essais.
            De 2&nbsp;000 &agrave; 4&nbsp;000 mots, des mois d&rsquo;investigation.
            R&eacute;serv&eacute;s &agrave; nos abonn&eacute;s.
          </p>
        </div>
        <a className={s.sectionAll} href="/articles" aria-label="Toutes les immersions">
          Toutes les immersions
          <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
        </a>
      </header>

      {/* ═══ Featured guide ═══ */}
      <article
        className={s.featured}
        itemScope
        itemType="https://schema.org/Article"
      >
        <a href={featured.href} className={s.featLink} itemProp="url">
          <div className={s.featCover}>
            <img
              src={featured.cover}
              alt={`${featured.headline}${featured.headlineEm}`}
              className={s.featImg}
              loading="lazy"
              decoding="async"
            />
            {featured.isPaywall && (
              <span className={s.lockBadge} aria-label="Réservé aux abonnés">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="7" width="10" height="7" rx="1" />
                  <path d="M5 7V5a3 3 0 0 1 6 0v2" />
                </svg>
              </span>
            )}
            <span className={s.featStamp}>
              <span className={s.featStampNum}>{featured.num}</span>
              <span className={s.featStampDate}>{featured.date}</span>
            </span>
          </div>

          <div className={s.featBody}>
            <div className={s.featMeta}>
              <span className={s.featChip}>{featured.category}</span>
              <span className={s.featFormat}>
                {featured.format} &middot; {featured.readTime}
              </span>
            </div>

            <h3 className={s.featH} itemProp="headline">
              {featured.headline}<em>{featured.headlineEm}</em>{featured.headlineSuffix}
            </h3>

            <p className={s.featDesc} itemProp="description">
              {featured.description}
            </p>

            {featured.pullquote && (
              <blockquote className={s.featQuote}>
                <p>
                  {featured.pullquote}{" "}
                  {featured.pullquoteEm && <em>{featured.pullquoteEm}</em>}
                  &nbsp;&raquo;
                </p>
              </blockquote>
            )}

            <footer className={s.featFoot}>
              <span className={s.featAuthor} itemProp="author">
                Par {featured.author}
              </span>
              <div className={s.featStats}>
                <span><strong>{featured.wordCount}</strong> mots</span>
                {featured.fieldDays && (
                  <><span className={s.featStatSep}>&middot;</span><span><strong>{featured.fieldDays}</strong> jours de terrain</span></>
                )}
                {featured.interviews && (
                  <><span className={s.featStatSep}>&middot;</span><span><strong>{featured.interviews}</strong> interviews</span></>
                )}
              </div>
              <span className={s.featCta}>
                Lire l&rsquo;immersion
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </footer>
          </div>
        </a>
      </article>

      {/* ═══ Grid — 4 secondary guides ═══ */}
      <div className={s.grid}>
        {secondary.map((g) => (
          <article
            key={g.id}
            className={s.card}
            itemScope
            itemType="https://schema.org/Article"
          >
            <a href={g.href} className={s.cardLink} itemProp="url">
              <div className={s.cardCover}>
                <img
                  src={g.cover}
                  alt={`${g.headline}${g.headlineEm}`}
                  className={s.cardImg}
                  loading="lazy"
                  decoding="async"
                />
                {g.isPaywall && (
                  <span className={s.lockBadge} aria-label="Réservé aux abonnés">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="7" width="10" height="7" rx="1" />
                      <path d="M5 7V5a3 3 0 0 1 6 0v2" />
                    </svg>
                  </span>
                )}
                <span className={s.cardStamp}>{g.num}</span>
              </div>
              <div className={s.cardBody}>
                <div className={s.cardMeta}>
                  <span className={s.cardChip}>{g.category}</span>
                  <span className={s.cardFormat}>
                    {g.format} &middot; {g.readTime}
                  </span>
                </div>
                <h3 className={s.cardH} itemProp="headline">
                  {g.headline}<em>{g.headlineEm}</em>{g.headlineSuffix}
                </h3>
                <p className={s.cardDesc} itemProp="description">
                  {g.description}
                </p>
                <span className={s.cardAuthor} itemProp="author">
                  Par {g.author}
                </span>
              </div>
            </a>
          </article>
        ))}
      </div>

      {/* ═══ Subscribe footer ═══ */}
      <footer className={s.subscribe}>
        <div className={s.subscribePitch}>
          <svg className={s.subscribeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="7" width="18" height="14" rx="1" />
            <path d="M8 7V5a4 4 0 0 1 8 0v2" />
          </svg>
          <div>
            <p className={s.subscribeText}>
              Les immersions les plus longues sont <strong>r&eacute;serv&eacute;es aux abonn&eacute;s</strong>.
              Acc&eacute;dez &agrave; l&rsquo;int&eacute;gralit&eacute; de nos guides, sans limite.
            </p>
          </div>
        </div>
        <a href="/newsletter" className={s.subscribeCta}>
          S&rsquo;abonner &middot; 7&nbsp;&euro;/mois
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </footer>
    </section>
  );
}
