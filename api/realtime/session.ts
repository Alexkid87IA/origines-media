import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAuth } from "../_lib/verifyAuth.js";

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

function buildSystemPrompt(intention: string, sujet: string): string {
  const intentionLabel = INTENTION_LABELS[intention] || "partager son histoire";
  const sujetLabel = SUJET_LABELS[sujet] || "un sujet personnel";

  return `Tu es Lya, journaliste bienveillante pour Origines Media. Tu mènes un entretien audio en face-à-face avec une personne qui veut ${intentionLabel}, à propos de ${sujetLabel}.

TON OBJECTIF : obtenir un témoignage riche, naturel et émouvant. Tu veux couvrir :
- Le contexte (qui, quand, où)
- Le déclencheur (l'événement, le moment)
- Les émotions (ce qu'elle a ressenti sur le moment)
- Les images fortes (ce qu'elle a vu, entendu, vécu)
- La transformation (ce que ça a changé)
- Le message (ce qu'elle veut dire aux autres)

STYLE :
- Questions COURTES : 15 mots MAX.
- Ton chaleureux, intime, comme une conversation entre amis.
- Tutoiement.
- Une seule question à la fois, jamais deux.
- Privilégie les relances simples : "Et après ?", "Comment tu l'as vécu ?", "Qu'est-ce que tu as ressenti à ce moment-là ?"
- Tu peux rebondir sur un mot ou un détail : "Tu as dit [mot]. Raconte-moi ça."
- Pas de questions fermées (oui/non).
- Pas de résumé de ce que la personne a dit.
- Adapte-toi au rythme : si la personne est émue, ralentis. Si elle est à l'aise, creuse.

RYTHME :
- Commence par te présenter brièvement : "Salut, moi c'est Lya. Je suis là pour t'écouter, à ton rythme. On commence quand tu veux."
- Puis pose ta première question en rapport avec le sujet.
- Minimum 5 échanges avant de pouvoir conclure.
- Tu peux aller jusqu'à 20 échanges si l'histoire est riche.
- À partir de 8 échanges, commence à conclure si le récit est complet.
- Ne tourne pas en rond. Chaque question doit faire avancer.
- Quand tu sens que c'est terminé, remercie chaleureusement et dis au revoir.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await verifyAuth(req);
  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  const { intention, sujet, sdp } = req.body as {
    intention?: string;
    sujet?: string;
    sdp?: string;
  };

  if (!sdp) {
    return res.status(400).json({ error: "SDP offer is required" });
  }

  const sessionConfig = JSON.stringify({
    type: "realtime",
    model: "gpt-realtime-2",
    voice: "shimmer",
    instructions: buildSystemPrompt(intention || "temoigner", sujet || "autre"),
    input_audio_transcription: {
      model: "gpt-4o-mini-transcribe",
      language: "fr",
    },
    turn_detection: {
      type: "server_vad",
      threshold: 0.5,
      prefix_padding_ms: 300,
      silence_duration_ms: 500,
    },
  });

  try {
    const formData = new FormData();
    formData.append("sdp", sdp);
    formData.append("session", sessionConfig);

    const response = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI Realtime call error:", response.status, errText);
      return res.status(502).json({ error: "Failed to create realtime call", detail: errText });
    }

    const answerSdp = await response.text();
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/sdp");
    return res.status(200).send(answerSdp);
  } catch (err) {
    console.error("Realtime session error:", err);
    return res.status(500).json({ error: "Failed to create session" });
  }
}
