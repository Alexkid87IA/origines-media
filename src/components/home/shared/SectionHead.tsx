import Button from "@/components/ui/Button";
import s from "./SectionHead.module.css";

export default function SectionHead({
  eyebrow,
  title,
  titleId,
  href,
  action,
}: {
  eyebrow: string;
  title: string;
  titleId?: string;
  href?: string;
  action?: string;
}) {
  return (
    <header className={s.sectionHead}>
      <div>
        <span className={s.eyebrow}>{eyebrow}</span>
        <h2 id={titleId} className={s.sectionTitle}>{title}</h2>
      </div>
      {href && action && (
        <Button as="link" to={href} variant="outline" size="sm" color="#0A0A0A" withArrow>
          {action}
        </Button>
      )}
    </header>
  );
}
