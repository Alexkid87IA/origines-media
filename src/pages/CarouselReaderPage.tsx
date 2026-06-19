import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { PortableText } from "@portabletext/react";
import SEO from "@/components/SEO";
import Ticker from "@/components/Ticker/Ticker";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import Button from "@/components/ui/Button";
import { STATIC_CAROUSELS, type StaticCarousel } from "@/data/carousels";
import { sanityFetch } from "@/lib/sanity";
import { createPortableTextComponentsV2 } from "@/components/article/PortableTextComponentsV2";
import s from "./CarouselReaderPage.module.css";

type CompanionArticle = {
  _id: string;
  titre: string;
  deck?: string;
  readTime?: string;
  authorName?: string;
  contenu?: unknown[];
};

const COMPANION_QUERY = `
  *[_type == "production" && slug.current == $slug][0]{
    _id,
    titre,
    deck,
    readTime,
    "authorName": author->name,
    contenu
  }
`;

function RelatedCard({ carousel }: { carousel: StaticCarousel }) {
  return (
    <Link to={`/carousel/${carousel.slug}`} className={s.relatedCard}>
      <span className={s.relatedMedia}>
        <img
          src={carousel.cover}
          alt=""
          width={270}
          height={338}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className={s.relatedBody}>
        <span className={s.relatedMeta}>
          {carousel.brand === "petit-heros" ? "Le Petit Héros" : "Origines"} · {carousel.category}
        </span>
        <span className={s.relatedTitle}>{carousel.title}</span>
        <span className={s.relatedCta}>
          {carousel.slideCount} slides <ArrowRight aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

export default function CarouselReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const carousel = STATIC_CAROUSELS.find((c) => c.slug === slug);
  const [index, setIndex] = useState(0);
  const [companion, setCompanion] = useState<CompanionArticle | null>(null);
  const touchRef = useRef({ startX: 0, startY: 0 });

  const total = carousel?.slideCount ?? 0;

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    sanityFetch<CompanionArticle | null>(COMPANION_QUERY, { slug })
      .then((data) => {
        if (!cancelled) setCompanion(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setCompanion(null);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const companionComponents = useMemo(
    () => createPortableTextComponentsV2({ themeColor: "#0A0A0A" }),
    [],
  );

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((prev) => Math.max(0, Math.min(total - 1, prev + dir)));
    },
    [total],
  );

  useEffect(() => {
    setIndex(0);
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = e.changedTouches[0].clientY - touchRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      go(dx < 0 ? 1 : -1);
    }
  };

  if (!carousel) {
    return (
      <div className={s.notFound}>
        <h1>Carousel introuvable</h1>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  const slides = carousel.slides;

  const related = STATIC_CAROUSELS.filter((c) => c.slug !== carousel.slug)
    .sort((a, b) => {
      const scoreA = (a.brand === carousel.brand ? 2 : 0) + (a.category === carousel.category ? 1 : 0);
      const scoreB = (b.brand === carousel.brand ? 2 : 0) + (b.category === carousel.category ? 1 : 0);
      return scoreB - scoreA;
    })
    .slice(0, 4);

  const brandLabel = carousel.brand === "petit-heros" ? "Le Petit Héros" : "Origines";

  return (
    <>
      <SEO
        title={`${carousel.title} — ${brandLabel}`}
        description={carousel.deck}
        url={`/carousel/${carousel.slug}`}
        image={carousel.cover}
      />
      <Ticker />
      <SiteHeader />

      <main className={s.page}>
        {/* ── Slideshow hero ── */}
        <section className={s.slideshowSection}>
          <div className={s.slideshowHeader}>
            <span className={s.slideshowBrand}>{brandLabel}</span>
            <span className={s.slideshowCategory}>{carousel.category}</span>
            <span className={s.slideshowCounter}>
              {index + 1}<span> / {total}</span>
            </span>
          </div>

          <div
            className={s.viewport}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <img
              key={slides[index]}
              src={slides[index]}
              alt={`Slide ${index + 1} — ${carousel.title}`}
              className={s.slide}
              width={1080}
              height={1350}
              draggable={false}
            />

            <button
              type="button"
              className={`${s.navArrow} ${s.navPrev}`}
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label="Slide précédente"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className={`${s.navArrow} ${s.navNext}`}
              onClick={() => go(1)}
              disabled={index === total - 1}
              aria-label="Slide suivante"
            >
              <ChevronRight />
            </button>
          </div>

          <div className={s.progressTrack}>
            <div
              className={s.progressBar}
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </section>

        {/* ── Editorial section ── */}
        <section className={s.editorial}>
          <div className={s.editorialInner}>
            <div className={s.editorialMeta}>
              <span className={s.metaDot} />
              <span>{carousel.category}</span>
              <span className={s.metaSep}>·</span>
              <span>{carousel.slideCount} slides</span>
            </div>

            <h1 className={s.editorialTitle}>{carousel.title}</h1>
            <p className={s.editorialDeck}>{carousel.deck}</p>

            <div className={s.editorialActions}>
              <Button
                as="a"
                href={carousel.instagram}
                variant="cta"
                size="md"
                color="#0A0A0A"
                rightIcon={Instagram}
                withArrow={false}
              >
                Voir sur Instagram
              </Button>
              <Button as="link" to="/" variant="outline" size="md" color="#0A0A0A" withArrow>
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </section>

        {/* ── Companion article (Sanity) ── */}
        {companion && Array.isArray(companion.contenu) && companion.contenu.length > 0 && (
          <section className={s.companion}>
            <div className={s.companionInner}>
              <header className={s.companionHeader}>
                <span className={s.companionEyebrow}>L'article</span>
                <h2 className={s.companionTitle}>{companion.titre}</h2>
                {companion.deck && <p className={s.companionDeck}>{companion.deck}</p>}
                {(companion.authorName || companion.readTime) && (
                  <p className={s.companionMeta}>
                    {companion.authorName ? `Par ${companion.authorName}` : null}
                    {companion.authorName && companion.readTime ? " · " : null}
                    {companion.readTime}
                  </p>
                )}
              </header>
              <div className={s.companionBody}>
                <PortableText value={companion.contenu as any} components={companionComponents} />
              </div>
            </div>
          </section>
        )}

        {/* ── Related carousels ── */}
        {related.length > 0 && (
          <section className={s.relatedSection}>
            <div className={s.relatedInner}>
              <header className={s.relatedHeader}>
                <div>
                  <span className={s.relatedEyebrow}>À découvrir</span>
                  <h2 className={s.relatedHeading}>Autres carrousels</h2>
                </div>
                <Button as="link" to="/" variant="outline" size="sm" color="#0A0A0A" withArrow>
                  Tous les formats
                </Button>
              </header>
              <div className={s.relatedGrid}>
                {related.map((c) => (
                  <RelatedCard key={c.slug} carousel={c} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer2 />
    </>
  );
}
