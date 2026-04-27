import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import PageTransition from './components/PageTransition/PageTransition';

function lazyRetry(factory: () => Promise<{ default: React.ComponentType<any> }>) {
  return lazy(() =>
    factory().catch(() => {
      const reloaded = sessionStorage.getItem('chunk-retry');
      if (!reloaded) {
        sessionStorage.setItem('chunk-retry', '1');
        window.location.reload();
      }
      sessionStorage.removeItem('chunk-retry');
      return factory();
    })
  );
}

const CookieConsent = lazyRetry(() => import('./components/CookieConsent'));
const ExitIntentPopup = lazyRetry(() => import('./components/ExitIntentPopup'));

// Composant pour scroller en haut à chaque changement de page
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function RedirectToArticle() {
  const { slug } = useParams();
  return <Navigate to={`/article/${slug}`} replace />;
}

function RedirectToRecommandation() {
  const { slug } = useParams();
  return <Navigate to={`/recommandations/${slug}`} replace />;
}

const RecommandationTypePage = lazyRetry(() => import('./pages/RecommandationTypePage'));

const RECO_TYPE_KEYS = new Set([
  "livres", "films-series", "musique", "podcasts", "youtube",
  "reseaux-sociaux", "activite", "destination", "culture", "produit", "produits",
]);

function RecommandationResolver() {
  const { slug } = useParams();
  if (slug && RECO_TYPE_KEYS.has(slug)) {
    return <RecommandationTypePage />;
  }
  return <RecommandationPage />;
}

// Lazy loading des pages
const HomePage = lazyRetry(() => import('./pages/HomePageV2'));
const UniversPage = lazyRetry(() => import('./pages/UniversPage'));
const SeriesPage = lazyRetry(() => import('./pages/SeriesPage'));
const SeriesDetailPage = lazyRetry(() => import('./pages/SeriesDetailPage'));
const FormatPage = lazyRetry(() => import('./pages/FormatPage'));
const BibliothequePage = lazyRetry(() => import('./pages/BibliothequePage'));
const ArticlePage = lazyRetry(() => import('./pages/ArticlePageV2'));
const VideoPage = lazyRetry(() => import('./pages/VideoPage'));
const VideosPage = lazyRetry(() => import('./pages/VideosPage'));
const ProductionDetailPage = lazyRetry(() => import('./pages/ProductionDetailPage'));
const PortraitDetailPage = lazyRetry(() => import('./pages/PortraitDetailPage'));
const HistoiresPage = lazyRetry(() => import('./pages/HistoiresPage'));
const ArticlesPage = lazyRetry(() => import('./pages/ArticlesPageV2'));
const AboutPage = lazyRetry(() => import('./pages/AboutPage'));
const ContactPage = lazyRetry(() => import('./pages/ContactPage'));
const LegalPage = lazyRetry(() => import('./pages/LegalPage'));
const CGUPage = lazyRetry(() => import('./pages/CGUPage'));
const CGVPage = lazyRetry(() => import('./pages/CGVPage'));
const PartnershipsPage = lazyRetry(() => import('./pages/PartnershipsPage'));
const JoinPage = lazyRetry(() => import('./pages/JoinPage'));
const ShareStoryPage = lazyRetry(() => import('./pages/ShareStoryPage'));
const RecommandationsPage = lazyRetry(() => import('./pages/RecommandationsPage'));
const AffiliateProductsPage = lazyRetry(() => import('./pages/AffiliateProductsPage'));
const AffiliateProductDetailPage = lazyRetry(() => import('./pages/AffiliateProductDetailPage'));
const RecommandationPage = lazyRetry(() => import('./pages/RecommandationPage'));
const ProposerRecoPage = lazyRetry(() => import('./pages/ProposerRecoPage'));
const BoutiquePage = lazyRetry(() => import('./pages/BoutiquePage'));
const EnsemblePage = lazyRetry(() => import('./pages/EnsemblePage'));
const NewsletterPage = lazyRetry(() => import('./pages/NewsletterPage'));
const LettreDuDimanchePage = lazyRetry(() => import('./pages/LettreDuDimanchePage'));
const JoinPartnerPage = lazyRetry(() => import('./pages/JoinPartnerPage'));
const GuidesPage = lazyRetry(() => import('./pages/GuidesPage'));
const MediaPage = lazyRetry(() => import('./pages/MediaPage'));
const ProdPage = lazyRetry(() => import('./pages/ProdPage'));
const TypePage = lazyRetry(() => import('./pages/TypePage'));
const ComprendreArticlePage = lazyRetry(() => import('./pages/ComprendreArticlePage'));
const ReflexionsArticlePage = lazyRetry(() => import('./pages/ReflexionsArticlePage'));
const TemoignagesPage = lazyRetry(() => import('./pages/TemoignagesPage'));
const EcrireHistoirePage = lazyRetry(() => import('./pages/EcrireHistoirePage'));
const TemoignagesArticlePage = lazyRetry(() => import('./pages/TemoignagesArticlePage'));
const PortraitsArticlePage = lazyRetry(() => import('./pages/PortraitsArticlePage'));
const DossiersPage = lazyRetry(() => import('./pages/DossiersPage'));
const DossierDetailPage = lazyRetry(() => import('./pages/DossierDetailPage'));
const ComptePage = lazyRetry(() => import('./pages/ComptePage'));
const ProfilPage = lazyRetry(() => import('./pages/compte/ProfilPage'));
const ListePage = lazyRetry(() => import('./pages/compte/ListePage'));
const JournauxPage = lazyRetry(() => import('./pages/compte/JournauxPage'));
const ParametresPage = lazyRetry(() => import('./pages/compte/ParametresPage'));
const InscriptionPage = lazyRetry(() => import('./pages/InscriptionPage'));
const ConnexionPage = lazyRetry(() => import('./pages/ConnexionPage'));
const DeconnexionPage = lazyRetry(() => import('./pages/DeconnexionPage'));
const RecherchePage = lazyRetry(() => import('./pages/RecherchePage'));
const ConfidentialitePage = lazyRetry(() => import('./pages/ConfidentialitePage'));
const CookiesPage = lazyRetry(() => import('./pages/CookiesPage'));
const PlanDuSitePage = lazyRetry(() => import('./pages/PlanDuSitePage'));
const SousTopicPage = lazyRetry(() => import('./pages/SousTopicPage'));
const NotFoundPage = lazyRetry(() => import('./pages/NotFoundPage'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-gray-400 text-lg">Chargement...</div>
  </div>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <PageTransition />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/univers" element={<UniversPage />} />
        <Route path="/univers/:universId" element={<UniversPage />} />
        <Route path="/esprit" element={<Navigate to="/univers/esprit" replace />} />
        <Route path="/corps" element={<Navigate to="/univers/corps" replace />} />
        <Route path="/liens" element={<Navigate to="/univers/liens" replace />} />
        <Route path="/monde" element={<Navigate to="/univers/monde" replace />} />
        <Route path="/avenir" element={<Navigate to="/univers/avenir" replace />} />
        <Route path="/univers/:universId/:soustopic" element={<SousTopicPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/series/:slug" element={<SeriesDetailPage />} />
        <Route path="/format/:formatId" element={<FormatPage />} />
        <Route path="/bibliotheque" element={<BibliothequePage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/programmes" element={<ProdPage />} />
        <Route path="/production/:slug" element={<RedirectToArticle />} />
        <Route path="/histoires" element={<HistoiresPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/histoire/:slug" element={<PortraitDetailPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/video/:slug" element={<VideoPage />} />
        <Route path="/recit/:slug" element={<RedirectToArticle />} />
        <Route path="/a-propos" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/partenariats" element={<PartnershipsPage />} />
        <Route path="/rejoindre" element={<JoinPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/lettre-du-dimanche" element={<LettreDuDimanchePage />} />
        <Route path="/join-partner" element={<JoinPartnerPage />} />
        <Route path="/racontez-votre-histoire" element={<Navigate to="/ecrire-mon-histoire" replace />} />
        <Route path="/partager-son-histoire" element={<Navigate to="/ecrire-mon-histoire" replace />} />
        <Route path="/recommandations/produits" element={<AffiliateProductsPage />} />
        <Route path="/recommandations/produits/:slug" element={<AffiliateProductDetailPage />} />
        <Route path="/recommandations" element={<RecommandationsPage />} />
        <Route path="/proposer-une-reco" element={<ProposerRecoPage />} />
        <Route path="/recommandation/:slug" element={<RedirectToRecommandation />} />
        <Route path="/recommandations/:slug" element={<RecommandationResolver />} />
        <Route path="/boutique" element={<BoutiquePage />} />
        <Route path="/boutique/:guideSlug" element={<BoutiquePage />} />
        <Route path="/academie" element={<Navigate to="/boutique" replace />} />
        <Route path="/academy" element={<Navigate to="/boutique" replace />} />
        <Route path="/communaute" element={<Navigate to="/ensemble" replace />} />
        <Route path="/ensemble" element={<EnsemblePage />} />
        <Route path="/comprendre" element={<Navigate to="/articles" replace />} />
        <Route path="/comprendre/:slug" element={<ComprendreArticlePage />} />
        <Route path="/reflexions" element={<Navigate to="/articles" replace />} />
        <Route path="/reflexions/:slug" element={<ReflexionsArticlePage />} />
        <Route path="/temoignages" element={<TemoignagesPage />} />
        <Route path="/ecrire-mon-histoire" element={<EcrireHistoirePage />} />
        <Route path="/temoignages/:slug" element={<TemoignagesArticlePage />} />
        <Route path="/portraits" element={<Navigate to="/temoignages" replace />} />
        <Route path="/portraits/:slug" element={<PortraitsArticlePage />} />
        <Route path="/dossiers" element={<DossiersPage />} />
        <Route path="/dossiers/:slug" element={<DossierDetailPage />} />
        <Route path="/mentions-legales" element={<LegalPage />} />
        <Route path="/cgu" element={<CGUPage />} />
        <Route path="/cgv" element={<CGVPage />} />
        <Route path="/confidentialite" element={<ConfidentialitePage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/plan-du-site" element={<PlanDuSitePage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route path="/compte" element={<ComptePage />} />
        <Route path="/compte/profil" element={<ProfilPage />} />
        <Route path="/compte/liste" element={<ListePage />} />
        <Route path="/compte/journaux" element={<JournauxPage />} />
        <Route path="/compte/parametres" element={<ParametresPage />} />
        <Route path="/deconnexion" element={<DeconnexionPage />} />
        <Route path="/recherche" element={<RecherchePage />} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}><CookieConsent /></Suspense>
      <Suspense fallback={null}><ExitIntentPopup /></Suspense>
    </>
  );
}

export default App;
