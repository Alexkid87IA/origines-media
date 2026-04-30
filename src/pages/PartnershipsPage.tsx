// src/pages/PartnershipsPage.tsx

import React from "react";
import { ArrowRight, Check, Download, Eye, Film, Mail, Mic2, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "../components/SEO";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import s from "./PartnershipsPage.module.css";

const DECK_URL = "/origines-partenariats-2026.pdf";
const DECK_NAME = "Origines-media-kit-2026.pdf";

const heroMosaicImages = [
  "/partnerships/hero/portrait-01.jpg",
  "/partnerships/hero/portrait-02.jpg",
  "/partnerships/hero/portrait-06.jpg",
  "/partnerships/hero/portrait-04.jpg",
  "/partnerships/hero/portrait-05.jpg",
  "/partnerships/hero/portrait-07.jpg",
  "/partnerships/hero/portrait-08.jpg",
  "/partnerships/hero/portrait-09.jpg",
  "/partnerships/hero/portrait-03.jpg",
  "/partnerships/hero/portrait-10.jpg",
];

const partnerOpenings = [
  {
    label: "Accès",
    title: "Entrer là où le récit commence.",
    text: "Une marque utile donne accès à une personne, un lieu, une archive, un usage ou une question que la rédaction n'approcherait pas avec la même profondeur seule.",
  },
  {
    label: "Justesse",
    title: "Tenir une place claire.",
    text: "On nomme votre rôle, on garde le sujet devant, et chaque apparition doit rendre l'histoire plus précise, plus incarnée, plus nécessaire.",
  },
  {
    label: "Trace",
    title: "Faire naître autre chose qu'une campagne.",
    text: "Un épisode peut ouvrir un dossier, une rencontre, un podcast, un film ou un livre. Le partenariat devient un point de départ, pas une parenthèse.",
  },
];

const editorialFormats = [
  {
    code: "01",
    name: "L'épisode présenté",
    line: "Votre marque ouvre une histoire forte, sans prendre la place du sujet.",
    scene: "Idéal pour s'associer à une conversation de société, un portrait ou une transmission.",
  },
  {
    code: "02",
    name: "La série co-produite",
    line: "Un territoire de marque devient une collection éditoriale identifiable.",
    scene: "Savoir-faire, héritage, santé, famille, mobilité, mémoire : on construit un monde.",
  },
  {
    code: "03",
    name: "Le geste éditorial",
    line: "Un lieu, un objet ou une expertise entre naturellement dans le récit.",
    scene: "Jamais un placement plaqué. Toujours une présence qui enrichit la scène.",
  },
  {
    code: "04",
    name: "Le rendez-vous vivant",
    line: "Projection, rencontre, masterclass ou tournage : la communauté se réunit autour d'une histoire.",
    scene: "Le partenaire devient hôte d'un moment, pas sponsor d'un affichage.",
  },
];

const worlds = [
  {
    label: "Maison patrimoniale",
    title: "Faire entendre ce qui se transmet.",
    text: "Une série sur les gestes, les lieux, les héritiers invisibles d'un savoir-faire.",
  },
  {
    label: "Marque engagée",
    title: "S'associer à un sujet qui compte.",
    text: "Un épisode présenté sur un thème où la marque a une légitimité réelle.",
  },
  {
    label: "Institution culturelle",
    title: "Transformer une sortie en conversation.",
    text: "Newsletter, podcast, vidéo longue et événement pour donner de la profondeur à un lancement.",
  },
];

const promises = [
  "Un angle qui protège la crédibilité",
  "Une intégration validée par la rédaction",
  "Une esthétique immédiatement reconnaissable",
  "Une diffusion pensée pour durer",
];

const flow = [
  { title: "On trouve le point juste", text: "Le sujet, la tension, la raison d'être ensemble." },
  { title: "On choisit le format", text: "Vidéo longue, série, social, newsletter, podcast ou événement." },
  { title: "On produit avec tact", text: "Écriture, tournage, montage et cadre éditorial Origines." },
  { title: "On accompagne la sortie", text: "Diffusion, contexte, relais et lecture de la performance." },
];

const heroActs = [
  {
    code: "01",
    title: "Le sujet",
    text: "Ce que votre marque peut éclairer sans prendre toute la place.",
  },
  {
    code: "02",
    title: "Le cadre",
    text: "La manière juste d'entrer dans un récit Origines.",
  },
  {
    code: "03",
    title: "Le format",
    text: "Vidéo, série, podcast, newsletter ou rencontre : seulement si le format sert l'histoire.",
  },
  {
    code: "04",
    title: "La trace",
    text: "Ce que l'audience garde après avoir vu, lu ou entendu le récit.",
  },
];

const subjectSignals = [
  {
    icon: Eye,
    title: "Ouvrir un accès",
    text: "Un lieu, une archive, une expertise, une personne, un terrain : quelque chose que l'on ne pourrait pas approcher avec la même justesse sans vous.",
  },
  {
    icon: Mic2,
    title: "Porter une tension",
    text: "Transmission, soin, passage, réparation, avenir, mémoire : on part d'un sujet humain déjà présent dans le monde de la marque.",
  },
  {
    icon: Film,
    title: "Laisser une trace",
    text: "Le résultat doit vivre comme un récit Origines : film, article, podcast, rencontre ou série, pas comme une prise de parole qui expire.",
  },
];

const subjectChecks = [
  "Une scène réelle",
  "Une utilité claire",
  "Un accord éditorial visible",
];

const PartnershipsPage: React.FC = () => {
  return (
    <div className={s.page}>
      <SEO
        title="Partenariats - Origines"
        description="Associez votre marque à des récits Origines : formats éditoriaux, séries co-produites, vidéos, podcasts, newsletter et événements."
        url="/partenariats"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Partenariats", url: "/partenariats" },
        ]}
      />

      <SiteHeader />

      <main>
        <div className="v2-container">
          <Breadcrumb
            items={[
              { name: "Accueil", url: "/" },
              { name: "Partenariats", url: "/partenariats" },
            ]}
          />
        </div>

        <section className={s.hero}>
          <div className={s.heroMosaic} aria-hidden="true">
            {heroMosaicImages.map((image, index) => (
              <img
                src={image}
                alt=""
                loading={index < 4 ? "eager" : "lazy"}
                decoding="async"
                key={image}
              />
            ))}
          </div>
          <div className={s.heroInner}>
            <div className={s.heroCopy}>
              <p className={s.kicker}>Origines® · Partenariats</p>
              <h1 className={s.heroTitle}>
                Quelle histoire
                <span>votre marque</span>
                <span>peut-elle porter&nbsp;?</span>
              </h1>
              <p className={s.heroText}>
                Nous ne vendons pas un espace publicitaire. Nous cherchons les marques capables
                d'ouvrir des récits qui méritent d'être transmis, avec une place claire, utile et
                légitime.
              </p>
              <div className={s.heroActions}>
                <Button
                  as="a"
                  href="mailto:partenariats@origines.media?subject=Partenariat%20Origines"
                  variant="gradient"
                  size="lg"
                  rightIcon={ArrowRight}
                  className={s.heroPrimaryButton}
                >
                  Proposer un récit
                </Button>
                <Button
                  as="a"
                  href={DECK_URL}
                  download={DECK_NAME}
                  variant="outline"
                  size="lg"
                  leftIcon={Download}
                  className={s.outlineButton}
                >
                  Télécharger le media kit
                </Button>
              </div>
            </div>

            <Card variant="outlined" size="sm" className={s.heroBrief}>
              <div className={s.briefTop}>
                <span>Question de légitimité</span>
                <small>Réponse en 4 actes</small>
              </div>
              <ol className={s.briefList}>
                {heroActs.map((act) => (
                  <li key={act.code}>
                    <span>{act.code}</span>
                    <div>
                      <strong>{act.title}</strong>
                      <p>{act.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className={s.briefFooter}>
                Chaque section doit répondre à cette question avant de parler de format.
              </p>
            </Card>
          </div>
        </section>

        <section className={s.subject}>
          <div className={s.inner}>
            <div className={s.subjectGrid}>
              <div className={s.subjectCopy}>
                <div className={s.chapter}>ACTE 01 / Le sujet</div>
                <h2>
                  Votre marque n'est pas le sujet. <em>Elle doit ouvrir la scène.</em>
                </h2>
                <p>
                  Un partenariat Origines commence par une question simple : quelle vérité humaine
                  votre marque permet-elle de mieux approcher ? Si elle apporte un accès, un contexte,
                  un geste ou une protection au récit, alors elle devient utile. Si elle demande
                  seulement à être vue, elle n'entre pas dans Origines.
                </p>
              </div>

              <figure className={s.subjectPortrait}>
                <img
                  src="/partnerships/subject-origin.jpg"
                  alt="Portrait éditorial Origines"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  <span>Le test éditorial</span>
                  <p>
                    Si l'histoire perd en profondeur quand on retire la marque, alors elle avait sa
                    place.
                  </p>
                </figcaption>
              </figure>
            </div>

            <div className={s.subjectSignals}>
              {subjectSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <Card variant="outlined" size="sm" className={s.subjectCard} key={signal.title}>
                    <Icon aria-hidden="true" />
                    <h3>{signal.title}</h3>
                    <p>{signal.text}</p>
                  </Card>
                );
              })}
            </div>

            <div className={s.subjectRule}>
              <p>
                On ne construit pas un décor autour d'un logo. On part d'une vérité humaine, puis
                on choisit la marque capable de l'ouvrir sans la déformer.
              </p>
              <div className={s.subjectChecks}>
                {subjectChecks.map((check) => (
                  <span key={check}>
                    <Check aria-hidden="true" />
                    {check}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={s.proof}>
          <div className={s.inner}>
            <div className={s.sectionHead}>
              <div>
                <div className={s.chapter}>ACTE 02 / La place juste</div>
                <h2>
                  Ce que la marque <em>rend possible.</em>
                </h2>
              </div>
              <p>
                Un partenaire ne sert pas à remplir un écran. Il sert à ouvrir une porte, donner un
                contexte, protéger une parole ou prolonger une histoire après sa diffusion.
              </p>
            </div>
            <div className={s.proofGrid}>
              {partnerOpenings.map((opening) => (
                <Card variant="outlined" size="sm" className={s.proofItem} key={opening.label}>
                  <span>{opening.label}</span>
                  <strong>{opening.title}</strong>
                  <p>{opening.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className={s.projection}>
          <div className={s.inner}>
            <div className={s.sectionHead}>
              <div className={s.chapter}>CH.02 / Projection partenaire</div>
              <h2>
                Où votre marque peut-elle <em>prendre place ?</em>
              </h2>
              <p>
                Le bon partenariat ne commence pas par un format. Il commence par une scène mentale :
                une personne, un lieu, une tension, une vérité que votre marque peut aider à porter.
              </p>
            </div>

            <div className={s.worldGrid}>
              {worlds.map((world) => (
                <Card variant="outlined" size="sm" className={s.worldCard} key={world.label}>
                  <p className={s.cardLabel}>{world.label}</p>
                  <h3>{world.title}</h3>
                  <p>{world.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className={s.formats}>
          <div className={s.inner}>
            <div className={s.sectionHead}>
              <div className={s.chapter}>CH.03 / Formats</div>
              <h2>
                Des formats pensés pour être <em>désirés.</em>
              </h2>
              <p>
                Chaque proposition garde la même exigence : la marque est présente parce qu'elle
                ajoute du sens, jamais parce qu'elle interrompt l'histoire.
              </p>
            </div>

            <div className={s.formatGrid}>
              {editorialFormats.map((format) => (
                <Card variant="outlined" size="sm" className={s.formatCard} key={format.code}>
                  <div className={s.formatTop}>
                    <span>{format.code}</span>
                    <Sparkles aria-hidden="true" />
                  </div>
                  <h3>{format.name}</h3>
                  <p>{format.line}</p>
                  <small>{format.scene}</small>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className={s.showcase}>
          <div className={s.inner}>
            <div className={s.showcaseGrid}>
              <div>
                <p className={s.kicker}>Ce que voit l'audience</p>
                <h2>
                  Une histoire Origines. Pas une publicité déguisée.
                </h2>
              </div>
              <div className={s.promiseList}>
                {promises.map((promise) => (
                  <span key={promise}>
                    <Check aria-hidden="true" />
                    {promise}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={s.process}>
          <div className={s.inner}>
            <div className={s.sectionHead}>
              <div className={s.chapter}>CH.04 / Méthode</div>
              <h2>
                De l'intuition au dispositif <em>exact.</em>
              </h2>
              <p>
                Le cadre est premium parce qu'il est sélectif. On refuse ce qui force, on affine ce
                qui tient, on produit seulement quand l'accord éditorial est évident.
              </p>
            </div>
            <div className={s.processGrid}>
              {flow.map((step, index) => (
                <Card variant="outlined" size="sm" className={s.processCard} key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className={s.download}>
          <div className={s.downloadInner}>
            <div>
              <p className={s.kicker}>Media kit</p>
              <h2>
                Ouvrir le dossier <em>partenaires.</em>
              </h2>
              <p>
                La version complète présente l'univers, l'audience, les formats et le cadre de
                collaboration. Pour les projets sur-mesure, parlons directement du sujet.
              </p>
            </div>
            <div className={s.downloadActions}>
              <Button
                as="a"
                href={DECK_URL}
                download={DECK_NAME}
                variant="primary"
                size="lg"
                leftIcon={Download}
                className={s.lightButton}
              >
                Télécharger le PDF
              </Button>
              <Button
                as="a"
                href="mailto:partenariats@origines.media?subject=Partenariat%20Origines"
                variant="outline"
                size="lg"
                rightIcon={Mail}
                className={s.lightOutline}
              >
                partenariats@origines.media
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
};

export default PartnershipsPage;
