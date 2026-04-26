import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import s from "./LegalPage.module.css";

export default function CGUPage() {
  return (
    <div className={s.page}>
      <SEO
        title="Conditions Générales d'Utilisation"
        description="Consultez les conditions générales d'utilisation du site Origines Media. Règles d'accès, propriété intellectuelle et responsabilités."
        url="/cgu"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "CGU", url: "/cgu" },
        ]}
      />
      <SiteHeader />

      <main>
        <header className={s.header}>
          <div className={s.headerInner}>
            <span className={s.headerKicker}>Conditions Générales</span>
            <span className={s.headerBar} />
            <h1 className={s.headerTitle}>Conditions Générales d'Utilisation</h1>
            <span className={s.headerSub}>Dernière mise à jour : Janvier 2026</span>
          </div>
        </header>

        <div className={s.content}>
          {/* Préambule */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Préambule</h2>
            <p className={s.text}>
              Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions d'utilisation du site www.origines.media (ci-après « le Site »), édité par la société ADN Production SAS.
            </p>
            <p className={s.text}>
              L'accès et l'utilisation du Site sont soumis à l'acceptation et au respect des présentes CGU. En accédant au Site, l'utilisateur reconnaît avoir pris connaissance des présentes CGU et les accepter sans réserve.
            </p>
          </div>

          {/* Article 1 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 1 – Mentions Légales</h2>
            <p className={s.text}>Le Site est édité par :</p>
            <div className={s.infoBox}>
              <p><strong>ADN Production SAS</strong></p>
              <p>Société par Actions Simplifiée au capital de 30 000 €</p>
              <p>Siège social : 40 Avenue de Saint-Antoine, 13015 Marseille, France</p>
              <p>SIREN : 981 012 917 R.C.S. Marseille</p>
              <p>Directeur de la publication : Alexandre Quilghini, Président</p>
              <p>Contact : admin@origines.media | 07 85 09 12 70</p>
            </div>
            <p className={s.text}>
              <strong>Hébergeur :</strong> OVH SAS – 2 rue Kellermann, 59100 Roubaix, France
            </p>
          </div>

          {/* Article 2 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 2 – Description du Site</h2>
            <p className={s.text}>
              Origines Média est un portail d'information en ligne proposant des articles, vidéos et contenus éditoriaux. Le Site propose également :
            </p>
            <ul className={s.list}>
              <li>La création d'un compte utilisateur personnel</li>
              <li>Un espace commentaires sous les publications</li>
              <li>L'inscription à une newsletter</li>
              <li>La vente de guides numériques (soumise aux Conditions Générales de Vente)</li>
            </ul>
          </div>

          {/* Article 3 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 3 – Accès au Site</h2>
            <p className={s.text}>
              L'accès au Site est gratuit et ouvert à tout utilisateur disposant d'un accès à Internet. Tous les coûts relatifs à l'accès au Site (matériel informatique, connexion Internet, etc.) sont à la charge exclusive de l'utilisateur.
            </p>
            <p className={s.text}>
              ADN Production SAS s'efforce de maintenir le Site accessible 24 heures sur 24, 7 jours sur 7, mais n'est tenue à aucune obligation d'y parvenir. L'accès au Site peut être interrompu à tout moment, notamment pour des raisons de maintenance, de mise à jour ou pour toute autre raison technique, sans que cela n'ouvre droit à une quelconque indemnisation.
            </p>
          </div>

          {/* Article 4 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 4 – Création de Compte Utilisateur</h2>

            <h3 className={s.sectionSubtitle}>4.1 Inscription</h3>
            <p className={s.text}>
              Certaines fonctionnalités du Site (commentaires, accès à du contenu réservé, achats) nécessitent la création d'un compte utilisateur. Pour créer un compte, l'utilisateur doit :
            </p>
            <ul className={s.list}>
              <li>Être âgé d'au moins 16 ans (ou disposer de l'autorisation d'un représentant légal)</li>
              <li>Fournir des informations exactes, complètes et à jour</li>
              <li>Choisir un mot de passe confidentiel et sécurisé</li>
            </ul>

            <h3 className={s.sectionSubtitle}>4.2 Responsabilité de l'utilisateur</h3>
            <p className={s.text}>
              L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion. Toute utilisation de son compte est réputée effectuée par lui-même. En cas d'utilisation frauduleuse ou de suspicion de compromission de son compte, l'utilisateur doit en informer immédiatement ADN Production SAS à l'adresse : admin@origines.media
            </p>

            <h3 className={s.sectionSubtitle}>4.3 Suppression de compte</h3>
            <p className={s.text}>
              L'utilisateur peut à tout moment demander la suppression de son compte en envoyant un email à admin@origines.media. ADN Production SAS se réserve également le droit de suspendre ou supprimer un compte utilisateur en cas de non-respect des présentes CGU.
            </p>
          </div>

          {/* Article 5 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 5 – Espace Commentaires</h2>

            <h3 className={s.sectionSubtitle}>5.1 Modération a priori</h3>
            <p className={s.text}>
              Le Site dispose d'un espace commentaires permettant aux utilisateurs inscrits de réagir aux publications. <strong>Les commentaires sont soumis à modération préalable</strong> avant leur mise en ligne.
            </p>

            <h3 className={s.sectionSubtitle}>5.2 Règles de bonne conduite</h3>
            <p className={s.text}>
              En publiant un commentaire, l'utilisateur s'engage à respecter les règles suivantes. <strong>Sont interdits les commentaires contenant :</strong>
            </p>
            <ul className={s.list}>
              <li>Des propos injurieux, diffamatoires, discriminatoires, racistes, xénophobes, homophobes ou incitant à la haine</li>
              <li>Des propos à caractère pornographique ou contraires aux bonnes mœurs</li>
              <li>Des atteintes à la vie privée de tiers</li>
              <li>Des contenus violents ou incitant à la violence</li>
              <li>Du harcèlement ou de l'intimidation envers d'autres utilisateurs</li>
              <li>De la publicité, du spam ou des contenus promotionnels non sollicités</li>
              <li>Des liens vers des sites illicites ou malveillants</li>
              <li>Des informations fausses ou trompeuses</li>
              <li>Des atteintes aux droits de propriété intellectuelle de tiers</li>
              <li>Tout contenu contraire aux lois et règlements en vigueur</li>
            </ul>

            <h3 className={s.sectionSubtitle}>5.3 Droit de refus et de suppression</h3>
            <p className={s.text}>ADN Production SAS se réserve le droit de :</p>
            <ul className={s.list}>
              <li>Refuser la publication de tout commentaire ne respectant pas les présentes règles</li>
              <li>Supprimer tout commentaire publié qui s'avérerait contraire aux présentes CGU</li>
              <li>Suspendre ou supprimer le compte d'un utilisateur en cas de manquements répétés</li>
            </ul>

            <h3 className={s.sectionSubtitle}>5.4 Responsabilité</h3>
            <p className={s.text}>
              Les commentaires publiés sur le Site n'engagent que leurs auteurs. ADN Production SAS ne saurait être tenue responsable du contenu des commentaires publiés par les utilisateurs.
            </p>
          </div>

          {/* Article 6 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 6 – Newsletter</h2>

            <h3 className={s.sectionSubtitle}>6.1 Inscription</h3>
            <p className={s.text}>
              L'utilisateur peut s'inscrire à la newsletter d'Origines Média en renseignant son adresse email dans le formulaire prévu à cet effet. Cette inscription est gratuite et facultative.
            </p>

            <h3 className={s.sectionSubtitle}>6.2 Contenu</h3>
            <p className={s.text}>
              La newsletter peut contenir des informations sur les nouveaux contenus publiés sur le Site, des actualités, des offres promotionnelles ou tout autre contenu éditorial.
            </p>

            <h3 className={s.sectionSubtitle}>6.3 Désinscription</h3>
            <p className={s.text}>L'utilisateur peut se désinscrire à tout moment de la newsletter :</p>
            <ul className={s.list}>
              <li>En cliquant sur le lien de désinscription présent dans chaque email</li>
              <li>En envoyant une demande à admin@origines.media</li>
            </ul>
          </div>

          {/* Article 7 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 7 – Propriété Intellectuelle</h2>

            <h3 className={s.sectionSubtitle}>7.1 Contenus du Site</h3>
            <p className={s.text}>
              L'ensemble des éléments présents sur le Site (textes, articles, vidéos, images, graphismes, logo, icônes, sons, logiciels, base de données, etc.) est protégé par le droit de la propriété intellectuelle et appartient à ADN Production SAS ou fait l'objet d'une autorisation d'utilisation.
            </p>

            <h3 className={s.sectionSubtitle}>7.2 Interdictions</h3>
            <p className={s.text}>
              Toute reproduction, représentation, modification, publication, adaptation, totale ou partielle, des éléments du Site, par quelque moyen que ce soit, est interdite sans l'autorisation écrite préalable d'ADN Production SAS.
            </p>
            <p className={s.text}>
              Toute exploitation non autorisée du Site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
            </p>

            <h3 className={s.sectionSubtitle}>7.3 Contenus des utilisateurs</h3>
            <p className={s.text}>
              En publiant un commentaire sur le Site, l'utilisateur concède à ADN Production SAS une licence non exclusive, gratuite et mondiale d'utilisation, de reproduction et de diffusion dudit contenu sur le Site et ses réseaux sociaux.
            </p>
          </div>

          {/* Article 8 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 8 – Données Personnelles</h2>

            <h3 className={s.sectionSubtitle}>8.1 Collecte des données</h3>
            <p className={s.text}>
              Dans le cadre de l'utilisation du Site (création de compte, inscription à la newsletter, commentaires, achats), ADN Production SAS est amenée à collecter des données personnelles.
            </p>
            <div className={s.infoBox}>
              <p><strong>Le responsable du traitement est :</strong></p>
              <p>ADN Production SAS</p>
              <p>40 Avenue de Saint-Antoine, 13015 Marseille</p>
              <p>Email : admin@origines.media</p>
            </div>

            <h3 className={s.sectionSubtitle}>8.2 Finalités du traitement</h3>
            <p className={s.text}>Les données collectées sont utilisées pour :</p>
            <ul className={s.list}>
              <li>La gestion des comptes utilisateurs</li>
              <li>La modération des commentaires</li>
              <li>L'envoi de la newsletter (si inscription)</li>
              <li>Le traitement des commandes (guides numériques)</li>
              <li>L'amélioration du Site et de ses services</li>
              <li>Le respect des obligations légales</li>
            </ul>

            <h3 className={s.sectionSubtitle}>8.3 Droits des utilisateurs</h3>
            <p className={s.text}>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « Informatique et Libertés », vous disposez des droits suivants :
            </p>
            <ul className={s.list}>
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit d'effacement (« droit à l'oubli »)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className={s.text}>
              Pour exercer ces droits, contactez-nous à : admin@origines.media
            </p>
            <p className={s.text}>
              Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés).
            </p>

            <h3 className={s.sectionSubtitle}>8.4 Cookies</h3>
            <p className={s.text}>
              Le Site peut utiliser des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. L'utilisateur peut paramétrer son navigateur pour accepter ou refuser les cookies.
            </p>
          </div>

          {/* Article 9 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 9 – Liens Hypertextes</h2>
            <p className={s.text}>
              Le Site peut contenir des liens vers des sites tiers. ADN Production SAS n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux éventuels dommages résultant de leur utilisation.
            </p>
          </div>

          {/* Article 10 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 10 – Limitation de Responsabilité</h2>
            <p className={s.text}>
              ADN Production SAS s'efforce de fournir des informations exactes et à jour sur le Site. Toutefois, elle ne garantit pas l'exactitude, la complétude ou l'actualité des informations diffusées.
            </p>
            <p className={s.text}>ADN Production SAS ne saurait être tenue responsable :</p>
            <ul className={s.list}>
              <li>Des erreurs ou omissions dans les contenus du Site</li>
              <li>Des dommages directs ou indirects résultant de l'accès ou de l'utilisation du Site</li>
              <li>De l'impossibilité temporaire d'accéder au Site</li>
              <li>De l'utilisation frauduleuse du Site par des tiers</li>
              <li>Des contenus des sites tiers accessibles via des liens hypertextes</li>
            </ul>
          </div>

          {/* Article 11 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 11 – Modification des CGU</h2>
            <p className={s.text}>
              ADN Production SAS se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le Site. L'utilisateur est invité à consulter régulièrement cette page.
            </p>
            <p className={s.text}>
              La poursuite de l'utilisation du Site après modification des CGU vaut acceptation des nouvelles conditions.
            </p>
          </div>

          {/* Article 12 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 12 – Droit Applicable et Juridiction</h2>
            <p className={s.text}>
              Les présentes CGU sont régies par le droit français.
            </p>
            <p className={s.text}>
              En cas de litige relatif à l'interprétation ou à l'exécution des présentes, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux français seront seuls compétents.
            </p>
          </div>

          {/* Article 13 */}
          <div className={s.section}>
            <h2 className={s.sectionTitle}>Article 13 – Contact</h2>
            <p className={s.text}>
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter :
            </p>
            <div className={s.infoBox}>
              <p><strong>ADN Production SAS</strong></p>
              <p>40 Avenue de Saint-Antoine, 13015 Marseille, France</p>
              <p>Email : admin@origines.media</p>
              <p>Téléphone : 07 85 09 12 70</p>
            </div>
          </div>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
