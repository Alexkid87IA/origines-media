import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import Ticker from "@/components/Ticker/Ticker";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Welcome from "@/components/Welcome/Welcome";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import MediaHero from "@/components/MediaHero/MediaHero";
import PromoBand from "@/components/home/shared/PromoBand";
import {
  LiveStrip,
  ThreadSection,
  SocialCarousel,
  SelectionSection,
  EntranceSection,
  VideoSection,
  GuideSection,
  BrandBridge,
} from "@/components/home";
import { sanityFetch } from "@/lib/sanity";
import type { HomeData } from "@/lib/homeUtils";
import { HOME_DATA_QUERY, heroSlideOf } from "@/lib/homeUtils";
import { FORMAT_DOORS } from "@/data/formatDoors";
import { STATIC_CAROUSELS } from "@/data/carousels";
import s from "./HomePageV2.module.css";

export default function HomePageV2() {
  const [data, setData] = useState<HomeData>({ feed: [], guides: [], videos: [], carousels: [] });

  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  useEffect(() => {
    sanityFetch<HomeData>(HOME_DATA_QUERY).then((result) => {
      setData({
        feed: result?.feed || [],
        guides: result?.guides || [],
        videos: result?.videos || [],
        carousels: result?.carousels || [],
      });
    });
  }, []);

  const articles = data.feed.filter((item) => item.typeArticle !== "video" && !item.videoUrl);
  const heroSlides = articles.slice(0, 5).map(heroSlideOf);
  const thread = articles.slice(5, 13);
  const selection = articles.slice(13, 17);
  const featuredVideo = data.videos[0];
  const videoThumbs = data.videos.slice(1, 6);

  const sanityCarousels = (data.carousels || []).map((c) => ({
    id: c._id,
    image: c.imageUrl || "/placeholder.svg",
    type: "Carousel",
    title: c.titre,
    meta: `${c.slideCount} slides`,
    href: `/article/${c.slug}`,
    likes: "",
    comments: "",
  }));
  const staticCarousels = STATIC_CAROUSELS.map((c) => ({
    id: `static-${c.slug}`,
    image: c.cover,
    type: "Carousel",
    title: c.title,
    meta: `${c.slideCount} slides`,
    href: `/carousel/${c.slug}`,
    likes: "",
    comments: "",
  }));
  const allCarousels = [...staticCarousels, ...sanityCarousels];

  return (
    <>
      <SEO
        absoluteTitle="Origines Media — Articles, récits, vidéos et guides"
        title="Origines Media"
        description="Le média pour comprendre ce qui nous construit : articles, récits, vidéos, guides, témoignages et sélections de la rédaction."
        url="/"
        jsonLd="home"
      />
      <Ticker />
      <SiteHeader />
      <main id="main" role="main" className={s.page}>
        <div className="v2-container">
          <Welcome compact />
          <MediaHero cmsSlides={heroSlides.length ? heroSlides : undefined} joinedMasthead />

          <LiveStrip articles={articles} />

          <PromoBand
            kicker="Vos récits"
            title="Une histoire peut devenir un point de départ."
            body="Racontez une expérience, un basculement, une question. La rédaction lit chaque proposition et cherche les récits qui éclairent les autres."
            cta="Raconter votre histoire"
            to="/ecrire-mon-histoire"
            tone="story"
            aside="Témoignages"
            index="01"
            points={["Récit personnel", "Lecture rédaction", "Publication possible"]}
          />

          <ThreadSection items={thread} />
          <SocialCarousel posts={allCarousels} />
          <SelectionSection items={selection} />
          <EntranceSection doors={FORMAT_DOORS} />

          <PromoBand
            kicker="Boutique"
            title="Des guides pour passer de l'idée au geste."
            body="Workbooks, kits et carnets pour prolonger la lecture avec des exercices concrets, des repères et des chemins simples à suivre."
            cta="Voir la boutique"
            to="/boutique"
            tone="shop"
            aside="Guides & carnets"
            index="02"
            points={["Guides pratiques", "Workbooks", "Kits gratuits"]}
          />

          <section className={s.mediaRows} aria-label="Vidéos et guides">
            {!!featuredVideo && <VideoSection featured={featuredVideo} thumbs={videoThumbs} />}
            {!!data.guides.length && <GuideSection guides={data.guides} />}
          </section>

          <BrandBridge />
        </div>
      </main>
      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
