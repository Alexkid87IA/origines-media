import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let initPromise: Promise<void> | null = null;

async function initFirebase() {
  if (app) return;
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) return;

  const { initializeApp } = await import("firebase/app");
  const { getAuth } = await import("firebase/auth");
  const { getFirestore } = await import("firebase/firestore");

  const firebaseConfig = {
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export async function getFirebaseAuth(): Promise<Auth | null> {
  if (!initPromise) initPromise = initFirebase();
  await initPromise;
  return auth;
}

export async function getFirebaseDb(): Promise<Firestore | null> {
  if (!initPromise) initPromise = initFirebase();
  await initPromise;
  return db;
}
