import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedList } from "@/hooks/useSavedList";
import LoginModal from "@/components/LoginModal/LoginModal";

interface SaveButtonProps {
  type: "article" | "video" | "recommandation";
  slug: string;
  title: string;
  image?: string;
  univers?: string;
}

export default function SaveButton({ type, slug, title, image, univers }: SaveButtonProps) {
  const { user } = useAuth();
  const { save, remove, isSaved } = useSavedList();
  const saved = isSaved(type, slug);
  const [showLogin, setShowLogin] = useState(false);

  async function handleClick() {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (saved) {
      await remove(`${type}_${slug}`);
    } else {
      await save({ type, slug, title, image, univers });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "var(--mono)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: saved ? "var(--ink)" : "var(--stone400)",
          background: saved ? "var(--stone50, #F0EDE6)" : "none",
          padding: "8px 14px",
          border: `1px solid ${saved ? "var(--ink)" : "var(--stone100)"}`,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        title={user ? undefined : "Connectez-vous pour sauvegarder"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path d="M5 5h14v16l-7-4-7 4V5z" />
        </svg>
        {saved ? "Sauvegardé" : "Sauvegarder"}
      </button>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
