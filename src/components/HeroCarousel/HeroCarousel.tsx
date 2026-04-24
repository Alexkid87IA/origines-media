import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import s from "./HeroCarousel.module.css";

export interface CMSArticle {
  univers: UniversId;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  href: string;
  image: string;
}

interface HeroCarouselProps {
  cmsMain?: CMSArticle;
  cmsSecondary?: CMSArticle[];
}

const MAIN_ARTICLE = {
  univers: "esprit" as UniversId,
  category: "Psychologie",
  meta: "Enquête · N°09",
  title: "Pourquoi on ne finit jamais rien.",
  deck: "Derrière ce qu'on appelle un manque de motivation se cache autre chose : un cerveau qui tourne trop vite, et une honte qu'on ne sait pas nommer.",
  author: "Émilie Roux",
  readTime: "Lecture 24 min",
  href: "/article/pourquoi-on-ne-finit-jamais-rien",
  image: "/covers/cover-01.jpg",
  coverFocusX: 70,
  coverFocusY: 38,
};

const DOSSIER = {
  question: "Pourquoi dort-on si mal ?",
  week: 17,
  slug: "semaine-17-sommeil",
  univers: "corps" as UniversId,
  publishedCount: 3,
  totalCount: 7,
  href: "/dossiers/semaine-17-sommeil",
};

const VIDEO = {
  title: "Ce que personne ne dit sur la fatigue chronique.",
  duration: "18:42",
  thumbnail: "/covers/cover-03.jpg",
  href: "/video/fatigue-chronique",
  channel: "Origines · Documentaire",
};

const GUIDE = {
  label: "Guide gratuit",
  title: "7 jours pour reprendre le contrôle de son attention.",
  description: "Un exercice par jour, guidé par notre rédaction. Sans inscription.",
  href: "/guides/attention-7-jours",
  cta: "Télécharger le guide",
};

const SECONDARY = [
  {
    univers: "monde" as UniversId,
    category: "Voyage",
    title: "2 200 kilomètres pour cesser d'avoir peur.",
    excerpt: "Elle est partie seule, sans itinéraire. Ce qu'elle a trouvé en chemin, c'est tout ce qu'elle fuyait.",
    author: "Camille Dufresne",
    readTime: "18 min",
    href: "/article/2200-kilometres",
    image: "/covers/cover-02.jpg",
  },
  {
    univers: "liens" as UniversId,
    category: "Famille",
    title: "Ma mère ne veut plus qu'on se voie.",
    excerpt: "Un jour, le téléphone a cessé de sonner. Récit d'une rupture que personne n'ose nommer.",
    author: "Mathilde Aubry",
    readTime: "16 min",
    href: "/article/rupture-mere-fille",
    image: "/covers/cover-05.jpg",
  },
  {
    univers: "avenir" as UniversId,
    category: "Tech",
    title: "L'IA va-t-elle nous remplacer ?",
    excerpt: "La question n'est plus si, mais quand. Et surtout : comment s'y préparer sans paniquer.",
    author: "Studio Origines",
    readTime: "20 min",
    href: "/article/ia-travail",
    image: "/covers/cover-04.jpg",
  },
];

export default function HeroCarousel({ cmsMain, cmsSecondary }: HeroCarouselProps) {
  const main = cmsMain
    ? { ...MAIN_ARTICLE, univers: cmsMain.univers, category: cmsMain.category, title: cmsMain.title, deck: cmsMain.excerpt, author: cmsMain.author, readTime: cmsMain.readTime, href: cmsMain.href, image: cmsMain.image }
    : MAIN_ARTICLE;
  const secondary = cmsSecondary
    ? cmsSecondary.map((a, i) => ({ ...(SECONDARY[i] || SECONDARY[0]), univers: a.univers, category: a.category, title: a.title, excerpt: a.excerpt, author: a.author, readTime: a.readTime, href: a.href, image: a.image }))
    : SECONDARY;
  const mainU = UNIVERS_MAP[main.univers];
  const dossierU = UNIVERS_MAP[DOSSIER.univers];
  const progress = (DOSSIER.publishedCount / DOSSIER.totalCount) * 100;

  return (
    <section className={s.hero}>
        <div className={`${s.chapterMark} mono`}>
          <span className={s.cNum}>Ch.01</span>
          <span className={s.cSep}>/</span>
          <span className={s.cLabel}>&Agrave; la une</span>
        </div>

        <div className={s.heroGrid}>
          {/* COL 1 — Article principal */}
          <a
            href={main.href}
            className={s.mainCol}
            style={{
              backgroundImage: `url('${main.image}')`,
              backgroundPosition: `${main.coverFocusX}% ${main.coverFocusY}%`,
            }}
          >
            <span className={s.mainGradient} />
            <div className={s.mainContent}>
              <div className={s.mainKicker}>
                <span className={s.mainTag} style={{ background: mainU.color }}>
                  {main.category || mainU.name}
                </span>
                <span className={s.mainMeta}>{main.meta}</span>
              </div>
              <h1 className={s.mainTitle}>{main.title}</h1>
              <p className={s.mainDeck}>{main.deck}</p>
              <div className={s.mainByline}>
                Par <strong>{main.author}</strong>
                <span className={s.dot} />
                {main.readTime}
              </div>
            </div>
          </a>

          {/* COL 2 — Dossier + Vidéo + Guide */}
          <div className={s.centerCol}>
            <a href={DOSSIER.href} className={s.dossierBlock}>
              <div className={s.dossierHead}>
                <span className={s.dossierLabel}>La question de la semaine</span>
                <span className={s.dossierWeek}>S.{DOSSIER.week}</span>
              </div>
              <h2 className={s.dossierQuestion}>{DOSSIER.question}</h2>
              <div className={s.dossierFoot}>
                <span className={s.dossierUnivers} style={{ background: dossierU.color }}>
                  {dossierU.name}
                </span>
                <span className={s.dossierProgress}>
                  {DOSSIER.publishedCount}/{DOSSIER.totalCount}
                </span>
                <div className={s.progressBar}>
                  <div
                    className={s.progressFill}
                    style={{ width: `${progress}%`, background: dossierU.color }}
                  />
                </div>
              </div>
              <span className={s.dossierCta}>
                Lire le dossier
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </a>

            <a href={VIDEO.href} className={s.videoBlock}>
              <div
                className={s.videoThumb}
                style={{ backgroundImage: `url('${VIDEO.thumbnail}')` }}
              >
                <span className={s.videoPlay}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
                  </svg>
                </span>
                <span className={s.videoDuration}>{VIDEO.duration}</span>
              </div>
              <div className={s.videoInfo}>
                <span className={s.videoChannel}>{VIDEO.channel}</span>
                <h3 className={s.videoTitle}>{VIDEO.title}</h3>
              </div>
            </a>

            <a href={GUIDE.href} className={s.guideBlock}>
              <span className={s.guideLabel}>{GUIDE.label}</span>
              <h3 className={s.guideTitle}>{GUIDE.title}</h3>
              <p className={s.guideDesc}>{GUIDE.description}</p>
              <span className={s.guideCta}>
                {GUIDE.cta}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </span>
            </a>
          </div>

          {/* COL 3 — Articles secondaires */}
          <div className={s.rightCol}>
            <span className={s.rightLabel}>
              &Agrave; lire aussi
            </span>
            {secondary.map((article) => {
              const u = UNIVERS_MAP[article.univers];
              return (
                <a key={article.href} href={article.href} className={s.secCard}>
                  <div
                    className={s.secThumb}
                    style={{ backgroundImage: `url('${article.image}')` }}
                  />
                  <div className={s.secContent}>
                    <span className={s.secTag} style={{ color: u.color }}>
                      {article.category || u.name}
                    </span>
                    <h3 className={s.secTitle}>{article.title}</h3>
                    <p className={s.secExcerpt}>{article.excerpt}</p>
                    <span className={s.secMeta}>
                      {article.author} &middot; {article.readTime}
                    </span>
                  </div>
                </a>
              );
            })}
            <a href="/articles" className={s.rightCta}>
              Voir tous les articles
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
    </section>
  );
}
