// src/pages/PortraitDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Quote, Share2, Heart } from 'lucide-react';
import { createClient } from '@sanity/client';
import { PORTRAIT_BY_SLUG_QUERY } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// Configuration du client Sanity
const client = createClient({
  projectId: 'sf5v7lj3',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-03-01',
});

interface Portrait {
  _id: string;
  titre: string;
  categorie: string;
  accroche: string;
  imageUrl: string;
  slug: { current: string };
  biographie?: string;
  citation?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  productions?: Array<{
    _id: string;
    titre: string;
    imageUrl: string;
    slug: { current: string };
  }>;
}

function PortraitDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [portrait, setPortrait] = useState<Portrait | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPortrait = async () => {
      try {
        console.log('Fetching portrait with slug:', slug);
        const data = await client.fetch(PORTRAIT_BY_SLUG_QUERY, { slug });
        console.log('Portrait data:', data);
        
        if (!data) {
          console.log('No portrait found');
          navigate('/404');
          return;
        }
        
        setPortrait(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération du portrait:', error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchPortrait();
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!portrait) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Portrait non trouvé</h1>
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

  const formattedDate = portrait.dateNaissance 
    ? new Date(portrait.dateNaissance).toLocaleDateString('fr-FR', {
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
        {/* Hero Section avec portrait */}
        <div className="relative">
          {/* Header de navigation */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-8 lg:p-16">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-white/80 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors backdrop-blur-sm bg-black/20">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-inter text-sm uppercase tracking-wider">Retour</span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLiked(!liked)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors backdrop-blur-sm bg-black/20"
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
              <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/40 transition-colors backdrop-blur-sm bg-black/20">
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Layout en deux colonnes */}
          <div className="grid lg:grid-cols-2 min-h-[80vh]">
            {/* Colonne image */}
            <div className="relative h-[50vh] lg:h-auto">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${portrait.imageUrl || 'https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg'})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#0A0A0A]/30 lg:to-[#0A0A0A]" />
              </div>
            </div>

            {/* Colonne contenu */}
            <div className="flex flex-col justify-center p-8 lg:p-16 xl:p-24">
              {/* Catégorie */}
              <p className="font-inter text-xs uppercase tracking-[0.3em] text-purple-400 mb-4">
                {portrait.categorie || 'Portrait'}
              </p>

              {/* Nom */}
              <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6 leading-[0.9]">
                {portrait.titre}
              </h1>

              {/* Accroche */}
              <p className="font-inter text-lg lg:text-xl text-white/80 leading-relaxed mb-8">
                {portrait.accroche}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-6 text-white/60 text-sm mb-8">
                {formattedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Né(e) le {formattedDate}</span>
                  </div>
                )}
                {portrait.lieuNaissance && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{portrait.lieuNaissance}</span>
                  </div>
                )}
              </div>

              {/* Citation */}
              {portrait.citation && (
                <blockquote className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-purple-500/20" />
                  <p className="font-inter text-xl lg:text-2xl text-white/90 italic leading-relaxed pl-8">
                    "{portrait.citation}"
                  </p>
                </blockquote>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto px-8 lg:px-16 py-16">
          {/* Biographie */}
          <div className="mb-16">
            <h2 className="font-montserrat font-bold text-3xl text-white mb-8">
              Biographie
            </h2>
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="space-y-6 text-white/80 leading-relaxed">
                {portrait.biographie ? (
                  <p>{portrait.biographie}</p>
                ) : (
                  <>
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
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                      doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                      veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Productions liées */}
          {portrait.productions && portrait.productions.length > 0 && (
            <div className="mt-16">
              <h2 className="font-montserrat font-bold text-2xl text-white mb-8">
                Productions liées
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portrait.productions.map((production) => (
                  <Link
                    key={production._id}
                    to={`/production/${production.slug.current}`}
                    className="group relative overflow-hidden rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div 
                      className="aspect-video bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${production.imageUrl || 'https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg'})`,
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-inter font-medium text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                        {production.titre}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PortraitDetailPage;