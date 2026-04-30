import { SANITY_URL } from './constants'

export const ARTICLE_FULL_QUERY = `
  *[_type == "production" && slug.current == $slug][0] {
    "title": titre,
    "description": coalesce(description, extrait, chapeau),
    "image": coalesce(image.asset->url, imageUrl),
    "publishedAt": datePublication,
    "modifiedAt": coalesce(dateModification, _updatedAt),
    "author": coalesce(author->name, auteur->nom),
    "type": coalesce(typeArticle, "article"),
    "readTime": coalesce(tempsLecture, readTime),
    univpilar,
    soustopic,
    "verticaleNom": verticale->titre,
    "verticaleSlug": verticale->slug.current,
    "tags": tags[]->{ "title": titre, "slug": slug.current },
    "contenu": contenu,
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
    "author": coalesce(author->name, auteur->nom),
    "videoUrl": videoUrl,
    "readTime": coalesce(tempsLecture, readTime),
    univpilar,
    soustopic,
    "verticaleNom": verticale->titre,
    "contenu": contenu
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
    "episodes": episodes[]->{ "title": titre, "slug": slug.current, "description": coalesce(description, extrait) }
  }
`

export const DOSSIER_FULL_QUERY = `
  *[_type == "questionDeLaSemaine" && slug.current == $slug][0] {
    "title": question,
    "description": chapeau,
    "image": coalesce(image.asset->url, mainImage.asset->url),
    "articles": articles[]->{ "title": titre, "slug": slug.current, "description": coalesce(description, extrait) }
  }
`

export const LIST_ARTICLES_QUERY = `
  *[_type == "production" && defined(slug.current)] | order(datePublication desc)[0...20] {
    "title": titre,
    "slug": slug.current,
    "description": coalesce(description, extrait),
    "image": coalesce(image.asset->url, imageUrl),
    "type": coalesce(typeArticle, "article")
  }
`

export const LIST_VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video" && defined(slug.current)] | order(datePublication desc)[0...20] {
    "title": titre,
    "slug": slug.current,
    "description": coalesce(description, extrait),
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

export const SUBTOPIC_ARTICLES_QUERY = `
  *[_type == "production" && soustopic == $soustopic && defined(slug.current)] | order(datePublication desc)[0...20] {
    "title": titre,
    "slug": slug.current,
    "description": coalesce(description, extrait),
    "type": coalesce(typeArticle, "article")
  }
`

export async function fetchSanity<T = Record<string, unknown>>(
  query: string,
  params: Record<string, string> = {}
): Promise<T | null> {
  const searchParams = new URLSearchParams({ query })
  for (const [key, val] of Object.entries(params)) {
    searchParams.set(`$${key}`, `"${val}"`)
  }
  try {
    const res = await fetch(`${SANITY_URL}?${searchParams}`)
    if (!res.ok) {
      console.error(`[prerender] Sanity ${res.status}`)
      return null
    }
    const data = await res.json()
    return (data.result as T) ?? null
  } catch (err) {
    console.error('[prerender] Sanity fetch error:', err)
    return null
  }
}
