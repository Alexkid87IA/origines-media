import { SANITY_URL } from './constants.js'

export const ARTICLE_FULL_QUERY = `
  *[_type == "production" && slug.current == $slug][0] {
    "title": titre,
    "description": coalesce(description, extrait, chapeau, deck),
    "image": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    "publishedAt": datePublication,
    "modifiedAt": coalesce(dateModification, _updatedAt),
    "author": coalesce(auteur->nom, auteur->name, author->nom, author->name),
    "type": coalesce(typeArticle, "article"),
    "readTime": coalesce(tempsLecture, readTime),
    univpilar,
    soustopic,
    "verticaleNom": verticale->titre,
    "verticaleSlug": verticale->slug.current,
    "tags": tags[]->{ "title": titre, "slug": slug.current },
    "contenu": coalesce(contenu, body)[] {
      ...,
      markDefs[] {
        ...,
        _type == "internalLink" => { "slug": reference->slug.current }
      }
    },
    videoUrl,
    rubrique
  }
`

export const VIDEO_FULL_QUERY = `
  *[_type == "production" && slug.current == $slug && typeArticle == "video"][0] {
    "title": titre,
    "description": coalesce(description, extrait),
    "image": coalesce(image.asset->url, imageUrl),
    "publishedAt": datePublication,
    "modifiedAt": coalesce(dateModification, _updatedAt),
    "author": coalesce(auteur->nom, auteur->name, author->nom, author->name),
    "videoUrl": videoUrl,
    "readTime": coalesce(tempsLecture, readTime),
    univpilar,
    soustopic,
    "verticaleNom": verticale->titre,
    "contenu": coalesce(contenu, body)[] {
      ...,
      markDefs[] {
        ...,
        _type == "internalLink" => { "slug": reference->slug.current }
      }
    }
  }
`

export const PORTRAIT_FULL_QUERY = `
  *[_type == "portrait" && slug.current == $slug][0] {
    "title": titre,
    "description": coalesce(accroche, citation),
    "image": coalesce(image.asset->url, imageUrl),
    "biographie": biographie,
    "citation": citation,
    "categorie": categorie
  }
`

export const RECOMMENDATION_FULL_QUERY = `
  *[_type == "recommendation" && slug.current == $slug][0] {
    "title": titre,
    "description": coalesce(accroche, type),
    "image": coalesce(image.asset->url, imageUrl),
    "author": auteur,
    "type": type,
    "contenu": contenu
  }
`

export const SERIES_FULL_QUERY = `
  *[_type == "serie" && slug.current == $slug][0] {
    "title": titre,
    "description": description,
    "image": coalesce(poster.asset->url, imageUrl),
    "episodes": episodes[]->{ "title": titre, "slug": slug.current, "description": coalesce(description, extrait, deck) }
  }
`

export const DOSSIER_FULL_QUERY = `
  *[_type == "questionDeLaSemaine" && slug.current == $slug][0] {
    "title": question,
    "description": chapeau,
    "image": coalesce(image.asset->url, mainImage.asset->url),
    "articles": articles[]->{ "title": titre, "slug": slug.current, "description": coalesce(description, extrait, deck) }
  }
`

export const LIST_ARTICLES_QUERY = `
  *[_type == "production" && defined(slug.current) && coalesce(typeArticle, "article") != "video" && !defined(carouselSlides) && !("carrousel" in tags)] | order(datePublication desc)[0...20] {
    "title": titre,
    "slug": slug.current,
    "description": coalesce(description, extrait, chapeau, deck),
    "image": coalesce(image.asset->url, imageUrl),
    "type": coalesce(typeArticle, "article")
  }
`

// Same feed selection as the public homepage; keep real titles and excerpts.
export const HOME_FEED_QUERY = `
  *[_type == "production" && defined(slug.current) && (defined(image.asset) || defined(imageUrl)) && rubrique != "guides" && !defined(carouselSlides) && !("carrousel" in tags)] | order(datePublication desc)[0...28] {
    "title": titre,
    "slug": slug.current,
    "description": coalesce(extrait, description, array::join(contenu[_type == "block"][0...2].children[].text, " ")),
    "image": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    "type": coalesce(typeArticle, "article"),
    videoUrl
  }
`

export const LIST_VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video" && defined(slug.current)] | order(datePublication desc)[0...20] {
    "title": titre,
    "slug": slug.current,
    "description": coalesce(description, extrait, chapeau, deck),
    "image": coalesce(image.asset->url, imageUrl)
  }
`

export const LIST_PORTRAITS_QUERY = `
  *[_type == "portrait" && defined(slug.current)] | order(_createdAt desc)[0...20] {
    "title": titre,
    "slug": slug.current,
    "description": coalesce(accroche, citation),
    "image": coalesce(image.asset->url, imageUrl)
  }
`

export const LIST_RECOMMENDATIONS_QUERY = `
  *[_type == "recommendation" && defined(slug.current)] | order(_createdAt desc)[0...20] {
    "title": titre,
    "slug": slug.current,
    "description": coalesce(accroche, type),
    "image": coalesce(image.asset->url, imageUrl),
    "type": type
  }
`

export const LIST_SERIES_QUERY = `
  *[_type == "serie" && defined(slug.current)] | order(_createdAt desc)[0...20] {
    "title": titre,
    "slug": slug.current,
    "description": description,
    "image": coalesce(poster.asset->url, imageUrl)
  }
`

export const LIST_DOSSIERS_QUERY = `
  *[_type == "questionDeLaSemaine" && defined(slug.current)] | order(_createdAt desc)[0...20] {
    "title": question,
    "slug": slug.current,
    "description": chapeau,
    "image": coalesce(image.asset->url, mainImage.asset->url)
  }
`

export const UNIVERS_ARTICLES_QUERY = `
  *[_type == "production" && univpilar == $univpilar && defined(slug.current)] | order(datePublication desc)[0...20] {
    "title": titre,
    "slug": slug.current,
    "description": coalesce(description, extrait, chapeau, deck),
    "image": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    "type": coalesce(typeArticle, "article"),
    videoUrl
  }
`

export const SUBTOPIC_ARTICLES_QUERY = `
  *[_type == "production" && soustopic == $soustopic && defined(slug.current)] | order(datePublication desc)[0...20] {
    "title": titre,
    "slug": slug.current,
    "description": coalesce(description, extrait, chapeau, deck),
    "image": coalesce(image.asset->url, mainImage.asset->url, imageUrl),
    "type": coalesce(typeArticle, "article"),
    videoUrl
  }
`

export const AFFILIATE_PRODUCT_QUERY = `
  *[_type == "affiliateProduct" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    description,
    brand,
    "image": coalesce(image.asset->url, imageUrl),
    affiliateLinks
  }
`

export async function fetchSanity<T = Record<string, unknown>>(
  query: string,
  params: Record<string, string> = {}
): Promise<T | null> {
  const searchParams = new URLSearchParams({ query })
  for (const [key, val] of Object.entries(params)) {
    searchParams.set(`$${key}`, JSON.stringify(val))
  }
  try {
    const res = await fetch(`${SANITY_URL}?${searchParams}`, { signal: AbortSignal.timeout(7000) })
    if (!res.ok) {
      console.error(`[prerender] Sanity ${res.status}`)
      throw new Error(`Sanity ${res.status}`)
    }
    const data = await res.json()
    return (data.result as T) ?? null
  } catch (err) {
    console.error('[prerender] Sanity fetch error:', err)
    throw err
  }
}
