// src/pages/PortraitDetailPage.tsx
// Design épuré - Style minimaliste blanc

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Quote, Share2, Heart } from 'lucide-react';
import { sanityFetch } from '../lib/sanity';
import { PORTRAIT_BY_SLUG_QUERY } from '../lib/queries';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
        const data = await sanityFetch(PORTRAIT_BY_SLUG_QUERY, { slug });

        if (!data) {
          navigate('/404');
          return;
        }

        setPortrait(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPortrait();
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!portrait) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-gray-900 text-2xl font-bold mb-4">Portrait non trouvé</h1>
          <button
            onClick={() => navigate('/')}
            className="text-violet-600 hover:text-violet-700 font-medium"
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
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main>
        {/* Hero Section avec portrait */}
        <div className="relative">
          {/* Header de navigation */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-8 lg:p-16">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-white/90 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/50 transition-colors backdrop-blur-sm bg-black/20">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="text-sm uppercase tracking-wider">Retour</span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLiked(!liked)}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-white/50 transition-colors backdrop-blur-sm bg-black/20"
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
              <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-white/50 transition-colors backdrop-blur-sm bg-black/20">
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
                  backgroundImage: `url(${portrait.imageUrl || '/placeholder.svg'})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/30 lg:to-white" />
              </div>
            </div>

            {/* Colonne contenu */}
            <div className="flex flex-col justify-center p-8 lg:p-16 xl:p-24 bg-white">
              {/* Catégorie */}
              <p className="text-xs uppercase tracking-[0.3em] text-violet-600 mb-4 font-medium">
                {portrait.categorie || 'Portrait'}
              </p>

              {/* Nom */}
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 mb-6 leading-[0.9]">
                {portrait.titre}
              </h1>

              {/* Accroche */}
              <p className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8">
                {portrait.accroche}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-6 text-gray-500 text-sm mb-8">
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
                <blockquote className="relative bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <Quote className="absolute -top-3 -left-3 w-8 h-8 text-violet-200" />
                  <p className="text-xl lg:text-2xl text-gray-700 italic leading-relaxed pl-4">
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
            <h2 className="font-bold text-3xl text-gray-900 mb-8">
              Biographie
            </h2>
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6 text-gray-600 leading-relaxed">
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
              <h2 className="font-bold text-2xl text-gray-900 mb-8">
                Productions liées
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portrait.productions.map((production) => (
                  <Link
                    key={production._id}
                    to={`/article/${production.slug.current}`}
                    className="group relative overflow-hidden rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all"
                  >
                    <div
                      className="aspect-video bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${production.imageUrl || '/placeholder.svg'})`,
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2">
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

      <Footer />
    </div>
  );
}

export default PortraitDetailPage;
