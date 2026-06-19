import { BookOpen, Newspaper, ShoppingBag, Users, Video, type LucideIcon } from "lucide-react";

export interface FormatDoor {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  action: string;
  image: string;
  accent: string;
  dark: string;
  Icon: LucideIcon;
  stats: string[];
  points: string[];
}

export const FORMAT_DOORS: FormatDoor[] = [
  {
    id: "media",
    index: "01",
    eyebrow: "Média",
    title: "Lire les récits, enquêtes et dossiers.",
    body: "Le coeur éditorial d'Origines : articles longs, histoires incarnées, analyses et formats qui prennent le temps.",
    href: "/media",
    action: "Entrer dans le média",
    image: "/images/mosaic-origines.webp",
    accent: "#7B5CD6",
    dark: "#2E1065",
    Icon: Newspaper,
    stats: ["Articles", "Dossiers", "Portraits"],
    points: ["Comprendre", "Ressentir", "Relier"],
  },
  {
    id: "videos",
    index: "02",
    eyebrow: "Vidéos",
    title: "Regarder les visages et les voix.",
    body: "Reportages, entretiens, formats courts et documentaires pour donner une présence réelle aux sujets.",
    href: "/videos",
    action: "Voir les vidéos",
    image: "/videos/vid-07.webp",
    accent: "#F97316",
    dark: "#431407",
    Icon: Video,
    stats: ["Reportages", "Interviews", "Séries"],
    points: ["Voir", "Écouter", "Incarné"],
  },
  {
    id: "guides",
    index: "03",
    eyebrow: "Guides",
    title: "Passer de l'idée au geste.",
    body: "Programmes, carnets et parcours pratiques pour transformer une lecture en action concrète.",
    href: "/guides",
    action: "Explorer les guides",
    image: "/boutique/boutique-gpt2-meditation.png",
    accent: "#10B981",
    dark: "#022C22",
    Icon: BookOpen,
    stats: ["Parcours", "Kits", "Ateliers"],
    points: ["Préparer", "Pratiquer", "Ancrer"],
  },
  {
    id: "boutique",
    index: "04",
    eyebrow: "Boutique",
    title: "Continuer avec les bons outils.",
    body: "Objets, workbooks, cartes, audios et éditions Origines pour prolonger les sujets dans la vraie vie.",
    href: "/boutique",
    action: "Voir la boutique",
    image: "/boutique/pack-transformation.webp",
    accent: "#EC4899",
    dark: "#4C0519",
    Icon: ShoppingBag,
    stats: ["Workbooks", "Audios", "Objets"],
    points: ["S'équiper", "Ritualiser", "Offrir"],
  },
  {
    id: "histoires",
    index: "05",
    eyebrow: "Histoires",
    title: "Faire entendre votre histoire.",
    body: "Témoignages, récits personnels, recommandations et voix de la communauté : l'endroit où le média vous répond.",
    href: "/histoires",
    action: "Lire les histoires",
    image: "/histoires/histoire_parcours_resilience.webp",
    accent: "#0EA5E9",
    dark: "#082F49",
    Icon: Users,
    stats: ["Témoignages", "Voix", "Communauté"],
    points: ["Partager", "Transmettre", "Résonner"],
  },
];
