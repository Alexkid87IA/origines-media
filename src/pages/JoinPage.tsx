import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// Import des sections modulaires
import PartnershipHeroSection from '../components/partnership/PartnershipHeroSection';
import PartnershipConceptSection from '../components/partnership/PartnershipConceptSection';
import PartnershipImpactMultifacettesSection from '../components/partnership/PartnershipImpactMultifacettesSection';
import PartnershipCarouselSection from '../components/partnership/PartnershipCarouselSection';
import PartnershipVisionSection from '../components/partnership/PartnershipVisionSection';
// import PartnershipEcosystemSection from '../components/partnership/PartnershipEcosystemSection';
// import PartnershipImpactSection from '../components/partnership/PartnershipImpactSection';
// import PartnershipContentSection from '../components/partnership/PartnershipContentSection';
// import PartnershipTeamSection from '../components/partnership/PartnershipTeamSection';
// import PartnershipTimelineSection from '../components/partnership/PartnershipTimelineSection';
// import PartnershipCTASection from '../components/partnership/PartnershipCTASection';

function JoinPage() {
  const [showSections, setShowSections] = useState(false);

  const handleGoLive = () => {
    setShowSections(true);
    // Scroll smooth vers la première section
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      <Sidebar />
      
      <main className="md:ml-[280px]">
        {/* Section 1 : Hero avec animation ADN et lettre d'intention */}
        <PartnershipHeroSection onGoLive={handleGoLive} />

        {/* Sections qui apparaissent après le clic sur GO */}
        {showSections && (
          <>
            {/* Section 2 : Le Concept Cœur */}
            <PartnershipConceptSection />

            {/* Section 3 : Impact Multi-Facettes */}
            <PartnershipImpactMultifacettesSection />

            {/* Section 4 : Carousel Investissable */}
            <PartnershipCarouselSection />

            {/* Section 5 : Vision Timeline Metro Map */}
            <PartnershipVisionSection />

            {/* Sections suivantes à ajouter */}
            {/* <PartnershipEcosystemSection /> */}
            {/* <PartnershipImpactSection /> */}
            {/* <PartnershipContentSection /> */}
            {/* <PartnershipTeamSection /> */}
            {/* <PartnershipTimelineSection /> */}
            {/* <PartnershipCTASection /> */}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default JoinPage;