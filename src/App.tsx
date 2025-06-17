import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UniversPage from './pages/UniversPage';
import SeriesPage from './pages/SeriesPage';
import FormatPage from './pages/FormatPage';
import BibliothequePage from './pages/BibliothequePage';
import ArticlePage from './pages/ArticlePage';
import VideoPage from './pages/VideoPage';
import ProductionDetailPage from './pages/ProductionDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import PartnershipsPage from './pages/PartnershipsPage';
import NotFoundPage from './pages/NotFoundPage';
import TestSanity from './components/TestSanity';
import PortraitDetailPage from './pages/PortraitDetailPage';


function App() {
  return (
    <Routes>
      {/* Page d'accueil */}
      <Route path="/" element={<HomePage />} />
      
      {/* 🆕 Route de test Sanity */}
      <Route path="/test-sanity" element={<TestSanity />} />
      
      {/* ✅ CORRECTION : Route pour la page /univers avec le bon composant */}
      <Route path="/univers" element={<UniversPage />} />
      
      {/* Pages Univers - Routes dynamiques */}
      <Route path="/univers/psychologie" element={
        <UniversPage 
          universId="psychologie"
          universName="PSYCHOLOGIE"
          universColor="#4299E1"
        />
      } />
      
      <Route path="/univers/societe" element={
        <UniversPage 
          universId="societe"
          universName="SOCIÉTÉ"
          universColor="#ED8936"
        />
      } />
      
      <Route path="/univers/carriere" element={
        <UniversPage 
          universId="carriere"
          universName="CARRIÈRE"
          universColor="#4A5568"
        />
      } />
      
      <Route path="/univers/voyage" element={
        <UniversPage 
          universId="voyage"
          universName="VOYAGE"
          universColor="#48BB78"
        />
      } />
      
      <Route path="/univers/art-creativite" element={
        <UniversPage 
          universId="art-creativite"
          universName="ART & CRÉATIVITÉ"
          universColor="#9F7AEA"
        />
      } />
      
      <Route path="/univers/spiritualite" element={
        <UniversPage 
          universId="spiritualite"
          universName="SPIRITUALITÉ"
          universColor="#805AD5"
        />
      } />
      
      <Route path="/univers/sante" element={
        <UniversPage 
          universId="sante"
          universName="SANTÉ"
          universColor="#38B2AC"
        />
      } />
      
      <Route path="/univers/technologie" element={
        <UniversPage 
          universId="technologie"
          universName="TECHNOLOGIE"
          universColor="#3182CE"
        />
      } />
      
      <Route path="/univers/relations" element={
        <UniversPage 
          universId="relations"
          universName="RELATIONS"
          universColor="#E53E3E"
        />
      } />
      
      <Route path="/univers/environnement" element={
        <UniversPage 
          universId="environnement"
          universName="ENVIRONNEMENT"
          universColor="#38A169"
        />
      } />
      
      {/* Page Séries Exclusives */}
      <Route path="/series" element={<SeriesPage />} />
      
      {/* ✅ CORRECTION : Routes pour les 8 formats exclusifs avec paramètre dynamique */}
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
      
      {/* Pages légales */}
      <Route path="/mentions-legales" element={<LegalPage />} />
      <Route path="/cgu" element={<LegalPage />} />
      <Route path="/politique-confidentialite" element={<LegalPage />} />
      
      {/* Pages génériques */}
      <Route path="/essentiels" element={<div>Page Les Essentiels</div>} />
      <Route path="/fragments" element={<div>Page Fragments</div>} />
      <Route path="/rejoindre" element={<div>Page Rejoindre la Communauté</div>} />
      <Route path="/proposer-histoire" element={<div>Page Proposer mon Histoire</div>} />
      <Route path="/equipe" element={<div>Page Équipe</div>} />
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/video/:id" element={<ProductionDetailPage />} />
    </Routes>
  );
}

export default App;