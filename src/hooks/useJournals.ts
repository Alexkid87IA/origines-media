import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  prompt?: string;
  mood?: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export function useJournals() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) {
      setEntries([]);
      setLoading(false);
      return;
    }
    const col = collection(db, "users", user.uid, "journals");
    const unsub = onSnapshot(col, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as JournalEntry));
      list.sort((a, b) => b.date.localeCompare(a.date));
      setEntries(list);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const saveEntry = useCallback(
    async (date: string, content: string, prompt?: string, mood?: string) => {
      if (!user || !db) return;
      const ref = doc(db, "users", user.uid, "journals", date);
      await setDoc(ref, {
        date,
        content,
        prompt: prompt || null,
        mood: mood || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    },
    [user]
  );

  const deleteEntry = useCallback(
    async (date: string) => {
      if (!user || !db) return;
      await deleteDoc(doc(db, "users", user.uid, "journals", date));
    },
    [user]
  );

  return { entries, loading, saveEntry, deleteEntry };
}
