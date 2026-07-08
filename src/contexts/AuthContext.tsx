import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

// Firebase (~500 KB) n'est chargé au démarrage que si une session est connue
// (hint localStorage). Sinon l'init n'a lieu qu'à la première action d'auth.
const AUTH_HINT_KEY = "origines-auth-hint";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<"popup" | "redirect" | void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function shouldUseRedirectForGoogleAuth() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent || "";
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isIPadDesktopMode = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;
  const hasCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const isNarrowViewport = window.innerWidth < 768;

  return isMobileUserAgent || isIPadDesktopMode || (hasCoarsePointer && isNarrowViewport);
}

function shouldFallbackToRedirect(error: unknown) {
  const code = typeof error === "object" && error && "code" in error
    ? String((error as { code?: string }).code)
    : "";

  return [
    "auth/popup-blocked",
    "auth/cancelled-popup-request",
    "auth/operation-not-supported-in-this-environment",
    "auth/web-storage-unsupported",
  ].includes(code);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const listenerStarted = useRef(false);
  const cancelledRef = useRef(false);
  const unsubRef = useRef<(() => void) | undefined>(undefined);

  const startListener = useCallback(async () => {
    if (listenerStarted.current) return;
    listenerStarted.current = true;
    const auth = await getFirebaseAuth();
    if (cancelledRef.current) return;
    if (!auth) {
      setLoading(false);
      return;
    }
    const { onAuthStateChanged, getRedirectResult } = await import("firebase/auth");
    getRedirectResult(auth).catch(() => {});
    unsubRef.current = onAuthStateChanged(auth, (u) => {
      if (cancelledRef.current) return;
      try {
        if (u) localStorage.setItem(AUTH_HINT_KEY, "1");
        else localStorage.removeItem(AUTH_HINT_KEY);
      } catch { /* stockage indisponible */ }
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    let hasSession = false;
    try {
      hasSession = localStorage.getItem(AUTH_HINT_KEY) === "1";
    } catch { /* stockage indisponible */ }

    if (hasSession) {
      startListener();
    } else {
      setLoading(false);
      // Migration : sessions créées avant le hint (Firebase persiste dans IndexedDB)
      try {
        indexedDB.databases?.()
          .then((dbs) => {
            if (dbs?.some((d) => d.name === "firebaseLocalStorageDb")) startListener();
          })
          .catch(() => {});
      } catch { /* indexedDB.databases non supporté */ }
    }

    return () => {
      cancelledRef.current = true;
      unsubRef.current?.();
    };
  }, [startListener]);

  async function signup(email: string, password: string, displayName: string) {
    await startListener();
    const auth = await getFirebaseAuth();
    if (!auth) return;
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName });
  }

  async function login(email: string, password: string) {
    await startListener();
    const auth = await getFirebaseAuth();
    if (!auth) return;
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    await startListener();
    const auth = await getFirebaseAuth();
    if (!auth) return;
    const { signInWithPopup, signInWithRedirect, GoogleAuthProvider } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    if (shouldUseRedirectForGoogleAuth()) {
      // Le hint garantit l'init au retour du redirect (getRedirectResult)
      try { localStorage.setItem(AUTH_HINT_KEY, "1"); } catch { /* stockage indisponible */ }
      await signInWithRedirect(auth, provider);
      return "redirect";
    }

    try {
      await signInWithPopup(auth, provider);
      return "popup";
    } catch (error) {
      if (!shouldFallbackToRedirect(error)) throw error;

      try { localStorage.setItem(AUTH_HINT_KEY, "1"); } catch { /* stockage indisponible */ }
      await signInWithRedirect(auth, provider);
      return "redirect";
    }
  }

  async function logout() {
    try { localStorage.removeItem(AUTH_HINT_KEY); } catch { /* stockage indisponible */ }
    if (!listenerStarted.current) return;
    const auth = await getFirebaseAuth();
    if (!auth) return;
    const { signOut } = await import("firebase/auth");
    await signOut(auth);
  }

  async function resetPassword(email: string) {
    const auth = await getFirebaseAuth();
    if (!auth) return;
    const { sendPasswordResetEmail } = await import("firebase/auth");
    await sendPasswordResetEmail(auth, email);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
