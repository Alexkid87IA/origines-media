import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import CookieConsent from './components/CookieConsent';
// import SkinWrapper from './components/SkinWrapper';

// Composant pour scroller en haut à chaque changement de page
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Lazy loading des pages
const HomePage = lazy(() => import('./pages/HomePage'));
const UniversPage = lazy(() => import('./pages/UniversPage'));
const SeriesPage = lazy(() => import('./pages/SeriesPage'));
const SeriesDetailPage = lazy(() => import('./pages/SeriesDetailPage'));
const FormatPage = lazy(() => import('./pages/FormatPage'));
const BibliothequePage = lazy(() => import('./pages/BibliothequePage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const VideoPage = lazy(() => import('./pages/VideoPage'));
const VideosPage = lazy(() => import('./pages/VideosPage'));
const ProductionDetailPage = lazy(() => import('./pages/ProductionDetailPage'));
const PortraitDetailPage = lazy(() => import('./pages/PortraitDetailPage'));
const HistoiresPage = lazy(() => import('./pages/HistoiresPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const CGUPage = lazy(() => import('./pages/CGUPage'));
const CGVPage = lazy(() => import('./pages/CGVPage'));
const PartnershipsPage = lazy(() => import('./pages/PartnershipsPage'));
const JoinPage = lazy(() => import('./pages/JoinPage'));
const ShareStoryPage = lazy(() => import('./pages/ShareStoryPage'));
const RecommandationsPage = lazy(() => import('./pages/RecommandationsPage'));
const RecommandationPage = lazy(() => import('./pages/RecommandationPage'));
const BoutiquePage = lazy(() => import('./pages/BoutiquePage'));
const EnsemblePage = lazy(() => import('./pages/EnsemblePage'));
const NewsletterPage = lazy(() => import('./pages/NewsletterPage'));
const JoinPartnerPage = lazy(() => import('./pages/JoinPartnerPage'));
const RecherchePage = lazy(() => import('./pages/RecherchePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-gray-400 text-lg">Chargement...</div>
  </div>
);

function App() {
  return (
    <>
      <SplashScreen />
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/univers" element={<UniversPage />} />
        <Route path="/univers/:universId" element={<UniversPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/series/:slug" element={<SeriesDetailPage />} />
        <Route path="/format/:formatId" element={<FormatPage />} />
        <Route path="/bibliotheque" element={<BibliothequePage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/production/:slug" element={<ArticlePage />} /> {/* Rétrocompatibilité - redirige vers ArticlePage */}
        <Route path="/histoires" element={<HistoiresPage />} />
        <Route path="/portraits" element={<HistoiresPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/histoire/:slug" element={<PortraitDetailPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/video/:slug" element={<VideoPage />} />
        <Route path="/recit/:slug" element={<ArticlePage />} />
        <Route path="/a-propos" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/partenariats" element={<PartnershipsPage />} />
        <Route path="/rejoindre" element={<JoinPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/join-partner" element={<JoinPartnerPage />} />
        <Route path="/racontez-votre-histoire" element={<ShareStoryPage />} />
        <Route path="/recommandations" element={<RecommandationsPage />} />
        <Route path="/recommandation/:slug" element={<RecommandationPage />} />
        <Route path="/boutique" element={<BoutiquePage />} />
        <Route path="/boutique/:guideSlug" element={<BoutiquePage />} />
        <Route path="/academie" element={<BoutiquePage />} />
        <Route path="/academy" element={<BoutiquePage />} />
        <Route path="/communaute" element={<EnsemblePage />} />
        <Route path="/ensemble" element={<EnsemblePage />} />
        <Route path="/mentions-legales" element={<LegalPage />} />
        <Route path="/cgu" element={<CGUPage />} />
        <Route path="/cgv" element={<CGVPage />} />
        <Route path="/recherche" element={<RecherchePage />} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <CookieConsent />
    </>
  );
}

export default App;
