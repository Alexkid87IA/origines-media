import { useState, useEffect } from "react";
import s from "./Interludes.module.css";

interface Option {
  id: string;
  label: string;
  votes: number;
  color: string;
}

const QUESTION = "Préférez-vous lire le matin ou le soir ?";

const INITIAL_OPTIONS: Option[] = [
  { id: "matin", label: "Le matin, l'esprit frais", votes: 187, color: "#E67839" },
  { id: "soir", label: "Le soir, pour décompresser", votes: 241, color: "#7B5CD6" },
  { id: "les-deux", label: "Les deux, selon l'humeur", votes: 134, color: "#D64C90" },
  { id: "jamais", label: "Je ne lis presque plus", votes: 52, color: "#2E94B5" },
];

const STORAGE_KEY = "origines-daily-poll-vote";

export default function DailyPoll() {
  const [voted, setVoted] = useState<string | null>(null);
  const [options, setOptions] = useState(INITIAL_OPTIONS);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setVoted(saved);
      setAnimate(true);
    }
  }, []);

  const total = options.reduce((sum, o) => sum + o.votes, 0);

  function handleVote(id: string) {
    if (voted) return;
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, votes: o.votes + 1 } : o))
    );
    setVoted(id);
    localStorage.setItem(STORAGE_KEY, id);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true));
    });
  }

  return (
    <div className={s.daily}>
      <div className={s.dailySep} aria-hidden="true" />
      <div className={s.halfHead}>
        <span className={s.halfDot} aria-hidden="true" />
        <span className={s.halfLabel}>La question du jour</span>
      </div>
      <h4 className={s.dailyQ}>{QUESTION}</h4>

      <div className={s.dailyOptions}>
        {options.map((o) => {
          const pct = Math.round((o.votes / (total + (voted && !animate ? 1 : 0))) * 100);
          const isSelected = voted === o.id;

          return voted ? (
            <div
              key={o.id}
              className={`${s.dailyResult} ${isSelected ? s.dailyResultSelected : ""}`}
              style={{ "--poll-color": o.color } as React.CSSProperties}
            >
              <div className={s.dailyResultBar}>
                <div
                  className={s.dailyResultFill}
                  style={{ width: animate ? `${pct}%` : "0%", background: `color-mix(in srgb, ${o.color} 15%, transparent)` }}
                />
              </div>
              <span className={s.dailyResultLabel}>
                {isSelected && (
                  <svg className={s.dailyCheck} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ color: o.color }}>
                    <path d="M3 8.5l3.5 3.5L13 4" />
                  </svg>
                )}
                {o.label}
              </span>
              <span className={s.dailyResultPct} style={{ color: o.color }}>{pct}%</span>
            </div>
          ) : (
            <button
              key={o.id}
              type="button"
              className={s.dailyBtn}
              onClick={() => handleVote(o.id)}
              style={{ "--btn-color": o.color } as React.CSSProperties}
            >
              <span className={s.dailyBtnDot} style={{ borderColor: o.color }} aria-hidden="true" />
              {o.label}
            </button>
          );
        })}
      </div>

      {voted && (
        <span className={s.dailyTotal}>
          {(total).toLocaleString("fr-FR")} votes
        </span>
      )}
    </div>
  );
}
