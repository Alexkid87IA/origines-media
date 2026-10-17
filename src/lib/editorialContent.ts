/** Inline editorial syntax shared by the browser and crawler renderers. No HTML input. */
export type EditorialToken =
  | { type: 'text'; text: string }
  | { type: 'strong' | 'em'; children: EditorialToken[] }
  | { type: 'link'; href: string | null; children: EditorialToken[] };

export function safeEditorialHref(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const href = value.trim();
  return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href) && !/[\u0000-\u0020\\]/.test(href) ? href : null;
}

export function parseEditorialInline(text: string, allowLinks = true): EditorialToken[] {
  const tokens: EditorialToken[] = [];
  let plain = '';
  const flush = () => { if (plain) tokens.push({ type: 'text', text: plain }); plain = ''; };
  for (let i = 0; i < text.length;) {
    if (text[i] === '\\' && /[\\*\[\]()]/.test(text[i + 1] || '')) {
      plain += text[i + 1]; i += 2; continue;
    }
    if (allowLinks && text[i] === '[') {
      const labelEnd = text.indexOf(']', i + 1);
      let start = labelEnd + 1;
      while (labelEnd > i && /[ \t]/.test(text[start] || '')) start++;
      if (labelEnd > i && text[start] === '(') {
        let end = start + 1;
        let depth = 1;
        for (; end < text.length && depth; end++) {
          if (text[end] === '\\') { end++; continue; }
          if (text[end] === '(') depth++;
          if (text[end] === ')') depth--;
        }
        if (!depth) {
          flush();
          tokens.push({ type: 'link', href: safeEditorialHref(text.slice(start + 1, end - 1)),
            children: parseEditorialInline(text.slice(i + 1, labelEnd), false) });
          i = end; continue;
        }
      }
    }
    if (text[i] === '*') {
      const delimiter = text.startsWith('**', i) ? '**' : '*';
      const end = text.indexOf(delimiter, i + delimiter.length);
      if (end > i + delimiter.length) {
        flush();
        tokens.push({ type: delimiter === '**' ? 'strong' : 'em',
          children: parseEditorialInline(text.slice(i + delimiter.length, end), allowLinks) });
        i = end + delimiter.length; continue;
      }
    }
    plain += text[i++];
  }
  flush();
  return tokens;
}

// Legacy CHECKLIST tags may occupy one multiline block or several Portable Text blocks.
// Keep spans and markDefs intact so converting the wrapper never loses source links.
type Span = { _type: string; _key?: string; text?: string; marks?: string[] };
type Block = { _type: string; _key?: string; style?: string; listItem?: string; children?: Span[]; [key: string]: unknown };
const blockText = (block: Block) => (block.children || []).map(span => span.text || '').join('');
export function normalizeEditorialBlocks<T>(input: T[]): T[] {
  const blocks = input as unknown as Block[];
  const lines = blocks.flatMap(block => {
    const text = blockText(block);
    if (block._type !== 'block' || !text.includes('[CHECKLIST') || !text.includes('\n')) return [block];
    let offset = 0;
    return text.split('\n').map((line, index) => {
      const start = offset;
      offset += line.length + 1;
      let position = 0;
      const children = (block.children || []).flatMap(span => {
        const content = span.text || '';
        const from = Math.max(0, start - position);
        const to = Math.min(content.length, start + line.length - position);
        position += content.length;
        return to > from ? [{ ...span, text: content.slice(from, to) }] : [];
      });
      return { ...block, _key: `${block._key || 'checklist'}-line-${index}`, children };
    });
  });
  const result: Block[] = [];
  for (let i = 0; i < lines.length; i++) {
    const block = lines[i];
    const opening = block._type === 'block' && block.style !== 'code'
      ? blockText(block).trim().match(/^\[CHECKLIST(?:\s+(?:titre|title)="([^"]*)")?\]$/) : null;
    if (!opening) { result.push(block); continue; }
    let end = i + 1;
    while (end < lines.length && lines[end]._type === 'block' && !/^\[\/?CHECKLIST\b/.test(blockText(lines[end]).trim())) end++;
    if (end >= lines.length || blockText(lines[end]).trim() !== '[/CHECKLIST]') {
      result.push(block); continue;
    }
    const items = lines.slice(i + 1, end).filter(item => blockText(item).trim()).map((item, index) => {
      let skip = blockText(item).match(/^\s*(?:[-*]\s+(?:\[[ xX]\]\s*)?)/)?.[0].length || 0;
      const children = (item.children || []).map(span => {
        const text = span.text || '';
        const trimmed = text.slice(skip);
        skip = Math.max(0, skip - text.length);
        return { ...span, text: trimmed };
      });
      return { _key: `${block._key || i}-item-${index}`, text: [{ ...item, listItem: undefined, style: 'normal', children }] };
    });
    result.push({ _type: 'checklist', _key: block._key || `legacy-checklist-${i}`, title: opening[1] || 'Checklist', items });
    i = end;
  }
  return result as unknown as T[];
}
