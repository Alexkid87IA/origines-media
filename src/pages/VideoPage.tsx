import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import { sanityFetch } from "@/lib/sanity";
import { typo, estimateReadingTime } from "@/lib/typography";
import { createPortableTextComponentsV2 } from "@/components/article/PortableTextComponentsV2";
import { shareButtons } from "@/components/article/SocialIcons";
import SaveButton from "@/components/SaveButton/SaveButton";
import type {
  Heading,
  Article,
  PopularArticle,
  RelatedArticle,
} from "@/components/article/types";
import s from "./VideoPage.module.css";

/* ── Sanity queries ── */

const VIDEO_BY_SLUG_QUERY = `
  *[_type == "production" && slug.current == $slug && typeArticle == "video"][0] {
    _id,
    "titre": titre,
    "title": titre,
    "description": description,
    "excerpt": description,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "videoUrl": videoUrl,
    "tempsLecture": tempsLecture,
    "readTime": tempsLecture,
    "datePublication": datePublication,
    "publishedAt": datePublication,
    "verticale": verticale->{ "nom": titre, "couleurDominante": couleur },
    "tags": tags[]->{ _id, "title": titre, "color": null, "slug": slug.current },
    "contenu": contenu,
    "body": contenu
  }
`;

const RELATED_VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video" && slug.current != $slug] | order(datePublication desc)[0...8] {
    _id,
    "titre": titre,
    "title": titre,
    "slug": slug,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "verticale": verticale->{ "nom": titre, "couleurDominante": couleur }
  }
`;

const POPULAR_VIDEOS_QUERY = `
  *[_type == "production" && typeArticle == "video"] | order(vues desc)[0...5] {
    _id,
    "title": titre,
    slug,
    "imageUrl": coalesce(image.asset->url, imageUrl),
    "views": vues
  }
`;

/* ── Helpers ── */

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return m ? m[1] : null;
}

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Inline SVG icons ── */

function CalendarSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="0" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
function ClockSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function ShareSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}
function HeartSvg({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
function BookmarkSvg({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}
function ListSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}
function ChevronDownSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function ArrowRightSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
function PenSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
function XSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  );
}
function CheckSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function LinkSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
function TrendingSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
function PlaySvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function TagSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" />
    </svg>
  );
}
function ThreadsSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.942-.783 2.264-1.217 3.727-1.223h.036c1.26.005 2.378.296 3.322.864.376.226.706.493.99.796.03-.317.043-.636.036-.957-.05-2.358-.756-4.022-2.098-4.942-1.135-.778-2.704-1.18-4.663-1.194-.964.008-1.87.1-2.694.28l-.485-1.947c.985-.216 2.07-.326 3.227-.334 2.431.018 4.396.567 5.844 1.632 1.72 1.266 2.614 3.394 2.674 6.33.003.165.003.33-.001.495.404.252.773.546 1.106.88 1.01 1.016 1.674 2.37 1.885 3.878.257 1.838-.168 3.878-1.282 5.28-1.692 2.131-4.381 3.31-7.57 3.322zm-1.25-8.063c-.06 0-.12.001-.18.003-1.347.06-2.28.537-2.547 1.303-.13.372-.12.784.028 1.16.242.615.857 1.108 1.739 1.392.525.168 1.09.244 1.678.224 1.073-.057 1.896-.453 2.449-1.178.476-.625.78-1.487.902-2.565-.724-.383-1.578-.586-2.534-.59h-.036c-.51.001-1.003.083-1.5.25z" />
    </svg>
  );
}

/* ── Component ── */

export default function VideoPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState("");
  const [showMobileToc, setShowMobileToc] = useState(false);
  const [tocExpanded, setTocExpanded] = useState(false);
  const [nlEmail, setNlEmail] = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [nlDone, setNlDone] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  /* Extract headings */
  useEffect(() => {
    const raw = article?.contenu || article?.body;
    if (!raw) return;
    const out: Heading[] = [];
    raw.forEach((block: any, i: number) => {
      if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
        const text = block.children?.map((c: any) => c.text).join("") || "";
        if (text) out.push({ id: `heading-${i}`, text, level: block.style === "h2" ? 2 : 3 });
      }
    });
    setHeadings(out);
  }, [article]);

  /* Scroll progress + active heading */
  useEffect(() => {
    function onScroll() {
      const top = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? Math.min((top / total) * 100, 100) : 0);
      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 150 && r.bottom >= 0) setActiveHeading(h.id);
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  /* Fetch data */
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        setLoading(true);
        const data = await sanityFetch(VIDEO_BY_SLUG_QUERY, { slug });
        if (!live) return;
        if (!data) { navigate("/404"); return; }
        setArticle(data);
        const [rel, pop] = await Promise.all([
          sanityFetch(RELATED_VIDEOS_QUERY, { slug }),
          sanityFetch(POPULAR_VIDEOS_QUERY),
        ]);
        if (!live) return;
        setRelatedArticles(rel || []);
        setPopularArticles((pop || []).filter((p: any) => p._id !== data._id).slice(0, 4));
      } catch {
        if (live) navigate("/404");
      } finally {
        if (live) setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
    return () => { live = false; };
  }, [slug, navigate]);

  /* Share handler */
  async function handleShare(platform: string) {
    const url = window.location.href;
    const t = article?.titre || article?.title || "";
    const map: Record<string, () => void> = {
      twitter: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(t)}`, "_blank"),
      facebook: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank"),
      linkedin: () => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(t)}`, "_blank"),
      whatsapp: () => window.open(`https://wa.me/?text=${encodeURIComponent(t + " " + url)}`, "_blank"),
      telegram: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(t)}`, "_blank"),
      email: () => { window.location.href = `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(url)}`; },
      copy: async () => { await navigator.clipboard.writeText(url); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); },
    };
    map[platform]?.();
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" });
      setShowMobileToc(false);
    }
  }

  async function handleNl(e: React.FormEvent) {
    e.preventDefault();
    if (!nlEmail.trim()) return;
    setNlLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setNlDone(true);
    setNlLoading(false);
  }

  const themeColor = article?.verticale?.couleurDominante || "#7B5CD6";
  const ptComponents = useMemo(
    () => createPortableTextComponentsV2({ themeColor, article }),
    [themeColor, article]
  );

  /* Loading */
  if (loading) {
    return (
      <div className={s.loading}>
        <div className={s.spinner} />
      </div>
    );
  }
  if (!article) return null;

  const title = article.titre || article.title || "";
  const description = article.description || article.excerpt || "";
  const imageUrl = article.imageUrl || article.mainImage || "";
  const date = article.datePublication || article.publishedAt;
  const readTime = article.tempsLecture || article.readTime || estimateReadingTime(article.contenu || article.body);
  const rawContent = article.contenu || article.body || [];
  const content = rawContent.filter((block: any, i: number) => {
    if (block._type === "block" && block.style === "h1") {
      if (i === rawContent.findIndex((b: any) => b._type === "block" && b.style === "h1")) return false;
    }
    if (block._type === "youtube" && article.videoUrl) {
      if (i === rawContent.findIndex((b: any) => b._type === "youtube")) return false;
    }
    return true;
  });
  const authorName = article.auteur?.nom || article.author?.name || "Origines Media";
  const authorImage = article.auteur?.imageUrl || article.author?.imageUrl;
  const verticale = article.verticale;
  const hasYT = article.videoUrl && extractYouTubeId(article.videoUrl);

  return (
    <div className={s.page}>
      <SEO
        title={title}
        description={description}
        url={`/video/${slug}`}
        image={imageUrl}
        type="video.other"
        author={authorName}
        section={verticale?.nom}
        jsonLd="video"
        videoUrl={article.videoUrl}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Vidéos", url: "/videos" },
          { name: title, url: `/video/${slug}` },
        ]}
      />

      <div className={s.progressBar} style={{ width: `${scrollProgress}%` }} />
      <SiteHeader />

      {/* YouTube hero */}
      {hasYT && (
        <section className={s.videoHero}>
          <div className={s.videoHeroInner}>
            <div className={s.videoFrame}>
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(article.videoUrl!)}?rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* Split hero (no video) */}
      {!hasYT && (
        <section className={s.splitHero}>
          <div className={s.splitImage}>
            <div className={s.splitImageBg} style={{ backgroundImage: `url(${imageUrl || "/placeholder.svg"})` }} />
            <div className={s.splitImageOverlay} />
          </div>
          <div className={s.splitContent}>
            {verticale && (
              <span className={s.splitKicker} style={{ color: themeColor }}>
                {verticale.nom}
              </span>
            )}
            <h1 className={s.splitTitle}>{typo(title)}</h1>
            {description && <p className={s.splitDeck}>{typo(description)}</p>}
            <div className={s.splitMeta}>
              {authorImage && <img src={authorImage} alt={authorName} className={s.splitAuthorImg} />}
              <div className={s.splitAuthorInfo}>
                <span className={s.splitAuthorName}>{authorName}</span>
                <span className={s.splitMetaLine}>
                  <CalendarSvg className={s.splitMetaIcon} />
                  {formatDate(date)}
                  <span className={s.splitMetaDot} />
                  <ClockSvg className={s.splitMetaIcon} />
                  {readTime} min
                </span>
              </div>
              <SaveButton type="video" slug={slug || ""} title={title} image={imageUrl} univers={verticale?.nom} />
            </div>
            {article.tags && article.tags.filter((t) => t?.title).length > 0 && (
              <div className={s.splitTags}>
                {article.tags.filter((t) => t?.title).slice(0, 4).map((tag) => (
                  <Link key={tag._id} to={`/bibliotheque?tag=${tag.slug || tag._id}`} className={s.splitTag}>
                    {tag.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Video header (below YT embed) */}
      {hasYT && (
        <header className={s.videoHeader}>
          <div className={s.videoHeaderInner}>
            {verticale && (
              <span className={s.videoHeaderKicker} style={{ color: themeColor }}>
                {verticale.nom}
              </span>
            )}
            <span className={s.videoHeaderBar} />
            <h1 className={s.videoHeaderTitle}>{typo(title)}</h1>
            {description && <p className={s.videoHeaderDeck}>{typo(description)}</p>}
            <div className={s.videoHeaderMeta}>
              <span>{authorName}</span>
              <span className={s.videoHeaderMetaDot} />
              <CalendarSvg className={s.videoHeaderMetaIcon} />
              <span>{formatDate(date)}</span>
              <span className={s.videoHeaderMetaDot} />
              <ClockSvg className={s.videoHeaderMetaIcon} />
              <span>{readTime} min</span>
            </div>
          </div>
        </header>
      )}

      <main>
        {/* Body + sidebar */}
        <div className={s.contentContainer}>
          <div className={s.contentLayout}>
            {/* Body */}
            <div ref={contentRef} className={s.body}>
              {content.length > 0 && (
                <div className={s.prose}>
                  <PortableText value={content} components={ptComponents} />
                </div>
              )}

              {/* Author box */}
              <div className={s.authorBox}>
                <div className={s.authorBoxInner}>
                  {authorImage && <img src={authorImage} alt={authorName} className={s.authorBoxImg} />}
                  <div>
                    <p className={s.authorBoxLabel}>Écrit par</p>
                    <h4 className={s.authorBoxName}>{authorName}</h4>
                    {(article.auteur?.bio || article.author?.bio) && (
                      <p className={s.authorBoxBio}>{article.auteur?.bio || article.author?.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className={s.sidebar}>
              <div className={s.sidebarInner}>
                {/* TOC */}
                {headings.length > 0 && (
                  <div className={s.widget}>
                    <button onClick={() => setTocExpanded(!tocExpanded)} className={s.tocToggle}>
                      <span>Sommaire</span>
                      <ChevronDownSvg className={`${s.tocChevron} ${tocExpanded ? s.tocChevronOpen : ""}`} />
                    </button>
                    <AnimatePresence>
                      {tocExpanded && (
                        <motion.nav
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={s.tocNav}
                        >
                          {(() => {
                            let h2i = 0;
                            return headings.map((h) => {
                              const isH2 = h.level === 2;
                              const active = activeHeading === h.id;
                              if (isH2) h2i++;
                              return (
                                <button
                                  key={h.id}
                                  onClick={() => scrollToSection(h.id)}
                                  className={`${s.tocItem} ${active ? s.tocItemActive : ""} ${!isH2 ? s.tocItemH3 : ""}`}
                                >
                                  {isH2 ? (
                                    <span className={`${s.tocItemNumber} ${active ? s.tocItemNumberActive : ""}`}>{h2i}</span>
                                  ) : (
                                    <span className={`${s.tocItemDot} ${active ? s.tocItemDotActive : ""}`} />
                                  )}
                                  <span>{h.text}</span>
                                </button>
                              );
                            });
                          })()}
                        </motion.nav>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Share */}
                <div className={s.widget}>
                  <div className={s.widgetHeader}>
                    <ShareSvg className={s.widgetHeaderIcon} />
                    Partager
                  </div>
                  <div className={s.widgetBody}>
                    <div className={s.shareGrid}>
                      {shareButtons.map((btn) => (
                        <button key={btn.id} onClick={() => handleShare(btn.id)} className={s.shareBtn} title={btn.label}>
                          <btn.icon />
                        </button>
                      ))}
                      <button onClick={() => window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(title)} ${encodeURIComponent(window.location.href)}`, "_blank")} className={s.shareBtn} title="Threads">
                        <ThreadsSvg />
                      </button>
                      <button onClick={() => handleShare("copy")} className={s.shareBtn} title="Copier le lien">
                        {copySuccess ? <CheckSvg /> : <LinkSvg />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.filter((t) => t?.title).length > 0 && (
                  <div className={s.widget}>
                    <div className={s.widgetHeader}>
                      <TagSvg className={s.widgetHeaderIcon} />
                      Thématiques
                    </div>
                    <div className={s.widgetBody}>
                      <div className={s.tagsWrap}>
                        {article.tags.filter((t) => t?.title).map((tag) => (
                          <Link key={tag._id} to={`/bibliotheque?tag=${tag.slug || tag._id}`} className={s.tagPill}>
                            {tag.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Newsletter */}
                <div className={s.nlWidget}>
                  {!nlDone ? (
                    <>
                      <p className={s.nlLabel}>Newsletter</p>
                      <p className={s.nlTitle}>Kit d'Introspection</p>
                      <p className={s.nlDesc}>
                        Les meilleurs outils de développement personnel de nos intervenants. Guide gratuit, 24 pages.
                      </p>
                      <form onSubmit={handleNl}>
                        <input
                          type="email"
                          value={nlEmail}
                          onChange={(e) => setNlEmail(e.target.value)}
                          placeholder="votre@email.com"
                          required
                          className={s.nlInput}
                        />
                        <button type="submit" disabled={!nlEmail.trim() || nlLoading} className={s.nlBtn}>
                          {nlLoading ? "Envoi…" : "Recevoir mon guide"}
                        </button>
                      </form>
                      <p className={s.nlFine}>Pas de spam. Désabonnement en 1 clic.</p>
                    </>
                  ) : (
                    <div className={s.nlSuccess}>
                      <div className={s.nlSuccessIcon}><CheckSvg /></div>
                      <p className={s.nlSuccessTitle}>Merci !</p>
                      <p className={s.nlSuccessSub}>Vérifiez votre boîte mail</p>
                    </div>
                  )}
                </div>

                {/* Popular */}
                {popularArticles.filter((p) => p?.title).length > 0 && (
                  <div className={s.widget}>
                    <div className={s.widgetHeader}>
                      <TrendingSvg className={s.widgetHeaderIcon} />
                      Les plus vues
                    </div>
                    <div className={s.widgetBody}>
                      {popularArticles.filter((p) => p?.title).slice(0, 4).map((pop, idx) => (
                        <Link key={pop._id} to={`/video/${pop.slug?.current || pop._id}`} className={s.popItem}>
                          <div className={s.popThumb}>
                            <img src={pop.imageUrl || "/placeholder.svg"} alt={pop.title || ""} className={s.popThumbImg} />
                            <span className={s.popRank}>{idx + 1}</span>
                          </div>
                          <span className={s.popTitle}>{pop.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related sidebar */}
                {relatedArticles.filter((r) => r?.slug?.current).length > 0 && (
                  <div className={s.widget}>
                    <div className={s.widgetHeader}>
                      <PlaySvg className={s.widgetHeaderIcon} />
                      À voir aussi
                    </div>
                    <div className={s.widgetBody}>
                      {relatedArticles.filter((r) => r?.slug?.current).slice(0, 3).map((rel) => (
                        <Link key={rel._id} to={`/video/${rel.slug.current}`} className={s.relItem}>
                          <img src={rel.imageUrl || "/placeholder.svg"} alt={rel.titre || rel.title || ""} className={s.relThumb} />
                          <div className={s.relInfo}>
                            <span className={s.relTitle}>{rel.titre || rel.title}</span>
                            {rel.verticale && <span className={s.relCat}>{rel.verticale.nom}</span>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link to="/racontez-votre-histoire" className={s.ctaWidget}>
                  <div className={s.ctaWidgetIcon}><PenSvg /></div>
                  <div className={s.ctaWidgetText}>
                    <p className={s.ctaWidgetTitle}>Racontez votre histoire</p>
                    <p className={s.ctaWidgetSub}>Partagez et inspirez</p>
                  </div>
                  <ArrowRightSvg className={s.ctaArrow} />
                </Link>

                {/* Ad */}
                <div className={s.adSlot}>
                  <p className={s.adLabel}>Publicité</p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Bottom related section */}
        {relatedArticles.length > 0 && (
          <section className={s.relatedSection}>
            <div className={s.relatedInner}>
              <h2 className={s.relatedTitle}>Vidéos recommandées</h2>
              <div className={s.relatedGrid}>
                {relatedArticles.slice(0, 4).map((rel) => (
                  <Link key={rel._id} to={`/video/${rel.slug.current}`} className={s.relatedCard}>
                    <div className={s.relatedCardImg}>
                      <img src={rel.imageUrl || "/placeholder.svg"} alt={rel.titre || rel.title || ""} />
                    </div>
                    <div className={s.relatedCardBody}>
                      {rel.verticale && (
                        <span className={s.relatedCardCat} style={{ color: rel.verticale.couleurDominante || themeColor }}>
                          {rel.verticale.nom}
                        </span>
                      )}
                      <h3 className={s.relatedCardTitle}>{rel.titre || rel.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/videos" className={s.relatedCta}>
                Toutes les vidéos
                <ArrowRightSvg className={s.relatedCtaArrow} />
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Mobile bar */}
      <div className={s.mobileBar}>
        <div className={s.mobileBarInner}>
          <button onClick={() => setIsLiked(!isLiked)} className={`${s.mobileBarBtn} ${isLiked ? s.mobileBarBtnActive : ""}`}>
            <HeartSvg filled={isLiked} />
          </button>
          <button onClick={() => setShowShareModal(true)} className={s.mobileBarShare}>
            <ShareSvg />
            <span>Partager</span>
          </button>
          <button onClick={() => setIsBookmarked(!isBookmarked)} className={`${s.mobileBarBtn} ${isBookmarked ? s.mobileBarBtnActive : ""}`}>
            <BookmarkSvg filled={isBookmarked} />
          </button>
        </div>
      </div>

      {/* Mobile TOC button */}
      {headings.length > 0 && (
        <button onClick={() => setShowMobileToc(true)} className={s.mobileTocBtn}>
          <ListSvg />
        </button>
      )}

      {/* Mobile TOC modal */}
      <AnimatePresence>
        {showMobileToc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={s.overlay}
            onClick={() => setShowMobileToc(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className={s.modalSheet}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={s.modalHeader}>
                <h3 className={s.modalTitle}>Sommaire</h3>
                <button onClick={() => setShowMobileToc(false)} className={s.modalClose}><XSvg /></button>
              </div>
              <nav>
                {headings.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => scrollToSection(h.id)}
                    className={`${s.modalTocItem} ${h.level === 3 ? s.modalTocItemH3 : ""} ${activeHeading === h.id ? s.modalTocItemActive : ""}`}
                  >
                    {h.text}
                  </button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={s.overlay}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={s.modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={s.modalHeader}>
                <h3 className={s.modalTitle}>Partager</h3>
                <button onClick={() => setShowShareModal(false)} className={s.modalClose}><XSvg /></button>
              </div>
              <div className={s.modalShareGrid}>
                {shareButtons.map((btn) => (
                  <button key={btn.id} onClick={() => handleShare(btn.id)} className={s.modalShareBtn}>
                    <btn.icon />
                    <span className={s.modalShareLabel}>{btn.label}</span>
                  </button>
                ))}
                <button onClick={() => handleShare("copy")} className={s.modalShareBtn}>
                  {copySuccess ? <CheckSvg /> : <LinkSvg />}
                  <span className={s.modalShareLabel}>{copySuccess ? "Copié" : "Lien"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
