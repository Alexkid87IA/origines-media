import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader/SiteHeader";
import Ticker from "@/components/Ticker/Ticker";
import Marquee from "@/components/Marquee/Marquee";
import Footer2 from "@/components/Footer2";
import ScrollToTopV2 from "@/components/ScrollToTop/ScrollToTopV2";
import SEO from "@/components/SEO";
import VideoRecorder from "@/components/VideoRecorder/VideoRecorder";
import LyaInterviewSession from "@/components/LyaAvatar/LyaInterviewSession";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { sanityFetch } from "@/lib/sanity";
import { VIDEOS_SECTION_QUERY } from "@/lib/queries";
import { useAuth } from "@/contexts/AuthContext";
import { getFirebaseDb, getFirebaseStorage } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Breadcrumb from '@/components/ui/Breadcrumb';
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Compass, Film, HeartHandshake, PenLine, Play, ShieldCheck, Users, Video, type LucideIcon } from "lucide-react";
import s from "./EcrireHistoirePage.module.css";

/* ================================================================
   LYA TYPEWRITER
   ================================================================ */

function AllyaTypewriter({ text, speed = 22 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      if (i >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(id);
      } else {
        setDisplayed(text.slice(0, i));
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span className={s.lyaTypewriter}>
      {displayed}
      {!done && <span className={s.lyaCursor} />}
    </span>
  );
}

/* ================================================================
   TYPES
   ================================================================ */

type StoryFormat = "texte" | "video";
type WriteMode = "simple" | "guide" | "avatar";

interface GuidedAnswer {
  questionId: string;
  question: string;
  answer: string;
}

interface StoryDraft {
  format: StoryFormat;
  writeMode: WriteMode;
  intention: string | null;
  sujet: string | null;
  categoryId: string | null;
  universId: string | null;
  titre: string;
  recit: string;
  prompt1: string;
  prompt2: string;
  prompt3: string;
  guidedAnswers: GuidedAnswer[];
  identite: "anonyme" | "pseudo" | "prenom";
  pseudonyme: string;
  trancheAge: string;
  motDeFin: string;
  videoUrls: string[];
}

interface StoryBridgeStep {
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ImpactReason {
  marker: string;
  title: string;
  desc: string;
  detail: string;
  color: string;
  icon: LucideIcon;
}

interface VideoReassurance {
  title: string;
  desc: string;
  icon: LucideIcon;
}

const STORY_BRIDGE_STEPS: StoryBridgeStep[] = [
  {
    label: "01",
    title: "Trouvez le bon angle",
    description: "On part de votre vécu, puis on clarifie le sujet, l'intention et le format le plus juste.",
    icon: PenLine,
  },
  {
    label: "02",
    title: "Racontez à votre rythme",
    description: "À l'écrit ou face caméra, Allya relance uniquement sur ce que vous venez de partager.",
    icon: Video,
  },
  {
    label: "03",
    title: "Gardez le contrôle",
    description: "Votre témoignage reste relu, ajustable et jamais publié sans validation éditoriale.",
    icon: ShieldCheck,
  },
];

const EMPTY_DRAFT: StoryDraft = {
  format: "texte",
  writeMode: "guide",
  intention: null,
  sujet: null,
  categoryId: null,
  universId: null,
  titre: "",
  recit: "",
  prompt1: "",
  prompt2: "",
  prompt3: "",
  guidedAnswers: [],
  identite: "anonyme",
  pseudonyme: "",
  trancheAge: "",
  motDeFin: "",
  videoUrls: [],
};

/* ================================================================
   GUIDED QUESTIONS ENGINE
   ================================================================ */

interface GuidedQuestion {
  id: string;
  question: string;
  hint: string;
  placeholder: string;
  minRows: number;
  encouragement?: string;
  isAi?: boolean;
}

const CORE_QUESTIONS: GuidedQuestion[] = [
  {
    id: "context",
    question: "Plantez le décor.",
    hint: "Qui êtes-vous ? Quel âge avez-vous ? Décrivez le contexte de votre vie au moment où cette histoire commence.",
    placeholder: "J'avais 28 ans, je vivais à…",
    minRows: 4,
  },
  {
    id: "declencheur",
    question: "Quel a été le déclencheur ?",
    hint: "Quel événement, quelle rencontre, quel moment a tout fait basculer ? Décrivez-le comme si vous y étiez.",
    placeholder: "Tout a commencé quand…",
    minRows: 5,
    encouragement: "C'est souvent le passage le plus intense. Prenez votre temps.",
  },
  {
    id: "ressenti",
    question: "Qu'avez-vous ressenti ?",
    hint: "Décrivez vos émotions brutes, sans filtre. La colère, la joie, la peur, le soulagement — tout ce qui vous a traversé(e).",
    placeholder: "Sur le moment, j'ai ressenti…",
    minRows: 4,
    encouragement: "Vos émotions sont le cœur de votre histoire. Elles toucheront les gens.",
  },
];

const INTENTION_QUESTIONS: Record<string, GuidedQuestion[]> = {
  temoigner: [
    {
      id: "avant-apres",
      question: "Comment étiez-vous avant, et comment êtes-vous maintenant ?",
      hint: "Décrivez la transformation. Qu'est-ce qui a changé dans votre façon de vivre, de penser, d'être au monde ?",
      placeholder: "Avant, je pensais que… Aujourd'hui…",
      minRows: 5,
    },
    {
      id: "invisible",
      question: "Qu'est-ce que les gens ne voient pas ?",
      hint: "Ce qui reste invisible — les efforts, les doutes, les moments difficiles que personne ne soupçonne.",
      placeholder: "Ce que les gens ne savent pas, c'est que…",
      minRows: 4,
    },
  ],
  inspirer: [
    {
      id: "defi",
      question: "Quel a été votre plus grand défi ?",
      hint: "Le moment où tout semblait impossible. Comment avez-vous trouvé la force de continuer ?",
      placeholder: "Le plus dur, c'était…",
      minRows: 5,
    },
    {
      id: "force",
      question: "Où avez-vous puisé votre force ?",
      hint: "Une personne, une croyance, une colère, un rêve — qu'est-ce qui vous a tenu(e) debout ?",
      placeholder: "Ce qui m'a permis de tenir, c'est…",
      minRows: 4,
    },
  ],
  transmettre: [
    {
      id: "lecon",
      question: "Quelle est la leçon que vous avez tirée ?",
      hint: "Ce que cette expérience vous a appris sur vous-même, sur les autres ou sur la vie.",
      placeholder: "J'ai compris que…",
      minRows: 5,
    },
    {
      id: "erreur",
      question: "Quelle erreur ne referiez-vous jamais ?",
      hint: "Ce que vous feriez différemment si c'était à refaire — et pourquoi.",
      placeholder: "Si c'était à refaire, je…",
      minRows: 4,
    },
  ],
  liberer: [
    {
      id: "poids",
      question: "Qu'est-ce que vous portez depuis trop longtemps ?",
      hint: "Ce qui pèse, ce qui étouffe, ce dont vous n'avez peut-être jamais parlé. Cet espace est sûr.",
      placeholder: "Depuis des années, je porte…",
      minRows: 5,
      encouragement: "Il n'y a aucune obligation de tout dire. Mais si ça sort, laissez-le sortir.",
    },
    {
      id: "silence",
      question: "Pourquoi n'en avez-vous jamais parlé ?",
      hint: "La honte, la peur du jugement, la protection d'un proche — qu'est-ce qui vous retenait ?",
      placeholder: "Je n'en ai jamais parlé parce que…",
      minRows: 4,
    },
  ],
  remercier: [
    {
      id: "gratitude",
      question: "À qui ou à quoi voulez-vous dire merci ?",
      hint: "Une personne, un événement, un lieu, une épreuve même — qui vous a fait grandir.",
      placeholder: "Je veux remercier…",
      minRows: 5,
    },
    {
      id: "impact",
      question: "Qu'a changé cette personne ou cet événement dans votre vie ?",
      hint: "L'impact concret au quotidien. Ce qui ne serait pas pareil sans.",
      placeholder: "Sans cela, je n'aurais jamais…",
      minRows: 4,
    },
  ],
  alerter: [
    {
      id: "constat",
      question: "Quel est le problème que vous voyez ?",
      hint: "Ce que vous avez observé ou vécu, et pourquoi ça ne peut plus durer.",
      placeholder: "Ce qui me révolte, c'est…",
      minRows: 5,
    },
    {
      id: "vecu",
      question: "Comment l'avez-vous vécu dans votre chair ?",
      hint: "Pas une opinion — votre expérience personnelle, concrète, incarnée.",
      placeholder: "Dans ma propre vie, ça s'est traduit par…",
      minRows: 4,
    },
  ],
};

const SUJET_QUESTIONS: Record<string, GuidedQuestion> = {
  "sante-corps": {
    id: "sujet-sante",
    question: "Comment votre corps a-t-il changé cette histoire ?",
    hint: "La douleur, la guérison, les limites physiques, le rapport au corps.",
    placeholder: "Mon corps a…",
    minRows: 4,
  },
  "emotions-mental": {
    id: "sujet-mental",
    question: "Comment avez-vous pris soin de vous mentalement ?",
    hint: "Les ressources, les thérapies, les moments de rechute, les victoires.",
    placeholder: "Pour ma santé mentale, j'ai…",
    minRows: 4,
  },
  "famille-relations": {
    id: "sujet-famille",
    question: "Comment vos proches ont-ils réagi ?",
    hint: "Le soutien, l'incompréhension, les silences, les réconciliations.",
    placeholder: "Ma famille / mes proches…",
    minRows: 4,
  },
  "travail-vocation": {
    id: "sujet-travail",
    question: "Quel rôle votre travail a-t-il joué ?",
    hint: "Refuge, source de stress, quête de sens, reconversion.",
    placeholder: "Dans mon parcours professionnel…",
    minRows: 4,
  },
  "identite-origines": {
    id: "sujet-identite",
    question: "Qu'avez-vous découvert sur vos racines ou votre identité ?",
    hint: "L'appartenance, le déracinement, la fierté, les questions sans réponse.",
    placeholder: "En explorant mes origines…",
    minRows: 4,
  },
  "deuil-perte": {
    id: "sujet-deuil",
    question: "Comment vivez-vous l'absence ?",
    hint: "Le manque au quotidien, les rituels, les moments où ça revient.",
    placeholder: "L'absence se manifeste…",
    minRows: 4,
    encouragement: "Il n'y a pas de bonne façon de faire un deuil. Votre façon est la bonne.",
  },
  "renaissance": {
    id: "sujet-renaissance",
    question: "Quel a été le premier signe que tout allait changer ?",
    hint: "Le petit déclic, le premier pas, le moment où vous avez senti que c'était possible.",
    placeholder: "Le premier signe, c'était…",
    minRows: 4,
  },
  "engagement": {
    id: "sujet-engagement",
    question: "Qu'est-ce qui vous pousse à agir ?",
    hint: "L'indignation, l'espoir, un événement personnel — qu'est-ce qui vous met en mouvement ?",
    placeholder: "Ce qui me pousse, c'est…",
    minRows: 4,
  },
  "autre": {
    id: "sujet-autre",
    question: "Qu'est-ce qui rend votre histoire unique ?",
    hint: "Le détail, l'angle, la nuance que personne d'autre ne peut raconter.",
    placeholder: "Ce qui rend mon histoire différente…",
    minRows: 4,
  },
};

const CLOSING_QUESTIONS: GuidedQuestion[] = [
  {
    id: "conseil",
    question: "Que diriez-vous à quelqu'un qui vit la même chose ?",
    hint: "Un conseil, un avertissement, un encouragement — comme si cette personne était en face de vous.",
    placeholder: "Je lui dirais…",
    minRows: 4,
    encouragement: "Ce message peut changer la vie de quelqu'un.",
  },
  {
    id: "mot-fin",
    question: "Un dernier mot ?",
    hint: "Librement — un mot, une phrase, un cri, un merci. Ce qui reste quand on a tout dit.",
    placeholder: "Pour finir…",
    minRows: 3,
  },
];

function buildGuidedQuestions(intention: string | null, sujet: string | null): GuidedQuestion[] {
  const questions: GuidedQuestion[] = [...CORE_QUESTIONS];
  if (intention && INTENTION_QUESTIONS[intention]) {
    questions.push(...INTENTION_QUESTIONS[intention]);
  }
  if (sujet && SUJET_QUESTIONS[sujet]) {
    questions.push(SUJET_QUESTIONS[sujet]);
  }
  questions.push(...CLOSING_QUESTIONS);
  return questions;
}

const LYA_OPENERS: Record<string, { question: string; hint: string; placeholder: string }> = {
  "sante-corps": { question: "Raconte-moi le moment où tu as pris conscience que quelque chose avait changé dans ton corps ou ta santé.", hint: "Replonge dans ce jour précis : où étais-tu, avec qui, qu'as-tu ressenti ?", placeholder: "C'était le jour où..." },
  "emotions-mental": { question: "Il y a un moment précis où tu as senti que tes émotions prenaient le dessus. Raconte-moi ce jour-là.", hint: "Pas besoin de tout expliquer. Décris la scène, ce que tu as ressenti.", placeholder: "Ce jour-là, j'ai senti que..." },
  "famille-relations": { question: "Quel est le souvenir de famille ou de relation qui te revient le plus souvent ?", hint: "Un moment fort, heureux ou douloureux, avec quelqu'un qui compte pour toi.", placeholder: "Je me souviens de..." },
  "travail-vocation": { question: "Quel est le moment où tu as su que c'était ça que tu voulais faire — ou au contraire, que tu devais tout changer ?", hint: "Le déclic, la révélation, ou le ras-le-bol. Raconte la scène.", placeholder: "J'ai compris le jour où..." },
  "identite-origines": { question: "Quel moment de ta vie t'a fait prendre conscience de qui tu es vraiment — de tes origines, de ton identité ?", hint: "Un regard, une parole, un voyage, une découverte. Replonge dans ce moment.", placeholder: "J'ai réalisé que..." },
  "deuil-perte": { question: "Comment as-tu appris la nouvelle ? Raconte-moi ce moment, même si c'est difficile.", hint: "Prends ton temps. Décris ce que tu as vu, entendu, ressenti à cet instant.", placeholder: "Quand j'ai appris..." },
  "renaissance": { question: "Quel est le premier jour où tu as senti que quelque chose de nouveau commençait ?", hint: "Le moment exact où tu as senti le changement. Le lieu, l'heure, ce que tu faisais.", placeholder: "Le premier jour, c'était..." },
  "engagement": { question: "Qu'est-ce qui t'a poussé à t'engager ? Raconte le déclic.", hint: "L'événement, la rencontre ou l'injustice qui t'a fait dire : assez.", placeholder: "J'ai décidé d'agir quand..." },
  "autre": { question: "Raconte-moi le moment qui a tout changé dans ton histoire.", hint: "Ferme les yeux et replonge dans ce jour précis. Décris ce que tu vois.", placeholder: "Tout a commencé quand..." },
};

const VIDEO_LYA_OPENERS: Record<string, { question: string; hint: string }> = {
  "sante-corps": { question: "Dis-moi ton prénom et ce qui t'amène à témoigner aujourd'hui.", hint: "Présente-toi simplement. Pourquoi as-tu décidé de parler de ta santé ou de ton corps ?" },
  "emotions-mental": { question: "Dis-moi ton prénom et ce qui t'amène à témoigner aujourd'hui.", hint: "Présente-toi simplement. Pourquoi as-tu décidé de parler de tes émotions ?" },
  "famille-relations": { question: "Dis-moi ton prénom et ce qui t'amène à témoigner aujourd'hui.", hint: "Présente-toi simplement. Pourquoi as-tu décidé de parler de ta famille ou de tes relations ?" },
  "travail-vocation": { question: "Dis-moi ton prénom et ce qui t'amène à témoigner aujourd'hui.", hint: "Présente-toi simplement. Pourquoi as-tu décidé de parler de ton travail ?" },
  "identite-origines": { question: "Dis-moi ton prénom et ce qui t'amène à témoigner aujourd'hui.", hint: "Présente-toi simplement. Pourquoi as-tu décidé de parler de ton identité ou de tes origines ?" },
  "deuil-perte": { question: "Dis-moi ton prénom et ce qui t'amène à témoigner aujourd'hui.", hint: "Présente-toi simplement. Prends ton temps, il n'y a pas d'urgence." },
  "renaissance": { question: "Dis-moi ton prénom et ce qui t'amène à témoigner aujourd'hui.", hint: "Présente-toi simplement. Pourquoi as-tu décidé de parler de ce nouveau départ ?" },
  "engagement": { question: "Dis-moi ton prénom et ce qui t'amène à témoigner aujourd'hui.", hint: "Présente-toi simplement. Pourquoi as-tu décidé de parler de ton engagement ?" },
  "autre": { question: "Dis-moi ton prénom et ce qui t'amène à témoigner aujourd'hui.", hint: "Présente-toi simplement. Qu'est-ce qui t'a donné envie de prendre la parole ?" },
};

function buildAllyaOpening(sujet: string | null): GuidedQuestion {
  const opener = LYA_OPENERS[sujet || "autre"] || LYA_OPENERS.autre;
  return {
    id: "lya-opening",
    question: opener.question,
    hint: opener.hint,
    placeholder: opener.placeholder,
    minRows: 5,
    isAi: true,
    encouragement: "Allya vous accompagne tout au long de ce récit.",
  };
}

const GUIDED_ENCOURAGEMENTS = [
  "Très bien. Continuez, vous êtes sur la bonne voie.",
  "Merci pour cette honnêteté. La suite va vous plaire.",
  "Chaque réponse enrichit votre histoire. On avance.",
  "Vous écrivez quelque chose de vrai. C'est rare.",
  "Prenez une respiration si vous en avez besoin. Puis continuez.",
  "Votre histoire prend forme. C'est beau.",
  "Plus que quelques questions. Vous y êtes presque.",
];

const INTENTIONS = [
  { id: "temoigner", label: "Témoigner", desc: "Raconter ce que j'ai vécu", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  { id: "inspirer", label: "Inspirer", desc: "Donner de la force aux autres", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { id: "transmettre", label: "Transmettre", desc: "Partager ce que j'ai appris", icon: "M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5V4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z" },
  { id: "liberer", label: "Me libérer", desc: "Mettre des mots sur le silence", icon: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" },
  { id: "remercier", label: "Remercier", desc: "Dire merci à quelqu'un ou à la vie", icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" },
  { id: "alerter", label: "Alerter", desc: "Ouvrir les yeux sur un sujet", icon: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" },
];

const SUJETS = [
  { id: "sante-corps", label: "Ma santé, mon corps", color: "#10B981" },
  { id: "emotions-mental", label: "Mes émotions, ma santé mentale", color: "#EC4899" },
  { id: "famille-relations", label: "Ma famille, mes relations", color: "#F59E0B" },
  { id: "travail-vocation", label: "Mon travail, ma vocation", color: "#8B5CF6" },
  { id: "identite-origines", label: "Mon identité, mes origines", color: "#0EA5E9" },
  { id: "deuil-perte", label: "Un deuil, une perte", color: "#6B7280" },
  { id: "renaissance", label: "Une renaissance, un nouveau départ", color: "#14B8A6" },
  { id: "engagement", label: "Un engagement, une cause", color: "#EF4444" },
  { id: "autre", label: "Autre chose", color: "#0A0A0A" },
];

const VIDEO_QUESTIONS = [
  {
    label: "Présentez-vous et racontez-nous ce qui vous amène ici aujourd'hui.",
    hint: "Dites votre prénom, votre âge si vous le souhaitez, d'où vous venez. Expliquez pourquoi vous avez décidé de témoigner — qu'est-ce qui vous pousse à prendre la parole maintenant ? Prenez votre temps, il n'y a pas de mauvaise réponse.",
  },
  {
    label: "Racontez le moment précis où tout a basculé — le jour, la scène, ce que vous avez ressenti.",
    hint: "Fermez les yeux et replongez dans ce moment. Où étiez-vous ? Avec qui ? Qu'avez-vous vu, entendu, ressenti dans votre corps ? Essayez de décrire la scène comme si vous y étiez encore. Les détails comptent : une odeur, un son, un regard, une phrase.",
  },
  {
    label: "Comment avez-vous traversé cette épreuve ? Qu'est-ce qui vous a aidé — ou au contraire, qu'est-ce qui a manqué ?",
    hint: "Parlez des personnes qui vous ont soutenu, ou de celles qui n'ont pas compris. Racontez les jours difficiles, les doutes, mais aussi les petites victoires. Comment avez-vous trouvé la force de continuer ? Y a-t-il eu un déclic, un tournant ?",
  },
  {
    label: "Qu'est-ce que cette expérience a changé en vous ? Comment êtes-vous différent aujourd'hui ?",
    hint: "Réfléchissez à la personne que vous étiez avant et celle que vous êtes maintenant. Qu'avez-vous appris sur vous-même ? Sur les autres ? Y a-t-il quelque chose que vous voyez différemment aujourd'hui — une valeur, une priorité, une relation ?",
  },
  {
    label: "Quel message aimeriez-vous transmettre à quelqu'un qui traverse la même chose en ce moment ?",
    hint: "Imaginez que cette personne est en face de vous. Qu'auriez-vous aimé entendre quand vous étiez à sa place ? Parlez-lui avec vos mots, avec votre cœur. Un conseil, un encouragement, une vérité que personne ne vous a dite.",
  },
  {
    label: "Y a-t-il quelque chose que vous n'avez jamais dit à voix haute et que vous aimeriez dire maintenant ?",
    hint: "C'est le moment de dire ce qui n'a jamais été dit — à quelqu'un, à vous-même, au monde. Vous pouvez remercier, pardonner, dénoncer, ou simplement poser les mots. Cette vidéo est votre espace. Personne ne vous jugera.",
  },
];

const TRANCHES_AGE = [
  "18-24 ans",
  "25-34 ans",
  "35-44 ans",
  "45-54 ans",
  "55-64 ans",
  "65+ ans",
];

const PROMPTS = [
  { key: "prompt1" as const, label: "Qu'est-ce qui a changé dans votre vie ?" },
  { key: "prompt2" as const, label: "Que diriez-vous à quelqu'un qui vit la même chose ?" },
  { key: "prompt3" as const, label: "Quel mot résume votre parcours ?" },
];

const STEPS_TEXT = ["Bienvenue", "Thématique", "Récit", "Identité", "Relecture"];
const STEPS_VIDEO = ["Bienvenue", "Thématique", "Enregistrement", "Identité", "Relecture"];

/* ================================================================
   HERO + REASSURANCE DATA
   ================================================================ */

const REASSURANCE_REASONS: ImpactReason[] = [
  {
    marker: "Pour l'autre",
    title: "Faire sentir quelqu'un moins seul",
    desc: "Un récit précis peut devenir un point d'appui pour une personne qui traverse la même chose.",
    detail: "Reconnaissance",
    color: "#D64C90",
    icon: HeartHandshake,
  },
  {
    marker: "Pour vous",
    title: "Mettre de l'ordre dans ce vécu",
    desc: "Raconter aide à choisir les mots, distinguer les étapes et retrouver une forme de clarté.",
    detail: "Clarté",
    color: "#7B5CD6",
    icon: Compass,
  },
  {
    marker: "Pour le collectif",
    title: "Nourrir une conversation utile",
    desc: "Votre expérience peut éclairer un sujet que beaucoup vivent sans toujours oser le nommer.",
    detail: "Transmission",
    color: "#2E94B5",
    icon: Users,
  },
  {
    marker: "Avec sécurité",
    title: "Garder la main jusqu'au bout",
    desc: "L'équipe relit, contextualise et ne publie rien sans validation explicite de votre part.",
    detail: "Validation",
    color: "#34A853",
    icon: ShieldCheck,
  },
];

const REASSURANCE_FAQS = [
  { q: "C'est vraiment gratuit ?", a: "Oui, 100% gratuit. Notre mission est de donner la parole à ceux qui ont quelque chose à raconter." },
  { q: "Qui peut participer ?", a: "Tout le monde. Chaque histoire compte, même les plus simples." },
  { q: "Je peux rester anonyme ?", a: "Absolument. Pseudonyme, voix modifiée, visage flouté — vous choisissez." },
  { q: "J'ai le droit de relecture ?", a: "Bien sûr. Vous validez tout avant publication. Rien n'est diffusé sans votre accord." },
  { q: "Mon histoire peut devenir quoi ?", a: "Un article, une vidéo sur nos réseaux, un podcast, voire le début d'un documentaire — selon votre histoire et vos envies." },
  { q: "Et si je change d'avis ?", a: "Vous pouvez vous retirer à tout moment, même après publication." },
];

const VIDEO_REASSURANCE: VideoReassurance[] = [
  {
    title: "Un cadre avant la caméra",
    desc: "On clarifie ce qui peut être dit, ce qui reste hors champ et pourquoi la vidéo est pertinente.",
    icon: ShieldCheck,
  },
  {
    title: "Un montage sans effet facile",
    desc: "Pas de phrase arrachée à son contexte : le récit reste sobre, lisible et digne.",
    icon: Film,
  },
  {
    title: "Une validation avant diffusion",
    desc: "La version finale et le niveau d'identité associé sont validés avec vous avant publication.",
    icon: CheckCircle2,
  },
];

function getAuthErrorCode(error: unknown) {
  return typeof error === "object" && error && "code" in error
    ? String((error as { code?: unknown }).code)
    : "";
}

/* ================================================================
   PAGE
   ================================================================ */

export default function EcrireHistoirePage() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<StoryDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [authGateGoogleLoading, setAuthGateGoogleLoading] = useState(false);
  const [authGateError, setAuthGateError] = useState<string | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [videoBlobs, setVideoBlobs] = useState<Blob[]>([]);
  const [videoQuestionLabels, setVideoQuestionLabels] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [guidedIdx, setGuidedIdx] = useState(0);
  const [dynamicQuestions, setDynamicQuestions] = useState<GuidedQuestion[]>([]);
  const [lyaLoading, setAllyaLoading] = useState(false);
  const [lyaMessage, setAllyaMessage] = useState<{ type: "redirect" | "encouragement"; text: string } | null>(null);
  const [lyaDone, setAllyaDone] = useState(false);
  const isFullGuide = draft.writeMode === "guide";
  const baseQuestions = isFullGuide ? [buildAllyaOpening(draft.sujet)] : buildGuidedQuestions(draft.intention, draft.sujet);
  const guidedQuestions = (() => {
    const merged: GuidedQuestion[] = [...baseQuestions];
    for (const dq of dynamicQuestions) {
      const parentIdx = dq.id.includes("-after-")
        ? merged.findIndex((q) => q.id === dq.id.split("-after-")[1])
        : -1;
      if (parentIdx >= 0) {
        merged.splice(parentIdx + 1, 0, dq);
      } else {
        merged.push(dq);
      }
    }
    return merged;
  })();
  const guidedTextareaRef = useRef<HTMLTextAreaElement>(null);
  const aiCallsRef = useRef(new Set<string>());
  const redirectCountRef = useRef(new Map<string, number>());
  const [sectionVideos, setSectionVideos] = useState<{ _id: string; titre: string; imageUrl?: string; slug: string; duree?: string; verticale?: { nom: string; couleurDominante?: string } }[]>([]);

  const handleAuthGateGoogle = useCallback(async () => {
    let redirecting = false;
    setAuthGateError(null);
    setAuthGateGoogleLoading(true);

    try {
      const mode = await loginWithGoogle();
      redirecting = mode === "redirect";
    } catch (err: unknown) {
      const code = getAuthErrorCode(err);
      if (code !== "auth/popup-closed-by-user" && code !== "auth/redirect-cancelled-by-user") {
        setAuthGateError("Connexion Google impossible pour le moment. Essayez avec l'e-mail, ou réessayez dans quelques instants.");
      }
    } finally {
      if (!redirecting) setAuthGateGoogleLoading(false);
    }
  }, [loginWithGoogle]);

  useEffect(() => {
    (async () => {
      try {
        const videos = (await sanityFetch(VIDEOS_SECTION_QUERY)) as typeof sectionVideos;
        if (videos?.length) setSectionVideos(videos);
      } catch { /* non-blocking */ }
    })();
  }, []);

  // Load draft from Firestore
  useEffect(() => {
    if (!user || draftLoaded) return;
    const loadDraft = async () => {
      try {
        const db = await getFirebaseDb();
        if (!db) return;
        const ref = doc(db, "temoignages-brouillons", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as Partial<StoryDraft>;
          setDraft((prev) => ({ ...prev, ...data }));
        }
      } catch {
        // silently continue with empty draft
      } finally {
        setDraftLoaded(true);
      }
    };
    loadDraft();
  }, [user, draftLoaded]);

  // Auto-save draft
  const saveDraft = useCallback(
    async (data: StoryDraft) => {
      if (!user) return;
      try {
        const db = await getFirebaseDb();
        if (!db) return;
        const ref = doc(db, "temoignages-brouillons", user.uid);
        await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      } catch {
        // silent
      }
    },
    [user]
  );

  const updateDraft = useCallback(
    (patch: Partial<StoryDraft>) => {
      setDraft((prev) => {
        const next = { ...prev, ...patch };
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => saveDraft(next), 1500);
        return next;
      });
    },
    [saveDraft]
  );

  // Word count
  useEffect(() => {
    if (draft.writeMode === "guide") {
      const allText = draft.guidedAnswers.map((a) => a.answer).join(" ");
      setWordCount(allText.trim().split(/\s+/).filter(Boolean).length);
    } else {
      setWordCount(draft.recit.trim().split(/\s+/).filter(Boolean).length);
    }
  }, [draft.recit, draft.guidedAnswers, draft.writeMode]);

  // Submit
  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    setUploadError(null);
    try {
      let videoUrls: string[] = [];

      if (draft.format === "video" && videoBlobs.length > 0) {
        setUploading(true);
        setUploadProgress(0);
        try {
          videoUrls = await uploadVideos(videoBlobs, user.uid);
        } catch (err) {
          console.error("Storage upload failed, skipping video URLs:", err);
          setUploadError("L'envoi des vidéos a échoué. Vérifiez que Firebase Storage est activé.");
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      }

      const resolvedPseudo = draft.pseudonyme || (draft.identite === "prenom" ? user.displayName?.split(" ")[0] || "" : "");
      const db = await getFirebaseDb();
      if (!db) return;
      await addDoc(collection(db, "temoignages-soumissions"), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        ...draft,
        videoUrls,
        videoPending: draft.format === "video" && videoUrls.length === 0,
        pseudonyme: resolvedPseudo,
        status: "en-attente",
        createdAt: serverTimestamp(),
      });
      const draftRef = doc(db, "temoignages-brouillons", user.uid);
      await setDoc(draftRef, { submitted: true, updatedAt: serverTimestamp() });

      // Notify editorial team (fire and forget)
      fetch("/api/interview/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          format: draft.format,
          intention: draft.intention,
          sujet: draft.sujet,
          identite: draft.identite,
          pseudonyme: resolvedPseudo,
          videoCount: videoUrls.length,
          wordCount,
          videoUrls,
        }),
      }).catch(() => {});

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Submit failed:", err);
      setUploadError("Erreur lors de l'envoi. Réessayez.");
      setUploading(false);
    } finally {
      setSaving(false);
    }
  };

  const scrollToTool = () => {
    document.getElementById("outil")?.scrollIntoView({ behavior: "smooth" });
  };

  const goNext = () => {
    saveDraft(draft);
    setStep((s) => Math.min(s + 1, 4));
    scrollToTool();
  };

  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 0));
    scrollToTool();
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return true;
      case 1: return !!draft.intention && !!draft.sujet;
      case 2:
        if (draft.format === "video") return videoBlobs.length > 0;
        if (draft.writeMode === "guide") {
          if (isFullGuide && lyaDone) {
            const answered = draft.guidedAnswers.filter((a) => a.answer.trim().length >= 20);
            return answered.length >= 1;
          }
          const answered = draft.guidedAnswers.filter((a) => a.answer.trim().length >= 20);
          return answered.length >= 3;
        }
        return draft.titre.trim().length >= 5 && draft.recit.trim().length >= 100;
      case 3: return draft.identite === "anonyme" || draft.identite === "prenom" || draft.pseudonyme.trim().length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const handleVideoComplete = useCallback((blobs: Blob[], questions: { label: string }[]) => {
    setVideoBlobs(blobs);
    setVideoQuestionLabels(questions.map((question) => question.label));
    goNext();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVideoCancel = useCallback(() => {
    updateDraft({ format: "texte" });
    setStep(0);
  }, [updateDraft]);

  const handleLyaInterviewComplete = useCallback((blobs: Blob[], transcripts: { question: string; answer: string }[]) => {
    setVideoBlobs(blobs);
    setVideoQuestionLabels(transcripts.map((t) => t.question));
    goNext();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const videoHistoryRef = useRef<{ question: string; answer: string }[]>([]);
  const videoExchangeCount = useRef(0);

  const handleVideoAiRecord = useCallback(async (blob: Blob, questionLabel: string, preflightCtx?: { firstTime: string; availableTime: string; mood: string }): Promise<{ done: boolean; question?: { label: string; hint?: string }; encouragement?: string; transcript?: string }> => {
    const FALLBACK_QUESTION = { label: "Continuez — qu'est-ce qui s'est passé ensuite ?", hint: "Prenez votre temps, racontez la suite." };

    try {
      console.log("[VideoAI] Starting transcription, blob size:", blob.size, "type:", blob.type);

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const payloadSize = base64.length;
      console.log("[VideoAI] Base64 ready, length:", payloadSize, "≈", Math.round(payloadSize / 1024), "KB");

      const jsonBody = JSON.stringify({ audio: base64, mimeType: blob.type });
      console.log("[VideoAI] Sending to /api/interview/transcribe, payload:", Math.round(jsonBody.length / 1024), "KB");

      const transcribeRes = await fetch("/api/interview/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonBody,
      });

      if (!transcribeRes.ok) {
        console.error("[VideoAI] Transcription failed:", transcribeRes.status, await transcribeRes.text().catch(() => ""));
        return { done: false, question: FALLBACK_QUESTION, encouragement: "Problème de transcription — continuez, on réessaie." };
      }
      const { text } = await transcribeRes.json();
      console.log("[VideoAI] Transcription:", text?.slice(0, 80));

      if (!text || text.trim().length < 10) return { done: false, question: { label: "Pouvez-vous développer un peu plus ?", hint: "N'hésitez pas à prendre votre temps." }, transcript: text || "" };

      videoHistoryRef.current.push({ question: questionLabel, answer: text });
      videoExchangeCount.current++;

      const lyaRes = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intention: draft.intention || "temoigner",
          sujet: draft.sujet || "autre",
          history: videoHistoryRef.current,
          currentAnswer: text,
          currentQuestion: questionLabel,
          questionIndex: videoExchangeCount.current - 1,
          totalBaseQuestions: 1,
          aiQuestionsAsked: videoExchangeCount.current,
          fullGuide: true,
          videoMode: true,
          preflightContext: preflightCtx || undefined,
        }),
      });

      if (!lyaRes.ok) {
        console.error("[VideoAI] Generate failed:", lyaRes.status);
        return { done: false, question: FALLBACK_QUESTION, encouragement: "Allya a eu un souci — continuez votre récit." };
      }
      const data = await lyaRes.json();
      console.log("[VideoAI] Allya response:", JSON.stringify(data).slice(0, 300));
      if (data._fallback) console.warn("[VideoAI] FALLBACK used, reason:", data._reason || data._error || "unknown");

      if (data.done) {
        return { done: true, encouragement: data.encouragement || "Merci, j'ai tout ce qu'il faut.", transcript: text };
      }

      if (data.redirect && data.message) {
        return { done: false, question: { label: data.message, hint: "Essayez de répondre autrement." }, transcript: text };
      }

      if (data.question) {
        return { done: false, question: { label: data.question, hint: data.hint || "" }, encouragement: data.encouragement, transcript: text };
      }

      return { done: false, question: FALLBACK_QUESTION, transcript: text };
    } catch (err) {
      console.error("[VideoAI] Error:", err);
      return { done: false, question: FALLBACK_QUESTION, encouragement: "Problème technique — continuez votre récit." };
    }
  }, [draft.intention, draft.sujet]);

  // ── Guided mode helpers ──
  const getGuidedAnswer = useCallback((questionId: string): string => {
    return draft.guidedAnswers.find((a) => a.questionId === questionId)?.answer || "";
  }, [draft.guidedAnswers]);

  const setGuidedAnswer = useCallback((questionId: string, question: string, answer: string) => {
    setDraft((prev) => {
      const existing = prev.guidedAnswers.findIndex((a) => a.questionId === questionId);
      const next = [...prev.guidedAnswers];
      if (existing >= 0) {
        next[existing] = { questionId, question, answer };
      } else {
        next.push({ questionId, question, answer });
      }
      const updated = { ...prev, guidedAnswers: next };
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => saveDraft(updated), 1500);
      return updated;
    });
  }, [saveDraft]);

  const callAllya = useCallback(async (currentQ: GuidedQuestion, currentAnswer: string): Promise<"redirect" | "followup" | "skip" | "done"> => {
    if (currentAnswer.trim().length < 20) return isFullGuide ? "done" : "skip";
    if (!isFullGuide && dynamicQuestions.length >= 10) return "skip";

    const alreadyCalled = aiCallsRef.current.has(currentQ.id);
    aiCallsRef.current.add(currentQ.id);

    setAllyaLoading(true);
    setAllyaMessage(null);

    const history = draft.guidedAnswers
      .filter((a) => a.answer.trim().length > 0 && a.questionId !== currentQ.id)
      .map((a) => ({ question: a.question, answer: a.answer }));

    try {
      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intention: draft.intention || "temoigner",
          sujet: draft.sujet || "autre",
          history,
          currentAnswer,
          currentQuestion: currentQ.question,
          questionIndex: guidedIdx,
          totalBaseQuestions: baseQuestions.length,
          aiQuestionsAsked: dynamicQuestions.length,
          fullGuide: isFullGuide,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        if (data.redirect && data.message) {
          const count = (redirectCountRef.current.get(currentQ.id) || 0) + 1;
          redirectCountRef.current.set(currentQ.id, count);
          if (count <= 2) {
            setAllyaMessage({ type: "redirect", text: data.message });
            aiCallsRef.current.delete(currentQ.id);
            return "redirect";
          }
        }

        if (data.done) {
          if (data.encouragement) {
            setAllyaMessage({ type: "encouragement", text: data.encouragement });
          }
          setAllyaDone(true);
          return "done";
        }

        if (data.encouragement) {
          setAllyaMessage({ type: "encouragement", text: data.encouragement });
        }

        if (!data.skip && data.question && !alreadyCalled) {
          const aiQuestion: GuidedQuestion = {
            id: `lya-${Date.now()}-after-${currentQ.id}`,
            question: data.question,
            hint: data.hint,
            placeholder: data.placeholder,
            minRows: 4,
            isAi: true,
            encouragement: "Allya, votre assistante de rédaction, a une question pour vous.",
          };
          setDynamicQuestions((prev) => [...prev, aiQuestion]);
          return "followup";
        }
      }
      return isFullGuide ? "done" : "skip";
    } catch {
      return isFullGuide ? "done" : "skip";
    } finally {
      setAllyaLoading(false);
    }
  }, [draft.guidedAnswers, draft.intention, draft.sujet, guidedIdx, baseQuestions.length, dynamicQuestions.length, isFullGuide]);

  const guidedGoNext = useCallback(async () => {
    const currentQ = guidedQuestions[guidedIdx];
    const currentAnswer = getGuidedAnswer(currentQ.id);

    if (isFullGuide) {
      if (currentAnswer.trim().length < 20) return;
      const result = await callAllya(currentQ, currentAnswer);
      if (result === "redirect") {
        setTimeout(() => guidedTextareaRef.current?.focus(), 100);
        return;
      }
      if (result === "done") {
        return;
      }
      setTimeout(() => {
        setGuidedIdx((i) => i + 1);
        setTimeout(() => {
          guidedTextareaRef.current?.focus();
          setTimeout(() => setAllyaMessage(null), 4000);
        }, 100);
      }, 50);
      return;
    }

    if (guidedIdx >= guidedQuestions.length - 1) return;

    if (currentAnswer.trim().length >= 20) {
      const result = await callAllya(currentQ, currentAnswer);
      if (result === "redirect") {
        setTimeout(() => guidedTextareaRef.current?.focus(), 100);
        return;
      }
    }

    setGuidedIdx((i) => i + 1);
    setTimeout(() => {
      guidedTextareaRef.current?.focus();
      setTimeout(() => setAllyaMessage(null), 4000);
    }, 100);
  }, [guidedIdx, guidedQuestions, getGuidedAnswer, callAllya, isFullGuide]);

  const guidedGoPrev = useCallback(() => {
    if (guidedIdx > 0) {
      setAllyaMessage(null);
      setGuidedIdx((i) => i - 1);
      setTimeout(() => guidedTextareaRef.current?.focus(), 100);
    }
  }, [guidedIdx]);

  const uploadVideos = async (blobs: Blob[], userId: string): Promise<string[]> => {
    const storage = await getFirebaseStorage();
    if (!storage) throw new Error("Storage unavailable");

    const urls: string[] = [];
    const totalBytes = blobs.reduce((sum, b) => sum + b.size, 0);
    let uploadedBytes = 0;

    for (let i = 0; i < blobs.length; i++) {
      const blob = blobs[i];
      const path = `temoignages-videos/${userId}/${Date.now()}_q${i + 1}.webm`;
      const fileRef = storageRef(storage, path);

      await new Promise<void>((resolve, reject) => {
        const task = uploadBytesResumable(fileRef, blob);
        task.on(
          "state_changed",
          (snap) => {
            const done = uploadedBytes + snap.bytesTransferred;
            setUploadProgress(Math.round((done / totalBytes) * 100));
          },
          reject,
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            urls.push(url);
            uploadedBytes += blob.size;
            resolve();
          }
        );
      });
    }

    return urls;
  };

  // ── Loading state ──
  if (authLoading) {
    return (
      <div className={s.page}>
        <SiteHeader />
        <main className={s.loadingWrap}>
          <div className={s.loadingDot} />
        </main>
        <Footer2 />
      </div>
    );
  }

  // ── Submitted state ──
  if (submitted && user) {
    return (
      <div className={s.page}>
        <SEO title="Récit envoyé" description="Votre témoignage a bien été envoyé. Merci pour votre confiance." url="/ecrire-mon-histoire" noindex />
        <SiteHeader />
        <main>
          <section className={s.successSection}>
            <div className={s.successInner}>
              <div className={s.successIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
              </div>
              <h1 className={s.successTitle}>Merci.</h1>
              {draft.format === "video" ? (
                <p className={s.successDeck}>
                  Votre témoignage vidéo a bien été transmis à notre équipe éditoriale.
                  Nous le visionnerons avec soin et réaliserons un montage professionnel.
                  {" "}<strong>Rien ne sera diffusé sans votre accord explicite.</strong>
                  {" "}Si votre histoire s'y prête, nous pourrons aussi vous proposer de
                  participer à un projet plus ambitieux — podcast, documentaire, série.
                  Vous recevrez un retour sous 7 jours à <strong>{user.email}</strong>.
                </p>
              ) : (
                <p className={s.successDeck}>
                  Votre récit a bien été transmis à notre équipe éditoriale.
                  Nous le lirons avec toute l'attention qu'il mérite.
                  Il pourra être publié sous forme d'article sur Origines, et si votre
                  histoire s'y prête, nous pourrons vous proposer de la développer ensemble —
                  vidéo, podcast, ou projet éditorial.
                  Vous recevrez un retour sous 7 jours à <strong>{user.email}</strong>.
                </p>
              )}
              <div className={s.successActions}>
                <Link to="/temoignages" className={s.successPrimary}>
                  Lire d'autres récits
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
                <Link to="/" className={s.successSecondary}>
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer2 />
        <ScrollToTopV2 />
      </div>
    );
  }

  const featuredVideo = sectionVideos[0];
  const supportingVideos = sectionVideos.slice(1, 7);

  // ── Main page (hero + tool + reassurance) ──
  return (
    <div className={s.page}>
      <SEO
        title="Racontez votre histoire"
        description="Partagez votre parcours et inspirez des milliers de personnes. Écrivez ou filmez votre témoignage — 100% gratuit."
        url="/ecrire-mon-histoire"
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Racontez votre histoire", url: "/ecrire-mon-histoire" },
        ]}
      />
      <Ticker />
      <SiteHeader />

      <main className={s.page}>
        <div className="v2-container">
          <Breadcrumb items={[
            { name: "Accueil", url: "/" },
            { name: "Racontez votre histoire", url: "/ecrire-mon-histoire" },
          ]} />
        </div>

        {/* ════════════════════════════════════════════════
           HERO
           ════════════════════════════════════════════════ */}
        <section className={s.pageHero}>
          <div className={s.pageHeroInner}>
            <div className={s.pageHeroGrid}>
              <div className={s.pageHeroContent}>
                <div className={s.chapterMark}>
                  <span className={s.cNum}>Ch.01</span>
                  <span className={s.cSep}>/</span>
                  <span className={s.cLabel}>Racontez votre histoire</span>
                </div>

                <h1 className={s.pageHeroTitle}>
                  Votre histoire{" "}
                  <em>mérite d'être entendue</em>
                </h1>

                <p className={s.pageHeroDeck}>
                  Vous avez traversé quelque chose d'important ? Partagez votre parcours
                  et inspirez des milliers de personnes qui vivent la même chose.
                  Votre témoignage pourra devenir un article, une vidéo, ou le début
                  d'un projet éditorial.
                </p>

                <a href="#outil" className={s.pageHeroCta}>
                  Commencer mon témoignage
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>

                <div className={s.pageHeroChecks}>
                  <span className={s.pageHeroCheck}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="2.5" width="14" height="14"><path d="M20 6L9 17l-5-5" /></svg>
                    100% gratuit
                  </span>
                  <span className={s.pageHeroCheck}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="2.5" width="14" height="14"><path d="M20 6L9 17l-5-5" /></svg>
                    Anonymat garanti
                  </span>
                  <span className={s.pageHeroCheck}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#34A853" strokeWidth="2.5" width="14" height="14"><path d="M20 6L9 17l-5-5" /></svg>
                    1 000+ histoires
                  </span>
                </div>
              </div>

              <div className={s.pageHeroMedia}>
                <img
                  src="/images/mosaic-origines.webp"
                  alt="Les visages d'Origines Media"
                  className={s.heroMosaic}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <motion.section
          id="story-bridge"
          className={s.heroBridge}
          aria-labelledby="story-bridge-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <div className={s.heroBridgeInner}>
            <div className={s.heroBridgeIntro}>
              <div className={s.heroBridgeMark}>
                <span className={s.heroBridgeMarkNum}>Ch.01 bis</span>
                <span className={s.heroBridgeMarkSep}>/</span>
                <span className={s.heroBridgeMarkLabel}>Espace guidé</span>
              </div>
              <h2 id="story-bridge-title" className={s.heroBridgeTitle}>
                Du vécu brut à un récit <em>clair, sensible, publiable.</em>
              </h2>
              <p className={s.heroBridgeDeck}>
                La suite n'est pas un simple formulaire. C'est un accompagnement éditorial
                qui vous aide à choisir l'angle, préciser les détails importants et garder
                la main sur ce que vous confiez.
              </p>
              <div className={s.heroBridgeSignals} aria-label="Garanties de l'accompagnement">
                <span>Écrit ou vidéo</span>
                <span>Questions adaptées</span>
                <span>Relecture humaine</span>
              </div>
            </div>

            <div className={s.heroBridgeFlow} aria-label="Déroulé de l'accompagnement">
              {STORY_BRIDGE_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <Card
                    key={step.label}
                    variant="outlined"
                    size="md"
                    color="#0A0A0A"
                    className={s.heroBridgeStep}
                  >
                    <div className={s.heroBridgeStepTop}>
                      <span className={s.heroBridgeStepLabel}>{step.label}</span>
                      <span className={s.heroBridgeStepIcon}>
                        <Icon aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className={s.heroBridgeStepTitle}>{step.title}</h3>
                    <p className={s.heroBridgeStepText}>{step.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ════════════════════════════════════════════════
           TOOL AREA
           ════════════════════════════════════════════════ */}
        <section id="outil" className={s.toolSection}>
          {/* ── Wizard ── */}
          {(
            <>
              {/* ── Progress bar ── */}
              <div className={s.progressWrap}>
                <div className={s.progressBar}>
                  <div className={s.progressFill} style={{ width: `${((step + 1) / 5) * 100}%` }} />
                </div>
                <div className={s.progressSteps}>
                  {(draft.format === "video" ? STEPS_VIDEO : STEPS_TEXT).map((label, i) => (
                    <button
                      key={i}
                      className={`${s.progressStep} ${i === step ? s.progressStepActive : ""} ${i < step ? s.progressStepDone : ""}`}
                      onClick={() => { if (i < step) setStep(i); }}
                      disabled={i > step}
                    >
                      <span className={s.progressStepNum}>{i + 1}</span>
                      <span className={s.progressStepLabel}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={s.stageWrap}>

          {/* ════════════════════════════════════════════════
             STEP 0 — Bienvenue
             ════════════════════════════════════════════════ */}
          {step === 0 && (
            <section className={s.welcome}>
              <div className={s.welcomeInner}>
                <span className={s.welcomeKicker}>Racontez votre histoire</span>
                <h2 className={s.welcomeTitle}>
                  Écrivez ou filmez-vous.<br />
                  <em>On s'occupe du reste.</em>
                </h2>
                <p className={s.welcomeDeck}>
                  Votre témoignage pourra devenir un article Origines, une vidéo sur
                  nos réseaux, ou le début d'un projet éditorial plus grand — podcast,
                  documentaire, série. Choisissez simplement le format qui vous convient.
                </p>

                {/* Format choice */}
                <div className={s.formatChoice}>
                  <button
                    className={`${s.formatCard} ${draft.format === "texte" ? s.formatCardActive : ""}`}
                    onClick={() => updateDraft({ format: "texte" })}
                  >
                    <div className={s.formatCardIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <span className={s.formatCardTitle}>Écrire</span>
                    <span className={s.formatCardDesc}>
                      Rédigez votre histoire à votre rythme. Elle pourra devenir un article
                      publié sur Origines.
                    </span>
                    <span className={s.formatCardAction}>
                      {draft.format === "texte" ? "Format sélectionné" : "Choisir ce format"}
                    </span>
                    {draft.format === "texte" && (
                      <span className={s.formatCardCheck}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                    )}
                  </button>
                  <button
                    className={`${s.formatCard} ${draft.format === "video" ? s.formatCardActive : ""}`}
                    onClick={() => updateDraft({ format: "video" })}
                  >
                    <div className={s.formatCardIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M23 7l-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                    </div>
                    <span className={s.formatCardTitle}>Témoigner en vidéo</span>
                    <span className={s.formatCardDesc}>
                      Répondez face caméra à des questions guidées. Notre équipe montera
                      votre témoignage en vidéo professionnelle.
                    </span>
                    <span className={s.formatCardAction}>
                      {draft.format === "video" ? "Format sélectionné" : "Choisir ce format"}
                    </span>
                    {draft.format === "video" && (
                      <span className={s.formatCardCheck}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                    )}
                  </button>
                </div>

                <div className={s.welcomePromises}>
                  {draft.format === "video" ? (
                    <>
                      <div className={s.welcomePromise}>
                        <div className={s.welcomePromiseIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                        </div>
                        <div>
                          <strong>Vidéo stockée en toute sécurité</strong>
                          <span>Votre enregistrement est chiffré et hébergé sur des serveurs sécurisés en Europe. Personne n'y accède sans votre autorisation.</span>
                        </div>
                      </div>
                      <div className={s.welcomePromise}>
                        <div className={s.welcomePromiseIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                        </div>
                        <div>
                          <strong>Montage professionnel</strong>
                          <span>Nos journalistes montent votre témoignage avec soin. Vous validez le résultat final avant toute mise en ligne.</span>
                        </div>
                      </div>
                      <div className={s.welcomePromise}>
                        <div className={s.welcomePromiseIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                        <div>
                          <strong>Publication uniquement avec votre accord</strong>
                          <span>Rien n'est diffusé sans votre consentement explicite. Vous gardez le contrôle total — à chaque étape.</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={s.welcomePromise}>
                        <div className={s.welcomePromiseIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                        <div>
                          <strong>Anonymat garanti</strong>
                          <span>Vous choisissez si votre nom apparaît ou non. Pseudonyme ou anonymat total.</span>
                        </div>
                      </div>
                      <div className={s.welcomePromise}>
                        <div className={s.welcomePromiseIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                        </div>
                        <div>
                          <strong>Sauvegarde automatique</strong>
                          <span>Votre brouillon est sauvegardé à chaque modification. Revenez quand vous voulez.</span>
                        </div>
                      </div>
                      <div className={s.welcomePromise}>
                        <div className={s.welcomePromiseIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>
                        <div>
                          <strong>Relecture avant publication</strong>
                          <span>Rien n'est publié sans votre accord. L'équipe vous contactera avant mise en ligne.</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  rightIcon={ArrowRight}
                  onClick={goNext}
                  className={s.welcomeCta}
                >
                  Continuer avec ce format
                </Button>
              </div>
            </section>
          )}

          {/* ════════════════════════════════════════════════
             STEP 1 — Thématique
             ════════════════════════════════════════════════ */}
          {step === 1 && (
            <section className={s.thematic}>
              <div className={s.stepHeader}>
                <span className={s.stepKicker}>Étape 2 sur 5</span>
                <h2 className={s.stepTitle}>Aidez-nous à comprendre votre <em>histoire.</em></h2>
                <p className={s.stepDeck}>
                  Deux questions rapides pour mieux accompagner votre {draft.format === "video" ? "témoignage" : "récit"}.
                  Il n'y a pas de mauvaise réponse — cliquez simplement sur ce qui vous correspond.
                </p>
              </div>

              {/* Intentions */}
              <div className={s.sectionQuestion}>
                <div className={s.sectionQuestionHeader}>
                  <span className={s.sectionQuestionNum}>1</span>
                  <div>
                    <p className={s.sectionQuestionTitle}>Pourquoi souhaitez-vous raconter ?</p>
                    <p className={s.sectionQuestionHint}>Cliquez sur la case qui vous parle le plus.</p>
                  </div>
                  {draft.intention && (
                    <span className={s.sectionQuestionDone}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                  )}
                </div>
                <div className={s.intentionGrid}>
                  {INTENTIONS.map((item) => {
                    const isActive = draft.intention === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`${s.intentionCard} ${isActive ? s.intentionCardActive : ""}`}
                        onClick={() => updateDraft({ intention: item.id })}
                      >
                        <div className={s.intentionCardIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={item.icon} /></svg>
                        </div>
                        <div className={s.intentionCardText}>
                          <strong>{item.label}</strong>
                          <span>{item.desc}</span>
                        </div>
                        {isActive && (
                          <span className={s.intentionCardCheck}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sujets */}
              <div className={s.sectionQuestion}>
                <div className={s.sectionQuestionHeader}>
                  <span className={s.sectionQuestionNum}>2</span>
                  <div>
                    <p className={s.sectionQuestionTitle}>De quoi ça parle dans votre vie ?</p>
                    <p className={s.sectionQuestionHint}>Choisissez le sujet qui se rapproche le plus de votre vécu.</p>
                  </div>
                  {draft.sujet && (
                    <span className={s.sectionQuestionDone}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                  )}
                </div>
                <div className={s.sujetGrid}>
                  {SUJETS.map((item) => {
                    const isActive = draft.sujet === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`${s.sujetBtn} ${isActive ? s.sujetBtnActive : ""}`}
                        style={{ "--sujet-color": item.color } as React.CSSProperties}
                        onClick={() => updateDraft({ sujet: item.id })}
                      >
                        <span className={s.sujetDot} style={{ background: item.color }} />
                        {item.label}
                        {isActive && (
                          <svg className={s.sujetCheck} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!canProceed() && (draft.intention || draft.sujet) && (
                <p className={s.validationHint}>
                  {!draft.intention ? "Sélectionnez une intention ci-dessus pour continuer." : "Sélectionnez un sujet ci-dessus pour continuer."}
                </p>
              )}

              <div className={s.stepNav}>
                <button className={s.navBack} onClick={goPrev}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  Retour
                </button>
                <button className={s.navNext} onClick={goNext} disabled={!canProceed()}>
                  Continuer
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            </section>
          )}

          {/* ════════════════════════════════════════════════
             STEP 2 — Récit (texte) ou Enregistrement (vidéo)
             ════════════════════════════════════════════════ */}
          {step === 2 && draft.format === "video" && (
            <section className={s.videoStep}>
              <div className={s.stepHeader}>
                <span className={s.stepKicker}>Étape 3 sur 5</span>
                <h2 className={s.stepTitle}>
                  {draft.writeMode === "avatar"
                    ? <>Lya vous <em>interviewe.</em></>
                    : draft.writeMode === "guide"
                      ? <>Allya vous <em>guide.</em></>
                      : <>Enregistrez votre <em>témoignage.</em></>
                  }
                </h2>
                <p className={s.stepDeck}>
                  {draft.writeMode === "avatar"
                    ? "Lya, notre journaliste IA, apparaît en vidéo et vous pose ses questions en direct. Répondez face caméra, naturellement."
                    : draft.writeMode === "guide"
                      ? "Notre journaliste IA Allya vous pose des questions en temps réel, adaptées à votre récit. Répondez face caméra — elle s'occupe du reste."
                      : "6 questions s'affichent à l'écran, une par une. Répondez naturellement, comme si vous parliez à un ami. 2 minutes max par question. Prenez votre temps — les indications sous chaque question sont là pour vous aider."
                  }
                </p>
              </div>

              <div className={s.modeToggle}>
                <button
                  className={`${s.modeBtn} ${draft.writeMode === "avatar" ? s.modeBtnActive : ""}`}
                  onClick={() => updateDraft({ writeMode: "avatar" })}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
                  </svg>
                  Entretien avec Lya
                  <span className={s.modeBadge}>Nouveau</span>
                </button>
                <button
                  className={`${s.modeBtn} ${draft.writeMode === "guide" ? s.modeBtnActive : ""}`}
                  onClick={() => updateDraft({ writeMode: "guide" })}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  Guidé par Allya
                  <span className={s.modeBadge}>IA</span>
                </button>
                <button
                  className={`${s.modeBtn} ${draft.writeMode === "simple" ? s.modeBtnActive : ""}`}
                  onClick={() => updateDraft({ writeMode: "simple" })}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="8" y1="8" x2="16" y2="8" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                    <line x1="8" y1="16" x2="12" y2="16" />
                  </svg>
                  Questions classiques
                </button>
              </div>

              {draft.writeMode === "avatar" && (
                <div className={s.videoLyaPanel}>
                  <div className={s.videoLyaPanelHeader}>
                    <span className={s.videoLyaPanelKicker}>Entretien vidéo avec avatar IA</span>
                    <strong>Lya vous pose ses questions en vidéo, face à face.</strong>
                  </div>
                  <div className={s.videoLyaPanelGrid}>
                    <div className={s.videoLyaPanelItem}>
                      <span>01</span>
                      <p>Lya apparaît à l'écran et vous guide</p>
                    </div>
                    <div className={s.videoLyaPanelItem}>
                      <span>02</span>
                      <p>Questions adaptées en temps réel</p>
                    </div>
                    <div className={s.videoLyaPanelItem}>
                      <span>03</span>
                      <p>Vos réponses sont enregistrées face caméra</p>
                    </div>
                  </div>
                </div>
              )}

              {draft.writeMode === "guide" && (
                <div className={s.videoLyaPanel}>
                  <div className={s.videoLyaPanelHeader}>
                    <span className={s.videoLyaPanelKicker}>Entretien adaptatif</span>
                    <strong>Allya construit la suite à partir de vos réponses.</strong>
                  </div>
                  <div className={s.videoLyaPanelGrid}>
                    <div className={s.videoLyaPanelItem}>
                      <span>01</span>
                      <p>Transcription de chaque prise</p>
                    </div>
                    <div className={s.videoLyaPanelItem}>
                      <span>02</span>
                      <p>Question suivante liée à votre sujet</p>
                    </div>
                    <div className={s.videoLyaPanelItem}>
                      <span>03</span>
                      <p>Reprise possible avant l'envoi</p>
                    </div>
                  </div>
                </div>
              )}

              {draft.writeMode === "avatar" ? (
                <div className={s.videoRecorderWrap}>
                  <LyaInterviewSession
                    context={{ intention: draft.intention || "temoigner", sujet: draft.sujet || "autre" }}
                    openingQuestion={{
                      label: (VIDEO_LYA_OPENERS[draft.sujet || "autre"] || VIDEO_LYA_OPENERS.autre).question,
                      hint: (VIDEO_LYA_OPENERS[draft.sujet || "autre"] || VIDEO_LYA_OPENERS.autre).hint,
                    }}
                    onComplete={handleLyaInterviewComplete}
                    onCancel={handleVideoCancel}
                  />
                </div>
              ) : (
                <div className={s.videoRecorderWrap}>
                  <VideoRecorder
                    key={draft.writeMode}
                    questions={draft.writeMode === "guide"
                      ? [{ label: (VIDEO_LYA_OPENERS[draft.sujet || "autre"] || VIDEO_LYA_OPENERS.autre).question, hint: (VIDEO_LYA_OPENERS[draft.sujet || "autre"] || VIDEO_LYA_OPENERS.autre).hint }]
                      : VIDEO_QUESTIONS}
                    onComplete={handleVideoComplete}
                    onCancel={handleVideoCancel}
                    onAfterRecord={draft.writeMode === "guide" ? handleVideoAiRecord : undefined}
                  />
                </div>
              )}
            </section>
          )}

          {step === 2 && draft.format === "texte" && (
            <section className={s.writing}>
              <div className={s.writingHeader}>
                <span className={s.stepKicker}>Étape 3 sur 5</span>
                <h2 className={s.stepTitle}>
                  {draft.writeMode === "guide" ? <>Racontez, on vous <em>guide.</em></> : <>Écrivez votre <em>récit.</em></>}
                </h2>
                <p className={s.stepDeck}>
                  {draft.writeMode === "guide"
                    ? "Répondez aux questions une par une. Prenez le temps qu'il faut — chaque réponse enrichit votre histoire."
                    : "Page blanche. Pas de règle, pas de format imposé. Écrivez comme ça vient."
                  }
                </p>
              </div>

              {/* Mode toggle */}
              <div className={s.modeToggle}>
                <button
                  className={`${s.modeBtn} ${draft.writeMode === "guide" ? s.modeBtnActive : ""}`}
                  onClick={() => updateDraft({ writeMode: "guide" })}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                  Guidé
                  <span className={s.modeBadge}>Recommandé</span>
                </button>
                <button
                  className={`${s.modeBtn} ${draft.writeMode === "simple" ? s.modeBtnActive : ""}`}
                  onClick={() => updateDraft({ writeMode: "simple" })}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Page libre
                </button>
              </div>

              {/* ── GUIDED MODE ── */}
              {draft.writeMode === "guide" && (() => {
                const q = guidedQuestions[guidedIdx];
                const answeredCount = draft.guidedAnswers.filter((a) => a.answer.trim().length >= 20).length;
                const currentAnswer = getGuidedAnswer(q.id);
                const showEncouragement = guidedIdx > 0 && getGuidedAnswer(guidedQuestions[guidedIdx - 1].id).trim().length >= 20;

                return (
                  <div className={s.guided}>
                    {/* Progress */}
                    <div className={s.guidedProgress}>
                      <div className={s.guidedProgressBar}>
                        <div
                          className={s.guidedProgressFill}
                          style={{ width: `${((guidedIdx + 1) / guidedQuestions.length) * 100}%` }}
                        />
                      </div>
                      <span className={s.guidedProgressLabel}>
                        {guidedIdx + 1} / {guidedQuestions.length}
                        <span className={s.guidedProgressDot} />
                        {answeredCount} réponse{answeredCount > 1 ? "s" : ""} complétée{answeredCount > 1 ? "s" : ""}
                        <span className={s.guidedProgressDot} />
                        {wordCount} mot{wordCount > 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Allya feedback — loading, redirect, encouragement */}
                    {lyaLoading && (
                      <div className={s.lyaBubble}>
                        <div className={s.lyaBubbleBar} />
                        <div className={s.lyaBubbleInner}>
                          <div className={s.lyaAvatarWrap}>
                            <span className={s.lyaAvatar}>A</span>
                            <span className={s.lyaOnline} />
                          </div>
                          <div className={s.lyaBubbleContent}>
                            <span className={s.lyaBubbleName}>Allya <span className={s.lyaBubbleRole}>assistante de rédaction</span></span>
                            <div className={s.lyaDotsWrap}>
                              <span className={s.lyaDot} />
                              <span className={s.lyaDot} />
                              <span className={s.lyaDot} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {!lyaLoading && lyaMessage?.type === "redirect" && (
                      <div className={`${s.lyaBubble} ${s.lyaBubbleRedirect}`}>
                        <div className={s.lyaBubbleBar} />
                        <div className={s.lyaBubbleInner}>
                          <div className={s.lyaAvatarWrap}>
                            <span className={s.lyaAvatar}>A</span>
                            <span className={s.lyaOnline} />
                          </div>
                          <div className={s.lyaBubbleContent}>
                            <span className={s.lyaBubbleName}>Allya <span className={s.lyaBubbleRole}>assistante de rédaction</span></span>
                            <p className={s.lyaBubbleText}>
                              <AllyaTypewriter text={lyaMessage.text} speed={18} />
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {!lyaLoading && lyaMessage?.type === "encouragement" && (
                      <div className={`${s.lyaBubble} ${s.lyaBubbleOk}`}>
                        <div className={s.lyaBubbleBar} />
                        <div className={s.lyaBubbleInner}>
                          <div className={s.lyaAvatarWrap}>
                            <span className={s.lyaAvatar}>A</span>
                            <span className={s.lyaOnline} />
                          </div>
                          <div className={s.lyaBubbleContent}>
                            <span className={s.lyaBubbleName}>Allya <span className={s.lyaBubbleRole}>assistante de rédaction</span></span>
                            <p className={s.lyaBubbleText}>
                              <AllyaTypewriter text={lyaMessage.text} speed={18} />
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {!lyaLoading && !lyaMessage && showEncouragement && (
                      <div className={s.guidedEncouragement}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                          <path d={q.encouragement ? "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" : "M20 6L9 17l-5-5"} />
                        </svg>
                        {q.encouragement || GUIDED_ENCOURAGEMENTS[guidedIdx % GUIDED_ENCOURAGEMENTS.length]}
                      </div>
                    )}

                    {/* Question card */}
                    <div className={`${s.guidedCard} ${q.isAi ? s.guidedCardAi : ""}`} key={q.id}>
                      <div className={s.guidedCardHeader}>
                        <span className={`${s.guidedCardNum} ${q.isAi ? s.guidedCardNumAi : ""}`}>
                          {q.isAi ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                          ) : guidedIdx + 1}
                        </span>
                        <div>
                          {q.isAi && <span className={s.lyaBadge}>Allya - Assistante de rédaction</span>}
                          <h3 className={s.guidedCardQuestion}>{q.question}</h3>
                          <p className={s.guidedCardHint}>{q.hint}</p>
                        </div>
                      </div>
                      <textarea
                        ref={guidedTextareaRef}
                        className={s.guidedCardTextarea}
                        value={currentAnswer}
                        onChange={(e) => setGuidedAnswer(q.id, q.question, e.target.value)}
                        placeholder={q.placeholder}
                        rows={q.minRows}
                      />
                      <div className={s.guidedCardMeta}>
                        <span className={s.guidedCardWordCount}>
                          {currentAnswer.trim().split(/\s+/).filter(Boolean).length} mot{currentAnswer.trim().split(/\s+/).filter(Boolean).length > 1 ? "s" : ""}
                        </span>
                        {currentAnswer.trim().length >= 20 && (
                          <span className={s.guidedCardDone}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12"><path d="M20 6L9 17l-5-5" /></svg>
                            Réponse enregistrée
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question dots */}
                    <div className={s.guidedDots}>
                      {guidedQuestions.map((gq, i) => {
                        const hasAnswer = (draft.guidedAnswers.find((a) => a.questionId === gq.id)?.answer || "").trim().length >= 20;
                        return (
                          <button
                            key={gq.id}
                            className={`${s.guidedDot} ${i === guidedIdx ? s.guidedDotActive : ""} ${hasAnswer ? s.guidedDotDone : ""} ${gq.isAi ? s.guidedDotAi : ""}`}
                            onClick={() => setGuidedIdx(i)}
                            title={gq.question}
                          />
                        );
                      })}
                    </div>

                    {/* Navigation */}
                    <div className={s.guidedNav}>
                      <button
                        className={s.guidedNavBtn}
                        onClick={guidedIdx === 0 ? goPrev : guidedGoPrev}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        {guidedIdx === 0 ? "Retour" : "Précédente"}
                      </button>

                      {isFullGuide ? (
                        lyaDone ? (
                          <button
                            className={`${s.guidedNavBtn} ${s.guidedNavBtnPrimary}`}
                            onClick={goNext}
                            disabled={!canProceed()}
                          >
                            Terminer la rédaction
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            className={`${s.guidedNavBtn} ${s.guidedNavBtnPrimary}`}
                            onClick={guidedGoNext}
                            disabled={lyaLoading || getGuidedAnswer(guidedQuestions[guidedIdx]?.id).trim().length < 20}
                          >
                            {lyaLoading ? "Allya analyse..." : "Envoyer à Allya"}
                            {!lyaLoading && (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                              </svg>
                            )}
                          </button>
                        )
                      ) : guidedIdx < guidedQuestions.length - 1 ? (
                        <button
                          className={`${s.guidedNavBtn} ${s.guidedNavBtnPrimary}`}
                          onClick={guidedGoNext}
                          disabled={lyaLoading}
                        >
                          {lyaLoading ? "Allya analyse..." : "Question suivante"}
                          {!lyaLoading && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                            </svg>
                          )}
                        </button>
                      ) : (
                        <>
                          <button
                            className={`${s.guidedNavBtn} ${s.guidedNavBtnPrimary}`}
                            onClick={goNext}
                            disabled={!canProceed()}
                          >
                            Terminer la rédaction
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </button>
                          {!canProceed() && (
                            <p className={s.guidedHint}>
                              Il faut au moins 3 réponses développées (20 caractères minimum) pour continuer.
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Skip to all */}
                    <div className={s.guidedAllWrap}>
                      <button
                        className={s.guidedAllBtn}
                        onClick={() => {
                          const el = document.getElementById("guided-all");
                          if (el) el.style.display = el.style.display === "none" ? "block" : "none";
                        }}
                      >
                        Voir toutes les questions et réponses
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <div id="guided-all" className={s.guidedAllPanel} style={{ display: "none" }}>
                        {guidedQuestions.map((gq, i) => {
                          const ans = getGuidedAnswer(gq.id);
                          return (
                            <div key={gq.id} className={s.guidedAllItem}>
                              <div className={s.guidedAllItemHeader}>
                                <span className={s.guidedAllItemNum}>{i + 1}</span>
                                <strong>{gq.question}</strong>
                                {ans.trim().length >= 20 && (
                                  <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" width="14" height="14" style={{ marginLeft: "auto", flexShrink: 0 }}>
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                )}
                              </div>
                              <textarea
                                className={s.guidedAllTextarea}
                                value={ans}
                                onChange={(e) => setGuidedAnswer(gq.id, gq.question, e.target.value)}
                                placeholder={gq.placeholder}
                                rows={3}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── SIMPLE MODE ── */}
              {draft.writeMode === "simple" && (
                <>
                  <div className={s.editor}>
                    <div className={s.editorTitleWrap}>
                      <input
                        type="text"
                        className={s.editorTitle}
                        value={draft.titre}
                        onChange={(e) => updateDraft({ titre: e.target.value })}
                        placeholder="Le titre de votre histoire…"
                        maxLength={200}
                      />
                      <span className={s.editorTitleCount}>{draft.titre.length}/200</span>
                    </div>

                    <div className={s.editorBodyWrap}>
                      <textarea
                        className={s.editorBody}
                        value={draft.recit}
                        onChange={(e) => updateDraft({ recit: e.target.value })}
                        placeholder="Commencez à écrire ici…

Prenez le temps qu'il vous faut. Votre brouillon est sauvegardé automatiquement."
                        rows={16}
                      />
                      <div className={s.editorMeta}>
                        <span className={s.editorWordCount}>{wordCount} mot{wordCount > 1 ? "s" : ""}</span>
                        <span className={s.editorAutoSave}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M20 6L9 17l-5-5" /></svg>
                          Brouillon sauvegardé
                        </span>
                      </div>
                    </div>

                    <div className={s.promptsSection}>
                      <p className={s.promptsLabel}>
                        Besoin d'aide pour démarrer ?
                        <span>Ces questions sont optionnelles.</span>
                      </p>
                      {PROMPTS.map((p) => (
                        <div key={p.key} className={s.promptField}>
                          <label className={s.promptQuestion}>{p.label}</label>
                          <textarea
                            className={s.promptInput}
                            value={draft[p.key]}
                            onChange={(e) => updateDraft({ [p.key]: e.target.value })}
                            rows={3}
                            placeholder="Votre réponse…"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Nav — only for simple mode (guided has its own) */}
              {draft.writeMode === "simple" && (
                <>
                  <div className={s.stepNav}>
                    <button className={s.navBack} onClick={goPrev}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                      Retour
                    </button>
                    <button className={s.navNext} onClick={goNext} disabled={!canProceed()}>
                      Continuer
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </button>
                  </div>
                  {!canProceed() && (
                    <p className={s.validationHint}>
                      Le titre doit faire au moins 5 caractères et le récit au moins 100 caractères.
                    </p>
                  )}
                </>
              )}
            </section>
          )}

          {/* ════════════════════════════════════════════════
             STEP 3 — Identité
             ════════════════════════════════════════════════ */}
          {step === 3 && (
            <section className={s.identity}>
              <div className={s.stepHeader}>
                <span className={s.stepKicker}>Étape 4 sur 5</span>
                <h2 className={s.stepTitle}>Comment souhaitez-vous <em>apparaître ?</em></h2>
                <p className={s.stepDeck}>
                  Vous gardez le contrôle total. Rien ne sera publié sans votre accord.
                </p>
              </div>

              <div className={s.identityChoices}>
                {([
                  { value: "anonyme" as const, label: "Anonyme", desc: "Aucune information personnelle ne sera affichée.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
                  { value: "pseudo" as const, label: "Pseudonyme", desc: "Choisissez un nom d'emprunt.", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 110 8 4 4 0 010-8z" },
                  { value: "prenom" as const, label: "Mon prénom", desc: `Apparaîtra comme « ${user?.displayName?.split(" ")[0] || "Prénom"} ».`, icon: "M20 6L9 17l-5-5" },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    className={`${s.identityCard} ${draft.identite === opt.value ? s.identityCardActive : ""}`}
                    onClick={() => {
                      const patch: Partial<StoryDraft> = { identite: opt.value };
                      if (opt.value === "prenom" && !draft.pseudonyme) {
                        patch.pseudonyme = user?.displayName?.split(" ")[0] || "";
                      }
                      updateDraft(patch);
                    }}
                  >
                    <div className={s.identityCardIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={opt.icon} /></svg>
                    </div>
                    <strong>{opt.label}</strong>
                    <span>{opt.desc}</span>
                    {draft.identite === opt.value && (
                      <div className={s.identityCardCheck}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {draft.identite === "pseudo" && (
                <div className={s.pseudoField}>
                  <label className={s.fieldLabel}>Votre pseudonyme</label>
                  <input
                    type="text"
                    className={s.fieldInput}
                    value={draft.pseudonyme}
                    onChange={(e) => updateDraft({ pseudonyme: e.target.value })}
                    placeholder="Ex : Marie L."
                    maxLength={50}
                  />
                </div>
              )}

              {draft.identite === "prenom" && (
                <div className={s.pseudoField}>
                  <label className={s.fieldLabel}>Votre prénom (ou surnom)</label>
                  <input
                    type="text"
                    className={s.fieldInput}
                    value={draft.pseudonyme || user?.displayName?.split(" ")[0] || ""}
                    onChange={(e) => updateDraft({ pseudonyme: e.target.value })}
                    placeholder="Ex : Marie"
                    maxLength={50}
                  />
                </div>
              )}

              <div className={s.optionalFields}>
                <div className={s.optionalField}>
                  <label className={s.fieldLabel}>
                    Tranche d'âge <span className={s.fieldOptional}>(optionnel)</span>
                  </label>
                  <div className={s.ageGrid}>
                    {TRANCHES_AGE.map((t) => (
                      <button
                        key={t}
                        className={`${s.ageBtn} ${draft.trancheAge === t ? s.ageBtnActive : ""}`}
                        onClick={() => updateDraft({ trancheAge: draft.trancheAge === t ? "" : t })}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={s.optionalField}>
                  <label className={s.fieldLabel}>
                    Un mot de la fin ? <span className={s.fieldOptional}>(optionnel)</span>
                  </label>
                  <textarea
                    className={s.fieldTextarea}
                    value={draft.motDeFin}
                    onChange={(e) => updateDraft({ motDeFin: e.target.value })}
                    rows={2}
                    placeholder={draft.format === "video" ? "Un message pour ceux qui verront votre témoignage…" : "Un message pour ceux qui vous liront…"}
                  />
                </div>
              </div>

              <div className={s.stepNav}>
                <button className={s.navBack} onClick={goPrev}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  Retour
                </button>
                <button className={s.navNext} onClick={goNext} disabled={!canProceed()}>
                  Prévisualiser
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </button>
              </div>
            </section>
          )}

          {/* ════════════════════════════════════════════════
             STEP 4 — Relecture & Envoi
             ════════════════════════════════════════════════ */}
          {step === 4 && (
            <section className={s.review}>
              <div className={s.stepHeader}>
                <span className={s.stepKicker}>Étape 5 sur 5</span>
                <h2 className={s.stepTitle}>
                  {draft.format === "video" ? <>Vérifiez votre <em>témoignage.</em></> : <>Relisez votre <em>récit.</em></>}
                </h2>
                <p className={s.stepDeck}>
                  {draft.format === "video"
                    ? "Visionnez vos réponses avant envoi. Vous pouvez revenir en arrière pour ré-enregistrer."
                    : "Voici comment votre témoignage apparaîtra. Vous pouvez revenir en arrière pour modifier n'importe quelle partie."}
                </p>
              </div>

              {draft.format === "video" ? (
                <article className={s.preview}>
                  <div className={s.previewHeader}>
                    {draft.sujet && (
                      <span className={s.previewCat}>
                        <span className={s.previewCatDot} style={{ background: SUJETS.find((x) => x.id === draft.sujet)?.color }} />
                        {SUJETS.find((x) => x.id === draft.sujet)?.label}
                      </span>
                    )}
                    {draft.intention && (
                      <span className={s.previewUnivers}>
                        {INTENTIONS.find((x) => x.id === draft.intention)?.label}
                      </span>
                    )}
                  </div>

                  <h3 className={s.previewTitle}>Témoignage vidéo</h3>

                  <div className={s.previewAuthor}>
                    <span className={s.previewAuthorName}>
                      {draft.identite === "anonyme" ? "Anonyme" : draft.pseudonyme || user?.displayName?.split(" ")[0] || "Anonyme"}
                    </span>
                    {draft.trancheAge && (
                      <>
                        <span className={s.previewDot} />
                        <span>{draft.trancheAge}</span>
                      </>
                    )}
                    <span className={s.previewDot} />
                    <span>{videoBlobs.length} vidéo{videoBlobs.length > 1 ? "s" : ""}</span>
                  </div>

                  <div className={s.previewVideoGrid}>
                    {videoBlobs.map((blob, i) => (
                      <div key={i} className={s.previewVideoItem}>
                        <span className={s.previewVideoLabel}>
                          <span className={s.previewVideoNum}>Q{i + 1}</span>
                          {videoQuestionLabels[i] || VIDEO_QUESTIONS[i]?.label || "Réponse vidéo"}
                        </span>
                        <video
                          className={s.previewVideoPlayer}
                          src={URL.createObjectURL(blob)}
                          controls
                          playsInline
                        />
                      </div>
                    ))}
                  </div>

                  {draft.motDeFin && (
                    <div className={s.previewMotFin}>
                      <em>« {draft.motDeFin} »</em>
                    </div>
                  )}
                </article>
              ) : draft.writeMode === "guide" ? (
                <article className={s.preview}>
                  <div className={s.previewHeader}>
                    {draft.sujet && (
                      <span className={s.previewCat}>
                        <span className={s.previewCatDot} style={{ background: SUJETS.find((x) => x.id === draft.sujet)?.color }} />
                        {SUJETS.find((x) => x.id === draft.sujet)?.label}
                      </span>
                    )}
                    {draft.intention && (
                      <span className={s.previewUnivers}>
                        {INTENTIONS.find((x) => x.id === draft.intention)?.label}
                      </span>
                    )}
                  </div>

                  <h3 className={s.previewTitle}>Témoignage guidé</h3>

                  <div className={s.previewAuthor}>
                    <span className={s.previewAuthorName}>
                      {draft.identite === "anonyme" ? "Anonyme" : draft.pseudonyme || user?.displayName?.split(" ")[0] || "Anonyme"}
                    </span>
                    {draft.trancheAge && (
                      <>
                        <span className={s.previewDot} />
                        <span>{draft.trancheAge}</span>
                      </>
                    )}
                    <span className={s.previewDot} />
                    <span>{wordCount} mots</span>
                  </div>

                  <div className={s.previewPrompts}>
                    {draft.guidedAnswers.filter((a) => a.answer.trim().length > 0).map((a) => (
                      <div key={a.questionId} className={s.previewPrompt}>
                        <strong>{a.question}</strong>
                        {a.answer.split("\n").map((p, i) =>
                          p.trim() ? <p key={i}>{p}</p> : <br key={i} />
                        )}
                      </div>
                    ))}
                  </div>

                  {draft.motDeFin && (
                    <div className={s.previewMotFin}>
                      <em>« {draft.motDeFin} »</em>
                    </div>
                  )}
                </article>
              ) : (
                <article className={s.preview}>
                  <div className={s.previewHeader}>
                    {draft.sujet && (
                      <span className={s.previewCat}>
                        <span className={s.previewCatDot} style={{ background: SUJETS.find((x) => x.id === draft.sujet)?.color }} />
                        {SUJETS.find((x) => x.id === draft.sujet)?.label}
                      </span>
                    )}
                    {draft.intention && (
                      <span className={s.previewUnivers}>
                        {INTENTIONS.find((x) => x.id === draft.intention)?.label}
                      </span>
                    )}
                  </div>

                  <h3 className={s.previewTitle}>{draft.titre || "Sans titre"}</h3>

                  <div className={s.previewAuthor}>
                    <span className={s.previewAuthorName}>
                      {draft.identite === "anonyme" ? "Anonyme" : draft.pseudonyme || user?.displayName?.split(" ")[0] || "Anonyme"}
                    </span>
                    {draft.trancheAge && (
                      <>
                        <span className={s.previewDot} />
                        <span>{draft.trancheAge}</span>
                      </>
                    )}
                    <span className={s.previewDot} />
                    <span>{wordCount} mots</span>
                  </div>

                  <div className={s.previewBody}>
                    {draft.recit.split("\n").map((p, i) =>
                      p.trim() ? <p key={i}>{p}</p> : <br key={i} />
                    )}
                  </div>

                  {(draft.prompt1 || draft.prompt2 || draft.prompt3) && (
                    <div className={s.previewPrompts}>
                      {PROMPTS.map((p) => {
                        const val = draft[p.key];
                        if (!val) return null;
                        return (
                          <div key={p.key} className={s.previewPrompt}>
                            <strong>{p.label}</strong>
                            <p>{val}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {draft.motDeFin && (
                    <div className={s.previewMotFin}>
                      <em>« {draft.motDeFin} »</em>
                    </div>
                  )}
                </article>
              )}

              {uploadError && (
                <div className={s.uploadErrorBanner}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                  {uploadError}
                </div>
              )}

              {uploading ? (
                <div className={s.uploadOverlay}>
                  <h3 className={s.uploadTitle}>Envoi des vidéos en cours…</h3>
                  <div className={s.uploadProgress}>
                    <div className={s.uploadProgressFill} style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span className={s.uploadHint}>{uploadProgress}%</span>
                </div>
              ) : user ? (
                <div className={s.submitSection}>
                  <p className={s.submitNote}>
                    En envoyant votre {draft.format === "video" ? "témoignage" : "récit"}, vous acceptez qu'il soit relu par l'équipe éditoriale
                    d'Origines Media. Rien ne sera publié sans votre accord explicite.
                  </p>
                  <div className={s.submitActions}>
                    <button className={s.navBack} onClick={goPrev}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                      Modifier
                    </button>
                    <button className={s.submitBtn} onClick={handleSubmit} disabled={saving}>
                      {saving ? (
                        <>
                          <span className={s.spinner} />
                          Envoi en cours…
                        </>
                      ) : (
                        <>
                          Envoyer mon {draft.format === "video" ? "témoignage" : "récit"}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className={s.submitAuthPrompt}>
                  <div className={s.submitAuthIcon}>
                    <ShieldCheck aria-hidden="true" />
                  </div>
                  <span className={s.submitAuthKicker}>Dernière étape</span>
                  <h3 className={s.submitAuthTitle}>Créez votre espace pour envoyer ce témoignage.</h3>
                  <p className={s.submitAuthText}>
                    Votre brouillon est prêt. Connectez-vous pour le sauvegarder, l'envoyer à la rédaction
                    et le retrouver ensuite. Rien ne sera publié sans votre accord.
                  </p>
                  {authGateError && <p className={s.authGateError}>{authGateError}</p>}
                  <div className={s.submitAuthActions}>
                    <button className={s.navBack} onClick={goPrev}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                      Modifier
                    </button>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      rightIcon={ArrowRight}
                      isLoading={authGateGoogleLoading}
                      onClick={handleAuthGateGoogle}
                      className={s.authGateGoogleButton}
                    >
                      Créer mon espace avec Google
                    </Button>
                    <Button
                      as="link"
                      to="/inscription"
                      variant="outline"
                      size="lg"
                      color="#F5F5F5"
                      className={s.authGateEmailButton}
                    >
                      Créer avec email
                    </Button>
                  </div>
                  <p className={s.authGateLoginLine}>
                    Déjà membre ? <Link to="/connexion">Se connecter</Link>
                  </p>
                </div>
              )}
            </section>
          )}

              </div>
            </>
          )}
        </section>

        {/* ════════════════════════════════════════════════
           REASSURANCE — Pourquoi partager
           ════════════════════════════════════════════════ */}
        <motion.section
          className={s.reasons}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className={s.reasonsInner}>
            <div className={s.chapterMark}>
              <span className={s.cNum}>{user ? "Ch.02" : "Ch.02"}</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>L'impact</span>
            </div>
            <div className={s.reasonsHeader}>
              <h2 className={s.reasonsTitle}>Ce que votre histoire peut déclencher.</h2>
              <p className={s.reasonsDeck}>
                Pas besoin de promettre des milliards de vues. Une histoire compte
                quand elle aide quelqu'un à reconnaître ce qu'il vit, ou vous aide
                à poser enfin les bons mots.
              </p>
            </div>

            <div className={s.reasonsGrid}>
              {REASSURANCE_REASONS.map((reason, index) => {
                const Icon = reason.icon;
                const toneClass = [s.reasonTonePink, s.reasonTonePurple, s.reasonToneBlue, s.reasonToneGreen][index] || "";
                return (
                  <Card
                    key={reason.marker}
                    variant="outlined"
                    size="md"
                    color={reason.color}
                    className={`${s.reasonCard} ${toneClass}`}
                  >
                    <div className={s.reasonCardTop}>
                      <span className={s.reasonMarker} style={{ color: reason.color }}>
                        {reason.marker}
                      </span>
                      <span className={s.reasonIcon} style={{ color: reason.color }}>
                        <Icon aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className={s.reasonCardTitle}>{reason.title}</h3>
                    <p className={s.reasonCardDesc}>{reason.desc}</p>
                    <span className={s.reasonStatLabel} style={{ color: reason.color }}>
                      <span className={s.reasonStatDot} style={{ backgroundColor: reason.color }} />
                      {reason.detail}
                    </span>
                  </Card>
                );
              })}
            </div>

            <div className={s.reasonsFooter}>
              <p>
                L'objectif n'est pas de surexposer votre histoire. C'est de la rendre juste,
                lisible et utile, avec un cadre clair.
              </p>
              <div className={s.reasonsFooterChecks} aria-label="Cadre de publication">
                <span>Vous choisissez le niveau d'identité</span>
                <span>Vous relisez avant publication</span>
                <span>Vous pouvez retirer votre témoignage</span>
              </div>
            </div>

            <div className={s.reasonsProjects}>
              <span className={s.reasonsProjectsKicker}>Après le témoignage</span>
              <h3>Une histoire peut devenir un projet culturel.</h3>
              <p>
                Certaines histoires ouvrent un monde plus grand qu'un article. Quand le sujet le mérite,
                nous pouvons imaginer avec vous un film, un livre, un podcast ou un documentaire,
                et devenir les coproducteurs patients du projet.
              </p>
              <div className={s.reasonsProjectFormats} aria-label="Formats possibles">
                <span>Cinéma</span>
                <span>Livre</span>
                <span>Podcast</span>
                <span>Documentaire</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ════════════════════════════════════════════════
           REASSURANCE — Vidéos témoignages
           ════════════════════════════════════════════════ */}
        {featuredVideo && (
          <motion.section
            className={s.testimonials}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.5 }}
          >
            <div className={s.testimonialsInner}>
              <div className={s.chapterMark}>
                <span className={s.cNum}>Ch.03</span>
                <span className={s.cSep}>/</span>
                <span className={s.cLabel}>Témoignages vidéo</span>
              </div>

              <div className={s.testimonialsHeader}>
                <div>
                  <span className={s.testimonialsKicker}>Témoignages filmés</span>
                  <h2 className={s.testimonialsTitle}>Des récits filmés avec <em>tact.</em></h2>
                </div>
                <p className={s.testimonialsDeck}>
                  Certaines histoires gagnent à être entendues avec une voix, un visage,
                  des silences. La vidéo n'est proposée que lorsqu'elle rend le récit plus juste.
                </p>
              </div>

              <div className={s.cinemaStage}>
                <Card
                  href={`/video/${featuredVideo.slug}`}
                  variant="outlined"
                  size="md"
                  className={s.featuredVideoCard}
                >
                  <div className={s.featuredVideoFrame}>
                    <img
                      src={featuredVideo.imageUrl || "/placeholder.svg"}
                      alt={featuredVideo.titre}
                      loading="lazy"
                      className={s.featuredVideoImage}
                    />
                    <div className={s.featuredVideoPlay}>
                      <Play aria-hidden="true" />
                    </div>
                    <span className={s.featuredVideoTag}>Récit filmé</span>
                    {featuredVideo.duree && (
                      <span className={s.featuredVideoDuration}>{featuredVideo.duree}</span>
                    )}
                  </div>
                  <div className={s.featuredVideoBody}>
                    <span className={s.featuredVideoEyebrow}>
                      {featuredVideo.verticale?.nom || "Témoignage"}
                    </span>
                    <h3>{featuredVideo.titre}</h3>
                    <p>
                      Le cadre se construit avec la personne : ce qui se dit, ce qui reste
                      hors champ, ce que le montage doit préserver. La vidéo sert le récit,
                      jamais l'inverse.
                    </p>
                  </div>
                </Card>

                <div className={s.videoTrustPanel}>
                  <span className={s.videoTrustKicker}>Notre cadre vidéo</span>
                  {VIDEO_REASSURANCE.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className={s.videoTrustItem}>
                        <span className={s.videoTrustIcon}>
                          <Icon aria-hidden="true" />
                        </span>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {supportingVideos.length > 0 && (
                <div className={s.videoRailWrap}>
                  <div className={s.videoRailHeader}>
                    <span>D'autres récits accompagnés</span>
                    <p>Chaque vidéo garde le même cadre : du contexte, de la pudeur et un accord clair.</p>
                  </div>

                  <div className={s.videoRail}>
                    {supportingVideos.map((v, index) => (
                      <motion.div
                        key={v._id}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.4, delay: index * 0.06 }}
                      >
                        <Card
                          href={`/video/${v.slug}`}
                          variant="outlined"
                          size="md"
                          className={s.videoCard}
                          color={v.verticale?.couleurDominante || "#8B5CF6"}
                        >
                          <div className={s.videoThumb}>
                            <img
                              src={v.imageUrl || "/placeholder.svg"}
                              alt={v.titre}
                              loading="lazy"
                            />
                            <div className={s.videoOverlay} />
                            <div className={s.videoPlayBtn}>
                              <Play aria-hidden="true" />
                            </div>
                            {v.duree && <span className={s.videoDuration}>{v.duree}</span>}
                          </div>
                          <div className={s.videoMeta}>
                            {v.verticale && (
                              <span
                                className={s.videoBadge}
                                style={{ color: v.verticale.couleurDominante || "#8B5CF6" }}
                              >
                                {v.verticale.nom}
                              </span>
                            )}
                            <h3 className={s.videoTitle}>{v.titre}</h3>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className={s.videoGridCta}>
                <Button as="link" to="/videos" variant="primary" size="lg" rightIcon={ArrowRight} className={s.videoGridCtaButton}>
                  Voir toutes les vidéos
                </Button>
              </div>
            </div>
          </motion.section>
        )}

        <motion.section
          className={s.storyCoda}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          aria-label="Conclusion éditoriale"
        >
          <div className={s.storyCodaInner}>
            <span className={s.storyCodaKicker}>Ce qui compte</span>
            <blockquote className={s.storyCodaQuote}>
              “Une histoire n’a pas besoin d’être spectaculaire pour mériter d’être racontée.
              Elle doit seulement être juste.”
            </blockquote>
            <p className={s.storyCodaText}>
              Écrite, filmée ou gardée privée, elle reste la vôtre jusqu’au dernier mot.
            </p>
          </div>
        </motion.section>

        {/* ════════════════════════════════════════════════
           REASSURANCE — FAQ
           ════════════════════════════════════════════════ */}
        <section className={s.faq}>
          <div className={s.faqInner}>
            <div className={s.chapterMark}>
              <span className={s.cNum}>Ch.04</span>
              <span className={s.cSep}>/</span>
              <span className={s.cLabel}>FAQ</span>
            </div>
            <h2 className={s.faqTitle}>Questions <em>fréquentes.</em></h2>

            <div className={s.faqGrid}>
              {REASSURANCE_FAQS.map((faq, i) => (
                <div key={i} className={s.faqCard}>
                  <h3 className={s.faqQuestion}>{faq.q}</h3>
                  <p className={s.faqAnswer}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Marquee />
      </main>

      <Footer2 />
      <ScrollToTopV2 />
    </div>
  );
}
