import { useState, useEffect, useCallback } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export interface SavedItem {
  id: string;
  type: "article" | "video" | "recommandation";
  title: string;
  slug: string;
  image?: string;
  univers?: string;
  savedAt: any;
}

export function useSavedList() {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    const col = collection(db, "users", user.uid, "savedItems");
    const unsub = onSnapshot(col, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedItem));
      list.sort((a, b) => (b.savedAt?.seconds ?? 0) - (a.savedAt?.seconds ?? 0));
      setItems(list);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const save = useCallback(
    async (item: Omit<SavedItem, "id" | "savedAt">) => {
      if (!user) return;
      const ref = doc(db, "users", user.uid, "savedItems", `${item.type}_${item.slug}`);
      await setDoc(ref, { ...item, savedAt: serverTimestamp() });
    },
    [user]
  );

  const remove = useCallback(
    async (itemId: string) => {
      if (!user) return;
      const ref = doc(db, "users", user.uid, "savedItems", itemId);
      await deleteDoc(ref);
    },
    [user]
  );

  const isSaved = useCallback(
    (type: string, slug: string) => items.some((i) => i.id === `${type}_${slug}`),
    [items]
  );

  return { items, loading, save, remove, isSaved };
}
