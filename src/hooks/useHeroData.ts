import { useSanityQuery } from "@/hooks/useSanityQuery";
import {
  V2_HERO_MAIN_QUERY,
  V2_QUESTION_QUERY,
  V2_HERO_VIDEO_QUERY,
} from "@/lib/queries";
import { verticaleToUnivers, UNIVERS_MAP, type UniversId } from "@/data/univers";
import { smartExcerpt } from "@/lib/typography";
import type { CMSArticle, CMSQuestion, CMSHeroVideo } from "@/components/HeroCarousel/HeroCarousel";

interface SanityArticle {
  _id: string;
  titre: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  typeArticle?: string;
  category?: string;
  imageUrl?: string;
  slug?: string;
  datePublication?: string;
  tempsLecture?: number;
  verticaleSlug?: string;
  verticaleNom?: string;
  authorName?: string;
  duree?: string;
  univpilar?: string;
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

function getExcerpt(a: SanityArticle): string {
  if (a.extrait) return a.extrait;
  if (a.description) return a.description;
  if (a.contenuTexte) {
    return smartExcerpt(a.contenuTexte, 200);
  }
  return "";
}

function mapToUnivers(a: SanityArticle): UniversId {
  if (a.univpilar && a.univpilar in UNIVERS_MAP) return a.univpilar as UniversId;
  return verticaleToUnivers(a.verticaleSlug || a.verticaleNom || "");
}

function formatReadTime(a: SanityArticle): string {
  if (a.tempsLecture) return `${a.tempsLecture} min`;
  if (a.duree) return a.duree;
  return "5 min";
}

const CATEGORY_LABELS: Record<string, string> = {
  comprendre: "Comprendre",
  reflexions: "Réflexions",
  temoignages: "Témoignages",
  guides: "Guides",
  portraits: "Portraits",
  "le-divan": "Le Divan",
  "le-signal": "Le Signal",
  "la-lettre": "La Lettre",
  "le-carnet": "Le Carnet",
  "le-virage": "Le Virage",
  reportages: "Reportages",
  documentaires: "Documentaires",
  interviews: "Interviews",
  shorts: "Shorts",
  live: "Live",
  formats: "Nos formats",
  masterclass: "Masterclass",
  ateliers: "Ateliers",
  programmes: "Programmes",
  "kits-gratuits": "Kits gratuits",
};

function toCMSArticle(a: SanityArticle): CMSArticle {
  const univers = mapToUnivers(a);
  return {
    univers,
    category: UNIVERS_MAP[univers].name,
    subCategory: a.category ? CATEGORY_LABELS[a.category] || a.category : undefined,
    title: a.titre,
    excerpt: getExcerpt(a),
    author: a.authorName || "Rédaction Origines",
    readTime: formatReadTime(a),
    href: `/article/${a.slug || ""}`,
    image: a.imageUrl || "/placeholder.svg",
  };
}

export function useHeroData() {
  const { data: heroVideoRaw } = useSanityQuery<{
    titre: string; slug: string; videoUrl: string; duree: number;
    category: string; imageUrl: string; verticaleNom: string;
  }>("v2-hero-video", V2_HERO_VIDEO_QUERY);

  const { data: mainRaw } = useSanityQuery<SanityArticle>("v2-hero-main", V2_HERO_MAIN_QUERY);
  const { data: questionRaw } = useSanityQuery<SanityQuestion>("v2-question", V2_QUESTION_QUERY);

  const mainArticle = mainRaw ? toCMSArticle(mainRaw) : undefined;

  const cmsQuestion: CMSQuestion | undefined = questionRaw?.question
    ? {
        question: questionRaw.question,
        week: questionRaw.semaine,
        slug: questionRaw.slug || "",
        univers: (questionRaw.univpilar || "esprit") as UniversId,
        publishedCount: questionRaw.articles?.length || 0,
        totalCount: questionRaw.articles?.length || 7,
        href: `/dossiers/${questionRaw.slug || ""}`,
        image: questionRaw.imageUrl,
      }
    : undefined;

  const cmsHeroVideo: CMSHeroVideo | undefined = (() => {
    if (!heroVideoRaw) return undefined;
    const pick = heroVideoRaw;
    const ytMatch = pick.videoUrl?.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    const ytId = ytMatch?.[1];
    const thumbnail = pick.imageUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "");
    const catLabel =
      pick.category === "reportages" ? "Reportage" :
      pick.category === "interviews" ? "Interview" :
      pick.category === "documentaires" ? "Documentaire" : "Vidéo";
    return {
      title: pick.titre,
      duration: pick.duree ? `${pick.duree} min` : "",
      thumbnail,
      href: `/video/${pick.slug || ""}`,
      channel: `Origines · ${catLabel}`,
    };
  })();

  return { mainArticle, cmsQuestion, cmsHeroVideo };
}
