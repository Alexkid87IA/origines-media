import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import CarouselSection from '../components/CarouselSection';
import FragmentsSection from '../components/FragmentsSection';
import BibliothequeSection from '../components/BibliothequeSection';
import UniversSection from '../components/UniversSection';
import EngagementSection from '../components/EngagementSection';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const portraitsData = [
  {
    id: 1,
    titre: "COMMENT J'AI TROUVÉ LE SENS EN DEVENANT AGRICULTRICE URBAINE",
    categorie: "CARRIÈRE",
    accroche: "De cadre supérieure à cultivatrice de légumes sur les toits parisiens, Marie nous raconte sa transformation radicale et les leçons qu'elle en tire sur le sens du travail.",
    imageUrl: "https://images.pexels.com/photos/2519392/pexels-photo-2519392.jpeg",
    url: "/histoire/agricultrice-urbaine"
  },
  {
    id: 2,
    titre: "LA RESILIENCE D'UN NAVIGATEUR SOLITAIRE FACE À LA TEMPÊTE",
    categorie: "VOYAGE",
    accroche: "Seul face aux éléments déchaînés au milieu de l'Atlantique, Thomas découvre les ressources insoupçonnées de l'esprit humain et redéfinit sa relation au danger.",
    imageUrl: "https://images.pexels.com/photos/1690352/pexels-photo-1690352.jpeg",
    url: "/histoire/navigateur-solitaire"
  },
  {
    id: 3,
    titre: "DE LA FINANCE À L'ARTISANAT : CHANGER DE VIE À 40 ANS",
    categorie: "PSYCHOLOGIE",
    accroche: "Après quinze ans dans la finance, Paul abandonne tout pour devenir ébéniste. Un récit sur le courage de recommencer et la quête d'authenticité.",
    imageUrl: "https://images.pexels.com/photos/3769999/pexels-photo-3769999.jpeg",
    url: "/histoire/reconversion-artisanat"
  },
  {
    id: 4,
    titre: "L'ART COMME THÉRAPIE : GUÉRIR PAR LA CRÉATION",
    categorie: "ART & CRÉATIVITÉ",
    accroche: "Après un burn-out sévère, Emma découvre la peinture et transforme sa souffrance en œuvre d'art. Une exploration profonde du pouvoir guérisseur de la créativité.",
    imageUrl: "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg",
    url: "/histoire/art-therapie"
  },
  {
    id: 5,
    titre: "MÉDITATION EN ENTREPRISE : RÉVOLUTIONNER LE MONDE DU TRAVAIL",
    categorie: "SPIRITUALITÉ",
    accroche: "Comment Julien a introduit la méditation dans sa startup tech et transformé radicalement la culture d'entreprise. Un témoignage sur l'équilibre entre performance et bien-être.",
    imageUrl: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
    url: "/histoire/meditation-entreprise"
  }
];

// Données pour la section "FRAGMENTS" - Vidéos courtes
const videosData = [
  { 
    id: "v-01", 
    titre: "Développer un mindset d'exception", 
    description: "Découvrez les secrets des entrepreneurs qui réussissent et transforment leur vision du monde.", 
    thumbnailUrl: "https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg", 
    videoUrl: "/video/mindset-exception" 
  },
  { 
    id: "v-02", 
    titre: "L'art de la résilience entrepreneuriale", 
    description: "Comment transformer les obstacles en opportunités et rebondir face aux défis.", 
    thumbnailUrl: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg", 
    videoUrl: "/video/resilience-entrepreneuriale" 
  },
  { 
    id: "v-03", 
    titre: "Les clés d'une communication...", 
    description: "Maîtrisez l'art de la communication pour amplifier votre message et votre influence.", 
    thumbnailUrl: "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg", 
    videoUrl: "/video/cles-communication" 
  },
  { 
    id: "v-04", 
    titre: "Développer sa créativité au quotidien", 
    description: "Techniques et habitudes pour stimuler votre créativité et innover constamment.", 
    thumbnailUrl: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg", 
    videoUrl: "/video/developper-creativite" 
  },
  { 
    id: "v-05", 
    titre: "Gérer son énergie, pas son temps", 
    description: "La méthode contre-intuitive pour être plus productif et éviter le burn-out.", 
    thumbnailUrl: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg", 
    videoUrl: "/video/gerer-energie" 
  },
  { 
    id: "v-06", 
    titre: "Le pouvoir de l'écoute active", 
    description: "Pourquoi bien écouter est la compétence la plus sous-estimée en leadership.", 
    thumbnailUrl: "https://images.pexels.com/photos/7648348/pexels-photo-7648348.jpeg", 
    videoUrl: "/video/ecoute-active" 
  },
  { 
    id: "v-07", 
    titre: "Prendre de meilleures décisions", 
    description: "Un modèle mental simple pour clarifier vos choix les plus complexes.", 
    thumbnailUrl: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg", 
    videoUrl: "/video/meilleures-decisions" 
  },
  { 
    id: "v-08", 
    titre: "La science de la première impression", 
    description: "Ce que les 7 premières secondes disent de vous et comment les maîtriser.", 
    thumbnailUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", 
    videoUrl: "/video/premiere-impression" 
  },
  { 
    id: "v-09", 
    titre: "Négocier comme un pro", 
    description: "Les principes fondamentaux pour aborder n'importe quelle négociation avec confiance.", 
    thumbnailUrl: "https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg", 
    videoUrl: "/video/negocier-pro" 
  },
  { 
    id: "v-10", 
    titre: "Le storytelling pour les marques", 
    description: "Comment raconter l'histoire de votre entreprise pour captiver votre audience.", 
    thumbnailUrl: "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg", 
    videoUrl: "/video/storytelling-marques" 
  }
];

// Données pour la section "LES ESSENTIELS" avec 10 verticales et couleurs dominantes
const verticalesData = [
  {
    verticale: { id: "cat-03", nom: "CARRIÈRE", couleurDominante: "#4A5568" }, // Gris bleuté sobre
    productions: [
      { id: "p-01", titre: "Gérer son énergie, pas son temps", imageUrl: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg", url: "/recit/gerer-energie" },
      { id: "p-02", titre: "Négocier comme un pro", imageUrl: "https://images.pexels.com/photos/3760072/pexels-photo-3760072.jpeg", url: "/recit/negocier-pro" },
      { id: "p-03", titre: "L'art de la résilience entrepreneuriale", imageUrl: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg", url: "/recit/resilience-entrepreneuriale" }
    ]
  },
  {
    verticale: { id: "cat-01", nom: "PSYCHOLOGIE", couleurDominante: "#4299E1" }, // Bleu apaisant
    productions: [
      { id: "p-04", titre: "Le guide pour apprivoiser son anxiété", imageUrl: "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg", url: "/recit/guide-anxiete" },
      { id: "p-05", titre: "La science de la première impression", imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", url: "/recit/premiere-impression" },
      { id: "p-06", titre: "Le pouvoir de l'écoute active", imageUrl: "https://images.pexels.com/photos/7648348/pexels-photo-7648348.jpeg", url: "/recit/ecoute-active" }
    ]
  },
  {
    verticale: { id: "cat-05", nom: "ART & CRÉATIVITÉ", couleurDominante: "#9F7AEA" }, // Violet créatif
    productions: [
      { id: "p-07", titre: "Vaincre le syndrome de la page blanche", imageUrl: "https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg", url: "/recit/syndrome-page-blanche" },
      { id: "p-08", titre: "L'art numérique, nouvelle forme d'expression", imageUrl: "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg", url: "/recit/art-numerique" },
      { id: "p-09", titre: "Créativité et intelligence artificielle", imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg", url: "/recit/creativite-ia" }
    ]
  },
  {
    verticale: { id: "cat-04", nom: "VOYAGE", couleurDominante: "#48BB78" }, // Vert exploration
    productions: [
      { id: "p-10", titre: "Voyager seul : guide de l'aventure intérieure", imageUrl: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg", url: "/recit/voyage-solitaire" },
      { id: "p-11", titre: "Nomadisme numérique : liberté ou illusion ?", imageUrl: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg", url: "/recit/nomadisme-numerique" },
      { id: "p-12", titre: "Les leçons du voyage lent", imageUrl: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg", url: "/recit/voyage-lent" }
    ]
  },
  {
    verticale: { id: "cat-02", nom: "SOCIÉTÉ", couleurDominante: "#ED8936" }, // Orange sociétal
    productions: [
      { id: "p-13", titre: "Comment la technologie reconnecte les générations", imageUrl: "https://images.pexels.com/photos/5083490/pexels-photo-5083490.jpeg", url: "/recit/technologie-generations" },
      { id: "p-14", titre: "L'impact des réseaux sociaux sur notre bien-être", imageUrl: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg", url: "/recit/reseaux-sociaux-bien-etre" },
      { id: "p-15", titre: "Repenser l'urbanisme pour le bien-être collectif", imageUrl: "https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg", url: "/recit/urbanisme-bien-etre" }
    ]
  },
  {
    verticale: { id: "cat-06", nom: "SPIRITUALITÉ", couleurDominante: "#805AD5" }, // Violet spirituel
    productions: [
      { id: "p-16", titre: "Trouver le silence dans un monde bruyant", imageUrl: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg", url: "/recit/trouver-silence" },
      { id: "p-17", titre: "Méditation et neurosciences : ce que dit la science", imageUrl: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg", url: "/recit/meditation-neurosciences" },
      { id: "p-18", titre: "Rituels modernes pour une vie consciente", imageUrl: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg", url: "/recit/rituels-modernes" }
    ]
  },
  {
    verticale: { id: "cat-07", nom: "SANTÉ", couleurDominante: "#38B2AC" }, // Turquoise santé
    productions: [
      { id: "p-19", titre: "L'alimentation intuitive : écouter son corps", imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg", url: "/recit/alimentation-intuitive" },
      { id: "p-20", titre: "Sport et santé mentale : le duo gagnant", imageUrl: "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg", url: "/recit/sport-sante-mentale" },
      { id: "p-21", titre: "Sommeil : retrouver un rythme naturel", imageUrl: "https://images.pexels.com/photos/935777/pexels-photo-935777.jpeg", url: "/recit/sommeil-naturel" }
    ]
  },
  {
    verticale: { id: "cat-08", nom: "TECHNOLOGIE", couleurDominante: "#3182CE" }, // Bleu tech
    productions: [
      { id: "p-22", titre: "Intelligence artificielle et créativité humaine", imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg", url: "/recit/ia-creativite" },
      { id: "p-23", titre: "Déconnexion digitale : retrouver l'équilibre", imageUrl: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg", url: "/recit/deconnexion-digitale" },
      { id: "p-24", titre: "Le futur du travail à l'ère numérique", imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg", url: "/recit/futur-travail" }
    ]
  },
  {
    verticale: { id: "cat-09", nom: "RELATIONS", couleurDominante: "#E53E3E" }, // Rouge passion
    productions: [
      { id: "p-25", titre: "Communication non-violente : transformer les conflits", imageUrl: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg", url: "/recit/communication-non-violente" },
      { id: "p-26", titre: "L'amitié à l'âge adulte : cultiver les liens", imageUrl: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg", url: "/recit/amitie-adulte" },
      { id: "p-27", titre: "Couple et épanouissement personnel", imageUrl: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg", url: "/recit/couple-epanouissement" }
    ]
  },
  {
    verticale: { id: "cat-10", nom: "ENVIRONNEMENT", couleurDominante: "#38A169" }, // Vert nature
    productions: [
      { id: "p-28", titre: "Minimalisme : moins pour vivre mieux", imageUrl: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", url: "/recit/minimalisme" },
      { id: "p-29", titre: "Permaculture urbaine : cultiver en ville", imageUrl: "https://images.pexels.com/photos/2519392/pexels-photo-2519392.jpeg", url: "/recit/permaculture-urbaine" },
      { id: "p-30", titre: "Consommation consciente : choisir avec intention", imageUrl: "https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg", url: "/recit/consommation-consciente" }
    ]
  }
];

const universData = [
  // ✨ NOUVELLE CARTE - NOS SÉRIES EXCLUSIVES (en première position)
  {
    id: "cat-series",
    nom: "NOS SÉRIES",
    description: "Découvrez nos collections de récits et de documentaires exclusifs.",
    imageUrl: "https://images.pexels.com/photos/7130470/pexels-photo-7130470.jpeg",
    url: "/series",
    isSpecial: true // Flag pour identifier cette carte spéciale
  },
  {
    id: "cat-01",
    nom: "PSYCHOLOGIE",
    description: "Pour mieux se comprendre et grandir.",
    imageUrl: "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg",
    url: "/univers/psychologie"
  },
  {
    id: "cat-02",
    nom: "SOCIÉTÉ",
    description: "Explorer les changements et les tabous.",
    imageUrl: "https://images.pexels.com/photos/7848733/pexels-photo-7848733.jpeg",
    url: "/univers/societe"
  },
  {
    id: "cat-03",
    nom: "CARRIÈRE",
    description: "Parcours, reconversions et équilibre de vie.",
    imageUrl: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg",
    url: "/univers/carriere"
  },
  {
    id: "cat-04",
    nom: "VOYAGE",
    description: "Des quêtes identitaires et expériences transformatrices.",
    imageUrl: "https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg",
    url: "/univers/voyage"
  },
  {
    id: "cat-05",
    nom: "ART & CRÉATIVITÉ",
    description: "L'art comme levier de résilience et de changement.",
    imageUrl: "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg",
    url: "/univers/art-creativite"
  },
  {
    id: "cat-06",
    nom: "SPIRITUALITÉ",
    description: "Nourrir la recherche de sens et la connexion.",
    imageUrl: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
    url: "/univers/spiritualite"
  }
];

function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <CarouselSection portraits={portraitsData} />

        {/* Section 1.1: Acte 1 - FRAGMENTS */}
        <FragmentsSection videos={videosData} />

        {/* Section 1.2: Acte 2 - LES ESSENTIELS */}
        <BibliothequeSection verticales={verticalesData} />

        {/* Section 1.3: Acte 3 - Explorer nos Univers */}
        <UniversSection univers={universData} />

        {/* Section 1.4: Kit d'Inspiration - MAINTENANT SANS "Acte 4" */}
        <EngagementSection />
      </main>

      {/* Footer Premium */}
      <Footer />
    </div>
  );
}

export default HomePage;