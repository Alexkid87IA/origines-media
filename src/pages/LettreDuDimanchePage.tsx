import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import EmailCapture from "../components/EmailCapture";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { typo } from "../lib/typography";
import s from "./LettreDuDimanchePage.module.css";

const EDITIONS = [
  { num: 47, title: "Sur le besoin de ralentir", date: "20 avril 2026", excerpt: "On court après quoi, au juste ? Cette semaine, on s'arrête pour regarder ce qu'on a laissé derrière nous en accélérant." },
  { num: 46, title: "Ce que la colère essaie de nous dire", date: "13 avril 2026", excerpt: "La colère a mauvaise réputation. Pourtant, elle nous protège, nous alerte, nous remet debout. Cette semaine, on l'écoute." },
  { num: 45, title: "Pourquoi on s'attache aux lieux", date: "6 avril 2026", excerpt: "Il y a des endroits qu'on ne quitte jamais vraiment. Cette semaine, on explore ce lien invisible entre nous et les lieux qui nous ont construits." },
  { num: 44, title: "Le droit de changer d'avis", date: "30 mars 2026", excerpt: "Changer d'avis, c'est trahir ou grandir ? Cette semaine, on parle de la liberté de se contredire." },
  { num: 43, title: "Ce qu'on transmet sans le vouloir", date: "23 mars 2026", excerpt: "Les gestes, les silences, les peurs — on hérite de bien plus que d'un nom de famille." },
  { num: 42, title: "Apprendre à ne rien faire", date: "16 mars 2026", excerpt: "L'ennui est devenu un luxe. Cette semaine, on redécouvre l'art de ne rien faire — vraiment." },
  { num: 41, title: "Pourquoi on a besoin de rituels", date: "9 mars 2026", excerpt: "Le café du matin, la promenade du soir, le dimanche en famille. Ces petits rituels qui structurent nos vies sans qu'on y pense." },
  { num: 40, title: "La fatigue qu'on ne s'avoue pas", date: "2 mars 2026", excerpt: "Pas la fatigue physique. Celle qui s'installe quand on fait semblant trop longtemps." },
  { num: 39, title: "Les amitiés qu'on laisse mourir", date: "23 février 2026", excerpt: "On ne se dispute pas. On s'éloigne. Et un jour, on réalise que quelqu'un a disparu de notre vie." },
  { num: 38, title: "Ce que nos parents ne nous ont jamais dit", date: "16 février 2026", excerpt: "Il y a des mots qu'on attend toute une vie. Cette semaine, on parle de ces silences qui pèsent entre les générations." },
  { num: 37, title: "Écrire pour comprendre", date: "9 février 2026", excerpt: "On n'écrit pas parce qu'on sait. On écrit pour savoir. Cette semaine, l'écriture comme outil de clarté." },
  { num: 36, title: "Le courage de la vulnérabilité", date: "2 février 2026", excerpt: "Montrer qu'on ne va pas bien, c'est pas de la faiblesse. C'est peut-être la chose la plus courageuse qu'on puisse faire." },
];

export default function LettreDuDimanchePage() {
  return (
    <div className={s.page}>
      <SEO
        title="La Lettre du dimanche — Origines Media"
        description="Chaque dimanche matin, une lettre écrite avec soin. Des réflexions, des recommandations et une question pour bien commencer la semaine."
        url="/lettre-du-dimanche"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Ensemble", url: "/ensemble" },
          { name: "La Lettre du dimanche", url: "/lettre-du-dimanche" },
        ]}
      />
      <SiteHeader />

      <main>
        {/* ═══ HERO ═══ */}
        <section className={s.hero}>
          <div className="v2-container">
            <Breadcrumb items={[
              { name: "Accueil", url: "/" },
              { name: "Ensemble", url: "/ensemble" },
              { name: "La Lettre du dimanche", url: "/lettre-du-dimanche" },
            ]} />
            <div className={s.chapterMark}>
              <span className={s.cNum}>Chaque dimanche</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>La Lettre</span>
            </div>

            <div className={s.heroGrid}>
              <div className={s.heroText}>
                <h1 className={s.heroTitle}>
                  La Lettre du <em>dimanche.</em>
                </h1>
                <p className={s.heroDeck}>
                  Chaque dimanche matin, une lettre &eacute;crite avec soin.
                  Des r&eacute;flexions sur ce qui nous traverse, des recommandations
                  choisies, et une question pour bien commencer la semaine.
                </p>
                <p className={s.heroMeta}>
                  {EDITIONS.length} &eacute;ditions publi&eacute;es &middot; Gratuit, pour toujours
                </p>
              </div>
              <div className={s.heroSubscribe}>
                <span className={s.subscribeLabel}>Recevoir la lettre chaque dimanche</span>
                <EmailCapture />
                <span className={s.subscribeNote}>Gratuit, sans spam. D&eacute;sabonnement en 1 clic.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ DERNIÈRE ÉDITION ═══ */}
        <section className={s.latest}>
          <div className="v2-container">
            <div className={s.latestInner}>
              <span className={s.latestKicker}>Derni&egrave;re &eacute;dition</span>
              <span className={s.latestNum}>N&deg;{EDITIONS[0].num}</span>
              <h2 className={s.latestTitle}>{typo(EDITIONS[0].title)}</h2>
              <p className={s.latestExcerpt}>{typo(EDITIONS[0].excerpt)}</p>
              <div className={s.latestFoot}>
                <span className={s.latestDate}>{EDITIONS[0].date}</span>
                <Link to={`/article/lettre-${EDITIONS[0].num}`} className={s.latestCta}>
                  Lire cette &eacute;dition
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ARCHIVES ═══ */}
        <section className={s.archives}>
          <div className="v2-container">
            <header className={s.sectionHead}>
              <div className={s.sectionLabel}>
                <span className={s.sectionKicker}>
                  <span className={s.sectionKickerDot} />
                  Archives
                </span>
                <h2 className={s.sectionTitle}>Toutes les <em>&eacute;ditions.</em></h2>
              </div>
            </header>

            <div className={s.editionsList}>
              {EDITIONS.map((ed) => (
                <Link key={ed.num} to={`/article/lettre-${ed.num}`} className={s.editionCard}>
                  <div className={s.editionNum}>
                    <span className={s.editionNumText}>N&deg;{ed.num}</span>
                  </div>
                  <div className={s.editionBody}>
                    <h3 className={s.editionTitle}>{typo(ed.title)}</h3>
                    <p className={s.editionExcerpt}>{typo(ed.excerpt)}</p>
                  </div>
                  <div className={s.editionMeta}>
                    <span className={s.editionDate}>{ed.date}</span>
                    <svg className={s.editionArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SUBSCRIBE BOTTOM ═══ */}
        <section className={s.bottomCta}>
          <div className="v2-container">
            <div className={s.bottomCtaInner}>
              <span className={s.bottomCtaKicker}>Ne ratez aucune &eacute;dition</span>
              <h2 className={s.bottomCtaTitle}>
                Recevez la Lettre du dimanche <em>directement.</em>
              </h2>
              <p className={s.bottomCtaDeck}>
                Chaque dimanche matin, dans votre bo&icirc;te mail.
                Rejoignez les milliers de lecteurs qui commencent leur semaine avec nous.
              </p>
              <div className={s.bottomCtaCapture}>
                <EmailCapture />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
