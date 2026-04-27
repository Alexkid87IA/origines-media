import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  const { audio } = req.body as { audio?: string };
  if (!audio) {
    return res.status(400).json({ error: "No audio data provided" });
  }

  try {
    const base64Data = audio.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const formData = new FormData();
    const blob = new Blob([buffer], { type: "audio/webm" });
    formData.append("file", blob, "audio.webm");
    formData.append("model", "whisper-1");
    formData.append("language", "fr");
    formData.append("response_format", "text");

    const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!whisperRes.ok) {
      const errText = await whisperRes.text();
      console.error("Whisper API error:", errText);
      return res.status(502).json({ error: "Transcription failed" });
    }

    const text = await whisperRes.text();
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ text: text.trim() });
  } catch (err) {
    console.error("Transcribe error:", err);
    return res.status(500).json({ error: "Transcription failed" });
  }
}
