import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Clapperboard,
  Compass,
  Map,
  PenLine,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { sanityFetch } from "@/lib/sanity";
import { sanityImg } from "@/lib/sanityImage";
import { V2_SPOTLIGHT_QUERY } from "@/lib/queries";
import { smartExcerpt, typo } from "@/lib/typography";
import { UNIVERS } from "@/data/univers";
import s from "./GalaxiePage.module.css";

interface GalaxyContent {
  _id: string;
  titre: string;
  slug: string;
  typeArticle?: string;
  imageUrl?: string;
  excerpt?: string;
  extrait?: string;
  description?: string;
  contenuTexte?: string;
  tempsLecture?: number;
  duree?: string;
  videoUrl?: string;
  univpilar?: string;
  authorName?: string;
}

const GALAXY_PILLARS = [
  {
    id: "media",
    name: "Média",
    eyebrow: "Lire",
    href: "/media",
    image: "/images/mosaic-origines.webp",
    color: "#8B5CF6",
    icon: BookOpen,
    stat: "Articles, dossiers, témoignages",
    description:
      "Le flux éditorial complet : grands récits, analyses, enquêtes, portraits et recommandations pour explorer ce qui nous construit.",
    links: [
      { label: "Tous les articles", href: "/articles" },
      { label: "Dossiers", href: "/dossiers" },
      { label: "Témoignages", href: "/temoignages" },
      { label: "Recommandations", href: "/recommandations" },
    ],
  },
  {
    id: "videos",
    name: "Vidéos",
    eyebrow: "Regarder",
    href: "/programmes",
    image: "/videos/vid-01.webp",
    color: "#EC4899",
    icon: Clapperboard,
    stat: "Programmes, formats courts, interviews",
    description:
      "Le studio Origines : séries, reportages, conversations longues et formats incarnés pour entrer dans les sujets par les visages.",
    links: [
      { label: "Tous les programmes", href: "/programmes" },
      { label: "Vidéos récentes", href: "/videos" },
      { label: "Interviews", href: "/videos?format=interviews" },
      { label: "Documentaires", href: "/videos?format=documentaires" },
    ],
  },
  {
    id: "guides",
    name: "Guides",
    eyebrow: "Pratiquer",
    href: "/guides",
    image: "/academy/programme-complet.webp",
    color: "#10B981",
    icon: PenLine,
    stat: "Parcours, masterclass, kits gratuits",
    description:
      "Des formats utiles pour passer du déclic à l'action : comprendre, préparer, pratiquer, ancrer.",
    links: [
      { label: "Tous les guides", href: "/guides" },
      { label: "Parcours", href: "/guides/programmes" },
      { label: "Ateliers", href: "/guides/ateliers" },
      { label: "Kits gratuits", href: "/guides/kits-gratuits" },
    ],
  },
  {
    id: "boutique",
    name: "Boutique",
    eyebrow: "Garder",
    href: "/boutique",
    image: "/boutique/pack-decouverte.webp",
    color: "#F59E0B",
    icon: ShoppingBag,
    stat: "Carnets, workbooks, audio, coffrets",
    description:
      "Les objets éditoriaux Origines : des supports concrets pour écrire, ralentir, transmettre et revenir à soi.",
    links: [
      { label: "Voir la boutique", href: "/boutique" },
      { label: "Workbooks", href: "/boutique?cat=workbooks" },
      { label: "Audio", href: "/boutique?cat=audio" },
      { label: "Carnets", href: "/boutique?cat=carnets" },
    ],
  },
];

const INTENTS = [
  {
    title: "Je veux comprendre un sujet",
    text: "Articles, dossiers et univers pour remonter aux causes, pas seulement lire une opinion.",
    href: "/articles",
    label: "Articles",
    icon: Search,
  },
  {
    title: "Je veux me repérer",
    text: "Les cinq univers pour choisir une porte d'entrée : esprit, corps, liens, monde ou avenir.",
    href: "/univers",
    label: "Univers",
    icon: Compass,
  },
  {
    title: "Je veux regarder une histoire",
    text: "Programmes vidéo, interviews et formats courts quand le visage compte autant que l'idée.",
    href: "/programmes",
    label: "Vidéos",
    icon: Clapperboard,
  },
  {
    title: "Je veux passer à l'action",
    text: "Guides, kits et outils pour transformer une lecture en pratique concrète.",
    href: "/guides",
    label: "Guides",
    icon: PenLine,
  },
];

const QUICK_PATHS = [
  { label: "Derniers articles", href: "/articles" },
  { label: "Dossiers de fond", href: "/dossiers" },
  { label: "Programmes vidéo", href: "/programmes" },
  { label: "Guides pratiques", href: "/guides" },
  { label: "Recommandations", href: "/recommandations" },
  { label: "Newsletter", href: "/newsletter" },
];

function getContentHref(item: GalaxyContent): string {
  return item.videoUrl || item.typeArticle === "video" ? `/video/${item.slug}` : `/article/${item.slug}`;
}

function getContentExcerpt(item: GalaxyContent): string {
  return item.extrait || item.description || item.excerpt || smartExcerpt(item.contenuTexte || "", 120);
}

export default function GalaxiePage() {
  const [latest, setLatest] = useState<GalaxyContent[]>([]);

  useEffect(() => {
    sanityFetch<GalaxyContent[]>(V2_SPOTLIGHT_QUERY)
      .then((items) => setLatest((items || []).filter((item) => item.slug).slice(0, 6)))
      .catch(() => setLatest([]));
  }, []);

  const featured = useMemo(() => latest.find((item) => item.imageUrl) || latest[0], [latest]);

  return (
    <>
      <SEO
        title="Galaxie Origines — Articles, vidéos, guides et boutique"
        description="La galaxie Origines réunit les quatre portes d'entrée du média : articles, vidéos, guides pratiques et boutique éditoriale."
        url="/galaxie"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Galaxie", url: "/galaxie" },
        ]}
        itemListData={GALAXY_PILLARS.map((pillar) => ({
          name: pillar.name,
          description: pillar.description,
          image: pillar.image,
          url: pillar.href,
        }))}
      />
      <SiteHeader />

      <main className={s.page}>
        <section className={s.hero}>
          <div className="v2-container">
            <Breadcrumb items={[{ name: "Accueil", url: "/" }, { name: "Galaxie", url: "/galaxie" }]} />
            <div className={s.heroGrid}>
              <div className={s.heroText}>
                <span className={s.kicker}>
                  <Sparkles size={14} aria-hidden="true" />
                  La carte du média
                </span>
                <h1 className={s.heroTitle}>La galaxie Origines.</h1>
                <p className={s.heroDeck}>
                  Un même projet éditorial, quatre façons d&rsquo;y entrer :
                  lire, regarder, pratiquer, garder. Cette page sert de
                  boussole pour trouver le bon format au bon moment.
                </p>
                <div className={s.heroActions}>
                  <Button as="link" to="/univers" variant="gradient" size="lg" withArrow>
                    Explorer les univers
                  </Button>
                  <Button as="link" to="/articles" variant="outline" size="lg" color="#F5F5F5">
                    Lire les articles
                  </Button>
                </div>
              </div>

              <div className={s.heroVisual} aria-label="Aperçu de la galaxie Origines">
                <div className={s.heroImageFrame}>
                  <img
                    src={featured?.imageUrl ? sanityImg(featured.imageUrl, 900) : "/images/mosaic-origines.webp"}
                    alt={featured?.titre || "Mosaïque éditoriale Origines Media"}
                    className={s.heroImage}
                    loading="eager"
                  />
                </div>
                <div className={s.orbitPanel}>
                  {GALAXY_PILLARS.map((pillar, index) => (
                    <Link
                      key={pillar.id}
                      to={pillar.href}
                      className={s.orbitRow}
                      style={{ "--accent": pillar.color, "--i": index } as React.CSSProperties}
                    >
                      <span className={s.orbitIndex}>{String(index + 1).padStart(2, "0")}</span>
                      <span className={s.orbitName}>{pillar.name}</span>
                      <span className={s.orbitVerb}>{pillar.eyebrow}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={s.pillarsSection}>
          <div className="v2-container">
            <header className={s.sectionHead}>
              <span className={s.sectionKicker}>Quatre portes</span>
              <h2 className={s.sectionTitle}>Choisir le bon format.</h2>
            </header>
            <div className={s.pillarsGrid}>
              {GALAXY_PILLARS.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <Card
                    key={pillar.id}
                    className={s.pillarCard}
                    style={{ "--accent": pillar.color, "--i": index } as React.CSSProperties}
                  >
                    <div className={s.pillarMedia}>
                      <img src={pillar.image} alt="" loading="lazy" />
                      <span className={s.pillarEyebrow}>
                        <Icon size={14} aria-hidden="true" />
                        {pillar.eyebrow}
                      </span>
                    </div>
                    <div className={s.pillarBody}>
                      <div className={s.pillarTopline}>
                        <span>{pillar.stat}</span>
                      </div>
                      <h3 className={s.pillarTitle}>{pillar.name}</h3>
                      <p className={s.pillarText}>{pillar.description}</p>
                      <div className={s.pillarLinks}>
                        {pillar.links.map((link) => (
                          <Link key={link.href} to={link.href} className={s.pillarLink}>
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      <Button as="link" to={pillar.href} variant="outline" size="md" color={pillar.color} withArrow>
                        Explorer
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className={s.intentSection}>
          <div className="v2-container">
            <header className={s.sectionHead}>
              <span className={s.sectionKicker}>Entrées rapides</span>
              <h2 className={s.sectionTitle}>Partir de votre intention.</h2>
            </header>
            <div className={s.intentGrid}>
              {INTENTS.map((intent) => {
                const Icon = intent.icon;
                return (
                  <Card key={intent.title} className={s.intentCard}>
                    <span className={s.intentIcon}>
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <h3 className={s.intentTitle}>{intent.title}</h3>
                    <p className={s.intentText}>{intent.text}</p>
                    <Button as="link" to={intent.href} variant="ghost" size="sm" withArrow>
                      {intent.label}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className={s.mapSection}>
          <div className="v2-container">
            <div className={s.mapGrid}>
              <div className={s.mapIntro}>
                <span className={s.kicker}>
                  <Map size={14} aria-hidden="true" />
                  Carte utile
                </span>
                <h2 className={s.mapTitle}>Les sujets d&rsquo;un côté, les formats de l&rsquo;autre.</h2>
                <p className={s.mapText}>
                  Les univers répondent à la question “de quoi parle-t-on ?”.
                  La galaxie répond à la question “comment voulez-vous entrer
                  dans le sujet ?”.
                </p>
              </div>
              <div className={s.mapColumns}>
                <div className={s.mapColumn}>
                  <span className={s.mapLabel}>Univers</span>
                  {UNIVERS.map((u) => (
                    <Link key={u.id} to={`/univers/${u.id}`} className={s.mapItem} style={{ "--accent": u.color } as React.CSSProperties}>
                      <span className={s.mapDot} />
                      {u.name}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
                <div className={s.mapColumn}>
                  <span className={s.mapLabel}>Chemins directs</span>
                  {QUICK_PATHS.map((path) => (
                    <Link key={path.href} to={path.href} className={s.mapItem}>
                      {path.label}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {latest.length > 0 && (
          <section className={s.latestSection}>
            <div className="v2-container">
              <header className={s.sectionHead}>
                <span className={s.sectionKicker}>À lire maintenant</span>
                <h2 className={s.sectionTitle}>Derniers contenus.</h2>
              </header>
              <div className={s.latestGrid}>
                {latest.slice(0, 4).map((item) => (
                  <Link key={item._id} to={getContentHref(item)} className={s.latestCard}>
                    {item.imageUrl && (
                      <div className={s.latestImage}>
                        <img src={sanityImg(item.imageUrl, 520)} alt={item.titre} loading="lazy" decoding="async" />
                      </div>
                    )}
                    <div className={s.latestBody}>
                      <span className={s.latestMeta}>
                        {item.videoUrl || item.typeArticle === "video" ? item.duree || "Vidéo" : `${item.tempsLecture || 5} min`}
                      </span>
                      <h3 className={s.latestTitle}>{typo(item.titre)}</h3>
                      <p className={s.latestExcerpt}>{getContentExcerpt(item)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </>
  );
}
