import { useEffect } from "react";
import SEO from "@/components/SEO";
import Ticker from "@/components/Ticker/Ticker";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import MediaHero from "@/components/MediaHero/MediaHero";
import type { Slide } from "@/components/MediaHero/MediaHero";
import Feed from "@/components/Feed/Feed";
import type { CMSFeedItem } from "@/components/Feed/Feed";
import ExploreTopics from "@/components/ExploreTopics/ExploreTopics";
import VideoCta from "@/components/VideoCta/VideoCta";
import { Interlude1, Interlude2, Interlude3, Interlude4 } from "@/components/Interludes/Interludes";
import GuidesCta from "@/components/GuidesCta/GuidesCta";
import MonHistoire from "@/components/MonHistoire/MonHistoire";
import Recos from "@/components/Recos/Recos";
import Marquee from "@/components/Marquee/Marquee";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { useSanityQuery } from "@/hooks/useSanityQuery";
import { MEDIA_HERO_SLIDES_QUERY, V2_FEED_QUERY, V2_RECOS_QUERY } from "@/lib/queries";
import { UNIVERS_MAP, type UniversId, verticaleToUnivers, getUniversColor, getUniversDark } from "@/data/univers";
import { smartExcerpt } from "@/lib/typography";

interface SanityFeedArticle {
  _id: string;
  titre: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  typeArticle?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
  tempsLecture?: number;
  videoUrl?: string;
  duree?: string;
  univpilar?: string;
  category?: string;
  soustopic?: string;
  vues?: number;
  verticaleSlug?: string;
  verticaleNom?: string;
  authorName?: string;
}

interface SanityReco {
  _id: string;
  titre: string;
  type?: string;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  imageUrl?: string;
  slug: string;
}

interface SanitySlide {
  _id: string;
  titre: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  category?: string;
  typeArticle?: string;
  imageUrl?: string;
  slug?: string;
  tempsLecture?: number;
  univpilar?: string;
  verticaleSlug?: string;
  verticaleNom?: string;
  authorName?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  comprendre: "Comprendre",
  reflexions: "Réflexion",
  temoignages: "Témoignage",
  portraits: "Portrait",
  "le-divan": "Le Divan",
  "le-signal": "Le Signal",
  "la-lettre": "La Lettre",
  "le-carnet": "Le Carnet",
  "le-virage": "Le Virage",
};

function sanityToSlide(a: SanitySlide, index: number): Slide {
  const univers: UniversId =
    a.univpilar && a.univpilar in UNIVERS_MAP
      ? (a.univpilar as UniversId)
      : verticaleToUnivers(a.verticaleSlug || a.verticaleNom || "");

  const catLabel = a.category ? CATEGORY_LABELS[a.category] || a.category : "";
  const meta = catLabel
    ? `${catLabel} · N°${String(index + 1).padStart(2, "0")}`
    : `Article · N°${String(index + 1).padStart(2, "0")}`;

  let deck = a.extrait || a.description || "";
  if (!deck && a.contenuTexte) {
    deck = smartExcerpt(a.contenuTexte, 200);
  }

  return {
    univers,
    meta,
    title: a.titre,
    deck,
    author: a.authorName || "Rédaction Origines",
    readTime: a.tempsLecture ? `Lecture ${a.tempsLecture} min` : "Lecture 5 min",
    href: `/article/${a.slug || ""}`,
    caption: a.authorName ? `Par ${a.authorName} pour Origines` : "Rédaction Origines",
    image: a.imageUrl || "/placeholder.svg",
    coverFocusX: 50,
    coverFocusY: 40,
    coverZoom: 115,
  };
}

function formatTimeLabel(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

function resolveUnivers(a: SanityFeedArticle): UniversId {
  if (a.univpilar && a.univpilar in UNIVERS_MAP) return a.univpilar as UniversId;
  if (a.verticaleSlug) return verticaleToUnivers(a.verticaleSlug);
  if (a.verticaleNom) return verticaleToUnivers(a.verticaleNom);
  return "esprit";
}

function sanityToFeedItem(a: SanityFeedArticle, idx: number): CMSFeedItem {
  const univers = resolveUnivers(a);
  const color = getUniversColor(univers);
  const dark = getUniversDark(univers);
  const isVideo = a.typeArticle === "video";
  const typeLabel = isVideo ? "Vidéo" : a.typeArticle ? a.typeArticle.charAt(0).toUpperCase() + a.typeArticle.slice(1) : "Article";
  const vertLabel = a.verticaleNom || "";
  const excerpt = a.extrait || a.description || a.contenuTexte || "";
  const title = a.titre || "";
  const spaceIdx = title.indexOf(" ", Math.floor(title.length * 0.4));
  const splitAt = spaceIdx > 0 ? spaceIdx : Math.floor(title.length * 0.4);

  return {
    id: idx + 1,
    univers,
    category: a.category || "",
    soustopic: a.soustopic || "",
    date: a.datePublication || new Date().toISOString(),
    popularity: a.vues || 0,
    title,
    href: isVideo ? `/video/${a.slug}` : `/article/${a.slug}`,
    imgSrc: a.imageUrl || "/covers/cover-01.jpg",
    imgAlt: title,
    timeLabel: formatTimeLabel(a.datePublication),
    format: vertLabel ? `${typeLabel} · ${vertLabel}` : typeLabel,
    headline: title.slice(0, splitAt) + " ",
    headlineEm: title.slice(splitAt).split(/[.!?]/)[0],
    headlineSuffix: ".",
    excerpt: smartExcerpt(excerpt, 200),
    author: a.authorName || "Origines",
    readTime: isVideo ? (a.duree || "Vidéo") : (a.tempsLecture ? `${a.tempsLecture} min` : ""),
    isVideo,
    schemaType: isVideo ? "VideoObject" : "Article",
    catColor: color,
    catDark: dark,
  };
}

const RECO_COLORS: Record<string, string> = {
  livre: "#7B5CD6", film: "#E67839", musique: "#2E94B5",
  podcast: "#D64C90", serie: "#5A66D6", documentaire: "#2E9B74",
};

function sanityToReco(r: SanityReco) {
  const color = RECO_COLORS[r.type || "livre"] || "#7B5CD6";
  const categoryLabel = r.type ? r.type.charAt(0).toUpperCase() + r.type.slice(1) : "Livre";
  return {
    href: `/recommandation/${r.slug}`,
    img: r.imageUrl || "/recos/reco_livre.png",
    category: categoryLabel,
    categoryColor: color,
    title: r.titre || "",
    titleEm: "",
    excerpt: r.accroche || "",
    reviewer: r.auteur ? `Choisi par ${r.auteur}` : "La rédaction",
    meta: r.coupDeCoeur ? "★ Coup de cœur" : "",
  };
}

export default function MediaPage() {
  const { data: rawSlidesData } = useSanityQuery<{ curated: SanitySlide[] | null; fallback: SanitySlide[] }>("media-hero-slides", MEDIA_HERO_SLIDES_QUERY);
  const rawSlides = rawSlidesData?.curated?.length ? rawSlidesData.curated : rawSlidesData?.fallback;
  const cmsSlides = rawSlides && rawSlides.length > 0
    ? rawSlides.map(sanityToSlide)
    : undefined;

  const { data: rawFeed } = useSanityQuery<SanityFeedArticle[]>("media-feed", V2_FEED_QUERY);
  const cmsFeed = rawFeed && rawFeed.length > 0
    ? rawFeed.map(sanityToFeedItem)
    : undefined;

  const { data: rawRecos } = useSanityQuery<SanityReco[]>("media-recos", V2_RECOS_QUERY);
  const cmsRecos = rawRecos && rawRecos.length > 0
    ? rawRecos.map(sanityToReco)
    : undefined;

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
        title="Média"
        description="Articles, récits, immersions et témoignages. Explorez les cinq univers d'Origines Media : Esprit, Corps, Liens, Culture et Futur."
        url="/media"
      />
      <Ticker />
      <SiteHeader />
      <main id="main" role="main">
        <div className="v2-container">
          <MediaHero cmsSlides={cmsSlides} />
          <Interlude2 />
          <Interlude3 />
          <Feed cmsItems={cmsFeed} />
          <ExploreTopics />
          <VideoCta />
          <Interlude1 />
          <GuidesCta />
          <Interlude4 />
          <MonHistoire />
          <Recos cmsRecos={cmsRecos} />
          <Marquee />
        </div>
      </main>
      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
