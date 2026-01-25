import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const LegalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <SEO
        title="Mentions légales"
        description="Consultez les mentions légales d'Origines Media : éditeur, hébergeur, propriété intellectuelle et conditions d'utilisation."
        url="/mentions-legales"
      />
      <Navbar />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gray-50 py-20 px-8 lg:px-16 relative overflow-hidden">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <span className="font-inter text-violet-600 text-sm tracking-[0.2em] uppercase">
                Informations légales
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            </div>

            <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider text-gray-900 mb-8 leading-[0.9]">
              Mentions
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Légales</span>
            </h1>

            <p className="font-inter text-xl text-gray-600 leading-relaxed">
              www.origines.media
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-sm space-y-12">

              {/* 1. Éditeur du site */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">1. Éditeur du site</h2>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">Le site Origines Média est édité par :</p>
                <div className="bg-gray-50 rounded-xl p-6 font-inter text-gray-700">
                  <p className="font-semibold">ADN Production SAS</p>
                  <p>Société par Actions Simplifiée au capital de 30 000 €</p>
                  <p>Siège social : 40 Avenue de Saint-Antoine, 13015 Marseille, France</p>
                  <p>SIREN : 981 012 917 R.C.S. Marseille</p>
                  <p>Numéro de TVA intracommunautaire : FR78981012917</p>
                  <p className="mt-4"><strong>Directeur de la publication :</strong> Alexandre Quilghini, Président</p>
                  <p className="mt-4 font-semibold">Contact :</p>
                  <p>Téléphone : 07 85 09 12 70</p>
                  <p>Email : admin@origines.media</p>
                </div>
              </div>

              {/* 2. Hébergeur */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">2. Hébergeur</h2>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">Le site est hébergé par :</p>
                <div className="bg-gray-50 rounded-xl p-6 font-inter text-gray-700">
                  <p className="font-semibold">OVH SAS</p>
                  <p>2 rue Kellermann, 59100 Roubaix, France</p>
                  <p>Téléphone : 1007 (depuis la France)</p>
                  <p>Site web : www.ovh.com</p>
                </div>
              </div>

              {/* 3. Propriété intellectuelle */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">3. Propriété intellectuelle</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  L'ensemble des contenus présents sur le site www.origines.media (textes, images, vidéos, graphismes, logo, icônes, sons, logiciels, etc.) est protégé par les dispositions du Code de la propriété intellectuelle et appartient à ADN Production SAS ou fait l'objet d'une autorisation d'utilisation.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite sans l'autorisation écrite préalable d'ADN Production SAS.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Toute exploitation non autorisée du site ou de son contenu serait constitutive d'une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
                </p>
              </div>

              {/* 4. Données personnelles et cookies */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">4. Données personnelles et cookies</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">4.1 Collecte des données personnelles</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de rectification, de suppression, de limitation, de portabilité et d'opposition aux données personnelles vous concernant.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4 mb-4">
                  Pour exercer ces droits ou pour toute question relative à vos données personnelles, vous pouvez nous contacter :
                </p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Par email : admin@origines.media</li>
                  <li>Par courrier : ADN Production SAS, 40 Avenue de Saint-Antoine, 13015 Marseille, France</li>
                </ul>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">4.2 Cookies</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Le site www.origines.media peut être amené à utiliser des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. Vous pouvez à tout moment paramétrer votre navigateur pour accepter ou refuser les cookies.
                </p>
              </div>

              {/* 5. Responsabilité */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">5. Responsabilité</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  ADN Production SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site, dont elle se réserve le droit de corriger le contenu à tout moment et sans préavis.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4 mb-4">ADN Production SAS décline toute responsabilité :</p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>En cas d'interruption du site pour des opérations de maintenance technique ou de mise à jour</li>
                  <li>En cas d'impossibilité momentanée d'accès au site liée à des problèmes techniques</li>
                  <li>Pour les dommages directs ou indirects résultant de l'accès ou de l'utilisation du site</li>
                  <li>Pour les sites tiers vers lesquels des liens hypertextes peuvent renvoyer</li>
                </ul>
              </div>

              {/* 6. Crédits */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">6. Crédits</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  <strong>Conception et réalisation :</strong> ADN Production SAS
                </p>
              </div>

              {/* 7. Droit applicable */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">7. Droit applicable</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
                </p>
              </div>

              {/* Date de mise à jour */}
              <div className="pt-8 border-t border-gray-200">
                <p className="font-inter text-gray-400 text-sm italic text-center">
                  Dernière mise à jour : janvier 2026
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
