import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UniversPage from './pages/UniversPage';
import SeriesPage from './pages/SeriesPage';
import FormatPage from './pages/FormatPage';
import BibliothequePage from './pages/BibliothequePage';
import ArticlePage from './pages/ArticlePage'; // ✅ CORRECTION: Le chemin pointe maintenant vers le fichier directement dans /pages
import VideoPage from './pages/VideoPage';
import ProductionDetailPage from './pages/ProductionDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import PartnershipsPage from './pages/PartnershipsPage';
import NotFoundPage from './pages/NotFoundPage';
import TestSanity from './components/TestSanity';
import PortraitDetailPage from './pages/PortraitDetailPage';
import JoinPage from './pages/JoinPage';
import ArticlesDebug from './pages/ArticlesDebug';

function App() {
  return (
    <Routes>
      {/* Page d'accueil */}
      <Route path="/" element={<HomePage />} />
      
      {/* 🆕 Route de test Sanity */}
      <Route path="/test-sanity" element={<TestSanity />} />
      
      {/* ✅ CORRECTION : Route pour la page /univers listant tous les univers */}
      <Route path="/univers" element={<UniversPage />} />
      
      {/* ✅ CORRECTION : Route DYNAMIQUE pour gérer TOUS les univers individuels */}
      <Route path="/univers/:universId" element={<UniversPage />} />
      
      {/* SUPPRIMÉ : Toutes les routes individuelles pour chaque univers
          qui étaient hardcodées comme :
          - /univers/psychologie
          - /univers/societe
          - /univers/carriere
          - etc.
          Elles sont maintenant gérées par la route dynamique ci-dessus
      */}
      
      {/* Page Séries Exclusives */}
      <Route path="/series" element={<SeriesPage />} />
      
      {/* ✅ Routes pour les 8 formats exclusifs avec paramètre dynamique */}
      <Route path="/format/:formatId" element={<FormatPage />} />
      
      {/* Page Bibliothèque Complète */}
      <Route path="/bibliotheque" element={<BibliothequePage />} />
      
      {/* 🆕 Route pour la page de détail Production */}
      <Route path="/production/:slug" element={<ProductionDetailPage />} />
      <Route path="/histoire/:slug" element={<PortraitDetailPage />} />
      
      {/* Templates de contenu */}
      <Route path="/article/:slug" element={<ArticlePage />} />
      <Route path="/video/:slug" element={<VideoPage />} />
      <Route path="/recit/:slug" element={<ArticlePage />} />
      
      {/* Pages institutionnelles */}
      <Route path="/a-propos" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/partenariats" element={<PartnershipsPage />} />
      <Route path="/rejoindre" element={<JoinPage />} />
      
      {/* Pages légales */}
      <Route path="/mentions-legales" element={<LegalPage />} />
      <Route path="/cgu" element={<LegalPage />} />
      <Route path="/politique-confidentialite" element={<LegalPage />} />
      
      {/* Pages génériques */}
      <Route path="/essentiels" element={<div>Page Les Essentiels</div>} />
      <Route path="/fragments" element={<div>Page Fragments</div>} />
      <Route path="/proposer-histoire" element={<div>Page Proposer mon Histoire</div>} />
      <Route path="/equipe" element={<div>Page Équipe</div>} />
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/video/:id" element={<ProductionDetailPage />} />
      <Route path="/debug/articles" element={<ArticlesDebug />} />
    </Routes>
  );
}

export default App;