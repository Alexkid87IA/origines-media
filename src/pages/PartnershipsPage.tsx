// src/pages/PartnershipsPage.tsx

import React from "react";
import { ArrowRight, Check, Download, Eye, Film, Mail, Mic2 } from "lucide-react";
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
  "/partnerships/hero/portrait-01.webp",
  "/partnerships/hero/portrait-02.webp",
  "/partnerships/hero/portrait-06.webp",
  "/partnerships/hero/portrait-04.webp",
  "/partnerships/hero/portrait-05.webp",
  "/partnerships/hero/portrait-07.webp",
  "/partnerships/hero/portrait-08.webp",
  "/partnerships/hero/portrait-09.webp",
  "/partnerships/hero/portrait-03.webp",
  "/partnerships/hero/portrait-10.webp",
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
    name: "Épisode présenté",
    line: "Une histoire existe déjà. Votre marque lui donne accès, contexte ou visibilité sans en devenir le sujet.",
    scene: "Pour ouvrir un portrait, un témoignage ou une conversation de société avec une place lisible.",
  },
  {
    code: "02",
    name: "Série éditoriale",
    line: "Un territoire légitime devient une collection : plusieurs récits, un même fil, une esthétique identifiable.",
    scene: "Pour explorer un thème dans la durée : transmission, soin, mémoire, corps, famille, avenir.",
  },
  {
    code: "03",
    name: "Geste intégré",
    line: "Un lieu, un objet, une archive ou une expertise entre dans la scène parce qu'il rend le récit plus précis.",
    scene: "Pour une présence subtile, nommée, utile : jamais un placement plaqué.",
  },
  {
    code: "04",
    name: "Rendez-vous vivant",
    line: "Le récit sort de l'écran : projection, rencontre, tournage ouvert, masterclass ou conversation privée.",
    scene: "Pour devenir hôte d'un moment éditorial, pas sponsor d'un affichage.",
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
  "Le sujet reste devant",
  "Le rôle de la marque est nommé",
  "La rédaction garde la main",
  "Chaque format a une raison d'exister",
];

const flow = [
  { title: "Question", text: "Quelle histoire votre marque permet-elle vraiment d'approcher ?" },
  { title: "Cadre", text: "On définit la place, les limites et ce que l'audience doit comprendre." },
  { title: "Production", text: "Écriture, image, montage et diffusion restent au service du récit." },
  { title: "Trace", text: "On pense ce qui reste après la sortie : article, film, rencontre, série ou archive." },
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
  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");

    if (!hash) {
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
    });
  }, []);

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
                  src="/partnerships/subject-origin.webp"
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

        <section className={s.formats} id="formats">
          <div className={s.inner}>
            <div className={s.sectionHead}>
              <div>
                <div className={s.chapter}>CH.03 / Formats</div>
                <h2>
                  D'abord le récit. <em>Ensuite le format.</em>
                </h2>
              </div>
              <p>
                On ne part pas d'un inventaire média. On part d'un récit à protéger, puis on choisit
                la forme qui lui donne le plus de force.
              </p>
            </div>

            <div className={s.formatStudio}>
              <Card variant="outlined" size="sm" className={s.formatManifesto}>
                <p className={s.cardLabel}>Studio éditorial</p>
                <h3>Un récit peut devenir plusieurs objets. Jamais plusieurs placements.</h3>
                <p>
                  Une vidéo peut ouvrir un dossier. Un article peut préparer une rencontre. Une
                  série peut devenir un podcast, un film ou un livre. Le format est choisi parce
                  qu'il prolonge l'histoire, pas parce qu'il remplit un plan média.
                </p>
                <div className={s.formatGuards}>
                  {promises.map((promise) => (
                    <span key={promise}>{promise}</span>
                  ))}
                </div>
              </Card>

              <div className={s.formatList}>
                {editorialFormats.map((format) => (
                  <Card variant="outlined" size="sm" className={s.formatRow} key={format.code}>
                    <span>{format.code}</span>
                    <div>
                      <h3>{format.name}</h3>
                      <p>{format.line}</p>
                    </div>
                    <small>{format.scene}</small>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={s.showcase} id="place-partenaire">
          <div className={s.inner}>
            <div className={s.showcaseGrid}>
              <div className={s.showcaseCopy}>
                <p className={s.kicker}>Ce que voit l'audience</p>
                <h2>
                  Une marque présente, mais jamais au premier plan.
                </h2>
                <p>
                  L'audience doit sentir une cohérence avant de voir une opération. Si la présence
                  du partenaire rend le récit plus clair, plus incarné ou plus durable, elle devient
                  acceptable. Sinon, elle disparaît.
                </p>
              </div>

              <Card variant="outlined" size="sm" className={s.showcaseFrame}>
                <div className={s.storyStrip} aria-hidden="true">
                  {heroMosaicImages.slice(0, 4).map((image) => (
                    <img src={image} alt="" loading="lazy" decoding="async" key={image} />
                  ))}
                </div>
                <blockquote>
                  « La bonne place d'une marque n'est pas de signer l'histoire. C'est de permettre
                  qu'elle existe mieux. »
                </blockquote>
                <div className={s.promiseList}>
                  {promises.map((promise) => (
                    <span key={promise}>
                      <Check aria-hidden="true" />
                      {promise}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className={s.process} id="methode">
          <div className={s.inner}>
            <div className={s.sectionHead}>
              <div>
                <div className={s.chapter}>CH.04 / Méthode</div>
                <h2>
                  Une méthode courte. <em>Un cadre exigeant.</em>
                </h2>
              </div>
              <p>
                On avance vite quand la place est juste. Le travail consiste à enlever ce qui force,
                préciser ce qui sert le récit, puis produire avec une exigence de média.
              </p>
            </div>
            <div className={s.processTrack}>
              {flow.map((step, index) => (
                <Card variant="outlined" size="sm" className={s.processStep} key={step.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                  <small>{index === 0 ? "Point de départ" : "Validation éditoriale"}</small>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className={s.download} id="media-kit">
          <div className={s.downloadInner}>
            <Card variant="outlined" size="sm" className={s.downloadPreview}>
              <img
                src="/origines-partenariats-preview.webp"
                alt="Aperçu du media kit partenariats Origines"
                loading="lazy"
                decoding="async"
              />
            </Card>
            <div className={s.downloadCopy}>
              <p className={s.kicker}>Media kit</p>
              <h2>
                Ouvrir le dossier <em>partenaires.</em>
              </h2>
              <p>
                Le PDF sert de point d'entrée. Le vrai sujet se construit ensuite à deux : quelle
                histoire peut-on porter, avec quelle place, et quelle trace veut-on laisser ?
              </p>
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
                  Télécharger le media kit
                </Button>
                <Button
                  as="a"
                  href="mailto:partenariats@origines.media?subject=Partenariat%20Origines"
                  variant="outline"
                  size="lg"
                  rightIcon={Mail}
                  className={s.lightOutline}
                >
                  Écrire à l'équipe
                </Button>
              </div>
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
