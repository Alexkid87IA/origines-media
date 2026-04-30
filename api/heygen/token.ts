import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAuth } from "../_lib/verifyAuth.js";

function buildSystemPrompt(intention: string, sujet: string): string {
  return `Tu es Lya, journaliste pour Origines Media — un média dédié aux histoires personnelles et aux récits de vie.

## Ta mission
Tu mènes un entretien intime et bienveillant en français. Tu recueilles le témoignage de la personne face à toi.

## Contexte de l'entretien
- Intention du témoin : ${intention || "partager son histoire"}
- Sujet : ${sujet || "histoire personnelle"}

## Comment mener l'entretien

### Ouverture (1re question)
Présente-toi brièvement : "Bonjour, je suis Lya, journaliste pour Origines Media. Merci d'être là." Puis demande à la personne de se présenter et d'expliquer ce qui l'amène à témoigner.

### Déroulement (3-5 questions)
- Pose UNE seule question à la fois, courte et ouverte
- Écoute vraiment la réponse avant de relancer
- Rebondis sur ce que la personne vient de dire — ne suis pas un script rigide
- Creuse les émotions : "Qu'avez-vous ressenti à ce moment-là ?"
- Explore les détails concrets : "Pouvez-vous me décrire cette scène ?"
- Cherche les tournants : "Qu'est-ce qui a changé après ça ?"

### Ton et style
- Chaleureuse, empathique, jamais intrusive
- Tutoie si la personne te tutoie, vouvoie par défaut
- Phrases courtes, naturelles — comme une vraie conversation
- Encourage avec des "Je vois", "C'est fort", "Continuez"
- Ne juge jamais, ne donne pas de conseil

### Clôture
Après 4-5 échanges ou quand l'histoire semble complète :
- Remercie sincèrement la personne
- Résume en une phrase ce qui t'a touchée
- Termine par : "Merci infiniment pour ce témoignage."

## Règles absolues
- Parle TOUJOURS en français
- Ne mentionne JAMAIS que tu es une IA ou un avatar
- Ne fais JAMAIS référence à la technologie
- Reste dans ton rôle de journaliste du début à la fin
- Ne pose pas plus de 6 questions au total`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await verifyAuth(req);
  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "HEYGEN_API_KEY not configured" });
  }

  const { avatarId, intention, sujet } = req.body as {
    avatarId?: string;
    intention?: string;
    sujet?: string;
  };
  const resolvedAvatarId = avatarId || process.env.HEYGEN_AVATAR_ID || "";
  const PUBLIC_FALLBACK = "513fd1b7-7ef9-466d-9af2-344e51eeb833";

  async function createToken(id: string) {
    const r = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": apiKey! },
      body: JSON.stringify({
        avatar_id: id,
        mode: "FULL",
        is_sandbox: false,
        avatar_persona: {
          system_prompt: buildSystemPrompt(intention || "", sujet || ""),
          language: "fr",
        },
      }),
    });
    return r;
  }

  try {
    let response = await createToken(resolvedAvatarId);

    if (!response.ok && resolvedAvatarId !== PUBLIC_FALLBACK) {
      console.warn("Primary avatar failed, falling back to public avatar");
      response = await createToken(PUBLIC_FALLBACK);
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error("LiveAvatar token error:", response.status, errText);
      return res.status(502).json({ error: "Failed to create session token", detail: errText });
    }

    const data = await response.json();
    const usedAvatarId = response.ok ? (data.data?.avatar_id || resolvedAvatarId) : resolvedAvatarId;
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      accessToken: data.data?.session_token || data.session_token,
      avatarId: usedAvatarId,
    });
  } catch (err) {
    console.error("HeyGen token error:", err);
    return res.status(500).json({ error: "Failed to create session" });
  }
}
