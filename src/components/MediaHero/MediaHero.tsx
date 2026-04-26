import { useState, useEffect, useCallback, useRef } from "react";
import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import { sanityImg } from "@/lib/sanityImage";
import SaveBookmark from "@/components/SaveButton/SaveBookmark";
import s from "./MediaHero.module.css";

export interface Slide {
  univers: UniversId;
  meta: string;
  title: string;
  deck: string;
  author: string;
  readTime: string;
  href: string;
  caption: string;
  image: string;
  coverFocusX: number;
  coverFocusY: number;
  coverZoom: number;
}

interface MediaHeroProps {
  cmsSlides?: Slide[];
}

const SLIDES: Slide[] = [
  {
    univers: "esprit",
    meta: "Enquête · N°09",
    title: "Pourquoi on ne finit jamais rien.",
    deck: "Derrière ce qu'on appelle un manque de motivation se cache autre chose : un cerveau qui tourne trop vite, et une honte qu'on ne sait pas nommer.",
    author: "Émilie Roux",
    readTime: "Lecture 24 min",
    href: "/article/pourquoi-on-ne-finit-jamais-rien",
    caption: "Portrait · Émilie Roux pour Origines",
    image: "/covers/cover-01.webp",
    coverFocusX: 70,
    coverFocusY: 38,
    coverZoom: 115,
  },
  {
    univers: "monde",
    meta: "Récit · N°04",
    title: "2 200 kilomètres pour cesser d'avoir peur.",
    deck: "Trois mois sur la via Francigena, seul, avec une question en tête. On revient rarement d'une longue marche tel qu'on en est parti.",
    author: "Camille Dufresne",
    readTime: "Lecture 18 min",
    href: "/article/2200-kilometres",
    caption: "Photo · Camille Dufresne",
    image: "/covers/cover-02.webp",
    coverFocusX: 50,
    coverFocusY: 45,
    coverZoom: 115,
  },
  {
    univers: "corps",
    meta: "Enquête · N°07",
    title: "On dort mal. Et on ne sait plus depuis quand.",
    deck: "La moitié des Français se plaignent de leur sommeil. Les scientifiques cherchent pourquoi. Plongée dans une épidémie silencieuse.",
    author: "Léo Marchand",
    readTime: "Lecture 22 min",
    href: "/article/on-dort-mal",
    caption: "Illustration · Studio Origines",
    image: "/covers/cover-03.webp",
    coverFocusX: 55,
    coverFocusY: 40,
    coverZoom: 115,
  },
  {
    univers: "esprit",
    meta: "Portrait · N°09",
    title: "Trois jours de silence à l'abbaye de Cîteaux.",
    deck: "Ne rien dire pendant 72 heures, ça fait quoi exactement. Immersion chez ceux qui ont choisi le retrait comme une autre façon d'être présent.",
    author: "Camille Dufresne",
    readTime: "Lecture 14 min",
    href: "/article/silence-abbaye",
    caption: "Reportage · Abbaye de Cîteaux",
    image: "/covers/cover-04.webp",
    coverFocusX: 55,
    coverFocusY: 40,
    coverZoom: 115,
  },
  {
    univers: "liens",
    meta: "Récit · N°12",
    title: "Ma mère ne veut plus qu'on se voie.",
    deck: "La rupture entre parents et enfants adultes progresse en silence. Trois histoires, trois manières de l'accepter — ou pas.",
    author: "Mathilde Aubry",
    readTime: "Lecture 16 min",
    href: "/article/rupture-mere-fille",
    caption: "Portrait · Mathilde Aubry",
    image: "/covers/cover-05.webp",
    coverFocusX: 50,
    coverFocusY: 45,
    coverZoom: 115,
  },
];

function frTypo(text: string): string {
  return text.replace(/ ([;:!?])/g, " $1");
}

const AUTOPLAY_MS = 8000;

export default function MediaHero({ cmsSlides }: MediaHeroProps) {
  const slides = cmsSlides && cmsSlides.length > 0 ? cmsSlides : SLIDES;
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => {
    if (transitioning) return;
    const target = ((next % slides.length) + slides.length) % slides.length;
    if (target === current) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(target);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitioning(false));
      });
    }, 420);
  }, [current, transitioning]);

  const restartAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }, [current, goTo]);

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % slides.length;
        return next;
      });
    }, AUTOPLAY_MS);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, []);

  const slide = slides[current];
  const u = UNIVERS_MAP[slide.univers];

  return (
    <section className={s.hero}>
      <div className={s.watermark} aria-hidden="true">
        <span className={s.wmCircle} />
        <span className={s.wmDot} />
      </div>

      <div className={`${s.chapterMark} mono`}>
        <span className={s.cNum}>Ch.01</span>
        <span className={s.cSep}>/</span>
        <span className={s.cLabel}>Les unes du jour</span>
        <div className={s.slideNav}>
          <button
            className={s.slideBtn}
            onClick={() => { goTo(current - 1); restartAutoplay(); }}
            aria-label="Une précédente"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className={s.slideCounter}>
            <span className={s.slideNum}>{String(current + 1).padStart(2, "0")}</span>
            <span className={s.slideSlash}>/</span>
            <span className={s.slideTot}>{String(slides.length).padStart(2, "0")}</span>
          </span>
          <button
            className={s.slideBtn}
            onClick={() => { goTo(current + 1); restartAutoplay(); }}
            aria-label="Une suivante"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <span className={s.slideDots}>
            {slides.map((_, i) => (
              <span
                key={i}
                className={`${s.dot} ${i === current ? s.dotActive : ""}`}
                onClick={() => { goTo(i); restartAutoplay(); }}
              />
            ))}
          </span>
        </div>
      </div>

      <div className={`${s.heroGrid} ${transitioning ? s.isTransitioning : ""}`}>
        <div
          className={s.heroCover}
          style={{
            "--cover-focus-x": `${slide.coverFocusX}%`,
            "--cover-focus-y": `${slide.coverFocusY}%`,
          } as React.CSSProperties}
        >
          <img
            src={sanityImg(slide.image, 1200)}
            alt={slide.title}
            className={s.heroCoverImg}
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
          <span className={s.coverCaption}>{slide.caption}</span>
        </div>

        <div className={s.heroTitleBlock}>
          <div className={s.heroKicker}>
            <span className={s.catTag} style={{ background: u.color }}>{u.name}</span>
            <span className={s.dotSep} />
            <span className={s.meta}>{slide.meta}</span>
          </div>
          <h1 className={s.heroTitle} style={{ "--kicker-color": u.color } as React.CSSProperties}>
            {frTypo(slide.title)}
          </h1>
          <p className={s.heroDeck}>{slide.deck}</p>
          <div className={s.heroFooter}>
            <div className={s.heroByline}>
              <span>Par <strong>{slide.author}</strong></span>
              <span className={s.bylineDot} />
              <span>{slide.readTime}</span>
              <SaveBookmark
                inline
                type="article"
                slug={slide.href.split("/").pop() || ""}
                title={slide.title}
                image={slide.image}
              />
            </div>
            <a className={s.heroRead} href={slide.href}>
              Lire l'article
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
