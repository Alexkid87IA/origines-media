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

  try {
    const response = await fetch("https://api.liveavatar.com/v1/sessions/new_access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        avatar_id: resolvedAvatarId,
        mode: "LITE",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("LiveAvatar token error:", response.status, errText);
      return res.status(502).json({ error: "Failed to create session token", detail: errText });
    }

    const data = await response.json();
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      accessToken: data.access_token || data.data?.access_token,
      avatarId: resolvedAvatarId,
    });
  } catch (err) {
    console.error("HeyGen token error:", err);
    return res.status(500).json({ error: "Failed to create session" });
  }
}
