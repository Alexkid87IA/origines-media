// src/lib/queries.ts
// Requêtes Sanity GROQ - Nettoyé le 18/01/2026
// Seules les queries utilisées sont conservées

// ========================================
// HOME PAGE
// ========================================

// Articles vedettes pour le Hero (1 article par verticale, max 7)
// On récupère le dernier article de chaque verticale pour avoir de la diversité
// 7 articles = 1 featured + 5 sidebar desktop + 1 extra pour mobile (grille 2 colonnes)
// Extrait: extrait > description > texte extrait du contenu
// EXCLUT les vidéos - elles ont leur propre section
export const FEATURED_ARTICLES_QUERY = `
  *[_type == "verticale"] | order(ordre asc) [0...7] {
    "article": *[_type == "production" && references(^._id) && defined(image.asset) && coalesce(typeArticle, "article") != "video"] | order(datePublication desc) [0] {
      _id,
      titre,
      extrait,
      description,
      "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
      typeArticle,
      "imageUrl": image.asset->url,
      "slug": slug.current,
      datePublication,
      tempsLecture
    },
    _id,
    nom,
    couleurDominante,
    "slug": slug.current
  }
`

// Portraits du carousel
export const PORTRAITS_QUERY = `
  *[_type == "portrait"] | order(ordre asc) {
    _id,
    titre,
    categorie,
    accroche,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": {"current": slug.current},
    "univers": univers->{
      _id,
      nom,
      couleur,
      "slug": slug.current
    },
    "verticale": verticale->{
      _id,
      nom,
      couleurDominante,
      "slug": slug.current
    },
    "tags": tags[]->{
      _id,
      nom,
      "title": coalesce(title, nom),
      couleur,
      "slug": slug.current
    }
  }
`

// Séries pour la home
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

// Verticales avec leurs productions (EXCLUT les vidéos ET les histoires - elles ont leurs propres sections)
export const VERTICALES_WITH_PRODUCTIONS_QUERY = `
  *[_type == "verticale"] | order(ordre asc) {
    _id,
    nom,
    slug,
    couleurDominante,
    description,
    imageUrl,
    "productions": *[_type == "production" && references(^._id) && !(typeArticle in ["video", "histoire"])] | order(datePublication desc) {
      _id,
      titre,
      extrait,
      description,
      "contenuTexte": array::join(contenu[_type == "block"][0...2].children[].text, " "),
      "imageUrl": coalesce(image.asset->url, imageUrl, "/placeholder.svg"),
      "slug": slug.current,
      datePublication,
      duree
    }
  }
`

// Vidéos pour la section homepage (productions avec typeArticle == "video")
export const VIDEOS_SECTION_QUERY = `
  *[_type == "production" && typeArticle == "video"] | order(datePublication desc) [0...12] {
    _id,
    titre,
    description,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    videoUrl,
    duree,
    tempsLecture,
    "slug": slug.current,
    datePublication,
    "verticale": verticale->{
      _id,
      nom,
      couleurDominante,
      "slug": slug.current
    }
  }
`

// ========================================
// VERTICALES
// ========================================

// Toutes les verticales (pour filtres)
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

// Verticales pour la page Univers (avec stats et univers liés)
// L'image est récupérée depuis un article de la verticale (Psychologie prend l'article index 3 pour varier)
export const VERTICALES_FOR_UNIVERS_PAGE_QUERY = `
  *[_type == "verticale"] | order(ordre asc) {
    _id,
    nom,
    "slug": slug.current,
    couleurDominante,
    description,
    "imageUrl": coalesce(
      image.asset->url,
      select(
        slug.current == "psychologie" => *[_type == "production" && references(^._id) && defined(image.asset) && coalesce(typeArticle, "article") != "video"] | order(datePublication asc) [0].image.asset->url,
        *[_type == "production" && references(^._id) && defined(image.asset) && coalesce(typeArticle, "article") != "video"] | order(datePublication desc) [0].image.asset->url
      ),
      "/placeholder.svg"
    ),
    ordre,
    "stats": {
      "articles": count(*[_type == "production" && references(^._id)])
    },
    "univers": *[_type == "univers" && references(^._id)] | order(ordre asc) {
      _id,
      nom,
      "slug": slug.current,
      couleur,
      description
    }
  }
`

// Détail d'une verticale
export const VERTICALE_DETAIL_QUERY = `
  *[_type == "verticale" && slug.current == $slug][0] {
    _id,
    nom,
    "slug": slug.current,
    couleurDominante,
    description,
    "imageUrl": coalesce(image.asset->url, "/placeholder.svg"),
    "stats": {
      "articles": count(*[_type == "production" && references(^._id)])
    },
    "univers": *[_type == "univers" && references(^._id)] | order(ordre asc) {
      _id,
      nom,
      "slug": slug.current,
      couleur,
      description,
      "articlesCount": count(*[_type == "production" && references(^._id)])
    },
    "productions": *[_type == "production" && references(^._id)] | order(datePublication desc) [0...12] {
      _id,
      titre,
      description,
      "slug": slug.current,
      "imageUrl": coalesce(image.asset->url, imageUrl, "/placeholder.svg"),
      datePublication,
      tempsLecture,
      "univers": univers->{nom, "slug": slug.current, couleur}
    }
  }
`

// ========================================
// EXPLORER (BIBLIOTHÈQUE)
// ========================================

// Articles pour Explorer (exclut les vidéos et histoires qui ont leurs propres catégories)
export const EXPLORER_ARTICLES_QUERY = `
  *[_type == "production" && !(coalesce(typeArticle, "article") in ["video", "histoire"])] | order(datePublication desc, _createdAt desc) {
    _id,
    titre,
    description,
    typeArticle,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    "datePublication": coalesce(datePublication, _createdAt),
    tempsLecture,
    "vues": coalesce(stats.views, views, vues, 0),
    "verticale": verticale->{
      _id,
      nom,
      couleurDominante,
      "slug": slug.current
    }
  }
`

// Vidéos pour Explorer (productions avec typeArticle == "video")
export const EXPLORER_VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video"] | order(datePublication desc, _createdAt desc) {
    _id,
    titre,
    description,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    videoUrl,
    duree,
    tempsLecture,
    "slug": slug.current,
    "datePublication": coalesce(datePublication, _createdAt),
    "vues": coalesce(stats.views, views, vues, 0),
    "verticale": verticale->{
      _id,
      nom,
      couleurDominante,
      "slug": slug.current
    }
  }
`

// Séries pour Explorer
export const EXPLORER_SERIES_QUERY = `
  *[_type == "serie"] | order(ordre asc, _createdAt desc) {
    _id,
    titre,
    description,
    "imageUrl": coalesce(poster.asset->url, imageUrl),
    "slug": slug.current,
    "episodeCount": count(*[_type == "episode" && references(^._id)]),
    "datePublication": coalesce(datePublication, _createdAt),
    "verticale": verticale->{
      _id,
      nom,
      couleurDominante,
      "slug": slug.current
    }
  }
`

// Recommandations pour Explorer
export const EXPLORER_RECOS_QUERY = `
  *[_type == "recommendation"] | order(datePublication desc, _createdAt desc) {
    _id,
    titre,
    type,
    auteur,
    note,
    coupDeCoeur,
    accroche,
    "description": accroche,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    "datePublication": coalesce(datePublication, _createdAt),
    "vues": coalesce(stats.views, views, vues, 0)
  }
`

// Recommandation par slug (page détail)
export const RECOMMENDATION_BY_SLUG_QUERY = `
  *[_type == "recommendation" && slug.current == $slug][0] {
    _id,
    titre,
    type,
    auteur,
    note,
    coupDeCoeur,
    accroche,
    "description": accroche,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    "datePublication": coalesce(datePublication, _createdAt),
    contenu[] {
      ...,
      markDefs[] {
        ...,
        _type == "internalLink" => {
          ...,
          "slug": reference->slug.current
        }
      }
    },
    items[] {
      _key,
      titre,
      description,
      note,
      "imageUrl": coalesce(image.asset->url, imageUrl),
      lien,
      auteurItem,
      annee
    }
  }
`

// Recommandations liées (même type)
export const RELATED_RECOS_QUERY = `
  *[_type == "recommendation" && type == $type && slug.current != $slug] | order(datePublication desc) [0...4] {
    _id,
    titre,
    type,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    note
  }
`

// Histoires pour Explorer
export const EXPLORER_HISTOIRES_QUERY = `
  *[_type == "portrait"] | order(ordre asc, _createdAt desc) {
    _id,
    titre,
    categorie,
    accroche,
    "description": accroche,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    "datePublication": coalesce(datePublication, _createdAt),
    "vues": coalesce(stats.views, views, vues, 0),
    "verticale": verticale->{
      _id,
      nom,
      couleurDominante,
      "slug": slug.current
    }
  }
`

// ========================================
// PRODUCTIONS / ARTICLES
// ========================================

// Production par slug (détail)
export const PRODUCTION_BY_SLUG_QUERY = `
  *[_type == "production" && slug.current == $slug][0] {
    _id,
    titre,
    typeArticle,
    description,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    slug,
    datePublication,
    duree,
    tempsLecture,
    videoUrl,
    contenu,
    "univers": univers->{
      _id,
      nom,
      couleur,
      "slug": slug.current
    },
    "verticale": verticale->{
      _id,
      nom,
      couleurDominante,
      "slug": slug.current
    },
    "formats": formats[]->{
      _id,
      nom,
      "slug": slug.current
    },
    "tags": tags[]->{
      _id,
      nom,
      couleur,
      "slug": slug.current
    },
    "portrait": portrait->{
      _id,
      titre,
      "imageUrl": coalesce(image.asset->url, imageUrl),
      "slug": slug.current,
      accroche,
      citation
    }
  }
`

// Articles pour la page Articles (actualités, guides - pas les histoires)
export const ARTICLES_PAGE_QUERY = `
  *[_type == "production" && coalesce(typeArticle, "article") in ["article", "actu", "guide", "interview"]] | order(datePublication desc) {
    _id,
    titre,
    typeArticle,
    extrait,
    description,
    "contenuTexte": array::join(contenu[_type == "block"][0...3].children[].text, " "),
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    datePublication,
    tempsLecture,
    "univers": univers->{
      _id,
      nom,
      couleur,
      "slug": slug.current
    },
    "verticale": verticale->{
      _id,
      nom,
      couleurDominante,
      "slug": slug.current
    },
    "tags": tags[]->{
      _id,
      nom,
      couleur,
      "slug": slug.current
    }
  }
`

// Article par slug (page article complète)
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

    // Contenu avec résolution des liens internes et articles liés
    body,
    contenu[] {
      ...,
      markDefs[] {
        ...,
        _type == "internalLink" => {
          "slug": reference->slug.current
        }
      },
      _type == "relatedArticles" => {
        ...,
        "articles": articles[]->{
          _id,
          "title": titre,
          "slug": slug.current,
          "imageUrl": coalesce(image.asset->url, imageUrl),
          "verticale": verticale->{nom, couleurDominante}
        }
      }
    },
    htmlContent,
    rawHtml,
    structuredContent,
    keyPoints,

    // Auteur
    author-> {
      _id,
      name,
      role,
      bio,
      specialites,
      image {
        asset-> {
          url
        }
      },
      social {
        twitter,
        linkedin,
        instagram
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
`

// Articles liés (fallback si pas définis manuellement) - exclut vidéos et histoires
export const RELATED_ARTICLES_QUERY = `
  *[_type == "production" && _id != $currentId && !(coalesce(typeArticle, "article") in ["video", "histoire"]) && (
    count(categories[@._ref in $categoryIds]) > 0 ||
    univers._ref == $universId ||
    verticale._ref == $verticaleId ||
    count(tags[@._ref in $tagIds]) > 0
  )] | order(datePublication desc) [0...3] {
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
`

// Articles populaires (par vues) - exclut vidéos et histoires
export const POPULAR_ARTICLES_QUERY = `
  *[_type == "production" && !(coalesce(typeArticle, "article") in ["video", "histoire"])] | order(coalesce(stats.views, views, 0) desc) [0...10] {
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
`

// ========================================
// PORTRAITS / HISTOIRES
// ========================================

// Portrait par slug (détail)
export const PORTRAIT_BY_SLUG_QUERY = `
  *[_type == "portrait" && slug.current == $slug][0] {
    _id,
    titre,
    categorie,
    accroche,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    slug,
    biographie,
    citation,
    dateNaissance,
    lieuNaissance,
    "univers": univers->{
      _id,
      nom,
      couleur,
      "slug": slug.current
    },
    "verticale": verticale->{
      _id,
      nom,
      couleurDominante,
      "slug": slug.current
    },
    "tags": tags[]->{
      _id,
      nom,
      "title": coalesce(title, nom),
      couleur,
      "slug": slug.current
    },
    "productions": productions[]->{
      _id,
      titre,
      "imageUrl": coalesce(image.asset->url, imageUrl),
      "slug": slug.current,
      description,
      typeArticle,
      videoUrl,
      contenu
    }
  }
`

// Portraits pour la page Histoires
export const HISTOIRES_PAGE_QUERY = `
  *[_type == "portrait"] | order(ordre asc, _createdAt desc) {
    _id,
    titre,
    categorie,
    accroche,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "slug": slug.current,
    citation,
    "univers": univers->{
      _id,
      nom,
      couleur,
      "slug": slug.current
    },
    "verticale": verticale->{
      _id,
      nom,
      couleurDominante,
      "slug": slug.current
    },
    "tags": tags[]->{
      _id,
      nom,
      "title": coalesce(title, nom),
      couleur,
      "slug": slug.current
    },
    "articleSlug": productions[0]->slug.current
  }
`

// ========================================
// TAGS
// ========================================

// Tous les tags (pour filtres)
export const TAGS_QUERY = `
  *[_type == "tag"] | order(nom asc) {
    _id,
    nom,
    slug,
    couleur
  }
`

// ========================================
// NAVIGATION HISTOIRES
// ========================================

// Histoires similaires (même tags ou même univers)
export const SIMILAR_HISTOIRES_QUERY = `
  *[_type == "portrait" && _id != $currentId && (
    count(tags[@._ref in $tagIds]) > 0 ||
    univers._ref == $universId
  )] | order(ordre asc) [0...4] {
    _id,
    titre,
    categorie,
    accroche,
    "slug": slug.current,
    citation,
    "tags": tags[]->{
      _id,
      nom,
      "slug": slug.current,
      couleur
    }
  }
`

// Toutes les histoires (pour navigation prev/next)
export const ALL_HISTOIRES_SLUGS_QUERY = `
  *[_type == "portrait"] | order(ordre asc, _createdAt desc) {
    _id,
    titre,
    categorie,
    "slug": slug.current,
    "tags": tags[0]->{nom, couleur}
  }
`
