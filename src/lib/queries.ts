// src/lib/queries.ts - Fichier complet

// ========================================
// REQUÊTES POUR LE CAROUSEL ET LA HOME
// ========================================

// Requête pour les portraits du carousel
export const PORTRAITS_QUERY = `
  *[_type == "portrait"] | order(ordre asc) {
    _id,
    titre,
    categorie,
    accroche,
    imageUrl,
    slug
  }
`

// Requête pour les vidéos (Fragments)
export const VIDEOS_QUERY = `
  *[_type == "video"] | order(ordre asc) {
    _id,
    titre,
    description,
    imageUrl,
    videoUrl,
    ordre
  }
`

// ========================================
// REQUÊTES POUR LES UNIVERS
// ========================================

// Requête pour tous les univers
export const UNIVERS_QUERY = `
  *[_type == "univers"] | order(ordre asc) {
    _id,
    nom,
    couleur,
    description,
    imageUrl,
    slug
  }
`

// Requête pour un univers spécifique
export const UNIVERS_BY_SLUG_QUERY = `
  *[_type == "univers" && slug.current == $slug][0] {
    _id,
    nom,
    couleur,
    description,
    imageUrl,
    slug
  }
`

// Requête pour les productions par univers
export const PRODUCTIONS_BY_UNIVERS_QUERY = `
  *[_type == "production" && references($universId)] | order(datePublication desc) [0...3] {
    _id,
    titre,
    imageUrl,
    slug
  }
`

// ========================================
// REQUÊTES POUR LES VERTICALES
// ========================================

// Requête pour toutes les verticales
export const VERTICALES_QUERY = `
  *[_type == "verticale"] | order(ordre asc) {
    _id,
    nom,
    slug,
    couleurDominante,
    description,
    imageUrl,
    ordre
  }
`

// Requête pour une verticale spécifique
export const VERTICALE_BY_SLUG_QUERY = `
  *[_type == "verticale" && slug.current == $slug][0] {
    _id,
    nom,
    slug,
    couleurDominante,
    description,
    imageUrl
  }
`

// Requête pour les productions par verticale
export const PRODUCTIONS_BY_VERTICALE_QUERY = `
  *[_type == "production" && references($verticaleId)] | order(datePublication desc) {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    datePublication,
    duree,
    "formats": formats[]->nom,
    "tags": tags[]->nom
  }
`

// Requête pour les verticales avec leurs productions (pour la bibliothèque)
export const VERTICALES_WITH_PRODUCTIONS_QUERY = `
  *[_type == "verticale"] | order(ordre asc) {
    _id,
    nom,
    slug,
    couleurDominante,
    description,
    imageUrl,
    "productions": *[_type == "production" && references(^._id)] | order(datePublication desc) [0...6] {
      _id,
      titre,
      description,
      "imageUrl": select(
        defined(imageUrl) => imageUrl,
        defined(image.asset) => image.asset->url,
        "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg"
      ),
      "slug": slug.current,
      datePublication,
      duree
    }
  }
`

// ========================================
// REQUÊTES POUR LES PRODUCTIONS
// ========================================

// Requête pour toutes les productions
export const PRODUCTIONS_QUERY = `
  *[_type == "production"] | order(datePublication desc) {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    datePublication,
    duree,
    videoUrl,
    "univers": univers->nom,
    "verticale": verticale->nom,
    "formats": formats[]->nom,
    "tags": tags[]->nom
  }
`

// Requête pour une production spécifique
export const PRODUCTION_BY_SLUG_QUERY = `
  *[_type == "production" && slug.current == $slug][0] {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    datePublication,
    duree,
    videoUrl,
    contenu,
    "univers": univers->{
      nom,
      couleur,
      slug
    },
    "verticale": verticale->{
      nom,
      couleurDominante,
      slug
    },
    "formats": formats[]->{
      nom,
      slug
    },
    "tags": tags[]->{
      nom,
      couleur,
      slug
    }
  }
`

// ========================================
// REQUÊTES POUR LES PORTRAITS
// ========================================

// Requête pour un portrait spécifique
export const PORTRAIT_BY_SLUG_QUERY = `
  *[_type == "portrait" && slug.current == $slug][0] {
    _id,
    titre,
    categorie,
    accroche,
    imageUrl,
    slug,
    biographie,
    citation,
    dateNaissance,
    lieuNaissance,
    "productions": *[_type == "production" && references(^._id)] {
      _id,
      titre,
      imageUrl,
      slug
    }
  }
`

// ========================================
// REQUÊTES POUR LES TAGS ET FORMATS
// ========================================

// Requête pour tous les tags
export const TAGS_QUERY = `
  *[_type == "tag"] | order(nom asc) {
    _id,
    nom,
    slug,
    couleur
  }
`

// Requête pour un tag spécifique
export const TAG_BY_SLUG_QUERY = `
  *[_type == "tag" && slug.current == $slug][0] {
    _id,
    nom,
    slug,
    couleur,
    description
  }
`

// Requête pour tous les formats
export const FORMATS_QUERY = `
  *[_type == "format"] | order(nom asc) {
    _id,
    nom,
    slug,
    description
  }
`

// Requête pour un format spécifique
export const FORMAT_BY_SLUG_QUERY = `
  *[_type == "format" && slug.current == $slug][0] {
    _id,
    nom,
    slug,
    description
  }
`

// ========================================
// REQUÊTES POUR LES SÉRIES ET ÉPISODES
// ========================================

// Requête pour toutes les séries
export const SERIES_QUERY = `
  *[_type == "serie"] | order(titre asc) {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    "nombreEpisodes": count(*[_type == "episode" && references(^._id)])
  }
`

// Requête pour une série spécifique avec ses épisodes
export const SERIE_BY_SLUG_QUERY = `
  *[_type == "serie" && slug.current == $slug][0] {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    "episodes": *[_type == "episode" && references(^._id)] | order(numero asc) {
      _id,
      titre,
      numero,
      description,
      imageUrl,
      slug,
      duree,
      datePublication
    }
  }
`

// Requête pour un épisode spécifique
export const EPISODE_BY_SLUG_QUERY = `
  *[_type == "episode" && slug.current == $slug][0] {
    _id,
    titre,
    numero,
    description,
    imageUrl,
    slug,
    duree,
    datePublication,
    videoUrl,
    "serie": serie->{
      titre,
      slug
    }
  }
`

// ========================================
// REQUÊTES DE RECHERCHE ET FILTRAGE
// ========================================

// Recherche de productions par mot-clé
export const SEARCH_PRODUCTIONS_QUERY = `
  *[_type == "production" && (
    titre match $searchTerm + "*" || 
    description match $searchTerm + "*"
  )] | order(datePublication desc) {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    datePublication,
    duree,
    "verticale": verticale->nom,
    "formats": formats[]->nom
  }
`

// Productions filtrées par tag
export const PRODUCTIONS_BY_TAG_QUERY = `
  *[_type == "production" && references($tagId)] | order(datePublication desc) {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    datePublication,
    duree,
    "verticale": verticale->nom,
    "formats": formats[]->nom
  }
`

// Productions filtrées par format
export const PRODUCTIONS_BY_FORMAT_QUERY = `
  *[_type == "production" && references($formatId)] | order(datePublication desc) {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    datePublication,
    duree,
    "verticale": verticale->nom
  }
`

// ========================================
// REQUÊTES POUR LA PAGE D'ACCUEIL
// ========================================

// Productions récentes (pour la section "Nouveautés")
export const RECENT_PRODUCTIONS_QUERY = `
  *[_type == "production"] | order(datePublication desc) [0...6] {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    datePublication,
    duree,
    "univers": univers->nom,
    "verticale": verticale->nom
  }
`

// Productions populaires/mises en avant
export const FEATURED_PRODUCTIONS_QUERY = `
  *[_type == "production" && miseEnAvant == true] | order(datePublication desc) [0...6] {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    datePublication,
    duree,
    "univers": univers->nom,
    "verticale": verticale->nom
  }
`

// ========================================
// REQUÊTES POUR LES STATISTIQUES
// ========================================

// Compteurs pour le tableau de bord
export const CONTENT_STATS_QUERY = `
{
  "totalProductions": count(*[_type == "production"]),
  "totalPortraits": count(*[_type == "portrait"]),
  "totalVideos": count(*[_type == "video"]),
  "totalUnivers": count(*[_type == "univers"]),
  "totalVerticales": count(*[_type == "verticale"]),
  "totalSeries": count(*[_type == "serie"]),
  "totalEpisodes": count(*[_type == "episode"])
}
`

// ========================================
// REQUÊTES POUR LA PAGINATION
// ========================================

// Productions avec pagination
export const PRODUCTIONS_PAGINATED_QUERY = `
{
  "items": *[_type == "production"] | order(datePublication desc) [$start...$end] {
    _id,
    titre,
    description,
    imageUrl,
    slug,
    datePublication,
    duree,
    "verticale": verticale->nom,
    "formats": formats[]->nom
  },
  "total": count(*[_type == "production"])
}
`

// ========================================
// REQUÊTES POUR LES CONTENUS CONNEXES
// ========================================

// Productions similaires (même verticale, même univers)
export const RELATED_PRODUCTIONS_QUERY = `
  *[_type == "production" && _id != $currentId && (
    verticale._ref == $verticaleId || 
    univers._ref == $universId
  )] | order(datePublication desc) [0...4] {
    _id,
    titre,
    imageUrl,
    slug,
    "verticale": verticale->nom
  }
`