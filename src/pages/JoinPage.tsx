import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import des sections modulaires
import PartnershipHeroSection from '../components/partnership/PartnershipHeroSection';
import PartnershipConceptSection from '../components/partnership/PartnershipConceptSection';
import PartnershipImpactMultifacettesSection from '../components/partnership/PartnershipImpactMultifacettesSection';
import PartnershipTechSection from '../components/partnership/PartnershipTechSection';
import PartnershipEcosystemSection from '../components/partnership/PartnershipEcosystemSection';
import PartnershipCafeSection from '../components/partnership/PartnershipCafeSection';
import PartnershipVisionSection from '../components/partnership/PartnershipVisionSection';
import PartnershipTeamSection from '../components/partnership/PartnershipTeamSection';
import PartnershipCarouselSection from '../components/partnership/PartnershipCarouselSection';
import PartnershipCTASection from '../components/partnership/PartnershipCTASection';

function JoinPage() {
  // État pour gérer l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  // Le mot de passe est stocké dans les variables d'environnement pour la sécurité
  const CORRECT_PASSWORD = import.meta.env.VITE_JOIN_PASSWORD || '';

  // Vérifier si l'utilisateur est déjà authentifié (stocké dans la session)
  useEffect(() => {
    const isAuth = sessionStorage.getItem('joinPageAuth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // États existants
  const [showSections, setShowSections] = useState(false);
  const conceptSectionRef = useRef<HTMLDivElement>(null);

  const handleGoLive = () => {
    setShowSections(true);
  };

  // Fonction pour vérifier le mot de passe
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('joinPageAuth', 'true');
      setShowError(false);
    } else {
      setShowError(true);
      // Effacer le message d'erreur après 3 secondes
      setTimeout(() => setShowError(false), 3000);
    }
  };

  // Utiliser useEffect pour scroller APRÈS que les sections soient rendues
  useEffect(() => {
    if (showSections && conceptSectionRef.current) {
      setTimeout(() => {
        conceptSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [showSections]);

  // Si non authentifié, afficher le formulaire de mot de passe
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          {/* Logo ou titre */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">Accès Partenaires</h1>
            <p className="text-gray-500">Cette page est réservée aux partenaires potentiels</p>
          </div>

          {/* Formulaire de mot de passe */}
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-gray-900"
                placeholder="Entrez le mot de passe"
                required
              />
            </div>

            {/* Message d'erreur */}
            {showError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                Mot de passe incorrect. Veuillez réessayer.
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-violet-500/25"
            >
              Accéder à la page
            </button>
          </form>

          {/* Lien de contact */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Vous n'avez pas le mot de passe ?</p>
            <a href="mailto:contact@origines.media" className="text-violet-600 hover:text-violet-500 transition-colors">
              Contactez-nous
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Si authentifié, afficher la page normale
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar />

      <main className="">
        {/* Bouton de déconnexion */}
        <button
          onClick={() => {
            sessionStorage.removeItem('joinPageAuth');
            setIsAuthenticated(false);
          }}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm transition-colors shadow-sm text-gray-700"
        >
          Déconnexion
        </button>

        {/* Section 1 : Hero - L'accroche, la promesse, les chiffres clés */}
        <PartnershipHeroSection onGoLive={handleGoLive} />

        {/* Sections qui apparaissent après le clic sur GO */}
        {showSections && (
          <>
            {/* Div de référence pour le scroll */}
            <div ref={conceptSectionRef} />

            {/* Section 2 : Le Concept - La vision du partenariat Wanted × Origines */}
            <PartnershipConceptSection />

            {/* Section 3 : La Vision - Roadmap et projection temporelle */}
            <PartnershipVisionSection />

            {/* Section 4 : L'Écosystème - Les partenariats par verticale média */}
            <PartnershipEcosystemSection />

            {/* Section 5 : Le Café - L'espace physique de rencontre */}
            <PartnershipCafeSection />

            {/* Section 6 : L'Impact - Ce que ça change concrètement */}
            <PartnershipImpactMultifacettesSection />

            {/* Section 7 : La Tech du Troc - Le business model innovant */}
            <PartnershipTechSection />

            {/* Section 8 : L'Équipe - Les porteurs du projet */}
            <PartnershipTeamSection />

            {/* Section 8 : Synthèse - Tout le projet en 14 slides */}
            <PartnershipCarouselSection />

            {/* Section 9 : Call to Action Final - Passer à l'action */}
            <PartnershipCTASection />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default JoinPage;
