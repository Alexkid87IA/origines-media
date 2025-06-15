import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Eye, Heart, Share2, BookOpen, User, Calendar, Tag, ChevronRight, MessageCircle, ThumbsUp } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

interface Article {
  id: string;
  titre: string;
  sousTitre?: string;
  auteur: {
    nom: string;
    bio: string;
    avatar: string;
  };
  categorie: {
    id: string;
    nom: string;
    couleur: string;
  };
  imageHero: string;
  datePublication: string;
  tempsLecture: number;
  vues: number;
  likes: number;
  tags: string[];
  contenu: {
    introduction: string;
    sections: {
      titre: string;
      contenu: string;
    }[];
    conclusion: string;
  };
  articlesLies: {
    id: string;
    titre: string;
    imageUrl: string;
    categorie: string;
    tempsLecture: number;
  }[];
}

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Données d'exemple (en production, cela viendrait d'une API)
  const article: Article = {
    id: 'agricultrice-urbaine',
    titre: 'Comment j\'ai trouvé le sens en devenant agricultrice urbaine',
    sousTitre: 'De cadre supérieure à cultivatrice de légumes sur les toits parisiens',
    auteur: {
      nom: 'Marie Dubois',
      bio: 'Ancienne directrice marketing, aujourd\'hui agricultrice urbaine et consultante en transition professionnelle.',
      avatar: 'https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg'
    },
    categorie: {
      id: 'carriere',
      nom: 'CARRIÈRE',
      couleur: '#4A5568'
    },
    imageHero: 'https://images.pexels.com/photos/2519392/pexels-photo-2519392.jpeg',
    datePublication: '2024-01-15',
    tempsLecture: 12,
    vues: 15420,
    likes: 1203,
    tags: ['Reconversion', 'Agriculture urbaine', 'Sens du travail', 'Écologie', 'Entrepreneuriat'],
    contenu: {
      introduction: 'Il y a trois ans, j\'étais directrice marketing dans une grande entreprise parisienne. Aujourd\'hui, je cultive des légumes sur les toits de la capitale. Cette transformation radicale n\'est pas le fruit du hasard, mais d\'une quête de sens qui m\'a menée vers une vie plus alignée avec mes valeurs.',
      sections: [
        {
          titre: 'Le déclic : quand le succès ne suffit plus',
          contenu: 'Tout semblait parfait de l\'extérieur. Salaire confortable, bureau avec vue sur la Seine, équipe dynamique. Pourtant, chaque matin, je ressentais un vide grandissant. Cette sensation d\'être déconnectée de l\'essentiel, de contribuer à un système qui ne me correspondait plus. Le déclic est venu lors d\'un voyage au Japon, en découvrant les jardins urbains de Tokyo. J\'ai réalisé qu\'il était possible de nourrir les gens tout en respectant l\'environnement, même en ville.'
        },
        {
          titre: 'Les premiers pas vers l\'agriculture urbaine',
          contenu: 'La transition ne s\'est pas faite du jour au lendemain. J\'ai commencé par transformer mon balcon en mini-potager, puis j\'ai rejoint une association d\'agriculture urbaine le week-end. Chaque geste, chaque plant qui poussait me reconnectait à quelque chose de fondamental. J\'ai suivi des formations, rencontré des pionniers du secteur, et petit à petit, l\'idée de faire de cette passion mon métier a germé.'
        },
        {
          titre: 'Le grand saut : quitter la sécurité pour l\'inconnu',
          contenu: 'Démissionner d\'un poste bien payé pour se lancer dans l\'agriculture urbaine, mes proches pensaient que j\'avais perdu la raison. Les premiers mois ont été difficiles financièrement, mais chaque jour apportait son lot de découvertes et de satisfactions. J\'ai créé ma micro-entreprise, trouvé mes premiers clients restaurateurs, et développé un réseau de toits-terrasses à cultiver.'
        },
        {
          titre: 'Les leçons apprises en chemin',
          contenu: 'Cette reconversion m\'a appris que le bonheur professionnel ne se mesure pas qu\'en euros. Elle m\'a aussi enseigné la patience - les légumes poussent à leur rythme, pas au nôtre. J\'ai découvert la joie de créer quelque chose de tangible, de nourrir les gens, de contribuer à une ville plus verte. Aujourd\'hui, je gagne moins qu\'avant, mais je me lève chaque matin avec l\'envie d\'aller travailler.'
        }
      ],
      conclusion: 'Ma reconversion vers l\'agriculture urbaine n\'est pas qu\'un changement de métier, c\'est une transformation profonde de ma relation au travail et à la vie. Si vous ressentez ce même appel vers plus de sens, n\'ayez pas peur d\'écouter cette petite voix intérieure. Le chemin n\'est pas toujours facile, mais il mène vers une version plus authentique de vous-même.'
    },
    articlesLies: [
      {
        id: 'reconversion-artisanat',
        titre: 'De la finance à l\'artisanat : changer de vie à 40 ans',
        imageUrl: 'https://images.pexels.com/photos/3769999/pexels-photo-3769999.jpeg',
        categorie: 'CARRIÈRE',
        tempsLecture: 10
      },
      {
        id: 'entrepreneuriat-sens',
        titre: 'Entrepreneuriat et quête de sens : concilier profit et impact',
        imageUrl: 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg',
        categorie: 'CARRIÈRE',
        tempsLecture: 8
      },
      {
        id: 'ecologie-quotidien',
        titre: 'Intégrer l\'écologie dans son quotidien professionnel',
        imageUrl: 'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg',
        categorie: 'ENVIRONNEMENT',
        tempsLecture: 6
      }
    ]
  };

  // Intersection Observer
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

  // Reading Progress
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.titre,
        text: article.sousTitre,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // En production, cela ferait un appel API
  };

  return (
    <Layout showEngagement={true}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50 md:ml-[280px]">
        <div 
          className="h-full bg-gradient-to-r transition-all duration-300 ease-out"
          style={{ 
            width: `${readingProgress}%`,
            background: `linear-gradient(90deg, ${article.categorie.couleur}, ${article.categorie.couleur}80)`
          }}
        />
      </div>

      {/* Hero Section */}
      <section 
        ref={sectionRef}
        className="relative h-[70vh] min-h-[500px] overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${article.imageHero})`,
              filter: 'brightness(0.4) contrast(1.2)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-8 left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-black/80 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-inter text-sm">Retour</span>
          </button>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-end z-10">
          <div className="w-full px-8 lg:px-16 pb-16">
            <div className="max-w-4xl">
              
              {/* Category Badge */}
              <div className="mb-6">
                <div 
                  className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-md border"
                  style={{
                    backgroundColor: `${article.categorie.couleur}20`,
                    borderColor: `${article.categorie.couleur}40`,
                    color: article.categorie.couleur
                  }}
                >
                  <span className="font-inter font-bold text-sm tracking-[0.15em] uppercase">
                    {article.categorie.nom}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-montserrat font-black text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight">
                {article.titre}
              </h1>

              {/* Subtitle */}
              {article.sousTitre && (
                <p className="font-inter text-xl text-white/90 mb-8 leading-relaxed">
                  {article.sousTitre}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.auteur.nom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.datePublication)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.tempsLecture} min de lecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(article.vues)} vues</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section ref={contentRef} className="py-16 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <div className="mb-12">
            <p className="font-inter text-xl text-white/90 leading-relaxed font-medium">
              {article.contenu.introduction}
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {article.contenu.sections.map((section, index) => (
              <div key={index} className="prose prose-invert max-w-none">
                <h2 className="font-montserrat font-bold text-2xl lg:text-3xl text-white mb-6 leading-tight">
                  {section.titre}
                </h2>
                <div className="font-inter text-lg text-white/80 leading-relaxed space-y-6">
                  {section.contenu.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div className="mt-12 p-8 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
            <h3 className="font-montserrat font-bold text-xl text-white mb-4">
              En conclusion
            </h3>
            <p className="font-inter text-lg text-white/80 leading-relaxed">
              {article.contenu.conclusion}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-12">
            <h3 className="font-montserrat font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {article.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white/80 rounded-full font-inter text-sm hover:bg-white/20 transition-colors duration-300 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex items-center justify-between p-6 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
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
                <span>{formatNumber(article.likes + (isLiked ? 1 : 0))}</span>
              </button>

              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white/70 rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Partager</span>
                </button>

                {showShareMenu && (
                  <div className="absolute top-full mt-2 left-0 bg-black/90 border border-white/20 rounded-xl p-4 backdrop-blur-md min-w-[200px]">
                    <div className="space-y-2">
                      <button 
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                      >
                        Copier le lien
                      </button>
                      <button className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300">
                        Twitter
                      </button>
                      <button className="w-full text-left px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300">
                        LinkedIn
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-white/60 text-sm">
              {formatNumber(article.vues)} lectures
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="py-16 px-8 lg:px-16 bg-[#0F0F0F] border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-6 p-8 bg-black/40 border border-white/10 rounded-2xl backdrop-blur-sm">
            <div className="flex-shrink-0">
              <div 
                className="w-20 h-20 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${article.auteur.avatar})` }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-montserrat font-bold text-xl text-white mb-2">
                {article.auteur.nom}
              </h3>
              <p className="font-inter text-white/80 leading-relaxed">
                {article.auteur.bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-8 lg:px-16 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#0A0A0A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-montserrat font-bold text-3xl text-white mb-12 text-center">
            Articles similaires
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {article.articlesLies.map((articleLie) => (
              <div
                key={articleLie.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/article/${articleLie.id}`)}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 h-48">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${articleLie.imageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                      {articleLie.categorie}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-montserrat font-bold text-lg text-white mb-2 group-hover:text-violet-400 transition-colors duration-300 line-clamp-2">
                  {articleLie.titre}
                </h3>
                
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{articleLie.tempsLecture} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ArticlePage;