import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import CarouselSection from '../components/CarouselSection';
import FragmentsSection from '../components/FragmentsSection';
import BibliothequeSection from '../components/BibliothequeSection';
import UniversSection from '../components/UniversSection';
import EngagementSection from '../components/EngagementSection';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { client } from '../lib/sanity';
import { 
  PORTRAITS_QUERY, 
  VIDEOS_QUERY, 
  UNIVERS_QUERY,
  VERTICALES_WITH_PRODUCTIONS_QUERY 
} from '../lib/queries';

function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // États pour les données Sanity
  const [portraits, setPortraits] = useState([]);
  const [videos, setVideos] = useState([]);
  const [univers, setUnivers] = useState([]);
  const [verticales, setVerticales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupération des données depuis Sanity
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les portraits
        const portraitsData = await client.fetch(PORTRAITS_QUERY);
        setPortraits(portraitsData.map((p: any, index: number) => ({
          id: index + 1,
          titre: p.titre,
          categorie: p.categorie,
          accroche: p.accroche,
          imageUrl: p.imageUrl || "https://images.pexels.com/photos/2519392/pexels-photo-2519392.jpeg",
          url: `/histoire/${p.slug?.current || 'default'}`
        })));

        // Récupérer les vidéos
        const videosData = await client.fetch(VIDEOS_QUERY);
        setVideos(videosData.map((v: any) => ({
          id: v._id,
          titre: v.titre,
          description: v.description,
          thumbnailUrl: v.thumbnailUrl || "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg",
          videoUrl: v.videoUrl
        })));

        // Récupérer les univers
        const universData = await client.fetch(UNIVERS_QUERY);
        console.log('Univers depuis Sanity:', universData);
        
        // Formater les univers
        setUnivers(universData.map((u: any) => ({
          id: u._id,
          nom: u.nom,
          description: u.description,
          imageUrl: u.imageUrl || "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg",
          url: `/univers/${u.slug?.current || 'default'}`
        })));

        // Essayer de récupérer les verticales depuis Sanity
        try {
          const verticalesData = await client.fetch(VERTICALES_WITH_PRODUCTIONS_QUERY);
          console.log('Verticales depuis Sanity:', verticalesData);
          
          if (verticalesData && verticalesData.length > 0) {
            // Formater les verticales avec la couleur correcte
            const verticalesFormatted = verticalesData.map((v: any) => ({
              verticale: {
                id: v._id,
                nom: v.nom,
                couleurDominante: v.couleurDominante || '#8B5CF6',
                description: v.description,
                imageUrl: v.imageUrl
              },
              productions: v.productions?.map((p: any) => ({
                id: p._id,
                titre: p.titre,
                description: p.description,
                imageUrl: p.imageUrl || "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg",
                url: `/production/${p.slug || 'default'}`  // ⚠️ Changez ici - enlevez .current
              })) || []
            }));

            // Ajouter "NOS SÉRIES" comme première verticale
            const nosSeriesVerticale = {
              verticale: {
                id: "cat-series",
                nom: "NOS SÉRIES",
                couleurDominante: "#E11D48",
                description: "Découvrez nos collections de récits et de documentaires exclusifs."
              },
              productions: [
                { 
                  id: "p-01", 
                  titre: "Série phare 1", 
                  imageUrl: "https://images.pexels.com/photos/7130470/pexels-photo-7130470.jpeg", 
                  url: "/production/serie-phare-1"  // Changé de /series/ à /production/
                },
                { 
                  id: "p-02", 
                  titre: "Série phare 2", 
                  imageUrl: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg", 
                  url: "/production/serie-phare-2"  // Changé de /series/ à /production/
                },
                { 
                  id: "p-03", 
                  titre: "Série phare 3", 
                  imageUrl: "https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg", 
                  url: "/production/serie-phare-3"  // Changé de /series/ à /production/
                }
              ]
            };

            setVerticales([nosSeriesVerticale, ...verticalesFormatted]);
          } else {
            // Si pas de verticales dans Sanity, utiliser les données de fallback
            throw new Error('Aucune verticale trouvée dans Sanity');
          }
        } catch (verticalesError) {
          console.error('Erreur verticales, utilisation des données de fallback:', verticalesError);
          
          // Données de fallback avec des couleurs différentes
          const fallbackVerticales = [
            {
              verticale: { 
                id: "cat-series", 
                nom: "NOS SÉRIES", 
                couleurDominante: "#E11D48" 
              },
              productions: [
                { id: "p-01", titre: "Série exemple 1", imageUrl: "https://images.pexels.com/photos/7130470/pexels-photo-7130470.jpeg", url: "/production/serie-exemple-1" },
                { id: "p-02", titre: "Série exemple 2", imageUrl: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg", url: "/production/serie-exemple-2" },
                { id: "p-03", titre: "Série exemple 3", imageUrl: "https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg", url: "/production/serie-exemple-3" }
              ]
            },
            {
              verticale: { 
                id: "1", 
                nom: "PSYCHOLOGIE", 
                couleurDominante: "#10B981"
              },
              productions: [
                { id: "p-04", titre: "L'esprit humain", imageUrl: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg", url: "/production/esprit" },
                { id: "p-05", titre: "Comportements", imageUrl: "https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg", url: "/production/comportements" },
                { id: "p-06", titre: "Émotions", imageUrl: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg", url: "/production/emotions" }
              ]
            },
            {
              verticale: { 
                id: "2", 
                nom: "SOCIÉTÉ", 
                couleurDominante: "#F59E0B"
              },
              productions: [
                { id: "p-07", titre: "Vivre ensemble", imageUrl: "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg", url: "/production/ensemble" },
                { id: "p-08", titre: "Cultures", imageUrl: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg", url: "/production/cultures" },
                { id: "p-09", titre: "Changements", imageUrl: "https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg", url: "/production/changements" }
              ]
            },
            {
              verticale: { 
                id: "3", 
                nom: "CARRIÈRE", 
                couleurDominante: "#3B82F6"
              },
              productions: [
                { id: "p-10", titre: "Leadership", imageUrl: "https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg", url: "/production/leadership" },
                { id: "p-11", titre: "Innovation", imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg", url: "/production/innovation" },
                { id: "p-12", titre: "Succès", imageUrl: "https://images.pexels.com/photos/3184468/pexels-photo-3184468.jpeg", url: "/production/succes" }
              ]
            },
            {
              verticale: { 
                id: "4", 
                nom: "VOYAGE", 
                couleurDominante: "#EF4444"
              },
              productions: [
                { id: "p-13", titre: "Destinations", imageUrl: "https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg", url: "/production/destinations" },
                { id: "p-14", titre: "Aventures", imageUrl: "https://images.pexels.com/photos/3184431/pexels-photo-3184431.jpeg", url: "/production/aventures" },
                { id: "p-15", titre: "Découvertes", imageUrl: "https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg", url: "/production/decouvertes" }
              ]
            },
            {
              verticale: { 
                id: "5", 
                nom: "ART & CRÉATIVITÉ", 
                couleurDominante: "#8B5CF6"
              },
              productions: [
                { id: "p-16", titre: "Créateurs", imageUrl: "https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg", url: "/production/createurs" },
                { id: "p-17", titre: "Processus créatif", imageUrl: "https://images.pexels.com/photos/3184434/pexels-photo-3184434.jpeg", url: "/production/processus" },
                { id: "p-18", titre: "Inspirations", imageUrl: "https://images.pexels.com/photos/3184435/pexels-photo-3184435.jpeg", url: "/production/inspirations" }
              ]
            },
            {
              verticale: { 
                id: "6", 
                nom: "SPIRITUALITÉ", 
                couleurDominante: "#EC4899"
              },
              productions: [
                { id: "p-19", titre: "Méditation", imageUrl: "https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg", url: "/production/meditation" },
                { id: "p-20", titre: "Sagesse", imageUrl: "https://images.pexels.com/photos/3184437/pexels-photo-3184437.jpeg", url: "/production/sagesse" },
                { id: "p-21", titre: "Connexion", imageUrl: "https://images.pexels.com/photos/3184438/pexels-photo-3184438.jpeg", url: "/production/connexion" }
              ]
            },
            {
              verticale: { 
                id: "7", 
                nom: "SANTÉ", 
                couleurDominante: "#14B8A6"
              },
              productions: [
                { id: "p-22", titre: "Bien-être", imageUrl: "https://images.pexels.com/photos/3184439/pexels-photo-3184439.jpeg", url: "/production/bien-etre" },
                { id: "p-23", titre: "Nutrition", imageUrl: "https://images.pexels.com/photos/3184440/pexels-photo-3184440.jpeg", url: "/production/nutrition" },
                { id: "p-24", titre: "Vitalité", imageUrl: "https://images.pexels.com/photos/3184441/pexels-photo-3184441.jpeg", url: "/production/vitalite" }
              ]
            },
            {
              verticale: { 
                id: "8", 
                nom: "TECHNOLOGIE", 
                couleurDominante: "#6366F1"
              },
              productions: [
                { id: "p-25", titre: "Futur", imageUrl: "https://images.pexels.com/photos/3184442/pexels-photo-3184442.jpeg", url: "/production/futur" },
                { id: "p-26", titre: "Innovation tech", imageUrl: "https://images.pexels.com/photos/3184443/pexels-photo-3184443.jpeg", url: "/production/tech" },
                { id: "p-27", titre: "Digital", imageUrl: "https://images.pexels.com/photos/3184444/pexels-photo-3184444.jpeg", url: "/production/digital" }
              ]
            },
            {
              verticale: { 
                id: "9", 
                nom: "RELATIONS", 
                couleurDominante: "#F43F5E"
              },
              productions: [
                { id: "p-28", titre: "Amour", imageUrl: "https://images.pexels.com/photos/3184445/pexels-photo-3184445.jpeg", url: "/production/amour" },
                { id: "p-29", titre: "Famille", imageUrl: "https://images.pexels.com/photos/3184446/pexels-photo-3184446.jpeg", url: "/production/famille" },
                { id: "p-30", titre: "Amitié", imageUrl: "https://images.pexels.com/photos/3184447/pexels-photo-3184447.jpeg", url: "/production/amitie" }
              ]
            },
            {
              verticale: { 
                id: "10", 
                nom: "ENVIRONNEMENT", 
                couleurDominante: "#22C55E"
              },
              productions: [
                { id: "p-31", titre: "Nature", imageUrl: "https://images.pexels.com/photos/3184448/pexels-photo-3184448.jpeg", url: "/production/nature" },
                { id: "p-32", titre: "Écologie", imageUrl: "https://images.pexels.com/photos/3184449/pexels-photo-3184449.jpeg", url: "/production/ecologie" },
                { id: "p-33", titre: "Planète", imageUrl: "https://images.pexels.com/photos/3184450/pexels-photo-3184450.jpeg", url: "/production/planete" }
              ]
            }
          ];
               
          
          setVerticales(fallbackVerticales);
        }

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] overflow-x-hidden">
      {/* Sidebar Desktop - FIXE ET VISIBLE */}
      <Sidebar />

      {/* Mobile Menu Button - Visible uniquement sur mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-black/60 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar Overlay - Visible uniquement sur mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw]">
            <Sidebar isMobile onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content - Margin uniquement sur desktop */}
      <main className="min-h-screen md:ml-[280px]">
        {/* Section Hero - Portraits à la Une */}
        <CarouselSection portraits={portraits} />

        {/* Section 1.1: Acte 1 - FRAGMENTS */}
        <FragmentsSection videos={videos} />

        {/* Section 1.2: Acte 2 - LES ESSENTIELS */}
        <BibliothequeSection verticales={verticales} />

        {/* Section 1.3: Acte 3 - Explorer nos Univers */}
        <UniversSection univers={univers} />

        {/* Section 1.4: Kit d'Inspiration */}
        <EngagementSection />
      </main>

      {/* Footer Premium */}
      <Footer />
    </div>
  );
}

export default HomePage;