// src/components/portrait/types.ts

export interface Tag {
  _id: string;
  nom: string;
  slug: string;
  couleur?: string;
}

export interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{
    _type: string;
    _key: string;
    text?: string;
    marks?: string[];
  }>;
  url?: string;
}

export interface Production {
  _id: string;
  titre: string;
  imageUrl?: string;
  slug: string;
  description?: string;
  typeArticle?: string;
  videoUrl?: string;
  contenu?: PortableTextBlock[];
}

export interface Portrait {
  _id: string;
  titre: string;
  categorie: string;
  accroche: string;
  imageUrl?: string;
  slug: { current: string };
  biographie?: string;
  citation?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  tags?: Tag[];
  univers?: { _id: string; nom: string; couleur: string };
  productions?: Production[];
}

export interface HistoireNav {
  _id: string;
  titre: string;
  categorie?: string;
  slug: string;
  tags?: { nom: string; couleur?: string };
}

export interface SimilarHistoire {
  _id: string;
  titre: string;
  categorie?: string;
  accroche?: string;
  slug: string | { current: string };
  citation?: string;
  tags?: Tag[];
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface CategoryColors {
  bg: string;
  light: string;
  text: string;
}
