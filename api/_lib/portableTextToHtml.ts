import { parseEditorialInline, safeEditorialHref, normalizeEditorialBlocks, type EditorialToken } from "../../src/lib/editorialContent.js";

function esc(t: string): string {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

const safeHref = safeEditorialHref;

function renderTokens(tokens: EditorialToken[]): string {
  return tokens.map(token => {
    if (token.type === 'text') return esc(token.text);
    const content = renderTokens(token.children);
    if (token.type === 'link') return token.href ? `<a href="${esc(token.href)}">${content}</a>` : content;
    return `<${token.type}>${content}</${token.type}>`;
  }).join('');
}

function renderContent(value: unknown): string {
  if (Array.isArray(value)) return renderPortableText(value);
  if (value && typeof value === 'object' && '_type' in value) return renderPortableText([value]);
  return typeof value === 'string' ? renderTokens(parseEditorialInline(value)) : '';
}

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

const SKIP_TYPES = new Set([
  'youtube', 'videoEmbed', 'video', 'audio',
  'newsletterCta', 'button', 'cta',
  'socialEmbed', 'tweet', 'affiliateBlock', 'relatedArticles',
])

function renderSpan(span: any, markDefs: any[]): string {
  const annotated = (span.marks || []).some((mark: string) => mark === 'code' || markDefs.some((def: any) => def._key === mark && /^(link|internalLink)$/.test(def._type)));
  let text = annotated ? esc(span.text || '') : renderContent(span.text || '')
  if (!span.marks?.length) return text

  for (const mark of span.marks) {
    switch (mark) {
      case 'strong': text = `<strong>${text}</strong>`; break
      case 'em': text = `<em>${text}</em>`; break
      case 'underline': text = `<u>${text}</u>`; break
      case 'code': text = `<code>${text}</code>`; break
      default: {
        const def = markDefs.find((d: any) => d._key === mark)
        if (def?._type === 'link') {
          if (def.missingArticle === true) break
          const href = safeHref(def.href)
          if (!href) break
          const ext = href.startsWith('http')
          text = `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`
        } else if (def?._type === 'internalLink') {
          const slug = def.slug?.current || def.slug || ''
          if (slug) text = `<a href="/article/${esc(slug)}">${text}</a>`
        }
      }
    }
  }
  return text
}

function renderBlock(block: any): string {
  const children = (block.children || []).map((s: any) => renderSpan(s, block.markDefs || [])).join('')
  if (!children) return ''

  switch (block.style) {
    case 'h1': case 'h2': return `<h2>${children}</h2>`
    case 'h3': return `<h3>${children}</h3>`
    case 'h4': return `<h4>${children}</h4>`
    case 'h5': return `<h5>${children}</h5>`
    case 'blockquote': return `<blockquote>${children}</blockquote>`
    default: return `<p>${children}</p>`
  }
}

function renderCustomType(block: any): string {
  const type = block._type
  if (SKIP_TYPES.has(type)) return ''

  switch (type) {
    case 'image': {
      const url = sanityImgUrl(block.asset?._ref, block.asset?.url || block.url)
      if (!url) return ''
      const alt = esc(block.alt || block.caption || '')
      const caption = block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ''
      return `<figure><img src="${url}" alt="${alt}" loading="lazy" />${caption}</figure>`
    }
    case 'callout': {
      const raw = block.text || block.content || block.body || block.contenu || block.texte || ''
      const content = renderContent(raw)
      if (!content) return ''
      const title = block.title ? `<strong>${esc(block.title)}</strong> ` : ''
      const sourceHref = safeHref(block.sourceUrl || block.source)
      const source = block.source ? `<p>Source : ${sourceHref ? `<a href="${esc(sourceHref)}">${esc(block.source)}</a>` : renderContent(block.source)}</p>` : ''
      return `<aside>${title}${content}${source}</aside>`
    }
    case 'styledQuote': case 'quote': {
      const raw = block.quote || block.text || block.content || block.citation || block.body || ''
      const text = typeof raw === 'string' ? raw : extractText(raw)
      if (!text) return ''
      const author = block.author || block.auteur || ''
      return `<blockquote><p>${esc(text)}</p>${author ? `<footer>${esc(author)}</footer>` : ''}</blockquote>`
    }
    case 'keyTakeaways': {
      const items = block.items || block.points || block.takeaways || block.list || block.content || block.bullets || block.essentiels || block.keys || block.highlights || block.children || []
      if (!Array.isArray(items) || items.length === 0) return ''
      const title = block.title || 'Points clés'
      const lis = items.map((item: any) => {
        const t = item?.title || item?.heading || item?.label || item?.name || ''
        const raw = item?._type === 'block' ? [item] : typeof item === 'string' || Array.isArray(item) ? item : item?.content || item?.body || item?.description || item?.text || item?.point || item?.details || item?.answer || ''
        const c = renderContent(raw)
        return `<li>${t ? `<strong>${esc(t)}</strong> ` : ''}${c}</li>`
      }).join('')
      return `<section><h3>${esc(title)}</h3><ul>${lis}</ul></section>`
    }
    case 'checklist': {
      const items = Array.isArray(block.items) ? block.items : [];
      return `<section><h3>${esc(block.title || block.titre || 'Checklist')}</h3><ul>${items.map((item: any) =>
        `<li>${renderContent(typeof item === 'string' ? item : item.text || item.texte || item.content)}</li>`).join('')}</ul></section>`;
    }
    case 'accordion': {
      const items = block.items || block.accordions || block.sections || []
      if (!Array.isArray(items) || items.length === 0) return ''
      const dts = items.map((item: any) => {
        const q = item.title || item.question || ''
        const raw = item.content || item.body || item.answer || ''
        const a = renderContent(raw)
        return `<dt>${esc(q)}</dt><dd>${a}</dd>`
      }).join('')
      return `<dl>${dts}</dl>`
    }
    case 'imageGallery': {
      const images = block.images || []
      if (!Array.isArray(images) || images.length === 0) return ''
      const figs = images.map((img: any) => {
        const url = sanityImgUrl(undefined, img.imageUrl || img.asset?.url, 600)
        const alt = esc(img.caption || img.alt || '')
        return url ? `<figure><img src="${url}" alt="${alt}" loading="lazy" /></figure>` : ''
      }).join('')
      return `<div>${figs}</div>`
    }
    case 'table': {
      const rows = block.rows || []
      if (!Array.isArray(rows) || rows.length === 0) return ''
      const trs = rows.map((row: any, i: number) => {
        const cells = (row.cells || []).map((cell: string) => {
          const tag = i === 0 ? 'th' : 'td'
          return `<${tag}>${esc(cell)}</${tag}>`
        }).join('')
        return `<tr>${cells}</tr>`
      }).join('')
      return `<table>${trs}</table>`
    }
    case 'code': {
      const code = block.code || block.text || ''
      return code ? `<pre><code>${esc(code)}</code></pre>` : ''
    }
    default: return ''
  }
}

export function renderPortableText(blocks: unknown): string {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return ''

  try {
    const out: string[] = []
    let listType: string | null = null

    for (const block of normalizeEditorialBlocks(blocks)) {
      if (block._type === 'block' && block.listItem) {
        const tag = block.listItem === 'number' ? 'ol' : 'ul'
        if (listType !== tag) {
          if (listType) out.push(`</${listType}>`)
          out.push(`<${tag}>`)
          listType = tag
        }
        const children = (block.children || []).map((s: any) => renderSpan(s, block.markDefs || [])).join('')
        out.push(`<li>${children}</li>`)
        continue
      }

      if (listType) {
        out.push(`</${listType}>`)
        listType = null
      }

      if (block._type === 'block') {
        const html = renderBlock(block)
        if (html) out.push(html)
      } else {
        const html = renderCustomType(block)
        if (html) out.push(html)
      }
    }

    if (listType) out.push(`</${listType}>`)
    return out.join('\n')
  } catch (err) {
    console.error('[prerender] Portable Text render error:', err)
    const fallback = extractText(blocks)
    return fallback ? `<p>${esc(fallback)}</p>` : ''
  }
}
