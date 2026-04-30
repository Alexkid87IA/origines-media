import type { VercelRequest, VercelResponse } from '@vercel/node'

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.headers['x-revalidate-secret'] || req.query.secret
  if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
    return res.status(401).json({ error: 'Invalid secret' })
  }

  const body = req.body as Record<string, unknown> | undefined
  const type = body?._type as string | undefined
  const slug = (body?.slug as Record<string, string>)?.current

  const paths: string[] = []

  if (type === 'production' && slug) {
    paths.push(`/api/prerender/article/${slug}`)
    paths.push(`/api/prerender/articles`)
    paths.push(`/api/prerender/videos`)
  } else if (type === 'portrait' && slug) {
    paths.push(`/api/prerender/histoire/${slug}`)
    paths.push(`/api/prerender/histoires`)
    paths.push(`/api/prerender/temoignages`)
  } else if (type === 'recommendation' && slug) {
    paths.push(`/api/prerender/recommandations/${slug}`)
    paths.push(`/api/prerender/recommandations`)
  } else if (type === 'serie' && slug) {
    paths.push(`/api/prerender/series/${slug}`)
    paths.push(`/api/prerender/series`)
  } else if (type === 'questionDeLaSemaine' && slug) {
    paths.push(`/api/prerender/dossiers/${slug}`)
    paths.push(`/api/prerender/dossiers`)
  }

  // Always purge homepage
  paths.push(`/api/prerender/`)

  const baseUrl = `https://${req.headers.host || 'www.origines.media'}`
  const results = await Promise.allSettled(
    paths.map(p =>
      fetch(`${baseUrl}${p}`, {
        headers: { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '' },
      }).then(r => ({ path: p, status: r.status }))
    )
  )

  const purged = results
    .filter((r): r is PromiseFulfilledResult<{ path: string; status: number }> => r.status === 'fulfilled')
    .map(r => r.value)

  console.log(`[revalidate] ${type}/${slug} — purged ${purged.length} paths`)

  return res.status(200).json({ revalidated: true, paths: purged })
}
