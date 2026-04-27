import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import Breadcrumb from '@/components/ui/Breadcrumb';
import s from "./LegalPage.module.css";

export default function ConfidentialitePage() {
  return (
    <div className={s.page}>
      <SEO
        title="Politique de confidentialité"
        description="Comment Origines Media collecte, utilise et protège vos données personnelles."
        url="/confidentialite"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Confidentialité", url: "/confidentialite" },
        ]}
      />
      <SiteHeader />

      <main>
        <div className="v2-container">
          <Breadcrumb items={[
            { name: "Accueil", url: "/" },
            { name: "Confidentialité", url: "/confidentialite" },
          ]} />
        </div>
        <header className={s.header}>
          <div className={s.headerInner}>
            <span className={s.headerKicker}>Protection des donn&eacute;es</span>
            <span className={s.headerBar} />
            <h1 className={s.headerTitle}>Politique de confidentialit&eacute;</h1>
            <span className={s.headerSub}>Derni&egrave;re mise &agrave; jour : 26 avril 2026</span>
          </div>
        </header>

        <div className={s.content}>
          <div className={s.section}>
            <h2 className={s.sectionTitle}>1. Responsable du traitement</h2>
            <p className={s.text}>
              Le responsable du traitement des donn&eacute;es personnelles collect&eacute;es sur le site www.origines.media est :
            </p>
            <div className={s.infoBox}>
              <p><strong>ADN Production SAS</strong></p>
              <p>40 Avenue de Saint-Antoine, 13015 Marseille, France</p>
              <p>Email : admin@origines.media</p>
              <p>T&eacute;l&eacute;phone : 07 85 09 12 70</p>
            </div>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>2. Donn&eacute;es collect&eacute;es</h2>
            <p className={s.text}>
              Nous collectons les donn&eacute;es personnelles suivantes, dans le cadre de l&rsquo;utilisation de notre site et de nos services :
            </p>
            <h3 className={s.sectionSubtitle}>2.1 Donn&eacute;es fournies directement</h3>
            <ul className={s.list}>
              <li>Nom, pr&eacute;nom, adresse e-mail (inscription, newsletter, formulaires de contact)</li>
              <li>Contenu des messages envoy&eacute;s via les formulaires</li>
              <li>T&eacute;moignages et r&eacute;cits soumis volontairement</li>
              <li>Informations de paiement (trait&eacute;es par notre prestataire Stripe, jamais stock&eacute;es sur nos serveurs)</li>
            </ul>
            <h3 className={s.sectionSubtitle}>2.2 Donn&eacute;es collect&eacute;es automatiquement</h3>
            <ul className={s.list}>
              <li>Adresse IP, type de navigateur, syst&egrave;me d&rsquo;exploitation</li>
              <li>Pages visit&eacute;es, dur&eacute;e de visite, parcours de navigation</li>
              <li>Donn&eacute;es de cookies (voir notre politique cookies)</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>3. Finalit&eacute;s du traitement</h2>
            <p className={s.text}>Vos donn&eacute;es sont trait&eacute;es pour les finalit&eacute;s suivantes :</p>
            <ul className={s.list}>
              <li>Gestion des comptes utilisateurs et acc&egrave;s aux contenus</li>
              <li>Envoi de la newsletter &laquo;&nbsp;La Lettre du dimanche&nbsp;&raquo; (avec votre consentement)</li>
              <li>Traitement des commandes (guides, masterclass, programmes)</li>
              <li>Am&eacute;lioration de nos services et analyse de la fr&eacute;quentation</li>
              <li>R&eacute;ponse &agrave; vos demandes de contact</li>
              <li>Respect de nos obligations l&eacute;gales</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>4. Base l&eacute;gale</h2>
            <p className={s.text}>Les traitements sont fond&eacute;s sur :</p>
            <ul className={s.list}>
              <li><strong>Le consentement</strong> : newsletter, cookies non essentiels, soumission de t&eacute;moignages</li>
              <li><strong>L&rsquo;ex&eacute;cution d&rsquo;un contrat</strong> : achat de contenus, gestion de compte</li>
              <li><strong>L&rsquo;int&eacute;r&ecirc;t l&eacute;gitime</strong> : am&eacute;lioration du site, s&eacute;curit&eacute;, statistiques anonymis&eacute;es</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>5. Dur&eacute;e de conservation</h2>
            <ul className={s.list}>
              <li><strong>Comptes utilisateurs</strong> : dur&eacute;e de vie du compte + 3 ans apr&egrave;s suppression</li>
              <li><strong>Newsletter</strong> : jusqu&rsquo;&agrave; d&eacute;sinscription</li>
              <li><strong>Donn&eacute;es de paiement</strong> : dur&eacute;e l&eacute;gale de conservation (10 ans)</li>
              <li><strong>Cookies</strong> : 13 mois maximum</li>
              <li><strong>Logs de connexion</strong> : 12 mois</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>6. Vos droits</h2>
            <p className={s.text}>
              Conform&eacute;ment au RGPD, vous disposez des droits suivants :
            </p>
            <ul className={s.list}>
              <li><strong>Droit d&rsquo;acc&egrave;s</strong> : obtenir une copie de vos donn&eacute;es</li>
              <li><strong>Droit de rectification</strong> : corriger des donn&eacute;es inexactes</li>
              <li><strong>Droit de suppression</strong> : demander l&rsquo;effacement de vos donn&eacute;es</li>
              <li><strong>Droit &agrave; la portabilit&eacute;</strong> : recevoir vos donn&eacute;es dans un format structur&eacute;</li>
              <li><strong>Droit d&rsquo;opposition</strong> : vous opposer au traitement</li>
              <li><strong>Droit de limitation</strong> : restreindre le traitement</li>
            </ul>
            <p className={s.text}>
              Pour exercer ces droits, contactez-nous &agrave; <strong>admin@origines.media</strong>. Nous r&eacute;pondons dans un d&eacute;lai de 30 jours.
            </p>
            <p className={s.text}>
              Vous pouvez &eacute;galement introduire une r&eacute;clamation aupr&egrave;s de la CNIL (www.cnil.fr).
            </p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>7. Sous-traitants et transferts</h2>
            <p className={s.text}>Vos donn&eacute;es peuvent &ecirc;tre transmises aux sous-traitants suivants :</p>
            <ul className={s.list}>
              <li><strong>Firebase / Google Cloud</strong> (authentification, base de donn&eacute;es) &mdash; UE</li>
              <li><strong>Sanity.io</strong> (gestion de contenu) &mdash; UE / US (clauses contractuelles types)</li>
              <li><strong>Stripe</strong> (paiements) &mdash; certifi&eacute; PCI-DSS</li>
              <li><strong>OVH</strong> (h&eacute;bergement) &mdash; France</li>
            </ul>
            <p className={s.text}>
              Aucune donn&eacute;e n&rsquo;est vendue &agrave; des tiers. Les transferts hors UE sont encadr&eacute;s par des clauses contractuelles types approuv&eacute;es par la Commission europ&eacute;enne.
            </p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>8. S&eacute;curit&eacute;</h2>
            <p className={s.text}>
              Nous mettons en &oelig;uvre des mesures techniques et organisationnelles appropri&eacute;es pour prot&eacute;ger vos donn&eacute;es : chiffrement HTTPS, acc&egrave;s restreints, sauvegardes r&eacute;guli&egrave;res, audits de s&eacute;curit&eacute;.
            </p>
          </div>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
