import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CGUPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <Navbar />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gray-50 py-20 px-8 lg:px-16 relative overflow-hidden">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <span className="font-inter text-violet-600 text-sm tracking-[0.2em] uppercase">
                Conditions Générales
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            </div>

            <h1 className="font-montserrat font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider text-gray-900 mb-8 leading-[0.9]">
              Conditions Générales
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">d'Utilisation</span>
            </h1>

            <p className="font-inter text-xl text-gray-600 leading-relaxed">
              Dernière mise à jour : Janvier 2026
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-sm space-y-12">

              {/* Préambule */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Préambule</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions d'utilisation du site www.origines.media (ci-après « le Site »), édité par la société ADN Production SAS.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  L'accès et l'utilisation du Site sont soumis à l'acceptation et au respect des présentes CGU. En accédant au Site, l'utilisateur reconnaît avoir pris connaissance des présentes CGU et les accepter sans réserve.
                </p>
              </div>

              {/* Article 1 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 1 – Mentions Légales</h2>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">Le Site est édité par :</p>
                <div className="bg-gray-50 rounded-xl p-6 font-inter text-gray-700">
                  <p className="font-semibold">ADN Production SAS</p>
                  <p>Société par Actions Simplifiée au capital de 30 000 €</p>
                  <p>Siège social : 40 Avenue de Saint-Antoine, 13015 Marseille, France</p>
                  <p>SIREN : 981 012 917 R.C.S. Marseille</p>
                  <p>Directeur de la publication : Alexandre Quilghini, Président</p>
                  <p>Contact : admin@origines.media | 07 85 09 12 70</p>
                </div>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  <strong>Hébergeur :</strong> OVH SAS – 2 rue Kellermann, 59100 Roubaix, France
                </p>
              </div>

              {/* Article 2 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 2 – Description du Site</h2>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  Origines Média est un portail d'information en ligne proposant des articles, vidéos et contenus éditoriaux. Le Site propose également :
                </p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>La création d'un compte utilisateur personnel</li>
                  <li>Un espace commentaires sous les publications</li>
                  <li>L'inscription à une newsletter</li>
                  <li>La vente de guides numériques (soumise aux Conditions Générales de Vente)</li>
                </ul>
              </div>

              {/* Article 3 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 3 – Accès au Site</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  L'accès au Site est gratuit et ouvert à tout utilisateur disposant d'un accès à Internet. Tous les coûts relatifs à l'accès au Site (matériel informatique, connexion Internet, etc.) sont à la charge exclusive de l'utilisateur.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  ADN Production SAS s'efforce de maintenir le Site accessible 24 heures sur 24, 7 jours sur 7, mais n'est tenue à aucune obligation d'y parvenir. L'accès au Site peut être interrompu à tout moment, notamment pour des raisons de maintenance, de mise à jour ou pour toute autre raison technique, sans que cela n'ouvre droit à une quelconque indemnisation.
                </p>
              </div>

              {/* Article 4 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 4 – Création de Compte Utilisateur</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">4.1 Inscription</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  Certaines fonctionnalités du Site (commentaires, accès à du contenu réservé, achats) nécessitent la création d'un compte utilisateur. Pour créer un compte, l'utilisateur doit :
                </p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Être âgé d'au moins 16 ans (ou disposer de l'autorisation d'un représentant légal)</li>
                  <li>Fournir des informations exactes, complètes et à jour</li>
                  <li>Choisir un mot de passe confidentiel et sécurisé</li>
                </ul>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">4.2 Responsabilité de l'utilisateur</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion. Toute utilisation de son compte est réputée effectuée par lui-même. En cas d'utilisation frauduleuse ou de suspicion de compromission de son compte, l'utilisateur doit en informer immédiatement ADN Production SAS à l'adresse : admin@origines.media
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">4.3 Suppression de compte</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  L'utilisateur peut à tout moment demander la suppression de son compte en envoyant un email à admin@origines.media. ADN Production SAS se réserve également le droit de suspendre ou supprimer un compte utilisateur en cas de non-respect des présentes CGU.
                </p>
              </div>

              {/* Article 5 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 5 – Espace Commentaires</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">5.1 Modération a priori</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Le Site dispose d'un espace commentaires permettant aux utilisateurs inscrits de réagir aux publications. <strong>Les commentaires sont soumis à modération préalable</strong> avant leur mise en ligne.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">5.2 Règles de bonne conduite</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  En publiant un commentaire, l'utilisateur s'engage à respecter les règles suivantes. <strong>Sont interdits les commentaires contenant :</strong>
                </p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
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

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">5.3 Droit de refus et de suppression</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">ADN Production SAS se réserve le droit de :</p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Refuser la publication de tout commentaire ne respectant pas les présentes règles</li>
                  <li>Supprimer tout commentaire publié qui s'avérerait contraire aux présentes CGU</li>
                  <li>Suspendre ou supprimer le compte d'un utilisateur en cas de manquements répétés</li>
                </ul>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">5.4 Responsabilité</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les commentaires publiés sur le Site n'engagent que leurs auteurs. ADN Production SAS ne saurait être tenue responsable du contenu des commentaires publiés par les utilisateurs.
                </p>
              </div>

              {/* Article 6 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 6 – Newsletter</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">6.1 Inscription</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  L'utilisateur peut s'inscrire à la newsletter d'Origines Média en renseignant son adresse email dans le formulaire prévu à cet effet. Cette inscription est gratuite et facultative.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">6.2 Contenu</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  La newsletter peut contenir des informations sur les nouveaux contenus publiés sur le Site, des actualités, des offres promotionnelles ou tout autre contenu éditorial.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">6.3 Désinscription</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">L'utilisateur peut se désinscrire à tout moment de la newsletter :</p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>En cliquant sur le lien de désinscription présent dans chaque email</li>
                  <li>En envoyant une demande à admin@origines.media</li>
                </ul>
              </div>

              {/* Article 7 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 7 – Propriété Intellectuelle</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">7.1 Contenus du Site</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  L'ensemble des éléments présents sur le Site (textes, articles, vidéos, images, graphismes, logo, icônes, sons, logiciels, base de données, etc.) est protégé par le droit de la propriété intellectuelle et appartient à ADN Production SAS ou fait l'objet d'une autorisation d'utilisation.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">7.2 Interdictions</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Toute reproduction, représentation, modification, publication, adaptation, totale ou partielle, des éléments du Site, par quelque moyen que ce soit, est interdite sans l'autorisation écrite préalable d'ADN Production SAS.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Toute exploitation non autorisée du Site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">7.3 Contenus des utilisateurs</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  En publiant un commentaire sur le Site, l'utilisateur concède à ADN Production SAS une licence non exclusive, gratuite et mondiale d'utilisation, de reproduction et de diffusion dudit contenu sur le Site et ses réseaux sociaux.
                </p>
              </div>

              {/* Article 8 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 8 – Données Personnelles</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">8.1 Collecte des données</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  Dans le cadre de l'utilisation du Site (création de compte, inscription à la newsletter, commentaires, achats), ADN Production SAS est amenée à collecter des données personnelles.
                </p>
                <div className="bg-gray-50 rounded-xl p-6 font-inter text-gray-700">
                  <p className="font-semibold">Le responsable du traitement est :</p>
                  <p>ADN Production SAS</p>
                  <p>40 Avenue de Saint-Antoine, 13015 Marseille</p>
                  <p>Email : admin@origines.media</p>
                </div>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">8.2 Finalités du traitement</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">Les données collectées sont utilisées pour :</p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>La gestion des comptes utilisateurs</li>
                  <li>La modération des commentaires</li>
                  <li>L'envoi de la newsletter (si inscription)</li>
                  <li>Le traitement des commandes (guides numériques)</li>
                  <li>L'amélioration du Site et de ses services</li>
                  <li>Le respect des obligations légales</li>
                </ul>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">8.3 Droits des utilisateurs</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi « Informatique et Libertés », vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit d'effacement (« droit à l'oubli »)</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition</li>
                </ul>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Pour exercer ces droits, contactez-nous à : admin@origines.media
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés).
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">8.4 Cookies</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Le Site peut utiliser des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. L'utilisateur peut paramétrer son navigateur pour accepter ou refuser les cookies.
                </p>
              </div>

              {/* Article 9 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 9 – Liens Hypertextes</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Le Site peut contenir des liens vers des sites tiers. ADN Production SAS n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux éventuels dommages résultant de leur utilisation.
                </p>
              </div>

              {/* Article 10 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 10 – Limitation de Responsabilité</h2>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  ADN Production SAS s'efforce de fournir des informations exactes et à jour sur le Site. Toutefois, elle ne garantit pas l'exactitude, la complétude ou l'actualité des informations diffusées.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">ADN Production SAS ne saurait être tenue responsable :</p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Des erreurs ou omissions dans les contenus du Site</li>
                  <li>Des dommages directs ou indirects résultant de l'accès ou de l'utilisation du Site</li>
                  <li>De l'impossibilité temporaire d'accéder au Site</li>
                  <li>De l'utilisation frauduleuse du Site par des tiers</li>
                  <li>Des contenus des sites tiers accessibles via des liens hypertextes</li>
                </ul>
              </div>

              {/* Article 11 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 11 – Modification des CGU</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  ADN Production SAS se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le Site. L'utilisateur est invité à consulter régulièrement cette page.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  La poursuite de l'utilisation du Site après modification des CGU vaut acceptation des nouvelles conditions.
                </p>
              </div>

              {/* Article 12 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 12 – Droit Applicable et Juridiction</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les présentes CGU sont régies par le droit français.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  En cas de litige relatif à l'interprétation ou à l'exécution des présentes, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux français seront seuls compétents.
                </p>
              </div>

              {/* Article 13 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 13 – Contact</h2>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  Pour toute question relative aux présentes CGU, vous pouvez nous contacter :
                </p>
                <div className="bg-gray-50 rounded-xl p-6 font-inter text-gray-700">
                  <p className="font-semibold">ADN Production SAS</p>
                  <p>40 Avenue de Saint-Antoine, 13015 Marseille, France</p>
                  <p>Email : admin@origines.media</p>
                  <p>Téléphone : 07 85 09 12 70</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CGUPage;
