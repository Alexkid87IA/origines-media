import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Clock, Eye, Heart, Share2, BookOpen, User, Calendar, 
  Tag, ChevronRight, MessageCircle, ThumbsUp, Bookmark, Coffee,
  Facebook, Twitter, Linkedin, Link2, Check, Menu, X, ArrowRight,
  Play, Monitor, Star
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { client } from '../lib/sanity';
import { ARTICLE_BY_SLUG_QUERY, RELATED_ARTICLES_QUERY } from '../lib/queries';
import Layout from '../components/Layout';
import { PortableText } from '@portabletext/react';

// Types adaptés à votre schéma
interface Article {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  imageUrl?: string;
  mainImage?: {
    asset: {
      url: string;
    };
  };
  
  // Contenu
  body?: any[]; // PortableText
  htmlContent?: string;
  rawHtml?: string;
  structuredContent?: {
    introduction?: string;
    sections?: Array<{
      title: string;
      content: string;
    }>;
    conclusion?: string;
  };
  keyPoints?: string[];
  
  // Auteur
  author?: {
    _id: string;
    name: string;
    bio?: string;
    image?: {
      asset: {
        url: string;
      };
    };
  };
  authorDetails?: {
    bio?: string;
    role?: string;
  };
  
  // Métadonnées
  readingTime?: number;
  difficulty?: string;
  format?: string;
  views?: number;
  likes?: number;
  vues?: number;
  
  // Relations
  categories?: Array<{
    _id: string;
    title: string;
    slug?: { current: string };
  }>;
  tags?: Array<{
    _id: string;
    title: string;
    slug?: { current: string };
    color?: string;
  }>;
  univers?: {
    _id: string;
    nom: string;
    couleur: string;
    slug?: { current: string };
  };
  verticale?: {
    _id: string;
    nom: string;
    couleurDominante: string;
    slug?: { current: string };
  };
  
  // Type de section (émissions)
  sectionType?: {
    _id: string;
    title: string;
    slug?: { current: string };
  };
  videoUrl?: string;
  duration?: string;
  
  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  
  // Options
  displayOptions?: {
    showTableOfContents?: boolean;
    enableComments?: boolean;
    premium?: boolean;
  };
  isEssential?: boolean;
  
  // Articles liés
  relatedArticles?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    imageUrl?: string;
    mainImage?: {
      asset: {
        url: string;
      };
    };
    excerpt?: string;
    readingTime?: number;
    categories?: Array<{
      title: string;
    }>;
  }>;
}

// Composants pour PortableText
const myPortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value) return null;
      return (
        <figure className="my-8">
          <img
            src={value.asset?.url || value.url || ''}
            alt={value.alt || ''}
            className="w-full rounded-lg"
          />
          {value.caption && (
            <figcaption className="text-center text-white/60 text-sm mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }: any) => {
      if (!value) return null;
      return (
        <div className="my-6">
          {value.filename && (
            <div className="bg-black/40 text-white/60 text-sm px-4 py-2 rounded-t-lg font-mono">
              {value.filename}
            </div>
          )}
          <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto">
            <code className={`language-${value.language || 'text'}`}>
              {value.code}
            </code>
          </pre>
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      if (!value?.href) return <>{children}</>;
      const target = value.blank ? '_blank' : undefined;
      return (
        <a 
          href={value.href} 
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-violet-400 hover:text-violet-300 underline"
        >
          {children}
        </a>
      );
    },
    code: ({ children }: any) => (
      <code className="bg-white/10 px-1 py-0.5 rounded text-sm">{children}</code>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="font-montserrat font-bold text-3xl lg:text-4xl text-white mt-12 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-montserrat font-bold text-2xl lg:text-3xl text-white mt-10 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-montserrat font-bold text-xl lg:text-2xl text-white mt-8 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="font-montserrat font-bold text-lg lg:text-xl text-white mt-6 mb-3">
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-violet-500 pl-6 my-6 italic text-white/80">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="text-white/80 leading-relaxed mb-4">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-white/80">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-white/80">{children}</ol>
    ),
  },
};

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // États
  const [article, setArticle] = useState<Article | null>(null);
  const [articlesLies, setArticlesLies] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  
  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const sectionsRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Récupération des données depuis Sanity
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer l'article
        const articleData = await client.fetch(ARTICLE_BY_SLUG_QUERY, { slug });
        
        if (!articleData) {
          navigate('/404');
          return;
        }
        
        // Si c'est une vidéo/émission, rediriger vers la page vidéo
        if (articleData.sectionType?.title === 'Émission' && articleData.videoUrl) {
          navigate(`/video/${slug}`);
          return;
        }
        
        setArticle(articleData);
        
        // Récupérer les articles liés
        if (!articleData.relatedArticles || articleData.relatedArticles.length === 0) {
          // Si pas d'articles liés définis, chercher automatiquement
          const categoryIds = articleData.categories?.map((c: any) => c._id).filter(Boolean) || [];
          const tagIds = articleData.tags?.map((t: any) => t._id).filter(Boolean) || [];
          
          const related = await client.fetch(RELATED_ARTICLES_QUERY, {
            currentId: articleData._id,
            categoryIds,
            tagIds,
            universId: articleData.univers?._id,
            verticaleId: articleData.verticale?._id
          });
          setArticlesLies(related || []);
        } else {
          setArticlesLies(articleData.relatedArticles);
        }
        
        // Récupérer les préférences sauvegardées
        const savedLikes = localStorage.getItem('likedArticles');
        const savedBookmarks = localStorage.getItem('bookmarkedArticles');
        
        if (savedLikes) {
          const likes = JSON.parse(savedLikes);
          setIsLiked(likes.includes(articleData._id));
        }
        
        if (savedBookmarks) {
          const bookmarks = JSON.parse(savedBookmarks);
          setIsBookmarked(bookmarks.includes(articleData._id));
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

  // Intersection Observer pour l'animation d'entrée
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Progress de lecture
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const contentTop = contentRef.current.offsetTop;
        const contentHeight = contentRef.current.offsetHeight;
        
        if (scrollTop > contentTop) {
          const progress = Math.min(
            ((scrollTop - contentTop) / (contentHeight - clientHeight + contentTop)) * 100,
            100
          );
          setReadingProgress(Math.max(0, progress));
        } else {
          setReadingProgress(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Observer pour la section active (table des matières)
  useEffect(() => {
    if (!article?.structuredContent?.sections) return;

    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = sectionsRefs.current.findIndex(ref => ref === entry.target);
          if (index !== -1) {
            setActiveSection(index);
          }
        }
      });
    }, observerOptions);

    sectionsRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [article]);

  // Fonctions utilitaires
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatNumber = (num: number = 0) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Fonction pour générer un slug à partir d'un titre
  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
      .replace(/^-+|-+$/g, ''); // Enlever les tirets au début et à la fin
  };

  // Calcul du temps de lecture
  const calculateReadingTime = () => {
    if (article?.readingTime) return article.readingTime;
    
    const wordsPerMinute = 200;
    let totalWords = 0;
    
    // Compter les mots dans l'excerpt
    if (article?.excerpt) {
      totalWords += article.excerpt.split(' ').length;
    }
    
    // Compter les mots dans le contenu structuré
    if (article?.structuredContent) {
      if (article.structuredContent.introduction) {
        totalWords += article.structuredContent.introduction.split(' ').length;
      }
      
      if (article.structuredContent.sections) {
        article.structuredContent.sections.forEach(section => {
          totalWords += section.title.split(' ').length;
          totalWords += section.content.split(' ').length;
        });
      }
      
      if (article.structuredContent.conclusion) {
        totalWords += article.structuredContent.conclusion.split(' ').length;
      }
    }
    
    // Si pas de contenu structuré, estimer depuis le body
    else if (article?.body) {
      // Estimation approximative pour PortableText
      totalWords = article.body.length * 50; // Approximation
    }
    
    return Math.max(5, Math.ceil(totalWords / wordsPerMinute));
  };

  // Gestionnaires d'événements
  const handleLike = () => {
    if (!article) return;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Sauvegarder dans localStorage
    const savedLikes = localStorage.getItem('likedArticles');
    let likes = savedLikes ? JSON.parse(savedLikes) : [];
    
    if (newLikedState) {
      likes.push(article._id);
    } else {
      likes = likes.filter((id: string) => id !== article._id);
    }
    
    localStorage.setItem('likedArticles', JSON.stringify(likes));
  };

  const handleBookmark = () => {
    if (!article) return;
    
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    
    // Sauvegarder dans localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedArticles');
    let bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
    
    if (newBookmarkedState) {
      bookmarks.push(article._id);
      
      // Sauvegarder aussi les métadonnées pour la page bookmarks
      const bookmarksData = localStorage.getItem('bookmarksData');
      const metadata = bookmarksData ? JSON.parse(bookmarksData) : {};
      metadata[article._id] = new Date().toISOString();
      localStorage.setItem('bookmarksData', JSON.stringify(metadata));
    } else {
      bookmarks = bookmarks.filter((id: string) => id !== article._id);
    }
    
    localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarks));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const shareOnSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article?.title || '');
    const description = encodeURIComponent(article?.excerpt || '');
    
    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const scrollToSection = (index: number) => {
    const section = sectionsRefs.current[index];
    if (section) {
      const yOffset = -100;
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500 mx-auto mb-4"></div>
            <p className="text-white/60">Chargement de l'article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return null;
  }

  const themeColor = article.verticale?.couleurDominante || article.univers?.couleur || '#8B5CF6';
  const readingTime = calculateReadingTime();
  const imageUrl = article.imageUrl || article.mainImage?.asset?.url || 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg';
  const showToc = article.displayOptions?.showTableOfContents !== false && 
                  (article.structuredContent?.sections && article.structuredContent.sections.length > 0);

  return (
    <Layout showEngagement={true}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50 md:ml-[280px]">
        <div 
          className="h-full bg-gradient-to-r transition-all duration-300 ease-out"
          style={{ 
            width: `${readingProgress}%`,
            background: `linear-gradient(90deg, ${themeColor}, ${themeColor}80)`
          }}
        />
      </div>

      {/* Table of Contents (Mobile) */}
      {showToc && (
        <button
          onClick={() => setShowTableOfContents(!showTableOfContents)}
          className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-violet-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-violet-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Table of Contents Overlay */}
      {showTableOfContents && article.structuredContent?.sections && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden" onClick={() => setShowTableOfContents(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-80 bg-[#0F0F0F] border-l border-white/10 p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Table des matières</h3>
              <button onClick={() => setShowTableOfContents(false)}>
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
            
            <nav className="space-y-3">
              {article.structuredContent.sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => {
                    scrollToSection(index);
                    setShowTableOfContents(false);
                  }}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${
                    activeSection === index 
                      ? 'bg-violet-600/20 text-violet-400 border-l-2 border-violet-400' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section ref={sectionRef} className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image avec effet parallax */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center transform scale-110"
            style={{
              backgroundImage: `url(${imageUrl})`,
              filter: 'brightness(0.3) contrast(1.2)',
              transform: `scale(1.1) translateY(${readingProgress * 0.2}px)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Navigation */}
        <div className="absolute top-8 left-8 right-8 z-20 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-black/80 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-inter text-sm">Retour</span>
          </button>

          {/* Actions rapides */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmark}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                isBookmarked 
                  ? 'bg-violet-600/20 border-violet-400 text-violet-400' 
                  : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-end z-10">
          <div className="w-full px-8 lg:px-16 pb-16">
            <div className="max-w-4xl">
              {/* Badges */}
              <div className="mb-6 flex flex-wrap gap-3">
                {/* Badge Essentiel */}
                {article.isEssential && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-500/40 text-yellow-400">
                    <Star className="w-4 h-4 mr-2" />
                    <span className="font-inter font-bold text-sm">ESSENTIEL</span>
                  </span>
                )}

                {/* Badge Format */}
                {article.format && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80">
                    {article.format === 'amuse-bouche' ? <Coffee className="w-4 h-4 mr-2" /> : <BookOpen className="w-4 h-4 mr-2" />}
                    <span className="font-inter text-sm capitalize">{article.format}</span>
                  </span>
                )}

                {/* Type de section */}
                {article.sectionType && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/40 text-purple-400">
                    <Monitor className="w-4 h-4 mr-2" />
                    <span className="font-inter text-sm">{article.sectionType.title}</span>
                  </span>
                )}

                {/* Catégories */}
                {article.categories?.filter(cat => cat && cat.title).map((category) => {
                  const categorySlug = category.slug?.current || generateSlug(category.title);
                  
                  return (
                    <Link
                      key={category._id}
                      to={`/category/${categorySlug}`}
                      className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-md border transition-all hover:scale-105"
                      style={{
                        backgroundColor: `${themeColor}20`,
                        borderColor: `${themeColor}40`,
                        color: themeColor
                      }}
                    >
                      <span className="font-inter font-bold text-sm tracking-[0.15em] uppercase">
                        {category.title}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Title */}
              <h1 className="font-montserrat font-black text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight animate-fade-in">
                {article.title}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="font-inter text-xl text-white/90 mb-8 leading-relaxed animate-fade-in-delay">
                  {article.excerpt}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm animate-fade-in-delay-2">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.author.name}</span>
                  </div>
                )}
                
                {article.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min de lecture</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(article.vues || article.views || 1234)} vues</span>
                </div>
                
                {article.difficulty && (
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4" />
                    <span>Niveau : {article.difficulty}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content avec Table des matières Desktop */}
      <section ref={contentRef} className="py-16 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]">
        <div className="max-w-7xl mx-auto flex gap-12">
          {/* Table of Contents Desktop */}
          {showToc && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="font-montserrat font-bold text-lg text-white mb-6">
                  Table des matières
                </h3>
                <nav className="space-y-3">
                  {article.structuredContent!.sections!.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(index)}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-all text-sm ${
                        activeSection === index 
                          ? 'bg-violet-600/20 text-violet-400 border-l-2 border-violet-400' 
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Contenu principal */}
          <div className="flex-1 max-w-4xl">
            {/* Contenu structuré prioritaire */}
            {article.structuredContent && (
              <>
                {/* Introduction */}
                {article.structuredContent.introduction && (
                  <div className="mb-12">
                    <p className="font-inter text-xl text-white/90 leading-relaxed font-medium">
                      {article.structuredContent.introduction}
                    </p>
                  </div>
                )}

                {/* Sections */}
                {article.structuredContent.sections && (
                  <div className="space-y-12">
                    {article.structuredContent.sections.map((section, index) => (
                      <div 
                        key={index} 
                        ref={el => sectionsRefs.current[index] = el}
                        className="prose prose-invert max-w-none scroll-mt-24"
                      >
                        <h2 className="font-montserrat font-bold text-2xl lg:text-3xl text-white mb-6 leading-tight">
                          {section.title}
                        </h2>
                        <div className="font-inter text-lg text-white/80 leading-relaxed space-y-6">
                          {section.content.split('\n\n').map((paragraph, pIndex) => (
                            <p key={pIndex}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Conclusion */}
                {article.structuredContent.conclusion && (
                  <div className="mt-12 p-8 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
                    <h3 className="font-montserrat font-bold text-xl text-white mb-4">
                      En conclusion
                    </h3>
                    <p className="font-inter text-lg text-white/80 leading-relaxed">
                      {article.structuredContent.conclusion}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Si pas de contenu structuré, afficher le HTML ou PortableText */}
            {!article.structuredContent && (
              <>
                {/* HTML brut */}
                {article.rawHtml && (
                  <div 
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.rawHtml }}
                  />
                )}

                {/* HTML depuis l'éditeur de code */}
                {!article.rawHtml && article.htmlContent && (
                  <div 
                    className="prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.htmlContent }}
                  />
                )}

                {/* PortableText (body) */}
                {!article.rawHtml && !article.htmlContent && article.body && (
                  <div className="prose prose-invert prose-lg max-w-none">
                    <PortableText 
                      value={article.body}
                      components={myPortableTextComponents}
                    />
                  </div>
                )}
              </>
            )}

            {/* Points clés */}
            {article.keyPoints && article.keyPoints.length > 0 && (
              <div className="mt-12 p-8 bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl">
                <h3 className="font-montserrat font-bold text-xl text-white mb-6 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-violet-400" />
                  Points clés à retenir
                </h3>
                <ul className="space-y-3">
                  {article.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-violet-400 mt-1">•</span>
                      <span className="text-white/80">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12">
                <h3 className="font-montserrat font-bold text-lg text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Thèmes abordés
                </h3>
                <div className="flex flex-wrap gap-3">
                  {article.tags.filter(tag => tag && tag.title).map((tag) => {
                    const tagSlug = tag.slug?.current || generateSlug(tag.title);
                    
                    return (
                      <Link
                        key={tag._id}
                        to={`/tag/${tagSlug}`}
                        className="px-4 py-2 bg-white/10 border border-white/20 text-white/80 rounded-full font-inter text-sm hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                        style={{
                          borderColor: tag.color ? `${tag.color}40` : undefined,
                          color: tag.color || undefined
                        }}
                      >
                        {tag.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isLiked 
                      ? 'bg-red-500/20 text-red-400 border border-red-400/30' 
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{formatNumber((article.likes || 0) + (isLiked ? 1 : 0))}</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white/70 rounded-full hover:bg-white/20 transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </button>

                  {showShareMenu && (
                    <div className="absolute bottom-full mb-2 left-0 bg-black/90 border border-white/20 rounded-xl p-2 backdrop-blur-md min-w-[200px]">
                      <button 
                        onClick={copyToClipboard}
                        className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300 flex items-center gap-3"
                      >
                        {copySuccess ? <Check className="w-4 h-4 text-green-400" /> : <Link2 className="w-4 h-4" />}
                        {copySuccess ? 'Copié !' : 'Copier le lien'}
                      </button>
                      <button 
                        onClick={() => shareOnSocial('twitter')}
                        className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300 flex items-center gap-3"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </button>
                      <button 
                        onClick={() => shareOnSocial('linkedin')}
                        className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300 flex items-center gap-3"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </button>
                      <button 
                        onClick={() => shareOnSocial('facebook')}
                        className="w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300 flex items-center gap-3"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-400/30' 
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Sauvegardé' : 'Sauvegarder'}</span>
                </button>
              </div>

              <div className="text-white/60 text-sm">
                {formatNumber(article.vues || article.views || 1234)} lectures
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      {article.author && (
        <section className="py-16 px-8 lg:px-16 bg-[#0F0F0F] border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-6 p-8 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex-shrink-0">
                <div 
                  className="w-20 h-20 rounded-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${article.author.image?.asset?.url || 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg'})` 
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-montserrat font-bold text-xl text-white mb-1">
                  {article.author.name}
                </h3>
                {(article.authorDetails?.role || article.author.bio) && (
                  <p className="text-sm text-violet-400 mb-3">
                    {article.authorDetails?.role || 'Contributeur'}
                  </p>
                )}
                <p className="font-inter text-white/80 leading-relaxed">
                  {article.authorDetails?.bio || article.author.bio || 'Contributeur chez Origines Media'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {articlesLies.length > 0 && (
        <section className="py-16 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-montserrat font-bold text-3xl text-white mb-12 text-center">
              Articles similaires
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articlesLies.slice(0, 3).map((articleLie) => {
                const articleImage = articleLie.imageUrl || articleLie.mainImage?.asset?.url || 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg';
                
                return (
                  <Link
                    key={articleLie._id}
                    to={`/article/${articleLie.slug.current}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-2xl mb-4 h-48">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ 
                          backgroundImage: `url(${articleImage})` 
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {articleLie.categories && articleLie.categories[0] && (
                        <div className="absolute bottom-4 left-4">
                          <span 
                            className="px-3 py-1 backdrop-blur-sm text-white text-xs font-bold rounded-full"
                            style={{
                              backgroundColor: `${themeColor}40`
                            }}
                          >
                            {articleLie.categories[0].title}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-montserrat font-bold text-lg text-white mb-2 group-hover:text-violet-400 transition-colors duration-300 line-clamp-2">
                      {articleLie.title}
                    </h3>
                    
                    {articleLie.excerpt && (
                      <p className="text-white/60 text-sm line-clamp-2 mb-3">
                        {articleLie.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{articleLie.readingTime || 5} min</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Voir plus d'articles */}
            {article.categories && article.categories[0] && article.categories[0].title && (
              <div className="text-center mt-12">
                <Link
                  to={`/category/${article.categories[0].slug?.current || generateSlug(article.categories[0].title)}`}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all hover:gap-4"
                  style={{
                    backgroundColor: `${themeColor}20`,
                    color: themeColor,
                    borderWidth: '1px',
                    borderColor: `${themeColor}40`
                  }}
                >
                  Explorer plus d'articles {article.categories[0].title}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
};

// Styles CSS pour les animations
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fade-in-delay {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    50% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fade-in-delay-2 {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    66% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out;
  }
  
  .animate-fade-in-delay {
    animation: fade-in-delay 1.2s ease-out;
  }
  
  .animate-fade-in-delay-2 {
    animation: fade-in-delay-2 1.6s ease-out;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Styles pour PortableText */
  .prose code {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }
  
  .prose pre {
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .prose blockquote {
    border-left-width: 4px;
    border-left-color: #8B5CF6;
    padding-left: 1.5rem;
    font-style: italic;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .prose a {
    color: #A78BFA;
    text-decoration: underline;
    transition: color 0.2s;
  }
  
  .prose a:hover {
    color: #C4B5FD;
  }
`;

// Ajouter les styles au document
if (typeof document !== 'undefined' && !document.getElementById('article-page-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'article-page-styles';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ArticlePage;