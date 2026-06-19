import { useEffect } from "react";
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

export default function MarquePage() {
  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  const { mainArticle, cmsQuestion, cmsHeroVideo, cmsGuide, cmsProduit } = useHeroData();

  return (
    <>
      <SEO
        absoluteTitle="La marque Origines Media — Mission, univers et manifeste"
        title="La marque Origines Media"
        description="Découvrez l'identité d'Origines Media : notre mission, nos cinq univers, notre ligne éditoriale et notre manière d'explorer ce qui nous construit."
        url="/marque"
        jsonLd="home"
      />
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
            cmsGuide={cmsGuide}
            cmsProduit={cmsProduit}
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
