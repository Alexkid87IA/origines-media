import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as admin from "firebase-admin";

const PURGE_AFTER_DAYS = 7;

function getApp(): admin.app.App {
  if (admin.apps.length > 0) return admin.apps[0]!;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT not configured");
  }

  return admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "origines-b5dcb.firebasestorage.app",
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel crons send GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const app = getApp();
    const db = admin.firestore(app);
    const bucket = admin.storage(app).bucket();

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - PURGE_AFTER_DAYS);

    const snapshot = await db
      .collection("temoignages-soumissions")
      .where("createdAt", "<=", cutoff)
      .where("videosPurged", "!=", true)
      .limit(50)
      .get();

    let purgedCount = 0;
    let errorCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const videoUrls: string[] = data.videoUrls || [];

      if (videoUrls.length === 0) {
        await doc.ref.update({ videosPurged: true });
        continue;
      }

      const userId = data.userId;
      if (!userId) {
        await doc.ref.update({ videosPurged: true });
        continue;
      }

      try {
        const [files] = await bucket.getFiles({
          prefix: `temoignages-videos/${userId}/`,
        });

        for (const file of files) {
          try {
            await file.delete();
          } catch (err) {
            console.error(`[cleanup] Failed to delete ${file.name}:`, err);
            errorCount++;
          }
        }

        await doc.ref.update({
          videosPurged: true,
          videosPurgedAt: admin.firestore.FieldValue.serverTimestamp(),
          videoPurgedFiles: files.map((f) => f.name),
        });
        purgedCount++;
      } catch (err) {
        console.error(`[cleanup] Error processing doc ${doc.id}:`, err);
        errorCount++;
      }
    }

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      processed: snapshot.size,
      purged: purgedCount,
      errors: errorCount,
      cutoffDate: cutoff.toISOString(),
    });
  } catch (err) {
    console.error("[cleanup] Fatal error:", err);
    return res.status(500).json({ error: "Cleanup failed" });
  }
}
