import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAuth } from "../_lib/verifyAuth.js";

interface NotifyBody {
  userId: string;
  userEmail: string;
  userName: string;
  format: "texte" | "video";
  intention: string;
  sujet: string;
  identite: string;
  pseudonyme: string;
  videoCount: number;
  wordCount: number;
  videoUrls: string[];
}

const INTENTION_LABELS: Record<string, string> = {
  temoigner: "Témoigner",
  inspirer: "Inspirer",
  transmettre: "Transmettre",
  liberer: "Se libérer",
  remercier: "Remercier",
  alerter: "Alerter",
};

const SUJET_LABELS: Record<string, string> = {
  "sante-corps": "Santé / Corps",
  "emotions-mental": "Émotions / Santé mentale",
  "famille-relations": "Famille / Relations",
  "travail-vocation": "Travail / Vocation",
  "identite-origines": "Identité / Origines",
  "deuil-perte": "Deuil / Perte",
  renaissance: "Renaissance",
  engagement: "Engagement / Cause",
  autre: "Autre",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await verifyAuth(req);
  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const brevoKey = process.env.BREVO_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL || "alex@origines.media";

  const body = req.body as NotifyBody;

  const displayName =
    body.identite === "anonyme"
      ? "Anonyme"
      : body.pseudonyme || body.userName || "Inconnu";

  const videoLinksHtml = body.videoUrls
    .map(
      (url, i) =>
        `<li><a href="${url}" style="color:#8B5CF6;">Télécharger vidéo Q${i + 1}</a></li>`
    )
    .join("\n");

  const subject =
    body.format === "video"
      ? `🎥 Nouveau témoignage vidéo — ${displayName}`
      : `✍️ Nouveau récit — ${displayName}`;

  const htmlContent = `
<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#0A0A0A;">
  <div style="padding:32px 0;border-bottom:2px solid #0A0A0A;">
    <h1 style="font-size:24px;font-weight:800;margin:0;">Nouveau témoignage reçu</h1>
  </div>

  <table style="width:100%;margin:24px 0;font-size:14px;line-height:1.6;">
    <tr><td style="padding:8px 0;color:#6B7280;width:140px;">Format</td><td style="padding:8px 0;font-weight:600;">${body.format === "video" ? "🎥 Vidéo" : "✍️ Texte"}</td></tr>
    <tr><td style="padding:8px 0;color:#6B7280;">Identité</td><td style="padding:8px 0;font-weight:600;">${displayName}</td></tr>
    <tr><td style="padding:8px 0;color:#6B7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${body.userEmail}" style="color:#8B5CF6;">${body.userEmail}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6B7280;">Intention</td><td style="padding:8px 0;">${INTENTION_LABELS[body.intention] || body.intention}</td></tr>
    <tr><td style="padding:8px 0;color:#6B7280;">Sujet</td><td style="padding:8px 0;">${SUJET_LABELS[body.sujet] || body.sujet}</td></tr>
    ${body.format === "video" ? `<tr><td style="padding:8px 0;color:#6B7280;">Vidéos</td><td style="padding:8px 0;">${body.videoCount} fichier(s)</td></tr>` : `<tr><td style="padding:8px 0;color:#6B7280;">Longueur</td><td style="padding:8px 0;">${body.wordCount} mots</td></tr>`}
    <tr><td style="padding:8px 0;color:#6B7280;">Firebase UID</td><td style="padding:8px 0;font-family:monospace;font-size:12px;">${body.userId}</td></tr>
  </table>

  ${
    body.format === "video" && body.videoUrls.length > 0
      ? `
  <div style="padding:20px;background:#F9FAFB;border:1px solid #E5E7EB;margin:16px 0;">
    <p style="margin:0 0 12px;font-weight:700;font-size:14px;">📥 Télécharger les vidéos :</p>
    <ul style="margin:0;padding-left:20px;font-size:14px;line-height:2;">
      ${videoLinksHtml}
    </ul>
    <p style="margin:12px 0 0;font-size:12px;color:#9CA3AF;">Ces liens expirent si les fichiers sont supprimés de Firebase Storage.</p>
  </div>`
      : ""
  }

  <div style="margin:24px 0;padding:16px;background:#FEF3C7;border:1px solid #FDE68A;font-size:13px;color:#92400E;">
    ⏳ <strong>Rappel :</strong> les vidéos seront automatiquement supprimées de Firebase Storage après 7 jours.
    Télécharge-les avant.
  </div>

  <p style="font-size:12px;color:#9CA3AF;margin-top:32px;">
    Envoyé automatiquement par Origines Media — Espace témoignages
  </p>
</div>`;

  if (!brevoKey) {
    console.log("[notify] BREVO_API_KEY missing — logging instead:");
    console.log(subject);
    console.log(JSON.stringify(body, null, 2));
    return res.status(200).json({ sent: false, reason: "no_brevo_key" });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": brevoKey,
      },
      body: JSON.stringify({
        sender: { name: "Origines Media", email: "noreply@origines.media" },
        to: [{ email: notifyEmail, name: "Rédaction Origines" }],
        subject,
        htmlContent,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ sent: true });
    }

    const err = await response.text();
    console.error("[notify] Brevo error:", response.status, err);
    return res.status(200).json({ sent: false, reason: "brevo_error" });
  } catch (err) {
    console.error("[notify] Failed to send:", err);
    return res.status(200).json({ sent: false, reason: "network_error" });
  }
}
