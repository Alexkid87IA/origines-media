import React from 'react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { parseEditorialInline, safeEditorialHref, type EditorialToken } from '../../lib/editorialContent';
import s from './PortableTextV2.module.css';

function renderTokens(tokens: EditorialToken[]): React.ReactNode[] {
  return tokens.map((token, index) => {
    if (token.type === 'text') return token.text;
    const children = renderTokens(token.children);
    if (token.type === 'strong') return <strong key={index}>{children}</strong>;
    if (token.type === 'em') return <em key={index}>{children}</em>;
    if (token.type === 'link') return <EditorialLink key={index} href={token.href}>{children}</EditorialLink>;
    return null;
  });
}

export function EditorialLink({ href, children }: { href: unknown; children: React.ReactNode }) {
  const safe = safeEditorialHref(href);
  if (!safe) return <>{children}</>;
  const external = /^https?:/i.test(safe);
  return <a href={safe} className={s.link} target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}>{children}</a>;
}

export function parseInlineMarkdown(text: string, emphasizeLead = false): React.ReactNode[] {
  // Only emphasize an existing numeric introduction; never infer or rewrite figures.
  const lead = emphasizeLead ? text.match(/^(\d[^:\n]{0,140})(\s:\s)/) : null;
  if (lead) return [<strong key="figure">{renderTokens(parseEditorialInline(lead[1]))}</strong>,
    ...renderTokens(parseEditorialInline(text.slice(lead[1].length)))];
  return renderTokens(parseEditorialInline(text));
}

function InlineChildren({ children }: { children: React.ReactNode }): React.ReactElement {
  return <>{React.Children.map(children, child => typeof child === 'string' ? parseInlineMarkdown(child) : child)}</>;
}

const components: Partial<PortableTextComponents> = {
  block: { normal: ({ children }) => <p><InlineChildren>{children}</InlineChildren></p> },
  listItem: { bullet: ({ children }) => <li><InlineChildren>{children}</InlineChildren></li>,
    number: ({ children }) => <li><InlineChildren>{children}</InlineChildren></li> },
  marks: {
    strong: ({ children }) => <strong><InlineChildren>{children}</InlineChildren></strong>,
    em: ({ children }) => <em><InlineChildren>{children}</InlineChildren></em>,
    link: ({ children, value }) => <EditorialLink href={value?.missingArticle ? null : value?.href || value?.url}>{children}</EditorialLink>,
    internalLink: ({ children, value }) => {
      const slug = value?.slug?.current || value?.slug || value?.reference?.slug?.current;
      return <EditorialLink href={typeof slug === 'string' ? `/article/${slug}` : null}>{children}</EditorialLink>;
    },
  },
};

export function EditorialText({ value, emphasizeLead = false }: { value: unknown; emphasizeLead?: boolean }) {
  if (typeof value === 'string') return <>{value.split(/\n\s*\n/).map((paragraph, i) =>
    <p key={i}>{parseInlineMarkdown(paragraph, emphasizeLead)}</p>)}</>;
  if (Array.isArray(value)) return <PortableText value={value} components={components} />;
  if (value && typeof value === 'object' && '_type' in value && typeof value._type === 'string') return <PortableText value={[{ ...value, _type: value._type }]} components={components} />;
  return null;
}
