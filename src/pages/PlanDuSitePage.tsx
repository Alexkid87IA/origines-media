import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import s from "./LegalPage.module.css";

const SITE_SECTIONS = [
  {
    title: "Contenu éditorial",
    links: [
      { href: "/", label: "Accueil" },
      { href: "/articles", label: "Tous les articles" },
      { href: "/temoignages", label: "Témoignages & Portraits" },
      { href: "/recommandations", label: "Recommandations" },
      { href: "/dossiers", label: "Dossiers" },
      { href: "/series", label: "Séries" },
      { href: "/videos", label: "Vidéos" },
    ],
  },
  {
    title: "Univers",
    links: [
      { href: "/univers/esprit", label: "Esprit" },
      { href: "/univers/corps", label: "Corps" },
      { href: "/univers/liens", label: "Liens" },
      { href: "/univers/monde", label: "Monde" },
      { href: "/univers/avenir", label: "Avenir" },
    ],
  },
  {
    title: "Guides & Formations",
    links: [
      { href: "/guides", label: "Tous les guides" },
      { href: "/guides/masterclass", label: "Masterclass" },
      { href: "/guides/ateliers", label: "Ateliers" },
      { href: "/guides/programmes", label: "Programmes" },
      { href: "/guides/kits-gratuits", label: "Kits gratuits" },
    ],
  },
  {
    title: "Boutique",
    links: [
      { href: "/boutique", label: "Boutique" },
    ],
  },
  {
    title: "Communauté",
    links: [
      { href: "/ensemble", label: "Ensemble — Vie du média" },
      { href: "/newsletter", label: "La Lettre du dimanche" },
      { href: "/racontez-votre-histoire", label: "Racontez votre histoire" },
      { href: "/ecrire-mon-histoire", label: "Écrire mon histoire (membres)" },
    ],
  },
  {
    title: "À propos",
    links: [
      { href: "/a-propos", label: "À propos d’Origines" },
      { href: "/contact", label: "Contact" },
      { href: "/partenariats", label: "Partenariats" },
      { href: "/rejoindre", label: "Rejoindre l’équipe" },
    ],
  },
  {
    title: "Compte",
    links: [
      { href: "/inscription", label: "Inscription" },
      { href: "/connexion", label: "Connexion" },
      { href: "/compte", label: "Mon compte" },
      { href: "/compte/profil", label: "Mon profil" },
      { href: "/compte/liste", label: "Ma liste de lecture" },
      { href: "/compte/journaux", label: "Mes journaux" },
    ],
  },
  {
    title: "Informations légales",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgu", label: "Conditions générales d’utilisation" },
      { href: "/cgv", label: "Conditions générales de vente" },
      { href: "/confidentialite", label: "Politique de confidentialité" },
      { href: "/cookies", label: "Politique de cookies" },
    ],
  },
];

export default function PlanDuSitePage() {
  return (
    <div className={s.page}>
      <SEO
        title="Plan du site"
        description="Retrouvez l'ensemble des pages et rubriques d'Origines Media."
        url="/plan-du-site"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Plan du site", url: "/plan-du-site" },
        ]}
      />
      <SiteHeader />

      <main>
        <header className={s.header}>
          <div className={s.headerInner}>
            <span className={s.headerKicker}>Navigation</span>
            <span className={s.headerBar} />
            <h1 className={s.headerTitle}>Plan du site</h1>
            <span className={s.headerSub}>www.origines.media</span>
          </div>
        </header>

        <div className={s.content}>
          {SITE_SECTIONS.map((section) => (
            <div key={section.title} className={s.section}>
              <h2 className={s.sectionTitle}>{section.title}</h2>
              <ul className={s.list}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} style={{ color: "inherit", textDecoration: "none" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
