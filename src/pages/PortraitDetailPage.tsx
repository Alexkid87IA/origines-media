// src/pages/PortraitDetailPage.tsx
// V2 Design — Angular editorial, CSS Modules, inline SVGs

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import Footer2 from '@/components/Footer2';
import LiteYouTube from '@/components/ui/LiteYouTube';
import ScrollToTopV2 from '@/components/ScrollToTop/ScrollToTopV2';
import SEO from '@/components/SEO';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmailCapture from '@/components/EmailCapture';
import { sanityFetch } from '@/lib/sanity';
import { PORTRAIT_BY_SLUG_QUERY, SIMILAR_HISTOIRES_QUERY, ALL_HISTOIRES_SLUGS_QUERY } from '@/lib/queries';
import { typo } from '@/lib/typography';
import { sanityImg } from '@/lib/sanityImage';
import { getTagCategory, getCategoryColors } from '@/lib/tagCategories';
import {
  shareButtons,
} from '@/components/article/SocialIcons';
import s from './PortraitDetailPage.module.css';

/* ────────────────────────────────────────────────────────── */
/*  Types                                                     */
/* ────────────────────────────────────────────────────────── */

interface Tag {
  _id: string;
  nom: string;
  slug: string;
  couleur?: string;
}

interface PortableTextBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{
    _type: string;
    _key: string;
    text?: string;
    marks?: string[];
  }>;
  url?: string;
}

interface Production {
  _id: string;
  titre: string;
  imageUrl?: string;
  slug: string;
  description?: string;
  typeArticle?: string;
  videoUrl?: string;
  contenu?: PortableTextBlock[];
}

interface Portrait {
  _id: string;
  titre: string;
  categorie: string;
  accroche: string;
  imageUrl?: string;
  slug: { current: string };
  biographie?: string;
  citation?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  tags?: Tag[];
  univers?: { _id: string; nom: string; couleur: string };
  productions?: Production[];
}

interface HistoireNav {
  _id: string;
  titre: string;
  categorie?: string;
  slug: string;
  tags?: { nom: string; couleur?: string };
}

interface SimilarHistoire {
  _id: string;
  titre: string;
  categorie?: string;
  accroche?: string;
  slug: string | { current: string };
  citation?: string;
  tags?: Tag[];
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

/* ────────────────────────────────────────────────────────── */
/*  Helpers                                                    */
/* ────────────────────────────────────────────────────────── */

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function renderPortableText(
  blocks: PortableTextBlock[],
  onHeadingsExtracted?: (headings: Heading[]) => void,
): React.ReactNode {
  if (!blocks || blocks.length === 0) return null;

  const headings: Heading[] = [];

  const content = blocks.map((block) => {
    // YouTube block
    if (block._type === 'youtube') {
      const url = block.url;
      if (!url) return null;
      const videoId = getYouTubeId(url);
      if (!videoId) return null;

      return (
        <div key={block._key} className={s.youtubeEmbed}>
          <LiteYouTube videoId={videoId} title="Video YouTube" />
        </div>
      );
    }

    // Text block
    if (block._type === 'block' && block.children) {
      const text = block.children.map((child) => child.text || '').join('');
      if (!text.trim()) return null;

      const id = `section-${block._key}`;

      switch (block.style) {
        case 'h1':
          headings.push({ id, text, level: 1 });
          return <h1 key={block._key} id={id}>{text}</h1>;
        case 'h2':
          headings.push({ id, text, level: 2 });
          return <h2 key={block._key} id={id}>{text}</h2>;
        case 'h3':
          headings.push({ id, text, level: 3 });
          return <h3 key={block._key} id={id}>{text}</h3>;
        case 'blockquote':
          return <blockquote key={block._key}>{text}</blockquote>;
        default:
          return <p key={block._key}>{text}</p>;
      }
    }

    return null;
  });

  if (onHeadingsExtracted && headings.length > 0) {
    setTimeout(() => onHeadingsExtracted(headings), 0);
  }

  return content;
}

/* ────────────────────────────────────────────────────────── */
/*  Component                                                  */
/* ────────────────────────────────────────────────────────── */

export default function PortraitDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [portrait, setPortrait] = useState<Portrait | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  // Navigation
  const [allHistoires, setAllHistoires] = useState<HistoireNav[]>([]);
  const [similarHistoires, setSimilarHistoires] = useState<SimilarHistoire[]>([]);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showMobileToc, setShowMobileToc] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  /* ── Body theme ── */
  useEffect(() => {
    document.body.style.background = 'var(--paper)';
    document.body.style.color = 'var(--ink)';
    return () => {
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, []);

  /* ── Fetch portrait ── */
  useEffect(() => {
    let isMounted = true;

    const fetchPortrait = async () => {
      try {
        if (isMounted) setLoading(true);
        const data = await sanityFetch(PORTRAIT_BY_SLUG_QUERY, { slug });
        if (!isMounted) return;
        if (!data) {
          if (isMounted) navigate('/404');
          return;
        }
        if (isMounted) setPortrait(data);
      } catch {
        if (isMounted) navigate('/404');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (slug) {
      fetchPortrait();
      window.scrollTo(0, 0);
      setHeadings([]);
      setActiveHeading('');
    }

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  /* ── Fetch all histoires for navigation ── */
  useEffect(() => {
    const fetchAllHistoires = async () => {
      try {
        const data = await sanityFetch<HistoireNav[]>(ALL_HISTOIRES_SLUGS_QUERY);
        setAllHistoires(data || []);
      } catch {
        /* silent */
      }
    };
    fetchAllHistoires();
  }, []);

  /* ── Fetch similar histoires ── */
  useEffect(() => {
    if (!portrait) return;
    const fetchSimilar = async () => {
      try {
        const tagIds = portrait.tags?.map((t) => t._id) || [];
        const universId = portrait.univers?._id || '';
        const data = await sanityFetch<SimilarHistoire[]>(SIMILAR_HISTOIRES_QUERY, {
          currentId: portrait._id,
          tagIds,
          universId,
        });
        setSimilarHistoires(data || []);
      } catch {
        /* silent */
      }
    };
    fetchSimilar();
  }, [portrait]);

  /* ── Navigation prev/next ── */
  const { prevHistoire, nextHistoire, currentIndex, totalHistoires } = useMemo(() => {
    if (!slug || allHistoires.length === 0) {
      return { prevHistoire: null, nextHistoire: null, currentIndex: -1, totalHistoires: 0 };
    }
    const idx = allHistoires.findIndex((h) => h.slug === slug);
    return {
      prevHistoire: idx > 0 ? allHistoires[idx - 1] : null,
      nextHistoire: idx < allHistoires.length - 1 ? allHistoires[idx + 1] : null,
      currentIndex: idx,
      totalHistoires: allHistoires.length,
    };
  }, [slug, allHistoires]);

  /* ── Scroll progress + heading spy ── */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      if (headings.length > 0) {
        for (let i = headings.length - 1; i >= 0; i--) {
          const element = document.getElementById(headings[i].id);
          if (element && element.offsetTop <= scrollTop + 150) {
            setActiveHeading(headings[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  /* ── Category colors ── */
  const { mainCategory, colors } = useMemo(() => {
    if (!portrait?.tags || portrait.tags.length === 0) {
      return {
        mainCategory: null,
        colors: getCategoryColors('parcours'),
      };
    }
    for (const tag of portrait.tags) {
      const category = getTagCategory(tag.slug);
      if (category) {
        return {
          mainCategory: category,
          colors: getCategoryColors(category.id),
        };
      }
    }
    return {
      mainCategory: null,
      colors: getCategoryColors('parcours'),
    };
  }, [portrait?.tags]);

  const hasImage = portrait?.imageUrl && !portrait.imageUrl.includes('placeholder');

  /* ── Share handler ── */
  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = portrait?.titre || '';

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank',
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
          '_blank',
        );
        break;
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
          '_blank',
        );
        break;
      case 'telegram':
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          '_blank',
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Je voulais partager cette histoire avec toi : ' + url)}`;
        break;
      case 'copy':
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
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      setShowMobileToc(false);
    }
  };

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
  if (!portrait) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.error}>
          <h1 className={s.errorTitle}>Histoire non trouv&eacute;e</h1>
          <p className={s.errorText}>
            L&rsquo;histoire que vous cherchez n&rsquo;existe pas ou a
            &eacute;t&eacute; d&eacute;plac&eacute;e.
          </p>
          <Link to="/histoires" className={s.errorCta}>
            Retour aux histoires &rarr;
          </Link>
        </div>
        <Footer2 />
      </div>
    );
  }

  /* ── Extract data ── */
  const formattedDate = portrait.dateNaissance
    ? new Date(portrait.dateNaissance).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const categoryLabel = mainCategory?.nom || portrait.categorie || 'Histoire';

  /* ══════════════════════════════════════════════════════════ */
  /*  NAVIGATION FOOTER (prev/next — beautiful inline design)   */
  /* ══════════════════════════════════════════════════════════ */

  const navigationFooterJSX = (
    <div className={s.navFooter}>
      <div className={s.navFooterLabel}>
        <span className={s.navFooterLine} />
        <span className={s.navFooterLabelText}>
          {currentIndex >= 0 ? `Histoire ${currentIndex + 1} sur ${totalHistoires}` : 'Continuer la lecture'}
        </span>
        <span className={s.navFooterLine} />
      </div>

      {(prevHistoire || nextHistoire) && (
        <div className={s.navFooterGrid}>
          {prevHistoire ? (
            <Link to={`/histoire/${prevHistoire.slug}`} className={s.navCard}>
              <span className={s.navCardDir}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Pr&eacute;c&eacute;dente
              </span>
              <h4 className={s.navCardTitle}>{typo(prevHistoire.titre)}</h4>
              {prevHistoire.categorie && (
                <span className={s.navCardCat}>{prevHistoire.categorie}</span>
              )}
            </Link>
          ) : (
            <div />
          )}

          {nextHistoire ? (
            <Link to={`/histoire/${nextHistoire.slug}`} className={`${s.navCard} ${s.navCardEnd}`}>
              <span className={s.navCardDir}>
                Suivante
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <h4 className={s.navCardTitle}>{typo(nextHistoire.titre)}</h4>
              {nextHistoire.categorie && (
                <span className={s.navCardCat}>{nextHistoire.categorie}</span>
              )}
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}

      {similarHistoires.length > 0 && (
        <div className={s.navSimilar}>
          <span className={s.navSimilarLabel}>Histoires similaires</span>
          <div className={s.navSimilarGrid}>
            {similarHistoires.slice(0, 3).map((h) => {
              const hSlug = typeof h.slug === 'string' ? h.slug : h.slug?.current;
              if (!hSlug) return null;
              return (
                <Link key={h._id} to={`/histoire/${hSlug}`} className={s.navSimilarCard}>
                  <h5 className={s.navSimilarTitle}>{typo(h.titre)}</h5>
                  {h.citation && (
                    <p className={s.navSimilarCitation}>&ldquo;{h.citation}&rdquo;</p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <Link to="/histoires" className={s.navFooterAllLink}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
        </svg>
        Voir toutes les histoires
      </Link>
    </div>
  );

  /* ══════════════════════════════════════════════════════════ */
  /*  RENDER — no-image layout                                  */
  /* ══════════════════════════════════════════════════════════ */

  if (!hasImage) {
    return (
      <div className={s.page}>
        <SEO
          title={portrait.titre}
          description={
            portrait.accroche ||
            portrait.citation ||
            `Decouvrez l'histoire de ${portrait.titre} sur Origines Media.`
          }
          image={portrait.imageUrl}
          url={`/histoire/${portrait.slug?.current || slug}`}
          type="profile"
          jsonLd="person"
          breadcrumbs={[
            { name: 'Accueil', url: '/' },
            { name: 'Histoires', url: '/histoires' },
            { name: portrait.titre, url: `/histoire/${portrait.slug?.current || slug}` },
          ]}
        />

        {/* Progress Bar */}
        <div className={s.progressBar} style={{ width: `${scrollProgress}%` }} />

        <SiteHeader />

        <main>
          {/* Hero Banner (colored, no image) */}
          <div className={s.heroBanner} style={{ backgroundColor: colors.bg }}>
            {/* Nav */}
            <div className={s.heroBannerNav}>
              <button onClick={() => navigate(-1)} className={s.heroBannerNavBack}>
                <span className={s.heroBannerBackCircle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </span>
                <span>Retour</span>
              </button>
              <div className={s.heroBannerActions}>
                <button
                  onClick={() => setLiked(!liked)}
                  className={liked ? s.heroBannerBtnActive : s.heroBannerBtn}
                  aria-label={liked ? "Retirer le j'aime" : "J'aime"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={liked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
                <button
                  className={s.heroBannerBtn}
                  onClick={() => setShowShareModal(true)}
                  aria-label="Partager"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className={s.heroBannerInner} style={{ paddingTop: 48 }}>
              <p className={s.heroKicker} style={{ color: 'rgba(255,255,255,0.7)' }}>
                {categoryLabel}
              </p>

              <h1 className={s.heroTitle} style={{ color: '#fff' }}>
                {typo(portrait.titre)}
              </h1>

              <p className={s.heroAccroche} style={{ color: 'rgba(255,255,255,0.8)' }}>
                {typo(portrait.accroche)}
              </p>

              {(formattedDate || portrait.lieuNaissance) && (
                <div className={s.heroMeta} style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {formattedDate && (
                    <span className={s.heroMetaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      N&eacute;(e) le {formattedDate}
                    </span>
                  )}
                  {portrait.lieuNaissance && (
                    <span className={s.heroMetaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {portrait.lieuNaissance}
                    </span>
                  )}
                </div>
              )}

              {portrait.citation && (
                <div
                  className={s.heroCitation}
                  style={{ borderColor: 'rgba(255,255,255,0.25)' }}
                >
                  <svg
                    className={s.heroCitationQuote}
                    viewBox="0 0 24 24"
                    fill="rgba(255,255,255,0.3)"
                    stroke="none"
                  >
                    <path d="M10 11l-2 0a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v6a4 4 0 01-4 4M20 11l-2 0a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v6a4 4 0 01-4 4" />
                  </svg>
                  <p className={s.heroCitationText} style={{ color: 'rgba(255,255,255,0.9)' }}>
                    &ldquo;{typo(portrait.citation)}&rdquo;
                  </p>
                </div>
              )}

              {portrait.tags && portrait.tags.length > 0 && (
                <div className={s.heroTags}>
                  {portrait.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className={s.heroTag}
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.8)',
                      }}
                    >
                      {tag.nom}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content — centered, no sidebar */}
          <section className={s.contentSection}>
            <div className={s.contentCentered}>
              <Breadcrumb items={[
                { name: 'Accueil', url: '/' },
                { name: 'Histoires', url: '/histoires' },
                { name: portrait.titre, url: `/histoire/${portrait.slug?.current || slug}` },
              ]} />

              <div ref={contentRef} className={s.articleBody}>
                {portrait.productions &&
                  portrait.productions.length > 0 &&
                  portrait.productions[0].contenu && (
                    <div className={s.prose}>
                      {renderPortableText(portrait.productions[0].contenu, setHeadings)}
                    </div>
                  )}

                {portrait.biographie &&
                  (!portrait.productions || portrait.productions.length === 0) && (
                    <div className={s.bioSection}>
                      <h2 className={s.bioTitle}>
                        <svg viewBox="0 0 24 24" fill="none" stroke={colors.bg} strokeWidth="1.8">
                          <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                        </svg>
                        L&rsquo;histoire
                      </h2>
                      <p className={s.bioText}>{typo(portrait.biographie)}</p>
                    </div>
                  )}

                {navigationFooterJSX}
              </div>
            </div>
          </section>
        </main>

        <section className={s.endNl}>
          <div className={s.endNlInner}>
            <h3 className={s.endNlTitle}>Cette histoire vous a touch&eacute;&nbsp;?</h3>
            <p className={s.endNlDeck}>
              Recevez nos plus beaux r&eacute;cits chaque semaine,
              directement dans votre bo&icirc;te mail.
            </p>
            <EmailCapture
              source="portrait"
              variant="inline"
              placeholder="votre@email.com"
              buttonText="S'abonner"
              successMessage="Merci !"
              successDescription="Vous recevrez notre prochaine newsletter vendredi."
            />
          </div>
        </section>

        <div className={s.scrollTopSection}>
          <button
            className={s.scrollTopBtn}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 15l-6-6-6 6" />
            </svg>
            Retour en haut
          </button>
        </div>

        <Footer2 />
        {renderMobileBar()}
        {renderMobileToc()}
        {renderShareModal()}

        <div className={s.scrollTopWrap}>
          <ScrollToTopV2 />
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════ */
  /*  RENDER — with image layout                                */
  /* ══════════════════════════════════════════════════════════ */

  return (
    <div className={s.page}>
      <SEO
        title={portrait.titre}
        description={
          portrait.accroche ||
          portrait.citation ||
          `Decouvrez l'histoire de ${portrait.titre} sur Origines Media.`
        }
        image={portrait.imageUrl}
        url={`/histoire/${portrait.slug?.current || slug}`}
        type="profile"
        jsonLd="person"
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Histoires', url: '/histoires' },
          { name: portrait.titre, url: `/histoire/${portrait.slug?.current || slug}` },
        ]}
      />

      {/* Progress Bar */}
      <div className={s.progressBar} style={{ width: `${scrollProgress}%` }} />

      <SiteHeader />

      <main>
        {/* Hero with image */}
        <div style={{ position: 'relative' }}>
          {/* Navigation overlay */}
          <div className={s.heroNav}>
            <button onClick={() => navigate(-1)} className={s.heroNavBack}>
              <span className={s.heroNavBackCircle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </span>
              <span>Retour</span>
            </button>

            <div className={s.heroNavActions}>
              <button
                onClick={() => setLiked(!liked)}
                className={liked ? s.heroNavBtnActive : s.heroNavBtn}
                aria-label={liked ? "Retirer le j'aime" : "J'aime"}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={liked ? '#ef4444' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
              <button
                className={s.heroNavBtn}
                onClick={() => setShowShareModal(true)}
                aria-label="Partager"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                </svg>
              </button>
            </div>
          </div>

          {/* Two-column hero */}
          <div className={s.heroGrid}>
            {/* Image column */}
            <div className={s.heroImgCol}>
              <img
                className={s.heroImgBg}
                src={sanityImg(portrait.imageUrl, 1200)}
                alt={portrait.titre}
                loading="eager"
                decoding="async"
              />
              <div className={s.heroImgOverlay} />
            </div>

            {/* Content column */}
            <div className={s.heroContentCol}>
              <p className={s.heroKicker} style={{ color: colors.bg }}>
                {categoryLabel}
              </p>

              <h1 className={s.heroTitle} style={{ color: 'var(--ink)' }}>
                {typo(portrait.titre)}
              </h1>

              <p className={s.heroAccroche} style={{ color: 'var(--stone600)' }}>
                {typo(portrait.accroche)}
              </p>

              {(formattedDate || portrait.lieuNaissance) && (
                <div className={s.heroMeta} style={{ color: 'var(--stone500)' }}>
                  {formattedDate && (
                    <span className={s.heroMetaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      N&eacute;(e) le {formattedDate}
                    </span>
                  )}
                  {portrait.lieuNaissance && (
                    <span className={s.heroMetaItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {portrait.lieuNaissance}
                    </span>
                  )}
                </div>
              )}

              {portrait.citation && (
                <div
                  className={s.heroCitation}
                  style={{ borderColor: `${colors.bg}30`, background: `${colors.bg}08` }}
                >
                  <svg
                    className={s.heroCitationQuote}
                    viewBox="0 0 24 24"
                    fill={`${colors.bg}40`}
                    stroke="none"
                  >
                    <path d="M10 11l-2 0a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v6a4 4 0 01-4 4M20 11l-2 0a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v6a4 4 0 01-4 4" />
                  </svg>
                  <p className={s.heroCitationText} style={{ color: 'var(--stone700)' }}>
                    &ldquo;{typo(portrait.citation)}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content — centered, no sidebar */}
        <section className={s.contentSection}>
          <div className={s.contentCentered}>
            <Breadcrumb items={[
              { name: 'Accueil', url: '/' },
              { name: 'Histoires', url: '/histoires' },
              { name: portrait.titre, url: `/histoire/${portrait.slug?.current || slug}` },
            ]} />

            <div ref={contentRef} className={s.articleBody}>
              {portrait.productions &&
                portrait.productions.length > 0 &&
                portrait.productions[0].contenu && (
                  <div className={s.prose}>
                    {renderPortableText(portrait.productions[0].contenu, setHeadings)}
                  </div>
                )}

              {portrait.biographie &&
                (!portrait.productions || portrait.productions.length === 0) && (
                  <div className={s.bioSection}>
                    <h2 className={s.bioTitle}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={colors.bg} strokeWidth="1.8">
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                      </svg>
                      L&rsquo;histoire
                    </h2>
                    <p className={s.bioText}>{typo(portrait.biographie)}</p>
                  </div>
                )}

              {navigationFooterJSX}
            </div>
          </div>
        </section>
      </main>

      <section className={s.endNl}>
        <div className={s.endNlInner}>
          <h3 className={s.endNlTitle}>Cette histoire vous a touch&eacute;&nbsp;?</h3>
          <p className={s.endNlDeck}>
            Recevez nos plus beaux r&eacute;cits chaque semaine,
            directement dans votre bo&icirc;te mail.
          </p>
          <EmailCapture
            source="portrait"
            variant="inline"
            placeholder="votre@email.com"
            buttonText="S'abonner"
            successMessage="Merci !"
            successDescription="Vous recevrez notre prochaine newsletter vendredi."
          />
        </div>
      </section>

      <div className={s.scrollTopSection}>
        <button
          className={s.scrollTopBtn}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 15l-6-6-6 6" />
          </svg>
          Retour en haut
        </button>
      </div>

      <Footer2 />
      {renderMobileBar()}
      {renderMobileToc()}
      {renderShareModal()}

      <div className={s.scrollTopWrap}>
        <ScrollToTopV2 />
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════ */
  /*  Shared render helpers (mobile bar, mobile TOC, share)     */
  /* ══════════════════════════════════════════════════════════ */

  function renderMobileBar() {
    return (
      <div className={s.mobileBar}>
        <div className={s.mobileBarInner}>
          {headings.length > 0 && (
            <button
              className={s.mobileBarBtn}
              onClick={() => setShowMobileToc(true)}
              aria-label="Ouvrir le sommaire"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </button>
          )}

          <button
            onClick={() => setLiked(!liked)}
            className={liked ? s.mobileBarBtnActive : s.mobileBarBtn}
            aria-label={liked ? "Retirer le j'aime" : "J'aime"}
          >
            <svg
              viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'}
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            Partager
          </button>

          <button
            onClick={() => {
              /* bookmark placeholder */
            }}
            className={s.mobileBarBtn}
            aria-label="Ajouter aux favoris"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  function renderMobileToc() {
    return (
      <>
        {showMobileToc && (
          <div
            className={`${s.mobileTocOverlay} ${s.mobileTocOverlayOpen}`}
            onClick={() => setShowMobileToc(false)}
          >
            <div className={s.mobileTocPanel} onClick={(e) => e.stopPropagation()}>
              <div className={s.mobileTocHeader}>
                <h3 className={s.mobileTocTitle}>Sommaire</h3>
                <button
                  className={s.mobileTocClose}
                  onClick={() => setShowMobileToc(false)}
                  aria-label="Fermer le sommaire"
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
                      heading.level === 3 ? s.mobileTocItemH3 : ''
                    } ${activeHeading === heading.id ? s.mobileTocItemActive : ''}`}
                  >
                    {heading.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  function renderShareModal() {
    return (
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
                  aria-label="Fermer"
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
                    <span className={s.shareModalLabel}>{btn.label}</span>
                  </button>
                ))}
                <button
                  onClick={() => handleShare('copy')}
                  className={s.shareModalBtn}
                >
                  {copySuccess ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                  )}
                  <span className={s.shareModalLabel}>
                    {copySuccess ? 'Copie' : 'Lien'}
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}
