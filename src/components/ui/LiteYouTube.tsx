import { useState, useCallback } from "react";

interface LiteYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
}

export default function LiteYouTube({ videoId, title, className }: LiteYouTubeProps) {
  const [activated, setActivated] = useState(false);
  const activate = useCallback(() => setActivated(true), []);

  if (activated) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={className}
        style={{ width: "100%", height: "100%", border: 0 }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={activate}
      aria-label={`Lire la vidéo : ${title}`}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        border: 0,
        cursor: "pointer",
        background: "#000",
        padding: 0,
      }}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        loading="lazy"
        width={1280}
        height={720}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 68,
          height: 48,
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,.4))",
        }}
        viewBox="0 0 68 48"
      >
        <path
          d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
          fill="red"
        />
        <path d="M45 24L27 14v20" fill="white" />
      </svg>
    </button>
  );
}
