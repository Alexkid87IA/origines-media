import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { keepFrenchPunctuation } from "@/lib/homeUtils";
import type { FormatDoor } from "@/data/formatDoors";
import s from "./EntranceSection.module.css";

export default function EntranceSection({ doors }: { doors: FormatDoor[] }) {
  return (
    <section className={s.entranceSection} aria-labelledby="formats-title">
      <header className={s.entranceHeader}>
        <div>
          <span className={s.eyebrow}>Portes d'entree</span>
          <h2 id="formats-title" className={s.entranceTitle}>Trouvez le bon format pour commencer</h2>
          <p className={s.entranceIntro}>
            Lire, regarder, pratiquer, s'equiper ou raconter : chaque porte ouvre une experience differente d'Origines.
          </p>
        </div>
        <Button as="link" to="/media" variant="outline" size="sm" color="#0A0A0A" withArrow>
          Voir la galaxie
        </Button>
      </header>
      <div className={s.entranceGrid}>
        {doors.map((entry, index) => {
          const Icon = entry.Icon;
          const isFeature = index === 0;

          return (
            <Card
              key={entry.id}
              href={entry.href}
              variant="outlined"
              size="sm"
              className={`${s.entranceCard} ${isFeature ? s.entranceCardFeature : ""}`}
              style={{ "--accent": entry.accent } as CSSProperties}
            >
              <span className={s.entranceMedia} aria-hidden="true">
                <img src={entry.image} alt="" />
                <span className={s.entranceIcon}><Icon aria-hidden="true" /></span>
              </span>
              <span className={s.entranceCardBody}>
                <span className={s.entranceMeta}>
                  {entry.stats.slice(0, 2).map((stat) => (
                    <span key={stat}>{stat}</span>
                  ))}
                </span>
                <span className={s.entranceLabel}>Origines {entry.eyebrow}</span>
                <span className={s.entranceCardTitle}>{keepFrenchPunctuation(entry.title)}</span>
                <span className={s.entranceCardText}>{entry.body}</span>
                <span className={s.entrancePoints}>
                  {entry.points.map((point) => (
                    <span key={point}>{point}</span>
                  ))}
                </span>
                <span className={s.entranceCta}>
                  {entry.action}
                  <ArrowRight aria-hidden="true" />
                </span>
              </span>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
