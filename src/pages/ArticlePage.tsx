import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, Eye, Heart, Share2, Bookmark, Calendar,
  User, MessageCircle, ChevronUp, Twitter, Linkedin, Facebook,
  Link2, Check, Sparkles, Quote, ArrowUpRight, Hash, Menu,
  X, Mail, AlertCircle, TrendingUp, BookOpen, Star, Zap,
  Award, Coffee, ChevronRight, BarChart3, Layers,
  Globe, Shield, Flame, Diamond,
  Lightbulb, Infinity, Gem, Target, Pause, Headphones
} from 'lucide-react';
import { client } from '../lib/sanity';
import { ARTICLE_BY_SLUG_QUERY, RELATED_ARTICLES_QUERY } from '../lib/queries';
import Layout from '../components/Layout';
import { PortableText } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import './ArticlePage.css';

// Créer le builder d'URL pour les images
const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

// Types pour la table des matières
interface Heading {
  id: string;
  text: string;
  level: number;
  children?: Heading[];
}

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // States existants
  const [article, setArticle] = useState<any>(null);
  const [articlesLies, setArticlesLies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // States manquants ajoutés
  const [readingMode, setReadingMode] = useState<'default' | 'focus' | 'dark'>('default');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Nouveaux states pour le design amélioré
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [showToastState, setShowToastState] = useState(false);
  
  // NOTE: Ajout d'un état pour la position de la souris pour l'effet sur les cartes d'articles liés
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  // Refs
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<{ [key: string]: HTMLElement }>({});
  const progressCircleRef = useRef<SVGCircleElement>(null);

  // Extraction des headings du contenu
  useEffect(() => {
    if (article?.contenu || article?.body) {
      const content = article.contenu || article.body;
      const extractedHeadings: Heading[] = [];
      let currentH2: Heading | null = null;
      let totalWords = 0;

      content.forEach((block: any, index: number) => {
        if (block._type === 'block') {
          const text = block.children?.map((child: any) => child.text).join('') || '';
          if (text) {
            totalWords += text.split(/\s+/).filter(Boolean).length;
          }

          if (block.style) {
            if (!text) return;

            const id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, '-').slice(0, 50)}`;

            if (block.style === 'h2') {
              currentH2 = {
                id,
                text,
                level: 2,
                children: []
              };
              extractedHeadings.push(currentH2);
            } else if (block.style === 'h3' && currentH2) {
              currentH2.children?.push({
                id,
                text,
                level: 3
              });
            }
          }
        }
      });

      setHeadings(extractedHeadings);
      setWordCount(totalWords);
      setEstimatedReadTime(Math.ceil(totalWords / 200));
    }
  }, [article]);

  // Observer pour la section active avec effets visuels
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const handleObserve = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id);

          // Animation d'entrée pour les sections
          entry.target.classList.add('section-visible');
        }
      });
    };

    const observer = new IntersectionObserver(handleObserve, observerOptions);

    Object.values(headingRefs.current).forEach(element => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Milestones de lecture
  useEffect(() => {
    if (readingProgress > 0 && readingProgress % 25 === 0 && readingProgress > lastMilestone) {
      setShowMilestone(true);
      setLastMilestone(readingProgress);
      setTimeout(() => setShowMilestone(false), 3000);
    }
  }, [readingProgress, lastMilestone]);

  // Progress de lecture avec animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadingProgress(Math.min(progress, 100));
      setShowScrollTop(scrollTop > 500);

      // Mettre à jour le cercle de progression SVG
      if (progressCircleRef.current) {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (progress / 100) * circumference;
        progressCircleRef.current.style.strokeDashoffset = offset.toString();
      }

      // Activer le mode lecture après un certain scroll
      if (scrollTop > 300 && !isReading) {
        setIsReading(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReading]);

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setImageReady(false); // Reset l'état de l'image

        const articleData = await client.fetch(ARTICLE_BY_SLUG_QUERY, { slug });

        if (!articleData) {
          navigate('/404');
          return;
        }

        // Précharger l'image hero pour éviter le clignotement
        if (articleData.imageUrl) {
          const img = new Image();
          img.src = articleData.imageUrl;
          await new Promise((resolve) => {
            img.onload = () => {
              setImageReady(true);
              resolve(true);
            };
            img.onerror = () => {
              setImageReady(true); // On continue même si l'image échoue
              resolve(true);
            };
            // Timeout de 3 secondes pour ne pas bloquer indéfiniment
            setTimeout(() => {
              if (!img.complete) {
                setImageReady(true);
                resolve(true);
              }
            }, 3000);
          });
        } else {
          setImageReady(true);
        }

        setArticle(articleData);

        // Animation d'entrée du hero
        setTimeout(() => setHeroLoaded(true), 100);

        // Récupérer les articles liés
        try {
          const categoryIds = articleData.categories?.map((c: any) => c?._id).filter(Boolean) || [];
          const tagIds = articleData.tags?.map((t: any) => t?._id).filter(Boolean) || [];

          const related = await client.fetch(RELATED_ARTICLES_QUERY, {
            currentId: articleData._id,
            categoryIds,
            tagIds,
            universId: articleData.univers?._id || null,
            verticaleId: articleData.verticale?._id || null
          });

          setArticlesLies(related || []);
        } catch (error) {
          console.error('Erreur lors de la récupération des articles liés:', error);
          setArticlesLies([]);
        }

      } catch (error) {
        console.error('Erreur:', error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, navigate]);

  // Fonctions utilitaires
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setShowMobileMenu(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      confettiAnimation();
    }
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(isBookmarked ? 'Article retiré des favoris' : 'Article ajouté aux favoris');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setShowToastState(true);
    setTimeout(() => {
      setShowToastState(false);
    }, 3000);
  };

  const confettiAnimation = (customColor?: string) => {
    const colors = [customColor || '#8B5CF6', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F'];
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: 50%;
        top: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        border-radius: 50%;
      `;
      document.body.appendChild(particle);
      particles.push(particle);

      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 5 + Math.random() * 5;
      const lifetime = 1000 + Math.random() * 1000;

      let start: number | null = null;
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;

        if (progress < lifetime) {
          const x = Math.cos(angle) * velocity * progress * 0.1;
          const y = Math.sin(angle) * velocity * progress * 0.1 - progress * 0.1;
          particle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${progress}deg)`;
          particle.style.opacity = (1 - progress / lifetime).toString();
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      requestAnimationFrame(animate);
    }

    setTimeout(() => {
      particles.forEach(p => {
        if (p && p.parentNode) {
          p.remove();
        }
      });
    }, 3000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      const themeColor = article?.verticale?.couleurDominante || article?.verticale?.couleur || article?.univers?.couleur || '#8B5CF6';
      confettiAnimation(themeColor);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const shareOnSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article?.title || '');

    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      showToast('Lien copié !');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const toggleReadingMode = () => {
    const modes: ('default' | 'focus' | 'dark')[] = ['default', 'focus', 'dark'];
    const currentIndex = modes.indexOf(readingMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setReadingMode(nextMode);
  };

  // Thème couleur
  const themeColor = article?.verticale?.couleurDominante || article?.verticale?.couleur || article?.univers?.couleur || '#8B5CF6';

  // Composants personnalisés pour PortableText
  const portableTextComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset) return null;

        try {
          const imageUrl = urlFor(value.asset).width(1400).url();

          return (
            <figure className="my-24 group relative">
              <div className="relative overflow-hidden rounded-3xl">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={value.alt || ''}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 image-initial"
                    loading="lazy"
                    onLoad={(e) => {
                      e.currentTarget.classList.remove('image-initial');
                      e.currentTarget.classList.add('image-loaded');
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

                  <button className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-20 blur-3xl opacity-30"
                  style={{ backgroundColor: themeColor }}
                />
              </div>

              {value.caption && (
                <figcaption className="text-center mt-8 relative">
                  <div className="inline-block">
                    <p className="text-white/60 text-sm italic tracking-wide">
                      {value.caption}
                    </p>
                    <div
                      className="h-px mt-2 rounded-full opacity-30"
                      style={{ backgroundColor: themeColor }}
                    />
                  </div>
                </figcaption>
              )}
            </figure>
          );
        } catch (error) {
          console.error('Erreur affichage image:', error);
          return null;
        }
      },
    },
    block: {
      normal: ({ children, value }: any) => {
        const content = article?.contenu || article?.body;
        const isFirstParagraph = content && value?._key === content[0]?._key;

        if (isFirstParagraph) {
          return (
            <p className="mb-12 text-white/90 leading-[2.2] text-xl sm:text-2xl font-light tracking-wide first-letter:float-left first-letter:text-6xl sm:first-letter:text-8xl first-letter:font-black first-letter:mr-3 sm:first-letter:mr-4 first-letter:mt-1 sm:first-letter:mt-2 first-letter:bg-gradient-to-br first-letter:from-white first-letter:to-white/70 first-letter:bg-clip-text first-letter:text-transparent">
              {children}
            </p>
          );
        }

        return (
          <p className={`mb-10 text-white/80 leading-[2] transition-all duration-300 text-lg font-light tracking-wide hover:text-white/90`}>
            {children}
          </p>
        );
      },
      h2: ({ children, value }: any) => {
        const text = Array.isArray(children) ? children.join('') : String(children || '');
        const index = value?._key || Math.random().toString();
        const id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, '-').slice(0, 50)}`;

        return (
          <h2
            id={id}
            ref={el => { if (el) headingRefs.current[id] = el; }}
            className="text-5xl lg:text-6xl font-black mb-12 mt-24 text-white relative group scroll-mt-32 section-heading"
          >
            <span className="relative inline-block">
              <span
                className="absolute -left-20 top-1/2 -translate-y-1/2 text-8xl font-black opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                style={{ color: themeColor }}
              >
                {headings.findIndex(h => h.id === id) + 1}
              </span>

              <span className="relative z-10 inline-block bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent">
                {children}
              </span>

              <div className="absolute -bottom-6 left-0 w-full h-1 overflow-hidden rounded-full">
                <div
                  className="h-full transition-all duration-1000 ease-out relative"
                  style={{
                    width: activeHeading === id ? '100%' : '30%',
                    background: `linear-gradient(90deg, ${themeColor} 0%, ${themeColor}80 100%)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                </div>
              </div>

              <div
                className="absolute -inset-x-4 -inset-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                style={{ backgroundColor: `${themeColor}20` }}
              />
            </span>
          </h2>
        );
      },
      h3: ({ children, value }: any) => {
        const text = Array.isArray(children) ? children.join('') : String(children || '');
        const index = value?._key || Math.random().toString();
        const id = `heading-${index}-${text.toLowerCase().replace(/\s+/g, '-').slice(0, 50)}`;

        return (
          <h3
            id={id}
            ref={el => { if (el) headingRefs.current[id] = el; }}
            className="text-3xl lg:text-4xl font-bold mb-8 mt-16 text-white/90 scroll-mt-32 flex items-center gap-6 group"
          >
            <span
              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${themeColor}20 0%, ${themeColor}10 100%)`,
                border: `2px solid ${themeColor}30`
              }}
            >
              <Diamond className="w-5 h-5" style={{ color: themeColor }} />
            </span>
            <span className="relative">
              {children}
              <div
                className="absolute -bottom-2 left-0 h-px opacity-20 transition-all duration-500 group-hover:opacity-40"
                style={{
                  width: activeHeading === id ? '100%' : '0%',
                  backgroundColor: themeColor
                }}
              />
            </span>
          </h3>
        );
      },
      blockquote: ({ children }: any) => (
        <div className="relative my-20 mx-0 lg:mx-8">
          <div
            className="absolute inset-0 rounded-3xl opacity-5"
            style={{ backgroundColor: themeColor }}
          />

          <blockquote className="relative p-8 lg:p-12">
            <Quote
              className="absolute -left-4 -top-4 w-16 h-16 opacity-10"
              style={{ color: themeColor }}
            />

            <div
              className="relative border-l-4 pl-8 lg:pl-12 py-2"
              style={{ borderColor: themeColor }}
            >
              <p className="text-2xl lg:text-3xl text-white/80 leading-relaxed font-light italic">
                {children}
              </p>
            </div>

            <Quote
              className="absolute -right-4 -bottom-4 w-16 h-16 opacity-10 rotate-180"
              style={{ color: themeColor }}
            />

            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full animate-float"
                style={{
                  backgroundColor: themeColor,
                  left: `${20 + i * 30}%`,
                  top: `${20 + i * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  opacity: 0.3
                }}
              />
            ))}
          </blockquote>
        </div>
      ),
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-bold text-white relative inline-block group">
          <span className="relative z-10">{children}</span>
          <span
            className="absolute inset-x-0 bottom-0 h-3 -mb-1 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
            style={{ backgroundColor: themeColor }}
          />
        </strong>
      ),
      em: ({ children }: any) => (
        <em className="italic relative inline-block text-white/90 px-1">
          <span className="relative z-10">{children}</span>
          <span
            className="absolute inset-0 -mx-2 -my-1 rounded-lg opacity-5 group-hover:opacity-10 transition-opacity duration-300"
            style={{ backgroundColor: themeColor }}
          />
        </em>
      ),
      code: ({ children }: any) => (
        <code
          className="relative px-4 py-2 mx-1 rounded-xl text-sm font-mono inline-block border backdrop-blur-sm transition-all duration-300 hover:scale-105"
          style={{
            borderColor: `${themeColor}30`,
            color: themeColor,
            backgroundColor: `${themeColor}10`
          }}
        >
          <span className="relative z-10">{children}</span>
          <div
            className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at center, ${themeColor}10, transparent)`
            }}
          />
        </code>
      ),
      link: ({ value, children }: any) => {
        const target = value?.blank ? '_blank' : undefined;
        return (
          <a
            href={value?.href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className="relative inline-flex items-center gap-1 transition-all duration-300 hover:text-white group"
            style={{ color: themeColor }}
          >
            <span className="relative z-10">
              {children}
            </span>
            {target === '_blank' && (
              <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
            )}
            <span
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              style={{ backgroundColor: themeColor }}
            />
          </a>
        );
      },
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-none mb-12 space-y-6 pl-4">
          {React.Children.map(children, (child) => (
            <li className="flex items-start gap-5 group">
              <span className="flex-shrink-0 mt-2 relative">
                <span
                  className="block w-3 h-3 rounded-full transition-all duration-500 group-hover:scale-150"
                  style={{
                    backgroundColor: themeColor,
                    boxShadow: `0 0 20px ${themeColor}40`
                  }}
                />
                <span
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: themeColor,
                    opacity: 0.2
                  }}
                />
              </span>
              <span className="text-white/80 text-lg leading-relaxed font-light group-hover:text-white/90 transition-colors duration-300">
                {child}
              </span>
            </li>
          ))}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-none mb-12 space-y-8">
          {React.Children.map(children, (child: any, index: number) => (
            <li key={index} className="flex items-start gap-6 group">
              <span
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: `linear-gradient(135deg, ${themeColor}20 0%, ${themeColor}10 100%)`,
                  border: `2px solid ${themeColor}30`,
                  color: themeColor
                }}
              >
                {index + 1}
              </span>
              <span className="text-white/80 text-lg leading-relaxed font-light pt-2.5 group-hover:text-white/90 transition-colors duration-300">
                {child}
              </span>
            </li>
          ))}
        </ol>
      ),
    },
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-fuchsia-900/20"></div>
          </div>

          <div className="text-center relative z-10">
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 to-purple-600"></div>
                <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
                  <Infinity className="w-12 h-12 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-light text-white/80 mb-4">
                Préparation de votre lecture
              </h2>

              <div className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full w-2/3"></div>
              </div>

              <p className="text-white/40 text-sm mt-8 italic">
                "La lecture est une conversation silencieuse"
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) return null;

  const imageUrl = article.imageUrl || 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg';
  const readingTime = estimatedReadTime || Math.max(1, Math.ceil((article.contenu?.length || 10) / 5));

  return (
    <Layout>
      {/* Progress Bar Ultra-Premium */}
      <div className="fixed top-0 left-0 w-full h-2 sm:h-1 bg-black/20 z-50 backdrop-blur-sm">
        <div
          className="h-full transition-all duration-300 ease-out relative overflow-hidden shadow-lg"
          style={{
            width: `${readingProgress}%`,
            backgroundColor: themeColor,
            boxShadow: `0 0 10px ${themeColor}`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Progress Circle flottant */}
      <div className="fixed bottom-8 left-8 z-40 hidden lg:block">
        <svg className="w-24 h-24 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            ref={progressCircleRef}
            cx="50"
            cy="50"
            r="45"
            stroke={themeColor}
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45}`}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/60 text-sm font-mono">{Math.round(readingProgress)}%</span>
        </div>
      </div>

      {/* Hero Section Cinématographique */}
      <div className="relative">
        <section ref={heroRef} className={`relative h-screen min-h-[800px] overflow-hidden transition-opacity duration-1000 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Background avec effet cinématique */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center hero-image"
              style={{
                backgroundImage: `url(${imageUrl})`,
                filter: 'brightness(0.7) contrast(1.2) saturate(1.2)',
                transform: 'scale(1.05) translateZ(0)',
                willChange: 'transform'
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 30% 50%, ${themeColor}20 0%, transparent 50%)`
              }}
            />

            <div className="absolute inset-0" style={{
              boxShadow: 'inset 0 0 200px rgba(0,0,0,0.8)'
            }} />

            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `linear-gradient(${themeColor}20 1px, transparent 1px), linear-gradient(90deg, ${themeColor}20 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              transform: 'translateZ(0)'
            }} />
          </div>

          {/* Navigation améliorée */}
          <nav className="absolute top-0 left-0 right-0 z-20 p-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Retour</span>
              </button>

              {/* Contrôles de lecture */}
              <div className="flex items-center gap-4">
                {/* Mode de lecture */}
                <button
                  onClick={toggleReadingMode}
                  className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all duration-300 group"
                  title="Changer le mode de lecture"
                >
                  {readingMode === 'focus' ? (
                    <Target className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  ) : readingMode === 'dark' ? (
                    <Shield className="w-5 h-5" />
                  ) : (
                    <Lightbulb className="w-5 h-5" />
                  )}
                </button>

                {/* Taille de police */}
                <div className="flex items-center gap-1 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <button
                    onClick={() => setFontSize('small')}
                    className={`px-3 py-2 rounded-xl text-sm transition-all ${fontSize === 'small' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('medium')}
                    className={`px-3 py-2 rounded-xl text-base transition-all ${fontSize === 'medium' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-3 py-2 rounded-xl text-lg transition-all ${fontSize === 'large' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
                  >
                    A
                  </button>
                </div>

                {/* Audio */}
                <button
                  onClick={() => setAudioPlaying(!audioPlaying)}
                  className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all duration-300 group"
                  title="Écouter l'article"
                >
                  {audioPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Headphones className="w-5 h-5 group-hover:animate-pulse" />
                  )}
                </button>
              </div>
            </div>
          </nav>

          {/* Content avec animations */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-full px-8 max-w-7xl mx-auto text-center">
              {/* Badges ultra-premium */}
              <div className="mb-12 flex flex-wrap justify-center gap-3 sm:gap-4 animate-fade-in-up px-4 lg:px-0">
                {article.verticale && (
                  <div
                    className="group relative inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl backdrop-blur-xl border-2 transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden"
                    style={{
                      backgroundColor: `${article.verticale.couleurDominante || themeColor}10`,
                      borderColor: `${article.verticale.couleurDominante || themeColor}30`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(45deg, ${article.verticale.couleurDominante || themeColor}20 0%, transparent 100%)`
                      }}
                    />
                    <Layers className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" style={{ color: article.verticale.couleurDominante || themeColor }} />
                    <span className="font-bold text-xs sm:text-sm uppercase tracking-wider relative z-10" style={{ color: article.verticale.couleurDominante || themeColor }}>
                      {article.verticale.nom}
                    </span>
                  </div>
                )}

                {article.univers && (
                  <div
                    className="group relative inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl backdrop-blur-xl border-2 transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden"
                    style={{
                      backgroundColor: `${article.univers.couleur || '#9F7AEA'}10`,
                      borderColor: `${article.univers.couleur || '#9F7AEA'}30`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(45deg, ${article.univers.couleur || '#9F7AEA'}20 0%, transparent 100%)`
                      }}
                    />
                    <Hash className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" style={{ color: article.univers.couleur || '#9F7AEA' }} />
                    <span className="font-bold text-xs sm:text-sm uppercase tracking-wider relative z-10" style={{ color: article.univers.couleur || '#9F7AEA' }}>
                      {article.univers.nom}
                    </span>
                  </div>
                )}

                {article.isEssential && (
                  <div className="relative inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <Award className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 text-amber-400" />
                    <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-amber-400">Article Essentiel</span>
                  </div>
                )}

                {article.difficulty && (
                  <div className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white/80">
                    <Coffee className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm capitalize font-medium">{article.difficulty}</span>
                  </div>
                )}
              </div>

              {/* Titre avec animation simple */}
              <h1 className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl text-white mb-8 leading-[0.9] animate-fade-in-up animation-delay-200 px-4 lg:px-0 max-w-6xl mx-auto drop-shadow-2xl"
                style={{
                  textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.5)'
                }}
              >
                {article.title}
              </h1>

              {/* Ligne décorative animée */}
              <div className="flex justify-center mb-8 animate-fade-in-up animation-delay-400">
                <div
                  className="h-2 w-40 sm:w-48 rounded-full relative overflow-hidden"
                  style={{
                    background: `linear-gradient(90deg, ${themeColor} 0%, ${themeColor}dd 100%)`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                </div>
              </div>

              {/* Description avec effet de machine à écrire */}
              {article.excerpt && (
                <p className="text-xl lg:text-2xl xl:text-3xl text-white/80 mb-16 leading-relaxed max-w-4xl mx-auto font-light animate-fade-in-up animation-delay-600 px-4 lg:px-0 drop-shadow-xl"
                  style={{
                    textShadow: '0 2px 10px rgba(0,0,0,0.6)'
                  }}
                >
                  {article.excerpt}
                </p>
              )}

              {/* Meta Info premium */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 animate-fade-in-up animation-delay-800 px-4 lg:px-0">
                {article.author && (
                  <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative">
                      <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-0.5 group-hover:rotate-6 transition-transform duration-300">
                        <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center overflow-hidden">
                          {article.author.image ? (
                            <img
                              src={urlFor(article.author.image).width(100).url()}
                              alt={article.author.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
                        <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-black" />
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold text-base sm:text-lg group-hover:text-violet-400 transition-colors">
                        {article.author.name}
                      </p>
                      <p className="text-xs text-white/50 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Auteur vérifié
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 sm:gap-8 text-white/60 text-sm sm:text-base">
                  {article.publishedAt && (
                    <div className="flex items-center gap-2 group">
                      <Calendar className="w-4 sm:w-5 h-4 sm:h-5 group-hover:text-white transition-colors" />
                      <span className="group-hover:text-white transition-colors">{formatDate(article.publishedAt)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 group">
                    <Clock className="w-4 sm:w-5 h-4 sm:h-5 group-hover:text-white transition-colors" />
                    <span className="group-hover:text-white transition-colors">{readingTime} min</span>
                  </div>

                  <div className="flex items-center gap-2 group">
                    <Eye className="w-4 sm:w-5 h-4 sm:h-5 group-hover:text-white transition-colors" />
                    <span className="group-hover:text-white transition-colors font-mono">{(article.vues || 0).toLocaleString()}</span>
                  </div>

                  {wordCount > 0 && (
                    <div className="hidden sm:flex items-center gap-2 group">
                      <Globe className="w-4 sm:w-5 h-4 sm:h-5 group-hover:text-white transition-colors" />
                      <span className="group-hover:text-white transition-colors">{wordCount.toLocaleString()} mots</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Indicateur de scroll ultra-stylisé */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="relative">
              <div className="w-12 h-20 border-2 border-white/40 rounded-full flex justify-center p-2 backdrop-blur-sm">
                <div
                  className="w-2 h-5 rounded-full animate-scroll"
                  style={{ backgroundColor: themeColor }}
                />
              </div>
              <div className="absolute -inset-6 border-2 border-white/20 rounded-full animate-ping"></div>
            </div>
          </div>
        </section>
      </div>

      {/* Milestone Notification */}
      {showMilestone && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="px-8 py-4 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center gap-4">
            <Flame className="w-6 h-6" style={{ color: themeColor }} />
            <p className="text-white font-medium">
              {Math.round(readingProgress)}% de l'article lu ! Continuez comme ça 🔥
            </p>
          </div>
        </div>
      )}

      {/* Main Content avec design futuriste */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 py-16 sm:py-24 transition-all duration-500">
        <div className="flex gap-10 lg:gap-20">
          
          {/* Article Content */}
          <article className="flex-1 max-w-5xl mx-auto px-4 sm:px-0">
            {/* Chapô premium */}
            {article.excerpt && (
              <div className="mb-20 pb-20 border-b border-white/5 relative px-4 sm:px-0">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light leading-relaxed text-white/90 tracking-wide">
                  {article.excerpt}
                </p>
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${themeColor}40 50%, transparent 100%)`
                  }}
                />
              </div>
            )}

            <div ref={contentRef} className={`prose prose-invert max-w-none article-content ${fontSize === 'small' ? 'prose-sm' : fontSize === 'large' ? 'prose-lg' : 'prose-base'
              } ${readingMode === 'focus' ? 'reading-mode-focus' : readingMode === 'dark' ? 'reading-mode-dark' : ''
              }`}>
              {(() => {
                const content = article.body || article.contenu;
                if (content && Array.isArray(content)) {
                  return <PortableText value={content} components={portableTextComponents} />;
                }

                return (
                  <div className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center overflow-hidden">
                    <div
                      className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
                      style={{ backgroundColor: themeColor }}
                    />
                    <AlertCircle className="w-20 h-20 text-white/30 mx-auto mb-6" />
                    <p className="text-gray-400 text-2xl font-light">Cet article n'a pas encore de contenu.</p>
                  </div>
                );
              })()}
            </div>

            {/* Tags ultra-modernes */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-32 pt-24 border-t border-white/5 relative">
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${themeColor}40 50%, transparent 100%)`
                  }}
                />

                <div className="flex items-center gap-6 mb-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor}20 0%, ${themeColor}10 100%)`,
                      border: `2px solid ${themeColor}30`
                    }}
                  >
                    <Hash className="w-6 h-6" style={{ color: themeColor }} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Thèmes explorés
                  </h3>
                </div>

                <div className="flex flex-wrap gap-4">
                  {article.tags.filter((tag: any) => tag && tag.title).map((tag: any) => (
                    <button
                      key={tag._id}
                      className="group relative px-8 py-4 backdrop-blur-xl border-2 text-white/70 rounded-2xl hover:text-white transition-all duration-500 overflow-hidden hover:scale-105"
                      style={{
                        backgroundColor: `${tag.color || themeColor}05`,
                        borderColor: `${tag.color || themeColor}20`
                      }}
                    >
                      <span className="relative z-10 font-medium text-sm uppercase tracking-wider">{tag.title}</span>
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                        style={{
                          background: `radial-gradient(circle at center, ${tag.color || themeColor}20 0%, transparent 70%)`
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(45deg, transparent 30%, ${tag.color || themeColor}10 50%, transparent 70%)`,
                          animation: 'shimmer 2s ease-out'
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions section redesignée */}
            <div className="mt-24 relative">
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                style={{
                  background: `radial-gradient(circle at center, ${themeColor}40 0%, transparent 70%)`
                }}
              />

              <div className="relative flex flex-wrap items-center justify-between gap-6 p-12 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`group flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden ${isLiked
                        ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    style={isLiked ? {
                      border: '2px solid rgba(239, 68, 68, 0.5)'
                    } : {
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Heart className={`w-6 h-6 transition-transform group-hover:scale-110 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-semibold text-lg">{(article.likes || 0) + (isLiked ? 1 : 0)}</span>
                    {isLiked && (
                      <>
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 animate-pulse" />
                      </>
                    )}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="group flex items-center gap-3 px-8 py-4 bg-white/10 border-2 border-white/20 text-white/70 rounded-2xl hover:bg-white/20 transition-all duration-500 transform hover:scale-105"
                    >
                      <Share2 className="w-6 h-6 transition-transform group-hover:rotate-12" />
                      <span className="font-semibold text-lg">Partager</span>
                    </button>

                    {showShareMenu && (
                      <div className="absolute bottom-full mb-4 left-0 bg-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-3 min-w-[280px] animate-fade-in shadow-2xl">
                        <button
                          onClick={copyToClipboard}
                          className="w-full text-left px-6 py-4 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all flex items-center gap-4 group"
                        >
                          {copySuccess ? <Check className="w-6 h-6 text-green-400" /> : <Link2 className="w-6 h-6" />}
                          <span className="font-medium">{copySuccess ? 'Lien copié !' : 'Copier le lien'}</span>
                        </button>
                        <button
                          onClick={() => shareOnSocial('twitter')}
                          className="w-full text-left px-6 py-4 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all flex items-center gap-4 group"
                        >
                          <Twitter className="w-6 h-6 group-hover:text-[#1DA1F2] transition-colors" />
                          <span className="font-medium">Twitter</span>
                        </button>
                        <button
                          onClick={() => shareOnSocial('linkedin')}
                          className="w-full text-left px-6 py-4 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all flex items-center gap-4 group"
                        >
                          <Linkedin className="w-6 h-6 group-hover:text-[#0A66C2] transition-colors" />
                          <span className="font-medium">LinkedIn</span>
                        </button>
                        <button
                          onClick={() => shareOnSocial('facebook')}
                          className="w-full text-left px-6 py-4 text-white/80 hover:text-white hover:bg-white/10 rounded-2xl transition-all flex items-center gap-4 group"
                        >
                          <Facebook className="w-6 h-6 group-hover:text-[#1877F2] transition-colors" />
                          <span className="font-medium">Facebook</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleBookmark}
                    className={`group flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 relative overflow-hidden ${isBookmarked
                        ? 'text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    style={isBookmarked ? {
                      backgroundColor: `${themeColor}20`,
                      border: `2px solid ${themeColor}40`,
                      color: themeColor
                    } : {
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Bookmark className={`w-6 h-6 transition-transform group-hover:scale-110 ${isBookmarked ? 'fill-current' : ''}`} />
                    <span className="font-semibold text-lg">{isBookmarked ? 'Sauvegardé' : 'Sauvegarder'}</span>
                    {isBookmarked && (
                      <div
                        className="absolute inset-0 animate-pulse"
                        style={{ backgroundColor: `${themeColor}10` }}
                      />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-6 text-white/50 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span className="font-mono font-medium">{(article.vues || 0).toLocaleString()}</span>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">{Math.round(readingProgress)}% lu</span>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="flex items-center gap-2">
                    <Gem className="w-5 h-5" style={{ color: themeColor }} />
                    <span className="font-medium">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar Ultra-Premium - Desktop */}
          <aside className="hidden 2xl:block w-96 shrink-0">
            <div className="sticky top-32 space-y-10">
              {/* Table des matières futuriste */}
              {headings.length > 0 && (
                <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
                  <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: themeColor }}
                  />

                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-8 flex items-center gap-3">
                    <BookOpen className="w-5 h-5" style={{ color: themeColor }} />
                    Navigation
                  </h3>

                  {/* Progress circulaire avec stats */}
                  <div className="mb-10 flex items-center justify-between">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke={themeColor}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - readingProgress / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{Math.round(readingProgress)}%</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-white/40 text-sm mb-1">Temps restant</p>
                      <p className="text-white font-mono text-xl">{Math.max(1, Math.ceil(readingTime * (1 - readingProgress / 100)))} min</p>
                    </div>
                  </div>

                  {/* Sections interactives */}
                  <nav className="space-y-3">
                    {headings.map((heading, index) => (
                      <div key={heading.id}>
                        <button
                          onClick={() => scrollToSection(heading.id)}
                          onMouseEnter={() => setHoveredSection(heading.id)}
                          onMouseLeave={() => setHoveredSection(null)}
                          className={`w-full text-left px-5 py-4 rounded-2xl text-sm transition-all duration-500 relative overflow-hidden group ${activeHeading === heading.id
                              ? 'text-white shadow-lg'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                          style={activeHeading === heading.id ? {
                            backgroundColor: `${themeColor}15`,
                            borderLeft: `4px solid ${themeColor}`
                          } : {}}
                        >
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                              background: `linear-gradient(90deg, ${themeColor}10 0%, transparent 100%)`
                            }}
                          />

                          <div className="relative z-10 flex items-center gap-4">
                            <span
                              className="flex-shrink-0 w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-300"
                              style={{
                                backgroundColor: activeHeading === heading.id ? `${themeColor}30` : 'rgba(255,255,255,0.05)',
                                color: activeHeading === heading.id ? themeColor : 'rgba(255,255,255,0.6)',
                                border: activeHeading === heading.id ? `2px solid ${themeColor}50` : '2px solid rgba(255,255,255,0.1)'
                              }}
                            >
                              {index + 1}
                            </span>

                            <span className="flex-1 line-clamp-2">{heading.text}</span>

                            {activeHeading === heading.id && (
                              <Zap
                                className="w-4 h-4 flex-shrink-0 animate-pulse"
                                style={{ color: themeColor }}
                              />
                            )}
                          </div>
                        </button>

                        {heading.children && heading.children.map((child) => (
                          <button
                            key={child.id}
                            onClick={() => scrollToSection(child.id)}
                            className={`w-full text-left pl-16 pr-5 py-3 text-xs transition-all duration-300 ${activeHeading === child.id
                                ? 'text-white/80'
                                : 'text-white/40 hover:text-white/60'
                              }`}
                            style={activeHeading === child.id ? { color: themeColor } : {}}
                          >
                            <span className="flex items-center gap-2">
                              <ChevronRight className="w-3 h-3" />
                              {child.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </nav>
                </div>
              )}

              {/* Newsletter futuriste */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${themeColor}30 0%, ${themeColor}10 50%, ${themeColor}30 100%)`,
                    animation: 'gradient-shift 10s ease infinite'
                  }}
                />

                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${themeColor} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }} />
                </div>

                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-20 h-20 rounded-full blur-xl animate-float"
                    style={{
                      backgroundColor: themeColor,
                      opacity: 0.1,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${i * 2}s`,
                      animationDuration: `${10 + i * 2}s`
                    }}
                  />
                ))}

                <div className="relative z-10 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`
                      }}
                    >
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Newsletter Premium
                      </h3>
                      <p className="text-xs text-white/60 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Contenu exclusif
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-white/80 mb-8 leading-relaxed">
                    Rejoignez notre communauté et recevez des analyses approfondies chaque semaine.
                  </p>

                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="relative group">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        className="w-full px-5 py-4 bg-black/30 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all duration-300"
                        required
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-white/60 transition-colors" />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-5 py-4 text-white rounded-2xl font-semibold transition-all duration-500 transform hover:scale-[1.02] shadow-xl relative overflow-hidden group"
                      style={{
                        background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`
                      }}
                    >
                      <span className="relative z-10">
                        {subscribed ? (
                          <span className="flex items-center justify-center gap-2">
                            <Check className="w-5 h-5" />
                            Inscription confirmée !
                          </span>
                        ) : (
                          'Rejoindre la communauté'
                        )}
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                  </form>

                  <div className="mt-6 flex items-center justify-between text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      +10K lecteurs actifs
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Sans spam
                    </span>
                  </div>
                </div>
              </div>

              {/* Widget de statistiques */}
              <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
                <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">
                  Statistiques de lecture
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Mots lus</span>
                    <span className="text-white font-mono">{Math.round(wordCount * readingProgress / 100)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Vitesse moyenne</span>
                    <span className="text-white font-mono">200 mots/min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Score d'engagement</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4"
                            style={{
                              color: i < Math.round(readingProgress / 20) ? themeColor : 'rgba(255,255,255,0.2)',
                              fill: i < Math.round(readingProgress / 20) ? themeColor : 'none'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          
        </div>
      </div>

      {/* Mobile Controls - Barre flottante */}
      <div className="2xl:hidden fixed bottom-0 left-0 right-0 z-40 p-4 pb-safe">
        <div className="bg-black/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 flex items-center justify-between gap-4">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors relative"
          >
            <Menu className="w-6 h-6 text-white" />
            {headings.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full text-xs flex items-center justify-center font-bold text-white">
                {headings.length}
              </span>
            )}
          </button>

          <div className="flex-1 flex items-center justify-center gap-3">
            <span className="text-white/60 text-sm">Progression</span>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 relative"
                style={{
                  width: `${readingProgress}%`,
                  backgroundColor: themeColor
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <span className="text-white font-mono text-sm">{Math.round(readingProgress)}%</span>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
          >
            <ChevronUp className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen */}
      {showMobileMenu && (
        <div className="2xl:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white">Navigation</h3>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Progress circle mobile */}
            <div className="p-6">
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke={themeColor}
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 35}`}
                      strokeDashoffset={`${2 * Math.PI * 35 * (1 - readingProgress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{Math.round(readingProgress)}%</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-white/60 text-sm mb-1">Temps restant</p>
                  <p className="text-white font-mono text-lg">{Math.max(1, Math.ceil(readingTime * (1 - readingProgress / 100)))} min</p>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-3">
                {headings.map((heading, index) => (
                  <div key={heading.id}>
                    <button
                      onClick={() => scrollToSection(heading.id)}
                      className={`w-full text-left px-6 py-5 rounded-3xl transition-all flex items-center gap-4 ${activeHeading === heading.id
                          ? 'text-white'
                          : 'text-white/70 active:bg-white/10'
                        }`}
                      style={activeHeading === heading.id ? {
                        backgroundColor: `${themeColor}20`,
                        borderLeft: `4px solid ${themeColor}`
                      } : {}}
                    >
                      <span
                        className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: activeHeading === heading.id ? `${themeColor}30` : 'rgba(255,255,255,0.1)',
                          color: activeHeading === heading.id ? themeColor : 'rgba(255,255,255,0.7)'
                        }}
                      >
                        {index + 1}
                      </span>
                      <span className="flex-1 text-lg">{heading.text}</span>
                      {activeHeading === heading.id && (
                        <Zap className="w-5 h-5" style={{ color: themeColor }} />
                      )}
                    </button>

                    {heading.children && heading.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => scrollToSection(child.id)}
                        className={`w-full text-left pl-20 pr-6 py-4 text-base transition-all ${activeHeading === child.id
                            ? 'text-white/80'
                            : 'text-white/50 active:text-white/70'
                          }`}
                        style={activeHeading === child.id ? { color: themeColor } : {}}
                      >
                        <span className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4" />
                          {child.text}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top - Version premium */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-8 z-30 w-14 h-14 bg-white/10 backdrop-blur-2xl text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-2xl border border-white/20 group"
        >
          <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}

      {/* Author Section - Ultra Premium */}
      {article.author && (
        <section className="max-w-7xl mx-auto px-8 py-32">
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div
                className="absolute inset-0 rounded-3xl blur-3xl transition-all duration-700 opacity-20 group-hover:opacity-30"
                style={{
                  background: `radial-gradient(circle at 30% 50%, ${themeColor}40 0%, transparent 50%), radial-gradient(circle at 70% 50%, ${themeColor}30 0%, transparent 50%)`
                }}
              />

              <div className="relative p-10 lg:p-12 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${themeColor} 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                  }} />
                </div>

                <div className="relative flex flex-col lg:flex-row items-start gap-10">
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <div
                        className="w-32 h-32 rounded-3xl p-1 group-hover:rotate-3 transition-transform duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 50%, ${themeColor} 100%)`
                        }}
                      >
                        <div className="w-full h-full rounded-3xl bg-black overflow-hidden">
                          {article.author.image ? (
                            <img
                              src={urlFor(article.author.image).width(300).url()}
                              alt={article.author.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-16 h-16 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center border-4 border-black shadow-xl">
                        <Check className="w-6 h-6 text-black" />
                      </div>

                      <div
                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                        style={{ backgroundColor: themeColor }}
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-3xl font-black text-white mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {article.author.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                        style={{
                          backgroundColor: `${themeColor}20`,
                          color: themeColor,
                          border: `2px solid ${themeColor}30`
                        }}>
                        <Award className="w-4 h-4" />
                        Expert Contributeur
                      </span>
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm text-white/70">
                        <Flame className="w-4 h-4" />
                        Top Writer 2024
                      </span>
                    </div>

                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                      {article.author.bio || 'Créateur de contenu passionné, je partage mes découvertes et analyses pour enrichir notre communauté. Chaque article est une invitation à explorer de nouvelles perspectives.'}
                    </p>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="text-center p-4 bg-white/5 rounded-2xl">
                        <p className="text-3xl font-bold text-white mb-1">42</p>
                        <p className="text-sm text-white/60">Articles</p>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-2xl">
                        <p className="text-3xl font-bold text-white mb-1">15K</p>
                        <p className="text-sm text-white/60">Lecteurs</p>
                      </div>
                      <div className="text-center p-4 bg-white/5 rounded-2xl">
                        <p className="text-3xl font-bold text-white mb-1">4.9</p>
                        <p className="text-sm text-white/60">Note</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        className="px-8 py-3 text-white rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 shadow-xl relative overflow-hidden group"
                        style={{
                          background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`
                        }}
                      >
                        <span className="relative z-10">Découvrir ses articles</span>
                        <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                      </button>

                      <button className="px-8 py-3 bg-white/10 backdrop-blur-xl text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 border-2 border-white/20">
                        Suivre l'auteur
                      </button>

                      <div className="ml-auto flex items-center gap-4">
                        <button className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                          <Twitter className="w-5 h-5 text-white/70" />
                        </button>
                        <button className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                          <Linkedin className="w-5 h-5 text-white/70" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Articles - Design Bento Grid */}
      {articlesLies.length > 0 && (
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${themeColor}10 50%, transparent 100%)`,
                animation: 'gradient-y 20s ease infinite'
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-white mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Continuez l'exploration
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Articles sélectionnés spécialement pour vous
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articlesLies.slice(0, 6).map((articleLie, index) => {
                const articleSlug = articleLie.slug?.current || articleLie.slug || '';
                const isLarge = index === 0 || index === 3;

                return (
                  <Link
                    key={articleLie._id}
                    to={`/article/${articleSlug}`}
                    className={`group relative ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}`}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }}
                  >
                    <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                      {articleLie.imageUrl && (
                        <div className="absolute inset-0">
                          <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                            style={{
                              backgroundImage: `url(${articleLie.imageUrl})`,
                              filter: 'brightness(0.6)'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                        </div>
                      )}

                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${themeColor}20 0%, transparent 70%)`
                        }}
                      />

                      <div className="absolute top-6 left-6 z-10">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold backdrop-blur-xl transition-all duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: `${themeColor}20`,
                            border: `2px solid ${themeColor}40`,
                            color: themeColor
                          }}
                        >
                          {index + 1}
                        </div>
                      </div>

                      {new Date(articleLie.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                        <div className="absolute top-6 right-6 z-10">
                          <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full uppercase tracking-wider animate-pulse">
                            Nouveau
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-8 z-10">
                        <h3 className={`font-bold text-white mb-3 line-clamp-2 transition-all duration-300 group-hover:text-white/90 ${isLarge ? 'text-3xl' : 'text-2xl'
                          }`}>
                          {articleLie.title}
                        </h3>

                        {articleLie.excerpt && (
                          <p className="text-white/70 text-base mb-6 line-clamp-2">
                            {articleLie.excerpt}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm font-semibold flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
                            style={{ color: themeColor }}
                          >
                            Découvrir
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                          </span>

                          <div className="flex items-center gap-4 text-white/50 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {Math.ceil((articleLie.contenu?.length || 10) / 5)} min
                            </span>
                            {articleLie.vues && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {articleLie.vues.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 40%)`
                          }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-16">
              <Link
                to="/articles"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl text-white font-semibold text-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 group"
              >
                Explorer tous les articles
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Toast Notification */}
      {showToastState && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/90 backdrop-blur-xl text-white rounded-full z-50 animate-slide-up">
          {toastMessage}
        </div>
      )}
    </Layout>
  );
}