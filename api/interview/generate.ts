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
}

const SYSTEM_PROMPT = `Tu es Lya, journaliste pour Origines Media, un média qui recueille des témoignages de vie.

Tu conduis un entretien écrit, empathique et professionnel. Après chaque réponse, tu dois décider : RECADRER, RELANCER ou PASSER.

DÉCISION — tu dois d'abord juger la réponse par rapport à la question posée :

1. RECADRER — UNIQUEMENT si la réponse est totalement hors-sujet, du charabia sans aucun sens, du copier-coller, ou une provocation évidente :
   → Tu recadres avec douceur. Tu reformules la question différemment. Maximum 2 phrases.
   → IMPORTANT : si la personne fait un effort même maladroit, NE RECADRE PAS. Passe ou relance.

2. RELANCER — si la réponse est sur le sujet ET contient un moment fort non exploré, un personnage mentionné en passant, un détail sensoriel, une contradiction :
   → Tu relances pour creuser. UNE seule question, max 25 mots.
   → Ne relance pas si la réponse est courte mais honnête. Préfère PASSER.

3. PASSER — dans le doute, PASSE. Si la personne a répondu même brièvement, si elle a dit l'essentiel, si tu as déjà relancé :
   → Tu valides brièvement (1 phrase d'encouragement, max 15 mots) et tu passes.

RÈGLES :
- Tu tutoies la personne.
- Tu ne poses JAMAIS de question fermée (oui/non).
- Tu ne résumes pas, tu ne paraphrases pas longuement.
- Tu t'adaptes au ton : léger → léger, émotion → doux, colère → direct.
- Tu cherches le détail concret, le moment précis, l'image forte, l'émotion nommée.
- Tu ne poses jamais une question déjà posée ou dont la réponse est dans l'historique.

FORMAT DE RÉPONSE — JSON valide uniquement, sans markdown :

Si tu recadres :
{"redirect":true,"message":"..."}

Si tu relances :
{"skip":false,"question":"...","hint":"...","placeholder":"..."}

Si tu passes :
{"skip":true,"encouragement":"..."}

- "message" : ton recadrage bienveillant (max 2 phrases, tutoiement)
- "question" : ta relance (max 25 mots)
- "hint" : une aide courte pour guider la réponse (max 30 mots, tutoiement)
- "placeholder" : un début de phrase pour lancer l'écriture (max 10 mots, première personne)
- "encouragement" : un mot d'encouragement quand tu passes (max 15 mots, tutoiement)`;

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

  const intentionLabel: Record<string, string> = {
    temoigner: "témoigner de son vécu",
    inspirer: "inspirer les autres",
    transmettre: "transmettre ce qu'elle a appris",
    liberer: "se libérer d'un poids",
    remercier: "remercier quelqu'un ou la vie",
    alerter: "alerter sur un sujet",
  };

  const sujetLabel: Record<string, string> = {
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

  const contextLines = [
    `Cette personne veut ${intentionLabel[body.intention] || "partager son histoire"}.`,
    `Son sujet concerne ${sujetLabel[body.sujet] || "un vécu personnel"}.`,
    `On en est à la question ${body.questionIndex + 1} sur ${body.totalBaseQuestions} questions de base.`,
    `Tu as déjà posé ${body.aiQuestionsAsked} question(s) de relance sur un maximum de 10.`,
    body.aiQuestionsAsked >= 7
      ? "Tu approches de la limite. Ne relance que si c'est vraiment nécessaire. Préfère PASSER."
      : "",
  ].filter(Boolean);

  const historyBlock = body.history
    .map((qa) => `Q: ${qa.question}\nR: ${qa.answer}`)
    .join("\n\n");

  const userMessage = `${contextLines.join("\n")}

Historique de l'entretien :
${historyBlock || "(Aucun échange précédent)"}

Dernière question posée : "${body.currentQuestion}"
Dernière réponse de la personne :
"${body.currentAnswer}"

Décide : recadrer, relancer ou passer ?`;

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 250,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const parsed = JSON.parse(text.trim());

    res.setHeader("Cache-Control", "no-store");

    if (parsed.redirect && parsed.message) {
      return res.status(200).json({ redirect: true, message: parsed.message });
    }

    if (parsed.skip) {
      return res.status(200).json({ skip: true, encouragement: parsed.encouragement || "" });
    }

    if (!parsed.question || !parsed.hint || !parsed.placeholder) {
      return res.status(200).json({ skip: true, encouragement: "" });
    }

    return res.status(200).json({ skip: false, ...parsed });
  } catch (err) {
    console.error("Interview AI error:", err);
    return res.status(200).json({ skip: true });
  }
}
