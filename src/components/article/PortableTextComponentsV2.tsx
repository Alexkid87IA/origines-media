import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "../../lib/imageUrl";
import { sanityImg } from "../../lib/sanityImage";
import { extractText } from "./Accordion";
import SafeHTML from "../ui/SafeHTML";
import s from "./PortableTextV2.module.css";

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    return part;
  });
}

interface PortableTextConfig {
  themeColor: string;
  article?: any;
}

/* ------------------------------------------------------------------ */
/*  Linkify helpers (unchanged logic, V2 styles)                       */
/* ------------------------------------------------------------------ */

const createLinkifyHelpers = () => {
  const linkifySimpleUrls = (
    text: string,
    keyOffset: number
  ): React.ReactNode[] => {
    const combinedRegex =
      /(https?:\/\/[^\s]+)|(\b[a-zA-Z0-9-]+\.(?:fr|org|com|net|io|co|eu|be|ch|ca|uk|de|es|it|nl|pt|info|gov|edu|biz)\b)/g;
    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    combinedRegex.lastIndex = 0;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push(text.slice(lastIndex, match.index));
      }
      const fullUrl = match[1];
      const domain = match[2];
      if (fullUrl) {
        result.push(
          <a
            key={`url-${keyOffset}-${match.index}`}
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={s.link}
          >
            {fullUrl}
          </a>
        );
      } else if (domain) {
        result.push(
          <a
            key={`domain-${keyOffset}-${match.index}`}
            href={`https://${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className={s.link}
          >
            {domain}
          </a>
        );
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result.length > 0 ? result : [text];
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
          className={s.link}
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

  const LinkifyChildren: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    const processNode = (node: React.ReactNode): React.ReactNode => {
      if (typeof node === "string") return linkifyText(node);
      if (Array.isArray(node))
        return node.map((child, i) => (
          <React.Fragment key={i}>{processNode(child)}</React.Fragment>
        ));
      if (React.isValidElement(node) && node.props.children)
        return React.cloneElement(node, {}, processNode(node.props.children));
      return node;
    };
    return <>{processNode(children)}</>;
  };

  return { linkifyText, LinkifyChildren };
};

const linkifySource = (source: string, sourceUrl?: string): React.ReactNode => {
  if (!source) return null;
  if (sourceUrl) {
    return (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className={s.link}>
        {source}
      </a>
    );
  }
  const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  if (source.match(/^https?:\/\//)) {
    return (
      <a href={source} target="_blank" rel="noopener noreferrer" className={s.link}>
        {source.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      </a>
    );
  }
  if (domainPattern.test(source.trim())) {
    return (
      <a href={`https://${source.trim()}`} target="_blank" rel="noopener noreferrer" className={s.link}>
        {source}
      </a>
    );
  }
  return <>{source}</>;
};

/* ------------------------------------------------------------------ */
/*  Icon helper                                                        */
/* ------------------------------------------------------------------ */

const getIconSvg = (iconName?: string) => {
  const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (iconName) {
    case "bulb":
    case "lightbulb":
      return (
        <svg {...base}>
          <path d="M9.66 17h4.68M11 20h2" />
          <path d="M12 2a7 7 0 0 0-3.5 13.06V17a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-1.94A7 7 0 0 0 12 2z" />
        </svg>
      );
    case "check":
    case "checkmark":
    case "success":
      return (
        <svg {...base}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      );
    case "target":
      return (
        <svg {...base}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "star":
      return (
        <svg {...base}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "key":
      return (
        <svg {...base}>
          <path d="M15.5 7.5l3 3L22 7l-3-3" />
          <path d="M21 2l-9.6 9.6" />
          <circle cx="7.5" cy="16.5" r="4.5" />
        </svg>
      );
    case "info":
      return (
        <svg {...base}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      );
    case "alert":
    case "warning":
      return (
        <svg {...base}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "sparkle":
    case "sparkles":
      return (
        <svg {...base}>
          <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
          <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1z" />
        </svg>
      );
    case "remember":
      return (
        <svg {...base}>
          <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
          <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
          <path d="M12 12v1.5" />
        </svg>
      );
    default:
      return (
        <svg {...base}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      );
  }
};

/* ------------------------------------------------------------------ */
/*  V2 Accordion components                                            */
/* ------------------------------------------------------------------ */

function AccordionItemV2({
  question,
  answer,
  defaultOpen = false,
  index,
  style = "simple",
  isLast = false,
}: {
  question: string;
  answer: any;
  defaultOpen?: boolean;
  index?: number;
  style?: string;
  isLast?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const renderAnswer = () => {
    if (!answer) return null;
    if (typeof answer === "string")
      return <p className={s.accordionAnswerText}>{answer}</p>;
    if (Array.isArray(answer)) {
      const hasPortableText = answer.some((item: any) => item?._type);
      if (hasPortableText)
        return (
          <div className={s.accordionAnswerText}>
            <PortableText value={answer} />
          </div>
        );
    }
    if (answer?._type === "block")
      return (
        <div className={s.accordionAnswerText}>
          <PortableText value={[answer]} />
        </div>
      );
    const text = extractText(answer);
    return text ? <p className={s.accordionAnswerText}>{text}</p> : null;
  };

  return (
    <div className={!isLast ? s.accordionItem : undefined}>
      <button
        className={isOpen ? s.accordionBtnOpen : s.accordionBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={s.accordionBtnContent}>
          {style === "numbered" && index !== undefined && (
            <span className={isOpen ? s.accordionNumOpen : s.accordionNum}>
              {index + 1}
            </span>
          )}
          <span className={s.accordionQuestion}>{question}</span>
        </div>
        <span className={isOpen ? s.accordionChevronOpen : s.accordionChevron}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div
              className={
                style === "numbered"
                  ? s.accordionAnswerNumbered
                  : s.accordionAnswer
              }
            >
              {renderAnswer()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SingleAccordionV2({ value }: { value: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const rawTitle =
    value.title || value.heading || value.question || value.label || "Voir plus";
  const rawContent =
    value.content || value.body || value.answer || value.text || value.description;
  const title = typeof rawTitle === "string" ? rawTitle : extractText(rawTitle);

  const renderContent = () => {
    if (!rawContent) return null;
    if (typeof rawContent === "string")
      return <p className={s.accordionAnswerText}>{rawContent}</p>;
    if (Array.isArray(rawContent)) {
      const hasPortableText = rawContent.some((item: any) => item?._type);
      if (hasPortableText)
        return (
          <div className={s.accordionAnswerText}>
            <PortableText value={rawContent} />
          </div>
        );
    }
    const text = extractText(rawContent);
    return text ? <p className={s.accordionAnswerText}>{text}</p> : null;
  };

  return (
    <div className={s.singleAccordion}>
      <button
        className={isOpen ? s.singleAccordionBtnOpen : s.singleAccordionBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={s.accordionBtnContent}>
          <span
            className={
              isOpen ? s.singleAccordionIconOpen : s.singleAccordionIcon
            }
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className={s.accordionQuestion}>{title}</span>
        </div>
        <span className={isOpen ? s.accordionChevronOpen : s.accordionChevron}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div className={s.accordionAnswer}>{renderContent()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AccordionBlockV2({ value }: { value: any }) {
  const items = value.items || value.accordions || value.sections || [];
  const groupTitle = value.title || value.heading;
  const style = value.style || "simple";

  if (Array.isArray(items) && items.length > 0) {
    return (
      <div style={{ margin: "40px 0" }}>
        {groupTitle && (
          <div className={s.accordionGroupTitle}>
            <div className={s.accordionGroupBar} />
            <h4 className={s.accordionGroupLabel}>{groupTitle}</h4>
          </div>
        )}
        <div className={s.accordion}>
          {items.map((item: any, index: number) => (
            <AccordionItemV2
              key={item._key || index}
              question={
                item.question ||
                item.title ||
                item.heading ||
                `Question ${index + 1}`
              }
              answer={item.answer || item.content || item.body || item.text}
              defaultOpen={item.defaultOpen || false}
              index={index}
              style={style}
              isLast={index === items.length - 1}
            />
          ))}
        </div>
      </div>
    );
  }

  return <SingleAccordionV2 value={value} />;
}

/* ------------------------------------------------------------------ */
/*  Factory                                                            */
/* ------------------------------------------------------------------ */

export const createPortableTextComponentsV2 = ({
  themeColor,
  article,
}: PortableTextConfig) => {
  const { LinkifyChildren } = createLinkifyHelpers();
  const content = article?.contenu || article?.body || [];

  return {
    block: {
      h1: ({ children, value }: any) => {
        const index = content?.findIndex((b: any) => b._key === value._key);
        const id =
          index !== undefined && index >= 0
            ? `heading-${index}`
            : `heading-${value._key}`;
        return (
          <h2 id={id} className={s.h1}>
            {children}
          </h2>
        );
      },
      h2: ({ children, value }: any) => {
        const index = content?.findIndex((b: any) => b._key === value._key);
        const id =
          index !== undefined && index >= 0
            ? `heading-${index}`
            : `heading-${value._key}`;
        return (
          <h2 id={id} className={s.h2}>
            <span>{children}</span>
            <span className={s.h2Bar} />
          </h2>
        );
      },
      h3: ({ children, value }: any) => {
        const index = content?.findIndex((b: any) => b._key === value._key);
        const id =
          index !== undefined && index >= 0
            ? `heading-${index}`
            : `heading-${value._key}`;
        return (
          <h3 id={id} className={s.h3}>
            <span>{children}</span>
            <span className={s.h3Bar} />
          </h3>
        );
      },
      h4: ({ children }: any) => <h4 className={s.h4}>{children}</h4>,
      normal: ({ children }: any) => (
        <p className={s.paragraph}>
          <LinkifyChildren>{children}</LinkifyChildren>
        </p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className={s.blockquote}>
          <p className={s.blockquoteText}>{children}</p>
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className={s.strong}>{children}</strong>
      ),
      em: ({ children }: any) => <em className={s.em}>{children}</em>,
      link: ({ children, value }: any) => {
        const href = value?.href || value?.url || "";
        if (!href) return <span className={s.strong}>{children}</span>;
        return (
          <a
            href={href}
            className={s.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      },
      internalLink: ({ children, value }: any) => {
        const slug = value?.slug;
        if (!slug) return <span>{children}</span>;
        return (
          <a href={`/article/${slug}`} className={s.link}>
            {children}
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className={s.bulletList}>{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className={s.numberList}>{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className={s.bulletItem}>
          <span className={s.bulletDot} />
          <span className={s.listContent}>
            <LinkifyChildren>{children}</LinkifyChildren>
          </span>
        </li>
      ),
      number: ({ children, index }: any) => (
        <li className={s.numberItem}>
          <span className={s.numberBadge}>{(index ?? 0) + 1}</span>
          <span className={s.listContent}>
            <LinkifyChildren>{children}</LinkifyChildren>
          </span>
        </li>
      ),
    },
    types: {
      image: ({ value }: any) => {
        const imageUrl = value.asset?._ref
          ? getImageUrl(value.asset)
          : value.asset?.url || value.url;
        if (!imageUrl) return null;
        return (
          <figure className={s.figure}>
            <img
              src={imageUrl}
              alt={value.alt || value.caption || ""}
              className={s.figureImg}
              loading="lazy"
            />
            {value.caption && (
              <figcaption className={s.figCaption}>{value.caption}</figcaption>
            )}
          </figure>
        );
      },

      imageGallery: ({ value }: any) => {
        if (!value?.images?.length) return null;
        const layout = value.layout || "single";
        const gridClass =
          layout === "grid-3"
            ? s.galleryGrid3
            : layout === "grid-2"
              ? s.galleryGrid2
              : s.galleryGrid1;
        return (
          <div className={s.gallery}>
            <div className={`${s.galleryGrid} ${gridClass}`}>
              {value.images.map((img: any) => (
                <figure key={img._key} className={s.galleryItem}>
                  <img
                    src={sanityImg(img.imageUrl || img.asset?.url, 600)}
                    alt={img.caption || img.alt || ""}
                    loading="lazy"
                    className={s.galleryImg}
                  />
                  {img.caption && (
                    <figcaption className={s.galleryCaption}>
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        );
      },

      callout: ({ value }: any) => {
        const contentValue = value.text || value.content || value.body;
        const isRichText = Array.isArray(contentValue);

        if (value.type === "stat") {
          return (
            <div className={s.calloutStat}>
              <div className={s.calloutStatHead}>
                <span className={s.calloutStatIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18" height="18">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </span>
                {value.title && (
                  <h4 className={s.calloutStatTitle}>{value.title}</h4>
                )}
              </div>
              <div className={s.calloutStatBody}>
                <div className={s.calloutText}>
                  {isRichText ? (
                    <PortableText value={contentValue} />
                  ) : contentValue ? (
                    <p>{parseInlineMarkdown(contentValue)}</p>
                  ) : null}
                </div>
                {value.source && (
                  <p className={s.calloutSource}>
                    Source : {linkifySource(value.source, value.sourceUrl)}
                  </p>
                )}
              </div>
            </div>
          );
        }

        const typeClass: Record<string, string> = {
          info: s.calloutInfo,
          warning: s.calloutWarning,
          alert: s.calloutWarning,
          success: s.calloutSuccess,
          tip: s.calloutTip,
          bulb: s.calloutTip,
          lightbulb: s.calloutTip,
          remember: s.calloutRemember,
          note: s.calloutInfo,
        };
        const variantClass = typeClass[value.type || "info"] || s.calloutInfo;

        return (
          <div className={`${s.callout} ${variantClass}`}>
            <span className={s.calloutAccent} />
            <div className={s.calloutInner}>
              <span className={s.calloutIcon}>
                {getIconSvg(value.type || "info")}
              </span>
              <div className={s.calloutBody}>
                {value.title && (
                  <p className={s.calloutTitle}>{value.title}</p>
                )}
                <div className={s.calloutText}>
                  {isRichText ? (
                    <PortableText value={contentValue} />
                  ) : contentValue ? (
                    <p>{parseInlineMarkdown(contentValue)}</p>
                  ) : null}
                </div>
                {value.source && (
                  <p className={s.calloutSource}>
                    Source : {linkifySource(value.source, value.sourceUrl)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      },

      styledQuote: ({ value }: any) => {
        const rawQuote =
          value.quote ||
          value.text ||
          value.content ||
          value.citation ||
          value.body ||
          "";
        const quoteText =
          typeof rawQuote === "string" ? rawQuote : extractText(rawQuote);
        const quoteStyle = value.style || "classic";
        const renderSource = () =>
          linkifySource(value.source, value.sourceUrl);

        if (quoteStyle === "testimonial" || value.image) {
          return (
            <figure className={s.quoteTestimonial}>
              <div className={s.quoteTestimonialInner}>
                {value.image?.asset?.url && (
                  <img
                    src={value.image.asset.url}
                    alt={value.author || ""}
                    className={s.quoteTestimonialImg}
                  />
                )}
                <div className={s.quoteTestimonialContent}>
                  <blockquote>
                    <p className={s.blockquoteText}>
                      &laquo;&nbsp;{quoteText}&nbsp;&raquo;
                    </p>
                  </blockquote>
                  <div className={s.quoteFoot} style={{ paddingLeft: 0 }}>
                    <span className={s.quoteFootBar} />
                    <div>
                      {value.author && (
                        <span className={s.quoteAuthor}>{value.author}</span>
                      )}
                      {value.role && (
                        <span className={s.quoteRole}>, {value.role}</span>
                      )}
                      {value.source && (
                        <span className={s.quoteSource}>
                          {" "}
                          &mdash; {renderSource()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          );
        }

        if (quoteStyle === "large") {
          return (
            <figure className={s.quoteLarge}>
              <blockquote>
                <p className={s.quoteLargeText}>
                  &laquo;&nbsp;{quoteText}&nbsp;&raquo;
                </p>
              </blockquote>
              {(value.author || value.source) && (
                <figcaption className={s.quoteLargeFoot}>
                  {value.author && (
                    <strong>{value.author}</strong>
                  )}
                  {value.role && <span>, {value.role}</span>}
                  {value.source && (
                    <span> &mdash; {renderSource()}</span>
                  )}
                </figcaption>
              )}
            </figure>
          );
        }

        if (quoteStyle === "filled") {
          return (
            <figure className={s.quoteFilled}>
              <blockquote>
                <p className={s.quoteFilledText}>
                  &laquo;&nbsp;{quoteText}&nbsp;&raquo;
                </p>
              </blockquote>
              {(value.author || value.source) && (
                <figcaption className={s.quoteFilledFoot}>
                  <span className={s.quoteFilledBar} />
                  <div>
                    {value.author && (
                      <span className={s.quoteFilledAuthor}>
                        {value.author}
                      </span>
                    )}
                    {value.role && (
                      <span className={s.quoteFilledRole}>
                        , {value.role}
                      </span>
                    )}
                  </div>
                </figcaption>
              )}
            </figure>
          );
        }

        if (quoteStyle === "bordered") {
          return (
            <figure className={s.quoteBordered}>
              <span className={s.quoteBorderedGlyph}>&ldquo;</span>
              <blockquote>
                <p className={s.blockquoteText}>
                  &laquo;&nbsp;{quoteText}&nbsp;&raquo;
                </p>
              </blockquote>
              {(value.author || value.source) && (
                <figcaption className={s.quoteFoot} style={{ paddingLeft: 0, marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--stone200)" }}>
                  <span className={s.quoteFootBar} />
                  <div>
                    {value.author && (
                      <span className={s.quoteAuthor}>{value.author}</span>
                    )}
                    {value.role && (
                      <span className={s.quoteRole}>, {value.role}</span>
                    )}
                    {value.source && (
                      <span className={s.quoteSource}>
                        {" "}
                        &mdash; {renderSource()}
                      </span>
                    )}
                  </div>
                </figcaption>
              )}
            </figure>
          );
        }

        return (
          <figure className={s.quote}>
            <span className={s.quoteGlyph}>&ldquo;</span>
            <blockquote>
              <p className={s.quoteText}>
                &laquo;&nbsp;{quoteText}&nbsp;&raquo;
              </p>
            </blockquote>
            {(value.author || value.source) && (
              <figcaption className={s.quoteFoot}>
                <span className={s.quoteFootBar} />
                <div>
                  {value.author && (
                    <span className={s.quoteAuthor}>{value.author}</span>
                  )}
                  {value.role && (
                    <span className={s.quoteRole}>, {value.role}</span>
                  )}
                  {value.source && (
                    <span className={s.quoteSource}>
                      {" "}
                      &mdash; {renderSource()}
                    </span>
                  )}
                </div>
              </figcaption>
            )}
          </figure>
        );
      },

      accordion: ({ value }: any) => <AccordionBlockV2 value={value} />,

      quote: ({ value }: any) => {
        const rawQuote =
          value.quote ||
          value.text ||
          value.content ||
          value.citation ||
          value.body ||
          value.children ||
          "";
        const author = value.author || value.auteur || "";
        const role = value.role || value.titre || value.title || "";
        const source = value.source || "";
        const sourceUrl = value.sourceUrl || value.url || "";
        const isPortableText =
          Array.isArray(rawQuote) &&
          rawQuote.some((item: any) => item?._type);
        const quoteText = isPortableText
          ? ""
          : typeof rawQuote === "string"
            ? rawQuote
            : extractText(rawQuote);

        return (
          <figure className={s.quote}>
            <span className={s.quoteGlyph}>&ldquo;</span>
            <blockquote>
              {isPortableText ? (
                <div className={s.quoteText}>
                  <PortableText value={rawQuote} />
                </div>
              ) : (
                <p className={s.quoteText}>
                  &laquo;&nbsp;{quoteText}&nbsp;&raquo;
                </p>
              )}
            </blockquote>
            {(author || source) && (
              <figcaption className={s.quoteFoot}>
                <span className={s.quoteFootBar} />
                <div>
                  {author && (
                    <span className={s.quoteAuthor}>{author}</span>
                  )}
                  {role && <span className={s.quoteRole}>, {role}</span>}
                  {source && (
                    <span className={s.quoteSource}>
                      {" "}
                      &mdash; {linkifySource(source, sourceUrl)}
                    </span>
                  )}
                </div>
              </figcaption>
            )}
          </figure>
        );
      },

      keyTakeaways: ({ value }: any) => {
        const items =
          value.items ||
          value.points ||
          value.takeaways ||
          value.list ||
          value.content ||
          value.bullets ||
          value.essentiels ||
          value.keys ||
          value.highlights ||
          value.children ||
          [];

        const renderItem = (item: any, index: number) => {
          const itemIcon = item?.icon;
          const itemTitle =
            item?.title || item?.heading || item?.label || item?.name;
          const itemContent =
            item?.content ||
            item?.body ||
            item?.description ||
            item?.text ||
            item?.point ||
            item?.details ||
            item?.answer;

          if (itemTitle && itemContent) {
            return (
              <li key={index} className={s.takeawaysItem}>
                <span className={s.takeawaysItemIcon}>
                  {getIconSvg(itemIcon)}
                </span>
                <div>
                  <p className={s.takeawaysItemTitle}>
                    {typeof itemTitle === "string"
                      ? parseInlineMarkdown(itemTitle)
                      : extractText(itemTitle)}
                  </p>
                  <div className={s.takeawaysItemText}>
                    {typeof itemContent === "string" ? (
                      <p>{parseInlineMarkdown(itemContent)}</p>
                    ) : Array.isArray(itemContent) ? (
                      <PortableText value={itemContent} />
                    ) : (
                      <p>{extractText(itemContent)}</p>
                    )}
                  </div>
                </div>
              </li>
            );
          }

          if (itemContent && Array.isArray(itemContent)) {
            return (
              <li key={index} className={s.takeawaysItem}>
                <span className={s.takeawaysItemIcon}>
                  {getIconSvg(itemIcon)}
                </span>
                <div className={s.takeawaysItemText}>
                  <PortableText value={itemContent} />
                </div>
              </li>
            );
          }

          if (itemContent && typeof itemContent === "string") {
            return (
              <li key={index} className={s.takeawaysItem}>
                <span className={s.takeawaysItemIcon}>
                  {getIconSvg(itemIcon)}
                </span>
                <span className={s.takeawaysItemText}>{parseInlineMarkdown(itemContent)}</span>
              </li>
            );
          }

          const text =
            extractText(item) || (typeof item === "string" ? item : "");
          if (text) {
            return (
              <li key={index} className={s.takeawaysItem}>
                <span className={s.takeawaysItemIcon}>
                  {getIconSvg(itemIcon)}
                </span>
                <span className={s.takeawaysItemText}>{parseInlineMarkdown(text)}</span>
              </li>
            );
          }

          return null;
        };

        return (
          <div className={s.takeaways}>
            <div className={s.takeawaysHead}>
              <span className={s.takeawaysIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <h4 className={s.takeawaysTitle}>
                {value.title || "Points clés à retenir"}
              </h4>
            </div>
            {!items || items.length === 0 ? (
              <p className={s.calloutText} style={{ fontStyle: "italic" }}>
                Aucun élément trouvé
              </p>
            ) : (
              <ul className={s.takeawaysList}>
                {Array.isArray(items) &&
                  items.map((item: any, index: number) =>
                    renderItem(item, index)
                  )}
              </ul>
            )}
          </div>
        );
      },

      progressSteps: ({ value }: any) => (
        <div className={s.steps}>
          {value.title && <h4 className={s.stepsTitle}>{value.title}</h4>}
          <div className={s.stepsGrid}>
            {value.steps?.map(
              (step: { title: string; description: string }, index: number) => (
                <div key={index} className={s.step}>
                  <span className={s.stepNum}>{index + 1}</span>
                  <div className={s.stepBody}>
                    <h5 className={s.stepTitle}>{step.title}</h5>
                    <p className={s.stepDesc}>{step.description}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ),

      checklist: ({ value }: any) => {
        const slug = article?.slug?.current || article?.slug || "default";
        const storageKey = `checklist-${slug}-${value._key || "0"}`;

        const [checked, setChecked] = React.useState<Set<string>>(() => {
          try {
            const saved = localStorage.getItem(storageKey);
            return saved ? new Set(JSON.parse(saved)) : new Set();
          } catch { return new Set(); }
        });

        const toggle = (id: string) => {
          setChecked(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch {}
            return next;
          });
        };

        const items = value.items || [];
        const total = items.length;
        const done = items.filter((_: any, i: number) => checked.has(String(i))).length;

        return (
          <div className={s.checklist}>
            <div className={s.checklistHead}>
              <span className={s.checklistIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </span>
              <h4 className={s.checklistTitle}>
                {value.title || "Checklist"}
              </h4>
              <span className={s.checklistCount}>{done}/{total}</span>
            </div>
            <ul className={s.checklistList}>
              {items.map((item: any, index: number) => {
                const id = String(index);
                const isChecked = checked.has(id);
                return (
                  <li
                    key={item._key || index}
                    className={`${s.checklistItem} ${isChecked ? s.checklistItemDone : ""}`}
                    onClick={() => toggle(id)}
                  >
                    <span className={s.checklistBox}>
                      {isChecked ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : null}
                    </span>
                    <span className={s.checklistText}>{item.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      },

      newsletterCta: ({ value }: any) => (
        <div className={s.nlCta}>
          <div className={s.nlCtaInner}>
            <span className={s.nlCtaIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="0" />
                <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
              </svg>
            </span>
            <div className={s.nlCtaText}>
              <h4 className={s.nlCtaTitle}>
                {value.title || "Restez informé"}
              </h4>
              <p className={s.nlCtaDeck}>
                {value.description ||
                  "Inscrivez-vous à notre newsletter."}
              </p>
            </div>
            <Link to="/newsletter" className={s.nlCtaBtn}>
              {value.buttonText || "S'abonner"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ),

      youtube: ({ value }: any) => {
        const videoId = value.url?.match(
          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
        )?.[1];
        return videoId ? (
          <div
            className={s.videoEmbed}
            onClick={(e) => {
              const overlay = e.currentTarget.querySelector(
                `.${s.videoScrollOverlay}`
              );
              if (overlay) (overlay as HTMLElement).style.pointerEvents = "none";
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title={value.title || "Vidéo"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className={s.videoScrollOverlay} />
          </div>
        ) : null;
      },

      videoEmbed: ({ value }: any) => {
        const url = value.url || value.videoUrl;
        return url ? (
          <div
            className={s.videoEmbed}
            onClick={(e) => {
              const overlay = e.currentTarget.querySelector(
                `.${s.videoScrollOverlay}`
              );
              if (overlay) (overlay as HTMLElement).style.pointerEvents = "none";
            }}
          >
            <iframe
              src={url}
              title={value.title || "Vidéo"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className={s.videoScrollOverlay} />
          </div>
        ) : null;
      },

      video: ({ value }: any) => {
        const url = value.url || value.asset?.url;
        return url ? (
          <div className={s.nativeVideo}>
            <video controls poster={value.poster}>
              <source src={url} type="video/mp4" />
            </video>
            {value.caption && (
              <p className={s.figCaption}>{value.caption}</p>
            )}
          </div>
        ) : null;
      },

      audio: ({ value }: any) => {
        const url = value.url || value.asset?.url;
        return url ? (
          <div className={s.audio}>
            {value.title && (
              <h4 className={s.audioTitle}>{value.title}</h4>
            )}
            <audio controls>
              <source src={url} type="audio/mpeg" />
            </audio>
          </div>
        ) : null;
      },

      code: ({ value }: any) => (
        <div className={s.codeBlock}>
          {value.filename && (
            <div className={s.codeFilename}>{value.filename}</div>
          )}
          <pre className={s.codePre}>
            <code className={s.codeContent}>{value.code}</code>
          </pre>
        </div>
      ),

      table: ({ value }: any) => (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                {value.rows?.[0]?.cells?.map((cell: string, i: number) => (
                  <th key={i}>{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.rows?.slice(1).map((row: any, i: number) => (
                <tr key={i}>
                  {row.cells?.map((cell: string, j: number) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),

      gallery: ({ value }: any) => (
        <div className={s.gallery}>
          {value.title && <h4 className={s.h4}>{value.title}</h4>}
          <div className={`${s.galleryGrid} ${s.galleryGrid3}`}>
            {value.images?.map((img: any, i: number) => (
              <figure key={i} className={s.galleryItem}>
                <img
                  src={img.asset?.url || img.url}
                  alt={img.alt || ""}
                  className={s.galleryImg}
                  loading="lazy"
                  style={{ aspectRatio: "1", objectFit: "cover" }}
                />
              </figure>
            ))}
          </div>
          {value.caption && (
            <p className={s.figCaption}>{value.caption}</p>
          )}
        </div>
      ),

      divider: () => <hr className={s.divider} />,
      break: () => <hr className={s.divider} />,

      button: ({ value }: any) => (
        <div className={s.btnWrap}>
          <a
            href={value.url || value.link}
            target={value.external ? "_blank" : undefined}
            rel={value.external ? "noopener noreferrer" : undefined}
            className={s.btn}
          >
            {value.text || value.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      ),

      cta: ({ value }: any) => (
        <div className={s.ctaBlock}>
          {value.title && <h4 className={s.ctaTitle}>{value.title}</h4>}
          {value.description && (
            <p className={s.ctaDesc}>{value.description}</p>
          )}
          <Link to={value.url || value.link || "/"} className={s.btn}>
            {value.buttonText || value.text || "En savoir plus"}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ),

      socialEmbed: ({ value }: any) => (
        <div className={s.socialEmbed}>
          <SafeHTML
            html={value.embed || value.html || ""}
            className={s.socialEmbedInner}
          />
        </div>
      ),

      tweet: ({ value }: any) => (
        <div className={s.socialEmbed}>
          <blockquote className="twitter-tweet" data-theme="light">
            <a href={value.url}></a>
          </blockquote>
        </div>
      ),

      file: ({ value }: any) => (
        <a
          href={value.asset?.url || value.url}
          download
          className={s.file}
        >
          <span className={s.fileIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </span>
          <div className={s.fileBody}>
            <p className={s.fileName}>
              {value.title || value.filename || "Télécharger le fichier"}
            </p>
            {value.description && (
              <p className={s.fileDesc}>{value.description}</p>
            )}
          </div>
          <svg className={s.fileArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      ),

      embed: ({ value }: any) => (
        <div className={s.embed}>
          <iframe
            src={value.url}
            title={value.title || "Contenu intégré"}
            allowFullScreen
          />
        </div>
      ),

      person: ({ value }: any) => (
        <div className={s.person}>
          {value.image && (
            <img
              src={value.image.asset?.url || value.image}
              alt={`Portrait de ${value.name || ""}`}
              className={s.personImg}
            />
          )}
          <div>
            <p className={s.personName}>{value.name}</p>
            {value.role && <p className={s.personRole}>{value.role}</p>}
            {value.bio && <p className={s.personBio}>{value.bio}</p>}
          </div>
        </div>
      ),

      relatedArticles: ({ value }: any) => {
        const articles = value.articles || value.items || [];
        if (!articles.length) return null;

        return (
          <div className={s.inlineRelated}>
            <h4 className={s.inlineRelatedTitle}>
              {value.title || "Articles recommandés"}
            </h4>
            {articles.slice(0, 3).map((article: any, index: number) => {
              const slug = article.slug?.current || article.slug;
              const title = article.title || article.titre;
              const image =
                article.imageUrl || article.mainImage?.asset?.url;
              if (!slug || !title) return null;

              return (
                <Link
                  key={index}
                  to={`/article/${slug}`}
                  className={s.inlineRelatedItem}
                >
                  {image && (
                    <img
                      src={image}
                      alt={title}
                      className={s.inlineRelatedImg}
                      loading="lazy"
                    />
                  )}
                  <h5 className={s.inlineRelatedItemTitle}>{title}</h5>
                  <svg className={s.inlineRelatedArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        );
      },

      unknownType: ({ value }: any) => {
        const text = value?.text || value?.content;
        if (text) {
          return (
            <p className={s.paragraph}>
              {typeof text === "string" ? text : extractText(text)}
            </p>
          );
        }
        return null;
      },
    },
  };
};

export default createPortableTextComponentsV2;
