import { UNIVERS_MAP, type UniversId } from "@/data/univers";
import type { Slide } from "@/components/MediaHero/MediaHero";
import { RT } from "@/lib/queries";

export interface HomeItem {
  _id: string;
  titre: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  extrait?: string;
  contenuTexte?: string;
  datePublication?: string;
  tempsLecture?: number;
  typeArticle?: string;
  rubrique?: string;
  category?: string;
  univpilar?: string;
  authorName?: string;
  duree?: string;
  videoUrl?: string;
  vues?: number;
}

export interface CarouselItem {
  _id: string;
  titre: string;
  deck?: string;
  imageUrl?: string;
  slug: string;
  univpilar?: string;
  category?: string;
  slideCount: number;
}

export interface HomeData {
  feed: HomeItem[];
  guides: HomeItem[];
  videos: HomeItem[];
  carousels?: CarouselItem[];
  heroSlides?: HomeItem[];
}

export const FALLBACK_DECK =
  "Un récit Origines pour comprendre ce qui nous traverse, ce qui nous relie et ce qui continue de nous transformer.";

export const HOME_DATA_QUERY = `
  {
    "heroSlides": coalesce(
      *[_id == "siteSettings"][0].unesDuJour[]-> {
        _id,
        titre,
        extrait,
        description,
        "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
        typeArticle,
        category,
        "imageUrl": coalesce(image.asset->url, mainImage.asset->url),
        "slug": slug.current,
        datePublication,
        ${RT},
        univpilar,
        "authorName": author->name
      },
      []
    ),
    "feed": *[_type == "production" && (defined(image.asset) || defined(imageUrl)) && rubrique != "guides" && !defined(carouselSlides) && !("carrousel" in tags)] | order(datePublication desc) [0...28] {
      _id,
      titre,
      extrait,
      description,
      "contenuTexte": array::join(contenu[_type == "block"][0...2].children[].text, " "),
      typeArticle,
      "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl, "/placeholder.svg"),
      "slug": slug.current,
      datePublication,
      ${RT},
      videoUrl,
      duree,
      univpilar,
      category,
      soustopic,
      "vues": coalesce(stats.views, views, vues, 0),
      "authorName": author->name
    },
    "guides": *[_type == "production" && rubrique == "guides" && defined(image.asset)] | order(datePublication desc) [0...6] {
      _id,
      titre,
      description,
      extrait,
      "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
      "slug": slug.current,
      "imageUrl": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
      univpilar,
      category,
      datePublication,
      ${RT},
      "authorName": coalesce(author->name, author)
    },
    "carousels": *[_type == "production" && defined(carouselSlides) && defined(image.asset)] | order(datePublication desc) [0...10] {
      _id,
      titre,
      deck,
      "imageUrl": coalesce(image.asset->url, imageUrl),
      "slug": slug.current,
      univpilar,
      category,
      "slideCount": count(carouselSlides)
    },
    "videos": *[_type == "production" && typeArticle == "video" && defined(image.asset)] | order(datePublication desc) [0...8] {
      _id,
      titre,
      description,
      "imageUrl": coalesce(image.asset->url, imageUrl),
      videoUrl,
      duree,
      "slug": slug.current,
      datePublication,
      univpilar
    }
  }
`;

export function excerptOf(item?: HomeItem, max = 190) {
  const raw = item?.extrait || item?.description || item?.contenuTexte || "";
  const clean = raw.replace(/\s+/g, " ").trim();
  const text = clean || FALLBACK_DECK;
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 90 ? lastSpace : max).trim()}...`;
}

export function itemHref(item?: HomeItem) {
  if (!item?.slug) return "/articles";
  if (item.typeArticle === "video" || item.videoUrl) return `/video/${item.slug}`;
  return `/article/${item.slug}`;
}

export function keepFrenchPunctuation(text?: string) {
  return (text || "")
    .replace(/\s+([?!:;])/g, " $1")
    .replace(/([A-Za-zÀ-ÿ])-([A-Za-zÀ-ÿ])/g, "$1‑$2");
}

export function universOf(item?: HomeItem) {
  const id = item?.univpilar as UniversId | undefined;
  return id && UNIVERS_MAP[id] ? UNIVERS_MAP[id] : null;
}

export function universIdOf(item?: HomeItem): UniversId {
  const id = item?.univpilar as UniversId | undefined;
  return id && UNIVERS_MAP[id] ? id : "esprit";
}

export function metaOf(item?: HomeItem, fallback = "Article") {
  const date = item?.datePublication
    ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(item.datePublication))
    : null;
  const time = item?.duree || (item?.tempsLecture ? `${item.tempsLecture} min` : null);
  return [date, time, fallback].filter(Boolean).join(" / ");
}

export function heroSlideOf(item: HomeItem, index: number): Slide {
  const category = item.category
    ? item.category.replace(/-/g, " ")
    : item.typeArticle || "Article";

  return {
    univers: universIdOf(item),
    meta: `${category} · N°${String(index + 1).padStart(2, "0")}`,
    title: keepFrenchPunctuation(item.titre),
    deck: excerptOf(item, 220),
    author: item.authorName || "Rédaction Origines",
    readTime: item.tempsLecture ? `Lecture ${item.tempsLecture} min` : "Lecture 5 min",
    href: itemHref(item),
    caption: item.authorName ? `Par ${item.authorName} pour Origines` : "Rédaction Origines",
    image: item.imageUrl || "/placeholder.svg",
    coverFocusX: 50,
    coverFocusY: 42,
    coverZoom: 115,
  };
}
