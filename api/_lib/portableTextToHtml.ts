import { toHTML } from '@portabletext/to-html'

function extractText(blocks: unknown): string {
  if (typeof blocks === 'string') return blocks
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter((b: any) => b._type === 'block')
    .map((b: any) => (b.children || []).map((c: any) => c.text || '').join(''))
    .join(' ')
}

function sanityImgUrl(ref: string | undefined, url: string | undefined, width = 800): string {
  if (url) return `${url}?w=${width}&q=80&fm=webp`
  if (!ref) return ''
  const [, id, dims, ext] = ref.split('-')
  if (!id || !dims || !ext) return ''
  return `https://cdn.sanity.io/images/r941i081/production/${id}-${dims}.${ext}?w=${width}&q=80&fm=webp`
}

export function renderPortableText(blocks: unknown): string {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return ''

  try {
    return toHTML(blocks, {
      components: {
        block: {
          h1: ({ children }) => `<h2>${children}</h2>`,
          h2: ({ children }) => `<h2>${children}</h2>`,
          h3: ({ children }) => `<h3>${children}</h3>`,
          h4: ({ children }) => `<h4>${children}</h4>`,
          h5: ({ children }) => `<h5>${children}</h5>`,
          normal: ({ children }) => {
            if (!children || children === '') return ''
            return `<p>${children}</p>`
          },
          blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
        },
        marks: {
          strong: ({ children }) => `<strong>${children}</strong>`,
          em: ({ children }) => `<em>${children}</em>`,
          underline: ({ children }) => `<u>${children}</u>`,
          code: ({ children }) => `<code>${children}</code>`,
          link: ({ children, value }) => {
            const href = value?.href || '#'
            const isExternal = href.startsWith('http')
            const rel = isExternal ? ' rel="noopener noreferrer"' : ''
            const target = isExternal ? ' target="_blank"' : ''
            return `<a href="${href}"${target}${rel}>${children}</a>`
          },
          internalLink: ({ children, value }) => {
            const slug = value?.slug?.current || value?.slug || ''
            return `<a href="/article/${slug}">${children}</a>`
          },
        },
        list: {
          bullet: ({ children }) => `<ul>${children}</ul>`,
          number: ({ children }) => `<ol>${children}</ol>`,
        },
        listItem: {
          bullet: ({ children }) => `<li>${children}</li>`,
          number: ({ children }) => `<li>${children}</li>`,
        },
        types: {
          image: ({ value }) => {
            const url = sanityImgUrl(value?.asset?._ref, value?.asset?.url || value?.url)
            if (!url) return ''
            const alt = value?.alt || value?.caption || ''
            const caption = value?.caption ? `<figcaption>${value.caption}</figcaption>` : ''
            return `<figure><img src="${url}" alt="${alt}" loading="lazy" />${caption}</figure>`
          },
          callout: ({ value }) => {
            const text = value?.text || value?.content || value?.body || ''
            const content = typeof text === 'string' ? text : extractText(text)
            const title = value?.title ? `<strong>${value.title}</strong> ` : ''
            return content ? `<aside>${title}${content}</aside>` : ''
          },
          styledQuote: ({ value }) => {
            const quote = value?.quote || value?.text || value?.content || value?.citation || ''
            const text = typeof quote === 'string' ? quote : extractText(quote)
            const author = value?.author ? ` — ${value.author}` : ''
            return text ? `<blockquote><p>${text}</p>${author ? `<footer>${author}</footer>` : ''}</blockquote>` : ''
          },
          quote: ({ value }) => {
            const raw = value?.quote || value?.text || value?.content || value?.citation || value?.body || ''
            const text = typeof raw === 'string' ? raw : extractText(raw)
            const author = value?.author || value?.auteur || ''
            return text ? `<blockquote><p>${text}</p>${author ? `<footer>— ${author}</footer>` : ''}</blockquote>` : ''
          },
          keyTakeaways: ({ value }) => {
            const items = value?.items || value?.points || value?.takeaways || value?.list || []
            if (!Array.isArray(items) || items.length === 0) return ''
            const title = value?.title || 'Points clés'
            const lis = items.map((item: any) => {
              const t = item?.title || item?.heading || ''
              const c = item?.content || item?.body || item?.description || item?.text || ''
              const content = typeof c === 'string' ? c : extractText(c)
              return `<li>${t ? `<strong>${t}</strong> ` : ''}${content}</li>`
            }).join('')
            return `<section><h3>${title}</h3><ul>${lis}</ul></section>`
          },
          accordion: ({ value }) => {
            const items = value?.items || []
            if (!Array.isArray(items) || items.length === 0) return ''
            const dts = items.map((item: any) => {
              const q = item?.title || item?.question || ''
              const raw = item?.content || item?.body || item?.answer || ''
              const a = typeof raw === 'string' ? raw : extractText(raw)
              return `<dt>${q}</dt><dd>${a}</dd>`
            }).join('')
            return `<dl>${dts}</dl>`
          },
          // Skip interactive/non-content types
          youtube: () => '',
          videoEmbed: () => '',
          video: () => '',
          audio: () => '',
          newsletterCta: () => '',
          button: () => '',
          cta: () => '',
          socialEmbed: () => '',
          tweet: () => '',
          affiliateBlock: () => '',
          relatedArticles: () => '',
          imageGallery: ({ value }) => {
            const images = value?.images || []
            if (!Array.isArray(images) || images.length === 0) return ''
            const figs = images.map((img: any) => {
              const url = sanityImgUrl(undefined, img?.imageUrl || img?.asset?.url, 600)
              const alt = img?.caption || img?.alt || ''
              return url ? `<figure><img src="${url}" alt="${alt}" loading="lazy" /></figure>` : ''
            }).join('')
            return `<div>${figs}</div>`
          },
          table: ({ value }) => {
            const rows = value?.rows || []
            if (!Array.isArray(rows) || rows.length === 0) return ''
            const trs = rows.map((row: any, i: number) => {
              const cells = (row?.cells || []).map((cell: string) => {
                const tag = i === 0 ? 'th' : 'td'
                return `<${tag}>${cell}</${tag}>`
              }).join('')
              return `<tr>${cells}</tr>`
            }).join('')
            return `<table>${trs}</table>`
          },
          code: ({ value }) => {
            const code = value?.code || value?.text || ''
            return code ? `<pre><code>${code}</code></pre>` : ''
          },
        },
      },
    })
  } catch (err) {
    console.error('[prerender] Portable Text render error:', err)
    const fallback = extractText(blocks)
    return fallback ? `<p>${fallback}</p>` : ''
  }
}
