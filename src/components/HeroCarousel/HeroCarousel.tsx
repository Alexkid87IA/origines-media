import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import { sanityImg } from "@/lib/sanityImage";
import { Card } from "@/components/ui/Card";
import s from "./HeroCarousel.module.css";

function frTypo(text: string): string {
  return text.replace(/ ([:;?!])/g, " $1");
}

export interface CMSArticle {
  univers: UniversId;
  category: string;
  subCategory?: string;
  meta?: string;
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

export interface CMSGuide {
  label: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export interface CMSProduit {
  label: string;
  title: string;
  description: string;
  price: string;
  mention: string;
  href: string;
  cta: string;
  image?: string;
}

interface HeroCarouselProps {
  cmsMain?: CMSArticle;
  cmsQuestion?: CMSQuestion;
  cmsVideo?: CMSHeroVideo;
  cmsReco?: CMSReco;
  cmsGuide?: CMSGuide;
  cmsProduit?: CMSProduit;
}

export default function HeroCarousel({
  cmsMain,
  cmsQuestion,
  cmsVideo,
  cmsGuide,
  cmsProduit,
}: HeroCarouselProps) {
  // Tout vient du CMS. Si une donnée manque, le bloc concerné est masqué.
  if (!cmsMain || !cmsQuestion || !cmsVideo) return null;

  const main = cmsMain;
  const dossier = cmsQuestion;
  const video = cmsVideo;
  const mainU = UNIVERS_MAP[main.univers];
  const dossierU = UNIVERS_MAP[dossier.univers];
  const progress = dossier.totalCount > 0 ? (dossier.publishedCount / dossier.totalCount) * 100 : 0;

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
              src={sanityImg(video.thumbnail, 1200)}
              alt={video.title}
              className={s.mainColImg}
              fetchpriority="high"
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
                  {main.meta && (
                    <span className={s.mainMeta}>{main.meta}</span>
                  )}
                </div>
                <h3 className={s.articleTitle}>{frTypo(main.title)}</h3>
                <p className={s.articleDeck}>{main.excerpt}</p>
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
            {cmsGuide && (
              <a href={cmsGuide.href} className={s.guideBlock}>
                <div className={s.guideAccent} />
                <span className={s.guideLabel}>{cmsGuide.label}</span>
                <h3 className={s.guideTitle}>{frTypo(cmsGuide.title)}</h3>
                <p className={s.guideDesc}>{cmsGuide.description}</p>
                <span className={s.guideCta}>
                  {cmsGuide.cta}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            )}

            {/* Boutique (Boutique pillar) */}
            {cmsProduit && (
              <a href={cmsProduit.href} className={s.boutiqueBlock}>
                <span className={s.boutiqueLabel}>{cmsProduit.label}</span>
                <h3 className={s.boutiqueTitle}>{frTypo(cmsProduit.title)}</h3>
                <p className={s.boutiqueDesc}>{cmsProduit.description}</p>
                <div className={s.boutiquePrice}>
                  <span className={s.boutiquePriceTag}>{cmsProduit.price}</span>
                  {cmsProduit.mention && (
                    <span className={s.boutiquePriceSub}>{cmsProduit.mention}</span>
                  )}
                </div>
                <span className={s.boutiqueCta}>
                  {cmsProduit.cta}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            )}
          </div>
        </div>

        <div className={s.mobileHero} aria-label="À la une mobile">
          <Card href={video.href} variant="outlined" size="sm" className={s.mobileLead}>
            <div className={s.mobileLeadMedia}>
              <img
                src={sanityImg(video.thumbnail, 900)}
                alt={video.title}
                className={s.mobileLeadImg}
                fetchpriority="high"
                loading="eager"
                decoding="async"
              />
              <span className={s.mobileLeadShade} />
              <div className={s.mobileLeadTop}>
                <span>Origines vidéo</span>
                <span>{video.duration || "Vidéo"}</span>
              </div>
              <span className={s.mobilePlay} aria-hidden="true">
                <img src="/icons/play-button.webp" alt="" loading="lazy" />
              </span>
            </div>
            <div className={s.mobileLeadBody}>
              <span className={s.mobileEyebrow}>{video.channel}</span>
              <h2 className={s.mobileLeadTitle}>{frTypo(video.title)}</h2>
              <span className={s.mobileCta}>Regarder maintenant</span>
            </div>
          </Card>

          <div className={s.mobileStoryStack}>
            <Card href={dossier.href} variant="outlined" size="sm" className={s.mobileStoryCard}>
              <div className={s.mobileStoryCopy}>
                <div className={s.mobileStoryMeta}>
                  <span>Question</span>
                  <span>S.{dossier.week}</span>
                </div>
                <h3 className={s.mobileStoryTitle}>{frTypo(dossier.question)}</h3>
                <div className={s.mobileProgressRow}>
                  <span>{dossierU.name}</span>
                  <span>{dossier.publishedCount}/{dossier.totalCount}</span>
                </div>
              </div>
              <div className={s.mobileStoryThumb}>
                {dossier.image ? (
                  <img
                    src={sanityImg(dossier.image, 360)}
                    alt=""
                    className={s.mobileStoryImg}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className={s.mobileQuestionVisual} aria-hidden="true">
                    <span>S.{dossier.week}</span>
                    <span>{dossier.publishedCount}/{dossier.totalCount}</span>
                  </span>
                )}
              </div>
            </Card>

            <Card href={main.href} variant="outlined" size="sm" className={s.mobileStoryCard}>
              <div className={s.mobileStoryCopy}>
                <div className={s.mobileStoryMeta}>
                  <span>{main.category || mainU.name}</span>
                  <span>{main.readTime}</span>
                </div>
                <h3 className={s.mobileStoryTitle}>{frTypo(main.title)}</h3>
                <p className={s.mobileStoryDeck}>{main.excerpt}</p>
              </div>
              <div className={s.mobileStoryThumb}>
                <img
                  src={sanityImg(main.image, 360)}
                  alt=""
                  className={s.mobileStoryImg}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </Card>
          </div>

          {(cmsGuide || cmsProduit) && (
            <div className={s.mobileActionGrid}>
              {cmsGuide && (
                <Card href={cmsGuide.href} variant="outlined" size="sm" className={`${s.mobileActionCard} ${s.mobileGuideCard}`}>
                  <span className={s.mobileActionLabel}>{cmsGuide.label}</span>
                  <strong className={s.mobileActionTitle}>{frTypo(cmsGuide.title)}</strong>
                  <span className={s.mobileActionCta}>Commencer</span>
                </Card>
              )}
              {cmsProduit && (
                <Card href={cmsProduit.href} variant="outlined" size="sm" className={`${s.mobileActionCard} ${s.mobileShopCard}`}>
                  <span className={s.mobileActionLabel}>{cmsProduit.label}</span>
                  <strong className={s.mobileActionTitle}>{frTypo(cmsProduit.title)}</strong>
                  <span className={s.mobileActionCta}>{cmsProduit.cta}</span>
                </Card>
              )}
            </div>
          )}
        </div>
    </section>
  );
}
