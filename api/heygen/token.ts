import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAuth } from "../_lib/verifyAuth.js";

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

  const { avatarId } = req.body as { avatarId?: string };
  const resolvedAvatarId = avatarId || process.env.HEYGEN_AVATAR_ID || "";
  const PUBLIC_FALLBACK = "513fd1b7-7ef9-466d-9af2-344e51eeb833";

  async function createToken(id: string) {
    const r = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": apiKey! },
      body: JSON.stringify({ avatar_id: id, mode: "LITE", is_sandbox: false }),
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
