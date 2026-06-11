import { useEffect } from "react";
import SEO from "@/components/SEO";
import IntroOverlay from "@/components/IntroOverlay/IntroOverlay";
import Ticker from "@/components/Ticker/Ticker";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Welcome from "@/components/Welcome/Welcome";
import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";
import LatestArticles from "@/components/LatestArticles/LatestArticles";
import LatestVideos from "@/components/LatestVideos/LatestVideos";
import LatestGuides from "@/components/LatestGuides/LatestGuides";
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

  return (
    <>
      <SEO
        absoluteTitle="Origines Media — Psychologie, bien-être, relations, culture"
        title="Origines Media"
        description="Origines Media explore ce qui nous construit : psychologie, bien-être, relations, culture et avenir. Articles, vidéos, histoires et recommandations."
        url="/"
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
          />
          <LatestArticles />
          <LatestVideos />
          <LatestGuides />
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
