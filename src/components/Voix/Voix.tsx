import s from "./Voix.module.css";

/* ------------------------------------------------------------------ */
/*  CMS types                                                          */
/* ------------------------------------------------------------------ */

export interface CMSStory {
  href: string;
  img: string;
  quote: string;
  quoteEm: string;
  author: string;
  category: string;
  readTime: string;
  date: string;
  datetime: string;
}

interface VoixProps {
  cmsStories?: CMSStory[];
}

/* ------------------------------------------------------------------ */
/*  Data — histoires publiées                                          */
/* ------------------------------------------------------------------ */

interface Story {
  href: string;
  img: string;
  quote: string;
  quoteEm: string;
  quoteSuffix: string;
  author: string;
  age: number;
  category: string;
  readTime: string;
  date: string;
  datetime: string;
}

interface Theme {
  id: string;
  name: string;
  count: number;
  color: string;
}

const THEMES: Theme[] = [
  { id: "emotions-bien-etre", name: "Émotions & Bien-être", count: 84, color: "#E6594F" },
  { id: "developpement", name: "Développement", count: 62, color: "#2E9B74" },
  { id: "parcours-resilience", name: "Parcours & Résilience", count: 71, color: "#5A66D6" },
  { id: "relations-famille", name: "Relations & Famille", count: 58, color: "#E67839" },
  { id: "sante-mentale", name: "Santé mentale", count: 47, color: "#2E94B5" },
  { id: "epreuves-inspiration", name: "Épreuves & Inspiration", count: 90, color: "#7B5CD6" },
];

const FEATURED: Story = {
  href: "/histoire/la-lettre-que-j-ai-jamais-envoyee",
  img: "/histoires/histoire_relations_famille.png",
  quote: "J'ai écrit cette lettre à 22 ans. Je ne l'ai postée qu'à 34. ",
  quoteEm: "Et ma mère ne l'a jamais lue.",
  quoteSuffix: "",
  author: "Mathilde",
  age: 34,
  category: "Relations & Famille",
  readTime: "12 min",
  date: "Il y a 2 jours",
  datetime: "2026-04-21",
};

const STORIES: Story[] = [
  {
    href: "/histoire/procrastination-honte",
    img: "/histoires/histoire_emotions_bienetre.png",
    quote: "Ce n'est pas la paresse. C'est la ",
    quoteEm: "honte",
    quoteSuffix: ". Et je ne l'ai compris qu'à 38 ans, en thérapie.",
    author: "Sarah",
    age: 38,
    category: "Émotions",
    readTime: "7 min",
    date: "Hier",
    datetime: "2026-04-22",
  },
  {
    href: "/histoire/partir-seul-a-50",
    img: "/histoires/histoire_parcours_resilience.png",
    quote: "À 52 ans, après le divorce, j'ai vendu la maison. Je suis partie ",
    quoteEm: "seule",
    quoteSuffix: ". Et quelque chose s'est réparé.",
    author: "Hélène",
    age: 52,
    category: "Parcours",
    readTime: "9 min",
    date: "Il y a 4 jours",
    datetime: "2026-04-19",
  },
  {
    href: "/histoire/la-depression-de-mon-frere",
    img: "/histoires/histoire_sante_mentale.png",
    quote: "Mon frère ne parle presque plus. Je ne sais plus comment ",
    quoteEm: "entrer",
    quoteSuffix: " dans sa chambre — alors j'ai décidé d'écrire.",
    author: "Théo",
    age: 29,
    category: "Santé mentale",
    readTime: "11 min",
    date: "Il y a 6 jours",
    datetime: "2026-04-17",
  },
];

/* ------------------------------------------------------------------ */
/*  Component (server — no "use client")                               */
/* ------------------------------------------------------------------ */

export default function Voix({ cmsStories }: VoixProps) {
  return (
    <section className={s.voix} aria-labelledby="voix-heading">
      <div className={`${s.chapterMark} mono`}>
        <span className={s.cNum}>Ch.07</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Vos histoires</span>
      </div>

      {/* ═══ Section intro ═══ */}
      <header className={s.sectionHead}>
        <div className={s.sectionLabel}>
          <span className={s.sectionKicker}>
            <span className={s.sectionKickerDot} aria-hidden="true" />
            Vos histoires &middot; 412 publi&eacute;es
          </span>
          <h2 id="voix-heading" className={s.sectionTitle}>
            Vous avez une histoire<br />
            <em>qui m&eacute;rite d&rsquo;&ecirc;tre entendue.</em>
          </h2>
          <p className={s.sectionDeck}>
            Un r&eacute;cit, un t&eacute;moignage, un moment-pivot. Quelque chose que vous
            n&rsquo;avez jamais dit &agrave; voix haute. On vous lit, on vous appelle, et
            si l&rsquo;histoire le demande &mdash; on la publie avec vous.
          </p>
        </div>
        <a className={s.sectionAll} href="/histoires" aria-label="Toutes les histoires">
          Toutes les histoires
          <span className={s.sectionAllArrow} aria-hidden="true">&rarr;</span>
        </a>
      </header>

      {/* ═══ Theme chips ═══ */}
      <nav className={s.themes} aria-label="Th&egrave;mes d&rsquo;histoires">
        {THEMES.map((t) => (
          <a
            key={t.id}
            href={`/histoires/${t.id}`}
            className={s.theme}
            style={{ "--t-color": t.color } as React.CSSProperties}
          >
            <span className={s.themeDot} aria-hidden="true" />
            <span className={s.themeName}>{t.name}</span>
            <span className={s.themeCount}>{t.count}</span>
          </a>
        ))}
      </nav>

      {/* ═══ Featured story ═══ */}
      {(() => {
        const feat = cmsStories?.[0]
          ? { ...FEATURED, href: cmsStories[0].href, img: cmsStories[0].img, quote: cmsStories[0].quote, quoteEm: cmsStories[0].quoteEm, quoteSuffix: "", author: cmsStories[0].author, category: cmsStories[0].category, readTime: cmsStories[0].readTime, date: cmsStories[0].date, datetime: cmsStories[0].datetime }
          : FEATURED;
        return (
          <article
            className={s.featured}
            itemScope
            itemType="https://schema.org/Article"
          >
            <a href={feat.href} className={s.featLink} itemProp="url">
              <div className={s.featImgWrap}>
                <img
                  src={feat.img}
                  alt={`Histoire de ${feat.author}`}
                  className={s.featImg}
                  loading="lazy"
                  decoding="async"
                />
                <span className={s.featBadge}>Histoire de la semaine</span>
              </div>

              <div className={s.featBody}>
                <span className={s.featCategory}>{feat.category}</span>
                <blockquote className={s.featQuote}>
                  <span className={s.featQuoteMark} aria-hidden="true">&ldquo;</span>
                  <p className={s.featQuoteText} itemProp="headline">
                    {feat.quote}<em>{feat.quoteEm}</em>{feat.quoteSuffix}
                  </p>
                </blockquote>
                <footer className={s.featFoot}>
                  <div className={s.featAuthor}>
                    <span className={s.featAuthorLine} aria-hidden="true" />
                    <cite itemProp="author">{feat.author}{feat.age ? `, ${feat.age} ans` : ""}</cite>
                  </div>
                  <div className={s.featMeta}>
                    <time itemProp="datePublished" dateTime={feat.datetime}>{feat.date}</time>
                    <span className={s.featMetaSep}>&middot;</span>
                    <span>{feat.readTime}</span>
                  </div>
                  <span className={s.featCta}>
                    Lire l&rsquo;histoire
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </footer>
              </div>
            </a>
          </article>
        );
      })()}

      {/* ═══ Grid — 3 stories ═══ */}
      <div className={s.grid}>
        {(cmsStories && cmsStories.length > 1
          ? cmsStories.slice(1).map((cs, i) => ({
              ...(STORIES[i] || STORIES[0]),
              href: cs.href,
              img: cs.img,
              quote: cs.quote,
              quoteEm: cs.quoteEm,
              quoteSuffix: "",
              author: cs.author,
              category: cs.category,
              readTime: cs.readTime,
              date: cs.date,
              datetime: cs.datetime,
            }))
          : STORIES
        ).map((story) => (
          <article
            key={story.href}
            className={s.card}
            itemScope
            itemType="https://schema.org/Article"
          >
            <a href={story.href} className={s.cardLink} itemProp="url">
              <div className={s.cardImgWrap}>
                <img
                  src={story.img}
                  alt={`Histoire de ${story.author}`}
                  className={s.cardImg}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className={s.cardBody}>
                <span className={s.cardCategory}>{story.category}</span>
                <blockquote className={s.cardQuote}>
                  <p className={s.cardQuoteText} itemProp="headline">
                    {story.quote}<em>{story.quoteEm}</em>{story.quoteSuffix}
                  </p>
                </blockquote>
                <footer className={s.cardFoot}>
                  <span className={s.cardAuthorLine} aria-hidden="true" />
                  <cite className={s.cardAuthor} itemProp="author">
                    {story.author}, {story.age} ans
                  </cite>
                  <span className={s.cardFootSep}>&middot;</span>
                  <time dateTime={story.datetime}>{story.date}</time>
                </footer>
              </div>
            </a>
          </article>
        ))}
      </div>

      {/* ═══ Submit pitch ═══ */}
      <div className={s.submit}>
        <div className={s.submitLeft}>
          <h3 className={s.submitTitle}>
            Racontez <em>la v&ocirc;tre.</em>
          </h3>
          <p className={s.submitDesc}>
            10 minutes suffisent. Aucune forme impos&eacute;e. Anonyme ou sign&eacute;
            &mdash; vous d&eacute;cidez.
          </p>
        </div>

        <ol className={s.submitSteps}>
          <li className={s.submitStep}>
            <span className={s.submitStepNum}>01</span>
            <span className={s.submitStepLabel}>Vous &eacute;crivez</span>
          </li>
          <li className={s.submitStep}>
            <span className={s.submitStepNum}>02</span>
            <span className={s.submitStepLabel}>On vous lit</span>
          </li>
          <li className={s.submitStep}>
            <span className={s.submitStepNum}>03</span>
            <span className={s.submitStepLabel}>On publie ensemble</span>
          </li>
        </ol>

        <a href="/share-story" className={s.submitCta}>
          Raconter mon histoire
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
