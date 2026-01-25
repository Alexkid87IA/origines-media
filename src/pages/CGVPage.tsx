import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const CGVPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <SEO
        title="Conditions Générales de Vente"
        description="Consultez les conditions générales de vente d'Origines Media. Modalités de commande, paiement, livraison et garanties."
        url="/cgv"
      />
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
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">de Vente</span>
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
                  Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent les ventes de produits numériques (guides au format PDF/ebook) réalisées sur le site www.origines.media (ci-après « le Site »), édité par la société ADN Production SAS.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Toute commande passée sur le Site implique l'acceptation sans réserve des présentes CGV par le client.
                </p>
              </div>

              {/* Article 1 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 1 – Identification du Vendeur</h2>
                <div className="bg-gray-50 rounded-xl p-6 font-inter text-gray-700">
                  <p className="font-semibold">ADN Production SAS</p>
                  <p>Société par Actions Simplifiée au capital de 30 000 €</p>
                  <p>Siège social : 40 Avenue de Saint-Antoine, 13015 Marseille, France</p>
                  <p>SIREN : 981 012 917 R.C.S. Marseille</p>
                  <p>Numéro de TVA intracommunautaire : FR78981012917</p>
                  <p className="mt-4 font-semibold">Contact :</p>
                  <p>Email : admin@origines.media</p>
                  <p>Téléphone : 07 85 09 12 70</p>
                </div>
              </div>

              {/* Article 2 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 2 – Produits</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">2.1 Description</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  ADN Production SAS propose à la vente des guides numériques au format PDF et/ou ebook, téléchargeables ou envoyés par email.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Les produits proposés sont décrits avec la plus grande exactitude possible. Les photographies et illustrations présentées sur le Site ne sont pas contractuelles.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">2.2 Disponibilité</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les produits numériques sont disponibles tant qu'ils sont proposés sur le Site. En cas d'indisponibilité d'un produit après passation de la commande, le client en sera informé par email et sera remboursé intégralement.
                </p>
              </div>

              {/* Article 3 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 3 – Prix</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">3.1 Tarifs</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les prix des produits sont indiqués en euros (€) toutes taxes comprises (TTC).
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  ADN Production SAS se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">3.2 Offres promotionnelles</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les offres promotionnelles sont valables dans la limite des conditions indiquées sur le Site (durée, stock, etc.).
                </p>
              </div>

              {/* Article 4 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 4 – Commande</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">4.1 Processus de commande</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">Pour passer commande, le client doit :</p>
                <ol className="list-decimal list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Sélectionner le(s) produit(s) souhaité(s)</li>
                  <li>Vérifier le contenu de son panier</li>
                  <li>Créer un compte ou se connecter à son compte existant</li>
                  <li>Renseigner ses informations de facturation</li>
                  <li>Choisir son mode de paiement</li>
                  <li><strong>Accepter les présentes CGV en cochant la case prévue à cet effet</strong></li>
                  <li><strong>Pour les produits numériques : accepter expressément la renonciation au droit de rétractation</strong> (voir Article 7)</li>
                  <li>Valider et payer sa commande</li>
                </ol>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">4.2 Confirmation de commande</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Après validation du paiement, le client reçoit un email de confirmation récapitulant les détails de sa commande. Cet email vaut acceptation de la commande par ADN Production SAS.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">4.3 Preuve de la transaction</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les registres informatisés d'ADN Production SAS seront considérés comme preuve des communications, commandes et paiements intervenus entre les parties.
                </p>
              </div>

              {/* Article 5 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 5 – Paiement</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">5.1 Moyens de paiement acceptés</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">Le client peut régler sa commande par les moyens de paiement suivants :</p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Carte bancaire (Visa, Mastercard, etc.)</li>
                  <li>PayPal</li>
                  <li>Google Pay</li>
                  <li>Shopify Payments</li>
                  <li>Tout autre moyen de paiement proposé sur le Site</li>
                </ul>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">5.2 Sécurité des paiements</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les paiements sont sécurisés par nos prestataires de paiement. ADN Production SAS n'a pas accès aux données bancaires du client, celles-ci étant directement traitées par les prestataires de paiement.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">5.3 Validation du paiement</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  La commande est validée après confirmation du paiement par l'organisme bancaire ou le prestataire de paiement. En cas de refus de paiement, la commande est automatiquement annulée.
                </p>
              </div>

              {/* Article 6 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 6 – Livraison</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">6.1 Modalités de livraison</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  Les guides numériques sont livrés par <strong>envoi par email</strong> à l'adresse renseignée par le client lors de la commande.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">L'email de livraison contient :</p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Le(s) fichier(s) en pièce jointe, et/ou</li>
                  <li>Un lien de téléchargement sécurisé</li>
                </ul>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">6.2 Délai de livraison</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  La livraison intervient <strong>immédiatement</strong> ou dans un délai maximum de <strong>24 heures</strong> après confirmation du paiement, sauf problème technique.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">6.3 Problèmes de livraison</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">En cas de non-réception de l'email de livraison :</p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Vérifier le dossier « spam » ou « courrier indésirable »</li>
                  <li>Contacter le service client à admin@origines.media en indiquant le numéro de commande</li>
                </ul>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  ADN Production SAS s'engage à renvoyer le produit dans les meilleurs délais.
                </p>
              </div>

              {/* Article 7 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 7 – Droit de Rétractation</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">7.1 Principe</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Conformément à l'article L.221-18 du Code de la consommation, le consommateur dispose en principe d'un délai de 14 jours pour exercer son droit de rétractation.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">7.2 Exception pour les contenus numériques</h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 font-inter text-gray-700">
                  <p>
                    <strong>Toutefois, conformément à l'article L.221-28, 13° du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de contenu numérique non fourni sur un support matériel dont l'exécution a commencé avec l'accord préalable exprès du consommateur, qui a également reconnu qu'il perdrait ainsi son droit de rétractation.</strong>
                  </p>
                </div>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">7.3 Renonciation au droit de rétractation</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  En passant commande d'un guide numérique sur le Site, <strong>le client reconnaît expressément</strong> :
                </p>
                <ol className="list-decimal list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Demander l'exécution immédiate du contrat (envoi du guide par email)</li>
                  <li>Renoncer expressément à son droit de rétractation dès l'envoi du guide</li>
                  <li>Avoir été informé qu'il ne pourra plus exercer son droit de rétractation une fois le guide envoyé</li>
                </ol>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  <strong>Cette acceptation est matérialisée par une case à cocher obligatoire lors du processus de commande.</strong>
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">7.4 Conséquence</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Une fois le guide numérique envoyé par email, <strong>aucun remboursement ne pourra être accordé</strong> au titre du droit de rétractation, le client ayant expressément renoncé à ce droit.
                </p>
              </div>

              {/* Article 8 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 8 – Garanties Légales</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">8.1 Garantie de conformité</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Conformément aux articles L.217-3 à L.217-14 du Code de la consommation, ADN Production SAS est tenue de livrer un produit conforme à la description et aux caractéristiques annoncées sur le Site.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">8.2 Garantie des vices cachés</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Conformément aux articles 1641 et suivants du Code civil, le client bénéficie de la garantie des vices cachés rendant le produit impropre à l'usage auquel on le destine.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">8.3 Mise en œuvre</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  En cas de non-conformité ou de vice caché, le client peut contacter ADN Production SAS à l'adresse admin@origines.media pour obtenir le remplacement du produit ou, si cela est impossible, le remboursement.
                </p>
              </div>

              {/* Article 9 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 9 – Propriété Intellectuelle</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">9.1 Droits d'auteur</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les guides numériques vendus sur le Site sont protégés par le droit d'auteur et appartiennent à ADN Production SAS. L'achat d'un guide confère au client un droit d'usage personnel, privé et non commercial.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">9.2 Interdictions</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">Le client s'interdit expressément de :</p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>Reproduire, copier ou dupliquer les guides, en tout ou partie</li>
                  <li>Diffuser, distribuer ou partager les guides à des tiers</li>
                  <li>Revendre ou commercialiser les guides</li>
                  <li>Modifier, adapter ou créer des œuvres dérivées</li>
                  <li>Supprimer ou modifier les mentions de droits d'auteur</li>
                </ul>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">9.3 Sanctions</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Toute violation des droits de propriété intellectuelle constitue un délit de contrefaçon sanctionné par les articles L.335-2 et suivants du Code de la propriété intellectuelle (jusqu'à 3 ans d'emprisonnement et 300 000 € d'amende).
                </p>
              </div>

              {/* Article 10 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 10 – Responsabilité</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">10.1 Limitation de responsabilité</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">ADN Production SAS ne saurait être tenue responsable :</p>
                <ul className="list-disc list-inside font-inter text-gray-600 space-y-2 ml-4">
                  <li>De l'utilisation faite par le client des guides achetés</li>
                  <li>De l'incompatibilité des fichiers avec l'équipement du client</li>
                  <li>Des dommages indirects résultant de l'achat ou de l'utilisation des produits</li>
                </ul>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">10.2 Force majeure</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  ADN Production SAS ne pourra être tenue responsable en cas de non-exécution de ses obligations résultant d'un cas de force majeure tel que défini par la jurisprudence française.
                </p>
              </div>

              {/* Article 11 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 11 – Données Personnelles</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Dans le cadre des commandes, ADN Production SAS collecte des données personnelles nécessaires au traitement de la commande et à la livraison des produits.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Ces données sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à notre politique de confidentialité disponible sur le Site.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Pour plus d'informations sur le traitement de vos données et l'exercice de vos droits, consultez les Conditions Générales d'Utilisation ou contactez-nous à admin@origines.media.
                </p>
              </div>

              {/* Article 12 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 12 – Service Client</h2>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  Pour toute question, réclamation ou demande d'information, le client peut contacter le service client :
                </p>
                <div className="bg-gray-50 rounded-xl p-6 font-inter text-gray-700">
                  <p className="font-semibold">ADN Production SAS</p>
                  <p>Email : admin@origines.media</p>
                  <p>Téléphone : 07 85 09 12 70</p>
                  <p>Adresse : 40 Avenue de Saint-Antoine, 13015 Marseille, France</p>
                </div>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Le service client s'engage à répondre dans un délai de 48 heures ouvrées.
                </p>
              </div>

              {/* Article 13 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 13 – Médiation</h2>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">13.1 Réclamation préalable</h3>
                <p className="font-inter text-gray-600 leading-relaxed">
                  En cas de litige, le client est invité à contacter en premier lieu le service client d'ADN Production SAS pour tenter de trouver une solution amiable.
                </p>

                <h3 className="font-montserrat font-semibold text-lg text-gray-800 mb-3 mt-6">13.2 Médiation de la consommation</h3>
                <p className="font-inter text-gray-600 leading-relaxed mb-4">
                  Conformément aux articles L.611-1 et suivants du Code de la consommation, en cas d'échec de la réclamation auprès du service client, le client peut recourir gratuitement à un médiateur de la consommation.
                </p>
                <div className="bg-gray-50 rounded-xl p-6 font-inter text-gray-700">
                  <p className="font-semibold">Médiateur compétent :</p>
                  <p>Médiateur du e-commerce de la FEVAD</p>
                  <p>60 rue La Boétie, 75008 Paris</p>
                  <p><a href="https://www.mediateurfevad.fr" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">https://www.mediateurfevad.fr</a></p>
                  <p>Formulaire de saisine en ligne : <a href="https://www.mediateurfevad.fr/index.php/espace-consommateur/" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">https://www.mediateurfevad.fr/index.php/espace-consommateur/</a></p>
                </div>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  Le client peut également utiliser la plateforme européenne de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">https://ec.europa.eu/consumers/odr</a>
                </p>
              </div>

              {/* Article 14 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 14 – Droit Applicable et Juridiction</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Les présentes CGV sont régies par le droit français.
                </p>
                <p className="font-inter text-gray-600 leading-relaxed mt-4">
                  En cas de litige relatif à l'interprétation ou à l'exécution des présentes, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
                </p>
              </div>

              {/* Article 15 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 15 – Modification des CGV</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  ADN Production SAS se réserve le droit de modifier les présentes CGV à tout moment. Les CGV applicables sont celles en vigueur au moment de la passation de la commande.
                </p>
              </div>

              {/* Article 16 */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Article 16 – Nullité Partielle</h2>
                <p className="font-inter text-gray-600 leading-relaxed">
                  Si une ou plusieurs stipulations des présentes CGV étaient déclarées nulles ou inapplicables, les autres stipulations conserveraient toute leur force et leur portée.
                </p>
              </div>

              {/* Annexe */}
              <div>
                <h2 className="font-montserrat font-bold text-2xl text-gray-900 mb-4">Annexe – Modèle de Formulaire de Réclamation</h2>
                <div className="bg-gray-50 rounded-xl p-6 font-inter text-gray-700">
                  <p className="mb-4"><strong>À :</strong> ADN Production SAS – 40 Avenue de Saint-Antoine, 13015 Marseille – admin@origines.media</p>
                  <p className="mb-4">Je soussigné(e) [Nom, Prénom], demeurant à [Adresse], souhaite signaler un problème concernant ma commande :</p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                    <li>Numéro de commande : _______________</li>
                    <li>Date de commande : _______________</li>
                    <li>Produit concerné : _______________</li>
                    <li>Nature du problème : _______________</li>
                  </ul>
                  <p className="mb-4">[Description détaillée du problème]</p>
                  <p>Fait à _______________, le _______________</p>
                  <p>Signature : _______________</p>
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

export default CGVPage;
