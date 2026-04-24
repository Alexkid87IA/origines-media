import s from "./Recos.module.css";

/* ------------------------------------------------------------------ */
/*  CMS types                                                          */
/* ------------------------------------------------------------------ */

export interface CMSReco {
  href: string;
  img: string;
  category: string;
  categoryColor: string;
  title: string;
  titleEm: string;
  excerpt: string;
  reviewer: string;
  meta: string;
  isCoupDeCoeur?: boolean;
}

interface RecosProps {
  cmsRecos?: CMSReco[];
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Category {
  id: string;
  name: string;
  count: number;
  color: string;
  sample: string;
}

const CATEGORIES: Category[] = [
  { id: "livres", name: "Livres", count: 32, color: "#D64C90", sample: "Les lettres de Drancy, Esther Mandelstam." },
  { id: "films-series", name: "Films & Séries", count: 28, color: "#7B5CD6", sample: "Perfect Days de Wim Wenders." },
  { id: "musique", name: "Musique", count: 18, color: "#5A66D6", sample: "Nils Frahm, All Melody." },
  { id: "podcasts", name: "Podcasts", count: 24, color: "#2E94B5", sample: "Le code a changé, France Inter." },
  { id: "social", name: "Social", count: 14, color: "#1EA0A3", sample: "@lentement sur Instagram." },
  { id: "youtube", name: "YouTube", count: 22, color: "#E67839", sample: "Kurzgesagt, In a Nutshell." },
  { id: "activite", name: "Activité", count: 12, color: "#5AA352", sample: "Marche silencieuse en forêt." },
  { id: "destination", name: "Destination", count: 16, color: "#2E9B74", sample: "Les îles Lofoten, Norvège." },
  { id: "culture", name: "Culture", count: 9, color: "#C99B1E", sample: "Expo Soulages, Centre Pompidou." },
  { id: "produits", name: "Produits", count: 11, color: "#3E7DD6", sample: "Carnet Leuchtturm1917, A5 pointillé." },
];

interface Reco {
  href: string;
  img: string;
  category: string;
  categoryColor: string;
  title: string;
  titleEm: string;
  excerpt: string;
  reviewer: string;
  meta: string;
}

const FEATURED: Reco = {
  href: "/recommandations/lettre-a-drancy",
  img: "/recos/reco_livre.png",
  category: "Livre",
  categoryColor: "#D64C90",
  title: "Les lettres de Drancy, ",
  titleEm: "Esther Mandelstam",
  excerpt:
    "Un recueil de 82 lettres jamais envoyées, exhumées en 2023 dans un grenier parisien. On lit ça comme on regarderait une photo en noir et blanc qui aurait quelque chose à nous dire.",
  reviewer: "Camille D.",
  meta: "Hier",
};

const SECONDARY: Reco[] = [
  {
    href: "/recommandations/podcast-le-code-a-change",
    img: "/recos/reco_podcast.png",
    category: "Podcast",
    categoryColor: "#2E94B5",
    title: "Quand l'IA écrit ",
    titleEm: "à notre place",
    excerpt:
      "Xavier de La Porte reçoit une linguiste. On en ressort un peu moins sûr de nous, et c'est peut-être ce qu'il fallait.",
    reviewer: "Léo M.",
    meta: "42 min",
  },
  {
    href: "/recommandations/film-perfect-days",
    img: "/recos/reco_film_serie.png",
    category: "Film",
    categoryColor: "#7B5CD6",
    title: "L'éloge de la ",
    titleEm: "répétition",
    excerpt:
      "Un nettoyeur de toilettes de Tokyo. Deux heures de presque rien. Un des films les plus doux qu'on ait vus cette année.",
    reviewer: "Émilie R.",
    meta: "2h 03",
  },
  {
    href: "/recommandations/destination-lofoten",
    img: "/recos/reco_destination.png",
    category: "Destination",
    categoryColor: "#2E9B74",
    title: "Là où la mer ",
    titleEm: "éclaire les montagnes",
    excerpt:
      "Quarante heures de train depuis Oslo. Des cabanes rouges, une lumière qui ne ressemble à rien. On repart changé.",
    reviewer: "Camille D.",
    meta: "4 jours min.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Recos({ cmsRecos }: RecosProps) {
  const featuredReco = cmsRecos?.[0]
    ? { ...FEATURED, href: cmsRecos[0].href, img: cmsRecos[0].img, category: cmsRecos[0].category, categoryColor: cmsRecos[0].categoryColor, title: cmsRecos[0].title, titleEm: cmsRecos[0].titleEm, excerpt: cmsRecos[0].excerpt, reviewer: cmsRecos[0].reviewer, meta: cmsRecos[0].meta }
    : FEATURED;
  const secondaryRecos = cmsRecos && cmsRecos.length > 1
    ? cmsRecos.slice(1).map((r, i) => ({
        ...(SECONDARY[i] || SECONDARY[0]),
        href: r.href,
        img: r.img,
        category: r.category,
        categoryColor: r.categoryColor,
        title: r.title,
        titleEm: r.titleEm,
        excerpt: r.excerpt,
        reviewer: r.reviewer,
        meta: r.meta,
      }))
    : SECONDARY;
  return (
    <section className={s.recos} aria-labelledby="recos-heading">
      <div className={`${s.chapterMark} mono`}>
        <span className={s.cNum}>Ch.09</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Recos</span>
      </div>

      {/* ═══ Section intro ═══ */}
      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            Recos de la r&eacute;dac &middot; 186 curations
          </span>
          <h2 id="recos-heading" className={s.sectionTitle}>
            Ce qu&rsquo;on a <em>aim&eacute;</em> cette semaine.
          </h2>
          <p className={s.sectionDeck}>
            Des livres, des podcasts, des lieux, des films &mdash; s&eacute;lectionn&eacute;s
            un par un par la r&eacute;dac. Aucun deal, aucune pub&nbsp;: juste ce qui
            nous a touch&eacute;.
          </p>
        </div>
        <a className={s.sectionAll} href="/recommandations" aria-label="Toutes les recos">
          Toutes les recos
          <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
        </a>
      </header>

      {/* ═══ 10 category chips ═══ */}
      <nav className={s.cats} aria-label="Cat&eacute;gories de recommandations">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`/recommandations/${cat.id}`}
            className={s.cat}
            style={{ "--cat-color": cat.color } as React.CSSProperties}
          >
            <span className={s.catDot} aria-hidden="true" />
            <span className={s.catName}>{cat.name}</span>
            <span className={s.catCount}>{cat.count}</span>
          </a>
        ))}
      </nav>

      {/* ═══ Featured coup de coeur ═══ */}
      <article className={s.featured}>
        <a href={featuredReco.href} className={s.featLink}>
          <div className={s.featImgWrap}>
            <img
              src={featuredReco.img}
              alt={`${featuredReco.title}${featuredReco.titleEm}`}
              className={s.featImg}
              loading="lazy"
              decoding="async"
            />
            <span className={s.featBadge}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" aria-hidden="true">
                <path d="M12 21s-7-4-10-9c-2-3 0-8 4-8 2 0 3 1 4 2 1-1 2-2 4-2 4 0 6 5 4 8-3 5-10 9-10 9z" />
              </svg>
              Coup de c&oelig;ur
            </span>
          </div>
          <div className={s.featBody}>
            <span className={s.featCategory} style={{ color: featuredReco.categoryColor }}>
              {featuredReco.category}
            </span>
            <h3 className={s.featH}>
              {featuredReco.title}<em>{featuredReco.titleEm}</em>.
            </h3>
            <p className={s.featExcerpt}>{featuredReco.excerpt}</p>
            <footer className={s.featFoot}>
              <span className={s.featReviewer}>
                Choisi par <strong>{featuredReco.reviewer}</strong>
              </span>
              <span className={s.featMetaSep}>&middot;</span>
              <span>{featuredReco.meta}</span>
              <span className={s.featCta}>
                Lire notre critique
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </footer>
          </div>
        </a>
      </article>

      {/* ═══ 3 secondary recos ═══ */}
      <div className={s.grid}>
        {secondaryRecos.map((reco) => (
          <article key={reco.href} className={s.card}>
            <a href={reco.href} className={s.cardLink}>
              <div className={s.cardImgWrap}>
                <img
                  src={reco.img}
                  alt={`${reco.title}${reco.titleEm}`}
                  className={s.cardImg}
                  loading="lazy"
                  decoding="async"
                />
                <span className={s.cardType} style={{ background: reco.categoryColor }}>
                  {reco.category}
                </span>
              </div>
              <div className={s.cardBody}>
                <h3 className={s.cardH}>
                  {reco.title}<em>{reco.titleEm}</em>.
                </h3>
                <p className={s.cardExcerpt}>{reco.excerpt}</p>
                <footer className={s.cardFoot}>
                  <span>Par {reco.reviewer}</span>
                  <span className={s.cardFootSep}>&middot;</span>
                  <span>{reco.meta}</span>
                </footer>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
