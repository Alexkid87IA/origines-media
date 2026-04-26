// src/pages/ShareStoryPage.tsx
// Page "Racontez votre histoire" — V2 angular editorial design

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import Ticker from '@/components/Ticker/Ticker';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import Marquee from '@/components/Marquee/Marquee';
import Footer2 from '@/components/Footer2/Footer2';
import ScrollToTopV2 from '@/components/ScrollToTop/ScrollToTopV2';
import { sanityFetch } from '../lib/sanity';
import { VIDEOS_SECTION_QUERY } from '../lib/queries';
import s from './ShareStoryPage.module.css';

// ============ TYPES ============

interface SanityVideo {
  _id: string;
  titre: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  duree?: string;
  slug: string;
  verticale?: {
    _id: string;
    nom: string;
    couleurDominante?: string;
    slug: string;
  };
}

// ============ DATA ============

const FEATURED_VIDEO_SLUG = 'lettre-a-la-jeune-louane-hyperactivite-deuil-et-succes';

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const processSteps = [
  {
    number: '01',
    title: 'Premier contact',
    desc: 'Remplissez le formulaire en 2 minutes. Parlez-nous de vous et de votre histoire.',
    detail: 'Réponse sous 48h',
  },
  {
    number: '02',
    title: 'Appel découverte',
    desc: 'On vous rappelle pour faire connaissance. 20 minutes pour comprendre votre parcours.',
    detail: 'Sans engagement',
  },
  {
    number: '03',
    title: 'Préparation',
    desc: 'On structure ensemble votre récit. Coaching personnalisé si besoin.',
    detail: 'À votre rythme',
  },
  {
    number: '04',
    title: 'Création',
    desc: 'Tournage, rédaction ou enregistrement avec notre équipe professionnelle.',
    detail: 'Qualité pro',
  },
];

const reasons = [
  {
    title: 'Aider quelqu\'un',
    desc: 'Votre histoire pourrait être exactement ce dont quelqu\'un a besoin aujourd\'hui',
    stat: '2M+',
    statLabel: 'messages reçus',
    color: '#EC4899',
  },
  {
    title: 'Donner du sens',
    desc: 'Transformez votre vécu en quelque chose de plus grand que vous',
    stat: '89%',
    statLabel: 'se sentent libérés',
    color: '#F59E0B',
  },
  {
    title: 'Rejoindre une communauté',
    desc: 'Faites partie d\'un mouvement de 1 000+ personnes qui osent raconter',
    stat: '1K+',
    statLabel: 'témoins actifs',
    color: '#8B5CF6',
  },
  {
    title: 'Créer un héritage',
    desc: 'Laissez une trace qui inspirera encore dans 10, 20, 50 ans',
    stat: '10B+',
    statLabel: 'vues totales',
    color: '#10B981',
  },
];

const impactStats = [
  { value: '10B+', label: 'vues cumulées' },
  { value: '1 000+', label: 'histoires partagées' },
  { value: '2M+', label: 'messages de soutien' },
  { value: '45+', label: 'pays touchés' },
];

const formats = [
  {
    id: 'video',
    title: 'Vidéo',
    subtitle: 'Le plus impactant',
    desc: 'Tournage pro chez vous ou en studio.',
    duration: '4-6 semaines',
    color: '#EC4899',
    popular: true,
  },
  {
    id: 'article',
    title: 'Article',
    subtitle: 'Pour les plumes',
    desc: 'Vous écrivez, on édite ensemble.',
    duration: '2-4 semaines',
    color: '#6366F1',
    popular: false,
  },
  {
    id: 'podcast',
    title: 'Podcast',
    subtitle: 'En toute intimité',
    desc: 'Juste votre voix, idéal pour l\'anonymat.',
    duration: '2-3 semaines',
    color: '#10B981',
    popular: false,
  },
  {
    id: 'livre',
    title: 'Livre',
    subtitle: 'Pour les épopées',
    desc: 'Votre histoire en version longue.',
    duration: '3-6 mois',
    color: '#F59E0B',
    popular: false,
  },
  {
    id: 'documentaire',
    title: 'Documentaire',
    subtitle: 'L\'immersion totale',
    desc: 'Format long, plusieurs témoins.',
    duration: '6-12 mois',
    color: '#EF4444',
    popular: false,
  },
  {
    id: 'lettre',
    title: 'Lettre',
    subtitle: 'Court et sincère',
    desc: 'Une lettre ouverte, anonyme ou signée.',
    duration: '1-2 semaines',
    color: '#2E94B5',
    popular: false,
  },
];

const participantTestimonials = [
  {
    quote: "J'avais peur de me livrer. L'équipe m'a mise tellement à l'aise que j'ai oublié la caméra.",
    author: 'Nadia K.',
    role: 'A partagé en vidéo',
    image: '/placeholder.svg',
    color: '#8B5CF6',
  },
  {
    quote: "Je reçois encore des messages de personnes que mon témoignage a aidées. C'est incroyable.",
    author: 'Thomas R.',
    role: 'A partagé en vidéo',
    image: '/placeholder.svg',
    color: '#F59E0B',
  },
  {
    quote: "Le podcast m'a permis de raconter sans montrer mon visage. C'était parfait pour moi.",
    author: 'Anonyme',
    role: 'A partagé en podcast',
    image: '/placeholder.svg',
    color: '#10B981',
  },
];

const faqs = [
  { q: "C'est vraiment gratuit ?", a: "Oui, 100% gratuit. Notre mission est de donner la parole." },
  { q: 'Qui peut participer ?', a: "Tout le monde. Chaque histoire compte, même les plus simples." },
  { q: 'Je peux rester anonyme ?', a: 'Absolument. Pseudonyme, voix modifiée, visage flouté.' },
  { q: "J'ai le droit de relecture ?", a: "Bien sûr. Vous validez tout avant publication." },
  { q: 'Ça prend combien de temps ?', a: 'De 2 semaines à 6 mois selon le format choisi.' },
  { q: 'Et si je change d\'avis ?', a: "Vous pouvez vous retirer à tout moment." },
];

// ============ INLINE SVG ICONS ============

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
  </svg>
);

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FileTextIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const VideoIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="4" width="15" height="16" rx="0" />
    <path d="M17 8l5-3v14l-5-3" />
  </svg>
);

const PenIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const MicIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
  </svg>
);

const BookIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  </svg>
);

const FilmIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="0" />
    <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
  </svg>
);

const MailIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 4L12 13 2 4" />
  </svg>
);

// Map format id to icon component
const formatIconMap: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  video: VideoIcon,
  article: PenIcon,
  podcast: MicIcon,
  livre: BookIcon,
  documentaire: FilmIcon,
  lettre: MailIcon,
};

// Map impact stat index to icon
const impactIcons = [EyeIcon, FileTextIcon, MessageIcon, GlobeIcon];

// ============ COMPONENT ============

const ShareStoryPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [featuredVideo, setFeaturedVideo] = useState<SanityVideo | null>(null);
  const [randomVideos, setRandomVideos] = useState<SanityVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videos = await sanityFetch(VIDEOS_SECTION_QUERY) as SanityVideo[];

        if (videos && videos.length > 0) {
          const featured = videos.find(v => v.slug === FEATURED_VIDEO_SLUG);
          if (featured) {
            setFeaturedVideo(featured);
          }

          const otherVideos = videos.filter(v => v.slug !== FEATURED_VIDEO_SLUG);
          const shuffled = shuffleArray(otherVideos).slice(0, 6);
          setRandomVideos(shuffled);
        }
      } catch (error) {
        console.error('Erreur fetch videos:', error);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <>
      <SEO
        title="Racontez votre histoire"
        description="Partagez votre parcours et inspirez des milliers de personnes. 100% gratuit, accompagnement personnalisé."
        url="/racontez-votre-histoire"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Racontez votre histoire", url: "/racontez-votre-histoire" },
        ]}
      />

      <Ticker />
      <SiteHeader />

      <main className={s.page}>

        {/* ============ 1. HERO ============ */}
        <section className={s.hero}>
          <div className={s.inner}>
            <div className={s.heroGrid}>

              {/* Left - Content */}
              <div className={s.heroContent}>
                <div className={s.chapterMark}>
                  <span className={s.cNum}>Ch.01</span>
                  <span className={s.cSep}>/</span>
                  <span className={s.cLabel}>Racontez votre histoire</span>
                </div>

                <h1 className={s.heroTitle}>
                  Votre histoire{' '}
                  <em>mérite d'être entendue</em>
                </h1>

                <p className={s.heroDeck}>
                  Vous avez traversé quelque chose d'important ? Partagez votre parcours
                  et inspirez des milliers de personnes qui vivent la même chose.
                </p>

                <a href="#formulaire" className={s.heroCta}>
                  Je veux raconter mon histoire
                  <ArrowRightIcon className={s.heroCtaArrow} />
                </a>

                <div className={s.heroChecks}>
                  <span className={s.heroCheck}>
                    <CheckIcon className={s.heroCheckIcon} />
                    100% gratuit
                  </span>
                  <span className={s.heroCheck}>
                    <CheckIcon className={s.heroCheckIcon} />
                    Accompagnement pro
                  </span>
                  <span className={s.heroCheck}>
                    <CheckIcon className={s.heroCheckIcon} />
                    1 000+ histoires
                  </span>
                </div>
              </div>

              {/* Right - Featured video card */}
              <div>
                {featuredVideo ? (
                  <Link
                    to={`/video/${featuredVideo.slug}`}
                    className={s.featuredCard}
                  >
                    <div className={s.featuredThumb}>
                      <img
                        src={featuredVideo.imageUrl || '/placeholder.svg'}
                        alt={featuredVideo.titre}
                      />
                      <div className={s.featuredOverlay} />

                      {/* Play button */}
                      <div className={s.featuredPlay}>
                        <div className={s.featuredPlayBtn}>
                          <PlayIcon />
                        </div>
                      </div>

                      {/* Duration */}
                      {featuredVideo.duree && (
                        <div className={s.featuredDuration}>
                          {featuredVideo.duree}
                        </div>
                      )}

                      {/* Meta */}
                      <div className={s.featuredMeta}>
                        {featuredVideo.verticale && (
                          <div
                            className={s.featuredBadge}
                            style={{ backgroundColor: featuredVideo.verticale.couleurDominante || '#8B5CF6' }}
                          >
                            <span className={s.featuredBadgeDot} />
                            {featuredVideo.verticale.nom}
                          </div>
                        )}
                        <h2 className={s.featuredTitle}>
                          {featuredVideo.titre}
                        </h2>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className={s.featuredSkeleton} />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============ 2. COMMENT CA MARCHE ============ */}
        <section className={s.process}>
          <div className={s.inner}>
            <div className={s.chapterMarkDark}>
              <span className={s.cNum}>Ch.02</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Processus</span>
            </div>
            <h2 className={s.processTitle}>Comment ça marche ?</h2>

            <div className={s.processGrid}>
              {processSteps.map((step, index) => (
                <div key={index} className={s.processCard}>
                  <div className={s.processNumber}>{step.number}</div>
                  <h3 className={s.processCardTitle}>{step.title}</h3>
                  <p className={s.processCardDesc}>{step.desc}</p>
                  <span className={s.processDetail}>
                    <CheckIcon className={s.processDetailIcon} />
                    {step.detail}
                  </span>
                </div>
              ))}
            </div>

            <div className={s.processCta}>
              <a href="#formulaire" className={s.processCtaBtn}>
                Commencer maintenant
                <ArrowRightIcon />
              </a>
            </div>
          </div>
        </section>

        {/* ============ 3. NOS HISTOIRES ============ */}
        <section className={s.stories}>
          <div className={s.inner}>
            <div className={s.chapterMark}>
              <span className={s.cNum}>Ch.03</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Communaut&eacute;</span>
            </div>
            <div className={s.storiesHeader}>
              <div className={s.storiesLabel}>
                <h2 className={s.storiesTitle}>Des histoires qui <em>inspirent.</em></h2>
              </div>
              <Link to="/videos" className={s.storiesLink}>
                Voir tout
                <ArrowRightIcon />
              </Link>
            </div>

            <div className={s.storiesGrid}>
              {isLoadingVideos ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={s.storySkeleton} />
                ))
              ) : (
                randomVideos.map((video) => (
                  <Link
                    key={video._id}
                    to={`/video/${video.slug}`}
                    className={s.storyCard}
                  >
                    <div className={s.storyThumb}>
                      <img
                        src={video.imageUrl || '/placeholder.svg'}
                        alt={video.titre}
                      />
                      <div className={s.storyOverlay} />

                      {/* Play icon */}
                      <div className={s.storyPlayIcon}>
                        <PlayIcon />
                      </div>

                      {/* Duration */}
                      {video.duree && (
                        <div className={s.storyDuration}>
                          {video.duree}
                        </div>
                      )}

                      {/* Content */}
                      <div className={s.storyMeta}>
                        {video.verticale && (
                          <div className={s.storyCategory}>
                            <span
                              className={s.storyCatDot}
                              style={{ backgroundColor: video.verticale.couleurDominante || '#8B5CF6' }}
                            />
                            {video.verticale.nom}
                          </div>
                        )}
                        <h3 className={s.storyTitle}>
                          {video.titre}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ============ 4. POURQUOI PARTAGER ============ */}
        <section className={s.reasons}>
          <div className={s.inner}>
            <div className={s.chapterMarkDark}>
              <span className={s.cNum}>Ch.04</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>L&rsquo;impact</span>
            </div>
            <h2 className={s.reasonsTitle}>Pourquoi partager votre histoire ?</h2>
            <p className={s.reasonsDeck}>
              Chaque témoignage a le pouvoir de transformer des vies.
              Voici ce qui se passe quand vous osez raconter.
            </p>

            <div className={s.reasonsGrid}>
              {reasons.map((reason, index) => (
                <div key={index} className={s.reasonCard}>
                  <div className={s.reasonStat} style={{ color: reason.color }}>
                    {reason.stat}
                  </div>
                  <div className={s.reasonIcon} style={{ background: `${reason.color}18` }}>
                    <HeartIcon style={{ color: reason.color }} />
                  </div>
                  <h3 className={s.reasonCardTitle}>{reason.title}</h3>
                  <p className={s.reasonCardDesc}>{reason.desc}</p>
                  <span className={s.reasonStatLabel} style={{ color: reason.color }}>
                    <span className={s.reasonStatDot} style={{ backgroundColor: reason.color }} />
                    {reason.statLabel}
                  </span>
                </div>
              ))}
            </div>

            <div className={s.reasonsCta}>
              <a href="#formulaire" className={s.reasonsCtaBtn}>
                Je veux faire partie de l'aventure
                <ArrowRightIcon />
              </a>
            </div>
          </div>
        </section>

        {/* ============ 5. IMPACT STATS ============ */}
        <section className={s.impact}>
          <div className={s.inner}>
            <div className={s.chapterMarkDark}>
              <span className={s.cNum}>Ch.05</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>En chiffres</span>
            </div>
            <div className={s.impactGrid}>
              {impactStats.map((stat, index) => {
                const Icon = impactIcons[index];
                return (
                  <div key={index} className={s.impactCard}>
                    <Icon className={s.impactIcon} />
                    <p className={s.impactValue}>{stat.value}</p>
                    <p className={s.impactLabel}>{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ 6. NOS FORMATS ============ */}
        <section className={s.formats}>
          <div className={s.inner}>
            <div className={s.chapterMark}>
              <span className={s.cNum}>Ch.06</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Formats</span>
            </div>
            <div className={s.formatsHeader}>
              <h2 className={s.formatsTitle}>Choisissez votre <em>format.</em></h2>
              <p className={s.formatsDeck}>
                Cinq façons de raconter, selon vos envies
              </p>
            </div>

            <div className={s.formatsGrid}>
              {formats.map((format) => {
                const FormatIcon = formatIconMap[format.id];
                return (
                  <div
                    key={format.id}
                    className={`${s.formatCard} ${format.popular ? s.formatPopular : ''}`}
                  >
                    {format.popular && (
                      <div className={s.formatPopularTag}>Populaire</div>
                    )}

                    <div className={s.formatIcon}>
                      {FormatIcon && <FormatIcon style={{ color: format.color }} />}
                    </div>

                    <h3 className={s.formatCardTitle}>{format.title}</h3>
                    <p className={s.formatSubtitle}>{format.subtitle}</p>
                    <p className={s.formatDesc}>{format.desc}</p>

                    <div className={s.formatDuration}>
                      <ClockIcon />
                      {format.duration}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ 7. TEMOIGNAGES PARTICIPANTS ============ */}
        <section className={s.testimonials}>
          <div className={s.inner}>
            <div className={s.chapterMark}>
              <span className={s.cNum}>Ch.07</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>T&eacute;moignages</span>
            </div>
            <div className={s.testimonialsHeader}>
              <h2 className={s.testimonialsTitle}>Ils ont partag&eacute; leur <em>histoire.</em></h2>
              <p className={s.testimonialsDeck}>Ce qu&rsquo;ils disent de l&rsquo;exp&eacute;rience</p>
            </div>

            <div className={s.testimonialsGrid}>
              {participantTestimonials.map((testimonial, index) => (
                <div key={index} className={s.testimonialCard}>
                  <div
                    className={s.testimonialAccent}
                    style={{ backgroundColor: testimonial.color }}
                  />
                  <div className={s.testimonialQuoteMark}>"</div>
                  <p className={s.testimonialText}>
                    {testimonial.quote}
                  </p>
                  <div className={s.testimonialAuthor}>
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className={s.testimonialAvatar}
                      style={{ borderColor: testimonial.color }}
                    />
                    <div>
                      <p className={s.testimonialName}>{testimonial.author}</p>
                      <p className={s.testimonialRole}>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 8. FORMULAIRE ============ */}
        <section id="formulaire" className={s.formSection}>
          <div className={s.inner}>
            <div className={s.chapterMarkDark}>
              <span className={s.cNum}>Ch.08</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>Participez</span>
            </div>
            <div className={s.formSectionHeader}>
              <div className={s.formKicker}>
                <HeartIcon />
                Rejoignez 1 000+ t&eacute;moins
              </div>
              <h2 className={s.formSectionTitle}>
                Pr&ecirc;t(e) &agrave; partager votre <em>histoire&thinsp;?</em>
              </h2>
              <p className={s.formSectionDeck}>
                Choisissez votre format. Chaque parcours a sa forme id&eacute;ale.
              </p>
            </div>

            {/* Format selection — always visible */}
            <div className={s.formCard}>
              <div className={s.formatSelector}>
                <span className={s.formatSelectorLabel}>Choisissez votre format</span>
                <div className={s.formatSelectorGrid}>
                  {formats.map((f) => {
                    const isSelected = selectedFormat === f.id;
                    const FmtIcon = formatIconMap[f.id];
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => { setSelectedFormat(f.id); setIsSubmitted(false); }}
                        className={`${s.formatSelectorBtn} ${isSelected ? s.formatSelectorBtnActive : ''}`}
                      >
                        {FmtIcon && (
                          <FmtIcon
                            style={{ color: isSelected ? '#fff' : f.color }}
                          />
                        )}
                        <span className={s.formatSelectorBtnLabel}>{f.title}</span>
                        {isSelected && (
                          <span className={s.formatSelectorCheck}>
                            <CheckIcon />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── ARTICLE → direct writing tool ── */}
              {selectedFormat === 'article' && (
                <div className={s.form}>
                  <div className={s.formatExplain}>
                    <PenIcon className={s.formatExplainIcon} style={{ color: '#6366F1' }} />
                    <div>
                      <h3 className={s.formatExplainTitle}>&Eacute;crivez directement sur Origines</h3>
                      <p className={s.formatExplainDesc}>
                        Notre outil d&rsquo;&eacute;criture guid&eacute; vous accompagne pas &agrave; pas.
                        Anonymat garanti, sauvegarde automatique, relecture avant publication.
                        R&eacute;serv&eacute; aux membres inscrits — c&rsquo;est gratuit.
                      </p>
                    </div>
                  </div>
                  <Link to="/ecrire-mon-histoire" className={s.submitBtn}>
                    Commencer &agrave; &eacute;crire
                    <ArrowRightIcon className={s.submitBtnIcon} />
                  </Link>
                  <div className={s.guarantees}>
                    <span className={s.guarantee}>
                      <ShieldIcon />
                      Anonymat garanti
                    </span>
                    <span className={s.guarantee}>
                      <ClockIcon />
                      Sauvegarde auto
                    </span>
                    <span className={s.guarantee}>
                      <CheckIcon />
                      100% gratuit
                    </span>
                  </div>
                </div>
              )}

              {/* ── VIDEO → contact form ── */}
              {selectedFormat === 'video' && !isSubmitted && (
                <form onSubmit={handleSubmit} className={s.form}>
                  <div className={s.formatExplain}>
                    <VideoIcon className={s.formatExplainIcon} style={{ color: '#EC4899' }} />
                    <div>
                      <h3 className={s.formatExplainTitle}>Tournage vid&eacute;o professionnel</h3>
                      <p className={s.formatExplainDesc}>
                        Notre &eacute;quipe vous accompagne de A &agrave; Z : coaching, tournage
                        chez vous ou en studio, montage pro. 100% gratuit. On vous recontacte sous 48h.
                      </p>
                    </div>
                  </div>

                  <div className={s.fieldRow}>
                    <div className={s.fieldGroup}>
                      <label className={s.label}>Pr&eacute;nom</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={s.input} placeholder="Marie" required />
                    </div>
                    <div className={s.fieldGroup}>
                      <label className={s.label}>Email</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={s.input} placeholder="marie@exemple.com" required />
                    </div>
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>T&eacute;l&eacute;phone <span className={s.labelOptional}>(optionnel)</span></label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={s.input} placeholder="06 12 34 56 78" />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Votre histoire en quelques mots</label>
                    <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} className={s.textarea} placeholder="J'aimerais partager mon parcours sur..." required />
                  </div>

                  <button type="submit" disabled={isSubmitting} className={s.submitBtn}>
                    {isSubmitting ? (<><span className={s.spinner} />Envoi en cours...</>) : (<>Envoyer ma demande<SendIcon /></>)}
                  </button>
                  <div className={s.guarantees}>
                    <span className={s.guarantee}><ShieldIcon />Donn&eacute;es prot&eacute;g&eacute;es</span>
                    <span className={s.guarantee}><ClockIcon />R&eacute;ponse sous 48h</span>
                    <span className={s.guarantee}><CheckIcon />100% gratuit</span>
                  </div>
                </form>
              )}

              {/* ── PODCAST / LIVRE / DOCUMENTAIRE → coproduction ── */}
              {(selectedFormat === 'podcast' || selectedFormat === 'livre' || selectedFormat === 'documentaire') && !isSubmitted && (
                <form onSubmit={handleSubmit} className={s.form}>
                  <div className={s.formatExplain}>
                    {selectedFormat === 'podcast' && <MicIcon className={s.formatExplainIcon} style={{ color: '#10B981' }} />}
                    {selectedFormat === 'livre' && <BookIcon className={s.formatExplainIcon} style={{ color: '#F59E0B' }} />}
                    {selectedFormat === 'documentaire' && <FilmIcon className={s.formatExplainIcon} style={{ color: '#EF4444' }} />}
                    <div>
                      <h3 className={s.formatExplainTitle}>Mod&egrave;le de coproduction</h3>
                      <p className={s.formatExplainDesc}>
                        {selectedFormat === 'podcast' && "Nous coproduisons votre épisode podcast avec vous. Enregistrement professionnel, mixage, diffusion sur toutes les plateformes."}
                        {selectedFormat === 'livre' && "Nous coproduisons votre livre avec vous. Accompagnement éditorial, mise en page, publication et distribution."}
                        {selectedFormat === 'documentaire' && "Nous coproduisons votre documentaire avec vous. Réalisation, montage, diffusion sur nos canaux et festivals."}
                      </p>
                    </div>
                  </div>

                  <div className={s.formatExplainSteps}>
                    <div className={s.formatExplainStep}>
                      <span className={s.formatExplainStepNum}>1</span>
                      <div>
                        <strong>&Eacute;crivez votre histoire</strong>
                        <span>R&eacute;digez votre t&eacute;moignage sur Origines via notre outil d&rsquo;&eacute;criture</span>
                      </div>
                    </div>
                    <div className={s.formatExplainStep}>
                      <span className={s.formatExplainStepNum}>2</span>
                      <div>
                        <strong>Validation &eacute;ditoriale</strong>
                        <span>Notre &eacute;quipe lit et valide votre r&eacute;cit pour la coproduction</span>
                      </div>
                    </div>
                    <div className={s.formatExplainStep}>
                      <span className={s.formatExplainStepNum}>3</span>
                      <div>
                        <strong>Production ensemble</strong>
                        <span>On coproduit le {selectedFormat} avec vous &mdash; vous gardez le contr&ocirc;le &agrave; chaque &eacute;tape</span>
                      </div>
                    </div>
                  </div>

                  <div className={s.fieldRow}>
                    <div className={s.fieldGroup}>
                      <label className={s.label}>Pr&eacute;nom</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={s.input} placeholder="Marie" required />
                    </div>
                    <div className={s.fieldGroup}>
                      <label className={s.label}>Email</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={s.input} placeholder="marie@exemple.com" required />
                    </div>
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Votre histoire en quelques mots</label>
                    <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} className={s.textarea} placeholder="Décrivez brièvement votre parcours et pourquoi ce format vous intéresse..." required />
                  </div>
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Avez-vous d&eacute;j&agrave; publi&eacute; sur Origines ?</label>
                    <div className={s.fieldRow}>
                      <label className={s.radioLabel}>
                        <input type="radio" name="dejaPub" value="oui" className={s.radio} /> Oui, mon r&eacute;cit est en ligne
                      </label>
                      <label className={s.radioLabel}>
                        <input type="radio" name="dejaPub" value="non" className={s.radio} /> Pas encore
                      </label>
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className={s.submitBtn}>
                    {isSubmitting ? (<><span className={s.spinner} />Envoi en cours...</>) : (<>Candidater &agrave; la coproduction<SendIcon /></>)}
                  </button>
                  <div className={s.guarantees}>
                    <span className={s.guarantee}><ShieldIcon />Donn&eacute;es prot&eacute;g&eacute;es</span>
                    <span className={s.guarantee}><ClockIcon />R&eacute;ponse sous 7 jours</span>
                    <span className={s.guarantee}><CheckIcon />100% gratuit</span>
                  </div>
                </form>
              )}

              {/* ── No format selected ── */}
              {!selectedFormat && (
                <div className={s.form}>
                  <p className={s.formatExplainDesc} style={{ textAlign: 'center', margin: '20px 0' }}>
                    S&eacute;lectionnez un format ci-dessus pour d&eacute;couvrir comment participer.
                  </p>
                </div>
              )}

              {/* ── Success state (video / coproduction) ── */}
              {isSubmitted && selectedFormat !== 'article' && (
                <div className={s.form} style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div className={s.successIcon}>
                    <CheckIcon />
                  </div>
                  <h3 className={s.successTitle}>Merci {formData.name} !</h3>
                  <p className={s.successText}>
                    Votre demande a bien &eacute;t&eacute; envoy&eacute;e.
                    {selectedFormat === 'video' ? " On vous recontacte sous 48h pour faire connaissance." : " Notre équipe éditoriale reviendra vers vous sous 7 jours."}
                  </p>
                  <Link to="/temoignages" className={s.successLink}>
                    D&eacute;couvrir les t&eacute;moignages
                    <ArrowRightIcon />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============ 9. FAQ ============ */}
        <section className={s.faq}>
          <div className={s.inner}>
            <div className={s.chapterMark}>
              <span className={s.cNum}>Ch.09</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>FAQ</span>
            </div>
            <div className={s.faqHeader}>
              <h2 className={s.faqTitle}>Questions <em>fr&eacute;quentes.</em></h2>
            </div>

            <div className={s.faqGrid}>
              {faqs.map((faq, idx) => (
                <div key={idx} className={s.faqCard}>
                  <h3 className={s.faqQuestion}>{faq.q}</h3>
                  <p className={s.faqAnswer}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Marquee />
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
};

export default ShareStoryPage;
