import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedList } from "@/hooks/useSavedList";
import LoginModal from "@/components/LoginModal/LoginModal";

interface SaveBookmarkProps {
  type: "article" | "video" | "recommandation";
  slug: string;
  title: string;
  image?: string;
  univers?: string;
  inline?: boolean;
}

export default function SaveBookmark({ type, slug, title, image, univers, inline }: SaveBookmarkProps) {
  const { user } = useAuth();
  const { save, remove, isSaved } = useSavedList();
  const saved = isSaved(type, slug);
  const [showLogin, setShowLogin] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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

  if (inline) {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          aria-label={saved ? "Retirer de la liste" : "Sauvegarder"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            background: "none",
            border: "none",
            cursor: "pointer",
            marginLeft: "auto",
            flexShrink: 0,
            padding: 0,
            color: "inherit",
            opacity: saved ? 1 : 0.6,
            transition: "opacity 0.2s",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5 5h14v16l-7-4-7 4V5z" />
          </svg>
        </button>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={saved ? "Retirer de la liste" : "Sauvegarder"}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: saved ? "var(--ink)" : "rgba(255,255,255,0.9)",
          border: "none",
          cursor: "pointer",
          zIndex: 2,
          transition: "background 0.2s",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={saved ? "#fff" : "none"}
          stroke={saved ? "#fff" : "var(--ink)"}
          strokeWidth="1.5"
        >
          <path d="M5 5h14v16l-7-4-7 4V5z" />
        </svg>
      </button>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
