import type { SponsorConfig } from "@/components/SponsorSkin/SponsorSkin";

export interface SponsorAdConfig {
  sidebar: string;
  mobile: string;
}

export const SPONSORS: Record<string, SponsorConfig> = {
  parentalite: {
    name: "Petit Héros",
    url: "https://www.lepetitheros.com/",
    cta: "Découvrir",
    bgColor: "#4B1B7F",
    bgImageLeft: "/sponsors/petit-heros-left.jpg",
    bgImageRight: "/sponsors/petit-heros-right.jpg",
    bannerBg: "#3D1573",
  },
};

export const SPONSOR_ADS: Record<string, SponsorAdConfig> = {
  parentalite: {
    sidebar: "/sponsors/petit-heros-sidebar.jpg",
    mobile: "/sponsors/petit-heros-mobile.jpg",
  },
};

export const DEFAULT_SIDEBAR_AD = {
  name: "Petit Héros",
  url: "https://www.lepetitheros.com/",
  image: "/sponsors/petit-heros-sidebar.jpg",
};
