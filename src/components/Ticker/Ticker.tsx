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
            N&deg; 128 &middot; Edition du{" "}
            <time dateTime="2026-04-21">21 avril 2026</time>
          </span>
        </div>
      </div>
    </div>
  );
}
