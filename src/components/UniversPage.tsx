import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ActeManifeste from './univers/ActeManifeste';
import ActeIncontournables from './univers/ActeIncontournables';
import ActeBibliotheque from './univers/ActeBibliotheque';
import ActeExplorerSujets from './univers/ActeExplorerSujets';
import ActeAutresUnivers from './univers/ActeAutresUnivers';

interface UniversPageProps {
  // Props pour personnaliser le template selon l'univers
  universId?: string;
  universName?: string;
  universColor?: string;
}

const UniversPage: React.FC<UniversPageProps> = ({ 
  universId = 'psychologie',
  universName = 'PSYCHOLOGIE',
  universColor = '#4299E1'
}) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sidebar Desktop - FIXE ET VISIBLE */}
      <Sidebar />

      {/* Main Content - Margin uniquement sur desktop */}
      <main className="min-h-screen md:ml-[280px]">
        
        {/* Acte 1 : Le Manifeste de l'Univers */}
        <ActeManifeste 
          universId={universId}
          universName={universName}
          universColor={universColor}
        />

        {/* Acte 2 : Les Incontournables */}
        <ActeIncontournables 
          universId={universId}
          universName={universName}
          universColor={universColor}
        />

        {/* Acte 3 : La Bibliothèque Complète */}
        <ActeBibliotheque 
          universId={universId}
          universName={universName}
          universColor={universColor}
        />

        {/* Acte 4 : Explorer par Sujet */}
        <ActeExplorerSujets 
          universId={universId}
          universName={universName}
          universColor={universColor}
        />

        {/* Acte 5 : Découvrez d'Autres Univers */}
        <ActeAutresUnivers 
          universId={universId}
          universName={universName}
          universColor={universColor}
        />

      </main>

      {/* Footer Premium */}
      <Footer />
    </div>
  );
};

export default UniversPage;