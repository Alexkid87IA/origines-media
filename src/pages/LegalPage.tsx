import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import s from "./LegalPage.module.css";

export default function LegalPage() {
  return (
    <div className={s.page}>
      <SEO
        title="Mentions légales"
        description="Consultez les mentions légales d'Origines Media : éditeur, hébergeur, propriété intellectuelle et conditions d'utilisation."
        url="/mentions-legales"
      />
      <SiteHeader />

      <main>
        <header className={s.header}>
          <div className={s.headerInner}>
            <span className={s.headerKicker}>Informations légales</span>
            <span className={s.headerBar} />
            <h1 className={s.headerTitle}>Mentions légales</h1>
            <span className={s.headerSub}>www.origines.media</span>
          </div>
        </header>

        <div className={s.content}>
          <div className={s.section}>
            <h2 className={s.sectionTitle}>1. Éditeur du site</h2>
            <p className={s.text}>Le site Origines Média est édité par :</p>
            <div className={s.infoBox}>
              <p><strong>ADN Production SAS</strong></p>
              <p>Société par Actions Simplifiée au capital de 30 000 €</p>
              <p>Siège social : 40 Avenue de Saint-Antoine, 13015 Marseille, France</p>
              <p>SIREN : 981 012 917 R.C.S. Marseille</p>
              <p>Numéro de TVA intracommunautaire : FR78981012917</p>
              <p style={{ marginTop: 16 }}><strong>Directeur de la publication :</strong> Alexandre Quilghini, Président</p>
              <p style={{ marginTop: 16 }}><strong>Contact :</strong></p>
              <p>Téléphone : 07 85 09 12 70</p>
              <p>Email : admin@origines.media</p>
            </div>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>2. Hébergeur</h2>
            <p className={s.text}>Le site est hébergé par :</p>
            <div className={s.infoBox}>
              <p><strong>OVH SAS</strong></p>
              <p>2 rue Kellermann, 59100 Roubaix, France</p>
              <p>Téléphone : 1007 (depuis la France)</p>
              <p>Site web : www.ovh.com</p>
            </div>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>3. Propriété intellectuelle</h2>
            <p className={s.text}>
              L'ensemble des contenus présents sur le site www.origines.media (textes, images, vidéos, graphismes, logo, icônes, sons, logiciels, etc.) est protégé par les dispositions du Code de la propriété intellectuelle et appartient à ADN Production SAS ou fait l'objet d'une autorisation d'utilisation.
            </p>
            <p className={s.text}>
              Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite sans l'autorisation écrite préalable d'ADN Production SAS.
            </p>
            <p className={s.text}>
              Toute exploitation non autorisée du site ou de son contenu serait constitutive d'une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
            </p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>4. Données personnelles et cookies</h2>
            <h3 className={s.sectionSubtitle}>4.1 Collecte des données personnelles</h3>
            <p className={s.text}>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de rectification, de suppression, de limitation, de portabilité et d'opposition aux données personnelles vous concernant.
            </p>
            <p className={s.text}>
              Pour exercer ces droits ou pour toute question relative à vos données personnelles, vous pouvez nous contacter :
            </p>
            <ul className={s.list}>
              <li>Par email : admin@origines.media</li>
              <li>Par courrier : ADN Production SAS, 40 Avenue de Saint-Antoine, 13015 Marseille, France</li>
            </ul>
            <h3 className={s.sectionSubtitle}>4.2 Cookies</h3>
            <p className={s.text}>
              Le site www.origines.media peut être amené à utiliser des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. Vous pouvez à tout moment paramétrer votre navigateur pour accepter ou refuser les cookies.
            </p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>5. Responsabilité</h2>
            <p className={s.text}>
              ADN Production SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site, dont elle se réserve le droit de corriger le contenu à tout moment et sans préavis.
            </p>
            <p className={s.text}>ADN Production SAS décline toute responsabilité :</p>
            <ul className={s.list}>
              <li>En cas d'interruption du site pour des opérations de maintenance technique ou de mise à jour</li>
              <li>En cas d'impossibilité momentanée d'accès au site liée à des problèmes techniques</li>
              <li>Pour les dommages directs ou indirects résultant de l'accès ou de l'utilisation du site</li>
              <li>Pour les sites tiers vers lesquels des liens hypertextes peuvent renvoyer</li>
            </ul>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>6. Crédits</h2>
            <p className={s.text}>
              <strong>Conception et réalisation :</strong> ADN Production SAS
            </p>
          </div>

          <div className={s.section}>
            <h2 className={s.sectionTitle}>7. Droit applicable</h2>
            <p className={s.text}>
              Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </div>
        </div>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
