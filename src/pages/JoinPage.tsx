import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
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
// import PartnershipContentSection from '../components/partnership/PartnershipContentSection';

function JoinPage() {
  const [showSections, setShowSections] = useState(false);
  const conceptSectionRef = useRef<HTMLDivElement>(null);

  const handleGoLive = () => {
    setShowSections(true);
  };

  // Utiliser useEffect pour scroller APRÈS que les sections soient rendues
  useEffect(() => {
    if (showSections && conceptSectionRef.current) {
      // Petit délai pour s'assurer que le DOM est bien mis à jour
      setTimeout(() => {
        conceptSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [showSections]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      <Sidebar />
      
      <main className="md:ml-[280px]">
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

            {/* Sections futures à développer */}
            {/* Section 10 : La Machine de Production - Comment on produit le contenu */}
            {/* <PartnershipContentSection /> */}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default JoinPage;