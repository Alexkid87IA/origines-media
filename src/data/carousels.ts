import slideMap from "./carouselSlides.json";

export interface StaticCarousel {
  slug: string;
  title: string;
  deck: string;
  category: string;
  brand: "origines" | "petit-heros";
  slideCount: number;
  cover: string;
  slides: string[];
  instagram: string;
}

const IG_ORIGINES = "https://www.instagram.com/origines.media";
const IG_PETIT_HEROS = "https://www.instagram.com/lepetitheros_";

function fromCdn(slug: string): { cover: string; slides: string[] } {
  const urls = (slideMap as Record<string, string[]>)[slug] ?? [];
  return { cover: urls[0] ?? "", slides: urls };
}

export const STATIC_CAROUSELS: StaticCarousel[] = [
  {
    slug: "proverbes-africains",
    title: "Proverbes africains.",
    deck: "Trois proverbes. Trois vérités. Ce que l'Afrique enseigne au reste du monde.",
    category: "Spiritualité",
    brand: "origines",
    slideCount: 6,
    ...fromCdn("proverbes-africains"),
    instagram: IG_ORIGINES,
  },
  {
    slug: "michael-jordan",
    title: "Michael Jordan.",
    deck: "Recalé de l'équipe de son lycée. Six titres NBA plus tard, personne ne rigole.",
    category: "Sport",
    brand: "origines",
    slideCount: 15,
    ...fromCdn("michael-jordan"),
    instagram: IG_ORIGINES,
  },
  {
    slug: "dean-karnazes",
    title: "Dean Karnazes. 50 marathons. 50 jours.",
    deck: "Un marathon par jour, dans un État différent, sans jamais s'arrêter.",
    category: "Sport",
    brand: "origines",
    slideCount: 12,
    ...fromCdn("dean-karnazes"),
    instagram: IG_ORIGINES,
  },
  {
    slug: "liste-7-phrases-parents",
    title: "7 phrases de vos parents qui vous ont marqué.",
    deck: "Elles ont l'air anodines. Elles ne le sont pas.",
    category: "Famille",
    brand: "origines",
    slideCount: 12,
    ...fromCdn("liste-7-phrases-parents"),
    instagram: IG_ORIGINES,
  },
  {
    slug: "liste-6-mensonges-anxiete",
    title: "6 mensonges que l'anxiété vous raconte.",
    deck: "Elle parle fort. Elle parle faux. Voici comment la reconnaître.",
    category: "Psychologie",
    brand: "origines",
    slideCount: 11,
    ...fromCdn("liste-6-mensonges-anxiete"),
    instagram: IG_ORIGINES,
  },
  {
    slug: "liste-8-privileges-invisibles",
    title: "8 privilèges invisibles.",
    deck: "Ceux qu'on ne voit que quand on ne les a pas.",
    category: "Société",
    brand: "origines",
    slideCount: 13,
    ...fromCdn("liste-8-privileges-invisibles"),
    instagram: IG_ORIGINES,
  },
  {
    slug: "caprices-mode-emploi",
    title: "Les caprices n'existent pas.",
    deck: "Faites défiler.",
    category: "Parentalité",
    brand: "petit-heros",
    slideCount: 15,
    ...fromCdn("caprices-mode-emploi"),
    instagram: IG_PETIT_HEROS,
  },
  {
    slug: "pourquoi-meme-histoire",
    title: "Pourquoi votre enfant vous demande la même histoire 47 fois.",
    deck: "Ce n'est pas un bug. C'est une feature.",
    category: "Parentalité",
    brand: "petit-heros",
    slideCount: 10,
    ...fromCdn("pourquoi-meme-histoire"),
    instagram: IG_PETIT_HEROS,
  },
  {
    slug: "ce-que-votre-enfant-voit",
    title: "Ce que votre enfant voit quand il vous regarde.",
    deck: "Vous n'avez aucune idée.",
    category: "Parentalité",
    brand: "petit-heros",
    slideCount: 10,
    ...fromCdn("ce-que-votre-enfant-voit"),
    instagram: IG_PETIT_HEROS,
  },
  {
    slug: "ne-vous-dira-jamais",
    title: "Ce que votre enfant ne vous dira jamais (mais pense très fort).",
    deck: "Il ne sait encore le dire.",
    category: "Parentalité",
    brand: "petit-heros",
    slideCount: 10,
    ...fromCdn("ne-vous-dira-jamais"),
    instagram: IG_PETIT_HEROS,
  },
  {
    slug: "rituels-du-coucher",
    title: "Pourquoi le rituel du coucher change tout.",
    deck: "Ce n'est pas une routine. C'est un ancrage.",
    category: "Parentalité",
    brand: "petit-heros",
    slideCount: 10,
    ...fromCdn("rituels-du-coucher"),
    instagram: IG_PETIT_HEROS,
  },
];
