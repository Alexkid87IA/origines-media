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

// ========================================
// REQUÊTES POUR LES ARTICLES (ADAPTÉES POUR PRODUCTIONS)
// ========================================

// Requête pour un article/production spécifique
export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "production" && slug.current == $slug][0] {
    _id,
    "title": titre,
    slug,
    "excerpt": description,
    "publishedAt": datePublication,
    "imageUrl": image.asset->url,
    mainImage {
      asset-> {
        url
      }
    },
    
    // Contenu
    body,
    contenu,
    htmlContent,
    rawHtml,
    structuredContent,
    keyPoints,
    
    // Auteur
    author-> {
      _id,
      name,
      bio,
      image {
        asset-> {
          url
        }
      }
    },
    authorDetails,
    
    // Métadonnées
    readingTime,
    "difficulty": niveau,
    format,
    views,
    "likes": coalesce(stats.likes, 0),
    "vues": coalesce(stats.views, views, vues, 0),
    
    // Relations
    categories[]-> {
      _id,
      title,
      slug
    },
    tags[]-> {
      _id,
      "title": nom,
      slug,
      "color": couleur
    },
    univers-> {
      _id,
      nom,
      couleur,
      slug
    },
    verticale-> {
      _id,
      nom,
      "couleurDominante": couleur,
      slug
    },
    
    // Type de section
    sectionType-> {
      _id,
      title,
      slug
    },
    videoUrl,
    "duration": duree,
    
    // SEO
    seo,
    
    // Options
    displayOptions,
    isEssential,
    
    // Articles liés
    relatedArticles[]-> {
      _id,
      "title": titre,
      slug,
      "imageUrl": image.asset->url,
      mainImage {
        asset-> {
          url
        }
      },
      "excerpt": description,
      readingTime,
      categories[]-> {
        title
      }
    }
  }
`;

// Requête pour les articles liés (si pas définis manuellement)
export const RELATED_ARTICLES_QUERY = `
  *[_type == "production" && _id != $currentId && (
    count(categories[@._ref in $categoryIds]) > 0 ||
    univers._ref == $universId ||
    verticale._ref == $verticaleId ||
    count(tags[@._ref in $tagIds]) > 0
  )] | order(datePublication desc) [0...4] {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    readingTime,
    "publishedAt": datePublication,
    categories[0]-> {
      title
    },
    verticale-> {
      nom
    }
  }
`;

// Requête pour les articles par catégorie
export const ARTICLES_BY_CATEGORY_QUERY = `
  *[_type == "production" && references($categoryId)] | order(datePublication desc) {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    "publishedAt": datePublication,
    readingTime,
    author-> {
      name
    },
    categories[]-> {
      title
    }
  }
`;

// Requête pour les articles par tag
export const ARTICLES_BY_TAG_QUERY = `
  *[_type == "production" && references($tagId)] | order(datePublication desc) {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    "publishedAt": datePublication,
    readingTime,
    tags[]-> {
      "title": nom,
      "color": couleur
    }
  }
`;

// Requête pour les articles essentiels
export const ESSENTIAL_ARTICLES_QUERY = `
  *[_type == "production" && isEssential == true] | order(orderInEssentials asc) [0...5] {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    categories[]-> {
      title,
      slug
    },
    readingTime,
    orderInEssentials
  }
`;

// Requête pour récupérer plusieurs articles par IDs (pour les bookmarks)
export const ARTICLES_BY_IDS_QUERY = `
  *[_type == "production" && _id in $articleIds] {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    "publishedAt": datePublication,
    readingTime,
    categories[0]-> {
      title
    },
    verticale-> {
      nom,
      "couleurDominante": couleur
    }
  }
`;

// Recherche d'articles par mot-clé
export const SEARCH_ARTICLES_QUERY = `
  *[_type == "production" && (
    titre match $searchTerm + "*" || 
    description match $searchTerm + "*" ||
    pt::text(body) match $searchTerm + "*"
  )] | order(datePublication desc) {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    "publishedAt": datePublication,
    readingTime,
    categories[]-> {
      title
    }
  }
`;

// Articles récents
export const RECENT_ARTICLES_QUERY = `
  *[_type == "production"] | order(datePublication desc) [0...6] {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    "publishedAt": datePublication,
    readingTime,
    author-> {
      name
    },
    categories[]-> {
      title
    },
    format
  }
`;

// Articles par univers
export const ARTICLES_BY_UNIVERS_QUERY = `
  *[_type == "production" && univers->slug.current == $universId] | order(datePublication desc) {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    "publishedAt": datePublication,
    readingTime,
    author-> {
      name
    },
    categories[]-> {
      title
    },
    tags[]-> {
      "title": nom,
      "color": couleur
    }
  }
`;

// Statistiques des articles
export const ARTICLE_STATS_QUERY = `
{
  "totalArticles": count(*[_type == "production"]),
  "totalEssentials": count(*[_type == "production" && isEssential == true]),
  "totalVideos": count(*[_type == "production" && defined(videoUrl)]),
  "totalByFormat": *[_type == "production"] | group(format) | order(count desc) {
    "format": format,
    "count": count
  }
}`;

// Articles par type de section
export const ARTICLES_BY_SECTION_TYPE_QUERY = `
  *[_type == "production" && sectionType->slug.current == $sectionType] | order(datePublication desc) {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    "publishedAt": datePublication,
    videoUrl,
    "duration": duree,
    views,
    sectionType-> {
      title
    }
  }
`;

// Articles populaires (par vues)
export const POPULAR_ARTICLES_QUERY = `
  *[_type == "production"] | order(coalesce(stats.views, views, 0) desc) [0...10] {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    "views": coalesce(stats.views, views, 0),
    categories[]-> {
      title
    }
  }
`;

// Articles les plus likés
export const MOST_LIKED_ARTICLES_QUERY = `
  *[_type == "production"] | order(coalesce(stats.likes, 0) desc) [0...10] {
    _id,
    "title": titre,
    slug,
    mainImage {
      asset-> {
        url
      }
    },
    "imageUrl": image.asset->url,
    "excerpt": description,
    "likes": coalesce(stats.likes, 0),
    categories[]-> {
      title
    }
  }
`;