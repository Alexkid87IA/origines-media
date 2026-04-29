import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";
import IntroOverlay from "@/components/IntroOverlay/IntroOverlay";
import Ticker from "@/components/Ticker/Ticker";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Welcome from "@/components/Welcome/Welcome";
import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";
import Edito from "@/components/Edito/Edito";
import Pillars from "@/components/Pillars/Pillars";
import Marquee from "@/components/Marquee/Marquee";
import Footer2 from "@/components/Footer2";
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
        "https://twitter.com/originesmedia",
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
      { "@type": "SiteNavigationElement", name: "Articles", url: "https://www.origines.media/articles", description: "Psychologie, bien-être, relations, culture : tous les articles Origines Media" },
      { "@type": "SiteNavigationElement", name: "Vidéos", url: "https://www.origines.media/videos", description: "Documentaires, reportages, interviews et témoignages vidéo" },
      { "@type": "SiteNavigationElement", name: "Histoires", url: "https://www.origines.media/histoires", description: "Témoignages et récits de vie partagés par la communauté" },
      { "@type": "SiteNavigationElement", name: "Séries", url: "https://www.origines.media/series", description: "Transmission, État d'esprit, Il était une fois : les formats originaux Origines" },
      { "@type": "SiteNavigationElement", name: "Recommandations", url: "https://www.origines.media/recommandations", description: "Livres, films, podcasts, musique : les coups de cœur de la rédaction" },
      { "@type": "SiteNavigationElement", name: "Boutique", url: "https://www.origines.media/boutique", description: "Guides, kits d'introspection et masterclass Origines" },
    ],
  };

  return (
    <>
      <SEO
        title="Psychologie, bien-être, relations, culture"
        description="Origines Media explore ce qui nous construit : psychologie, bien-être, relations, culture et avenir. Articles, vidéos, histoires et recommandations."
        url="/"
        jsonLd="organization"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(navSchema)}</script>
      </Helmet>
      <IntroOverlay />
      <Ticker />
      <SiteHeader />
      <main id="main" role="main">
        <div className="v2-container">
          <Welcome />
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
