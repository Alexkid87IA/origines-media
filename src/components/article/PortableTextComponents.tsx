// src/components/article/PortableTextComponents.tsx
// Configuration PortableText pour les articles - Factory function

import React from 'react';
import { Link } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import {
  ArrowRight, Quote, Info, AlertCircle, CheckCircle, Lightbulb,
  BookOpen, Sparkles, TrendingUp, Heart, Zap, Mail, Target, Star, Key, MapPin, Play
} from 'lucide-react';
import { getImageUrl } from '../../lib/imageUrl';
import { AccordionBlock, extractText } from './Accordion';
import SafeHTML from '../ui/SafeHTML';

interface PortableTextConfig {
  themeColor: string;
  article?: any;
}

// Helper function to convert URLs in text to clickable links
const createLinkifyHelpers = () => {
  const linkifySimpleUrls = (text: string, keyOffset: number): React.ReactNode[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        urlRegex.lastIndex = 0;
        return (
          <a
            key={`simple-${keyOffset}-${index}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-600 hover:text-violet-700 underline transition-colors break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    }).filter(part => part !== '');
  };

  const linkifyText = (text: string): React.ReactNode => {
    const labeledUrlRegex = /([^•\n]+?)\s*:\s*(https?:\/\/[^\s]+)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    labeledUrlRegex.lastIndex = 0;

    while ((match = labeledUrlRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push(...linkifySimpleUrls(beforeText, parts.length));
      }

      const label = match[1].trim();
      const url = match[2];

      parts.push(
        <a
          key={`labeled-${parts.length}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-600 hover:text-violet-700 underline transition-colors"
        >
          {label}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      parts.push(...linkifySimpleUrls(remainingText, parts.length));
    }

    return parts.length > 0 ? parts : text;
  };

  const LinkifyChildren: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const processNode = (node: React.ReactNode): React.ReactNode => {
      if (typeof node === 'string') {
        return linkifyText(node);
      }
      if (Array.isArray(node)) {
        return node.map((child, i) => <React.Fragment key={i}>{processNode(child)}</React.Fragment>);
      }
      if (React.isValidElement(node) && node.props.children) {
        return React.cloneElement(node, {}, processNode(node.props.children));
      }
      return node;
    };
    return <>{processNode(children)}</>;
  };

  return { linkifyText, linkifySimpleUrls, LinkifyChildren };
};

// Helper to get the right icon based on item.icon value
const getIcon = (iconName?: string, size: string = 'w-5 h-5') => {
  switch (iconName) {
    case 'bulb':
    case 'lightbulb':
      return <Lightbulb className={`${size} text-amber-500 flex-shrink-0`} />;
    case 'check':
    case 'checkmark':
      return <CheckCircle className={`${size} text-emerald-500 flex-shrink-0`} />;
    case 'target':
      return <Target className={`${size} text-rose-500 flex-shrink-0`} />;
    case 'star':
      return <Star className={`${size} text-yellow-500 flex-shrink-0`} />;
    case 'key':
      return <Key className={`${size} text-indigo-500 flex-shrink-0`} />;
    case 'pin':
      return <MapPin className={`${size} text-red-500 flex-shrink-0`} />;
    case 'info':
      return <Info className={`${size} text-blue-500 flex-shrink-0`} />;
    case 'alert':
    case 'warning':
      return <AlertCircle className={`${size} text-amber-500 flex-shrink-0`} />;
    case 'sparkle':
    case 'sparkles':
      return <Sparkles className={`${size} text-violet-500 flex-shrink-0`} />;
    default:
      return <CheckCircle className={`${size} text-violet-500 flex-shrink-0`} />;
  }
};

// Factory function to create PortableText components
export const createPortableTextComponents = ({ themeColor, article }: PortableTextConfig) => {
  const { LinkifyChildren } = createLinkifyHelpers();
  const content = article?.contenu || article?.body || [];

  return {
    block: {
      h1: ({ children, value }: any) => {
        const index = content?.findIndex((b: any) => b._key === value._key);
        const id = index !== undefined && index >= 0 ? `heading-${index}` : `heading-${value._key}`;
        return (
          <h1 id={id} className="text-3xl md:text-4xl font-bold text-gray-900 mt-10 mb-6 scroll-mt-24">
            {children}
          </h1>
        );
      },
      h2: ({ children, value }: any) => {
        const index = content?.findIndex((b: any) => b._key === value._key);
        const id = index !== undefined && index >= 0 ? `heading-${index}` : `heading-${value._key}`;
        return (
          <h2 id={id} className="mt-14 mb-6 scroll-mt-24">
            <span className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight block">{children}</span>
            <div
              className="mt-3 h-1 w-16 rounded-full"
              style={{ background: `linear-gradient(to right, ${themeColor}, ${themeColor}40)` }}
            />
          </h2>
        );
      },
      h3: ({ children, value }: any) => {
        const index = content?.findIndex((b: any) => b._key === value._key);
        const id = index !== undefined && index >= 0 ? `heading-${index}` : `heading-${value._key}`;
        return (
          <h3 id={id} className="mt-10 mb-4 scroll-mt-24">
            <span className="text-xl md:text-2xl font-semibold text-gray-800">{children}</span>
            <div
              className="mt-2 h-0.5 w-10 rounded-full"
              style={{ background: `linear-gradient(to right, ${themeColor}80, ${themeColor}20)` }}
            />
          </h3>
        );
      },
      h4: ({ children }: any) => (
        <h4 className="mt-8 mb-3 text-lg font-semibold text-gray-600">
          {children}
        </h4>
      ),
      normal: ({ children }: any) => (
        <p className="text-gray-600 leading-relaxed mb-6 text-lg">
          <LinkifyChildren>{children}</LinkifyChildren>
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 pl-6 py-4 my-8 bg-gray-50 rounded-r-xl" style={{ borderColor: themeColor }}>
          <p className="text-gray-700 italic text-lg">{children}</p>
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
      em: ({ children }: any) => <em className="italic text-violet-600">{children}</em>,
      link: ({ children, value }: any) => {
        const href = value?.href || value?.url || '';
        if (!href) {
          return <span className="text-violet-600">{children}</span>;
        }
        return (
          <a href={href} className="text-violet-600 hover:text-violet-700 underline transition-colors" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      },
      internalLink: ({ children, value }: any) => {
        const slug = value?.slug;
        if (!slug) {
          return <span>{children}</span>;
        }
        return (
          <a
            href={`/article/${slug}`}
            className="text-violet-600 hover:text-violet-700 underline decoration-violet-300 hover:decoration-violet-500 transition-colors"
          >
            {children}
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="space-y-3 mb-6 pl-0 list-none">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="space-y-3 mb-6 pl-0 list-none">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className="flex items-start gap-3 text-gray-700 text-lg leading-relaxed">
          <span className="flex-shrink-0 w-2 h-2 mt-2.5 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          <span className="flex-1"><LinkifyChildren>{children}</LinkifyChildren></span>
        </li>
      ),
      number: ({ children, index }: any) => (
        <li className="flex items-start gap-3 text-gray-700 text-lg leading-relaxed">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
            {(index ?? 0) + 1}
          </span>
          <span className="flex-1"><LinkifyChildren>{children}</LinkifyChildren></span>
        </li>
      ),
    },
    types: {
      image: ({ value }: any) => {
        const imageUrl = value.asset?._ref
          ? getImageUrl(value.asset)
          : (value.asset?.url || value.url);

        if (!imageUrl) return null;

        return (
          <figure className="my-8 flex justify-center">
            <img
              src={imageUrl}
              alt={value.alt || ''}
              className="max-h-[400px] w-auto max-w-full rounded-2xl object-contain"
              loading="lazy"
            />
            {value.caption && (
              <figcaption className="text-center text-gray-500 text-sm mt-3">{value.caption}</figcaption>
            )}
          </figure>
        );
      },

      imageGallery: ({ value }: any) => {
        if (!value?.images?.length) return null;

        const layout = value.layout || 'single';
        const gridClasses: Record<string, string> = {
          'single': 'grid-cols-1',
          'grid-2': 'grid-cols-1 md:grid-cols-2 gap-4',
          'grid-3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
          'carousel': 'grid-cols-1',
          'masonry': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
        };

        return (
          <div className={`my-10 grid ${gridClasses[layout] || gridClasses.single}`}>
            {value.images.map((img: any) => (
              <figure key={img._key} className="relative group">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={img.imageUrl || img.asset?.url}
                    alt={img.caption || img.alt || ''}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {img.caption && (
                  <figcaption className="text-center text-gray-500 text-sm mt-3 italic">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        );
      },

      callout: ({ value }: any) => {
        const types: Record<string, { icon: any; bg: string; border: string; text: string; iconBg: string }> = {
          info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconBg: 'bg-blue-100' },
          warning: { icon: AlertCircle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconBg: 'bg-amber-100' },
          success: { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', iconBg: 'bg-emerald-100' },
          tip: { icon: Lightbulb, bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', iconBg: 'bg-violet-100' },
          remember: { icon: BookOpen, bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', iconBg: 'bg-indigo-100' },
          didyouknow: { icon: Sparkles, bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', iconBg: 'bg-pink-100' },
          key: { icon: Zap, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', iconBg: 'bg-orange-100' },
          testimonial: { icon: Heart, bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', iconBg: 'bg-rose-100' },
          stat: { icon: TrendingUp, bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800', iconBg: 'bg-cyan-100' },
        };
        const style = types[value.type] || types.info;
        const Icon = style.icon;
        const contentValue = value.text || value.content || value.body;
        const isRichText = Array.isArray(contentValue);

        if (value.type === 'stat') {
          return (
            <div className="my-10 p-8 rounded-2xl bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 border border-violet-200/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                {value.title && (
                  <h4 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{value.title}</h4>
                )}
              </div>
              <div className="text-gray-700 leading-relaxed pl-13">
                {isRichText ? <PortableText value={contentValue} /> : <p>{contentValue}</p>}
              </div>
              {value.source && (
                <p className="mt-4 text-sm text-violet-600/70 italic pl-13">Source : {value.source}</p>
              )}
            </div>
          );
        }

        return (
          <div className={`my-8 p-6 rounded-xl border ${style.bg} ${style.border}`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${style.text}`} />
              </div>
              <div className={`${style.text} text-base leading-relaxed flex-1`}>
                {value.title && <p className="font-bold mb-2 text-lg">{value.title}</p>}
                {isRichText ? (
                  <PortableText value={contentValue} />
                ) : contentValue ? (
                  <p>{contentValue}</p>
                ) : null}
                {value.source && (
                  <p className="mt-3 text-sm opacity-70 italic">Source : {value.source}</p>
                )}
              </div>
            </div>
          </div>
        );
      },

      styledQuote: ({ value }: any) => {
        const quoteStyle = value.style || 'classic';

        const renderSource = () => {
          if (!value.source) return null;
          if (value.sourceUrl) {
            return (
              <a
                href={value.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-500 transition-colors underline underline-offset-2"
              >
                {value.source}
              </a>
            );
          }
          return <>{value.source}</>;
        };

        if (quoteStyle === 'testimonial' || value.image) {
          return (
            <figure className="my-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-6">
                {value.image?.asset?.url && (
                  <div className="flex-shrink-0">
                    <img
                      src={value.image.asset.url}
                      alt={value.author || ''}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Quote className="w-8 h-8 text-violet-300 mb-3" />
                  <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed italic mb-4">
                    "{value.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-0.5 bg-violet-300" />
                    <div>
                      {value.author && <p className="font-bold text-gray-900">{value.author}</p>}
                      {value.role && <p className="text-sm text-gray-500">{value.role}</p>}
                      {value.source && <p className="text-xs text-gray-400 mt-1">{renderSource()}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          );
        }

        if (quoteStyle === 'large') {
          return (
            <figure className="my-12 py-8 border-y border-gray-200">
              <blockquote className="text-center">
                <p className="text-2xl md:text-4xl font-medium text-gray-800 leading-relaxed italic max-w-3xl mx-auto">
                  "{value.quote}"
                </p>
              </blockquote>
              {(value.author || value.source) && (
                <figcaption className="mt-6 text-center text-gray-500">
                  {value.author && <span className="font-semibold text-gray-700">{value.author}</span>}
                  {value.role && <span className="text-gray-500">, {value.role}</span>}
                  {value.source && <span className="text-gray-400"> — {renderSource()}</span>}
                </figcaption>
              )}
            </figure>
          );
        }

        if (quoteStyle === 'filled') {
          return (
            <figure className="my-10 p-8 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              <Quote className="w-10 h-10 text-white/30 mb-4" />
              <blockquote>
                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                  "{value.quote}"
                </p>
              </blockquote>
              {(value.author || value.source) && (
                <figcaption className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-0.5 bg-white/50" />
                  <div>
                    {value.author && <span className="font-semibold">{value.author}</span>}
                    {value.role && <span className="opacity-80">, {value.role}</span>}
                  </div>
                </figcaption>
              )}
            </figure>
          );
        }

        if (quoteStyle === 'bordered') {
          return (
            <figure className="my-10 p-6 md:p-8 border-2 border-gray-200 rounded-2xl relative">
              <Quote className="absolute -top-4 left-6 w-8 h-8 text-violet-400 bg-white px-1" />
              <blockquote>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
                  "{value.quote}"
                </p>
              </blockquote>
              {(value.author || value.source) && (
                <figcaption className="mt-4 pt-4 border-t border-gray-100 text-gray-500">
                  {value.author && <span className="font-semibold text-gray-700">{value.author}</span>}
                  {value.role && <span className="text-gray-500">, {value.role}</span>}
                  {value.source && <span className="text-gray-400"> — {renderSource()}</span>}
                </figcaption>
              )}
            </figure>
          );
        }

        // Classic (default)
        return (
          <figure className="my-12 relative">
            <Quote className="absolute -top-4 -left-2 w-12 h-12 text-violet-200" />
            <blockquote className="pl-8 pr-4">
              <p className="text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed italic">
                "{value.quote}"
              </p>
            </blockquote>
            {(value.author || value.source) && (
              <figcaption className="mt-4 pl-8 text-gray-500">
                {value.author && <span className="font-semibold text-gray-700">{value.author}</span>}
                {value.role && <span className="text-gray-500">, {value.role}</span>}
                {value.source && <span className="text-gray-400"> — {renderSource()}</span>}
              </figcaption>
            )}
          </figure>
        );
      },

      accordion: ({ value }: any) => <AccordionBlock value={value} themeColor={themeColor} />,

      keyTakeaways: ({ value }: any) => {
        const items = value.items || value.points || value.takeaways || value.list || value.content || value.bullets || [];
        const style = value.style || 'boxed';

        const renderItem = (item: any, index: number) => {
          const itemIcon = item?.icon;
          const itemTitle = item?.title || item?.heading || item?.label || item?.name;
          const itemContent = item?.content || item?.body || item?.description || item?.text || item?.details || item?.answer;

          if (itemTitle && itemContent) {
            return (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1">{getIcon(itemIcon)}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">{typeof itemTitle === 'string' ? itemTitle : extractText(itemTitle)}</p>
                  <div className="text-gray-600 text-sm">
                    {typeof itemContent === 'string' ? <p>{itemContent}</p> : Array.isArray(itemContent) ? <PortableText value={itemContent} /> : <p>{extractText(itemContent)}</p>}
                  </div>
                </div>
              </li>
            );
          }

          const text = extractText(item) || (typeof item === 'string' ? item : '');
          if (text) {
            return (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5">{getIcon(itemIcon)}</span>
                <span className="text-gray-700">{text}</span>
              </li>
            );
          }

          return null;
        };

        if (style === 'list') {
          return (
            <div className="my-8">
              {value.title && <h4 className="text-lg font-semibold text-gray-900 mb-4">{value.title}</h4>}
              <ul className="space-y-3">
                {Array.isArray(items) && items.map((item: any, index: number) => renderItem(item, index))}
              </ul>
            </div>
          );
        }

        return (
          <div className="my-10 p-6 bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-violet-600" />
              <h4 className="text-lg font-bold text-gray-900">{value.title || 'Points clés à retenir'}</h4>
            </div>
            <ul className="space-y-3">
              {Array.isArray(items) && items.map((item: any, index: number) => renderItem(item, index))}
            </ul>
          </div>
        );
      },

      progressSteps: ({ value }: any) => (
        <div className="my-10">
          {value.title && <h4 className="text-xl font-bold text-gray-900 mb-6">{value.title}</h4>}
          <div className="space-y-4">
            {value.steps?.map((step: { title: string; description: string }, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <h5 className="font-semibold text-gray-900 mb-1">{step.title}</h5>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),

      newsletterCta: ({ value }: any) => (
        <div className="my-12 relative overflow-hidden">
          <div className="relative bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-100/50">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-violet-400/20 rounded-full blur-3xl" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <Mail className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {value.title || 'Restez informé'}
                </h4>
                <p className="text-gray-500 mb-0 max-w-lg">
                  {value.description || 'Inscrivez-vous à notre newsletter.'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  to="/newsletter"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-2xl hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg"
                >
                  <span>{value.buttonText || "S'abonner"}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ),

      youtube: ({ value }: any) => {
        const videoId = value.url?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        return videoId ? (
          <div className="my-10 relative rounded-2xl overflow-hidden aspect-video bg-gray-900">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title={value.title || 'Vidéo'}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null;
      },

      videoEmbed: ({ value }: any) => {
        const url = value.url || value.videoUrl;
        return url ? (
          <div className="my-10 relative rounded-2xl overflow-hidden aspect-video bg-gray-900">
            <iframe
              src={url}
              title={value.title || 'Vidéo'}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null;
      },

      video: ({ value }: any) => {
        const url = value.url || value.asset?.url;
        return url ? (
          <div className="my-10 rounded-2xl overflow-hidden">
            <video controls className="w-full" poster={value.poster}>
              <source src={url} type="video/mp4" />
            </video>
            {value.caption && <p className="text-center text-gray-500 text-sm mt-3">{value.caption}</p>}
          </div>
        ) : null;
      },

      audio: ({ value }: any) => {
        const url = value.url || value.asset?.url;
        return url ? (
          <div className="my-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
            {value.title && <h4 className="font-semibold text-gray-900 mb-3">{value.title}</h4>}
            <audio controls className="w-full">
              <source src={url} type="audio/mpeg" />
            </audio>
          </div>
        ) : null;
      },

      code: ({ value }: any) => (
        <div className="my-8 rounded-2xl overflow-hidden bg-gray-900">
          {value.filename && (
            <div className="px-4 py-2 bg-gray-800 text-gray-400 text-sm font-mono border-b border-gray-700">
              {value.filename}
            </div>
          )}
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-gray-100 font-mono">{value.code}</code>
          </pre>
        </div>
      ),

      table: ({ value }: any) => (
        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                {value.rows?.[0]?.cells?.map((cell: string, i: number) => (
                  <th key={i} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.rows?.slice(1).map((row: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.cells?.map((cell: string, j: number) => (
                    <td key={j} className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),

      gallery: ({ value }: any) => (
        <div className="my-10">
          {value.title && <h4 className="text-lg font-semibold text-gray-900 mb-4">{value.title}</h4>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {value.images?.map((img: any, i: number) => (
              <figure key={i} className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={img.asset?.url || img.url}
                  alt={img.alt || ''}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
          {value.caption && <p className="text-center text-gray-500 text-sm mt-4">{value.caption}</p>}
        </div>
      ),

      divider: () => (
        <hr className="my-12 border-none h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      ),
      break: () => (
        <hr className="my-12 border-none h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      ),

      button: ({ value }: any) => (
        <div className="my-8 text-center">
          <a
            href={value.url || value.link}
            target={value.external ? '_blank' : undefined}
            rel={value.external ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            {value.text || value.label}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ),

      cta: ({ value }: any) => (
        <div className="my-10 p-8 bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl border border-violet-100 text-center">
          {value.title && <h4 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h4>}
          {value.description && <p className="text-gray-600 mb-6">{value.description}</p>}
          <Link
            to={value.url || value.link || '/'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-full hover:bg-violet-700 transition-colors"
          >
            {value.buttonText || value.text || 'En savoir plus'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ),

      socialEmbed: ({ value }: any) => (
        <div className="my-8 flex justify-center">
          <SafeHTML html={value.embed || value.html || ''} className="w-full max-w-lg" />
        </div>
      ),

      tweet: ({ value }: any) => (
        <div className="my-8 flex justify-center">
          <blockquote className="twitter-tweet" data-theme="light">
            <a href={value.url}></a>
          </blockquote>
        </div>
      ),

      file: ({ value }: any) => (
        <a
          href={value.asset?.url || value.url}
          download
          className="my-6 flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{value.title || value.filename || 'Télécharger le fichier'}</p>
            {value.description && <p className="text-sm text-gray-500">{value.description}</p>}
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </a>
      ),

      embed: ({ value }: any) => (
        <div className="my-8 rounded-2xl overflow-hidden aspect-video bg-gray-100">
          <iframe
            src={value.url}
            title={value.title || 'Contenu intégré'}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      ),

      person: ({ value }: any) => (
        <div className="my-8 flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          {value.image && (
            <img src={value.image.asset?.url || value.image} alt={`Portrait de ${value.name || 'l\'auteur'}`} className="w-16 h-16 rounded-full object-cover" />
          )}
          <div>
            <p className="font-semibold text-gray-900">{value.name}</p>
            {value.role && <p className="text-sm text-gray-500">{value.role}</p>}
            {value.bio && <p className="text-sm text-gray-600 mt-2">{value.bio}</p>}
          </div>
        </div>
      ),

      relatedArticles: ({ value }: any) => {
        const articles = value.articles || value.items || [];
        if (!articles.length) return null;

        return (
          <div className="my-10 p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              {value.title || 'Articles recommandés'}
            </h4>
            <div className="grid gap-4">
              {articles.slice(0, 3).map((article: any, index: number) => {
                const slug = article.slug?.current || article.slug;
                const title = article.title || article.titre;
                const image = article.imageUrl || article.mainImage?.asset?.url;

                if (!slug || !title) return null;

                return (
                  <Link
                    key={index}
                    to={`/article/${slug}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    {image && (
                      <img
                        src={image}
                        alt={title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2">
                        {title}
                      </h5>
                      {article.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">{article.excerpt}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-500 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        );
      },

      unknown: ({ value }: any) => {
        if (value.text || value.content) {
          return <p className="text-gray-600 mb-6">{value.text || value.content}</p>;
        }
        return null;
      },
    },
  };
};

export default createPortableTextComponents;
