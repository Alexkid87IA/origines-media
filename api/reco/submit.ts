import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { verifyAuth } from "../_lib/verifyAuth.js";

interface RecoItem {
  titre: string;
  description: string;
  imageUrl: string;
  lien: string;
  auteurItem: string;
  annee: string;
  note: number;
}

interface SubmitBody {
  type: string;
  titre: string;
  accroche: string;
  items: RecoItem[];
  userId: string;
  userEmail: string;
  userName: string;
}

const VALID_TYPES = [
  "livres", "films-series", "musique", "podcasts", "youtube",
  "reseaux-sociaux", "activite", "destination", "culture", "produit",
];

function getApp() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT not configured");
  const sa = JSON.parse(raw);
  return initializeApp({ credential: cert(sa) });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as SubmitBody;

  if (!body.type || !VALID_TYPES.includes(body.type)) {
    return res.status(400).json({ error: "Invalid type" });
  }
  if (!body.titre || body.titre.trim().length < 5) {
    return res.status(400).json({ error: "Title too short" });
  }
  if (!body.items || body.items.length < 1 || body.items.length > 5) {
    return res.status(400).json({ error: "1 to 5 items required" });
  }
  const user = await verifyAuth(req);
  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  if (body.userId && body.userId !== user.uid) {
    return res.status(403).json({ error: "User ID mismatch" });
  }
  body.userId = user.uid;
  body.userEmail = user.email || body.userEmail;

  try {
    getApp();
    const db = getFirestore();

    const doc = {
      type: body.type,
      titre: body.titre.trim().slice(0, 200),
      accroche: (body.accroche || "").trim().slice(0, 500),
      items: body.items.map((item) => ({
        titre: (item.titre || "").trim().slice(0, 200),
        description: (item.description || "").trim().slice(0, 500),
        imageUrl: (item.imageUrl || "").trim(),
        lien: (item.lien || "").trim(),
        auteurItem: (item.auteurItem || "").trim().slice(0, 100),
        annee: (item.annee || "").trim().slice(0, 10),
        note: Math.max(1, Math.min(5, Math.round(item.note || 0))),
      })),
      userId: body.userId,
      userEmail: body.userEmail || "",
      userName: body.userName || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection("reco-submissions").add(doc);

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ success: true, id: ref.id });
  } catch (err) {
    console.error("Reco submit error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
