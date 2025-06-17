// src/pages/ProductionDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Calendar, Tag, Play, BookOpen, Share2, Heart, Volume2, VolumeX } from 'lucide-react';
import { createClient } from '@sanity/client';
import { PRODUCTION_BY_SLUG_QUERY } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// Configuration du client Sanity
const client = createClient({
  projectId: 'sf5v7lj3',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-03-01',
});

interface Production {
  _id: string;
  titre: string;
  description: string;
  imageUrl: string;
  slug: { current: string };
  datePublication: string;
  duree: number;
  videoUrl?: string;
  contenu?: any;
  univers?: {
    nom: string;
    couleur: string;
    slug: { current: string };
  };
  verticale?: {
    nom: string;
    couleurDominante: string;
    slug: { current: string };
  };
  formats?: Array<{
    nom: string;
    slug: { current: string };
  }>;
  tags?: Array<{
    nom: string;
    couleur: string;
    slug: { current: string };
  }>;
}

function ProductionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [production, setProduction] = useState<Production | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchProduction = async () => {
      try {
        console.log('Fetching production with slug:', slug);
        const data = await client.fetch(PRODUCTION_BY_SLUG_QUERY, { slug });
        console.log('Production data:', data);
        
        if (!data) {
          console.log('No production found');
          navigate('/404');
          return;
        }
        
        setProduction(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération de la production:', error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduction();
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!production) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Production non trouvée</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-purple-500 hover:text-purple-400 underline"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const themeColor = production.verticale?.couleurDominante || '#8B5CF6';
  const formattedDate = production.datePublication 
    ? new Date(production.datePublication).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-[280px]">
        {/* Hero Section avec image ou vidéo */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          {/* Background - Image ou Vidéo selon le format */}
          {production.videoUrl && production.formats?.[0]?.nom === 'Vidéo' ? (
            <>
              {/* Vidéo en arrière-plan pour les formats vidéo */}
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.4) contrast(1.1)' }}
              >
                <source src={production.videoUrl} type="video/mp4" />
                {/* Fallback sur l'image si la vidéo ne charge pas */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${production.imageUrl || 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg'})`,
                  }}
                />
              </video>
              
              {/* Overlay pour la vidéo */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]/30" />
              
              {/* Indicateur de lecture vidéo */}
              <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white/80 text-xs font-inter uppercase tracking-wider">Vidéo</span>
              </div>
            </>
          ) : (
            <>
              {/* Image de fond pour les autres formats */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${production.imageUrl || 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg'})`,
                }}
              >
                {/* Overlays pour assombrir */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]/40" />
              </div>
            </>
          )}

          {/* Contenu du hero */}
          <div className="relative h-full flex flex-col justify-between p-8 lg:p-16">
            {/* Header avec navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-3 text-white/80 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-inter text-sm uppercase tracking-wider">Retour</span>
              </button>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLiked(!liked)}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors">
                  <Share2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Titre et métadonnées */}
            <div className="max-w-4xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {production.verticale && (
                  <Link
                    to={`/verticale/${production.verticale.slug.current}`}
                    className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${themeColor}30`,
                      color: themeColor,
                      borderWidth: '1px',
                      borderColor: `${themeColor}50`
                    }}
                  >
                    {production.verticale.nom}
                  </Link>
                )}
                
                {production.formats?.map((format) => (
                  <span
                    key={format.slug.current}
                    className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs font-medium uppercase tracking-wider"
                  >
                    {format.nom}
                  </span>
                ))}
              </div>

              {/* Titre */}
              <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6 leading-[0.9]">
                {production.titre}
              </h1>

              {/* Description */}
              <p className="font-inter text-lg lg:text-xl text-white/80 leading-relaxed max-w-3xl mb-8">
                {production.description}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
                {formattedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                )}
                
                {production.duree && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{production.duree} min</span>
                  </div>
                )}

                {production.formats?.[0] && (
                  <div className="flex items-center gap-2">
                    {production.formats[0].nom === 'Vidéo' ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                    <span>{production.formats[0].nom}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto px-8 lg:px-16 py-16">
          {/* Tags */}
          {production.tags && production.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="font-inter text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
                Thèmes abordés
              </h3>
              <div className="flex flex-wrap gap-3">
                {production.tags.map((tag) => tag && tag.slug ? (
                  <Link
                    key={tag.slug.current}
                    to={`/tag/${tag.slug.current}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <Tag className="w-3 h-3" style={{ color: tag.couleur || '#ffffff' }} />
                    <span className="text-sm text-white/80">{tag.nom || 'Sans nom'}</span>
                  </Link>
                ) : null)}
              </div>
            </div>
          )}

          {/* Contenu de l'article ou Section Vidéo */}
          <div className="prose prose-invert prose-lg max-w-none">
            {production.videoUrl && production.formats?.[0]?.nom === 'Vidéo' ? (
              /* Section Lecteur Vidéo */
              <div className="mb-12">
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  <div className="aspect-video">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      poster={production.imageUrl}
                    >
                      <source src={production.videoUrl} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                  </div>
                </div>
                
                {/* Description de la vidéo */}
                <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="font-montserrat font-bold text-xl text-white mb-4">
                    À propos de cette vidéo
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {production.description}
                  </p>
                </div>
              </div>
            ) : (
              /* Contenu textuel pour les articles */
              <div className="space-y-6 text-white/80 leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <blockquote className="border-l-4 pl-6 italic text-white/60" style={{ borderColor: themeColor }}>
                  "Une citation inspirante qui illustre le propos de l'article et apporte une 
                  perspective unique sur le sujet traité."
                </blockquote>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          {production.verticale && (
            <div className="mt-16 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <h3 className="font-montserrat font-bold text-2xl text-white mb-4">
                Aller plus loin
              </h3>
              <p className="text-white/70 mb-6">
                Explorez d'autres contenus de la verticale {production.verticale.nom}
              </p>
              <Link
                to={`/verticale/${production.verticale.slug.current}`}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all hover:gap-4"
                style={{
                  backgroundColor: `${themeColor}20`,
                  color: themeColor,
                  borderWidth: '1px',
                  borderColor: `${themeColor}40`
                }}
              >
                Découvrir plus de contenus
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ProductionDetailPage;