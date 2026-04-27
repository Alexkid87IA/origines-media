import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";

interface QAPair {
  question: string;
  answer: string;
}

interface RequestBody {
  intention: string;
  sujet: string;
  history: QAPair[];
  currentAnswer: string;
  currentQuestion: string;
  questionIndex: number;
  totalBaseQuestions: number;
  aiQuestionsAsked: number;
  fullGuide?: boolean;
}

const SYSTEM_PROMPT_ASSIST = `Tu es Lya, assistante de rédaction pour Origines Media, un média qui recueille des témoignages de vie.

Tu accompagnes la personne dans l'écriture de son histoire, avec bienveillance et naturel. Après chaque réponse, tu dois décider : RECADRER, RELANCER ou PASSER.

DÉCISION :

1. RECADRER — UNIQUEMENT si la réponse est totalement hors-sujet, du charabia sans aucun sens, du copier-coller, ou une provocation évidente :
   → Tu recadres avec douceur. Tu reformules la question différemment. Maximum 2 phrases.
   → IMPORTANT : si la personne fait un effort même maladroit, NE RECADRE PAS. Passe ou relance.

2. RELANCER — si la réponse contient un moment fort non exploré, un personnage mentionné en passant, un détail sensoriel, une contradiction :
   → Tu relances pour creuser. UNE seule question, max 25 mots.

3. PASSER — dans le doute, PASSE. Si la personne a répondu même brièvement :
   → Tu valides brièvement (1 phrase d'encouragement, max 15 mots) et tu passes.

RÈGLES :
- Tu tutoies la personne.
- Tu ne poses JAMAIS de question fermée (oui/non).
- Tu ne résumes pas, tu ne paraphrases pas longuement.
- Tu t'adaptes au ton : léger → léger, émotion → doux, colère → direct.
- Tu ne poses jamais une question déjà posée ou dont la réponse est dans l'historique.

FORMAT — JSON valide uniquement :
Si tu recadres : {"redirect":true,"message":"..."}
Si tu relances : {"skip":false,"question":"...","hint":"...","placeholder":"..."}
Si tu passes : {"skip":true,"encouragement":"..."}`;

const SYSTEM_PROMPT_FULLGUIDE = `Tu es Lya, assistante de rédaction pour Origines Media. Tu conduis un entretien complet pour écrire l'histoire de cette personne.

TON OBJECTIF : obtenir assez de matière pour écrire un article narratif émouvant et captivant. Tu dois couvrir :
- Le contexte (qui, quand, où)
- Le déclencheur (qu'est-ce qui s'est passé)
- Les émotions (ce que la personne a ressenti)
- Les détails sensoriels (ce qu'elle a vu, entendu, senti)
- L'impact (ce que ça a changé)
- Le message (ce qu'elle veut transmettre)

APRÈS CHAQUE RÉPONSE, tu décides :

1. RECADRER — si la réponse est du charabia ou n'a aucun sens :
   → {"redirect":true,"message":"..."} (max 2 phrases bienveillantes)

2. QUESTION SUIVANTE — tu poses ta prochaine question pour avancer dans l'histoire :
   → {"skip":false,"question":"...","hint":"...","placeholder":"..."}
   → La question doit être ouverte, max 25 mots, et faire avancer le récit
   → Le hint aide la personne (max 30 mots)
   → Le placeholder commence la phrase (max 10 mots, première personne)

3. TERMINER — quand tu as assez de matière pour un bel article (minimum 6-8 échanges riches) :
   → {"done":true,"encouragement":"..."}
   → N'utilise DONE que si tu as couvert au moins le contexte, le déclencheur, les émotions et l'impact.

RÈGLES :
- Tu tutoies.
- Jamais de question fermée.
- Tu ne résumes pas ce que la personne a dit.
- Tu t'adaptes au ton.
- Chaque question doit faire avancer l'histoire, pas tourner en rond.
- Ne reviens pas sur un sujet déjà bien couvert.
- Tu cherches le détail concret, le moment précis, l'image forte.

FORMAT — JSON valide uniquement, sans markdown.`;

const INTENTION_LABELS: Record<string, string> = {
  temoigner: "témoigner de son vécu",
  inspirer: "inspirer les autres",
  transmettre: "transmettre ce qu'elle a appris",
  liberer: "se libérer d'un poids",
  remercier: "remercier quelqu'un ou la vie",
  alerter: "alerter sur un sujet",
};

const SUJET_LABELS: Record<string, string> = {
  "sante-corps": "sa santé ou son corps",
  "emotions-mental": "ses émotions ou sa santé mentale",
  "famille-relations": "sa famille ou ses relations",
  "travail-vocation": "son travail ou sa vocation",
  "identite-origines": "son identité ou ses origines",
  "deuil-perte": "un deuil ou une perte",
  renaissance: "une renaissance ou un nouveau départ",
  engagement: "un engagement ou une cause",
  autre: "un sujet personnel",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const body = req.body as RequestBody;
  if (!body.currentAnswer || body.currentAnswer.trim().length < 20) {
    return res.status(200).json({ skip: true });
  }

  const isFullGuide = body.fullGuide === true;
  const systemPrompt = isFullGuide ? SYSTEM_PROMPT_FULLGUIDE : SYSTEM_PROMPT_ASSIST;

  const contextLines = [
    `Cette personne veut ${INTENTION_LABELS[body.intention] || "partager son histoire"}.`,
    `Son sujet concerne ${SUJET_LABELS[body.sujet] || "un vécu personnel"}.`,
  ];

  if (isFullGuide) {
    contextLines.push(`Nombre d'échanges jusqu'ici : ${body.history.length}.`);
    if (body.history.length >= 10) {
      contextLines.push("Tu as beaucoup de matière. Termine bientôt si le récit est complet.");
    }
    if (body.history.length >= 14) {
      contextLines.push("MAXIMUM ATTEINT. Tu DOIS terminer avec done:true.");
    }
  } else {
    contextLines.push(`Question ${body.questionIndex + 1} sur ${body.totalBaseQuestions}.`);
    contextLines.push(`${body.aiQuestionsAsked} relance(s) posée(s) sur max 10.`);
    if (body.aiQuestionsAsked >= 7) {
      contextLines.push("Approche de la limite. Préfère PASSER.");
    }
  }

  const historyBlock = body.history
    .map((qa) => `Q: ${qa.question}\nR: ${qa.answer}`)
    .join("\n\n");

  const userMessage = `${contextLines.join("\n")}

Historique :
${historyBlock || "(Aucun échange précédent)"}

Dernière question : "${body.currentQuestion}"
Réponse :
"${body.currentAnswer}"

${isFullGuide ? "Décide : recadrer, poser la question suivante, ou terminer ?" : "Décide : recadrer, relancer ou passer ?"}`;

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text.trim());

    res.setHeader("Cache-Control", "no-store");

    if (parsed.redirect && parsed.message) {
      return res.status(200).json({ redirect: true, message: parsed.message });
    }

    if (parsed.done) {
      return res.status(200).json({ done: true, encouragement: parsed.encouragement || "" });
    }

    if (parsed.skip) {
      return res.status(200).json({ skip: true, encouragement: parsed.encouragement || "" });
    }

    if (!parsed.question || !parsed.hint || !parsed.placeholder) {
      return res.status(200).json(isFullGuide ? { done: true, encouragement: "" } : { skip: true, encouragement: "" });
    }

    return res.status(200).json({ skip: false, ...parsed });
  } catch (err) {
    console.error("Interview AI error:", err);
    return res.status(200).json(isFullGuide ? { done: true } : { skip: true });
  }
}
