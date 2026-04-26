import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import s from "./LegalPage.module.css";

export default function CookiesPage() {
  return (
    <div className={s.page}>
      <SEO
        title="Politique de cookies"
        description="Comment Origines Media utilise les cookies et comment gérer vos préférences."
        url="/cookies"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Cookies", url: "/cookies" },
        ]}
      />
      <SiteHeader />

      <main>
        <header className={s.header}>
          <div className={s.headerInner}>
            <span className={s.headerKicker}>Cookies &amp; traceurs</span>
            <span className={s.headerBar} />
            <h1 className={s.headerTitle}>Politique de cookies</h1>
            <span className={s.headerSub}>Derni&egrave;re mise &agrave; jour : 26 avril 2026</span>
          </div>
        </header>

        <div className={s.content}>
          <div className={s.section}>
            <h2 className={s.sectionTitle}>1. Qu&rsquo;est-ce qu&rsquo;un cookie ?</h2>
            <p className={s.text}>
              Un cookie est un petit fichier texte d&eacute;pos&eacute; sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d&rsquo;un site web. Il permet au site de m&eacute;moriser des informations sur votre visite, comme vos pr&eacute;f&eacute;rences de langue ou vos identifiants de connexion.
            </p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>2. Cookies utilis&eacute;s</h2>

            <h3 className={s.sectionSubtitle}>2.1 Cookies strictement n&eacute;cessaires</h3>
            <p className={s.text}>
              Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas &ecirc;tre d&eacute;sactiv&eacute;s.
            </p>
            <ul className={s.list}>
              <li><strong>Authentification</strong> : maintien de votre session connect&eacute;e (Firebase Auth)</li>
              <li><strong>Consentement cookies</strong> : m&eacute;morisation de votre choix d&rsquo;acceptation ou de refus</li>
              <li><strong>S&eacute;curit&eacute;</strong> : protection contre les attaques CSRF</li>
            </ul>

            <h3 className={s.sectionSubtitle}>2.2 Cookies de mesure d&rsquo;audience</h3>
            <p className={s.text}>
              Ces cookies nous permettent de comprendre comment les visiteurs utilisent le site, afin d&rsquo;am&eacute;liorer nos contenus et notre exp&eacute;rience utilisateur.
            </p>
            <ul className={s.list}>
              <li><strong>Google Analytics</strong> : statistiques de fr&eacute;quentation (pages vues, dur&eacute;e de session, provenance). Donn&eacute;es anonymis&eacute;es.</li>
            </ul>

            <h3 className={s.sectionSubtitle}>2.3 Cookies de fonctionnalit&eacute;</h3>
            <p className={s.text}>
              Ces cookies permettent d&rsquo;am&eacute;liorer votre exp&eacute;rience en retenant vos pr&eacute;f&eacute;rences.
            </p>
            <ul className={s.list}>
              <li><strong>Pr&eacute;f&eacute;rences de lecture</strong> : taille de police, mode sombre (si disponible)</li>
              <li><strong>Articles sauvegard&eacute;s</strong> : m&eacute;morisation de votre liste de lecture</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>3. Dur&eacute;e de conservation</h2>
            <p className={s.text}>
              Conform&eacute;ment aux recommandations de la CNIL, les cookies ont une dur&eacute;e de vie maximale de <strong>13 mois</strong>. Au-del&agrave;, votre consentement sera &agrave; nouveau demand&eacute;.
            </p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>4. G&eacute;rer vos pr&eacute;f&eacute;rences</h2>
            <p className={s.text}>
              Vous pouvez &agrave; tout moment modifier vos pr&eacute;f&eacute;rences en mati&egrave;re de cookies :
            </p>
            <ul className={s.list}>
              <li>Via le bandeau de consentement qui s&rsquo;affiche lors de votre premi&egrave;re visite</li>
              <li>Via les param&egrave;tres de votre navigateur</li>
            </ul>
            <p className={s.text}>
              <strong>Attention :</strong> la d&eacute;sactivation de certains cookies peut alt&eacute;rer votre exp&eacute;rience de navigation et emp&ecirc;cher l&rsquo;acc&egrave;s &agrave; certaines fonctionnalit&eacute;s du site.
            </p>

            <h3 className={s.sectionSubtitle}>Param&eacute;trer votre navigateur</h3>
            <ul className={s.list}>
              <li><strong>Chrome</strong> : Param&egrave;tres &gt; Confidentialit&eacute; et s&eacute;curit&eacute; &gt; Cookies</li>
              <li><strong>Firefox</strong> : Param&egrave;tres &gt; Vie priv&eacute;e et s&eacute;curit&eacute; &gt; Cookies</li>
              <li><strong>Safari</strong> : Pr&eacute;f&eacute;rences &gt; Confidentialit&eacute; &gt; Cookies</li>
              <li><strong>Edge</strong> : Param&egrave;tres &gt; Cookies et autorisations de site</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>5. Cookies tiers</h2>
            <p className={s.text}>
              Certains contenus int&eacute;gr&eacute;s (vid&eacute;os YouTube, lecteurs audio) peuvent d&eacute;poser leurs propres cookies. Nous n&rsquo;avons pas de contr&ocirc;le sur ces cookies tiers. Nous vous invitons &agrave; consulter les politiques de confidentialit&eacute; des services concern&eacute;s.
            </p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>6. Contact</h2>
            <p className={s.text}>
              Pour toute question relative aux cookies, contactez-nous &agrave; <strong>admin@origines.media</strong>.
            </p>
          </div>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
