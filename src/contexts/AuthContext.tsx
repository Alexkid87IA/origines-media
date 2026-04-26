import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const isMobile = typeof navigator !== "undefined"
  ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  : false;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;

    getFirebaseAuth().then(async (auth) => {
      if (cancelled) return;
      if (!auth) {
        setLoading(false);
        return;
      }
      const { onAuthStateChanged, getRedirectResult } = await import("firebase/auth");
      getRedirectResult(auth).catch(() => {});
      unsub = onAuthStateChanged(auth, (u) => {
        if (!cancelled) {
          setUser(u);
          setLoading(false);
        }
      });
    });

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  async function signup(email: string, password: string, displayName: string) {
    const auth = await getFirebaseAuth();
    if (!auth) return;
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName });
  }

  async function login(email: string, password: string) {
    const auth = await getFirebaseAuth();
    if (!auth) return;
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const auth = await getFirebaseAuth();
    if (!auth) return;
    const { signInWithPopup, signInWithRedirect, GoogleAuthProvider } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    if (isMobile) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
  }

  async function logout() {
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
