import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import EmailCapture from "@/components/EmailCapture";
import { sanityFetch } from "@/lib/sanity";
import { typo } from "@/lib/typography";
import { AdPlaceholder } from "@/components/AdSense";
import { createPortableTextComponentsV2 } from "@/components/article/PortableTextComponentsV2";
import {
  XIcon,
  LinkedInIcon,
  InstagramIcon,
  shareButtons,
} from "@/components/article/SocialIcons";
import type {
  Heading,
  Article,
  PopularArticle,
  RelatedArticle,
} from "@/components/article/types";
import {
  ARTICLE_BY_SLUG_QUERY,
  RELATED_ARTICLES_QUERY,
  POPULAR_ARTICLES_QUERY,
} from "@/lib/queries";
import s from "./ArticlePageV2.module.css";

export default function ArticlePageV2() {
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

  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const lastSidebarStateRef = useRef<string>("");

  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  useEffect(() => {
    if (article?.contenu || article?.body) {
      const content = article.contenu || article.body;
      const extracted: Heading[] = [];
      content.forEach((block: any, index: number) => {
        if (
          block._type === "block" &&
          (block.style === "h2" || block.style === "h3")
        ) {
          const text =
            block.children?.map((child: any) => child.text).join("") || "";
          if (text) {
            extracted.push({
              id: `heading-${index}`,
              text,
              level: block.style === "h2" ? 2 : 3,
            });
          }
        }
      });
      setHeadings(extracted);
    }
  }, [article]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 0) {
            setActiveHeading(heading.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  useEffect(() => {
    const handleSidebarScroll = () => {
      if (!sidebarRef.current || !sidebarContainerRef.current) return;

      const container = sidebarContainerRef.current;
      const sidebar = sidebarRef.current;
      const containerRect = container.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const viewportHeight = window.innerHeight;
      const sidebarBottomIfRelative = containerRect.top + sidebarHeight;

      let newState: string;
      let newStyle: React.CSSProperties;

      if (sidebarBottomIfRelative > viewportHeight) {
        newState = "relative";
        newStyle = { position: "relative", top: 0 };
      } else if (containerRect.bottom > sidebarHeight) {
        const topPosition = viewportHeight - sidebarHeight;
        newState = `fixed-${Math.round(topPosition)}-${container.offsetWidth}`;
        newStyle = {
          position: "fixed",
          top: topPosition,
          width: container.offsetWidth,
        };
      } else {
        newState = "absolute";
        newStyle = {
          position: "absolute",
          bottom: 0,
          top: "auto",
          width: "100%",
        };
      }

      if (lastSidebarStateRef.current !== newState) {
        lastSidebarStateRef.current = newState;
        setSidebarStyle(newStyle);
      }
    };

    window.addEventListener("scroll", handleSidebarScroll, { passive: true });
    window.addEventListener("resize", handleSidebarScroll);
    setTimeout(handleSidebarScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleSidebarScroll);
      window.removeEventListener("resize", handleSidebarScroll);
    };
  }, [article]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) setLoading(true);
        const articleData = await sanityFetch(ARTICLE_BY_SLUG_QUERY, { slug });
        if (!isMounted) return;
        if (!articleData) {
          if (isMounted) navigate("/404");
          return;
        }
        if (isMounted) setArticle(articleData);

        try {
          const categoryIds =
            articleData.categories
              ?.map((c: any) => c?._id)
              .filter(Boolean) || [];
          const tagIds =
            articleData.tags?.map((t: any) => t?._id).filter(Boolean) || [];

          const [related, popular] = await Promise.all([
            sanityFetch(RELATED_ARTICLES_QUERY, {
              currentId: articleData._id,
              categoryIds,
              tagIds,
              universId: articleData.univers?._id || null,
              verticaleId: articleData.verticale?._id || null,
            }),
            sanityFetch(POPULAR_ARTICLES_QUERY),
          ]);

          if (isMounted) {
            setRelatedArticles(related || []);
            setPopularArticles(
              (popular || [])
                .filter((p: any) => p._id !== articleData._id)
                .slice(0, 4)
            );
          }
        } catch {
          if (isMounted) {
            setRelatedArticles([]);
            setPopularArticles([]);
          }
        }
      } catch {
        if (isMounted) navigate("/404");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (slug) {
      fetchData();
      window.scrollTo(0, 0);
    }

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = article?.titre || article?.title || "";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
          "_blank"
        );
        break;
      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent("Je voulais partager cet article avec toi : " + url)}`;
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        break;
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top =
        element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setShowMobileToc(false);
    }
  };

  const themeColorForHeadings =
    article?.verticale?.couleurDominante || "#0A0A0A";

  const portableTextComponents = useMemo(
    () =>
      createPortableTextComponentsV2({
        themeColor: themeColorForHeadings,
        article,
      }),
    [themeColorForHeadings, article]
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.skeleton}>
          <div className={s.skelTitle} />
          <div className={s.skelMeta} />
          <div className={s.skelImg} />
          <div className={s.skelLine} />
          <div className={s.skelLineShort} />
          <div className={s.skelLine} />
          <div className={s.skelLineTiny} />
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (!article) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.error}>
          <h1 className={s.errorTitle}>Article non trouv&eacute;</h1>
          <p className={s.errorText}>
            L&rsquo;article que vous cherchez n&rsquo;existe pas ou a
            &eacute;t&eacute; d&eacute;plac&eacute;.
          </p>
          <Link to="/" className={s.errorCta}>
            Retour &agrave; l&rsquo;accueil &rarr;
          </Link>
        </div>
        <Footer2 />
      </div>
    );
  }

  /* ── Extract data ── */
  const title = article.titre || article.title || "Article";
  const description = article.description || article.excerpt || "";
  const imageUrl = article.imageUrl || article.mainImage || "";
  const date = article.datePublication || article.publishedAt;
  const readTime = article.tempsLecture || article.readTime || 5;
  const content = article.contenu || article.body || [];
  const verticale = article.verticale;
  const themeColor = verticale?.couleurDominante || "#0A0A0A";
  const tags = article.tags || [];
  const author = article.auteur || article.author;
  const authorName = author?.nom || author?.name || "Rédaction";
  const authorBio = author?.bio || "";
  const authorRole = author?.role || "Auteur";
  const authorImage = author?.imageUrl || author?.image?.asset?.url;
  const authorSocial = {
    twitter: author?.twitter || author?.social?.twitter,
    linkedin: author?.linkedin || author?.social?.linkedin,
    instagram: author?.instagram || author?.social?.instagram,
  };

  return (
    <div className={s.page}>
      <SEO
        title={title}
        description={description}
        url={`/article/${slug}`}
        image={imageUrl}
        type="article"
        author={authorName}
        publishedTime={date}
        section={verticale?.nom}
        jsonLd="article"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Articles", url: "/articles" },
          ...(verticale?.nom
            ? [
                {
                  name: verticale.nom,
                  url: `/articles?verticale=${(verticale as any).slug?.current || verticale.nom.toLowerCase()}`,
                },
              ]
            : []),
          { name: title, url: `/article/${slug}` },
        ]}
      />

      {/* Progress Bar */}
      <div
        className={s.progressBar}
        style={{ width: `${scrollProgress}%` }}
      />

      <SiteHeader />

      <main>
        {/* ═══ Header — centered editorial ═══ */}
        <header className={s.header}>
          <div className={s.headerInner}>
            <span
              className={s.headerBar}
              style={{ background: themeColor }}
              aria-hidden="true"
            />

            {verticale && (
              <span className={s.headerKicker}>{verticale.nom}</span>
            )}

            <h1 className={s.headerTitle}>{typo(title)}</h1>

            {description && (
              <p className={s.headerDeck}>{typo(description)}</p>
            )}

            <div className={s.headerMeta}>
              <span className={s.headerAuthor}>par {authorName}</span>
              <span className={s.headerDot} aria-hidden="true" />
              {date && (
                <time className={s.headerDate} dateTime={date}>
                  {formatDate(date)}
                </time>
              )}
              <span className={s.headerDot} aria-hidden="true" />
              <span className={s.headerReadTime}>
                {readTime} min de lecture
              </span>
            </div>
          </div>
        </header>

        {/* ═══ Hero image — contained ═══ */}
        {imageUrl && (
          <figure className={s.heroFigure}>
            <img
              src={imageUrl}
              alt={title}
              className={s.heroImg}
              loading="eager"
            />
            {article.imageCredit && (
              <figcaption className={s.heroCaption}>
                {article.imageCredit}
              </figcaption>
            )}
          </figure>
        )}

        {/* ═══ Content + Sidebar ═══ */}
        <section className={s.contentSection}>
          <div className={s.contentGrid}>
            {/* Article body */}
            <div ref={contentRef} className={s.articleBody}>
              <div className={s.prose}>
                <PortableText
                  value={content}
                  components={portableTextComponents}
                />
              </div>

              {/* Author box */}
              <div className={s.authorBox}>
                <div className={s.authorBoxInner}>
                  {authorImage && (
                    <img
                      src={authorImage}
                      alt={authorName}
                      className={s.authorBoxImg}
                    />
                  )}
                  <div className={s.authorBoxContent}>
                    <p className={s.authorBoxLabel}>
                      &Eacute;crit par
                    </p>
                    <h4 className={s.authorBoxName}>{authorName}</h4>
                    {authorRole && (
                      <p className={s.authorBoxRole}>{authorRole}</p>
                    )}
                    {authorBio && (
                      <p className={s.authorBoxBio}>{authorBio}</p>
                    )}
                    {(authorSocial?.linkedin ||
                      authorSocial?.instagram ||
                      authorSocial?.twitter) && (
                      <div className={s.authorBoxSocials}>
                        {authorSocial?.linkedin && (
                          <a
                            href={authorSocial.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={s.authorSocialLink}
                            title="LinkedIn"
                          >
                            <LinkedInIcon />
                          </a>
                        )}
                        {authorSocial?.instagram && (
                          <a
                            href={authorSocial.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={s.authorSocialLink}
                            title="Instagram"
                          >
                            <InstagramIcon />
                          </a>
                        )}
                        {authorSocial?.twitter && (
                          <a
                            href={authorSocial.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={s.authorSocialLink}
                            title="X (Twitter)"
                          >
                            <XIcon />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside ref={sidebarContainerRef} className={s.sidebar}>
              <div
                ref={sidebarRef}
                className={s.sidebarInner}
                style={sidebarStyle}
              >
                {/* 0. Featured "À lire ensuite" */}
                {relatedArticles.length > 0 && relatedArticles[0].slug?.current && (
                  <Link
                    to={`/article/${relatedArticles[0].slug.current}`}
                    className={s.nextRead}
                  >
                    <span className={s.nextReadLabel}>
                      &Agrave; lire ensuite
                    </span>
                    {relatedArticles[0].imageUrl && (
                      <img
                        src={relatedArticles[0].imageUrl}
                        alt={relatedArticles[0].titre || relatedArticles[0].title || ""}
                        className={s.nextReadImg}
                        loading="lazy"
                      />
                    )}
                    <div className={s.nextReadBody}>
                      {relatedArticles[0].verticale && (
                        <span
                          className={s.nextReadVert}
                          style={{
                            color:
                              relatedArticles[0].verticale.couleurDominante ||
                              "var(--stone500)",
                          }}
                        >
                          {relatedArticles[0].verticale.nom}
                        </span>
                      )}
                      <h4 className={s.nextReadTitle}>
                        {relatedArticles[0].titre || relatedArticles[0].title}
                      </h4>
                      {(relatedArticles[0] as any).excerpt && (
                        <p className={s.nextReadExcerpt}>
                          {(relatedArticles[0] as any).excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                )}

                {/* 1. TOC */}
                {headings.length > 0 && (
                  <div className={s.widget}>
                    <button
                      className={s.widgetHead}
                      onClick={() => setTocExpanded(!tocExpanded)}
                    >
                      <h4 className={s.widgetTitle}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                        </svg>
                        Sommaire
                      </h4>
                      <svg
                        className={
                          tocExpanded
                            ? s.widgetChevronOpen
                            : s.widgetChevron
                        }
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M4 6l4 4 4-4" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {tocExpanded && (
                        <motion.nav
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className={s.widgetBody}>
                            <div className={s.tocList}>
                              {(() => {
                                let h2Index = 0;
                                return headings.map((heading) => {
                                  const isH2 = heading.level === 2;
                                  const isActive =
                                    activeHeading === heading.id;
                                  if (isH2) h2Index++;

                                  return (
                                    <button
                                      key={heading.id}
                                      onClick={() =>
                                        scrollToSection(heading.id)
                                      }
                                      className={`${
                                        isActive
                                          ? s.tocItemActive
                                          : s.tocItem
                                      } ${!isH2 ? s.tocItemH3 : ""}`}
                                    >
                                      {isH2 ? (
                                        <>
                                          <span className={s.tocNum}>
                                            {h2Index}
                                          </span>
                                          <span>{heading.text}</span>
                                        </>
                                      ) : (
                                        <>
                                          <span className={s.tocDot} />
                                          <span>{heading.text}</span>
                                        </>
                                      )}
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        </motion.nav>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 2. Share */}
                <div className={s.widget}>
                  <div className={s.widgetHeadStatic}>
                    <h4 className={s.widgetTitle}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                      </svg>
                      Partager
                    </h4>
                  </div>
                  <div className={s.widgetBody}>
                    <div className={s.shareGrid}>
                      {shareButtons.map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => handleShare(btn.id)}
                          className={s.shareBtn}
                          title={btn.label}
                        >
                          <btn.icon />
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.threads.net/intent/post?text=${encodeURIComponent(title)} ${encodeURIComponent(window.location.href)}`,
                            "_blank"
                          )
                        }
                        className={s.shareBtn}
                        title="Threads"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.942-.783 2.264-1.217 3.727-1.223h.036c1.26.005 2.378.296 3.322.864.376.226.706.493.99.796.03-.317.043-.636.036-.957-.05-2.358-.756-4.022-2.098-4.942-1.135-.778-2.704-1.18-4.663-1.194-.964.008-1.87.1-2.694.28l-.485-1.947c.985-.216 2.07-.326 3.227-.334 2.431.018 4.396.567 5.844 1.632 1.72 1.266 2.614 3.394 2.674 6.33.003.165.003.33-.001.495.404.252.773.546 1.106.88 1.01 1.016 1.674 2.37 1.885 3.878.257 1.838-.168 3.878-1.282 5.28-1.692 2.131-4.381 3.31-7.57 3.322zm-1.25-8.063c-.06 0-.12.001-.18.003-1.347.06-2.28.537-2.547 1.303-.13.372-.12.784.028 1.16.242.615.857 1.108 1.739 1.392.525.168 1.09.244 1.678.224 1.073-.057 1.896-.453 2.449-1.178.476-.625.78-1.487.902-2.565-.724-.383-1.578-.586-2.534-.59h-.036c-.51.001-1.003.083-1.5.25z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className={s.shareBtn}
                        title="Copier le lien"
                      >
                        {copySuccess ? (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Video Widget */}
                {article?.videoUrl && (
                  <a
                    href={article.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.videoWidget}
                  >
                    <div className={s.videoThumb}>
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={`Vidéo : ${title}`}
                        className={s.videoThumbImg}
                      />
                      <div className={s.videoPlayBtn}>
                        <span className={s.videoPlayCircle}>
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className={s.videoBody}>
                      <p className={s.videoLabel}>
                        Voir en vid&eacute;o
                      </p>
                      <p className={s.videoTitle}>{title}</p>
                    </div>
                  </a>
                )}

                {/* 4. Tags */}
                {tags.filter((t) => t && t.title).length > 0 && (
                  <div className={s.widget}>
                    <div className={s.widgetHeadStatic}>
                      <h4 className={s.widgetTitle}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                          <circle cx="7" cy="7" r="1" />
                        </svg>
                        Th&eacute;matiques
                      </h4>
                    </div>
                    <div className={s.widgetBody}>
                      <div className={s.tagsList}>
                        {tags
                          .filter((t) => t && t.title)
                          .map((tag) => (
                            <Link
                              key={tag._id}
                              to={`/articles?tag=${tag.slug || tag._id}`}
                              className={s.tagLink}
                            >
                              {tag.title}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Newsletter */}
                <div className={s.nlWidget}>
                  <svg
                    className={s.nlIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                  </svg>
                  <h4 className={s.nlTitle}>Ne manquez rien</h4>
                  <p className={s.nlDeck}>
                    Nos meilleurs r&eacute;cits, chaque semaine.
                  </p>
                  <EmailCapture
                    source="article"
                    variant="inline"
                    placeholder="votre@email.com"
                    buttonText="S'abonner"
                    successMessage="Bienvenue !"
                    successDescription="Rendez-vous vendredi dans votre boîte mail."
                  />
                </div>

                {/* 6. Popular articles */}
                {popularArticles.filter((p) => p && p.title).length >
                  0 && (
                  <div className={s.widget}>
                    <div className={s.widgetHeadStatic}>
                      <h4 className={s.widgetTitle}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </svg>
                        Les plus lus
                      </h4>
                    </div>
                    <div className={s.widgetBody}>
                      {popularArticles
                        .filter((p) => p && p.title)
                        .slice(0, 4)
                        .map((pop, idx) => (
                          <Link
                            key={pop._id}
                            to={`/article/${pop.slug?.current || pop._id}`}
                            className={s.popItem}
                          >
                            <div className={s.popImgWrap}>
                              <img
                                src={
                                  pop.imageUrl || "/placeholder.svg"
                                }
                                alt={pop.title || ""}
                                className={s.popImg}
                              />
                              <span className={s.popRank}>
                                {idx + 1}
                              </span>
                            </div>
                            <span className={s.popTitle}>
                              {pop.title}
                            </span>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}

                {/* 7. Related articles */}
                {relatedArticles.filter((r) => r && r.slug?.current)
                  .length > 0 && (
                  <div className={s.widget}>
                    <div className={s.widgetHeadStatic}>
                      <h4 className={s.widgetTitle}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                        </svg>
                        &Agrave; lire aussi
                      </h4>
                    </div>
                    <div className={s.widgetBody}>
                      {relatedArticles
                        .filter((r) => r && r.slug?.current)
                        .slice(0, 3)
                        .map((related) => (
                          <Link
                            key={related._id}
                            to={`/article/${related.slug.current}`}
                            className={s.relItem}
                          >
                            <img
                              src={
                                related.imageUrl || "/placeholder.svg"
                              }
                              alt={
                                related.titre ||
                                related.title ||
                                ""
                              }
                              className={s.relImg}
                              loading="lazy"
                            />
                            <div className={s.relBody}>
                              <h5 className={s.relTitle}>
                                {related.titre || related.title}
                              </h5>
                              {related.verticale && (
                                <span className={s.relVert}>
                                  {related.verticale.nom}
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}

                {/* 8. CTA */}
                <Link
                  to="/racontez-votre-histoire"
                  className={s.ctaWidget}
                >
                  <span className={s.ctaWidgetIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </span>
                  <div className={s.ctaWidgetText}>
                    <p className={s.ctaWidgetTitle}>
                      Racontez votre histoire
                    </p>
                    <p className={s.ctaWidgetSub}>
                      Partagez et inspirez
                    </p>
                  </div>
                  <svg
                    className={s.ctaWidgetArrow}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>

                {/* 9. Ad */}
                <AdPlaceholder format="rectangle" />
              </div>
            </aside>
          </div>
        </section>

        {/* ═══ Related content — gradient section + CTA ═══ */}
        {relatedArticles.length > 0 && (
          <section className={s.relatedSection}>
            <div className={s.relatedInner}>
              <span className={s.relatedKicker}>
                Continuez l&rsquo;exploration
              </span>
              <h2 className={s.relatedHeading}>
                Articles <em>recommand&eacute;s.</em>
              </h2>
              <div className={s.relatedGrid}>
                {relatedArticles.slice(0, 4).map((related) => (
                  <Link
                    key={related._id}
                    to={`/article/${related.slug.current}`}
                    className={s.relCard}
                  >
                    <div className={s.relCardImgWrap}>
                      <img
                        src={related.imageUrl || "/placeholder.svg"}
                        alt={related.titre || related.title || ""}
                        className={s.relCardImg}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    {related.verticale && (
                      <span className={s.relCardVert}>
                        {related.verticale.nom}
                      </span>
                    )}
                    <h3 className={s.relCardTitle}>
                      {related.titre || related.title}
                    </h3>
                  </Link>
                ))}
              </div>
              <div className={s.relatedCtaWrap}>
                <Link to="/articles" className={s.relatedCta}>
                  Voir tous les articles
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ═══ End-of-article newsletter ═══ */}
      <section className={s.endNl}>
        <div className={s.endNlInner}>
          <h3 className={s.endNlTitle}>
            Cet article vous a plu&nbsp;?
          </h3>
          <p className={s.endNlDeck}>
            Recevez nos meilleurs r&eacute;cits chaque semaine,
            directement dans votre bo&icirc;te mail.
          </p>
          <EmailCapture
            source="article"
            variant="inline"
            placeholder="votre@email.com"
            buttonText="S'abonner"
            successMessage="Merci !"
            successDescription="Vous recevrez notre prochaine newsletter vendredi."
          />
        </div>
      </section>

      {/* ═══ Scroll to top ═══ */}
      <div className={s.scrollTopSection}>
        <button
          className={s.scrollTopBtn}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
          Retour en haut
        </button>
      </div>

      <Footer2 />

      {/* ═══ Mobile floating action bar ═══ */}
      <div className={s.mobileBar}>
        <div className={s.mobileBarInner}>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={isLiked ? s.mobileBarBtnActive : s.mobileBarBtn}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>

          <button
            className={s.mobileBarShare}
            onClick={() => setShowShareModal(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            Partager
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={
              isBookmarked ? s.mobileBarBtnActive : s.mobileBarBtn
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══ Mobile TOC button ═══ */}
      {headings.length > 0 && (
        <button
          className={s.mobileTocBtn}
          onClick={() => setShowMobileToc(true)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </button>
      )}

      {/* ═══ Mobile TOC modal ═══ */}
      {showMobileToc && (
        <div
          className={`${s.mobileTocOverlay} ${s.mobileTocOverlayOpen}`}
          onClick={() => setShowMobileToc(false)}
        >
          <div
            className={s.mobileTocPanel}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.mobileTocHeader}>
              <h3 className={s.mobileTocTitle}>Sommaire</h3>
              <button
                className={s.mobileTocClose}
                onClick={() => setShowMobileToc(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={s.mobileTocBody}>
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToSection(heading.id)}
                  className={`${s.mobileTocItem} ${
                    heading.level === 3 ? s.mobileTocItemH3 : ""
                  } ${activeHeading === heading.id ? s.mobileTocItemActive : ""}`}
                >
                  {heading.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Share modal ═══ */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={s.shareOverlay}
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={s.shareModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={s.shareModalHead}>
                <h3 className={s.shareModalTitle}>Partager</h3>
                <button
                  className={s.shareModalClose}
                  onClick={() => setShowShareModal(false)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="16"
                    height="16"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className={s.shareModalGrid}>
                {shareButtons.map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => handleShare(btn.id)}
                    className={s.shareModalBtn}
                  >
                    <btn.icon />
                    <span className={s.shareModalLabel}>
                      {btn.label}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => handleShare("copy")}
                  className={s.shareModalBtn}
                >
                  {copySuccess ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                  )}
                  <span className={s.shareModalLabel}>
                    {copySuccess ? "Copié" : "Lien"}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollToTopV2 />
    </div>
  );
}
