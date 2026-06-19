import Button from "@/components/ui/Button";
import s from "./BrandBridge.module.css";

export default function BrandBridge() {
  return (
    <section className={s.brandBridge} aria-label="Découvrir Origines">
      <img className={s.brandBridgeLogo} src="/logos/logo-white.webp" alt="" aria-hidden="true" />
      <div className={s.brandBridgeText}>
        <span className={s.brandBridgeKicker}>La marque</span>
        <h2>Comprendre la ligne Origines.</h2>
        <p>
          Notre manière de choisir les sujets, de relier les univers et de construire un média qui aide à penser, ressentir et avancer.
        </p>
        <Button as="link" to="/marque" variant="gradient" size="md" withArrow className={s.brandBridgeCta}>
          Découvrir la marque
        </Button>
      </div>
      <div className={s.brandBridgeMarks} aria-label="Repères de marque">
        <span>Manifeste</span>
        <span>Univers</span>
        <span>Méthode</span>
      </div>
    </section>
  );
}
