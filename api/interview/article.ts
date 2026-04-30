import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAuth } from "../_lib/verifyAuth.js";

interface QAPair {
  question: string;
  answer: string;
}

interface RequestBody {
  intention: string;
  sujet: string;
  history: QAPair[];
  prenom: string;
}

const SYSTEM_PROMPT = `Tu es rédacteur pour Origines Media. Tu écris un article narratif à la première personne à partir d'un entretien.

STYLE :
- Première personne (le narrateur EST la personne interviewée)
- Ton intime, sincère, littéraire mais accessible
- Structure en paragraphes courts, pas de titres ni de sous-titres
- 800 à 1500 mots
- Tu ne résumes PAS les réponses — tu racontes une HISTOIRE cohérente
- Tu utilises les détails concrets, les émotions, les images données dans les réponses
- Tu peux réorganiser chronologiquement
- Pas de moralisation, pas de conclusion bateau
- Le lecteur doit avoir l'impression de lire un récit publié dans un magazine

FORMAT :
- JSON valide uniquement, sans markdown
- {"titre": "...", "chapeau": "...", "article": "..."}
- titre : percutant, 6-12 mots, qui donne envie de lire (pas de guillemets)
- chapeau : 1-2 phrases d'accroche (pas de spoiler)
- article : le récit complet en texte brut (sauts de ligne avec \\n\\n entre paragraphes)`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await verifyAuth(req);
  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const body = req.body as RequestBody;
  if (!body.history || body.history.length < 3) {
    return res.status(400).json({ error: "Not enough content" });
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

  const historyBlock = body.history
    .filter((qa) => qa.answer.trim().length > 0)
    .map((qa) => `Q: ${qa.question}\nR: ${qa.answer}`)
    .join("\n\n");

  const userMessage = `Écris un article narratif à partir de cet entretien.

La personne s'appelle ${body.prenom || "cette personne"}.
Elle voulait ${intentionLabel[body.intention] || "partager son histoire"}.
Son sujet concerne ${sujetLabel[body.sujet] || "un vécu personnel"}.

Entretien complet :
${historyBlock}

Écris l'article maintenant. JSON uniquement.`;

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = JSON.parse(text.trim());

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Article generation error:", err);
    return res.status(500).json({ error: "Generation failed" });
  }
}
