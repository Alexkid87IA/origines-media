import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import IntroOverlay from "@/components/IntroOverlay/IntroOverlay";
import Ticker from "@/components/Ticker/Ticker";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";
import Edito from "@/components/Edito/Edito";
import Pillars from "@/components/Pillars/Pillars";
import Marquee from "@/components/Marquee/Marquee";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import { useHeroData } from "@/hooks/useHeroData";

export default function HomePageV2() {
  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  const { mainArticle, cmsQuestion, cmsHeroVideo } = useHeroData();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Origines Media",
    url: "https://www.origines.media",
    description: "Origines Media explore ce qui nous construit : psychologie, bien-être, relations, culture et avenir.",
    publisher: {
      "@type": "Organization",
      name: "Origines Media",
      logo: { "@type": "ImageObject", url: "https://www.origines.media/logos/logo-black.png" },
      sameAs: [
        "https://www.youtube.com/@origines",
        "https://www.instagram.com/origines.media",
        "https://www.linkedin.com/company/origines-media",
      ],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: "https://www.origines.media/recherche?q={search_term_string}" },
      "query-input": "required name=search_term_string",
    },
  };

  const navSchema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SiteNavigationElement", name: "Média", url: "https://www.origines.media/media", description: "Articles, récits, immersions et témoignages" },
      { "@type": "SiteNavigationElement", name: "Prod", url: "https://www.origines.media/prod", description: "Documentaires, reportages, interviews et formats vidéo" },
      { "@type": "SiteNavigationElement", name: "Guides", url: "https://www.origines.media/guides", description: "Masterclass, ateliers, programmes et kits" },
      { "@type": "SiteNavigationElement", name: "Boutique", url: "https://www.origines.media/boutique", description: "Guides, kits et produits Origines" },
      { "@type": "SiteNavigationElement", name: "Newsletter", url: "https://www.origines.media/newsletter", description: "La Lettre du dimanche — le meilleur de la semaine" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Origines Media — Psychologie, bien-être, relations, culture, avenir</title>
        <meta name="description" content="Origines Media explore ce qui nous construit : psychologie, bien-être, relations, culture et avenir. Articles, vidéos, histoires et recommandations pour ceux qui cherchent la profondeur." />
        <link rel="canonical" href="https://www.origines.media" />
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(navSchema)}</script>
      </Helmet>
      <IntroOverlay />
      <a href="#main" className="skip-to-content">
        Aller au contenu
      </a>
      <Ticker />
      <SiteHeader />
      <main id="main" role="main">
        <div className="v2-container">
          <HeroCarousel
            cmsMain={mainArticle}
            cmsQuestion={cmsQuestion}
            cmsVideo={cmsHeroVideo}
          />
          <Edito />
          <Pillars />
          <Marquee />
        </div>
      </main>
      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
