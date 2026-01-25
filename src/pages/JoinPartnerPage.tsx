import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

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

function JoinPartnerPage() {
  // État pour gérer l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si l'utilisateur est déjà authentifié (stocké dans la session)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const isAuth = sessionStorage.getItem('joinPageAuth');
      if (isAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error accessing sessionStorage:', error);
    }
  }, []);

  // États existants
  const [showSections, setShowSections] = useState(false);
  const conceptSectionRef = useRef<HTMLDivElement>(null);

  const handleGoLive = () => {
    setShowSections(true);
  };

  // Fonction pour vérifier le mot de passe via API serverless
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);

        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('joinPageAuth', 'true');
          } catch (error) {
            console.error('Error setting sessionStorage:', error);
          }
        }
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
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
                disabled={isLoading}
                aria-describedby={showError ? 'password-error' : undefined}
                aria-invalid={showError}
              />
            </div>

            {/* Message d'erreur */}
            {showError && (
              <div
                id="password-error"
                role="alert"
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                Mot de passe incorrect. Veuillez réessayer.
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              {isLoading ? 'Vérification...' : 'Accéder à la page'}
            </button>
          </form>

          {/* Lien de contact */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Vous n'avez pas le mot de passe ?</p>
            <a
              href="mailto:contact@origines.media"
              className="text-violet-600 hover:text-violet-500 transition-colors focus:outline-none focus:underline"
            >
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
      <SEO
        title="Devenir partenaire"
        description="Rejoignez Origines Media en tant que partenaire. Découvrez nos opportunités de collaboration et participez à une aventure médiatique unique."
        url="/rejoindre-partenaire"
        noindex={true}
      />
      <Navbar />

      <main>
        {/* Bouton de déconnexion */}
        <button
          onClick={() => {
            sessionStorage.removeItem('joinPageAuth');
            setIsAuthenticated(false);
          }}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm transition-colors shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
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

export default JoinPartnerPage;
