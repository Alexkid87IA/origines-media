// src/pages/RecommandationPage.tsx
// Page detail d'une recommandation — V2 Design System

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import { sanityFetch } from "@/lib/sanity";
import { RECOMMENDATION_BY_SLUG_QUERY, RELATED_RECOS_QUERY } from "@/lib/queries";
import { createPortableTextComponentsV2 } from "@/components/article/PortableTextComponentsV2";
import SaveButton from "@/components/SaveButton/SaveButton";
import s from "./RecommandationPage.module.css";

// ============ INLINE SVG ICONS ============

const ArrowLeftSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ArrowRightSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const ExternalLinkSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const StarSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CalendarSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="0" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const TrophySvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 9H3a1 1 0 01-1-1V4a1 1 0 011-1h3M18 9h3a1 1 0 001-1V4a1 1 0 00-1-1h-3M6 3h12v7a6 6 0 01-12 0V3zM9 21h6M12 16v5" />
  </svg>
);

const HeartSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const SparklesSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3zM5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
  </svg>
);

const ShareSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
);

const LinkSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

const CheckSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const CrownSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 20h20M4 20V8l4 4 4-8 4 8 4-4v12" />
  </svg>
);

const MailSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="4" width="20" height="16" rx="0" />
    <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
  </svg>
);

// ============ SOCIAL ICONS ============

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.942-.783 2.264-1.217 3.727-1.223h.036c1.26.005 2.378.296 3.322.864.376.226.706.493.99.796.03-.317.043-.636.036-.957-.05-2.358-.756-4.022-2.098-4.942-1.135-.778-2.704-1.18-4.663-1.194-.964.008-1.87.1-2.694.28l-.485-1.947c.985-.216 2.07-.326 3.227-.334 2.431.018 4.396.567 5.844 1.632 1.72 1.266 2.614 3.394 2.674 6.33.003.165.003.33-.001.495.404.252.773.546 1.106.88 1.01 1.016 1.674 2.37 1.885 3.878.257 1.838-.168 3.878-1.282 5.28-1.692 2.131-4.381 3.31-7.57 3.322zm-1.25-8.063c-.06 0-.12.001-.18.003-1.347.06-2.28.537-2.547 1.303-.13.372-.12.784.028 1.16.242.615.857 1.108 1.739 1.392.525.168 1.09.244 1.678.224 1.073-.057 1.896-.453 2.449-1.178.476-.625.78-1.487.902-2.565-.724-.383-1.578-.586-2.534-.59h-.036c-.51.001-1.003.083-1.5.25z"/>
  </svg>
);

// Share buttons data
const shareButtonsData = [
  { id: "twitter", icon: XIcon, label: "X" },
  { id: "facebook", icon: FacebookIcon, label: "Facebook" },
  { id: "linkedin", icon: LinkedInIcon, label: "LinkedIn" },
  { id: "whatsapp", icon: WhatsAppIcon, label: "WhatsApp" },
  { id: "telegram", icon: TelegramIcon, label: "Telegram" },
];

// ============ RECOMMENDATION TYPE ICONS (inline SVGs) ============

const BookOpenSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);

const FilmSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="20" height="20" rx="0" />
    <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
  </svg>
);

const MusicSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);

const HeadphonesSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 18v-6a9 9 0 0118 0v6" />
    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
  </svg>
);

const YoutubeSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const GlobeSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const MapPinSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PaletteSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    <circle cx="8" cy="12" r="1.5" fill="currentColor" />
    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

const ShoppingBagSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
  </svg>
);

// ============ TYPE CONFIG ============

const typeIcons: Record<string, React.FC> = {
  livre: BookOpenSvg,
  film: FilmSvg,
  musique: MusicSvg,
  podcast: HeadphonesSvg,
  youtube: YoutubeSvg,
  activite: GlobeSvg,
  destination: MapPinSvg,
  culture: PaletteSvg,
  produit: ShoppingBagSvg,
  "reseaux-sociaux": GlobeSvg,
};

const recommendationTypes: Record<string, { color: string; label: string; ctaLabel: string }> = {
  livre: { color: "#EC4899", label: "Livres", ctaLabel: "Decouvrir le livre" },
  film: { color: "#8B5CF6", label: "Films & Series", ctaLabel: "Voir la bande-annonce" },
  musique: { color: "#6366F1", label: "Musique", ctaLabel: "Ecouter" },
  podcast: { color: "#14B8A6", label: "Podcasts", ctaLabel: "Ecouter le podcast" },
  youtube: { color: "#EF4444", label: "YouTube", ctaLabel: "Voir la chaine" },
  activite: { color: "#10B981", label: "Activite", ctaLabel: "En savoir plus" },
  destination: { color: "#0EA5E9", label: "Destination", ctaLabel: "Explorer" },
  culture: { color: "#A855F7", label: "Culture", ctaLabel: "Decouvrir" },
  produit: { color: "#F59E0B", label: "Produits", ctaLabel: "Voir le produit" },
  "reseaux-sociaux": { color: "#E11D48", label: "Reseaux sociaux", ctaLabel: "Voir le compte" },
};

type RecoType = keyof typeof recommendationTypes;

// ============ INTERFACES ============

interface ListItem {
  _key: string;
  titre: string;
  description?: string;
  note?: number;
  imageUrl?: string;
  lien?: string;
  auteurItem?: string;
  annee?: string;
}

interface Recommendation {
  _id: string;
  titre: string;
  type: RecoType;
  auteur?: string;
  note?: number;
  coupDeCoeur?: boolean;
  accroche?: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  datePublication?: string;
  contenu?: any[];
  items?: ListItem[];
}

interface RelatedReco {
  _id: string;
  titre: string;
  type: RecoType;
  imageUrl?: string;
  slug: string;
  note?: number;
}

// ============ LIST ITEM COMPONENT ============

function ListItemCard({
  item,
  index,
  typeConfig,
}: {
  item: ListItem;
  index: number;
  typeConfig: { color: string; label: string; ctaLabel: string };
}) {
  return (
    <article className={s.listItem}>
      <div className={s.listItemInner}>
        <div className={s.listItemVisual}>
          <span className={s.listItemRank}>
            {String(index + 1).padStart(2, "0")}
          </span>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.titre}
              className={s.listItemImg}
            />
          ) : (
            <div className={s.listItemPlaceholder} />
          )}
        </div>

        <div className={s.listItemContent}>
          <h3 className={s.listItemTitle}>{item.titre}</h3>

          <div className={s.listItemMeta}>
            {item.auteurItem && (
              <span className={s.listItemAuteur}>{item.auteurItem}</span>
            )}
            {item.annee && (
              <span className={s.listItemAnnee}>{item.annee}</span>
            )}
            {item.note && (
              <span className={s.listItemNote}>
                <StarSvg />
                {item.note}/5
              </span>
            )}
          </div>

          {item.description && (
            <p className={s.listItemDesc}>{item.description}</p>
          )}

          {item.lien && (
            <a
              href={item.lien}
              target="_blank"
              rel="noopener noreferrer"
              className={s.listItemCta}
            >
              {typeConfig.ctaLabel}
              <ExternalLinkSvg />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ============ MAIN COMPONENT ============

export default function RecommandationPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [reco, setReco] = useState<Recommendation | null>(null);
  const [relatedRecos, setRelatedRecos] = useState<RelatedReco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Sidebar sticky
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarStyle, setSidebarStyle] = useState<React.CSSProperties>({});

  // Set body bg
  useEffect(() => {
    document.body.style.background = "var(--paper)";
    document.body.style.color = "var(--ink)";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, []);

  // Fetch recommendation
  useEffect(() => {
    const fetchReco = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = (await sanityFetch(
          RECOMMENDATION_BY_SLUG_QUERY,
          { slug }
        )) as Recommendation;

        if (!data) {
          setError("Recommandation non trouvee");
          return;
        }

        setReco(data);

        // Fetch related
        if (data.type) {
          const related = (await sanityFetch(RELATED_RECOS_QUERY, {
            type: data.type,
            slug,
          })) as RelatedReco[];
          setRelatedRecos(related || []);
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchReco();
  }, [slug]);

  // Sidebar sticky behavior
  useEffect(() => {
    const handleSidebarScroll = () => {
      if (!sidebarRef.current || !sidebarContainerRef.current) return;

      const container = sidebarContainerRef.current;
      const sidebar = sidebarRef.current;
      const containerRect = container.getBoundingClientRect();
      const sidebarHeight = sidebar.offsetHeight;
      const viewportHeight = window.innerHeight;
      const sidebarBottomIfRelative = containerRect.top + sidebarHeight;

      if (sidebarBottomIfRelative > viewportHeight) {
        setSidebarStyle({ position: "relative", top: 0 });
      } else if (containerRect.bottom > sidebarHeight) {
        const topPosition = viewportHeight - sidebarHeight;
        setSidebarStyle({
          position: "fixed",
          top: topPosition,
          width: container.offsetWidth,
        });
      } else {
        setSidebarStyle({
          position: "absolute",
          bottom: 0,
          top: "auto",
          width: "100%",
        });
      }
    };

    window.addEventListener("scroll", handleSidebarScroll, { passive: true });
    window.addEventListener("resize", handleSidebarScroll);
    setTimeout(handleSidebarScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleSidebarScroll);
      window.removeEventListener("resize", handleSidebarScroll);
    };
  }, [reco]);

  // Share handler
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = reco?.titre || "";

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      copy: url,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } else {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  // Newsletter handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setNewsletterSuccess(true);
    setNewsletterSubmitting(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.loadingWrap}>
          <div className={s.spinner} />
        </div>
        <Footer2 />
      </div>
    );
  }

  // Error state
  if (error || !reco) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <div className={s.errorWrap}>
          <div className={s.errorIcon}>
            <SparklesSvg />
          </div>
          <h1 className={s.errorTitle}>Recommandation introuvable</h1>
          <p className={s.errorMsg}>{error}</p>
          <Link to="/recommandations" className={s.errorBack}>
            <ArrowLeftSvg />
            Retour aux recommandations
          </Link>
        </div>
        <Footer2 />
      </div>
    );
  }

  const typeConfig =
    recommendationTypes[reco.type] || recommendationTypes.livre;
  const TypeIcon = typeIcons[reco.type] || BookOpenSvg;

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Portable text V2 components
  const portableTextComponents = createPortableTextComponentsV2({
    themeColor: typeConfig.color,
    article: reco,
  });

  return (
    <div className={s.page}>
      <SEO
        title={reco.titre}
        description={reco.accroche || reco.description}
        image={reco.imageUrl}
        url={`/recommandations/${reco.slug}`}
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Recommandations", url: "/recommandations" },
          { name: reco.titre, url: `/recommandations/${reco.slug}` },
        ]}
      />
      <SiteHeader />

      <main>
        {/* Back button */}
        <div className={s.backWrap}>
          <button onClick={() => navigate(-1)} className={s.backBtn}>
            <ArrowLeftSvg />
            Retour
          </button>
        </div>

        {/* Hero Header */}
        <header className={s.hero}>
          <div className={s.heroInner}>
            {reco.imageUrl && (
              <div className={s.heroBg}>
                <img
                  src={reco.imageUrl}
                  alt={`Illustration de la recommandation : ${reco.titre || ""}`}
                  className={s.heroBgImg}
                  loading="eager"
                  fetchPriority="high"
                />
                <div className={s.heroBgOverlay} />
              </div>
            )}

            <div className={s.heroContent}>
              {/* Badges */}
              <div className={s.heroBadges}>
                <span
                  className={s.heroTypeBadge}
                  style={{ backgroundColor: typeConfig.color }}
                >
                  <TypeIcon />
                  {typeConfig.label}
                </span>
                {reco.coupDeCoeur && (
                  <span className={s.heroCoupDeCoeur}>
                    <HeartSvg />
                    Coup de coeur
                  </span>
                )}
              </div>

              <h1 className={s.heroTitle}>{reco.titre}</h1>

              {reco.accroche && (
                <p className={s.heroAccroche}>{reco.accroche}</p>
              )}

              <div className={s.heroMeta}>
                {reco.auteur && (
                  <span className={s.heroAuthor}>
                    Par{" "}
                    <span className={s.heroAuthorName}>{reco.auteur}</span>
                  </span>
                )}
                {reco.datePublication && (
                  <span className={s.heroDate}>
                    <CalendarSvg />
                    {formatDate(reco.datePublication)}
                  </span>
                )}
                {reco.items && reco.items.length > 0 && (
                  <span className={s.heroTop}>
                    <TrophySvg />
                    Top {reco.items.length}
                  </span>
                )}
                <SaveButton type="recommandation" slug={slug || ""} title={reco.titre} image={reco.image?.asset?.url} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content + Sidebar */}
        <section className={s.contentSection}>
          <div className={s.contentGrid}>
            {/* Main Content */}
            <article className={s.articleBody}>
              {/* Liste / Top Items */}
              {reco.items && reco.items.length > 0 && (
                <div className={s.listSection}>
                  <div className={s.listHeader}>
                    <p className={s.listHeaderSub}>Notre s&eacute;lection</p>
                    <h2 className={s.listHeaderTitle}>
                      {reco.items.length} {typeConfig.label.toLowerCase()}{" "}
                      recommand&eacute;s
                    </h2>
                  </div>

                  <div className={s.listItems}>
                    {reco.items.map((item, index) => (
                      <ListItemCard
                        key={item._key}
                        item={item}
                        index={index}
                        typeConfig={typeConfig}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Article Content (Portable Text V2) */}
              {reco.contenu && reco.contenu.length > 0 && (
                <div className={s.contentBody}>
                  <div className={s.prose}>
                    <PortableText
                      value={reco.contenu}
                      components={portableTextComponents}
                    />
                  </div>
                </div>
              )}

              {/* Call to action section */}
              <div className={s.endCta}>
                <h3 className={s.endCtaTitle}>
                  Vous avez aim&eacute; cette s&eacute;lection ?
                </h3>
                <p className={s.endCtaDeck}>
                  D&eacute;couvrez toutes nos recommandations{" "}
                  {typeConfig.label.toLowerCase()} et bien plus encore.
                </p>
                <Link
                  to={`/recommandations?type=${reco.type}`}
                  className={s.endCtaLink}
                >
                  Voir toutes les recos {typeConfig.label.toLowerCase()}
                  <ArrowRightSvg />
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside ref={sidebarContainerRef} className={s.sidebar}>
              <div
                ref={sidebarRef}
                className={s.sidebarInner}
                style={sidebarStyle}
              >
                {/* 1. Share Widget */}
                <div className={s.widget}>
                  <div className={s.widgetHead}>
                    <h4 className={s.widgetTitle}>
                      <ShareSvg />
                      Partager
                    </h4>
                  </div>
                  <div className={s.widgetBody}>
                    <div className={s.shareGrid}>
                      {shareButtonsData.map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => handleShare(btn.id)}
                          className={s.shareBtn}
                          title={btn.label}
                          aria-label={`Partager sur ${btn.label}`}
                        >
                          <btn.icon />
                        </button>
                      ))}
                      {/* Threads */}
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.threads.net/intent/post?text=${encodeURIComponent(reco.titre)} ${encodeURIComponent(window.location.href)}`,
                            "_blank"
                          )
                        }
                        className={s.shareBtn}
                        title="Threads"
                        aria-label="Partager sur Threads"
                      >
                        <ThreadsIcon />
                      </button>
                      {/* Copy Link */}
                      <button
                        onClick={() => handleShare("copy")}
                        className={
                          copySuccess ? s.shareBtnSuccess : s.shareBtn
                        }
                        title="Copier le lien"
                        aria-label="Copier le lien"
                      >
                        {copySuccess ? <CheckSvg /> : <LinkSvg />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Related Recommendations */}
                {relatedRecos.length > 0 && (
                  <div className={s.widget}>
                    <div className={s.widgetHead}>
                      <h4 className={s.widgetTitle}>
                        <SparklesSvg />
                        Autres {typeConfig.label.toLowerCase()}
                      </h4>
                    </div>
                    <div className={s.widgetBody}>
                      {relatedRecos.map((related) => (
                        <Link
                          key={related._id}
                          to={`/recommandations/${related.slug}`}
                          className={s.relItem}
                        >
                          {related.imageUrl ? (
                            <img
                              src={related.imageUrl}
                              alt={related.titre || "Recommandation similaire"}
                              className={s.relImg}
                            />
                          ) : (
                            <div className={s.relImgPlaceholder} />
                          )}
                          <div className={s.relBody}>
                            <h5 className={s.relTitle}>{related.titre}</h5>
                            {related.note && (
                              <span className={s.relNote}>
                                <StarSvg />
                                {related.note}/5
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Newsletter CTA */}
                <div className={s.nlWidget}>
                  {!newsletterSuccess ? (
                    <>
                      <div className={s.nlIcon}>
                        <MailSvg />
                      </div>
                      <h4 className={s.nlTitle}>Restez inspires</h4>
                      <p className={s.nlKicker}>Newsletter hebdomadaire</p>
                      <p className={s.nlDeck}>
                        Recevez nos meilleures recommandations directement dans
                        votre boite mail.
                      </p>
                      <form
                        onSubmit={handleNewsletterSubmit}
                        className={s.nlForm}
                      >
                        <input
                          type="email"
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="votre@email.com"
                          required
                          className={s.nlInput}
                        />
                        <button
                          type="submit"
                          disabled={
                            !newsletterEmail.trim() || newsletterSubmitting
                          }
                          className={s.nlSubmit}
                        >
                          {newsletterSubmitting ? "Envoi..." : "S'inscrire"}
                          {!newsletterSubmitting && <ArrowRightSvg />}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className={s.nlSuccess}>
                      <div className={s.nlSuccessIcon}>
                        <CheckSvg />
                      </div>
                      <h4 className={s.nlSuccessTitle}>Merci !</h4>
                      <p className={s.nlSuccessMsg}>
                        Vous etes inscrit a notre newsletter.
                      </p>
                    </div>
                  )}
                </div>

                {/* 4. Back to all recos */}
                <Link to="/recommandations" className={s.sidebarBack}>
                  <ArrowLeftSvg />
                  Toutes les recommandations
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
