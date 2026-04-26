import { useEffect } from "react";
import SEO from "@/components/SEO";
import Ticker from "@/components/Ticker/Ticker";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import VideoChannel from "@/components/VideoChannel/VideoChannel";
import type { CMSProgramme } from "@/components/VideoChannel/VideoChannel";
import VideoCatalog from "@/components/VideoCatalog/VideoCatalog";
import Marquee from "@/components/Marquee/Marquee";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { useSanityQuery } from "@/hooks/useSanityQuery";
import { PROD_PROGRAMMES_QUERY } from "@/lib/queries";
import s from "./ProdPage.module.css";

/* ── Programme definitions ── */

interface SanityProgrammeVideo {
  _id: string;
  titre: string;
  imageUrl?: string;
  slug: string;
  duree?: string;
  videoUrl?: string;
}

interface ProgrammesResponse {
  "il-etait-une-fois": SanityProgrammeVideo[];
  "etat-d-esprit": SanityProgrammeVideo[];
  "transmission": SanityProgrammeVideo[];
  "secrets-pro": SanityProgrammeVideo[];
  "imagine": SanityProgrammeVideo[];
  "la-lettre": SanityProgrammeVideo[];
  counts: Record<string, number>;
}

const PROGRAMME_META: Record<string, { name: string; tagline: string; color: string }> = {
  "il-etait-une-fois": { name: "Il était une fois", tagline: "Grandes enquêtes et documentaires de fond.", color: "#8B7355" },
  "etat-d-esprit": { name: "État d'esprit", tagline: "Comprendre ce qui se joue en nous.", color: "#5B7BA5" },
  "transmission": { name: "Transmission", tagline: "Ce qu'on reçoit, ce qu'on transmet.", color: "#6B8E6B" },
  "secrets-pro": { name: "Secrets pro.", tagline: "Ceux qui font autrement racontent comment.", color: "#A07850" },
  "imagine": { name: "Imagine", tagline: "L'art comme manière de voir le monde.", color: "#9B6B8D" },
  "la-lettre": { name: "La lettre", tagline: "Écrire, lire, apprendre — autrement.", color: "#7A8B6B" },
};

const PROGRAMME_ORDER = ["il-etait-une-fois", "etat-d-esprit", "transmission", "secrets-pro", "imagine", "la-lettre"];

function extractDuration(videoUrl?: string, duree?: string): string {
  if (duree) return duree;
  return "";
}

function buildCMSProgrammes(data: ProgrammesResponse): CMSProgramme[] {
  return PROGRAMME_ORDER
    .map((id) => {
      const meta = PROGRAMME_META[id];
      const videos = (data[id as keyof ProgrammesResponse] as SanityProgrammeVideo[] | undefined) || [];
      const count = data.counts?.[id] || videos.length;
      if (videos.length === 0) return null;
      return {
        id,
        name: meta.name,
        tagline: meta.tagline,
        color: meta.color,
        videoCount: count,
        videos: videos.map((v) => ({
          href: `/video/${v.slug}`,
          title: v.titre,
          duration: extractDuration(v.videoUrl, v.duree),
          thumb: v.imageUrl || "/placeholder.svg",
        })),
      };
    })
    .filter((p): p is CMSProgramme => p !== null);
}

/* ── Page ── */

export default function ProdPage() {
  const { data: programmesData } = useSanityQuery<ProgrammesResponse>("prod-programmes", PROD_PROGRAMMES_QUERY);
  const cmsProgrammes = programmesData ? buildCMSProgrammes(programmesData) : undefined;
  const programmeCount = cmsProgrammes?.length ?? 6;
  const videoCount = cmsProgrammes?.reduce((sum, p) => sum + p.videoCount, 0) ?? 0;

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  return (
    <>
      <SEO
        title="Programmes"
        description="Découvrez les programmes originaux d'Origines Prod : enquêtes, documentaires, portraits et formats courts. 10 programmes, 106 vidéos, 5 univers."
        url="/programmes"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Programmes", url: "/programmes" },
        ]}
      />
      <Ticker />
      <SiteHeader />

      <main id="main" role="main">
        {/* ── Ch.01 — Hero ── */}
        <section className={s.hero} aria-labelledby="prod-hero-heading">
          <div className={s.heroBg}>
            <img
              src="/visages-origines.webp"
              alt="Les visages d'Origines"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className={s.heroOverlay} />

          <div className={s.heroContent}>
            <span className={s.heroKicker}>
              <span className={s.heroKickerDot} aria-hidden="true" />
              Origines &middot; Prod
            </span>
            <h1 id="prod-hero-heading" className={s.heroTitle}>
              Ce qu&rsquo;on a film&eacute; pour&nbsp;vous.
            </h1>
            <p className={s.heroSubtitle}>
              Enqu&ecirc;tes, documentaires, portraits et formats courts.
            </p>

            <div className={s.heroStats}>
              <span className={s.heroStat}>
                <span className={s.heroStatNum}>{programmeCount}</span>Programmes
              </span>
              <span className={s.heroStatSep} aria-hidden="true" />
              <span className={s.heroStat}>
                <span className={s.heroStatNum}>{videoCount}</span>Vid&eacute;os
              </span>
              <span className={s.heroStatSep} aria-hidden="true" />
              <span className={s.heroStat}>
                <span className={s.heroStatNum}>5</span>Univers
              </span>
            </div>

            <button
              type="button"
              className={s.heroCta}
              onClick={() => {
                document.getElementById("prod-programmes")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explorer la cha&icirc;ne
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </section>

        <div className="v2-container">
          {/* ── Ch.02 — Programmes ── */}
          <div id="prod-programmes" className={s.programmesSection}>
            <VideoChannel cmsProgrammes={cmsProgrammes} />
          </div>

          {/* ── Ch.03 — Catalogue vidéo ── */}
          <section className={s.catalogSection}>
            <div className={s.chapterMark}>
              <span className={s.cNum}>Ch.03</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Toutes les vid&eacute;os</span>
            </div>
            <VideoCatalog />
          </section>

          {/* ── Ch.04 — Manifeste ── */}
          <section className={s.manifeste} aria-labelledby="prod-manifeste-heading">
            <div className={s.manifesteLeft}>
              <div className={s.chapterMark}>
                <span className={s.cNum}>Ch.04</span>
                <span className={s.cSep}>/</span>
                <span className={s.cLabel}>&Agrave; propos</span>
              </div>

              <h2 id="prod-manifeste-heading" className={s.manifesteTitle}>
                Origines <em>Prod.</em>
              </h2>
              <p className={s.manifesteBody}>
                Origines Prod, c&rsquo;est la branche audiovisuelle d&rsquo;Origines Media.
                On y produit des enqu&ecirc;tes de fond, des documentaires intimistes,
                des portraits et des formats courts &mdash; toujours au service d&rsquo;une
                m&ecirc;me question&nbsp;: qu&rsquo;est-ce qui nous fa&ccedil;onne&thinsp;?
              </p>
              <p className={s.manifesteBody}>
                Nos programmes explorent cinq univers &mdash; l&rsquo;esprit, le corps,
                les liens, le monde et l&rsquo;avenir &mdash; avec une approche
                &eacute;ditoriale exigeante, ind&eacute;pendante et profond&eacute;ment humaine.
              </p>
              <p className={s.manifesteBody}>
                Chaque vid&eacute;o est pens&eacute;e pour durer. Pas de buzz, pas de
                format jetable. Des histoires qu&rsquo;on ne raconte pas ailleurs.
              </p>
            </div>

            <div className={s.manifesteCard}>
              <div className={s.manifesteCardAccent} aria-hidden="true" />
              <blockquote className={s.manifesteCardQuote}>
                &laquo;&thinsp;On ne fait pas de la vid&eacute;o pour remplir un feed.
                On filme parce que certaines histoires ne peuvent pas &ecirc;tre &eacute;crites
                &mdash; elles doivent &ecirc;tre montr&eacute;es.&thinsp;&raquo;
              </blockquote>
              <span className={s.manifesteCardAuthor}>La r&eacute;daction Origines</span>
            </div>
          </section>

          {/* ── Ch.05 — Newsletter ── */}
          <section className={s.newsletter} aria-labelledby="prod-newsletter-heading">
            <div className={s.chapterMark} style={{ borderTopColor: "rgba(247,245,240,0.1)", color: "rgba(247,245,240,0.4)" }}>
              <span className={s.cNum}>Ch.05</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Newsletter</span>
            </div>

            <p className={s.newsletterKicker}>Origines &middot; Prod</p>
            <h2 id="prod-newsletter-heading" className={s.newsletterTitle}>
              Recevez nos vid&eacute;os <em>chaque semaine.</em>
            </h2>
            <p className={s.newsletterDeck}>
              Les sorties, les coulisses, les recommandations de la r&eacute;dac.
              Un email, chaque vendredi.
            </p>
            <form className={s.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className={s.newsletterInput}
                placeholder="votre@email.com"
                aria-label="Adresse email"
                required
              />
              <button type="submit" className={s.newsletterBtn}>S&rsquo;inscrire</button>
            </form>
          </section>

          {/* ── Marquee ── */}
          <Marquee />
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
