import s from "./Edito.module.css";

export default function Edito() {
  return (
    <section className={s.edito} aria-label="Manifeste">
      <div className={s.grid}>
        <div className={s.text}>
          <p className={s.kicker}>Depuis 2024</p>
          <h2 className={s.statement}>
            Origines explore ce qui nous construit&nbsp;:
            <em> les &eacute;motions qu&rsquo;on tait, les liens qu&rsquo;on porte,
            les choix qui nous transforment.</em>
          </h2>
          <p className={s.coda}>
            Psychologie, bien-&ecirc;tre, relations, culture, avenir &mdash;
            cinq territoires, une m&ecirc;me question&nbsp;: <strong>d&rsquo;o&ugrave; vient-on, et vers quoi&nbsp;?</strong>
          </p>
        </div>
        <div className={s.visual}>
          <div className={s.imageWrap}>
            <img
              src="/images/mosaic-origines.png"
              alt="Mosaïque de visages — Origines Media"
              className={s.image}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
