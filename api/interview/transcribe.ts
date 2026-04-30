import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAuth } from "../_lib/verifyAuth.js";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

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
    console.error("OPENAI_API_KEY not configured");
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  const { audio, mimeType } = req.body as { audio?: string; mimeType?: string };
  if (!audio) {
    console.error("No audio data in request body");
    return res.status(400).json({ error: "No audio data provided" });
  }

  console.log(`Transcribe request: audio length=${audio.length}, mimeType=${mimeType || "unknown"}`);

  try {
    const base64Data = audio.includes(",") ? audio.split(",")[1] : audio;
    const buffer = Buffer.from(base64Data, "base64");
    console.log(`Buffer size: ${buffer.length} bytes`);

    const isMp4 = (mimeType || "").includes("mp4");
    const isAudio = (mimeType || "").startsWith("audio/");
    const ext = isMp4 ? "mp4" : "webm";
    const contentType = isAudio
      ? (isMp4 ? "audio/mp4" : "audio/webm")
      : (isMp4 ? "video/mp4" : "video/webm");

    const formData = new FormData();
    const blob = new Blob([buffer], { type: contentType });
    formData.append("file", blob, `recording.${ext}`);
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
      console.error("Whisper API error:", whisperRes.status, errText);
      return res.status(502).json({ error: "Transcription failed", detail: errText });
    }

    const text = await whisperRes.text();
    console.log(`Transcription result: "${text.trim().slice(0, 100)}..."`);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ text: text.trim() });
  } catch (err) {
    console.error("Transcribe error:", err);
    return res.status(500).json({ error: "Transcription failed" });
  }
}
