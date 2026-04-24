// src/pages/ShareStoryPage.tsx
// Page "Racontez votre histoire" — V2 angular editorial design

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader/SiteHeader';
import Footer2 from '@/components/Footer2/Footer2';
import ScrollToTopV2 from '@/components/ScrollToTop/ScrollToTopV2';
import SEO from '../components/SEO';
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
    detail: 'Reponse sous 48h',
  },
  {
    number: '02',
    title: 'Appel decouverte',
    desc: 'On vous rappelle pour faire connaissance. 20 minutes pour comprendre votre parcours.',
    detail: 'Sans engagement',
  },
  {
    number: '03',
    title: 'Preparation',
    desc: 'On structure ensemble votre recit. Coaching personnalise si besoin.',
    detail: 'A votre rythme',
  },
  {
    number: '04',
    title: 'Creation',
    desc: 'Tournage, redaction ou enregistrement avec notre equipe professionnelle.',
    detail: 'Qualite pro',
  },
];

const reasons = [
  {
    title: 'Aider quelqu\'un',
    desc: 'Votre histoire pourrait etre exactement ce dont quelqu\'un a besoin aujourd\'hui',
    stat: '2M+',
    statLabel: 'messages recus',
    color: '#EC4899',
  },
  {
    title: 'Donner du sens',
    desc: 'Transformez votre vecu en quelque chose de plus grand que vous',
    stat: '89%',
    statLabel: 'se sentent liberes',
    color: '#F59E0B',
  },
  {
    title: 'Rejoindre une communaute',
    desc: 'Faites partie d\'un mouvement de 1 000+ personnes qui osent raconter',
    stat: '1K+',
    statLabel: 'temoins actifs',
    color: '#8B5CF6',
  },
  {
    title: 'Creer un heritage',
    desc: 'Laissez une trace qui inspirera encore dans 10, 20, 50 ans',
    stat: '10B+',
    statLabel: 'vues totales',
    color: '#10B981',
  },
];

const impactStats = [
  { value: '10B+', label: 'vues cumulees' },
  { value: '1 000+', label: 'histoires partagees' },
  { value: '2M+', label: 'messages de soutien' },
  { value: '45+', label: 'pays touches' },
];

const formats = [
  {
    id: 'video',
    title: 'Video',
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
    desc: 'Vous ecrivez, on edite ensemble.',
    duration: '2-4 semaines',
    color: '#6366F1',
    popular: false,
  },
  {
    id: 'podcast',
    title: 'Podcast',
    subtitle: 'En toute intimite',
    desc: 'Juste votre voix, ideal pour l\'anonymat.',
    duration: '2-3 semaines',
    color: '#10B981',
    popular: false,
  },
  {
    id: 'livre',
    title: 'Livre',
    subtitle: 'Pour les epopees',
    desc: 'Votre histoire en version longue.',
    duration: '3-6 mois',
    color: '#F59E0B',
    popular: false,
  },
  {
    id: 'documentaire',
    title: 'Documentaire',
    subtitle: 'L\'immersion totale',
    desc: 'Format long, plusieurs temoins.',
    duration: '6-12 mois',
    color: '#EF4444',
    popular: false,
  },
];

const participantTestimonials = [
  {
    quote: "J'avais peur de me livrer. L'equipe m'a mise tellement a l'aise que j'ai oublie la camera.",
    author: 'Nadia K.',
    role: 'A partage en video',
    image: '/placeholder.svg',
    color: '#8B5CF6',
  },
  {
    quote: "Je recois encore des messages de personnes que mon temoignage a aidees. C'est incroyable.",
    author: 'Thomas R.',
    role: 'A partage en video',
    image: '/placeholder.svg',
    color: '#F59E0B',
  },
  {
    quote: "Le podcast m'a permis de raconter sans montrer mon visage. C'etait parfait pour moi.",
    author: 'Anonyme',
    role: 'A partage en podcast',
    image: '/placeholder.svg',
    color: '#10B981',
  },
];

const faqs = [
  { q: "C'est vraiment gratuit ?", a: "Oui, 100% gratuit. Notre mission est de donner la parole." },
  { q: 'Qui peut participer ?', a: "Tout le monde. Chaque histoire compte, meme les plus simples." },
  { q: 'Je peux rester anonyme ?', a: 'Absolument. Pseudonyme, voix modifiee, visage floute.' },
  { q: "J'ai le droit de relecture ?", a: "Bien sur. Vous validez tout avant publication." },
  { q: 'Ca prend combien de temps ?', a: 'De 2 semaines a 6 mois selon le format choisi.' },
  { q: 'Et si je change d\'avis ?', a: "Vous pouvez vous retirer a tout moment." },
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

// Map format id to icon component
const formatIconMap: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  video: VideoIcon,
  article: PenIcon,
  podcast: MicIcon,
  livre: BookIcon,
  documentaire: FilmIcon,
};

// Map impact stat index to icon
const impactIcons = [EyeIcon, FileTextIcon, MessageIcon, GlobeIcon];

// ============ COMPONENT ============

const ShareStoryPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State pour les videos Sanity
  const [featuredVideo, setFeaturedVideo] = useState<SanityVideo | null>(null);
  const [randomVideos, setRandomVideos] = useState<SanityVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  // Fetch videos from Sanity
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
        title="Racontez votre histoire | Origines Media"
        description="Partagez votre parcours et inspirez des milliers de personnes. 100% gratuit, accompagnement personnalise."
        url="/racontez-votre-histoire"
      />

      <SiteHeader />

      <main className={s.page}>

        {/* ============ 1. HERO ============ */}
        <section className={s.hero}>
          <div className={s.inner}>
            <div className={s.heroGrid}>

              {/* Left - Content */}
              <div className={s.heroContent}>
                <span className={s.heroKicker}>
                  <span className={s.heroKickerDot} />
                  RACONTEZ VOTRE HISTOIRE
                </span>

                <h1 className={s.heroTitle}>
                  Votre histoire{' '}
                  <em>merite d'etre entendue</em>
                </h1>

                <p className={s.heroDeck}>
                  Vous avez traverse quelque chose d'important ? Partagez votre parcours
                  et inspirez des milliers de personnes qui vivent la meme chose.
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
            <p className={s.processLabel}>Processus simple</p>
            <h2 className={s.processTitle}>Comment ca marche ?</h2>

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
            <div className={s.storiesHeader}>
              <div className={s.storiesLabel}>
                <span className={s.storiesKicker}>
                  <span className={s.storiesKickerDot} />
                  Communaute
                </span>
                <h2 className={s.storiesTitle}>Des histoires qui inspirent</h2>
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
            <p className={s.reasonsLabel}>L'impact de votre voix</p>
            <h2 className={s.reasonsTitle}>Pourquoi partager votre histoire ?</h2>
            <p className={s.reasonsDeck}>
              Chaque temoignage a le pouvoir de transformer des vies.
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
            <div className={s.formatsHeader}>
              <span className={s.formatsKicker}>
                <span className={s.formatsKickerDot} />
                Formats
              </span>
              <h2 className={s.formatsTitle}>Choisissez votre format</h2>
              <p className={s.formatsDeck}>
                Cinq facons de raconter, selon vos envies
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
            <div className={s.testimonialsHeader}>
              <span className={s.testimonialsKicker}>
                <span className={s.testimonialsKickerDot} />
                Temoignages
              </span>
              <h2 className={s.testimonialsTitle}>Ils ont partage leur histoire</h2>
              <p className={s.testimonialsDeck}>Ce qu'ils disent de l'experience</p>
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
            <div className={s.formSectionHeader}>
              <div className={s.formKicker}>
                <HeartIcon />
                Rejoignez 1 000+ temoins
              </div>
              <h2 className={s.formSectionTitle}>
                Pret(e) a partager votre histoire ?
              </h2>
              <p className={s.formSectionDeck}>
                Remplissez ce formulaire en 2 minutes.
                On vous recontacte sous 48h pour faire connaissance.
              </p>
            </div>

            {!isSubmitted ? (
              <div className={s.formCard}>
                <form onSubmit={handleSubmit} className={s.form}>

                  {/* Format selection */}
                  <div className={s.formatSelector}>
                    <span className={s.formatSelectorLabel}>Format souhaite</span>
                    <div className={s.formatSelectorGrid}>
                      {formats.map((f) => {
                        const isSelected = selectedFormat === f.id;
                        const FmtIcon = formatIconMap[f.id];
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setSelectedFormat(f.id)}
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

                  {/* Name & Email */}
                  <div className={s.fieldRow}>
                    <div className={s.fieldGroup}>
                      <label className={s.label}>Prenom</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={s.input}
                        placeholder="Marie"
                        required
                      />
                    </div>
                    <div className={s.fieldGroup}>
                      <label className={s.label}>Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={s.input}
                        placeholder="marie@exemple.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className={s.fieldGroup}>
                    <label className={s.label}>
                      Telephone <span className={s.labelOptional}>(optionnel)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={s.input}
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  {/* Message */}
                  <div className={s.fieldGroup}>
                    <label className={s.label}>Votre histoire en quelques mots</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className={s.textarea}
                      placeholder="J'aimerais partager mon parcours sur..."
                      required
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={s.submitBtn}
                  >
                    {isSubmitting ? (
                      <>
                        <span className={s.spinner} />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer ma demande
                        <SendIcon />
                      </>
                    )}
                  </button>

                  {/* Guarantees */}
                  <div className={s.guarantees}>
                    <span className={s.guarantee}>
                      <ShieldIcon />
                      Donnees protegees
                    </span>
                    <span className={s.guarantee}>
                      <ClockIcon />
                      Reponse sous 48h
                    </span>
                    <span className={s.guarantee}>
                      <CheckIcon />
                      100% gratuit
                    </span>
                  </div>
                </form>
              </div>
            ) : (
              <div className={s.successCard}>
                <div className={s.successIcon}>
                  <CheckIcon />
                </div>
                <h3 className={s.successTitle}>
                  Merci {formData.name} !
                </h3>
                <p className={s.successText}>
                  Votre demande a bien ete envoyee.
                  On vous recontacte tres vite pour faire connaissance.
                </p>
                <Link to="/histoires" className={s.successLink}>
                  Decouvrir les histoires
                  <ArrowRightIcon />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ============ 9. FAQ ============ */}
        <section className={s.faq}>
          <div className={s.inner}>
            <div className={s.faqHeader}>
              <span className={s.faqKicker}>
                <span className={s.faqKickerDot} />
                FAQ
              </span>
              <h2 className={s.faqTitle}>Questions frequentes</h2>
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

      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
};

export default ShareStoryPage;
