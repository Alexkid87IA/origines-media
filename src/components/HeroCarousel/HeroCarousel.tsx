import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import { sanityImg } from "@/lib/sanityImage";
import s from "./HeroCarousel.module.css";

function frTypo(text: string): string {
  return text.replace(/ ([:;?!])/g, " $1");
}

export interface CMSArticle {
  univers: UniversId;
  category: string;
  subCategory?: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  href: string;
  image: string;
}

export interface CMSQuestion {
  question: string;
  week: number;
  slug: string;
  univers: UniversId;
  publishedCount: number;
  totalCount: number;
  href: string;
  image?: string;
}

export interface CMSHeroVideo {
  title: string;
  duration: string;
  thumbnail: string;
  href: string;
  channel: string;
}

export interface CMSReco {
  title: string;
  type: string;
  author: string;
  href: string;
  image: string;
}

interface HeroCarouselProps {
  cmsMain?: CMSArticle;
  cmsQuestion?: CMSQuestion;
  cmsVideo?: CMSHeroVideo;
  cmsReco?: CMSReco;
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
  image: "/covers/cover-01.webp",
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
  image: "/covers/cover-02.webp",
};

const VIDEO = {
  title: "Ce que personne ne dit sur la fatigue chronique.",
  duration: "18:42",
  thumbnail: "/covers/cover-03.webp",
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

export default function HeroCarousel({ cmsMain, cmsQuestion, cmsVideo }: HeroCarouselProps) {
  const main = cmsMain
    ? { ...MAIN_ARTICLE, univers: cmsMain.univers, category: cmsMain.category, title: cmsMain.title, deck: cmsMain.excerpt, author: cmsMain.author, readTime: cmsMain.readTime, href: cmsMain.href, image: cmsMain.image }
    : MAIN_ARTICLE;
  const dossier = cmsQuestion || DOSSIER;
  const video = cmsVideo || VIDEO;
  const mainU = UNIVERS_MAP[main.univers];
  const dossierU = UNIVERS_MAP[dossier.univers];
  const progress = (dossier.publishedCount / dossier.totalCount) * 100;

  return (
    <section className={s.hero}>
        <div className={`${s.chapterMark} mono`}>
          <span className={s.cNum}>Ch.01</span>
          <span className={s.cSep}>/</span>
          <span className={s.cLabel}>&Agrave; la une</span>
        </div>

        <div className={s.heroGrid}>
          {/* COL 1 — Vidéo (immersive, pleine hauteur) */}
          <a
            href={video.href}
            className={s.mainCol}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className={s.mainColImg}
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
            <span className={s.mainGradient} />
            <span className={s.videoPlayLarge} aria-label="Lire la vidéo">
              <img src="/icons/play-button.webp" alt="" aria-hidden="true" loading="lazy" />
            </span>
            <div className={s.mainContent}>
              <div className={s.mainKicker}>
                <span className={s.mainMeta}>{video.channel}</span>
              </div>
              <h2 className={s.mainTitle}>{frTypo(video.title)}</h2>
              <div className={s.mainByline}>
                {video.duration}
              </div>
            </div>
          </a>

          {/* COL 2 — Question (haut) + Article à la une (bas) */}
          <div className={s.centerCol}>
            <a
              href={dossier.href}
              className={s.questionBlock}
              style={dossier.image ? { backgroundImage: `url('${sanityImg(dossier.image, 600)}')` } : undefined}
            >
              <span className={s.questionOverlay} />
              <div className={s.questionContent}>
                <div className={s.questionHead}>
                  <span className={s.questionLabel}>La question de la semaine</span>
                  <span className={s.questionWeek}>S.{dossier.week}</span>
                </div>
                <h3 className={s.questionTitle}>{frTypo(dossier.question)}</h3>
                <div className={s.questionFoot}>
                  <span className={s.questionUnivers}>
                    {dossierU.name}
                  </span>
                  <span className={s.questionProgress}>
                    {dossier.publishedCount}/{dossier.totalCount}
                  </span>
                  <div className={s.progressBar}>
                    <div
                      className={s.progressFill}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className={s.questionCta}>
                  Lire le dossier
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>

            <a
              href={main.href}
              className={s.articleBlock}
              style={{ backgroundImage: `url('${sanityImg(main.image, 800)}')` }}
            >
              <span className={s.articleOverlay} />
              <div className={s.articleInfo}>
                <div className={s.mainKicker}>
                  <span className={s.mainTag}>
                    {main.category || mainU.name}
                  </span>
                  {main.subCategory && (
                    <span className={s.mainMeta}>{main.subCategory}</span>
                  )}
                  <span className={s.mainMeta}>{main.meta}</span>
                </div>
                <h3 className={s.articleTitle}>{frTypo(main.title)}</h3>
                <p className={s.articleDeck}>{main.deck}</p>
                <div className={s.mainByline}>
                  Par <strong>{main.author}</strong>
                  <span className={s.dot} />
                  {main.readTime}
                </div>
              </div>
            </a>
          </div>

          {/* COL 3 — Guide + Boutique */}
          <div className={s.rightCol}>
            {/* Guide (Guides pillar) */}
            <a href={GUIDE.href} className={s.guideBlock}>
              <div className={s.guideAccent} />
              <span className={s.guideLabel}>{GUIDE.label}</span>
              <h3 className={s.guideTitle}>{frTypo(GUIDE.title)}</h3>
              <p className={s.guideDesc}>{GUIDE.description}</p>
              <span className={s.guideCta}>
                {GUIDE.cta}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </a>

            {/* Boutique (Boutique pillar) */}
            <a href="/boutique" className={s.boutiqueBlock}>
              <span className={s.boutiqueLabel}>Boutique</span>
              <h3 className={s.boutiqueTitle}>Coffret Nouveau D&eacute;part</h3>
              <p className={s.boutiqueDesc}>
                Carnet, guide illustr&eacute; et exercices &mdash;
                tout pour red&eacute;marrer avec intention.
              </p>
              <div className={s.boutiquePrice}>
                <span className={s.boutiquePriceTag}>39&nbsp;&euro;</span>
                <span className={s.boutiquePriceSub}>&Eacute;dition limit&eacute;e</span>
              </div>
              <span className={s.boutiqueCta}>
                D&eacute;couvrir
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          </div>
        </div>
    </section>
  );
}
