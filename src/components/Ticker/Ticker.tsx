import { useParisClock } from "@/hooks/useParisClock";
import styles from "./Ticker.module.css";

const TICKER_MESSAGES = [
  "Des recits qui ont du sens",
  "Psychologie · Societe · Famille",
  "Long-format · Videos · Series",
  "Media editorial independant",
];

export default function Ticker() {
  const time = useParisClock();

  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);
  const label = now.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.tickerBar}>
      <div className="v2-container">
        <div className={`${styles.row} mono`}>
          <span>
            <span className={styles.dot} />
            En direct &mdash; <span>{time}</span> Paris
          </span>

          <div className={styles.tickerCenter}>
            <div className={styles.tickerScroll}>
              {[...TICKER_MESSAGES, ...TICKER_MESSAGES].map((msg, i) => (
                <span key={i}>{msg}</span>
              ))}
            </div>
          </div>

          <span className={styles.tickerEdition}>
            Edition du <time dateTime={isoDate}>{label}</time>
          </span>
        </div>
      </div>
    </div>
  );
}
