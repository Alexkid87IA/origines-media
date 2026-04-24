import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import IntroOverlay from "@/components/IntroOverlay/IntroOverlay";
import Ticker from "@/components/Ticker/Ticker";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";
import { Interlude1, Interlude2, Interlude3, Interlude4 } from "@/components/Interludes/Interludes";
import Spotlight from "@/components/Spotlight/Spotlight";
import Feed from "@/components/Feed/Feed";
import Triad from "@/components/Triad/Triad";
import VideoChannel from "@/components/VideoChannel/VideoChannel";
import Immersions from "@/components/Immersions/Immersions";
import Voix from "@/components/Voix/Voix";
import Recos from "@/components/Recos/Recos";
import Shop from "@/components/Shop/Shop";
import Marquee from "@/components/Marquee/Marquee";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { useSanityQuery } from "@/hooks/useSanityQuery";
import {
  V2_HERO_MAIN_QUERY,
  V2_HERO_SECONDARY_QUERY,
  V2_QUESTION_QUERY,
  V2_SPOTLIGHT_QUERY,
  V2_FEED_QUERY,
  V2_EDITORIAL_QUERY,
  V2_TRIAD_QUERY,
  V2_VIDEOS_QUERY,
  V2_IMMERSIONS_QUERY,
  V2_VOIX_QUERY,
  V2_RECOS_QUERY,
} from "@/lib/queries";
import { verticaleToUnivers, UNIVERS_MAP, type UniversId } from "@/data/univers";
import type { CMSArticle, CMSQuestion } from "@/components/HeroCarousel/HeroCarousel";
import type { CMSSpotlight, CMSEditorial } from "@/components/Spotlight/Spotlight";
import type { CMSFeedItem } from "@/components/Feed/Feed";
import type { CMSTriadUnivers } from "@/components/Triad/Triad";
import type { CMSVideo } from "@/components/VideoChannel/VideoChannel";
import type { CMSImmersion } from "@/components/Immersions/Immersions";
import type { CMSStory } from "@/components/Voix/Voix";
import type { CMSReco } from "@/components/Recos/Recos";

interface SanityArticle {
  _id: string;
  titre: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  typeArticle?: string;
  imageUrl?: string;
  slug?: string;
  datePublication?: string;
  tempsLecture?: number;
  verticaleSlug?: string;
  verticaleNom?: string;
  authorName?: string;
  videoUrl?: string;
  duree?: string;
  vues?: number;
}

interface SanityTriadVerticale {
  _id: string;
  nom: string;
  slug: string;
  articles: { _id: string; titre: string; imageUrl?: string; slug?: string; verticaleSlug?: string; verticaleNom?: string }[];
}

interface SanityPortrait {
  _id: string;
  titre: string;
  categorie?: string;
  accroche?: string;
  citation?: string;
  imageUrl?: string;
  slug?: string;
  datePublication?: string;
  verticaleNom?: string;
  articleSlug?: string;
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
  slug?: string;
  datePublication?: string;
}

interface SanityQuestion {
  question: string;
  semaine: number;
  annee: number;
  univpilar?: string;
  slug?: string;
  imageUrl?: string;
  articles?: Array<{
    titre: string;
    slug?: string;
    univpilar?: string;
    deck?: string;
    readTime?: number;
    imageUrl?: string;
  }>;
}

const RECO_TYPE_COLORS: Record<string, string> = {
  livre: "#D64C90",
  film: "#7B5CD6",
  serie: "#7B5CD6",
  musique: "#5A66D6",
  podcast: "#2E94B5",
  youtube: "#E67839",
  destination: "#2E9B74",
  activite: "#5AA352",
  culture: "#C99B1E",
  produit: "#3E7DD6",
  social: "#1EA0A3",
};

function getExcerpt(a: SanityArticle): string {
  if (a.extrait) return a.extrait;
  if (a.description) return a.description;
  if (a.contenuTexte) {
    const t = a.contenuTexte.substring(0, 180);
    return t.length === 180 ? t + "…" : t;
  }
  return "";
}

function mapToUnivers(a: SanityArticle): UniversId {
  return verticaleToUnivers(a.verticaleSlug || a.verticaleNom || "");
}

function formatReadTime(a: SanityArticle): string {
  if (a.tempsLecture) return `${a.tempsLecture} min`;
  if (a.duree) return a.duree;
  return "5 min";
}

function toCMSArticle(a: SanityArticle): CMSArticle {
  const univers = mapToUnivers(a);
  return {
    univers,
    category: a.verticaleNom || UNIVERS_MAP[univers].name,
    title: a.titre,
    excerpt: getExcerpt(a),
    author: a.authorName || "Rédaction Origines",
    readTime: formatReadTime(a),
    href: `/article/${a.slug || ""}`,
    image: a.imageUrl || "/placeholder.svg",
  };
}

function diversifyByVerticale(articles: SanityArticle[], count: number): SanityArticle[] {
  const picked: SanityArticle[] = [];
  const seen = new Set<string>();
  for (const a of articles) {
    const key = a.verticaleSlug || a.verticaleNom || "";
    if (!seen.has(key)) {
      picked.push(a);
      seen.add(key);
      if (picked.length >= count) return picked;
    }
  }
  for (const a of articles) {
    if (!picked.includes(a)) {
      picked.push(a);
      if (picked.length >= count) return picked;
    }
  }
  return picked;
}

function toCMSSpotlight(a: SanityArticle): CMSSpotlight {
  const univers = mapToUnivers(a);
  return {
    univers,
    category: a.verticaleNom || UNIVERS_MAP[univers].name,
    title: a.titre,
    deck: getExcerpt(a),
    author: a.authorName || "Rédaction Origines",
    readTime: formatReadTime(a),
    href: `/article/${a.slug || ""}`,
    image: a.imageUrl || "/placeholder.svg",
  };
}

function toCMSEditorial(a: SanityArticle): CMSEditorial {
  const univers = mapToUnivers(a);
  return {
    univers,
    category: a.verticaleNom || UNIVERS_MAP[univers].name,
    title: a.titre,
    excerpt: getExcerpt(a),
    author: a.authorName || "Rédaction Origines",
    readTime: formatReadTime(a),
    href: `/article/${a.slug || ""}`,
    image: a.imageUrl || "/placeholder.svg",
  };
}

function timeAgo(date: string): string {
  const now = Date.now();
  const d = new Date(date).getTime();
  const mins = Math.floor((now - d) / 60000);
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

function toCMSFeedItem(a: SanityArticle, idx: number): CMSFeedItem {
  const univers = mapToUnivers(a);
  const u = UNIVERS_MAP[univers];
  const isVideo = a.typeArticle === "video";
  const categoryLabel = a.verticaleNom || u.name;
  const format = isVideo
    ? `Vidéo · ${categoryLabel}`
    : `Article · ${categoryLabel}`;

  return {
    id: idx + 1,
    univers,
    date: a.datePublication || new Date().toISOString(),
    popularity: a.vues || 0,
    title: a.titre,
    href: isVideo ? `/video/${a.slug}` : `/article/${a.slug}`,
    imgSrc: a.imageUrl || "/placeholder.svg",
    imgAlt: a.titre,
    timeLabel: a.datePublication ? timeAgo(a.datePublication) : "",
    format,
    headline: "",
    headlineEm: a.titre,
    headlineSuffix: ".",
    excerpt: getExcerpt(a),
    author: a.authorName || "Rédaction Origines",
    readTime: formatReadTime(a),
    isVideo,
    catColor: u.color,
    catDark: u.dark,
  };
}

function toTriadUnivers(verticals: SanityTriadVerticale[]): CMSTriadUnivers[] {
  const byUnivers = new Map<UniversId, CMSTriadUnivers>();
  for (const v of verticals) {
    const uid = verticaleToUnivers(v.slug || v.nom || "");
    const existing = byUnivers.get(uid);
    const mapped = v.articles.map((a) => ({
      univers: uid,
      title: a.titre,
      href: `/article/${a.slug || ""}`,
      imgSrc: a.imageUrl || "/placeholder.svg",
      imgAlt: a.titre,
    }));
    if (existing) {
      existing.articles.push(...mapped);
    } else {
      byUnivers.set(uid, { id: uid, articles: mapped });
    }
  }
  return Array.from(byUnivers.values());
}

function toCMSVideo(a: SanityArticle): CMSVideo {
  return {
    href: `/video/${a.slug || ""}`,
    title: a.titre,
    duration: a.duree || "",
    thumb: a.imageUrl || "/placeholder.svg",
  };
}

function toCMSImmersion(a: SanityArticle): CMSImmersion {
  const univers = mapToUnivers(a);
  return {
    href: `/article/${a.slug || ""}`,
    cover: a.imageUrl || "/placeholder.svg",
    category: a.verticaleNom || UNIVERS_MAP[univers].name,
    readTime: formatReadTime(a),
    headline: "",
    headlineEm: a.titre,
    description: getExcerpt(a),
    author: a.authorName || "Rédaction Origines",
  };
}

function toCMSStory(p: SanityPortrait): CMSStory {
  const excerpt = p.citation || p.accroche || p.titre;
  const emIdx = excerpt.length > 20 ? excerpt.lastIndexOf(" ", excerpt.length - 10) : -1;
  return {
    href: p.articleSlug ? `/article/${p.articleSlug}` : `/histoire/${p.slug || ""}`,
    img: p.imageUrl || "/placeholder.svg",
    quote: emIdx > 0 ? excerpt.substring(0, emIdx + 1) : "",
    quoteEm: emIdx > 0 ? excerpt.substring(emIdx + 1) : excerpt,
    author: p.titre,
    category: p.categorie || p.verticaleNom || "",
    readTime: "10 min",
    date: p.datePublication ? timeAgo(p.datePublication) : "",
    datetime: p.datePublication || "",
  };
}

function toCMSReco(r: SanityReco): CMSReco {
  const typeKey = (r.type || "livre").toLowerCase();
  const titleParts = r.titre.split(",");
  return {
    href: `/recommandations/${r.slug || ""}`,
    img: r.imageUrl || "/placeholder.svg",
    category: r.type || "Livre",
    categoryColor: RECO_TYPE_COLORS[typeKey] || "#7B5CD6",
    title: titleParts.length > 1 ? titleParts[0] + ", " : r.titre + " ",
    titleEm: titleParts.length > 1 ? titleParts.slice(1).join(",").trim() : "",
    excerpt: r.accroche || "",
    reviewer: r.auteur || "La rédaction",
    meta: r.datePublication ? timeAgo(r.datePublication) : "",
    isCoupDeCoeur: r.coupDeCoeur,
  };
}

export default function HomePageV2() {
  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  const { data: mainRaw } = useSanityQuery<SanityArticle>("v2-hero-main", V2_HERO_MAIN_QUERY);
  const { data: secRaw } = useSanityQuery<SanityArticle[]>("v2-hero-secondary", V2_HERO_SECONDARY_QUERY);
  const { data: questionRaw } = useSanityQuery<SanityQuestion>("v2-question", V2_QUESTION_QUERY);
  const { data: spotRaw } = useSanityQuery<SanityArticle>("v2-spotlight", V2_SPOTLIGHT_QUERY);
  const { data: editRaw } = useSanityQuery<SanityArticle[]>("v2-editorial", V2_EDITORIAL_QUERY);
  const { data: feedRaw } = useSanityQuery<SanityArticle[]>("v2-feed", V2_FEED_QUERY);
  const { data: triadRaw } = useSanityQuery<SanityTriadVerticale[]>("v2-triad", V2_TRIAD_QUERY);
  const { data: videosRaw } = useSanityQuery<SanityArticle[]>("v2-videos", V2_VIDEOS_QUERY);
  const { data: immRaw } = useSanityQuery<SanityArticle[]>("v2-immersions", V2_IMMERSIONS_QUERY);
  const { data: voixRaw } = useSanityQuery<SanityPortrait[]>("v2-voix", V2_VOIX_QUERY);
  const { data: recosRaw } = useSanityQuery<SanityReco[]>("v2-recos", V2_RECOS_QUERY);

  const mainArticle = mainRaw ? toCMSArticle(mainRaw) : undefined;
  const secondaryArticles = secRaw ? diversifyByVerticale(secRaw, 3).map(toCMSArticle) : undefined;
  const cmsQuestion: CMSQuestion | undefined = questionRaw?.question
    ? {
        question: questionRaw.question,
        week: questionRaw.semaine,
        slug: questionRaw.slug || "",
        univers: (questionRaw.univpilar || "esprit") as UniversId,
        publishedCount: questionRaw.articles?.length || 0,
        totalCount: questionRaw.articles?.length || 7,
        href: `/dossiers/${questionRaw.slug || ""}`,
      }
    : undefined;
  const spotlightPick = spotRaw ? toCMSSpotlight(spotRaw) : undefined;
  const editorialArticles = editRaw ? diversifyByVerticale(editRaw, 3).map(toCMSEditorial) : undefined;
  const feedItems = feedRaw?.map(toCMSFeedItem);
  const triadUnivers = triadRaw ? toTriadUnivers(triadRaw) : undefined;
  const cmsVideos = videosRaw?.map(toCMSVideo);
  const cmsImmersions = immRaw?.map(toCMSImmersion);
  const cmsStories = voixRaw?.map(toCMSStory);
  const cmsRecos = recosRaw?.map(toCMSReco);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Origines Media",
    url: "https://www.origines.media",
    description: "Origines Media explore ce qui nous construit : psychologie, bien-être, relations, culture et avenir.",
    publisher: {
      "@type": "Organization",
      name: "Origines Media",
      logo: { "@type": "ImageObject", url: "https://www.origines.media/logos/logo-black.png" },
      sameAs: [
        "https://www.youtube.com/@origines",
        "https://www.instagram.com/origines.media",
        "https://www.linkedin.com/company/origines-media",
      ],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://www.origines.media/recherche?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  };

  const navSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SiteNavigationElement", name: "Articles", url: "https://www.origines.media/articles", description: "Tous les articles : psychologie, santé, famille, voyage, carrière" },
      { "@type": "SiteNavigationElement", name: "Vidéos", url: "https://www.origines.media/videos", description: "Reportages, documentaires, interviews et formats vidéo" },
      { "@type": "SiteNavigationElement", name: "Histoires", url: "https://www.origines.media/histoires", description: "Témoignages et récits de vie authentiques" },
      { "@type": "SiteNavigationElement", name: "Recommandations", url: "https://www.origines.media/recommandations", description: "Livres, films, podcasts et découvertes de la rédaction" },
      { "@type": "SiteNavigationElement", name: "Newsletter", url: "https://www.origines.media/newsletter", description: "La Lettre du dimanche — le meilleur de la semaine" },
      { "@type": "SiteNavigationElement", name: "Boutique", url: "https://www.origines.media/boutique", description: "Guides, kits et produits Origines" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Origines Media — Psychologie, bien-être, relations, culture, avenir</title>
        <meta name="description" content="Origines Media explore ce qui nous construit : psychologie, bien-être, relations, culture et avenir. Articles, vidéos, histoires et recommandations pour ceux qui cherchent la profondeur." />
        <link rel="canonical" href="https://www.origines.media" />
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(navSchema)}</script>
      </Helmet>
      <IntroOverlay />
      <a href="#main" className="skip-to-content">
        Aller au contenu
      </a>
      <Ticker />
      <SiteHeader />
      <main id="main" role="main">
        <div className="v2-container">
          <HeroCarousel
            cmsMain={mainArticle}
            cmsSecondary={secondaryArticles}
            cmsQuestion={cmsQuestion}
          />
          <Interlude1 />
          <Spotlight
            cmsPick={spotlightPick}
            cmsEditorial={editorialArticles}
          />
          <Feed cmsItems={feedItems} />
          <Triad cmsUnivers={triadUnivers} />
          <Interlude2 />
          <VideoChannel cmsVideos={cmsVideos} />
          <Immersions cmsItems={cmsImmersions} />
          <Interlude3 />
          <Voix cmsStories={cmsStories} />
          <Interlude4 />
          <Recos cmsRecos={cmsRecos} />
          <Shop />
          <Marquee />
        </div>
      </main>
      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
